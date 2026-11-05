// JavMit for REX (lai_javmit v1.0.0)
// 移植自 mira-cat 蜘蛛 py_javmit.js（只读蓝图），后端 https://javmit.com/zh-CN/（WordPress rawx-theme 站）。
// 列表：首页 /zh-CN/、最新 /zh-CN/video/、分类 /zh-CN/category/<slug>/、无码 /zh-CN/uncensored/<slug>/、
//   标签 /zh-CN/tag/<slug>/，翻页 /page/<n>/；搜索 WordPress 原生 /zh-CN/?s=<kw>。
// 详情：<video data-default-src> 为 AUTO 母带 + .rawx-quality-btn（AUTO/1080P/480P）多档直出，
//   s3/s4 子域因片而异、一律从详情页现取；封面为 wp-content/uploads 直链。
// 播放：各档即最终播单直链（m3u8/mp4），s3/s4 播单无 Referer 回 403，故 Referer 必须带详情页地址。
//   有几档出几档（1080P > AUTO > 720P > 480P 排序），只有母带时单档，不设假清晰度选单。
// 字幕：猫源字幕芯是猫源专属，REX 版不接。
// v1.0.1：播放改走 hls-relay 中转——s2/s3/s4 播单与分片无 Referer 回 403，而 REX 播放器
//   不把 customHeaders 转发给分片请求，直出必死；relay 服务端带 Referer（站根）取数，
//   并把分片改写为自身 /f/ 地址，播放器只见 relay 地址。须用户部署 hls-relay Worker。

WidgetMetadata = {
  id: "lai_javmit",
  title: "JavMit",
  description: "JavMit（javmit.com）：最新、无码、身材与剧情分类，详情多档直出播放",
  author: "lai",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  site: "https://javmit.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "🆕最新推荐", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分组", type: "constant", value: "latest" }, { name: "sub", title: "分类", type: "enumeration", value: "video", enumOptions: [{ title: "最新", value: "video" }, { title: "首页推荐", value: "home" }, { title: "中文字幕", value: "category/subtitles" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🚫无码专区", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分组", type: "constant", value: "uncensored" }, { name: "sub", title: "分类", type: "enumeration", value: "uncensored", enumOptions: [{ title: "无码", value: "uncensored" }, { title: "无码流出", value: "uncensored/uncensored-leak" }, { title: "减码", value: "tag/no-mosaic" }, { title: "FC2", value: "uncensored/fc2" }, { title: "加勒比通讯社", value: "uncensored/caribbeancom" }, { title: "HEYZO", value: "uncensored/heyzo" }, { title: "1PONDO", value: "uncensored/1pondo" }, { title: "10MUSUME", value: "uncensored/10musume" }, { title: "东京热", value: "uncensored/tokyohot" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "💃身材题材", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分组", type: "constant", value: "body" }, { name: "sub", title: "分类", type: "enumeration", value: "category/big-breast-fetish", enumOptions: [{ title: "巨乳", value: "category/big-breast-fetish" }, { title: "大山雀", value: "category/big-tits" }, { title: "大胸", value: "category/big-breasts" }, { title: "大屁股", value: "category/big-butt" }, { title: "巨臀", value: "category/huge-butt" }, { title: "乳房恋物癖", value: "category/boobs-fetish" }, { title: "乳交", value: "category/titty-fuck" }, { title: "纤细", value: "category/slender" }, { title: "漂亮女孩", value: "category/beautiful-girl" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🎭剧情题材", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分组", type: "constant", value: "theme" }, { name: "sub", title: "分类", type: "enumeration", value: "category/schoolgirls", enumOptions: [{ title: "女学生", value: "category/schoolgirls" }, { title: "制服", value: "category/uniform" }, { title: "角色扮演", value: "category/cosplay" }, { title: "已婚", value: "category/married" }, { title: "业余", value: "category/amateur" }, { title: "3P", value: "category/3p" }, { title: "户外活动", value: "category/outdoors" }, { title: "偷窥者", value: "category/voyeur" }, { title: "成熟女性", value: "category/mature-woman" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { id: "loadResource", title: "播放资源", description: "播放时经 hls-relay 中转播单（服务端带 Referer 取数并改写分片）", functionName: "loadResource", type: "stream", cacheDuration: 0, params: [] }
  ]
};

var HOST = "https://javmit.com";
var BASE = HOST + "/zh-CN";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

// hls-relay 中转（与 818 relay 同构的通用 HLS 中转；须用户部署为 hls-relay.li768435813.workers.dev）。
// 密钥 RELAY_KEY 须与 Worker 里的常量一致（部署时可改，改完模块同步改）。
var RELAY = "https://hls-relay.li768435813.workers.dev";
var RELAY_KEY = "lai-hls-1";
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

var GROUPS = [
  { id: "latest", def: "video" },
  { id: "uncensored", def: "uncensored" },
  { id: "body", def: "category/big-breast-fetish" },
  { id: "theme", def: "category/schoolgirls" }
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
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
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

async function getHtml(path) {
  var url = t(path);
  if (url.indexOf("http") === 0) { /* absolute */ }
  else if (url.charAt(0) === "/") url = HOST + url;
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Referer": BASE + "/",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
      }
    });
    var body = res && res.data != null ? String(res.data) : "";
    if (!body) return "";
    return body;
  } catch (e) { return ""; }
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
            low.indexOf("placeholder") >= 0 || low.indexOf("default") >= 0 ||
            low.indexOf("data:image") >= 0) continue;
        return cand;
      }
    }
  }
  return "";
}

// 与猫源 parseCards 同口径：图链 + 标题链共用同一 /zh-CN/<slug>/，按 URL 合并图、标题与时长；
// 只收带封面 <img> 的图链（排除顶部 trending 跑马灯、标签、演员等纯文字链）。
function parseCards(html, host) {
  var byUrl = {};
  var order = [];
  var re = /<a[^>]+href=["'](https?:\/\/javmit\.com\/zh-CN\/[a-z0-9][a-z0-9-]*\/|(?:\/zh-CN\/[a-z0-9][a-z0-9-]*\/))["'][^>]*>([\s\S]*?)<\/a>/g;
  var m;
  while ((m = re.exec(String(html || "")))) {
    var href = t(m[1]);
    var parts = href.split("/").filter(function (x) { return !!x; });
    var slug = parts[parts.length - 1];
    if (!slug) continue;
    var skip = ["video", "categories", "tags", "actors", "channels", "favorites", "uncensored"];
    if (skip.indexOf(slug) >= 0) continue;
    var vUrl = "/zh-CN/" + slug + "/";
    var inner = m[2];
    if (!/<img[^>]+class="[^"]*(vc-thumb-img|lv-thumb-img|hq-thumb-img|hero-bg-img)[^"]*"/i.test(inner)) continue;
    var it = byUrl[vUrl];
    if (!it) { it = { id: vUrl, type: "url", title: "", posterPath: "", coverUrl: "", backdropPath: "", link: vUrl, description: "", mediaType: "movie" }; byUrl[vUrl] = it; order.push(vUrl); }
    var pic = extractPic(inner);
    if (pic && !it.posterPath) {
      var full = pic.indexOf("http") === 0 ? pic : absUrl(pic, host);
      it.posterPath = normUrl(full);
      it.coverUrl = it.posterPath;
      it.backdropPath = it.posterPath;
    }
    var altM = inner.match(/alt=["']([^"']+)["']/i);
    if (altM && !it.title) it.title = cleanLabel(altM[1]);
    var h3M = inner.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    if (h3M) it.title = cleanLabel(h3M[1]);
    var durM = inner.match(/vc-dur[^>]*>([^<]+)<\//i);
    if (durM && !it.description) it.description = cleanLabel(durM[1]);
    var txt = cleanLabel(inner);
    if (txt && txt.length > 2 && !it.title && !/^\d+$/.test(txt)) it.title = txt;
  }
  var out = [];
  for (var i = 0; i < order.length; i++) {
    var it2 = byUrl[order[i]];
    if (it2.posterPath || it2.title) {
      if (!it2.title) it2.title = "精彩视频";
      it2.title = it2.title.replace(/\s*\[下载和在线观看\]\s*$/i, "").trim() || it2.title;
      out.push(it2);
    }
  }
  return out;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function listUrlFor(typeId, page) {
  var p = Math.max(1, parseInt(page, 10) || 1);
  var suffix = p > 1 ? ("page/" + p + "/") : "";
  if (typeId === "video") return "/zh-CN/video/" + suffix;
  if (typeId === "home" || !typeId) return "/zh-CN/" + suffix;
  return "/zh-CN/" + typeId + "/" + suffix;
}

async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var target = t(params.sub || "");
  if (!target) {
    var cat = t(params.cat || "");
    for (var i = 0; i < GROUPS.length; i++) {
      if (GROUPS[i].id === cat) { target = GROUPS[i].def; break; }
    }
  }
  if (!target) target = "video";
  try {
    var html = await getHtml(listUrlFor(target, page));
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
  var path = page > 1 ? ("/zh-CN/page/" + page + "/?s=" + encodeURIComponent(wd)) : ("/zh-CN/?s=" + encodeURIComponent(wd));
  try {
    var html = await getHtml(path);
    var list = parseCards(html, HOST);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function detailPath(link) {
  var s = t(link);
  if (!s) return "";
  var m = s.match(/\/zh-CN\/[a-z0-9][a-z0-9-]*\/?/);
  if (m) {
    var p = m[0];
    if (p.charAt(p.length - 1) !== "/") p += "/";
    return p;
  }
  return s;
}

async function loadDetail(link) {
  try {
    var path = detailPath(link);
    if (!path) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var durl = path.indexOf("http") === 0 ? path : HOST + path;
    var html = await getHtml(path);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var h1M = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    var mainTitle = h1M ? cleanLabel(h1M[1]) : "";
    if (!mainTitle) {
      var tM = html.match(/<title>(.*?)<\/title>/i);
      mainTitle = tM ? cleanLabel(tM[1]).replace(/\s*-\s*JAVMIT\s*$/i, "") : "精彩视频";
    }
    mainTitle = mainTitle.replace(/\s*\[下载和在线观看\]\s*$/i, "").trim() || "精彩视频";
    var posterPic = "";
    var posterM = html.match(/<video[^>]+poster=["']([^"']+)["']/i);
    if (posterM) posterPic = normUrl(t(posterM[1]));
    if (!posterPic) {
      var ogM = html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
      if (ogM && String(ogM[1]).indexOf("/uploads/") >= 0) posterPic = normUrl(t(ogM[1]));
    }
    // 多档：.rawx-quality-btn（AUTO/1080P/480P），按 1080P > AUTO > 720P > 480P 排序；只有母带时单档
    var quals = [];
    var seenQ = {};
    var qre = /class=["'][^"']*rawx-quality-btn[^"']*["'][^>]*data-src=["']([^"']+)["'][^>]*data-label=["']([^"']+)["']/gi;
    var qm;
    while ((qm = qre.exec(html))) {
      var src = normUrl(t(qm[1]));
      var label = String(qm[2] || "").trim().toUpperCase() || "AUTO";
      if (!src || seenQ[src]) continue;
      seenQ[src] = 1;
      quals.push({ label: label, src: src });
    }
    if (!quals.length) {
      var dM = html.match(/data-default-src=["']([^"']+)["']/i);
      if (dM) quals.push({ label: "AUTO", src: normUrl(t(dM[1])) });
    }
    if (!quals.length) {
      var ogvM = html.match(/property=["']og:video["'][^>]+content=["']([^"']+)["']/i);
      if (ogvM) quals.push({ label: "AUTO", src: normUrl(t(ogvM[1])) });
    }
    function rank(l) {
      if (l === "1080P") return 0;
      if (l === "AUTO") return 1;
      if (l === "720P") return 2;
      if (l === "480P") return 3;
      return 4;
    }
    quals.sort(function (a, b) { return rank(a.label) - rank(b.label); });
    var epLinks = [];
    var childItems = [];
    for (var i = 0; i < quals.length; i++) {
      var q = quals[i];
      var epLink = durl + "@@" + q.src;
      epLinks.push({ name: q.label, link: epLink });
      childItems.push({
        id: epLink,
        title: mainTitle + " " + q.label,
        name: q.label,
        mediaType: "movie",
        seasonNumber: 1,
        episodeNumber: i + 1,
        link: epLink
      });
    }
    var result = {
      id: durl,
      type: "url",
      title: mainTitle,
      name: mainTitle,
      description: quals.length > 1 ? ("多档：" + quals.length + " 档清晰度可选") : "JavMit",
      mediaType: "movie",
      link: durl,
      coverUrl: posterPic,
      posterPath: posterPic,
      backdropPath: posterPic,
      playerType: "app"
    };
    if (epLinks.length) {
      result.episodes = epLinks;
      result.episodeItems = childItems;
      result.childItems = childItems;
    }
    return result;
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

function isVideoFormat(url) {
  var low = String(url || "").toLowerCase();
  return low.indexOf(".m3u8") >= 0 || low.indexOf(".mp4") >= 0 || low.indexOf(".flv") >= 0 || low.indexOf(".ts") >= 0;
}

async function loadResource(params) {
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 分集链接形态：<详情页>@@<播单直链>；播单与分片无 Referer 回 403（VM 实测），
  // 而 REX 播放器不把 customHeaders 转发给分片请求，直出必死，改走 hls-relay 中转
  // （relay 服务端带站根 Referer 取数，分片改写为自身 /f/ 地址）。
  var durl = "";
  var target = raw;
  var at = raw.indexOf("@@");
  if (at >= 0) { durl = raw.slice(0, at); target = raw.slice(at + 2); }
  if (target && isVideoFormat(target)) {
    return [{ name: "播放", url: relayPlaylistUrl(target, HOST + "/"), playerType: "app" }];
  }
  // 兜底：直接传了详情地址（无 @@）时，现取详情取首档再中转（与 javhdporn 的稳健做法一致）。
  var d = durl || raw;
  if (d) {
    try {
      var det = await loadDetail(d);
      var eps = det && det.episodes;
      if (eps && eps.length) {
        var first = String(eps[0].link || "");
        var fAt = first.indexOf("@@");
        var fTarget = fAt >= 0 ? first.slice(fAt + 2) : first;
        if (fTarget && isVideoFormat(fTarget)) {
          return [{ name: "播放", url: relayPlaylistUrl(fTarget, HOST + "/"), playerType: "app" }];
        }
      }
    } catch (e) { /* fall through */ }
  }
  return [];
}
