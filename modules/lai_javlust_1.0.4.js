// v1.0.4：AVDB 样式详情：peoples/genreItems + 点按路由
// v1.0.3（2026-11-16）：修“有档位播不了、一直转圈”。根因：1.0.1 的 resolveFinal
// v1.0.3（2026-11-21）：补顶层 search 键（A 键，照 64 个可见模块的众数形状）；B 条目与 search 函数一个字未动。
//   在真机上恒回 ""——Widget.http.get 不按 Node shim 的方式暴露跟随后的最终
//   R2 地址（res.url 与 headers.location 均取不到），集里留的是 javtiful
//   签名直链；播放器跟 302 到 R2 后 HEAD 探针回 403（R2 预签名只认 GET，
//   VM 实测：R2 HEAD 403、Range GET 206 首字节真 MP4），故转圈。修法：
//   模块不再直接交 R2/签名地址，改交 javlust-r2 Worker（服务端跟 302、
//   流式回传、HEAD 回 200，见 fixD/javlust-r2-worker.js，须用户先部署）；
//   集 videoUrl 为 Worker 地址，loadResource 同款；去掉顶层 videoUrl。
// JavLust for REX (lai_javlust v1.0.1)
// v1.0.1 修复真机一直加载：1.0.0 把 javtiful 签名 MP4 直链交给播放器，播放器要
// 完成 302 跳到 R2 才能播（VM 实测：签名地址本身无 UA/Referer/IP 要求，
// 但 R2 预签名只认 GET，HEAD 探针回 403；302 跳本身就是一层可断的环节）。
// 改法：模块内用 Range: bytes=0-1 的 GET 跟 302、取最终 R2 直链交给播放器
// （R2 直链裸取 Range 206、首字节真 MP4，任何 UA/Referer/出口都通）；
// 解析失败时回落原签名地址；loadDetail 入口补 unwrapLink（运行时可能传对象）。
// 2026-11-15 L2 组新写：详情嵌 javtiful.com/embed/{tid}，播放走 JavTiful 票据链。
// 列表：卡片 <a href="/video/{id}/{slug}">，封面 data-src=https://upload18.cc/v/{CODE}/poster.jpg，
//   标题在 h6 链接 title 属性，时长 🕓；分页 ?page=N。
// 详情：页内 iframe https://javtiful.com/embed/{tid}；embed 页内联 JSON "playback"
//   {endpoint:"/video/{tid}/playback", ticket:"p1.{tid}.0.{ts}.{hash}"}；
//   POST 该 endpoint（ticket 表单体，头 X-Requested-With + Referer embed 页）取 sources；
//   src 为相对地址须补 javtiful.com 绝对地址，302 跳 R2 直链 MP4；
//   CKCK-020/MIDA-348/LULU-405 三部实测皆单档 720p、无 fallbackSrc，
//   故只出单行「720p」，不编造档位；票据约 30 分钟，loadDetail 现取现投，
//   每集带 videoUrl（playerType "system"），loadResource 只作回落重解。
// 字幕：REX 侧由 lai_subtitleagg 聚合模块提供，本模块不内联字幕。
WidgetMetadata = {
  id: "lai_javlust",
  title: "JavLust",
  description: "JavLust（javlust.net）：破解减码/最新/有码/无码/素人/最多观看，详情现解 JavTiful 票据、单档 720p 直链",
  author: "lai",
  version: "1.0.4",
  requiredVersion: "0.0.1",
  site: "https://javlust.net",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "破解减码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/reducing-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/censored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/uncensored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/amateur" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "最多观看", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/most-viewed" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
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

var HOST = "https://javlust.net";
var TIFUL = "https://javtiful.com";
var WORKER = "https://javlust-r2.li768435813.workers.dev";

// 签名/R2 直链一律经 Worker 中转交给播放器（Worker 服务端跟 302、流式回传、
// HEAD 回 200；R2 预签名只认 GET，播放器直接探 R2 会 403 转圈）。
function proxyUrl(signed) {
  var u = t(signed);
  if (!u) return "";
  return WORKER + "/play?u=" + encodeURIComponent(u);
}
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

function absTiful(url) {
  url = t(url);
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.charAt(0) === "/") return TIFUL + url;
  return TIFUL + "/" + url;
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": referer || HOST + "/"
  };
}

async function getText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function parseCards(html) {
  var items = [];
  var seen = {};
  var re = /<a[^>]*href="(\/video\/\d+\/[^"]+)"[^>]*>([\s\S]{0,1200}?)<\/a>/gi;
  var m;
  while ((m = re.exec(html))) {
    var href = m[1];
    if (seen[href]) continue;
    seen[href] = 1;
    var inner = m[2];
    var pic = "";
    var dm = inner.match(/data-src\s*=\s*"([^"]+)"/i);
    if (dm && dm[1] && !/placeholder/i.test(dm[1])) pic = dm[1];
    if (!pic) {
      var sm = inner.match(/<img[^>]*src\s*=\s*"([^"]+)"/i);
      if (sm && sm[1] && !/placeholder/i.test(sm[1]) && sm[1].indexOf("data:image") !== 0) pic = sm[1];
    }
    var bm = inner.match(/badge[^>]*>([^<]+)</i);
    var code = bm ? cleanText(bm[1]) : "";
    var tail = html.slice(m.index + m[0].length, m.index + m[0].length + 1200);
    var title = "";
    var tm = tail.match(/<h6[^>]*>\s*<a[^>]*title="([^"]+)"/i);
    if (tm) title = cleanText(tm[1]);
    if (!title) title = code || href.split("/").pop().replace(/-/g, " ");
    if (!title || title.length < 2) continue;
    var du = tail.match(/🕓\s*([\d:]+)/);
    var url = absUrl(href);
    items.push({
      id: url,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: url,
      description: du ? du[1] : (code || ""),
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
  cat = t(cat) || "/";
  var base = cat;
  if (base.charAt(0) !== "/") base = "/" + base;
  if (base.indexOf("?") >= 0) {
    return HOST + base + "&sort=latest" + (page > 1 ? "&page=" + page : "");
  }
  var u = HOST + base;
  if (u.charAt(u.length - 1) === "/") u = u.slice(0, -1);
  return u + "/?sort=latest" + (page > 1 ? "&page=" + page : "");
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var cat = String(params.path || params.cat || "/");
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
  var url = HOST + "/search/?q=" + encodeURIComponent(wd) + (page > 1 ? "&page=" + page : "");
  try {
    var html = await getText(url, HOST + "/");
    return listOrMsg(html, url);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
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

// 详情 -> embed -> 票据 POST 取 sources（现取现投）；返回 { quals, fbUrl, embedUrl }
async function resolveSources(durl, html) {
  var out = { quals: [], fbUrl: "", embedUrl: "" };
  try {
    var em = String(html || "").match(/javtiful\.com\/embed\/(\d+)/i);
    if (!em) return out;
    out.embedUrl = TIFUL + "/embed/" + em[1];
    var ehtml = await getText(out.embedUrl, durl);
    var pm = ehtml.match(/"playback"\s*:\s*\{\s*"endpoint"\s*:\s*"([^"]+)"\s*,\s*"ticket"\s*:\s*"([^"]+)"/i);
    if (!pm) return out;
    var endpoint = pm[1].indexOf("http") === 0 ? pm[1] : TIFUL + pm[1];
    var raw = await httpPostRaw(endpoint, "ticket=" + encodeURIComponent(pm[2]), {
      "User-Agent": UA,
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
      "Referer": out.embedUrl
    });
    if (raw == null) return out;
    var j = null;
    try { j = typeof raw === "string" ? JSON.parse(raw) : raw; } catch (e) { j = null; }
    if (j && j.success && j.sources && j.sources.length) {
      var seenSrc = {};
      for (var i = 0; i < j.sources.length; i++) {
        var s = j.sources[i];
        if (!s) continue;
        if (s.src) {
          var full = absTiful(s.src);
          if (seenSrc[full]) continue;
          seenSrc[full] = 1;
          var lm = String(s.src).match(/\/(\d+)p\//);
          var h = lm ? parseInt(lm[1], 10) : (parseInt(s.size, 10) || 0);
          var label = h ? (h + "p") : (t(s.label) || (t(s.size) || "正片"));
          out.quals.push({ name: label, h: h, url: full });
        }
        if (s.fallbackSrc && !out.fbUrl) out.fbUrl = absTiful(s.fallbackSrc);
      }
      out.quals.sort(function (a, b) { return b.h - a.h; });
      // 签名直链不跟 302（真机上取不到最终地址，且 R2 直链 HEAD 403）：
      // quals 留签名地址，调用方（loadDetail/loadResource）包一层 Worker 地址再交播放器。
    }
  } catch (e) { /* 降级：quals 为空 */ }
  return out;
}

// ---- AVDB 样式详情：演员/分类（点按出对应全部内容）----
// 详情页 HTML 里扫演员/分类链接（站内同源），建成 peoples / genreItems；
// 点按后 loadDetail 走分类页分支（loadList 取该分类的全部影片，取不到则 search 回落）。
var TAX_HOST_OVERRIDE = "";
var TAX_BASE = HOST;
var TAX_ACTRESS_RE = /\/(actress(es)?|actors?|pornstars?|stars?|models?|performers?|idols?)\//i;
var TAX_GENRE_RE = /\/(genres?|tags?|categor(?:y|ies)|category|labels?|makers?|channels?)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)|category|actress(es)?|actors?|pornstars?|stars?|models?|makers?|channels?|labels?|all|全部|分类|演员|标签|女优|题材|片商)$/i;
function taxAbs(href) {
  var s = String(href || "").split("#")[0];
  if (/^https?:\/\//i.test(s)) return s;
  if (s.indexOf("//") === 0) return "https:" + s;
  var base = TAX_HOST_OVERRIDE || TAX_BASE;
  base = String(base || "").replace(/\/+$/, "");
  if (s.charAt(0) === "/") return base + s;
  return base + "/" + s;
}
function taxSlugOf(abs, isActress) {
  var path = String(abs || "").split("?")[0].split("#")[0];
  var vm = path.match(/\/(vodtype|vodshow)\/(\d+)/i);
  if (vm) return vm[2];
  var parts = path.replace(/^https?:\/\/[^/]+\//, "").split("/");
  var segs = [];
  for (var i = 0; i < parts.length; i++) { if (parts[i]) segs.push(parts[i]); }
  while (segs.length && (/^\d+\.html$/i.test(segs[segs.length - 1]) || /^\d+$/.test(segs[segs.length - 1]) || segs[segs.length - 1] === "page")) segs.pop();
  for (var j = 0; j < segs.length; j++) {
    if (/_(category|makersr)$/i.test(segs[j]) && segs[j + 2]) return segs[j + 2];
  }
  if (!segs.length) return "";
  var last = segs[segs.length - 1];
  if (/^(genres?|tags?|categor(?:y|ies)|category|labels?|makers?|channels?|actress(es)?|actors?|pornstars?|stars?|models?|performers?|idols?)$/i.test(last)) return "";
  return last;
}
function extractTaxonomyFromHtml(html, hostOverride) {
  if (hostOverride) TAX_HOST_OVERRIDE = hostOverride;
  var peoples = [];
  var genreItems = [];
  var seenP = {};
  var seenG = {};
  var baseHost = String(TAX_HOST_OVERRIDE || TAX_BASE || "").replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(String(html || ""))) !== null) {
    var href = m[1] || "";
    var name = String(m[2] || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (!name || name.length > 40 || TAX_NAV_NAME_RE.test(name)) continue;
    var abs = taxAbs(href).split(" ").join("%20");
    if (!/^https?:\/\//i.test(abs)) continue;
    var host = abs.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (baseHost && host !== baseHost) continue;
    var isA = TAX_ACTRESS_RE.test(abs);
    var isG = !isA && TAX_GENRE_RE.test(abs);
    if (!isA && !isG) continue;
    var seg = taxSlugOf(abs, isA);
    if (!seg) continue;
    if (isA) {
      if (seenP[abs]) continue;
      seenP[abs] = 1;
      peoples.push({ id: abs, title: name, name: name, link: abs, role: "演员" });
    } else {
      if (seenG[abs]) continue;
      seenG[abs] = 1;
      genreItems.push({ id: abs, title: name });
    }
    if (peoples.length >= 20 && genreItems.length >= 20) break;
  }
  return { peoples: peoples, genreItems: genreItems };
}
function taxNameFromUrl(url) {
  var s = String(url || "");
  if (s.indexOf("actor:") === 0) return s.slice(6);
  if (s.indexOf("tag:") === 0) return s.slice(4);
  if (s.indexOf("g:") === 0) return s.slice(2);
  var seg = taxSlugOf(s, false);
  var name = seg;
  try { name = decodeURIComponent(seg); } catch (e) { name = seg; }
  return String(name || "").replace(/\+/g, " ").trim();
}
async function taxPrimaryWorks(url, name, isActress) {
  var p = String(url || "").replace(/^https?:\/\/[^/]+\//, "").replace(/\/page\/\d+\/?$/i, "").replace(/\/+$/, "");
  try { return await loadList({ path: p, page: 1 }); } catch (e) { return []; }
}
async function taxRouteDetail(url, isActress) {
  var name = taxNameFromUrl(url);
  var works = [];
  try { works = await taxPrimaryWorks(url, name, isActress) || []; } catch (e) { works = []; }
  if (!Array.isArray(works)) works = [];
  var real = works.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
  if (!real.length) {
    try { var sw = await search({ keyword: name }); if (Array.isArray(sw)) works = sw; } catch (e2) {}
    real = (works || []).filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
  }
  return { id: url, type: "detail", mediaType: "movie", title: name || (isActress ? "演员" : "分类"), link: url, description: (isActress ? "演员" : "分类") + " · 共 " + real.length + " 部作品", videoUrl: "", childItems: [], relatedItems: real.length ? real : works };
}


async function loadDetail(link) {
  try {
    var url = unwrapLink(link);
    if (!url && typeof link === "string") url = t(link);
    if (!/^https?:\/\//i.test(url)) url = absUrl(url);
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    if (TAX_ACTRESS_RE.test(url) || TAX_GENRE_RE.test(url) || url.indexOf("actor:") === 0 || url.indexOf("tag:") === 0) { return await taxRouteDetail(url, TAX_ACTRESS_RE.test(url) || url.indexOf("actor:") === 0); }
    var html = await getText(url, HOST + "/");
    var title = firstMatch(html, /<title>([^<]*)<\/title>/i) || "JavLust";
    title = cleanText(title);
    var pic = "";
    var pm = html.match(/https:\/\/upload18\.cc\/v\/([A-Za-z0-9-]+)\/poster\.jpg(?!&)/i);
    if (pm) pic = "https://upload18.cc/v/" + pm[1] + "/poster.jpg";
    var rs = await resolveSources(url, html);
    var quals = rs.quals;
    if (!quals.length && rs.fbUrl) quals.push({ name: "正片", h: 0, url: rs.fbUrl });
    if (!quals.length) {
      if (rs.embedUrl) {
        var webItem = { id: rs.embedUrl, type: "url", title: title + " 网页播放", name: "网页播放", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, videoUrl: rs.embedUrl, link: rs.embedUrl, posterPath: pic, coverUrl: pic, playerType: "app" };
        var webTax = extractTaxonomyFromHtml(html);
        var webRet = {
          id: url, type: "detail", title: title, link: url,
          posterPath: pic, coverUrl: pic, backdropPath: pic,
          episodes: [{ name: "网页播放", link: rs.embedUrl }],
          seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: [{ title: "网页播放", videoUrl: rs.embedUrl, episodeNumber: 1 }] }],
          episodeItems: [webItem], childItems: [webItem]
        };
        if (webTax.peoples.length) webRet.peoples = webTax.peoples;
        if (webTax.genreItems.length) webRet.genreItems = webTax.genreItems;
        return webRet;
      }
      return { id: url, type: "url", title: title, description: "未找到播放地址" };
    }
    var referer = rs.embedUrl || url;
    var eps = [];
    var sEps = [];
    var items = [];
    for (var qi = 0; qi < quals.length; qi++) {
      var playUrl = proxyUrl(quals[qi].url);
      eps.push({ name: quals[qi].name, link: quals[qi].url });
      sEps.push({ title: quals[qi].name, videoUrl: playUrl, episodeNumber: qi + 1 });
      items.push({ id: quals[qi].url, type: "url", title: title + " " + quals[qi].name, name: quals[qi].name, mediaType: "movie", seasonNumber: 1, episodeNumber: qi + 1, videoUrl: playUrl, link: quals[qi].url, posterPath: pic, coverUrl: pic, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": referer } });
    }
    var tax = extractTaxonomyFromHtml(html);
    var ret = {
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
    if (tax.peoples.length) ret.peoples = tax.peoples;
    if (tax.genreItems.length) ret.genreItems = tax.genreItems;
    return ret;
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

// 回落：直链原样透传；详情链接现解票据；embed 链接走网页播放；全程 try/catch、永不抛错
async function loadResource(params) {
  try {
    var raw = unwrapLink(params);
    if (!raw) return [];
    if (/javtiful\.com\/embed\//i.test(raw)) {
      return [{ name: "网页播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
    // 已是 Worker 中转地址：直接透传（Worker 服务端跟 302、HEAD 回 200）
    if (raw.indexOf(WORKER) === 0) {
      return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": TIFUL + "/" } }];
    }
    if (/r2\.cloudflarestorage\.com/i.test(raw)) {
      return [{ name: "播放", url: proxyUrl(raw), playerType: "system", customHeaders: { "User-Agent": UA, "Referer": TIFUL + "/" } }];
    }
    if (/\/media\/video\//i.test(raw) || /\.(m3u8|mp4)/i.test(raw)) {
      // 点播时包一层 Worker：签名直链现解现播，R2 直链 1 小时有效
      return [{ name: "播放", url: proxyUrl(raw), playerType: "system", customHeaders: { "User-Agent": UA, "Referer": TIFUL + "/" } }];
    }
    if (/javlust\.net\/video\//i.test(raw)) {
      var html = await getText(raw, HOST + "/");
      var rs = await resolveSources(raw, html);
      var rows = [];
      for (var i = 0; i < rs.quals.length; i++) {
        rows.push({ name: rs.quals[i].name, url: proxyUrl(rs.quals[i].url), playerType: "system", customHeaders: { "User-Agent": UA, "Referer": rs.embedUrl || raw } });
      }
      if (!rows.length && rs.fbUrl) rows.push({ name: "正片", url: proxyUrl(rs.fbUrl), playerType: "system", customHeaders: { "User-Agent": UA, "Referer": rs.embedUrl || raw } });
      if (!rows.length && rs.embedUrl) rows.push({ name: "网页播放", url: rs.embedUrl, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": raw } });
      return rows;
    }
    return [{ name: "播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  } catch (e) {
    return [];
  }
}
