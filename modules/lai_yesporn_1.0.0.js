// YesPorn for REX (lai_yesporn v1.0.0)
// 移植自 mira-cat 蜘蛛 py_yesporn.js（只读蓝图），后端 https://yesporn.vip/。
// KVS 站。列表 20 条/页，p1/p2 零重叠；分类 58 个真实分类；搜索翻页走
// ?from_videos=<页码>（/search/<q>/2/ 是 404）。
// 封面：列表前 4 条是 eager 图（img src 即真封面），其余 16 条是懒加载
// （src 为 1x1 gif data URI，真封面在 data-original，另有 data-webp）。
// 播放 v2（走下载腿，猫源 v2 用户真机确认可播）：
// 令牌是 42 位 hex（不是 48 位）：前 32 位按文件恒定、后 10 位随出口 IP 变；
// 详情页 flashvars 令牌取 /5/ 文件在 VM/Worker/真机三侧全灭（详情腿判死）。
// 下载页 view_video_download.php?id=<id>&format=<档位> 里现铸的令牌取文件全通；
// 下载页不带 cookie/Referer 也能出链接（链接已在 HTML 里）；文件请求必须带任一
// 有效匿名会话 cookie（无 cookie → 410）。集名携带视频 id + 档位，点播时现取
// 下载页、现铸现播；无此档位时回退次档，绝不回空 url（空 url＝无限转圈）。
// 档位只出 flashvars 里有的，有几档出几档；详情页的直链令牌已死，不再放进集名。
// 字幕：不接。

WidgetMetadata = {
  id: "lai_yesporn",
  title: "YesPorn",
  description: "YesPorn：KVS 站，最新/最热/评分 + 58 类别筛选，点播走下载页现铸令牌（1080p/720p/480p）",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://yesporn.vip",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "最热", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "popular" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "评分最高", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "top" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "全部类别", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "categories" }, { name: "sub", title: "类别", type: "enumeration", value: "gilf", enumOptions: [{"title": "GILF", "value": "gilf"}, {"title": "Doctor", "value": "doctor"}, {"title": "BBW", "value": "bbw"}, {"title": "Fetish", "value": "fetish"}, {"title": "Cheating", "value": "cheating"}, {"title": "Striptease", "value": "striptease"}, {"title": "Big Ass", "value": "big-ass"}, {"title": "Sex", "value": "sex"}, {"title": "Mature", "value": "mature"}, {"title": "MILF", "value": "milf"}, {"title": "Stepmom", "value": "stepmom"}, {"title": "Anal", "value": "anal"}, {"title": "Latina", "value": "latina"}, {"title": "Big Dick", "value": "big-dick"}, {"title": "Facial", "value": "facial"}, {"title": "Step Daughter", "value": "step-daughter"}, {"title": "Step sister", "value": "step-sister"}, {"title": "Uncategorized", "value": "uncategorized"}, {"title": "Big tits", "value": "big-tits"}, {"title": "Family", "value": "family"}, {"title": "Blowjob", "value": "blowjob"}, {"title": "Deep Throat", "value": "deep-throat"}, {"title": "Ebony", "value": "ebony"}, {"title": "Tattoo", "value": "tattoo"}, {"title": "Massage", "value": "massage"}, {"title": "Curvy", "value": "curvy"}, {"title": "Creampie", "value": "creampie"}, {"title": "Japanese", "value": "japanese"}, {"title": "shaved pussy", "value": "shaved-pussy"}, {"title": "Brunette", "value": "brunette"}, {"title": "Car", "value": "car"}, {"title": "Interracial", "value": "interracial"}, {"title": "Blonde", "value": "blonde"}, {"title": "Cuckold", "value": "cuckold"}, {"title": "Hardcore", "value": "hardcore"}, {"title": "Hairy Pussy", "value": "hairy-pussy"}, {"title": "Sex Toys", "value": "sex-toys"}, {"title": "POV", "value": "pov"}, {"title": "Voyeur", "value": "voyeur"}, {"title": "Threesome", "value": "threesome"}, {"title": "Skinny", "value": "skinny"}, {"title": "Orgasm", "value": "orgasm"}, {"title": "Asian", "value": "asian"}, {"title": "Big Boobs", "value": "big-boobs"}, {"title": "BBC", "value": "bbc"}, {"title": "Lingerie", "value": "lingerie"}, {"title": "Public", "value": "public"}, {"title": "DP", "value": "dp"}, {"title": "Outdoor", "value": "outdoor"}, {"title": "Cosplay", "value": "cosplay"}, {"title": "Small tits", "value": "small-tits"}, {"title": "Teen", "value": "teen"}, {"title": "Gangbang", "value": "gangbang"}, {"title": "Lesbians", "value": "lesbian"}, {"title": "Swingers", "value": "swingers"}, {"title": "BDSM", "value": "bdsm"}, {"title": "Feet", "value": "feet"}, {"title": "Orgy", "value": "orgy"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://yesporn.vip";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
var PAGE_SIZE = 20;
var SEARCH_SIZE = 20;

// 下载页的档位号（format 参数）：只认这三个；站内没有的档位不硬编。
var DL_FMTS = [1080, 720, 480];

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

function listUrl(eff, page) {
  var base;
  if (eff === "latest") base = HOST + "/latest-updates/";
  else if (eff === "popular") base = HOST + "/most-popular/";
  else if (eff === "top") base = HOST + "/top-rated/";
  else base = HOST + "/categories/" + eff + "/";
  return page > 1 ? base + page + "/" : base;
}

// 列表：每条一个 <div class="thumb ... item">；详情链接与标题在锚点上，
// 封面取 img data-original 优先（懒加载图真地址），清晰度在 .qualtiy、时长在 .time。
function parseList(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<a[^>]+href="(https:\/\/yesporn\.vip\/video\/\d+\/[^"]+\/)"[^>]*title="([^"]+)"[^>]*>/gi;
  var m;
  while ((m = re.exec(html))) {
    var href = m[1];
    if (seen[href]) continue;
    seen[href] = 1;
    var title = decodeHtml(m[2]);
    var tail = html.slice(m.index, m.index + 2000);
    var pic = "";
    var imgTag = tail.match(/<img[^>]*>/i);
    if (imgTag) {
      var tag = imgTag[0];
      var dm = tag.match(/data-original="(https?:\/\/[^"]+)"/i)
        || tag.match(/data-webp="(https?:\/\/[^"]+)"/i)
        || tag.match(/\ssrc="(https?:\/\/[^"]+)"/i);
      if (dm) pic = dm[1];
    }
    var qm = tail.match(/class="qualtiy">\s*([^<]+?)\s*<\/div>/i);
    var tm = tail.match(/class="time">\s*([^<]+?)\s*<\/div>/i);
    var remarks = [qm ? t(qm[1]) : "", tm ? t(tm[1]) : ""].filter(Boolean).join(" ");
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
  var zone = t(params.zone || "latest");
  var sub = t(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var eff = zone === "categories" ? (sub || "gilf") : zone;
  try {
    var html = await getHtml(listUrl(eff, page));
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
    var base = HOST + "/search/" + encodeURIComponent(wd) + "/";
    var url = page > 1 ? base + "?from_videos=" + page : base;
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

// flashvars 三档解析（只用于详情的档位清单）：video_url /
// video_alt_url / video_alt_url2，档位名取 *_text。返回按清晰度数字
// 从高到低排好的 [{label}]。直链本身已死，不再取 url。
function parseTiers(html) {
  var tiers = [];
  var seen = {};
  function push(label) {
    label = t(label);
    if (!label || seen[label]) return;
    seen[label] = 1;
    tiers.push({ label: label });
  }
  function g(re) {
    var mm = html.match(re);
    return mm ? mm[1] : "";
  }
  if (/video_url:\s*'function\/0\//.test(html)) push(g(/video_url_text:\s*'([^']+)'/));
  if (/video_alt_url:\s*'function\/0\//.test(html)) push(g(/video_alt_url_text:\s*'([^']+)'/));
  if (/video_alt_url2:\s*'function\/0\//.test(html)) push(g(/video_alt_url2_text:\s*'([^']+)'/));
  tiers.sort(function (a, b) { return parseInt(b.label, 10) - parseInt(a.label, 10); });
  return tiers;
}

async function loadDetail(link) {
  try {
    var url = unwrapLink(link);
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    if (url.indexOf("http") !== 0) url = absUrl(url);
    var html = await getHtml(url, url);
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
    if (pm) pic = absUrl(pm[1]);
    // 播放 v2：档位只出 flashvars 里有的，有几档出几档；详情页的直链令牌已死，
    // 详情只存档位名，点播由 loadResource 走下载页现铸令牌。
    var tiers = parseTiers(html);
    var vm = url.match(/\/video\/(\d+)\//);
    var vid = vm ? vm[1] : "";
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    for (var i = 0; i < tiers.length; i++) {
      var label = tiers[i].label;
      var id = vid + "@@YP:" + label;
      eps.push({ name: label, link: id });
      seasonEps.push({ title: label, episodeNumber: i + 1 });
      epItems.push({
        id: id,
        type: "url",
        title: label,
        mediaType: "movie",
        posterPath: pic,
        link: id,
        episode: i + 1,
        episodeNumber: i + 1,
        seasonIndex: 1,
        seasonNumber: 1
      });
    }
    var result = {
      id: url,
      type: "detail",
      title: name || url,
      name: name || url,
      description: tiers.length ? "清晰度（点播现铸令牌）" : "未找到播放地址",
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
    }
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// 从下载页 HTML 提取下载链接：接受任意类型号（/3/ 或 /5/）。链接可能带
// ?download_filename=…&download=true，有无均可，保留原样。每档下载页只含该档一条链接，
// 优先按档位文件名匹配（_720p/_1080p），否则取第一条。
function extractDlLink(html, wantFmt) {
  if (!html) return "";
  var links = [];
  var re = /href="([^"]*get_file[^"]*)"/gi;
  var m;
  while ((m = re.exec(html))) links.push(m[1].replace(/&amp;/g, "&"));
  if (!links.length) {
    var re2 = /(https?:\/\/yesporn\.vip)?\/get_file\/\d\/[0-9a-f]{42}\/\d+\/\d+\/[\w.-]+\/?(\?[^"'\s<>]*)?/gi;
    while ((m = re2.exec(html))) links.push(m[0]);
  }
  if (!links.length) return "";
  function pick(pred) {
    for (var i = 0; i < links.length; i++) {
      if (pred(links[i])) return links[i];
    }
    return "";
  }
  if (wantFmt === 720) return absUrl(pick(function (u) { return /_720p\.mp4/i.test(u); }) || links[0]);
  if (wantFmt === 1080) return absUrl(pick(function (u) { return /_1080p\.mp4/i.test(u); }) || links[0]);
  return absUrl(pick(function (u) { return !/_720p\.mp4/i.test(u) && !/_1080p\.mp4/i.test(u); }) || links[0]);
}

// 下载腿：取下载页现铸令牌。wantFmt 无链接时按档位递减回退到实际有的最高档；全部无链接返回 null。
async function downloadLeg(vid, wantFmt) {
  var order = [];
  for (var i = 0; i < DL_FMTS.length; i++) {
    if (DL_FMTS[i] <= wantFmt) order.push(DL_FMTS[i]);
  }
  for (var k = 0; k < order.length; k++) {
    var fmt = order[k];
    var dlUrl = HOST + "/view_video_download.php?id=" + vid + "&format=" + fmt;
    var pg = await getPage(dlUrl, HOST + "/");
    var link = extractDlLink(pg.html, fmt);
    if (link) {
      return { url: link, fmt: fmt, dlUrl: dlUrl, cookie: pg.cookie };
    }
  }
  return null;
}

async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 档位入口：<vid>@@YP:<label> -> 走下载页现铸令牌（现取现播）
  var at = raw.indexOf("@@YP:");
  if (at >= 0) {
    var vid = raw.slice(0, at);
    var label = raw.slice(at + 5);
    var wantFmt = parseInt(label, 10) || 720;
    if (DL_FMTS.indexOf(wantFmt) < 0) wantFmt = 720;
    var hit = await downloadLeg(vid, wantFmt);
    if (hit) {
      var header = { "User-Agent": UA, "Referer": hit.dlUrl };
      if (hit.cookie) header["Cookie"] = hit.cookie;
      return [{ name: label, url: hit.url, playerType: "system", customHeaders: header }];
    }
    // 该片下载页上没有任何可播档位：回 [] 报解不出，不交嗅探卡。
    return [];
  }
  // 直链 get_file：带 Referer 直出（令牌现铸的才有效）
  if (/get_file/i.test(raw) && /^https?:\/\//.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  }
  // 兜底：详情地址 -> 取详情首档
  try {
    var det = await loadDetail(raw);
    var eps = det && det.episodeItems;
    if (eps && eps.length) {
      return await loadResource({ link: eps[0].id });
    }
  } catch (e) { /* fall through */ }
  return [];
}
