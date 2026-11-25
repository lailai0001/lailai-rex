// v1.0.2：AVDB 样式详情核实（真 API 数据）：① tags 与 category 是两类数据——tags 走 tag= 接口（tag=美腿 12 条全含该标签，含本片），category 走 category= 接口，原版一律拼 category| 会使标签点按走错接口；② getmovie 只回 {m3u8}、不带任何分类字段，原版详情恒无 genreItems——改由卡片 link 携带 tags/category（&g=/&c= 参数），旧卡片无参数时按标题搜回列表项补取；③ API 无演员字段，peoples 诚实留空；补全覆盖派发（loadList peopleId/genreId、loadDetail 裸名先 tag 后 category 再搜索）
// Taiav for REX (lai_taiav v1.0.0)
// 移植自 mira-cat 蜘蛛 taiav.js, 后端: https://taiav.com (JSON API 站)。
// 列表: /api/getcontents?page=&size=12&category|tag=<分类名>&type=movie,tv (与蜘蛛一致);
//   搜索: 同接口 size=48&q=<关键词>。
// 播放: m3u8 地址带 timestamp/key 签名, 必须点开时实时取 —— 卡片 link 里只带
//   getmovie 接口地址与标题/封面参数, loadDetail 里当场请求
//   /api/getmovie?type=1280&id=<vod_id> 拿新鲜签名地址再播。
// 封面 poster2.url 为站内相对路径, 拼 HOST 直出 (无防盗链)。

WidgetMetadata = {
  id: "lai_taiav",
  title: "Taiav",
  description: "Taiav（taiav.com）：网红主播/国产AV/有码无码/中文字幕与 Onlyfans、探花、自拍等标签，详情实时取签名 m3u8",
  author: "lai",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  site: "https://taiav.com",
  detailCacheDuration: 180,
  modules: [
    { title: "网红主播", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category|网红主播" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "国产AV", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category|国产AV" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category|有码" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category|无码" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中文字幕", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category|中文字幕" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Onlyfans", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|Onlyfans" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Korean Bj", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|Korean Bj" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "探花", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|探花" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "自拍", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|自拍" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码破解", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|无码破解" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "主播", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|主播" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "偷拍", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|偷拍" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "制服", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|制服" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "tag|人妻" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
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

var BASE = "https://taiav.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1.1 Mobile/15E148 Safari/604.1";
var PAGE_SIZE = 12;

function apiHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "application/json,*/*",
    "Referer": BASE + "/"
  };
}

async function getJson(url) {
  var res = await Widget.http.get(url, { headers: apiHeaders() });
  var data = res && res.data != null ? res.data : null;
  if (typeof data === "string") {
    var t = data.trim();
    if (!t) return null;
    try { return JSON.parse(t); } catch (_) { return null; }
  }
  return data;
}

function cardOf(e) {
  var vid = String(e._id);
  var name = String(e.originalname || "").trim();
  var posterUrl = e.poster2 && e.poster2.url ? String(e.poster2.url) : "";
  var pic = posterUrl ? (/^https?:\/\//i.test(posterUrl) ? posterUrl : BASE + posterUrl) : "";
  var duration = String(e.duration || "").trim();
  // link 带上 getmovie 地址 + 标题/封面 + tags/category: getmovie 只回 {m3u8}，
  // 详情的 genreItems 只能从列表项带来（&g= 标签 | 隔开，&c= 分类）；loadDetail 据此建 genreItems。
  var gstr = Array.isArray(e.tags) ? e.tags.join("|") : "";
  var cat = String(e.category || "");
  var link = BASE + "/api/getmovie?type=1280&id=" + encodeURIComponent(vid) +
    "&t=" + encodeURIComponent(name) +
    "&p=" + encodeURIComponent(pic) +
    (gstr ? "&g=" + encodeURIComponent(gstr) : "") +
    (cat ? "&c=" + encodeURIComponent(cat) : "");
  return {
    id: link,
    type: "url",
    title: name,
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    link: link,
    description: duration ? "HD·" + duration : "HD",
    releaseDate: String(e.createAt || ""),
    mediaType: "movie"
  };
}

function parseCards(arr) {
  var out = [];
  if (!Array.isArray(arr)) return out;
  for (var i = 0; i < arr.length; i++) {
    var e = arr[i];
    if (!e || !e._id) continue;
    if (!String(e.originalname || "").trim()) continue;
    out.push(cardOf(e));
  }
  return out;
}

async function loadList(params) {
  params = params || {};
  // 全覆盖派发：App 点 peoples/genreItems 可能调 loadList(peopleId/genreId)。
  // 本站无演员字段，peopleId 按名字走搜索；genreId 带 tag|/category| 前缀按前缀走，裸名先 tag 后 category。
  var _pid = String(params.peopleId || params.personId || "").trim();
  var _gid = String(params.genreId || params.genre || "").trim();
  if (_pid || _gid) {
    var _tok = _pid || _gid;
    if (_tok.indexOf("tag|") === 0 || _tok.indexOf("category|") === 0) return await loadList({ path: _tok, page: params.page || 1 });
    if (_tok.indexOf("actor:") === 0) return await search({ keyword: _tok.slice(6), page: params.page || 1 });
    var _w = await loadList({ path: "tag|" + _tok, page: 1 });
    if (taxRealWorks(_w || []).length) return _w;
    var _w2 = await loadList({ path: "category|" + _tok, page: 1 });
    if (taxRealWorks(_w2 || []).length) return _w2;
    return await search({ keyword: _tok, page: params.page || 1 });
  }
  var page = parseInt(params.page, 10) || 1;
  var path = String(params.path || "category|国产AV");
  var idx = path.indexOf("|");
  var tip = idx >= 0 ? path.slice(0, idx) : "category";
  var cls = idx >= 0 ? path.slice(idx + 1) : path;
  var url = BASE + "/api/getcontents?page=" + page + "&size=" + PAGE_SIZE +
    "&" + tip + "=" + encodeURIComponent(cls) + "&type=movie,tv";
  try {
    var data = await getJson(url);
    var list = parseCards(data);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
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
  var url = BASE + "/api/getcontents?page=" + page + "&size=48&q=" + encodeURIComponent(wd) + "&type=movie,tv";
  try {
    var data = await getJson(url);
    var list = parseCards(data);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

function queryParam(url, name) {
  var m = String(url || "").match(new RegExp("[?&]" + name + "=([^&]*)"));
  if (!m) return "";
  try { return decodeURIComponent(m[1]); } catch (_) { return m[1]; }
}

// ---- AVDB 样式详情：演员/分类（点按出对应全部内容，API 字段）----
function taxRealWorks(works) {
  var out = [];
  for (var i = 0; i < works.length; i++) {
    var w = works[i];
    if (w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty" && w.id !== "tip") out.push(w);
  }
  return out;
}

function taxNamesFromVal(v) {
  var out = [];
  if (typeof v === "string") {
    var parts = v.split(/[,、;；|]/);
    for (var i = 0; i < parts.length; i++) { var s = String(parts[i] || "").trim(); if (s && s.length <= 40) out.push(s); }
  } else if (Array.isArray(v)) {
    for (var j = 0; j < v.length; j++) {
      var it = v[j];
      if (typeof it === "string") { var s2 = String(it || "").trim(); if (s2 && s2.length <= 40) out.push(s2); }
      else if (it && typeof it === "object") { var nm = String(it.name || it.title || it.label || "").trim(); if (nm && nm.length <= 40) out.push(nm); }
    }
  }
  return out;
}

function extractTaxonomyFromApi(d) {
  var peoples = [];
  var genreItems = [];
  var seenP = {};
  var seenG = {};
  var actorKeys = ["actress", "actresses", "actor", "actors", "stars", "star", "performer", "performers", "model", "models"];
  var genreKeys = ["genre", "genres", "tag", "tags", "category", "categories", "label", "labels"];
  var ki, k, names, ni, nm;
  for (ki = 0; ki < actorKeys.length; ki++) {
    k = actorKeys[ki];
    if (!d || d[k] == null) continue;
    names = taxNamesFromVal(d[k]);
    for (ni = 0; ni < names.length; ni++) {
      nm = names[ni];
      if (seenP[nm]) continue;
      seenP[nm] = 1;
      if (peoples.length < 20) peoples.push({ id: "actor:" + nm, title: nm, name: nm, link: "actor:" + nm, role: "演员" });
    }
    if (peoples.length >= 20) break;
  }
  for (ki = 0; ki < genreKeys.length; ki++) {
    k = genreKeys[ki];
    if (!d || d[k] == null) continue;
    // tags 数组走 tag= 接口、category 字段走 category= 接口，两类前缀绝不能混
    // （原版一律 category|，标签点按会调 category=<标签名> 回 0 条）。
    var pref = (k === "category" || k === "categories") ? "category|" : "tag|";
    names = taxNamesFromVal(d[k]);
    for (ni = 0; ni < names.length; ni++) {
      nm = names[ni];
      if (seenG[pref + nm]) continue;
      seenG[pref + nm] = 1;
      if (genreItems.length < 20) genreItems.push({ id: pref + nm, title: nm, link: pref + nm });
    }
    if (genreItems.length >= 20) break;
  }
  return { peoples: peoples, genreItems: genreItems };
}

async function taxTokenRoute(token) {
  var isActor = token.indexOf("actor:") === 0;
  var name = "";
  if (isActor) name = token.slice(6);
  else if (token.indexOf("category|") === 0) name = token.slice(9);
  else if (token.indexOf("genre:") === 0) name = token.slice(6);
  else if (token.indexOf("tag:") === 0) name = token.slice(4);
  var works = [];
  try {
    // token 自带正确前缀：tag|xxx -> getcontents?tag=xxx；category|xxx -> getcontents?category=xxx
    if (!isActor) works = await loadList({ path: token, page: 1 });
  } catch (_) { works = []; }
  if (!Array.isArray(works)) works = [];
  var realWorks = taxRealWorks(works);
  if (!realWorks.length && name) {
    try {
      var sw = await search({ keyword: name });
      if (Array.isArray(sw)) { works = sw; realWorks = taxRealWorks(sw); }
    } catch (_) {}
  }
  return {
    id: token,
    type: "detail",
    mediaType: "movie",
    title: name || (isActor ? "演员" : "分类"),
    link: token,
    description: (isActor ? "演员" : "分类") + " · 共 " + realWorks.length + " 部作品",
    videoUrl: "",
    childItems: [],
    relatedItems: realWorks.length ? realWorks : works
  };
}

async function loadDetail(link) {
  try {
    var rawLink = link;
    if (rawLink && typeof rawLink === "object") rawLink = rawLink.link || rawLink.id || rawLink.url || rawLink.videoUrl || "";
    var s = String(rawLink || "");
    if (s.indexOf("category|") === 0 || s.indexOf("tag|") === 0 || s.indexOf("actor:") === 0) {
      return await taxTokenRoute(s);
    }
    // 裸名：先当 tag 试，再当 category 试，皆空才走搜索详情
    if (s.indexOf("getmovie") < 0 && s.indexOf("://") < 0 && s.indexOf("/") < 0 && s) {
      var _tw = await taxTokenRoute("tag|" + s);
      if (_tw && taxRealWorks(_tw.relatedItems || []).length) return _tw;
      var _cw = await taxTokenRoute("category|" + s);
      if (_cw && taxRealWorks(_cw.relatedItems || []).length) return _cw;
      var _sw3 = await search({ keyword: s });
      var _rw3 = taxRealWorks(_sw3 || []);
      return { id: "search:" + s, type: "detail", mediaType: "movie", title: s, link: "search:" + s, description: "搜索 · 共 " + _rw3.length + " 部作品", videoUrl: "", childItems: [], relatedItems: _rw3.length ? _rw3 : (_sw3 || []) };
    }
    var vid = queryParam(s, "id");
    if (!vid && !/getmovie/.test(s)) vid = s; // 兜底: link 本身就是 _id
    if (!vid) return { id: s || "err", type: "url", title: "解析失败", description: "缺少影片 id" };
    var title = queryParam(s, "t");
    var pic = queryParam(s, "p");

    var apiUrl = BASE + "/api/getmovie?type=1280&id=" + encodeURIComponent(vid);
    var data = await getJson(apiUrl);
    var m3u8 = data && data.m3u8 ? String(data.m3u8) : "";
    if (!m3u8) {
      return { id: s, type: "url", title: title || "解析失败", description: "未找到播放地址" };
    }
    var playUrl = /^https?:\/\//i.test(m3u8) ? m3u8 : BASE + m3u8;
    // getmovie 只回 {m3u8}、不带任何分类字段：genreItems 从卡片 link 的 &g=/&c= 参数取；
    // 旧卡片无参数时，按标题搜回列表项（其 link 带 g/c）补取；取不到就留空、不编造。
    var tax = { peoples: [], genreItems: [] };
    var _gstr = queryParam(s, "g");
    var _cstr = queryParam(s, "c");
    if (_gstr || _cstr) {
      var _fk = {};
      if (_gstr) _fk.tags = _gstr.split("|");
      if (_cstr) _fk.category = _cstr;
      tax = extractTaxonomyFromApi(_fk);
    } else {
      try {
        var _sw4 = await search({ keyword: title || vid });
        if (Array.isArray(_sw4)) {
          for (var _si = 0; _si < _sw4.length; _si++) {
            var _lk = String((_sw4[_si] && (_sw4[_si].link || _sw4[_si].id)) || "");
            if (_lk.indexOf(vid) >= 0) {
              var _gg = queryParam(_lk, "g");
              var _cc = queryParam(_lk, "c");
              if (_gg || _cc) {
                var _fk2 = {};
                if (_gg) _fk2.tags = _gg.split("|");
                if (_cc) _fk2.category = _cc;
                tax = extractTaxonomyFromApi(_fk2);
              }
              break;
            }
          }
        }
      } catch (_) {}
    }

    var ret = {
      id: s,
      type: "detail",
      title: title || vid,
      link: s,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      videoUrl: playUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE + "/",
        "Origin": BASE
      }
    };
    if (tax.peoples.length) ret.peoples = tax.peoples;
    if (tax.genreItems.length) ret.genreItems = tax.genreItems;
    return ret;
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
