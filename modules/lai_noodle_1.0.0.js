// NoodleMagazine for REX (lai_noodle v1.0.0)
// 移植自 mira-cat 蜘蛛 noodle.js, 后端: https://noodlemagazine.com/ (视频搜索聚合站)。
// 列表: <div class="item" data-video-title-base> 内 <a href="/watch/{owner}_{id}">,
//   封面 <img data-src="...preview_320.jpg">, 与蜘蛛 parseList 同口径 (属性实体须解码,
//   否则带 query 参数的图片 URL 会被 &amp; 拆散而 403)。
// 分类: 蜘蛛实测的 7 档 (最新/今日热门/本周热门/新收录/探索/实时/趋势榜);
//   站方无传统分类, 不猜标签分类。range=month 与 home 返回相同内容, 故不设本月档。
// 翻页: 站方"加载更多"是 POST 到当前页, body 带原查询参数 + p=页码(从 0 起) +
//   csrfmiddlewaretoken (取自首页隐藏 input), 且 POST 须带 GET 时种下的 csrftoken
//   cookie, 否则 nginx 直接 403。REX 侧 Widget.http 若不透传 Set-Cookie,
//   第 2 页起可能 403, 此时自动回落 GET 首屏 (不抛错)。
// 直连优先、解析为空才走已部署中转 Worker (蜘蛛写死地址, 原样沿用):
//   https://html-relay.li768435813.workers.dev/ (?url= 参数)。
// 搜索: /video/{kw}。详情: window.playlist 四档按数字降序取最高档,
//   空时回退 /videofile/{owner}_{id}.mp4 单线 (301 跳 CDN, 带时效 token, 现取现用)。

WidgetMetadata = {
  id: "lai_noodle",
  title: "NoodleMagazine",
  description: "NoodleMagazine（noodlemagazine.com）：视频搜索聚合站，7 档范围分类，详情按 playlist 最高档出线",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://noodlemagazine.com/",
  detailCacheDuration: 180,
  modules: [
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "今日热门", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "home?range=day" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "本周热门", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "home?range=week" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "新收录", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "home?range=recent" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "探索", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "home?range=explore" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "实时", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "now" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "趋势榜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "popular/trending" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "搜索", functionName: "search", cacheDuration: 180, params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] }
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

var BASE = "https://noodlemagazine.com";
var HOST = "https://noodlemagazine.com/";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var RELAY = "https://html-relay.li768435813.workers.dev/";

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": referer || HOST
  };
}

function t(v) {
  return String(v == null ? "" : v).trim();
}

function stripTags(s) {
  return String(s || "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}

function decodeEntities(s) {
  return String(s || "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function absUrl(url) {
  url = t(url);
  if (!url) return "";
  if (/^\/\//.test(url)) return "https:" + url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.charAt(0) === "/") return BASE + url;
  return BASE + "/" + url;
}

function firstMatch(text, re, idx) {
  var m = String(text || "").match(re);
  return m ? decodeEntities(m[idx || 1] || "") : "";
}

async function getText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  return res && res.data != null ? String(res.data) : "";
}

async function getViaRelay(url, referer) {
  var res = await Widget.http.get(RELAY + "?url=" + encodeURIComponent(url), { headers: pageHeaders(referer) });
  return res && res.data != null ? String(res.data) : "";
}

function parseList(html) {
  var items = [];
  var seen = {};
  var chunks = String(html || "").split('<div class="item"');
  for (var i = 1; i < chunks.length; i++) {
    var blk = chunks[i].slice(0, 4000);
    var am = blk.match(/<a href="(\/watch\/[^"]+)"[^>]*>/i);
    if (!am) continue;
    var url = BASE + am[1];
    if (seen[url]) continue;
    var tm = blk.match(/data-video-title-base="([^"]+)"/i);
    var title = tm ? stripTags(tm[1]) : "";
    if (!title || title.length < 2) continue;
    var pm = blk.match(/data-src="(https?:[^"]+preview_320\.jpg[^"]*)"/i) || blk.match(/data-src="(https?:[^"]+)"/i);
    seen[url] = 1;
    var cover = pm ? decodeEntities(pm[1]) : "";
    items.push({
      id: url,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: url,
      description: "",
      mediaType: "movie"
    });
    if (items.length >= 24) break;
  }
  return items;
}

async function listSmart(url, referer) {
  var html = "";
  try { html = await getText(url, referer); } catch (e) { html = ""; }
  var list = parseList(html);
  if (!list.length) {
    try {
      var rh = await getViaRelay(url, referer);
      var list2 = parseList(rh);
      if (list2.length) return { list: list2, html: rh };
    } catch (e) {}
  }
  return { list: list, html: html };
}

function parseCsrf(html) {
  var m = String(html || "").match(/name="csrfmiddlewaretoken"[^>]*value="([^"]+)"/i)
    || String(html || "").match(/value="([^"]+)"[^>]*name="csrfmiddlewaretoken"/i);
  return m ? m[1] : "";
}

function parseSetCookie(res) {
  try {
    var headers = (res && res.headers) || {};
    var raw = headers["set-cookie"] || headers["Set-Cookie"] || headers["x-set-cookie"] || headers["X-Set-Cookie"];
    var arr = [];
    if (Array.isArray(raw)) arr = raw;
    else if (raw) arr = [raw];
    var pairs = [];
    for (var i = 0; i < arr.length; i++) {
      var parts = String(arr[i]).split(";;");
      for (var j = 0; j < parts.length; j++) {
        var nv = parts[j].split(";")[0].trim();
        if (nv && nv.indexOf("=") >= 0 && pairs.indexOf(nv) < 0) pairs.push(nv);
      }
    }
    return pairs.join("; ");
  } catch (e) { return ""; }
}

function pageForm(tid, page, token) {
  var q = (String(tid).split("?")[1] || "");
  var parts = q.split("&").filter(function (s) { return s && !/^p=/i.test(s) && !/^csrfmiddlewaretoken=/i.test(s); });
  parts.push("p=" + (page - 1));
  if (token) parts.push("csrfmiddlewaretoken=" + encodeURIComponent(token));
  return parts.join("&");
}

async function postForm(url, form, cookie, useRelay) {
  if (!Widget.http || typeof Widget.http.post !== "function") return "";
  var target = useRelay ? (RELAY + "?url=" + encodeURIComponent(url)) : url;
  var headers = pageHeaders(HOST);
  headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
  if (cookie) { headers["Cookie"] = cookie; if (useRelay) headers["X-Cookie"] = cookie; }
  var res = await Widget.http.post(target, form, { headers: headers });
  return res && res.data != null ? String(res.data) : "";
}

async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var tid = t(params.path || params.cat) || "home";
  var url = BASE + "/" + tid.replace(/^\/+/, "");
  try {
    if (page <= 1) {
      var first = await listSmart(url, HOST);
      if (first.list.length) return first.list;
      return [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
    }
    var baseHtml = "";
    var baseCookie = "";
    try {
      var gr = await Widget.http.get(url, { headers: pageHeaders(HOST) });
      baseHtml = gr && gr.data != null ? String(gr.data) : "";
      baseCookie = parseSetCookie(gr);
    } catch (e) {}
    if (!parseList(baseHtml).length) {
      try {
        var rr = await Widget.http.get(RELAY + "?url=" + encodeURIComponent(url), { headers: pageHeaders(HOST) });
        var rh = rr && rr.data != null ? String(rr.data) : "";
        if (parseList(rh).length) { baseHtml = rh; baseCookie = parseSetCookie(rr); }
      } catch (e) {}
    }
    var token = parseCsrf(baseHtml);
    var form = pageForm(tid, page, token);
    var list = [];
    try { list = parseList(await postForm(url, form, baseCookie, false)); } catch (e) { list = []; }
    if (!list.length) {
      try { list = parseList(await postForm(url, form, baseCookie, true)); } catch (e) { list = []; }
    }
    if (list.length) return list;
    var fb = await listSmart(url, HOST);
    if (fb.list.length) return fb.list;
    return [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败", description: String((e && e.message) || e) + " | URL: " + url }];
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
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var url = BASE + "/video/" + encodeURIComponent(wd);
  try {
    var r = await listSmart(url, HOST);
    if (r.list.length) return r.list;
    return [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败", description: String((e && e.message) || e) + " | URL: " + url }];
  }
}

function detailPlayUrl(html, raw) {
  var pl = [];
  var seenPl = {};
  var plRe = /"file"\s*:\s*"([^"]+)"\s*,\s*"label"\s*:\s*"([^"]+)"/gi;
  var pm;
  while ((pm = plRe.exec(html)) !== null) {
    var f = pm[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/").replace(/&amp;/g, "&");
    var lab = t(pm[2]);
    if (!/^https?:\/\//i.test(f) || seenPl[f]) continue;
    seenPl[f] = 1;
    pl.push({ label: lab, file: f });
  }
  pl.sort(function (a, b) { return (parseInt(b.label, 10) || 0) - (parseInt(a.label, 10) || 0); });
  if (pl.length) return pl[0].file;
  var vm = String(html || "").match(/\/videofile\/[^"'\s<>]+\.mp4/i);
  return vm ? (BASE + vm[0]) : "";
}

async function loadDetail(link) {
  try {
    var url = String(link || "");
    if (!/^https?:\/\//i.test(url)) url = absUrl(url);
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var html = "";
    try { html = await getText(url, HOST); } catch (e) { html = ""; }
    var videoUrl = detailPlayUrl(html, url);
    if (!videoUrl) {
      try {
        var rh = await getViaRelay(url, HOST);
        var v2 = detailPlayUrl(rh, url);
        if (v2) { html = rh; videoUrl = v2; }
      } catch (e) {}
    }
    var title = firstMatch(html, /data-video-title-base="([^"]+)"/i) || "NoodleMagazine";
    var coverRaw = firstMatch(html, /og:image[^>]*content="([^"]+)"/i);
    var name = stripTags(title) || url;
    if (!videoUrl) {
      return { id: url, type: "url", title: name, description: "未找到播放地址" };
    }
    return {
      id: url,
      type: "detail",
      title: name,
      link: url,
      posterPath: coverRaw,
      coverUrl: coverRaw,
      backdropPath: coverRaw,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": HOST
      }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
