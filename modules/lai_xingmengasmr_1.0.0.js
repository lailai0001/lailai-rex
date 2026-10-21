// 星梦ASMR for REX (lai_xingmengasmr v1.0.0)
// 移植自 mira-cat 蜘蛛 xingmengasmr.js（只读蓝图，逻辑等价移植）。
// 后端：www.asmrzy.top（Joe 主题站，HTML 正则解析，与蜘蛛同一套规则）。
// 详情取流顺序与蜘蛛一致：iframe → 直链 mp4/m3u8 → smartideo → video/source；
// B站嵌入在 loadDetail 内用蜘蛛 play 的同款公开 API 解析直链（view → playurl），
// 失败回退官方播放器页；YouTube 嵌入回退 embed 地址（与蜘蛛一致）。

WidgetMetadata = {
  id: "lai_xingmengasmr",
  title: "星梦ASMR",
  description: "星梦ASMR（asmrzy.top）：中国/韩国/日本/其他/音频分类，站内 m3u8 与 B站嵌入解析播放",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://www.asmrzy.top",
  detailCacheDuration: 180,
  modules: [
    { title: "中国", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "cn" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "韩国", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "kr" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "日本", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "jp" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "其他", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "other" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "音频", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "listen" }, { name: "page", title: "页码", type: "page", value: "1" }] }
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

var BASE = "https://www.asmrzy.top";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var CATS = ["cn", "kr", "jp", "other", "listen"];

function t(v) { return String(v == null ? "" : v).trim(); }

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": referer || BASE + "/"
  };
}

async function fetchText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  var body = res && res.data != null ? String(res.data) : "";
  return body;
}

async function fetchJson(url, headers) {
  var res = await Widget.http.get(url, { headers: headers });
  var data = res && res.data != null ? res.data : null;
  if (data == null) return null;
  if (typeof data === "object") return data;
  try { return JSON.parse(String(data)); } catch (e) { return null; }
}

// ---- 列表解析（与蜘蛛 parsePostItem / parseList 同规则）----
function parsePostItem(itemHtml) {
  var titleM = itemHtml.match(/<a[^>]+class="[^"]*title[^"]*"[^>]*>([^<]+)<\/a>/);
  if (!titleM) return null;
  var title = t(titleM[1]);

  var linkM = itemHtml.match(/<a[^>]+href="([^"]+)"[^>]*class="[^"]*thumbnail[^"]*"/);
  if (!linkM) linkM = itemHtml.match(/<a[^>]+href="([^"]+)"[^>]*>.*?<img/);
  if (!linkM) return null;
  var link = linkM[1];
  if (!/^https?:\/\//i.test(link)) {
    link = link.charAt(0) === "/" ? BASE + link : BASE + "/" + link;
  }

  var pic = "";
  var imgM = itemHtml.match(/<img[^>]+data-src="([^"]+)"/) || itemHtml.match(/<img[^>]+src="([^"]+)"/);
  if (imgM) pic = imgM[1];

  var remarks = "";
  var dateM = itemHtml.match(/<time[^>]*>([^<]+)<\/time>/) || itemHtml.match(/<li>(\d{4}年\d{2}月\d{2}日)<\/li>/);
  if (dateM) remarks = t(dateM[1]);

  return { link: link, title: title, pic: pic, remarks: remarks };
}

function parseList(html) {
  var out = [];
  if (!html) return out;
  var items = html.match(/<li[^>]*class="[^"]*joe_list__item[^"]*"[^>]*>([\s\S]*?)<\/li>/g) || [];
  for (var i = 0; i < items.length; i++) {
    var p = parsePostItem(items[i]);
    if (!p) continue;
    out.push({
      id: p.link,
      type: "url",
      title: p.title,
      posterPath: p.pic,
      coverUrl: p.pic,
      backdropPath: p.pic,
      link: p.link,
      description: p.remarks || "",
      mediaType: "movie"
    });
  }
  return out;
}

async function loadList(params) {
  params = params || {};
  var cat = String(params.cat || params.path || "cn");
  if (CATS.indexOf(cat) < 0) cat = "cn";
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var url = page > 1 ? (BASE + "/category/" + cat + "/" + page + "/") : (BASE + "/category/" + cat + "/");
  try {
    var html = await fetchText(url);
    var cards = parseList(html);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败", description: String((e && e.message) || e) }];
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
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  // 与蜘蛛同一入口：/?s= 会 302 到 /search/<关键词>/，靠请求层跟随重定向
  var url = BASE + "/?s=" + encodeURIComponent(wd);
  if (page > 1) url += "&page=" + page;
  try {
    var html = await fetchText(url);
    var cards = parseList(html);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败", description: String((e && e.message) || e) }];
  }
}

// ---- 详情取流（与蜘蛛 extractVideoUrl / parsePlatform / play 同规则）----
function extractVideoUrl(html) {
  if (!html) return null;
  var iframes = html.match(/<iframe[^>]+src="([^"]+)"/gi) || [];
  for (var i = 0; i < iframes.length; i++) {
    var m = iframes[i].match(/src="([^"]+)"/i);
    if (!m) continue;
    var src = t(m[1]);
    if (src.indexOf("//") === 0) src = "https:" + src;
    else if (src.charAt(0) === "/") src = BASE + src;
    if (/google|trustpilot|tree-nation/i.test(src)) continue;
    return src;
  }
  var direct = html.match(/https?:\/\/[^\s"']+\.(?:mp4|m3u8|webm|flv)/i);
  if (direct) return direct[0];
  var sm = html.match(/<div[^>]*class="[^"]*smartideo[^"]*"[^>]*data-(?:src|url)="([^"]+)"/i);
  if (sm) return sm[1];
  var vs = html.match(/<(?:video|source)[^>]+src="([^"]+)"/i);
  if (vs) return vs[1];
  return null;
}

function parsePlatform(url) {
  if (!url) return null;
  var m = url.match(/(?:bilibili\.com\/video\/|player\.bilibili\.com\/player\.html\?[^"]*bvid=)([a-zA-Z0-9]+)/i);
  if (m) return "bilibili://" + m[1];
  m = url.match(/player\.bilibili\.com\/player\.html\?[^"]*aid=(\d+)/i);
  if (m) return "bilibili_aid://" + m[1];
  m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (m) return "youtube://" + m[1];
  return url;
}

// B站直链解析（蜘蛛 play 的同款公开接口：view 取 cid → playurl 取 durl）
async function resolveBilibili(bvid) {
  var headers = { "User-Agent": UA, "Referer": "https://www.bilibili.com" };
  try {
    var view = await fetchJson("https://api.bilibili.com/x/web-interface/view?bvid=" + encodeURIComponent(bvid), headers);
    if (view && view.code === 0 && view.data && view.data.cid) {
      var play = await fetchJson("https://api.bilibili.com/x/player/playurl?bvid=" + encodeURIComponent(bvid) + "&cid=" + view.data.cid + "&qn=80&fnval=16", headers);
      if (play && play.code === 0 && play.data && play.data.durl && play.data.durl.length) {
        return { url: play.data.durl[0].url, headers: { "User-Agent": UA, "Referer": "https://www.bilibili.com" } };
      }
    }
  } catch (e) {}
  return { url: "https://player.bilibili.com/player.html?bvid=" + bvid, headers: { "User-Agent": UA } };
}

async function loadDetail(link) {
  var url = String(link || "");
  if (!/^https?:\/\//i.test(url)) {
    return { id: url, type: "url", title: "参数错误", description: "无法识别详情链接" };
  }
  try {
    var html = await fetchText(url);
    if (!html) {
      return { id: url, type: "url", title: "加载失败", description: "详情页无响应" };
    }
    var titleM = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    var title = titleM ? t(titleM[1]) : "星梦ASMR";
    var pic = "";
    var picM = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
    if (picM) pic = picM[1];
    if (!pic) {
      // 站方分享参数 pics= 带着本帖封面（实测新帖是图床图、老帖是 vlog 海报）
      var shareM = html.match(/[?&]pics=(https?:\/\/[^&"'<>\s]+)/i);
      if (shareM) pic = shareM[1];
    }
    if (!pic) {
      // 蜘蛛兜底取首图实测常是站标 logo 或懒加载占位图，跳过 data: 与 logo 再兜底
      var imgAll = html.match(/<img[^>]+(?:data-src|src)="([^"]+)"/g) || [];
      var firstSrc = "";
      for (var ii = 0; ii < imgAll.length; ii++) {
        var sm2 = imgAll[ii].match(/(?:data-src|src)="([^"]+)"/);
        if (!sm2) continue;
        var cand = sm2[1];
        if (/^data:/i.test(cand) || /logo\.png/i.test(cand)) continue;
        if (!firstSrc) firstSrc = cand;
        if (/img\.xmyun\.org/i.test(cand)) { pic = cand; break; }
        if (!pic && /\/vlog\/\d+\/\d+\.(?:webp|jpg|jpeg|png)/i.test(cand)) pic = cand;
      }
      if (!pic) pic = firstSrc;
    }
    var descM = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/);
    var desc = descM ? t(descM[1]) : "";

    var raw = extractVideoUrl(html);
    if (!raw) {
      return { id: url, type: "url", title: title, link: url, posterPath: pic, coverUrl: pic, backdropPath: pic, description: "未找到播放地址" };
    }
    var parsed = parsePlatform(raw);
    var videoUrl = "";
    var headers = { "User-Agent": UA };
    if (parsed.indexOf("bilibili://") === 0) {
      var rb = await resolveBilibili(parsed.split("://")[1]);
      videoUrl = rb.url;
      headers = rb.headers;
    } else if (parsed.indexOf("bilibili_aid://") === 0) {
      videoUrl = "https://player.bilibili.com/player.html?aid=" + parsed.split("://")[1];
    } else if (parsed.indexOf("youtube://") === 0) {
      videoUrl = "https://www.youtube.com/embed/" + parsed.split("://")[1] + "?autoplay=1";
    } else {
      videoUrl = parsed;
      if (videoUrl.indexOf("asmrzy.top") >= 0) headers["Referer"] = BASE + "/";
    }
    if (!videoUrl) {
      return { id: url, type: "url", title: title, link: url, posterPath: pic, coverUrl: pic, backdropPath: pic, description: "未找到播放地址" };
    }
    return {
      id: url,
      type: "detail",
      title: title,
      link: url,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: desc,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: headers
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
