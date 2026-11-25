// UltraThots for REX (lai_ultrathots v1.0.0)
// v1.0.3（AVDB 样式详情）：实测详情页本片区块为 .uv-model（演员+头像）与
//   .uv-tags（本片分类/标签）——1.0.2 全页扫把页眉页脚导航（German/British/
//   Swedish…）也当成本片分类，现只取本片区块并加 link；演员页/标签页/分类页
//   均实测干净（演员页 24 部全是本人、含本片），点按直接取页；loadList 接
//   完整 URL 与 peopleId/genreId，loadDetail 接裸名（先演员后标签再分类）。
//   播放（video_url/alt_url 双档）与 backdropPaths（封面）不动，详情加 relatedItems。
// 移植自 mira-cat 蜘蛛 ultra.js (KVS 同构站模板 makeSpider), 后端: https://ultrathots.com/。
// 列表: <a href="https://ultrathots.com/videos/{{id}}/{{slug}}/" title="..."> 内
//   <img data-original="..."> 或 <img src="...">, 与蜘蛛 parseList 同口径 (取卡片后 3000 字符内找图)。
// 分类: 蜘蛛尾部 makeSpider 调用的 CATEGORIES 原样照搬, 共 33 个, 不增不减。
// 详情: flashvars 里 video_url 即 get_file mp4 直链 (带时效参数, 详情时现取),
//   preview_url 为封面。另有 video_alt_url (标注 720p、真实文件更大), 双档时取最高档
// 搜索: /search/{{kw}}/ (分页 /search/{{kw}}/{{n}}/); 分类分页 /categories/{{slug}}/{{n}}/。
// 封面与播放均为站方直链, 蜘蛛未走任何代理, 模块同样直连, 不复用 Worker。
// v1.0.1（2026-11-09，分辨率选择）：extractVideoUrl 只返最高档 →
//   extractVideoUrls 同时返回 video_url（缺省 480p）与 video_alt_url（720p）两档，
//   loadDetail 按档位出 seasons/episodes + episodeItems，每集带 videoUrl 直链；
//   video_alt_url2 恒为 ?login 登录页，绝不采用；不按文件名拼 _1080p（已证 404）。

WidgetMetadata = {
  id: "lai_ultrathots",
  title: "UltraThots",
  description: "UltraThots（https://ultrathots.com）：KVS 同构站，33 个分类，详情 get_file mp4 直链",
  author: "lai",
  version: "1.0.3",
  requiredVersion: "0.0.1",
  site: "https://ultrathots.com/",
  detailCacheDuration: 180,
  modules: [
    { title: "Australian", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "australian/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "British", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "british/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Canadian", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "canadian/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Italian", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "italian/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Onlyfans", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "onlyfans/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Amateur", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "amateur/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Big Tits", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "big-tits/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Babe", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "babe/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Big Ass", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "big-ass/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Masturbation", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "masturbation/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Blowjob", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "blowjob/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Sextapes", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "sextapes/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Solo Female", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "solo-female/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Blonde", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "blonde/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Hardcore", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "hardcore/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Toys", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "toys/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Pov", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "pov/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Cumshot", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "cumshot/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Anal", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "anal/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Big Dick", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "big-dick/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Tattooed Women", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tattooed-women/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Brunette", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "brunette/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Milf", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "milf/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Striptease", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "striptease/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Lesbian", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "lesbian/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Asian", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "asian/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Threesome", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "threesome/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Public", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "public/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Bbc", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "bbc/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Ppv", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ppv/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Creampie", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "creampie/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Joi", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "joi/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "German", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "german/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
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

var BASE = "https://ultrathots.com";
var HOST = "https://ultrathots.com/";
var VIDEOPATH = "videos/";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var FIRST_CAT = "australian/";

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

async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  // 全覆盖派发：App 点 peoples/genreItems 可能调 loadList（peopleId/genreId/
  // url/link），也可能传完整演员/标签/分类页 URL 或裸 slug。
  var tid = t(params.path || params.cat || params.genreId || params.peopleId || params.url || params.link || params.id || "") || FIRST_CAT;
  var full = tid.match(/\/(models|tags?|categories)\/([^/?#]+)/i);
  var base;
  if (full) {
    var kind = full[1].toLowerCase();
    if (kind === "tag") kind = "tags";
    base = HOST + kind + "/" + full[2];
  } else if (tid.indexOf("videos/") >= 0 || tid.indexOf("/videos/") >= 0) {
    return [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } else {
    var clean = tid.replace(/^\/+/, "").replace(/\/+$/, "");
    base = HOST + "categories/" + clean;
  }
  var url = page === 1 ? (base + "/") : (base + "/" + page + "/");
  try {
    var html = await getText(url);
    var list = parseList(html);
    if (list.length) return list;
    return [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
  } catch (e) {
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
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var url = HOST + "search/" + encodeURIComponent(wd) + "/";
  if (page > 1) url += page + "/";
  try {
    var html = await getText(url);
    var list = parseList(html);
    if (list.length) return list;
    return [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败", description: String((e && e.message) || e) + " | URL: " + url }];
  }
}

// 与蜘蛛 detail 同口径: video_url (标注档, 缺省 480p) 与 video_alt_url (标注 720p,
// 真实文件更大) 双档时高清在前、单取最高档; video_alt_url2 恒为 ?login 登录页, 绝不采用;
// 不按文件名拼 _1080p (已证 404)。
function labNum(txt, fallback) {
  var s = String(txt || "").replace(/[^0-9pP]/g, "");
  if (/^\d+p$/i.test(s)) return s.toLowerCase();
  return fallback;
}

// v1.0.1：双档全返（高档在前），不再只取最高档。档位名取站方
// video_*_text 标注（缺省 video_url=480p、video_alt_url=文件名/_720p 或 720p），
// video_alt_url2 恒为 ?login 登录页，绝不采用；不按文件名拼 _1080p（已证 404）。
function extractVideoUrls(html) {
  var vm = String(html || "").match(/video_url['"]?\s*[:=]\s*['"]([^'"]+)/i) || String(html || "").match(/https?:\/\/[^\s"'<>]+\/get_file\/[^\s"'<>]+\.mp4[^\s"'<>]*/i);
  var videoUrl = vm ? decodeAmp(vm[1]) : "";
  var am = String(html || "").match(/video_alt_url['"]?\s*[:=]\s*['"]([^'"]+)/i);
  var altUrl = am ? decodeAmp(am[1]) : "";
  if (!altUrl || !/get_file/i.test(altUrl) || altUrl.indexOf("?login") >= 0) altUrl = "";
  var t1 = firstMatch(html, /video_url_text['"]?\s*[:=]\s*['"]([^'"]+)/i);
  var t2 = firstMatch(html, /video_alt_url_text['"]?\s*[:=]\s*['"]([^'"]+)/i);
  var l1 = labNum(t1, "480p");
  var mAlt = altUrl.match(/_(\d+)p\.mp4/i);
  var l2 = labNum(t2, mAlt ? (mAlt[1] + "p") : "720p");
  var out = [];
  if (videoUrl && altUrl && videoUrl !== altUrl) {
    var n1 = parseInt(l1, 10) || 0;
    var n2 = parseInt(l2, 10) || 0;
    if (n2 >= n1) out.push({ name: l2, url: altUrl }, { name: l1, url: videoUrl });
    else out.push({ name: l1, url: videoUrl }, { name: l2, url: altUrl });
  } else if (videoUrl) {
    out.push({ name: l1, url: videoUrl });
  }
  return out;
}

function extractVideoUrl(html) {
  var all = extractVideoUrls(html);
  return all.length ? all[0].url : "";
}

function taxAbs(href) {
  var s = String(href || "").split("#")[0];
  if (/^https?:\/\//i.test(s)) return s;
  if (s.charAt(0) === "/") return BASE + s;
  return BASE + "/" + s;
}

var TAX_ACTOR_RE = /\/(models?|pornstars?|performer)\//i;
var TAX_GENRE_RE = /\/(categories|tags?)\//i;

function taxSlugFromUrl(url) {
  var s = String(url || "").split("?")[0].split("#")[0].replace(/\/+$/, "");
  var parts = s.split("/");
  var last = parts[parts.length - 1] || "";
  try { last = decodeURIComponent(last); } catch (_) {}
  return last;
}

// ---- AVDB 样式详情：演员/分类（点按出对应全部内容）----
// v1.0.3：只取本片区块——.uv-model__name（演员，头像取同块 .uv-model__ava
//   的 img）与 <div class="uv-tags"> 内的 trailer-link（本片分类/标签）。
//   页眉页脚的 header-link/footer-link 是全站导航（German/British/Swedish…），
//   1.0.2 全页扫会把它们当成本片分类，现绝不收入；同 slug 去重（Italy 与
//   Italian 同指 /categories/italian/，留首个）。
function extractTaxonomyFromHtml(html) {
  var peoples = [];
  var genreItems = [];
  var seenG = {};
  var src = String(html || "");
  var mm = src.match(/<a[^>]*class="[^"]*uv-model__name[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
  if (mm) {
    var mUrl = taxAbs(mm[1]);
    var mName = stripTags(mm[2]);
    var avatar = "";
    var am = src.match(/<a[^>]*class="[^"]*uv-model__ava[^"]*"[^>]*href="[^"]*"[^>]*>\s*<img[^>]*src="([^"]+)"/i);
    if (am) avatar = am[1];
    if (mName && mUrl) peoples.push({ id: mUrl, title: mName, name: mName, link: mUrl, role: "演员", avatar: avatar });
  }
  var ti = src.indexOf("uv-tags");
  if (ti >= 0) {
    var end = src.indexOf("</ul>", ti);
    var block = end >= 0 ? src.slice(ti, end) : src.slice(ti);
    var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    var m2;
    while ((m2 = re.exec(block)) !== null) {
      var href = m2[1] || "";
      var name = stripTags(m2[2]);
      if (!name || name.length > 40) continue;
      var abs = taxAbs(href);
      if (!/^https?:\/\//i.test(abs)) continue;
      if (!TAX_GENRE_RE.test(abs)) continue;
      if (seenG[abs]) continue;
      seenG[abs] = 1;
      genreItems.push({ id: abs, title: name, link: abs });
    }
  }
  return { peoples: peoples, genreItems: genreItems };
}

function slugifyName(name) {
  var s = String(name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return s;
}

function filterRealWorks(list) {
  return (Array.isArray(list) ? list : []).filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty" && w.id !== "tip" && w.id !== "diag"; });
}

// 裸名点按：先试演员页 /models/<slug>/，再试标签 /tags/<slug>/，
// 再试分类 /categories/<slug>/，最后站内搜索；只回真实片单。
async function loadDetailForName(name) {
  var slug = slugifyName(name);
  var cands = [HOST + "models/" + slug + "/", HOST + "tags/" + slug + "/", HOST + "categories/" + slug + "/"];
  for (var i = 0; i < cands.length; i++) {
    var works = [];
    try { works = await loadList({ path: cands[i], page: 1 }); } catch (_) { works = []; }
    var real = filterRealWorks(works);
    if (real.length) {
      return {
        id: cands[i],
        type: "detail",
        mediaType: "movie",
        title: name,
        link: cands[i],
        description: "共 " + real.length + " 部作品",
        videoUrl: "",
        childItems: [],
        relatedItems: real
      };
    }
  }
  var found = [];
  try { found = await search({ keyword: name, page: 1 }); } catch (_) { found = []; }
  var real2 = filterRealWorks(found);
  return {
    id: "name:" + name,
    type: "detail",
    mediaType: "movie",
    title: name,
    link: "",
    description: "搜索 · 共 " + real2.length + " 部作品",
    videoUrl: "",
    childItems: [],
    relatedItems: real2.length ? real2 : found
  };
}

async function loadDetail(link) {
  try {
    var rawIn = (link && typeof link === "object") ? String(link.link || link.id || link.url || "") : String(link || "");
    // 裸名（无 / 无 .）：先试演员页，再标签，再分类，最后搜索。
    if (rawIn && rawIn.indexOf("/") < 0 && rawIn.indexOf(".") < 0 && rawIn.indexOf("http") !== 0) {
      return await loadDetailForName(rawIn.replace(/^(actor|tag|genre|category):/i, ""));
    }
    var url = rawIn;
    if (!/^https?:\/\//i.test(url)) url = HOST + url.replace(/^\/+/, "");
    // AVDB 样式：点按演员/分类/标签 → 直接取该页的全部影片（实测三页都干净）。
    if (TAX_ACTOR_RE.test(url) || TAX_GENRE_RE.test(url)) {
      var taxSlug = taxSlugFromUrl(url);
      var taxName = taxSlug.replace(/-/g, " ").replace(/\+/g, " ");
      var taxWorks = [];
      try { taxWorks = await loadList({ path: url, page: 1 }); } catch (_) { taxWorks = []; }
      if (!Array.isArray(taxWorks)) taxWorks = [];
      var taxReal = filterRealWorks(taxWorks);
      if (!taxReal.length && taxSlug) {
        try { var taxFound = await search({ keyword: taxSlug, page: 1 }); if (Array.isArray(taxFound)) taxWorks = taxFound; } catch (_) {}
        taxReal = filterRealWorks(taxWorks);
      }
      var taxIsActor = TAX_ACTOR_RE.test(url);
      return {
        id: url,
        type: "detail",
        mediaType: "movie",
        title: taxName || (taxIsActor ? "演员" : "分类"),
        link: url,
        description: (taxIsActor ? "演员" : "分类") + " · 共 " + taxReal.length + " 部作品",
        videoUrl: "",
        childItems: [],
        relatedItems: taxReal.length ? taxReal : taxWorks
      };
    }

    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var html = await getText(url);
    var title = firstMatch(html, /<title>([\s\S]{0,300}?)<\/title>/i) || "UltraThots";
    var cover = decodeAmp(firstMatch(html, /preview_url['"]?\s*[:=]\s*['"]([^'"]+)/i));
    var name = stripTags(title) || url;
    var variants = extractVideoUrls(html);
    if (!variants.length) {
      return { id: url, type: "url", title: name, description: "未找到播放地址" };
    }
    // v1.0.1：每档一集，seasons[].episodes 与 episodeItems[] 每项都带 videoUrl
    // （对应档位直链），REX episodes 数组同步保留作兼容；顶层 videoUrl 仍为最高档。
    var eps = [];
    var sEps = [];
    var items = [];
    for (var vi = 0; vi < variants.length; vi++) {
      eps.push({ name: variants[vi].name, link: variants[vi].url });
      sEps.push({ title: variants[vi].name, videoUrl: variants[vi].url, episodeNumber: vi + 1 });
      items.push({ id: variants[vi].url, type: "url", title: name + " " + variants[vi].name, name: variants[vi].name, mediaType: "movie", seasonNumber: 1, episodeNumber: vi + 1, videoUrl: variants[vi].url, link: variants[vi].url, posterPath: cover, coverUrl: cover });
    }
    var ret = {
      id: url,
      type: "detail",
      title: name,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: variants[0].url,
      playerType: "app",
      episodes: eps,
      seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: sEps }],
      episodeItems: items,
      childItems: items,
      customHeaders: {
        "User-Agent": UA,
        "Referer": HOST
      }
    };
    var tax = extractTaxonomyFromHtml(html);
    if (tax.peoples.length) ret.peoples = tax.peoples;
    if (tax.genreItems.length) ret.genreItems = tax.genreItems;
    if (cover) ret.backdropPaths = [cover];
    var related = parseList(html).filter(function (w) { return w && w.link !== url; });
    if (related.length) ret.relatedItems = related;
    return ret;
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
