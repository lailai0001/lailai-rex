// 91成人短剧 for REX (lai_91duanju v2.0.0) —— 推倒重写版，非旧版补丁。
// 后端：91crdj.com（现行镜像 91crdjai.com），2026-10-21 重新侦察结论：
//   ① 站点有 JSON API（旧版完全没用过）：
//      - GET /api/search?q=<词>&page=<N>  向量搜索，20 条/页、真分页（实测「老师」
//        total=28，p1=20 + p2=8，零重复）；结果只有数字 id，但详情路由按 id 全局
//        解析（/<任意视频分类>/<id>/ 均 301 到规范 slug 页），可直接拼链接。
//      - GET /api/videos/<id>             详情 JSON（标题/封面/简介/标签 + 第 1 集
//        video_url 新鲜签名），但无分集列表。
//      - GET /videos/<id>/episodes/<n>/playback
//        播放 JSON：逐集现铸 auth_key 的 src；裸 GET（无 cookie/无 Referer）实测
//        可用，入口域名同样可用。播放解析的主路径，不再爬集页 HTML。
//      - GET /api/videos?page=<N> 是混合视频流（20/页、共 1717），无任何分类过滤
//        参数（十余个参数名逐一语义实测均被忽略）、条目不带分类——不能当分类列表用。
//   ② 分类列表没有 API，只能用 SSR 页：实测每分类首页 22~24 卡、/page/2|3 零重复、
//      无需 cookie/会话。本版列表解析换引擎：cheerio DOM（a.card 属性驱动）为主，
//      页面内嵌 ld+json ItemList（22 条 name+url）为独立第二路，两路按 id 合并；
//      DOM 若整页失手，缺卡用 /api/videos/<id> 并行补封面，不再只回一张诊断卡
//      （诊断卡只作三路全灭时的最后遥测）。搜索路径已变（/search/?q= 会 301 到
//      /search/<词>/<页>/），HTML 搜索只作 API 失败时的兜底。
//   ③ 详情/分集：集页内嵌 JSON 配置（eps 全量数组 + playbackEndpoint 模板 +
//      poster/简介），经 id 路由 /<分类>/<id>/1/ 一次拿到（实测 101 集团集完整）；
//      兜底链：详情页 HTML 分集锚点（实测 101/101 全在）→ /api/videos/<id> 元数据。
//   ④ 播放线路与 v1.2.0 相同（这是网络层约束、非代码问题）：yd-hls 清单域封
//      Cloudflare 出口、只能手机侧取；分片/密钥域 tp*.drleao.cn 对 CF 出口可达，
//      故「代理」线 = 手机侧取清单 → 改写分片/密钥到已部署的 dj-hls Worker /s →
//      清单经 /up 暂存、回读校验后播放；另备「明文」线（清单走 http、无 TLS）与
//      「直连」线。改动只是 src 改由 playback JSON 接口现铸（点开即铸、最新签名）。
//      2026-10-21 本地全链字节级复验：经 dj-hls /s 拉的分片与直拉逐字节一致，
//      AES-128-CBC 解密后首字节 0x47、188 栅格 500/500 同步。
//   ⑤ 封面为 AES-128-CBC 加密存储（pic.drleao.cn），走已部署 bagua-img-proxy 解密。
// 漫画/小说是阅读类内容（无 API、无视频），与旧版行为一致：只出列表与详情信息。

WidgetMetadata = {
  id: "lai_91duanju",
  title: "91成人短剧",
  description: "91成人短剧（91crdj.com）：成人短剧/漫剧/真人剧/视频/漫画/小说，多集短剧实时解析播放",
  author: "lai",
  version: "2.0.1",
  requiredVersion: "0.0.1",
  site: "https://91crdj.com",
  detailCacheDuration: 180,
  modules: [
    { title: "成人短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "duanju" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "成人漫剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "manju" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "真人剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "zhenrenju" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "成人视频", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "shipin" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "成人漫画", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "manhua" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "成人小说", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "xiaoshuo" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "热播榜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "paihang" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "标签榜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "biaoqian" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "NTR", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "biaoqian/ntr" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "反差", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "biaoqian/fancha" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "擦边", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "biaoqian/cabian" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { id: "loadResource", title: "播放资源", description: "播放时实时解析播放地址", functionName: "loadResource", type: "stream", cacheDuration: 0, params: [] }
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

// 页面主机：镜像优先（免 301 一跳），入口兜底（镜像轮换时自愈）。
var HOSTS = ["https://91crdjai.com", "https://91crdj.com"];
var BASE = HOSTS[0];
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
// 封面解密 Worker（用户已部署）
var IMG_PROXY = "https://bagua-img-proxy.li768435813.workers.dev";
// 播放代理 Worker（用户已部署 dj-hls：/up 暂存清单、/p 取清单、/s 代拉分片密钥）
var DJ_WORKER = "https://dj-hls.li768435813.workers.dev";
var RELAY = "https://javsb-relay-production.up.railway.app";
var djProbe = -1; // -1 未探，0 不可用，1 可用（会话内缓存）
// 阅读类分类：无视频分集，详情只回信息
var READ_CATS = { manhua: 1, xiaoshuo: 1 };

function t(v) { return String(v == null ? "" : v).trim(); }

function proxyCover(url) {
  var u = t(url);
  if (!u || u.indexOf("http") !== 0) return u;
  if (u.indexOf("pic.drleao.cn") < 0) return u; // 只有加密图床需要解密代理
  return IMG_PROXY + "/img?url=" + encodeURIComponent(u);
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": referer || BASE + "/"
  };
}

function statusOf(res) {
  if (!res) return -1;
  if (typeof res.status === "number") return res.status;
  if (typeof res.statusCode === "number") return res.statusCode;
  return -1;
}

// 最近一次页面抓取的遥测（只用于三路全灭时的诊断卡）
var lastFetch = { host: "", status: -1, len: 0 };

// 把任意站内地址（任一主机名/相对路径）拆成 path；外站绝对地址返回 null
function pathOf(urlOrPath) {
  var s = String(urlOrPath || "");
  for (var i = 0; i < HOSTS.length; i++) {
    if (s.indexOf(HOSTS[i]) === 0) return s.slice(HOSTS[i].length) || "/";
  }
  if (s.indexOf("http") === 0) return null;
  return s.charAt(0) === "/" ? s : "/" + s;
}

function absUrl(pathOrUrl) {
  var s = String(pathOrUrl || "");
  if (s.indexOf("//") === 0) return "https:" + s;
  var p = pathOf(s);
  if (p != null) return BASE + p;
  return s;
}

// 单次 GET（指定完整 URL），失败抛错；返回正文文本
async function httpGetText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
  lastFetch = { host: url, status: statusOf(res), len: body.length };
  if (!body) throw new Error("空回应");
  return body;
}

// 站内页面抓取：先 BASE、失败换另一个主机；谁成功把 BASE 切到谁（镜像轮换自愈）
async function fetchText(urlOrPath, referer) {
  var path = pathOf(urlOrPath);
  if (path == null) return httpGetText(String(urlOrPath), referer);
  var order = [BASE].concat(HOSTS.filter(function (h) { return h !== BASE; }));
  var lastErr = null;
  for (var i = 0; i < order.length; i++) {
    try {
      var body = await httpGetText(order[i] + path, referer ? absUrl(referer) : order[i] + "/");
      BASE = order[i];
      return body;
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error("请求失败");
}

// 站内 JSON 抓取：res.data 可能已是对象，也可能是文本
async function fetchJSON(urlOrPath, referer) {
  var path = pathOf(urlOrPath);
  var urls = path == null ? [String(urlOrPath)] : [BASE + path].concat(HOSTS.filter(function (h) { return h !== BASE; }).map(function (h) { return h + path; }));
  var lastErr = null;
  for (var i = 0; i < urls.length; i++) {
    try {
      var res = await Widget.http.get(urls[i], { headers: pageHeaders(referer) });
      var data = res ? res.data : null;
      if (data == null || data === "") throw new Error("空回应");
      var obj = typeof data === "object" ? data : JSON.parse(String(data));
      if (path != null) BASE = urls[i].slice(0, urls[i].length - path.length);
      return obj;
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error("请求失败");
}

// 从详情/集页链接里拆 {cat, slug, id, ep}：slug 形如 4999-xxx 或纯数字 4999
function parseLink(link) {
  var p = pathOf(String(link || "")) || "";
  var seg = p.split("/").filter(Boolean);
  var out = { cat: seg[0] || "", slug: seg[1] || "", id: 0, ep: 0 };
  var m = String(out.slug).match(/^(\d+)/);
  if (m) out.id = parseInt(m[1], 10) || 0;
  if (seg.length >= 3 && /^\d+$/.test(seg[2])) out.ep = parseInt(seg[2], 10) || 0;
  return out;
}

function makeCard(link, title, cover, remarks) {
  var pic = proxyCover(cover || "");
  return {
    id: link,
    type: "url",
    title: title || "",
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    link: link,
    description: remarks || "",
    mediaType: "movie"
  };
}

/* ================= 列表：三路解析 ================= */

// 路 1（主）：cheerio DOM，a.card 属性驱动（data-track-item-name / img[data-src] / .eps-flag）
function cardsFromDOM(html) {
  var items = [];
  var $ = Widget.html.load(html);
  var seen = {};
  $("a.card").each(function () {
    var $a = $(this);
    var href = t($a.attr("href"));
    if (!href) return;
    var link = absUrl(href);
    var info = parseLink(link);
    if (!info.id || seen[info.id]) return;
    var title = t($a.attr("data-track-item-name")) || t($a.find("img").attr("alt")) || t($a.find("h3").first().text());
    if (!title) title = String(info.id);
    var cover = "";
    var $img = $a.find("img").first();
    var attrs = ["data-src", "data-original", "data-echo", "data-url", "src"];
    for (var i = 0; i < attrs.length; i++) {
      var v = t($img.attr(attrs[i]));
      if (v && v.indexOf("data:") !== 0) { cover = v; break; }
    }
    if (cover) cover = absUrl(cover);
    var remarks = t($a.find(".eps-flag").first().text()) || t($a.find(".badge").first().text());
    seen[info.id] = 1;
    items.push(makeCard(link, title, cover, remarks));
  });
  return items;
}

// 路 2（独立结构路）：页面内嵌 ld+json 的 ItemList（position/name/url 全量 22 条）
function itemsFromLdJson(html) {
  var out = [];
  var re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  var m;
  while ((m = re.exec(String(html || "")))) {
    var data = null;
    try { data = JSON.parse(m[1]); } catch (e) { continue; }
    var nodes = data && data["@graph"] ? data["@graph"] : [data];
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var ile = node && node.mainEntity && node.mainEntity.itemListElement;
      if (!ile && node && node.itemListElement) ile = node.itemListElement;
      if (!ile || ile.length < 3) continue;
      for (var j = 0; j < ile.length; j++) {
        var it = ile[j] || {};
        var url = t(it.url || it["@id"] || "");
        var name = t(it.name || "");
        var info = parseLink(url);
        if (url && name && info.id) out.push({ id: info.id, name: name, url: url });
      }
      if (out.length) return out;
    }
  }
  return out;
}

// 路 3（补封面）：/api/videos/<id> 取封面（只给路 2 补出来的卡用，并行）
async function coverFromApi(id) {
  try {
    var obj = await fetchJSON("/api/videos/" + id, BASE + "/");
    var d = obj && obj.data;
    return d && d.cover ? String(d.cover) : "";
  } catch (e) { return ""; }
}

// 合并：DOM 为主；ItemList 里 DOM 没有的条目补进来（封面走 API 并行补）
async function parseCardsFull(html) {
  var dom = [];
  try { dom = cardsFromDOM(html); } catch (e) { dom = []; }
  var ld = itemsFromLdJson(html);
  if (!ld.length || dom.length >= ld.length) return dom;
  var seen = {};
  dom.forEach(function (c) { seen[parseLink(c.link).id] = 1; });
  var missing = ld.filter(function (x) { return !seen[x.id]; });
  var covers = await Promise.all(missing.map(function (x) { return coverFromApi(x.id); }));
  var out = dom.slice();
  missing.forEach(function (x, i) {
    out.push(makeCard(absUrl(x.url), x.name, covers[i] || "", ""));
  });
  return out;
}

// 三路全灭时的诊断卡：把设备实际拿到的正文特征写进说明供回报定位
function diagCard(html, what) {
  var body = String(html || "");
  var tm = body.match(/<title>([\s\S]*?)<\/title>/i);
  var flags = [];
  flags.push("len=" + body.length);
  flags.push("status=" + lastFetch.status);
  flags.push("host=" + BASE.replace("https://", ""));
  flags.push("what=" + what);
  flags.push("hasCardCls=" + (/class\s*=\s*["'][^"']*card/i.test(body) ? 1 : 0));
  flags.push("anchors=" + ((body.match(/<a\b/gi) || []).length));
  flags.push("justAMoment=" + (body.indexOf("Just a moment") >= 0 ? 1 : 0));
  flags.push("title=" + (tm ? t(tm[1].replace(/<[^>]+>/g, "")).slice(0, 40) : "-"));
  return {
    id: "diag91v2",
    type: "url",
    title: "⚠诊断：本页没解析出内容（请把说明截图回报）",
    description: flags.join(" | "),
    mediaType: "movie"
  };
}

function pageOf(params) {
  var v = params && (params.page != null ? params.page : (params.pageNo != null ? params.pageNo : params.p));
  var n = parseInt(v, 10);
  return isNaN(n) || n < 1 ? 1 : n;
}

async function loadList(params) {
  params = params || {};
  var cat = String(params.cat || params.path || "duanju").replace(/^\/+/, "").replace(/\/+$/, "");
  var page = pageOf(params);
  var path = page > 1 ? "/" + cat + "/page/" + page + "/" : "/" + cat + "/";
  var html = "";
  try {
    html = await fetchText(path, BASE + "/");
    var list = await parseCardsFull(html);
    if (list.length) return list;
    // 0 卡：换另一个主机重取（fetchText 内部已做过主机轮换，这里再针对解析为空补一次直查）
    var other = HOSTS.filter(function (h) { return h !== BASE; })[0];
    if (other) {
      try {
        html = await httpGetText(other + path, other + "/");
        list = await parseCardsFull(html);
        if (list.length) { BASE = other; return list; }
      } catch (e) {}
    }
    return [diagCard(html, cat + " p" + page)];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + BASE + path }];
  }
}

/* ================= 搜索：JSON API 为主 ================= */

function pickKeyword(params) {
  if (params == null) return "";
  if (typeof params === "string" || typeof params === "number") return String(params).trim();
  var keys = ["keyword", "q", "search", "text", "query", "wd", "key"];
  for (var i = 0; i < keys.length; i++) {
    if (params[keys[i]]) return String(params[keys[i]]).trim();
  }
  return "";
}

// API 搜索：POST 不需要；条目只有数字 id，链接用 id 解析路由（/<视频分类>/<id>/ 会 301 到规范页）
async function searchViaApi(wd, page) {
  var obj = await fetchJSON("/api/search?q=" + encodeURIComponent(wd) + "&page=" + page, BASE + "/");
  var data = obj && obj.data;
  var items = (data && data.items) || [];
  var out = [];
  var seen = {};
  items.forEach(function (it) {
    var id = parseInt(it && it.id, 10) || 0;
    if (!id || seen[id]) return;
    seen[id] = 1;
    var remarks = "";
    if (it.duration) remarks = "时长 " + it.duration + "s";
    out.push(makeCard(BASE + "/duanju/" + id + "/", t(it.title) || String(id), it.cover || "", remarks));
  });
  return out;
}

// HTML 搜索兜底（新路径 /search/<词>/、翻页 /search/<词>/<页>/；含漫画/小说结果）
async function searchViaHtml(wd, page) {
  var path = "/search/" + encodeURIComponent(wd) + "/" + (page > 1 ? page + "/" : "");
  var html = await fetchText(path, BASE + "/");
  return parseCardsFull(html);
}

async function search(params) {
  params = params || {};
  var wd = pickKeyword(params);
  var page = pageOf(params);
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  try {
    var list = await searchViaApi(wd, page);
    if (list.length) return list;
  } catch (e) {}
  try {
    var list2 = await searchViaHtml(wd, page);
    return list2.length ? list2 : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

/* ================= 详情 / 分集 ================= */

// 集页/详情页内嵌的 JSON 配置（含 playbackEndpoint 的那个 <script>）
function extractPageConfig(html) {
  var re = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  var m;
  while ((m = re.exec(String(html || "")))) {
    if (m[1].indexOf("playbackEndpoint") < 0) continue;
    try {
      var obj = JSON.parse(m[1].trim());
      if (obj && obj.playbackEndpoint) return obj;
    } catch (e) {}
  }
  return null;
}

function buildDetailResult(link, title, cover, intro, eps) {
  var result = {
    id: link,
    type: "url",
    title: title || "91成人短剧",
    name: title || "91成人短剧",
    description: "",
    mediaType: "movie",
    link: link,
    coverUrl: cover,
    posterPath: cover,
    backdropPath: cover,
    playerType: "app"
  };
  var desc = intro || "";
  if (eps.length > 1) {
    result.description = "共" + eps.length + "集" + (desc ? "\n" + desc : "");
    var childItems = eps.map(function (ep) {
      return {
        id: ep.url,
        title: title + " " + ep.name,
        name: ep.name,
        mediaType: "movie",
        seasonNumber: 1,
        episodeNumber: ep.n,
        link: ep.url
      };
    });
    result.episodeItems = childItems;
    result.childItems = childItems;
    result.episodes = eps.map(function (ep) { return { name: ep.name, link: ep.url }; });
  } else {
    result.description = desc;
  }
  return result;
}

// 路 A：集页内嵌 JSON 配置（一次请求拿全量分集 + 元数据）
async function detailViaConfig(link, info) {
  var ep1Path = "/" + info.cat + "/" + info.id + "/1/";
  var html = await fetchText(ep1Path, BASE + "/");
  var cfg = extractPageConfig(html);
  if (!cfg) throw new Error("集页无配置 JSON");
  var playBase = t(cfg.playBase) || t(cfg.detailURL);
  if (!playBase) throw new Error("配置无 playBase");
  playBase = absUrl(playBase);
  if (playBase.charAt(playBase.length - 1) !== "/") playBase += "/";
  var title = t(cfg.title) || "";
  var cover = proxyCover(t(cfg.poster) || "");
  var intro = t(cfg.description) || "";
  var eps = [];
  var arr = cfg.eps || [];
  for (var i = 0; i < arr.length; i++) {
    var n = parseInt(arr[i] && arr[i].n, 10) || (i + 1);
    eps.push({ n: n, name: "第" + n + "集", url: playBase + n + "/" });
  }
  if (!eps.length) eps.push({ n: 1, name: "正片", url: playBase + "1/" });
  eps.sort(function (a, b) { return a.n - b.n; });
  return buildDetailResult(link, title, cover, intro, eps);
}

// 路 B：详情页 HTML 分集锚点 + API 元数据
async function detailViaHtml(link, info) {
  var results = await Promise.all([
    fetchText(link, BASE + "/").catch(function () { return ""; }),
    fetchJSON("/api/videos/" + info.id, BASE + "/").catch(function () { return null; })
  ]);
  var html = results[0];
  var api = results[1] && results[1].data ? results[1].data : null;
  if (!html && !api) throw new Error("详情页与 API 均失败");
  var title = (api && t(api.title)) || "";
  var cover = (api && api.cover) ? proxyCover(String(api.cover)) : "";
  var intro = (api && t(api.description)) || "";
  var basePath = "";
  if (!title && html) {
    var hm = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (hm) title = t(hm[1].replace(/<[^>]+>/g, ""));
  }
  if (!cover && html) {
    var pm = html.match(/<meta[^>]+og:image[^>]+content=["']([^"']+)["']/i);
    if (pm) cover = proxyCover(absUrl(t(pm[1])));
  }
  if (!intro && html) {
    var dm = html.match(/<meta[^>]+(?:og:description|name=["']description["'])[^>]+content=["']([^"']*)["']/i);
    if (dm) intro = t(dm[1]);
  }
  // 分集锚点：href 恰为 <详情路径><数字>/ 的链接（实测长剧 101/101 全在详情页）
  var eps = [];
  if (html) {
    try { basePath = new URL(absUrl(link)).pathname; } catch (e) { basePath = "/" + info.cat + "/" + info.slug + "/"; }
    if (basePath.charAt(basePath.length - 1) !== "/") basePath += "/";
    var seen = {};
    var re = /href=["']([^"']+)["']/g;
    var m;
    while ((m = re.exec(html))) {
      var p = "";
      try { p = new URL(m[1], BASE).pathname; } catch (e2) { continue; }
      if (p.indexOf(basePath) !== 0) continue;
      var rest = p.slice(basePath.length);
      if (!/^\d+\/$/.test(rest)) continue;
      var n = parseInt(rest, 10) || 0;
      if (!n || seen[n]) continue;
      seen[n] = 1;
      eps.push({ n: n, name: "第" + n + "集", url: BASE + p });
    }
    eps.sort(function (a, b) { return a.n - b.n; });
  }
  return buildDetailResult(link, title, cover, intro, eps);
}

// 阅读类（漫画/小说）详情：只回信息，无可播分集（与旧版行为一致）
async function detailReadOnly(link) {
  var html = await fetchText(link, BASE + "/");
  var title = "";
  var hm = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (hm) title = t(hm[1].replace(/<[^>]+>/g, ""));
  if (!title) {
    var tm = html.match(/<title>([\s\S]*?)<\/title>/);
    if (tm) title = t(tm[1].split(/[-_|]/)[0]);
  }
  var cover = "";
  var pm = html.match(/<meta[^>]+og:image[^>]+content=["']([^"']+)["']/i);
  if (pm) cover = proxyCover(absUrl(t(pm[1])));
  var intro = "";
  var dm = html.match(/<meta[^>]+(?:og:description|name=["']description["'])[^>]+content=["']([^"']*)["']/i);
  if (dm) intro = t(dm[1]);
  return {
    id: link, type: "url", title: title || "91成人短剧", name: title || "91成人短剧",
    description: intro, mediaType: "movie", link: link,
    coverUrl: cover, posterPath: cover, backdropPath: cover, playerType: "app"
  };
}

async function loadDetail(link) {
  var url = absUrl(String(link || ""));
  if (!url) return { id: "err", type: "url", title: "参数错误", description: "链接为空" };
  var info = parseLink(url);
  try {
    if (READ_CATS[info.cat]) return await detailReadOnly(url);
    if (info.id > 0) {
      try { return await detailViaConfig(url, info); } catch (e) {}
      return await detailViaHtml(url, info);
    }
    return await detailReadOnly(url);
  } catch (e) {
    return { id: url, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

/* ================= 播放 ================= */

function isVideoFormat(url) {
  var low = String(url || "").toLowerCase();
  return [".m3u8", ".mp4", ".flv", ".ts"].some(function (k) { return low.indexOf(k) >= 0; });
}

// 取流主路径：playback JSON 接口（逐集现铸签名）
async function srcViaPlaybackApi(id, n) {
  var obj = await fetchJSON("/videos/" + id + "/episodes/" + n + "/playback", BASE + "/");
  var d = obj && obj.data;
  var src = d && d.src ? String(d.src) : "";
  if (!src) throw new Error("playback 接口无 src");
  return src.replace(/\\u0026/g, "&").replace(/\\\//g, "/");
}

// 取流兜底：集页内嵌 JSON 的 current.src
async function srcViaEpisodePage(info, n) {
  var path = "/" + info.cat + "/" + info.id + "/" + n + "/";
  var html = await fetchText(path, BASE + "/");
  var cfg = extractPageConfig(html);
  if (cfg && cfg.current && cfg.current.src) return String(cfg.current.src);
  var m = html.match(/"current"\s*:\s*\{[^{}]*"src"\s*:\s*"([^"]+)"/);
  if (m) return m[1].replace(/\\\//g, "/").replace(/\\u0026/g, "&");
  var um = html.match(/(https?:\/\/[^\s"'<>\\]+?\.(?:m3u8|mp4)[^\s"'<>\\]*)/);
  if (um) return um[1];
  throw new Error("集页无播放地址");
}

// 探活 dj-hls：根路径应回 "dj-hls ok"
async function probeDjWorker() {
  if (djProbe >= 0) return djProbe === 1;
  djProbe = 0;
  try {
    var res = await Widget.http.get(DJ_WORKER + "/", { headers: { "User-Agent": UA } });
    var body = res && res.data != null ? String(res.data) : "";
    if (body.indexOf("dj-hls ok") === 0) djProbe = 1;
  } catch (e) {}
  return djProbe === 1;
}

// 手机侧取清单正文：先 https、失败或非清单再 http 明文（用户报的是 TLS 失败，明文无 TLS 可拦）
async function fetchPlaylistText(playlistUrl, referer) {
  var variants = [playlistUrl];
  if (playlistUrl.indexOf("https://") === 0) variants.push("http://" + playlistUrl.slice(8));
  for (var i = 0; i < variants.length; i++) {
    try {
      var res = await Widget.http.get(variants[i], { headers: { "User-Agent": UA, "Referer": referer || BASE + "/" } });
      var body = res && res.data != null ? String(res.data) : "";
      if (body.indexOf("#EXTM3U") === 0) return body;
    } catch (e) {}
  }
  return "";
}

// 清单内分片/密钥地址改写到 dj-hls /s 中转
function rewritePlaylist(text, playlistUrl) {
  var lines = String(text || "").split("\n");
  var out = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var tr = line.trim();
    if (!tr) { out.push(line); continue; }
    if (tr.charAt(0) === "#") {
      out.push(line.replace(/URI="([^"]+)"/g, function (mm, u) {
        var abs = u;
        try { abs = new URL(u, playlistUrl).href; } catch (e) {}
        return 'URI="' + DJ_WORKER + "/s?u=" + encodeURIComponent(abs) + '"';
      }));
      continue;
    }
    var abs2 = tr;
    try { abs2 = new URL(tr, playlistUrl).href; } catch (e) {}
    out.push(DJ_WORKER + "/s?u=" + encodeURIComponent(abs2));
  }
  return out.join("\n");
}

// 构建代理线：取清单 → 改写 → POST /up 暂存 → 回读校验（Cache API 跨 PoP 会 404，失败重存一次）。
// 失败回 {fail: 短码}，短码标到直连线名供回报：no_post / probe_0 / pl_fail / up_fail / p_404。
async function buildRelayLine(playlistUrl, referer) {
  try {
    if (!Widget.http.post) return { fail: "no_post" };
    if (!(await probeDjWorker())) return { fail: "probe_0" };
    var body = await fetchPlaylistText(playlistUrl, referer);
    if (!body) return { fail: "pl_fail" };
    var rewritten = rewritePlaylist(body, playlistUrl);
    for (var attempt = 0; attempt < 2; attempt++) {
      var relay = "";
      try {
        var up = await Widget.http.post(DJ_WORKER + "/up", rewritten, { headers: { "Content-Type": "text/plain; charset=utf-8", "User-Agent": UA } });
        var upBody = up && up.data != null ? String(up.data) : "";
        var parsed = null;
        try { parsed = JSON.parse(upBody); } catch (e) {}
        relay = parsed && parsed.url ? String(parsed.url) : "";
      } catch (e) {}
      if (relay.indexOf(DJ_WORKER + "/p/") !== 0) return { fail: "up_fail" };
      try {
        var chk = await Widget.http.get(relay, { headers: { "User-Agent": UA } });
        var chkBody = chk && chk.data != null ? String(chk.data) : "";
        if (chkBody.indexOf("#EXTM3U") === 0) return { url: relay };
      } catch (e) {}
      if (attempt === 1) return { fail: "p_404" };
    }
    return { fail: "p_404" };
  } catch (e) {
    return { fail: "exc" };
  }
}

async function loadResource(params) {
  params = params || {};
  var raw = String(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = String(params.item.link || params.item.id || "");
  if (!raw) return [];
  try {
    if (isVideoFormat(raw)) {
      return [{ name: "播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": BASE + "/" } }];
    }
    var info = parseLink(raw);
    if (!info.id) return [];
    var n = info.ep > 0 ? info.ep : 1;
    var src = "";
    try { src = await srcViaPlaybackApi(info.id, n); } catch (e) {}
    if (!src) {
      try { src = await srcViaEpisodePage(info, n); } catch (e) {}
    }
    if (!src && n === 1) {
      try {
        var obj = await fetchJSON("/api/videos/" + info.id, BASE + "/");
        if (obj && obj.data && obj.data.video_url) src = String(obj.data.video_url);
      } catch (e) {}
    }
    if (!src) return [];
    var referer = absUrl(raw);
    var lines = [];
    if (/\.m3u8/i.test(src)) {
      lines.push({ name: "中转", url: RELAY + "/hls?url=" + encodeURIComponent(src), playerType: "app", customHeaders: { "User-Agent": UA } });
    }
    if (src.indexOf("https://") === 0) {
      lines.push({ name: "明文", url: "http://" + src.slice(8), playerType: "app", customHeaders: { "User-Agent": UA, "Referer": referer } });
    }
    lines.push({
      name: "直连",
      url: src,
      playerType: "app",
      customHeaders: { "User-Agent": UA, "Referer": referer }
    });
    return lines;
  } catch (e) {
    return [];
  }
}
