WidgetMetadata = {
  id: "getav-v2",
  title: "GetAV",
  version: "2.0.0",
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

async function loadDetail(link) {
  try {
    var code = String(link).replace("getav://detail/", "");
    var d = await api("/api/movies/" + code);
    if (!d) return { id: link, title: "加载失败", link: link };
    var m = (d.data && d.data.movie) || d.movie || d;
    var videoUrl = m.video_url || m.play_url || m.url || "";
    // 可能有多线路
    if (!videoUrl && m.sources && m.sources.length) {
      videoUrl = m.sources[0].url || m.sources[0].src || "";
    }
    return {
      id: link,
      type: "url",
      title: m.title || "",
      posterUrl: formatPoster(m.localImg || m.img || m.poster || ""),
      videoUrl: videoUrl,
      link: link,
      playerType: "system"
    };
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
