// JavTubs for REX (lai_javtubs v1.0.0)
// 站点：https://javtubs.com（JAV tube，SSR HTML，无 CF 墙，VM 直连 200）。
// 分类：最新 / 精选 / Reducing Mosaic（搜索背书，站内无独立 genre 页）+
//   7 个站内 category（有码/无码/中文字幕/无码中文/素人有码/1080p/4K）+
//   12 个 genre 快捷入口（站内 /genres 索引实测在列，逐项 HTTP 200 验过）。
// 列表：post-entry-1 卡片（48 条/页），分页 /page/N；搜索 /search?s=<kw>&page=N。
// 播放链（2026-11-15 实测）：详情页 hidden #links = base64(embed URL)，可多
//   server（,, 分隔）；POST /get_link.php {links, option} 取 embed URL；
//   主腿 earnvidjavgg.xyz（VidHide）：embed 页内 packed JS 解包出 hls2 master
//   m3u8（urlset 多档：480p/720p/1080p；单档片只出 480p），分片为明文 TS
//   （无 EXT-X-KEY），分片 Range 206、首字节 0x47；签名 36h 有效。
//   次腿 voe.sx 实测 404（AVGL-109），只作 embed 回落。
// v1.0.0（铁律写法）：loadDetail 当场解出真实档位写进 episodeItem.videoUrl
//   （playerType "system"，只出 master 里有的档，不编造）；全死时给站内
//   embed 行（playerType "app"）；连 embed 都拿不到才留无 videoUrl 行，
//   点播时 loadResource 重解；loadResource 只作回落、全程 try/catch、永不抛错。

WidgetMetadata = {
  id: "lai_javtubs",
  title: "JavTubs",
  description: "JavTubs（javtubs.com）：JAV 在线看，最新/精选/Reducing Mosaic/有码/无码/中文字幕等 10 个分类 + 12 个类型快捷入口，详情直交多档 m3u8（480p/720p/1080p 实测档位）",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://javtubs.com",
  detailCacheDuration: 180,
  modules: [
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "精选", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "featured" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Reducing Mosaic", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "rm" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/censored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/uncensored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中文字幕", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/chinese-subtitle" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码中文", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/chinese-uncensored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "素人有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/amateur-censored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "1080p", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/1080p" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "4K", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/4k" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "美少女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "genre/beautiful-girl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "专属女优", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "genre/featured-actress" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "单体作品", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "genre/single-work" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "genre/amateur" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "genre/人妻-主婦" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "熟女人妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "genre/熟女-人妻" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中出", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "genre/中出し" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "口交", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "genre/フェラ" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "潮吹", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "genre/潮吹き" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "后宫", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "genre/ハーレム" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "genre/巨乳" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "1080p·类型", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "genre/1080p" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    {
      id: "loadResource",
      title: "JavTubs 播放源",
      description: "播放时实时解析播放地址",
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

var BASE = "https://javtubs.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeEntities(s) {
  var out = String(s || "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  out = out.replace(/&#x([0-9a-fA-F]+);/g, function (a, h) {
    try { return String.fromCharCode(parseInt(h, 16)); } catch (e) { return a; }
  });
  out = out.replace(/&#(\d+);/g, function (a, d) {
    try { return String.fromCharCode(parseInt(d, 10)); } catch (e) { return a; }
  });
  return out;
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": referer || BASE + "/"
  };
}

function playHeaders() {
  return { "User-Agent": UA, "Referer": BASE + "/" };
}

async function fetchText(url, referer) {
  try {
    var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
    if (!res || res.data == null) return "";
    return String(res.data);
  } catch (e) {
    return "";
  }
}

async function fetchText200(url, referer) {
  try {
    var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
    if (!res || res.status !== 200 || res.data == null) return "";
    return String(res.data);
  } catch (e) {
    return "";
  }
}

// get_link.php 只认表单 POST（application/x-www-form-urlencoded）
async function postForm(url, body, referer) {
  try {
    var res = await Widget.http.post(url, body, { headers: {
      "User-Agent": UA,
      "Referer": referer || BASE + "/",
      "Accept": "*/*",
      "Content-Type": "application/x-www-form-urlencoded"
    } });
    if (!res || res.data == null) return "";
    return String(res.data);
  } catch (e) {
    return "";
  }
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return BASE + u;
  return BASE + "/" + u;
}

function slugCode(durl) {
  var slug = String(durl || "").replace(/\/$/, "").split("/").pop() || "";
  var m = slug.match(/^([a-z]+-\d+)/i);
  return m ? m[1].toUpperCase() : slug.toUpperCase();
}

// 列表卡片：<div class="post-entry-1"><a href="/<slug>" title="<CODE>">
//   <img src="https://javqw.com/u2/<hash>.jpg" ...>
function parseCards(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<div class="post-entry-1">[\s\S]*?<a href="(\/[^"]+)" title="([^"]*)">[\s\S]*?<img[^>]*src="([^"]+)"[^>]*>/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var href = m[1];
    if (seen[href]) continue;
    seen[href] = true;
    var name = decodeEntities(m[2] || "").trim();
    var pic = m[3] || "";
    if (!name) name = slugCode(href);
    if (!pic) continue;
    var link = BASE + href;
    out.push({
      id: link,
      type: "url",
      title: name,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: "",
      mediaType: "movie"
    });
  }
  return out;
}

function listUrl(path, page) {
  if (path === "rm") {
    return BASE + "/search?s=" + encodeURIComponent("reducing mosaic") + (page > 1 ? "&page=" + page : "");
  }
  if (path === "latest") {
    return BASE + "/new-post" + (page > 1 ? "/page/" + page : "");
  }
  if (path === "featured") {
    return BASE + "/featured" + (page > 1 ? "/page/" + page : "");
  }
  return BASE + "/" + path + (page > 1 ? "/page/" + page : "");
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var path = String(params.path || params.cat || params.zone || "latest");
  try {
    var html = await fetchText(listUrl(path, page));
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
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

async function search(params) {
  params = params || {};
  var wd = pickKeyword(params);
  var page = parseInt(params.page, 10) || 1;
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  try {
    var html = await fetchText(BASE + "/search?s=" + encodeURIComponent(wd) + (page > 1 ? "&page=" + page : ""));
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

// ---------- 播放链 ----------
// VidHide embed 页内 packed JS 解包（Dean Edwards packer，纯字符串替换，
// 不用 eval；解包失败回 ""，调用方走 embed 回落）。
// 注意：payload 内含单引号串（如 '28',），直接找第一个 "'," 会截断；
// 须逐个候选校验其后是 "<数字>,<数字>,'" 的参数形才算真正的 payload 尾。
function unpackPacked(html) {
  var s = String(html || "");
  var i = s.indexOf("eval(function(p,a,c,k,e,d){");
  if (i < 0) return "";
  var j = s.indexOf("}('", i);
  if (j < 0) return "";
  var pStart = j + 3;
  var k1 = -1;
  var a = 0;
  var c0 = 0;
  var kStr = "";
  var pos = pStart;
  while (true) {
    var q = s.indexOf("',", pos);
    if (q < 0) return "";
    var rest = s.slice(q + 2);
    var m = rest.match(/^(\d+),(\d+),'/);
    if (m) {
      k1 = q;
      a = parseInt(m[1], 10);
      c0 = parseInt(m[2], 10);
      kStr = rest.slice(m[0].length);
      break;
    }
    pos = q + 2;
  }
  var p = s.slice(pStart, k1);
  var kEnd = kStr.indexOf("'.split('|')");
  if (kEnd < 0) return "";
  var k = kStr.slice(0, kEnd).split("|");
  var out = p;
  var c = c0;
  while (c--) {
    if (k[c]) out = out.replace(new RegExp("\\b" + c.toString(a) + "\\b", "g"), k[c]);
  }
  if (out.indexOf("hls2") < 0 && out.indexOf("jwplayer") < 0) return "";
  return out;
}

function labelOf(h) {
  if (h >= 1080) return "1080p";
  if (h >= 720) return "720p";
  if (h >= 480) return "480p";
  if (h > 0) return h + "p";
  return "自适应";
}

// 单个 VidHide embed -> master 里的真实档位（只出 master 有的档）
async function tiersFromVidHide(embed, referer) {
  try {
    var html = await fetchText(embed, referer);
    if (!html) return [];
    var up = unpackPacked(html);
    if (!up) return [];
    var m2 = up.match(/"hls2":"([^"]+)"/);
    if (!m2) return [];
    var master = m2[1];
    var mt = await fetchText200(master, embed);
    if (!mt || mt.indexOf("#EXTM3U") < 0) return [];
    var base = master.split("master.m3u8")[0];
    var tiers = [];
    var re = /#EXT-X-STREAM-INF:[^\n]*RESOLUTION=(\d+)x(\d+)[^\n]*\n([^\n]+)/g;
    var m;
    while ((m = re.exec(mt)) !== null) {
      var h = parseInt(m[2], 10) || 0;
      var rel = t(m[3] || "");
      if (!rel || rel.charAt(0) === "#") continue;
      var url = /^https?:\/\//i.test(rel) ? rel : base + rel;
      tiers.push({ label: labelOf(h), url: url, h: h });
    }
    tiers.sort(function (a, b) { return b.h - a.h; });
    var seen = {};
    var dedup = [];
    for (var i = 0; i < tiers.length; i++) {
      if (seen[tiers[i].label]) continue;
      seen[tiers[i].label] = true;
      dedup.push(tiers[i]);
    }
    return dedup;
  } catch (e) {
    return [];
  }
}

// 详情页 -> { tiers: [{label,url,h}], embed }；失败返回空档位 + 首个 embed
async function resolveTiers(durl) {
  var res = { tiers: [], embed: "" };
  try {
    var html = await fetchText(durl);
    if (!html) return res;
    var lm = html.match(/id="links" value="([^"]+)"/);
    if (!lm) return res;
    var linksVal = lm[1];
    var btnM = html.match(/class="btn btn-server[^"]*"/g);
    var nBtn = btnM ? btnM.length : 0;
    var nParts = linksVal.split(",,").length;
    var n = Math.max(nBtn, nParts, 1);
    for (var opt = 1; opt <= n; opt++) {
      var embed = "";
      try {
        var body = "links=" + encodeURIComponent(linksVal) + "&option=" + opt;
        var r = t(await postForm(BASE + "/get_link.php", body, durl));
        if (/^https?:\/\//i.test(r)) embed = r;
      } catch (e) {}
      if (!embed) continue;
      if (!res.embed) res.embed = embed;
      if (/earnvidjavgg\.xyz/i.test(embed)) {
        var tiers = await tiersFromVidHide(embed, durl);
        if (tiers.length) { res.tiers = tiers; break; }
      }
    }
  } catch (e) {}
  return res;
}

function durlOf(link) {
  var s = String(link || "").trim();
  if (/^https?:\/\//i.test(s)) return s;
  if (s.indexOf("//") === 0) return "https:" + s;
  if (s.charAt(0) === "/") return BASE + s;
  return BASE + "/" + s;
}

async function loadDetail(link) {
  try {
    var durl = durlOf(link);
    var html = await fetchText(durl);
    if (!html) {
      return { id: durl, type: "url", title: "加载失败", description: "详情页拉取失败", link: durl };
    }
    var titleM = html.match(/<title>([^<]*)<\/title>/);
    var name = titleM ? decodeEntities(titleM[1]).trim() : slugCode(durl);
    var picM = html.match(/<div class="information[\s\S]{0,2000}?<img[^>]*src="([^"]+)"/);
    var pic = picM ? picM[1] : "";
    var durM = html.match(/<span>(\d+)\s*Min\.<\/span>/);
    var dateM = html.match(/<b>([A-Z][a-z]{2}\. \d{1,2}, \d{4})<\/b>/);
    var remarks = (durM ? durM[1] + " Min." : "") + (dateM ? ((durM ? " " : "") + dateM[1]) : "");

    var res = await resolveTiers(durl);
    var sEps = [];
    var items = [];
    var firstUrl = "";
    var topPlayer = "system";
    if (res.tiers.length) {
      for (var i = 0; i < res.tiers.length; i++) {
        var lab = res.tiers[i].label;
        var u = res.tiers[i].url;
        if (!firstUrl) firstUrl = u;
        sEps.push({ title: lab, videoUrl: u, episodeNumber: i + 1 });
        items.push({ id: durl + "@" + lab, type: "url", title: name + " " + lab, name: lab, mediaType: "movie", seasonNumber: 1, episodeNumber: i + 1, videoUrl: u, link: durl, posterPath: pic, coverUrl: pic, playerType: "system" });
      }
    } else if (res.embed) {
      // 档位全死：给站内 embed 真地址（app 行，站内播放器嗅探）
      topPlayer = "app";
      firstUrl = res.embed;
      sEps.push({ title: "站内播放", videoUrl: res.embed, episodeNumber: 1 });
      items.push({ id: durl, type: "url", title: name + " 站内播放", name: "站内播放", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, videoUrl: res.embed, link: durl, posterPath: pic, coverUrl: pic, playerType: "app" });
    } else {
      // 连 embed 都拿不到：留无 videoUrl 行，点播时 loadResource 重解
      sEps.push({ title: "暂无片源", episodeNumber: 1 });
      items.push({ id: durl, type: "url", title: name + " 暂无片源", name: "暂无片源", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, link: durl, posterPath: pic, coverUrl: pic });
    }
    var ret = {
      id: durl,
      type: "detail",
      title: name,
      link: durl,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: remarks,
      playerType: topPlayer,
      customHeaders: playHeaders(),
      episodes: [{ name: "播放", id: durl, link: durl }],
      seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: sEps }],
      episodeItems: items
    };
    if (firstUrl) ret.videoUrl = firstUrl;
    return ret;
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// 播放源解析（stream 模块，回落用）：重解详情链，取不到档位时给 embed 行。
// 全程 try/catch，永不抛错。
async function loadResource(params) {
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  try {
    var durl = durlOf(raw);
    var res = await resolveTiers(durl);
    var out = [];
    for (var i = 0; i < res.tiers.length; i++) {
      out.push({ name: res.tiers[i].label, url: res.tiers[i].url, playerType: "system", customHeaders: playHeaders() });
    }
    if (out.length) return out;
    if (res.embed) return [{ name: "站内播放", url: res.embed, playerType: "app", customHeaders: playHeaders() }];
    return [];
  } catch (e) {
    return [];
  }
}
