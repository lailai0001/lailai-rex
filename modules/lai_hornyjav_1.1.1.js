// HornyJav for REX (lai_hornyjav v1.1.1)
// 移植自 mira-cat 蜘蛛 py_hornyjav.js（只读蓝图），后端 https://hornyjav.com（WordPress retrotube，wp-json 401，只解析 HTML）。
// 列表：<article class="loop-video thumb-block">，链接 /{slug}/，封面 image.hornyjav.com 直链；分页 /page/N/，分类 /category/{slug}/page/N/。
// 详情：<div class="box-server" data-server-urls="[token, …]">（每帖 3–4 个 token）；
//   token 解码：反转字符串 → base64url 转 base64 解码 → 按字节与密钥 "KmzWa8awaallakclnu" 循环异或 → videplay 嵌页 URL；
//   解出非 https:// 开头的视为密钥已换，该条作废；嵌页是 jwplayer8 页，内含 Dean Edwards 打包块（2026-11-07 晚查实：
//   上游嵌页已改版，打包块消失，master 直接写在 realembed() 的 iframe src 里；解包失败时原有“解包或原 HTML”
//   兜底即为主路，无需改逻辑），解包后取 master 清单。上游已变：嵌页宿主迁到 streamhx（dual/api.streamhx.win，
//   另有 /ved/ 与 f4-master 变体），master 形如 https://<host>/…/v-master.m3u8/<TOKEN>，TOKEN 段不可丢（旧正则只认
//   api.videplay.us/o/ 且回退在 .m3u8 后截断，返回的裸 master 一律 404，就是“解析出来播不了”的主因）。本站给的是
//   服务器选择（3–4 条线），不是分辨率档（master 内单 720p 码率）。4 条嵌页并行解；每条 master 再并行验活（须取到
//   #EXTM3U 清单，死 token 线——源站 502 或 200 空体——不列出）；loadDetail 出 3–4 集（每集即一条服务器线，带直接
//   videoUrl），播放走 stream 模块 loadResource。
//   1.1.1 两处补（2026-11-07 晚实测坐实，猫源对照）：
//   (a) 播单改写——猫源 play() 的地址包在本地 /proxy/m3u8 里，代理把媒体清单的分片行改成 CDN 绝对地址 + &x=.ts；
//       REX 1.1.0 给的是裸 master，媒体清单里 1440 个分片全是 tiktokcdn .image 地址 + image/png 类型、每片前 70 字节
//       是 1×1 PNG 头再接真 TS，设备内核建不起时间轴，就是用户报的“播放解析不到地址”。REX 沙箱内无本地代理，改走已部署
//       的 sextb-hls Worker v2（用户 2026-11-07 20:13 已部署，根路径 v2 (ts-fix)）：master 只有单 720p 变体，模块在
//       验活时已取到变体地址，直接把变体交给 Worker /p?u=<变体>&e=<嵌页> 改写，分片走 /s 回传（实测：PNG 头剥掉 70 字节、
//       Content-Type 强制 video/MP2T、首字节 0x47 同步，播放器只跟 Worker 说话、零自定义头，与 sextb 同款走法）。
//       注意：v2 改写把 .image 分片指到 /s?u=（路径无 .ts 后缀，.image 不在它的伪装扩展名表里）；VM 侧 stub+MIME 已修，
//       若真机仍报解析失败，下一步是 Worker 加一行（isDisguisedSegment 认 .image）+ 用户重部署，不在本模块改动内。
//   (b) 即时点播——猫源 play() 直接返回详情里已解好的地址（parse:0，零等待）；REX 1.1.0 的 loadResource 收到集令牌后
//       把详情页 + 全部嵌页 + 全部验活重做一遍（VM 实测 20–35 秒，单条嵌页曾 20 秒超时、28 秒才回），设备端点播窗口内
//       拿不到地址即为空行。1.1.1 把已解好的变体 + 嵌页写进集令牌（token 经 (视频, 服务器) 固化，今早 09:42 的 master
//       当晚 21:50 复取仍活），loadResource 只做一次变体验活（约 2–8 秒）即回行；验活失败才回退全量重解。旧版
//       hornyjav://line/ 令牌仍认（走全量重解兜底）。
// base64 与解包均为纯字符串运算，不依赖运行环境的编解码接口。
// 字幕：猫源本身无字幕线，本模块不接。

WidgetMetadata = {
  id: "lai_hornyjav",
  title: "HornyJav",
  description: "HornyJav（hornyjav.com）：有码/英字/减码等 23 个分类，详情解 3–4 条服务器 token 取 streamhx 变体清单，播放走已部署 sextb-hls Worker v2（/p 改写播单、/s 回传分片）即时出流",
  author: "lai",
  version: "1.1.1",
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
    { id: "loadResource", title: "HornyJav播放源", description: "播放时按集令牌即时验活变体并走 Worker 改写出流", functionName: "loadResource", type: "stream", cacheDuration: 0, params: [] }
  ]
};

var HOST = "https://hornyjav.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var XOR_KEY = "KmzWa8awaallakclnu";
var B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
// 已部署的 sextb-hls Worker v2（用户自有 Cloudflare Worker，2026-11-07 20:13 已部署 v2 (ts-fix)；
// 通用 /p?u=<播单>&e=<嵌页> 改写 + /s 回传分片并剥 PNG 头、强制 video/MP2T）。本模块只复用它已有的
// /p、/s 路由，不改 Worker、不新建 Worker。留空则退回裸 master（1.1.0 旧行为）。
var HLS_WORKER = "https://sextb-hls.li768435813.workers.dev";

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

// 纯字符串 base64 编码（ASCII 输入），输出 url-safe 无填充，与 b64ToLatin1 互逆
function b64EncodeAscii(s) {
  s = String(s || "");
  var out = "";
  var i;
  for (i = 0; i < s.length; i += 3) {
    var b0 = s.charCodeAt(i) & 255;
    var b1 = i + 1 < s.length ? s.charCodeAt(i + 1) & 255 : 0;
    var b2 = i + 2 < s.length ? s.charCodeAt(i + 2) & 255 : 0;
    out += B64_ALPHABET.charAt(b0 >> 2);
    out += B64_ALPHABET.charAt(((b0 & 3) << 4) | (b1 >> 4));
    out += i + 1 < s.length ? B64_ALPHABET.charAt(((b1 & 15) << 2) | (b2 >> 6)) : "=";
    out += i + 2 < s.length ? B64_ALPHABET.charAt(b2 & 63) : "=";
  }
  return out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// 无 URL 对象时的相对地址解析（纯字符串）
function resolveUrl(base, rel) {
  rel = t(rel);
  if (!rel) return "";
  if (/^https?:\/\//i.test(rel)) return rel;
  var m = String(base || "").match(/^(https?:\/\/[^\/]+)(\/.*)?$/i);
  if (!m) return rel;
  if (rel.charAt(0) === "/") return m[1] + rel;
  var dir = (m[2] || "/").replace(/[^\/]*$/, "");
  return m[1] + dir + rel;
}

// master 清单正文取首个变体行（本站 master 单 720p 变体；无变体行时返回 master 本身）
function variantOfMaster(masterText, masterUrl) {
  var lines = String(masterText || "").split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    var s = t(lines[i]);
    if (s && s.charAt(0) !== "#") return resolveUrl(masterUrl, s);
  }
  return masterUrl;
}

// 播单改写：变体清单走 Worker /p（分片回指 /s，PNG 头剥掉、强制 video/MP2T）。
// 注意：只把变体（媒体清单）交给 /p；master 交给 /p 会把变体行指到 /s 原样回传，分片仍是裸 .image。
function wrapPlay(variant, embed) {
  if (!HLS_WORKER || !variant) return variant || "";
  return HLS_WORKER + "/p?u=" + encodeURIComponent(variant) + "&e=" + encodeURIComponent(embed || "");
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
  // 验活时顺手取变体地址（master 单变体）：点播改走 Worker /p 时直接用变体，master 不再二次取回。
  var liveChecks = await Promise.all(rawLines.map(function (ln) {
    return getText(ln.master, ln.embed).then(function (txt) {
      if (txt && txt.indexOf("#EXTM3U") === 0) return { ok: true, variant: variantOfMaster(txt, ln.master) };
      return { ok: false, variant: "" };
    }).catch(function () { return { ok: false, variant: "" }; });
  }));
  var lines = [];
  for (var j = 0; j < rawLines.length; j++) {
    if (liveChecks[j].ok) lines.push({ idx: rawLines[j].idx, embed: rawLines[j].embed, master: rawLines[j].master, variant: liveChecks[j].variant || rawLines[j].master });
  }
  return { title: title, cover: cover, lines: lines, html: html };
}

// 集令牌：hornyjav://play/<idx>/<b64url 变体>/<b64url 嵌页>/<encodeURIComponent(详情 URL)>
// 令牌里直接带已解好的变体：点播时只做一次变体验活即回行，不再重做全量解析（见文件头 1.1.1(b)）。
function lineToken(durl, idx, variant, embed) {
  return "hornyjav://play/" + idx + "/" + b64EncodeAscii(variant || "") + "/" + b64EncodeAscii(embed || "") + "/" + encodeURIComponent(durl);
}

function parsePlayToken(raw) {
  var m = String(raw || "").match(/^hornyjav:\/\/play\/(\d+)\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+)\/(.+)$/);
  if (!m) return null;
  var durl = "";
  try { durl = decodeURIComponent(m[4]); } catch (e) { return null; }
  var variant = b64ToLatin1(m[2]);
  var embed = b64ToLatin1(m[3]);
  if (!variant || !embed || !durl) return null;
  return { idx: parseInt(m[1], 10) || 0, variant: variant, embed: embed, durl: durl };
}

// 旧版令牌 hornyjav://line/<idx>/<encodeURIComponent(详情 URL)>（1.1.0 遗留，仍认，走全量重解兜底）
function parseLineToken(raw) {
  var m = String(raw || "").match(/^hornyjav:\/\/line\/(\d+)\/(.+)$/);
  if (!m) return null;
  var durl = "";
  try { durl = decodeURIComponent(m[2]); } catch (e) { return null; }
  return { idx: parseInt(m[1], 10) || 0, durl: durl };
}

function streamRow(name, variant, master, embed, durl) {
  return {
    name: name,
    url: wrapPlay(variant || master, embed),
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
      var tok = lineToken(url, ln.idx, ln.variant, ln.embed);
      var playUrl = wrapPlay(ln.variant, ln.embed);
      episodes.push({ name: nm, id: tok, link: tok });
      episodeItems.push({
        id: tok,
        title: title + " " + nm,
        name: nm,
        mediaType: "movie",
        seasonNumber: 1,
        episodeNumber: ln.idx,
        link: tok,
        videoUrl: playUrl,
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
    var firstMaster = lines.length ? wrapPlay(lines[0].variant, lines[0].embed) : "";
    var firstEmbed = lines.length ? lines[0].embed : url;
    return {
      id: url,
      type: "detail",
      title: title,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      description: lines.length ? ("共 " + lines.length + " 条服务器线（服务器选择，非清晰度档）；播放走 stream 模块，点播时按集令牌即时验活变体并走 Worker 改写出流。") : "服务器线未解出，可点网页嗅探兜底集.",
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

// stream 模块入口：集令牌 / master 直链 / 详情链接 → 即时出流
// 快路：新版集令牌自带已解好的变体，只做一次变体验活即回行；验活失败或旧版令牌才回退全量重解。
async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  var itemVideo = "";
  if (params.item) {
    if (!raw) raw = params.item.link || params.item.id || params.item.url || "";
    itemVideo = params.item.videoUrl || params.item.video_url || "";
  }
  raw = String(raw || "");
  try {
    var ptok = parsePlayToken(raw);
    if (ptok && ptok.durl) {
      var liveTxt = "";
      try { liveTxt = await getText(ptok.variant, ptok.embed); } catch (e) { liveTxt = ""; }
      if (liveTxt && liveTxt.indexOf("#EXTM3U") === 0) {
        return [streamRow("服务器" + ptok.idx, ptok.variant, "", ptok.embed, ptok.durl)];
      }
      // 变体已死（token 轮换等）：回退全量重解
      var rl0 = await resolveLines(ptok.durl);
      var pick0 = null;
      var q;
      for (q = 0; q < rl0.lines.length; q++) {
        if (rl0.lines[q].idx === ptok.idx) { pick0 = rl0.lines[q]; break; }
      }
      if (!pick0 && rl0.lines.length) pick0 = rl0.lines[0];
      if (pick0) return [streamRow("服务器" + pick0.idx, pick0.variant, pick0.master, pick0.embed, ptok.durl)];
      return sniffRow(ptok.durl);
    }
    // 已包好的 Worker 播单直传（App 直接拿 episode videoUrl 当 link 时）：
    // 注意 /p 地址里含经编码的 ".m3u8" 字样，必须先认出、原样回行，不能再包一层。
    if (HLS_WORKER && raw.indexOf(HLS_WORKER) === 0) {
      return [{ name: "HornyJav", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
    // 详情已解好的 Worker 播单直传（App 交整集对象时）：同样一次验活即回行
    if (HLS_WORKER && itemVideo && itemVideo.indexOf(HLS_WORKER) === 0) {
      return [{ name: "HornyJav", url: itemVideo, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
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
      if (pick) return [streamRow("服务器" + pick.idx, pick.variant, pick.master, pick.embed, tok.durl)];
      return sniffRow(tok.durl);
    }
    if (/\.m3u8/i.test(raw)) {
      // 裸 master/变体直链：取一次，分清主/媒体清单再包 Worker；取不到则原样回行（1.1.0 旧行为）
      try {
        var txt = await getText(raw, HOST + "/");
        if (txt && txt.indexOf("#EXTM3U") === 0) {
          if (txt.indexOf("#EXT-X-STREAM-INF") >= 0) {
            var v = variantOfMaster(txt, raw);
            return [streamRow("HornyJav", v, raw, HOST + "/", HOST + "/")];
          }
          return [{ name: "HornyJav", url: wrapPlay(raw, HOST + "/"), playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
        }
      } catch (e) { /* 落空走旧行为 */ }
      return [{ name: "HornyJav", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
    var durl = /^https?:\/\//i.test(raw) ? raw : (raw ? HOST + "/" + raw.replace(/^\/+/, "") : "");
    if (!durl) return [];
    var rl2 = await resolveLines(durl);
    if (rl2.lines.length) {
      var best = rl2.lines[0];
      return [streamRow("服务器" + best.idx, best.variant, best.master, best.embed, durl)];
    }
    return sniffRow(durl);
  } catch (e) {
    return [];
  }
}
