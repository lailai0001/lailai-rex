// XXXFollow for REX（移植自 mira-cat 蜘蛛 xxxfollow.js / py_xxxfollow，只读蓝图）
// 后端：https://www.xxxfollow.com，列表页 HTML 锚点解析；详情页取
// window.__PRELOAD_STATE__ 中 post-* 的 media 数据（与蜘蛛完全同口径）。
// 播放：单条直链 MP4，按 UHD > 原画(url) > FHD > SD 选最高档；
// 搜索沿用蜘蛛口径：关键词按标签 slug 查 /tag/<keyword>。

WidgetMetadata = {
  id: "lai_xxxfollow",
  title: "XXXFollow",
  description: "XXXFollow：最新/热门视频与标签分类，详情直出最高画质 MP4",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://www.xxxfollow.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "最新视频",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/videos" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "热门视频",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/most-popular" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "Teen 18+",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/tag/teen-18" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "FastFap",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/tag/fastfap" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "自慰",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/tag/masturbation" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "亚洲",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/tag/asian" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "日本",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/tag/japanese" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "中国",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/tag/chinese" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "搜索",
      functionName: "search",
      cacheDuration: 60,
      params: [
        { name: "keyword", title: "标签", type: "input", value: "" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    }
  ],
  search: {
    title: "搜索",
    functionName: "search",
    params: [
      { name: "keyword", title: "标签", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

var BASE = "https://www.xxxfollow.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

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

// ---- 列表解析（与蜘蛛 category/search 同口径，另按 href 去重） ----

function parseCards($) {
  var out = [];
  var seen = {};
  $('a[href*="/"]').each(function (i, el) {
    var $el = $(el);
    var href = $el.attr("href");
    if (!href) return;
    var path = pathOf(href);
    if (!/\/\d+/.test(path)) return;
    if (path.indexOf("/tag/") === 0 || path.indexOf("/search/") === 0 || path.indexOf("/support/") === 0) return;
    var $img = $el.find("img").first();
    var pic = $img.attr("src") || $img.attr("data-src");
    if (!pic) return;
    var title = $el.text().trim();
    if (!title) title = $img.attr("alt") || "";
    title = title ? title.replace(/[\n\t]/g, "").replace(/\s+/g, " ").trim() : "Unknown";
    if (!title) title = "Unknown";
    var link = absUrl(href);
    if (seen[link]) return;
    seen[link] = true;
    out.push({
      id: link,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: "",
      mediaType: "movie"
    });
  });
  return out;
}

function listUrl(path, page) {
  var url = BASE + path;
  if (page > 1) url += "?page=" + page;
  return url;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var path = String(params.path || "/videos");
  var url = listUrl(path, page);
  try {
    var html = await fetchText(url);
    var $ = Widget.html.load(html);
    var cards = parseCards($);
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

// 蜘蛛的搜索即标签查：/tag/<keyword>，翻页 ?page=
async function search(params) {
  params = params || {};
  var keyword = pickKeyword(params);
  var page = parseInt(params.page, 10) || 1;
  if (!keyword) {
    return [{ id: "tip", type: "url", title: "输入英文标签后搜索，如 asian" }];
  }
  var url = listUrl("/tag/" + encodeURIComponent(keyword), page);
  try {
    var html = await fetchText(url);
    var $ = Widget.html.load(html);
    var cards = parseCards($);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关视频" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// ---- 详情/播放解析（与蜘蛛 detail 同口径：__PRELOAD_STATE__ 的 post-* 数据） ----

function extractPost(html) {
  var s = String(html || "");
  var m = s.match(/window\.__PRELOAD_STATE__\s*=\s*(\{.*?\})\s*;/s)
    || s.match(/window\.__PRELOAD_STATE__\s*=\s*(\{.*?\})\s*</s)
    || s.match(/window\.__PRELOAD_STATE__\s*=\s*(\{.*\})/s);
  if (!m) return null;
  var state;
  try { state = JSON.parse(m[1]); } catch (_) { return null; }
  var keys = Object.keys(state);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].indexOf("post-") === 0 && state[keys[i]] && state[keys[i]].post) {
      return state[keys[i]].post;
    }
  }
  return null;
}

// 挑最高画质：UHD > 原画 url > FHD > SD（各档可为 null，与蜘蛛的四档字段一致）
function bestPlayUrl(media) {
  if (!media) return "";
  return media.uhd_url || media.url || media.fhd_url || media.sd_url || "";
}

async function loadDetail(link) {
  var url = absUrl(link);
  try {
    var html = await fetchText(url);
    var post = extractPost(html);
    if (!post) {
      return { id: url, type: "url", title: "解析失败", description: "未找到帖子数据" };
    }
    var media = Array.isArray(post.media) ? post.media : [];
    // 蜘蛛固定用 media[0]；这里优先取第一个带视频直链的媒体（图片帖的 media[0] 是图片），
    // media[0] 本身是视频时与蜘蛛完全一致
    var chosen = null;
    for (var i = 0; i < media.length; i++) {
      if (media[i] && bestPlayUrl(media[i]) && media[i].type !== "photo" && media[i].type !== "image") {
        chosen = media[i];
        break;
      }
    }
    var first = media[0] || null;
    var pic = "";
    if (first) pic = first.thumb_url || first.thumb_webp_url || "";
    if (!pic && chosen) pic = chosen.thumb_url || chosen.thumb_webp_url || "";

    var rawTitle = post.text || post.slug || "Unknown";
    var fullText = String(rawTitle).replace(/\s+/g, " ").trim();
    var title = fullText.length > 120 ? fullText.slice(0, 120) : fullText;

    if (!chosen) {
      return {
        id: url,
        type: "url",
        title: title || "解析失败",
        posterPath: pic,
        coverUrl: pic,
        backdropPath: pic,
        description: "未找到播放地址"
      };
    }
    return {
      id: url,
      type: "detail",
      title: title,
      link: url,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: fullText,
      videoUrl: bestPlayUrl(chosen),
      playerType: "app",
      customHeaders: playHeaders()
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
