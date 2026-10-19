// Avdb for REX (avdb_play v1.0.0)
// 站点：avdbapi.com（标准 JSON API 番号库）。
// 分类（t 参数实测）：1=有码 / 2=无码 / 3=无码流出 / 4=素人 / 5=国产 / 6=动漫 / 7=中文字幕。
// 列表接口无封面字段，封面经 ac=detail&ids= 批量接口补全（upload18.cc 直链，实测无防盗链）。
// 播放地址（helvid.com m3u8）带时效签名，播放时经 loadResource 实时解析，保证签名新鲜。

WidgetMetadata = {
  id: "avdb_play",
  title: "Avdb",
  description: "Avdb（avdbapi.com）：9 个分类、番号搜索，封面直连，播放时实时解析",
  author: "Muse",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://avdbapi.com",
  detailCacheDuration: 180,
  modules: [
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
  ]
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

async function loadDetail(link) {
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
    return {
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
