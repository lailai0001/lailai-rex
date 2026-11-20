// PubJav for REX (lai_pubjav v1.0.3)
// v1.0.3（2026-11-21）：补顶层 search 键（A 键，照 64 个可见模块的众数形状）；B 条目与 search 函数一个字未动。
// v1.0.2（2026-11-21）：修真机“详情显示按需解析、点播转圈”——根因不在模块 POST，
//   而在 F4 上游已死：f4scdn.com / f4splay.vip 的 embed 源站回 502 Bad Gateway，
//   新鲜现铸的 embed（Worker /resolve 当场铸出）取 embed 页也 502，/f4 路由因此
//   全灭（"f4 embed status 502"），详情现解拿不到 master → 只剩无 videoUrl 的 F4 懒行
//   → App 显示按需解析；点播现解同样死在 /f4 → 回 [] → 转圈。sextb 同款 /f4 亦受累。
//   修法：① 加 SW 第二线（站内真实按钮，data-id 与 F4 同页）：同款 POST 取 embed，
//   走 sextb-hls Worker /v（hglink.to 系 embed）取 master 出线；F4 保留首位，
//   f4scdn 恢复即能播。② 修两处真缺陷：懒行 videoUrl 空串（App 当无内容，改整个省略
//   该键；顶层 videoUrl 无 master 时也不设）；POST 补同会话 Cookie 回显（javdo 同款
//   cookieFromHeaders，运行侧回传响应头时显式取 Set-Cookie 发 Cookie 头，不回传时靠
//   App 共享 jar）+ Origin 头（浏览器 POST 自带，站方可能校验）。③ SW 线注意：
//   sextb 侧 SW 实测 /v 回的播单分片全是 PNG 广告图（诱饵播单），SW 能否真播须真机定性，
//   若 SW 亦播不了则 PubJav 暂无可播线、只等 f4scdn 恢复。
// v1.0.1（2026-11-14）：修真机“BEB-073 出 720p 行、点播空白”——根因是点播全靠 loadResource 二次解析，
//   二次 ajax 的 __pt 疑似一次性、详情页一旦被缓存就复用过期 pt，resolveF4 在点播时失败回 []，
//   播放区空白。修法按 sextb 1.0.3 / javhey / 24jav 同款交接：详情现解的变体地址直接进集内 videoUrl
//   （点播即播，不再等二次解析）；link/id 仍留懒解析 @@F4 token 作回落；loadResource 保留新鲜现解，
//   现解失败时用详情时缓存的 embed 地址回 /f4 主播单兜底；已是 Worker /f4|/p 地址的入参直接出流。
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
  description: "PubJav：JAV 站，4 顶级 + 类型/女优/厂商/厂牌筛选，F4/SW 双线走 sextb-hls Worker /f4 与 /v，单档 720p，点播现解",
  author: "lai",
  version: "1.0.3",
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

var HOST = "https://pubjav.com";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
var WORKER = "https://sextb-hls.li768435813.workers.dev";
// 详情现解成功时缓存的 embed 地址（同 App 会话内有效）：点播时新鲜现解若失败
// （如 __pt 一次性、详情页被缓存复用过期 pt），用它回 /f4 主播单兜底，不直接空白。
var EMBED_CACHE = {};

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

// Set-Cookie -> Cookie 头（只取真实 cookie 名值，剔 expires/path/domain 等属性；
// javdo 同款。运行侧不回传响应头时返回 ""，调用方不发 Cookie 头、靠 App 共享 jar）
function cookieFromHeaders(headers) {
  if (!headers) return "";
  var raw = "";
  try {
    if (typeof headers.getSetCookie === "function") {
      var arr = headers.getSetCookie();
      if (arr && arr.length) raw = arr.join("\n");
    }
  } catch (e) { /* 无 getSetCookie */ }
  if (!raw) raw = headers["set-cookie"] || headers["Set-Cookie"] || "";
  if (!raw) return "";
  var out = [];
  var lines = String(raw).split("\n");
  for (var i = 0; i < lines.length; i++) {
    var kv = t(lines[i].split(";")[0]);
    if (kv && kv.indexOf("=") > 0) out.push(kv);
  }
  return out.join("; ");
}

// 取页并回传响应头里的 Cookie（详情页会话 Cookie，供 ajax/player POST 回显）
async function getHtmlRaw(url, extraHeaders) {
  try {
    var headers = { "User-Agent": UA, "Referer": HOST + "/" };
    if (extraHeaders) {
      for (var k in extraHeaders) headers[k] = extraHeaders[k];
    }
    var res = await Widget.http.get(url, { headers: headers });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    var cookie = "";
    try { cookie = cookieFromHeaders(res && res.headers); } catch (e) { cookie = ""; }
    return { body: body, cookie: cookie };
  } catch (e) { return { body: "", cookie: "" }; }
}

async function postForm(url, fields, referer, cookie) {
  var body = "";
  var first = true;
  for (var k in fields) {
    if (!first) body += "&";
    first = false;
    body += encodeURIComponent(k) + "=" + encodeURIComponent(fields[k]);
  }
  try {
    var headers = {
      "User-Agent": UA,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
      "Origin": HOST,
      "Referer": referer || HOST + "/"
    };
    if (cookie) headers["Cookie"] = cookie;
    var res = await Widget.http.post(url, body, { headers: headers });
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

// 从详情页提取：filmId、__pt、__pk、F4 与 SW 服务器的 data-id
function extractPlayerInfo(html) {
  var out = { filmId: "", pt: "", pk: "", f4ep: "", swep: "" };
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
    if (bm[2] && bm[2].charAt(0) !== "-") {
      if (name === "F4" && !out.f4ep) {
        out.f4ep = bm[2];
        if (!out.filmId) out.filmId = bm[1];
      } else if (name === "SW" && !out.swep) {
        out.swep = bm[2];
        if (!out.filmId) out.filmId = bm[1];
      }
    }
    if (out.f4ep && out.swep) break;
  }
  return out;
}

// POST /ajax/player 拿 embed 地址（player_enc XOR 解密）；episodeId 为 F4/SW 的 data-id；
// cookie 为详情页同会话 Cookie（回显；无则不发，靠 App 共享 jar）
async function resolveEmbed(durl, info, episodeId, cookie) {
  if (!info || !info.filmId || !episodeId || !info.pt || !info.pk) return "";
  var resp = await postForm(HOST + "/ajax/player",
    { episode: episodeId, filmId: info.filmId, pt: info.pt }, durl, cookie);
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

// Worker 取 master 播单：F4 走 /f4（f4scdn embed），SW 走 /v（xfs embed）；
// Worker 内现取签名 src 并注入 Origin 改写。无 #EXTM3U 即失败（上游 502 时亦如此）。
async function workerMaster(embedUrl, durl, line) {
  var route = line === "SW" ? "/v" : "/f4";
  var u = WORKER + route + "?u=" + encodeURIComponent(embedUrl) + "&r=" + encodeURIComponent(durl);
  var txt = await getHtml(u, { "Accept": "application/vnd.apple.mpegurl,*/*" });
  if (!txt || txt.indexOf("#EXTM3U") < 0) return "";
  return txt;
}

// 某条线的 Worker 主播单地址（详情顶层 videoUrl 用）
function workerLineUrl(line, embed, durl) {
  var route = line === "SW" ? "/v" : "/f4";
  return WORKER + route + "?u=" + encodeURIComponent(embed) + "&r=" + encodeURIComponent(durl);
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

// 整链现解：详情页（取会话 Cookie）-> ajax/player（Cookie 回显）-> embed
// -> Worker /f4 或 /v 取 master -> 变体。返回 { line, variants, embed, durl }；失败 null。
// line: "F4" | "SW"。
async function resolveLine(slug, line) {
  var durl = HOST + "/play/" + slug;
  var raw = await getHtmlRaw(durl);
  if (!raw.body) return null;
  var info = extractPlayerInfo(raw.body);
  var episodeId = line === "SW" ? info.swep : info.f4ep;
  var embed = await resolveEmbed(durl, info, episodeId, raw.cookie);
  if (!embed) return null;
  var master = await workerMaster(embed, durl, line);
  if (!master) return null;
  var variants = parseVariants(master);
  try { EMBED_CACHE[line + ":" + slug] = embed; } catch (e) { /* 缓存失败不影响播放 */ }
  return { line: line, variants: variants, embed: embed, durl: durl };
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
    // 双线现解：F4 首位（f4scdn 恢复即能播），SW 次位（站内真实第二线）。
    // 哪条解出 master 就出哪条的档位；两条都死则只留懒行，点播时现解。
    var lines = [];
    var masterUrl = "";
    var rsF4 = await resolveLine(slug, "F4");
    if (rsF4 && rsF4.variants.length) {
      for (var i = 0; i < rsF4.variants.length; i++) {
        // 变体地址是 Worker /p 地址（详情现解的新鲜签名，2 小时内有效）；集内带 videoUrl，
        // 点播即播，不再等 loadResource 二次 ajax（二次 __pt 疑似一次性、易空）。
        lines.push({ label: "F4·" + rsF4.variants[i].label, lazy: "@@F4:" + slug + ":" + rsF4.variants[i].label, videoUrl: rsF4.variants[i].url });
      }
      masterUrl = workerLineUrl("F4", rsF4.embed, rsF4.durl);
    }
    var rsSW = await resolveLine(slug, "SW");
    if (rsSW && rsSW.variants.length) {
      for (var j = 0; j < rsSW.variants.length; j++) {
        lines.push({ label: "SW·" + rsSW.variants[j].label, lazy: "@@SW:" + slug + ":" + rsSW.variants[j].label, videoUrl: rsSW.variants[j].url });
      }
      if (!masterUrl) masterUrl = workerLineUrl("SW", rsSW.embed, rsSW.durl);
    }
    if (!lines.length) lines = [
      { label: "F4", lazy: "@@F4:" + slug + ":auto", videoUrl: "" },
      { label: "SW", lazy: "@@SW:" + slug + ":auto", videoUrl: "" }
    ];
    var epsList = [];
    var epItems = [];
    var seasonEps = [];
    for (var k = 0; k < lines.length; k++) {
      epsList.push({ name: lines[k].label, link: lines[k].lazy });
      // v1.0.2：懒行整个省略 videoUrl 键——空串 videoUrl 会被 App 当无内容。
      var se = { title: lines[k].label, episodeNumber: k + 1 };
      if (lines[k].videoUrl) se.videoUrl = lines[k].videoUrl;
      seasonEps.push(se);
      var item = {
        id: lines[k].lazy,
        type: "url",
        title: lines[k].label,
        mediaType: "movie",
        posterPath: pic,
        link: lines[k].lazy,
        episode: k + 1,
        episodeNumber: k + 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: lines[k].videoUrl ? "system" : "app"
      };
      if (lines[k].videoUrl) {
        item.videoUrl = lines[k].videoUrl;
        item.customHeaders = { "User-Agent": UA, "Referer": HOST + "/" };
      }
      epItems.push(item);
    }
    var detailResult = {
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
      playerType: masterUrl ? "system" : "app",
      episodes: epsList,
      seasons: [{ seasonNumber: 1, title: "线路", name: "线路", episodes: seasonEps }],
      episodeItems: epItems,
      childItems: epItems
    };
    // v1.0.2：顶层 videoUrl 只在有 master 时设；无 master 时整个省略（空串会被 App 当无内容）。
    if (masterUrl) detailResult.videoUrl = masterUrl;
    return detailResult;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || params.item.videoUrl || "");
  if (!raw) return [];
  // 已是 Worker /f4|/v|/p 直链：直接出 system 行（详情集内 videoUrl 点播即此路）
  if (raw.indexOf(WORKER + "/f4?") === 0 || raw.indexOf(WORKER + "/v?") === 0 || raw.indexOf(WORKER + "/p?") === 0) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA } }];
  }
  // 集内 videoUrl 随 item 一起传来时直接出流
  if (params.item && params.item.videoUrl && (String(params.item.videoUrl).indexOf(WORKER + "/f4?") === 0 || String(params.item.videoUrl).indexOf(WORKER + "/v?") === 0 || String(params.item.videoUrl).indexOf(WORKER + "/p?") === 0)) {
    return [{ name: "播放", url: String(params.item.videoUrl), playerType: "system", customHeaders: { "User-Agent": UA } }];
  }
  var atF4 = raw.indexOf("@@F4:");
  var atSW = raw.indexOf("@@SW:");
  var at = atF4 >= 0 ? atF4 : atSW;
  var line = atF4 >= 0 ? "F4" : "SW";
  if (at >= 0) {
    var tok = raw.slice(at + 5);
    var m = tok.match(/^([^:]+):(.+)$/);
    if (!m) return [];
    var slug = m[1];
    var want = m[2];
    // 现取：详情页（新鲜 __pt/__pk + 会话 Cookie）-> ajax/player -> embed -> Worker 取 master
    var rs = await resolveLine(slug, line);
    if (!rs) {
      // 新鲜现解失败（__pt 一次性/详情页缓存复用过期 pt）：用详情时缓存的 embed 回 Worker 主播单兜底
      var cached = EMBED_CACHE[line + ":" + slug] || "";
      if (cached) {
        var durl2 = HOST + "/play/" + slug;
        return [{ name: want === "auto" ? line : want, url: workerLineUrl(line, cached, durl2), playerType: "system", customHeaders: { "User-Agent": UA } }];
      }
      return [];
    }
    var url = workerLineUrl(line, rs.embed, rs.durl);
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
    return [{ name: want === "auto" ? line : want, url: url, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
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
