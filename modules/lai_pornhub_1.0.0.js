// Pornhub for REX (lai_pornhub v1.0.0)
// 来源蓝图: mira-cat 蜘蛛 pornhub.js (py_pornhub), 只读移植, 未改动原蜘蛛。
// 后端: https://cn.pornhub.com, 列表/搜索页 li.videoBox 解析, 详情页 flashvars 的
//       mediaDefinitions 里取 format=hls 的 master.m3u8。
// 与蜘蛛的两点口径说明:
//   1) UA 沿用蜘蛛的 Windows Chrome UA —— 站方按 UA 返回不同版式, iPhone UA 返回的
//      移动版列表页没有 li.videoBox 结构 (实测), 桌面版式才可解析; 详情页两种 UA 都有 flashvars。
//   2) 蜘蛛取 hls 定义的最后一条, 实测顺序不按画质排列 (样本为 1080/240/480/720,
//      蜘蛛口径只拿到 720); 本模块按 height 取最高档, 落实"尽量最高画质"。

WidgetMetadata = {
  id: "lai_pornhub",
  title: "Pornhub",
  description: "Pornhub（cn.pornhub.com）：首页/最新/最多观看/最热/最高分/最长六个分类，播放取最高画质 HLS",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://cn.pornhub.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "视频",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "分类",
          type: "enumeration",
          value: "sy",
          enumOptions: [
            { title: "Home", value: "sy" },
            { title: "Newest", value: "cm" },
            { title: "Most Viewed", value: "mv" },
            { title: "Hottest", value: "ht" },
            { title: "Top Rated", value: "tr" },
            { title: "Longest", value: "lg" }
          ]
        },
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

var BASE = "https://cn.pornhub.com";
// 沿用蜘蛛 UA (理由见文件头注释)
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
  };
}

function playHeaders() {
  return {
    "User-Agent": UA,
    "Origin": BASE,
    "Referer": BASE + "/"
  };
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function absLink(href) {
  var s = String(href || "").split("#")[0];
  if (/^https?:\/\//i.test(s)) return s;
  if (s.charAt(0) === "/") return BASE + s;
  return BASE + "/" + s;
}

// 与蜘蛛 Rye/Oye 相同的选择器解析列表页
function parseList(html) {
  if (!html) return [{ id: "empty", type: "url", title: "空页面" }];
  var $ = Widget.html.load(html);
  var out = [];
  $("li.videoBox").each(function (i, el) {
    var $box = $(el);
    var href = $box.find(".phimage a.img").attr("href") || "";
    if (!href) return;
    var title = $box.find(".title a").attr("title") || $box.find(".title a").text().replace(/\s+/g, " ").trim();
    var $img = $box.find(".phimage a.img img");
    var pic = $img.attr("src") || $img.attr("data-mediumthumb") || "";
    var views = $box.find(".views").text().replace(/\s+/g, " ").trim();
    var duration = $box.find(".duration").text().replace(/\s+/g, " ").trim();
    var link = absLink(href);
    var descParts = [];
    if (views) descParts.push(views);
    if (duration) descParts.push(duration);
    out.push({
      id: link,
      type: "url",
      title: title || link,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: descParts.join(" · "),
      releaseDate: duration || "",
      mediaType: "movie"
    });
  });
  return out.length ? out : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
}

async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var cat = String(params.path || "sy");
  // 与蜘蛛 Rye 相同的 URL 拼法
  var url = BASE + "/video?";
  if (cat !== "sy") url = BASE + "/video?o=" + cat;
  if (page > 1) url += (cat === "sy" ? "page=" : "&page=") + page;
  try {
    var html = await fetchText(url);
    return parseList(html);
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
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!keyword) return [{ id: "tip", type: "url", title: "输入关键词搜索" }];
  var url = BASE + "/video/search?search=" + encodeURIComponent(keyword) + "&page=" + page;
  try {
    var html = await fetchText(url);
    return parseList(html);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

async function loadDetail(link) {
  try {
    var url = absLink(link);
    var html = await fetchText(url);

    // 与蜘蛛 Iye 相同的 flashvars 提取; 在其基础上按 height 挑最高档 hls
    var videoUrl = "";
    var m = html.match(/var flashvars_.* = \{(.*?)\};/);
    if (m && m[1]) {
      try {
        var fv = JSON.parse("{" + m[1] + "}");
        var defs = (fv.mediaDefinitions || []).filter(function (d) { return d && d.format === "hls" && d.videoUrl; });
        var best = null;
        for (var i = 0; i < defs.length; i++) {
          var h = parseInt(defs[i].height || defs[i].quality, 10) || 0;
          if (!best || h > best.h) best = { h: h, url: defs[i].videoUrl };
        }
        if (best) videoUrl = best.url;
      } catch (_) {}
    }

    var title = "";
    var cover = "";
    try {
      var $ = Widget.html.load(html);
      title = $("h1.title").text().replace(/\s+/g, " ").trim() || $('meta[property="og:title"]').attr("content") || "";
      cover = $('meta[property="og:image"]').attr("content") || "";
    } catch (_) {}
    if (!title) {
      var tm = html.match(/<title[^>]*>([^<]+)/i);
      title = tm ? tm[1].replace(/\s*[|].*$/, "").trim() : "Pornhub";
    }

    if (!videoUrl) {
      return { id: url, type: "url", title: title || "解析失败", description: "未找到播放地址" };
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
      customHeaders: playHeaders()
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
