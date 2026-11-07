// JavCC for REX (lai_javcc v1.0.1)
//
// 移植自 mira-cat 蜘蛛 py_javcc.js（只读蓝图，未改动猫源），后端 https://javcc.me（WordPress retrotube 站）。
//
// 列表/分类/搜索：站方 HTML <article> 卡片；详情：只取详情页（标题/封面/embed 地址），
// 点集时 stream 模块 loadResource 按清晰度现解。
//
// 播放（2026-11-07 实测坐实，7 部片）：站方现分两条后端——/ved/ 线分片是 tiktokcdn 的
// .image 伪装地址（70 字节 PNG 头 + 真 TS，播放器按 image/png 拒收）；/o/ 线
// （dual.streamhx.win）部分视频 master 稳定 502（站方后端按视频死掉，无他腿可换）。
// 故播放一律走自家 javcc-hls Worker（/v 现解、/p 改写清单、/s 剥 PNG 头并强制
// video/MP2T），本模块不再本地解密、不再串行跟 embed/master。1.0.0 的慢就是
// 串行跟链：详情 3~19 秒 + 嵌页 3~15 秒 + master 2~7 秒；1.0.1 的 loadDetail
// 只取一次详情页（3~19 秒，站方本身慢、改不了），点集时再取一次 Worker /v。
// 清晰度按 Worker 回的 master 实测档位出（1080p/720p/480p），单档只出一行，绝不编造。
//
// 字幕：猫源有字幕聚合，但 REX 详情单 videoUrl 无字幕槽、且聚合芯依赖沙箱禁用的定时器，故本模块不接字幕。

WidgetMetadata = {
  id: "lai_javcc",
  title: "JavCC",
  description: "JavCC（javcc.me）：最新/无码流出/减码/巨乳/大屁股/人妻/制服/无码/中出/素人/美少女/有码/英字，点集按清晰度出流（1080p/720p/480p），播放走 javcc-hls Worker（去 PNG 伪装分片）",
  author: "lai",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  site: "https://javcc.me",
  detailCacheDuration: 180,
  modules: [
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码流出", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "tag/uncensored-leaked" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "减码", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "category/reducing-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "tag/big-tits" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "大屁股", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "tag/huge-butt" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "tag/married-woman" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "制服", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "tag/school-uniform" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "tag/uncensored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中出", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "tag/creampie" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "tag/amateur" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "美少女", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "tag/beautiful-girl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "category/censored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "英字", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "category/english-subtitle" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "搜索", functionName: "search", params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] },
    {
      id: "loadResource",
      title: "JavCC播放源",
      description: "点播所选清晰度：按清晰度出流（1080p/720p/480p），全灭时交网页嗅探兜底",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 0,
      params: []
    }
  ]
};

var KEY = 'py_javcc';
var NAME = 'JavCC';
var HOST = 'https://javcc.me';
var UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

// 自家 javcc-hls Worker（2026-11-07 首版，须用户部署到自己的 Cloudflare 账号；
// 根路径应回 v1 (png-strip)）。播放只走 Worker，不再直连 videplay/tiktokcdn。
var WORKER = "https://javcc-hls.li768435813.workers.dev";

// ---------- 纯 JS 字节/编解码（替代蓝图里的运行环境编解码调用，REX 沙箱可用） ----------
var B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var B64_REV = {};
for (var bi = 0; bi < B64_ALPHABET.length; bi++) B64_REV[B64_ALPHABET.charAt(bi)] = bi;
function utf8DecodeBytes(bytes) {
  var s = ""; var i = 0;
  while (i < bytes.length) {
    var b = bytes[i++];
    if (b < 0x80) s += String.fromCharCode(b);
    else if (b < 0xe0) s += String.fromCharCode(((b & 31) << 6) | (bytes[i++] & 63));
    else if (b < 0xf0) s += String.fromCharCode(((b & 15) << 12) | ((bytes[i++] & 63) << 6) | (bytes[i++] & 63));
    else {
      var cp = ((b & 7) << 18) | ((bytes[i++] & 63) << 12) | ((bytes[i++] & 63) << 6) | (bytes[i++] & 63);
      cp -= 0x10000;
      s += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 1023));
    }
  }
  return s;
}
function b64DecodeBytes(s) {
  var clean = String(s || "").replace(/-/g, "+").replace(/_/g, "/").replace(/[^A-Za-z0-9+/=]/g, "");
  while (clean.length % 4) clean += "=";
  var out = [];
  for (var i = 0; i + 3 < clean.length; i += 4) {
    if (clean.charAt(i + 2) === "=") { var n1 = (B64_REV[clean.charAt(i)] << 18) | (B64_REV[clean.charAt(i + 1)] << 12); out.push((n1 >> 16) & 255); break; }
    if (clean.charAt(i + 3) === "=") { var n2 = (B64_REV[clean.charAt(i)] << 18) | (B64_REV[clean.charAt(i + 1)] << 12) | (B64_REV[clean.charAt(i + 2)] << 6); out.push((n2 >> 16) & 255, (n2 >> 8) & 255); break; }
    var n = (B64_REV[clean.charAt(i)] << 18) | (B64_REV[clean.charAt(i + 1)] << 12) | (B64_REV[clean.charAt(i + 2)] << 6) | B64_REV[clean.charAt(i + 3)];
    out.push((n >> 16) & 255, (n >> 8) & 255, n & 255);
  }
  return out;
}
async function getText(url, referer, timeoutMs) {
  try {
    var r = await Widget.http.get(url, { headers: { "User-Agent": UA, Referer: referer || HOST + "/" } });
    if (r.status && (r.status < 200 || r.status >= 300)) return "";
    return typeof r.data === "string" ? r.data : "";
  } catch (e) { return ""; }
}

function stripTags(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/&#x([0-9a-fA-F]+);/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); })
    .replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

function b64Decode(s) {
  try { return utf8DecodeBytes(b64DecodeBytes(s)); } catch (e) { return ''; }
}

// 首页/分类/标签/搜索卡片：<article> 块（标题在 a 的 title 属性，封面在 img data-src）
function parseCards(html) {
  var items = [];
  var seen = {};
  var re = /<article[^>]*>([\s\S]*?)<\/article>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var blk = m[1];
    var lm = blk.match(/<a[^>]+href="https:\/\/javcc\.me\/([^"\/\?#]+)\/?"[^>]*title="([^"]*)"/i)
      || blk.match(/<a[^>]+href="https:\/\/javcc\.me\/([^"\/\?#]+)\/?"[^>]*>/i);
    if (!lm) continue;
    var slug = lm[1];
    if (seen[slug]) continue;
    seen[slug] = 1;
    var title = lm[2] ? stripTags(lm[2]) : '';
    if (!title) {
      var hm = blk.match(/<header[^>]*>([\s\S]{0,400}?)<\/header>/i);
      if (hm) title = stripTags(hm[1]);
    }
    if (!title || title.length < 2) continue;
    var pic = '';
    var im = blk.match(/<img[^>]+>/i);
    if (im) {
      var sm = im[0].match(/(?:data-src|data-original|src)\s*=\s*"([^"]+)"/i);
      if (sm && /^https?:\/\//i.test(sm[1]) && !/data:image/i.test(sm[1])) pic = sm[1];
    }
    var remarks = '';
    var dm = blk.match(/duration">[\s\S]{0,120}?(\d+:\d+(?::\d+)?)/i);
    if (dm) remarks = dm[1];
    items.push({ vod_id: slug, vod_name: title, vod_pic: pic, vod_remarks: remarks });
    if (items.length >= 60) break;
  }
  return items;
}

// 分类：前列为用户钦定的关键词类（全部对应站方原生标签页，真实可验证）；
// 短剧在本站无对应内容，不设。末尾为站方原生 3 分类 + 最新。
var CATS = [
  { type_id: 'latest', type_name: '最新' },
  { type_id: 'tag/uncensored-leaked', type_name: '无码流出' },
  { type_id: 'category/reducing-mosaic', type_name: '减码' },
  { type_id: 'tag/big-tits', type_name: '巨乳' },
  { type_id: 'tag/huge-butt', type_name: '大屁股' },
  { type_id: 'tag/married-woman', type_name: '人妻' },
  { type_id: 'tag/school-uniform', type_name: '制服' },
  { type_id: 'tag/uncensored', type_name: '无码' },
  { type_id: 'tag/creampie', type_name: '中出' },
  { type_id: 'tag/amateur', type_name: '素人' },
  { type_id: 'tag/beautiful-girl', type_name: '美少女' },
  { type_id: 'category/censored', type_name: '有码' },
  { type_id: 'category/english-subtitle', type_name: '英字' },
];

// ---------- 详情 / 播放 ----------

// 详情页播放脚本：Rocket Lazy Load 包的 base64 内联脚本，解出 defaultUrl
function extractEmbedUrl(html) {
  var bm = String(html || '').match(/data-rocketlazyloadscript='data:text\/javascript;base64,([^']+)'/);
  if (bm) {
    var js = b64Decode(bm[1]);
    var um = js.match(/defaultUrl\s*=\s*"([^"]+)"/);
    if (um && /^https?:\/\//i.test(um[1])) return um[1];
  }
  var vm = String(html || '').match(/https:\/\/[a-z0-9.\-]*videplay\.us\/v\/[A-Za-z0-9]+/i);
  if (vm) return vm[0];
  var fm = String(html || '').match(/<iframe[^>]+src="([^"]+)"/i);
  if (fm && /^https?:\/\//i.test(fm[1])) return fm[1];
  return '';
}

// master 清单按 RESOLUTION 分档；单档只出一线，多档各出一线（绝不编造）
function parseMasterVariants(text) {
  var out = [];
  var seen = {};
  var re = /#EXT-X-STREAM-INF:[^\n]*RESOLUTION=(\d+)x(\d+)[^\n]*\n([^\n#][^\n]*)/g;
  var m;
  while ((m = re.exec(text)) !== null) {
    var h = parseInt(m[2], 10);
    var url = m[3].trim();
    if (!url || seen[url]) continue;
    seen[url] = 1;
    var q = h >= 1080 ? '1080p' : h >= 720 ? '720p' : h >= 480 ? '480p' : h >= 360 ? '360p' : (h + 'p');
    out.push({ name: q, url });
  }
  out.sort(function (a, b) { return parseInt(b.name, 10) - parseInt(a.name, 10); });
  return out;
}

// ---------- REX 入口 ----------
function toCard(item) {
  var url = HOST + "/" + item.vod_id;
  var cover = item.vod_pic || "";
  return { id: url, type: "url", title: item.vod_name || item.vod_id, posterPath: cover, coverUrl: cover, backdropPath: cover, link: url, description: item.vod_remarks || "", mediaType: "movie" };
}
function toCards(list) {
  var out = [];
  for (var i = 0; i < (list || []).length; i++) { var c = toCard(list[i]); if (c.title) out.push(c); }
  return out;
}
async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var tid = String(params.cat || params.path || params.tid || "latest");
  try {
    var base = tid === "latest" ? HOST : HOST + "/" + tid.replace(/^\/+/, "").replace(/\/+$/, "");
    var url = page === 1 ? (base + "/") : (base + "/page/" + page + "/");
    var html = await getText(url, HOST + "/");
    var list = parseCards(html);
    if (page > 1 && !list.length) {
      var alt = tid === "latest" ? HOST + "/?paged=" + page : base + "/?paged=" + page;
      html = await getText(alt, HOST + "/");
      list = parseCards(html);
    }
    var cards = toCards(list);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 60), description: String((e && e.message) || e) }];
  }
}
function pickKeyword(params) {
  if (params == null) return "";
  if (typeof params === "string" || typeof params === "number") return String(params).trim();
  var keys = ["keyword", "q", "search", "text", "query", "wd", "key"];
  for (var i = 0; i < keys.length; i++) if (params[keys[i]]) return String(params[keys[i]]).trim();
  return "";
}
async function search(params) {
  params = params || {};
  var wd = pickKeyword(params);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  try {
    var url = page === 1 ? HOST + "/?s=" + encodeURIComponent(wd) : HOST + "/page/" + page + "/?s=" + encodeURIComponent(wd);
    var html = await getText(url, HOST + "/");
    var cards = toCards(parseCards(html));
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 60), description: String((e && e.message) || e) }];
  }
}
// ---------- 详情 / 点播 ----------

function workerVUrl(embedUrl, durl) {
  return WORKER + "/v?u=" + encodeURIComponent(embedUrl) + "&r=" + encodeURIComponent(durl);
}

// 嗅探兜底行：交播放器 WebView 嗅探详情页（与蜘蛛 parse:1 兜底同义）
function sniffRow(durl) {
  return [{
    name: "网页嗅探",
    url: durl,
    playerType: "app",
    customHeaders: { "User-Agent": UA, "Referer": HOST + "/" },
    description: "Worker 未解出，交播放器 WebView 嗅探详情页。"
  }];
}

// loadDetail 只取详情页、不逐线解析：取标题/封面/embed 地址，出一集“正片”
// 与一集嗅探兜底；点集时 stream 模块 loadResource 按清晰度现解。详情页本身
// 站方就慢（实测 3~19 秒），只取一次、不再串行跟 embed/master。
// 集 token 形如 <embed>@@<durl>（embed 地址不含 "@@"，可安全切分）。
async function loadDetail(link) {
  var raw = String(link || "");
  try {
    var durl = /^https?:\/\//i.test(raw) ? raw : HOST + "/" + raw.replace(/^\/+/, "");
    var slug = durl.replace(/^https:\/\/javcc\.me\//, "").replace(/\/+$/, "");
    var html = await getText(durl, HOST + "/");
    if (!html) return { id: raw, type: "url", title: "请求错误", description: "详情页取不到" };
    var title = "";
    var ogt = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
    if (ogt) title = stripTags(ogt[1]);
    if (!title) { var tm = html.match(/<title>([\s\S]{0,400}?)<\/title>/i); if (tm) title = stripTags(tm[1]).replace(/\s*-\s*JAVCC\.ME\s*$/i, ""); }
    if (!title) title = slug;
    var pic = "";
    var ogi = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (ogi) pic = ogi[1];
    var embedUrl = extractEmbedUrl(html);
    if (!embedUrl) return { id: raw, type: "url", title: title, description: "未找到播放地址" };
    var token = embedUrl + "@@" + durl;
    return {
      id: raw, type: "url", title: title, link: durl,
      posterPath: pic, coverUrl: pic, backdropPath: pic, description: title,
      episodes: [
        { name: "正片", id: token, link: token },
        { name: "网页嗅探·兜底", id: "sniff:" + durl, link: "sniff:" + durl }
      ]
    };
  } catch (e) {
    return { id: raw || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// stream 模块入口：点集时现解。取 Worker /v 回的 master，按实测 RESOLUTION
// 分档出流（1080p/720p/480p 由高到低，单档只出一行，绝不编造）；Worker
// /v 已把变体改写为 /p、把分片改写为 /s/<名>.ts（剥 PNG 头），这里直接用
// 其地址，不再二次包装。Worker 未解出（dual 502 死后端等）时交嗅探兜底。
async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  if (!raw && params.item) raw = params.item.link || params.item.id || params.item.url || "";
  raw = String(raw || "").trim();
  if (!raw) return [];
  if (raw.indexOf("sniff:") === 0) {
    var sd = raw.slice(6);
    return sd ? sniffRow(sd) : [];
  }
  var embed = "";
  var durl = "";
  var at = raw.indexOf("@@");
  if (at > 0) { embed = raw.slice(0, at); durl = raw.slice(at + 2); }
  if (!embed || !/^https?:\/\//.test(embed)) {
    // 旧 token 或只有详情地址：重抓详情页取 embed
    durl = /^https?:\/\//.test(raw) ? raw : HOST + "/" + raw.replace(/^\/+/, "");
    var html = await getText(durl, HOST + "/");
    if (!html) return sniffRow(durl);
    embed = extractEmbedUrl(html);
    if (!embed) return sniffRow(durl);
  }
  if (!durl) durl = HOST + "/";
  var vurl = workerVUrl(embed, durl);
  var pl = await getText(vurl, embed);
  if (!pl || pl.indexOf("#EXTM3U") < 0) return sniffRow(durl);
  var variants = parseMasterVariants(pl);
  if (variants.length) {
    var rows = [];
    for (var i = 0; i < variants.length; i++) {
      rows.push({ name: variants[i].name, url: variants[i].url, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": embed } });
    }
    return rows;
  }
  if (pl.indexOf("#EXTINF") >= 0) {
    return [{ name: "正片", url: vurl, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": embed } }];
  }
  return sniffRow(durl);
}
