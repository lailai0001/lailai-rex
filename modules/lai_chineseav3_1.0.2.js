// ChineseAV for REX (lai_chineseav3 v1.0.2 — written from scratch)
// v1.0.2（2026-11-21）：补顶层 search 键（A 键，照 64 个可见模块的众数形状）；B 条目与 search 函数一个字未动。
// Site: https://chineseav.net, a Chinese AV site on WordPress + KingTube theme.
// List pages are article.thumb-block cards. A detail page's iframe src is a
// direct m3u8 (t27.cdn2020.com). Covers and streams carry no Referer gate,
// so the detail hands the player the direct m3u8. Single tier only, one line.
// Categories: home latest + all media houses (filter card, 64 houses; the two
// duplicate names from the first port — 糖心Vlog and 星空无限传媒 — each kept once).
//
// Why a third rewrite: the previous module (lai_chineseav2, 1.0.0) still
// failed to load on the user's phone ("模块加载失败"), although it passes
// every static check — clean syntax, loads under Bun JSC, byte-identical in
// the repo, same as the first one. The App appears to remember the failure
// by internal id, so this file is a full fresh write under a new id
// (lai_chineseav3): new helper names, new parsing flow, new organization.
// No code is carried over from the earlier modules.

WidgetMetadata = {
  id: "lai_chineseav3",
  title: "ChineseAV",
  description: "ChineseAV：中文 AV 站，首页最新 + 64 传媒筛选，详情 iframe 直给 m3u8 单档",
  author: "lai",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  site: "https://chineseav.net",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "首页最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "全部传媒", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat" }, { name: "sub", title: "传媒", type: "enumeration", value: "3xchina-net", enumOptions: [{"title": "3XCHINA", "value": "3xchina-net"}, {"title": "Absolute Media", "value": "absolute-media"}, {"title": "爱神传媒", "value": "aishen-media"}, {"title": "Angel Pictures", "value": "angel-pictures"}, {"title": "Asian Hot Media", "value": "asian-hot-media"}, {"title": "AV帝王传媒", "value": "av-emperor-media"}, {"title": "香蕉视频传媒", "value": "banana-video-media"}, {"title": "Bronze Film", "value": "bronze-film"}, {"title": "糖心Vlog", "value": "candy-heart-vlog"}, {"title": "猫爪视频", "value": "cat-claw-video"}, {"title": "常知传媒", "value": "changzhi-media"}, {"title": "国产", "value": "chinese-porn"}, {"title": "疯狂视频传媒", "value": "crazy-video-media"}, {"title": "娃娃姐妹", "value": "doll-sister"}, {"title": "国产AV", "value": "domestic-av"}, {"title": "抖音传媒", "value": "douyin-media"}, {"title": "剧情", "value": "drama"}, {"title": "鹰眼AV", "value": "eagle-av"}, {"title": "ED马赛克", "value": "ed-mosaic"}, {"title": "爱迪生传媒", "value": "edison-media"}, {"title": "大象传媒", "value": "elephant-media"}, {"title": "Eros Media", "value": "eros-media"}, {"title": "放浪传媒", "value": "fang-lang-media"}, {"title": "关系传媒", "value": "guanxi-media"}, {"title": "辣椒原创", "value": "hot-pepper-original"}, {"title": "偶像传媒", "value": "idol-media"}, {"title": "果冻传媒", "value": "jelly-media"}, {"title": "京东影业", "value": "jingdong-pictures"}, {"title": "巨鹿娱乐传媒", "value": "julu-entertainment-media"}, {"title": "聚香娱乐传媒", "value": "juxiang-entertainment-media"}, {"title": "韩国成人", "value": "korean-adult-films"}, {"title": "LMG影业传媒", "value": "lmg-film-industry-media"}, {"title": "麻豆传媒", "value": "madou-media"}, {"title": "麦尼传媒", "value": "maini-media"}, {"title": "妈妈传媒", "value": "mama-media"}, {"title": "肉传媒", "value": "meat-media"}, {"title": "MG影业传媒", "value": "mg-film-industry-media"}, {"title": "微圈", "value": "micro-circle"}, {"title": "千年传媒", "value": "millennium-media"}, {"title": "兔子先生", "value": "mr-rabbit"}, {"title": "Multi-P", "value": "multi-p"}, {"title": "Omi国际传媒", "value": "omi-international-media"}, {"title": "蜜桃视频传媒", "value": "peach-video-media"}, {"title": "情色故事", "value": "porn-story"}, {"title": "猎艳", "value": "pussy-hunter"}, {"title": "红灯视频", "value": "red-light-video"}, {"title": "肉视频", "value": "rou-video"}, {"title": "皇家华人", "value": "royal-chinese"}, {"title": "SA国际传媒", "value": "sa-international-media"}, {"title": "性控", "value": "sex-control"}, {"title": "抖阴传媒", "value": "shaking-yin-media"}, {"title": "星空无限传媒", "value": "starry-sky-unlimited-media"}, {"title": "星视传媒", "value": "start-media-sex-vision-media"}, {"title": "甜心Vlog", "value": "sweet-heart-vlog"}, {"title": "三狼传媒", "value": "three-wolf-media"}, {"title": "天美传媒", "value": "tianmei-media"}, {"title": "蒂米传媒", "value": "timi-media"}, {"title": "乌托邦传媒", "value": "utopia-media"}, {"title": "维纳斯", "value": "venus"}, {"title": "维密传媒", "value": "victorias-secret-media"}, {"title": "渡边传媒", "value": "watanabe-media"}, {"title": "微信传媒", "value": "wechat-media"}, {"title": "微密圈传媒", "value": "wemiquan-media"}, {"title": "星吧传媒", "value": "xingba-media"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
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

var CFG = {
  host: "https://chineseav.net",
  ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  defaultCat: "3xchina-net"
};

// ---------- tiny text helpers ----------

function trimText(v) {
  if (v === null || v === undefined) return "";
  return String(v).replace(/^\s+|\s+$/g, "");
}

function decodeEntities(s) {
  var out = trimText(s);
  var table = [
    ["&amp;", "&"], ["&lt;", "<"], ["&gt;", ">"],
    ["&quot;", '"'], ["&#39;", "'"], ["&nbsp;", " "]
  ];
  for (var i = 0; i < table.length; i++) {
    out = out.split(table[i][0]).join(table[i][1]);
  }
  out = out.replace(/&#(\d+);/g, function (m, n) {
    return String.fromCharCode(parseInt(n, 10));
  });
  out = out.replace(/&#x([0-9a-fA-F]+);/g, function (m, n) {
    return String.fromCharCode(parseInt(n, 16));
  });
  return out;
}

function absUrl(u) {
  u = trimText(u);
  if (!u) return "";
  if (u.indexOf("http://") === 0 || u.indexOf("https://") === 0) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return CFG.host + u;
  return CFG.host + "/" + u;
}

function respText(res) {
  if (!res || res.data === null || res.data === undefined) return "";
  if (typeof res.data === "string") return res.data;
  return JSON.stringify(res.data);
}

// ---------- http ----------

async function getHtml(url, ref) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": CFG.ua,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Referer": ref || CFG.host + "/"
      }
    });
    return respText(res);
  } catch (e) {
    return "";
  }
}

// ---------- list pages ----------

function listUrl(zone, sub, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  if (zone === "cat") {
    var base = CFG.host + "/category/" + (sub || CFG.defaultCat) + "/";
    if (page > 1) return base + "page/" + page + "/";
    return base;
  }
  if (page <= 1) return CFG.host + "/";
  return CFG.host + "/page/" + page + "/";
}

// A link counts as a video detail page only when it lives under the site
// root and is not a taxonomy, pagination or query URL.
function looksLikeVideo(href) {
  if (!href) return false;
  if (href.indexOf(CFG.host + "/") !== 0) return false;
  var banned = ["/category/", "/tag/", "/actor/", "/tags/", "/page/", "?"];
  for (var i = 0; i < banned.length; i++) {
    if (href.indexOf(banned[i]) >= 0) return false;
  }
  var slug = href.slice(CFG.host.length + 1).split("/").join("");
  return slug.length >= 3;
}

function firstDetailLink(block) {
  var re = /href\s*=\s*"([^"]+)"/g;
  var m;
  while ((m = re.exec(block)) !== null) {
    if (looksLikeVideo(m[1])) return m[1];
  }
  return "";
}

function cardTitle(block, href) {
  var m = block.match(/title\s*=\s*"([^"]{2,200})"/i);
  if (m) return decodeEntities(m[1]);
  var h = block.match(/<h[1-3][^>]*>[\s\S]*?<a\b[^>]*>([^<]{2,200})<\/a>/i);
  if (h) return decodeEntities(h[1]);
  var a = block.match(/alt\s*=\s*"([^"]{2,200})"/i);
  if (a) return decodeEntities(a[1]);
  return href.split(CFG.host).join("").split("/").join("");
}

function cardPoster(block) {
  var tags = block.match(/<img\b[^>]*>/gi) || [];
  for (var i = 0; i < tags.length; i++) {
    var s = tags[i].match(/(?:data-src|data-lazy-src|src)\s*=\s*"([^"]+\.(?:jpe?g|png|webp)[^"]*)"/i);
    if (s) return absUrl(s[1]);
  }
  return "";
}

function cardNote(block) {
  var d = block.match(/<span[^>]*duration[^>]*>([^<]+)<\/span>/i);
  if (d) return trimText(d[1]);
  var tm = block.match(/(\d{1,2}:\d{2}:\d{2}|\d{1,2}:\d{2})/);
  if (tm) return tm[1];
  return "";
}

function makeCard(block) {
  var href = firstDetailLink(block);
  if (!href) return null;
  var cover = cardPoster(block);
  return {
    id: href,
    type: "url",
    title: cardTitle(block, href),
    posterPath: cover,
    coverUrl: cover,
    backdropPath: cover,
    link: href,
    description: cardNote(block),
    mediaType: "movie"
  };
}

// Walk the page article by article with a single regex; keep thumb-block
// cards that point at a video detail page, deduped by URL.
function extractCards(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<article\b[^>]*>([\s\S]*?)<\/article>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    // "thumb-block" lives in the article's opening tag, so test the full
    // match; only the inner HTML is handed to the card builder.
    if (m[0].indexOf("thumb-block") < 0) continue;
    var block = m[1];
    var card = makeCard(block);
    if (!card) continue;
    if (seen[card.id]) continue;
    seen[card.id] = 1;
    out.push(card);
  }
  return out;
}

function emptyList(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = trimText(params.zone || "home");
  var sub = trimText(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var html = await getHtml(listUrl(zone, sub, page));
    var list = extractCards(html);
    if (list.length) return list;
    return emptyList();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败" }];
  }
}

async function search(params) {
  params = params || {};
  var wd = trimText(params.keyword || params.wd || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return emptyList("请输入关键词");
  try {
    var url = CFG.host + "/?s=" + encodeURIComponent(wd);
    if (page > 1) url = CFG.host + "/page/" + page + "/?s=" + encodeURIComponent(wd);
    var html = await getHtml(url);
    var list = extractCards(html);
    if (list.length) return list;
    return emptyList();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败" }];
  }
}

// ---------- detail ----------

// The REX runtime passes the card object, not a plain string.
function unwrapLink(x) {
  if (x === null || x === undefined) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

// The detail iframe src is the direct m3u8; fall back to any .m3u8 in page.
function streamFromPage(html) {
  var frames = html.match(/<iframe\b[^>]*>/gi) || [];
  for (var i = 0; i < frames.length; i++) {
    var s = frames[i].match(/src\s*=\s*"([^"]+)"/i);
    if (s) {
      var u = trimText(s[1]).split("&amp;").join("&");
      if (u.indexOf(".m3u8") >= 0) return absUrl(u);
    }
  }
  var any = html.match(/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/gi) || [];
  if (any.length) return trimText(any[0]).split("&amp;").join("&");
  return "";
}

function titleFromPage(html, fallback) {
  var m = html.match(/property=["']og:title["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  if (m) return decodeEntities(m[1]).replace(/\s*[-|–]\s*CHINESEAV.*$/i, "");
  m = html.match(/<h1[^>]*>([^<]{2,200})<\/h1>/i);
  if (m) return decodeEntities(m[1]);
  m = html.match(/<title>([^<]+)<\/title>/i);
  if (m) return decodeEntities(m[1]).replace(/\s*[-|–].*$/, "");
  return fallback || "";
}

function posterFromPage(html) {
  var m = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (m) return absUrl(m[1]);
  return "";
}

function descFromPage(html) {
  var m = html.match(/property=["']og:description["'][^>]*content=["']([^"']+)/i);
  if (m) return decodeEntities(m[1]);
  return "";
}

function buildDetail(url, html) {
  var name = titleFromPage(html, url);
  var pic = posterFromPage(html);
  var stream = streamFromPage(html);
  var result = {
    id: url,
    type: "detail",
    title: name || url,
    name: name || url,
    description: descFromPage(html),
    mediaType: "movie",
    link: url,
    coverUrl: pic,
    posterPath: pic,
    backdropPath: pic,
    playerType: "system"
  };
  if (stream) {
    result.videoUrl = stream;
    result.episodes = [{ name: "播放", link: url }];
    var ep = {
      id: url,
      type: "url",
      title: "播放",
      mediaType: "movie",
      posterPath: pic,
      videoUrl: stream,
      link: url,
      episode: 1,
      episodeNumber: 1,
      seasonIndex: 1,
      seasonNumber: 1,
      playerType: "system"
    };
    result.episodeItems = [ep];
    result.childItems = result.episodeItems;
    result.seasons = [{
      seasonNumber: 1,
      title: "播放",
      name: "播放",
      episodes: [{ title: "播放", videoUrl: stream, episodeNumber: 1 }]
    }];
  }
  return result;
}

async function loadDetail(link) {
  var url = unwrapLink(link);
  if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
  if (url.indexOf("http") !== 0) url = absUrl(url);
  try {
    var html = await getHtml(url, url);
    if (!html) return { id: url, type: "url", title: "详情获取失败", description: "页面无返回" };
    return buildDetail(url, html);
  } catch (e) {
    return { id: url, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// ---------- resource (fallback only) ----------

async function loadResource(params) {
  try {
    if (typeof params === "string") params = { link: params };
    params = params || {};
    var raw = trimText(params.link || params.url || params.id || "");
    if (!raw && params.item) raw = trimText(params.item.link || params.item.id || "");
    if (!raw) return [];
    // A bare m3u8 goes straight to the player.
    if (raw.indexOf(".m3u8") >= 0) {
      return [{ name: "播放", url: raw, playerType: "system" }];
    }
    // A detail address: resolve it once here and hand back the first stream.
    var det = await loadDetail(raw);
    var eps = det && det.episodeItems;
    if (eps && eps.length && eps[0].videoUrl) {
      return [{ name: "播放", url: eps[0].videoUrl, playerType: "system" }];
    }
    return [];
  } catch (e) {
    return [];
  }
}
