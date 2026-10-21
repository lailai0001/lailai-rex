// porn吃瓜网 for REX (lai_porncgw v1.0.0)
// 移植自 mira-cat 蜘蛛 porncgw.js，后端：https://porncgw.com（SSR 站）。
// 列表为 SSR 卡片 (article.card + a.card-link + img data-src)，与蜘蛛同一套正则解析；
// 详情页 SSR JSON 内嵌已签名 videoSrc (yd-hls.hzjvlo.cn 的 m3u8)，loadDetail 抓一次详情页直出；
// 短剧 /drama/{id}/ 为简介+分集列表（loadDetail 返回 episodes），分集页 /drama/{id}/{n}/ 同样内嵌 videoSrc，
// 另提供 loadResource (stream) 按集解析，与包内短剧模块同一套路；
// 封面 pic.drleao.cn 为 AES-128-CBC 加密图，与蜘蛛一致统一走 bagua-img-proxy Worker 解密出图。

WidgetMetadata = {
  id: "lai_porncgw",
  title: "porn吃瓜网",
  description: "porn吃瓜网（porncgw.com）：短视频/长视频/今日吃瓜/榜单/网红黑料等 21 个分类与短剧，详情页直出已签名 m3u8",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://porncgw.com",
  detailCacheDuration: 180,
  modules: [
    { title: "最新更新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "短视频", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "list" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "长视频", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "long-video" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "今日吃瓜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "today" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "推荐吃瓜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "recommend" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "吃瓜榜单", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "hot-cgbd" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "网红黑料", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "hot-whhl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "熟女少妇", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "hot-snsf" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "学生校园", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "hot-xsxy" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "出轨偷情", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ent-cgtq" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "自拍流出", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ent-zplc" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "酒店", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "door-jiudian" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "车震", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "door-chezhen" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "娱乐八卦", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "shrd-ylbg" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "网友爆料", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "shrd-wybl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "女同系列", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ntxl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "欧美系列", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "omxl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "剧情演绎", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "jqyy" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "亚洲传媒", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "yzcm" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "AI短剧", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ai-aidj" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "AI漫剧", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ai-aimj" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    {
      id: "loadResource",
      title: "吃瓜播放源",
      description: "播放时实时解析播放地址",
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

var BASE = "https://porncgw.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var IMG_PROXY = "https://bagua-img-proxy.li768435813.workers.dev/img?url=";

// 站内导航 21 个分类（与蜘蛛 CATS 逐一一致）；最新更新=首页，站方无服务端分页，只出第一页
var CATS = [
  { type_id: "latest", type_name: "最新更新", path: "/" },
  { type_id: "list", type_name: "短视频", path: "/list/" },
  { type_id: "long-video", type_name: "长视频", path: "/long-video/" },
  { type_id: "today", type_name: "今日吃瓜", path: "/today/" },
  { type_id: "recommend", type_name: "推荐吃瓜", path: "/recommend/" },
  { type_id: "hot-cgbd", type_name: "吃瓜榜单", path: "/hot/cgbd/" },
  { type_id: "hot-whhl", type_name: "网红黑料", path: "/hot/whhl/" },
  { type_id: "hot-snsf", type_name: "熟女少妇", path: "/hot/snsf/" },
  { type_id: "hot-xsxy", type_name: "学生校园", path: "/hot/xsxy/" },
  { type_id: "ent-cgtq", type_name: "出轨偷情", path: "/entertainment/cgtq/" },
  { type_id: "ent-zplc", type_name: "自拍流出", path: "/entertainment/zplc/" },
  { type_id: "door-jiudian", type_name: "酒店", path: "/door/jiudian/" },
  { type_id: "door-chezhen", type_name: "车震", path: "/door/chezhen/" },
  { type_id: "shrd-ylbg", type_name: "娱乐八卦", path: "/shrd/ylbg/" },
  { type_id: "shrd-wybl", type_name: "网友爆料", path: "/shrd/wybl/" },
  { type_id: "ntxl", type_name: "女同系列", path: "/ntxl/" },
  { type_id: "omxl", type_name: "欧美系列", path: "/omxl/" },
  { type_id: "jqyy", type_name: "剧情演绎", path: "/jqyy/" },
  { type_id: "yzcm", type_name: "亚洲传媒", path: "/yzcm/" },
  { type_id: "ai-aidj", type_name: "AI短剧", path: "/ai/aidj/" },
  { type_id: "ai-aimj", type_name: "AI漫剧", path: "/ai/AImj/" }
];

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  return t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": referer || BASE + "/"
  };
}

function playHeaders() {
  return { "User-Agent": UA, "Referer": BASE + "/" };
}

// 取页面：返回 { html, finalUrl }（搜索 301 跳 tag 页时尽量读最终地址）
async function fetchPage(url, referer) {
  try {
    var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
    var html = res && res.data != null ? String(res.data) : "";
    var finalUrl = url;
    try {
      var fu = (res && (res.url || res.finalUrl || res.requestUrl)) || "";
      if (fu && /^https?:\/\//i.test(fu)) finalUrl = fu;
    } catch (_) {}
    return { html: html, finalUrl: finalUrl };
  } catch (e) {
    return { html: "", finalUrl: url };
  }
}

async function fetchText(url, referer) {
  var r = await fetchPage(url, referer);
  return r.html;
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return BASE + u;
  return BASE + "/" + u;
}

// 封面统一走 Worker 解密（pic.drleao.cn 加密图）
function proxyCover(imgUrl) {
  imgUrl = absUrl(decodeHtml(imgUrl));
  if (!imgUrl) return "";
  if (imgUrl.indexOf("bagua-img-proxy") >= 0) return imgUrl;
  return IMG_PROXY + encodeURIComponent(imgUrl);
}

// og:image 在 expose.eisees.com（返回 0 字节不可用）：同路径换到 pic.drleao.cn 再走 Worker
function fallbackCover(ogImage) {
  var u = absUrl(decodeHtml(ogImage));
  if (!u) return "";
  var m = u.match(/^https?:\/\/([^/]+)(\/.*)$/i);
  if (m && /eisees\.com$/i.test(m[1])) {
    return proxyCover("https://pic.drleao.cn" + m[2]);
  }
  return proxyCover(u);
}

// 解析列表卡片（与蜘蛛 parseCards 同一套正则）
function parseCards(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<article[^>]*class="card video-card"[^>]*>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var tag = m[0];
    var end = html.indexOf("</article>", m.index);
    var body = end > m.index ? html.slice(m.index, end) : html.slice(m.index, m.index + 3000);
    var hrefM = body.match(/<a[^>]*class="card-link"[^>]*href="([^"]+)"/i) || body.match(/href="(\/(?:video|drama)\/\d+\/)"/i);
    if (!hrefM) continue;
    var path = hrefM[1];
    if (seen[path]) continue;
    var imgM = body.match(/<img[^>]*data-src="([^"]+)"/i);
    if (!imgM) continue;
    seen[path] = true;
    var titleM = tag.match(/data-title="([^"]*)"/);
    var timeM = tag.match(/data-time="([^"]*)"/);
    var viewsM = tag.match(/data-views="([^"]*)"/);
    var name = titleM ? decodeHtml(titleM[1]) : "";
    if (!name) {
      var altM = body.match(/<img[^>]*alt="([^"]+)"/i);
      if (altM) name = decodeHtml(altM[1]).replace(/视频封面$/, "");
    }
    var time = timeM ? t(timeM[1]) : "";
    var views = viewsM ? t(viewsM[1]) : "";
    var remarks = time || (views && views !== "0" ? views + "播放" : "");
    var link = BASE + path;
    var img = proxyCover(imgM[1]);
    out.push({
      id: link,
      type: "url",
      title: name || path,
      posterPath: img,
      coverUrl: img,
      backdropPath: img,
      link: link,
      description: remarks,
      mediaType: "movie"
    });
  }
  return out;
}

function catOf(tid) {
  for (var i = 0; i < CATS.length; i++) {
    if (CATS[i].type_id === tid) return CATS[i];
  }
  return CATS[0];
}

function catUrl(cat, page) {
  if (cat.type_id === "latest" || page <= 1) return BASE + cat.path;
  return BASE + cat.path + page + "/";
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var tid = String(params.path || params.cat || "latest");
  var cat = catOf(tid);
  try {
    var html = await fetchText(catUrl(cat, page));
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
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

// 搜索 301 跳 /tag/{slug}/：模块级缓存跳转后的 tag 路径，翻页直接拼
var searchBaseCache = {};

async function search(params) {
  params = params || {};
  var wd = pickKeyword(params);
  var page = parseInt(params.page, 10) || 1;
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  try {
    var cached = searchBaseCache[wd];
    if (page > 1 && cached) {
      var h2 = await fetchText(BASE + cached + page + "/");
      var l2 = parseCards(h2);
      return l2.length ? l2 : [{ id: "empty", type: "url", title: "没有更多结果" }];
    }
    var r = await fetchPage(BASE + "/search/" + encodeURIComponent(wd) + "/");
    var html = r.html;
    var list = parseCards(html);
    // 记录跳转后的 tag 路径（含从分页链接反推）
    var base = "";
    try {
      var p = r.finalUrl.replace(/^https?:\/\/[^/]+/i, "");
      if (/^\/tag\/[^/]+\/$/.test(p)) base = p;
    } catch (e) { /* ignore */ }
    if (!base) {
      var pm = html.match(/href="(\/tag\/[^/]+\/)\d+\/"/);
      if (pm) base = pm[1];
    }
    if (base) searchBaseCache[wd] = base;
    if (page > 1 && base) {
      var h3 = await fetchText(BASE + base + page + "/");
      var l3 = parseCards(h3);
      return l3.length ? l3 : [{ id: "empty", type: "url", title: "没有更多结果" }];
    }
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

// 取详情页 SSR JSON 里的字符串字段（处理 \uXXXX 等转义，与蜘蛛 jsonStr 一致）
function jsonStr(html, key) {
  var m = String(html || "").match(new RegExp('"' + key + '"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"'));
  if (!m) return "";
  return m[1]
    .replace(/\\u([0-9a-fA-F]{4})/g, function (_, h) { return String.fromCharCode(parseInt(h, 16)); })
    .replace(/\\\//g, "/")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function ogContent(html, prop) {
  var s = String(html || "");
  var m = s.match(new RegExp('property="' + prop + '"[^>]*content="([^"]*)"', "i"))
    || s.match(new RegExp('content="([^"]*)"[^>]*property="' + prop + '"', "i"));
  return m ? decodeHtml(m[1]) : "";
}

// 详情封面：优先页面 JSON 的 posterSrc，缺失时用 og:image 同路径换 pic.drleao.cn
function detailCover(html) {
  var poster = jsonStr(html, "posterSrc");
  if (poster) return proxyCover(poster);
  var og = ogContent(html, "og:image");
  if (og) return fallbackCover(og);
  return "";
}

function cleanName(raw, fallback) {
  var name = decodeHtml(raw || "").replace(/\s*-\s*porn吃瓜网\s*$/, "").trim();
  return name || fallback || "";
}

// 把卡片 link / 任意输入归一成站内路径
function pathOf(link) {
  var s = String(link || "").trim();
  s = s.replace(/^https?:\/\/[^/]+/i, "");
  var m = s.match(/\/(video|drama)\/\d+(?:\/\d+)?\//);
  return m ? m[0] : s;
}

// 抓一页并取 videoSrc（已签名 m3u8）
async function resolveVideoSrc(pageUrl) {
  var html = await fetchText(pageUrl, BASE + "/");
  if (!html) return "";
  return jsonStr(html, "videoSrc") || jsonStr(html, "videoSrcHevc");
}

async function loadDetail(link) {
  try {
    var path = pathOf(link);
    // 分集页：直接当可播详情
    var epM = path.match(/^\/drama\/(\d+)\/(\d+)\/$/);
    if (epM) {
      var epUrl = BASE + path;
      var epHtml = await fetchText(epUrl, BASE + "/");
      var epSrc = epHtml ? (jsonStr(epHtml, "videoSrc") || jsonStr(epHtml, "videoSrcHevc")) : "";
      var epTitle = epHtml ? cleanName(jsonStr(epHtml, "title") || ogContent(epHtml, "og:title"), path) : path;
      var epCover = epHtml ? detailCover(epHtml) : "";
      if (!epSrc) {
        return { id: epUrl, type: "url", title: epTitle || "解析失败", description: "未找到播放地址", link: epUrl };
      }
      return {
        id: epUrl,
        type: "detail",
        title: epTitle,
        link: epUrl,
        posterPath: epCover,
        coverUrl: epCover,
        backdropPath: epCover,
        videoUrl: epSrc,
        playerType: "app",
        customHeaders: playHeaders()
      };
    }
    if (!/^\/(video|drama)\/\d+\/$/.test(path)) {
      return { id: String(link || "err"), type: "url", title: "参数错误", description: "无法识别的链接", link: String(link || "") };
    }
    var pageUrl = BASE + path;
    var html = await fetchText(pageUrl);
    if (!html) {
      return { id: pageUrl, type: "url", title: "加载失败", description: "详情页拉取失败", link: pageUrl };
    }
    var name = cleanName(jsonStr(html, "title") || ogContent(html, "og:title"), path);
    var content = ogContent(html, "og:description");
    var pic = detailCover(html);

    if (path.indexOf("/drama/") === 0) {
      var did = path.match(/\/drama\/(\d+)\//)[1];
      var nums = {};
      var re = new RegExp('href="/drama/' + did + '/(\\d+)/"', "g");
      var m;
      while ((m = re.exec(html)) !== null) nums[parseInt(m[1], 10)] = true;
      var eps = Object.keys(nums).map(function (x) { return parseInt(x, 10); }).sort(function (a, b) { return a - b; });
      if (!eps.length) eps = [1];
      var episodes = eps.map(function (n) {
        var epPath = "/drama/" + did + "/" + n + "/";
        return { name: "第" + n + "集", id: epPath, link: BASE + epPath };
      });
      return {
        id: pageUrl,
        type: "url",
        title: name,
        link: pageUrl,
        posterPath: pic,
        coverUrl: pic,
        backdropPath: pic,
        description: content,
        episodes: episodes
      };
    }

    // 普通视频：详情页当场解 videoSrc
    var src = jsonStr(html, "videoSrc") || jsonStr(html, "videoSrcHevc");
    if (!src || !/^https?:\/\//i.test(src)) {
      return { id: pageUrl, type: "url", title: name || "解析失败", description: "未找到播放地址", link: pageUrl, posterPath: pic, coverUrl: pic, backdropPath: pic };
    }
    return {
      id: pageUrl,
      type: "detail",
      title: name,
      link: pageUrl,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: content,
      videoUrl: src,
      playerType: "app",
      customHeaders: playHeaders()
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// 播放源解析（stream 模块）：
// - 传入视频页/分集页链接时，只解析该页
// - 传入短剧主页链接时，逐集解析成资源列表；连续 3 集拿不到地址就停
async function loadResource(params) {
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  var path = pathOf(raw);
  try {
    var dm = path.match(/^\/drama\/(\d+)\/$/);
    if (dm) {
      var mainHtml = await fetchText(BASE + path);
      if (!mainHtml) return [];
      var did = dm[1];
      var nums = {};
      var re = new RegExp('href="/drama/' + did + '/(\\d+)/"', "g");
      var m;
      while ((m = re.exec(mainHtml)) !== null) nums[parseInt(m[1], 10)] = true;
      var eps = Object.keys(nums).map(function (x) { return parseInt(x, 10); }).sort(function (a, b) { return a - b; });
      if (!eps.length) eps = [1];
      var out = [];
      var misses = 0;
      for (var i = 0; i < eps.length; i++) {
        var src = await resolveVideoSrc(BASE + "/drama/" + did + "/" + eps[i] + "/");
        if (!src) {
          misses++;
          if (misses >= 3) break;
          continue;
        }
        misses = 0;
        out.push({ name: "第" + eps[i] + "集", url: src, playerType: "app", customHeaders: playHeaders() });
      }
      return out;
    }
    if (/^\/(video|drama)\/\d+(?:\/\d+)?\/$/.test(path)) {
      var one = await resolveVideoSrc(BASE + path);
      if (!one) return [];
      return [{ name: "播放", url: one, playerType: "app", customHeaders: playHeaders() }];
    }
    return [];
  } catch (e) {
    return [];
  }
}
