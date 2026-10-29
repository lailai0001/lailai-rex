// 每日大赛 for REX (lai_mrds v1.0.0)
// 来源：mira-cat 蜘蛛 py_mrds（由 REX rex.mrds 转换回猫源的同源逻辑），站点 https://www.mrds66.com (WordPress)。
// 列表/分类/搜索均解析文章卡（封面走 bagua-img-proxy），详情页 data-config JSON 内含
// video.url（原画，m3u8）与 video_h265.url 两条流，loadDetail 按蜘蛛顺序取原画。

WidgetMetadata = {
  id: "lai_mrds",
  title: "每日大赛",
  description: "每日大赛（mrds66.com）：21 个栏目分类、关键词搜索，详情实时解析 m3u8",
  author: "lai",
  version: "1.0.1",
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
    { title: "AI剧场", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "aijc" }, { name: "page", title: "页码", type: "page", value: "1" }] }
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
var IMG_PROXY = "https://bagua-img-proxy.li768435813.workers.dev/img?url=";
var IMG_PROXY_51 = "https://51chigua.li768435813.workers.dev/img?url=";
// 封面按域路由（与 mira-cat 蜘蛛同款）：pic.*.cn 图床走 51chigua 解密，其余走 bagua
function proxyCover(url) {
  var s = String(url || "").trim();
  if (!s) return "";
  if (s.indexOf("data:") === 0) return s;
  if (s.indexOf("bagua-img-proxy") >= 0) return s;
  if (s.indexOf("51chigua") >= 0) return s;
  if (/\/\/pic\.[^/]*\.cn\//i.test(s)) return IMG_PROXY_51 + encodeURIComponent(s);
  return IMG_PROXY + encodeURIComponent(s);
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

async function fetchHtml(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders(), timeout: 25000 });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
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

async function loadDetail(link) {
  var url = String(link || "");
  try {
    if (!/^https?:\/\//i.test(url)) throw new Error("参数错误");
    var html = await fetchHtml(url);
    var title = "";
    var tm = /<meta[^>]*property="og:title"[^>]*content="([^"]*)"/i.exec(html);
    if (tm) title = t(tm[1]);
    // 详情封面与蜘蛛一致留空（站方 og:image 只是主题默认图）；列表卡封面即为该文封面
    var cover = "";
    var video = extractVideo(html);
    if (!video || !video.url) {
      return { id: url, type: "url", title: title || "每日大赛", description: "未找到播放地址" };
    }
    return {
      id: url,
      type: "detail",
      title: title || "每日大赛",
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: video.url,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE + "/"
      }
    };
  } catch (e) {
    return { id: url || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
