// 123AV for REX (lai_av123 v1.0.0, 移植自 mira-cat 蜘蛛 py_av123)
// 后端：https://123av.com（中文站 /cn/ 路径），HTML 页面解析。
// 注意：与包内 missav.fans 版 123AV 不是同一后端，本模块走 123av.com 本站。
// 播放：详情页 player(JSON.parse(...)) 取 embed 线路，逐个调 embed 源站
// /stream?id= 接口解析出 m3u8；m3u8 有 Referer 检查，customHeaders 必须带
// embed 源站的 Referer/Origin，多档时挑最高档。

WidgetMetadata = {
  id: "lai_av123",
  title: "123AV.com",
  description: "123AV（123av.com）：新发布/热门/有码/无码与类别索引，详情实时解析 m3u8",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://123av.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "精选",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "列表",
          type: "enumeration",
          value: "new",
          enumOptions: [
            { title: "新发布", value: "new" },
            { title: "热门", value: "hot" },
            { title: "最近更新", value: "recent" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "类型",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "类型",
          type: "enumeration",
          value: "censored",
          enumOptions: [
            { title: "有码", value: "censored" },
            { title: "无码", value: "uncensored" },
            { title: "无码泄露", value: "uncensored-leaked" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "索引",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "索引",
          type: "enumeration",
          value: "genres",
          enumOptions: [
            { title: "类别", value: "genres" },
            { title: "女演员", value: "actresses" },
            { title: "制作商", value: "makers" },
            { title: "系列", value: "series" }
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

var BASE = "https://123av.com";
var LANG = "cn";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": BASE + "/" + LANG + "/"
  };
}

function cfBlocked(html) {
  var s = String(html || "");
  return s.indexOf("Just a moment") >= 0 || s.indexOf("cf-browser-verification") >= 0;
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  if (cfBlocked(body)) throw new Error("被 Cloudflare 拦截，请稍后重试");
  return body;
}

function trimStr(v) {
  return String(v == null ? "" : v).trim();
}

function hiResCover(url) {
  url = trimStr(url);
  if (!url) return "";
  return url.replace(/\/s360\//, "/s1080/");
}

// 与蜘蛛 parseList 相同：card__link + 往前窗口找 card__img 封面、card__dur 时长，另有两级兜底
function parseList(html) {
  var items = [];
  var seen = {};
  var re = /<a class="card__link" href="(\/(?:cn|en)\/v\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(html))) {
    var link = m[1];
    if (seen[link]) continue;
    seen[link] = 1;
    var title = trimStr(m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " "));
    if (!title) title = link.split("/").pop();

    var pic = "";
    var dur = "";
    var windowStart = Math.max(0, m.index - 1200);
    var chunk = html.slice(windowStart, m.index + 20);
    var im = chunk.match(/class="card__img"[^>]+src="([^"]+)"|src="([^"]+)"[^>]+class="card__img"/);
    if (im) pic = im[1] || im[2] || "";
    if (!pic) {
      var im2 = chunk.match(/(?:src|data-src)="(https?:\/\/[^"]+\/(?:s360|s500|s1080)\/[^"]+)"/i);
      if (im2) pic = im2[1];
    }
    var dm = chunk.match(/class="card__dur"[^>]*>([^<]+)</);
    if (dm) dur = trimStr(dm[1]);

    items.push({ link: link, title: title, pic: hiResCover(pic), dur: dur });
  }

  if (!items.length) {
    var re2 = /href="(\/(?:cn|en)\/v\/[^"]+)"[\s\S]{0,400}?class="card__img"[^>]+src="([^"]+)"/gi;
    while ((m = re2.exec(html))) {
      if (seen[m[1]]) continue;
      seen[m[1]] = 1;
      items.push({ link: m[1], title: m[1].split("/").pop(), pic: hiResCover(m[2]), dur: "" });
    }
  }
  if (!items.length) {
    var re3 = /class="card__cover"[^>]*href="(\/(?:cn|en)\/v\/[^"]+)"[\s\S]{0,500}?class="card__img"[^>]+src="([^"]+)"/gi;
    while ((m = re3.exec(html))) {
      if (seen[m[1]]) continue;
      seen[m[1]] = 1;
      items.push({ link: m[1], title: m[1].split("/").pop(), pic: hiResCover(m[2]), dur: "" });
    }
  }

  return items.map(function (it) {
    var full = BASE + it.link;
    return {
      id: full,
      type: "url",
      title: it.title,
      posterPath: it.pic,
      coverUrl: it.pic,
      backdropPath: it.pic,
      link: full,
      description: it.link.split("/").pop().toUpperCase(),
      releaseDate: it.dur || "",
      mediaType: "movie"
    };
  });
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var path = String(params.path || "new").replace(/^\/+/, "");
  var url = BASE + "/" + LANG + "/" + path;
  if (page > 1) url += "?page=" + page;
  try {
    var html = await fetchText(url);
    var cards = parseList(html);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
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
  var keyword = pickKeyword(params);
  if (!keyword) {
    return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  }
  var page = parseInt(params.page, 10) || 1;
  var url = BASE + "/" + LANG + "/search?keyword=" + encodeURIComponent(keyword);
  if (page > 1) url += "&page=" + page;
  try {
    var html = await fetchText(url);
    var cards = parseList(html);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

function unescapeJsonish(s) {
  s = String(s || "");
  s = s.replace(/\\u0022/g, '"').replace(/\\u0027/g, "'");
  s = s.replace(/\\u003c/gi, "<").replace(/\\u003e/gi, ">");
  var prev;
  do {
    prev = s;
    s = s.replace(/\\\//g, "/");
  } while (s !== prev);
  return s;
}

// 与蜘蛛 extractEmbeds 相同：player(JSON.parse('...')) 里的线路数组
function extractEmbeds(html) {
  var embeds = [];
  var m = html.match(/player\(\s*JSON\.parse\(\s*(['"])([\s\S]*?)\1\s*\)/);
  if (m) {
    var s = unescapeJsonish(m[2]);
    try {
      var arr = JSON.parse(s);
      if (Array.isArray(arr)) {
        arr.forEach(function (it) {
          if (it && it.url) {
            var u = unescapeJsonish(String(it.url));
            var nm = trimStr(it.name);
            if (!nm || /^\d+$/.test(nm)) nm = "线路" + (embeds.length + 1);
            embeds.push({ name: nm, url: u });
          }
        });
      }
    } catch (e) {}
  }
  if (!embeds.length) {
    var em2 = html.match(/https?:\/\/[^"'\\\s]+\/e\/[A-Za-z0-9]+/g) || [];
    em2.forEach(function (u, i) {
      embeds.push({ name: "线路" + (i + 1), url: unescapeJsonish(u) });
    });
  }
  return embeds;
}

function originOf(url) {
  var m = String(url || "").match(/^(https?:\/\/[^/]+)/);
  return m ? m[1] : "";
}

function playHeadersForEmbed(embedUrl) {
  var origin = originOf(embedUrl) || "https://jav-master-52.site";
  return {
    "User-Agent": UA,
    "Referer": origin + "/",
    "Origin": origin,
    "Accept": "*/*"
  };
}

// 与蜘蛛 resolveStream 相同：GET {embed 源站}/stream?id={eid} 取 media.stream
async function resolveStream(embedUrl) {
  embedUrl = trimStr(embedUrl);
  if (!embedUrl) return "";
  var idm = embedUrl.match(/\/e\/([A-Za-z0-9]+)/);
  if (!idm) return "";
  var origin = originOf(embedUrl);
  if (!origin) return "";
  var streamApi = origin + "/stream?id=" + encodeURIComponent(idm[1]);
  try {
    var res = await Widget.http.get(streamApi, {
      headers: {
        "User-Agent": UA,
        "Accept": "application/json, text/plain, */*",
        "Referer": embedUrl,
        "Origin": origin
      }
    });
    var body = res && res.data != null ? res.data : "";
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return "";
      }
    }
    return trimStr((body && body.media && body.media.stream) || (body && body.stream) || "");
  } catch (e) {
    return "";
  }
}

function absolutize(masterUrl, uri) {
  if (/^https?:\/\//i.test(uri)) return uri;
  if (uri.charAt(0) === "/") {
    var om = masterUrl.match(/^(https?:\/\/[^/]+)/);
    return (om ? om[1] : "") + uri;
  }
  var dir = masterUrl.slice(0, masterUrl.lastIndexOf("/") + 1);
  return dir + uri.replace(/^\.\//, "");
}

// 主列表多档时挑最高档（先比 RESOLUTION 高度，再比 BANDWIDTH）；失败则原样返回主列表
async function pickQuality(masterUrl, headers) {
  try {
    var res = await Widget.http.get(masterUrl, { headers: headers });
    var text = res && res.data != null ? String(res.data) : "";
    if (text.indexOf("#EXTM3U") !== 0) return masterUrl;
    var lines = text.split(/\r?\n/);
    var best = null;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line.indexOf("#EXT-X-STREAM-INF") !== 0) continue;
      var uri = "";
      for (var j = i + 1; j < lines.length; j++) {
        var t2 = lines[j].trim();
        if (t2) { uri = t2; break; }
      }
      if (!uri) continue;
      var rm = line.match(/RESOLUTION=(\d+)x(\d+)/i);
      var bm = line.match(/BANDWIDTH=(\d+)/i);
      var cand = { uri: uri, h: rm ? parseInt(rm[2], 10) : 0, bw: bm ? parseInt(bm[1], 10) : 0 };
      if (!best || cand.h > best.h || (cand.h === best.h && cand.bw > best.bw)) best = cand;
    }
    if (best) return absolutize(masterUrl, best.uri);
  } catch (_) {}
  return masterUrl;
}

function parsePath(link) {
  var s = String(link || "");
  var m = s.match(/^https?:\/\/[^/]+(\/.*)$/);
  if (m) return m[1].split("?")[0].split("#")[0];
  return s.charAt(0) === "/" ? s : "/" + s;
}

async function loadDetail(link) {
  var url0 = String(link || "");
  try {
    var path = parsePath(url0);
    var pageUrl = BASE + path;
    var html = await fetchText(pageUrl);

    var title = path.split("/").pop() || path;
    var hm = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (hm) title = trimStr(hm[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " "));
    if (!title || title === "1") {
      var og = html.match(/og:title["']\s+content=["']([^"']+)/i);
      if (og) title = trimStr(og[1]);
    }

    var cover = "";
    var bm = html.match(/background-image:\s*url\(['"]?(https?:\/\/icdn\.123av\.me\/[^)'"\s]+)/i);
    if (bm) cover = bm[1];
    if (!cover) {
      var cm2 = html.match(/https?:\/\/icdn\.123av\.me\/img2\/s(?:500|1080)\/[^"'\s\)]+cover\.jpg[^"'\s\)]*/i);
      if (cm2) cover = cm2[0];
    }
    if (!cover) {
      var cm3 = html.match(/https?:\/\/icdn\.123av\.me\/img2\/s360\/[^"'\s\)]+cover\.jpg[^"'\s\)]*/i);
      if (cm3) cover = cm3[0].replace("/s360/", "/s500/");
    }
    cover = trimStr(cover).replace(/[)'"]+$/, "");

    // 逐个线路实时解析，命中第一个能出 m3u8 的
    var embeds = extractEmbeds(html);
    var streamUrl = "";
    var usedEmbed = "";
    for (var i = 0; i < embeds.length; i++) {
      var s = await resolveStream(embeds[i].url);
      if (s) {
        streamUrl = s;
        usedEmbed = embeds[i].url;
        break;
      }
    }
    if (!streamUrl) {
      return { id: pageUrl, type: "url", title: title || "解析失败", description: "未找到播放地址" };
    }

    var headers = playHeadersForEmbed(usedEmbed);
    var videoUrl = await pickQuality(streamUrl, headers);
    return {
      id: pageUrl,
      type: "detail",
      title: title,
      link: pageUrl,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: headers
    };
  } catch (e) {
    return { id: url0 || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
