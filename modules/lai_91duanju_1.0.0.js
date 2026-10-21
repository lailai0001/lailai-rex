// 91成人短剧 for REX (lai_91duanju v1.0.0)
// 移植自 mira-cat 蜘蛛 91duanju.js（只读蓝图，逻辑等价移植）。
// 后端：91crdj.com（HTML 页面解析，会 301 到镜像域名，靠请求跟随重定向）。
// 封面为 AES-128-CBC 加密存储，走用户已部署的 bagua-img-proxy Worker 解密出图。
// 短剧为多集结构：loadDetail 返回分集（episodeItems/childItems），
// 播放由 stream 模块 loadResource 实时抓集页面解析 m3u8（蜘蛛 play 逻辑）。

WidgetMetadata = {
  id: "lai_91duanju",
  title: "91成人短剧",
  description: "91成人短剧（91crdj.com）：成人短剧/漫剧/真人剧/视频/漫画/小说，多集短剧实时解析播放",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://91crdj.com",
  detailCacheDuration: 180,
  modules: [
    { title: "成人短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "duanju" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "成人漫剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "manju" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "真人剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "zhenrenju" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "成人视频", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "shipin" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "成人漫画", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "manhua" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "成人小说", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "xiaoshuo" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "热播榜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "paihang" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "标签榜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "biaoqian" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "NTR", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "biaoqian/ntr" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "反差", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "biaoqian/fancha" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "擦边", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "biaoqian/cabian" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { id: "loadResource", title: "播放资源", description: "播放时实时解析播放地址", functionName: "loadResource", type: "stream", cacheDuration: 0, params: [] }
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

var HOST = "https://91crdj.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
// 封面解密 Worker（用户已部署，与蜘蛛同一地址）
var IMG_PROXY = "https://bagua-img-proxy.li768435813.workers.dev";

function t(v) { return String(v == null ? "" : v).trim(); }

function proxyCover(url) {
  var u = t(url);
  if (!u || u.indexOf("http") !== 0) return u;
  return IMG_PROXY + "/img?url=" + encodeURIComponent(u);
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": referer || HOST + "/"
  };
}

async function fetchText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function isVideoFormat(url) {
  var low = String(url || "").toLowerCase();
  return [".m3u8", ".mp4", ".flv", ".ts"].some(function (k) { return low.indexOf(k) >= 0; });
}

// 与蜘蛛 parseList 相同的卡片解析（class 含 card 的 <a>）
function parseCards(html) {
  var items = [];
  if (!html) return items;
  var seen = {};
  var cardRe = /<a[^>]*\bclass\s*=\s*["'][^"']*\bcard\b[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = cardRe.exec(html))) {
    var tag = m[0];
    var block = m[1];
    var hm = tag.match(/href\s*=\s*["']([^"']+)["']/i);
    if (!hm) continue;
    var href = t(hm[1]);
    var p = href;
    try { p = new URL(href, HOST).pathname; } catch (e) {}
    var seg = p.split("/").filter(Boolean);
    if (seg.length < 2) continue;
    var vid = seg[1];
    if (seen[vid]) continue;

    var title = "";
    var attrs = ["data-track-item-name", "alt", "title"];
    for (var ai = 0; ai < attrs.length; ai++) {
      var tm = (tag + block).match(new RegExp(attrs[ai] + '\\s*=\\s*["\']([^"\']*)["\']', "i"));
      if (tm && t(tm[1])) { title = t(tm[1]); break; }
    }
    if (!title) {
      var tm2 = block.match(/<span[^>]*class="[^"]*p-title[^"]*"[^>]*>([\s\S]*?)<\/span>/);
      if (tm2) title = t(tm2[1].replace(/<[^>]+>/g, ""));
    }
    if (!title) title = vid;

    var cover = "";
    var lattrs = ["data-original", "data-src", "data-echo", "data-url"];
    for (var li = 0; li < lattrs.length; li++) {
      var im = block.match(new RegExp(lattrs[li] + '\\s*=\\s*["\']([^"\']+)["\']', "i"));
      if (im) { cover = t(im[1]); break; }
    }
    if (!cover) {
      var im2 = block.match(/<img[^>]*?(?<![\w-])src\s*=\s*["']([^"']+)["']/i);
      if (im2) cover = t(im2[1]);
    }
    var low = cover.toLowerCase();
    if (["data:", "load.gif", "loading.gif", "placeholder"].some(function (b) { return low.indexOf(b) >= 0; })) cover = "";
    if (cover.indexOf("//") === 0) cover = "https:" + cover;
    else if (cover.charAt(0) === "/") cover = HOST + cover;

    var remarks = "";
    var rm = block.match(/<span[^>]*class="[^"]*(?:badge|eps-flag)[^"]*"[^>]*>([\s\S]*?)<\/span>/);
    if (rm) remarks = t(rm[1].replace(/<[^>]+>/g, ""));

    seen[vid] = 1;
    var link = HOST + p;
    var pic = proxyCover(cover);
    items.push({
      id: link,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: remarks || "",
      mediaType: "movie"
    });
  }
  return items;
}

async function loadList(params) {
  params = params || {};
  var cat = String(params.cat || params.path || "duanju").replace(/^\/+/, "").replace(/\/+$/, "");
  var page = parseInt(params.page, 10) || 1;
  var url = page > 1 ? HOST + "/" + cat + "/page/" + page + "/" : HOST + "/" + cat + "/";
  try {
    var html = await fetchText(url, HOST + "/");
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
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
  var url = HOST + "/search/?q=" + encodeURIComponent(wd);
  if (page > 1) url += "&page=" + page;
  try {
    var html = await fetchText(url, HOST + "/");
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

// 与蜘蛛 detail 相同的分集提取：返回 [{name, url}]
function extractEpisodes(html, pagePath) {
  var playUrls = [];
  var seen = {};
  var basePath = String(pagePath || "").replace(/\/$/, "");
  var epRe = /href=["']([^"']+)["'][^>]*>\s*(\d+)\s*</g;
  var em;
  while ((em = epRe.exec(html))) {
    var href = t(em[1]);
    var epNo = t(em[2]);
    if (basePath && href.indexOf(basePath) >= 0) {
      if (href.charAt(0) === "/") href = HOST + href;
      if (seen[href]) continue;
      seen[href] = 1;
      playUrls.push({ name: "第" + epNo + "集", url: href });
    }
  }
  if (!playUrls.length) {
    var pmRe = /href=["']([^"']*(?:\/play\/|-\d+-\d+\.html)[^"']*)["']/g;
    while ((em = pmRe.exec(html))) {
      var h2 = t(em[1]);
      if (h2.charAt(0) === "/") h2 = HOST + h2;
      else if (h2.indexOf("http") !== 0) continue;
      if (seen[h2]) continue;
      seen[h2] = 1;
      playUrls.push({ name: "播放", url: h2 });
    }
    if (playUrls.length > 1) {
      playUrls.forEach(function (ep, i) { ep.name = "第" + (i + 1) + "集"; });
    } else if (playUrls.length === 1) {
      playUrls[0].name = "正片";
    }
  }
  return playUrls;
}

async function loadDetail(link) {
  var url = String(link || "");
  if (url.indexOf("http") !== 0) url = HOST + (url.charAt(0) === "/" ? url : "/" + url);
  var pagePath = url;
  try { pagePath = new URL(url).pathname; } catch (e) {}
  try {
    var html = await fetchText(url, HOST + "/");

    var title = "";
    var tm = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (tm) title = t(tm[1].replace(/<[^>]+>/g, ""));
    if (!title) {
      tm = html.match(/<title>([\s\S]*?)<\/title>/);
      if (tm) title = t(tm[1].split(/[-_|]/)[0]);
    }

    var pic = "";
    var lattrs = ["data-original", "data-src", "data-echo", "data-url"];
    for (var li = 0; li < lattrs.length; li++) {
      var pm = html.match(new RegExp(lattrs[li] + '\\s*=\\s*["\']([^"\']+\\.(?:jpg|jpeg|png|webp)[^"\']*)["\']', "i"));
      if (pm) { pic = t(pm[1]); break; }
    }
    if (!pic) {
      var pm2 = html.match(/<meta[^>]+og:image[^>]+content=["']([^"']+)["']/i);
      if (pm2) pic = t(pm2[1]);
    }
    if (pic.indexOf("//") === 0) pic = "https:" + pic;
    else if (pic.charAt(0) === "/") pic = HOST + pic;

    var intro = "";
    var pats = [
      /<meta[^>]+og:description[^>]+content=["']([^"']*)["']/i,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
    ];
    for (var pi = 0; pi < pats.length; pi++) {
      var im = html.match(pats[pi]);
      if (im && t(im[1])) { intro = t(im[1]); break; }
    }

    var eps = extractEpisodes(html, pagePath);
    var cover = proxyCover(pic);
    var desc = intro || "";
    if (eps.length) desc = ("共" + eps.length + "集" + (desc ? "\n" + desc : ""));

    var result = {
      id: url,
      type: "url",
      title: title || "91成人短剧",
      name: title || "91成人短剧",
      description: desc,
      mediaType: "movie",
      link: url,
      coverUrl: cover,
      posterPath: cover,
      backdropPath: cover,
      playerType: "app"
    };
    if (eps.length > 1) {
      var childItems = eps.map(function (ep, i) {
        return {
          id: ep.url,
          title: title + " " + ep.name,
          name: ep.name,
          mediaType: "movie",
          seasonNumber: 1,
          episodeNumber: i + 1,
          link: ep.url
        };
      });
      result.episodeItems = childItems;
      result.childItems = childItems;
      result.episodes = eps.map(function (ep) { return { name: ep.name, link: ep.url }; });
    }
    return result;
  } catch (e) {
    return { id: url, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// 与蜘蛛 play 相同的单页取流：current.src / player_aaaa / player_data / 裸 m3u8|mp4
function extractStreamFromPage(html) {
  if (!html) return "";
  var m3u8Url = "";
  var m = html.match(/"current"\s*:\s*\{[^{}]*"src"\s*:\s*"([^"]+)"/);
  if (m) m3u8Url = m[1].replace(/\\\//g, "/").replace(/\\u0026/g, "&");
  if (!m3u8Url) {
    var vars = ["player_aaaa", "player_data"];
    for (var vi = 0; vi < vars.length; vi++) {
      var vm = html.match(new RegExp(vars[vi] + "\\s*=\\s*(\\{[^;]*\\})"));
      if (vm) {
        try {
          var data = JSON.parse(vm[1]);
          m3u8Url = data.url || data.link || "";
          if (m3u8Url) break;
        } catch (e) {}
      }
    }
  }
  if (!m3u8Url) {
    var um = html.match(/(https?:\/\/[^\s"'<>\\]+?\.(?:m3u8|mp4)[^\s"'<>\\]*)/);
    if (um) m3u8Url = um[1];
  }
  if (m3u8Url) {
    if (m3u8Url.indexOf("//") === 0) m3u8Url = "https:" + m3u8Url;
    else if (m3u8Url.charAt(0) === "/") m3u8Url = HOST + m3u8Url;
  }
  return m3u8Url;
}

async function resolvePlayFromPage(pageUrl) {
  var html = await fetchText(pageUrl, HOST + "/");
  var direct = extractStreamFromPage(html);
  if (direct) return direct;
  // 详情页本身没播放器时，跟进第一条分集链接（单集作品）
  var pagePath = pageUrl;
  try { pagePath = new URL(pageUrl).pathname; } catch (e) {}
  var eps = extractEpisodes(html, pagePath);
  if (eps.length) {
    var html2 = await fetchText(eps[0].url, pageUrl);
    return extractStreamFromPage(html2);
  }
  return "";
}

async function loadResource(params) {
  params = params || {};
  var raw = String(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = String(params.item.link || params.item.id || "");
  if (!raw) return [];
  try {
    if (isVideoFormat(raw)) {
      return [{ name: "播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
    var url = await resolvePlayFromPage(raw);
    if (!url) return [];
    return [{ name: "播放", url: url, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": raw } }];
  } catch (e) {
    return [];
  }
}
