// v1.0.4：AVDB 样式详情：分类小卡片 genreItems + 点按路由（详情页提取分类链接，点按打开该分类全部内容）
// v1.0.2（2026-11-16）：修“播放解析不出地址（未找到播放地址）”。根因：loadDetail
//   用 String(link)，App 传卡片对象时得 "[object Object]"，拼成
//   https://www.91cg1.com/[object Object] 取回 404 页，extractEps 找不到
//   dplayer → 返回“未找到播放地址”（与用户截图逐字一致）。站方与播放链实测
//   全活：文章 128443 的 dplayer 直给带时效 token 的 m3u8，直取 200、经
//   javsb-relay 中转 200。修法：补 unwrapLink；详情回 seasons/episodeItems，
//   集带中转地址（system）；去掉顶层 videoUrl；新增 loadResource（直通集地址，
//   失败重解，仍失败给网页播放行，永不回 []）。
// 91吃瓜 for REX (lai_91cg v1.0.0)
// 移植自 mira-cat 蜘蛛 cg91.js (key py_91cg), 后端 https://www.91cg1.com/ (Typecho Mirages 主题)。
// 列表: <a href="/archives/{id}/"> 后跟 post-card 块, 封面在 loadBannerDirect('...') 里,
//   标题在 <h2 class="post-card-title"> 里 (含内嵌 wrap 标签需先剔除);
// 详情: <div class="dplayer" data-config='...'> 里 video.url 即 m3u8 直链 (带时效 token, 详情时现取),
//   多段按段列出, REX 单地址只放第 1 段;
// 播放: 单一最优地址 = 流中转 V2 中转集 (javsb-relay /m3u8?u= 形态, 原样照搬猫源 detail 的构造方式)。
// 探针: 取到 m3u8 后先看体长度, 0 字节就重取一次详情再探, 仍 0 字节则如实返回失败兜底, 不给假地址;
//   只探 m3u8 清单, 绝不探 mp4; 无播放器的文章直接走失败兜底, 不给猫源式的假线路。
// 封面: pic.hdhwqx.cn 直取是加密密文, 走已部署的 51chigua 解密代理出图 (蜘蛛写死地址, 原样沿用)。

WidgetMetadata = {
  id: "lai_91cg",
  title: "91吃瓜",
  description: "91吃瓜：今日吃瓜/每日大赛/AI短剧等 21 个分类，详情页直解 dplayer 播放地址并走流中转",
  author: "lai",
  version: "1.0.4",
  requiredVersion: "0.0.1",
  site: "https://www.91cg1.com/",
  detailCacheDuration: 180,
  modules: [
    { title: "最新更新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "今日吃瓜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "zxcghl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "AI短剧", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "dydj" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "每日大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "mrds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "实时偷拍", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "sstp" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "最高点击", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "rsdg" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "深夜撸片", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "lpsd" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "海角乱伦", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "hjll" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "91探花", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "91th" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "成人动漫", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "crdm" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "91周榜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "zdtop" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "91月榜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ydtop" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "必吃大瓜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "bcdg" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "网红黑料", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "whhl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "明星黑料", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "mxhl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "社会奇闻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "qwys" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "师生专栏", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "xsjlb" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "反差靓女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "fclv" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "网黄合集", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "gcwh" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "明星AI", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "aikj" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "自拍偷拍", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "zptp" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "猎奇重口", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "lqzk" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "搜索", functionName: "search", cacheDuration: 180, params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] }
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

var BASE = "https://www.91cg1.com/";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var IMG_PROXY = "https://51chigua.li768435813.workers.dev/img?url=";
var RELAY_M3U8 = "https://javsb-relay.li768435813.workers.dev/m3u8?u=";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": BASE
  };
}

function decodeHtml(s) {
  return t(s)
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function cleanText(s) {
  return decodeHtml(s)
    .replace(/<div class="wrap">[\s\S]*?<\/div>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function getText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function proxyPic(pic) {
  if (!pic) return "";
  if (pic.indexOf("http") === 0) return IMG_PROXY + encodeURIComponent(pic);
  return pic;
}

function parseList(html) {
  var items = [];
  var seen = {};
  var chunks = String(html || "").replace(/https:\/\/www\.91cg1\.com\/archives\//g, "/archives/").split('<a href="/archives/');
  for (var i = 1; i < chunks.length; i++) {
    var blk = chunks[i].slice(0, 8000);
    var idm = blk.match(/^(\d+)\//);
    if (!idm) continue;
    var url = BASE + "archives/" + idm[1] + "/";
    if (seen[url]) continue;
    var hm = blk.match(/<h2 class="post-card-title"[^>]*>([\s\S]{0,800}?)<\/h2>/i);
    var title = hm ? cleanText(hm[1]) : "";
    if (!title || title.length < 2) continue;
    var pm = blk.match(/loadBannerDirect\('([^']+)'/i);
    seen[url] = 1;
    var cover = proxyPic(pm ? pm[1] : "");
    items.push({ id: url, type: "url", title: title, posterPath: cover, coverUrl: cover, backdropPath: cover, link: url, description: "", mediaType: "movie" });
    if (items.length >= 24) break;
  }
  return items;
}

// 实时偷拍 sstp 是 realtime 特殊页：条目为
// <a class="realtime-card" href="/category/sstp/video/{id}/" aria-label="标题">，
// 封面在 img 的 data-xkrkllgl 属性里（src 是占位图）。标准 post-card 解析回 0。
function parseRealtime(html) {
  var items = [];
  var seen = {};
  var re = /<a[^>]*class="[^"]*realtime-card[^"]*"[^>]*href="([^"]+)"[^>]*aria-label="([^"]*)"/gi;
  var m;
  while ((m = re.exec(String(html || "")))) {
    var href = m[1];
    var title = cleanText(m[2] || "");
    if (!title || title.length < 2) continue;
    var url = href.indexOf("http") === 0 ? href : BASE.replace(/\/$/, "") + href;
    if (seen[url]) continue;
    seen[url] = 1;
    // 封面：同一 a 块内 img 的 data-xkrkllgl
    var blk = String(html || "").slice(m.index, m.index + 4000);
    var im = blk.match(/data-xkrkllgl="([^"]+)"/i) || blk.match(/<img[^>]+src="([^"]+)"/i);
    var cover = proxyPic(im ? im[1] : "");
    items.push({ id: url, type: "url", title: title, posterPath: cover, coverUrl: cover, backdropPath: cover, link: url, description: "", mediaType: "movie" });
    if (items.length >= 24) break;
  }
  return items;
}

function listOrMsg(html, url) {
  if (!html) return [{ id: "empty", type: "url", title: "空页面" }];
  var list = parseList(html);
  if (!list.length) list = parseRealtime(html);
  return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
}

function listUrl(cat, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  cat = t(cat) || "latest";
  var base = BASE.replace(/\/$/, "");
  if (cat === "latest") {
    return page === 1 ? base + "/" : base + "/page/" + page + "/";
  }
  return page === 1 ? base + "/category/" + cat + "/" : base + "/category/" + cat + "/" + page + "/";
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var cat = String(params.path || params.cat || "latest");
  var url = listUrl(cat, page);
  try {
    var html = await getText(url);
    return listOrMsg(html, url);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
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
  var url = BASE + "search/" + encodeURIComponent(wd) + "/";
  if (page > 1) url += page + "/";
  try {
    var html = await getText(url);
    return listOrMsg(html, url);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// 与蜘蛛 extractEps 同口径: 逐个 dplayer div 取 data-config 的 video.url。
function extractEps(html) {
  var eps = [];
  var divs = String(html || "").match(/<div class="dplayer"([^>]*)>/gi) || [];
  for (var i = 0; i < divs.length; i++) {
    var attrs = divs[i];
    var cm = attrs.match(/data-config='([^']*)'/i) || attrs.match(/data-config="([^"]*)"/i);
    var url = "";
    if (cm) {
      var cfgText = cm[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      try {
        var cfg = JSON.parse(cfgText);
        if (cfg && cfg.video && cfg.video.url) url = cfg.video.url;
      } catch (e) {}
      if (!url) {
        var um = cfgText.match(/"url"\s*:\s*"([^"]+\.m3u8[^"]*)"/i);
        if (um) url = um[1].replace(/\\\//g, "/");
      }
    }
    if (!url) continue;
    url = url.replace(/\\\//g, "/").replace(/\\u0026/g, "&");
    var tm = attrs.match(/data-video_title="([^"]*)"/i);
    eps.push({ name: tm ? cleanText(tm[1]) : "", url: url });
  }
  return eps;
}

// 探针 (照搬猫源 probeEps 的意图, 按 REX 单地址收敛):
// 只探将要出线的第 1 段 m3u8; 体长 0 时重取一次详情拿新 token 再探一次;
// 两次都 0 则返回空串, 调用方如实返回失败兜底。mp4 绝不探。
async function probeFirstUrl(firstUrl, articleUrl) {
  if (!/\.m3u8/i.test(firstUrl)) return firstUrl;
  // 探中转后地址（javsb-relay）：直链在手机侧常被站方拦，探直链必空。
  var relayUrl = RELAY_M3U8 + encodeURIComponent(firstUrl);
  try {
    var body = await getText(relayUrl);
    if (body.length > 0) return firstUrl;
  } catch (e) {}
  try {
    var html2 = await getText(articleUrl);
    if (html2) {
      var eps2 = extractEps(html2);
      if (eps2.length && /\.m3u8/i.test(eps2[0].url)) {
        var relay2 = RELAY_M3U8 + encodeURIComponent(eps2[0].url);
        var body2 = await getText(relay2);
        if (body2.length > 0) return eps2[0].url;
      }
    }
  } catch (e) {}
  // 探针失败也不拦回地址：中转腿可能只是暂时慢，App 仍可现取现播。
  return firstUrl;
}

// 运行时把卡片对象直接传给 loadDetail/loadResource，String(对象) 得 "[object Object]"，
// 入口先从对象/字符串里解包出链接字符串，优先 videoUrl（集对象自带可播地址）。
function unwrapLink(v) {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object") {
    if (typeof v.videoUrl === "string" && v.videoUrl) return v.videoUrl;
    if (typeof v.link === "string" && v.link) return v.link;
    if (typeof v.url === "string" && v.url) return v.url;
    if (typeof v.id === "string" && v.id) return v.id;
    return "";
  }
  return String(v);
}

// ---- AVDB 样式详情：分类小卡片（点按出该分类全部内容）----
// v1.0.4：详情页提取分类链接建成 genreItems；点按分类后 loadDetail 走分类分支返回该分类全部内容。
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
    var abs = (/^https?:\/\//i.test(href) ? href : (href.indexOf("//") === 0 ? "https:" + href : (href.charAt(0) === "/" ? String(BASE).replace(/\/+$/, "") + href : String(BASE).replace(/\/+$/, "") + "/" + href)));
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
async function loadDetail(link) {
  var taxGenres = [];
  try {
    var url = unwrapLink(link);
    if (!/^https?:\/\//i.test(url)) url = BASE + url.replace(/^\/+/, "");
    if (!url) {
      return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    }
    // AVDB 样式：点按分类小卡片 → 打开该分类的全部内容。
    if (TAX_GENRE_RE.test(url)) {
      var taxSlug = taxSlugOf(url);
      var taxName = taxSlug;
      try { taxName = decodeURIComponent(taxSlug); } catch (e) {}
      var taxWorks = await loadList({ path: taxSlug, page: 1 });
      if (!Array.isArray(taxWorks)) taxWorks = [];
      var taxReal = taxWorks.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
      return {
        id: url,
        type: "detail",
        mediaType: "movie",
        title: taxName || "分类",
        link: url,
        description: "分类 · 共 " + taxReal.length + " 部作品",
        videoUrl: "",
        childItems: [],
        relatedItems: taxReal.length ? taxReal : taxWorks
      };
    }
    var html = await getText(url);
    taxGenres = extractGenreFromHtml(html);
    var hm = html.match(/<h1[^>]*>([\s\S]{0,400}?)<\/h1>/i);
    var title = hm ? cleanText(hm[1]) : "";
    var name = title || "91吃瓜";
    var eps = extractEps(html);
    var pic = "";
    var pm = html.match(/<meta itemprop="image" content="([^"]+)"/i)
      || html.match(/loadBannerDirect\('([^']+)'/i);
    if (pm) pic = proxyPic(pm[1]);
    if (!eps.length) {
      return { id: url, type: "url", title: name, description: "未找到播放地址" };
    }
    var good = await probeFirstUrl(eps[0].url, url);
    if (!good) {
      return { id: url, type: "url", title: name, description: "未找到播放地址" };
    }
    var videoUrl = /\.m3u8/i.test(good) ? RELAY_M3U8 + encodeURIComponent(good) : good;
    var item = { id: url, type: "url", title: name, name: "正片", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, videoUrl: videoUrl, link: url, posterPath: pic, coverUrl: pic, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": BASE } };
    return taxDetailRet({
      id: url,
      type: "detail",
      title: name,
      link: url,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      episodes: [{ name: "正片", id: url, link: url, videoUrl: videoUrl }],
      seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: [{ title: "正片", videoUrl: videoUrl, episodeNumber: 1 }] }],
      episodeItems: [item],
      childItems: [item]
    }, taxGenres);
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// 点播回落：集自带的中转地址直接透传；否则按文章链接重解一次；
// 仍失败给文章页网页播放行，永不回 []。
async function loadResource(params) {
  var url = "";
  try {
    var raw = unwrapLink(params);
    if (!raw && params && typeof params === "object") raw = unwrapLink(params.item);
    if (!raw) return [];
    if (/m3u8/i.test(raw) || /\.mp4/i.test(raw)) {
      return [{ name: "正片", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": BASE } }];
    }
    url = raw;
    if (!/^https?:\/\//i.test(url)) url = BASE + url.replace(/^\/+/, "");
    var html = await getText(url);
    var eps = extractEps(html);
    if (eps.length) {
      var good = await probeFirstUrl(eps[0].url, url);
      if (good) {
        var videoUrl = /\.m3u8/i.test(good) ? RELAY_M3U8 + encodeURIComponent(good) : good;
        return [{ name: "正片", url: videoUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": BASE } }];
      }
    }
    return [{ name: "网页播放", url: url, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": BASE } }];
  } catch (e) {
    if (url) return [{ name: "网页播放", url: url, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": BASE } }];
    return [];
  }
}
