// JAVSB for REX (lai_javsb v1.0.0)
// 移植自 mira-cat 蜘蛛 javsb.js (第六轮定版逻辑), 后端: https://jav.sb (MacCMS/Madou 模板站)。
// 列表/详情: 站方 CF 对直连出口拦截, 沿用蜘蛛的多中转竞速抓取栈
//   (jina / markdown.new / allorigins 多层竞速 + 粘性层 + markdown 降级解析)。
// 播放: 首选已部署的 javsb-hls Worker 全链 (蜘蛛第六轮定版):
//   Worker 内算签取 raw 列表, 先探 seg=direct 形态 + 首分片 0x47 同步字,
//   不通再用全链代理形态; 都不过回退官方取流 (sign 算法已复现):
//   路 A 算签 raw 直取 -> 路 B token 两步; 全灭返回未找到播放地址。
// 已知特性 (与蜘蛛定版一致, 如实保留): Worker 首播要等中转取列表 (可达
//   10~35s), 成品在 Worker 侧缓存 600s; 首播成功率约五成, 靠重试与缓存兜底。

WidgetMetadata = {
  id: "lai_javsb",
  title: "JAVSB",
  description: "JAVSB（jav.sb）：最近更新/有码/无码/FC2/无码破解/中文字幕等分类，播放走 javsb-hls Worker 全链",
  author: "lai",
  version: "1.0.0",
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
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
var UA_IOS = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
var REFERER = HOST + "/";
var JINA = "https://r.jina.ai/";
var MDNEW = "https://markdown.new/";
var ALLORIGINS = "https://api.allorigins.win/raw?url=";
// 全链代理 Worker (第六轮定版, 已部署)
var JAVSB_WORKER = "https://javsb-hls.li768435813.workers.dev";
var PLAYER_UA = "AppleCoreMedia/1.0.0.20L563 (iPhone; U; CPU OS 17_5 like Mac OS X; zh_cn)";

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

// ---------- 基础传输 (REX 只有 Widget.http.get 一条通道) ----------
async function viaHttp(url, headers, timeoutMs) {
  try {
    var res = await Widget.http.get(url, { headers: headers, timeout: timeoutMs });
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

function desktopHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.7",
    "Referer": referer || REFERER
  };
}

function safariHeaders(referer) {
  return {
    "User-Agent": UA_IOS,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
    "Referer": referer || REFERER
  };
}

function jinaHtmlHeaders() {
  return { "User-Agent": UA, "Accept": "*/*", "x-return-format": "html", "x-respond-with": "html" };
}

// ---------- 抓取层 (与蜘蛛同构; 传输统一为 Widget.http.get) ----------
var LAYERS = {
  jinaHtml: { cap: 8000, run: function (u, ms) { return viaHttp(JINA + u, jinaHtmlHeaders(), ms); } },
  mdNew: { cap: 8000, run: function (u, ms) { return viaHttp(MDNEW + u, { "User-Agent": UA, "Accept": "*/*" }, ms); } },
  allOrigins: { cap: 10000, run: function (u, ms) { return viaHttp(ALLORIGINS + encodeURIComponent(u), { "User-Agent": UA, "Accept": "*/*" }, ms); } },
  jinaMd: { cap: 8000, run: function (u, ms) { return viaHttp(JINA + u, { "User-Agent": UA, "Accept": "*/*" }, ms); } },
  directDesktop: { cap: 6000, run: function (u, ms) { return viaHttp(u, desktopHeaders(), ms); } },
  directSafari: { cap: 5000, run: function (u, ms) { return viaHttp(u, safariHeaders(), ms); } }
};
var LIST_LAYERS = ["jinaHtml", "mdNew", "allOrigins", "jinaMd", "directDesktop", "directSafari"];
var DETAIL_LAYERS = ["jinaHtml", "allOrigins", "directDesktop", "directSafari"];
var TOKEN_LAYERS = ["jinaHtml", "directDesktop"];
var RACE_LAYERS = ["jinaHtml", "mdNew", "allOrigins"];

// ---------- 页面缓存 ----------
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
  if (keys.length > 80) delete pageCache[keys[0]];
}

// ---------- 多层抓取编排 (蜘蛛同构: 粘性层 + 冷启动竞速 + 顺序兜底) ----------
var goodLayers = { page: "", token: "" };

async function tryLayer(name, url, validate, sliceMs) {
  var L = LAYERS[name];
  if (!L || sliceMs < 800) return "";
  try {
    var txt = await L.run(url, sliceMs);
    return (!!txt && validate(txt)) ? txt : "";
  } catch (e) {
    return "";
  }
}

async function fetchVia(url, validate, opts) {
  var o = opts || {};
  var layerNames = (o.layers || LIST_LAYERS).filter(function (n) { return LAYERS[n]; });
  var budget = o.budgetMs || 20000;
  var deadline = Date.now() + budget;
  function capOf(n) { return (o.caps && o.caps[n]) || LAYERS[n].cap; }
  function remain() { return deadline - Date.now(); }
  var ok = typeof validate === "function" ? validate : function (s) { return !!s; };

  if (o.cacheTtl) {
    var cached = cacheGet(url, o.cacheTtl);
    if (cached && ok(cached)) return cached;
  }
  var tried = {};
  var stickyKey = o.stickyKey || "page";
  function succeed(name, txt) {
    goodLayers[stickyKey] = name;
    if (o.cacheTtl) cacheSet(url, txt);
    return txt;
  }

  // 1) 粘性层先行
  var sticky = goodLayers[stickyKey];
  if (sticky && layerNames.indexOf(sticky) >= 0 && remain() > 800) {
    tried[sticky] = 1;
    var txt1 = await tryLayer(sticky, url, ok, Math.min(capOf(sticky), remain()));
    if (txt1) return succeed(sticky, txt1);
  }

  // 2) 冷启动竞速: 中转组同时发; markdown 结果先攒住, 给 HTML 2.5s 宽限
  var racers = RACE_LAYERS.filter(function (n) { return layerNames.indexOf(n) >= 0 && !tried[n]; });
  var mdCapable = layerNames.indexOf("jinaMd") >= 0;
  if (racers.length > 1 && remain() > 1500) {
    racers.forEach(function (n) { tried[n] = 1; });
    var raced = await new Promise(function (resolve) {
      var settled = 0;
      var done = false;
      var mdCand = null;
      var graceTimer = null;
      var timer = setTimeout(function () { finish(mdCand); }, remain());
      function finish(v) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        if (graceTimer) clearTimeout(graceTimer);
        resolve(v);
      }
      racers.forEach(function (n) {
        tryLayer(n, url, ok, Math.min(capOf(n), remain())).then(function (txt) {
          if (done) return;
          if (txt) {
            var cand = { name: n, txt: txt };
            if (!mdCapable || txt.indexOf('<div class="thumbnail group">') >= 0) { finish(cand); return; }
            if (!mdCand) {
              mdCand = cand;
              graceTimer = setTimeout(function () { finish(mdCand); }, 2500);
            }
            settled++;
          } else {
            settled++;
          }
          if (settled >= racers.length) finish(mdCand);
        });
      });
    });
    if (raced) return succeed(raced.name, raced.txt);
  }

  // 3) 其余层按序递进
  for (var i = 0; i < layerNames.length; i++) {
    var n2 = layerNames[i];
    if (tried[n2] || remain() <= 800) continue;
    tried[n2] = 1;
    var txt2 = await tryLayer(n2, url, ok, Math.min(capOf(n2), remain()));
    if (txt2) return succeed(n2, txt2);
  }
  return "";
}

function getListPage(url, validate) {
  return fetchVia(url, validate || isListPage, { layers: LIST_LAYERS, budgetMs: 20000, cacheTtl: TTL_LIST });
}

function getDetailPage(url, budgetMs) {
  return fetchVia(url, isDetailPage, { layers: DETAIL_LAYERS, budgetMs: budgetMs || 20000, cacheTtl: TTL_DETAIL });
}

// ---------- 内容校验 ----------
function isListPage(s) { return countCards(s) > 0; }
function isDetailPage(s) { return typeof s === "string" && (s.indexOf("og:title") >= 0 || s.indexOf("/static/player/") >= 0); }
function isSearchPage(s) { return countCards(s) > 0 || (typeof s === "string" && s.length > 3000 && s.indexOf("javtype") >= 0); }
function isMdPage(s) { return typeof s === "string" && s.indexOf("Title: ") >= 0 && s.indexOf("Markdown Content:") >= 0; }

function mdTitle(md) {
  var m = String(md || "").match(/^Title:\s*(.+)$/m);
  if (!m) return "";
  return clean(m[1]).replace(/\s*[-|–—]\s*JAVSB\s*$/i, "").trim();
}

function parseJsonLoose(s) {
  if (!s) return null;
  try { return JSON.parse(s); } catch (e) {}
  var m = String(s).match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch (e) {} }
  return null;
}

// ---------- 列表解析 (HTML + markdown 双形态, 蜘蛛同构) ----------
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
    return {
      id: v.vod_id,
      type: "url",
      title: v.vod_name,
      posterPath: v.vod_pic || "",
      coverUrl: v.vod_pic || "",
      backdropPath: v.vod_pic || "",
      link: v.vod_id,
      description: v.vod_remarks || "",
      mediaType: "movie"
    };
  });
}

// ---------- 官方取流 (sign 算法, 蜘蛛第五轮复现, 逐字移植) ----------
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

async function tryOfficialStream(hash, deadline) {
  function budget(cap) { return Math.max(300, Math.min(cap, deadline - Date.now())); }
  if (Date.now() >= deadline) return "";
  var key = javsbSign(hash + "@" + Math.floor(Date.now() / 1000));
  function isPl(s) { return typeof s === "string" && s.indexOf("#EXTM3U") >= 0; }
  // 路 A: raw 形态一步取列表地址, 经抓取栈校验真实可用后返回地址本身
  var rawUrl = HOST + "/save_m3u8_cache.php?file=" + encodeURIComponent(hash) + "&raw=1&sign=" + key;
  try {
    var txt = await fetchVia(rawUrl, isPl, {
      layers: ["directSafari", "directDesktop", "jinaHtml"],
      budgetMs: Math.max(600, Math.min(4500, deadline - Date.now())), stickyKey: "token",
      caps: { directSafari: budget(2500), directDesktop: budget(2000), jinaHtml: budget(1500) }
    });
    if (txt) return rawUrl;
  } catch (e) {}
  if (Date.now() >= deadline - 1200) return "";
  // 路 B: token -> save -> m3u8_file
  function hasToken(s) { var j = parseJsonLoose(s); return !!(j && j.token); }
  function hasFile(s) { var j = parseJsonLoose(s); return !!(j && j.m3u8_file); }
  var token = "", ts = "";
  try {
    var txt2 = await fetchVia(HOST + "/token.php?file=" + encodeURIComponent(hash), hasToken, {
      layers: TOKEN_LAYERS.concat(["directSafari"]), budgetMs: Math.max(600, deadline - Date.now()), stickyKey: "token",
      caps: { jinaHtml: budget(2000), directDesktop: budget(1500), directSafari: budget(1200) }
    });
    var j = parseJsonLoose(txt2);
    token = t(j && j.token); ts = t(j && j.ts);
  } catch (e) {}
  if (!token || Date.now() >= deadline) return "";
  try {
    var url = HOST + "/save_m3u8_cache.php?file=" + encodeURIComponent(hash) + "&token=" + encodeURIComponent(token) + "&ts=" + encodeURIComponent(ts) + "&sign=" + key;
    var txt3 = await fetchVia(url, hasFile, {
      layers: TOKEN_LAYERS.concat(["directSafari"]), budgetMs: Math.max(600, deadline - Date.now()), stickyKey: "token",
      caps: { jinaHtml: budget(2000), directDesktop: budget(1500), directSafari: budget(1200) }
    });
    var j2 = parseJsonLoose(txt3);
    var f = t(j2 && j2.m3u8_file);
    if (f && /m3u8/i.test(f)) return absUrl(f) + (f.indexOf("sign=") >= 0 ? "" : "&sign=" + key);
  } catch (e) {}
  return "";
}

// ---------- Worker 取流 (第六轮首选, 逻辑同构移植) ----------
function firstByteIs47(data) {
  if (data == null) return false;
  if (typeof data === "string") return data.charCodeAt(0) === 0x47;
  if (typeof data === "object" && typeof data.length === "number" && data.length > 0) return data[0] === 0x47;
  return false;
}

async function probeSegment(segUrl, timeoutMs) {
  if (!segUrl || timeoutMs < 800) return false;
  try {
    var res = await Widget.http.get(segUrl, {
      headers: { "User-Agent": PLAYER_UA, "Range": "bytes=0-1023", "Accept": "*/*" },
      timeout: timeoutMs
    });
    return !!res && firstByteIs47(res.data);
  } catch (e) { return false; }
}

async function tryWorkerStream(hash, wDeadline) {
  if (!JAVSB_WORKER || Date.now() >= wDeadline) return "";
  function isPl(s) { return typeof s === "string" && s.indexOf("#EXTM3U") >= 0; }
  function cap(want) { return Math.max(800, Math.min(want, wDeadline - Date.now())); }
  async function getPl(u) {
    var txt = await viaHttp(u, { "User-Agent": UA, "Accept": "*/*" }, cap(44000));
    if (txt && isPl(txt)) return txt;
    return "";
  }
  var directUrl = JAVSB_WORKER + "/v?hash=" + encodeURIComponent(hash) + "&seg=direct";
  var proxyUrl = JAVSB_WORKER + "/v?hash=" + encodeURIComponent(hash);
  var pl = await getPl(directUrl);
  if (pl) {
    var lines = pl.split("\n");
    var seg = "";
    for (var i = 0; i < lines.length; i++) {
      var s = lines[i].trim();
      if (s && s.charAt(0) !== "#") { seg = s; break; }
    }
    if (seg && (await probeSegment(seg, cap(5000)))) return directUrl;
    if (wDeadline - Date.now() < 3000) return proxyUrl;
    var pl2 = await getPl(proxyUrl);
    return pl2 ? proxyUrl : "";
  }
  if (Date.now() >= wDeadline) return "";
  var pl3 = await getPl(proxyUrl);
  return pl3 ? proxyUrl : "";
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

// ---------- 接口 ----------
async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var tid = t(params.path || params.cat || "new");
  var cat = CATS[0];
  for (var i = 0; i < CATS.length; i++) { if (CATS[i].type_id === tid) { cat = CATS[i]; break; } }
  try {
    var html = await getListPage(catUrl(cat, page));
    if (!html) return [{ id: "err", type: "url", title: "载入失败: 所有抓取通道均未取到列表", description: "jav.sb 拦截较严, 请稍后重试" }];
    var cards = toCards(parseCards(html));
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

async function loadDetail(link) {
  var durl = t(link);
  if (!durl) return { id: "err", type: "url", title: "参数错误", description: "未找到播放地址" };
  durl = /^https?:\/\//.test(durl) ? durl : absUrl(durl);
  var deadline = Date.now() + 55000;
  function remain() { return Math.max(400, deadline - Date.now()); }
  try {
    var html = await getDetailPage(durl, Math.min(20000, remain()));
    if (!html) {
      // 降级: 转读 markdown 只取标题, 播放无路 (REX 无嗅探), 如实报未找到
      var md = await fetchVia(durl, isMdPage, { layers: ["jinaMd", "mdNew"], budgetMs: 8000 });
      var name0 = md ? mdTitle(md) : "";
      return { id: durl, type: "url", title: name0 || "解析失败", description: "未找到播放地址" };
    }
    var name = og(html, "title");
    var pic = og(html, "image");
    var desc = og(html, "description");
    var player = extractPlayer(html);
    var videoUrl = "";
    if (player.hash) {
      videoUrl = await tryWorkerStream(player.hash, deadline - 8000);
      if (!videoUrl) videoUrl = await tryOfficialStream(player.hash, deadline);
    }
    if (!videoUrl) {
      return {
        id: durl, type: "url",
        title: name || "解析失败",
        posterPath: pic, coverUrl: pic, backdropPath: pic,
        link: durl,
        description: "未找到播放地址" + (desc ? " | " + desc : "")
      };
    }
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
      customHeaders: { "User-Agent": UA, "Referer": REFERER }
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
    var html = await getListPage(url, isSearchPage);
    if (!html) return [{ id: "empty", type: "url", title: "没有找到相关影片" }];
    var cards = toCards(parseCards(html));
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}
