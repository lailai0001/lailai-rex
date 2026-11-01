// UltraThots for REX (lai_ultrathots v1.0.0)
// 移植自 mira-cat 蜘蛛 ultra.js (KVS 同构站模板 makeSpider), 后端: https://ultrathots.com/。
// 列表: <a href="https://ultrathots.com/videos/{{id}}/{{slug}}/" title="..."> 内
//   <img data-original="..."> 或 <img src="...">, 与蜘蛛 parseList 同口径 (取卡片后 3000 字符内找图)。
// 分类: 蜘蛛尾部 makeSpider 调用的 CATEGORIES 原样照搬, 共 33 个, 不增不减。
// 详情: flashvars 里 video_url 即 get_file mp4 直链 (带时效参数, 详情时现取),
//   preview_url 为封面。另有 video_alt_url (标注 720p、真实文件更大), 双档时取最高档
// 搜索: /search/{{kw}}/ (分页 /search/{{kw}}/{{n}}/); 分类分页 /categories/{{slug}}/{{n}}/。
// 封面与播放均为站方直链, 蜘蛛未走任何代理, 模块同样直连, 不复用 Worker。

WidgetMetadata = {
  id: "lai_ultrathots",
  title: "UltraThots",
  description: "UltraThots（https://ultrathots.com）：KVS 同构站，33 个分类，详情 get_file mp4 直链",
  author: "lai",
  version: "1.0.0",
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
  var tid = t(params.path || params.cat) || FIRST_CAT;
  var clean = tid.replace(/^\/+/, "").replace(/\/+$/, "");
  var base = HOST + "categories/" + clean;
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

function extractVideoUrl(html) {
  var vm = String(html || "").match(/video_url['"]?\s*[:=]\s*['"]([^'"]+)/i) || String(html || "").match(/https?:\/\/[^\s"'<>]+\/get_file\/[^\s"'<>]+\.mp4[^\s"'<>]*/i);
  var videoUrl = vm ? decodeAmp(vm[1]) : "";
  var am = String(html || "").match(/video_alt_url['"]?\s*[:=]\s*['"]([^'"]+)/i);
  var altUrl = am ? decodeAmp(am[1]) : "";
  if (!altUrl || !/get_file/i.test(altUrl) || altUrl.indexOf("?login") >= 0) altUrl = "";
  if (videoUrl && altUrl) {
    var t1 = firstMatch(html, /video_url_text['"]?\s*[:=]\s*['"]([^'"]+)/i);
    var t2 = firstMatch(html, /video_alt_url_text['"]?\s*[:=]\s*['"]([^'"]+)/i);
    var l1 = labNum(t1, "480p");
    var mAlt = altUrl.match(/_(\d+)p\.mp4/i);
    var l2 = labNum(t2, mAlt ? (mAlt[1] + "p") : "720p");
    var n1 = parseInt(l1, 10) || 0;
    var n2 = parseInt(l2, 10) || 0;
    return n2 >= n1 ? altUrl : videoUrl;
  }
  return videoUrl;
}

async function loadDetail(link) {
  try {
    var url = String(link || "");
    if (!/^https?:\/\//i.test(url)) url = HOST + url.replace(/^\/+/, "");
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var html = await getText(url);
    var title = firstMatch(html, /<title>([\s\S]{0,300}?)<\/title>/i) || "UltraThots";
    var cover = decodeAmp(firstMatch(html, /preview_url['"]?\s*[:=]\s*['"]([^'"]+)/i));
    var name = stripTags(title) || url;
    var videoUrl = extractVideoUrl(html);
    if (!videoUrl) {
      return { id: url, type: "url", title: name, description: "未找到播放地址" };
    }
    return {
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
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
