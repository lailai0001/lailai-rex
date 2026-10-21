// 57吃瓜 for REX (lai_chigua57 v1.0.0)
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
  version: "1.0.0",
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
    { title: "明星八卦", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "star" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
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

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  if (isChallenge(body)) throw new Error("被 Cloudflare 拦截，请稍后重试");
  return body;
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
    var html = await fetchText(url);
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
    var html = await fetchText(url);
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

async function loadDetail(link) {
  try {
    var raw = String(link || "");
    var mm = raw.match(/events\/(\d+)/);
    var vid = mm ? mm[1] : raw.replace(/[^0-9]/g, "");
    if (!vid) {
      return { id: raw || "err", type: "url", title: "解析失败", description: "链接里没有事件 id" };
    }
    var url = BASE + "/events/" + vid + "/";
    var html = await fetchText(url);

    var title = extractTitle(html, vid);
    var cover = proxyImgUrl(extractCover(html));
    var sources = extractPlay(html);
    if (!sources.length) {
      return { id: url, type: "url", title: title || "解析失败", description: "未找到播放地址" };
    }
    // sources[0] 优先 HLS (m3u8 先收集), 与蜘蛛线路顺序一致
    return {
      id: url,
      type: "detail",
      title: title || vid,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: sources[0],
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE + "/"
      }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
