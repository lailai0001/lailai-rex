// Javtiful for REX (lai_javtiful v1.0.0)
// 移植自 mira-cat 蜘蛛 py_javtiful.js（只读蓝图），后端 https://javtiful.com。
// 列表：卡片 <a href="/video/{id}/{slug}">，封面取懒加载真图（data-front-lazy-src / data-src，跳过占位图）。
// 详情：页内内联 JSON "playback"（endpoint + ticket，票据时效约 30 分钟，播放时现取现投）；
//   POST 该 endpoint（ticket 表单体，头 X-Requested-With + Referer embed 页）取 sources；
//   有几档清晰度按 size 取最高一档直链；2026-11-01 后站方 sources 改相对地址 MP4（如 /media/video/{id}/720p?…，
//   无 .mp4 后缀），相对地址一律补成 javtiful.com 绝对地址；无 fallbackSrc 时不硬凑 MP4 线。
// 字幕：猫源本身无字幕线，本模块不接。

WidgetMetadata = {
  id: "lai_javtiful",
  title: "Javtiful",
  description: "Javtiful（javtiful.com）：无码破解/最新/无码/有码等 25 个分类，详情现取票据 POST 取最高画质直链",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://javtiful.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] },
    { title: "无码破解", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/reducing-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/videos" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/uncensored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/censored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "丰满", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/bbw/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/big-tits/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "偷情", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/affair/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/amateur/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "美少女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/beautiful-girl/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "国产", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/chinese-av/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "角色扮演", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/cosplay/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "剧情", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/drama/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "女上司", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/female-boss/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "女侦探", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/female-investigator/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "女学生", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/female-student/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "女教师", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/female-teacher/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "家政妇", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/housekeeper/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "催眠", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/hypnosis/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/married-woman/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "熟女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/mature-woman/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "熟妇", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/milf/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "护士", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/nurse/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "OL", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/office-lady/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "校园", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/school-girls/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "嫂子", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/sister-in-law/" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
  ]
};

var HOST = "https://javtiful.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";

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

function absUrl(url) {
  url = t(url);
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.charAt(0) === "/") return HOST + url;
  return HOST + "/" + url;
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": referer || HOST + "/"
  };
}

async function getText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function imgOf(block) {
  var clean = block.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  var tagRe = /<img[^>]*>/gi;
  var tagM;
  while ((tagM = tagRe.exec(clean))) {
    var tag = tagM[0];
    var dm = tag.match(/data-[a-z0-9\-]*lazy-src\s*=\s*"([^"]+)"/i)
      || tag.match(/data-src\s*=\s*"([^"]+)"/i)
      || tag.match(/data-original\s*=\s*"([^"]+)"/i);
    if (dm && dm[1] && !/placeholder/i.test(dm[1]) && dm[1].indexOf("data:image") !== 0) {
      return dm[1].charAt(0) === "/" ? HOST + dm[1] : dm[1];
    }
    var sm = tag.match(/src\s*=\s*"([^"]+)"/i);
    if (sm && sm[1] && !/placeholder/i.test(sm[1]) && sm[1].indexOf("data:image") !== 0) {
      return sm[1].charAt(0) === "/" ? HOST + sm[1] : sm[1];
    }
  }
  return "";
}

function parseCards(html) {
  var items = [];
  var seen = {};
  var re = /<a[^>]*href="(\/video\/\d+\/[^"]+)"[^>]*>([\s\S]{0,1200}?)<\/a>/gi;
  var m;
  while ((m = re.exec(html))) {
    var href = m[1];
    if (seen[href]) continue;
    seen[href] = 1;
    var inner = m[2];
    var title = "";
    var am = inner.match(/<img[^>]*alt="([^"]+)"/i);
    if (am) title = cleanText(am[1]).replace(/^Thumbnail for\s+/i, "");
    if (!title) title = cleanText(inner);
    if (!title || title.length < 2) continue;
    var url = absUrl(href);
    var cover = imgOf(inner);
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
  cat = t(cat) || "/category/amateur/";
  var base = HOST + "/" + cat.replace(/^\/+/, "").replace(/\/+$/, "");
  return page === 1 ? base + "/" : base + "/?page=" + page;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var cat = String(params.path || params.cat || "/category/amateur/");
  var url = listUrl(cat, page);
  try {
    var html = await getText(url, HOST + "/");
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
  var url = HOST + "/search?q=" + encodeURIComponent(wd) + (page > 1 ? "&page=" + page : "");
  try {
    var html = await getText(url, HOST + "/");
    return listOrMsg(html, url);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// POST（带守卫）：运行时无 post 方法时返回空，调用方按失败降级
async function httpPostRaw(url, bodyText, headers) {
  try {
    if (typeof Widget.http.post === "function") {
      var res = await Widget.http.post(url, bodyText, { headers: headers });
      if (res && res.data != null) return res.data;
      if (typeof res === "string") return res;
    }
  } catch (e) { /* 降级 */ }
  return null;
}

async function loadDetail(link) {
  try {
    var url = String(link || "");
    if (!/^https?:\/\//i.test(url)) url = absUrl(url);
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var html = await getText(url, HOST + "/");
    var title = firstMatch(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
      || cleanText(firstMatch(html, /<h1[^>]*>([\s\S]{0,300}?)<\/h1>/i))
      || "Javtiful";
    var cover = firstMatch(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    var pm = html.match(/"playback"\s*:\s*\{\s*"endpoint"\s*:\s*"([^"]+)"\s*,\s*"ticket"\s*:\s*"([^"]+)"/i);
    var videoUrl = "";
    var referer = firstMatch(html, /"embedUrl"\s*:\s*"([^"]+)"/i) || url;
    if (pm) {
      var endpoint = pm[1].indexOf("http") === 0 ? pm[1] : HOST + pm[1];
      var raw = await httpPostRaw(endpoint, "ticket=" + encodeURIComponent(pm[2]), {
        "User-Agent": UA,
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
        "Referer": referer
      });
      if (raw != null) {
        var j = null;
        try { j = typeof raw === "string" ? JSON.parse(raw) : raw; } catch (e) { j = null; }
        if (j && j.success && j.sources && j.sources.length) {
          var best = "";
          var bestSize = -1;
          var fb = "";
          for (var i = 0; i < j.sources.length; i++) {
            var s = j.sources[i];
            if (!s) continue;
            if (s.src) {
              var sz = parseInt(s.size, 10);
              if (isNaN(sz)) sz = 0;
              if (sz >= bestSize) { bestSize = sz; best = absUrl(s.src); }
            }
            if (s.fallbackSrc && !fb) fb = absUrl(s.fallbackSrc);
          }
          videoUrl = best || fb;
        }
      }
    }
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
      customHeaders: { "User-Agent": UA, "Referer": referer }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
