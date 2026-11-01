// TopJAV for REX (lai_topjav v1.0.0)
// 移植自 mira-cat 蜘蛛 py_topjav.js（只读蓝图），后端 https://topjav.tv/cn（另有 /en /kr /tw；详情规范 /video/{id}）。
// 列表：<article class="movie-item">，链接 /cn/video/{id}，封面 topjav.tv/storage/images/{id}/thumbnail.jpg，
//   标题 <h3 class="movie-link">；分页 ?page=N。
// 详情：只给播放线（猫源 detail 只给“播放$详情页”线，签名现取现解，绝不把解出的签名 URL 存成静态线）；
//   本模块 loadDetail 内现取现解：详情页内联混淆脚本的 jwplayer 配置 file: f("<约 220 字符>")；
//   f 的真身是 slice(16, -16) → 反转 → base64 解码 → https://topjav.tv/m3u8/{id}.m3u8?time={epoch}&sig={sha256hex}&sig2={短串}；
//   签名有时效，解出即用；本站未见分辨率档，单线 master。
// 搜索：站内表单 action=/cn/search，字段名 s → /cn/search?s={wd}。
// base64 解码为纯字符串运算，不依赖运行环境的编解码接口。
// 字幕：猫源本身无字幕线，本模块不接。

WidgetMetadata = {
  id: "lai_topjav",
  title: "TopJAV",
  description: "TopJAV（topjav.tv/cn）：最新/热门/有码/无码/减码等 26 个分类，详情现解签名 m3u8 单线",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://topjav.tv/cn",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "热门", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/popular" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/categories/censored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/categories/uncensored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "减码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/categories/reducing_mosaic" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/busty" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "屁股", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/butt" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨臀", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/huge-butt" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中出", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/creampie" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "口交", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/blowjob" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "角色扮演", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/cosplay" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "校园", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/school-girls" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/housewife" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "年轻妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/young-wife" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "女同", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/lesbian" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "肛交", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/anal" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "捆绑", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/bondage" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "按摩", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/massage" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "制服", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/uniform" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "潮吹", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/squirting" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "第一视角", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/pov" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "硬核", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/hardcore" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "轮奸", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/gangbang" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "苗条", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/slender" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "骑乘", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/cowgirl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "颜射", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/cn/genre/bukkake" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
  ]
};

var HOST = "https://topjav.tv";
var LANG = "/cn";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

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
    "Referer": referer || HOST + LANG
  };
}

async function getText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
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

// 签名 URL 现解：slice(16, -16) → 反转 → base64 解码；解出非 topjav m3u8 的一律作废
function decodeSigned(html) {
  var fm = String(html || "").match(/file\s*:\s*f\("([^"]{100,})"\)/i)
    || String(html || "").match(/f\("([^"]{150,})"\)/);
  if (!fm) return "";
  var enc = fm[1];
  try {
    var sliced = enc.slice(16, -16);
    var rev = sliced.split("").reverse().join("");
    var out = latin1ToUtf8(b64ToLatin1(rev));
    if (/^https:\/\/topjav\.tv\/(cn\/)?m3u8\//i.test(out)) return out;
  } catch (e) { /* 作废 */ }
  return "";
}

function parseCards(html) {
  var items = [];
  var seen = {};
  var re = /<article[^>]*class="[^"]*movie-item[^"]*"[^>]*>([\s\S]{0,6000}?)<\/article>/gi;
  var m;
  while ((m = re.exec(html))) {
    var blk = m[1];
    var lm = blk.match(/<a[^>]*href="([^"]*\/video\/\d+[^"]*)"[^>]*>/i);
    if (!lm) continue;
    var href = lm[1];
    if (!/^https?:\/\//i.test(href)) href = HOST + (href.charAt(0) === "/" ? href : "/" + href);
    if (seen[href]) continue;
    seen[href] = 1;
    var clean = blk.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    var pic = "";
    var imgRe = /<img[^>]*>/gi;
    var tagM;
    while ((tagM = imgRe.exec(clean))) {
      var sm = tagM[0].match(/(?:data-src|data-original|src)\s*=\s*"([^"]+)"/i);
      if (sm && sm[1] && sm[1].indexOf("data:image") !== 0) {
        pic = /^https?:\/\//i.test(sm[1]) ? sm[1] : HOST + (sm[1].charAt(0) === "/" ? sm[1] : "/" + sm[1]);
        break;
      }
    }
    var title = "";
    var tm = clean.match(/<h3[^>]*>([\s\S]{0,400}?)<\/h3>/i);
    if (tm) title = cleanText(tm[1]);
    if (!title) {
      var am = clean.match(/title="([^"]+)"/i);
      if (am) title = cleanText(am[1]);
    }
    if (!title || title.length < 2) continue;
    var remarks = "";
    var vm = clean.match(/([\d,]+)\s*(?:views|次|观看)/i);
    if (vm) remarks = vm[1];
    items.push({
      id: href,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: href,
      description: remarks,
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
  cat = t(cat) || LANG;
  var base = (/^https?:\/\//i.test(cat) ? cat : HOST + "/" + cat.replace(/^\/+/, "")).replace(/\/+$/, "");
  return page === 1 ? base : base + "?page=" + page;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var cat = String(params.path || params.cat || LANG);
  var url = listUrl(cat, page);
  try {
    var html = await getText(url, HOST + LANG);
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
  var url = HOST + LANG + "/search?s=" + encodeURIComponent(wd) + (page > 1 ? "&page=" + page : "");
  try {
    var html = await getText(url, HOST + LANG);
    return listOrMsg(html, url);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

async function loadDetail(link) {
  try {
    var url = String(link || "");
    if (!/^https?:\/\//i.test(url)) url = HOST + (url.charAt(0) === "/" ? url : "/" + url);
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var html = await getText(url, HOST + LANG);
    var title = firstMatch(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
      || cleanText(firstMatch(html, /<h1[^>]*>([\s\S]{0,400}?)<\/h1>/i))
      || "TopJAV";
    var cover = firstMatch(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (!cover) {
      var idm = url.match(/\/video\/(\d+)/);
      if (idm) cover = HOST + "/storage/images/" + idm[1] + "/thumbnail.jpg";
    }
    var videoUrl = decodeSigned(html);
    if (!videoUrl) {
      return { id: url, type: "url", title: title, description: "未找到播放地址" };
    }
    return {
      id: url,
      type: "detail",
      title: title,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: { "User-Agent": UA, "Referer": url }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
