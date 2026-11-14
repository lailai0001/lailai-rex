// MissAV BZ for REX (lai_missavbz v1.0.0)
// missav.bz：WordPress（Retrotube 主题）的 MissAV 镜像站，与 missav.fans 是两套站。
// 分类（WP API 实测，仅 3 个）：censored 有码、english-subtitle 英文字幕、reducing-mosaic 减码破解（LTX，75,135 部）。
// 列表走 WP REST API（JSON），封面按 slug 拼 pic.missav.bz/image/<slug>.jpg。
// 播放链（3 部片实测）：详情页 Rocket base64 脚本 defaultUrl -> xx.videplay.us/v/<id> 嵌页
//   -> 内联打包脚本解包 -> https://api.videplay.us/vod/v-master.m3u8/<token>（自适应 master）。
//   token 每片不同、15 分钟以上有效；master 清单经 jina 侧验证 2/3 返回真 HLS（IPZZ-599-RM 回空，真机定性）。
//   站内无多档位，单集「正片」出 master 直链，不编造档位。字幕：REX 字幕走 lai_subtitleagg，本模块不内联接芯。
WidgetMetadata = {
  id: "lai_missavbz",
  title: "MissAV BZ",
  description: "MissAV BZ（missav.bz）：最新/减码破解/有码/英文字幕，详情现解 videplay 自适应 master 单线",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://missav.bz",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "减码破解", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "reducing-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "censored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "英文字幕", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "english-subtitle" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
  ]
};

var HOST = "https://missav.bz";
var API = HOST + "/wp-json/wp/v2";
var UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
var B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var CAT_IDS = { "reducing-mosaic": 14458, "censored": 2, "english-subtitle": 15501 };

function t(v) {
  return String(v == null ? "" : v).trim();
}

function cleanText(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/&#x([0-9a-fA-F]+);/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); })
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

function firstMatch(text, re, idx) {
  var m = String(text || "").match(re);
  return m ? t(m[idx || 1] || "") : "";
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": referer || HOST + "/"
  };
}

async function getText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

async function getTextSoft(url, referer) {
  try {
    var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
    var body = res && res.data != null ? String(res.data) : "";
    return body || "";
  } catch (e) {
    return "";
  }
}

async function getJson(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  var d = res ? res.data : null;
  if (d == null) return [];
  if (typeof d === "object") return d;
  try { return JSON.parse(String(d)); } catch (e) { return []; }
}

// 纯字符串 base64 解码，返回 latin1 字符串（每个字符即一个字节）
function b64ToLatin1(s) {
  s = String(s || "").replace(/-/g, "+").replace(/_/g, "/").replace(/[^A-Za-z0-9+\/=]/g, "");
  while (s.length % 4) s += "=";
  var out = "";
  for (var i = 0; i < s.length; i += 4) {
    var c0 = B64_ALPHABET.indexOf(s.charAt(i));
    var c1 = B64_ALPHABET.indexOf(s.charAt(i + 1));
    var c2 = B64_ALPHABET.indexOf(s.charAt(i + 2));
    var c3 = B64_ALPHABET.indexOf(s.charAt(i + 3));
    if (c0 < 0 || c1 < 0) break;
    out += String.fromCharCode((c0 << 2) | (c1 >> 4));
    if (c2 >= 0) out += String.fromCharCode(((c1 & 15) << 4) | (c2 >> 2));
    if (c3 >= 0) out += String.fromCharCode(((c2 & 3) << 6) | c3);
  }
  return out;
}

// latin1 字节串按 UTF-8 解码（手工实现，不依赖运行环境解码接口）
function latin1ToUtf8(s) {
  var out = "";
  var i = 0;
  while (i < s.length) {
    var c = s.charCodeAt(i);
    i++;
    if (c < 128) {
      out += String.fromCharCode(c);
    } else if ((c & 224) === 192 && i < s.length) {
      var c2 = s.charCodeAt(i);
      i++;
      out += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
    } else if ((c & 240) === 224 && i + 1 < s.length) {
      var d2 = s.charCodeAt(i);
      var d3 = s.charCodeAt(i + 1);
      i += 2;
      out += String.fromCharCode(((c & 15) << 12) | ((d2 & 63) << 6) | (d3 & 63));
    } else if ((c & 248) === 240 && i + 2 < s.length) {
      var e2 = s.charCodeAt(i);
      var e3 = s.charCodeAt(i + 1);
      var e4 = s.charCodeAt(i + 2);
      i += 3;
      var cp = ((c & 7) << 18) | ((e2 & 63) << 12) | ((e3 & 63) << 6) | (e4 & 63);
      cp -= 65536;
      out += String.fromCharCode(55296 + (cp >> 10), 56320 + (cp & 1023));
    } else {
      out += String.fromCharCode(c);
    }
  }
  return out;
}

function isoDur(iso) {
  var m = String(iso || "").match(/P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "";
  var h = parseInt(m[2] || 0, 10);
  var mi = parseInt(m[3] || 0, 10);
  var s = parseInt(m[4] || 0, 10);
  var p2 = function (n) { return n < 10 ? "0" + n : "" + n; };
  if (h) return h + ":" + p2(mi) + ":" + p2(s);
  return mi + ":" + p2(s);
}

// Dean Edwards 打包器逆运算：从 videplay 嵌页内联脚本里解出 master 播放地址
function encBase(n, a) {
  if (n < a) return n > 35 ? String.fromCharCode(n + 29) : n.toString(36);
  var q = parseInt(n / a, 10);
  var r = n % a;
  return encBase(q, a) + (r > 35 ? String.fromCharCode(r + 29) : r.toString(36));
}

function unpackToken(embedHtml) {
  try {
    var m = String(embedHtml || "").match(/\}\('([\s\S]*)',(\d+),(\d+),'(.*)'\.split\('\|'\),0,\{\}\)\)/);
    if (!m) return "";
    var payload = m[1];
    var a = parseInt(m[2], 10);
    var c = parseInt(m[3], 10);
    var kws = m[4].split("|");
    for (var i = c - 1; i >= 0; i--) {
      var kw = kws[i] || "";
      if (kw) {
        var re = new RegExp("\\b" + encBase(i, a) + "\\b", "g");
        payload = payload.replace(re, function () { return kw; });
      }
    }
    var tm = payload.match(/v-master\.m3u8\/([A-Za-z0-9+/=]{100,})/);
    return tm ? "https://api.videplay.us/vod/v-master.m3u8/" + tm[1] : "";
  } catch (e) {
    return "";
  }
}

async function resolveMaster(durl, detailHtml) {
  try {
    var html = detailHtml || "";
    if (!html) html = await getTextSoft(durl, HOST + "/");
    if (!html) return "";
    var rm = html.match(/data-rocketlazyloadscript='data:text\/javascript;base64,([A-Za-z0-9+/=]+)'/);
    if (!rm) return "";
    var js = latin1ToUtf8(b64ToLatin1(rm[1]));
    var um = js.match(/defaultUrl\s*=\s*"([^"]+)"/);
    if (!um) return "";
    var embed = await getTextSoft(um[1], durl);
    if (!embed) return "";
    return unpackToken(embed);
  } catch (e) {
    return "";
  }
}

function postCard(p) {
  var slug = t(p && p.slug);
  var title = "";
  if (p && p.title) title = cleanText(typeof p.title === "string" ? p.title : p.title.rendered);
  var link = t(p && p.link) || (slug ? HOST + "/" + slug + "/" : "");
  var date = t(p && p.date ? String(p.date).slice(0, 10) : "");
  var pic = slug ? "https://pic.missav.bz/image/" + slug + ".jpg" : "";
  return { id: link, type: "detail", title: title || slug, mediaType: "movie", posterPath: pic, coverUrl: pic, backdropPath: pic, description: date };
}

function listUrl(cat, page, wd) {
  var url = API + "/posts?per_page=20&page=" + page + "&_fields=id,slug,title,link,date";
  if (wd) {
    url += "&search=" + encodeURIComponent(wd);
  } else {
    url += "&orderby=date&order=desc";
    if (CAT_IDS[cat]) url += "&categories=" + CAT_IDS[cat];
  }
  return url;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var cat = String(params.path || params.cat || "latest");
  var url = listUrl(cat, page, "");
  try {
    var posts = await getJson(url, HOST + "/");
    if (!posts || !posts.length) return [{ id: "empty", type: "url", title: "暂无内容" }];
    var out = [];
    for (var i = 0; i < posts.length; i++) out.push(postCard(posts[i]));
    return out;
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败", description: String((e && e.message) || e) }];
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
  var page = parseInt(params.page, 10) || 1;
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var url = listUrl("", page, wd);
  try {
    var posts = await getJson(url, HOST + "/");
    if (!posts || !posts.length) return [{ id: "empty", type: "url", title: "没有找到相关内容" }];
    var out = [];
    for (var i = 0; i < posts.length; i++) out.push(postCard(posts[i]));
    return out;
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败", description: String((e && e.message) || e) }];
  }
}

function unwrapLink(link) {
  if (link == null) return "";
  if (typeof link === "string") return link;
  return String(link.link || link.url || link.id || "");
}

async function loadDetail(link) {
  var url = unwrapLink(link);
  try {
    if (!/^https?:\/\//i.test(url)) url = HOST + "/" + url.replace(/^\/+|\/+$/g, "") + "/";
    var html = await getText(url, HOST + "/");
    var title = cleanText(firstMatch(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i));
    if (!title) {
      title = cleanText(firstMatch(html, /<title>([^<]*)<\/title>/i)).replace(/\s*-\s*MISSAV\s*$/i, "");
    }
    if (!title) title = "MissAV BZ";
    var slug = "";
    var sm = url.match(/missav\.bz\/([^\/\?#]+)/);
    if (sm) slug = sm[1];
    var cover = firstMatch(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (!cover) cover = firstMatch(html, /<meta[^>]+itemprop=["']thumbnailUrl["'][^>]+content=["']([^"']+)["']/i);
    if (!cover && slug) cover = "https://pic.missav.bz/image/" + slug + ".jpg";
    var dur = "";
    var dum = html.match(/<meta[^>]+itemprop=["']duration["'][^>]+content=["']([^"']+)["']/i);
    if (dum) dur = isoDur(dum[1]);
    var desc = "";
    var dm = html.match(/<meta[^>]+itemprop=["']description["'][^>]+content=["']([^"']+)["']/i);
    if (dm) desc = cleanText(dm[1]);
    var src = await resolveMaster(url, html);
    var base = { id: url, type: "detail", title: title, link: url, posterPath: cover, coverUrl: cover, backdropPath: cover, description: desc || (dur ? "时长 " + dur : "") };
    if (src) {
      base.videoUrl = src;
      base.playerType = "system";
      base.episodes = [{ name: "正片", id: url, link: url }];
      base.seasons = [{ seasonNumber: 1, title: "正片", name: "正片", episodes: [{ title: "正片", videoUrl: src, episodeNumber: 1 }] }];
      base.episodeItems = [{ id: url, type: "url", title: title, name: "正片", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, videoUrl: src, link: url, posterPath: cover, coverUrl: cover, playerType: "system" }];
    } else {
      base.episodes = [{ name: "正片", id: url, link: url }];
      base.seasons = [{ seasonNumber: 1, title: "正片", name: "正片", episodes: [{ title: "正片", episodeNumber: 1 }] }];
      base.episodeItems = [{ id: url, type: "url", title: title, name: "正片", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, link: url, posterPath: cover, coverUrl: cover }];
    }
    return base;
  } catch (e) {
    return { id: url || "err", type: "url", title: "加载失败", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  try {
    params = params || {};
    var raw = String(params.link || params.url || params.id || "");
    if (!raw) return [];
    if (raw.indexOf("https://api.videplay.us/vod/v-master.m3u8/") === 0) {
      return [{ name: "正片", url: raw, playerType: "system" }];
    }
    var url = raw;
    if (!/^https?:\/\//i.test(url)) url = HOST + "/" + url.replace(/^\/+|\/+$/g, "") + "/";
    if (url.indexOf("missav.bz/") < 0) return [];
    var src = await resolveMaster(url, "");
    if (!src) return [];
    return [{ name: "正片", url: src, playerType: "system" }];
  } catch (e) {
    return [];
  }
}
