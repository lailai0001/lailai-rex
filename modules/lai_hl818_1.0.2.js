// 818黑料网 for REX (lai_hl818 v1.0.2)
// 移植自 mira-cat 蜘蛛 hl818.js（py_818hl），后端：https://818hlw1.com/
// （站方自报永久地址，实测直出 30 篇、无跳转；旧 cell 域已废弃）。
// 列表：首页/分类页解析 <article> 卡片（蜘蛛 parseArticles 同一套正则）；
// 封面按域路由：pic.*.cn 走 51chigua 解密，其余走 bagua（与蜘蛛一致）。
// 详情：dplayer 的 data-config 里 video.url 为带 auth_key 的签名 m3u8，实时解析。
// 注意：实测现行页面 data-config 是双引号 + &quot; 实体形态（蜘蛛只认单引号形态），
// 本模块两种形态都认（先按蜘蛛单引号原法，再按双引号实体形态兜底），逻辑等价、覆盖面更全。
// v1.0.2 同步修复 (2026-11-01, 对照猫源 /hl 中转腿): App 内直连 818hlw1.com
// 被拦时首页拿不到、旧版直接报错; 现取数直连优先、直连空时走 javsb-relay
// 的 /hl 代取 (与猫源 getText 顺序一致, 白名单仅 818hlw1.com, 只转文字页);
// 分类以猫源首页解析为准 (2026-11-01 经 /hl 实测首页解析出 12 分类,
// 与本模块 modules[] 的 12 分类逐一核对一致, 无改动)。

WidgetMetadata = {
  id: "lai_hl818",
  title: "818黑料网",
  description: "818黑料网（818hlw1.com）：今日吃瓜/热门大瓜/每日大赛/反差网黄等 12 个分类，封面走解密代理，播放为签名 m3u8 实时解析，直连被拦时走 javsb-relay 中转",
  author: "lai",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  site: "https://818hlw1.com/",
  detailCacheDuration: 180,
  modules: [
    { title: "最新更新", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "今日吃瓜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/jrcg/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "热门大瓜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/rmdg/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "每日大赛", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/mrds/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "反差网黄", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/fcwh/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "家庭乱伦", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/jtll/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "撸管必备", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/lgbb/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "猎奇大赏", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/lqds/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "偷拍泄露", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/gytg/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "AI短剧", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/aidj/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "学生校园", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/xsxy/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "明星黑料", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/mxhl/" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "海外吃瓜", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "category/hwcg/" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
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

var BASE = "https://818hlw1.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
// 2026-11-01 中转腿 (与猫源一致): 直取为空时走 javsb-relay 的 /hl 代取。
var RELAY_HL = "https://javsb-relay-production.up.railway.app/hl?url=";
var IMG_PROXY = "https://bagua-img-proxy.li768435813.workers.dev/img?url=";
var IMG_PROXY_51 = "https://51chigua.li768435813.workers.dev/img?url=";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": BASE + "/",
    "Origin": BASE
  };
}

// 内容校验（猫源定稿修法照搬）：真页必须同时含站名“818黑料网”+ 站内链接
// （/category/ 或 /archives/）；App 内直取若返回非空拦截页（WAF 挑战页，无标记）
// 绝不能当真页解析，必须换中转腿；中转也不真则返回空、回落分支如实为空。
function isRealPage(html) {
  var s = String(html || "");
  if (!s) return false;
  if (s.indexOf("818黑料网") < 0) return false;
  return s.indexOf("/category/") >= 0 || s.indexOf("/archives/") >= 0;
}

// 取数 (与猫源 getText 顺序一致): 直连优先, 直连空/异常/拦截页时走 /hl 中转腿;
// 两腿皆不真才抛错 (调用方统一转错误卡, loadDetail 转 url 兜底, 绝不抛错出模块)。
async function fetchText(url) {
  try {
    var res = await Widget.http.get(url, { headers: pageHeaders() });
    var body = res && res.data != null ? String(res.data) : "";
    if (isRealPage(body)) return body;
  } catch (e) {}
  try {
    var rres = await Widget.http.get(RELAY_HL + encodeURIComponent(url));
    var rbody = rres && rres.data != null ? String(rres.data) : "";
    if (isRealPage(rbody)) return rbody;
  } catch (e) {}
  throw new Error("空回应");
}

function clean(s) {
  return String(s == null ? "" : s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function absUrl(u) {
  var s = String(u || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.indexOf("//") === 0) return "https:" + s;
  return BASE + (s.charAt(0) === "/" ? s : "/" + s);
}

// 封面按域路由（与 mira-cat 蜘蛛同款）：pic.*.cn 图床走 51chigua 解密，其余走 bagua
function proxyCover(url) {
  var s = String(url || "").trim();
  if (!s) return "";
  if (s.indexOf("data:") === 0) return s;
  if (s.indexOf("bagua-img-proxy") >= 0) return s;
  if (s.indexOf("51chigua") >= 0) return s;
  if (/\/\/pic\.[^/]*\.cn\//i.test(s)) return IMG_PROXY_51 + encodeURIComponent(s);
  return IMG_PROXY + encodeURIComponent(s);
}

// 与蜘蛛 imgOf 一致：优先 z-image-loader-url，其次 blog-background 图，再次任意图片直链
function imgOf(html) {
  var c = String(html || "").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
  var m = c.match(/z-image-loader-url\s*=\s*"([^"]+)"/i);
  if (m && /^https?:\/\//i.test(m[1])) return m[1];
  m = c.match(/<img[^>]*class="[^"]*blog-background[^"]*"[^>]*>/i);
  if (m) {
    var sm = m[0].match(/(?:z-image-loader-url|data-src|src)\s*=\s*"([^"]+)"/i);
    if (sm && /^https?:\/\//i.test(sm[1]) && !/data:image/i.test(sm[1])) return sm[1];
  }
  m = c.match(/https?:\/\/[^"'\s)]+\.(?:jpg|png|jpeg|webp)/i);
  if (m) return m[0];
  m = c.match(/url\s*\(\s*['"]?([^"'\)]+)['"]?\s*\)/i);
  if (m) {
    var u = m[1].trim();
    if (/^https?:\/\//i.test(u)) return u;
  }
  return "";
}

// 与蜘蛛 parseArticles 同一套解析：<article> 块内优先 /archives/ 链接
// (旧版取块内首个 <a>, 可能取到非文章链接)、h2/entry-title/post-title 标题
function parseArticles(html) {
  var out = [];
  var seen = {};
  var re = /<article[\s\S]{0,8000}?<\/article>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var blk = m[0];
    var href = "";
    var lre = /<a[^>]*href="([^"]+)"[^>]*>/gi;
    var lm;
    var firstHref = "";
    while ((lm = lre.exec(blk)) !== null) {
      if (!firstHref) firstHref = lm[1];
      if (lm[1].indexOf("/archives/") >= 0) { href = lm[1]; break; }
    }
    if (!href) href = firstHref;
    if (!href) continue;
    href = href.trim();
    if (!href || href === "#" || seen[href]) continue;
    seen[href] = true;
    var t = blk.match(/<h2[^>]*>([^<]{2,120})<\/h2>/i)
      || blk.match(/class="entry-title"[^>]*>([^<]{2,120})/i)
      || blk.match(/class="post-title"[^>]*>([^<]{2,120})/i);
    var title = t ? clean(t[1]) : "";
    if (!title) continue;
    var tm = blk.match(/<time[^>]*>([^<]{2,40})<\/time>/i);
    var link = absUrl(href);
    var cover = proxyCover(imgOf(blk));
    out.push({
      id: link,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: link,
      description: title,
      releaseDate: tm ? tm[1].trim() : "",
      mediaType: "movie"
    });
    if (out.length >= 60) break;
  }
  // 兜底 (与蜘蛛一致): article 块未产出时, 直接扫 /archives/ 链接 + 就近 h2 标题。
  if (!out.length) {
    var are = /<a[^>]*href="([^"]*\/archives\/[^"]+)"[^>]*>/gi;
    while ((m = are.exec(html)) !== null) {
      var href2 = m[1].trim();
      if (!href2 || href2 === "#" || seen[href2]) continue;
      var rest = html.slice(m.index, m.index + 3000);
      var hm2 = rest.match(/<h2[^>]*>([\s\S]{0,300}?)<\/h2>/i);
      var title2 = hm2 ? clean(hm2[1]) : "";
      if (!title2 || title2.length < 2) continue;
      seen[href2] = true;
      var link2 = absUrl(href2);
      var cover2 = proxyCover(imgOf(rest));
      out.push({
        id: link2,
        type: "url",
        title: title2,
        posterPath: cover2,
        coverUrl: cover2,
        backdropPath: cover2,
        link: link2,
        description: title2,
        releaseDate: "",
        mediaType: "movie"
      });
      if (out.length >= 60) break;
    }
  }
  return out;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var path = String(params.path || "").replace(/^\/+/, "");
  var base = BASE + "/" + path;
  var url;
  if (!path) {
    // 首页：第一页为站点根，翻页走 WP 的 /page/{N}/
    url = page > 1 ? BASE + "/page/" + page + "/" : BASE + "/";
  } else {
    url = page > 1 ? base + page + "/" : base;
  }
  try {
    var html = await fetchText(url);
    var list = parseArticles(html);
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
  if (!wd) {
    return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  }
  var url = BASE + "/search/" + encodeURIComponent(wd) + "/" + (page > 1 ? page + "/" : "");
  try {
    var html = await fetchText(url);
    var list = parseArticles(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// 从详情页提取全部 dplayer 播放地址（顺序与页面一致）：
// 先按蜘蛛原法认单引号 data-config，再认现行页面的双引号 + &quot; 实体形态
function extractStreams(html) {
  var urls = [];
  var m;
  var dre = /class="dplayer"[^>]*data-config='([^']+)'/gi;
  while ((m = dre.exec(html)) !== null) {
    try {
      var cfg = JSON.parse(m[1]);
      var vu = cfg && cfg.video && cfg.video.url ? String(cfg.video.url) : "";
      if (vu) urls.push(vu);
    } catch (e) {}
  }
  if (!urls.length) {
    var dre2 = /data-config="([^"]+)"/gi;
    while ((m = dre2.exec(html)) !== null) {
      try {
        var raw = m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&");
        var cfg2 = JSON.parse(raw);
        var vu2 = cfg2 && cfg2.video && cfg2.video.url ? String(cfg2.video.url) : "";
        if (vu2) urls.push(vu2);
      } catch (e) {}
    }
  }
  return urls;
}

async function loadDetail(link) {
  try {
    var url = absUrl(String(link || ""));
    var html = await fetchText(url);

    var hm = html.match(/<h1[^>]*>([^<]{2,120})<\/h1>/i);
    var title = hm ? clean(hm[1]) : "818黑料网";
    var cover = proxyCover(imgOf(html));

    var streams = extractStreams(html);
    var videoUrl = streams.length ? streams[0] : "";
    if (!videoUrl) {
      // 与蜘蛛一致的兜底：观看类链接里若有直链视频文件才可用，其余如实报错
      var lre = /<a[^>]*href="([^"]+)"[^>]*>([^<]*(?:点击观看|观看|播放|视频|第一弹|第二弹|第三弹)[^<]*)<\/a>/gi;
      var lm;
      while ((lm = lre.exec(html)) !== null) {
        var href = absUrl(lm[1].trim());
        if (/\.(m3u8|mp4)(\?|$)/i.test(href)) { videoUrl = href; break; }
      }
    }
    if (!videoUrl) {
      return { id: url, type: "url", title: title, description: "未找到播放地址" };
    }

    return {
      id: url,
      type: "detail",
      title: title,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE + "/",
        "Origin": BASE
      }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
