// JavXXX for REX (lai_javxxx v1.0.0)
// 移植自 mira-cat 蜘蛛 javxxx.js（只读蓝图），站 https://www.javxxx.me/。
// 播放链与猫源 v19 同款（不发明新链）：token（live/tid，每部片稳定，tid 为
// 6 位数字）-> Worker /resolve2（手机供 token，Worker 只做 /api/play/ POST +
// embed 取页）与 /resolve（Worker 内全链）并行竞速，先出 master 者赢；
// 分片是 PNG 包裹的 TS，必须走 Worker /s 剥头（/resolve 回的已是 /h 包过的
// master，变体/分片走 /s）。streamhls 单档 720p，无 1080p，不编造。
// 列表走 Worker /j/list（JSON），jina HTML 作兜底；详情 token 走 Worker
// /j/detail 或 jina 详情页（jina 只 GET，不发 POST）。
// 注意：猫源 v19 在设备上仍无档位、无法播放——本模块按同一链写，VM 侧直连
// javxxx.me 全死（curl 亦死），只验 Worker/jina 腿；设备结论以用户真机为准。

WidgetMetadata = {
  id: "lai_javxxx",
  title: "JavXXX",
  description: "JavXXX：最新/有码/无码/无码流出/破解/中字/英字/印尼字幕/素人/FC2，Worker 解析单档 720p",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://www.javxxx.me",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "censored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "uncensored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "无码流出", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "uncensored-leaked" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "破解", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "decensored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "中字", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "chinese-subtitle" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "英字", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "english-subtitle" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "印尼字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "subtitle-indonesia" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "amateur" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "FC2", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "fc2-ppv" }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://www.javxxx.me";
var FETCH_WORKER = "https://javxxx-fetch.li768435813.workers.dev";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

// 分类到站内 vXX 地址（导航原样）
var VPATH = {
  "censored": "v35", "uncensored": "v9", "uncensored-leaked": "v10",
  "decensored": "v17", "chinese-subtitle": "v21", "english-subtitle": "v18",
  "subtitle-indonesia": "v7", "amateur": "v31", "fc2-ppv": "v36"
};

function t(v) {
  return String(v == null ? "" : v).trim();
}

function cleanText(s) {
  return String(s || "").replace(/&amp;/g, "&").replace(/&#0?39;/g, "'").replace(/&#8211;/g, "-")
    .replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}

// 纯 JS base64url（REX 沙箱无 Buffer/btoa；照抄 javhey）
var B64CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function utf8Bytes(s) {
  var bytes = [];
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    if (c < 128) {
      bytes.push(c);
    } else if (c < 2048) {
      bytes.push(192 | (c >> 6), 128 | (c & 63));
    } else if (c >= 55296 && c < 57344 && i + 1 < s.length) {
      var c2 = s.charCodeAt(i + 1);
      if (c2 >= 56320 && c2 < 57344) {
        var cp = 65536 + ((c - 55296) << 10) + (c2 - 56320);
        bytes.push(240 | (cp >> 18), 128 | ((cp >> 12) & 63), 128 | ((cp >> 6) & 63), 128 | (cp & 63));
        i++;
      } else {
        bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
      }
    } else {
      bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
    }
  }
  return bytes;
}
function b64url(str) {
  var bytes = utf8Bytes(String(str));
  var out = "";
  for (var i = 0; i < bytes.length; i += 3) {
    var b0 = bytes[i];
    var b1 = (i + 1 < bytes.length) ? bytes[i + 1] : 0;
    var b2 = (i + 2 < bytes.length) ? bytes[i + 2] : 0;
    out += B64CHARS.charAt(b0 >> 2);
    out += B64CHARS.charAt(((b0 & 3) << 4) | (b1 >> 4));
    out += (i + 1 < bytes.length) ? B64CHARS.charAt(((b1 & 15) << 2) | (b2 >> 6)) : "=";
    out += (i + 2 < bytes.length) ? B64CHARS.charAt(b2 & 63) : "=";
  }
  return out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function b64urlDecode(str) {
  var s = String(str || "").replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  var chars = B64CHARS;
  var out = "";
  var i = 0;
  while (i < s.length) {
    var c1 = chars.indexOf(s.charAt(i++));
    var c2 = chars.indexOf(s.charAt(i++));
    var c3 = chars.indexOf(s.charAt(i++));
    var c4 = chars.indexOf(s.charAt(i++));
    if (c1 < 0 || c2 < 0) break;
    var n = (c1 << 18) | (c2 << 12) | ((c3 & 63) << 6) | (c4 & 63);
    out += String.fromCharCode((n >> 16) & 255);
    if (c3 !== 64 && c3 >= 0) out += String.fromCharCode((n >> 8) & 255);
    if (c4 !== 64 && c4 >= 0) out += String.fromCharCode(n & 255);
  }
  return out;
}

function headers(referer) {
  return {
    "User-Agent": UA,
    "Referer": referer || (HOST + "/"),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1"
  };
}

function bodyText(res) {
  if (!res || res.data == null) return "";
  return typeof res.data === "string" ? res.data : JSON.stringify(res.data);
}

async function getText(url, hdrs) {
  try {
    var res = await Widget.http.get(url, { headers: hdrs || headers() });
    return { status: (res && res.status) || 0, body: bodyText(res) };
  } catch (e) { return { status: 0, body: "" }; }
}

// Cloudflare 托管质询页特征：命中即算该腿失败
function isChallengePage(body) {
  var s = String(body || "");
  return !s || s.length < 800 || s.indexOf("Just a moment") >= 0 ||
    s.indexOf("Attention Required") >= 0 || s.indexOf("cf-challenge") >= 0 ||
    s.indexOf("challenges.cloudflare.com") >= 0;
}

// 首个非空结果赢（REX 无 setTimeout，用结算计数代替定时）
function firstSuccess(promises) {
  return new Promise(function (resolve) {
    var done = false, settled = 0, n = promises.length;
    if (!n) { resolve(null); return; }
    promises.forEach(function (p) {
      p.then(function (v) {
        if (done) return;
        if (v) { done = true; resolve(v); }
        else { settled++; if (settled >= n) { done = true; resolve(null); } }
      }, function () {
        settled++;
        if (!done && settled >= n) { done = true; resolve(null); }
      });
    });
  });
}

// Worker JSON 接口：只认 {ok:true}
async function getJson(url) {
  try {
    var r = await getText(url);
    if (!r || r.status !== 200) return null;
    var obj = null;
    try { obj = JSON.parse(r.body); } catch (e) { return null; }
    if (!obj || obj.ok !== true) return null;
    return obj;
  } catch (e) { return null; }
}

function viaJsonList(url) { return FETCH_WORKER + "/j/list/" + b64url(url); }
function viaJsonDetail(url) { return FETCH_WORKER + "/j/detail/" + b64url(url); }

function filterJsonList(arr) {
  if (!Array.isArray(arr)) return [];
  var out = [];
  var seen = {};
  for (var i = 0; i < arr.length; i++) {
    var it = arr[i] || {};
    var id = String(it.vod_id || "");
    var name = String(it.vod_name || "").trim();
    if (!/^https:\/\/www\.javxxx\.me\/video\/[^\/]+\/?$/.test(id)) continue;
    if (!name || /\.(jpg|jpeg|png|gif|webp|svg)(\?|#|$)/i.test(name)) continue;
    if (seen[id]) continue;
    seen[id] = 1;
    var pic = String(it.vod_pic || "");
    if (/^data:/i.test(pic) || /\/404\.png$/i.test(pic)) pic = "";
    out.push({ vod_id: id, vod_name: name.substring(0, 120) || "未知", vod_pic: pic, vod_remarks: String(it.vod_remarks || "") });
  }
  return out;
}

// 列表 HTML 解析（与 Worker v4 的 parseListHtml 同款逻辑）
function parseListHtml(html) {
  var out = [];
  var seen = {};
  var push = function (id, name, pic, remarks) {
    id = String(id || "").trim();
    if (!/^https:\/\/www\.javxxx\.me\/video\/[^\/]+\/?$/.test(id)) return;
    name = cleanText(name || "").substring(0, 120);
    if (!name || /\.(jpg|jpeg|png|gif|webp|svg)(\?|#|$)/i.test(name)) return;
    if (seen[id]) return;
    seen[id] = 1;
    pic = String(pic || "");
    if (/^data:/i.test(pic) || /\/404\.png$/i.test(pic)) pic = "";
    out.push({ vod_id: id, vod_name: name, vod_pic: pic, vod_remarks: String(remarks || "") });
  };
  var reA = /<a[^>]+href="(https?:\/\/www\.javxxx\.me\/video\/[^"\/]+\/?|\/video\/[^"\/]+\/?)"[^>]*>/gi;
  var m;
  while ((m = reA.exec(html)) && out.length < 40) {
    var href = m[1];
    var id = href.indexOf("http") === 0 ? href : HOST + href;
    var tag = m[0];
    var seg = html.slice(m.index, Math.min(html.length, m.index + 4000));
    var name = "";
    var tm = tag.match(/title="([^"]*)"/i);
    if (tm) name = tm[1];
    if (!name) {
      var endA = seg.search(/<\/a>/i);
      var innerHtml = endA >= 0 ? seg.slice(tag.length, endA) : "";
      name = cleanText(innerHtml);
    }
    var pic = "";
    var pm = seg.match(/data-lazy-src="(https?:[^"]+)"/i);
    if (pm) pic = pm[1];
    if (!pic) {
      var sm = seg.match(/<img[^>]+src="(https?:[^"]+)"/i);
      if (sm) pic = sm[1];
    }
    var remarks = "";
    var dm = seg.match(/(\d{1,2}:\d{2}:\d{2})/);
    if (dm) remarks = dm[1];
    push(id, name, pic, remarks);
  }
  if (out.length >= 3) return out;
  var reMd = /\[([^\]\n]{3,150})\]\((https:\/\/www\.javxxx\.me\/video\/[^)\s"]+\/?)(?:\s+"[^"]*")?\)/g;
  var mm;
  while ((mm = reMd.exec(html)) && out.length < 40) {
    push(mm[2], mm[1], "", "");
  }
  return out;
}

// jina 列表腿：r.jina.ai 回完整 HTML（x-respond-with: html），不受 Worker 上游挑战影响
async function getJinaList(url, minN) {
  var min = minN || 3;
  var jinaUrl = "https://r.jina.ai/" + url;
  var hdrs = { "User-Agent": UA, "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "x-respond-with": "html" };
  try {
    var r = await getText(jinaUrl, hdrs);
    if (!r || r.status !== 200) return [];
    if (!r.body || isChallengePage(r.body)) return [];
    var list = parseListHtml(r.body);
    return list.length >= min ? list : [];
  } catch (e) { return []; }
}

// 列表取数：Worker /j/list -> jina HTML -> Worker 再一发；任一段出 >=3 条即返回
async function getJsonList(url, minN) {
  var min = minN || 3;
  var obj = await getJson(viaJsonList(url));
  var list = filterJsonList(obj && obj.list);
  if (list.length >= min) return list;
  var jinaList = await getJinaList(url, min);
  if (jinaList.length >= min) return jinaList;
  var obj2 = await getJson(viaJsonList(url));
  var list2 = filterJsonList(obj2 && obj2.list);
  if (list2.length >= min) return list2;
  return list.length ? list : (jinaList.length ? jinaList : list2);
}

function toCard(v) {
  return {
    id: v.vod_id,
    type: "url",
    title: v.vod_name,
    posterPath: v.vod_pic,
    coverUrl: v.vod_pic,
    backdropPath: v.vod_pic,
    link: v.vod_id,
    description: v.vod_remarks || "",
    mediaType: "movie"
  };
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function listUrl(zone, page) {
  if (zone === "home") return HOST + "/";
  var v = VPATH[zone] || "";
  if (page > 1) return HOST + "/category/" + zone + "/page/" + page + "/";
  return HOST + "/" + v + "/category/" + zone + "/";
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || params.path || params.cat || "home");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    // 首页无翻页：站内首页无 pagination，/page/N/ 实测回第一页内容
    if (zone === "home" && page > 1) return emptyItem("首页只有一页");
    var url = listUrl(zone, page);
    var list = await getJsonList(url);
    if (!list.length) return emptyItem();
    return list.map(toCard);
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

async function search(params) {
  params = params || {};
  var wd = t(params.keyword || params.wd || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return emptyItem("请输入关键词");
  try {
    var url = page > 1
      ? HOST + "/search/" + encodeURIComponent(wd) + "/page/" + page + "/"
      : HOST + "/search/" + encodeURIComponent(wd) + "/";
    var list = await getJsonList(url, 1);
    if (!list.length) return emptyItem();
    return list.map(toCard);
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

// ---------- 详情 / token ----------
// 从详情页 HTML 抽名/图/简介/live/tid（Worker /j/detail 与 jina 详情页共用同一解析）
function parseDetailHtml(html) {
  var out = { name: "", pic: "", desc: "", live: "", tid: "" };
  var s = String(html || "");
  if (!s) return out;
  var tm = s.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i)
    || s.match(/<title>([\s\S]*?)<\/title>/i);
  if (tm) out.name = cleanText(tm[1]).replace(/\s*-\s*JAVXXX\.Me\s*$/i, "").substring(0, 120);
  var pm = s.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
  if (pm) out.pic = pm[1];
  var dm = s.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i);
  if (dm) out.desc = cleanText(dm[1]);
  out.live = (s.match(/data-ts-live="([^"]+)"/) || [])[1] || "";
  out.tid = (s.match(/data-ts-id="([^"]+)"/) || [])[1] || "";
  return out;
}

// 详情 JSON：{name, pic, desc, live, tid}
async function getJsonDetail(url) {
  var obj = await getJson(viaJsonDetail(url));
  if (!obj) return null;
  return { name: String(obj.name || ""), pic: String(obj.pic || ""), desc: String(obj.desc || ""), live: String(obj.live || ""), tid: String(obj.tid || "") };
}

async function getJinaDetail(vid) {
  var jinaUrl = "https://r.jina.ai/" + vid;
  var hdrs = { "User-Agent": UA, "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "x-respond-with": "html" };
  try {
    var r = await getText(jinaUrl, hdrs);
    if (!r || r.status !== 200) return null;
    if (!r.body || isChallengePage(r.body)) return null;
    var p = parseDetailHtml(r.body);
    if (p.name || p.live) return p;
    return null;
  } catch (e) { return null; }
}

// token 双腿竞速：Worker /j/detail 与 jina 详情页，先拿到 live/tid 者赢
async function getToken(vid) {
  var won = await firstSuccess([
    getJsonDetail(vid).then(function (jd) { return (jd && jd.live && jd.tid) ? { live: jd.live, tid: jd.tid, via: "worker", name: jd.name, pic: jd.pic, desc: jd.desc } : null; }),
    getJinaDetail(vid).then(function (jt) { return (jt && jt.live && jt.tid) ? { live: jt.live, tid: jt.tid, via: "jina", name: jt.name, pic: jt.pic, desc: jt.desc } : null; })
  ]);
  return won || { live: "", tid: "", via: "" };
}

// 详情基础信息（名/图/简介）：Worker /j/detail 优先，jina 兜底
async function getBase(vid) {
  var jd = await getJsonDetail(vid);
  if (jd && (jd.name || jd.pic)) return jd;
  var jt = await getJinaDetail(vid);
  if (jt) return jt;
  return { name: "", pic: "", desc: "", live: "", tid: "" };
}

// ---------- 解析 ----------
// /resolve 与 /resolve2 回包：{ok:true, url, kind, expires}
function parseResolveObj(data) {
  var obj = null;
  if (typeof data === "string") {
    try { obj = JSON.parse(data); } catch (e) { return null; }
  } else if (data && typeof data === "object") obj = data;
  else return null;
  if (!obj || obj.ok !== true || !obj.url) return null;
  return { url: String(obj.url), kind: String(obj.kind || ""), expires: String(obj.expires || "") };
}

async function getResolve(detailUrl) {
  try {
    var r = await getText(FETCH_WORKER + "/resolve?u=" + encodeURIComponent(detailUrl));
    if (!r || r.status !== 200) return null;
    return parseResolveObj(r.body);
  } catch (e) { return null; }
}

async function getResolve2(live, tid, detailUrl) {
  try {
    var target = FETCH_WORKER + "/resolve2?u=" + encodeURIComponent(detailUrl)
      + "&live=" + encodeURIComponent(live) + "&tid=" + encodeURIComponent(tid);
    var r = await getText(target);
    if (!r || r.status !== 200) return null;
    return parseResolveObj(r.body);
  } catch (e) { return null; }
}

// master 地址的真实宿主：/h 地址解 u 参数，其余取自身 host
function masterHostOf(masterHUrl) {
  var u = String(masterHUrl || "");
  try {
    if (/\/h\?u=/.test(u)) {
      var m = u.match(/[?&]u=([^&]+)/);
      if (m) {
        var real = b64urlDecode(decodeURIComponent(m[1]));
        if (real) return new URL(real).hostname.toLowerCase();
      }
    }
    return new URL(u).hostname.toLowerCase();
  } catch (e) { return ""; }
}

// 主清单变体解析（非 streamhls 宿主时现取 master 文本）
function parseHlsVariants(txt, baseUrl) {
  var vs = [];
  if (!txt || txt.indexOf("#EXT-X-STREAM-INF") < 0) return vs;
  var lines = String(txt).split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.indexOf("#EXT-X-STREAM-INF") !== 0) continue;
    var uri = "";
    for (var j = i + 1; j < lines.length; j++) {
      if (lines[j].trim()) { uri = lines[j].trim(); break; }
    }
    if (!uri) continue;
    var rm = line.match(/RESOLUTION=(\d+)x(\d+)/i);
    var bm = line.match(/BANDWIDTH=(\d+)/i);
    var h = rm ? parseInt(rm[2], 10) : 0;
    if (!h) continue;
    var abs = "";
    if (/^https?:\/\//i.test(uri)) abs = uri;
    else {
      try { abs = new URL(uri, baseUrl).toString(); } catch (e) { continue; }
    }
    vs.push({ h: h, bw: bm ? parseInt(bm[1], 10) : 0, url: abs });
  }
  var byH = {};
  for (var k = 0; k < vs.length; k++) {
    var v = vs[k];
    var cur = byH[v.h];
    if (!cur || v.bw > cur.bw) byH[v.h] = v;
  }
  var out = [];
  for (var key in byH) out.push(byH[key]);
  out.sort(function (a, b) { return b.h - a.h || b.bw - a.bw; });
  return out;
}

// 拿到 master 地址即出档位：streamhls 单档 720p（变体地址即 master 本身）；
// 其余宿主取 master 文本解析作回落。裸 streamhls .m3u8 包一层 Worker /h。
function wrapHls(url) {
  if (!url) return url;
  if (/\/h\?u=/.test(url)) return url;
  try {
    var host = new URL(url).hostname.toLowerCase();
    if (host === "streamhls.click" && /\.m3u8(\?|#|$)/i.test(url)) {
      return FETCH_WORKER + "/h?u=" + b64url(url);
    }
  } catch (e) {}
  return url;
}

async function entryFromMasterUrl(masterHUrl) {
  if (!masterHUrl) return null;
  var host = masterHostOf(masterHUrl);
  if (host === "streamhls.click") {
    return { masterHUrl: masterHUrl, variants: [{ h: 720, url: masterHUrl }] };
  }
  try {
    var r = await getText(masterHUrl);
    if (!r || r.status !== 200) return null;
    var vs = parseHlsVariants(r.body, masterHUrl);
    if (!vs.length) return null;
    return { masterHUrl: masterHUrl, variants: vs };
  } catch (e) { return null; }
}

// master 缓存（5 分钟；token 每部片稳定，master 地址短期内可复用）
var masterCache = {};
function masterCacheGet(vid) {
  var hit = masterCache[vid];
  if (hit && Date.now() - hit.at < 300000) return hit.entry;
  return null;
}
function masterCacheSet(vid, entry) {
  masterCache[vid] = { entry: entry, at: Date.now() };
}

// 解析竞速：/resolve2（有 token）与 /resolve 并行，先出 master 者赢
async function resolveRace(vid, live, tid) {
  var jobs = [];
  if (live && tid) {
    jobs.push((async function () {
      var rv2 = await getResolve2(live, tid, vid);
      if (!rv2 || !rv2.url) return null;
      if (rv2.kind !== "hls" && !/\.m3u8(\?|#|$)/i.test(rv2.url)) return null;
      return await entryFromMasterUrl(wrapHls(rv2.url));
    })());
  }
  jobs.push((async function () {
    var rv = await getResolve(vid);
    if (!rv || !rv.url) return null;
    if (rv.kind !== "hls" && !/\.m3u8(\?|#|$)/i.test(rv.url)) return null;
    return await entryFromMasterUrl(wrapHls(rv.url));
  })());
  return await firstSuccess(jobs);
}

async function resolveMaster(vid, live, tid) {
  var cached = masterCacheGet(vid);
  if (cached) return cached;
  var entry = await resolveRace(vid, live, tid);
  // 一次重试：Worker 出口 colo 按请求翻转（实测 403 后数秒即 ok），
  // 同一链内再跑一轮竞速，不换腿、不发明新链。
  if (!entry) entry = await resolveRace(vid, live, tid);
  if (entry) masterCacheSet(vid, entry);
  return entry;
}

async function loadDetail(link) {
  try {
    var vid = unwrapLink(link);
    if (!vid) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    if (vid.indexOf("http") !== 0) vid = HOST + vid;
    // 基础信息与 token 并行起跑
    var baseP = getBase(vid);
    var tokenP = getToken(vid);
    var tk = await tokenP;
    var live = tk.live || "";
    var tid = tk.tid || "";
    var base = await baseP;
    // 档位发现：/resolve2 + /resolve 竞速
    var entry = await resolveMaster(vid, live, tid);
    var name = base.name || "";
    var pic = base.pic || "";
    var desc = base.desc || "";
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    if (entry && entry.variants && entry.variants.length) {
      for (var i = 0; i < entry.variants.length; i++) {
        var v = entry.variants[i];
        var label = v.h + "p";
        var lid = "@@X:" + vid + "|" + v.h;
        eps.push({ name: label, link: lid });
        seasonEps.push({ title: label, episodeNumber: i + 1 });
        epItems.push({
          id: lid,
          type: "url",
          title: label,
          mediaType: "movie",
          posterPath: pic,
          link: lid,
          episode: i + 1,
          episodeNumber: i + 1,
          seasonIndex: 1,
          seasonNumber: 1
        });
      }
    } else {
      // 取不到变体：回单条“播放”，点播时 loadResource 再解一次（猫源 v11 同款）
      var lid0 = "@@X:" + vid;
      eps.push({ name: "播放", link: lid0 });
      seasonEps.push({ title: "播放", episodeNumber: 1 });
      epItems.push({
        id: lid0,
        type: "url",
        title: "播放",
        mediaType: "movie",
        posterPath: pic,
        link: lid0,
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1
      });
    }
    var result = {
      id: vid,
      type: "detail",
      title: name || "JavXXX",
      name: name || "JavXXX",
      description: desc || (entry ? "单档 720p" : ""),
      mediaType: "movie",
      link: vid,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app",
      episodes: eps,
      seasons: [{ seasonNumber: 1, title: "清晰度", name: "清晰度", episodes: seasonEps }],
      episodeItems: epItems,
      childItems: epItems
    };
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

function pickVariant(entry, wantH) {
  if (!entry || !entry.variants || !entry.variants.length) return null;
  if (!wantH) return entry.variants[0];
  for (var i = 0; i < entry.variants.length; i++) {
    if (entry.variants[i].h === wantH) return entry.variants[i];
  }
  var lower = null;
  for (var j = 0; j < entry.variants.length; j++) {
    if (entry.variants[j].h < wantH && (!lower || entry.variants[j].h > lower.h)) lower = entry.variants[j];
  }
  return lower || entry.variants[0];
}

async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 懒解析入口：@@X:<vid>[|<h>]
  var at = raw.indexOf("@@X:");
  if (at < 0) {
    if (/\.m3u8(\?|#|$)/i.test(raw) || /\.mp4(\?|#|$)/i.test(raw)) {
      return [{ name: "播放", url: wrapHls(raw), playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
    return [];
  }
  var body = raw.slice(at + 4);
  var parts = body.split("|");
  var vid = parts[0] || "";
  var wantH = parts[1] ? parseInt(parts[1], 10) || 0 : 0;
  if (!vid) return [];
  if (vid.indexOf("http") !== 0) vid = HOST + vid;
  var entry = masterCacheGet(vid);
  if (!entry) {
    var tk = await getToken(vid);
    entry = await resolveMaster(vid, tk.live || "", tk.tid || "");
  }
  if (!entry || !entry.variants || !entry.variants.length) return [];
  var hdrs = { "User-Agent": UA, "Referer": HOST + "/" };
  if (wantH > 0) {
    var pick = pickVariant(entry, wantH);
    if (!pick) return [];
    return [{ name: pick.h + "p", url: pick.url, playerType: "system", customHeaders: hdrs }];
  }
  var rows = [];
  for (var i = 0; i < entry.variants.length; i++) {
    rows.push({ name: entry.variants[i].h + "p", url: entry.variants[i].url, playerType: "system", customHeaders: hdrs });
  }
  return rows;
}
