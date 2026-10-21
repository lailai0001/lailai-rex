// JavGG for REX (lai_javgg v1.0.0)
// 移植自 mira-cat 蜘蛛 py_javgg（只读蓝图），后端 https://javgg.net
// （WordPress + DooPlay，无反爬；备用域名 javgg.co，.co 的 /tag/* 坏，分类已避开）。
// 列表: /new-post/、/trending/、/genre/{slug}/，字幕分类走搜索页 /?s=。
// 播放（在 loadDetail 内解析）: 详情页 data-post → dooplayer API 收集 server1~3 embed，
//   playmate 系 POST /api/s 直解、vidara 系 POST /api/stream 直解（竞速取高优先级）；
//   vidhide 系走已部署全链 Worker javgg-vidhide（token 按网络身份签发，必须铸/拉同出口）；
//   f4 系强制 Origin、REX 端内无解，与蜘蛛的嗅探兜底一样不在端内直出（解析不到如实报）。

WidgetMetadata = {
  id: "lai_javgg",
  title: "JavGG",
  description: "JavGG：最新/热门/英字幕/中字幕/无码/高清无码/减码/有码/4K/3P，播放优先直解高清线路，vidhide 走 Worker 全链",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://javgg.net",
  detailCacheDuration: 180,
  modules: [
    {
      title: "搜索",
      functionName: "search",
      cacheDuration: 60,
      params: [
        { name: "keyword", title: "关键词", type: "input", value: "" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "最新",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "latest" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "热门",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "trending" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "英字幕",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "english-subtitle" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "中字幕",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "chinese-subtitle" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "无码",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "uncensored" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "高清无码",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "hd-uncensored" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "减码",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "minimal-mosaic" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "有码",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "digital-mosaic" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "4K",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "genre-4k" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "3P",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "genre-3p" },
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

var SITE = "https://javgg.net";
var BACKUP_SITE = "https://javgg.co";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = SITE + "/";
// vidhide 全链代理 Worker（用户已部署，沿用蜘蛛写死地址）
var VIDHIDE_WORKER = "https://javgg-vidhide.li768435813.workers.dev";

// 10 个真实分类（与蜘蛛 CATS 一致，2026-10-20 蜘蛛实测）
// kind: 'path' 普通列表页翻页 /page/N/；'search' 搜索页翻页 &paged=N
var CATS = [
  { type_id: "latest", type_name: "最新", kind: "path", url: "/new-post/" },
  { type_id: "trending", type_name: "热门", kind: "path", url: "/trending/" },
  { type_id: "english-subtitle", type_name: "英字幕", kind: "search", kw: "english subtitle" },
  { type_id: "chinese-subtitle", type_name: "中字幕", kind: "search", kw: "chinese subtitle" },
  { type_id: "uncensored", type_name: "无码", kind: "path", url: "/genre/uncensored/" },
  { type_id: "hd-uncensored", type_name: "高清无码", kind: "path", url: "/genre/hd-uncensored/" },
  { type_id: "minimal-mosaic", type_name: "减码", kind: "path", url: "/genre/minimal-mosaic/" },
  { type_id: "digital-mosaic", type_name: "有码", kind: "path", url: "/genre/digital-mosaic/" },
  { type_id: "genre-4k", type_name: "4K", kind: "path", url: "/genre/4k/" },
  { type_id: "genre-3p", type_name: "3P", kind: "path", url: "/genre/3p/" }
];

function t(v) {
  return String(v == null ? "" : v).trim();
}

function clean(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "-")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
}

function fixUrl(u) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return SITE + u;
  return u;
}

function hostOf(u) {
  var m = String(u || "").match(/^https?:\/\/([^/]+)/i);
  return m ? m[1].toLowerCase() : "";
}

function originOf(u) {
  var m = String(u || "").match(/^(https?:\/\/[^/]+)/i);
  return m ? m[1] : "";
}

function codeOf(u) {
  var path = String(u || "").split("?")[0].split("#")[0];
  var parts = path.split("/").filter(function (x) { return x !== ""; });
  return parts.length ? parts[parts.length - 1] : "";
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": referer || REFERER
  };
}

// GET 文本：主域名失败自动切备用域名（与蜘蛛 getText 一致；minLen 过短视为失败）
async function fetchText(url, referer, minLen) {
  var need = minLen || 500;
  var candidates = [url];
  if (url.indexOf("javgg.net") >= 0) candidates.push(url.replace("javgg.net", "javgg.co"));
  for (var i = 0; i < candidates.length; i++) {
    try {
      var res = await Widget.http.get(candidates[i], { headers: pageHeaders(referer) });
      var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
      if (body && body.length >= need) return body;
    } catch (e) { /* 换下一个域名 */ }
  }
  return "";
}

// POST：Widget.http.post 带守卫（运行时若无 post 则返回空，直解线自动降级，
// vidhide Worker 线不受影响）。返回原始 res.data（字符串或对象）。
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

async function postJson(url, obj, headers) {
  var raw = await httpPostRaw(url, JSON.stringify(obj), {
    "User-Agent": UA,
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Referer": REFERER,
    ...(headers || {})
  });
  if (raw == null) return null;
  if (typeof raw === "object") return raw;
  try { return JSON.parse(String(raw)); } catch (e) { return null; }
}

function settleAll(promises) {
  return Promise.all(promises.map(function (p) {
    return Promise.resolve(p).then(function (v) { return v; }, function () { return null; });
  }));
}

// 列表卡片解析（与蜘蛛 parseCards 完全一致的两种结构）
// 结构1: article.item.movies；结构2: 搜索页 div.result-item
function parseCards(html) {
  var out = [];
  var seen = {};
  function push(durl, pic, name) {
    if (!durl || seen[durl]) return;
    seen[durl] = true;
    var cover = pic || "";
    out.push({
      id: durl,
      type: "url",
      title: name || durl,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: durl,
      description: "",
      mediaType: "movie"
    });
  }
  var m;
  var re1 = /<article[^>]*class="[^"]*item movies[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
  while ((m = re1.exec(html)) !== null) {
    var card = m[1];
    var linkM = card.match(/<a[^>]*href="(https?:\/\/javgg\.(net|co)\/jav\/[^"]+\/)"/);
    if (!linkM) continue;
    var imgM = card.match(/<img[^>]*data-src="([^"]+)"/) || card.match(/<img[^>]*src="([^"]+)"/);
    var titleM = card.match(/<div class="titlecontent">([\s\S]*?)<\/div>/);
    var codeM = card.match(/<h3><a[^>]*>([^<]+)<\/a><\/h3>/);
    push(linkM[1], imgM ? fixUrl(imgM[1]) : "", titleM ? clean(titleM[1]) : (codeM ? clean(codeM[1]) : ""));
  }
  var re2 = /<div class="result-item">([\s\S]*?)<\/article>/g;
  while ((m = re2.exec(html)) !== null) {
    var card2 = m[1];
    var linkM2 = card2.match(/<a[^>]*href="(https?:\/\/javgg\.(net|co)\/jav\/[^"]+\/)"/);
    if (!linkM2) continue;
    var imgM2 = card2.match(/<img[^>]*src="([^"]+)"/);
    var titleM2 = card2.match(/<div class="title">\s*<a[^>]*>([\s\S]*?)<\/a>/);
    push(linkM2[1], imgM2 ? fixUrl(imgM2[1]) : "", titleM2 ? clean(titleM2[1]) : "");
  }
  return out;
}

function catUrl(tid, page) {
  var cat = null;
  for (var i = 0; i < CATS.length; i++) if (CATS[i].type_id === tid) cat = CATS[i];
  if (!cat) cat = CATS[0];
  if (cat.kind === "search") {
    var base = SITE + "/?s=" + encodeURIComponent(cat.kw);
    if (page > 1) base += "&paged=" + page;
    return base;
  }
  var url = SITE + cat.url;
  if (page > 1) url += "page/" + page + "/";
  return url;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var tid = t(params.path || params.cat || "latest");
  try {
    var html = await fetchText(catUrl(tid, page), REFERER, 500);
    if (!html) return [{ id: "err", type: "url", title: "载入失败（站点无响应）" }];
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
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
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词搜索" }];
  var url = SITE + "/?s=" + encodeURIComponent(wd);
  if (page > 1) url += "&paged=" + page;
  try {
    var html = await fetchText(url, REFERER, 500);
    if (!html) return [{ id: "err", type: "url", title: "搜索失败（站点无响应）" }];
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

// ---- 播放解码（只有 playmate / vidara 两类在端内直解，与蜘蛛一致） ----

// vidara 系: POST {origin}/api/stream {filecode, device:'ios', codecs:['h265']} → streaming_url
async function tryVidara(embedUrl) {
  try {
    var origin = originOf(embedUrl);
    var code = codeOf(embedUrl);
    if (!origin || !code) return null;
    var resp = await postJson(origin + "/api/stream",
      { filecode: code, device: "ios", codecs: ["h265"] },
      { "Referer": embedUrl, "Origin": origin });
    var src = resp && t(resp.streaming_url || resp.src || resp.url);
    if (!src || !/^https?:\/\//.test(src)) return null;
    return { url: src, headers: { "User-Agent": UA, "Referer": embedUrl } };
  } catch (e) {
    return null;
  }
}

// playmate 系: POST {origin}/api/s {c:filecode, d:'web'} → sx (master)
async function tryPlaymate(embedUrl) {
  try {
    var origin = originOf(embedUrl);
    var code = codeOf(embedUrl);
    if (!origin || !code) return null;
    var resp = await postJson(origin + "/api/s", { c: code, d: "web" }, { "Referer": embedUrl });
    var src = resp && t(resp.sx || resp.src || resp.url);
    if (!src || !/^https?:\/\//.test(src)) return null;
    return { url: src, headers: { "User-Agent": UA, "Referer": embedUrl } };
  } catch (e) {
    return null;
  }
}

// 线路分类（与蜘蛛 classifyEmbed 一致）
function classifyEmbed(embedUrl) {
  var host = hostOf(embedUrl);
  if (!host) return null;
  if (host.indexOf("playmate") >= 0) return { embedUrl: embedUrl, prio: 1, kind: "playmate", decoder: tryPlaymate };
  if (host.indexOf("shadowbyte") >= 0 || host.indexOf("dstyladsg") >= 0 || host.indexOf("vidara") >= 0) return { embedUrl: embedUrl, prio: 2, kind: "vidara", decoder: tryVidara };
  if (host.indexOf("earnvidjavgg") >= 0 || host.indexOf("vidhide") >= 0 || host.indexOf("streamhg") >= 0) return { embedUrl: embedUrl, prio: 3, kind: "vidhide", decoder: null };
  if (host.indexOf("f4jav") >= 0 || host.indexOf("f4scdn") >= 0 || /\/e\/[A-Za-z0-9]+/.test(embedUrl)) return { embedUrl: embedUrl, prio: 4, kind: "f4", decoder: null };
  return { embedUrl: embedUrl, prio: 99, kind: "other", decoder: null };
}

// 并行收集 server1~3 的 embed（dooplayer API 是 GET）
async function collectEmbeds(postId) {
  var jobs = [1, 2, 3].map(function (srv) {
    return (async function () {
      try {
        var txt = await fetchText(SITE + "/wp-json/dooplayer/v2/" + postId + "/movie/" + srv, REFERER, 10);
        if (!txt) return null;
        var json = JSON.parse(txt);
        var embedUrl = t(json.embed_url);
        if (!embedUrl || !/^https?:\/\//.test(embedUrl)) return null;
        return classifyEmbed(embedUrl);
      } catch (e) { return null; }
    })();
  });
  var embeds = (await settleAll(jobs)).filter(function (x) { return !!x; });
  embeds.sort(function (a, b) { return a.prio - b.prio; });
  return embeds;
}

// 按优先级竞速：高优先级先出结果就用它；高优先级失败才轮到低优先级，
// 不必等全部完成（与蜘蛛 bestWithin 的语义一致，无计时器依赖）
async function raceByPriority(cands) {
  if (!cands.length) return null;
  var results = new Array(cands.length);
  var filled = new Array(cands.length).fill(false);
  return new Promise(function (resolve) {
    var done = false;
    function check() {
      if (done) return;
      for (var i = 0; i < cands.length; i++) {
        if (!filled[i]) return; // 更高优先级还没出结果，继续等
        if (results[i]) { done = true; resolve(results[i]); return; }
      }
      done = true; resolve(null);
    }
    cands.forEach(function (c, i) {
      Promise.resolve()
        .then(function () { return c.decoder(c.embedUrl); })
        .then(function (r) { results[i] = r || null; filled[i] = true; check(); },
              function () { results[i] = null; filled[i] = true; check(); });
    });
  });
}

async function loadDetail(link) {
  var durl = t(link);
  try {
    if (!/^https?:\/\//.test(durl)) durl = SITE + "/jav/" + durl.replace(/^\//, "") + "/";
    var html = await fetchText(durl, REFERER, 500);
    if (!html) {
      return { id: durl, type: "url", title: "载入失败", description: "详情页无响应" };
    }

    var name = "";
    var titleM = html.match(/<title>([^<]+)<\/title>/);
    if (titleM) name = clean(titleM[1]).replace(/\s*[-|]\s*JAVGG.*$/i, "").trim();
    if (!name) {
      var ogM = html.match(/<meta property="og:title" content="([^"]+)"/);
      if (ogM) name = clean(ogM[1]);
    }
    var pic = "";
    var picM = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (picM) pic = fixUrl(picM[1]);
    var desc = "";
    var descM = html.match(/<meta property="og:description" content="([^"]+)"/);
    if (descM) desc = clean(descM[1]);

    var postM = html.match(/data-post=['"](\d+)['"]/);
    var postId = postM ? postM[1] : "";
    if (!postId) {
      return { id: durl, type: "url", title: name || "解析失败", description: "未找到播放地址" };
    }

    var embeds = await collectEmbeds(postId);

    // 1) playmate/vidara 竞速直解（最高画质由源决定：playmate 720p 封顶、vidara 1080p）
    var cands = embeds.filter(function (e) { return !!e.decoder; });
    if (cands.length) {
      var res = await raceByPriority(cands);
      if (res && res.url) {
        return {
          id: durl,
          type: "detail",
          title: name || durl,
          link: durl,
          posterPath: pic,
          coverUrl: pic,
          backdropPath: pic,
          videoUrl: res.url,
          playerType: "app",
          customHeaders: res.headers || { "User-Agent": UA, "Referer": durl },
          description: desc
        };
      }
    }

    // 2) vidhide 系：走全链 Worker（铸 token/拉列表/拉分片同出口），
    //    Worker v3 的 /v 直接返回最高档媒体列表，播放器零自定义头要求
    var vh = null;
    for (var i = 0; i < embeds.length; i++) if (embeds[i].kind === "vidhide") { vh = embeds[i]; break; }
    if (vh) {
      return {
        id: durl,
        type: "detail",
        title: name || durl,
        link: durl,
        posterPath: pic,
        coverUrl: pic,
        backdropPath: pic,
        videoUrl: VIDHIDE_WORKER + "/v?u=" + encodeURIComponent(vh.embedUrl) + "&r=" + encodeURIComponent(durl),
        playerType: "app",
        customHeaders: { "User-Agent": UA, "Referer": durl },
        description: desc
      };
    }

    // 3) 只剩 f4/other 线：f4 强制 Origin、端内直出必挂（蜘蛛靠嗅探，REX 无嗅探通道），如实报
    return { id: durl, type: "url", title: name || "解析失败", description: "未找到播放地址（该片只有 f4 等需嗅探的线路）" };
  } catch (e) {
    return { id: durl || String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
