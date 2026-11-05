// 七猫短剧 for REX (lai_7mao v1.0.0)
// 移植自 mira-cat 蜘蛛 py_7mao.js（只读蓝图），后端 https://7maoduanju.com，JSON API /api/toc/v1。
// v1.0.1（2026-11-05）：与猫源同修——代码与站方 API 在 VM 侧全通，手机侧内容仍空，属手机网络
// 到站方 API 不通（非代码回归：猫源文件自 11-02 后未改动，API 同期未变）。改动：取数改三腿
// （直连 → www 同源 → 7mao Worker /f/ 兜底），直连失败即换腿；Worker 待用户部署，未部署前行为与现在一致。
// 分类：4 静态（热门榜/最新上线/全部短剧/魔改愿望榜）+ 11 线路 + 4 专题 = 19 个；
//   线路与专题 id 为 2026-11-03 实测现值（/categories 仅 active、按猫源 sortOrder 口径排序，
//   注意猫源 `sortOrder || 99` 会把 sortOrder 0 的会员专区排到最后，本模块照此顺序写死；
//   若站方增删线路/专题，旧常量会回空列表，不编造新分类）。
// 详情：episodes 优先 seoContentUrl，否则由 mediaKey 组装 7cat-media 直链；
//   mediaKey 取 seoContentUrl 里 /7cat/ 与 /hls/ 之间的斜杠段（原猫源文件 {8,40} 正则取不到 4 位短 key，
//   本模块与猫源一样不用该正则）；集数与集名全部来自详情 episodes，不编造。
// 播放：分集链接即最终 m3u8 直链，stream 模块只作直通并附 UA 与 Referer；站方无清晰度档，不编清晰度。

WidgetMetadata = {
  id: "lai_7mao",
  title: "七猫短剧",
  description: "七猫短剧（7maoduanju.com）：热门榜/最新上线/全部短剧/魔改愿望榜 + 11 线路 + 4 专题，详情全集直链播放",
  author: "lai",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  site: "https://7maoduanju.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "🔥 热门榜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "rank" }, { name: "sort", title: "排序", type: "enumeration", value: "hot", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🆕 最新上线", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "new" }, { name: "sort", title: "排序", type: "enumeration", value: "latest", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "📺 全部短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "all" }, { name: "sort", title: "排序", type: "enumeration", value: "hot", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "✨ 魔改愿望榜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "wish" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "热门短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "line|10000000-0000-4000-8000-0000000000c0" }, { name: "sort", title: "排序", type: "enumeration", value: "hot", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "原创短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "line|10000000-0000-4000-8000-000000000002" }, { name: "sort", title: "排序", type: "enumeration", value: "hot", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "AI 短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "line|10000000-0000-4000-8000-0000000000b3" }, { name: "sort", title: "排序", type: "enumeration", value: "hot", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "金币专区", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "line|8684055a-ac69-46a8-bfbd-698fe3071fcb" }, { name: "sort", title: "排序", type: "enumeration", value: "hot", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "AI 漫剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "line|10000000-0000-4000-8000-000000000003" }, { name: "sort", title: "排序", type: "enumeration", value: "hot", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "AI 魔改", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "line|10000000-0000-4000-8000-0000000000b1" }, { name: "sort", title: "排序", type: "enumeration", value: "hot", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "擦边短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "line|10000000-0000-4000-8000-000000000005" }, { name: "sort", title: "排序", type: "enumeration", value: "hot", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "AI 换脸", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "line|10000000-0000-4000-8000-0000000000b2" }, { name: "sort", title: "排序", type: "enumeration", value: "hot", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "真人短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "line|10000000-0000-4000-8000-0000000000b0" }, { name: "sort", title: "排序", type: "enumeration", value: "hot", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "影视综艺", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "line|10000000-0000-4000-8000-0000000000b4" }, { name: "sort", title: "排序", type: "enumeration", value: "hot", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "会员专区", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "line|4b0f7137-1c41-4915-a342-e697f3800270" }, { name: "sort", title: "排序", type: "enumeration", value: "hot", enumOptions: [{ title: "最热", value: "hot" }, { title: "最新", value: "latest" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "精品高分AI短剧专辑", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "topic|10000000-0000-4000-8000-000000000040" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "家庭伦理AI短剧专辑", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "topic|10000000-0000-4000-8000-000000000042" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "仙侠奇幻AI短剧专辑", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "topic|10000000-0000-4000-8000-000000000043" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "游戏动漫短剧专辑", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "topic|10000000-0000-4000-8000-000000000041" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { id: "loadResource", title: "播放资源", description: "播放时直通分集 m3u8 地址并附播放头", functionName: "loadResource", type: "stream", cacheDuration: 0, params: [] }
  ]
};

var HOST = "https://7maoduanju.com";
var API = HOST + "/api/toc/v1";
// 取数三腿：主站直连 → www 同源（实测同后端、同数据）→ Worker 兜底。
// Worker 待用户部署：https://7mao.li768435813.workers.dev（根回 7mao fetch ok），未部署前该腿失败即跳过。
var API_HOSTS = [HOST, "https://www.7maoduanju.com"];
var FETCH_WORKER = "https://7mao.li768435813.workers.dev";
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

function apiHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "application/json,text/plain,*/*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": HOST + "/"
  };
}

// 拒收 CF/Worker 的 JSON 错误信封（如未部署 Worker 时的 404 {"type":"https://developers.cloudflare.com/...",
// "title":"Error 1042: Cloudflare Error"}——它能 JSON.parse 成功，须按失败处理，否则详情会把错误标题当剧名。
function apiJsonOk(d, res) {
  var status = res && typeof res.status === "number" ? res.status : 0;
  if (status && (status < 200 || status >= 300)) return false;
  if (d && typeof d === "object" && typeof d.type === "string" && d.type.indexOf("http") === 0) return false;
  return true;
}

async function apiOnce(url) {
  try {
    var res = await Widget.http.get(url, { headers: apiHeaders() });
    var d = res && res.data != null ? res.data : null;
    if (d == null) return null;
    var out = null;
    if (typeof d === "string") {
      try { out = JSON.parse(d); } catch (e) { return null; }
    } else {
      out = d;
    }
    if (!apiJsonOk(out, res)) return null;
    return out;
  } catch (e) { return null; }
}

// 三腿取数：主站直连 → www 同源 → Worker 兜底；任一腿返回合法 JSON 即停；
// 全失败返回 null（上层按空列表处理，与现在一致）。
async function apiGet(path) {
  for (var i = 0; i < API_HOSTS.length; i++) {
    var d = await apiOnce(API_HOSTS[i] + "/api/toc/v1" + path);
    if (d !== null && d !== undefined) return d;
  }
  var w = await apiOnce(viaWorker(API + path));
  if (w !== null && w !== undefined) return w;
  return null;
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
    posterPath: j.coverUrl || "",
    coverUrl: j.coverUrl || "",
    backdropPath: j.coverUrl || "",
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
  var tid = t(params.cat || params.path || "all");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var sort = t(params.sort) === "latest" ? "latest" : "hot";
  try {
    if (tid === "wish") {
      var arr = await apiGet("/ranks/wish");
      var wlist = pageOf(arr, page);
      return wlist.length ? wlist : emptyItem();
    }
    if (tid.indexOf("topic|") === 0) {
      var tp = await apiGet("/topics");
      var tarr = Array.isArray(tp) ? tp : [];
      var found = null;
      for (var ti = 0; ti < tarr.length; ti++) {
        if (tarr[ti] && tarr[ti].id === tid.slice(6)) { found = tarr[ti]; break; }
      }
      var dramas = found && Array.isArray(found.dramas) ? found.dramas : [];
      var tlist = pageOf(dramas, page);
      return tlist.length ? tlist : emptyItem();
    }
    var sv = sort;
    var path = "/browse?offset=" + ((page - 1) * PAGE) + "&limit=" + PAGE;
    if (tid === "new") path += "&sort=latest";
    else if (tid.indexOf("line|") === 0) path += "&line=" + encodeURIComponent(tid.slice(5)) + "&sort=" + sv;
    else path += "&sort=" + sv;
    var obj = await apiGet(path);
    if (!obj) return emptyItem();
    var items = Array.isArray(obj.items) ? obj.items : [];
    var blist = vodList(items);
    return blist.length ? blist : emptyItem();
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
    var arr = await apiGet("/search?q=" + encodeURIComponent(wd) + "&limit=50");
    var list = vodList(arr);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function mediaKey(eps, cover) {
  for (var i = 0; i < (eps || []).length; i++) {
    var u = eps[i].seoContentUrl || "";
    var m = u.match(/\/7cat\/([^/]+)\/hls\//);
    if (m) return m[1];
  }
  if (cover) {
    var cm = cover.match(/\/7cat\/([^/]+)\/cover/);
    if (cm) return cm[1];
  }
  return "";
}

function epUrl(key, n) {
  if (!key || n <= 0) return "";
  var nn = n < 10 ? "0" + n : "" + n;
  return MEDIA + "/7cat/" + key + "/hls/ep" + nn + "/ep" + nn + ".m3u8";
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

async function loadDetail(link) {
  try {
    var vid = bareId(link);
    if (!vid) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var obj = await apiGet("/dramas/" + encodeURIComponent(vid));
    if (!obj) return { id: vid, type: "url", title: "详情获取失败", description: "API 无返回" };
    var cover = obj.coverUrl || "";
    var eps = Array.isArray(obj.episodes) ? obj.episodes : [];
    var key = mediaKey(eps, cover);
    var epLinks = [];
    var childItems = [];
    for (var i = 0; i < eps.length; i++) {
      var ep = eps[i] || {};
      var n = parseInt(ep.indexNo || (i + 1), 10) || (i + 1);
      var url = ep.seoContentUrl || "";
      if (!url) url = epUrl(key, n);
      if (!url) continue;
      var name = ep.title || ("第" + n + "集");
      epLinks.push({ name: name, link: url });
      childItems.push({
        id: url,
        title: (obj.title || "") + " " + name,
        name: name,
        mediaType: "movie",
        seasonNumber: 1,
        episodeNumber: n,
        link: url
      });
    }
    var tags = (Array.isArray(obj.tags) ? obj.tags : []).filter(function (x) { return !!x; });
    var n2 = parseInt(obj.episodeCount || 0, 10) || 0;
    var desc = (tags.length ? ("分类：" + tags.join(" · ") + "\n") : "") + (obj.description || "");
    if (epLinks.length > 1) desc = "共" + epLinks.length + "集" + (desc ? "\n" + desc : "");
    var result = {
      id: vid,
      type: "url",
      title: obj.title || "七猫短剧",
      name: obj.title || "七猫短剧",
      description: desc,
      mediaType: "movie",
      link: vid,
      coverUrl: cover,
      posterPath: cover,
      backdropPath: cover,
      playerType: "app"
    };
    if (epLinks.length) {
      result.episodes = epLinks;
      result.episodeItems = childItems;
      result.childItems = childItems;
    }
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
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  if (!isVideoFormat(raw)) return [];
  return [{ name: "播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
}
