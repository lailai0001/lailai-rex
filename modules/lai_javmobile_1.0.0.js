// JavMobile for REX (lai_javmobile v1.0.0, 移植自 mira-cat 蜘蛛 py_javmobile)
// 后端：https://javmobile.net/（WordPress JAV 站，无反爬），HTML 正则解析。
// 列表：/{分类}/[/page/N/]；搜索：/?s={kw}；详情页内联 var SOURCES 取播放源：
//   Server1 upload18.org 播放页 window.PLAYER_CONFIG.m3u8（helvid.com 直链，
//   必须用手机 UA 取，helvid 的 token 按设备签发 d=apple）；
//   Server2 audinifer.com 解 pack 混淆 JS 取 m3u8（兜底）。
// 与猫源差异：猫源用本地代理改写 helvid 的 m3u8（修正 MEDIA-SEQUENCE 等），
// REX 无服务端，此处直出原始 m3u8 + customHeaders（手机 UA + upload18 Referer）。

WidgetMetadata = {
  id: "lai_javmobile",
  title: "JavMobile",
  description: "JavMobile（javmobile.net）：最新/有码/无码/破解无码/国产/素人/英字/女优，播放为 helvid 直链 m3u8",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://javmobile.net",
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
      title: "最新",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "latest" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "分类",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "分类",
          type: "enumeration",
          value: "censored",
          enumOptions: [
            { title: "有码", value: "censored" },
            { title: "无码", value: "uncensored" },
            { title: "破解无码", value: "uncensored-leaked" },
            { title: "国产", value: "chinese-av" },
            { title: "素人", value: "amateur" },
            { title: "英字", value: "english-subtitle" },
            { title: "女优", value: "actresses" },
            { title: "最新", value: "latest" }
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

var BASE = "https://javmobile.net";
var SITE = BASE;
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = BASE + "/";

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
    .replace(/&#8217;/g, "'")
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
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  var body = res && res.data != null ? String(res.data) : "";
  return body;
}

// 解析列表卡片: article.loop-post > a[href] > h2.entry-title + img[src]
function parseCards(html) {
  var out = [];
  var seen = {};
  var re = /<article\s[^>]*class="[^"]*loop-post[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var card = m[1];
    var am = card.match(/<a\s[^>]*href="(https?:\/\/javmobile\.net\/[^"]+\/)"/);
    if (!am) continue;
    var durl = am[1];
    if (seen[durl]) continue;
    seen[durl] = true;
    var title = "";
    var tm = card.match(/<h2[^>]*class="entry-title"[^>]*>([\s\S]*?)<\/h2>/);
    if (tm) title = clean(tm[1]);
    var pic = "";
    var im = card.match(/<img[^>]+src="([^"]+)"/);
    if (im) pic = fixUrl(im[1]);
    if (!title) {
      var parts = durl.split("/").filter(Boolean);
      title = parts[parts.length - 1] || durl;
    }
    out.push({
      id: durl,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: durl,
      description: "",
      mediaType: "movie"
    });
  }
  return out;
}

function catUrl(tid, page) {
  var base;
  if (tid === "latest" || !tid) base = SITE + "/";
  else base = SITE + "/" + tid + "/";
  if (page > 1) base += "page/" + page + "/";
  return base;
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
  var url;
  if (page > 1) url = SITE + "/page/" + page + "/?s=" + encodeURIComponent(wd);
  else url = SITE + "/?s=" + encodeURIComponent(wd);
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

// 从详情页提取 SOURCES 数组
function extractSources(html) {
  var m = html.match(/var\s+SOURCES\s*=\s*\[(.*?)\];/s);
  if (!m) return [];
  var urls = [];
  var re = /"(https?:\\?\/\\?\/[^"]+)"/g;
  var x;
  while ((x = re.exec(m[1])) !== null) {
    urls.push(x[1].replace(/\\\//g, "/"));
  }
  return urls;
}

// Server1: upload18 播放页 -> window.PLAYER_CONFIG.m3u8 (带1次重试, 站方偶发 chunked 截断)
// 必须用手机 UA 请求，helvid 按 UA 签发 token (d=apple)
async function resolveUpload18(embedUrl) {
  for (var attempt = 0; attempt < 2; attempt++) {
    var html = "";
    try { html = await fetchText(embedUrl, REFERER); } catch (e) { /* 重试 */ }
    if (!html || html.indexOf("window.PLAYER_CONFIG") < 0) continue;
    var m = html.match(/window\.PLAYER_CONFIG\s*=\s*(\{.*?\});/s);
    if (!m) continue;
    try {
      var cfg = JSON.parse(m[1]);
      var url = t(cfg.m3u8).replace(/\\\//g, "/");
      if (/^https?:\/\/[^/]*helvid\.com\/m\//.test(url)) return url;
      if (/^https?:\/\//.test(url) && url.indexOf(".m3u8") >= 0) return url;
    } catch (e) { /* ignore */ }
  }
  return "";
}

// Server2: audinifer embed 页 -> 解 pack 混淆 JS 取 m3u8
// 站方 packer 用单引号包裹 payload: }('PAYLOAD',36,497,'SYMTAB'.split('|')))
function unpackAudinifer(html) {
  var m = html.match(/eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?\}\('((?:[^'\\]|\\.)*)',(\d+),(\d+),'((?:[^'\\]|\\.)*)'\.split\('\|'\)\)/);
  if (!m) return "";
  var p = m[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  var a = parseInt(m[2], 10);
  var c = parseInt(m[3], 10);
  var k = m[4].split("|");
  var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  function tok(n) {
    var s = "";
    while (n > 0) { s = chars[n % a] + s; n = Math.floor(n / a); }
    return s || "0";
  }
  for (var i = c - 1; i >= 0; i--) {
    if (k[i]) {
      var re = new RegExp("\\b" + tok(i) + "\\b", "g");
      p = p.replace(re, k[i]);
    }
  }
  var um = p.match(/https?:\/\/[^\s"']+\.m3u8[^\s"']*/);
  return um ? um[0] : "";
}

async function resolveAudinifer(embedUrl) {
  var html = "";
  try { html = await fetchText(embedUrl, REFERER); } catch (e) { /* ignore */ }
  if (!html) return "";
  return unpackAudinifer(html);
}

// 解析播放地址 (实时解析, token 时效约 30 分钟)
// 返回 { url, referer }: helvid 会 403 掉 Referer 为 javmobile.net 的请求,
// 必须用取源的 embed 页 (upload18.org) 作 Referer
async function resolvePlay(durl, htmlIn) {
  var html = htmlIn || await fetchText(durl);
  if (!html) return { url: "", referer: "" };
  var sources = extractSources(html);
  var i, s;
  // 优先 Server1 (upload18, 直链 m3u8)
  for (i = 0; i < sources.length; i++) {
    s = sources[i];
    if (/upload18\.org/i.test(s)) {
      var m3u8 = await resolveUpload18(s);
      if (m3u8) return { url: m3u8, referer: s };
    }
  }
  // 兜底 Server2 (audinifer, 解混淆)
  for (i = 0; i < sources.length; i++) {
    s = sources[i];
    if (/audinifer\.com/i.test(s)) {
      var m2 = await resolveAudinifer(s);
      if (m2) return { url: m2, referer: s };
    }
  }
  return { url: "", referer: "" };
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
    var name = "";
    var tm = html.match(/<h1 class="title">([\s\S]*?)<\/h1>/);
    if (tm) name = clean(tm[1]);
    if (!name) {
      var om = html.match(/<meta property="og:title" content="([^"]+)"/);
      if (om) name = clean(om[1]);
    }
    var parts = durl.split("/").filter(Boolean);
    if (!name) name = parts[parts.length - 1] || "JavMobile";

    var pic = "";
    var pm = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (pm) pic = fixUrl(pm[1]);
    // 兜底: 海报 URL 可由 slug 推导 (upload18.cc/v/{大写SLUG}/poster.jpg, 与列表卡片一致)
    if (!pic || pic.indexOf("cropped-javmobile") >= 0) {
      var slug = parts[parts.length - 1] || "";
      pic = slug ? "https://upload18.cc/v/" + slug.toUpperCase() + "/poster.jpg" : "";
    }

    var desc = "";
    var dm = html.match(/<meta name="description" content="([^"]+)"/);
    if (dm) desc = clean(dm[1]);

    var r = await resolvePlay(durl, html);
    if (!r || !r.url) {
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

    return {
      id: durl,
      type: "detail",
      title: name,
      link: durl,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: desc || name,
      videoUrl: r.url,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": r.referer || REFERER
      }
    };
  } catch (e) {
    return { id: durl, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
