// v1.0.4：按 AVDB 全覆盖派发——补 loadList（App 点演员/分类可能调 loadList 传 peopleId/genreId，之前没有该函数导致点按失效）；演员一律走站内搜索取真作品。
// v1.0.3：演员点按改走站内搜索（/search?q=人名）——实测演员页 /en/actor/<名> 返回混杂内容（他人的片也混进来），搜索返回的才是该演员的真作品。
// v1.0.2：修详情页演员/分类——演员过滤描述词（"21 years old"/"musician" 等非演员项不再出现）；genreItems 补完整可点按链接；backdropPaths 显式给封面（站方详情页无剧照集）。
// v1.0.1：AVDB 样式详情：补 peoples（详情页 actor/ 链接）+ 演员/分类点按路由
// NJAV (www.njav.com) — REX 模块 lai_njav v1.0.0
// 由 rex-njav.js v1.0.2（作者 Merlin）重写：保留已验证能播的形态，只加分辨率分档。
// 源模块 2026-11-14 已实测：helvid 改认 apple 类——铸造与播放全程统一 iPhone UA、
// 播放头去掉 Referer（apple 类签名＋iPhone UA 无 Referer 时清单/分片全 200、TS 魔数正；
// 桌面 UA 一律 403）。v1.0.0 相对源模块的改动只有两点：
//   ① loadDetail 铸造后多取一次 master（iPhone UA、无 Referer），解析其中的
//      #EXT-X-STREAM-INF 变体（NAME 与 RESOLUTION 及下一行变体地址，地址原样用、
//      不重拼），按档位从高到低一档一集（标题就是档位名，如 1080p），每集带 videoUrl；
//      详情顶层 videoUrl 为最高档变体地址；loadResource 同样逻辑（重新铸造、重新解析）。
//   ② 详情回 seasons + episodeItems（每集带 videoUrl），不再只靠 childItems；
//      入口补 unwrapLink（运行时传卡片对象时也能取到 link）。
// master 取不到或 0 变体时回落到源模块行为：单条“正片”线用 master 地址，
// alternate720 有值时再加一条“720P”线。档位按片实际有：实测 1080p+720p+480p、
// 1080p+720p+480p+360p、720p 单档，绝不编造档位。
// 站点形态（2026-11-16 实测）：内容在 /en/ 路径下（无 /en/ 的归档 404）；列表卡
// box-item（xvideos/<番号slug>、javcdn 缩略图、detail 真标题＋duration 时长），上游每页只回
// 12 条、?page=N 翻页，站方称 53 万部——模块内按窗口攒满 20 条再切页（短页会被
// 客户端判作尾页）。封面有两档：resize/ 330px 与 images/ 800px，本模块用
// images/ 大图（把 thumb 地址里的 /resize/ 换成 /images/）。
// 播放链（实测全通到签名）：详情 /en/xvideos/<slug> → 点播页 /vv/<slug> 里
// clink() 的 /jm/<base64> → 302 upload18.com/play/index/<slug> → upload18.org
// 播放页 window.PLAYER_CONFIG 里的 m3u8 字段＝helvid.com 签名 HLS（约 2h 过期，
// 模块现铸现用、钉存 100 分钟），另有 alternate720 时作第二条线。
// 已知边界：helvid 按签名里的设备类别（d=）验 UA 类别，铸播必须同类别同出口；
// 沙箱已按 apple 类配方验通全链，最终仍以真机为准。

WidgetMetadata = {
  id: "lai_njav",
  title: "NJAV",
  version: "1.0.4",
  requiredVersion: "0.0.1",
  author: "lai",
  site: "https://www.njav.com",
  description: "njav.com：JAV 在线，栏目/厂牌/题材齐全，helvid 签名 HLS 播放，详情解析播单按真实档位分集（1080p/720p/480p/360p）",
  detailCacheDuration: 60,
  globalParams: [],
  modules: [
    { id: "loadLatest", title: "最新更新", functionName: "loadLatest", type: "video", cacheDuration: 120, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "loadRelease", title: "新片发布", functionName: "loadRelease", type: "video", cacheDuration: 120, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "loadCat", title: "栏目", functionName: "loadCat", type: "video", cacheDuration: 120, params: [{ name: "page", title: "页码", type: "page" }, { name: "cat", title: "栏目", type: "enumeration", value: "censored", enumOptions: [{ title: "有码", value: "censored" }, { title: "无码", value: "uncensored" }, { title: "无码流出", value: "uncensored-leaked" }, { title: "素人", value: "amateur" }, { title: "国产AV", value: "chinese-av" }, { title: "国产直播", value: "chinese-live" }, { title: "韩国直播", value: "korean-live" }, { title: "英文字幕", value: "english-subtitle" }] }] },
    { id: "loadTag", title: "厂牌", functionName: "loadTag", type: "video", cacheDuration: 120, params: [{ name: "page", title: "页码", type: "page" }, { name: "tag", title: "厂牌", type: "enumeration", value: "SIRO", enumOptions: [{ title: "SIRO", value: "SIRO" }, { title: "LUXU", value: "LUXU" }, { title: "200GANA", value: "200GANA" }, { title: "FC2", value: "FC2" }, { title: "HEYZO", value: "HEYZO" }, { title: "Caribbeancom", value: "CARIBBEANCOM" }, { title: "10musume", value: "10MUSUME" }, { title: "Pacopacomama", value: "PACOPACOMAMA" }, { title: "S-CUTE", value: "S-CUTE" }, { title: "PRESTIGE PREMIUM", value: "PRESTIGE PREMIUM" }, { title: "ARA", value: "ARA" }, { title: "ACZD", value: "ACZD" }, { title: "NNPJ", value: "NNPJ" }, { title: "MRHP", value: "MRHP" }, { title: "DOCP", value: "DOCP" }, { title: "C0930", value: "C0930" }, { title: "H0930", value: "H0930" }, { title: "H4610", value: "H4610" }] }] },
    { id: "loadGenre", title: "题材", functionName: "loadGenre", type: "video", cacheDuration: 120, params: [{ name: "page", title: "页码", type: "page" }, { name: "genre", title: "题材", type: "enumeration", value: "Creampie", enumOptions: [{ title: "中出", value: "Creampie" }, { title: "美少女", value: "Beautiful Girl" }, { title: "痴女", value: "Slut" }, { title: "口交", value: "Blowjob" }, { title: "主观视角", value: "POV" }, { title: "单体", value: "Solowork" }, { title: "人妻", value: "Married Woman" }, { title: "主妇", value: "Housewife" }, { title: "NTR", value: "Ntr" }, { title: "剧情", value: "Drama" }, { title: "不伦", value: "Affair" }, { title: "出轨妻", value: "Cheating Wife" }, { title: "近亲", value: "Incest" }, { title: "巨乳", value: "Large Breasts" }, { title: "贫乳", value: "Small Breasts" }, { title: "学生", value: "School Girls" }, { title: "义姐妹", value: "Step Sister" }, { title: "乳交", value: "Tits Fuck" }, { title: "自慰", value: "Masturbation" }, { title: "野外", value: "Public Sex" }, { title: "无码", value: "Uncensored" }, { title: "高清", value: "Hi-Def" }, { title: "长片4H+", value: "Over 4 Hours" }] }] },
    { id: "loadList", title: "列表", functionName: "loadList", type: "video", cacheDuration: 120, params: [{ name: "page", title: "页码", type: "page" }, { name: "peopleId", title: "演员", type: "input" }, { name: "genreId", title: "分类", type: "input" }] },
    { id: "loadResource", title: "播放", functionName: "loadResource", type: "stream", params: [] }
  ],
  search: {
    title: "NJAV",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

// ==================== 常量 ====================
var BASE = "https://www.njav.com";
var EN = BASE + "/en";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
var PLAY_HEADERS = { "User-Agent": UA };
var GENRE_CN = {
  "Creampie": "中出", "Beautiful Girl": "美少女", "Slut": "痴女", "Blowjob": "口交",
  "POV": "主观视角", "Solowork": "单体", "Married Woman": "人妻", "Housewife": "主妇",
  "Ntr": "NTR", "Cuckold": "寝取", "Cuckolded": "被寝取", "Drama": "剧情", "Affair": "不伦",
  "Adultery": "出轨", "Cheating Wife": "出轨妻", "Incest": "近亲", "Large Breasts": "巨乳",
  "Small Breasts": "贫乳", "School Girls": "学生", "Step Sister": "义姐妹", "Tits Fuck": "乳交",
  "Masturbation": "自慰", "Public Sex": "野外", "Uncensored": "无码", "Hi-Def": "高清",
  "Over 4 Hours": "长片4H+", "Blonde": "金发", "Comedy": "喜剧", "Fantasy": "幻想",
  "Harem": "后宫", "Horny Slut": "淫乱", "Romance": "浪漫", "Sports": "运动", "Ecchi": "工口"
};

// ==================== 小工具 ====================
function str(v, def) { return v != null ? String(v) : (def || ""); }
function num(v, def) { var n = Number(v); return isNaN(n) ? (def || 0) : n; }

function _unwrap(arg) {
  if (arg == null) return {};
  if (typeof arg === "string") return { link: arg };
  return arg;
}

// 运行时把卡片对象直接传给 loadDetail/loadResource，取 link/id/url/href
function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

// storage 兼容层：Rex 为 get/set（异步、字符串），FW 为 getItem/setItem
async function _storeGet(key) {
  try {
    var st = (typeof Widget !== "undefined" && Widget.storage) || null;
    if (st) {
      if (typeof st.getItem === "function") { var v1 = await st.getItem(key); if (v1 != null) return v1; }
      if (typeof st.get === "function") { var v2 = await st.get(key); if (v2 != null) return v2; }
    }
  } catch (e) {}
  return null;
}
async function _storeSet(key, val) {
  try {
    var st = (typeof Widget !== "undefined" && Widget.storage) || null;
    if (!st) return;
    var s = (typeof val === "string") ? val : JSON.stringify(val);
    if (typeof st.setItem === "function") { await st.setItem(key, s); return; }
    if (typeof st.set === "function") { await st.set(key, s); return; }
  } catch (e) {}
}

function decodeEntities(s) {
  if (!s) return "";
  return String(s)
    .replace(/&#x([0-9a-fA-F]+);/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); })
    .replace(/&#(\d+);/g, function (m, d) { return String.fromCharCode(parseInt(d, 10)); })
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
}

function stripTags(s) {
  return decodeEntities(String(s || "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

async function _get(url, referer) {
  var res = await Widget.http.get(url, { headers: { "User-Agent": UA, "Referer": referer || BASE + "/" } });
  var status = res ? (res.status != null ? res.status : res.statusCode) : 0;
  var data = res ? res.data : "";
  if (typeof data !== "string") data = data == null ? "" : String(data);
  if (status && status >= 400) throw new Error("HTTP " + status + " " + url);
  return data;
}

// 取 helvid master：只带 iPhone UA，不带 Referer（源模块实测配方）
async function _getMaster(url) {
  var res = await Widget.http.get(url, { headers: { "User-Agent": UA } });
  var status = res ? (res.status != null ? res.status : res.statusCode) : 0;
  var data = res ? res.data : "";
  if (typeof data !== "string") data = data == null ? "" : String(data);
  if (status && status >= 400) throw new Error("HTTP " + status + " " + url);
  return data;
}

function pageUrl(base, page) {
  var p = num(page, 1);
  if (p <= 1) return base;
  return base + (base.indexOf("?") >= 0 ? "&" : "?") + "page=" + p;
}

// 封面升档：resize/ 330px → images/ 800px
function bigCover(u) {
  return String(u || "").replace("/resize/", "/images/");
}

// ==================== 列表解析 ====================
function parseCards(html) {
  var items = [];
  if (!html) return items;
  var seen = {};
  var parts = String(html).split("box-item");
  for (var i = 1; i < parts.length; i++) {
    var chunk = parts[i].slice(0, 2500);
    var hrefM = /href="xvideos\/([a-z0-9][a-z0-9-]*)"/.exec(chunk);
    if (!hrefM) continue;
    var slug = hrefM[1];
    if (seen[slug]) continue;
    seen[slug] = 1;
    var imgM = /data-src="([^"]+)"/.exec(chunk) || /<img[^>]+src="(https:\/\/static\.javcdn[^"]+)"/.exec(chunk);
    var cover = imgM ? bigCover(imgM[1]) : ("https://static.javcdn.vip/images/" + slug + "/thumb_h.webp");
    var nameM = /<div class="detail">\s*<a[^>]*>([^<]+)<\/a>/.exec(chunk) || /<div class="name">([^<]+)<\/div>/.exec(chunk);
    var title = nameM ? decodeEntities(nameM[1]).trim() : slug.toUpperCase();
    var durM = /<div class="duration">([^<]+)<\/div>/.exec(chunk) || /<i class="ribbon">([^<]+)<\/i>/.exec(chunk);
    var dur = durM ? durM[1].trim() : "";
    var link = "njav:" + slug;
    items.push({
      id: link,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: link,
      mediaType: "movie",
      playerType: "app",
      durationText: dur,
      description: dur
    });
    _storeSet("njav:item:" + slug, { title: title, cover: cover, dur: dur });
  }
  return items;
}

// 上游每页 12 条，模块页 20 条：按绝对序号窗口跨上游页攒满再切片，
// 上游回空或短页（<12）才是真尾页。
var UP_SIZE = 12, MOD_SIZE = 20;
async function _listWindow(makeUrl, page) {
  page = num(page, 1);
  if (page < 1) page = 1;
  var start = (page - 1) * MOD_SIZE;
  var firstUp = Math.floor(start / UP_SIZE) + 1;
  var lastUp = Math.floor((start + MOD_SIZE - 1) / UP_SIZE) + 1;
  var all = [];
  for (var u = firstUp; u <= lastUp; u++) {
    var items = parseCards(await _get(makeUrl(u)));
    if (!items.length) break;
    for (var i = 0; i < items.length; i++) all.push(items[i]);
    if (items.length < UP_SIZE) break;
  }
  var off = start - (firstUp - 1) * UP_SIZE;
  return all.slice(off, off + MOD_SIZE);
}

// ==================== 列表入口 ====================
async function loadLatest(params) {
  params = _unwrap(params);
  var page = num(params.page, 1);
  // 详情页题材点进来时，客户端回开本模块并带 genreId（g:=题材 / t:=厂牌）
  if (params.genreId) {
    var gid = String(params.genreId);
    if (gid.indexOf("g:") === 0) {
      var gb = EN + "/genre/" + encodeURIComponent(gid.slice(2));
      return _listWindow(function (u) { return pageUrl(gb, u); }, page);
    }
    if (gid.indexOf("t:") === 0) {
      var tb = EN + "/tags/" + encodeURIComponent(gid.slice(2));
      return _listWindow(function (u) { return pageUrl(tb, u); }, page);
    }
  }
  var rb = EN + "/recent-update/";
  return _listWindow(function (u) { return pageUrl(rb, u); }, page);
}

async function loadRelease(params) {
  params = _unwrap(params);
  var b = EN + "/new-release/";
  return _listWindow(function (u) { return pageUrl(b, u); }, num(params.page, 1));
}

async function loadCat(params) {
  params = _unwrap(params);
  var c = str(params.cat, "censored");
  if (!/^[a-z0-9-]+$/.test(c)) c = "censored";
  var b = EN + "/" + c + "/";
  return _listWindow(function (u) { return pageUrl(b, u); }, num(params.page, 1));
}

async function loadTag(params) {
  params = _unwrap(params);
  var t = str(params.tag, "SIRO");
  if (!/^[A-Za-z0-9 -]+$/.test(t)) t = "SIRO";
  var b = EN + "/tags/" + encodeURIComponent(t);
  return _listWindow(function (u) { return pageUrl(b, u); }, num(params.page, 1));
}

async function loadGenre(params) {
  params = _unwrap(params);
  var g = str(params.genre, "Creampie");
  if (!/^[A-Za-z0-9 -]+$/.test(g)) g = "Creampie";
  var b = EN + "/genre/" + encodeURIComponent(g);
  return _listWindow(function (u) { return pageUrl(b, u); }, num(params.page, 1));
}

async function search(params) {
  params = _unwrap(params);
  var kw = str(params.keyword, "").trim();
  if (!kw) return [];
  var b = EN + "/search?q=" + encodeURIComponent(kw);
  return _listWindow(function (u) { return pageUrl(b, u); }, num(params.page, 1));
}

// AVDB 全覆盖派发：App 点 peoples/genreItems 可能调 loadList 传 peopleId/genreId，
// 也可能把 id 放在 url/link/href/value/people/actor/name/title 任一键下。
// 演员一律走站内搜索（演员页本身混杂、不可信）；分类走题材页。
async function loadList(params) {
  params = _unwrap(params);
  var page = num(params.page, 1);
  var pid = str(params.peopleId || params.people || params.actor || params.actorId || "", "").trim();
  var gid = str(params.genreId || params.genre || params.category || "", "").trim();
  var raw = str(params.url || params.link || params.href || params.value || params.id || "", "").trim();
  var key = pid || gid || raw;
  if (!key && params && typeof params === "object") {
    var ks = ["title", "name"];
    for (var i = 0; i < ks.length; i++) {
      var v = str(params[ks[i]], "").trim();
      if (v) { key = v; break; }
    }
  }
  if (!key) return loadLatest({ page: page });
  var isActor = /\/actor\//i.test(key) || !!pid;
  var isGenre = /\/genre\//i.test(key) || !!gid;
  var name = key;
  if (/^https?:\/\//i.test(key) || key.indexOf("/") >= 0) {
    var seg = String(key || "").split("?")[0].split("#")[0].replace(/\/+$/, "").split("/").pop() || "";
    try { name = decodeURIComponent(seg); } catch (e) { name = seg; }
    name = String(name || "").trim();
  }
  if (!name) return loadLatest({ page: page });
  if (isActor) {
    try {
      var sw = await search({ keyword: name, page: page });
      if (Array.isArray(sw) && sw.length) return sw;
    } catch (e) {}
    return _listWindow(function (u) { return pageUrl(EN + "/actor/" + encodeURIComponent(name), u); }, page);
  }
  if (isGenre) {
    try { return await loadGenre({ genre: name, page: page }); } catch (e) { return []; }
  }
  try {
    var sw2 = await search({ keyword: name, page: page });
    if (Array.isArray(sw2) && sw2.length) return sw2;
  } catch (e) {}
  return loadLatest({ page: page });
}

// ==================== 播放铸造 ====================
function parseLink(link) {
  var m = /^njav:([a-z0-9][a-z0-9-]*)$/.exec(str(link, ""));
  return m ? m[1] : null;
}

// 集 token：njav:<slug>@@<档位名>（如 njav:meyd-385-uncensored-leak@@1080p）
// 无 @@ 时 tier 为空串，表示未指定档位。
function parseToken(raw) {
  var s = String(raw || "");
  var at = s.indexOf("@@");
  var head = at >= 0 ? s.slice(0, at) : s;
  var tier = at >= 0 ? s.slice(at + 2) : "";
  return { slug: parseLink(head), tier: tier };
}

function unescapeCfg(s) {
  return String(s || "")
    .replace(/\\u([0-9a-fA-F]{4})/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); })
    .replace(/\\\//g, "/")
    .replace(/\\"/g, '"');
}

// 铸造播放地址：/vv/<slug> → /jm/<token>（自动跟随 302/301 到 upload18 播放页）
// → PLAYER_CONFIG 的 m3u8（helvid 签名 HLS）＋ alternate720。钉存 100 分钟。
async function _mint(slug) {
  var pinRaw = await _storeGet("njav:res:" + slug);
  if (pinRaw) {
    try {
      var pin = JSON.parse(pinRaw);
      if (pin && pin.u && pin.exp > Date.now() + 60000) return pin;
    } catch (e) {}
  }
  var detailUrl = EN + "/xvideos/" + slug;
  var vv = await _get(BASE + "/vv/" + slug, detailUrl);
  var jmM = /"(\/jm\/[A-Za-z0-9+/=]+)"/.exec(vv);
  if (!jmM) return null;
  var play = await _get(BASE + jmM[1], BASE + "/vv/" + slug);
  var mM = /"m3u8"\s*:\s*"([^"]+)"/.exec(play);
  if (!mM) return null;
  var aM = /"alternate720"\s*:\s*"([^"]*)"/.exec(play);
  var res = {
    u: unescapeCfg(mM[1]),
    alt: aM ? unescapeCfg(aM[1]) : "",
    exp: Date.now() + 100 * 60 * 1000
  };
  if (!res.u) return null;
  _storeSet("njav:res:" + slug, res);
  return res;
}

// 解析 helvid master 里的变体：#EXT-X-STREAM-INF 行取 NAME 与 RESOLUTION，
// 下一行非空行即变体地址（原样用，不重拼）。按档位高度从高到低排，同名去重。
function _parseVariants(master) {
  var out = [];
  if (!master) return out;
  var lines = String(master).split("\n");
  var i, j, k, line, name, h, url, m, t, dup;
  for (i = 0; i < lines.length; i++) {
    line = lines[i];
    if (line.indexOf("#EXT-X-STREAM-INF") !== 0) continue;
    name = "";
    m = /NAME="([^"]+)"/.exec(line);
    if (m) name = m[1];
    h = 0;
    m = /RESOLUTION=(\d+)x(\d+)/.exec(line);
    if (m) h = parseInt(m[2], 10);
    if (!name && h) name = h + "p";
    if (!name) name = "正片";
    url = "";
    j = i + 1;
    while (j < lines.length) {
      t = lines[j].replace(/^\s+|\s+$/g, "");
      if (t) { url = t; break; }
      j++;
    }
    if (!url || url.indexOf("http") !== 0) continue;
    dup = false;
    for (k = 0; k < out.length; k++) {
      if (out[k].name === name) { dup = true; break; }
    }
    if (!dup) out.push({ name: name, h: h, url: url });
  }
  out.sort(function (a, b) { return b.h - a.h; });
  return out;
}

// 铸造 + 取 master + 解析变体。master 取不到或 0 变体时 tiers 为空，
// 调用方回落到源模块行为（单条正片线 + alternate720 线）。
async function _tiers(slug) {
  try {
    var minted = await _mint(slug);
    if (!minted || !minted.u) return { tiers: [], minted: minted };
    var master = "";
    try { master = await _getMaster(minted.u); } catch (e) { master = ""; }
    return { tiers: _parseVariants(master), minted: minted };
  } catch (e) {
    return { tiers: [], minted: null };
  }
}

// 由铸造结果拼集列表：有变体时一档一集；无变体时正片 + alternate720。
function _linesFromMint(tiers, minted) {
  var lines = [];
  var i;
  if (tiers && tiers.length) {
    for (i = 0; i < tiers.length; i++) lines.push({ name: tiers[i].name, url: tiers[i].url });
    return lines;
  }
  if (minted && minted.u) {
    lines.push({ name: "正片", url: minted.u });
    if (minted.alt) lines.push({ name: "720P", url: minted.alt });
  }
  return lines;
}

// ==================== 详情 ====================
// ---- AVDB 样式详情：演员（njav 详情页 actor/<名> 链接，实测 /en/actor/<名> 为作品列表页）----
function extractActorsFromHtml(html) {
  var actors = [];
  var seen = {};
  var re = /href="[^"]*actor\/([^"]+)"/g;
  var m;
  while ((m = re.exec(String(html || ""))) !== null) {
    var an = decodeEntities(m[1]);
    an = String(an || "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
    if (!an || an.length > 40) continue;
    // njav 的 Actresses 栏混有描述词（"21 years old" 年龄、"musician" 职业等），不是演员：
    // 演员名是罗马音人名，首字母大写、无数字；描述词含数字或全小写，直接过滤。
    if (/[0-9]/.test(an)) continue;
    if (!/^[A-Z]/.test(an)) continue;
    if (seen[an]) continue;
    seen[an] = 1;
    actors.push(an);
    if (actors.length >= 20) break;
  }
  return actors;
}
async function njavTaxDetail(raw) {
  var isActor = raw.indexOf("actor:") === 0 || /\/actor\//i.test(raw);
  var name = "";
  if (raw.indexOf("actor:") === 0) name = raw.slice(6);
  else if (raw.indexOf("g:") === 0) name = raw.slice(2);
  else {
    var seg = String(raw || "").split("?")[0].split("#")[0].replace(/\/+$/, "").split("/").pop() || "";
    try { name = decodeURIComponent(seg); } catch (e) { name = seg; }
  }
  name = String(name || "").trim();
  var works = [];
  try {
    // 演员必须走站内搜索：实测演员页 /en/actor/<名> 返回混杂内容（他人的片也混进来），
    // 而 /search?q=<人名> 返回的才是该演员的真作品（SONE/SSIS 等本家片）。
    if (isActor) { works = await search({ keyword: name }); }
    else { works = await loadGenre({ genre: name }); }
  } catch (e) { works = []; }
  if (!Array.isArray(works)) works = [];
  var real = works.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
  if (!real.length && isActor) {
    // 搜索无结果时才回落到演员页（聊胜于无）。
    try { var aw = await _listWindow(function (u) { return pageUrl(EN + "/actor/" + encodeURIComponent(name), u); }, 1); if (Array.isArray(aw)) works = aw; } catch (e2) {}
    real = (works || []).filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
  }
  var link = raw;
  if (raw.indexOf("actor:") === 0) link = EN + "/actor/" + encodeURIComponent(name);
  else if (raw.indexOf("g:") === 0) link = EN + "/genre/" + encodeURIComponent(name);
  return { id: raw, type: "detail", mediaType: "movie", title: name || (isActor ? "演员" : "分类"), link: link, description: (isActor ? "演员" : "分类") + " · 共 " + real.length + " 部作品", videoUrl: "", childItems: [], relatedItems: real.length ? real : works };
}

async function loadDetail(link) {
  var rawTax = unwrapLink(link);
  if (rawTax && (rawTax.indexOf("actor:") === 0 || rawTax.indexOf("g:") === 0 || /\/actor\//i.test(rawTax) || /\/genre\//i.test(rawTax))) { return await njavTaxDetail(rawTax); }
  var slug = parseToken(unwrapLink(link)).slug;
  if (!slug) return null;
  var pinRaw = await _storeGet("njav:item:" + slug);
  var pin = null;
  try { pin = pinRaw ? JSON.parse(pinRaw) : null; } catch (e) { pin = null; }
  var html = await _get(EN + "/xvideos/" + slug);
  var h1M = /<h1>([^<]+)<\/h1>/.exec(html);
  var title = h1M ? decodeEntities(h1M[1]).trim() : (pin && pin.title) || slug.toUpperCase();
  var postM = /data-poster="([^"]+)"/.exec(html);
  var cover = postM ? bigCover(postM[1]) : (pin && pin.cover) || ("https://static.javcdn.vip/images/" + slug + "/thumb_h.webp");
  var lenM = /data-len="([^"]+)"/.exec(html);
  var dur = lenM ? lenM[1] : (pin && pin.dur) || "";
  var dateM = /"uploadDate"\s*:\s*"(\d{4}-\d{2}-\d{2})/.exec(html);
  var genres = [];
  var gRe = /href="genre\/([^"]+)"/g, gm;
  while ((gm = gRe.exec(html)) !== null) {
    var gn = decodeEntities(gm[1]);
    if (gn && genres.indexOf(gn) < 0) genres.push(gn);
  }
  var actors = extractActorsFromHtml(html);
  var related = parseCards(html).filter(function (x) { return x.link !== "njav:" + slug; }).slice(0, 24);
  var res = await _tiers(slug);
  var lines = _linesFromMint(res.tiers, res.minted);
  var firstUrl = lines.length ? lines[0].url : "";
  var item = {
    id: "njav:" + slug,
    type: "detail",
    title: title,
    name: title,
    posterPath: cover,
    coverUrl: cover,
    backdropPath: cover,
    backdropPaths: cover ? [cover] : [],
    link: "njav:" + slug,
    mediaType: "movie",
    playerType: "app",
    customHeaders: PLAY_HEADERS,
    headers: PLAY_HEADERS,
    durationText: dur,
    description: dur,
    videoUrl: firstUrl,
    relatedItems: related
  };
  if (lines.length) {
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    var i;
    for (i = 0; i < lines.length; i++) {
      var token = "njav:" + slug + "@@" + lines[i].name;
      var epNo = i + 1;
      eps.push({ name: lines[i].name, link: token });
      seasonEps.push({ title: lines[i].name, episodeNumber: epNo, videoUrl: lines[i].url });
      epItems.push({
        id: token,
        type: "url",
        title: lines[i].name,
        mediaType: "movie",
        posterPath: cover,
        coverUrl: cover,
        link: token,
        episode: epNo,
        episodeNumber: epNo,
        seasonIndex: 1,
        seasonNumber: 1,
        videoUrl: lines[i].url,
        description: "HLS · helvid",
        customHeaders: PLAY_HEADERS,
        headers: PLAY_HEADERS,
        playerType: "app"
      });
    }
    item.episodes = eps;
    item.seasons = [{ seasonNumber: 1, title: "清晰度", name: "清晰度", episodes: seasonEps }];
    item.episodeItems = epItems;
    item.childItems = epItems;
  }
  if (dateM) item.releaseDate = dateM[1];
  if (genres.length) {
    // genreItems 必须带完整可点按链接（id 与 link 均为 /en/genre/<名>），否则 App 点分类无响应。
    item.genreItems = genres.slice(0, 10).map(function (g) { var u = EN + "/genre/" + encodeURIComponent(g); return { id: u, title: GENRE_CN[g] || g, link: u }; });
  }
  if (actors.length) {
    item.peoples = actors.map(function (a) { var u = EN + "/actor/" + encodeURIComponent(a); return { id: u, title: a, name: a, link: u, role: "演员" }; });
  }
  return item;
}

// ==================== 取流 ====================
// loadResource 只作回落：重新铸造、重新解析变体；指定档位时只回该档，
// 档位对不上时回最高档；无变体时回正片（+ alternate720）。永不抛错。
async function loadResource(params) {
  try {
    params = _unwrap(params);
    var raw = params.link != null ? params.link : params.id;
    var tok = parseToken(unwrapLink(raw));
    if (!tok.slug) return [];
    var res = await _tiers(tok.slug);
    var lines = _linesFromMint(res.tiers, res.minted);
    var picked = [];
    var i;
    if (res.tiers && res.tiers.length && tok.tier) {
      for (i = 0; i < lines.length; i++) {
        if (lines[i].name === tok.tier) { picked.push(lines[i]); break; }
      }
      if (!picked.length) picked.push(lines[0]);
    } else {
      picked = lines;
    }
    var out = [];
    for (i = 0; i < picked.length; i++) {
      out.push({
        name: picked[i].name,
        description: "HLS",
        url: picked[i].url,
        headers: PLAY_HEADERS,
        customHeaders: PLAY_HEADERS,
        playerType: "app"
      });
    }
    return out;
  } catch (e) {
    return [];
  }
}
