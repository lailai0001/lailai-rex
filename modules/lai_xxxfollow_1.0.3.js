// XXXFollow for REX（移植自 mira-cat 蜘蛛 xxxfollow.js / py_xxxfollow，只读蓝图）
// v1.0.3（AVDB 样式详情，真站页核实）：详情页标签建成 genreItems（post.tags
//   权威 10 个 + HTML 锚点）+ 点按路由；新增 peoples=发帖作者（post.user，
//   带头像，点按取作者页 /<username>，实测 aalisaa 页 20 条全是本人）；
//   修 extractPost：真站 __PRELOAD_STATE__ 无尾分号，旧正则全灭，改平衡
//   大括号扫描；全覆盖派发（loadList 接 peopleId/genreId，loadDetail 接裸名/token）。
// v1.0.2（AVDB 样式详情）：详情页标签建成 genreItems（/tag/ 链接与正文 #话题）+ 点按路由；演员按通用模式扫描。
// 后端：https://www.xxxfollow.com，列表页 HTML 锚点解析；详情页取
// window.__PRELOAD_STATE__ 中 post-* 的 media 数据（与蜘蛛完全同口径）。
// 播放：单条直链 MP4，按 UHD > 原画(url) > FHD > SD 选最高档；
// 搜索沿用蜘蛛口径：关键词按标签 slug 查 /tag/<keyword>。
// v1.0.1（2026-11-09，分辨率选择）：bestPlayUrl 只返最高档 →
//   allPlayUrls 四档非空全返（UHD/原画/FHD/SD），loadDetail 每档一集，
//   seasons/episodes + episodeItems 每集带 videoUrl 对应字段直链。

WidgetMetadata = {
  id: "lai_xxxfollow",
  title: "XXXFollow",
  description: "XXXFollow：最新/热门视频与标签分类，详情直出最高画质 MP4",
  author: "lai",
  version: "1.0.3",
  requiredVersion: "0.0.1",
  site: "https://www.xxxfollow.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "最新视频",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/videos" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "热门视频",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/most-popular" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "Teen 18+",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/tag/teen-18" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "FastFap",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/tag/fastfap" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "自慰",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/tag/masturbation" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "亚洲",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/tag/asian" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "日本",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/tag/japanese" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "中国",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/tag/chinese" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "搜索",
      functionName: "search",
      cacheDuration: 60,
      params: [
        { name: "keyword", title: "标签", type: "input", value: "" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    }
  ],
  search: {
    title: "搜索",
    functionName: "search",
    params: [
      { name: "keyword", title: "标签", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

var BASE = "https://www.xxxfollow.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8",
    "Referer": BASE
  };
}

function playHeaders() {
  return {
    "User-Agent": UA,
    "Referer": BASE + "/"
  };
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function absUrl(href) {
  var s = String(href || "");
  if (/^https?:\/\//i.test(s)) return s;
  if (s.charAt(0) === "/") return BASE + s;
  return BASE + "/" + s;
}

function pathOf(url) {
  return String(url || "").replace(/^https?:\/\/[^/]+/i, "").split("?")[0].split("#")[0];
}

// ---- 列表解析（与蜘蛛 category/search 同口径，另按 href 去重） ----

function parseCards($) {
  var out = [];
  var seen = {};
  $('a[href*="/"]').each(function (i, el) {
    var $el = $(el);
    var href = $el.attr("href");
    if (!href) return;
    var path = pathOf(href);
    if (!/\/\d+/.test(path)) return;
    if (path.indexOf("/tag/") === 0 || path.indexOf("/search/") === 0 || path.indexOf("/support/") === 0) return;
    var $img = $el.find("img").first();
    // 作者页锚点是空的（<a></a>），图在同级内容 div 里，往父级找
    if (!$img.length) $img = $el.parent().find("img").first();
    var pic = $img.attr("src") || $img.attr("data-src");
    if (!pic) return;
    var title = $el.text().trim();
    if (!title) title = $img.attr("alt") || "";
    title = title ? title.replace(/[\n\t]/g, "").replace(/\s+/g, " ").trim() : "Unknown";
    if (!title) title = "Unknown";
    // 图片 alt 形如 "<标题> by <作者>"，去掉尾部作者名
    var un = path.split("/")[1] || "";
    if (un) {
      var suf = " by " + un;
      if (title.length > suf.length && title.slice(title.length - suf.length) === suf) title = title.slice(0, title.length - suf.length);
    }
    var link = absUrl(href);
    if (seen[link]) return;
    seen[link] = true;
    out.push({
      id: link,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: "",
      mediaType: "movie"
    });
  });
  return out;
}

function listUrl(path, page) {
  var url = BASE + path;
  if (page > 1) url += "?page=" + page;
  return url;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var path = String(params.path || "/videos");
  // 全覆盖派发：App 点 peoples/genreItems 可能调 loadList（peopleId/genreId/url/link/id/title/name）
  var ent = params.peopleId || params.genreId || params.url || params.link || params.id || params.title || params.name || "";
  ent = String(ent || "").trim();
  if (ent && !params.path) {
    if (/^https?:\/\//i.test(ent) || ent.indexOf("/") === 0) {
      var eurl = absUrl(ent);
      var epath = pathOf(eurl);
      if (/^\/tag\//i.test(epath)) { path = epath; }
      else if (/^\/[^/]+$/.test(epath) && epath !== "/videos" && epath !== "/most-popular") { path = epath; }
    } else if (ent.indexOf("actor:") === 0) {
      path = "/" + ent.slice(6);
    } else if (ent.indexOf("tag:") === 0) {
      path = "/tag/" + ent.slice(4);
    } else {
      // 裸名：先当作者查，空则当标签查
      try {
        var aw = await loadList({ path: "/" + ent, page: 1 });
        var areal = (Array.isArray(aw) ? aw : []).filter(function (w) { return w && w.id !== "err" && w.id !== "empty" && w.id !== "tip"; });
        if (areal.length) return aw;
      } catch (_) {}
      path = "/tag/" + encodeURIComponent(ent);
    }
  }
  var url = listUrl(path, page);
  try {
    var html = await fetchText(url);
    var $ = Widget.html.load(html);
    var cards = parseCards($);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关视频" }];
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

// 蜘蛛的搜索即标签查：/tag/<keyword>，翻页 ?page=
async function search(params) {
  params = params || {};
  var keyword = pickKeyword(params);
  var page = parseInt(params.page, 10) || 1;
  if (!keyword) {
    return [{ id: "tip", type: "url", title: "输入英文标签后搜索，如 asian" }];
  }
  var url = listUrl("/tag/" + encodeURIComponent(keyword), page);
  try {
    var html = await fetchText(url);
    var $ = Widget.html.load(html);
    var cards = parseCards($);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关视频" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// ---- 详情/播放解析（与蜘蛛 detail 同口径：__PRELOAD_STATE__ 的 post-* 数据） ----

// 真站 __PRELOAD_STATE__ 以 </script> 结尾、无尾分号，旧三正则全灭；
// 改平衡大括号扫描（字符串感知），取第一个 post-* 的 post 对象。
function extractPost(html) {
  var s = String(html || "");
  var ki = s.indexOf("window.__PRELOAD_STATE__");
  if (ki < 0) return null;
  var bi = s.indexOf("{", ki);
  if (bi < 0) return null;
  var depth = 0;
  var inStr = false;
  var esc = false;
  var i = bi;
  for (; i < s.length; i++) {
    var ch = s.charAt(i);
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
    } else {
      if (ch === '"') inStr = true;
      else if (ch === "{") depth++;
      else if (ch === "}") { depth--; if (depth === 0) break; }
    }
  }
  if (depth !== 0) return null;
  var state;
  try { state = JSON.parse(s.slice(bi, i + 1)); } catch (_) { return null; }
  var keys = Object.keys(state);
  for (var k = 0; k < keys.length; k++) {
    if (keys[k].indexOf("post-") === 0 && state[keys[k]] && state[keys[k]].post) {
      return state[keys[k]].post;
    }
  }
  return null;
}

// v1.0.1：四档全返（UHD > 原画 url > FHD > SD，各档可为 null，
// 与蜘蛛的四档字段一致），同地址去重；不再只取最高档。
function allPlayUrls(media) {
  if (!media) return [];
  var defs = [
    { name: "UHD", url: media.uhd_url },
    { name: "原画", url: media.url },
    { name: "FHD", url: media.fhd_url },
    { name: "SD", url: media.sd_url }
  ];
  var out = [];
  var seen = {};
  for (var i = 0; i < defs.length; i++) {
    var u = defs[i].url;
    if (!u || seen[u]) continue;
    seen[u] = 1;
    out.push({ name: defs[i].name, url: u });
  }
  return out;
}

// 挑最高画质：UHD > 原画 url > FHD > SD（各档可为 null，与蜘蛛的四档字段一致）
function bestPlayUrl(media) {
  var all = allPlayUrls(media);
  return all.length ? all[0].url : "";
}

// ---- AVDB 样式详情：演员/分类（点按出对应全部内容）----
// 详情页 HTML 里扫演员/分类链接（站内同源），建成 peoples / genreItems；
// 点按后 loadDetail 走分类页分支（loadList 取该分类的全部影片）。
var TAX_ACTOR_RE = /\/(pornstars?|models?|performer)\//i;
var TAX_GENRE_RE = /\/tag\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)|actress(es)?|actors?|stars?|pornstars?|models?|performers?|channels?|makers?|labels?|all|全部|分类|演员|标签|女优|题材|片商|频道|明星)$/i;

function taxSlugFromUrl(url) {
  var s = String(url || "").split("?")[0].split("#")[0].replace(/\/+$/, "");
  var parts = s.split("/");
  var last = parts[parts.length - 1] || "";
  try { last = decodeURIComponent(last); } catch (_) {}
  return last;
}

function extractTaxonomyFromHtml(html) {
  var peoples = [];
  var genreItems = [];
  var seenP = {};
  var seenG = {};
  var baseHost = String(BASE || "").replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var href = m[1] || "";
    var name = String(m[2] || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    // 站内标签锚点文本带 "#"（"#boobs"），去掉再作名
    name = name.replace(/^#+/, "");
    if (!name || name.length > 40 || /^\d+$/.test(name) || TAX_NAV_NAME_RE.test(name)) continue;
    var abs = absUrl(href);
    if (!/^https?:\/\//i.test(abs)) continue;
    var host = abs.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (baseHost && host !== baseHost) continue;
    var after = abs.split(/\/pornstars?\/|\/models?\/|\/performer\/|\/tag\//i)[1] || "";
    after = after.split("?")[0].split("#")[0].replace(/\/+$/, "");
    if (!after) continue;
    if (TAX_ACTOR_RE.test(abs)) {
      if (seenP[name]) continue;
      seenP[name] = 1;
      peoples.push({ id: abs, title: name, name: name, link: abs, role: "演员" });
    } else if (TAX_GENRE_RE.test(abs)) {
      if (seenG[name]) continue;
      seenG[name] = 1;
      genreItems.push({ id: abs, title: name, link: abs });
    }
    if (peoples.length >= 20 && genreItems.length >= 20) break;
  }
  return { peoples: peoples, genreItems: genreItems };
}

// 点按作者/标签统一收口：回 type detail + relatedItems（真片单）
async function taxDetail(url, displayName, isAuthor) {
  var p = pathOf(url);
  var works = [];
  try { works = await loadList({ path: p, page: 1 }); } catch (_) { works = []; }
  if (!Array.isArray(works)) works = [];
  var real = works.filter(function (w) { return w && w.id !== "err" && w.id !== "empty" && w.id !== "tip"; });
  if (!real.length && displayName) {
    try { var found = await search({ keyword: displayName, page: 1 }); if (Array.isArray(found)) works = found; } catch (_) {}
    real = (Array.isArray(works) ? works : []).filter(function (w) { return w && w.id !== "err" && w.id !== "empty" && w.id !== "tip"; });
  }
  return {
    id: url,
    type: "detail",
    mediaType: "movie",
    title: displayName || taxSlugFromUrl(url),
    link: url,
    description: (isAuthor ? "作者" : "分类") + " · 共 " + real.length + " 部作品",
    videoUrl: "",
    childItems: [],
    relatedItems: real.length ? real : works
  };
}

function isAuthorPath(p) {
  if (!/^\/[^/]+$/.test(p)) return false;
  return p !== "/videos" && p !== "/most-popular" && p !== "/search" && p !== "/support";
}

async function loadDetail(link) {
  // AVDB 样式：点按作者/标签 → 打开该作者/标签的全部帖子。
  var rawIn = (link && typeof link === "object") ? String(link.link || link.id || link.url || "") : String(link || "");
  var url = absUrl(rawIn);
  var upath = pathOf(url);
  if (rawIn.indexOf("actor:") === 0) {
    var aname = rawIn.slice(6);
    return await taxDetail(BASE + "/" + aname, aname, true);
  }
  if (rawIn.indexOf("tag:") === 0 || /\/tag\/[^/?#]+/i.test(url)) {
    var tagM = url.match(/\/tag\/([^/?#]+)/i);
    var tagSlug = tagM ? tagM[1] : rawIn.slice(4);
    try { tagSlug = decodeURIComponent(tagSlug); } catch (_) {}
    var tagName = tagSlug.replace(/-/g, " ");
    return await taxDetail(BASE + "/tag/" + tagSlug, tagName, false);
  }
  if (rawIn && rawIn.indexOf("http") !== 0 && rawIn.indexOf("/") < 0) {
    // 裸名：先当作者查，空则当标签查
    var aw = [];
    try { aw = await loadList({ path: "/" + rawIn, page: 1 }); } catch (_) { aw = []; }
    var areal = (Array.isArray(aw) ? aw : []).filter(function (w) { return w && w.id !== "err" && w.id !== "empty" && w.id !== "tip"; });
    if (areal.length) return await taxDetail(BASE + "/" + rawIn, rawIn, true);
    return await taxDetail(BASE + "/tag/" + encodeURIComponent(rawIn), rawIn, false);
  }
  if (isAuthorPath(upath)) {
    var uname = upath.slice(1);
    try { uname = decodeURIComponent(uname); } catch (_) {}
    return await taxDetail(url, uname, true);
  }
  try {
    var html = await fetchText(url);
    var post = extractPost(html);
    if (!post) {
      return { id: url, type: "url", title: "解析失败", description: "未找到帖子数据" };
    }
    var media = Array.isArray(post.media) ? post.media : [];
    // 蜘蛛固定用 media[0]；这里优先取第一个带视频直链的媒体（图片帖的 media[0] 是图片），
    // media[0] 本身是视频时与蜘蛛完全一致
    var chosen = null;
    for (var i = 0; i < media.length; i++) {
      if (media[i] && bestPlayUrl(media[i]) && media[i].type !== "photo" && media[i].type !== "image") {
        chosen = media[i];
        break;
      }
    }
    var first = media[0] || null;
    var pic = "";
    if (first) pic = first.thumb_url || first.thumb_webp_url || "";
    if (!pic && chosen) pic = chosen.thumb_url || chosen.thumb_webp_url || "";

    var rawTitle = post.text || post.slug || "Unknown";
    var fullText = String(rawTitle).replace(/\s+/g, " ").trim();
    var title = fullText.length > 120 ? fullText.slice(0, 120) : fullText;

    if (!chosen) {
      return {
        id: url,
        type: "url",
        title: title || "解析失败",
        posterPath: pic,
        coverUrl: pic,
        backdropPath: pic,
        description: "未找到播放地址"
      };
    }
    var variants = allPlayUrls(chosen);
    if (!variants.length) {
      return {
        id: url,
        type: "url",
        title: title || "解析失败",
        posterPath: pic,
        coverUrl: pic,
        backdropPath: pic,
        description: "未找到播放地址"
      };
    }
    // v1.0.1：每档一集，seasons[].episodes 与 episodeItems[] 每项都带 videoUrl
    // （对应档位字段直链），REX episodes 数组同步保留作兼容；顶层 videoUrl 仍为最高档。
    var eps = [];
    var sEps = [];
    var items = [];
    for (var vi = 0; vi < variants.length; vi++) {
      eps.push({ name: variants[vi].name, link: variants[vi].url });
      sEps.push({ title: variants[vi].name, videoUrl: variants[vi].url, episodeNumber: vi + 1 });
      items.push({ id: variants[vi].url, type: "url", title: title + " " + variants[vi].name, name: variants[vi].name, mediaType: "movie", seasonNumber: 1, episodeNumber: vi + 1, videoUrl: variants[vi].url, link: variants[vi].url, posterPath: pic, coverUrl: pic });
    }
    var ret = {
      id: url,
      type: "detail",
      title: title,
      link: url,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: fullText,
      videoUrl: variants[0].url,
      playerType: "app",
      episodes: eps,
      seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: sEps }],
      episodeItems: items,
      childItems: items,
      customHeaders: playHeaders()
    };
    var tax = extractTaxonomyFromHtml(html);
    var hashRe = /#([A-Za-z0-9_][A-Za-z0-9_-]*)/g;
    var hm;
    while ((hm = hashRe.exec(fullText)) !== null) {
      var htag = hm[1];
      var hlink = BASE + "/tag/" + htag;
      var dup = false;
      for (var gi = 0; gi < tax.genreItems.length; gi++) { if (tax.genreItems[gi].id === hlink) { dup = true; break; } }
      if (!dup && tax.genreItems.length < 20) tax.genreItems.push({ id: hlink, title: htag, link: hlink });
    }
    // 作者（post.user，带头像）与标签（post.tags，带数字 id）是详情数据的权威来源；
    // HTML 锚点只作补充（真站页实测：post.tags 10 个，HTML 锚点仅 5 个）。
    var u = post.user || null;
    if (u && (u.username || u.display_name)) {
      var uname = u.username || u.display_name;
      var ulink = BASE + "/" + uname;
      var av = u.public_avatar_url || u.fans_avatar_url || "";
      var ppl = { id: ulink, title: u.display_name || uname, name: u.display_name || uname, link: ulink, role: "模特" };
      if (av) ppl.avatar = av;
      ret.peoples = [ppl];
    }
    if (post.tags && Array.isArray(post.tags)) {
      for (var ti = 0; ti < post.tags.length; ti++) {
        var tg = post.tags[ti];
        var tname = tg && (tg.tag || tg.name);
        if (!tname) continue;
        var tlink = BASE + "/tag/" + tname;
        var dup2 = false;
        for (var gj = 0; gj < tax.genreItems.length; gj++) { if (tax.genreItems[gj].id === tlink) { dup2 = true; break; } }
        if (!dup2 && tax.genreItems.length < 20) tax.genreItems.push({ id: tlink, title: tname, link: tlink });
      }
    }
    if (!ret.peoples && tax.peoples.length) ret.peoples = tax.peoples;
    if (tax.genreItems.length) ret.genreItems = tax.genreItems;
    return ret;
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
