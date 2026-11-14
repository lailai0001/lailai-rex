// ASMR for REX (lai_asmr v1.0.0)
// 移植自 mira-cat 蜘蛛 asmr.js（只读蓝图），API https://api.asmr.one。
// ASMR 音声站。列表：GET /api/works?order=<排序>&sort=desc&page=<N>&pageSize=20，
//   返回 {works:[{id, title, mainCoverUrl/samCoverUrl, dl_count}]}。
// 详情：GET /api/work/<id> + GET /api/tracks/<id>?v=2，递归收 audio 节点，
//   每条音轨 streamLowQualityUrl || mediaStreamUrl，音轨即分集。
// 播放：音轨直链，UA 头。搜索：GET /api/search/<词>?order=create_date&sort=desc&page=<N>。

WidgetMetadata = {
  id: "lai_asmr",
  title: "ASMR",
  description: "ASMR：音声站，5 种排序，详情音轨即分集，直链播放",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://www.asmr.one",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "order", title: "排序", type: "constant", value: "create_date" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "新发", functionName: "loadList", cacheDuration: 180, params: [{ name: "order", title: "排序", type: "constant", value: "release" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "最热", functionName: "loadList", cacheDuration: 180, params: [{ name: "order", title: "排序", type: "constant", value: "dl_count" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "高分", functionName: "loadList", cacheDuration: 180, params: [{ name: "order", title: "排序", type: "constant", value: "rate_average_2dp" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "热议", functionName: "loadList", cacheDuration: 180, params: [{ name: "order", title: "排序", type: "constant", value: "review_count" }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var API = "https://api.asmr.one";
var UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36";
var PAGE_SIZE = 20;

function t(v) {
  return String(v == null ? "" : v).trim();
}

function cleanTitle(s) {
  return t(s).replace(/\u3010/g, "[").replace(/\u3011/g, "]").replace(/\$/g, "").replace(/#/g, "");
}

async function apiGet(path) {
  try {
    var res = await Widget.http.get(API + path, {
      headers: { "User-Agent": UA, "Accept": "application/json", "Referer": "https://www.asmr.one/" }
    });
    var data = res && res.data;
    if (data == null) return {};
    if (typeof data === "object") return data;
    try { return JSON.parse(String(data)); } catch (e) { return {}; }
  } catch (e) { return {}; }
}

function rowsToCards(rows) {
  var out = [];
  for (var i = 0; i < (rows || []).length; i++) {
    var w = rows[i];
    var wid = String(w.id || "");
    if (!wid) continue;
    var pic = w.mainCoverUrl || w.samCoverUrl || "";
    out.push({
      id: wid,
      type: "url",
      title: cleanTitle(w.title) || wid,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: wid,
      description: String(w.dl_count || ""),
      mediaType: "movie"
    });
  }
  return out;
}

function collectAudio(node, out) {
  out = out || [];
  if (!node) return out;
  if (node.type === "audio") out.push(node);
  var children = node.children || [];
  for (var i = 0; i < children.length; i++) collectAudio(children[i], out);
  return out;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var order = t(params.order || "create_date");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var d = await apiGet("/api/works?order=" + order + "&sort=desc&page=" + page + "&pageSize=" + PAGE_SIZE);
  var rows = d && typeof d === "object" ? d.works : [];
  var list = rowsToCards(rows);
  return list.length ? list : emptyItem();
}

async function search(params) {
  params = params || {};
  var wd = t(params.keyword || params.wd || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return emptyItem("请输入关键词");
  var d = await apiGet("/api/search/" + encodeURIComponent(wd) + "?order=create_date&sort=desc&page=" + page + "&pageSize=" + PAGE_SIZE);
  var rows = d && typeof d === "object" ? d.works : [];
  var list = rowsToCards(rows);
  return list.length ? list : emptyItem();
}

function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

async function loadDetail(link) {
  try {
    var vid = unwrapLink(link);
    if (!vid) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var d = await apiGet("/api/work/" + vid);
    if (!d || !d.id) return { id: vid, type: "url", title: "详情获取失败", description: "无此内容" };
    var td = await apiGet("/api/tracks/" + vid + "?v=2");
    var audio = collectAudio({ children: Array.isArray(td) ? td : [] });
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    for (var i = 0; i < audio.length; i++) {
      var a = audio[i];
      var title = cleanTitle(a.title) || ("音轨" + (i + 1));
      var url = a.streamLowQualityUrl || a.mediaStreamUrl || "";
      if (!url) continue;
      var num = i + 1;
      var id = vid + "@@TRACK:" + num;
      var label = (num < 10 ? "0" + num : "" + num) + " " + title;
      eps.push({ name: label, link: id });
      seasonEps.push({ title: label, videoUrl: url, episodeNumber: num });
      epItems.push({
        id: id,
        type: "url",
        title: label,
        mediaType: "movie",
        posterPath: d.mainCoverUrl || d.samCoverUrl || "",
        videoUrl: url,
        link: id,
        episode: num,
        episodeNumber: num,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system",
        customHeaders: { "User-Agent": UA }
      });
    }
    var result = {
      id: vid,
      type: "detail",
      title: cleanTitle(d.title) || vid,
      name: cleanTitle(d.title) || vid,
      description: "社团: " + (d.name || ""),
      mediaType: "movie",
      link: vid,
      coverUrl: d.mainCoverUrl || d.samCoverUrl || "",
      posterPath: d.mainCoverUrl || d.samCoverUrl || "",
      backdropPath: d.mainCoverUrl || d.samCoverUrl || "",
      playerType: "app"
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "音轨", name: "音轨", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
      result.videoUrl = seasonEps[0].videoUrl;
    }
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 音轨入口：@@TRACK:<n> -> 回详情取该轨直链
  var at = raw.indexOf("@@TRACK:");
  if (at >= 0) {
    var vid = raw.slice(0, at);
    var num = parseInt(raw.slice(at + 8), 10) || 1;
    try {
      var det = await loadDetail(vid);
      var items = det && det.episodeItems;
      if (items && items[num - 1] && items[num - 1].videoUrl) {
        return [{ name: items[num - 1].title || "音轨", url: items[num - 1].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA } }];
      }
    } catch (e) { /* fall through */ }
    return [];
  }
  // 直链
  if (/^https?:\/\//.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA } }];
  }
  // 兜底：作品 id -> 取详情首轨
  try {
    var det2 = await loadDetail(raw);
    var eps = det2 && det2.episodeItems;
    if (eps && eps.length && eps[0].videoUrl) {
      return [{ name: eps[0].title || "播放", url: eps[0].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA } }];
    }
  } catch (e) { /* fall through */ }
  return [];
}
