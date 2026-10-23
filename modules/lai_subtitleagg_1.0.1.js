// 字幕聚合 for REX (lai_subtitleagg v1.0.1) —— 2026-10-23 换芯。
// 定位: 用户自有「迅雷看看字幕」(xunlei.subtitle) 的聚合扩展版 ——
// 沿用其 WidgetMetadata / subtitle 模块契约与返回格式。
// v1.0.1 搜索芯按用户反馈重做 (旧芯多键合并+只排序不过滤, 片名
// 键召回别片字幕灌满前 10, SubtitleCat 被挤出 —— 用户真机坐实):
// 改照 xunlei.subtitle 组件原法 ——
// (a) 搜索键按序逐个查、首个有结果的键即停 (番号键命中的就是
// 该番号的字幕集, 池子小而准);
// (b) 严过滤: 条目 name/langs/ext 须含番号 (宽松形亦可) 或片
// 名全文, 不含全扔; 有番号时过滤到空即空 (不回退宽松名单,
// 这是旧版相关性闸门被新芯吸收后的形态), 无番号才按组件
// 原法回退;
// (c) 打分照组件 scoreItem: cid_match 100000、含番号 +25000、
// oracle 自带 Score/FingerprintScore、下载量、时长/大小。
// 槽位 (用户钦定优先级, 同走 oracle 接口、重不重复不管):
// 迅雷 (档位 0): 键序 [番号, 紧凑番号]
// 迅雷看看 (档位 1): 组件完整键序 [番号, 紧凑番号, 番号+标题,
// 紧凑番号+标题, 全标题]
// SubtitleCat (档位 2): 搜索页 -> 字幕页 -> 按语言直链, 同样
// 过严过滤。
// 合并: URL 去重 (重复条目标高档位来源) -> 档位 -> 语言 (简中 >
// 繁中 > 双语 > 英文 > 日文 > 其他) -> 分数; 全局上限 10、单槽
// 软上限 8 (保 SubtitleCat 有位置)。只收.srt/.vtt/.ass/.ssa。
// SubHD (下载被站方门控)、射手 assrt (源站不可达) 不接入。
// 沙箱纪律: 无定时器 / 无文本解码器 / 无全局取数函数; 超时交
// Widget.http 的 timeout 选项, 三槽并行、各自失败静默, 全无命
// 中干净返回空数组。

WidgetMetadata = {
id: "lai_subtitleagg",
title: "字幕聚合",
version: "1.0.1",
requiredVersion: "0.0.1",
description: "字幕聚合搜索:迅雷 + 迅雷看看 + SubtitleCat,按组件法精确匹配合并",
author: "lai",
site: "https://www.xunlei.com/",
globalParams: [],
modules: [
{
id: "loadSubtitle",
title: "加载字幕",
functionName: "loadSubtitle",
type: "subtitle",
params: [],
},
],
};

var XL_API = "https://api-shoulei-ssl.xunlei.com";
var XL_UA = "ForwardWidgets/1.0.2";
var CAT_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/604.1.14 (KHTML, like Gecko)";
var SUB_TEXT_RE = /\.(srt|vtt|ass|ssa)(\?|#|$)/i;

function getText(value) {
return String(value == null? "": value).trim();
}

function formatDownload(num) {
var n = Number(num) || 0;
if (n >= 10000) return (n / 10000).toFixed(1) + "w";
if (n >= 1000) return (n / 1000).toFixed(1) + "k";
return String(n);
}

function firstNumber() {
for (var i = 0; i < arguments.length; i++) {
var n = Number(arguments[i]);
if (Number.isFinite(n) && n > 0) return n;
}
return 0;
}

function parseDurationValue(value) {
if (value == null) return 0;
if (typeof value === "number" && Number.isFinite(value)) return value;
var text = getText(value);
if (!text) return 0;
if (/^\d+(?:\.\d+)?$/.test(text)) return Number(text);
var hms = text.match(/(?:(\d+):)?(\d{1,2}):(\d{2})/);
if (hms) return Number(hms[1] || 0) * 3600 + Number(hms[2] || 0) * 60 + Number(hms[3] || 0);
var zh = text.match(/(\d+)\s*小时(?:\s*(\d+)\s*分(?:钟)?)?(?:\s*(\d+)\s*秒)?/);
if (zh) return Number(zh[1] || 0) * 3600 + Number(zh[2] || 0) * 60 + Number(zh[3] || 0);
return 0;
}

function getExtOf(name) {
if (!name) return "";
var s = String(name).toLowerCase();
if (s.endsWith(".srt")) return ".srt";
if (s.endsWith(".ass")) return ".ass";
if (s.endsWith(".ssa")) return ".ssa";
if (s.endsWith(".vtt")) return ".vtt";
return "";
}

// 番号抽取 (与猫源字幕块 subExtractCode 同芯, 其本身移植自迅雷
// 看看 REX 组件 extractSearchCode 的核心档)
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

// 语言判定: rank 越小越优先 (与猫源字幕块 subLangOf 同口径)
function subLangOf(name, langs) {
var s = (String(name || "") + " " + String(langs || "")).toLowerCase();
if (/简体|简中|chs|zh[-_.]?cn|zh[-_.]?hans/.test(s)) return { tag: "简中", rank: 0};
if (/繁体|繁中|cht|zh[-_.]?tw|zh[-_.]?hant/.test(s)) return { tag: "繁中", rank: 1};
if (/双语|中英|中日|bilingual/.test(s)) return { tag: "双语", rank: 2};
if (/英文|english|eng|(^|[-_.])en([-_.]|$)/.test(s)) return { tag: "英文", rank: 3};
if (/日文|日语|japanese|jpn|(^|[-_.])ja([-_.]|$)/.test(s)) return { tag: "日文", rank: 4};
return { tag: "", rank: 5};
}

function stripEpisodeMarkers(text) {
return getText(text)
.replace(/\b(?:第\s*\d+\s*集|第\s*\d+\s*話|EP\s*\d+|E\s*\d+|S\d{1,2}E\d{1,2}|\d{1,2}x\d{1,2}|Season\s*\d+\s*Episode\s*\d+)\b/gi, " ")
.replace(/\b(?:第\s*\d+\s*季|Season\s*\d+)\b/gi, " ")
.replace(/\s+/g, " ")
.trim();
}

var NOISE_RE = /\b(UNCENSORED|LEAKED|LEAK|OTHER|COMPLETE|FULL|HDR|WEB|BLURAY|BDRIP|WEBDL|REMUX|X264|X265|10BIT|8BIT|HEVC|AVC)\b/gi;

// 搜索上下文 + 组件法键序 (照 xunlei.subtitle buildSearchKeys):
// 有番号: [番号, 紧凑番号, 番号+标题余部, 紧凑番号+标题余部],
// 末尾补 [展示标题, 原标题]; 无番号: [展示标题, 原标题] (带季集
// 时首键加 SxxExx)。迅雷槽只取 [番号, 紧凑番号] (无番号取首键)。
function buildCtx(params) {
var rawFields = [params && params.title, params && params.seriesName, params && params.description,
params && params.id, params && params.link, params && params.url].map(getText).filter(Boolean);
var rawText = rawFields.join(" ");
var titleText = getText(params && params.title) || getText(params && params.seriesName);
var displayText = stripEpisodeMarkers(titleText || rawText);
var codeSource = stripEpisodeMarkers(rawText || titleText);
var code = subExtractCode(codeSource) || subExtractCode(displayText);
var keysAll = [];
if (code) {
var titlePart = (displayText || titleText || rawText)
.replace(new RegExp(code.replace(/[-_]/g, "[-_]?"), "i"), "")
.replace(NOISE_RE, "")
.replace(/\b(?:EP|E|S|SEASON)\s*\d{1,3}\b/gi, "")
.replace(/^[\s\-_:]+|[\s\-_:]+$/g, "")
.trim();
var compact = code.replace(/[-_]/g, "");
keysAll.push(code);
keysAll.push(compact);
if (titlePart && titlePart!== code) keysAll.push(code + " " + titlePart);
if (titlePart && titlePart!== compact) keysAll.push(compact + " " + titlePart);
} else if (displayText) {
var season = Number(params && params.season);
var episode = Number(params && params.episode);
if (season > 0 && episode > 0) {
keysAll.push(displayText + " S" + String(season).padStart(2, "0") + "E" + String(episode).padStart(2, "0"));
}
}
if (displayText) keysAll.push(displayText);
if (titleText && titleText!== displayText) keysAll.push(titleText);
var seen = {};
keysAll = keysAll.filter(function (k) {
if (!k || k.length < 2 || seen[k]) return false;
seen[k] = 1;
return true;
});
return {
code: code,
compact: code? code.replace(/[-_]/g, ""): "",
displayText: displayText,
rawText: rawText,
keysAll: keysAll,
xunleiKeys: code? [code, code.replace(/[-_]/g, "")]: keysAll.slice(0, 1),
catKey: code || displayText || titleText,
matchText: stripEpisodeMarkers(rawText).toLowerCase(),
titleLower: rawText.toLowerCase()
};
}

function looseOf(s) {
return String(s || "").replace(/[-_\s.]/g, "");
}

// 条目文本 (name + langs + ext) 是否与番号/片名相关 (组件严过滤)
function itemRelevant(it, ctx) {
var text = (String(it.name || "") + " " + String(it.langs || "") + " " + String(it.ext || "")).toLowerCase();
var textLoose = looseOf(text);
if (ctx.code) {
var cl = ctx.code.toLowerCase();
if (text.indexOf(cl) >= 0 || textLoose.indexOf(looseOf(cl)) >= 0) return true;
}
var mt = ctx.matchText;
var tl = ctx.titleLower;
if (mt && text.indexOf(mt) >= 0) return true;
if (mt && textLoose.indexOf(looseOf(mt)) >= 0) return true;
if (tl && text.indexOf(tl) >= 0) return true;
if (tl && textLoose.indexOf(looseOf(tl)) >= 0) return true;
if (text && mt && mt.indexOf(text) >= 0) return true;
return false;
}

// 片名有效词元 (相关性闸门用): 拉丁/数字词 >=3 字符、汉字串
// >=2 字。单字召回 (如生僻字「龘」) 过不了这一关。
function titleTokensOf(title) {
var t = String(title || "").toLowerCase();
var toks = [];
var m, re = /[a-z0-9]+/g;
while ((m = re.exec(t)) !== null) if (m[0].length >= 3) toks.push(m[0]);
var re2 = /[一-鿿]+/g;
while ((m = re2.exec(t)) !== null) if (m[0].length >= 2) toks.push(m[0]);
return toks;
}

function tokenHitOf(name, tokens) {
var n = String(name || "").toLowerCase();
for (var i = 0; i < tokens.length; i++) if (n.indexOf(tokens[i]) >= 0) return 1;
return 0;
}

// 严过滤: 有番号时过滤到空即空 (不回退, 防别片字幕混入); 无番
// 号时回退名单也要过词元闸门 (组件原法是整单回退, 实测会被单
// 字模糊召回灌入无关字幕, 故闸门在此吸收)。
function strictFilter(items, ctx) {
var kept = items.filter(function (it) { return itemRelevant(it, ctx);});
if (kept.length) return kept;
if (ctx.code) return [];
var toks = titleTokensOf(ctx.displayText);
return items.filter(function (it) { return tokenHitOf(it.name, toks);});
}

// 组件打分 (scoreItem 的电影路径): cid_match 100000 / 含番号
// 25000 / oracle 自带分 / 下载量 / 时长大小 / 片名命中 1000 /
// 番号在席 500 / sub 字样 300。
function scoreOracleItem(it, ctx) {
var text = (String(it.name || "") + " " + String(it.langs || "") + " " + String(it.ext || "")).toLowerCase();
var textLoose = looseOf(text);
var score = (it.cid_match? 100000: 0) + (Number(it.down_count) || 0) / 10000;
if (ctx.code) {
var cl = ctx.code.toLowerCase();
if (text.indexOf(cl) >= 0 || textLoose.indexOf(looseOf(cl)) >= 0) score += 25000;
score += 500;
}
score += Math.max(0, Number(it.score) || 0);
score += Math.max(0, Number(it.fingerprintScore) || 0);
if (Number(it.duration) > 0) score += 50;
if (Number(it.file_size) > 0) score += Math.min(Number(it.file_size) / 1024 / 1024, 20);
if (ctx.titleLower && (text.indexOf(ctx.titleLower) >= 0 || textLoose.indexOf(looseOf(ctx.titleLower)) >= 0)) score += 1000;
if (text.indexOf("sub") >= 0 || text.indexOf("subtitle") >= 0 || text.indexOf("字幕") >= 0) score += 300;
return score;
}

// oracle 条目归一 (照组件 normalizeResult 的字段别名口径)
function normalizeOracleItem(item) {
var duration = firstNumber(
parseDurationValue(item && item.Duration), parseDurationValue(item && item.duration),
parseDurationValue(item && item.TimeLength), parseDurationValue(item && item.time_length),
parseDurationValue(item && item.Length), parseDurationValue(item && item.length),
parseDurationValue(item && item.VideoDuration), parseDurationValue(item && item.video_duration),
parseDurationValue(item && item.Dur), parseDurationValue(item && item.dur),
parseDurationValue(item && item.Runtime), parseDurationValue(item && item.runtime),
parseDurationValue(item && item.PlayTime), parseDurationValue(item && item.play_time));
var fileSize = firstNumber(
item && item.FileSize, item && item.file_size, item && item.Size, item && item.size,
item && item.FileSizeBytes, item && item.fileSize, item && item.filesize,
item && item.SubSize, item && item.sub_size, item && item.Subsize, item && item.subsize,
item && item.LengthBytes, item && item.length_bytes, item && item.Bytes, item && item.bytes);
var name = getText((item && (item.Name || item.name || item.Title || item.title || item.FileName || item.filename)) || "迅雷字幕");
return {
name: name,
langs: getText((item && (item.Langs || item.langs || (Array.isArray(item.Languages)? item.Languages.join(","): item.Languages) || item.lang || item.language)) || ""),
ext: getText((item && (item.Ext || item.ext || item.Format || item.format)) || "") || getExtOf(name) || ".srt",
url: getText(item && (item.Url || item.url)),
down_count: Number((item && (item.DownCount || item.down_count || item.Download || item.download || item.Downloads || item.downloads)) || 0),
cid_match: Boolean(item && (item.CidMatch!= null? item.CidMatch: item.cid_match)),
duration: duration,
file_size: fileSize,
score: Number((item && (item.Score || item.score)) || 0),
fingerprintScore: Number((item && (item.FingerprintfScore || item.fingerprintfScore || item.FingerprintScore || item.fingerprintScore)) || 0)
};
}

// Widget.http 薄封装: 归一成 {status, data(已解析对象或 null), text}
async function httpGet(url, headers, timeoutMs) {
var res = await Widget.http.get(url, { headers: headers || {}, timeout: timeoutMs || 8000});
if (!res) return { status: 0, data: null, text: ""};
if (typeof res === "string") return { status: 200, data: null, text: res};
var raw = res.data!= null? res.data: (res.body!= null? res.body: "");
var status = typeof res.status === "number"? res.status
: (typeof res.statusCode === "number"? res.statusCode: (raw? 200: 0));
return {
status: status,
data: (raw && typeof raw === "object")? raw: null,
text: typeof raw === "string"? raw: ""
};
}

// oracle 单键查询: 归一后的条目数组 (仅文本字幕直链); 失败 []
async function oracleQuery(key) {
var r = await httpGet(XL_API + "/oracle/subtitle?name=" + encodeURIComponent(key),
{ "User-Agent": XL_UA, Accept: "*/*"}, 5000);
var j = r.data;
if (!j && r.text) { try { j = JSON.parse(r.text);} catch (e) { j = null;}}
if (!j || Number(j.code)!== 0 ||!Array.isArray(j.data)) return [];
var out = [];
for (var i = 0; i < j.data.length; i++) {
var it = normalizeOracleItem(j.data[i]);
if (!it.url ||!SUB_TEXT_RE.test(it.url)) continue;
out.push(it);
}
return out;
}

// oracle 槽: 键序逐个查、首个有结果的键即停 (组件原法); 命中
// 的名单过严过滤 + 打分后入 bag。
async function searchOracleSlot(src, tier, keys, ctx, bag) {
for (var k = 0; k < keys.length; k++) {
var items = await oracleQuery(keys[k]);
if (!items.length) continue;
var kept = strictFilter(items, ctx);
for (var i = 0; i < kept.length; i++) {
var it = kept[i];
var lang = subLangOf(it.name, it.langs);
// 裸哈希名 (不可读) 显示名换成番号字幕; 过滤/打分已按原名
var dispName = /^[0-9a-f]{24,}$/i.test(it.name.trim())? (ctx.code? ctx.code + " 迅雷字幕": "迅雷字幕"): it.name;
bag.push({
src: src, tier: tier, name: dispName, url: it.url, lang: lang.tag, langRank: lang.rank,
score: scoreOracleItem(it, ctx), dl: it.down_count
});
}
break;
}
}

// SubtitleCat 槽: 搜索页 -> 字幕页 (前 3) -> 按语言分的直链;
// 文件名同样过严过滤 (有番号时不回退)。
async function searchSubtitleCat(ctx, bag) {
var key = ctx.catKey;
if (!key) return;
var r = await httpGet("https://subtitlecat.com/index.php?search=" + encodeURIComponent(key),
{ "User-Agent": CAT_UA, Referer: "https://subtitlecat.com/"}, 5000);
if (r.status!== 200 ||!r.text) return;
var pages = [];
var seen = {};
var re = /href="(subs\/\d+\/[^"]+\.html)"/g;
var m;
while ((m = re.exec(r.text))!== null) {
if (seen[m[1]]) continue;
seen[m[1]] = 1;
pages.push(m[1]);
if (pages.length >= 3) break;
}
var jobs = pages.map(async function (p) {
var pr = await httpGet("https://subtitlecat.com/" + p,
{ "User-Agent": CAT_UA, Referer: "https://subtitlecat.com/"}, 4000);
if (pr.status!== 200 ||!pr.text) return;
var re2 = /href="(\/subs\/\d+\/[^"]+\.(?:srt|vtt|ass))"/gi;
var mm;
var rawItems = [];
while ((mm = re2.exec(pr.text))!== null) {
var nm = mm[1].split("/").pop() || "字幕";
try { nm = decodeURIComponent(nm);} catch (e) { /* 保持原样 */}
rawItems.push({ name: nm, langs: "", ext: getExtOf(nm), url: "https://subtitlecat.com" + mm[1]});
}
var kept = rawItems.filter(function (it) { return itemRelevant(it, ctx);});
for (var i = 0; i < kept.length; i++) {
var lang = subLangOf(kept[i].name, "");
var sc = 0;
if (ctx.code) {
var nl = kept[i].name.toLowerCase();
if (nl.indexOf(ctx.code.toLowerCase()) >= 0 || looseOf(nl).indexOf(looseOf(ctx.code.toLowerCase())) >= 0) sc += 25000;
}
if (kept[i].name.toLowerCase().indexOf("sub") >= 0) sc += 300;
bag.push({
src: "SubtitleCat", tier: 2, name: kept[i].name, url: kept[i].url,
lang: lang.tag, langRank: lang.rank, score: sc, dl: 0
});
}
});
await Promise.all(jobs.map(function (p) { return Promise.resolve(p).catch(function () {});}));
}

// 合并: URL 去重 (同 URL 保留高档位来源的一份) + (语言|去扩展
// 名文件名) 去重; 排序 档位 -> 语言 -> 分数; 单槽软上限 8、全
// 局上限 10; 输出照模板返回格式。
function mergeResults(items) {
var sorted = items.slice().sort(function (a, b) {
return (a.tier - b.tier) || (a.langRank - b.langRank) || (b.score - a.score) ||
String(a.name).localeCompare(String(b.name));
});
var seenUrl = {};
var seenName = {};
var tierCount = {};
var out = [];
for (var i = 0; i < sorted.length; i++) {
var it = sorted[i];
if (seenUrl[it.url]) continue;
var nameKey = it.lang + "|" + it.name.toLowerCase().replace(/\.(srt|vtt|ass|ssa)$/i, "");
if (seenName[nameKey]) continue;
if ((tierCount[it.tier] || 0) >= 8) continue;
seenUrl[it.url] = 1;
seenName[nameKey] = 1;
tierCount[it.tier] = (tierCount[it.tier] || 0) + 1;
var ext = "." + (it.url.match(SUB_TEXT_RE) || [])[1].toLowerCase();
var cleanName = it.name.replace(/\.(srt|vtt|ass|ssa)$/i, "").slice(0, 60);
var langTag = it.lang? "": "";
var extra = it.dl > 0? "下载 " + formatDownload(it.dl): "";
out.push({
id: it.src + ":" + it.url,
title: langTag + it.src + "·" + cleanName + ext,
subTitle: extra,
description: extra,
lang: it.lang || "未知",
count: (10 - out.length) * 100000 + Math.min(99999, Math.round(it.score)),
url: it.url
});
if (out.length >= 10) break;
}
return out;
}

async function loadSubtitle(params) {
try {
params = params || {};
var ctx = buildCtx(params);
if (!ctx.keysAll.length &&!ctx.catKey) return [];
var bag = [];
var jobs = [
searchOracleSlot("迅雷", 0, ctx.xunleiKeys, ctx, bag),
searchOracleSlot("迅雷看看", 1, ctx.keysAll, ctx, bag),
searchSubtitleCat(ctx, bag)
].map(function (p) { return Promise.resolve(p).catch(function () {});});
await Promise.all(jobs);
return mergeResults(bag);
} catch (e) {
return [];
}
}
