// Pornhub for REX (lai_pornhub v1.1.4)
// v1.1.4（2026-11-09）：一次性修好——直连双镜像仍被设备侧拦截时，改走 Cloudflare Worker 中转
//   （pornhub-fetch，边缘代取页面再返回；只取 HTML，不碰视频流，播放仍走站方直链）。
//   顺序：直连 cn -> 直连 www -> Worker(cn) -> Worker(www)，每步 looksReal 校验，全部失败回空串。
//   需用户部署一次 Worker（名字 pornhub-fetch，代码见 pornhub-fetch-worker.js），部署后重导即生效。
// 来源蓝图: mira-cat 蜘蛛 pornhub.js (py_pornhub), 只读移植, 未改动原蜘蛛。
// 后端: https://cn.pornhub.com, 列表/搜索页 li.videoBox 解析, 详情页 flashvars 的
//       mediaDefinitions 里取 format=hls 的 master.m3u8。
// 与蜘蛛的两点口径说明:
//   1) UA 沿用蜘蛛的 Windows Chrome UA —— 站方按 UA 返回不同版式, iPhone UA 返回的
//      移动版列表页没有 li.videoBox 结构 (实测), 桌面版式才可解析; 详情页两种 UA 都有 flashvars。
//   2) 蜘蛛取 hls 定义的最后一条, 实测顺序不按画质排列 (样本为 1080/240/480/720,
//      蜘蛛口径只拿到 720); 本模块按 height 取最高档, 落实"尽量最高画质"。

WidgetMetadata = {
  id: "lai_pornhub",
  title: "Pornhub",
  description: "Pornhub（cn.pornhub.com）：6 个排序 + 96 个内容分类（站方分类页全集，逐个实测第 1 页 34 张满卡），详情按 HLS 定义全档位出集、点集播对应档位，直连失败走 Worker 中转取页",
  author: "lai",
  version: "1.1.4",
  requiredVersion: "0.0.1",
  site: "https://cn.pornhub.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "视频",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "分类",
          type: "enumeration",
          value: "sy",
          enumOptions: [
            { title: "Home", value: "sy" },
            { title: "Newest", value: "cm" },
            { title: "Most Viewed", value: "mv" },
            { title: "Hottest", value: "ht" },
            { title: "Top Rated", value: "tr" },
            { title: "Longest", value: "lg" },
            { title: "女同", value: "c27" },
            { title: "辣妈", value: "c29" },
            { title: "爆菊", value: "c35" },
            { title: "3P", value: "c65" },
            { title: "熟女", value: "c28" },
            { title: "黑人女", value: "c17" },
            { title: "日本人", value: "c111" },
            { title: "老少欢", value: "c181" },
            { title: "巨乳", value: "c8" },
            { title: "公众野战", value: "c24" },
            { title: "卡通", value: "c86" },
            { title: "捆绑", value: "c10" },
            { title: "内射中出", value: "c15" },
            { title: "轮交", value: "c80" },
            { title: "巨屌", value: "c7" },
            { title: "手淫", value: "c22" },
            { title: "潮吹", value: "c69" },
            { title: "大号美女", value: "c6" },
            { title: "女性自慰", value: "c492" },
            { title: "Trans With Girl", value: "c572" },
            { title: "独家", value: "c115" },
            { title: "跨种族", value: "c25" },
            { title: "贫乳", value: "c59" },
            { title: "FFM", value: "c761" },
            { title: "60帧", value: "c105" },
            { title: "Cosplay", value: "c241" },
            { title: "乱交群欢", value: "c2" },
            { title: "亚洲人", value: "c1" },
            { title: "佩戴式阳具", value: "c542" },
            { title: "俄国人", value: "c99" },
            { title: "内嵌字幕", value: "c732" },
            { title: "劲爆重口味", value: "c21" },
            { title: "无码卡通", value: "c712" },
            { title: "印度人", value: "c101" },
            { title: "双性恋男", value: "c76" },
            { title: "双龙入洞", value: "c72" },
            { title: "口交", value: "c13" },
            { title: "古典派", value: "c43" },
            { title: "合集", value: "c57" },
            { title: "名人", value: "c12" },
            { title: "Scissoring", value: "c532" },
            { title: "女性高潮", value: "c502" },
            { title: "娇妻偷吃", value: "c242" },
            { title: "射精", value: "c16" },
            { title: "已认证情侣", value: "c482" },
            { title: "已认证模特", value: "c139" },
            { title: "已认证素人", value: "c138" },
            { title: "巴西人", value: "c102" },
            { title: "德国人", value: "c95" },
            { title: "性玩具", value: "c23" },
            { title: "恋物癖", value: "c18" },
            { title: "恋足", value: "c93" },
            { title: "意大利人", value: "c97" },
            { title: "手交", value: "c20" },
            { title: "抽烟", value: "c91" },
            { title: "拉丁裔美女", value: "c26" },
            { title: "拳交", value: "c19" },
            { title: "指交", value: "c592" },
            { title: "按摩", value: "c78" },
            { title: "捷克人", value: "c100" },
            { title: "搞笑", value: "c32" },
            { title: "撒尿", value: "c211" },
            { title: "播客", value: "c891" },
            { title: "校园", value: "c88" },
            { title: "欧洲人", value: "c55" },
            { title: "法国人", value: "c94" },
            { title: "浪漫", value: "c522" },
            { title: "深发女", value: "c11" },
            { title: "滑稽模仿", value: "c201" },
            { title: "火辣保姆", value: "c89" },
            { title: "片场直击", value: "c141" },
            { title: "男性自慰", value: "c92" },
            { title: "真人实拍", value: "c31" },
            { title: "第一视角", value: "c41" },
            { title: "粗暴性爱", value: "c67" },
            { title: "素人", value: "c3" },
            { title: "红毛", value: "c42" },
            { title: "纹身女", value: "c562" },
            { title: "继家庭幻想", value: "c444" },
            { title: "聚会", value: "c53" },
            { title: "肌肉男", value: "c512" },
            { title: "肥臀", value: "c4" },
            { title: "脱衣舞", value: "c33" },
            { title: "舔屄", value: "c131" },
            { title: "无码动漫", value: "c722" },
            { title: "英国人", value: "c96" },
            { title: "360°", value: "c612" },
            { title: "视频激情", value: "c61" },
            { title: "角色扮演", value: "c81" },
            { title: "试镜", value: "c90" },
            { title: "赌博", value: "c881" },
            { title: "金发女", value: "c9" },
            { title: "阿拉伯人", value: "c98" },
            { title: "集体颜射", value: "c14" },
            { title: "韩国人", value: "c103" },
            { title: "音乐", value: "c121" }
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

var BASE = "https://cn.pornhub.com";
var HOSTS = ["https://cn.pornhub.com", "https://www.pornhub.com"];
// 取页中转 Worker（用户部署，名字 pornhub-fetch）；直连被设备侧拦截时兜底，只取 HTML
var WORKER = "https://pornhub-fetch.li768435813.workers.dev";
// 沿用蜘蛛 UA (理由见文件头注释)
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
  };
}

function playHeaders() {
  return {
    "User-Agent": UA,
    "Origin": BASE,
    "Referer": BASE + "/"
  };
}

// 判断一页是不是真实内容页（拦截页/空页/验证页都没有这些标记），参照 mira-cat pornhub.js
function looksReal(html, need) {
  if (!html || html.length < 5000) return false;
  if (need === "list") return html.indexOf("videoBox") >= 0;
  if (need === "detail") return html.indexOf("mediaDefinitions") >= 0 || html.indexOf("videoUrl") >= 0;
  return true;
}

// 双镜像抓取：主镜像失败或返回非内容页时自动换备用镜像；直连全失败改走 Worker 中转；
// 全部失败回空串（不抛异常）。url 须是 BASE 开头的完整地址，need 为 "list" 或 "detail"
async function fetchText(url, need) {
  var path = String(url || "").replace(/^https?:\/\/[^\/]+/, "");
  if (path.charAt(0) !== "/") path = "/" + path;
  var i;
  for (i = 0; i < HOSTS.length; i++) {
    try {
      var res = await Widget.http.get(HOSTS[i] + path, { headers: pageHeaders() });
      var body = res && res.data != null ? String(res.data) : "";
      if (looksReal(body, need)) return body;
    } catch (_) {}
  }
  for (i = 0; i < HOSTS.length; i++) {
    try {
      var wres = await Widget.http.get(WORKER + "/?u=" + encodeURIComponent(HOSTS[i] + path), { headers: pageHeaders() });
      var wbody = wres && wres.data != null ? String(wres.data) : "";
      if (looksReal(wbody, need)) return wbody;
    } catch (_) {}
  }
  return "";
}

function absLink(href) {
  var s = String(href || "").split("#")[0];
  if (/^https?:\/\//i.test(s)) return s;
  if (s.charAt(0) === "/") return BASE + s;
  return BASE + "/" + s;
}

// 与蜘蛛 Rye/Oye 相同的选择器解析列表页；href/pic 兜底链参照 mira-cat pornhub.js
function parseList(html) {
  if (!html) return [{ id: "empty", type: "url", title: "空页面" }];
  var $ = Widget.html.load(html);
  var out = [];
  $("li.videoBox").each(function (i, el) {
    var $box = $(el);
    var href = $box.find(".phimage a.img").attr("href")
      || $box.find(".title a").attr("href")
      || $box.find('a[href*="view_video.php?viewkey="]').attr("href")
      || "";
    if (!href) return;
    var title = $box.find(".title a").attr("title")
      || $box.find(".title a").text().replace(/\s+/g, " ").trim()
      || $box.find(".phimage img").attr("alt")
      || "";
    var $img = $box.find(".phimage img").first();
    var pic = $img.attr("src")
      || $img.attr("data-mediumthumb")
      || $img.attr("data-image")
      || $img.attr("data-src")
      || $img.attr("data-thumb")
      || $img.attr("data-original")
      || "";
    if (pic && pic.indexOf("//") === 0) pic = "https:" + pic;
    // 无链接或无标题无封面的卡片点开必失败，直接丢弃，不让它进列表
    if (!href || (!title && !pic)) return;
    var views = $box.find(".views").text().replace(/\s+/g, " ").trim();
    var duration = $box.find(".duration").text().replace(/\s+/g, " ").trim();
    var link = absLink(href);
    var descParts = [];
    if (views) descParts.push(views);
    if (duration) descParts.push(duration);
    out.push({
      id: link,
      type: "url",
      title: title || link,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: descParts.join(" · "),
      releaseDate: duration || "",
      mediaType: "movie"
    });
  });
  return out.length ? out : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
}

async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var cat = String(params.path || "sy");
  // 与蜘蛛 Rye 相同的 URL 拼法; c<数字> 为站方内容分类 (/video?c=<id>, v1.1.0 新增)
  var url = BASE + "/video?";
  var catM = /^c(\d+)$/.exec(cat);
  if (catM) url = BASE + "/video?c=" + catM[1];
  else if (cat !== "sy") url = BASE + "/video?o=" + cat;
  if (page > 1) url += (cat === "sy" ? "page=" : "&page=") + page;
  try {
    var html = await fetchText(url, "list");
    return parseList(html);
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
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!keyword) return [{ id: "tip", type: "url", title: "输入关键词搜索" }];
  var url = BASE + "/video/search?search=" + encodeURIComponent(keyword) + "&page=" + page;
  try {
    var html = await fetchText(url, "list");
    return parseList(html);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// 详情播单三层提取，参照 mira-cat pornhub.js 的 extractMediaDefs：
// 第 1 层 flashvars 单行赋值正则；第 2 层全局 mediaDefinitions 数组花括号配平扫描
// （变量改名、多行排版也能捡回）；第 3 层全页扫描 hls videoUrl（连字段名变了也能捡回）。
function extractMediaDefs(html) {
  var m = html.match(/var flashvars_.* = \{(.*?)\};/);
  if (m && m[1]) {
    try {
      var fv = JSON.parse("{" + m[1] + "}");
      if (fv.mediaDefinitions && fv.mediaDefinitions.length) return fv.mediaDefinitions;
    } catch (_) {}
  }
  var idx = html.indexOf('"mediaDefinitions"');
  if (idx >= 0) {
    var arrStart = html.indexOf("[", idx);
    if (arrStart >= 0) {
      var depth = 0, inStr = false, esc = false, end = -1;
      for (var i = arrStart; i < html.length; i++) {
        var ch = html.charAt(i);
        if (inStr) {
          if (esc) esc = false;
          else if (ch === "\\") esc = true;
          else if (ch === '"') inStr = false;
          continue;
        }
        if (ch === '"') { inStr = true; continue; }
        if (ch === "[" || ch === "{") depth++;
        if (ch === "]" || ch === "}") { depth--; if (depth === 0) { end = i; break; } }
      }
      if (end > arrStart) {
        try {
          var arr = JSON.parse(html.slice(arrStart, end + 1));
          if (arr && arr.length) return arr;
        } catch (_) {}
      }
    }
  }
  var urls = [];
  var seen = {};
  var re = /"videoUrl"\s*:\s*"([^"]+)"/g;
  var mm;
  while ((mm = re.exec(html)) !== null) {
    var u = mm[1].replace(/\\\//g, "/");
    if (/\/hls\//.test(u) && /master\.m3u8/.test(u) && !seen[u]) {
      seen[u] = 1;
      urls.push({ quality: "", videoUrl: u });
    }
  }
  return urls;
}

async function loadDetail(link) {
  try {
    var url = absLink(link);
    var html = await fetchText(url, "detail");

    // 全部 hls 定义按 height 高→低出集（不只取最高档）
    var videoUrl = "";
    var quals = [];
    var defs = extractMediaDefs(html) || [];
    defs = defs.filter(function (d) { return d && d.format === "hls" && d.videoUrl; });
    var seenH = {};
    for (var i = 0; i < defs.length; i++) {
      var h = parseInt(defs[i].height || defs[i].quality, 10) || 0;
      if (!h || seenH[h]) continue;
      seenH[h] = 1;
      quals.push({ h: h, name: h + "p", url: defs[i].videoUrl });
    }
    quals.sort(function (a, b) { return b.h - a.h; });
    if (quals.length) videoUrl = quals[0].url;

    var title = "";
    var cover = "";
    try {
      var $ = Widget.html.load(html);
      title = $("h1.title").text().replace(/\s+/g, " ").trim() || $('meta[property="og:title"]').attr("content") || "";
      cover = $('meta[property="og:image"]').attr("content") || "";
    } catch (_) {}
    if (!title) {
      var tm = html.match(/<title[^>]*>([^<]+)/i);
      title = tm ? tm[1].replace(/\s*[|].*$/, "").trim() : "Pornhub";
    }

    if (!videoUrl) {
      return { id: url, type: "url", title: title || "解析失败", description: "未找到播放地址" };
    }
    var eps = [];
    var sEps = [];
    var items = [];
    for (var qi = 0; qi < quals.length; qi++) {
      eps.push({ name: quals[qi].name, link: quals[qi].url });
      sEps.push({ title: quals[qi].name, videoUrl: quals[qi].url, episodeNumber: qi + 1 });
      items.push({ id: quals[qi].url, type: "url", title: title + " " + quals[qi].name, name: quals[qi].name, mediaType: "movie", seasonNumber: 1, episodeNumber: qi + 1, videoUrl: quals[qi].url, link: quals[qi].url, posterPath: cover, coverUrl: cover });
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
      customHeaders: playHeaders(),
      episodes: eps,
      seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: sEps }],
      episodeItems: items,
      childItems: items
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// unwrapLink：App 可能把集对象直接传给 loadResource，String(对象) 得 "[object Object]"，
// 递归从对象/字符串/数组里抠出链接字符串，优先 videoUrl（集对象自带可播地址）。
function unwrapLink(v) {
  var depth = 0;
  while (v != null && depth < 6) {
    if (typeof v === "string") return t(v);
    if (typeof v !== "object") return "";
    if (Array.isArray(v)) { v = v.length ? v[0] : ""; depth++; continue; }
    if (typeof v.videoUrl === "string" && v.videoUrl) return t(v.videoUrl);
    if (typeof v.link === "string" && v.link) return t(v.link);
    if (typeof v.url === "string" && v.url) return t(v.url);
    if (typeof v.id === "string" && v.id) return t(v.id);
    if (v.item) { v = v.item; depth++; continue; }
    if (v.videoUrl) { v = v.videoUrl; depth++; continue; }
    if (v.link) { v = v.link; depth++; continue; }
    if (v.url) { v = v.url; depth++; continue; }
    if (v.id) { v = v.id; depth++; continue; }
    return "";
  }
  return "";
}

function t(v) {
  return String(v == null ? "" : v).trim();
}

// 分集 HLS 直链原样透传（mediaDefinitions 的 videoUrl 已是可播地址，不二次解析）
async function loadResource(params) {
  var raw = unwrapLink(params);
  if (!raw) return [];
  return [{ name: "播放", url: raw, playerType: "app", customHeaders: playHeaders() }];
}
