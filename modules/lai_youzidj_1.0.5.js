// v1.0.5：AVDB 样式详情：分类小卡片 genreItems + 点按路由（D 组，只做分类）
// v1.0.3（2026-11-16）：修“播放解析不出地址”。根因两条：① loadDetail 用
//   String(link)，App 传卡片对象时得 "[object Object]"，拼成垃圾剧链接，
//   fetchDrama 拉不到剧集 → “剧集拉取失败” → loadResource 拿垃圾链接回 []；
//   ② 站方新增年龄确认门：playback 须带 eden_age_v2 cookie，否则 403
//   “请先完成网站入口的年龄确认”（VM 实测：无年龄 cookie 时 bootstrap 200
//   但 playback 403；POST /age-check（decision=accepted，带 Referer+Origin）
//   303 下发 eden_age_v2 后 playback 200 回 MP4 直链）。修法：loadDetail 改
//   unwrapLink；新增 ensureAge（POST /age-check 取 eden_age_v2，模块内缓存
//   12 小时），resolveEpisode 在 playback 前先过门、Cookie 三件套同发，
//   403 年龄确认时重过门再试一次；loadResource 单集/整剧解不出时给网页播放行，永不回 []。
// 柚子短剧 for REX (lai_youzidj v1.0.2)
// v1.0.2（2026-11-15）：根因——loadDetail 回 type "url" 且无 seasons/
//   episodeItems，只有 episodes 名单，详情页渲染不出可点播入口，用户看是
//   "加载不出内容"（harness 复现：episodes 24 集全有，但无集可点）。
//   修法：详情回 type "detail" + seasons + episodeItems；集为懒入口
//   （无 videoUrl 键），点播走 loadResource 现解（bootstrap + playback
//   API + 变体展开，playerType "app" 走 App 共享 Cookie  jar）。
//   注：未在详情时逐集解地址——每集需取集页 + playback POST，20+ 集
//   详情时全解必超时；且 master/分片必须同带 eden Cookie，系统播放器
//   不转发 customHeaders 到分片请求，直出必死，故仍走 loadResource 的
//   "app" 行；loadResource 全部 try/catch、永不抛错。
// 来源蓝图: mira-cat 蜘蛛 py_youzidj (只读移植)
// 后端: https://youzidj.com (AI 成人短剧, SSR 站)
// 列表: article.drama-card 卡片, 分页 {base}/page/{n}/; 搜索 /search/?q= (站方无分页)
// 详情: 剧集页 JSON-LD (TVSeason) 取剧名/简介/封面/剧集列表
// 播放 (stream 模块 loadResource 实时解析):
//   集页面 data-video={videoId} -> POST /api/account/bootstrap 建访客账户 (Set-Cookie eden_account, 模块内缓存)
//   -> POST /api/playback/{videoId}?mode=native -> {url: master.m3u8} + Set-Cookie eden_play_{videoId}
//   m3u8/分片必须同带两个 Cookie, 故写入资源 customHeaders。
//   付费集 (data-price>0 或接口 402) 站方走解锁制, REX 无嗅探通道, 返回空并在报告注明。

WidgetMetadata = {
  id: "lai_youzidj",
  title: "柚子短剧",
  description: "柚子短剧（youzidj.com）：全部短剧、题材（修仙/豪门/都市/古装等）、标签（情感/御姐/逆袭等），站内搜索，多集短剧",
  author: "lai",
  version: "1.0.5",
  requiredVersion: "0.0.1",
  site: "https://youzidj.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "全部短剧",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "all" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "题材",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "cat",
          title: "题材",
          type: "enumeration",
          value: "g_cultivation",
          enumOptions: [
            { title: "修仙", value: "g_cultivation" },
            { title: "豪门", value: "g_wealthy-family" },
            { title: "都市", value: "g_urban" },
            { title: "古装", value: "g_costume" },
            { title: "家庭伦理", value: "g_family-ethics" },
            { title: "武侠", value: "g_martial-arts" },
            { title: "校园", value: "g_campus" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "标签",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "cat",
          title: "标签",
          type: "enumeration",
          value: "t_romance",
          enumOptions: [
            { title: "情感", value: "t_romance" },
            { title: "御姐", value: "t_yu-jie" },
            { title: "逆袭", value: "t_ni-xi" },
            { title: "调教", value: "t_tiao-jiao" },
            { title: "熟女", value: "t_shu-nu" },
            { title: "人妻", value: "t_ren-qi" },
            { title: "后宫", value: "t_hou-gong" },
            { title: "偷情", value: "t_tou-qing" },
            { title: "奇幻", value: "t_qi-huan" },
            { title: "系统", value: "t_xi-tong" },
            { title: "女仆", value: "t_nu-pu" },
            { title: "萝莉", value: "t_luo-li" },
            { title: "绿帽", value: "t_lu-mao" },
            { title: "悬疑", value: "t_xuan-yi" },
            { title: "母子", value: "t_mu-zi" },
            { title: "教师", value: "t_jiao-shi" },
            { title: "末日", value: "t_apocalypse" },
            { title: "重生", value: "t_chong-sheng" },
            { title: "穿越", value: "t_chuan-yue" },
            { title: "父女", value: "t_fu-nu" },
            { title: "姐弟", value: "t_jie-di" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "搜索",
      functionName: "search",
      cacheDuration: 60,
      params: [
        { name: "keyword", title: "关键词", type: "input", value: "" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      id: "loadResource",
      title: "柚子播放源",
      description: "播放时实时解析播放地址",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 0,
      params: []
    }
  ],
  search: {
    title: "搜索",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

var SITE = "https://youzidj.com";
var PLAY_WORKER = "https://youzidj-fetch.li768435813.workers.dev";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = SITE + "/";
// v1.0.1（2026-11-09，分辨率选择）：resolveEpisode 只返 master 单地址 →
//   resolveEpisodeVariants 取到 master 后再拉清单正文解析 #EXT-X-STREAM-INF
//   全部变体（同带 Cookie headers），loadResource 每档一行返回；解析失败
//   回落 master 本身单行。loadDetail 仍为集 token（点集后出多档行）。

var GENRES = [
  { slug: "cultivation", name: "修仙" },
  { slug: "wealthy-family", name: "豪门" },
  { slug: "urban", name: "都市" },
  { slug: "costume", name: "古装" },
  { slug: "family-ethics", name: "家庭伦理" },
  { slug: "martial-arts", name: "武侠" },
  { slug: "campus", name: "校园" }
];

var TAGS = [
  { slug: "romance", name: "情感" },
  { slug: "yu-jie", name: "御姐" },
  { slug: "ni-xi", name: "逆袭" },
  { slug: "tiao-jiao", name: "调教" },
  { slug: "shu-nu", name: "熟女" },
  { slug: "ren-qi", name: "人妻" },
  { slug: "hou-gong", name: "后宫" },
  { slug: "tou-qing", name: "偷情" },
  { slug: "qi-huan", name: "奇幻" },
  { slug: "xi-tong", name: "系统" },
  { slug: "nu-pu", name: "女仆" },
  { slug: "luo-li", name: "萝莉" },
  { slug: "lu-mao", name: "绿帽" },
  { slug: "xuan-yi", name: "悬疑" },
  { slug: "mu-zi", name: "母子" },
  { slug: "jiao-shi", name: "教师" },
  { slug: "apocalypse", name: "末日" },
  { slug: "chong-sheng", name: "重生" },
  { slug: "chuan-yue", name: "穿越" },
  { slug: "fu-nu", name: "父女" },
  { slug: "jie-di", name: "姐弟" }
];

function t(v) {
  return String(v == null ? "" : v).trim();
}

function clean(s) {
  return t(s).replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/\s+/g, " ");
}

function fixUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  return SITE + (u.charAt(0) === "/" ? u : "/" + u);
}

// REX 运行时把集对象直接传给 loadResource，String(对象) 得 "[object Object]"，
// 入口先从对象/字符串/数组里解包出链接字符串。
function unwrapLink(v) {
  var depth = 0;
  while (v != null && depth < 6) {
    if (typeof v === "string") return t(v);
    if (typeof v !== "object") return "";
    if (Array.isArray(v)) { v = v.length ? v[0] : ""; depth++; continue; }
    if (typeof v.link === "string" && v.link) return t(v.link);
    if (typeof v.id === "string" && v.id) return t(v.id);
    if (typeof v.url === "string" && v.url) return t(v.url);
    if (v.item) { v = v.item; depth++; continue; }
    if (v.link) { v = v.link; depth++; continue; }
    if (v.id) { v = v.id; depth++; continue; }
    if (v.url) { v = v.url; depth++; continue; }
    return "";
  }
  return "";
}

// 相对地址按 master 清单地址解析（变体地址多为相对路径）
function resolveAgainst(base, rel) {
  var r = t(rel);
  if (!r) return "";
  if (/^https?:\/\//i.test(r)) return r;
  if (r.indexOf("//") === 0) return "https:" + r;
  var b = String(base || "");
  var cut = b.lastIndexOf("/");
  return (cut > 8 ? b.slice(0, cut + 1) : b + "/") + r;
}

// 从 master 清单正文解析全部变体：按 RESOLUTION 高度降序、同高按 BANDWIDTH 降序；
// 无 RESOLUTION 时按 BANDWIDTH 命名（kbps），无两者时名“自适应”；同地址去重。
// 不是主清单（无 #EXT-X-STREAM-INF）返回 []，调用方回落 master 本身。
function parseMasterVariants(text, masterUrl) {
  var out = [];
  if (!text || text.indexOf("#EXT-X-STREAM-INF") === -1) return out;
  var lines = String(text).split(/\r?\n/);
  var seen = {};
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.indexOf("#EXT-X-STREAM-INF") !== 0) continue;
    var rm = line.match(/RESOLUTION=(\d+)x(\d+)/i);
    var bm = line.match(/BANDWIDTH=(\d+)/i);
    var uri = "";
    for (var j = i + 1; j < lines.length; j++) {
      var tt = lines[j].trim();
      if (tt) { uri = tt; break; }
    }
    if (!uri) continue;
    var url = resolveAgainst(masterUrl, uri);
    if (!url || seen[url]) continue;
    seen[url] = 1;
    var h = rm ? parseInt(rm[2], 10) : 0;
    var bw = bm ? parseInt(bm[1], 10) : 0;
    out.push({ h: h, bw: bw, url: url, name: h > 0 ? (h + "p") : (bw > 0 ? (Math.round(bw / 1000) + "kbps") : "自适应") });
  }
  out.sort(function (a, b) { return (b.h - a.h) || (b.bw - a.bw); });
  return out;
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.7",
    "Referer": referer || REFERER
  };
}

async function fetchText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer), timeout: 20000 });
  return res && res.data != null ? String(res.data) : "";
}

function resStatus(res) {
  if (!res) return 0;
  if (typeof res.status === "number") return res.status;
  if (typeof res.statusCode === "number") return res.statusCode;
  return 0;
}

// 从响应头里收集 Set-Cookie (兼容对象/数组/合并字符串/get() 形态)
function collectSetCookies(res) {
  var out = [];
  if (!res) return out;
  var hdrs = res.headers || res.header || {};
  var raw = null;
  try {
    if (typeof hdrs.get === "function") raw = hdrs.get("set-cookie");
  } catch (e) { /* ignore */ }
  if (raw == null) {
    var keys = Object.keys(hdrs);
    for (var i = 0; i < keys.length; i++) {
      if (String(keys[i]).toLowerCase() === "set-cookie") { raw = hdrs[keys[i]]; break; }
    }
  }
  if (raw == null) return out;
  if (Array.isArray(raw)) {
    for (var j = 0; j < raw.length; j++) out.push(String(raw[j]));
    return out;
  }
  var s = String(raw);
  // 合并字符串按 ", <name>=" 边界拆 (Expires 里的逗号后面是日期数字, 不会误拆)
  var parts = s.split(/,\s*(?=[A-Za-z0-9_\-]+=)/);
  for (var k = 0; k < parts.length; k++) out.push(parts[k]);
  return out;
}

// 从 Set-Cookie 列表里挑 name 前缀匹配的 cookie, 返回 "name=value"
function pickCookiePair(setCookies, namePrefix) {
  for (var i = 0; i < (setCookies || []).length; i++) {
    var line = String(setCookies[i]);
    var m = line.match(new RegExp("^(" + namePrefix + "[^=]*)=([^;]+)"));
    if (m) return m[1] + "=" + m[2];
  }
  return "";
}

// POST JSON 接口 (bootstrap/playback): 返回 { status, data, setCookie[] }
async function postJson(url, referer, cookie) {
  if (!Widget.http || typeof Widget.http.post !== "function") {
    return { status: 0, data: null, setCookie: [] };
  }
  var headers = {
    "User-Agent": UA,
    "Referer": referer || REFERER,
    "Origin": SITE,
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
  if (cookie) headers["Cookie"] = cookie;
  try {
    var res = await Widget.http.post(url, "{}", { headers: headers, timeout: 20000 });
    var data = res && res.data;
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch (e) { data = null; }
    }
    return {
      status: resStatus(res),
      data: data && typeof data === "object" ? data : null,
      setCookie: collectSetCookies(res)
    };
  } catch (e) {
    return { status: 0, data: null, setCookie: [] };
  }
}

// ---------- 访客会话 (eden_account, 模块内缓存 12 小时, 与蜘蛛同策略) ----------
var accountPair = "";
var accountAt = 0;

async function ensureAccount(force) {
  if (!force && accountPair && Date.now() - accountAt < 12 * 3600 * 1000) return accountPair;
  var r = await postJson(SITE + "/api/account/bootstrap", REFERER, "");
  var pair = pickCookiePair(r.setCookie, "eden_account");
  if (r.status === 200 && pair) {
    accountPair = pair;
    accountAt = Date.now();
    return accountPair;
  }
  return accountPair || "";
}

// ---------- 年龄确认 (eden_age_v2，站方入口门) ----------
// 站方 playback 须带年龄确认 cookie，否则 403“请先完成网站入口的年龄确认”。
// 过门 = POST /age-check（decision=accepted，带 Referer + Origin），响应 303
// 并 Set-Cookie eden_age_v2（约 24 小时有效，模块内按 12 小时缓存）。
var agePair = "";
var ageAt = 0;

async function ensureAge(referer, cookie, force) {
  if (!force && agePair && Date.now() - ageAt < 12 * 3600 * 1000) return agePair;
  try {
    if (typeof Widget.http.post !== "function") return agePair || "";
    var headers = {
      "User-Agent": UA,
      "Referer": referer || REFERER,
      "Origin": SITE,
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    };
    if (cookie) headers["Cookie"] = cookie;
    var res = await Widget.http.post(SITE + "/age-check", "decision=accepted", { headers: headers, timeout: 20000 });
    var pair = pickCookiePair(collectSetCookies(res), "eden_age_v2");
    if (pair) {
      agePair = pair;
      ageAt = Date.now();
      return agePair;
    }
  } catch (e) { /* 降级：调用方按无年龄 cookie 继续，403 时再重试 */ }
  return agePair || "";
}

// ---------- 列表 ----------
function parseCards(html) {
  var out = [];
  var seen = {};
  var parts = String(html || "").split('<article class="drama-card');
  for (var i = 1; i < parts.length; i++) {
    var block = parts[i].slice(0, 6000);
    var hm = block.match(/href="(https:\/\/youzidj\.com\/dramas\/[a-z0-9\-]+\/season-\d+\/)"/);
    if (!hm) continue;
    var url = hm[1];
    if (seen[url]) continue;
    seen[url] = 1;
    var title = "";
    var tm = block.match(/drama-card-title"[^>]*title="([^"]+)"/) || block.match(/drama-card-title"[^>]*>([^<]+)</);
    if (tm) title = clean(tm[1]);
    if (!title) {
      var am = block.match(/<img[^>]+alt="([^"]+?)海报"/);
      if (am) title = clean(am[1]);
    }
    var pic = "";
    var pm = block.match(/(\/catalogue-art\/[0-9a-f\-]+-960\.webp)/);
    if (pm) pic = SITE + pm[1];
    var remarks = "";
    var rm = block.match(/home-card-episodes-long">([^<]+)</);
    if (rm) remarks = clean(rm[1]);
    out.push({
      id: url,
      type: "url",
      title: title || url,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: url,
      description: remarks || "",
      mediaType: "tv"
    });
  }
  return out;
}

function catBase(tid) {
  var id = String(tid == null ? "" : tid).trim();
  try { id = decodeURIComponent(id); } catch (e) { /* 保持原样 */ }
  if (!id || id === "all") return SITE + "/dramas/";
  var m = id.match(/^(?:g_|genre:)(.+)$/);
  if (m) return SITE + "/dramas/category/" + m[1] + "/";
  m = id.match(/^(?:t_|tag:)(.+)$/);
  if (m) return SITE + "/tags/" + m[1] + "/";
  for (var i = 0; i < GENRES.length; i++) {
    if (GENRES[i].slug === id || GENRES[i].name === id) return SITE + "/dramas/category/" + GENRES[i].slug + "/";
  }
  for (var j = 0; j < TAGS.length; j++) {
    if (TAGS[j].slug === id || TAGS[j].name === id) return SITE + "/tags/" + TAGS[j].slug + "/";
  }
  return SITE + "/dramas/";
}

async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var base = catBase(params.cat == null ? "all" : params.cat);
  var url = page > 1 ? base + "page/" + page + "/" : base;
  try {
    var html = await fetchText(url);
    if (!html) return [{ id: "err", type: "url", title: "载入失败: 页面为空" }];
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关短剧" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg }];
  }
}

function pickKeyword(params) {
  if (params == null) return "";
  if (typeof params === "string" || typeof params === "number") return String(params).trim();
  var keys = ["keyword", "q", "search", "text", "query", "wd", "key"];
  for (var i = 0; i < keys.length; i++) {
    if (params[keys[i]]) return String(params[keys[i]]).trim();
  }
  return "";
}

async function search(params) {
  params = params || {};
  var wd = pickKeyword(params);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  if (page > 1) return []; // 站方搜索无分页
  try {
    var html = await fetchText(SITE + "/search/?q=" + encodeURIComponent(wd));
    if (!html) return [{ id: "err", type: "url", title: "载入失败: 页面为空" }];
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关短剧" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg }];
  }
}

// ---------- 详情 ----------
function findSeason(ld) {
  if (!ld || typeof ld !== "object") return null;
  if (Array.isArray(ld)) {
    for (var i = 0; i < ld.length; i++) {
      var s = findSeason(ld[i]);
      if (s) return s;
    }
    return null;
  }
  if (Array.isArray(ld.episode)) return ld;
  if (ld["@graph"]) return findSeason(ld["@graph"]);
  return null;
}

// 拉剧集页并解析出 { name, desc, pic, episodes: [{n, label, url}] }
async function fetchDrama(durl) {
  var html = await fetchText(durl);
  if (!html) return null;
  var name = "";
  var desc = "";
  var pic = "";
  var episodes = [];
  var lds = [];
  var lre = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  var lb;
  while ((lb = lre.exec(html)) !== null) lds.push(lb[1]);
  for (var i = 0; i < lds.length; i++) {
    var obj = null;
    try { obj = JSON.parse(lds[i]); } catch (e) { continue; }
    var season = findSeason(obj);
    if (!season) continue;
    name = clean((season.partOfSeries && season.partOfSeries.name) || season.name || "");
    desc = clean(season.description || "");
    pic = fixUrl(season.image || "");
    var eps = season.episode || [];
    for (var j = 0; j < eps.length; j++) {
      var ep = eps[j];
      var eu = fixUrl(ep.url || "");
      if (!eu) continue;
      episodes.push({
        n: parseInt(ep.episodeNumber, 10) || 0,
        label: clean(ep.name || ""),
        url: eu
      });
    }
    if (episodes.length) break;
  }
  if (!episodes.length) {
    // JSON-LD 兜底: 直接扫集链接
    var re = /href="(https:\/\/youzidj\.com\/dramas\/[a-z0-9\-]+\/season-\d+-episode-(\d+)\/)"/g;
    var seen = {};
    var m;
    while ((m = re.exec(html)) !== null) {
      if (seen[m[1]]) continue;
      seen[m[1]] = 1;
      episodes.push({ n: parseInt(m[2], 10) || episodes.length + 1, label: "", url: m[1] });
    }
  }
  if (!name) {
    var tm = html.match(/<title>([^<]+)<\/title>/);
    if (tm) name = clean(tm[1]).replace(/·.*$/, "").trim();
  }
  if (!pic) {
    var om = html.match(/property="og:image"\s+content="([^"]+)"/);
    if (om) pic = fixUrl(om[1]);
  }
  if (!desc) {
    var dm = html.match(/<meta name="description" content="([^"]+)"/);
    if (dm) desc = clean(dm[1]);
  }
  episodes.sort(function (a, b) { return a.n - b.n; });
  var genreItems = [];
  var gseen = {};
  var gre = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var gm;
  while ((gm = gre.exec(html)) !== null) {
    var ghref = gm[1] || "";
    var gname = clean(gm[2] || "").replace(/<[^>]*>/g, "").trim();
    if (!gname || gname.length > 40) continue;
    var gabs = fixUrl(ghref);
    var gslug = "";
    var gkind = "";
    var cm = gabs.match(/\/dramas\/category\/([^/?#]+)\/?/i);
    var tm2 = gabs.match(/\/tags\/([^/?#]+)\/?/i);
    if (cm) { gkind = "g"; gslug = cm[1]; }
    else if (tm2) { gkind = "t"; gslug = tm2[1]; }
    else continue;
    if (gseen[gabs]) continue;
    gseen[gabs] = 1;
    if (gkind === "g") {
      for (var gi2 = 0; gi2 < GENRES.length; gi2++) if (GENRES[gi2].slug === gslug) { gname = GENRES[gi2].name; break; }
    } else {
      for (var ti2 = 0; ti2 < TAGS.length; ti2++) if (TAGS[ti2].slug === gslug) { gname = TAGS[ti2].name; break; }
    }
    genreItems.push({ id: gabs, title: gname });
    if (genreItems.length >= 20) break;
  }
  return { name: name, desc: desc, pic: pic, episodes: episodes, genreItems: genreItems };
}

async function loadDetail(link) {
  var raw = unwrapLink(link);
  try {
    var durl = /^https?:\/\//i.test(raw) ? raw : SITE + "/dramas/" + raw.replace(/^\/+|\/+$/g, "") + "/season-1/";
    // AVDB 样式：点按分类/标签 → 该分类/标签的全部短剧。
    var catM = durl.match(/\/dramas\/category\/([^/?#]+)\/?/i);
    var tagM = durl.match(/\/tags\/([^/?#]+)\/?/i);
    if (catM || tagM) {
      var listCat = catM ? ("g_" + catM[1]) : ("t_" + tagM[1]);
      var listSlug = catM ? catM[1] : tagM[1];
      var listWorks = [];
      try { listWorks = await loadList({ cat: listCat, page: 1 }); } catch (e) { listWorks = []; }
      if (!Array.isArray(listWorks)) listWorks = [];
      var listReal = listWorks.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
      var listTitle = listSlug;
      try { listTitle = decodeURIComponent(listSlug); } catch (_) { listTitle = listSlug; }
      return {
        id: durl,
        type: "detail",
        mediaType: "movie",
        title: listTitle,
        link: durl,
        description: "分类 · 共 " + listReal.length + " 部作品",
        videoUrl: "",
        childItems: [],
        relatedItems: listReal.length ? listReal : listWorks
      };
    }
    var d = await fetchDrama(durl);
    // 拉不到剧集也留一个懒入口（无 videoUrl 键），点播时 loadResource 按剧链接重解
    function lazyRetryDetail(title) {
      var lazyEp0 = {
        id: durl, type: "url", title: "全部剧集", mediaType: "tv",
        posterPath: "", link: durl, episode: 1, episodeNumber: 1,
        seasonIndex: 1, seasonNumber: 1, playerType: "app"
      };
      return {
        id: durl, type: "detail", title: title || "柚子短剧", link: durl,
        posterPath: "", coverUrl: "", backdropPath: "",
        description: "剧集拉取失败，点播重试",
        episodes: [{ name: "全部剧集", link: durl }],
        seasons: [{ seasonNumber: 1, title: "剧集", name: "剧集", episodes: [{ title: "全部剧集", episodeNumber: 1, id: durl, link: durl }] }],
        episodeItems: [lazyEp0], childItems: [lazyEp0]
      };
    }
    if (!d) return lazyRetryDetail("柚子短剧");
    if (!d.episodes.length) return lazyRetryDetail(d.name || durl);
    var episodes = [];
    var epItems = [];
    var seasonEps = [];
    for (var i = 0; i < d.episodes.length; i++) {
      var ep = d.episodes[i];
      var label = ep.label || ("第" + ep.n + "集");
      var num = ep.n || (i + 1);
      episodes.push({ name: label, id: ep.url, link: ep.url });
      seasonEps.push({ title: label, episodeNumber: num, id: ep.url, link: ep.url });
      // 懒入口：不写 videoUrl 键（空串会让 App 视作无可播内容），点播走 loadResource 现解
      epItems.push({
        id: ep.url,
        type: "url",
        title: label,
        mediaType: "tv",
        posterPath: d.pic,
        link: ep.url,
        episode: num,
        episodeNumber: num,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "app",
        customHeaders: { "User-Agent": UA, "Referer": ep.url }
      });
    }
    var ret = {
      id: durl,
      type: "detail",
      title: d.name || durl,
      name: d.name || durl,
      posterUrl: d.pic,
      posterPath: d.pic,
      coverUrl: d.pic,
      backdropPath: d.pic,
      description: d.desc || "",
      episodes: episodes,
      seasons: [{ seasonNumber: 1, title: "剧集", name: "剧集", episodes: seasonEps }],
      episodeItems: epItems,
      childItems: epItems,
      link: durl
    };
    if (d.genreItems && d.genreItems.length) ret.genreItems = d.genreItems;
    return ret;
  } catch (e) {
    // 取页失败也留一个懒入口（无 videoUrl 键），点播时 loadResource 按剧链接重解全部剧集
    var u4 = /^https?:\/\//i.test(raw) ? raw : (raw ? SITE + "/dramas/" + raw.replace(/^\/+|\/+$/g, "") + "/season-1/" : "");
    if (u4) {
      var lazyEp4 = {
        id: u4, type: "url", title: "全部剧集", mediaType: "tv",
        posterPath: "", link: u4, episode: 1, episodeNumber: 1,
        seasonIndex: 1, seasonNumber: 1, playerType: "app"
      };
      return {
        id: u4, type: "detail", title: "柚子短剧", link: u4,
        posterPath: "", coverUrl: "", backdropPath: "",
        description: "请求错误：" + String((e && e.message) || e),
        episodes: [{ name: "全部剧集", link: u4 }],
        seasons: [{ seasonNumber: 1, title: "剧集", name: "剧集", episodes: [{ title: "全部剧集", episodeNumber: 1, id: durl, link: durl }] }],
        episodeItems: [lazyEp4], childItems: [lazyEp4]
      };
    }
    return { id: raw, type: "url", title: "请求错误", description: String((e && e.message) || e), link: raw };
  }
}

// ---------- 播放解析 (stream 模块) ----------
// 解析单集: 成功返回 { url, headers }, 失败返回 null
async function resolveEpisode(epUrl) {
  var html = await fetchText(epUrl, REFERER);
  if (!html) return null;
  var vm = html.match(/data-video="([0-9a-f\-]{36})"/);
  if (!vm) return null; // 集页面拿不到 videoId (结构变更/付费墙)
  var videoId = vm[1];
  var pm = html.match(/data-price="([^"]*)"/);
  var price = pm ? pm[1] : "0";
  if (price !== "0") return null; // 付费集: 站方解锁制, REX 无嗅探通道

  var acct = await ensureAccount(false);
  var age = await ensureAge(epUrl, acct, false);
  var acctAge = [acct, age].filter(Boolean).join("; ");
  var r = await postJson(SITE + "/api/playback/" + videoId + "?mode=native", epUrl, acctAge);
  if (r.status === 401 && acct) {
    acct = await ensureAccount(true);
    acctAge = [acct, age].filter(Boolean).join("; ");
    r = await postJson(SITE + "/api/playback/" + videoId + "?mode=native", epUrl, acctAge);
  }
  // 年龄确认未过（403 + “年龄确认”）：重过一次门再试一次
  if (r.status === 403 && r.data && r.data.error && String(r.data.error).indexOf("年龄") >= 0) {
    age = await ensureAge(epUrl, acct, true);
    acctAge = [acct, age].filter(Boolean).join("; ");
    r = await postJson(SITE + "/api/playback/" + videoId + "?mode=native", epUrl, acctAge);
  }
  if (r.status === 402) return null; // 付费集
  var data = r.data;
  var playPair = pickCookiePair(r.setCookie, "eden_play_");
  if (r.status !== 200 || !data || !data.url || !playPair) return null;
  var cookie = [acct, age, playPair].filter(Boolean).join("; ");
  return {
    url: fixUrl(data.url),
    videoId: videoId,
    epUrl: epUrl,
    headers: {
      "User-Agent": UA,
      "Referer": epUrl,
      "Cookie": cookie
    }
  };
}

// 取播单正文（手动跟 307：站方 native 地址 307 到 master.m3u8；
// Widget.http.get 是否跟随跳转在真机上未定，模块内自己跟一次才稳）。
async function fetchPlaylistText(url, headers) {
  var cur = url;
  for (var hop = 0; hop < 3; hop++) {
    var res = null;
    try {
      res = await Widget.http.get(cur, { headers: headers, timeout: 20000 });
    } catch (e) { return ""; }
    if (!res) return "";
    var st = 0;
    if (typeof res.status === "number") st = res.status;
    else if (typeof res.statusCode === "number") st = res.statusCode;
    var body = res.data != null ? String(res.data) : "";
    if (st >= 300 && st < 400) {
      var loc = "";
      try {
        if (res.headers) {
          if (typeof res.headers.get === "function") loc = res.headers.get("location") || res.headers.get("Location") || "";
          if (!loc) loc = res.headers.location || res.headers.Location || "";
        }
      } catch (e) { loc = ""; }
      if (!loc) return body;
      if (/^https?:\/\//i.test(loc)) cur = loc;
      else if (loc.indexOf("/") === 0) {
        // 绝对路径 Location：按 origin 拼（不能按当前目录拼，会拼出双路径 404）
        var om = String(cur).match(/^(https?:\/\/[^\/]+)/);
        cur = om ? om[1] + loc : loc;
      } else cur = resolveAgainst(cur, loc);
      continue;
    }
    return body;
  }
  return "";
}

// v1.0.1：单集全部档位。先拿 master（resolveEpisode），再拉清单正文解析变体
// （同带 Cookie headers）；解析失败回落 master 本身单行；非 m3u8 直链单行返回。
// v1.0.3 补：站方 native 地址后缀是 .mp4，实际是 HLS 入口（307 到 master.m3u8，
// 单变体 720p），须按正文解析变体，不能按后缀当直链 MP4 交播放器。
// 站方媒体服务不支持 HEAD（直接断连），故不探 HEAD；native-current.mp4
// 固定是播单入口，直接拉取解析。
async function resolveEpisodeVariants(epUrl) {
  var base = await resolveEpisode(epUrl);
  if (!base || !base.url) return [];
  // 直链 /media/ 必须带 Cookie，播放器不转发 header，恒 403。
  // 改走 youzidj-fetch Worker /play.m3u8（服务端过年龄门 + 带 Cookie 取流，
  // 回自适应 master，播放器内仍可选清晰度）。
  if (base.videoId) {
    return [{ name: "播放", url: PLAY_WORKER + "/play.m3u8?videoId=" + base.videoId + "&ep=" + encodeURIComponent(epUrl), headers: { "User-Agent": UA, "Referer": epUrl } }];
  }
  var headers = base.headers || { "User-Agent": UA, "Referer": epUrl };
  if (!/\.m3u8(\?|$)/i.test(base.url) && !/native-current\.mp4/i.test(base.url)) {
    return [{ name: "播放", url: base.url, headers: headers }];
  }
  var text = await fetchPlaylistText(base.url, headers);
  var vars = parseMasterVariants(text, base.url);
  if (!vars.length) return [{ name: "自适应", url: base.url, headers: headers }];
  var out = [];
  for (var i = 0; i < vars.length; i++) out.push({ name: vars[i].name, url: vars[i].url, headers: headers });
  return out;
}

async function loadResource(params) {
  // v1.0.1：入口先 unwrapLink（App 可能把集对象直接传参）。
  var raw = unwrapLink(params);
  if (!raw && params && typeof params === "object") {
    raw = unwrapLink(params.link) || unwrapLink(params.url) || unwrapLink(params.id) || unwrapLink(params.item);
  }
  if (!raw) return [];
  try {
    // 单集链接: 直接解析该集，全部档位每档一行
    if (/-episode-\d+/.test(raw)) {
      var ones = await resolveEpisodeVariants(fixUrl(raw));
      var outOne = [];
      for (var oi = 0; oi < ones.length; oi++) {
        outOne.push({ name: ones[oi].name, url: ones[oi].url, playerType: "app", customHeaders: ones[oi].headers });
      }
      if (outOne.length) return outOne;
      return [{ name: "网页播放", url: fixUrl(raw), playerType: "app", customHeaders: { "User-Agent": UA, "Referer": fixUrl(raw) } }];
    }
    // 剧链接: 拉详情后逐集解析; 连续 3 集失败就停 (与禁果模块同策略)
    var durl = /^https?:\/\//i.test(raw) ? raw : SITE + "/dramas/" + raw.replace(/^\/+|\/+$/g, "") + "/season-1/";
    var d = await fetchDrama(durl);
    if (!d || !d.episodes.length) return [{ name: "网页播放", url: durl, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl } }];
    var out = [];
    var misses = 0;
    for (var i = 0; i < d.episodes.length; i++) {
      var ep = d.episodes[i];
      var epName = ep.label || ("第" + ep.n + "集");
      var got = await resolveEpisodeVariants(ep.url);
      if (!got.length) {
        misses++;
        if (misses >= 3) break;
        continue;
      }
      misses = 0;
      for (var gi = 0; gi < got.length; gi++) {
        out.push({
          name: got.length > 1 ? (epName + " " + got[gi].name) : epName,
          description: d.name || "",
          url: got[gi].url,
          playerType: "app",
          customHeaders: got[gi].headers
        });
      }
    }
    if (!out.length) return [{ name: "网页播放", url: durl, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl } }];
    return out;
  } catch (e) {
    if (raw) return [{ name: "网页播放", url: fixUrl(raw), playerType: "app", customHeaders: { "User-Agent": UA, "Referer": fixUrl(raw) } }];
    return [];
  }
}

// built by REX porter (lai_youzidj)
