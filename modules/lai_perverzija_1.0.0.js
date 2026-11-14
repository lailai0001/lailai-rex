// Perverzija for REX (lai_perverzija v1.0.0)
// 移植自 mira-cat 蜘蛛 py_perverzija.js（只读蓝图），站方 tube.perverzija.com，
// 流托管在 xtremestream 播放器（perv.xtremestream.xyz 等）。
// 12 个顶级分类（无子分类）：最新 / 最多播放 / 最多点赞 / 精选场景 / 完整影片 / VR /
// Brazzers / RealityKings / BangBros / TeamSkeet / NaughtyAmerica / 标签热门。
// 列表：<div class="video-item"> 卡片，翻页 /page/N/。
// 详情：取 iframe 播放器的 data=<32hex 视频 id> 与 embed 域名。
// 播放链（原 REX 作者 Tiamo 的真机链，见蜘蛛注释）：
//   播放器页 <host>/player/index.php?data=<id> -> boot(<id>, "<vt>") 取 token
//   -> proto_api.php?data=<id>&op=castsign&vt=<vt>（头 X-XS-P: 1）-> ct 即 master m3u8
//   -> 解析 #EXT-X-STREAM-INF 的 RESOLUTION，得 ?q=<n> 各档（<q>p）+ auto 线。
// 注意：虚拟机侧 castsign 一律回 forbidden-vt（出口被拦），
//   播放链在虚拟机无法验通；详情/列表/播放器页虚拟机可取。
//   因此详情只存档位名，loadResource 点播现解；详情时解不出也留"自动"懒入口，
//   真机 loadResource 再解一次。

WidgetMetadata = {
  id: "lai_perverzija",
  title: "Perverzija",
  description: "Perverzija：欧美大厂合集站，12 分类，Brazzers / RealityKings / BangBros / TeamSkeet 等，多档清晰度点播现解",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://tube.perverzija.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "最多播放", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "most-viewed" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "最多点赞", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "most-liked" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "精选场景", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "featured" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "完整影片", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "full-movie" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "VR", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "vr" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "Brazzers", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "brazzers" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "RealityKings", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "realitykings" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "BangBros", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "bangbros" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "TeamSkeet", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "teamskeet" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "NaughtyAmerica", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "naughtyamerica" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "标签热门", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "tag-anal" }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var SITE = "https://tube.perverzija.com";
var XS = "https://perv.xtremestream.xyz";
var UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  var r = t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  r = r.replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); });
  r = r.replace(/&#x([0-9a-fA-F]+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 16)); });
  return r;
}

function absUrl(u, base) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  base = base || SITE;
  var m = base.match(/^(https?:\/\/[^\/]+)/i);
  var origin = m ? m[1] : SITE;
  if (u.charAt(0) === "/") return origin + u;
  return origin + "/" + u;
}

function pageUrl(path, query, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  var p = path || "";
  var q = query || "";
  var base;
  if (page <= 1) base = SITE + p + q;
  else base = SITE + p + "page/" + page + "/" + q;
  return base;
}

var ZONES = {
  "latest": { path: "/", query: "?orderby=date" },
  "most-viewed": { path: "/", query: "?orderby=view" },
  "most-liked": { path: "/", query: "?orderby=like" },
  "featured": { path: "/featured-scenes/", query: "" },
  "full-movie": { path: "/full-movie/", query: "" },
  "vr": { path: "/vr/", query: "" },
  "brazzers": { path: "/studio/brazzers/", query: "" },
  "realitykings": { path: "/studio/realitykings/", query: "" },
  "bangbros": { path: "/studio/bangbros/", query: "" },
  "teamskeet": { path: "/studio/teamskeet/", query: "" },
  "naughtyamerica": { path: "/studio/naughtyamerica/", query: "" },
  "tag-anal": { path: "/tag/anal/", query: "" }
};

async function getHtml(url, referer, extraHeaders) {
  try {
    var headers = {
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": referer || SITE + "/"
    };
    if (extraHeaders) {
      for (var k in extraHeaders) headers[k] = extraHeaders[k];
    }
    var res = await Widget.http.get(url, { headers: headers });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body;
  } catch (e) { return ""; }
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function parseList(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var scope = html;
  var lm = html.match(/class="(?:video|search)-listing-content"[\s\S]*?(?=<div class="pagination"|id="footer"|class="related-videos")/i);
  if (lm) scope = lm[0];
  var chunks = scope.split(/<div[^>]+class="video-item"/i);
  for (var i = 1; i < chunks.length; i++) {
    var c = chunks[i];
    var am = c.match(/<a[^>]+href="(https?:\/\/tube\.perverzija\.com\/[^"]+\/)"[^>]*>/i)
      || c.match(/<a[^>]+href="(\/[^"]+\/)"[^>]*>/i);
    if (!am) continue;
    var url = absUrl(am[1]);
    if (seen[url]) continue;
    seen[url] = 1;
    var im = c.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
    var pic = im ? absUrl(im[1]) : "";
    var tm = c.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)
      || c.match(/title="([^"]+)"/i)
      || c.match(/alt="([^"]+)"/i);
    var title = tm ? decodeHtml(tm[1].replace(/<[^>]+>/g, "")) : "";
    var desc = "";
    var dm = c.match(/<p[^>]*>([^<]{2,200})<\/p>/i);
    if (dm) desc = decodeHtml(dm[1]);
    var dur = "";
    var um = c.match(/(\d+:\d{2}(?::\d{2})?)/);
    if (um) dur = um[1];
    out.push({
      id: url,
      type: "url",
      title: title || url,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: url,
      description: desc,
      mediaType: "movie",
      duration: dur
    });
  }
  return out;
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "latest");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var z = ZONES[zone] || ZONES["latest"];
  try {
    var html = await getHtml(pageUrl(z.path, z.query, page));
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
    var url = SITE + "/?s=" + encodeURIComponent(wd) + (page > 1 ? "&paged=" + page : "");
    var html = await getHtml(url);
    var list = parseList(html);
    if (!list.length && /\s/.test(wd) && !/\d/.test(wd)) {
      var slug = wd.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      var html2 = await getHtml(SITE + "/stars/" + slug + "/");
      list = parseList(html2);
    }
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

// 从详情页取 iframe 播放器：data=<32hex> 与 embed 域名
function extractEmbed(html) {
  if (!html) return null;
  var patterns = [
    /<iframe[^>]+src=["']([^"']*player\/index\.php\?data=([0-9a-f]{32})[^"']*)["']/i,
    /src=["']([^"']*\/player\/index\.php\?data=([0-9a-f]{32})[^"']*)["']/i,
    /data-embed=["']([^"']+)["'][^>]*data-video-id=["']([0-9a-f]{32})["']/i
  ];
  for (var i = 0; i < patterns.length; i++) {
    var m = html.match(patterns[i]);
    if (m) {
      var src = absUrl(m[1]);
      var id = m[2];
      var hm = src.match(/^(https?:\/\/[^\/]+)/i);
      return { src: src, id: id, host: hm ? hm[1] : XS };
    }
  }
  var fm = html.match(/player\/index\.php\?data=([0-9a-f]{32})/i);
  if (fm) return { src: "", id: fm[1], host: XS };
  return null;
}

function parseMaster(masterTxt) {
  var out = [];
  if (!masterTxt || masterTxt.indexOf("#EXTM3U") < 0) return out;
  var lines = masterTxt.split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    var line = t(lines[i]);
    if (line.indexOf("#EXT-X-STREAM-INF") !== 0) continue;
    var resM = line.match(/RESOLUTION=(\d+)x(\d+)/i);
    var urlLine = t(lines[i + 1] || "");
    if (!resM || !urlLine || urlLine.charAt(0) === "#") continue;
    var h = parseInt(resM[2], 10);
    var qm = urlLine.match(/[?&]q=(\d+)/);
    var q = qm ? parseInt(qm[1], 10) : h;
    out.push({ q: q, h: h, label: h + "p", url: urlLine });
  }
  out.sort(function (a, b) { return b.q - a.q; });
  return out;
}

function masterAlive(txt) {
  return !!txt && txt.indexOf("#EXTM3U") >= 0;
}

var PLAYER_BASES = ["", XS, "https://pervm1.xtremestream.xyz", "https://pervl5.xtremestream.xyz", "https://pervm2.xtremestream.xyz"];

// 播放链：播放器页 -> boot token -> castsign -> castmaster -> 解析各档。
// 返回 { lines: [{label, url}], auto: <castmaster url>, base: <用上的 host> }
// 失败返回 null（虚拟机侧 castsign 一律 forbidden-vt，真机再解）。
async function resolveStream(dataId, firstHost) {
  var bases = [];
  if (firstHost) bases.push(firstHost);
  for (var i = 0; i < PLAYER_BASES.length; i++) {
    var b = PLAYER_BASES[i] || firstHost;
    if (b && bases.indexOf(b) < 0) bases.push(b);
  }
  for (var bi = 0; bi < bases.length; bi++) {
    var host = bases[bi];
    if (!host) continue;
    try {
      var playerUrl = host + "/player/index.php?data=" + dataId;
      var html = await getHtml(playerUrl, SITE + "/");
      var bm = html.match(/boot\s*\(\s*['"][0-9a-f]{32}['"]\s*,\s*['"]([^'"]+)['"]\s*\)/);
      if (!bm) continue;
      var vt = bm[1];
      var api = host + "/proto_api.php?data=" + dataId + "&op=castsign&vt=" + encodeURIComponent(vt);
      var txt = await getHtml(api, playerUrl, { "X-XS-P": "1" });
      if (!txt) continue;
      var cast = null;
      try { cast = JSON.parse(txt); } catch (e) { continue; }
      var master = cast && (cast.ct || cast.url);
      if (!master) continue;
      master = absUrl(master, api);
      var mtxt = await getHtml(master, playerUrl);
      if (!masterAlive(mtxt)) continue;
      var lines = parseMaster(mtxt).map(function (v) {
        return { label: v.label, url: absUrl(v.url, master) };
      });
      var autoUrl = master;
      // 无档可分时补 castmedia 1080/720/480 三档（逐条验活）
      if (!lines.length) {
        var cand = [1080, 720, 480];
        for (var ci = 0; ci < cand.length; ci++) {
          var q = cand[ci];
          var cmUrl = host + "/proto_api.php?data=" + dataId + "&op=castmedia&q=" + q + "&vt=" + encodeURIComponent(vt);
          var cmTxt = await getHtml(cmUrl, playerUrl, { "X-XS-P": "1" });
          if (masterAlive(cmTxt)) lines.push({ label: q + "p", url: cmUrl });
        }
      }
      if (!lines.length) {
        // 只有 auto 线也算通（master 本身可播，播放器自选档）
        return { lines: [], auto: autoUrl, base: host };
      }
      return { lines: lines, auto: autoUrl, base: host };
    } catch (e) { continue; }
  }
  return null;
}

function extractTitle(html, fallback) {
  var m = html.match(/<h1[^>]*class="entry-title"[^>]*>([\s\S]*?)<\/h1>/i)
    || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (m) return decodeHtml(m[1].replace(/<[^>]+>/g, "")).replace(/\s*\|\s*Perverzija\.com.*$/i, "");
  m = html.match(/property=["']og:title["'][^>]*content=["']([^"']+)/i);
  if (m) return decodeHtml(m[1]);
  return fallback || "";
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var pageUrl = absUrl(raw);
    var html = await getHtml(pageUrl, SITE + "/");
    if (!html) return { id: pageUrl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = extractTitle(html, pageUrl);
    var pic = "";
    var pm = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i);
    if (pm) pic = absUrl(pm[1]);
    var content = "";
    var dm = html.match(/property=["']og:description["'][^>]*content=["']([^"']+)/i);
    if (dm) content = decodeHtml(dm[1]);
    var dur = "";
    var dum = html.match(/"duration"\s*:\s*"PT([^"]+)"/i);
    if (dum) dur = dum[1];
    var embed = extractEmbed(html);
    var epsList = [];
    var epItems = [];
    var seasonEps = [];
    function addEp(label, lazyUrl, num) {
      epsList.push({ name: label, link: lazyUrl });
      seasonEps.push({ title: label, episodeNumber: num || 0 });
      epItems.push({
        id: lazyUrl,
        type: "url",
        title: label,
        mediaType: "movie",
        posterPath: pic,
        link: lazyUrl,
        episode: num || 0,
        episodeNumber: num || 0,
        seasonIndex: 1,
        seasonNumber: 1
      });
    }
    if (embed && embed.id) {
      // 详情时先解一次，拿真实档位名；解不出（虚拟机 forbidden-vt）也留"自动"懒入口
      var rs = await resolveStream(embed.id, embed.host);
      if (rs && rs.lines.length) {
        for (var i = 0; i < rs.lines.length; i++) {
          addEp(rs.lines[i].label, pageUrl + "@@PV:" + rs.lines[i].label, rs.lines[i].q);
        }
        addEp("自动", pageUrl + "@@PV:auto", 0);
      } else if (rs && rs.auto) {
        addEp("自动", pageUrl + "@@PV:auto", 0);
      } else {
        addEp("自动", pageUrl + "@@PV:auto", 0);
      }
    }
    var result = {
      id: pageUrl,
      type: "detail",
      title: name || pageUrl,
      name: name || pageUrl,
      description: content,
      mediaType: "movie",
      link: pageUrl,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      duration: dur,
      playerType: "app"
    };
    if (epsList.length) {
      result.episodes = epsList;
      result.seasons = [{ seasonNumber: 1, title: "清晰度", name: "清晰度", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
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
  var at = raw.indexOf("@@PV:");
  if (at >= 0) {
    var pageUrl = raw.slice(0, at);
    var want = raw.slice(at + 5);
    var html = await getHtml(absUrl(pageUrl), SITE + "/");
    var embed = extractEmbed(html);
    if (!embed || !embed.id) return [];
    var rs = await resolveStream(embed.id, embed.host);
    if (!rs) return [];
    if (want === "auto") {
      if (rs.auto) return [{ name: "自动", url: rs.auto, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": rs.base + "/player/" } }];
      return [];
    }
    for (var i = 0; i < rs.lines.length; i++) {
      if (rs.lines[i].label === want) {
        return [{ name: want, url: rs.lines[i].url, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": rs.base + "/player/" } }];
      }
    }
    if (rs.auto) return [{ name: want, url: rs.auto, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": rs.base + "/player/" } }];
    return [];
  }
  // 直链 m3u8
  if (/\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": SITE + "/" } }];
  }
  // 兜底：详情页地址 -> 取详情首集
  try {
    var det = await loadDetail(raw);
    var eps2 = det && det.episodeItems;
    if (eps2 && eps2.length) {
      return await loadResource({ link: eps2[0].id });
    }
  } catch (e) { /* fall through */ }
  return [];
}
