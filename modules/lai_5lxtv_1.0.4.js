// v1.0.4：AVDB 样式详情：peoples/genreItems + 点按路由
// 5LXTV for REX (lai_5lxtv v1.0.0)
// v1.0.3（2026-11-21）：补顶层 search 键（A 键，照 64 个可见模块的众数形状）；B 条目与 search 函数一个字未动。
// v1.0.1（2026-11-14）：根因有三：1) /api/play 裸取 403，须带 Referer 才 200；
//   2) AES-128 密钥 /api/hlskey 裸取 403，须带 Referer，播放器不转发 customHeaders 到密钥请求，
//   密钥取不到就解不了密；3) 分片是 .jpg 伪装加密 TS、Content-Type: image/jpeg，播放器建不起
//   可拖动时间轴（与猫源同站 v2 的病因相同，修法相同：分片改 .ts 回 video/mp2t）。
//   修法：点播走 5lxtv-hls Worker，Worker 服务端带 Referer 取播单与密钥、分片改 .ts。
//   Worker 未部署时回落直链（旧行为：播单能取、密钥 403、不能从头播/拖进度）。
// v1.0.2（2026-11-15）：根因——1.0.1 详情只出懒解析链接（无 videoUrl），
//   loadResource 要先在手机侧现取 /api/play 与 /api/hlskey 才回 Worker 行，
//   手机上那步一失败就回 []，播放器报解析错误、空着（用户原话：全部都是解析错误，
//   都是同一个原因）。5lxtv-hls Worker 已部署且验过活，不是部署问题。
//   修法（sextb 1.0.3 / 24jav 1.1.1 / javhey 1.1.2 同款）：详情页已取到，
//   当场提 slug/t/n 拼播单地址，再拼 Worker 地址直接写进每集的 videoUrl
//   （playerType "system"），点播不再二次解析；懒链接仍留作回落，并在其中
//   带上详情现取的播单地址，loadResource 现取失败时也照样回 Worker 行，
//   不再回 []；loadResource 全程 try/catch，绝不抛错；不再用 hlsLive 探活卡关。
// 移植自 mira-cat 蜘蛛 py_5lxtv.js（只读蓝图），后端 https://5lxtv.com/。
// 繁中 JAV 站。服务端渲染 HTML，无 CF 墙。
// 分类：19 个频道（顶级）+ 排行；标签筛选卡片（前 40 热门标签）。
// 列表：/latest 与各频道 ?page=N（频道 20 条/页，最新 30 条/页）；
//   标签页 /tags/<tag>?page=N。封面 https://5lxtv.com/content-cover/<CODE>。
// 播放：详情页取 slug/t/n -> /api/play/<slug>?t=<t>&n=<n>&hls=1，
//   回单档 VOD m3u8（AES-128，密钥走 /api/hlskey，分片为 .jpg 伪装的加密 TS）。
//   实测 CEAD-776 单档 720p（1280x720 h264），站内无多档位可供选择，
//   故只出单行「720p」，不编造档位。点播现取详情页拿新鲜 t/n。
// 注意：猫源 v2 的本地清单代理（改写分片为 .ts 回 video/mp2t 修从头播/快进）
//   是蜘蛛本地 fastify 路由，REX 里没有，播放地址直接给 /api/play 的 m3u8 直链
//   （playerType "system"），不复刻代理。
// 字幕：猫源字幕芯是猫源专属，REX 版不接（javhey 同款）。

WidgetMetadata = {
  id: "lai_5lxtv",
  title: "5LXTV",
  description: "5LXTV：繁中 JAV 站，19 频道 + 排行 + 40 热门标签，详情单档 720p 直交 Worker 地址",
  author: "lai",
  version: "1.0.4",
  requiredVersion: "0.0.1",
  site: "https://5lxtv.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "有碼A片", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "censored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "無碼破解", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "decensored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "無碼a片", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "uncensored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "中文字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "chinese" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "無碼中文", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "uncensored-chinese" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "國產AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "exclusive" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "偷拍盜攝", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "selfie" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "綠帽NTR", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cuckold" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "素人影片", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "amateur" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "歐美AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "western" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "H動漫畫", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "anime" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "成人短劇", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "ai-drama" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "OnlyFans", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "of" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "網紅UP主", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "upzhu" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "黑料吃瓜", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "scandal" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "FC2外流", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "fc2" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "二次元寫真", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cos" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "美女脫衣", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "ai" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "排行", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "ranking" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "標籤", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag" }, { name: "sub", title: "標籤", type: "enumeration", value: "巨乳", enumOptions: [{"title": "巨乳", "value": "巨乳"}, {"title": "中出", "value": "中出"}, {"title": "口交", "value": "口交"}, {"title": "素人", "value": "素人"}, {"title": "專屬女優作品", "value": "專屬女優作品"}, {"title": "人妻", "value": "人妻"}, {"title": "內射", "value": "內射"}, {"title": "美少女", "value": "美少女"}, {"title": "熟女", "value": "熟女"}, {"title": "騎乘位", "value": "騎乘位"}, {"title": "美乳", "value": "美乳"}, {"title": "多P", "value": "多P"}, {"title": "劇情", "value": "劇情"}, {"title": "痴女", "value": "痴女"}, {"title": "窈窕系", "value": "窈窕系"}, {"title": "潮吹", "value": "潮吹"}, {"title": "第一人稱視野", "value": "第一人稱視野"}, {"title": "白虎", "value": "白虎"}, {"title": "乳交", "value": "乳交"}, {"title": "制服", "value": "制服"}, {"title": "激烈淫亂", "value": "激烈淫亂"}, {"title": "手淫", "value": "手淫"}, {"title": "美臀", "value": "美臀"}, {"title": "逆袭", "value": "逆袭"}, {"title": "NTR戴綠帽", "value": "NTR戴綠帽"}, {"title": "NTR", "value": "NTR"}, {"title": "後入", "value": "後入"}, {"title": "接吻", "value": "接吻"}, {"title": "自慰", "value": "自慰"}, {"title": "顏射", "value": "顏射"}, {"title": "巨臀", "value": "巨臀"}, {"title": "虐恋", "value": "虐恋"}, {"title": "舔陰", "value": "舔陰"}, {"title": "不倫", "value": "不倫"}, {"title": "OL", "value": "OL"}, {"title": "黑絲", "value": "黑絲"}, {"title": "复仇", "value": "复仇"}, {"title": "極致高潮", "value": "極致高潮"}, {"title": "誘惑", "value": "誘惑"}, {"title": "亂倫", "value": "亂倫"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
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

var HOST = "https://5lxtv.com";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
// 播单代理 Worker（5lxtv-hls，已部署且验过活，根回 "5lxtv-hls ok"）：
// REX 播放器不把 customHeaders 转发到分片/密钥请求，直链必死；
// Worker 服务端带头/改写播单。v1.0.2：详情直交 Worker 地址，不再探活卡关。
var HLS = "https://5lxtv-hls.li768435813.workers.dev";


var PATH_BY_ID = {
  "latest": "/latest",
  "censored": "/censored",
  "decensored": "/decensored",
  "uncensored": "/uncensored",
  "chinese": "/chinese",
  "uncensored-chinese": "/uncensored-chinese",
  "exclusive": "/exclusive",
  "selfie": "/selfie",
  "cuckold": "/cuckold",
  "amateur": "/amateur",
  "western": "/western",
  "anime": "/anime",
  "ai-drama": "/ai-drama",
  "of": "/of",
  "upzhu": "/upzhu",
  "scandal": "/scandal",
  "fc2": "/fc2",
  "cos": "/cos",
  "ai": "/ai",
  "ranking": "/ranking"
};

function t(v) {
  return String(v == null ? "" : v).trim();
}

function escHtml(s) {
  return String(s || "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
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
  // 站方偶发 socket hang up，失败重试一次
  for (var att = 0; att < 2; att++) {
    try {
      var res = await Widget.http.get(url, {
        headers: {
          "User-Agent": UA,
          "Referer": referer || HOST + "/",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
        }
      });
      var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
      if (body) return body;
    } catch (e) { /* retry */ }
  }
  return "";
}

function parseList(html) {
  var list = [];
  if (!html) return list;
  // 卡片：<a href="/videos/<slug>"> ... <img src="...content-cover/<CODE>" alt="<title>">
  //   ... 时长 <span>2:32:53</span> ... 观看 ... 标题 ... 日期 2026-11-14
  var re = /<a href="\/videos\/([^"\/]+)"[^>]*>([\s\S]*?)<\/a>/g;
  var m;
  var seen = {};
  while ((m = re.exec(html)) !== null) {
    var slug = m[1];
    if (seen[slug]) continue;
    seen[slug] = 1;
    var block = m[2];
    var img = block.match(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/);
    var title = escHtml(img ? img[2] : "");
    if (!title) continue;
    var pic = img ? img[1] : (HOST + "/content-cover/" + slug.toUpperCase());
    var dur = block.match(/>(\d+:\d\d(?::\d\d)?)<\/span>/);
    var date = block.match(/>(\d{4}-\d{2}-\d{2})</);
    var link = HOST + "/videos/" + slug;
    list.push({
      id: link,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: dur ? dur[1] : (date ? date[1] : ""),
      mediaType: "movie"
    });
  }
  return list;
}

function parsePagecount(html) {
  if (!html) return 1;
  var pages = [];
  var re = /[?&]page=(\d+)/g;
  var m;
  while ((m = re.exec(html)) !== null) pages.push(parseInt(m[1], 10) || 1);
  if (!pages.length) return 1;
  return Math.max.apply(null, pages);
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "latest");
  var tag = t(params.sub || params.tag || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var url;
  if (zone === "tag" && tag) {
    url = HOST + "/tags/" + encodeURIComponent(tag) + "?page=" + page;
  } else {
    var path = PATH_BY_ID[zone] || "/latest";
    url = HOST + path + "?page=" + page;
  }
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
    var html = await getHtml(HOST + "/search?q=" + encodeURIComponent(wd) + "&page=" + page);
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

function extractPlayParams(html) {
  if (!html) return null;
  var slug = (html.match(/var slug\s*=\s*"([^"]+)"/) || [])[1] || "";
  var tt = (html.match(/var t\s*=\s*(\d+)/) || [])[1] || "";
  var nn = (html.match(/var n\s*=\s*"([^"]+)"/) || [])[1] || "";
  if (!slug || !tt || !nn) return null;
  return { slug: slug, t: tt, n: nn };
}

// ---- AVDB 样式详情：演员/分类（点按出对应全部内容）----
// 详情页 HTML 里扫演员/分类链接（站内同源），建成 peoples / genreItems；
// 点按后 loadDetail 走分类页分支（loadList 取该分类的全部影片，取不到则 search 回落）。
var TAX_HOST_OVERRIDE = "";
var TAX_BASE = HOST;
var TAX_ACTRESS_RE = /\/(actress(es)?|actors?|pornstars?|stars?|models?|performers?|idols?)\//i;
var TAX_GENRE_RE = /\/(genres?|tags?|categor(?:y|ies)|category|labels?|makers?|channels?)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)|category|actress(es)?|actors?|pornstars?|stars?|models?|makers?|channels?|labels?|all|全部|分类|演员|标签|女优|题材|片商)$/i;
function taxAbs(href) {
  var s = String(href || "").split("#")[0];
  if (/^https?:\/\//i.test(s)) return s;
  if (s.indexOf("//") === 0) return "https:" + s;
  var base = TAX_HOST_OVERRIDE || TAX_BASE;
  base = String(base || "").replace(/\/+$/, "");
  if (s.charAt(0) === "/") return base + s;
  return base + "/" + s;
}
function taxSlugOf(abs, isActress) {
  var path = String(abs || "").split("?")[0].split("#")[0];
  var vm = path.match(/\/(vodtype|vodshow)\/(\d+)/i);
  if (vm) return vm[2];
  var parts = path.replace(/^https?:\/\/[^/]+\//, "").split("/");
  var segs = [];
  for (var i = 0; i < parts.length; i++) { if (parts[i]) segs.push(parts[i]); }
  while (segs.length && (/^\d+\.html$/i.test(segs[segs.length - 1]) || /^\d+$/.test(segs[segs.length - 1]) || segs[segs.length - 1] === "page")) segs.pop();
  for (var j = 0; j < segs.length; j++) {
    if (/_(category|makersr)$/i.test(segs[j]) && segs[j + 2]) return segs[j + 2];
  }
  if (!segs.length) return "";
  var last = segs[segs.length - 1];
  if (/^(genres?|tags?|categor(?:y|ies)|category|labels?|makers?|channels?|actress(es)?|actors?|pornstars?|stars?|models?|performers?|idols?)$/i.test(last)) return "";
  return last;
}
function extractTaxonomyFromHtml(html, hostOverride) {
  if (hostOverride) TAX_HOST_OVERRIDE = hostOverride;
  var peoples = [];
  var genreItems = [];
  var seenP = {};
  var seenG = {};
  var baseHost = String(TAX_HOST_OVERRIDE || TAX_BASE || "").replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(String(html || ""))) !== null) {
    var href = m[1] || "";
    var name = String(m[2] || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (!name || name.length > 40 || TAX_NAV_NAME_RE.test(name)) continue;
    var abs = taxAbs(href).split(" ").join("%20");
    if (!/^https?:\/\//i.test(abs)) continue;
    var host = abs.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (baseHost && host !== baseHost) continue;
    var isA = TAX_ACTRESS_RE.test(abs);
    var isG = !isA && TAX_GENRE_RE.test(abs);
    if (!isA && !isG) continue;
    var seg = taxSlugOf(abs, isA);
    if (!seg) continue;
    if (isA) {
      if (seenP[abs]) continue;
      seenP[abs] = 1;
      peoples.push({ id: abs, title: name, name: name, link: abs, role: "演员" });
    } else {
      if (seenG[abs]) continue;
      seenG[abs] = 1;
      genreItems.push({ id: abs, title: name });
    }
    if (peoples.length >= 20 && genreItems.length >= 20) break;
  }
  return { peoples: peoples, genreItems: genreItems };
}
function taxNameFromUrl(url) {
  var s = String(url || "");
  if (s.indexOf("actor:") === 0) return s.slice(6);
  if (s.indexOf("tag:") === 0) return s.slice(4);
  if (s.indexOf("g:") === 0) return s.slice(2);
  var seg = taxSlugOf(s, false);
  var name = seg;
  try { name = decodeURIComponent(seg); } catch (e) { name = seg; }
  return String(name || "").replace(/\+/g, " ").trim();
}
async function taxPrimaryWorks(url, name, isActress) {
  var m = String(url || "").match(/\/tags\/([^/?#]+)/i);
  if (m) { var tg = m[1]; try { tg = decodeURIComponent(tg); } catch (e) { tg = m[1]; } try { return await loadList({ zone: "tag", sub: tg, page: 1 }); } catch (e2) { return []; } }
  return [];
}
async function taxRouteDetail(url, isActress) {
  var name = taxNameFromUrl(url);
  var works = [];
  try { works = await taxPrimaryWorks(url, name, isActress) || []; } catch (e) { works = []; }
  if (!Array.isArray(works)) works = [];
  var real = works.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
  if (!real.length) {
    try { var sw = await search({ keyword: name }); if (Array.isArray(sw)) works = sw; } catch (e2) {}
    real = (works || []).filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
  }
  return { id: url, type: "detail", mediaType: "movie", title: name || (isActress ? "演员" : "分类"), link: url, description: (isActress ? "演员" : "分类") + " · 共 " + real.length + " 部作品", videoUrl: "", childItems: [], relatedItems: real.length ? real : works };
}


async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    if (TAX_ACTRESS_RE.test(raw) || TAX_GENRE_RE.test(raw) || raw.indexOf("actor:") === 0 || raw.indexOf("tag:") === 0) { return await taxRouteDetail(raw, TAX_ACTRESS_RE.test(raw) || raw.indexOf("actor:") === 0); }
    var durl = raw.indexOf("http") === 0 ? raw : HOST + "/videos/" + raw.replace(/^\/+/, "");
    var html = await getHtml(durl, durl);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var title = escHtml((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || "") ||
      escHtml((html.match(/<title>([^<]*) - 5lxtv<\/title>/) || [])[1] || "");
    var slug = (durl.match(/\/videos\/([^\/?#]+)/) || [])[1] || "";
    var pic = slug ? HOST + "/content-cover/" + slug.toUpperCase() : "";
    var dur = (html.match(/時長：([^<]+)/) || [])[1] || "";
    // 单档 720p（站内无多档位，不编造）。v1.0.2：详情页已取到，直接提 slug/t/n
    // 拼播单地址，再拼 Worker 地址写进 episodeItem 的 videoUrl（playerType
    // "system"），点播不再二次解析。懒链接仍留作回落，并在其中带上播单地址，
    // loadResource 现取失败时也照样回 Worker 行。播单提不到时不带 videoUrl 键
    // （空串会被 App 当无可播内容），只留懒链接回落。
    var p = extractPlayParams(html);
    var playUrl = p ? (HOST + "/api/play/" + encodeURIComponent(p.slug) + "?t=" + p.t + "&n=" + encodeURIComponent(p.n) + "&hls=1") : "";
    var workerUrl = playUrl ? (HLS + "/play.m3u8?u=" + encodeURIComponent(playUrl) + "&r=" + encodeURIComponent(durl)) : "";
    var id = workerUrl ? (durl + "@@PLAY:" + encodeURIComponent(playUrl)) : (durl + "@@PLAY");
    var epItem = {
      id: id,
      type: "url",
      title: "720p",
      mediaType: "movie",
      posterPath: pic,
      link: id,
      episode: 1,
      episodeNumber: 1,
      seasonIndex: 1,
      seasonNumber: 1
    };
    if (workerUrl) { epItem.videoUrl = workerUrl; epItem.playerType = "system"; }
    var tax = extractTaxonomyFromHtml(html);
    var result = {
      id: durl,
      type: "detail",
      title: title || slug,
      name: title || slug,
      description: dur ? ("時長：" + dur.trim()) : "",
      mediaType: "movie",
      link: durl,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app",
      videoUrl: workerUrl,
      episodes: [{ name: "720p", link: id }],
      seasons: [{ seasonNumber: 1, title: "720p", name: "720p", episodes: [{ title: "720p", episodeNumber: 1 }] }],
      episodeItems: [epItem],
      childItems: [epItem]
    };
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
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 已是 Worker 地址：直接出 system 行（javhey 同款透传）
  if (raw.indexOf(HLS) === 0) {
    return [{ name: "720p", url: raw, playerType: "system" }];
  }
  // 档位入口：<详情页>@@PLAY[:<播单地址>] -> 首行 Worker，播单直链行回落。
  // 播单地址先现取详情页拿新鲜 t/n；现取失败时用懒链接里带的详情现取地址，
  // 照样回 Worker 行，绝不回 []（v1.0.1 现取失败回 [] 就是解析错误的根因）。
  var at = raw.indexOf("@@PLAY");
  if (at >= 0) {
    var durl = raw.slice(0, at);
    var embedded = "";
    var rest = raw.slice(at + 6);
    if (rest && rest.charAt(0) === ":") {
      try { embedded = decodeURIComponent(rest.slice(1)); } catch (e2) { embedded = rest.slice(1); }
    }
    var playUrl = "";
    try {
      var html = await getHtml(durl, durl);
      var p = extractPlayParams(html);
      if (p) playUrl = HOST + "/api/play/" + encodeURIComponent(p.slug) + "?t=" + p.t + "&n=" + encodeURIComponent(p.n) + "&hls=1";
    } catch (e3) { playUrl = ""; }
    if (!playUrl) playUrl = embedded;
    if (!playUrl) return [];
    var rows = [{ name: "720p", url: HLS + "/play.m3u8?u=" + encodeURIComponent(playUrl) + "&r=" + encodeURIComponent(durl), playerType: "system" }];
    rows.push({ name: "720p·直连", url: playUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": durl } });
    return rows;
  }
  // 直链 m3u8：走 Worker（直链密钥 403、播放器不转发头，必死）
  if (/\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: HLS + "/play.m3u8?u=" + encodeURIComponent(raw) + "&r=" + encodeURIComponent(HOST + "/"), playerType: "system" }];
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
