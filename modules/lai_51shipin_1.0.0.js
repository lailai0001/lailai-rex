// 51视频 for REX (lai_51shipin v1.0.0)
// 移植自 mira-cat 蜘蛛 51shipin.js (key py_51shipin), 内容站走 51sptv.com 等同构域,
// 落地页 dcddazel.cc 只是线路页, 不作 HOST。
// 列表: <article> 块 (链接 + h2 标题 + z-image-loader-url 封面), 与蜘蛛同一套解析;
// 详情: 按 data-config 顺序取 video.url, 一篇可含多段, REX 单地址只放第 1 段;
// 播放: 单一最优地址 = 流中转 V2 中转集 (javsb-relay /m3u8?u= 形态, 原样照搬猫源 detail 的构造方式)。
// 封面: pic.*.cn 图床为加密密文存储, 走已部署的 51chigua 解密代理出图 (蜘蛛写死地址, 原样沿用)。

WidgetMetadata = {
  id: "lai_51shipin",
  title: "51视频",
  description: "51视频：今日推荐/每日大赛/吃瓜爆料等 19 个分类，详情页直解 dplayer 播放地址并走流中转",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://51sptv.com/",
  detailCacheDuration: 180,
  modules: [
    { title: "最新更新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "今日推荐", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "wpcz" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "撸片精品", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "lpjp" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "每日大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "meiridasai" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "吃瓜爆料", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "rdsj" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "AI短剧", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "aisj" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "PMV混剪", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "pmv" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "51原创", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "51yc" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "体育男大", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tynd" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "学生校园", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "xsxy" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "伦理精选", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "lljx" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "色漫天堂", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "smtt" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "网红黑料", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "whhl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "看片娱乐", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ysyl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "超前点播", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "cqdb" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "奇趣百科", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "qubk" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "短剧影视", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "dyds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "网黄合集", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "whhj" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "明星黑料", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "mxhl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "精品AV", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "jpav" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
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

var HOSTS = [
  "https://51sptv.com/",
  "https://ds0iykn0hitas.cloudfront.net/",
  "https://apple.punwbiin.cc/"
];
var ACTIVE_HOST = "";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var IMG_PROXY = "https://51chigua.li768435813.workers.dev/img?url=";
var RELAY_M3U8 = "https://javsb-relay-production.up.railway.app/m3u8?u=";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function pageHeaders(host) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": host
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

async function getText(url, host) {
  var res = await Widget.http.get(url, { headers: pageHeaders(host) });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

async function pickHost() {
  if (ACTIVE_HOST) return ACTIVE_HOST;
  for (var i = 0; i < HOSTS.length; i++) {
    try {
      var html = await getText(HOSTS[i], HOSTS[i]);
      if (html && html.indexOf("/archives/") >= 0) { ACTIVE_HOST = HOSTS[i]; return ACTIVE_HOST; }
    } catch (e) {}
  }
  ACTIVE_HOST = HOSTS[0];
  return ACTIVE_HOST;
}

function absUrl(href, host) {
  href = t(href);
  if (!href) return "";
  if (/^https?:\/\//i.test(href)) return href;
  if (href.charAt(0) === "/") return host.replace(/\/$/, "") + href;
  return host.replace(/\/$/, "") + "/" + href;
}

function proxyCover(url) {
  url = t(url);
  if (!url) return "";
  if (url.indexOf("51chigua.li768435813.workers.dev") >= 0) return url;
  if (/pic\.[a-z0-9]+\.cn/i.test(url)) return IMG_PROXY + encodeURIComponent(url);
  return url;
}

function imgOf(block) {
  var clean = block.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  var m = clean.match(/z-image-loader-url\s*=\s*"([^"]+)"/i);
  if (m && /^https?:\/\//i.test(m[1])) return m[1];
  var tags = clean.match(/<img[^>]*>/gi) || [];
  for (var i = 0; i < tags.length; i++) {
    var sm = tags[i].match(/(?:data-src|data-original|src)\s*=\s*"([^"]+)"/i);
    if (sm && /^https?:\/\//i.test(sm[1]) && !/data:image/i.test(sm[1])) return sm[1];
  }
  m = clean.match(/background-image\s*:\s*url\(\s*['"]?(https?:[^'")]+)['"]?\s*\)/i);
  if (m) return m[1];
  m = clean.match(/https?:\/\/[^"'\s)]+\.(?:jpg|png|jpeg|webp)/i);
  if (m) return m[0];
  return "";
}

function parseArticles(html, host) {
  var items = [];
  var seen = {};
  function push(href, title, pic, remarks) {
    if (!href || !title || seen[href]) return;
    seen[href] = 1;
    items.push({ id: href, type: "url", title: title, posterPath: pic, coverUrl: pic, backdropPath: pic, link: href, description: remarks || "", mediaType: "movie" });
  }
  var re = /<article[\s\S]{0,8000}?<\/article>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var blk = m[0];
    var links = [];
    var lm = blk.match(/<a[^>]*href="([^"]+)"[^>]*>/gi) || [];
    for (var i = 0; i < lm.length; i++) {
      var hm2 = lm[i].match(/href="([^"]+)"/i);
      if (hm2) links.push(hm2[1]);
    }
    var href = "";
    for (var j = 0; j < links.length; j++) {
      if (links[j].indexOf("/archives/") >= 0) { href = links[j]; break; }
    }
    if (!href) continue;
    var url = absUrl(href, host);
    if (!url) continue;
    var hm = blk.match(/<h2[^>]*>([\s\S]{0,300}?)<\/h2>/i);
    var title = hm ? cleanText(hm[1]) : "";
    if (!title || title.length < 2) continue;
    var dm = blk.match(/(\d{4}\/\d{1,2}\/\d{1,2}|\d{4} 年 \d{1,2} 月 \d{1,2} 日)/);
    push(url, title, proxyCover(imgOf(blk)), dm ? dm[1] : "");
    if (items.length >= 60) break;
  }
  if (!items.length) {
    var are = /<a[^>]*href="([^"]*\/archives\/[^"]+\/?)"[^>]*>([\s\S]{0,400}?)<\/a>/gi;
    while ((m = are.exec(html)) !== null) {
      var url2 = absUrl(m[1], host);
      var title2 = cleanText(m[2]);
      if (!url2 || !title2 || title2.length < 2) continue;
      push(url2, title2, "", "");
      if (items.length >= 60) break;
    }
  }
  return items;
}

function listOrMsg(html, host, url) {
  if (!html) return [{ id: "empty", type: "url", title: "空页面" }];
  var list = parseArticles(html, host);
  return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
}

function listUrl(cat, page, host) {
  page = Math.max(1, parseInt(page, 10) || 1);
  cat = t(cat) || "latest";
  var base = host.replace(/\/$/, "");
  if (cat === "latest") {
    return page === 1 ? base + "/" : base + "/page/" + page + "/";
  }
  return page === 1 ? base + "/category/" + cat + "/" : base + "/category/" + cat + "/" + page + "/";
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var cat = String(params.path || params.cat || "latest");
  try {
    var host = await pickHost();
    var url = listUrl(cat, page, host);
    var html = await getText(url, host);
    return listOrMsg(html, host, url);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg }];
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
  try {
    var host = await pickHost();
    var base = host + "search/" + encodeURIComponent(wd);
    var url = page === 1 ? (base + "/") : (base + "/" + page + "/");
    var html = await getText(url, host);
    return listOrMsg(html, host, url);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

// 与蜘蛛 extractVideos 同口径: 按 data-config 顺序取 video.url; 兜底全文直链时跳过 /m3m/ 广告位。
function extractVideos(html) {
  var clean = String(html || "").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\\\//g, "/");
  var urls = [];
  var seen = {};
  var re = /data-config='([^']+)'/gi;
  var m;
  while ((m = re.exec(clean)) !== null) {
    try {
      var cfg = JSON.parse(m[1]);
      var vu = typeof cfg.video === "string" ? cfg.video : (cfg.video && cfg.video.url ? cfg.video.url : "");
      if (vu && /^https?:\/\//i.test(vu) && !seen[vu]) { seen[vu] = 1; urls.push(vu); }
    } catch (e) {}
  }
  if (!urls.length) {
    var all = clean.match(/https?:\/\/[^"'\s<>]+\.(?:m3u8|mp4)(?:\?[^"'\s<>]*)?/gi) || [];
    for (var i = 0; i < all.length; i++) {
      if (/\/m3m\//i.test(all[i])) continue;
      if (!seen[all[i]]) { seen[all[i]] = 1; urls.push(all[i]); }
    }
  }
  return urls;
}

async function loadDetail(link) {
  try {
    var host = await pickHost();
    var url = String(link || "");
    if (!/^https?:\/\//i.test(url)) url = absUrl(url, host);
    if (!url) {
      return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    }
    var html = await getText(url, host);
    var hm = html.match(/<h1[^>]*>([\s\S]{0,300}?)<\/h1>/i);
    var title = hm ? cleanText(hm[1]) : "";
    var ogm = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    var pic = ogm ? ogm[1] : "";
    var pm = html.match(/data-config='[^']*"poster":"([^"]+)"/i);
    if (pm) pic = pm[1].replace(/\\\//g, "/");
    var cover = proxyCover(pic);
    var name = title || "51视频";
    var urls = extractVideos(html);
    if (!urls.length) {
      return { id: url, type: "url", title: name, description: "未找到播放地址" };
    }
    // 猫源多段按段列出; REX 单地址只放第 1 段 (多段文章的后续段落暂不出线, 见遗留风险)。
    var vu = urls[0];
    var videoUrl = /\.m3u8/i.test(vu) ? RELAY_M3U8 + encodeURIComponent(vu) : vu;
    return {
      id: url,
      type: "detail",
      title: name,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": host
      }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
