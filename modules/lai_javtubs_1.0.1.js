// JavTubs for REX (lai_javtubs v1.0.1)
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
// v1.0.1（2026-11-16，用户报 MUKD-586 能解析出地址但播不了）：根因两条——
//   ① loadDetail 没有 unwrapLink，运行时传对象入参时拼出 "[object Object]"
//   地址、详情回“暂无片源”；② tiersFromVidHide 要求模块自己取回 master 才
//   出档位，而 VidHide token 绑取嵌页那次请求的 IP，模块侧取 master 常 403，
//   于是把已拿到手的 master 地址丢掉、回落到嵌页地址当“可播”集——嵌页是
//   HTML 播放器页不是视频流，播放器播不了。修法：解包拿 master 后取播单重
//   试 2 次、能解析就一档一集写变体地址；取不到播单也不丢 master，直接把
//   master 本身当“自适应”集交给播放器直取（猫源同款回落）；连 master 都
//   拿不到才给站内嗅探集（videoUrl 为详情页、playerType "app"）；loadResource
//   点播时新鲜重解，永不回 []、永不回无 videoUrl 的懒解析记号。

WidgetMetadata = {
  id: "lai_javtubs",
  title: "JavTubs",
  description: "JavTubs（javtubs.com）：JAV 在线看，最新/精选/Reducing Mosaic/有码/无码/中文字幕等 10 个分类 + 12 个类型快捷入口，详情直交多档 m3u8（480p/720p/1080p 实测档位）",
  author: "lai",
  version: "1.0.1",
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

// master 地址提取（容忍写法）：hls2（冒号前后可有空白）→ jwplayer file
// （含 master.m3u8）。解包文本里 hls2 可能是相对地址 "/stream/.../master.m3u8"；
// 反斜杠转义（\/、\u0026）要还原；相对地址按嵌页 origin 补全。
function masterFromUnpacked(up, embed) {
  var u = "";
  var m = up.match(/"hls2"\s*:\s*"([^"]+)"/);
  if (m) u = m[1];
  if (!u) {
    m = up.match(/"file"\s*:\s*"([^"]*master\.m3u8[^"]*)"/);
    if (m) u = m[1];
  }
  if (!u) return "";
  u = u.replace(/\\\//g, "/").replace(/\\u0026/g, "&").replace(/\\"/g, '"');
  if (/^https?:\/\//i.test(u)) return u;
  if (u.charAt(0) === "/") {
    var om = String(embed || "").match(/^(https?:\/\/[^\/]+)/);
    return om ? om[1] + u : "";
  }
  return u;
}

// 变体地址补全：绝对地址原样；/ 开头按 master origin；其余按 master 所在目录。
function resolveVariantUrl(masterUrl, uri) {
  if (/^https?:\/\//i.test(uri)) return uri;
  var om = String(masterUrl || "").match(/^(https?:\/\/[^\/]+)/);
  if (uri.charAt(0) === "/") return om ? om[1] + uri : uri;
  var dir = String(masterUrl || "").replace(/[^\/]*$/, "");
  return dir + uri;
}

// 变体解析（猫源 variantForTier 同款行扫描）：只认 #EXT-X-STREAM-INF 行后
// 第一个非 # 行；按高度从高到低；同档去重。
function parseVariants(mt, masterUrl) {
  var lines = String(mt || "").split("\n");
  var vars = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.indexOf("#EXT-X-STREAM-INF") !== 0) continue;
    var rm = line.match(/RESOLUTION=(\d+)x(\d+)/);
    var h = rm ? parseInt(rm[2], 10) || 0 : 0;
    var uri = "";
    for (var j = i + 1; j < lines.length; j++) {
      var u2 = lines[j].trim();
      if (!u2) continue;
      if (u2.charAt(0) === "#") continue;
      uri = u2;
      break;
    }
    if (!uri) continue;
    vars.push({ label: labelOf(h), url: resolveVariantUrl(masterUrl, uri), h: h });
  }
  vars.sort(function (a, b) { return b.h - a.h; });
  var seen = {};
  var dedup = [];
  for (var k = 0; k < vars.length; k++) {
    if (seen[vars[k].label]) continue;
    seen[vars[k].label] = true;
    dedup.push(vars[k]);
  }
  return dedup;
}

// 单个 VidHide embed -> {tiers, master}：解包拿 master 地址；master 取数
// 重试 2 次；取不到播单也不丢 master 地址（调用方把 master 本身交给播放器）。
async function resolveFromEmbed(embed, referer) {
  var out = { tiers: [], master: "" };
  try {
    var html = await fetchText(embed, referer);
    if (!html) return out;
    var up = unpackPacked(html);
    if (!up) return out;
    var master = masterFromUnpacked(up, embed);
    if (!master) return out;
    out.master = master;
    var mt = "";
    for (var a = 0; a < 2; a++) {
      mt = await fetchText200(master, embed);
      if (mt && mt.indexOf("#EXTM3U") >= 0) break;
      mt = "";
    }
    if (mt) out.tiers = parseVariants(mt, master);
  } catch (e) {}
  return out;
}

// 详情页 -> {tiers, master, embed}；失败返回空档位 + 首个 embed。
// 注意：拿到 master 即停（即使 tiers 为空——master 本身可交给播放器直取）。
async function resolveTiers(durl) {
  var res = { tiers: [], master: "", embed: "" };
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
        var r2 = await resolveFromEmbed(embed, durl);
        if (r2.master) { res.tiers = r2.tiers; res.master = r2.master; break; }
      }
    }
  } catch (e) {}
  return res;
}

// 运行时把卡片对象直接传给 loadDetail/loadResource；String(对象) 得
// "[object Object]"，入口必须先解包（1.0.0 缺这一步，对象入参必坏）。
function unwrapLink(arg) {
  if (arg == null) return "";
  if (typeof arg === "string") return arg;
  if (typeof arg === "object") {
    return arg.link || arg.url || arg.id || "";
  }
  return String(arg);
}

function durlOf(link) {
  var s = t(unwrapLink(link));
  if (/^https?:\/\//i.test(s)) return s;
  if (s.indexOf("//") === 0) return "https:" + s;
  if (s.charAt(0) === "/") return BASE + s;
  return BASE + "/" + s;
}

async function loadDetail(link) {
  try {
    var durl = durlOf(link);
    var at0 = durl.indexOf("@@");
    if (at0 > 0) durl = durl.slice(0, at0);
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
        items.push({ id: durl + "@@" + lab, type: "url", title: name + " " + lab, name: lab, mediaType: "movie", seasonNumber: 1, episodeNumber: i + 1, videoUrl: u, link: durl, posterPath: pic, coverUrl: pic, playerType: "system" });
      }
    } else if (res.master) {
      // master 已拿到但播单取不到（VidHide token 绑取嵌页那次请求的 IP，
      // 模块侧取 master 常 403）：把 master 本身交给播放器直取，不要丢掉它。
      topPlayer = "system";
      firstUrl = res.master;
      sEps.push({ title: "自适应", videoUrl: res.master, episodeNumber: 1 });
      items.push({ id: durl + "@@auto", type: "url", title: name + " 自适应", name: "自适应", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, videoUrl: res.master, link: durl, posterPath: pic, coverUrl: pic, playerType: "system" });
    } else {
      // 连 master 都拿不到：站内嗅探回落（videoUrl 为详情页，app 行）。
      // 绝不把嵌页地址当可播集交出去（嵌页是 HTML 播放器页，不是视频流）。
      topPlayer = "app";
      firstUrl = durl;
      sEps.push({ title: "站内播放", videoUrl: durl, episodeNumber: 1 });
      items.push({ id: durl, type: "url", title: name + " 站内播放", name: "站内播放", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, videoUrl: durl, link: durl, posterPath: pic, coverUrl: pic, playerType: "app" });
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
    return { id: String(unwrapLink(link) || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// 播放源解析（stream 模块，回落用）：点播时新鲜重解，取不到档位时给
// master 自适应行或站内嗅探行；全程 try/catch，永不抛错、永不回 []。
async function loadResource(params) {
  params = params || {};
  var durl = "";
  try {
    var raw = "";
    if (params && typeof params.id === "string" && params.id.indexOf("@@") >= 0) {
      raw = params.id;
    } else {
      raw = unwrapLink(params);
    }
    var want = "";
    durl = durlOf(raw);
    var at = durl.indexOf("@@");
    if (at > 0) { want = durl.slice(at + 2); durl = durl.slice(0, at); }
    var res = await resolveTiers(durl);
    var out = [];
    if (res.tiers.length) {
      for (var i = 0; i < res.tiers.length; i++) {
        if (want && want !== "auto" && res.tiers[i].label !== want) continue;
        out.push({ name: res.tiers[i].label, url: res.tiers[i].url, playerType: "system", customHeaders: playHeaders() });
      }
      if (out.length) return out;
      out.push({ name: res.tiers[0].label, url: res.tiers[0].url, playerType: "system", customHeaders: playHeaders() });
      return out;
    }
    if (res.master) return [{ name: "自适应", url: res.master, playerType: "system", customHeaders: playHeaders() }];
    return [{ name: "站内播放", url: durl, playerType: "app", customHeaders: playHeaders() }];
  } catch (e) {
    if (durl) return [{ name: "站内播放", url: durl, playerType: "app", customHeaders: playHeaders() }];
    return [];
  }
}
