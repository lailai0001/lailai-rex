// 91大赛 for REX (lai_dycg66 v1.0.0)
// 移植自 mira-cat 蜘蛛 dycg66.js (key py_dycg66), 后端 https://www.dycg66.com/ (Typecho Xc 主题)。
// 列表: <li class="Xc_home_article-si"> 卡片 (a href /archives/{id}/ + title, img data-src 封面, h2.title 标题);
// 详情: <div class="dplayer" data-config="..."> 里 video.url 即 m3u8 直链 (带时效 token, 详情时现取现用),
//   多段时按段列出, REX 单地址只放第 1 段;
// 播放: 单一最优地址 = 流中转 V2 中转集 (javsb-relay /m3u8?u= 形态, 原样照搬猫源 detail 的构造方式)。
// 封面: pic.hdhwqx.cn 直取是加密密文, 走已部署的 51chigua 解密代理出图 (蜘蛛写死地址, 原样沿用)。

WidgetMetadata = {
  id: "lai_dycg66",
  title: "91大赛",
  description: "91大赛：今日大赛/热搜大赛/每日大赛等 14 个分类，详情页直解 dplayer 播放地址并走流中转",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://www.dycg66.com/",
  detailCacheDuration: 180,
  modules: [
    { title: "最新更新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "今日大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "jrds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "热搜大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "rsds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "每日大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "mrds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "AI短剧", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "aidj" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "女神大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "nsds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "乱伦大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "llds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "学院大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "xyds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "网红大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "whds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "撸友看片", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "lyds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "优选投放区", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "sjbzq" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "奇闻大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "qwds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "明星吃瓜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "mxds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "女同大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ntds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "污漫大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "wmds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
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

var BASE = "https://www.dycg66.com/";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var IMG_PROXY = "https://51chigua.li768435813.workers.dev/img?url=";
var RELAY_M3U8 = "https://javsb-relay-production.up.railway.app/m3u8?u=";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": BASE
  };
}

function decodeHtml(s) {
  return t(s)
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function cleanText(s) {
  return decodeHtml(s)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function getText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function proxyPic(pic) {
  if (!pic) return "";
  if (pic.indexOf("http") === 0) return IMG_PROXY + encodeURIComponent(pic);
  return pic;
}

function parseList(html) {
  var items = [];
  var seen = {};
  var chunks = String(html || "").split('<li class="Xc_home_article-si');
  for (var i = 1; i < chunks.length; i++) {
    var blk = chunks[i];
    var am = blk.match(/<a href="([^"]*\/archives\/\d+\/)"[^>]*title="([^"]*)"/i)
      || blk.match(/<a href="([^"]*\/archives\/\d+\/)"/i);
    if (!am) continue;
    var href = am[1];
    var url = href.indexOf("http") === 0 ? href : BASE.replace(/\/$/, "") + href;
    if (seen[url]) continue;
    var hm = blk.match(/<h2 class="title">([^<]+)<\/h2>/i);
    var title = cleanText(hm ? hm[1] : (am[2] || ""));
    if (!title || title.length < 2) continue;
    var pm = blk.match(/data-src="(https?:[^"]+)"/i);
    seen[url] = 1;
    var cover = proxyPic(pm ? pm[1] : "");
    items.push({ id: url, type: "url", title: title, posterPath: cover, coverUrl: cover, backdropPath: cover, link: url, description: "", mediaType: "movie" });
    if (items.length >= 20) break;
  }
  return items;
}

function listOrMsg(html, url) {
  if (!html) return [{ id: "empty", type: "url", title: "空页面" }];
  var list = parseList(html);
  return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
}

function listUrl(cat, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  cat = t(cat) || "latest";
  var base = BASE.replace(/\/$/, "");
  if (cat === "latest") {
    return page === 1 ? base + "/" : base + "/page/" + page + "/";
  }
  return page === 1 ? base + "/category/" + cat + "/" : base + "/category/" + cat + "/" + page + "/";
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var cat = String(params.path || params.cat || "latest");
  var url = listUrl(cat, page);
  try {
    var html = await getText(url);
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
  var url = BASE + "search/" + encodeURIComponent(wd) + "/";
  if (page > 1) url += page + "/";
  try {
    var html = await getText(url);
    return listOrMsg(html, url);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// 与蜘蛛 parseDetail 同口径: 逐个 dplayer div 取 data-config 的 video.url。
function extractEps(html) {
  var eps = [];
  var divs = String(html || "").match(/<div class="dplayer"([^>]*)>/gi) || [];
  for (var i = 0; i < divs.length; i++) {
    var attrs = divs[i];
    var cm = attrs.match(/data-config="([^"]*)"/i);
    var url = "";
    if (cm) {
      var cfgText = cm[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      try {
        var cfg = JSON.parse(cfgText);
        if (cfg && cfg.video && cfg.video.url) url = cfg.video.url;
      } catch (e) {}
      if (!url) {
        var um = cfgText.match(/"url"\s*:\s*"(https?:[^"]+\.m3u8[^"]*)"/i);
        if (um) url = um[1];
      }
    }
    if (!url) continue;
    url = url.replace(/\\u0026/g, "&");
    var tm = attrs.match(/data-video_title="([^"]*)"/i);
    eps.push({ name: tm ? cleanText(tm[1]) : "", url: url });
  }
  return eps;
}

async function loadDetail(link) {
  try {
    var url = String(link || "");
    if (!/^https?:\/\//i.test(url)) url = BASE + url.replace(/^\/+/, "");
    if (!url) {
      return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    }
    var html = await getText(url);
    var hm = html.match(/<h1[^>]*>([\s\S]{0,400}?)<\/h1>/i);
    var title = hm ? cleanText(hm[1]) : "";
    var name = title || "91大赛";
    var eps = extractEps(html);
    var pic = "";
    var dm = html.match(/<div class="dplayer"[^>]*data-config="([^"]*)"/i);
    if (dm) {
      try {
        var cfg = JSON.parse(dm[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
        if (cfg && cfg.video && cfg.video.pic) {
          var p = cfg.video.pic;
          pic = proxyPic(p.indexOf("http") === 0 ? p : "https://pic.hdhwqx.cn" + p);
        }
      } catch (e) {}
    }
    if (!eps.length) {
      return { id: url, type: "url", title: name, description: "未找到播放地址" };
    }
    // 猫源多段按段列出; REX 单地址只放第 1 段。
    var vu = eps[0].url;
    var videoUrl = /\.m3u8/i.test(vu) ? RELAY_M3U8 + encodeURIComponent(vu) : vu;
    return {
      id: url,
      type: "detail",
      title: name,
      link: url,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE
      }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
