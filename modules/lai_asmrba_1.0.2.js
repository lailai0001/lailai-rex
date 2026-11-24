// v1.0.2：AVDB 样式详情：分类小卡片 genreItems + 点按路由（详情页提取分类链接，点按打开该分类全部内容）
// ASMR吧 for REX (lai_asmrba v1.0.1)
// 移植自 mira-cat 蜘蛛 asmrba.js（只读蓝图，逻辑等价移植，未改动猫源）。
// 后端：www.ufov8.com（asmrba.com 已死，2026-11-23 迁址），WordPress JSON 接口 /wp-json/wp/v2（与蜘蛛同一套接口）。
// 注意：新站 API 正文只有封面图、无 iframe；详情无流时改抓文章页 HTML（post.link）取 B站 iframe。
// 分类取自 2026-11-23 实测 ufov8 分类接口返回：国内ASMR(18)/国外ASMR(12)/
// 韩国ASMR(11)/女性向(14)/精剪合集(37)/白噪音(56)/视频(2)，不编造。
// 列表、详情、搜索均按蜘蛛的 posts 接口搬运。
// 详情取流顺序与蜘蛛一致：正文直链 .m3u8/.mp4 在前，iframe 在后；
// B站嵌入用蜘蛛 play 的同款公开接口解析直链（view 取 cid → playurl，
// 首发 cid 漂移时用 view 的当前 cid 重试一次，B站已删稿则返回空）。
// 音频出法照星梦ASMR（lai_xingmengasmr）的成例：卡片 mediaType 为 movie，
// 详情只给一个 videoUrl、playerType 为 app；本站实测帖子均为 B站视频嵌入，
// 解析出的是带声音的 mp4 直链，不是纯音频文件。REX 详情只有一个 videoUrl
// 槽位，帖子有多段时播猫源顺序的第 1 段、段数写进简介，绝不编造多余段。

WidgetMetadata = {
  id: "lai_asmrba",
  title: "ASMR吧",
  description: "ASMR吧（ufov8.com）：国内/国外/韩国ASMR、女性向、精剪合集、白噪音、视频，帖子内 B站嵌入与直链解析播放",
  author: "lai",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  site: "https://www.ufov8.com",
  detailCacheDuration: 180,
  modules: [
    { title: "最新更新", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "国内ASMR", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "18" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "国外ASMR", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "12" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "韩国ASMR", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "11" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "女性向", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "14" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "精剪合集", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "37" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "白噪音", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "56" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "视频", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "2" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "搜索", functionName: "search", cacheDuration: 180, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page", value: "1" }] }
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

var BASE = "https://www.ufov8.com";
var API = BASE + "/wp-json/wp/v2";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function t(v) { return String(v == null ? "" : v).trim(); }

function decodeEntities(s) {
  var out = t(s);
  out = out.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  out = out.replace(/&#(\d+);/g, function (m, code) {
    var n = parseInt(code, 10);
    return n ? String.fromCharCode(n) : m;
  });
  return out;
}

function stripTags(s) {
  return decodeEntities(s).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function apiHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "application/json",
    "Referer": referer || BASE + "/"
  };
}

async function apiGet(url, referer) {
  var res = await Widget.http.get(url, { headers: apiHeaders(referer) });
  var data = res && res.data != null ? res.data : null;
  if (data == null) return null;
  if (typeof data === "object") return data;
  try { return JSON.parse(String(data)); } catch (e) { return null; }
}

async function pageText(url, referer) {
  try {
    var res = await Widget.http.get(url, { headers: { "User-Agent": UA, "Accept": "text/html,*/*", "Referer": referer || BASE + "/" } });
    var d = res && res.data != null ? res.data : "";
    return typeof d === "string" ? d : "";
  } catch (e) { return ""; }
}

// ---- 列表解析（与蜘蛛 card 同规则）----
function coverOf(p) {
  try {
    var m = p._embedded && p._embedded["wp:featuredmedia"] && p._embedded["wp:featuredmedia"][0];
    return m && m.source_url ? m.source_url : "";
  } catch (e) { return ""; }
}

function postCard(p) {
  var id = String(p.id);
  var title = stripTags((p.title && p.title.rendered) || p.title || "");
  if (!title) return null;
  var pic = coverOf(p);
  var link = p.link || (BASE + "/post/" + id + ".html");
  return {
    id: id,
    type: "url",
    title: title,
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    link: link,
    description: stripTags((p.excerpt && p.excerpt.rendered) || ""),
    mediaType: "movie"
  };
}

function postsToCards(j) {
  var out = [];
  if (!j || !j.length) return out;
  for (var i = 0; i < j.length; i++) {
    var c = postCard(j[i]);
    if (c) out.push(c);
  }
  return out;
}

async function loadList(params) {
  params = params || {};
  var cat = t(params.cat || params.path || "latest");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var url = API + "/posts?per_page=20&page=" + page + "&_embed=1";
  if (cat && cat !== "latest") url += "&categories=" + encodeURIComponent(cat);
  try {
    var cards = postsToCards(await apiGet(url));
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败", description: String((e && e.message) || e) }];
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
  var url = API + "/posts?per_page=20&page=" + page + "&_embed=1&search=" + encodeURIComponent(wd);
  try {
    var cards = postsToCards(await apiGet(url));
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败", description: String((e && e.message) || e) }];
  }
}

// ---- 详情取流（与蜘蛛 detail / play 同规则）----
function absUrl(u) {
  u = decodeEntities(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.charAt(0) === "/") return BASE + u;
  return BASE + "/" + u;
}

function extractStreams(html) {
  var out = [];
  var seen = {};
  var direct = String(html || "").match(/https?:\/\/[^\s"'<>]+(?:\.m3u8|\.mp4)[^\s"'<>]*/g) || [];
  for (var i = 0; i < direct.length; i++) {
    var d = decodeEntities(direct[i]);
    if (!seen[d]) { seen[d] = 1; out.push(d); }
  }
  var ifr = String(html || "").match(/<iframe[^>]+src="([^"]+)"/g) || [];
  for (var j = 0; j < ifr.length; j++) {
    var m = ifr[j].match(/src="([^"]+)"/i);
    if (!m) continue;
    var u = absUrl(m[1]);
    if (u && !seen[u]) { seen[u] = 1; out.push(u); }
  }
  return out;
}

function biliParts(u) {
  var bvidM = String(u || "").match(/(BV[0-9A-Za-z]+)/);
  var cidM = String(u || "").match(/[?&]cid=(\d+)/);
  return { bvid: bvidM ? bvidM[1] : "", cid: cidM ? cidM[1] : "" };
}

// 蜘蛛 biliUrl 的等价移植：qn=64、fnval=0、platform=html5；
// durl 在前，dash 音频/视频兜底；cid 漂移时用 view 的当前 cid 重试一次。
async function resolveBilibili(u) {
  var parts = biliParts(u);
  if (!parts.bvid) return "";
  var headers = { "User-Agent": UA, "Referer": "https://www.bilibili.com/video/" + parts.bvid + "/" };
  var cid = parts.cid;
  var playurl = async function (c) {
    var j = await apiGet("https://api.bilibili.com/x/player/playurl?bvid=" + encodeURIComponent(parts.bvid) + "&cid=" + encodeURIComponent(c) + "&qn=64&fnval=0&platform=html5", "https://www.bilibili.com/");
    var d = (j && j.data) || {};
    if (d.durl && d.durl.length) return d.durl[0].url || "";
    if (d.dash) {
      if (d.dash.audio && d.dash.audio.length) return d.dash.audio[0].baseUrl || "";
      if (d.dash.video && d.dash.video.length) return d.dash.video[0].baseUrl || "";
    }
    return "";
  };
  try {
    if (!cid) {
      var v0 = await apiGet("https://api.bilibili.com/x/web-interface/view?bvid=" + encodeURIComponent(parts.bvid), "https://www.bilibili.com/");
      cid = String((v0 && v0.data && v0.data.cid) || "");
    }
    if (!cid) return "";
    var du = await playurl(cid);
    if (!du) {
      var v1 = await apiGet("https://api.bilibili.com/x/web-interface/view?bvid=" + encodeURIComponent(parts.bvid), "https://www.bilibili.com/");
      var fresh = String((v1 && v1.data && v1.data.cid) || "");
      if (fresh && fresh !== cid) du = await playurl(fresh);
    }
    return du;
  } catch (e) { return ""; }
}

function detailLinkToId(link) {
  if (link != null && typeof link === "object") {
    link = link.link || link.id || link.url || "";
  }
  var s = String(link || "");
  var m = s.match(/\/post\/(\d+)\.html/);
  if (m) return m[1];
  m = s.match(/\/posts\/(\d+)/);
  if (m) return m[1];
  if (/^\d+$/.test(s)) return s;
  return "";
}

function notFound(url, title, pic, desc) {
  return { id: url, type: "url", title: title || "ASMR吧", link: url, posterPath: pic || "", coverUrl: pic || "", backdropPath: pic || "", description: "未找到播放地址" };
}

// ---- AVDB 样式详情：分类小卡片（点按出该分类全部内容）----
// v1.0.2：详情页提取分类链接建成 genreItems；点按分类后 loadDetail 走分类分支返回该分类全部内容。
var TAX_GENRE_RE = /\/(genres?|tags?|category|categor(?:y|ies)|labels?|makers?)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)?|labels?|makers?|all|全部|分类|标签|题材)$/i;

function taxSlugOf(u) {
  var p = String(u || "").replace(/^https?:\/\/[^\/]+/, "").split("?")[0].split("#")[0].split("/").filter(function (s) { return s !== ""; });
  return p.length ? p[p.length - 1] : "";
}

function taxDetailRet(ret, genres) {
  if (ret && genres && genres.length) ret.genreItems = genres;
  return ret;
}

function extractGenreFromHtml(html) {
  var out = [];
  var seen = {};
  var baseHost = String(BASE).replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(String(html || ""))) !== null) {
    var href = m[1] || "";
    var name = String(m[2] || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (!name || name.length > 40 || TAX_NAV_NAME_RE.test(name)) continue;
    var abs = absUrl(href);
    if (!/^https?:\/\//i.test(abs)) continue;
    var host = abs.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (baseHost && host !== baseHost) continue;
    var pth = abs.replace(/^https?:\/\/[^\/]+/, "").split("?")[0].split("#")[0];
    var segs = pth.split("/").filter(function (s) { return s !== ""; });
    var ok = false;
    if (segs.length === 2 && TAX_GENRE_RE.test(abs)) ok = true;
    if (!ok) continue;
    if (seen[abs]) continue;
    seen[abs] = 1;
    out.push({ id: abs, title: name });
    if (out.length >= 20) break;
  }
  return out;
}

function taxGenresFromPost(post, html) {
  var out = [];
  var seen = {};
  try {
    var terms = (post && post._embedded && post._embedded["wp:term"]) || [];
    var cats = terms.length ? (terms[0] || []) : [];
    for (var i = 0; i < cats.length && out.length < 20; i++) {
      var tm = cats[i] || {};
      if (tm.id == null || !tm.name) continue;
      var key = "asmrcat:" + tm.id;
      if (seen[key]) continue;
      seen[key] = 1;
      out.push({ id: key, title: String(tm.name) });
    }
  } catch (e) {}
  if (!out.length && html) {
    var more = extractGenreFromHtml(html);
    for (var j = 0; j < more.length; j++) out.push(more[j]);
  }
  return out;
}
async function loadDetail(link) {
  var taxGenres = [];
  var url = String((link != null && typeof link === "object") ? (link.link || link.id || link.url || "") : (link || ""));
  if (!url) {
    return { id: "", type: "url", title: "参数错误", description: "无法识别详情链接" };
  }
  try {
    // AVDB 样式：点按分类小卡片 → 打开该分类的全部内容。
    if (url.indexOf("asmrcat:") === 0) {
      var taxWorks = await loadList({ cat: url.slice(8), page: 1 });
      if (!Array.isArray(taxWorks)) taxWorks = [];
      var taxReal = taxWorks.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
      return {
        id: url,
        type: "detail",
        mediaType: "movie",
        title: "分类",
        link: url,
        description: "分类 · 共 " + taxReal.length + " 部作品",
        videoUrl: "",
        childItems: [],
        relatedItems: taxReal.length ? taxReal : taxWorks
      };
    }
    if (TAX_GENRE_RE.test(url)) {
      var taxSlug = taxSlugOf(url);
      var taxName = taxSlug;
      try { taxName = decodeURIComponent(taxSlug); } catch (e) {}
      var taxWorks2 = await search({ keyword: taxName, page: 1 });
      if (!Array.isArray(taxWorks2)) taxWorks2 = [];
      var taxReal2 = taxWorks2.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
      return {
        id: url,
        type: "detail",
        mediaType: "movie",
        title: taxName || "分类",
        link: url,
        description: "分类 · 共 " + taxReal2.length + " 部作品",
        videoUrl: "",
        childItems: [],
        relatedItems: taxReal2.length ? taxReal2 : taxWorks2
      };
    }
    var pid = detailLinkToId(url);
    var post = null;
    if (pid) {
      post = await apiGet(API + "/posts/" + pid + "?_embed=1");
    }
    if (!post || !post.id) {
      return notFound(url, "", "", "");
    }
    var title = stripTags((post.title && post.title.rendered) || post.title || "");
    var pic = coverOf(post);
    var desc = stripTags((post.excerpt && post.excerpt.rendered) || "");
    var html = (post.content && post.content.rendered) || "";
    taxGenres = taxGenresFromPost(post, html);
    var streams = extractStreams(html);
    if (!streams.length && post.link) {
      var articleHtml = await pageText(post.link, url);
      if (articleHtml) streams = extractStreams(articleHtml);
    }
    if (!streams.length) {
      return notFound(url, title, pic, desc);
    }
    // REX 详情只有一个 videoUrl 槽位：按猫源顺序取第 1 条可解析的流；
    // 多段时把段数写进简介，不编造其余段的地址。
    var videoUrl = "";
    var videoHeaders = { "User-Agent": UA, "Referer": BASE + "/" };
    for (var i = 0; i < streams.length; i++) {
      var s = streams[i];
      if (/bilibili\.com/i.test(s)) {
        var b = await resolveBilibili(s);
        if (b) {
          videoUrl = b;
          videoHeaders = { "User-Agent": UA, "Referer": "https://www.bilibili.com/" };
          break;
        }
      } else if (/\.(mp4|m3u8)(\?|$)/i.test(s)) {
        videoUrl = s;
        break;
      } else {
        // 非 B站 iframe：与蜘蛛 play 的 parse:1 一致，交 App 端解析播放。
        videoUrl = s;
        break;
      }
    }
    if (!videoUrl) {
      return notFound(url, title, pic, desc);
    }
    if (streams.length > 1 && !desc) desc = "共 " + streams.length + " 段，本次播第 1 段";
    else if (streams.length > 1) desc = desc + "（共 " + streams.length + " 段，本次播第 1 段）";
    return taxDetailRet({
      id: url,
      type: "detail",
      title: title || "ASMR吧",
      link: url,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: desc,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: videoHeaders
    }, taxGenres);
  } catch (e) {
    return { id: url, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
