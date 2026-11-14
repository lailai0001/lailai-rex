// JavSaga for REX (lai_javsaga v1.0.0)
// 移植自 mira-cat 蜘蛛 javsaga.js（只读蓝图），站 https://javsaga.ninja/。
// 站方有 Cloudflare 墙：VM/Worker/代理出口一律 403，手机 Safari（住宅/移动 IP）
// 能过；REX 里直连发 iPhone Safari 全套头（与猫源 v2 同款），另挂 jina 与
// javsaga-fetch Worker 两条后备腿，先拿到真页者赢。墙的问题不硬绕（不用用户
// 浏览器 cookie、不编造结果）。
// 播放链（supjav 同款）：详情页 data-link hex -> lk1.supremejav.com/saga.php
// ?c=<反转 hex> 302 到真嵌入页 -> 按签名分派解包（VOE 混淆 JSON / EVS·LUC
// packer / VAS /api/stream / Streamtape get_video / 明文兜底）。
// 详情不做逐线分辨率探针（每线一次 lk 全链，太慢）；loadResource 现解后，
// 主清单有多档时按档出多行（点哪档播哪档），单档只出一行。

WidgetMetadata = {
  id: "lai_javsaga",
  title: "JavSaga",
  description: "JavSaga：最新/热门/有码/无码/素人/中字/无码破解/英字 + 8 热门标签，多线路播放（VOE/EVS/LUC/VAS/ST）",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://javsaga.ninja",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "__home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "热门", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "__popular" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "censored-jav" }, { name: "sort", title: "排序", type: "enumeration", value: "", enumOptions: [{ title: "最新", value: "" }, { title: "最多观看", value: "views" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "uncensored-jav" }, { name: "sort", title: "排序", type: "enumeration", value: "", enumOptions: [{ title: "最新", value: "" }, { title: "最多观看", value: "views" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "amateur" }, { name: "sort", title: "排序", type: "enumeration", value: "", enumOptions: [{ title: "最新", value: "" }, { title: "最多观看", value: "views" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "中文字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "chinese-subtitles" }, { name: "sort", title: "排序", type: "enumeration", value: "", enumOptions: [{ title: "最新", value: "" }, { title: "最多观看", value: "views" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "无码破解", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "reducing-mosaic" }, { name: "sort", title: "排序", type: "enumeration", value: "", enumOptions: [{ title: "最新", value: "" }, { title: "最多观看", value: "views" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "英文字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "english-subtitles" }, { name: "sort", title: "排序", type: "enumeration", value: "", enumOptions: [{ title: "最新", value: "" }, { title: "最多观看", value: "views" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag:big-tits" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "中出", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag:creampie" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag:married-woman" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "熟女", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag:mature-woman" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "美少女", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag:beautiful-girl" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "Cosplay", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag:cosplay" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "FC2", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag:fc2ppv" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "素人标签", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag:amateur" }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://javsaga.ninja";
var FETCH_WORKER = "https://javsaga-fetch.li768435813.workers.dev";
var LK_BASE = "https://lk1.supremejav.com/saga.php";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  return String(s || "")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, d) { var c = parseInt(d, 10); return (c > 0 && c < 0x110000) ? String.fromCharCode(c) : m; });
}

// 纯 JS base64 解码（REX 沙箱无 Buffer / TextDecoder，不依赖 atob；照抄 javhey）
function b64decode(b64) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var s = String(b64 || "").replace(/[^A-Za-z0-9+/=]/g, "");
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
  var utf8 = "";
  var j = 0;
  while (j < out.length) {
    var b = out.charCodeAt(j);
    if (b < 128) { utf8 += out.charAt(j); j += 1; }
    else if (b > 191 && b < 224 && j + 1 < out.length) {
      utf8 += String.fromCharCode(((b & 31) << 6) | (out.charCodeAt(j + 1) & 63)); j += 2;
    } else if (b > 223 && b < 240 && j + 2 < out.length) {
      utf8 += String.fromCharCode(((b & 15) << 12) | ((out.charCodeAt(j + 1) & 63) << 6) | (out.charCodeAt(j + 2) & 63)); j += 3;
    } else { utf8 += out.charAt(j); j += 1; }
  }
  return utf8;
}

function reverseStr(s) {
  return String(s || "").split("").reverse().join("");
}

function navHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": referer || HOST + "/",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1"
  };
}

// 单次取页：返回 {status, body}，永不抛错
async function getText(url, headers) {
  try {
    var res = await Widget.http.get(url, { headers: headers || navHeaders(url) });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return { status: (res && res.status) || 0, body: body };
  } catch (e) { return { status: 0, body: "" }; }
}

// 真站页校验：够大 + 含 javsaga + 无 CF 拦截串。未部署 Worker 回的 ~20KB
// Cloudflare 错误页无 javsaga，会被挡掉（猫源 2026-11-11 教训）。
function goodPage(html) {
  return !!html && html.length > 3000 && /javsaga/i.test(html) &&
    html.indexOf("Just a moment") < 0 && html.indexOf("Attention Required") < 0;
}

// 多通道取页：直连（iPhone Safari 头）+ jina + Worker，并行竞速，首个真页赢。
// REX 沙箱无 setTimeout，用 Promise 结算计数代替定时封顶。
var pageCache = {};
function firstGood(promises) {
  return new Promise(function (resolve) {
    var done = false, settled = 0, n = promises.length;
    if (!n) { resolve(""); return; }
    promises.forEach(function (p) {
      p.then(function (html) {
        if (done) return;
        if (goodPage(html)) { done = true; resolve(html); }
        else { settled++; if (settled >= n) { done = true; resolve(""); } }
      }, function () {
        settled++;
        if (!done && settled >= n) { done = true; resolve(""); }
      });
    });
  });
}

async function fetchPage(url) {
  var hit = pageCache[url];
  if (hit && Date.now() - hit.at < 180000) return hit.html;
  var legs = [];
  legs.push(getText(url, navHeaders(url)).then(function (r) { return r.body; }));
  legs.push(getText("https://r.jina.ai/" + url, {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "x-respond-with": "html"
  }).then(function (r) { return r.body; }));
  legs.push(getText(FETCH_WORKER + "/?u=" + encodeURIComponent(url), navHeaders(url)).then(function (r) { return r.body; }));
  var html = await firstGood(legs);
  if (goodPage(html)) pageCache[url] = { html: html, at: Date.now() };
  return html || "";
}

function parseCards(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var blocks = String(html).split('<div class="post">').slice(1);
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    var m = b.match(/href="https:\/\/javsaga\.ninja\/zh\/(\d+)\.html"/);
    if (!m) continue;
    var vid = m[1];
    if (seen[vid]) continue;
    var tm = b.match(/title="([^"]+)"/);
    var title = tm ? tm[1] : "";
    if (!title) {
      var h3 = b.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
      if (h3) title = h3[1].replace(/<[^>]+>/g, "");
    }
    title = decodeHtml(title).trim();
    if (!title) continue;
    seen[vid] = 1;
    var pic = "";
    var pats = [/<img[^>]+data-original="([^"]+)"/, /<img[^>]+data-src="([^"]+)"/, /<img[^>]+src="(https?:\/\/[^"]+)"/];
    for (var p = 0; p < pats.length; p++) {
      var pm = b.match(pats[p]);
      if (pm) { pic = pm[1]; break; }
    }
    if (pic.indexOf("//") === 0) pic = "https:" + pic;
    var code = "";
    var cm = title.match(/\b([A-Z]{2,6}-?\d{2,6}|FC2PPV[\s-]?\d{5,8})\b/);
    if (cm) code = cm[1];
    out.push({
      id: HOST + "/zh/" + vid + ".html",
      type: "url",
      title: title.slice(0, 90),
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: HOST + "/zh/" + vid + ".html",
      description: code,
      mediaType: "movie"
    });
  }
  return out;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function listUrl(zone, sort, page) {
  var url;
  if (zone === "__home") {
    url = page === 1 ? HOST + "/zh/" : HOST + "/zh/page/" + page + "/";
  } else if (zone === "__popular") {
    url = page === 1 ? HOST + "/zh/popular/" : HOST + "/zh/popular/page/" + page + "/";
  } else if (zone.indexOf("tag:") === 0) {
    var base = HOST + "/zh/tag/" + zone.slice(4);
    url = page === 1 ? base + "/" : base + "/page/" + page + "/";
  } else {
    var base2 = HOST + "/zh/category/" + zone;
    url = page === 1 ? base2 + "/" : base2 + "/page/" + page + "/";
    if (sort) url += "?sort=" + encodeURIComponent(sort);
  }
  return url;
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || params.path || params.cat || "__home");
  var sort = t(params.sort || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var html = await fetchPage(listUrl(zone, sort, page));
    var list = parseCards(html);
    return list.length ? list : emptyItem();
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
    var url = page === 1 ? HOST + "/?s=" + encodeURIComponent(wd) : HOST + "/page/" + page + "/?s=" + encodeURIComponent(wd);
    var html = await fetchPage(url);
    var list = parseCards(html);
    return list.length ? list : emptyItem();
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

async function loadDetail(link) {
  try {
    var durl = unwrapLink(link);
    if (!durl) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    if (durl.indexOf("http") !== 0) durl = HOST + durl;
    var vid = (durl.split("/").pop().replace(".html", "").replace(/\D/g, "")) || durl;
    var pageUrl = HOST + "/zh/" + vid + ".html";
    var html = await fetchPage(pageUrl);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回（站方 Cloudflare 墙可能拦截了当前网络）" };
    var title = "";
    var tm = html.match(/<h1[^>]*>(.*?)<\/h1>/s);
    if (tm) title = decodeHtml(tm[1].replace(/<[^>]+>/g, "")).trim();
    var pic = "";
    var pm = html.match(/background-image:\s*url\((https:\/\/img\.supjav\.com\/[^)]+)\)/);
    if (pm) pic = pm[1];
    if (!pic) {
      var im = html.match(/(https:\/\/img\.supjav\.com\/[^\s"'<>)]+\.(?:jpg|jpeg|png|webp)[^\s"'<>)]*)/i);
      if (im) pic = im[1];
    }
    var views = "";
    var vm = html.match(/<span class="views">([^<]+)<\/span>/);
    if (vm) views = vm[1].trim();
    var tags = [];
    var tagRe = /href="https:\/\/javsaga\.ninja\/(tag|actress)\/([^"/]+)/g;
    var tg;
    while ((tg = tagRe.exec(html)) !== null) {
      var s = tg[2].replace(/-/g, " ").trim();
      if (s && tags.indexOf(s) < 0) tags.push(s);
    }
    // 线路 data-link（详情页常有两组重复的线路块，按 hex 去重）
    var links = [];
    var lm = html.match(/data-link="([0-9a-f]{40,})"/g) || [];
    for (var li = 0; li < lm.length; li++) {
      var hx = lm[li].replace(/data-link="/, "").replace(/"/, "");
      if (links.indexOf(hx) < 0) links.push(hx);
    }
    var names = [];
    var nm = html.match(/data-link="[0-9a-f]{40,}"[^>]*>([^<]{1,12})</g) || [];
    for (var ni = 0; ni < nm.length; ni++) {
      var nn = nm[ni].replace(/data-link="[0-9a-f]{40,}"[^>]*>/, "").replace(/</, "").trim();
      names.push(nn);
    }
    var pairs = [];
    var seenHex = {};
    for (var i = 0; i < links.length; i++) {
      if (seenHex[links[i]]) continue;
      seenHex[links[i]] = 1;
      var nm2 = names[i] || ("线路" + (pairs.length + 1));
      pairs.push({ name: nm2, hex: links[i] });
    }
    var LINE_ORDER = { VOE: 0, EVS: 10, LUC: 20, VAS: 30, FST: 35, ST: 40, TV: 90 };
    pairs.sort(function (a, b) {
      var oa = LINE_ORDER[a.name.toUpperCase()];
      var ob = LINE_ORDER[b.name.toUpperCase()];
      oa = (oa == null) ? 50 : oa;
      ob = (ob == null) ? 50 : ob;
      return oa - ob;
    });
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    for (var j = 0; j < pairs.length; j++) {
      var lid = "@@SAGA:" + vid + "|" + pairs[j].hex;
      eps.push({ name: pairs[j].name, link: lid });
      seasonEps.push({ title: pairs[j].name, episodeNumber: j + 1 });
      epItems.push({
        id: lid,
        type: "url",
        title: pairs[j].name,
        mediaType: "movie",
        posterPath: pic,
        link: lid,
        episode: j + 1,
        episodeNumber: j + 1,
        seasonIndex: 1,
        seasonNumber: 1
      });
    }
    var content = title;
    if (tags.length) content += "\n标签: " + tags.slice(0, 10).join(", ");
    var result = {
      id: durl,
      type: "detail",
      title: title || ("JavSaga " + vid),
      name: title || ("JavSaga " + vid),
      description: content.slice(0, 600) || (views ? ("观看 " + views) : ""),
      mediaType: "movie",
      link: durl,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app"
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "线路", name: "线路", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
    }
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// ---------- 播放解析 ----------
// lk1 取嵌入地址：?c=<反转 hex>。Widget.http 会跟随跳转，直接拿到的正文
// 若是真嵌入页（>800B、无 OLID/start_player）即用；否则走门页 OLID 重试，
// 再走 javsaga-fetch Worker 备用出口。
async function lkResolveEmbed(hex, detailUrl) {
  var gateUrl = LK_BASE + "?l=" + hex;
  var navH = {
    "Referer": gateUrl,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Sec-Fetch-Dest": "iframe",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site"
  };
  var tryC = async function (h) {
    var cUrl = LK_BASE + "?c=" + reverseStr(h);
    var r = await getText(cUrl, Object.assign({ "User-Agent": UA }, navH));
    var body = r.body || "";
    if (body.length > 800 && !/OLID|start_player/.test(body)) return { embedBody: body, embedUrl: cUrl };
    return null;
  };
  for (var i = 0; i < 2; i++) {
    try {
      var got = await tryC(hex);
      if (got) return got;
    } catch (e) {}
  }
  try {
    var gate = await getText(gateUrl, Object.assign({ "User-Agent": UA }, navH, { "Referer": detailUrl }));
    var gateBody = gate.body || "";
    var olidM = gateBody.match(/OLID\s*=\s*['"]([0-9a-fA-F]{32,})['"]/) || gateBody.match(/["']([0-9a-fA-F]{32,})["']/);
    if (olidM && olidM[1] && olidM[1] !== hex) {
      var got2 = await tryC(olidM[1]);
      if (got2) return got2;
    }
  } catch (e) {}
  try {
    var w = await getText(FETCH_WORKER + "/?u=" + encodeURIComponent(LK_BASE + "?c=" + reverseStr(hex)), navHeaders(gateUrl));
    var wbody = w.body || "";
    if (wbody.length > 800 && !/host not allowed|bad url|upstream blocked/.test(wbody) && !/OLID|start_player/.test(wbody)) {
      return { embedBody: wbody, embedUrl: LK_BASE + "?c=" + reverseStr(hex) };
    }
  } catch (e) {}
  return null;
}

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

// 主清单多档解析：只保留带 RESOLUTION 高度的档，同高度留最大 BANDWIDTH，按高度降序。
async function fetchVariants(url, headers) {
  var res = { ok: false, isMaster: false, top: url, variants: [] };
  try {
    var r = await getText(url, headers);
    var text = r.body || "";
    if (r.status !== 200 || text.indexOf("#EXTM3U") < 0) return res;
    res.ok = true;
    if (text.indexOf("#EXT-X-STREAM-INF") < 0) return res;
    var lines = text.split(/\r?\n/);
    var list = [];
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
        try { abs = new URL(uri, url).toString(); } catch (e) { continue; }
      }
      list.push({ h: h, bw: bm ? parseInt(bm[1], 10) : 0, url: abs });
    }
    var byH = {};
    for (var k = 0; k < list.length; k++) {
      var v = list[k];
      var cur = byH[v.h];
      if (!cur || v.bw > cur.bw) byH[v.h] = v;
    }
    var vs = [];
    for (var key in byH) vs.push(byH[key]);
    vs.sort(function (a, b) { return b.h - a.h || b.bw - a.bw; });
    res.variants = vs;
    if (vs.length) { res.isMaster = true; res.top = vs[0].url; }
    return res;
  } catch (e) {
    return res;
  }
}

function playHeadersFor(videoUrl, embedUrl, detailUrl) {
  var ref = detailUrl || HOST + "/";
  if (/cloudwindow-route|ugc-cdn/i.test(videoUrl)) ref = "https://jeremyparticipantanything.com/";
  else if (embedUrl) ref = embedUrl;
  return { "User-Agent": UA, "Referer": ref };
}

// ---------- VOE 家族解包 ----------
function rot13(s) {
  return String(s).replace(/[a-zA-Z]/g, function (c) {
    var b = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - b + 13) % 26) + b);
  });
}
function voeDecode(html) {
  try {
    var m = String(html || "").match(/<script[^>]*type=["']application\/json["'][^>]*>(.*?)<\/script>/s);
    if (!m) return {};
    var raw = m[1].trim();
    try {
      var j = JSON.parse(raw);
      raw = (Array.isArray(j) && j.length) ? String(j[0]) : raw;
    } catch (e) {}
    var s = String(raw);
    var keys = ["@$", "^^", "~@", "%?", "*~", "!!", "#&"];
    for (var k = 0; k < keys.length; k++) s = s.split(keys[k]).join("_");
    s = s.split("_").join("");
    var tt = b64decode(rot13(s));
    var shifted = "";
    for (var i = 0; i < tt.length; i++) shifted += String.fromCharCode(tt.charCodeAt(i) - 3);
    tt = b64decode(shifted.split("").reverse().join(""));
    var cfg = JSON.parse(tt);
    return cfg && typeof cfg === "object" ? cfg : {};
  } catch (e) {
    return {};
  }
}

// ---------- Dean-Edwards packer 解包（EVS/LUC 等 VidHide 系） ----------
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
      p = p.replace(new RegExp("\\b" + tok + "\\b", "g"), (function (v) { return function () { return v; }; })(keys[c]));
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
  var rank = function (f) {
    var isTxt = /\.txt(\?|$)/i.test(f.url);
    var n = parseInt((f.key.match(/\d+/) || ["0"])[0], 10);
    return (isTxt ? 100 : 0) - n;
  };
  found.sort(function (a, b) { return rank(a) - rank(b); });
  var urls = [];
  for (var j = 0; j < found.length; j++) urls.push(found[j].url);
  return urls;
}

// ---------- Streamtape：求值 innerHTML 拼接表达式提 get_video 候选 ----------
function evalConcatExpr(expr) {
  var s = String(expr || "");
  var pos = 0;
  var skipWs = function () { while (pos < s.length && /\s/.test(s.charAt(pos))) pos++; };
  var parseStr = function () {
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
  };
  var parseNum = function () {
    var m = s.slice(pos).match(/^-?\d+/);
    if (!m) return null;
    pos += m[0].length;
    return parseInt(m[0], 10);
  };
  var parsePrimary = function () {
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
  };
  var parseTerm = function () {
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
  };
  var parseExpr = function () {
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
  };
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
    if (v && v.indexOf("get_video") >= 0) evaled.push(v);
  }
  var seen = {};
  var out = [];
  var add = function (u) {
    if (!u) return;
    u = String(u).trim();
    if (u.indexOf("//") === 0) u = "https:" + u;
    else if (!/^https?:\/\//i.test(u)) {
      if (/^[\w.-]+\.[a-z]{2,}\//i.test(u)) u = "https://" + u;
      else return;
    }
    u = u.replace(/&amp;/g, "&");
    if (u.indexOf("get_video") < 0 || seen[u]) return;
    try {
      var h = new URL(u).hostname;
      if (!/(^|\.)streamtape\.com$|(^|\.)amtape\.com$/.test(h)) return;
    } catch (e) { return; }
    seen[u] = 1;
    out.push(u);
  };
  for (var i = evaled.length - 1; i >= 0; i--) add(evaled[i]);
  var list1 = s.match(/https?:\/\/[^\s"'<>]+get_video\?[^\s"'<>]+/g) || [];
  for (var j = 0; j < list1.length; j++) add(list1[j]);
  var list2 = s.match(/\/\/[\w.-]+get_video\?[^\s"'<>]+/g) || [];
  for (var k = 0; k < list2.length; k++) add(list2[k]);
  return out;
}

async function probeStFile(url, referer) {
  var r = await getText(url, { "User-Agent": UA, "Referer": referer, "Range": "bytes=0-1023" });
  if (!r.status) return false;
  var head = String(r.body || "").slice(0, 120);
  if (head.charAt(0) === "{" && /"status"\s*:/.test(head)) return false;
  return r.status === 200 || r.status === 206;
}

// ---------- VAS 系（vvaassjjav 等）：/api/stream 换 streaming_url ----------
async function resolveVasApi(embedUrl, embedHtml) {
  try {
    var u = new URL(embedUrl);
    var codeM = u.pathname.match(/\/e\/([A-Za-z0-9]+)/);
    if (!codeM) return null;
    var code = codeM[1];
    var res = await Widget.http.post(u.origin + "/api/stream", JSON.stringify({ filecode: code, device: "web", codecs: [] }), {
      headers: {
        "User-Agent": UA,
        "Content-Type": "application/json",
        "Origin": u.origin,
        "Referer": embedUrl
      }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    var j = {};
    try { j = JSON.parse(body); } catch (e) { return null; }
    var su = j.streaming_url || j.fallback_url || "";
    if (/^https?:\/\//i.test(su)) return su;
  } catch (e) {}
  return null;
}

// ---------- 嵌入页解析分派 ----------
// 成功回 {url, header, variants}；ST 令牌服务端试活不过时回 {sniff: embedUrl}；全败回 null。
async function resolveEmbed(embedUrl, embedBody, detailUrl) {
  var html = embedBody || "";
  var finalUrl = embedUrl;
  if (!html) {
    var r = await getText(embedUrl, { "User-Agent": UA, "Referer": detailUrl });
    html = r.body || "";
  }
  if (!html) return null;
  var jsJump = html.match(/window\.location\.href\s*=\s*'(https?:\/\/[^']+)'/) ||
    html.match(/window\.location\.href\s*=\s*"(https?:\/\/[^"]+)"/);
  if (jsJump && html.length < 3000 && !/jwplayer|application\/json|get_video/.test(html)) {
    var r2 = await getText(jsJump[1], { "User-Agent": UA, "Referer": embedUrl });
    if (r2.body) { html = r2.body; finalUrl = jsJump[1]; }
  }
  var direct0 = extractStream(html);
  // 1) Streamtape 签名
  if (html.indexOf("get_video") >= 0) {
    var cands = stCandidates(html);
    for (var i = 0; i < cands.length; i++) {
      if (await probeStFile(cands[i], finalUrl)) {
        return { url: cands[i], header: playHeadersFor(cands[i], finalUrl, detailUrl) };
      }
    }
    if (cands.length) return { sniff: finalUrl };
  }
  // 2) VAS 系 API 型
  if (/\/api\/stream/.test(html) && /filecode/i.test(html)) {
    var su = await resolveVasApi(finalUrl, html);
    if (su) {
      var hdr = playHeadersFor(su, finalUrl, detailUrl);
      var fv = /\.m3u8/i.test(su) ? await fetchVariants(su, hdr) : { top: su, variants: [] };
      return { url: fv.top, header: playHeadersFor(fv.top, finalUrl, detailUrl), variants: fv.variants };
    }
    return { sniff: finalUrl };
  }
  // 3) VOE 家族混淆 JSON
  var cfg = voeDecode(html);
  var src = String(cfg.source || "");
  if (/\.m3u8/i.test(src)) {
    var hdr3 = playHeadersFor(src, finalUrl, detailUrl);
    var fv3 = await fetchVariants(src, hdr3);
    return { url: fv3.top, header: hdr3, variants: fv3.variants };
  }
  var dau = String(cfg.direct_access_url || "");
  if (/^https?:\/\//i.test(dau)) return { url: dau, header: playHeadersFor(dau, finalUrl, detailUrl) };
  if (/^https?:\/\//i.test(src)) return { url: src, header: playHeadersFor(src, finalUrl, detailUrl) };
  // 4) packer 打包（EVS/LUC 等）
  if (/eval\(function\(p,a,c,k/.test(html)) {
    var unpacked = unpackPacker(html);
    var urls = hlsFromUnpacked(unpacked);
    for (var j2 = 0; j2 < Math.min(urls.length, 3); j2++) {
      var hdr4 = playHeadersFor(urls[j2], finalUrl, detailUrl);
      var fv4 = await fetchVariants(urls[j2], hdr4);
      if (fv4.ok) return { url: fv4.top, header: hdr4, variants: fv4.variants };
    }
  }
  // 5) 明文/jwplayer 兜底
  if (direct0) {
    var hdr5 = playHeadersFor(direct0, finalUrl, detailUrl);
    var fv5 = /\.m3u8/i.test(direct0) ? await fetchVariants(direct0, hdr5) : { top: direct0, variants: [] };
    return { url: fv5.top, header: hdr5, variants: fv5.variants };
  }
  var jw = html.match(/jwplayer\([^)]*\)\.setup\(\{\s*file:\s*"([^"]+)"/i);
  if (jw) {
    var f = jw[1].replace(/\\\//g, "/");
    if (/^https?:\/\//i.test(f)) {
      var hdr6 = playHeadersFor(f, finalUrl, detailUrl);
      var fv6 = /\.m3u8/i.test(f) ? await fetchVariants(f, hdr6) : { top: f, variants: [] };
      return { url: fv6.top, header: hdr6, variants: fv6.variants };
    }
  }
  return null;
}

// supjav-fetch v2 的 /wrap 探活（包装页把门页嵌进 iframe，绕门页顶层自毁）
async function probeWrap(gateUrl) {
  try {
    var r = await getText(FETCH_WORKER + "/wrap?u=" + encodeURIComponent(gateUrl), navHeaders(gateUrl));
    return (r.body || "").indexOf("<iframe") >= 0;
  } catch (e) {
    return false;
  }
}

async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 懒解析入口：@@SAGA:<vid>|<hex>[|<h>]
  var at = raw.indexOf("@@SAGA:");
  if (at < 0) {
    if (/\.m3u8(\?|#|$)/i.test(raw) || /\.mp4(\?|#|$)/i.test(raw)) {
      return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
    return [];
  }
  var body = raw.slice(at + 7);
  var parts = body.split("|");
  var vid = parts[0] || "";
  var hex = parts[1] || "";
  var wantH = parts[2] ? parseInt(parts[2], 10) || 0 : 0;
  if (!hex) return [];
  var detailUrl = HOST + "/" + vid + ".html";
  var gateUrl = LK_BASE + "?l=" + hex;
  var headers = { "User-Agent": UA, "Referer": detailUrl };
  try {
    var lk = await lkResolveEmbed(hex, detailUrl);
    if (lk && (lk.embedUrl || lk.embedBody)) {
      var got = await resolveEmbed(lk.embedUrl || "", lk.embedBody || "", detailUrl);
      if (got && got.url) {
        // 多档时按档出多行（想要的档放最前）；单档只出一行。
        var rows = [];
        var variants = got.variants || [];
        if (variants.length > 1) {
          var ordered = variants.slice();
          if (wantH > 0) {
            ordered.sort(function (a, b) {
              if (a.h === wantH) return -1;
              if (b.h === wantH) return 1;
              return b.h - a.h;
            });
          }
          for (var i = 0; i < ordered.length; i++) {
            rows.push({ name: ordered[i].h + "p", url: ordered[i].url, playerType: "system", customHeaders: got.header || headers });
          }
          return rows;
        }
        return [{ name: "播放", url: got.url, playerType: "system", customHeaders: got.header || headers }];
      }
      if (got && got.sniff) {
        return [{ name: "播放（嗅探）", url: got.sniff, playerType: "app", customHeaders: headers }];
      }
      // 嵌入页拿到了但没解出：嗅探嵌入页本身（不再回会自毁的门页）
      if (lk.embedUrl && !/supjav\.php|saga\.php/.test(lk.embedUrl)) {
        return [{ name: "播放（嗅探）", url: lk.embedUrl, playerType: "app", customHeaders: headers }];
      }
    }
  } catch (e) {}
  // 全灭兜底：Worker /wrap 包装页嗅探
  try {
    if (await probeWrap(gateUrl)) {
      return [{ name: "播放（嗅探）", url: FETCH_WORKER + "/wrap?u=" + encodeURIComponent(gateUrl), playerType: "app", customHeaders: headers }];
    }
  } catch (e) {}
  return [];
}
