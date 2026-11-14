// JavDay for REX (lai_javday v1.0.0)
// 移植自 mira-cat 蜘蛛 py_javday.js（只读蓝图），后端 https://javday.app/。
// 分类：首页导航 6 个实分类（新作上市/有碼/無修正流出/國產AV/AI 短劇/熱門事件），无子分类。
// 列表：/category/<slug>/，翻页 /category/<slug>/page/N/；卡片 a.videoBox，
//   href /videos/<CODE>/，封面在 style background-image，标题 span.title，备注 span.videoBox-time。
// 搜索：站内表单 GET /search/?wd=（VM 出口触发 CF 挑战，手机住宅 IP 应可过）。
// 详情：/videos/<CODE>/，标题 <title> 去 " - JAVDAY" 后缀；封面 og:image；
//   播放地址嵌在详情页 JS 里：url: 'https://javday.homes/videos/<hash>/<sub>/index.m3u8'
//   （无 line 参数）。注意：<source src='...?line=...'> 带 line 参数时取播单恒 403，
//   必须去掉 ?line= 才 200。播单为单媒体列表，单档，首分片实测 200 video/mp2t。
//   播单地址每次现取（详情只出一条“原画”线，点播现取新鲜地址）。
// 字幕：猫源字幕芯是猫源专属，REX 版不接（javhey 同款）。

WidgetMetadata = {
  id: "lai_javday",
  title: "JavDay",
  description: "JavDay：6 分类，详情单档原画 m3u8，点播现取新鲜地址",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://javday.app",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "新作上市", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "new-release" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "有碼", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "censored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "無修正流出", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "uncensored-leaked" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "國產AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "chinese-av" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "AI 短劇", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "aiav" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "熱門事件", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "hot-issue" }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://javday.app";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/604.1.14 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1";

function t(v) {
  return String(v == null ? "" : v).trim().replace(/\s+/g, " ");
}

function decodeHtml(s) {
  return String(s || "")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, d) { var c = parseInt(d, 10); return (c > 0 && c < 0x110000) ? String.fromCharCode(c) : m; });
}

function cleanText(s) {
  return decodeHtml(t(String(s || "").replace(/<[^>]*>/g, " ")));
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return HOST + "/" + u;
}

async function getHtml(url, referer) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Referer": referer || HOST + "/"
      }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body;
  } catch (e) { return ""; }
}

// 列表解析：<a class="videoBox" href="/videos/<CODE>/">，封面在 style，标题 span.title
function parseList(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<a[^>]*href="\/videos\/([^/]+)\/"[^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var code = m[1];
    var body = m[2] || "";
    if (!code || seen[code]) continue;
    if (body.indexOf("videoBox-cover") < 0 && body.indexOf("videoBox-info") < 0) continue;
    var titleM = body.match(/<span class="title">([^<]*)<\/span>/i);
    var title = titleM ? cleanText(titleM[1]) : "";
    if (!title) continue;
    var picM = body.match(/background-image:\s*url\((https?:\/\/[^)]+)\)/i);
    var timeM = body.match(/<span class="videoBox-time">([^<]*)<\/span>/i);
    seen[code] = 1;
    var link = HOST + "/videos/" + code + "/";
    out.push({
      id: link,
      type: "url",
      title: title,
      posterPath: picM ? picM[1] : "",
      coverUrl: picM ? picM[1] : "",
      backdropPath: picM ? picM[1] : "",
      link: link,
      description: timeM ? cleanText(timeM[1]) : "",
      mediaType: "movie"
    });
  }
  return out;
}

function parsePagecount(html) {
  if (!html) return 1;
  var nums = [];
  var re = /\/page\/(\d+)\//g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var n = parseInt(m[1], 10);
    if (n > 0 && n < 100000) nums.push(n);
  }
  return nums.length ? Math.max.apply(null, nums) : 1;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "new-release");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var base = HOST + "/category/" + zone + "/";
  var url = page <= 1 ? base : base + "page/" + page + "/";
  try {
    var html = await getHtml(url);
    var list = parseList(html);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

async function search(params) {
  params = params || {};
  var wd = t(params.keyword || params.wd || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return emptyItem("请输入关键词");
  try {
    var url = HOST + "/search/?wd=" + encodeURIComponent(wd);
    if (page > 1) url += "&page=" + page;
    var html = await getHtml(url);
    var list = parseList(html);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

function codeOf(durl) {
  var m = String(durl || "").match(/\/videos\/([^/?#]+)/i);
  return m ? m[1].replace(/\/$/, "") : "";
}

// 详情页取播单地址：优先 JS 里的 url（本身无 line 参数）；其次 <source src> 去掉 ?line=
function extractM3u8(html) {
  if (!html) return "";
  var m = html.match(/url:\s*'([^']*index\.m3u8[^']*)'/i);
  if (m) return m[1].split("?")[0];
  m = html.match(/<source[^>]+src='([^']*index\.m3u8[^']*)'/i);
  if (m) return m[1].split("?")[0];
  m = html.match(/<source[^>]+src="([^"]*index\.m3u8[^"]*)"/i);
  if (m) return m[1].split("?")[0];
  return "";
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var durl = raw;
    if (!/^https?:\/\//i.test(durl)) durl = HOST + "/videos/" + durl.replace(/^\/+|\/+$/g, "") + "/";
    var code = codeOf(durl);
    var html = await getHtml(durl, durl);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = "";
    var tm = html.match(/<title>([^<]*)<\/title>/i);
    if (tm) name = cleanText(tm[1]).replace(/\s*-\s*JAVDAY\s*$/i, "").trim();
    var pic = "";
    var ogm = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    if (ogm) pic = ogm[1];
    // 单档：播单地址每次现取，详情只出一条“原画”线
    var id = durl + "@@DAY:" + code;
    var result = {
      id: durl,
      type: "detail",
      title: name || code,
      name: name || code,
      description: "",
      mediaType: "movie",
      link: durl,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app",
      episodes: [{ name: "原画", link: id }],
      seasons: [{ seasonNumber: 1, title: "原画", name: "原画", episodes: [{ title: "原画", episodeNumber: 1 }] }],
      episodeItems: [{
        id: id,
        type: "url",
        title: "原画",
        mediaType: "movie",
        posterPath: pic,
        link: id,
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1
      }],
      childItems: [{
        id: id,
        type: "url",
        title: "原画",
        mediaType: "movie",
        posterPath: pic,
        link: id,
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1
      }]
    };
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 档位入口：@@DAY:<code> -> 现取详情页，提 m3u8（去掉 ?line=）
  var at = raw.indexOf("@@DAY:");
  if (at >= 0) {
    var code = raw.slice(at + 6);
    var durl = HOST + "/videos/" + code + "/";
    var html = await getHtml(durl, durl);
    var url = extractM3u8(html);
    if (!url) return [];
    return [{ name: "原画", url: url, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": durl } }];
  }
  // 直链 m3u8
  if (/\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  }
  // 兜底：详情地址 -> 取详情首线
  try {
    var det = await loadDetail(raw);
    var eps = det && det.episodeItems;
    if (eps && eps.length) {
      return await loadResource({ link: eps[0].id });
    }
  } catch (e) { /* fall through */ }
  return [];
}
