// JavMost for REX (lai_javmost v1.0.0, 移植自 mira-cat 蜘蛛 py_javmost)
// 后端：https://www.javmost.ws/（JAV 在线站，无反爬），HTML 正则 + JSON-LD 解析。
// 列表：/category/{all|censor|uncensor|题材}/、/code/{系列}/、/top* 热门榜、/search/{kw}/
// 播放三步（与蜘蛛一致）：
//   1) POST /ri3123o235r/（必须带 X-Requested-With: XMLHttpRequest，否则被 tar-pit）
//      从详情页 YWRz* 参数组表单，拿 embed 播放器地址；
//   2) embed 页（dooplayer.com/mostplayer.com）带 Sec-Fetch-Dest: iframe 头访问，
//      解析 meta x-embed-token/et/sig/api；
//   3) POST {api}{token}（X-Embed-Auth/ET/SIG 头，body {"ref": origin}）拿直链 mp4/m3u8。
// 与猫源差异：猫源解不出直链时降级 parse:1 让播放器嗅探；REX 无嗅探，
// 解不出直链时如实返回“未找到播放地址”。

WidgetMetadata = {
  id: "lai_javmost",
  title: "JavMost",
  description: "JavMost（javmost.ws）：最新/有码/无码/无码流出/热门榜/题材/系列共 33 个分类，播放解析 dooplayer 系直链",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://www.javmost.ws",
  detailCacheDuration: 180,
  modules: [
    {
      title: "搜索",
      functionName: "search",
      cacheDuration: 60,
      params: [
        { name: "keyword", title: "关键词", type: "input", value: "" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "精选",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "分类",
          type: "enumeration",
          value: "latest",
          enumOptions: [
            { title: "最新", value: "latest" },
            { title: "全部", value: "all" },
            { title: "有码", value: "censor" },
            { title: "无码", value: "uncensor" },
            { title: "无码流出", value: "search:REDUCING" },
            { title: "小时热门", value: "topview" },
            { title: "日热门", value: "topdaily" },
            { title: "周热门", value: "topweek" },
            { title: "月热门", value: "topmonth" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "题材",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "题材",
          type: "enumeration",
          value: "genre:Big Tits",
          enumOptions: [
            { title: "巨乳", value: "genre:Big Tits" },
            { title: "中出", value: "genre:Creampie" },
            { title: "人妻", value: "genre:Married Woman" },
            { title: "学生", value: "genre:School Girls" },
            { title: "苗条", value: "genre:Slender" },
            { title: "独角戏", value: "genre:Solowork" },
            { title: "潮吹", value: "genre:Squirting" },
            { title: "素人", value: "genre:Amateur" },
            { title: "剧情", value: "genre:Drama" },
            { title: "女上位", value: "genre:Cowgirl" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "系列",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "系列",
          type: "enumeration",
          value: "code:SNIS",
          enumOptions: [
            { title: "SNIS系列", value: "code:SNIS" },
            { title: "IPZ系列", value: "code:IPZ" },
            { title: "JUX系列", value: "code:JUX" },
            { title: "ABP系列", value: "code:ABP" },
            { title: "SSNI系列", value: "code:SSNI" },
            { title: "MIDE系列", value: "code:MIDE" },
            { title: "WANZ系列", value: "code:WANZ" },
            { title: "STAR系列", value: "code:STAR" },
            { title: "HEYZO系列", value: "code:HEYZO" },
            { title: "JUC系列", value: "code:JUC" },
            { title: "JUFD系列", value: "code:JUFD" },
            { title: "LUXU系列", value: "code:LUXU" },
            { title: "EBOD系列", value: "code:EBOD" },
            { title: "RBD系列", value: "code:RBD" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
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

var BASE = "https://www.javmost.ws";
var SITE = BASE;
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = BASE + "/";

// 非视频的单段路径，解析卡片时跳过
var SKIP_SLUGS = {};
(function () {
  var arr = ["allcategory", "allcode", "alldirector", "allmaker",
    "topview", "topdaily", "topweek", "topweeknew", "topmonth",
    "pornstar", "toppornstar", "votepornstar", "newpornstar",
    "category", "tag", "code", "search", "page", "404"];
  for (var i = 0; i < arr.length; i++) SKIP_SLUGS[arr[i]] = true;
})();

function t(v) {
  return String(v == null ? "" : v).trim();
}

function clean(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
}

function fixPic(u) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return SITE + u;
  return u;
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.7",
    "Referer": referer || REFERER
  };
}

async function fetchText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  var body = res && res.data != null ? String(res.data) : "";
  return body;
}

// POST（带守卫）：运行时无 Widget.http.post 时返回 ""，调用方按失败处理
// res.data 兼容字符串与已解析对象
async function postText(url, bodyText, headers) {
  if (!Widget.http || typeof Widget.http.post !== "function") return "";
  var res = await Widget.http.post(url, bodyText, { headers: headers, timeout: 30000 });
  if (!res || res.data == null) return "";
  return typeof res.data === "string" ? res.data : JSON.stringify(res.data);
}

async function postJson(url, bodyText, headers) {
  var txt = await postText(url, bodyText, headers);
  if (!txt) return null;
  try { return JSON.parse(txt); } catch (e) { return null; }
}

// 解析视频卡片: <a href="https://www.javmost.ws/{CODE}/" ... alt="标题"> ... data-src="封面"
function parseCards(html) {
  var out = [];
  var seen = {};
  var re = /<a\s[^>]*href="(https?:\/\/www\.javmost\.ws\/([A-Za-z0-9\-_]+)\/)"[^>]*>/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var durl = m[1];
    var slug = m[2];
    if (SKIP_SLUGS[slug.toLowerCase()]) continue;
    if (seen[durl]) continue;
    seen[durl] = true;
    var win = html.slice(m.index, m.index + 2500);
    var tm = m[0].match(/alt="([^"]+)"/) || win.match(/<h1[^>]*class="card-title[^"]*"[^>]*>([^<]+)</);
    var title = tm ? clean(tm[1]) : slug;
    var im = win.match(/data-src="(https?:\/\/[^"]+)"/) || win.match(/data-src="(\/\/[^"]+)"/);
    var pic = im ? fixPic(im[1]) : "";
    out.push({
      id: durl,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: durl,
      description: slug,
      mediaType: "movie"
    });
  }
  return out;
}

function catUrl(tid, page) {
  page = Math.max(1, page);
  // 标签分类: tag:X -> /tag/X/ (仅第1页，翻页 410)
  if (tid.indexOf("tag:") === 0) {
    return SITE + "/tag/" + encodeURIComponent(tid.slice(4)) + "/";
  }
  // 搜索型分类: search:REDUCING -> /search/REDUCING/[/page/N/] (支持翻页)
  if (tid.indexOf("search:") === 0) {
    var kw = tid.slice(7);
    if (page <= 1) return SITE + "/search/" + encodeURIComponent(kw) + "/";
    return SITE + "/search/" + encodeURIComponent(kw) + "/page/" + page + "/";
  }
  // 题材分类: genre:Big Tits -> /category/Big%20Tits/[/page/N/]
  if (tid.indexOf("genre:") === 0) {
    var slug = tid.slice(6);
    if (page <= 1) return SITE + "/category/" + encodeURIComponent(slug) + "/";
    return SITE + "/category/" + encodeURIComponent(slug) + "/page/" + page + "/";
  }
  // 系列分类: code:SNIS -> /code/SNIS/[/page/N/]
  if (tid.indexOf("code:") === 0) {
    var code = tid.slice(5);
    if (page <= 1) return SITE + "/code/" + encodeURIComponent(code) + "/";
    return SITE + "/code/" + encodeURIComponent(code) + "/page/" + page + "/";
  }
  if (page <= 1) {
    switch (tid) {
      case "all": return SITE + "/category/all/";
      case "censor": return SITE + "/category/censor/";
      case "uncensor": return SITE + "/category/uncensor/";
      case "topview": return SITE + "/topview/";
      case "topdaily": return SITE + "/topdaily/";
      case "topweek": return SITE + "/topweek/";
      case "topmonth": return SITE + "/topmonth/";
      case "latest":
      default: return SITE + "/";
    }
  }
  switch (tid) {
    case "latest": return SITE + "/category/all/page/" + page + "/";
    case "all":
    case "censor":
    case "uncensor": return SITE + "/category/" + tid + "/page/" + page + "/";
    case "topview":
    case "topdaily":
    case "topweek":
    case "topmonth": return SITE + "/" + tid + "/all/page/" + page + "/";
    default: return SITE + "/category/all/page/" + page + "/";
  }
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var tid = String(params.path || params.cat || "latest");
  var url = catUrl(tid, page);
  try {
    var html = await fetchText(url);
    if (!html) return [{ id: "err", type: "url", title: "载入失败: 空回应", description: url }];
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片", description: url }];
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
  if (!wd) {
    return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  }
  var url = SITE + "/search/" + encodeURIComponent(wd) + "/";
  if (page > 1) url += "page/" + page + "/";
  try {
    var html = await fetchText(url);
    if (!html) return [{ id: "err", type: "url", title: "搜索失败: 空回应", description: url }];
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片", description: url }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// 从详情页提取 YWRz 加密参数
function extractYwrz(html) {
  var defs = {};
  var re = /(YWRz\w+)\s*=\s*'([^']+)'/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    defs[m[1]] = m[2];
  }
  return defs;
}

// POST /ri3123o235r/ 获取 embed 播放器地址
// 关键: 必须带 X-Requested-With: XMLHttpRequest 头，否则被 tar-pit
async function fetchEmbedUrl(durl, html) {
  var defs = extractYwrz(html);
  if (!defs.YWRzNA || !defs.YWRzMQo) return "";
  var pairs = [
    ["group", defs.YWRzMg || "62"],
    ["part", "1"],
    ["code", defs.YWRzNA],
    ["code2", defs.YWRzNQ || ""],
    ["code3", defs.YWRzNg || ""],
    ["value", defs.YWRzMQo],
    ["sound", "av"]
  ];
  var bodyParts = [];
  for (var i = 0; i < pairs.length; i++) {
    bodyParts.push(encodeURIComponent(pairs[i][0]) + "=" + encodeURIComponent(pairs[i][1]));
  }
  var headers = {
    "User-Agent": UA,
    "Referer": durl,
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Accept": "application/json, text/javascript, */*; q=0.01"
  };
  var json = await postJson(SITE + "/ri3123o235r/", bodyParts.join("&"), headers);
  if (json && json.status === "success" && json.data && json.data[0]) {
    return t(json.data[0]).replace(/\\\//g, "/");
  }
  return "";
}

// 从 embed 页 (dooplayer.com/mostplayer.com 系) 解析直链
// embed 页必须带 Sec-Fetch-Dest: iframe 头，否则返回 204
// 页内 meta: x-embed-token / x-embed-api / x-embed-et / x-embed-sig
// 调 API: POST {api}{token}，头 X-Embed-Auth:1 + X-Embed-ET + X-Embed-SIG，body {"ref": "..."}
async function resolveEmbedDirect(embedUrl, referer) {
  if (!/dooplayer\.com|mostplayer\.com/i.test(embedUrl)) return "";
  var headers = {
    "User-Agent": UA,
    "Referer": referer || REFERER,
    "Sec-Fetch-Dest": "iframe",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9"
  };
  var html = "";
  try {
    var res = await Widget.http.get(embedUrl, { headers: headers });
    html = res && res.data != null ? String(res.data) : "";
  } catch (e) { /* ignore */ }
  if (!html || html.length < 200) return "";
  function meta(n) {
    var m = html.match(new RegExp("<meta[^>]+name=[\"']?" + n + "[\"']?[^>]*content=[\"']?([^\"'>\\s]+)", "i"))
      || html.match(new RegExp("<meta[^>]+content=[\"']?([^\"'>\\s]+)[\"']?[^>]*name=[\"']?" + n + "[\"']?", "i"));
    return m ? m[1] : "";
  }
  var token = meta("x-embed-token");
  var api = meta("x-embed-api");
  var et = meta("x-embed-et");
  var sig = meta("x-embed-sig");
  if (!token || !api || !et || !sig) return "";
  var apiUrl = api.replace(/\/?$/, "") + "/" + token;
  var apiHeaders = {
    "User-Agent": UA,
    "Referer": embedUrl,
    "Content-Type": "application/json",
    "X-Embed-Auth": "1",
    "X-Embed-ET": et,
    "X-Embed-SIG": sig
  };
  var origin = embedUrl.match(/^https?:\/\/[^/]+/);
  var apiBody = JSON.stringify({ ref: origin ? origin[0] : "" });
  var json = await postJson(apiUrl, apiBody, apiHeaders);
  if (json && json.ok && json.url && /^https?:\/\//.test(json.url)) {
    return json.url;
  }
  return "";
}

function detailUrl(link) {
  var id = String(link || "");
  if (/^https?:\/\//.test(id)) return id.replace(/^https?:\/\/[^/]+/, SITE);
  return SITE + "/" + id.replace(/^\/+|\/+$/g, "") + "/";
}

async function loadDetail(link) {
  var durl = detailUrl(link);
  try {
    var html = await fetchText(durl);
    if (!html) {
      return { id: durl, type: "url", title: "载入失败", description: "详情页空回应" };
    }
    // 标题: JSON-LD name，降级用 <title>
    var name = "";
    var pic = "";
    var ldM = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (ldM) {
      try {
        var ld = JSON.parse(ldM[1]);
        name = t(ld.name);
        pic = t(ld.thumbnailUrl);
      } catch (e) { /* ignore */ }
    }
    if (!name) {
      var tm = html.match(/<title>([^<]*)<\/title>/);
      if (tm) name = clean(tm[1]).replace(/\s*[-–|]\s*Watch JAV Online.*$/i, "").trim();
    }
    var slugM = durl.match(/\/([A-Za-z0-9\-_]+)\/$/);
    if (!name) name = slugM ? slugM[1] : "JavMost";
    if (!pic) {
      var pm = html.match(/<meta property="og:image" content="([^"]+)"/);
      if (pm) pic = pm[1];
    }
    pic = fixPic(pic);

    // 播放解析: 1) POST 拿 embed 地址 2) dooplayer/mostplayer 系解直链
    var videoUrl = "";
    var embedUrl = await fetchEmbedUrl(durl, html);
    if (embedUrl && /^https?:\/\//.test(embedUrl)) {
      videoUrl = await resolveEmbedDirect(embedUrl, durl);
    }
    if (!videoUrl) {
      return {
        id: durl,
        type: "url",
        title: name,
        link: durl,
        posterPath: pic,
        coverUrl: pic,
        backdropPath: pic,
        description: "未找到播放地址"
      };
    }

    var embedOrigin = embedUrl.match(/^https?:\/\/[^/]+/);
    return {
      id: durl,
      type: "detail",
      title: name,
      link: durl,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: slugM ? slugM[1] : name,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": embedUrl,
        "Origin": embedOrigin ? embedOrigin[0] : ""
      }
    };
  } catch (e) {
    return { id: durl, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
