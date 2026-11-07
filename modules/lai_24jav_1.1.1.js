// 24JAV for REX (lai_24jav v1.1.1)
// 移植自 mira-cat 蜘蛛 py_24jav.js（只读蓝图，未改动猫源），后端 https://www4.24-jav.com。
// WordPress 站（泰语界面，日语 AV）；帖子 = /<番号小写>/（如 /adn-814/）。
// 分类：首页实测 70 个 /genre/<slug>/ + 菜单/归档的 /category/subthai|uncensored|censored/
//   （uncensored 即站方自有的“无码”分区；无码流出/无码破解/减码无独立 slug，不硬编；
//   大屁股无对应 genre，'back' 为背后位而非臀部向，不作近义顶替）。
//   70 个 genre 走一个“类型筛选”枚举下拉，不平铺成 70 个模块。
// 列表：<article class="box"> 内 <a class="tip" href title> + <img src>；翻页 /page/<N>/。
// 搜索：/?s=<关键词>（站方 SearchAction 结构，实测 ADN-814 / MIRD 均回帖子）。
// 详情：播放器 iframe 有三种：mee18player.com / meeplayer.com（同款，/play/<40位hex>，
//   拼确定性 master 链 https://<host>/hlsr2/<token>/master；猫源注释称 32 位 md5 是旧口径，
//   2026-11-05 实测 token 为 40 位 hex，只取前 32 位拼 master 会 404 “Video not found”）
//   与 upload18.com（/play/index/<slug>，VM 侧回 403 WAF BLOCKED，REX 客户端或可过，
//   本模块只做尽力提取：拉播放页正则找 .m3u8/.mp4，找不到就不出播放地址、不硬编）。
//   master 实测为单档变体（本轮：SDJS-108 为 480p，FC2-PPV-2585015 为 1080p），
//   读 master 拆真实档位后出最高档 variant，读不到则直接给 master；单码率，不编假清晰度选单。
//   variant 段为 .jpg 后缀分片（站方自家播放器同样如此，属 HLS 正常形态）。
// 【2026-11-07 实证，v1.1.0 改动 2】播单本身是完整 VOD，但每个分片都是 PNG 包裹的 TS：
//   固定 545 字节 PNG 头（200x200 占位图）+ 188 对齐的真 TS（剥头后 ffprobe 得 h264+aac）。
//   严格内核见分片首字节不是 TS 便建不起时间轴（Mira 能播但不从头播、无法快进后退；REX 侧
//   “貌似播放不了”与此同源）。猫源侧已用本地 /proxy/ 代理剥头修复；REX 沙箱无本地代理，
//   模块内无法剥头，播不播得通取决于设备播放器内核——本站实测：改动 1（下）是模块内能修的实锤问题，
//   改动 2 是保音频的实锤问题；PNG 头本身留待真机定性，见 loadDetail 注释。
// 【v1.1.0 改动 1】loadDetail 回 seasons + episodeItems（单集正片，videoUrl 直链）：
//   1.0.0 只回 videoUrl、没有可点的集，详情页无播放入口，看起来像“播不了”。
// 【v1.1.0 改动 2】mee 播放地址改给 master 链（不再给最高档 variant 单链）：1080p 档音视频分离
//   （master 含 EXT-X-MEDIA 音频轨，视频分片纯视频、音频分片纯 AAC），旧版只给 variant 单链会丢音频；
//   480p 等混流档 master 只有一条 variant，结果与旧版一致。档位名仍读 master 拆出、仅作描述。
// 【v1.1.1 改动】videoUrl 改走已部署的 24jav-hls Worker（https://24jav-hls.li768435813.workers.dev）：
//   Worker 服务端剥 PNG 头（分片 545 字节 PNG 头 + 真 TS，2026-11-07 Worker 全链路实测：
//   SDJS-108 首分片 830584 字节纯 TS、Range 206；DLDSS-561 音频轨 930 分片、首音频分片纯 TS）。
//   videoUrl = Worker /m3u8?u=<b64url(master)>&r=<b64url("https://www4.24-jav.com/")>；
//   其余与 1.1.0 一致（档位描述仍读 master 直链拆出，不走 Worker；upload18 分支不动）。
// 字幕：猫源字幕芯（Layer A：迅雷 > 迅雷看看 > SubtitleCat）依赖 setTimeout 做 6 秒总预算，
//   REX 沙箱（JSC）无 setTimeout，无法等价移植，按 mogu 前例 REX 版不接字幕芯。

WidgetMetadata = {
  id: "lai_24jav",
  title: "24JAV",
  description: "24JAV（www4.24-jav.com）：最新/泰语字幕/无码/有码 + 70 类型筛选，详情单集播放",
  author: "lai",
  version: "1.1.1",
  requiredVersion: "0.0.1",
  site: "https://www4.24-jav.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "泰语字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "category/subthai" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "category/uncensored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "category/censored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "类型筛选", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "类型", type: "enumeration", value: "genre/3p", enumOptions: [{ title: "三人行", value: "genre/3p" }, { title: "虐待", value: "genre/abuse" }, { title: "出轨", value: "genre/affair" }, { title: "背后位", value: "genre/back" }, { title: "洗浴", value: "genre/bath" }, { title: "美少女", value: "genre/beautiful-girl" }, { title: "巨乳", value: "genre/big-tits" }, { title: "口交", value: "genre/blowjob" }, { title: "颜射", value: "genre/bukkake" }, { title: "巨乳癖", value: "genre/busty-fetish" }, { title: "宫颈", value: "genre/cervix" }, { title: "女上位", value: "genre/cowgirl" }, { title: "中出", value: "genre/creampie" }, { title: "绿帽", value: "genre/cuckold" }, { title: "射精", value: "genre/cum" }, { title: "舔阴", value: "genre/cunnilingus" }, { title: "出道作", value: "genre/debut-production" }, { title: "淫语", value: "genre/dirty-talk" }, { title: "剧情", value: "genre/drama" }, { title: "大叔", value: "genre/elder-male" }, { title: "面部射精", value: "genre/facials" }, { title: "女教师", value: "genre/female-teacher" }, { title: "足交", value: "genre/footjob" }, { title: "辣妹", value: "genre/gal" }, { title: "眼镜", value: "genre/glasses" }, { title: "温泉", value: "genre/hot-spring" }, { title: "教学", value: "genre/how-to" }, { title: "巨根", value: "genre/huge-cocks" }, { title: "羞辱", value: "genre/humiliation" }, { title: "乱伦", value: "genre/incest" }, { title: "教官", value: "genre/instructor" }, { title: "接吻", value: "genre/kiss" }, { title: "女同", value: "genre/lesbian" }, { title: "女同接吻", value: "genre/lesbian-kiss" }, { title: "乳液", value: "genre/lotion" }, { title: "精油", value: "genre/lotion-oil" }, { title: "M女", value: "genre/m-girl" }, { title: "男潮", value: "genre/male-squirting" }, { title: "已婚", value: "genre/married" }, { title: "人妻", value: "genre/married-woman" }, { title: "熟女", value: "genre/mature" }, { title: "娇小", value: "genre/mini" }, { title: "母亲", value: "genre/mother" }, { title: "肌肉", value: "genre/muscle" }, { title: "下流", value: "genre/nasty" }, { title: "护士", value: "genre/nurse" }, { title: "白领", value: "genre/ol" }, { title: "姐姐", value: "genre/older-sister" }, { title: "高潮", value: "genre/orgasm" }, { title: "群交", value: "genre/orgy" }, { title: "原创合作", value: "genre/original-collaboration" }, { title: "其他亚洲", value: "genre/other-asian" }, { title: "户外", value: "genre/outdoors" }, { title: "连裤袜", value: "genre/pantyhose" }, { title: "第一视角", value: "genre/pov" }, { title: "束缚", value: "genre/restraint" }, { title: "学校泳装", value: "genre/school-swimsuit" }, { title: "女学生", value: "genre/schoolgirls" }, { title: "白虎", value: "genre/shaved" }, { title: "苗条", value: "genre/slender" }, { title: "淫娃", value: "genre/slut" }, { title: "单体作品", value: "genre/solowork" }, { title: "潮吹", value: "genre/squirting" }, { title: "晒痕", value: "genre/sun-tan" }, { title: "汗水", value: "genre/sweat" }, { title: "泳装", value: "genre/swimsuit" }, { title: "乳交", value: "genre/titty-fuck" }, { title: "玩具", value: "genre/toy" }, { title: "排尿", value: "genre/urination" }, { title: "振动棒", value: "genre/vibe" }] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://www4.24-jav.com";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function unescapeHtml(s) {
  return String(s || "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); });
}

function cleanLabel(s) {
  return unescapeHtml(String(s || "").replace(/<[^>]+>/g, ""))
    .replace(/[\r\n\t]+/g, " ").replace(/[$#]/g, "").trim();
}

function clean(s) {
  return unescapeHtml(String(s || "").replace(/<[^>]+>/g, ""))
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ").trim();
}

function normUrl(u) {
  var s = t(u);
  if (!s) return "";
  s = s.replace(/^(https?:)\/([^/])/, "$1//$2");
  return s;
}

function absUrl(u, host) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return host + u;
  return u;
}

function resolveUrl(u, base) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  var m = String(base || "").match(/^(https?:\/\/[^\/]+)(\/.*)?$/);
  if (!m) return u;
  var origin = m[1];
  var path = m[2] || "/";
  if (u.charAt(0) === "/") return origin + u;
  var dir = path.slice(0, path.lastIndexOf("/") + 1);
  return origin + dir + u;
}

// 站方偶发 Cloudflare 520，取数最多 2 次重试（REX 沙箱无 setTimeout，只做顺序重试）
async function getHtml(path) {
  var url = t(path);
  if (url.indexOf("//") === 0) url = "https:" + url;
  else if (url.charAt(0) === "/") url = HOST + url;
  for (var attempt = 0; attempt < 2; attempt++) {
    try {
      var res = await Widget.http.get(url, {
        headers: {
          "User-Agent": UA,
          "Referer": HOST + "/",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
        }
      });
      var body = res && res.data != null ? String(res.data) : "";
      if (body) return body;
    } catch (e) { /* retry */ }
  }
  return "";
}

async function getText(url) {
  for (var attempt = 0; attempt < 2; attempt++) {
    try {
      var res = await Widget.http.get(url, {
        headers: { "User-Agent": UA, "Referer": HOST + "/" }
      });
      var body = res && res.data != null ? String(res.data) : "";
      if (body) return body;
    } catch (e) { /* retry */ }
  }
  return "";
}

// 列表卡片：<article class="box"> 内 <a class="tip" href title> + <img src>（与猫源 parseCards 同口径）
function parseCards(html) {
  var out = [];
  var seen = {};
  var re = /<article class="box"[\s\S]*?<\/article>/g;
  var m;
  while ((m = re.exec(String(html || "")))) {
    var block = m[0];
    var aM = block.match(/<a[^>]+class="tip"[^>]+href="([^"]+)"[^>]*title="([^"]*)"/i)
      || block.match(/<a[^>]+href="([^"]+)"[^>]*title="([^"]*)"/i);
    if (!aM) continue;
    var href = t(aM[1]);
    if (href.indexOf("/") !== 0 && href.indexOf(HOST) !== 0) continue;
    var path = href.indexOf(HOST) === 0 ? href.slice(HOST.length) : href;
    if (seen[path]) continue;
    seen[path] = 1;
    var imgM = block.match(/<img[^>]+src="([^"]+)"/i);
    var qM = block.match(/<span class="quality[^"]*">([^<]+)<\/span>/i);
    var pic = imgM ? normUrl(t(imgM[1])) : "";
    var name = cleanLabel(aM[2]) || path.replace(/\//g, "");
    out.push({
      id: path,
      type: "url",
      title: name,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: path,
      description: qM ? cleanLabel(qM[1]) : "",
      mediaType: "movie"
    });
  }
  return out;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function archivePath(id, page) {
  if (id === "home" || !id) return page > 1 ? "/page/" + page + "/" : "/";
  return page > 1 ? "/" + id + "/page/" + page + "/" : "/" + id + "/";
}

async function loadList(params) {
  params = params || {};
  var id = t(params.cat || params.id || "home");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var html = await getHtml(archivePath(id, page));
    var list = parseCards(html);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败", description: String((e && e.message) || e).slice(0, 60) }];
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
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  if (page > 1) return [];
  try {
    var html = await getHtml("/?s=" + encodeURIComponent(wd));
    var list = parseCards(html);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败", description: String((e && e.message) || e).slice(0, 60) }];
  }
}

// 详情页播放器 iframe：https://<mee18player.com|meeplayer.com>/play/<40位hex>
// 或 https://upload18.com/play/index/<slug>
function extractPlayer(html) {
  var m = String(html || "").match(/https:\/\/(mee18player\.com|meeplayer\.com)\/play\/([a-f0-9]{32,64})/i);
  if (m) return { kind: "mee", host: m[1].toLowerCase(), token: m[2].toLowerCase() };
  var u = String(html || "").match(/https:\/\/upload18\.com\/play\/index\/([a-z0-9\-\/]+)/i);
  if (u) return { kind: "u18", host: "upload18.com", token: t(u[1]) };
  return null;
}

function masterUrl(host, token) {
  return "https://" + host + "/hlsr2/" + token + "/master";
}

var WORKER = "https://24jav-hls.li768435813.workers.dev";

// b64url（REX 沙箱无 Buffer、无 TextEncoder 保证；master 与 referer 均为纯 ASCII，
// 故用 charCodeAt 逐字节编码即可；与 Worker 侧 b64url 等价）
function b64url(str) {
  str = String(str || "");
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var out = "";
  for (var i = 0; i < str.length; i += 3) {
    var a = str.charCodeAt(i) & 255;
    var b = i + 1 < str.length ? str.charCodeAt(i + 1) & 255 : 0;
    var c = i + 2 < str.length ? str.charCodeAt(i + 2) & 255 : 0;
    out += chars[a >> 2];
    out += chars[((a & 3) << 4) | (b >> 4)];
    out += (i + 1 < str.length) ? chars[((b & 15) << 2) | (c >> 6)] : "=";
    out += (i + 2 < str.length) ? chars[c & 63] : "=";
  }
  return out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

// 24JAV 播放走服务端 Worker（剥 PNG 头）：/m3u8?u=<b64url(master)>&r=<b64url(站方首页)>
function workerUrl(master) {
  return WORKER + "/m3u8?u=" + b64url(master) + "&r=" + b64url(HOST + "/");
}

// upload18 播放页尽力提取：找第一个 .m3u8/.mp4 直链（VM 侧该页回 403 WAF BLOCKED，提不到属实测结论）
function extractU18Stream(html) {
  var s = String(html || "");
  var m = s.match(/https?:\/\/[^\s"'$<>]+\.m3u8[^\s"'$<>]*/i)
    || s.match(/https?:\/\/[^\s"'$<>]+\.mp4[^\s"'$<>]*/i);
  return m ? m[0] : "";
}

// 解析 master 播单的 STREAM-INF 档位（RESOLUTION + 下一行 variant URL）；失败返回空数组
function parseMasterVariants(masterText, base) {
  var lines = String(masterText || "").split(/\r?\n/);
  var out = [];
  for (var i = 0; i < lines.length; i++) {
    var inf = lines[i].match(/#EXT-X-STREAM-INF:[^\n]*RESOLUTION=(\d+)x(\d+)/);
    if (inf && lines[i + 1] && t(lines[i + 1]) && t(lines[i + 1]).charAt(0) !== "#") {
      out.push({ label: inf[2] + "p", h: parseInt(inf[2], 10), url: resolveUrl(t(lines[i + 1]), base) });
    }
  }
  out.sort(function (a, b) { return b.h - a.h; });
  return out;
}

function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

async function loadDetail(link) {
  var raw = unwrapLink(link);
  var path = t(raw);
  if (path.indexOf(HOST) === 0) path = path.slice(HOST.length);
  if (!path || path.charAt(0) !== "/") {
    return { id: t(raw) || "err", type: "url", title: "解析失败", description: "链接为空" };
  }
  var durl = HOST + path;
  try {
    var html = await getHtml(path);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var h1M = html.match(/<h1 class="entry-title"[^>]*>([\s\S]*?)<\/h1>/i);
    var tM = html.match(/<title>(.*?)<\/title>/i);
    var mainTitle = "精彩视频";
    if (h1M) mainTitle = cleanLabel(h1M[1]) || mainTitle;
    else if (tM) mainTitle = cleanLabel(tM[1]).replace(/\s*-\s*24-Jav\.com.*$/i, "").trim() || mainTitle;
    var posterPic = "";
    var ogM = html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (ogM) posterPic = normUrl(t(ogM[1]));
    if (!posterPic) {
      var im = html.match(/<img[^>]+class="[^"]*entry-image[^"]*"[^>]+src="([^"]+)"/i);
      if (im) posterPic = normUrl(t(im[1]));
    }
    var player = extractPlayer(html);
    if (!player) {
      return { id: durl, type: "url", title: mainTitle, coverUrl: posterPic, posterPath: posterPic, backdropPath: posterPic, description: "未找到播放地址" };
    }
    var videoUrl = "";
    var desc = "";
    if (player.kind === "mee") {
      var master = masterUrl(player.host, player.token);
      var masterText = await getText(master);
      var variants = masterText.indexOf("#EXTM3U") >= 0 ? parseMasterVariants(masterText, master) : [];
      // v1.1.1：给 Worker 地址（保 1080p 分离音频轨；档位名仅作描述）。分片为 PNG 包裹的 TS
      // （545 字节 PNG 头 + 真 TS），Worker 服务端剥头后回纯 TS 播单/分片；猫源侧同一问题
      // 已由本地 /proxy/ 代理剥头修复（用户真机确认正常）。
      videoUrl = workerUrl(master);
      desc = variants.length ? ("清晰度：" + variants[0].label + "（单档）") : "自适应";
    } else {
      videoUrl = extractU18Stream(await getHtml("https://upload18.com/play/index/" + player.token));
      desc = videoUrl ? "直链" : "upload18 播放器在当前网络下被 WAF 拦截，暂无播放地址";
    }
    if (!videoUrl) {
      return { id: durl, type: "url", title: mainTitle, coverUrl: posterPic, posterPath: posterPic, backdropPath: posterPic, description: desc || "未找到播放地址" };
    }
    var hdrs = { "User-Agent": UA, "Referer": HOST + "/" };
    var epTitle = "正片";
    var ep = { title: epTitle, videoUrl: videoUrl, episodeNumber: 1, customHeaders: hdrs };
    return {
      id: durl,
      type: "detail",
      title: mainTitle,
      name: mainTitle,
      link: durl,
      posterPath: posterPic,
      coverUrl: posterPic,
      backdropPath: posterPic,
      description: desc,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: hdrs,
      episodes: [{ name: epTitle, link: videoUrl }],
      seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: [ep] }],
      episodeItems: [{
        id: videoUrl,
        type: "url",
        title: epTitle,
        mediaType: "movie",
        posterPath: posterPic,
        videoUrl: videoUrl,
        link: videoUrl,
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1,
        customHeaders: hdrs,
        playerType: "system"
      }]
    };
  } catch (e) {
    return { id: durl, type: "url", title: "请求错误", description: String((e && e.message) || e).slice(0, 60) };
  }
}
