// v1.0.5：AVDB 样式详情修正（真站页实测）：详情页唯一的本片 taxonomy 是 /search/actor/<名>/（素人页
// 16 条 videoBox 卡）；/category/ 是全站导航（保留为可点分类卡，点按走 loadList），/label/、/topic/
// 是导航分区（点按走搜索会 403/无内容，现过滤掉）。演员点按改走 /search/actor/ 页直取（不再走
// /search/?wd=）；补 loadList peopleId/genreId 派发与 loadDetail 裸名兜底。
// JavDay for REX (lai_javday v1.0.3)
// v1.0.3（2026-11-21）：补顶层 search 键（A 键，照 64 个可见模块的众数形状）；B 条目与 search 函数一个字未动。
// v1.0.2（2026-11-15）：1.0.1 在 VM 全通，手机上“原画”点播恒空白。根因——详情只出
//   懒解析链接（无 videoUrl），loadResource 要先在手机侧现取播单才回 Worker 行，手机上
//   那步一失败就回 []，播放器什么都拿不到；且 hlsLive() 存活探测在手机上可能误判死，
//   回落直链（播放器不转发 Referer 到分片，直链必死）。修法按蜜夜AI/YesPorn 1.0.2 同款：
//   loadDetail 直接把 Worker /play.m3u8 地址写进 episodeItem 的 videoUrl（system），
//   点播不再二次解析；loadResource 全程 try/catch 绝不抛错，Worker 行不再被存活探测卡住。
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
  version: "1.0.5",
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

var HOST = "https://javday.app";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/604.1.14 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1";
// 播单代理 Worker（见同目录 javday-hls-worker.js，需用户部署；域名 https://javday-hls.li768435813.workers.dev）：
// REX 播放器不把 customHeaders 转发到分片/密钥请求，直链必死；
// Worker 服务端带头/改写播单。Worker 未部署时回落直链（旧行为）。
var HLS = "https://javday-hls.li768435813.workers.dev";
var _hlsLive = null;
var _hlsLiveAt = 0;
async function hlsLive() {
  if (_hlsLive !== null && Date.now() - _hlsLiveAt < 600000) return _hlsLive;
  var ok = false;
  try {
    var res = await Widget.http.get(HLS + "/", { headers: { "User-Agent": UA } });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    ok = res && res.status === 200 && body.indexOf("-hls ok") >= 0;
  } catch (e) { ok = false; }
  _hlsLive = ok;
  _hlsLiveAt = Date.now();
  return ok;
}


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

async function actorWorks(name, page) {
  var url = HOST + "/search/actor/" + encodeURIComponent(name) + "/";
  try {
    var html = await getHtml(url);
    var list = parseList(html);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "new-release");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!params.zone) {
    var taxIn = t(params.peopleId || params.genreId || params.url || params.link || params.path || params.id || params.title || params.name || "");
    if (taxIn) {
      var mA = taxIn.match(/\/search\/actor\/([^/?#]+)/);
      var mC = taxIn.match(/\/category\/([^/?#]+)/);
      if (mA) { var aN = ""; try { aN = decodeURIComponent(mA[1]); } catch (e) { aN = mA[1]; } return actorWorks(aN, page); }
      if (mC) { zone = mC[1]; }
      else if (taxIn.indexOf("actor:") === 0) return actorWorks(taxIn.slice(6), page);
      else if (taxIn.indexOf("tag:") === 0) { zone = taxIn.slice(4); }
      else if (taxIn.indexOf("/") < 0) return actorWorks(taxIn, page);
    }
  }
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


// ---- AVDB 样式详情：演员/分类（点按出对应全部内容）----
// 详情页 HTML 里扫演员/分类链接（站内同源），建成 peoples / genreItems；
// 点按后 loadDetail 走分类页分支（loadList 或 search 取该分类的全部影片）。
var TAX_ACTRESS_RE = /\/(actress(?:es)?|actors?|stars?|pornstars?|performers?|models?|idols?)\//i;
var TAX_GENRE_RE = /\/(genres?|tags?|categor(?:y|ies)|labels?|makers?|studios?|directors?|codes?)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)|actress(es)?|actors?|stars?|makers?|all|全部|分类|演员|标签|女优|题材|片商)$/i;
var TAX_AFTER_RE = /\/actress(?:es)?\/|\/actors?\/|\/stars?\/|\/pornstars?\/|\/performers?\/|\/models?\/|\/idols?\/|\/genres?\/|\/tags?\/|\/categor(?:y|ies)\/|\/labels?\/|\/makers?\/|\/studios?\/|\/directors?\/|\/codes?\//i;

function extractTaxonomyFromHtml(html) {
  var peoples = [];
  var genreItems = [];
  var seenP = {};
  var seenG = {};
  var baseHost = String(HOST || "").replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(String(html || ""))) !== null) {
    var href = m[1] || "";
    var name = String(m[2] || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (!name || name.length > 40 || TAX_NAV_NAME_RE.test(name)) continue;
    var abs = absUrl(href);
    if (!/^https?:\/\//i.test(abs)) continue;
    var host = abs.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (baseHost && host !== baseHost) continue;
    // /label/（最近更新/人氣系列/國產AV廠商）与 /topic/（藏精閣）是全站导航分区，不是本片分类，点按无对应内容
    if (/\/label\//i.test(abs) || /\/topic\//i.test(abs)) continue;
    var after = abs.split(TAX_AFTER_RE)[1] || "";
    after = after.split("?")[0].split("#")[0].replace(/\/+$/, "");
    if (!after) continue;
    if (TAX_ACTRESS_RE.test(abs)) {
      if (seenP[name]) continue;
      seenP[name] = 1;
      peoples.push({ id: abs, title: name, name: name, link: abs, role: "演员" });
    } else if (TAX_GENRE_RE.test(abs)) {
      if (seenG[name]) continue;
      seenG[name] = 1;
      genreItems.push({ id: abs, title: name });
    }
    if (peoples.length >= 20 && genreItems.length >= 20) break;
  }
  return { peoples: peoples, genreItems: genreItems };
}

function taxWire(ret, html) {
  if (!ret || !html) return ret;
  var tax = extractTaxonomyFromHtml(html);
  if (tax.peoples.length) ret.peoples = tax.peoples;
  if (tax.genreItems.length) ret.genreItems = tax.genreItems;
  return ret;
}

function taxAttach(ret, tax) {
  if (!ret || !tax) return ret;
  if (tax.peoples.length) ret.peoples = tax.peoples;
  if (tax.genreItems.length) ret.genreItems = tax.genreItems;
  return ret;
}

function taxPathOf(url) {
  var s = String(url || "").replace(/^https?:\/\/[^/]+/i, "").split("?")[0].split("#")[0].replace(/^\/+|\/+$/g, "");
  return s;
}

function taxNameOf(url) {
  var s = String(url || "").split("?")[0].split("#")[0].replace(/\/+$/, "");
  var parts = s.split("/");
  var last = parts[parts.length - 1] || "";
  try { return decodeURIComponent(last); } catch (e) { return last; }
}

async function loadDetail(link) {
    // AVDB 样式：点按演员/分类 → 打开该演员/分类的全部影片。
    try {
      var taxUrl = unwrapLink(link);
      if (taxUrl && (TAX_ACTRESS_RE.test(taxUrl) || TAX_GENRE_RE.test(taxUrl))) {
        var taxIsActress = TAX_ACTRESS_RE.test(taxUrl);
        var taxName = taxNameOf(taxUrl);
        var taxPath = taxPathOf(taxUrl);
        var taxWorks = null;
        if (taxPath.indexOf("category/") === 0) taxWorks = await loadList({ zone: taxPath.slice(9), page: 1 });
        else if (taxPath.indexOf("search/actor/") === 0) taxWorks = await actorWorks(taxName, 1);
        else taxWorks = await search({ keyword: taxName, page: 1 });
        if (!Array.isArray(taxWorks)) taxWorks = [];
        var taxReal = taxWorks.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty" && w.id !== "tip"; });
        return {
          id: taxUrl,
          type: "detail",
          mediaType: "movie",
          title: taxName || (taxIsActress ? "演员" : "分类"),
          link: taxUrl,
          description: (taxIsActress ? "演员" : "分类") + " · 共 " + taxReal.length + " 部作品",
          videoUrl: "",
          childItems: [],
          relatedItems: taxReal.length ? taxReal : taxWorks
        };
      }
    } catch (eTax) {}

  var rawBare = unwrapLink(link);
  if (rawBare && rawBare.indexOf("/") < 0 && rawBare.indexOf(":") < 0 && /[^A-Za-z0-9]/.test(rawBare)) {
    var bWorks = await actorWorks(rawBare, 1);
    if (!Array.isArray(bWorks) || !bWorks.length || bWorks[0].id === "empty") bWorks = await search({ keyword: rawBare, page: 1 });
    var bReal = bWorks.filter(function (w) { return w && w.id !== "err" && w.id !== "empty" && w.id !== "tip"; });
    return {
      id: rawBare, type: "detail", mediaType: "movie", title: rawBare, link: rawBare,
      description: "演员 · 共 " + bReal.length + " 部作品",
      videoUrl: "", childItems: [], relatedItems: bReal.length ? bReal : bWorks
    };
  }

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
    // 单档：播单地址每次现取，详情只出一条“原画”线。
    // v1.0.2：详情直接把 Worker 地址写进 episodeItem 的 videoUrl（system），点播不再
    // 二次解析；播单提不到时不带 videoUrl 键（空串会被 App 当成无可播内容），只留懒链接回落。
    var id = durl + "@@DAY:" + code;
    var m3u8 = extractM3u8(html);
    var workerUrl = m3u8 ? HLS + "/play.m3u8?u=" + encodeURIComponent(m3u8) + "&r=" + encodeURIComponent(durl) : "";
    var epItem = {
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
    };
    if (workerUrl) {
      epItem.videoUrl = workerUrl;
      epItem.playerType = "system";
    }
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
      videoUrl: workerUrl,
      episodes: [{ name: "原画", link: id }],
      seasons: [{ seasonNumber: 1, title: "原画", name: "原画", episodes: [{ title: "原画", episodeNumber: 1 }] }],
      episodeItems: [epItem],
      childItems: [epItem]
    };
    var tax = extractTaxonomyFromHtml(html);
    if (tax.peoples.length) result.peoples = tax.peoples;
    if (tax.genreItems.length) result.genreItems = tax.genreItems;
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  try {
    return await loadResourceInner(params);
  } catch (e) {
    return [];
  }
}

async function loadResourceInner(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || params.item.videoUrl || "");
  if (!raw) return [];
  // 已是 Worker 地址：直接出 system 行（详情集内 videoUrl 点播即此路，javhey 同款透传）
  if (raw.indexOf(HLS + "/play.m3u8?") === 0) {
    return [{ name: "播放", url: raw, playerType: "system" }];
  }
  // 集内 videoUrl 随 item 一起传来时直接出流
  if (params.item && params.item.videoUrl && String(params.item.videoUrl).indexOf(HLS + "/play.m3u8?") === 0) {
    return [{ name: "播放", url: String(params.item.videoUrl), playerType: "system" }];
  }
  // 档位入口：@@DAY:<code> -> 现取详情页，提 m3u8（去掉 ?line=）
  // v1.0.2：Worker 行不再被 hlsLive() 存活探测卡住——Worker 已部署且验过活，
  // 探测在手机上误判死只会把人推回必死的直链；提到 m3u8 就直接回 Worker 行。
  var at = raw.indexOf("@@DAY:");
  if (at >= 0) {
    var code = raw.slice(at + 6);
    var durl = HOST + "/videos/" + code + "/";
    var html = "";
    try { html = await getHtml(durl, durl); } catch (e0) { html = ""; }
    var url = extractM3u8(html);
    if (!url) return [];
    return [{ name: "原画", url: HLS + "/play.m3u8?u=" + encodeURIComponent(url) + "&r=" + encodeURIComponent(durl), playerType: "system" }];
  }
  // 直链 m3u8：同样直接走 Worker，不再等存活探测
  if (/\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: HLS + "/play.m3u8?u=" + encodeURIComponent(raw) + "&r=" + encodeURIComponent(HOST + "/"), playerType: "system" }];
  }
  // 兜底：详情地址 -> 取详情首线
  try {
    var det = await loadDetail(raw);
    var eps = det && det.episodeItems;
    if (eps && eps.length) {
      if (eps[0].videoUrl) {
        return [{ name: "播放", url: eps[0].videoUrl, playerType: "system" }];
      }
      return await loadResourceInner({ link: eps[0].id });
    }
  } catch (e) { /* fall through */ }
  return [];
}
