// v2.0.1：AVDB 样式详情：peoples/genreItems + 点按路由（演员/分类走站内搜索；详情改 type "detail" 以便展示团队/分类）。
WidgetMetadata = {
  id: "getav-v2",
  title: "GetAV",
  version: "2.0.1",
  requiredVersion: "0.0.1",
  description: "GetAV - 高清AV在线",
  author: "rewrite",
  site: "https://getav.me",
  detailCacheDuration: 1800,
  modules: [
    { id: "latest", title: "最近更新", functionName: "loadLatest", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "hot", title: "热门影片", functionName: "loadHot", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "uncensored", title: "无码影片", functionName: "loadUncensored", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "censored", title: "有码影片", functionName: "loadCensored", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "subtitle", title: "字幕专区", functionName: "loadSubtitle", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "k4", title: "4K超高清", functionName: "load4K", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "new", title: "新片上市", functionName: "loadNew", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] }
  ],
  search: {
    title: "搜索",
    functionName: "searchVideos",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

var BASE = "https://getav.me";

function ok(resp) {
  if (!resp) return false;
  if (resp.ok !== undefined) return !!resp.ok;
  var code = resp.statusCode !== undefined ? resp.statusCode : resp.status;
  return typeof code === "number" ? (code >= 200 && code < 300) : !!resp.data;
}

async function api(path) {
  try {
    var resp = await Widget.http.get(BASE + path, {
      headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" },
      timeout: 20000
    });
    if (!ok(resp)) return null;
    var d = resp.data;
    if (typeof d === "string") {
      try { return JSON.parse(d); } catch (e) { return null; }
    }
    return d;
  } catch (e) { return null; }
}

var STATIC_HOST = "https://static.worldstatic.com";

function formatPoster(raw) {
  if (!raw) return "";
  var pic = String(raw).trim();
  if (pic.indexOf("//") === 0) pic = "https:" + pic;
  else if (pic.charAt(0) === "/") pic = STATIC_HOST + pic;
  return pic;
}

function toItems(movies) {
  var items = [];
  (movies || []).forEach(function(m) {
    var code = m.code || m.id;
    if (!code) return;
    var poster = formatPoster(m.localImg || m.img || m.poster || "");
    items.push({
      id: "getav_" + code,
      type: "url",
      title: m.title || m.name || "",
      posterUrl: poster,
      posterPath: poster,
      remark: m.duration || "",
      link: "getav://detail/" + code
    });
  });
  return items;
}

async function loadCat(category, params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var d = await api("/api/movies?category=" + category + "&sortBy=latest&limit=20&page=" + page + "&locale=zh");
  if (!d) return [];
  var movies = (d.data && d.data.movies) || d.movies || [];
  return toItems(movies);
}

async function searchVideos(params) {
  params = params || {};
  var kw = String(params.keyword || "").trim();
  if (!kw) return [];
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var d = await api("/api/movies?search=" + encodeURIComponent(kw) + "&limit=20&page=" + page + "&locale=zh");
  if (!d) return [];
  var movies = (d.data && d.data.movies) || d.movies || [];
  return toItems(movies);
}


// ---- AVDB 样式详情：演员/分类（点按出对应全部内容）----
// 本站是纯 API 站：/api/movies/<code> 返回影片对象。演员/分类字段名站方
// 未定死，这里按常见键防御式取（actress/actors/stars/tags/genres/categories
// 等），有才挂、没有留空、不编造。link 用 actor:/tag: 记号，路由里走 searchVideos。
function taxTrim(v) { return String(v == null ? "" : v).trim(); }

function namesFromValue(v) {
  var out = [];
  if (typeof v === "string") {
    var parts = v.split(",");
    for (var i = 0; i < parts.length; i++) {
      var nm = taxTrim(parts[i]);
      if (nm) out.push({ name: nm, id: "" });
    }
  } else if (Array.isArray(v)) {
    for (var j = 0; j < v.length; j++) {
      var it = v[j];
      if (typeof it === "string") { if (taxTrim(it)) out.push({ name: taxTrim(it), id: "" }); }
      else if (it && typeof it === "object") {
        var nm2 = taxTrim(it.name || it.title || "");
        var id2 = (it.id != null) ? String(it.id) : "";
        if (nm2) out.push({ name: nm2, id: id2 });
      }
    }
  } else if (v && typeof v === "object") {
    var nm3 = taxTrim(v.name || v.title || "");
    if (nm3) out.push({ name: nm3, id: (v.id != null) ? String(v.id) : "" });
  }
  return out;
}

function apiTaxFromMovie(m) {
  var peoples = [];
  var genreItems = [];
  var seenP = {};
  var seenG = {};
  var actorKeys = ["actress", "actresses", "actors", "actor", "stars", "star", "performers", "performer", "cast"];
  var tagKeys = ["tags", "tag", "genres", "genre", "categories", "category", "labels", "maker", "studio"];
  var k, arr, q;
  for (k = 0; k < actorKeys.length; k++) {
    if (!m || m[actorKeys[k]] == null) continue;
    arr = namesFromValue(m[actorKeys[k]]);
    for (q = 0; q < arr.length; q++) {
      if (seenP[arr[q].name]) continue;
      seenP[arr[q].name] = 1;
      peoples.push({ id: "actor:" + arr[q].name, title: arr[q].name, name: arr[q].name, link: "actor:" + arr[q].name, role: "演员" });
    }
  }
  for (k = 0; k < tagKeys.length; k++) {
    if (!m || m[tagKeys[k]] == null) continue;
    arr = namesFromValue(m[tagKeys[k]]);
    for (q = 0; q < arr.length; q++) {
      if (seenG[arr[q].name]) continue;
      seenG[arr[q].name] = 1;
      genreItems.push({ id: "tag:" + arr[q].name, title: arr[q].name });
    }
  }
  return { peoples: peoples, genreItems: genreItems };
}

function taxonomyDetail(url, kind, name, works) {
  if (!Array.isArray(works)) works = [];
  var real = works.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
  return {
    id: url,
    type: "detail",
    mediaType: "movie",
    title: name || kind,
    link: url,
    description: kind + " · 共 " + real.length + " 部作品",
    videoUrl: "",
    childItems: [],
    relatedItems: real.length ? real : works
  };
}

async function loadDetail(link) {
  try {
    // AVDB 样式：点按演员/分类 → 打开该演员/分类的全部影片（走站内搜索）。
    var rawTax = String(link || "");
    if (rawTax.indexOf("actor:") === 0 || rawTax.indexOf("tag:") === 0) {
      var tName = rawTax.slice(rawTax.indexOf(":") + 1);
      var tWorks = await searchVideos({ keyword: tName, page: 1 });
      return taxonomyDetail(rawTax, rawTax.indexOf("actor:") === 0 ? "演员" : "分类", tName, tWorks);
    }
    var code = String(link).replace("getav://detail/", "");
    var d = await api("/api/movies/" + code);
    if (!d) return { id: link, title: "加载失败", link: link };
    var m = (d.data && d.data.movie) || d.movie || d;
    var videoUrl = m.video_url || m.play_url || m.url || "";
    // 可能有多线路
    if (!videoUrl && m.sources && m.sources.length) {
      videoUrl = m.sources[0].url || m.sources[0].src || "";
    }
    var poster = formatPoster(m.localImg || m.img || m.poster || "");
    var ret = {
      id: link,
      type: "detail",
      title: m.title || "",
      link: link,
      posterPath: poster,
      coverUrl: poster,
      backdropPath: poster,
      posterUrl: poster,
      videoUrl: videoUrl,
      playerType: "system",
      episodes: [{ name: "播放", link: link }],
      seasons: [{ seasonNumber: 1, title: "播放", name: "播放", episodes: [{ title: "播放", videoUrl: videoUrl, episodeNumber: 1 }] }],
      episodeItems: [{
        id: link,
        type: "url",
        title: "播放",
        mediaType: "movie",
        posterPath: poster,
        videoUrl: videoUrl,
        link: link,
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system"
      }]
    };
    ret.childItems = ret.episodeItems;
    // AVDB 样式：影片对象里的演员/分类字段建成 peoples / genreItems（有才挂、没有留空）。
    var tax = apiTaxFromMovie(m);
    if (tax.peoples.length) ret.peoples = tax.peoples;
    if (tax.genreItems.length) ret.genreItems = tax.genreItems;
    return ret;
  } catch (e) {
    return { id: link, title: "加载失败", link: link };
  }
}

async function loadLatest(p) { return loadCat("latest", p); }
async function loadHot(p) { return loadCat("hot", p); }
async function loadUncensored(p) { return loadCat("uncensored", p); }
async function loadCensored(p) { return loadCat("censored", p); }
async function loadSubtitle(p) { return loadCat("subtitle", p); }
async function load4K(p) { return loadCat("4k", p); }
async function loadNew(p) { return loadCat("new-releases", p); }
