// JavCC for REX (lai_javcc v1.0.0)
// 移植自 mira-cat 蜘蛛 py_javcc.js（只读蓝图，未改动猫源），后端 https://javcc.me（WordPress retrotube 站）。
// 列表/分类/搜索：站方 HTML <article> 卡片；详情：Rocket 脚本解出 videplay 嵌页，解包后按模板分流。
// 播放：模板 A 直接取 api.videplay.us/o/v-master.m3u8/<token>；模板 B 经嵌页 pox/dp 做纯 JS AES-256 解密取
//   /x/v-master.m3u8/<token>（蓝图编解码调用已改写为纯 JS 字节运算）；再按 RESOLUTION 分档，取最高档作主线，
//   单档只出一线、多档不编造；解不出时回嵌页嗅探兜底，绝不输出无 token 的模板地址。
// 字幕：猫源有字幕聚合，但 REX 详情单 videoUrl 无字幕槽、且聚合芯依赖沙箱禁用的定时器，故本模块不接字幕。

WidgetMetadata = {
  id: "lai_javcc",
  title: "JavCC",
  description: "JavCC（javcc.me）：最新/无码流出/减码/巨乳/大屁股/人妻/制服/无码/中出/素人/美少女/有码/英字，详情解 videplay 取最高档",
  author: "lai",
  version: "1.0.0",
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
    { title: "搜索", functionName: "search", params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] }
  ]
};

var KEY = 'py_javcc';
var NAME = 'JavCC';
var HOST = 'https://javcc.me';
var UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

// ---------- 纯 JS 字节/编解码（替代蓝图里的运行环境编解码调用，REX 沙箱可用） ----------
var B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var B64_REV = {};
for (var bi = 0; bi < B64_ALPHABET.length; bi++) B64_REV[B64_ALPHABET.charAt(bi)] = bi;
function utf8EncodeBytes(str) {
  var out = [];
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else if (c >= 0xd800 && c <= 0xdbff && i + 1 < str.length) {
      var c2 = str.charCodeAt(i + 1);
      var cp = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
      i++;
      out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
    } else out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
  }
  return out;
}
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
function hexDecodeBytes(hex) {
  var out = [];
  var h = String(hex || "");
  for (var i = 0; i + 1 < h.length; i += 2) out.push(parseInt(h.slice(i, i + 2), 16));
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
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

function b64Decode(s) {
  try { return utf8DecodeBytes(b64DecodeBytes(s)); } catch (e) { return ''; }
}

function jsUnescapeSingle(s) {
  return s.replace(/\\(.)/g, (m, c) => {
    if (c === 'n') return '\n';
    if (c === 'r') return '\r';
    if (c === 't') return '\t';
    return c;
  });
}

// Dean Edwards 打包解包（与 hornyjav/videplay 同款纯字符串算法）
function unpackDeanEdwards(html) {
  var m = String(html || '').match(/eval\(function\(p,a,c,k,e,d\)[\s\S]*?\}\s*\(\s*'((?:[^'\\]|\\.)*)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:[^'\\]|\\.)*)'\.split\('\|'\)/);
  if (!m) return '';
  var p = jsUnescapeSingle(m[1]);
  var a = parseInt(m[2], 10);
  var c = parseInt(m[3], 10);
  var k = jsUnescapeSingle(m[4]).split('|');
  var enc = (n) => (n < a ? '' : enc(Math.floor(n / a))) + ((n % a) > 35 ? String.fromCharCode((n % a) + 29) : (n % a).toString(36));
  var i = c;
  while (i--) {
    if (k[i]) {
      var word = k[i];
      p = p.replace(new RegExp('\\b' + enc(i) + '\\b', 'g'), () => word);
    }
  }
  return p;
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

async function home() {
  var html = await getText(HOST + '/', HOST + '/');
  return { class: CATS, filters: {}, list: parseCards(html) };
}

async function category(reqIn) {
  var body = reqIn?.body || {};
  var tid = String(Array.isArray(body.id) ? body.id[0] : body.id || body.tid || 'latest');
  var page = Math.max(1, parseInt(body.page, 10) || 1);
  var base = tid === 'latest' ? HOST : HOST + '/' + tid.replace(/^\/+/, '').replace(/\/+$/, '');
  var url = page === 1 ? (base + '/') : (base + '/page/' + page + '/');
  var html = await getText(url, HOST + '/');
  var list = parseCards(html);
  // 翻页兜底（2026-10-31：VM 侧 /page/N/ 本是通的，但设备侧有用户报翻页无内容，
  // 原因未坐实，可能是个别网络/缓存导致主地址空回；主地址空回时换 ?paged=N 再取一次）
  if (page > 1 && !list.length) {
    var alt = tid === 'latest' ? HOST + '/?paged=' + page : base + '/?paged=' + page;
    html = await getText(alt, HOST + '/', 20000);
    list = parseCards(html);
  }
  return { page, pagecount: list.length ? page + 1 : page, list };
}

async function search(reqIn) {
  var body = reqIn?.body || {};
  var wd = String(body.wd || '').trim();
  if (!wd) return { list: [] };
  var page = Math.max(1, parseInt(body.page, 10) || 1);
  var url = page === 1
    ? HOST + '/?s=' + encodeURIComponent(wd)
    : HOST + '/page/' + page + '/?s=' + encodeURIComponent(wd);
  var html = await getText(url, HOST + '/');
  return { list: parseCards(html) };
}

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
  out.sort((a, b) => parseInt(b.name, 10) - parseInt(a.name, 10));
  return out;
}

// ---------- videplay 模板 B：pox/dp AES 解密（纯 JS，无 CryptoJS/node:crypto） ----------
// 嵌页 setup 用 file:ply(pox,dp) 运行时组装地址；ply 等价逻辑（2026-10-31
// 对 jur-887 嵌页实测坐实）：
//   pass = pox.split('+')[1].slice(1)（取中间 '+' 段并去掉首字符）
//   dp 经 base64 解码得 JSON {ct(base64), iv(hex), s(hex 盐)}
//   EVP_BytesToKey(MD5, pass, salt, 48 字节) -> key=前 32(AES-256) + iv=后 16
//   AES-256-CBC 解密 ct、去 PKCS7 填充 -> 真实 master 清单地址（如 /x/v-master.m3u8/<token>）
// 注意：JSON 里的 iv 与 EVP 派生 iv 一致，解密时以 EVP 为准；md5Bytes 与
// AES-256 均由 py_one.js 的 MD5/AES-128 改编（MD5 改走字节数组输入，
// AES 扩展 Nk=8/Nr=14，轮函数与 S 盒算法不变）。
function md5Bytes(input) {
  var msg = Array.from(input || []);
  var len = msg.length;
  var bitLen = len * 8;
  msg.push(0x80);
  while (msg.length % 64 !== 56) msg.push(0);
  var lo = bitLen >>> 0; var hi = Math.floor(bitLen / 4294967296) >>> 0;
  msg.push(lo & 255, (lo >>> 8) & 255, (lo >>> 16) & 255, (lo >>> 24) & 255);
  msg.push(hi & 255, (hi >>> 8) & 255, (hi >>> 16) & 255, (hi >>> 24) & 255);
  var a0 = 0x67452301; var b0 = 0xefcdab89; var c0 = 0x98badcfe; var d0 = 0x10325476;
  var S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
  var K = [];
  for (var i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0;
  for (var off = 0; off < msg.length; off += 64) {
    var M = [];
    for (var j = 0; j < 16; j++) M[j] = msg[off + j * 4] | (msg[off + j * 4 + 1] << 8) | (msg[off + j * 4 + 2] << 16) | (msg[off + j * 4 + 3] << 24);
    var A = a0; var B = b0; var C = c0; var D = d0;
    for (var r = 0; r < 64; r++) {
      var F; var g;
      if (r < 16) { F = (B & C) | (~B & D); g = r; }
      else if (r < 32) { F = (D & B) | (~D & C); g = (5 * r + 1) % 16; }
      else if (r < 48) { F = B ^ C ^ D; g = (3 * r + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * r) % 16; }
      var tmp = D; D = C; C = B;
      var sum = (A + F + K[r] + M[g]) | 0;
      B = (B + ((sum << S[r]) | (sum >>> (32 - S[r])))) | 0;
      A = tmp;
    }
    a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0;
  }
  var out = [];
  for (var x of [a0, b0, c0, d0]) for (var i = 0; i < 4; i++) out.push((x >>> (i * 8)) & 255);
  return out;
}

var AES256 = (function () {
  function xt(a) { return ((a << 1) ^ (a & 0x80 ? 0x1b : 0)) & 0xff; }
  function mul(a, b) { var r = 0; while (b) { if (b & 1) r ^= a; a = xt(a); b >>= 1; } return r & 0xff; }
  var SBOX = []; var INV = [];
  for (var a = 0; a < 256; a++) {
    var inv = 0;
    if (a) { for (var b = 1; b < 256; b++) { if (mul(a, b) === 1) { inv = b; break; } } }
    var x = inv;
    var s = x ^ ((x << 1 | x >> 7) & 255) ^ ((x << 2 | x >> 6) & 255) ^ ((x << 3 | x >> 5) & 255) ^ ((x << 4 | x >> 4) & 255) ^ 0x63;
    SBOX[a] = s & 0xff;
  }
  for (var i = 0; i < 256; i++) INV[SBOX[i]] = i;
  function expandKey256(key) {
    var Nk = 8; var Nr = 14;
    var w = [];
    for (var i = 0; i < Nk; i++) w[i] = (key[i * 4] << 24) | (key[i * 4 + 1] << 16) | (key[i * 4 + 2] << 8) | key[i * 4 + 3];
    var rcon = 1;
    for (var i = Nk; i < 4 * (Nr + 1); i++) {
      var tt = w[i - 1];
      if (i % Nk === 0) {
        tt = ((tt << 8) | (tt >>> 24)) >>> 0;
        tt = ((SBOX[(tt >>> 24) & 255] << 24) | (SBOX[(tt >>> 16) & 255] << 16) | (SBOX[(tt >>> 8) & 255] << 8) | SBOX[tt & 255]) >>> 0;
        tt = (tt ^ (rcon << 24)) >>> 0;
        rcon = xt(rcon);
      } else if (i % Nk === 4) {
        tt = ((SBOX[(tt >>> 24) & 255] << 24) | (SBOX[(tt >>> 16) & 255] << 16) | (SBOX[(tt >>> 8) & 255] << 8) | SBOX[tt & 255]) >>> 0;
      }
      w[i] = (w[i - Nk] ^ tt) >>> 0;
    }
    return w;
  }
  function invShift(st) {
    var cols = [];
    for (var c = 0; c < 4; c++) cols[c] = [(st[c] >>> 24) & 255, (st[c] >>> 16) & 255, (st[c] >>> 8) & 255, st[c] & 255];
    var rows = [[], [], [], []];
    for (var cc = 0; cc < 4; cc++) for (var rr = 0; rr < 4; rr++) rows[rr][cc] = cols[cc][rr];
    for (var r2 = 0; r2 < 4; r2++) { var t2 = rows[r2].slice(); for (var c2 = 0; c2 < 4; c2++) rows[r2][(c2 + r2) % 4] = t2[c2]; }
    for (var c3 = 0; c3 < 4; c3++) for (var r3 = 0; r3 < 4; r3++) cols[c3][r3] = rows[r3][c3];
    var out = [];
    for (var c4 = 0; c4 < 4; c4++) out[c4] = ((cols[c4][0] << 24) | (cols[c4][1] << 16) | (cols[c4][2] << 8) | cols[c4][3]) >>> 0;
    return out;
  }
  function invSub(st) {
    var out = [];
    for (var c = 0; c < 4; c++) out[c] = ((INV[(st[c] >>> 24) & 255] << 24) | (INV[(st[c] >>> 16) & 255] << 16) | (INV[(st[c] >>> 8) & 255] << 8) | INV[st[c] & 255]) >>> 0;
    return out;
  }
  function invMix(st) {
    var out = [];
    for (var c = 0; c < 4; c++) {
      var b0 = (st[c] >>> 24) & 255; var b1 = (st[c] >>> 16) & 255; var b2 = (st[c] >>> 8) & 255; var b3 = st[c] & 255;
      out[c] = ((mul(b0, 14) ^ mul(b1, 11) ^ mul(b2, 13) ^ mul(b3, 9)) << 24 |
        (mul(b0, 9) ^ mul(b1, 14) ^ mul(b2, 11) ^ mul(b3, 13)) << 16 |
        (mul(b0, 13) ^ mul(b1, 9) ^ mul(b2, 14) ^ mul(b3, 11)) << 8 |
        (mul(b0, 11) ^ mul(b1, 13) ^ mul(b2, 9) ^ mul(b3, 14))) >>> 0;
    }
    return out;
  }
  function decBlock(w, s, Nr) {
    var st = [];
    for (var i = 0; i < 4; i++) st[i] = s[i] >>> 0;
    for (var round = Nr; round >= 1; round--) {
      for (var k = 0; k < 4; k++) st[k] = (st[k] ^ w[round * 4 + k]) >>> 0;
      if (round !== Nr) st = invMix(st);
      st = invShift(st);
      st = invSub(st);
    }
    for (var k2 = 0; k2 < 4; k2++) st[k2] = (st[k2] ^ w[k2]) >>> 0;
    return st;
  }
  function cbcDecrypt(keyBytes, ivBytes, dataBytes) {
    var w = expandKey256(keyBytes);
    var iv = [];
    for (var i = 0; i < 4; i++) iv[i] = ((ivBytes[i * 4] << 24) | (ivBytes[i * 4 + 1] << 16) | (ivBytes[i * 4 + 2] << 8) | ivBytes[i * 4 + 3]) >>> 0;
    var out = []; var prev = iv;
    for (var off = 0; off < dataBytes.length; off += 16) {
      var blk = [];
      for (var j = 0; j < 4; j++) blk[j] = ((dataBytes[off + j * 4] << 24) | (dataBytes[off + j * 4 + 1] << 16) | (dataBytes[off + j * 4 + 2] << 8) | dataBytes[off + j * 4 + 3]) >>> 0;
      var res = decBlock(w, blk, 14);
      res = [(res[0] ^ prev[0]) >>> 0, (res[1] ^ prev[1]) >>> 0, (res[2] ^ prev[2]) >>> 0, (res[3] ^ prev[3]) >>> 0];
      for (var j2 = 0; j2 < 4; j2++) out.push((res[j2] >>> 24) & 255, (res[j2] >>> 16) & 255, (res[j2] >>> 8) & 255, res[j2] & 255);
      prev = blk;
    }
    return out;
  }
  return { cbcDecrypt };
})();

function evpBytesToKey(password, salt, total) {
  var pw = utf8EncodeBytes(String(password || ''));
  var sl = Array.from(salt || []);
  var out = []; var prev = [];
  while (out.length < total) {
    prev = md5Bytes(prev.concat(pw, sl));
    out = out.concat(prev);
  }
  return out.slice(0, total);
}

// ply 等价：pox/dp -> 真实 master 清单地址；失败返回 ''（绝不输出半截地址）
function decryptVideplayDp(pox, dp) {
  try {
    var parts = String(pox || '').split('+');
    if (parts.length < 3) return '';
    var pass = parts[1].slice(1);
    if (!pass) return '';
    var json = JSON.parse(utf8DecodeBytes(b64DecodeBytes(String(dp || ''))));
    if (!json || !json.ct || !json.s) return '';
    var ct = b64DecodeBytes(json.ct);
    var salt = hexDecodeBytes(json.s);
    if (!ct.length || ct.length % 16 !== 0 || salt.length !== 8) return '';
    var dk = evpBytesToKey(pass, salt, 48);
    var plain = AES256.cbcDecrypt(dk.slice(0, 32), dk.slice(32, 48), ct);
    var pad = plain[plain.length - 1];
    var cut = (pad >= 1 && pad <= 16) ? plain.slice(0, plain.length - pad) : plain;
    var text = utf8DecodeBytes(cut);
    // 明文本身是 JSON 带引号字符串（"https:\/\/..."），先按 JSON 解析还原；
    // 非引号开头时只做 \/ -> / 还原。
    var url = text;
    if (text.startsWith('"')) {
      try { url = JSON.parse(text); } catch (e) { url = text.replace(/^"|"$/g, '').replace(/\\\//g, '/'); }
    } else url = text.replace(/\\\//g, '/');
    if (!/^https?:\/\/[^"'\\\s<>]+\/v-master\.m3u8\/[A-Za-z0-9_\-\.%=]+/i.test(url)) return '';
    return url;
  } catch (e) { return ''; }
}
// ---------- /videplay 模板 B ----------

async function resolveLines(embedUrl, durl) {
  var embedHtml = await getText(embedUrl, durl);
  if (!embedHtml) return [{ name: '正片', url: embedUrl }];
  var unpacked = unpackDeanEdwards(embedHtml);
  var hay = unpacked || embedHtml;
  var master = '';
  var mm = hay.match(/https:\/\/api\.videplay\.us\/o\/v-master\.m3u8\/[A-Za-z0-9_\-\.%]+/i);
  if (mm) master = mm[0];
  if (!master) {
    // 模板 B：解包文本只有无 token 的 /x/v-master.m3u8 模板地址，真实地址
    // 须经 pox/dp 解密；解不出则回落嵌页，绝不输出无 token 的模板地址。
    var px = embedHtml.match(/(?:let|var)\s+pox\s*=\s*'([^']+)'/);
    var dp = embedHtml.match(/(?:let|var)\s+dp\s*=\s*'([^']+)'/);
    if (px && dp) master = decryptVideplayDp(px[1], dp[1]);
  }
  if (!master) return [{ name: '正片', url: embedUrl }];
  var masterText = await getText(master, embedUrl);
  var variants = masterText ? parseMasterVariants(masterText) : [];
  if (variants.length) return variants;
  return [{ name: '正片', url: master }];
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
    var lines = [];
    try { lines = await resolveLines(embedUrl, durl); } catch (e) { lines = []; }
    if (!lines.length) lines = [{ name: "正片", url: embedUrl }];
    var videoUrl = lines[0].url;
    var sniff = videoUrl === embedUrl;
    return { id: raw, type: "detail", title: title, link: raw, posterPath: pic, coverUrl: pic, backdropPath: pic, videoUrl: videoUrl, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": embedUrl }, description: sniff ? "嵌页嗅探兜底" : "" };
  } catch (e) {
    return { id: raw || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
