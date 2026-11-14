// ChineseAV for REX (lai_chineseav v1.0.0)
// 移植自 mira-cat 蜘蛛 chineseav.js（只读蓝图），后端 https://chineseav.net/。
// WordPress 7.1.4 + KingTube 主题的中文 AV tube 站。
// 列表：article.thumb-block，详情页 iframe src 即直链 m3u8（t27.cdn2020.com）。
// 封面与视频均无 Referer 门禁，可直链；m3u8 单档，只出一条播放线。
// 分类：67 个（首页最新 + 66 个传媒/厂牌名，无子分类），全部传媒以筛选卡片呈现，不平铺。

WidgetMetadata = {
  id: "lai_chineseav",
  title: "ChineseAV",
  description: "ChineseAV：中文 AV 站，首页最新 + 66 传媒筛选，详情 iframe 直给 m3u8 单档",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://chineseav.net",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "首页最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "全部传媒", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat" }, { name: "sub", title: "传媒", type: "enumeration", value: "3xchina-net", enumOptions: [{"name": "3XCHINA", "value": "3xchina-net"}, {"name": "Absolute Media", "value": "absolute-media"}, {"name": "爱神传媒", "value": "aishen-media"}, {"name": "Angel Pictures", "value": "angel-pictures"}, {"name": "Asian Hot Media", "value": "asian-hot-media"}, {"name": "AV帝王传媒", "value": "av-emperor-media"}, {"name": "香蕉视频传媒", "value": "banana-video-media"}, {"name": "Bronze Film", "value": "bronze-film"}, {"name": "糖心Vlog", "value": "candy-heart-vlog"}, {"name": "猫爪视频", "value": "cat-claw-video"}, {"name": "常知传媒", "value": "changzhi-media"}, {"name": "国产", "value": "chinese-porn"}, {"name": "疯狂视频传媒", "value": "crazy-video-media"}, {"name": "娃娃姐妹", "value": "doll-sister"}, {"name": "国产AV", "value": "domestic-av"}, {"name": "抖音传媒", "value": "douyin-media"}, {"name": "剧情", "value": "drama"}, {"name": "鹰眼AV", "value": "eagle-av"}, {"name": "ED马赛克", "value": "ed-mosaic"}, {"name": "爱迪生传媒", "value": "edison-media"}, {"name": "大象传媒", "value": "elephant-media"}, {"name": "Eros Media", "value": "eros-media"}, {"name": "放浪传媒", "value": "fang-lang-media"}, {"name": "关系传媒", "value": "guanxi-media"}, {"name": "辣椒原创", "value": "hot-pepper-original"}, {"name": "偶像传媒", "value": "idol-media"}, {"name": "果冻传媒", "value": "jelly-media"}, {"name": "京东影业", "value": "jingdong-pictures"}, {"name": "巨鹿娱乐传媒", "value": "julu-entertainment-media"}, {"name": "聚香娱乐传媒", "value": "juxiang-entertainment-media"}, {"name": "韩国成人", "value": "korean-adult-films"}, {"name": "LMG影业传媒", "value": "lmg-film-industry-media"}, {"name": "麻豆传媒", "value": "madou-media"}, {"name": "麦尼传媒", "value": "maini-media"}, {"name": "妈妈传媒", "value": "mama-media"}, {"name": "肉传媒", "value": "meat-media"}, {"name": "MG影业传媒", "value": "mg-film-industry-media"}, {"name": "微圈", "value": "micro-circle"}, {"name": "千年传媒", "value": "millennium-media"}, {"name": "兔子先生", "value": "mr-rabbit"}, {"name": "Multi-P", "value": "multi-p"}, {"name": "Omi国际传媒", "value": "omi-international-media"}, {"name": "蜜桃视频传媒", "value": "peach-video-media"}, {"name": "情色故事", "value": "porn-story"}, {"name": "猎艳", "value": "pussy-hunter"}, {"name": "红灯视频", "value": "red-light-video"}, {"name": "肉视频", "value": "rou-video"}, {"name": "皇家华人", "value": "royal-chinese"}, {"name": "SA国际传媒", "value": "sa-international-media"}, {"name": "性控", "value": "sex-control"}, {"name": "抖阴传媒", "value": "shaking-yin-media"}, {"name": "星空无限传媒", "value": "starry-sky-unlimited-media"}, {"name": "星视传媒", "value": "start-media-sex-vision-media"}, {"name": "糖心Vlog", "value": "sugar-heart-vlog"}, {"name": "甜心Vlog", "value": "sweet-heart-vlog"}, {"name": "三狼传媒", "value": "three-wolf-media"}, {"name": "天美传媒", "value": "tianmei-media"}, {"name": "蒂米传媒", "value": "timi-media"}, {"name": "乌托邦传媒", "value": "utopia-media"}, {"name": "维纳斯", "value": "venus"}, {"name": "维密传媒", "value": "victorias-secret-media"}, {"name": "渡边传媒", "value": "watanabe-media"}, {"name": "微信传媒", "value": "wechat-media"}, {"name": "微密圈传媒", "value": "wemiquan-media"}, {"name": "星吧传媒", "value": "xingba-media"}, {"name": "星空无限传媒", "value": "xingkong-unlimited-media"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://chineseav.net";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

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

async function getHtml(url, referer) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Referer": referer || HOST + "/"
      }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body;
  } catch (e) { return ""; }
}

function listUrl(zone, sub, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  if (zone === "cat") {
    var path = HOST + "/category/" + (sub || "3xchina-net") + "/";
    return page > 1 ? path + "page/" + page + "/" : path;
  }
  return page <= 1 ? HOST + "/" : HOST + "/page/" + page + "/";
}

// 列表：article.thumb-block；只保留视频详情链接，排除分类/标签/演员等归档页。
function parseList(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<article[^>]+class="[^"]*thumb-block[^"]*"[^>]*>([\s\S]*?)<\/article>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var body = m[1];
    var am = body.match(/<a[^>]+href=["'](https?:\/\/chineseav\.net\/[^"']+\/)["'][^>]*title=["']([^"']+)["']/i)
      || body.match(/<a[^>]+title=["']([^"']+)["'][^>]+href=["'](https?:\/\/chineseav\.net\/[^"']+\/)["']/i);
    var href = "", title = "";
    if (am) {
      if (/^https?:\/\//i.test(am[1])) { href = am[1]; title = am[2]; }
      else { title = am[1]; href = am[2]; }
    } else {
      var hm = body.match(/<a[^>]+href=["'](https?:\/\/chineseav\.net\/[^"']+\/)["']/i);
      if (hm) href = hm[1];
    }
    if (!href) continue;
    if (seen[href]) continue;
    if (/\/category\/|\/tag\/|\/actor\/|\/actors\/|\/tags\//i.test(href)) continue;
    seen[href] = 1;
    var im = body.match(/<img[^>]+class=["'][^"']*video-main-thumb[^"']*["'][^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["']/i)
      || body.match(/<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]+class=["'][^"']*video-main-thumb[^"']*["']/i)
      || body.match(/<img[^>]+(?:src|data-src|data-lazy-src)=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i);
    var cover = im ? absUrl(im[1]) : "";
    if (!title) {
      var tm = body.match(/<h[123][^>]*>\s*<a[^>]*>([^<]{2,200})<\/a>/i)
        || body.match(/alt=["']([^"']{2,200})["']/i);
      if (tm) title = tm[1];
    }
    title = decodeHtml(title);
    if (!title) title = href.replace(HOST, "").replace(/\//g, "");
    var remarks = "";
    var dm = body.match(/<span[^>]*class=["'][^"']*duration[^"']*["'][^>]*>([^<]+)<\/span>/i)
      || body.match(/(\d{1,2}:\d{2}:\d{2}|\d{1,2}:\d{2})/);
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
    var html = await getHtml(listUrl(zone, sub, page));
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
    var url = HOST + "/?s=" + encodeURIComponent(wd);
    if (page > 1) url = HOST + "/page/" + page + "/?s=" + encodeURIComponent(wd);
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

// 详情页 iframe src 即直链 m3u8；兜底取页内任意 .m3u8
function extractPlay(html) {
  var seen = {};
  var sources = [];
  function add(url) {
    url = t(url);
    if (!url || seen[url]) return;
    if (!/^https?:\/\//i.test(url)) return;
    if (!/\.m3u8/i.test(url)) return;
    seen[url] = 1;
    sources.push(url);
  }
  var ims = html.match(/<iframe[^>]+src=["']([^"']+\.m3u8[^"']*)["']/gi) || [];
  for (var i = 0; i < ims.length; i++) {
    var um = ims[i].match(/src=["']([^"']+)["']/i);
    if (um) add(um[1].replace(/&amp;/g, "&"));
  }
  if (!sources.length) {
    var m3 = html.match(/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/gi) || [];
    for (var j = 0; j < m3.length; j++) add(m3[j].replace(/&amp;/g, "&"));
  }
  return sources;
}

function extractTitle(html, fallback) {
  var m = html.match(/property=["']og:title["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  if (m) return decodeHtml(m[1]).replace(/\s*[-|–]\s*CHINESEAV.*$/i, "").trim();
  m = html.match(/<h1[^>]*>([^<]{2,200})<\/h1>/i);
  if (m) return decodeHtml(m[1]);
  m = html.match(/<title>([^<]+)<\/title>/i);
  if (m) return decodeHtml(m[1]).replace(/\s*[-|–].*$/, "").trim();
  return fallback || "";
}

function extractCover(html) {
  var m = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (m) return absUrl(m[1]);
  return "";
}

async function loadDetail(link) {
  try {
    var url = unwrapLink(link);
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    if (url.indexOf("http") !== 0) url = absUrl(url);
    var html = await getHtml(url, url);
    if (!html) return { id: url, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = extractTitle(html, url);
    var desc = "";
    var dm = html.match(/property=["']og:description["'][^>]*content=["']([^"']+)/i);
    if (dm) desc = decodeHtml(dm[1]);
    var pic = extractCover(html);
    var sources = extractPlay(html);
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    if (sources.length) {
      var id = url + "@@PLAY";
      eps.push({ name: "播放", link: id });
      seasonEps.push({ title: "播放", videoUrl: sources[0], episodeNumber: 1 });
      epItems.push({
        id: id,
        type: "url",
        title: "播放",
        mediaType: "movie",
        posterPath: pic,
        videoUrl: sources[0],
        link: id,
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system",
        customHeaders: { "User-Agent": UA, "Referer": HOST + "/" }
      });
    }
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
      playerType: "app"
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "播放", name: "播放", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
      result.videoUrl = sources[0];
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
  // 档位入口：@@PLAY -> 回详情取直链 m3u8
  var at = raw.indexOf("@@PLAY");
  if (at >= 0) {
    var durl = raw.slice(0, at);
    try {
      var det = await loadDetail(durl);
      var items = det && det.episodeItems;
      if (items && items.length && items[0].videoUrl) {
        return [{ name: "播放", url: items[0].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
      }
    } catch (e) { /* fall through */ }
    return [];
  }
  // 直链 m3u8
  if (/\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  }
  // 兜底：详情地址 -> 取详情首线
  try {
    var det2 = await loadDetail(raw);
    var eps = det2 && det2.episodeItems;
    if (eps && eps.length && eps[0].videoUrl) {
      return [{ name: "播放", url: eps[0].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
  } catch (e) { /* fall through */ }
  return [];
}
