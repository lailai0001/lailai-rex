// AnySex for REX (lai_anysex v1.0.0)
// 移植自 mira-cat 蜘蛛 py_anysex.js（只读蓝图），后端 https://anysex.com/。
// KVS 站。列表 24 条/页（搜索 50 条/页）；分类 79 个真实分类（/videos/categories/ 单页全量）；
// 顶级：最新/最热/评分最高/4K/全部类别（79 分类筛选卡片）/频道（30）/女优（40）。
// 播放：详情页 <video id="main_video"> 内 <source src title="<档>p">，三至四档 mp4
//   （720p/480p/240p，部分新片另有 1080p，H.264，实测 206）。
// 注意：播放地址须带详情页会话 cookie，无 cookie 时新鲜 token 立刻 410。
//   REX 侧：运行侧若回传响应头则显式取 Set-Cookie 发 Cookie 头，若不回传则靠
//   App 共享 Cookie jar（sextb 1.0.3 同款双路）。字幕：不接（欧美站无番号）。

WidgetMetadata = {
  id: "lai_anysex",
  title: "AnySex",
  description: "AnySex：KVS 欧美站，最新/最热/评分/4K + 79 类别/30 频道/40 女优筛选，详情三至四档 mp4",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://anysex.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "new" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "最热", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "popular" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "评分最高", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "toprated" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "4K", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "4k" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "全部类别", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "categories" }, { name: "sub", title: "类别", type: "enumeration", value: "step-family", enumOptions: [{"title": "Step Family", "value": "step-family"}, {"title": "Mom", "value": "mom"}, {"title": "Old+Young (18-25)", "value": "old-young"}, {"title": "Homemade", "value": "homemade"}, {"title": "Hot Teen 18+", "value": "teen"}, {"title": "Black porn", "value": "black-porn"}, {"title": "Granny", "value": "granny"}, {"title": "Compilation", "value": "compilation"}, {"title": "Amateur", "value": "amateur"}, {"title": "Anal", "value": "anal"}, {"title": "Vintage", "value": "vintage"}, {"title": "Lesbian", "value": "lesbian"}, {"title": "Cheating", "value": "cheating"}, {"title": "Milf", "value": "milf"}, {"title": "Big Dick", "value": "big-dick"}, {"title": "Cum in mouth", "value": "cum-in-mouth"}, {"title": "Celebrities", "value": "celebrities"}, {"title": "Housewife", "value": "housewive"}, {"title": "Threesome", "value": "threesome"}, {"title": "Mature", "value": "mature"}, {"title": "Close-up", "value": "close-up"}, {"title": "Cuckold", "value": "cuckold"}, {"title": "Reality", "value": "reality"}, {"title": "AI Generated", "value": "ai"}, {"title": "Japanese", "value": "japanese"}, {"title": "Cream Pie", "value": "cream-pie"}, {"title": "Masturbation", "value": "masturbation"}, {"title": "BBW", "value": "bbw"}, {"title": "Hentai", "value": "hentai"}, {"title": "Bisexual", "value": "bisexual"}, {"title": "Beauty", "value": "beauty"}, {"title": "Orgasm", "value": "orgasm"}, {"title": "Hairy", "value": "hairy"}, {"title": "Upskirt", "value": "upskirt"}, {"title": "Gangbang", "value": "gangbang"}, {"title": "Latina", "value": "latina"}, {"title": "Interracial", "value": "interracial"}, {"title": "BDSM", "value": "bdsm"}, {"title": "Erotic", "value": "erotic"}, {"title": "Swingers", "value": "swingers"}, {"title": "Teacher", "value": "teacher"}, {"title": "Hardcore", "value": "hardcore"}, {"title": "Massage", "value": "massage"}, {"title": "Big Tits", "value": "big-tits"}, {"title": "POV", "value": "pov"}, {"title": "Sex Toys", "value": "sex-toys"}, {"title": "Thick Ass", "value": "ass"}, {"title": "Indian", "value": "indian"}, {"title": "Femdom", "value": "femdom"}, {"title": "College", "value": "college"}, {"title": "Squirting", "value": "squirting"}, {"title": "Ebony", "value": "ebony"}, {"title": "Double Penetration", "value": "dp"}, {"title": "Public", "value": "public"}, {"title": "Handjob", "value": "handjob"}, {"title": "Party", "value": "party"}, {"title": "Small Tits", "value": "small-tits"}, {"title": "Cumshot", "value": "cumshot"}, {"title": "Lingerie", "value": "lingerie"}, {"title": "Arab", "value": "arab"}, {"title": "Orgy", "value": "orgy"}, {"title": "Russian Girl", "value": "russian"}, {"title": "Asian", "value": "asian"}, {"title": "Blowjob", "value": "blowjob"}, {"title": "Webcam", "value": "webcam"}, {"title": "Beach", "value": "beach"}, {"title": "Uniform", "value": "uniform"}, {"title": "Fisting", "value": "fisting"}, {"title": "Doggystyle", "value": "doggystyle"}, {"title": "Office", "value": "office"}, {"title": "Brazilian", "value": "brazilian"}, {"title": "Outdoor", "value": "outdoor"}, {"title": "British 🇬🇧", "value": "british"}, {"title": "Stockings", "value": "stockings"}, {"title": "German", "value": "german"}, {"title": "French", "value": "french"}, {"title": "Pantyhose", "value": "pantyhose"}, {"title": "Italian", "value": "italian"}, {"title": "Footjob", "value": "footjob"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "频道", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "channels" }, { name: "sub", title: "频道", type: "enumeration", value: "fame-digital", enumOptions: [{"title": "Fame Digital", "value": "fame-digital"}, {"title": "21 Sextury", "value": "21-sextury"}, {"title": "JAVHD", "value": "jav-hd"}, {"title": "Naughty America", "value": "naughty-america"}, {"title": "All Adult Pass", "value": "all-adult-pass"}, {"title": "Pornstar", "value": "pornstar"}, {"title": "All Porn Sites Pass", "value": "all-porn-sites-pass"}, {"title": "My XXX Pass", "value": "my-xxx-pass"}, {"title": "Evil Angel", "value": "evil-angel"}, {"title": "Reality Kings", "value": "reality-kings"}, {"title": "WTF Pass", "value": "wtf-pass"}, {"title": "Team Skeet", "value": "team-skeet"}, {"title": "Bangbros Network", "value": "bang-bros-network"}, {"title": "Brazzers", "value": "brazzers-network"}, {"title": "Av Idolz", "value": "avidolz"}, {"title": "DDF Network", "value": "ddf-network"}, {"title": "The Classic Porn", "value": "the-classic-porn"}, {"title": "Wicked", "value": "wicked"}, {"title": "All Of Gfs", "value": "all-of-gfs"}, {"title": "Mofos", "value": "mofos-network"}, {"title": "Pornstar Network", "value": "pornstar-network"}, {"title": "Private", "value": "private"}, {"title": "1 Pass For All Sites", "value": "1-pass-for-all-sites"}, {"title": "New Sensations", "value": "new-sensations"}, {"title": "Jav HQ", "value": "jav-hq"}, {"title": "CumLouder", "value": "cum-louder"}, {"title": "Babes", "value": "babes"}, {"title": "Dogfart Network", "value": "dog-fart-network"}, {"title": "Mile High Media", "value": "mile-high-media"}, {"title": "Open Life", "value": "open-life"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "女优", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "models" }, { name: "sub", title: "女优", type: "enumeration", value: "india-summer", enumOptions: [{"title": "India Summer", "value": "india-summer"}, {"title": "Bridgette B", "value": "bridgette-b"}, {"title": "Aletta Ocean", "value": "aletta-ocean"}, {"title": "Britney Amber", "value": "britney-amber"}, {"title": "Sunny Leone", "value": "sunny-leone"}, {"title": "Jennifer White", "value": "jennifer-white"}, {"title": "Cory Chase", "value": "cory-chase"}, {"title": "Anissa Kate", "value": "anissa-kate"}, {"title": "Asa Akira", "value": "asa-akira"}, {"title": "Lauren Phillips", "value": "lauren-phillips"}, {"title": "Sophie Moone", "value": "sophie-moone"}, {"title": "Alektra Blue", "value": "alektra-blue"}, {"title": "Francesca Le", "value": "francesca-le"}, {"title": "Chanel Preston", "value": "chanel-preston"}, {"title": "Lisa Ann", "value": "lisa-ann"}, {"title": "Brandi Love", "value": "brandi-love"}, {"title": "Krissy Lynn", "value": "krissy-lynn"}, {"title": "Sarah Vandella", "value": "sarah-vandella"}, {"title": "Bree Olson", "value": "bree-olson"}, {"title": "Ava Addams", "value": "ava-addams"}, {"title": "Valentina Nappi", "value": "valentina-nappi"}, {"title": "Julia Ann", "value": "julia-ann"}, {"title": "Kenzie Reeves", "value": "kenzie-reeves"}, {"title": "Casey Calvert", "value": "casey-calvert"}, {"title": "Whitney Wright", "value": "whitney-wright"}, {"title": "Rachel Roxxx", "value": "rachel-roxxx"}, {"title": "Tina Kay", "value": "tina-kay"}, {"title": "Adriana Chechik", "value": "adriana-chechik"}, {"title": "Cherie Deville", "value": "cherie-deville"}, {"title": "Angela White", "value": "angela-white"}, {"title": "Riley Reid", "value": "riley-reid"}, {"title": "Madison Ivy", "value": "madison-ivy"}, {"title": "Emily Willis", "value": "emily-willis"}, {"title": "Alexis Fawx", "value": "alexis-fawx"}, {"title": "Nicole Aniston", "value": "nicole-aniston"}, {"title": "Ava Devine", "value": "ava-devine"}, {"title": "Aaliyah Love", "value": "aaliyah-love"}, {"title": "Eliza Ibarra", "value": "eliza-ibarra"}, {"title": "Alexis Crystal", "value": "alexis-crystal"}, {"title": "Rachel Starr", "value": "rachel-starr"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://anysex.com";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
var PAGE_SIZE = 24;
var SEARCH_SIZE = 50;

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  return t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); });
}

function cleanLabel(s) {
  return decodeHtml(String(s || "").replace(/<[^>]+>/g, ""))
    .replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return HOST + "/" + u;
}

function normUrl(u) {
  var s = t(u);
  if (!s) return "";
  s = s.replace(/^(https?:)\/([^/])/, "$1//$2");
  return s;
}

// 取页：回 {html, cookie}。运行侧若回传响应头则显式取 Set-Cookie，
// 若不回传则靠 App 共享 Cookie jar（sextb 1.0.3 同款双路）。
async function getPage(url, referer) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Referer": referer || HOST + "/"
      }
    });
    var data = res && res.data;
    var html = typeof data === "string" ? data : (data ? JSON.stringify(data) : "");
    var cookie = "";
    try {
      var hdrs = res && res.headers;
      if (hdrs) {
        var sc = hdrs["set-cookie"] || hdrs["Set-Cookie"] || hdrs["SET-COOKIE"];
        if (Array.isArray(sc)) cookie = sc.map(function (c) { return String(c).split(";")[0].trim(); }).filter(Boolean).join("; ");
        else if (typeof sc === "string") cookie = sc.split(";")[0].trim();
      }
    } catch (e) { cookie = ""; }
    return { html: html, cookie: cookie };
  } catch (e) {
    return { html: "", cookie: "" };
  }
}

async function getHtml(url, referer) {
  var p = await getPage(url, referer);
  return p.html;
}

// 播放鉴权缓存：播放地址 -> {cookie, referer}（detail 登记，loadResource 取用）。
var playAuthCache = {};
function cacheAuth(url, cookie, referer) {
  if (!url) return;
  playAuthCache[url] = { cookie: cookie || "", referer: referer || "" };
}

function listUrl(zone, sub, page) {
  var base;
  if (zone === "new") base = HOST + "/videos/new/";
  else if (zone === "popular") base = HOST + "/videos/most-viewed/";
  else if (zone === "toprated") base = HOST + "/videos/top-rated/";
  else if (zone === "4k") base = HOST + "/videos/4k/";
  else if (zone === "categories") base = HOST + "/videos/categories/" + (sub || "step-family") + "/";
  else if (zone === "channels") base = HOST + "/channels/" + (sub || "fame-digital") + "/";
  else if (zone === "models") base = HOST + "/models/" + (sub || "india-summer") + "/";
  else base = HOST + "/videos/new/";
  return page > 1 ? base + page + "/" : base;
}

// 列表：每条一个 <div class="item" data-video-id>；详情链接在 a.popfire 上，
// 标题取 img alt（无 alt 时取 strong.title），封面取 img src，清晰度在 .is-hd、时长在 .duration。
function parseList(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<a[^>]+href="(https:\/\/anysex\.com\/video\/\d+\/[^"]+\/)"[^>]*class="popfire"[^>]*>/gi;
  var m;
  while ((m = re.exec(html))) {
    var href = m[1];
    if (seen[href]) continue;
    seen[href] = 1;
    var tail = html.slice(m.index, m.index + 1800);
    var title = "";
    var pic = "";
    var im = tail.match(/<img[^>]+src="(https?:\/\/[^"]+)"[^>]*alt="([^"]*)"/i)
      || tail.match(/<img[^>]+alt="([^"]*)"[^>]*src="(https?:\/\/[^"]+)"/i);
    if (im) {
      if (/^https?:\/\//i.test(im[1])) { pic = im[1]; title = im[2]; }
      else { title = im[1]; pic = im[2]; }
    }
    if (!title) {
      var tm = tail.match(/<strong class="title">\s*([\s\S]*?)\s*<\/strong>/i);
      if (tm) title = tm[1];
    }
    title = decodeHtml(title);
    var qm = tail.match(/class="is-hd[^"]*">\s*([^<]+?)\s*<\/span>/i);
    var dm = tail.match(/class="duration">\s*([^<]+?)\s*<\/div>/i);
    var remarks = [qm ? t(qm[1]) : "", dm ? t(dm[1]) : ""].filter(Boolean).join(" ");
    out.push({
      id: href,
      type: "url",
      title: title || href,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: href,
      description: remarks,
      mediaType: "movie"
    });
  }
  return out;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function pagecountFromHtml(html, page, list, pageSize) {
  var max = 0;
  var pi = html.indexOf("pagination");
  if (pi >= 0) {
    var blk = html.slice(pi, pi + 6000);
    var end = blk.indexOf("</ul>");
    var seg = end >= 0 ? blk.slice(0, end) : blk;
    var re = /<a[^>]*>\s*(\d+)\s*<\/a>/g;
    var m;
    while ((m = re.exec(seg))) {
      var n = parseInt(m[1], 10);
      if (n > max) max = n;
    }
    var re2 = /href="[^"]*\/(\d+)\/"/g;
    while ((m = re2.exec(seg))) {
      var n2 = parseInt(m[1], 10);
      if (n2 > max) max = n2;
    }
  }
  if (max >= page) return max;
  return list.length < pageSize ? page : page + 1;
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "new");
  var sub = t(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var html = await getHtml(listUrl(zone, sub, page));
    var list = parseList(html);
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
    var q = "q=" + encodeURIComponent(wd);
    var url = page > 1 ? HOST + "/search/" + page + "/?" + q : HOST + "/search/?" + q;
    var html = await getHtml(url);
    var list = parseList(html);
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

async function loadDetail(link) {
  try {
    var url = unwrapLink(link);
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    if (url.indexOf("http") !== 0) url = absUrl(url);
    var pg = await getPage(url, url);
    var html = pg.html;
    if (!html) return { id: url, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = "";
    var og = html.match(/property="og:title"[^>]*content="([^"]+)"/i)
      || html.match(/content="([^"]+)"[^>]*property="og:title"/i);
    if (og) name = decodeHtml(og[1]);
    if (!name) {
      var hm = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (hm) name = cleanLabel(hm[1]);
    }
    var pic = "";
    var pm = html.match(/property="og:image"[^>]*content="([^"]+)"/i)
      || html.match(/content="([^"]+)"[^>]*property="og:image"/i);
    if (pm) pic = normUrl(absUrl(pm[1]));
    // 播放：<video id="main_video"> 内 <source src title="<档>p">，有几档出几档。
    var tiers = [];
    var seen = {};
    var re = /<source[^>]+src="([^"]+\.mp4[^"]*)"[^>]*title="([^"]+)"[^>]*>/gi;
    var m;
    while ((m = re.exec(html))) {
      var label = t(m[2]);
      if (!label || seen[label]) continue;
      seen[label] = 1;
      tiers.push({ label: label, url: m[1].replace(/&amp;/g, "&") });
    }
    tiers.sort(function (a, b) { return parseInt(b.label, 10) - parseInt(a.label, 10); });
    // 登记会话 cookie：无 cookie 时播放地址立刻 410，loadResource 须带上。
    for (var k = 0; k < tiers.length; k++) cacheAuth(tiers[k].url, pg.cookie, url);
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    for (var i = 0; i < tiers.length; i++) {
      var q = tiers[i];
      var id = url + "@@Q:" + q.label;
      eps.push({ name: q.label, link: id });
      seasonEps.push({ title: q.label, videoUrl: q.url, episodeNumber: i + 1 });
      var hdrs = { "User-Agent": UA, "Referer": HOST + "/" };
      if (pg.cookie) hdrs["Cookie"] = pg.cookie;
      epItems.push({
        id: id,
        type: "url",
        title: q.label,
        mediaType: "movie",
        posterPath: pic,
        videoUrl: q.url,
        link: id,
        episode: i + 1,
        episodeNumber: i + 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system",
        customHeaders: hdrs
      });
    }
    var result = {
      id: url,
      type: "detail",
      title: name || url,
      name: name || url,
      description: tiers.length ? "清晰度（有几档出几档）" : "未找到播放地址",
      mediaType: "movie",
      link: url,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app"
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "清晰度", name: "清晰度", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
      result.videoUrl = tiers[0].url;
    }
    return result;
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
  // 档位入口：@@Q:<label> -> 回详情取该档直链（带登记的 cookie）
  var at = raw.indexOf("@@Q:");
  if (at >= 0) {
    var durl = raw.slice(0, at);
    var label = raw.slice(at + 4);
    try {
      var det = await loadDetail(durl);
      var items = det && det.episodeItems;
      if (items) {
        for (var i = 0; i < items.length; i++) {
          if (items[i].title === label && items[i].videoUrl) {
            return [{ name: label, url: items[i].videoUrl, playerType: "system", customHeaders: items[i].customHeaders || { "User-Agent": UA, "Referer": HOST + "/" } }];
          }
        }
      }
    } catch (e) { /* fall through */ }
    return [];
  }
  // 直链 mp4：带登记的 cookie（若有）
  if (/\.mp4(\?|#|$)/i.test(raw)) {
    var hdrs2 = { "User-Agent": UA, "Referer": HOST + "/" };
    var hit = playAuthCache[raw];
    if (hit) {
      if (hit.cookie) hdrs2["Cookie"] = hit.cookie;
      if (hit.referer) hdrs2["Referer"] = hit.referer;
    }
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: hdrs2 }];
  }
  // 兜底：详情地址 -> 取详情首档
  try {
    var det2 = await loadDetail(raw);
    var eps = det2 && det2.episodeItems;
    if (eps && eps.length && eps[0].videoUrl) {
      return [{ name: eps[0].title || "播放", url: eps[0].videoUrl, playerType: "system", customHeaders: eps[0].customHeaders || { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
  } catch (e) { /* fall through */ }
  return [];
}
