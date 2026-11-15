// 禁果短剧 for REX (lai_jinguo v1.0.0)
// 站点 https://jinguoduanju.app；API 与猫源 py_jinguo 同款（2026-11-16 VM 实测）：
//   POST /api/v1/auth/device {deviceId:"h5:"+32位hex, channelCode:"", attributionToken:""} 取 token；
//   GET /api/v1/dramas?sort=latest|heat&navigationId&length&q 取列表（整表回、客户端切页 24 条）；
//   GET /api/v1/landing 取首页推荐 {dramas:[...]}；
//   GET /api/v1/dramas/{id} 取详情 {drama, episodes:[{id, number, title}]}；
//   GET /api/v1/episodes/{episodeId}/play 取 {videoUrl}（签名 m3u8）。
// 手机直连站方 API 会被按出口指纹拦（猫源 2026-11-16 坐实，与 7mao/mrds 同类），
// 故每请求直连腿与 jinguo-fetch Worker 腿并行竞速、先成功者胜；Worker 未部署
// 前该腿失败即跳过，行为不变（部署后竞速生效）。
// 集用懒解析（不带 videoUrl 键），点播时 loadResource 现取 /play 新鲜地址
// （javdo 1.0.2 同款：签名地址不跨详情停留，防票据过期转圈）。
WidgetMetadata = {
  id: "lai_jinguo",
  title: "禁果短剧",
  description: "禁果短剧（jinguoduanju.app）：最新/热度/首页推荐/全部/原创/单体/动漫/影视/多集/单集/9 个题材，点播现取播放地址",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://jinguoduanju.app",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "热度", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "heat" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "首页推荐", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "landing" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "全部", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "nav_all" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "原创精品", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "nav_original" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "单体作品", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "nav_single" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "动漫改编", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "nav_anime" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "影视改编", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "nav_movie" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "多集", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "len_multi" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "单集", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "len_single" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "魔改", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag_mogai" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "都市", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag_dushi" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "职场", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag_zhichang" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "奇幻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag_qihuan" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "古装", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag_guzhuang" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "动漫", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag_dongman" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "甜宠", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag_tianchong" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "虐恋", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag_nuelian" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "穿越", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag_chuanyue" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
  ]
};

var API_BASE = "https://jinguoduanju.app";
var JG_FETCH = "https://jinguo-fetch.li768435813.workers.dev";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15";
var PAGE_SIZE = 24;

var _token = "";
var _deviceId = "";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function randHex(n) {
  var hex = "0123456789abcdef";
  var s = "";
  var i;
  for (i = 0; i < n; i++) s += hex.charAt(Math.floor(Math.random() * 16));
  return s;
}

function statusOf(res) {
  if (!res) return 0;
  var s = res.statusCode != null ? res.statusCode : res.status;
  return s != null ? s : 0;
}

function parseJsonBody(d) {
  if (d == null) return null;
  if (typeof d === "object") return d;
  try { return JSON.parse(String(d)); } catch (e) { return null; }
}

// 两腿其一先成功即取（mrds 并行竞速，猫源 py_jinguo 同款）：每腿失败只记 null，不抛错。
function raceOk(jobs) {
  return new Promise(function (resolve) {
    var pending = jobs.length;
    var done = false;
    var i;
    if (!pending) { resolve(null); return; }
    function settle(v) {
      if (done) return;
      if (v !== null && v !== undefined) { done = true; resolve(v); return; }
      pending -= 1;
      if (pending <= 0) resolve(null);
    }
    for (i = 0; i < jobs.length; i++) {
      Promise.resolve(jobs[i]).then(settle).catch(function () { settle(null); });
    }
  });
}

function apiHeaders(token) {
  var h = {
    "Accept": "application/json",
    "User-Agent": UA,
    "Referer": API_BASE + "/",
    "Origin": API_BASE
  };
  if (token) h["Authorization"] = "Bearer " + token;
  return h;
}

function qsOf(query) {
  var parts = [];
  var k;
  for (k in query) {
    if (!query.hasOwnProperty(k)) continue;
    var v = query[k];
    if (v == null || v === "") continue;
    parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(String(v)));
  }
  return parts.length ? "?" + parts.join("&") : "";
}

// leg 0 = 直连站方，leg 1 = jinguo-fetch Worker 直通代理
async function postVia(leg, path, bodyObj) {
  var base = leg === 1 ? JG_FETCH : API_BASE;
  try {
    var res = await Widget.http.post(base + "/api/v1" + path, JSON.stringify(bodyObj), {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": UA,
        "Referer": API_BASE + "/",
        "Origin": API_BASE
      }
    });
    var st = statusOf(res);
    if (st < 200 || st >= 300) return null;
    return parseJsonBody(res ? res.data : null);
  } catch (e) { return null; }
}

async function getVia(leg, path, query, token) {
  var base = leg === 1 ? JG_FETCH : API_BASE;
  var url = base + "/api/v1" + path + qsOf(query || {});
  try {
    var res = await Widget.http.get(url, { headers: apiHeaders(token) });
    var st = statusOf(res);
    if (st === 401) return "__HTTP401__";
    if (st < 200 || st >= 300) return null;
    return parseJsonBody(res ? res.data : null);
  } catch (e) { return null; }
}

async function ensureToken() {
  if (_token) return _token;
  if (!_deviceId) _deviceId = randHex(32);
  var body = { deviceId: "h5:" + _deviceId, channelCode: "", attributionToken: "" };
  var d = await raceOk([postVia(0, "/auth/device", body), postVia(1, "/auth/device", body)]);
  _token = t(d && d.token);
  return _token;
}

async function apiGet(path, query) {
  var tk = await ensureToken();
  if (!tk) return null;
  var d = await raceOk([getVia(0, path, query, tk), getVia(1, path, query, tk)]);
  if (d === "__HTTP401__" || (d && d.status === 401)) {
    _token = "";
    tk = await ensureToken();
    if (!tk) return null;
    d = await raceOk([getVia(0, path, query, tk), getVia(1, path, query, tk)]);
    if (d === "__HTTP401__") return null;
  }
  return d;
}

function coverOf(it) {
  var c = t((it && (it.coverUrl || it.cover)) || "");
  if (c && c.indexOf("http") !== 0) {
    c = API_BASE + (c.charAt(0) === "/" ? c : "/" + c);
  }
  return c;
}

function toCard(it) {
  if (!it || !it.id) return null;
  var ep = it.episodeCount || "";
  var remark = ep ? "全" + ep + "集" : "";
  var tags = Array.isArray(it.tags) ? it.tags.join(" · ") : "";
  if (tags) remark = remark ? remark + " · " + tags : tags;
  var pic = coverOf(it);
  return {
    id: "jgdj:" + it.id,
    type: "url",
    title: t(it.title) || String(it.id),
    name: t(it.title) || String(it.id),
    mediaType: "movie",
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    remarks: remark,
    description: remark
  };
}

function slicePage(list, page) {
  var arr = Array.isArray(list) ? list : [];
  var p = Math.max(1, parseInt(page, 10) || 1);
  var start = (p - 1) * PAGE_SIZE;
  var out = [];
  var i;
  for (i = start; i < Math.min(start + PAGE_SIZE, arr.length); i++) {
    var c = toCard(arr[i]);
    if (c) out.push(c);
  }
  return out;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function queryFor(path) {
  var q = { sort: "latest" };
  var tag = "";
  if (path === "heat") { q.sort = "heat"; }
  else if (path === "nav_all") { q.navigationId = 2; }
  else if (path === "nav_original") { q.navigationId = 7; }
  else if (path === "nav_single") { q.navigationId = 3; }
  else if (path === "nav_anime") { q.navigationId = 6; }
  else if (path === "nav_movie") { q.navigationId = 5; }
  else if (path === "len_multi") { q.length = "multi"; }
  else if (path === "len_single") { q.length = "single"; }
  else if (path === "tag_mogai") { tag = "魔改"; }
  else if (path === "tag_dushi") { tag = "都市"; }
  else if (path === "tag_zhichang") { tag = "职场"; }
  else if (path === "tag_qihuan") { tag = "奇幻"; }
  else if (path === "tag_guzhuang") { tag = "古装"; }
  else if (path === "tag_dongman") { tag = "动漫"; }
  else if (path === "tag_tianchong") { tag = "甜宠"; }
  else if (path === "tag_nuelian") { tag = "虐恋"; }
  else if (path === "tag_chuanyue") { tag = "穿越"; }
  return { q: q, tag: tag };
}

async function loadList(params) {
  params = params || {};
  var path = t(params.path || "latest");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var list = [];
    if (path === "landing") {
      var ld = await apiGet("/landing", {});
      list = (ld && ld.dramas) || [];
    } else {
      var qq = queryFor(path);
      var d = await apiGet("/dramas", qq.q);
      list = Array.isArray(d) ? d : [];
      if (qq.tag) {
        var kept = [];
        var i;
        for (i = 0; i < list.length; i++) {
          var it = list[i];
          if (it && Array.isArray(it.tags)) {
            var j;
            for (j = 0; j < it.tags.length; j++) {
              if (String(it.tags[j]) === qq.tag) { kept.push(it); break; }
            }
          }
        }
        list = kept;
      }
    }
    var out = slicePage(list, page);
    return out.length ? out : emptyItem();
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
    var d = await apiGet("/dramas", { sort: "latest", q: wd });
    var list = Array.isArray(d) ? d : [];
    var out = slicePage(list, page);
    return out.length ? out : emptyItem();
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

function dramaIdOf(link) {
  var s = t(unwrapLink(link));
  if (s.indexOf("jgdj:") === 0) s = s.slice(5);
  return s;
}

async function loadDetail(link) {
  var did = dramaIdOf(link);
  try {
    if (!did) return { id: "err", type: "url", title: "加载失败", description: "缺少剧集编号" };
    var data = await apiGet("/dramas/" + encodeURIComponent(did), {});
    var drama = (data && data.drama) || {};
    var eps = (data && data.episodes) || [];
    var pic = coverOf(drama);
    var tags = Array.isArray(drama.tags) ? drama.tags.join(" · ") : "";
    var title = t(drama.title) || did;
    var sEps = [];
    var items = [];
    var epsArr = [];
    var i;
    for (i = 0; i < eps.length; i++) {
      var ep = eps[i] || {};
      var n = parseInt(ep.number, 10) || (i + 1);
      var epId = t(ep.id);
      var epTitle = t(ep.title) || ("第" + n + "集");
      var payload = JSON.stringify({ dramaId: did, episodeId: epId, epNum: String(n), title: epTitle });
      sEps.push({ title: epTitle, episodeNumber: n });
      items.push({ id: payload, type: "url", title: title + " " + epTitle, name: epTitle, mediaType: "movie", seasonNumber: 1, episodeNumber: n, link: payload, posterPath: pic, coverUrl: pic, playerType: "system" });
      epsArr.push({ name: epTitle, id: payload, link: payload });
    }
    if (!epsArr.length) {
      var payload0 = JSON.stringify({ dramaId: did, episodeId: "", epNum: "1", title: "第1集" });
      sEps.push({ title: "第1集", episodeNumber: 1 });
      items.push({ id: payload0, type: "url", title: title + " 第1集", name: "第1集", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, link: payload0, posterPath: pic, coverUrl: pic, playerType: "system" });
      epsArr.push({ name: "第1集", id: payload0, link: payload0 });
    }
    return {
      id: "jgdj:" + did,
      type: "detail",
      title: title,
      link: "jgdj:" + did,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: tags,
      episodes: epsArr,
      seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: sEps }],
      episodeItems: items
    };
  } catch (e) {
    return { id: "jgdj:" + did, type: "url", title: "加载失败", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  try {
    params = params || {};
    var raw = t(unwrapLink(params.link || params.url || params.id || params));
    if (!raw) return [];
    var payload = null;
    try { payload = JSON.parse(raw); } catch (e) { payload = null; }
    var dramaId = "";
    var episodeId = "";
    var epNum = "1";
    var epTitle = "正片";
    if (payload && payload.dramaId) {
      dramaId = t(payload.dramaId);
      episodeId = t(payload.episodeId);
      epNum = t(payload.epNum) || "1";
      epTitle = t(payload.title) || "正片";
    } else {
      dramaId = raw.replace(/^jgdj:/, "");
    }
    if (!dramaId) return [];
    if (!episodeId) {
      var data = await apiGet("/dramas/" + encodeURIComponent(dramaId), {});
      var eps = (data && data.episodes) || [];
      var i;
      for (i = 0; i < eps.length; i++) {
        if (String(eps[i].number) === String(epNum) || String(eps[i].id) === String(epNum)) {
          episodeId = t(eps[i].id);
          break;
        }
      }
      if (!episodeId && eps.length) episodeId = t(eps[0].id);
    }
    if (!episodeId) return [];
    var playData = await apiGet("/episodes/" + encodeURIComponent(episodeId) + "/play", {});
    var url = t(playData && playData.videoUrl);
    if (!url) return [];
    var headers = {
      "User-Agent": UA,
      "Referer": API_BASE + "/",
      "Origin": API_BASE
    };
    return [{ name: epTitle, url: url, playerType: "system", headers: headers, customHeaders: headers }];
  } catch (e) {
    return [];
  }
}
