// v1.1.0：站方 /api/toc/v1 已 404（2026-11-26 实测），改解析站方 HTML。
//   列表：首页 HTML 的 RSC payload 内嵌 182 部剧（id/title/coverUrl/episodeCount），直接解析。
//   详情：/drama/<id>/ HTML 内嵌 m3u8（7cat-media.bedfpk.cn/7cat/<key>/hls/epNN/epNN.m3u8）与
//     episodeId；mediaKey 从 m3u8/封面 URL 提，全集按 epUrl(key, n) 合成。实测第 3 集（站方标
//     “需解锁”）的 m3u8 也是 200 真播单，可直接播。
//   播放：分集 m3u8 走 7mao-media Worker 中转（媒体 host 疑似设备侧被拦），loadResource 点播时现取。
//   搜索：站方搜索页是空壳，改为首页 182 部剧按标题关键字过滤。
//   分类：只留 4 个静态分类（热门/最新/全部/愿望榜）；旧 line|/topic| 分类依赖已死的 /categories、
//     /topics API，无法验证，全部删除，不编造。
// 七猫短剧 for REX (lai_7mao)
// 详情：AVDB 样式（分类小卡片 genreItems + 点按路由，D 组只做分类）。
// 播放：分集链接即最终 m3u8（包 Worker 中转），stream 模块只作直通并附 UA 与 Referer；站方无清晰度档，不编清晰度。

WidgetMetadata = {
  id: "lai_7mao",
  title: "七猫短剧",
  description: "七猫短剧（7maoduanju.com）：热门榜/最新上线/全部短剧/魔改愿望榜，详情全集直链播放",
  author: "lai",
  version: "1.1.1",
  requiredVersion: "0.0.1",
  site: "https://7maoduanju.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "🔥 热门榜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "rank" }, { name: "sort", title: "排序", type: "enumeration", value: "hot", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🆕 最新上线", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "new" }, { name: "sort", title: "排序", type: "enumeration", value: "latest", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "📺 全部短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "all" }, { name: "sort", title: "排序", type: "enumeration", value: "hot", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "✨ 魔改愿望榜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "wish" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { id: "loadResource", title: "播放资源", description: "播放时直通分集 m3u8 地址并附播放头", functionName: "loadResource", type: "stream", cacheDuration: 0, params: [] }
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

var HOST = "https://7maoduanju.com";
// 取数三腿：主站直连 → www 同源 → Worker 兜底（7mao-fetch /f/，b64url 编码目标 URL）。
var API_HOSTS = [HOST, "https://www.7maoduanju.com"];
var FETCH_WORKER = "https://7mao-fetch.li768435813.workers.dev";
// 纯 JS b64url（REX 沙箱无 Buffer/btoa/TextEncoder，与 818/porncgw 修复版同一实现）
var B64T = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64url(s) {
  var bytes = [];
  var str = String(s || "");
  var i, c, c2, cp;
  for (i = 0; i < str.length; i++) {
    c = str.charCodeAt(i);
    if (c < 128) bytes.push(c);
    else if (c < 2048) { bytes.push(192 | (c >> 6), 128 | (c & 63)); }
    else if (c < 55296 || c >= 57344) { bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63)); }
    else {
      i++;
      c2 = str.charCodeAt(i);
      cp = 65536 + (((c & 1023) << 10) | (c2 & 1023));
      bytes.push(240 | (cp >> 18), 128 | ((cp >> 12) & 63), 128 | ((cp >> 6) & 63), 128 | (cp & 63));
    }
  }
  var out = "";
  for (i = 0; i < bytes.length; i += 3) {
    var b0 = bytes[i], b1 = i + 1 < bytes.length ? bytes[i + 1] : 0, b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    out += B64T.charAt(b0 >> 2) + B64T.charAt(((b0 & 3) << 4) | (b1 >> 4)) + (i + 1 < bytes.length ? B64T.charAt(((b1 & 15) << 2) | (b2 >> 6)) : "=") + (i + 2 < bytes.length ? B64T.charAt(b2 & 63) : "=");
  }
  return out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function viaWorker(url) {
  return FETCH_WORKER.replace(/\/+$/, "") + "/f/" + b64url(url);
}
var MEDIA = "https://7cat-media.bedfpk.cn";
var MEDIA_WORKER = "https://7mao-media.li768435813.workers.dev/playlist.m3u8?u=";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
var PAGE = 30;

function t(v) {
  return String(v == null ? "" : v).trim();
}

function cleanText(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

function htmlHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": HOST + "/"
  };
}

// 取 HTML：主站直连 → www 同源 → Worker 兜底；任一腿回 200 且长度够即停。
async function fetchHtmlOnce(url) {
  try {
    var res = await Widget.http.get(url, { headers: htmlHeaders() });
    var d = res && res.data != null ? res.data : null;
    if (typeof d === "string" && d.length > 1000) return d;
  } catch (e) { /* 下一腿 */ }
  return "";
}
async function fetchHtml(path) {
  for (var i = 0; i < API_HOSTS.length; i++) {
    var d = await fetchHtmlOnce(API_HOSTS[i] + path);
    if (d) return d;
  }
  var w = await fetchHtmlOnce(viaWorker(HOST + path));
  if (w) return w;
  return "";
}

// 解析 RSC payload 里的剧条目（与猫源 py_7mao 同款）：按 id/dramaId 定位，
// 取 900 字符窗口，先反转义（\"→"）再提 title/coverUrl/episodeCount。
function parseDramas(html) {
  var out = [];
  var seen = {};
  var h = String(html || "");
  var re = /\\"(?:id|dramaId)\\":\\"([0-9a-f-]{36})\\"/g;
  var m;
  while ((m = re.exec(h)) !== null) {
    var id = m[1];
    if (seen[id]) continue;
    var win = h.slice(m.index, m.index + 900).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    var tm = win.match(/"title":"([^"]*)"/);
    var cm = win.match(/"coverUrl":"([^"]*)"/);
    if (!tm || !cm) continue;
    var em = win.match(/"episodeCount":(\d+)/);
    seen[id] = 1;
    out.push({ dramaId: id, title: tm[1], coverUrl: cm[1], episodeCount: em ? parseInt(em[1], 10) : 0 });
  }
  return out;
}

function vod(j) {
  if (!j) return null;
  var id = j.dramaId || j.id || "";
  if (!id) return null;
  var n = parseInt(j.episodeCount || 0, 10) || 0;
  var tags = (Array.isArray(j.tags) && j.tags.length) ? j.tags.join(" · ") : "短剧";
  return {
    id: id,
    type: "url",
    title: j.title || "",
    posterPath: fixCover(j),
    coverUrl: fixCover(j),
    backdropPath: fixCover(j),
    link: id,
    description: n > 0 ? ("共" + n + "集") : tags,
    mediaType: "movie"
  };
}

function vodList(arr) {
  var out = [];
  if (!Array.isArray(arr)) return out;
  for (var i = 0; i < arr.length; i++) {
    var v = vod(arr[i]);
    if (v && v.title) out.push(v);
  }
  return out;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function pageOf(arr, page) {
  var list = Array.isArray(arr) ? arr : [];
  var start = (page - 1) * PAGE;
  var slice = list.slice(start, start + PAGE);
  return vodList(slice);
}

async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  // 分类页映射（站方真有独立分类页，各 18 条/页、?page=N 翻页，
  //   标题互不相同——此前 loadList 忽略 params.cat、一律回首页列表，
  //   致 4 个分类内容完全一样）：
  //   rank 热门榜 -> /category/热播短剧/ ；new 最新上线 -> /category/最新上线/ ；
  //   wish 魔改愿望榜 -> /category/魔改短剧/ ；all 全部短剧 -> 首页（182 部）。
  var cat = String(params.cat || params.category || params.type_id || "").trim();
  var catPath = "";
  if (cat === "rank") catPath = "/category/" + encodeURIComponent("热播短剧") + "/";
  else if (cat === "new") catPath = "/category/" + encodeURIComponent("最新上线") + "/";
  else if (cat === "wish") catPath = "/category/" + encodeURIComponent("魔改短剧") + "/";
  try {
    var html = await fetchHtml(catPath ? (catPath + "?page=" + page) : "/");
    var arr = parseDramas(html);
    // 分类页本身已按 ?page=N 分页（每页 18 条），直接返回本页；
    // 首页才按 PAGE=30 切片。
    var list = catPath ? vodList(arr) : pageOf(arr, page);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
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
  var page = parseInt(params.page, 10) || 1;
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  if (page > 1) return [];
  try {
    var html = await fetchHtml("/");
    var arr = parseDramas(html);
    var hit = [];
    for (var i = 0; i < arr.length; i++) {
      if ((arr[i].title || "").indexOf(wd) >= 0) hit.push(arr[i]);
    }
    var list = vodList(hit);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function mediaKeyFromHtml(html) {
  var h = String(html || "");
  var m = h.match(/\/7cat\/([0-9a-f]{20,})\/hls\//);
  if (m) return m[1];
  m = h.match(/\/7cat\/([0-9a-f]{20,})\/cover\.jpg/);
  if (m) return m[1];
  return "";
}

function epUrl(key, n) {
  if (!key || n <= 0) return "";
  var nn = n < 10 ? "0" + n : "" + n;
  // 直链 bedfpk.cn 设备侧不通，改走已部署的 7mao-media Worker 中转。
  return MEDIA_WORKER + encodeURIComponent(MEDIA + "/7cat/" + key + "/hls/ep" + nn + "/ep" + nn + ".m3u8");
}

// 封面：cover-compression 的 /cover/ 路径回 403（S3 AccessDenied），同图
// /rank/ 路径回 200。优先用 API 的 rankCoverUrl，否则把 /cover/ 改写成 /rank/。
// 封面走 weserv.nl 代理（设备到 weserv 通），顺带把大图缩到 400px 转 JPEG。
function shrinkCover(u) {
  if (!u) return "";
  return "https://images.weserv.nl/?url=" + encodeURIComponent(u) + "&w=400&q=75&output=jpg";
}
function fixCover(obj) {
  var r = (obj && obj.rankCoverUrl) || "";
  if (r) return shrinkCover(r);
  var c = (obj && obj.coverUrl) || "";
  if (!c) return "";
  return shrinkCover(c.replace(/\/cover-compression\/variants\/v1\/cover\//, "/cover-compression/variants/v1/rank/"));
}

function bareId(link) {
  var s = t(link).replace(/^qmdj:/, "");
  if (!s) return "";
  if (s.indexOf("http") === 0 || s.indexOf("/") >= 0) {
    var parts = s.split("/");
    for (var i = parts.length - 1; i >= 0; i--) {
      if (parts[i]) return parts[i];
    }
    return "";
  }
  return s;
}

function unwrapLink(v) {
  try {
    if (v && typeof v === "object") return t(v.link || v.id || v.url || "");
  } catch (e) {}
  return t(v);
}

async function loadDetail(link) {
  try {
    link = unwrapLink(link);
    // AVDB 样式：点按分类小卡片（tag:<名>）→ 搜索该分类名。
    var tagRaw = String(link || "");
    if (tagRaw.indexOf("tag:") === 0) {
      var tagName = tagRaw.slice(4);
      var tagWorks = [];
      try { tagWorks = await search({ keyword: tagName, page: 1 }); } catch (e) { tagWorks = []; }
      if (!Array.isArray(tagWorks)) tagWorks = [];
      var tagReal = tagWorks.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
      return {
        id: tagRaw,
        type: "detail",
        mediaType: "movie",
        title: tagName,
        link: tagRaw,
        description: "分类 · 共 " + tagReal.length + " 部作品",
        videoUrl: "",
        childItems: [],
        relatedItems: tagReal.length ? tagReal : tagWorks
      };
    }
    var vid = bareId(link);
    if (!vid) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var html = await fetchHtml("/drama/" + encodeURIComponent(vid) + "/");
    if (!html) return { id: vid, type: "url", title: "详情获取失败", description: "页面无返回" };
    // 标题：优先 RSC 里的干净标题（<title> 带“短剧剧情介绍与剧集观看”后缀）
    var name = "";
    var dm0 = parseDramas(html);
    var hit0 = null;
    for (var hi = 0; hi < dm0.length; hi++) {
      if (dm0[hi].dramaId === vid) { hit0 = dm0[hi]; break; }
    }
    if (hit0 && hit0.title) name = hit0.title;
    if (!name) {
      var tm = html.match(/<title>([^<]*)<\/title>/);
      if (tm) name = t(tm[1]).replace(/《/g, "").replace(/》/g, "").replace(/短剧剧情介绍与剧集观看.*$/i, "").replace(/ - 七猫短剧.*$/i, "").replace(/\s*\|.*$/, "").trim();
    }
    // 简介：RSC 里的 description（\n 转义已处理）
    var desc = "";
    var dsm = html.match(/\\"description\\":\\"((?:[^\\"\\]|\\.){0,2000})\\"/);
    if (dsm) {
      desc = dsm[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    }
    // 标签：RSC 里的 tags（去重，标题本身不算标签）
    var tags = [];
    var tgm = html.match(/\\"tags\\":\[([^\]]*)\]/);
    if (tgm) {
      var raw = tgm[1].split(",");
      for (var ti = 0; ti < raw.length; ti++) {
        var g = raw[ti].replace(/\\"/g, "").replace(/"/g, "").trim();
        if (g && g !== name && tags.indexOf(g) < 0) tags.push(g);
      }
    }
    // 封面：优先 m3u8 旁的 mediaId 封面，其次 RSC coverUrl
    var cover = "";
    var cm = html.match(/https:\/\/7cat-pic\.bedfpk\.cn\/7cat\/[0-9a-f]+\/cover\.jpg/);
    if (cm) cover = cm[0];
    if (!cover && hit0) cover = hit0.coverUrl || "";
    cover = fixCover({ coverUrl: cover });
    // 集数：详情页 episodeId 去重个数；无则 episodeCount；再无则 m3u8 个数
    var epIds = {};
    var epRe = /episodeId=([0-9a-f-]{36})/g;
    var em;
    while ((em = epRe.exec(html)) !== null) epIds[em[1]] = 1;
    var count = 0;
    for (var k in epIds) count++;
    if (!count) {
      var ecm = html.match(/\\"episodeCount\\":(\d+)/);
      if (ecm) count = parseInt(ecm[1], 10) || 0;
    }
    var key = mediaKeyFromHtml(html);
    // 详情页直接给出的 m3u8（免费集）优先用原地址（包 Worker）
    var directM3u8 = {};
    var mmRe = /https:\/\/7cat-media\.bedfpk\.cn\/7cat\/[0-9a-f]+\/hls\/ep(\d+)\/ep\d+\.m3u8/g;
    var mm;
    while ((mm = mmRe.exec(html)) !== null) {
      var nn2 = parseInt(mm[1], 10);
      if (nn2 > 0 && !directM3u8[nn2]) directM3u8[nn2] = mm[0];
    }
    if (!count) {
      for (var kk in directM3u8) {
        var kv = parseInt(kk, 10);
        if (kv > count) count = kv;
      }
    }
    var epLinks = [];
    var childItems = [];
    for (var n = 1; n <= count; n++) {
      var rawUrl = directM3u8[n] || "";
      var url = rawUrl ? (MEDIA_WORKER + encodeURIComponent(rawUrl)) : epUrl(key, n);
      if (!url) continue;
      var epName = "第" + n + "集";
      var payload = JSON.stringify({ dramaId: vid, epNum: n, snap: url });
      epLinks.push({ name: epName, link: payload });
      childItems.push({
        id: payload,
        title: (name || "") + " " + epName,
        name: epName,
        mediaType: "movie",
        seasonNumber: 1,
        episodeNumber: n,
        videoUrl: url,
        link: payload,
        playerType: "system",
        customHeaders: { "User-Agent": UA, "Referer": HOST + "/" }
      });
    }
    if (!epLinks.length) return { id: vid, type: "url", title: name || "七猫短剧", description: "未找到可播剧集" };
    var fullDesc = (tags.length ? ("分类：" + tags.join(" · ") + "\n") : "") + (desc || "");
    if (epLinks.length > 1) fullDesc = "共" + epLinks.length + "集" + (fullDesc ? "\n" + fullDesc : "");
    var result = {
      id: vid,
      type: "detail",
      title: name || "七猫短剧",
      name: name || "七猫短剧",
      description: fullDesc,
      mediaType: "movie",
      link: vid,
      coverUrl: cover,
      posterPath: cover,
      backdropPath: cover,
    };
    result.episodes = epLinks;
    result.seasons = [{ seasonNumber: 1, title: "正片", name: "正片", episodes: childItems.map(function (c) { return { title: c.name, episodeNumber: c.episodeNumber, id: c.id, link: c.link, videoUrl: c.videoUrl }; }) }];
    result.episodeItems = childItems;
    result.childItems = childItems;
    var genreItems = [];
    for (var gi = 0; gi < tags.length && genreItems.length < 20; gi++) {
      var gname = String(tags[gi] || "").trim();
      if (!gname || gname.length > 40) continue;
      genreItems.push({ id: "tag:" + gname, title: gname });
    }
    if (genreItems.length) result.genreItems = genreItems;
    return result;
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

function isVideoFormat(url) {
  var low = String(url || "").toLowerCase();
  return low.indexOf(".m3u8") >= 0 || low.indexOf(".mp4") >= 0 || low.indexOf(".flv") >= 0 || low.indexOf(".ts") >= 0;
}

async function loadResource(params) {
  // 兜底：App 可能用多种形态调 loadResource，之前只认
  //   params.link/url/id 与 params.item.link/id，致以下两种直接回 []、
  //   设备侧报“解析不出来线路地址”：
  //   ① 整条 videoUrl 以裸字符串传入（params 本身就是字符串）；
  //   ② params.item 只有 videoUrl、没有 link/id。
  // 现全部接住：裸字符串、params.videoUrl、params.item.videoUrl。
  var raw = "";
  if (typeof params === "string" || typeof params === "number") raw = t(params);
  else {
    params = params || {};
    raw = t(params.link || params.url || params.videoUrl || params.id || "");
    if (!raw && params.item) raw = t(params.item.link || params.item.url || params.item.videoUrl || params.item.id || "");
  }
  if (!raw) return [];
  // 载荷：点播时现取新鲜地址。先取详情页拿该集 m3u8，有则包 Worker；
  // 无则用 mediaKey 现拼 Worker 地址；都取不到才退回快照地址。
  var payload = null;
  try { payload = JSON.parse(raw); } catch (e) { payload = null; }
  if (payload && payload.dramaId) {
    var snap = t(payload.snap) || "";
    var fresh = "";
    try {
      var html = await fetchHtml("/drama/" + encodeURIComponent(payload.dramaId) + "/");
      if (html) {
        var key = mediaKeyFromHtml(html);
        var want = parseInt(payload.epNum, 10) || 1;
        var mmRe2 = /https:\/\/7cat-media\.bedfpk\.cn\/7cat\/[0-9a-f]+\/hls\/ep(\d+)\/ep\d+\.m3u8/g;
        var mm2;
        while ((mm2 = mmRe2.exec(html)) !== null) {
          if (parseInt(mm2[1], 10) === want) { fresh = MEDIA_WORKER + encodeURIComponent(mm2[0]); break; }
        }
        if (!fresh) fresh = epUrl(key, want);
      }
    } catch (e) { fresh = ""; }
    var finalUrl = fresh || snap;
    if (finalUrl && isVideoFormat(finalUrl)) {
      return [{ name: "播放", url: finalUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
    if (snap) return [{ name: "播放", url: snap, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    return [];
  }
  // 非载荷（老版直链）：直接放行
  if (!isVideoFormat(raw)) return [];
  return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
}
