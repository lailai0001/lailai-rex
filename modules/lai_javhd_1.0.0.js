// JavHD for REX (lai_javhd v1.0.0, 移植自 mira-cat 蜘蛛 py_javhd)
// 后端：https://javhd.icu（WordPress JAV 站，无反爬）。
// 列表：GET /[/page/N/] 或 /categories/{slug}/[/page/N/]，18 条/页，正则解析卡片。
// 搜索：GET /?s={kw}（翻页 /page/N/?s={kw}）。
// 详情：GET /video/{slug}/ 取 iframe (vidara 系) 的 host+filecode；
// 播放：POST {host}/api/stream {filecode,device,codecs} -> streaming_url（m3u8 720p，
//       token 时效短，loadDetail 时实时获取）。需要运行时提供 Widget.http.post。

WidgetMetadata = {
  id: "lai_javhd",
  title: "JavHD",
  description: "JavHD（javhd.icu）：最新/有码/无码/英字/无码流出，播放 720p m3u8 实时解析",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://javhd.icu",
  detailCacheDuration: 180,
  modules: [
    {
      title: "最新",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "latest" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "有码",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "censored" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "无码",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "jav-hd-uncen" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "英字",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "jav-hd-engsub" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "无码流出",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "jav-hd-uncensored-leaked" },
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

var SITE = "https://javhd.icu";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = SITE + "/";

// 5 个真实分类（与蜘蛛 CATS 一致，2026-10-20 蜘蛛从首页导航实测）
var CATS = ["latest", "censored", "jav-hd-uncen", "jav-hd-engsub", "jav-hd-uncensored-leaked"];

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

function fixUrl(u) {
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
    "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.7",
    "Referer": referer || REFERER
  };
}

async function fetchText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer), timeout: 25000 });
  var body = res && res.data != null ? String(res.data) : "";
  return body;
}

// POST JSON（带守卫）：运行时无 Widget.http.post 时返回 null，播放自动降级为失败卡
async function postJson(url, obj, referer) {
  if (!Widget.http || typeof Widget.http.post !== "function") return null;
  var headers = {
    "User-Agent": UA,
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Referer": referer || REFERER,
    "Origin": SITE
  };
  try {
    var res = await Widget.http.post(url, JSON.stringify(obj), { headers: headers, timeout: 25000 });
    var data = res && res.data;
    if (!data) return null;
    if (typeof data === "string") {
      try { return JSON.parse(data); } catch (e) { return null; }
    }
    return typeof data === "object" ? data : null;
  } catch (e) { return null; }
}

// 解析列表卡片：div.item-img > a[href="/video/{slug}/"] > img[src,alt]（与蜘蛛 parseCards 同逻辑）
function parseCards(html) {
  var out = [];
  var seen = {};
  var re = /<div class="item-img">\s*<a href="(https?:\/\/javhd\.icu\/video\/[^"]+\/)"/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var durl = m[1];
    if (seen[durl]) continue;
    seen[durl] = 1;
    var win = html.slice(m.index, m.index + 2000);
    var imgTagM = win.match(/<img[^>]+>/);
    var imgTag = imgTagM ? imgTagM[0] : "";
    var srcM = imgTag.match(/\ssrc="([^"]+)"/);
    var altM = imgTag.match(/\salt="([^"]*)"/);
    var pic = srcM ? srcM[1] : "";
    var title = altM ? altM[1] : "";
    if (!title) {
      var h3M = win.match(/class="post-title[^"]*"[^>]*>\s*<a[^>]*>([^<]+)<\/a>/);
      if (h3M) title = h3M[1];
    }
    title = clean(title) || durl.split("/video/")[1].replace(/\/$/, "");
    var cover = fixUrl(pic);
    out.push({
      id: durl,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: durl,
      description: title,
      mediaType: "movie"
    });
  }
  return out;
}

function catUrl(tid, page) {
  var base;
  if (!tid || tid === "latest") base = SITE + "/";
  else base = SITE + "/categories/" + encodeURIComponent(tid) + "/";
  if (page > 1) return base + "page/" + page + "/";
  return base;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var tid = t(params.path || params.cat || "latest");
  if (CATS.indexOf(tid) < 0) tid = "latest";
  var url = catUrl(tid, page);
  try {
    var html = await fetchText(url);
    if (!html || html.length < 200) {
      return [{ id: "err", type: "url", title: "载入失败：页面为空", description: url }];
    }
    var list = parseCards(html);
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
  if (!wd) {
    return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  }
  var url = SITE + "/?s=" + encodeURIComponent(wd);
  if (page > 1) url = SITE + "/page/" + page + "/?s=" + encodeURIComponent(wd);
  try {
    var html = await fetchText(url);
    var list = html ? parseCards(html) : [];
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

// 从详情页提取播放器 iframe 的 host + filecode（与蜘蛛 extractPlayer 同逻辑）
function extractPlayer(html) {
  var m = html.match(/<iframe[^>]+src="(https?:\/\/[^"/]+)\/e\/([A-Za-z0-9]+)"[^>]*>/);
  if (m) return { host: m[1], filecode: m[2] };
  var m2 = html.match(/(https?:\/\/[^"/\s]+)\/e\/([A-Za-z0-9]{6,})/);
  if (m2) return { host: m2[1], filecode: m2[2] };
  return null;
}

// 调播放 API 获取 m3u8（token 时效短，实时调用）
async function fetchStreamUrl(host, filecode, referer) {
  var apiUrl = host.replace(/\/$/, "") + "/api/stream";
  var resp = await postJson(apiUrl, {
    filecode: filecode,
    device: "web",
    codecs: ["h264"]
  }, referer);
  if (resp && resp.streaming_url && /^https?:\/\//.test(resp.streaming_url)) {
    return resp.streaming_url;
  }
  return "";
}

async function loadDetail(link) {
  var durl = t(link);
  try {
    if (!/^https?:\/\//.test(durl)) durl = SITE + "/video/" + durl.replace(/^\//, "");
    var html = await fetchText(durl, REFERER);
    if (!html) {
      return { id: durl, type: "url", title: "载入失败", description: "详情页为空" };
    }

    var titleM = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    var name = titleM ? clean(titleM[1]) : durl.split("/video/")[1].replace(/\/$/, "");

    var pic = "";
    var picM = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (picM) pic = fixUrl(picM[1]);

    var player = extractPlayer(html);
    if (!player) {
      return { id: durl, type: "url", title: name || "解析失败", description: "未找到播放器" };
    }
    var streamUrl = await fetchStreamUrl(player.host, player.filecode, durl);
    if (!streamUrl) {
      return { id: durl, type: "url", title: name || "解析失败", description: "未找到播放地址" };
    }

    return {
      id: durl,
      type: "detail",
      title: name,
      link: durl,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      videoUrl: streamUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": player.host + "/"
      }
    };
  } catch (e) {
    return { id: durl || String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
