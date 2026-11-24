// v1.0.3：AVDB 样式详情：分类小卡片 genreItems + 点按路由（详情页提取分类链接，点按打开该分类全部内容）
// 57吃瓜 for REX (lai_chigua57 v1.0.2)
// v1.0.2（2026-11-22）：根因坐实——上游 57cg4.com 详情页 TTFB 恶化到 4–26 秒以上
//   （VM 实测 4.6/15.9/23.0/26.3 秒 + 一次 30 秒超时；13306 详情主域 26.3 秒、
//   备用域 14.6 秒），而 fetchText 顺序重试 4×20 秒=82 秒仍拿不到页，harness 复现
//   detail 13306 耗时 81.7 秒回“请求错误”、集为空（即用户看到的“一直加载 / 解析不
//   出来线路地址”）。修法：① 主域 + 备用域并行竞速，先拿到可用页的腿获胜，单腿
//   超时放宽到 30 秒，最坏约 30 秒、典型 4–6 秒；② 详情页不再要求正文含 /events/
//   （列表/搜索仍要求）；③ 多集合集事件（如 13619“1-6”）按 <video data-hls-src>
//   顺序出各集（第1集…第N集），标题带“第N集”时该集为主地址，单集事件仍为“正片”。
//   播单/分片链本身健康（m3u8 200 + 分片 Range 206 首字节 0x47 真 TS，须带 Referer，
//   模块已随集带 customHeaders），封面 Worker 正常（暖机后 2–3.5 秒）。
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
  version: "1.0.3",
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
    var res = await Widget.http.get(url, { headers: pageHeaders(), timeout: 30000 });
    var body = res && res.data != null ? String(res.data) : "";
    if (!body) return "";
    if (isChallenge(body)) return "";
    return body;
  } catch (e) {
    return "";
  }
}

// 取页：主域 + 备用域并行竞速，先拿到可用页面的腿获胜；失败的腿不提前结束竞速。
// 上游详情页 TTFB 已恶化到 4–26 秒以上（2026-11-22 实测），顺序重试 4×20 秒=82 秒
// 仍拿不到页；竞速把最坏情况压到单腿 30 秒，典型 4–6 秒。
// wantEvents 为真时只接受含 /events/ 的页面（列表/搜索）；详情页为假，
// 只要非空非质询页即接受（详情页不一定含其它 /events/ 链接，旧逻辑会白烧全部重试）。
function fetchRace(urls, wantEvents) {
  return new Promise(function (resolve) {
    var remaining = urls.length;
    var last = "";
    if (!remaining) { resolve(""); return; }
    urls.forEach(function (u) {
      fetchOnce(u).then(function (html) {
        if (html) last = html;
        if (html && (!wantEvents || html.indexOf("/events/") >= 0)) { resolve(html); return; }
        remaining--;
        if (remaining <= 0) resolve(last);
      }, function () {
        remaining--;
        if (remaining <= 0) resolve(last);
      });
    });
  });
}

async function fetchText(url, wantEvents) {
  var altUrl = "";
  if (url.indexOf(BASE) === 0) altUrl = ALT_HOST + url.slice(BASE.length);
  var urls = [url];
  if (altUrl) urls.push(altUrl);
  var html = await fetchRace(urls, wantEvents);
  if (html) return html;
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

// 详情页 <video data-hls-src + data-fallback-src> 按顺序即各集（多集合集事件如
// “1-6”一页含 6 个 <video>，与 JSON-LD VideoObject、m3u8 正则顺序一致）；
// 无 <video> 标签时退回 m3u8/mp4 正则（文档顺序）。返回 [{hls, mp4}]。
function extractEpisodes(html) {
  var eps = [];
  var re = /<video[^>]+data-hls-src=["']([^"']+)["'][^>]*>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var fb = m[0].match(/data-fallback-src=["']([^"']+)["']/i);
    eps.push({ hls: t(m[1]), mp4: fb ? t(fb[1]) : "" });
  }
  if (!eps.length) {
    var srcs = extractPlay(html);
    var i;
    for (i = 0; i < srcs.length; i++) {
      if (/\.m3u8/i.test(srcs[i])) eps.push({ hls: srcs[i], mp4: "" });
    }
    if (!eps.length) {
      for (i = 0; i < srcs.length; i++) {
        if (/\.mp4/i.test(srcs[i])) eps.push({ hls: "", mp4: srcs[i] });
      }
    }
  }
  return eps;
}

// 标题里的集号，如“催眠眼镜 第12集”→12；无则 0
function titleEpisodeNo(title) {
  var m = String(title || "").match(/第\s*(\d+)\s*集/);
  return m ? parseInt(m[1], 10) : 0;
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

// ---- AVDB 样式详情：分类小卡片（点按出该分类全部内容）----
// v1.0.3：详情页提取分类链接建成 genreItems；点按分类后 loadDetail 走分类分支返回该分类全部内容。
var TAX_GENRE_RE = /\/(genres?|tags?|category|categor(?:y|ies)|labels?|makers?)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)?|labels?|makers?|all|全部|分类|标签|题材)$/i;
var TAX_BARE_RE = /^(?!(search|page|events?|login|register|upload|dmca|contact|about|privacy|terms|tag|tags|category|categories|video|videos|home|sitemap|rss|feed|soaring|popularity|latest|new|release)$)[a-z][a-z0-9_-]{1,30}$/i;

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
    var abs = absUrl(href);
    if (!/^https?:\/\//i.test(abs)) continue;
    var host = abs.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (baseHost && host !== baseHost) continue;
    var pth = abs.replace(/^https?:\/\/[^\/]+/, "").split("?")[0].split("#")[0];
    var segs = pth.split("/").filter(function (s) { return s !== ""; });
    var ok = false;
    if (segs.length === 1 && TAX_BARE_RE.test(segs[0])) ok = true;
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
    var raw = unwrapLink(link);
    // AVDB 样式：点按分类小卡片 → 打开该分类的全部内容。
    if (TAX_BARE_RE.test(taxSlugOf(raw))) {
      var taxSlug = taxSlugOf(raw);
      var taxName = taxSlug;
      try { taxName = decodeURIComponent(taxSlug); } catch (e) {}
      var taxWorks = await loadList({ path: taxSlug, page: 1 });
      if (!Array.isArray(taxWorks)) taxWorks = [];
      var taxReal = taxWorks.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
      return {
        id: raw,
        type: "detail",
        mediaType: "movie",
        title: taxName || "分类",
        link: raw,
        description: "分类 · 共 " + taxReal.length + " 部作品",
        videoUrl: "",
        childItems: [],
        relatedItems: taxReal.length ? taxReal : taxWorks
      };
    }
    var mm = raw.match(/events\/(\d+)/);
    var vid = mm ? mm[1] : raw.replace(/[^0-9]/g, "");
    if (!vid) {
      return { id: raw || "err", type: "url", title: "解析失败", description: "链接里没有事件 id" };
    }
    var url = BASE + "/events/" + vid + "/";
    var html = await fetchText(url, false);
    taxGenres = extractGenreFromHtml(html);

    var title = extractTitle(html, vid);
    var cover = proxyImgUrl(extractCover(html));
    var eps = extractEpisodes(html);
    if (!eps.length) {
      // 未解出地址也留一个懒"正片"入口（无 videoUrl 键），点播时 loadResource 重试
      var lazyEp = {
        id: url, type: "url", title: "正片", mediaType: "movie",
        posterPath: cover, link: url, episode: 1, episodeNumber: 1,
        seasonIndex: 1, seasonNumber: 1, playerType: "system"
      };
      return taxDetailRet({
        id: url, type: "detail", title: title || vid, link: url,
        posterPath: cover, coverUrl: cover, backdropPath: cover,
        description: "未找到播放地址",
        episodes: [{ name: "正片", link: url }],
        seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: [{ title: "正片", episodeNumber: 1 }] }],
        episodeItems: [lazyEp],
        childItems: [lazyEp]
      }, taxGenres);
    }
    // 多集按 <video> 顺序出各集（HLS 优先、mp4 兜底）；标题带“第N集”时该集为主地址；
    // 单集仍为“正片”。详情直接给真 videoUrl，点播不再现取。
    var epNo = titleEpisodeNo(title);
    var primary = (epNo >= 1 && epNo <= eps.length) ? epNo - 1 : 0;
    var multi = eps.length > 1;
    var epItems = [];
    var seasonEps = [];
    var i;
    for (i = 0; i < eps.length; i++) {
      var eu = eps[i].hls || eps[i].mp4;
      if (!eu) continue;
      var en = multi ? ("第" + (i + 1) + "集") : "正片";
      epItems.push({
        id: url, type: "url", title: en, mediaType: "movie",
        posterPath: cover, link: url, episode: i + 1, episodeNumber: i + 1,
        seasonIndex: 1, seasonNumber: 1, playerType: "system",
        videoUrl: eu,
        customHeaders: { "User-Agent": UA, "Referer": BASE + "/" }
      });
      seasonEps.push({ title: en, videoUrl: eu, episodeNumber: i + 1 });
    }
    var primaryUrl = (eps[primary].hls || eps[primary].mp4) || (eps[0].hls || eps[0].mp4);
    return taxDetailRet({
      id: url,
      type: "detail",
      title: title || vid,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: primaryUrl,
      playerType: "system",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE + "/"
      },
      episodes: epItems.map(function (e) { return { name: e.title, link: url }; }),
      seasons: [{ seasonNumber: 1, title: multi ? "选集" : "正片", name: multi ? "选集" : "正片", episodes: seasonEps }],
      episodeItems: epItems,
      childItems: epItems
    }, taxGenres);
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
    var eps = extractEpisodes(html);
    var out = [];
    for (var i = 0; i < eps.length; i++) {
      var eu = eps[i].hls || eps[i].mp4;
      if (!eu) continue;
      out.push({ name: eps.length > 1 ? ("第" + (i + 1) + "集") : "播放", url: eu, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": BASE + "/" } });
    }
    return out;
  } catch (e) {
    return [];
  }
}
