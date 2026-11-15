// v1.0.2（2026-11-16）：修“有档位播不了、一直转圈”。根因：1.0.1 的集 videoUrl
//   是详情时铸的 mostplayer 票据（180 秒，实测约 9 分钟仍活但终会过期），
//   loadResource 的 unwrapLink 又 videoUrl 优先——App 传集对象时直接把旧票据
//   原样交播放器，绝不重新现铸；详情页停留稍久或点播时票据已过期 → 转圈。
//   （Worker /resolve 本身实测全活：真 slug 200 回新鲜直链，Range GET 206。
//   mostplayer HEAD 回 403 是站方常态，Range GET 206 才是可播判据。）修法：
//   集改为懒解析（不带 videoUrl 键，link 记详情页地址），点播必走 loadResource
//   经 Worker 重新现铸；详情顶层去掉 videoUrl、type 改回 "detail"；
//   loadResource 入参里若有详情地址，优先按它重铸，不直接播旧票据。
// jav.do for REX (lai_javdo v1.0.1)
// v1.0.1（2026-11-16）：修“解析出地址却播不了”。根因：MP4 票据只有 180 秒有效，
//   1.0.0 在 loadDetail 时现铸现投进集 videoUrl，App 直接播该地址、绝不调
//   loadResource；用户点开详情后过 180 秒再点播，票据已过期 → 一直加载。
//   修法（照猫源 py_javdo 同款思路改成 REX 形态）：
//   ① 解析主路改走已部署的 javdo-fetch Worker（GET /resolve?u=<详情URL>，
//      Worker 单次调用内完成 详情页取 Cookie -> POST resolve 全链，返回新鲜直链；
//      沙箱里只要 GET，不用 POST、不用 Cookie）；直连 POST 保留作回落。
//   ② loadDetail 先解包对象入参（运行时传卡片对象时 String() 得 "[object Object]"
//      会 404），再经 Worker 现铸现投；③ loadResource 点播时经 Worker 重新现铸
//      （点播那刻的地址一定新鲜），失败再直连重解；④ 任何情况都不回空——
//      现铸失败给站内嗅探回落（embed 页，无则详情页，playerType "app"）。
// 2026-11-15 L2 组新写：Laravel 站，视频页 /videos/<slug>，播放走站方 resolve。
// 列表：卡片 <a href="https://jav.do/videos/<slug>" title="CODE - 标题" aria-label=…>
//   内 <img src="https://img.jav.do/videos/…-poster-….webp">；分页 ?page=N。
// 详情：按钮 data-resolve-url="…/videos/<slug>/servers/{id}/resolve"、
//   data-embed-url="https://www.dooplayer.com/embed/e/…"；
//   POST resolve（body '{}'，头 Accept/Content-Type/X-CSRF-TOKEN/
//   X-Requested-With + 同会话 Cookie）回 {"ok":true,"type":"video",
//   "url":"https://cdn.mostplayer.com/stream?t=…",
//   "proxy_url":"…/servers/{id}/media","fallback_url":"…dooplayer…","expires_in":180}；
//   直链 url 新鲜时 200 video/mp4；proxy_url 实测恒 502、
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
  version: "1.0.2",
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
var WORKER = "https://javdo-fetch.li768435813.workers.dev";

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

// Worker 中转解析（主修法，与猫源同款）：GET {WORKER}/resolve?u=<详情URL>，
// Worker 在单次调用内完成 详情页取 Cookie -> POST resolve 全链，返回新鲜直链；
// 沙箱里只要 GET，不用 POST、不用 Cookie。失败返回空，不抛错。
async function resolveViaWorker(durl) {
  var out = { url: "", embedUrl: "" };
  try {
    var res = await Widget.http.get(WORKER + "/resolve?u=" + encodeURIComponent(durl), { headers: { "User-Agent": UA } });
    var raw = res && res.data != null ? res.data : "";
    var j = null;
    try { j = typeof raw === "string" ? JSON.parse(raw) : raw; } catch (e) { j = null; }
    if (j && j.ok && j.url) out.url = String(j.url);
    if (j && j.embedUrl) out.embedUrl = String(j.embedUrl);
  } catch (e) { /* 降级 */ }
  return out;
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

// unwrapLink：App 可能把卡片对象直接传给 loadDetail/loadResource，String(对象)
// 得 "[object Object]"，递归从对象/字符串/数组里抠出链接字符串，优先 videoUrl
// （集对象自带可播地址）。
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

function buildDetail(url, title, pic, mp4Url, embedUrl) {
  var eps = [];
  var sEps = [];
  var items = [];
  if (mp4Url) {
    // 懒解析集：不带 videoUrl 键（票据 180 秒，详情时铸的地址点播时已过期），
    // 点播走 loadResource 经 Worker 重新现铸；link 记详情页地址。
    eps.push({ name: "正片", link: url });
    sEps.push({ title: "正片", episodeNumber: 1 });
    items.push({ id: url, type: "url", title: title + " 正片", name: "正片", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, link: url, posterPath: pic, coverUrl: pic, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": url } });
  }
  if (embedUrl) {
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
    episodes: eps,
    seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: sEps }],
    episodeItems: items,
    childItems: items
  };
}

async function loadDetail(link) {
  try {
    var url = unwrapLink(link);
    if (!/^https?:\/\//i.test(url)) url = absUrl(url);
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var r = await getFull(url, HOST + "/");
    var html = r.body;
    if (!html) return { id: url, type: "url", title: "解析失败", description: "详情页为空" };
    var title = firstMatch(html, /<title>([^<]*)<\/title>/i) || "jav.do";
    title = cleanText(title);
    var pic = firstMatch(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    var rs = await resolveViaWorker(url);
    if (!rs.url) {
      var cookie = cookieFromHeaders(r.headers);
      rs = await resolvePlay(url, html, cookie);
    }
    var d = buildDetail(url, title, pic, rs.url, rs.embedUrl);
    if (d) return d;
    return { id: url, type: "url", title: title, description: "未找到播放地址" };
  } catch (e) {
    return { id: String((link && link.link) || link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// 从入参对象里抠 jav.do 详情地址（旧版缓存详情的集只有 mostplayer 票据地址，
// link/id 里若有详情地址，点播时优先按它重新现铸）。
function detailUrlOf(params) {
  if (!params || typeof params !== "object") return "";
  var cands = [params.link, params.url, params.id];
  if (params.item && typeof params.item === "object") cands.push(params.item.link, params.item.url, params.item.id);
  for (var i = 0; i < cands.length; i++) {
    var s = cands[i];
    if (typeof s === "string" && /jav\.do\/videos\//i.test(s)) return s;
  }
  return "";
}

// 回落：直链原样透传；详情链接点播时经 Worker 重新现铸（票据 180 秒，点播那刻
// 的地址一定新鲜），Worker 失败再直连重解；仍失败给站内嗅探回落；全程
// try/catch、永不抛错、永不回空。
async function loadResource(params) {
  try {
    var raw = unwrapLink(params);
    if (!raw) return [];
    if (/dooplayer\.com/i.test(raw)) {
      return [{ name: "网页播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
    // 旧版缓存详情的集自带 mostplayer 地址（详情时铸的票据已过期）：若入参里
    // 另有 jav.do 详情地址，优先按详情地址重新现铸，绝不直接播旧票据。
    var durl = detailUrlOf(params);
    if (durl) raw = durl;
    if (/mostplayer\.com\/stream/i.test(raw) || /\.(m3u8|mp4)/i.test(raw)) {
      return [{ name: "正片", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
    if (/jav\.do\/videos\//i.test(raw)) {
      var rs = await resolveViaWorker(raw);
      if (!rs.url) {
        var r = await getFull(raw, HOST + "/");
        if (r.body) {
          var cookie = cookieFromHeaders(r.headers);
          rs = await resolvePlay(raw, r.body, cookie);
        }
      }
      var rows = [];
      if (rs.url) rows.push({ name: "正片", url: rs.url, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": raw } });
      if (rs.embedUrl) rows.push({ name: "网页播放", url: rs.embedUrl, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": raw } });
      if (!rows.length) rows.push({ name: "网页播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } });
      return rows;
    }
    return [{ name: "播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  } catch (e) {
    return [];
  }
}
