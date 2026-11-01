// ToJav for REX (lai_tojav v1.0.0)
// 移植自 mira-cat 蜘蛛 py_tojav.js（只读蓝图，未改动猫源），后端 https://tojav.net。
// 列表：HTML tray 卡片（无码/genre 走 /page-N，有码走 POST /api/v1/pageView）；搜索走 POST /api/v1/search（站方只回 30 条、不支持翻页）。
// 详情：/<slug> 取 filmId 与 epButton，loadDetail 内一次走完猫源 play 链：POST /api/v1/player 取 vid-snap 嵌页，
//   再取 /api/playlist-token 得 HLS（https://vid-snap-player.com/v/<token>，token 含请求方 IP 与时间戳，须设备侧现取）。
// 清晰度：猫源实测主清单只有 1080p 单档，只出一线 1080p，不编造其他档位；多集条目只取第 1 集。
// 字幕：猫源有字幕聚合，但 REX 详情单 videoUrl 无字幕槽、且聚合芯依赖沙箱禁用的定时器，故本模块不接字幕。
// javtiful 嵌套条目（-mosaic 类）按猫源 2026-10-31 查实链路处理：嵌页 playback 取最大档源，失败则回嵌页嗅探。

WidgetMetadata = {
  id: "lai_tojav",
  title: "ToJav",
  description: "ToJav（tojav.net）：最新/无码流出/巨乳/大屁股/人妻/制服/4K/减码/护士/女仆/有码等 38 个分类，详情现取 1080p HLS",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://tojav.net",
  detailCacheDuration: 180,
  modules: [
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码流出", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:uncensored-leaked" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:big-tits" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "大屁股", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:big-asses" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:married-woman" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "制服", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:uniform" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "4K", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:4k" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "减码", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:reducing-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "护士", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:nurse" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "女仆", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:maid" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "censored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Beautiful Girl", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:beautiful-girl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Featured Actress", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:featured-actress" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Nymphomaniac", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:nymphomaniac" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Kiss Kiss", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:kiss-kiss" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Idol & Celebrity", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:idol-celebrity" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Squirting", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:squirting" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Digital Mosaic", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:digital-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Hi-Def", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:hi-def" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Humiliation", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:humiliation" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "POV", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:pov" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Slut", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:slut" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Glasses", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:glasses" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Urination", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:urination" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Schoolgirl", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:schoolgirl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Reluctant", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:reluctant" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Drama", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:drama" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Threesome / Foursome", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:threesome--foursome" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Gang Bang", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:gang-bang" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Female Teacher", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:female-teacher" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Titty Fuck", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:titty-fuck" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Cheating Wife", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:cheating-wife" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Creampie", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:creampie" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Orgy", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:orgy" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Cowgirl", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:cowgirl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Slender", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:slender" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Dirty Talk", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:dirty-talk" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "BUKKAKE", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "genre:bukkake" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "搜索", functionName: "search", params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] }
  ]
};

var KEY = 'py_tojav';
var NAME = 'ToJav';
var HOST = 'https://tojav.net';
var EMBED = 'https://vid-snap-player.com';
var UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
var PAGE_SIZE = 30;

function t(v) { return String(v == null ? '' : v).trim(); }
function clean(s) {
  return t(s).replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ').trim();
}
// 纯 JS base64（ASCII 输入；token/socket 本身就是 base64 文本）
var B64C = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function b64encode(str) {
  var out = ''; var i;
  for (i = 0; i + 2 < str.length; i += 3) {
    var n = (str.charCodeAt(i) << 16) | (str.charCodeAt(i + 1) << 8) | str.charCodeAt(i + 2);
    out += B64C[(n >> 18) & 63] + B64C[(n >> 12) & 63] + B64C[(n >> 6) & 63] + B64C[n & 63];
  }
  var rem = str.length - i;
  if (rem === 1) { var n1 = str.charCodeAt(i) << 16; out += B64C[(n1 >> 18) & 63] + B64C[(n1 >> 12) & 63] + '=='; }
  else if (rem === 2) { var n2 = (str.charCodeAt(i) << 16) | (str.charCodeAt(i + 1) << 8); out += B64C[(n2 >> 18) & 63] + B64C[(n2 >> 12) & 63] + B64C[(n2 >> 6) & 63] + '='; }
  return out;
}

// ---------- HTTP（只走框架 req） ----------
async function reqGet(url, headers, timeoutMs) {
  try {
    var r = await Widget.http.get(url, { headers: headers || {} });
    var text = typeof r.data === "string" ? r.data : (r.data == null ? "" : JSON.stringify(r.data));
    var ok = !r.status || (r.status >= 200 && r.status < 300);
    return { status: ok ? 200 : (r.status || 0), body: ok ? text : "" };
  } catch (e) { return { status: 0, body: "" }; }
}
async function reqPostForm(url, data, headers) {
  var body = Object.keys(data).map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]); }).join("&");
  try {
    if (!Widget.http || typeof Widget.http.post !== "function") return { status: 0, json: null, text: "" };
    var r = await Widget.http.post(url, body, { headers: Object.assign({ "Content-Type": "application/x-www-form-urlencoded" }, headers || {}) });
    if (typeof r.data === "string") { try { return { status: r.status || 200, json: JSON.parse(r.data), text: r.data }; } catch (e) { return { status: r.status || 200, json: null, text: r.data }; } }
    return { status: r.status || 200, json: r.data, text: "" };
  } catch (e) { return { status: 0, json: null, text: "" }; }
}

// ---------- 鉴权（首页 meta，30 分钟缓存） ----------
var AUTH_CACHE = null;
async function getAuth() {
  if (AUTH_CACHE && Date.now() - AUTH_CACHE.ts < 30 * 60 * 1000) return AUTH_CACHE.auth;
  var r = await reqGet(HOST + '/', { 'User-Agent': UA });
  if (r.status !== 200) throw new Error('auth page fail');
  var token = (r.body.match(/meta name="_token"[^>]*value="([^"]+)"/) || [])[1] || '';
  var socket = (r.body.match(/meta name="_socket"[^>]*value="([^"]+)"/) || [])[1] || '';
  if (!token || !socket) throw new Error('auth meta missing');
  var auth = 'Basic ' + b64encode(token + ':' + socket);
  AUTH_CACHE = { ts: Date.now(), auth };
  return auth;
}

// ---------- 列表解析 ----------
function absPoster(p) {
  if (!p) return '';
  if (/^https?:\/\//.test(p)) return p;
  return HOST + (p.charAt(0) === '/' ? '' : '/') + p;
}
function parseItems(html) {
  var out = [];
  var re = /<a href="\/([^"]+)">\s*<img class="tray-item-thumbnail" src="([^"]+)" alt="([^"]*)"/g;
  var m;
  while ((m = re.exec(html)) && out.length < 60) {
    out.push({ vod_id: m[1], vod_name: clean(m[3]), vod_pic: absPoster(m[2]), vod_remarks: '' });
  }
  return out;
}
async function listPage(path, page) {
  var url = HOST + path + (page > 1 ? '/page-' + page : '');
  var r = await reqGet(url, { 'User-Agent': UA });
  if (r.status !== 200) return { list: [], more: false };
  var list = parseItems(r.body);
  return { list, more: list.length >= PAGE_SIZE };
}

// ---------- 分类 ----------
var KW_CATS = [
  // 大屁股已改走原生 genre:big-asses（见 CATS；搜索接口只回 30 条且不支持翻页，2026-10-31 实测）
];
var CATS = [
  { type_id: 'latest', type_name: '最新' },
  { type_id: 'genre:uncensored-leaked', type_name: '无码流出' },
  { type_id: 'genre:big-tits', type_name: '巨乳' },
  { type_id: 'genre:big-asses', type_name: '大屁股' },
  { type_id: 'genre:married-woman', type_name: '人妻' },
  { type_id: 'genre:uniform', type_name: '制服' },
  { type_id: 'genre:4k', type_name: '4K' },
  { type_id: 'genre:reducing-mosaic', type_name: '减码' },
  { type_id: 'genre:nurse', type_name: '护士' },
  { type_id: 'genre:maid', type_name: '女仆' },
  { type_id: 'censored', type_name: '有码' },
  { type_id: 'genre:beautiful-girl', type_name: 'Beautiful Girl' },
  { type_id: 'genre:featured-actress', type_name: 'Featured Actress' },
  { type_id: 'genre:nymphomaniac', type_name: 'Nymphomaniac' },
  { type_id: 'genre:kiss-kiss', type_name: 'Kiss Kiss' },
  { type_id: 'genre:idol-celebrity', type_name: 'Idol & Celebrity' },
  { type_id: 'genre:squirting', type_name: 'Squirting' },
  { type_id: 'genre:digital-mosaic', type_name: 'Digital Mosaic' },
  { type_id: 'genre:hi-def', type_name: 'Hi-Def' },
  { type_id: 'genre:humiliation', type_name: 'Humiliation' },
  { type_id: 'genre:pov', type_name: 'POV' },
  { type_id: 'genre:slut', type_name: 'Slut' },
  { type_id: 'genre:glasses', type_name: 'Glasses' },
  { type_id: 'genre:urination', type_name: 'Urination' },
  { type_id: 'genre:schoolgirl', type_name: 'Schoolgirl' },
  { type_id: 'genre:reluctant', type_name: 'Reluctant' },
  { type_id: 'genre:drama', type_name: 'Drama' },
  { type_id: 'genre:threesome--foursome', type_name: 'Threesome / Foursome' },
  { type_id: 'genre:gang-bang', type_name: 'Gang Bang' },
  { type_id: 'genre:female-teacher', type_name: 'Female Teacher' },
  { type_id: 'genre:titty-fuck', type_name: 'Titty Fuck' },
  { type_id: 'genre:cheating-wife', type_name: 'Cheating Wife' },
  { type_id: 'genre:creampie', type_name: 'Creampie' },
  { type_id: 'genre:orgy', type_name: 'Orgy' },
  { type_id: 'genre:cowgirl', type_name: 'Cowgirl' },
  { type_id: 'genre:slender', type_name: 'Slender' },
  { type_id: 'genre:dirty-talk', type_name: 'Dirty Talk' },
  { type_id: 'genre:bukkake', type_name: 'BUKKAKE' },
];
// 关键词分类：走站方搜索接口（POST /api/v1/search {term}，
// 站方返回 30 条；标题盲扫 240 条曾 0 命中，搜索接口是唯一可靠途径）。
// 搜索接口不支持翻页（page/offset 参数实测均被忽略、回同样 30 条），
// 故关键词分类只有 1 页、属接口上限，非程序 bug。
// 短剧：用户 2026-10-31 令四家统一去掉，本站不设（站内搜“短編”得 0 条）。
var KWCACHE = {};
async function kwSearch(cat, page) {
  if (page > 1) return { list: [], more: false };
  if (KWCACHE[cat.id]) return { list: KWCACHE[cat.id], more: false };
  var auth = await getAuth();
  var r = await reqPostForm(HOST + '/api/v1/search', { term: cat.term },
    { Authorization: auth, 'User-Agent': UA, Referer: HOST + '/', 'X-Requested-With': 'XMLHttpRequest' });
  if (r.status !== 200 || !Array.isArray(r.json)) return { list: [], more: false };
  var list = r.json.slice(0, PAGE_SIZE).map((it) => ({
    vod_id: it.slug, vod_name: clean(it.name), vod_pic: absPoster(it.poster), vod_remarks: '',
  }));
  KWCACHE[cat.id] = list;
  return { list, more: false };
}
// 有码分页：POST /api/v1/pageView {page}（type 参数站方忽略，实测恒回有码流）
async function censoredPage(page) {
  var auth = await getAuth();
  var r = await reqPostForm(HOST + '/api/v1/pageView', { page, type: 'censored' },
    { Authorization: auth, 'User-Agent': UA, Referer: HOST + '/jav/censored', 'X-Requested-With': 'XMLHttpRequest' });
  if (r.status !== 200 || !Array.isArray(r.json)) return { list: [], more: false };
  var list = r.json.slice(0, PAGE_SIZE).map((it) => ({
    vod_id: it.slug, vod_name: clean(it.name), vod_pic: absPoster(it.poster), vod_remarks: '',
  }));
  return { list, more: list.length >= PAGE_SIZE };
}

// ---------- REX 入口（猫源 play 链在 loadDetail 内一次走完） ----------
function toCard(item) {
  var url = HOST + "/" + item.vod_id;
  var cover = item.vod_pic || "";
  return { id: url, type: "url", title: item.vod_name || item.vod_id, posterPath: cover, coverUrl: cover, backdropPath: cover, link: url, description: item.vod_remarks || "", mediaType: "movie" };
}
function toCards(list) {
  var out = [];
  for (var i = 0; i < (list || []).length; i++) { var c = toCard(list[i]); if (c.title) out.push(c); }
  return out;
}
function firstMatch(text, re, idx) {
  var m = String(text || "").match(re);
  return m ? t(m[idx || 1] || "") : "";
}
async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var tid = String(params.cat || params.path || params.tid || "latest");
  try {
    var r = { list: [], more: false };
    if (tid === "latest") r = await listPage("/jav/uncensored", page);
    else if (tid === "censored") r = await censoredPage(page);
    else if (tid.indexOf("genre:") === 0) r = await listPage("/genre/" + tid.slice(6), page);
    var cards = toCards(r.list);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 60), description: String((e && e.message) || e) }];
  }
}
function pickKeyword(params) {
  if (params == null) return "";
  if (typeof params === "string" || typeof params === "number") return String(params).trim();
  var keys = ["keyword", "q", "search", "text", "query", "wd", "key"];
  for (var i = 0; i < keys.length; i++) if (params[keys[i]]) return String(params[keys[i]]).trim();
  return "";
}
async function search(params) {
  params = params || {};
  var wd = pickKeyword(params);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  if (page > 1) return [];
  try {
    var auth = await getAuth();
    var r = await reqPostForm(HOST + "/api/v1/search", { term: wd },
      { Authorization: auth, "User-Agent": UA, Referer: HOST + "/", "X-Requested-With": "XMLHttpRequest" });
    if (r.status !== 200 || !Array.isArray(r.json)) return [{ id: "empty", type: "url", title: "没有找到相关内容" }];
    var list = r.json.slice(0, PAGE_SIZE).map(function (it) { return { vod_id: it.slug, vod_name: clean(it.name), vod_pic: absPoster(it.poster), vod_remarks: "" }; });
    var cards = toCards(list);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 60), description: String((e && e.message) || e) }];
  }
}
async function resolvePlay(filmId, episode) {
  var auth = await getAuth();
  var pr = await reqPostForm(HOST + "/api/v1/player", { episode: episode, filmId: filmId },
    { Authorization: auth, "User-Agent": UA, Referer: HOST + "/", "X-Requested-With": "XMLHttpRequest" });
  var playerHtml = "";
  if (pr.json && pr.json.player) playerHtml = pr.json.player;
  else if (pr.text) { try { playerHtml = JSON.parse(pr.text).player || ""; } catch (e) {} }
  var m = playerHtml.match(/embed\/([0-9a-f-]{36})/);
  if (!m) {
    var jm = playerHtml.match(/javtiful\.com\/embed\/(\d+)/);
    if (jm) {
      var jtEmbed = "https://javtiful.com/embed/" + jm[1];
      try {
        var eh = await reqGet(jtEmbed, { "User-Agent": UA, Referer: HOST + "/" });
        var pm = (eh.body || "").match(/"playback"\s*:\s*\{\s*"endpoint"\s*:\s*"([^"]+)"\s*,\s*"ticket"\s*:\s*"([^"]+)"/i);
        if (pm) {
          var endpoint = pm[1].indexOf("http") === 0 ? pm[1] : "https://javtiful.com" + pm[1];
          var pb = await reqPostForm(endpoint, { ticket: pm[2] },
            { "User-Agent": UA, Referer: jtEmbed, "X-Requested-With": "XMLHttpRequest" });
          var pj = pb.json;
          if (!pj && pb.text) { try { pj = JSON.parse(pb.text); } catch (e) {} }
          if (pj && pj.success && Array.isArray(pj.sources) && pj.sources.length) {
            var best = pj.sources[0];
            for (var i = 0; i < pj.sources.length; i++) if ((pj.sources[i].size || 0) > (best.size || 0)) best = pj.sources[i];
            var src = best.src || best.fallbackSrc || "";
            if (src && !/^https?:\/\//i.test(src)) src = "https://javtiful.com" + (src.charAt(0) === "/" ? "" : "/") + src;
            if (src) return { url: src, sniff: false, referer: jtEmbed };
          }
        }
      } catch (e) {}
      return { url: jtEmbed, sniff: true, referer: HOST + "/" };
    }
    var im = playerHtml.match(/<iframe[^>]+src="(https?:\/\/[^"]+)"/i);
    if (im) return { url: im[1], sniff: true, referer: HOST + "/" };
    return { url: "", sniff: false, referer: HOST + "/" };
  }
  var embedUrl = EMBED + "/embed/" + m[1];
  var tr = await reqGet(EMBED + "/api/playlist-token/" + m[1],
    { Accept: "application/json", "User-Agent": UA, Referer: embedUrl });
  var token = "";
  if (tr.status === 200) { try { token = JSON.parse(tr.body).t || ""; } catch (e) {} }
  if (token) return { url: EMBED + "/v/" + token, sniff: false, referer: embedUrl };
  return { url: embedUrl, sniff: true, referer: HOST + "/" };
}
async function loadDetail(link) {
  var raw = String(link || "");
  try {
    var url = raw;
    if (!/^https?:\/\//i.test(url)) url = HOST + "/" + url.replace(/^\/+/, "");
    if (url.indexOf(HOST + "/") !== 0) return { id: raw, type: "url", title: "解析失败", description: "不是 ToJav 链接" };
    var r = await reqGet(url, { "User-Agent": UA });
    if (r.status !== 200 || !r.body) return { id: raw, type: "url", title: "请求错误", description: "详情页取不到" };
    var html = r.body;
    var title = clean(firstMatch(html, /og:title" content="([^"]*)"/) || firstMatch(html, /<title>([^<]*)<\/title>/)) || raw;
    var pic = absPoster(firstMatch(html, /og:image" content="([^"]*)"/) || "/default-cover.jpg");
    var filmId = firstMatch(html, /filmId\s*=\s*'(\d+)'/);
    var eps = [];
    var epRe = /epButton[^>]*data-id="(\d+)"/g;
    var em;
    while ((em = epRe.exec(html))) eps.push(em[1]);
    if (!filmId || !eps.length) return { id: raw, type: "url", title: title, description: "未找到播放地址" };
    var play = await resolvePlay(filmId, eps[0]);
    if (!play.url) return { id: raw, type: "url", title: title, description: "未找到播放地址" };
    return { id: raw, type: "detail", title: title, link: raw, posterPath: pic, coverUrl: pic, backdropPath: pic, videoUrl: play.url, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": play.referer || HOST + "/" }, description: play.sniff ? "嵌页嗅探兜底" : "" };
  } catch (e) {
    return { id: raw || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
