// 麻豆社 for REX (lai_madou v1.0.0)
// 移植自 mira-cat 蜘蛛 madou.js（py_madou，只读蓝图，逻辑等价移植）。
// 后端：https://madou.club（WordPress 站，HTML 页面解析）。
// 分类与蜘蛛 home() 一致：首页 .sitenav 解析出的栏目（去掉无 URL 的下拉父项「其他原创/企划」）。
// 详情：文章页 .article-content 内的 iframe 播放器页（dash.madou.club）里
// var token / var m3u8 拼出带令牌的 m3u8（蜘蛛 detail 逻辑），打开详情时实时解析。

WidgetMetadata = {
  id: "lai_madou",
  title: "麻豆社",
  description: "麻豆社（madou.club）：各厂牌栏目分类、站内搜索，播放实时解析",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://madou.club",
  detailCacheDuration: 180,
  modules: [
    {
      title: "分类浏览",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "栏目",
          type: "enumeration",
          value: "https://madou.club/category/%e9%ba%bb%e8%b1%86%e4%bc%a0%e5%aa%92",
          enumOptions: [
            { title: "麻豆传媒", value: "https://madou.club/category/%e9%ba%bb%e8%b1%86%e4%bc%a0%e5%aa%92" },
            { title: "麻豆番外篇", value: "https://madou.club/category/%e9%ba%bb%e8%b1%86%e7%95%aa%e5%a4%96%e7%af%87" },
            { title: "麻豆花絮", value: "https://madou.club/category/%e9%ba%bb%e8%b1%86%e8%8a%b1%e7%b5%ae" },
            { title: "HongKongDoll", value: "https://madou.club/category/hongkongdoll" },
            { title: "PsychopornTW", value: "https://madou.club/category/psychoporntw" },
            { title: "91制片厂", value: "https://madou.club/category/91%e5%88%b6%e7%89%87%e5%8e%82" },
            { title: "果冻传媒", value: "https://madou.club/category/%e6%9e%9c%e5%86%bb%e4%bc%a0%e5%aa%92" },
            { title: "蜜桃影像", value: "https://madou.club/category/%e8%9c%9c%e6%a1%83%e5%bd%b1%e5%83%8f" },
            { title: "天美传媒", value: "https://madou.club/category/%e5%a4%a9%e7%be%8e%e4%bc%a0%e5%aa%92" },
            { title: "皇家华人", value: "https://madou.club/category/%e7%9a%87%e5%ae%b6%e5%8d%8e%e4%ba%ba" },
            { title: "兔子先生", value: "https://madou.club/category/%e5%85%94%e5%ad%90%e5%85%88%e7%94%9f" },
            { title: "星空无限传媒", value: "https://madou.club/category/%e6%98%9f%e7%a9%ba%e6%97%a0%e9%99%90%e4%bc%a0%e5%aa%92" },
            { title: "爱豆", value: "https://madou.club/category/%e7%88%b1%e8%b1%86" },
            { title: "麻豆导演系列", value: "https://madou.club/category/%e9%ba%bb%e8%b1%86%e5%af%bc%e6%bc%94%e7%b3%bb%e5%88%97" },
            { title: "大象传媒", value: "https://madou.club/category/%e5%a4%a7%e8%b1%a1%e4%bc%a0%e5%aa%92" },
            { title: "猫爪影像", value: "https://madou.club/category/%e7%8c%ab%e7%88%aa%e5%bd%b1%e5%83%8f" },
            { title: "精东影业", value: "https://madou.club/category/%e7%b2%be%e4%b8%9c%e5%bd%b1%e4%b8%9a" },
            { title: "杏吧", value: "https://madou.club/category/%e6%9d%8f%e5%90%a7" },
            { title: "乐播传媒", value: "https://madou.club/category/%e4%b9%90%e6%92%ad%e4%bc%a0%e5%aa%92" },
            { title: "草莓", value: "https://madou.club/category/%e8%8d%89%e8%8e%93" },
            { title: "抖阴", value: "https://madou.club/category/%e6%8a%96%e9%98%b4" },
            { title: "SA国际传媒", value: "https://madou.club/category/sa%e5%9b%bd%e9%99%85%e4%bc%a0%e5%aa%92" },
            { title: "起点传媒/性视界传媒", value: "https://madou.club/category/%e8%b5%b7%e7%82%b9%e4%bc%a0%e5%aa%92-%e6%80%a7%e8%a7%86%e7%95%8c%e4%bc%a0%e5%aa%92" },
            { title: "大鸟十八", value: "https://madou.club/category/%e5%a4%a7%e9%b8%9f%e5%8d%81%e5%85%ab" },
            { title: "小鹏奇啪行", value: "https://madou.club/category/%e5%b0%8f%e9%b9%8f%e5%a5%87%e5%95%aa%e8%a1%8c" },
            { title: "女优淫娃培训营", value: "https://madou.club/category/%e5%a5%b3%e4%bc%98%e6%b7%ab%e5%a8%83%e5%9f%b9%e8%ae%ad%e8%90%a5" },
            { title: "淫欲游戏王", value: "https://madou.club/category/%e6%b7%ab%e6%ac%b2%e6%b8%b8%e6%88%8f%e7%8e%8b" },
            { title: "女神羞羞研究所", value: "https://madou.club/category/%e5%a5%b3%e7%a5%9e%e7%be%9e%e7%be%9e%e7%a0%94%e7%a9%b6%e6%89%80" },
            { title: "突袭女优家", value: "https://madou.club/category/%e7%aa%81%e8%a2%ad%e5%a5%b3%e4%bc%98%e5%ae%b6" },
            { title: "情趣K歌房", value: "https://madou.club/category/%e6%83%85%e8%b6%a3k%e6%ad%8c%e6%88%bf" },
            { title: "KISS糖果屋", value: "https://madou.club/category/kiss%e7%b3%96%e6%9e%9c%e5%b1%8b" },
            { title: "点赞排行", value: "https://madou.club/likes" },
            { title: "7天热门", value: "https://madou.club/week" },
            { title: "30天热门", value: "https://madou.club/month" }
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

var MD_BASE = "https://madou.club";
var MD_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function mdHeaders() {
  return {
    "User-Agent": MD_UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": MD_BASE + "/"
  };
}

async function mdGet(url) {
  var res = await Widget.http.get(url, { headers: mdHeaders(), timeout: 20000 });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function mdAbs(href) {
  var s = String(href || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.charAt(0) === "/") return MD_BASE + s;
  return MD_BASE + "/" + s;
}

// 与蜘蛛 category/search 同一解析：.excerpts-wrapper article
function mdParseList(html) {
  var out = [];
  if (!html) return out;
  var $ = Widget.html.load(html);
  $(".excerpts-wrapper article").each(function (i, el) {
    var $a = $(el);
    var link = $a.find("a").first().attr("href") || "";
    var title = ($a.find("h2").first().text() || "").replace(/\s+/g, " ").trim();
    var img = $a.find("img").first().attr("data-src") || $a.find("img").first().attr("src") || "";
    var remarks = ($a.find(".post-view").first().text() || "").replace(/\s+/g, " ").trim();
    link = mdAbs(link);
    if (!link || !title) return;
    img = mdAbs(img);
    out.push({
      id: link,
      type: "url",
      title: title,
      posterPath: img,
      coverUrl: img,
      backdropPath: img,
      link: link,
      description: remarks || "",
      mediaType: "movie"
    });
  });
  return out;
}

async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var path = String(params.path || "https://madou.club/category/%e9%ba%bb%e8%b1%86%e4%bc%a0%e5%aa%92");
  var url = page > 1 ? path.replace(/\/+$/, "") + "/page/" + page : path;
  try {
    var html = await mdGet(url);
    var list = mdParseList(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有更多内容" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

function mdKeyword(params) {
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
  var kw = mdKeyword(params);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!kw) return [{ id: "tip", type: "url", title: "输入关键词搜索" }];
  var url = MD_BASE + "/page/" + page + "?s=" + encodeURIComponent(kw);
  try {
    var html = await mdGet(url);
    var list = mdParseList(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

async function loadDetail(link) {
  var url = mdAbs(String(link || ""));
  try {
    var html = await mdGet(url);
    var title = "";
    var cover = "";
    var iframe = "";
    try {
      var $ = Widget.html.load(html);
      title = ($("h1").first().text() || "").replace(/\s+/g, " ").trim();
      if (!title) {
        var og = $('meta[property="og:title"]').attr("content") || "";
        title = og.replace(/\s*[|—–-].*$/, "").trim();
      }
      cover = $('meta[property="og:image"]').attr("content") || "";
      iframe = $(".article-content iframe").first().attr("src") || "";
    } catch (_) {}
    if (!title) {
      var tm = html.match(/<title[^>]*>([^<]+)/i);
      title = tm ? tm[1].replace(/\s*[|—–-].*$/, "").trim() : "麻豆社";
    }
    if (!iframe) {
      var fm = html.match(/<iframe[^>]+src=["']([^"']*\/share\/[^"']*)["']/i);
      if (fm) iframe = fm[1];
    }
    if (!iframe) {
      return { id: url, type: "url", title: title || "解析失败", description: "未找到播放器" };
    }
    // iframe 为播放器页地址（实测为绝对地址）；相对时按文章页域名补全
    if (iframe.indexOf("//") === 0) iframe = "https:" + iframe;
    else if (iframe.charAt(0) === "/") iframe = url.replace(/^(https?:\/\/[^\/]+).*$/, "$1") + iframe;
    var om = iframe.match(/^(https?:\/\/[^\/]+)/);
    var origin = om ? om[1] : MD_BASE;
    var playerHtml = await mdGet(iframe);
    var tokenM = playerHtml.match(/var token = "(.+?)";/);
    var m3u8M = playerHtml.match(/var m3u8 = '(.+?)';/);
    if (!tokenM || !m3u8M) {
      return { id: url, type: "url", title: title || "解析失败", description: "未找到播放地址" };
    }
    var videoUrl = origin + m3u8M[1] + "?token=" + tokenM[1];
    cover = mdAbs(cover);
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
      customHeaders: {
        "User-Agent": MD_UA,
        "Referer": MD_BASE + "/"
      }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
