// v1.0.11（2026-11-17）：1.0.10 仍报“未加载到相关资源”，且用户确认模块已是
//   1.0.10、所有片都这样、Worker 在 Safari 能打开。坐实问题在 loadDetail 的
//   请求上：① resolveViaWorker 用了严格 statusCode !== 200 判断，设备侧
//   statusCode 可能是字符串 "200" 或未定义，会把成功的回包也判成失败；
//   ② loadDetail 先抓详情页 HTML（设备侧可能被 CF 挡或很慢），拖垮整步。
//   修法：resolveViaWorker 改成只认 res.data（与能跑的 getJson 同款，不判
//   statusCode）；loadDetail 不再抓详情页 HTML，改走 WP API 取标题/封面
//   （与能跑的 loadList 同路）+ Worker 取播单，两路并行。
// v1.0.10（2026-11-17）：成功集 id 改成播单地址，见下。
// v1.0.6（2026-11-17）：修 1.0.5 点播回 [] 的 bug（见下）。
// v1.0.5（2026-11-16）：见下（略）。
// v1.0.4（2026-11-16）：1.0.3 修错了方向——master 死时改成全懒解析，真机仍
//   显示“未加载到相关资源”。对照 javdo/javlust 回落：给“网页播放”集，videoUrl 就是
//   详情页地址、playerType "app"，App 站内嗅探；seasons 集与 episodeItems 都带
//   videoUrl，补 childItems。
// v1.0.2（2026-11-16）：修“仍显示未加载到相关资源”。根因：loadDetail 里
//   getText（详情页）一旦抛错/空回应，catch 回一个无集的 type "url"
//   “加载失败”对象，App 把无集详情渲染成“未加载到相关资源”。链路本身
//   VM 已验通（详情 200、rocket 脚本、defaultUrl、嵌页 45KB、解包出
//   v-master token），猫源同链已确认可播。修法：详情取数改软取（抛错重
//   试一次，仍空则回站内嗅探详情）；catch 也回站内嗅探详情，永不回无集
//   对象；去掉顶层 videoUrl（详情顶层不带可播地址，只集里带）；
//   loadResource 用 unwrapLink（videoUrl 优先），死 master 时回站内嗅探行。
// MissAV BZ for REX (lai_missavbz v1.0.1)
// v1.0.1（2026-11-16）：修“未加载到相关资源”。根因：loadDetail 只在铸出 master 时才给
//   集数 videoUrl；铸造失败（或 master 是死的）时集数无 videoUrl，App 渲染不出线路。
//   另实测：铸出的 master 从 VM 出口取回的是 videplay 的 "Website Access Blocked"
//   拦截页（非 HLS），故 loadDetail 现铸后先探活（须以 #EXTM3U 开头才算活）；
//   活着给直链 master（system），死了给回落集：videoUrl 为详情页地址、playerType "app"
//   （站内嗅探，与猫源 py_missavbz 的 parse:1 回落同款）。loadResource 同款回落，绝不回 []。
// missav.bz：WordPress（Retrotube 主题）的 MissAV 镜像站，与 missav.fans 是两套站。
// missav.bz：WordPress（Retrotube 主题）的 MissAV 镜像站，与 missav.fans 是两套站。
// 分类（WP API 实测，仅 3 个）：censored 有码、english-subtitle 英文字幕、reducing-mosaic 减码破解（LTX，75,135 部）。
// 列表走 WP REST API（JSON），封面按 slug 拼 pic.missav.bz/image/<slug>.jpg。
// 播放链（3 部片实测）：详情页 Rocket base64 脚本 defaultUrl -> xx.videplay.us/v/<id> 嵌页
//   -> 内联打包脚本解包 -> https://api.videplay.us/vod/v-master.m3u8/<token>（自适应 master）。
//   token 每片不同、15 分钟以上有效；master 清单经 jina 侧验证 2/3 返回真 HLS（IPZZ-599-RM 回空，真机定性）。
//   站内无多档位，单集「正片」出 master 直链，不编造档位。字幕：REX 字幕走 lai_subtitleagg，本模块不内联接芯。
WidgetMetadata = {
  id: "lai_missavbz",
  title: "MissAV BZ",
  description: "MissAV BZ（missav.bz）：最新/减码破解/有码/英文字幕，详情现解 videplay 自适应 master 单线",
  author: "lai",
  version: "1.0.11",
  requiredVersion: "0.0.1",
  site: "https://missav.bz",
  detailCacheDuration: 0,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "减码破解", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "reducing-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "censored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "英文字幕", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "english-subtitle" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
  ]
};

var HOST = "https://missav.bz";
var RESOLVER = "https://missavbz-resolve.li768435813.workers.dev/resolve?u=";
var API = HOST + "/wp-json/wp/v2";
var UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
var B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var CAT_IDS = { "reducing-mosaic": 14458, "censored": 2, "english-subtitle": 15501 };

function t(v) {
  return String(v == null ? "" : v).trim();
}

function cleanText(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/&#x([0-9a-fA-F]+);/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); })
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

function firstMatch(text, re, idx) {
  var m = String(text || "").match(re);
  return m ? t(m[idx || 1] || "") : "";
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": referer || HOST + "/"
  };
}

async function getText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

async function getTextSoft(url, referer) {
  try {
    var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
    var body = res && res.data != null ? String(res.data) : "";
    return body || "";
  } catch (e) {
    return "";
  }
}

async function getJson(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  var d = res ? res.data : null;
  if (d == null) return [];
  if (typeof d === "object") return d;
  try { return JSON.parse(String(d)); } catch (e) { return []; }
}

// 纯字符串 base64 解码，返回 latin1 字符串（每个字符即一个字节）
function b64ToLatin1(s) {
  s = String(s || "").replace(/-/g, "+").replace(/_/g, "/").replace(/[^A-Za-z0-9+\/=]/g, "");
  while (s.length % 4) s += "=";
  var out = "";
  for (var i = 0; i < s.length; i += 4) {
    var c0 = B64_ALPHABET.indexOf(s.charAt(i));
    var c1 = B64_ALPHABET.indexOf(s.charAt(i + 1));
    var c2 = B64_ALPHABET.indexOf(s.charAt(i + 2));
    var c3 = B64_ALPHABET.indexOf(s.charAt(i + 3));
    if (c0 < 0 || c1 < 0) break;
    out += String.fromCharCode((c0 << 2) | (c1 >> 4));
    if (c2 >= 0) out += String.fromCharCode(((c1 & 15) << 4) | (c2 >> 2));
    if (c3 >= 0) out += String.fromCharCode(((c2 & 3) << 6) | c3);
  }
  return out;
}

// latin1 字节串按 UTF-8 解码（手工实现，不依赖运行环境解码接口）
function latin1ToUtf8(s) {
  var out = "";
  var i = 0;
  while (i < s.length) {
    var c = s.charCodeAt(i);
    i++;
    if (c < 128) {
      out += String.fromCharCode(c);
    } else if ((c & 224) === 192 && i < s.length) {
      var c2 = s.charCodeAt(i);
      i++;
      out += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
    } else if ((c & 240) === 224 && i + 1 < s.length) {
      var d2 = s.charCodeAt(i);
      var d3 = s.charCodeAt(i + 1);
      i += 2;
      out += String.fromCharCode(((c & 15) << 12) | ((d2 & 63) << 6) | (d3 & 63));
    } else if ((c & 248) === 240 && i + 2 < s.length) {
      var e2 = s.charCodeAt(i);
      var e3 = s.charCodeAt(i + 1);
      var e4 = s.charCodeAt(i + 2);
      i += 3;
      var cp = ((c & 7) << 18) | ((e2 & 63) << 12) | ((e3 & 63) << 6) | (e4 & 63);
      cp -= 65536;
      out += String.fromCharCode(55296 + (cp >> 10), 56320 + (cp & 1023));
    } else {
      out += String.fromCharCode(c);
    }
  }
  return out;
}

function isoDur(iso) {
  var m = String(iso || "").match(/P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "";
  var h = parseInt(m[2] || 0, 10);
  var mi = parseInt(m[3] || 0, 10);
  var s = parseInt(m[4] || 0, 10);
  var p2 = function (n) { return n < 10 ? "0" + n : "" + n; };
  if (h) return h + ":" + p2(mi) + ":" + p2(s);
  return mi + ":" + p2(s);
}

// Dean Edwards 打包器逆运算：从 videplay 嵌页内联脚本里解出 master 播放地址
function encBase(n, a) {
  if (n < a) return n > 35 ? String.fromCharCode(n + 29) : n.toString(36);
  var q = parseInt(n / a, 10);
  var r = n % a;
  return encBase(q, a) + (r > 35 ? String.fromCharCode(r + 29) : r.toString(36));
}

function unpackToken(embedHtml) {
  try {
    var m = String(embedHtml || "").match(/\}\('([\s\S]*)',(\d+),(\d+),'(.*)'\.split\('\|'\),0,\{\}\)\)/);
    if (!m) return "";
    var payload = m[1];
    var a = parseInt(m[2], 10);
    var c = parseInt(m[3], 10);
    var kws = m[4].split("|");
    for (var i = c - 1; i >= 0; i--) {
      var kw = kws[i] || "";
      if (kw) {
        var re = new RegExp("\\b" + encBase(i, a) + "\\b", "g");
        payload = payload.replace(re, function () { return kw; });
      }
    }
    var tm = payload.match(/v-master\.m3u8\/([A-Za-z0-9+/=]{100,})/);
    return tm ? "https://api.videplay.us/vod/v-master.m3u8/" + tm[1] : "";
  } catch (e) {
    return "";
  }
}

function extractEmbed(durl, detailHtml) {
  // 从详情页 base64 脚本里解出 videplay 播放器页地址（真播放器页，含 m3u8）。
  try {
    var html = detailHtml || "";
    if (!html) return "";
    var rm = html.match(/data-rocketlazyloadscript='data:text\/javascript;base64,([A-Za-z0-9+/=]+)'/);
    if (!rm) return "";
    var js = latin1ToUtf8(b64ToLatin1(rm[1]));
    var um = js.match(/defaultUrl\s*=\s*"([^"]+)"/);
    return um ? um[1] : "";
  } catch (e) { return ""; }
}
// 1.0.9：调 missavbz-resolve Worker 解析（服务端做详情→嵌页→解包→探活）。
//   回 {master, alive, embed}；Worker 不可用/未部署时回 null，走本地现解回落。
async function resolveViaWorker(durl) {
  try {
    var res = await Widget.http.get(RESOLVER + encodeURIComponent(durl), { headers: { "Accept": "application/json", "User-Agent": UA } });
    // 1.0.11：不判 statusCode（设备侧可能是字符串 "200" 或未定义，会误判成功为失败），
    // 只认 res.data，与能跑的 getJson 同款。
    var body = res ? res.data : null;
    if (body == null) return null;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) { return null; }
    }
    if (!body || typeof body !== "object") return null;
    return { master: body.master || "", alive: !!body.alive, embed: body.embed || "" };
  } catch (e) {
    return null;
  }
}

async function resolveMaster(durl, detailHtml) {
  try {
    var html = detailHtml || "";
    if (!html) html = await getTextSoft(durl, HOST + "/");
    if (!html) return "";
    var rm = html.match(/data-rocketlazyloadscript='data:text\/javascript;base64,([A-Za-z0-9+/=]+)'/);
    if (!rm) return "";
    var js = latin1ToUtf8(b64ToLatin1(rm[1]));
    var um = js.match(/defaultUrl\s*=\s*"([^"]+)"/);
    if (!um) return "";
    var embed = await getTextSoft(um[1], durl);
    if (!embed) return "";
    return unpackToken(embed);
  } catch (e) {
    return "";
  }
}

// master 探活：只认以 #EXTM3U 开头的真播单。videplay 会对死片/被拦出口回
// "Website Access Blocked" 拦截页（200、HTML），直接交给播放器必失败。
// 与猫源 py_missavbz 的 play() 探活同款。
async function probeMaster(master, referer) {
  try {
    var body = await getTextSoft(master, referer || HOST + "/");
    if (!body) return false;
    var s = body.replace(/^\s+/, "");
    return s.indexOf("#EXTM3U") === 0;
  } catch (e) {
    return false;
  }
}

// 播放头：与猫源 play() 的 parse:0 头一致（master 取数用）。
function masterHeaders(referer) {
  return { "User-Agent": UA, "Referer": referer || HOST + "/" };
}

// 详情页回落集：videoUrl 为详情页地址、playerType "app"，由 App 站内嗅探播放
// （猫源 parse:1 回落同款）。绝不回无 videoUrl 的懒解析集。
function sniffEpisode(url, title, cover, playUrl) {
  // 回落集：videoUrl 用 videplay 播放器页（真播放器页，含 m3u8），playerType "app"，
  // App 站内打开播放器页嗅探。取不到播放器页时才退回详情页地址。
  // 1.0.3 曾改成全懒解析（省略 videoUrl），真机证明 App 只认带 videoUrl 的集，
  // 全懒解析时详情直接显示“未加载到相关资源”，故改回此式。
  var play = playUrl || url;
  return { id: url, type: "url", title: title + " 网页播放", name: "网页播放", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, videoUrl: play, link: url, posterPath: cover, coverUrl: cover, playerType: "app" };
}

// 详情页取不到时也回一个可渲染的站内嗅探详情（绝不回无集的“加载失败”，
// App 会把无集详情渲染成“未加载到相关资源”）。
function sniffDetail(url, title, cover, desc) {
  // 1.0.7：回落详情也按 Capy 结构给全字段集（videoUrl 空、link 带详情地址），
  // 保证 App 一定能认出有资源，点播时 loadResource 现解。
  var ep = { id: url, type: "url", title: "正片", name: "正片", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, link: url, videoUrl: "", url: "", playUrl: "", posterPath: cover, coverUrl: cover, posterUrl: cover, backdropUrl: cover, playerType: "system" };
  var eps = [ep];
  var base = { id: url, type: "detail", title: title, link: url, posterPath: cover, coverUrl: cover, backdropPath: cover, posterUrl: cover, backdropUrl: cover, description: desc || "", videoUrl: "", url: "", playUrl: "", playerType: "system" };
  base.episodes = eps;
  base.seasons = [{ seasonNumber: 1, title: "正片", name: "正片", episodes: eps }];
  base.episodeItems = eps;
  base.childItems = eps;
  return base;
}

function slugCover(url) {
  var sm = String(url || "").match(/missav\.bz\/([^\/\?#]+)/);
  var slug = sm ? sm[1] : "";
  return { slug: slug, cover: slug ? "https://pic.missav.bz/image/" + slug + ".jpg" : "" };
}

function postCard(p) {
  var slug = t(p && p.slug);
  var title = "";
  if (p && p.title) title = cleanText(typeof p.title === "string" ? p.title : p.title.rendered);
  var link = t(p && p.link) || (slug ? HOST + "/" + slug + "/" : "");
  var date = t(p && p.date ? String(p.date).slice(0, 10) : "");
  var pic = slug ? "https://pic.missav.bz/image/" + slug + ".jpg" : "";
  return { id: link, type: "detail", title: title || slug, mediaType: "movie", posterPath: pic, coverUrl: pic, backdropPath: pic, description: date };
}

function listUrl(cat, page, wd) {
  var url = API + "/posts?per_page=20&page=" + page + "&_fields=id,slug,title,link,date";
  if (wd) {
    url += "&search=" + encodeURIComponent(wd);
  } else {
    url += "&orderby=date&order=desc";
    if (CAT_IDS[cat]) url += "&categories=" + CAT_IDS[cat];
  }
  return url;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var cat = String(params.path || params.cat || "latest");
  var url = listUrl(cat, page, "");
  try {
    var posts = await getJson(url, HOST + "/");
    if (!posts || !posts.length) return [{ id: "empty", type: "url", title: "暂无内容" }];
    var out = [];
    for (var i = 0; i < posts.length; i++) out.push(postCard(posts[i]));
    return out;
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败", description: String((e && e.message) || e) }];
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
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var url = listUrl("", page, wd);
  try {
    var posts = await getJson(url, HOST + "/");
    if (!posts || !posts.length) return [{ id: "empty", type: "url", title: "没有找到相关内容" }];
    var out = [];
    for (var i = 0; i < posts.length; i++) out.push(postCard(posts[i]));
    return out;
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败", description: String((e && e.message) || e) }];
  }
}

function unwrapLink(link) {
  if (link == null) return "";
  if (typeof link === "string") return link;
  return String(link.videoUrl || link.link || link.url || link.id || "");
}

// 1.0.8：loadDetail 按 JavRate 1.0.5 结构重写。取详情页后现解 master（不再探活），
//   解出就给真 videoUrl；解不出走 JavRate 回落（无 seasons，集只带 token link）。
// 1.0.11：loadDetail 不再抓详情页 HTML（设备侧可能被 CF 挡或很慢）。
//   改走 WP API 取标题（与能跑的 loadList 同路）+ Worker 取播单，两路并行。
//   封面固定用 pic.missav.bz/image/<slug>.jpg（与 postCard 同款）。
async function loadDetail(link) {
  var url = unwrapLink(link);
  try {
    if (!/^https?:\/\//i.test(url)) url = HOST + "/" + url.replace(/^\/+|\/+$/g, "") + "/";
    var slug = "";
    var sm = url.match(/missav\.bz\/([^\/\?#]+)/);
    if (sm) slug = sm[1];
    var title = slug || "MissAV BZ";
    var cover = slug ? "https://pic.missav.bz/image/" + slug + ".jpg" : "";
    var desc = "";
    // 两路并行：WP API 取标题 + Worker 取播单。
    var w = null;
    var post = null;
    try {
      var results = await Promise.all([
        resolveViaWorker(url),
        slug ? getJson(API + "/posts?slug=" + encodeURIComponent(slug) + "&_fields=id,slug,title,link,date", HOST + "/") : Promise.resolve([])
      ]);
      w = results[0];
      post = results[1];
    } catch (e) {
      w = null;
      post = null;
    }
    if (post && post.length && post[0]) {
      var p0 = post[0];
      var pt = "";
      if (p0.title) pt = cleanText(typeof p0.title === "string" ? p0.title : p0.title.rendered);
      if (pt) title = pt;
      if (p0.date) desc = String(p0.date).slice(0, 10);
    }
    // 顶层照 JavRate：playerType "app"，不带 videoUrl/url/playUrl。
    var base = { id: url, type: "detail", title: title, name: title, description: desc, mediaType: "movie", link: url, coverUrl: cover, posterPath: cover, backdropPath: cover, playerType: "app" };
    var src = (w && w.master) || "";
    var embed = (w && w.embed) || "";
    if (!src) {
      // Worker 没给播单时，本地现解作回落（取详情页 HTML）。
      try {
        var html = await getTextSoft(url, HOST + "/");
        src = await resolveMaster(url, html);
        if (!embed) embed = extractEmbed(url, html);
      } catch (e) { src = ""; }
    }
    if (src) {
      // 1.0.10：id/link/videoUrl 都是播单地址（与 JavRate 完全一致）；
      // embed 存到 url 字段，供 loadResource 死 master 时回落。
      base.episodes = [{ name: "正片", link: src }];
      base.seasons = [{ seasonNumber: 1, title: "正片", name: "正片", episodes: [{ title: "正片", videoUrl: src, episodeNumber: 1 }] }];
      base.episodeItems = [{ id: src, type: "url", title: title + " 正片", name: "正片", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, videoUrl: src, link: src, url: embed || "", posterPath: cover, coverUrl: cover }];
      base.childItems = base.episodeItems;
    } else {
      // 解不出 master：JavRate 回落——无 seasons，集只带 token link（详情地址），
      // 不带 videoUrl 字段；Worker 给过 embed 时 link 带 embed（网页播放兜底）。
      var tok = embed || url;
      base.episodes = [{ name: "正片", link: tok }];
      base.episodeItems = [{ id: url, title: title + " 正片", name: "正片", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, link: tok }];
      base.childItems = base.episodeItems;
    }
    return base;
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  var durl = "";
  try {
    params = params || {};
    var raw = unwrapLink(params);
    if (!raw && params.item) raw = unwrapLink(params.item);
    if (!raw) return [];
    // 1.0.10：成功集的 id 已是播单地址（不再是详情地址），durl 只从回落集的
    // link 里取；embed 存在集的 url 字段里，死 master 时直接作 app 回落。
    var emb0 = "";
    if (params && typeof params.url === "string" && /videplay\.us\/v\//i.test(params.url)) emb0 = params.url;
    if (!emb0 && params && params.item && typeof params.item.url === "string" && /videplay\.us\/v\//i.test(params.item.url)) emb0 = params.item.url;
    if (params && typeof params.link === "string" && params.link.indexOf("missav.bz/") >= 0) durl = params.link;
    if (!durl && params && typeof params.id === "string" && params.id.indexOf("missav.bz/") >= 0) durl = params.id;
    if (!durl && params && params.item && typeof params.item.link === "string" && params.item.link.indexOf("missav.bz/") >= 0) durl = params.item.link;
    if (!durl && params && params.item && typeof params.item.id === "string" && params.item.id.indexOf("missav.bz/") >= 0) durl = params.item.id;
    // 已是 master 地址：探活，活着直接给，死了回嵌页 app 回落（先用集里带的 embed，取不到才现取）
    if (raw.indexOf("https://api.videplay.us/vod/v-master.m3u8/") === 0) {
      var ok = await probeMaster(raw, HOST + "/");
      if (ok) return [{ name: "正片", url: raw, playerType: "system", headers: masterHeaders(HOST + "/"), customHeaders: masterHeaders(HOST + "/") }];
      if (emb0) return [{ name: "正片", url: emb0, playerType: "app" }];
      if (durl) {
        var dh = await getTextSoft(durl, HOST + "/");
        var eb = extractEmbed(durl, dh);
        return [{ name: "正片", url: eb || durl, playerType: "app" }];
      }
      return [];
    }
    var url = raw;
    if (!/^https?:\/\//i.test(url)) url = HOST + "/" + url.replace(/^\/+|\/+$/g, "") + "/";
    // 1.0.6：raw 是 videplay 嵌页地址（回落集的 videoUrl）时直接回 app 资源，
    // 绝不回 []；其余非站内地址但有详情地址 durl 时退回 durl 作 app 资源。
    if (url.indexOf("missav.bz/") < 0) {
      if (/videplay\.us\/v\//i.test(url)) return [{ name: "正片", url: url, playerType: "app" }];
      if (durl) return [{ name: "正片", url: durl, playerType: "app" }];
      return [];
    }
    // 1.0.7 第二步（照 JavRate）：点播时重新现铸 + 探活：活着给直链 master（system），
    // 死了给 videplay 嵌页作 app 回落（真播放器页，站内嗅探），嵌页取不到才退回详情页。
    // 1.0.9：先调 Worker 现铸（约 1 秒），Worker 不可用时本地现解。
    var src = "";
    var emb = "";
    try { var w2 = await resolveViaWorker(url); if (w2) { src = w2.master || ""; emb = w2.embed || ""; } } catch (e) { src = ""; emb = ""; }
    if (!src && !emb) {
      var dhtml = await getTextSoft(url, HOST + "/");
      src = await resolveMaster(url, dhtml);
      emb = extractEmbed(url, dhtml);
    }
    if (src && await probeMaster(src, url)) {
      return [{ name: "正片", url: src, playerType: "system", headers: masterHeaders(url), customHeaders: masterHeaders(url) }];
    }
    if (emb) return [{ name: "正片", url: emb, playerType: "app" }];
    var dhtml2 = await getTextSoft(url, HOST + "/");
    var emb2 = extractEmbed(url, dhtml2);
    return [{ name: "正片", url: emb2 || url, playerType: "app" }];
  } catch (e) {
    if (durl) return [{ name: "正片", url: durl, playerType: "app" }];
    return [];
  }
}
