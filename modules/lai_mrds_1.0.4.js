// v1.0.4：AVDB 样式详情：分类小卡片 genreItems + 点按路由（D 组，只做分类）
// 每日大赛 for REX (lai_mrds v1.0.3)
// v1.0.3（2026-11-16）：根因——列表/详情/搜索全是纯直连 Widget.http.get；
//   站方走 CloudFront、按出口/IP 指纹拦手机直连（猫源 mrds.js 2026-11-11 夜修
//   已坐实：VM 直连正常、手机直连挂满超时；Jina 等数据中心出口能取到真页）。
//   修法：照搬猫源并行竞速（javrate v10 模式）——mrds-fetch Worker 腿（已实测：
//   首页 200/260KB/1.6s、分类 200/227KB/1.3s、详情 200/181KB/1.6s）与直连腿
//   同时跑，谁先拿到真页用谁；直连挂超时不再烧 App 预算。另补两点：① loadDetail
//   未 unwrap 对象入参（REX 运行时传卡片对象，String(对象) 得 "[object Object]"，
//   详情必失败——harness 复现）；② parseArticles 补 img 兜底（loadBannerDirect
//   消失时取块内 img）；③ proxyCover 只把白名单加密图床送 bagua 代理，其余
//   非 pic 图直连（bagua 代理白名单外一律 400）。
// v1.0.2（2026-11-15）：根因——loadDetail 只回顶层 videoUrl，没有 episodes/
//   seasons/episodeItems，详情页渲染不出可点播入口，用户看是"加载不出内容"
//   （harness 复现：episodes [] / episodeItems []，videoUrl 本身已解出）。
//   修法：详情直接出集——中转（javsb-relay /m3u8）+ 直连两行，每集 episodeItem
//   的 videoUrl 即最终地址、playerType "system"；顶层 videoUrl 同为中转行。
//   未解出地址时仍留一个懒"正片"入口（无 videoUrl 键），点播走 loadResource
//   重新抓页取新地址；新增 loadResource（stream 模块，全部 try/catch、永不抛错）。
// 来源：mira-cat 蜘蛛 py_mrds（由 REX rex.mrds 转换回猫源的同源逻辑），站点 https://www.mrds66.com (WordPress)。
// 列表/分类/搜索均解析文章卡（封面走 bagua-img-proxy），详情页 data-config JSON 内含
// video.url（原画，m3u8）与 video_h265.url 两条流，loadDetail 按蜘蛛顺序取原画。

WidgetMetadata = {
  id: "lai_mrds",
  title: "每日大赛",
  description: "每日大赛（mrds66.com）：21 个栏目分类、关键词搜索，详情实时解析 m3u8",
  author: "lai",
  version: "1.0.4",
  requiredVersion: "0.0.1",
  site: "https://www.mrds66.com",
  detailCacheDuration: 180,
  modules: [
    { title: "最新更新", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "每日大赛", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "mrds" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "主题大赛", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "ztds" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "热搜吃瓜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "rstt" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "校园学生", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "xazd" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "必撸大赛", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "blyp" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "反差泄密", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "fctg" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "网红黑料", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "mhds" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "猎奇重口", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "lqdp" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "AV看片", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "jdsj" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "明星大赛", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "mxwh" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "动漫之家", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "smdh" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "影视国漫", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "dypd" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "cos写真", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "mtds" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "声控ASMR", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "ysds" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "寸止挑战", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "czds" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "混剪PMV", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "hjds" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "原创投稿", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "tgds" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "欧美精品", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "omjp" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "全网参赛", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "qwcs" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "AI剧场", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "aijc" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    {
      id: "loadResource",
      title: "每日大赛播放源",
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

var BASE = "https://www.mrds66.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
var RELAY_M3U8 = "https://javsb-relay.li768435813.workers.dev/m3u8?u=";
var IMG_PROXY = "https://bagua-img-proxy.li768435813.workers.dev/img?url=";
var IMG_PROXY_51 = "https://51chigua.li768435813.workers.dev/img?url=";
// 取页 Worker（与猫源 mrds.js 同款，已部署、已实测可用）：只取 HTML，不碰视频流。
var FETCH_WORKER = "https://mrds-fetch.li768435813.workers.dev";
// 封面按域路由：pic.*.cn 加密图床走 51chigua 解密；已知加密图床（jtzatly/drleao）
// 走 bagua 解密；其余（站内图、明文图）直接回原地址——bagua 代理白名单外一律 400，
// 绝不能把非白名单图送进去。
function proxyCover(url) {
  var s = String(url || "").trim();
  if (!s) return "";
  if (s.indexOf("data:") === 0) return s;
  if (s.indexOf("bagua-img-proxy") >= 0) return s;
  if (s.indexOf("51chigua") >= 0) return s;
  var abs = s;
  if (/^\/\//.test(abs)) abs = "https:" + abs;
  else if (/^\//.test(abs)) abs = BASE + abs;
  else if (!/^https?:\/\//i.test(abs)) abs = BASE + "/" + abs;
  var host = "";
  try { host = abs.split("/")[2] || ""; } catch (e) {}
  if (/^pic\.(jtzatly|drleao)\.cn$/i.test(host)) return IMG_PROXY + encodeURIComponent(abs);
  if (/^pic\.[^/]*\.cn$/i.test(host)) return IMG_PROXY_51 + encodeURIComponent(abs);
  return abs;
}

var CATS = {
  latest: "最新更新", mrds: "每日大赛", ztds: "主题大赛", rstt: "热搜吃瓜", xazd: "校园学生",
  blyp: "必撸大赛", fctg: "反差泄密", mhds: "网红黑料", lqdp: "猎奇重口", jdsj: "AV看片",
  mxwh: "明星大赛", smdh: "动漫之家", dypd: "影视国漫", mtds: "cos写真", ysds: "声控ASMR",
  czds: "寸止挑战", hjds: "混剪PMV", tgds: "原创投稿", omjp: "欧美精品", qwcs: "全网参赛", aijc: "AI剧场"
};

function t(v) {
  return String(v == null ? "" : v).trim().replace(/\s+/g, " ");
}

function pageHeaders() {
  return { "User-Agent": UA, "Referer": BASE + "/" };
}

// 真页判定（猫源 mrds.js 同款）：够大 + 无质询串 + 含 <article> 或 data-config；
// 质询页/403 错误页/空页一律算失败，绝不把假页当内容解析。
function looksReal(html) {
  var s = String(html || "");
  if (!s || s.length < 2000) return false;
  if (/Just a moment|Attention Required|Access Denied|cf-challenge|challenges\.cloudflare\.com/i.test(s)) return false;
  return /<article\b/i.test(s) || /data-config=/.test(s);
}

function isChallenge(html) {
  var s = String(html || "");
  return /Just a moment|Attention Required|cf-challenge|challenges\.cloudflare\.com/i.test(s);
}

async function fetchOnce(url, timeout) {
  try {
    var res = await Widget.http.get(url, { headers: pageHeaders(), timeout: timeout || 10000 });
    return res && res.data != null ? String(res.data) : "";
  } catch (e) {
    return "";
  }
}

// 取页：并行竞速（猫源 mrds.js 同款，javrate v10 模式）——mrds-fetch Worker 腿
// （已实测约 2 秒）与直连腿同时跑，谁先拿到真页用谁；直连在手机上被拦时是挂满
// 超时而非快速失败，串行先直连会把 App 的等待预算烧完、Worker 腿来不及跑。
async function fetchHtml(url) {
  var workerUrl = FETCH_WORKER + "/f/?u=" + encodeURIComponent(url);
  var html = await new Promise(function (resolve) {
    var done = false;
    var pending = 2;
    var fallback = "";
    function finish(h) {
      if (done) return;
      if (looksReal(h)) { done = true; resolve(h); return; }
      if (h) fallback = h;
      if (--pending === 0) { done = true; resolve(fallback); }
    }
    fetchOnce(workerUrl, 8000).then(finish, function () { finish(""); });
    fetchOnce(url, 5000).then(finish, function () { finish(""); });
  });
  if (!html) throw new Error("空回应");
  if (isChallenge(html)) throw new Error("被 Cloudflare 拦截，请稍后重试");
  return html;
}

// 与蜘蛛 parseArticles 相同的正则解析：article 块内取 /archives/<id> 链接、标题与 loadBannerDirect 封面
function parseArticles(html) {
  var items = [];
  var seen = {};
  var re = /<article\b[^>]*>([\s\S]*?)<\/article>/gi;
  var m;
  while ((m = re.exec(html))) {
    var block = m[1];
    var lm = /<a[^>]*href="(\/archives\/\d+\/?)"[^>]*>/.exec(block);
    if (!lm) continue;
    var link = BASE + lm[1];
    if (seen[link]) continue;
    seen[link] = 1;
    var title = "";
    var hm = /<h2 class="post-card-title"[^>]*>([\s\S]*?)<\/h2>/i.exec(block);
    if (hm) {
      var raw = hm[1];
      var cut = raw.search(/<div/i);
      title = t((cut >= 0 ? raw.slice(0, cut) : raw).replace(/<[^>]*>/g, " "));
    }
    if (!title) continue;
    var cover = "";
    var cm = /loadBannerDirect\('([^']+)'/.exec(block);
    if (cm) cover = proxyCover(cm[1].replace(/([^:])\/{2,}/g, "$1/"));
    if (!cover) {
      // 兜底（猫源同款）：loadBannerDirect 消失时取块内 img（data-src 优先）
      var im = block.match(/<img[^>]*(?:data-src|src)\s*=\s*"([^"]+)"/i);
      if (im && /^https?:\/\//i.test(im[1]) && !/data:image/i.test(im[1])) cover = proxyCover(im[1]);
    }
    items.push({ link: link, title: title, cover: cover });
  }
  return items;
}

function toCards(items) {
  return items.map(function (it) {
    return {
      id: it.link,
      type: "url",
      title: it.title,
      posterPath: it.cover,
      coverUrl: it.cover,
      backdropPath: it.cover,
      link: it.link,
      description: "",
      mediaType: "movie"
    };
  });
}

async function loadList(params) {
  params = params || {};
  var id = String(params.cat || params.path || "latest");
  if (!CATS[id]) id = "latest";
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var url;
  if (id === "latest") {
    url = page <= 1 ? BASE + "/" : BASE + "/page/" + page + "/";
  } else {
    url = page <= 1 ? BASE + "/category/" + id + "/" : BASE + "/category/" + id + "/" + page + "/";
  }
  try {
    var html = await fetchHtml(url);
    var list = toCards(parseArticles(html));
    return list.length ? list : [{ id: "empty", type: "url", title: "没有更多内容" }];
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
  var kw = t(pickKeyword(params));
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!kw) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var url = page <= 1
    ? BASE + "/search/" + encodeURIComponent(kw) + "/"
    : BASE + "/search/" + encodeURIComponent(kw) + "/" + page + "/";
  try {
    var html = await fetchHtml(url);
    var list = toCards(parseArticles(html));
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

// 详情页 data-config JSON：{ video: {url}, video_h265: {url} }
function extractVideo(html) {
  var m = /data-config=(["'])([\s\S]*?)\1/.exec(html);
  if (!m) return null;
  try {
    var cfg = JSON.parse(m[2]);
    var out = {};
    if (cfg.video && cfg.video.url) out.url = cfg.video.url;
    if (cfg.video_h265 && cfg.video_h265.url) out.h265 = cfg.video_h265.url;
    return out.url ? out : null;
  } catch (e) { return null; }
}

// ---- AVDB 样式详情：分类小卡片（点按出该分类的全部内容）----
var TAX_GENRE_RE = /\/(genres?|tags?|categor(?:y|ies)|labels?|makers?)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)|labels?|makers?|all|全部|分类|标签|题材|片商)$/i;
function taxAbsLink(href) {
  var s = String(href || "").split("#")[0];
  if (/^https?:\/\//i.test(s)) return s;
  if (s.charAt(0) === "/") return BASE + s;
  return BASE + "/" + s;
}
function extractGenreItemsFromHtml(html) {
  var out = [];
  var seen = {};
  var baseHost = String(BASE || "").replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  html = String(html || "");
  while ((m = re.exec(html)) !== null) {
    var href = m[1] || "";
    var name = String(m[2] || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (!name || name.length > 40 || TAX_NAV_NAME_RE.test(name)) continue;
    var abs = taxAbsLink(href);
    if (!/^https?:\/\//i.test(abs)) continue;
    var host = abs.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (baseHost && host !== baseHost) continue;
    if (!TAX_GENRE_RE.test(abs)) continue;
    var after = abs.split(/\/(?:genres?|tags?|categor(?:y|ies)|labels?|makers?)\//i)[1] || "";
    after = after.split("?")[0].split("#")[0].replace(/\/+$/, "");
    if (!after) continue;
    if (seen[abs]) continue;
    seen[abs] = 1;
    out.push({ id: abs, title: name });
    if (out.length >= 20) break;
  }
  return out;
}

async function loadDetail(link) {
  var url = unwrapLink(link);
  try {
    if (!/^https?:\/\//i.test(url)) throw new Error("参数错误");
    // AVDB 样式：点按分类（/category/<id>/）→ 该分类的全部文章。
    var catM = url.match(/\/category\/([^/?#]+)\/?/i);
    if (catM) {
      var catId = catM[1];
      var catName = CATS[catId] || catId;
      var catWorks = [];
      try {
        if (CATS[catId]) catWorks = await loadList({ cat: catId, page: 1 });
        else catWorks = await search({ keyword: catId, page: 1 });
      } catch (e) { catWorks = []; }
      if (!Array.isArray(catWorks)) catWorks = [];
      var catReal = catWorks.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
      return {
        id: url,
        type: "detail",
        mediaType: "movie",
        title: catName,
        link: url,
        description: "分类 · 共 " + catReal.length + " 部作品",
        videoUrl: "",
        childItems: [],
        relatedItems: catReal.length ? catReal : catWorks
      };
    }
    var html = await fetchHtml(url);
    var taxGenres = extractGenreItemsFromHtml(html);
    var title = "";
    var tm = /<meta[^>]*property="og:title"[^>]*content="([^"]*)"/i.exec(html);
    if (tm) title = t(tm[1]);
    // 详情封面与蜘蛛一致留空（站方 og:image 只是主题默认图）；列表卡封面即为该文封面
    var cover = "";
    var video = extractVideo(html);
    if (!video || !video.url) {
      // 未解出地址也留一个懒入口（无 videoUrl 键），点播时 loadResource 重新抓页
      var lazyEp = {
        id: url, type: "url", title: "正片", mediaType: "movie",
        posterPath: cover, link: url, episode: 1, episodeNumber: 1,
        seasonIndex: 1, seasonNumber: 1, playerType: "system"
      };
      var lazyRet = {
        id: url,
        type: "detail",
        title: title || "每日大赛",
        link: url,
        posterPath: cover,
        coverUrl: cover,
        backdropPath: cover,
        episodes: [{ name: "正片", link: url }],
        seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: [{ title: "正片", episodeNumber: 1 }] }],
        episodeItems: [lazyEp],
        childItems: [lazyEp]
      };
      if (taxGenres.length) lazyRet.genreItems = taxGenres;
      return lazyRet;
    }
    var direct = video.url;
    var rows = playRows(direct);
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    for (var i = 0; i < rows.length; i++) {
      var label = rows[i].name;
      eps.push({ name: label, link: rows[i].url });
      seasonEps.push({ title: label, episodeNumber: i + 1 });
      epItems.push({
        id: rows[i].url,
        type: "url",
        title: label,
        mediaType: "movie",
        posterPath: cover,
        link: rows[i].url,
        episode: i + 1,
        episodeNumber: i + 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system",
        videoUrl: rows[i].url,
        customHeaders: { "User-Agent": UA, "Referer": BASE + "/" }
      });
    }
    var ret = {
      id: url,
      type: "detail",
      title: title || "每日大赛",
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: rows[0].url,
      playerType: "system",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE + "/"
      },
      episodes: eps,
      seasons: [{ seasonNumber: 1, title: "播放", name: "播放", episodes: seasonEps }],
      episodeItems: epItems,
      childItems: epItems
    };
    if (taxGenres.length) ret.genreItems = taxGenres;
    return ret;
  } catch (e) {
    // 取页失败也留一个懒"正片"入口（无 videoUrl 键），点播时 loadResource 重试
    if (/^https?:\/\//i.test(url || "")) {
      var lazyEp2 = {
        id: url, type: "url", title: "正片", mediaType: "movie",
        posterPath: "", link: url, episode: 1, episodeNumber: 1,
        seasonIndex: 1, seasonNumber: 1, playerType: "system"
      };
      return {
        id: url, type: "detail", title: "每日大赛", link: url,
        posterPath: "", coverUrl: "", backdropPath: "",
        description: "请求错误：" + String((e && e.message) || e),
        episodes: [{ name: "正片", link: url }],
        seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: [{ title: "正片", episodeNumber: 1 }] }],
        episodeItems: [lazyEp2], childItems: [lazyEp2]
      };
    }
    return { id: url || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// .m3u8 走 javsb-relay /m3u8 中转在前、直连兜底；非 m3u8 单行直连。
function playRows(direct) {
  if (/\.m3u8/i.test(direct)) {
    return [
      { name: "中转", url: RELAY_M3U8 + encodeURIComponent(direct) },
      { name: "直连", url: direct }
    ];
  }
  return [{ name: "播放", url: direct }];
}

function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

// 播放源解析：App 把集 videoUrl 当 link 传时直接回行；否则重抓详情页取新地址。
// 全部 try/catch，永不抛错；解不出才回 []。
async function loadResource(params) {
  try {
    var raw = unwrapLink(params);
    if (!raw && params && typeof params === "object") {
      raw = unwrapLink(params.link) || unwrapLink(params.url) || unwrapLink(params.id) || unwrapLink(params.item);
    }
    if (!raw) return [];
    if (/\.m3u8/i.test(raw) || /\.mp4/i.test(raw)) {
      return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": BASE + "/" } }];
    }
    if (/^https?:\/\//i.test(raw)) {
      var html = await fetchHtml(raw);
      var video = extractVideo(html);
      if (!video || !video.url) return [];
      var rows = playRows(video.url);
      var out = [];
      for (var i = 0; i < rows.length; i++) {
        out.push({ name: rows[i].name, url: rows[i].url, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": BASE + "/" } });
      }
      return out;
    }
    return [];
  } catch (e) {
    return [];
  }
}
