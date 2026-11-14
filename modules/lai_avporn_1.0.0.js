// AVPorn for REX (lai_avporn v1.0.0)
// 移植自 mira-cat 蜘蛛 avporn.js（只读蓝图），Nuxt 3 站，主域名 avporn.co，入口镜像 https://11.bkskfhqdfas.icu。
// 列表走 JSON API；封面必须走站内 /_img?u= 代理（直链回 application/octet-stream）。
// 详情 JSON-LD contentUrl 为带签名 manifest（t=&sign=），点播时现取新鲜地址，详情不存短效地址。
// 短剧：/api/v1/drama/{id} 取集数，/api/v1/drama/{id}/episodes/{n}/play 取签名单集地址，点播时现取。

WidgetMetadata = {
  id: "lai_avporn",
  title: "AVPorn",
  description: "AVPorn：JSON API 列表，日本AV/国产精选/标签筛选，详情签名 manifest 现取，短剧现取单集",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://11.bkskfhqdfas.icu",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "首页最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "热门", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "hot" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "日本AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat" }, { name: "sub", title: "分类", type: "enumeration", value: "cat:1", enumOptions: [{"name": "全部", "value": "cat:1"}, {"name": "无码影片", "value": "cat:3"}, {"name": "中文字幕", "value": "cat:4"}, {"name": "素人", "value": "cat:5"}, {"name": "剧情", "value": "cat:6"}, {"name": "人妻熟女", "value": "cat:7"}, {"name": "制服", "value": "cat:8"}, {"name": "职场OL", "value": "cat:9"}, {"name": "角色扮演", "value": "cat:10"}, {"name": "调教SM", "value": "cat:11"}, {"name": "成人综艺", "value": "cat:12"}, {"name": "魔镜号", "value": "cat:13"}, {"name": "家庭乱伦", "value": "cat:14"}, {"name": "NTR", "value": "cat:31"}, {"name": "多人运动", "value": "cat:42"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "国产精选", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat" }, { name: "sub", title: "分类", type: "enumeration", value: "cat:2", enumOptions: [{"name": "全部", "value": "cat:2"}, {"name": "素人原创", "value": "cat:38"}, {"name": "国产自拍", "value": "cat:35"}, {"name": "探花系列", "value": "cat:40"}, {"name": "麻豆传媒", "value": "cat:46"}, {"name": "糖心vlog", "value": "cat:48"}, {"name": "情侣自拍", "value": "cat:36"}, {"name": "网红主播", "value": "cat:37"}, {"name": "剧情", "value": "cat:39"}, {"name": "偷拍", "value": "cat:41"}, {"name": "蜜桃传媒", "value": "cat:49"}, {"name": "星空传媒", "value": "cat:50"}, {"name": "天美传媒", "value": "cat:51"}, {"name": "香蕉视频", "value": "cat:52"}, {"name": "果冻传媒", "value": "cat:53"}, {"name": "杏吧原版", "value": "cat:54"}, {"name": "精东影业", "value": "cat:55"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "AV解说", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "shortvideo" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "shortdrama" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "标签", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag" }, { name: "sub", title: "标签", type: "enumeration", value: "tag:1", enumOptions: [{"name": "巨乳", "value": "tag:1"}, {"name": "酒店", "value": "tag:116"}, {"name": "中文字幕", "value": "tag:159"}, {"name": "素人", "value": "tag:166"}, {"name": "黑丝", "value": "tag:184"}, {"name": "河北彩花", "value": "tag:263"}, {"name": "口交", "value": "tag:342"}, {"name": "熟女", "value": "tag:22"}, {"name": "苗条", "value": "tag:23"}, {"name": "童颜", "value": "tag:20"}, {"name": "清纯", "value": "tag:348"}, {"name": "御姐", "value": "tag:21"}, {"name": "丰满", "value": "tag:34"}, {"name": "美腿", "value": "tag:29"}, {"name": "性感", "value": "tag:349"}, {"name": "素颜", "value": "tag:350"}, {"name": "人妻", "value": "tag:50"}, {"name": "女教师", "value": "tag:46"}, {"name": "女上司", "value": "tag:72"}, {"name": "护士", "value": "tag:56"}, {"name": "邻居太太", "value": "tag:71"}, {"name": "职场OL", "value": "tag:351"}, {"name": "女仆", "value": "tag:57"}, {"name": "寡妇", "value": "tag:76"}, {"name": "空姐", "value": "tag:58"}, {"name": "深喉", "value": "tag:107"}, {"name": "足交", "value": "tag:109"}, {"name": "骑乘位", "value": "tag:112"}, {"name": "捆绑", "value": "tag:119"}, {"name": "后入", "value": "tag:111"}, {"name": "乳交", "value": "tag:108"}, {"name": "颜射", "value": "tag:104"}, {"name": "内射", "value": "tag:103"}, {"name": "SM调教", "value": "tag:352"}, {"name": "无码", "value": "tag:156"}, {"name": "4K超清", "value": "tag:353"}, {"name": "VR", "value": "tag:163"}, {"name": "经典作品", "value": "tag:354"}, {"name": "新人出道", "value": "tag:355"}, {"name": "剧情长片", "value": "tag:356"}, {"name": "完整版", "value": "tag:181"}, {"name": "独家作品", "value": "tag:357"}, {"name": "破解版", "value": "tag:183"}, {"name": "JK制服", "value": "tag:54"}, {"name": "瑜伽裤", "value": "tag:358"}, {"name": "制服", "value": "tag:53"}, {"name": "和服", "value": "tag:195"}, {"name": "泳装", "value": "tag:197"}, {"name": "旗袍", "value": "tag:359"}, {"name": "高跟鞋", "value": "tag:188"}, {"name": "丝袜", "value": "tag:185"}, {"name": "职业装", "value": "tag:360"}, {"name": "三上悠亚", "value": "tag:262"}, {"name": "石川澪", "value": "tag:271"}, {"name": "枫可怜", "value": "tag:365"}, {"name": "八木奈奈", "value": "tag:366"}, {"name": "葵司", "value": "tag:295"}, {"name": "桃乃木香奈", "value": "tag:272"}, {"name": "天使萌", "value": "tag:274"}, {"name": "相泽南", "value": "tag:276"}, {"name": "明里紬", "value": "tag:267"}, {"name": "办公室", "value": "tag:48"}, {"name": "居家", "value": "tag:361"}, {"name": "温泉", "value": "tag:261"}, {"name": "浴室", "value": "tag:362"}, {"name": "厨房", "value": "tag:240"}, {"name": "户外", "value": "tag:363"}, {"name": "电车", "value": "tag:125"}, {"name": "摄影棚", "value": "tag:364"}, {"name": "学校", "value": "tag:301"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://11.bkskfhqdfas.icu";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  return t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/&#x([0-9a-fA-F]+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 16)); });
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return HOST + "/" + u;
}

// 封面必须走站内图片代理，否则 application/octet-stream。
// JSON-LD 的 thumbnailUrl 本身已是 avporn.co 的 _img 代理地址，须先解开再单层代理，避免双重代理。
function proxyCover(u) {
  if (!u) return "";
  u = absUrl(u);
  var guard = 0;
  while (guard < 3) {
    var m = u.match(/\/_img\?u=([^&]+)/);
    if (!m) break;
    try {
      var inner = decodeURIComponent(m[1]);
      if (inner === u) break;
      u = inner;
      guard++;
    } catch (e) { break; }
  }
  return HOST + "/_img?u=" + encodeURIComponent(u);
}

function getJson(url) {
  return Widget.http.get(url, { headers: { "User-Agent": UA, "Accept": "application/json, text/plain, */*", "Referer": HOST + "/" } })
    .then(function (res) {
      var d = res && res.data;
      if (typeof d === "string") {
        try { return JSON.parse(d); } catch (e) { return null; }
      }
      return d || null;
    })
    .catch(function () { return null; });
}

function getHtml(url) {
  return Widget.http.get(url, { headers: { "User-Agent": UA, "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8", "Referer": HOST + "/" } })
    .then(function (res) {
      var d = res && res.data;
      return d != null ? (typeof d === "string" ? d : JSON.stringify(d)) : "";
    })
    .catch(function () { return ""; });
}

function fmtDur(sec) {
  sec = parseInt(sec, 10) || 0;
  if (!sec) return "";
  var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  function p(n) { return (n < 10 ? "0" : "") + n; }
  return h ? h + ":" + p(m) + ":" + p(s) : p(m) + ":" + p(s);
}

function itemVideo(v) {
  var id = v && v.id != null ? String(v.id) : "";
  if (!id) return null;
  var cover = proxyCover(v.coverUrl || v.cover || "");
  var dur = fmtDur(v.durationSeconds);
  return {
    id: "v:" + id,
    type: "url",
    title: t(v.title) || id,
    posterPath: cover,
    coverUrl: cover,
    backdropPath: cover,
    link: "v:" + id,
    description: dur,
    mediaType: "movie"
  };
}

// JSON 列表 API
function apiList(zone, sub, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  var url = HOST + "/api/v1/video/list?sort=" + (zone === "hot" ? "popular" : "latest") + "&page=" + page + "&size=20";
  if (zone === "cat" || zone === "tag") {
    var id = t(sub || "").replace(/^(cat|tag):/, "");
    if (id) url += (zone === "cat" ? "&categoryIds=" : "&tagIds=") + encodeURIComponent(id);
  }
  return getJson(url).then(function (d) {
    var videos = (d && d.data && d.data.videos) || {};
    var items = videos.items || [];
    var out = [];
    for (var i = 0; i < items.length; i++) {
      var it = itemVideo(items[i]);
      if (it) out.push(it);
    }
    return out;
  });
}

// 搜索页 vcard（2026-11-14 实测现行结构）：
//   <div class="vcard"><a href="/videos/<id>/" class="vcard__link">
//     <div class="vcard__cover"><img style="display:none;">（无 src）
//     <noscript><img src="https://avporn.co/_img?u=...">（真实封面）</noscript>
//     <span class="dur">1:58:56</span></div>
//     <h3 class="vcard__ct">标题</h3></a>...
// 锚点内无嵌套 <a>，直接按 </a> 收尾；封面必须取 noscript 里的 img src。
function parseVcardHtml(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<a[^>]+href=["']\/videos\/(\d+)\/["'][^>]*class=["'][^"']*vcard__link[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var vid = m[1];
    var body = m[2];
    var key = "v:" + vid;
    if (seen[key]) continue;
    seen[key] = 1;
    var tm = body.match(/<h3[^>]*class=["'][^"']*vcard__ct[^"']*["'][^>]*>([^<]{2,300})<\/h3>/i)
      || body.match(/alt=["']([^"']{2,300})["']/i);
    var title = tm ? decodeHtml(tm[1]) : key;
    // noscript 里的 img 才有真实 src；display:none 的主 img 无 src
    var im = body.match(/<noscript><img[^>]+src=["']([^"']+)["']/i)
      || body.match(/<img[^>]+src=["']([^"']+)["']/i);
    var cover = im ? proxyCover(im[1]) : "";
    var dm = body.match(/<span[^>]*class=["'][^"']*dur[^"']*["'][^>]*>([^<]+)<\/span>/i)
      || body.match(/(\d{1,2}:\d{2}:\d{2}|\d{1,2}:\d{2})/);
    out.push({
      id: key,
      type: "url",
      title: title || key,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: key,
      description: dm ? t(dm[1]) : "",
      mediaType: "movie"
    });
  }
  return out;
}

// AV解说页 shorts-card（2026-11-14 实测现行结构）：
//   <a href="/short-video/<id>/" class="shorts-card">
//     <div class="shorts-card__cover"><img style="visibility:hidden;">（无 src）
//     <noscript><img src="https://avporn.co/_img?u=..."></noscript>
//     <span class="shorts-card__dur">28:20</span></div>
//     <div class="shorts-card__title">标题</div></a>
function parseShortsHtml(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<a[^>]+href=["']\/short-video\/(\d+)\/["'][^>]*class=["'][^"']*shorts-card[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var vid = m[1];
    var body = m[2];
    var key = "sv:" + vid;
    if (seen[key]) continue;
    seen[key] = 1;
    var tm = body.match(/<div[^>]*class=["'][^"']*shorts-card__title[^"']*["'][^>]*>([^<]{2,300})<\/div>/i)
      || body.match(/alt=["']([^"']{2,300})["']/i);
    var title = tm ? decodeHtml(tm[1]) : key;
    var im = body.match(/<noscript><img[^>]+src=["']([^"']+)["']/i)
      || body.match(/<img[^>]+src=["']([^"']+)["']/i);
    var cover = im ? proxyCover(im[1]) : "";
    var dm = body.match(/<span[^>]*class=["'][^"']*shorts-card__dur[^"']*["'][^>]*>([^<]+)<\/span>/i);
    out.push({
      id: key,
      type: "url",
      title: title || key,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: key,
      description: dm ? t(dm[1]) : "",
      mediaType: "movie"
    });
  }
  return out;
}

// 短剧页 sd-card（2026-11-14 实测现行结构）：
//   <article class="sd-card"><div class="sd-card__media">
//     <a href="/short-drama/<id>/ep-1/" class="sd-card__art">
//     <noscript><img src="https://avporn.co/_img?u=..."></noscript>
//     <span class="sd-card__score">9.3分</span>
//     <span class="sd-card__episodes">全48集</span></a></div>
//     <div class="sd-card__foot"><a href="/short-drama/<id>/ep-1/" class="sd-card__title">标题</a>
function parseDramaHtml(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<article[^>]*class=["'][^"']*sd-card[^"']*["'][^>]*>([\s\S]*?)<\/article>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var body = m[1];
    var lm = body.match(/<a[^>]+href=["']\/short-drama\/(\d+)\//i);
    if (!lm) continue;
    var key = "sd:" + lm[1];
    if (seen[key]) continue;
    seen[key] = 1;
    var tm = body.match(/<a[^>]+class=["'][^"']*sd-card__title[^"']*["'][^>]*>([^<]{2,300})<\/a>/i)
      || body.match(/alt=["']([^"']{2,300})["']/i);
    var title = tm ? decodeHtml(tm[1]) : key;
    var im = body.match(/<noscript><img[^>]+src=["']([^"']+)["']/i)
      || body.match(/<img[^>]+src=["']([^"']+)["']/i);
    var cover = im ? proxyCover(im[1]) : "";
    var em = body.match(/<span[^>]*class=["'][^"']*sd-card__episodes[^"']*["'][^>]*>([^<]+)<\/span>/i);
    var sm = body.match(/<span[^>]*class=["'][^"']*sd-card__score[^"']*["'][^>]*>([^<]+)<\/span>/i);
    var desc = (em ? t(em[1]) : "") + (sm ? (em ? " " : "") + t(sm[1]) : "");
    out.push({
      id: key,
      type: "url",
      title: title || key,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: key,
      description: desc,
      mediaType: "movie"
    });
  }
  return out;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "home");
  var sub = t(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var list = [];
    if (zone === "shortvideo") {
      var svUrl = HOST + "/short-video/" + (page > 1 ? "?page=" + page : "");
      var svHtml = await getHtml(svUrl);
      list = parseShortsHtml(svHtml);
    } else if (zone === "shortdrama") {
      var sdHtml = await getHtml(HOST + "/short-drama/");
      list = parseDramaHtml(sdHtml);
    } else {
      list = await apiList(zone, sub, page);
    }
    return list.length ? list : emptyItem();
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
    var url = HOST + "/search/?q=" + encodeURIComponent(wd);
    if (page > 1) url += "&page=" + page;
    var html = await getHtml(url);
    var list = parseVcardHtml(html);
    return list.length ? list : emptyItem();
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

// 详情页 JSON-LD：页内有多个块，第一个是 BreadcrumbList（无播放地址），
// VideoObject 在后——必须遍历全部块，取带 contentUrl/name/thumbnailUrl 的那块。
function parseJsonLd(html) {
  var out = [];
  if (!html) return out;
  var re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    try {
      var ld = JSON.parse(m[1]);
      var arr = Array.isArray(ld) ? ld : [ld];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i]) out.push(arr[i]);
      }
    } catch (e) { /* ignore */ }
  }
  return out;
}

// 详情页 JSON-LD contentUrl = 带签名 manifest（现取）
function fetchVideoManifest(vid) {
  return getHtml(HOST + "/videos/" + vid + "/").then(function (html) {
    if (!html) return "";
    var arr = parseJsonLd(html);
    for (var i = 0; i < arr.length; i++) {
      var u = arr[i] && arr[i].contentUrl;
      if (u) return absUrl(u);
    }
    return "";
  });
}

function fetchVideoTitle(vid) {
  return getHtml(HOST + "/videos/" + vid + "/").then(function (html) {
    if (!html) return { title: "", cover: "", desc: "" };
    var out = { title: "", cover: "", desc: "" };
    var arr = parseJsonLd(html);
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] && arr[i].name && !out.title) out.title = decodeHtml(arr[i].name);
      if (arr[i] && arr[i].thumbnailUrl && !out.cover) out.cover = proxyCover(arr[i].thumbnailUrl);
      if (arr[i] && arr[i].description && !out.desc) out.desc = decodeHtml(arr[i].description);
    }
    if (!out.title) {
      var tm = html.match(/<title>([^<]+)<\/title>/i);
      if (tm) out.title = decodeHtml(tm[1]).replace(/\s*[-|–].*$/, "").trim();
    }
    return out;
  });
}

function fetchShortVideoDetail(svid) {
  return getHtml(HOST + "/short-video/" + svid + "/").then(function (html) {
    if (!html) return { title: "", cover: "", desc: "", manifest: "" };
    var out = { title: "", cover: "", desc: "", manifest: "" };
    var arr = parseJsonLd(html);
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] && arr[i].name && !out.title) out.title = decodeHtml(arr[i].name);
      if (arr[i] && arr[i].thumbnailUrl && !out.cover) out.cover = proxyCover(arr[i].thumbnailUrl);
      if (arr[i] && arr[i].description && !out.desc) out.desc = decodeHtml(arr[i].description);
      if (arr[i] && arr[i].contentUrl && !out.manifest) out.manifest = absUrl(arr[i].contentUrl);
    }
    if (!out.title) {
      var tm = html.match(/<title>([^<]+)<\/title>/i);
      if (tm) out.title = decodeHtml(tm[1]).replace(/\s*[-|–].*$/, "").trim();
    }
    return out;
  });
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var m;
    // 短剧：/api/v1/drama/{id} 取集数
    if ((m = raw.match(/^sd:(\d+)$/))) {
      var did = m[1];
      var d = await getJson(HOST + "/api/v1/drama/" + did);
      var info = (d && d.data) || {};
      var title = t(info.title) || ("短剧 " + did);
      var cover = proxyCover(info.coverUrl || info.cover || "");
      var eps = [];
      var epItems = [];
      var seasonEps = [];
      var total = parseInt(info.totalEpisodes, 10) || 0;
      var list = info.episodes || [];
      var count = total || list.length;
      for (var i = 0; i < count; i++) {
        var n = i + 1;
        var ep = info.episodes && info.episodes[i];
        var epTitle = ep && ep.title ? t(ep.title) : ("第" + n + "集");
        var token = "@@DRAMA:" + did + ":" + n;
        var id = raw + token;
        eps.push({ name: epTitle, link: id });
        seasonEps.push({ title: epTitle, videoUrl: "", episodeNumber: n });
        epItems.push({
          id: id,
          type: "url",
          title: epTitle,
          mediaType: "movie",
          posterPath: cover,
          link: id,
          episode: n,
          episodeNumber: n,
          seasonIndex: 1,
          seasonNumber: 1,
          playerType: "system"
        });
      }
      var result = {
        id: raw,
        type: "detail",
        title: title,
        name: title,
        description: t(info.description) || "",
        mediaType: "movie",
        link: raw,
        coverUrl: cover,
        posterPath: cover,
        backdropPath: cover,
        playerType: "app"
      };
      if (eps.length) {
        result.episodes = eps;
        result.seasons = [{ seasonNumber: 1, title: "短剧", name: "短剧", episodes: seasonEps }];
        result.episodeItems = epItems;
        result.childItems = epItems;
      }
      return result;
    }
    // AV解说：详情 JSON-LD contentUrl 为签名单集 manifest（现取）
    if ((m = raw.match(/^sv:(\d+)$/))) {
      var svid = m[1];
      var sv = await fetchShortVideoDetail(svid);
      var result2 = {
        id: raw,
        type: "detail",
        title: sv.title || ("AV解说 " + svid),
        name: sv.title || ("AV解说 " + svid),
        description: sv.desc,
        mediaType: "movie",
        link: raw,
        coverUrl: sv.cover,
        posterPath: sv.cover,
        backdropPath: sv.cover,
        playerType: "app"
      };
      if (sv.manifest) {
        var id2 = raw + "@@SV:" + svid;
        result2.episodes = [{ name: "播放", link: id2 }];
        result2.seasons = [{ seasonNumber: 1, title: "播放", name: "播放", episodes: [{ title: "播放", videoUrl: sv.manifest, episodeNumber: 1 }] }];
        result2.episodeItems = [{
          id: id2,
          type: "url",
          title: "播放",
          mediaType: "movie",
          posterPath: sv.cover,
          videoUrl: sv.manifest,
          link: id2,
          episode: 1,
          episodeNumber: 1,
          seasonIndex: 1,
          seasonNumber: 1,
          playerType: "system"
        }];
        result2.childItems = result2.episodeItems;
        result2.videoUrl = sv.manifest;
      }
      return result2;
    }
    // 普通视频：详情只出一条“播放”懒解析线，loadResource 现取签名 manifest
    if ((m = raw.match(/^v:(\d+)$/))) {
      var vid = m[1];
      var vt = await fetchVideoTitle(vid);
      var id3 = raw + "@@V:" + vid;
      var result3 = {
        id: raw,
        type: "detail",
        title: vt.title || ("视频 " + vid),
        name: vt.title || ("视频 " + vid),
        description: vt.desc,
        mediaType: "movie",
        link: raw,
        coverUrl: vt.cover,
        posterPath: vt.cover,
        backdropPath: vt.cover,
        playerType: "app",
        episodes: [{ name: "播放", link: id3 }],
        seasons: [{ seasonNumber: 1, title: "播放", name: "播放", episodes: [{ title: "播放", videoUrl: "", episodeNumber: 1 }] }],
        episodeItems: [{
          id: id3,
          type: "url",
          title: "播放",
          mediaType: "movie",
          posterPath: vt.cover,
          link: id3,
          episode: 1,
          episodeNumber: 1,
          seasonIndex: 1,
          seasonNumber: 1,
          playerType: "system"
        }]
      };
      result3.childItems = result3.episodeItems;
      return result3;
    }
    return { id: raw, type: "url", title: "未知链接", description: raw };
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  var m;
  // 普通视频：现取详情页 JSON-LD 签名 manifest
  if ((m = raw.match(/@@V:(\d+)/))) {
    var manifest = await fetchVideoManifest(m[1]);
    if (manifest) return [{ name: "播放", url: manifest, playerType: "system" }];
    return [];
  }
  // AV解说：现取详情页 JSON-LD 签名 manifest
  if ((m = raw.match(/@@SV:(\d+)/))) {
    var sv = await fetchShortVideoDetail(m[1]);
    if (sv.manifest) return [{ name: "播放", url: sv.manifest, playerType: "system" }];
    return [];
  }
  // 短剧：现取 /api/v1/drama/{id}/episodes/{n}/play
  if ((m = raw.match(/@@DRAMA:(\d+):(\d+)/))) {
    var d = await getJson(HOST + "/api/v1/drama/" + m[1] + "/episodes/" + m[2] + "/play");
    var pd = (d && d.data) || d || {};
    var url = pd.playUrl || pd.url || pd.manifestUrl || "";
    if (url) return [{ name: "第" + m[2] + "集", url: absUrl(url), playerType: "system" }];
    return [];
  }
  // 直链 manifest
  if (/\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system" }];
  }
  return [];
}
