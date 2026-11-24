// v1.0.6：AVDB 样式详情：peoples/genreItems + 点按路由
// PimpBunny for REX (lai_pimpbunny v1.0.5)
// v1.0.5（2026-11-21）：修真机“点站内播放（嗅探）行仍解析不出线路地址”——
//   1.0.4 的嗅探行在 episodeItems / seasons 里整个没有 videoUrl 键，只有 link。
//   App 点集时先从集上解析线路地址：有 videoUrl 的集直接播（分发规则，
//   4KPorno/123av/24jav/5lxtv 同款），无 videoUrl 的集 App 拿不到地址，
//   报错就是“播放解析不出线路地址”——harness 复现时该行地址栏直接显示为空。
//   1.0.4 的“省略 videoUrl”抄错了规则：App 丢弃的是 videoUrl 为空串的集，
//   不是“带真地址的集”。对照能播的同款嗅探线——manko 1.0.3 的 Upload18 行
//   （addEp 传 videoUrl=播放器页地址、playerType "app"）：集上 videoUrl 就是
//   播放器页地址，seasonEps 同样带 videoUrl，loadResource 回同款 app 行。
//   修法照抄 manko：嗅探行集上 videoUrl=.com 视频页、playerType "app"、
//   带 customHeaders（UA + Referer .com），seasonEps 同样带 videoUrl；
//   loadResource 的 .com 分支补 customHeaders，并多认 params.videoUrl
//   （91cg 同款 unwrap 优先 videoUrl，防 App 只传 videoUrl 的情形）。
//   Worker 5 档行与 @@PB: 行为不动；懒行“无真地址就省略 videoUrl 键”规则不变。
// v1.0.4（2026-11-21）：修真机“播放解析不出线路地址或分辨率”——根因是 Worker 腿已死，
//   不是模块懒解析：pimpbunny-stream Worker v3 的 /play 对所有视频/档位一律回 502
//   {"ok":false,"error":"no ladder: detail fetch failed or no video_alt_url"}，
//   因 Cloudflare 出口取 .com 视频页被 Bunny Shield 拦（403），Worker 侧再也铸不出梯子。
//   1.0.3 的 5 档 Worker 行（集内 videoUrl）因此全灭，用户看到的就是“解析不出地址”。
//   修法参照猫源 py_pimpbunny.js v9 的腿 5：补一条“站内播放（嗅探）”行——
//   .com 视频页本身是真视频页（kt_player），App 内浏览器打开它、由播放器嗅探站内播放
//   （manko Upload18 同款 parse:1 做法；猫源腿 5 同款；.net 页嗅探真机已证死，只嗅 .com）。
//   .com 视频页地址由 .net 详情页 <video> 的 /stream 经纯 JS base64 解出，详情时已知，
//   不取 .com 页、不依赖 Worker。Worker 5 档行保留作回落（Worker 若恢复即能播）。
//   loadResource：.com 视频页入参直接回 app 嗅探行，不再重取；@@PB: 只回 Worker 行，
//   删掉过期的 get_file 第二行（会话绑定 + 播放器不发 Cookie，必 403）；绝不回 []。
//   另：顶层 videoUrl 不再指向 Worker 地址（Worker 死时点卡片即播死链），改为不设，
//   点卡片进选集页、由用户选行。
// v1.0.3（2026-11-15）：修真机“播放解析不出地址”——1.0.2 的 loadResource 对 @@PB: token
//   先跑 probeWorkerPlay（Range 探针，要在手机上跑完 Worker 整链才回），探针一慢/一超时
//   就判死，随后 .com 各腿在手机上全死（直连 403、jina 旧令牌），最后回 []，用户看到的
//   就是“直接不出地址”。同款毛病以前 JavXXX 1.0.1 犯过：设备侧门禁（kind==="hls" 检查）
//   丢掉了好的 Worker 结果、回 []，修法就是拆掉门禁、直接交 Worker 地址。改：loadResource
//   不再探针，直接回 Worker /play 行（Worker 地址本身就是可播地址，服务端每次现铸）；
//   直链只作第二行，不再当门；任何 @@PB: token 都至少回一行 Worker 行，绝不回 []。
//   另：addEp 的 videoUrl 为空时整个省略该键（空串 videoUrl 会让 App 判该集无内容）。
// v1.0.2（2026-11-15）：修真机详情无档位——loadDetail 的 getText 在手机上直连 .net 抖动、jina 也失败时
//   旧版直接回“详情获取失败”，一集都没有。改：页面取不到或标题取不到时用 URL 建兜底详情，5 档
//   Worker 直链（Worker v3 接受 .net 详情页地址，服务端取页解 /stream 的 b64 得 .com 页再走老链）；
//   stream 解不出 .com 页时同样出 5 档，不再出无 videoUrl 的“正片”懒集；loadResource 的
//   @@PB:DETAIL: 分支改回 Worker 行，不再回 app 嗅探行（.net 页嗅探真机已证死）。
// v1.0.1（2026-11-14）：修真机两报——①详情无档位/无分辨率：梯子直连 .com 在手机上 403、jina 又是唯一腿，
//   梯子取不到时仍按站方标准四档（1080/720/480/360）出集，Worker /play 点播时按档位就近选（精确档→其下最高→最低），
//   不再整段无集；②点播空白：probeWorkerPlay 只认“状态码+content-type 头”，App 侧不回传响应头时 206 也判死，
//   改为状态码 206/200 即通（Worker 失败只回 502 JSON，200/206 只可能是真视频），无状态码时看 body；
//   ③列表后又全空：.net 直连失败时加 jina 兜底腿；④集内带 videoUrl（Worker /play 地址，点播即播，
//   不再全靠 loadResource 二次解析——sextb 1.0.3 / javhey / 24jav 同款交接）。
// 移植自 mira-cat 蜘蛛 py_pimpbunny.js（只读蓝图）。
// 站：列表/详情 https://pimpbunny.net，视频页 https://pimpbunny.com。
// 分类：最新 + 分类（20 卡）/ 标签（41 卡）/ 模特（29 卡），子分类做筛选卡片。
// 封面：走 .net host + -640x360 缩略变体（.com 原图真机空白，v8 已证伪）。
// 档位：.net 详情页 <video> 的 4 条 label 共用同一 /stream 地址（假菜单）；
//   真实档位在 .com 视频页 kt_player 配置里：video_url=360p、video_alt_url=480p、
//   video_alt_url2=720p、video_alt_url3=1080p、video_alt_url4=1440p。
// 播放：首选 pimpbunny-stream Worker v2 /play 自铸整链（已部署，验过 206 video/mp4；
//   猫源 v9 用户真机确认可播）。Worker /play 探通（206/200 + video/*）即出线；
//   探不通才回落：现铸 .com 档位直链 -> 详情时刻令牌 -> 嗅探 .com 页。
//   绝不嗅探 .net 页（v2 真机已证死）。jina 只取档位名，旧令牌绝不交给播放器。
// 搜索：/?s=<wd>，空结果仍渲染 20 条推荐，须以 "0 video found" 判空。

WidgetMetadata = {
  id: "lai_pimpbunny",
  title: "PimpBunny",
  description: "PimpBunny：OnlyFans 泄露站，最新 + 分类/标签/模特筛选，1440/1080/720/480/360 五档走 pimpbunny-stream Worker /play，Worker 不通时可用站内播放（嗅探）",
  author: "lai",
  version: "1.0.6",
  requiredVersion: "0.0.1",
  site: "https://pimpbunny.net",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "分类", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "cats" }, { name: "sub", title: "分类", type: "enumeration", value: "4k", enumOptions: [{"title": "4K", "value": "4k"}, {"title": "Anal", "value": "anal"}, {"title": "Asian", "value": "asian"}, {"title": "BBC", "value": "bbc"}, {"title": "BDSM", "value": "bdsm"}, {"title": "Big Ass", "value": "big-ass"}, {"title": "Big Boobs", "value": "big-boobs"}, {"title": "Bizarre", "value": "bizarre"}, {"title": "Blowjob", "value": "blowjob"}, {"title": "Bunnies", "value": "bunnies"}, {"title": "Cosplay", "value": "cosplay"}, {"title": "Cosplayer", "value": "cosplayer"}, {"title": "Deep Throat", "value": "deep-throat"}, {"title": "Double Penetration", "value": "double-penetration"}, {"title": "Exclusive", "value": "exclusive"}, {"title": "Feet", "value": "feet"}, {"title": "Fetish", "value": "fetish"}, {"title": "Japanese", "value": "japanese"}, {"title": "Latina", "value": "latina"}, {"title": "Lesbian", "value": "lesbian"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "标签", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "tags" }, { name: "sub", title: "标签", type: "enumeration", value: "doggy-style", enumOptions: [{"title": "Doggy Style", "value": "doggy-style"}, {"title": "Tattoos", "value": "tattoos"}, {"title": "Ass", "value": "ass"}, {"title": "POV Blowjob", "value": "pov-blowjob"}, {"title": "Missionary", "value": "missionary"}, {"title": "Pussy Play", "value": "pussy-play"}, {"title": "Pussy Rubbing", "value": "pussy-rubbing"}, {"title": "Cute", "value": "cute"}, {"title": "Natural Body", "value": "natural-body"}, {"title": "Dildo Riding", "value": "dildo-riding"}, {"title": "Solo Masturbation", "value": "solo-masturbation"}, {"title": "Brunette", "value": "brunette"}, {"title": "Natural Tits", "value": "natural-tits"}, {"title": "Anal Dildoing", "value": "anal-dildoing"}, {"title": "Butt Plug", "value": "butt-plug"}, {"title": "Big Tits", "value": "big-tits"}, {"title": "Anal Creampie", "value": "anal-creampie"}, {"title": "Solo Dildo", "value": "solo-dildo"}, {"title": "BWC", "value": "bwc"}, {"title": "Cowgirl", "value": "cowgirl"}, {"title": "Anal Play", "value": "anal-play"}, {"title": "Blonde", "value": "blonde"}, {"title": "Solo Girl", "value": "solo-girl"}, {"title": "Reverse Cowgirl", "value": "reverse-cowgirl"}, {"title": "Shaved Pussy", "value": "shaved-pussy"}, {"title": "Fingering", "value": "fingering"}, {"title": "Amateur", "value": "amateur"}, {"title": "Anal Plug", "value": "anal-plug"}, {"title": "POV Anal", "value": "pov-anal"}, {"title": "Pink Pussy", "value": "pink-pussy"}, {"title": "Cumshot", "value": "cumshot"}, {"title": "Petite", "value": "petite"}, {"title": "Big Lips", "value": "big-lips"}, {"title": "Small Tits", "value": "small-tits"}, {"title": "Big Pussy", "value": "big-pussy"}, {"title": "Dick Riding", "value": "dick-riding"}, {"title": "Anal Masturbation", "value": "anal-masturbation"}, {"title": "Cum", "value": "cum"}, {"title": "Side Fuck", "value": "side-fuck"}, {"title": "Big Cock", "value": "big-cock"}, {"title": "Anal Solo", "value": "anal-solo"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "模特", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "actors" }, { name: "sub", title: "模特", type: "enumeration", value: "abbie-sykes", enumOptions: [{"title": "Abbie Sykes", "value": "abbie-sykes"}, {"title": "Missslily", "value": "missslily"}, {"title": "Dredd", "value": "dredd"}, {"title": "Anna Ralphs", "value": "anna-ralphs"}, {"title": "Devon Jenelle", "value": "devon-jenelle"}, {"title": "Rusitaok", "value": "rusitaok"}, {"title": "Angela White", "value": "angela-white"}, {"title": "Daria Angel", "value": "daria-angel"}, {"title": "Vivienne Vo", "value": "vivienne-vo"}, {"title": "Kwini Kim", "value": "kwini-kim"}, {"title": "PanteraNika", "value": "panteranika"}, {"title": "Little Tina", "value": "little-tina"}, {"title": "Skylar Vox", "value": "skylar-vox"}, {"title": "Aluraye", "value": "aluraye"}, {"title": "Lola Rose", "value": "lola-rose"}, {"title": "Myelliqueen", "value": "myelliqueen"}, {"title": "Purple Bitch", "value": "purple-bitch"}, {"title": "Taylor Banks", "value": "taylor-banks"}, {"title": "Cherry Apricot", "value": "cherry-apricot"}, {"title": "Eden Ivy", "value": "eden-ivy"}, {"title": "Lulu Wild", "value": "lulu-wild"}, {"title": "Agatha Vega", "value": "agatha-vega"}, {"title": "Lilwaifulia", "value": "lilwaifulia"}, {"title": "Madiiitay", "value": "madiiitay"}, {"title": "Elle Brooke", "value": "elle-brooke"}, {"title": "Xxxmilamonet", "value": "xxxmilamonet"}, {"title": "Poetryandcherry", "value": "poetryandcherry"}, {"title": "Eimi Girl", "value": "eimi-girl"}, {"title": "Gabbie Carter", "value": "gabbie-carter"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var SITE = "https://pimpbunny.net";
var COM = "https://pimpbunny.com";
var STREAM_WORKER = "https://pimpbunny-stream.li768435813.workers.dev";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/604.1.14 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1";
var PAGE_SIZE = 20;

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  var r = t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  r = r.replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); });
  r = r.replace(/&#x([0-9a-fA-F]+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 16)); });
  return r;
}

// 纯 JS base64 解码（URL-safe 兼容），返回 UTF-8 字符串
function b64decode(s) {
  try {
    s = String(s || "").replace(/-/g, "+").replace(/_/g, "/").replace(/\s+/g, "");
    while (s.length % 4) s += "=";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var rev = {};
    for (var i = 0; i < chars.length; i++) rev[chars.charAt(i)] = i;
    var bytes = [];
    for (var j = 0; j < s.length; j += 4) {
      var a = rev[s.charAt(j)] || 0;
      var b = rev[s.charAt(j + 1)] || 0;
      var c = s.charAt(j + 2) === "=" ? 0 : (rev[s.charAt(j + 2)] || 0);
      var d = s.charAt(j + 3) === "=" ? 0 : (rev[s.charAt(j + 3)] || 0);
      bytes.push((a << 2) | (b >> 4));
      if (s.charAt(j + 2) !== "=") bytes.push(((b & 15) << 4) | (c >> 2));
      if (s.charAt(j + 3) !== "=") bytes.push(((c & 3) << 6) | d);
    }
    var out = "";
    for (var k = 0; k < bytes.length; k++) {
      var by = bytes[k];
      if (by < 128) { out += String.fromCharCode(by); continue; }
      var extra = (by >= 224 ? 2 : (by >= 192 ? 1 : 0));
      var code = by & (extra === 2 ? 15 : 31);
      for (var e2 = 1; e2 <= extra && k + e2 < bytes.length; e2++) {
        code = (code << 6) | (bytes[k + e2] & 63);
      }
      k += extra;
      out += String.fromCharCode(code);
    }
    return out;
  } catch (e) { return ""; }
}

function fixUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return SITE + u;
  return SITE + "/" + u;
}

function coverUrl(u) {
  var fixed = fixUrl(u);
  if (fixed.indexOf("https://pimpbunny.com/") === 0) {
    fixed = "https://pimpbunny.net/" + fixed.slice("https://pimpbunny.com/".length);
  }
  var m = fixed.match(/^(https:\/\/pimpbunny\.net\/wp-content\/uploads\/.*)(\.(?:jpe?g|png|webp))$/i);
  if (m && m[1].indexOf("-640x360") < 0) return m[1] + "-640x360" + m[2];
  return fixed;
}

function isShield(html) {
  if (!html || typeof html !== "string") return true;
  if (html.length < 2000) return true;
  if (/Establishing a secure connection/i.test(html.slice(0, 3000))) return true;
  return false;
}

async function getText(url, referer) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Referer": referer || SITE + "/",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    if (body && !isShield(body)) return body;
  } catch (e) { /* 直连失败，走 jina 兜底 */ }
  // jina 兜底：手机直连 .net 被墙/抖动时，列表与详情仍能出内容（sextb 同款 fetchViaJina）
  try {
    var jr = await Widget.http.get("https://r.jina.ai/" + url, {
      headers: {
        "User-Agent": UA,
        "x-respond-with": "html",
        "Accept": "text/html,*/*"
      }
    });
    var jb = jr && jr.data != null ? (typeof jr.data === "string" ? jr.data : JSON.stringify(jr.data)) : "";
    if (jb && !isShield(jb)) return jb;
  } catch (e) { /* jina 也失败 */ }
  return "";
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function parseList(html) {
  var list = [];
  if (!html) return list;
  var re = /<article[^>]*class="thumb-block[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var seg = m[1];
    var href = seg.match(/<a\s+href="([^"]+)"/);
    var title = seg.match(/<span\s+class="title">([^<]+)<\/span>/);
    if (!href || !title) continue;
    var id = fixUrl(href[1]);
    var name = decodeHtml(title[1]);
    if (!id || !name) continue;
    var img = seg.match(/<img[^>]*src="([^"]+)"/);
    var dur = seg.match(/class="duration"[^>]*>([^<]+)</);
    list.push({
      id: id,
      type: "url",
      title: name,
      posterPath: img ? coverUrl(img[1]) : "",
      coverUrl: img ? coverUrl(img[1]) : "",
      backdropPath: img ? coverUrl(img[1]) : "",
      link: id,
      description: dur ? t(dur[1]) : "",
      mediaType: "movie"
    });
  }
  return list;
}

function listUrl(base, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  if (page <= 1) return base + "?filter=latest";
  return base + "page/" + page + "/?filter=latest";
}

var ZONE_DEFAULT = { latest: "", cats: "4k", tags: "doggy-style", actors: "abbie-sykes" };

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "latest");
  var sub = t(params.sub || "") || ZONE_DEFAULT[zone] || "";
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var base = "";
  if (zone === "latest") base = SITE + "/";
  else if (zone === "cats") base = SITE + "/" + sub + "/";
  else if (zone === "tags") base = SITE + "/tag/" + sub + "/";
  else if (zone === "actors") base = SITE + "/actor/" + sub + "/";
  else return emptyItem("未知分类");
  try {
    var html = await getText(listUrl(base, page));
    var list = parseList(html);
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
    var url = SITE + "/?s=" + encodeURIComponent(wd);
    if (page > 1) url = SITE + "/page/" + page + "/?s=" + encodeURIComponent(wd);
    var html = await getText(url);
    if (html && /search-video-number">\s*0\s+video/i.test(html)) return emptyItem();
    var list = parseList(html);
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

// URL slug 人性化标题（兜底详情用，不编造）：最后一段去尾斜杠，- 换空格，每词首字母大写
function slugTitle(u) {
  var s = String(u || "").replace(/\/+$/, "");
  var slash = s.lastIndexOf("/");
  if (slash >= 0) s = s.slice(slash + 1);
  try { s = decodeURIComponent(s); } catch (e) {}
  var words = s.split("-");
  var out = [];
  for (var i = 0; i < words.length; i++) {
    var w = words[i];
    if (!w) continue;
    out.push(w.charAt(0).toUpperCase() + w.slice(1));
  }
  return out.join(" ") || "PimpBunny";
}

// 从 /stream 地址解出 .com 视频页：
//   旧式 /stream/video.mp4?v=<b64>，新式 /stream/<b64>.mp4，解开即 https://pimpbunny.com/videos/<slug>/
function comVideoFromStream(stream) {
  try {
    var m = String(stream || "").match(/\/stream\/(?:video\.mp4\?v=)?([A-Za-z0-9+/=_-]+)(?:\.mp4)?/i);
    if (!m) return "";
    var dec = b64decode(m[1]);
    if (/^https:\/\/pimpbunny\.com\/videos\/[^/]+\/$/.test(dec)) return dec;
  } catch (e) { /* 不是可解的 /stream 形态 */ }
  return "";
}

// 解析 .com 视频页 kt_player 配置的档位菜单，只收带 v-acctoken 的 get_file 直链
function parseLadder(html) {
  if (!html || html.indexOf("video_url:") < 0 || html.indexOf("get_file/") < 0) return [];
  var texts = {};
  var tre = /(video_url|video_alt_url\d*)_text\s*:\s*'([^']+)'/g;
  var tm;
  while ((tm = tre.exec(html)) !== null) texts[tm[1]] = tm[2];
  var out = [];
  var seen = {};
  var ure = /(video_url|video_alt_url\d*)\s*:\s*'([^']+)'/g;
  var um;
  while ((um = ure.exec(html)) !== null) {
    var furl = um[2];
    if (!/^https:\/\/pimpbunny\.com\/get_file\/[^']*v-acctoken=[A-Za-z0-9%_-]+/.test(furl)) continue;
    if (seen[furl]) continue;
    seen[furl] = 1;
    var label = texts[um[1]] || "";
    var nm = label.match(/(\d+)/);
    var num = nm ? parseInt(nm[1], 10) : 0;
    out.push({ label: label || (num ? num + "p" : "正片"), num: num, url: furl });
  }
  out.sort(function (a, b) { return b.num - a.num; });
  return out;
}

async function getComPage(url) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Referer": COM + "/",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body || "";
  } catch (e) { return ""; }
}

// 直连取 .com 视频页现铸档位（令牌与会话同次渲染才配对）
async function fetchLadderDirect(comVideo) {
  var html = await getComPage(comVideo);
  return parseLadder(html);
}

// jina 取 .com 视频页：只取档位名，令牌是 jina 缓存页铸的旧令牌，绝不直接交给播放器
async function fetchLadderJina(comVideo) {
  try {
    var res = await Widget.http.get("https://r.jina.ai/" + comVideo, {
      headers: {
        "User-Agent": UA,
        "x-respond-with": "html",
        "Accept": "text/html,*/*"
      }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return parseLadder(body || "");
  } catch (e) { return []; }
}

// Worker /play 探针：Range 0-1023，206/200 即通。
// v1.0.1 修正：旧版还要 content-type 头是 video/* 才认通，但 REX 运行侧不一定回传
// 响应头——206 在、手头没有时旧版误判失败，点播直接掉线。Worker 成功只回 206/200
// 视频字节、失败只回 502 JSON，所以状态码本身就够判，不再依赖响应头。
function workerPlayUrl(comVideo, labelNum) {
  if (!STREAM_WORKER || !comVideo) return "";
  var q = labelNum > 0 ? ("&q=" + labelNum) : "";
  return STREAM_WORKER + "/play?u=" + encodeURIComponent(comVideo) + q;
}
// ---- AVDB 样式详情：演员/分类（点按出对应全部内容）----
var TAX_ACTRESS_RE = /\/actors?\//i;
var TAX_GENRE_RE = /\/(tags?|categor(?:y|ies)|category)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)|category|actress(es)?|actors?|stars?|star|performers?|models?|pornstars?|makers?|labels?|studios?|all|全部|分类|演员|标签|女优|题材|片商)$/i;

function taxRealWorks(works) {
  var out = [];
  for (var i = 0; i < works.length; i++) {
    var w = works[i];
    if (w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty" && w.id !== "tip" && w.id !== "supjav-diag-parse" && String(w.id || "").indexOf("supjav-diag") !== 0) out.push(w);
  }
  return out;
}

function extractTaxonomyFromHtml(html) {
  var peoples = [];
  var genreItems = [];
  var seenP = {};
  var seenG = {};
  var baseHost = String(SITE || "").replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var href = m[1] || "";
    var name = String(m[2] || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (!name || name.length > 40 || TAX_NAV_NAME_RE.test(name)) continue;
    var abs = fixUrl(href);
    if (!/^https?:\/\//i.test(abs)) continue;
    var host = abs.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (baseHost && host !== baseHost) continue;
    var after = abs.split(/\/actors?\/|\/tags?\/|\/categor(?:y|ies)\/|\/category\//i)[1] || "";
    after = after.split("?")[0].split("#")[0].replace(/\/+$/, "");
    if (!after) continue;
    if (TAX_ACTRESS_RE.test(abs)) {
      if (seenP[name]) continue;
      seenP[name] = 1;
      if (peoples.length < 20) peoples.push({ id: abs, title: name, name: name, link: abs, role: "演员" });
    } else if (TAX_GENRE_RE.test(abs)) {
      if (seenG[name]) continue;
      seenG[name] = 1;
      if (genreItems.length < 20) genreItems.push({ id: abs, title: name });
    }
    if (peoples.length >= 20 && genreItems.length >= 20) break;
  }
  return { peoples: peoples, genreItems: genreItems };
}

async function taxRoute(url) {
  var isActress = TAX_ACTRESS_RE.test(url);
  var slug = "";
  try { slug = decodeURIComponent((String(url).split("?")[0].split("#")[0].replace(/\/+$/, "").split("/").pop() || "")); } catch (_) { slug = ""; }
  var taxPath = String(url).replace(/^https?:\/\/[^/]+\//, "");
  var works = [];
  try {
    var pm1 = url.match(/\/(tag|actor|category)\/([^/?#]+)/);
    if (pm1) { var z = pm1[1] === "tag" ? "tags" : (pm1[1] === "actor" ? "actors" : "cats"); works = await loadList({ zone: z, sub: pm1[2].split("/")[0], page: 1 }); }
  } catch (_) { works = []; }
  if (!Array.isArray(works)) works = [];
  var realWorks = taxRealWorks(works);
  if (!realWorks.length && slug) {
    try {
      var sw = await search({ keyword: slug.replace(/-/g, " ") });
      if (Array.isArray(sw)) { works = sw; realWorks = taxRealWorks(sw); }
    } catch (_) {}
  }
  return {
    id: url,
    type: "detail",
    mediaType: "movie",
    title: slug || (isActress ? "演员" : "分类"),
    link: url,
    description: (isActress ? "演员" : "分类") + " · 共 " + realWorks.length + " 部作品",
    videoUrl: "",
    childItems: [],
    relatedItems: realWorks.length ? realWorks : works
  };
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var pageUrl = fixUrl(raw);
    if (TAX_ACTRESS_RE.test(pageUrl) || TAX_GENRE_RE.test(pageUrl)) {
      return await taxRoute(pageUrl);
    }
    var html = await getText(pageUrl, SITE + "/");
    // v1.0.2：页面取不到时不再回错误——下面用 URL 建兜底详情，5 档 Worker 直链。
    var name = "";
    var hm = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (hm) name = decodeHtml(hm[1].replace(/<[^>]+>/g, ""));
    if (!name) name = slugTitle(pageUrl);
    var pic = "";
    var posterM = html.match(/<video[^>]*poster="([^"]+)"/)
      || html.match(/property="og:image"\s+content="([^"]+)"/);
    if (posterM) pic = coverUrl(posterM[1]);
    var content = "";
    var dm = html.match(/<meta\s+itemprop="description"\s+content="([^"]+)"/);
    if (dm) content = decodeHtml(dm[1]);
    var dur = "";
    var dum = html.match(/itemprop="duration"\s+content="([^"]+)"/);
    if (dum) dur = dum[1];
    // 播放源：<video id="wpst-video"> 块内全部 <source>，去重后只剩 1 条 /stream
    var stream = "";
    var vBlock = html.match(/<video[^>]*id="wpst-video"[^>]*>([\s\S]*?)<\/video>/)
      || html.match(/<video[^>]*>([\s\S]*?)<\/video>/);
    if (vBlock) {
      var sre = /<source[^>]*src="([^"]+)"[^>]*>/g;
      var sm;
      var srcs = [];
      while ((sm = sre.exec(vBlock[1])) !== null) {
        var u = fixUrl(sm[1]);
        if (u && srcs.indexOf(u) < 0) srcs.push(u);
      }
      stream = srcs[0] || "";
    }
    if (!stream) {
      var src2 = html.match(/<source[^>]*src="([^"]+stream\/video\.mp4[^"]*)"/)
        || html.match(/<source[^>]*src="([^"]+\.mp4[^"]*)"/);
      if (src2) stream = fixUrl(src2[1]);
    }
    var comVideo = stream ? comVideoFromStream(stream) : "";
    var epsList = [];
    var epItems = [];
    var seasonEps = [];
    // 集内带 videoUrl（Worker /play 地址，点播即播，不再全靠 loadResource 二次解析——
    // sextb 1.0.3 / javhey / 24jav 同款交接；/play 每次请求都在 Worker 侧现铸令牌，无过期问题）。
    // link/id 仍留懒解析 @@PB token，App 若调 loadResource 可现解重铸。
    function addEp(label, lazyUrl, num, playUrl) {
      epsList.push({ name: label, link: lazyUrl });
      var se = { title: label, episodeNumber: num || 0 };
      if (playUrl) se.videoUrl = playUrl;
      seasonEps.push(se);
      var item = {
        id: lazyUrl,
        type: "url",
        title: label,
        mediaType: "movie",
        posterPath: pic,
        link: lazyUrl,
        episode: num || 0,
        episodeNumber: num || 0,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: playUrl ? "system" : "app"
      };
      if (playUrl) {
        item.videoUrl = playUrl;
        item.customHeaders = { "User-Agent": UA, "Referer": (comVideo || pageUrl) };
      }
      epItems.push(item);
    }
    if (comVideo) {
      var ladder = await fetchLadderDirect(comVideo);
      var jinaOnly = false;
      if (!ladder.length) {
        ladder = await fetchLadderJina(comVideo);
        jinaOnly = true;
      }
      if (ladder.length) {
        // jina 档位名可用，但令牌是旧的：懒链接里不带 fileUrl，点播走 Worker /play 现铸
        for (var i = 0; i < ladder.length; i++) {
          var fileUrl = jinaOnly ? "" : ladder[i].url;
          addEp(ladder[i].label, "@@PB:" + comVideo + "|" + ladder[i].label + "|" + fileUrl, ladder[i].num,
            workerPlayUrl(comVideo, ladder[i].num));
        }
      } else {
        // 梯子两腿全灭也不整段无集：按站方标准四档出集，Worker /play 点播时按档位就近选
        // （精确档→其下最高→最低），至少有分辨率可选、有可播入口。
        var stdTiers = [1080, 720, 480, 360];
        for (var ti = 0; ti < stdTiers.length; ti++) {
          addEp(stdTiers[ti] + "p", "@@PB:" + comVideo + "|" + stdTiers[ti] + "p|", stdTiers[ti],
            workerPlayUrl(comVideo, stdTiers[ti]));
        }
      }
    } else {
      // v1.0.2：页面取不到或 /stream 解不出 .com 页时，一律出 5 档 Worker 直链
      // （Worker v3 接受 .net 详情页地址，服务端取页解 /stream 的 b64 得 .com 页再走老链；
      // 不再出无 videoUrl 的“正片”懒集，那集在手机上只能嗅探死页）。
      var stdTiers = [1440, 1080, 720, 480, 360];
      for (var ti = 0; ti < stdTiers.length; ti++) {
        addEp(stdTiers[ti] + "p", "@@PB:" + pageUrl + "|" + stdTiers[ti] + "p|", stdTiers[ti],
          workerPlayUrl(pageUrl, stdTiers[ti]));
      }
    }
    // v1.0.5：照抄 manko 1.0.3 Upload18 嗅探行形状——集上 videoUrl 就是 .com
    // 视频页地址（App 点集时直接取该地址交应用播放器嗅探；无 videoUrl 的集
    // App 解析不出线路地址，1.0.4 的病根就在这里）。seasonEps 同样带 videoUrl。
    if (comVideo) {
      epsList.push({ name: "站内播放（嗅探）", link: comVideo });
      seasonEps.push({ title: "站内播放（嗅探）", videoUrl: comVideo, episodeNumber: 0 });
      epItems.push({
        id: comVideo,
        type: "url",
        title: "站内播放（嗅探）",
        mediaType: "movie",
        posterPath: pic,
        videoUrl: comVideo,
        link: comVideo,
        episode: 0,
        episodeNumber: 0,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "app",
        customHeaders: { "User-Agent": UA, "Referer": COM + "/" }
      });
    }
    var result = {
      id: pageUrl,
      type: "detail",
      title: name,
      name: name,
      description: content,
      mediaType: "movie",
      link: pageUrl,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      duration: dur,
      playerType: "app"
    };
    if (epsList.length) {
      result.episodes = epsList;
      result.seasons = [{ seasonNumber: 1, title: "清晰度", name: "清晰度", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
      // v1.0.4：顶层 videoUrl 不再指向 Worker 地址——Worker 死时点卡片即播死链；
      // 不设顶层 videoUrl，点卡片进选集页、由用户选行（Worker 行或嗅探行）。
    }
    var tax = extractTaxonomyFromHtml(html);
    if (tax.peoples.length) result.peoples = tax.peoples;
    if (tax.genreItems.length) result.genreItems = tax.genreItems;
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || params.videoUrl || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || params.item.videoUrl || "");
  if (!raw) return [];
  // 已是 Worker /play 直链：直接出 system 行（详情集内 videoUrl 点播即此路）
  if (raw.indexOf(STREAM_WORKER + "/play?") === 0) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA } }];
  }
  // 集内 videoUrl 随 item 一起传来时直接出流
  if (params.item && params.item.videoUrl && String(params.item.videoUrl).indexOf(STREAM_WORKER + "/play?") === 0) {
    return [{ name: "播放", url: String(params.item.videoUrl), playerType: "system", customHeaders: { "User-Agent": UA } }];
  }
  // v1.0.5：.com 视频页入参（嗅探行的 link/videoUrl）→ 直接回 app 嗅探行，不重取、不探针。
  // .com 页是真视频页（kt_player），App 内浏览器打开它、由播放器嗅探站内播放（猫源腿 5 同款，
  // manko Upload18 同款回法，带 UA + Referer 头）。
  if (/^https:\/\/pimpbunny\.com\/videos\/[^/]+\/$/.test(raw)) {
    return [{ name: "站内播放（嗅探）", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": COM + "/" } }];
  }
  var at = raw.indexOf("@@PB:");
  if (at >= 0) {
    var tok = raw.slice(at + 5);
    var parts = tok.split("|");
    var comVideo = parts[0] || "";
    var label = parts[1] || "正片";
    var fileUrl = parts[2] || "";
    // v1.0.2：DETAIL 入口改走 Worker 行（Worker v3 接受 .net 详情页地址，服务端解链），
    // 不再回 app 嗅探行（.net 页嗅探真机已证死）。
    if (comVideo.indexOf("DETAIL:") === 0) {
      var detailUrl = comVideo.slice("DETAIL:".length);
      return [{ name: label, url: workerPlayUrl(detailUrl, 0), playerType: "system", customHeaders: { "User-Agent": UA } }];
    }
    var q = 0;
    var qm = String(label).match(/(\d+)/);
    if (qm) q = parseInt(qm[1], 10) || 0;
    // v1.0.3：Worker /play 地址本身就是可播地址，直接回，不再先探（见文件头）。
    // Worker v3 同时接受 .com 视频页与 .net 详情页，comVideo 两种形态都可用。
    var rows = [];
    if (comVideo) {
      rows.push({ name: label, url: workerPlayUrl(comVideo, q), playerType: "system", customHeaders: { "User-Agent": UA, "Referer": comVideo } });
    }
    // v1.0.4：删掉详情时刻的 get_file 第二行——令牌会话绑定且播放器不发 Cookie，
    // 交给播放器必 403；且令牌尾数十秒即过期，点播时早已失效。
    if (rows.length) return rows;
    return [];
  }
  // 直链 mp4 / m3u8
  if (/\.mp4(\?|#|$)/i.test(raw) || /\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": COM + "/" } }];
  }
  // 兜底：详情页地址 -> 取详情首集
  try {
    var det = await loadDetail(raw);
    var eps2 = det && det.episodeItems;
    if (eps2 && eps2.length) {
      return await loadResource({ link: eps2[0].id });
    }
  } catch (e) { /* fall through */ }
  return [];
}
