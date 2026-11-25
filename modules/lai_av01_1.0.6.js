// v1.0.6：逐个重做（B组第2个）——按真站API核实：演员/分类用数字ID走专属接口（/videos/actress/<id>、/videos/tag/<id>），实测干净（七嶋舞页全是她本家、美乳页全是该类）；1.0.5 的 actor:/tag: 只带名字、点按走名字搜索易混。补全覆盖派发。
// v1.0.5：AVDB 样式详情：peoples/genreItems + 点按路由
// AV01 for REX (lai_av01 v1.0.4)
// v1.0.4（2026-11-21）：补顶层 search 键（A 键，照 64 个可见模块的众数形状）；B 条目与 search 函数一个字未动。
// v1.0.3（2026-11-15）：1.0.2 在手机上仍播不了——用户截图坐实（vid=225739，1080p）：
//   播放器拿到的 Worker /play.m3u8 地址本身是对的，但播不了。死在 Worker 腿上：
//   v1 Worker 自己现取 JWT 再自己取分片，geo 看到的出口 IP 与取分片时的出口 IP
//   不是同一个，customers.iw01.xyz 对 JWT 做严格 IP 校验，一律 403
//   "Access Denied: IP Validation Failed"——Worker 代理分片在结构上就行不通。
//   修法（猫源 av01.js 同款，已验证可播）：详情在手机侧现铸 JWT（geo + cdn-access，
//   geo.ip 就是手机 IP，播放器也是这台手机，IP 一致），每档直接交签名的变体播单
//   地址（直连行，首选）；同时保留一条 av01-hls Worker v2 行（中转行，次选——
//   v2 按播放器 IP（CF-Connecting-IP）签发 JWT，分片改写为直链，不再代理分片；
//   需用户部署 v2，见同目录 av01-hls-worker-v2.js）。
//   is_hot 决定 1080p 上限（猫源同款：hot 才出 1080p，否则最高 720p）。
// 移植自 mira-cat 蜘蛛 av01.js（只读蓝图），API https://www.av01.media/api/v1。
// 唯一真多档站（360p/720p/1080p）：
//   详情：GET /api/v1/videos/<id>（标题/时长/描述）
//         + GET /api/v1/videos/<id>/manifest/master.m3u8（无 token 即可取，含各档变体 URI）
//   点播：GET /videos/<id>/cdn-access?token_v2&expires&ip -> JWT（1h，IP 绑定）
//         -> 拼 /api/v1/videos/<id>/manifest/<file>?access_token=<token>（file 为变体 URI 末段，
//         保留原有 ?ro=0 等参数，用 & 拼接）。注意：绝不要加 comp=true（403 "This video is not available"）。
//         is_hot 在 JWT 里决定 1080p 上限：hot -> 1080p，否则最高 720p；全被滤掉时回退最低档。
// token_v2/expires/ip 来自 https://files.iw01.xyz/edge/geo.js?json（geo 缓存 9 分钟）。
// 点播现取：详情只存档位名，loadResource 现取 geo + cdn token + master 再拼签名地址。
// 分类：最新 / 热门 / LTX超清解码（tag:3585301，13 部，番号带 -ltx 后缀）/
//   流出 / LADA破解无码 / 無修正 / 巨尻 / 15 个热门标签。
// 封面：https://static.av01.tv/media/videos/tmb/<id>/1.jpg/format=webp/wlv=800?access_token=<geo access_token>。
// 注意：VM 侧 AV01 API 偶发超时，手机端为验证基准；token 是 IP 绑定，模块与播放器同一设备/IP。

WidgetMetadata = {
  id: "lai_av01",
  title: "AV01",
  description: "AV01：API 站，唯一真多档 360p/720p/1080p，含 LTX超清解码分类，每档直连+中转双线",
  author: "lai",
  version: "1.0.6",
  requiredVersion: "0.0.1",
  site: "https://www.av01.media",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "热门", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "hottest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "LTX超清解码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag:3585301" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "流出", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag:1453929" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "LADA破解无码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag:3583787" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "無修正", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag:3583805" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "巨尻", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag:107" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "热门标签", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag:106" }, { name: "sub", title: "标签", type: "enumeration", value: "106", enumOptions: [{"title": "HD高画质", "value": "314590"}, {"title": "中出内射", "value": "1"}, {"title": "独占配信", "value": "314849"}, {"title": "专属女优作品", "value": "5"}, {"title": "巨乳", "value": "2"}, {"title": "素人", "value": "424"}, {"title": "人妻主妇", "value": "3"}, {"title": "4K", "value": "527309"}, {"title": "情色自拍", "value": "314685"}, {"title": "口交吹萧", "value": "166"}, {"title": "美少女", "value": "94"}, {"title": "熟女", "value": "599"}, {"title": "苗条", "value": "59"}, {"title": "美乳", "value": "60"}, {"title": "痴女", "value": "26"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
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

var API = "https://www.av01.media/api/v1";
var SITE = "https://www.av01.media";
var GEO_URL = "https://files.iw01.xyz/edge/geo.js?json";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
// 播单代理 Worker v2（见同目录 av01-hls-worker-v2.js，需用户部署；域名 https://av01-hls.li768435813.workers.dev）：
// v2 按播放器 IP 签发 JWT，分片改写为直链，不再代理分片（v1 的 /seg 结构上必 403）。
// 中转行是次选；首选是模块在手机侧现铸的直连行（猫源同款）。
var HLS = "https://av01-hls.li768435813.workers.dev";
// 档位直交 Worker 地址：/play.m3u8?vid=<vid>&tier=<档位数字>（"原画" 传 "原画"，Worker 侧映射为 0）。
// Worker 服务端现铸 IP 绑定 JWT（120 秒缓存）取分片；模块侧不要自己拼直链、不要传 comp=true（403）。
function workerUrl(vid, tier) {
  return HLS + "/play.m3u8?vid=" + encodeURIComponent(vid) + "&tier=" + encodeURIComponent(tier);
}
var _hlsLive = null;
var _hlsLiveAt = 0;
async function hlsLive() {
  if (_hlsLive !== null && Date.now() - _hlsLiveAt < 600000) return _hlsLive;
  var ok = false;
  try {
    var res = await Widget.http.get(HLS + "/", { headers: { "User-Agent": UA } });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    ok = res && res.status === 200 && body.indexOf("-hls ok") >= 0;
  } catch (e) { ok = false; }
  _hlsLive = ok;
  _hlsLiveAt = Date.now();
  return ok;
}


var _geoCache = null;
var _geoCacheAt = 0;

function t(v) {
  return String(v == null ? "" : v).trim();
}

function clean(s) {
  return t(s).replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
}

// base64url 解码（纯 JS，无 Buffer）
var B64CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64urlDecode(str) {
  str = String(str || "").replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  var out = "";
  var buf = 0, bits = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i);
    if (c === "=") break;
    var v = B64CHARS.indexOf(c);
    if (v < 0) continue;
    buf = (buf << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out += String.fromCharCode((buf >> bits) & 0xff);
    }
  }
  return out;
}

function b64decodeUtf8(str) {
  var raw = b64urlDecode(str);
  var out = "";
  for (var i = 0; i < raw.length; i++) {
    var c = raw.charCodeAt(i);
    if (c < 0x80) {
      out += String.fromCharCode(c);
    } else if (c >= 0xc0 && c < 0xe0 && i + 1 < raw.length) {
      out += String.fromCharCode(((c & 0x1f) << 6) | (raw.charCodeAt(i + 1) & 0x3f));
      i++;
    } else if (c >= 0xe0 && i + 2 < raw.length) {
      out += String.fromCharCode(((c & 0x0f) << 12) | ((raw.charCodeAt(i + 1) & 0x3f) << 6) | (raw.charCodeAt(i + 2) & 0x3f));
      i += 2;
    }
  }
  return out;
}

async function getJson(url, headers) {
  try {
    var res = await Widget.http.get(url, { headers: headers || { "User-Agent": UA, "Accept": "application/json, */*", "Referer": SITE + "/" } });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    if (!body) return null;
    try { return JSON.parse(body); } catch (e) { return null; }
  } catch (e) { return null; }
}

async function getText(url, headers) {
  try {
    var res = await Widget.http.get(url, { headers: headers || { "User-Agent": UA, "Referer": SITE + "/" } });
    return res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
  } catch (e) { return ""; }
}

// geo.js?json 返回 token_v2/expires/ip/access_token，9 分钟缓存
async function getGeo() {
  if (_geoCache && Date.now() - _geoCacheAt < 540000) return _geoCache;
  var g = await getJson(GEO_URL, { "User-Agent": UA, "Accept": "application/json" });
  if (g) {
    _geoCache = g;
    _geoCacheAt = Date.now();
    return g;
  }
  return null;
}

// 手机侧现铸 CDN token（猫源 getCdnToken 同款）：geo.js 给 token_v2/expires/ip，
// cdn-access 换 JWT（1 小时，绑 geo.ip = 手机 IP）。返回 { token, hot } 或 null。
async function getCdnToken(vid) {
  var geo = await getGeo();
  if (!geo) return null;
  var qa = "token_v2=" + encodeURIComponent(geo.token_v2 || "")
    + "&expires=" + encodeURIComponent(geo.expires || "")
    + "&ip=" + encodeURIComponent(geo.ip || "");
  var cj = await getJson(API + "/videos/" + vid + "/cdn-access?" + qa);
  var token = (cj && cj.access_token) || (cj && cj.token) || "";
  if (!token) return null;
  var hot = false;
  var parts = token.split(".");
  if (parts.length >= 2) {
    try {
      var payload = JSON.parse(b64decodeUtf8(parts[1]));
      if (payload && payload.is_hot) hot = true;
    } catch (e) { /* ignore */ }
  }
  return { token: token, hot: hot };
}

// 变体 URI 拼签名地址：file = 变体 URI 末段，保留原有 ?ro=0 等参数（猫源 signVariantUrl 同款）
function signVariantUrl(vid, rawUri, token) {
  var seg = String(rawUri || "").split("/").pop();
  var extra = "";
  var qpos = seg.indexOf("?");
  if (qpos > 0) {
    extra = seg.slice(qpos + 1);
    seg = seg.slice(0, qpos);
  }
  var signed = API + "/videos/" + vid + "/manifest/" + seg + "?access_token=" + encodeURIComponent(token);
  if (extra) signed += "&" + extra;
  return signed;
}

function coverOf(id, geo) {
  var base = "https://static.av01.tv/media/videos/tmb/" + id + "/1.jpg/format=webp/wlv=800";
  if (geo && geo.access_token) return base + "?access_token=" + encodeURIComponent(geo.access_token);
  return base;
}

function parseListJson(j, geo) {
  var list = [];
  if (!j || !j.videos) return list;
  var arr = j.videos;
  for (var i = 0; i < arr.length; i++) {
    var v = arr[i];
    var id = v.id;
    if (!id) continue;
    var title = clean((v.title_translations && (v.title_translations.cn || v.title_translations.zh || v.title_translations.en)) || v.title || v.dvd_id || String(id));
    var pic = coverOf(id, geo);
    var dur = v.duration ? String(v.duration) : "";
    var link = SITE + "/video/" + id;
    var dvd = t(v.dvd_id || "");
    list.push({
      id: link,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: dvd + (dvd && dur ? " · " : "") + dur,
      mediaType: "movie"
    });
  }
  return list;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  // 全覆盖派发：App 点 peoples/genreItems 可能调 loadList 传 peopleId/genreId
  // （actor:<id> / tag:<id> / 完整 URL / 裸名），直接走专属接口或分类。
  var pid = String(params.peopleId || params.people || params.actor || params.actorId || "").trim();
  var gid = String(params.genreId || params.genre || params.category || "").trim();
  var rawL = String(params.url || params.link || params.href || params.value || params.id || "").trim();
  var keyL = pid || gid || rawL;
  if (keyL) {
    var amL = keyL.match(/^actor:(\d+)$/);
    if (amL) {
      try {
        var geoAL = await getGeo();
        var jAL = await getJson(API + "/videos/actress/" + amL[1] + "?page=" + (Math.max(1, parseInt(params.page, 10) || 1)) + "&limit=20");
        var listAL = parseListJson(jAL, geoAL);
        if (Array.isArray(listAL) && listAL.length) return listAL;
      } catch (eAL) {}
      return emptyItem("该演员暂无作品");
    }
    var gmL = keyL.match(/^tag:(\d+)$/);
    if (gmL) {
      try { return await loadList({ sub: gmL[1], page: params.page }); } catch (eGL) { return emptyItem("该分类暂无作品"); }
    }
    if (/\/tag\//i.test(keyL) || /^tag:/i.test(keyL)) {
      var tn = keyL.replace(/^tag:/i, "").split("/").pop() || "";
      try { tn = decodeURIComponent(tn); } catch (eT) {}
      try { return await loadList({ sub: tn, page: params.page }); } catch (eT2) { return emptyItem("该分类暂无作品"); }
    }
    // 裸名：先按演员搜，再按分类取。
    try {
      var swL = await search({ keyword: keyL, page: params.page });
      if (Array.isArray(swL) && swL.some(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; })) return swL;
    } catch (eSL) {}
    try { return await loadList({ sub: keyL, page: params.page }); } catch (eSL2) { return emptyItem("未找到相关内容"); }
  }
  var zone = t(params.zone || "latest");
  var tag = t(params.sub || params.tag || "");
  if (tag) zone = "tag:" + tag;
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var url = "";
  if (zone === "latest" || zone === "hottest") {
    url = API + "/videos/types/" + zone + "?page=" + page + "&limit=20";
  } else if (zone.indexOf("tag:") === 0) {
    url = API + "/videos/tag/" + zone.slice(4) + "?page=" + page + "&limit=20";
  } else {
    return emptyItem("未知的分类");
  }
  try {
    var geo = await getGeo();
    var j = await getJson(url);
    var list = parseListJson(j, geo);
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
    var res = await Widget.http.post(API + "/videos/search?lang=cn", JSON.stringify({ query: wd, page: page, limit: 20 }), { headers: { "User-Agent": UA, "Content-Type": "application/json", "Accept": "application/json, */*", "Referer": SITE + "/" } });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    var j = null;
    try { j = JSON.parse(body); } catch (e) { j = null; }
    var geo = await getGeo();
    var list = parseListJson(j, geo);
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

function findTier(manifest, tier) {
  if (!manifest) return "";
  var body = manifest;
  // 各档变体行：#EXT-X-STREAM-INF:BANDWIDTH=...,RESOLUTION=1280x720\n<uri>
  var re = /#EXT-X-STREAM-INF:([^\n]*)\n([^\n]+)/g;
  var m;
  var best = "";
  while ((m = re.exec(body)) !== null) {
    var attrs = m[1] || "";
    var uri = t(m[2] || "");
    if (!uri || uri.indexOf("#") === 0) continue;
    var rm = attrs.match(/RESOLUTION=(\d+)x(\d+)/);
    if (!rm) continue;
    var h = parseInt(rm[2], 10);
    if (h === tier) return uri;
    if (h < tier) best = uri;
  }
  if (best) return best;
  // 兜底：单变体 master（无 RESOLUTION），返回唯一非注释行
  var lines = body.split("\n");
  for (var i = 0; i < lines.length; i++) {
    var ln = t(lines[i]);
    if (ln && ln.indexOf("#") !== 0 && ln.indexOf(".m3u8") !== -1) return ln;
  }
  return "";
}

// 详情：只现取 master 拿各档变体 URI（无 token 即可取），各档直交 Worker 地址，点播不再二次解析
// ---- AVDB 样式详情：演员/分类（点按出对应全部内容）----
// 详情页 HTML 里扫演员/分类链接（站内同源），建成 peoples / genreItems；
// 点按后 loadDetail 走分类页分支（loadList 取该分类的全部影片，取不到则 search 回落）。
var TAX_HOST_OVERRIDE = "";
var TAX_BASE = SITE;
var TAX_ACTRESS_RE = /\/(actress(es)?|actors?|pornstars?|stars?|models?|performers?|idols?)\//i;
var TAX_GENRE_RE = /\/(genres?|tags?|categor(?:y|ies)|category|labels?|makers?|channels?)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)|category|actress(es)?|actors?|pornstars?|stars?|models?|makers?|channels?|labels?|all|全部|分类|演员|标签|女优|题材|片商)$/i;
function taxAbs(href) {
  var s = String(href || "").split("#")[0];
  if (/^https?:\/\//i.test(s)) return s;
  if (s.indexOf("//") === 0) return "https:" + s;
  var base = TAX_HOST_OVERRIDE || TAX_BASE;
  base = String(base || "").replace(/\/+$/, "");
  if (s.charAt(0) === "/") return base + s;
  return base + "/" + s;
}
function taxSlugOf(abs, isActress) {
  var path = String(abs || "").split("?")[0].split("#")[0];
  var vm = path.match(/\/(vodtype|vodshow)\/(\d+)/i);
  if (vm) return vm[2];
  var parts = path.replace(/^https?:\/\/[^/]+\//, "").split("/");
  var segs = [];
  for (var i = 0; i < parts.length; i++) { if (parts[i]) segs.push(parts[i]); }
  while (segs.length && (/^\d+\.html$/i.test(segs[segs.length - 1]) || /^\d+$/.test(segs[segs.length - 1]) || segs[segs.length - 1] === "page")) segs.pop();
  for (var j = 0; j < segs.length; j++) {
    if (/_(category|makersr)$/i.test(segs[j]) && segs[j + 2]) return segs[j + 2];
  }
  if (!segs.length) return "";
  var last = segs[segs.length - 1];
  if (/^(genres?|tags?|categor(?:y|ies)|category|labels?|makers?|channels?|actress(es)?|actors?|pornstars?|stars?|models?|performers?|idols?)$/i.test(last)) return "";
  return last;
}
function extractTaxonomyFromHtml(html, hostOverride) {
  if (hostOverride) TAX_HOST_OVERRIDE = hostOverride;
  var peoples = [];
  var genreItems = [];
  var seenP = {};
  var seenG = {};
  var baseHost = String(TAX_HOST_OVERRIDE || TAX_BASE || "").replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(String(html || ""))) !== null) {
    var href = m[1] || "";
    var name = String(m[2] || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (!name || name.length > 40 || TAX_NAV_NAME_RE.test(name)) continue;
    var abs = taxAbs(href).split(" ").join("%20");
    if (!/^https?:\/\//i.test(abs)) continue;
    var host = abs.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (baseHost && host !== baseHost) continue;
    var isA = TAX_ACTRESS_RE.test(abs);
    var isG = !isA && TAX_GENRE_RE.test(abs);
    if (!isA && !isG) continue;
    var seg = taxSlugOf(abs, isA);
    if (!seg) continue;
    if (isA) {
      if (seenP[abs]) continue;
      seenP[abs] = 1;
      peoples.push({ id: abs, title: name, name: name, link: abs, role: "演员" });
    } else {
      if (seenG[abs]) continue;
      seenG[abs] = 1;
      genreItems.push({ id: abs, title: name });
    }
    if (peoples.length >= 20 && genreItems.length >= 20) break;
  }
  return { peoples: peoples, genreItems: genreItems };
}
function taxNameFromUrl(url) {
  var s = String(url || "");
  if (s.indexOf("actor:") === 0) return s.slice(6);
  if (s.indexOf("tag:") === 0) return s.slice(4);
  if (s.indexOf("g:") === 0) return s.slice(2);
  var seg = taxSlugOf(s, false);
  var name = seg;
  try { name = decodeURIComponent(seg); } catch (e) { name = seg; }
  return String(name || "").replace(/\+/g, " ").trim();
}
async function taxPrimaryWorks(url, name, isActress) {
  var u = String(url || "");
  // 数字 ID 直接走专属接口（实测干净）：actor:<id> -> /videos/actress/<id>；tag:<id> -> /videos/tag/<id>。
  var am = u.match(/^actor:(\d+)$/);
  if (am) {
    try {
      var geoA = await getGeo();
      var jA = await getJson(API + "/videos/actress/" + am[1] + "?page=1&limit=20");
      var listA = parseListJson(jA, geoA);
      if (Array.isArray(listA) && listA.length) return listA;
    } catch (eA) {}
    return [];
  }
  var gm = u.match(/^tag:(\d+)$/);
  if (gm) {
    try { return await loadList({ sub: gm[1], page: 1 }); } catch (eG) { return []; }
  }
  // 名字 token（无数字 ID）：走分类/搜索回落。
  try { return await loadList({ sub: name, page: 1 }); } catch (e) { return []; }
}
async function taxRouteDetail(url, isActress, nameHint) {
  var name = taxNameFromUrl(url);
  // 数字 ID token（如 actor:131154）时，标题用调用方给的名字（peoples 项 title），
  // 否则标题会显示成数字 ID。
  if (/^(actor|tag):\d+$/.test(String(url || "")) && nameHint) name = nameHint;
  var works = [];
  try { works = await taxPrimaryWorks(url, name, isActress) || []; } catch (e) { works = []; }
  if (!Array.isArray(works)) works = [];
  var real = works.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
  if (!real.length) {
    try { var sw = await search({ keyword: name }); if (Array.isArray(sw)) works = sw; } catch (e2) {}
    real = (works || []).filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
  }
  return { id: url, type: "detail", mediaType: "movie", title: name || (isActress ? "演员" : "分类"), link: url, description: (isActress ? "演员" : "分类") + " · 共 " + real.length + " 部作品", videoUrl: "", childItems: [], relatedItems: real.length ? real : works };
}

function extractTaxonomyFromJson(det) {
  var peoples = [];
  var genreItems = [];
  if (!det || typeof det !== "object") return { peoples: peoples, genreItems: genreItems };
  var aKeys = ["actresses", "actress", "actors", "actor", "stars", "star", "performers", "performer"];
  var gKeys = ["tags", "tag", "genres", "genre", "categories", "category", "labels", "label", "maker", "studio"];
  var seenP = {};
  var seenG = {};
  var ki;
  var vi;
  for (ki = 0; ki < aKeys.length; ki++) {
    var av = det[aKeys[ki]];
    if (!av) continue;
    var arr = Array.isArray(av) ? av : [av];
    for (vi = 0; vi < arr.length; vi++) {
      var an = "";
      var aid = "";
      if (typeof arr[vi] === "string") an = arr[vi];
      else if (arr[vi] && typeof arr[vi] === "object") {
        an = (arr[vi].name_translations && (arr[vi].name_translations.cn || arr[vi].name_translations.zh)) || arr[vi].name || arr[vi].title || "";
        aid = arr[vi].id != null ? String(arr[vi].id) : "";
      }
      an = clean(String(an || ""));
      if (!an || an.length > 40 || seenP[an]) continue;
      seenP[an] = 1;
      // 演员用数字 ID（actor:<id>），点按走 /videos/actress/<id> 专属接口（实测干净）；
      // 无 ID 时才用名字（actor:<名>），点按走名字搜索回落。
      var atok = aid && /^\d+$/.test(aid) ? ("actor:" + aid) : ("actor:" + an);
      peoples.push({ id: atok, title: an, name: an, link: atok, role: "演员" });
      if (peoples.length >= 20) break;
    }
    if (peoples.length >= 20) break;
  }
  for (ki = 0; ki < gKeys.length; ki++) {
    var gv = det[gKeys[ki]];
    if (!gv) continue;
    var garr = Array.isArray(gv) ? gv : [gv];
    for (vi = 0; vi < garr.length; vi++) {
      var gn = "";
      var gid = "";
      if (typeof garr[vi] === "string") gn = garr[vi];
      else if (garr[vi] && typeof garr[vi] === "object") {
        gn = (garr[vi].name_translations && (garr[vi].name_translations.cn || garr[vi].name_translations.zh)) || garr[vi].name || garr[vi].title || garr[vi].slug || "";
        gid = garr[vi].id != null ? String(garr[vi].id) : "";
      }
      gn = clean(String(gn || ""));
      if (!gn || gn.length > 40 || seenG[gn]) continue;
      seenG[gn] = 1;
      // 分类用数字 ID（tag:<id>），点按走 /videos/tag/<id> 专属接口（实测干净）；
      // 无 ID 时才用名字（tag:<名>）。
      var gtok = gid && /^\d+$/.test(gid) ? ("tag:" + gid) : ("tag:" + gn);
      genreItems.push({ id: gtok, title: gn, link: gtok });
      if (genreItems.length >= 20) break;
    }
    if (genreItems.length >= 20) break;
  }
  return { peoples: peoples, genreItems: genreItems };
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    // App 可能只传一个只有 title/name、没有 link/id 的对象——unwrapLink 会得空串，
    // 这里用对象的 title/name 当裸名兜底。
    if (!raw && link && typeof link === "object") raw = String(link.title || link.name || "").trim();
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    if (raw.indexOf("actor:") === 0 || raw.indexOf("tag:") === 0 || /\/tag\//i.test(raw)) {
      var nameHint = (link && typeof link === "object") ? String(link.title || link.name || "").trim() : "";
      return await taxRouteDetail(raw, raw.indexOf("actor:") === 0, nameHint);
    }
    // 裸名兜底：App 点演员/分类可能只传名字（如 "七嶋舞"、"美乳"），不带 token 或 URL。
    // 先按演员搜，取到即回演员详情；没有再按分类取；都没有才继续走影片流程。
    if (!/^https?:\/\//i.test(raw) && raw.indexOf("/") < 0 && !/^\d{5,}/.test(raw)) {
      try {
        var swB = await search({ keyword: raw });
        if (Array.isArray(swB) && swB.some(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; })) {
          var realB = swB.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
          return { id: raw, type: "detail", mediaType: "movie", title: raw, link: raw, description: "演员 · 共 " + realB.length + " 部作品", videoUrl: "", childItems: [], relatedItems: realB };
        }
      } catch (eB) {}
      try {
        var lwB = await loadList({ sub: raw, page: 1 });
        if (Array.isArray(lwB) && lwB.some(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; })) {
          var realBG = lwB.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
          return { id: raw, type: "detail", mediaType: "movie", title: raw, link: raw, description: "分类 · 共 " + realBG.length + " 部作品", videoUrl: "", childItems: [], relatedItems: realBG };
        }
      } catch (eB2) {}
    }
    var vm = raw.match(/(\d{5,})/);
    var vid = vm ? vm[1] : raw;
    if (!vid) return { id: raw, type: "url", title: "解析失败", description: "链接为空" };
    var pageUrl = SITE + "/video/" + vid;
    var det = await getJson(API + "/videos/" + vid);
    var master = await getText(API + "/videos/" + vid + "/manifest/master.m3u8");
    var name = "";
    var desc = "";
    var dvd = "";
    if (det) {
      name = clean((det.title_translations && (det.title_translations.cn || det.title_translations.zh || det.title_translations.en)) || det.title || det.dvd_id || "");
      desc = clean(det.description || (det.description_translations && (det.description_translations.cn || det.description_translations.en)) || "");
      dvd = t(det.dvd_id || "");
    }
    if (!name) name = dvd || vid;
    var geo = await getGeo();
    var pic = coverOf(vid, geo);
    // 各档现解：master 里 RESOLUTION=1280x720 / 1920x1080 / 640x360，记下每档变体 URI
    var tiers = [];
    var seen = {};
    var re = /#EXT-X-STREAM-INF:([^\n]*)\n([^\n]+)/g;
    var m;
    while ((m = re.exec(master)) !== null) {
      var rm = (m[1] || "").match(/RESOLUTION=(\d+)x(\d+)/);
      if (!rm) continue;
      var h = parseInt(rm[2], 10);
      var label = h + "p";
      if (!seen[label]) {
        seen[label] = 1;
        tiers.push({ label: label, h: h, uri: t(m[2] || "") });
      }
    }
    if (!tiers.length && master) {
      // 单变体 master：无 RESOLUTION，取唯一变体
      var lines = master.split("\n");
      for (var i = 0; i < lines.length; i++) {
        var ln = t(lines[i]);
        if (ln && ln.indexOf("#") !== 0 && ln.indexOf(".m3u8") !== -1) { tiers.push({ label: "原画", h: 0, uri: ln }); break; }
      }
    }
    tiers.sort(function (a, b) { return b.h - a.h; });
    // 手机侧现铸 JWT（猫源同款）：token 失败则直连行不出，只留中转行；hot 决定 1080p 上限。
    var cdn = null;
    try { cdn = await getCdnToken(vid); } catch (e) { cdn = null; }
    if (cdn) {
      var maxH = cdn.hot ? 1080 : 720;
      var kept = [];
      for (var ki = 0; ki < tiers.length; ki++) {
        if (tiers[ki].h <= maxH) kept.push(tiers[ki]);
      }
      if (!kept.length && tiers.length) {
        var sorted = tiers.slice().sort(function (a, b) { return a.h - b.h; });
        kept = [sorted[0]];
      }
      tiers = kept;
    }
    // 每档两集：直连行（签名变体播单，手机侧现铸 JWT，首选）+ 中转行（Worker v2，次选）。
    // 详情直接把最终地址写进每集的 videoUrl，点播不再二次解析；link/id 仍留懒链接作回落。
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    var firstUrl = "";
    var epNo = 0;
    var pushEp = function (lab, id, videoUrl, playerType, customHeaders) {
      epNo++;
      eps.push({ name: lab, link: id });
      var se = { title: lab, episodeNumber: epNo };
      if (videoUrl) se.videoUrl = videoUrl;
      seasonEps.push(se);
      var item = {
        id: id,
        type: "url",
        title: lab,
        mediaType: "movie",
        posterPath: pic,
        link: id,
        episode: epNo,
        episodeNumber: epNo,
        seasonIndex: 1,
        seasonNumber: 1
      };
      if (videoUrl) {
        item.videoUrl = videoUrl;
        item.playerType = playerType || "system";
        if (customHeaders) item.customHeaders = customHeaders;
      }
      epItems.push(item);
      if (!firstUrl && videoUrl) firstUrl = videoUrl;
    };
    for (var i2 = 0; i2 < tiers.length; i2++) {
      var lab = tiers[i2].label;
      var tierParam = tiers[i2].h ? String(tiers[i2].h) : "原画";
      var baseId = pageUrl + "@@AV01:" + vid + ":" + lab;
      if (cdn && cdn.token && tiers[i2].uri) {
        var durl = signVariantUrl(vid, tiers[i2].uri, cdn.token);
        pushEp(lab + "·直连", baseId, durl, "system", { "User-Agent": UA, "Referer": SITE + "/" });
      }
      var wurl = workerUrl(vid, tierParam);
      pushEp(lab + "·中转", baseId, wurl, "system", null);
    }
    var result = {
      id: pageUrl,
      type: "detail",
      title: name,
      name: name,
      description: (dvd ? dvd + "\n" : "") + desc,
      mediaType: "movie",
      link: pageUrl,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app",
      videoUrl: firstUrl
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "清晰度", name: "清晰度", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
    }
    var tax = extractTaxonomyFromJson(det);
    if (tax.peoples.length) result.peoples = tax.peoples;
    if (tax.genreItems.length) result.genreItems = tax.genreItems;
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// loadResource：@@AV01:<id>:<label> -> [直连行（手机侧现铸 JWT，首选），中转行（Worker v2，次选）]。
// 现取失败也照样回中转行；整个函数绝不抛错（外层 loadResource 还有 try/catch 兜底）。
async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 直链 m3u8（已签名的变体地址）
  if (/\.m3u8(\?|#|$)/i.test(raw) && raw.indexOf("@@") < 0) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": SITE + "/" } }];
  }
  var m = raw.match(/@@AV01:(\d+):(.+)$/);
  if (!m) {
    // 兜底：详情地址 -> 取详情首档
    try {
      var det = await loadDetail(raw);
      var eps = det && det.episodeItems;
      if (eps && eps.length) {
        return await loadResource({ link: eps[0].id });
      }
    } catch (e) { /* fall through */ }
    return [];
  }
  var vid = m[1];
  var label = m[2].replace(/·直连$/, "").replace(/·中转$/, "");
  var tierParam = label === "原画" ? "原画" : (label.replace(/p$/i, "") || label);
  var rows = [];
  try {
    var want = label === "原画" ? 0 : (parseInt(label.replace("p", ""), 10) || 0);
    var cdn = null;
    try { cdn = await getCdnToken(vid); } catch (e2) { cdn = null; }
    if (cdn && cdn.token) {
      var master = await getText(API + "/videos/" + vid + "/manifest/master.m3u8");
      var uri = findTier(master, want);
      if (!cdn.hot && want > 720) {
        var lower = findTier(master, 720);
        if (lower) uri = lower;
      }
      if (uri) {
        rows.push({ name: label + "·直连", url: signVariantUrl(vid, uri, cdn.token), playerType: "system", customHeaders: { "User-Agent": UA, "Referer": SITE + "/" } });
      }
    }
  } catch (e) { /* 直连行失败不影响中转行 */ }
  rows.push({ name: label + "·中转", url: workerUrl(vid, tierParam), playerType: "system" });
  return rows;
}
