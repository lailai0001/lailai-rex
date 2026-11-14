// ChineseAV for REX (lai_chineseav2 v1.0.0, full rewrite from scratch)
// 站点 https://chineseav.net，WordPress + KingTube 主题的中文 AV 站。
// 列表是 article.thumb-block 卡片；详情页 iframe 的 src 就是直链 m3u8（t27.cdn2020.com）。
// 封面与视频都没有 Referer 门禁，可以直链；m3u8 只有单档，只出一条播放线。
// 分类：首页最新 + 全部传媒（筛选卡片，64 个，去掉了旧版两个重名：糖心Vlog、星空无限传媒各只留一个）。
// 本文件是全新重写：新内部编号 lai_chineseav2，解析改用切块方式，helper 与流程全部重排，
// 不引用旧模块的任何代码。旧模块 lai_chineseav（1.0.0 / 1.0.1）在用户手机上始终报模块加载失败，
// 静态比对查不出毛病，疑似 App 按内部编号记住了失败，故换新编号重写。

WidgetMetadata = {
  id: "lai_chineseav2",
  title: "ChineseAV",
  description: "ChineseAV：中文 AV 站，首页最新 + 64 传媒筛选，详情 iframe 直给 m3u8 单档",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://chineseav.net",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "首页最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "全部传媒", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat" }, { name: "sub", title: "传媒", type: "enumeration", value: "3xchina-net", enumOptions: [{"name": "3XCHINA", "value": "3xchina-net"}, {"name": "Absolute Media", "value": "absolute-media"}, {"name": "爱神传媒", "value": "aishen-media"}, {"name": "Angel Pictures", "value": "angel-pictures"}, {"name": "Asian Hot Media", "value": "asian-hot-media"}, {"name": "AV帝王传媒", "value": "av-emperor-media"}, {"name": "香蕉视频传媒", "value": "banana-video-media"}, {"name": "Bronze Film", "value": "bronze-film"}, {"name": "糖心Vlog", "value": "candy-heart-vlog"}, {"name": "猫爪视频", "value": "cat-claw-video"}, {"name": "常知传媒", "value": "changzhi-media"}, {"name": "国产", "value": "chinese-porn"}, {"name": "疯狂视频传媒", "value": "crazy-video-media"}, {"name": "娃娃姐妹", "value": "doll-sister"}, {"name": "国产AV", "value": "domestic-av"}, {"name": "抖音传媒", "value": "douyin-media"}, {"name": "剧情", "value": "drama"}, {"name": "鹰眼AV", "value": "eagle-av"}, {"name": "ED马赛克", "value": "ed-mosaic"}, {"name": "爱迪生传媒", "value": "edison-media"}, {"name": "大象传媒", "value": "elephant-media"}, {"name": "Eros Media", "value": "eros-media"}, {"name": "放浪传媒", "value": "fang-lang-media"}, {"name": "关系传媒", "value": "guanxi-media"}, {"name": "辣椒原创", "value": "hot-pepper-original"}, {"name": "偶像传媒", "value": "idol-media"}, {"name": "果冻传媒", "value": "jelly-media"}, {"name": "京东影业", "value": "jingdong-pictures"}, {"name": "巨鹿娱乐传媒", "value": "julu-entertainment-media"}, {"name": "聚香娱乐传媒", "value": "juxiang-entertainment-media"}, {"name": "韩国成人", "value": "korean-adult-films"}, {"name": "LMG影业传媒", "value": "lmg-film-industry-media"}, {"name": "麻豆传媒", "value": "madou-media"}, {"name": "麦尼传媒", "value": "maini-media"}, {"name": "妈妈传媒", "value": "mama-media"}, {"name": "肉传媒", "value": "meat-media"}, {"name": "MG影业传媒", "value": "mg-film-industry-media"}, {"name": "微圈", "value": "micro-circle"}, {"name": "千年传媒", "value": "millennium-media"}, {"name": "兔子先生", "value": "mr-rabbit"}, {"name": "Multi-P", "value": "multi-p"}, {"name": "Omi国际传媒", "value": "omi-international-media"}, {"name": "蜜桃视频传媒", "value": "peach-video-media"}, {"name": "情色故事", "value": "porn-story"}, {"name": "猎艳", "value": "pussy-hunter"}, {"name": "红灯视频", "value": "red-light-video"}, {"name": "肉视频", "value": "rou-video"}, {"name": "皇家华人", "value": "royal-chinese"}, {"name": "SA国际传媒", "value": "sa-international-media"}, {"name": "性控", "value": "sex-control"}, {"name": "抖阴传媒", "value": "shaking-yin-media"}, {"name": "星空无限传媒", "value": "starry-sky-unlimited-media"}, {"name": "星视传媒", "value": "start-media-sex-vision-media"}, {"name": "甜心Vlog", "value": "sweet-heart-vlog"}, {"name": "三狼传媒", "value": "three-wolf-media"}, {"name": "天美传媒", "value": "tianmei-media"}, {"name": "蒂米传媒", "value": "timi-media"}, {"name": "乌托邦传媒", "value": "utopia-media"}, {"name": "维纳斯", "value": "venus"}, {"name": "维密传媒", "value": "victorias-secret-media"}, {"name": "渡边传媒", "value": "watanabe-media"}, {"name": "微信传媒", "value": "wechat-media"}, {"name": "微密圈传媒", "value": "wemiquan-media"}, {"name": "星吧传媒", "value": "xingba-media"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://chineseav.net";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function cleanStr(v) {
  if (v === null || v === undefined) return "";
  return String(v).replace(/^\s+|\s+$/g, "");
}

function htmlDecode(s) {
  var out = cleanStr(s);
  out = out.split("&amp;").join("&");
  out = out.split("&lt;").join("<");
  out = out.split("&gt;").join(">");
  out = out.split("&quot;").join('"');
  out = out.split("&#39;").join("'");
  out = out.split("&nbsp;").join(" ");
  out = out.replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); });
  out = out.replace(/&#x([0-9a-fA-F]+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 16)); });
  return out;
}

function toAbs(u) {
  u = cleanStr(u);
  if (!u) return "";
  if (u.indexOf("http://") === 0 || u.indexOf("https://") === 0) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return HOST + "/" + u;
}

function textOf(res) {
  if (!res || res.data === null || res.data === undefined) return "";
  if (typeof res.data === "string") return res.data;
  return JSON.stringify(res.data);
}

async function fetchPage(url, referer) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Referer": referer || HOST + "/"
      }
    });
    return textOf(res);
  } catch (e) {
    return "";
  }
}

function pageUrl(zone, sub, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  if (zone === "cat") {
    var path = HOST + "/category/" + (sub || "3xchina-net") + "/";
    if (page > 1) return path + "page/" + page + "/";
    return path;
  }
  if (page <= 1) return HOST + "/";
  return HOST + "/page/" + page + "/";
}

function isVideoHref(href) {
  if (!href) return false;
  if (href.indexOf(HOST + "/") !== 0) return false;
  if (href.indexOf("/category/") >= 0) return false;
  if (href.indexOf("/tag/") >= 0) return false;
  if (href.indexOf("/actor/") >= 0) return false;
  if (href.indexOf("/tags/") >= 0) return false;
  if (href.indexOf("/page/") >= 0) return false;
  if (href.indexOf("?") >= 0) return false;
  var slug = href.slice(HOST.length + 1).replace(/\//g, "");
  if (slug.length < 3) return false;
  return true;
}

function pickHref(chunk) {
  var re = /href="([^"]+)"/g;
  var m;
  while ((m = re.exec(chunk)) !== null) {
    if (isVideoHref(m[1])) return m[1];
  }
  return "";
}

function pickTitle(chunk, href) {
  var m = chunk.match(/title="([^"]{2,200})"/i);
  if (m) return htmlDecode(m[1]);
  var h = chunk.match(/<h[123][^>]*>[\s\S]*?<a[^>]*>([^<]{2,200})<\/a>/i);
  if (h) return htmlDecode(h[1]);
  var a = chunk.match(/alt="([^"]{2,200})"/i);
  if (a) return htmlDecode(a[1]);
  return href.replace(HOST, "").replace(/\//g, "");
}

function pickCover(chunk) {
  var imgs = chunk.match(/<img[^>]+>/gi) || [];
  for (var i = 0; i < imgs.length; i++) {
    var tag = imgs[i];
    var s = tag.match(/(?:data-src|data-lazy-src|src)="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i);
    if (s) return toAbs(s[1]);
  }
  return "";
}

function pickRemarks(chunk) {
  var d = chunk.match(/<span[^>]*duration[^>]*>([^<]+)<\/span>/i);
  if (d) return cleanStr(d[1]);
  var tm = chunk.match(/(\d{1,2}:\d{2}:\d{2}|\d{1,2}:\d{2})/);
  if (tm) return tm[1];
  return "";
}

// 列表解析：按 <article 切块，逐块取链接/标题/封面/时长；只保留视频详情链接。
function cardList(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var parts = html.split("<article");
  for (var i = 1; i < parts.length; i++) {
    var chunk = parts[i];
    var end = chunk.indexOf("</article>");
    if (end >= 0) chunk = chunk.slice(0, end);
    if (chunk.indexOf("thumb-block") < 0) continue;
    var href = pickHref(chunk);
    if (!href) continue;
    if (seen[href]) continue;
    seen[href] = 1;
    var cover = pickCover(chunk);
    var title = pickTitle(chunk, href);
    out.push({
      id: href,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: href,
      description: pickRemarks(chunk),
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
  var zone = cleanStr(params.zone || "home");
  var sub = cleanStr(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var html = await fetchPage(pageUrl(zone, sub, page));
    var list = cardList(html);
    if (list.length) return list;
    return emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败" }];
  }
}

async function search(params) {
  params = params || {};
  var wd = cleanStr(params.keyword || params.wd || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return emptyItem("请输入关键词");
  try {
    var url = HOST + "/?s=" + encodeURIComponent(wd);
    if (page > 1) url = HOST + "/page/" + page + "/?s=" + encodeURIComponent(wd);
    var html = await fetchPage(url);
    var list = cardList(html);
    if (list.length) return list;
    return emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败" }];
  }
}

function unwrapLink(x) {
  if (x === null || x === undefined) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

// 详情页 iframe 的 src 就是直链 m3u8；兜底取页内任意 .m3u8 地址。
function findStream(html) {
  var frames = html.match(/<iframe[^>]+>/gi) || [];
  for (var i = 0; i < frames.length; i++) {
    var s = frames[i].match(/src="([^"]+)"/i);
    if (s) {
      var u = cleanStr(s[1]).split("&amp;").join("&");
      if (u.indexOf(".m3u8") >= 0) return toAbs(u);
    }
  }
  var any = html.match(/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/gi) || [];
  for (var j = 0; j < any.length; j++) {
    return cleanStr(any[j]).split("&amp;").join("&");
  }
  return "";
}

function pageTitle(html, fallback) {
  var m = html.match(/property=["']og:title["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  if (m) return htmlDecode(m[1]).replace(/\s*[-|–]\s*CHINESEAV.*$/i, "");
  m = html.match(/<h1[^>]*>([^<]{2,200})<\/h1>/i);
  if (m) return htmlDecode(m[1]);
  m = html.match(/<title>([^<]+)<\/title>/i);
  if (m) return htmlDecode(m[1]).replace(/\s*[-|–].*$/, "");
  return fallback || "";
}

function pageCover(html) {
  var m = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (m) return toAbs(m[1]);
  return "";
}

async function loadDetail(link) {
  var url = unwrapLink(link);
  if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
  if (url.indexOf("http") !== 0) url = toAbs(url);
  try {
    var html = await fetchPage(url, url);
    if (!html) return { id: url, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = pageTitle(html, url);
    var desc = "";
    var dm = html.match(/property=["']og:description["'][^>]*content=["']([^"']+)/i);
    if (dm) desc = htmlDecode(dm[1]);
    var pic = pageCover(html);
    var stream = findStream(html);
    var result = {
      id: url,
      type: "detail",
      title: name || url,
      name: name || url,
      description: desc,
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
      result.seasons = [{ seasonNumber: 1, title: "播放", name: "播放", episodes: [{ title: "播放", videoUrl: stream, episodeNumber: 1 }] }];
      result.episodeItems = [{
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
      }];
      result.childItems = result.episodeItems;
    }
    return result;
  } catch (e) {
    return { id: url, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = cleanStr(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = cleanStr(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 直链 m3u8：直接交播放器
  if (raw.indexOf(".m3u8") >= 0) {
    return [{ name: "播放", url: raw, playerType: "system" }];
  }
  // 详情地址：取详情首集的直链
  try {
    var det = await loadDetail(raw);
    var eps = det && det.episodeItems;
    if (eps && eps.length && eps[0].videoUrl) {
      return [{ name: "播放", url: eps[0].videoUrl, playerType: "system" }];
    }
  } catch (e) { /* 无播放地址时回空 */ }
  return [];
}
