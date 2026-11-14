// Av77 for REX (lai_av77 v1.0.0)
// 移植自 mira-cat 蜘蛛 py_av77.js（只读蓝图），后端 https://av77.com/。
// 列表：按 <div class="thumbnail group"> 切块，字面 <a href="/<slug>">（Alpine 模板 :href 排除），
//   封面 data-src 优先（须为字面 http(s)，:data-src 表达式与 data: 占位图排除），时长取首个 H:MM(:SS)。
// 详情：og:title/og:image/og:description。
// 播放：详情页 Dean Edwards packer（两种方言）解包 -> source/source842/source1280 或 f/d/b 三变量。
//   (1) master 为 mp4 -> 直接 mp4 线（档位取 /<NNN>p.mp4 或 fullhd -> 1080p，否则 原画），playerType "app"。
//   (2) master 为 player.xxnet999.com -> 单线「原画」直出主播单地址（媒体播单 AES-128 或 smil 主播单，
//       5 档只标带宽不标分辨率，不猜档位），playerType "system"。
//   (3) surrit.com/<uuid>/playlist.m3u8（MissAV CDN，主播单 360p/480p/720p；FC2 两档）或
//       v6.slv525627.com / krevonix.com -> 走站方自有代理 PL3（https://pl3.vvvvvvvv.top/api/play?url=，
//       原 URL 直接追加、不编码；直连 surrit = CF 403，必须走 PL3；PL3 偶发 500，重试一次）取主播单，
//       按 RESOLUTION 实测档位出线。变体地址点播现取（懒解析 @@AV77:），不把详情时取的地址存进集里。
//   (4) 无 packer -> 下载按钮直链 MP4（<a href="...mp4">，排除 preview.mp4）。
// 分类：14 个顶级 + 4 组筛选卡片（類型 37 / 無碼影片 14 / 素人 5 / 亞洲AV 11）。
// 搜索：/search/<词>?page=N。
// 字幕：猫源字幕芯是猫源专属，REX 版不接（javhey 同款）。

WidgetMetadata = {
  id: "lai_av77",
  title: "Av77",
  description: "Av77：14 顶级 + 4 组筛选卡片，packer 解包取源，surrit 主播单走站方 PL3 代理按实测档位出线",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://av77.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最近更新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "new" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "中文字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "chinese-subtitle" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "類型", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "genres" }, { name: "sub", title: "類型", type: "enumeration", value: "Gachi", enumOptions: [{"title": "外国女优", "value": "外国女优"}, {"title": "独家", "value": "独家"}, {"title": "中出", "value": "中出"}, {"title": "单体作品", "value": "单体作品"}, {"title": "巨乳", "value": "巨乳"}, {"title": "人妻", "value": "人妻"}, {"title": "熟女", "value": "熟女"}, {"title": "素人", "value": "素人"}, {"title": "美少女", "value": "美少女"}, {"title": "口交", "value": "口交"}, {"title": "薄格", "value": "薄格"}, {"title": "多人运动", "value": "多人运动"}, {"title": "骑乘", "value": "骑乘"}, {"title": "痴女", "value": "痴女"}, {"title": "4小时以上", "value": "4小时以上"}, {"title": "女高中生", "value": "女高中生"}, {"title": "潮吹", "value": "潮吹"}, {"title": "合集", "value": "合集"}, {"title": "自拍", "value": "自拍"}, {"title": "乳交", "value": "乳交"}, {"title": "苗条", "value": "苗条"}, {"title": "恋物癖", "value": "恋物癖"}, {"title": "企划", "value": "企划"}, {"title": "美乳", "value": "美乳"}, {"title": "乱伦", "value": "乱伦"}, {"title": "搭讪", "value": "搭讪"}, {"title": "NTR", "value": "NTR"}, {"title": "偷拍", "value": "偷拍"}, {"title": "颜射", "value": "颜射"}, {"title": "淫乱", "value": "淫乱"}, {"title": "自慰", "value": "自慰"}, {"title": "剧情", "value": "剧情"}, {"title": "手淫", "value": "手淫"}, {"title": "姐姐", "value": "姐姐"}, {"title": "羞辱", "value": "羞辱"}, {"title": "拘束", "value": "拘束"}, {"title": "纪录片", "value": "纪录片"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "無碼影片", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "uncensored" }, { name: "sub", title: "無碼影片", type: "enumeration", value: "uncensored-leak", enumOptions: [{"title": "無碼流出", "value": "uncensored-leak"}, {"title": "FC2", "value": "fc2"}, {"title": "HEYZO", "value": "heyzo"}, {"title": "東京熱", "value": "tokyohot"}, {"title": "一本道", "value": "1pondo"}, {"title": "Caribbeancom", "value": "caribbeancom"}, {"title": "Caribbeancompr", "value": "caribbeancompr"}, {"title": "10musume", "value": "10musume"}, {"title": "pacopacomama", "value": "pacopacomama"}, {"title": "Gachinco", "value": "gachinco"}, {"title": "XXX-AV", "value": "xxxav"}, {"title": "人妻斬", "value": "marriedslash"}, {"title": "頑皮 4610", "value": "naughty4610"}, {"title": "頑皮 0930", "value": "naughty0930"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "amateur" }, { name: "sub", title: "素人", type: "enumeration", value: "siro", enumOptions: [{"title": "SIRO", "value": "siro"}, {"title": "LUXU", "value": "luxu"}, {"title": "PRESTIGE PREMIUM", "value": "maan"}, {"title": "S-CUTE", "value": "scute"}, {"title": "ARA", "value": "ara"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "亞洲AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "asian" }, { name: "sub", title: "亞洲AV", type: "enumeration", value: "madou", enumOptions: [{"title": "麻豆傳媒", "value": "madou"}, {"title": "TWAV", "value": "twav"}, {"title": "Furuke", "value": "furuke"}, {"title": "韓國直播", "value": "klive"}, {"title": "中國直播", "value": "clive"}, {"title": "抖阴视频", "value": "tiktok"}, {"title": "明星换脸", "value": "starface"}, {"title": "主播直播", "value": "cnlive"}, {"title": "国产传媒", "value": "cmedia"}, {"title": "玩偶姐姐", "value": "playgirl"}, {"title": "网-曝-门", "value": "netdoor"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "国产AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "madou" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "kinostream", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "kinostream" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "时间工作室", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "timestudio" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "成人动漫", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "anime" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "VR", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "vr" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "AV解说", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "avtalk" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "马赛姆", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "masem" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "猎奇", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "plantsvscunts" }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://av77.com";
var PL3 = "https://pl3.vvvvvvvv.top/api/play?url=";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

var GENRE_VALUES = ["外国女优", "独家", "中出", "单体作品", "巨乳", "人妻", "熟女", "素人", "美少女", "口交", "薄格", "多人运动", "骑乘", "痴女", "4小时以上", "女高中生", "潮吹", "合集", "自拍", "乳交", "苗条", "恋物癖", "企划", "美乳", "乱伦", "搭讪", "NTR", "偷拍", "颜射", "淫乱", "自慰", "剧情", "手淫", "姐姐", "羞辱", "拘束", "纪录片"];
var UNCENSORED_VALUES = ["uncensored-leak", "fc2", "heyzo", "tokyohot", "1pondo", "caribbeancom", "caribbeancompr", "10musume", "pacopacomama", "gachinco", "xxxav", "marriedslash", "naughty4610", "naughty0930"];
var AMATEUR_VALUES = ["siro", "luxu", "maan", "scute", "ara"];
var ASIAN_VALUES = ["madou", "twav", "furuke", "klive", "clive", "tiktok", "starface", "cnlive", "cmedia", "playgirl", "netdoor"];

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  // 站内 og:image 是 HTML 实体编码（含 &#x2F; / &#x3D; 等十六进制实体），须全解
  var out = t(s).replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
  out = out.replace(/&#x([0-9a-fA-F]+);/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); });
  out = out.replace(/&#(\d+);/g, function (m, d) { return String.fromCharCode(parseInt(d, 10)); });
  return out;
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return HOST + "/" + u;
}

function pl3wrap(u) {
  return PL3 + u;
}

async function getHtml(url, referer) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Referer": referer || HOST + "/"
      }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body;
  } catch (e) { return ""; }
}

// ---------- Dean Edwards packer 反混淆（无 eval，纯字符串替换） ----------
// 站内两种方言：
//   v1：eval(function(p,a,c,k,e,d){while(c--)...}('PAYLOAD',BASE,COUNT,'k...'.split('|')))
//   v2：eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};...}("PAYLOAD",BASE,COUNT,'k...'.split('|'))
// 注意：c.toString(a) 是 base-a 编码，不是 parseInt，别改错。
function unpackDeanEdwards(html) {
  var out = [];
  var pats = [
    /eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?\}\('((?:\\.|[^'\\])*)',(\d+),(\d+),'((?:\\.|[^'\\])*)'\.split\('\|'\)/g,
    /eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?\}\("((?:\\.|[^"\\])*)",(\d+),(\d+),['"]((?:\\.|[^'"\\])*)['"]\.split\(['"]\|['"]\)/g
  ];
  for (var pi = 0; pi < pats.length; pi++) {
    var re = pats[pi];
    var m;
    while ((m = re.exec(html)) !== null) {
      var p = m[1].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      var a = parseInt(m[2], 10);
      var k = m[4].split("|");
      var c = parseInt(m[3], 10);
      while (c--) {
        if (k[c]) p = p.replace(new RegExp("\\b" + c.toString(a) + "\\b", "g"), k[c]);
      }
      out.push(p);
    }
  }
  return out;
}

function extractPackedSources(html) {
  var vars = {};
  var codes = unpackDeanEdwards(html);
  for (var i = 0; i < codes.length; i++) {
    var re = /([A-Za-z_$][\w$]*)\s*=\s*'([^']+)'/g;
    var m;
    while ((m = re.exec(codes[i])) !== null) {
      if (/^https?:\/\//i.test(m[2])) vars[m[1]] = m[2];
    }
  }
  return {
    master: vars.source || vars.f || "",
    v842: vars.source842 || vars.d || "",
    v1280: vars.source1280 || vars.b || ""
  };
}

function extractDownloadMp4s(html) {
  var out = [];
  var seen = {};
  var dec = decodeHtml(html);
  var re = /<a[^>]+href="(https?:\/\/[^"]+\.mp4[^"]*)"[^>]*>/gi;
  var m;
  while ((m = re.exec(dec)) !== null) {
    var u = m[1].replace(/&amp;/g, "&");
    if (/preview\.mp4/i.test(u)) continue;
    if (seen[u]) continue;
    seen[u] = 1;
    out.push(u);
  }
  return out;
}

function isMp4(u) {
  return /\.mp4(\?|#|$)/i.test(String(u || ""));
}

function mp4Label(u) {
  var m = String(u).match(/\/(\d{3,4})p\.mp4/i);
  if (m) return m[1] + "p";
  if (/fullhd/i.test(u)) return "1080p";
  return "原画";
}

function variantLabelFromPath(u) {
  var m = String(u).match(/\/(\d{3,4})p\//i);
  if (m) return m[1] + "p";
  m = String(u).match(/\/(\d{3,4})x(\d{3,4})\//i);
  if (m) return Math.min(parseInt(m[1], 10), parseInt(m[2], 10)) + "p";
  return "原画";
}

// 主播单解析：#EXT-X-STREAM-INF(RESOLUTION=WxH) 下一行是变体地址；
// 无 RESOLUTION 时按 BANDWIDTH 不猜档位、返回空（调用方单线兜底）。
function parseMaster(text, base) {
  var out = [];
  var seen = {};
  var lines = String(text || "").split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    var inf = /#EXT-X-STREAM-INF:([^\n]*)/.exec(lines[i]);
    if (!inf) continue;
    var j = i + 1, uri = "";
    while (j < lines.length) {
      var s = t(lines[j]);
      if (s && s.charAt(0) !== "#") { uri = s; break; }
      j++;
    }
    if (!uri) continue;
    var rm = /RESOLUTION=(\d+)x(\d+)/i.exec(inf[1]);
    if (!rm) continue;
    var label = Math.min(parseInt(rm[1], 10), parseInt(rm[2], 10)) + "p";
    if (seen[label]) continue;
    seen[label] = 1;
    var abs = uri;
    if (!/^https?:\/\//i.test(uri)) {
      var b = base.replace(/\/[^\/]*$/, "/");
      abs = b + uri.replace(/^\//, "");
    }
    out.push({ label: label, url: abs });
  }
  out.sort(function (a, b) { return parseInt(b.label, 10) - parseInt(a.label, 10); });
  return out;
}

// 取主播单（走 pl3 代理；pl3 偶发 500，重试一次）。
async function fetchMasterVariants(master, durl) {
  for (var attempt = 0; attempt < 2; attempt++) {
    var txt = await getHtml(pl3wrap(master), durl);
    if (txt && txt.indexOf("#EXTM3U") >= 0) return parseMaster(txt, master);
  }
  return [];
}

function listUrl(id, sub, page) {
  var p = Math.max(1, parseInt(page, 10) || 1);
  var base = "";
  if (id === "new") base = "/new";
  else if (id === "chinese-subtitle") base = "/chinese-subtitle";
  else if (id === "madou") base = "/madou";
  else if (id === "kinostream") base = "/kinostream";
  else if (id === "timestudio") base = "/TIMESTUDIO";
  else if (id === "anime") base = "/anime";
  else if (id === "vr") base = "/VR";
  else if (id === "avtalk") base = "/avtalk";
  else if (id === "masem") base = "/masem";
  else if (id === "plantsvscunts") base = "/PLANTSVSCUNTS";
  else if (id === "genres") base = "/genres/" + encodeURIComponent(sub || "Gachi");
  else if (id === "uncensored") base = "/" + (sub || "uncensored-leak");
  else if (id === "amateur") base = "/" + (sub || "siro");
  else if (id === "asian") base = "/" + (sub || "madou");
  else return "";
  return HOST + base + (p > 1 ? "?page=" + p : "");
}

function parseList(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var chunks = String(html).split(/<div[^>]*class="thumbnail group"/);
  for (var i = 1; i < chunks.length; i++) {
    var c = chunks[i];
    var hm = c.match(/<a href="(\/[^"]+)"[^>]*>/);
    if (!hm) continue;
    var href = decodeHtml(hm[1]);
    if (!/^\/[A-Za-z0-9][A-Za-z0-9\-._]*$/.test(href)) continue;
    if (seen[href]) continue;
    seen[href] = 1;
    var title = "";
    var tm = c.match(/<a[^>]+class="[^"]*text-secondary[^"]*"[^>]*>([\s\S]{0,400}?)<\/a>/i);
    if (tm) title = decodeHtml(tm[1].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    if (!title) {
      var am = c.match(/<img[^>]+alt="([^"]*)"/i);
      if (am) title = decodeHtml(am[1]);
    }
    if (!title) title = href.slice(1);
    if (/^\{\{|\bitem\.(title|dvd_id)\b/.test(title)) continue;
    var cover = "";
    var dm = c.match(/<img[^>]+data-src="(https?:\/\/[^"]+)"/i);
    var sm = c.match(/<img[^>]+src="(https?:\/\/[^"]+)"/i);
    if (dm) cover = decodeHtml(dm[1]);
    else if (sm) cover = decodeHtml(sm[1]);
    if (!cover) continue;
    var remarks = "";
    var rm = c.match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
    if (rm) remarks = rm[1];
    var link = HOST + href;
    out.push({
      id: link,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: link,
      description: remarks,
      mediaType: "movie"
    });
  }
  return out;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function inList(arr, v) {
  for (var i = 0; i < arr.length; i++) if (arr[i] === v) return true;
  return false;
}

async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var id = t(params.zone || "new");
  var sub = t(params.sub || "");
  // 筛选值本身定路径：题材 -> /genres/<名>，無碼/素人/亞洲值 -> /<值>；未命中时回落 listUrl 按顶级解释。
  var url = "";
  if (sub) {
    if (inList(GENRE_VALUES, sub)) url = HOST + "/genres/" + encodeURIComponent(sub);
    else if (inList(UNCENSORED_VALUES, sub) || inList(AMATEUR_VALUES, sub) || inList(ASIAN_VALUES, sub)) url = HOST + "/" + sub;
  }
  if (!url) url = listUrl(id, sub, page);
  else if (page > 1) url += "?page=" + page;
  if (!url) return emptyItem();
  try {
    var html = await getHtml(url);
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
    var url = HOST + "/search/" + encodeURIComponent(wd);
    if (page > 1) url += "?page=" + page;
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

function extractTitle(html, fallback) {
  var m = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  if (m) return decodeHtml(m[1]);
  m = html.match(/<title>([^<]*)<\/title>/i);
  if (m) return decodeHtml(m[1]).replace(/\s*-\s*AV77 AV.*$/i, "").trim();
  return fallback || "";
}

function extractCover(html) {
  var m = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  if (m) return decodeHtml(m[1]);
  return "";
}

function extractDesc(html) {
  var m = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
  if (m) return decodeHtml(m[1]);
  return "";
}

// 详情：packer 源优先，下载 MP4 兜底；无源出空线（不编造）。
// m3u8 档位线用懒解析 @@AV77:<durl>:<label>（点播现取变体地址）；
// mp4 直链 / xxnet999 / pl3 包主播单用直接 videoUrl。
async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var durl = raw.indexOf("http") === 0 ? raw : absUrl(raw);
    var html = await getHtml(durl);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = extractTitle(html, durl);
    var pic = extractCover(html);
    var content = extractDesc(html);
    var srcs = extractPackedSources(html);
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    var epNo = 0;
    function pushEp(label, videoUrl, playerType, lazyId) {
      epNo++;
      var id = lazyId || videoUrl;
      eps.push({ name: label, link: id });
      seasonEps.push({ title: label, videoUrl: videoUrl, episodeNumber: epNo });
      epItems.push({
        id: id,
        type: "url",
        title: label,
        mediaType: "movie",
        posterPath: pic,
        videoUrl: videoUrl,
        link: id,
        episode: epNo,
        episodeNumber: epNo,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: playerType,
        customHeaders: { "User-Agent": UA, "Referer": HOST + "/" }
      });
    }
    if (srcs.master && isMp4(srcs.master)) {
      pushEp(mp4Label(srcs.master), srcs.master, "app");
    } else if (srcs.master) {
      if (/player\.xxnet999\.com/i.test(srcs.master)) {
        pushEp("原画", srcs.master, "system");
      } else {
        // surrit / slv / krevonix 主播单：走 pl3 取一次，按实测档位出线（懒解析）
        var variants = await fetchMasterVariants(srcs.master, durl);
        if (variants.length) {
          for (var vi = 0; vi < variants.length; vi++) {
            var v = variants[vi];
            pushEp(v.label, "", "system", durl + "@@AV77:" + v.label);
          }
        } else {
          var single = srcs.v1280 || srcs.v842 || "";
          if (single) {
            if (isMp4(single)) pushEp(mp4Label(single), single, "app");
            else pushEp(variantLabelFromPath(single), pl3wrap(single), "system");
          } else {
            pushEp("原画", pl3wrap(srcs.master), "system");
          }
        }
      }
    }
    if (!eps.length) {
      var mp4s = extractDownloadMp4s(html);
      for (var mi = 0; mi < mp4s.length; mi++) {
        pushEp(mp4Label(mp4s[mi]), mp4s[mi], "app");
      }
    }
    var result = {
      id: durl,
      type: "detail",
      title: name || durl,
      name: name || durl,
      description: content,
      mediaType: "movie",
      link: durl,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app"
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "播放", name: "播放", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
    }
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// loadResource：@@AV77:<durl>:<label> -> 现取详情页，重新解包取主播单变体；
// 直链 mp4/m3u8 -> 直接返回。
async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  var m = raw.match(/^(https?:\/\/\S+?)@@AV77:(.+)$/);
  if (m) {
    var durl = m[1];
    var label = m[2];
    try {
      var html = await getHtml(durl);
      var srcs = extractPackedSources(html);
      if (srcs.master && isMp4(srcs.master)) {
        return [{ name: mp4Label(srcs.master), url: srcs.master, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
      }
      if (srcs.master && /player\.xxnet999\.com/i.test(srcs.master)) {
        return [{ name: "原画", url: srcs.master, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
      }
      if (srcs.master) {
        var variants = await fetchMasterVariants(srcs.master, durl);
        for (var i = 0; i < variants.length; i++) {
          if (variants[i].label === label) {
            return [{ name: label, url: variants[i].url, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
          }
        }
        if (variants.length) {
          return [{ name: variants[0].label, url: variants[0].url, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
        }
        var single = srcs.v1280 || srcs.v842 || "";
        if (single) {
          if (isMp4(single)) return [{ name: mp4Label(single), url: single, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
          return [{ name: variantLabelFromPath(single), url: pl3wrap(single), playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
        }
        return [{ name: "原画", url: pl3wrap(srcs.master), playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
      }
      var mp4s = extractDownloadMp4s(html);
      if (mp4s.length) {
        return [{ name: mp4Label(mp4s[0]), url: mp4s[0], playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
      }
    } catch (e) { /* fall through */ }
    return [];
  }
  // 直链 mp4 / m3u8
  if (/^https?:\/\//i.test(raw) && (isMp4(raw) || /\.m3u8(\?|#|$)/i.test(raw))) {
    var pt = isMp4(raw) ? "app" : "system";
    return [{ name: "播放", url: raw, playerType: pt, customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  }
  // 兜底：详情地址 -> 取详情首线
  try {
    var det = await loadDetail(raw);
    var eps = det && det.episodeItems;
    if (eps && eps.length) {
      if (eps[0].videoUrl) {
        return [{ name: eps[0].title, url: eps[0].videoUrl, playerType: eps[0].playerType || "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
      }
      return await loadResource({ link: eps[0].id });
    }
  } catch (e) { /* fall through */ }
  return [];
}
