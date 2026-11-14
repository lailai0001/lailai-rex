// Javass for REX (lai_javass v1.0.0)
// 移植自 mira-cat 蜘蛛 javass.js（只读蓝图），站 https://javass.love/。
// 播放线（只列实测能播的）：
//   (1) Bunny 原生：详情页 video-js data-settings JSON sources[0].src = b-cdn.net 主播单，
//       直连，无 UA 校验；解析 master 得真实档位（480p/720p/1080p/1440p/2160p，
//       通常 3-4 档），各档变体播单直链可播。
//   (2) Bunny 嵌套：iframe.mediadelivery.net 嵌套页直含 b-cdn.net 播单；取不到时用
//       嵌套地址 guid + 拉流区 vz-9f2ab8d8-84b.b-cdn.net 拼接。
//   (3) Lulu：luluvido/luluvdo/lulust 嵌套页 Dean Edwards packed JS 现解，得 tnmr.org
//       签名 master（单档 720p，token 8h），走 javass-hls Worker /p/ 中转；
//       ctx 必须带 Chrome 131 UA（Worker 默认 Chrome 128 会被 tnmr WAF 502）。
//   hgcloud / upns / playmogo（DoodStream Turnstile）无解，不列线。
// WAF 注意：取播单类地址只带 UA + Referer，绝不带 Accept-Language（tnmr 遇 zh-CN 即 403）。

WidgetMetadata = {
  id: "lai_javass",
  title: "Javass",
  description: "Javass：Bunny 原生多档直链，Lulu 单档走 javass-hls Worker，标签筛选",
  author: "lai",
  version: "1.0.0",
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
    { title: "标签", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag" }, { name: "sub", title: "标签", type: "enumeration", value: "tag:jav-big-ass", enumOptions: [{"name": "标签·jav-big-ass", "value": "tag:jav-big-ass"}, {"name": "标签·big-ass-japanese-porn", "value": "tag:big-ass-japanese-porn"}, {"name": "标签·amateur", "value": "tag:amateur"}, {"name": "标签·creampie", "value": "tag:creampie"}, {"name": "标签·big-tits", "value": "tag:big-tits"}, {"name": "标签·big-ass-cowgirl", "value": "tag:big-ass-cowgirl"}, {"name": "标签·huge-butt", "value": "tag:huge-butt"}, {"name": "标签·big-ass", "value": "tag:big-ass"}, {"name": "标签·big-butt-pawg", "value": "tag:big-butt-pawg"}, {"name": "标签·asian-big-ass", "value": "tag:asian-big-ass"}, {"name": "标签·cowgirl", "value": "tag:cowgirl"}, {"name": "标签·big-ass-pantyhose", "value": "tag:big-ass-pantyhose"}, {"name": "标签·doggystyle", "value": "tag:doggystyle"}, {"name": "标签·japanese-big-ass", "value": "tag:japanese-big-ass"}, {"name": "标签·jav-big-butt", "value": "tag:jav-big-butt"}, {"name": "标签·oiled", "value": "tag:oiled"}, {"name": "标签·subbed", "value": "tag:subbed"}, {"name": "标签·voluptuous-ass", "value": "tag:voluptuous-ass"}, {"name": "标签·big-ass-nurse", "value": "tag:big-ass-nurse"}, {"name": "标签·deepthroat", "value": "tag:deepthroat"}, {"name": "标签·dildo-riding", "value": "tag:dildo-riding"}, {"name": "标签·pounding", "value": "tag:pounding"}, {"name": "标签·retsu-dao", "value": "tag:retsu-dao"}, {"name": "标签·sacananoco", "value": "tag:sacananoco"}, {"name": "标签·waka-misono", "value": "tag:waka-misono"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://javass.love";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
var BUNNY_VZ = "https://vz-9f2ab8d8-84b.b-cdn.net";
var JAVASS_HLS = "https://javass-hls.li768435813.workers.dev";
var JAVASS_RELAY_KEY = "lai-hls-1";
var LULU_HOSTS = ["luluvido.com", "luluvdo.com", "lulust.com"];

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  return t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/&#x([0-9a-fA-F]+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 16)); });
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return HOST + "/" + u;
}

// 纯 JS base64url（REX 沙箱无 Buffer、无 TextEncoder）
var B64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64encode(str) {
  var out = "";
  var i = 0;
  while (i < str.length) {
    var c1 = str.charCodeAt(i++) & 0xff;
    var c2 = i < str.length ? str.charCodeAt(i++) & 0xff : NaN;
    var c3 = i < str.length ? str.charCodeAt(i++) & 0xff : NaN;
    var b1 = c1 >> 2;
    var b2 = ((c1 & 3) << 4) | (c2 >> 4);
    var b3 = isNaN(c2) ? 64 : ((c2 & 15) << 2) | (c3 >> 6);
    var b4 = isNaN(c3) ? 64 : (c3 & 63);
    out += B64_CHARS.charAt(b1) + B64_CHARS.charAt(b2) + (b3 === 64 ? "=" : B64_CHARS.charAt(b3)) + (b4 === 64 ? "=" : B64_CHARS.charAt(b4));
  }
  return out;
}
function b64url(s) {
  var utf8 = unescape(encodeURIComponent(String(s)));
  return b64encode(utf8).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

// 取页：Chrome 131 UA（站方 WAF：Chrome 128 502，131 才 200；Accept-Language: zh-CN 403）
function getHtml(url) {
  return Widget.http.get(url, {
    headers: {
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Referer": HOST + "/"
    }
  })
    .then(function (res) {
      var d = res && res.data;
      return d != null ? (typeof d === "string" ? d : JSON.stringify(d)) : "";
    })
    .catch(function () { return ""; });
}

// 取播单类地址：只带 UA + Referer，不带 Accept-Language（tnmr WAF 遇 zh-CN 即 403）
function getMediaText(url, referer) {
  return Widget.http.get(url, {
    headers: { "User-Agent": UA, "Referer": referer || HOST + "/" }
  })
    .then(function (res) {
      var d = res && res.data;
      return d != null ? (typeof d === "string" ? d : JSON.stringify(d)) : "";
    })
    .catch(function () { return ""; });
}

function listUrl(zone, sub, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  if (zone === "home" || zone === "") {
    return page <= 1 ? HOST + "/" : HOST + "/page/" + page + "/";
  }
  if (zone === "tag") {
    var slug = (sub || "tag:jav-big-ass").replace(/^tag:/, "");
    return page <= 1 ? HOST + "/video_tag/" + slug + "/" : HOST + "/video_tag/" + slug + "/page/" + page + "/";
  }
  return page <= 1 ? HOST + "/categories/" + zone + "/" : HOST + "/categories/" + zone + "/page/" + page + "/";
}

function parseList(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<article\b[^>]*>([\s\S]*?)<\/article>/gi;
  var m;
  while ((m = re.exec(html))) {
    var body = m[1];
    var am = body.match(/<a[^>]+class="[^"]*post-permalink[^"]*"[^>]+title="([^"]+)"[^>]+href="([^"]+)"[^>]*>/i)
      || body.match(/<a[^>]+title="([^"]+)"[^>]+href="([^"]+)"[^>]*class="[^"]*post-permalink[^"]*"[^>]*>/i)
      || body.match(/<a[^>]+href="(https?:\/\/javass\.love\/video\/[^"\/]+\/)"[^>]*title="([^"]+)"[^>]*>/i);
    var href = "", title = "";
    if (am) {
      if (/^https?:\/\//i.test(am[1])) { href = am[1]; title = am[2]; }
      else { title = am[1]; href = am[2]; }
    }
    if (!href || !/\/video\/[A-Za-z0-9]+\/$/.test(href)) continue;
    if (seen[href]) continue;
    seen[href] = 1;
    var cm = body.match(/background-image:\s*url\(([^)]+)\)/i);
    var cover = cm ? absUrl(cm[1].replace(/["']/g, "").trim()) : "";
    if (!cover) {
      var im = body.match(/<img[^>]+class="[^"]*wp-post-image[^"]*"[^>]+src="([^"]+)"/i)
        || body.match(/<img[^>]+src="([^"]+)"[^>]+class="[^"]*wp-post-image[^"]*"[^>]*>/i)
        || body.match(/<img[^>]+src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i);
      if (im) cover = absUrl(im[1]);
    }
    title = decodeHtml(title);
    if (!title) {
      var hm = body.match(/<h2[^>]*>\s*<a[^>]*>([^<]{2,200})<\/a>/i);
      if (hm) title = decodeHtml(hm[1]);
    }
    if (!title) title = href;
    var remarks = "";
    var dm = body.match(/class="[^"]*video-length[^"]*"[^>]*>\s*([^<]{1,12})\s*</i);
    if (dm) remarks = t(dm[1]);
    out.push({
      id: href,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
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

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "home");
  var sub = t(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var html = await getHtml(listUrl(zone, sub, page));
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
    var url = HOST + "/?s=" + encodeURIComponent(wd);
    if (page > 1) url = HOST + "/page/" + page + "/?s=" + encodeURIComponent(wd);
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
  var m = html.match(/property=["']og:title["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  if (m) return decodeHtml(m[1]).replace(/\s*[—–-]\s*JAV ASS LOVER.*$/i, "").trim();
  m = html.match(/<h1[^>]*>([^<]{2,200})<\/h1>/i);
  if (m) return decodeHtml(m[1]);
  m = html.match(/<title>([^<]+)<\/title>/i);
  if (m) return decodeHtml(m[1]).replace(/\s*[—–-]\s*JAV ASS LOVER.*$/i, "").trim();
  return fallback || "";
}

function extractCover(html) {
  var m = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (m) return absUrl(m[1]);
  return "";
}

// 主播单解析：每档取文件夹名作档位（480p/720p/1080p/1440p/2160p），无文件夹名时按 RESOLUTION 最小边就近取标准档；按档位从高到低排。
function parseMaster(text, base) {
  var out = [];
  var seen = {};
  var lines = String(text || "").split(/\r?\n/);
  var STD = [240, 360, 480, 720, 1080, 1440, 2160];
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
    var label = "";
    var fm = uri.match(/^([0-9]+p)\//i);
    if (fm) label = fm[1].toLowerCase();
    else {
      var rm = /RESOLUTION=(\d+)x(\d+)/i.exec(inf[1]);
      if (rm) {
        var mn = Math.min(parseInt(rm[1], 10), parseInt(rm[2], 10));
        var best = STD[0], bd = 1e9;
        for (var k = 0; k < STD.length; k++) {
          var d = Math.abs(STD[k] - mn);
          if (d < bd) { bd = d; best = STD[k]; }
        }
        label = best + "p";
      }
    }
    if (!label || seen[label]) continue;
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

// Bunny 原生：video-js data-settings JSON 里的 sources[0].src 即主播单地址
function extractBunnyMaster(html) {
  var m = html.match(/data-settings="([^"]{0,6000})"/i);
  if (!m) return "";
  var s = m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#39;/g, "'");
  s = s.replace(/\\\//g, "/");
  var sm = s.match(/"sources"\s*:\s*\[\s*\{\s*"src"\s*:\s*"([^"]+\.m3u8[^"]*)"/i);
  if (sm) return sm[1].replace(/\\\//g, "/");
  return "";
}

// Bunny 嵌套：取第一个 iframe.mediadelivery.net 嵌套地址
function extractMediadeliveryEmbed(html) {
  var iframes = html.match(/<iframe[^>]+src="([^"]+)"[^>]*>/gi) || [];
  for (var i = 0; i < iframes.length; i++) {
    var um = iframes[i].match(/src="([^"]+)"/i);
    if (um && /iframe\.mediadelivery\.net\/embed\//i.test(um[1])) return um[1].replace(/&amp;/g, "&");
  }
  return "";
}

async function resolveMediadelivery(embedUrl) {
  var page = await getHtml(embedUrl);
  var m = page.match(/https?:\/\/[a-z0-9\-]+\.b-cdn\.net\/[a-f0-9\-]+\/playlist\.m3u8/i);
  if (m) return m[0];
  var gm = embedUrl.match(/\/embed\/\d+\/([a-f0-9\-]{36})/i);
  if (gm) return BUNNY_VZ + "/" + gm[1] + "/playlist.m3u8";
  return "";
}

// 详情页取第一个 Lulu iframe（文档顺序第一个即主播放器）
function extractLuluEmbed(html) {
  var iframes = html.match(/<iframe[^>]+src="([^"]+)"[^>]*>/gi) || [];
  for (var i = 0; i < iframes.length; i++) {
    var um = iframes[i].match(/src="([^"]+)"/i);
    if (um && /lulu(?:vido|vdo|st)\.com\/e\//i.test(um[1])) return um[1].replace(/&amp;/g, "&");
  }
  return "";
}

// Dean Edwards packer 简化版反混淆（无 eval，纯字符串替换）
function unpackDeanEdwards(html) {
  var m = html.match(/eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?\}\('([\s\S]*?)',(\d+),(\d+),'([\s\S]*?)'\.split\('\|'\)\)\)/);
  if (!m) return "";
  var p = m[1].replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  var a = parseInt(m[2], 10);
  var k = m[4].split("|");
  var c = parseInt(m[3], 10);
  while (c--) {
    if (k[c]) p = p.replace(new RegExp("\\b" + c.toString(a) + "\\b", "g"), k[c]);
  }
  return p;
}

// 取 Lulu 签名 master：同一 file_code 在三 host 间按顺序尝试，解 packed JS 得 tnmr.org 签名播单
async function resolveLulu(embedUrl, referer) {
  var cm = String(embedUrl || "").match(/\/e\/([A-Za-z0-9]+)/);
  if (!cm) return "";
  var code = cm[1];
  var firstHost = (String(embedUrl).match(/https?:\/\/([^\/]+)/) || [])[1] || "";
  var hosts = [];
  if (firstHost) hosts.push(firstHost);
  for (var i = 0; i < LULU_HOSTS.length; i++) {
    if (hosts.indexOf(LULU_HOSTS[i]) < 0) hosts.push(LULU_HOSTS[i]);
  }
  for (var h = 0; h < hosts.length; h++) {
    var page = "";
    try {
      var res = await Widget.http.get("https://" + hosts[h] + "/e/" + code, {
        headers: { "User-Agent": UA, "Referer": referer || HOST + "/", "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }
      });
      var d = res && res.data;
      page = typeof d === "string" ? d : (d ? JSON.stringify(d) : "");
    } catch (e) { page = ""; }
    if (!page) continue;
    var unpacked = unpackDeanEdwards(page);
    if (!unpacked) continue;
    var um = unpacked.match(/https?:\/\/[a-z0-9\-.]+\.tnmr\.org\/[^\s"'\\]+\.m3u8[^\s"'\\]*/i);
    if (um) return um[0];
  }
  return "";
}

// Lulu 签名 master 走 Worker /p/ 路由；ctx 必须带 Chrome 131 UA（Worker 默认 Chrome 128 会被 tnmr WAF 502）
function luluWorkerUrl(master) {
  var ctx = b64url(JSON.stringify({ r: HOST + "/", k: JAVASS_RELAY_KEY, ua: UA }));
  return JAVASS_HLS + "/p/" + b64url(master) + "/" + ctx;
}

// 详情现解：Bunny 两路取真实档位；Lulu 系现解签名 master 走 Worker 出单档 720p；hgcloud/upns/playmogo 不列线
async function resolveLines(durl, html) {
  var lines = []; // { label, url, via } via: "direct" | "worker"
  var master = extractBunnyMaster(html);
  if (!master) {
    var embed = extractMediadeliveryEmbed(html);
    if (embed) master = await resolveMediadelivery(embed);
  }
  if (master) {
    var masterText = await getMediaText(master, durl);
    var variants = parseMaster(masterText, master);
    if (variants.length) {
      for (var i = 0; i < variants.length; i++) {
        lines.push({ label: variants[i].label, url: variants[i].url, via: "direct" });
      }
    } else {
      lines.push({ label: "原画", url: master, via: "direct" });
    }
  }
  if (!lines.length) {
    var luluEmbed = extractLuluEmbed(html);
    if (luluEmbed) {
      var luluMaster = await resolveLulu(luluEmbed, durl);
      if (luluMaster) {
        var luluText = await getMediaText(luluMaster, durl);
        var luluVariants = parseMaster(luluText, luluMaster);
        if (luluVariants.length) {
          lines.push({ label: luluVariants[0].label, url: luluWorkerUrl(luluMaster), via: "worker" });
        }
      }
    }
  }
  return lines;
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    if (raw.indexOf("http") !== 0) raw = absUrl(raw);
    var html = await getHtml(raw);
    if (!html) return { id: raw, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = extractTitle(html, raw);
    var pic = extractCover(html);
    var desc = "";
    var dm = html.match(/property=["']og:description["'][^>]*content=["']([^"']+)/i);
    if (dm) desc = decodeHtml(dm[1]);
    var lines = await resolveLines(raw, html);
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    for (var i = 0; i < lines.length; i++) {
      var id = raw + "@@JS:" + lines[i].label + ":" + lines[i].via;
      eps.push({ name: lines[i].label, link: id });
      seasonEps.push({ title: lines[i].label, videoUrl: lines[i].url, episodeNumber: i + 1 });
      epItems.push({
        id: id,
        type: "url",
        title: lines[i].label,
        mediaType: "movie",
        posterPath: pic,
        videoUrl: lines[i].url,
        link: id,
        episode: i + 1,
        episodeNumber: i + 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system"
      });
    }
    var result = {
      id: raw,
      type: "detail",
      title: name || raw,
      name: name || raw,
      description: desc,
      mediaType: "movie",
      link: raw,
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
      result.videoUrl = lines[0].url;
    }
    return result;
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
  // 档位入口：@@JS:<label>:<via> -> 详情现解，取对应档位地址
  var m = raw.match(/@@JS:([^:]+):(direct|worker)$/);
  if (m) {
    var durl = raw.slice(0, raw.indexOf("@@JS:"));
    try {
      var html = await getHtml(durl);
      if (!html) return [];
      var lines = await resolveLines(durl, html);
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].label === m[1]) {
          return [{ name: lines[i].label, url: lines[i].url, playerType: "system" }];
        }
      }
      if (lines.length) return [{ name: lines[0].label, url: lines[0].url, playerType: "system" }];
    } catch (e) { /* fall through */ }
    return [];
  }
  // 直链播单/视频
  if (/\.m3u8(\?|#|$)/i.test(raw) || /\.mp4(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system" }];
  }
  return [];
}
