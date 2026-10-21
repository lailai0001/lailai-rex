// 聚合短剧 for REX (lai_juheduanju v1.0.0)
// 来源：mira-cat 蜘蛛 py_juheduanju，聚合 7 个短剧平台：橙果 / 七星 / 星芽 / 狂飙 / 酷我 / 剧屋 / 围观。
// 分类与子站结构与蜘蛛原样一致（30 个分类条目）；多集走 episodes + loadResource(stream) 模式。
// 七星登录的 AES-128-ECB 加密为纯 JS 实现（已与 Node crypto 对拍一致），其余平台逻辑与蜘蛛等价。
// 狂飙：站方已改版为 rccdn 会话门禁播放，play 顺序为 episode.watch 的 hlsUrl → 蜘蛛原直链 → 原 watch 页兜底（见报告）。

function _jhCat(plat, platName, cat, catName) {
  return {
    title: platName + "·" + catName,
    functionName: "loadList",
    cacheDuration: 180,
    params: [
      { name: "plat", title: "平台", type: "constant", value: plat },
      { name: "cat", title: "分类", type: "constant", value: cat },
      { name: "page", title: "页码", type: "page", value: "1" }
    ]
  };
}

WidgetMetadata = {
  id: "lai_juheduanju",
  title: "聚合短剧",
  description: "聚合短剧：橙果/七星/星芽/狂飙/酷我/剧屋/围观 7 个平台、30 个分类、多集短剧，播放实时解析",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://chengguodj.com",
  detailCacheDuration: 180,
  modules: [
    _jhCat("chengguo", "橙果", "yuanchuang", "原创"),
    _jhCat("chengguo", "橙果", "mogai", "魔改"),
    _jhCat("chengguo", "橙果", "manju", "漫剧"),
    _jhCat("chengguo", "橙果", "zhenren", "真人"),
    _jhCat("chengguo", "橙果", "aiduanju", "AI短剧"),
    _jhCat("chengguo", "橙果", "browse", "全部"),
    _jhCat("qixing", "七星", "1", "剧场"),
    _jhCat("qixing", "七星", "3", "新剧"),
    _jhCat("qixing", "七星", "2", "热播"),
    _jhCat("qixing", "七星", "7", "星选"),
    _jhCat("qixing", "七星", "5", "阳光"),
    _jhCat("xingya", "星芽", "juchang", "剧场"),
    _jhCat("xingya", "星芽", "reboduanju", "热播剧"),
    _jhCat("xingya", "星芽", "huiyuan", "会员专享"),
    _jhCat("xingya", "星芽", "xingxuan", "星选好剧"),
    _jhCat("xingya", "星芽", "xinju", "新剧"),
    _jhCat("xingya", "星芽", "yangguang", "阳光剧场"),
    _jhCat("kuangbiao", "狂飙", "t-5jxcit", "短剧"),
    _jhCat("kuangbiao", "狂飙", "normal_short", "正规短剧"),
    _jhCat("kuangbiao", "狂飙", "adult_short", "成人短剧"),
    _jhCat("kuwo", "酷我", "10", "猜你想看"),
    _jhCat("kuwo", "酷我", "11", "土味爱情"),
    _jhCat("kuwo", "酷我", "12", "更多精彩"),
    _jhCat("kuwo", "酷我", "13", "霸道总裁的人生"),
    _jhCat("kuwo", "酷我", "14", "赘婿当道"),
    _jhCat("kuwo", "酷我", "15", "漫漫追妻路"),
    _jhCat("kuwo", "酷我", "16", "家庭情感"),
    _jhCat("juwu", "剧屋", "1", "短剧"),
    _jhCat("juwu", "剧屋", "2", "情色电影"),
    _jhCat("weiguan", "围观", "all", "全部"),
    {
      id: "loadResource",
      title: "聚合短剧播放源",
      description: "播放时按平台实时解析单集地址",
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

var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36";
var TIMEOUT = 30000;

/* ---------------- 请求层（Widget.http） ----------------
   蜘蛛是 req + fetch 双通道（第一通道失败/空自动走第二通道），
   这里等价处理为：首次结果为空/异常时再试一次。 */
function _jhHasHeader(headers, name) {
  var n = name.toLowerCase();
  return Object.keys(headers || {}).some(function (k) { return k.toLowerCase() === n; });
}
async function httpGet(url, headers) {
  for (var attempt = 0; attempt < 2; attempt++) {
    try {
      var res = await Widget.http.get(url, { headers: headers || {}, timeout: TIMEOUT });
      var data = res && res.data != null ? res.data : "";
      if (typeof data === "string") { if (data) return data; }
      else if (data) return JSON.stringify(data);
    } catch (e) {}
  }
  return "";
}
async function httpGetJson(url, headers) {
  for (var attempt = 0; attempt < 2; attempt++) {
    try {
      var res = await Widget.http.get(url, { headers: headers || {}, timeout: TIMEOUT });
      var data = res && res.data != null ? res.data : null;
      if (data == null || data === "") continue;
      if (typeof data === "object") return data;
      try { return JSON.parse(String(data)); } catch (e) { return null; }
    } catch (e) {}
  }
  return null;
}
async function _jhPost(url, bodyText, headers) {
  if (!Widget.http || typeof Widget.http.post !== "function") return null;
  for (var attempt = 0; attempt < 2; attempt++) {
    try {
      var res = await Widget.http.post(url, bodyText, { headers: headers || {}, timeout: TIMEOUT });
      var data = res && res.data != null ? res.data : null;
      if (data == null || data === "") continue;
      if (typeof data === "object") return data;
      var s = String(data);
      try { return JSON.parse(s); } catch (e) { return s; }
    } catch (e) {}
  }
  return null;
}
async function httpPostJson(url, body, headers) {
  var h = {};
  var src = headers || {};
  Object.keys(src).forEach(function (k) { h[k] = src[k]; });
  if (!_jhHasHeader(h, "content-type")) h["Content-Type"] = "application/json";
  return _jhPost(url, JSON.stringify(body), h);
}
async function httpPostForm(url, formStr, headers) {
  var h = {};
  var src = headers || {};
  Object.keys(src).forEach(function (k) { h[k] = src[k]; });
  if (!_jhHasHeader(h, "content-type")) h["Content-Type"] = "application/x-www-form-urlencoded";
  return _jhPost(url, String(formStr), h);
}
function clean(s) { return String(s || "").replace(/<[^>]+>/g, "").trim(); }
function pick(o) {
  if (!o || typeof o !== "object") return "";
  for (var i = 1; i < arguments.length; i++) {
    var v = o[arguments[i]];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
  }
  return "";
}

/* ---------------- 纯 JS 工具：utf8 / base64 / AES-128-ECB ---------------- */
function utf8Bytes(str) {
  var out = [];
  var s = String(str);
  for (var i = 0; i < s.length; i++) {
    var cp = s.charCodeAt(i);
    if (cp < 0x80) out.push(cp);
    else if (cp < 0x800) out.push(0xc0 | (cp >> 6), 0x80 | (cp & 0x3f));
    else if (cp >= 0xd800 && cp <= 0xdbff && i + 1 < s.length) {
      var lo = s.charCodeAt(++i);
      var c = 0x10000 + ((cp - 0xd800) << 10) + (lo - 0xdc00);
      out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 0x3f), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    } else out.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
  }
  return out;
}
var _B64C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64Encode(bytes) {
  var out = "";
  for (var i = 0; i < bytes.length; i += 3) {
    var a = bytes[i], b = bytes[i + 1], c = bytes[i + 2];
    out += _B64C[a >> 2] + _B64C[((a & 3) << 4) | ((b || 0) >> 4)];
    out += (b === undefined) ? "=" : _B64C[((b & 15) << 2) | ((c || 0) >> 6)];
    out += (c === undefined) ? "=" : _B64C[c & 63];
  }
  return out;
}
function b64UrlEncode(bytes) {
  return b64Encode(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
var _SBOX = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];
var _RCON = [1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
function _aesExpandKey(key) {
  var w = key.slice(0);
  for (var i = 4; i < 44; i++) {
    var t = w.slice((i - 1) * 4, i * 4);
    if (i % 4 === 0) t = [_SBOX[t[1]] ^ _RCON[i / 4 - 1], _SBOX[t[2]], _SBOX[t[3]], _SBOX[t[0]]];
    for (var j = 0; j < 4; j++) w[i * 4 + j] = w[(i - 4) * 4 + j] ^ t[j];
  }
  return w;
}
function _xtime(a) { return ((a << 1) & 0xff) ^ ((a & 0x80) ? 0x1b : 0); }
function _aesEncryptBlock(w, input) {
  var s = input.slice(0);
  var i, r, c;
  for (i = 0; i < 16; i++) s[i] ^= w[i];
  for (var round = 1; round <= 10; round++) {
    for (i = 0; i < 16; i++) s[i] = _SBOX[s[i]];
    var t = s.slice(0);
    for (r = 0; r < 4; r++) for (c = 0; c < 4; c++) s[c * 4 + r] = t[((c + r) % 4) * 4 + r];
    if (round < 10) {
      for (c = 0; c < 4; c++) {
        var a0 = s[c * 4], a1 = s[c * 4 + 1], a2 = s[c * 4 + 2], a3 = s[c * 4 + 3];
        s[c * 4] = _xtime(a0) ^ (_xtime(a1) ^ a1) ^ a2 ^ a3;
        s[c * 4 + 1] = a0 ^ _xtime(a1) ^ (_xtime(a2) ^ a2) ^ a3;
        s[c * 4 + 2] = a0 ^ a1 ^ _xtime(a2) ^ (_xtime(a3) ^ a3);
        s[c * 4 + 3] = (_xtime(a0) ^ a0) ^ a1 ^ a2 ^ _xtime(a3);
      }
    }
    for (i = 0; i < 16; i++) s[i] ^= w[round * 16 + i];
  }
  return s;
}
function aesEcbB64(keyStr, text) {
  var w = _aesExpandKey(utf8Bytes(keyStr).slice(0, 16));
  var data = utf8Bytes(text);
  var pad = 16 - (data.length % 16);
  for (var i = 0; i < pad; i++) data.push(pad);
  var out = [];
  for (var off = 0; off < data.length; off += 16) {
    var enc = _aesEncryptBlock(w, data.slice(off, off + 16));
    for (var j = 0; j < enc.length; j++) out.push(enc[j]);
  }
  return b64Encode(out);
}

/* ================= 平台: 橙果 ================= */
var CG_SITE = "https://chengguodj.com";
var CG_CATS = [
  { type_id: "yuanchuang", type_name: "原创" },
  { type_id: "mogai", type_name: "魔改" },
  { type_id: "manju", type_name: "漫剧" },
  { type_id: "zhenren", type_name: "真人" },
  { type_id: "aiduanju", type_name: "AI短剧" },
  { type_id: "browse", type_name: "全部" }
];
function cgHeaders() { return { "User-Agent": UA, "Referer": CG_SITE + "/", "Accept-Language": "zh-CN,zh;q=0.9" }; }
function cgProxyPic(u) {
  var s = String(u || "").replace(/\\u002F/g, "/").replace(/\\\//g, "/").trim();
  if (!s) return "";
  if (s.indexOf("http") !== 0) s = CG_SITE + (s.charAt(0) === "/" ? s : "/" + s);
  try { return CG_SITE + "/_img/" + b64UrlEncode(utf8Bytes(s)); }
  catch (e) { return s; }
}
function cgResolve(arr, v) {
  if (typeof v === "number" && v >= 0 && v < arr.length && typeof arr[v] !== "object") return arr[v];
  return v;
}
function cgParseList(html) {
  var vods = [];
  var seen = {};
  var m = String(html || "").match(/<script[^>]+id=["']__NUXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/);
  if (!m) return vods;
  try {
    var arr = JSON.parse(m[1].trim());
    for (var ii = 0; ii < arr.length; ii++) {
      var item = arr[ii];
      if (!item || typeof item !== "object" || !("title" in item)) continue;
      var title = cgResolve(arr, item.title);
      if (!title || typeof title !== "string") continue;
      var slug = cgResolve(arr, item.slug);
      if (!slug || typeof slug !== "string") continue;
      if (seen[slug]) continue;
      seen[slug] = 1;
      var pic = "";
      var cov = item.cover;
      if (typeof cov === "number") cov = arr[cov];
      if (cov && typeof cov === "object") {
        var u = cgResolve(arr, cov.url) || cgResolve(arr, cov.fallback_url);
        if (u && typeof u === "string") pic = cgProxyPic(u);
      }
      var eps = cgResolve(arr, item.total_episode_count || item.published_episode_count || item.latest_episode_number);
      vods.push({ vod_id: "chengguo:" + slug, vod_name: title, vod_pic: pic, vod_remarks: eps ? (eps + "集") : "" });
    }
  } catch (e) {}
  return vods;
}
async function cgApiList(channel, page) {
  var j = null;
  try {
    var h = cgHeaders();
    h["Content-Type"] = "application/json"; h["Accept"] = "application/json"; h["X-Requested-With"] = "XMLHttpRequest";
    j = await httpPostJson(CG_SITE + "/api/v1/channels/" + encodeURIComponent(channel) + "?page=" + page, {}, h);
  } catch (e) { return null; }
  if (!j || typeof j !== "object") return null;
  var d = (j.data && typeof j.data === "object") ? j.data : j;
  var arr = Array.isArray(d) ? d : (Array.isArray(d.list) ? d.list : (Array.isArray(d.items) ? d.items : null));
  if (!arr || !arr.length) return null;
  var vods = [];
  var seen = {};
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    if (!item || typeof item !== "object") continue;
    var title = item.title, slug = item.slug;
    if (!title || typeof title !== "string" || !slug || typeof slug !== "string" || seen[slug]) continue;
    seen[slug] = 1;
    var pic = "";
    var cov = item.cover;
    if (cov) {
      var u = (typeof cov === "object" ? (cov.url || cov.fallback_url) : cov);
      if (u && typeof u === "string") pic = cgProxyPic(u);
    }
    var eps = item.total_episode_count || item.published_episode_count || item.latest_episode_number;
    vods.push({ vod_id: "chengguo:" + slug, vod_name: title, vod_pic: pic, vod_remarks: eps ? (eps + "集") : "" });
  }
  if (!vods.length) return null;
  var total = parseInt((d && d.total) || j.total || 0, 10) || 0;
  var hasMore = total > 0 ? (page * arr.length < total) : (arr.length >= 20);
  return { list: vods, hasMore: hasMore };
}
var cg = {
  cats: CG_CATS,
  list: async function (cat, page) {
    var ch = cat || "yuanchuang";
    if (page > 1) {
      var r = await cgApiList(ch, page);
      if (r) return r;
      return { list: [], hasMore: false };
    }
    var html = await httpGet(CG_SITE + "/" + ch, cgHeaders());
    var list = cgParseList(html);
    return { list: list, hasMore: list.length >= 12 };
  },
  search: async function (wd) {
    var html = await httpGet(CG_SITE + "/search?q=" + encodeURIComponent(wd), cgHeaders());
    return cgParseList(html);
  },
  detail: async function (slug) {
    var html = await httpGet(CG_SITE + "/drama/" + encodeURIComponent(slug), cgHeaders());
    if (!html) return null;
    var name = "";
    var tm = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (tm) name = clean(tm[1]);
    if (!name) { var t2 = html.match(/<title>([^<]+)<\/title>/i); if (t2) name = t2[1].split("-")[0].trim(); }
    var desc = "";
    var dm = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
    if (dm) desc = dm[1].trim();
    var pic = "";
    var pm = html.match(/(?:z-image-loader-url|data-cover-fb|data-src|src)="([^"]+)"/i);
    if (pm) pic = cgProxyPic(pm[1]);
    var labels = {};
    var esc = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var re = new RegExp('<a\\b[^>]*href="/play/' + esc + '/(\\d+)"[^>]*>([\\s\\S]*?)</a>', "gi");
    var m;
    while ((m = re.exec(html))) {
      var n = parseInt(m[1], 10);
      if (n > 0 && !labels[n]) labels[n] = clean(m[2]) || ("第" + n + "集");
    }
    var keys = Object.keys(labels).map(Number).sort(function (a, b) { return a - b; });
    if (!keys.length) return null;
    var eps = keys.map(function (n) { return { no: n, name: labels[n], url: "chengguo://" + slug + "/" + n }; });
    return { name: name || slug, pic: pic, desc: desc, eps: eps };
  },
  play: async function (slug, no) {
    var html = await httpGet(CG_SITE + "/play/" + encodeURIComponent(slug) + "/" + no, cgHeaders());
    if (!html) return "";
    html = html.replace(/\\u0026/g, "&").replace(/\\u002F/g, "/").replace(/\\\//g, "/");
    var m = html.match(/https?:\/\/[^\s"'\\]{10,300}\.m3u8[^\s"'\\]{0,200}/i);
    return m ? m[0] : "";
  }
};

/* ================= 平台: 七星 ================= */
var QX_SITE = "https://app.whjzjx.cn";
var QX_AUTH = "https://u.shytkjgs.com";
var QX_KEY = "B@ecf920Od8A4df7";
var QX_UA = "Mozilla/5.0 (Linux; Android 9; V1938T Build/PQ3A.190705.08211809; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Safari/537.36";
var QX_CATS = [
  { type_id: "1", type_name: "剧场" },
  { type_id: "3", type_name: "新剧" },
  { type_id: "2", type_name: "热播" },
  { type_id: "7", type_name: "星选" },
  { type_id: "5", type_name: "阳光" }
];
var qxToken = "", qxTokenAt = 0;
async function qxAuth() {
  if (qxToken && Date.now() - qxTokenAt < 30 * 60 * 1000) return qxToken;
  var payload = JSON.stringify({
    device: "2a50580e69d38388c94c93605241fb306", package_name: "com.jz.xydj",
    android_id: "ec1280db12795506", install_first_open: true,
    first_install_time: 1752505243345, last_update_time: 1752505243345,
    report_link_url: "", authorization: "", timestamp: Date.now()
  });
  var body = aesEcbB64(QX_KEY, payload);
  var j = await httpPostForm(QX_AUTH + "/user/v3/account/login", body, {
    "platform": "1", "user_agent": QX_UA, "content-type": "application/json; charset=utf-8"
  });
  var tk = j && j.data && typeof j.data === "object" ? String(j.data.token || "") : "";
  if (tk) { qxToken = tk; qxTokenAt = Date.now(); }
  return tk;
}
function qxH(tk) { return { "authorization": tk, "platform": "1", "version_name": "3.8.3.1", "User-Agent": QX_UA }; }
function qxCard(item, catName) {
  if (item && typeof item === "object" && item.theater) item = item.theater;
  var vid = pick(item, "id"); var name = clean(pick(item, "title"));
  if (!vid || !name) return null;
  var pic = pick(item, "cover_url");
  if (pic && pic.indexOf("http") !== 0) pic = QX_SITE + (pic.charAt(0) === "/" ? pic : "/" + pic);
  return {
    vod_id: "qixing:" + vid, vod_name: name, vod_pic: pic,
    vod_remarks: clean(pick(item, "play_amount_str", "score_str")),
    vod_class: catName, vod_content: clean(pick(item, "introduction")).slice(0, 200)
  };
}
async function qxDetailRaw(vid) {
  var tk = await qxAuth();
  if (!tk) return null;
  var j = await httpGetJson(QX_SITE + "/v2/theater_parent/detail?theater_parent_id=" + encodeURIComponent(vid), qxH(tk));
  if (!j || typeof j.data !== "object" || !j.data) return null;
  return j.data;
}
var qixing = {
  cats: QX_CATS,
  list: async function (cat, page) {
    var tk = await qxAuth();
    if (!tk) return { list: [], hasMore: false };
    var j = await httpGetJson(QX_SITE + "/v1/theater/home_page?theater_class_id=" + encodeURIComponent(cat || "1") + "&page_num=" + page + "&page_size=24", qxH(tk));
    var d = (j && j.data && typeof j.data === "object") ? j.data : {};
    var items = Array.isArray(d.list) ? d.list : [];
    var cn = "";
    for (var i = 0; i < QX_CATS.length; i++) if (QX_CATS[i].type_id === String(cat)) cn = QX_CATS[i].type_name;
    var list = items.map(function (it) { return qxCard(it, cn); }).filter(Boolean);
    return { list: list, hasMore: list.length > 0 && d.is_end !== true };
  },
  search: async function (wd) {
    var tk = await qxAuth();
    if (!tk) return [];
    var j = await httpPostJson(QX_SITE + "/v3/search", { text: wd }, qxH(tk));
    var items = (j && j.data && j.data.theater && Array.isArray(j.data.theater.search_data)) ? j.data.theater.search_data : [];
    return items.map(function (it) { return qxCard(it, "搜索"); }).filter(Boolean);
  },
  detail: async function (vid) {
    var d = await qxDetailRaw(vid);
    if (!d) return null;
    var eps = [];
    var seen = {};
    var raws = Array.isArray(d.theaters) ? d.theaters : [];
    for (var i = 0; i < raws.length; i++) {
      var raw = raws[i];
      var no = parseInt(pick(raw, "num"), 10) || (eps.length + 1);
      if (seen[no]) continue;
      seen[no] = 1;
      var src = pick(raw, "son_video_url");
      if (!src) continue;
      var sn = clean(pick(raw, "son_title"));
      eps.push({ no: no, name: (sn && sn !== clean(pick(d, "title"))) ? ("第" + no + "集 " + sn) : ("第" + no + "集"), url: "qixing://" + vid + "/" + no });
    }
    eps.sort(function (a, b) { return a.no - b.no; });
    if (!eps.length) return null;
    return { name: clean(pick(d, "title")) || vid, pic: pick(d, "cover_url"), desc: clean(pick(d, "introduction")).slice(0, 400), eps: eps };
  },
  play: async function (vid, no) {
    var d = await qxDetailRaw(vid);
    if (!d) return "";
    var raws = Array.isArray(d.theaters) ? d.theaters : [];
    for (var i = 0; i < raws.length; i++) {
      if ((parseInt(pick(raws[i], "num"), 10) || 0) === no) {
        var src = pick(raws[i], "son_video_url");
        if (src.indexOf("http") === 0) return src;
      }
    }
    return "";
  }
};

/* ================= 平台: 星芽 ================= */
var XY_SITE = "https://app.whjzjx.cn";
var XY_AUTH = "https://u.shytkjgs.com";
var XY_DEVICE = "24250683a3bdb3f118dff25ba4b1cba1a";
var XY_UUID = "randomUUID_914e7a9b-deac-4f80-9247-db56669187df";
var XY_DEVTOKEN = "WuoRLUg1r08Z1f0IqSv2q1lvfxrYckKavmnAPYLdkT9P1fPFNRt0RuN3DLLFZqApRDdPD3mM2jB6d79CF2LtM*";
var XY_UA = "Mozilla/5.0 (Linux; Android 9; RMX1931 Build/PQ3A.190605.05081124; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36";
var XY_APP_UA = "Mozilla/5.0 (Linux; Android 9; RMX1931 Build/PQ3A.190605.05081124; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36";
var XY_CATS = [
  { type_id: "juchang", type_name: "剧场", cid: "1" },
  { type_id: "reboduanju", type_name: "热播剧", cid: "2" },
  { type_id: "huiyuan", type_name: "会员专享", cid: "8" },
  { type_id: "xingxuan", type_name: "星选好剧", cid: "7" },
  { type_id: "xinju", type_name: "新剧", cid: "3" },
  { type_id: "yangguang", type_name: "阳光剧场", cid: "5" }
];
var xyHeaders = null;
async function xyAuth() {
  if (xyHeaders) return xyHeaders;
  var lh = {
    "User-Agent": "okhttp/4.10.0", "Content-Type": "application/x-www-form-urlencoded",
    "x-app-id": "7", "platform": "1", "version_name": "3.3.1", "app_version": "3.3.1",
    "device_platform": "android", "device_id": XY_DEVICE, "device_type": "RMX1931",
    "device_brand": "realme", "os_version": "9", "channel": "default", "uuid": XY_UUID
  };
  var form = "device=" + XY_DEVICE + "&install_first_open=false&first_install_time=1723214205125&last_update_time=1723214205125&report_link_url=";
  var j = await httpPostForm(XY_AUTH + "/user/v1/account/login", form, lh);
  var tk = j && j.data && typeof j.data === "object" ? String(j.data.token || "").trim() : "";
  if (!tk) return null;
  var h = {};
  Object.keys(lh).forEach(function (k) { h[k] = lh[k]; });
  h["authorization"] = tk; h["dev_token"] = XY_DEVTOKEN; h["user_agent"] = XY_APP_UA; h["support_h265"] = "1";
  xyHeaders = h;
  return xyHeaders;
}
function xyCard(item, catName) {
  var vid = pick(item, "id"); var name = clean(pick(item, "title"));
  if (!vid || !name) return null;
  var total = parseInt(pick(item, "total"), 10) || 0;
  return {
    vod_id: "xingya:" + vid, vod_name: name, vod_pic: pick(item, "cover_url"),
    vod_remarks: total > 0 ? ("共" + total + "集") : "", vod_class: catName
  };
}
async function xyDetailRaw(vid) {
  var h = await xyAuth();
  if (!h) return null;
  var j = await httpGetJson(XY_SITE + "/v2/theater_parent/detail?theater_parent_id=" + encodeURIComponent(vid), h);
  if (!j || typeof j.data !== "object" || !j.data) return null;
  return j.data;
}
var xingya = {
  cats: XY_CATS,
  list: async function (cat, page) {
    var h = await xyAuth();
    if (!h) return { list: [], hasMore: false };
    var c = XY_CATS[0];
    for (var i = 0; i < XY_CATS.length; i++) if (XY_CATS[i].type_id === String(cat)) c = XY_CATS[i];
    var j = await httpGetJson(XY_SITE + "/cloud/v2/theater/home_page?theater_class_id=" + c.cid + "&type=1&class2_ids=0&page_num=" + page + "&page_size=24", h);
    var d = (j && j.data && typeof j.data === "object") ? j.data : {};
    var arr = Array.isArray(d.list) ? d.list : [];
    var items = arr.map(function (e) { return (e && typeof e === "object" && e.theater) ? e.theater : null; }).filter(Boolean);
    var list = items.map(function (it) { return xyCard(it, c.type_name); }).filter(Boolean);
    return { list: list, hasMore: list.length > 0 && d.is_end !== true };
  },
  search: async function (wd) {
    var h = await xyAuth();
    if (!h) return [];
    var hh = {};
    Object.keys(h).forEach(function (k) { hh[k] = h[k]; });
    hh["Content-Type"] = "application/json";
    var j = await httpPostJson(XY_SITE + "/v3/search", { text: wd }, hh);
    var items = (j && j.data && j.data.theater && Array.isArray(j.data.theater.search_data)) ? j.data.theater.search_data : [];
    return items.map(function (it) { return xyCard(it, "搜索"); }).filter(Boolean);
  },
  detail: async function (vid) {
    var d = await xyDetailRaw(vid);
    if (!d) return null;
    var eps = [];
    var seen = {};
    var title = clean(pick(d, "title"));
    var raws = Array.isArray(d.theaters) ? d.theaters : [];
    var idx = 0;
    for (var i = 0; i < raws.length; i++) {
      idx++;
      var raw = raws[i];
      var no = parseInt(pick(raw, "num"), 10) || idx;
      if (seen[no]) continue;
      seen[no] = 1;
      var sn = clean(pick(raw, "son_title"));
      eps.push({ no: no, name: (sn && sn !== title) ? ("第" + no + "集 " + sn) : ("第" + no + "集"), url: "xingya://" + vid + "/" + no });
    }
    eps.sort(function (a, b) { return a.no - b.no; });
    if (!eps.length) return null;
    return { name: title || vid, pic: pick(d, "cover_url"), desc: clean(pick(d, "introduction")).slice(0, 400), eps: eps };
  },
  play: async function (vid, no) {
    var d = await xyDetailRaw(vid);
    if (!d) return "";
    var raws = Array.isArray(d.theaters) ? d.theaters : [];
    for (var i = 0; i < raws.length; i++) {
      if ((parseInt(pick(raws[i], "num"), 10) || 0) === no) {
        var src = pick(raws[i], "son_video_url");
        if (src.indexOf("http") === 0) return src;
      }
    }
    return "";
  }
};

/* ================= 平台: 狂飙 ================= */
var KB_SITE = "https://ai.dramarush.tv";
var KB_UA = "Mozilla/5.0 (Linux; Android 12; Mobile) AppleWebKit/537.36 Chrome/131.0 Safari/537.36";
var KB_PLAY_PREFIX = "https://raw.shorttv.online/uploads/direct/";
var KB_CATS = [
  { type_id: "t-5jxcit", type_name: "短剧", q: { categorySlug: "t-5jxcit" }, mode: "all", rounds: 1 },
  { type_id: "normal_short", type_name: "正规短剧", q: { contentKind: "SHORT_DRAMA" }, mode: "normal", rounds: 6 },
  { type_id: "adult_short", type_name: "成人短剧", q: { tagSlug: "adult" }, mode: "adult", rounds: 6 }
];
var KB_PAGE = 12, KB_MAX_EP = 80;
function kbH() { return { "User-Agent": KB_UA, "Referer": KB_SITE + "/zh/", "Accept": "application/json, text/plain, */*" }; }
async function kbTrpc(name, payload) {
  var target = KB_SITE + "/api/trpc/" + name;
  if (payload) target += "?input=" + encodeURIComponent(JSON.stringify({ json: payload })).replace(/%20/g, "+");
  var j = await httpGetJson(target, kbH());
  var out = j && j.result && j.result.data && j.result.data.json;
  return (out && typeof out === "object") ? out : {};
}
function kbDrama(item) { return (item && item.drama && typeof item.drama === "object") ? item.drama : (item || {}); }
function kbIsAdult(item) {
  var drama = kbDrama(item);
  var tags = Array.isArray(drama.tags) ? drama.tags : [];
  return tags.some(function (tg) { var n = String((tg && tg.name) || ""); return n.indexOf("adult-") === 0 || n.indexOf("不伦") >= 0 || n.indexOf("偷情") >= 0; });
}
function kbCover(drama) {
  var keys = ["cover", "poster"];
  for (var ki = 0; ki < keys.length; ki++) {
    var raw = String(drama[keys[ki]] || "");
    if (!raw || raw.indexOf("dc/img/828ed491f008e85d9caef01a.jpg") >= 0) continue;
    raw = raw.replace("https://cdn.shorttv.online/lsj/", "https://raw.shorttv.online/lsj/");
    if (raw.indexOf("_minimize.") >= 0) return raw;
    var qi = raw.indexOf("?");
    var path = raw, q = "";
    if (qi >= 0) { path = raw.slice(0, qi); q = raw.slice(qi); }
    if (path.lastIndexOf(".") > path.lastIndexOf("/")) raw = path.slice(0, path.lastIndexOf(".")) + "_minimize.webp" + q;
    return raw;
  }
  return "";
}
function kbCard(item, catName) {
  var drama = kbDrama(item);
  var vid = String(drama.id || "").trim();
  var name = clean(drama.title);
  if (!vid || !name) return null;
  var total = parseInt(drama.totalEpisodes, 10) || 0;
  return {
    vod_id: "kuangbiao:" + vid, vod_name: name, vod_pic: kbCover(drama),
    vod_remarks: total > 0 ? (total + "集") : "", vod_class: catName,
    vod_content: clean(drama.description).slice(0, 200)
  };
}
async function kbBrowsePage(spec, page) {
  var cursor = "", target = [], targetNext = "";
  for (var i = 1; i <= page; i++) {
    var data = { limit: KB_PAGE };
    Object.keys(spec.q).forEach(function (k) { data[k] = spec.q[k]; });
    if (cursor) data.cursor = cursor;
    var out = [], seen = {}, next = "";
    for (var r = 0; r < spec.rounds; r++) {
      if (cursor) data.cursor = cursor;
      var body = await kbTrpc("feed.browse", data);
      if (!body || !Object.keys(body).length) break;
      var raws = Array.isArray(body.items) ? body.items : [];
      for (var j = 0; j < raws.length; j++) {
        var rawItem = raws[j];
        if (spec.mode === "adult" && !kbIsAdult(rawItem)) continue;
        if (spec.mode === "normal" && kbIsAdult(rawItem)) continue;
        var drama = kbDrama(rawItem);
        var k = String(drama.id || "").trim() || clean(drama.title);
        if (!k || seen[k]) continue;
        seen[k] = 1;
        out.push(rawItem);
      }
      next = String(body.nextCursor || "").trim();
      if (out.length >= KB_PAGE || !next) break;
      cursor = next;
    }
    if (i === page) { target = out; targetNext = next; }
    cursor = next;
    if (!next) break;
  }
  return { items: target, hasMore: !!targetNext };
}
async function kbEpTable(dramaId, no) {
  var body = await kbTrpc("episode.watch", { dramaId: dramaId, episodeNumber: no });
  var table = {};
  var eps = Array.isArray(body.episodes) ? body.episodes : [];
  for (var i = 0; i < eps.length; i++) {
    var idx = parseInt(eps[i] && eps[i].index, 10);
    var id = String((eps[i] && eps[i].id) || "").trim();
    if (idx > 0 && id) table[idx] = id;
  }
  return { body: body, table: table };
}
var kuangbiao = {
  cats: KB_CATS,
  list: async function (cat, page) {
    var spec = KB_CATS[0];
    for (var i = 0; i < KB_CATS.length; i++) if (KB_CATS[i].type_id === String(cat)) spec = KB_CATS[i];
    var r = await kbBrowsePage(spec, page);
    var list = r.items.map(function (it) { return kbCard(it, spec.type_name); }).filter(Boolean);
    return { list: list, hasMore: list.length > 0 && r.hasMore };
  },
  search: async function (wd) {
    var r = await kbBrowsePage(KB_CATS[0], 1);
    return r.items.map(function (it) { return kbCard(it, "搜索"); }).filter(Boolean).filter(function (c) { return c.vod_name.indexOf(wd) >= 0; }).slice(0, 20);
  },
  detail: async function (vid) {
    var r = await kbEpTable(vid, 1);
    var body = r.body, table = r.table;
    var drama = (body && body.drama && typeof body.drama === "object") ? body.drama : {};
    var total = parseInt(drama.totalEpisodes, 10) || 0;
    if (total < Object.keys(table).length) total = Object.keys(table).length;
    if (total < 1) total = 1;
    if (total > KB_MAX_EP) total = KB_MAX_EP;
    var eps = [];
    for (var i = 1; i <= total; i++) eps.push({ no: i, name: "第" + i + "集", url: "kuangbiao://" + vid + "/" + i });
    return { name: clean(drama.title) || vid, pic: kbCover(drama), desc: clean(drama.description).slice(0, 400), eps: eps };
  },
  play: async function (vid, no) {
    var r = await kbEpTable(vid, no);
    // 站方现行契约：episode.watch 响应 episode.hlsUrl（rccdn 会话门禁，见报告）
    var epObj = (r.body && r.body.episode && typeof r.body.episode === "object") ? r.body.episode : null;
    if (epObj && epObj.hlsUrl && String(epObj.hlsUrl).indexOf("http") === 0) return String(epObj.hlsUrl);
    var epId = r.table[no];
    if (epId) return KB_PLAY_PREFIX + epId + "/video.mp4";
    var url = KB_SITE + "/zh/watch/" + encodeURIComponent(vid) + "/" + no;
    var html = await httpGet(url, { "User-Agent": KB_UA, "Referer": url });
    var m = html && html.match(/https?:\/\/[^\s"'\\]+\.(?:m3u8|mp4)[^\s"'\\]*/i);
    return m ? m[0] : "";
  }
};

/* ================= 平台: 酷我 ================= */
var KW_SITE = "http://wapi.kuwo.cn/openapi/v1/shortplay";
var KW_PLAY = "http://nmobi.kuwo.cn/mobi.s";
var KW_UA = "okhttp/5.1.0";
var KW_CATS = [
  { type_id: "10", type_name: "猜你想看" },
  { type_id: "11", type_name: "土味爱情" },
  { type_id: "12", type_name: "更多精彩" },
  { type_id: "13", type_name: "霸道总裁的人生" },
  { type_id: "14", type_name: "赘婿当道" },
  { type_id: "15", type_name: "漫漫追妻路" },
  { type_id: "16", type_name: "家庭情感" }
];
function kwH() { return { "User-Agent": KW_UA, "Accept": "application/json" }; }
function kwCard(a) {
  if (!a || typeof a !== "object") return null;
  var vid = String(a.url || "").trim();
  var name = clean(a.title) || clean(a.subTitle);
  if (!vid || !name) return null;
  var remarks = clean(a.currrentDesc);
  if (!remarks) { var n = parseInt(a.songNum, 10) || 0; if (n > 0) remarks = n + "集全"; }
  return { vod_id: "kuwo:" + vid, vod_name: name, vod_pic: String(a.img || "").trim(), vod_remarks: remarks, vod_class: "酷我短剧" };
}
var kuwo = {
  cats: KW_CATS,
  list: async function (cat, page) {
    var j = await httpGetJson(KW_SITE + "/moduleMore?currentPage=" + page + "&moduleId=" + encodeURIComponent(cat || "10") + "&rn=12", kwH());
    var d = (j && j.data && typeof j.data === "object") ? j.data : {};
    var items = Array.isArray(d.list) ? d.list : [];
    var seen = {};
    var out = [];
    for (var i = 0; i < items.length; i++) {
      var c = kwCard(items[i]);
      if (c && !seen[c.vod_id]) { seen[c.vod_id] = 1; out.push(c); }
    }
    var hasMore;
    if (d.hasNextPage === true || d.hasNextPage === false) hasMore = d.hasNextPage;
    else if (typeof d.pageNum === "number" && typeof d.pages === "number") hasMore = d.pageNum < d.pages;
    else hasMore = out.length >= 12;
    return { list: out, hasMore: out.length > 0 && hasMore };
  },
  search: async function (wd) {
    var out = [], seen = {};
    var wl = wd.toLowerCase();
    for (var ci = 0; ci < KW_CATS.length; ci++) {
      for (var pg = 1; pg <= 2 && out.length < 30; pg++) {
        var j = await httpGetJson(KW_SITE + "/moduleMore?currentPage=" + pg + "&moduleId=" + KW_CATS[ci].type_id + "&rn=12", kwH());
        var items = (j && j.data && Array.isArray(j.data.list)) ? j.data.list : [];
        for (var i = 0; i < items.length; i++) {
          var card = kwCard(items[i]);
          if (card && !seen[card.vod_id] && card.vod_name.toLowerCase().indexOf(wl) >= 0) { seen[card.vod_id] = 1; out.push(card); }
        }
        if (!items.length) break;
      }
    }
    return out;
  },
  detail: async function (vid) {
    var j = await httpGetJson(KW_SITE + "/videoList?albumId=" + encodeURIComponent(vid), kwH());
    var data = (j && typeof j.data === "object" && j.data) || {};
    var info = (typeof data.shortinfo === "object" && data.shortinfo) || {};
    var eps = [];
    var list = Array.isArray(data.list) ? data.list : [];
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      var idx = i + 1;
      var pay = (it && typeof it.mvpayinfo === "object" && it.mvpayinfo) || {};
      var vn = String(pay.vid || "").trim();
      if (!vn || vn === "0") continue;
      eps.push({ no: idx, name: clean(it.name) || ("第" + idx + "集"), url: "kuwo://" + vid + "/" + vn });
    }
    if (!eps.length) return null;
    return { name: clean(info.title) || vid, pic: String(info.cover || "").trim(), desc: "", eps: eps };
  },
  play: async function (vid, epvid) {
    var tx = await httpGet(KW_PLAY + "?f=web&type=get_url_by_vid&vid=" + encodeURIComponent(epvid), { "User-Agent": KW_UA });
    if (!tx) return "";
    var m = tx.match(/^\s*url=(\S+)\s*$/m);
    var media = m ? m[1].trim() : "";
    if (!media) { var i = tx.indexOf("url="); if (i >= 0) media = tx.slice(i + 4).split(/[\r\n \t]/)[0].trim(); }
    return (media.indexOf("http") === 0) ? media : "";
  }
};

/* ================= 平台: 剧屋(MacCMS) ================= */
var JW_SITE = "https://www.juwu.tv";
var JW_CATS = [
  { type_id: "1", type_name: "短剧" },
  { type_id: "2", type_name: "情色电影" }
];
function jwH() { return { "Referer": JW_SITE + "/", "User-Agent": UA }; }
function jwCleanPic(pic) {
  var s = String(pic || "").trim();
  if (!s) return "";
  var hm = s.match(/^https?:\/\/([^\/:?#]+)/i);
  var host = hm ? hm[1].toLowerCase() : "";
  if (!host) return "";
  var bad = ["huangdouhui.tv"];
  for (var i = 0; i < bad.length; i++) {
    if (host === bad[i] || host.slice(-(bad[i].length + 1)) === "." + bad[i]) return "";
  }
  return s;
}
function jwCard(it) {
  if (!it || typeof it !== "object") return null;
  var vid = String(it.vod_id || "").trim();
  if (!vid) return null;
  return {
    vod_id: "juwu:" + vid, vod_name: String(it.vod_name || ""), vod_pic: jwCleanPic(it.vod_pic),
    vod_remarks: String(it.vod_remarks || ""), vod_class: String(it.vod_class || ""), vod_content: clean(it.vod_content)
  };
}
function _jwQs(params) {
  return Object.keys(params).map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]); }).join("&");
}
async function jwQuery(params) {
  var j = await httpGetJson(JW_SITE + "/api.php/provide/vod/?" + _jwQs(params), jwH());
  if (!j || j.code !== 1) return [];
  return Array.isArray(j.list) ? j.list : [];
}
async function jwQueryPage(params) {
  var j = await httpGetJson(JW_SITE + "/api.php/provide/vod/?" + _jwQs(params), jwH());
  if (!j || j.code !== 1) return { items: [], hasMore: false };
  var items = Array.isArray(j.list) ? j.list : [];
  var pg = parseInt(j.page, 10) || 1, pgc = parseInt(j.pagecount, 10) || 1;
  return { items: items, hasMore: items.length > 0 && pg < pgc };
}
function jwPlayEps(raw) {
  var best = [];
  var lines = String(raw || "").split("$$$");
  for (var li = 0; li < lines.length; li++) {
    var eps = [];
    var segs = lines[li].split("#");
    for (var si = 0; si < segs.length; si++) {
      var di = segs[si].indexOf("$");
      if (di < 0) continue;
      var addr = segs[si].slice(di + 1).trim();
      if (addr) eps.push({ name: segs[si].slice(0, di).trim(), addr: addr });
    }
    if (eps.length > best.length) best = eps;
  }
  return best;
}
var juwu = {
  cats: JW_CATS,
  list: async function (cat, page) {
    var r = await jwQueryPage({ ac: "detail", t: cat || "1", pg: String(page) });
    return { list: r.items.map(jwCard).filter(Boolean), hasMore: r.hasMore };
  },
  search: async function (wd) {
    var items = await jwQuery({ ac: "detail", wd: wd, pg: "1" });
    return items.map(jwCard).filter(Boolean).slice(0, 30);
  },
  detail: async function (vid) {
    var items = await jwQuery({ ac: "detail", ids: vid });
    if (!items.length) return null;
    var it = items[0];
    var eps = jwPlayEps(it.vod_play_url).map(function (e, i) { return { no: i + 1, name: e.name || ("第" + (i + 1) + "集"), url: "juwu://" + vid + "/" + (i + 1) }; });
    if (!eps.length) return null;
    return { name: String(it.vod_name || ""), pic: jwCleanPic(it.vod_pic), desc: clean(it.vod_content).slice(0, 400), eps: eps };
  },
  play: async function (vid, no) {
    var items = await jwQuery({ ac: "detail", ids: vid });
    if (!items.length) return "";
    var eps = jwPlayEps(items[0].vod_play_url);
    var e = eps[no - 1];
    return (e && e.addr.indexOf("http") === 0) ? e.addr : "";
  }
};

/* ================= 平台: 围观 ================= */
var WG_SITE = "https://api.drama.9ddm.com";
var WG_UA = "okhttp/4.10.0";
var WG_CATS = [{ type_id: "all", type_name: "全部" }];
function wgH() { return { "User-Agent": WG_UA, "Accept": "application/json, text/plain, */*", "Origin": WG_SITE, "Referer": WG_SITE + "/" }; }
function wgCard(it) {
  if (!it || typeof it !== "object") return null;
  var vid = String(it.oneId || "").trim();
  var name = clean(it.title);
  if (!vid || !name) return null;
  var count = parseInt(it.episodeCount, 10) || 0;
  return {
    vod_id: "weiguan:" + vid, vod_name: name,
    vod_pic: String(it.vertPoster || it.horizonPoster || "").trim(),
    vod_remarks: count > 0 ? ("共" + count + "集") : "",
    vod_class: "围观", vod_content: clean(it.description).slice(0, 200)
  };
}
async function wgEpisodes(oneId) {
  var j = await httpGetJson(WG_SITE + "/drama/home/shortVideoDetail?version_code=1000&os_type=1&oneId=" + encodeURIComponent(oneId) + "&page=1&pageSize=1000", wgH());
  if (!j || j.data === undefined || j.data === null || j.data === "null") return [];
  var arr = Array.isArray(j.data) ? j.data : [j.data];
  return arr.filter(function (e) { return e && typeof e === "object"; });
}
function wgOrder(ep, index) {
  return (parseInt(ep.playOrder, 10) || parseInt(ep.episode, 10) || (index + 1));
}
function wgPlayUrl(ep) {
  var raw = ep.playSetting !== undefined ? ep.playSetting : ep.videoClarityList;
  if (typeof raw === "string") {
    var tx = raw.trim();
    if (!tx) return "";
    try { raw = JSON.parse(tx); } catch (e) { return tx.indexOf("http") === 0 ? tx : (String(ep.playUrl || "")); }
  }
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    var u = pick(raw, "super", "high", "normal", "url", "playUrl");
    if (u.indexOf("http") === 0) return u;
  }
  if (Array.isArray(raw)) {
    var best = null;
    for (var i = 0; i < raw.length; i++) {
      var it = raw[i];
      if (!it || typeof it !== "object") continue;
      if (!best) best = it;
      var cl = String(it.clarity || "");
      if (cl === "1080P" || cl === "1080p" || cl === "super" || cl === "超清") best = it;
    }
    if (best) { var u2 = pick(best, "url", "playUrl"); if (u2.indexOf("http") === 0) return u2; }
  }
  var u3 = String(ep.playUrl || "");
  return u3.indexOf("http") === 0 ? u3 : "";
}
var weiguan = {
  cats: WG_CATS,
  list: async function (cat, page) {
    var j = await httpPostJson(WG_SITE + "/drama/home/search?version_code=1500&os_type=1",
      { audience: "全部受众", page: page, pageSize: 30, searchWord: "", subject: "全部主题" }, wgH());
    var arr = (j && Array.isArray(j.data)) ? j.data : [];
    var seen = {};
    var out = [];
    for (var i = 0; i < arr.length; i++) { var c = wgCard(arr[i]); if (c && !seen[c.vod_id]) { seen[c.vod_id] = 1; out.push(c); } }
    return { list: out, hasMore: out.length >= 30 };
  },
  search: async function (wd) {
    var j = await httpPostJson(WG_SITE + "/drama/home/search?version_code=1500&os_type=1",
      { audience: "全部受众", page: 1, pageSize: 30, searchWord: wd, subject: "全部主题" }, wgH());
    var arr = (j && Array.isArray(j.data)) ? j.data : [];
    return arr.map(wgCard).filter(Boolean).slice(0, 30);
  },
  detail: async function (vid) {
    var items = await wgEpisodes(vid);
    if (!items.length) return null;
    var first = items[0];
    var eps = [];
    var seen = {};
    items.forEach(function (ep, i) {
      var order = wgOrder(ep, i);
      if (seen[order]) return;
      seen[order] = 1;
      eps.push({ no: order, name: "第" + order + "集", url: "weiguan://" + vid + "/" + order });
    });
    eps.sort(function (a, b) { return a.no - b.no; });
    if (!eps.length) return null;
    return {
      name: clean(first.title) || vid, pic: String(first.vertPoster || first.horizonPoster || ""),
      desc: clean(pick(first, "description", "desc")).slice(0, 400), eps: eps
    };
  },
  play: async function (vid, no) {
    var items = await wgEpisodes(vid);
    for (var i = 0; i < items.length; i++) {
      if (wgOrder(items[i], i) === no) return wgPlayUrl(items[i]);
    }
    return "";
  }
};

/* ================= 路由 ================= */
var PLATS = { chengguo: cg, qixing: qixing, xingya: xingya, kuangbiao: kuangbiao, kuwo: kuwo, juwu: juwu, weiguan: weiguan };
var PLAT_NAMES = { chengguo: "橙果", qixing: "七星", xingya: "星芽", kuangbiao: "狂飙", kuwo: "酷我", juwu: "剧屋", weiguan: "围观" };
function splitId(id) {
  var s = String(id || "");
  var i = s.indexOf(":");
  if (i > 0 && PLATS[s.slice(0, i)]) return [s.slice(0, i), s.slice(i + 1)];
  return ["chengguo", s];
}
function parseEpToken(tok) {
  var m = String(tok || "").match(/^([a-z0-9_]+):\/\/(.+)$/);
  if (!m || !PLATS[m[1]]) return null;
  var rest = m[2];
  var cut = rest.lastIndexOf("/");
  if (cut <= 0) return null;
  var no = parseInt(rest.slice(cut + 1), 10);
  if (!no) return null;
  return { plat: m[1], vid: rest.slice(0, cut), no: no };
}
var PLAY_UA_HEADERS = {
  chengguo: { "Referer": CG_SITE + "/", "User-Agent": UA },
  qixing: { "User-Agent": QX_UA },
  xingya: { "Referer": XY_SITE + "/", "User-Agent": "okhttp/4.10.0" },
  kuangbiao: { "User-Agent": KB_UA, "Referer": KB_SITE + "/zh/" },
  kuwo: { "User-Agent": KW_UA },
  juwu: { "Referer": JW_SITE + "/", "User-Agent": UA },
  weiguan: { "User-Agent": WG_UA, "Referer": WG_SITE + "/" }
};

function _jhToCard(v) {
  return {
    id: v.vod_id,
    type: "url",
    title: v.vod_name,
    posterUrl: v.vod_pic || "",
    posterPath: v.vod_pic || "",
    coverUrl: v.vod_pic || "",
    backdropPath: v.vod_pic || "",
    remark: v.vod_remarks || "",
    description: v.vod_content || "",
    link: v.vod_id
  };
}

async function loadList(params) {
  params = params || {};
  var plat = String(params.plat || "chengguo");
  if (!PLATS[plat]) plat = "chengguo";
  var p = PLATS[plat];
  var cats = p.cats;
  var cat = String(params.cat || cats[0].type_id);
  var valid = false;
  for (var i = 0; i < cats.length; i++) if (cats[i].type_id === cat) valid = true;
  if (!valid) cat = cats[0].type_id;
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var r = await p.list(cat, page);
    var list = (r && r.list) || [];
    if (!list.length) return [{ id: "empty", type: "url", title: "没有更多内容" }];
    return list.map(_jhToCard);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg }];
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
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var keys = ["chengguo", "qixing", "xingya", "kuangbiao", "kuwo", "juwu", "weiguan"];
  var results = await Promise.all(keys.map(async function (k) {
    try {
      var r = await PLATS[k].search(wd);
      return (r || []).slice(0, 10);
    } catch (e) { return []; }
  }));
  var out = [];
  var seen = {};
  for (var i = 0; i < results.length; i++) {
    for (var j = 0; j < results[i].length; j++) {
      var c = results[i][j];
      if (c && !seen[c.vod_id]) { seen[c.vod_id] = 1; out.push(_jhToCard(c)); }
    }
  }
  return out.length ? out.slice(0, 60) : [{ id: "empty", type: "url", title: "没有找到相关短剧" }];
}

async function loadDetail(link) {
  var ref = String(link || "");
  var parts = splitId(ref);
  var pkey = parts[0], vid = parts[1];
  if (!vid) return { id: ref, type: "url", title: "参数错误", link: ref };
  var d = null;
  try { d = await PLATS[pkey].detail(vid); } catch (e) {}
  if (!d || !d.eps || !d.eps.length) {
    return { id: ref, type: "url", title: "加载失败", description: "未取到剧集列表", link: ref };
  }
  var episodes = d.eps.map(function (ep) {
    return { name: ep.name, id: ep.url, link: ep.url };
  });
  var cover = d.pic || "";
  return {
    id: ref,
    type: "url",
    title: d.name || vid,
    posterUrl: cover,
    posterPath: cover,
    coverUrl: cover,
    backdropPath: cover,
    description: d.desc || "",
    remark: "共" + d.eps.length + "集",
    episodes: episodes,
    link: ref
  };
}

// stream 模块：
// - 传入单集 token（plat://vid/no）时只解析该集
// - 传入整剧引用（plat:vid）时逐集解析，连续 3 集失败即停
async function loadResource(params) {
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  try {
    var ep = parseEpToken(raw);
    if (ep) {
      var one = "";
      try { one = await PLATS[ep.plat].play(ep.vid, ep.no); } catch (e) {}
      if (!one) return [];
      return [{
        name: ep.plat === "kuwo" ? "播放" : ("第" + ep.no + "集"),
        url: one,
        playerType: "app",
        customHeaders: PLAY_UA_HEADERS[ep.plat] || { "User-Agent": UA }
      }];
    }
    var parts = splitId(raw);
    var pkey = parts[0], vid = parts[1];
    if (!vid) return [];
    var d = null;
    try { d = await PLATS[pkey].detail(vid); } catch (e) {}
    if (!d || !d.eps || !d.eps.length) return [];
    var out = [];
    var misses = 0;
    for (var i = 0; i < d.eps.length; i++) {
      var e2 = d.eps[i];
      var url = "";
      try { url = await PLATS[pkey].play(vid, e2.no); } catch (e3) {}
      if (!url) {
        misses++;
        if (misses >= 3) break;
        continue;
      }
      misses = 0;
      out.push({
        name: e2.name,
        description: d.name || "",
        url: url,
        playerType: "app",
        customHeaders: PLAY_UA_HEADERS[pkey] || { "User-Agent": UA }
      });
    }
    return out;
  } catch (e) {
    return [];
  }
}
