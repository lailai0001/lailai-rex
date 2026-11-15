// 八卦 for REX (lai_bagua v1.0.6)
// v1.0.6（2026-11-16）：根因——① 取数纯直连（与 mrds 同站 mrds66.com，站方走
//   CloudFront、按出口/IP 指纹拦手机直连，猫源 mrds.js 2026-11-11 夜修已坐实）；
//   修法：照搬猫源并行竞速——mrds-fetch Worker 腿（已实测首页 200/260KB/1.6s、
//   分类 200/227KB/1.3s、详情 200/181KB/1.6s）与直连腿同时跑，谁先拿到真页用谁。
//   ② loadDetail/loadResource 未 unwrap 对象入参（REX 运行时传卡片对象，
//   String(对象) 得 "[object Object]"，详情必失败——harness 复现）。
//   ③ proxyCover 把非 pic 图一律送 bagua 代理（其白名单仅 jtzatly/drleao，
//   其余一律 400）；改：只把白名单加密图床送 bagua，其余非 pic 图直连。
//   ④ 去掉 Accept-Language（javass 教训：tnmr WAF 对它敏感，猫源同款不带它）。
//   ⑤ parseList 放宽 article 匹配（不再要求 itemtype=BlogPosting，与 mrds 同款）。
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
// v1.0.5 (2026-11-15): 根因——1.0.4 的集仍是懒解析（episodeItem 无 videoUrl），
//   点播要调 loadResource 重抓详情页；手机侧抓 mrds66.com 失败就回 []、播不了
//   （harness 复现：episodeItems[0].videoUrl 为空，顶层 videoUrl 虽有但
//   playerType 是 "app"）。修法：详情直接把中转地址写进 episodeItem 的
//   videoUrl（playerType "system"），点播即播不再二次解析；顶层 playerType
//   同改 "system"；loadResource 只作回落（直链原样回行、重抓失败时用集上
//   的 videoUrl 兜底、永不抛错）。
// v1.0.4 (2026-11-14): 根因——loadDetail 只回 videoUrl, 没有 episodes/seasons/
// episodeItems, 详情页渲染不出可点播放入口, 用户看是"加载不出内容"; 且
// 顶层 videoUrl 的 auth_key 有时效, 详情打开久了再点会过期。修法: 详情补全
// episodes + seasons + episodeItems(懒解析, 点播时 loadResource 重新抓页取
// 新地址); 播放行 playerType 由 "app" 改 "system"(直解 m3u8 的行一律 system,
//  sextb/24jav/javhey 已确认); 保留中转行 + 直连行两档。

WidgetMetadata = {
  id: "lai_bagua",
  title: "八卦",
  description: "八卦（mrds66.com）：每日大赛/热搜吃瓜/网红黑料等 21 个分类，详情页直解 dplayer 播放地址、清单走 javsb-relay 中转",
  author: "lai",
  version: "1.0.6",
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
    { title: "AI剧场", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "aijc" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    {
      id: "loadResource",
      title: "八卦播放源",
      description: "播放时重新抓取详情页取新鲜播放地址",
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

var BASE = "https://www.mrds66.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var IMG_PROXY = "https://bagua-img-proxy.li768435813.workers.dev/img?url=";
var IMG_PROXY_51 = "https://51chigua.li768435813.workers.dev/img?url=";
// 流中转 V2 (与猫源 detail 一致, 通用 HTTP 服务, REX 内 Widget.http 同样可用)。
var RELAY_M3U8 = "https://javsb-relay.li768435813.workers.dev/m3u8?u=";
// 取页 Worker（与猫源 mrds.js 同款，已部署、已实测可用）：只取 HTML，不碰视频流。
var FETCH_WORKER = "https://mrds-fetch.li768435813.workers.dev";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Referer": BASE + "/"
  };
}

function isChallenge(html) {
  var s = String(html || "");
  if (/<title[^>]*>\s*Just a moment/i.test(s)) return true;
  if (/verify you are human/i.test(s.slice(0, 800))) return true;
  return false;
}

async function fetchOnce(url, timeout) {
  try {
    var res = await Widget.http.get(url, { headers: pageHeaders(), timeout: timeout || 10000 });
    return res && res.data != null ? String(res.data) : "";
  } catch (e) {
    return "";
  }
}

// 真页判定（猫源 mrds.js 同款）：够大 + 无质询串 + 含 <article> 或 data-config。
function looksReal(html) {
  var s = String(html || "");
  if (!s || s.length < 2000) return false;
  if (/Just a moment|Attention Required|Access Denied|cf-challenge|challenges\.cloudflare\.com/i.test(s)) return false;
  return /<article\b/i.test(s) || /data-config=/.test(s);
}

// 取页：并行竞速（猫源 mrds.js 同款，javrate v10 模式）——Worker 腿与直连腿同时跑，
// 谁先拿到真页用谁；直连在手机上被拦时是挂满超时而非快速失败，串行先直连会烧完预算。
async function fetchText(url) {
  var workerUrl = FETCH_WORKER + "/f/?u=" + encodeURIComponent(url);
  var html = await new Promise(function (resolve) {
    var done = false;
    var pending = 2;
    var fallback = "";
    function finish(h) {
      if (done) return;
      if (looksReal(h)) { done = true; resolve(h); return; }
      if (h) fallback = h;
      if (--pending === 0) { done = true; resolve(fallback); }
    }
    fetchOnce(workerUrl, 8000).then(finish, function () { finish(""); });
    fetchOnce(url, 5000).then(finish, function () { finish(""); });
  });
  if (!html) throw new Error("空回应");
  if (isChallenge(html)) throw new Error("被 Cloudflare 拦截，请稍后重试");
  return html;
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

// 封面按域路由：已知加密图床（jtzatly/drleao）走 bagua 解密，pic.*.cn 走
// 51chigua 解密；其余（站内图、明文图）直接回原地址——bagua 代理白名单外一律 400。
function proxyCover(url) {
  url = t(url);
  if (!url) return "";
  if (url.indexOf("data:") === 0) return url;
  if (url.indexOf("bagua-img-proxy") >= 0) return url;
  if (url.indexOf("51chigua") >= 0) return url;
  var abs = absUrl(url);
  var host = "";
  try { host = abs.split("/")[2] || ""; } catch (e) {}
  if (/^pic\.(jtzatly|drleao)\.cn$/i.test(host)) return IMG_PROXY + encodeURIComponent(abs);
  if (/^pic\.[^/]*\.cn$/i.test(host)) return IMG_PROXY_51 + encodeURIComponent(abs);
  return abs;
}

function parseList(html) {
  var items = [];
  var seen = {};
  if (!html) return items;
  var articleRe = /<article\b[^>]*>[\s\S]*?<\/article>/gi;
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
    if (!poster) {
      // 兜底：块内 img（data-src 优先），同样走按域路由
      var im = block.match(/<img[^>]*(?:data-src|src)\s*=\s*"([^"]+)"/i);
      if (im && /^https?:\/\//i.test(im[1]) && !/data:image/i.test(im[1])) poster = im[1];
    }
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

function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

async function loadDetail(link) {
  try {
    var url = unwrapLink(link);
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
    // v1.0.4: 集列表用懒解析(只带 link, 不带 videoUrl)——点播时 loadResource
    // 重新抓页, 拿新鲜 auth_key; 播放行一律 playerType "system"。
    var epItem = {
      id: url,
      type: "url",
      title: "正片",
      mediaType: "movie",
      posterPath: cover,
      link: url,
      episode: 1,
      episodeNumber: 1,
      seasonIndex: 1,
      seasonNumber: 1,
      playerType: "system",
      videoUrl: playUrl,
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE + "/"
      }
    };
    return {
      id: url,
      type: "detail",
      title: name,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: playUrl,
      playerType: "system",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE + "/"
      },
      episodes: [{ name: "正片", link: url }],
      seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: [{ title: "正片", episodeNumber: 1 }] }],
      episodeItems: [epItem],
      childItems: [epItem]
    };
  } catch (e) {
    // 取页失败也留一个懒"正片"入口（无 videoUrl 键），点播时 loadResource 重试
    var u2 = unwrapLink(link);
    if (!/^https?:\/\//i.test(u2)) u2 = absUrl(u2);
    if (u2) {
      var lazyEp2 = {
        id: u2, type: "url", title: "正片", mediaType: "movie",
        posterPath: "", link: u2, episode: 1, episodeNumber: 1,
        seasonIndex: 1, seasonNumber: 1, playerType: "system"
      };
      return {
        id: u2, type: "detail", title: "八卦", link: u2,
        posterPath: "", coverUrl: "", backdropPath: "",
        description: "请求错误：" + String((e && e.message) || e),
        episodes: [{ name: "正片", link: u2 }],
        seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: [{ title: "正片", episodeNumber: 1 }] }],
        episodeItems: [lazyEp2], childItems: [lazyEp2]
      };
    }
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// 播放源解析(stream 模块): 点播时重新抓详情页, 取新鲜播放地址(旧地址的
// auth_key 会过期)。中转行在前(清单域名设备侧被拦时走 Worker), 直连行兜底。
async function loadResource(params) {
  params = params || {};
  var raw = unwrapLink(params);
  if (!raw && typeof params === "object") raw = unwrapLink(params.link) || unwrapLink(params.url) || unwrapLink(params.id) || unwrapLink(params.item);
  if (!raw && params.item) raw = params.item.link || params.item.id || "";
  // App 把集 videoUrl 当 link 传时（或集对象带 videoUrl）：直链原样回行，不重抓
  var itemUrl = "";
  if (params.item && typeof params.item === "object") itemUrl = String(params.item.videoUrl || "");
  if (!itemUrl && params.videoUrl) itemUrl = String(params.videoUrl);
  try {
    var url = String(raw || "");
    if (/\.m3u8/i.test(url) || /\.mp4/i.test(url)) {
      return [{ name: "播放", url: url, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": BASE + "/" } }];
    }
    if (!/^https?:\/\//i.test(url)) url = absUrl(url);
    if (!url) return [];
    var html = await fetchText(url);
    var videoUrl = extractVideoUrl(html);
    if (!videoUrl) return [];
    var direct = absUrl(videoUrl);
    if (/\.m3u8/i.test(direct)) {
      return [
        { name: "中转", url: RELAY_M3U8 + encodeURIComponent(direct), playerType: "system", customHeaders: { "User-Agent": UA } },
        { name: "直连", url: direct, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": BASE + "/" } }
      ];
    }
    return [{ name: "播放", url: direct, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": BASE + "/" } }];
  } catch (e) {
    if (itemUrl) {
      return [{ name: "播放", url: itemUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": BASE + "/" } }];
    }
    return [];
  }
}
