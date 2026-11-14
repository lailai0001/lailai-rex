// 91吃瓜 for REX (lai_91cg v1.0.0)
// 移植自 mira-cat 蜘蛛 cg91.js (key py_91cg), 后端 https://www.91cg1.com/ (Typecho Mirages 主题)。
// 列表: <a href="/archives/{id}/"> 后跟 post-card 块, 封面在 loadBannerDirect('...') 里,
//   标题在 <h2 class="post-card-title"> 里 (含内嵌 wrap 标签需先剔除);
// 详情: <div class="dplayer" data-config='...'> 里 video.url 即 m3u8 直链 (带时效 token, 详情时现取),
//   多段按段列出, REX 单地址只放第 1 段;
// 播放: 单一最优地址 = 流中转 V2 中转集 (javsb-relay /m3u8?u= 形态, 原样照搬猫源 detail 的构造方式)。
// 探针: 取到 m3u8 后先看体长度, 0 字节就重取一次详情再探, 仍 0 字节则如实返回失败兜底, 不给假地址;
//   只探 m3u8 清单, 绝不探 mp4; 无播放器的文章直接走失败兜底, 不给猫源式的假线路。
// 封面: pic.hdhwqx.cn 直取是加密密文, 走已部署的 51chigua 解密代理出图 (蜘蛛写死地址, 原样沿用)。

WidgetMetadata = {
  id: "lai_91cg",
  title: "91吃瓜",
  description: "91吃瓜：今日吃瓜/每日大赛/AI短剧等 21 个分类，详情页直解 dplayer 播放地址并走流中转",
  author: "lai",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  site: "https://www.91cg1.com/",
  detailCacheDuration: 180,
  modules: [
    { title: "最新更新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "今日吃瓜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "zxcghl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "AI短剧", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "dydj" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "每日大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "mrds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "实时偷拍", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "sstp" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "最高点击", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "rsdg" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "深夜撸片", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "lpsd" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "海角乱伦", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "hjll" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "91探花", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "91th" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "成人动漫", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "crdm" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "91周榜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "zdtop" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "91月榜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ydtop" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "必吃大瓜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "bcdg" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "网红黑料", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "whhl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "明星黑料", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "mxhl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "社会奇闻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "qwys" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "师生专栏", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "xsjlb" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "反差靓女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "fclv" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "网黄合集", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "gcwh" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "明星AI", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "aikj" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "自拍偷拍", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "zptp" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "猎奇重口", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "lqzk" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
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

var BASE = "https://www.91cg1.com/";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var IMG_PROXY = "https://51chigua.li768435813.workers.dev/img?url=";
var RELAY_M3U8 = "https://javsb-relay.li768435813.workers.dev/m3u8?u=";

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
    .replace(/<div class="wrap">[\s\S]*?<\/div>/gi, "")
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
  var chunks = String(html || "").replace(/https:\/\/www\.91cg1\.com\/archives\//g, "/archives/").split('<a href="/archives/');
  for (var i = 1; i < chunks.length; i++) {
    var blk = chunks[i].slice(0, 8000);
    var idm = blk.match(/^(\d+)\//);
    if (!idm) continue;
    var url = BASE + "archives/" + idm[1] + "/";
    if (seen[url]) continue;
    var hm = blk.match(/<h2 class="post-card-title"[^>]*>([\s\S]{0,800}?)<\/h2>/i);
    var title = hm ? cleanText(hm[1]) : "";
    if (!title || title.length < 2) continue;
    var pm = blk.match(/loadBannerDirect\('([^']+)'/i);
    seen[url] = 1;
    var cover = proxyPic(pm ? pm[1] : "");
    items.push({ id: url, type: "url", title: title, posterPath: cover, coverUrl: cover, backdropPath: cover, link: url, description: "", mediaType: "movie" });
    if (items.length >= 24) break;
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

// 与蜘蛛 extractEps 同口径: 逐个 dplayer div 取 data-config 的 video.url。
function extractEps(html) {
  var eps = [];
  var divs = String(html || "").match(/<div class="dplayer"([^>]*)>/gi) || [];
  for (var i = 0; i < divs.length; i++) {
    var attrs = divs[i];
    var cm = attrs.match(/data-config='([^']*)'/i) || attrs.match(/data-config="([^"]*)"/i);
    var url = "";
    if (cm) {
      var cfgText = cm[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      try {
        var cfg = JSON.parse(cfgText);
        if (cfg && cfg.video && cfg.video.url) url = cfg.video.url;
      } catch (e) {}
      if (!url) {
        var um = cfgText.match(/"url"\s*:\s*"([^"]+\.m3u8[^"]*)"/i);
        if (um) url = um[1].replace(/\\\//g, "/");
      }
    }
    if (!url) continue;
    url = url.replace(/\\\//g, "/").replace(/\\u0026/g, "&");
    var tm = attrs.match(/data-video_title="([^"]*)"/i);
    eps.push({ name: tm ? cleanText(tm[1]) : "", url: url });
  }
  return eps;
}

// 探针 (照搬猫源 probeEps 的意图, 按 REX 单地址收敛):
// 只探将要出线的第 1 段 m3u8; 体长 0 时重取一次详情拿新 token 再探一次;
// 两次都 0 则返回空串, 调用方如实返回失败兜底。mp4 绝不探。
async function probeFirstUrl(firstUrl, articleUrl) {
  if (!/\.m3u8/i.test(firstUrl)) return firstUrl;
  try {
    var body = await getText(firstUrl);
    if (body.length > 0) return firstUrl;
  } catch (e) {}
  try {
    var html2 = await getText(articleUrl);
    if (!html2) return "";
    var eps2 = extractEps(html2);
    if (!eps2.length || !/\.m3u8/i.test(eps2[0].url)) return "";
    var body2 = await getText(eps2[0].url);
    if (body2.length > 0) return eps2[0].url;
  } catch (e) {}
  return "";
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
    var name = title || "91吃瓜";
    var eps = extractEps(html);
    var pic = "";
    var pm = html.match(/<meta itemprop="image" content="([^"]+)"/i)
      || html.match(/loadBannerDirect\('([^']+)'/i);
    if (pm) pic = proxyPic(pm[1]);
    if (!eps.length) {
      return { id: url, type: "url", title: name, description: "未找到播放地址" };
    }
    var good = await probeFirstUrl(eps[0].url, url);
    if (!good) {
      return { id: url, type: "url", title: name, description: "未找到播放地址" };
    }
    var videoUrl = /\.m3u8/i.test(good) ? RELAY_M3U8 + encodeURIComponent(good) : good;
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
