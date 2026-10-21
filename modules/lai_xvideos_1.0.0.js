// XVideos for REX（移植自 mira-cat 蜘蛛 xvideos.js / py_xvideos，只读蓝图）
// 后端：https://www.xvideos.com，HTML 页面解析（cheerio 风格选择器与蜘蛛一致）。
// 分类：最新 / AI / ASMR / 频道 / 色情明星；播放解析在详情时实时进行：
// setVideoHLS 主列表挑最高档，其次 MP4 High / Low / ld+json contentUrl。
// 频道/明星卡片进详情后按蜘蛛口径解析其视频网格为分集（episodes + stream 模块），
// 与蜘蛛一致：现行站点档案页的视频网格为前端动态加载，静态页解析不到时如实返回提示。

WidgetMetadata = {
  id: "lai_xvideos",
  title: "XVideos",
  description: "XVideos：最新、AI、ASMR 分类与频道/明星目录，播放优先 HLS 最高档",
  author: "lai",
  version: "1.0.0",
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

// HLS 主列表挑最高档：先比 RESOLUTION 高度，再比 BANDWIDTH；解析失败回退主列表本身
async function pickQuality(masterUrl) {
  try {
    var res = await Widget.http.get(masterUrl, { headers: pageHeaders() });
    var text = res && res.data != null ? String(res.data) : "";
    if (!/#EXT-X-STREAM-INF/i.test(text)) return masterUrl;
    var dir = masterUrl.slice(0, masterUrl.lastIndexOf("/") + 1);
    var lines = text.split(/\r?\n/);
    var best = null;
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
      var cand = { uri: uri, h: rm ? parseInt(rm[2], 10) : 0, bw: bm ? parseInt(bm[1], 10) : 0 };
      if (!best || cand.h > best.h || (cand.h === best.h && cand.bw > best.bw)) best = cand;
    }
    if (best) {
      return /^https?:\/\//i.test(best.uri) ? best.uri : dir + best.uri.replace(/^\.\//, "");
    }
  } catch (_) {}
  return masterUrl;
}

async function resolvePlayUrl(html) {
  var info = extractVideo(html);
  if (info.hls) return await pickQuality(info.hls);
  return info.high || info.low || info.mp4 || "";
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
    var videoUrl = "";
    if (info.hls) videoUrl = await pickQuality(info.hls);
    else videoUrl = info.high || info.low || info.mp4 || "";
    if (!videoUrl) {
      return { id: url, type: "url", title: decodeEntities(info.title) || "解析失败", description: "未找到播放地址" };
    }
    return {
      id: url,
      type: "detail",
      title: decodeEntities(info.title) || "XVideos",
      link: url,
      posterPath: info.pic || "",
      coverUrl: info.pic || "",
      backdropPath: info.pic || "",
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: playHeaders()
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// stream 模块：分集（单个视频页链接）实时解析；传档案链接时逐条解析成资源列表
async function loadResource(params) {
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  if (!raw) return [];
  var url = absUrl(raw);
  try {
    if (isVideoPath(pathOf(url))) {
      var html1 = await fetchText(url);
      var one = await resolvePlayUrl(html1);
      if (!one) return [];
      return [{ name: "播放", url: one, playerType: "app", customHeaders: playHeaders() }];
    }
    if (isProfilePath(pathOf(url))) {
      var html2 = await fetchText(url);
      var $ = Widget.html.load(html2);
      var eps = parseProfileEpisodes($);
      var out = [];
      var misses = 0;
      for (var i = 0; i < eps.length; i++) {
        var h = await fetchText(eps[i].link);
        var u = await resolvePlayUrl(h);
        if (!u) {
          misses++;
          if (misses >= 3) break;
          continue;
        }
        misses = 0;
        out.push({ name: eps[i].name, url: u, playerType: "app", customHeaders: playHeaders() });
      }
      return out;
    }
  } catch (_) {}
  return [];
}
