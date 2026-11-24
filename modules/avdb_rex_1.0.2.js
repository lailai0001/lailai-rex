// v1.0.2：AVDB 样式详情：分类小卡片 genreItems + 点按路由（详情页提取分类链接，点按打开该分类全部内容）
// Avdb for REX (avdb_play v1.0.1)
// v1.0.1（2026-11-21）：补搜索双声明（顶层 search 键 + modules[] 搜索条目，照 JavRate 1.0.6 同款配方，
//   双声明是用户真机确认的进搜索源列表配方）；search 函数本身已存在，函数逻辑一个字未动。
// 站点：avdbapi.com（标准 JSON API 番号库）。
// 分类（t 参数实测）：1=有码 / 2=无码 / 3=无码流出 / 4=素人 / 5=国产 / 6=动漫 / 7=中文字幕。
// 列表接口无封面字段，封面经 ac=detail&ids= 批量接口补全（upload18.cc 直链，实测无防盗链）。
// 播放地址（helvid.com m3u8）带时效签名，播放时经 loadResource 实时解析，保证签名新鲜。

WidgetMetadata = {
  id: "avdb_play",
  title: "Avdb",
  description: "Avdb（avdbapi.com）：9 个分类、番号搜索，封面直连，播放时实时解析",
  author: "Muse",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  site: "https://avdbapi.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    {
      title: "最新收录",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "t", title: "列表", type: "constant", value: "" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "有码",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "t", title: "列表", type: "constant", value: "1" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "无码",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "t", title: "列表", type: "constant", value: "2" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "无码流出",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "t", title: "列表", type: "constant", value: "3" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "素人",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "t", title: "列表", type: "constant", value: "4" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "国产",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "t", title: "列表", type: "constant", value: "5" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "动漫",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "t", title: "列表", type: "constant", value: "6" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "中文字幕",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "t", title: "列表", type: "constant", value: "7" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      id: "loadResource",
      title: "Avdb播放源",
      description: "播放时实时解析播放地址",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 0,
      params: []
    }
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

var API = "https://avdbapi.com/api.php/provide/vod";
var AVDB_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/604.1.14 (KHTML, like Gecko)";

function avdbHeaders(referer) {
  return {
    "User-Agent": AVDB_UA,
    "Accept": "application/json,text/html,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": referer || "https://avdbapi.com/"
  };
}

function avdbEncodeLink(data) { return "avdb:" + JSON.stringify(data); }
function avdbDecodeLink(link) {
  var v = String(link || "");
  if (v.indexOf("avdb:") === 0) {
    var rest = v.slice(5);
    try {
      var o = JSON.parse(rest);
      if (o && typeof o === "object" && o.id) return o;
      return { id: String(o) };
    } catch (_) { return { id: rest }; }
  }
  return { id: v };
}

function cleanText(s) {
  return String(s || "").replace(/&#0?39;/g, "'").replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/\s+/g, " ").trim();
}

async function apiJson(url) {
  var res = await Widget.http.get(url, { headers: avdbHeaders() });
  var raw = res && res.data;
  // REX 的 http 可能已经把 JSON 转成对象了
  if (raw != null && typeof raw === "object") {
    if (raw.code !== 1) throw new Error("接口返回 code=" + raw.code);
    return raw;
  }
  var body = raw != null ? String(raw) : "";
  if (!body) throw new Error("空回应");
  // 去掉可能的 BOM
  if (body.charCodeAt(0) === 0xFEFF) body = body.slice(1);
  var d = JSON.parse(body);
  if (d.code !== 1) throw new Error("接口返回 code=" + d.code);
  return d;
}

// 列表接口无封面字段，用批量 detail 接口一次补全整页封面
async function fetchPosterMap(ids) {
  var map = {};
  if (!ids.length) return map;
  try {
    var d = await apiJson(API + "?ac=detail&ids=" + ids.join(","));
    (d.list || []).forEach(function (it) {
      var pid = String(it.id || "");
      var pic = it.poster_url || it.thumb_url || "";
      if (pid && pic) map[pid] = pic;
    });
  } catch (_) {}
  return map;
}

function descOf(it) {
  var parts = [];
  if (it.type_name) parts.push(it.type_name);
  if (it.year) parts.push(String(it.year));
  var actor = Array.isArray(it.actor) ? it.actor.join(",") : (it.actor || "");
  actor = cleanText(actor);
  if (actor && actor !== "Updating") parts.push(actor);
  if (it.movie_code) parts.push(cleanText(it.movie_code));
  return parts.join(" · ");
}

function toCard(it, posterMap) {
  var vid = String(it.id || "");
  var title = cleanText(it.name || it.origin_name || vid);
  var poster = (posterMap && posterMap[vid]) || "";
  var link = "avdb:" + vid;
  return {
    id: link,
    type: "url",
    title: title,
    posterPath: poster,
    coverUrl: poster,
    backdropPath: poster,
    link: link,
    description: descOf(it),
    mediaType: "movie"
  };
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var t = String(params.t == null ? "" : params.t).trim();
  var url = API + "?ac=list&pg=" + page + (t ? "&t=" + encodeURIComponent(t) : "");
  try {
    var d = await apiJson(url);
    var list = d.list || [];
    if (!list.length) return [{ id: "empty", type: "url", title: "没有找到相关影片" }];
    var ids = list.map(function (it) { return String(it.id || ""); }).filter(Boolean);
    var posterMap = await fetchPosterMap(ids);
    return list.map(function (it) { return toCard(it, posterMap); });
  } catch (e) {
    var msg = String((e && e.message) || e);
    // 把错误直接显示在标题上，方便诊断
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url.slice(0, 80) }];
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

async function searchByCode(params) {
  var keyword = pickKeyword(params);
  if (!keyword) {
    return [{ id: "tip", type: "url", title: "输入番号后搜寻，例如 SSIS-001" }];
  }
  var page = parseInt((params && params.page) || 1, 10) || 1;
  var url = API + "?ac=list&wd=" + encodeURIComponent(keyword) + "&pg=" + page;
  try {
    var d = await apiJson(url);
    var list = d.list || [];
    if (!list.length) return [{ id: "empty", type: "url", title: "没有找到相关影片" }];
    var ids = list.map(function (it) { return String(it.id || ""); }).filter(Boolean);
    var posterMap = await fetchPosterMap(ids);
    return list.map(function (it) { return toCard(it, posterMap); });
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜寻失败", description: String((e && e.message) || e) }];
  }
}

async function search(params) {
  return searchByCode(params);
}

// ---- AVDB 样式详情：分类小卡片（点按出该分类全部内容）----
// v1.0.2：详情页提取分类链接建成 genreItems；点按分类后 loadDetail 走分类分支返回该分类全部内容。
var TAX_GENRE_RE = /\/(genres?|tags?|category|categor(?:y|ies)|labels?|makers?)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)?|labels?|makers?|all|全部|分类|标签|题材)$/i;

function taxSlugOf(u) {
  var p = String(u || "").replace(/^https?:\/\/[^\/]+/, "").split("?")[0].split("#")[0].split("/").filter(function (s) { return s !== ""; });
  return p.length ? p[p.length - 1] : "";
}

function taxDetailRet(ret, genres) {
  if (ret && genres && genres.length) ret.genreItems = genres;
  return ret;
}

function extractGenreFromHtml(html) {
  var out = [];
  var seen = {};
  var baseHost = String("").replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(String(html || ""))) !== null) {
    var href = m[1] || "";
    var name = String(m[2] || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (!name || name.length > 40 || TAX_NAV_NAME_RE.test(name)) continue;
    var abs = href;
    if (!/^https?:\/\//i.test(abs)) continue;
    var host = abs.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (baseHost && host !== baseHost) continue;
    var pth = abs.replace(/^https?:\/\/[^\/]+/, "").split("?")[0].split("#")[0];
    var segs = pth.split("/").filter(function (s) { return s !== ""; });
    var ok = false;
    if (segs.length === 2 && TAX_GENRE_RE.test(abs)) ok = true;
    if (!ok) continue;
    if (seen[abs]) continue;
    seen[abs] = 1;
    out.push({ id: abs, title: name });
    if (out.length >= 20) break;
  }
  return out;
}

function avdbGenresFromItem(it) {
  var out = [];
  var seen = {};
  var names = [];
  if (it && Array.isArray(it.category)) names = it.category;
  if (!names.length && it && it.type_name) names = [it.type_name];
  for (var i = 0; i < names.length && out.length < 20; i++) {
    var nm = String(names[i] || "").trim();
    if (!nm || nm === "Updating" || seen[nm]) continue;
    seen[nm] = 1;
    out.push({ id: "avdbtype:" + encodeURIComponent(nm), title: nm });
  }
  return out;
}
async function loadDetail(link) {
  var taxGenres = [];
  var taxRaw = String(link || "");
  if (taxRaw.indexOf("avdbtype:") === 0) {
    var taxName = "";
    try { taxName = decodeURIComponent(taxRaw.slice(9)); } catch (e) { taxName = taxRaw.slice(9); }
    var taxWorks = await search({ keyword: taxName, page: 1 });
    if (!Array.isArray(taxWorks)) taxWorks = [];
    var taxReal = taxWorks.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
    return {
      id: taxRaw,
      type: "detail",
      mediaType: "movie",
      title: taxName || "分类",
      link: taxRaw,
      description: "分类 · 共 " + taxReal.length + " 部作品",
      videoUrl: "",
      childItems: [],
      relatedItems: taxReal.length ? taxReal : taxWorks
    };
  }
  var info = avdbDecodeLink(link);
  var vid = String(info.id || "").replace(/^avdb:/, "");
  if (!vid) return { id: String(link || "err"), type: "url", title: "参数错误" };
  try {
    var d = await apiJson(API + "?ac=detail&ids=" + encodeURIComponent(vid));
    var it = (d.list || [])[0];
    if (!it) return { id: "avdb:" + vid, type: "url", title: "未找到影片" };
    var title = cleanText(it.name || it.origin_name || vid);
    var poster = it.poster_url || it.thumb_url || info.poster || "";
    var desc = cleanText(it.description || "");
    var ret = {
      id: "avdb:" + vid,
      type: "url",
      title: title,
      link: "avdb:" + vid,
      coverUrl: poster,
      posterPath: poster,
      backdropPath: poster,
      mediaType: "movie",
      description: desc || descOf(it),
      playerType: "app"
    };
    var taxG = avdbGenresFromItem(it);
    if (taxG.length) ret.genreItems = taxG;
    return ret;
  } catch (e) {
    return { id: "avdb:" + vid, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// 播放地址带时效签名，播放时实时解析，保证签名新鲜
async function loadResource(params) {
  params = params || {};
  var info = avdbDecodeLink(params.link || params.url || params.id || "");
  var vid = String(info.id || "").replace(/^avdb:/, "");
  if (!vid) return [];
  try {
    var d = await apiJson(API + "?ac=detail&ids=" + encodeURIComponent(vid));
    var it = (d.list || [])[0];
    if (!it) return [];
    var title = cleanText(it.name || it.origin_name || vid);
    var sd = ((it.episodes || {}).server_data) || {};
    var embeds = [];
    Object.keys(sd).forEach(function (k) {
      var e = sd[k] || {};
      if (e.link_embed) embeds.push({ name: k, url: e.link_embed });
    });
    if (!embeds.length) return [];
    var out = [];
    for (var i = 0; i < embeds.length; i++) {
      try {
        var res = await Widget.http.get(embeds[i].url, { headers: avdbHeaders("https://upload18.org/") });
        var html = res && res.data != null ? String(res.data) : "";
        var m = html.match(/"m3u8":"(https:[^"]+)"/);
        if (!m) continue;
        var m3u8 = m[1].replace(/\\\//g, "/").replace(/\\u0026/g, "&");
        out.push({
          name: embeds[i].name === "Full" ? "原画" : embeds[i].name,
          description: title,
          url: m3u8,
          playerType: "app",
          customHeaders: { "User-Agent": AVDB_UA, "Referer": embeds[i].url }
        });
      } catch (_) {}
    }
    return out;
  } catch (_) {
    return [];
  }
}
