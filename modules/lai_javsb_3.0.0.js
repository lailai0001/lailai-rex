// JAVSB for REX (lai_javsb v3.0.0) —— 2026-10-22 重写, 替换 v2.0.0。
// 后端: https://jav.sb (MacCMS/Madou 模板站)。猫源只读蓝图:
// mira-cat nodejs/src/spider/video/javsb.js (第八轮定版 + 第十一轮探针)。
//
// v2 的问题 (用户真机"不咋能用") 与 v3 的改法:
//  1) v2 的 loadDetail 在详情里同步把 /v 两形态 + 重试全跑完才回
//     videoUrl (最坏 ~50s+), 且只回一条线 —— 线没掷中用户无从换线。
//     v3 改 SupJAV 3.0.0 同款形态: loadDetail 只取详情页拿 hash, 回
//     「全链」「直链」两条 episodes; 播放走 stream 模块 loadResource
//     按所选线实时取流 (与猫源第八轮双线同构: 全链=/v 默认形态、
//     分片经 Worker /s; 直链=/v?seg=direct、分片保持 18av.mov 直链)。
//  2) v3 新增设备直取探针 (猫源第十一轮同设计): play 时与主线并行,
//     用 Widget.http 两形态 (桌面头/裸 iOS 头) 直取官方 raw 清单
//     (算签与官方链路 A 逐字同法, 8s 封顶, 不拖慢主线), 结论写进
//     loadResource 返回的线路名: 全链·探针200/1679 / 全链·探针403 /
//     全链·探针超时 / 全链·探针未回 —— REX 线路名用户直接可见, 是
//     判断"手机出口能否直取 jav.sb 清单"的关键诊断面。探针只记
//     状态, 绝不改变出参 URL (回存 /put 尚未建)。
//  3) 取流失败兜底带短码 (仿 SupJAV 3.0.0): 两击 /v 皆败时仍回未
//     校验地址 (播放器自取再掷一次, 猫源第八轮同语义), 线路名带
//     未验v<状态> 短码, description 记逐步耗时/状态供截图判读。
//  4) Worker 已升 v4 (KV 全局库): 已入库的片 /v 秒回 (X-Javsb-Via:
//     kv), 未入库靠 /v 内 9 路竞速; 列表/详情/封面仍走 /p、/img,
//     与 v2 逐字同通道 (v4 的 /p /img 与 v2 兼容)。
// 已知特性 (如实保留): 未入库片首播要等 /v 竞速 (可达 20~35s 且
//   带随机成败), 这是站方只认公开中转出口的固有约束; 入库后永久
//   秒回。个别站方死片 (raw/save 双 404) 任何通道都取不到。

WidgetMetadata = {
  id: "lai_javsb",
  title: "JAVSB",
  description: "JAVSB（jav.sb）：最近更新/有码/无码/FC2/无码破解/中文字幕等分类，数据走 javsb-hls Worker，播放双线（全链/直链）+设备直取探针",
  author: "lai",
  version: "3.0.0",
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
    { title: "评分最高", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "rank_score" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    {
      title: "搜索",
      functionName: "search",
      params: [
        { name: "keyword", title: "关键词", type: "input" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadResource",
      title: "JAVSB播放源",
      description: "播放时按所选线路（全链/直链）实时取流，线路名带设备直取探针结论",
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

var HOST = "https://jav.sb";
var REFERER = HOST + "/";
// 唯一数据通道: javsb-hls Worker (现行 v4, /v /s /p /img 与 v2 兼容)
var WORKER = "https://javsb-hls.li768435813.workers.dev";
// 播放器 UA: 18av.mov 分片域对普通 UA 回 403, 播放须用播放器 UA
var PLAYER_UA = "AppleCoreMedia/1.0.0.20L563 (iPhone; U; CPU OS 17_5 like Mac OS X; zh_cn)";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
var UA_PC = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

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

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

// ---------- 基础传输 (仿 SupJAV 3.0.0 httpRaw: 保留状态码/响应头) ----------
function lowerHeaders(h) {
  var out = {};
  if (!h) return out;
  try {
    if (typeof h.forEach === "function") { // Headers 实例形态
      h.forEach(function (v, k) { out[String(k).toLowerCase()] = String(v); });
      return out;
    }
    for (var k in h) { if (Object.prototype.hasOwnProperty.call(h, k)) out[String(k).toLowerCase()] = String(h[k]); }
  } catch (e) {}
  return out;
}

// 永不抛错: 失败回 {status:0, error}。异常对象里若带状态码一并挖出
// (探针判定要的正是状态码本身)。
async function httpRaw(url, headers, timeoutMs) {
  try {
    var opts = { headers: headers || { "User-Agent": UA } };
    if (timeoutMs) opts.timeout = timeoutMs;
    var res = await Widget.http.get(url, opts);
    if (!res) return { status: 0, headers: {}, text: "", finalUrl: "", error: "empty response" };
    var data = res.data != null ? res.data : "";
    var text = typeof data === "string" ? data : (data ? JSON.stringify(data) : "");
    var status = 0;
    if (typeof res.status === "number") status = res.status;
    else if (typeof res.statusCode === "number") status = res.statusCode;
    else if (text) status = 200;
    return { status: status, headers: lowerHeaders(res.headers), text: text || "", finalUrl: res.url ? String(res.url) : "" };
  } catch (e) {
    var st = 0;
    if (e) {
      if (typeof e.status === "number") st = e.status;
      else if (typeof e.statusCode === "number") st = e.statusCode;
      else if (e.response && typeof e.response.status === "number") st = e.response.status;
    }
    var body = "";
    if (e && e.response && typeof e.response.data === "string") body = e.response.data;
    return { status: st, headers: {}, text: body, finalUrl: "", error: String((e && e.message) || e) };
  }
}

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

// 最近一次取页的逐步记录 (诊断卡判读用)
var lastPageReport = "";

// 取页文本归一化: /p 某些中转胜出时回「JSON 字符串转义形态」(引号带反斜杠,
// 两套解析器都认不出, 本机实测搜索页出现过)。无明文标记且带 \" 时整体解转义。
function normalizePageText(s) {
  if (typeof s !== "string" || !s) return s || "";
  if (s.indexOf('\\"') < 0) return s;
  if (s.indexOf('class="thumbnail') >= 0 || s.indexOf('property="og:') >= 0 || s.indexOf('src="/static/player/') >= 0) return s;
  return s.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\//g, "/")
    .replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\r/g, "")
    .replace(/\\u([0-9a-fA-F]{4})/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); });
}

// 经 Worker /p 取 jav.sb 页面正文。Worker 内已做多路竞速 + 边缘缓存;
// 模块侧失败重试一次 (第二击常命中 Worker 刚预热的缓存或换一路胜出)。
async function getPage(url, ttl) {
  var cached = cacheGet(url, ttl || TTL_LIST);
  if (cached) { lastPageReport = "模块缓存命中"; return cached; }
  var p = WORKER + "/p?u=" + encodeURIComponent(url);
  var notes = [];
  for (var i = 0; i < 2; i++) {
    var r = await httpRaw(p, { "User-Agent": UA, "Accept": "*/*" }, 45000);
    if (r.status === 200 && r.text) {
      var txt = normalizePageText(r.text);
      lastPageReport = "/p 第" + (i + 1) + "击 200（" + txt.length + "B）";
      cacheSet(url, txt);
      return txt;
    }
    notes.push("/p#" + (i + 1) + ":" + (r.status ? ("状态" + r.status) : ("无响应/" + String(r.error || "").slice(0, 40))));
    if (i === 0) await sleep(1200);
  }
  lastPageReport = notes.join("；");
  return "";
}

// 列表/搜索专用取页 (与猫源 isListPage 同款验收): 只有解出卡的页才算取到并缓存。
// 搜索页 HTML 形态是前端 JS 渲染的空壳 (0 卡, 本机实测), 须等 /p 换中转给出带卡
// 形态 (markdown 等), 不能拿空壳交差。两击都只有 0 卡页时返回最后一页 (调用方按
// 「无结果」处理), 一页都没取到返回 ""。
async function getCardsPage(url, ttl) {
  var cached = cacheGet(url, ttl || TTL_LIST);
  if (cached && parseCards(cached).length > 0) { lastPageReport = "模块缓存命中"; return cached; }
  var p = WORKER + "/p?u=" + encodeURIComponent(url);
  var notes = [];
  var fallback = "";
  for (var i = 0; i < 2; i++) {
    var r = await httpRaw(p, { "User-Agent": UA, "Accept": "*/*" }, 45000);
    if (r.status === 200 && r.text) {
      var txt = normalizePageText(r.text);
      var n = parseCards(txt).length;
      notes.push("/p#" + (i + 1) + ":200/" + n + "卡");
      if (n > 0) { lastPageReport = notes.join("；"); cacheSet(url, txt); return txt; }
      fallback = txt;
    } else {
      notes.push("/p#" + (i + 1) + ":" + (r.status ? ("状态" + r.status) : ("无响应/" + String(r.error || "").slice(0, 40))));
    }
    if (i === 0) await sleep(1200);
  }
  lastPageReport = notes.join("；");
  return fallback;
}

// 封面改走 Worker /img (封面与页面同域, 设备直连同样被 CF 挡)
function imgUrl(u) {
  var abs = absUrl(u);
  if (!abs) return "";
  if (abs.indexOf("jav.sb") >= 0) return WORKER + "/img?u=" + encodeURIComponent(abs);
  return abs;
}

// ---------- 内容校验与解析 (与 v2/蜘蛛同口径, 已对真实页面验通) ----------
function isDetailPage(s) { return typeof s === "string" && (s.indexOf("og:title") >= 0 || s.indexOf("/static/player/") >= 0); }
function isMdPage(s) { return typeof s === "string" && s.indexOf("Title: ") >= 0 && s.indexOf("Markdown Content:") >= 0; }

function mdTitle(md) {
  var m = String(md || "").match(/^Title:\s*(.+)$/m);
  if (!m) return "";
  return clean(m[1]).replace(/\s*[-|–—]\s*JAVSB\s*$/i, "").trim();
}

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

function diagCard(title, desc) {
  return [{
    id: "javsb-diag-" + Date.now(),
    type: "url",
    title: title,
    posterPath: "",
    coverUrl: "",
    backdropPath: "",
    link: HOST + "/",
    mediaType: "movie",
    description: desc || ""
  }];
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

// ---------- 线路 token (episodes 与 loadResource 之间传递) ----------
function lineToken(hash, form, durl) {
  return "javsb://h=" + hash + "&f=" + form + "&u=" + encodeURIComponent(durl || "");
}

function parseLineToken(s) {
  var m = String(s || "").match(/^javsb:\/\/h=([0-9a-zA-Z]+)&f=(proxy|direct)(?:&u=([^&]*))?/);
  if (!m) return null;
  var durl = "";
  if (m[3]) { try { durl = decodeURIComponent(m[3]); } catch (e) { durl = ""; } }
  return { hash: m[1], form: m[2], durl: durl };
}

// ---------- 官方算签 (与猫源 javsbSign 逐字同法) ----------
// encrypt(ky): ky 各字节 XOR 0x7B -> 字节串按大端整数做 base62 编码,
// 字母表 0-9a-zA-Z。逐字节进位实现 (不用 BigInt)。
var SIGN_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function javsbSign(plain) {
  var digits = [0];
  for (var i = 0; i < plain.length; i++) {
    var carry = (plain.charCodeAt(i) ^ 123) & 0xff;
    for (var j = 0; j < digits.length; j++) {
      var v = digits[j] * 256 + carry;
      digits[j] = v % 62;
      carry = Math.floor(v / 62);
    }
    while (carry > 0) { digits.push(carry % 62); carry = Math.floor(carry / 62); }
  }
  while (digits.length > 1 && digits[digits.length - 1] === 0) digits.pop();
  var out = "";
  for (var k = digits.length - 1; k >= 0; k--) out += SIGN_ALPHABET[digits[k]];
  return out;
}

// ---------- 设备直取探针 (猫源第十一轮同设计, 仅诊断不改出参) ----------
// play 时与主线并行点火: 用 Widget.http 两形态直取官方 raw 清单 ——
//   形态一 (桌面头, 对应猫源 req 栈): UA_PC + 站方 Referer;
//   形态二 (裸请求, 对应猫源 fetch 栈): iOS Safari 头。
// REX 只有 Widget.http 一条传输, 两形态以请求头家族区分 (与猫源双栈
// 的对应关系在报告中注明)。判定与猫源一致:
//   任一形态 200 且正文含 #EXTM3U -> 探针200/<EXTINF 数>;
//   两形态皆有应答但无一成功 -> 第一份确定状态码 (探针403 等);
//   8s 内无任何确定应答 -> 探针超时。
// 首份非 200 应答后只再给另一形态 1.5s 宽限。结论按 hash 缓存 120s。
var PROBE_CAP_MS = 8000;
var PROBE_GRACE_MS = 1500;
var probeCache = {}; // hash -> { t, suffix }

function probeRawUrl(hash) {
  var key = javsbSign(hash + "@" + Math.floor(Date.now() / 1000));
  return HOST + "/save_m3u8_cache.php?file=" + encodeURIComponent(hash) + "&raw=1&sign=" + key;
}

async function probeAttempt(url, headers, ms) {
  var r = await Promise.race([
    httpRaw(url, headers, ms),
    sleep(ms).then(function () { return { status: 0, text: "", error: "cap" }; })
  ]).catch(function () { return { status: 0, text: "", error: "exc" }; });
  if (r && r.status) return { status: r.status, text: r.text || "" };
  return null;
}

// 返回 Promise<string> (永不 reject): 线路名后缀。
function probeDirectRaw(hash) {
  var hit = probeCache[hash];
  if (hit && Date.now() - hit.t < 120000) {
    probeDirectRawFresh(hash); // 后台刷新, 不阻塞
    return Promise.resolve(hit.suffix);
  }
  return probeDirectRawFresh(hash);
}

function probeDirectRawFresh(hash) {
  var url = probeRawUrl(hash);
  var p = new Promise(function (resolve) {
    var done = false;
    var answered = 0;
    var firstStatus = 0;
    var graceTimer = null;
    function finish(suffix) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (graceTimer) clearTimeout(graceTimer);
      probeCache[hash] = { t: Date.now(), suffix: suffix };
      var keys = Object.keys(probeCache);
      if (keys.length > 40) delete probeCache[keys[0]];
      resolve(suffix);
    }
    var timer = setTimeout(function () { finish(firstStatus ? ("探针" + firstStatus) : "探针超时"); }, PROBE_CAP_MS);
    function onRes(r) {
      if (done) return;
      if (r && r.status) {
        if (r.status === 200 && r.text.indexOf("#EXTM3U") >= 0) {
          var n = (r.text.match(/#EXTINF/g) || []).length;
          finish("探针200/" + n);
          return;
        }
        if (!firstStatus) {
          firstStatus = r.status;
          graceTimer = setTimeout(function () { finish("探针" + firstStatus); }, PROBE_GRACE_MS);
        }
      }
      answered++;
      if (answered >= 2) finish(firstStatus ? ("探针" + firstStatus) : "探针超时");
    }
    probeAttempt(url, { "User-Agent": UA_PC, "Referer": REFERER, "Accept": "*/*" }, PROBE_CAP_MS).then(onRes, function () { onRes(null); });
    probeAttempt(url, { "User-Agent": UA, "Referer": REFERER, "Accept": "*/*" }, PROBE_CAP_MS).then(onRes, function () { onRes(null); });
  });
  return p;
}

// ---------- 播放主线: 按所选线校验 Worker /v ----------
// 与猫源第八轮同语义: 每条线一次点播 = 一次新的 /v 取数; 校验命中
// (200 + #EXTM3U) 即已验线; 两击皆败回未校验地址让播放器自取再掷
// 一次 (到点必回, 不把用户晾在转圈上)。已入库片 /v 为 KV 秒回。
function formUrlFor(hash, form) {
  return WORKER + "/v?hash=" + encodeURIComponent(hash) + (form === "direct" ? "&seg=direct" : "");
}

async function verifyFormUrl(url, trace) {
  for (var i = 0; i < 2; i++) {
    var t0 = Date.now();
    var r = await httpRaw(url, { "User-Agent": UA, "Accept": "*/*" }, i === 0 ? 25000 : 20000);
    var ms = Date.now() - t0;
    if (r.status === 200 && r.text.indexOf("#EXTM3U") >= 0) {
      var n = (r.text.match(/#EXTINF/g) || []).length;
      trace.push("v#" + (i + 1) + ":200/" + n + "片/" + ms + "ms" + (r.headers["x-javsb-via"] ? ("/via=" + r.headers["x-javsb-via"]) : ""));
      return { ok: true, segs: n, via: r.headers["x-javsb-via"] || "" };
    }
    trace.push("v#" + (i + 1) + ":" + (r.status ? ("状态" + r.status) : ("无响应/" + String(r.error || "").slice(0, 30))) + "/" + ms + "ms");
    if (i === 0) await sleep(1200);
  }
  return { ok: false, status: r.status || 0 };
}

// 主线算完后最多再短等 2s 等探针落点 (猫源 withProbeName 同语义);
// 等不到记 探针未回, 绝不因探针拖过主线。
async function probeSuffixFor(probeP) {
  if (!probeP) return "探针未回";
  var got = await Promise.race([
    probeP.then(function (s) { return s; }),
    sleep(2000).then(function () { return ""; })
  ]).catch(function () { return ""; });
  return got || "探针未回";
}

async function resolveLine(hash, form, durl) {
  var base = form === "direct" ? "直链" : "全链";
  var url = formUrlFor(hash, form);
  var headers = { "User-Agent": PLAYER_UA, "Referer": durl || REFERER };
  var probeP = probeDirectRaw(hash); // 与主线并行点火
  var trace = [];
  var v = await verifyFormUrl(url, trace);
  var suffix = await probeSuffixFor(probeP);
  if (v.ok) {
    return [{
      name: base + "·" + suffix,
      url: url,
      playerType: "app",
      customHeaders: headers,
      description: "已校验：" + v.segs + " 个分片" + (v.via ? ("，Worker 来源 via=" + v.via + (v.via === "kv" ? "（KV 已入库，秒回）" : "")) : "") + "；探针：" + suffix + "；步骤：" + trace.join(" ")
    }];
  }
  // 两击皆败: 回未校验地址 (播放器自取再掷一次), 短码+步骤供截图判读
  var code = "未验v" + (v.status ? v.status : "err");
  return [{
    name: base + "·" + code + "·" + suffix,
    url: url,
    playerType: "app",
    customHeaders: headers,
    description: "本线两击未取到清单（" + trace.join(" ") + "）；探针：" + suffix +
      "。已回未校验地址，播放器会自取再试一次；仍不行请换另一条线再点，或稍后重试（未入库片靠 Worker 竞速、入库后永久秒回）。"
  }];
}

// ---------- 接口 ----------
async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var tid = t(params.path || params.cat || params.type_id || "new");
  var cat = CATS[0];
  for (var i = 0; i < CATS.length; i++) { if (CATS[i].type_id === tid) { cat = CATS[i]; break; } }
  try {
    var html = await getCardsPage(catUrl(cat, page), TTL_LIST);
    if (!html) return diagCard("⚠诊断：列表取不到", "分类「" + cat.type_name + "」第 " + page + " 页经 Worker /p 两击未取到。步骤：" + lastPageReport + "。把本卡文字发给维护者可定位断点。");
    var cards = toCards(parseCards(html));
    return cards.length ? cards : diagCard("⚠诊断：页面已取回但解析出 0 张卡", "分类「" + cat.type_name + "」第 " + page + " 页正文 " + html.length + "B，结构可能已变。步骤：" + lastPageReport);
  } catch (e) {
    return diagCard("⚠诊断：列表异常 " + String((e && e.message) || e).slice(0, 50), "步骤：" + lastPageReport);
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
      if (!html) {
        return { id: durl, type: "url", title: "⚠诊断：详情取不到", link: durl, description: "详情页经 Worker /p 两击未取到。步骤：" + lastPageReport + "。把本卡文字发给维护者可定位断点。" };
      }
      return { id: durl, type: "url", title: name0 || "解析失败", link: durl, description: "未找到播放地址（详情页已取回 " + html.length + "B，但未提取到播放器 file hash）" };
    }
    var name = og(html, "title");
    var pic = og(html, "image");
    var desc = og(html, "description");
    var player = extractPlayer(html);
    var cover = pic ? imgUrl(pic) : "";
    if (!player.hash) {
      return { id: durl, type: "url", title: name || "解析失败", link: durl, posterPath: cover, coverUrl: cover, backdropPath: cover, description: "未找到播放地址（详情页未提取到播放器 file hash）" + (desc ? " | " + desc : "") };
    }
    return {
      id: durl,
      type: "url",
      title: name || durl,
      link: durl,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      description: (desc ? desc + "\n" : "") + "线路：全链（分片经 Worker 代理）/ 直链（分片直连 18av.mov）；点任意一条即实时取流，线路名带设备直取探针结论。",
      episodes: [
        { name: "全链", id: lineToken(player.hash, "proxy", durl), link: lineToken(player.hash, "proxy", durl) },
        { name: "直链", id: lineToken(player.hash, "direct", durl), link: lineToken(player.hash, "direct", durl) }
      ]
    };
  } catch (e) {
    return { id: durl, type: "url", title: "请求错误", description: String((e && e.message) || e), link: durl };
  }
}

// stream 模块入口:
//  - 入参是线路 token (javsb://…) → 按 token 的线取流
//  - 入参是详情页链接 → 取详情拿 hash, 默认走全链
//  - 入参是裸 hash (32 位 hex) → 直接按全链取流
async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  if (!raw && params.item) raw = params.item.link || params.item.id || params.item.url || "";
  raw = unwrapLink(raw);
  try {
    var tok = parseLineToken(raw);
    if (tok) return await resolveLine(tok.hash, tok.form, tok.durl);
    if (/^[0-9a-f]{32}$/i.test(raw)) return await resolveLine(raw, "proxy", "");
    var durl = /^https?:\/\//.test(raw) ? raw : absUrl(raw);
    if (!durl) return [];
    var html = await getPage(durl, TTL_DETAIL);
    if (!html || !isDetailPage(html)) {
      return [{
        name: "⚠诊断·详情取不到",
        url: durl,
        playerType: "app",
        customHeaders: { "User-Agent": PLAYER_UA, "Referer": REFERER },
        description: "详情页经 Worker /p 两击未取到，无法解析 hash。步骤：" + lastPageReport
      }];
    }
    var player = extractPlayer(html);
    if (!player.hash) return [];
    return await resolveLine(player.hash, "proxy", durl);
  } catch (e) {
    return [];
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
    var html = await getCardsPage(url, TTL_LIST);
    if (!html) return diagCard("⚠诊断：搜索取不到", "关键词「" + wd + "」经 Worker /p 两击未取到。步骤：" + lastPageReport);
    var cards = toCards(parseCards(html));
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关影片", description: "搜索页经 Worker /p 取回但无结果卡（站方搜索结果靠前端渲染，/p 回的形态不定，此时多半不是真无结果）。可重试一次，或改用分类浏览找片。步骤：" + lastPageReport }];
  } catch (e) {
    return diagCard("⚠诊断：搜索异常 " + String((e && e.message) || e).slice(0, 50), "步骤：" + lastPageReport);
  }
}
