// Px8x for REX (lai_px8x v1.0.0)
// 移植自 mira-cat 蜘蛛 px8x.js（只读蓝图），后端 https://8xx6.lol/。
// 全站文字 base64 混淆：document.write(d('...'))，d() 即 atob；解码后去掉 display:none 噪音 span。
// 列表 /list/{id}-N.html，详情 /video/{id}.html，播放走详情页 hls.loadSource 里的
// https://m.892539.xyz/play.php?site_id={n}&source_id={id}（site_id 不固定，12/13 都见过，
// 必须从详情页现取，不能写死）。封面明文直链，无 Referer 门禁；清单 METHOD=NONE（不加密），
// 单档不编造清晰度。分类：首页最新 + 15 个视频列表。

WidgetMetadata = {
  id: "lai_px8x",
  title: "Px8x",
  description: "Px8x：16 分类，详情现取 play.php 播单（site_id 不固定），单档 m3u8",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://8xx6.lol",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "首页最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "国产", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "901179" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "911179" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "921179" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "欧美", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "931179" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "传媒", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "941179" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "探花", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "951179" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "中文", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "961179" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "动漫", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "971179" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "日韩无码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "891319" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "日本无码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "901339" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "欧美极品", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "901309" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "国产专区", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "901169" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "日本有码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "911169" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "日本无码2", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "921169" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "欧美情色", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "931169" }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://8xx6.lol";
var PLAY_HOST = "https://m.892539.xyz";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  return t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return HOST + "/" + u;
}

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

// 还原混淆页面：把 document.write(d('...')) 替换成解码后的 HTML，
// 再去掉解码后插在文字中间的 display:none 噪音 span
function decodePage(html) {
  if (!html) return "";
  var out = html.replace(/document\.write\(d\((['"])([A-Za-z0-9+/=]+)\1\)\)/g, function (m, q, b) { return b64decode(b); });
  out = out.replace(/<span[^>]*display\s*:\s*none[^>]*>.*?<\/span>/gi, "");
  return out;
}

async function getHtml(url, referer) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Referer": referer || HOST + "/"
      }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body;
  } catch (e) { return ""; }
}

function listUrl(cat, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  cat = t(cat) || "home";
  if (cat === "home" || cat === "") return HOST + "/";
  return HOST + "/list/" + cat + "-" + page + ".html";
}

// 解析列表/搜索页：封面取缩略图锚点里的 img，标题取标题锚点里的 <script> 文本，按 id 合并去重
function parseList(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var decoded = decodePage(html);
  var covers = {};
  var order = [];
  var coverRe = /<a href="\/video\/(\d+)\.html">\s*<img[^>]+(?:src|data-src)="([^"]+)"[^>]*>/gi;
  var m;
  while ((m = coverRe.exec(decoded)) !== null) {
    var id = m[1];
    if (!covers[id]) {
      covers[id] = absUrl(m[2]);
      order.push(id);
    }
  }
  var titles = {};
  var titleRe = /<a[^>]*href="\/video\/(\d+)\.html"[^>]*>\s*<script[^>]*>([^<]+?);?\s*<\/script>/gi;
  while ((m = titleRe.exec(decoded)) !== null) {
    var id2 = m[1];
    if (!titles[id2]) titles[id2] = decodeHtml(m[2]);
  }
  for (var i = 0; i < order.length; i++) {
    var vid = order[i];
    if (seen[vid]) continue;
    seen[vid] = 1;
    var title = titles[vid] || "";
    var link = HOST + "/video/" + vid + ".html";
    out.push({
      id: link,
      type: "url",
      title: title || ("视频 " + vid),
      posterPath: covers[vid] || "",
      coverUrl: covers[vid] || "",
      backdropPath: covers[vid] || "",
      link: link,
      description: "",
      mediaType: "movie"
    });
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
  // 首页只有一页
  if ((zone === "home" || zone === "") && page > 1) return emptyItem("首页只有一页");
  try {
    var html = await getHtml(listUrl(zone, page));
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
    var url = HOST + "/search.php?content=" + encodeURIComponent(wd);
    if (page > 1) url += "&page=" + page;
    var html = await getHtml(url);
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

// 详情页标题：优先取 document.title = d('...') 解码；兜底取 h1 文本
function extractTitle(rawHtml, decodedHtml, fallback) {
  var m = rawHtml.match(/document\.title\s*=\s*d\((['"])([A-Za-z0-9+/=]+)\1\)/);
  if (m) {
    var s = t(b64decode(m[2]));
    if (s) return decodeHtml(s);
  }
  m = decodedHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (m) {
    var s2 = t(m[1].replace(/<[^>]+>/g, "").replace(/;\s*$/, ""));
    if (s2) return decodeHtml(s2);
  }
  m = decodedHtml.match(/<title>([^<]*)<\/title>/i);
  if (m && t(m[1])) return decodeHtml(m[1]);
  return fallback || "";
}

// 详情页播放地址：优先取 hls.loadSource 里的完整地址，兜底按 site_id/source_id 拼
function extractPlayUrl(decodedHtml) {
  var m = decodedHtml.match(/hls\.loadSource\(['"]([^'"]+play\.php[^'"]*)['"]\)/i);
  if (m) return t(m[1]);
  m = decodedHtml.match(/play\.php\?site_id=(\d+)&(?:amp;)?source_id=(\d+)/i);
  if (m) return PLAY_HOST + "/play.php?site_id=" + m[1] + "&source_id=" + m[2];
  return "";
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var vid = "";
    var vm = raw.match(/video\/(\d+)/);
    if (vm) vid = vm[1];
    else vid = raw.replace(/[^0-9]/g, "");
    if (!vid) return { id: raw, type: "url", title: "解析失败", description: "无视频 id" };
    var pageUrl = HOST + "/video/" + vid + ".html";
    var html = await getHtml(pageUrl, pageUrl);
    if (!html) return { id: pageUrl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var decoded = decodePage(html);
    var name = extractTitle(html, decoded, vid);
    var playUrl = extractPlayUrl(decoded);
    // 详情页无本片封面（只有相关视频缩略图），封面留空，App 沿用列表封面
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    if (playUrl) {
      var id = pageUrl + "@@PLAY";
      eps.push({ name: "播放", link: id });
      seasonEps.push({ title: "播放", videoUrl: playUrl, episodeNumber: 1 });
      epItems.push({
        id: id,
        type: "url",
        title: "播放",
        mediaType: "movie",
        posterPath: "",
        videoUrl: playUrl,
        link: id,
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system",
        customHeaders: { "User-Agent": UA, "Referer": HOST + "/" }
      });
    }
    var result = {
      id: pageUrl,
      type: "detail",
      title: name || vid,
      name: name || vid,
      description: playUrl ? "" : "未找到播放地址",
      mediaType: "movie",
      link: pageUrl,
      coverUrl: "",
      posterPath: "",
      backdropPath: "",
      playerType: "app"
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "播放", name: "播放", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
      result.videoUrl = playUrl;
    }
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 档位入口：@@PLAY -> 回详情取 play.php 地址（site_id 从详情页现取，不写死）
  var at = raw.indexOf("@@PLAY");
  if (at >= 0) {
    var durl = raw.slice(0, at);
    try {
      var det = await loadDetail(durl);
      var items = det && det.episodeItems;
      if (items && items.length && items[0].videoUrl) {
        return [{ name: "播放", url: items[0].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
      }
    } catch (e) { /* fall through */ }
    return [];
  }
  // 直链 play.php / m3u8
  if (/play\.php/i.test(raw) || /\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  }
  // 兜底：详情地址 -> 取详情首线
  try {
    var det2 = await loadDetail(raw);
    var eps = det2 && det2.episodeItems;
    if (eps && eps.length && eps[0].videoUrl) {
      return [{ name: "播放", url: eps[0].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
  } catch (e) { /* fall through */ }
  return [];
}
