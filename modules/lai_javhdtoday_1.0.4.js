// v1.0.4：AVDB 样式详情（实测修正：详情页无本片演员/分类，导航/侧栏名单不再冒充；/cn/tag/ 点按改走 /tag/<slug>/?ajax=1；演员页直取+parseCards；补 loadList peopleId/genreId 与裸名路由）
// JavHD.Today for REX (lai_javhdtoday v1.0.2, 移植自 mira-cat 蜘蛛 py_javhdtoday)
// v1.0.2（2026-11-21）：详情按 embed 页真实 server 列表全解（Myserver/Streamtape/Mycloudz/Cloudwish/
//   Dood/F4splay），每条线一集、集内带真 videoUrl（system）；Myserver 走 ?json=1（vidara master 每档
//   一集，streamhg 单播单时一集）；外站嵌页出嗅探行；F4 正则补 f4splay.vip；永不 0 集。
// v1.0.1（2026-11-09）：server3（vidara）master 全部变体出集（每档一集，videoUrl 为变体绝对地址）；新增 loadResource（unwrapLink + 直链透传）。
// 后端：https://javhd.today/cn（JAV 聚合站，无反爬）。与 javhd.icu 的 JavHD 是不同站点。
// 列表：排序分类 GET /cn/{sort}/[/{N}/] SSR 28 条/页；标签分类走 ?ajax=1 JSON 接口。
// 详情：GET /cn/{id}/{slug}/ 取 <iframe src="/cn/embed/{id}/">。
// 播放：embed 页 server 列表（2026-11-21 实测 FSDSS-953：Myserver/Mycloudz/Cloudwish/
//   Dood/F4splay/Streamtape 六线，无 embed_server3/9 旧腿）：Myserver（站内 embed.php）
//   调 ?json=1 取源——vidara master 时每档一集，streamhg 单播单时一集（地址约 10 分钟过期）；
//   外站嵌页（Mycloudz/Cloudwish/Dood/Streamtape）出嗅探行；F4 系 api/play 降级。
//   注意：vidara 带 Referer 会被限速，Myserver 行的播放头只带 UA 不带 Referer。

WidgetMetadata = {
  id: "lai_javhdtoday",
  title: "JavHD.Today",
  description: "JavHD.Today（javhd.today）：排序+标签共 16 个分类，详情解析全部线路（Myserver 多档/Streamtape/外站/F4），每档一集、直链 system 播放",
  author: "lai",
  version: "1.0.4",
  requiredVersion: "0.0.1",
  site: "https://javhd.today",
  detailCacheDuration: 180,
  modules: [
    {
      title: "排序",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "排序",
          type: "enumeration",
          value: "recent",
          enumOptions: [
            { title: "最新上传", value: "recent" },
            { title: "最受欢迎", value: "popular" },
            { title: "高评分", value: "rated" },
            { title: "热议", value: "discussed" },
            { title: "下载最多", value: "downloaded" },
            { title: "最长", value: "longest" },
            { title: "观看最多", value: "watched" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "标签",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "标签",
          type: "enumeration",
          value: "tag:uncensored-jav",
          enumOptions: [
            { title: "无码流出", value: "tag:uncensored-jav" },
            { title: "中文字幕", value: "tag:chinese-subtitle" },
            { title: "英文字幕", value: "tag:jav-sub" },
            { title: "巨乳", value: "tag:big-tits" },
            { title: "中出", value: "tag:creampie" },
            { title: "减少马赛克", value: "tag:reducing-mosaic" },
            { title: "已婚女人", value: "tag:married-woman" },
            { title: "美少女", value: "tag:beautiful-girl" },
            { title: "成熟女性", value: "tag:mature-woman" }
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

var SITE = "https://javhd.today";
var CN = SITE + "/cn";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = CN + "/";

// 排序分类（与蜘蛛 SORT_CATS 一致）
var SORT_IDS = ["recent", "popular", "rated", "discussed", "downloaded", "longest", "watched"];
// 标签分类（与蜘蛛 TAG_CATS 一致）：type_id -> slug
var TAG_SLUGS = {
  "tag:uncensored-jav": "uncensored-jav",
  "tag:chinese-subtitle": "chinese-subtitle",
  "tag:jav-sub": "jav-sub",
  "tag:big-tits": "big-tits",
  "tag:creampie": "creampie",
  "tag:reducing-mosaic": "reducing-mosaic",
  "tag:married-woman": "married-woman",
  "tag:beautiful-girl": "beautiful-girl",
  "tag:mature-woman": "mature-woman"
};

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

// 纯 JS base64 -> UTF-8 字符串（不依赖 Buffer/atob/TextDecoder）
function b64dec(s) {
  s = t(s).replace(/[^A-Za-z0-9+/=]/g, "");
  if (!s) return "";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var bytes = [];
  var buf = 0, bits = 0;
  for (var i = 0; i < s.length; i++) {
    var c = s.charAt(i);
    if (c === "=") break;
    var v = chars.indexOf(c);
    if (v < 0) continue;
    buf = (buf << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((buf >> bits) & 0xff);
    }
  }
  var out = "";
  var j = 0;
  while (j < bytes.length) {
    var b = bytes[j++];
    if (b < 0x80) { out += String.fromCharCode(b); continue; }
    if (b >= 0xc0 && b < 0xe0 && j < bytes.length) {
      out += String.fromCharCode(((b & 0x1f) << 6) | (bytes[j++] & 0x3f));
      continue;
    }
    if (b >= 0xe0 && b < 0xf0 && j + 1 < bytes.length) {
      out += String.fromCharCode(((b & 0x0f) << 12) | ((bytes[j++] & 0x3f) << 6) | (bytes[j++] & 0x3f));
      continue;
    }
    if (b >= 0xf0 && j + 2 < bytes.length) {
      var cp = ((b & 0x07) << 18) | ((bytes[j++] & 0x3f) << 12) | ((bytes[j++] & 0x3f) << 6) | (bytes[j++] & 0x3f);
      cp -= 0x10000;
      out += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff));
      continue;
    }
    out += "?";
  }
  return out;
}

// 手工解析 URL 的 origin 与最后一段路径（不依赖 URL 构造器）
function urlParts(u) {
  var m = String(u || "").match(/^(https?:\/\/[^/?#]+)([^?#]*)/);
  if (!m) return { origin: "", page: "" };
  var path = m[2] || "/";
  var segs = path.split("/").filter(function (x) { return x.length > 0; });
  return { origin: m[1], page: segs.length ? segs[segs.length - 1] : "" };
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": referer || REFERER
  };
}

async function fetchText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer), timeout: 25000 });
  var body = res && res.data != null ? String(res.data) : "";
  return body;
}

async function fetchJson(url, referer) {
  try {
    var headers = pageHeaders(referer);
    headers["Accept"] = "application/json";
    var res = await Widget.http.get(url, { headers: headers, timeout: 25000 });
    var data = res && res.data;
    if (!data) return null;
    if (typeof data === "string") {
      try { return JSON.parse(data); } catch (e) { return null; }
    }
    return typeof data === "object" ? data : null;
  } catch (e) { return null; }
}

// 解析视频卡片：li#video-{id} > a.thumbnail[href,title] > img + span.video-title（与蜘蛛 parseCards 同逻辑）
function parseCards(html) {
  var out = [];
  var seen = {};
  var re = /<li[^>]*id="video-(\d+)"[^>]*>([\s\S]*?)<\/li>/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var vid = m[1];
    var card = m[2];
    var am = card.match(/<a[^>]*href="([^"]+)"[^>]*title="([^"]*)"[^>]*class="thumbnail"/)
      || card.match(/<a[^>]*class="thumbnail"[^>]*href="([^"]+)"[^>]*title="([^"]*)"/)
      || card.match(/<a[^>]*href="([^"]+)"[^>]*>/);
    if (!am) continue;
    var durl = fixUrl(am[1]);
    if (seen[durl]) continue;
    seen[durl] = 1;
    var title = am[2] ? clean(am[2]) : "";
    if (!title) {
      var tm = card.match(/<span class="video-title">([\s\S]*?)<\/span>/);
      if (tm) title = clean(tm[1]);
    }
    var im = card.match(/<img[^>]+src="([^"]+)"/);
    var rm = card.match(/<span class="video-overlay[^"]*"[^>]*>\s*HD\s*([\d:]+)/);
    var cover = im ? fixUrl(im[1]) : "";
    out.push({
      id: durl,
      type: "url",
      title: title || ("视频 " + vid),
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: durl,
      description: title || "",
      releaseDate: rm ? rm[1].trim() : "",
      mediaType: "movie"
    });
  }
  return out;
}

async function loadList(params) {
  params = params || {};
  var _pid = t(params.peopleId || params.genreId || params.url || "");
  if (_pid && /^https?:\/\//i.test(_pid)) {
    try {
      if (/\/pornstar\//i.test(_pid)) { var _ph = await fetchText(_pid, REFERER); var _pl = _ph ? parseCards(_ph) : []; return _pl.length ? _pl : [{ id: "empty", type: "url", title: "没有找到相关影片" }]; }
      if (/\/tag\//i.test(_pid)) { var _tg = _pid.split("/tag/")[1] || ""; _tg = _tg.split("/")[0].split("?")[0]; var _tj2 = await fetchJson(CN + "/tag/" + _tg + "/?ajax=1&page=" + Math.max(1, parseInt(params.page, 10) || 1), REFERER); if (_tj2 && _tj2.html) { var _tl = parseCards(String(_tj2.html)); return _tl.length ? _tl : [{ id: "empty", type: "url", title: "没有找到相关影片" }]; } return [{ id: "empty", type: "url", title: "没有找到相关影片" }]; }
    } catch (ePid) {}
  }
  var page = parseInt(params.page, 10) || 1;
  var tid = t(params.path || params.cat || "recent");
  try {
    if (tid.indexOf("tag:") === 0) {
      var slug = TAG_SLUGS[tid] || tid.slice(4);
      var j = await fetchJson(CN + "/" + slug + "/?ajax=1&page=" + page, REFERER);
      if (!j || !j.html) {
        return [{ id: "err", type: "url", title: "载入失败：标签接口无回应", description: tid }];
      }
      var tlist = parseCards(String(j.html));
      return tlist.length ? tlist : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
    }
    var sort = SORT_IDS.indexOf(tid) >= 0 ? tid : "recent";
    var url = CN + "/" + sort + "/";
    if (page > 1) url += page + "/";
    var html = await fetchText(url);
    if (!html || html.length < 200) {
      return [{ id: "err", type: "url", title: "载入失败：页面为空", description: url }];
    }
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
  if (!wd) {
    return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  }
  // 站方搜索页为 JS 动态渲染，服务端直抓多数情况下无结果（与蜘蛛同口径，尽力解析）
  var url = CN + "/search/video/?s=" + encodeURIComponent(wd);
  try {
    var html = await fetchText(url);
    var list = html ? parseCards(html) : [];
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片（站方搜索需 JS 渲染）" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

// 从详情页提取 embed 页地址
function extractEmbed(html) {
  var m = html.match(/<iframe[^>]+src="([^"]*\/cn\/embed\/\d+\/?)"/);
  return m ? fixUrl(m[1]) : "";
}

// 从 embed 页提取播放器地址（data-embeds/data-embed 为 base64）
function extractPlayers(embedHtml) {
  var out = [];
  var re = /<div class="server-option[^"]*"[^>]*>/g;
  var m;
  while ((m = re.exec(embedHtml)) !== null) {
    var end = embedHtml.indexOf(">", m.index);
    var tag = embedHtml.slice(m.index, end + 1);
    var nameM = tag.match(/data-name="([^"]*)"/);
    var name = nameM ? nameM[1] : "";
    var embedsM = tag.match(/data-embeds="([^"]+)"/);
    var embedM = tag.match(/data-embed="([^"]+)"/);
    if (embedsM) {
      var dec = b64dec(embedsM[1]);
      try {
        var arr = JSON.parse(dec);
        if (Object.prototype.toString.call(arr) === "[object Array]") {
          for (var i = 0; i < arr.length; i++) out.push({ name: name, url: arr[i] });
        }
      } catch (e) { /* ignore */ }
    } else if (embedM) {
      var dec2 = b64dec(embedM[1]);
      if (/^https?:\/\//.test(dec2)) out.push({ name: name, url: dec2 });
    }
  }
  return out;
}

// server 页 -> 同名 php 的 ?json=1 接口取源
// 返回 {kind:'hls'|'mp4', url, playerUrl} 或 null
async function resolveServerJson(playerUrl, referer) {
  var pM = String(playerUrl).match(/[?&]p=([^&]+)/);
  if (!pM) return null;
  var parts = urlParts(playerUrl);
  if (!parts.origin) return null;
  var page = parts.page || "embed.php";
  var apiUrl = parts.origin + "/" + page + "?json=1&next=0&p=" + encodeURIComponent(pM[1]);
  var j = await fetchJson(apiUrl, referer);
  if (!j || !j.success) return null;
  if (j.src && typeof j.src === "string") {
    return { kind: "hls", url: j.src.indexOf("http") === 0 ? j.src : parts.origin + j.src, playerUrl: playerUrl };
  }
  if (j.media && typeof j.media === "string") {
    return { kind: "mp4", url: j.media.indexOf("http") === 0 ? j.media : parts.origin + j.media, playerUrl: playerUrl };
  }
  return null;
}

// f4 系 embed 页 -> api/play -> m3u8（降级用）
async function resolveF4(embedUrl, referer) {
  var html = await fetchText(embedUrl, referer);
  if (!html) return null;
  var vidM = html.match(/data-video-id="([a-f0-9-]+)"/);
  if (!vidM) return null;
  var vid = vidM[1];
  var apiM = html.match(/data-api="([^"]+)"/);
  var parts = urlParts(embedUrl);
  var host = parts.origin || "https://f4scdn.com";
  var playApi = apiM
    ? (apiM[1].charAt(0) === "/" ? host + apiM[1] : apiM[1])
    : host + "/api/play/" + vid;
  var srcUrl = playApi + "?ab=0&r=" + encodeURIComponent(referer || REFERER);
  var j = await fetchJson(srcUrl, embedUrl);
  if (j && j.src && /^https?:\/\//.test(j.src)) return { url: j.src, origin: host };
  if (j && j.url && /^https?:\/\//.test(j.url)) return { url: j.url, origin: host };
  return null;
}

// 主列表挑最高档（vidara master 多码率时用；请求只带 UA，带 Referer 会被限速）
// v1.0.1：master 全部变体解析（原 pickHighest 只挑最高档）。返回按清晰度降序的
// [{name:"1080p", url:<变体绝对地址>, h}]；相对路径按 master 同目录拼接；无变体回 []。
async function pickVariants(masterUrl) {
  try {
    var res = await Widget.http.get(masterUrl, { headers: { "User-Agent": UA }, timeout: 15000 });
    var text = res && res.data != null ? String(res.data) : "";
    if (text.indexOf("#EXT-X-STREAM-INF") < 0) return [];
    var lines = text.split(/\r?\n/);
    var out = [];
    var seen = {};
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line.indexOf("#EXT-X-STREAM-INF") !== 0) continue;
      var uri = "";
      for (var k = i + 1; k < lines.length; k++) {
        var nx = lines[k].trim();
        if (nx) { uri = nx; break; }
      }
      if (!uri || uri.charAt(0) === "#") continue;
      var rm = line.match(/RESOLUTION=(\d+)x(\d+)/i);
      var bm = line.match(/BANDWIDTH=(\d+)/i);
      var h = rm ? parseInt(rm[2], 10) : 0;
      if (!h && bm) {
        var bw = parseInt(bm[1], 10);
        h = bw >= 2500000 ? 1080 : (bw >= 1100000 ? 720 : 480);
      }
      var abs = uri;
      if (!/^https?:\/\//i.test(uri)) {
        var base = masterUrl.split("?")[0];
        base = base.slice(0, base.lastIndexOf("/") + 1);
        abs = base + uri.replace(/^\.\//, "");
      }
      if (seen[abs]) continue;
      seen[abs] = 1;
      out.push({ name: h ? h + "p" : "自适应", url: abs, h: h });
    }
    out.sort(function (a, b) { return b.h - a.h; });
    return out;
  } catch (e) { return []; }
}

// v1.0.2：详情按 embed 页真实 server 列表全解（Myserver/Streamtape/Mycloudz/Cloudwish/
//   Dood/F4splay），每条线一集、集内带真 videoUrl；Myserver 走 ?json=1（vidara master 时
//   每档一集，streamhg 单播单时一集），直链行 playerType "system"；外站嵌页出嗅探行
//   （app，manko Upload18 形状）；F4 正则补 f4splay.vip；全部腿失败时出 embed 页嗅探行，
//   永不 0 集；loadResource 只作回落。
//   注意：Myserver 的 universal-stream-hls 地址约 10 分钟过期（实测：详情时取的地址 15 分钟
//   后 404，重新 ?json=1 即出新地址），打开详情后尽快点播，过期重进详情即刷新。
// 多集详情构造：rows 为 [{name, url, playerType, customHeaders}]；顶层取首行。
function detailMulti(durl, name, pic, rows, tax) {
  var eps = [];
  var sEps = [];
  var items = [];
  for (var i = 0; i < rows.length; i++) {
    var nm = rows[i].name;
    var vu = rows[i].url;
    eps.push({ name: nm, id: vu, link: vu });
    sEps.push({ title: nm, videoUrl: vu, episodeNumber: i + 1, customHeaders: rows[i].customHeaders });
    items.push({ id: vu, type: "url", title: nm, name: nm, mediaType: "movie", seasonNumber: 1, episodeNumber: i + 1, videoUrl: vu, link: vu, posterPath: pic, coverUrl: pic, playerType: rows[i].playerType, customHeaders: rows[i].customHeaders });
  }
  return taxAttach({
    id: durl,
    type: "detail",
    title: name,
    link: durl,
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    videoUrl: rows.length ? rows[0].url : "",
    playerType: rows.length ? rows[0].playerType : "app",
    customHeaders: rows.length ? rows[0].customHeaders : { "User-Agent": UA },
    description: "",
    episodes: eps,
    seasons: [{ seasonNumber: 1, title: "线路", name: "线路", episodes: sEps }],
    episodeItems: items,
    childItems: items
  }, tax);
}

// 按站方 server 名找播放器（data-name），名字大小写不敏感
function findServer(players, name) {
  var want = String(name || "").toLowerCase();
  for (var i = 0; i < players.length; i++) {
    if (String(players[i].name || "").toLowerCase() === want) return players[i];
  }
  return null;
}

// Myserver 腿：站内 embed.php 走 ?json=1 取源；vidara master 时每档一集，
// streamhg 单播单/MP4 时一集；只带 UA（vidara 带 Referer 会被限速）。
// 解不出时留嵌页嗅探行。
async function legMyserver(players, embedUrl, durl) {
  var rows = [];
  var srv = findServer(players, "Myserver");
  if (!srv) {
    for (var i = 0; i < players.length; i++) {
      if (/javhdz\.today\/embed\.php/i.test(players[i].url)) { srv = players[i]; break; }
    }
  }
  if (!srv) return rows;
  try {
    var r = await resolveServerJson(srv.url, embedUrl);
    if (r && r.url) {
      if (r.kind === "hls") {
        var variants = await pickVariants(r.url);
        if (variants.length) {
          for (var v = 0; v < variants.length; v++) {
            rows.push({ name: "Myserver · " + variants[v].name, url: variants[v].url, playerType: "system", customHeaders: { "User-Agent": UA } });
          }
          return rows;
        }
      }
      rows.push({ name: "Myserver", url: r.url, playerType: "system", customHeaders: { "User-Agent": UA } });
      return rows;
    }
  } catch (e) { /* 解不出走嗅探行 */ }
  rows.push({ name: "Myserver·站内播放", url: srv.url, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl } });
  return rows;
}

// 外站嵌页腿（Mycloudz/Cloudwish/Dood/Streamtape）：各家直解需逐站提取且 token 常绑 IP，
// 详情时只出嗅探行（app，站内页地址 + 头），点它走站内播放器；loadResource 不再二次解。
function legSniff(players, name, durl) {
  var rows = [];
  var srv = findServer(players, name);
  if (!srv || !srv.url) return rows;
  rows.push({ name: name + "·站内播放", url: srv.url, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl } });
  return rows;
}

// F4 腿（api/play 降级；f4splay.vip 全网 502 时解不出，留嵌页嗅探行、host 恢复后自愈）
async function legF4(players, durl) {
  var rows = [];
  var f4 = findServer(players, "F4splay");
  if (!f4) {
    for (var i = 0; i < players.length; i++) {
      if (/f4\w*\.(com|vip)|f4scdn/i.test(players[i].url)) { f4 = players[i]; break; }
    }
  }
  if (!f4) return rows;
  try {
    var rf = await resolveF4(f4.url, durl);
    if (rf && rf.url) {
      rows.push({ name: "F4splay", url: rf.url, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": f4.url, "Origin": rf.origin } });
      return rows;
    }
  } catch (e) { /* 解不出走嗅探行 */ }
  rows.push({ name: "F4splay·站内播放", url: f4.url, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl } });
  return rows;
}


// ---- AVDB 样式详情：演员/分类（点按出对应全部内容）----
// 详情页 HTML 里扫演员/分类链接（站内同源），建成 peoples / genreItems；
// 点按后 loadDetail 走分类页分支（loadList 或 search 取该分类的全部影片）。
var TAX_ACTRESS_RE = /\/(actress(?:es)?|actors?|stars?|pornstars?|performers?|models?|idols?)\//i;
var TAX_GENRE_RE = /\/(genres?|tags?|categor(?:y|ies)|labels?|makers?|studios?|directors?|codes?)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)|actress(es)?|actors?|stars?|makers?|all|全部|分类|演员|标签|女优|题材|片商)$/i;
var TAX_AFTER_RE = /\/actress(?:es)?\/|\/actors?\/|\/stars?\/|\/pornstars?\/|\/performers?\/|\/models?\/|\/idols?\/|\/genres?\/|\/tags?\/|\/categor(?:y|ies)\/|\/labels?\/|\/makers?\/|\/studios?\/|\/directors?\/|\/codes?\//i;

function extractTaxonomyFromHtml(html) {
  // 实测（2026-11-25 真站详情页）：详情页无本片演员/分类链接——/cn/pornstar/ 链接全是
  // 导航栏“顶级偶像”下拉与侧栏榜单，/cn/tag/ 只有“国家 Japan”一个；工作室块被注释掉。
  // 导航/侧栏名单不是本片数据，绝不能当 peoples/genreItems 发；两项留空。
  return { peoples: [], genreItems: [] };
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
    // 裸名（App 只传名字）：先试 /cn/pornstar/<slug>/，再试标签 ajax，最后搜；绝不回 null。
    try {
      var _bare = t(unwrapLink(link));
      if (_bare && _bare.indexOf("actor:") === 0) _bare = _bare.slice(6);
      else if (_bare && _bare.indexOf("tag:") === 0) _bare = _bare.slice(4);
      if (_bare && !/^https?:\/\//i.test(_bare) && (_bare.indexOf(" ") >= 0 || /[^\x00-\x7F]/.test(_bare))) {
        var _slug = _bare.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
        var _bWorks = [];
        if (_slug) { try { var _bh = await fetchText(CN + "/pornstar/" + _slug + "/", REFERER); if (_bh) _bWorks = parseCards(_bh); } catch (eB1) {} }
        if (!_bWorks.length && _slug) { try { var _bj = await fetchJson(CN + "/tag/" + _slug + "/?ajax=1&page=1", REFERER); if (_bj && _bj.html) _bWorks = parseCards(String(_bj.html)); } catch (eB2) {} }
        if (!_bWorks.length) _bWorks = await search({ keyword: _bare, page: 1 });
        if (!Array.isArray(_bWorks)) _bWorks = [];
        var _bReal = _bWorks.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty" && w.id !== "tip"; });
        return { id: _bare, type: "detail", mediaType: "movie", title: _bare, link: CN + "/pornstar/" + _slug + "/", description: "演员 · 共 " + _bReal.length + " 部作品", videoUrl: "", childItems: [], relatedItems: _bReal.length ? _bReal : _bWorks };
      }
    } catch (eBare) {}

    // AVDB 样式：点按演员/分类 → 打开该演员/分类的全部影片。
    try {
      var taxUrl = t(unwrapLink(link));
      if (taxUrl && (TAX_ACTRESS_RE.test(taxUrl) || TAX_GENRE_RE.test(taxUrl))) {
        var taxIsActress = TAX_ACTRESS_RE.test(taxUrl);
        var taxName = taxNameOf(taxUrl);
        var taxSeg = taxNameOf(taxUrl);
        var taxWorks = null;
        if (/\/pornstar\//i.test(taxUrl)) { try { var _ah = await fetchText(taxUrl, REFERER); if (_ah) taxWorks = parseCards(_ah); } catch (eT3) {} if (!taxWorks || !taxWorks.length) taxWorks = await search({ keyword: taxName, page: 1 }); }
        else if (/\/tag\//i.test(taxUrl)) { try { var _tj = await fetchJson(CN + "/tag/" + taxSeg + "/?ajax=1&page=1", REFERER); if (_tj && _tj.html) taxWorks = parseCards(String(_tj.html)); } catch (eT4) {} if (!taxWorks || !taxWorks.length) taxWorks = await loadList({ path: "tag:" + taxSeg, page: 1 }); }
        else if (TAG_SLUGS["tag:" + taxSeg]) taxWorks = await loadList({ path: "tag:" + taxSeg, page: 1 });
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

  var durl = t(unwrapLink(link));
  try {
    if (!/^https?:\/\//.test(durl)) durl = fixUrl(durl);
    var html = await fetchText(durl, REFERER);
    var tax = extractTaxonomyFromHtml(html);
    if (!html) {
      return { id: durl, type: "url", title: "载入失败", description: "详情页为空" };
    }

    var name = "";
    var tm = html.match(/<title>([^<]*)<\/title>/);
    if (tm) name = clean(tm[1]).split("|")[0].trim();

    var pic = "";
    var pm = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (pm) pic = fixUrl(pm[1]);
    if (!pic) {
      var vm = html.match(/<video[^>]+poster="([^"]+)"/);
      if (vm) pic = fixUrl(vm[1]);
    }

    function fail(msg) {
      return { id: durl, type: "url", title: name || "解析失败", description: msg };
    }

    var embedUrl = extractEmbed(html);
    if (!embedUrl) return fail("未找到播放器");
    var embedHtml = await fetchText(embedUrl, durl);
    if (!embedHtml) return fail("播放器页面为空");
    var players = extractPlayers(embedHtml);
    if (!players.length) {
      // 解不出 server 列表时仍留 embed 页嗅探行，永不 0 集
      return detailMulti(durl, name, pic, [{ name: "站内播放", url: embedUrl, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl } }], tax);
    }

    // Myserver 与 F4 并行解；外站腿只出嗅探行（无取数）
    var legRows = await Promise.all([
      legMyserver(players, embedUrl, durl),
      legF4(players, durl)
    ]);
    var rows = [];
    for (var li = 0; li < legRows.length; li++) {
      for (var ri = 0; ri < legRows[li].length; ri++) rows.push(legRows[li][ri]);
    }
    // 外站腿按 embed 页出现顺序追加嗅探行
    var sniffNames = ["Mycloudz", "Cloudwish", "Dood", "Streamtape"];
    for (var si = 0; si < players.length; si++) {
      var nm = String(players[si].name || "");
      for (var nj = 0; nj < sniffNames.length; nj++) {
        if (nm.toLowerCase() === sniffNames[nj].toLowerCase()) {
          var srows = legSniff(players, sniffNames[nj], durl);
          for (var sk = 0; sk < srows.length; sk++) rows.push(srows[sk]);
        }
      }
    }
    // 其余未认出的 server 名也照样出嗅探行，不丢线
    var known = { myserver: 1, f4splay: 1, mycloudz: 1, cloudwish: 1, dood: 1, streamtape: 1 };
    for (var ui = 0; ui < players.length; ui++) {
      var un = String(players[ui].name || "").toLowerCase();
      if (un && !known[un] && !/f4/i.test(un)) {
        rows.push({ name: players[ui].name + "·站内播放", url: players[ui].url, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl } });
      }
    }
    if (!rows.length) {
      return detailMulti(durl, name, pic, [{ name: "站内播放", url: embedUrl, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl } }], tax);
    }
    return detailMulti(durl, name, pic, rows, tax);
  } catch (e) {
    return { id: durl || String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// unwrapLink（App 把集对象直接传给 loadDetail/loadResource 时摊平）与点集回落入口。
// 集 videoUrl 即已解出的变体/直链地址，原样透传为 system 行（Myserver 变体只带 UA、不带 Referer）。
function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.videoUrl || x.link || x.id || x.url || x.href || "");
  return String(x);
}

async function loadResource(params) {
  var raw = unwrapLink(params);
  if (!raw && params && typeof params === "object") raw = unwrapLink(params.item);
  if (!raw) return [];
  try {
    // 详情页地址：重跑详情，取其全部行（Myserver 地址短命，点播时现解最新地址）
    if (/javhd\.today\/cn\//.test(raw)) {
      var d = await loadDetail(raw);
      var rows2 = [];
      var items2 = d.episodeItems || [];
      for (var qi = 0; qi < items2.length; qi++) {
        if (items2[qi].videoUrl) rows2.push({ name: items2[qi].title, url: items2[qi].videoUrl, playerType: items2[qi].playerType || "system", customHeaders: items2[qi].customHeaders });
      }
      return rows2;
    }
    // 已是嵌页地址（嗅探行）：交 WebView 嗅探
    if (/^https?:\/\//.test(raw) && !/\.m3u8(\?|$)/i.test(raw) && !/\.mp4(\?|$)/i.test(raw) && raw.indexOf("javhdz.today") < 0) {
      return [{ name: "站内播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA } }];
    }
    // 已解出的直链（m3u8/MP4/站内流）：system 行原样透传
    if (/^https?:\/\//.test(raw)) {
      return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA } }];
    }
    return [];
  } catch (e) {
    return [];
  }
}
