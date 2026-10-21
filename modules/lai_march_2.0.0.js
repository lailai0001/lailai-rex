// March视频 for REX (lai_march v2.0.0) —— 2026-10-22 从零重写，替换 v1.x
// 蓝图：mira-cat 蜘蛛 march.js (py_march)，只读，未改动猫源。
// 后端：March App 的 JSON API (https://api.march24168.online)，封面/媒体走 cdn.uameta.ai。
// 与蜘蛛一致：内置用户授权账号登录拿 token；四类内容 视频/有声/漫画/小说。
//
// v1.x 有声六轮修复仍不可用。复盘：取链字段/接口/登录与蜘蛛
// 一致，坏在播放结构层叠打补丁。本版换架构，不在 v1.x 上再叠补丁。
//
//
// - 视频：历轮真机反馈正常，本版逐项保留现行已证明形态——列表项自带
// title/coverUrl/url(m3u8)，详情走 type:"detail" + videoUrl 裸链
// （站点 video intro 接口当前回 fail/model:null，蜘蛛同样受影响，
// 故详情用列表自带字段组装，不依赖 intro）。此路径一字不改口径。
// - 有声：改走包内已真机验收的 mitao 形态——loadDetail 只回详情壳
// （type:"url"、id 原样回显入参、>1 集才给 episodeItems/childItems、
// child 的 id==link==单集引用），detail 不再给 videoUrl（有声单集恰死在
// 这个槽位：包装地址与裸链两种形态都无限加载，而 mitao 的"壳 +
// stream 模块解析"是包内已证明能播的唯一播放结构）。播放一律由
// loadResource 解析，每集双线：「· 直链」猫源同款默认 + 「· HLS」备线。
// - 漫画/小说：与蜘蛛同口径，只出详情信息、无可播内容（蜘蛛 play 为空）。
//
//
// - 猫源契约：裸直链 + UA 头（蜘蛛 play = 裸链 + Dart/3.11 UA），有声靠
// intro 的 latestReadChapterUrl 或逐章 chapter 接口的 chapterUrl。
// - 真机以卡片对象调 loadDetail（四轮冷进程坐实）：unwrapLink 摊平入参。
// - 全部请求带 timeout 25000（蜘蛛同值）；登录 token 每进程重新拿，
// 不依赖列表阶段内存（视频详情的 url 本身嵌在卡 link 里，自包含）。
// - March 站方已不下发 chapters（四轮采样坐实）：多章有声只能播第 1 集
// 是站方缺口，与蜘蛛同口径；chapters 真出现时本版按蜘蛛口径在详情期
// 并发逐章取址、嵌进单集引用，loadResource 亦可懒取，双路都通。

WidgetMetadata = {
id: "lai_march",
title: "March视频",
description: "March视频：视频（FC2/MOODYZ/S1/加勒比/一本道/麻豆传媒）、有声、漫画、小说，App API 直取",
author: "lai",
version: "2.0.0",
requiredVersion: "0.0.1",
site: "https://api.march24168.online",
detailCacheDuration: 180,
modules: [
{
title: "视频",
functionName: "loadList",
cacheDuration: 180,
params: [
{ name: "cat", title: "类别", type: "constant", value: "video"},
{
name: "sub",
title: "分类",
type: "enumeration",
value: "",
enumOptions: [
{ title: "全部", value: ""},
{ title: "FC2", value: "FC2"},
{ title: "MOODYZ", value: "MOODYZ"},
{ title: "S1 No. 1 Style", value: "S1"},
{ title: "加勒比", value: "加勒比"},
{ title: "一本道", value: "一本道"},
{ title: "麻豆传媒", value: "麻豆传媒"}
]
},
{ name: "page", title: "页码", type: "page", value: "1"}
]
},
{
title: "有声",
functionName: "loadList",
cacheDuration: 180,
params: [
{ name: "cat", title: "类别", type: "constant", value: "audio"},
{
name: "sub",
title: "分类",
type: "enumeration",
value: "",
enumOptions: [
{ title: "全部", value: ""},
{ title: "有声小说", value: "有声小说"},
{ title: "淫词艳曲", value: "淫词艳曲"},
{ title: "激情骚麦", value: "激情骚麦"},
{ title: "寸止训练", value: "寸止训练"},
{ title: "ASMR", value: "ASMR"}
]
},
{ name: "page", title: "页码", type: "page", value: "1"}
]
},
{
title: "漫画",
functionName: "loadList",
cacheDuration: 180,
params: [
{ name: "cat", title: "类别", type: "constant", value: "comic"},
{
name: "sub",
title: "分类",
type: "enumeration",
value: "",
enumOptions: [
{ title: "全部", value: ""},
{ title: "全彩", value: "全彩"},
{ title: "剧情", value: "剧情"},
{ title: "巨乳大奶", value: "巨乳大奶"},
{ title: "内射中出", value: "内射中出"},
{ title: "不伦", value: "不伦"},
{ title: "单女", value: "单女"},
{ title: "单男", value: "单男"}
]
},
{ name: "page", title: "页码", type: "page", value: "1"}
]
},
{
title: "小说",
functionName: "loadList",
cacheDuration: 180,
params: [
{ name: "cat", title: "类别", type: "constant", value: "novel"},
{
name: "sub",
title: "分类",
type: "enumeration",
value: "",
enumOptions: [
{ title: "全部", value: ""},
{ title: "校园", value: "校园"},
{ title: "都市", value: "都市"},
{ title: "古代", value: "古代"},
{ title: "NP", value: "NP"},
{ title: "剧情", value: "剧情"},
{ title: "甜文", value: "甜文"},
{ title: "百合", value: "百合"},
{ title: "纯爱", value: "纯爱"}
]
},
{ name: "page", title: "页码", type: "page", value: "1"}
]
},
{
id: "loadResource",
title: "March播放源",
description: "有声播放解析（直链/HLS 双线）",
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
{ name: "keyword", title: "关键词", type: "input"},
{ name: "page", title: "页码", type: "page"}
]
}
};

var API = "https://api.march24168.online";
var CDN = "https://cdn.uameta.ai/file/bucket-media";
var UA = "Dart/3.11 (dart:io)";
var AUDIO_HLS = "https://audio-hls.li768435813.workers.dev";

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
var h = { "User-Agent": UA, "Accept-Encoding": "gzip"};
if (_token) h["token"] = _token;
return h;
}

// 全部请求必带 timeout 25000（蜘蛛同值；无超时请求挂死会让调用方无限等待）
async function postJson(url) {
if (!Widget.http || typeof Widget.http.post!== "function") return null;
try {
var res = await Widget.http.post(url, "{}", { headers: apiHeaders(), timeout: 25000});
if (!res || res.data == null) return null;
if (typeof res.data === "object") return res.data;
try { return JSON.parse(String(res.data));} catch (e) { return null;}
} catch (e) {
return null;
}
}

async function getJson(url) {
try {
var res = await Widget.http.get(url, { headers: apiHeaders(), timeout: 25000});
if (!res || res.data == null) return null;
if (typeof res.data === "object") return res.data;
try { return JSON.parse(String(res.data));} catch (e) { return null;}
} catch (e) {
return null;
}
}

async function login() {
if (_token) return true;
var ln = b64Decode(_LN_B64);
var pw = b64Decode(_PW_B64);
if (!ln ||!pw) return false;
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
return parts.length? "?" + parts.join("&"): "";
}

// 与蜘蛛 apiGet 同口径：code===0 且 model 非空才算成功（视频 intro 的 fail/model:null 判失败）
async function apiGet(path, params) {
if (!(await login())) return null;
var obj = await getJson(API + path + qs(params));
if (obj && obj.code === 0 && obj.model!= null) return obj.model;
return null;
}

function coverOf(item) {
var c = (item && (item.coverUrl || item.cover)) || "";
if (!c) return "";
if (/^https?:\/\//i.test(c)) return c;
return c.charAt(0) === "/"? CDN + c: "";
}

/* ---------------- 列表 / 搜索 ---------------- */

// 视频详情靠列表自带字段组装（intro 不可用），按 id 缓存最近见过的条目；
// 注意：视频播放地址同时嵌在卡 link 的?u= 里，冷进程凭 link 即可播放，
// 缓存只补标题/封面，丢了不影响播放（四轮坐实）。
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
name: item.title || item.number || "未命名",
posterPath: cover,
coverUrl: cover,
backdropPath: cover,
link: link,
description: remarks,
mediaType: kind === "video"? "movie": "tv"
};
}

var LIST_CONF = {
video: { path: "/video/app/video/search", base: { orderType: 2, size: 50}, subKey: "author", subSearchType: 2},
audio: { path: "/audio/app/audio/search", base: { orderType: 1, searchType: 1, size: 42}, subKey: "category"},
comic: { path: "/comic/app/comic/search", base: { orderType: 2, size: 50}, subKey: "tag"},
novel: { path: "/novel/app/novel/search", base: { orderType: 2, size: 50}, subKey: "tag"}
};

async function fetchList(kind, page, sub, keyword) {
var conf = LIST_CONF[kind];
if (!conf) return [];
var params = {};
Object.keys(conf.base).forEach(function (k) { params[k] = conf.base[k];});
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
if (data[i] && data[i].id!= null) out.push(toCard(kind, data[i]));
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
return cards.length? cards: [{ id: "empty", type: "url", title: "没有找到相关内容"}];
} catch (e) {
var msg = String((e && e.message) || e);
return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg}];
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

// 搜索：四类各走本站 /search 端点的 keyword 参数（VM 实测均真过滤），顺序合并
async function search(params) {
params = params || {};
var keyword = pickKeyword(params);
if (!keyword) return [{ id: "tip", type: "url", title: "输入关键词后搜索"}];
var page = parseInt(params.page, 10) || 1;
try {
var kinds = ["video", "audio", "comic", "novel"];
var out = [];
for (var i = 0; i < kinds.length; i++) {
var part = await fetchList(kinds[i], page, "", keyword);
for (var j = 0; j < part.length; j++) out.push(part[j]);
}
return out.length? out: [{ id: "empty", type: "url", title: "没有找到相关内容"}];
} catch (e) {
var msg = String((e && e.message) || e);
return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg}];
}
}

/* ---------------- 引用（link）设计：全部自包含 ----------------
* 内容：march://<video|audio|comic|novel>/<id>（视频另带?u=<m3u8>）
* 单集：march://audioep/<章节id>?w=<作品id>[&u=<直链>]（u 有则免接口） */

function parseRef(link) {
var v = String(link || "");
var m = v.match(/^march:\/\/(video|audio|comic|novel|audioep)\/([^?]+)(?:\?(.*))?$/);
if (!m) return { kind: "", id: v, query: ""};
return { kind: m[1], id: m[2], query: m[3] || ""};
}

function queryParam(q, key) {
var parts = String(q || "").split("&");
for (var i = 0; i < parts.length; i++) {
var kv = parts[i].split("=");
if (kv[0] === key && kv[1]!= null) {
try { return decodeURIComponent(kv.slice(1).join("="));} catch (e) { return "";}
}
}
return "";
}

function epRefOf(workId, chid, directUrl) {
var s = "march://audioep/" + chid;
var q = [];
if (workId) q.push("w=" + encodeURIComponent(workId));
if (directUrl) q.push("u=" + encodeURIComponent(directUrl));
if (q.length) s += "?" + q.join("&");
return s;
}

// 入参摊平：运行时可能把卡片/子项对象整个传进来（四轮坐实），取 link/id/url
function unwrapLink(link) {
if (link && typeof link === "object") return String(link.link || link.id || link.url || "");
return String(link == null? "": link);
}

// 章节 id -> 播放地址（蜘蛛同款 /audio/app/audio/chapter）
async function chapterUrlOf(chid) {
if (chid == null || chid === "") return "";
var m = await apiGet("/audio/app/audio/chapter", { id: chid});
return m? (m.chapterUrl || m.url || ""): "";
}

// 有声作品的分集解析（detail 与 loadResource 共用，凭作品 id 现取、自包含）：
// [{ name, chid, directUrl}]。有 chapters 时按蜘蛛口径逐章取址——本版并发取
// （蜘蛛是串行，慢），取不到的集保留 chid 供点播时懒取；无 chapters 时兜底
// latestReadChapterUrl 单集（站方现状：chapters 不下发，多章只能第 1 集，
// 与蜘蛛同口径的站方缺口，如实保留）。
async function resolveAudioEpisodes(workId) {
var model = await apiGet("/audio/app/audio/intro", { id: workId});
if (!model) return { model: null, eps: []};
var eps = [];
var chapters = Array.isArray(model.chapters)? model.chapters: [];
for (var i = 0; i < chapters.length; i++) {
var ch = chapters[i];
if (!ch || ch.id == null) continue;
eps.push({
name: ch.title || ("第" + (ch.order || eps.length + 1) + "集"),
chid: ch.id,
directUrl: ""
});
}
if (eps.length) {
var capped = eps.slice(0, 80);
var urls = await Promise.all(capped.map(function (ep) { return chapterUrlOf(ep.chid);}));
for (var j = 0; j < capped.length; j++) capped[j].directUrl = urls[j] || "";
eps = capped.concat(eps.slice(80));
} else if (model.latestReadChapterUrl) {
eps.push({
name: model.latestReadChapter || "第1集",
chid: model.latestReadChapterId || workId,
directUrl: model.latestReadChapterUrl
});
}
return { model: model, eps: eps};
}

/* ---------------- 详情 ---------------- */

async function loadDetail(link) {
var input = unwrapLink(link);
var ref = parseRef(input);
try {
/* ===== 视频：现行已证明形态，逐项保留（type:"detail" + videoUrl 裸链） ===== */
if (ref.kind === "video") {
var item = _itemCache[String(ref.id)] || {};
var videoUrl = queryParam(ref.query, "u") || item.url || "";
var vcover = item.coverUrl? coverOf(item): "";
var vtitle = item.title || "March视频";
if (!videoUrl) {
return { id: input, type: "url", title: vtitle, posterPath: vcover, coverUrl: vcover, backdropPath: vcover, link: input, description: "未找到播放地址"};
}
return {
id: input,
type: "detail",
title: vtitle,
name: vtitle,
link: input,
posterPath: vcover,
coverUrl: vcover,
backdropPath: vcover,
videoUrl: videoUrl,
playerType: "app",
description: item.brief || item.description || item.categories || "",
mediaType: "movie",
customHeaders: { "User-Agent": UA}
};
}

/* ===== 有声：mitao 壳形态（detail 不给 videoUrl，播放走 loadResource） ===== */
if (ref.kind === "audio" || ref.kind === "audioep") {
var workId = ref.kind === "audio"? ref.id: queryParam(ref.query, "w");
if (!workId) {
// 无作品 id 的单集引用（旧形态）：只回显壳，播放由 loadResource 凭章节 id 解析
return { id: input, type: "url", title: "March有声", link: input, mediaType: "movie", playerType: "app"};
}
var resolved = await resolveAudioEpisodes(workId);
var model = resolved.model;
if (!model) return { id: input, type: "url", title: "加载失败", link: input};
var acover = coverOf(model);
var atitle = model.title || "";
var shell = {
id: input,
type: "url",
title: atitle,
name: atitle,
link: input,
posterPath: acover,
coverUrl: acover,
backdropPath: acover,
description: model.intro || model.brief || (resolved.eps.length? "": "（站方未给出可播放章节）"),
mediaType: "movie",
playerType: "app"
};
// mitao 形态：>1 集才给子项；单集不给子项、detail 不给 videoUrl
if (resolved.eps.length > 1) {
var childItems = resolved.eps.map(function (ep, idx) {
var r = epRefOf(workId, ep.chid, ep.directUrl);
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
shell.episodeItems = childItems;
shell.childItems = childItems;
}
return shell;
}

/* ===== 漫画/小说：与蜘蛛同口径，只出详情信息 ===== */
if (ref.kind === "comic" || ref.kind === "novel") {
var path = ref.kind === "comic"? "/comic/app/comic/intro": "/novel/app/novel/intro";
var cm = await apiGet(path, { id: ref.id});
if (!cm) return { id: input, type: "url", title: "加载失败", link: input};
var ccover = coverOf(cm);
return {
id: input,
type: "url",
title: cm.title || "",
name: cm.title || "",
posterPath: ccover,
coverUrl: ccover,
backdropPath: ccover,
description: cm.brief || cm.description || "",
link: input
};
}

return { id: input, type: "url", title: "参数错误", link: input};
} catch (e) {
return { id: input, type: "url", title: "请求错误", description: String((e && e.message) || e), link: input};
}
}

/* ---------------- 播放解析（stream 模块，有声双线） ---------------- */

// mp3 直链 -> audio-hls v3 的 HLS 地址（纯字符串拼接；March 无时长口径，不带 d）
function hlsOf(url) {
if (!url) return "";
return AUDIO_HLS + "/a?u=" + encodeURIComponent(url);
}

// 每集双线：「· 直链」猫源蜘蛛 play 同款（裸链 + Dart UA 头，默认在前）；
// 「· HLS」audio-hls v3 包装线（备选）。判别能力保留：一次点播判死判活。
function twoLines(name, rawUrl) {
var lines = [{
name: name + " · 直链",
description: "猫源同款直链",
url: rawUrl,
playerType: "app",
customHeaders: { "User-Agent": UA}
}];
var w = hlsOf(rawUrl);
if (w && w!== rawUrl) {
lines.push({
name: name + " · HLS",
description: "audio-hls 分片清单",
url: w,
playerType: "app",
customHeaders: { "User-Agent": UA}
});
}
return lines;
}

// 递归搜集 params 里的全部字符串（运行时传参形态不完全确定时的兜底渔网）
function collectStrings(v, out, depth) {
if (v == null || depth > 4) return out;
if (typeof v === "string") { if (v) out.push(v); return out;}
if (typeof v!== "object") return out;
if (Array.isArray(v)) {
for (var i = 0; i < v.length; i++) collectStrings(v[i], out, depth + 1);
return out;
}
var keys = Object.keys(v);
for (var j = 0; j < keys.length; j++) collectStrings(v[keys[j]], out, depth + 1);
return out;
}

// 入参归一（学 mitao）：params.link / params.id / params.item.* 优先，
// 外加 JSON 字符串入参防御与递归捞字符串兜底
function resourceCandidates(params) {
var cands = [];
if (params == null) return cands;
if (typeof params === "string") {
var s = params.trim();
if (s) {
try {
var parsed = JSON.parse(s);
if (parsed && typeof parsed === "object") return resourceCandidates(parsed);
} catch (e) {}
cands.push(s);
}
return cands;
}
if (typeof params!== "object") return cands;
var pri = [params.link, params.id, params.url];
if (params.item && typeof params.item === "object") {
pri.push(params.item.link, params.item.id, params.item.url);
}
for (var i = 0; i < pri.length; i++) {
if (typeof pri[i] === "string" && pri[i]) cands.push(pri[i]);
}
collectStrings(params, cands, 0);
var seen = {}, uniq = [];
for (var j = 0; j < cands.length; j++) {
if (!seen[cands[j]]) { seen[cands[j]] = 1; uniq.push(cands[j]);}
}
return uniq;
}

// 有声播放解析：
// - 单集引用带 u= 直返双线；只带章节 id 时走 chapter 接口换址（蜘蛛同款）
// - 整部有声引用：凭作品 id 现取分集逐集出线（连续 3 集拿不到地址就停）
// - 裸数字：先按作品试，失败再按章节 id 试（旧口径保留）
// - 视频引用不在此处解析（视频走 detail 的 videoUrl，现行已证明路径）
async function loadResource(params) {
try {
var uniq = resourceCandidates(params);

var epRef = null, workRef = null, bareId = "";
for (var i = 0; i < uniq.length; i++) {
var r = parseRef(uniq[i]);
if (r.kind === "audioep" &&!epRef) epRef = { str: uniq[i], ref: r};
else if (r.kind === "audio" &&!workRef) workRef = { str: uniq[i], ref: r};
else if (!bareId && /^\d{6,}$/.test(uniq[i])) bareId = uniq[i];
}

if (epRef) {
var direct = queryParam(epRef.ref.query, "u");
if (direct) return twoLines("播放", direct);
var url = await chapterUrlOf(epRef.ref.id);
if (!url) return [];
return twoLines("播放", url);
}

var workId = workRef? workRef.ref.id: bareId;
if (workId) {
var resolved = await resolveAudioEpisodes(workId);
var out = [];
var misses = 0;
for (var j = 0; j < resolved.eps.length; j++) {
var ep = resolved.eps[j];
var eu = ep.directUrl || (await chapterUrlOf(ep.chid));
if (!eu) {
misses++;
if (misses >= 3) break;
continue;
}
misses = 0;
var pair = twoLines(ep.name, eu);
for (var z = 0; z < pair.length; z++) out.push(pair[z]);
}
if (out.length) return out;
// 兜底：传进来的裸数字也许是章节 id 而非作品 id
if (bareId &&!workRef) {
var curl = await chapterUrlOf(bareId);
if (curl) return twoLines("播放", curl);
}
return out;
}
return [];
} catch (e) {
return [];
}
}
