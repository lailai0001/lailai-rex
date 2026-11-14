// AV01 for REX (lai_av01 v1.0.0)
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
  description: "AV01：API 站，唯一真多档 360p/720p/1080p，含 LTX超清解码分类，点播现取签名播单",
  author: "lai",
  version: "1.0.0",
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
  ]
};

var API = "https://www.av01.media/api/v1";
var SITE = "https://www.av01.media";
var GEO_URL = "https://files.iw01.xyz/edge/geo.js?json";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

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

// 详情：只现取 master 拿各档变体 URI（无 token 即可取），点播现签
async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
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
    // 各档现解：master 里 RESOLUTION=1280x720 / 1920x1080 / 640x360
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
        tiers.push({ label: label, h: h });
      }
    }
    if (!tiers.length && master) {
      // 单变体 master：无 RESOLUTION，取唯一变体
      var lines = master.split("\n");
      for (var i = 0; i < lines.length; i++) {
        var ln = t(lines[i]);
        if (ln && ln.indexOf("#") !== 0 && ln.indexOf(".m3u8") !== -1) { tiers.push({ label: "原画", h: 0 }); break; }
      }
    }
    tiers.sort(function (a, b) { return b.h - a.h; });
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    for (var i2 = 0; i2 < tiers.length; i2++) {
      var lab = tiers[i2].label;
      var id = pageUrl + "@@AV01:" + vid + ":" + lab;
      eps.push({ name: lab, link: id });
      seasonEps.push({ title: lab, episodeNumber: i2 + 1 });
      epItems.push({
        id: id,
        type: "url",
        title: lab,
        mediaType: "movie",
        posterPath: pic,
        link: id,
        episode: i2 + 1,
        episodeNumber: i2 + 1,
        seasonIndex: 1,
        seasonNumber: 1
      });
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
      playerType: "app"
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "清晰度", name: "清晰度", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
    }
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// loadResource：@@AV01:<id>:<label> -> 现取 geo + cdn token + master，拼签名变体地址
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
  var label = m[2];
  try {
    var geo = await getGeo();
    if (!geo) return [];
    var want = label === "原画" ? 0 : (parseInt(label.replace("p", ""), 10) || 0);
    var master = await getText(API + "/videos/" + vid + "/manifest/master.m3u8");
    var uri = findTier(master, want);
    if (!uri) return [];
    // cdn-access 拿 JWT：绝不要加 comp=true（403）
    var qa = "token_v2=" + encodeURIComponent(geo.token_v2 || "")
      + "&expires=" + encodeURIComponent(geo.expires || "")
      + "&ip=" + encodeURIComponent(geo.ip || "");
    var cj = await getJson(API + "/videos/" + vid + "/cdn-access?" + qa);
    var token = (cj && cj.access_token) || (cj && cj.token) || "";
    if (!token) return [];
    // is_hot 决定 1080p 上限
    var hot = false;
    var parts = token.split(".");
    if (parts.length >= 2) {
      try {
        var payload = JSON.parse(b64decodeUtf8(parts[1]));
        if (payload && payload.is_hot) hot = true;
      } catch (e) { /* ignore */ }
    }
    if (!hot && want > 720) {
      var lower = findTier(master, 720);
      if (lower) uri = lower;
    }
    // file = 变体 URI 末段；保留原有 ?ro=0 等参数
    var seg = uri.split("/").pop();
    var extra = "";
    var qpos = seg.indexOf("?");
    if (qpos > 0) {
      extra = seg.slice(qpos + 1);
      seg = seg.slice(0, qpos);
    }
    var signed = API + "/videos/" + vid + "/manifest/" + seg + "?access_token=" + encodeURIComponent(token);
    if (extra) signed += "&" + extra;
    return [{ name: label, url: signed, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": SITE + "/" } }];
  } catch (e) {
    return [];
  }
}
