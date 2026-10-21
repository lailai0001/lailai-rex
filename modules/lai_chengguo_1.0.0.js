// 橙果短剧 for REX (lai_chengguo v1.0.0)
// 移植自 mira-cat 蜘蛛 chengguo.js（py_chengguo，只读蓝图，逻辑等价移植；
// 该蜘蛛本身由 REX forward.chengguo 转换而来，本次转回 REX 格式）。
// 后端：https://chengguodj.com（Nuxt SSR，列表/详情数据在 __NUXT_DATA__ 里）。
// 多集短剧：loadDetail 返回分集，播放由 stream 模块 loadResource 实时抓播放页解析 m3u8。
// 注：蜘蛛的「首页推荐(home)」「排行榜(rank)」两个分类，线上站点现已 404（与猫源行为一致，进站为空）。

WidgetMetadata = {
  id: "lai_chengguo",
  title: "橙果短剧",
  description: "橙果短剧（chengguodj.com）：原创/魔改/漫剧/真人/AI 短剧，多集实时解析播放",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://chengguodj.com",
  detailCacheDuration: 180,
  modules: [
    { title: "原创短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "yuanchuang" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "魔改短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "mogai" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "漫剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "manju" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "真人短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "zhenren" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "AI短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "aiduanju" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "片库索引", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "browse" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "排行榜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "rank" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "首页推荐", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { id: "loadResource", title: "橙果播放源", description: "播放时实时解析播放地址", functionName: "loadResource", type: "stream", cacheDuration: 0, params: [] }
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

var CG_SITE = "https://chengguodj.com";
var CG_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function cgT(v) {
  return String(v == null ? "" : v).trim();
}

function cgAbsUrl(u) {
  u = cgT(u).replace(/\\u002[fF]/g, "/").replace(/\\\//g, "/").replace(/\\/g, "");
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.indexOf("http") === 0) return u;
  if (u.charAt(0) === "/") return CG_SITE + u;
  return CG_SITE + "/" + u;
}

// 纯 JS base64url 编码（UTF-8），替代蜘蛛里的 Node Buffer
function cgB64UrlEncode(str) {
  var bytes = [];
  var s = String(str);
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    if (c < 0x80) bytes.push(c);
    else if (c < 0x800) { bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f)); }
    else if (c >= 0xd800 && c <= 0xdbff && i + 1 < s.length) {
      var c2 = s.charCodeAt(++i);
      var cp = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
      bytes.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
    } else { bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f)); }
  }
  var tbl = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var out = "";
  for (var j = 0; j < bytes.length; j += 3) {
    var b0 = bytes[j], b1 = j + 1 < bytes.length ? bytes[j + 1] : 0, b2 = j + 2 < bytes.length ? bytes[j + 2] : 0;
    out += tbl.charAt(b0 >> 2);
    out += tbl.charAt(((b0 & 3) << 4) | (b1 >> 4));
    if (j + 1 < bytes.length) out += tbl.charAt(((b1 & 15) << 2) | (b2 >> 6));
    if (j + 2 < bytes.length) out += tbl.charAt(b2 & 63);
  }
  return out.replace(/\+/g, "-").replace(/\//g, "_");
}

// 封面走站方 /_img/ 代理出图（蜘蛛 proxyImg 同口径）
function cgProxyImg(raw) {
  raw = cgAbsUrl(raw);
  if (!raw) return "";
  if (raw.indexOf(CG_SITE + "/_img/") === 0) return raw;
  try {
    return CG_SITE + "/_img/" + cgB64UrlEncode(raw);
  } catch (e) {
    return raw;
  }
}

async function cgFetchHtml(url) {
  var res = await Widget.http.get(url, {
    headers: {
      "User-Agent": CG_UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9",
      "Referer": CG_SITE + "/"
    },
    timeout: 20000
  });
  return res && res.data != null ? String(res.data) : "";
}

function cgParseNuxtArr(html) {
  var m = String(html || "").match(/<script[^>]+id=["']__NUXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!m) return null;
  try { return JSON.parse(cgT(m[1])); } catch (e) { return null; }
}

function cgNuxtVal(arr, idx) {
  if (typeof idx === "number" && idx >= 0 && idx < arr.length) return arr[idx];
  return idx;
}

// 与蜘蛛 extractList 同一逻辑，产出 REX 卡片
function cgExtractCards(html) {
  var arr = cgParseNuxtArr(html);
  if (!arr || !arr.length) return [];
  var items = [];
  var seen = {};
  for (var n = 0; n < arr.length; n++) {
    var item = arr[n];
    if (!item || typeof item !== "object") continue;
    if (!("title" in item)) continue;
    if (!("slug" in item) && !("detail_route" in item)) continue;
    var title = cgNuxtVal(arr, item.title);
    if (!title || typeof title !== "string") continue;
    title = cgT(title);
    if (!title) continue;
    var dramaPath = cgNuxtVal(arr, item.detail_route);
    if (!dramaPath || typeof dramaPath !== "string") {
      var slug = cgNuxtVal(arr, item.slug);
      if (slug && typeof slug === "string") dramaPath = "/drama/" + slug;
    }
    if (!dramaPath || typeof dramaPath !== "string") continue;
    dramaPath = cgT(dramaPath);
    if (seen[dramaPath]) continue;
    seen[dramaPath] = 1;
    var pic = "";
    var coverObj = cgNuxtVal(arr, item.cover);
    if (coverObj && typeof coverObj === "object") {
      var rawU = cgNuxtVal(arr, coverObj.url);
      if (rawU && typeof rawU === "string") pic = rawU;
    }
    var eps = cgNuxtVal(arr, item.total_episode_count) || cgNuxtVal(arr, item.published_episode_count);
    var remarks = (typeof eps === "number" && eps) ? "全" + eps + "集" : "";
    var img = cgProxyImg(pic);
    var link = CG_SITE + dramaPath;
    items.push({
      id: link,
      type: "url",
      title: title,
      posterPath: img,
      coverUrl: img,
      backdropPath: img,
      link: link,
      description: remarks,
      mediaType: "movie"
    });
  }
  return items;
}

function cgCatUrl(tid, page) {
  page = parseInt(page, 10) || 1;
  if (page <= 1) return CG_SITE + "/" + tid;
  return CG_SITE + "/" + tid + "/page-" + page;
}

async function loadList(params) {
  params = params || {};
  var cat = String(params.cat == null ? "yuanchuang" : params.cat);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var html = await cgFetchHtml(cgCatUrl(cat, page));
    return cgExtractCards(html);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg }];
  }
}

function cgKeyword(params) {
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
  var kw = cgKeyword(params);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!kw) return [];
  var url = CG_SITE + "/search?keyword=" + encodeURIComponent(kw) + (page > 1 ? "&page=" + page : "");
  try {
    var html = await cgFetchHtml(url);
    return cgExtractCards(html);
  } catch (e) {
    return [];
  }
}

// 抓详情页，解析 { title, cover, episodes: [{name, path}] }（蜘蛛 detail 逻辑）
async function cgFetchDetail(dramaPath) {
  var detailUrl = cgAbsUrl(dramaPath);
  var html = await cgFetchHtml(detailUrl);
  var title = "";
  var tm = html.match(/<title>([^<]+)<\/title>/i);
  if (tm) title = cgT(tm[1].split("-")[0]).replace(/在线观看/g, "").trim();
  if (!title) title = dramaPath;
  var cover = "";
  var slug = dramaPath.replace(/\/+$/, "").split("/").pop();
  var episodes = [];
  var arr = cgParseNuxtArr(html);
  if (arr) {
    for (var n = 0; n < arr.length; n++) {
      var item = arr[n];
      if (!item || typeof item !== "object") continue;
      // 顺带从详情数据里补封面（og:image 缺失时）
      if (!cover && ("slug" in item || "detail_route" in item)) {
        var itSlug = cgNuxtVal(arr, item.slug);
        var itRoute = cgNuxtVal(arr, item.detail_route);
        if (itSlug === slug || (typeof itRoute === "string" && itRoute.indexOf(slug) >= 0)) {
          var cObj = cgNuxtVal(arr, item.cover);
          if (cObj && typeof cObj === "object") {
            var rawU2 = cgNuxtVal(arr, cObj.url);
            if (rawU2 && typeof rawU2 === "string") cover = rawU2;
          }
        }
      }
      if (!("total_episode_count" in item)) continue;
      var tot = cgNuxtVal(arr, item.total_episode_count);
      if (typeof tot === "number" && tot > 0) {
        episodes = [];
        for (var ep = 1; ep <= tot; ep++) {
          episodes.push({ name: "第" + ep + "集", path: "/play/" + slug + "/" + ep });
        }
        break;
      }
    }
  }
  if (!cover) {
    // NUXT 数据里没拿到封面时才用 og:image 兜底（可能为站点默认图）
    var ogm = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
              html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogm) cover = ogm[1];
  }
  if (!episodes.length) {
    var links = html.match(/href=["'](\/play\/[^"']+)["']/gi) || [];
    var seen2 = {};
    for (var k = 0; k < links.length; k++) {
      var hm = links[k].match(/href=["'](\/play\/[^"']+)["']/i);
      if (!hm || seen2[hm[1]]) continue;
      seen2[hm[1]] = 1;
      var num = hm[1].split("/").pop();
      episodes.push({ name: /^\d+$/.test(num) ? "第" + num + "集" : num, path: hm[1] });
    }
  }
  return { title: title, cover: cover, episodes: episodes };
}

// 从链接里拆出剧路径：完整 URL / cg: 前缀 / 裸路径都认
function cgDramaPathOf(link) {
  var v = String(link || "");
  v = v.replace(/^cg:/, "");
  if (v.indexOf(CG_SITE) === 0) v = v.slice(CG_SITE.length);
  var m = v.match(/\/drama\/[^\/?#]+/);
  if (m) return m[0];
  return v;
}

async function loadDetail(link) {
  var dramaPath = cgDramaPathOf(link);
  if (!dramaPath) {
    return { id: String(link || ""), type: "url", title: "参数错误", link: String(link || "") };
  }
  try {
    var d = await cgFetchDetail(dramaPath);
    var img = cgProxyImg(d.cover);
    var episodes = d.episodes.map(function (ep) {
      return { name: ep.name, link: CG_SITE + ep.path };
    });
    return {
      id: String(link || ""),
      type: "url",
      title: d.title,
      posterPath: img,
      coverUrl: img,
      backdropPath: img,
      description: episodes.length ? "全" + episodes.length + "集" : "",
      episodes: episodes,
      link: String(link || "")
    };
  } catch (e) {
    return { id: String(link || ""), type: "url", title: "加载失败", description: String((e && e.message) || e), link: String(link || "") };
  }
}

// 蜘蛛 resolvePlay：抓播放页，从 __NUXT_DATA__ 或页面正则里找 m3u8
async function cgResolvePlay(playPath) {
  var url = cgAbsUrl(playPath);
  var html = await cgFetchHtml(url);
  var arr = cgParseNuxtArr(html);
  if (arr) {
    for (var n = 0; n < arr.length; n++) {
      var v = arr[n];
      if (typeof v === "string" && v.indexOf(".m3u8") >= 0 && v.indexOf("http") === 0) {
        return v.replace(/\\u002[fF]/g, "/").replace(/\\\//g, "/");
      }
    }
  }
  var m = html.match(/["'](https?:\/\/[^"'\s<>\\]+\.m3u8[^"'\s<>\\]*)["']/i);
  if (m) return m[1].replace(/\\u002[fF]/g, "/").replace(/\\\//g, "/");
  return "";
}

function cgPlayHeaders() {
  return { "User-Agent": CG_UA, "Referer": CG_SITE + "/" };
}

// 播放源解析（stream 模块）：
// - 传入单集播放页链接时只解析该集
// - 传入剧链接时逐集解析（连续 3 集失败就停，避免无谓请求）
async function loadResource(params) {
  params = params || {};
  var raw = String(params.link || params.url || params.id || "");
  try {
    if (raw.indexOf("/play/") >= 0) {
      var one = await cgResolvePlay(raw);
      if (!one) return [];
      return [{ name: "播放", url: one, playerType: "app", customHeaders: cgPlayHeaders() }];
    }
    var dramaPath = cgDramaPathOf(raw);
    if (!dramaPath) return [];
    var d = await cgFetchDetail(dramaPath);
    var out = [];
    var misses = 0;
    for (var i = 0; i < d.episodes.length; i++) {
      var ep = d.episodes[i];
      var url = await cgResolvePlay(ep.path);
      if (!url) {
        misses++;
        if (misses >= 3) break;
        continue;
      }
      misses = 0;
      out.push({
        name: ep.name,
        description: d.title,
        url: url,
        playerType: "app",
        customHeaders: cgPlayHeaders()
      });
    }
    return out;
  } catch (e) {
    return [];
  }
}
