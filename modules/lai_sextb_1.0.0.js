// SexTB for REX (lai_sextb v1.0.0)
// 移植自 mira-cat 蜘蛛 py_sextb v5（只读蓝图），后端 https://sextb.cc（官方备用域名，
// 与 sextb.net 结构一致；站点对部分网络封锁 .net、对机房 IP 有 Cloudflare WAF）。
// 列表: 首页（最新）/ /genre/{slug}/[/pg-N/]，tray-item 卡片（封面取 data-src）。
// 播放（在 loadDetail 内解析，沿用蜘蛛 v5 顺序）:
//   默认线路最先 —— F4 走已部署 Worker sextb-hls 的 /f4 全链（直返不探活）；
//   SW(StreamHG 系) 走 Worker /v（快速探活，逐视频死链时去借 F4）；
//   借线最多 2 条（F4>SW>PM>FL>DD>US>ST>PP，POST /ajax/player 取 embed 后逐宿主直解）；
//   SW 蜘蛛内解出的 hls3 直链作最后手段（手机住宅出口可能过其 ASN 门禁，不探活）；
//   全灭则如实返回未找到（蜘蛛的嗅探兜底在 REX 端内无对应通道）。

WidgetMetadata = {
  id: "lai_sextb",
  title: "SexTB",
  description: "SexTB：最新/有码/无码/素人/中文字幕/无码流出/减码等 28 个分类，播放走已部署 sextb-hls Worker 与逐宿主直解",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://sextb.cc",
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
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "censored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "uncensored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "amateur" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中文字幕", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "subtitle" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码流出", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "uncensored-leaked" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "减码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "reducing-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "英字幕", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "english-subtitle" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "数码有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "digital-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "低马赛克", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "minimal-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "big-tits" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中出", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "creampie" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "口交", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "blowjob" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "学生", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "school-girl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "熟女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "milf" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "成熟女性", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "mature-woman" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "蕾丝", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "lesbian" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "护士", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "nurse" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "OL", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "office-lady" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "3P4P", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "threesome" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Cosplay", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "cosplay" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "偷拍", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "voyeur" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "按摩", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "massage" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "捆绑", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "bondage" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "潮吹", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "squirting" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "女仆", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "maid" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "少女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "teen" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "FC2", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "fc2" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
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

var HOSTS = ["https://sextb.cc", "https://sextb.net"];
var SITE = HOSTS[0];
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = SITE + "/";
// SexTB 专用 HLS 代理 Worker（用户已部署，沿用蜘蛛写死地址）
var SEXTB_WORKER = "https://sextb-hls.li768435813.workers.dev";

// 核心分类 + 精选题材（与蜘蛛 CATS 一致，2026-10-20 从 /genres 实测）
var CATS = [
  { type_id: "latest", type_name: "最新" },
  { type_id: "censored", type_name: "有码", slug: "censored" },
  { type_id: "uncensored", type_name: "无码", slug: "uncensored-dc02d84q" },
  { type_id: "amateur", type_name: "素人", slug: "amateur-9yvovjqr" },
  { type_id: "subtitle", type_name: "中文字幕", slug: "subtitle" },
  { type_id: "uncensored-leaked", type_name: "无码流出", slug: "uncensored-leaked-8iodxgmu" },
  { type_id: "reducing-mosaic", type_name: "减码", slug: "reducing-mosaic-o16ol1qy" },
  { type_id: "english-subtitle", type_name: "英字幕", slug: "english-subtitle-8rpwhwew" },
  { type_id: "digital-mosaic", type_name: "数码有码", slug: "digital-mosaic-merf7vyh" },
  { type_id: "minimal-mosaic", type_name: "低马赛克", slug: "minimal-mosaic-csskw5dg" },
  { type_id: "big-tits", type_name: "巨乳", slug: "big-tits-hipx7w77" },
  { type_id: "creampie", type_name: "中出", slug: "creampie-dkel1ugw" },
  { type_id: "blowjob", type_name: "口交", slug: "blowjob-6w43evzo" },
  { type_id: "school-girl", type_name: "学生", slug: "school-girl-aze0q30d" },
  { type_id: "milf", type_name: "熟女", slug: "milf-k01m582n" },
  { type_id: "mature-woman", type_name: "成熟女性", slug: "mature-woman-pj7rh291" },
  { type_id: "lesbian", type_name: "蕾丝", slug: "lesbian-9akyznh5" },
  { type_id: "nurse", type_name: "护士", slug: "nurse-kor7sr6n" },
  { type_id: "office-lady", type_name: "OL", slug: "office-lady-pjv31x9c" },
  { type_id: "threesome", type_name: "3P4P", slug: "threesome--foursome-3r7836if" },
  { type_id: "cosplay", type_name: "Cosplay", slug: "cosplay-d5rzeneh" },
  { type_id: "voyeur", type_name: "偷拍", slug: "voyeur-9thq5fr5" },
  { type_id: "massage", type_name: "按摩", slug: "massage-0ypm730h" },
  { type_id: "bondage", type_name: "捆绑", slug: "bondage-wywuaggb" },
  { type_id: "squirting", type_name: "潮吹", slug: "squirting-1t5r5wb9" },
  { type_id: "maid", type_name: "女仆", slug: "maid-vkrzm0oo" },
  { type_id: "teen", type_name: "少女", slug: "teen-gk3kz0pk" },
  { type_id: "fc2", type_name: "FC2", slug: "fc2" }
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
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
}

function fixUrl(u) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return SITE + u;
  if (/^https?:\/\//.test(u)) return u;
  return SITE + "/" + u;
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

function pathOf(url) {
  var u = t(url);
  var m = u.match(/^https?:\/\/[^/]+(\/.*)$/i);
  if (m) return m[1];
  return u.charAt(0) === "/" ? u : "/" + u;
}

// 拦截/验证页判定（与蜘蛛 isBlockedPage 一致，只认拦截页特有文案）
function isBlockedPage(html) {
  if (!html || typeof html !== "string") return true;
  if (html.length < 500) return true;
  var head = html.slice(0, 3000);
  if (/Your request was blocked/i.test(head)) return true;
  if (/<title>[^<]*(Just a moment|Attention Required)/i.test(head)) return true;
  if (/Performing security verification/i.test(head)) return true;
  if (/Sorry, you have been blocked/i.test(head)) return true;
  return false;
}

function pageHeaders(referer, extra) {
  var h = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.7",
    "Referer": referer || REFERER
  };
  if (extra) for (var k in extra) h[k] = extra[k];
  return h;
}

async function rawGetText(url, headers) {
  try {
    var res = await Widget.http.get(url, { headers: headers });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    if (body && !isBlockedPage(body)) return body;
  } catch (e) { /* 失败返回空 */ }
  return "";
}

// jina reader 兜底（直连全失败时用，与蜘蛛 fetchViaJina 一致）
async function fetchViaJina(host, path) {
  var jinaUrl = "https://r.jina.ai/" + host + path;
  try {
    var res = await Widget.http.get(jinaUrl, { headers: { "User-Agent": UA, "x-respond-with": "html" } });
    var body = res && res.data != null ? String(res.data) : "";
    if (body && !isBlockedPage(body) && (body.indexOf("tray-item") >= 0 || body.length > 5000)) return body;
  } catch (e) { /* 失败返回空 */ }
  return "";
}

// 多域名 failover 取本站页面：.cc/.net 直连，全失败再逐个走 jina
async function getHtml(url, extraHeaders) {
  var host = hostOf(url);
  if (!/sextb\.(net|cc)$/.test(host)) {
    // 非本站 URL（embed 页等）直接原地址请求，不做拦截页判定
    try {
      var res = await Widget.http.get(url, { headers: pageHeaders(host ? "https://" + host + "/" : REFERER, extraHeaders) });
      var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
      return body || "";
    } catch (e) { return ""; }
  }
  var path = pathOf(url);
  var order = [];
  var first = "https://" + host;
  if (HOSTS.indexOf(first) >= 0) order.push(first);
  for (var i = 0; i < HOSTS.length; i++) if (order.indexOf(HOSTS[i]) < 0) order.push(HOSTS[i]);
  for (var j = 0; j < order.length; j++) {
    var html = await rawGetText(order[j] + path, pageHeaders(order[j] + "/", extraHeaders));
    if (html) return html;
  }
  for (var k = 0; k < order.length; k++) {
    var jh = await fetchViaJina(order[k], path);
    if (jh) return jh;
  }
  return "";
}

// POST（带守卫）：运行时无 Widget.http.post 时返回空，调用方按失败降级
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

async function postJsonBody(url, obj, headers) {
  var raw = await httpPostRaw(url, JSON.stringify(obj), {
    "User-Agent": UA,
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(headers || {})
  });
  if (raw == null) return null;
  if (typeof raw === "object") return raw;
  try { return JSON.parse(String(raw)); } catch (e) { return null; }
}

// /ajax/player 快速 POST（只打详情页同域名，form 编码）
async function postAjaxPlayer(durl, bodyObj) {
  var origin = originOf(durl);
  if (!origin) return "";
  var parts = [];
  for (var k in bodyObj) parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(bodyObj[k]));
  var raw = await httpPostRaw(origin + "/ajax/player", parts.join("&"), {
    "User-Agent": UA,
    "Referer": durl,
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest"
  });
  if (raw == null) return "";
  var s = typeof raw === "string" ? raw : JSON.stringify(raw);
  if (!s || /Your request was blocked/i.test(s)) return "";
  return s;
}

// ================= 播放解析层（逐宿主直解，移植蜘蛛 v4/v5） =================

// 纯字符串 Dean Edwards packer 解包（与蜘蛛一致，禁 vm/eval）
function jsUnescapeSingle(s) {
  return s.replace(/\\(.)/g, function (m, c) {
    if (c === "n") return "\n";
    if (c === "r") return "\r";
    if (c === "t") return "\t";
    return c;
  });
}

function unpackDeanEdwards(html) {
  var m = String(html || "").match(/eval\(function\(p,a,c,k,e,d\)[\s\S]*?\}\s*\(\s*'((?:[^'\\]|\\.)*)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:[^'\\]|\\.)*)'\.split\('\|'\)/);
  if (!m) return "";
  var p = jsUnescapeSingle(m[1]);
  var a = parseInt(m[2], 10);
  var c = parseInt(m[3], 10);
  var k = jsUnescapeSingle(m[4]).split("|");
  function enc(n) { return (n < a ? "" : enc(Math.floor(n / a))) + ((n % a) > 35 ? String.fromCharCode((n % a) + 29) : (n % a).toString(36)); }
  var i = c;
  while (i--) {
    if (k[i]) {
      (function (word, token) {
        p = p.replace(new RegExp("\\b" + token + "\\b", "g"), function () { return word; });
      })(k[i], enc(i));
    }
  }
  return p;
}

// 从解包文本提取 StreamHG links{hls2,hls3,hls4}
function extractHgLinks(text) {
  var links = {};
  var re = /"hls(\d+)"\s*:\s*"([^"]+)"/g;
  var m;
  var s = String(text || "");
  while ((m = re.exec(s)) !== null) links["hls" + m[1]] = m[2];
  return links;
}

// 从解包文本/页面提取通用 file: m3u8 或 mp4
function extractGenericFile(text) {
  var s = String(text || "");
  var m = s.match(/"file"\s*:\s*"(https?:[^"]+?\.m3u8[^"]*)"/) || s.match(/file\s*:\s*"(https?:[^"]+?\.m3u8[^"]*)"/);
  if (m) return m[1];
  m = s.match(/(https?:\/\/[^\s"'\\]+\.m3u8(?:\?[^\s"'\\]*)?)/);
  if (m) return m[1];
  m = s.match(/"file"\s*:\s*"(https?:[^"]+?\.mp4[^"]*)"/);
  if (m) return m[1];
  return "";
}

// 探活：GET 回的文本含 #EXTM3U 才认（与蜘蛛 probePlaylist 一致）
async function probePlaylist(url, headers) {
  try {
    var res = await Widget.http.get(url, { headers: headers || { "User-Agent": UA } });
    var body = res && res.data != null ? String(res.data) : "";
    return body.indexOf("#EXTM3U") >= 0;
  } catch (e) { return false; }
}

// mp4 探活：优先 Widget.http.head（已有模块在用），无 head 时退而用带 Range 的
// GET 只看状态（运行时若不支持 Range 头则可能拉全量，慎用——仅通用线兜底时调用）
async function probeMp4(url, headers) {
  try {
    if (typeof Widget.http.head === "function") {
      var r = await Widget.http.head(url, { headers: headers || {} });
      return r && (r.status === 200 || r.status === 206);
    }
  } catch (e) { /* 继续下面的办法 */ }
  try {
    var h2 = { ...(headers || {}), "Range": "bytes=0-0" };
    var res2 = await Widget.http.get(url, { headers: h2 });
    return !!res2 && (res2.status === 200 || res2.status === 206);
  } catch (e) { return false; }
}

// 通用 GET 文本（embed 页解析用，不做本站拦截页判定，须 >200 字节）
async function fetchEmbedText(url, referer) {
  try {
    var res = await Widget.http.get(url, { headers: pageHeaders(referer || REFERER) });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body && body.length > 200 ? body : "";
  } catch (e) { return ""; }
}

function workerVUrl(embedUrl, durl) {
  if (!SEXTB_WORKER) return "";
  return SEXTB_WORKER + "/v?u=" + encodeURIComponent(embedUrl) + "&r=" + encodeURIComponent(durl);
}

function workerF4Url(embedUrl, durl) {
  if (!SEXTB_WORKER) return "";
  return SEXTB_WORKER + "/f4?u=" + encodeURIComponent(embedUrl) + "&r=" + encodeURIComponent(durl);
}

function isF4HostName(host) { return /f4scdn\.com|f4jav\.xyz/.test(host || ""); }
function isSwHostName(host) { return /hglink\.to|streamhg|trailerhg|earnvid|vidhide/.test(host || ""); }

// SW 蜘蛛内解包：hglink 换 trailerhg 同代码 XFS 页 → 解包 links（只解包不探活）
async function decodeStreamHgLinks(embedUrl, durl) {
  var host = hostOf(embedUrl);
  var code = codeOf(embedUrl);
  if (!code) return {};
  var pageUrl = embedUrl;
  if (/(^|\.)hglink\.to$/.test(host)) pageUrl = "https://trailerhg.xyz/e/" + code;
  var html = await fetchEmbedText(pageUrl, durl);
  if (!html) return {};
  var unpacked = unpackDeanEdwards(html) || html;
  var links = extractHgLinks(unpacked);
  var origin = originOf(pageUrl);
  for (var k in links) {
    if (links[k].charAt(0) === "/") links[k] = origin + links[k];
  }
  return links;
}

// SW 蜘蛛内直解：hls3 优先、hls4 次之、hls2 末选（withProbe 时逐个探活）
async function resolveStreamHgInSpider(embedUrl, durl, withProbe) {
  var links = await decodeStreamHgLinks(embedUrl, durl);
  var heads = { "User-Agent": UA };
  var keys = ["hls3", "hls4", "hls2"];
  for (var i = 0; i < keys.length; i++) {
    var u = links[keys[i]];
    if (!u || !/^https?:\/\//.test(u)) continue;
    if (withProbe && !(await probePlaylist(u, heads))) continue;
    return { url: u, headers: heads };
  }
  return null;
}

// PM / playmate 系：POST /api/s {c,d:'web'} → sx 直链
async function resolvePlaymate(embedUrl) {
  try {
    var origin = originOf(embedUrl);
    var code = codeOf(embedUrl);
    if (!origin || !code) return null;
    var resp = await postJsonBody(origin + "/api/s", { c: code, d: "web" }, { "Referer": embedUrl });
    var src = resp && t(resp.sx || resp.src || resp.url);
    if (!src || !/^https?:\/\//.test(src)) return null;
    return { url: src, headers: { "User-Agent": UA, "Referer": embedUrl } };
  } catch (e) { return null; }
}

// vidara 系：POST /api/stream → streaming_url
async function resolveVidara(embedUrl) {
  try {
    var origin = originOf(embedUrl);
    var code = codeOf(embedUrl);
    if (!origin || !code) return null;
    var resp = await postJsonBody(origin + "/api/stream",
      { filecode: code, device: "ios", codecs: ["h265"] },
      { "Referer": embedUrl, "Origin": origin });
    var src = resp && t(resp.streaming_url || resp.src || resp.url);
    if (!src || !/^https?:\/\//.test(src)) return null;
    return { url: src, headers: { "User-Agent": UA, "Referer": embedUrl } };
  } catch (e) { return null; }
}

// dood 系：embed 页取 /pass_md5/ → GET 得 CDN 前缀 → 拼 token，探活通过才返回
async function resolveDood(embedUrl) {
  try {
    var origin = originOf(embedUrl);
    if (!origin) return null;
    var html = await fetchEmbedText(embedUrl, embedUrl);
    if (!html) return null;
    var pm = html.match(/(\/pass_md5\/[A-Za-z0-9_\-\/]+)/);
    if (!pm) return null;
    var prefix = "";
    try {
      var res = await Widget.http.get(origin + pm[1], { headers: { "User-Agent": UA, "Referer": embedUrl } });
      prefix = res && res.data != null ? t(res.data) : "";
    } catch (e) { /* ignore */ }
    if (!/^https?:\/\//.test(prefix)) return null;
    var tokM = html.match(/[?&]token=([A-Za-z0-9_\-]+)/) || html.match(/token\s*[:=]\s*["']([A-Za-z0-9_\-]+)["']/);
    var expM = html.match(/expiry\s*[:=]\s*["']?(\d{9,})/);
    var finalUrl = prefix;
    if (tokM) finalUrl += "?token=" + tokM[1] + (expM ? "&expiry=" + expM[1] : "");
    var heads = { "User-Agent": UA, "Referer": embedUrl };
    if (await probeMp4(finalUrl, heads)) return { url: finalUrl, headers: heads };
    return null;
  } catch (e) { return null; }
}

// 通用 XFS 系：抓 embed 页 → 解包 → file 直链 → 探活通过才返回
async function resolveGeneric(embedUrl, durl) {
  var html = await fetchEmbedText(embedUrl, durl);
  if (!html) return null;
  var unpacked = unpackDeanEdwards(html);
  var file = extractGenericFile(unpacked) || extractGenericFile(html);
  if (!file || !/^https?:\/\//.test(file)) return null;
  var heads = { "User-Agent": UA, "Referer": embedUrl };
  if (/\.m3u8(\?|$)/i.test(file)) {
    if (await probePlaylist(file, heads)) return { url: file, headers: heads };
    return null;
  }
  if (await probeMp4(file, heads)) return { url: file, headers: heads };
  return null;
}

// 按 embed 宿主分流解析（F4/SW 在 loadDetail 主流程里优先处理，走到这里按兜底）
async function resolveEmbed(embedUrl, durl) {
  var host = hostOf(embedUrl);
  if (!host) return null;
  if (isF4HostName(host)) return null; // F4 只能走 Worker，主流程已处理
  if (isSwHostName(host)) return resolveStreamHgInSpider(embedUrl, durl, true);
  if (/playmate/.test(host)) return resolvePlaymate(embedUrl);
  if (/shadowbyte|dstyladsg|vidara/.test(host)) return resolveVidara(embedUrl);
  if (/dood|d000d|do7go|playmogo/.test(host)) return resolveDood(embedUrl);
  return resolveGeneric(embedUrl, durl);
}

// POST /ajax/player 取某条线路的 embed URL
async function ajaxEmbed(durl, ep, filmId) {
  var resp = await postAjaxPlayer(durl, { episode: ep.episode, filmId: filmId });
  if (!resp) return "";
  try {
    var json = typeof resp === "string" ? JSON.parse(resp) : resp;
    var playerHtml = t(json.player);
    var em = playerHtml.match(/<iframe[^>]+src="(https?:\/\/[^"]+)"/) ||
             playerHtml.match(/<iframe[^>]+src="(\/\/[^"]+)"/);
    if (em) return fixUrl(em[1]);
  } catch (e) { /* ignore */ }
  return "";
}

// ================= 列表 / 搜索 / 详情 =================

// 卡片解析（与蜘蛛 parseCards 一致）：div.tray-item > a[href="/{code}"]
// 封面取 data-src（src 是 default-cover 占位图），标题取 img alt，番号取 tray-item-code
function parseCards(html) {
  var out = [];
  var seen = {};
  var re = /<div class="tray-item(?:\s[^"]*)?">\s*<a\s[^>]*href="(?:https?:\/\/sextb\.(?:net|cc))?(\/[a-z0-9][a-z0-9\-]{3,40})"[^>]*>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var path = m[1];
    if (seen[path]) continue;
    seen[path] = true;
    var win = html.slice(m.index, m.index + 2500);
    var title = "";
    var altM = win.match(/<img[^>]+alt="([^"]+)"/);
    if (altM) title = clean(altM[1]);
    var pic = "";
    var dsM = win.match(/data-src="(https?:\/\/[^"]+)"/) || win.match(/data-src="(\/\/[^"]+)"/);
    if (dsM && dsM[1].indexOf("default-cover") < 0) pic = fixUrl(dsM[1]);
    if (!pic) {
      var srcM = win.match(/<img[^>]+src="(https?:\/\/[^"]+)"/) || win.match(/<img[^>]+src="(\/\/[^"]+)"/);
      if (srcM && srcM[1].indexOf("default-cover") < 0) pic = fixUrl(srcM[1]);
    }
    var code = "";
    var cdM = win.match(/tray-item-code">([^<]+)</);
    if (cdM) code = clean(cdM[1]);
    var link = fixUrl(path);
    out.push({
      id: link,
      type: "url",
      title: title || code || path.replace(/^\//, ""),
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: code,
      mediaType: "movie"
    });
  }
  return out;
}

function catOf(tid) {
  for (var i = 0; i < CATS.length; i++) if (CATS[i].type_id === tid) return CATS[i];
  return CATS[0];
}

function catUrl(cat, page) {
  if (cat.type_id === "latest") {
    return page > 1 ? SITE + "/pg-" + page : SITE + "/";
  }
  var slug = cat.slug || cat.type_id;
  var base = slug.indexOf("/") >= 0 ? SITE + "/" + slug : SITE + "/genre/" + slug;
  return page > 1 ? base + "/pg-" + page : base;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var tid = t(params.path || params.cat || "latest");
  try {
    var html = await getHtml(catUrl(catOf(tid), page));
    if (!html) return [{ id: "err", type: "url", title: "载入失败（站点无响应或被拦截）" }];
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
  var url = SITE + "/search/" + encodeURIComponent(wd);
  if (page > 1) url += "/pg-" + page;
  try {
    var html = await getHtml(url);
    if (!html) return [{ id: "err", type: "url", title: "搜索失败（站点无响应或被拦截）" }];
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

// 从详情页提取 filmId 和服务器（episode）列表
function extractPlayerInfo(html) {
  var filmId = "";
  var fm = html.match(/filmId\s*=\s*["']?(\d+)/);
  if (fm) filmId = fm[1];
  var episodes = [];
  var re = /<button[^>]*class="[^"]*btn-player episode[^"]*"[^>]*data-source="(\d+)"[^>]*data-id="(\d+)"[^>]*>(?:<i[^>]*><\/i>)?\s*([A-Z0-9]+)</g;
  var m;
  while ((m = re.exec(html)) !== null) {
    episodes.push({ filmId: m[1], episode: m[2], name: m[3] });
  }
  return { filmId: filmId, episodes: episodes };
}

// 从详情页提取默认 player iframe
function extractDefaultEmbed(html) {
  var m = html.match(/id="sextb-player"[\s\S]{0,500}?<iframe[^>]+src="(https?:\/\/[^"]+)"/) ||
          html.match(/id="sextb-player"[\s\S]{0,500}?<iframe[^>]+src="(\/\/[^"]+)"/);
  return m ? fixUrl(m[1]) : "";
}

function detailResult(durl, name, pic, videoUrl, headers) {
  return {
    id: durl,
    type: "detail",
    title: name || durl,
    link: durl,
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    videoUrl: videoUrl,
    playerType: "app",
    customHeaders: headers || { "User-Agent": UA },
    description: name || ""
  };
}

async function loadDetail(link) {
  var durl = t(link);
  try {
    if (!/^https?:\/\//.test(durl)) durl = fixUrl(durl);
    var html = await getHtml(durl);
    if (!html) {
      return { id: durl, type: "url", title: "载入失败", description: "详情页无响应或被拦截" };
    }
    // 页面没有播放器标记（疑似拦截页）时换镜像域名再抓一次（与蜘蛛 play 一致）
    function hasPlayer(h) { return !!h && (h.indexOf("sextb-player") >= 0 || h.indexOf("btn-player") >= 0); }
    if (!hasPlayer(html)) {
      var alt = durl.replace(/sextb\.(cc|net)/i, function (mm, g) { return "sextb." + (g.toLowerCase() === "cc" ? "net" : "cc"); });
      if (alt !== durl) {
        var h2 = await getHtml(alt);
        if (hasPlayer(h2)) html = h2;
      }
    }

    // 标题
    var name = "";
    var tm = html.match(/<title>([^<]*)<\/title>/);
    if (tm) name = clean(tm[1]).replace(/\s*-\s*SEXTB.*$/i, "").replace(/Free JAV.*$/i, "").trim();
    // 封面：页面内 webp poster（公开 CDN 直读）> video poster > og:image
    var pic = "";
    var wm = html.match(/data-src="(https?:\/\/cdn001\.imggle\.net\/webp\/poster[^"]+)"/);
    if (wm) pic = wm[1];
    if (!pic) {
      var vm2 = html.match(/<video[^>]+poster="(https?:\/\/[^"]+)"/);
      if (vm2) pic = vm2[1];
    }
    if (!pic) {
      var ogm = html.match(/<meta property="og:image" content="([^"]+)"/);
      if (ogm) pic = ogm[1];
    }
    pic = fixUrl(pic);

    var defEmbed = extractDefaultEmbed(html);
    var info = extractPlayerInfo(html);
    var filmId = info.filmId;
    var episodes = info.episodes;

    var deadline = Date.now() + 60000;
    var uaHead = { "User-Agent": UA };
    var swLastResort = ""; // SW 蜘蛛内 hls3 直链（最后手段）

    // —— 第一步：默认线路（embed 已在详情页里，零额外请求） ——
    if (defEmbed) {
      var dhost = hostOf(defEmbed);
      if (isF4HostName(dhost)) {
        var w = workerF4Url(defEmbed, durl);
        if (w) return detailResult(durl, name, pic, w, uaHead);
      } else if (isSwHostName(dhost)) {
        var wv = workerVUrl(defEmbed, durl);
        if (wv) {
          // SW 的 Worker 链有逐视频死链 → 快速探活一次，过不了落到借线
          if (await probePlaylist(wv, uaHead)) {
            return detailResult(durl, name, pic, wv, uaHead);
          }
        } else {
          var r0 = await resolveStreamHgInSpider(defEmbed, durl, true);
          if (r0) return detailResult(durl, name, pic, r0.url, r0.headers);
        }
      } else {
        try {
          var rd = await resolveEmbed(defEmbed, durl);
          if (rd && rd.url) return detailResult(durl, name, pic, rd.url, rd.headers);
        } catch (e) { /* 落到借线 */ }
      }
    }

    // —— 第二步：借线（POST /ajax/player），最多 2 条 ——
    // 优先级 F4 > SW > PM > FL > DD > US > ST > PP（与蜘蛛 v5 一致）
    var PREF = { F4: 0, SW: 1, PM: 2, FL: 3, DD: 4, US: 5, ST: 6, PP: 7 };
    var sorted = episodes.slice().sort(function (a, b) {
      var pa = PREF[t(a.name).toUpperCase()] != null ? PREF[t(a.name).toUpperCase()] : 90;
      var pb = PREF[t(b.name).toUpperCase()] != null ? PREF[t(b.name).toUpperCase()] : 90;
      return pa - pb;
    });
    var seenName = {};
    var borrowed = 0;
    for (var i = 0; i < sorted.length; i++) {
      if (borrowed >= 2 || Date.now() > deadline) break;
      var ep = sorted[i];
      var nm = t(ep.name).toUpperCase();
      if (seenName[nm]) continue;
      seenName[nm] = true;
      // 默认线路（episodes[0]）已在第一步用过，同线跳过省一次 ajax
      if (defEmbed && episodes.length && ep.episode === episodes[0].episode) continue;
      if (!filmId) break;
      borrowed++;
      var embed = await ajaxEmbed(durl, ep, filmId);
      if (!embed) continue;
      var host = hostOf(embed);
      try {
        if (isF4HostName(host)) {
          var wf = workerF4Url(embed, durl);
          if (wf) return detailResult(durl, name, pic, wf, uaHead);
          continue;
        }
        if (isSwHostName(host)) {
          var ws = workerVUrl(embed, durl);
          if (ws && (await probePlaylist(ws, uaHead))) {
            return detailResult(durl, name, pic, ws, uaHead);
          }
          // Worker 链对此视频不通：蜘蛛内解 hls3 记下作最后手段，继续借其他线
          if (!swLastResort) {
            var links = await decodeStreamHgLinks(embed, durl);
            if (links.hls3) swLastResort = links.hls3;
          }
          continue;
        }
        var rb = await resolveEmbed(embed, durl);
        if (rb && rb.url) return detailResult(durl, name, pic, rb.url, rb.headers);
      } catch (e) { /* 换下一条线路 */ }
    }

    // —— 第三步：SW 最后手段（蜘蛛内 hls3 直链，不探活、交播放器试） ——
    if (!swLastResort && defEmbed && isSwHostName(hostOf(defEmbed))) {
      var links2 = await decodeStreamHgLinks(defEmbed, durl);
      if (links2.hls3) swLastResort = links2.hls3;
    }
    if (swLastResort) {
      return detailResult(durl, name, pic, swLastResort, uaHead);
    }

    // 全部线路解不出：如实返回（蜘蛛在此处回退嗅探，REX 端内无嗅探通道）
    return { id: durl, type: "url", title: name || "解析失败", description: "未找到播放地址" };
  } catch (e) {
    return { id: durl || String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
