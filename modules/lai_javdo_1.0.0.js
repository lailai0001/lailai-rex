// jav.do for REX (lai_javdo v1.0.0)
// 2026-11-15 L2 组新写：Laravel 站，视频页 /videos/<slug>，播放走站方 resolve。
// 列表：卡片 <a href="https://jav.do/videos/<slug>" title="CODE - 标题" aria-label=…>
//   内 <img src="https://img.jav.do/videos/…-poster-….webp">；分页 ?page=N。
// 详情：按钮 data-resolve-url="…/videos/<slug>/servers/{id}/resolve"、
//   data-embed-url="https://www.dooplayer.com/embed/e/…"；
//   POST resolve（body '{}'，头 Accept/Content-Type/X-CSRF-TOKEN/
//   X-Requested-With + 同会话 Cookie）回 {"ok":true,"type":"video",
//   "url":"https://cdn.mostplayer.com/stream?t=…",
//   "proxy_url":"…/servers/{id}/media","fallback_url":"…dooplayer…","expires_in":180}；
//   直链 url 新鲜时 200 video/mp4（DLDSS-532 实测 49.9MB）；proxy_url 实测恒 502、
//   dooplayer embed 实测 204 空，故只出单行「正片」MP4，不编造档位。
//   resolve 必须同会话 XSRF-TOKEN Cookie + meta csrf-token，光带 token 不带
//   Cookie 回 419；Cookie 双路——运行侧若回传响应头则显式取 Set-Cookie 发
//   Cookie 头，若不回传则靠 App 共享 Cookie jar；票据 180 秒，loadDetail
//   现取现投、每集带 videoUrl（playerType "system"），loadResource 只作回落重解。
// 字幕：REX 侧由 lai_subtitleagg 聚合模块提供，本模块不内联字幕。
WidgetMetadata = {
  id: "lai_javdo",
  title: "jav.do",
  description: "jav.do：最新/Reducing Mosaic/多类型，详情现解站方 resolve、单档 MP4 直链",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://jav.do",
  detailCacheDuration: 60,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/videos" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Reducing Mosaic", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/search?q=reducing-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/genres/big-tits" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中出", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/genres/creampie" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/genres/married-woman" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "熟女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/genres/mature-woman" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "校园", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/genres/school-girls" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "独角戏", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/genres/solowork" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/genres/amateur" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "剧情", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/genres/drama" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
  ]
};

var HOST = "https://jav.do";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";

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
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

function firstMatch(text, re, idx) {
  var m = String(text || "").match(re);
  return m ? t(m[idx || 1] || "") : "";
}

function absUrl(url) {
  url = t(url);
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.charAt(0) === "/") return HOST + url;
  return HOST + "/" + url;
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": referer || HOST + "/"
  };
}

async function getFull(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  var body = res && res.data != null ? String(res.data) : "";
  var headers = (res && res.headers) || {};
  return { body: body, headers: headers, status: (res && res.status) || 0 };
}

async function getText(url, referer) {
  var r = await getFull(url, referer);
  if (!r.body) throw new Error("空回应");
  return r.body;
}

function parseCards(html) {
  var items = [];
  var seen = {};
  var re = /<a href="(https:\/\/jav\.do\/videos\/[^"]+)" title="([^"]*)" aria-label="[^"]*">([\s\S]{0,2000}?)<\/a>/gi;
  var m;
  while ((m = re.exec(html))) {
    var href = m[1];
    if (seen[href]) continue;
    seen[href] = 1;
    var title = cleanText(m[2]);
    if (!title || title.length < 2) continue;
    var pic = "";
    var im = m[3].match(/<img[^>]*src\s*=\s*"([^"]+)"/i);
    if (im && im[1] && !/placeholder/i.test(im[1])) pic = im[1];
    items.push({
      id: href,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: href,
      description: "",
      mediaType: "movie"
    });
    if (items.length >= 60) break;
  }
  return items;
}

function listOrMsg(html, url) {
  if (!html) return [{ id: "empty", type: "url", title: "空页面" }];
  var list = parseCards(html);
  return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
}

function listUrl(cat, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  cat = t(cat) || "/videos";
  var u = HOST + "/" + cat.replace(/^\/+/, "");
  if (page > 1) u += (u.indexOf("?") >= 0 ? "&" : "?") + "page=" + page;
  return u;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var cat = String(params.path || params.cat || "/videos");
  var url = listUrl(cat, page);
  try {
    var html = await getText(url, HOST + "/");
    return listOrMsg(html, url);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
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
  var url = HOST + "/search?q=" + encodeURIComponent(wd) + (page > 1 ? "&page=" + page : "");
  try {
    var html = await getText(url, HOST + "/");
    return listOrMsg(html, url);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// Set-Cookie -> Cookie 头（只取真实 cookie 名值，剔 expires/path/domain 等属性）
function cookieFromHeaders(headers) {
  try {
    if (!headers) return "";
    var raw = "";
    if (typeof headers.getSetCookie === "function") {
      var arr = headers.getSetCookie();
      if (arr && arr.length) raw = arr.join(", ");
    }
    if (!raw) raw = headers["set-cookie"] || headers["Set-Cookie"] || "";
    if (Array.isArray(raw)) raw = raw.join(", ");
    if (typeof raw !== "string" || !raw) return "";
    var attrs = { expires: 1, path: 1, domain: 1, "max-age": 1, samesite: 1, secure: 1, httponly: 1 };
    var pairs = [];
    var seen = {};
    var re = /([A-Za-z0-9_-]+)=([^;,]+)/g;
    var m;
    while ((m = re.exec(raw))) {
      var name = m[1];
      if (attrs[name.toLowerCase()]) continue;
      if (seen[name]) continue;
      seen[name] = 1;
      pairs.push(name + "=" + t(m[2]));
    }
    return pairs.join("; ");
  } catch (e) {
    return "";
  }
}

// POST（带守卫）：运行时无 post 方法时返回空，调用方按失败降级
async function httpPostRaw(url, bodyText, headers) {
  try {
    if (typeof Widget.http.post === "function") {
      var res = await Widget.http.post(url, bodyText, { headers: headers });
      if (res && res.data != null) return res.data;
      if (typeof res === "string") return res;
    }
  } catch (e) { /* 降级 */ }
  return null;
}

// 详情页 -> resolve POST 取直链（现取现投，票据 180 秒）；返回 { url, embedUrl }
async function resolvePlay(durl, html, cookie) {
  var out = { url: "", embedUrl: "" };
  try {
    var em = String(html || "").match(/data-embed-url="([^"]+)"/i);
    if (em) out.embedUrl = em[1];
    var tm = String(html || "").match(/name="csrf-token"\s+content="([^"]+)"/i);
    var rm = String(html || "").match(/data-resolve-url="([^"]+)"/i);
    if (!tm || !rm) return out;
    var headers = {
      "User-Agent": UA,
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": tm[1],
      "X-Requested-With": "XMLHttpRequest",
      "Referer": durl
    };
    if (cookie) headers["Cookie"] = cookie;
    var raw = await httpPostRaw(rm[1], "{}", headers);
    if (raw == null) return out;
    var j = null;
    try { j = typeof raw === "string" ? JSON.parse(raw) : raw; } catch (e) { j = null; }
    if (j && j.ok && j.url) out.url = String(j.url);
  } catch (e) { /* 降级 */ }
  return out;
}

function buildDetail(url, title, pic, mp4Url, embedUrl) {
  var eps = [];
  var sEps = [];
  var items = [];
  var videoUrl = "";
  var playerType = "system";
  if (mp4Url) {
    videoUrl = mp4Url;
    eps.push({ name: "正片", link: mp4Url });
    sEps.push({ title: "正片", videoUrl: mp4Url, episodeNumber: 1 });
    items.push({ id: mp4Url, type: "url", title: title + " 正片", name: "正片", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, videoUrl: mp4Url, link: mp4Url, posterPath: pic, coverUrl: pic, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": url } });
  }
  if (embedUrl) {
    if (!videoUrl) { videoUrl = embedUrl; playerType = "app"; }
    var n = items.length + 1;
    eps.push({ name: "网页播放", link: embedUrl });
    sEps.push({ title: "网页播放", videoUrl: embedUrl, episodeNumber: n });
    items.push({ id: embedUrl, type: "url", title: title + " 网页播放", name: "网页播放", mediaType: "movie", seasonNumber: 1, episodeNumber: n, videoUrl: embedUrl, link: embedUrl, posterPath: pic, coverUrl: pic, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": url } });
  }
  if (!items.length) return null;
  return {
    id: url,
    type: "detail",
    title: title,
    link: url,
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    videoUrl: videoUrl,
    playerType: playerType,
    customHeaders: { "User-Agent": UA, "Referer": url },
    episodes: eps,
    seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: sEps }],
    episodeItems: items,
    childItems: items
  };
}

async function loadDetail(link) {
  try {
    var url = String(link || "");
    if (!/^https?:\/\//i.test(url)) url = absUrl(url);
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var r = await getFull(url, HOST + "/");
    var html = r.body;
    if (!html) return { id: url, type: "url", title: "解析失败", description: "详情页为空" };
    var title = firstMatch(html, /<title>([^<]*)<\/title>/i) || "jav.do";
    title = cleanText(title);
    var pic = firstMatch(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    var cookie = cookieFromHeaders(r.headers);
    var rs = await resolvePlay(url, html, cookie);
    var d = buildDetail(url, title, pic, rs.url, rs.embedUrl);
    if (d) return d;
    return { id: url, type: "url", title: title, description: "未找到播放地址" };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// unwrapLink：App 可能把集对象直接传给 loadResource，String(对象) 得 "[object Object]"，
// 递归从对象/字符串/数组里抠出链接字符串，优先 videoUrl（集对象自带可播地址）。
function unwrapLink(v) {
  var depth = 0;
  while (v != null && depth < 6) {
    if (typeof v === "string") return t(v);
    if (typeof v !== "object") return "";
    if (Array.isArray(v)) { v = v.length ? v[0] : ""; depth++; continue; }
    if (typeof v.videoUrl === "string" && v.videoUrl) return t(v.videoUrl);
    if (typeof v.link === "string" && v.link) return t(v.link);
    if (typeof v.url === "string" && v.url) return t(v.url);
    if (typeof v.id === "string" && v.id) return t(v.id);
    if (v.item) { v = v.item; depth++; continue; }
    if (v.videoUrl) { v = v.videoUrl; depth++; continue; }
    if (v.link) { v = v.link; depth++; continue; }
    if (v.url) { v = v.url; depth++; continue; }
    if (v.id) { v = v.id; depth++; continue; }
    return "";
  }
  return "";
}

// 回落：直链原样透传；详情链接现解 resolve；embed 链接走网页播放；全程 try/catch、永不抛错
async function loadResource(params) {
  try {
    var raw = unwrapLink(params);
    if (!raw) return [];
    if (/dooplayer\.com/i.test(raw)) {
      return [{ name: "网页播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
    if (/mostplayer\.com\/stream/i.test(raw) || /\.(m3u8|mp4)/i.test(raw)) {
      return [{ name: "正片", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
    if (/jav\.do\/videos\//i.test(raw)) {
      var r = await getFull(raw, HOST + "/");
      if (!r.body) return [];
      var cookie = cookieFromHeaders(r.headers);
      var rs = await resolvePlay(raw, r.body, cookie);
      var rows = [];
      if (rs.url) rows.push({ name: "正片", url: rs.url, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": raw } });
      if (rs.embedUrl) rows.push({ name: "网页播放", url: rs.embedUrl, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": raw } });
      return rows;
    }
    return [{ name: "播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  } catch (e) {
    return [];
  }
}
