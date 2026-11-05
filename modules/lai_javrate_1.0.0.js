// JavRate for REX (lai_javrate v1.0.0)
// 移植自 mira-cat 蜘蛛 py_javrate.js（只读蓝图，主干 blob e8c8acdc…），后端 https://www.javrate.com。
// 取数：先直连（Widget.http），直连被站方 Cloudflare 拦时走 javrate Worker 的 /f/ 腿兜底
//   （https://javrate.li768435813.workers.dev/f/<base64url(目标地址)>，Worker 服务端拉站方是通的）。
// 分类：菜单 3 个（日本A片/無碼A片/國產AV）+ 关键词 14 个，名与路径全部照抄猫源 CATS，不编造。
// 列表翻页：菜单 /menu/<m>/5-2-<页>；关键词 /keywords/movie/<词>?page=<页>&moviesort=3。
// 搜索：/search/<关键词>。详情：JSON-LD 取名/简介/封面/番号，iframe /player/v2?payload=… 取 payload。
// 播放：签名 master 仅 30 秒有效，故详情只存 payload、不固化播单；播放时 loadResource 现取
//   player v2 抽签名 master（cloud-*.avking.xyz…playlist.m3u8…token=…，内含 720p/1080p 两档，
//   返 master 本身自适应，不虚构分档选单）。变体 URI 为相对路径且不带 token、每条分片请求都须
//   单独带 token，App 播放器不会逐请求注 token，故播单可取不等于真机能播通——真机待验。
// 字幕：猫源字幕芯是猫源专属，REX 版不接。

WidgetMetadata = {
  id: "lai_javrate",
  title: "JavRate",
  description: "JavRate（javrate.com）：日本A片/無碼A片/國產AV + 14 关键词分类，详情单集，播放现取签名播单",
  author: "lai",
  version: "1.0.0",
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
    { title: "OL", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "kw_ol" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { id: "loadResource", title: "播放资源", description: "播放时凭 payload 现取签名播单并附播放头", functionName: "loadResource", type: "stream", cacheDuration: 0, params: [] }
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
  var byUrl = {};
  var order = [];
  var re = /<a[^>]+href=["'](\/movie\/detail\/[^"']+\.html)["'][^>]*>([\s\S]*?)<\/a>/g;
  var m;
  while ((m = re.exec(String(html || "")))) {
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
  return page <= 1 ? base : (base + "?page=" + page + "&moviesort=3");
}

async function loadList(params) {
  params = params || {};
  var catId = t(params.cat || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var path = "";
    if (!catId || catId === "new") {
      path = "/movie/new";
    } else {
      var cat = findCat(catId);
      if (!cat) return emptyItem();
      path = catUrl(cat, page);
    }
    var html = await getHtml(path);
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
      type: "url",
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
      // 签名 master 仅 30 秒有效：详情只存 payload，播放时 loadResource 现取
      var epLink = durl + "@@" + payload;
      result.episodes = [{ name: "正片", link: epLink }];
      result.episodeItems = [{ id: epLink, title: mainTitle + " 正片", name: "正片", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, link: epLink }];
      result.childItems = result.episodeItems;
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
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 集链接形态：<详情地址>@@<payload>；兼容直接传 payload
  var durl = "";
  var payload = raw;
  var at = raw.indexOf("@@");
  if (at >= 0) { durl = raw.slice(0, at); payload = raw.slice(at + 2); }
  if (!payload) return [];
  var target = "";
  try { target = await resolveSignedMaster(durl, payload); } catch (e) { target = ""; }
  if (!target) {
    // 兜底：详情 JSON-LD 的裸清单（已知直接取 403，仅作非空保底，不宣称可播）
    try {
      var html = await getHtml(durl || payload);
      var bare = extractLd(html, "contentUrl");
      if (bare) target = bare;
    } catch (e) { /* ignore */ }
  }
  if (!target) return [];
  return [{ name: "正片", url: target, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
}
