// v1.0.2：AVDB 样式详情：本片分类只取 video_categories + btn gold button 链接（导航 10 个分类不是本片数据）；video_models 为空时 peoples 留空（6 个真站详情页 models/tags 均为空）；有 models 时演员链向站内搜索 /search/<名>/（站内无 /models/ 页）；genreItems 补 link；补 loadList peopleId/genreId 与 loadDetail 裸名派发；详情挂 relatedItems
// v1.0.1：AVDB 样式详情：peoples/genreItems + 点按路由
// KissJAV for REX (lai_kissjav v1.0.0)
// 来源：mira-cat 蜘蛛 py_kissjav 的移植。后端：https://kissjav.li（无反爬，App 直连）。
// 功能：最新/热门 + 10 个真实分类、站内搜索；详情页 video_url Base64 解码出 get_file mp4 直链播放。

WidgetMetadata = {
  id: "lai_kissjav",
  title: "KissJAV",
  description: "KissJAV（kissjav.li）：最新/热门/KVIP/JVIP/韩流/FC2PPV/无码/MyFans/IPCAM 等分类，mp4 直链播放",
  author: "lai",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  site: "https://kissjav.li",
  detailCacheDuration: 180,
  modules: [
    {
      title: "最新",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "latest" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "热门",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "popular" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "KVIP",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "vip" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "JVIP",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "jvip" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "Korean Porn",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "korean-porn" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "Korean BJ",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "korean-bj" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "FC2PPV",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "fc2ppv" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "Uncensored",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "jav" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "MyFans",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "myfans" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "IPCAM",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "ipcam" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "Toilet",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "toilet" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "VoyeurJP",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "voyeur-jp" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    }
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

var BASE = "https://kissjav.li";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.7",
    "Referer": BASE + "/"
  };
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body || body.length < 200) throw new Error("空回应");
  return body;
}

function t(v) {
  return String(v == null ? "" : v).trim();
}

function clean(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
}

function fixPic(u) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return BASE + u;
  return u;
}

// 纯 JS Base64 -> UTF-8 字符串（REX 沙箱无 Node Buffer）
function b64DecodeUtf8(b64) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var s = String(b64 || "").replace(/[^A-Za-z0-9+/=]/g, "");
  var bytes = [];
  var i, c1, c2, c3, c4;
  for (i = 0; i + 3 < s.length + 1 && i < s.length; i += 4) {
    c1 = chars.indexOf(s.charAt(i));
    c2 = chars.indexOf(s.charAt(i + 1));
    c3 = s.charAt(i + 2) === "=" ? -1 : chars.indexOf(s.charAt(i + 2));
    c4 = s.charAt(i + 3) === "=" ? -1 : chars.indexOf(s.charAt(i + 3));
    if (c1 < 0 || c2 < 0) break;
    bytes.push((c1 << 2) | (c2 >> 4));
    if (c3 >= 0) bytes.push(((c2 & 15) << 4) | (c3 >> 2));
    if (c4 >= 0) bytes.push(((c3 & 3) << 6) | c4);
  }
  // UTF-8 解码
  var out = "";
  var j = 0;
  while (j < bytes.length) {
    var b = bytes[j];
    if (b < 0x80) {
      out += String.fromCharCode(b);
      j += 1;
    } else if (b >= 0xC0 && b < 0xE0 && j + 1 < bytes.length) {
      out += String.fromCharCode(((b & 0x1F) << 6) | (bytes[j + 1] & 0x3F));
      j += 2;
    } else if (b >= 0xE0 && b < 0xF0 && j + 2 < bytes.length) {
      out += String.fromCharCode(((b & 0x0F) << 12) | ((bytes[j + 1] & 0x3F) << 6) | (bytes[j + 2] & 0x3F));
      j += 3;
    } else if (b >= 0xF0 && j + 3 < bytes.length) {
      var cp = ((b & 0x07) << 18) | ((bytes[j + 1] & 0x3F) << 12) | ((bytes[j + 2] & 0x3F) << 6) | (bytes[j + 3] & 0x3F);
      cp -= 0x10000;
      out += String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 0x3FF));
      j += 4;
    } else {
      j += 1;
    }
  }
  return out;
}

// 解析列表卡片（与蜘蛛 parseCards 同逻辑：
// a[href="/video/{id}/{slug}/"] 后 1500 字符窗口内取 title 与 data-original 图）
function parseCards(html) {
  var out = [];
  var seen = {};
  var re = /<a\s[^>]*href="(https?:\/\/kissjav\.li\/video\/\d+\/[^"]*\/)"[^>]*>/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var durl = m[1];
    var idm = durl.match(/\/video\/(\d+)\//);
    var vid = idm ? idm[1] : durl;
    if (seen[vid]) continue;
    seen[vid] = true;
    var win = html.slice(m.index, m.index + 1500);
    var titleM = m[0].match(/title="([^"]*)"/) || win.match(/title="([^"]*)"/);
    var imgM = win.match(/data-original="([^"]+)"/) || win.match(/<img[^>]+src="([^"]+)"/);
    var title = titleM ? clean(titleM[1]) : "KissJAV " + vid;
    var pic = imgM ? fixPic(imgM[1]) : "";
    out.push({
      id: durl,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: durl,
      description: "",
      mediaType: "movie"
    });
  }
  return out;
}

function catUrl(tid, page) {
  var base;
  if (tid === "latest") base = BASE + "/latest-updates/";
  else if (tid === "popular") base = BASE + "/most-popular/?sort_by=video_viewed";
  else base = BASE + "/categories/" + encodeURIComponent(tid) + "/";
  if (page > 1) {
    if (tid === "popular") return base + "&page=" + page;
    return base + page + "/";
  }
  return base;
}

async function loadList(params) {
  params = params || {};
  var taxId = String(params.peopleId || params.genreId || params.url || params.link || "");
  if (taxId && (/\/categories\//i.test(taxId) || TAX_SEARCH_RE.test(taxId))) {
    try { var td = await taxRoute(taxId); return td.relatedItems || []; } catch (e) { return []; }
  }
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var tid = t(params.cat || params.path || "latest") || "latest";
  var url = catUrl(tid, page);
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
  var kw = pickKeyword(params);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!kw) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var url = BASE + "/search/" + encodeURIComponent(kw) + "/";
  if (page > 1) url += page + "/";
  try {
    var html = await fetchText(url);
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// 从详情页提取 video_url Base64 并解码出 get_file mp4 直链
function extractMp4(html) {
  var m = String(html || "").match(/video_url:\s*'([A-Za-z0-9+/=]+)'/);
  if (!m) return "";
  try {
    var dec = b64DecodeUtf8(m[1]);
    if (/^https?:\/\//.test(dec)) return dec;
  } catch (e) {}
  return "";
}

// ---- AVDB 样式详情：演员/分类（点按出对应全部内容）----
var TAX_ACTRESS_RE = /\/actress(?:es)?\/|\/actors?\/|\/star\/|\/stars\/|\/performer\/|\/models?\/|\/pornstars?\/|\/idols?\//i;
var TAX_GENRE_RE = /\/(genres?|tags?|categor(?:y|ies)|labels?|makers?|category)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)|category|actress(es)?|actors?|stars?|star|performers?|models?|pornstars?|makers?|labels?|studios?|all|全部|分类|演员|标签|女优|题材|片商)$/i;
var TAX_SEARCH_RE = /\/search\//i;

function taxRealWorks(works) {
  var out = [];
  for (var i = 0; i < works.length; i++) {
    var w = works[i];
    if (w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty" && w.id !== "tip" && w.id !== "supjav-diag-parse" && String(w.id || "").indexOf("supjav-diag") !== 0) out.push(w);
  }
  return out;
}

// v1.0.2：本片分类只在 video_categories 变量 + btn gold button 链接里（导航 10 个分类不是本片数据）；
// video_models 为空时 peoples 留空（6 个真站详情页 models/tags 均为空，站方无本片演员数据）；
// 有 models 时 peoples 链向站内搜索 /search/<名>/（站内无 /models/ 页）。
function extractTaxonomyFromHtml(html) {
  var peoples = [];
  var genreItems = [];
  var seenP = {};
  var seenG = {};
  var cm = String(html || "").match(/video_categories\s*:\s*'([^']*)'/);
  var gm = String(html || "").match(/video_models\s*:\s*'([^']*)'/);
  var catLinks = {};
  var re = /<a([^>]*)href\s*=\s*["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var tagAll = (m[1] || "") + " " + (m[3] || "");
    if (tagAll.indexOf("btn gold button") < 0) continue;
    var nm = String(m[4] || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    var href = m[2] || "";
    if (nm && href) catLinks[nm] = href;
  }
  if (cm) {
    var parts = cm[1].split(/[,，]/);
    for (var i = 0; i < parts.length; i++) {
      var cn = String(parts[i] || "").replace(/\s+/g, " ").trim();
      if (!cn || seenG[cn]) continue;
      seenG[cn] = 1;
      var curl = catLinks[cn] || (BASE + "/categories/" + encodeURIComponent(cn.toLowerCase().replace(/\s+/g, "-")) + "/");
      genreItems.push({ id: curl, title: cn, link: curl });
    }
  }
  for (var key in catLinks) {
    if (!seenG[key]) {
      seenG[key] = 1;
      genreItems.push({ id: catLinks[key], title: key, link: catLinks[key] });
    }
  }
  if (gm) {
    var mods = gm[1].split(/[,，]/);
    for (var j = 0; j < mods.length; j++) {
      var mn = String(mods[j] || "").replace(/\s+/g, " ").trim();
      if (!mn || seenP[mn]) continue;
      seenP[mn] = 1;
      var murl = BASE + "/search/" + encodeURIComponent(mn) + "/";
      peoples.push({ id: murl, title: mn, name: mn, link: murl, role: "演员" });
    }
  }
  return { peoples: peoples, genreItems: genreItems };
}

async function taxBareName(name) {
  var slug = String(name || "").toLowerCase().replace(/\s+/g, "-");
  var works = [];
  try {
    var cw = await loadList({ cat: slug, page: 1 });
    if (Array.isArray(cw)) works = cw;
  } catch (_) { works = []; }
  if (!taxRealWorks(works).length) {
    try {
      var sw = await search({ keyword: name });
      if (Array.isArray(sw)) works = sw;
    } catch (_) {}
  }
  var real = taxRealWorks(works);
  return { id: "search:" + name, type: "detail", mediaType: "movie", title: name, link: "search:" + name, description: "搜索 · 共 " + real.length + " 部作品", videoUrl: "", childItems: [], relatedItems: real.length ? real : works };
}
async function taxRoute(url, hintTitle) {
  var isActress = TAX_SEARCH_RE.test(url);
  var slug = "";
  try { slug = decodeURIComponent((String(url).split("?")[0].split("#")[0].replace(/\/+$/, "").split("/").pop() || "")); } catch (_) { slug = ""; }
  var title = hintTitle || slug.replace(/-/g, " ") || (isActress ? "演员" : "分类");
  var works = [];
  try {
    var cm = url.match(/\/categories\/([^/?#]+)/);
    if (cm) works = await loadList({ cat: cm[1].split("/")[0], page: 1 });
    else {
      var sm = url.match(/\/search\/([^/?#]+)/);
      if (sm) {
        var kw = "";
        try { kw = decodeURIComponent(sm[1]); } catch (_) { kw = sm[1]; }
        works = await search({ keyword: kw });
      }
    }
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
    title: title,
    link: url,
    description: (isActress ? "演员" : "分类") + " · 共 " + realWorks.length + " 部作品",
    videoUrl: "",
    childItems: [],
    relatedItems: realWorks.length ? realWorks : works
  };
}

async function loadDetail(link) {
  try {
    var inObj = (link && typeof link === "object") ? link : null;
    var rawLink = link;
    if (rawLink && typeof rawLink === "object") rawLink = rawLink.link || rawLink.id || rawLink.url || rawLink.videoUrl || "";
    var durl = String(rawLink || "");
    if (durl && durl.indexOf("http") !== 0 && durl.indexOf("/") < 0 && durl.indexOf(":") < 0 && /\D/.test(durl)) {
      return await taxBareName(durl);
    }
    if (TAX_ACTRESS_RE.test(durl) || TAX_GENRE_RE.test(durl) || TAX_SEARCH_RE.test(durl)) {
      if (!/^https?:\/\//i.test(durl)) durl = BASE + (durl.charAt(0) === "/" ? durl : "/" + durl);
      return await taxRoute(durl, inObj ? inObj.title : null);
    }
    if (!/^https?:\/\//.test(durl)) {
      durl = BASE + "/video/" + durl.replace(/\D/g, "") + "/";
    }
    var vidm = durl.match(/\/video\/(\d+)\//);
    var vid = vidm ? vidm[1] : "";
    var html = await fetchText(durl);

    var titleM = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    var title = titleM ? clean(titleM[1]) : "KissJAV " + vid;

    var pic = "";
    var picM = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (picM) pic = fixPic(picM[1]);

    var remarks = "";
    var durM = html.match(/itemprop="duration"[^>]*content="PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?"/);
    if (durM) {
      var h = durM[1] ? parseInt(durM[1], 10) : 0;
      var mi = durM[2] ? parseInt(durM[2], 10) : 0;
      var se = durM[3] ? parseInt(durM[3], 10) : 0;
      remarks = h
        ? h + ":" + String(mi).padStart(2, "0") + ":" + String(se).padStart(2, "0")
        : mi + ":" + String(se).padStart(2, "0");
    }

    // 播放地址实时解析（token 可能变化，不缓存）
    var mp4 = extractMp4(html);
    if (!mp4) {
      return { id: durl, type: "url", title: title || "解析失败", description: "未找到播放地址" };
    }

    var ret = {
      id: durl,
      type: "detail",
      title: title,
      link: durl,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: remarks,
      videoUrl: mp4,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE + "/"
      }
    };
    var tax = extractTaxonomyFromHtml(html);
    if (tax.peoples.length) ret.peoples = tax.peoples;
    if (tax.genreItems.length) ret.genreItems = tax.genreItems;
    var relAll = parseCards(html);
    var rel = [];
    for (var ri = 0; ri < relAll.length; ri++) {
      if (relAll[ri].id !== durl) rel.push(relAll[ri]);
      if (rel.length >= 12) break;
    }
    if (rel.length) ret.relatedItems = rel;
    return ret;
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
