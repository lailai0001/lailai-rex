// ASMR for REX (lai_asmr v2.0.0) —— 2026-10-22 从零重写，替换 v1.x
// 蓝图：mira-cat 蜘蛛 asmr.js（只读，未改动猫源）。后端：api.asmr.one 公开 JSON API。
//
// v1.x 六轮修复后真机有声仍不可用。复盘坐实的问题不在取链
// （字段/接口与蜘蛛一致），而在播放结构层叠打补丁：detail 里塞 videoUrl、
// loadResource 里递归捞字符串试解、地址一会儿包装一会儿裸链，形态从未与
// 包内已真机验收的组件对齐。本版换架构，不再在 v1.x 上叠补丁。
//
//
// - loadDetail 只回"详情壳"：type:"url"、id 原样回显入参 link（mitao 注释坐实：
// 详情 id 与所点卡 id 不一致，运行时会判"资源已变化"拒播）、封面/标题/简介；
// >1 轨时才给 episodeItems/childItems（child 的 id==link==单轨引用），
// 单轨时不给子项——与 mitao 单集形态一致。
// - detail 任何形态都不给 videoUrl：音频播放一律由 stream 模块 loadResource
// 解析（mitao 的播放只走 loadResource，已真机证明；March 有声单集恰死在
// detail+videoUrl 槽位，包过的、裸的都无限加载）。
// - loadDetail 收到单轨引用时回其所属作品的壳（学 mitao：拿子项 link 进
// loadDetail 也回整壳），id 仍回显入参本身。
// - loadResource 入参口径学 mitao：params.link / params.id / params.item.*
// 优先，外加 JSON 字符串入参防御与递归捞字符串兜底（防御层序不变）。
//
//
// - 猫源契约：裸直链 + UA 头（蜘蛛 play = parse:0 + Chrome/Android UA），
// 取流 streamLowQualityUrl || mediaStreamUrl；该形态在 MiraPlayer 可播。
// → 每轨第一条线「· 直链」与蜘蛛逐字同款（裸链 + 同款 UA 头）。
// - audio-hls v3 已部署（真分片清单）：每轨第二条线「· HLS」= /a?u=&d= 包装，
// 与直链并列，一次真机点播即可判死判活。
// - 真机以卡片对象调 loadDetail（四轮冷进程 harness 坐实）：unwrapLink 摊平
// 对象入参（取 link/id/url），loadResource 同样兼容 {item: 卡片}。
// - 全部请求带 timeout 25000（五轮坐实：无 timeout 的 apiGet 遇连接挂死
// 会让详情页资源区无限转圈）；detail 的 work 与 tracks 两跳并发。
// - 解析顺序（四轮坐实）：单轨引用 → 作品引用 → 裸 https 兜底且跳过图片
// 地址，避免入参含卡片对象时把封面 JPG 当音频地址。

WidgetMetadata = {
id: "lai_asmr",
title: "ASMR",
description: "ASMR（asmr.one）：最新/新发/最热/高分/热议排序浏览与搜索，多音轨音频播放",
author: "lai",
version: "2.0.0",
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
{
id: "loadResource",
title: "播放资源",
description: "音频播放解析（直链/HLS 双线）",
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

var API = "https://api.asmr.one";
var AUDIO_HLS = "https://audio-hls.li768435813.workers.dev";
// UA 与猫源蜘蛛 asmr.js 逐字一致（蜘蛛 API 头与 play 头共用，MiraPlayer 已证明可播）
var UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36";
var PAGE_SIZE = 20;
var ORDERS = ["create_date", "release", "dl_count", "rate_average_2dp", "review_count"];

function t(v) { return String(v == null? "": v).trim();}

function cleanTitle(s) {
return t(s).replace(/【/g, "[").replace(/】/g, "]").replace(/\$/g, "").replace(/#/g, "");
}

// 全部请求必带 timeout：无超时请求遇连接挂死会让调用方无限等待（五轮坐实）
async function apiGet(path) {
try {
var res = await Widget.http.get(API + path, {
headers: { "User-Agent": UA, "Accept": "application/json", "Referer": "https://www.asmr.one/"},
timeout: 25000
});
var data = res && res.data!= null? res.data: null;
if (data == null) return {};
if (typeof data === "object") return data;
try { return JSON.parse(String(data));} catch (e) { return {};}
} catch (e) {
return {};
}
}

/* ---------------- 引用（link）设计：全部自包含，不依赖进程内状态 ----------------
* 作品：asmr://work/<作品id>
* 单轨：asmr://track/<作品id>?u=<直链>&t=<轨名>&d=<时长秒>（id==link 都用它） */

function trackRef(wid, name, url, dur) {
var r = "asmr://track/" + wid + "?u=" + encodeURIComponent(url || "") + "&t=" + encodeURIComponent(name || "");
if (dur && dur > 0) r += "&d=" + Math.round(dur);
return r;
}

function parseTrackRef(s) {
var m = String(s || "").match(/^asmr:\/\/track\/(\d+)\?u=([^&]*)(?:&t=([^&]*))?(?:&d=([\d.]+))?/);
if (!m) return null;
var u = "", tn = "";
try { u = decodeURIComponent(m[2] || "");} catch (e) {}
try { tn = decodeURIComponent(m[3] || "");} catch (e) {}
return { wid: m[1], url: u, name: tn, dur: parseFloat(m[4]) || 0};
}

function parseWorkId(s) {
var v = String(s || "");
var m = v.match(/asmr:\/\/work\/(\d+)/);
if (m) return m[1];
m = v.match(/(\d{3,})/);
return m? m[1]: "";
}

// 入参摊平：运行时可能把卡片/子项对象整个传进来（四轮坐实），取 link/id/url
function unwrapLink(link) {
if (link && typeof link === "object") return String(link.link || link.id || link.url || "");
return String(link == null? "": link);
}

/* ---------------- 列表 / 搜索 ---------------- */

function rowsToCards(rows) {
var out = [];
var list = Array.isArray(rows)? rows: [];
for (var i = 0; i < list.length; i++) {
var w = list[i];
if (!w || w.id == null || w.id === "") continue;
var wid = String(w.id);
var cover = w.mainCoverUrl || w.samCoverUrl || "";
var link = "asmr://work/" + wid;
out.push({
id: link,
type: "url",
title: cleanTitle(w.title) || wid,
name: cleanTitle(w.title) || wid,
posterPath: cover,
coverUrl: cover,
backdropPath: cover,
link: link,
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

/* ---------------- 详情（mitao 壳形态） ---------------- */

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

// 一个作品的全部音轨：[{ name, url, dur}]，取流顺序与蜘蛛逐字一致
async function fetchTracks(vid) {
var td = await apiGet("/api/tracks/" + encodeURIComponent(vid) + "?v=2");
var audio = collectAudio(Array.isArray(td)? td: []);
var tracks = [];
for (var i = 0; i < audio.length; i++) {
var a = audio[i];
var url = a.streamLowQualityUrl || a.mediaStreamUrl || "";
if (!url) continue;
tracks.push({
name: cleanTitle(a.title) || ("音轨" + (tracks.length + 1)),
url: url,
dur: parseFloat(a.duration) || 0
});
}
return tracks;
}

async function loadDetail(link) {
var input = unwrapLink(link);
// 单轨引用进来时，落到其所属作品（学 mitao：子项 link 进 loadDetail 也回整壳）
var tref = parseTrackRef(input);
var vid = tref? tref.wid: parseWorkId(input);
if (!vid) {
return { id: input, type: "url", title: "参数错误", description: "无法识别作品 id", link: input};
}
try {
// work 与 tracks 互不依赖，并发取（五轮：串行两跳在真机网络上叠加延迟）
var both = await Promise.all([
apiGet("/api/work/" + encodeURIComponent(vid)),
fetchTracks(vid)
]);
var d = both[0];
if (!d ||!d.id) {
return { id: input, type: "url", title: "加载失败", description: "作品不存在或接口无响应", link: input};
}
var tracks = both[1];
var cover = d.mainCoverUrl || d.samCoverUrl || "";
var title = cleanTitle(d.title) || vid;
// 详情壳：id 原样回显入参（mitao 坐实：与所点卡 id 不一致会被判"资源已变化"）
var shell = {
id: input,
type: "url",
title: title,
name: title,
link: input,
posterPath: cover,
coverUrl: cover,
backdropPath: cover,
description: "社团: " + (d.name || "") + (tracks.length? (" / 共" + tracks.length + "轨"): "（未找到可播放音轨）"),
mediaType: "movie",
playerType: "app"
};
// mitao 形态：>1 集才给子项；单轨作品不给子项、detail 不给 videoUrl，
// 播放由 loadResource 凭作品 link 解析（与 mitao 单集走 stream 模块一致）
if (tracks.length > 1) {
var childItems = tracks.map(function (tr, i) {
var epName = ("0" + (i + 1)).slice(-2) + " " + tr.name;
var r = trackRef(vid, tr.name, tr.url, tr.dur);
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
shell.episodeItems = childItems;
shell.childItems = childItems;
}
return shell;
} catch (e) {
return { id: input, type: "url", title: "请求错误", description: String((e && e.message) || e), link: input};
}
}

/* ---------------- 播放解析（stream 模块，双线） ---------------- */

// 直链 -> audio-hls v3 的 HLS 地址（纯字符串拼接，无网络调用）
function hlsOf(url, dur) {
if (!url) return "";
var w = AUDIO_HLS + "/a?u=" + encodeURIComponent(url);
if (dur && dur > 0) w += "&d=" + Math.round(dur);
return w;
}

// 每轨双线：「· 直链」猫源蜘蛛 play 同款（裸链 + 蜘蛛 UA 头，默认在前）；
// 「· HLS」audio-hls v3 包装线（备选）。两条同集并列，判别能力保留。
function twoLines(name, url, dur) {
var lines = [{
name: name + " · 直链",
description: "猫源同款直链",
url: url,
playerType: "app",
customHeaders: { "User-Agent": UA}
}];
var w = hlsOf(url, dur);
if (w && w!== url) {
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

// 入参归一：对象取 link/id（再 item.link/item.id），字符串先试 JSON 解析、否则本身即引用
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

async function loadResource(params) {
try {
var uniq = resourceCandidates(params);
if (!uniq.length) return [];

// 1) 单轨引用：引用内自带直链，零网络解析
for (var i = 0; i < uniq.length; i++) {
var tr = parseTrackRef(uniq[i]);
if (tr && tr.url) return twoLines(tr.name || "播放", tr.url, tr.dur);
}

// 2) 作品引用 / 裸作品 id：拉全轨出线（排在裸 https 之前——入参含卡片
// 对象时封面图也在候选里，旧顺序会先把封面当音频返回，四轮坐实）
var vid = "";
for (var k = 0; k < uniq.length; k++) {
if (uniq[k].indexOf("asmr://") === 0 || /^\d+$/.test(uniq[k])) {
vid = parseWorkId(uniq[k]);
if (vid) break;
}
}
if (vid) {
var tracks = await fetchTracks(vid);
var out = [];
for (var q = 0; q < tracks.length; q++) {
var epName = ("0" + (q + 1)).slice(-2) + " " + tracks[q].name;
var pair = twoLines(epName, tracks[q].url, tracks[q].dur);
for (var z = 0; z < pair.length; z++) out.push(pair[z]);
}
if (out.length) return out;
}

// 3) 裸直链兜底（旧形态兼容；跳过图片地址，避免把封面/海报当音频）
for (var j = 0; j < uniq.length; j++) {
if (/^https?:\/\//i.test(uniq[j]) &&!/\.(jpe?g|png|webp|gif|bmp|svg)(\?|#|$)/i.test(uniq[j])) {
return twoLines("播放", uniq[j], 0);
}
}
return [];
} catch (e) {
return [];
}
}
