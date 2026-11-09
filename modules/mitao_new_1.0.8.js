// 蜜桃视频 for REX (mitao_rex v1.0.6, clean-room 重写)
// 站点: honeypeach.cc。后端 API 需要先握手: 设备号请求 /api/handshake,
// 若服务端下发挑战 (need_chal), 要先解一道 FNV-1a 工作量证明 (PoW),
// 换回 sid / skey 后, 每个业务请求再用 HMAC-SHA256 对规范串签名。
// 视频分类的数据实际来自 missav, 播放走已部署的 Worker 代理, 只取 720p
// (1080p 多为 AV1 编码, iOS 播不了)。其余分类走站内 /api/play。

WidgetMetadata = {
  id: "mitao_rex",
  title: "蜜桃视频",
  description: "蜜桃视频: 视频/短剧/动漫/国产/黑料, 握手签名接口, 播放只用 720p",
  author: "lai",
  version: "1.0.8",
  requiredVersion: "0.0.1",
  site: "https://honeypeach.cc",
  detailCacheDuration: 180,
  modules: [
    { id: "video_new", title: "最近更新", functionName: "loadVideoNew", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "video_release", title: "新作上市", functionName: "loadVideoRelease", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "video_chinese", title: "中文字幕", functionName: "loadVideoChinese", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "video_madou", title: "麻豆传媒", functionName: "loadVideoMadou", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "video_uncensored", title: "无码流出", functionName: "loadVideoUncensored", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "video_hot", title: "热门视频", functionName: "loadVideoHot", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "video_fc2", title: "FC2", functionName: "loadVideoFc2", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "video_heyzo", title: "HEYZO", functionName: "loadVideoHeyzo", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "video_tokyohot", title: "东京热", functionName: "loadVideoTokyohot", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "video_1pondo", title: "一本道", functionName: "loadVideo1pondo", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "video_caribbean", title: "加勒比", functionName: "loadVideoCaribbean", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "video_todayhot", title: "今日热门", functionName: "loadVideoTodayhot", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "video_weeklyhot", title: "本周热门", functionName: "loadVideoWeeklyhot", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    {
      id: "duanju", title: "蜜桃短剧", functionName: "loadDuanju", cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "cat", title: "板块", type: "enumeration", value: "tuijian|huangguo|0",
          enumOptions: [
            { title: "推荐", value: "tuijian|huangguo|0" },
            { title: "精选", value: "all|huangguo|0" },
            { title: "赤果短剧", value: "chiguo|huangguo|0" },
            { title: "魔改短剧", value: "mod|huangguo|0" },
            { title: "黄豆原创", value: "yuandou|huangguo|0" },
            { title: "真人短剧", value: "zhenren|huangguo|0" },
            { title: "动漫", value: "erciyuan|huangguo|0" },
            { title: "影院", value: "aiman|huangguo|0" },
            { title: "AI成人短剧", value: "duanju|huangguo|0" },
            { title: "AI成人漫剧", value: "manju|huangguo|0" },
            { title: "AI换脸", value: "huanlian|huangguo|0" },
            { title: "AI魔改", value: "mogai|huangguo|0" },
            { title: "排行榜", value: "rank|huangguo|0" },
            { title: "怦然心动", value: "pengran|huangguo|0" }
          ]
        }
      ]
    },
    {
      id: "duanju_chiguo", title: "赤果短剧", functionName: "loadDuanjuChiguo", cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "cat", title: "板块", type: "enumeration", value: "chiguo|huangguo|0",
          enumOptions: [
            { title: "赤果短剧", value: "chiguo|huangguo|0" },
            { title: "推荐", value: "tuijian|huangguo|0" },
            { title: "精选", value: "all|huangguo|0" },
            { title: "排行榜", value: "rank|huangguo|0" }
          ]
        }
      ]
    },
    {
      id: "duanju_zhenren", title: "真人短剧", functionName: "loadDuanjuZhenren", cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "cat", title: "板块", type: "enumeration", value: "zhenren|huangguo|0",
          enumOptions: [
            { title: "真人短剧", value: "zhenren|huangguo|0" },
            { title: "推荐", value: "tuijian|huangguo|0" },
            { title: "精选", value: "all|huangguo|0" },
            { title: "排行榜", value: "rank|huangguo|0" }
          ]
        }
      ]
    },
    {
      id: "duanju_ai", title: "AI成人短剧", functionName: "loadDuanjuAi", cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "cat", title: "板块", type: "enumeration", value: "duanju|huangguo|0",
          enumOptions: [
            { title: "AI成人短剧", value: "duanju|huangguo|0" },
            { title: "AI成人漫剧", value: "manju|huangguo|0" },
            { title: "AI换脸", value: "huanlian|huangguo|0" },
            { title: "AI魔改", value: "mogai|huangguo|0" },
            { title: "推荐", value: "tuijian|huangguo|0" }
          ]
        }
      ]
    },
    { id: "duanju_rank", title: "短剧排行", functionName: "loadDuanjuRank", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    {
      id: "caibian", title: "擦边短剧", functionName: "loadCaibian", cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "cat", title: "排序", type: "enumeration", value: "0|huangdou|0",
          enumOptions: [
            { title: "最新", value: "0|huangdou|0" },
            { title: "推荐", value: "1|huangdou|0" },
            { title: "全部", value: "2|huangdou|0" }
          ]
        }
      ]
    },
    {
      id: "shortv", title: "蜜桃动漫", functionName: "loadShortv", cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "cat", title: "源频道", type: "enumeration", value: "all|dongman|0",
          enumOptions: [
            { title: "全部", value: "all|dongman|0" },
            { title: "Hanime", value: "Hanime|dongman|0" },
            { title: "NaughtyMachinima", value: "NaughtyMachinima|dongman|0" },
            { title: "HS日本4K动漫", value: "HS日本4K动漫|dongman|0" }
          ]
        }
      ]
    },
    {
      id: "heiliao", title: "黑料吃瓜", functionName: "loadHeiliao", cacheDuration: 600,
      params: [
        { name: "page", title: "页码", type: "page" },
        {
          name: "cat", title: "频道", type: "enumeration", value: "0|huangdou|0",
          enumOptions: [
            { title: "最新", value: "0|huangdou|0" },
            { title: "推荐", value: "1|huangdou|0" }
          ]
        }
      ]
    },
    { id: "guochan", title: "国产精品", functionName: "loadGuochan", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "loadResource", title: "播放资源", description: "播放时实时解析播放地址", functionName: "loadResource", type: "stream", cacheDuration: 0, params: [] }
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

var BASE = "https://honeypeach.cc";
var UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
var MISSAV_WORKER = "https://missav-emby.li768435813.workers.dev";
// 2026-11-10：握手代理 Worker（只转发 /api/handshake，两步握手走同一固定出口，
// 避免挑战绑定 IP 时因出口轮换被拒）。用户需部署 mitao-handshake Worker 后生效；
// 未部署时自动回落直连（行为与原来一致）。
var HS_WORKER = "https://mitao-handshake.li768435813.workers.dev";
var SEARCH_KEYS = ["video", "duanju", "shortv", "guochan", "caibian"];

/* ---------- 小工具 ---------- */
function str(v) { return v == null ? "" : String(v); }

function randomText(n) {
  var pool = "abcdefghijklmnopqrstuvwxyz0123456789";
  var out = "";
  for (var i = 0; i < n; i++) out += pool.charAt(Math.floor(Math.random() * pool.length));
  return out;
}

function makeDeviceId() { return randomText(12) + Date.now().toString(16); }

/* ---------- SHA-256 (按 FIPS 180-4 标准实现) ---------- */
var SHA256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function utf8Bytes(text) {
  var bytes = [];
  var s = String(text);
  for (var i = 0; i < s.length; i++) {
    var cp = s.codePointAt(i);
    if (cp > 0xffff) i++;
    if (cp < 0x80) {
      bytes.push(cp);
    } else if (cp < 0x800) {
      bytes.push(0xc0 | (cp >> 6), 0x80 | (cp & 0x3f));
    } else if (cp < 0x10000) {
      bytes.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
    } else {
      bytes.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
    }
  }
  return bytes;
}

function bytesToHex(bytes) {
  var hex = "";
  for (var i = 0; i < bytes.length; i++) {
    var h = (bytes[i] & 0xff).toString(16);
    hex += h.length === 1 ? "0" + h : h;
  }
  return hex;
}

function hexToBytes(hex) {
  var bytes = [];
  var s = String(hex || "");
  for (var i = 0; i + 1 < s.length; i += 2) bytes.push(parseInt(s.substr(i, 2), 16));
  return bytes;
}

function sha256Bytes(input) {
  function rr(x, n) { return (x >>> n) | (x << (32 - n)); }
  var state = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  var data = input.slice();
  var bitLength = data.length * 8;
  data.push(0x80);
  while (data.length % 64 !== 56) data.push(0);
  for (var i = 7; i >= 0; i--) data.push(Math.floor(bitLength / Math.pow(2, i * 8)) % 256);

  var w = new Array(64);
  for (var block = 0; block < data.length; block += 64) {
    var t;
    for (t = 0; t < 16; t++) {
      var o = block + t * 4;
      w[t] = ((data[o] << 24) | (data[o + 1] << 16) | (data[o + 2] << 8) | data[o + 3]) >>> 0;
    }
    for (t = 16; t < 64; t++) {
      var x = w[t - 15], y = w[t - 2];
      var s0 = rr(x, 7) ^ rr(x, 18) ^ (x >>> 3);
      var s1 = rr(y, 17) ^ rr(y, 19) ^ (y >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
    }
    var a = state[0], b = state[1], c = state[2], d = state[3];
    var e = state[4], f = state[5], g = state[6], h = state[7];
    for (t = 0; t < 64; t++) {
      var bigS1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
      var ch = (e & f) ^ (~e & g);
      var sum1 = (h + bigS1 + ch + SHA256_K[t] + w[t]) >>> 0;
      var bigS0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
      var maj = (a & b) ^ (a & c) ^ (b & c);
      var sum2 = (bigS0 + maj) >>> 0;
      h = g; g = f; f = e;
      e = (d + sum1) >>> 0;
      d = c; c = b; b = a;
      a = (sum1 + sum2) >>> 0;
    }
    state = [
      (state[0] + a) >>> 0, (state[1] + b) >>> 0, (state[2] + c) >>> 0, (state[3] + d) >>> 0,
      (state[4] + e) >>> 0, (state[5] + f) >>> 0, (state[6] + g) >>> 0, (state[7] + h) >>> 0
    ];
  }
  var digest = [];
  for (var j = 0; j < 8; j++) {
    digest.push((state[j] >>> 24) & 0xff, (state[j] >>> 16) & 0xff, (state[j] >>> 8) & 0xff, state[j] & 0xff);
  }
  return digest;
}

function sha256Hex(text) { return bytesToHex(sha256Bytes(utf8Bytes(text))); }

/* HMAC-SHA256 (RFC 2104), 密钥以 hex 字符串形式给出 */
function hmacSha256Hex(keyHex, text) {
  var key = hexToBytes(keyHex);
  if (key.length > 64) key = sha256Bytes(key);
  while (key.length < 64) key.push(0);
  var innerPad = [], outerPad = [];
  for (var i = 0; i < 64; i++) {
    innerPad.push(key[i] ^ 0x36);
    outerPad.push(key[i] ^ 0x5c);
  }
  var innerHash = sha256Bytes(innerPad.concat(utf8Bytes(text)));
  return bytesToHex(sha256Bytes(outerPad.concat(innerHash)));
}

/* ---------- PoW: FNV-1a 32 位迭代 ---------- */
function fnv1a(text) {
  var hash = 0x811c9dc5;
  var s = String(text);
  for (var i = 0; i < s.length; i++) {
    hash ^= s.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function hex8(n) {
  var h = (n >>> 0).toString(16);
  while (h.length < 8) h = "0" + h;
  return h.slice(-8);
}

function powDigest(challenge, nonceText) {
  var cur = fnv1a(challenge + ":" + nonceText);
  for (var round = 0; round < 4; round++) cur = fnv1a(hex8(cur) + challenge);
  return hex8(cur);
}

function solvePow(challenge, bits) {
  var prefix = "";
  for (var i = 0; i < (bits >> 2); i++) prefix += "0";
  for (var n = 0; n < 20000000; n++) {
    var nonceText = n.toString(16);
    if (powDigest(challenge, nonceText).indexOf(prefix) === 0) return challenge + "." + nonceText;
  }
  return "";
}

/* ---------- HTTP 与会话 ---------- */
function responseBody(res) {
  var body = res ? (res.data != null ? res.data : res) : null;
  if (typeof body === "string") {
    try { return JSON.parse(body); } catch (e) { return {}; }
  }
  return body || {};
}

async function httpGetJson(url, headers) {
  var res = await Widget.http.get(url, { headers: headers });
  return { status: res && res.status != null ? res.status : 200, body: responseBody(res) };
}

var session = { dev: "", sid: "", skey: "", exp: 0 };

function resetSession(newDevice) {
  if (newDevice) session.dev = makeDeviceId();
  session.sid = "";
  session.skey = "";
  session.exp = 0;
}

async function handshakeOnce() {
  if (!session.dev) session.dev = makeDeviceId();
  var url = BASE + "/api/handshake?dev=" + encodeURIComponent(session.dev);
  var headers = { "User-Agent": UA, Accept: "application/json" };
  var first = await hsGet(url, headers);
  var data = first.body;
  if (data && data.need_chal) {
    var token = solvePow(str(data.need_chal), parseInt(data.bits || "16", 10) || 16);
    if (!token) return false;
    var second = await hsGet(url + "&c=" + encodeURIComponent(token), headers);
    data = second.body;
  }
  if (data && data.sid && data.skey) {
    session.sid = str(data.sid);
    session.skey = str(data.skey);
    session.exp = parseInt(data.exp || "0", 10) || 0;
    return true;
  }
  return false;
}

// 握手请求先走代理 Worker（固定出口），Worker 未部署/失败时回落直连
async function hsGet(url, headers) {
  if (HS_WORKER) {
    try {
      var w = await httpGetJson(HS_WORKER + "/?u=" + encodeURIComponent(url), headers);
      if (w && w.body && (w.body.need_chal || w.body.sid)) return w;
    } catch (e) {}
  }
  return httpGetJson(url, headers);
}

async function ensureSession() {
  var nowSec = Math.floor(Date.now() / 1000);
  if (session.sid && session.skey && nowSec < session.exp - 60) return;
  // 2026-11-10：之前换设备号重试 3 次，每次都要烧 2 次 HTTP + 1 次同步 PoW 穷举，
  // 单次列表调用可耗 10-30 秒才抛错；改为只试 1 次，失败即报，避免空烧
  if (await handshakeOnce()) return;
  throw new Error("蜜桃握手失败");
}

function looksRateLimited(status, body) {
  if (status === 429 || (body && body.code === 429)) return true;
  var msg = str(body && (body.err || body.msg)).toLowerCase();
  if (!msg) return false;
  var marks = ["rl_sid", "rl_dev", "rl_ip", "rate", "limit", "toomany", "busy"];
  for (var i = 0; i < marks.length; i++) if (msg.indexOf(marks[i]) !== -1) return true;
  return false;
}

async function signedGet(path, query) {
  await ensureSession();
  async function attempt() {
    var ts = str(Math.floor(Date.now() / 1000));
    var nonce = randomText(8) + Date.now().toString(16);
    var canonical = ["GET", path, query, sha256Hex(""), ts, nonce, session.sid].join("\n");
    var signature = hmacSha256Hex(session.skey, canonical);
    var url = BASE + path + (query ? "?" + query : "");
    var headers = {
      "User-Agent": UA,
      Accept: "application/json",
      "X-Hp-Sid": session.sid,
      "X-Hp-Ts": ts,
      "X-Hp-Nonce": nonce,
      "X-Hp-Sign": signature,
      Referer: BASE + "/"
    };
    // 2026-11-10：签名请求也走 Worker（与握手同一出口）。只代理握手不够：
    // 握手走 Worker 拿到 sid/skey 后，签名请求若直连（VPN 出口）会被站方拒收，
    // 导致分类加载不出任何内容。Worker 须更新为全接口代理版（见 mitao-handshake-worker.js），
    // 未部署新版/失败时回落直连。
    if (HS_WORKER) {
      try {
        var w = await httpGetJson(HS_WORKER + "/?u=" + encodeURIComponent(url), headers);
        if (w && w.body && typeof w.body === "object") {
          var wtext = JSON.stringify(w.body);
          if (wtext.length > 20 && wtext.indexOf("developers.cloudflare.com") < 0) return w;
        }
      } catch (e) {}
    }
    var result = await httpGetJson(url, headers);
    return result;
  }
  var r = await attempt();
  if (r.status === 401 || (r.body && r.body.code === 401)) {
    resetSession(false);
    await ensureSession();
    r = await attempt();
  }
  if (looksRateLimited(r.status, r.body)) {
    resetSession(true);
    await ensureSession();
    r = await attempt();
  }
  return r.body;
}

/* ---------- 链接编码: mt: + JSON, 详情原样回显保证 id 不漂移 ---------- */
function encodeLink(obj) { return "mt:" + encodeURIComponent(JSON.stringify(obj)); }

function decodeLink(link) {
  if (link && typeof link === "object") link = link.link || link.id || "";
  var text = str(link);
  if (text.indexOf("mt:") === 0) {
    try {
      var obj = JSON.parse(decodeURIComponent(text.slice(3)));
      if (obj && typeof obj === "object") return obj;
    } catch (e) { /* 落到兜底 */ }
  }
  return { k: "", i: text, s: "", u: "", e: "", t: "" };
}

function rawLinkOf(link) {
  if (link && typeof link === "object") return str(link.link || link.id || "");
  return str(link);
}

/* ---------- 列表 ---------- */
function coverOf(item) {
  var u = str(item && (item.cover_n || item.cover || ""));
  if (!u) return "";
  var abs = u;
  if (u.indexOf("://") === -1) abs = u.charAt(0) === "/" ? BASE + u : BASE + "/" + u;
  // 2026-11-10：封面直连 honeypeach.cc 在用户手机上加载不出（照猫源修法），
  // 封面走 mitao-handshake Worker 代取（Worker 须为全接口代理版，允许 /cover/*）。
  if (HS_WORKER) return HS_WORKER + "/?u=" + encodeURIComponent(abs);
  return abs;
}

function toCard(item, key, src, sub) {
  if (!item || item.id == null) return null;
  var title = str(item.title || item.id);
  var link = encodeLink({ k: key, i: str(item.id), s: str(item.src || src || ""), u: str(sub || ""), e: "", t: title });
  var cover = coverOf(item);
  return {
    id: link,
    type: "url",
    title: title,
    name: title,
    description: str(item.remark || item.desc || ""),
    mediaType: "movie",
    link: link,
    coverUrl: cover,
    posterPath: cover,
    backdropPath: cover
  };
}

function splitCat(raw) {
  var parts = str(raw).split("|");
  return { cat: parts[0] || "", src: parts[1] || "", sub: parts[2] || "" };
}

async function fetchModule(key, catTriple, page) {
  var c = splitCat(catTriple);
  var query = "key=" + encodeURIComponent(key) +
    "&cat=" + encodeURIComponent(c.cat) +
    "&page=" + (parseInt(page, 10) || 1);
  if (c.src) query += "&src=" + encodeURIComponent(c.src);
  if (c.sub) query += "&sub=" + encodeURIComponent(c.sub);
  var data = await signedGet("/api/module", query);
  var rows = (data && data.list) || [];
  var out = [];
  for (var i = 0; i < rows.length; i++) {
    var card = toCard(rows[i], key, c.src, c.sub);
    if (card) out.push(card);
  }
  return out;
}

function videoLoader(catSlug) {
  return async function (params) {
    params = params || {};
    return fetchModule("video", catSlug + "|missav|", params.page);
  };
}

var loadVideoNew = videoLoader("new");
var loadVideoRelease = videoLoader("release");
var loadVideoChinese = videoLoader("chinese-subtitle");
var loadVideoMadou = videoLoader("madou");
var loadVideoUncensored = videoLoader("uncensored-leak");
var loadVideoHot = videoLoader("monthly-hot");
var loadVideoFc2 = videoLoader("fc2");
var loadVideoHeyzo = videoLoader("heyzo");
var loadVideoTokyohot = videoLoader("tokyohot");
var loadVideo1pondo = videoLoader("1pondo");
var loadVideoCaribbean = videoLoader("caribbeancom");
var loadVideoTodayhot = videoLoader("today-hot");
var loadVideoWeeklyhot = videoLoader("weekly-hot");

async function loadDuanju(params) {
  params = params || {};
  return fetchModule("duanju", params.cat || "tuijian|huangguo|0", params.page);
}
async function loadDuanjuChiguo(params) {
  params = params || {};
  return fetchModule("duanju", params.cat || "chiguo|huangguo|0", params.page);
}
async function loadDuanjuZhenren(params) {
  params = params || {};
  return fetchModule("duanju", params.cat || "zhenren|huangguo|0", params.page);
}
async function loadDuanjuAi(params) {
  params = params || {};
  return fetchModule("duanju", params.cat || "duanju|huangguo|0", params.page);
}
async function loadDuanjuRank(params) {
  params = params || {};
  return fetchModule("duanju", "rank|huangguo|0", params.page);
}
async function loadCaibian(params) {
  params = params || {};
  return fetchModule("caibian", params.cat || "0|huangdou|0", params.page);
}
async function loadShortv(params) {
  params = params || {};
  return fetchModule("shortv", params.cat || "all|dongman|0", params.page);
}
async function loadHeiliao(params) {
  params = params || {};
  return fetchModule("heiliao", params.cat || "0|huangdou|0", params.page);
}
async function loadGuochan(params) {
  params = params || {};
  return fetchModule("guochan", "||", params.page);
}

/* ---------- 搜索: 逐个可搜分类调 /api/search 后合并去重 ---------- */
async function search(params) {
  params = params || {};
  var keyword = str(params.keyword || params.wd || params.q).trim();
  if (!keyword) return [];
  var page = parseInt(params.page, 10) || 1;
  var merged = [];
  var seen = {};
  for (var i = 0; i < SEARCH_KEYS.length; i++) {
    var key = SEARCH_KEYS[i];
    try {
      var data = await signedGet("/api/search",
        "key=" + encodeURIComponent(key) + "&kw=" + encodeURIComponent(keyword) + "&page=" + page);
      var rows = (data && data.list) || [];
      for (var j = 0; j < rows.length; j++) {
        var card = toCard(rows[j], key, "", "");
        if (card && !seen[card.id]) {
          seen[card.id] = true;
          merged.push(card);
        }
      }
    } catch (e) { /* 单个分类失败不影响其余结果 */ }
  }
  return merged;
}

/* ---------- 详情 ---------- */
async function loadDetail(link) {
  var raw = rawLinkOf(link);
  var info = decodeLink(link);
  if (!info.k || !info.i) throw new Error("缺少 id");
  var queryParts = [];
  if (info.s) queryParts.push("src=" + encodeURIComponent(info.s));
  if (info.u) queryParts.push("sub=" + encodeURIComponent(info.u));
  var data = await signedGet(
    "/api/detail/" + encodeURIComponent(info.k) + "/" + encodeURIComponent(info.i),
    queryParts.join("&")
  );
  var detail = (data && data.detail) || {};
  // 2026-11-10：跟随站方“跨源同名择优”改派（dup.auto 时用 best_id/best_src，
  // 否则选集/播放按原源去取会集号错位或取不到地址；实测有 dup 的短剧走 best 源才能播）
  var effId = info.i;
  var effSrc = info.s;
  if (detail.dup && detail.dup.auto) {
    if (detail.dup.best_id) effId = str(detail.dup.best_id);
    if (detail.dup.best_src) effSrc = str(detail.dup.best_src);
  }
  var title = str(info.t) || str(detail.title) || info.i;
  var cover = coverOf(detail);
  var remarks = detail.ep_count ? "共" + detail.ep_count + "集" : str(detail.date || "");
  var desc = [remarks, str(detail.desc || "")].filter(Boolean).join("\n");

  var episodes = detail.episodes && detail.episodes.length ? detail.episodes : [{ ep: 1, name: "正片" }];
  var childItems = [];
  for (var i = 0; i < episodes.length; i++) {
    var epInfo = episodes[i] || {};
    var epNo = str(epInfo.ep != null ? epInfo.ep : i + 1);
    var epName;
    if (episodes.length === 1) {
      epName = title;
    } else {
      epName = str(epInfo.name || "").replace(/[$#]/g, " ");
      if (!epName || epName === "正片" || epName === "播放") epName = title + " 第" + epNo + "集";
      else if (epName.indexOf(title) !== 0) epName = title + " " + epName;
    }
    if (epInfo.lock) epName += "[预告10s]";
    var epLink = encodeLink({ k: info.k, i: effId, s: effSrc, u: info.u, e: epNo, t: title });
    childItems.push({
      id: epLink,
      title: epName,
      name: epName,
      mediaType: "movie",
      seasonNumber: 1,
      episodeNumber: parseInt(epNo, 10) || i + 1,
      link: epLink
    });
  }

  // id / link 原样回显列表传入的值, 避免播放前被判"所选资源已变化"
  var self = raw || encodeLink({ k: info.k, i: info.i, s: info.s, u: info.u, e: "", t: title });
  var result = {
    id: self,
    type: "url",
    title: title,
    name: title,
    description: desc,
    mediaType: "movie",
    link: self,
    coverUrl: cover,
    posterPath: cover,
    backdropPath: cover,
    playerType: "app"
  };
  if (childItems.length > 1) {
    result.episodeItems = childItems;
    result.childItems = childItems;
  }
  // 2026-11-10：单集视频也补 seasons（之前只有多集才设 episodeItems，单集
  // 无 seasons/episodeItems，App 可能不渲染集结构）
  result.seasons = [{ seasonNumber: 1, title: "正片", name: "正片", episodes: childItems.map(function (c) {
    return { title: c.title, name: c.name, episodeNumber: c.episodeNumber, link: c.link, id: c.id };
  }) }];
  if (childItems.length === 1) {
    result.episodeItems = childItems;
    result.childItems = childItems;
  }
  return result;
}

/* ---------- 播放 ---------- */
function extractFanhao(text) {
  var s = str(text);
  // FC2：FC2-PPV-1234567（7 位数字），旧正则会误切成 ppv-500565 导致播不了
  var fc = s.match(/fc2-ppv-(\d{6,7})/i);
  if (fc) return "fc2-ppv-" + fc[1];
  var m = s.match(/([a-zA-Z]{2,6})-?(\d{2,6})/);
  return m ? (m[1] + "-" + m[2]).toLowerCase() : "";
}

// missav 直连基地址：先试原始 id、再试提取码（照猫源 missavDirect720 修法）。
// 取 missav 详情页提 UUID 与 surrit CDN host，返回 https://<host>/<uuid>，
// 播放地址按猫源 MissAV 模式拼清晰度路径。失败返回 ""。
async function missavBase(rawVid, code) {
  var candidates = [];
  var v = str(rawVid).toLowerCase();
  if (v) candidates.push(v);
  var c = str(code).toLowerCase();
  if (c && c !== v) candidates.push(c);
  for (var i = 0; i < candidates.length; i++) {
    var slug = candidates[i];
    var pageUrl = "https://missav.fans/cn/" + encodeURIComponent(slug);
    var html = "";
    try {
      var res = await Widget.http.get(pageUrl, { headers: { "User-Agent": UA, Referer: "https://missav.fans/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" } });
      html = res && res.data != null ? String(res.data) : "";
    } catch (e) { continue; }
    if (!html) continue;
    var uuidM = html.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/);
    if (!uuidM) continue;
    var hostM = html.match(/https?:\/\/(surrit\.[^\/\\"' ]+)/);
    var host = hostM ? hostM[1].replace(/\\/g, "") : "surrit.mrstcdn.store";
    return "https://" + host + "/" + uuidM[0];
  }
  return "";
}

function absoluteUrl(u) {
  var v = str(u);
  if (!v) return "";
  if (v.indexOf("://") !== -1) return v;
  return v.charAt(0) === "/" ? BASE + v : BASE + "/" + v;
}

async function loadResource(params) {
  params = params || {};
  var raw = str(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = str(params.item.link || params.item.id || "");
  var info = decodeLink(raw);
  if (!info.k || !info.i) return [];
  var ep = info.e || "1";
  var headers = { "User-Agent": UA, Referer: BASE + "/" };

  // missav 来源: 照猫源修法走 missav 直连（不再走 missav-emby Worker 改写清单，
  // 改写版清单 4516 段/5 小时、不是从头播）。照猫源 MissAV 模式列清晰度线，
  // “自动”（主清单）默认首选——主清单只列真实存在的档位（FC2-PPV-5005758 实测
  // 只有 480p/360p、无 720p/1080p，720P 首选会播不了），播放器自适应选档；
  // 1080P/720P/480P/360P 供手动切换（1080p 部分片为 AV1，iOS 播不了时切回自动）。
  if (info.k === "video" || info.s === "missav") {
    var code = extractFanhao(info.i) || extractFanhao(info.t);
    if (!code) code = str(info.i).toLowerCase().replace(/[^a-z0-9-]/g, "");
    var base = "";
    try { base = await missavBase(info.i, code); } catch (e) {}
    if (base) {
      var mh = { "User-Agent": UA, Referer: "https://missav.fans/" };
      return [
        { name: "自动", description: "自适应", url: base + "/playlist.m3u8", playerType: "app", customHeaders: mh },
        { name: "1080P", description: "直连", url: base + "/1080p/video.m3u8", playerType: "app", customHeaders: mh },
        { name: "720P", description: "直连", url: base + "/720p/video.m3u8", playerType: "app", customHeaders: mh },
        { name: "480P", description: "直连", url: base + "/480p/video.m3u8", playerType: "app", customHeaders: mh },
        { name: "360P", description: "直连", url: base + "/360p/video.m3u8", playerType: "app", customHeaders: mh }
      ];
    }
    if (code) {
      return [{
        name: "720P",
        description: "missav 兜底",
        url: MISSAV_WORKER + "/missav?code=" + encodeURIComponent(code),
        playerType: "app"
      }];
    }
  }

  // 其余分类走站内播放接口
  var queryParts = [];
  if (info.s) queryParts.push("src=" + encodeURIComponent(info.s));
  if (info.u) queryParts.push("sub=" + encodeURIComponent(info.u));
  try {
    var data = await signedGet(
      "/api/play/" + encodeURIComponent(info.k) + "/" + encodeURIComponent(info.i) + "/" + encodeURIComponent(ep),
      queryParts.join("&")
    );
    var play = (data && data.play) || {};
    if (!play.locked) {
      var lines = [];
      if (play.src) lines.push({ name: "线路一", description: str(play.type || "直链"), url: absoluteUrl(play.src), playerType: "app", customHeaders: headers });
      if (play.src_proxy) lines.push({ name: "线路二", description: "站内中转", url: absoluteUrl(play.src_proxy), playerType: "app", customHeaders: headers });
      if (lines.length) return lines;
    }
  } catch (e) { /* 落到下面的兜底 */ }

  // 最终兜底: 能提番号就给 missav 页面, 保证有返回
  var fallbackCode = extractFanhao(info.i) || extractFanhao(info.t);
  if (fallbackCode) {
    return [{
      name: "missav 页面",
      description: "直接打开",
      url: "https://missav.fans/cn/" + encodeURIComponent(fallbackCode),
      playerType: "app",
      customHeaders: { "User-Agent": UA, Referer: "https://missav.fans/" }
    }];
  }
  return [];
}
