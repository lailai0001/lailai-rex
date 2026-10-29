// 野果短剧 for REX (lai_yeguo v1.0.0)
// 移植自 mira-cat 蜘蛛 yeguo.js (py_yeguo)，只读蓝图，未改动原仓库。
// 后端：https://www.yeguodj.com/api.php，响应 data 字段为 AES-128-CBC 加密串，
// 本模块用纯 JS AES 解密（已与 Node crypto 对拍一致），逻辑与蜘蛛逐项等价。
// 封面：pic.jtzatly.cn 与 pic.sugfew.cn / image.cpckgr.cn 均为加密图存储，
// 走已部署的 bagua-img-proxy 解密出图（sugfew/cpckgr 为站方现行图床，
// 蜘蛛写就时未覆盖、直出为加密字节，按 818 移植先例同样走 bagua 代理）；
// pic.wlwvch.cn 等域名走蜘蛛原定的黄果封面代理 huangguo.wulii.de5.net。
// 播放：多集短剧，详情出剧集列表，loadResource 实时调 /api/playlet/play 取址；
// 返回的是标准 AES-128 加密 HLS（带 EXT-X-KEY），播放器可直解。

WidgetMetadata = {
  id: "lai_yeguo",
  title: "野果短剧",
  description: "野果短剧：首页推荐/排行榜/原创/真人/漫剧等 10 个分类，多集短剧，播放实时解析",
  author: "lai",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  site: "https://yeguodj.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "首页推荐",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "home" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "排行榜",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "rank" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "野果原创",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "yuanchuang" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "真人短剧",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "zhenren" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "魔改漫剧",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "mogai" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "漫剧",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "manju" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "AI短剧",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "aiduanju" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "网红改编",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "wanghong" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "禁忌伦理",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "jinji" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "职场反差",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "zhichang" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      id: "loadResource",
      title: "野果播放源",
      description: "播放时实时解析播放地址",
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

var API_BASE = "https://www.yeguodj.com/api.php";
var SITE = "https://yeguodj.com";
var COVER_PROXY = "https://huangguo.wulii.de5.net";
var IMG_WORKER = "https://bagua-img-proxy.li768435813.workers.dev";
var IMG_PROXY_51 = "https://51chigua.li768435813.workers.dev";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var API_KEY = "2acf7e91e9864673";
var API_IV = "1c29882d3ddfcfd6";
var TIMEOUT = 20000;

function t(v) { return String(v == null ? "" : v).trim(); }

/* ---------------- UTF-8 / Base64 ---------------- */
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

function utf8Decode(bytes) {
  var out = "";
  var i = 0;
  while (i < bytes.length) {
    var b = bytes[i];
    if (b < 0x80) { out += String.fromCharCode(b); i += 1; continue; }
    var need, cp;
    if ((b & 0xe0) === 0xc0) { need = 1; cp = b & 0x1f; }
    else if ((b & 0xf0) === 0xe0) { need = 2; cp = b & 0x0f; }
    else if ((b & 0xf8) === 0xf0) { need = 3; cp = b & 0x07; }
    else { out += "�"; i += 1; continue; }
    var ok = true;
    for (var j = 1; j <= need; j++) {
      var nb = bytes[i + j];
      if (nb == null || (nb & 0xc0) !== 0x80) { ok = false; break; }
      cp = (cp << 6) | (nb & 0x3f);
    }
    if (!ok) { out += "�"; i += 1; continue; }
    i += need + 1;
    if (cp > 0xffff) {
      cp -= 0x10000;
      out += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff));
    } else {
      out += String.fromCharCode(cp);
    }
  }
  return out;
}

var _B64C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64Decode(str) {
  var s = String(str || "").replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  var out = [];
  var buf = 0, bits = 0;
  for (var i = 0; i < s.length; i++) {
    var ch = s.charAt(i);
    if (ch === "=") break;
    var v = _B64C.indexOf(ch);
    if (v < 0) continue;
    buf = (buf << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out.push((buf >> bits) & 0xff);
    }
  }
  return out;
}

/* ---------------- 纯 JS AES-128（解密方向） ---------------- */
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
var _INV_SBOX = [
  0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
  0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
  0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
  0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
  0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
  0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
  0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
  0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
  0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
  0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
  0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
  0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
  0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
  0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
  0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
  0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
];
var _RCON = [1, 2, 4, 8, 16, 32, 64, 128, 27, 54];

function _aesExpandKey(key) {
  var w = key.slice(0);
  for (var i = 4; i < 44; i++) {
    var tt = w.slice((i - 1) * 4, i * 4);
    if (i % 4 === 0) tt = [_SBOX[tt[1]] ^ _RCON[i / 4 - 1], _SBOX[tt[2]], _SBOX[tt[3]], _SBOX[tt[0]]];
    for (var j = 0; j < 4; j++) w[i * 4 + j] = w[(i - 4) * 4 + j] ^ tt[j];
  }
  return w;
}

function _gmult(a, b) {
  var p = 0;
  for (var i = 0; i < 8; i++) {
    if (b & 1) p ^= a;
    var hi = a & 0x80;
    a = (a << 1) & 0xff;
    if (hi) a ^= 0x1b;
    b >>= 1;
  }
  return p;
}

function _aesDecryptBlock(w, input) {
  var s = input.slice(0);
  var i, r, c;
  for (i = 0; i < 16; i++) s[i] ^= w[160 + i];
  for (var round = 9; round >= 1; round--) {
    var tt = s.slice(0);
    for (r = 0; r < 4; r++) for (c = 0; c < 4; c++) s[c * 4 + r] = tt[(((c - r) % 4) + 4) % 4 * 4 + r];
    for (i = 0; i < 16; i++) s[i] = _INV_SBOX[s[i]];
    for (i = 0; i < 16; i++) s[i] ^= w[round * 16 + i];
    for (c = 0; c < 4; c++) {
      var a0 = s[c * 4], a1 = s[c * 4 + 1], a2 = s[c * 4 + 2], a3 = s[c * 4 + 3];
      s[c * 4] = _gmult(a0, 14) ^ _gmult(a1, 11) ^ _gmult(a2, 13) ^ _gmult(a3, 9);
      s[c * 4 + 1] = _gmult(a0, 9) ^ _gmult(a1, 14) ^ _gmult(a2, 11) ^ _gmult(a3, 13);
      s[c * 4 + 2] = _gmult(a0, 13) ^ _gmult(a1, 9) ^ _gmult(a2, 14) ^ _gmult(a3, 11);
      s[c * 4 + 3] = _gmult(a0, 11) ^ _gmult(a1, 13) ^ _gmult(a2, 9) ^ _gmult(a3, 14);
    }
  }
  var t2 = s.slice(0);
  for (r = 0; r < 4; r++) for (c = 0; c < 4; c++) s[c * 4 + r] = t2[(((c - r) % 4) + 4) % 4 * 4 + r];
  for (i = 0; i < 16; i++) s[i] = _INV_SBOX[s[i]];
  for (i = 0; i < 16; i++) s[i] ^= w[i];
  return s;
}

// AES-128-CBC 解密 + PKCS7 去填充，返回 UTF-8 明文（与蜘蛛 aesDecrypt 等价）
function aesDecrypt(b64) {
  var w = _aesExpandKey(utf8Bytes(API_KEY).slice(0, 16));
  var iv = utf8Bytes(API_IV).slice(0, 16);
  var data = b64Decode(b64);
  var out = [];
  var prev = iv;
  for (var off = 0; off + 16 <= data.length; off += 16) {
    var block = data.slice(off, off + 16);
    var dec = _aesDecryptBlock(w, block);
    for (var i = 0; i < 16; i++) out.push(dec[i] ^ prev[i]);
    prev = block;
  }
  if (out.length) {
    var pad = out[out.length - 1];
    if (pad >= 1 && pad <= 16 && pad <= out.length) out = out.slice(0, out.length - pad);
  }
  return utf8Decode(out);
}

/* ---------------- API ---------------- */
function apiHeaders() {
  return {
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "User-Agent": UA,
    "Referer": SITE + "/",
    "Origin": SITE
  };
}

async function apiPost(path, body) {
  if (!Widget.http || typeof Widget.http.post !== "function") throw new Error("Widget.http.post 不可用");
  var url = API_BASE + path;
  var lastErr = null;
  for (var attempt = 0; attempt < 2; attempt++) {
    try {
      var res = await Widget.http.post(url, JSON.stringify(body || {}), { headers: apiHeaders(), timeout: TIMEOUT });
      var d = res && res.data != null ? res.data : null;
      if (d == null || d === "") { lastErr = new Error("空响应: " + path); continue; }
      if (typeof d === "string") { try { d = JSON.parse(d); } catch (e) {} }
      if (!d || typeof d !== "object") throw new Error("空响应: " + path);
      if (typeof d.data === "string" && d.data.length > 20) {
        try {
          d.data = JSON.parse(aesDecrypt(d.data));
        } catch (e) {
          throw new Error("API 解密失败: " + e.message);
        }
      }
      return d;
    } catch (e) {
      lastErr = e;
      if (e && /解密失败/.test(String(e.message || ""))) throw e;
    }
  }
  throw lastErr || new Error("请求失败: " + path);
}

function unwrap(d) {
  if (!d) return {};
  var x = d.data != null ? d.data : d;
  if (x && x.data != null && typeof x.data === "object") return x.data;
  return x;
}

/* ---------------- 封面 ---------------- */
function proxiedCover(url) {
  url = t(url);
  if (!url) return "";
  // 加密图存储（AES-128-CBC，与 818/91 同手法），走解密 Worker
  if (/^https?:\/\/pic\.jtzatly\.cn\//i.test(url) ||
      /^https?:\/\/pic\.sugfew\.cn\//i.test(url) ||
      /^https?:\/\/image\.cpckgr\.cn\//i.test(url)) {
    return IMG_WORKER + "/img?url=" + encodeURIComponent(url);
  }
  if (/pic\.wlwvch\.cn|pic\.zdmhyg\.cn|pic\.wirqed\.cn|imgpublic\.ycomesc\.live/i.test(url)) {
    return COVER_PROXY + "/?url=" + encodeURIComponent(url);
  }
  if (/^https?:\/\/pic\.nihmcl\.cn\//i.test(url)) {
    return IMG_PROXY_51 + "/img?url=" + encodeURIComponent(url);
  }
  return url;
}

/* ---------------- 列表 ---------------- */
function detailLink(id) { return "yeguo://detail/" + id; }
function episodeLink(vid, eid, n) { return "yeguo://episode/" + vid + "/" + eid + "/" + n; }

function toCard(it) {
  if (!it) return null;
  var id = t(it.video_id != null ? it.video_id : it.id);
  if (!id || !/^\d+$/.test(id)) return null;
  var title = t(it.title || it.video_title || it.name);
  if (!title) return null;
  var ep = it.episode_count || it.episodes || "";
  var remark = ep ? "更新至" + ep + "集" : t(it.update_status || it.serialize_status_text || "");
  var cover = proxiedCover(t(it.cover || it.cover_img || it.pic || ""));
  var link = detailLink(id);
  return {
    id: link,
    type: "url",
    title: title,
    posterPath: cover,
    coverUrl: cover,
    backdropPath: cover,
    link: link,
    description: remark,
    mediaType: "movie"
  };
}

function listFrom(data) {
  var inner = unwrap({ data: data });
  var arr = (inner && inner.list) || (inner && inner.top_list) || (Array.isArray(inner) ? inner : []);
  var out = [];
  var seen = {};
  for (var i = 0; i < arr.length; i++) {
    var card = toCard(arr[i]);
    if (!card || seen[card.id]) continue;
    seen[card.id] = 1;
    out.push(card);
  }
  return out;
}

async function loadList(params) {
  params = params || {};
  var cat = String(params.cat || params.path || "home");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var d;
    if (cat === "home") {
      if (page > 1) {
        d = await apiPost("/api/theater/exploreList", { page: page - 1, limit: 24 });
        return listFrom(d.data);
      }
      d = await apiPost("/api/home/homePage", {});
      var inner = unwrap(d);
      var list = (inner && inner.top_list) || [];
      var mods = (inner && inner.modules && inner.modules.list) || [];
      for (var i = 0; i < mods.length; i++) {
        var m = mods[i];
        if (!m) continue;
        // 站方现行字段为 items（蜘蛛写就时为 list，两者都兼容）；不再把模块本身当卡片
        var sub = Array.isArray(m.list) ? m.list : (Array.isArray(m.items) ? m.items : null);
        if (sub) list = list.concat(sub);
      }
      return listFrom(list);
    }
    if (cat === "rank") {
      d = await apiPost("/api/theater/videoRank", { page: page, limit: 24 });
    } else if (cat === "yuanchuang") {
      d = await apiPost("/api/theater/exploreList", { page: page, limit: 24, theme: 7 });
    } else if (cat === "zhenren") {
      d = await apiPost("/api/theater/exploreList", { page: page, limit: 24, theme: 8 });
    } else if (cat === "mogai") {
      d = await apiPost("/api/theater/exploreList", { page: page, limit: 24, theme: 9 });
    } else if (cat === "wanghong") {
      d = await apiPost("/api/theater/exploreList", { page: page, limit: 24, theme: 10 });
    } else if (cat === "jinji") {
      d = await apiPost("/api/theater/exploreList", { page: page, limit: 24, setting: 23 });
    } else if (cat === "zhichang") {
      d = await apiPost("/api/theater/exploreList", { page: page, limit: 24, setting: 24 });
    } else {
      // manju / aiduanju 在蜘蛛里同样落到默认 exploreList（无附加参数）
      d = await apiPost("/api/theater/exploreList", { page: page, limit: 24 });
    }
    return listFrom(d.data);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg }];
  }
}

function pickKeyword(params) {
  if (params == null) return "";
  if (typeof params === "string" || typeof params === "number") return String(params).trim();
  var keys = ["keyword", "q", "query", "wd", "key", "text", "search"];
  for (var i = 0; i < keys.length; i++) {
    if (params[keys[i]]) return String(params[keys[i]]).trim();
  }
  return "";
}

async function search(params) {
  params = params || {};
  var kw = pickKeyword(params);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!kw) return [];
  try {
    var d = await apiPost("/api/search/result", { keyword: kw, page: page, tab: "video" });
    return listFrom(d.data);
  } catch (e) {
    return [];
  }
}

/* ---------------- 详情 / 剧集 ---------------- */
function parseRef(link) {
  var v = String(link || "");
  var m = v.match(/^yeguo:\/\/(detail|episode)\/(\d+)(?:\/(\d+))?(?:\/(\d+))?/);
  if (m) {
    if (m[1] === "episode") return { kind: "episode", vid: m[2], eid: m[3] || "", n: m[4] || "" };
    return { kind: "drama", id: m[2] };
  }
  var bare = v.replace(/^yeguo:/, "").split("||")[0].split(":")[0];
  if (/^\d+$/.test(bare)) return { kind: "drama", id: bare };
  return { kind: "", id: "" };
}

// 详情接口取剧集（与蜘蛛 detail 的过滤/去重/排序口径一致）
async function fetchDetailInfo(id) {
  var d = await apiPost("/api/playlet/detail", {
    video_id: Number(id), id: Number(id), episode_id: "0", related_limit: "0"
  });
  var info = unwrap(d);
  if (info.video_id == null && info.data) info = info.data;
  return info;
}

function episodeItemsOf(info, vid) {
  var eps = Array.isArray(info.episodes) ? info.episodes : [];
  var seen = {};
  var items = [];
  for (var i = 0; i < eps.length; i++) {
    var ep = eps[i];
    if (!ep) continue;
    var eid = t(ep.id || ep.episode_id || "");
    var n = Number(ep.sort || ep.episode || 0) || 0;
    if (!eid || !/^\d+$/.test(eid) || n < 1 || seen[eid]) continue;
    seen[eid] = 1;
    var name = t(ep.title || "第" + n + "集");
    if (ep.access && ep.access.can_play === false) name += "（付费）";
    items.push({ n: n, eid: eid, name: name, link: episodeLink(vid, eid, n) });
  }
  items.sort(function (a, b) { return a.n - b.n; });
  return items;
}

async function loadDetail(link) {
  var raw = String(link || "");
  var ref = parseRef(link);
  if (ref.kind !== "drama" || !ref.id) {
    return { id: raw, type: "url", title: "参数错误", link: raw };
  }
  try {
    var info = await fetchDetailInfo(ref.id);
    var title = t(info.title || ref.id);
    var cover = proxiedCover(t(info.cover || info.cover_img || ""));
    var items = episodeItemsOf(info, ref.id);
    var episodes = items.map(function (e) { return { name: e.name, link: e.link }; });
    var desc = t(info.description || info.intro || "");
    if (items.length) desc = (desc ? desc + "\n" : "") + "全" + items.length + "集";
    return {
      id: raw,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      description: desc,
      episodes: episodes,
      link: raw
    };
  } catch (e) {
    return { id: raw, type: "url", title: "加载失败", description: String((e && e.message) || e), link: raw };
  }
}

/* ---------------- 播放 ---------------- */
function playHeaders() {
  return { "User-Agent": UA, "Referer": SITE + "/", "Origin": SITE };
}

// 与蜘蛛 play 等价：返回 video_url（优先）或 video_url_h265，无则空串
async function playEpisode(vid, eid) {
  var v = Number(vid) || vid;
  var e = Number(eid) || eid;
  var d = await apiPost("/api/playlet/play", {
    video_id: v, playlet_id: v, episode_id: e
  });
  var info = unwrap(d);
  if (info.video_url == null && info.data) info = info.data;
  return t(info.video_url || info.video_url_h265 || "");
}

async function loadResource(params) {
  params = params || {};
  var raw = String(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = String(params.item.link || params.item.id || "");
  var ref = parseRef(raw);
  try {
    if (ref.kind === "episode") {
      var one = await playEpisode(ref.vid, ref.eid);
      if (!one) return [];
      return [{ name: ref.n ? "第" + ref.n + "集" : "播放", url: one, playerType: "app", customHeaders: playHeaders() }];
    }
    if (ref.kind !== "drama" || !ref.id) return [];
    var info = await fetchDetailInfo(ref.id);
    var items = episodeItemsOf(info, ref.id);
    var out = [];
    var misses = 0;
    for (var i = 0; i < items.length; i++) {
      var url = "";
      try { url = await playEpisode(ref.id, items[i].eid); } catch (e) { url = ""; }
      if (!url) {
        misses++;
        if (misses >= 3) break;
        continue;
      }
      misses = 0;
      out.push({ name: items[i].name, description: t(info.title || ""), url: url, playerType: "app", customHeaders: playHeaders() });
    }
    return out;
  } catch (e) {
    return [];
  }
}
