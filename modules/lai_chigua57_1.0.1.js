// 57吃瓜 for REX (lai_chigua57 v1.0.1)
// v1.0.1（2026-11-16）：根因——① 取数单次直连；猫源 chigua57.js 2026-11-11
//   已坐实失败在 App 内取页环节（直连偶发被拒/空回），修法是主域重试 + 备用域
//   9527heiliao.top + 含 /events/ 才算拿到。REX 照搬该加固（REX 无全局 fetch，
//   用 Widget.http.get 循环重试）。② loadDetail 未 unwrap 对象入参（REX 运行时
//   传卡片对象，vid 提取失败——harness 复现 0ms 即返“解析失败”）；且详情只回顶层
//   videoUrl、无 episodes/seasons/episodeItems，渲染不出可点播入口。修法：
//   详情直接出集（videoUrl + playerType "system"），未解出时留懒“正片”入口；
//   新增 loadResource（stream 模块，点播重抓详情页）并注册。
// 移植自 mira-cat 蜘蛛 chigua57.js, 后端: https://57cg4.com (服务端渲染 HTML)。
// 列表 /{cat}/ 与 /events/{id}/ 结构, 与蜘蛛同一套正则解析;
// 详情页正则提取 m3u8 / mp4 直链 (优先 HLS), 与蜘蛛 extractPlay 同口径。
// 封面在 s.chigua.media CDN, 需 Referer 才出图, 走已部署的
// 57chigua Worker 代理 (与蜘蛛写死地址一致, 原样沿用)。

WidgetMetadata = {
  id: "lai_chigua57",
  title: "57吃瓜",
  description: "57吃瓜（57cg4.com）：热门/今日吃瓜/每日大赛/网红黑料等分类，详情页直解 m3u8/mp4 播放",
  author: "lai",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  site: "https://57cg4.com",
  detailCacheDuration: 180,
  modules: [
    { title: "热门", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "hot" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "首页最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "今日吃瓜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "jrcg" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "每日大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "mrds" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "网红黑料", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "wanghong" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "网黄合集", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "video" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "出轨劈腿", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "cheating" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "直播擦边", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "live" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "成人AI短剧", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "aichengduanju" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "社会事件", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "society" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "明星八卦", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "star" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    {
      id: "loadResource",
      title: "57吃瓜播放源",
      description: "播放时重新抓取详情页取新鲜播放地址",
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

var BASE = "https://57cg4.com";
var ALT_HOST = "https://9527heiliao.top";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var IMG_PROXY = "https://57chigua.li768435813.workers.dev/img?url=";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": BASE + "/"
  };
}

function isChallenge(html) {
  var s = String(html || "");
  if (/<title[^>]*>\s*Just a moment/i.test(s)) return true;
  if (/verify you are human/i.test(s.slice(0, 800))) return true;
  return false;
}

async function fetchOnce(url) {
  try {
    var res = await Widget.http.get(url, { headers: pageHeaders(), timeout: 20000 });
    var body = res && res.data != null ? String(res.data) : "";
    if (!body) return "";
    if (isChallenge(body)) return "";
    return body;
  } catch (e) {
    return "";
  }
}

// 取页加固（猫源 chigua57.js 2026-11-11 同款）：主域重试一次，再换备用域
// 9527heiliao.top 重试两次；任一通道拿到含 /events/ 的页面即返回（列表页）。
// 详情页不要求含 /events/，只要非空非质询页。
async function fetchText(url, wantEvents) {
  var altUrl = "";
  if (url.indexOf(BASE) === 0) altUrl = ALT_HOST + url.slice(BASE.length);
  var last = "";
  var html = await fetchOnce(url);
  if (html) { if (!wantEvents || html.indexOf("/events/") >= 0) return html; last = html; }
  html = await fetchOnce(url);
  if (html) { if (!wantEvents || html.indexOf("/events/") >= 0) return html; last = html; }
  if (altUrl) {
    html = await fetchOnce(altUrl);
    if (html) { if (!wantEvents || html.indexOf("/events/") >= 0) return html; last = html; }
    html = await fetchOnce(altUrl);
    if (html) { if (!wantEvents || html.indexOf("/events/") >= 0) return html; last = html; }
  }
  if (last) return last;
  throw new Error("空回应");
}

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  return t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
}

// 去掉标题前重复的分类/栏目前缀, 只保留正常片名 (同蜘蛛 cleanTitle)
function cleanTitle(title) {
  var raw = decodeHtml(title);
  if (!raw) return "";
  var prefixes = [
    "AI成人短剧", "成人AI短剧", "每日大赛", "今日吃瓜", "网红黑料",
    "网黄合集", "出轨劈腿", "直播擦边", "社会事件", "明星八卦",
    "热门事件", "热门", "每日大"
  ];
  var out = raw, changed = true, i, p;
  while (changed) {
    changed = false;
    out = t(out);
    for (i = 0; i < prefixes.length; i++) {
      p = prefixes[i];
      if (out.indexOf(p) === 0) {
        out = out.slice(p.length).replace(/^[\s\-_|｜·:：]+/, "");
        changed = true;
        break;
      }
    }
  }
  out = t(out);
  return out || raw;
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return BASE + u;
  return BASE + "/" + u;
}

// 封面走已部署的 57chigua Worker 代理 (CDN 无 Referer 会 403)
function proxyImgUrl(imgUrl) {
  if (!imgUrl) return "";
  if (/workers\.dev/i.test(imgUrl)) return imgUrl;
  return IMG_PROXY + encodeURIComponent(imgUrl);
}

function listUrl(cat, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  cat = t(cat) || "hot";
  if (cat === "home") {
    return page <= 1 ? BASE + "/" : BASE + "/page/" + page + "/";
  }
  var path = BASE + "/" + cat + "/";
  return page > 1 ? path + "?page=" + page : path;
}

function parseList(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<a[^>]+href="\/events\/(\d+)\/"[^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var id = m[1];
    if (seen[id]) continue;
    var body = m[0];
    var im = body.match(/(?:src|data-src|data-original)=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i);
    if (!im) im = body.match(/(?:src|data-src)=["'](\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i);
    if (!im) continue;
    seen[id] = 1;

    var title = "";
    var tm = body.match(/alt=["']([^"']{2,200})["']/i)
      || body.match(/title=["']([^"']{2,200})["']/i)
      || body.match(/<h[123][^>]*>([^<]{2,200})<\/h/i);
    if (tm) title = cleanTitle(tm[1]);
    if (!title) title = "事件 " + id;

    var link = BASE + "/events/" + id + "/";
    var cover = proxyImgUrl(absUrl(im[1]));
    out.push({
      id: link,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: link,
      description: "",
      mediaType: "movie"
    });
  }
  return out;
}

function listOrMsg(html, url) {
  if (!html) return [{ id: "empty", type: "url", title: "空页面" }];
  var list = parseList(html);
  return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var cat = String(params.path || params.cat || "hot");
  var url = listUrl(cat, page);
  try {
    var html = await fetchText(url, true);
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
  var url = BASE + "/search/?q=" + encodeURIComponent(wd);
  if (page > 1) url += "&page=" + page;
  try {
    var html = await fetchText(url, true);
    return listOrMsg(html, url);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// 与蜘蛛 extractPlay 同口径: 先收集全部 m3u8 (HLS), 再收集 mp4, 最后 JSON 字段兜底
function extractPlay(html) {
  var sources = [];
  var seen = {};
  function add(url) {
    url = t(url);
    if (!url || seen[url]) return;
    if (!/^https?:\/\//i.test(url)) return;
    seen[url] = 1;
    sources.push(url);
  }
  var m3 = html.match(/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/gi) || [];
  m3.forEach(add);
  var mp = html.match(/https?:\/\/[^"'\s<>]+\.mp4[^"'\s<>]*/gi) || [];
  mp.forEach(add);
  var fields = html.match(/["'](?:url|play_url|playUrl|src|file|video)["']\s*:\s*["'](https?:\/\/[^"']+)["']/gi) || [];
  fields.forEach(function (f) {
    var um = f.match(/https?:\/\/[^"']+/);
    if (um && /\.(?:m3u8|mp4)/i.test(um[0])) add(um[0]);
  });
  return sources;
}

function extractTitle(html, fallback) {
  var m = html.match(/property=["']og:title["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  if (m) return cleanTitle(m[1]);
  m = html.match(/<h1[^>]*>([^<]{2,200})<\/h1>/i);
  if (m) return cleanTitle(m[1]);
  m = html.match(/<title>([^<]+)<\/title>/i);
  if (m) return cleanTitle(m[1].replace(/\s*[-|_｜].*57.*/, ""));
  return fallback || "";
}

function extractCover(html) {
  var m = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (m) return absUrl(m[1]);
  m = html.match(/(?:src|data-src)=["'](https?:\/\/s\.chigua\.media\/media\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i);
  if (m) return m[1];
  return "";
}

function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    var mm = raw.match(/events\/(\d+)/);
    var vid = mm ? mm[1] : raw.replace(/[^0-9]/g, "");
    if (!vid) {
      return { id: raw || "err", type: "url", title: "解析失败", description: "链接里没有事件 id" };
    }
    var url = BASE + "/events/" + vid + "/";
    var html = await fetchText(url, false);

    var title = extractTitle(html, vid);
    var cover = proxyImgUrl(extractCover(html));
    var sources = extractPlay(html);
    if (!sources.length) {
      // 未解出地址也留一个懒"正片"入口（无 videoUrl 键），点播时 loadResource 重试
      var lazyEp = {
        id: url, type: "url", title: "正片", mediaType: "movie",
        posterPath: cover, link: url, episode: 1, episodeNumber: 1,
        seasonIndex: 1, seasonNumber: 1, playerType: "system"
      };
      return {
        id: url, type: "detail", title: title || vid, link: url,
        posterPath: cover, coverUrl: cover, backdropPath: cover,
        description: "未找到播放地址",
        episodes: [{ name: "正片", link: url }],
        seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: [{ title: "正片", episodeNumber: 1 }] }],
        episodeItems: [lazyEp],
        childItems: [lazyEp]
      };
    }
    // sources[0] 优先 HLS (m3u8 先收集)，与蜘蛛线路顺序一致；详情直接出集
    var epItem = {
      id: url, type: "url", title: "正片", mediaType: "movie",
      posterPath: cover, link: url, episode: 1, episodeNumber: 1,
      seasonIndex: 1, seasonNumber: 1, playerType: "system",
      videoUrl: sources[0],
      customHeaders: { "User-Agent": UA, "Referer": BASE + "/" }
    };
    return {
      id: url,
      type: "detail",
      title: title || vid,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: sources[0],
      playerType: "system",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE + "/"
      },
      episodes: [{ name: "正片", link: url }],
      seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: [{ title: "正片", videoUrl: sources[0], episodeNumber: 1 }] }],
      episodeItems: [epItem],
      childItems: [epItem]
    };
  } catch (e) {
    return { id: String(unwrapLink(link) || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// 播放源解析（stream 模块，回落用）：App 把集 videoUrl 当 link 传时直链原样回行；
// 否则重抓详情页取新地址。全部 try/catch，永不抛错。
async function loadResource(params) {
  try {
    var raw = unwrapLink(params);
    if (!raw && params && typeof params === "object") raw = unwrapLink(params.link) || unwrapLink(params.url) || unwrapLink(params.id) || unwrapLink(params.item);
    if (!raw) return [];
    if (/\.m3u8/i.test(raw) || /\.mp4/i.test(raw)) {
      return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": BASE + "/" } }];
    }
    var mm = raw.match(/events\/(\d+)/);
    var vid = mm ? mm[1] : raw.replace(/[^0-9]/g, "");
    if (!vid) return [];
    var url = BASE + "/events/" + vid + "/";
    var html = await fetchText(url, false);
    var sources = extractPlay(html);
    var out = [];
    for (var i = 0; i < sources.length; i++) {
      out.push({ name: i === 0 ? "播放" : "线路" + (i + 1), url: sources[i], playerType: "system", customHeaders: { "User-Agent": UA, "Referer": BASE + "/" } });
    }
    return out;
  } catch (e) {
    return [];
  }
}
