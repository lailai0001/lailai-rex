// CableAV for REX (lai_cableav v1.0.0)
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
  version: "1.0.0",
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

async function loadDetail(link) {
  try {
    var durl = String(link || "");
    if (!/^https?:\/\//i.test(durl)) {
      durl = fixUrl("/info-" + durl.replace(/\D/g, "") + ".html");
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

    return {
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
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
