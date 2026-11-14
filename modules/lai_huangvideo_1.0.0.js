// 黄视频 for REX (lai_huangvideo v1.0.0)
// 移植自 mira-cat 蜘蛛 huangvideo.js（只读蓝图），站 https://huang.video/。
// 播放必须走 huangvideo-hls Worker（已部署）：变体播单地址经 /p/<b64url(目标)>/<b64url(ctx)> 中转，
// Worker 内注入 Referer 并改写分片地址；直链 master 在 App 内会因播放器不转发 Referer 而死。
// master 在详情页 data-xg-player-source-value（h.matecdn.com），变体通常单档 720p。
// 短剧分集页 /series/<id> 的每集是 /videos/<id>，点播时现解变体。

WidgetMetadata = {
  id: "lai_huangvideo",
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

var HOST = "https://huang.video";
var WORKER = "https://huangvideo-hls.li768435813.workers.dev";
var RELAY_KEY = "lai-hls-1";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  return t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/&#x([0-9a-fA-F]+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 16)); });
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return HOST + "/" + u;
}

// 纯 JS base64url（REX 沙箱无 Buffer）
var B64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64encode(str) {
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
    out += B64_CHARS.charAt(b1) + B64_CHARS.charAt(b2) + (b3 === 64 ? "=" : B64_CHARS.charAt(b3)) + (b4 === 64 ? "=" : B64_CHARS.charAt(b4));
  }
  return out;
}
function b64url(s) {
  // UTF-8 编码后 base64，再转 url-safe
  var utf8 = unescape(encodeURIComponent(String(s)));
  return b64encode(utf8).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

// 变体播单走 Worker /p/ 中转（Worker 内注入 Referer 并改写分片地址）
function relayPlaylistUrl(targetUrl) {
  var ctx = JSON.stringify({ r: HOST + "/", k: RELAY_KEY });
  return WORKER + "/p/" + b64url(targetUrl) + "/" + b64url(ctx);
}

function getText(url, referer) {
  return Widget.http.get(url, {
    headers: {
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Referer": referer || HOST + "/"
    }
  })
    .then(function (res) {
      var d = res && res.data;
      return d != null ? (typeof d === "string" ? d : JSON.stringify(d)) : "";
    })
    .catch(function () { return ""; });
}

function listUrl(zone, sub, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  if (zone === "home") return HOST + "/";
  if (zone === "videos") return HOST + "/videos?page=" + page;
  if (zone === "shorts") return HOST + "/c/shorts?page=" + page;
  if (zone === "creator" && sub && sub.indexOf("c:") === 0) return HOST + "/creators/" + sub.slice(2) + "?page=" + page;
  return HOST + "/";
}

function parseList(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<article[^>]*>([\s\S]*?)<\/article>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var body = m[1];
    var am = body.match(/<a[^>]+href=["'](\/(?:videos|series)\/\d+)["']/i);
    if (!am) continue;
    var href = absUrl(am[1]);
    if (seen[href]) continue;
    seen[href] = 1;
    var title = "";
    var tm = body.match(/<h3[^>]*>\s*<a[^>]*>([^<]{1,200})<\/a>/i);
    if (tm) title = tm[1];
    if (!title) {
      var alm = body.match(/aria-label=["']([^"']{1,200})["']/i);
      if (alm) title = alm[1];
    }
    title = decodeHtml(title);
    if (!title) continue;
    var cover = "";
    var im = body.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (im) cover = absUrl(im[1]);
    var remarks = "";
    var dm = body.match(/<span[^>]*badge[^>]*>([^<]+)<\/span>/i);
    if (dm) remarks = t(dm[1]);
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

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "home");
  var sub = t(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    if (zone === "home" && page > 1) return emptyItem();
    var html = await getText(listUrl(zone, sub, page));
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
    var url = HOST + "/search?q=" + encodeURIComponent(wd) + "&page=" + page;
    var html = await getText(url);
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

function extractTitle(html, fallback) {
  var m = html.match(/property=["']og:title["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  if (m) return decodeHtml(m[1]).replace(/\s*\|\s*黄视频\s*$/i, "").trim();
  m = html.match(/<h1[^>]*>([^<]{2,200})<\/h1>/i);
  if (m) return decodeHtml(m[1]);
  m = html.match(/<title>([^<]+)<\/title>/i);
  if (m) return decodeHtml(m[1]).replace(/\s*\|\s*黄视频\s*$/i, "").trim();
  return fallback || "";
}

function extractCover(html) {
  var m = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (m) return absUrl(m[1]);
  return "";
}

function extractMaster(html) {
  if (!html) return "";
  var m = html.match(/data-xg-player-source-value="([^"]+)"/i);
  if (m) return m[1].replace(/&amp;/g, "&");
  m = html.match(/"contentUrl"\s*:\s*"([^"]+\.m3u8[^"]*)"/i);
  if (m) return m[1].replace(/&amp;/g, "&");
  return "";
}

// 解析 master 播单的真实变体（RESOLUTION 或路径档位名），按带宽从高到低排
function parseVariants(masterText, baseUrl) {
  var out = [];
  if (!masterText || masterText.indexOf("#EXTM3U") < 0) return out;
  var lines = String(masterText).split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    var s = t(lines[i]);
    if (s.indexOf("#EXT-X-STREAM-INF") !== 0) continue;
    var uri = t(lines[i + 1] || "");
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

// 现取详情页 + master，返回真实变体（供 detail/resource 共用）
async function resolveVariants(vid) {
  var durl = HOST + "/videos/" + vid;
  var html = await getText(durl, durl);
  if (!html) return { durl: durl, variants: [], name: "" };
  var master = extractMaster(html);
  var name = extractTitle(html, durl);
  if (!master) return { durl: durl, variants: [], name: name };
  var mt = await getText(master, durl);
  return { durl: durl, variants: parseVariants(mt, master), name: name };
}

function epItemFor(raw, title, pic, vid, label, n) {
  var id = raw + "@@HV:" + vid + ":" + label;
  return {
    id: id,
    type: "url",
    title: title,
    mediaType: "movie",
    posterPath: pic,
    link: id,
    episode: n,
    episodeNumber: n,
    seasonIndex: 1,
    seasonNumber: 1,
    playerType: "system"
  };
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    if (raw.indexOf("http") !== 0) raw = absUrl(raw);
    var html = await getText(raw, raw);
    if (!html) return { id: raw, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = extractTitle(html, raw);
    var pic = extractCover(html);
    var desc = "";
    var dm = html.match(/property=["']og:description["'][^>]*content=["']([^"']+)/i);
    if (dm) desc = decodeHtml(dm[1]);
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    // 短剧分集页：/series/<id>，每集是一个 /videos/<id>（只取“第N集”锚点）
    if (/\/series\/\d+/.test(raw)) {
      var re = /<a[^>]+href=["'](\/videos\/\d+)["'][^>]*>([\s\S]*?)<\/a>/gi;
      var seen = {};
      var epList = [];
      var mm;
      while ((mm = re.exec(html)) !== null) {
        var label = decodeHtml(t(mm[2]).replace(/<[^>]*>/g, " ").replace(/\s+/g, " "));
        var em = label.match(/第\s*(\d+)\s*集/);
        if (!em) continue;
        var vid = mm[1].replace("/videos/", "");
        if (seen[vid]) continue;
        seen[vid] = 1;
        epList.push({ n: parseInt(em[1], 10), vid: vid });
      }
      epList.sort(function (a, b) { return a.n - b.n; });
      for (var i = 0; i < epList.length; i++) {
        var epTitle = "第" + epList[i].n + "集";
        var id = raw + "@@HV:" + epList[i].vid + ":auto";
        eps.push({ name: epTitle, link: id });
        seasonEps.push({ title: epTitle, videoUrl: "", episodeNumber: epList[i].n });
        epItems.push({
          id: id,
          type: "url",
          title: epTitle,
          mediaType: "movie",
          posterPath: pic,
          link: id,
          episode: epList[i].n,
          episodeNumber: epList[i].n,
          seasonIndex: 1,
          seasonNumber: 1,
          playerType: "system"
        });
      }
    } else {
      // 单视频页：现取 master 真实变体出线
      var vid2 = (raw.match(/\/videos\/(\d+)/) || [])[1] || "";
      var master = extractMaster(html);
      var lines = [];
      if (master && vid2) {
        var mt = await getText(master, raw);
        var variants = parseVariants(mt, master);
        for (var j = 0; j < variants.length; j++) {
          lines.push({ label: variants[j].label, vid: vid2 });
        }
      }
      if (!lines.length && vid2) lines = [{ label: "auto", vid: vid2, auto: true }];
      for (var k = 0; k < lines.length; k++) {
        var lab = lines[k].label;
        var epTitle2 = lines[k].auto ? "播放" : lab;
        var id2 = raw + "@@HV:" + lines[k].vid + ":" + lab;
        eps.push({ name: epTitle2, link: id2 });
        seasonEps.push({ title: epTitle2, videoUrl: "", episodeNumber: k + 1 });
        epItems.push({
          id: id2,
          type: "url",
          title: epTitle2,
          mediaType: "movie",
          posterPath: pic,
          link: id2,
          episode: k + 1,
          episodeNumber: k + 1,
          seasonIndex: 1,
          seasonNumber: 1,
          playerType: "system"
        });
      }
    }
    var result = {
      id: raw,
      type: "detail",
      title: name || raw,
      name: name || raw,
      description: desc,
      mediaType: "movie",
      link: raw,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app"
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "播放", name: "播放", episodes: seasonEps }];
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
  var m = raw.match(/@@HV:(\d+):(.+)$/);
  if (!m) {
    // 直链播单：走 Worker 中转
    if (/\.m3u8(\?|#|$)/i.test(raw)) {
      return [{ name: "播放", url: relayPlaylistUrl(raw), playerType: "system" }];
    }
    return [];
  }
  var vid = m[1];
  var want = m[2];
  var res = await resolveVariants(vid);
  if (!res.variants.length) return [];
  var hit = null;
  if (want && want !== "auto") {
    for (var i = 0; i < res.variants.length; i++) {
      if (res.variants[i].label === want) { hit = res.variants[i]; break; }
    }
  }
  if (!hit) hit = res.variants[0];
  return [{ name: hit.label, url: relayPlaylistUrl(hit.url), playerType: "system" }];
}
