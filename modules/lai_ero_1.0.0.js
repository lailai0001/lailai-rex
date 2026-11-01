// Ero for REX (lai_ero v1.0.0)
// 移植自 mira-cat 蜘蛛 py_ero.js（只读蓝图），后端 https://ero.to（WordPress + manyse CDN）。
// 列表：卡片 <a href="/vod|fc2/<id>/"><img src="...jpg"></a> + badge + 标题 clamp div，与蜘蛛同一套正则解析。
// 详情：vod 页脚本给出 videoLink/pndvd/versionSuffix，播放地址 = https://test.manyse.com/<videoLink>/<CODE>/play.m3u8（FHD 线）
// 及 <CODE>-M/play.m3u8（去码线，仅去码片有，须验活才出线）；fc2 页为 playUrls JSON 数组。
// 清晰度诚实说明：站方没有 1080p/720p 数字分档，只有 FHD 线与去码线两档，不编造数字清晰度。
// 验活口径与猫源一致：FHD 除明确 404 外一律出线（网络错误时 fail-open）；去码线须 GET 200 才出线，
// 网络错误时仅当页标签含モザイク除去才出线。
// 猫源详情走 fastify 本地 /proxy/m3u8 路由做清单改写，原因是分片是 TS 内容却用.jpeg 后缀
// 下发、严格 HLS 内核会拒分片。REX 没有 fastify、也没有可改写清单的已部署 Ero 专用 Worker，
// 因此本模块直出源清单地址（已实测：test.manyse.com/2611/JERA-055/play.m3u8 回真 #EXTM3U，分片为相对路径.jpeg）。
// 直出在宽松播放器上可播、在严格 HLS 内核上可能因.jpeg 分片建不起时间轴——这是如实记录的 blocker，
// 不是已解决：不要把直出当成改写已完成；等真机验，严格内核不过再议专用改写 Worker。绝不假装本地路由存在。
// 字幕：猫源有字幕聚合线，但其 6 秒预算依赖计时器，REX 沙箱禁计时器，无法照搬；本模块暂不接字幕线，见遗留风险。

WidgetMetadata = {
id: "lai_ero",
title: "Ero",
description: "Ero（ero.to）：最新/无码流出/巨乳等分类，详情直出 manyse FHD 清单（去码线验活后出线）",
author: "lai",
version: "1.0.0",
requiredVersion: "0.0.1",
site: "https://ero.to",
detailCacheDuration: 180,
modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "newest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码流出", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e3%83%a2%e3%82%b6%e3%82%a4%e3%82%af%e9%99%a4%e5%8e%bb" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e5%b7%a8%e4%b9%b3" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "大屁股", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e5%b7%a8%e5%b0%bb" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e4%ba%ba%e5%a6%bb%e3%83%bb%e4%b8%bb%e5%a9%a6" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "制服", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e5%88%b6%e6%9c%8d" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "FC2 PPV", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "fc2" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "4K", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:4k" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中出し", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e4%b8%ad%e5%87%ba%e3%81%97" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e7%b4%a0%e4%ba%ba" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "单体作品", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e5%8d%98%e4%bd%93%e4%bd%9c%e5%93%81" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "高清", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e3%83%8f%e3%82%a4%e3%83%93%e3%82%b8%e3%83%a7%e3%83%b3" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "独占配信", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e7%8b%ac%e5%8d%a0%e9%85%8d%e4%bf%a1" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "高码率", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e9%ab%98%e3%83%93%e3%83%83%e3%83%88%e3%83%ac%e3%83%bc%e3%83%88" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "美少女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e7%be%8e%e5%b0%91%e5%a5%b3" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "口交", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e3%83%95%e3%82%a7%e3%83%a9" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "苗条", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e3%82%b9%e3%83%ac%e3%83%b3%e3%83%80%e3%83%bc" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "样品视频", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e3%82%b5%e3%83%b3%e3%83%97%e3%83%ab%e5%8b%95%e7%94%bb" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "配信专用", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e9%85%8d%e4%bf%a1%e5%b0%82%e7%94%a8" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "痴女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e7%97%b4%e5%a5%b3" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "熟女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e7%86%9f%e5%a5%b3" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "自拍", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e3%83%8f%e3%83%a1%e3%82%92%e3%82%8a" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "3P・4P", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:3p%e3%83%bb4p" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "全高清", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e3%83%95%e3%83%ab%e3%83%8f%e3%82%a4%e3%83%93%e3%82%b8%e3%83%a7%e3%83%b3fhd" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "潮吹", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e6%bd%ae%e5%90%b9%e3%81%8d" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "NTR", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e5%af%9d%e5%8f%96%e3%82%8a%e3%83%bb%e5%af%9d%e5%8f%96%e3%82%89%e3%82%8c%e3%83%bbntr" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "美乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e7%be%8e%e4%b9%b3" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "淫乱重口", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e6%b7%ab%e4%b9%b1%e3%83%bb%e3%83%8f%e3%83%bc%e3%83%89%e7%b3%bb" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "高潮", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e3%82%a2%e3%82%af%e3%83%a1%e3%83%bb%e3%82%aa%e3%83%bc%e3%82%ac%e3%82%ba%e3%83%a0" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "骑乘位", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "g:%e9%a8%8e%e4%b9%97%e4%bd%8d" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
  ]
};

var HOST = "https://ero.to";
var PLAY = "https://test.manyse.com/";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var PAGE_SIZE = 24;

function t(v) {
return String(v == null? "": v).trim();
}

function clean(s) {
return t(s).replace(/<[^>]*>/g, " ")
.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
.replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}

function absUrl(u) {
u = t(u);
if (!u) return "";
if (/^https?:\/\//i.test(u)) return u;
if (u.indexOf("//") === 0) return "https:" + u;
return HOST + (u.charAt(0) === "/"? u: "/" + u);
}

async function getHtml(url) {
var res = await Widget.http.get(url, { headers: { "User-Agent": UA}});
return res && res.data!= null? String(res.data): "";
}

function parseCards(html) {
var out = [];
if (!html || html.indexOf("Just a moment...") >= 0) return out;
var re = /<a href="https:\/\/ero\.to\/(vod|fc2)\/(\d+)\/"[^>]*>\s*<img[^>]*src="([^"]+)"[^>]*>[\s\S]{0,1200}?-webkit-line-clamp: 2;[^>]*>([^<]+)</g;
var m;
while ((m = re.exec(html))) {
var block = m[0];
var badge = (block.match(/<span class="badge bg-danger">([^<]+)<\/span>/) || [])[1] || "";
var link = HOST + "/" + m[1] + "/" + m[2] + "/";
out.push({
id: link,
type: "url",
title: clean(m[4]),
posterPath: m[3],
coverUrl: m[3],
backdropPath: m[3],
link: link,
description: badge? clean(badge): "",
mediaType: "movie"
});
if (out.length >= 100) break;
}
return out;
}

function listUrlFor(tid, page) {
var p = page > 1? "page/" + page + "/": "";
if (tid === "newest") return HOST + "/vod/" + p;
if (tid === "fc2") return HOST + "/fc2/" + p;
if (tid.indexOf("g:") === 0) return HOST + "/vod_genre/" + tid.slice(2) + "/" + p;
return HOST + "/vod/" + p;
}

function listOrMsg(html, url) {
if (!html) return [{ id: "empty", type: "url", title: "空页面"}];
var list = parseCards(html);
return list.length? list: [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url}];
}

async function loadList(params) {
params = params || {};
var page = Math.max(1, parseInt(params.page, 10) || 1);
var tid = String(params.path || params.cat || "newest");
var url = listUrlFor(tid, page);
try {
var html = await getHtml(url);
return listOrMsg(html, url);
} catch (e) {
var msg = String((e && e.message) || e);
return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url}];
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
var url = HOST + "/?s=" + encodeURIComponent(wd) + "&post_type%5B%5D=vod&post_type%5B%5D=fc2" + (page > 1? "&paged=" + page: "");
try {
var html = await getHtml(url);
return listOrMsg(html, url);
} catch (e) {
var msg = String((e && e.message) || e);
return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url}];
}
}

function subExtractCode(text) {
var s = String(text || "").toUpperCase().replace(/[._]/g, " ").replace(/\s+/g, " ");
var pats = [
/\bFC2(?:[-]?PPV)?[-]?\d{5,8}\b/,
/\bCARIB(?:PR)?[-]?\d{6,8}\b/,
/\b1PONDO[-]?\d{6,8}\b/,
/\bHEYZO[-]?\d{3,6}\b/,
/\b[A-Z]{2,10}[-]\d{2,8}[A-Z]?\b/,
/\b[A-Z]{2,10}\d{2,8}[A-Z]?\b/
];
for (var i = 0; i < pats.length; i++) {
var m = s.match(pats[i]);
if (m) return m[0].replace(/\s+/g, "-").replace(/-+/g, "-");
}
return "";
}

// 验活：GET 成功视为 200，抛错视为 0（REX 的 get 不回状态码，按猫源网络错误口径 fail-open 处理）
async function checkM3u8(url) {
try {
var body = await getHtml(url);
return { status: body? 200: 0, isM3u8: body.indexOf("#EXTM3U") >= 0};
} catch (e) {
return { status: 0, isM3u8: false};
}
}

async function loadDetail(link) {
var raw = String(link || "");
try {
var type = "";
var num = "";
var m1 = raw.match(/\/(vod|fc2)\/(\d+)\/?/);
var m2 = raw.match(/^(vod|fc2):(\d+)$/);
if (m1) { type = m1[1]; num = m1[2];}
else if (m2) { type = m2[1]; num = m2[2];}
else return { id: raw || "err", type: "url", title: "Ero", description: "未找到播放地址"};
var pageUrl = HOST + "/" + type + "/" + num + "/";
var html = await getHtml(pageUrl);
if (!html || html.indexOf("Just a moment...") >= 0) {
return { id: pageUrl, type: "url", title: "Ero", description: "未找到播放地址"};
}
var ogTitle = (html.match(/<meta property="og:title" content="([^"]+)"[^>]*>/) || [])[1] || "";
var titleTag = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || "";
var title = clean(ogTitle || titleTag.split(" – ")[0] || "");
if (!title) title = "Ero #" + num;
var poster = (html.match(/poster="([^"]+)"/) || [])[1] || "";
var tags = [];
var tagRe = /rel="tag">([^<]+)</g;
var tm;
while ((tm = tagRe.exec(html))!== null && tags.length < 8) {
var tg = clean(tm[1]);
if (tg && tags.indexOf(tg) < 0) tags.push(tg);
}
var hasMosaicTag = tags.indexOf("モザイク除去") >= 0;
var cands = [];
if (type === "fc2") {
var urlRe = /"label":"([^"]+)","url":"([^"]+)"/g;
var um;
while ((um = urlRe.exec(html))!== null) {
var u = um[2].replace(/\\\//g, "/");
if (/^https?:\/\//.test(u)) cands.push({ name: clean(um[1]) || "FHD", url: u, kind: "fhd"});
}
} else {
var videoLink = (html.match(/videoLink = "([^"]+)"/) || [])[1] || "2610";
var code = (html.match(/pndvd = "([^"]+)"/) || [])[1] || "";
if (!code) code = subExtractCode(title);
var suffix = (html.match(/versionSuffix = "([^"]*)"/) || [])[1] || "";
if (code) {
cands.push({ name: "FHD", url: PLAY + videoLink + "/" + code + "/play.m3u8" + suffix, kind: "fhd"});
cands.push({ name: "去码版", url: PLAY + videoLink + "/" + code + "-M/play.m3u8" + suffix, kind: "m"});
}
}
if (!cands.length) {
return { id: pageUrl, type: "url", title: title, description: "未找到播放地址"};
}
var videoUrl = "";
for (var i = 0; i < cands.length; i++) {
var c = cands[i];
var ck = await checkM3u8(c.url);
var live = false;
if (c.kind === "fhd") live = ck.status!== 404;
else live = ck.status === 200 || (ck.status === 0 && hasMosaicTag);
if (!live) continue;
if (!videoUrl) videoUrl = c.url;
}
if (!videoUrl) {
return { id: pageUrl, type: "url", title: title, description: "未找到播放地址"};
}
return {
id: pageUrl,
type: "detail",
title: title,
link: pageUrl,
posterPath: poster,
coverUrl: poster,
backdropPath: poster,
videoUrl: videoUrl,
playerType: "app",
customHeaders: { "User-Agent": UA, "Referer": HOST + "/"}
};
} catch (e) {
return { id: raw || "err", type: "url", title: "Ero", description: "未找到播放地址"};
}
}
