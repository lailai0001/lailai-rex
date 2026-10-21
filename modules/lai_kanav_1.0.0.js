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
  version: "1.0.0",
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

async function loadDetail(link) {
  try {
    var url = absUrl(String(link || ""));
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

    return {
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
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
