// Perverzija for REX (lai_perverzija v1.0.0)
// 移植自 mira-cat 蜘蛛 py_perverzija.js（只读蓝图，未改动猫源），后端 https://tube.perverzija.com。
// 列表：站方 HTML video-item 卡片，与蜘蛛同一套正则；详情：iframe -> xtremestream 播放器页取 vt
// -> proto_api castsign 取 ct -> castmaster 生成多档 HLS（变体按 q 分档）+ 自适应兜底。
// 画质：只出站方 master 清单里实际有的档位，验活后按高到低出线，loadDetail 取最高档为主线。
// 注意：蜘蛛注释称 VM 侧 castsign 一律回 forbidden-vt（VM 出口被拦），设备侧签发能力待真机验。

WidgetMetadata = {
  id: "lai_perverzija",
  title: "Perverzija",
  description: "Perverzija（tube.perverzija.com）：最新/最多播放/精选/完整影片/VR/厂牌等 12 个分类，xtremestream 多档 HLS",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://tube.perverzija.com",
  detailCacheDuration: 180,
  modules: [
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "/?orderby=date" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "最多播放", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "/?orderby=view" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "最多点赞", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "/?orderby=like" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "精选场景", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "/featured-scenes/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "完整影片", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "/full-movie/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "VR", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "/vr/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Brazzers", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "/studio/brazzers/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "RealityKings", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "/studio/realitykings/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "BangBros", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "/studio/bangbros/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "TeamSkeet", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "/studio/teamskeet/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "NaughtyAmerica", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "/studio/naughtyamerica/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "标签热门", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "/tag/anal/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "搜索", functionName: "search", params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] }
  ]
};

var SITE = "https://tube.perverzija.com";
var XS = "https://perv.xtremestream.xyz";
var UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function t(v) { return String(v == null ? "" : v).trim(); }

function clean(s) {
  return t(s).replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"').replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&#8211;/g, "–").replace(/&#8212;/g, "—")
    .replace(/&#8216;|&#8217;/g, "'").replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/\s+/g, " ");
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": referer || SITE + "/"
  };
}

async function httpGet(url, referer, extra) {
  var headers = pageHeaders(referer);
  if (extra) {
    var keys = Object.keys(extra);
    for (var i = 0; i < keys.length; i++) headers[keys[i]] = extra[keys[i]];
  }
  try {
    var res = await Widget.http.get(url, { headers: headers });
    var data = res && res.data != null ? res.data : "";
    return typeof data === "string" ? data : JSON.stringify(data);
  } catch (e) {
    return "";
  }
}

function listingHtml(html) {
  var h = String(html || "");
  var start = h.search(/class="(?:video|search)-listing-content/);
  if (start < 0) start = 0;
  var end = h.length;
  var marks = ["wp-pagenavi", "class=\"pagination", "<nav class=\"navigation", "id=\"footer", "class=\"tm_related", "related-section"];
  for (var i = 0; i < marks.length; i++) {
    var j = h.indexOf(marks[i], start);
    if (j > 0 && j < end) end = j;
  }
  return h.slice(start, end);
}

function parseCards(html) {
  var h = listingHtml(html);
  var out = [];
  var seen = {};
  var starts = [];
  var re = /<div[^>]+class="[^"]*\bvideo-item\b[^"]*"[^>]*>/g;
  var m;
  while ((m = re.exec(h))) starts.push(m.index);
  for (var i = 0; i < starts.length; i++) {
    var seg = h.slice(starts[i], i + 1 < starts.length ? starts[i + 1] : Math.min(starts[i] + 6000, h.length));
    var a = seg.match(/<a\s+href="(https:\/\/tube\.perverzija\.com\/[^"\/]+\/)"(?:\s+title="([^"]*)")?/);
    if (!a) continue;
    var url = a[1];
    if (seen[url]) continue;
    var img = seg.match(/<img[^>]+src="([^"]+)"/);
    var h3 = seg.match(/<h3[^>]*>[\s\S]{0,200}?<a[^>]*>([\s\S]{1,300}?)<\/a>/);
    var alt = seg.match(/<img[^>]+alt="([^"]*)"/);
    var title = clean(a[2] || (h3 && h3[1]) || (alt && alt[1]) || "");
    if (!title) title = url.replace(/\/$/, "").split("/").pop().replace(/-/g, " ");
    var p = seg.match(/<p[^>]*>([\s\S]{20,600}?)<\/p>/);
    var desc = clean(p ? p[1] : "");
    if (!desc || desc.length < 20) desc = "";
    seen[url] = 1;
    out.push({ id: url, type: "url", title: title, posterPath: img ? img[1] : "", coverUrl: img ? img[1] : "", backdropPath: img ? img[1] : "", link: url, description: desc.slice(0, 60), mediaType: "movie" });
  }
  return out;
}

function pageUrl(path, page) {
  var p = Math.max(1, parseInt(page, 10) || 1);
  var base = String(path || "/");
  var query = "";
  var qi = base.indexOf("?");
  if (qi >= 0) { query = base.slice(qi); base = base.slice(0, qi); }
  if (base.charAt(0) !== "/") base = "/" + base;
  if (!/\/$/.test(base)) base += "/";
  if (p <= 1) return SITE + base + query;
  return SITE + base + "page/" + p + "/" + query;
}

async function loadList(params) {
  params = params || {};
  var cat = String(params.cat || params.path || "/?orderby=date");
  var page = parseInt(params.page, 10) || 1;
  try {
    var html = await httpGet(pageUrl(cat, page), SITE + "/");
    var cards = parseCards(html);
    if (!cards.length) return [{ id: "empty", type: "url", title: "没有找到相关内容" }];
    return cards;
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败", description: String((e && e.message) || e) }];
  }
}

function slugifyActor(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function pickKeyword(params) {
  if (params == null) return "";
  if (typeof params === "string") return String(params).trim();
  var keys = ["keyword", "q", "query", "wd", "key", "text"];
  for (var i = 0; i < keys.length; i++) {
    if (params[keys[i]]) return String(params[keys[i]]).trim();
  }
  return "";
}

async function search(params) {
  params = params || {};
  var kw = pickKeyword(params);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!kw) return [];
  try {
    var url = SITE + "/?s=" + encodeURIComponent(kw) + (page > 1 ? "&paged=" + page : "");
    var cards = parseCards(await httpGet(url, SITE + "/"));
    if (!cards.length && /\s/.test(kw) && !/\d/.test(kw)) {
      var slug = slugifyActor(kw);
      if (slug) cards = parseCards(await httpGet(SITE + "/stars/" + slug + "/" + (page > 1 ? "page/" + page + "/" : ""), SITE + "/"));
    }
    return cards;
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败", description: String((e && e.message) || e) }];
  }
}

function isoToSec(v) {
  var m = String(v || "").match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (!m) return 0;
  return (parseInt(m[1] || 0, 10) * 3600) + (parseInt(m[2] || 0, 10) * 60) + parseInt(m[3] || 0, 10);
}

async function parseDetailPage(url) {
  var html = await httpGet(url, SITE + "/");
  var titleM = html.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([\s\S]{1,400}?)<\/h1>/) || html.match(/<title>([\s\S]{1,300}?)<\/title>/);
  var title = clean(titleM ? titleM[1] : "").replace(/\s*\|\s*Perverzija\.com\s*$/i, "");
  var coverM = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/) || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/);
  var descM = html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]*)"/) || html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/);
  var durM = html.match(/"duration"\s*:\s*"(PT[^"]+)"/);
  var iframeM = html.match(/<iframe[^>]+src="([^"]*xtremestream[^"]*)"/) || html.match(/<iframe[^>]+src="([^"]*\/player\/index\.php\?data=([0-9a-f]{32}))[^"]*"/);
  var videoId = "";
  var embed = "";
  if (iframeM) {
    var src = String(iframeM[1]);
    var idM = src.match(/[?&]data=([0-9a-fA-F]{32})/);
    if (idM) videoId = idM[1].toLowerCase();
    var hostM = src.match(/^(https?:\/\/[^\/]+)/);
    if (hostM) embed = hostM[1];
  }
  if (!videoId) {
    var anyId = html.match(/(?:embedUrl|iframe)[^\n]{0,200}?[?&]data=([0-9a-fA-F]{32})/);
    if (anyId) videoId = anyId[1].toLowerCase();
  }
  return { videoId: videoId, embed: embed, title: title, cover: coverM ? coverM[1] : "", desc: clean(descM ? descM[1] : ""), seconds: durM ? isoToSec(durM[1]) : 0 };
}

async function playlistAlive(url, referer) {
  try {
    var raw = await httpGet(url, referer);
    return raw.indexOf("#EXTM3U") >= 0;
  } catch (e) { return false; }
}

async function resolveStream(detailUrl, d) {
  if (!d.videoId) throw new Error("未找到播放器 id，可能影片无源");
  var bases = [];
  function pushBase(b) { if (b && bases.indexOf(b) < 0) bases.push(b); }
  pushBase(d.embed);
  pushBase(XS);
  pushBase("https://pervm1.xtremestream.xyz");
  pushBase("https://pervl5.xtremestream.xyz");
  pushBase("https://pervm2.xtremestream.xyz");
  var base = "";
  var vt = "";
  var playerUrl = "";
  var lastErr = "";
  for (var bi = 0; bi < bases.length; bi++) {
    var b = bases[bi];
    var tryUrl = b + "/player/index.php?data=" + d.videoId;
    var page = "";
    try { page = await httpGet(tryUrl, detailUrl); } catch (e) { lastErr = String((e && e.message) || e); continue; }
    var vtM = page.match(/boot\(\s*["']?[0-9a-fA-F]{32}["']?\s*,\s*["']([^"']+)["']/);
    if (vtM) { base = b; vt = String(vtM[1]).replace(/\s+/g, ""); playerUrl = tryUrl; break; }
    lastErr = "该子域无 ftk 令牌";
  }
  if (!vt) throw new Error("播放器页未返回 vt 令牌" + (lastErr ? "：" + lastErr : ""));
  var apiBase = base + "/player/proto_api.php?data=" + d.videoId;
  var vtParam = "&vt=" + encodeURIComponent(vt);
  var signResp = await httpGet(apiBase + "&op=castsign" + vtParam, playerUrl, { "X-XS-P": "1", "Accept": "*/*" });
  var ct = String(signResp || "").replace(/\s+/g, "");
  if (!ct || ct.indexOf("forbidden") === 0) throw new Error("castsign 签名失败");
  var cm = apiBase + vtParam + "&ct=" + encodeURIComponent(ct) + "&op=castmaster";
  var autoLine = { name: "自动", url: cm };
  var master = "";
  try { master = await httpGet(cm, playerUrl, { "X-XS-P": "1", "Accept": "*/*" }); } catch (e) {}
  var quals = [];
  var re = /#EXT-X-STREAM-INF:[^\n]*RESOLUTION=(\d+)x(\d+)[^\n]*\n(\S+)/g;
  var mm;
  while ((mm = re.exec(master))) {
    var lineUrl = String(mm[3]).trim();
    var qm = lineUrl.match(/[?&]q=(\d+)/);
    if (!qm) continue;
    quals.push({ q: qm[1], label: qm[1] + "p", url: lineUrl });
  }
  if (!quals.length) {
    var fl;
    var fallbacks = ["1080", "720", "480"];
    for (var fi = 0; fi < fallbacks.length; fi++) {
      fl = fallbacks[fi];
      quals.push({ q: fl, label: fl + "p", url: apiBase + vtParam + "&ct=" + encodeURIComponent(ct) + "&op=castmedia&q=" + fl });
    }
  }
  quals.sort(function (a, b) { return parseInt(b.q, 10) - parseInt(a.q, 10); });
  var lines = [];
  for (var qi = 0; qi < quals.length; qi++) {
    if (await playlistAlive(quals[qi].url, playerUrl)) lines.push({ name: quals[qi].label, url: quals[qi].url });
  }
  lines.push(autoLine);
  return { lines: lines, playerUrl: playerUrl };
}

function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

async function loadDetail(link) {
  var raw = unwrapLink(link);
  var url = raw.replace(/^perv:/, "");
  if (!url) return { id: "err", type: "url", title: "解析失败", description: "未找到播放地址" };
  if (!/^https?:\/\//i.test(url)) url = SITE + "/" + url.replace(/^\/+/, "");
  try {
    var d = await parseDetailPage(url);
    var name = d.title || url;
    var lines = [];
    var playerUrl = url;
    try {
      var rs = await resolveStream(url, d);
      lines = rs.lines;
      playerUrl = rs.playerUrl || url;
    } catch (e) {
      return { id: url, type: "url", title: name, posterPath: d.cover, coverUrl: d.cover, backdropPath: d.cover, description: "未找到播放地址：" + String((e && e.message) || e).slice(0, 60) };
    }
    if (!lines.length) return { id: url, type: "url", title: name, posterPath: d.cover, coverUrl: d.cover, backdropPath: d.cover, description: "未找到播放地址" };
    var best = lines[0];
    return {
      id: url,
      type: "detail",
      title: name,
      link: url,
      posterPath: d.cover,
      coverUrl: d.cover,
      backdropPath: d.cover,
      description: d.desc,
      videoUrl: best.url,
      playerType: "app",
      customHeaders: { "User-Agent": UA, "Referer": playerUrl }
    };
  } catch (e) {
    return { id: url, type: "url", title: "请求错误", description: "未找到播放地址：" + String((e && e.message) || e).slice(0, 60) };
  }
}
