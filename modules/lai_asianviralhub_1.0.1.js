// AsianViralHub for REX (lai_asianviralhub v1.0.1)
// v1.0.1 翻页修正 (2026-11-02, 只改翻页收尾, 其余一律不动):
//   ① 第 2 页起取不到内容时不再返回假卡片, 改为空列表, 让客户端干净收尾;
//      旧版在末页 (404 或空页) 返回 “没有找到相关内容” / “载入失败” 假卡,
//      客户端会把它当成一条真实视频继续展示、继续翻页, 看起来就是 “翻页断了”;
//   ② 页码取值放宽: 字符串 / 数字 / 包一层 value 的页码都能读出, 分类键除
//      path/cat 外再认 category; 正常调用的取值与旧版完全一致, 第 1 页行为不变。
//   其余: 28 分类、翻页 URL 形式 (/categories/{{slug}}/{{n}}/)、解析口径 (24 条封顶)、
//   详情与播放均与 1.0.0 逐字一致。
// 移植自 mira-cat 蜘蛛 asian.js (KVS 同构站模板 makeSpider), 后端: https://asianviralhub.com/。
// 列表: <a href="https://asianviralhub.com/video/{{id}}/{{slug}}/" title="..."> 内
//   <img data-original="..."> 或 <img src="...">, 与蜘蛛 parseList 同口径 (取卡片后 3000 字符内找图)。
// 分类: 蜘蛛尾部 makeSpider 调用的 CATEGORIES 原样照搬, 共 28 个, 不增不减。
// 详情: flashvars 里 video_url 即 get_file mp4 直链 (带时效参数, 详情时现取),
//   preview_url 为封面。仅 video_url 单线, 无 alt 档
// 搜索: /search/{{kw}}/ (分页 /search/{{kw}}/{{n}}/); 分类分页 /categories/{{slug}}/{{n}}/。
// 封面与播放均为站方直链, 蜘蛛未走任何代理, 模块同样直连, 不复用 Worker。

WidgetMetadata = {
  id: "lai_asianviralhub",
  title: "AsianViralHub",
  description: "AsianViralHub（https://asianviralhub.com）：KVS 同构站，28 个分类，详情 get_file mp4 直链；v1.0.1 翻页修正：第 2 页起末页空页返回空列表",
  author: "lai",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  site: "https://asianviralhub.com/",
  detailCacheDuration: 180,
  modules: [
    { title: "Leaked", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "leaked/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Porn", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "porn/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Sextape", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "sextape/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Solo", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "solo/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "AV Idol", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "av-idol/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Porn Actress", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "porn-actress/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "AI Generated", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ai-generated/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Fisting", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "fisting/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "South Korean", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "south-korean/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Camgirl", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "camgirl/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Housewife", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "housewife/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "JAV Uncensored", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "jav-uncensored/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "XXX", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "xxx/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "XX", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "xx/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Blonde", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "blonde/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Bigbooty", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "bigbooty/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Hairy", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "hairy/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Striptease", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "striptease/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Twerking", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "twerking/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Riding Dildo", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "riding-dildo/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Ebony", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "ebony/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Close Up", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "close-up/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Fake Tits", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "fake-tits/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Smoking", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "smoking/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Roommate", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "roommate/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Pajamas", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "pajamas/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Music", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "music/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Desires", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "desires/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "搜索", functionName: "search", cacheDuration: 180, params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] }
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

var BASE = "https://asianviralhub.com";
var HOST = "https://asianviralhub.com/";
var VIDEOPATH = "video/";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var FIRST_CAT = "leaked/";

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": referer || HOST
  };
}

function t(v) {
  return String(v == null ? "" : v).trim();
}

// 翻页取值放宽 (正常调用与旧版完全一致): 页码可为字符串 / 数字 / 包一层 value 的对象,
// 字符串里夹带数字 (如 "page=2") 也取首个数字; 无数字则回 1。
function pickPage(raw) {
  if (raw == null) return 1;
  if (typeof raw === "number") return Math.max(1, Math.floor(raw) || 1);
  if (typeof raw === "object") {
    var inner = raw.value != null ? raw.value : (raw.page != null ? raw.page : raw.index);
    return pickPage(inner);
  }
  var m = String(raw).match(/\d+/);
  return m ? Math.max(1, parseInt(m[0], 10)) : 1;
}

// 分类键放宽: path / cat / category, 皆无则回首分类; 正常调用与旧版完全一致。
function pickPath(params) {
  params = params || {};
  return t(params.path || params.cat || params.category) || FIRST_CAT;
}

function stripTags(s) {
  return String(s || "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}

function decodeAmp(s) {
  return String(s || "").replace(/&amp;/g, "&");
}

function firstMatch(text, re, idx) {
  var m = String(text || "").match(re);
  return m ? m[idx || 1] || "" : "";
}

function escRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseList(html) {
  var items = [];
  var seen = {};
  var re = new RegExp('<a[^>]*href="(' + escRe(HOST) + VIDEOPATH + '\\d+/[^"]+)"[^>]*title="([^"]*)"', "gi");
  var m;
  while ((m = re.exec(String(html || ""))) !== null) {
    var url = m[1];
    if (seen[url]) continue;
    var seg = String(html).slice(m.index, m.index + 3000);
    var im = seg.match(/data-original="(https?:[^"]+)"/i) || seg.match(/<img[^>]*src="(https?:[^"]+)"/i);
    var title = stripTags(m[2]);
    if (!title || title.length < 2) continue;
    seen[url] = 1;
    var cover = im ? im[1] : "";
    items.push({
      id: url,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: url,
      description: "",
      mediaType: "movie"
    });
    if (items.length >= 24) break;
  }
  return items;
}

async function getText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders(HOST) });
  return res && res.data != null ? String(res.data) : "";
}

async function loadList(params) {
  params = params || {};
  var page = pickPage(params.page);
  var tid = pickPath(params);
  var clean = tid.replace(/^\/+/, "").replace(/\/+$/, "");
  var base = HOST + "categories/" + clean;
  var url = page === 1 ? (base + "/") : (base + "/" + page + "/");
  try {
    var html = await getText(url);
    var list = parseList(html);
    if (list.length) return list;
    // 第 2 页起无内容 = 已到末页: 返回空列表让客户端干净收尾, 绝不返回假卡片。
    // 第 1 页保持旧版占位卡, 行为不变。
    if (page > 1) return [];
    return [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
  } catch (e) {
    if (page > 1) return [];
    return [{ id: "err", type: "url", title: "载入失败", description: String((e && e.message) || e) + " | URL: " + url }];
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
  var page = pickPage(params.page);
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var url = HOST + "search/" + encodeURIComponent(wd) + "/";
  if (page > 1) url += page + "/";
  try {
    var html = await getText(url);
    var list = parseList(html);
    if (list.length) return list;
    // 与 loadList 同一条翻页收尾规则: 第 2 页起无内容返回空列表, 第 1 页占位卡不变。
    if (page > 1) return [];
    return [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
  } catch (e) {
    if (page > 1) return [];
    return [{ id: "err", type: "url", title: "搜索失败", description: String((e && e.message) || e) + " | URL: " + url }];
  }
}

// 与蜘蛛 detail 同口径: 仅取 video_url 单线 (flashvars), 兜底 get_file 直链正则;
// 蜘蛛原样未解 &amp;, 模块侧补解码 (与 ultra 模板一致, 不改变地址本身)。
function extractVideoUrl(html) {
  var vm = String(html || "").match(/video_url['"]?\s*[:=]\s*['"]([^'"]+)/i) || String(html || "").match(/https?:\/\/[^\s"'<>]+\/get_file\/[^\s"'<>]+\.mp4[^\s"'<>]*/i);
  return vm ? decodeAmp(vm[1]) : "";
}

async function loadDetail(link) {
  try {
    var url = String(link || "");
    if (!/^https?:\/\//i.test(url)) url = HOST + url.replace(/^\/+/, "");
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var html = await getText(url);
    var title = firstMatch(html, /<title>([\s\S]{0,300}?)<\/title>/i) || "AsianViralHub";
    var cover = decodeAmp(firstMatch(html, /preview_url['"]?\s*[:=]\s*['"]([^'"]+)/i));
    var name = stripTags(title) || url;
    var videoUrl = extractVideoUrl(html);
    if (!videoUrl) {
      return { id: url, type: "url", title: name, description: "未找到播放地址" };
    }
    return {
      id: url,
      type: "detail",
      title: name,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": HOST
      }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
