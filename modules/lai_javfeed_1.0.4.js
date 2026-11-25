// v1.0.4：AVDB 样式详情（实测修正：详情只扫 <article>，导航栏 70 个分类不再混入；演员页直取+parseList；补 loadList peopleId/genreId 与裸名路由）
// JavFeed for REX (lai_javfeed v1.0.0)
// v1.0.2（2026-11-21）：补顶层 search 键（A 键，照 64 个可见模块的众数形状）；B 条目与 search 函数一个字未动。
// v1.0.1（2026-11-09）：详情 quals 全量出集（每集名 1080p/720p…、videoUrl 为对应变体地址），新增 loadResource（unwrapLink + 直链/@@token 透传）。
// 移植自 mira-cat 蜘蛛 py_javfeed.js（只读蓝图，未改动猫源），后端 https://javfeed.site。
// 列表：Next.js 页 JSON-LD ItemList（VideoObject），兜底 /video/ 链接 + fourhoi 封面对齐。
// 详情：og:video 主清单，取其中实际有的档位（猫源实测 360p/480p/720p/1080p），高到低出线，主线取最高档。
// 等价性缺口（blocker，见报告）：猫源每条清晰度线走本地改写腿，把 .jpeg 后缀分片改写成
// ?x=.ts；REX 没有本地路由，无法等价改写。本模块直出源站分片地址，是否可播、能否拖进度
// 以真机为准，不假装改写已生效。

WidgetMetadata = {
  id: "lai_javfeed",
  title: "JavFeed",
  description: "JavFeed（javfeed.site）：最新/无码流出/巨乳/大屁股/熟女/美乳/4K/人妻/高清/中出/淫女/VR/个人拍摄/潮吹；分片 .jpeg 后缀直出，猫源本地改写腿在 REX 无等价，待真机验",
  author: "lai",
  version: "1.0.4",
  requiredVersion: "0.0.1",
  site: "https://javfeed.site",
  detailCacheDuration: 180,
  modules: [
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "无码流出", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "t:uncensored-leak" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "c:big-breasts" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "大屁股", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "t:big-ass" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "熟女", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "c:mature-woman" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "美乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "c:beautiful-breasts" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "4K", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "t:4k" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "c:wife" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "高清", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "c:hd" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中出", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "c:creampie" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "淫女", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "c:slut" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "VR", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "c:vr" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "个人拍摄", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "c:individual" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "潮吹", functionName: "loadList", cacheDuration: 180, params: [ { name: "cat", title: "分类", type: "constant", value: "c:squirting" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "搜索", functionName: "search", params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] }
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

var HOST = "https://javfeed.site";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
var PAGE_SIZE = 24;

function t(v) { return String(v == null ? "" : v).trim(); }

function clean(s) {
  return t(s).replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&#x27;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, function (m, h) { try { return String.fromCharCode(parseInt(h, 16)); } catch (e) { return m; } })
    .replace(/&#(\d+);/g, function (m, d) { try { return String.fromCharCode(parseInt(d, 10)); } catch (e) { return m; } })
    .replace(/\s+/g, " ").trim();
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  return HOST + (u.charAt(0) === "/" ? u : "/" + u);
}

function resolveUrl(u, base) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  var m = String(base || "").match(/^(https?:\/\/[^\/]+)(\/.*)?$/);
  if (!m) return u;
  var origin = m[1];
  var path = m[2] || "/";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return origin + u;
  var dir = path.slice(0, path.lastIndexOf("/") + 1);
  return origin + dir + u;
}

async function httpGet(url, referer) {
  try {
    var res = await Widget.http.get(url, { headers: { "User-Agent": UA, "Referer": referer || HOST + "/" } });
    var data = res && res.data != null ? res.data : "";
    return typeof data === "string" ? data : JSON.stringify(data);
  } catch (e) {
    return "";
  }
}

function parseList(html) {
  var out = [];
  if (!html) return out;
  var re = /"@type":"VideoObject","name":"((?:\\.|[^"\\])*?)","description":"(?:\\.|[^"\\])*?","thumbnailUrl":"([^"]+)","uploadDate":"[^"]*","contentUrl":"(https:\/\/javfeed\.site\/video\/([a-z0-9\-]+))"/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var name = m[1] || "";
    try { name = JSON.parse('"' + name + '"'); } catch (e) {}
    out.push({ id: HOST + "/video/" + m[4], type: "url", title: clean(name), posterPath: m[2], coverUrl: m[2], backdropPath: m[2], link: HOST + "/video/" + m[4], description: "", mediaType: "movie" });
    if (out.length >= 100) break;
  }
  if (out.length) return out;
  var slugs = [];
  var seen = {};
  var smRe = /href="\/video\/([a-z0-9\-]+)"/g;
  var sm;
  while ((sm = smRe.exec(html)) !== null) {
    if (!seen[sm[1]]) { seen[sm[1]] = 1; slugs.push(sm[1]); }
  }
  var pics = [];
  var picRe = /<img[^>]+src="(https:\/\/fourhoi\.com\/[^"]+)"/g;
  var pm;
  while ((pm = picRe.exec(html)) !== null) pics.push(pm[1]);
  for (var i = 0; i < slugs.length; i++) {
    var url = HOST + "/video/" + slugs[i];
    out.push({ id: url, type: "url", title: slugs[i].toUpperCase(), posterPath: pics[i] || "", coverUrl: pics[i] || "", backdropPath: pics[i] || "", link: url, description: "", mediaType: "movie" });
  }
  return out;
}

function listUrlFor(tid, page) {
  var p = page > 1 ? "/page/" + page : "";
  if (tid === "latest") return HOST + "/" + (page > 1 ? "page/" + page : "");
  if (tid.indexOf("c:") === 0) return HOST + "/category/" + tid.slice(2) + p;
  if (tid.indexOf("t:") === 0) return HOST + "/tag/" + tid.slice(2) + p;
  return HOST + "/" + (page > 1 ? "page/" + page : "");
}

async function loadList(params) {
  params = params || {};
  var _pid = String(params.peopleId || params.genreId || params.url || params.link || "");
  if (_pid && /^https?:\/\//i.test(_pid)) {
    try {
      var _pp = taxPathOf(_pid);
      if (_pp.indexOf("pornstars/") === 0) { var _ph2 = await httpGet(_pid); var _pl = _ph2 ? parseList(_ph2) : []; return _pl.length ? _pl : [{ id: "empty", type: "url", title: "没有找到相关内容" }]; }
      if (_pp.indexOf("category/") === 0) return await loadList({ cat: "c:" + _pp.slice(9), page: Math.max(1, parseInt(params.page, 10) || 1) });
      if (_pp.indexOf("tag/") === 0) return await loadList({ cat: "t:" + _pp.slice(4), page: Math.max(1, parseInt(params.page, 10) || 1) });
    } catch (ePid) {}
  }
  var tid = String(params.cat || params.path || "latest");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var html = await httpGet(listUrlFor(tid, page));
    var cards = parseList(html);
    if (!cards.length) return [{ id: "empty", type: "url", title: "没有找到相关内容" }];
    return cards;
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败", description: String((e && e.message) || e) }];
  }
}

function pickKeyword(params) {
  if (params == null) return "";
  if (typeof params === "string") return String(params).trim();
  var keys = ["keyword", "q", "query", "wd", "key", "text"];
  for (var i = 0; i < keys.length; i++) {
    if (params[keys[i]]) return String(params[keys[i]]).trim();
  }
  return "";
}

async function search(params) {
  params = params || {};
  var kw = pickKeyword(params);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!kw || page > 1) return [];
  try {
    var html = await httpGet(HOST + "/?s=" + encodeURIComponent(kw));
    return parseList(html);
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败", description: String((e && e.message) || e) }];
  }
}

function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.videoUrl || x.link || x.id || x.url || x.href || "");
  return String(x);
}


// ---- AVDB 样式详情：演员/分类（点按出对应全部内容）----
// 详情页 HTML 里扫演员/分类链接（站内同源），建成 peoples / genreItems；
// 点按后 loadDetail 走分类页分支（loadList 或 search 取该分类的全部影片）。
var TAX_ACTRESS_RE = /\/(actress(?:es)?|actors?|stars?|pornstars?|performers?|models?|idols?)\//i;
var TAX_GENRE_RE = /\/(genres?|tags?|categor(?:y|ies)|labels?|makers?|studios?|directors?|codes?)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)|actress(es)?|actors?|stars?|makers?|all|全部|分类|演员|标签|女优|题材|片商)$/i;
var TAX_AFTER_RE = /\/actress(?:es)?\/|\/actors?\/|\/stars?\/|\/pornstars?\/|\/performers?\/|\/models?\/|\/idols?\/|\/genres?\/|\/tags?\/|\/categor(?:y|ies)\/|\/labels?\/|\/makers?\/|\/studios?\/|\/directors?\/|\/codes?\//i;

function extractTaxonomyFromHtml(html) {
  var peoples = [];
  var genreItems = [];
  var seenP = {};
  var seenG = {};
  // 实测：详情页导航栏下拉有 70 个 /category/ 链接，全站通用；本片自己的分类/标签
  // 是 <article> 内的 pill 链接，演员链接在 article 标题旁。只扫 article。
  var _art = String(html || "").match(/<article[\s\S]*?<\/article>/i);
  if (_art) html = _art[0];
  var baseHost = String(HOST || "").replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(String(html || ""))) !== null) {
    var href = m[1] || "";
    var name = String(m[2] || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (!name || name.length > 40 || TAX_NAV_NAME_RE.test(name)) continue;
    var abs = absUrl(href);
    if (!/^https?:\/\//i.test(abs)) continue;
    var host = abs.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (baseHost && host !== baseHost) continue;
    var after = abs.split(TAX_AFTER_RE)[1] || "";
    after = after.split("?")[0].split("#")[0].replace(/\/+$/, "");
    if (!after) continue;
    if (TAX_ACTRESS_RE.test(abs)) {
      if (seenP[name]) continue;
      seenP[name] = 1;
      peoples.push({ id: abs, title: name, name: name, link: abs, role: "演员" });
    } else if (TAX_GENRE_RE.test(abs)) {
      if (seenG[name]) continue;
      seenG[name] = 1;
      genreItems.push({ id: abs, title: name });
    }
    if (peoples.length >= 20 && genreItems.length >= 20) break;
  }
  return { peoples: peoples, genreItems: genreItems };
}

function taxWire(ret, html) {
  if (!ret || !html) return ret;
  var tax = extractTaxonomyFromHtml(html);
  if (tax.peoples.length) ret.peoples = tax.peoples;
  if (tax.genreItems.length) ret.genreItems = tax.genreItems;
  return ret;
}

function taxAttach(ret, tax) {
  if (!ret || !tax) return ret;
  if (tax.peoples.length) ret.peoples = tax.peoples;
  if (tax.genreItems.length) ret.genreItems = tax.genreItems;
  return ret;
}

function taxPathOf(url) {
  var s = String(url || "").replace(/^https?:\/\/[^/]+/i, "").split("?")[0].split("#")[0].replace(/^\/+|\/+$/g, "");
  return s;
}

function taxNameOf(url) {
  var s = String(url || "").split("?")[0].split("#")[0].replace(/\/+$/, "");
  var parts = s.split("/");
  var last = parts[parts.length - 1] || "";
  try { return decodeURIComponent(last); } catch (e) { return last; }
}

async function loadDetail(link) {
    // 裸名（App 只传名字）：先试 /pornstars/<slug>/，取不到再搜；绝不回 null。
    try {
      var _bare = unwrapLink(link);
      if (_bare && _bare.indexOf("actor:") === 0) _bare = _bare.slice(6);
      else if (_bare && _bare.indexOf("tag:") === 0) _bare = _bare.slice(4);
      if (_bare && !/^https?:\/\//i.test(_bare) && (_bare.indexOf(" ") >= 0 || /[^\x00-\x7F]/.test(_bare))) {
        var _slug = _bare.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
        var _bWorks = [];
        if (_slug) { var _bh = await httpGet(HOST + "/pornstars/" + _slug); if (_bh) _bWorks = parseList(_bh); }
        if (!_bWorks.length) _bWorks = await search({ keyword: _bare, page: 1 });
        if (!Array.isArray(_bWorks)) _bWorks = [];
        var _bReal = _bWorks.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty" && w.id !== "tip"; });
        return { id: _bare, type: "detail", mediaType: "movie", title: _bare, link: HOST + "/pornstars/" + _slug, description: "演员 · 共 " + _bReal.length + " 部作品", videoUrl: "", childItems: [], relatedItems: _bReal.length ? _bReal : _bWorks };
      }
    } catch (eBare) {}

    // AVDB 样式：点按演员/分类 → 打开该演员/分类的全部影片。
    try {
      var taxUrl = unwrapLink(link);
      if (taxUrl && (TAX_ACTRESS_RE.test(taxUrl) || TAX_GENRE_RE.test(taxUrl))) {
        var taxIsActress = TAX_ACTRESS_RE.test(taxUrl);
        var taxName = taxNameOf(taxUrl);
        var taxPath = taxPathOf(taxUrl);
        var taxWorks = null;
        if (taxPath.indexOf("category/") === 0) taxWorks = await loadList({ path: "c:" + taxPath.slice(9), page: 1 });
        else if (taxPath.indexOf("tag/") === 0) taxWorks = await loadList({ path: "t:" + taxPath.slice(4), page: 1 });
        else if (taxPath.indexOf("pornstars/") === 0) { var _ph = await httpGet(taxUrl); taxWorks = _ph ? parseList(_ph) : []; if (!taxWorks.length) taxWorks = await search({ keyword: taxName, page: 1 }); }
        else taxWorks = await search({ keyword: taxName, page: 1 });
        if (!Array.isArray(taxWorks)) taxWorks = [];
        var taxReal = taxWorks.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty" && w.id !== "tip"; });
        return {
          id: taxUrl,
          type: "detail",
          mediaType: "movie",
          title: taxName || (taxIsActress ? "演员" : "分类"),
          link: taxUrl,
          description: (taxIsActress ? "演员" : "分类") + " · 共 " + taxReal.length + " 部作品",
          videoUrl: "",
          childItems: [],
          relatedItems: taxReal.length ? taxReal : taxWorks
        };
      }
    } catch (eTax) {}

  var raw = unwrapLink(link);
  var slug = raw.replace(/^https?:\/\/javfeed\.site\/video\//i, "").replace(/^\/video\//i, "").replace(/\/$/, "");
  if (!slug || /^https?:\/\//i.test(slug)) {
    if (/^https?:\/\//i.test(raw)) return { id: raw, type: "url", title: "解析失败", description: "未找到播放地址" };
    return { id: "err", type: "url", title: "解析失败", description: "未找到播放地址" };
  }
  var durl = HOST + "/video/" + slug;
  try {
    var html = await httpGet(durl);
    if (!html) return { id: durl, type: "url", title: slug, description: "未找到播放地址" };
    var title = clean((html.match(/property="og:title" content="([^"]*)"/) || [])[1] || (html.match(/<title>([^<]*)<\/title>/) || [])[1] || slug);
    var pic = absUrl((html.match(/property="og:image" content="([^"]*)"/) || [])[1] || "");
    var ogVideo = (html.match(/property="og:video" content="([^"]*)"/) || [])[1] || "";
    if (!ogVideo) return { id: durl, type: "url", title: title, posterPath: pic, coverUrl: pic, backdropPath: pic, description: "未找到播放地址" };
    var masterUrl = absUrl(ogVideo);
    var masterText = await httpGet(masterUrl, durl);
    var quals = [];
    if (masterText && masterText.indexOf("#EXTM3U") > -1) {
      var mlines = masterText.split(/\r?\n/);
      for (var i = 0; i < mlines.length; i++) {
        var s = mlines[i].trim();
        var res = s.match(/RESOLUTION=\d+x(\d+)/);
        if (s.indexOf("#EXT-X-STREAM-INF") === 0 && res) {
          var uri = (mlines[i + 1] || "").trim();
          if (uri && uri.charAt(0) !== "#") {
            var abs = resolveUrl(uri, masterUrl);
            if (abs) quals.push({ h: parseInt(res[1], 10), url: abs });
          }
        }
      }
      quals.sort(function (a, b) { return b.h - a.h; });
    }
    var videoUrl = "";
    var desc = "";
    if (quals.length) {
      videoUrl = quals[0].url;
      var qnames = [];
      for (var q = 0; q < quals.length; q++) qnames.push(quals[q].h + "p");
      desc = "清晰度：" + qnames.join(" / ");
    } else {
      videoUrl = masterUrl;
      desc = "自适应";
    }
    // v1.0.1：quals 全量出集（原只取最高档）。每集名即档位（1080p/720p…），
    // videoUrl 为对应变体绝对地址；无变体时单集自适应（videoUrl 即 master）。
    var eps = [];
    var sEps = [];
    var items = [];
    var qi;
    if (quals.length) {
      for (qi = 0; qi < quals.length; qi++) {
        var qName = quals[qi].h + "p";
        var qUrl = quals[qi].url;
        var qTok = durl + "@@" + qUrl;
        eps.push({ name: qName, id: qTok, link: qTok });
        sEps.push({ title: qName, videoUrl: qUrl, episodeNumber: qi + 1 });
        items.push({ id: qUrl, type: "url", title: title + " " + qName, name: qName, mediaType: "movie", seasonNumber: 1, episodeNumber: qi + 1, videoUrl: qUrl, link: qTok, posterPath: pic, coverUrl: pic });
      }
    } else {
      eps.push({ name: "自适应", id: durl + "@@" + masterUrl, link: durl + "@@" + masterUrl });
      sEps.push({ title: "自适应", videoUrl: masterUrl, episodeNumber: 1 });
      items.push({ id: masterUrl, type: "url", title: title + " 自适应", name: "自适应", mediaType: "movie", seasonNumber: 1, episodeNumber: 1, videoUrl: masterUrl, link: durl + "@@" + masterUrl, posterPath: pic, coverUrl: pic });
    }
    return taxWire({
      id: durl,
      type: "detail",
      title: title,
      link: durl,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: desc,
      videoUrl: sEps[0].videoUrl,
      playerType: "app",
      customHeaders: { "User-Agent": UA, "Referer": durl },
      episodes: eps,
      seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: sEps }],
      episodeItems: items,
      childItems: items
    }, html);
  } catch (e) {
    return { id: durl, type: "url", title: "请求错误", description: "未找到播放地址：" + String((e && e.message) || e).slice(0, 60) };
  }
}

// v1.0.1 新增：点集回落入口。集 link 形态为 <详情页>@@<变体地址>，现解透传；
// 直接传变体直链时原样返回；直接传详情地址时重走 loadDetail 取首集。
async function loadResource(params) {
  var raw = unwrapLink(params);
  if (!raw && params && typeof params === "object") raw = unwrapLink(params.item);
  if (!raw) return [];
  var ref = HOST + "/";
  var target = raw;
  var at = raw.indexOf("@@");
  if (at >= 0) { ref = raw.slice(0, at); target = raw.slice(at + 2); }
  if (/^https?:\/\//.test(target)) {
    return [{ name: "播放", url: target, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": ref } }];
  }
  try {
    var det = await loadDetail(target);
    var s0 = det && det.seasons && det.seasons[0] && det.seasons[0].episodes && det.seasons[0].episodes[0];
    if (s0 && s0.videoUrl) return [{ name: "播放", url: s0.videoUrl, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": target } }];
  } catch (e) {}
  return [];
}
