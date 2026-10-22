// JAVSB for REX (lai_javsb v3.0.1) —— 2026-10-22, 在 v3.0.0 上修真机首测崩溃。
//
// ★ v3.0.1 修复 (真机诊断卡坐实): REX 模块沙箱 (JSC) 没有任何定时器
// 全局 —— v3.0.0 的重试间隔/探针宽限/超时竞速一调用即抛
// 「Can't find variable」类 ReferenceError, 列表第一步就崩 (诊断卡原
// 文: 列表异常 Can't find variable: …定时器名…)。本地 Node 有定时器
// 全局, harness 全过, 与蜘蛛无 fetch 同类掩盖。本版全模块清除一切定
// 时器用法 (grep 0 处): 重试改串行连发 (每击请求自身耗时即天然间
// 隔), 一切超时封顶交给 Widget.http 调用的 timeout 选项; 探针改串
// 行两形态顺序试 (先桌面头、后 iOS 头), 不再并行+宽限计时。顺带硬
// 化: /p 取页增至 4 击、响应形态全容错 (string/object/转义串/字节数
// 组统一归一成文本)、状态码多字段名兼容、诊断卡标题缩短 (列表里
// 不截断即可读出关键状态), 逐步记录仍留在描述里。
//
// (以下为 v3.0.0 沿革) 2026-10-22 重写, 替换 v2.0.0。
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
  version: "3.0.1",
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

// ★ 本模块严禁使用任何定时器全局: REX 沙箱 (JSC) 没有定时器, 一引用
// 即 ReferenceError (v3.0.0 真机首测即死于此)。重试间隔靠串行请求自
// 身耗时, 超时一律交给 Widget.http 的 timeout 选项封顶。

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

// 纯 JS UTF-8 解码 (不依赖 TextDecoder, 沙箱未必有): 字节数组 -> 字符串。
function utf8DecodeBytes(bytes) {
  var out = "";
  var i = 0;
  var n = bytes.length;
  while (i < n) {
    var c = bytes[i];
    if (c < 0x80) { out += String.fromCharCode(c); i++; continue; }
    var extra = 0, code = 0;
    if ((c & 0xE0) === 0xC0) { extra = 1; code = c & 0x1F; }
    else if ((c & 0xF0) === 0xE0) { extra = 2; code = c & 0x0F; }
    else if ((c & 0xF8) === 0xF0) { extra = 3; code = c & 0x07; }
    else { out += "�"; i++; continue; }
    var ok = true;
    for (var j = 1; j <= extra; j++) {
      if (i + j >= n || (bytes[i + j] & 0xC0) !== 0x80) { ok = false; break; }
      code = (code << 6) | (bytes[i + j] & 0x3F);
    }
    if (!ok) { out += "�"; i++; continue; }
    i += extra + 1;
    if (code < 0x10000) { out += String.fromCharCode(code); }
    else {
      code -= 0x10000;
      out += String.fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 0x3FF));
    }
  }
  return out;
}

// 响应体归一成文本: string 直用; 已解析 object -> JSON 串; 字节数组 /
// ArrayBuffer -> UTF-8 解码; 其余 -> String()。沙箱里 data 形态不定,
// 一律先过这里再解析, 不许在形态上翻车。
function decodeData(d) {
  if (d == null) return "";
  if (typeof d === "string") return d;
  if (typeof d === "number" || typeof d === "boolean") return String(d);
  try {
    // 用 toString 标签判型而非 instanceof: 跨 realm 的字节对象 instanceof
    // 会假阴性 (harness 注入实测踩到), 标签判型与鸭子判型双保险。
    var tag = Object.prototype.toString.call(d);
    if (tag === "[object ArrayBuffer]") return utf8DecodeBytes(new Uint8Array(d));
    if (/^\[object (Uint8|Int8|Uint8Clamped|Int16|Uint16|Int32|Uint32|Float32|Float64|DataView)/.test(tag) ||
        (d && typeof d.byteLength === "number" && d.buffer && Object.prototype.toString.call(d.buffer) === "[object ArrayBuffer]")) {
      return utf8DecodeBytes(new Uint8Array(d.buffer, d.byteOffset || 0, d.byteLength));
    }
    if (typeof d === "object") return JSON.stringify(d) || "";
  } catch (e) {}
  return "";
}

// 永不抛错: 失败回 {status:0, error}。异常对象里若带状态码一并挖出
// (探针判定要的正是状态码本身)。超时由 opts.timeout 封顶 (无定时器)。
async function httpRaw(url, headers, timeoutMs) {
  try {
    var opts = { headers: headers || { "User-Agent": UA } };
    if (timeoutMs) opts.timeout = timeoutMs;
    var res = await Widget.http.get(url, opts);
    if (!res) return { status: 0, headers: {}, text: "", finalUrl: "", error: "empty response" };
    if (typeof res === "string") return { status: 200, headers: {}, text: res, finalUrl: "" };
    var rawData = res.data != null ? res.data : (res.body != null ? res.body : "");
    var text = decodeData(rawData);
    var status = 0;
    if (typeof res.status === "number") status = res.status;
    else if (typeof res.statusCode === "number") status = res.statusCode;
    else if (typeof res.code === "number") status = res.code;
    else if (text) status = 200;
    return { status: status, headers: lowerHeaders(res.headers), text: text || "", finalUrl: res.url ? String(res.url) : "" };
  } catch (e) {
    var st = 0;
    if (e) {
      if (typeof e.status === "number") st = e.status;
      else if (typeof e.statusCode === "number") st = e.statusCode;
      else if (e.response && typeof e.response.status === "number") st = e.response.status;
      else if (e.response && typeof e.response.statusCode === "number") st = e.response.statusCode;
    }
    var body = "";
    if (e && e.response) body = decodeData(e.response.data != null ? e.response.data : e.response.body);
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

// 最近一次取页的逐步记录 (诊断卡判读用) + 关键状态短串 (诊断卡标题用,
// 列表里不点开也能读到: 如 "502" / "0" / "200空壳")
var lastPageReport = "";
var lastShort = "";

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
// 模块侧连打 4 击 (无间隔串行, 每击自身耗时即间隔; 后击常命中 Worker
// 刚预热的缓存或换一路胜出)。拿到 200 正文后: 是详情页/markdown 形态
// 立即收; 其它 200 形态先存兜底、继续打看有没有更好形态, 4 击打完
// 回兜底 (调用方再判)。Worker 的 502 错误体不是正文, 不作兜底。
var PAGE_HITS = 4;
async function getPage(url, ttl) {
  var cached = cacheGet(url, ttl || TTL_LIST);
  if (cached) { lastPageReport = "模块缓存命中"; lastShort = "缓存"; return cached; }
  var p = WORKER + "/p?u=" + encodeURIComponent(url);
  var notes = [];
  var fallback = "";
  var firstBad = "";
  for (var i = 0; i < PAGE_HITS; i++) {
    var r = await httpRaw(p, { "User-Agent": UA, "Accept": "*/*" }, 40000);
    if (r.status === 200 && r.text) {
      var txt = normalizePageText(r.text);
      if (isDetailPage(txt) || isMdPage(txt)) {
        notes.push("/p#" + (i + 1) + ":200命中形态/" + txt.length + "B");
        lastPageReport = notes.join("；");
        lastShort = "200";
        cacheSet(url, txt);
        return txt;
      }
      notes.push("/p#" + (i + 1) + ":200异形态/" + txt.length + "B");
      if (!firstBad) firstBad = "200异形态";
      if (!fallback) fallback = txt;
    } else {
      var tag = r.status ? ("状态" + r.status) : ("无响应/" + String(r.error || "").slice(0, 40));
      notes.push("/p#" + (i + 1) + ":" + tag);
      if (!firstBad) firstBad = r.status ? String(r.status) : "无响应";
    }
  }
  lastPageReport = notes.join("；");
  lastShort = firstBad || "失败";
  if (fallback) { cacheSet(url, fallback); return fallback; }
  return "";
}

// 列表/搜索专用取页 (与猫源 isListPage 同款验收): 只有解出卡的页才算取到并缓存,
// 解出 ≥1 卡即成功返回 (部分成功也出卡, 不全有全无)。连打 4 击 (无间隔串行):
// 搜索页 HTML 形态是前端 JS 渲染的空壳 (0 卡, 本机实测), 须等 /p 换中转给出带卡
// 形态 (markdown 等), 不能拿空壳交差。4 击都只有 0 卡页时返回最后一页 (调用方按
// 「无结果」处理), 一页都没取到返回 ""。
async function getCardsPage(url, ttl) {
  var cached = cacheGet(url, ttl || TTL_LIST);
  if (cached && parseCards(cached).length > 0) { lastPageReport = "模块缓存命中"; lastShort = "缓存"; return cached; }
  var p = WORKER + "/p?u=" + encodeURIComponent(url);
  var notes = [];
  var fallback = "";
  var firstBad = "";
  for (var i = 0; i < PAGE_HITS; i++) {
    var r = await httpRaw(p, { "User-Agent": UA, "Accept": "*/*" }, 40000);
    if (r.status === 200 && r.text) {
      var txt = normalizePageText(r.text);
      var n = parseCards(txt).length;
      notes.push("/p#" + (i + 1) + ":200/" + n + "卡");
      if (n > 0) { lastPageReport = notes.join("；"); lastShort = "200"; cacheSet(url, txt); return txt; }
      if (!firstBad) firstBad = "200·0卡";
      fallback = txt;
    } else {
      var tag = r.status ? ("状态" + r.status) : ("无响应/" + String(r.error || "").slice(0, 40));
      notes.push("/p#" + (i + 1) + ":" + tag);
      if (!firstBad) firstBad = r.status ? String(r.status) : "无响应";
    }
  }
  lastPageReport = notes.join("；");
  lastShort = firstBad || "失败";
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
// play 时与主线同时点火: 用 Widget.http 直取官方 raw 清单, 两形态以
// 请求头家族区分 (REX 只有这一条传输):
//   形态一 (桌面头, 对应猫源直连栈其一): UA_PC + 站方 Referer;
//   形态二 (iOS 头, 对应猫源直连栈其二): iOS Safari UA + 站方 Referer。
// ★ v3.0.1 改串行: v3.0.0 的「并行 + 宽限/封顶计时」依赖沙箱没有的
// 定时器全局, 真机直接抛错。本版顺序试两形态, 每击时长由 http 的
// timeout 选项封顶 (形态一 6s; 形态二: 形态一已有确定状态时 3s,
// 否则 6s)。判定与猫源一致:
//   任一形态 200 且正文含 #EXTM3U -> 探针200/<EXTINF 数>;
//   两形态皆无成功 -> 第一份确定状态码 (探针403 等);
//   两形态都无确定应答 -> 探针超时。
// 结论按 hash 缓存 120s; 命中缓存时后台无等待刷新一份 (不阻塞出参)。
var probeCache = {}; // hash -> { t, suffix }

function probeRawUrl(hash) {
  var key = javsbSign(hash + "@" + Math.floor(Date.now() / 1000));
  return HOST + "/save_m3u8_cache.php?file=" + encodeURIComponent(hash) + "&raw=1&sign=" + key;
}

function probeHit(r) {
  if (r && r.status === 200 && r.text && r.text.indexOf("#EXTM3U") >= 0) {
    return "探针200/" + (r.text.match(/#EXTINF/g) || []).length;
  }
  return "";
}

// 永不 reject: 串行试两形态, 回线路名后缀并写缓存。
async function probeDirectRawFresh(hash) {
  var suffix = "探针超时";
  try {
    var url = probeRawUrl(hash);
    var r1 = await httpRaw(url, { "User-Agent": UA_PC, "Referer": REFERER, "Accept": "*/*" }, 6000);
    var hit = probeHit(r1);
    if (hit) {
      suffix = hit;
    } else {
      var st1 = r1 && r1.status ? r1.status : 0;
      var r2 = await httpRaw(url, { "User-Agent": UA, "Referer": REFERER, "Accept": "*/*" }, st1 ? 3000 : 6000);
      hit = probeHit(r2);
      if (hit) suffix = hit;
      else {
        var st = st1 || (r2 && r2.status ? r2.status : 0);
        suffix = st ? ("探针" + st) : "探针超时";
      }
    }
  } catch (e) { suffix = "探针超时"; }
  probeCache[hash] = { t: Date.now(), suffix: suffix };
  var keys = Object.keys(probeCache);
  if (keys.length > 40) delete probeCache[keys[0]];
  return suffix;
}

// 返回 Promise<string> (永不 reject): 线路名后缀。
function probeDirectRaw(hash) {
  var hit = probeCache[hash];
  if (hit && Date.now() - hit.t < 120000) {
    probeDirectRawFresh(hash); // 后台刷新, 不阻塞本次出参
    return Promise.resolve(hit.suffix);
  }
  return probeDirectRawFresh(hash);
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
  }
  return { ok: false, status: r.status || 0 };
}

// 探针与主线同时点火 (见 resolveLine); 主线算完直接等探针落点 ——
// 无定时器可用, 不做「短等封顶」: 探针自身每击已由 http timeout 封
// 顶 (最坏约 9s, 典型 403/200 都在 1~3s 内落点), 且结论按 hash 缓
// 存 120s, 二次点播即时命中。探针永不 reject, 异常兜底记 探针未回。
async function probeSuffixFor(probeP) {
  if (!probeP) return "探针未回";
  var got = await probeP.catch(function () { return ""; });
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
    if (!html) return diagCard("⚠列表失败·" + lastShort, "分类「" + cat.type_name + "」第 " + page + " 页经 Worker /p 四击未取到。步骤：" + lastPageReport + "。点开本卡把全文发给维护者可定位断点。");
    var cards = toCards(parseCards(html));
    return cards.length ? cards : diagCard("⚠列表0卡", "分类「" + cat.type_name + "」第 " + page + " 页正文 " + html.length + "B 已取回但解析出 0 张卡，页面形态或结构可能已变。步骤：" + lastPageReport);
  } catch (e) {
    return diagCard("⚠列表异常", "错误：" + String((e && e.message) || e).slice(0, 120) + "。步骤：" + lastPageReport);
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
        return { id: durl, type: "url", title: "⚠详情失败·" + lastShort, link: durl, description: "详情页经 Worker /p 四击未取到。步骤：" + lastPageReport + "。点开本卡把全文发给维护者可定位断点。" };
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
        name: "⚠详情取不到·" + lastShort,
        url: durl,
        playerType: "app",
        customHeaders: { "User-Agent": PLAYER_UA, "Referer": REFERER },
        description: "详情页经 Worker /p 四击未取到，无法解析 hash。步骤：" + lastPageReport
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
    if (!html) return diagCard("⚠搜索失败·" + lastShort, "关键词「" + wd + "」经 Worker /p 四击未取到。步骤：" + lastPageReport);
    var cards = toCards(parseCards(html));
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关影片", description: "搜索页经 Worker /p 取回但无结果卡（站方搜索结果靠前端渲染，/p 回的形态不定，此时多半不是真无结果）。可重试一次，或改用分类浏览找片。步骤：" + lastPageReport }];
  } catch (e) {
    return diagCard("⚠搜索异常", "错误：" + String((e && e.message) || e).slice(0, 120) + "。步骤：" + lastPageReport);
  }
}
