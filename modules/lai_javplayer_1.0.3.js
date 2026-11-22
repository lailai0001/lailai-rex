// JavPlayer for REX (lai_javplayer v1.0.2)
// v1.0.1（2026-11-21）：补顶层 search 键（A 键，照 64 个可见模块的众数形状）；B 条目与 search 函数一个字未动。
// 移植自 mira-cat 蜘蛛 py_javplayer.js（只读蓝图），后端 https://javplayer.org（与 javct 同模板 family）。
// 列表：卡片 <a href="/v/{slug}" class="card__play">，封面取锚点前 900 字内最后一个 <img> 的 data-src
//   （src 是 default-cover.jpg 占位，真实封面 cdn001/cdn002.imggle.net）；标题按 card__title 顺序补，番号按顺序补。
// 分页：24 条/页。/new-releases 与 /search/<kw> 用干净分页 /pg-N；
//   /censored、/subtitle、/category/<slug> 用带 hash 分页 /<path>-<hash>/pg-N，hash 现取现解析，轮换时刷新一次重试。
// 详情：/v/{slug}；服务器按钮 switch-source（F4/DD/US，VIP 按钮绝不碰），data-source=filmId，data-id=episode；
//   页内 window.__pt/__pk；POST /ajax/player（body episode/filmId/pt，头 X-Requested-With），
//   返回 player_enc（xor 解密，密钥 __pk，纯字符串运算）或 player（iframe）；嵌页按 host 分流到已部署的
//   sextb-hls Worker（f4scdn/f4jav 走 /f4，其余走 /v）。站方给的是服务器选择，不是分辨率档，不编造清晰度。
// 取数：先走蜘蛛原文的 site-fetch Worker（https://site-fetch.li768435813.workers.dev，allowlist 含 javplayer.org，
//   地址原样沿用、未新造、未改 allowlist），再走 jina，最后直连；首个拿到真实 HTML 的胜出。
//   站方有 WAF（VM 直连 403）：模块先 GET 首页暖会话；App 端 req 能否过墙、cookie 是否跨请求保持、
//   /ajax/player 实况、DD/US 嵌页 host、正片 master 档位，均待真机验。
// 关键词分类 kw_jianma（番号 -rm 后缀）与 kw_zhifu（制服关键词）沿用猫源机理：扫 /new-releases 底页、
//   只用卡片自带标题+番号匹配（不逐卡抓详情），上限 8 页。
// 字幕：猫源有字幕聚合线，但其 6 秒预算依赖计时器，REX 沙箱禁计时器，无法照搬；本模块暂不接字幕线，见遗留风险。

WidgetMetadata = {
  id: "lai_javplayer",
  title: "JavPlayer",
  description: "JavPlayer（javplayer.org）：最新/减码/巨乳等分类，详情 POST 取线走 site-fetch 与已部署 sextb-hls Worker",
  author: "lai",
  version: "1.0.3",
  requiredVersion: "0.0.1",
  site: "https://javplayer.org",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/new-releases" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "减码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "kw_jianma" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/big-tits" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "大屁股", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/big-asses" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/married-woman" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "制服", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "kw_zhifu" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中出", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/creampie" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/amateur" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/uncensored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "字幕", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/subtitle" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/censored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "肛交", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/anal" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "AV偶像", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/av-idol" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "美少女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/beautiful-girl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "美穴", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/beautiful-pussy" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "口交", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/blowjob" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "捆绑", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/bondage" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "多人颜射", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/bukkake" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "出轨人妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/cheating-wife" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "角色扮演", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/cosplay" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "射精", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/cumshot" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "深喉", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/deep-throat" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "后入", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/doggy-style" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "剧情", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/drama" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "颜射", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/facials" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "明星女优", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/featured-actress" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "女上司", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/female-boss" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "恋足", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/foot-fetish" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "手淫", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/handjob" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨根", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/huge-dick-large-dick" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "爆乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/huge-tits" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "偶像明星", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/idol--celebrity" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "乱伦", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/incest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无修正", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/jav-uncensored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "女同", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/lesbian" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "内衣", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/lingerie" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "按摩", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/massage" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "成熟女性", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/mature-woman" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "熟妇", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/milf" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "美乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/nice-tits" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "OL", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/office-lady" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "群交", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/orgy" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "野外", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/outdoor" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "妓女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/prostitutes" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "强奸", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/rape" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "校园女生", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/school-girls" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "情趣用品", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/sex-toys" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "羞耻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/shame" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "人妖", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/shemale" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "苗条", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/slender" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "潮吹", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/squirting" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "继亲", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/stepfamily" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "继母", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/stepmom" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "高个女孩", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/tall-girl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "3P4P", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/threesome--foursome" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "各行各业", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/various-worker" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "偷窥", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/voyeur" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "排尿", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/urination" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "虐待", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/abuse" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "薄码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/reducing-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "自慰", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/masturbation" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "绿帽", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/cuckold" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "痴女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/slut" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "英文字幕", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/english-subtitle" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
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

var HOST = "https://javplayer.org";
var WORKER = "https://sextb-hls.li768435813.workers.dev";
var SITE_FETCH = "https://site-fetch.li768435813.workers.dev";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function cleanText(s) {
  return t(t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/&#x([0-9a-fA-F]+);/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); })
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " "));
}

function firstMatch(text, re, idx) {
  var m = String(text || "").match(re);
  return m ? t(m[idx || 1] || "") : "";
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": referer || HOST + "/"
  };
}

function looksRealHtml(s) {
  return !!s && s.length > 2000 && !/Your request was blocked|Just a moment|Checking your browser|Attention Required|cf-challenge/i.test(s);
}

async function httpGetText(url, headers) {
  var res = await Widget.http.get(url, { headers: headers });
  return res && res.data != null ? String(res.data) : "";
}

async function getText(url, referer) {
  var headers = pageHeaders(referer);
  try {
    var viaWorker = await httpGetText(SITE_FETCH + "/?u=" + encodeURIComponent(url), headers);
    if (looksRealHtml(viaWorker)) return viaWorker;
  } catch (e) { /* 落到下一腿 */ }
  try {
    var viaJina = await httpGetText("https://r.jina.ai/" + url, {
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Referer": referer || HOST + "/",
      "x-respond-with": "html"
    });
    if (looksRealHtml(viaJina)) return viaJina;
  } catch (e) { /* 落到直连 */ }
  try {
    return await httpGetText(url, headers);
  } catch (e) {
    return "";
  }
}

async function warmSession() {
  try { await getText(HOST + "/", HOST + "/"); } catch (e) { /* 暖会话失败不阻断 */ }
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

function xorDecrypt(enc, key) {
  if (!enc) return "";
  var decoded = b64ToLatin1(enc);
  if (!key) return latin1ToUtf8(decoded);
  var out = "";
  for (var i = 0; i < decoded.length; i++) {
    out += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return latin1ToUtf8(out);
}

function isF4Host(host) {
  return /f4scdn\.com|f4jav\.xyz|f4splay\.vip/i.test(host || "");
}

function hostOf(url) {
  var m = String(url || "").match(/^https?:\/\/([^\/]+)/i);
  return m ? m[1] : "";
}

function workerUrl(embed, durl) {
  var host = hostOf(embed);
  var path = isF4Host(host) ? "/f4" : "/v";
  return WORKER + path + "?u=" + encodeURIComponent(embed) + "&r=" + encodeURIComponent(durl);
}

function parseCards(html) {
  var items = [];
  var seen = {};
  var re = /<a[^>]*href="(https:\/\/javplayer\.org\/v\/[a-z0-9\-]+|\/v\/[a-z0-9\-]+)"[^>]*class="[^"]*card__play[^"]*"[^>]*>([\s\S]{0,1500}?)<\/a>/gi;
  var m;
  while ((m = re.exec(html))) {
    var href = m[1];
    if (href.indexOf("http") !== 0) href = HOST + href;
    if (seen[href]) continue;
    seen[href] = 1;
    var pic = "";
    var before = html.slice(Math.max(0, m.index - 900), m.index);
    var imgRe = /<img[^>]*>/gi;
    var lastImg = null;
    var im;
    while ((im = imgRe.exec(before))) lastImg = im[0];
    if (lastImg) {
      var dm = lastImg.match(/data-src="([^"]+)"/i);
      var sm = lastImg.match(/src="([^"]+)"/i);
      var cand = (dm && dm[1]) || (sm && sm[1]) || "";
      if (cand && !/default-cover/i.test(cand) && cand.indexOf("data:image") !== 0) {
        pic = /^https?:\/\//i.test(cand) ? cand : HOST + (cand.charAt(0) === "/" ? cand : "/" + cand);
      }
    }
    items.push({
      id: href,
      type: "url",
      title: "",
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: href,
      description: "",
      mediaType: "movie"
    });
    if (items.length >= 60) break;
  }
  var titles = [];
  var titleRe = /class="[^"]*card__title[^"]*"[^>]*>([\s\S]{0,500}?)<\/[^>]+>/gi;
  var tm;
  while ((tm = titleRe.exec(html))) titles.push(cleanText(tm[1]));
  var codes = [];
  var codeRe = /<a[^>]*href="https:\/\/javplayer\.org\/v\/[a-z0-9\-]+"[^>]*>([A-Z0-9\-]{4,})<\/a>/gi;
  var cm;
  while ((cm = codeRe.exec(html))) codes.push(cm[1]);
  var out = [];
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    if (titles[i]) it.title = titles[i];
    if (codes[i]) it.description = codes[i];
    if (!it.title) {
      var slug = (it.id.match(/\/v\/([a-z0-9\-]+)/i) || [])[1] || "";
      it.title = slug ? slug.toUpperCase() : "JavPlayer";
      if (!it.description && slug) it.description = slug.toUpperCase();
    }
    if (it.title && it.title.length >= 2) out.push(it);
  }
  return out;
}

function listOrMsg(html, url) {
  if (!html) return [{ id: "empty", type: "url", title: "空页面" }];
  var list = parseCards(html);
  return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
}

function escRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractPgBase(html, path) {
  var re1 = new RegExp('href="(https://javplayer\\.org' + escRe(path) + '-[A-Za-z0-9]+)/pg-2"');
  var m1 = html.match(re1);
  if (m1) return m1[1] + "/pg-";
  var re2 = new RegExp('action="(' + escRe(path) + '-[A-Za-z0-9]+)/"');
  var m2 = html.match(re2);
  if (m2) return HOST + m2[1] + "/pg-";
  return "";
}

var PGBASE = {};

function isCleanPath(path) {
  if (path === "/new-releases") return true;
  if (path.indexOf("/search/") === 0) return true;
  return false;
}

async function fetchList(path, page) {
  if (isCleanPath(path)) {
    var url = HOST + path + (page > 1 ? "/pg-" + page : "");
    var html = await getText(url, HOST + "/");
    var list = parseCards(html);
    return { list: list, more: list.length >= 24 };
  }
  var base = PGBASE[path];
  if (page === 1 || !base) {
    var html1 = await getText(HOST + path, HOST + "/");
    var list1 = parseCards(html1);
    var nb = extractPgBase(html1, path);
    if (nb) PGBASE[path] = nb;
    if (page === 1) return { list: list1, more: list1.length >= 24 };
    if (!nb) return { list: [], more: false };
    base = nb;
  }
  var html = await getText(base + page, HOST + "/");
  var list = parseCards(html);
  if (!list.length) {
    var html2 = await getText(HOST + path, HOST + "/");
    var nb2 = extractPgBase(html2, path);
    if (nb2 && nb2 !== base) {
      PGBASE[path] = nb2;
      html = await getText(nb2 + page, HOST + "/");
      list = parseCards(html);
    }
  }
  return { list: list, more: list.length >= 24 };
}

var KW = [
  { id: "kw_jianma", re: /-rm$/i },
  { id: "kw_zhifu", re: /制服|セーラー|女子校生|女子○生|女教師|ブレザー|学園/ }
];
var KWALL = {};
var NEWREL = {};

async function kwItems(kw, page, size) {
  var st = KWALL[kw.id];
  if (!st) { st = { items: [], seen: {}, page: 0, done: false }; KWALL[kw.id] = st; }
  var need = page * size;
  while (st.items.length < need && !st.done) {
    var bp = st.page + 1;
    if (bp > 8) { st.done = true; break; }
    var cards = NEWREL[bp];
    if (!cards) {
      var html = await getText(HOST + "/new-releases" + (bp > 1 ? "/pg-" + bp : ""), HOST + "/");
      cards = parseCards(html);
      NEWREL[bp] = cards;
    }
    st.page = bp;
    if (!cards.length) { st.done = true; break; }
    for (var i = 0; i < cards.length; i++) {
      var it = cards[i];
      if (st.seen[it.id]) continue;
      var txt = (it.title || "") + " " + (it.description || "");
      if (!kw.re.test(txt)) continue;
      st.seen[it.id] = 1;
      st.items.push(it);
    }
    if (cards.length < 24) st.done = true;
  }
  var from = (page - 1) * size;
  return st.items.slice(from, from + size);
}

async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var cat = String(params.path || params.cat || "/new-releases");
  try {
    await warmSession();
    if (cat.indexOf("kw_") === 0) {
      var kw = null;
      for (var i = 0; i < KW.length; i++) {
        if (KW[i].id === cat) { kw = KW[i]; break; }
      }
      if (!kw) return [{ id: "empty", type: "url", title: "没有找到相关内容" }];
      return kwItems(kw, page, 24);
    }
    var path = cat.charAt(0) === "/" ? cat : "/" + cat;
    var r = await fetchList(path, page);
    return r.list.length ? r.list : [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + HOST + path }];
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

function slugify(wd) {
  return String(wd || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function search(params) {
  params = params || {};
  var wd = pickKeyword(params);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var slug = slugify(wd);
  if (!slug) return [{ id: "tip", type: "url", title: "该关键词无对应站内 slug，换英文或番号再搜" }];
  try {
    await warmSession();
    var r = await fetchList("/search/" + slug, page);
    return r.list.length ? r.list : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

function originOf(url) {
  var m = String(url || "").match(/^(https?:\/\/[^\/]+)/i);
  return m ? m[1] : "";
}

async function httpPostJson(url, bodyText, headers) {
  try {
    if (typeof Widget.http.post !== "function") return null;
    var res = await Widget.http.post(url, bodyText, { headers: headers });
    var raw = res && res.data != null ? res.data : res;
    if (raw == null) return null;
    if (typeof raw === "string") {
      try { return JSON.parse(raw); } catch (e) { return null; }
    }
    return raw;
  } catch (e) {
    return null;
  }
}

async function ajaxPlayer(filmId, episode, pt, durl, pk) {
  // Worker /ajax 优先（2026-11-23，sextb-hls v6 新增，已实测新鲜 pt 一次即通）：
  // site-fetch POST 已被拒（E_XHR），直连 POST 仅手机住宅出口可能通，皆作回落。
  if (pk) {
    try {
      var origin = originOf(durl);
      var wu = WORKER + "/ajax?o=" + encodeURIComponent(origin)
        + "&filmId=" + encodeURIComponent(filmId) + "&episode=" + encodeURIComponent(episode)
        + "&pt=" + encodeURIComponent(pt) + "&pk=" + encodeURIComponent(pk);
      var res = await Widget.http.get(wu, { headers: { "User-Agent": UA, "Accept": "application/json" }, timeout: 12000 });
      var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
      var o = null;
      try { o = body ? JSON.parse(body) : null; } catch (e) { o = null; }
      if (o && o.ok && o.embed) return { player_embed: String(o.embed) };
      if (o && !o.ok) return null;
    } catch (e) { /* fall through to POST legs */ }
  }
  var ajaxUrl = originOf(durl) + "/ajax/player";
  var body = "episode=" + encodeURIComponent(episode) + "&filmId=" + encodeURIComponent(filmId) + "&pt=" + encodeURIComponent(pt);
  var headers = {
    "User-Agent": UA,
    "Referer": durl,
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest"
  };
  var j = await httpPostJson(SITE_FETCH + "/?u=" + encodeURIComponent(ajaxUrl), body, headers);
  if (j && (j.player || j.player_enc)) return j;
  j = await httpPostJson(ajaxUrl, body, headers);
  if (j && (j.player || j.player_enc)) return j;
  return null;
}

function parseDetailButtons(html) {
  var btns = [];
  var btnRe = /<button[^>]*class="[^"]*btn-player[^"]*"[^>]*>([\s\S]{0,80}?)<\/button>/gi;
  var bm;
  while ((bm = btnRe.exec(html))) {
    var tag = bm[0];
    if (/btn-player-vip/i.test(tag)) continue;
    var dm = tag.match(/data-id="(\d+)"/i);
    var sm = tag.match(/data-source="(\d+)"/i);
    var name = cleanText(bm[1]) || "播放";
    var episode = dm ? dm[1] : "";
    if (!episode) continue;
    btns.push({ name: name, episode: episode, filmId: sm ? sm[1] : "" });
  }
  return btns;
}

// ================= 播放链（v1.0.2） =================

function embedOfPlayer(json, pk) {
  if (!json || json.error) return "";
  if (json.player_embed) return String(json.player_embed);
  var playerHtml = "";
  if (json.player_enc) playerHtml = xorDecrypt(json.player_enc, pk || "");
  else if (json.player) playerHtml = String(json.player);
  if (!playerHtml) return "";
  var em = playerHtml.match(/<iframe[^>]+src="(https?:\/\/[^"]+)"/i) || playerHtml.match(/<iframe[^>]+src="(\/\/[^"]+)"/i);
  if (em) {
    var embed = em[1];
    if (embed.indexOf("//") === 0) embed = "https:" + embed;
    return embed;
  }
  var mm = playerHtml.match(/https?:\/\/[^"'\s<>]+\.(?:m3u8|mp4)(?:\?[^"'\s<>]*)?/i);
  return mm ? mm[0] : "";
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

// 直解嵌页：取嵌页（设备 IP）→ 解 packer → 取 hls3（无 token）或 hls2；
// hls4 不要（其变体是带 PNG 假头的广告播单，直链无 Worker 剥头，原生播放器播不了）。
// 返回 {url, topH} 或 null；主播单探不到分辨率时 topH 为 0，地址照样可用。
async function extractDirectHls(embed, referer) {
  try {
    var res = await Widget.http.get(embed, { headers: { "User-Agent": UA, "Referer": referer || HOST + "/" }, timeout: 20000 });
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

// 单条线解线：Worker 行（system，探活）→ 直解 hls3 行（system）→ 站内嗅探行（app）。
// F4 行照样出（host 全网 502 时探活判死，但 host 恢复后 Worker 行自愈；live=false 的行不进顶层）。
async function resolveLine(name, embed, durl) {
  var rows = [];
  var f4 = isF4Host(hostOf(embed));
  var wUrl = workerUrl(embed, durl);
  if (f4) {
    var fp = await probePlaylist(wUrl, { "User-Agent": UA });
    rows.push({ title: name + (fp.alive && fp.topH ? " · " + fp.topH + "p" : ""), videoUrl: wUrl, playerType: "system", customHeaders: { "User-Agent": UA }, live: fp.alive === false ? false : true });
    return rows;
  }
  var probe = await probePlaylist(wUrl, { "User-Agent": UA });
  if (probe.alive) {
    rows.push({ title: name + (probe.topH ? " · " + probe.topH + "p" : ""), videoUrl: wUrl, playerType: "system", customHeaders: { "User-Agent": UA }, live: true });
    var d0 = await extractDirectHls(embed, durl);
    if (d0) {
      rows.push({ title: name + "·直链" + (d0.topH ? "·" + d0.topH + "p" : ""), videoUrl: d0.url, playerType: "system", customHeaders: { "User-Agent": UA }, live: true });
    }
    rows.push({ title: name + "·站内播放", videoUrl: embed, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl }, live: true });
    return rows;
  }
  if (probe.alive === null) {
    rows.push({ title: name, videoUrl: wUrl, playerType: "system", customHeaders: { "User-Agent": UA }, live: true });
    return rows;
  }
  var d = await extractDirectHls(embed, durl);
  if (d) {
    rows.push({ title: name + "·直链" + (d.topH ? "·" + d.topH + "p" : ""), videoUrl: d.url, playerType: "system", customHeaders: { "User-Agent": UA }, live: true });
    rows.push({ title: name + "·站内播放", videoUrl: embed, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl }, live: true });
    return rows;
  }
  rows.push({ title: name + "·站内播放", videoUrl: embed, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl }, live: true });
  return rows;
}

function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

function lineToken(durl, line) {
  return "@@JP:" + encodeURIComponent(durl) + ":" + line;
}

function parseLineToken(raw) {
  var s = t(raw);
  if (s.indexOf("@@JP:") !== 0) return null;
  var rest = s.slice(5);
  var i = rest.lastIndexOf(":");
  if (i < 0) return null;
  try {
    return { durl: decodeURIComponent(rest.slice(0, i)), line: rest.slice(i + 1) };
  } catch (e) {
    return null;
  }
}

// 详情页线路入口（manko 1.0.3 同款结构）：每条线同时进 episodes、seasons[0].episodes、
// episodeItems，集内带 videoUrl；顶层 videoUrl 取首个活的 system 行。
async function loadDetail(link) {
  var url = String(unwrapLink(link) || "");
  try {
    if (!/^https?:\/\//i.test(url)) url = HOST + (url.charAt(0) === "/" ? url : "/" + url);
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "未找到播放地址" };
    await warmSession();
    var html = await getText(url, HOST + "/");
    if (!html) return { id: url, type: "url", title: "JavPlayer", description: "未找到播放地址" };
    var cands = [];
    var ogt = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
    if (ogt) cands.push(ogt[1]);
    var sht = html.match(/<h1[^>]*class="[^"]*section__title[^"]*"[^>]*>([\s\S]{0,400}?)<\/h1>/i);
    if (sht) cands.push(sht[1]);
    var h1t = html.match(/<h1[^>]*>([\s\S]{0,400}?)<\/h1>/i);
    if (h1t) cands.push(h1t[1]);
    var title = "JavPlayer";
    for (var ci = 0; ci < cands.length; ci++) {
      var ct = cleanText(cands[ci]);
      if (ct && !/^(403|404|500|Forbidden|Not Found)/i.test(ct)) { title = ct; break; }
    }
    var cover = firstMatch(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (!cover) cover = firstMatch(html, /<img[^>]*class="cover"[^>]*src="([^"]+)"/i);
    if (!cover) cover = firstMatch(html, /(https:\/\/cdn001\.imggle\.net\/[^"'\s<>]+)/i);
    var filmM = html.match(/filmId\s*=\s*["']?(\d+)/i) || html.match(/data-source="(\d+)"/i);
    var filmId = filmM ? filmM[1] : "";
    var pt = firstMatch(html, /window\.__pt\s*=\s*"([^"]+)"/i);
    var pk = firstMatch(html, /window\.__pk\s*=\s*"([^"]+)"/i);
    var btns = parseDetailButtons(html);
    for (var bi = 0; bi < btns.length; bi++) {
      if (!btns[bi].filmId) btns[bi].filmId = filmId;
    }
    if (!btns.length) {
      return { id: url, type: "url", title: title, description: "未找到播放地址" };
    }
    // 逐线串行、每线用新鲜 pt（2026-11-23）：pt 一次一用，并行共用同一 pt 时
    // 只有第一线能通，其余线会被站方拒掉。串行且每线重取详情页拿新鲜 pt/pk
    // 再调 Worker /ajax；失败再换新 pt 重试一次。
    var ajaxed = [];
    for (var bi2 = 0; bi2 < btns.length; bi2++) {
      var b0 = btns[bi2];
      var emb0 = "";
      for (var att = 0; att < 2 && !emb0; att++) {
        try {
          var hF = await getText(url, HOST + "/");
          var ptF = firstMatch(hF, /window\.__pt\s*=\s*"([^"]+)"/i) || pt;
          var pkF = firstMatch(hF, /window\.__pk\s*=\s*"([^"]+)"/i) || pk;
          var btnsF = parseDetailButtons(hF);
          var bF = null;
          for (var rfi = 0; rfi < btnsF.length; rfi++) { if (btnsF[rfi].episode === b0.episode) { bF = btnsF[rfi]; break; } }
          if (!bF) bF = b0;
          if (!bF.filmId) bF.filmId = b0.filmId || filmId;
          var jF = await ajaxPlayer(bF.filmId, bF.episode, ptF, url, pkF);
          emb0 = embedOfPlayer(jF, pkF);
        } catch (e) { emb0 = ""; }
      }
      ajaxed.push({ name: b0.name, episode: b0.episode, filmId: b0.filmId, embed: emb0 });
    }
    // 有嵌页的线并行解线；没嵌页的线只出详情页嗅探行（点它走 loadResource 再解一次）
    var lineRows = await Promise.all(ajaxed.map(function (a) {
      if (a.embed) return resolveLine(a.name, a.embed, url);
      return [{ title: a.name + "·站内播放", videoUrl: url, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": url }, live: true }];
    }));
    var eps = [];
    var seasonEps = [];
    var items = [];
    var liveArr = [];
    for (var li = 0; li < lineRows.length; li++) {
      var rows = lineRows[li];
      for (var ri = 0; ri < rows.length; ri++) {
        var row = rows[ri];
        var tok = lineToken(url, ajaxed[li].name);
        eps.push({ name: row.title, link: tok });
        var se = { title: row.title, episodeNumber: eps.length };
        se.videoUrl = row.videoUrl;
        seasonEps.push(se);
        items.push({
          id: tok,
          type: "url",
          title: row.title,
          mediaType: "movie",
          posterPath: cover,
          link: tok,
          episode: eps.length,
          episodeNumber: eps.length,
          seasonIndex: 1,
          seasonNumber: 1,
          videoUrl: row.videoUrl,
          playerType: row.playerType,
          customHeaders: row.customHeaders
        });
        liveArr.push(row.live !== false);
      }
    }
    if (!items.length) {
      return { id: url, type: "url", title: title, description: "未找到播放地址" };
    }
    var topUrl = "";
    var topType = "app";
    for (var k = 0; k < items.length; k++) {
      if (items[k].playerType === "system" && liveArr[k]) { topUrl = items[k].videoUrl; topType = "system"; break; }
    }
    if (!topUrl) {
      for (var k2 = 0; k2 < items.length; k2++) {
        if (items[k2].playerType !== "system") { topUrl = items[k2].videoUrl; topType = items[k2].playerType; break; }
      }
    }
    if (!topUrl) { topUrl = items[0].videoUrl; topType = items[0].playerType; }
    return {
      id: url,
      type: "detail",
      title: title,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: topUrl,
      playerType: topType,
      customHeaders: { "User-Agent": UA, "Referer": url },
      episodes: eps,
      seasons: [{ seasonNumber: 1, title: "线路", name: "线路", episodes: seasonEps }],
      episodeItems: items,
      childItems: items
    };
  } catch (e) {
    return { id: url || "err", type: "url", title: "JavPlayer", description: "未找到播放地址" };
  }
}

// 点播回落入口：点哪条解哪条；所有取数包 try/catch，绝不抛错。
async function loadResource(params) {
  var raw = unwrapLink(params);
  if (!raw && params && typeof params === "object") raw = unwrapLink(params.item);
  if (!raw) return [];
  try {
    // 已是 Worker 直链：直接出 system 行
    if (raw.indexOf(WORKER + "/f4?") === 0 || raw.indexOf(WORKER + "/v?") === 0) {
      return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA } }];
    }
    // 详情页地址：重跑详情，取其全部行
    if (raw.indexOf(HOST + "/v/") === 0 || raw.indexOf("/v/") === 0) {
      var d = await loadDetail(raw);
      var rows2 = [];
      var items2 = d.episodeItems || [];
      for (var qi = 0; qi < items2.length; qi++) {
        if (items2[qi].videoUrl) rows2.push({ name: items2[qi].title, url: items2[qi].videoUrl, playerType: items2[qi].playerType || "system", customHeaders: items2[qi].customHeaders });
      }
      return rows2;
    }
    // 已是嵌页直链：交 WebView 嗅探
    if (/^https?:\/\//.test(raw) && raw.indexOf("@@JP:") !== 0) {
      return [{ name: "站内播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA } }];
    }
    var tok = parseLineToken(raw);
    if (tok) {
      var durl = tok.durl;
      var line = tok.line;
      await warmSession();
      var html = await getText(durl, HOST + "/");
      if (!html) return [];
      var filmM = html.match(/filmId\s*=\s*["']?(\d+)/i) || html.match(/data-source="(\d+)"/i);
      var filmId = filmM ? filmM[1] : "";
      var pt = firstMatch(html, /window\.__pt\s*=\s*"([^"]+)"/i);
      var pk = firstMatch(html, /window\.__pk\s*=\s*"([^"]+)"/i);
      var btns = parseDetailButtons(html);
      var target = null;
      for (var i = 0; i < btns.length; i++) {
        if (btns[i].name === line) { target = btns[i]; break; }
      }
      if (!target && btns.length) target = btns[0];
      if (!target) return [];
      if (!target.filmId) target.filmId = filmId;
      var j = await ajaxPlayer(target.filmId, target.episode, pt, durl, pk);
      var embed = embedOfPlayer(j, pk);
      if (!embed) return [{ name: "站内播放", url: durl, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl } }];
      var rows = await resolveLine(target.name, embed, durl);
      var out = [];
      for (var ri = 0; ri < rows.length; ri++) {
        out.push({ name: rows[ri].title, url: rows[ri].videoUrl, playerType: rows[ri].playerType, customHeaders: rows[ri].customHeaders });
      }
      return out;
    }
    return [];
  } catch (e) {
    return [];
  }
}
