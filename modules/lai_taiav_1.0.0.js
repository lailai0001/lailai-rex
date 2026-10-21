// Taiav for REX (lai_taiav v1.0.0)
// 移植自 mira-cat 蜘蛛 taiav.js, 后端: https://taiav.com (JSON API 站)。
// 列表: /api/getcontents?page=&size=12&category|tag=<分类名>&type=movie,tv (与蜘蛛一致);
//   搜索: 同接口 size=48&q=<关键词>。
// 播放: m3u8 地址带 timestamp/key 签名, 必须点开时实时取 —— 卡片 link 里只带
//   getmovie 接口地址与标题/封面参数, loadDetail 里当场请求
//   /api/getmovie?type=1280&id=<vod_id> 拿新鲜签名地址再播。
// 封面 poster2.url 为站内相对路径, 拼 HOST 直出 (无防盗链)。

WidgetMetadata = {
  id: "lai_taiav",
  title: "Taiav",
  description: "Taiav（taiav.com）：网红主播/国产AV/有码无码/中文字幕与 Onlyfans、探花、自拍等标签，详情实时取签名 m3u8",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://taiav.com",
  detailCacheDuration: 180,
  modules: [
    { title: "网红主播", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category|网红主播" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "国产AV", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category|国产AV" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category|有码" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category|无码" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中文字幕", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category|中文字幕" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Onlyfans", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|Onlyfans" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Korean Bj", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|Korean Bj" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "探花", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|探花" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "自拍", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|自拍" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码破解", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|无码破解" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "主播", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|主播" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "偷拍", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|偷拍" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "制服", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|制服" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|人妻" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
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

var BASE = "https://taiav.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1.1 Mobile/15E148 Safari/604.1";
var PAGE_SIZE = 12;

function apiHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "application/json,*/*",
    "Referer": BASE + "/"
  };
}

async function getJson(url) {
  var res = await Widget.http.get(url, { headers: apiHeaders() });
  var data = res && res.data != null ? res.data : null;
  if (typeof data === "string") {
    var t = data.trim();
    if (!t) return null;
    try { return JSON.parse(t); } catch (_) { return null; }
  }
  return data;
}

function cardOf(e) {
  var vid = String(e._id);
  var name = String(e.originalname || "").trim();
  var posterUrl = e.poster2 && e.poster2.url ? String(e.poster2.url) : "";
  var pic = posterUrl ? (/^https?:\/\//i.test(posterUrl) ? posterUrl : BASE + posterUrl) : "";
  var duration = String(e.duration || "").trim();
  // link 带上 getmovie 地址 + 标题/封面: loadDetail 解析后实时换签名 m3u8
  var link = BASE + "/api/getmovie?type=1280&id=" + encodeURIComponent(vid) +
    "&t=" + encodeURIComponent(name) +
    "&p=" + encodeURIComponent(pic);
  return {
    id: link,
    type: "url",
    title: name,
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    link: link,
    description: duration ? "HD·" + duration : "HD",
    releaseDate: String(e.createAt || ""),
    mediaType: "movie"
  };
}

function parseCards(arr) {
  var out = [];
  if (!Array.isArray(arr)) return out;
  for (var i = 0; i < arr.length; i++) {
    var e = arr[i];
    if (!e || !e._id) continue;
    if (!String(e.originalname || "").trim()) continue;
    out.push(cardOf(e));
  }
  return out;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var path = String(params.path || "category|国产AV");
  var idx = path.indexOf("|");
  var tip = idx >= 0 ? path.slice(0, idx) : "category";
  var cls = idx >= 0 ? path.slice(idx + 1) : path;
  var url = BASE + "/api/getcontents?page=" + page + "&size=" + PAGE_SIZE +
    "&" + tip + "=" + encodeURIComponent(cls) + "&type=movie,tv";
  try {
    var data = await getJson(url);
    var list = parseCards(data);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
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
  var url = BASE + "/api/getcontents?page=" + page + "&size=48&q=" + encodeURIComponent(wd) + "&type=movie,tv";
  try {
    var data = await getJson(url);
    var list = parseCards(data);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

function queryParam(url, name) {
  var m = String(url || "").match(new RegExp("[?&]" + name + "=([^&]*)"));
  if (!m) return "";
  try { return decodeURIComponent(m[1]); } catch (_) { return m[1]; }
}

async function loadDetail(link) {
  try {
    var s = String(link || "");
    var vid = queryParam(s, "id");
    if (!vid && !/getmovie/.test(s)) vid = s; // 兜底: link 本身就是 _id
    if (!vid) return { id: s || "err", type: "url", title: "解析失败", description: "缺少影片 id" };
    var title = queryParam(s, "t");
    var pic = queryParam(s, "p");

    var apiUrl = BASE + "/api/getmovie?type=1280&id=" + encodeURIComponent(vid);
    var data = await getJson(apiUrl);
    var m3u8 = data && data.m3u8 ? String(data.m3u8) : "";
    if (!m3u8) {
      return { id: s, type: "url", title: title || "解析失败", description: "未找到播放地址" };
    }
    var playUrl = /^https?:\/\//i.test(m3u8) ? m3u8 : BASE + m3u8;

    return {
      id: s,
      type: "detail",
      title: title || vid,
      link: s,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      videoUrl: playUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE + "/",
        "Origin": BASE
      }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
