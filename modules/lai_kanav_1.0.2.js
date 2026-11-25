// v1.0.2：AVDB 样式详情：详情页没有 /actress/ 或 /category/ 链接，演员在 hr-actor 区、标签在 hr-tags 区、分类在 hr-categories 区（均为搜索/分类页链接）；点按走搜索或分类页（均已对真站页实测：演员搜索 20 条、分类页 24 条）；genreItems 补 link；补 loadList peopleId/genreId 与 loadDetail 裸名派发；详情挂 relatedItems（猜你喜欢）；vod_actor 为空的片 peoples 留空不编造
// v1.0.1：AVDB 样式详情：peoples/genreItems + 点按路由
// KanAV for REX (lai_kanav v1.0.0)
// 移植自 mira-cat 蜘蛛 kanav.js, 后端: https://kanav.ad (AppleCMS 站, 服务端渲染)。
// 列表: /index.php/vod/type/id/{tid}/page/{p}.html, 与蜘蛛同一套选择器解析
//   (.post-list .col-md-3 -> .entry-title a + img[data-original])。
// 详情: 播放页内嵌 var player_aaaa={...}, 其 url 为 base64 后再 URL 转义的串,
//   蜘蛛的解法是 base64 解码 -> UTF-8 -> decodeURIComponent; REX 沙箱无 CryptoJS,
//   本模块内置纯 JS base64 解码实现同一逻辑 (已与 CryptoJS 结果逐字比对一致)。
// 封面为站方图床直链 (img.11yun.xyz), 无防盗链, 直出不走代理。

WidgetMetadata = {
  id: "lai_kanav",
  title: "KanAV",
  description: "KanAV（kanav.ad）：中文字幕/日韩有码无码/国产AV/自拍泄密等分类，详情页 player_aaaa 实时解密播放",
  author: "lai",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  site: "https://kanav.ad",
  detailCacheDuration: 180,
  modules: [
    { title: "中文字幕", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "1" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "日韩有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "2" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "日韩无码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "3" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "国产AV", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "4" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "自拍泄密", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "30" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "探花约炮", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "31" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "主播录制", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "32" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "动漫番剧", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "20" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
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

var BASE = "https://kanav.ad";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": BASE + "/"
  };
}

function absUrl(u) {
  var s = String(u || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.charAt(0) === "/" && s.charAt(1) === "/") return "https:" + s;
  return BASE + (s.charAt(0) === "/" ? s : "/" + s);
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

// 纯 JS base64 解码 (输出 Latin-1 字节串), 行为与 CryptoJS.enc.Base64.parse 对齐:
// 忽略字母表外字符, 正确处理 = 填充。
function b64Decode(input) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = String(input || "").replace(/[^A-Za-z0-9+/=]/g, "");
  var out = "";
  var i = 0;
  while (i < str.length) {
    var c1 = str.charAt(i++);
    var c2 = str.charAt(i++);
    var c3 = str.charAt(i++);
    var c4 = str.charAt(i++);
    var e1 = chars.indexOf(c1);
    var e2 = c2 === "=" ? 0 : chars.indexOf(c2);
    var e3 = c3 === "=" ? 0 : chars.indexOf(c3);
    var e4 = c4 === "=" ? 0 : chars.indexOf(c4);
    if (e1 < 0 || e2 < 0) break;
    out += String.fromCharCode((e1 << 2) | (e2 >> 4));
    if (c3 !== "=" && c3 !== "") out += String.fromCharCode(((e2 & 15) << 4) | (e3 >> 2));
    if (c4 !== "=" && c4 !== "") out += String.fromCharCode(((e3 & 3) << 6) | e4);
    if (c3 === "=" || c4 === "=") break;
  }
  return out;
}

// 解 player_aaaa 的 url: base64 -> decodeURIComponent (与蜘蛛 decryptPlayUrl 等价)
function decodePlayUrl(encoded) {
  var raw = String(encoded || "");
  if (!raw) return "";
  try {
    var dec = b64Decode(raw);
    if (dec) {
      try { return decodeURIComponent(dec); } catch (_) { return dec; }
    }
  } catch (_) {}
  try { return decodeURIComponent(raw); } catch (_) { return raw; }
}

function extractPlayer(html) {
  // 优先 cheerio 定位含 player_aaaa 的 script (与蜘蛛一致)
  try {
    var $ = Widget.html.load(html);
    var txt = $("script:contains(player_aaaa)").text() || "";
    var m = txt.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
  } catch (_) {}
  var m2 = String(html || "").match(/var\s+player_aaaa\s*=\s*(\{[\s\S]*?\})\s*;?\s*<\/script>/i);
  if (m2) {
    try { return JSON.parse(m2[1]); } catch (_) {}
  }
  return null;
}

function parseCards(html) {
  var out = [];
  if (!html) return out;
  var $ = Widget.html.load(html);
  $(".post-list .col-md-3").each(function (_, el) {
    var $el = $(el);
    var $a = $el.find(".entry-title a").first();
    var href = $a.attr("href") || "";
    var name = ($a.text() || "").replace(/\s+/g, " ").trim();
    if (!href || !name) return;
    var img = $el.find(".video-item .featured-content-image a img").attr("data-original") || "";
    var remark = ($el.find(".video-item span.model-view-left").text() || "").trim();
    var duration = ($el.find(".video-item span.model-view").text() || "").trim();
    var link = absUrl(href);
    var pic = absUrl(img);
    out.push({
      id: link,
      type: "url",
      title: name,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: remark || duration || "",
      mediaType: "movie"
    });
  });
  return out;
}

async function loadList(params) {
  params = params || {};
  var taxId = String(params.peopleId || params.genreId || params.url || params.link || "");
  if (taxId && (TAX_SEARCH_RE.test(taxId) || TAX_TYPE_RE.test(taxId))) {
    try { var td = await taxRoute(taxId, params.peopleId ? true : (params.genreId ? false : null)); return td.relatedItems || []; } catch (e) { return []; }
  }
  var page = parseInt(params.page, 10) || 1;
  var tid = String(params.path || "1");
  var url = BASE + "/index.php/vod/type/id/" + tid + "/page/" + page + ".html";
  try {
    var html = await fetchText(url);
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
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
  var url = BASE + "/index.php/vod/search/by/time_add/page/" + page + "/wd/" + encodeURIComponent(wd) + ".html";
  try {
    var html = await fetchText(url);
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

var TAX_TYPE_RE = /\/vod\/type\/id\/\d+/i;
var TAX_SEARCH_RE = /\/vod\/search\.html\?wd=/i;

// ---- AVDB 样式详情：演员/分类（点按出对应全部内容）----
var TAX_ACTRESS_RE = /\/actress(?:es)?\/|\/actors?\/|\/star\/|\/stars\/|\/performer\/|\/models?\/|\/pornstars?\/|\/idols?\//i;
var TAX_GENRE_RE = /\/(genres?|tags?|categor(?:y|ies)|labels?|makers?|vod\/type\/id\/\d+)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)|category|actress(es)?|actors?|stars?|star|performers?|models?|pornstars?|makers?|labels?|studios?|all|全部|分类|演员|标签|女优|题材|片商)$/i;

function taxRealWorks(works) {
  var out = [];
  for (var i = 0; i < works.length; i++) {
    var w = works[i];
    if (w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty" && w.id !== "tip" && w.id !== "supjav-diag-parse" && String(w.id || "").indexOf("supjav-diag") !== 0) out.push(w);
  }
  return out;
}

// v1.0.2：详情页没有 /actress/ 或 /category/ 链接；演员在 hr-actor 区、标签在 hr-tags 区、
// 分类在 hr-categories 区（均为 /vod/search.html?wd=... 或 /vod/type/id/N.html 链接）。
// vod_actor 为空的片（如国产自拍）peoples 留空，不编造。
function taxSearchUrl(name) {
  return BASE + "/index.php/vod/search.html?wd=" + encodeURIComponent(name) + "&by=time_add";
}
function taxLinksFromDiv(html, cls) {
  var out = [];
  var seen = {};
  var dm = String(html || "").match(new RegExp('<div class="hr-style ' + cls + ' info"></div>([\\s\\S]*?)</div>', "i"));
  if (!dm) return out;
  var sec = dm[1];
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(sec)) !== null) {
    var href = m[1] || "";
    var name = String(m[2] || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    if (!name || name.length > 40) continue;
    if (href === "#") continue;
    if (/^上映日期/.test(name)) continue;
    var abs = absUrl(href);
    if (!/^https?:\/\//i.test(abs)) continue;
    if (seen[name]) continue;
    seen[name] = 1;
    out.push({ name: name, href: abs });
    if (out.length >= 20) break;
  }
  return out;
}
function extractTaxonomyFromHtml(html) {
  var peoples = [];
  var genreItems = [];
  var seenP = {};
  var seenG = {};
  var actors = taxLinksFromDiv(html, "hr-actor");
  for (var i = 0; i < actors.length; i++) {
    var an = actors[i].name;
    if (seenP[an]) continue;
    seenP[an] = 1;
    var aUrl = taxSearchUrl(an);
    peoples.push({ id: aUrl, title: an, name: an, link: aUrl, role: "演员" });
  }
  if (!peoples.length) {
    // hr-actor 为空时退回 vod_actor JSON（部分片只有 JSON 里有演员）
    var am = String(html || "").match(/"vod_actor"\s*:\s*"((?:\\.|[^"\\])*)"/);
    if (am) {
      var decoded = am[1];
      try { decoded = JSON.parse("\"" + am[1] + "\""); } catch (e) {}
      var parts = String(decoded || "").split(/[,，、]/);
      for (var j = 0; j < parts.length; j++) {
        var nm = String(parts[j] || "").replace(/\s+/g, " ").trim();
        if (!nm || nm.length > 40 || seenP[nm]) continue;
        seenP[nm] = 1;
        var u2 = taxSearchUrl(nm);
        peoples.push({ id: u2, title: nm, name: nm, link: u2, role: "演员" });
      }
    }
  }
  var tags = taxLinksFromDiv(html, "hr-tags");
  for (var k = 0; k < tags.length; k++) {
    var tn = tags[k].name;
    if (seenG[tn]) continue;
    seenG[tn] = 1;
    var tUrl = taxSearchUrl(tn);
    genreItems.push({ id: tUrl, title: tn, link: tUrl });
  }
  var cats = taxLinksFromDiv(html, "hr-categories");
  for (var c = 0; c < cats.length; c++) {
    var cn = cats[c].name;
    if (seenG[cn]) continue;
    seenG[cn] = 1;
    genreItems.push({ id: cats[c].href, title: cn, link: cats[c].href });
  }
  return { peoples: peoples, genreItems: genreItems };
}

// v1.0.2：演员/标签点按是 /vod/search.html?wd=<名>（站内搜索即该名全部作品，
// 已实测演员搜索页 20 条）；分类点按是 /vod/type/id/N.html（已实测 24 条）。
async function taxBareName(name) {
  var works = [];
  try { works = await search({ keyword: name, page: 1 }); } catch (e) { works = []; }
  if (!Array.isArray(works)) works = [];
  var real = taxRealWorks(works);
  return { id: "search:" + name, type: "detail", mediaType: "movie", title: name, link: "search:" + name, description: "搜索 · 共 " + real.length + " 部作品", videoUrl: "", childItems: [], relatedItems: real.length ? real : works };
}
async function taxRoute(url, isActressHint) {
  var isType = TAX_TYPE_RE.test(url);
  var isActress = isType ? false : (isActressHint != null ? isActressHint : true);
  var wd = "";
  var wm = String(url).match(/[?&]wd=([^&]+)/);
  if (wm) { try { wd = decodeURIComponent(wm[1]); } catch (e) { wd = wm[1]; } }
  var works = [];
  var title = wd || "";
  if (isType) {
    try {
      var html = await fetchText(url);
      if (html) {
        works = parseCards(html);
        var tm = html.match(/<title>([\s\S]*?)<\/title>/i);
        if (tm) {
          var tn = tm[1].split("/")[0].replace(/\s*-.*$/, "").trim();
          if (tn) title = tn;
        }
      }
    } catch (e) {}
  } else if (wd) {
    try { works = await search({ keyword: wd, page: 1 }); } catch (e) { works = []; }
  }
  if (!Array.isArray(works)) works = [];
  var realWorks = taxRealWorks(works);
  return {
    id: url,
    type: "detail",
    mediaType: "movie",
    title: title || (isActress ? "演员" : "分类"),
    link: url,
    description: (isActress ? "演员" : "分类") + " · 共 " + realWorks.length + " 部作品",
    videoUrl: "",
    childItems: [],
    relatedItems: realWorks.length ? realWorks : works
  };
}

async function loadDetail(link) {
  try {
    var inObj = (link && typeof link === "object") ? link : null;
    var rawLink = link;
    if (rawLink && typeof rawLink === "object") rawLink = rawLink.link || rawLink.id || rawLink.url || rawLink.videoUrl || "";
    var rawStr = String(rawLink || "");
    if (rawStr && rawStr.indexOf("http") !== 0 && rawStr.indexOf("/") < 0 && rawStr.indexOf(":") < 0) {
      return await taxBareName(rawStr);
    }
    var url = absUrl(rawStr);
    if (TAX_ACTRESS_RE.test(url) || TAX_GENRE_RE.test(url) || TAX_TYPE_RE.test(url) || TAX_SEARCH_RE.test(url)) {
      var hint = inObj ? (inObj.role === "演员") : null;
      return await taxRoute(url, hint);
    }
    if (!url) return { id: String(link || "err"), type: "url", title: "解析失败", description: "链接为空" };
    var html = await fetchText(url);

    var name = "";
    var tm = html.match(/<title>([\s\S]*?)<\/title>/i);
    if (tm) {
      name = tm[1].replace(/^在线播放\s*-\s*/i, "").replace(/\s*-\s*KanAV[\s\S]*$/i, "").trim();
    }
    var pic = "";
    var pm = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (pm) pic = absUrl(pm[1]);

    var player = extractPlayer(html);
    var playUrl = "";
    if (player && player.url) {
      playUrl = decodePlayUrl(player.url);
      if (!/^https?:\/\//i.test(playUrl)) {
        var alt = String(player.url);
        if (/^https?:\/\//i.test(alt)) playUrl = alt;
      }
    }
    if (!playUrl) {
      return { id: url, type: "url", title: name || "解析失败", description: "未找到播放地址" };
    }

    var ret = {
      id: url,
      type: "detail",
      title: name || "KanAV",
      link: url,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      videoUrl: playUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE + "/"
      }
    };
    var tax = extractTaxonomyFromHtml(html);
    if (tax.peoples.length) ret.peoples = tax.peoples;
    if (tax.genreItems.length) ret.genreItems = tax.genreItems;
    var relAll = parseCards(html);
    var rel = [];
    for (var ri = 0; ri < relAll.length; ri++) {
      if (relAll[ri].id !== url && relAll[ri].link !== url) rel.push(relAll[ri]);
      if (rel.length >= 12) break;
    }
    if (rel.length) ret.relatedItems = rel;
    return ret;
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
