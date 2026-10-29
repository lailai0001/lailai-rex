// JavNeon for REX (lai_javneon v1.0.0)
// 蓝图：mira-cat 蜘蛛 javneon.js（py_javneon，v5.1 + 深分页），后端 https://javneon.tv/。
// 列表：14 分类先读 mira-cat 仓库静态镜像（mirror/javneon/<slug>.json，ghfast 优先、
// raw 兜底），每页 24 条；页数超出镜像时走 javsb-relay /jn 深页实时抓。
// 详情：先读 lookup.json 定位分类、只取一个分类文件拿按钮串跑播放链；
// 无命中则抓详情页（直连无按钮时走 /jn）再跑链。详情回分集流 episodes，
// 每集 link 即已解出的 m3u8 直链（VAS/EVS 档位全保留，播放时可手动切换清晰度）。
// 播放链（照搬蜘蛛）：详情页 .btn-server data-link（十六进制串，首个为 active，
// 正则须容 active 后缀）→ lk1（带详情页 Referer，Location 头优先、已跟随正文兜底）
// → 嵌套页；VAS 优先、EVS 兜底，集齐两者即停；VAS 走 /api/stream（body 必须含
// codecs: []，传 ["h264"] 会失败）→ master 现拆三档；EVS 走 Dean Edwards 解包
// （纯字符串逻辑）→ hls2 master（尽量拆档，拆不开回落单线）。
// 播放头一律 Mac Chrome UA + Referer: https://javneon.tv/。
// 注意：本模块不挂载字幕；不做二进制解码；失败回 {type: "url", description}。

WidgetMetadata = {
  id: "lai_javneon",
  title: "JavNeon",
  description: "JavNeon：日系 AV，有修正、無修正、素人、中文字幕、破解马赛克、英文字幕、人气、巨乳、中出、单人作品、人妻、美少女、S1、大屁股 14 分类，深页直达，VAS/EVS 多清晰度",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://javneon.tv/",
  detailCacheDuration: 180,
  modules: [
    { title: "有修正", functionName: "loadList", cacheDuration: 180, params: [{ name: "path", title: "分类", type: "constant", value: "censored-jav" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "無修正", functionName: "loadList", cacheDuration: 180, params: [{ name: "path", title: "分类", type: "constant", value: "uncensored-jav" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [{ name: "path", title: "分类", type: "constant", value: "amateur" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "中文字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "path", title: "分类", type: "constant", value: "chinese-subtitles" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "破解马赛克", functionName: "loadList", cacheDuration: 180, params: [{ name: "path", title: "分类", type: "constant", value: "reducing-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "英文字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "path", title: "分类", type: "constant", value: "english-subtitles" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "人气", functionName: "loadList", cacheDuration: 180, params: [{ name: "path", title: "分类", type: "constant", value: "popular" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [{ name: "path", title: "分类", type: "constant", value: "tag-big-tits" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "中出", functionName: "loadList", cacheDuration: 180, params: [{ name: "path", title: "分类", type: "constant", value: "tag-creampie" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "单人作品", functionName: "loadList", cacheDuration: 180, params: [{ name: "path", title: "分类", type: "constant", value: "tag-solowork" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [{ name: "path", title: "分类", type: "constant", value: "tag-married-woman" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "美少女", functionName: "loadList", cacheDuration: 180, params: [{ name: "path", title: "分类", type: "constant", value: "tag-beautiful-girl" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "S1", functionName: "loadList", cacheDuration: 180, params: [{ name: "path", title: "分类", type: "constant", value: "maker-s1-no-1-style" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "大屁股", functionName: "loadList", cacheDuration: 180, params: [{ name: "path", title: "分类", type: "constant", value: "tag-huge-butt" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { id: "loadResource", title: "JavNeon播放源", description: "播放时透传详情已解出的 m3u8 直链", functionName: "loadResource", type: "stream", cacheDuration: 0, params: [] }
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

var JN_HOST = "https://javneon.tv/";
var JN_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
var JN_PLAY_HEADERS = { "User-Agent": JN_UA, "Referer": "https://javneon.tv/" };
var JN_RELAY = "https://javsb-relay-production.up.railway.app/jn";
var JN_MIRROR_BASES = [
  "https://ghfast.top/https://raw.githubusercontent.com/lailai0001/mira-cat/refs/heads/main/mirror/javneon/",
  "https://raw.githubusercontent.com/lailai0001/mira-cat/refs/heads/main/mirror/javneon/"
];
// 深页直连路径映射（仅直连回落时用；镜像文件统一用 key 名）
var JN_CAT_PATHS = {
  "tag-big-tits": "tag/big-tits", "tag-creampie": "tag/creampie",
  "tag-solowork": "tag/solowork", "tag-married-woman": "tag/married-woman",
  "tag-beautiful-girl": "tag/beautiful-girl", "maker-s1-no-1-style": "maker/s1-no-1-style",
  "tag-huge-butt": "tag/huge-butt"
};

function jnPageHeaders(referer) {
  return {
    "User-Agent": JN_UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": referer || JN_HOST
  };
}

function jnLowerHeaders(h) {
  var out = {};
  if (!h || typeof h !== "object") return out;
  var keys = Object.keys(h);
  for (var i = 0; i < keys.length; i++) {
    var v = h[keys[i]];
    out[keys[i].toLowerCase()] = Array.isArray(v) ? v.join(", ") : String(v == null ? "" : v);
  }
  return out;
}

// HTTP GET：返回 {status, headers(小写键), text, finalUrl}，永不抛错。
// REX 运行时对 302 两种形态都处理：未跟随时读 headers.location，
// 已跟随时 finalUrl 给最终地址、正文即最终页；错误响应里若带 Location 也挖出。
async function jnHttpRaw(url, headers, timeoutMs) {
  try {
    var opts = { headers: headers || { "User-Agent": JN_UA } };
    if (timeoutMs) opts.timeout = timeoutMs;
    var res = await Widget.http.get(url, opts);
    if (!res) return { status: 0, headers: {}, text: "", finalUrl: "" };
    if (typeof res === "string") return { status: 200, headers: {}, text: res, finalUrl: "" };
    var rawData = res.data != null ? res.data : (res.body != null ? res.body : "");
    var text = typeof rawData === "string" ? rawData : (rawData ? JSON.stringify(rawData) : "");
    var status = 0;
    if (typeof res.status === "number") status = res.status;
    else if (typeof res.statusCode === "number") status = res.statusCode;
    else if (typeof res.code === "number") status = res.code;
    else if (text) status = 200;
    var finalUrl = res.url || res.finalUrl || res.responseURL || "";
    return { status: status, headers: jnLowerHeaders(res.headers), text: text || "", finalUrl: finalUrl ? String(finalUrl) : "" };
  } catch (e) {
    var st = 0, hh = {}, body = "";
    if (e) {
      if (typeof e.status === "number") st = e.status;
      else if (typeof e.statusCode === "number") st = e.statusCode;
      if (e.response) {
        if (typeof e.response.status === "number") st = e.response.status;
        else if (typeof e.response.statusCode === "number") st = e.response.statusCode;
        hh = jnLowerHeaders(e.response.headers);
        var ed = e.response.data != null ? e.response.data : e.response.body;
        body = typeof ed === "string" ? ed : (ed ? JSON.stringify(ed) : "");
      }
    }
    return { status: st, headers: hh, text: body, finalUrl: "" };
  }
}

// 取 JSON 数据：字符串则 JSON.parse、对象则直用；失败回 null。
async function jnHttpGetData(url, headers, timeoutMs) {
  try {
    var opts = { headers: headers || {} };
    if (timeoutMs) opts.timeout = timeoutMs;
    var res = await Widget.http.get(url, opts);
    if (!res) return null;
    if (typeof res === "string") return res;
    if (res.data != null) return res.data;
    if (res.body != null) return res.body;
    return null;
  } catch (e) {
    return null;
  }
}

// POST JSON：运行时无 post 时回 null，调用方自动降级；返回解析后的对象。
async function jnHttpPostJson(url, obj, headers, timeoutMs) {
  try {
    if (!Widget.http || typeof Widget.http.post !== "function") return null;
    var opts = { headers: headers || {}, timeout: timeoutMs || 30000 };
    var res = await Widget.http.post(url, JSON.stringify(obj || {}), opts);
    var data = res && res.data != null ? res.data : (typeof res === "string" ? res : null);
    if (data == null) return null;
    if (typeof data === "string") {
      try { return JSON.parse(data); } catch (e) { return null; }
    }
    return typeof data === "object" ? data : null;
  } catch (e) {
    return null;
  }
}

// 相对地址按 base 解析（手写，避免依赖运行时 URL 实现差异；REX 沙箱不保证 URL 全局）
function jnResolveUrl(u, base) {
  u = String(u || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  var bm = String(base || "").match(/^(https?:\/\/[^/?#]+)([^?#]*)/i);
  if (!bm) return u;
  var origin = bm[1];
  var path = bm[2] || "/";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return origin + u;
  if (u.charAt(0) === "?") return origin + path + u;
  var dir = path.slice(0, path.lastIndexOf("/") + 1);
  return origin + dir + u;
}

function jnHostOf(u) {
  var m = String(u || "").match(/^https?:\/\/([^/?#]+)/i);
  return m ? m[1].toLowerCase() : "";
}

function jnOriginOf(u) {
  var m = String(u || "").match(/^(https?:\/\/[^/?#]+)/i);
  return m ? m[1] : "";
}

function jnStripTags(s) {
  return String(s || "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#[0-9]+;/g, "").replace(/\s+/g, " ").trim();
}

// vod_id（完整 URL / path）统一归一化为站内 path（/video/<slug>/）
function jnToMirrorPath(raw) {
  var s = String(raw || "").trim();
  var m = s.match(/\/video\/[^?#\s]+/i);
  if (m) { s = m[0]; if (s.charAt(s.length - 1) !== "/") s += "/"; return s; }
  if (s.charAt(0) === "/") { if (s.charAt(s.length - 1) !== "/") s += "/"; return s; }
  return s;
}

// 镜像读取（ghfast 优先，raw 兜底；任一拿到含 items 的 JSON 即算成功）
async function jnFetchMirrorLookup() {
  for (var i = 0; i < JN_MIRROR_BASES.length; i++) {
    try {
      var d = await jnHttpGetData(JN_MIRROR_BASES[i] + "lookup.json", { "User-Agent": JN_UA, "Accept": "application/json,*/*" }, 20000);
      var j = (typeof d === "string") ? JSON.parse(d) : d;
      if (j && j.items && typeof j.items === "object" && !Array.isArray(j.items) && Object.keys(j.items).length) return j.items;
    } catch (e) {}
  }
  return null;
}

async function jnFetchMirrorJson(slug) {
  for (var i = 0; i < JN_MIRROR_BASES.length; i++) {
    try {
      var d = await jnHttpGetData(JN_MIRROR_BASES[i] + slug + ".json", { "User-Agent": JN_UA, "Accept": "application/json,*/*" }, 20000);
      var j = (typeof d === "string") ? JSON.parse(d) : d;
      if (j && Array.isArray(j.items) && j.items.length) return j;
    } catch (e) {}
  }
  return null;
}

// 列表卡解析：<div class="post"> 块内 /video/ 链接 + h3 + data-original 封面（去 ! 后缀）
function jnParsePosts(html) {
  var items = [];
  var seen = {};
  var re = /<div class="post">([\s\S]{0,4000}?)<\/a>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var blk = m[1];
    var lm = blk.match(/<a[^>]*href="([^"]*\/video\/[^"]+)"[^>]*>/i);
    if (!lm) continue;
    var url = lm[1].indexOf("http") === 0 ? lm[1] : JN_HOST.replace(/\/$/, "") + lm[1];
    if (seen[url]) continue;
    var hm = blk.match(/<h3[^>]*>([\s\S]{0,400}?)<\/h3>/i);
    var title = hm ? jnStripTags(hm[1]) : "";
    if (!title || title.length < 2) continue;
    var pm = blk.match(/data-original="([^"]+)"/i);
    var pic = pm ? pm[1] : "";
    if (pic) pic = pic.split("!")[0];
    var dm = blk.match(/<span class="date">([^<]+)<\/span>/i);
    seen[url] = true;
    items.push({ vod_id: url, vod_name: title, vod_pic: pic, vod_remarks: dm ? dm[1].trim() : "" });
    if (items.length >= 24) break;
  }
  return items;
}

// Dean Edwards 打包脚本解包：与页内 eval(function(p,a,c,k,e,d){...}) 等价（纯字符串逻辑）
function jnUnpackPacked(html) {
  var m = html.match(/eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?\}\('([\s\S]*?)',(\d+),(\d+),'(.*?)'\.split\('\|'\)\)\)/);
  if (!m) return "";
  var p = m[1];
  var a = parseInt(m[2], 10);
  var c = parseInt(m[3], 10);
  var k = m[4].split("|");
  var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var toBase = function (n) {
    if (n === 0) return "0";
    var r = "";
    while (n > 0) { r = chars[n % a] + r; n = Math.floor(n / a); }
    return r;
  };
  for (var i = c - 1; i >= 0; i--) {
    if (i < k.length && k[i]) {
      var tok = toBase(i);
      p = p.replace(new RegExp("\\b" + tok + "\\b", "g"), k[i]);
    }
  }
  return p;
}

function jnExtractM3u8(embedHtml) {
  var unpacked = jnUnpackPacked(embedHtml);
  if (!unpacked) return "";
  var lm = unpacked.match(/"hls2"\s*:\s*"([^"]+)"/) || unpacked.match(/hls2["']?\s*:\s*["']([^"']+)["']/);
  if (lm) return lm[1];
  var l4 = unpacked.match(/"hls4"\s*:\s*"([^"]+)"/);
  if (l4) return l4[1];
  var l3 = unpacked.match(/"hls3"\s*:\s*"([^"]+)"/);
  if (l3) return l3[1];
  var any = unpacked.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/i);
  return any ? any[0] : "";
}

// 单个按钮：lk1 → 嵌套页（Location 头优先，已跟随正文兜底；再不行该按钮失败）
// 注意：首个按钮是 class="btn-server active"，正则须容 active 后缀（调用方保证）。
async function jnResolveButton(hex, detailUrl) {
  var rev = hex.split("").reverse().join("");
  var lk1 = "https://lk1.supremejav.com/javneon.php?c=" + rev;
  var r = await jnHttpRaw(lk1, jnPageHeaders(detailUrl), 15000);
  var loc = r.headers.location || "";
  if (loc) {
    var abs = jnResolveUrl(loc, lk1);
    if (abs && abs !== lk1) {
      var r2 = await jnHttpRaw(abs, jnPageHeaders(detailUrl), 25000);
      if (r2.text) return { target: r2.finalUrl || abs, embedHtml: r2.text, lk1: lk1 };
      return null;
    }
    return null;
  }
  var body = r.text || "";
  // 运行时已自动跟随跳转：正文就是嵌入页，finalUrl 是其真地址
  if (r.finalUrl && r.finalUrl !== lk1 && body.length > 300) {
    return { target: r.finalUrl, embedHtml: body, lk1: lk1 };
  }
  // 个别出口下 lk1 直接回嵌入页正文（无跳转）
  if (body.length > 800) {
    return { target: lk1, embedHtml: body, lk1: lk1 };
  }
  return null;
}

// master 现取现拆：解析 #EXT-X-STREAM-INF 的 RESOLUTION，拆成清晰度线（高→低）。
// 拆不到（单档 master 或取失败）返回 []，调用方回落单线。
async function jnExpandMaster(masterUrl, referer, prefix) {
  try {
    var r = await jnHttpRaw(masterUrl, jnPageHeaders(referer), 20000);
    var text = r.text || "";
    if (text.indexOf("#EXTM3U") < 0 || text.indexOf("#EXT-X-STREAM-INF") < 0) return [];
    var out = [];
    var re = /#EXT-X-STREAM-INF:[^\n]*RESOLUTION=(\d+)x(\d+)[^\n]*\n([^\n#]+)/g;
    var m;
    while ((m = re.exec(text)) !== null) {
      var h = parseInt(m[2], 10);
      var label = h >= 1080 ? "1080p" : h >= 720 ? "720p" : h >= 480 ? "480p" : h + "p";
      var u = jnResolveUrl(m[3].trim(), masterUrl);
      out.push({ name: prefix + "·" + label, url: u, h: h });
    }
    out.sort(function (a, b) { return b.h - a.h; });
    var res = [];
    for (var i = 0; i < out.length; i++) res.push({ name: out[i].name, url: out[i].url });
    return res;
  } catch (e) {
    return [];
  }
}

// 播放链：VAS 优先、EVS 兜底，集齐两者即停；其余按钮仅在两者全失败时试。
// 注意：vidhide API 固定传 codecs:[]（传 ["h264"] 会超时/失败）。
async function jnResolvePlayLinesFromButtons(btns, detailUrl) {
  var lines = [];
  var seen = {};
  var push = function (name, u) {
    if (!u || seen[u]) return;
    seen[u] = true;
    lines.push({ name: name, url: u });
  };
  var vas = null, evs = null;
  var others = [];
  for (var i = 0; i < btns.length; i++) {
    var b = await jnResolveButton(btns[i], detailUrl);
    if (!b) continue;
    var host = jnHostOf(b.target);
    if (/\/e\/[A-Za-z0-9]+/.test(b.target) || /vvaassjjav\.xyz$/i.test(host)) { if (!vas) vas = b; }
    else if (/evsishere\.xyz$/i.test(host)) { if (!evs) evs = b; }
    // lk1 落点域会轮换（vidhide 多镜像）：只要正文是打包脚本页（能解出 hls2/hls3），
    // 一律按 EVS 打包线处理（可拆档），不再因宿主名不符掉进 OTHER。
    else if (jnUnpackPacked(b.embedHtml)) { if (!evs) evs = b; }
    else others.push(b);
    if (vas && evs) break;
  }
  var vasOk = false;
  if (vas) {
    var fm = String(vas.target).match(/\/e\/([A-Za-z0-9]+)/);
    if (fm) {
      var origin = jnOriginOf(vas.target);
      if (origin) {
        var j = await jnHttpPostJson(origin + "/api/stream", { filecode: fm[1], device: "web", codecs: [] }, {
          "User-Agent": JN_UA,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Origin": origin,
          "Referer": vas.target
        }, 30000);
        if (j && j.streaming_url) {
          var expanded = await jnExpandMaster(j.streaming_url, vas.target, "VAS");
          if (expanded.length) { for (var ei = 0; ei < expanded.length; ei++) push(expanded[ei].name, expanded[ei].url); }
          else push("VAS", j.streaming_url);
          vasOk = true;
        }
      }
    }
    if (!vasOk) {
      var packed = jnExtractM3u8(vas.embedHtml);
      if (packed) { push("VAS", packed); vasOk = true; }
    }
  }
  if (vasOk) {
    // VAS 已出线：EVS 也尽量拆档；拆不开（master 403 等）时回落单线备份，不影响 VAS 线。
    if (evs) {
      var packed2 = jnExtractM3u8(evs.embedHtml);
      if (packed2) {
        var expanded2 = await jnExpandMaster(packed2, evs.target, "EVS");
        if (expanded2.length) { for (var ei2 = 0; ei2 < expanded2.length; ei2++) push(expanded2[ei2].name, expanded2[ei2].url); }
        else push("EVS", packed2);
      }
    }
    return lines;
  }
  if (evs) {
    var packed3 = jnExtractM3u8(evs.embedHtml);
    if (packed3) {
      var expanded3 = await jnExpandMaster(packed3, evs.target, "EVS");
      if (expanded3.length) { for (var ei3 = 0; ei3 < expanded3.length; ei3++) push(expanded3[ei3].name, expanded3[ei3].url); }
      else push("EVS", packed3);
      return lines;
    }
  }
  for (var oi = 0; oi < others.length; oi++) {
    var ob = others[oi];
    var packed4 = jnExtractM3u8(ob.embedHtml);
    if (packed4) { push("OTHER", packed4); break; }
    var fm2 = String(ob.target).match(/\/e\/([A-Za-z0-9]+)/);
    if (fm2) {
      var origin2 = jnOriginOf(ob.target);
      if (origin2) {
        var j2 = await jnHttpPostJson(origin2 + "/api/stream", { filecode: fm2[1], device: "web", codecs: [] }, {
          "User-Agent": JN_UA,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Origin": origin2,
          "Referer": ob.target
        }, 30000);
        if (j2 && j2.streaming_url) { push("OTHER", j2.streaming_url); break; }
      }
    }
  }
  return lines;
}

function jnMirrorToRex(it) {
  var path = jnToMirrorPath(it.path);
  var link = "https://javneon.tv" + (path || "");
  return { id: path, type: "url", title: it.title || "", posterPath: it.pic || "", coverUrl: it.pic || "", backdropPath: it.pic || "", link: link, description: it.date || "", mediaType: "movie" };
}

function jnPostToRex(v) {
  var path = jnToMirrorPath(v.vod_id);
  return { id: path, type: "url", title: v.vod_name || "", posterPath: v.vod_pic || "", coverUrl: v.vod_pic || "", backdropPath: v.vod_pic || "", link: v.vod_id, description: v.vod_remarks || "", mediaType: "movie" };
}

function jnPickLink(link) {
  if (link == null) return "";
  if (typeof link === "string" || typeof link === "number") return String(link);
  if (typeof link === "object") {
    return String(link.link || link.url || link.id || link.path || "");
  }
  return "";
}

function jnPickKeyword(params) {
  if (params == null) return "";
  if (typeof params === "string" || typeof params === "number") return String(params).trim();
  var keys = ["keyword", "q", "wd", "key", "text", "query", "search"];
  for (var i = 0; i < keys.length; i++) {
    if (params[keys[i]]) return String(params[keys[i]]).trim();
  }
  return "";
}

async function loadList(params) {
  params = params || {};
  var slug = String(params.path || params.cat || "censored-jav");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var mj = await jnFetchMirrorJson(slug);
    if (mj && Array.isArray(mj.items)) {
      var start = (page - 1) * 24;
      var slice = mj.items.slice(start, start + 24);
      if (slice.length) {
        var out = [];
        for (var i = 0; i < slice.length; i++) out.push(jnMirrorToRex(slice[i]));
        return out;
      }
    }
    // 镜像里没有这一页（深页）：走 javsb-relay /jn 实时抓该页
    var deepPath = JN_CAT_PATHS[slug] || slug;
    var base = JN_HOST + deepPath;
    var url = page === 1 ? (base + "/") : (base + "/page/" + page + "/");
    var rr = await jnHttpRaw(JN_RELAY + "?url=" + encodeURIComponent(url), jnPageHeaders(JN_HOST), 25000);
    var list = jnParsePosts(rr.text);
    var out2 = [];
    for (var j = 0; j < list.length; j++) out2.push(jnPostToRex(list[j]));
    return out2;
  } catch (e) {
    return [];
  }
}

async function loadDetail(link) {
  var raw = jnPickLink(link);
  var path = jnToMirrorPath(raw);
  var detailUrl = /^https?:\/\//i.test(raw) ? raw : ("https://javneon.tv" + (path || ("/" + String(raw).replace(/^\/+/, ""))));
  try {
    var lookup = await jnFetchMirrorLookup();
    var hit = null;
    if (lookup && path && lookup[path]) {
      var mj = await jnFetchMirrorJson(lookup[path].s);
      if (mj) {
        for (var i = 0; i < mj.items.length; i++) {
          if (jnToMirrorPath(mj.items[i].path) === path) { hit = mj.items[i]; break; }
        }
      }
    }
    if (hit && Array.isArray(hit.buttons) && hit.buttons.length) {
      var lines = await jnResolvePlayLinesFromButtons(hit.buttons, detailUrl);
      if (!lines.length) return { id: raw, type: "url", description: "未找到播放地址" };
      var eps = [];
      for (var ei = 0; ei < lines.length; ei++) eps.push({ name: lines[ei].name, link: lines[ei].url });
      return { id: raw, type: "url", title: hit.title || "JavNeon", link: detailUrl, posterPath: hit.pic || "", coverUrl: hit.pic || "", backdropPath: hit.pic || "", episodes: eps };
    }
    // 无命中：抓详情页（直连无按钮时走 /jn）再跑链
    var html = (await jnHttpRaw(detailUrl, jnPageHeaders(JN_HOST), 20000)).text;
    var btnRe = /class="btn-server[^"]*"[^>]*data-link="/gi;
    if (!(html.match(btnRe) || []).length) {
      var rr = await jnHttpRaw(JN_RELAY + "?url=" + encodeURIComponent(detailUrl), jnPageHeaders(JN_HOST), 25000);
      if ((rr.text.match(/class="btn-server[^"]*"[^>]*data-link="/gi) || []).length) html = rr.text;
    }
    var btns = [];
    var bre = /class="btn-server[^"]*"[^>]*data-link="([0-9a-f]+)"/gi;
    var bm;
    while ((bm = bre.exec(html)) !== null) btns.push(bm[1]);
    var lines2 = await jnResolvePlayLinesFromButtons(btns, detailUrl);
    if (!lines2.length) return { id: raw, type: "url", description: "未找到播放地址" };
    var hm = html.match(/<h2[^>]*>([\s\S]{0,400}?)<\/h2>/i);
    // 封面在 player-wrap 的 background-image 里（页内其它 background-image 多为语言旗标，勿取首个）
    var pm = html.match(/player-wrap[^>]*style="[^"]*background-image:\s*url\((https?:[^)]+)\)/i)
      || html.match(/player-wrap[^>]*style='[^']*background-image:\s*url\((https?:[^)]+)\)/i);
    var pic = pm ? pm[1] : "";
    var eps2 = [];
    for (var ei2 = 0; ei2 < lines2.length; ei2++) eps2.push({ name: lines2[ei2].name, link: lines2[ei2].url });
    return { id: raw, type: "url", title: hm ? jnStripTags(hm[1]) : "JavNeon", link: detailUrl, posterPath: pic, coverUrl: pic, backdropPath: pic, episodes: eps2 };
  } catch (e) {
    return { id: raw, type: "url", description: "未找到播放地址" };
  }
}

// 播放源解析（stream 模块）：集 link 即详情已解出的 m3u8 直链，原样透传。
async function loadResource(params) {
  if (typeof params === "string" || typeof params === "number") {
    var u0 = String(params);
    if (!/^https?:\/\//i.test(u0)) return [];
    return [{ name: "播放", url: u0, playerType: "app", customHeaders: JN_PLAY_HEADERS }];
  }
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  if (raw && typeof raw === "object") raw = raw.link || raw.url || "";
  var url = String(raw || "");
  if (!/^https?:\/\//i.test(url)) return [];
  var name = params.name || "播放";
  return [{ name: name, url: url, playerType: "app", customHeaders: JN_PLAY_HEADERS }];
}

async function search(params) {
  params = params || {};
  var kw = jnPickKeyword(params);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!kw) return [];
  try {
    var lookup = await jnFetchMirrorLookup();
    if (lookup) {
      var low = kw.toLowerCase();
      var matched = [];
      var keys = Object.keys(lookup);
      for (var i = 0; i < keys.length; i++) {
        var ent = lookup[keys[i]];
        if ((String(ent.t || "").toLowerCase().indexOf(low) !== -1) || keys[i].toLowerCase().indexOf(low) !== -1) {
          matched.push({ id: keys[i], type: "url", title: ent.t || "", posterPath: ent.p || "", coverUrl: ent.p || "", backdropPath: ent.p || "", link: "https://javneon.tv" + keys[i], description: "", mediaType: "movie" });
        }
      }
      if (matched.length) return matched.slice((page - 1) * 90, page * 90);
    }
    // 镜像无命中：回落 /jn 实时搜索
    var url = JN_HOST + "?s=" + encodeURIComponent(kw);
    if (page > 1) url += "&paged=" + page;
    var rr = await jnHttpRaw(JN_RELAY + "?url=" + encodeURIComponent(url), jnPageHeaders(JN_HOST), 25000);
    var list = jnParsePosts(rr.text);
    var out = [];
    for (var j = 0; j < list.length; j++) out.push(jnPostToRex(list[j]));
    return out;
  } catch (e) {
    return [];
  }
}
