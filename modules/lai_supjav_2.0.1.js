// SupJav for REX (lai_supjav v2.0.1)
// 来源蓝图：mira-cat 蜘蛛 py_supjav（只读参考，未改动）。后端：https://supjav.com
//
// 与 1.0.0 的根本区别（旧版为什么全线瘫痪）：
//  1) 取页：旧版只走第三方代理 py.fzcrym.link:1314，该代理现已 502 宕机，
//     列表/详情/搜索随之全断。2.0.0 改为四通道竞速取页并逐个校验真页面：
//     App 直连 → 自有 Worker(supjav-fetch) → fzcrym /fs → fzcrym /page。
//     supjav.com 的 Cloudflare 是 "Attention Required" 型 IP 信誉硬封：
//     机房出口必死，但手机住宅/移动 IP 直连有真实机会，旧版却从不直连。
//  2) 播放：旧版在 loadDetail 里把全部线路串行解析一遍（慢且一线卡死全线），
//     且只有 Streamtape 一家做了提取。2.0.0 改为详情只出线路表（episodes），
//     loadResource 按用户所选线路单独解析：lk1 双链（?c=反转 / ?l=换 OLID）
//     → 嵌入页按宿主分派：VOE 家族（VOE/EVS/VAS/LUC，同系播放器）走六层解包
//     （与包内已验通的 lai_hanbj 同一解码器）；Streamtape 走 innerHTML 赋值
//     表达式求值提取 get_video 候选并逐个试活；解不出时回退 lk1 ?l= 地址
//     交播放器嗅探（与蜘蛛 parse:1 兜底同口径），保证每条线都有可点目标。
//
// 2.0.1（真机二轮）：真机上解析仍全线回退嗅探。本地用截图同片 token 复现
// 坐实断步在 lk1 的 ?c= 跳转（302 但 Location 为空，跟随跳转的 HTTP 层抛错、
// 正文永远拿不到）。改：lk1 取页双通道竞速（直连+supjav-fetch Worker）、
// 补浏览器 iframe 导航头、详情 token 自带取页通道提示、失败短码遥测
// （lk1_c_fail/lk1_l_fail/emb_fail/voe_fail/st_fail 写进卡名）、Worker v2
// 在线时多一条「嗅探·框架」兜底。详见 ports/FIX_supjav2.md。

WidgetMetadata = {
  id: "lai_supjav",
  title: "SupJav",
  description: "SupJav（supjav.com）：最新/热门/趋势/有码/无码/素人/中文字幕/破解/英文字幕，多线路解析播放（VOE家族解包/Streamtape提取）",
  author: "lai",
  version: "2.0.1",
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
// 一律先解包出链接（与包内已验收模块 mitao 的 unwrapLink 同口径）。
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

function rot13(s) {
  return String(s).replace(/[a-zA-Z]/g, function (c) {
    var base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

var B64TAB = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// base64 → UTF-8 字符串（纯 JS，与 Buffer 路径等价；移植自包内 lai_hanbj 已验通实现）
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

// ---------------- HTTP ----------------

// 统一取文本：返回 {status, text, headers}，永不抛错。headers 仅在运行时
// 暴露时才有（取不到为 null），只作遥测/最终地址提示，不作解析的必要条件。
async function httpGet(url, headers, timeoutMs) {
  try {
    var opts = { headers: headers || { "User-Agent": UA } };
    if (timeoutMs) opts.timeout = timeoutMs;
    var res = await Widget.http.get(url, opts);
    var data = res && res.data != null ? res.data : "";
    var text = typeof data === "string" ? data : JSON.stringify(data);
    var status = 0;
    if (res) {
      if (typeof res.status === "number") status = res.status;
      else if (typeof res.statusCode === "number") status = res.statusCode;
    }
    var hdrs = null;
    if (res && res.headers && typeof res.headers === "object") hdrs = res.headers;
    return { status: status, text: text || "", headers: hdrs };
  } catch (e) {
    return { status: 0, text: "", error: String((e && e.message) || e) };
  }
}

function hdrGet(hdrs, name) {
  if (!hdrs) return "";
  var keys = Object.keys(hdrs);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].toLowerCase() === name) return String(hdrs[keys[i]] || "");
  }
  return "";
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": referer || HOST + "/"
  };
}

// ---------------- 取页：四通道竞速 ----------------
// supjav.com 的 CF 是 IP 信誉硬封（Attention Required）：
// 直连只在住宅/移动出口有机会；Worker 是另一条独立出口；fzcrym 是蜘蛛原装
// 代理（2026-10 实测 502 宕机中，恢复后仍可用）。每条通道的返回都必须通过
// 真页面校验才采用，胜出通道会被记住、本会话内优先。

var CHANNELS = [
  { name: "direct", build: function (u) { return u; } },
  { name: "worker", build: function (u) { return FETCH_WORKER + "/?u=" + encodeURIComponent(u); } },
  { name: "fs", build: function (u) { return FZ_FS + encodeURIComponent(u); } },
  { name: "page", build: function (u) { return FZ_PAGE + encodeURIComponent(u); } }
];
var winChannelIdx = -1;
var lastFetchReport = "";

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

// 返回真页面 HTML；全通道失败返回 ""，并把每条通道的结果记进 lastFetchReport。
async function fetchPage(url, kind) {
  var order = [];
  var i, ch;
  if (winChannelIdx >= 0) order.push(winChannelIdx);
  for (i = 0; i < CHANNELS.length; i++) if (i !== winChannelIdx) order.push(i);
  var notes = [];
  for (var oi = 0; oi < order.length; oi++) {
    ch = CHANNELS[order[oi]];
    var tries = ch.name === "fs" ? 2 : 1; // fs 历史上有抖动，给一次重试
    for (var k = 0; k < tries; k++) {
      var r = await httpGet(ch.build(url), pageHeaders(HOST + "/"), 60000);
      if (r.text && looksLikePage(r.text, kind)) {
        winChannelIdx = order[oi];
        lastFetchReport = ch.name + " 通道取页成功（" + r.text.length + "B）";
        return r.text;
      }
      notes.push(ch.name + (k ? "#2" : "") + ":" + (r.text ? ("len" + r.text.length + (isBlockedPage(r.text) ? "/CF拦截页" : "/非目标页")) : ("无响应" + (r.error ? "(" + r.error.slice(0, 40) + ")" : ""))));
    }
  }
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
    description: "四通道取页结果：" + (lastFetchReport || "无记录") +
      "。direct=手机直连（CF 按 IP 信誉封机房，手机直连可能通过）；worker=自有 supjav-fetch Worker；fs/page=原第三方代理（现宕机中）。把本卡文字发给维护者可定位断点。"
  }];
}

// ---------------- 列表解析（与蜘蛛 parseCards 同口径 + 兜底扫链） ----------------

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
  // 主路：蜘蛛同款 <div class="post"> 分块
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
  // 兜底：整页扫 <a href=".../<id>.html"> 锚点（主题结构变化时保命）
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
    var html = await fetchPage(catUrl(tid, page, sort), "list");
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

// ---------------- 详情解析（与蜘蛛 detail 同口径） ----------------

// 可解码的 VOE 家族排最前；ST 次之（提取+试活）；其余按蜘蛛口径垫底。
var LINE_ORDER = { VOE: 0, EVS: 5, VAS: 6, LUC: 7, FST: 10, ST: 20, TV: 90 };

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
  var lines = [];
  for (var i = 0; i < links.length; i++) {
    var name = names[i] || ("线路" + (i + 1));
    lines.push({ name: name, hex: links[i], ord: (LINE_ORDER[name.toUpperCase()] != null ? LINE_ORDER[name.toUpperCase()] : 50), idx: i });
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

// 详情取页胜出通道名（供 loadResource 排 lk1 通道顺序时参考；冷进程无 token 时为空）
function winChannelName() {
  if (winChannelIdx >= 0 && CHANNELS[winChannelIdx]) return CHANNELS[winChannelIdx].name;
  return "";
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
      return { id: durl, type: "url", title: "载入失败", link: durl, description: "详情页四通道均未取到：" + lastFetchReport };
    }
    var d = parseDetail(html, vid);
    if (!d.lines.length) {
      return { id: durl, type: "url", title: d.title || ("SupJav " + vid), link: durl, posterPath: d.pic, coverUrl: d.pic, backdropPath: d.pic, description: "未找到播放地址" };
    }
    var episodes = [];
    var chName = winChannelName();
    for (var i = 0; i < d.lines.length; i++) {
      var tok = lineToken(vid, d.lines[i].name, d.lines[i].hex, chName);
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

// ---------------- 播放解析 ----------------

function playHeadersFor(videoUrl, embedUrl, detailUrl) {
  var ref = detailUrl || HOST + "/";
  // VOE 系 CDN 的防盗链口径与包内 lai_hanbj 一致
  if (/cloudwindow-route|ugc-cdn/i.test(videoUrl)) ref = "https://jeremyparticipantanything.com/";
  else if (embedUrl) ref = embedUrl;
  return { "User-Agent": UA, "Referer": ref };
}

// 主清单多档时挑最高档（RESOLUTION 优先，其次 BANDWIDTH）；非主清单原样返回。
async function pickTopVariant(url, headers) {
  if (!/\.m3u8(\?|$)/i.test(url)) return url;
  try {
    var r = await httpGet(url, headers, 20000);
    var text = r.text || "";
    if (text.indexOf("#EXT-X-STREAM-INF") === -1) return url;
    var lines = text.split(/\r?\n/);
    var best = null;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line.indexOf("#EXT-X-STREAM-INF") !== 0) continue;
      var uri = "";
      for (var j = i + 1; j < lines.length; j++) {
        var u = lines[j].trim();
        if (u) { uri = u; break; }
      }
      if (!uri) continue;
      var rm = line.match(/RESOLUTION=(\d+)x(\d+)/i);
      var bm = line.match(/BANDWIDTH=(\d+)/i);
      var cand = { uri: uri, h: rm ? parseInt(rm[2], 10) : 0, bw: bm ? parseInt(bm[1], 10) : 0 };
      if (!best || cand.h > best.h || (cand.h === best.h && cand.bw > best.bw)) best = cand;
    }
    if (!best) return url;
    if (/^https?:\/\//i.test(best.uri)) return best.uri;
    var base = url.slice(0, url.lastIndexOf("/") + 1);
    return base + best.uri.replace(/^\.\//, "");
  } catch (e) {
    return url;
  }
}

// 从任意文本里直提流地址：m3u8 优先，其次 mp4，再次 JSON 的 url/file/source 字段。
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

// VOE 家族六层解包（与包内 lai_hanbj 的 voeDecode 同一算法，已在真机验通）：
// application/json 块 → 替符号 → rot13 → b64 → 逐字 -3 → 逆序 b64 → JSON 配置。
function voeDecode(html) {
  try {
    var m = String(html || "").match(/<script[^>]*type=["']application\/json["'][^>]*>(.*?)<\/script>/s);
    if (!m) return {};
    var blk = t(m[1]);
    var raw = blk;
    try {
      var j = JSON.parse(blk);
      raw = (Object.prototype.toString.call(j) === "[object Array]" && j.length) ? String(j[0]) : blk;
    } catch (e2) {
      raw = blk;
    }
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

// 对 VOE 家族嵌入页正文做解析：明文 m3u8 → JW file → 解包配置 source。
async function resolveVoeBody(html, embedUrl, detailUrl) {
  var s = extractStream(html);
  if (s && /\.m3u8/i.test(s)) return await pickTopVariant(s, playHeadersFor(s, embedUrl, detailUrl)).then(function (u) { return { url: u }; });
  if (s) return { url: s };
  var jw = String(html || "").match(/jwplayer\([^)]*\)\.setup\(\{\s*file:\s*"([^"]+)"/i);
  if (jw) {
    var f = jw[1].replace(/\\\//g, "/");
    if (/^https?:\/\//i.test(f)) {
      if (/\.m3u8/i.test(f)) return { url: await pickTopVariant(f, playHeadersFor(f, embedUrl, detailUrl)) };
      return { url: f };
    }
  }
  var cfg = voeDecode(html);
  var src = t(cfg.source);
  if (/\.m3u8/i.test(src)) return { url: await pickTopVariant(src, playHeadersFor(src, embedUrl, detailUrl)) };
  var dau = t(cfg.direct_access_url);
  if (/^https?:\/\//i.test(dau)) return { url: dau };
  if (/^https?:\/\//i.test(src)) return { url: src };
  return null;
}

// ---- Streamtape：求值 innerHTML 赋值表达式，提取 get_video 候选 ----

// 只支持 ST 页面实际出现的形态：字符串字面量、+、括号、.substring(a[,b])/.slice(a[,b])。
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
    seen[u] = true;
    out.push(u);
  }
  // 页面 JS 的最后一次有效赋值才是真地址，前面的多为诱饵
  for (var i = evaled.length - 1; i >= 0; i--) add(evaled[i]);
  // 再补：任何字面量里完整的 get_video 地址
  var lit = s.match(/https?:\/\/[^\s"'<>]+get_video\?[^\s"'<>]+/g) || [];
  for (var j = 0; j < lit.length; j++) add(lit[j]);
  var lit2 = s.match(/\/\/[\w.-]+get_video\?[^\s"'<>]+/g) || [];
  for (var k = 0; k < lit2.length; k++) add(lit2[k]);
  return out;
}

// ST 的错误响应是 HTTP 200/403 + JSON {"status":...}，据此判活。
async function probeStFile(url, referer) {
  var r = await httpGet(url, { "User-Agent": UA, "Referer": referer, "Range": "bytes=0-1023" }, 20000);
  if (!r.text && r.status === 0) return false;
  var head = String(r.text || "").slice(0, 120);
  if (head.charAt(0) === "{" && /"status"\s*:/.test(head)) return false;
  if (r.status === 200 || r.status === 206) return true;
  return false;
}

async function resolveStBody(html, embedUrl) {
  var cands = stCandidates(html);
  if (!cands.length) return null;
  for (var i = 0; i < cands.length; i++) {
    if (await probeStFile(cands[i], embedUrl)) return { url: cands[i] };
  }
  // 全部试活失败（机房出口常被 ST 掐断）：仍回最优候选，设备住宅 IP 同会话下有机会直通
  return { url: cands[0], unverified: true };
}

// 从 lk1 返回正文里找嵌入页地址（302 跟随后正文已是嵌入页的情况由调用方先判正文签名）
function firstEmbedUrl(text) {
  var s = String(text || "");
  var pats = [
    /https?:\/\/[^\s"'<>]*(?:voe\.sx|streamtape|amtape\.com|evsishere|vvaassjjav|luminscdn|filemoon|byse)[^\s"'<>]*/i,
    /<iframe[^>]+src=["'](https?:\/\/[^"']+)["']/i
  ];
  for (var i = 0; i < pats.length; i++) {
    var m = s.match(pats[i]);
    if (m) return m[1] || m[0];
  }
  return "";
}

function bodyLooksEmbed(html) {
  var s = String(html || "");
  return s.indexOf("get_video") > -1 || s.indexOf("application/json") > -1 || /jwplayer/i.test(s) || s.indexOf("<iframe") > -1;
}

// 嵌入页解析的断步记录（供最终失败时给线路名打短码）：
// st_fail=ST 页在手但提不出 get_video 候选；voe_fail=VOE 家族页在手但解包/明文全灭；
// emb_fail=嵌入页正文都拿不到或形态全不认识。
var lastEmbedFail = "";

// 解析一个嵌入页正文（已知宿主签名分派）；解不出返回 null。
async function resolveEmbedBody(html, embedUrl, detailUrl) {
  var s = String(html || "");
  if (s.indexOf("get_video") > -1) {
    var st = await resolveStBody(s, embedUrl || detailUrl);
    if (st) return st;
    lastEmbedFail = "st_fail";
    return null;
  }
  var voe = await resolveVoeBody(s, embedUrl, detailUrl);
  if (voe) return voe;
  var direct = extractStream(s);
  if (direct) {
    if (/\.m3u8/i.test(direct)) return { url: await pickTopVariant(direct, playHeadersFor(direct, embedUrl, detailUrl)) };
    return { url: direct };
  }
  if (!lastEmbedFail) {
    lastEmbedFail = (/voe\.sx|evsishere|vvaassjjav|luminscdn|application\/json|jwplayer/i.test(s) ||
      /voe|evsishere|vvaassjjav|luminscdn/i.test(embedUrl || "")) ? "voe_fail" : "emb_fail";
  }
  return null;
}

async function resolveEmbedUrl(embedUrl, detailUrl) {
  var r = await httpGet(embedUrl, { "User-Agent": UA, "Referer": detailUrl || HOST + "/" }, 30000);
  if (!r.text) { lastEmbedFail = "emb_fail"; return null; }
  return resolveEmbedBody(r.text, embedUrl, detailUrl);
}

// ---------------- lk1 取页：双通道竞速 + 断步遥测（2.0.1 新增） ----------------
// 2.0.0 的死法（2026-10-22 用真片 token 在本地复现）：lk1 的 ?c= 回 302
// 但 Location 为空，跟随跳转的 HTTP 层（undici 实测）直接抛错、回不到
// 任何正文；?l= 门页能拿到、OLID 也提得出，但再跳 ?c= 又死在同一处，
// 两条链全灭 → 只剩嗅探卡，与真机截图一致。2.0.1 的对策：
//  1) lk1 的 ?c=/?l= 都走「直连 + supjav-fetch Worker」双通道竞速，
//     Worker 侧是另一条独立出口且手工跟跳转（需 Worker v2 放行
//     supremejav.com；v1 在岗时该通道自动判败、不影响直连）。
//  2) lk1 请求补与浏览器 iframe 导航一致的头（Referer=门页自身、
//     Sec-Fetch-* 导航头），与真实播放器加载流程对齐。
//  3) 每步结果记进 trace，最终失败时线路名带短码标明断步：
//     lk1_c_fail=?c= 跳转拿不到正文；lk1_l_fail=连 ?l= 门页都拿不到；
//     emb_fail=嵌入页拿不到/不认识；voe_fail=VOE 家族页在手但解不出；
//     st_fail=ST 页在手但提不出候选。下轮看截图卡名即可定位。
var LK_TIMEOUT = 15000;

function lkNavHeaders(referer) {
  return {
    "User-Agent": UA_PC,
    "Referer": referer,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Sec-Fetch-Dest": "iframe",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site"
  };
}

function lkBodyBad(text) {
  var s = String(text || "").trim();
  return !s || s === "host not allowed" || s === "bad url" || s === "upstream blocked";
}

// 取一份 lk1 地址的正文：直连（带一次重试，lk1 本身抖）+ Worker 通道。
// 返回 {text, via}；全败 text 为 ""，过程记入 trace。
async function lkFetch(url, referer, preferWorker, trace) {
  var vias = preferWorker ? ["worker", "direct"] : ["direct", "worker"];
  for (var vi = 0; vi < vias.length; vi++) {
    var via = vias[vi];
    var tries = via === "direct" ? 2 : 1;
    for (var k = 0; k < tries; k++) {
      var r;
      if (via === "direct") {
        r = await httpGet(url, lkNavHeaders(referer), LK_TIMEOUT);
      } else {
        r = await httpGet(FETCH_WORKER + "/?u=" + encodeURIComponent(url), { "User-Agent": UA_PC }, 30000);
      }
      if (!lkBodyBad(r.text)) {
        trace.push(via + ":ok" + r.text.length + "B");
        return { text: r.text, via: via };
      }
      trace.push(via + (k ? "#2" : "") + ":" + (r.error ? "err" : (r.text ? "bad" + r.text.length + "B" : "0B")));
    }
  }
  return { text: "", via: "" };
}

// lk1 门页签名：JS 里写 OLID 并 iframe 加载 ?c=（实测样本含 start_player）。
// 门页不是嵌入页——其 CSS 含 "iframe {" 字样会让 bodyLooksEmbed 误判，
// 故门页必须先认出来、优先走 OLID 跳，也避免断步码被误标成 emb_fail。
function isGatePage(s) {
  return /start_player/.test(s) || (/OLID/.test(s) && /supjav\.php\?c=|["']\?c=["']/.test(s));
}

// 跟进一份 lk1 返回正文：直出流 → 门页走 OLID 跳 → 嵌入页（正文即嵌入页/
// 正文含嵌入地址）→ OLID 兜底再换 ?c=。两条链路共用；depth 防打转。
// 返回 {url, embedUrl, unverified} 或 null。
async function lkFollow(text, detailUrl, trace, depth, preferWorker, selfUrl) {
  var s = String(text || "");
  if (!s) return null;
  var direct = extractStream(s);
  if (direct) {
    var du = /\.m3u8/i.test(direct) ? await pickTopVariant(direct, playHeadersFor(direct, "", detailUrl)) : direct;
    return { url: du, embedUrl: "" };
  }
  var olid = (s.match(/["']([0-9a-fA-F]{32,})["']/) || s.match(/([0-9a-fA-F]{40,})/) || [])[1];
  if (olid && depth < 1 && isGatePage(s)) {
    var fg = await lkFetch(LK_BASE + "?c=" + reverseStr(olid), selfUrl || detailUrl, preferWorker, trace);
    if (fg.text) {
      var rg = await lkFollow(fg.text, detailUrl, trace, depth + 1, preferWorker, LK_BASE + "?c=" + reverseStr(olid));
      if (rg) return rg;
    }
    return null; // 门页已确认，OLID 跳再失败就是 ?c= 断（码由调用方保持 lk1_c_fail）
  }
  var emb = firstEmbedUrl(s);
  if (bodyLooksEmbed(s)) {
    var rb = await resolveEmbedBody(s, emb || "", detailUrl);
    if (rb) return { url: rb.url, embedUrl: emb || "", unverified: rb.unverified };
  }
  if (emb) {
    var re = await resolveEmbedUrl(emb, detailUrl);
    if (re) return { url: re.url, embedUrl: emb, unverified: re.unverified };
  }
  if (depth < 1 && olid) {
    var f = await lkFetch(LK_BASE + "?c=" + reverseStr(olid), selfUrl || detailUrl, preferWorker, trace);
    if (f.text) return lkFollow(f.text, detailUrl, trace, depth + 1, preferWorker, LK_BASE + "?c=" + reverseStr(olid));
  }
  return null;
}

// Worker v2 的 /wrap 路由探活（把 lk1 门页嵌进 iframe 的包装页，可绕过门页
// 「顶层打开就自毁」的检查，供嗅探兜底多一条路）；结果进程内缓存。
var wrapProbeState = -1;
async function probeWrap() {
  if (wrapProbeState >= 0) return wrapProbeState === 1;
  try {
    var r = await httpGet(FETCH_WORKER + "/wrap", { "User-Agent": UA_PC }, 10000);
    wrapProbeState = (r.text && r.text.indexOf("supjav-fetch v2") > -1) ? 1 : 0;
  } catch (e) { wrapProbeState = 0; }
  return wrapProbeState === 1;
}

// 单条线路解析：lk1 ?c= 反转链（双通道）→ ?l= 门页链（双通道）→ 嗅探兜底。
// 返回资源数组（成功 1 条；兜底 1~2 条，卡名带断步短码）。
async function resolveLine(vid, name, hex, chHint) {
  var detailUrl = HOST + "/" + vid + ".html";
  var preferWorker = chHint === "worker";
  var trace = [];
  var gateUrl = LK_BASE + "?l=" + hex;
  var cUrl = LK_BASE + "?c=" + reverseStr(hex);
  function finish(got) {
    return [{
      name: name + (got.unverified ? "（未验证）" : ""),
      url: got.url,
      playerType: "app",
      customHeaders: playHeadersFor(got.url, got.embedUrl || "", detailUrl)
    }];
  }
  var code = "lk1_c_fail";
  // 链路1：?c=反转 hex —— 正常时 http 层跟随 302 后正文即嵌入页/流
  var f1 = await lkFetch(cUrl, gateUrl, preferWorker, trace);
  if (f1.text) {
    lastEmbedFail = "";
    var g1 = await lkFollow(f1.text, detailUrl, trace, 0, preferWorker, cUrl);
    if (g1) return finish(g1);
    if (lastEmbedFail) code = lastEmbedFail;
  }
  // 链路2：?l=hex 门页（JS 里 OLID 反转后 iframe 加载 ?c=，lkFollow 内同路跟进）
  var f2 = await lkFetch(gateUrl, detailUrl, preferWorker, trace);
  if (f2.text) {
    lastEmbedFail = "";
    var g2 = await lkFollow(f2.text, detailUrl, trace, 0, preferWorker, gateUrl);
    if (g2) return finish(g2);
    if (lastEmbedFail) code = lastEmbedFail;
  } else if (!f1.text) {
    code = "lk1_l_fail"; // ?c= 与门页两头都摸不到
  }
  // 兜底：与蜘蛛 parse:1 同口径把门页交给播放器嗅探（卡名带断步短码）；
  // Worker v2 在线时多给一条「框架」嗅探（门页被嵌 iframe 时才不自毁）。
  var out = [{
    name: name + "（嗅探·" + code + "）",
    url: gateUrl,
    playerType: "app",
    customHeaders: { "User-Agent": UA_PC, "Referer": detailUrl },
    description: "解析断步 " + code + "；lk1 步骤：" + trace.join(" ")
  }];
  if (await probeWrap()) {
    out.push({
      name: name + "（嗅探·框架）",
      url: FETCH_WORKER + "/wrap?u=" + encodeURIComponent(gateUrl),
      playerType: "app",
      customHeaders: { "User-Agent": UA_PC, "Referer": detailUrl },
      description: "经 supjav-fetch v2 包装页iframe 嵌入门页后嗅探"
    });
  }
  return out;
}

// stream 模块入口：
//  - 入参是线路 token（supjav://…）→ 只解析该线
//  - 入参是详情页链接 → 解析优先级最高的一条线
async function loadResource(params) {
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  if (!raw && params.item) raw = params.item.link || params.item.id || params.item.url || "";
  raw = unwrapLink(raw);
  try {
    var tok = parseLineToken(raw);
    if (tok) {
      return await resolveLine(tok.vid, tok.name, tok.hex, tok.ch || "");
    }
    var vid = vidOf(raw);
    if (vid) {
      var durl = HOST + "/" + vid + ".html";
      var html = await fetchPage(durl, "detail");
      if (!html) return [];
      var d = parseDetail(html, vid);
      if (!d.lines.length) return [];
      return await resolveLine(vid, d.lines[0].name, d.lines[0].hex, winChannelName());
    }
    return [];
  } catch (e) {
    return [];
  }
}
