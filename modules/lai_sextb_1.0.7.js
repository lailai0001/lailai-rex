// v1.0.7：AVDB 样式详情：分类小卡片 genreItems + 点按路由（D 组，只做分类）
// SexTB for REX (lai_sextb v1.0.6)
// v1.0.6（2026-11-23）：设备侧 ajax，修全线路转圈。根因：站方现 403 封
//   Cloudflare 出口——Worker /diag 回 FETCH_FAIL 403，Worker /ajax
//   （POST /ajax/player）回 HTTP_403（新鲜 pt/pk 实测）；模块取详情页
//   提 pt 再调 Worker /ajax 必然空手，loadResource 回 null → 全线转圈。
//   修复：POST /ajax/player 改由设备（手机住宅出口，站方不拦）直发，
//   XOR 解 player_enc 也在模块内做；Worker 只剩 /f4（f4scdn 不拦 CF）
//   继续用。Cookie：pt 与 PHPSESSID 同会话绑定，详情页直取时从响应头
//   取 set-cookie，POST 时原样带回；取不到也照发，E_SID/E_TOK 时重取
//   详情页换新 pt 再试一轮。
// v1.0.4（2026-11-21）：每条线探活后出多行——Worker 行（system，探活+实测分辨率）、直解 hls3 行
//   （system，嵌页直解，无 token 的 hls3）、站内嗅探行（app）；F4 行探死时照样留（host 恢复后自愈），
//   不进顶层；顶层取首个活的 system 行；/resolve 改并行；loadResource 点哪条解哪条（多行回落）。
// v1.0.3（2026-11-08）：按用户验收重写播放链——详情页必须出现全部线路
//   可选入口，点哪条播哪条：
//   ① 删模块内令牌流（pt/pk/XOR 解密/ajax/Cookie 双路/逐宿主直解/会话
//   快照共 34 个符号，见删表）：播放只调已部署 sextb-hls Worker v4
//   /resolve（Worker 侧自己取详情页、走完整令牌流、回可播地址），
//   模块内不再取详情页做播放、不发 ajax、不碰 Cookie；
//   ② loadDetail 预解全部线路：F4/SW/DD/FL/ST 五条线同时进 episodes、
//   seasons[0].episodes、episodeItems（24jav 1.1.0 同款结构），集内带
//   videoUrl——F4/SW 为 Worker 直链 playerType "system"，DD/FL/ST 为
//   Worker 回的原 embed、playerType "app" 交 WebView 嗅探；某条线
//   /resolve 解不出时线名照样留出来（videoUrl 回详情页、link 留
//   durl@线 token，点它走 loadResource 再解一次），不整条线消失；
//   详情页取不到（无 html）或解析异常时也照样回五条线（规范五线
//   F4/SW/FL/DD/ST），永不回 0 集、永不只剩一条正片、永不只剩嗅探卡；
//   ③ loadResource 点哪条解哪条（单次 /resolve，指定线解不出回落
//   默认线 ep=0 再试一次，全灭回嗅探行）；已是 Worker 直链或 embed
//   直链的入参直接原样出流，不再误当详情页去解。
// v1.0.2（2026-11-08）：修播放（只动播放链，列表/分类/详情取页不动）：
//   ① loadDetail 加 unwrapLink（App 传卡片对象时旧版 String(对象) 得
//   "[object Object]"，详情取不到、0 集）；②站方改版令牌流——详情页
//   #sextb-player 已无 iframe（旧版 extractDefaultEmbed 恒空），ajax 须带
//   pt（详情页 window.__pt）+ 同会话 PHPSESSID Cookie 否则 403
//   E_TOK_LEN/E_SID（旧版 ajax 不带 pt，15 次全 403，恒回嗅探行）：
//   本版从同次详情页响应取 pt/pk（__pk 做 XOR 解 player_enc，成功后轮换
//   next_pt/next_pk），Cookie 双路——运行侧若回传响应头则显式取
//   Set-Cookie 发 Cookie 头，若不回传则靠 App 共享 Cookie jar；失败重取
//   详情页换新令牌重试一次；默认线无 iframe 时走 ajax episode=0；
//   ③真实播放行 playerType "app"→"system"（Worker 直返行，24jav/
//   chaturbate/hornyjav 同款已证可播；嗅探兜底行仍留 "app"）。
//   真机结论（2026-11-08 06:07，SSIS-804-RM）：1.0.2 仍无法播放——
//   VM nocookie 复现：ajax 30 次全 403 E_SID、F4/SW/裸链全回嗅探行；
//   且 1.0.2 的 loadDetail 只回无 videoUrl 的 token 集（episodes），
//   无 seasons/episodeItems，详情页没有可点的线路入口（用户 06:08
//   补充：压根没有线路选择，F4、SW 都不出）。根治办法即本版 v1.0.3。
WidgetMetadata = {
  id: "lai_sextb",
  title: "SexTB",
  description: "SexTB：最新/有码/无码/素人/中文字幕/无码流出/减码等 28 个分类，线路可选（F4/SW/DD/FL/ST），详情页预解全部线路、每线探活带分辨率、播放走已部署 sextb-hls Worker v6 /ajax",
  author: "lai",
  version: "1.0.7",
  requiredVersion: "0.0.1",
  site: "https://sextb.cc",
  detailCacheDuration: 180,
  modules: [
    {
      title: "搜索",
      functionName: "search",
      cacheDuration: 60,
      params: [
        { name: "keyword", title: "关键词", type: "input", value: "" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "censored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "uncensored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "amateur" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中文字幕", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "subtitle" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码流出", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "uncensored-leaked" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "减码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "reducing-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "英字幕", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "english-subtitle" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "数码有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "digital-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "低马赛克", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "minimal-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "big-tits" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中出", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "creampie" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "口交", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "blowjob" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "学生", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "school-girl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "熟女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "milf" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "成熟女性", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "mature-woman" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "蕾丝", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "lesbian" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "护士", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "nurse" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "OL", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "office-lady" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "3P4P", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "threesome" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Cosplay", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "cosplay" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "偷拍", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "voyeur" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "按摩", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "massage" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "捆绑", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "bondage" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "潮吹", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "squirting" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "女仆", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "maid" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "少女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "teen" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "FC2", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "fc2" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    {
      id: "loadResource",
      title: "SexTB播放源",
      description: "点播所选线路：按线路名出流（F4/SW/PM/FL/DD…），全灭时交网页嗅探兜底",
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

var HOSTS = ["https://sextb.cc", "https://sextb.net"];
var SITE = HOSTS[0];
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = SITE + "/";
// SexTB 专用 HLS 代理 Worker（用户已部署，沿用蜘蛛写死地址）
var SEXTB_WORKER = "https://sextb-hls.li768435813.workers.dev";

// 核心分类 + 精选题材（与蜘蛛 CATS 一致，2026-10-20 从 /genres 实测）
var CATS = [
  { type_id: "latest", type_name: "最新" },
  { type_id: "censored", type_name: "有码", slug: "censored" },
  { type_id: "uncensored", type_name: "无码", slug: "uncensored-dc02d84q" },
  { type_id: "amateur", type_name: "素人", slug: "amateur-9yvovjqr" },
  { type_id: "subtitle", type_name: "中文字幕", slug: "subtitle" },
  { type_id: "uncensored-leaked", type_name: "无码流出", slug: "uncensored-leaked-8iodxgmu" },
  { type_id: "reducing-mosaic", type_name: "减码", slug: "reducing-mosaic-o16ol1qy" },
  { type_id: "english-subtitle", type_name: "英字幕", slug: "english-subtitle-8rpwhwew" },
  { type_id: "digital-mosaic", type_name: "数码有码", slug: "digital-mosaic-merf7vyh" },
  { type_id: "minimal-mosaic", type_name: "低马赛克", slug: "minimal-mosaic-csskw5dg" },
  { type_id: "big-tits", type_name: "巨乳", slug: "big-tits-hipx7w77" },
  { type_id: "creampie", type_name: "中出", slug: "creampie-dkel1ugw" },
  { type_id: "blowjob", type_name: "口交", slug: "blowjob-6w43evzo" },
  { type_id: "school-girl", type_name: "学生", slug: "school-girl-aze0q30d" },
  { type_id: "milf", type_name: "熟女", slug: "milf-k01m582n" },
  { type_id: "mature-woman", type_name: "成熟女性", slug: "mature-woman-pj7rh291" },
  { type_id: "lesbian", type_name: "蕾丝", slug: "lesbian-9akyznh5" },
  { type_id: "nurse", type_name: "护士", slug: "nurse-kor7sr6n" },
  { type_id: "office-lady", type_name: "OL", slug: "office-lady-pjv31x9c" },
  { type_id: "threesome", type_name: "3P4P", slug: "threesome--foursome-3r7836if" },
  { type_id: "cosplay", type_name: "Cosplay", slug: "cosplay-d5rzeneh" },
  { type_id: "voyeur", type_name: "偷拍", slug: "voyeur-9thq5fr5" },
  { type_id: "massage", type_name: "按摩", slug: "massage-0ypm730h" },
  { type_id: "bondage", type_name: "捆绑", slug: "bondage-wywuaggb" },
  { type_id: "squirting", type_name: "潮吹", slug: "squirting-1t5r5wb9" },
  { type_id: "maid", type_name: "女仆", slug: "maid-vkrzm0oo" },
  { type_id: "teen", type_name: "少女", slug: "teen-gk3kz0pk" },
  { type_id: "fc2", type_name: "FC2", slug: "fc2" }
];

function t(v) {
  return String(v == null ? "" : v).trim();
}

function clean(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
}

function fixUrl(u) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return SITE + u;
  if (/^https?:\/\//.test(u)) return u;
  return SITE + "/" + u;
}

function hostOf(u) {
  var m = String(u || "").match(/^https?:\/\/([^/]+)/i);
  return m ? m[1].toLowerCase() : "";
}

function originOf(u) {
  var m = String(u || "").match(/^(https?:\/\/[^/]+)/i);
  return m ? m[1] : "";
}

function codeOf(u) {
  var path = String(u || "").split("?")[0].split("#")[0];
  var parts = path.split("/").filter(function (x) { return x !== ""; });
  return parts.length ? parts[parts.length - 1] : "";
}

function pathOf(url) {
  var u = t(url);
  var m = u.match(/^https?:\/\/[^/]+(\/.*)$/i);
  if (m) return m[1];
  return u.charAt(0) === "/" ? u : "/" + u;
}

// 拦截/验证页判定（与蜘蛛 isBlockedPage 一致，只认拦截页特有文案）
function isBlockedPage(html) {
  if (!html || typeof html !== "string") return true;
  if (html.length < 500) return true;
  var head = html.slice(0, 3000);
  if (/Your request was blocked/i.test(head)) return true;
  if (/<title>[^<]*(Just a moment|Attention Required)/i.test(head)) return true;
  if (/Performing security verification/i.test(head)) return true;
  if (/Sorry, you have been blocked/i.test(head)) return true;
  return false;
}

function pageHeaders(referer, extra) {
  var h = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.7",
    "Referer": referer || REFERER
  };
  if (extra) for (var k in extra) h[k] = extra[k];
  return h;
}

async function rawGetText(url, headers) {
  try {
    var res = await Widget.http.get(url, { headers: headers });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    if (body && !isBlockedPage(body)) {
      return body;
    }
  } catch (e) { /* 失败返回空 */ }
  return "";
}

// jina reader 兜底（直连全失败时用，与蜘蛛 fetchViaJina 一致）
async function fetchViaJina(host, path) {
  var jinaUrl = "https://r.jina.ai/" + host + path;
  try {
    var res = await Widget.http.get(jinaUrl, { headers: { "User-Agent": UA, "x-respond-with": "html" } });
    var body = res && res.data != null ? String(res.data) : "";
    if (body && !isBlockedPage(body) && (body.indexOf("tray-item") >= 0 || body.length > 5000)) return body;
  } catch (e) { /* 失败返回空 */ }
  return "";
}

// 多域名 failover 取本站页面：.cc/.net 直连，全失败再逐个走 jina
async function getHtml(url, extraHeaders) {
  var host = hostOf(url);
  if (!/sextb\.(net|cc)$/.test(host)) {
    // 非本站 URL（embed 页等）直接原地址请求，不做拦截页判定
    try {
      var res = await Widget.http.get(url, { headers: pageHeaders(host ? "https://" + host + "/" : REFERER, extraHeaders) });
      var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
      return body || "";
    } catch (e) { return ""; }
  }
  var path = pathOf(url);
  var order = [];
  var first = "https://" + host;
  if (HOSTS.indexOf(first) >= 0) order.push(first);
  for (var i = 0; i < HOSTS.length; i++) if (order.indexOf(HOSTS[i]) < 0) order.push(HOSTS[i]);
  for (var j = 0; j < order.length; j++) {
    var html = await rawGetText(order[j] + path, pageHeaders(order[j] + "/", extraHeaders));
    if (html) {
      return html;
    }
  }
  for (var k = 0; k < order.length; k++) {
    var jh = await fetchViaJina(order[k], path);
    if (jh) {
      return jh;
    }
  }
  return "";
}

// ================= 列表 / 搜索 / 详情 =================

// 卡片解析（与蜘蛛 parseCards 一致）：div.tray-item > a[href="/{code}"]
// 封面取 data-src（src 是 default-cover 占位图），标题取 img alt，番号取 tray-item-code
function parseCards(html) {
  var out = [];
  var seen = {};
  var re = /<div class="tray-item(?:\s[^"]*)?">\s*<a\s[^>]*href="(?:https?:\/\/sextb\.(?:net|cc))?(\/[a-z0-9][a-z0-9\-]{3,40})"[^>]*>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var path = m[1];
    if (seen[path]) continue;
    seen[path] = true;
    var win = html.slice(m.index, m.index + 2500);
    var title = "";
    var altM = win.match(/<img[^>]+alt="([^"]+)"/);
    if (altM) title = clean(altM[1]);
    var pic = "";
    var dsM = win.match(/data-src="(https?:\/\/[^"]+)"/) || win.match(/data-src="(\/\/[^"]+)"/);
    if (dsM && dsM[1].indexOf("default-cover") < 0) pic = fixUrl(dsM[1]);
    if (!pic) {
      var srcM = win.match(/<img[^>]+src="(https?:\/\/[^"]+)"/) || win.match(/<img[^>]+src="(\/\/[^"]+)"/);
      if (srcM && srcM[1].indexOf("default-cover") < 0) pic = fixUrl(srcM[1]);
    }
    var code = "";
    var cdM = win.match(/tray-item-code">([^<]+)</);
    if (cdM) code = clean(cdM[1]);
    var link = fixUrl(path);
    out.push({
      id: link,
      type: "url",
      title: title || code || path.replace(/^\//, ""),
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: code,
      mediaType: "movie"
    });
  }
  return out;
}

function catOf(tid) {
  for (var i = 0; i < CATS.length; i++) if (CATS[i].type_id === tid) return CATS[i];
  return CATS[0];
}

function catUrl(cat, page) {
  if (cat.type_id === "latest") {
    return page > 1 ? SITE + "/pg-" + page : SITE + "/";
  }
  var slug = cat.slug || cat.type_id;
  var base = slug.indexOf("/") >= 0 ? SITE + "/" + slug : SITE + "/genre/" + slug;
  return page > 1 ? base + "/pg-" + page : base;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var tid = t(params.path || params.cat || "latest");
  try {
    var html = await getHtml(catUrl(catOf(tid), page));
    if (!html) return [{ id: "err", type: "url", title: "载入失败（站点无响应或被拦截）" }];
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
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
  var page = parseInt(params.page, 10) || 1;
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词搜索" }];
  var url = SITE + "/search/" + encodeURIComponent(wd);
  if (page > 1) url += "/pg-" + page;
  try {
    var html = await getHtml(url);
    if (!html) return [{ id: "err", type: "url", title: "搜索失败（站点无响应或被拦截）" }];
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

// 从详情页提取 filmId 和服务器（episode）列表
function extractPlayerInfo(html) {
  var filmId = "";
  var fm = html.match(/filmId\s*=\s*["']?(\d+)/);
  if (fm) filmId = fm[1];
  var episodes = [];
  var re = /<button[^>]*class="[^"]*btn-player episode[^"]*"[^>]*data-source="(\d+)"[^>]*data-id="(\d+)"[^>]*>(?:<i[^>]*><\/i>)?\s*([A-Z0-9]+)</g;
  var m;
  while ((m = re.exec(html)) !== null) {
    episodes.push({ filmId: m[1], episode: m[2], name: m[3] });
  }
  return { filmId: filmId, episodes: episodes };
}

// ================= 线路分集 + 点播解析（v1.0.1） =================

// 线路 token：<详情页>@<线路真名>（如 https://sextb.cc/jur-914@SW）；
// 无后缀 = 默认链；"sniff:" 前缀 = 网页嗅探兜底。
function lineToken(durl, line) {
  return durl + "@" + line;
}

function parseLineToken(raw) {
  var s = t(raw);
  var m = s.match(/@([A-Za-z0-9]+)$/);
  if (m) return { durl: s.slice(0, -m[0].length), line: m[1].toUpperCase() };
  return { durl: s, line: "" };
}

// App 运行时常把卡片对象直接传给 loadDetail（chaturbate/24jav 同款）：
// 先摊平成字符串再用，String(对象) 会得 "[object Object]" 而断链。
function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

// ---------- 设备侧 ajax（v1.0.6）：Worker /ajax 已死，见文件头 ----------
// Set-Cookie -> Cookie 头（只取真实 cookie 名值，剔 expires/path/domain 等属性；
// lai_javdo 同款写法，Widget.http 回传响应头时可用，取不到则回空串）。
function cookieFromHeaders(headers) {
  try {
    if (!headers) return "";
    var raw = "";
    if (typeof headers.getSetCookie === "function") {
      var arr = headers.getSetCookie();
      if (arr && arr.length) raw = arr.join(", ");
    }
    if (!raw) raw = headers["set-cookie"] || headers["Set-Cookie"] || "";
    if (Array.isArray(raw)) raw = raw.join(", ");
    if (typeof raw !== "string" || !raw) return "";
    var attrs = { expires: 1, path: 1, domain: 1, "max-age": 1, samesite: 1, secure: 1, httponly: 1 };
    var pairs = [];
    var seen = {};
    var re = /([A-Za-z0-9_-]+)=([^;,]+)/g;
    var m;
    while ((m = re.exec(raw))) {
      var name = m[1];
      if (attrs[name.toLowerCase()]) continue;
      if (seen[name]) continue;
      seen[name] = 1;
      pairs.push(name + "=" + m[2]);
    }
    return pairs.join("; ");
  } catch (e) { return ""; }
}

// 直取详情页，同时拿 Cookie（与 pt 同会话；只走直连，jina 腿无 Cookie）
async function fetchDetailFull(durl) {
  var host = hostOf(durl);
  var order = [];
  var first = "https://" + host;
  if (HOSTS.indexOf(first) >= 0) order.push(first);
  for (var i = 0; i < HOSTS.length; i++) if (order.indexOf(HOSTS[i]) < 0) order.push(HOSTS[i]);
  for (var j = 0; j < order.length; j++) {
    var url = order[j] + pathOf(durl);
    try {
      var res = await Widget.http.get(url, { headers: pageHeaders(order[j] + "/", null) });
      var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
      if (body && !isBlockedPage(body)) {
        var hdrs = (res && res.headers) || {};
        return { html: body, cookie: cookieFromHeaders(hdrs) };
      }
    } catch (e) { /* 换下一个域名 */ }
  }
  return { html: "", cookie: "" };
}

var B64TAB = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64ToBytes(b64) {
  var clean = String(b64 || "").replace(/[^A-Za-z0-9+/=]/g, "");
  while (clean.length % 4) clean += "=";
  var rev = {};
  var i;
  for (i = 0; i < B64TAB.length; i++) rev[B64TAB[i]] = i;
  var out = [];
  for (i = 0; i + 4 <= clean.length; i += 4) {
    var c0 = rev[clean[i]];
    var c1 = rev[clean[i + 1]];
    var c2 = clean[i + 2] === "=" ? 0 : rev[clean[i + 2]];
    var c3 = clean[i + 3] === "=" ? 0 : rev[clean[i + 3]];
    if (c0 == null || c1 == null || c2 == null || c3 == null) return null;
    out.push((c0 << 2) | (c1 >> 4));
    if (clean[i + 2] !== "=") out.push(((c1 & 15) << 4) | (c2 >> 2));
    if (clean[i + 3] !== "=") out.push(((c2 & 3) << 6) | c3);
  }
  return out;
}
// XOR 解密 player_enc（Worker xorDecryptPlayer 同款，纯字符串操作）
function xorDecryptPlayer(enc, key) {
  if (!enc || !key) return "";
  var bytes = b64ToBytes(enc);
  if (!bytes || !bytes.length) return "";
  var out = "";
  for (var i = 0; i < bytes.length; i++) out += String.fromCharCode(bytes[i] ^ key.charCodeAt(i % key.length));
  return out;
}
function iframeSrc(playerHtml) {
  var html = String(playerHtml || "");
  var em = html.match(/<iframe[^>]+src="(https?:\/\/[^"]+)"/) || html.match(/<iframe[^>]+src="(\/\/[^"]+)"/);
  if (!em) return "";
  return em[1].indexOf("//") === 0 ? "https:" + em[1] : em[1];
}
function embedFromAjaxJson(j, pk) {
  if (!j || j.error) return "";
  if (j.player) return iframeSrc(j.player);
  if (j.player_enc && pk) return iframeSrc(xorDecryptPlayer(j.player_enc, pk));
  return "";
}

// 设备侧 POST /ajax/player（Worker v4Ajax 同款请求体与请求头）
async function postAjaxPlayer(origin, filmId, episode, pt, pk, cookie) {
  if (!Widget.http || typeof Widget.http.post !== "function") return "";
  var body = "episode=" + encodeURIComponent(episode) + "&filmId=" + encodeURIComponent(filmId) + "&pt=" + encodeURIComponent(pt);
  var headers = {
    "User-Agent": UA,
    "Referer": origin + "/",
    "Origin": origin,
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest"
  };
  if (cookie) headers["Cookie"] = cookie;
  try {
    var res = await Widget.http.post(origin + "/ajax/player", body, { headers: headers, timeout: 12000 });
    var raw = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    var j = null;
    try { j = raw ? JSON.parse(raw) : null; } catch (e) { j = null; }
    var em = embedFromAjaxJson(j, pk);
    if (em) return em;
  } catch (e) { /* 失败 */ }
  return "";
}

// 解析一条线路的嵌页（v1.0.6：设备侧 ajax 为主，Worker /ajax 仅作回落）。
// 回包形状不变：F4 嵌页 → Worker /f4 直链（sniff:false），其余 → 嵌页（sniff:true）。
async function resolveViaWorker(durl, ep) {
  var origin = "";
  try { origin = new URL(durl).origin; } catch (e) { return null; }
  for (var round = 0; round < 2; round++) {
    // 直取详情页 + Cookie（同会话）；直取失败回落 getHtml（jina，无 Cookie）
    var html = "";
    var cookie = "";
    var det = await fetchDetailFull(durl);
    if (det.html) { html = det.html; cookie = det.cookie; }
    else html = await getHtml(durl);
    if (!html) return null;
    var pt = (html.match(/window\.__pt\s*=\s*"([0-9a-fA-F]{32})"/) || [])[1] || "";
    var pk = (html.match(/window\.__pk\s*=\s*"([0-9a-fA-F]{32})"/) || [])[1] || "";
    var info = extractPlayerInfo(html);
    if (!pt || !info.filmId || !info.episodes.length) return null;
    var epObj = null;
    if (ep && ep !== "0") {
      for (var i = 0; i < info.episodes.length; i++) {
        if (String(info.episodes[i].name).toUpperCase() === String(ep).toUpperCase()) { epObj = info.episodes[i]; break; }
      }
    }
    if (!epObj) epObj = info.episodes[0];
    if (!epObj) return null;
    // 主：设备侧 POST
    var embed = await postAjaxPlayer(origin, epObj.filmId || info.filmId, epObj.episode, pt, pk, cookie);
    if (embed) {
      var host = hostOf(embed);
      if (isF4Host(host)) {
        return { ok: true, url: SEXTB_WORKER + "/f4?u=" + encodeURIComponent(embed) + "&r=" + encodeURIComponent(durl), host: "f4", line: epObj.name, sniff: false };
      }
      return { ok: true, url: embed, host: host, line: epObj.name, sniff: true };
    }
    // 回落：Worker /ajax（站方 403 封 CF，基本已死，留作兜底）
    var u = SEXTB_WORKER + "/ajax?o=" + encodeURIComponent(origin)
      + "&filmId=" + encodeURIComponent(epObj.filmId || info.filmId)
      + "&episode=" + encodeURIComponent(epObj.episode)
      + "&pt=" + encodeURIComponent(pt) + "&pk=" + encodeURIComponent(pk);
    try {
      var res = await Widget.http.get(u, { headers: { "User-Agent": UA } });
      var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
      var o = null;
      try { o = body ? JSON.parse(body) : null; } catch (e) { o = null; }
      if (o && o.ok && o.embed) {
        var embed2 = String(o.embed);
        var host2 = hostOf(embed2);
        if (isF4Host(host2)) {
          return { ok: true, url: SEXTB_WORKER + "/f4?u=" + encodeURIComponent(embed2) + "&r=" + encodeURIComponent(durl), host: "f4", line: epObj.name, sniff: false };
        }
        return { ok: true, url: embed2, host: host2, line: epObj.name, sniff: true };
      }
    } catch (e) { /* 下一轮换新 pt */ }
  }
  return null;
}

// 主播单最高分辨率（只读实测值，没有就回 0，绝不编造）
function topResOf(text) {
  var top = 0;
  var re = /RESOLUTION=(\d+)x(\d+)/gi;
  var m;
  while ((m = re.exec(String(text || "")))) {
    var h = parseInt(m[2], 10) || 0;
    if (h > top) top = h;
  }
  return top;
}

// 探播单：{alive: true 主播单可读 / false 明确死了 / null 探不到}；探不到按活处理，不藏线
async function probePlaylist(url, headers) {
  try {
    var res = await Widget.http.get(url, { headers: headers || { "User-Agent": UA }, timeout: 15000 });
    var body = res && res.data != null ? String(res.data) : "";
    if (body.indexOf("#EXTM3U") >= 0) return { alive: true, topH: topResOf(body) };
    if (/no playable playlist|embed fetch|f4 embed|playlist fetch failed|not a playlist|bad u/i.test(body)) return { alive: false, topH: 0 };
    return { alive: null, topH: 0 };
  } catch (e) {
    return { alive: null, topH: 0 };
  }
}

function jsUnescapeSingle(s) {
  return String(s || "").replace(/\\(.)/g, function (m, c) {
    if (c === "n") return "\n";
    if (c === "r") return "\r";
    if (c === "t") return "\t";
    return c;
  });
}

// 纯字符串 Dean Edwards packer 解包（Worker 同款逻辑，禁 eval，纯字符串运算）
function unpackDeanEdwards(html) {
  var m = String(html || "").match(/eval\(function\(p,a,c,k,e,d\)[\s\S]*?\}\s*\(\s*'((?:[^'\\]|\\.)*)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:[^'\\]|\\.)*)'\.split\('\|'\)/);
  if (!m) return "";
  var p = jsUnescapeSingle(m[1]);
  var a = parseInt(m[2], 10);
  var c = parseInt(m[3], 10);
  var k = jsUnescapeSingle(m[4]).split("|");
  var enc = function (n) {
    return (n < a ? "" : enc(Math.floor(n / a))) + ((n % a) > 35 ? String.fromCharCode((n % a) + 29) : (n % a).toString(36));
  };
  var i = c;
  while (i--) {
    if (k[i]) {
      var word = k[i];
      p = p.replace(new RegExp("\\b" + enc(i) + "\\b", "g"), function () { return word; });
    }
  }
  return p;
}

// 从解包文本提取 hls 链接：hls2/hls3/hls4…，兜底找 file: 的 m3u8
function extractHlsLinks(text) {
  var links = {};
  var re = /"hls(\d+)"\s*:\s*"([^"]+)"/g;
  var m;
  while ((m = re.exec(String(text || "")))) links["hls" + m[1]] = m[2];
  if (!Object.keys(links).length) {
    var f = String(text || "").match(/"file"\s*:\s*"(https?:[^"]+?\.m3u8[^"]*)"/) || String(text || "").match(/(https?:\/\/[^\s"'\\]+\.m3u8[^\s"'\\]*)/);
    if (f) links.hls2 = f[1];
  }
  return links;
}

function resolveAbs(uri, base) {
  uri = t(uri);
  if (!uri) return "";
  if (/^https?:\/\//i.test(uri)) return uri;
  if (uri.indexOf("//") === 0) return "https:" + uri;
  var m = String(base || "").match(/^(https?:\/\/[^\/]+)(\/.*)?$/i);
  if (!m) return uri;
  var origin = m[1];
  var path = m[2] || "/";
  if (uri.charAt(0) === "/") return origin + uri;
  var dir = path.slice(0, path.lastIndexOf("/") + 1);
  return origin + dir + uri;
}

function isF4Host(host) {
  return /f4scdn\.com|f4jav\.xyz|f4splay\.vip/i.test(host || "");
}

function workerUrl(embed, durl) {
  var f4 = isF4Host(hostOf(embed));
  return SEXTB_WORKER + (f4 ? "/f4" : "/v") + "?u=" + encodeURIComponent(embed) + "&r=h";
}

// 直解嵌页：取嵌页（设备 IP）→ 解 packer → 取 hls3（无 token）或 hls2；
// hls4 不要（其变体是带 PNG 假头的广告播单，直链无 Worker 剥头，原生播放器播不了）。
// 返回 {url, topH} 或 null；主播单探不到分辨率时 topH 为 0，地址照样可用。
async function extractDirectHls(embed, referer) {
  try {
    var res = await Widget.http.get(embed, { headers: { "User-Agent": UA, "Referer": referer || REFERER }, timeout: 20000 });
    var html = res && res.data != null ? String(res.data) : "";
    if (!html) return null;
    var links = extractHlsLinks(unpackDeanEdwards(html) || html);
    var raw = links.hls3 || links.hls2 || "";
    if (!raw) return null;
    var url = resolveAbs(raw, embed);
    var topH = 0;
    try {
      var pr = await probePlaylist(url, { "User-Agent": UA, "Referer": embed });
      if (pr.alive) topH = pr.topH;
    } catch (e) { /* 探不到按活处理 */ }
    return { url: url, topH: topH };
  } catch (e) {
    return null;
  }
}

// 单条线解线：Worker 行（system，探活+分辨率）→ 直解 hls3 行（system）→ 站内嗅探行（app）。
// r 为 /resolve 回包（或 null）；嗅探回包自带嵌页地址。F4 无嵌页可直解，Worker 行
// 探死时照样留出来（host 恢复后自愈），live=false 的行不进顶层。
async function resolveLine(line, durl, r) {
  var rows = [];
  var embed = (r && r.sniff) ? r.url : "";
  var wUrl = "";
  if (r && r.ok && !r.sniff) wUrl = r.url;
  else if (embed) wUrl = workerUrl(embed, durl);
  if (wUrl) {
    var probe = await probePlaylist(wUrl, { "User-Agent": UA });
    if (probe.alive) {
      rows.push({ name: line + (probe.topH ? " · " + probe.topH + "p" : ""), url: wUrl, playerType: "system", customHeaders: { "User-Agent": UA }, live: true });
      if (embed) {
        var d0 = await extractDirectHls(embed, durl);
        if (d0) {
          rows.push({ name: line + "·直链" + (d0.topH ? "·" + d0.topH + "p" : ""), url: d0.url, playerType: "system", customHeaders: { "User-Agent": UA }, live: true });
        }
        rows.push({ name: line + "·站内播放", url: embed, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl }, live: true });
      }
      return rows;
    }
    if (probe.alive === null) {
      rows.push({ name: line, url: wUrl, playerType: "system", customHeaders: { "User-Agent": UA }, live: true });
      return rows;
    }
    if (!embed) {
      rows.push({ name: line, url: wUrl, playerType: "system", customHeaders: { "User-Agent": UA }, live: false });
      return rows;
    }
  }
  if (embed) {
    var d = await extractDirectHls(embed, durl);
    if (d) {
      rows.push({ name: line + "·直链" + (d.topH ? "·" + d.topH + "p" : ""), url: d.url, playerType: "system", customHeaders: { "User-Agent": UA }, live: true });
      rows.push({ name: line + "·站内播放", url: embed, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl }, live: true });
      return rows;
    }
    rows.push({ name: line + "·站内播放", url: embed, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl }, live: true });
    return rows;
  }
  return rows;
}

// 详情页线路入口：每条线同时进 episodes、seasons[0].episodes、episodeItems，集内带 videoUrl。
// rowsByLine 为 {线名: [行...]}；某条线一行都解不出时线名照样留出来（videoUrl 回详情页、
// link 留 token，点它走 loadResource 再解一次），不整条线消失。
function lineEntries(durl, lines, rowsByLine, pic) {
  var eps = [];
  var seasonEps = [];
  var items = [];
  var liveArr = [];
  for (var i = 0; i < lines.length; i++) {
    var nm = t(lines[i]).toUpperCase();
    if (!nm) continue;
    var tok = lineToken(durl, nm);
    var rows = rowsByLine ? rowsByLine[nm] : null;
    if (!rows || !rows.length) {
      eps.push({ name: nm, id: tok, link: tok });
      seasonEps.push({ title: nm, videoUrl: durl, episodeNumber: eps.length, customHeaders: { "User-Agent": UA, "Referer": durl } });
      items.push({ id: tok, type: "url", title: nm, mediaType: "movie", posterPath: pic, videoUrl: durl, link: tok, episode: eps.length, episodeNumber: eps.length, seasonIndex: 1, seasonNumber: 1, customHeaders: { "User-Agent": UA, "Referer": durl }, playerType: "app", description: nm + "线未解出，点播重试" });
      liveArr.push(true);
      continue;
    }
    for (var j = 0; j < rows.length; j++) {
      var row = rows[j];
      eps.push({ name: row.name, id: tok, link: tok });
      seasonEps.push({ title: row.name, videoUrl: row.url, episodeNumber: eps.length, customHeaders: row.customHeaders });
      items.push({ id: row.url, type: "url", title: row.name, mediaType: "movie", posterPath: pic, videoUrl: row.url, link: row.url, episode: eps.length, episodeNumber: eps.length, seasonIndex: 1, seasonNumber: 1, customHeaders: row.customHeaders, playerType: row.playerType });
      liveArr.push(row.live !== false);
    }
  }
  return { episodes: eps, seasonEps: seasonEps, items: items, liveArr: liveArr };
}

// loadDetail 只取详情页、不逐线解析：每条线路一集（集名即线路真名）
// （F4/SW/PM/FL/DD/US/ST/PP，按 F4>SW>PM>FL>DD>US>ST>PP 排序）；
// 点集时 stream 模块 loadResource 按所选线路现解。App 的季名按顺序
// 写死第 N 季、模块改不了，线路名只放集标题。
// v1.0.3：详情页取页/标题/封面解析一字不动；回包改为全量线路入口——
// 每条线预解 /resolve，同时进 episodes、seasons、episodeItems，集内带
// videoUrl（F4/SW 为 Worker 直链 system 行，DD/FL/ST 为原 embed 的
// app 嗅探行）；取不到详情页或解析异常时也回规范五线，永不 0 集。
// ---- AVDB 样式详情：分类小卡片（点按出该分类的全部内容）----
var TAX_GENRE_RE = /\/(genres?|tags?|categor(?:y|ies)|labels?|makers?)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)|labels?|makers?|all|全部|分类|标签|题材|片商)$/i;
function extractGenreItemsFromHtml(html) {
  var out = [];
  var seen = {};
  var baseHost = String(SITE || "").replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  html = String(html || "");
  while ((m = re.exec(html)) !== null) {
    var href = m[1] || "";
    var name = String(m[2] || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (!name || name.length > 40 || TAX_NAV_NAME_RE.test(name)) continue;
    var abs = fixUrl(href);
    if (!/^https?:\/\//i.test(abs)) continue;
    var host = abs.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (baseHost && host !== baseHost && host !== "sextb.net" && host !== "sextb.cc") continue;
    if (!TAX_GENRE_RE.test(abs)) continue;
    var after = abs.split(/\/(?:genres?|tags?|categor(?:y|ies)|labels?|makers?)\//i)[1] || "";
    after = after.split("?")[0].split("#")[0].replace(/\/+$/, "");
    if (!after) continue;
    if (seen[abs]) continue;
    seen[abs] = 1;
    out.push({ id: abs, title: name });
    if (out.length >= 20) break;
  }
  return out;
}

async function loadDetail(link) {
  var durl = unwrapLink(link);
  try {
    if (!/^https?:\/\//.test(durl)) durl = fixUrl(durl);
    // AVDB 样式：点按分类（/genre/<slug>/）→ 该分类的全部影片（只加路由与分类卡片，不动播放逻辑）。
    var genreM = durl.match(/\/genre\/([^/?#]+)\/?/i);
    if (genreM) {
      var gSlug = genreM[1];
      var gCat = null;
      for (var gi = 0; gi < CATS.length; gi++) {
        if (CATS[gi].slug === gSlug) { gCat = CATS[gi]; break; }
      }
      var gWorks = [];
      try {
        if (gCat) gWorks = await loadList({ path: gCat.type_id, page: 1 });
        else {
          var gName = "";
          try { gName = decodeURIComponent(gSlug); } catch (_) { gName = gSlug; }
          gWorks = await search({ keyword: gName, page: 1 });
        }
      } catch (e) { gWorks = []; }
      if (!Array.isArray(gWorks)) gWorks = [];
      var gReal = gWorks.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
      var gTitle = gCat ? gCat.type_name : gSlug;
      return {
        id: durl,
        type: "detail",
        mediaType: "movie",
        title: gTitle,
        link: durl,
        description: "分类 · 共 " + gReal.length + " 部作品",
        videoUrl: "",
        childItems: [],
        relatedItems: gReal.length ? gReal : gWorks
      };
    }
    var html = await getHtml(durl);
    // 页面没有播放器标记（疑似拦截页）时换镜像域名再抓一次（与蜘蛛 play 一致）
    function hasPlayer(h) { return !!h && (h.indexOf("sextb-player") >= 0 || h.indexOf("btn-player") >= 0); }
    if (html && !hasPlayer(html)) {
      var alt = durl.replace(/sextb\.(cc|net)/i, function (mm, g) { return "sextb." + (g.toLowerCase() === "cc" ? "net" : "cc"); });
      if (alt !== durl) {
        var h2 = await getHtml(alt);
        if (hasPlayer(h2)) html = h2;
      }
    }

    // 标题
    var name = "";
    var tm = html.match(/<title>([^<]*)<\/title>/);
    if (tm) name = clean(tm[1]).replace(/\s*-\s*SEXTB.*$/i, "").replace(/Free JAV.*$/i, "").trim();
    // 封面：页面内 webp poster（公开 CDN 直读）> video poster > og:image
    var pic = "";
    var wm = html.match(/data-src="(https?:\/\/cdn001\.imggle\.net\/webp\/poster[^"]+)"/);
    if (wm) pic = wm[1];
    if (!pic) {
      var vm2 = html.match(/<video[^>]+poster="(https?:\/\/[^"]+)"/);
      if (vm2) pic = vm2[1];
    }
    if (!pic) {
      var ogm = html.match(/<meta property="og:image" content="([^"]+)"/);
      if (ogm) pic = ogm[1];
    }
    pic = fixUrl(pic);

    var info = html ? extractPlayerInfo(html) : { filmId: "", episodes: [] };
    var PREF = { F4: 0, SW: 1, PM: 2, FL: 3, DD: 4, US: 5, ST: 6, PP: 7 };
    var sorted = info.episodes.slice().sort(function (a, b) {
      var pa = PREF[t(a.name).toUpperCase()] != null ? PREF[t(a.name).toUpperCase()] : 90;
      var pb = PREF[t(b.name).toUpperCase()] != null ? PREF[t(b.name).toUpperCase()] : 90;
      return pa - pb;
    });
    var lines = [];
    var seenName = {};
    for (var i = 0; i < sorted.length; i++) {
      var nm = t(sorted[i].name).toUpperCase();
      if (!nm || seenName[nm]) continue;
      seenName[nm] = true;
      lines.push(nm);
    }
    // 解析不到线路名（详情页无响应/结构变了）时也回规范五线，不回 0 集
    if (!lines.length) lines = ["F4", "SW", "FL", "DD", "ST"];
    // 逐线串行、每线用新鲜 pt（2026-11-23）：pt 一次一用，并行共用 60 秒缓存的
    // 同一 pt 时只有第一线能通。串行且每线先清缓存重取详情页，每线拿到自己的
    // 新鲜 pt 再调 Worker /ajax。
    var resolved = {};
    for (var j = 0; j < lines.length; j++) {
      delete ajaxHtmlCache[durl];
      resolved[lines[j]] = await resolveViaWorker(durl, lines[j]);
    }
    var rowsByLine = {};
    await Promise.all(lines.map(function (ln) {
      return resolveLine(ln, durl, resolved[ln]).then(function (rows) { rowsByLine[ln] = rows; }).catch(function () { rowsByLine[ln] = []; });
    }));
    var built = lineEntries(durl, lines, rowsByLine, pic);
    var episodes = built.episodes;
    episodes.push({ name: "网页嗅探·兜底", id: "sniff:" + durl, link: "sniff:" + durl });
    var topUrl = "";
    var topType = "app";
    for (var k = 0; k < built.items.length; k++) {
      if (built.items[k].playerType === "system" && built.liveArr[k]) { topUrl = built.items[k].videoUrl; topType = "system"; break; }
    }
    if (!topUrl) {
      for (var k2 = 0; k2 < built.items.length; k2++) {
        if (built.items[k2].playerType !== "system") { topUrl = built.items[k2].videoUrl; topType = built.items[k2].playerType; break; }
      }
    }
    if (!topUrl && built.items.length) { topUrl = built.items[0].videoUrl; topType = built.items[0].playerType; }
    var ret = {
      id: durl,
      type: "detail",
      title: name || durl,
      name: name || durl,
      link: durl,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: name || (html ? "" : "详情页无响应，线路入口保留，点播时现解"),
      videoUrl: topUrl,
      playerType: topType,
      customHeaders: { "User-Agent": UA },
      episodes: episodes,
      seasons: [{ seasonNumber: 1, title: "线路", name: "线路", episodes: built.seasonEps }],
      episodeItems: built.items
    };
    var taxGenres = extractGenreItemsFromHtml(html || "");
    if (taxGenres.length) ret.genreItems = taxGenres;
    return ret;
  } catch (e) {
    // 异常也不回 0 集：五条线照样留名，点播时现解
    var lines2 = ["F4", "SW", "FL", "DD", "ST"];
    var built2 = lineEntries(durl || String(link || "err"), lines2, null, "");
    var eps2 = built2.episodes;
    eps2.push({ name: "网页嗅探·兜底", id: "sniff:" + (durl || ""), link: "sniff:" + (durl || "") });
    return { id: durl || String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e), episodes: eps2, seasons: [{ seasonNumber: 1, title: "线路", name: "线路", episodes: built2.seasonEps }], episodeItems: built2.items };
  }
}

// 嗅探兜底行：交播放器 WebView 嗅探详情页（与蜘蛛 parse:1 兜底同义）
function sniffLine(durl) {
  return [{
    name: "网页嗅探",
    url: durl,
    playerType: "app",
    customHeaders: { "User-Agent": UA, "Referer": REFERER },
    description: "各线路均未解出，交播放器 WebView 嗅探详情页。"
  }];
}

// stream 模块入口：点集时按所选线路现解（v1.0.4：只调 Worker /resolve，现解多行，
// 模块内不再取详情页、不做 ajax、不碰 Cookie）。
// token 形如 <durl>@<线路名>；无后缀 = 默认链；sniff: 前缀 = 嗅探兜底；
// 已是 Worker 直链（/f4?//v?）或 embed 直链的入参直接原样出流。
async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = unwrapLink(params.link || params.url || params.id || (params.item && (params.item.link || params.item.id || params.item.url)) || "");
  if (!raw) return [];
  if (raw.indexOf("sniff:") === 0) {
    var sd = raw.slice(6);
    return sd ? sniffLine(sd) : [];
  }
  // 已是 Worker 直链：直接出 system 行（详情页 episodeItems 点播即此路）
  if (raw.indexOf(SEXTB_WORKER + "/f4?") === 0 || raw.indexOf(SEXTB_WORKER + "/v?") === 0) {
    return [{ name: "SexTB播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA } }];
  }
  // 已是某线路 embed 直链（非本站 URL）：交 WebView 嗅探
  if (/^https?:\/\//.test(raw) && raw.indexOf("sextb.") < 0) {
    return [{ name: "网页嗅探", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": REFERER }, description: "各线路均未解出，交播放器 WebView 嗅探详情页。" }];
  }
  var tok = parseLineToken(raw);
  var durl = tok.durl;
  var hint = tok.line;
  if (!/^https?:\/\//.test(durl)) durl = fixUrl(durl);
  try {
    // 点哪条解哪条；Worker 侧完整令牌流，再每条线解成多行
    var r = hint ? await resolveViaWorker(durl, hint) : await resolveViaWorker(durl, "0");
    var rows = await resolveLine(hint || (r && r.line) || "SexTB播放", durl, r);
    if (rows.length) {
      var out = [];
      for (var i = 0; i < rows.length; i++) out.push({ name: rows[i].name, url: rows[i].url, playerType: rows[i].playerType, customHeaders: rows[i].customHeaders });
      return out;
    }
    // 指定线解不出时回落默认线再试一次（已是默认线则不重试）
    if (hint) {
      var r0 = await resolveViaWorker(durl, "0");
      var rows0 = await resolveLine((r0 && r0.line) || "SexTB播放", durl, r0);
      if (rows0.length) {
        var out0 = [];
        for (var i2 = 0; i2 < rows0.length; i2++) out0.push({ name: rows0[i2].name, url: rows0[i2].url, playerType: rows0[i2].playerType, customHeaders: rows0[i2].customHeaders });
        return out0;
      }
    }
    return sniffLine(durl);
  } catch (e) {
    return sniffLine(durl);
  }
}
