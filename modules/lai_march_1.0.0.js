// March视频 for REX (lai_march v1.0.0)
// 移植自 mira-cat 蜘蛛 march.js (py_march)，只读蓝图移植，未改动猫源。
// 后端：March App 的 JSON API (https://api.march24168.online)，封面/媒体走 cdn.uameta.ai。
// 与蜘蛛一致：内置用户授权账号登录拿 token（可被 extend 覆盖的口径在 REX 无配置通道，
// 仅保留内置账号，同蜘蛛公开仓库里的处理方式一致）；四类内容 视频/有声/漫画/小说。
// 实测口径 (2026-10-21 VM)：
//   - 视频 intro 接口当前回 result:"fail"/model:null（蜘蛛同样受影响），但列表项自带
//     title/coverUrl/url(m3u8)，故视频详情改用列表自带字段组装，不依赖 intro。
//   - 有声 intro 无 chapters 数组，靠 latestReadChapterUrl 直给 mp3（蜘蛛同款兜底）；
//     若 intro 带 chapters 则逐章走 /audio/app/audio/chapter 换地址（蜘蛛同款）。
//   - 漫画/小说蜘蛛本身不提供可播内容（vod_play_url 为空），本模块同口径：只出详情信息。

WidgetMetadata = {
  id: "lai_march",
  title: "March视频",
  description: "March视频：视频（FC2/MOODYZ/S1/加勒比/一本道/麻豆传媒）、有声、漫画、小说，App API 直取",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://api.march24168.online",
  detailCacheDuration: 180,
  modules: [
    {
      title: "视频",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "类别", type: "constant", value: "video" },
        {
          name: "sub",
          title: "分类",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "FC2", value: "FC2" },
            { title: "MOODYZ", value: "MOODYZ" },
            { title: "S1 No. 1 Style", value: "S1" },
            { title: "加勒比", value: "加勒比" },
            { title: "一本道", value: "一本道" },
            { title: "麻豆传媒", value: "麻豆传媒" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "有声",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "类别", type: "constant", value: "audio" },
        {
          name: "sub",
          title: "分类",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "有声小说", value: "有声小说" },
            { title: "淫词艳曲", value: "淫词艳曲" },
            { title: "激情骚麦", value: "激情骚麦" },
            { title: "寸止训练", value: "寸止训练" },
            { title: "ASMR", value: "ASMR" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "漫画",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "类别", type: "constant", value: "comic" },
        {
          name: "sub",
          title: "分类",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "全彩", value: "全彩" },
            { title: "剧情", value: "剧情" },
            { title: "巨乳大奶", value: "巨乳大奶" },
            { title: "内射中出", value: "内射中出" },
            { title: "不伦", value: "不伦" },
            { title: "单女", value: "单女" },
            { title: "单男", value: "单男" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "小说",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "类别", type: "constant", value: "novel" },
        {
          name: "sub",
          title: "分类",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "校园", value: "校园" },
            { title: "都市", value: "都市" },
            { title: "古代", value: "古代" },
            { title: "NP", value: "NP" },
            { title: "剧情", value: "剧情" },
            { title: "甜文", value: "甜文" },
            { title: "百合", value: "百合" },
            { title: "纯爱", value: "纯爱" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      id: "loadResource",
      title: "March播放源",
      description: "有声播放时实时解析章节地址",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 0,
      params: []
    }
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

var API = "https://api.march24168.online";
var CDN = "https://cdn.uameta.ai/file/bucket-media";
var UA = "Dart/3.11 (dart:io)";

// 内置账号与蜘蛛一致（用户授权内置；base64 仅作混淆存储，纯 JS 解码，沙箱无 Buffer）
var _LN_B64 = "Mjg1ODg2NzUxQHFxLmNvbQ==";
var _PW_B64 = "cXdlcjQzMjE=";

function b64Decode(s) {
  var table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var out = "";
  var buf = 0, nb = 0;
  s = String(s || "").replace(/=+$/, "");
  for (var i = 0; i < s.length; i++) {
    var v = table.indexOf(s.charAt(i));
    if (v < 0) continue;
    buf = (buf << 6) | v;
    nb += 6;
    if (nb >= 8) {
      nb -= 8;
      out += String.fromCharCode((buf >> nb) & 0xff);
    }
  }
  return out;
}

var _token = "";

function apiHeaders() {
  var h = { "User-Agent": UA, "Accept-Encoding": "gzip" };
  if (_token) h["token"] = _token;
  return h;
}

// POST（带守卫）：运行时无 Widget.http.post 时返回 null，调用方按失败处理
async function postJson(url) {
  if (!Widget.http || typeof Widget.http.post !== "function") return null;
  try {
    var res = await Widget.http.post(url, "{}", { headers: apiHeaders(), timeout: 25000 });
    if (!res || res.data == null) return null;
    if (typeof res.data === "object") return res.data;
    try { return JSON.parse(String(res.data)); } catch (e) { return null; }
  } catch (e) {
    return null;
  }
}

async function getJson(url) {
  try {
    var res = await Widget.http.get(url, { headers: apiHeaders(), timeout: 25000 });
    if (!res || res.data == null) return null;
    if (typeof res.data === "object") return res.data;
    try { return JSON.parse(String(res.data)); } catch (e) { return null; }
  } catch (e) {
    return null;
  }
}

async function login() {
  if (_token) return true;
  var ln = b64Decode(_LN_B64);
  var pw = b64Decode(_PW_B64);
  if (!ln || !pw) return false;
  var url = API + "/console/app/login?loginName=" + encodeURIComponent(ln) +
    "&password=" + encodeURIComponent(pw) + "&platform=app";
  var obj = await postJson(url);
  if (obj && obj.code === 0 && obj.model && obj.model.token) {
    _token = obj.model.token;
    return true;
  }
  return false;
}

function qs(params) {
  var parts = [];
  Object.keys(params || {}).forEach(function (k) {
    var v = params[k];
    if (v === undefined || v === null || v === "") return;
    parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
  });
  return parts.length ? "?" + parts.join("&") : "";
}

// 与蜘蛛 apiGet 同口径：code===0 且 model 非空才算成功（视频 intro 的 fail/model:null 会被判失败）
async function apiGet(path, params) {
  if (!(await login())) return null;
  var obj = await getJson(API + path + qs(params));
  if (obj && obj.code === 0 && obj.model != null) return obj.model;
  return null;
}

function coverOf(item) {
  var c = (item && (item.coverUrl || item.cover)) || "";
  if (!c) return "";
  if (/^https?:\/\//i.test(c)) return c;
  return c.charAt(0) === "/" ? CDN + c : "";
}

// 列表项缓存：视频详情靠列表自带字段组装（intro 接口当前不可用），按 id 存最近见过的条目
var _itemCache = {};

function toCard(kind, item) {
  var cover = coverOf(item);
  var remarks = item.categories || item.tags || item.tag || "";
  var link;
  if (kind === "video") {
    _itemCache[String(item.id)] = item;
    link = "march://video/" + item.id + "?u=" + encodeURIComponent(item.url || "");
  } else {
    link = "march://" + kind + "/" + item.id;
  }
  return {
    id: link,
    type: "url",
    title: item.title || item.number || "未命名",
    posterPath: cover,
    coverUrl: cover,
    backdropPath: cover,
    link: link,
    description: remarks,
    mediaType: kind === "video" ? "movie" : "tv"
  };
}

var LIST_CONF = {
  video: { path: "/video/app/video/search", base: { orderType: 2, size: 50 }, subKey: "author", subSearchType: 2 },
  audio: { path: "/audio/app/audio/search", base: { orderType: 1, searchType: 1, size: 42 }, subKey: "category" },
  comic: { path: "/comic/app/comic/search", base: { orderType: 2, size: 50 }, subKey: "tag" },
  novel: { path: "/novel/app/novel/search", base: { orderType: 2, size: 50 }, subKey: "tag" }
};

async function fetchList(kind, page, sub, keyword) {
  var conf = LIST_CONF[kind];
  if (!conf) return [];
  var params = {};
  Object.keys(conf.base).forEach(function (k) { params[k] = conf.base[k]; });
  params.page = page;
  if (keyword) {
    params.searchType = 1;
    params.keyword = keyword;
  } else if (sub) {
    if (conf.subSearchType) params.searchType = conf.subSearchType;
    params[conf.subKey] = sub;
  }
  var model = await apiGet(conf.path, params);
  var data = (model && model.data) || [];
  var out = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i] && data[i].id != null) out.push(toCard(kind, data[i]));
  }
  return out;
}

async function loadList(params) {
  params = params || {};
  var kind = String(params.cat || "video");
  var sub = String(params.sub || "");
  var page = parseInt(params.page, 10) || 1;
  try {
    var cards = await fetchList(kind, page, sub, "");
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg }];
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

// 搜索：四类各走本站 /search 端点的 keyword 参数（VM 实测均真过滤），合并返回
async function search(params) {
  params = params || {};
  var keyword = pickKeyword(params);
  if (!keyword) {
    return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  }
  var page = parseInt(params.page, 10) || 1;
  try {
    var kinds = ["video", "audio", "comic", "novel"];
    var out = [];
    for (var i = 0; i < kinds.length; i++) {
      var part = await fetchList(kinds[i], page, "", keyword);
      for (var j = 0; j < part.length; j++) out.push(part[j]);
    }
    return out.length ? out : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

function parseRef(link) {
  var v = String(link || "");
  var m = v.match(/^march:\/\/(video|audio|comic|novel|audioep)\/([^?]+)(?:\?(.*))?$/);
  if (!m) return { kind: "", id: v, query: "" };
  return { kind: m[1], id: m[2], query: m[3] || "" };
}

function queryParam(q, key) {
  var parts = String(q || "").split("&");
  for (var i = 0; i < parts.length; i++) {
    var kv = parts[i].split("=");
    if (kv[0] === key && kv[1] != null) {
      try { return decodeURIComponent(kv.slice(1).join("=")); } catch (e) { return ""; }
    }
  }
  return "";
}

async function loadDetail(link) {
  var ref = parseRef(link);
  try {
    if (ref.kind === "video") {
      var item = _itemCache[String(ref.id)] || {};
      var videoUrl = queryParam(ref.query, "u") || item.url || "";
      var cover = item.coverUrl ? coverOf(item) : "";
      var title = item.title || "March视频";
      if (!videoUrl) {
        return { id: String(link), type: "url", title: title, posterPath: cover, coverUrl: cover, backdropPath: cover, link: String(link), description: "未找到播放地址" };
      }
      var desc = item.brief || item.description || item.categories || "";
      return {
        id: String(link),
        type: "detail",
        title: title,
        link: String(link),
        posterPath: cover,
        coverUrl: cover,
        backdropPath: cover,
        videoUrl: videoUrl,
        playerType: "app",
        description: desc,
        customHeaders: { "User-Agent": UA }
      };
    }

    if (ref.kind === "audio") {
      var model = await apiGet("/audio/app/audio/intro", { id: ref.id });
      if (!model) return { id: String(link), type: "url", title: "加载失败", link: String(link) };
      var acover = coverOf(model);
      var episodes = [];
      var chapters = Array.isArray(model.chapters) ? model.chapters : [];
      for (var i = 0; i < chapters.length; i++) {
        var ch = chapters[i];
        if (!ch || ch.id == null) continue;
        episodes.push({
          name: ch.title || ("第" + (ch.order || i + 1) + "集"),
          id: ch.id,
          link: "march://audioep/" + ch.id
        });
      }
      if (!episodes.length && model.latestReadChapterUrl) {
        var epName = model.latestReadChapter || "第1集";
        episodes.push({
          name: epName,
          id: model.latestReadChapterId || ref.id,
          link: "march://audioep/" + (model.latestReadChapterId || ref.id) + "?u=" + encodeURIComponent(model.latestReadChapterUrl)
        });
      }
      return {
        id: String(link),
        type: "url",
        title: model.title || "",
        posterPath: acover,
        coverUrl: acover,
        backdropPath: acover,
        description: model.intro || model.brief || "",
        episodes: episodes,
        link: String(link)
      };
    }

    if (ref.kind === "comic" || ref.kind === "novel") {
      // 与蜘蛛同口径：只出详情信息，无可播内容（蜘蛛 vod_play_url 为空）
      var path = ref.kind === "comic" ? "/comic/app/comic/intro" : "/novel/app/novel/intro";
      var cm = await apiGet(path, { id: ref.id });
      if (!cm) return { id: String(link), type: "url", title: "加载失败", link: String(link) };
      var ccover = coverOf(cm);
      return {
        id: String(link),
        type: "url",
        title: cm.title || "",
        posterPath: ccover,
        coverUrl: ccover,
        backdropPath: ccover,
        description: cm.brief || cm.description || "",
        link: String(link)
      };
    }

    return { id: String(link || ""), type: "url", title: "参数错误", link: String(link || "") };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// 有声播放解析（stream 模块）：
// - 单集链接带 u= 时直返；带章节 id 时走 /audio/app/audio/chapter 换地址（蜘蛛同款）
// - 收到整部有声链接时，逐集解析（连续 3 集拿不到地址就停，与禁果模块同口径）
async function loadResource(params) {
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  var ref = parseRef(raw);
  try {
    if (ref.kind === "audioep") {
      var direct = queryParam(ref.query, "u");
      if (direct) return [{ name: "播放", url: direct, playerType: "app", customHeaders: { "User-Agent": UA } }];
      var chModel = await apiGet("/audio/app/audio/chapter", { id: ref.id });
      var url = chModel ? (chModel.chapterUrl || "") : "";
      if (!url) return [];
      return [{ name: "播放", url: url, playerType: "app", customHeaders: { "User-Agent": UA } }];
    }
    if (ref.kind === "audio") {
      var detail = await loadDetail(raw);
      var eps = (detail && detail.episodes) || [];
      var out = [];
      var misses = 0;
      for (var i = 0; i < eps.length; i++) {
        var one = await loadResource({ link: eps[i].link });
        if (!one.length) {
          misses++;
          if (misses >= 3) break;
          continue;
        }
        misses = 0;
        out.push({
          name: eps[i].name,
          description: detail.title || "",
          url: one[0].url,
          playerType: "app",
          customHeaders: { "User-Agent": UA }
        });
      }
      return out;
    }
    return [];
  } catch (e) {
    return [];
  }
}
