// XVideos for REX（移植自 mira-cat 蜘蛛 xvideos.js / py_xvideos，只读蓝图）
// 后端：https://www.xvideos.com，HTML 页面解析（cheerio 风格选择器与蜘蛛一致）。
// 分类：最新 / AI / ASMR / 频道 / 色情明星；播放解析在详情时实时进行：
// setVideoHLS 主列表挑最高档，其次 MP4 High / Low / ld+json contentUrl。
// v1.0.1（2026-11-09，分辨率选择）：pickQuality 只返最高档 →
//   pickAllQualities 返回主清单全部变体，loadDetail/loadResource 每档一集/一行，
//   seasons/episodes + episodeItems 每集带 videoUrl 变体地址；无 HLS 时
//   High/Low mp4 各作一档；loadResource 入口加 unwrapLink（App 传集对象）。
// 频道/明星卡片进详情后按蜘蛛口径解析其视频网格为分集（episodes + stream 模块），
// 与蜘蛛一致：现行站点档案页的视频网格为前端动态加载，静态页解析不到时如实返回提示。

WidgetMetadata = {
  id: "lai_xvideos",
  title: "XVideos",
  description: "XVideos：最新、AI、ASMR 分类与频道/明星目录，详情出多清晰度选单，HLS 变体全列",
  author: "lai",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  site: "https://www.xvideos.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "最新",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/new" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "AI",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/tags/ai" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "ASMR",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/tags/asmr" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "频道",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/channels" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "色情明星",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/pornstars" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "搜索",
      functionName: "search",
      cacheDuration: 60,
      params: [
        { name: "keyword", title: "关键词", type: "input", value: "" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      id: "loadResource",
      title: "XVideos 播放源",
      description: "频道/明星分集播放时实时解析播放地址",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 0,
      params: []
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

var BASE = "https://www.xvideos.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1.1 Mobile/15E148 Safari/604.1";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8",
    "Referer": BASE
  };
}

function playHeaders() {
  return {
    "User-Agent": UA,
    "Referer": BASE + "/"
  };
}

// REX 运行时把集对象直接传给 loadResource，String(对象) 得 "[object Object]"，
// 入口先从对象/字符串/数组里解包出链接字符串。
function unwrapLink(v) {
  var depth = 0;
  while (v != null && depth < 6) {
    if (typeof v === "string") return v.trim();
    if (typeof v !== "object") return "";
    if (Array.isArray(v)) { v = v.length ? v[0] : ""; depth++; continue; }
    if (typeof v.link === "string" && v.link) return v.link.trim();
    if (typeof v.id === "string" && v.id) return v.id.trim();
    if (typeof v.url === "string" && v.url) return v.url.trim();
    if (v.item) { v = v.item; depth++; continue; }
    if (v.link) { v = v.link; depth++; continue; }
    if (v.id) { v = v.id; depth++; continue; }
    if (v.url) { v = v.url; depth++; continue; }
    return "";
  }
  return "";
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function absUrl(href) {
  var s = String(href || "");
  if (/^https?:\/\//i.test(s)) return s;
  if (s.charAt(0) === "/") return BASE + s;
  return BASE + "/" + s;
}

function pathOf(url) {
  return String(url || "").replace(/^https?:\/\/[^/]+/i, "").split("?")[0].split("#")[0];
}

function decodeEntities(s) {
  return String(s || "")
    .replace(/&rsquo;/gi, "’")
    .replace(/&lsquo;/gi, "‘")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

// ---- 列表解析（与蜘蛛 category/search 完全同口径） ----

function parseVideoCards($, selector) {
  var out = [];
  $(selector).each(function (i, el) {
    var $el = $(el);
    if ($el.hasClass("thumb-block-profile")) return;
    var $a = $el.find(".thumb a");
    var $t = $el.find("p.title a");
    var $img = $a.find("img");
    var href = $t.attr("href");
    var title = $t.attr("title") || $t.text().trim();
    var pic = $img.attr("data-src") || $img.attr("src") || "";
    var dur = $el.find(".duration").text().trim();
    if (!href || !title) return;
    var link = absUrl(href);
    out.push({
      id: link,
      type: "url",
      title: decodeEntities(title),
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: dur || "",
      mediaType: "movie"
    });
  });
  return out;
}

function parseProfileCards($) {
  var out = [];
  $('div[id*="profile_"], .thumb-block-profile').each(function (i, el) {
    var $el = $(el);
    var $a = $el.find("a").first();
    var name = $el.find(".profile-name, .name, .title").first().text().replace(/[\n\t]/g, " ").replace(/\s+/g, " ").trim();
    if (!name) name = $el.find(".name, .title").text().trim();
    var href = $a.attr("href");
    var pic = "";
    var scriptHtml = $el.find("script").html();
    if (scriptHtml) {
      var m = scriptHtml.match(/src=["'](.*?)["']/);
      if (m) pic = m[1];
    }
    if (!pic) {
      var $img = $el.find("img").first();
      pic = $img.attr("src") || $img.attr("data-src") || "";
    }
    if (!href || !name) return;
    var link = absUrl(href);
    out.push({
      id: link,
      type: "url",
      title: decodeEntities(name),
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: "频道/明星",
      mediaType: "movie"
    });
  });
  return out;
}

// 蜘蛛的分类 URL 规则：/new 用 /new/{pg}；channels/pornstars 用 ?p={pg-1}；tags 用 path/{pg-1}
function categoryUrl(path, page) {
  if (path === "/new") return BASE + "/new/" + page;
  if (path === "/channels") return BASE + "/channels?p=" + (page - 1);
  if (path === "/pornstars") return BASE + "/pornstars?p=" + (page - 1);
  var url = BASE + path;
  if (page > 1) url += "/" + (page - 1);
  return url;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var path = String(params.path || "/new");
  var url = categoryUrl(path, page);
  try {
    var html = await fetchText(url);
    var $ = Widget.html.load(html);
    var cards = (path === "/channels" || path === "/pornstars")
      ? parseProfileCards($)
      : parseVideoCards($, ".thumb-block");
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关视频" }];
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
  var keyword = pickKeyword(params);
  var page = parseInt(params.page, 10) || 1;
  if (!keyword) {
    return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  }
  var url = BASE + "/?k=" + encodeURIComponent(keyword) + "&p=" + (page - 1);
  try {
    var html = await fetchText(url);
    var $ = Widget.html.load(html);
    var cards = parseVideoCards($, ".mozaique .thumb-block");
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关视频" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// ---- 详情/播放解析（与蜘蛛 detail/play 同口径） ----

function isVideoPath(path) {
  return /\/video[.\d]/i.test(path);
}

function isProfilePath(path) {
  if (isVideoPath(path)) return false;
  return /^\/(channels|pornstars|models|profiles)\//i.test(path) || /^\/[^/]+$/.test(path);
}

// 从视频页提取播放信息：ld+json 优先取标题/封面/contentUrl，
// setVideoTitle/setThumbUrl 补缺，播放优先级 HLS > MP4 High > MP4 Low > contentUrl（蜘蛛 play 口径）
function extractVideo(html) {
  var info = { title: "", pic: "", hls: "", high: "", low: "", mp4: "" };
  try {
    var $ = Widget.html.load(html);
    var ld = $('script[type="application/ld+json"]').html();
    if (ld) {
      var b = JSON.parse(ld);
      if (b.name) info.title = b.name;
      if (b.thumbnailUrl) info.pic = Array.isArray(b.thumbnailUrl) ? b.thumbnailUrl[0] : b.thumbnailUrl;
      if (b.contentUrl) info.mp4 = b.contentUrl;
    }
  } catch (_) {}
  var grab = function (re) {
    var m = String(html || "").match(re);
    return m ? m[1] : "";
  };
  if (!info.title) info.title = grab(/setVideoTitle\(['"](.*?)['"]\)/);
  if (!info.pic) info.pic = grab(/setThumbUrl\(['"](.*?)['"]\)/);
  info.hls = grab(/setVideoHLS\(['"](.*?)['"]\)/);
  info.high = grab(/setVideoUrlHigh\(['"](.*?)['"]\)/);
  info.low = grab(/setVideoUrlLow\(['"](.*?)['"]\)/);
  return info;
}

// HLS 主列表取全部变体：按 RESOLUTION 高度降序、同高按 BANDWIDTH 降序；
// 无 RESOLUTION 时按 BANDWIDTH 命名（kbps），无两者时名“自适应”；同地址去重。
// 拉不到/解析不到返回 []，调用方回落主列表本身或 mp4。
async function pickAllQualities(masterUrl) {
  try {
    var res = await Widget.http.get(masterUrl, { headers: pageHeaders() });
    var text = res && res.data != null ? String(res.data) : "";
    if (!/#EXT-X-STREAM-INF/i.test(text)) return [];
    var dir = masterUrl.slice(0, masterUrl.lastIndexOf("/") + 1);
    var lines = text.split(/\r?\n/);
    var out = [];
    var seen = {};
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line.indexOf("#EXT-X-STREAM-INF") !== 0) continue;
      var uri = "";
      for (var j = i + 1; j < lines.length; j++) {
        var t = lines[j].trim();
        if (t) { uri = t; break; }
      }
      if (!uri) continue;
      var rm = line.match(/RESOLUTION=(\d+)x(\d+)/i);
      var bm = line.match(/BANDWIDTH=(\d+)/i);
      var h = rm ? parseInt(rm[2], 10) : 0;
      var bw = bm ? parseInt(bm[1], 10) : 0;
      var url = /^https?:\/\//i.test(uri) ? uri : dir + uri.replace(/^\.\//, "");
      if (!url || seen[url]) continue;
      seen[url] = 1;
      out.push({ h: h, bw: bw, url: url, name: h > 0 ? (h + "p") : (bw > 0 ? (Math.round(bw / 1000) + "kbps") : "自适应") });
    }
    out.sort(function (a, b) { return (b.h - a.h) || (b.bw - a.bw); });
    return out;
  } catch (_) { return []; }
}

// HLS 主列表挑最高档：先比 RESOLUTION 高度，再比 BANDWIDTH；解析失败回退主列表本身
async function pickQuality(masterUrl) {
  var all = await pickAllQualities(masterUrl);
  return all.length ? all[0].url : masterUrl;
}

// 全部播放档位：HLS 有变体时每变体一档；无 HLS 时 High/Low mp4 各作一档
// （站方 High/Low 原名，不编造 p 数），再无则 ld+json contentUrl 单档。
async function resolvePlayUrls(html) {
  var info = extractVideo(html);
  if (info.hls) {
    var vars = await pickAllQualities(info.hls);
    if (vars.length) return vars;
    return [{ name: "自适应", url: info.hls }];
  }
  var out = [];
  var seen = {};
  var defs = [
    { name: "High", url: info.high },
    { name: "Low", url: info.low },
    { name: "MP4", url: info.mp4 }
  ];
  for (var i = 0; i < defs.length; i++) {
    if (!defs[i].url || seen[defs[i].url]) continue;
    seen[defs[i].url] = 1;
    out.push({ name: defs[i].name, url: defs[i].url });
  }
  return out;
}

async function resolvePlayUrl(html) {
  var all = await resolvePlayUrls(html);
  return all.length ? all[0].url : "";
}

// 档案页（频道/明星）：按蜘蛛口径从 .thumb-block 取 p.title a 组成分集
function parseProfileEpisodes($) {
  var eps = [];
  $(".thumb-block").each(function (i, el) {
    var $t = $(el).find("p.title a");
    var href = $t.attr("href");
    var title = $t.attr("title") || $t.text().trim();
    if (!href || !title) return;
    var link = absUrl(href);
    eps.push({ name: decodeEntities(title), id: link, link: link });
  });
  return eps;
}

async function loadDetail(link) {
  var url = absUrl(link);
  var path = pathOf(url);
  try {
    var html = await fetchText(url);

    if (isProfilePath(path)) {
      var $ = Widget.html.load(html);
      var ptitle = $("title").text().split("-")[0].trim() || "XVideos";
      var eps = parseProfileEpisodes($);
      if (eps.length) {
        return {
          id: url,
          type: "url",
          title: decodeEntities(ptitle),
          posterPath: "",
          coverUrl: "",
          backdropPath: "",
          description: "共 " + eps.length + " 个视频",
          episodes: eps,
          link: url
        };
      }
      return {
        id: url,
        type: "url",
        title: decodeEntities(ptitle),
        description: "该频道/明星页的影片列表由站点前端动态加载，未能解析出视频"
      };
    }

    var info = extractVideo(html);
    // v1.0.1：全部档位各作一集，seasons[].episodes 与 episodeItems[] 每项都带
    // videoUrl（对应档位地址），REX episodes 数组同步保留作兼容；顶层 videoUrl 仍为最高档。
    var variants = await resolvePlayUrls(html);
    if (!variants.length) {
      return { id: url, type: "url", title: decodeEntities(info.title) || "解析失败", description: "未找到播放地址" };
    }
    var vtitle = decodeEntities(info.title) || "XVideos";
    var eps = [];
    var sEps = [];
    var items = [];
    for (var vi = 0; vi < variants.length; vi++) {
      eps.push({ name: variants[vi].name, link: variants[vi].url });
      sEps.push({ title: variants[vi].name, videoUrl: variants[vi].url, episodeNumber: vi + 1 });
      items.push({ id: variants[vi].url, type: "url", title: vtitle + " " + variants[vi].name, name: variants[vi].name, mediaType: "movie", seasonNumber: 1, episodeNumber: vi + 1, videoUrl: variants[vi].url, link: variants[vi].url, posterPath: info.pic || "", coverUrl: info.pic || "" });
    }
    return {
      id: url,
      type: "detail",
      title: vtitle,
      link: url,
      posterPath: info.pic || "",
      coverUrl: info.pic || "",
      backdropPath: info.pic || "",
      videoUrl: variants[0].url,
      playerType: "app",
      episodes: eps,
      seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: sEps }],
      episodeItems: items,
      childItems: items,
      customHeaders: playHeaders()
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// stream 模块：分集（单个视频页链接）实时解析；传档案链接时逐条解析成资源列表
// v1.0.1：入口先 unwrapLink（App 传集对象）；直链（.m3u8/.mp4）直接回传；
// 单视频页返回全部档位（每档一行）；档案页每视频各档一行（名 = 视频标题 + 档位）。
async function loadResource(params) {
  var raw = unwrapLink(params);
  if (!raw && params && typeof params === "object") {
    raw = unwrapLink(params.link) || unwrapLink(params.url) || unwrapLink(params.id) || unwrapLink(params.item);
  }
  if (!raw) return [];
  var url = absUrl(raw);
  try {
    // 集 videoUrl 直传：已是某档变体/直链地址，直接回传（HLS 主清单则展开变体）
    if (/\.m3u8(\?|$)/i.test(url) || /\.mp4(\?|$)/i.test(url)) {
      if (/\.m3u8(\?|$)/i.test(url)) {
        var vars0 = await pickAllQualities(url);
        if (vars0.length > 1) {
          var rows0 = [];
          for (var v0 = 0; v0 < vars0.length; v0++) rows0.push({ name: vars0[v0].name, url: vars0[v0].url, playerType: "app", customHeaders: playHeaders() });
          return rows0;
        }
      }
      return [{ name: "播放", url: url, playerType: "app", customHeaders: playHeaders() }];
    }
    if (isVideoPath(pathOf(url))) {
      var html1 = await fetchText(url);
      var all1 = await resolvePlayUrls(html1);
      var out1 = [];
      for (var i1 = 0; i1 < all1.length; i1++) out1.push({ name: all1[i1].name, url: all1[i1].url, playerType: "app", customHeaders: playHeaders() });
      return out1;
    }
    if (isProfilePath(pathOf(url))) {
      var html2 = await fetchText(url);
      var $ = Widget.html.load(html2);
      var eps = parseProfileEpisodes($);
      var out = [];
      var misses = 0;
      for (var i = 0; i < eps.length; i++) {
        var h = await fetchText(eps[i].link);
        var u = await resolvePlayUrls(h);
        if (!u.length) {
          misses++;
          if (misses >= 3) break;
          continue;
        }
        misses = 0;
        for (var k = 0; k < u.length; k++) {
          out.push({ name: eps[i].name + " " + u[k].name, url: u[k].url, playerType: "app", customHeaders: playHeaders() });
        }
      }
      return out;
    }
  } catch (_) {}
  return [];
}
