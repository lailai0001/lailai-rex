/**
 * 禁果短剧 ForwardWidget
 * 站点: https://jinguoduanju.app
 * 分类：navigationId（官方剧场导航）+ 本地 tags 过滤
 * 宣传: https://t.me/nostremby
 * 1.1.6：token 改成尽力而为——列表/详情 API 不带 token 也能回数据，
 * ensureToken 失败不再抛错，无 token 继续调 GET。
 * 1.1.5：详情照 JavRate 结构——type "detail"，seasons[].episodes 与
 * episodeItems[] 每集直接带 Worker 代理 videoUrl（/ep/{episodeId}.m3u8），
 * 不再懒解析。App 渲染季集网格并直接播每集 videoUrl。
 * loadResource 只作回落：videoUrl 直通，否则单集现取 /play。
 */
WidgetMetadata = {
  id: "lai_jinguo",
  title: "禁果短剧",
  version: "1.1.6",
  requiredVersion: "0.0.1",
  description: "禁果短剧：最新/热度/首页推荐/全部/原创/单体/动漫/影视/多集/单集/9 个题材，详情直接带每集播放地址",
  author: "lai",
  site: "https://t.me/nostremby",
  detailCacheDuration: 180,
  globalParams: [
    {
      name: "apiBase",
      title: "API 地址",
      type: "input",
      value: "https://jinguoduanju.app"
    }
  ],
  modules: [
    { id: "heat", title: "热度", functionName: "loadHeat", cacheDuration: 300, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "latest", title: "最新", functionName: "loadLatest", cacheDuration: 300, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "landing", title: "首页推荐", functionName: "loadLanding", cacheDuration: 300, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "nav_all", title: "全部", functionName: "loadNavAll", cacheDuration: 300, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "nav_original", title: "原创精品", functionName: "loadNavOriginal", cacheDuration: 300, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "nav_single", title: "单体作品", functionName: "loadNavSingle", cacheDuration: 300, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "nav_anime", title: "动漫改编", functionName: "loadNavAnime", cacheDuration: 300, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "nav_movie", title: "影视改编", functionName: "loadNavMovie", cacheDuration: 300, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "len_multi", title: "多集", functionName: "loadLenMulti", cacheDuration: 300, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "len_single", title: "单集", functionName: "loadLenSingle", cacheDuration: 300, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "tag_mogai", title: "魔改", functionName: "loadTagMogai", cacheDuration: 300, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "tag_dushi", title: "都市", functionName: "loadTagDushi", cacheDuration: 300, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "tag_zhichang", title: "职场", functionName: "loadTagZhichang", cacheDuration: 300, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "tag_qihuan", title: "奇幻", functionName: "loadTagQihuan", cacheDuration: 300, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "tag_guzhuang", title: "古装", functionName: "loadTagGuzhuang", cacheDuration: 300, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "tag_dongman", title: "动漫", functionName: "loadTagDongman", cacheDuration: 300, params: [{ name: "page", title: "页码", type: "page" }] },
    {
      id: "search",
      title: "搜索",
      functionName: "search",
      cacheDuration: 300,
      params: [
        { name: "keyword", title: "关键词", type: "input" },
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ]
};

var UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15";
// jinguo-fetch Worker v3（已部署）：/api/v1 直通代理 + /ep/{episodeId}.m3u8
// 单集播单代理（现解真 m3u8、分片改写为绝对地址、HEAD 200）。
// 详情每集 videoUrl 直接填代理地址，1 次详情 API 即回，不逐集调 /play。
var WORKER = "https://jinguo-fetch.li768435813.workers.dev";
var _token = "";
var _deviceId = "";
var PAGE_SIZE = 24;

function t(v) {
  return String(v == null ? "" : v).trim();
}

function cfg(params) {
  params = params || {};
  return {
    apiBase: t(params.apiBase || "https://jinguoduanju.app").replace(/\/+$/, "")
  };
}

function qs(obj) {
  var parts = [];
  Object.keys(obj || {}).forEach(function (k) {
    var v = obj[k];
    if (v == null || v === "") return;
    if (Array.isArray(v)) {
      for (var i = 0; i < v.length; i++) {
        parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(String(v[i])));
      }
    } else {
      parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(String(v)));
    }
  });
  return parts.length ? "?" + parts.join("&") : "";
}

function absUrl(base, u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  return base + (u.charAt(0) === "/" ? "" : "/") + u;
}

function randDevice() {
  var s = "";
  var hex = "0123456789abcdef";
  for (var i = 0; i < 32; i++) s += hex.charAt((Math.random() * 16) | 0);
  return s;
}

async function ensureToken(c) {
  if (_token) return _token;
  if (!_deviceId) _deviceId = randDevice();
  var url = c.apiBase + "/api/v1/auth/device";
  var body = {
    deviceId: "h5:" + _deviceId,
    channelCode: "",
    attributionToken: ""
  };
  var headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": UA,
    Referer: c.apiBase + "/",
    Origin: c.apiBase
  };
  var res = null;
  var d = null;
  var authUrls = [WORKER + "/api/v1/auth/device", url];
  for (var ai = 0; ai < authUrls.length && (!d || !d.token); ai++) {
    try {
      if (Widget.http.post) {
        res = await Widget.http.post(authUrls[ai], body, { headers: headers });
        d = res && res.data;
      }
    } catch (e) {}
    if ((!d || !d.token) && Widget.http.request) {
      try {
        res = await Widget.http.request({
          url: authUrls[ai],
          method: "POST",
          headers: headers,
          body: JSON.stringify(body)
        });
        d = res && res.data;
      } catch (e2) {}
    }
  }
  if (typeof d === "string") {
    try {
      d = JSON.parse(d);
    } catch (e) {}
  }
  _token = t(d && d.token);
  // 1.1.6：拿不到 token 不抛错（列表/详情 API 不带 token 也能回数据），
  // 返回 null 让 apiGet 无 token 继续调 GET。
  return _token || null;
}

async function apiGet(c, path, query, retry) {
  try { await ensureToken(c); } catch (e) {}
  var headers = {
    Accept: "application/json",
    "User-Agent": UA,
    Referer: c.apiBase + "/",
    Origin: c.apiBase
  };
  // 1.1.6：只有拿到 token 时才带 Authorization 头。
  if (_token) headers.Authorization = "Bearer " + _token;
  var urls = [WORKER + "/api/v1" + path + qs(query || {}), c.apiBase + "/api/v1" + path + qs(query || {})];
  var d = null;
  for (var ui = 0; ui < urls.length; ui++) {
    try {
      var res = await Widget.http.get(urls[ui], { headers: headers });
      d = res && res.data;
      if (typeof d === "string") {
        try { d = JSON.parse(d); } catch (e) {}
      }
      if (d) break;
    } catch (e) {}
  }
  if (d && d.status === 401 && !retry) {
    _token = "";
    return apiGet(c, path, query, true);
  }
  return d;
}

function pageSlice(arr, page) {
  page = Number(page || 1) || 1;
  if (!Array.isArray(arr)) return [];
  var start = (page - 1) * PAGE_SIZE;
  return arr.slice(start, start + PAGE_SIZE);
}

function toItem(c, it) {
  if (!it) return null;
  var id = t(it.id);
  if (!id) return null;
  var cover = absUrl(c.apiBase, it.coverUrl || it.cover || "");
  var ep = it.episodeCount || "";
  var remark = ep ? "全" + ep + "集" : "";
  var tags = Array.isArray(it.tags) ? it.tags.join(" · ") : "";
  if (tags) remark = remark ? remark + " · " + tags : tags;
  return {
    id: "jgdj:" + id,
    type: "link",
    title: t(it.title) || id,
    coverUrl: cover,
    posterPath: cover,
    backdropPath: cover,
    posterUrl: cover,
    backdropUrl: cover,
    description: remark,
    mediaType: "tv",
    link: "jgdj:" + id
  };
}

function mapList(c, arr) {
  var out = [];
  for (var i = 0; i < (arr || []).length; i++) {
    var it = toItem(c, arr[i]);
    if (it) out.push(it);
  }
  return out;
}

/**
 * query:
 *  sort, navigationId, length
 *  _tagFilter: 本地 tags 精确匹配（服务端 tags 参数会 400）
 */
async function loadDramas(params, query) {
  params = params || {};
  var c = cfg(params);
  var page = Number(params.page || 1) || 1;
  var q = Object.assign({ sort: "latest" }, query || {});
  var tagFilter = q._tagFilter || "";
  delete q._tagFilter;
  var list = await apiGet(c, "/dramas", q);
  if (!Array.isArray(list)) list = [];
  if (tagFilter) {
    var filtered = [];
    for (var i = 0; i < list.length; i++) {
      var tags = list[i].tags || [];
      var hit = false;
      if (Array.isArray(tags)) {
        for (var j = 0; j < tags.length; j++) {
          if (String(tags[j]) === tagFilter) {
            hit = true;
            break;
          }
        }
      }
      if (hit) filtered.push(list[i]);
    }
    list = filtered;
  }
  return mapList(c, pageSlice(list, page));
}

async function loadHeat(params) {
  return loadDramas(params, { sort: "heat" });
}
async function loadLatest(params) {
  return loadDramas(params, { sort: "latest" });
}

async function loadLanding(params) {
  params = params || {};
  var c = cfg(params);
  var page = Number(params.page || 1) || 1;
  var data = await apiGet(c, "/landing");
  var list = (data && data.dramas) || [];
  return mapList(c, pageSlice(list, page));
}

// 官方剧场导航 navigationId（实测内容不同）
async function loadNavAll(params) {
  return loadDramas(params, { sort: "latest", navigationId: 2 });
}
async function loadNavOriginal(params) {
  return loadDramas(params, { sort: "latest", navigationId: 7 });
}
async function loadNavSingle(params) {
  return loadDramas(params, { sort: "latest", navigationId: 3 });
}
async function loadNavAnime(params) {
  return loadDramas(params, { sort: "latest", navigationId: 6 });
}
async function loadNavMovie(params) {
  return loadDramas(params, { sort: "latest", navigationId: 5 });
}

// 长度
async function loadLenMulti(params) {
  return loadDramas(params, { sort: "latest", length: "multi" });
}
async function loadLenSingle(params) {
  return loadDramas(params, { sort: "latest", length: "single" });
}

// 标签（本地过滤）
async function loadTagMogai(params) {
  return loadDramas(params, { sort: "latest", _tagFilter: "魔改" });
}
async function loadTagDushi(params) {
  return loadDramas(params, { sort: "latest", _tagFilter: "都市" });
}
async function loadTagZhichang(params) {
  return loadDramas(params, { sort: "latest", _tagFilter: "职场" });
}
async function loadTagQihuan(params) {
  return loadDramas(params, { sort: "latest", _tagFilter: "奇幻" });
}
async function loadTagGuzhuang(params) {
  return loadDramas(params, { sort: "latest", _tagFilter: "古装" });
}
async function loadTagDongman(params) {
  return loadDramas(params, { sort: "latest", _tagFilter: "动漫" });
}

async function search(params) {
  params = params || {};
  var c = cfg(params);
  var kw = t(params.keyword);
  if (!kw) return [];
  var page = Number(params.page || 1) || 1;
  var list = await apiGet(c, "/dramas", { sort: "latest", q: kw });
  if (!Array.isArray(list)) list = [];
  return mapList(c, pageSlice(list, page));
}

function parseLink(link) {
  var s = t(link).replace(/^jinguo:/, "jgdj:");
  if (s.indexOf("jgdj:") === 0) s = s.slice(5);
  var parts = s.split(":");
  return { id: t(parts[0]), ep: t(parts[1] || "") };
}

// App 把卡片对象直接传给 loadDetail/loadResource，入口必先解出可播地址。
// videoUrl 优先，其次 url/playUrl，再次 http(s) 的 link。
function unwrapLink(v) {
  if (!v) return "";
  if (typeof v === "string") {
    var s = t(v);
    return /^https?:\/\//i.test(s) ? s : "";
  }
  if (typeof v === "object") {
    if (v.videoUrl) return t(v.videoUrl);
    if (v.url) return t(v.url);
    if (v.playUrl) return t(v.playUrl);
    if (v.link && /^https?:\/\//i.test(t(v.link))) return t(v.link);
    return "";
  }
  return "";
}

async function loadDetailFwd(link) {
  var p = parseLink(link);
  if (!p.id) return null;
  var c = cfg({});
  var data = await apiGet(c, "/dramas/" + encodeURIComponent(p.id));
  var drama = (data && data.drama) || {};
  var eps = (data && data.episodes) || [];
  var cover = absUrl(c.apiBase, drama.coverUrl || "");
  var headers = {
    "User-Agent": UA,
    Referer: c.apiBase + "/",
    Origin: c.apiBase
  };
  // 1.1.5（照 JavRate 结构）：详情 1 次 API 即回，每集直接带 Worker
  // 代理播单地址 videoUrl，不逐集调 /play、不懒解析。
  var flatEps = [];
  var seasonEps = [];
  var episodeItems = [];
  for (var i = 0; i < eps.length; i++) {
    var ep = eps[i];
    var n = ep.number || i + 1;
    var episodeId = t(ep.id);
    var epLink = "jgdj:" + p.id + ":" + n + ":" + episodeId;
    var title = t(ep.title || "第" + n + "集");
    var videoUrl = episodeId ? (WORKER + "/ep/" + encodeURIComponent(episodeId) + ".m3u8") : "";
    var playLink = videoUrl || epLink;
    flatEps.push({ name: title, link: epLink });
    seasonEps.push({
      title: title,
      name: title,
      videoUrl: videoUrl,
      episodeNumber: Number(n) || i + 1,
      link: playLink,
      id: epLink,
      customHeaders: headers,
      playerType: "system"
    });
    episodeItems.push({
      id: epLink,
      name: title,
      title: title,
      type: "url",
      mediaType: "tv",
      seasonNumber: 1,
      episodeNumber: Number(n) || i + 1,
      videoUrl: videoUrl,
      link: playLink,
      posterPath: cover,
      coverUrl: cover,
      customHeaders: headers,
      playerType: "system"
    });
  }
  if (!episodeItems.length) {
    var epLink0 = "jgdj:" + p.id + ":1";
    flatEps.push({ name: "第1集", link: epLink0 });
    seasonEps.push({
      title: "第1集",
      name: "第1集",
      videoUrl: "",
      episodeNumber: 1,
      link: epLink0,
      id: epLink0,
      customHeaders: headers,
      playerType: "system"
    });
    episodeItems.push({
      id: epLink0,
      name: "第1集",
      title: "第1集",
      type: "url",
      mediaType: "tv",
      seasonNumber: 1,
      episodeNumber: 1,
      videoUrl: "",
      link: epLink0,
      posterPath: cover,
      coverUrl: cover,
      customHeaders: headers,
      playerType: "system"
    });
  }
  var tags = Array.isArray(drama.tags) ? drama.tags.join(" · ") : "";
  var epCount = drama.episodeCount || eps.length || "";
  var seasonTitle = epCount ? "全" + epCount + "集" : "第1季";
  return {
    id: "jgdj:" + p.id,
    type: "detail",
    title: t(drama.title || p.id),
    name: t(drama.title || p.id),
    coverUrl: cover,
    posterPath: cover,
    backdropPath: cover,
    description: t(data.description || tags || ""),
    mediaType: "tv",
    link: "jgdj:" + p.id,
    playerType: "system",
    episodes: flatEps,
    seasons: [{ seasonNumber: 1, title: seasonTitle, name: seasonTitle, episodes: seasonEps }],
    episodeItems: episodeItems,
    childItems: episodeItems
  };
}

async function resolveEpisodeId(c, dramaId, epNum) {
  var data = await apiGet(c, "/dramas/" + encodeURIComponent(dramaId));
  var eps = (data && data.episodes) || [];
  for (var i = 0; i < eps.length; i++) {
    if (String(eps[i].number) === String(epNum) || String(eps[i].id) === String(epNum)) {
      return t(eps[i].id);
    }
  }
  return eps.length ? t(eps[0].id) : "";
}

async function loadResource(params) {
  params = params || {};
  try {
    var c = cfg(params);
    var headers = {
      "User-Agent": UA,
      Referer: c.apiBase + "/",
      Origin: c.apiBase,
      "X-Forward-Skip-Redirect-Probe": "1"
    };
    // 1. 直通：App 把带 videoUrl 的集对象直接传进来，优先原样返回。
    var direct = unwrapLink(params);
    if (!direct && params.link) direct = unwrapLink(params.link);
    if (!direct && params.id) direct = unwrapLink(params.id);
    if (direct) {
      return [{ name: "禁果", url: direct, playerType: "system", customHeaders: headers }];
    }
    // 2. 回落：按 jgdj: token 解析，单集现取 /play。
    var raw = "";
    if (typeof params === "string") raw = params;
    else raw = t(params.link || params.id || "");
    var s = raw.replace(/^jinguo:/, "jgdj:");
    if (s.indexOf("jgdj:") === 0) s = s.slice(5);
    var parts = s.split(":");
    var dramaId = t(parts[0]);
    var epNum = t(parts[1] || "1") || "1";
    var episodeId = t(parts[2] || "");
    if (!dramaId) return [];
    if (!episodeId) {
      episodeId = await resolveEpisodeId(c, dramaId, epNum);
    }
    if (!episodeId) return [];
    var play = await apiGet(c, "/episodes/" + encodeURIComponent(episodeId) + "/play");
    var url = t((play && play.videoUrl) || "");
    if (!url) return [];
    return [
      {
        name: "禁果",
        description: "第" + epNum + "集",
        url: url,
        playerType: "app",
        customHeaders: headers
      }
    ];
  } catch (e) {
    return [];
  }
}
// ================= CapyPlayer 适配层 =================
// 1.1.5：直接返回 JavRate 结构（type detail + seasons/episodeItems/
// childItems，每集带 videoUrl），不再剥成扁平懒解析。App 渲染季集网格
// 并直接播每集 videoUrl。
function __capyCoverOf(obj) {
  var cover =
    obj.posterPath || obj.coverUrl || obj.backdropPath || obj.detailPoster ||
    obj.posterUrl || obj.backdropUrl || obj.pic || obj.cover || "";
  if (cover) {
    obj.coverUrl = cover;
    obj.posterPath = cover;
    obj.backdropPath = cover;
    obj.posterUrl = cover;
    obj.backdropUrl = cover;
    obj.detailPoster = cover;
    obj.pic = cover;
    obj.cover = cover;
    obj.image = cover;
  }
  return cover;
}

async function loadDetail(link) {
  var detail = null;
  try {
    detail = await loadDetailFwd(link);
  } catch (e) {
    detail = null;
  }
  if (!detail) {
    return {
      id: "jgdj:err",
      type: "detail",
      title: "加载失败",
      description: "详情请求失败，请稍后重试",
      mediaType: "tv",
      videoUrl: "",
      url: "",
      playUrl: "",
      playerType: "none",
      episodes: [],
      episodeItems: [],
      seasons: []
    };
  }

  var cover = __capyCoverOf(detail);
  detail.posterUrl = cover;
  detail.posterPath = cover;
  detail.coverUrl = cover;
  detail.backdropPath = cover;
  return detail;
}
