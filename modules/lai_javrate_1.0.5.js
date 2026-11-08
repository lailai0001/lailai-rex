// JavRate for REX (lai_javrate v1.0.5)
// v1.0.5（2026-11-09，基于 1.0.4；紧急回退修复）：1.0.4 越修越坏——详情不出选单且播不了
// （UMAN-017）。根因：1.0.4 照「link 只带 token、不带 videoUrl」写 seasons/episodeItems，
// 但 App 渲染的正是 my-rex 那套：seasons 里是 episodes（每集带 videoUrl）、episodeItems
// 每项带 videoUrl；REX 的 episodes 数组本身不被渲染。1.0.4 的 seasons 误用 episodeItems
// 键、episodeItems 又无 videoUrl，App 无可渲染、无可播，直接坏掉。
// 修法：照 my-rex（lai_juzi4k 1.0.4）结构——详情现取签名 master 构造三档变体地址，
// seasons[].episodes 与 episodeItems[] 每项都带 videoUrl（hls-relay 中转地址，ctx 带 payload
// 供 token 过期后自愈），REX episodes 数组同步保留作兼容；loadResource（unwrapLink + 变体
// 构造）保留作回落。注意：master 现取现用、token 仅 30 秒，点集宜在打开详情后尽快点。

WidgetMetadata = {
  id: "lai_javrate",
  title: "JavRate",
  description: "JavRate（javrate.com）：日本A片/無碼A片/國產AV + 14 关键词分类，详情出 1080p/720p/自适应三集，点集直接播对应变体",
  author: "lai",
  version: "1.0.5",
  requiredVersion: "0.0.1",
  site: "https://www.javrate.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新更新", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "new" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "日本A片", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "menu_censored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "無碼A片", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "menu_uncensored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "國產AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "menu_chinese" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "無碼破解", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "kw_wumapojie" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "kw_juru" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "美臀", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "kw_meitun" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "巨尻", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "kw_juqiao" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "美乳", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "kw_meiru" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "中文字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "kw_zhongwen" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "4K", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "kw_4k" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "制服", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "kw_zhifu" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "kw_renqi" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "熟女", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "kw_shunv" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "女教師", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "kw_nvjiaoshi" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "護士", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "kw_hushi" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "空姐", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "kw_kongjie" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "OL", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "kw_ol" }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://www.javrate.com";
var RELAY = "https://javrate.li768435813.workers.dev";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

// 分类表照抄猫源 CATS：3 菜单 + 14 关键词
var CATS = [
  { id: "menu_censored", name: "日本A片", kind: "menu", path: "censored" },
  { id: "menu_uncensored", name: "無碼A片", kind: "menu", path: "uncensored" },
  { id: "menu_chinese", name: "國產AV", kind: "menu", path: "chinese" },
  { id: "kw_wumapojie", name: "無碼破解", kind: "kw", path: "無碼破解" },
  { id: "kw_juru", name: "巨乳", kind: "kw", path: "巨乳" },
  { id: "kw_meitun", name: "美臀", kind: "kw", path: "美臀" },
  { id: "kw_juqiao", name: "巨尻", kind: "kw", path: "巨尻" },
  { id: "kw_meiru", name: "美乳", kind: "kw", path: "美乳" },
  { id: "kw_zhongwen", name: "中文字幕", kind: "kw", path: "中文字幕" },
  { id: "kw_4k", name: "4K", kind: "kw", path: "4k" },
  { id: "kw_zhifu", name: "制服", kind: "kw", path: "制服" },
  { id: "kw_renqi", name: "人妻", kind: "kw", path: "人妻" },
  { id: "kw_shunv", name: "熟女", kind: "kw", path: "熟女" },
  { id: "kw_nvjiaoshi", name: "女教師", kind: "kw", path: "女教師" },
  { id: "kw_hushi", name: "護士", kind: "kw", path: "護士" },
  { id: "kw_kongjie", name: "空姐", kind: "kw", path: "空姐" },
  { id: "kw_ol", name: "OL", kind: "kw", path: "ol" }
];

function t(v) {
  return String(v == null ? "" : v).trim();
}

function unescapeHtml(s) {
  return String(s || "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/&#x([0-9A-Fa-f]+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 16)); });
}

function cleanLabel(s) {
  return unescapeHtml(String(s || "").replace(/<[^>]+>/g, ""))
    .replace(/[\r\n\t]+/g, " ").replace(/ {2,}/g, " ").replace(/[$#]/g, "").trim();
}

function cleanText(s) {
  return unescapeHtml(String(s || "").replace(/<[^>]+>/g, ""))
    .replace(/\s+/g, " ").trim();
}

function absUrl(u, host) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return host + u;
  return u;
}

function normUrl(u) {
  var s = t(u);
  if (!s) return "";
  s = s.replace(/^(https?:)\/([^/])/, "$1//$2");
  return s;
}

// 纯 JS base64url（REX 沙箱无 Buffer/btoa 保证）：先手动 UTF-8 编码再查表
var B64CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function utf8Bytes(s) {
  var bytes = [];
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    if (c < 128) {
      bytes.push(c);
    } else if (c < 2048) {
      bytes.push(192 | (c >> 6), 128 | (c & 63));
    } else if (c >= 55296 && c < 57344 && i + 1 < s.length) {
      var c2 = s.charCodeAt(i + 1);
      if (c2 >= 56320 && c2 < 57344) {
        var cp = 65536 + ((c - 55296) << 10) + (c2 - 56320);
        bytes.push(240 | (cp >> 18), 128 | ((cp >> 12) & 63), 128 | ((cp >> 6) & 63), 128 | (cp & 63));
        i++;
      } else {
        bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
      }
    } else {
      bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
    }
  }
  return bytes;
}
function b64url(str) {
  var bytes = utf8Bytes(String(str));
  var out = "";
  for (var i = 0; i < bytes.length; i += 3) {
    var b0 = bytes[i];
    var b1 = (i + 1 < bytes.length) ? bytes[i + 1] : 0;
    var b2 = (i + 2 < bytes.length) ? bytes[i + 2] : 0;
    out += B64CHARS.charAt(b0 >> 2);
    out += B64CHARS.charAt(((b0 & 3) << 4) | (b1 >> 4));
    out += (i + 1 < bytes.length) ? B64CHARS.charAt(((b1 & 15) << 2) | (b2 >> 6)) : "=";
    out += (i + 2 < bytes.length) ? B64CHARS.charAt(b2 & 63) : "=";
  }
  return out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function viaWorker(url) {
  return RELAY + "/f/" + b64url(url);
}

// hls-relay 中转（与 818 relay 同构的通用 HLS 中转；须用户部署为 hls-relay.li768435813.workers.dev）。
// 密钥 HLS_RELAY_KEY 须与 Worker 里的常量一致（部署时可改，改完模块同步改）。
// 注意：本文件的 RELAY 是 javrate 取数 Worker（/f/ 拉站方页面），与 hls-relay 是两个 Worker。
var HLS_RELAY = "https://hls-relay.li768435813.workers.dev";
var HLS_RELAY_KEY = "lai-hls-1";
function hlsRelayCtx(o) {
  o = o || {};
  o.k = HLS_RELAY_KEY;
  return b64url(JSON.stringify(o));
}
// ctx：r=Referer，jr=payload（token 过期时 relay 用它重取 player v2 自愈）
function hlsRelayPlaylistUrl(streamUrl, ctxObj) {
  return HLS_RELAY + "/p/" + b64url(streamUrl) + "/" + hlsRelayCtx(ctxObj || {});
}

// v1.0.4 unwrapLink：REX 运行时把集对象直接传给 loadResource，String(对象) 得
// "[object Object]"，1.0.1 即因此解析不到地址。递归从对象/字符串/数组里抠出链接字符串。
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

// v1.0.4：从签名 master 构造指定档位变体地址。master 如
// https://cloud-warm-7.avking.xyz/20261025/<guid>/playlist.m3u8?token=…&expires=…，
// 变体为相对路径 1080p/video.m3u8、720p/video.m3u8，继承同一套 token 查询串。
// 自适应（auto）直接回 master 本身。
function variantUrl(master, height) {
  var m = String(master || "");
  if (!m) return "";
  if (height === "auto" || !height) return m;
  var mm = m.match(/^(https:\/\/[^?]+\/)playlist\.m3u8(\?.*)?$/);
  if (!mm) return m;
  return mm[1] + height + "/video.m3u8" + (mm[2] || "");
}

function isChallengeHtml(html) {
  if (!html) return false;
  return /Just a moment|Attention Required|challenges\.cloudflare\.com|cf-ray|cf-challenge/i.test(html);
}

// 取数：直连先行（REX 客户端常能过蜘蛛过不了的验证），直连失败/挑战页时走 Worker /f/ 腿兜底
async function getHtml(path) {
  var url = t(path);
  if (url.indexOf("//") === 0) url = "https:" + url;
  else if (url.charAt(0) === "/") url = HOST + url;
  var headers = {
    "User-Agent": UA,
    "Referer": HOST + "/",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
  };
  var legs = [url, viaWorker(url)];
  for (var i = 0; i < legs.length; i++) {
    try {
      var res = await Widget.http.get(legs[i], { headers: headers });
      var body = res && res.data != null ? String(res.data) : "";
      if (body && !isChallengeHtml(body)) return body;
    } catch (e) { /* 下一腿 */ }
  }
  return "";
}

// 本站卡片是“图链 + 文链”多个 <a> 共用同一 /movie/detail/<uuid>.html，按 URL 合并图与标题（照抄猫源）
function extractPic(inner) {
  var attrs = ["data-original", "data-src", "src"];
  for (var ai = 0; ai < attrs.length; ai++) {
    var re = new RegExp(attrs[ai] + "=['\"]([^'\"]+)['\"]", "i");
    var m = inner.match(re);
    if (m) {
      var cand = t(m[1]);
      if (cand) {
        var low = cand.toLowerCase();
        if (low.indexOf("loading.jpg") >= 0 || low.indexOf("loading.png") >= 0 ||
            low.indexOf("placeholder") >= 0 || low.indexOf("default") >= 0) continue;
        return cand;
      }
    }
  }
  return "";
}

function parseCards(html, host) {
  var body = String(html || "");
  // v1.0.3 翻页修：带主列表的页（菜单/关键词/搜索）除 mgn-grid 外还有推荐栏（<div class="right">），
  // 栏内约 9-12 条每页都出现，致跨页重复；只解析 mgn-grid（无 mgn-grid 的页如 /movie/new 保持原样全页解析）。
  var gi = body.indexOf('<div class="mgn-grid');
  if (gi >= 0) {
    var ge = body.indexOf('<div class="right">', gi);
    if (ge < 0) ge = body.indexOf("pagination-wrapper", gi);
    if (ge > gi) body = body.slice(gi, ge);
  }
  var byUrl = {};
  var order = [];
  var re = /<a[^>]+href=["'](\/movie\/detail\/[^"']+\.html)["'][^>]*>([\s\S]*?)<\/a>/g;
  var m;
  while ((m = re.exec(body))) {
    var vUrl = t(m[1]);
    var inner = m[2];
    var it = byUrl[vUrl];
    if (!it) {
      it = { id: vUrl, type: "url", title: "", posterPath: "", coverUrl: "", backdropPath: "", link: vUrl, description: "", mediaType: "movie" };
      byUrl[vUrl] = it;
      order.push(vUrl);
    }
    var pic = extractPic(inner);
    if (pic && !it.posterPath) {
      var full = normUrl(pic.indexOf("http") === 0 ? pic : absUrl(pic, host));
      it.posterPath = full;
      it.coverUrl = full;
      it.backdropPath = full;
    }
    var txt = cleanLabel(inner);
    if (txt && txt.length > 2 && txt.length > it.title.length) it.title = txt;
    if (!it.title || it.title.length < 3) {
      var altM = inner.match(/alt=["']([^"']+)["']/i);
      if (altM) {
        var altTxt = cleanLabel(altM[1]).replace(/\s*封面\s*$/, "");
        if (altTxt && altTxt.length > it.title.length) it.title = altTxt;
      }
    }
    var durM = inner.match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
    if (durM && !it.description) it.description = durM[1];
  }
  var out = [];
  for (var i = 0; i < order.length; i++) {
    var item = byUrl[order[i]];
    if (item.posterPath || item.title) {
      if (!item.title) item.title = "精彩视频";
      out.push(item);
    }
  }
  return out;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function findCat(catId) {
  for (var i = 0; i < CATS.length; i++) {
    if (CATS[i].id === catId) return CATS[i];
  }
  return null;
}

function catUrl(cat, page) {
  if (cat.kind === "menu") {
    return page <= 1 ? ("/menu/" + cat.path) : ("/menu/" + cat.path + "/5-2-" + page);
  }
  var base = "/keywords/movie/" + encodeURIComponent(cat.path);
  return page <= 1 ? base : (base + "?page=" + page + "&moviesort=5");
}

async function loadList(params) {
  params = params || {};
  var catId = t(params.cat || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var path = "";
    if (!catId || catId === "new") {
      // v1.0.3 翻页修：原代码漏带 page 参数，第 2 页总回同样 60 条；站方 /movie/new?page=2 回 40 条新内容。
      path = page <= 1 ? "/movie/new" : ("/movie/new?page=" + page);
    } else {
      var cat = findCat(catId);
      if (!cat) return emptyItem();
      path = catUrl(cat, page);
    }
    var html = await getHtml(path);
    // v1.0.3 翻页修：页内 totalPages 是站方总页数，超页不再返重复内容（如中文字幕 totalPages=1，第 2 页应为空）。
    var tpM = String(html || "").match(/totalPages:\s*(\d+)/);
    if (tpM && page > parseInt(tpM[1], 10)) return emptyItem();
    var list = parseCards(html, HOST);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
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
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  try {
    var html = await getHtml("/search/" + encodeURIComponent(wd));
    var list = parseCards(html, HOST);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function extractPayload(html) {
  var m = String(html || "").match(/\/player\/v2\?payload=([^"'&]+)/);
  return m ? m[1] : "";
}

function extractLd(html, key) {
  var m = String(html || "").match(new RegExp('"' + key + '":\\s*"([^"]+)"'));
  return m ? unescapeHtml(m[1]) : "";
}

function detailPath(link) {
  var s = t(link);
  if (!s) return "";
  var m = s.match(/\/movie\/detail\/[^"'?#]+\.html/);
  if (m) return m[0];
  return s;
}

async function loadDetail(link) {
  try {
    var path = detailPath(link);
    if (!path) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var durl = path.indexOf("http") === 0 ? path : HOST + path;
    var html = await getHtml(path);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var mainTitle = extractLd(html, "name");
    if (!mainTitle) {
      var tM = html.match(/<title>(.*?)<\/title>/i);
      if (tM) mainTitle = cleanLabel(tM[1]).replace(/\s*\|\s*Javrate\s*$/i, "").trim();
    }
    if (!mainTitle) mainTitle = "精彩视频";
    // 封面：详情页 _m.webp 大图优先，退回 JSON-LD thumbnailUrl，均为 picture.avking.xyz 直链
    var posterPic = "";
    var mPosters = html.match(/https:\/\/picture\.avking\.xyz[^"' \s<>]+?_m\.webp/g);
    if (mPosters && mPosters.length) posterPic = mPosters[0];
    if (!posterPic) posterPic = extractLd(html, "thumbnailUrl");
    if (!posterPic) {
      var ogM = html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
      if (ogM) posterPic = normUrl(t(ogM[1]));
    }
    var desc = extractLd(html, "description");
    var code = extractLd(html, "value");
    var payload = extractPayload(html);
    var result = {
      id: durl,
      type: "detail",
      title: mainTitle,
      name: mainTitle,
      description: desc || "JavRate",
      mediaType: "movie",
      link: durl,
      coverUrl: posterPic,
      posterPath: posterPic,
      backdropPath: posterPic,
      playerType: "app"
    };
    if (code) result.description = (code ? code : "") + (desc ? "\n" + desc : "");
    if (payload) {
      // v1.0.5（照 my-rex 结构）：详情现取签名 master 构造三档变体地址，seasons[].episodes
      // 与 episodeItems[] 每项都带 videoUrl（hls-relay 中转地址，ctx 带 payload 供自愈），
      // REX episodes 数组同步保留作兼容。App 渲染的正是 seasons/episodes + episodeItems
      // 这套；REX episodes 数组本身不被渲染。master 现取现用、token 仅 30 秒。
      var epBase = durl + "@@" + payload;
      var master = "";
      try { master = await resolveSignedMaster(durl, payload); } catch (e) { master = ""; }
      if (master) {
        var resNames = ["1080p", "720p", "自适应"];
        var resKeys = ["1080p", "720p", "auto"];
        var eps = [];
        var sEps = [];
        var items = [];
        for (var ri = 0; ri < resNames.length; ri++) {
          var epLink = epBase + "@@" + resKeys[ri];
          var streamUrl = variantUrl(master, resKeys[ri]);
          var playUrl = hlsRelayPlaylistUrl(streamUrl, { r: HOST + "/", jr: payload });
          eps.push({ name: resNames[ri], link: epLink });
          sEps.push({ title: resNames[ri], videoUrl: playUrl, episodeNumber: ri + 1 });
          items.push({ id: playUrl, type: "url", title: mainTitle + " " + resNames[ri], name: resNames[ri], mediaType: "movie", seasonNumber: 1, episodeNumber: ri + 1, videoUrl: playUrl, link: playUrl, posterPath: posterPic, coverUrl: posterPic });
        }
        result.episodes = eps;
        result.seasons = [{ seasonNumber: 1, title: "正片", name: "正片", episodes: sEps }];
        result.episodeItems = items;
        result.childItems = items;
      } else {
        var epLink = epBase;
        result.episodes = [{ name: "正片", link: epLink }];
        result.episodeItems = [{ id: epLink, title: mainTitle + " 正片", name: "正片", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, link: epLink }];
        result.childItems = result.episodeItems;
      }
    }
    return result;
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// 播放：现取 player v2 抽签名 master（cloud-*.avking.xyz…playlist.m3u8…token=…）
async function resolveSignedMaster(durl, payload) {
  var playerHtml = await getHtml("/player/v2?payload=" + encodeURIComponent(payload));
  if (!playerHtml) return "";
  var found = [];
  var re = /https:\/\/cloud-[a-z0-9-]+\.avking\.xyz[^"' \s<>]+?playlist\.m3u8[^"' \s<>]*/g;
  var m;
  while ((m = re.exec(playerHtml)) !== null) {
    var u = unescapeHtml(m[0]);
    if (u.indexOf("token=") >= 0 && found.indexOf(u) < 0) found.push(u);
  }
  return found.length ? found[0] : "";
}

async function loadResource(params) {
  // v1.0.4：先 unwrapLink（App 可能把集对象直接传参），再按 @@ 切段。
  // 集链接形态：<详情地址>@@<payload>@@<1080p|720p|auto>；兼容旧单集 <详情地址>@@<payload>（默认自适应）。
  var raw = unwrapLink(params);
  if (!raw && params && typeof params === "object") {
    raw = unwrapLink(params.link) || unwrapLink(params.url) || unwrapLink(params.id) || unwrapLink(params.item);
  }
  if (!raw) return [];
  var parts = raw.split("@@");
  var durl = parts[0] || "";
  var payload = parts[1] || "";
  var want = parts[2] || "auto";
  if (!payload) {
    // 兼容直接传 payload
    payload = durl;
    durl = "";
    want = "auto";
  }
  if (!payload) return [];
  var target = "";
  try { target = await resolveSignedMaster(durl, payload); } catch (e) { target = ""; }
  // 拿不到签名 master 就返回空，让 App 明确显示无播放地址（已知裸 contentUrl 直接取 403，返回它只会让播放器空转）。
  if (!target) return [];
  // v1.0.4：按点选档位构造变体地址（自适应回 master 本身），经 hls-relay 中转。
  var streamUrl = variantUrl(target, want);
  return [{ name: want === "auto" ? "自适应" : want, url: hlsRelayPlaylistUrl(streamUrl, { r: HOST + "/", jr: payload }), playerType: "app" }];
}
