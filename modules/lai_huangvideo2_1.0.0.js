// 黄视频 for REX (lai_huangvideo2 v1.0.0)
// 由旧模块 lai_huangvideo 1.0.0 全新重写（同站 https://huang.video/，行为一致，代码重组）。
// 播放必须走 huangvideo-hls Worker（已部署）：变体播单地址经 /p/<b64url(目标)>/<b64url(ctx)> 中转，
// Worker 内注入 Referer 并改写分片地址；直链 master 在 App 内会因播放器不转发 Referer 而死。
// master 在详情页 data-xg-player-source-value（h.matecdn.com），变体通常单档 720p。
// 短剧分集页 /series/<id> 的每集是 /videos/<id>。
// 与旧版的关键区别：详情直接交 Worker 地址（旧版是按需解析记号，手机上现解一死就播不了）。
// 单视频按变体出集；短剧每集在详情时并行现解、取最高档；个别集解不出时留空位，
// 点播时 loadResource 再解一次。loadResource 只作回落，全程 try/catch，绝不抛错。

var SITE = "https://huang.video";
var RELAY = "https://huangvideo-hls.li768435813.workers.dev";
var RELAY_SECRET = "lai-hls-1";
var BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
var TOKEN = "@@HV2:";

WidgetMetadata = {
  id: "lai_huangvideo2",
  title: "黄视频",
  description: "黄视频：视频库/短剧库 + 48 创作者筛选，详情现解变体，走 huangvideo-hls Worker 中转播放",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://huang.video",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "首页", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "视频库", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "videos" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "短剧库", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "shorts" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "糖心", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "creator" }, { name: "sub", title: "创作者", type: "enumeration", value: "c:fortunecutie", enumOptions: [{"name": "糖心·饼干姐姐", "value": "c:fortunecutie"}, {"name": "糖心·小欣奈", "value": "c:xiaoxinnai"}, {"name": "糖心·情深叉喔", "value": "c:91qsxw"}, {"name": "糖心·白虎喵", "value": "c:baihumiao"}, {"name": "糖心·台北娜娜", "value": "c:nana-taipei"}, {"name": "糖心·梓怡学妹", "value": "c:zyxm711"}, {"name": "糖心·兔美酱", "value": "c:tumeijiang"}, {"name": "糖心·萌崽儿", "value": "c:mengzaier"}, {"name": "糖心·鸡教练", "value": "c:jijiaolian"}, {"name": "糖心·桥本香菜", "value": "c:qiobnxingcai"}, {"name": "糖心·菠萝啤beer", "value": "c:beer-pineapple"}, {"name": "糖心·蜡笔甜心", "value": "c:labotianxin"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "福利姬", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "creator" }, { name: "sub", title: "创作者", type: "enumeration", value: "c:tututugirls", enumOptions: [{"name": "福利姬·Nina妈妈", "value": "c:tututugirls"}, {"name": "福利姬·老虎菜", "value": "c:laohucai"}, {"name": "福利姬·火爆李老师", "value": "c:unababyainio"}, {"name": "福利姬·小Annie", "value": "c:yooheejade"}, {"name": "福利姬·小小t", "value": "c:tthenmei"}, {"name": "福利姬·深圳第一深情", "value": "c:looks199"}, {"name": "福利姬·咕姆gomu", "value": "c:gomu"}, {"name": "福利姬·跳跳羊", "value": "c:tiaotiaosheep"}, {"name": "福利姬·一只顶美", "value": "c:yizhidingmei"}, {"name": "福利姬·趣趣", "value": "c:ququ999999"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "探花", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "creator" }, { name: "sub", title: "创作者", type: "enumeration", value: "c:anmoxiaozi", enumOptions: [{"name": "探花·按摩小子", "value": "c:anmoxiaozi"}, {"name": "探花·dududown2ride", "value": "c:dududown2ride"}, {"name": "探花·唐伯虎", "value": "c:tangbohu"}, {"name": "探花·派大星(伊藤诚)", "value": "c:pdx739"}, {"name": "探花·李寻欢探花", "value": "c:lixunhuan"}, {"name": "探花·在下王老师", "value": "c:zaixaiwanglaoshi"}, {"name": "探花·深海杀人鲸-小张历险记", "value": "c:ubersex24h"}, {"name": "探花·好大的爆米花", "value": "c:haodadebaomihua"}, {"name": "探花·杭州黑人博主kanocoxx", "value": "c:kanocoxx"}, {"name": "探花·泰浪探花", "value": "c:tailang"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "PMV", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "creator" }, { name: "sub", title: "创作者", type: "enumeration", value: "c:tianshuihongliu", enumOptions: [{"name": "PMV·天水洪流PMV", "value": "c:tianshuihongliu"}, {"name": "PMV·MarojiPMV", "value": "c:maroji"}, {"name": "PMV·海绵婊婊PMV", "value": "c:fraudworkpmv"}, {"name": "PMV·K佬PMV", "value": "c:klao"}, {"name": "PMV·PmvTik", "value": "c:pmvtik"}, {"name": "PMV·章鱼哥PMV", "value": "c:zhangyuge-pmv"}, {"name": "PMV·大卵酱PMV", "value": "c:daluanjiang"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "ASMR", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "creator" }, { name: "sub", title: "创作者", type: "enumeration", value: "c:xizhou", enumOptions: [{"name": "ASMR·你的好朋友西洲", "value": "c:xizhou"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "creator" }, { name: "sub", title: "创作者", type: "enumeration", value: "c:huangdou", enumOptions: [{"name": "短剧·黄豆魔改短剧", "value": "c:huangdou"}, {"name": "短剧·91成人短剧", "value": "c:crdj91"}, {"name": "短剧·野果短剧", "value": "c:yeguoduanju"}, {"name": "短剧·橙果短剧", "value": "c:chengguo"}, {"name": "短剧·黄果短剧", "value": "c:huang-guo"}, {"name": "短剧·黄果AI短剧", "value": "c:huangguo"}, {"name": "短剧·短剧放映室", "value": "c:short-videos"}, {"name": "短剧·2048AI短剧", "value": "c:ai2048"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

// ---------- 文本工具 ----------
function clean(v) {
  return String(v == null ? "" : v).trim();
}

function unescapeEntities(s) {
  return clean(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/&#x([0-9a-fA-F]+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 16)); });
}

function stripTags(s) {
  return unescapeEntities(String(s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " "));
}

function toAbs(u) {
  u = clean(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return SITE + u;
  return SITE + "/" + u;
}

// ---------- 纯 JS base64url（沙箱无 Buffer） ----------
var B64_TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64Std(str) {
  var out = "";
  var i = 0;
  while (i < str.length) {
    var c1 = str.charCodeAt(i++) & 0xff;
    var c2 = i < str.length ? str.charCodeAt(i++) & 0xff : NaN;
    var c3 = i < str.length ? str.charCodeAt(i++) & 0xff : NaN;
    var b1 = c1 >> 2;
    var b2 = ((c1 & 3) << 4) | (c2 >> 4);
    var b3 = isNaN(c2) ? 64 : ((c2 & 15) << 2) | (c3 >> 6);
    var b4 = isNaN(c3) ? 64 : (c3 & 63);
    out += B64_TABLE.charAt(b1) + B64_TABLE.charAt(b2) + (b3 === 64 ? "=" : B64_TABLE.charAt(b3)) + (b4 === 64 ? "=" : B64_TABLE.charAt(b4));
  }
  return out;
}
function b64Url(s) {
  var utf8 = unescape(encodeURIComponent(String(s)));
  return b64Std(utf8).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

// 变体播单走 Worker /p/ 中转（Worker 内注入 Referer 并改写分片地址）
function workerUrlFor(targetUrl) {
  var ctx = JSON.stringify({ r: SITE + "/", k: RELAY_SECRET });
  return RELAY + "/p/" + b64Url(targetUrl) + "/" + b64Url(ctx);
}

// ---------- 网络 ----------
function fetchHtml(url, referer) {
  return Widget.http.get(url, {
    headers: {
      "User-Agent": BROWSER_UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Referer": referer || SITE + "/"
    }
  })
    .then(function (res) {
      var d = res && res.data;
      return d != null ? (typeof d === "string" ? d : JSON.stringify(d)) : "";
    })
    .catch(function () { return ""; });
}

// ---------- 列表 ----------
function pageAddress(zone, sub, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  if (zone === "home") return SITE + "/";
  if (zone === "videos") return SITE + "/videos?page=" + page;
  if (zone === "shorts") return SITE + "/c/shorts?page=" + page;
  if (zone === "creator" && sub && sub.indexOf("c:") === 0) return SITE + "/creators/" + sub.slice(2) + "?page=" + page;
  return SITE + "/";
}

function cardsFromHtml(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<article[^>]*>([\s\S]*?)<\/article>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var body = m[1];
    var am = body.match(/<a[^>]+href=["'](\/(?:videos|series)\/\d+)["']/i);
    if (!am) continue;
    var href = toAbs(am[1]);
    if (seen[href]) continue;
    seen[href] = 1;
    var title = "";
    var tm = body.match(/<h3[^>]*>\s*<a[^>]*>([^<]{1,200})<\/a>/i);
    if (tm) title = tm[1];
    if (!title) {
      var alm = body.match(/aria-label=["']([^"']{1,200})["']/i);
      if (alm) title = alm[1];
    }
    title = unescapeEntities(title);
    if (!title) continue;
    var cover = "";
    var im = body.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (im) cover = toAbs(im[1]);
    var remarks = "";
    var dm = body.match(/<span[^>]*badge[^>]*>([^<]+)<\/span>/i);
    if (dm) remarks = clean(dm[1]);
    out.push({
      id: href,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: href,
      description: remarks,
      mediaType: "movie"
    });
  }
  return out;
}

function noResult(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = clean(params.zone || "home");
  var sub = clean(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    if (zone === "home" && page > 1) return noResult();
    var html = await fetchHtml(pageAddress(zone, sub, page));
    var list = cardsFromHtml(html);
    return list.length ? list : noResult();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

async function search(params) {
  params = params || {};
  var wd = clean(params.keyword || params.wd || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return noResult("请输入关键词");
  try {
    var url = SITE + "/search?q=" + encodeURIComponent(wd) + "&page=" + page;
    var html = await fetchHtml(url);
    var list = cardsFromHtml(html);
    return list.length ? list : noResult();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

// ---------- 详情页解析 ----------
function unwrap(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

function pageTitle(html, fallback) {
  var m = html.match(/property=["']og:title["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  if (m) return unescapeEntities(m[1]).replace(/\s*\|\s*黄视频\s*$/i, "").trim();
  m = html.match(/<h1[^>]*>([^<]{2,200})<\/h1>/i);
  if (m) return unescapeEntities(m[1]);
  m = html.match(/<title>([^<]+)<\/title>/i);
  if (m) return unescapeEntities(m[1]).replace(/\s*\|\s*黄视频\s*$/i, "").trim();
  return fallback || "";
}

function pagePoster(html) {
  var m = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (m) return toAbs(m[1]);
  return "";
}

function pageBlurb(html) {
  var dm = html.match(/property=["']og:description["'][^>]*content=["']([^"']+)/i);
  if (dm) return unescapeEntities(dm[1]);
  return "";
}

function masterFromPage(html) {
  if (!html) return "";
  var m = html.match(/data-xg-player-source-value="([^"]+)"/i);
  if (m) return m[1].replace(/&amp;/g, "&");
  m = html.match(/"contentUrl"\s*:\s*"([^"]+\.m3u8[^"]*)"/i);
  if (m) return m[1].replace(/&amp;/g, "&");
  return "";
}

// 解析 master 播单的真实变体（RESOLUTION 或路径档位名），按带宽从高到低排
function tiersFromPlaylist(masterText, baseUrl) {
  var out = [];
  if (!masterText || masterText.indexOf("#EXTM3U") < 0) return out;
  var lines = String(masterText).split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    var s = clean(lines[i]);
    if (s.indexOf("#EXT-X-STREAM-INF") !== 0) continue;
    var uri = clean(lines[i + 1] || "");
    if (!uri || uri.charAt(0) === "#") continue;
    var bw = 0;
    var bm = s.match(/BANDWIDTH=(\d+)/i);
    if (bm) bw = parseInt(bm[1], 10) || 0;
    var label = "";
    var rm = s.match(/RESOLUTION=\d+x(\d+)/i);
    if (rm) label = rm[1] + "p";
    if (!label) {
      var um = uri.match(/(^|\/)(\d{3,4}p)(\/|$)/i);
      if (um) label = um[2].toLowerCase();
    }
    if (!label) label = bw > 0 ? Math.round(bw / 1000) + "k" : "播放";
    var abs = uri;
    if (uri.indexOf("http") !== 0) {
      var slash = baseUrl.lastIndexOf("/");
      abs = slash >= 0 ? baseUrl.slice(0, slash + 1) + uri : uri;
      if (uri.charAt(0) === "/") {
        var hm = baseUrl.match(/^(https?:\/\/[^\/]+)/i);
        if (hm) abs = hm[1] + uri;
      }
    }
    out.push({ label: label, url: abs, bw: bw });
  }
  out.sort(function (a, b) { return b.bw - a.bw; });
  return out;
}

// 现取详情页 + master，返回真实变体（供 detail/resource 共用）；取不到返回空数组，绝不抛错
async function fetchTiers(vid) {
  try {
    var pageUrl = SITE + "/videos/" + vid;
    var html = await fetchHtml(pageUrl, pageUrl);
    if (!html) return [];
    var master = masterFromPage(html);
    if (!master) return [];
    var mt = await fetchHtml(master, pageUrl);
    return tiersFromPlaylist(mt, master);
  } catch (e) {
    return [];
  }
}

// 单集最高档的 Worker 地址（短剧每集用）；解不出返回空串
async function fetchTopRelay(vid) {
  try {
    var tiers = await fetchTiers(vid);
    if (!tiers.length) return "";
    return workerUrlFor(tiers[0].url);
  } catch (e) {
    return "";
  }
}

function makeEpisode(lk, nm, pic, num, videoUrl) {
  var it = {
    id: lk,
    type: "url",
    title: nm,
    mediaType: "movie",
    posterPath: pic,
    link: lk,
    episode: num,
    episodeNumber: num,
    seasonIndex: 1,
    seasonNumber: 1,
    playerType: "system"
  };
  if (videoUrl) it.videoUrl = videoUrl;
  return it;
}

// 单视频页：现解 master 真实变体，每档直接交 Worker 地址
async function buildVideo(pageUrl, html, pic) {
  var eps = [];
  var seasonEps = [];
  var epItems = [];
  var topUrl = "";
  var vid = "";
  var vm = pageUrl.match(/\/videos\/(\d+)/);
  if (vm) vid = vm[1];
  var tiers = [];
  if (vid) {
    var master = masterFromPage(html);
    if (master) {
      var mt = await fetchHtml(master, pageUrl);
      tiers = tiersFromPlaylist(mt, master);
    }
  }
  if (tiers.length) {
    for (var i = 0; i < tiers.length; i++) {
      var relay = workerUrlFor(tiers[i].url);
      if (i === 0) topUrl = relay;
      var nm = tiers[i].label;
      var lk = pageUrl + TOKEN + vid + ":" + tiers[i].label;
      eps.push({ name: nm, link: lk });
      seasonEps.push({ title: nm, videoUrl: relay, episodeNumber: i + 1 });
      epItems.push(makeEpisode(lk, nm, pic, i + 1, relay));
    }
  } else if (vid) {
    var lk2 = pageUrl + TOKEN + vid + ":auto";
    eps.push({ name: "播放", link: lk2 });
    seasonEps.push({ title: "播放", episodeNumber: 1 });
    epItems.push(makeEpisode(lk2, "播放", pic, 1, ""));
  }
  return { eps: eps, seasonEps: seasonEps, epItems: epItems, topUrl: topUrl };
}

// 短剧分集页：每集并行现解最高档，直接交 Worker 地址；解不出的集留空位，点播时再解
async function buildSeries(pageUrl, html, pic) {
  var eps = [];
  var seasonEps = [];
  var epItems = [];
  var topUrl = "";
  var re = /<a[^>]+href=["'](\/videos\/\d+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var seen = {};
  var epsRaw = [];
  var mm;
  while ((mm = re.exec(html)) !== null) {
    var label = stripTags(mm[2]);
    var em = label.match(/第\s*(\d+)\s*集/);
    if (!em) continue;
    var vid = mm[1].replace("/videos/", "");
    if (seen[vid]) continue;
    seen[vid] = 1;
    epsRaw.push({ n: parseInt(em[1], 10), vid: vid });
  }
  epsRaw.sort(function (a, b) { return a.n - b.n; });
  var jobs = [];
  for (var i = 0; i < epsRaw.length; i++) {
    jobs.push(fetchTopRelay(epsRaw[i].vid));
  }
  var settled = await Promise.all(jobs);
  for (var j = 0; j < epsRaw.length; j++) {
    var nm = "第" + epsRaw[j].n + "集";
    var lk = pageUrl + TOKEN + epsRaw[j].vid + ":auto";
    var relay = settled[j] || "";
    if (j === 0 && relay) topUrl = relay;
    eps.push({ name: nm, link: lk });
    var se = { title: nm, episodeNumber: epsRaw[j].n };
    if (relay) se.videoUrl = relay;
    seasonEps.push(se);
    epItems.push(makeEpisode(lk, nm, pic, epsRaw[j].n, relay));
  }
  return { eps: eps, seasonEps: seasonEps, epItems: epItems, topUrl: topUrl };
}

async function loadDetail(link) {
  try {
    var raw = unwrap(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    if (raw.indexOf("http") !== 0) raw = toAbs(raw);
    var html = await fetchHtml(raw, raw);
    if (!html) return { id: raw, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = pageTitle(html, raw);
    var pic = pagePoster(html);
    var blurb = pageBlurb(html);
    var built;
    if (/\/series\/\d+/.test(raw)) built = await buildSeries(raw, html, pic);
    else built = await buildVideo(raw, html, pic);
    var result = {
      id: raw,
      type: "detail",
      title: name || raw,
      name: name || raw,
      description: blurb,
      mediaType: "movie",
      link: raw,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "system"
    };
    if (built.topUrl) result.videoUrl = built.topUrl;
    if (built.eps.length) {
      result.episodes = built.eps;
      result.seasons = [{ seasonNumber: 1, title: "播放", name: "播放", episodes: built.seasonEps }];
      result.episodeItems = built.epItems;
      result.childItems = built.epItems;
    }
    return result;
  } catch (e) {
    return { id: unwrap(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  try {
    if (typeof params === "string") params = { link: params };
    params = params || {};
    var rawLink = params.link || params.url || params.id || "";
    if (typeof rawLink === "object") rawLink = unwrap(rawLink);
    var raw = clean(rawLink);
    if (!raw && params.item) raw = clean(unwrap(params.item));
    if (!raw) return [];
    var m = raw.match(/@@HV2:(\d+):(.+)$/) || raw.match(/@@HV:(\d+):(.+)$/);
    if (!m) {
      // 直链播单：走 Worker 中转
      if (/\.m3u8(\?|#|$)/i.test(raw)) {
        return [{ name: "播放", url: workerUrlFor(raw), playerType: "system" }];
      }
      return [];
    }
    var vid = m[1];
    var want = m[2];
    var tiers = await fetchTiers(vid);
    if (!tiers.length) return [];
    var hit = tiers[0];
    if (want && want !== "auto") {
      for (var i = 0; i < tiers.length; i++) {
        if (tiers[i].label === want) { hit = tiers[i]; break; }
      }
    }
    return [{ name: hit.label, url: workerUrlFor(hit.url), playerType: "system" }];
  } catch (e) {
    return [];
  }
}
