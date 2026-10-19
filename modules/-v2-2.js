WidgetMetadata = {
  id: "jinguo-duanju-v2",
  title: "禁果短剧",
  version: "2.0.0",
  requiredVersion: "0.0.1",
  description: "禁果短剧 - 19个分类",
  author: "rewrite",
  site: "https://jinguoduanju.app",
  detailCacheDuration: 1800,
  modules: [
    { id: "latest", title: "最新更新", functionName: "loadLatest", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "hot", title: "热门", functionName: "loadHot", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "mogai", title: "魔改", functionName: "loadMogai", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "danti", title: "单体", functionName: "loadDanti", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "dushi", title: "都市", functionName: "loadDushi", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "guzhuang", title: "古装", functionName: "loadGuzhuang", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "zhichang", title: "职场", functionName: "loadZhichang", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "qihuan", title: "奇幻", functionName: "loadQihuan", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "lvmao", title: "绿帽", functionName: "loadLvmao", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "xiaoyuan", title: "校园", functionName: "loadXiaoyuan", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "chuanyue", title: "穿越", functionName: "loadChuanyue", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "hougong", title: "后宫", functionName: "loadHougong", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "ntr", title: "NTR", functionName: "loadNtr", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "dongman", title: "动漫", functionName: "loadDongman", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "lingyi", title: "灵异", functionName: "loadLingyi", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "yineng", title: "异能", functionName: "loadYineng", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "chongsheng", title: "重生", functionName: "loadChongsheng", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] }
  ],
  search: {
    title: "搜索",
    functionName: "searchDramas",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

var BASE = "https://jinguoduanju.app";
var API = BASE + "/api/v1";

function ok(resp) {
  if (!resp) return false;
  if (resp.ok !== undefined) return !!resp.ok;
  var code = resp.statusCode !== undefined ? resp.statusCode : resp.status;
  return typeof code === "number" ? (code >= 200 && code < 300) : !!resp.data;
}

async function apiGet(path, query) {
  query = query || {};
  var qs = Object.keys(query).map(function(k) {
    return encodeURIComponent(k) + "=" + encodeURIComponent(query[k]);
  }).join("&");
  var url = API + path + (qs ? "?" + qs : "");
  try {
    var resp = await Widget.http.get(url, {
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

function toItems(dramas) {
  var items = [];
  (dramas || []).forEach(function(dr) {
    if (!dr.id) return;
    var cover = dr.coverUrl || "";
    if (cover && cover.charAt(0) === "/") cover = BASE + cover;
    items.push({
      id: "jg_" + dr.id,
      type: "url",
      title: dr.title || "",
      posterUrl: cover,
      posterPath: cover,
      remark: (dr.episodeCount || "") + "集",
      link: "jinguo://detail/" + dr.id
    });
  });
  return items;
}

async function loadList(params, sort, tag) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  // 取100条，客户端按tag过滤
  var d = await apiGet("/dramas", { sort: sort || "latest", limit: 100, page: page });
  if (!d || !Array.isArray(d)) return [];
  var list = d;
  if (tag) {
    list = list.filter(function(dr) {
      var tags = dr.tags || [];
      return tags.indexOf(tag) !== -1;
    });
  }
  return toItems(list.slice(0, 20));
}

async function searchDramas(params) {
  params = params || {};
  var kw = String(params.keyword || "").trim();
  if (!kw) return [];
  var d = await apiGet("/dramas", { sort: "latest", q: kw, limit: 20 });
  if (!d || !Array.isArray(d)) return [];
  return toItems(d);
}

async function loadDetail(link) {
  try {
    var id = String(link).replace("jinguo://detail/", "");
    var d = await apiGet("/dramas/" + encodeURIComponent(id));
    if (!d) return { id: link, title: "加载失败", link: link };
    var episodes = [];
    // 获取剧集列表
    var eps = await apiGet("/dramas/" + encodeURIComponent(id) + "/episodes");
    if (eps && Array.isArray(eps)) {
      eps.forEach(function(ep) {
        episodes.push({ name: "第" + (ep.episodeNumber || ep.index || "?") + "集", id: ep.id });
      });
    }
    var cover = d.coverUrl || "";
    if (cover.charAt(0) === "/") cover = BASE + cover;
    return {
      id: link,
      type: "url",
      title: d.title || "",
      posterUrl: cover,
      description: d.subtitle || "",
      episodes: episodes,
      link: link
    };
  } catch (e) {
    return { id: link, title: "加载失败", link: link };
  }
}

async function getEpisodePlay(epId) {
  var d = await apiGet("/episodes/" + encodeURIComponent(epId) + "/play");
  if (d && d.url) return d.url;
  if (d && d.playUrl) return d.playUrl;
  return "";
}

async function loadLatest(p) { return loadList(p, "latest", null); }
async function loadHot(p) { return loadList(p, "heat", null); }
async function loadMogai(p) { return loadList(p, "latest", "魔改"); }
async function loadDanti(p) { return loadList(p, "latest", "单体"); }
async function loadDushi(p) { return loadList(p, "latest", "都市"); }
async function loadGuzhuang(p) { return loadList(p, "latest", "古装"); }
async function loadZhichang(p) { return loadList(p, "latest", "职场"); }
async function loadQihuan(p) { return loadList(p, "latest", "奇幻"); }
async function loadLvmao(p) { return loadList(p, "latest", "绿帽"); }
async function loadXiaoyuan(p) { return loadList(p, "latest", "校园"); }
async function loadChuanyue(p) { return loadList(p, "latest", "穿越"); }
async function loadHougong(p) { return loadList(p, "latest", "后宫"); }
async function loadNtr(p) { return loadList(p, "latest", "NTR"); }
async function loadDongman(p) { return loadList(p, "latest", "动漫"); }
async function loadLingyi(p) { return loadList(p, "latest", "灵异"); }
async function loadYineng(p) { return loadList(p, "latest", "异能"); }
async function loadChongsheng(p) { return loadList(p, "latest", "重生"); }
