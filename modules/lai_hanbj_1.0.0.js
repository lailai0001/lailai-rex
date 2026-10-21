// 韩国BJ for REX (lai_hanbj v1.0.0)
// 移植自 mira-cat 蜘蛛 hanbj.js，后端：https://ww1.koreanbj.club（WordPress 站）。
// 列表: loop-video 卡片 /video/slug/，与蜘蛛同一套正则解析；封面为站方 uploads 直链，无防盗链不走代理。
// 播放: 详情页提取 VOE 系 embed → 六层混淆解包 (rot13 → base64 → 逐字 -3 → 逆序 base64) → m3u8/mp4 直出；
//   REX 沙箱无 Buffer，本模块内置纯 JS base64 解码（与蜘蛛 Buffer 路径等价，载荷为 ASCII 安全串）。
//   蜘蛛的 parse:1 嗅探兜底在 REX 无此通道，全线解不出时如实返回"未找到播放地址"。

WidgetMetadata = {
  id: "lai_hanbj",
  title: "韩国BJ",
  description: "韩国BJ（koreanbj.club）：Korean BJ/PandaTV/OnlyFans/Stripchat 等 12 个频道，VOE 解包直出 m3u8",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://ww1.koreanbj.club",
  detailCacheDuration: 180,
  modules: [
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Korean BJ", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "korean-bj" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "PandaTV", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "pandatv" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "OnlyFans", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "onlyfans" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Amateur", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "amateur" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Kpop Deepfake", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "kpop" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Twitch", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "twitch" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Premium", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "premium" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Stripchat", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "stripchat" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Fantrie", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "fantrie" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "Nude", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "nude" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "POV", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "频道", type: "constant", value: "pov" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
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

var BASE = "https://ww1.koreanbj.club";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

// 与蜘蛛 CHANNELS 逐一一致
var CHANNELS = {
  home: { name: "最新", path: "/" },
  "korean-bj": { name: "Korean BJ", path: "/category/korean-bj/" },
  pandatv: { name: "PandaTV", path: "/category/pandatv/" },
  onlyfans: { name: "OnlyFans", path: "/category/onlyfans/" },
  amateur: { name: "Amateur", path: "/category/amateur-porn/" },
  kpop: { name: "Kpop Deepfake", path: "/category/kpop-deepfake/" },
  twitch: { name: "Twitch", path: "/category/twitch/" },
  premium: { name: "Premium", path: "/category/premium/" },
  stripchat: { name: "Stripchat", path: "/category/stripchat/" },
  fantrie: { name: "Fantrie", path: "/category/fantrie/" },
  nude: { name: "Nude", path: "/category/nude/" },
  pov: { name: "POV", path: "/category/pov/" }
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

function absUrl(u, base) {
  var raw = t(u).replace(/\\\//g, "/").replace(/&amp;/g, "&");
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.indexOf("//") === 0) return "https:" + raw;
  if (raw.charAt(0) === "/") return BASE + raw;
  return (base || BASE + "/") + raw;
}

async function fetchText(url, referer) {
  try {
    var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
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
      title: name.replace(/\s+/g, " ").slice(0, 120) || "KoreanBJ",
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: vodId,
      description: "KoreanBJ",
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
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
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
  var pg = parseInt(params.page, 10) || 1;
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  try {
    var kw = encodeURIComponent(wd);
    var url = pg === 1 ? BASE + "/?s=" + kw : BASE + "/page/" + pg + "/?s=" + kw;
    var html = await fetchText(url);
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
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

function extractEmbedUrls(html, pageUrl) {
  var urls = [];
  var seen = {};
  function add(u) {
    u = absUrl(u, pageUrl);
    if (!u || seen[u] || u.indexOf("http") !== 0) return;
    if (/koreanbj\.club/i.test(u) && /\/video\//i.test(u) && !/\/e\//i.test(u)) return;
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
  return urls;
}

async function resolveVoe(embedUrl, referer) {
  var html = await fetchText(embedUrl, referer || BASE + "/");
  if (!html) return { m3u8: "", direct: "" };
  var hits = html.match(/https?:\/\/[^\s"'<>\\]+\.m3u8[^\s"'<>\\]*/g) || [];
  if (hits.length && !/test-videos/i.test(hits[0])) return { m3u8: hits[0], direct: "" };
  // JW Player file: 字段（master.txt 实为 m3u8）
  var jw = html.match(/jwplayer\([^)]*\)\.setup\(\{\s*file:\s*"([^"]+)"/i);
  if (jw) {
    var f = jw[1].replace(/\\\//g, "/");
    if (/^https?:\/\//i.test(f)) return { m3u8: f, direct: "" };
  }
  var cfg = voeDecode(html);
  var src = t(cfg.source);
  if (/\.m3u8/i.test(src)) return { m3u8: src, direct: "" };
  var dau = t(cfg.direct_access_url);
  if (/^https?:\/\//i.test(dau)) return { m3u8: "", direct: dau };
  if (/^https?:\/\//i.test(src)) return { m3u8: "", direct: src };
  return { m3u8: "", direct: "" };
}

// 播放请求头（对齐蜘蛛 play()：cloudwindow-route/ugc-cdn 线用固定 Referer，其余用 embed 页）
function playHeadersFor(videoUrl, embedUrl) {
  var ref = BASE + "/";
  if (/cloudwindow-route|ugc-cdn/i.test(videoUrl)) {
    ref = "https://jeremyparticipantanything.com/";
  } else if (embedUrl) {
    ref = embedUrl;
  }
  return { "User-Agent": UA, "Referer": ref };
}

async function loadDetail(link) {
  try {
    var url = t(link);
    if (!/^https?:\/\//i.test(url)) url = absUrl(url);
    var html = await fetchText(url);
    if (!html) {
      return { id: url, type: "url", title: "KoreanBJ", description: "详情页拉取失败", link: url };
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
    var bestM3u8 = "";
    var bestM3u8Embed = "";
    var bestDirect = "";
    var bestDirectEmbed = "";
    for (var i = 0; i < embeds.length; i++) {
      var r = await resolveVoe(embeds[i], url);
      if (r.m3u8 && !bestM3u8) { bestM3u8 = r.m3u8; bestM3u8Embed = embeds[i]; }
      if (r.direct && !bestDirect) { bestDirect = r.direct; bestDirectEmbed = embeds[i]; }
      if (bestM3u8) break;
    }
    var videoUrl = bestM3u8 || bestDirect;
    var fromEmbed = bestM3u8 ? bestM3u8Embed : bestDirectEmbed;
    if (!videoUrl) {
      return {
        id: url,
        type: "url",
        title: name || "KoreanBJ",
        link: url,
        posterPath: pic,
        coverUrl: pic,
        backdropPath: pic,
        description: "未找到播放地址"
      };
    }
    return {
      id: url,
      type: "detail",
      title: name || "KoreanBJ",
      link: url,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: playHeadersFor(videoUrl, fromEmbed)
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
