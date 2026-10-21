// ASMR for REX (lai_asmr v1.0.0)
// 移植自 mira-cat 蜘蛛 asmr.js（只读蓝图，逻辑等价移植）。
// 后端：api.asmr.one 公开 JSON API（asmr.one / ASMR Online 的数据接口）。
// 作品为多音轨音频：loadDetail 返回分轨（episodeItems/childItems），
// 播放由 stream 模块 loadResource 给出音轨直链（蜘蛛 play 口径：直链 + UA 头）。
// 音轨取流顺序与蜘蛛一致：streamLowQualityUrl 优先、mediaStreamUrl 兜底。
// 2026-10-21 真机修复（都提示找不到播放地址）：detail 对齐已验收的 mitao 分集形态——
//   child 的 id==link==不透明单轨引用（asmr://track/<作品id>?u=<直链>），不再直填流地址、
//   不再附带 episodes 键（旧版拿直链当 link 时，运行时若走 loadDetail 会把日期里的数字误当作品 id）；
//   loadDetail 收到单轨引用直接回可播 detail；loadResource 递归搜集 params 全部字符串逐个试解。

WidgetMetadata = {
id: "lai_asmr",
title: "ASMR",
description: "ASMR（asmr.one）：最新/新发/最热/高分/热议排序浏览与搜索，多音轨音频直链播放",
author: "lai",
version: "1.0.0",
requiredVersion: "0.0.1",
site: "https://www.asmr.one",
detailCacheDuration: 180,
modules: [
{
title: "全部作品",
functionName: "loadList",
cacheDuration: 180,
params: [
{
name: "path",
title: "排序",
type: "enumeration",
value: "create_date",
enumOptions: [
{ title: "最新", value: "create_date"},
{ title: "新发", value: "release"},
{ title: "最热", value: "dl_count"},
{ title: "高分", value: "rate_average_2dp"},
{ title: "热议", value: "review_count"}
]
},
{ name: "page", title: "页码", type: "page", value: "1"}
]
},
{ id: "loadResource", title: "播放资源", description: "播放时给出音轨直链", functionName: "loadResource", type: "stream", cacheDuration: 0, params: []}
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

var API = "https://api.asmr.one";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var PAGE_SIZE = 20;
var ORDERS = ["create_date", "release", "dl_count", "rate_average_2dp", "review_count"];

function t(v) { return String(v == null? "": v).trim();}

function cleanTitle(s) {
return t(s).replace(/【/g, "[").replace(/】/g, "]").replace(/\$/g, "").replace(/#/g, "");
}

async function apiGet(path) {
try {
var res = await Widget.http.get(API + path, {
headers: { "User-Agent": UA, "Accept": "application/json", "Referer": "https://www.asmr.one/"}
});
var data = res && res.data!= null? res.data: null;
if (data == null) return {};
if (typeof data === "object") return data;
try { return JSON.parse(String(data));} catch (e) { return {};}
} catch (e) {
return {};
}
}

function rowsToCards(rows) {
var out = [];
var list = Array.isArray(rows)? rows: [];
for (var i = 0; i < list.length; i++) {
var w = list[i];
if (!w || w.id == null || w.id === "") continue;
var wid = String(w.id);
var cover = w.mainCoverUrl || w.samCoverUrl || "";
out.push({
id: "asmr://work/" + wid,
type: "url",
title: cleanTitle(w.title) || wid,
posterPath: cover,
coverUrl: cover,
backdropPath: cover,
link: "asmr://work/" + wid,
description: w.name? ("社团: " + w.name): "",
releaseDate: w.release || "",
mediaType: "movie"
});
}
return out;
}

async function loadList(params) {
params = params || {};
var order = String(params.path || params.cat || "create_date");
if (ORDERS.indexOf(order) < 0) order = "create_date";
var page = Math.max(1, parseInt(params.page, 10) || 1);
try {
var d = await apiGet("/api/works?order=" + order + "&sort=desc&page=" + page + "&pageSize=" + PAGE_SIZE);
var cards = rowsToCards(d && d.works);
return cards.length? cards: [{ id: "empty", type: "url", title: "没有找到相关作品"}];
} catch (e) {
return [{ id: "err", type: "url", title: "载入失败", description: String((e && e.message) || e)}];
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
var page = Math.max(1, parseInt(params.page, 10) || 1);
if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索"}];
try {
var d = await apiGet("/api/search/" + encodeURIComponent(wd) + "?order=create_date&sort=desc&page=" + page + "&pageSize=" + PAGE_SIZE);
var cards = rowsToCards(d && d.works);
return cards.length? cards: [{ id: "empty", type: "url", title: "没有找到相关作品"}];
} catch (e) {
return [{ id: "err", type: "url", title: "搜索失败", description: String((e && e.message) || e)}];
}
}

function collectAudio(node, out) {
out = out || [];
if (!node || typeof node!== "object") return out;
if (Array.isArray(node)) {
for (var i = 0; i < node.length; i++) collectAudio(node[i], out);
return out;
}
if (node.type === "audio") out.push(node);
var children = node.children || [];
for (var j = 0; j < children.length; j++) collectAudio(children[j], out);
return out;
}

// 拉一个作品的全部音轨：[{ name, url}]，取流顺序与蜘蛛一致
async function fetchTracks(vid) {
var td = await apiGet("/api/tracks/" + encodeURIComponent(vid) + "?v=2");
var audio = collectAudio(Array.isArray(td)? td: []);
var tracks = [];
for (var i = 0; i < audio.length; i++) {
var a = audio[i];
var url = a.streamLowQualityUrl || a.mediaStreamUrl || "";
if (!url) continue;
tracks.push({ name: cleanTitle(a.title) || ("音轨" + (tracks.length + 1)), url: url});
}
return tracks;
}

function parseWorkId(link) {
var s = String(link || "");
var m = s.match(/asmr:\/\/work\/(\d+)/);
if (m) return m[1];
m = s.match(/(\d{3,})/);
return m? m[1]: "";
}

// 单轨引用：asmr://track/<作品id>?u=<直链>&t=<轨名>（id==link 都用它，对齐 mitao 形态）
function trackRef(wid, name, url) {
return "asmr://track/" + wid + "?u=" + encodeURIComponent(url || "") + "&t=" + encodeURIComponent(name || "");
}

function parseTrackRef(s) {
var m = String(s || "").match(/^asmr:\/\/track\/(\d+)\?u=([^&]*)(?:&t=([^&]*))?/);
if (!m) return null;
var u = "", t = "";
try { u = decodeURIComponent(m[2] || "");} catch (e) {}
try { t = decodeURIComponent(m[3] || "");} catch (e) {}
return { wid: m[1], url: u, name: t};
}

async function loadDetail(link) {
var url = String(link || "");
// 运行时若拿单轨引用来走 loadDetail，直接回可播 detail（与 loadResource 双保险）
var tref = parseTrackRef(url);
if (tref && tref.url) {
return {
id: url,
type: "detail",
title: tref.name || "ASMR",
name: tref.name || "ASMR",
link: url,
videoUrl: tref.url,
playerType: "app",
customHeaders: { "User-Agent": UA}
};
}
var vid = parseWorkId(url);
if (!vid) {
return { id: url, type: "url", title: "参数错误", description: "无法识别作品 id"};
}
try {
var d = await apiGet("/api/work/" + encodeURIComponent(vid));
if (!d ||!d.id) {
return { id: url, type: "url", title: "加载失败", description: "作品不存在或接口无响应"};
}
var cover = d.mainCoverUrl || d.samCoverUrl || "";
var title = cleanTitle(d.title) || vid;
var tracks = await fetchTracks(vid);
var result = {
id: url,
type: "url",
title: title,
name: title,
link: url,
posterPath: cover,
coverUrl: cover,
backdropPath: cover,
description: "社团: " + (d.name || "") + (tracks.length? (" / 共" + tracks.length + "轨"): ""),
mediaType: "movie",
playerType: "app"
};
if (tracks.length === 1) {
result.type = "detail";
result.videoUrl = tracks[0].url;
result.customHeaders = { "User-Agent": UA};
} else if (tracks.length > 1) {
var childItems = tracks.map(function (tr, i) {
var epName = ("0" + (i + 1)).slice(-2) + " " + tr.name;
var r = trackRef(vid, tr.name, tr.url);
return {
id: r,
title: epName,
name: epName,
mediaType: "movie",
seasonNumber: 1,
episodeNumber: i + 1,
link: r
};
});
result.episodeItems = childItems;
result.childItems = childItems;
}
if (!tracks.length) {
result.description = (result.description || "") + "（未找到可播放音轨）";
}
return result;
} catch (e) {
return { id: url, type: "url", title: "请求错误", description: String((e && e.message) || e)};
}
}

// 递归搜集 params 里的全部字符串（运行时传参形态不完全确定，逐个试解）
function collectStrings(v, out, depth) {
if (v == null || depth > 4) return out;
if (typeof v === "string") { if (v) out.push(v); return out;}
if (typeof v !== "object") return out;
if (Array.isArray(v)) {
for (var i = 0; i < v.length; i++) collectStrings(v[i], out, depth + 1);
return out;
}
var keys = Object.keys(v);
for (var j = 0; j < keys.length; j++) collectStrings(v[keys[j]], out, depth + 1);
return out;
}

async function loadResource(params) {
params = params || {};
try {
var cands = [];
var pri = [params.link, params.url, params.id];
for (var p = 0; p < pri.length; p++) if (typeof pri[p] === "string" && pri[p]) cands.push(pri[p]);
collectStrings(params, cands, 0);
var seen = {}, uniq = [];
for (var c = 0; c < cands.length; c++) {
if (!seen[cands[c]]) { seen[cands[c]] = 1; uniq.push(cands[c]);}
}
if (!uniq.length) return [];
// 1) 单轨引用
for (var i = 0; i < uniq.length; i++) {
var tr = parseTrackRef(uniq[i]);
if (tr && tr.url) {
return [{ name: tr.name || "播放", url: tr.url, playerType: "app", customHeaders: { "User-Agent": UA}}];
}
}
// 2) 直链（旧形态兼容）
for (var j = 0; j < uniq.length; j++) {
if (/^https?:\/\//i.test(uniq[j])) {
return [{ name: "播放", url: uniq[j], playerType: "app", customHeaders: { "User-Agent": UA}}];
}
}
// 3) 作品引用 / 裸 id -> 全部音轨
var vid = "";
for (var k = 0; k < uniq.length; k++) {
if (uniq[k].indexOf("asmr://") === 0 || /^\d+$/.test(uniq[k])) { vid = parseWorkId(uniq[k]); if (vid) break;}
}
if (!vid) return [];
var tracks = await fetchTracks(vid);
return tracks.map(function (tr2, i2) {
return {
name: ("0" + (i2 + 1)).slice(-2) + " " + tr2.name,
url: tr2.url,
playerType: "app",
customHeaders: { "User-Agent": UA}
};
});
} catch (e) {
return [];
}
}
