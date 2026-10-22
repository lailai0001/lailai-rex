// 字幕聚合 for REX (lai_subtitleagg v1.0.0) —— 2026-10-23 新写。
// 定位: 用户自有「迅雷看看字幕」(xunlei.subtitle) 的聚合扩展版 ——
// 沿用其 WidgetMetadata / subtitle 模块契约与返回格式, 搜索芯换成
// 猫源已真机验证的字幕聚合 (castbank sub_block): 双源合并 ——
// 迅雷看看 oracle (兼「迅雷」位, 同一接口)... 档位 0
// SubtitleCat (搜索页 -> 字幕页 -> 按语言.srt 直链)... 档位 2
// 合并排序: 源档位 -> 语言 (简中 > 繁中 > 双语 > 英文 > 日文 > 其他)
// -> 番号命中 -> 热度; 只收.srt/.vtt/.ass/.ssa 直链; 上限 10 条。
// SubHD (下载被站方门控)、射手 assrt (源站不可达) 不接入, 同猫版口径。
// 沙箱纪律: 无定时器 / 无文本解码器 / 无全局取数函数; 超时一律交
// Widget.http 的 timeout 选项, 双源并行、各自失败静默, 全无命中
// 干净返回空数组。

WidgetMetadata = {
id: "lai_subtitleagg",
title: "字幕聚合",
version: "1.0.0",
requiredVersion: "0.0.1",
description: "字幕聚合搜索:迅雷看看 + SubtitleCat 双源合并,按语言与番号命中排序",
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
if (/繁体|繁中|cht|zh[-_.]?tw|zh[-_.]?hk|zh[-_.]?hant/.test(s)) return { tag: "繁中", rank: 1};
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

// 搜索键 (猫源 subKeys 的 params 版): 番号 -> 片名 -> 番号+片名余部;
// 带季集时首键用「片名 SxxExx」。最多 3 键。
function buildKeys(params) {
var raw = [params && params.title, params && params.seriesName, params && params.description,
params && params.id, params && params.link, params && params.url]
.map(getText).filter(Boolean).join(" ");
var title = stripEpisodeMarkers(getText(params && params.title) || getText(params && params.seriesName) || raw);
var code = subExtractCode(raw) || subExtractCode(title);
var keys = [];
var season = Number(params && params.season);
var episode = Number(params && params.episode);
if (code) {
keys.push(code);
if (title && title!== code) keys.push(title);
if (title) {
var tp = title.replace(new RegExp(code.replace(/-/g, "[-]?"), "i"), "").replace(/^[\s\-_:]+|[\s\-_:]+$/g, "").trim();
if (tp && tp.length >= 3) keys.push(code + " " + tp);
}
} else if (title) {
if (season > 0 && episode > 0) {
keys.push(title + " S" + String(season).padStart(2, "0") + "E" + String(episode).padStart(2, "0"));
}
keys.push(title);
}
var seen = {};
return keys.filter(function (k) {
if (!k || k.length < 2 || seen[k]) return false;
seen[k] = 1;
return true;
}).slice(0, 3);
}

function codeHitOf(name, code) {
if (!code) return 0;
return String(name || "").toUpperCase().replace(/[._]/g, " ").indexOf(code.replace(/-/g, " ")) >= 0? 1: 0;
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

// 迅雷看看 (兼「迅雷」位): 前 2 键并行查, 命中条目逐条入 bag
async function searchXunlei(keys, code, bag) {
var jobs = keys.slice(0, 2).map(async function (key) {
var viaCode = (code && key === code) ? 1 : 0;
var r = await httpGet(XL_API + "/oracle/subtitle?name=" + encodeURIComponent(key),
{ "User-Agent": XL_UA, Accept: "*/*"}, 5000);
var j = r.data;
if (!j && r.text) { try { j = JSON.parse(r.text);} catch (e) { j = null;}}
if (!j || Number(j.code)!== 0 ||!Array.isArray(j.data)) return;
for (var i = 0; i < j.data.length; i++) {
var it = j.data[i];
if (!it) continue;
var url = String(it.url || it.Url || "");
if (!SUB_TEXT_RE.test(url)) continue; // 压缩包/非文本字幕剔除
var nm = String(it.name || it.Name || "字幕");
var langs = Array.isArray(it.languages)? it.languages.join(",")
: (Array.isArray(it.Languages)? it.Languages.join(","): String(it.langs || it.Langs || ""));
var lang = subLangOf(nm, langs);
var dl = Number(it.down_count || it.DownCount || it.downloads || 0) || 0;
var pop = dl + (Number(it.score || 0) || 0) + (Number(it.fingerprintf_score || it.fingerprint_score || 0) || 0);
// 个别条目名是裸哈希 (不可读): 显示名换成番号字幕, 匹配/
// 语言判定仍用原名 (同猫版)
var dispName = /^[0-9a-f]{24,}$/i.test(nm.trim())? (code? code + " 迅雷字幕": "迅雷字幕"): nm;
bag.push({
src: "迅雷看看", tier: 0, name: dispName, url: url, lang: lang.tag, langRank: lang.rank,
codeHit: codeHitOf(nm, code), pop: pop, dl: dl, viaCode: viaCode
});
}
});
await Promise.all(jobs.map(function (p) { return Promise.resolve(p).catch(function () {});}));
}

// SubtitleCat: 搜索页 -> 字幕页 (前 3) -> 按语言分的直链, 逐页入 bag
async function searchSubtitleCat(keys, code, bag) {
var key = keys[0];
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
while ((mm = re2.exec(pr.text))!== null) {
var nm = mm[1].split("/").pop() || "字幕";
try { nm = decodeURIComponent(nm);} catch (e) { /* 保持原样 */}
var lang = subLangOf(nm, "");
bag.push({
src: "SubtitleCat", tier: 2, name: nm, url: "https://subtitlecat.com" + mm[1],
lang: lang.tag, langRank: lang.rank, codeHit: codeHitOf(nm, code), pop: 0, dl: 0, viaCode: code ? 1 : 0
});
}
});
await Promise.all(jobs.map(function (p) { return Promise.resolve(p).catch(function () {});}));
}

// 合并排序 (同猫版): 源档位 -> 语言 -> 番号命中 -> 热度; 按 url 与
// (语言|去扩展名文件名) 双键去重; 上限 10 条; 输出照模板返回格式。
function mergeResults(items) {
var sorted = items.slice().sort(function (a, b) {
return (a.tier - b.tier) || (a.langRank - b.langRank) || (b.codeHit - a.codeHit) ||
(b.pop - a.pop) || String(a.name).localeCompare(String(b.name));
});
var seenUrl = {};
var seenName = {};
var out = [];
for (var i = 0; i < sorted.length; i++) {
var it = sorted[i];
if (seenUrl[it.url]) continue;
var nameKey = it.lang + "|" + it.name.toLowerCase().replace(/\.(srt|vtt|ass|ssa)$/i, "");
if (seenName[nameKey]) continue;
seenUrl[it.url] = 1;
seenName[nameKey] = 1;
var ext = "." + (it.url.match(SUB_TEXT_RE) || [])[1].toLowerCase();
var cleanName = it.name.replace(/\.(srt|vtt|ass|ssa)$/i, "").slice(0, 60);
var langTag = it.lang ? "【" + it.lang + "】" : "【字幕】";
var extra = it.dl > 0? "下载 " + formatDownload(it.dl): "";
out.push({
id: it.src + ":" + it.url,
title: langTag + it.src + "·" + cleanName + ext,
subTitle: extra,
description: extra,
lang: it.lang || "未知",
count: (10 - out.length) * 100000 + Math.min(99999, Math.round(it.pop)),
url: it.url
});
if (out.length >= 10) break;
}
return out;
}

// 相关性闸门: oracle 对片名键会做模糊匹配 (实测乱码片名里的单个
// 生僻字也能召回无关字幕)。放行条件: 条目出自番号键 (索引精确
// 命中, 含裸哈希名的真字幕), 或条目名含番号, 或条目名与片名共
// 享有效词元 (拉丁/数字词 >=3 字符, 或汉字串 >=2 字), 或条目名
// 含片名全文 (去标点)。全不满足的丢弃, 保证无真字幕时干净空返。
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

async function loadSubtitle(params) {
try {
params = params || {};
var keys = buildKeys(params);
if (!keys.length) return [];
var raw = [params.title, params.seriesName, params.description, params.id, params.link, params.url]
.map(getText).filter(Boolean).join(" ");
var code = subExtractCode(raw);
var bag = [];
var jobs = [searchXunlei(keys, code, bag), searchSubtitleCat(keys, code, bag)]
.map(function (p) { return Promise.resolve(p).catch(function () {});});
await Promise.all(jobs);
var dispTitle = stripEpisodeMarkers(getText(params.title) || getText(params.seriesName));
var tokens = titleTokensOf(dispTitle);
var titleLoose = dispTitle.toLowerCase().replace(/[-_.\s]/g, "");
bag = bag.filter(function (it) {
if (it.viaCode || it.codeHit || tokenHitOf(it.name, tokens)) return true;
if (titleLoose.length >= 4) {
var nl = String(it.name || "").toLowerCase().replace(/[-_.\s]/g, "");
if (nl.indexOf(titleLoose) >= 0) return true;
}
return false;
});
return mergeResults(bag);
} catch (e) {
return [];
}
}
