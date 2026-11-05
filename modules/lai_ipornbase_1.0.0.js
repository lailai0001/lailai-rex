// IPornBase for REX (lai_ipornbase v1.0.0)
// 移植自 mira-cat 蜘蛛 py_ipornbase.js（只读蓝图），后端 https://ipornbase.com（备 https://ipornbase.xyz，同站双域名）。
// 分类：站方菜单 8 区作顶级分类 + 3 个真实标签页（無碼破解/巨乳/大屁股，均实测每页 12 条）；
//   每区排序走 enumeration（最近更新/最新发行/中文字幕/今日/本周/本月/年度热门/总观看数），不平铺。
// 列表：Drupal 站 /<section>/<sort>（?page=N，0-based），卡片 <a href="/video/<slug>"><img src alt=标题></a>，
//   封面为站内直链 /sites/default/files/styles/... 直出。详情 /video/<slug>，播放 window.m3u8List 首条直链，
//   单码率媒体播单、无多档 rendition，故不设假清晰度选单。字幕：猫源字幕芯是猫源专属，REX 版不接。

WidgetMetadata = {
  id: "lai_ipornbase",
  title: "IPornBase",
  description: "IPornBase（ipornbase.com）：8 区 + 排序筛选 + 3 标签，详情单集正片直链播放",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://ipornbase.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "🏠首頁推薦", functionName: "loadList", cacheDuration: 180, params: [{ name: "section", title: "分区", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "日本AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "section", title: "分区", type: "constant", value: "japanese" }, { name: "sort", title: "排序", type: "enumeration", value: "new", enumOptions: [{ title: "最近更新", value: "new" }, { title: "最新發行", value: "release" }, { title: "中文字幕", value: "sub" }, { title: "今日熱門", value: "today-hot" }, { title: "本週熱門", value: "weekly-hot" }, { title: "本月熱門", value: "monthly-hot" }, { title: "年度熱門", value: "yearly-hot" }, { title: "總觀看數", value: "hot" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "JAV無碼流出", functionName: "loadList", cacheDuration: 180, params: [{ name: "section", title: "分区", type: "constant", value: "uncensored-leak" }, { name: "sort", title: "排序", type: "enumeration", value: "new", enumOptions: [{ title: "最近更新", value: "new" }, { title: "最新發行", value: "release" }, { title: "中文字幕", value: "sub" }, { title: "今日熱門", value: "today-hot" }, { title: "本週熱門", value: "weekly-hot" }, { title: "本月熱門", value: "monthly-hot" }, { title: "年度熱門", value: "yearly-hot" }, { title: "總觀看數", value: "hot" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "FC2素人", functionName: "loadList", cacheDuration: 180, params: [{ name: "section", title: "分区", type: "constant", value: "fc2" }, { name: "sort", title: "排序", type: "enumeration", value: "new", enumOptions: [{ title: "最近更新", value: "new" }, { title: "最新發行", value: "release" }, { title: "中文字幕", value: "sub" }, { title: "今日熱門", value: "today-hot" }, { title: "本週熱門", value: "weekly-hot" }, { title: "本月熱門", value: "monthly-hot" }, { title: "年度熱門", value: "yearly-hot" }, { title: "總觀看數", value: "hot" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "裏番", functionName: "loadList", cacheDuration: 180, params: [{ name: "section", title: "分区", type: "constant", value: "hentai" }, { name: "sort", title: "排序", type: "enumeration", value: "new", enumOptions: [{ title: "最近更新", value: "new" }, { title: "最新發行", value: "release" }, { title: "中文字幕", value: "sub" }, { title: "今日熱門", value: "today-hot" }, { title: "本週熱門", value: "weekly-hot" }, { title: "本月熱門", value: "monthly-hot" }, { title: "年度熱門", value: "yearly-hot" }, { title: "總觀看數", value: "hot" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "歐美", functionName: "loadList", cacheDuration: 180, params: [{ name: "section", title: "分区", type: "constant", value: "western" }, { name: "sort", title: "排序", type: "enumeration", value: "new", enumOptions: [{ title: "最近更新", value: "new" }, { title: "最新發行", value: "release" }, { title: "中文字幕", value: "sub" }, { title: "今日熱門", value: "today-hot" }, { title: "本週熱門", value: "weekly-hot" }, { title: "本月熱門", value: "monthly-hot" }, { title: "年度熱門", value: "yearly-hot" }, { title: "總觀看數", value: "hot" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "亞洲國產AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "section", title: "分区", type: "constant", value: "asian" }, { name: "sort", title: "排序", type: "enumeration", value: "new", enumOptions: [{ title: "最近更新", value: "new" }, { title: "最新發行", value: "release" }, { title: "中文字幕", value: "sub" }, { title: "今日熱門", value: "today-hot" }, { title: "本週熱門", value: "weekly-hot" }, { title: "本月熱門", value: "monthly-hot" }, { title: "年度熱門", value: "yearly-hot" }, { title: "總觀看數", value: "hot" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "韓國直播", functionName: "loadList", cacheDuration: 180, params: [{ name: "section", title: "分区", type: "constant", value: "korean" }, { name: "sort", title: "排序", type: "enumeration", value: "new", enumOptions: [{ title: "最近更新", value: "new" }, { title: "最新發行", value: "release" }, { title: "中文字幕", value: "sub" }, { title: "今日熱門", value: "today-hot" }, { title: "本週熱門", value: "weekly-hot" }, { title: "本月熱門", value: "monthly-hot" }, { title: "年度熱門", value: "yearly-hot" }, { title: "總觀看數", value: "hot" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "黃果短劇", functionName: "loadList", cacheDuration: 180, params: [{ name: "section", title: "分区", type: "constant", value: "ai" }, { name: "sort", title: "排序", type: "enumeration", value: "new", enumOptions: [{ title: "最近更新", value: "new" }, { title: "最新發行", value: "release" }, { title: "中文字幕", value: "sub" }, { title: "今日熱門", value: "today-hot" }, { title: "本週熱門", value: "weekly-hot" }, { title: "本月熱門", value: "monthly-hot" }, { title: "年度熱門", value: "yearly-hot" }, { title: "總觀看數", value: "hot" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "無碼破解", functionName: "loadList", cacheDuration: 180, params: [{ name: "section", title: "分区", type: "constant", value: "tag-wuma-pojie" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [{ name: "section", title: "分区", type: "constant", value: "tag-juru" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "大屁股", functionName: "loadList", cacheDuration: 180, params: [{ name: "section", title: "分区", type: "constant", value: "tag-dapigu" }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOSTS = ["https://ipornbase.com", "https://ipornbase.xyz"];
var PRIMARY = HOSTS[0];
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

var SECTIONS = [
  { id: "japanese", name: "日本AV", base: "japanese" },
  { id: "uncensored-leak", name: "JAV無碼流出", base: "uncensored-leak" },
  { id: "fc2", name: "FC2素人", base: "fc2" },
  { id: "hentai", name: "裏番", base: "hentai" },
  { id: "western", name: "歐美", base: "western" },
  { id: "asian", name: "亞洲國產AV", base: "asian" },
  { id: "korean", name: "韓國直播", base: "korean" },
  { id: "ai", name: "黃果短劇", base: "ai" }
];
var TAGS = [
  { id: "tag-wuma-pojie", name: "無碼破解", word: "無碼破解" },
  { id: "tag-juru", name: "巨乳", word: "巨乳" },
  { id: "tag-dapigu", name: "大屁股", word: "大屁股" }
];

function t(v) {
  return String(v == null ? "" : v).trim();
}

function cleanText(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/\s+/g, " ");
}

function cleanLabel(s) {
  return cleanText(s).replace(/[$#]/g, "");
}

function absUrl(u, host) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return host + u;
  return u;
}

function normUrl(u) {
  var s = t(u);
  if (!s) return "";
  s = s.replace(/^(https?:)\/([^/])/, "$1//$2");
  return s;
}

// 双域名顺序回落：主站 .com 先行，空/非 200/异常才走 .xyz
async function getPage(path) {
  var p = t(path);
  if (p.indexOf("//") === 0) p = "https:" + p;
  for (var hi = 0; hi < HOSTS.length; hi++) {
    var host = HOSTS[hi];
    var url = p.charAt(0) === "/" ? host + p : p;
    try {
      var res = await Widget.http.get(url, {
        headers: {
          "User-Agent": UA,
          "Referer": host + "/",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
        }
      });
      var body = res && res.data != null ? String(res.data) : "";
      if (res && res.status && res.status !== 200) continue;
      if (!body) continue;
      return { html: body, host: host };
    } catch (e) { /* 换下一个域名 */ }
  }
  return { html: "", host: PRIMARY };
}

function parseCards(html, host) {
  var items = [];
  var seen = {};
  var re = /<a[^>]+href=["'](\/video\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/g;
  var m;
  while ((m = re.exec(String(html || "")))) {
    var raw = t(m[1]);
    if (!raw || raw.indexOf("go.") >= 0 || raw.indexOf("http") === 0) continue;
    if (seen[raw]) continue;
    var inner = m[2] || "";
    var pic = "";
    var imgM = inner.match(/<img[^>]+>/i);
    if (imgM) {
      var srcM = imgM[0].match(/(?:data-original|data-src|src)=["']([^"']+)["']/i);
      if (srcM) {
        var cand = t(srcM[1]);
        if (cand && !/loading|placeholder|logo/i.test(cand)) {
          pic = normUrl(cand.indexOf("http") === 0 ? cand : absUrl(cand, host));
        }
      }
    }
    var title = "";
    if (imgM) {
      var altM = imgM[0].match(/alt=["']([^"']*)["']/i);
      if (altM) { var at = cleanLabel(altM[1]); if (at.length > 1) title = at; }
    }
    if (!title) { var tx = cleanLabel(inner); if (tx && tx.length > 2) title = tx; }
    if (pic || title) {
      seen[raw] = 1;
      items.push({
        id: raw,
        type: "url",
        title: title || "精彩视频",
        posterPath: pic,
        coverUrl: pic,
        backdropPath: pic,
        link: raw,
        mediaType: "movie"
      });
    }
  }
  return items;
}

function hasNextPage(html, page) {
  var h = String(html || "");
  return h.indexOf("?page=" + page) >= 0 || h.indexOf("&amp;page=" + page) >= 0 || h.indexOf("&page=" + page) >= 0;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function findSection(id) {
  for (var i = 0; i < SECTIONS.length; i++) {
    if (SECTIONS[i].id === id) return SECTIONS[i];
  }
  return null;
}

function findTag(id) {
  for (var i = 0; i < TAGS.length; i++) {
    if (TAGS[i].id === id) return TAGS[i];
  }
  return null;
}

function sectionPath(sec, sort, page) {
  var base;
  if (sort === "sub") base = "/" + sec.base + "/new?field_video_tags_target_id=1&sort_by=created";
  else base = "/" + sec.base + "/" + sort;
  if (page > 1) base += (base.indexOf("?") >= 0 ? "&page=" + (page - 1) : "?page=" + (page - 1));
  return base;
}

async function loadList(params) {
  params = params || {};
  var secId = t(params.section || params.zone || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    if (!secId || secId === "home") {
      var home = await getPage("/");
      var hlist = parseCards(home.html, home.host);
      return hlist.length ? hlist : emptyItem();
    }
    var tag = findTag(secId);
    if (tag) {
      var tpath = "/tags/" + encodeURIComponent(tag.word);
      if (page > 1) tpath += "?page=" + (page - 1);
      var tg = await getPage(tpath);
      var tlist = parseCards(tg.html, tg.host);
      return tlist.length ? tlist : emptyItem();
    }
    var sec = findSection(secId);
    if (!sec) return emptyItem();
    var sort = t(params.sort || "new") || "new";
    var sp = sectionPath(sec, sort, page);
    var sg = await getPage(sp);
    var slist = parseCards(sg.html, sg.host);
    return slist.length ? slist : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
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
  var path = "/search?fulltext=" + encodeURIComponent(wd);
  if (page > 1) path += "&page=" + (page - 1);
  try {
    var html = await getPage(path);
    var list = parseCards(html.html, html.host);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function detailPath(link) {
  var s = t(link);
  if (!s) return "";
  var m = s.match(/\/video\/[^/?#]+/);
  if (m) return m[0];
  return s;
}

async function loadDetail(link) {
  try {
    var path = detailPath(link);
    if (!path) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var durl = path.indexOf("http") === 0 ? path : PRIMARY + path;
    var g = await getPage(path);
    var html = g.html;
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var mainTitle = "精彩视频";
    var h1M = html.match(/<h1[^>]*class=["'][^"']*vdtitle[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i);
    if (h1M) mainTitle = cleanLabel(h1M[1]) || mainTitle;
    else {
      var tM = html.match(/<title>(.*?)<\/title>/i);
      if (tM) mainTitle = cleanLabel(tM[1]).replace(/\s*[|｜-]\s*AV空投軍團.*$/i, "").trim() || mainTitle;
    }
    var posterPic = "";
    var vM = html.match(/<video[^>]*poster=["']([^"']+)["']/i);
    if (vM) posterPic = normUrl(t(vM[1]).indexOf("http") === 0 ? t(vM[1]) : absUrl(vM[1], g.host));
    var urls = [];
    var m3u8M = html.match(/window\.m3u8List\s*=\s*\[([\s\S]*?)\]/);
    if (m3u8M) {
      var qre = /["'](https?:\/\/[^"']+\.m3u8(?:\?[^"']*)?)["']/g;
      var q;
      while ((q = qre.exec(m3u8M[1]))) {
        var u = t(q[1]);
        if (u && urls.indexOf(u) < 0) urls.push(u);
      }
      if (!urls.length) {
        var mre = /["'](https?:\/\/[^"']+\.mp4(?:\?[^"']*)?)["']/g;
        while ((q = mre.exec(m3u8M[1]))) {
          var u2 = t(q[1]);
          if (u2 && urls.indexOf(u2) < 0) urls.push(u2);
        }
      }
    }
    if (!urls.length) {
      return { id: durl, type: "url", title: mainTitle, description: "未找到播放地址", coverUrl: posterPic, posterPath: posterPic, backdropPath: posterPic };
    }
    return {
      id: durl,
      type: "detail",
      title: mainTitle,
      link: durl,
      posterPath: posterPic,
      coverUrl: posterPic,
      backdropPath: posterPic,
      videoUrl: urls[0],
      playerType: "app",
      customHeaders: { "User-Agent": UA, "Referer": PRIMARY + "/" }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
