// ASMR for REX (lai_asmr v1.1.4)
// 移植自 mira-cat 蜘蛛 asmr.js（只读蓝图，逻辑等价移植）。
// 后端：api.asmr.one 公开 JSON API（asmr.one / ASMR Online 的数据接口）。
// 作品为多音轨音频：loadDetail 返回分轨（episodeItems/childItems），
// 播放由 stream 模块 loadResource 给出音轨直链（蜘蛛 play 口径：直链 + UA 头）。
// 音轨取流顺序与蜘蛛一致：streamLowQualityUrl 优先、mediaStreamUrl 兜底。
// 2026-10-21 真机修复（都提示找不到播放地址）：detail 对齐已验收的 mitao 分集形态——
//   child 的 id==link==不透明单轨引用（asmr://track/<作品id>?u=<直链>），不再直填流地址、
//   不再附带 episodes 键（旧版拿直链当 link 时，运行时若走 loadDetail 会把日期里的数字误当作品 id）；
//   loadDetail 收到单轨引用直接回可播 detail；loadResource 递归搜集 params 全部字符串逐个试解。
// 2026-10-21 二轮：形态对齐后真机仍播不了，而直链 HTTP 层（200/206/audio-mpeg/Range）全正常——
//   REX 播放器内核不播裸的渐进式音频直链（能播的全是 HLS 或视频文件）。改走 audio-hls Worker
//   把音频直链包成单段 HLS（/a?u=&d=）再播；Worker 未部署时探活失败自动回退直链（与一轮行为一致）。
// 2026-10-21 三轮：audio-hls 已部署上线，但真机仍播不了。两处改：
//   (1) Worker v2 把清单从"整文件单分片"改为 512KB BYTERANGE 多段（巨型单分片是不开播头号嫌疑）；
//   (2) 模块去掉探活短路——探活在真机上可能误判（Widget.http 形态与播放器不同）把模块打回
//       已知播不了的直链；Worker 已确认上线，音频路径无条件走包装。
// 2026-10-21 四轮：用户澄清症状是"解析不到播放地址、根本就没办法点播放"（详情侧无可点目标）。
//   冷进程 harness 复现：字符串 link 全链通（id/link 自包含、不依赖列表阶段内存）；但运行时
//   若把卡片/子项对象传给 loadDetail，旧版 String(对象)="[object Object]" 必回"参数错误"、
//   零集可点——已验收的 mitao 明确防对象入参，本轮对齐：loadDetail 兼容对象入参（取
//   link/id/url）；另 loadResource 把作品引用解析提到裸 https 兜底之前并排除图片地址——
//   旧顺序下入参含卡片对象时，会先命中封面图 https、把封面 JPG 当音频包进 audio-hls 返回。
// 2026-10-21 五轮：用户截图作品（RJ01718010，29 轨/7.96h）判别——冷进程实测 detail 只发
//   2 个请求（work+tracks，轨 URL 内嵌、无逐轨预取），全出参包装无裸链；慢点在两跳串行
//   （VM 合计 1.0~3.1s，work 接口单跳 0.58~2.16s）且 apiGet 无 timeout、连接挂死会无限转。
//   本轮：loadDetail 两跳改并发（Promise.all）；apiGet 加 timeout 25000（对齐 March），
//   挂死连接改为失败回错误卡而非无限等。判别全文见 ports/FIX_audio5.md。
// 2026-10-21 六轮（A 线，猫源契约对齐）：逐行对比猫源蜘蛛 asmr.js——蜘蛛 play 的契约是
//   裸直链 + parse:0 + UA 头，且该形态在 MiraPlayer 真机已证明可播；REX 历轮却把全部
//   音频出参换成 audio-hls 包装（唯一系统性偏离），而真机上包装链从未被证明能播。本轮：
//   (1) detail 主地址（单轨直达/单轨引用分支）改回猫源裸链 + UA 头；
//   (2) loadResource 每轨出两条并列线——「直链」猫源同款在前、「HLS」包装在后，用户可切换对比；
//   (3) 模块 UA 由 iPhone Safari 换回蜘蛛同款 Chrome/Android UA（API 与播放头与已证明组合一致）。
//   unwrapLink、超时+并发、无探活等已坐实的好修复保留。判别全文见 ports/FIX_audio6.md。

WidgetMetadata = {
id: "lai_asmr",
title: "ASMR",
description: "ASMR（asmr.one）：最新/新发/最热/高分/热议排序浏览与搜索，多音轨音频直链播放",
author: "lai",
version: "1.1.4",
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
var AUDIO_HLS = "https://audio-hls.li768435813.workers.dev";
// 音频直链 -> audio-hls 的 HLS 地址（Worker 已部署确认，无条件包装，不再探活回退直链）
async function audioWrap(url, dur) {
if (!url) return url;
var w = AUDIO_HLS + "/a?u=" + encodeURIComponent(url);
if (dur && dur > 0) w += "&d=" + Math.round(dur);
return w;
}
// UA 与猫源蜘蛛 asmr.js 逐字一致（蜘蛛 API 与 play 头共用此 UA，MiraPlayer 真机已证明可播）
var UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36";
var PAGE_SIZE = 20;
var ORDERS = ["create_date", "release", "dl_count", "rate_average_2dp", "review_count"];

function t(v) { return String(v == null? "": v).trim();}

function cleanTitle(s) {
return t(s).replace(/【/g, "[").replace(/】/g, "]").replace(/\$/g, "").replace(/#/g, "");
}

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
tracks.push({ name: cleanTitle(a.title) || ("音轨" + (tracks.length + 1)), url: url, dur: parseFloat(a.duration) || 0});
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

// 单轨引用：asmr://track/<作品id>?u=<直链>&t=<轨名>&d=<时长秒>（id==link 都用它，对齐 mitao 形态）
function trackRef(wid, name, url, dur) {
var r = "asmr://track/" + wid + "?u=" + encodeURIComponent(url || "") + "&t=" + encodeURIComponent(name || "");
if (dur && dur > 0) r += "&d=" + Math.round(dur);
return r;
}

function parseTrackRef(s) {
var m = String(s || "").match(/^asmr:\/\/track\/(\d+)\?u=([^&]*)(?:&t=([^&]*))?(?:&d=([\d.]+))?/);
if (!m) return null;
var u = "", t = "";
try { u = decodeURIComponent(m[2] || "");} catch (e) {}
try { t = decodeURIComponent(m[3] || "");} catch (e) {}
return { wid: m[1], url: u, name: t, dur: parseFloat(m[4]) || 0};
}

// 运行时可能把卡片/子项对象整个传进来（已验收的 mitao 同款防御）：先摊平成字符串
function unwrapLink(link) {
if (link && typeof link === "object") return String(link.link || link.id || link.url || "");
return String(link || "");
}

async function loadDetail(link) {
var url = unwrapLink(link);
// 运行时若拿单轨引用来走 loadDetail，直接回可播 detail（与 loadResource 双保险）
var tref = parseTrackRef(url);
if (tref && tref.url) {
return {
id: url,
type: "detail",
title: tref.name || "ASMR",
name: tref.name || "ASMR",
link: url,
// 六轮：主地址改回猫源契约裸链（蜘蛛 play = 裸链 + UA 头）；包装线在 loadResource 并列给出
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
// work 与 tracks 互不依赖（vid 已在 link 里）：并发取，详情耗时从两跳之和降到取大者
var both = await Promise.all([
apiGet("/api/work/" + encodeURIComponent(vid)),
fetchTracks(vid)
]);
var d = both[0];
if (!d ||!d.id) {
return { id: url, type: "url", title: "加载失败", description: "作品不存在或接口无响应"};
}
var cover = d.mainCoverUrl || d.samCoverUrl || "";
var title = cleanTitle(d.title) || vid;
var tracks = both[1];
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
// 六轮：主地址改回猫源契约裸链；包装线在 loadResource 并列给出
result.videoUrl = tracks[0].url;
result.customHeaders = { "User-Agent": UA};
} else if (tracks.length > 1) {
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

// 六轮双线：同一轨出两条并列资源——「直链」=猫源蜘蛛 play 同款（裸链 + UA 头，MiraPlayer 已证明），
// 「HLS」=audio-hls 包装。直链在前作默认，包装在后可切换对比。
async function twoLines(name, url, dur) {
var lines = [{ name: name + " · 直链", url: url, playerType: "app", customHeaders: { "User-Agent": UA}}];
var w = await audioWrap(url, dur);
if (w && w !== url) lines.push({ name: name + " · HLS", url: w, playerType: "app", customHeaders: { "User-Agent": UA}});
return lines;
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
return await twoLines(tr.name || "播放", tr.url, tr.dur);
}
}
// 2) 作品引用 / 裸 id -> 全部音轨（排在裸 https 兜底之前：入参若含卡片对象，
//    封面图 https 同在候选里，旧顺序会先把封面当音频包走、永远到不了这一步）
var vid = "";
for (var k = 0; k < uniq.length; k++) {
if (uniq[k].indexOf("asmr://") === 0 || /^\d+$/.test(uniq[k])) { vid = parseWorkId(uniq[k]); if (vid) break;}
}
if (vid) {
var tracks = await fetchTracks(vid);
var outRes = [];
for (var q = 0; q < tracks.length; q++) {
var epName = ("0" + (q + 1)).slice(-2) + " " + tracks[q].name;
var pair = await twoLines(epName, tracks[q].url, tracks[q].dur);
for (var z = 0; z < pair.length; z++) outRes.push(pair[z]);
}
if (outRes.length) return outRes;
}
// 3) 直链（旧形态兼容；跳过图片地址，避免误把封面/海报当音频）
for (var j = 0; j < uniq.length; j++) {
if (/^https?:\/\//i.test(uniq[j]) && !/\.(jpe?g|png|webp|gif|bmp|svg)(\?|#|$)/i.test(uniq[j])) {
return await twoLines("播放", uniq[j], 0);
}
}
return [];
} catch (e) {
return [];
}
}
