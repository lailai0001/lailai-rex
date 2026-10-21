// JAVSB for REX (lai_javsb v2.0.0) —— 2026-10-22 从零重写, 替换 v1.0.0。
// 后端: https://jav.sb (MacCMS/Madou 模板站)。
//
// v1 为什么在真机全灭 (根因): v1 把猫源蜘蛛的多中转竞速抓取栈原样搬到了
// 手机上执行 —— 直连 jav.sb 被其 Cloudflare 挡、r.jina.ai 域名在大陆网络
// 通常不可达、其余中转在手机端逐层超时叠加, 列表页根本取不到; 且 loadDetail
// 入参未做对象解包, App 传卡片对象时 String(对象) 成 "[object Object]",
// 详情连 URL 都拼不出来。
//
// v2 架构: 模块只跟自家 javsb-hls Worker (v2) 说话, 一切抓取在服务端完成:
//   列表/搜索/详情页 -> Worker /p (Worker 内 jina/allorigins/codetabs 竞速
//     取页, 边缘缓存); 封面 -> Worker /img; 播放 -> Worker /v (算签取 raw
//     列表, 与猫源第六轮定版同一条已验链: 先 seg=direct 轻量形态, 不通再
//     全链代理形态)。模块内不再有任何 jav.sb / 第三方中转的直接请求。
// 已知特性 (如实保留): /v 首播要等 Worker 内中转取列表 (可达 10~35s),
//   成品在 Worker 侧缓存 600s, 首播成功率约五成、靠重试与缓存兜底 ——
//   与猫源定版完全相同, 是站方中转通道的固有特性, 非模块逻辑问题。

WidgetMetadata = {
  id: "lai_javsb",
  title: "JAVSB",
  description: "JAVSB（jav.sb）：最近更新/有码/无码/FC2/无码破解/中文字幕等分类，数据与播放全走 javsb-hls Worker",
  author: "lai",
  version: "2.0.0",
  requiredVersion: "0.0.1",
  site: "https://jav.sb",
  detailCacheDuration: 180,
  modules: [
    { title: "最近更新", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "new" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "日本有码", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "Censored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "日本无码", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "Uncensored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "FC2-PPV", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "FC2-PPV" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码破解", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "Mosaic_Removed" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中文字幕", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "CHN_SUB" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "MGS", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "MGS" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "写真", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "Adult_IDOL" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "国产", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "Asian_Amateur" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "欧美", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "Western_Porn" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "热门影片", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "rank_hits" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "评分最高", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "rank_score" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
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

var HOST = "https://jav.sb";
var REFERER = HOST + "/";
// 唯一通道: javsb-hls Worker v2 (用户已部署 v1, 换 v2 代码后 /p /img 生效)
var WORKER = "https://javsb-hls.li768435813.workers.dev";
// 播放器 UA: 18av.mov 分片域对普通 UA 回 403, 探针/播放须用播放器 UA
var PLAYER_UA = "AppleCoreMedia/1.0.0.20L563 (iPhone; U; CPU OS 17_5 like Mac OS X; zh_cn)";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

var CATS = [
  { type_id: "new", type_name: "最近更新" },
  { type_id: "Censored", type_name: "日本有码" },
  { type_id: "Uncensored", type_name: "日本无码" },
  { type_id: "FC2-PPV", type_name: "FC2-PPV" },
  { type_id: "Mosaic_Removed", type_name: "无码破解" },
  { type_id: "CHN_SUB", type_name: "中文字幕" },
  { type_id: "MGS", type_name: "MGS" },
  { type_id: "Adult_IDOL", type_name: "写真" },
  { type_id: "Asian_Amateur", type_name: "国产" },
  { type_id: "Western_Porn", type_name: "欧美" },
  { type_id: "rank_hits", type_name: "热门影片" },
  { type_id: "rank_score", type_name: "评分最高" }
];

function t(v) { return String(v == null ? "" : v).trim(); }

function clean(s) {
  return t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ");
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  return HOST + (u.charAt(0) === "/" ? u : "/" + u);
}

// App 在不同入口可能传字符串、卡片对象或 JSON 串; 统一解出链接字符串。
// (v1 缺这一步: 传对象时 String(对象)="[object Object]", 详情必死。)
function unwrapLink(input) {
  var v = input;
  for (var i = 0; i < 3; i++) {
    if (v == null) return "";
    if (typeof v === "string") {
      var s = v.trim();
      if (s.charAt(0) === "{") {
        try { v = JSON.parse(s); continue; } catch (e) { return s; }
      }
      return s;
    }
    if (typeof v === "object") {
      v = v.link || v.id || v.url || v.href || "";
      continue;
    }
    return String(v);
  }
  return "";
}

// ---------- 唯一传输: 只跟 Worker 说话 ----------
async function viaHttp(url, timeoutMs) {
  try {
    var res = await Widget.http.get(url, {
      headers: { "User-Agent": UA, "Accept": "*/*" },
      timeout: timeoutMs
    });
    if (!res) return "";
    var status = res.status != null ? res.status : 200;
    if (status && status !== 200) return "";
    var data = res.data;
    if (data == null || data === "") return "";
    return typeof data === "string" ? data : JSON.stringify(data);
  } catch (e) {
    return "";
  }
}

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

// ---------- 页面缓存 (模块内, 降 Worker 调用量) ----------
var pageCache = {};
var TTL_LIST = 120000;
var TTL_DETAIL = 300000;

function cacheGet(url, ttl) {
  var e = pageCache[url];
  if (e && Date.now() - e.t < ttl) return e.s;
  return "";
}

function cacheSet(url, s) {
  pageCache[url] = { t: Date.now(), s: s };
  var keys = Object.keys(pageCache);
  if (keys.length > 60) delete pageCache[keys[0]];
}

// 经 Worker /p 取 jav.sb 页面正文 (HTML 优先, 中转全灭时可能是 markdown)。
// Worker 内已做多路竞速 + 240s 边缘缓存; 模块侧失败重试一次 (第二击常
// 命中 Worker 刚预热的缓存或换一路中转胜出)。
async function getPage(url, ttl) {
  var cached = cacheGet(url, ttl || TTL_LIST);
  if (cached) return cached;
  var p = WORKER + "/p?u=" + encodeURIComponent(url);
  var txt = await viaHttp(p, 45000);
  if (!txt) {
    await sleep(1200);
    txt = await viaHttp(p, 45000);
  }
  if (txt) cacheSet(url, txt);
  return txt || "";
}

// 封面改走 Worker /img (封面与页面同域, 设备直连同样被 CF 挡)
function imgUrl(u) {
  var abs = absUrl(u);
  if (!abs) return "";
  if (abs.indexOf("jav.sb") >= 0) return WORKER + "/img?u=" + encodeURIComponent(abs);
  return abs;
}

// ---------- 内容校验与解析 (与 v1/蜘蛛同口径, 已对真实页面验通) ----------
function isDetailPage(s) { return typeof s === "string" && (s.indexOf("og:title") >= 0 || s.indexOf("/static/player/") >= 0); }
function isMdPage(s) { return typeof s === "string" && s.indexOf("Title: ") >= 0 && s.indexOf("Markdown Content:") >= 0; }

function mdTitle(md) {
  var m = String(md || "").match(/^Title:\s*(.+)$/m);
  if (!m) return "";
  return clean(m[1]).replace(/\s*[-|–—]\s*JAVSB\s*$/i, "").trim();
}

function countCards(html) { return parseCards(html).length; }

function parseCards(html) {
  var s = String(html || "");
  if (s.indexOf('<div class="thumbnail group">') >= 0) return parseCardsHtml(s);
  return parseCardsMd(s);
}

function parseCardsHtml(html) {
  var out = [];
  var seen = {};
  var parts = String(html || "").split('<div class="thumbnail group">');
  for (var i = 1; i < parts.length; i++) {
    var chunk = parts[i].slice(0, 4000);
    var hrefM = chunk.match(/href="(\/jav\/[^"]+\.html)"/);
    if (!hrefM) continue;
    var id = HOST + hrefM[1];
    if (seen[id]) continue;
    seen[id] = 1;
    var pic = "";
    var imgM = chunk.match(/<img[^>]+data-src="([^"]+)"/) || chunk.match(/<img[^>]+src="([^"]+)"/);
    if (imgM && !/loading\.png/i.test(imgM[1])) pic = absUrl(imgM[1]);
    var name = "";
    var altM = chunk.match(/<img[^>]+alt="([^"]*)"/);
    if (altM) name = clean(altM[1]);
    if (!name) {
      var tm = chunk.match(/class="text-secondary group-hover:text-primary"[^>]*>([^<]+)</);
      if (tm) name = clean(tm[1]);
    }
    var remarks = "";
    var dm = chunk.match(/bg-opacity-75">([^<]+)</);
    if (dm) remarks = clean(dm[1]);
    out.push({ vod_id: id, vod_name: name || hrefM[1], vod_pic: pic, vod_remarks: remarks });
  }
  return out;
}

function parseCardsMd(text) {
  var s = String(text || "");
  var dur = {};
  var re1 = /\[(\d+:\d{2}:\d{2})\]\((https:\/\/jav\.sb\/jav\/[^)\s]+\.html)\)/g;
  var m;
  while ((m = re1.exec(s)) !== null) { if (!dur[m[2]]) dur[m[2]] = m[1]; }
  var out = [];
  var seen = {};
  function push(url, title) {
    var name = clean(title || "");
    if (!url || seen[url]) return;
    if (!name || /^\d+:\d{2}:\d{2}$/.test(name)) return;
    seen[url] = 1;
    out.push({ vod_id: url, vod_name: name, vod_pic: "", vod_remarks: dur[url] || "" });
  }
  var re2 = /!\[Image \d+: ([^\]]+)\]\([^)]*\)\]\((https:\/\/jav\.sb\/jav\/[^)\s]+\.html)\)/g;
  while ((m = re2.exec(s)) !== null) push(m[2], m[1]);
  var re3 = /\[([^\]]+)\]\((https:\/\/jav\.sb\/jav\/[^)\s]+\.html)\)/g;
  while ((m = re3.exec(s)) !== null) push(m[2], m[1]);
  return out;
}

function catUrl(cat, page) {
  var id = cat.type_id;
  if (id === "new") {
    return page > 1 ? HOST + "/label/new/by/time/page/" + page + ".html" : HOST + "/label/new/by/time.html";
  }
  if (id === "rank_hits" || id === "rank_score") {
    var by = id === "rank_hits" ? "hits_week" : "score";
    return page > 1 ? HOST + "/label/rank/by/" + by + "/page/" + page + ".html" : HOST + "/label/rank/by/" + by + ".html";
  }
  return page > 1 ? HOST + "/javtype/" + id + "-" + page + ".html" : HOST + "/javtype/" + id + ".html";
}

function toCards(list) {
  return (list || []).map(function (v) {
    var pic = v.vod_pic ? imgUrl(v.vod_pic) : "";
    return {
      id: v.vod_id,
      type: "url",
      title: v.vod_name,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: v.vod_id,
      description: v.vod_remarks || "",
      mediaType: "movie"
    };
  });
}

// ---------- 详情页解析 ----------
function og(html, prop) {
  var m = String(html || "").match(new RegExp('<meta property="og:' + prop + '" content="([^"]*)"'));
  return m ? clean(m[1]) : "";
}

function extractPlayer(html) {
  var s = String(html || "");
  var m = s.match(/src="(\/static\/player\/videojs\.html\?[^"]+)"/) ||
          s.match(/src="(https?:\/\/jav\.sb\/static\/player\/videojs\.html\?[^"]+)"/);
  if (!m) return { playerUrl: "", hash: "" };
  var playerUrl = absUrl(m[1].replace(/&amp;/g, "&"));
  var hm = playerUrl.match(/[?&]src=([0-9a-zA-Z]+)/);
  return { playerUrl: playerUrl, hash: hm ? hm[1] : "" };
}

// ---------- 播放: Worker /v 两形态 (猫源第六轮定版同一条链) ----------
// 先 seg=direct (分片保持 18av.mov 直链, 该域已由用户真机浏览器实证可达,
// 轻量低延迟); 取不到列表再全链代理形态 (分片经 Worker /s, 播放器只连
// Worker)。模块侧不再做分片探针 (那是多一跳设备网络请求)、不再走官方
// 取流回退 (token/save 是 jav.sb 本域地址, 播放器/模块在设备网络上都
// 取不到 —— 猫源第五轮真机已证全灭, 徒耗预算)。
async function resolveStream(hash) {
  function isPl(s) { return typeof s === "string" && s.indexOf("#EXTM3U") >= 0; }
  var directUrl = WORKER + "/v?hash=" + encodeURIComponent(hash) + "&seg=direct";
  var proxyUrl = WORKER + "/v?hash=" + encodeURIComponent(hash);
  var pl = await viaHttp(directUrl, 45000);
  if (isPl(pl)) return directUrl;
  var pl2 = await viaHttp(proxyUrl, 45000);
  if (isPl(pl2)) return proxyUrl;
  // 首击中转全灭是已知抖动: 稍等再击一次代理形态 (常命中 Worker 预热缓存)
  await sleep(1500);
  var pl3 = await viaHttp(proxyUrl, 45000);
  if (isPl(pl3)) return proxyUrl;
  return "";
}

// ---------- 接口 ----------
async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var tid = t(params.path || params.cat || params.type_id || "new");
  var cat = CATS[0];
  for (var i = 0; i < CATS.length; i++) { if (CATS[i].type_id === tid) { cat = CATS[i]; break; } }
  try {
    var html = await getPage(catUrl(cat, page), TTL_LIST);
    if (!html) return [{ id: "err", type: "url", title: "载入失败: 数据通道未取到列表", description: "请稍后重试" }];
    var cards = toCards(parseCards(html));
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

async function loadDetail(link) {
  var durl = unwrapLink(link);
  if (!durl) return { id: "err", type: "url", title: "参数错误", description: "未找到播放地址" };
  durl = /^https?:\/\//.test(durl) ? durl : absUrl(durl);
  try {
    var html = await getPage(durl, TTL_DETAIL);
    if (!html || !isDetailPage(html)) {
      var name0 = html && isMdPage(html) ? mdTitle(html) : "";
      return { id: durl, type: "url", title: name0 || "解析失败", description: "未找到播放地址" };
    }
    var name = og(html, "title");
    var pic = og(html, "image");
    var desc = og(html, "description");
    var player = extractPlayer(html);
    var videoUrl = "";
    if (player.hash) videoUrl = await resolveStream(player.hash);
    if (!videoUrl) {
      return {
        id: durl, type: "url",
        title: name || "解析失败",
        posterPath: pic ? imgUrl(pic) : "", coverUrl: pic ? imgUrl(pic) : "", backdropPath: pic ? imgUrl(pic) : "",
        link: durl,
        description: "未找到播放地址" + (desc ? " | " + desc : "")
      };
    }
    var cover = pic ? imgUrl(pic) : "";
    return {
      id: durl,
      type: "detail",
      title: name || durl,
      link: durl,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: { "User-Agent": PLAYER_UA, "Referer": REFERER }
    };
  } catch (e) {
    return { id: durl, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

function pickKeyword(params) {
  if (params == null) return "";
  if (typeof params === "string" || typeof params === "number") return String(params).trim();
  var keys = ["keyword", "q", "search", "text", "query", "wd", "key"];
  for (var i = 0; i < keys.length; i++) {
    if (params[keys[i]]) return String(params[keys[i]]).trim();
  }
  if (typeof params === "object") {
    var inner = params.params || params.args || params.input;
    if (inner && inner !== params) return pickKeyword(inner);
  }
  return "";
}

async function search(params) {
  params = params || {};
  var wd = pickKeyword(params);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var kw = encodeURIComponent(wd);
  var url = page > 1 ? HOST + "/vod/search/page/" + page + "/wd/" + kw + ".html" : HOST + "/vod/search.html?wd=" + kw;
  try {
    var html = await getPage(url, TTL_LIST);
    if (!html) return [{ id: "empty", type: "url", title: "没有找到相关影片" }];
    var cards = toCards(parseCards(html));
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}
