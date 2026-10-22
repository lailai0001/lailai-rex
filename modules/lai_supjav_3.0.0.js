// SupJav for REX (lai_supjav v3.0.0)
// 来源蓝图：mira-cat 蜘蛛 supjav.js（构建 60f6b6d4，用户真机确认可播；只读参考，未改动）。
// 后端：https://supjav.com
//
// 为什么 3.0.0 整体重写（2.0.x 的死因，逐项对照猫蜘蛛已验通做法）：
//  1) lk1 断步：2.0.x 用 Widget.http.get 直接取 ?c= 并指望运行时跟随 302 后
//     拿到嵌入页正文；但 lk1 对部分出口回「302 + 空 Location」，跟随型客户
//     端直接抛错/回空，链路永远摸不到嵌入地址。猫蜘蛛的做法是手工读跳转：
//     不跟随、先读 Location 头。REX 运行时同样暴露 res.headers（包内
//     lai_avhub/lai_xhongyan 有读 location 的真机先例），3.0.0 按猫口径读
//     Location；运行时若已自动跟随（finalUrl 变化）则直接采用其正文，
//     两种运行时行为都兼容。?c= 直试 2 次 → 门页 OLID 再试 → Worker 备用
//     出口（v2 才支持 lk1，v1 自动判败），与猫 lkResolveEmbed 逐步一致。
//  2) 嵌入页解法缺失/错位：2.0.x 把 EVS/LUC 当 VOE 家族走六层解包，实际
//     两家是 Dean-Edwards packer 打包页（links.hls2/hls3/hls4），解包器
//     根本不对路；VAS 的 /api/stream POST 换 streaming_url 完全没实现；
//     ST 候选没做诱饵域名过滤、试活不过还硬回未验证候选。3.0.0 的
//     resolveEmbed 与猫蜘蛛同构分派：ST 求值提候选（只认 streamtape.com/
//     amtape.com 真域）逐个试活、不过改嗅探嵌入页本身；VAS POST /api/stream
//     （30 秒上限）换直链、失败嗅探嵌入页；VOE 六层解包（与 lai_hanbj 同
//     算法）挑最高档；packer 解包提 links.hls* 逐个验 #EXTM3U 后挑最高档
//     （真 .m3u8 优先于 .txt 伪装）；明文/jwplayer 兜底。
//  3) 兜底指向自毁门页：2.0.x 全败时回 lk1 门页（?l=）交嗅探，门页有顶层
//     自毁 JS（top==location 就清空页面），REX 嗅探抓不到。3.0.0 按猫口径：
//     嗅探目标优先给嵌入页本身；只有连嵌入地址都没拿到时才探活 Worker
//     v2 的 /wrap 包装页（iframe 嵌门页绕自毁），都没有才回门页（不劣化）。
//  4) 取页通道次序对齐猫蜘蛛：猫 fetchPage 只走 fzcrym /fs（重试）→ /page，
//     这是已验通的主通道；3.0.0 以它为先（fs×2 → page），其后再加 direct、
//     supjav-fetch Worker v1 两条设备侧机会通道（2.0.x 时代详情页能出即靠
//     它们之一），逐个做真页面校验。Worker v1 只认 supjav.com 页面，对
//     lk1 回 "host not allowed" 自动判败——本版任何主通道都不依赖它，
//     它升 v2 后 lk1 备用出口与 /wrap 会自动生效，无需再改模块。
//  5) 详情线路按 hex 去重（详情页有两组线路块，466772 实测是同片上/下集
//     而非重复，去重后集数不变、防真重复）+ 排序表换猫口径
//     VOE>EVS>LUC>VAS>FST>ST。

WidgetMetadata = {
  id: "lai_supjav",
  title: "SupJav",
  description: "SupJav（supjav.com）：最新/热门/趋势/有码/无码/素人/中文字幕/破解/英文字幕，多线路解析播放（VOE解包/packer解包/VAS接口/Streamtape提取，与猫源同构）",
  author: "lai",
  version: "3.0.0",
  requiredVersion: "0.0.1",
  site: "https://supjav.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "最新",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "__home" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "热门",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "__popular" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "趋势",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "__trending" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "有码 Censored",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "censored-jav" },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "最新", value: "" },
            { title: "最多观看", value: "views" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "无码 Uncensored",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "uncensored-jav" },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "最新", value: "" },
            { title: "最多观看", value: "views" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "素人 Amateur",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "amateur" },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "最新", value: "" },
            { title: "最多观看", value: "views" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "中文字幕 Chn Sub",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "chinese-subtitles" },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "最新", value: "" },
            { title: "最多观看", value: "views" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "破解 Reducing Mosaic",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "reducing-mosaic" },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "最新", value: "" },
            { title: "最多观看", value: "views" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "英文字幕 Eng Sub",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "english-subtitles" },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "最新", value: "" },
            { title: "最多观看", value: "views" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
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
      title: "SupJav播放源",
      description: "播放时按所选线路实时解析地址",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 0,
      params: []
    }
  ]
};

var HOST = "https://supjav.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var UA_PC = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
var LK_BASE = "https://lk1.supremejav.com/supjav.php";
var FZ_FS = "https://py.fzcrym.link:1314/fs?u=";
var FZ_PAGE = "https://py.fzcrym.link:1314/page?u=";
var FETCH_WORKER = "https://supjav-fetch.li768435813.workers.dev";

// ---------------- 通用小工具 ----------------

function t(v) {
  return String(v == null ? "" : v).trim();
}

// 真机上 loadDetail/loadResource 的入参可能是卡片/子项对象而不是字符串，
// 一律先解包出链接（与包内已验收模块同口径）。
function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") {
    var cand = x.link || x.id || x.url || x.href || "";
    if (cand && typeof cand === "object") return unwrapLink(cand);
    return String(cand || "");
  }
  return String(x);
}

function reverseStr(s) {
  return String(s || "").split("").reverse().join("");
}

function cleanTitle(s) {
  return String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, "-")
    .replace(/&#038;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// 相对地址按 base 解析（手写，避免依赖运行时 URL 实现差异）
function resolveUrl(u, base) {
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

function hostOf(u) {
  var m = String(u || "").match(/^https?:\/\/([^/?#]+)/i);
  return m ? m[1].toLowerCase() : "";
}

function originOf(u) {
  var m = String(u || "").match(/^(https?:\/\/[^/?#]+)/i);
  return m ? m[1] : "";
}

function rot13(s) {
  return String(s).replace(/[a-zA-Z]/g, function (c) {
    var base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

var B64TAB = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// base64 → UTF-8 字符串（纯 JS，与猫蜘蛛 Buffer 路径等价；同包内 lai_hanbj 已验通实现）
function b64d(x) {
  try {
    var s = String(x).replace(/[^A-Za-z0-9+/=]/g, "");
    while (s.length % 4) s += "=";
    var bytes = [];
    for (var i = 0; i < s.length; i += 4) {
      var a = B64TAB.indexOf(s.charAt(i));
      var b = B64TAB.indexOf(s.charAt(i + 1));
      var c = s.charAt(i + 2) === "=" ? 0 : B64TAB.indexOf(s.charAt(i + 2));
      var d = s.charAt(i + 3) === "=" ? 0 : B64TAB.indexOf(s.charAt(i + 3));
      if (a < 0 || b < 0) break;
      var n = (a << 18) | (b << 12) | (c << 6) | d;
      bytes.push((n >> 16) & 255);
      if (s.charAt(i + 2) !== "=") bytes.push((n >> 8) & 255);
      if (s.charAt(i + 3) !== "=") bytes.push(n & 255);
    }
    var out = "";
    for (var j = 0; j < bytes.length;) {
      var b0 = bytes[j];
      if (b0 < 128) { out += String.fromCharCode(b0); j += 1; }
      else if (b0 >= 194 && b0 < 224 && j + 1 < bytes.length) {
        out += String.fromCharCode(((b0 & 31) << 6) | (bytes[j + 1] & 63)); j += 2;
      } else if (b0 >= 224 && b0 < 240 && j + 2 < bytes.length) {
        out += String.fromCharCode(((b0 & 15) << 12) | ((bytes[j + 1] & 63) << 6) | (bytes[j + 2] & 63)); j += 3;
      } else if (b0 >= 240 && j + 3 < bytes.length) {
        var cp = ((b0 & 7) << 18) | ((bytes[j + 1] & 63) << 12) | ((bytes[j + 2] & 63) << 6) | (bytes[j + 3] & 63);
        cp -= 0x10000;
        out += String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 1023)); j += 4;
      } else { out += String.fromCharCode(b0); j += 1; }
    }
    return out;
  } catch (e) {
    return "";
  }
}

// ---------------- HTTP（对齐猫蜘蛛 httpRaw 语义） ----------------
// 返回 {status, headers(小写键), text, finalUrl}，永不抛错。
// 猫蜘蛛靠 maxRedirects:0 + 手工读 Location；REX 运行时暴露 res.headers
// （lai_avhub/lai_xhongyan 真机先例），若运行时选择自动跟随跳转，
// finalUrl 会给出最终地址、正文即最终页——两种形态调用方都处理。

function lowerHeaders(h) {
  var out = {};
  if (!h || typeof h !== "object") return out;
  var keys = Object.keys(h);
  for (var i = 0; i < keys.length; i++) {
    var v = h[keys[i]];
    out[keys[i].toLowerCase()] = Array.isArray(v) ? v.join(", ") : String(v == null ? "" : v);
  }
  return out;
}

async function httpRaw(url, headers, timeoutMs) {
  try {
    var opts = { headers: headers || { "User-Agent": UA_PC } };
    if (timeoutMs) opts.timeout = timeoutMs;
    var res = await Widget.http.get(url, opts);
    if (!res) return { status: 0, headers: {}, text: "", finalUrl: "" };
    var data = res.data != null ? res.data : "";
    var text = typeof data === "string" ? data : (data ? JSON.stringify(data) : "");
    var status = 0;
    if (typeof res.status === "number") status = res.status;
    else if (typeof res.statusCode === "number") status = res.statusCode;
    else if (text) status = 200;
    var finalUrl = res.url || res.finalUrl || res.responseURL || "";
    return { status: status, headers: lowerHeaders(res.headers), text: text || "", finalUrl: finalUrl ? String(finalUrl) : "" };
  } catch (e) {
    return { status: 0, headers: {}, text: "", finalUrl: "", error: String((e && e.message) || e) };
  }
}

// POST JSON（VAS /api/stream 用）：运行时无 post 时回 null，调用方自动降级。
// 返回解析后的对象（拿不到/非对象回 null）。
async function httpPostJson(url, obj, headers, timeoutMs) {
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

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": referer || HOST + "/"
  };
}

// ---------------- 取页（猫蜘蛛 fetchPage 口径 + 设备侧机会通道） ----------------
// 猫蜘蛛：/fs 重试 2 次 → /page 1 次，校验 = 非 CF 拦截页且长度 > 3000。
// 本版保留该主通道与校验，在其后加 direct（手机住宅/移动出口对 IP 信誉封
// 有机会直通）与 supjav-fetch Worker v1（仅页面通道；它对 lk1 不可用、
// 本版不依赖）两条机会通道。全灭回 "" 并把逐通道结果记进 lastFetchReport，
// 列表/搜索出诊断卡供截图定位（沿用 2.0.x 的遥测形态）。

var PAGE_CHANNELS = [
  { name: "fs", tries: 2, timeout: 60000, build: function (u) { return FZ_FS + encodeURIComponent(u); } },
  { name: "page", tries: 1, timeout: 60000, build: function (u) { return FZ_PAGE + encodeURIComponent(u); } },
  { name: "direct", tries: 1, timeout: 30000, build: function (u) { return u; } },
  { name: "worker", tries: 1, timeout: 45000, build: function (u) { return FETCH_WORKER + "/?u=" + encodeURIComponent(u); } }
];
var lastFetchReport = "";
var lastWinChannel = "";

function isBlockedPage(html) {
  var head = String(html || "").slice(0, 3000);
  return /just a moment/i.test(head) || /attention required/i.test(head) || /verify you are human/i.test(head);
}

function looksLikePage(html, kind) {
  var s = String(html || "");
  if (s.length < 3000 || isBlockedPage(s)) return false;
  if (kind === "list") return s.indexOf('class="post"') > -1 || /supjav\.com\/\d+\.html/.test(s);
  if (kind === "detail") return s.indexOf("data-link") > -1 || /<h1[\s>]/.test(s);
  return true;
}

async function fetchPage(url, kind) {
  var notes = [];
  for (var ci = 0; ci < PAGE_CHANNELS.length; ci++) {
    var ch = PAGE_CHANNELS[ci];
    for (var k = 0; k < ch.tries; k++) {
      var r = await httpRaw(ch.build(url), pageHeaders(HOST + "/"), ch.timeout);
      if (r.text && looksLikePage(r.text, kind)) {
        lastWinChannel = ch.name;
        lastFetchReport = ch.name + " 通道取页成功（" + r.text.length + "B）";
        return r.text;
      }
      notes.push(ch.name + (k ? "#2" : "") + ":" + (r.text ? ("len" + r.text.length + (isBlockedPage(r.text) ? "/CF拦截页" : "/非目标页")) : ("无响应" + (r.error ? "(" + String(r.error).slice(0, 40) + ")" : ""))));
    }
  }
  lastWinChannel = "";
  lastFetchReport = notes.join("；");
  return "";
}

function diagCard(title) {
  return [{
    id: "supjav-diag-" + Date.now(),
    type: "url",
    title: title || "⚠诊断：SupJav 页面取不到",
    posterPath: "",
    coverUrl: "",
    backdropPath: "",
    link: HOST + "/",
    mediaType: "movie",
    description: "取页结果：" + (lastFetchReport || "无记录") +
      "。fs/page=猫源同款代理通道（主）；direct=手机直连（CF 按 IP 信誉封机房，手机直连可能通过）；worker=自有 supjav-fetch Worker。把本卡文字发给维护者可定位断点。"
  }];
}

// ---------------- 列表解析（与猫蜘蛛 parseCards 同口径 + 兜底扫链） ----------------

function parseCards(html) {
  var out = [];
  var seen = {};
  function push(vid, title, pic) {
    if (!vid || seen[vid] || !title) return;
    seen[vid] = true;
    var cm = title.match(/\b([A-Z]{2,6}-?\d{2,6}|FC2PPV[\s-]?\d{5,8})\b/);
    var durl = HOST + "/" + vid + ".html";
    out.push({
      id: durl,
      type: "url",
      title: title.slice(0, 90),
      posterPath: pic || "",
      coverUrl: pic || "",
      backdropPath: pic || "",
      link: durl,
      description: cm ? cm[1] : "",
      mediaType: "movie"
    });
  }
  var s = String(html || "");
  var blocks = s.split('<div class="post">').slice(1);
  for (var bi = 0; bi < blocks.length; bi++) {
    var b = blocks[bi];
    var m = b.match(/href="https:\/\/supjav\.com\/(\d+)\.html"/);
    if (!m) continue;
    var tm = b.match(/title="([^"]+)"/);
    var title = tm ? cleanTitle(tm[1]) : "";
    var pic = "";
    var pats = [/<img[^>]+data-original="([^"]+)"/, /<img[^>]+data-src="([^"]+)"/, /<img[^>]+src="(https?:\/\/[^"]+)"/];
    for (var pi = 0; pi < pats.length; pi++) {
      var pm = b.match(pats[pi]);
      if (pm) { pic = pm[1]; break; }
    }
    if (pic.indexOf("//") === 0) pic = "https:" + pic;
    push(m[1], title, pic);
  }
  if (!out.length) {
    var re = /<a[^>]+href="https:\/\/supjav\.com\/(\d+)\.html"[^>]*>([\s\S]{0,800}?)<\/a>/g;
    var am;
    while ((am = re.exec(s)) !== null) {
      var inner = am[2];
      var it = inner.match(/title="([^"]+)"/) || inner.match(/alt="([^"]+)"/);
      var ip = inner.match(/<img[^>]+(?:data-original|data-src|src)="([^"]+)"/);
      var pic2 = ip ? ip[1] : "";
      if (pic2.indexOf("//") === 0) pic2 = "https:" + pic2;
      push(am[1], it ? cleanTitle(it[1]) : "", pic2);
    }
  }
  return out;
}

function catUrl(tid, page, sort) {
  var p = Math.max(1, parseInt(page, 10) || 1);
  if (tid === "__home") return p === 1 ? HOST + "/" : HOST + "/page/" + p + "/";
  if (tid === "__popular") return p === 1 ? HOST + "/popular/" : HOST + "/popular/page/" + p + "/";
  if (tid === "__trending") return p === 1 ? HOST + "/trending/" : HOST + "/trending/page/" + p + "/";
  var base = HOST + "/category/" + tid;
  var url = p === 1 ? base + "/" : base + "/page/" + p + "/";
  if (sort) url += "?sort=" + encodeURIComponent(sort);
  return url;
}

async function loadList(params) {
  params = params || {};
  var tid = String(params.cat || params.path || "__home");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var sort = String(params.sort || "");
  try {
    var url = catUrl(tid, page, sort);
    var html = await fetchPage(url, "list");
    if (!html) html = await fetchPage(url, "list"); // 猫 category 在空结果时整轮重试
    if (!html) return diagCard();
    var cards = parseCards(html);
    if (!cards.length) {
      return [{
        id: "supjav-diag-parse",
        type: "url",
        title: "⚠诊断：页面已取回但解析出 0 张卡",
        posterPath: "", coverUrl: "", backdropPath: "",
        link: HOST + "/",
        mediaType: "movie",
        description: "取页通道：" + lastFetchReport + "；页面长度 " + html.length + "B。站方页面结构可能已变，把本卡文字发给维护者。"
      }];
    }
    return cards;
  } catch (e) {
    return diagCard("⚠诊断：列表异常 " + String((e && e.message) || e).slice(0, 60));
  }
}

async function search(params) {
  params = params || {};
  var kw = t(params.keyword || params.q || params.query || params.wd || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!kw) return [];
  var enc = encodeURIComponent(kw);
  var url = page === 1 ? HOST + "/?s=" + enc : HOST + "/page/" + page + "/?s=" + enc;
  try {
    var html = await fetchPage(url, "list");
    if (!html) return diagCard();
    return parseCards(html);
  } catch (e) {
    return diagCard("⚠诊断：搜索异常 " + String((e && e.message) || e).slice(0, 60));
  }
}

// ---------------- 详情解析（与猫蜘蛛 detail 同口径） ----------------
// 线路排序用猫口径；data-link 按 hex 去重（猫修复点：详情页有两组线路块）。

var LINE_ORDER = { VOE: 0, EVS: 10, LUC: 20, VAS: 30, FST: 35, ST: 40, TV: 90 };

function parseDetail(html, vid) {
  var s = String(html || "");
  var title = "";
  var tm = s.match(/<h1[^>]*>(.*?)<\/h1>/s);
  if (tm) title = cleanTitle(tm[1].replace(/<[^>]+>/g, ""));
  var pic = "";
  var pm = s.match(/background-image:\s*url\((https:\/\/img\.supjav\.com\/[^)]+)\)/);
  if (pm) pic = pm[1];
  if (!pic) {
    var im = s.match(/(https:\/\/img\.supjav\.com\/[^\s"'<>)]+\.(?:jpg|jpeg|png|webp)[^\s"'<>)]*)/i);
    if (im) pic = im[1];
  }
  if (pic.indexOf("//") === 0) pic = "https:" + pic;
  var views = "";
  var vm = s.match(/<span class="views">([^<]+)<\/span>/);
  if (vm) views = vm[1].trim();
  var tags = [];
  var tagRe = /href="https:\/\/supjav\.com\/(tag|actress)\/([^"/]+)"/g;
  var tg;
  while ((tg = tagRe.exec(s)) !== null) {
    var nm = tg[2].replace(/-/g, " ").trim();
    if (nm && tags.indexOf(nm) === -1) tags.push(nm);
  }
  var links = [];
  var lm;
  var linkRe = /data-link="([0-9a-f]{40,})"/g;
  while ((lm = linkRe.exec(s)) !== null) links.push(lm[1]);
  var names = [];
  var nmRe = /data-link="[0-9a-f]{40,}"[^>]*>([^<]{1,12})</g;
  while ((lm = nmRe.exec(s)) !== null) names.push(lm[1].trim());
  var seenHex = {};
  var lines = [];
  for (var i = 0; i < links.length; i++) {
    if (seenHex[links[i]]) continue;
    seenHex[links[i]] = true;
    var name = names[i] || ("线路" + (lines.length + 1));
    var ord = LINE_ORDER[name.toUpperCase()];
    lines.push({ name: name, hex: links[i], ord: ord == null ? 50 : ord, idx: i });
  }
  lines.sort(function (a, b) { return (a.ord - b.ord) || (a.idx - b.idx); });
  var desc = title;
  if (views) desc += "\n观看: " + views;
  if (tags.length) desc += "\n标签: " + tags.slice(0, 10).join(", ");
  return { title: title, pic: pic, desc: desc.slice(0, 600), lines: lines };
}

function lineToken(vid, name, hex, ch) {
  var tok = "supjav://v=" + vid + "&n=" + encodeURIComponent(name) + "&h=" + hex;
  if (ch) tok += "&ch=" + encodeURIComponent(ch);
  return tok;
}

function parseLineToken(tok) {
  var m = String(tok || "").match(/^supjav:\/\/v=(\d+)&n=([^&]*)&h=([0-9a-f]+)(?:&ch=([^&]*))?/i);
  if (!m) return null;
  var name = m[2];
  try { name = decodeURIComponent(m[2]); } catch (e) {}
  var ch = m[4] || "";
  try { ch = decodeURIComponent(ch); } catch (e) {}
  return { vid: m[1], name: name, hex: m[3], ch: ch };
}

function vidOf(link) {
  var s = unwrapLink(link);
  var m = s.match(/(\d+)\.html/) || s.match(/(\d+)\/?(?:[?#].*)?$/) || s.match(/^\s*(\d+)\s*$/);
  return m ? m[1] : "";
}

async function loadDetail(link) {
  var raw = unwrapLink(link);
  var vid = vidOf(raw);
  if (!vid) return { id: raw || "err", type: "url", title: "参数错误", description: "无法从链接解析出影片 id", link: raw };
  var durl = HOST + "/" + vid + ".html";
  try {
    var html = await fetchPage(durl, "detail");
    if (!html) {
      return { id: durl, type: "url", title: "载入失败", link: durl, description: "详情页各通道均未取到：" + lastFetchReport };
    }
    var d = parseDetail(html, vid);
    if (!d.lines.length) {
      return { id: durl, type: "url", title: d.title || ("SupJav " + vid), link: durl, posterPath: d.pic, coverUrl: d.pic, backdropPath: d.pic, description: "未找到播放地址" };
    }
    var episodes = [];
    for (var i = 0; i < d.lines.length; i++) {
      var tok = lineToken(vid, d.lines[i].name, d.lines[i].hex, lastWinChannel);
      episodes.push({ name: d.lines[i].name, id: tok, link: tok });
    }
    return {
      id: durl,
      type: "url",
      title: d.title || ("SupJav " + vid),
      link: durl,
      posterPath: d.pic,
      coverUrl: d.pic,
      backdropPath: d.pic,
      description: d.desc,
      episodes: episodes
    };
  } catch (e) {
    return { id: durl, type: "url", title: "请求错误", description: String((e && e.message) || e), link: durl };
  }
}

// ---------------- 播放解析（与猫蜘蛛 play 同构） ----------------
// lk1 手工读跳转拿嵌入地址 → 嵌入页按签名分派解包 → 直链；
// ST/VAS 服务端解不出的改嗅探嵌入页本身（播放器在自身会话里铸令牌）；
// 全灭兜底先探 Worker v2 /wrap 包装页，最后才回门页（不劣于旧版）。

function playHeadersFor(videoUrl, embedUrl, detailUrl) {
  var ref = detailUrl || HOST + "/";
  // VOE 系 CDN 防盗链口径与猫蜘蛛/hanbj 在真机验通的一致
  if (/cloudwindow-route|ugc-cdn/i.test(videoUrl)) ref = "https://jeremyparticipantanything.com/";
  else if (embedUrl) ref = embedUrl;
  return { "User-Agent": UA_PC, "Referer": ref };
}

// 从任意文本里直提流地址（猫 extractStream 同口径）
function extractStream(text) {
  var s = String(text || "");
  var m = s.match(/(https?:\/\/[^\s"'<>\\]+\.m3u8[^\s"'<>\\]*)/i);
  if (m && !/test-videos/i.test(m[1])) return m[1];
  var trimmed = s.trim();
  if (trimmed.charAt(0) === "{") {
    try {
      var j = JSON.parse(trimmed);
      var u = j.url || j.file || j.source || j.m3u8 || "";
      if (/^https?:\/\//i.test(u)) return u;
    } catch (e) {}
  }
  var mm = s.match(/(https?:\/\/[^\s"'<>\\]+\.mp4[^\s"'<>\\]*)/i);
  if (mm) return mm[1];
  return "";
}

// 主清单多档时挑最高档（RESOLUTION 优先，其次 BANDWIDTH）
async function pickTopVariant(url, headers) {
  if (!/\.m3u8(\?|$)/i.test(url)) return url;
  try {
    var r = await httpRaw(url, headers, 20000);
    var text = r.text || "";
    if (text.indexOf("#EXT-X-STREAM-INF") === -1) return url;
    var lines = text.split(/\r?\n/);
    var best = null;
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
      var cand = { uri: uri, h: rm ? parseInt(rm[2], 10) : 0, bw: bm ? parseInt(bm[1], 10) : 0 };
      if (!best || cand.h > best.h || (cand.h === best.h && cand.bw > best.bw)) best = cand;
    }
    if (!best) return url;
    if (/^https?:\/\//i.test(best.uri)) return best.uri;
    return resolveUrl(best.uri, url);
  } catch (e) {
    return url;
  }
}

// 验一份清单地址真能出 #EXTM3U
async function verifyPlaylist(url, headers) {
  var r = await httpRaw(url, headers, 20000);
  var text = r.text || "";
  return r.status === 200 && text.indexOf("#EXTM3U") > -1 ? text : "";
}

// ---------- VOE 家族解包（与猫蜘蛛/hanbj 同一算法） ----------
function voeDecode(html) {
  try {
    var m = String(html || "").match(/<script[^>]*type=["']application\/json["'][^>]*>(.*?)<\/script>/s);
    if (!m) return {};
    var raw = m[1].trim();
    try {
      var j = JSON.parse(raw);
      raw = (Object.prototype.toString.call(j) === "[object Array]" && j.length) ? String(j[0]) : raw;
    } catch (e) {}
    var s = String(raw);
    var keys = ["@$", "^^", "~@", "%?", "*~", "!!", "#&"];
    for (var ki = 0; ki < keys.length; ki++) s = s.split(keys[ki]).join("_");
    s = s.split("_").join("");
    var tt = b64d(rot13(s));
    var shifted = "";
    for (var ci = 0; ci < tt.length; ci++) shifted += String.fromCharCode(tt.charCodeAt(ci) - 3);
    tt = b64d(shifted.split("").reverse().join(""));
    var cfg = JSON.parse(tt);
    return cfg && typeof cfg === "object" ? cfg : {};
  } catch (e) {
    return {};
  }
}

// ---------- Dean-Edwards packer 解包（EVS/LUC 等打包页，猫蜘蛛同实现） ----------
function unpackPacker(html) {
  var m = String(html || "").match(/eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?\}\('([\s\S]*?)',(\d+),(\d+),'([\s\S]*?)'\.split\('\|'\)\)\)/);
  if (!m) return "";
  var p = m[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  var radix = parseInt(m[2], 10);
  var count = parseInt(m[3], 10);
  var keys = m[4].split("|");
  for (var c = count - 1; c >= 0; c--) {
    if (keys[c]) {
      var tok = c.toString(radix).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      (function (replacement) {
        p = p.replace(new RegExp("\\b" + tok + "\\b", "g"), function () { return replacement; });
      })(keys[c]);
    }
  }
  return p;
}

function hlsFromUnpacked(text) {
  var s = String(text || "");
  var found = [];
  var lm = s.match(/links\s*=\s*(\{[\s\S]*?\});/);
  var scope = lm ? lm[1] : s;
  var re = /["']?(hls\d+)["']?\s*:\s*["'](https?:\/\/[^"']+)["']/g;
  var mm;
  while ((mm = re.exec(scope)) !== null) {
    found.push({ key: mm[1], url: mm[2].replace(/\\\//g, "/") });
  }
  if (!found.length) {
    var any = s.match(/https?:\/\/[^\s"'<>\\]+\.(?:m3u8|txt)[^\s"'<>\\]*/g) || [];
    for (var i = 0; i < any.length; i++) found.push({ key: "hls", url: any[i] });
  }
  // 优先真 .m3u8（hls4 > hls2 > 其他），.txt 伪装清单最后（猫口径）
  function rank(f) {
    var isTxt = /\.txt(\?|$)/i.test(f.url);
    var n = parseInt((f.key.match(/\d+/) || ["0"])[0], 10);
    return (isTxt ? 100 : 0) - n;
  }
  found.sort(function (a, b) { return rank(a) - rank(b); });
  var out = [];
  for (var j = 0; j < found.length; j++) out.push(found[j].url);
  return out;
}

// ---------- Streamtape：求值 innerHTML 拼接表达式提 get_video 候选 ----------
// 只支持 ST 页面实际出现的形态：字符串字面量、+、括号、.substring/.slice。
function evalConcatExpr(expr) {
  var s = String(expr || "");
  var pos = 0;
  function skipWs() { while (pos < s.length && /\s/.test(s.charAt(pos))) pos++; }
  function parseStr() {
    var q = s.charAt(pos);
    if (q !== '"' && q !== "'") return null;
    pos++;
    var out = "";
    while (pos < s.length) {
      var c = s.charAt(pos);
      if (c === "\\" && pos + 1 < s.length) {
        var n = s.charAt(pos + 1);
        out += (n === "n" ? "\n" : n === "t" ? "\t" : n);
        pos += 2;
        continue;
      }
      if (c === q) { pos++; return out; }
      out += c;
      pos++;
    }
    return null;
  }
  function parseNum() {
    var m = s.slice(pos).match(/^-?\d+/);
    if (!m) return null;
    pos += m[0].length;
    return parseInt(m[0], 10);
  }
  function parsePrimary() {
    skipWs();
    var c = s.charAt(pos);
    if (c === "(") {
      pos++;
      var v = parseExpr();
      skipWs();
      if (s.charAt(pos) === ")") pos++;
      return v;
    }
    if (c === '"' || c === "'") return parseStr();
    return null;
  }
  function parseTerm() {
    var v = parsePrimary();
    if (v === null) return null;
    for (;;) {
      skipWs();
      var mm = s.slice(pos).match(/^\.(substring|slice)\s*\(/);
      if (!mm) break;
      pos += mm[0].length;
      skipWs();
      var a = parseNum();
      skipWs();
      var b = null;
      if (s.charAt(pos) === ",") { pos++; skipWs(); b = parseNum(); skipWs(); }
      if (s.charAt(pos) === ")") pos++;
      if (a === null) return null;
      v = (mm[1] === "substring") ? (b === null ? v.substring(a) : v.substring(a, b)) : (b === null ? v.slice(a) : v.slice(a, b));
    }
    return v;
  }
  function parseExpr() {
    var v = parseTerm();
    if (v === null) return null;
    for (;;) {
      skipWs();
      if (s.charAt(pos) !== "+") break;
      pos++;
      var rhs = parseTerm();
      if (rhs === null) return null;
      v = v + rhs;
    }
    return v;
  }
  try {
    var out = parseExpr();
    skipWs();
    if (pos < s.length && s.charAt(pos) !== ";") return null;
    return out;
  } catch (e) {
    return null;
  }
}

function stCandidates(html) {
  var s = String(html || "");
  var evaled = [];
  var re = /innerHTML\s*=\s*([^;]+);/g;
  var m;
  while ((m = re.exec(s)) !== null) {
    var v = evalConcatExpr(m[1]);
    if (v && v.indexOf("get_video") > -1) evaled.push(v);
  }
  var seen = {};
  var out = [];
  function add(u) {
    if (!u) return;
    u = String(u).trim();
    if (u.indexOf("//") === 0) u = "https:" + u;
    else if (!/^https?:\/\//i.test(u)) {
      if (/^[\w.-]+\.[a-z]{2,}\//i.test(u)) u = "https://" + u;
      else return;
    }
    u = u.replace(/&amp;/g, "&");
    if (u.indexOf("get_video") === -1 || seen[u]) return;
    // 诱饵域名（streamtape.cob 之类仿冒后缀）剔除：只认真域（猫口径）
    var h = hostOf(u);
    if (!/(^|\.)streamtape\.com$|(^|\.)amtape\.com$/.test(h)) return;
    seen[u] = true;
    out.push(u);
  }
  // 页面 JS 的最后一次有效赋值才是真地址，前面的多为诱饵
  for (var i = evaled.length - 1; i >= 0; i--) add(evaled[i]);
  var lit = s.match(/https?:\/\/[^\s"'<>]+get_video\?[^\s"'<>]+/g) || [];
  for (var j = 0; j < lit.length; j++) add(lit[j]);
  var lit2 = s.match(/\/\/[\w.-]+get_video\?[^\s"'<>]+/g) || [];
  for (var k = 0; k < lit2.length; k++) add(lit2[k]);
  return out;
}

// ST 的错误响应是 HTTP 200/403 + JSON {"status":...}，据此判活（猫口径）
async function probeStFile(url, referer) {
  var r = await httpRaw(url, { "User-Agent": UA_PC, "Referer": referer, "Range": "bytes=0-1023" }, 20000);
  if (!r.status) return false;
  var head = String(r.text || "").slice(0, 120);
  if (head.charAt(0) === "{" && /"status"\s*:/.test(head)) return false;
  return r.status === 200 || r.status === 206;
}

// ---------- VAS 系（vvaassjjav 等）：/api/stream 换 streaming_url ----------
// 页面 JS：POST {origin}/api/stream {filecode, device, codecs} →
// {streaming_url, fallback_url}。猫蜘蛛在有嵌入页正文时不另取 cookie
// （cookie 只在其无正文分支才取），本版主路径同此；API 在机房出口极慢，
// 猫给 30 秒上限、超时回退嵌入页嗅探，本版同。
async function resolveVasApi(embedUrl) {
  var pathM = String(embedUrl || "").match(/\/e\/([A-Za-z0-9]+)/);
  if (!pathM) return null;
  var origin = originOf(embedUrl);
  if (!origin) return null;
  var j = await httpPostJson(origin + "/api/stream",
    { filecode: pathM[1], device: "web", codecs: [] },
    {
      "User-Agent": UA_PC,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Origin": origin,
      "Referer": embedUrl
    }, 30000);
  if (!j) return null;
  var su = j.streaming_url || j.fallback_url || "";
  return /^https?:\/\//i.test(su) ? su : null;
}

// ---------- lk1 取嵌入地址（猫 lkResolveEmbed 同构） ----------
// ?c= 读 Location 头（运行时未跟随时）/采用已跟随正文（运行时跟随时）；
// 直试 2 次；失败取门页 OLID 再试；再失败试 supjav-fetch Worker 备用出口
// （v2 手工跟跳转回 x-final-url；v1 回 "host not allowed" 自动判败）。
// 返回 {embedUrl, embedBody?} 或 null；过程记入 trace 供兜底卡标注断步。

function isGateBody(s) {
  return /OLID|start_player/.test(String(s || ""));
}

async function lkResolveEmbed(hex, detailUrl, trace) {
  var gateUrl = LK_BASE + "?l=" + hex;
  var navHeaders = {
    "User-Agent": UA_PC,
    "Referer": gateUrl,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Sec-Fetch-Dest": "iframe",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site"
  };
  async function tryC(h, tag) {
    var cUrl = LK_BASE + "?c=" + reverseStr(h);
    var r = await httpRaw(cUrl, navHeaders, 15000);
    var loc = r.headers.location || "";
    if (loc) {
      var abs = resolveUrl(loc, cUrl);
      var hashIdx = abs.indexOf("#");
      if (hashIdx > -1) abs = abs.slice(0, hashIdx);
      if (abs && !/supjav\.php/.test(abs)) { trace.push(tag + ":loc"); return { embedUrl: abs }; }
      if (abs) { trace.push(tag + ":loc-self"); return { embedUrl: abs }; }
    }
    var body = r.text || "";
    // 运行时已自动跟随跳转：正文就是嵌入页，finalUrl 是其真地址
    if (r.finalUrl && r.finalUrl !== cUrl && body.length > 300 && !isGateBody(body)) {
      trace.push(tag + ":followed");
      return { embedBody: body, embedUrl: r.finalUrl };
    }
    // 个别出口下 ?c= 直接回嵌入页正文（无跳转）
    if (body.length > 800 && !isGateBody(body)) {
      trace.push(tag + ":body");
      return { embedBody: body, embedUrl: cUrl };
    }
    trace.push(tag + ":" + (r.status ? ("st" + r.status + "/" + body.length + "B") : "err"));
    return null;
  }
  for (var i = 0; i < 2; i++) {
    var got = await tryC(hex, "c" + (i + 1));
    if (got) return got;
  }
  // 门页拿 OLID 再试（OLID 实测与 data-link hex 相同，但形态以站方为准）
  var gate = await httpRaw(gateUrl, {
    "User-Agent": UA_PC,
    "Referer": detailUrl,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Sec-Fetch-Dest": "iframe",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site"
  }, 15000);
  var gateBody = gate.text || "";
  var olidM = gateBody.match(/OLID\s*=\s*['"]([0-9a-fA-F]{32,})['"]/) || gateBody.match(/["']([0-9a-fA-F]{32,})["']/);
  if (olidM && olidM[1] && olidM[1] !== hex) {
    var got2 = await tryC(olidM[1], "olid-c");
    if (got2) return got2;
  } else {
    trace.push("gate:" + (gateBody ? (gateBody.length + "B") : "err"));
  }
  // 备用出口：supjav-fetch Worker（v1 自动判败，不影响主通道）
  try {
    var wUrl = FETCH_WORKER + "/?u=" + encodeURIComponent(LK_BASE + "?c=" + reverseStr(hex));
    var w = await httpRaw(wUrl, { "User-Agent": UA_PC }, 30000);
    var finalUrl = w.headers["x-final-url"] || "";
    var wbody = w.text || "";
    if (finalUrl && !/supjav\.php/.test(finalUrl) && wbody.length > 300) {
      trace.push("worker:final");
      return { embedBody: wbody, embedUrl: finalUrl };
    }
    if (wbody.length > 800 && !/host not allowed|bad url|upstream blocked/.test(wbody) && !isGateBody(wbody)) {
      trace.push("worker:body");
      return { embedBody: wbody, embedUrl: LK_BASE + "?c=" + reverseStr(hex) };
    }
    trace.push("worker:bad" + wbody.length + "B");
  } catch (e) {
    trace.push("worker:err");
  }
  return null;
}

// ---------- 嵌入页解析分派（猫 resolveEmbed 同构） ----------
// 成功回 {url, header}（直链）；ST 令牌服务端试活不过 / VAS 接口无果时回
// {sniff: embedUrl}（播放器在自身会话里打开嵌入页）；全败回 null。
async function resolveEmbed(embedUrl, embedBody, detailUrl, trace) {
  var html = embedBody || "";
  var finalUrl = embedUrl;
  if (!html) {
    var r0 = await httpRaw(embedUrl, { "User-Agent": UA_PC, "Referer": detailUrl }, 25000);
    html = r0.text || "";
    if (r0.finalUrl && r0.finalUrl !== embedUrl) finalUrl = r0.finalUrl;
  }
  if (!html) { trace.push("emb:empty"); return null; }
  // VOE 系落地页先给一跳 JS 跳转到镜像域真嵌入页
  var jsJump = html.match(/window\.location\.href\s*=\s*'(https?:\/\/[^']+)'/) ||
    html.match(/window\.location\.href\s*=\s*"(https?:\/\/[^"]+)"/);
  if (jsJump && html.length < 3000 && !/jwplayer|application\/json|get_video/.test(html)) {
    var r2 = await httpRaw(jsJump[1], { "User-Agent": UA_PC, "Referer": embedUrl }, 25000);
    if (r2.text) { html = r2.text; finalUrl = jsJump[1]; trace.push("emb:jsjump"); }
  }

  var direct0 = extractStream(html);
  // 1) Streamtape 签名：提候选逐个试活；令牌绑铸造出口 IP，服务端试活
  //    不过不代表播放器不行——交回嵌入页让播放器在自己的会话里铸造。
  if (html.indexOf("get_video") > -1) {
    var cands = stCandidates(html);
    for (var ci = 0; ci < cands.length; ci++) {
      if (await probeStFile(cands[ci], finalUrl)) {
        trace.push("st:ok");
        return { url: cands[ci], header: playHeadersFor(cands[ci], finalUrl, detailUrl) };
      }
    }
    if (cands.length) { trace.push("st:sniff"); return { sniff: finalUrl }; }
    trace.push("st:nocand");
  }
  // 2) VAS 系 API 型
  if (/\/api\/stream/.test(html) && /filecode/i.test(html)) {
    var su = await resolveVasApi(finalUrl);
    if (su) {
      var hdrV = playHeadersFor(su, finalUrl, detailUrl);
      var topV = /\.m3u8/i.test(su) ? await pickTopVariant(su, hdrV) : su;
      trace.push("vas:ok");
      return { url: topV, header: playHeadersFor(topV, finalUrl, detailUrl) };
    }
    trace.push("vas:sniff");
    return { sniff: finalUrl };
  }
  // 3) VOE 家族混淆 JSON
  var cfg = voeDecode(html);
  var src = String(cfg.source || "");
  if (/\.m3u8/i.test(src)) {
    var hdr = playHeadersFor(src, finalUrl, detailUrl);
    trace.push("voe:ok");
    return { url: await pickTopVariant(src, hdr), header: hdr };
  }
  var dau = String(cfg.direct_access_url || "");
  if (/^https?:\/\//i.test(dau)) { trace.push("voe:dau"); return { url: dau, header: playHeadersFor(dau, finalUrl, detailUrl) }; }
  if (/^https?:\/\//i.test(src)) { trace.push("voe:src"); return { url: src, header: playHeadersFor(src, finalUrl, detailUrl) }; }
  // 4) packer 打包（EVS/LUC 等）：解包提 links.hls*，逐个验 #EXTM3U 后挑最高档
  if (/eval\(function\(p,a,c,k/.test(html)) {
    var unpacked = unpackPacker(html);
    var urls = hlsFromUnpacked(unpacked);
    for (var ui = 0; ui < Math.min(3, urls.length); ui++) {
      var hdrP = playHeadersFor(urls[ui], finalUrl, detailUrl);
      var pl = await verifyPlaylist(urls[ui], hdrP);
      if (pl) {
        var topP = await pickTopVariant(urls[ui], hdrP);
        trace.push("packer:ok");
        return { url: topP, header: hdrP };
      }
    }
    trace.push("packer:fail" + urls.length);
  }
  // 5) 明文 / jwplayer 兜底
  if (direct0) {
    var hdrD = playHeadersFor(direct0, finalUrl, detailUrl);
    var topD = /\.m3u8/i.test(direct0) ? await pickTopVariant(direct0, hdrD) : direct0;
    trace.push("plain:ok");
    return { url: topD, header: hdrD };
  }
  var jw = html.match(/jwplayer\([^)]*\)\.setup\(\{\s*file:\s*"([^"]+)"/i);
  if (jw) {
    var f = jw[1].replace(/\\\//g, "/");
    if (/^https?:\/\//i.test(f)) {
      var hdrJ = playHeadersFor(f, finalUrl, detailUrl);
      var topJ = /\.m3u8/i.test(f) ? await pickTopVariant(f, hdrJ) : f;
      trace.push("jw:ok");
      return { url: topJ, header: hdrJ };
    }
  }
  trace.push("emb:nomatch");
  return null;
}

// supjav-fetch v2 的 /wrap 探活（包装页把门页嵌进 iframe，绕门页顶层自毁）；
// v1 在岗时回 "host not allowed"，探活自动阴性、无副作用（猫同口径）。
async function probeWrap(gateUrl) {
  try {
    var r = await httpRaw(FETCH_WORKER + "/wrap?u=" + encodeURIComponent(gateUrl), { "User-Agent": UA_PC }, 10000);
    return (r.text || "").indexOf("<iframe") > -1;
  } catch (e) {
    return false;
  }
}

// 单条线路解析：lk1 拿嵌入地址 → 嵌入页解算 → 直链/嵌入页嗅探 →
// /wrap 框架嗅探（v2 在线时）→ 门页嗅探（最后兜底，带断步短码）。
async function resolveLine(vid, name, hex) {
  var detailUrl = HOST + "/" + vid + ".html";
  var gateUrl = LK_BASE + "?l=" + hex;
  var trace = [];
  function res(url, suffix, head, desc) {
    var o = {
      name: name + (suffix || ""),
      url: url,
      playerType: "app",
      customHeaders: head || { "User-Agent": UA_PC, "Referer": detailUrl }
    };
    if (desc) o.description = desc;
    return [o];
  }
  try {
    var lk = await lkResolveEmbed(hex, detailUrl, trace);
    if (lk && (lk.embedUrl || lk.embedBody)) {
      var got = await resolveEmbed(lk.embedUrl || "", lk.embedBody || "", detailUrl, trace);
      if (got && got.url) {
        return res(got.url, "", got.header);
      }
      if (got && got.sniff) {
        return res(got.sniff, "（嗅探）", { "User-Agent": UA_PC, "Referer": detailUrl },
          "服务端解算按设计回退：嵌入页嗅探（" + trace.join(" ") + "）");
      }
      // 嵌入页拿到了但没解出：嗅探嵌入页本身（不再回会自毁的门页）
      if (lk.embedUrl && !/supjav\.php/.test(lk.embedUrl)) {
        return res(lk.embedUrl, "（嗅探）", { "User-Agent": UA_PC, "Referer": detailUrl },
          "嵌入页已取到但未解出直链，改嗅探嵌入页（" + trace.join(" ") + "）");
      }
    }
  } catch (e) {
    trace.push("exc:" + String((e && e.message) || e).slice(0, 40));
  }
  // 全灭兜底：Worker v2 在线时经 /wrap 包装页嗅探；否则维持旧行为给门页
  if (await probeWrap(gateUrl)) {
    return res(FETCH_WORKER + "/wrap?u=" + encodeURIComponent(gateUrl), "（嗅探·框架）",
      { "User-Agent": UA_PC, "Referer": detailUrl },
      "经 supjav-fetch v2 包装页 iframe 嵌入门页后嗅探（" + trace.join(" ") + "）");
  }
  return res(gateUrl, "（嗅探·lk1_c_fail）", { "User-Agent": UA_PC, "Referer": detailUrl },
    "解析断步 lk1_c_fail；步骤：" + trace.join(" "));
}

// stream 模块入口：
//  - 入参是线路 token（supjav://…）→ 只解析该线
//  - 入参是详情页链接 → 解析优先级最高的一条线（排序后第一条）
async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  if (!raw && params.item) raw = params.item.link || params.item.id || params.item.url || "";
  raw = unwrapLink(raw);
  try {
    var tok = parseLineToken(raw);
    if (tok) {
      return await resolveLine(tok.vid, tok.name, tok.hex);
    }
    var vid = vidOf(raw);
    if (vid) {
      var durl = HOST + "/" + vid + ".html";
      var html = await fetchPage(durl, "detail");
      if (!html) return [];
      var d = parseDetail(html, vid);
      if (!d.lines.length) return [];
      return await resolveLine(vid, d.lines[0].name, d.lines[0].hex);
    }
    return [];
  } catch (e) {
    return [];
  }
}
