// X红颜 for REX (lai_xhongyan v1.0.0)
// 来源蓝图: mira-cat 蜘蛛 py_xhongyan (只读移植)
// 后端: https://xhongyan.com (MacCMS 站, 无 VIP)
// 列表: label 最新/热门 + type 1~4 分类, 卡片正则解析 (含 hot 页 background-image 封面兜底)
// 详情: 详情页解析标题/封面/线路 sid; 播放页 var player_data 取站方自托管签名 mp4,
//       主站地址先 302 跳 CDN 子域名, 模块内用 Range 探针跟一次跳转拿直链 (失败回退原地址)

WidgetMetadata = {
  id: "lai_xhongyan",
  title: "X红颜",
  description: "X红颜（xhongyan.com）：最新更新、热门推荐、onlyfans、网黄、品牌、业余，站内搜索",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://xhongyan.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "首页推荐",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "home" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "最新更新",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "new" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "热门推荐",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "hot" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "分类",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "cat",
          title: "分类",
          type: "enumeration",
          value: "1",
          enumOptions: [
            { title: "onlyfans", value: "1" },
            { title: "网黄", value: "2" },
            { title: "品牌", value: "3" },
            { title: "业余", value: "4" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "搜索",
      functionName: "search",
      cacheDuration: 60,
      params: [
        { name: "keyword", title: "关键词", type: "input", value: "" },
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

var SITE = "https://xhongyan.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = SITE + "/";

var CATS = [
  { type_id: "new", type_name: "最新更新", kind: "label", slug: "new" },
  { type_id: "hot", type_name: "热门推荐", kind: "label", slug: "hot" },
  { type_id: "1", type_name: "onlyfans", kind: "type" },
  { type_id: "2", type_name: "网黄", kind: "type" },
  { type_id: "3", type_name: "品牌", kind: "type" },
  { type_id: "4", type_name: "业余", kind: "type" }
];

function t(v) {
  return String(v == null ? "" : v).trim();
}

function clean(s) {
  return t(s).replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ");
}

function fixUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  return SITE + (u.charAt(0) === "/" ? u : "/" + u);
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
  var res = await Widget.http.get(url, { headers: pageHeaders(referer), timeout: 20000 });
  var body = res && res.data != null ? String(res.data) : "";
  return body;
}

// 解析列表卡片 (首页/分类/搜索通用, 与蜘蛛 parseCards 同逻辑)
function parseCards(html) {
  var out = [];
  var seen = {};
  var re = /<a\s[^>]*href="(?:https?:\/\/xhongyan\.com)?\/index\.php\/vod\/play\/id\/(\d+)\/sid\/\d+\/nid\/1\.html"[^>]*>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var id = m[1];
    if (seen[id]) continue;
    seen[id] = 1;
    var win = html.slice(m.index, m.index + 1800);
    var pic = "";
    var dsM = win.match(/data-src="([^"]+)"/);
    if (dsM) pic = fixUrl(dsM[1]);
    if (!pic) {
      var srcM = win.match(/<img[^>]+src="(\/upload\/[^"]+)"/);
      if (srcM) pic = fixUrl(srcM[1]);
    }
    if (!pic) {
      // hot 页卡片无 img, 封面在 videoBox-cover 的 background-image 里 (URL 被 &quot; 包裹)
      var bgM = win.match(/background-image:\s*url\((?:&quot;|"|')?([^&"')]+)(?:&quot;|"|')?\)/);
      if (bgM) pic = fixUrl(bgM[1]);
    }
    var title = "";
    var altM = win.match(/<img[^>]+alt="([^"]*)"/);
    if (altM) title = clean(altM[1]);
    if (!title) {
      var ttM = win.match(/<span class="title">([^<]+)<\/span>/);
      if (ttM) title = clean(ttM[1]);
    }
    var remarks = "";
    var tm = win.match(/videoBox-time"[^>]*>([^<]+)</);
    if (tm) remarks = clean(tm[1]);
    var link = SITE + "/index.php/vod/detail/id/" + id + ".html";
    out.push({
      id: link,
      type: "url",
      title: title || id,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: remarks || "",
      mediaType: "movie"
    });
  }
  return out;
}

function catOf(tid) {
  for (var i = 0; i < CATS.length; i++) {
    if (CATS[i].type_id === String(tid)) return CATS[i];
  }
  return CATS[0];
}

function catUrl(cat, page) {
  page = Math.max(1, page || 1);
  if (cat.kind === "label") {
    return page > 1 ? SITE + "/index.php/label/" + cat.slug + "/page/" + page + ".html" : SITE + "/index.php/label/" + cat.slug + ".html";
  }
  return page > 1 ? SITE + "/index.php/vod/type/id/" + cat.type_id + "/page/" + page + ".html" : SITE + "/index.php/vod/type/id/" + cat.type_id + ".html";
}

async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var cat = String(params.cat == null ? "new" : params.cat);
  try {
    if (cat === "home") {
      if (page > 1) return [];
      var homeHtml = await fetchText(SITE + "/");
      if (!homeHtml) return [{ id: "err", type: "url", title: "载入失败: 页面为空" }];
      return parseCards(homeHtml).slice(0, 30);
    }
    var c = catOf(cat);
    // 热门推荐站方无分页, 第 2 页起返回空, 避免重复内容
    if (c.kind === "label" && c.slug === "hot" && page > 1) return [];
    var html = await fetchText(catUrl(c, page));
    if (!html) return [{ id: "err", type: "url", title: "载入失败: 页面为空" }];
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg }];
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
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var enc = encodeURIComponent(wd);
  var url = page > 1 ? SITE + "/index.php/vod/search/page/" + page + "/wd/" + enc + ".html" : SITE + "/index.php/vod/search/wd/" + enc + ".html";
  try {
    var html = await fetchText(url);
    if (!html) return [{ id: "err", type: "url", title: "载入失败: 页面为空" }];
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg }];
  }
}

// 纯 JS base64 -> utf8 字符串 (MacCMS encrypt=2 用; 沙箱不保证有 Buffer/atob)
function b64DecodeUtf8(s) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = String(s || "").replace(/=+$/, "");
  var bytes = [];
  var bits = 0, val = 0;
  for (var i = 0; i < str.length; i++) {
    var idx = chars.indexOf(str.charAt(i));
    if (idx < 0) continue;
    val = (val << 6) | idx;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((val >> bits) & 0xff);
    }
  }
  var out = "";
  for (var j = 0; j < bytes.length; j++) {
    var b = bytes[j];
    if (b < 0x80) { out += String.fromCharCode(b); continue; }
    if (b >= 0xc0 && b < 0xe0 && j + 1 < bytes.length) {
      out += String.fromCharCode(((b & 0x1f) << 6) | (bytes[j + 1] & 0x3f));
      j += 1; continue;
    }
    if (b >= 0xe0 && b < 0xf0 && j + 2 < bytes.length) {
      out += String.fromCharCode(((b & 0x0f) << 12) | ((bytes[j + 1] & 0x3f) << 6) | (bytes[j + 2] & 0x3f));
      j += 2; continue;
    }
    out += String.fromCharCode(b);
  }
  return out;
}

// MacCMS 的 unescape 语义 (%XX / %uXXXX), 优先用全局 unescape
function unescapeJs(s) {
  if (typeof unescape === "function") return unescape(s);
  return String(s || "").replace(/%u([0-9a-fA-F]{4})/g, function (_, h) {
    return String.fromCharCode(parseInt(h, 16));
  }).replace(/%([0-9a-fA-F]{2})/g, function (_, h) {
    return String.fromCharCode(parseInt(h, 16));
  });
}

// 跟一次 302: 用 Range 探针请求, 运行时若暴露 Location 就用直链, 否则回退原地址
async function followOnce(url, referer) {
  try {
    var headers = pageHeaders(referer);
    headers["Range"] = "bytes=0-0";
    var res = await Widget.http.get(url, { headers: headers, timeout: 15000 });
    if (!res) return url;
    var status = typeof res.status === "number" ? res.status : (typeof res.statusCode === "number" ? res.statusCode : 0);
    var hdrs = res.headers || {};
    var loc = hdrs.location || hdrs.Location || "";
    if (status >= 300 && status < 400 && loc) return fixUrl(loc);
    var finalUrl = res.url || res.finalUrl || res.responseURL || "";
    if (finalUrl && finalUrl !== url) return finalUrl;
    return url;
  } catch (e) {
    return url;
  }
}

// 解析单个播放页 -> mp4 直链 (失败返回 "")
async function resolvePlayPage(purl) {
  var html = await fetchText(purl, SITE + "/");
  if (!html) return "";
  var dm = html.match(/var\s+player_data\s*=\s*(\{[\s\S]*?\})\s*<\/script>/) || html.match(/var\s+player_data\s*=\s*(\{[^{}]*\})/);
  if (!dm) return "";
  var pd = null;
  try { pd = JSON.parse(dm[1]); } catch (e) { return ""; }
  if (!pd || !pd.url) return "";
  var raw = String(pd.url);
  var enc = parseInt(pd.encrypt, 10) || 0;
  try {
    if (enc === 1) raw = unescapeJs(raw);
    else if (enc === 2) raw = unescapeJs(b64DecodeUtf8(raw));
  } catch (e) { /* 用原始 url */ }
  if (!raw) return "";
  var abs = fixUrl(raw);
  return await followOnce(abs, purl);
}

async function loadDetail(link) {
  var durl = String(link || "");
  try {
    var idm = durl.match(/id\/(\d+)/) || durl.match(/^(\d+)$/);
    if (!idm) return { id: durl, type: "url", title: "参数错误", description: "无法识别的链接" };
    var id = idm[1];
    var realDetail = SITE + "/index.php/vod/detail/id/" + id + ".html";
    var html = await fetchText(realDetail);
    if (!html) return { id: durl, type: "url", title: "载入失败", description: "详情页为空" };

    var name = "";
    var h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    if (h1) name = clean(h1[1]);
    var pic = "";
    var pm = html.match(/detail-pic[^>]*>[\s\S]{0,200}?<img[^>]+src="([^"]+)"/);
    if (pm) pic = fixUrl(pm[1]);
    if (!pic) {
      var og = html.match(/property="og:image"\s+content="([^"]+)"/);
      if (og) pic = fixUrl(og[1]);
    }

    // 播放源 sid 列表 (详情页 play 链接), 按 sid 顺序逐条尝试, 首条成功即主线
    var sidSeen = {};
    var sids = [];
    var sre = new RegExp("/vod/play/id/" + id + "/sid/(\\d+)/nid/1\\.html", "g");
    var sm;
    while ((sm = sre.exec(html)) !== null) {
      if (!sidSeen[sm[1]]) { sidSeen[sm[1]] = 1; sids.push(sm[1]); }
    }
    sids.sort();
    if (!sids.length) sids = ["1"];

    var videoUrl = "";
    var playPage = "";
    for (var i = 0; i < sids.length; i++) {
      var purl = SITE + "/index.php/vod/play/id/" + id + "/sid/" + sids[i] + "/nid/1.html";
      var got = await resolvePlayPage(purl);
      if (got) { videoUrl = got; playPage = purl; break; }
    }
    if (!videoUrl) {
      return { id: realDetail, type: "url", title: name || id, description: "未找到播放地址" };
    }
    return {
      id: realDetail,
      type: "detail",
      title: name || id,
      link: realDetail,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: name || "",
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": playPage || REFERER
      }
    };
  } catch (e) {
    return { id: durl, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// built by REX porter (lai_xhongyan)
