// Uu视频 for REX (lai_uu_video v1.0.0)
// 来源蜘蛛：mira-cat uu_video.js（py_uuvideo），后端 https://nfu.rftsln9.com（入口 utv2.cc）。
// 原理与蜘蛛一致：公开 JSON API（响应为 base64url + XOR 加密，key 随响应下发）取分类/列表/详情/搜索；
// 播放地址与封面签名需"指纹登录"（随机指纹，站方公开的游客登录方式，与蜘蛛相同，非伪造凭证）：
//   播放：GET /api/v2/home/user/video/play/url → masterUrl + 视频 CDN 列表拼接成完整 m3u8；
//   封面：thumb 是 .enc 加密图，POST /api/v2/home/user/cdn/sign 批量签名后才是可访问的真实图片地址。
// 蜘蛛里的 PoW vv_challenge cookie 流程在现行调用链中实际未被使用（公开 API 不带 cookie 也可调用），故未移植。
// 蜘蛛里的 uu-proxy Worker 仅用于旧版相对路径播放地址，现行主流程（数字 id → play/url API）不走它，故未使用。
// 与 lai_uu（UU直播破解，cmk.uuzbpj7.hair 的 HTML 站）是两个完全不同的站，勿混淆。

WidgetMetadata = {
  id: "lai_uu_video",
  title: "Uu视频",
  description: "Uu视频（nfu.rftsln9.com）：热门/国产/日本AV/无码/中字等 14 个分类，指纹登录取播放地址，封面走官方签名接口",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://nfu.rftsln9.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "分类",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "分类",
          type: "enumeration",
          value: "268",
          enumOptions: [
            { title: "热门", value: "268" },
            { title: "国产", value: "262" },
            { title: "日本AV", value: "263" },
            { title: "AV无码", value: "343" },
            { title: "AV中字", value: "344" },
            { title: "欧美", value: "264" },
            { title: "动漫", value: "267" },
            { title: "三级", value: "341" },
            { title: "AI换脸", value: "342" },
            { title: "麻豆", value: "358" },
            { title: "擦边短剧", value: "356" },
            { title: "黑料", value: "347" },
            { title: "传媒", value: "266" },
            { title: "女主播", value: "345" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
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

var BASE = "https://nfu.rftsln9.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

// API 服务器列表（与蜘蛛一致）
var API_HOSTS = [
  "https://aa3.aa36jn.com:52000",
  "https://zje.zje0cx.com:52000",
  "https://hlo.hlos8o.com:52000",
  "https://iv4.iv4muy.com:51999"
];

// 视频 CDN 降级列表（与蜘蛛一致，2026-10-19 配置实测；正常走 channel 接口动态获取）
var FALLBACK_CDNS = [
  "https://m338.xn--d9u11dw2l41at78afwi.xn--fiqs8s",
  "https://fqu.fquauf.com:51666",
  "https://vte.vteotx.com:51666",
  "https://i1t.i1tyqh.com:51666",
  "https://tmm.tmmr4x.com:51888"
];

// ---------- 纯 JS 工具（不依赖 Buffer / atob / TextDecoder） ----------
var B64TAB = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var B64REV = {};
for (var bi = 0; bi < B64TAB.length; bi++) B64REV[B64TAB.charAt(bi)] = bi;

function b64urlDecodeBytes(s) {
  var b64 = String(s || "").replace(/-/g, "+").replace(/_/g, "/");
  var out = [];
  var buf = 0, bits = 0;
  for (var i = 0; i < b64.length; i++) {
    var ch = b64.charAt(i);
    if (ch === "=") break;
    var v = B64REV[ch];
    if (v == null) continue;
    buf = (buf << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out.push((buf >> bits) & 0xff);
    }
  }
  return out;
}

function utf8Decode(bytes) {
  var out = "";
  var i = 0;
  while (i < bytes.length) {
    var b = bytes[i];
    if (b < 0x80) {
      out += String.fromCharCode(b);
      i += 1;
    } else if (b < 0xe0) {
      out += String.fromCharCode(((b & 0x1f) << 6) | (bytes[i + 1] & 0x3f));
      i += 2;
    } else if (b < 0xf0) {
      out += String.fromCharCode(((b & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f));
      i += 3;
    } else {
      var cp = ((b & 0x07) << 18) | ((bytes[i + 1] & 0x3f) << 12) | ((bytes[i + 2] & 0x3f) << 6) | (bytes[i + 3] & 0x3f);
      cp -= 0x10000;
      out += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff));
      i += 4;
    }
  }
  return out;
}

// XOR 解密 API 响应（与蜘蛛 xorDecrypt 一致，key 为 ASCII）
function xorDecrypt(dataB64, keyStr) {
  var dataBytes = b64urlDecodeBytes(dataB64);
  var key = String(keyStr || "");
  var out = new Array(dataBytes.length);
  for (var i = 0; i < dataBytes.length; i++) {
    out[i] = dataBytes[i] ^ (key.charCodeAt(i % key.length) & 0xff);
  }
  var text = utf8Decode(out);
  try { return JSON.parse(text); } catch (e) { return text; }
}

function t(v) {
  return String(v == null ? "" : v).trim();
}

function qs(params) {
  var parts = [];
  for (var k in params) {
    if (params[k] == null) continue;
    parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(String(params[k])));
  }
  return parts.join("&");
}

// ---------- HTTP ----------
async function httpGetText(url, headers) {
  var res = await Widget.http.get(url, { headers: headers || {} });
  if (!res) return "";
  if (res.data == null) return "";
  return typeof res.data === "string" ? res.data : JSON.stringify(res.data);
}

async function httpPostJson(url, obj, headers) {
  if (!Widget.http || typeof Widget.http.post !== "function") return "";
  var res = await Widget.http.post(url, JSON.stringify(obj), { headers: headers || {}, timeout: 25000 });
  if (!res || res.data == null) return "";
  return typeof res.data === "string" ? res.data : JSON.stringify(res.data);
}

function apiHeaders(extra) {
  var h = {
    "User-Agent": UA,
    "Referer": BASE + "/",
    "Accept": "application/json"
  };
  if (extra) for (var k in extra) h[k] = extra[k];
  return h;
}

// 调用公开 API（自动 XOR 解密），与蜘蛛 apiCall 一致
async function apiCall(apiPath, params) {
  var query = qs(params || {});
  for (var i = 0; i < API_HOSTS.length; i++) {
    var url = API_HOSTS[i] + apiPath + (query ? "?" + query : "");
    try {
      var text = await httpGetText(url, apiHeaders());
      if (!text) continue;
      var resp = JSON.parse(text);
      if (resp.code !== 200) continue;
      if (!resp.data) return null;
      return xorDecrypt(resp.data, resp.key || "");
    } catch (e) { continue; }
  }
  return null;
}

// ---------- 指纹登录（与蜘蛛 ensureAccessToken 一致） ----------
var _accessToken = "";
var _tokenTime = 0;
var TOKEN_TTL = 30 * 60 * 1000;

function genFingerprint() {
  var hex = "0123456789abcdef";
  var s = "";
  for (var i = 0; i < 32; i++) s += hex.charAt(Math.floor(Math.random() * 16));
  return s;
}

async function ensureAccessToken() {
  if (_accessToken && Date.now() - _tokenTime < TOKEN_TTL) return _accessToken;
  var body = { channel: "tz", fingerPrint: genFingerprint() };
  for (var i = 0; i < API_HOSTS.length; i++) {
    try {
      var text = await httpPostJson(API_HOSTS[i] + "/api-user/v2/login/fingerprint", body,
        apiHeaders({ "Content-Type": "application/json" }));
      if (!text) continue;
      var resp = JSON.parse(text);
      if (resp.code !== 200) continue;
      var data = resp.data;
      if (typeof data === "string" && data) {
        try { data = xorDecrypt(data, resp.key || ""); } catch (e) { continue; }
      }
      var tk = data && (data.accessToken || data.token);
      if (tk) {
        _accessToken = tk;
        _tokenTime = Date.now();
        return _accessToken;
      }
    } catch (e) { continue; }
  }
  throw new Error("指纹登录失败");
}

// 调用需要鉴权的 API（与蜘蛛 apiCallAuth 一致）
async function apiCallAuth(apiPath, params) {
  var token = await ensureAccessToken();
  var query = qs(params || {});
  for (var i = 0; i < API_HOSTS.length; i++) {
    var url = API_HOSTS[i] + apiPath + (query ? "?" + query : "");
    try {
      var text = await httpGetText(url, apiHeaders({ "Authorization": "Bearer " + token }));
      if (!text) continue;
      var resp = JSON.parse(text);
      if (resp.code !== 200) {
        if (resp.code === 401) _accessToken = "";
        continue;
      }
      if (resp.data == null) return null;
      if (typeof resp.data === "string" && resp.data) {
        return xorDecrypt(resp.data, resp.key || "");
      }
      return resp.data;
    } catch (e) { continue; }
  }
  return null;
}

// ---------- 封面签名（与蜘蛛 getImgCdn / signImages 一致） ----------
var _imgCdn = null;
async function getImgCdn() {
  if (_imgCdn) return _imgCdn;
  try {
    var data = await apiCall("/api/v2/home/public/cdn/image/index", { channel: "tz" });
    if (data && data.list && data.list.length > 0) {
      var line = null;
      for (var i = 0; i < data.list.length; i++) {
        if (data.list[i].picVideoUrl || data.list[i].picUrl) { line = data.list[i]; break; }
      }
      if (!line) line = data.list[0];
      var pic = String(line.picVideoUrl || line.picUrl || "").replace(/\/+$/, "");
      var bucket = String(line.bucket || "").replace(/^\/+|\/+$/g, "");
      if (pic && bucket) {
        var origin = pic;
        var om = pic.match(/^https?:\/\/[^/]+/);
        if (om) origin = om[0];
        _imgCdn = { origin: origin, bucket: bucket };
        return _imgCdn;
      }
    }
  } catch (e) { /* 降级 */ }
  _imgCdn = { origin: "https://pps.aiide.online", bucket: "encryption-ts" };
  return _imgCdn;
}

async function signImages(thumbs) {
  var result = {};
  var uniq = [];
  var seen = {};
  (thumbs || []).forEach(function (x) {
    var v = t(x);
    if (v && !seen[v]) { seen[v] = true; uniq.push(v); }
  });
  if (!uniq.length) return result;
  var cdn = await getImgCdn();
  var pathMap = {}; // signPath -> thumb
  var signPaths = [];
  uniq.forEach(function (th) {
    var clean = th;
    if (/^https?:\/\//i.test(clean)) {
      var pm = clean.match(/^https?:\/\/[^/]+(\/.*)$/);
      if (pm) clean = pm[1];
    }
    clean = clean.replace(/^\/+/, "");
    if (clean.indexOf(cdn.bucket + "/") === 0) clean = clean.slice(cdn.bucket.length + 1);
    var sp = /\.js$/.test(clean) ? cdn.bucket + "/" + clean : cdn.bucket + "/" + clean + ".js";
    pathMap[sp] = th;
    signPaths.push(sp);
  });
  var token = "";
  try { token = await ensureAccessToken(); } catch (e) { return result; }
  for (var i = 0; i < API_HOSTS.length; i++) {
    try {
      var text = await httpPostJson(API_HOSTS[i] + "/api/v2/home/user/cdn/sign",
        { paths: signPaths },
        apiHeaders({ "Content-Type": "application/json", "Authorization": "Bearer " + token }));
      if (!text) continue;
      var resp = JSON.parse(text);
      if (resp.code !== 200) {
        if (resp.code === 401) { _accessToken = ""; token = await ensureAccessToken().catch(function () { return ""; }); }
        continue;
      }
      if (resp.data == null) continue;
      var data = resp.data;
      if (typeof data === "string" && data) {
        try { data = xorDecrypt(data, resp.key || ""); } catch (e) { continue; }
      }
      if (data && data.list && data.list.length) {
        data.list.forEach(function (item) {
          var th = pathMap[item.path];
          if (th && item.url) {
            result[th] = cdn.origin + "/" + String(item.url).replace(/^\/+/, "");
          }
        });
        return result;
      }
    } catch (e) { continue; }
  }
  return result;
}

// ---------- 列表 / 搜索 / 详情 ----------
function linkOf(id) {
  return BASE + "/video/" + id;
}

function toCards(list, signed) {
  var out = [];
  (list || []).forEach(function (v) {
    var id = String(v.id);
    var thumb = t(v.thumb);
    var pic = thumb ? (signed[thumb] || "") : "";
    out.push({
      id: linkOf(id),
      type: "url",
      title: v.title || "",
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: linkOf(id),
      description: v.classifyTitles || v.labelTitles || "",
      mediaType: "movie"
    });
  });
  return out;
}

async function cardsFromApi(data) {
  var raw = data && data.list ? data.list : [];
  if (!raw.length) return [];
  var thumbs = raw.map(function (v) { return v.thumb; });
  var signed = await signImages(thumbs);
  return toCards(raw, signed);
}

async function loadList(params) {
  params = params || {};
  var tid = String(params.path || params.cat || "268");
  var page = parseInt(params.page, 10) || 1;
  // 热门(268) 用 type=hot 接口（与蜘蛛一致；cate+typeId=268 只能拿到 20 条）
  var apiParams;
  if (tid === "268") {
    apiParams = { page: String(page), limit: "20", type: "hot", videoType: "long" };
  } else {
    apiParams = { page: String(page), limit: "20", type: "cate", typeId: tid, videoType: "long" };
  }
  try {
    var data = await apiCall("/api/v2/home/public/video/list", apiParams);
    if (!data) {
      return [{ id: "err", type: "url", title: "载入失败: API 无回应", description: "分类 " + tid }];
    }
    var total = data.total || 0;
    if (total > 0 && (page - 1) * 20 >= total) return [];
    var cards = await cardsFromApi(data);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
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
  var page = parseInt(params.page, 10) || 1;
  if (!wd) {
    return [{ id: "tip", type: "url", title: "输入关键词搜索" }];
  }
  try {
    var data = await apiCall("/api/v2/home/public/video/search", {
      page: String(page), limit: "20", keyword: wd, videoType: "long"
    });
    var raw = data && (data.list || data.data) ? (data.list || data.data) : [];
    if (!raw.length) {
      return [{ id: "empty", type: "url", title: "没有找到相关影片" }];
    }
    var thumbs = raw.map(function (v) { return v.thumb; });
    var signed = await signImages(thumbs);
    return toCards(raw, signed);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

var _cdnList = null;
async function getCdnList() {
  if (_cdnList) return _cdnList;
  try {
    var data = await apiCall("/api/v2/home/public/aed/site/channel", { channel: "tz" });
    if (data && data.videoUrlCdns && data.videoUrlCdns.length > 0) {
      _cdnList = data.videoUrlCdns;
      return _cdnList;
    }
  } catch (e) { /* 降级 */ }
  _cdnList = FALLBACK_CDNS.slice();
  return _cdnList;
}

async function loadDetail(link) {
  var s = String(link || "");
  try {
    var im = s.match(/\/video\/(\d+)/) || s.match(/^(\d+)$/);
    if (!im) {
      return { id: s || "err", type: "url", title: "解析失败", description: "链接里没有视频 id" };
    }
    var vodId = im[1];
    var url = linkOf(vodId);

    var data = await apiCall("/api/v2/home/public/video/long/detail", { id: vodId });
    var title = data && data.title ? data.title : "";
    var cover = "";
    if (data && data.thumb) {
      var one = {};
      one[t(data.thumb)] = true;
      var signed = await signImages([data.thumb]);
      cover = signed[t(data.thumb)] || "";
    }

    // 播放地址：指纹登录 → play/url（与蜘蛛 play() 一致，masterUrl 优先）
    var videoUrl = "";
    try {
      var playData = await apiCallAuth("/api/v2/home/user/video/play/url", { id: vodId });
      if (playData) {
        var relUrl = playData.masterUrl || playData.p720Url || playData.p480Url || "";
        if (relUrl) {
          if (/^https?:\/\//i.test(relUrl)) {
            videoUrl = relUrl;
          } else {
            var cdns = await getCdnList();
            var cdnIdx = 0;
            var cm = String(relUrl).match(/cdnId=(\d+)/);
            if (cm) {
              var cid = parseInt(cm[1], 10);
              if (cid >= 0 && cid < cdns.length) cdnIdx = cid;
            }
            videoUrl = cdns[cdnIdx].replace(/\/$/, "") + relUrl;
          }
        }
      }
    } catch (e) { /* 降级为失败卡 */ }

    if (!videoUrl) {
      return { id: url, type: "url", title: title || "解析失败", description: "未找到播放地址" };
    }
    return {
      id: url,
      type: "detail",
      title: title,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE + "/"
      }
    };
  } catch (e) {
    return { id: s || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
