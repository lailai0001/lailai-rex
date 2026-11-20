// Javass for REX (lai_javass2 v1.0.1) — 从零重写
// v1.0.1（2026-11-21）：补顶层 search 键（A 键，照 64 个可见模块的众数形状）；B 条目与 search 函数一个字未动。
// 站点：WordPress 视频站，入口 https://javass.love。
// 列表走文章流（首页 60 条/页，分类与标签 20 条/页）；搜索 /?s=。
// 详情播放线（只列实测能播的）：
//   (1) Bunny 原生：详情页 video-js data-settings JSON 里 sources[0].src 即 b-cdn.net 主播单，
//       解析 master 得真实档位（通常 3-4 档），各档变体播单直链可播，playerType system。
//   (2) Bunny 嵌套：iframe.mediadelivery.net 嵌套页直含 b-cdn.net 播单；取不到时用嵌套地址
//       guid + 拉流区 vz-9f2ab8d8-84b.b-cdn.net 拼接。
//   (3) Lulu：luluvido/luluvdo/lulust 嵌套页 Dean Edwards packed JS 现解，得 tnmr.org 签名
//       master（单档 720p），走 javass-hls Worker /p/ 中转；ctx 必须带 Chrome 131 UA。
//   hgcloud / upns / playmogo（DoodStream 真人验证）无解，不列线。
// WAF：全站请求只用 Chrome 131 UA；取播单类地址只带 UA + Referer，绝不带 Accept-Language
//   （tnmr 遇 zh-CN 即 403）。详情现解不缓存播单地址，点播时重新现解。
// 本文件与旧 lai_javass 无共享代码：新内部编号 lai_javass2，全新实现。

WidgetMetadata = {
  id: "lai_javass2",
  title: "Javass",
  description: "Javass：Bunny 原生多档直链，Lulu 单档走 javass-hls Worker，分类 + 标签筛选",
  author: "lai",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  site: "https://javass.love",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "首页最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "4K", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "4k" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "English Subtitled", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "english-subtitled" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "Highlighted", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "highlighted" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "Censured", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "jav-censured" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "Uncensored", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "jav-uncensored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "VR", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "vr" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "标签", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag" }, { name: "sub", title: "标签", type: "enumeration", value: "tag:jav-big-ass", enumOptions: [{"title": "标签·jav-big-ass", "value": "tag:jav-big-ass"}, {"title": "标签·big-ass-japanese-porn", "value": "tag:big-ass-japanese-porn"}, {"title": "标签·amateur", "value": "tag:amateur"}, {"title": "标签·creampie", "value": "tag:creampie"}, {"title": "标签·big-tits", "value": "tag:big-tits"}, {"title": "标签·big-ass-cowgirl", "value": "tag:big-ass-cowgirl"}, {"title": "标签·huge-butt", "value": "tag:huge-butt"}, {"title": "标签·big-ass", "value": "tag:big-ass"}, {"title": "标签·big-butt-pawg", "value": "tag:big-butt-pawg"}, {"title": "标签·asian-big-ass", "value": "tag:asian-big-ass"}, {"title": "标签·cowgirl", "value": "tag:cowgirl"}, {"title": "标签·big-ass-pantyhose", "value": "tag:big-ass-pantyhose"}, {"title": "标签·doggystyle", "value": "tag:doggystyle"}, {"title": "标签·japanese-big-ass", "value": "tag:japanese-big-ass"}, {"title": "标签·jav-big-butt", "value": "tag:jav-big-butt"}, {"title": "标签·oiled", "value": "tag:oiled"}, {"title": "标签·subbed", "value": "tag:subbed"}, {"title": "标签·voluptuous-ass", "value": "tag:voluptuous-ass"}, {"title": "标签·big-ass-nurse", "value": "tag:big-ass-nurse"}, {"title": "标签·deepthroat", "value": "tag:deepthroat"}, {"title": "标签·dildo-riding", "value": "tag:dildo-riding"}, {"title": "标签·pounding", "value": "tag:pounding"}, {"title": "标签·retsu-dao", "value": "tag:retsu-dao"}, {"title": "标签·sacananoco", "value": "tag:sacananoco"}, {"title": "标签·waka-misono", "value": "tag:waka-misono"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
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

var SITE = "https://javass.love";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
var CDN_ZONE = "https://vz-9f2ab8d8-84b.b-cdn.net";
var HLS = "https://javass-hls.li768435813.workers.dev";
var RELAY_KEY = "lai-hls-1";
var LULU_HOSTS = ["luluvido.com", "luluvdo.com", "lulust.com"];
var TIERS = [240, 360, 480, 720, 1080, 1440, 2160];

function txt(v) {
  return String(v == null ? "" : v).trim();
}

function unescape(s) {
  var out = txt(s);
  out = out.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  out = out.replace(/&mdash;/g, "—").replace(/&ndash;/g, "–").replace(/&rsquo;/g, "'").replace(/&lsquo;/g, "'").replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').replace(/&hellip;/g, "…").replace(/&middot;/g, "·");
  out = out.replace(/&#(\d+);/g, function (all, num) { return String.fromCharCode(parseInt(num, 10)); });
  out = out.replace(/&#x([0-9a-fA-F]+);/g, function (all, num) { return String.fromCharCode(parseInt(num, 16)); });
  return out;
}

function fullUrl(u) {
  u = txt(u);
  if (!u) return "";
  if (u.indexOf("http://") === 0 || u.indexOf("https://") === 0) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return SITE + u;
  return SITE + "/" + u;
}

// 手写 UTF-8 + base64url（纯 JS 实现，不依赖内置编解码）
var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function utf8Bytes(s) {
  var bytes = [];
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    if (c < 128) {
      bytes.push(c);
    } else if (c < 2048) {
      bytes.push(192 | (c >> 6), 128 | (c & 63));
    } else if (c >= 55296 && c <= 56319 && i + 1 < s.length) {
      var c2 = s.charCodeAt(i + 1);
      if (c2 >= 56320 && c2 <= 57343) {
        var cp = 65536 + ((c - 55296) * 1024) + (c2 - 56320);
        bytes.push(240 | (cp >> 18), 128 | ((cp >> 12) & 63), 128 | ((cp >> 6) & 63), 128 | (cp & 63));
        i++;
      } else {
        bytes.push(239, 191, 189);
      }
    } else {
      bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
    }
  }
  return bytes;
}
function b64url(s) {
  var bytes = utf8Bytes(String(s));
  var out = "";
  var i = 0;
  while (i < bytes.length) {
    var b1 = bytes[i++];
    var b2 = i < bytes.length ? bytes[i++] : -1;
    var b3 = i < bytes.length ? bytes[i++] : -1;
    out += B64.charAt(b1 >> 2);
    out += B64.charAt(((b1 & 3) << 4) | (b2 >= 0 ? (b2 >> 4) : 0));
    out += b2 >= 0 ? B64.charAt(((b2 & 15) << 2) | (b3 >= 0 ? (b3 >> 6) : 0)) : "=";
    out += b3 >= 0 ? B64.charAt(b3 & 63) : "=";
  }
  return out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

// 取站内页面：Chrome 131 UA + Referer，不带 Accept-Language
function fetchPage(url) {
  return Widget.http.get(url, { headers: { "User-Agent": UA, "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Referer": SITE + "/" } }).then(function (res) {
    var d = res && res.data;
    if (d == null) return "";
    return typeof d === "string" ? d : JSON.stringify(d);
  }).catch(function () { return ""; });
}

// 取播单类地址：只带 UA + Referer，不带 Accept-Language（tnmr WAF 遇 zh-CN 即 403）
function fetchMedia(url, ref) {
  return Widget.http.get(url, { headers: { "User-Agent": UA, "Referer": ref || SITE + "/" } }).then(function (res) {
    var d = res && res.data;
    if (d == null) return "";
    return typeof d === "string" ? d : JSON.stringify(d);
  }).catch(function () { return ""; });
}

function pageUrl(zone, tag, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  if (zone === "tag") {
    var slug = (tag || "tag:jav-big-ass").replace(/^tag:/, "");
    if (page <= 1) return SITE + "/video_tag/" + slug + "/";
    return SITE + "/video_tag/" + slug + "/page/" + page + "/";
  }
  if (zone === "home" || zone === "") {
    if (page <= 1) return SITE + "/";
    return SITE + "/page/" + page + "/";
  }
  if (page <= 1) return SITE + "/categories/" + zone + "/";
  return SITE + "/categories/" + zone + "/page/" + page + "/";
}

function cardFromBlock(body) {
  var link = "";
  var title = "";
  var tag = body.match(/<a[^>]*class="[^"]*post-permalink[^"]*"[^>]*>/i);
  if (tag) {
    var h = tag[0].match(/href="([^"]+)"/i);
    var ti = tag[0].match(/title="([^"]+)"/i);
    if (h) link = h[1];
    if (ti) title = ti[1];
  }
  if (!link) {
    var any = body.match(/href="(https?:\/\/javass\.love\/video\/[A-Za-z0-9]+\/)"/i);
    if (any) link = any[1];
  }
  if (!link || !/\/video\/[A-Za-z0-9]+\/$/.test(link)) return null;
  var cover = "";
  var bg = body.match(/background-image:\s*url\(\s*['"]?([^)'"]+)['"]?\s*\)/i);
  if (bg) cover = fullUrl(bg[1]);
  if (!cover) {
    var imgs = body.match(/<img[^>]*>/gi) || [];
    for (var i = 0; i < imgs.length; i++) {
      var src = imgs[i].match(/src="([^"]+)"/i);
      if (src && /\.(jpg|jpeg|png|webp)(\?|#|$)/i.test(src[1])) { cover = fullUrl(src[1]); break; }
    }
  }
  title = unescape(title);
  if (!title) {
    var hm = body.match(/<h2[^>]*>\s*<a[^>]*>([^<]{2,200})<\/a>/i);
    if (hm) title = unescape(hm[1]);
  }
  if (!title) title = link;
  var remarks = "";
  var dm = body.match(/video-length[^>]*>\s*([^<]{1,12})\s*</i);
  if (dm) remarks = txt(dm[1]);
  return {
    id: link,
    type: "url",
    title: title,
    posterPath: cover,
    coverUrl: cover,
    backdropPath: cover,
    link: link,
    description: remarks,
    mediaType: "movie"
  };
}

function parseCards(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<article\b[^>]*>([\s\S]*?)<\/article>/gi;
  var m;
  while ((m = re.exec(html))) {
    var card = cardFromBlock(m[1]);
    if (!card) continue;
    if (seen[card.id]) continue;
    seen[card.id] = 1;
    out.push(card);
  }
  return out;
}

function emptyList(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = txt(params.zone || "home");
  var tag = txt(params.sub || params.tag || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var html = await fetchPage(pageUrl(zone, tag, page));
    var list = parseCards(html);
    if (list.length) return list;
    return emptyList();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

async function search(params) {
  params = params || {};
  var wd = txt(params.keyword || params.wd || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return emptyList("请输入关键词");
  try {
    var url = SITE + "/?s=" + encodeURIComponent(wd);
    if (page > 1) url = SITE + "/page/" + page + "/?s=" + encodeURIComponent(wd);
    var html = await fetchPage(url);
    var list = parseCards(html);
    if (list.length) return list;
    return emptyList();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function unwrap(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

function pageTitle(html, fallback) {
  var m = html.match(/property=["']og:title["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  if (m) return unescape(m[1]).replace(/\s*[—–-]\s*JAV ASS LOVER.*$/i, "").trim();
  m = html.match(/<h1[^>]*>([^<]{2,200})<\/h1>/i);
  if (m) return unescape(m[1]);
  m = html.match(/<title>([^<]+)<\/title>/i);
  if (m) return unescape(m[1]).replace(/\s*[—–-]\s*JAV ASS LOVER.*$/i, "").trim();
  return fallback || "";
}

function pageCover(html) {
  var m = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (m) return fullUrl(m[1]);
  // 本站详情页无 og:image；封面在 video-js data-settings 的 poster 字段里
  var s = html.match(/data-settings="([^"]{0,8000})"/i);
  if (s) {
    var raw = s[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\\\//g, "/");
    var pm = raw.match(/"poster"\s*:\s*"([^"]+)"/i);
    if (pm) return fullUrl(pm[1]);
  }
  return "";
}

// 主播单解析：每档取文件夹名作档位（480p/720p/1080p/1440p/2160p），无文件夹名时按
// RESOLUTION 最小边就近取标准档；按档位从高到低排。
function parseVariants(text, base) {
  var out = [];
  var seen = {};
  var lines = String(text || "").split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    var inf = lines[i].match(/#EXT-X-STREAM-INF:(.*)/);
    if (!inf) continue;
    var uri = "";
    for (var j = i + 1; j < lines.length; j++) {
      var cand = txt(lines[j]);
      if (!cand) continue;
      if (cand.charAt(0) === "#") continue;
      uri = cand;
      break;
    }
    if (!uri) continue;
    var label = "";
    var folder = uri.match(/^(\d+p)\//i);
    if (folder) {
      label = folder[1].toLowerCase();
    } else {
      var res = inf[1].match(/RESOLUTION=(\d+)x(\d+)/i);
      if (res) {
        var small = Math.min(parseInt(res[1], 10), parseInt(res[2], 10));
        var best = TIERS[0];
        var gap = 100000;
        for (var k = 0; k < TIERS.length; k++) {
          var d = Math.abs(TIERS[k] - small);
          if (d < gap) { gap = d; best = TIERS[k]; }
        }
        label = best + "p";
      }
    }
    if (!label || seen[label]) continue;
    seen[label] = 1;
    var full = uri;
    if (full.indexOf("http://") !== 0 && full.indexOf("https://") !== 0) {
      var root = base.replace(/\/[^\/]*$/, "/");
      full = root + uri.replace(/^\//, "");
    }
    out.push({ label: label, url: full });
  }
  out.sort(function (a, b) { return parseInt(b.label, 10) - parseInt(a.label, 10); });
  return out;
}

function iframeSrc(html, re) {
  var tags = html.match(/<iframe[^>]+>/gi) || [];
  for (var i = 0; i < tags.length; i++) {
    var src = tags[i].match(/src="([^"]+)"/i);
    if (src && re.test(src[1])) return src[1].replace(/&amp;/g, "&");
  }
  return "";
}

// Bunny 原生：video-js data-settings JSON 里的 sources[0].src 即主播单地址
function findBunnyMaster(html) {
  var m = html.match(/data-settings="([^"]{0,8000})"/i);
  if (!m) return "";
  var raw = m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/\\\//g, "/");
  var src = raw.match(/"sources"\s*:\s*\[\s*\{\s*"src"\s*:\s*"([^"]+\.m3u8[^"]*)"/i);
  if (src) return src[1];
  return "";
}

// Bunny 嵌套：嵌套页直含 b-cdn.net 播单；取不到时用嵌套地址 guid + 拉流区拼接
async function resolveEmbedMaster(embed) {
  var page = await fetchPage(embed);
  var m = page.match(/https?:\/\/[a-z0-9\-]+\.b-cdn\.net\/[a-f0-9\-]+\/playlist\.m3u8/i);
  if (m) return m[0];
  var g = embed.match(/\/embed\/\d+\/([a-f0-9\-]{36})/i);
  if (g) return CDN_ZONE + "/" + g[1] + "/playlist.m3u8";
  return "";
}

// Dean Edwards packed JS 反混淆（无 eval，纯字符串替换；按词表从后往前逐项还原）
function depack(html) {
  var m = html.match(/eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?\}\('([\s\S]*?)',(\d+),(\d+),'([\s\S]*?)'\.split\('\|'\)\)\)/);
  if (!m) return "";
  var code = m[1].replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  var radix = parseInt(m[2], 10);
  var total = parseInt(m[3], 10);
  var dict = m[4].split("|");
  for (var idx = total - 1; idx >= 0; idx--) {
    var word = dict[idx];
    if (!word) continue;
    code = code.replace(new RegExp("\\b" + idx.toString(radix) + "\\b", "g"), word);
  }
  return code;
}

// 取 Lulu 签名 master：同一 file_code 在三 host 间按顺序尝试，解 packed JS 得 tnmr.org 签名播单
async function resolveLuluMaster(embed, ref) {
  var cm = String(embed || "").match(/\/e\/([A-Za-z0-9]+)/);
  if (!cm) return "";
  var code = cm[1];
  var first = (String(embed).match(/https?:\/\/([^\/]+)/) || [])[1] || "";
  var hosts = [];
  if (first) hosts.push(first);
  for (var i = 0; i < LULU_HOSTS.length; i++) {
    if (hosts.indexOf(LULU_HOSTS[i]) < 0) hosts.push(LULU_HOSTS[i]);
  }
  for (var h = 0; h < hosts.length; h++) {
    var page = "";
    try {
      var res = await Widget.http.get("https://" + hosts[h] + "/e/" + code, {
        headers: { "User-Agent": UA, "Referer": ref || SITE + "/", "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }
      });
      var d = res && res.data;
      page = typeof d === "string" ? d : (d ? JSON.stringify(d) : "");
    } catch (e) { page = ""; }
    if (!page) continue;
    var plain = depack(page);
    if (!plain) continue;
    var um = plain.match(/https?:\/\/[a-z0-9\-.]+\.tnmr\.org\/[^\s"'\\]+\.m3u8[^\s"'\\]*/i);
    if (um) return um[0];
  }
  return "";
}

// Lulu 签名 master 走 Worker /p/ 路由；ctx 必须带 Chrome 131 UA（Worker 默认 Chrome 128 会被 tnmr WAF 502）
function workerPlay(master) {
  var ctx = b64url(JSON.stringify({ r: SITE + "/", k: RELAY_KEY, ua: UA }));
  return HLS + "/p/" + b64url(master) + "/" + ctx;
}

// 详情现解：Bunny 两路取真实档位；无 Bunny 线时 Lulu 系现解签名 master 走 Worker 出单档；
// hgcloud/upns/playmogo 不列线
async function collectPlays(durl, html) {
  var plays = [];
  var master = findBunnyMaster(html);
  if (!master) {
    var embed = iframeSrc(html, /iframe\.mediadelivery\.net\/embed\//i);
    if (embed) master = await resolveEmbedMaster(embed);
  }
  if (master) {
    var text = await fetchMedia(master, durl);
    var variants = parseVariants(text, master);
    if (variants.length) {
      for (var i = 0; i < variants.length; i++) {
        plays.push({ name: variants[i].label, url: variants[i].url, kind: "bunny" });
      }
    } else {
      plays.push({ name: "原画", url: master, kind: "bunny" });
    }
  }
  if (!plays.length) {
    var lulu = iframeSrc(html, /lulu(?:vido|vdo|st)\.com\/e\//i);
    if (lulu) {
      var luluMaster = await resolveLuluMaster(lulu, durl);
      if (luluMaster) {
        var luluText = await fetchMedia(luluMaster, durl);
        var luluVars = parseVariants(luluText, luluMaster);
        if (luluVars.length) {
          plays.push({ name: luluVars[0].label, url: workerPlay(luluMaster), kind: "lulu" });
        }
      }
    }
  }
  return plays;
}

async function loadDetail(link) {
  try {
    var durl = unwrap(link);
    if (!durl) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    if (durl.indexOf("http") !== 0) durl = fullUrl(durl);
    var html = await fetchPage(durl);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = pageTitle(html, durl);
    var pic = pageCover(html);
    var desc = "";
    var dm = html.match(/property=["']og:description["'][^>]*content=["']([^"']+)/i);
    if (dm) desc = unescape(dm[1]);
    var plays = await collectPlays(durl, html);
    var eps = [];
    var seasonEps = [];
    var epItems = [];
    for (var i = 0; i < plays.length; i++) {
      var p = plays[i];
      var lid = durl + "@@JV2:" + p.name + ":" + p.kind;
      eps.push({ name: p.name, link: lid });
      seasonEps.push({ title: p.name, videoUrl: p.url, episodeNumber: i + 1 });
      epItems.push({
        id: lid,
        type: "url",
        title: p.name,
        mediaType: "movie",
        posterPath: pic,
        videoUrl: p.url,
        link: lid,
        episode: i + 1,
        episodeNumber: i + 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system"
      });
    }
    var result = {
      id: durl,
      type: "detail",
      title: name || durl,
      name: name || durl,
      description: desc,
      mediaType: "movie",
      link: durl,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app"
    };
    if (plays.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "清晰度", name: "清晰度", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
      result.videoUrl = plays[0].url;
    }
    return result;
  } catch (e) {
    return { id: unwrap(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = txt(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = txt(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 档位入口：<详情地址>@@JV2:<档位>:<bunny|lulu> -> 详情现解，取对应档位地址
  var mark = raw.indexOf("@@JV2:");
  if (mark >= 0) {
    var durl = raw.slice(0, mark);
    var want = raw.slice(mark + 6).split(":")[0];
    try {
      var html = await fetchPage(durl);
      if (!html) return [];
      var plays = await collectPlays(durl, html);
      for (var i = 0; i < plays.length; i++) {
        if (plays[i].name === want) {
          return [{ name: plays[i].name, url: plays[i].url, playerType: "system" }];
        }
      }
      if (plays.length) return [{ name: plays[0].name, url: plays[0].url, playerType: "system" }];
    } catch (e) { /* fall through */ }
    return [];
  }
  // 直链播单/视频
  if (/\.m3u8(\?|#|$)/i.test(raw) || /\.mp4(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system" }];
  }
  // 裸详情地址：取详情首档
  if (/^https?:\/\//i.test(raw)) {
    try {
      var det = await loadDetail(raw);
      var items = det && det.episodeItems;
      if (items && items.length && items[0].videoUrl) {
        return [{ name: items[0].title, url: items[0].videoUrl, playerType: "system" }];
      }
    } catch (e) { /* fall through */ }
  }
  return [];
}
