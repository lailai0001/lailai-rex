// 蘑菇视频 for REX (lai_mogu v1.0.3)
// 移植自 mira-cat 蜘蛛 py_mogu.js（只读蓝图），后端 https://moguds.cc。
// v1.0.3（2026-11-07）：与猫源同修——站方分类体系整体重排，按实测 live map 重建为
//   7 大区 60 细分（旧 cate68～cate288 全线失效、旧名大批错位）；修 CDN：
//   d1uy7itup9paqh.cloudfront.net 分发已死（TLS 握手即断），封面与播单改回 dfdf 主线、
//   sxtmo 备选，不再改写为 cloudfront；播单内分片走 d3s00p19cjdhyv.cloudfront.net（实测通）。
//   loadDetail 增加 seasons + episodeItems（单集正片直链）；站方每片只给一条单码率播单
//   （实测无多档切换机制），故不设 1080p/720p 假清晰度选单。字幕：猫源字幕芯是猫源专属，REX 版不接。
// v1.0.4（2026-11-07 第三轮，列表时有时无 + REX 播放解析不出地址）：
//   列表病因与猫源同根——直连腿慢且偶发长 stall（健康 1～8 秒、偶发 >8 秒甚至 20 秒
//   超时），旧 getHtml 先直连、再 Worker，慢腿吃掉超时预算、Worker 兜底够不着；
//   修法与猫源一致：getHtml 改 Worker 优先（mogu-fetch /f 只放行 moguds.cc，列表/
//   详情/搜索文字页实测 16/16、重复请求多 <1 秒）、直连回落、内容校验（>2000 字节
//   且无挑战页才算真 HTML）。
//   播放：模块内无解是旧结论，本轮走 Worker 方案——videoUrl 指到新建 mogu-hls Worker
//   （播单改写 + 分片字节透传，仿 24JAV worker_24jav_hls.js；蘑菇分片是干净 TS、无
//   PNG 包裹头，不剥头；放行 dfdf / sxtmo / cloudfront 三类播单相关域）。Worker 代码
//   见工作目录 worker_mogu_hls.js，需用户手动新建部署（名 mogu-hls）后本模块才生效；
//   部署前 REX 播放仍解析不出地址是已知状态，不断言已修好。
// 分类：7 大区作顶级分类，各区细分走 enumeration 细分参数（对应猫源 filters.sub），
//   默认细分即猫源各区 default；分区与细分名/id 全部照抄猫源 ZONES，不编造。
// 列表：<a href="/video/\d+/"> 卡片，封面统一修成标准 https:// 并走 dfdf 线，绝不出现 d1uy7 cloudfront
//   （站方 data-src 常写 https:/dfdf… 单斜杠，dfdf 与 sxtmo 两线内容逐字节相同）。
// 详情：__ARCHIVE_PLAYER__.rawPath 组直链，相对路径一律接 dfdf 域名；
//   兜底正则/播放变量取到的地址同样经 normUrl 改写，d1uy7 cloudfront 在任何输出里都不出现。
// 播放：单集正片直链 m3u8，附 UA 与 Referer；loadDetail 回 seasons + episodeItems，每集带直接 videoUrl。

WidgetMetadata = {
  id: "lai_mogu",
  title: "蘑菇视频",
  description: "蘑菇视频（moguds.cc）：7 大区 60 细分筛选，详情单集播放（经 mogu-hls Worker 中转）",
  author: "lai",
  version: "1.0.4",
  requiredVersion: "0.0.1",
  site: "https://moguds.cc",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "🔥今日精选", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_featured" }, { name: "sub", title: "细分分类", type: "enumeration", value: "route_home_featured", enumOptions: [{ title: "今日推荐", value: "route_home_featured" }, { title: "X映画原创热播", value: "cate3" }, { title: "X站免费精选内容", value: "cate4" }, { title: "观看热榜", value: "cate5" }, { title: "逆天乱伦", value: "cate6" }, { title: "绿帽龟奴", value: "cate7" }, { title: "走马探花", value: "cate8" }, { title: "网曝黑料大瓜", value: "cate9" }, { title: "明星 AI 换脸", value: "cate10" }, { title: "网红主播激情大秀", value: "cate11" }, { title: "爆款收藏", value: "cate12" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "🎬传媒原创", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_media" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate14", enumOptions: [{ title: "🎬素人自摄", value: "cate14" }, { title: "💿麻豆热剧", value: "cate15" }, { title: "🍬糖心系列", value: "cate16" }, { title: "🍮果冻精选", value: "cate17" }, { title: "👼天使映画", value: "cate18" }, { title: "🌈天美热作", value: "cate19" }, { title: "✨星空夜欲", value: "cate20" }, { title: "🍑蜜桃诱惑", value: "cate21" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "💃网黄", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_creator" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate23", enumOptions: [{ title: "综合网黄", value: "cate23" }, { title: "桥本香菜", value: "cate24" }, { title: "小水水", value: "cate25" }, { title: "刘玥", value: "cate26" }, { title: "Ellie", value: "cate27" }, { title: "米菲兔", value: "cate28" }, { title: "辛尤里", value: "cate29" }, { title: "唐伯虎", value: "cate30" }, { title: "饼干姐姐", value: "cate31" }, { title: "吴梦梦", value: "cate32" }, { title: "台北娜娜", value: "cate33" }, { title: "玩偶姐姐", value: "cate34" }, { title: "柚子猫", value: "cate35" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "🌸日韩", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_asia" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate37", enumOptions: [{ title: "精选推荐", value: "cate37" }, { title: "FC2  无码", value: "cate38" }, { title: "淫妻母狗", value: "cate39" }, { title: "中文字幕", value: "cate40" }, { title: "素人AV", value: "cate41" }, { title: "JK制服", value: "cate42" }, { title: "口爆内射", value: "cate43" }, { title: "师生乱欲", value: "cate44" }, { title: "御姐足交", value: "cate45" }, { title: "家庭禁忌", value: "cate46" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "🗽欧美", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_west" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate48", enumOptions: [{ title: "欧美综合", value: "cate48" }, { title: "欧美辣妹", value: "cate49" }, { title: "欧美巨乳", value: "cate50" }, { title: "欧美熟女", value: "cate51" }, { title: "欧美SM", value: "cate52" }, { title: "欧美足控", value: "cate53" }, { title: "捷克木屋", value: "cate54" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "🎞️动漫", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_anime" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate56", enumOptions: [{ title: "综合动漫", value: "cate56" }, { title: "MMD-热舞系列", value: "cate57" }, { title: "MMD-纯爱3D", value: "cate58" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "📚性爱教学", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_teach" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate60", enumOptions: [{ title: "王竹子的SM教学频道", value: "cate60" }, { title: "中指通一下", value: "cate61" }, { title: "Misa.米砂", value: "cate62" }, { title: "小哥哥艾理", value: "cate63" }, { title: "verzz 异物梗色", value: "cate64" }, { title: "薇傲的性趣", value: "cate65" }, { title: "一三蜜桃说 Dr.Yishan", value: "cate66" }, { title: "Carrie雨千", value: "cate67" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] }
  ]
};

var ZONES = [
  { id: "zone_featured", name: "🔥今日精选", default: "route_home_featured", subs: [{ n: "今日推荐", v: "route_home_featured" }, { n: "X映画原创热播", v: "cate3" }, { n: "X站免费精选内容", v: "cate4" }, { n: "观看热榜", v: "cate5" }, { n: "逆天乱伦", v: "cate6" }, { n: "绿帽龟奴", v: "cate7" }, { n: "走马探花", v: "cate8" }, { n: "网曝黑料大瓜", v: "cate9" }, { n: "明星 AI 换脸", v: "cate10" }, { n: "网红主播激情大秀", v: "cate11" }, { n: "爆款收藏", v: "cate12" }] },
  { id: "zone_media", name: "🎬传媒原创", default: "cate14", subs: [{ n: "🎬素人自摄", v: "cate14" }, { n: "💿麻豆热剧", v: "cate15" }, { n: "🍬糖心系列", v: "cate16" }, { n: "🍮果冻精选", v: "cate17" }, { n: "👼天使映画", v: "cate18" }, { n: "🌈天美热作", v: "cate19" }, { n: "✨星空夜欲", v: "cate20" }, { n: "🍑蜜桃诱惑", v: "cate21" }] },
  { id: "zone_creator", name: "💃网黄", default: "cate23", subs: [{ n: "综合网黄", v: "cate23" }, { n: "桥本香菜", v: "cate24" }, { n: "小水水", v: "cate25" }, { n: "刘玥", v: "cate26" }, { n: "Ellie", v: "cate27" }, { n: "米菲兔", v: "cate28" }, { n: "辛尤里", v: "cate29" }, { n: "唐伯虎", v: "cate30" }, { n: "饼干姐姐", v: "cate31" }, { n: "吴梦梦", v: "cate32" }, { n: "台北娜娜", v: "cate33" }, { n: "玩偶姐姐", v: "cate34" }, { n: "柚子猫", v: "cate35" }] },
  { id: "zone_asia", name: "🌸日韩", default: "cate37", subs: [{ n: "精选推荐", v: "cate37" }, { n: "FC2  无码", v: "cate38" }, { n: "淫妻母狗", v: "cate39" }, { n: "中文字幕", v: "cate40" }, { n: "素人AV", v: "cate41" }, { n: "JK制服", v: "cate42" }, { n: "口爆内射", v: "cate43" }, { n: "师生乱欲", v: "cate44" }, { n: "御姐足交", v: "cate45" }, { n: "家庭禁忌", v: "cate46" }] },
  { id: "zone_west", name: "🗽欧美", default: "cate48", subs: [{ n: "欧美综合", v: "cate48" }, { n: "欧美辣妹", v: "cate49" }, { n: "欧美巨乳", v: "cate50" }, { n: "欧美熟女", v: "cate51" }, { n: "欧美SM", v: "cate52" }, { n: "欧美足控", v: "cate53" }, { n: "捷克木屋", v: "cate54" }] },
  { id: "zone_anime", name: "🎞️动漫", default: "cate56", subs: [{ n: "综合动漫", v: "cate56" }, { n: "MMD-热舞系列", v: "cate57" }, { n: "MMD-纯爱3D", v: "cate58" }] },
  { id: "zone_teach", name: "📚性爱教学", default: "cate60", subs: [{ n: "王竹子的SM教学频道", v: "cate60" }, { n: "中指通一下", v: "cate61" }, { n: "Misa.米砂", v: "cate62" }, { n: "小哥哥艾理", v: "cate63" }, { n: "verzz 异物梗色", v: "cate64" }, { n: "薇傲的性趣", v: "cate65" }, { n: "一三蜜桃说 Dr.Yishan", v: "cate66" }, { n: "Carrie雨千", v: "cate67" }] }
];
var HOST = "https://moguds.cc";
var CDN = "https://dfdf.tjacq.com";
var ALT_CDN = "https://mkdscvxr3w34.sxtmo.com"; // 站方 cdn_lines 第二线；d1uy7 cloudfront 分发已死（2026-11-07 实测 TLS 断），不再使用
// 取数 Worker（2026-11-05 用户已部署：https://mogu-fetch.li768435813.workers.dev，根回 mogu fetch ok）。
// 本轮起 Worker 优先、直连回落（见 getHtml）：Worker 腿实测最稳（分类 16/16、重复请求多 <1 秒）。
var FETCH_WORKER = "https://mogu-fetch.li768435813.workers.dev";
// 播放 Worker（需用户新建部署，名 mogu-hls；代码见工作目录 worker_mogu_hls.js）：
// 播单改写 + 分片字节透传，仿 24JAV 的 24jav-hls；未部署前 videoUrl 指过去会失败，
// 是已知待部署状态——部署步骤见 Worker 文件头注释。
var HLS_WORKER = "https://mogu-hls.li768435813.workers.dev";
// 纯 JS b64url（REX 沙箱无 Buffer/btoa/TextEncoder，与 818/porncgw 修复版同一实现）
var B64T = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64url(s) {
  var bytes = [];
  var str = String(s || "");
  var i, c, c2, cp;
  for (i = 0; i < str.length; i++) {
    c = str.charCodeAt(i);
    if (c < 128) bytes.push(c);
    else if (c < 2048) { bytes.push(192 | (c >> 6), 128 | (c & 63)); }
    else if (c < 55296 || c >= 57344) { bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63)); }
    else {
      i++;
      c2 = str.charCodeAt(i);
      cp = 65536 + (((c & 1023) << 10) | (c2 & 1023));
      bytes.push(240 | (cp >> 18), 128 | ((cp >> 12) & 63), 128 | ((cp >> 6) & 63), 128 | (cp & 63));
    }
  }
  var out = "";
  for (i = 0; i < bytes.length; i += 3) {
    var b0 = bytes[i], b1 = i + 1 < bytes.length ? bytes[i + 1] : 0, b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    out += B64T.charAt(b0 >> 2) + B64T.charAt(((b0 & 3) << 4) | (b1 >> 4)) + (i + 1 < bytes.length ? B64T.charAt(((b1 & 15) << 2) | (b2 >> 6)) : "=") + (i + 2 < bytes.length ? B64T.charAt(b2 & 63) : "=");
  }
  return out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function viaWorker(url) {
  return FETCH_WORKER.replace(/\/+$/, "") + "/f/" + b64url(url);
}
// REX 播放走服务端 Worker：/m3u8?u=<b64url(播单)>&r=<b64url(站方首页)>（同 24JAV 1.1.1 形态）
function workerUrl(master) {
  return HLS_WORKER + "/m3u8?u=" + b64url(master) + "&r=" + b64url(HOST + "/");
}
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function cleanText(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/\s+/g, " ");
}

function absUrl(u, host) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return host + u;
  return u;
}

// 与猫源 normUrl 同口径：只修单斜杠 scheme、不改域名（2026-11-07：d1uy7 cloudfront 分发已死）
function normUrl(u) {
  var s = t(u);
  if (!s) return "";
  // 站方 cdn_lines 常写 https:/dfdf（单斜杠）或 https:///cloudfront（三斜杠），一律压成标准 https://
  s = s.replace(/^(https?:)\/*/, "$1//");
  s = s.replace(/^(https?:)\/([^/])/, "$1//$2");
  if (s.indexOf("dfdf.tjacq.com/") === 0) s = "https://" + s;
  if (s.indexOf("mkdscvxr3w34.sxtmo.com/") === 0) s = "https://" + s;
  return s;
}

function isChallengeHtml(html) {
  var s = String(html || "");
  if (s.length < 200) return false;
  return s.indexOf("Just a moment") >= 0 || s.indexOf("cf-browser-verification") >= 0
    || s.indexOf("Attention Required") >= 0 || s.indexOf("__CF$cv$params") >= 0
    || s.indexOf("challenge-platform") >= 0 || s.indexOf("cf-challenge") >= 0
    || s.indexOf("developers.cloudflare.com") >= 0;
}

async function fetchHtmlOnce(url) {
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
    if (!body) return "";
    return body;
  } catch (e) { return ""; }
}

async function getHtml(path) {
  var url = t(path);
  if (url.indexOf("//") === 0) url = "https:" + url;
  else if (url.charAt(0) === "/") url = HOST + url;
  // Worker 优先（与猫源同因同修）：直连腿慢且偶发长 stall，先直连会把超时预算吃光；
  // Worker 腿实测最稳（分类 16/16、重复请求多 <1 秒）。真页最小 75KB 级模板，短回包不算。
  var via = await fetchHtmlOnce(viaWorker(url));
  if (via && via.length > 2000 && !isChallengeHtml(via)) return via;
  var direct = await fetchHtmlOnce(url);
  if (direct && direct.length > 2000 && !isChallengeHtml(direct)) return direct;
  return direct && !isChallengeHtml(direct) ? direct : "";
}

function extractPic(inner) {
  var attrs = ["data-original", "data-src", "src"];
  for (var ai = 0; ai < attrs.length; ai++) {
    var re = new RegExp(attrs[ai] + "=['\"]([^'\"]+)['\"]", "i");
    var mm = inner.match(re);
    if (mm) {
      var cand = t(mm[1]);
      if (cand) {
        var low = cand.toLowerCase();
        if (low.indexOf("loading.jpg") >= 0 || low.indexOf("loading.png") >= 0 ||
            low.indexOf("placeholder") >= 0 || low.indexOf("default") >= 0) continue;
        if (cand.charAt(0) === "/") return CDN + cand;
        return cand;
      }
    }
  }
  return "";
}

function parseCards(html, host) {
  var items = [];
  var seen = {};
  var re = /<a[^>]+href=["'](\/video\/\d+\/?)["'][^>]*>([\s\S]*?)<\/a>/g;
  var m;
  while ((m = re.exec(String(html || "")))) {
    var vUrl = t(m[1]);
    var inner = m[2];
    if (seen[vUrl]) continue;
    var pic = extractPic(inner);
    var title = "";
    var tM = inner.match(/(?:title=["']([^"']+)["']|alt=["']([^"']+)["']|<h\d[^>]*>([\s\S]*?)<\/h\d>)/i);
    if (tM) title = cleanText(tM[1] || tM[2] || tM[3] || "");
    if (!title) {
      var lines = cleanText(inner).split(/\s+/);
      for (var li = 0; li < lines.length; li++) {
        if (lines[li].length > 3) { title = lines[li]; break; }
      }
    }
    var durM = inner.match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
    if (vUrl && (pic || title)) {
      seen[vUrl] = 1;
      items.push({
        id: vUrl,
        type: "url",
        title: title || "蘑菇精彩视频",
        posterPath: pic ? normUrl(pic.indexOf("http") === 0 ? pic : absUrl(pic, host)) : "",
        coverUrl: pic ? normUrl(pic.indexOf("http") === 0 ? pic : absUrl(pic, host)) : "",
        backdropPath: pic ? normUrl(pic.indexOf("http") === 0 ? pic : absUrl(pic, host)) : "",
        link: vUrl,
        description: durM ? durM[1] : "",
        mediaType: "movie"
      });
    }
  }
  return items;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function findZone(zoneId) {
  for (var i = 0; i < ZONES.length; i++) {
    if (ZONES[i].id === zoneId) return ZONES[i];
  }
  return null;
}

async function loadList(params) {
  params = params || {};
  var zoneId = t(params.zone || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var zone = findZone(zoneId);
  var target = t(params.sub || "");
  if (!target) target = zone ? zone.default : zoneId;
  if (!target) return emptyItem();
  var path = "";
  if (target === "route_home_featured") {
    path = page === 1 ? "/" : ("/page/" + page + "/");
  } else {
    path = page === 1 ? ("/category/" + target + "/") : ("/category/" + target + "/" + page + "/");
  }
  try {
    var html = await getHtml(path);
    var list = parseCards(html, HOST);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
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
  var path = page === 1 ? ("/search/" + encodeURIComponent(wd) + "/") : ("/search/" + encodeURIComponent(wd) + "/" + page + "/");
  try {
    var html = await getHtml(path);
    var list = parseCards(html, HOST);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function cleanStreamUrl(raw) {
  if (!raw) return "";
  var s = String(raw).replace(/\\u002F/g, "/").replace(/\\\//g, "/").trim();
  var m = s.match(/https?:\/\/[^\s"'$<>]+\.m3u8[^\s"'$<>]*/i);
  if (m) return m[0];
  m = s.match(/https?:\/\/[^\s"'$<>]+\.mp4[^\s"'$<>]*/i);
  if (m) return m[0];
  return s;
}

function extractPlayerVarUrl(html, varName) {
  var re = new RegExp("var\\s+" + varName + "\\s*=\\s*(\\{[\\s\\S]*?\\});");
  var m = String(html || "").match(re);
  if (!m) return "";
  try {
    var obj = JSON.parse(m[1]);
    if (obj && obj.url) return cleanStreamUrl(String(obj.url));
  } catch (e) { /* ignore */ }
  var um = m[1].match(/["']url["']\s*:\s*["']([^"']*)["']/);
  if (um) return cleanStreamUrl(um[1]);
  return "";
}

function extractPlayStream(html) {
  var m = html.match(/id=["']article-videos["'][^>]*data-url=["']([^"']+)["']/i)
    || html.match(/data-url=["']([^"']+)["'][^>]*id=["']article-videos["']/i);
  if (m) {
    var cand = t(m[1]).replace(/\\u002F/g, "/").replace(/\\\//g, "/");
    if (cand.indexOf("//") === 0) cand = "https:" + cand;
    else if (cand.charAt(0) === "/") cand = CDN + cand;
    else if (cand.indexOf("http") !== 0) cand = ALT_CDN + "/" + cand;
    return normUrl(cand);
  }
  m = html.match(/(?:var\s+raw\s*=\s*|video_url\s*:\s*|url\s*:\s*)["'](https?:\/\/[^\s"'$<>]+\.m3u8[^\s"'$<>]*)["']/i);
  if (m) return normUrl(m[1].replace(/\\u002F/g, "/").replace(/\\\//g, "/"));
  m = html.match(/https?:\/\/[^\s"'$<>]+\.m3u8[^\s"'$<>]*/i);
  if (m) return normUrl(m[0].replace(/\\u002F/g, "/").replace(/\\\//g, "/"));
  m = html.match(/https?:\/\/[^\s"'$<>]+\.mp4[^\s"'$<>]*/i);
  if (m) return normUrl(m[0].replace(/\\u002F/g, "/").replace(/\\\//g, "/"));
  return "";
}

function parseCdnLines(html) {
  var bases = [];
  var m = String(html || "").match(/cdn_lines\s*=\s*'([^']+)'/);
  if (m) {
    try {
      var arr = JSON.parse(m[1].replace(/\\\//g, "/"));
      for (var i = 0; i < (arr || []).length; i++) {
        var b = normUrl(String((arr[i] && arr[i].cdnLine) || "").replace(/\/+$/, ""));
        if (b.indexOf("http") === 0 && bases.indexOf(b) < 0) bases.push(b);
      }
    } catch (e) { /* ignore */ }
  }
  if (bases.indexOf("https://dfdf.tjacq.com") < 0) bases.push("https://dfdf.tjacq.com");
  if (bases.indexOf(ALT_CDN) < 0) bases.push(ALT_CDN);
  return bases;
}

function pickPlayBase(bases) {
  var list = Array.isArray(bases) ? bases : [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].indexOf("dfdf.tjacq.com") >= 0) return list[i];
  }
  return list[0] || ALT_CDN;
}

// 2026-11-05 站方详情页改版：#article-videos 已消失，播放器改由
// window.__ARCHIVE_PLAYER__ = {"rawPath":"\/video\/<日期>\/<id>\/<hash>.m3u8", ...}
// 提供播单相对路径；rawPath 接 CDN 基址（优先 cdn_lines 的 dfdf 线）即为播单。
function unescJsonStr(s) {
  return String(s || "").replace(/\\u002F/g, "/").replace(/\\\//g, "/").replace(/\\"/g, '"');
}

function extractArchivePlayer(html) {
  var out = { rawPath: "", cdnLine: "", posterImg: "", vttFile: "" };
  var m = String(html || "").match(/window\.__ARCHIVE_PLAYER__\s*=\s*\{/);
  if (!m) return out;
  var seg = String(html || "").slice(m.index, m.index + 4000);
  var rp = seg.match(/"rawPath"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (rp) out.rawPath = unescJsonStr(rp[1]);
  var cl = seg.match(/"cdnLine"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (cl) out.cdnLine = unescJsonStr(cl[1]);
  var pi = seg.match(/"posterImg"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (pi) out.posterImg = unescJsonStr(pi[1]);
  var vf = seg.match(/"vttFile"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (vf) out.vttFile = unescJsonStr(vf[1]);
  return out;
}

function archivePlayUrl(html) {
  var ap = extractArchivePlayer(html);
  if (!ap.rawPath) return "";
  var raw = ap.rawPath.replace(/^\s+|\s+$/g, "");
  if (!raw) return "";
  if (raw.indexOf("http") === 0) return normUrl(raw);
  if (raw.indexOf("//") === 0) return normUrl("https:" + raw);
  var bases = parseCdnLines(html);
  var base = pickPlayBase(bases);
  if (ap.cdnLine) base = normUrl(ap.cdnLine);
  if (!base) base = ALT_CDN;
  return normUrl(base.replace(/\/+$/, "") + (raw.charAt(0) === "/" ? raw : "/" + raw));
}

function detailPath(link) {
  var s = t(link);
  if (!s) return "";
  var m = s.match(/\/video\/\d+\/?/);
  if (m) return m[0];
  return s;
}

async function loadDetail(link) {
  try {
    var path = detailPath(link);
    if (!path) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var durl = path.indexOf("http") === 0 ? path : HOST + path;
    var html = await getHtml(path);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var tM = html.match(/<title>(.*?)<\/title>/i);
    var mainTitle = "高清视频";
    if (tM) mainTitle = t(tM[1]).replace(/\s*[-_]\s*蘑菇视频\s*$/i, "") || "高清视频";
    // 新版详情优先走 __ARCHIVE_PLAYER__；旧解析（article-videos / 播放变量 / 裸 m3u8）留作兜底
    var playUrl = archivePlayUrl(html);
    if (!playUrl) {
      playUrl = extractPlayStream(html);
      if (!playUrl) {
        var v = extractPlayerVarUrl(html, "player_aaaa") || extractPlayerVarUrl(html, "player_data");
        if (v) playUrl = normUrl(v);
      }
    }
    var posterPic = "";
    var ap0 = extractArchivePlayer(html);
    if (ap0.posterImg) posterPic = normUrl(ap0.posterImg);
    var dfdf = String(html).match(/dfdf\.tjacq\.com\/image\/[^\s"']+/g);
    if (dfdf && dfdf.length) posterPic = normUrl("https://" + dfdf[0]);
    if (!posterPic) {
      var ogM = html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
      if (ogM) posterPic = normUrl(t(ogM[1]));
    }
    if (!playUrl) {
      return { id: durl, type: "url", title: mainTitle, description: "未找到播放地址", coverUrl: posterPic, posterPath: posterPic, backdropPath: posterPic };
    }
    // 播放经 mogu-hls Worker 中转（播单改写 + 分片字节透传）；Worker 未部署前此地址不通，见文件头
    var playViaWorker = workerUrl(playUrl);
    return {
      id: durl,
      type: "detail",
      title: mainTitle,
      link: durl,
      posterPath: posterPic,
      coverUrl: posterPic,
      backdropPath: posterPic,
      videoUrl: playViaWorker,
      playerType: "app",
      customHeaders: { "User-Agent": UA, "Referer": HOST + "/" },
      seasons: [{ seasonId: "1", seasonName: "正片" }],
      episodeItems: [{ seasonId: "1", episodeId: "1", episodeName: "正片", videoUrl: playViaWorker, customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }]
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
