// v1.0.2：AVDB 样式详情：peoples/genreItems + 点按路由
// JavPortals for REX (lai_javportals v1.0.1)
// v1.0.1（2026-11-21）：补顶层 search 键（A 键，照 64 个可见模块的众数形状）；B 条目与 search 函数一个字未动。
// 移植自 mira-cat 蜘蛛 py_javportals.js（只读蓝图），后端 https://javportals.com/zh/。
// 分类：站内 /zh/genres/<slug> 21 个 + /zh/tags/<slug> 3 个，名/id 全部照抄猫源 CATS，不编造。
// 列表：<article class="movie-card"> 卡片，封面 cdn.javportals.com .webp，badge--code 番号 + badge--duration 时长。
// 详情：#player data-src 直出唯一 m3u8，data-poster 封面；单码率，不设假清晰度选单。
// 注意：播单分片为 PNG 头 + TS 体伪装（首 502 字节为 PNG、其后为 0x47 同步 TS 流），
//   站方自带 JWPlayer 直接播该播单；REX/MiraPlayer 设备侧能否跳过 PNG 头播 TS 尚未经真机证实。
// 字幕：猫源字幕芯是猫源专属，REX 版不接（包内另有 lai_subtitleagg 聚合模块）。

WidgetMetadata = {
  id: "lai_javportals",
  title: "JavPortals",
  description: "JavPortals（javportals.com）：日本AV聚合站，24 分类，详情单集正片直链播放",
  author: "lai",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  site: "https://javportals.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "🏠首页推荐", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "中文字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/chinese-subtitle" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "日本AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/jav" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/uncensored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/censored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "无码破解", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/reducing-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "越南语字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/vietnamese-subtitles" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "英文字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/english-subtitle" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "泰文字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/thai-subtitle" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "美女", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/beauty" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "制服", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/uniform" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "偷情出轨", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/affair" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "三级片", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/category-iii" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "角色扮演", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/roleplay" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "多P群交", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/group-sex" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "丝袜美腿", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/pantyhose" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "主奴调教", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/bdsm" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "男友视角", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/pov" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "女同", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/lesbian" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "直接开啪", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/sex-only" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "欧美", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/western" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genres/amateur" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "tags/big-tits" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "大屁股", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "tags/big-butt" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "巨大屁股", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "tags/huge-butt" }, { name: "page", title: "页码", type: "page", value: "1" }] }
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

var CATS = [
  "genres/chinese-subtitle", "genres/jav", "genres/uncensored", "genres/censored",
  "genres/reducing-mosaic", "genres/vietnamese-subtitles", "genres/english-subtitle",
  "genres/thai-subtitle", "genres/beauty", "genres/uniform", "genres/affair",
  "genres/category-iii", "genres/roleplay", "genres/group-sex", "genres/pantyhose",
  "genres/bdsm", "genres/pov", "genres/lesbian", "genres/sex-only", "genres/western",
  "genres/amateur", "tags/big-tits", "tags/big-butt", "tags/huge-butt"
];
var HOST = "https://javportals.com";
var BASE = "https://javportals.com/zh";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function cleanText(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/\s+/g, " ");
}

function normUrl(u) {
  var s = t(u);
  if (!s) return "";
  s = s.replace(/^(https?:)\/([^/])/, "$1//$2");
  return s;
}

async function getHtml(path) {
  var url = t(path);
  if (url.indexOf("//") === 0) url = "https:" + url;
  else if (url.charAt(0) === "/") url = HOST + url;
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Referer": BASE + "/",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
      }
    });
    var body = res && res.data != null ? String(res.data) : "";
    if (!body) return "";
    return body;
  } catch (e) { return ""; }
}

// 卡片结构（与猫源同口径）：<article class="movie-card"> 内 thumb <a href="/zh/view/...">
// + <img src="cdn...webp" alt="标题"> + badge--code（番号）+ badge--duration（时长）
function parseCards(html) {
  var items = [];
  var seen = {};
  var blocks = String(html || "").match(/<article class="movie-card">[\s\S]*?<\/article>/g) || [];
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    var hrefM = b.match(/href="(\/zh\/view\/[^"#]+)"/);
    if (!hrefM) continue;
    var vUrl = t(hrefM[1]);
    if (seen[vUrl]) continue;
    seen[vUrl] = 1;
    var imgM = b.match(/<img[^>]+src="([^"]+)"/i);
    var pic = imgM ? normUrl(imgM[1]) : "";
    var titleM = b.match(/movie-card__title"><a[^>]+title="([^"]+)"/) || b.match(/<img[^>]+alt="([^"]*)"/i);
    var name = titleM ? cleanText(titleM[1]) : "";
    var codeM = b.match(/badge--code">([^<]+)</);
    var durM = b.match(/badge--duration">([^<]+)</);
    if (!name && !pic) continue;
    items.push({
      id: vUrl,
      type: "url",
      title: name || "JavPortals 视频",
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: vUrl,
      description: durM ? t(durM[1]) : (codeM ? t(codeM[1]) : ""),
      mediaType: "movie"
    });
  }
  return items;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var cat = t(params.cat || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var path = "";
  if (!cat || cat === "home") {
    path = page === 1 ? "/zh/" : ("/zh/?p=" + page);
  } else {
    var known = false;
    for (var i = 0; i < CATS.length; i++) {
      if (CATS[i] === cat) { known = true; break; }
    }
    if (!known) return emptyItem();
    path = page === 1 ? ("/zh/" + cat + "/") : ("/zh/" + cat + "/?p=" + page);
  }
  try {
    var html = await getHtml(path);
    var list = parseCards(html);
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
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var path = page === 1 ? ("/zh/search?keyword=" + encodeURIComponent(wd)) : ("/zh/search?keyword=" + encodeURIComponent(wd) + "&p=" + page);
  try {
    var html = await getHtml(path);
    var list = parseCards(html);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function detailPath(link) {
  var s = t(link);
  if (!s) return "";
  var m = s.match(/\/zh\/view\/[^"'#\s]+/);
  if (m) return m[0];
  return s;
}

function absTaxLink(href) {
  var s = String(href || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.indexOf("//") === 0) return "https:" + s;
  if (s.charAt(0) === "/") return HOST + s;
  return HOST + "/" + s;
}

// ---- AVDB 样式详情：演员/分类（点按出对应全部内容）----
var TAX_ACTRESS_RE = /\/actress(?:es)?\/|\/actors?\/|\/star\/|\/stars\/|\/performer\/|\/models?\/|\/pornstars?\/|\/idols?\//i;
var TAX_GENRE_RE = /\/(genres?|tags?|categor(?:y|ies)|labels?|makers?|category)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)|category|actress(es)?|actors?|stars?|star|performers?|models?|pornstars?|makers?|labels?|studios?|all|全部|分类|演员|标签|女优|题材|片商)$/i;

function taxRealWorks(works) {
  var out = [];
  for (var i = 0; i < works.length; i++) {
    var w = works[i];
    if (w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty" && w.id !== "tip" && w.id !== "supjav-diag-parse" && String(w.id || "").indexOf("supjav-diag") !== 0) out.push(w);
  }
  return out;
}

function extractTaxonomyFromHtml(html) {
  var peoples = [];
  var genreItems = [];
  var seenP = {};
  var seenG = {};
  var baseHost = String(HOST || "").replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var href = m[1] || "";
    var name = String(m[2] || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (!name || name.length > 40 || TAX_NAV_NAME_RE.test(name)) continue;
    var abs = absTaxLink(href);
    if (!/^https?:\/\//i.test(abs)) continue;
    var host = abs.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (baseHost && host !== baseHost) continue;
    var after = abs.split(/\/actress(?:es)?\/|\/actors?\/|\/star\/|\/stars\/|\/performer\/|\/models?\/|\/pornstars?\/|\/idols?\/|\/genres?\/|\/tags?\/|\/categor(?:y|ies)\/|\/category\/|\/labels?\/|\/makers?\/|\/studios?\//i)[1] || "";
    after = after.split("?")[0].split("#")[0].replace(/\/+$/, "");
    if (!after) continue;
    if (TAX_ACTRESS_RE.test(abs)) {
      if (seenP[name]) continue;
      seenP[name] = 1;
      if (peoples.length < 20) peoples.push({ id: abs, title: name, name: name, link: abs, role: "演员" });
    } else if (TAX_GENRE_RE.test(abs)) {
      if (seenG[name]) continue;
      seenG[name] = 1;
      if (genreItems.length < 20) genreItems.push({ id: abs, title: name });
    }
    if (peoples.length >= 20 && genreItems.length >= 20) break;
  }
  return { peoples: peoples, genreItems: genreItems };
}

async function taxRoute(url) {
  var isActress = TAX_ACTRESS_RE.test(url);
  var slug = "";
  try { slug = decodeURIComponent((String(url).split("?")[0].split("#")[0].replace(/\/+$/, "").split("/").pop() || "")); } catch (_) { slug = ""; }
  var taxPath = String(url).replace(/^https?:\/\/[^/]+\//, "");
  var works = [];
  try {
    var pc = taxPath.replace(/^zh\//, "").replace(/\/+$/, "");
    works = await loadList({ cat: pc, page: 1 });
  } catch (_) { works = []; }
  if (!Array.isArray(works)) works = [];
  var realWorks = taxRealWorks(works);
  if (!realWorks.length && slug) {
    try {
      var sw = await search({ keyword: slug.replace(/-/g, " ") });
      if (Array.isArray(sw)) { works = sw; realWorks = taxRealWorks(sw); }
    } catch (_) {}
  }
  return {
    id: url,
    type: "detail",
    mediaType: "movie",
    title: slug || (isActress ? "演员" : "分类"),
    link: url,
    description: (isActress ? "演员" : "分类") + " · 共 " + realWorks.length + " 部作品",
    videoUrl: "",
    childItems: [],
    relatedItems: realWorks.length ? realWorks : works
  };
}

async function loadDetail(link) {
  try {
    var rawLink = link;
    if (rawLink && typeof rawLink === "object") rawLink = rawLink.link || rawLink.id || rawLink.url || rawLink.videoUrl || "";
    var taxUrl = t(rawLink);
    if (!/^https?:\/\//i.test(taxUrl) && taxUrl.charAt(0) === "/") taxUrl = HOST + taxUrl;
    if (TAX_ACTRESS_RE.test(taxUrl) || TAX_GENRE_RE.test(taxUrl)) {
      return await taxRoute(taxUrl);
    }
    var path = detailPath(link);
    if (!path) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var durl = path.indexOf("http") === 0 ? path : HOST + path;
    var html = await getHtml(path);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var h1M = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    var mainTitle = h1M ? cleanText(h1M[1]) : "";
    if (!mainTitle) {
      var tM = html.match(/<title>(.*?)<\/title>/i);
      mainTitle = tM ? cleanText(tM[1]).replace(/\s*-\s*javportals\.com\s*$/i, "").trim() : "JavPortals 视频";
    }
    var posterPic = "";
    var srcM = html.match(/id="player"[^>]+data-poster="([^"]+)"/i) || html.match(/data-poster="([^"]+)"/i);
    if (srcM) posterPic = normUrl(srcM[1]);
    if (!posterPic) {
      var ogM = html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
      if (ogM) posterPic = normUrl(ogM[1]);
    }
    var playUrl = "";
    var dataM = html.match(/id="player"[^>]+data-src="([^"]+)"/i) || html.match(/data-src="([^"]+)"/i);
    if (dataM) playUrl = normUrl(dataM[1]);
    if (!playUrl) {
      return { id: durl, type: "url", title: mainTitle, description: "未找到播放地址", coverUrl: posterPic, posterPath: posterPic, backdropPath: posterPic };
    }
    var ret = {
      id: durl,
      type: "detail",
      title: mainTitle,
      link: durl,
      posterPath: posterPic,
      coverUrl: posterPic,
      backdropPath: posterPic,
      videoUrl: playUrl,
      playerType: "app",
      customHeaders: { "User-Agent": UA, "Referer": BASE + "/" }
    };
    var tax = extractTaxonomyFromHtml(html);
    if (tax.peoples.length) ret.peoples = tax.peoples;
    if (tax.genreItems.length) ret.genreItems = tax.genreItems;
    return ret;
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
