// AVPorn for REX (lai_avporn2 v1.0.2) — 详情直交签名地址
// v1.0.2（2026-11-21）：补顶层 search 键（A 键，照 64 个可见模块的众数形状）；B 条目与 search 函数一个字未动。
// v1.0.1（2026-11-15）：修真机“解析错误”——1.0.0 详情只给懒解析记号（无 videoUrl），
//   点播时 loadResource 在手机上现取详情页失败就回 []，播放器空播（用户截图坐实：
//   详情卡片写“按需解析”、播放器空白）。改：详情时就把签名 manifest 直接写进
//   episodeItem 的 videoUrl（system），顶层 videoUrl 同设；详情页在 loadDetail 里
//   本来就能取到（标题/简介/封面在手机上都正常渲染），同一地址点播时现取反而失败，
//   所以详情时交地址是最稳的腿。loadResource 只作回落：全程 try/catch 永不抛错，
//   现取失败时回详情时缓存的地址，绝不回 []（除非从未解析出过地址）。
// 站点：Nuxt 3 JSON API 站，入口 https://11.bkskfhqdfas.icu（主域 avporn.co）。
// 列表走 /api/v1/video/list；封面走站内 /_img?u= 代理（直链回 application/octet-stream）。
// 详情页 JSON-LD VideoObject 的 contentUrl 是带签名 manifest，点播时现取现播，不缓存签名地址。
// 短剧走 /api/v1/drama/{id} 取集数，/episodes/{n}/play 现取单集地址。
// 单档，不编造清晰度。卡片编号 mv-/cm-/dr-，点播 token 用 @@play / @@ep-N。

WidgetMetadata = {
  id: "lai_avporn2",
  title: "AVPorn",
  description: "AVPorn：JSON API 列表（首页最新/热门/日本AV/国产精选/标签），AV解说与短剧，详情签名 manifest 现取现播，短剧按集现取单集地址",
  author: "lai",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  site: "https://11.bkskfhqdfas.icu",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "首页最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "热门", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "popular" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "日本AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "jp" }, { name: "sub", title: "分类", type: "enumeration", value: "1", enumOptions: [{"title": "全部", "value": "1"}, {"title": "无码影片", "value": "3"}, {"title": "中文字幕", "value": "4"}, {"title": "素人", "value": "5"}, {"title": "剧情", "value": "6"}, {"title": "人妻熟女", "value": "7"}, {"title": "制服", "value": "8"}, {"title": "职场OL", "value": "9"}, {"title": "角色扮演", "value": "10"}, {"title": "调教SM", "value": "11"}, {"title": "成人综艺", "value": "12"}, {"title": "魔镜号", "value": "13"}, {"title": "家庭乱伦", "value": "14"}, {"title": "NTR", "value": "31"}, {"title": "多人运动", "value": "42"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "国产精选", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cn" }, { name: "sub", title: "分类", type: "enumeration", value: "2", enumOptions: [{"title": "全部", "value": "2"}, {"title": "素人原创", "value": "38"}, {"title": "国产自拍", "value": "35"}, {"title": "探花系列", "value": "40"}, {"title": "麻豆传媒", "value": "46"}, {"title": "糖心vlog", "value": "48"}, {"title": "情侣自拍", "value": "36"}, {"title": "网红主播", "value": "37"}, {"title": "剧情", "value": "39"}, {"title": "偷拍", "value": "41"}, {"title": "蜜桃传媒", "value": "49"}, {"title": "星空传媒", "value": "50"}, {"title": "天美传媒", "value": "51"}, {"title": "香蕉视频", "value": "52"}, {"title": "果冻传媒", "value": "53"}, {"title": "杏吧原版", "value": "54"}, {"title": "精东影业", "value": "55"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "AV解说", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "commentary" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "drama" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "标签", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tags" }, { name: "sub", title: "标签", type: "enumeration", value: "1", enumOptions: [{"title": "巨乳", "value": "1"}, {"title": "酒店", "value": "116"}, {"title": "中文字幕", "value": "159"}, {"title": "素人", "value": "166"}, {"title": "黑丝", "value": "184"}, {"title": "河北彩花", "value": "263"}, {"title": "口交", "value": "342"}, {"title": "熟女", "value": "22"}, {"title": "苗条", "value": "23"}, {"title": "童颜", "value": "20"}, {"title": "清纯", "value": "348"}, {"title": "御姐", "value": "21"}, {"title": "丰满", "value": "34"}, {"title": "美腿", "value": "29"}, {"title": "性感", "value": "349"}, {"title": "素颜", "value": "350"}, {"title": "人妻", "value": "50"}, {"title": "女教师", "value": "46"}, {"title": "女上司", "value": "72"}, {"title": "护士", "value": "56"}, {"title": "邻居太太", "value": "71"}, {"title": "职场OL", "value": "351"}, {"title": "女仆", "value": "57"}, {"title": "寡妇", "value": "76"}, {"title": "空姐", "value": "58"}, {"title": "深喉", "value": "107"}, {"title": "足交", "value": "109"}, {"title": "骑乘位", "value": "112"}, {"title": "捆绑", "value": "119"}, {"title": "后入", "value": "111"}, {"title": "乳交", "value": "108"}, {"title": "颜射", "value": "104"}, {"title": "内射", "value": "103"}, {"title": "SM调教", "value": "352"}, {"title": "无码", "value": "156"}, {"title": "4K超清", "value": "353"}, {"title": "VR", "value": "163"}, {"title": "经典作品", "value": "354"}, {"title": "新人出道", "value": "355"}, {"title": "剧情长片", "value": "356"}, {"title": "完整版", "value": "181"}, {"title": "独家作品", "value": "357"}, {"title": "破解版", "value": "183"}, {"title": "JK制服", "value": "54"}, {"title": "瑜伽裤", "value": "358"}, {"title": "制服", "value": "53"}, {"title": "和服", "value": "195"}, {"title": "泳装", "value": "197"}, {"title": "旗袍", "value": "359"}, {"title": "高跟鞋", "value": "188"}, {"title": "丝袜", "value": "185"}, {"title": "职业装", "value": "360"}, {"title": "三上悠亚", "value": "262"}, {"title": "石川澪", "value": "271"}, {"title": "枫可怜", "value": "365"}, {"title": "八木奈奈", "value": "366"}, {"title": "葵司", "value": "295"}, {"title": "桃乃木香奈", "value": "272"}, {"title": "天使萌", "value": "274"}, {"title": "相泽南", "value": "276"}, {"title": "明里紬", "value": "267"}, {"title": "办公室", "value": "48"}, {"title": "居家", "value": "361"}, {"title": "温泉", "value": "261"}, {"title": "浴室", "value": "362"}, {"title": "厨房", "value": "240"}, {"title": "户外", "value": "363"}, {"title": "电车", "value": "125"}, {"title": "摄影棚", "value": "364"}, {"title": "学校", "value": "301"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
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

var SITE = "https://11.bkskfhqdfas.icu";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

// 详情时解析出的签名地址缓存（loadResource 现取失败时的回落行；只存内存，不落盘）。
var MANIFEST_CACHE = {};
function cacheManifest(id, url) {
  try { if (id && url) MANIFEST_CACHE[id] = { url: url, ts: Date.now() }; } catch (e) {}
}
function cachedManifest(id) {
  try {
    var e = MANIFEST_CACHE[id];
    return e ? e.url : "";
  } catch (e2) { return ""; }
}

function txt(v) {
  return String(v == null ? "" : v).trim();
}

function unescape(s) {
  var out = txt(s);
  out = out.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  out = out.replace(/&#(\d+);/g, function (all, num) { return String.fromCharCode(parseInt(num, 10)); });
  out = out.replace(/&#x([0-9a-fA-F]+);/g, function (all, num) { return String.fromCharCode(parseInt(num, 16)); });
  return out;
}

function fullUrl(u) {
  u = txt(u);
  if (!u) return "";
  if (u.indexOf("http://") === 0 || u.indexOf("https://") === 0) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return SITE + u;
  return SITE + "/" + u;
}

// 封面走站内图片代理：先把多层 /_img?u= 剥到最里层，再单层代理，避免双重代理。
function imgProxy(u) {
  var cur = fullUrl(u);
  if (!cur) return "";
  var guard = 0;
  while (guard < 3) {
    var pos = cur.indexOf("/_img?u=");
    if (pos < 0) break;
    var inner = cur.slice(pos + 8);
    var amp = inner.indexOf("&");
    if (amp >= 0) inner = inner.slice(0, amp);
    try { inner = decodeURIComponent(inner); } catch (e) { break; }
    if (inner === cur) break;
    cur = inner;
    guard++;
  }
  return SITE + "/_img?u=" + encodeURIComponent(cur);
}

function fetchJson(url) {
  return Widget.http.get(url, { headers: { "User-Agent": UA, "Accept": "application/json, text/plain, */*", "Referer": SITE + "/" } }).then(function (res) {
    var d = res && res.data;
    if (typeof d === "string") {
      if (!d) return null;
      try { return JSON.parse(d); } catch (e) { return null; }
    }
    return d || null;
  }).catch(function () { return null; });
}

function fetchPage(url) {
  return Widget.http.get(url, { headers: { "User-Agent": UA, "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8", "Referer": SITE + "/" } }).then(function (res) {
    var d = res && res.data;
    if (d == null) return "";
    return typeof d === "string" ? d : JSON.stringify(d);
  }).catch(function () { return ""; });
}

function durText(sec) {
  var total = parseInt(sec, 10) || 0;
  if (total <= 0) return "";
  var h = Math.floor(total / 3600);
  var m = Math.floor((total % 3600) / 60);
  var s = total % 60;
  var mm = m < 10 ? "0" + m : "" + m;
  var ss = s < 10 ? "0" + s : "" + s;
  if (h > 0) return h + ":" + mm + ":" + ss;
  return m + ":" + ss;
}

function videoCard(v) {
  if (!v || v.id == null) return null;
  var id = String(v.id);
  var cover = imgProxy(v.coverUrl || v.cover || "");
  return {
    id: "mv-" + id,
    type: "url",
    title: unescape(v.title) || ("视频 " + id),
    posterPath: cover,
    coverUrl: cover,
    backdropPath: cover,
    link: "mv-" + id,
    description: durText(v.durationSeconds),
    mediaType: "movie"
  };
}

function videoApi(zone, sub, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  var sort = zone === "popular" ? "popular" : "latest";
  var url = SITE + "/api/v1/video/list?sort=" + sort + "&page=" + page + "&size=20";
  if (zone === "jp" || zone === "cn") {
    var cid = txt(sub).replace(/[^0-9]/g, "");
    if (cid) url += "&categoryIds=" + cid;
  } else if (zone === "tags") {
    var tid = txt(sub).replace(/[^0-9]/g, "");
    if (tid) url += "&tagIds=" + tid;
  }
  return fetchJson(url).then(function (d) {
    var videos = (d && d.data && d.data.videos) || {};
    var items = videos.items || [];
    var out = [];
    for (var i = 0; i < items.length; i++) {
      var card = videoCard(items[i]);
      if (card) out.push(card);
    }
    return out;
  });
}

// 搜索页：锚点 href="/videos/<id>/" 的块；标题取 h3 或 alt；封面取 noscript 里的 img src；时长取含冒号的 span。
function scanSearch(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<a[^>]*href="\/videos\/(\d+)\/"[^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var vid = m[1];
    var body = m[2];
    var key = "mv-" + vid;
    if (seen[key]) continue;
    seen[key] = 1;
    var tm = body.match(/<h3[^>]*>([^<]{2,300})<\/h3>/i) || body.match(/alt="([^"]{2,300})"/i);
    var title = tm ? unescape(tm[1]) : key;
    var im = body.match(/<noscript><img[^>]+src="([^"]+)"/i) || body.match(/<img[^>]+src="([^"]+)"/i);
    var cover = im ? imgProxy(im[1]) : "";
    var dm = body.match(/<span[^>]*>([^<]*\d{1,2}:\d{2}(?::\d{2})?[^<]*)<\/span>/i);
    out.push({
      id: key,
      type: "url",
      title: title || key,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: key,
      description: dm ? txt(dm[1]) : "",
      mediaType: "movie"
    });
  }
  return out;
}

// AV解说页：锚点 href="/short-video/<id>/" 的块。
function scanShorts(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<a[^>]*href="\/short-video\/(\d+)\/"[^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var vid = m[1];
    var body = m[2];
    var key = "cm-" + vid;
    if (seen[key]) continue;
    seen[key] = 1;
    var tm = body.match(/shorts-card__title[^>]*>([^<]{2,300})</i) || body.match(/alt="([^"]{2,300})"/i);
    var title = tm ? unescape(tm[1]) : key;
    var im = body.match(/<noscript><img[^>]+src="([^"]+)"/i) || body.match(/<img[^>]+src="([^"]+)"/i);
    var cover = im ? imgProxy(im[1]) : "";
    var dm = body.match(/shorts-card__dur[^>]*>([^<]+)</i);
    out.push({
      id: key,
      type: "url",
      title: title || key,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: key,
      description: dm ? txt(dm[1]) : "",
      mediaType: "movie"
    });
  }
  return out;
}

// 短剧页：每部一个 article 块，取短剧 id、标题、封面、集数与评分。
function scanDrama(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<article[^>]*>([\s\S]*?)<\/article>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var body = m[1];
    var lm = body.match(/href="\/short-drama\/(\d+)\//i);
    if (!lm) continue;
    var key = "dr-" + lm[1];
    if (seen[key]) continue;
    seen[key] = 1;
    var tm = body.match(/sd-card__title[^>]*>([^<]{2,300})</i) || body.match(/alt="([^"]{2,300})"/i);
    var title = tm ? unescape(tm[1]) : key;
    var im = body.match(/<noscript><img[^>]+src="([^"]+)"/i) || body.match(/<img[^>]+src="([^"]+)"/i);
    var cover = im ? imgProxy(im[1]) : "";
    var em = body.match(/sd-card__episodes[^>]*>([^<]+)</i);
    var sm = body.match(/sd-card__score[^>]*>([^<]+)</i);
    var desc = em ? txt(em[1]) : "";
    if (sm) desc += (desc ? " " : "") + txt(sm[1]);
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

function noData(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = txt(params.zone || "latest");
  var sub = txt(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var list = [];
    if (zone === "commentary") {
      var svUrl = SITE + "/short-video/" + (page > 1 ? "?page=" + page : "");
      list = scanShorts(await fetchPage(svUrl));
    } else if (zone === "drama") {
      list = scanDrama(await fetchPage(SITE + "/short-drama/"));
    } else {
      list = await videoApi(zone, sub, page);
    }
    if (list.length) return list;
    return noData();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

async function search(params) {
  params = params || {};
  var wd = txt(params.keyword || params.wd || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return noData("请输入关键词");
  try {
    var url = SITE + "/search/?q=" + encodeURIComponent(wd);
    if (page > 1) url += "&page=" + page;
    var list = scanSearch(await fetchPage(url));
    if (list.length) return list;
    return noData();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function pickLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

// 收集页内全部 ld+json 块（BreadcrumbList 在前、VideoObject 在后，都要扫）。
function collectLd(html) {
  var found = [];
  if (!html) return found;
  var re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var raw = txt(m[1]);
    if (!raw) continue;
    try {
      var obj = JSON.parse(raw);
      if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) { if (obj[i]) found.push(obj[i]); }
      } else if (obj) {
        found.push(obj);
      }
    } catch (e) { /* 跳过坏块 */ }
  }
  return found;
}

// 详情页一次取全：标题、封面、简介、签名 manifest。
function pageInfo(url) {
  return fetchPage(url).then(function (html) {
    var info = { title: "", cover: "", desc: "", manifest: "" };
    if (!html) return info;
    var blocks = collectLd(html);
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      if (b.contentUrl && !info.manifest) info.manifest = fullUrl(b.contentUrl);
      if (b.name && !info.title) info.title = unescape(b.name);
      if (b.thumbnailUrl && !info.cover) info.cover = imgProxy(b.thumbnailUrl);
      if (b.description && !info.desc) info.desc = unescape(b.description);
    }
    if (!info.title) {
      var tm = html.match(/<title>([^<]+)<\/title>/i);
      if (tm) info.title = unescape(tm[1]).replace(/\s*[-|].*$/, "").trim();
    }
    return info;
  });
}

async function loadDetail(link) {
  try {
    var raw = pickLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var m;
    // 短剧：/api/v1/drama/{id} 取集数，集用懒解析 token（不存签名地址）。
    if ((m = raw.match(/^dr-(\d+)/))) {
      var did = m[1];
      var d = await fetchJson(SITE + "/api/v1/drama/" + did);
      var info = (d && d.data) || {};
      var title = unescape(info.title) || ("短剧 " + did);
      var cover = imgProxy(info.coverUrl || info.cover || "");
      var total = parseInt(info.totalEpisodes, 10) || 0;
      var epsArr = info.episodes || [];
      var count = total || epsArr.length;
      if (!count) return { id: raw, type: "url", title: title, description: "暂无剧集" };
      var eps = [];
      var epItems = [];
      var seasonEps = [];
      for (var i = 0; i < count; i++) {
        var n = i + 1;
        var ep = epsArr[i];
        var epTitle = (ep && ep.title) ? unescape(ep.title) : ("第" + n + "集");
        var token = raw + "@@ep-" + n;
        eps.push({ name: epTitle, link: token });
        seasonEps.push({ title: epTitle, episodeNumber: n });
        epItems.push({
          id: token,
          type: "url",
          title: epTitle,
          mediaType: "movie",
          posterPath: cover,
          link: token,
          episode: n,
          episodeNumber: n,
          seasonIndex: 1,
          seasonNumber: 1,
          playerType: "system"
        });
      }
      return {
        id: raw,
        type: "detail",
        title: title,
        name: title,
        description: unescape(info.description) || unescape(info.blurb) || "",
        mediaType: "movie",
        link: raw,
        coverUrl: cover,
        posterPath: cover,
        backdropPath: cover,
        playerType: "app",
        episodes: eps,
        seasons: [{ seasonNumber: 1, title: "短剧", name: "短剧", episodes: seasonEps }],
        episodeItems: epItems,
        childItems: epItems
      };
    }
    // AV解说：详情页 JSON-LD 给标题与封面，播单由 loadResource 现取。
    if ((m = raw.match(/^cm-(\d+)/))) {
      var svid = m[1];
      var sv = await pageInfo(SITE + "/short-video/" + svid + "/");
      var svTitle = sv.title || ("AV解说 " + svid);
      if (sv.manifest) cacheManifest(raw, sv.manifest);
      var svEp = {
        id: raw + "@@play",
        type: "url",
        title: "播放",
        mediaType: "movie",
        posterPath: sv.cover,
        link: raw + "@@play",
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system"
      };
      if (sv.manifest) svEp.videoUrl = sv.manifest;
      var svResult = {
        id: raw,
        type: "detail",
        title: svTitle,
        name: svTitle,
        description: sv.desc,
        mediaType: "movie",
        link: raw,
        coverUrl: sv.cover,
        posterPath: sv.cover,
        backdropPath: sv.cover,
        playerType: sv.manifest ? "system" : "app",
        episodes: [{ name: "播放", link: raw + "@@play" }],
        seasons: [{ seasonNumber: 1, title: "播放", name: "播放", episodes: [{ title: "播放", episodeNumber: 1 }] }],
        episodeItems: [svEp]
      };
      if (sv.manifest) svResult.videoUrl = sv.manifest;
      svResult.childItems = svResult.episodeItems;
      return svResult;
    }
    // 普通视频：详情只出一条“播放”懒解析线，播单由 loadResource 现取。
    if ((m = raw.match(/^mv-(\d+)/))) {
      var vid = m[1];
      var v = await pageInfo(SITE + "/videos/" + vid + "/");
      var vTitle = v.title || ("视频 " + vid);
      if (v.manifest) cacheManifest(raw, v.manifest);
      var vEp = {
        id: raw + "@@play",
        type: "url",
        title: "播放",
        mediaType: "movie",
        posterPath: v.cover,
        link: raw + "@@play",
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system"
      };
      if (v.manifest) vEp.videoUrl = v.manifest;
      var vResult = {
        id: raw,
        type: "detail",
        title: vTitle,
        name: vTitle,
        description: v.desc,
        mediaType: "movie",
        link: raw,
        coverUrl: v.cover,
        posterPath: v.cover,
        backdropPath: v.cover,
        playerType: v.manifest ? "system" : "app",
        episodes: [{ name: "播放", link: raw + "@@play" }],
        seasons: [{ seasonNumber: 1, title: "播放", name: "播放", episodes: [{ title: "播放", episodeNumber: 1 }] }],
        episodeItems: [vEp]
      };
      if (v.manifest) vResult.videoUrl = v.manifest;
      vResult.childItems = vResult.episodeItems;
      return vResult;
    }
    return { id: raw, type: "url", title: "未知链接", description: raw };
  } catch (e) {
    return { id: pickLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  var raw = "";
  try {
    if (typeof params === "string") params = { link: params };
    params = params || {};
    // 集内已带直链地址时直接回（详情直交的行点播即此路，不再现取）。
    if (params.item && params.item.videoUrl) {
      return [{ name: params.item.title || "播放", url: String(params.item.videoUrl), playerType: "system" }];
    }
    raw = txt(params.link || params.url || params.id || "");
    if (!raw && params.item) raw = txt(params.item.link || params.item.id || "");
    if (!raw) return [];
    var m;
    // 短剧集：现取 /api/v1/drama/{id}/episodes/{n}/play 的签名单集地址。
    if ((m = raw.match(/^dr-(\d+)@@ep-(\d+)/))) {
      var d = await fetchJson(SITE + "/api/v1/drama/" + m[1] + "/episodes/" + m[2] + "/play");
      var pd = (d && d.data) || d || {};
      var url = pd.playUrl || pd.url || pd.manifestUrl || "";
      if (url) {
        url = fullUrl(url);
        cacheManifest(raw, url);
        return [{ name: "第" + m[2] + "集", url: url, playerType: "system" }];
      }
      var cold = cachedManifest(raw);
      if (cold) return [{ name: "第" + m[2] + "集", url: cold, playerType: "system" }];
      return [];
    }
    // 视频 / AV解说：现取详情页 JSON-LD 的签名 manifest。
    if ((m = raw.match(/^(mv|cm)-(\d+)@@play/))) {
      var kind = m[1];
      var id = m[2];
      var pageUrl = kind === "cm" ? SITE + "/short-video/" + id + "/" : SITE + "/videos/" + id + "/";
      var info = await pageInfo(pageUrl);
      if (info.manifest) {
        cacheManifest(raw, info.manifest);
        return [{ name: "播放", url: info.manifest, playerType: "system" }];
      }
      var cm = cachedManifest(raw);
      if (cm) return [{ name: "播放", url: cm, playerType: "system" }];
      return [];
    }
    // 直链 manifest。
    if (/\.m3u8(\?|#|$)/i.test(raw)) {
      return [{ name: "播放", url: raw, playerType: "system" }];
    }
    return [];
  } catch (e) {
    // 永不抛错：异常时仍回详情时缓存的地址（若有），否则空。
    var cb = cachedManifest(raw);
    if (cb) return [{ name: "播放", url: cb, playerType: "system" }];
    return [];
  }
}
