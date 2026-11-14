// AnimeSex for REX (lai_animesex v1.0.0)
// 移植自 mira-cat 蜘蛛 py_animesex.js（只读蓝图），后端 https://animesex.club/。
// 动漫视频站。列表：WordPress <article> 卡片，封面 data-main-thumb；分页 /{path}/page/N/。
// 详情：player-x.php?q=<base64> 解出 <video src>（直链）或 <iframe src>（嗅探）。
// 分类：17 类（最新更新 + 2D/3D Hentai + 14 个 genre）。

WidgetMetadata = {
  id: "lai_animesex",
  title: "AnimeSex",
  description: "AnimeSex：动漫视频站，17 分类，详情解 player-x 直链或 iframe 嗅探",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://animesex.club",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新更新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "2D Hentai", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "anime/2d-hentai" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "3D Hentai", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "anime/3d-hentai" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "2D 合集", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "genres/2d-hentai" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "3D 合集", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "genres/3d-hentai" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "genres/uncensored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "Ahegao", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "genres/ahegao" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "3D", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "genres/3d" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "3DCG", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "genres/3dcg" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "丝袜", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "genres/stockings" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "genres/large-breasts" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "内射", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "genres/cream-pie" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "幻想", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "genres/fantasy" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "游戏", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "genres/game" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "恶搞", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "genres/parody" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "短发", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "genres/short-hair" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "着衣", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "genres/clothed" }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://animesex.club";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function clean(s) {
  var x = String(s || "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ");
  x = x.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  x = x.replace(/\s*[-|]\s*Anime\s*Sex\s*$/i, "").trim();
  return x;
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return HOST + "/" + u;
}

async function getHtml(url, referer) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Referer": referer || HOST + "/"
      }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body;
  } catch (e) { return ""; }
}

function mainScope(html) {
  var m = String(html || "").match(/<main[^>]*>([\s\S]*?)<\/main>/);
  return m ? m[1] : String(html || "");
}

function parseList(html) {
  var scope = mainScope(html);
  var items = [];
  var seen = {};
  var re = /<article\b[^>]*>/g;
  var m;
  while ((m = re.exec(scope)) !== null) {
    var head = m[0];
    var seg = scope.slice(m.index, m.index + 3000);
    var lm = seg.match(/href="((?:https:\/\/animesex\.club)?\/video\/[^"]+)"/);
    if (!lm) continue;
    var link = lm[1];
    if (link.charAt(0) === "/") link = HOST + link;
    if (seen[link]) continue;
    seen[link] = 1;
    var cover = "";
    var tm = head.match(/data-main-thumb="([^"]+)"/);
    if (tm) cover = tm[1];
    var title = "";
    var t1 = seg.match(/title="([^"]+)"/);
    if (t1) title = clean(t1[1]);
    if (!title) {
      var al = seg.match(/alt="([^"]+)"/);
      if (al) title = clean(al[1]);
    }
    if (!title) title = clean(link.replace(/\/$/, "").split("/").filter(Boolean).pop().replace(/-/g, " "));
    if (!cover) {
      var im = seg.match(/src="(https?:\/\/[^"]+\/wp-content\/uploads\/[^"]+)"/);
      if (im) cover = im[1];
    }
    items.push({
      id: link,
      type: "url",
      title: title || "AnimeSex",
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: link,
      description: "",
      mediaType: "movie"
    });
  }
  return items;
}

function pagecount(html, pg) {
  var tm = String(html || "").match(/Page\s+\d+\s+of\s+(\d+)/);
  if (tm) return parseInt(tm[1], 10);
  var scope = mainScope(html);
  var nums = [];
  var re = /\/page\/(\d+)\//g;
  var x;
  while ((x = re.exec(scope)) !== null) nums.push(parseInt(x[1], 10));
  if (nums.length) return Math.max.apply(null, nums);
  return pg;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "latest").replace(/^\/+|\/+$/g, "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var url;
  if (zone === "latest") {
    url = page <= 1 ? (HOST + "/?filter=latest") : (HOST + "/page/" + page + "/?filter=latest");
  } else if (zone) {
    url = page <= 1 ? (HOST + "/" + zone + "/") : (HOST + "/" + zone + "/page/" + page + "/");
  } else {
    url = page <= 1 ? (HOST + "/") : (HOST + "/page/" + page + "/");
  }
  try {
    var html = await getHtml(url);
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
    var q = encodeURIComponent(wd);
    var url = page <= 1 ? (HOST + "/?s=" + q) : (HOST + "/page/" + page + "/?s=" + q);
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

// 详情：player-x.php?q=<base64> 解出 <video src>（直链）或 <iframe src>（嗅探）
function playFrom(html) {
  var re = /player-x\.php\?q=([A-Za-z0-9+/=]+)/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    try {
      var dec = b64decode(m[1]);
      var tagMatch = dec.match(/[?&]tag=([^&]*)/);
      var tag = tagMatch ? decodeURIComponent(tagMatch[1]) : "";
      var srcs = [];
      var sm = /src=["']([^"']+)["']/g;
      var s2;
      while ((s2 = sm.exec(tag))) srcs.push(s2[1]);
      if (!srcs.length) continue;
      if (tag.indexOf("<iframe") >= 0) return { url: srcs[0], sniff: true };
      return { url: srcs[0], sniff: false };
    } catch (e) { continue; }
  }
  var m2 = html.match(/https?:\/\/[^"']+\.(?:mp4|m3u8)[^"']*/);
  if (m2) return { url: m2[0], sniff: false };
  return { url: "", sniff: false };
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var url = raw.indexOf("http") === 0 ? raw : (HOST + "/" + raw.replace(/^\/+/, ""));
    var html = await getHtml(url, url);
    if (!html) return { id: url, type: "url", title: "详情获取失败", description: "页面无返回" };
    var title = "";
    var h1 = html.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/)
      || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (h1) title = clean(h1[1]);
    if (!title) {
      var tm = html.match(/<title>([\s\S]*?)<\/title>/);
      if (tm) title = clean(tm[1]);
    }
    var cover = "";
    var pic = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/)
      || html.match(/data-main-thumb="([^"]+)"/);
    if (pic) cover = pic[1];
    var desc = "";
    var dm = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/)
      || html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/)
    if (dm) desc = clean(dm[1]);
    var p = playFrom(html);
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    if (p.url) {
      var id = url + "@@PLAY";
      eps.push({ name: "正片", link: id });
      seasonEps.push({ title: "正片", videoUrl: p.url, episodeNumber: 1 });
      epItems.push({
        id: id,
        type: "url",
        title: "正片",
        mediaType: "movie",
        posterPath: cover,
        videoUrl: p.url,
        link: id,
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: p.sniff ? "app" : "system",
        customHeaders: { "User-Agent": UA, "Referer": HOST + "/" }
      });
    }
    var result = {
      id: url,
      type: "detail",
      title: title || "AnimeSex",
      name: title || "AnimeSex",
      description: desc || "AnimeSex 动漫视频",
      mediaType: "movie",
      link: url,
      coverUrl: cover,
      posterPath: cover,
      backdropPath: cover,
      playerType: "app"
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "正片", name: "正片", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
      if (!p.sniff) result.videoUrl = p.url;
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
  // 档位入口：@@PLAY -> 回详情取直链/嗅探地址
  var at = raw.indexOf("@@PLAY");
  if (at >= 0) {
    var durl = raw.slice(0, at);
    try {
      var det = await loadDetail(durl);
      var items = det && det.episodeItems;
      if (items && items.length && items[0].videoUrl) {
        return [{ name: "正片", url: items[0].videoUrl, playerType: items[0].playerType || "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
      }
    } catch (e) { /* fall through */ }
    return [];
  }
  // 直链
  if (/\.mp4(\?|#|$)/i.test(raw) || /\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  }
  // iframe / 其它地址：交嗅探
  if (/^https?:\/\//.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  }
  // 兜底：详情地址
  try {
    var det2 = await loadDetail(raw);
    var eps = det2 && det2.episodeItems;
    if (eps && eps.length && eps[0].videoUrl) {
      return [{ name: "正片", url: eps[0].videoUrl, playerType: eps[0].playerType || "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
  } catch (e) { /* fall through */ }
  return [];
}
