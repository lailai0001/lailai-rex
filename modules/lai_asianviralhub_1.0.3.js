// v1.0.3：AVDB 样式详情修正（实测）：详情页 btn-cat 即本片分类（7 个，无站内导航污染）；
//   本站详情页无演员链接——peoples 留空、不编造；genreItems 补 link；补 loadList peopleId/genreId
//   派发与裸名路由（先分类页、再搜索）。
// AsianViralHub for REX (lai_asianviralhub v1.0.1)
// v1.0.1 翻页修正 (2026-11-02, 只改翻页收尾, 其余一律不动):
//   ① 第 2 页起取不到内容时不再返回假卡片, 改为空列表, 让客户端干净收尾;
//      旧版在末页 (404 或空页) 返回 “没有找到相关内容” / “载入失败” 假卡,
//      客户端会把它当成一条真实视频继续展示、继续翻页, 看起来就是 “翻页断了”;
//   ② 页码取值放宽: 字符串 / 数字 / 包一层 value 的页码都能读出, 分类键除
//      path/cat 外再认 category; 正常调用的取值与旧版完全一致, 第 1 页行为不变。
//   其余: 28 分类、翻页 URL 形式 (/categories/{{slug}}/{{n}}/)、解析口径 (24 条封顶)、
//   详情与播放均与 1.0.0 逐字一致。
// 移植自 mira-cat 蜘蛛 asian.js (KVS 同构站模板 makeSpider), 后端: https://asianviralhub.com/。
// 列表: <a href="https://asianviralhub.com/video/{{id}}/{{slug}}/" title="..."> 内
//   <img data-original="..."> 或 <img src="...">, 与蜘蛛 parseList 同口径 (取卡片后 3000 字符内找图)。
// 分类: 蜘蛛尾部 makeSpider 调用的 CATEGORIES 原样照搬, 共 28 个, 不增不减。
// 详情: flashvars 里 video_url 即 get_file mp4 直链 (带时效参数, 详情时现取),
//   preview_url 为封面。仅 video_url 单线, 无 alt 档
// 搜索: /search/{{kw}}/ (分页 /search/{{kw}}/{{n}}/); 分类分页 /categories/{{slug}}/{{n}}/。
// 封面与播放均为站方直链, 蜘蛛未走任何代理, 模块同样直连, 不复用 Worker。

WidgetMetadata = {
  id: "lai_asianviralhub",
  title: "AsianViralHub",
  description: "AsianViralHub（https://asianviralhub.com）：KVS 同构站，28 个分类，详情 get_file mp4 直链；v1.0.1 翻页修正：第 2 页起末页空页返回空列表",
  author: "lai",
  version: "1.0.3",
  requiredVersion: "0.0.1",
  site: "https://asianviralhub.com/",
  detailCacheDuration: 180,
  modules: [
    { title: "Leaked", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "leaked/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Porn", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "porn/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Sextape", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "sextape/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Solo", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "solo/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "AV Idol", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "av-idol/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Porn Actress", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "porn-actress/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "AI Generated", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ai-generated/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Fisting", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "fisting/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "South Korean", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "south-korean/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Camgirl", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "camgirl/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Housewife", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "housewife/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "JAV Uncensored", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "jav-uncensored/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "XXX", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "xxx/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "XX", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "xx/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Blonde", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "blonde/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Bigbooty", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "bigbooty/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Hairy", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "hairy/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Striptease", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "striptease/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Twerking", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "twerking/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Riding Dildo", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "riding-dildo/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Ebony", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ebony/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Close Up", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "close-up/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Fake Tits", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "fake-tits/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Smoking", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "smoking/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Roommate", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "roommate/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Pajamas", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "pajamas/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Music", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "music/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Desires", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "desires/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "搜索", functionName: "search", cacheDuration: 180, params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] }
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

var BASE = "https://asianviralhub.com";
var HOST = "https://asianviralhub.com/";
var VIDEOPATH = "video/";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var FIRST_CAT = "leaked/";

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": referer || HOST
  };
}

function t(v) {
  return String(v == null ? "" : v).trim();
}

// 翻页取值放宽 (正常调用与旧版完全一致): 页码可为字符串 / 数字 / 包一层 value 的对象,
// 字符串里夹带数字 (如 "page=2") 也取首个数字; 无数字则回 1。
function pickPage(raw) {
  if (raw == null) return 1;
  if (typeof raw === "number") return Math.max(1, Math.floor(raw) || 1);
  if (typeof raw === "object") {
    var inner = raw.value != null ? raw.value : (raw.page != null ? raw.page : raw.index);
    return pickPage(inner);
  }
  var m = String(raw).match(/\d+/);
  return m ? Math.max(1, parseInt(m[0], 10)) : 1;
}

// 分类键放宽: path / cat / category, 皆无则回首分类; 正常调用与旧版完全一致。
function pickPath(params) {
  params = params || {};
  return t(params.path || params.cat || params.category) || FIRST_CAT;
}

function stripTags(s) {
  return String(s || "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}

function decodeAmp(s) {
  return String(s || "").replace(/&amp;/g, "&");
}

function firstMatch(text, re, idx) {
  var m = String(text || "").match(re);
  return m ? m[idx || 1] || "" : "";
}

function escRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseList(html) {
  var items = [];
  var seen = {};
  var re = new RegExp('<a[^>]*href="(' + escRe(HOST) + VIDEOPATH + '\\d+/[^"]+)"[^>]*title="([^"]*)"', "gi");
  var m;
  while ((m = re.exec(String(html || ""))) !== null) {
    var url = m[1];
    if (seen[url]) continue;
    var seg = String(html).slice(m.index, m.index + 3000);
    var im = seg.match(/data-original="(https?:[^"]+)"/i) || seg.match(/<img[^>]*src="(https?:[^"]+)"/i);
    var title = stripTags(m[2]);
    if (!title || title.length < 2) continue;
    seen[url] = 1;
    var cover = im ? im[1] : "";
    items.push({
      id: url,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: url,
      description: "",
      mediaType: "movie"
    });
    if (items.length >= 24) break;
  }
  return items;
}

async function getText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders(HOST) });
  return res && res.data != null ? String(res.data) : "";
}

function taxSlugOfUrl(u) {
  var s = String(u || "").split("?")[0].split("#")[0];
  var parts = s.split("/");
  for (var i = parts.length - 1; i >= 0; i--) { if (parts[i]) { try { return decodeURIComponent(parts[i]); } catch (e) { return parts[i]; } } }
  return "";
}
function taxIsRealWorks(works) {
  if (!Array.isArray(works)) return false;
  for (var i = 0; i < works.length; i++) {
    if (works[i] && works[i].id !== "err" && works[i].id !== "err_cf" && works[i].id !== "empty") return true;
  }
  return false;
}
async function loadList(params) {
  params = params || {};
  // App 点按派发：peopleId/genreId/url/link（本站无演员页，peopleId 回落搜索）。
  var dRaw = t(params.peopleId || params.genreId || params.url || params.link || "");
  if (dRaw) {
    var dSlug = taxSlugOfUrl(dRaw);
    if (params.peopleId) {
      var pw = await search({ keyword: dSlug || dRaw, page: 1 });
      return pw;
    }
    if (dRaw.indexOf("tag:") === 0) return await search({ keyword: dRaw.slice(4), page: pickPage(params.page) });
    if (/\/tags\//i.test(dRaw)) return await taxTagWorks(dSlug);
    return await loadList({ path: dSlug, page: params.page });
  }
  var page = pickPage(params.page);
  var tid = pickPath(params);
  var clean = tid.replace(/^\/+/, "").replace(/\/+$/, "");
  var base = HOST + "categories/" + clean;
  var url = page === 1 ? (base + "/") : (base + "/" + page + "/");
  try {
    var html = await getText(url);
    var list = parseList(html);
    if (list.length) return list;
    // 第 2 页起无内容 = 已到末页: 返回空列表让客户端干净收尾, 绝不返回假卡片。
    // 第 1 页保持旧版占位卡, 行为不变。
    if (page > 1) return [];
    return [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
  } catch (e) {
    if (page > 1) return [];
    return [{ id: "err", type: "url", title: "载入失败", description: String((e && e.message) || e) + " | URL: " + url }];
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
  var page = pickPage(params.page);
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var url = HOST + "search/" + encodeURIComponent(wd) + "/";
  if (page > 1) url += page + "/";
  try {
    var html = await getText(url);
    var list = parseList(html);
    if (list.length) return list;
    // 与 loadList 同一条翻页收尾规则: 第 2 页起无内容返回空列表, 第 1 页占位卡不变。
    if (page > 1) return [];
    return [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
  } catch (e) {
    if (page > 1) return [];
    return [{ id: "err", type: "url", title: "搜索失败", description: String((e && e.message) || e) + " | URL: " + url }];
  }
}

// 与蜘蛛 detail 同口径: 仅取 video_url 单线 (flashvars), 兜底 get_file 直链正则;
// 蜘蛛原样未解 &amp;, 模块侧补解码 (与 ultra 模板一致, 不改变地址本身)。
function extractVideoUrl(html) {
  var vm = String(html || "").match(/video_url['"]?\s*[:=]\s*['"]([^'"]+)/i) || String(html || "").match(/https?:\/\/[^\s"'<>]+\/get_file\/[^\s"'<>]+\.mp4[^\s"'<>]*/i);
  return vm ? decodeAmp(vm[1]) : "";
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
  // 只取本片标签区：btn-cat（7 个分类）与 btn-tags（57 个标签）锚；
  // 侧栏“Top models”（Ariaboobie 32 / onlyfans 46，站内榜单带计数）一律不要。
  var h = String(html || "");
  var block = "";
  var bRe = /<a[^>]*class\s*=\s*["'][^"']*btn-(?:cat|tags)[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;
  var bm;
  while ((bm = bRe.exec(h)) !== null) { block += " " + bm[0]; }
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(block)) !== null) {
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
      genreItems.push({ id: abs, title: name, name: name, link: abs });
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
async function taxTagWorks(slug) {
  try {
    var th = await getText(HOST + "tags/" + slug + "/");
    var tl = parseList(th);
    if (tl && tl.length) return tl;
  } catch (e) {}
  return [];
}
async function taxPrimaryWorks(url, name, isActress) {
  var m = String(url || "").match(/\/categories\/([^/?#]+)/i);
  if (m) { try { return await loadList({ path: m[1], page: 1 }); } catch (e) { return []; } }
  // 标签页 /tags/<slug>/ 是真实列表（实测 37 条），直接取，不走搜索。
  var tm = String(url || "").match(/\/tags\/([^/?#]+)/i);
  if (tm) { try { return await taxTagWorks(tm[1]); } catch (e) { return []; } }
  return [];
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
    var taxRaw = (typeof link === "string" ? link : (link && (link.link || link.id || link.url || link.title || link.name)) || "");
    taxRaw = String(taxRaw || "");
    if (taxRaw && (TAX_ACTRESS_RE.test(taxRaw) || TAX_GENRE_RE.test(taxRaw) || taxRaw.indexOf("actor:") === 0 || taxRaw.indexOf("tag:") === 0)) { return await taxRouteDetail(taxRaw, TAX_ACTRESS_RE.test(taxRaw) || taxRaw.indexOf("actor:") === 0); }
    // 裸名点按：先走分类页（/categories/<slug>/），无内容再走搜索。
    if (taxRaw && taxRaw.indexOf("/") < 0 && taxRaw.indexOf("http") !== 0) {
      var bareSlug = taxRaw.trim().toLowerCase().replace(/\s+/g, "-");
      var bw = await loadList({ path: bareSlug, page: 1 });
      if (taxIsRealWorks(bw)) return { id: HOST + "categories/" + bareSlug + "/", type: "detail", mediaType: "movie", title: taxRaw, link: HOST + "categories/" + bareSlug + "/", description: "分类 · 共 " + bw.length + " 部作品", videoUrl: "", childItems: [], relatedItems: bw };
      var sw2 = await search({ keyword: taxRaw, page: 1 });
      return { id: "search:" + taxRaw, type: "detail", mediaType: "movie", title: taxRaw, link: HOST + "search/" + encodeURIComponent(taxRaw) + "/", description: "搜索 · 共 " + (sw2 || []).length + " 部作品", videoUrl: "", childItems: [], relatedItems: sw2 || [] };
    }
    var url = taxRaw || String(link || "");
    if (!/^https?:\/\//i.test(url)) url = HOST + url.replace(/^\/+/, "");
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var html = await getText(url);
    var title = firstMatch(html, /<title>([\s\S]{0,300}?)<\/title>/i) || "AsianViralHub";
    var cover = decodeAmp(firstMatch(html, /preview_url['"]?\s*[:=]\s*['"]([^'"]+)/i));
    var name = stripTags(title) || url;
    var videoUrl = extractVideoUrl(html);
    if (!videoUrl) {
      return { id: url, type: "url", title: name, description: "未找到播放地址" };
    }
    var tax = extractTaxonomyFromHtml(html);
    var ret = {
      id: url,
      type: "detail",
      title: name,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": HOST
      }
    };
    if (tax.peoples.length) ret.peoples = tax.peoples;
    if (tax.genreItems.length) ret.genreItems = tax.genreItems;
    return ret;
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
