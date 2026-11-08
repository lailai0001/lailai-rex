// JavHey for REX (lai_javhey v1.0.0)
// v1.0.8：loadDetail 加 unwrapLink（卡片对象入参断链修好，见 repro_javhey107.log：
//   对象入参 4ms 死于 "[object Object]"，字符串入参全通）；播放行 playerType "app"->"system"
//   （24jav 1.1.1 / chaturbate 2.0.3 同款）；详情有直链时按 24jav 结构补 episodes /
//   seasons / episodeItems。LuluStream 路实测全通，一字未动。
// v1.0.9：详情回全量线路（用户 06:08 验收：详情页必须出现全部线路的可选入口，点哪条播哪条）。
//   1.0.8 只回 1 集“正片”（首个有流即停，jsubindo 已解出的流被丢、bysebuho/playmogo 整条消失），
//   唯一那条线在设备上不通就报“解析不出地址”，且无别的线可点。1.0.9 顺序现解全部 embed
//   （luluvido 仍排最前），每条线一集：已解出直链的集内带 videoUrl + playerType system；
//   解不出的线也留名（link 为 @@EMBED:，点它由 loadResource 只解这一条线，仍解不出回 [] 报解不出，
//   不交嗅探卡）。loadResource 的 @@EMBED: 分支不再串扰到别的 Server。
//   jsubindo 例外：其 m3u8 为短签（现取 200、放 20 秒 403、复取 403，见 probe_jsubindo*.log），
//   详情直链出到点播时必死，故 jsubindo 线只出懒解析入口，点播时 loadResource 现解新鲜签名；
//   顶层 videoUrl 也只取 luluvido（token 8 小时）。
//   jsubindo 行的 customHeaders 只带 UA（probe_jsubindo5/6.log：播单 UA-only 新鲜取 200、10 秒后
//   仍 200；分片 UA-only 取到 200 纯 TS，但播单后首取分片有一次 403、立即重取才 200——
//   站方侧首取抖动，播放器重取能过；模块侧无法代劳，真机以播放器重取行为为准）。
// v1.1.0：换思路彻底重写播放链（用户 2026-11-08 07:06 令，1.0.9 VM 全绿、真机仍死）。
//   坐实的新病因（probe_tnmr2.log）：主线 luluvido 上游 tnmr.org 按 UA 放行——
//   master/媒体清单/AES 密钥/分片四级全部只认桌面 Chrome UA，iPhone Safari UA、
//   iOS 播放器真实 UA（AppleCoreMedia）、无头一律 403；模块的 customHeaders 桌面 UA
//   只有播放器透传头时才有效，而 sextb F4 已坐实播放器不透传头到分片请求。
//   jsubindo 同理：播单只有桌面 UA-only 才 200，iPhone/CoreMedia/无头/桌面 UA+
//   站根 Referer 全部 403。直链路在手机上结构性死亡，必须走 Worker 改写。
//   次因：1.0.9 详情顺序现解 4 条 embed，每条约 2.5-2.8 秒，详情 11-14 秒；
//   bysebuho（JS SPA 壳，无静态流）与 playmogo（DoodStream + Turnstile 墙）
//   各烧 2.5 秒且回 0 条流，纯浪费。
//   新链（24jav 1.1.1 / chaturbate 2.0.3 / javcc 1.0.2 / sextb-hls v4 同款模式，
//   手机上已确认好）：详情只调一次 Worker /resolve（约 2-4 秒）拿标题/封面/全量线；
//   可播线（luluvido/jsubindo）的 videoUrl 即 Worker /v 懒解析地址，点播时 Worker
//   现解新鲜签名、改写播单，播放器只跟 Worker 说话、零自定义头；死线留名 +
//   @@EMBED: 入口，点它由 loadResource 先验 Worker /v（有 #EXTM3U 才出线，
//   否则回 [] 报解不出），Worker 不通时回落 legacy 直连解法。
//   Worker：javhey-hls v1（javhey-hls-worker-v1.js，未部署，需用户手动部署到
//   https://javhey-hls.li768435813.workers.dev/；部署前不要推包）。
// v1.1.1：按猫源对照表修（用户 2026-11-08 13:30 令，1.1.0 VM 全绿、真机仍报“解析不出来地址”）。
//   探针坐实（probe_live*_111.log）：①包与 Worker 侧都没错——final.rex 直连/ghfast 双双
//   md5 f4b33e97、模块 md5 11fb2c6e 已翻转；已部署的 javhey-hls v1 根路径 v1、/diag 全绿、
//   /resolve 仅 0.4 秒；luluvido 主线 /v→媒体清单→首分片全链路通（两部新片）。
//   故“依旧”最可能 = 用户手机上仍是旧包（未删旧包重导）或 Worker 域名手机侧不通，
//   见 REPORT.md 鉴别项，模块侧无法代劳。② jsubindo 备线 v1 分片全死的新病因坐实：
//   分片不要 UA-only、不要 Referer=embed，只要 Referer=<播单 URL 本身>（新鲜链：
//   UA-only 403、Referer=embed 403、Referer=播单 200/680748B 纯 TS）；修在 Worker v2
//   （/s 的 &p= 参数 + 分片头重试），模块侧不动。③ Server 1 是 *subindo.* 家族：
//   新片 8 抽里 jsubindo.xyz/.online、usubindo.space、avsubindo.site、javsubindo.world、
//   jsubindo.space 轮换出现，1.1.0 的 /jsubindo\./ 只认其中两种——usubindo /v 因带
//   Referer 直接 502，avsubindo 详情里被标成死线（/v 本身能通）。本版把家族识别扩到
//   /subindo\./（模块 isJsubindo、workerLinePlayable；Worker v2 同改 + 播单/分片重试）。
//   ④ 老片（分类/最多观看）确有 9-12 条线（猫源注释的 12 Server 属实；新片只有 4 条），
//   含 vidhide 系 morencius/hgplaycdn/vidhidepre/embedwish/dhtpre（packer a=36，
//   解包后 hls3 .txt 主清单）与 luluvdo.com（STARS-247 实测 /v+首分片全绿）；
//   1.1.0 只把 luluvido/jsubindo 标可播，老片主播按钮常无 videoUrl。
//   本版把 luluv*、subindo 家族、vidhide 系五宿主都标可播（videoUrl 仍是 Worker /v
//   懒解析地址，点播时 Worker 现解；解不出的线点它仍走 @@EMBED: 验 /v→legacy→[]）。
//   ⑤ unpackVidhide 改正经 base-a 解码（Worker unpackDeanEdwards 同款，a=36 时与旧版
//   行为一致；旧 parseInt(w,a) 在 a>36 时恒回 NaN，a=62 的 packer 会整段解不出）。
//   依赖：usubindo 修正在 Worker v2 里——先部署 v2 再推本版（v1 下 usubindo 线点播
//   仍 502；其余线不受影响）。Worker v2 代码随报告交回，未部署。
//   ⑥ loadResource 的 Worker 直出分支改为先验 /v（有 #EXTM3U 才出线，
//   否则从 /v 的 u= 参数取 embed 走 legacy 直连，仍无流回 []）：1.1.0 是不验直接出线，
//   Worker 回 502 的线也会把 502 地址交给播放器转圈或报“解析不出来地址”；
//   先验后本版在 v1 下也不退化（usubindo 回落 legacy，与 1.1.0 同行为），
//   v2 部署后 usubindo 走 Worker 全通。
// 移植自 mira-cat 蜘蛛 py_javhey.js（只读蓝图），后端 https://javhey.com/。
// 印尼语 JAV 字幕站，标题/别名均含番号（如 JUL-788、SONE-054）。
// 列表：首页卡片 <a href="/video/<id>/<slug>"><img src alt></a>，封面为 javmod.com/javorb.com 直链。
// 分类：/category/<id>/<slug>/，翻页 /category/<id>/<slug>/page=N；首页翻页 /videos/paling-baru/page=N；
//   注意分类页 p1 必须无尾斜杠（带尾斜杠站方回 404）。
// 详情：隐藏 input#links 为 base64 编码的 embed 列表（",,," 分隔；新片 4 个 Server，
//   老片 9-12 个 Server）；Server 1 为 *subindo.* 家族（页内 var src 直出 m3u8 相对路径）；
//   vidhide 系 embed 为 Dean Edwards packer 混淆，解包后 links.hls3（.txt 主清单，猫源 VM 实测 200 + #EXTM3U）
//   > links.hls2（.m3u8 主清单，VM 侧因出口 IP 被 CDN 回 403，设备侧未证实）> links.hls4。
// 播放：单码率（猫源实测 embedwish 852x480 一档；vidhide 档位标签 720p），不编假多档；各 Server 画质可能不同，故按 Server 分开展示。
// v1.0.2：jsubindo 直连 + 仅 UA（不带 Referer）。实测：hls-relay 的 Cloudflare 出口
//   取 jsubindo 播单 10/10 回 502（站方拦 CF 出口）；且 jsubindo 分片对 Referer 时好时坏，
//   播单只靠浏览器 UA 即可 200。1.0.0 带 Referer、1.0.1 走 relay 都死，故 jsubindo 改直连
//   只带 UA；其它源（vidhide 等，分片须 Referer）仍走 relay。
// v1.0.1：详情时解出的直链不再存入 episodes（jsubindo 签名短效，详情时取的到播放时已过期），
//   只存 Server 顺序与清晰度名，play 时经 @@EMBED: 重解拿新鲜签名；解出的流一律经 hls-relay
//   中转（分片须带 Referer，REX 播放器不转发 customHeaders 到分片请求，直出必死）。
// 搜索：站内搜索表单 action="/search"，但实测 /search?q=<任意词>（含无意义词）均原样返回首页 72 项，未做过滤——
//   故 search 不假装有结果，只回一条说明。字幕：猫源字幕芯是猫源专属，REX 版不接。

WidgetMetadata = {
  id: "lai_javhey",
  title: "JavHey",
  description: "JavHey（javhey.com）：印尼语 JAV 字幕站，26 分类 + 多 Server 播放",
  author: "lai",
  version: "1.1.1",
  requiredVersion: "0.0.1",
  site: "https://javhey.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "🆕最新视频", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🔥最多观看", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "most" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🎬无码 / 去码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat" }, { name: "cat", title: "分类", type: "enumeration", value: "76/uncensored", enumOptions: [{ title: "无码流出", value: "76/uncensored" }, { title: "无码破解", value: "31/decensored" }, { title: "去码", value: "222/sensor-dihapus" }, { title: "有码", value: "2/censored" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "👙身材精选", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat" }, { name: "cat", title: "分类", type: "enumeration", value: "1/big-tits", enumOptions: [{ title: "巨乳", value: "1/big-tits" }, { title: "巨乳 (印尼)", value: "219/toket-gede" }, { title: "爆乳", value: "15/super-milk" }, { title: "美乳", value: "50/beautiful-breasts" }, { title: "巨乳癖", value: "48/busty-fetish" }, { title: "大屁股", value: "20/big-butt" }, { title: "大屁股 (印尼)", value: "231/pantat-besar" }, { title: "臀部癖", value: "41/ass-fetish" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🎭题材剧情", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat" }, { name: "cat", title: "分类", type: "enumeration", value: "3/creampie", enumOptions: [{ title: "中出", value: "3/creampie" }, { title: "熟女", value: "11/mature-woman" }, { title: "乱伦", value: "10/incest" }, { title: "人妻", value: "9/housewife" }, { title: "阿姨", value: "24/aunt" }, { title: "女教师", value: "59/female-teacher" }, { title: "女学生", value: "42/schoolgirl" }, { title: "口交", value: "33/blowjob" }, { title: "淫荡", value: "14/slut" }, { title: "Cosplay", value: "127/cosplay" }, { title: "女同", value: "152/lesbian" }, { title: "BDSM", value: "67/bdsm" }, { title: "数码马赛克", value: "4/digital-mosaic" }, { title: "高清", value: "5/high-vision" }] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://javhey.com";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

// hls-relay 中转（与 818 relay 同构的通用 HLS 中转；须用户部署为 hls-relay.li768435813.workers.dev）。
// 密钥 RELAY_KEY 须与 Worker 里的常量一致（部署时可改，改完模块同步改）。
var RELAY = "https://hls-relay.li768435813.workers.dev";
var RELAY_KEY = "lai-hls-1";
// javhey-hls Worker v1：/resolve（详情解码）/v（单线现解+改写播单）/p（播单改写）/s（分片/密钥透传）
var WORKER = "https://javhey-hls.li768435813.workers.dev";
// 纯 JS base64url（REX 沙箱无 Buffer/btoa 保证）：先手动 UTF-8 编码再查表
var B64CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function utf8Bytes(s) {
  var bytes = [];
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    if (c < 128) {
      bytes.push(c);
    } else if (c < 2048) {
      bytes.push(192 | (c >> 6), 128 | (c & 63));
    } else if (c >= 55296 && c < 57344 && i + 1 < s.length) {
      var c2 = s.charCodeAt(i + 1);
      if (c2 >= 56320 && c2 < 57344) {
        var cp = 65536 + ((c - 55296) << 10) + (c2 - 56320);
        bytes.push(240 | (cp >> 18), 128 | ((cp >> 12) & 63), 128 | ((cp >> 6) & 63), 128 | (cp & 63));
        i++;
      } else {
        bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
      }
    } else {
      bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
    }
  }
  return bytes;
}
function b64url(str) {
  var bytes = utf8Bytes(String(str));
  var out = "";
  for (var i = 0; i < bytes.length; i += 3) {
    var b0 = bytes[i];
    var b1 = (i + 1 < bytes.length) ? bytes[i + 1] : 0;
    var b2 = (i + 2 < bytes.length) ? bytes[i + 2] : 0;
    out += B64CHARS.charAt(b0 >> 2);
    out += B64CHARS.charAt(((b0 & 3) << 4) | (b1 >> 4));
    out += (i + 1 < bytes.length) ? B64CHARS.charAt(((b1 & 15) << 2) | (b2 >> 6)) : "=";
    out += (i + 2 < bytes.length) ? B64CHARS.charAt(b2 & 63) : "=";
  }
  return out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function relayCtx(o) {
  o = o || {};
  o.k = RELAY_KEY;
  return b64url(JSON.stringify(o));
}
function relayPlaylistUrl(streamUrl, referer) {
  return RELAY + "/p/" + b64url(streamUrl) + "/" + relayCtx({ r: referer });
}

// jsubindo 系直连入口：只带浏览器 UA，不带 Referer（见文件头 v1.0.2 说明）。
// v1.1.1：Server 1 是 *subindo.* 家族（jsubindo/usubindo/avsubindo/javsubindo），不再只认 jsubindo.。
function isJsubindo(u) { return /subindo\./i.test(String(u || "")); }
// v1.0.4：全部直连 + UA+Referer（照猫源 play() 的路子），不再走 relay。
// relay 对 JavHey 的上游全军覆没（jsubindo 10/10 502、其它源也 502）；而猫源
// 直出同一批流 + {UA, Referer} 在设备上能播，xnxx 也证实 REX 播直连 + {UA, Referer}。
function streamEntry(url, name, referer) {
  // referer === ""：只带 UA，不带 Referer（jsubindo 专用，见 v1.0.2 注释与 probe_jsubindo5/6.log）；
  // 不传则默认站根 Referer（luluvido 等线）。
  var hdrs = { "User-Agent": UA };
  if (referer === "") { /* UA only */ }
  else { hdrs["Referer"] = referer || HOST + "/"; }
  return [{ name: name, url: url, playerType: "system", customHeaders: hdrs }];
}

// 分类：全部取自站内 /categories 实测（id/slug/名均原文）；中文名为用户点名近义项的诚实映射
var CATS = [
  { v: "76/uncensored", n: "无码流出" },
  { v: "31/decensored", n: "无码破解" },
  { v: "222/sensor-dihapus", n: "去码" },
  { v: "1/big-tits", n: "巨乳" },
  { v: "219/toket-gede", n: "巨乳 (印尼)" },
  { v: "15/super-milk", n: "爆乳" },
  { v: "50/beautiful-breasts", n: "美乳" },
  { v: "48/busty-fetish", n: "巨乳癖" },
  { v: "20/big-butt", n: "大屁股" },
  { v: "231/pantat-besar", n: "大屁股 (印尼)" },
  { v: "41/ass-fetish", n: "臀部癖" },
  { v: "2/censored", n: "有码" },
  { v: "4/digital-mosaic", n: "数码马赛克" },
  { v: "3/creampie", n: "中出" },
  { v: "11/mature-woman", n: "熟女" },
  { v: "10/incest", n: "乱伦" },
  { v: "9/housewife", n: "人妻" },
  { v: "24/aunt", n: "阿姨" },
  { v: "59/female-teacher", n: "女教师" },
  { v: "42/schoolgirl", n: "女学生" },
  { v: "33/blowjob", n: "口交" },
  { v: "14/slut", n: "淫荡" },
  { v: "127/cosplay", n: "Cosplay" },
  { v: "152/lesbian", n: "女同" },
  { v: "67/bdsm", n: "BDSM" },
  { v: "5/high-vision", n: "高清" }
];

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

function absUrl(u, host) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return host + u;
  return u;
}

function normUrl(u) {
  var s = t(u);
  if (!s) return "";
  s = s.replace(/^(https?:)\/([^/])/, "$1//$2");
  return s;
}

async function getHtml(path, referer) {
  var url = t(path);
  if (url.indexOf("//") === 0) url = "https:" + url;
  else if (url.charAt(0) === "/") url = HOST + url;
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Referer": referer || HOST + "/",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
      }
    });
    var body = res && res.data != null ? String(res.data) : "";
    return body;
  } catch (e) { return ""; }
}

async function reqRaw(url, referer) {
  try {
    var res = await Widget.http.get(url, {
      headers: { "User-Agent": UA, "Referer": referer || HOST + "/" }
    });
    var body = res && res.data != null ? String(res.data) : "";
    return { status: (res && res.status) || 0, body: body };
  } catch (e) { return { status: 0, body: "" }; }
}

// 首页/分类卡片：<a href="/video/<id>/<slug>"><img src alt></a>；alt 含 "JAV Subtitle Indonesia - <番号> <印尼语标题>"
function parseCards(html, host) {
  var byUrl = {};
  var order = [];
  var re = /<a[^>]+href=["'](\/video\/\d+\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/g;
  var m;
  while ((m = re.exec(String(html || "")))) {
    var vUrl = t(m[1]);
    var inner = m[2];
    var it = byUrl[vUrl];
    if (!it) { it = { id: vUrl, type: "url", title: "", posterPath: "", coverUrl: "", backdropPath: "", link: vUrl, description: "", mediaType: "movie" }; byUrl[vUrl] = it; order.push(vUrl); }
    var imgM = inner.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (imgM && !it.posterPath) {
      var pic = normUrl(absUrl(t(imgM[1]), host));
      it.posterPath = pic; it.coverUrl = pic; it.backdropPath = pic;
    }
    var altM = inner.match(/alt=["']([^"']+)["']/i);
    var txt = cleanLabel(altM ? altM[1] : inner);
    if (txt && !it.title) it.title = txt.replace(/^JAV Subtitle Indonesia\s*-\s*/i, "");
    // alt 常被标题内的双引号截断成 bare 番号（如 "ATID-710"）：此时用 URL slug 补全标题
    if (!it.title || /^[A-Z0-9]{2,10}-\d{2,8}$/i.test(it.title)) {
      var slug = (vUrl.split("/")[3] || "").replace(/^[a-z0-9]{2,10}-\d{2,8}-/i, "").replace(/-/g, " ").trim();
      if (slug) it.title = (it.title ? it.title + " " : "") + slug;
    }
    if (!it.title) it.title = "精彩视频";
  }
  var out = [];
  for (var i = 0; i < order.length; i++) {
    var item = byUrl[order[i]];
    if (item.posterPath || item.title) out.push(item);
  }
  return out;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "home");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var path = "";
  if (zone === "most") {
    path = page === 1 ? "/videos/paling-dilihat" : ("/videos/paling-dilihat/page=" + page);
  } else if (zone === "cat") {
    var cat = t(params.cat || "");
    if (!cat) return emptyItem();
    path = page === 1 ? ("/category/" + cat) : ("/category/" + cat + "/page=" + page);
  } else {
    path = page === 1 ? "/" : ("/videos/paling-baru/page=" + page);
  }
  try {
    var html = await getHtml(path);
    var list = parseCards(html, HOST);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

async function search(params) {
  // 站内搜索未做过滤（任意查询均返回首页），返回说明，不伪造结果
  return [{ id: "tip", type: "url", title: "站内搜索未做过滤，暂不支持搜索，请用分类浏览" }];
}

// ---- embed 解析 ----
// 纯 JS base64 解码（REX 沙箱无 Buffer / TextDecoder，不依赖 atob）
function b64decode(b64) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var s = String(b64 || "").replace(/[^A-Za-z0-9+/=]/g, "");
  var out = "";
  var i = 0;
  while (i < s.length) {
    var c1 = chars.indexOf(s.charAt(i++));
    var c2 = chars.indexOf(s.charAt(i++));
    var c3 = chars.indexOf(s.charAt(i++));
    var c4 = chars.indexOf(s.charAt(i++));
    if (c1 < 0 || c2 < 0) break;
    var n = (c1 << 18) | (c2 << 12) | ((c3 & 63) << 6) | (c4 & 63);
    out += String.fromCharCode((n >> 16) & 255);
    if (c3 !== 64 && c3 >= 0) out += String.fromCharCode((n >> 8) & 255);
    if (c4 !== 64 && c4 >= 0) out += String.fromCharCode(n & 255);
  }
  // base64 的字节流是 UTF-8：还原多字节字符（无 TextDecoder 的手工解码）
  var utf8 = "";
  var j = 0;
  while (j < out.length) {
    var b = out.charCodeAt(j);
    if (b < 128) { utf8 += out.charAt(j); j += 1; }
    else if (b > 191 && b < 224 && j + 1 < out.length) {
      utf8 += String.fromCharCode(((b & 31) << 6) | (out.charCodeAt(j + 1) & 63)); j += 2;
    } else if (b > 223 && b < 240 && j + 2 < out.length) {
      utf8 += String.fromCharCode(((b & 15) << 12) | ((out.charCodeAt(j + 1) & 63) << 6) | (out.charCodeAt(j + 2) & 63)); j += 3;
    } else { utf8 += out.charAt(j); j += 1; }
  }
  return utf8;
}

// vidhide 系 packer 解包：eval(function(p,a,c,k,e,d){while(c--)if(k[c])p=p.replace(...)}('...',a,c,'...'.split('|')))
function unpackVidhide(html) {
  var m = String(html || "").match(/eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?return p\}\('([\s\S]*?)',(\d+),(\d+),'(.*?)'\.split\('\|'\)/);
  if (!m) return "";
  var p = m[1];
  var a = parseInt(m[2], 10);
  var c = parseInt(m[3], 10);
  var k = m[4].split("|");
  if (!a || !c || !k.length) return "";
  // v1.1.1：正经 base-a 解码（Worker unpackDeanEdwards 同款）。旧写法 parseInt(w, a)
  // 在 a>36 时恒回 NaN（parseInt 只认 2-36 进制）；实测 vidhide 用 a=36 故一直能用，
  // 但 a=62 的 packer 会整段解不出。a=36 时与旧版行为一致（合成载荷双向验过）。
  var digits = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  function enc(n) {
    var s2 = "";
    do { s2 = digits.charAt(n % a) + s2; n = Math.floor(n / a); } while (n > 0);
    return s2;
  }
  var out = p;
  for (var ii = c - 1; ii >= 0; ii--) {
    if (k[ii]) {
      var word = k[ii];
      out = out.replace(new RegExp("\\b" + enc(ii) + "\\b", "g"), function () { return word; });
    }
  }
  // 解包文本里引号常带反斜杠转义（qualityLabels\':{\"616\":\"720p\"}），先还原再提取
  return out.replace(/\\(['"])/g, "$1");
}

function embedHostLabel(embedUrl) {
  var h = "";
  try {
    var hm = String(embedUrl).match(/^https?:\/\/([^/]+)/);
    h = hm ? hm[1].replace(/^www\./, "") : "";
  } catch (e) { h = ""; }
  var map = { "javsubindo.world": "JavSubIndo", "embedwish.com": "EmbedWish", "vidhidepre.com": "VidHide", "morencius.com": "Morencius", "hgplaycdn.com": "HgPlay", "dhtpre.com": "DhtPre", "luluvdo.com": "LuluVdo", "dood.li": "Dood", "dropload.io": "Dropload", "mixdrop.to": "MixDrop", "bestx.stream": "BestX", "d000d.com": "D000D" };
  return map[h] || h || "Server";
}

// 解析单个 embed 页，返回直链候选 [{url, label}]（label 仅当解包给出 qualityLabels 时才有，绝不编造）
async function resolveEmbed(embedUrl, referer) {
  var out = [];
  function push(url, label) {
    url = normUrl(t(url));
    if (!url || !/^https?:\/\//.test(url)) return;
    for (var i = 0; i < out.length; i++) { if (out[i].url === url) return; }
    out.push({ url: url, label: label || "" });
  }
  var r = await reqRaw(embedUrl, referer);
  if (r.status !== 200 || !r.body) return out;
  var html = r.body;
  var base = String(embedUrl).replace(/^(https?:\/\/[^/]+).*$/, "$1");
  // JavSubIndo：页内 var src = "/s/<ts>/<hash>/<id>/index.m3u8"
  var srcM = html.match(/var\s+src\s*=\s*"([^"]*index\.m3u8[^"]*)"/);
  if (srcM) push(absUrl(srcM[1].replace(/\\/g, ""), base), "");
  // vidhide 系：解包后 links.hls3 > hls2 > hls4
  var unpacked = unpackVidhide(html);
  if (unpacked) {
    var qM = unpacked.match(/qualityLabels['"]?\s*:\s*\{[^}]*"([^"]+)"\s*:\s*"([^"]+)"/);
    var qLabel = qM ? qM[2] : "";
    var hls3 = unpacked.match(/"hls3"\s*:\s*"([^"]+)"/);
    var hls2 = unpacked.match(/"hls2"\s*:\s*"([^"]+)"/);
    var hls4 = unpacked.match(/"hls4"\s*:\s*"([^"]+)"/);
    if (hls3) push(hls3[1].replace(/\\/g, ""), qLabel);
    if (hls2) push(hls2[1].replace(/\\/g, ""), qLabel);
    if (hls4) push(absUrl(hls4[1].replace(/\\/g, ""), base), qLabel);
    // LuluStream（luluvido）：解包后 jwplayer setup 的 file:"...master.m3u8?..."，
    // 播单/子播单/分片全要浏览器 UA（带不带 Referer 都可），无 jsubindo 的分裂头要求，
    // token 有效期 8 小时，远长于 jsubindo 短签。优先于 jsubindo。
    var lf = unpacked.match(/file\s*:\s*"(https?:\/\/[^\"]+\.m3u8[^\"]*)"/);
    if (lf) push(lf[1].replace(/\\/g, ""), qLabel);
  }
  // 通用兜底：页内直出的 m3u8/mp4（dood 系为 Turnstile 验证墙，不在此硬解）
  var re = /https?:\/\/[^\s"'<>]+\.(?:m3u8|mp4)(?:\?[^\s"'<>]*)?/g;
  var gm;
  while ((gm = re.exec(html))) {
    if (!/\.js|\.css/.test(gm[0])) push(gm[0], "");
  }
  return out;
}

// 详情页隐藏 input#links：base64 -> embed URL 列表（",,," 分隔）
function extractEmbeds(html) {
  var m = String(html || "").match(/id=["']links["'][^>]*value=["']([^"']+)["']/);
  if (!m) return [];
  var dec = "";
  try { dec = b64decode(m[1]); } catch (e) { return []; }
  var parts = dec.split(",,,");
  var out = [];
  for (var i = 0; i < parts.length; i++) {
    var s = t(parts[i]);
    if (/^https?:\/\//.test(s)) out.push(s);
  }
  return out;
}

function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

function detailPath(link) {
  var s = t(link);
  if (!s) return "";
  var m = s.match(/\/video\/\d+\/[^/?#]*/);
  if (m) return m[0];
  return s;
}

async function loadDetail(link) {
  try {
    var path = detailPath(unwrapLink(link));
    if (!path) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var durl = path.indexOf("http") === 0 ? path : HOST + path;
    // v1.1.0 主路：Worker /resolve 单请求拿标题/封面/全量线（约 2-4 秒）。
    var w = await workerResolve(durl);
    if (w && w.ok && w.lines && w.lines.length) {
      return buildDetailFromWorker(durl, w);
    }
    // Worker 不通：回落——只取详情页（约 2-3 秒），线全留懒解析入口，不现解。
    var html = await getHtml(path);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var h1M = html.match(/<h1\s+class=["']product_title["']>([\s\S]*?)<\/h1>/i);
    var mainTitle = "精彩视频";
    if (h1M) mainTitle = cleanLabel(h1M[1]).replace(/^JAV Subtitle Indonesia\s*-\s*/i, "").trim() || "精彩视频";
    var posterPic = "";
    var imgRe = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    var im;
    while ((im = imgRe.exec(html))) {
      if (im[0].indexOf("AjaxLoader") >= 0) continue;
      var src = t(im[1]);
      if (src && (/^https?:\/\//.test(src) || src.indexOf("//") === 0)) { posterPic = normUrl(absUrl(src, HOST)); break; }
    }
    var embeds = extractEmbeds(html);
    var epLinks = [];
    var childItems = [];
    for (var ei = 0; ei < embeds.length; ei++) {
      var emb = embeds[ei];
      var label = embedHostLabel(emb);
      var id = durl + "@@EMBED:" + emb;
      epLinks.push({ name: label, link: id });
      childItems.push({ id: id, title: mainTitle + " " + label, name: label, mediaType: "movie", link: id, posterPath: posterPic, episode: ei + 1, episodeNumber: ei + 1, seasonIndex: 1, seasonNumber: 1 });
    }
    var result = {
      id: durl,
      type: "detail",
      title: mainTitle,
      name: mainTitle,
      description: epLinks.length ? "线路（点播时现解）" : "未找到播放地址",
      mediaType: "movie",
      link: durl,
      coverUrl: posterPic,
      posterPath: posterPic,
      backdropPath: posterPic,
      playerType: "app"
    };
    if (epLinks.length) {
      result.episodes = epLinks;
      result.seasons = [{ seasonNumber: 1, title: "全部线路", name: "全部线路", episodes: childItems }];
      result.episodeItems = childItems;
      result.childItems = childItems;
    }
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// Worker /resolve：GET <WORKER>/resolve?u=<详情页> -> {ok,title,poster,lines:[{name,host,embed,url}]}
async function workerResolve(durl) {
  try {
    var res = await Widget.http.get(WORKER + "/resolve?u=" + encodeURIComponent(durl), {
      headers: { "User-Agent": UA, "Accept": "application/json" }
    });
    var body = res && res.data != null ? String(res.data) : "";
    if (!body) return null;
    var obj = JSON.parse(body);
    return obj;
  } catch (e) { return null; }
}

// Worker 线是否可播（v1.1.1 扩）：luluv*（luluvido/luluvdo）+ *subindo.* 家族 +
// vidhide 系（morencius/hgplaycdn/vidhidepre/embedwish/dhtpre，packer 解包出 .txt/.m3u8）。
// 是否真能播仍由 Worker /v 逐条裁决（点播现解；解不出点它走 @@EMBED: 验 /v→legacy→[]）。
// bysebuho（JS SPA）、playmogo（DoodStream + Turnstile）、dood/dropload/mixdrop/
// bestx/d000d/mdy48tn97/vide0/listeamed/iplayerhls 无流，留懒解析入口。
function workerLinePlayable(host) {
  var h = String(host || "").toLowerCase();
  if (h.indexOf("luluv") >= 0) return true;
  if (/subindo\./.test(h)) return true;
  if (h === "morencius.com" || h === "hgplaycdn.com" || h === "vidhidepre.com" || h === "embedwish.com" || h === "dhtpre.com") return true;
  return false;
}

// 按 Worker /resolve 的 lines 建详情：可播线带 videoUrl（Worker /v 地址，零自定义头，
// 播放器只跟 Worker 说话）；死线留名 + @@EMBED: 入口，点它由 loadResource 验 Worker /v。
function buildDetailFromWorker(durl, w) {
  var mainTitle = t(w.title) || "精彩视频";
  var posterPic = t(w.poster) || "";
  var eps = [];
  var seasonEps = [];
  var epItems = [];
  var topUrl = "";
  for (var i = 0; i < w.lines.length; i++) {
    var ln = w.lines[i];
    var n = i + 1;
    if (workerLinePlayable(ln.host) && ln.url) {
      if (!topUrl) topUrl = ln.url;
      eps.push({ name: ln.name, link: ln.url });
      seasonEps.push({ title: ln.name, videoUrl: ln.url, episodeNumber: n });
      epItems.push({
        id: ln.url,
        type: "url",
        title: ln.name,
        mediaType: "movie",
        posterPath: posterPic,
        videoUrl: ln.url,
        link: ln.url,
        episode: n,
        episodeNumber: n,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system"
      });
    } else {
      var id = durl + "@@EMBED:" + (ln.embed || ln.url || "");
      eps.push({ name: ln.name, link: id });
      seasonEps.push({ title: ln.name, episodeNumber: n });
      epItems.push({
        id: id,
        type: "url",
        title: ln.name,
        mediaType: "movie",
        posterPath: posterPic,
        link: id,
        episode: n,
        episodeNumber: n,
        seasonIndex: 1,
        seasonNumber: 1
      });
    }
  }
  var result = {
    id: durl,
    type: "detail",
    title: mainTitle,
    name: mainTitle,
    description: "全部线路",
    mediaType: "movie",
    link: durl,
    coverUrl: posterPic,
    posterPath: posterPic,
    backdropPath: posterPic,
    playerType: "app",
    episodes: eps,
    seasons: [{ seasonNumber: 1, title: "全部线路", name: "全部线路", episodes: seasonEps }],
    episodeItems: epItems,
    childItems: epItems
  };
  if (topUrl) result.videoUrl = topUrl;
  return result;
}

function isVideoFormat(url) {
  var low = String(url || "").toLowerCase();
  return low.indexOf(".m3u8") >= 0 || low.indexOf(".mp4") >= 0 || low.indexOf(".txt") >= 0 || low.indexOf(".flv") >= 0 || low.indexOf(".ts") >= 0;
}

async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 懒解析：play 时重取详情、逐个 Server 解直链（拿新鲜签名；jsubindo 签名短效，详情时
  //   解出的直链到播放时常已过期），解出的流经 hls-relay 中转（分片须带 Referer，
  //   REX 播放器不转发 customHeaders 到分片请求，直出必死）。
  var at = raw.indexOf("@@EMBED:");
  if (at >= 0) {
    // v1.0.9：只解被点的这一条线，不串扰到别的 Server（点哪条播哪条）；仍解不出回 []，
    //   由 App 报解不出，不再把 embed 页交给 WebView 嗅探兜底。
    var durl = raw.slice(0, at);
    var emb0 = raw.slice(at + 8);
    // v1.1.0：先验 Worker /v（Worker 桌面 UA 现解，播单改写后播放器零头直连 Worker）。
    try {
      var wv = WORKER + "/v?u=" + encodeURIComponent(emb0) + "&r=" + encodeURIComponent(durl);
      var wr = await reqRaw(wv, durl);
      if (wr.status === 200 && wr.body && wr.body.indexOf("#EXTM3U") >= 0) {
        return [{ name: embedHostLabel(emb0), url: wv, playerType: "system" }];
      }
    } catch (e) { /* 回落 legacy 直连 */ }
    try {
      var streams = await resolveEmbed(emb0, durl);
      if (streams.length) {
        // jsubindo 行只带 UA（分片不认站根 Referer，见 probe_jsubindo5.log）
        return streamEntry(streams[0].url, embedHostLabel(emb0), isJsubindo(streams[0].url) ? "" : undefined);
      }
      return [];
    } catch (e) {
      return [];
    }
  }
  // Worker 地址（/v 改写播单）：先验 /v 真回 #EXTM3U 再交给播放器（v1.1.1）。
  // 1.1.0 是不验直接出线：Worker 回 502 的线（死线/403 播单）也会把 502 地址交给
  // 播放器转圈或报“解析不出来地址”。验失败则从 /v 的 u= 参数取 embed 走 legacy
  // 直连（与 @@EMBED: 分支同一回落）；仍无流回 []，由 App 报解不出。
  if (raw.indexOf(WORKER) === 0) {
    try {
      var wv2 = await reqRaw(raw, "");
      if (wv2.status === 200 && wv2.body && wv2.body.indexOf("#EXTM3U") >= 0) {
        return [{ name: "播放", url: raw, playerType: "system" }];
      }
    } catch (e) { /* 回落 legacy 直连 */ }
    try {
      var um = raw.match(/[?&]u=([^&]+)/);
      if (um) {
        var emb2 = decodeURIComponent(um[1]);
        var streams2 = await resolveEmbed(emb2, "");
        if (streams2.length) {
          return streamEntry(streams2[0].url, embedHostLabel(emb2), isJsubindo(streams2[0].url) ? "" : undefined);
        }
      }
    } catch (e) { /* fall through */ }
    return [];
  }
  // 直链（.m3u8/.mp4/.txt）同样中转：分片须带 Referer
  if (isVideoFormat(raw)) {
    return streamEntry(raw, "播放", isJsubindo(raw) ? "" : undefined);
  }
  // 兜底：直接传了详情地址时，现取详情取首个 Server 再走懒解析
  try {
    var det = await loadDetail(raw);
    var eps = det && det.episodes;
    if (eps && eps.length) {
      return await loadResource({ link: eps[0].link });
    }
  } catch (e) { /* fall through */ }
  return [];
}
