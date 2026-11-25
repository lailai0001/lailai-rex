// CableAV for REX (lai_cableav v1.0.0)
// v1.0.1：AVDB 样式详情：peoples/genreItems + 点按路由（演员/分类页出对应全部影片；分类认 layout 已知 slug）。
// 移植自 mira-cat 蜘蛛 cableav.js（py_cableav），后端：https://cableav.video
// （WordPress + VidoRev 主题，国产AV站，无反爬）。
// 列表：/{slug}.html（翻页 /{slug}-{N}.html）；卡片封面必须取 img 的 data-src（src 是 placeholder）。
// 详情：/info-{id}.html，播放器 iframe /index/data/dplayer.html?video={m3u8}，m3u8 直链播放。
// 与蜘蛛逻辑逐项对齐：同一套卡片正则、同一 m3u8 提取、同一请求头（UA 改 iPhone Safari）。

WidgetMetadata = {
  id: "lai_cableav",
  title: "CableAV",
  description: "CableAV（cableav.video）：国产新片/国产AV/探花大神/玩偶姐姐/日韩有码无码等分类，m3u8 直链播放",
  author: "lai",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  site: "https://cableav.video",
  detailCacheDuration: 180,
  modules: [
    { title: "最新发布", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "国产新片", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "guochanxinpian" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "国产AV", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "guochanav" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "探花大神", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tanhadashen" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "玩偶姐姐", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "wanoujiejie" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "日韩无码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "rihanwuma" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "日韩有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "rihanyouma" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "日本无码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ribenwuma" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
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

var BASE = "https://cableav.video";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.7",
    "Referer": BASE + "/"
  };
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function clean(s) {
  return String(s == null ? "" : s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function fixUrl(u) {
  var s = String(u == null ? "" : u).trim();
  if (!s) return "";
  if (s.indexOf("//") === 0) return "https:" + s;
  if (s.charAt(0) === "/") return BASE + s;
  if (/^https?:\/\//i.test(s)) return s;
  return BASE + "/" + s;
}

// 解析视频卡片（与蜘蛛 parseCards 同一套正则）：
// a.blog-img[href="/info-{id}.html" title] > img.blog-picture，封面取 data-src（src 是 placeholder）
function parseCards(html) {
  var out = [];
  var seen = {};
  var re = /<a\s[^>]*href="(\/info-\d+\.html)"[^>]*title="([^"]*)"[^>]*>/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var durl = fixUrl(m[1]);
    if (seen[durl]) continue;
    seen[durl] = true;
    var win = html.slice(m.index, m.index + 2000);
    var pic = "";
    var dsrcM = win.match(/<img[^>]+data-src="([^"]+)"/);
    if (dsrcM) pic = dsrcM[1];
    else {
      var srcM = win.match(/<img[^>]+src="([^"]+)"/);
      if (srcM && srcM[1].indexOf("placeholder") < 0) pic = srcM[1];
    }
    var cover = fixUrl(pic);
    var title = clean(m[2]) || durl;
    out.push({
      id: durl,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: durl,
      description: title,
      mediaType: "movie"
    });
  }
  return out;
}

function catUrl(slug, page) {
  if (page > 1) return BASE + "/" + slug + "-" + page + ".html";
  return BASE + "/" + slug + ".html";
}

async function loadList(params) {
  params = params || {};
  // App 点按派发：peopleId/genreId/url/link（分类 slug 页走 loadList，搜索地址走 search）。
  var dRaw = "";
  if (params.peopleId || params.genreId || params.url || params.link) {
    var dIn = params.peopleId || params.genreId || params.url || params.link;
    dRaw = (dIn && typeof dIn === "object") ? String(dIn.link || dIn.id || dIn.url || dIn.title || dIn.name || "").trim() : String(dIn).trim();
  }
  if (dRaw) {
    var qm = dRaw.match(/[?&]k=([^&#]+)/);
    if (qm) {
      var kw = qm[1];
      try { kw = decodeURIComponent(kw); } catch (e) { kw = qm[1]; }
      return await search({ keyword: kw, page: params.page });
    }
    var dm = dRaw.match(/\/([^\/\?#]+)\.html/i);
    if (dm && CAT_SLUGS[catDisplay(dm[1])] === dm[1]) return await loadList({ path: dm[1], page: params.page });
    if (params.genreId && CAT_SLUGS[dRaw]) return await loadList({ path: CAT_SLUGS[dRaw], page: params.page });
    if (params.peopleId || params.genreId) return await search({ keyword: dRaw, page: params.page });
  }
  var page = parseInt(params.page, 10) || 1;
  var slug = String(params.path || "latest").replace(/^\/+|\/+$/g, "");
  var url = catUrl(slug, page);
  try {
    var html = await fetchText(url);
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
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
  if (!wd) {
    return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  }
  // 与蜘蛛一致：第一页 /search.html?k={编码}，翻页 /search-{kw}-{N}.html（kw 不编码）
  var url = page > 1
    ? BASE + "/search-" + wd + "-" + page + ".html"
    : BASE + "/search.html?k=" + encodeURIComponent(wd);
  try {
    var html = await fetchText(url);
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// 从详情页提取 dplayer iframe 的 video 参数（m3u8 直链），与蜘蛛 extractM3u8 一致
function extractM3u8(html) {
  var m = html.match(/<iframe[^>]+src="\/index\/data\/dplayer\.html\?video=([^"]+)"/);
  if (m) {
    try {
      var url = decodeURIComponent(m[1]);
      if (/^https?:\/\/[^/]+\/.*\.m3u8/.test(url)) return url;
    } catch (e) {}
  }
  var m2 = html.match(/(https?:\/\/[^"'\s]+\.m3u8[^"'\s]*)/);
  return m2 ? m2[1] : "";
}

// ---- AVDB 样式详情：演员/分类（点按出对应全部内容）----
// v1.0.2（实测）：详情页全页扫会把导航分类当成本片分类——改只取第一个
// categories-wrap 块（本片 1 分类 + 标签）；标签页 /index/data/tag.html?k= 是 500
// 死页，标签点按改走站内搜索 /search.html?k=（实测 20 条）；genreItems 补 link；
// 补 loadList peopleId/genreId 派发与裸名路由、unwrapLink。本站无演员，peoples 留空。
// 本站分类是裸 slug 页 /<slug>.html（layout 的 7 个分类 + latest），
// 详情页里只认这些已知分类 slug 的链接 + 通用演员/分类链接；取不到留空、不编造。
var TAX_ACTRESS_RE = /\/actress(?:es)?\/|\/actors?\/|\/stars?\/|\/performers?\/|\/models?\/|\/pornstars?\//i;
var TAX_GENRE_RE = /\/(genres?|tags?|categor(?:y|ies)|labels?|makers?)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)|actress(?:es)?|actors?|stars?|makers?|all|全部|分类|演员|标签|女优|题材|片商)$/i;
var TAX_CABLE_CAT_RE = /\/(latest|guochanxinpian|guochanav|tanhadashen|wanoujiejie|rihanwuma|rihanyouma|ribenwuma)\.html/i;
var CAT_SLUGS = { "最新发布": "latest", "国产新片": "guochanxinpian", "国产AV": "guochanav", "探花大神": "tanhadashen", "玩偶姐姐": "wanoujiejie", "日韩无码": "rihanwuma", "日韩有码": "rihanyouma", "日本无码": "ribenwuma" };
function catDisplay(slug) {
  for (var k in CAT_SLUGS) { if (CAT_SLUGS[k] === slug) return k; }
  return slug;
}
function taxIsRealWorks(works) {
  if (!Array.isArray(works)) return false;
  for (var i = 0; i < works.length; i++) {
    if (works[i] && works[i].id !== "err" && works[i].id !== "err_cf" && works[i].id !== "empty") return true;
  }
  return false;
}

function extractTaxonomyFromHtml(html) {
  var peoples = [];
  var genreItems = [];
  var seenP = {};
  var seenG = {};
  var baseHost = String(BASE || "").replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
  // 只取第一个 categories-wrap 块（本片 1 分类 + 标签）；导航分类一律不要。
  var block = String(html || "");
  // 注意：<style> 里先有 .categories-wrap a[data-cat-id=...] 样式规则，必须找元素
  // class="categories-wrap"，否则切到样式块会取不到任何分类/标签。
  var ci = block.indexOf('class="categories-wrap"');
  if (ci >= 0) block = block.slice(ci, ci + 4000);
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(block)) !== null) {
    var href = m[1] || "";
    var name = String(m[2] || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (!name || name.length > 40 || TAX_NAV_NAME_RE.test(name)) continue;
    var abs = fixUrl(href);
    if (!/^https?:\/\//i.test(abs)) continue;
    var host = abs.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (baseHost && host !== baseHost) continue;
    // 标签页 /index/data/tag.html?k=<kw> 是 500 死页——genreItem 直接挂站内搜索地址。
    var tagM = abs.match(/\/index\/data\/tag\.html\?k=([^&#]+)/i);
    if (tagM) {
      var kw = tagM[1];
      try { kw = decodeURIComponent(kw); } catch (e) { kw = tagM[1]; }
      var sUrl = BASE + "/search.html?k=" + encodeURIComponent(kw);
      if (seenG[sUrl]) continue;
      seenG[sUrl] = 1;
      genreItems.push({ id: sUrl, title: name, name: name, link: sUrl });
      continue;
    }
    var isCat = TAX_CABLE_CAT_RE.test(abs);
    var after = abs.split(/\/actress(?:es)?\/|\/actors?\/|\/stars?\/|\/performers?\/|\/models?\/|\/pornstars?\/|\/genres?\/|\/tags?\/|\/categor(?:y|ies)\/|\/labels?\/|\/makers?\//i)[1] || "";
    after = after.split("?")[0].split("#")[0].replace(/\/+$/, "");
    if (!isCat && !after) continue;
    if (TAX_ACTRESS_RE.test(abs)) {
      if (seenP[name]) continue;
      seenP[name] = 1;
      peoples.push({ id: abs, title: name, name: name, link: abs, role: "演员" });
    } else if (isCat || TAX_GENRE_RE.test(abs)) {
      if (seenG[name]) continue;
      seenG[name] = 1;
      genreItems.push({ id: abs, title: name, name: name, link: abs });
    }
    if (peoples.length >= 20 && genreItems.length >= 20) break;
  }
  return { peoples: peoples, genreItems: genreItems };
}

function taxonomyDetail(url, kind, name, works) {
  if (!Array.isArray(works)) works = [];
  var real = works.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
  return {
    id: url,
    type: "detail",
    mediaType: "movie",
    title: name || kind,
    link: url,
    description: kind + " · 共 " + real.length + " 部作品",
    videoUrl: "",
    childItems: [],
    relatedItems: real.length ? real : works
  };
}

async function loadDetail(link) {
  try {
    var dispName = (link && typeof link === "object") ? String(link.title || link.name || "").trim() : "";
    var durl = (link && typeof link === "object") ? String(link.link || link.id || link.url || "") : String(link || "");
    // 裸名点按：已知分类名走分类页，已知 slug 走分类页，其余走搜索。
    if (durl && durl.indexOf("/") < 0 && durl.indexOf("http") !== 0 && durl.indexOf(":") < 0) {
      var bareSlug = CAT_SLUGS[durl] || durl;
      if (CAT_SLUGS[durl] || CAT_SLUGS[catDisplay(durl)] === durl) {
        var bw = await loadList({ path: bareSlug, page: 1 });
        return taxonomyDetail(durl, "分类", durl, bw);
      }
      var sw = await search({ keyword: durl, page: 1 });
      return taxonomyDetail(durl, "演员", durl, sw);
    }
    if (!/^https?:\/\//i.test(durl)) {
      durl = fixUrl("/info-" + durl.replace(/\D/g, "") + ".html");
    }
    // AVDB 样式：点按演员/分类 → 打开该演员/分类的全部影片。
    if (/\/search\.html\?k=/i.test(durl)) {
      var sq = durl.match(/[?&]k=([^&#]+)/);
      var skw = sq ? sq[1] : "";
      try { skw = decodeURIComponent(skw); } catch (e) { skw = sq ? sq[1] : ""; }
      var sWorks = await search({ keyword: skw, page: 1 });
      return taxonomyDetail(durl, "分类", dispName || skw, sWorks);
    }
    if (TAX_CABLE_CAT_RE.test(durl) || TAX_ACTRESS_RE.test(durl) || TAX_GENRE_RE.test(durl)) {
      var taxSlug = "";
      var catM = durl.match(/\/([^\/\?#]+)\.html/i);
      if (catM) taxSlug = catM[1];
      if (TAX_CABLE_CAT_RE.test(durl)) {
        var cWorks = await loadList({ path: taxSlug, page: 1 });
        return taxonomyDetail(durl, "分类", dispName || catDisplay(taxSlug), cWorks);
      }
      var taxName = "";
      try { taxName = decodeURIComponent((durl.split("/").pop() || "").split("?")[0].replace(/\.html$/i, "")); } catch (_) { taxName = (durl.split("/").pop() || "").split("?")[0]; }
      var aWorks = await search({ keyword: taxName, page: 1 });
      return taxonomyDetail(durl, TAX_ACTRESS_RE.test(durl) ? "演员" : "分类", dispName || taxName, aWorks);
    }
    var html = await fetchText(durl);

    var title = "";
    var tm = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (tm) title = clean(tm[1]);
    if (!title) {
      var om = html.match(/<meta property="og:title" content="([^"]+)"/);
      if (om) title = clean(om[1]);
    }
    if (!title) {
      var idm = durl.match(/\/info-(\d+)\.html/);
      title = "CableAV " + (idm ? idm[1] : "");
    }
    var cover = "";
    var ogi = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (ogi) cover = fixUrl(ogi[1]);

    var videoUrl = extractM3u8(html);
    if (!videoUrl) {
      return { id: durl, type: "url", title: title || "解析失败", description: "未找到播放地址" };
    }

    var ret = {
      id: durl,
      type: "detail",
      title: title,
      link: durl,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE + "/"
      }
    };
    // AVDB 样式：详情页演员/分类建成 peoples / genreItems（点按出对应全部内容）。
    var tax = extractTaxonomyFromHtml(html);
    if (tax.peoples.length) ret.peoples = tax.peoples;
    if (tax.genreItems.length) ret.genreItems = tax.genreItems;
    return ret;
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
