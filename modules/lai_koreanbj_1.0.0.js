// Korean BJ for REX (lai_koreanbj v1.0.0)
// 移植自 mira-cat 蜘蛛 koreanbj.js（2026-10-29 重写版，替代旧 韩国BJ），后端：https://kbjclub.club（WordPress 站）。
// 列表: loop-video 卡片 /video/slug/，与蜘蛛同一套正则解析；封面为站方 uploads 直链，无防盗链不走代理。
// 播放: 详情页嵌套 player-6w.php 排最前 → JW file: master.txt → expandMaster 拆档位
//   （自动/1080p/720p/480p，按分辨率降序）；无 player-6w 时回落 /e/ 嵌套（VOE 解包）或
//   oct4 嵌套（JW file 为相对地址 /embed/ppc*.php，按嵌套页补全；.php 本身是 HLS 播放
//   列表，需现取现验含 #EXTM3U 才推线）。死链（master 取不到/不含 #EXTM3U）不推死线，
//   改试下一个嵌套；全部嵌套都死才回“未找到播放地址”。详情不再生成原页线与网页播线
//   （REX 无嗅探/WebView 通道，且站方播放器本身撞死链，双重播不了）。
// 速度：详情只解第一条可用线路即停，不再逐条解全部嵌套。
// 清晰度：分集流模式，episodes 每档一条（自动/master + 各变体），由用户播放时自选。
// txt 链全程 Referer 门禁：master、变体、分片无 Referer 一律 404，loadResource 的
//   Referer 绝不可去掉（实测：kbjclub/ww1 任一站域 Referer 均 200）。
// REX 沙箱无 Buffer/atob 保证：base64 用纯 JS 版；不依赖 URL/fetch 等宿主 API。

WidgetMetadata = {
  id: "lai_koreanbj",
  title: "Korean BJ",
  description: "Korean BJ（kbjclub.club）：最新/Korean BJ/PandaTV/Afreeca TV/OnlyFans/Amateur/Kpop Deepfake/Twitch/Premium/Stripchat/Fantrie/Nude/POV/Masturbating/Discord/Big Ass/Big Boobs/Chaturbate/Fansly 共 19 个频道，player-6w/VOE/oct4 解包直出 m3u8，分集流保清晰度档位",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://kbjclub.club",
  detailCacheDuration: 180,
  modules: [
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Korean BJ", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "korean-bj" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "PandaTV", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "pandatv" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Afreeca TV", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "afreeca-tv" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "OnlyFans", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "onlyfans" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Amateur", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "amateur" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Kpop Deepfake", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "kpop" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Twitch", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "twitch" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Premium", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "premium" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Stripchat", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "stripchat" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Fantrie", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "fantrie" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Nude", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "nude" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "POV", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "pov" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Masturbating", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "masturbating" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Discord", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "discord" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Big Ass", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "big-ass" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Big Boobs", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "big-boobs" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Chaturbate", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "chaturbate" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Fansly", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "fansly" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { id: "loadResource", title: "播放资源", description: "播放时透传已解出的分集直链", functionName: "loadResource", type: "stream", cacheDuration: 0, params: [] }
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

var BASE = "https://kbjclub.club";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// 与 mira-cat koreanbj.js CHANNELS 逐一一致（旧 12 路径一字未变 + 新增 7 个）
var CHANNELS = {
  home: { name: "最新", path: "/" },
  "korean-bj": { name: "Korean BJ", path: "/category/korean-bj/" },
  pandatv: { name: "PandaTV", path: "/category/pandatv/" },
  "afreeca-tv": { name: "Afreeca TV", path: "/category/afreeca-tv/" },
  onlyfans: { name: "OnlyFans", path: "/category/onlyfans/" },
  amateur: { name: "Amateur", path: "/category/amateur-porn/" },
  kpop: { name: "Kpop Deepfake", path: "/category/kpop-deepfake/" },
  twitch: { name: "Twitch", path: "/category/twitch/" },
  premium: { name: "Premium", path: "/category/premium/" },
  stripchat: { name: "Stripchat", path: "/category/stripchat/" },
  fantrie: { name: "Fantrie", path: "/category/fantrie/" },
  nude: { name: "Nude", path: "/category/nude/" },
  pov: { name: "POV", path: "/category/pov/" },
  masturbating: { name: "Masturbating", path: "/category/masturbating/" },
  discord: { name: "Discord", path: "/category/discord/" },
  "big-ass": { name: "Big Ass", path: "/category/big-ass/" },
  "big-boobs": { name: "Big Boobs", path: "/category/big-boobs/" },
  chaturbate: { name: "Chaturbate", path: "/category/chaturbate/" },
  fansly: { name: "Fansly", path: "/category/fansly/" }
};

function t(v) {
  return String(v == null ? "" : v).trim();
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": referer || BASE + "/"
  };
}

// 相对地址补全（不依赖 URL 构造器）：绝对地址原样；// 补 https；
// / 开头取 base 的 origin；其余取 base 所在目录拼接（覆盖 oct4 的 /embed/ppc*.php）
function absUrl(u, base) {
  var raw = t(u).replace(/\\\//g, "/").replace(/&amp;/g, "&");
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.indexOf("//") === 0) return "https:" + raw;
  var b = base || BASE + "/";
  var om = b.match(/^(https?:\/\/[^\/]+)/i);
  var origin = om ? om[1] : BASE;
  if (raw.charAt(0) === "/") return origin + raw;
  var dir = b.replace(/[#?].*$/, "").replace(/\/[^\/]*$/, "/");
  return dir + raw;
}

async function fetchText(url, referer) {
  try {
    var res = await Widget.http.get(url, { headers: pageHeaders(referer), timeout: 20000 });
    var body = res && res.data != null ? String(res.data) : "";
    return body;
  } catch (e) {
    return "";
  }
}

// 解析列表卡片（与蜘蛛 parseList 同一套正则：loop-video 块内取 /video/ 链接、标题与图片）
function parseCards(html) {
  var videos = [];
  if (!html) return videos;
  var seen = {};
  var blocks = html.match(/(?:<article[^>]*)?class="[^"]*loop-video[^"]*"[\s\S]{0,1200}/gi) || [];
  for (var bi = 0; bi < blocks.length; bi++) {
    var block = blocks[bi];
    var lm = block.match(/href="(https?:\/\/[^"]+\/video\/[^"]+|\/video\/[^"]+)"[^>]*(?:title="([^"]*)")?/i);
    if (!lm) continue;
    var vodId = absUrl(lm[1].split("?")[0]);
    if (!vodId || seen[vodId]) continue;
    seen[vodId] = true;
    var name = t(lm[2]);
    if (!name) {
      var tm = block.match(/title="([^"]+)"/);
      name = tm ? t(tm[1]) : vodId.replace(/\/$/, "").split("/").pop();
    }
    name = name.replace(/\s*[–\-]\s*KoreanBJ.*$/i, "").replace(/&#8211;/g, "-").replace(/&amp;/g, "&").trim();
    var pic = "";
    var imgRe = /(?:data-src|src)="([^"]+)"/gi;
    var pm;
    while ((pm = imgRe.exec(block)) !== null) {
      var p = pm[1];
      if (/placeholder/i.test(p)) continue;
      if (/\.(jpg|jpeg|png|webp)/i.test(p) || /upload/i.test(p)) {
        pic = absUrl(p);
        break;
      }
    }
    videos.push({
      id: vodId,
      type: "url",
      title: name.replace(/\s+/g, " ").slice(0, 120) || "Korean BJ",
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: vodId,
      description: "Korean BJ",
      mediaType: "movie"
    });
  }
  return videos;
}

function channelUrl(tid, pg) {
  var info = CHANNELS[tid] || CHANNELS.home;
  var path = info.path;
  if (path === "/") {
    return pg === 1 ? BASE + "/" : BASE + "/page/" + pg + "/";
  }
  var url = BASE + path;
  if (pg > 1) url = url.replace(/\/$/, "") + "/page/" + pg + "/";
  return url;
}

async function loadList(params) {
  params = params || {};
  var tid = String(params.path || params.cat || "home");
  var pg = parseInt(params.page, 10) || 1;
  try {
    var url = channelUrl(tid, pg);
    var html = await fetchText(url);
    if (!html) html = await fetchText(url);
    var list = parseCards(html);
    return list;
  } catch (e) {
    return [];
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
  var pg = parseInt(params.page, 10) || 1;
  if (!wd) return [];
  try {
    var kw = encodeURIComponent(wd);
    var url = pg === 1 ? BASE + "/?s=" + kw : BASE + "/page/" + pg + "/?s=" + kw;
    var html = await fetchText(url);
    var list = parseCards(html);
    return list;
  } catch (e) {
    return [];
  }
}

// ---------- VOE 解包（对齐蜘蛛；base64 为纯 JS 实现，等价 Buffer 路径） ----------
function rot13(s) {
  return s.replace(/[a-zA-Z]/g, function (c) {
    var base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

var B64TAB = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// base64 → UTF-8 字符串（纯 JS；与 Buffer.from(x,'base64').toString('utf-8') 等价）
function b64d(x) {
  try {
    var s = String(x).replace(/[^A-Za-z0-9+/=]/g, "");
    while (s.length % 4) s += "=";
    var bytes = [];
    for (var i = 0; i < s.length; i += 4) {
      var a = B64TAB.indexOf(s.charAt(i));
      var b = B64TAB.indexOf(s.charAt(i + 1));
      var c = s.charAt(i + 2) === "=" ? 0 : B64TAB.indexOf(s.charAt(i + 2));
      var d = s.charAt(i + 3) === "=" ? 0 : B64TAB.indexOf(s.charAt(i + 3));
      if (a < 0 || b < 0) break;
      var n = (a << 18) | (b << 12) | (c << 6) | d;
      bytes.push((n >> 16) & 255);
      if (s.charAt(i + 2) !== "=") bytes.push((n >> 8) & 255);
      if (s.charAt(i + 3) !== "=") bytes.push(n & 255);
    }
    // UTF-8 解码
    var out = "";
    for (var j = 0; j < bytes.length;) {
      var b0 = bytes[j];
      if (b0 < 128) { out += String.fromCharCode(b0); j += 1; }
      else if (b0 >= 194 && b0 < 224 && j + 1 < bytes.length) {
        out += String.fromCharCode(((b0 & 31) << 6) | (bytes[j + 1] & 63)); j += 2;
      } else if (b0 >= 224 && b0 < 240 && j + 2 < bytes.length) {
        out += String.fromCharCode(((b0 & 15) << 12) | ((bytes[j + 1] & 63) << 6) | (bytes[j + 2] & 63)); j += 3;
      } else if (b0 >= 240 && j + 3 < bytes.length) {
        var cp = ((b0 & 7) << 18) | ((bytes[j + 1] & 63) << 12) | ((bytes[j + 2] & 63) << 6) | (bytes[j + 3] & 63);
        cp -= 0x10000;
        out += String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 1023)); j += 4;
      } else { out += String.fromCharCode(b0); j += 1; }
    }
    return out;
  } catch (e) {
    return "";
  }
}

function voeDecode(html) {
  try {
    var m = String(html || "").match(/<script[^>]*type=["']application\/json["'][^>]*>(.*?)<\/script>/s);
    if (!m) return {};
    var blk = t(m[1]);
    var raw = blk;
    try {
      var j = JSON.parse(blk);
      raw = (Object.prototype.toString.call(j) === "[object Array]" && j.length) ? String(j[0]) : blk;
    } catch (e2) {
      raw = blk;
    }
    var s = String(raw);
    var keys = ["@$", "^^", "~@", "%?", "*~", "!!", "#&"];
    for (var ki = 0; ki < keys.length; ki++) {
      s = s.split(keys[ki]).join("_");
    }
    s = s.split("_").join("");
    // 六层：rot13 → b64 → 每字符-3 → b64(反转)
    var tt = b64d(rot13(s));
    var shifted = "";
    for (var ci = 0; ci < tt.length; ci++) {
      shifted += String.fromCharCode(tt.charCodeAt(ci) - 3);
    }
    tt = b64d(shifted.split("").reverse().join(""));
    var cfg = JSON.parse(tt);
    return cfg && typeof cfg === "object" ? cfg : {};
  } catch (e) {
    return {};
  }
}

// 详情页嵌套地址提取；player-6w.php 排最前（主链路），其余嵌套作回落。
function extractEmbedUrls(html, pageUrl) {
  var urls = [];
  var seen = {};
  function add(u) {
    u = absUrl(u, pageUrl);
    if (!u || seen[u] || u.indexOf("http") !== 0) return;
    if (/koreanbj\.club/i.test(u) && /\/video\//i.test(u) && u.indexOf("/e/") < 0) return;
    if (/googletag|\/ads\/|placeholder|\/trailers\/|test-videos/i.test(u)) return;
    if (/\.webm$/i.test(u)) return;
    seen[u] = true;
    urls.push(u);
  }
  var h = String(html || "");
  var m;
  var re1 = /"contentURL"\s*:\s*"([^"]+)"/g;
  while ((m = re1.exec(h)) !== null) add(m[1].replace(/\\\//g, "/"));
  var re2 = /iframe\.setAttribute\(\s*['"]src['"]\s*,\s*['"]([^'"]+)['"]/g;
  while ((m = re2.exec(h)) !== null) add(m[1]);
  var re3 = /<iframe[^>]+(?:src|data-src)=["']([^"']+)/gi;
  while ((m = re3.exec(h)) !== null) add(m[1]);
  var re4 = /https?:\/\/(?:[a-z0-9\-]+\.)?(?:voe|io\d+storege|streamtape|filemoon)[^"'\s<>]+/gi;
  while ((m = re4.exec(h)) !== null) add(m[0]);
  urls.sort(function (a, b) {
    var sa = a.indexOf("player-6w") >= 0 ? 0 : 1;
    var sb = b.indexOf("player-6w") >= 0 ? 0 : 1;
    return sa - sb;
  });
  return urls;
}

async function resolveVoe(embedUrl, referer) {
  var html = await fetchText(embedUrl, referer || BASE + "/");
  if (!html) return { m3u8: "", direct: "" };
  var hits = html.match(/https?:\/\/[^\s"'<>\\]+\.m3u8[^\s"'<>\\]*/g) || [];
  if (hits.length && !/test-videos/i.test(hits[0])) return { m3u8: hits[0], direct: "" };
  var jw = html.match(/jwplayer\([^)]*\)\.setup\(\{\s*file:\s*"([^"]+)"/i);
  if (jw) {
    // JW file 可能是相对地址（如 oct4 的 /embed/ppc*.php），须按嵌套页补全；
    // 扩展名不限（.php 也可能是 HLS 播放列表），由调用方现取现验。
    var u = absUrl(jw[1], embedUrl);
    if (/^https?:\/\//i.test(u)) return { m3u8: u, direct: "" };
  }
  // file: 循环（加宽）：命中 master.txt/.m3u8//hls 即回
  var fms = [];
  var fmRe = /file:\s*"([^"]+)"/gi;
  var fm;
  while ((fm = fmRe.exec(html)) !== null) fms.push(fm[1].replace(/\\\//g, "/"));
  for (var fi = 0; fi < fms.length; fi++) {
    var f = fms[fi];
    if (f.indexOf("//") === 0) f = "https:" + f;
    if (/^https?:\/\//i.test(f) && /(master\.txt|\.m3u8|\/hls\d*\/?)/i.test(f) && !/\.vtt$/i.test(f)) {
      return { m3u8: f, direct: "" };
    }
  }
  var cfg = voeDecode(html);
  var src = t(cfg.source);
  if (/\.m3u8/i.test(src)) return { m3u8: src, direct: "" };
  var dau = t(cfg.direct_access_url);
  if (/^https?:\/\//i.test(dau)) return { m3u8: "", direct: dau };
  if (/^https?:\/\//i.test(src)) return { m3u8: "", direct: src };
  return { m3u8: "", direct: "" };
}

// 变体相对地址按 master 地址补全（不依赖 URL 构造器）
function resolveVariant(rel, baseUrl) {
  if (/^https?:\/\//i.test(rel)) return rel;
  if (rel.indexOf("//") === 0) return "https:" + rel;
  var om = String(baseUrl || "").match(/^(https?:\/\/[^\/]+)/i);
  var origin = om ? om[1] : BASE;
  if (rel.charAt(0) === "/") return origin + rel;
  var dir = String(baseUrl || "").replace(/[#?].*$/, "").replace(/\/[^\/]*$/, "/");
  return dir + rel;
}

// master 文本解析（清晰度自选）：变体 → 各档位（降序）；无变体返回 []。
function parseMasterText(txt, baseUrl) {
  var out = [];
  var re = /#EXT-X-STREAM-INF:([^\n]*)\n([^\n#][^\n]*)/g;
  var m;
  while ((m = re.exec(txt)) !== null) {
    var attrs = m[1];
    var rel = m[2].trim();
    var rm = attrs.match(/RESOLUTION=(\d+)x(\d+)/i);
    var bm = attrs.match(/BANDWIDTH=(\d+)/i);
    var label = "";
    if (rm) {
      var h = parseInt(rm[2], 10);
      label = h >= 1080 ? "1080p" : h >= 720 ? "720p" : h >= 480 ? "480p" : (rm[2] + "p");
    } else if (bm) {
      label = Math.round(parseInt(bm[1], 10) / 1000) + "k";
    } else {
      continue;
    }
    out.push([label, resolveVariant(rel, baseUrl)]);
  }
  var order = { "1080p": 0, "720p": 1, "480p": 2 };
  out.sort(function (a, b) {
    var oa = order[a[0]] !== undefined ? order[a[0]] : 9;
    var ob = order[b[0]] !== undefined ? order[b[0]] : 9;
    return oa - ob;
  });
  return out;
}

// master 档位展开：取不到（死链，如随机快闪域名已死/被墙）返回 live:false，
// 调用方不得推死线；取到但无变体返回 live:true, vars:[]（单码流，已验可达）。
async function expandMaster(masterUrl, referer) {
  try {
    var txt = await fetchText(masterUrl, referer);
    if (!txt || txt.indexOf("#EXTM3U") < 0) return { live: false, vars: [] };
    return { live: true, vars: parseMasterText(txt, masterUrl) };
  } catch (e) {
    return { live: false, vars: [] };
  }
}

// 播放请求头（对齐蜘蛛 play()：cloudwindow-route/ugc-cdn 线用固定 Referer，其余用站域）
function playHeadersFor(videoUrl) {
  var ref = BASE + "/";
  if (/cloudwindow-route|ugc-cdn/i.test(videoUrl)) {
    ref = "https://jeremyparticipantanything.com/";
  }
  return { "User-Agent": UA, "Referer": ref };
}

async function loadDetail(link) {
  try {
    var url = t(link);
    if (!/^https?:\/\//i.test(url)) url = absUrl(url);
    var html = await fetchText(url);
    if (!html) {
      return { id: url, type: "url", title: "Korean BJ", link: url, description: "未找到播放地址" };
    }
    var name = "";
    var tm = html.match(/<title>([^<]+)/i);
    if (tm) {
      name = t(tm[1]).replace(/\s*[|\\\-–].*$/, "").replace(/&#8211;/g, "-");
    }
    var pic = "";
    var om = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i);
    if (om) pic = absUrl(om[1], url);

    var embeds = extractEmbedUrls(html, url);
    var episodes = [];
    for (var ei = 0; ei < embeds.length; ei++) {
      var emb = embeds[ei];
      var r = await resolveVoe(emb, url);
      if (r.m3u8) {
        if (/\.(m3u8|txt)(\?|$)/i.test(r.m3u8)) {
          var ex = await expandMaster(r.m3u8, emb);
          if (ex.live && ex.vars.length) {
            episodes.push({ name: "自动", link: r.m3u8 });
            for (var vi = 0; vi < ex.vars.length; vi++) {
              episodes.push({ name: ex.vars[vi][0], link: ex.vars[vi][1] });
            }
            break; // 第一条可用线路即停，不再解剩余嵌套（旧版慢的主因）
          }
          if (ex.live) { episodes.push({ name: "自动", link: r.m3u8 }); break; } // 单码流，已验可达
          continue; // 死链：不推死线，试下一个嵌套
        }
        if (/\.mp4(\?|$)/i.test(r.m3u8)) { episodes.push({ name: "自动", link: r.m3u8 }); break; }
        // 其它形式（如 oct4 的 .php 播放列表）：现取现验，确为 m3u8 才推。
        var ptxt = await fetchText(r.m3u8, emb);
        if (ptxt && ptxt.indexOf("#EXTM3U") >= 0) {
          var pvars = parseMasterText(ptxt, r.m3u8);
          episodes.push({ name: "自动", link: r.m3u8 });
          for (var pi = 0; pi < pvars.length; pi++) {
            episodes.push({ name: pvars[pi][0], link: pvars[pi][1] });
          }
          break;
        }
        continue; // 验不出播放列表，试下一个嵌套
      }
      if (r.direct) {
        episodes.push({ name: "MP4", link: r.direct });
        break;
      }
      // 未解出：继续试下一个嵌套
    }
    // 分集去重（同一直链只留首个档位名）
    var seenEp = {};
    var uniqEp = [];
    for (var ui = 0; ui < episodes.length; ui++) {
      if (seenEp[episodes[ui].link]) continue;
      seenEp[episodes[ui].link] = true;
      uniqEp.push(episodes[ui]);
    }
    episodes = uniqEp;
    if (!episodes.length) {
      return {
        id: url,
        type: "url",
        title: name || "Korean BJ",
        link: url,
        posterPath: pic,
        coverUrl: pic,
        backdropPath: pic,
        description: "未找到播放地址"
      };
    }
    return {
      id: url,
      type: "url",
      title: name || "Korean BJ",
      link: url,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      episodes: episodes
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// 分集直链原样透传（不二次解析；.php 线亦直接当 HLS 流出，不可再当嵌套页解析）
async function loadResource(params) {
  params = params || {};
  var raw = String(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = String(params.item.link || params.item.id || "");
  if (!raw) return [];
  return [{ name: "播放", url: raw, playerType: "app", customHeaders: playHeadersFor(raw) }];
}
