// ASMRHoney for REX (lai_asmrhoney v1.0.0)
// 移植自 mira-cat 蜘蛛 py_asmrhoney.js（只读蓝图），后端 https://asmrhoney.com/。
// ASMR 视频精选站，全站静态 JSON 数据文件，无登录墙、无墙。
// 列表：/data/clips-page-<N>.json（每页 48 条，共 42 页）；单条含 slug/title/creator/
//   tags/language/mode/duration/coverUrl；不含 videoUrl（详情才有）。
// 详情：/data/clips/<slug>.json -> {clip:{videoUrl, coverUrl, ...}}，
//   videoUrl 为 https://cdn.asmrhoney.com/clips/<slug>/video.mp4 直链 MP4，
//   Range 206 实测通，可快进；下载只有 original 一档，无多清晰度 —— 详情只出单线“原画”。
// 触发音/语言筛选：站内无服务端筛选接口，站方前端是拉 /data/clips-search.json
//   （2.7MB 全量索引）本地过滤；模块同款：取索引后按 tags/language 本地过滤、每页 24 条。
// 分类呈现：顶级分类 + 筛选卡片，子分类不平铺：最新 / 触发音（卡片）/ 语言（卡片）。
// 字幕：无番号，不接。

WidgetMetadata = {
  id: "lai_asmrhoney",
  title: "ASMRHoney",
  description: "ASMRHoney：ASMR 视频精选站，最新 + 触发音/语言筛选，详情单线原画 mp4 直链",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://asmrhoney.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "触发音", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "trigger" }, { name: "sub", title: "触发音", type: "enumeration", value: "sfw", enumOptions: [{ title: "助眠向", value: "sfw" }, { title: "18+", value: "nsfw" }, { title: "口腔音", value: "mouth_sounds" }, { title: "舔耳", value: "ear_licking" }, { title: "触发音", value: "trigger_sounds" }, { title: "角色扮演", value: "roleplay" }, { title: "丝袜", value: "pantyhose" }, { title: "情趣", value: "sexy" }, { title: "摩擦", value: "scratching" }, { title: "耳语", value: "whisper" }, { title: "湿润", value: "wet" }, { title: "视觉触发", value: "vision" }, { title: "吃耳朵", value: "eareating" }, { title: "舌头", value: "tongue" }, { title: "足", value: "feet" }, { title: "弹舌", value: "tonguevibrating" }, { title: "亲吻", value: "kiss" }, { title: "轻敲", value: "tapping" }, { title: "vtuber", value: "vtuber" }, { title: "呼吸", value: "breathing" }, { title: "芦荟胶", value: "aloevera" }, { title: "助眠", value: "sleep_aid" }, { title: "掏耳", value: "ear_cleaning" }, { title: "陪伴", value: "comfort" }, { title: "吃播", value: "eating" }, { title: "心跳", value: "heart" }, { title: "软声", value: "soft_spoken" }, { title: "专注", value: "focus" }, { title: "水声", value: "water" }, { title: "接吻", value: "kissing" }, { title: "视觉刺激", value: "visual_triggers" }, { title: "经典咏流传", value: "oldbutgole" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "语言", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "lang" }, { name: "sub", title: "语言", type: "enumeration", value: "mixed", enumOptions: [{ title: "混合", value: "mixed" }, { title: "英文", value: "en" }, { title: "中文", value: "zh" }, { title: "日文", value: "ja" }, { title: "韩文", value: "ko" }] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://asmrhoney.com";
var DATA = HOST + "/data";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
var PAGE_SIZE = 48;
var FILTER_SIZE = 24;

function t(v) {
  return String(v == null ? "" : v).trim();
}

function durStr(sec) {
  sec = Math.floor(Number(sec) || 0);
  if (sec <= 0) return "";
  var h = Math.floor(sec / 3600);
  var m = Math.floor((sec % 3600) / 60);
  var s = sec % 60;
  var mm = h > 0 ? (m < 10 ? "0" + m : "" + m) : "" + m;
  var ss = s < 10 ? "0" + s : "" + s;
  return h > 0 ? h + ":" + mm + ":" + ss : mm + ":" + ss;
}

async function getJson(url) {
  try {
    var res = await Widget.http.get(url, {
      headers: { "User-Agent": UA, "Referer": HOST + "/", "Accept": "application/json,*/*" }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    if (!body) return null;
    try { return JSON.parse(body); } catch (e) { return null; }
  } catch (e) {
    return null;
  }
}

function clipToCard(c) {
  if (!c || !c.slug) return null;
  var title = t(c.title) || t(c.title_en) || c.slug;
  var pic = t(c.coverUrl) || t(c.coverWebpUrl) || "";
  return {
    id: String(c.slug),
    type: "url",
    title: title,
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    link: String(c.slug),
    description: durStr(c.duration),
    mediaType: "movie"
  };
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function paginate(arr, page, size) {
  var total = arr.length;
  var pagecount = Math.max(1, Math.ceil(total / size));
  var start = (page - 1) * size;
  var slice = arr.slice(start, start + size);
  var list = [];
  for (var i = 0; i < slice.length; i++) {
    var card = clipToCard(slice[i]);
    if (card) list.push(card);
  }
  return list;
}

// 全量索引（站方前端同款本地过滤源），模块级缓存。
var indexCache = null;
async function getIndex() {
  if (indexCache) return indexCache;
  var j = await getJson(DATA + "/clips-search.json");
  var clips = j && Array.isArray(j.clips) ? j.clips : [];
  if (clips.length) indexCache = clips;
  return clips;
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "latest");
  var sub = t(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    if (zone === "latest") {
      var j = await getJson(DATA + "/clips-page-" + page + ".json");
      var clips = j && Array.isArray(j.clips) ? j.clips : [];
      var list = [];
      for (var i = 0; i < clips.length; i++) {
        var card = clipToCard(clips[i]);
        if (card) list.push(card);
      }
      return list.length ? list : emptyItem();
    }
    if (zone === "trigger") {
      var tag = sub || "sfw";
      var all = await getIndex();
      var hits = [];
      for (var k = 0; k < all.length; k++) {
        var c = all[k];
        if (Array.isArray(c.tags) && c.tags.indexOf(tag) >= 0) hits.push(c);
      }
      var pl = paginate(hits, page, FILTER_SIZE);
      return pl.length ? pl : emptyItem();
    }
    if (zone === "lang") {
      var lang = sub || "mixed";
      var all2 = await getIndex();
      var hits2 = [];
      for (var k2 = 0; k2 < all2.length; k2++) {
        if (all2[k2].language === lang) hits2.push(all2[k2]);
      }
      var pl2 = paginate(hits2, page, FILTER_SIZE);
      return pl2.length ? pl2 : emptyItem();
    }
    return emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

async function search(params) {
  params = params || {};
  var wd = t(params.keyword || params.wd || "").toLowerCase();
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return emptyItem("请输入关键词");
  try {
    var all = await getIndex();
    var hits = [];
    for (var i = 0; i < all.length; i++) {
      var c = all[i];
      var hay = [c.title, c.title_en, c.title_ja, c.title_ko, c.creator]
        .map(function (x) { return String(x || "").toLowerCase(); }).join(" ");
      if (hay.indexOf(wd) >= 0) hits.push(c);
    }
    var pl = paginate(hits, page, FILTER_SIZE);
    return pl.length ? pl : emptyItem();
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
    var slug = unwrapLink(link);
    if (!slug) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var j = await getJson(DATA + "/clips/" + encodeURIComponent(slug) + ".json");
    var c = j && j.clip ? j.clip : null;
    if (!c) return { id: slug, type: "url", title: "详情获取失败", description: "无此内容" };
    var title = t(c.title) || t(c.title_en) || slug;
    var pic = t(c.coverUrl) || t(c.coverWebpUrl) || "";
    var videoUrl = t(c.videoUrl);
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    if (videoUrl) {
      var id = slug + "@@PLAY";
      eps.push({ name: "原画", link: id });
      seasonEps.push({ title: "原画", videoUrl: videoUrl, episodeNumber: 1 });
      epItems.push({
        id: id,
        type: "url",
        title: "原画",
        mediaType: "movie",
        posterPath: pic,
        videoUrl: videoUrl,
        link: id,
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system",
        customHeaders: { "User-Agent": UA, "Referer": HOST + "/" }
      });
    }
    var result = {
      id: String(c.slug || slug),
      type: "detail",
      title: title,
      name: title,
      description: t(c.description) || "",
      mediaType: "movie",
      link: slug,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app"
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "原画", name: "原画", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
      result.videoUrl = videoUrl;
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
  // 档位入口：@@PLAY -> 回详情取 videoUrl
  var at = raw.indexOf("@@PLAY");
  if (at >= 0) {
    var slug = raw.slice(0, at);
    try {
      var det = await loadDetail(slug);
      var items = det && det.episodeItems;
      if (items && items.length && items[0].videoUrl) {
        return [{ name: "原画", url: items[0].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
      }
    } catch (e) { /* fall through */ }
    return [];
  }
  // 直链 mp4
  if (/\.mp4(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  }
  // 裸 slug：现取详情拿 videoUrl
  try {
    var det2 = await loadDetail(raw);
    var eps = det2 && det2.episodeItems;
    if (eps && eps.length && eps[0].videoUrl) {
      return [{ name: "原画", url: eps[0].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
  } catch (e) { /* fall through */ }
  return [];
}
