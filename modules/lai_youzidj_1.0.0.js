// 柚子短剧 for REX (lai_youzidj v1.0.0)
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
  version: "1.0.0",
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
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = SITE + "/";

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
  return { name: name, desc: desc, pic: pic, episodes: episodes };
}

async function loadDetail(link) {
  var raw = String(link || "");
  try {
    var durl = /^https?:\/\//i.test(raw) ? raw : SITE + "/dramas/" + raw.replace(/^\/+|\/+$/g, "") + "/season-1/";
    var d = await fetchDrama(durl);
    if (!d) return { id: durl, type: "url", title: "加载失败", link: durl };
    var episodes = [];
    for (var i = 0; i < d.episodes.length; i++) {
      var ep = d.episodes[i];
      episodes.push({
        name: ep.label || ("第" + ep.n + "集"),
        id: ep.url,
        link: ep.url
      });
    }
    return {
      id: durl,
      type: "url",
      title: d.name || durl,
      posterUrl: d.pic,
      posterPath: d.pic,
      coverUrl: d.pic,
      backdropPath: d.pic,
      description: d.desc || "",
      episodes: episodes,
      link: durl
    };
  } catch (e) {
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
  var r = await postJson(SITE + "/api/playback/" + videoId + "?mode=native", epUrl, acct);
  if (r.status === 401 && acct) {
    acct = await ensureAccount(true);
    r = await postJson(SITE + "/api/playback/" + videoId + "?mode=native", epUrl, acct);
  }
  if (r.status === 402) return null; // 付费集
  var data = r.data;
  var playPair = pickCookiePair(r.setCookie, "eden_play_");
  if (r.status !== 200 || !data || !data.url || !playPair) return null;
  var cookie = [acct, playPair].filter(Boolean).join("; ");
  return {
    url: fixUrl(data.url),
    headers: {
      "User-Agent": UA,
      "Referer": epUrl,
      "Cookie": cookie
    }
  };
}

async function loadResource(params) {
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  if (typeof raw === "object") raw = raw.link || raw.url || "";
  raw = String(raw || "");
  if (!raw) return [];
  try {
    // 单集链接: 直接解析该集
    if (/-episode-\d+/.test(raw)) {
      var one = await resolveEpisode(fixUrl(raw));
      if (!one) return [];
      return [{ name: "播放", url: one.url, playerType: "app", customHeaders: one.headers }];
    }
    // 剧链接: 拉详情后逐集解析; 连续 3 集失败就停 (与禁果模块同策略)
    var durl = /^https?:\/\//i.test(raw) ? raw : SITE + "/dramas/" + raw.replace(/^\/+|\/+$/g, "") + "/season-1/";
    var d = await fetchDrama(durl);
    if (!d || !d.episodes.length) return [];
    var out = [];
    var misses = 0;
    for (var i = 0; i < d.episodes.length; i++) {
      var ep = d.episodes[i];
      var got = await resolveEpisode(ep.url);
      if (!got) {
        misses++;
        if (misses >= 3) break;
        continue;
      }
      misses = 0;
      out.push({
        name: ep.label || ("第" + ep.n + "集"),
        description: d.name || "",
        url: got.url,
        playerType: "app",
        customHeaders: got.headers
      });
    }
    return out;
  } catch (e) {
    return [];
  }
}

// built by REX porter (lai_youzidj)
