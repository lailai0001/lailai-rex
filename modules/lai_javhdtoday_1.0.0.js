// JavHD.Today for REX (lai_javhdtoday v1.0.0, 移植自 mira-cat 蜘蛛 py_javhdtoday)
// 后端：https://javhd.today/cn（JAV 聚合站，无反爬）。与 javhd.icu 的 JavHD 是不同站点。
// 列表：排序分类 GET /cn/{sort}/[/{N}/] SSR 28 条/页；标签分类走 ?ajax=1 JSON 接口。
// 详情：GET /cn/{id}/{slug}/ 取 <iframe src="/cn/embed/{id}/">。
// 播放：embed 页各 server 页调 ?json=1 接口取源，优先级与蜘蛛一致：
//   embed_server3 (vidara m3u8, 挑最高档) > embed_server9 (streamtape MP4)
//   > embed.php (站方代理 HLS) > f4 系 (api/play 降级)。
//   注意：vidara 带 Referer 会被限速，server3/9 的播放头只带 UA 不带 Referer。

WidgetMetadata = {
  id: "lai_javhdtoday",
  title: "JavHD.Today",
  description: "JavHD.Today（javhd.today）：排序+标签共 16 个分类，播放多源实时解析、优先最高画质",
  author: "lai",
  version: "1.0.0",
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
  var page = parseInt(params.page, 10) || 1;
  var tid = t(params.path || params.cat || "recent");
  try {
    if (tid.indexOf("tag:") === 0) {
      var slug = TAG_SLUGS[tid] || "uncensored-jav";
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
async function pickHighest(masterUrl) {
  try {
    var res = await Widget.http.get(masterUrl, { headers: { "User-Agent": UA }, timeout: 15000 });
    var text = res && res.data != null ? String(res.data) : "";
    if (text.indexOf("#EXT-X-STREAM-INF") < 0) return masterUrl;
    var lines = text.split(/\r?\n/);
    var best = null;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line.indexOf("#EXT-X-STREAM-INF") !== 0) continue;
      var uri = "";
      for (var k = i + 1; k < lines.length; k++) {
        var nx = lines[k].trim();
        if (nx) { uri = nx; break; }
      }
      if (!uri) continue;
      var rm = line.match(/RESOLUTION=(\d+)x(\d+)/i);
      var bm = line.match(/BANDWIDTH=(\d+)/i);
      var cand = { uri: uri, h: rm ? parseInt(rm[2], 10) : 0, bw: bm ? parseInt(bm[1], 10) : 0 };
      if (!best || cand.h > best.h || (cand.h === best.h && cand.bw > best.bw)) best = cand;
    }
    if (!best) return masterUrl;
    if (/^https?:\/\//i.test(best.uri)) return best.uri;
    var base = masterUrl.split("?")[0];
    base = base.slice(0, base.lastIndexOf("/") + 1);
    return base + best.uri.replace(/^\.\//, "");
  } catch (e) { return masterUrl; }
}

async function loadDetail(link) {
  var durl = t(link);
  try {
    if (!/^https?:\/\//.test(durl)) durl = fixUrl(durl);
    var html = await fetchText(durl, REFERER);
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
    function detail(videoUrl, headers) {
      return {
        id: durl,
        type: "detail",
        title: name,
        link: durl,
        posterPath: pic,
        coverUrl: pic,
        backdropPath: pic,
        videoUrl: videoUrl,
        playerType: "app",
        customHeaders: headers
      };
    }

    var embedUrl = extractEmbed(html);
    if (!embedUrl) return fail("未找到播放器");
    var embedHtml = await fetchText(embedUrl, durl);
    if (!embedHtml) return fail("播放器页面为空");
    var players = extractPlayers(embedHtml);
    if (!players.length) return fail("未找到播放源");

    function findServer(re) {
      for (var i = 0; i < players.length; i++) {
        if (/javhdz\.today\//i.test(players[i].url) && re.test(players[i].url)) return players[i];
      }
      return null;
    }

    // 1) embed_server3.php（vidara m3u8 直链，分片最快）-> 挑最高档；只带 UA
    var s3 = findServer(/embed_server3\.php/i);
    if (s3) {
      var r3 = await resolveServerJson(s3.url, embedUrl);
      if (r3 && r3.kind === "hls" && r3.url) {
        var best = await pickHighest(r3.url);
        return detail(best, { "User-Agent": UA });
      }
    }
    // 2) embed_server9.php（streamtape MP4 直链）；只带 UA
    var s9 = findServer(/embed_server9\.php/i);
    if (s9) {
      var r9 = await resolveServerJson(s9.url, embedUrl);
      if (r9 && r9.url) {
        return detail(r9.url, { "User-Agent": UA });
      }
    }
    // 3) embed.php（站方代理 HLS，基本必有源）
    var mainSelf = findServer(/\/embed\.php(\?|$)/i);
    var selfPlayers = mainSelf ? [mainSelf] : players.filter(function (p) { return /javhdz\.today\/embed\.php/i.test(p.url); });
    for (var si = 0; si < selfPlayers.length; si++) {
      var rs = await resolveServerJson(selfPlayers[si].url, embedUrl);
      if (rs && rs.kind === "hls" && rs.url) {
        return detail(rs.url, { "User-Agent": UA, "Referer": rs.playerUrl });
      }
    }
    // 4) f4 系（m3u8 token 疑似绑定请求 IP，仅作降级）
    var f4 = null;
    for (var fi = 0; fi < players.length; fi++) {
      if (/f4\w*\.com|f4scdn/i.test(players[fi].url)) { f4 = players[fi]; break; }
    }
    if (f4) {
      var rf = await resolveF4(f4.url, durl);
      if (rf && rf.url) {
        return detail(rf.url, { "User-Agent": UA, "Referer": f4.url, "Origin": rf.origin });
      }
    }
    return fail("未找到播放地址");
  } catch (e) {
    return { id: durl || String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
