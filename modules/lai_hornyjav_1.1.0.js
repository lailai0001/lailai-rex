// HornyJav for REX (lai_hornyjav v1.1.0)
// 移植自 mira-cat 蜘蛛 py_hornyjav.js（只读蓝图），后端 https://hornyjav.com（WordPress retrotube，wp-json 401，只解析 HTML）。
// 列表：<article class="loop-video thumb-block">，链接 /{slug}/，封面 image.hornyjav.com 直链；分页 /page/N/，分类 /category/{slug}/page/N/。
// 详情：<div class="box-server" data-server-urls="[token, …]">（每帖 4 个 token）；
//   token 解码：反转字符串 → base64url 转 base64 解码 → 按字节与密钥 "KmzWa8awaallakclnu" 循环异或 → videplay 嵌页 URL；
//   解出非 https:// 开头的视为密钥已换，该条作废；嵌页是 jwplayer8 页，内含 Dean Edwards 打包块，解包后取
//   master 清单。2026-11-07 上游已变：嵌页宿主迁到 streamhx（dual/api.streamhx.win，另有 /ved/ 与 f4-master
//   变体），master 形如 https://<host>/…/v-master.m3u8/<TOKEN>，TOKEN 段不可丢（旧正则只认 api.videplay.us/o/
//   且回退在 .m3u8 后截断，返回的裸 master 一律 404，就是“解析出来播不了”的主因）。本站给的是服务器选择
//   （4 条线），不是分辨率档（master 内单 720p 码率）。4 条嵌页并行解；每条 master 再并行验活（须取到 #EXTM3U 清单，
//   死 token 线——源站 502 或 200 空体——不列出）；loadDetail 出 4 集（每集即一条服务
//   器线，带直接 videoUrl），播放走 stream 模块 loadResource，点播时按所选线实时重解 master（令牌可能有时效）。
//   注意：分片是真 TS 却伪装成图片下发（70 字节 1×1 PNG 头 + TS 体、tiktokcdn .image 地址 + image/png 类型），
//   严格 HLS 内核可能按扩展名拒收；猫源版用本地 /proxy/m3u8 改写清单（分片行尾加 &x=.ts）绕过，REX 沙箱内无
//   本地代理，本模块只给出直链 master，设备播放仍须真机验证。
// base64 与解包均为纯字符串运算，不依赖运行环境的编解码接口。
// 字幕：猫源本身无字幕线，本模块不接。

WidgetMetadata = {
  id: "lai_hornyjav",
  title: "HornyJav",
  description: "HornyJav（hornyjav.com）：有码/英字/减码等 23 个分类，详情解 4 条服务器 token 取 streamhx master 清单，播放走 stream 模块实时重解",
  author: "lai",
  version: "1.1.0",
  requiredVersion: "0.0.1",
  site: "https://hornyjav.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/censored/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "英字", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/english-subtitle/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "减码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/reducing-mosaic/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/big-tits/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨臀", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/huge-butt/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "美臀", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/beautiful-butt/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/amateur/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "美少女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/beautiful-girl/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/married-woman/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "熟女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/mature-woman/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "熟妇", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/milf/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "校园", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/school-girls/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "出轨妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/cheating-wife/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "年轻妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/young-wife/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中出", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/creampie/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "口交", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/blowjob/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "剧情", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/drama/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "女同", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/lesbian/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "硬核", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/hardcore/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "第一视角", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/pov/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "潮吹", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/squirting/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "多人", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/threesome-foursome/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "苗条", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/tag/slender/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { id: "loadResource", title: "HornyJav播放源", description: "播放时按所选服务器实时解析 master 清单", functionName: "loadResource", type: "stream", cacheDuration: 0, params: [] }
  ]
};

var HOST = "https://hornyjav.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var XOR_KEY = "KmzWa8awaallakclnu";
var B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function cleanText(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/&#x([0-9a-fA-F]+);/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); })
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

function firstMatch(text, re, idx) {
  var m = String(text || "").match(re);
  return m ? t(m[idx || 1] || "") : "";
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": referer || HOST + "/"
  };
}

async function getText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

// 纯字符串 base64 解码，返回 latin1 字符串（每个字符即一个字节）
function b64ToLatin1(s) {
  s = String(s || "").replace(/-/g, "+").replace(/_/g, "/").replace(/[^A-Za-z0-9+\/=]/g, "");
  while (s.length % 4) s += "=";
  var out = "";
  for (var i = 0; i < s.length; i += 4) {
    var c0 = B64_ALPHABET.indexOf(s.charAt(i));
    var c1 = B64_ALPHABET.indexOf(s.charAt(i + 1));
    var c2 = B64_ALPHABET.indexOf(s.charAt(i + 2));
    var c3 = B64_ALPHABET.indexOf(s.charAt(i + 3));
    if (c0 < 0 || c1 < 0) break;
    out += String.fromCharCode((c0 << 2) | (c1 >> 4));
    if (c2 >= 0) out += String.fromCharCode(((c1 & 15) << 4) | (c2 >> 2));
    if (c3 >= 0) out += String.fromCharCode(((c2 & 3) << 6) | c3);
  }
  return out;
}

function decodeToken(tok) {
  try {
    var rev = String(tok || "").split("").reverse().join("");
    var raw = b64ToLatin1(rev);
    if (!raw) return "";
    var out = "";
    for (var i = 0; i < raw.length; i++) {
      out += String.fromCharCode(raw.charCodeAt(i) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length));
    }
    return out;
  } catch (e) {
    return "";
  }
}

function jsUnescapeSingle(s) {
  return s.replace(/\\(.)/g, function (m, c) {
    if (c === "n") return "\n";
    if (c === "r") return "\r";
    if (c === "t") return "\t";
    return c;
  });
}

// Dean Edwards 打包解包（纯字符串操作，与猫源同款，不做代码求值）
function unpackDeanEdwards(html) {
  var m = String(html || "").match(/eval\(function\(p,a,c,k,e,d\)[\s\S]*?\}\s*\(\s*'((?:[^'\\]|\\.)*)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:[^'\\]|\\.)*)'\.split\('\|'\)/);
  if (!m) return "";
  var p = jsUnescapeSingle(m[1]);
  var a = parseInt(m[2], 10);
  var c = parseInt(m[3], 10);
  var k = jsUnescapeSingle(m[4]).split("|");
  function enc(n) {
    return (n < a ? "" : enc(Math.floor(n / a))) + ((n % a) > 35 ? String.fromCharCode((n % a) + 29) : (n % a).toString(36));
  }
  var i = c;
  while (i--) {
    if (k[i]) {
      (function (word, token) {
        p = p.replace(new RegExp("\\b" + token + "\\b", "g"), function () { return word; });
      })(k[i], enc(i));
    }
  }
  return p;
}

function parseCards(html) {
  var items = [];
  var seen = {};
  var re = /<article[^>]*class="[^"]*loop-video[^"]*"[^>]*>([\s\S]{0,6000}?)<\/article>/gi;
  var m;
  while ((m = re.exec(html))) {
    var blk = m[1];
    var lm = blk.match(/<a[^>]*href="(https:\/\/hornyjav\.com\/[^"]+\/)"[^>]*>/i);
    if (!lm) continue;
    var href = lm[1];
    if (seen[href]) continue;
    seen[href] = 1;
    var clean = blk.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    var pic = "";
    var im = clean.match(/<img[^>]*>/i);
    if (im) {
      var sm = im[0].match(/(?:data-src|data-original|src)\s*=\s*"([^"]+)"/i);
      if (sm && /^https?:\/\//i.test(sm[1]) && sm[1].indexOf("data:image") !== 0) pic = sm[1];
    }
    var title = "";
    var tm = clean.match(/<a[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]{0,300}?)<\/a>/i)
      || clean.match(/title="([^"]+)"/i);
    if (tm) title = cleanText(tm[1]);
    if (!title) {
      var hm = clean.match(/<h[23][^>]*>([\s\S]{0,300}?)<\/h[23]>/i);
      if (hm) title = cleanText(hm[1]);
    }
    if (!title || title.length < 2) continue;
    var remarks = "";
    var dm = clean.match(/(\d+:\d+(?::\d+)?)/);
    if (dm) remarks = dm[1];
    items.push({
      id: href,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: href,
      description: remarks,
      mediaType: "movie"
    });
    if (items.length >= 60) break;
  }
  return items;
}

function listOrMsg(html, url) {
  if (!html) return [{ id: "empty", type: "url", title: "空页面" }];
  var list = parseCards(html);
  return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
}

function listUrl(cat, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  cat = t(cat) || "/category/censored/";
  var base = (HOST + "/" + cat.replace(/^\/+/, "")).replace(/\/+$/, "");
  return page === 1 ? base + "/" : base + "/page/" + page + "/";
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var cat = String(params.path || params.cat || "/category/censored/");
  var url = listUrl(cat, page);
  try {
    var html = await getText(url, HOST + "/");
    return listOrMsg(html, url);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
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
  var page = parseInt(params.page, 10) || 1;
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var url = HOST + "/?s=" + encodeURIComponent(wd) + (page > 1 ? "&paged=" + page : "");
  try {
    var html = await getText(url, HOST + "/");
    return listOrMsg(html, url);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

async function resolveVideplay(embedUrl, durl) {
  var html = "";
  try { html = await getText(embedUrl, durl); } catch (e) { return ""; }
  if (!html) return "";
  var hay = (unpackDeanEdwards(html) || html).replace(/\\\//g, "/");
  // 2026-11-07：取“*.m3u8/<token>”全段（任意域名/路径，含 /ved/ 与
  // f4-master 变体）；token 段不可丢，丢了就是 404。无 token 段的裸
  // 清单只作次选。token 段字符类排除反斜杠，避免把尾部 \" 的反斜杠吞进 URL。
  var m = hay.match(/https?:\/\/[^\s"'<>\\]*\.m3u8\/[^\s"'<>\\]+/i);
  if (m) return m[0];
  var m2 = hay.match(/https?:\/\/[^\s"'<>\\]+\.m3u8(?:\?[^\s"'<>\\]*)?/i);
  return m2 ? m2[0] : "";
}

// 详情解析共用：取详情页，解 4 条服务器 token，4 条嵌页并行解 master。
// 返回 { title, cover, lines: [{ idx, embed, master }] }（lines 按 token 原序）。
async function resolveLines(durl) {
  var html = "";
  try { html = await getText(durl, HOST + "/"); } catch (e) { html = ""; }
  var title = cleanText(firstMatch(html, /<h1[^>]*>([\s\S]{0,400}?)<\/h1>/i))
    || firstMatch(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
    || "HornyJav";
  var cover = firstMatch(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  var embeds = [];
  var bm = html.replace(/&quot;/g, '"').match(/data-server-urls="\[([^\]]*)\]"/i);
  if (bm) {
    var tokens = [];
    try { tokens = JSON.parse("[" + bm[1] + "]"); } catch (e) { tokens = []; }
    for (var i = 0; i < tokens.length; i++) {
      var embed = decodeToken(tokens[i]);
      if (embed && embed.indexOf("https://") === 0) embeds.push({ idx: i + 1, embed: embed });
    }
  }
  // 4 条嵌页并行解（串行实测每条 2–10 秒）；线名按 token 原序
  var masters = await Promise.all(embeds.map(function (e) {
    return resolveVideplay(e.embed, durl).catch(function () { return ""; });
  }));
  var rawLines = [];
  for (var k = 0; k < embeds.length; k++) {
    if (masters[k]) rawLines.push({ idx: embeds[k].idx, embed: embeds[k].embed, master: masters[k] });
  }
  // master 逐条验活（与猫源同法，2026-11-07 probe15）：个别线 token 已死
  // （源站 502 或 200 空体），只留取到有效清单的线；并行验，清单须以 #EXTM3U 开头。
  var liveFlags = await Promise.all(rawLines.map(function (ln) {
    return getText(ln.master, ln.embed).then(function (txt) {
      return (txt && txt.indexOf("#EXTM3U") === 0);
    }).catch(function () { return false; });
  }));
  var lines = [];
  for (var j = 0; j < rawLines.length; j++) {
    if (liveFlags[j]) lines.push(rawLines[j]);
  }
  return { title: title, cover: cover, lines: lines, html: html };
}

// 集令牌：hornyjav://line/<idx>/<encodeURIComponent(详情 URL)>
function lineToken(durl, idx) {
  return "hornyjav://line/" + idx + "/" + encodeURIComponent(durl);
}

function parseLineToken(raw) {
  var m = String(raw || "").match(/^hornyjav:\/\/line\/(\d+)\/(.+)$/);
  if (!m) return null;
  var durl = "";
  try { durl = decodeURIComponent(m[2]); } catch (e) { return null; }
  return { idx: parseInt(m[1], 10) || 0, durl: durl };
}

function streamRow(name, master, embed, durl) {
  return {
    name: name,
    url: master,
    playerType: "app",
    customHeaders: { "User-Agent": UA, "Referer": embed || durl }
  };
}

function sniffRow(durl) {
  return [{
    name: "网页嗅探",
    url: durl,
    playerType: "app",
    customHeaders: { "User-Agent": UA, "Referer": HOST + "/" },
    description: "服务器线未解出，交播放器 WebView 嗅探详情页。"
  }];
}

async function loadDetail(link) {
  try {
    var url = String(link || "");
    if (!/^https?:\/\//i.test(url)) url = HOST + "/" + url.replace(/^\/+/, "");
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var rl = await resolveLines(url);
    var title = rl.title;
    var cover = rl.cover;
    var lines = rl.lines;
    if (!rl.html) {
      return { id: url, type: "url", title: title, link: url, description: "详情页未取到，请稍后重试" };
    }
    var episodes = [];
    var episodeItems = [];
    var i;
    for (i = 0; i < lines.length; i++) {
      var ln = lines[i];
      var nm = "服务器" + ln.idx;
      var tok = lineToken(url, ln.idx);
      episodes.push({ name: nm, id: tok, link: tok });
      episodeItems.push({
        id: tok,
        title: title + " " + nm,
        name: nm,
        mediaType: "movie",
        seasonNumber: 1,
        episodeNumber: ln.idx,
        link: tok,
        videoUrl: ln.master,
        customHeaders: { "User-Agent": UA, "Referer": ln.embed }
      });
    }
    if (!lines.length) {
      episodes.push({ name: "网页嗅探·兜底", id: url, link: url });
      episodeItems.push({
        id: url,
        title: title + " 网页嗅探",
        name: "网页嗅探·兜底",
        mediaType: "movie",
        seasonNumber: 1,
        episodeNumber: 1,
        link: url,
        videoUrl: "",
        customHeaders: { "User-Agent": UA, "Referer": url }
      });
    }
    var firstMaster = lines.length ? lines[0].master : "";
    var firstEmbed = lines.length ? lines[0].embed : url;
    return {
      id: url,
      type: "detail",
      title: title,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      description: lines.length ? ("共 " + lines.length + " 条服务器线（服务器选择，非清晰度档）；播放走 stream 模块，点播时按所选线实时重解 master。") : "服务器线未解出，可点网页嗅探兜底集。",
      videoUrl: firstMaster,
      playerType: "app",
      customHeaders: { "User-Agent": UA, "Referer": firstEmbed },
      episodes: episodes,
      episodeItems: episodeItems,
      childItems: episodeItems,
      seasons: [{ seasonNumber: 1, name: "服务器线路", title: "服务器线路", episodeItems: episodeItems }]
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// stream 模块入口：集令牌 / master 直链 / 详情链接 → 实时出流
async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  if (!raw && params.item) raw = params.item.link || params.item.id || params.item.url || "";
  raw = String(raw || "");
  try {
    var tok = parseLineToken(raw);
    if (tok && tok.durl) {
      var rl = await resolveLines(tok.durl);
      var lines = rl.lines;
      var pick = null;
      var i;
      for (i = 0; i < lines.length; i++) {
        if (lines[i].idx === tok.idx) { pick = lines[i]; break; }
      }
      if (!pick && lines.length) pick = lines[0];
      if (pick) return [streamRow("服务器" + pick.idx, pick.master, pick.embed, tok.durl)];
      return sniffRow(tok.durl);
    }
    if (/\.m3u8/i.test(raw)) {
      return [{ name: "HornyJav", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
    var durl = /^https?:\/\//i.test(raw) ? raw : (raw ? HOST + "/" + raw.replace(/^\/+/, "") : "");
    if (!durl) return [];
    var rl2 = await resolveLines(durl);
    if (rl2.lines.length) {
      var best = rl2.lines[0];
      return [streamRow("服务器" + best.idx, best.master, best.embed, durl)];
    }
    return sniffRow(durl);
  } catch (e) {
    return [];
  }
}
