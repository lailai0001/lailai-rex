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
// 2026-10-21 真机修复（有声播不了）：detail 改对齐已验收的 mitao 分集形态——
//   只给 episodeItems/childItems（child 的 id==link==单集引用），不再给 episodes 键；
//   单集作品在 detail 里直接解出 videoUrl（走已证实的 detail 直达形态）；
//   loadResource 改为递归搜集 params 全部字符串逐个试解；loadDetail 收到单集引用也能直解。
// 2026-10-21 二轮：形态对齐后有声真机仍播不了，而 mp3 直链 HTTP 层全正常——REX 播放器内核
//   不播裸的渐进式音频直链。有声路径改走 audio-hls Worker 包成单段 HLS 再播（视频路径不动）；
//   Worker 未部署时探活失败自动回退直链（与一轮行为一致）。漫画/小说仍只出详情信息。

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
var AUDIO_HLS = "https://audio-hls.li768435813.workers.dev";
var _ahlsOk = null;
// 有声 mp3 直链 -> audio-hls 的单段 HLS 地址；Worker 未部署（探活失败）时回退直链，不比现状差
async function audioWrap(url) {
  if (!url) return url;
  if (_ahlsOk === null) {
    try {
      var r = await Widget.http.get(AUDIO_HLS + "/", { headers: { "User-Agent": UA } });
      _ahlsOk = !!(r && String(r.data == null ? "" : r.data).indexOf("audio-hls ok") === 0);
    } catch (e) { _ahlsOk = false; }
  }
  if (!_ahlsOk) return url;
  return AUDIO_HLS + "/a?u=" + encodeURIComponent(url);
}

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

// 单集引用：march://audioep/<章节id>[?u=<直链>]（u 有则免接口）
function epRefOf(chid, directUrl) {
  var s = "march://audioep/" + chid;
  if (directUrl) s += "?u=" + encodeURIComponent(directUrl);
  return s;
}

// 章节 id -> 播放地址（蜘蛛同款 /audio/app/audio/chapter）
async function chapterUrlOf(chid) {
  if (chid == null || chid === "") return "";
  var m = await apiGet("/audio/app/audio/chapter", { id: chid });
  return m ? (m.chapterUrl || m.url || "") : "";
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

    if (ref.kind === "audioep") {
      // 运行时若拿单集引用来走 loadDetail，也直接给可播 detail（与 loadResource 双保险）
      var durl = queryParam(ref.query, "u") || (await chapterUrlOf(ref.id));
      if (!durl) {
        return { id: String(link), type: "url", title: "未找到播放地址", link: String(link) };
      }
      return {
        id: String(link),
        type: "detail",
        title: "March有声",
        link: String(link),
        videoUrl: await audioWrap(durl),
        playerType: "app",
        customHeaders: { "User-Agent": UA }
      };
    }

    if (ref.kind === "audio") {
      var model = await apiGet("/audio/app/audio/intro", { id: ref.id });
      if (!model) return { id: String(link), type: "url", title: "加载失败", link: String(link) };
      var acover = coverOf(model);
      var atitle = model.title || "";
      var adesc = model.intro || model.brief || "";
      // 原始集列表：[{ name, chid, directUrl }]
      var rawEps = [];
      var chapters = Array.isArray(model.chapters) ? model.chapters : [];
      for (var i = 0; i < chapters.length; i++) {
        var ch = chapters[i];
        if (!ch || ch.id == null) continue;
        rawEps.push({
          name: ch.title || ("第" + (ch.order || i + 1) + "集"),
          chid: ch.id,
          directUrl: ""
        });
      }
      if (!rawEps.length && model.latestReadChapterUrl) {
        rawEps.push({
          name: model.latestReadChapter || "第1集",
          chid: model.latestReadChapterId || ref.id,
          directUrl: model.latestReadChapterUrl
        });
      }
      if (!rawEps.length) {
        return { id: String(link), type: "url", title: atitle, posterPath: acover, coverUrl: acover, backdropPath: acover, description: adesc, link: String(link) };
      }
      // 单集：detail 里直接解出 videoUrl（已证实的直达形态，不依赖 stream 模块调用形态）
      if (rawEps.length === 1) {
        var oneUrl = rawEps[0].directUrl || (await chapterUrlOf(rawEps[0].chid));
        if (oneUrl) {
          return {
            id: String(link),
            type: "detail",
            title: atitle,
            link: String(link),
            posterPath: acover,
            coverUrl: acover,
            backdropPath: acover,
            videoUrl: await audioWrap(oneUrl),
            playerType: "app",
            description: adesc,
            customHeaders: { "User-Agent": UA }
          };
        }
      }
      // 多集（或单集直解失败）：对齐 mitao 形态——episodeItems/childItems，child 的 id==link==单集引用
      var childItems = rawEps.map(function (ep, idx) {
        var r = epRefOf(ep.chid, ep.directUrl);
        return {
          id: r,
          title: ep.name,
          name: ep.name,
          mediaType: "movie",
          seasonNumber: 1,
          episodeNumber: idx + 1,
          link: r
        };
      });
      var aresult = {
        id: String(link),
        type: "url",
        title: atitle,
        name: atitle,
        posterPath: acover,
        coverUrl: acover,
        backdropPath: acover,
        description: adesc,
        mediaType: "tv",
        playerType: "app",
        link: String(link)
      };
      aresult.episodeItems = childItems;
      aresult.childItems = childItems;
      return aresult;
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

// 递归搜集 params 里的全部字符串（运行时传参形态不完全确定，逐个试解，学 MISSAV 的防御写法）
function collectStrings(v, out, depth) {
  if (v == null || depth > 4) return out;
  if (typeof v === "string") { if (v) out.push(v); return out; }
  if (typeof v !== "object") return out;
  if (Array.isArray(v)) {
    for (var i = 0; i < v.length; i++) collectStrings(v[i], out, depth + 1);
    return out;
  }
  var keys = Object.keys(v);
  for (var j = 0; j < keys.length; j++) collectStrings(v[keys[j]], out, depth + 1);
  return out;
}

// 有声播放解析（stream 模块）：
// - 单集引用带 u= 时直返；带章节 id 时走 /audio/app/audio/chapter 换地址（蜘蛛同款）
// - 收到整部有声引用时，逐集解析（连续 3 集拿不到地址就停，与禁果模块同口径）
// - 入参形态不确定时：递归搜集所有字符串逐个试解；裸数字 id 先按作品试、再按章节试
async function loadResource(params) {
  params = params || {};
  try {
    var cands = [];
    var pri = [params.link, params.url, params.id];
    for (var p = 0; p < pri.length; p++) if (typeof pri[p] === "string" && pri[p]) cands.push(pri[p]);
    collectStrings(params, cands, 0);
    var seen = {};
    var uniq = [];
    for (var c = 0; c < cands.length; c++) {
      if (!seen[cands[c]]) { seen[cands[c]] = 1; uniq.push(cands[c]); }
    }

    var epRef = null, workRef = null, bareId = "";
    for (var i = 0; i < uniq.length; i++) {
      var r = parseRef(uniq[i]);
      if (r.kind === "audioep" && !epRef) epRef = { str: uniq[i], ref: r };
      else if (r.kind === "audio" && !workRef) workRef = { str: uniq[i], ref: r };
      else if (!bareId && /^\d{6,}$/.test(uniq[i])) bareId = uniq[i];
    }

    if (epRef) {
      var direct = queryParam(epRef.ref.query, "u");
      if (direct) return [{ name: "播放", url: await audioWrap(direct), playerType: "app", customHeaders: { "User-Agent": UA } }];
      var url = await chapterUrlOf(epRef.ref.id);
      if (!url) return [];
      return [{ name: "播放", url: await audioWrap(url), playerType: "app", customHeaders: { "User-Agent": UA } }];
    }

    var workStr = workRef ? workRef.str : (bareId ? "march://audio/" + bareId : "");
    if (workStr) {
      var detail = await loadDetail(workStr);
      if (!detail) return [];
      // 单集直达 detail：直接就是可播资源
      if (detail.type === "detail" && detail.videoUrl) {
        return [{ name: "播放", url: detail.videoUrl, playerType: "app", customHeaders: { "User-Agent": UA } }];
      }
      var items = detail.childItems || detail.episodeItems || [];
      var out = [];
      var misses = 0;
      for (var j = 0; j < items.length; j++) {
        var one = await loadResource({ link: items[j].link });
        if (!one.length) {
          misses++;
          if (misses >= 3) break;
          continue;
        }
        misses = 0;
        out.push({
          name: items[j].name || items[j].title || ("第" + (j + 1) + "集"),
          description: detail.title || "",
          url: one[0].url,
          playerType: "app",
          customHeaders: { "User-Agent": UA }
        });
      }
      if (out.length) return out;
      // 兜底：传进来的裸数字也许是章节 id 而非作品 id
      if (bareId && !workRef) {
        var curl = await chapterUrlOf(bareId);
        if (curl) return [{ name: "播放", url: await audioWrap(curl), playerType: "app", customHeaders: { "User-Agent": UA } }];
      }
      return out;
    }
    return [];
  } catch (e) {
    return [];
  }
}
