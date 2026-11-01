// 八卦 for REX (lai_bagua v1.0.2)
// 移植自 mira-cat 蜘蛛 bagua.js, 后端: https://www.mrds66.com (WordPress, 服务端渲染)。
// 列表: 首页/分类页 <article BlogPosting> 卡片, 与蜘蛛同一套正则解析;
// 详情: dplayer data-config 里的 video.url, 兜底正则 .m3u8 / .mp4, 与蜘蛛 extractVideoUrl 同口径。
// 封面为 AES 加密存储, 走已部署的 bagua-img-proxy 解密代理出图 (蜘蛛写死地址, 原样沿用)。
// v1.0.2 同步修复 (2026-11-01, 对照猫源流中转 V2): 清单域名在设备侧被拦
// (如 op.udhhzr.cn 一类) 时直连旧逻辑播不了; 现 loadDetail 主线改走
// javsb-relay 的 /m3u8 中转集 URL (猫源 detail 构造方式原样搬: 仅 .m3u8
// 包中转, 其余直连); 中转只改写非直连 host 的分片/密钥、其余直连省额度。
// 注意: REX 单线路格式 videoUrl 只放一个最优地址, 猫源的直连集在 REX 里
// 无位置, 故只放中转集 (中转失效时无 App 内直连集可切, 见报告遗留风险)。

WidgetMetadata = {
  id: "lai_bagua",
  title: "八卦",
  description: "八卦（mrds66.com）：每日大赛/热搜吃瓜/网红黑料等 21 个分类，详情页直解 dplayer 播放地址、清单走 javsb-relay 中转",
  author: "lai",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  site: "https://www.mrds66.com",
  detailCacheDuration: 180,
  modules: [
    { title: "最新更新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "每日大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "mrds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "主题大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ztds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "热搜吃瓜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "rstt" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "校园学生", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "xazd" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "必撸大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "blyp" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "反差泄密", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "fctg" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "网红黑料", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "mhds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "猎奇重口", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "lqdp" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "AV看片", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "jdsj" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "明星大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "mxwh" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "动漫之家", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "smdh" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "影视国漫", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "dypd" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "cos写真", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "mtds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "声控ASMR", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ysds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "寸止挑战", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "czds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "混剪PMV", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "hjds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "原创投稿", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tgds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "欧美精品", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "omjp" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "全网参赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "qwcs" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "AI剧场", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "aijc" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
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

var BASE = "https://www.mrds66.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var IMG_PROXY = "https://bagua-img-proxy.li768435813.workers.dev/img?url=";
var IMG_PROXY_51 = "https://51chigua.li768435813.workers.dev/img?url=";
// 流中转 V2 (与猫源 detail 一致, 通用 HTTP 服务, REX 内 Widget.http 同样可用)。
var RELAY_M3U8 = "https://javsb-relay-production.up.railway.app/m3u8?u=";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": BASE + "/"
  };
}

function isChallenge(html) {
  var s = String(html || "");
  if (/<title[^>]*>\s*Just a moment/i.test(s)) return true;
  if (/verify you are human/i.test(s.slice(0, 800))) return true;
  return false;
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  if (isChallenge(body)) throw new Error("被 Cloudflare 拦截，请稍后重试");
  return body;
}

function t(v) {
  return String(v == null ? "" : v).trim();
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

function firstMatch(text, re, idx) {
  var m = String(text || "").match(re);
  return m ? decodeHtml(m[idx || 1] || "") : "";
}

function absUrl(url) {
  url = t(url);
  if (!url) return "";
  if (/^\/\//.test(url)) return "https:" + url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.charAt(0) === "/") return BASE + url;
  return BASE + "/" + url;
}

// 封面按域路由（与 mira-cat 蜘蛛同款）：pic.*.cn 图床走 51chigua 解密，其余走 bagua
function proxyCover(url) {
  url = t(url);
  if (!url) return "";
  if (url.indexOf("data:") === 0) return url;
  if (url.indexOf("bagua-img-proxy") >= 0) return url;
  if (url.indexOf("51chigua") >= 0) return url;
  var abs = absUrl(url);
  var host = "";
  try { host = abs.split("/")[2] || ""; } catch (e) {}
  if (/^pic\.[^/]*\.cn$/i.test(host)) return IMG_PROXY_51 + encodeURIComponent(abs);
  return IMG_PROXY + encodeURIComponent(abs);
}

function parseList(html) {
  var items = [];
  var seen = {};
  if (!html) return items;
  var articleRe = /<article\b[^>]*itemtype=["'][^"']*BlogPosting[^"']*["'][^>]*>[\s\S]*?<\/article>/gi;
  var m;
  while ((m = articleRe.exec(html))) {
    var block = m[0];
    if (/class=["'][^"']*ad-item/i.test(block)) continue;
    var href =
      firstMatch(block, /<a\b[^>]*href=["']([^"']*\/archives\/[^"']+)["'][^>]*>/i) ||
      firstMatch(block, /<meta\b[^>]*itemprop=["'][^"']*url[^"']*["'][^>]*content=["']([^"']+)["']/i);
    var title =
      firstMatch(block, /<h2[^>]*class=["'][^"']*post-card-title[^"']*["'][^>]*>([\s\S]*?)<\/h2>/i) ||
      firstMatch(block, /<meta\b[^>]*itemprop=["']headline["'][^>]*content=["']([^"']+)["']/i);
    var poster =
      firstMatch(block, /loadBannerDirect\(\s*["']([^"']+)["']/i) ||
      firstMatch(block, /<meta\b[^>]*itemprop=["']image["'][^>]*content=["']([^"']+)["']/i);
    if (!href || !title) continue;
    var url = absUrl(href);
    if (seen[url]) continue;
    seen[url] = 1;
    var cover = proxyCover(poster);
    items.push({
      id: url,
      type: "url",
      title: cleanText(title),
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: url,
      description: "",
      mediaType: "movie"
    });
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
  if (cat === "latest") {
    return page === 1 ? BASE + "/" : BASE + "/page/" + page + "/";
  }
  return page === 1 ? BASE + "/category/" + cat + "/" : BASE + "/category/" + cat + "/" + page + "/";
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var cat = String(params.path || params.cat || "latest");
  var url = listUrl(cat, page);
  try {
    var html = await fetchText(url);
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
  var enc = encodeURIComponent(wd);
  var url = page === 1 ? BASE + "/search/" + enc + "/" : BASE + "/search/" + enc + "/" + page + "/";
  try {
    var html = await fetchText(url);
    return listOrMsg(html, url);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// 与蜘蛛 extractVideoUrl 同口径: dplayer data-config -> .m3u8 -> .mp4
function extractVideoUrl(html) {
  var cfgText = firstMatch(html, /<div\b[^>]*class=["'][^"']*dplayer[^"']*["'][^>]*data-config=(["'])([\s\S]*?)\1/i, 2);
  if (cfgText) {
    try {
      var cfg = JSON.parse(decodeHtml(cfgText));
      if (cfg && cfg.video && cfg.video.url) return cfg.video.url;
    } catch (e) {
      var u = firstMatch(cfgText, /"url"\s*:\s*"([^"]+)"/i);
      if (u) return u.replace(/\\\//g, "/");
    }
  }
  var m3u8 = firstMatch(html, /["'](https?:\\?\/\\?\/[^"']+?\.m3u8[^"']*)["']/i);
  if (m3u8) return m3u8.replace(/\\\//g, "/");
  var mp4 = firstMatch(html, /["'](https?:\\?\/\\?\/[^"']+?\.mp4[^"']*)["']/i);
  if (mp4) return mp4.replace(/\\\//g, "/");
  return "";
}

async function loadDetail(link) {
  try {
    var url = String(link || "");
    if (!/^https?:\/\//i.test(url)) url = absUrl(url);
    if (!url) {
      return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    }
    var html = await fetchText(url);

    var title =
      firstMatch(html, /<h1[^>]*class=["'][^"']*post-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i) ||
      firstMatch(html, /<meta\b[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
    var coverRaw = firstMatch(html, /<meta\b[^>]*itemprop=["']image["'][^>]*content=["']([^"']*)["']/i) ||
      firstMatch(html, /<meta\b[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i);
    var cover = proxyCover(coverRaw);
    var name = cleanText(title) || url;

    var videoUrl = extractVideoUrl(html);
    if (!videoUrl) {
      return { id: url, type: "url", title: name, description: "未找到播放地址" };
    }
    // V2 主线 (猫源 detail 构造方式原样搬): .m3u8 走中转集, 其余直连;
    // REX 单线路只放一个地址, 故只放中转集, 直连集无位置。
    var direct = absUrl(videoUrl);
    var playUrl = /\.m3u8/i.test(direct) ? RELAY_M3U8 + encodeURIComponent(direct) : direct;
    return {
      id: url,
      type: "detail",
      title: name,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: playUrl,
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
