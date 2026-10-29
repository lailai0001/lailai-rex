// 黄果短剧 for REX (lai_huangguo v1.0.0)
// 蓝图：mira-cat 蜘蛛 huangguo.js（py_huangguo，黄果短剧），后端 https://huangguoai.com。
// 列表：分类走 /api/videos/category JSON 接口（失败兜底分类 HTML 页），首页/搜索解析 hg-drama-card 卡片，排行榜解析 hg-rank-item。
// 封面为 AES-128-CBC 加密图，与蜘蛛一致走已部署的封面代理解密：https://huangguo.wulii.de5.net/?url=
// 详情页集数网格（data-ep-id）→ episodes；播放点播时打开单集页解析 videoInitialData（epPlaySrcs/videoSrc），走 loadResource（stream）。

WidgetMetadata = {
  id: "lai_huangguo",
  title: "黄果短剧",
  description: "黄果短剧：AI成人短剧、AI漫剧、AI换脸、AI魔改、排行榜，多集短剧",
  author: "lai",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  site: "https://huangguoai.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "首页",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "home" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "AI成人短剧",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "ai-duanju" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "AI成人漫剧",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "ai-manju" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "AI换脸",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "ai-huanlian" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "AI魔改",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "ai-mogai" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "排行榜",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "ranks/hot" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      id: "loadResource",
      title: "黄果播放源",
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

var HG_HOST = "https://huangguoai.com";
var HG_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
// 封面代理解密（与蜘蛛 COVER_PROXY 一致，外部已部署）
var HG_COVER_PROXY = "https://huangguo.wulii.de5.net";
var HG_RELAY = "https://javsb-relay-production.up.railway.app";
var HG_PLAY_HEADERS = { "User-Agent": HG_UA, "Referer": HG_HOST + "/" };

function hgHeaders(referer) {
  return {
    "User-Agent": HG_UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": referer || HG_HOST + "/"
  };
}

// GET HTML（带重试，口径同蜘蛛 fetchRetry：4xx 除 429 不重试，其余最多 3 次）
async function hgGetHtml(url, referer) {
  for (var attempt = 0; attempt < 3; attempt++) {
    try {
      var resp = await Widget.http.get(url, { headers: hgHeaders(referer), timeout: 20000 });
      var d = resp && resp.data;
      if (d == null) return "";
      return typeof d === "string" ? d : String(d);
    } catch (e) {
      if (attempt >= 2) return "";
    }
  }
  return "";
}

async function hgGetJson(url) {
  for (var attempt = 0; attempt < 3; attempt++) {
    try {
      var resp = await Widget.http.get(url, {
        headers: { "User-Agent": HG_UA, "Accept": "application/json, text/plain, */*", "Referer": HG_HOST + "/" },
        timeout: 20000
      });
      var d = resp && resp.data;
      if (d == null) return null;
      if (typeof d === "object") return d;
      try { return JSON.parse(String(d)); } catch (e) { return null; }
    } catch (e) {
      if (attempt >= 2) return null;
    }
  }
  return null;
}

function hgStripTags(s) {
  return String(s || "").replace(/<[^>]*>/g, "").trim();
}

function hgDecodeEntities(s) {
  return String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function hgAbsUrl(u) {
  u = String(u || "").trim();
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HG_HOST + u;
  return u;
}

// 封面 URL 带时效 auth_key 参数，必须保留（与蜘蛛 cleanPicUrl 一致）
function hgCleanPicUrl(u) {
  return hgAbsUrl(u);
}

function hgProxyCoverUrl(imgUrl) {
  if (!imgUrl || !/^https?:\/\//i.test(imgUrl)) return imgUrl || "";
  return HG_COVER_PROXY + "/?url=" + encodeURIComponent(imgUrl);
}

function hgMetaContent(html, name) {
  if (!html) return "";
  var m = html.match(new RegExp('<meta[^>]+(?:property|name)=["\']' + name + '["\'][^>]*content=["\']([^"\']*)["\']', "i"));
  if (m) return hgDecodeEntities(m[1]).trim();
  m = html.match(new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:property|name)=["\']' + name + '["\']', "i"));
  return m ? hgDecodeEntities(m[1]).trim() : "";
}

function hgExtractTrackId(block) {
  var m = block.match(/data-track-id="(\d+)"/);
  if (m) return m[1];
  m = block.match(/href="[^"]*\/(?:video|detail)\/(\d+)\/?"/);
  return m ? m[1] : "";
}

function hgCleanTitle(s) {
  return hgStripTags(String(s || "").replace(/<span\b[^>]*\bsr-only\b[^>]*>[\s\S]*?<\/span>/gi, ""));
}

function hgExtractCardTitle(block) {
  var m = block.match(/data-track-title="([^"]*)"/);
  if (m) return hgDecodeEntities(m[1]).trim();
  m = block.match(/hg-(?:drama-card|rank-item)__title[^>]*>([\s\S]*?)<\/(?:a|h2)>/);
  if (m) {
    var t = hgCleanTitle(m[1]);
    if (t) return t;
  }
  m = block.match(/<a[^>]+href="[^"]*\/(?:video|detail)\/\d+\/?"[^>]*>([\s\S]*?)<\/a>/);
  return m ? hgCleanTitle(m[1]) : "";
}

function hgToCard(id, title, rawPic, remark) {
  var cover = hgProxyCoverUrl(hgCleanPicUrl(rawPic || ""));
  return {
    id: "huangguo://detail/" + id,
    type: "url",
    title: title,
    posterUrl: cover,
    posterPath: cover,
    coverUrl: cover,
    backdropPath: cover,
    remark: remark || "",
    description: remark || "",
    link: "huangguo://detail/" + id,
    mediaType: "movie"
  };
}

// 单个剧卡解析（同蜘蛛 parseCardBlock）
function hgParseCardBlock(block) {
  var id = hgExtractTrackId(block);
  if (!id) return null;
  var imgM = block.match(/data-src="([^"]+)"/) || block.match(/src="([^"]+)"/);
  var title = hgExtractCardTitle(block);
  if (!title) return null;
  var epBaseM = block.match(/data-ep-base="([^"]*)"/);
  var epSpanM = block.match(/hg-drama-card__episode[^>]*>([\s\S]*?)<\/span>/);
  var scoreSpanM = block.match(/hg-drama-card__score[^>]*>([\s\S]*?)<\/span>/);
  var epBase = epBaseM ? hgDecodeEntities(epBaseM[1]).trim() : (epSpanM ? hgStripTags(epSpanM[1]) : "");
  var score = scoreSpanM ? hgStripTags(scoreSpanM[1]) : "";
  var remarks = epBase && score ? epBase + " · " + score : (epBase || score);
  return hgToCard(id, title, imgM ? imgM[1] : "", remarks);
}

// 剧卡网格列表解析（同蜘蛛 parseCards；parseAll=false 只取第一格）
function hgParseCards(html, parseAll) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var gridRe = /<div\s+class="[^"]*\bhg-card-grid\b[^"]*"[^>]*>/g;
  var starts = [];
  var m;
  while ((m = gridRe.exec(html)) !== null) starts.push(m.index + m[0].length);
  if (!starts.length) return out;
  var n = parseAll ? starts.length : Math.min(1, starts.length);
  for (var i = 0; i < n; i++) {
    var segEnd = i + 1 < starts.length ? starts[i + 1] : html.length;
    var seg = html.slice(starts[i], segEnd);
    var cardRe = /<div\s+class="[^"]*\bhg-drama-card\b[^"]*"[^>]*>/g;
    var cstarts = [];
    var cm;
    while ((cm = cardRe.exec(seg)) !== null) cstarts.push(cm.index);
    for (var j = 0; j < cstarts.length; j++) {
      var cEnd = j + 1 < cstarts.length ? cstarts[j + 1] : seg.length;
      try {
        var card = hgParseCardBlock(seg.slice(cstarts[j], cEnd));
        if (!card || seen[card.id]) continue;
        seen[card.id] = 1;
        out.push(card);
      } catch (e) {}
    }
  }
  return out;
}

// 排行榜列表解析（同蜘蛛 parseRankList）
function hgParseRankList(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var listM = html.match(/<div\s+class="[^"]*\bhg-rank-list\b[^"]*"[^>]*>/);
  var body = html.slice(listM ? listM.index + listM[0].length : 0);
  var itemRe = /<div\s+class="[^"]*\bhg-rank-item\b[^"]*"[^>]*>/g;
  var starts = [];
  var m;
  while ((m = itemRe.exec(body)) !== null) starts.push(m.index);
  for (var i = 0; i < starts.length; i++) {
    var seg = body.slice(starts[i], i + 1 < starts.length ? starts[i + 1] : body.length);
    try {
      var id = hgExtractTrackId(seg);
      if (!id || seen[id]) continue;
      var imgM = seg.match(/data-src="([^"]+)"/) || seg.match(/src="([^"]+)"/);
      var title = hgExtractCardTitle(seg);
      if (!title) continue;
      seen[id] = 1;
      var tagsM = seg.match(/hg-rank-item__tags[^>]*>([\s\S]*?)<\/div>/);
      out.push(hgToCard(id, title, imgM ? imgM[1] : "", tagsM ? hgStripTags(tagsM[1]) : ""));
    } catch (e) {}
  }
  return out;
}

// /api/videos/category JSON 条目解析（同蜘蛛 parseApiItem）
function hgParseApiItem(item) {
  if (!item || !item.id) return null;
  var parts = [];
  var epCount = parseInt(item.episode_count, 10) || 0;
  if (epCount > 0) parts.push((item.is_finished ? "全" : "更新至") + epCount + "集");
  if (item.score) parts.push(String(item.score) + "分");
  if (Array.isArray(item.tags) && item.tags.length) parts.push(item.tags.join("·"));
  return hgToCard(String(item.id), String(item.title || ""), item.cover || "", parts.join(" · "));
}

// 详情页头部：标题/封面/简介（同蜘蛛 parseDetailHead）
function hgParseDetailHead(html) {
  var title = hgMetaContent(html, "og:title");
  if (title) title = title.replace(/\s*-\s*黄果短剧\s*$/, "");
  if (!title) {
    var tm = html.match(/<title>([\s\S]*?)<\/title>/i);
    if (tm) title = hgStripTags(hgDecodeEntities(tm[1]));
  }
  var pic = "";
  var posterDiv = html.match(/<div\s+class="[^"]*\bhg-web-play__poster\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (posterDiv) {
    var pm = posterDiv[1].match(/data-src="([^"]+)"/) || posterDiv[1].match(/src="([^"]+)"/);
    if (pm && pm[1].indexOf("data:image") !== 0) pic = pm[1];
  }
  if (!pic) {
    var jm = html.match(/id="videoInitialData"[^>]*>([\s\S]*?)<\/script>/);
    if (jm) {
      try {
        var j = JSON.parse(jm[1]);
        pic = (j && (j.posterSrc || j.coverSrc)) || "";
      } catch (e) {}
    }
  }
  if (!pic) {
    var im = html.match(/<img\b[^>]*\bdata-src="([^"]+)"[^>]*\bfetchpriority="high"[^>]*>/i)
      || html.match(/<img\b[^>]*\bfetchpriority="high"[^>]*\bdata-src="([^"]+)"[^>]*>/i)
      || html.match(/<img\b[^>]*\bdata-src="(https?:\/\/[^"]+?\.(?:jpe?g|png|webp|gif)(?:\?[^"]*)?)"[^>]*>/i);
    if (im) pic = im[1];
  }
  if (!pic) pic = hgMetaContent(html, "og:image");
  return { title: title, pic: pic, content: hgMetaContent(html, "og:description") };
}

// 详情页集数列表（同蜘蛛 detail 的 ep-grid 解析）
function hgParseEpisodes(html, vid) {
  var eps = [];
  var gridM = html.match(/<div\s+class="[^"]*\bhg-(?:web-play|web-detail)__ep-grid\b[^"]*"[^>]*>([\s\S]*?)<\/div>/);
  if (gridM) {
    var aRe = /<a\b[^>]*>[\s\S]*?<\/a>/g;
    var am;
    while ((am = aRe.exec(gridM[1])) !== null) {
      var hrefM = am[0].match(/href="([^"]+)"/);
      if (!hrefM) continue;
      var epIdM = am[0].match(/data-ep-id="([^"]*)"/);
      var ep = epIdM ? epIdM[1] : "";
      var pageUrl = hgAbsUrl(hrefM[1]);
      eps.push({
        name: ep ? "第" + ep + "集" : (hgStripTags(am[0]) || "第1集"),
        id: vid + "|" + ep,
        link: "huangguo://episode/" + encodeURIComponent(pageUrl) + "/" + ep
      });
    }
  }
  if (!eps.length) {
    var pm = html.match(/<a\b[^>]*class="[^"]*\bhg-web-detail__play\b[^"]*"[^>]*href="([^"]+)"/);
    if (pm) {
      eps.push({ name: "第1集", id: vid + "|", link: "huangguo://episode/" + encodeURIComponent(hgAbsUrl(pm[1])) + "/" });
    }
  }
  return eps;
}

async function loadList(params) {
  params = params || {};
  var cat = String(params.cat || params.path || "home").replace(/^\//, "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    if (cat === "home") {
      var homeHtml = await hgGetHtml(HG_HOST + "/");
      return hgParseCards(homeHtml, true);
    }
    if (cat.indexOf("rank") !== -1) {
      var rankHtml = await hgGetHtml(HG_HOST + "/" + cat + "/");
      return hgParseRankList(rankHtml);
    }
    // JSON 分类接口优先（同蜘蛛）
    var json = await hgGetJson(HG_HOST + "/api/videos/category/" + cat + "?page=" + page);
    if (json && json.data && Array.isArray(json.data.items)) {
      var list = [];
      json.data.items.forEach(function (it) {
        var c = hgParseApiItem(it);
        if (c) list.push(c);
      });
      if (list.length) return list;
    }
    // 兜底：分类 HTML 页
    var url = HG_HOST + "/" + cat + "/" + (page > 1 ? page + "/" : "");
    var html = await hgGetHtml(url);
    return hgParseCards(html, false);
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function hgPickKeyword(params) {
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
  var kw = hgPickKeyword(params);
  if (!kw) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  try {
    var html = await hgGetHtml(HG_HOST + "/search/video/" + encodeURIComponent(kw) + "/");
    var cards = hgParseCards(html, false);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关短剧" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

// 链接拆解：
//   huangguo://detail/<vid>                          -> { kind: "drama", id }
//   huangguo://episode/<encodeURIComponent(单集页URL)>/<ep> -> { kind: "episode", pageUrl, ep }
//   裸 id                                             -> { kind: "drama", id }
function hgParseRef(link) {
  var v = String(link || "");
  var m = v.match(/^huangguo:\/\/episode\/(.+)\/([^/]*)$/);
  if (m) {
    var pageUrl = m[1];
    try { pageUrl = decodeURIComponent(pageUrl); } catch (e) {}
    return { kind: "episode", pageUrl: pageUrl, ep: m[2] || "" };
  }
  m = v.match(/^huangguo:\/\/detail\/(.+)$/);
  if (m) return { kind: "drama", id: m[1] };
  return { kind: "drama", id: v.replace(/^huangguo:\/\//, "") };
}

async function loadDetail(link) {
  var ref = hgParseRef(link);
  if (ref.kind !== "drama" || !ref.id) {
    return { id: String(link || ""), type: "url", title: "参数错误", link: String(link || "") };
  }
  try {
    var html = await hgGetHtml(HG_HOST + "/video/" + ref.id + "/");
    if (!html) return { id: String(link), type: "url", title: "加载失败", link: String(link) };
    var head = hgParseDetailHead(html);
    var eps = hgParseEpisodes(html, ref.id);
    if (!eps.length) {
      // 详情页本身即第 1 集播放页
      eps.push({ name: "第1集", id: ref.id + "|1", link: "huangguo://episode/" + encodeURIComponent(HG_HOST + "/video/" + ref.id + "/") + "/1" });
    }
    var cover = hgProxyCoverUrl(hgCleanPicUrl(head.pic || ""));
    return {
      id: String(link),
      type: "url",
      title: head.title || ("黄果短剧 " + ref.id),
      posterUrl: cover,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      description: head.content || "",
      episodes: eps,
      link: String(link)
    };
  } catch (e) {
    return { id: String(link), type: "url", title: "加载失败", link: String(link) };
  }
}

// 单集播放地址：打开单集页解析 videoInitialData（同蜘蛛 play）
async function hgEpisodePlay(pageUrl, ep) {
  var html = await hgGetHtml(pageUrl, HG_HOST + "/");
  if (!html) return "";
  var url = "";
  var m = html.match(/id="videoInitialData"[^>]*>([\s\S]*?)<\/script>/);
  if (m) {
    try {
      var j = JSON.parse(m[1]);
      url = ((j && j.epPlaySrcs) || {})[ep] || (j && j.videoSrc) || "";
    } catch (e) {}
  }
  if (!url) return "";
  url = String(url).replace(/\\u0026/g, "&");
  if (!/^https?:\/\//i.test(url)) {
    var um = url.match(/(https?:\/\/[^\s"']+)/);
    url = um ? um[1] : "";
  }
  return url;
}

// 播放源解析（stream 模块）：单集链接只解该集；剧链接逐集解（连续 3 集无地址则停）
async function loadResource(params) {
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  var ref = hgParseRef(raw);
  try {
    if (ref.kind === "episode") {
      var one = await hgEpisodePlay(ref.pageUrl, ref.ep);
      if (!one) return [];
      if (/\.m3u8/i.test(one)) {
        return [{ name: "中转", url: HG_RELAY + "/hls?url=" + encodeURIComponent(one), playerType: "app", customHeaders: { "User-Agent": HG_UA } },
          { name: "直连", url: one, playerType: "app", customHeaders: HG_PLAY_HEADERS }];
      }
      return [{ name: "播放", url: one, playerType: "app", customHeaders: HG_PLAY_HEADERS }];
    }
    if (!ref.id) return [];
    var html = await hgGetHtml(HG_HOST + "/video/" + ref.id + "/");
    if (!html) return [];
    var head = hgParseDetailHead(html);
    var eps = hgParseEpisodes(html, ref.id);
    var out = [];
    var misses = 0;
    for (var i = 0; i < eps.length; i++) {
      var r = hgParseRef(eps[i].link);
      var url = r.kind === "episode" ? await hgEpisodePlay(r.pageUrl, r.ep) : "";
      if (!url) {
        misses++;
        if (misses >= 3) break;
        continue;
      }
      misses = 0;
      var playUrl = /\.m3u8/i.test(url) ? HG_RELAY + "/hls?url=" + encodeURIComponent(url) : url;
      var playHeaders = /\.m3u8/i.test(url) ? { "User-Agent": HG_UA } : HG_PLAY_HEADERS;
      out.push({ name: eps[i].name, description: head.title || "", url: playUrl, playerType: "app", customHeaders: playHeaders });
    }
    return out;
  } catch (e) {
    return [];
  }
}
