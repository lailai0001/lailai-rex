// 麻豆AI for REX (lai_madouai v1.0.0)
// 移植自 mira-cat 蜘蛛 madouai.js（只读蓝图），站 https://madouai.xyz/（备用 https://2048ai.xyz）。
// Vue SPA + JSON API：列表 /api/v1/videos、搜索 /api/v1/videos/search、详情 /api/v1/videos/{id}。
// 播放：.m3u8 相对路径走站方 m3u8 代理 /api/v1/m3u8/proxy?path=，.mp4 直接用原地址。
// 单档（清单无多码率变体），不编造清晰度。spg/ 前缀视频站方片源已死（分片全 403），
// 列表与详情一律过滤，不出播放按钮。封面一律加 size=medium（800x450 JPEG；
// 默认原图 PNG 2-5MB、GIF 9-16MB，手机上常超时空白）。

WidgetMetadata = {
  id: "lai_madouai",
  title: "麻豆AI",
  description: "麻豆AI：最近更新 + 23 子分类，JSON API，单档 m3u8/mp4（spg/ 死源已过滤）",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://madouai.xyz",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最近更新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "国产自拍", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:1" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "AV - 中文字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:2" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "AV - 无码流出", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:8" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "反差母狗", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:21" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "每日更新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:27" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "探花大神", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:4" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "91大神", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:7" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "麻豆x性吧联合原创", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:10" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "清纯少女", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:13" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "麻豆原创AI", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:6" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "破解偷拍", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:20" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "重口调教", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:14" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "黑料吃瓜", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:19" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "世界杯专栏", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:28" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "直播大秀", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:15" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "白虎嫩妹", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:22" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "麻豆传媒", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:9" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "网红主播", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:16" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "家庭乱伦", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:23" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "媚黑母狗", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:17" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "熟女偷情", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:24" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "白虎少女", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:18" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "网黄原创", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat:25" }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://madouai.xyz";
var HOST2 = "https://2048ai.xyz";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function headers() {
  return {
    "User-Agent": UA,
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": HOST + "/media/"
  };
}

// JSON 取数：主域 -> 备用域（REX 的 res.data 可能是已解析对象，先守卫再解析）
async function apiGet(path) {
  var hosts = [HOST, HOST2];
  for (var i = 0; i < hosts.length; i++) {
    try {
      var res = await Widget.http.get(hosts[i] + path, { headers: headers() });
      if (!res || res.data == null) continue;
      if (typeof res.data === "object") return res.data;
      try { return JSON.parse(res.data); } catch (e) { continue; }
    } catch (e) { /* try next host */ }
  }
  return null;
}

// 封面地址：一律加 size=medium（800x450 JPEG；默认原图 PNG 2-5MB、GIF 9-16MB，手机常超时空白）
function coverUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  var url;
  if (u.indexOf("/api/v1/image/proxy") === 0) url = HOST + u;
  else if (u.charAt(0) === "/") url = HOST + "/api/v1/image/proxy?path=" + encodeURIComponent(u.slice(1));
  else url = HOST + "/api/v1/image/proxy?path=" + encodeURIComponent(u);
  if (url.indexOf("size=") === -1) url += "&size=medium";
  return url;
}

// spg/ 前缀的视频站方分片已死（全 403，约半数清单还 502），播不了，直接过滤
function isPlayable(videoUrl) {
  videoUrl = t(videoUrl);
  if (!videoUrl) return false;
  if (/^https?:\/\//i.test(videoUrl)) return true;
  return videoUrl.indexOf("spg/") !== 0;
}

// 播放地址：.m3u8 相对路径走站方 m3u8 代理；.mp4 直接用原地址
function playUrl(videoUrl) {
  videoUrl = t(videoUrl);
  if (!videoUrl) return "";
  if (/^https?:\/\//i.test(videoUrl)) return videoUrl;
  if (/\.m3u8(\?|$)/i.test(videoUrl)) {
    return HOST + "/api/v1/m3u8/proxy?path=" + encodeURIComponent(videoUrl);
  }
  if (videoUrl.charAt(0) === "/") return HOST + videoUrl;
  return HOST + "/" + videoUrl;
}

function fmtDur(sec) {
  sec = parseInt(sec, 10);
  if (!sec || sec <= 0) return "";
  var h = Math.floor(sec / 3600);
  var m = Math.floor((sec % 3600) / 60);
  var s = sec % 60;
  var ss = s < 10 ? "0" + s : String(s);
  if (h > 0) return h + ":" + (m < 10 ? "0" + m : m) + ":" + ss;
  return m + ":" + ss;
}

function toCard(it) {
  if (!it || it.id == null) return null;
  if (!isPlayable(it.videoUrl)) return null;
  var dur = fmtDur(it.durationSec);
  var remarks = [dur, it.categoryName].filter(Boolean).join(" · ");
  return {
    id: String(it.id),
    type: "url",
    title: t(it.title) || ("视频 " + it.id),
    posterPath: coverUrl(it.coverUrl),
    coverUrl: coverUrl(it.coverUrl),
    backdropPath: coverUrl(it.coverUrl),
    link: String(it.id),
    description: remarks,
    mediaType: "movie"
  };
}

function parseListData(json) {
  if (!json) return { items: [], total: 0, totalPages: 1 };
  var data = json.data || json;
  var items = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);
  var total = parseInt(data.total, 10) || items.length;
  var totalPages = parseInt(data.totalPages, 10) || 1;
  return { items: items, total: total, totalPages: totalPages };
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || params.path || params.cat || "latest");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var size = 30;
  var path;
  if (zone === "latest" || zone === "" || zone === "home") {
    path = "/api/v1/videos?page=" + page + "&size=" + size;
  } else if (zone.indexOf("cat:") === 0) {
    path = "/api/v1/videos?categoryId=" + encodeURIComponent(zone.slice(4)) + "&page=" + page + "&size=" + size;
  } else {
    path = "/api/v1/videos?categoryId=" + encodeURIComponent(zone) + "&page=" + page + "&size=" + size;
  }
  try {
    var json = await apiGet(path);
    var res = parseListData(json);
    var list = [];
    for (var i = 0; i < res.items.length; i++) {
      var v = toCard(res.items[i]);
      if (v) list.push(v);
    }
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

async function search(params) {
  params = params || {};
  var wd = t(params.keyword || params.wd || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return emptyItem("请输入关键词");
  try {
    var json = await apiGet("/api/v1/videos/search?q=" + encodeURIComponent(wd) + "&page=" + page + "&size=30");
    var res = parseListData(json);
    var list = [];
    for (var i = 0; i < res.items.length; i++) {
      var v = toCard(res.items[i]);
      if (v) list.push(v);
    }
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    var m = String(raw || "").match(/(\d+)/);
    var vid = m ? m[1] : "";
    if (!vid) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var json = await apiGet("/api/v1/videos/" + vid);
    var it = json ? (json.data || json) : null;
    if (!it || it.id == null) return { id: vid, type: "url", title: "详情获取失败", description: "无此内容" };
    var title = t(it.title) || ("视频 " + it.id);
    var pic = coverUrl(it.coverUrl);
    var remarks = [fmtDur(it.durationSec), it.categoryName].filter(Boolean).join(" · ");
    // spg/ 站方片源已死：不给播放地址，避免点开无限转圈；备注明示
    if (!isPlayable(it.videoUrl)) {
      return {
        id: String(it.id),
        type: "detail",
        title: title,
        name: title,
        description: t(it.description) || "片源失效",
        mediaType: "movie",
        link: String(it.id),
        coverUrl: pic,
        posterPath: pic,
        backdropPath: pic,
        playerType: "app"
      };
    }
    var url = playUrl(it.videoUrl);
    var result = {
      id: String(it.id),
      type: "detail",
      title: title,
      name: title,
      description: t(it.description) || remarks,
      mediaType: "movie",
      link: String(it.id),
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app"
    };
    if (url) {
      var ep = { name: "播放", link: String(it.id) };
      result.episodes = [ep];
      result.seasons = [{ seasonNumber: 1, title: "播放", name: "播放", episodes: [{ title: "播放", videoUrl: url, episodeNumber: 1 }] }];
      result.episodeItems = [{
        id: String(it.id),
        type: "url",
        title: "播放",
        mediaType: "movie",
        posterPath: pic,
        videoUrl: url,
        link: String(it.id),
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system",
        customHeaders: { "User-Agent": UA, "Referer": HOST + "/media/" }
      }];
      result.childItems = result.episodeItems;
      result.videoUrl = url;
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
  // 直链 m3u8/mp4
  if (/^https?:\/\//i.test(raw) && (/\.(m3u8|mp4)(\?|#|$)/i.test(raw))) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/media/" } }];
  }
  // 数字 id -> 详情取首集
  try {
    var det = await loadDetail(raw);
    var eps = det && det.episodeItems;
    if (eps && eps.length && eps[0].videoUrl) {
      return [{ name: "播放", url: eps[0].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/media/" } }];
    }
  } catch (e) { /* fall through */ }
  return [];
}
