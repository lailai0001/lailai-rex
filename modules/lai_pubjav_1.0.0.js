// PubJav for REX (lai_pubjav v1.0.0)
// 移植自 mira-cat 蜘蛛 pubjav.js（只读蓝图），站 https://pubjav.com/。
// 分类：4 个顶级（首页最新 / 有码 / 无码 / 素人）+ 4 组筛选卡片：
//   类型 16（站内全量）/ 女优前 20 / 厂商前 20 / 厂牌前 15（均按站内人气取前 N）。
// 列表：/movies、/movies?genre=X、/genre/<slug>、/actor/<slug>、/studio/<slug>、/label/<slug>；
//   翻页 /movies/pg-N、/movies?genre=X&pg=N、其余 /pg-N 后缀。
// 卡片：<a href="/play/<slug>" title="...">，番号 mli-code、时长 mli-runtimes、
//   封面取 <img data-original>（src 是占位图）。
// 播放链（VM 全链实测通）：详情页 filmId/__pt/__pk + F4 按钮 data-id
//   -> POST /ajax/player（pt 必填）-> player_enc 用 __pk 做 base64+XOR 解密
//   -> iframe f4scdn.com/e/<code> -> sextb-hls v4 Worker /f4 取 master
//   -> 解析 #EXT-X-STREAM-INF 变体出线。F4 实测单档 720p，有几档出几档，绝不编造。
//   master 与分片强制 Origin: https://f4scdn.com，直链播单必死，故只出 Worker /f4 地址。
//   签名 300 秒有效：详情只存档位名，loadResource 点播现取新鲜地址。
// REX 不接猫源字幕芯（REX 侧字幕走 lai_subtitleagg 聚合模块）。

WidgetMetadata = {
  id: "lai_pubjav",
  title: "PubJav",
  description: "PubJav：JAV 站，4 顶级 + 类型/女优/厂商/厂牌筛选，F4 线走 sextb-hls Worker /f4，单档 720p，点播现解",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://pubjav.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "首页最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "censored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "uncensored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "amateur" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "类型", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "genre" }, { name: "sub", title: "类型", type: "enumeration", value: "/genre/reducing-mosaic", enumOptions: [{"title": "Reducing Mosaic", "value": "/genre/reducing-mosaic"}, {"title": "Uncensored Leaked", "value": "/genre/uncensored-leaked"}, {"title": "Amateur", "value": "/genre/amateur"}, {"title": "Anal", "value": "/genre/anal"}, {"title": "AV Idol", "value": "/genre/av-idol"}, {"title": "Beautiful Girl", "value": "/genre/beautiful-girl"}, {"title": "Beautiful Pussy", "value": "/genre/beautiful-pussy"}, {"title": "Big Asses", "value": "/genre/big-asses"}, {"title": "Big Tits", "value": "/genre/big-tits"}, {"title": "Blowjob", "value": "/genre/blowjob"}, {"title": "Bondage", "value": "/genre/bondage"}, {"title": "Bukkake", "value": "/genre/bukkake"}, {"title": "Cheating Wife", "value": "/genre/cheating-wife"}, {"title": "Cosplay", "value": "/genre/cosplay"}, {"title": "Creampie", "value": "/genre/creampie"}, {"title": "Cumshot", "value": "/genre/cumshot"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "女优", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "actor" }, { name: "sub", title: "女优", type: "enumeration", value: "/actor/yui-hatano", enumOptions: [{"title": "Yui Hatano", "value": "/actor/yui-hatano"}, {"title": "Yu Shinoda", "value": "/actor/yu-shinoda"}, {"title": "Hibiki Otsuki", "value": "/actor/hibiki-otsuki"}, {"title": "Mao Hamasaki", "value": "/actor/mao-hamasaki"}, {"title": "Kanako Iioka", "value": "/actor/kanako-iioka"}, {"title": "Ichika Matsumoto", "value": "/actor/ichika-matsumoto"}, {"title": "Julia", "value": "/actor/julia"}, {"title": "Asahi Mizuno", "value": "/actor/asahi-mizuno"}, {"title": "Akari Niimura", "value": "/actor/akari-niimura"}, {"title": "Mizuki Yayoi", "value": "/actor/mizuki-yayoi"}, {"title": "Aika", "value": "/actor/aika"}, {"title": "Kanako Ioka", "value": "/actor/kanako-ioka"}, {"title": "Waka Misono", "value": "/actor/waka-misono"}, {"title": "Reiko Kobayakawa", "value": "/actor/reiko-kobayakawa"}, {"title": "Kurea Hasumi", "value": "/actor/kurea-hasumi"}, {"title": "Himari Hanazawa", "value": "/actor/himari-hanazawa"}, {"title": "Yui Tenma", "value": "/actor/yui-tenma"}, {"title": "Mitsuki Nagisa", "value": "/actor/mitsuki-nagisa"}, {"title": "Yumi Kazama", "value": "/actor/yumi-kazama"}, {"title": "Rena Aoi", "value": "/actor/rena-aoi"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "厂商", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "studio" }, { name: "sub", title: "厂商", type: "enumeration", value: "/studio/fc2ppv", enumOptions: [{"title": "FC2PPV", "value": "/studio/fc2ppv"}, {"title": "MADONNA", "value": "/studio/madonna"}, {"title": "MOODYZ", "value": "/studio/moodyz"}, {"title": "S1 NO.1 STYLE", "value": "/studio/s1-no-1-style"}, {"title": "SOD Create", "value": "/studio/sod-create"}, {"title": "Attackers", "value": "/studio/attackers"}, {"title": "Prestige", "value": "/studio/prestige"}, {"title": "Idea Pocket", "value": "/studio/idea-pocket"}, {"title": "K M Produce", "value": "/studio/k-m-produce"}, {"title": "Venus", "value": "/studio/venus"}, {"title": "Fitch", "value": "/studio/fitch"}, {"title": "Das!!", "value": "/studio/das-"}, {"title": "Glory Quest", "value": "/studio/glory-quest"}, {"title": "Hunter", "value": "/studio/hunter"}, {"title": "Tameike Goro", "value": "/studio/tameike-goro"}, {"title": "Center Village", "value": "/studio/center-village"}, {"title": "Honnaka", "value": "/studio/honnaka"}, {"title": "Premium", "value": "/studio/premium"}, {"title": "Wanz Factory", "value": "/studio/wanz-factory"}, {"title": "Doc", "value": "/studio/doc"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "厂牌", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "label" }, { name: "sub", title: "厂牌", type: "enumeration", value: "/label/madonna", enumOptions: [{"title": "Madonna", "value": "/label/madonna"}, {"title": "S1 NO.1 STYLE", "value": "/label/s1-no-1-style"}, {"title": "MOODYZ DIVA", "value": "/label/moodyz-diva"}, {"title": "HHH Group", "value": "/label/hhh-group"}, {"title": "Tissue", "value": "/label/tissue"}, {"title": "GLORY QUEST", "value": "/label/glory-quest"}, {"title": "Das", "value": "/label/das"}, {"title": "SOD star", "value": "/label/sod-star"}, {"title": "Honnaka", "value": "/label/honnaka"}, {"title": "ALEDDIN", "value": "/label/aleddin"}, {"title": "OPPAI", "value": "/label/oppai"}, {"title": "Tameike Goro", "value": "/label/tameike-goro-"}, {"title": "Fitch", "value": "/label/fitch"}, {"title": "Kawaii", "value": "/label/kawaii"}, {"title": "Wanz Factory", "value": "/label/wanz-factory"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://pubjav.com";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
var WORKER = "https://sextb-hls.li768435813.workers.dev";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  var r = t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  r = r.replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); });
  r = r.replace(/&#x([0-9a-fA-F]+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 16)); });
  return r;
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return HOST + "/" + u;
}

// 纯 JS base64 解码成字节数组（无 Buffer/atob）
function b64decodeBytes(s) {
  s = String(s || "").replace(/-/g, "+").replace(/_/g, "/").replace(/\s+/g, "");
  while (s.length % 4) s += "=";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var rev = {};
  for (var i = 0; i < chars.length; i++) rev[chars.charAt(i)] = i;
  var bytes = [];
  for (var j = 0; j < s.length; j += 4) {
    var a = rev[s.charAt(j)] || 0;
    var b = rev[s.charAt(j + 1)] || 0;
    var c = s.charAt(j + 2) === "=" ? 0 : (rev[s.charAt(j + 2)] || 0);
    var d = s.charAt(j + 3) === "=" ? 0 : (rev[s.charAt(j + 3)] || 0);
    bytes.push((a << 2) | (b >> 4));
    if (s.charAt(j + 2) !== "=") bytes.push(((b & 15) << 4) | (c >> 2));
    if (s.charAt(j + 3) !== "=") bytes.push(((c & 3) << 6) | d);
  }
  return bytes;
}

// 纯 JS UTF-8 解码字节数组
function utf8Decode(bytes) {
  var out = "";
  for (var k = 0; k < bytes.length; k++) {
    var by = bytes[k];
    if (by < 128) { out += String.fromCharCode(by); continue; }
    var extra = (by >= 240 ? 3 : (by >= 224 ? 2 : (by >= 192 ? 1 : 0)));
    var code = by & (extra === 3 ? 7 : (extra === 2 ? 15 : 31));
    for (var e2 = 1; e2 <= extra && k + e2 < bytes.length; e2++) {
      code = (code << 6) | (bytes[k + e2] & 63);
    }
    k += extra;
    out += String.fromCharCode(code);
  }
  return out;
}

// player_enc 解密：base64 解出字节 -> 逐字节 XOR __pk（循环）-> UTF-8 还原
function xorDecrypt(enc, key) {
  if (!enc || !key) return "";
  try {
    var buf = b64decodeBytes(enc);
    var out = [];
    for (var i = 0; i < buf.length; i++) {
      out.push(buf[i] ^ key.charCodeAt(i % key.length));
    }
    return utf8Decode(out);
  } catch (e) { return ""; }
}

async function getHtml(url, extraHeaders) {
  try {
    var headers = { "User-Agent": UA, "Referer": HOST + "/" };
    if (extraHeaders) {
      for (var k in extraHeaders) headers[k] = extraHeaders[k];
    }
    var res = await Widget.http.get(url, { headers: headers });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body;
  } catch (e) { return ""; }
}

async function postForm(url, fields, referer) {
  var body = "";
  var first = true;
  for (var k in fields) {
    if (!first) body += "&";
    first = false;
    body += encodeURIComponent(k) + "=" + encodeURIComponent(fields[k]);
  }
  try {
    var res = await Widget.http.post(url, body, {
      headers: {
        "User-Agent": UA,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        "Referer": referer || HOST + "/"
      }
    });
    var data = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return data;
  } catch (e) { return ""; }
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function listUrl(id, page) {
  var p = Math.max(1, parseInt(page, 10) || 1);
  var base;
  if (id === "home" || id === "" || id == null) base = "/movies";
  else if (id === "censored") base = "/movies?genre=censored";
  else if (id === "uncensored") base = "/movies?genre=uncensored";
  else if (id === "amateur") base = "/movies?genre=amateur";
  else base = String(id);
  if (p <= 1) return HOST + base;
  if (base.indexOf("?") >= 0) return HOST + base + "&pg=" + p;
  return HOST + base + "/pg-" + p;
}

function parseList(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<a[^>]*href="\/play\/([^"]+)"[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var slug = m[1];
    if (!slug || seen[slug]) continue;
    var body = m[3] || "";
    var cm = body.match(/<span class="mli-code">([^<]*)<\/span>/i);
    var rm = body.match(/<span class="mli-runtimes">([^<]*)<\/span>/i);
    var im = body.match(/data-original="([^"]+)"/i) || body.match(/<img[^>]*src="(https?:\/\/[^"]+)"/i);
    var title = decodeHtml(t(m[2]));
    if (!title) continue;
    seen[slug] = 1;
    var code = cm ? t(cm[1]) : "";
    var mins = rm ? t(rm[1]) : "";
    var remarks = code + (mins ? (code ? " · " : "") + mins + "分钟" : "");
    out.push({
      id: HOST + "/play/" + slug,
      type: "url",
      title: title,
      posterPath: im ? absUrl(im[1]) : "",
      coverUrl: im ? absUrl(im[1]) : "",
      backdropPath: im ? absUrl(im[1]) : "",
      link: HOST + "/play/" + slug,
      description: remarks,
      mediaType: "movie"
    });
  }
  return out;
}

var ZONE_DEFAULT = { genre: "/genre/reducing-mosaic", actor: "/actor/yui-hatano", studio: "/studio/fc2ppv", label: "/label/madonna" };

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "home");
  var sub = t(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var id = zone;
  if (zone === "genre" || zone === "actor" || zone === "studio" || zone === "label") {
    id = sub || ZONE_DEFAULT[zone] || "";
  }
  try {
    var html = await getHtml(listUrl(id, page));
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
    var base = "/search/" + encodeURIComponent(wd);
    var url = page <= 1 ? HOST + base : HOST + base + "/pg-" + page;
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

// 从详情页提取：filmId、__pt、__pk、F4 服务器的 data-id
function extractPlayerInfo(html) {
  var out = { filmId: "", pt: "", pk: "", f4ep: "" };
  if (!html) return out;
  var m = html.match(/filmId\s*=\s*(\d+)/);
  if (m) out.filmId = m[1];
  m = html.match(/window\.__pt\s*=\s*"([^"]+)"/);
  if (m) out.pt = m[1];
  m = html.match(/window\.__pk\s*=\s*"([^"]+)"/);
  if (m) out.pk = m[1];
  var re = /data-source="(\d+)"\s+data-id="(-?\d+)"[^>]*>([\s\S]{0,120}?)<\/button>/g;
  var bm;
  while ((bm = re.exec(html)) !== null) {
    var name = t(decodeHtml(bm[3]).replace(/<[^>]*>/g, " "));
    if (name === "F4" && bm[2] && bm[2].charAt(0) !== "-") {
      out.f4ep = bm[2];
      if (!out.filmId) out.filmId = bm[1];
      break;
    }
  }
  return out;
}

// POST /ajax/player 拿 F4 embed 地址（player_enc XOR 解密）
async function resolveF4Embed(durl, info) {
  if (!info || !info.filmId || !info.f4ep || !info.pt || !info.pk) return "";
  var resp = await postForm(HOST + "/ajax/player",
    { episode: info.f4ep, filmId: info.filmId, pt: info.pt }, durl);
  if (!resp) return "";
  var playerEnc = "";
  try {
    var j = JSON.parse(resp);
    playerEnc = j && j.player_enc ? String(j.player_enc) : "";
  } catch (e) { return ""; }
  if (!playerEnc) return "";
  var playerHtml = xorDecrypt(playerEnc, info.pk);
  var m = playerHtml.match(/<iframe[^>]+src="(https?:\/\/[^"]+)"/i);
  if (!m) return "";
  return m[1];
}

// Worker /f4 取 master 播单（Worker 内现取签名 src 并注入 Origin 改写）
async function workerF4Master(embedUrl, durl) {
  var u = WORKER + "/f4?u=" + encodeURIComponent(embedUrl) + "&r=" + encodeURIComponent(durl);
  var txt = await getHtml(u, { "Accept": "application/vnd.apple.mpegurl,*/*" });
  if (!txt || txt.indexOf("#EXTM3U") < 0) return "";
  return txt;
}

// 解析 master 里的变体：#EXT-X-STREAM-INF(RESOLUTION=WxH) 下一行是变体地址
function parseVariants(master) {
  var out = [];
  if (!master) return out;
  var lines = String(master).split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    var s = t(lines[i]);
    if (s.indexOf("#EXT-X-STREAM-INF") !== 0) continue;
    var rm = s.match(/RESOLUTION=(\d+)x(\d+)/i);
    var height = rm ? parseInt(rm[2], 10) : 0;
    var url = "";
    for (var j = i + 1; j < lines.length && j <= i + 2; j++) {
      var u = t(lines[j]);
      if (u && u.charAt(0) !== "#") { url = u; break; }
    }
    if (!url) continue;
    var label = height ? (height + "p") : "";
    if (!label) {
      var lm = url.match(/\/(\d{3,4})p\//);
      if (lm) label = lm[1] + "p";
    }
    if (!label) label = "原画";
    out.push({ label: label, height: height, url: url });
  }
  return out;
}

function slugOf(durl) {
  var m = String(durl || "").match(/\/play\/([^/?#]+)/i);
  return m ? m[1] : "";
}

// F4 整链现解：详情页 -> ajax/player -> embed -> Worker /f4 master -> 变体
// 返回 { variants, embed, durl }；失败返回 null
async function resolveF4(slug) {
  var durl = HOST + "/play/" + slug;
  var html = await getHtml(durl);
  if (!html) return null;
  var info = extractPlayerInfo(html);
  var embed = await resolveF4Embed(durl, info);
  if (!embed) return null;
  var master = await workerF4Master(embed, durl);
  if (!master) return null;
  var variants = parseVariants(master);
  return { variants: variants, embed: embed, durl: durl };
}

function extractTitle(html, fallback) {
  var m = html.match(/<title>([^<]*)<\/title>/i);
  if (m) return decodeHtml(t(m[1]));
  return fallback || "";
}

function extractCover(html) {
  var m = html.match(/<img[^>]*class="cover"[^>]*src="([^"]+)"/i)
    || html.match(/<img[^>]*src="([^"]+)"[^>]*class="cover"/i);
  if (m) return absUrl(m[1]);
  m = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  if (m) return absUrl(m[1]);
  return "";
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var durl = /^https?:\/\//i.test(raw) ? raw : absUrl(raw);
    var slug = slugOf(durl);
    if (!slug) return { id: durl, type: "url", title: "解析失败", description: "链接不是详情页" };
    var html = await getHtml(durl);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = extractTitle(html, slug);
    var pic = extractCover(html);
    // F4 链现解，拿真实档位出线；链路当时没跑通也留一条 F4 线，点播时现解
    var lines = [];
    var rs = await resolveF4(slug);
    if (rs && rs.variants.length) {
      for (var i = 0; i < rs.variants.length; i++) {
        lines.push({ label: rs.variants[i].label, lazy: "@@F4:" + slug + ":" + rs.variants[i].label });
      }
    }
    if (!lines.length) lines = [{ label: "F4", lazy: "@@F4:" + slug + ":auto" }];
    var epsList = [];
    var epItems = [];
    var seasonEps = [];
    for (var k = 0; k < lines.length; k++) {
      epsList.push({ name: lines[k].label, link: lines[k].lazy });
      seasonEps.push({ title: lines[k].label, episodeNumber: k + 1 });
      epItems.push({
        id: lines[k].lazy,
        type: "url",
        title: lines[k].label,
        mediaType: "movie",
        posterPath: pic,
        link: lines[k].lazy,
        episode: k + 1,
        episodeNumber: k + 1,
        seasonIndex: 1,
        seasonNumber: 1
      });
    }
    return {
      id: durl,
      type: "detail",
      title: name || slug,
      name: name || slug,
      description: "",
      mediaType: "movie",
      link: durl,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app",
      episodes: epsList,
      seasons: [{ seasonNumber: 1, title: "清晰度", name: "清晰度", episodes: seasonEps }],
      episodeItems: epItems,
      childItems: epItems
    };
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
  var at = raw.indexOf("@@F4:");
  if (at >= 0) {
    var tok = raw.slice(at + 5);
    var m = tok.match(/^([^:]+):(.+)$/);
    if (!m) return [];
    var slug = m[1];
    var want = m[2];
    // 现取：详情页（新鲜 __pt/__pk）-> ajax/player -> embed -> Worker /f4 取 master
    var rs = await resolveF4(slug);
    if (!rs) return [];
    var url = WORKER + "/f4?u=" + encodeURIComponent(rs.embed) + "&r=" + encodeURIComponent(rs.durl);
    if (want && want !== "auto") {
      var hit = null;
      for (var i = 0; i < rs.variants.length; i++) {
        if (rs.variants[i].label === want || String(rs.variants[i].height) === want.replace(/p$/i, "")) {
          hit = rs.variants[i];
          break;
        }
      }
      if (hit && hit.url) url = hit.url;
    }
    return [{ name: want === "auto" ? "F4" : want, url: url, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  }
  // 直链 m3u8
  if (/\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  }
  // 兜底：详情页地址 -> 取详情首集
  try {
    var det = await loadDetail(raw);
    var eps2 = det && det.episodeItems;
    if (eps2 && eps2.length) {
      return await loadResource({ link: eps2[0].id });
    }
  } catch (e) { /* fall through */ }
  return [];
}
