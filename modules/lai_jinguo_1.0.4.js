// 禁果短剧 —— 依照猫源蜘蛛 py_jinguo（jinguo.js）重写
// 2026-11-16：旧 1.0.0–1.0.3 全删。旧版在 loadDetail 里批量取 videoUrl（batch-play），
// 设备侧详情页仍报“未加载到相关资源”。猫源做法是不在详情里取地址：详情只给每集一个
// 载荷 {dramaId, episodeId, epNum}，点播时 loadResource 再调 /episodes/{id}/play 现取。
// 聚合短剧（juheduanju，确认能播）同款：集只有 id/link、无 videoUrl，点播现取。
// API 与蜘蛛一致：先 POST /api/v1/auth/device 取 token，再带 Bearer 调 /api/v1/*。
// 取数双腿：jinguo-fetch Worker 腿优先、直连腿回落（Worker v2 已部署并验活）。
const ID = "lai_jinguo";
const API_BASE = "https://jinguoduanju.app";
const JG_FETCH = "https://jinguo-fetch.li768435813.workers.dev";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const TIMEOUT = 15000;

var _token = "";
var _deviceId = "";

function t(v) { return String(v == null ? "" : v).trim(); }
function randDevice() {
  var hex = "0123456789abcdef";
  var s = "";
  for (var i = 0; i < 32; i++) s += hex[Math.floor(Math.random() * 16)];
  return s;
}
function apiHeaders(extra) {
  var h = { "Accept": "application/json", "User-Agent": UA, "Referer": API_BASE + "/", "Origin": API_BASE };
  if (extra) for (var k in extra) h[k] = extra[k];
  return h;
}
function parseBody(d) {
  if (typeof d === "string") { try { d = JSON.parse(d); } catch (e) {} }
  return d;
}
async function httpPost(base, path, body, headers) {
  var res = await Widget.http.post(base + path, JSON.stringify(body || {}), { headers: headers, timeout: TIMEOUT });
  var st = res ? (res.statusCode != null ? res.statusCode : res.status) : 0;
  if (st && (st < 200 || st >= 300)) throw new Error("HTTP " + st + ": " + path);
  var d = res && res.data != null ? res.data : null;
  if (d == null || d === "") throw new Error("空响应: " + path);
  return parseBody(d);
}
async function httpGet(base, path, query, headers) {
  var url = base + path;
  var qs = "";
  if (query) {
    var parts = [];
    for (var k in query) {
      var v = query[k];
      if (v == null || v === "") continue;
      parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(String(v)));
    }
    qs = parts.join("&");
  }
  if (qs) url += "?" + qs;
  var res = await Widget.http.get(url, { headers: headers, timeout: TIMEOUT });
  var st = res ? (res.statusCode != null ? res.statusCode : res.status) : 0;
  if (st && (st < 200 || st >= 300)) {
    var e = new Error("HTTP " + st + ": " + path);
    e.status = st;
    throw e;
  }
  var d = res && res.data != null ? res.data : null;
  if (d == null || d === "") throw new Error("空响应: " + path);
  return parseBody(d);
}
async function ensureToken() {
  if (_token) return _token;
  if (!_deviceId) _deviceId = randDevice();
  var body = { deviceId: "h5:" + _deviceId, channelCode: "", attributionToken: "" };
  var headers = apiHeaders({ "Content-Type": "application/json" });
  var lastErr = null;
  var bases = [JG_FETCH, API_BASE];
  for (var i = 0; i < bases.length; i++) {
    try {
      var d = await httpPost(bases[i], "/api/v1/auth/device", body, headers);
      var tok = d && (d.token || (d.data && d.data.token) || "");
      tok = t(tok);
      if (tok) { _token = tok; return _token; }
      lastErr = new Error("设备登录无 token");
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error("设备登录失败");
}
async function apiGet(path, query) {
  await ensureToken();
  var headers = apiHeaders({ "Authorization": "Bearer " + _token });
  var bases = [JG_FETCH, API_BASE];
  var lastErr = null;
  for (var i = 0; i < bases.length; i++) {
    try {
      return await httpGet(bases[i], "/api/v1" + path, query, headers);
    } catch (e) {
      lastErr = e;
      if (e && e.status === 401) { _token = ""; await ensureToken(); headers = apiHeaders({ "Authorization": "Bearer " + _token }); try { return await httpGet(bases[i], "/api/v1" + path, query, headers); } catch (e2) { lastErr = e2; } }
    }
  }
  throw lastErr || new Error("请求失败: " + path);
}

async function batchPlay(episodeIds) {
  // 一次取全部集地址。先走 Worker /batch-play，失败返回空数组由调用方退回逐集取。
  if (!episodeIds || !episodeIds.length) return [];
  try {
    await ensureToken();
    var res = await Widget.http.post(JG_FETCH + "/batch-play", JSON.stringify({ token: _token, episodeIds: episodeIds }), { headers: { "Content-Type": "application/json", "User-Agent": UA }, timeout: TIMEOUT });
    var st = res ? (res.statusCode != null ? res.statusCode : res.status) : 0;
    if (st && (st < 200 || st >= 300)) return [];
    var d = res && res.data != null ? res.data : null;
    if (d == null || d === "") return [];
    if (typeof d === "string") { try { d = JSON.parse(d); } catch (e) { return []; } }
    var results = (d && d.results) || [];
    var map = {};
    for (var i = 0; i < results.length; i++) {
      var r = results[i] || {};
      if (r.episodeId && r.videoUrl) map[String(r.episodeId)] = t(r.videoUrl);
    }
    return map;
  } catch (e) { return []; }
}

var CATS = [
  { id: "heat", title: "热度" },
  { id: "latest", title: "最新" },
  { id: "landing", title: "首页推荐" },
  { id: "nav_all", title: "全部" },
  { id: "nav_original", title: "原创精品" },
  { id: "nav_single", title: "单体作品" },
  { id: "nav_anime", title: "动漫改编" },
  { id: "nav_movie", title: "影视改编" },
  { id: "len_multi", title: "多集" },
  { id: "len_single", title: "单集" },
  { id: "tag_mogai", title: "魔改" },
  { id: "tag_dushi", title: "都市" },
  { id: "tag_zhichang", title: "职场" },
  { id: "tag_qihuan", title: "奇幻" },
  { id: "tag_guzhuang", title: "古装" },
  { id: "tag_dongman", title: "动漫" },
  { id: "tag_tianchong", title: "甜宠" },
  { id: "tag_nuelian", title: "虐恋" },
  { id: "tag_chuanyue", title: "穿越" }
];
var CAT_QUERY = {
  heat: { sort: "heat" },
  latest: { sort: "latest" },
  nav_all: { sort: "latest", navigationId: 2 },
  nav_original: { sort: "latest", navigationId: 7 },
  nav_single: { sort: "latest", navigationId: 3 },
  nav_anime: { sort: "latest", navigationId: 6 },
  nav_movie: { sort: "latest", navigationId: 5 },
  len_multi: { sort: "latest", length: "multi" },
  len_single: { sort: "latest", length: "single" },
  tag_mogai: { sort: "latest", _tagFilter: "魔改" },
  tag_dushi: { sort: "latest", _tagFilter: "都市" },
  tag_zhichang: { sort: "latest", _tagFilter: "职场" },
  tag_qihuan: { sort: "latest", _tagFilter: "奇幻" },
  tag_guzhuang: { sort: "latest", _tagFilter: "古装" },
  tag_dongman: { sort: "latest", _tagFilter: "动漫" },
  tag_tianchong: { sort: "latest", _tagFilter: "甜宠" },
  tag_nuelian: { sort: "latest", _tagFilter: "虐恋" },
  tag_chuanyue: { sort: "latest", _tagFilter: "穿越" }
};
function fixCover(c) {
  c = t(c);
  if (c && c.indexOf("http") !== 0) c = API_BASE + (c.charAt(0) === "/" ? c : "/" + c);
  return c;
}
function toCard(it) {
  if (!it || !it.id) return null;
  var ep = it.episodeCount || "";
  var remark = ep ? "全" + ep + "集" : "";
  var tags = Array.isArray(it.tags) ? it.tags.join(" · ") : "";
  if (tags) remark = remark ? remark + " · " + tags : tags;
  return {
    id: "jgdj:" + it.id,
    title: t(it.title) || String(it.id),
    cover: fixCover(it.coverUrl || it.cover || ""),
    remark: remark,
    link: "jgdj:" + it.id
  };
}
async function loadDramas(query, page) {
  page = Math.max(1, parseInt(page) || 1);
  var q = { sort: "latest" };
  if (query) for (var k in query) q[k] = query[k];
  var tagFilter = q._tagFilter || "";
  delete q._tagFilter;
  var list = await apiGet("/dramas", q);
  if (!Array.isArray(list)) list = [];
  if (tagFilter) {
    var f = [];
    for (var i = 0; i < list.length; i++) {
      var it = list[i] || {};
      var tags = Array.isArray(it.tags) ? it.tags : [];
      for (var j = 0; j < tags.length; j++) if (String(tags[j]) === tagFilter) { f.push(it); break; }
    }
    list = f;
  }
  var PAGE_SIZE = 24;
  var start = (page - 1) * PAGE_SIZE;
  var sliced = list.slice(start, start + PAGE_SIZE);
  var out = [];
  for (var i = 0; i < sliced.length; i++) { var c = toCard(sliced[i]); if (c) out.push(c); }
  return { items: out, hasMore: list.length > start + PAGE_SIZE };
}

async function loadList(params) {
  params = params || {};
  var cat = t(params.cat || params.category || "latest");
  var page = Math.max(1, parseInt(params.page) || 1);
  try {
    if (cat === "landing") {
      var data = await apiGet("/landing", {});
      var list = (data && data.dramas) || [];
      var PAGE_SIZE = 24;
      var start = (page - 1) * PAGE_SIZE;
      var sliced = list.slice(start, start + PAGE_SIZE);
      var out = [];
      for (var i = 0; i < sliced.length; i++) { var c = toCard(sliced[i]); if (c) out.push(c); }
      return { items: out, hasMore: list.length > start + PAGE_SIZE };
    }
    var q = CAT_QUERY[cat] || { sort: "latest" };
    return await loadDramas(q, page);
  } catch (e) { return { items: [], hasMore: false }; }
}

async function loadDetail(link) {
  var ref = t(link);
  if (ref.indexOf("jgdj:") === 0) ref = ref.slice(5);
  if (!ref) return { id: t(link), type: "url", title: "参数错误", link: t(link) };
  var data = await apiGet("/dramas/" + encodeURIComponent(ref), {});
  var drama = (data && data.drama) || {};
  var eps = (data && data.episodes) || [];
  var cover = fixCover(drama.coverUrl || "");
  var tags = Array.isArray(drama.tags) ? drama.tags.join(" · ") : "";
  // 集带真 videoUrl（App 只认带 videoUrl 的集）。先批量一次取全部地址，
  // 失败退回逐集取；无地址的集省略，不留空 videoUrl。
  var ids = [];
  for (var i = 0; i < eps.length; i++) { var eid = t(eps[i].id || ""); if (eid) ids.push(eid); }
  var urlMap = await batchPlay(ids);
  if (!urlMap || Object.keys(urlMap).length === 0) {
    // 退回逐集取（限前 8 集，避免超时）
    urlMap = {};
    var limit = Math.min(eps.length, 8);
    for (var j = 0; j < limit; j++) {
      try {
        var pd = await apiGet("/episodes/" + encodeURIComponent(t(eps[j].id)) + "/play", {});
        var u = t(pd && pd.videoUrl);
        if (u) urlMap[t(eps[j].id)] = u;
      } catch (e) {}
    }
  }
  var episodes = [];
  var childItems = [];
  for (var k = 0; k < eps.length; k++) {
    var ep = eps[k] || {};
    var n = parseInt(ep.number) || (k + 1);
    var epId = t(ep.id || "");
    var vurl = urlMap[epId] || "";
    if (!vurl) continue;
    var name = t(ep.title) || ("第" + n + "集");
    var payload = JSON.stringify({ dramaId: ref, episodeId: epId, epNum: String(n) });
    var item = {
      id: payload,
      title: (t(drama.title) || "") + " " + name,
      name: name,
      mediaType: "movie",
      seasonNumber: 1,
      episodeNumber: n,
      videoUrl: vurl,
      link: payload,
      playerType: "system",
      customHeaders: { "User-Agent": UA, "Referer": API_BASE + "/" }
    };
    episodes.push({ name: name, id: payload, link: payload, videoUrl: vurl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": API_BASE + "/" } });
    childItems.push(item);
  }
  return {
    id: "jgdj:" + ref,
    type: "detail",
    title: t(drama.title) || ref,
    cover: cover,
    posterUrl: cover,
    posterPath: cover,
    coverUrl: cover,
    backdropPath: cover,
    description: tags,
    remark: "共" + episodes.length + "集",
    episodes: episodes,
    seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: childItems }],
    episodeItems: childItems,
    link: "jgdj:" + ref
  };
}

async function loadResource(params) {
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  var payload = null;
  try { payload = JSON.parse(raw); } catch (e) { payload = null; }
  if (!payload || !payload.dramaId) {
    // 非载荷：当作 dramaId，取第 1 集
    var did = raw.replace(/^jgdj:/, "");
    if (!did) return [];
    payload = { dramaId: did, episodeId: "", epNum: "1" };
  }
  var episodeId = t(payload.episodeId);
  if (!episodeId) {
    var data = await apiGet("/dramas/" + encodeURIComponent(payload.dramaId), {});
    var eps = (data && data.episodes) || [];
    for (var i = 0; i < eps.length; i++) {
      var ep = eps[i] || {};
      if (String(ep.number) === String(payload.epNum) || String(ep.id) === String(payload.epNum)) { episodeId = t(ep.id); break; }
    }
    if (!episodeId && eps.length) episodeId = t(eps[0].id);
  }
  if (!episodeId) return [];
  var playData = await apiGet("/episodes/" + encodeURIComponent(episodeId) + "/play", {});
  var url = t(playData && playData.videoUrl);
  if (!url) return [];
  return [{ name: "播放", url: url, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": API_BASE + "/", "Origin": API_BASE } }];
}

async function search(params) {
  params = params || {};
  var kw = t(params.keyword || params.query || "");
  var page = Math.max(1, parseInt(params.page) || 1);
  if (!kw) return { items: [], hasMore: false };
  try {
    var list = await apiGet("/dramas", { sort: "latest", q: kw });
    if (!Array.isArray(list)) list = [];
    var PAGE_SIZE = 24;
    var start = (page - 1) * PAGE_SIZE;
    var sliced = list.slice(start, start + PAGE_SIZE);
    var out = [];
    for (var i = 0; i < sliced.length; i++) { var c = toCard(sliced[i]); if (c) out.push(c); }
    return { items: out, hasMore: list.length > start + PAGE_SIZE };
  } catch (e) { return { items: [], hasMore: false }; }
}

const WidgetMetadata = {
  id: ID,
  title: "禁果短剧",
  description: "禁果短剧",
  author: "lailai",
  version: "1.0.4",
  requiredVersion: "0.0.1",
  detailCacheDuration: 0,
  search: {
    title: "搜索",
    functionName: "search",
    placeholder: "搜索短剧",
    categories: CATS.map(function (c) { return { id: c.id, title: c.title }; })
  },
  modules: [
    { title: "禁果短剧", functionName: "loadList", params: [] },
    { id: "loadDetail", functionName: "loadDetail", params: [] },
    { id: "loadResource", functionName: "loadResource", params: [] }
  ]
};
