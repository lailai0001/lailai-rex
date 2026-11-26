// Pornhub for REX (lai_pornhub v1.1.11)
// v1.1.12（AVDB 样式详情）：详情页演员/分类建成 peoples/genreItems（/pornstar/、/model/、/video?c=、标签搜索）+ 点按路由。
// v1.1.13（2026-11-25 真站页核实重做）：① 1.1.12 的 extractTaxonomy 扫全页 <a>，把“热门
//   演员下拉菜单”、相关视频上传者、页脚分类全当成该片的演员/分类（假数据）；改只取详情页
//   三个专属区块：pornstarsWrapper（该片演员，带头像）、categoriesWrapper（该片分类，
//   /video?c=N）、tagsWrapper（该片标签，/video/search?search=）。两部真片（同性 c58 与
//   直片 c65）三区块结构一致。② 点按走 HTML 直取：演员页 /pornstar/<slug>/（34 卡，
//   官方认证页）；分类 /video?c=N 与标签搜索走 HTML 列表——webmasters API 的 category
//   参数与站方 c= 编号根本对不上（category=65 回 "Category does not exist!"），
//   API 的 pornstar= 参数会被直接忽略（回默认最新列表），两者都不能用于点按。
//   ③ genreItems 补 link；④ 全覆盖派发：loadList 接 peopleId/genreId/url/link，
//   loadDetail 接裸名（先试 /pornstar/<名>/，再走标签搜索）。
// v1.1.11（2026-11-09）：用户确认可播后要求加分类；对照站方 webmasters /categories
//   官方清单（243 个），补 7 个热门缺失分类：H漫 c36、女优 c30、深喉 c1311、美女 c5、
//   高清 c38、VR c104、少女 c37。ID 均取自官方清单。
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
  description: "Pornhub（cn.pornhub.com）：6 个排序 + 96 个内容分类，列表走站方 JSON API（SPA 壳不再影响），详情按 HLS 定义全档位出集、点集播对应档位",
  author: "lai",
  version: "1.1.14",
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
            { title: "音乐", value: "c121" },
            { title: "H漫", value: "c36" },
            { title: "女优", value: "c30" },
            { title: "深喉", value: "c1311" },
            { title: "美女", value: "c5" },
            { title: "高清", value: "c38" },
            { title: "VR", value: "c104" },
            { title: "少女", value: "c37" },
            { title: "互动", value: "c108" },
            { title: "变性人", value: "c83" },
            { title: "变性男", value: "c602" },
            { title: "口述影像", value: "c231" },
            { title: "FMM", value: "c771" },
            { title: "180°视频", value: "c622" },
            { title: "2D", value: "c632" },
            { title: "3D", value: "c642" }
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
// 封面代理（2026-11-26 实测根因）：站方封面 CDN pix-cdn77.phncdn.com 要求 Referer，
// 无 Referer 直接 403；App 拉封面不带 Referer，致大量封面加载不出。
// pornhub-fetch Worker v2 已放行 *.phncdn.com 并代取时补 Referer，
// 封面一律走 Worker 代理；非 phncdn 的图直出。
function proxyCover(u) {
  var s = String(u || "");
  if (!s) return s;
  if (/^https:\/\/[a-z0-9-]+\.phncdn\.com\//i.test(s)) {
    return WORKER + "/?u=" + encodeURIComponent(s);
  }
  return s;
}
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

// 设备端诊断：记录最近一次取页的四路结果（直连 cn/www、Worker cn/www）
var DIAG = [];

function diagReset() { DIAG = []; }

function diagAdd(label, ok, len, real) {
  DIAG.push(label + ":" + (ok ? "通" : "不通") + " len=" + len + " real=" + (real ? "是" : "否"));
}

function diagText() { return DIAG.join(" | "); }

// 双镜像抓取：主镜像失败或返回非内容页时自动换备用镜像；直连全失败改走 Worker 中转；
// 每路最多重试 3 次（站方间歇出 Blazor 空壳，单次命中率不足）；全部失败回空串（不抛异常）。
// url 须是 BASE 开头的完整地址，need 为 "list" 或 "detail"
async function fetchText(url, need) {
  var path = String(url || "").replace(/^https?:\/\/[^\/]+/, "");
  if (path.charAt(0) !== "/") path = "/" + path;
  var i, t;
  for (i = 0; i < HOSTS.length; i++) {
    var label = (i === 0 ? "直连cn" : "直连www");
    for (t = 0; t < 3; t++) {
      try {
        var res = await Widget.http.get(HOSTS[i] + path, { headers: pageHeaders() });
        var body = res && res.data != null ? String(res.data) : "";
        var real = looksReal(body, need);
        diagAdd(label, true, body.length, real);
        if (real) return body;
      } catch (e) {
        diagAdd(label, false, 0, false);
      }
    }
  }
  for (i = 0; i < HOSTS.length; i++) {
    var wlabel = (i === 0 ? "Worker-cn" : "Worker-www");
    for (t = 0; t < 3; t++) {
      try {
        var wres = await Widget.http.get(WORKER + "/?u=" + encodeURIComponent(HOSTS[i] + path), { headers: pageHeaders() });
        var wbody = wres && wres.data != null ? String(wres.data) : "";
        var wreal = looksReal(wbody, need);
        diagAdd(wlabel, true, wbody.length, wreal);
        if (wreal) return wbody;
      } catch (e) {
        diagAdd(wlabel, false, 0, false);
      }
    }
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
    var cover = proxyCover(pic);
    out.push({
      id: link,
      type: "url",
      title: title || link,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: link,
      description: descParts.join(" · "),
      releaseDate: duration || "",
      mediaType: "movie"
    });
  });
  return out.length ? out : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
}

// 站方 webmasters JSON API（列表/搜索走它，不受 Blazor SPA 壳影响）
var API_BASE = "https://www.pornhub.com/webmasters/search";

function apiOrdering(cat) {
  if (cat === "cm") return "newest";
  if (cat === "mv" || cat === "ht") return "mostviewed";
  if (cat === "tr") return "toprated";
  if (cat === "lg") return "longest";
  return "";
}

function apiListUrl(cat, page, keyword) {
  var u = API_BASE + "?search=" + encodeURIComponent(keyword || "") + "&page=" + page;
  var ord = apiOrdering(cat);
  if (ord) u += "&ordering=" + ord;
  var catM = /^c(\d+)$/.exec(cat || "");
  if (catM) u += "&category=" + catM[1];
  return u;
}

// 取 API JSON：直连 www.pornhub.com，失败走 pornhub-fetch Worker；都失败回 null
async function fetchApiJson(apiUrl) {
  var urls = [apiUrl, WORKER + "/?u=" + encodeURIComponent(apiUrl)];
  for (var i = 0; i < urls.length; i++) {
    try {
      var res = await Widget.http.get(urls[i], { headers: pageHeaders() });
      var raw = res && res.data != null ? res.data : "";
      var j = (typeof raw === "object") ? raw : JSON.parse(String(raw));
      if (j && j.videos && j.videos.length) return j;
      diagAdd(i === 0 ? "API直连" : "API-Worker", true, String(raw).length, !!(j && j.videos && j.videos.length));
    } catch (e) {
      diagAdd(i === 0 ? "API直连" : "API-Worker", false, 0, false);
    }
  }
  return null;
}

function parseApiList(j) {
  var out = [];
  var vs = (j && j.videos) || [];
  for (var i = 0; i < vs.length; i++) {
    var v = vs[i] || {};
    var link = String(v.url || "");
    if (!link) continue;
    if (link.indexOf("http") !== 0) link = "https://www.pornhub.com" + link;
    var title = String(v.title || link);
    var pic = String(v.default_thumb || "");
    var descParts = [];
    if (v.views) descParts.push(String(v.views) + "次观看");
    if (v.duration) descParts.push(String(v.duration));
    var cover = proxyCover(pic);
    out.push({
      id: link,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: link,
      description: descParts.join(" · "),
      releaseDate: String(v.duration || ""),
      mediaType: "movie"
    });
  }
  return out;
}

// 从 loadList 入参里抠点按目标（peopleId/genreId/url/link）：演员 -> 演员页 HTML，
// 分类 c<N> -> /video?c=N HTML（API 的 category 编号与站方 c= 对不上，不能走 API），
// 标签 -> /video/search?search= HTML（中文标签走 API 也无结果）。回 null 则走原有路由。
function taxListTarget(params) {
  params = params || {};
  var keys = ["peopleId", "genreId", "url", "link"];
  for (var i = 0; i < keys.length; i++) {
    var v = t(params[keys[i]] || "");
    if (!v) continue;
    var pm = v.match(/\/(pornstar|model)\/([^/?#]+)/i);
    if (pm) return { kind: "pornstar", slug: pm[2] };
    var cm = v.match(/\/(gay\/)?video\?c=(\d+)/i);
    if (cm) return { kind: "category", path: (cm[1] ? "/gay/video?c=" + cm[2] : "/video?c=" + cm[2]) };
    var sm = v.match(/\/(gay\/)?video\/search\?search=([^&#]+)/i);
    if (sm) return { kind: "tag", path: (sm[1] ? "/gay/video/search?search=" + sm[2] : "/video/search?search=" + sm[2]) };
    if (v.indexOf("pornstar:") === 0) return { kind: "pornstar", slug: v.slice(9) };
    if (v.indexOf("model:") === 0) return { kind: "pornstar", slug: v.slice(6) };
    var cc = v.match(/^c(\d+)$/i);
    if (cc) return { kind: "category", path: "/video?c=" + cc[1] };
    if (v.indexOf("tag:") === 0) return { kind: "tag", path: "/video/search?search=" + encodeURIComponent(v.slice(4)) };
    if (keys[i] === "peopleId") return { kind: "pornstar", slug: t(v).toLowerCase().replace(/[\s_]+/g, "-") };
    if (keys[i] === "genreId") return { kind: "tag", path: "/video/search?search=" + encodeURIComponent(v) };
  }
  return null;
}

async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var cat = String(params.path || "sy");
  diagReset();
  // 全覆盖派发：点按目标走 HTML 直取（见 taxListTarget 注释，不走 API）
  var taxT = taxListTarget(params);
  if (taxT) {
    var taxPath = taxT.kind === "pornstar" ? ("/pornstar/" + taxT.slug) : taxT.path;
    if (page > 1) taxPath += (taxPath.indexOf("?") >= 0 ? "&page=" : "?page=") + page;
    try {
      var taxHtml = await fetchText(BASE + taxPath, "list");
      if (!taxHtml) return [{ id: "diag", type: "url", title: "取页失败（诊断）", description: diagText() + " | URL: " + BASE + taxPath }];
      return parseList(taxHtml);
    } catch (e) {
      var tmsg = String((e && e.message) || e);
      return [{ id: "err", type: "url", title: "载入失败: " + tmsg.slice(0, 50), description: tmsg + " | URL: " + BASE + taxPath + " | " + diagText() }];
    }
  }
  // 1) 先走 webmasters JSON API（不受 SPA 壳影响）
  try {
    var apiUrl = apiListUrl(cat, page, "");
    var j = await fetchApiJson(apiUrl);
    if (j) {
      var items = parseApiList(j);
      if (items.length) return items;
    }
  } catch (_) {}
  // 2) API 无结果，回落 HTML 抓取
  var url = BASE + "/video?";
  var catM = /^c(\d+)$/.exec(cat);
  if (catM) url = BASE + "/video?c=" + catM[1];
  else if (cat !== "sy") url = BASE + "/video?o=" + cat;
  if (page > 1) url += (cat === "sy" ? "page=" : "&page=") + page;
  try {
    var html = await fetchText(url, "list");
    if (!html) {
      return [{ id: "diag", type: "url", title: "取页失败（诊断）", description: diagText() + " | URL: " + url }];
    }
    return parseList(html);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url + " | " + diagText() }];
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
  diagReset();
  // 1) 先走 webmasters JSON API
  try {
    var apiUrl = apiListUrl("sy", page, keyword);
    var j = await fetchApiJson(apiUrl);
    if (j) {
      var items = parseApiList(j);
      if (items.length) return items;
    }
  } catch (_) {}
  // 2) 回落 HTML 抓取
  var url = BASE + "/video/search?search=" + encodeURIComponent(keyword) + "&page=" + page;
  try {
    var html = await fetchText(url, "list");
    if (!html) {
      return [{ id: "diag", type: "url", title: "取页失败（诊断）", description: diagText() + " | URL: " + url }];
    }
    return parseList(html);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url + " | " + diagText() }];
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

// master.m3u8 → variant 播单：master 只含一行 variant 相对地址（index-v1-a1.m3u8），
// App 须二次解析才拿到分片；这里直接解析成 variant 地址交给 App。失败回落 master 原地址。
async function toVariant(masterUrl) {
  try {
    var res = await Widget.http.get(masterUrl, { headers: pageHeaders() });
    var body = res && res.data != null ? String(res.data) : "";
    if (body.indexOf("#EXTM3U") < 0) return masterUrl;
    var lines = body.split(/\r?\n/);
    var last = "";
    for (var i = 0; i < lines.length; i++) {
      var ln = t(lines[i]);
      if (ln && ln.charAt(0) !== "#") last = ln;
    }
    if (!last) return masterUrl;
    if (/^https?:\/\//i.test(last)) return last;
    var base = masterUrl.split("?")[0];
    base = base.substring(0, base.lastIndexOf("/") + 1);
    var q = masterUrl.indexOf("?") >= 0 ? masterUrl.substring(masterUrl.indexOf("?")) : "";
    if (last.indexOf("?") >= 0) return base + last;
    return base + last + q;
  } catch (e) {
    return masterUrl;
  }
}

// ---- AVDB 样式详情：演员/分类（点按出对应全部内容）----
// 只取详情页三个专属区块：pornstarsWrapper（该片演员，带头像）、categoriesWrapper
// （该片分类 /video?c=N）、tagsWrapper（该片标签 /video/search?search=）。
// 全页扫会把“热门演员下拉菜单”、相关视频上传者、页脚分类全当成该片的（1.1.12 的假数据）。
function sectionSlice(html, marker, nextMarkers) {
  var s = String(html || "");
  var i = s.indexOf(marker);
  if (i < 0) return "";
  var end = Math.min(s.length, i + 12000);
  for (var k = 0; k < (nextMarkers || []).length; k++) {
    var j = s.indexOf(nextMarkers[k], i + marker.length);
    if (j >= 0 && j < end) end = j;
  }
  return s.slice(i, end);
}

function cleanLinkText(txt) {
  return String(txt || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function extractTaxonomyFromHtml(html) {
  var peoples = [];
  var genreItems = [];
  var seenP = {};
  var seenG = {};
  // 演员：pornstarsWrapper 内 /pornstar/<slug> 链接（带头像 <img>）
  var psec = sectionSlice(html, "pornstarsWrapper", ["categoriesWrapper", "tagsWrapper"]);
  var pre = /<a[^>]+href\s*=\s*["'](\/pornstar\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = pre.exec(psec)) !== null) {
    var pname = cleanLinkText(m[2]);
    if (!pname || pname.length > 40) continue;
    var pabs = BASE + m[1];
    if (seenP[pname]) continue;
    seenP[pname] = 1;
    var avatar = "";
    var imSrc = m[2].match(/<img[^>]+src\s*=\s*["']([^"']+)["']/i);
    if (imSrc) avatar = imSrc[1];
    else {
      var imData = m[2].match(/<img[^>]+data-image\s*=\s*["']([^"']+)["']/i);
      if (imData) avatar = imData[1];
    }
    if (avatar && avatar.indexOf("//") === 0) avatar = "https:" + avatar;
    var pitem = { id: pabs, title: pname, name: pname, link: pabs, role: "演员" };
    if (avatar) { var av = proxyCover(avatar); pitem.avatar = av; pitem.posterPath = av; pitem.coverUrl = av; }
    peoples.push(pitem);
  }
  // 回落：同性分区等详情页没有 pornstarsWrapper 区块，改取 JSON-LD creator ——
  // 只有 @type 为 Person 且 url 指向 /pornstar/ 的才算演员（直片页 creator 是
  // Organization 频道，不会误取；Riley 页 creator 即频道 Step Siblings Caught）。
  if (!peoples.length) {
    var jm = String(html || "").match(/"(?:creator|author)"\s*:\s*\{\s*"@type"\s*:\s*"Person"\s*,\s*"name"\s*:\s*"([^"]+)"\s*,\s*"url"\s*:\s*"([^"]*\/pornstar\/[^"]*)"/i);
    if (jm) {
      var jabs = jm[2];
      if (jabs.indexOf("http") !== 0) jabs = BASE + (jabs.charAt(0) === "/" ? jabs : "/" + jabs);
      peoples.push({ id: jabs, title: jm[1], name: jm[1], link: jabs, role: "演员" });
    }
  }
  // 分类：categoriesWrapper 内 /video?c=N（或 /gay/video?c=N）链接
  var csec = sectionSlice(html, "categoriesWrapper", ["tagsWrapper", "pornstarsWrapper"]);
  var cre = /<a[^>]+href\s*=\s*["']((?:\/gay)?\/video\?c=\d+|\/gayporn)["'][^>]*>([\s\S]*?)<\/a>/gi;
  while ((m = cre.exec(csec)) !== null) {
    var cname = cleanLinkText(m[2]);
    if (!cname || cname.length > 40) continue;
    var cabs = BASE + m[1];
    if (seenG[cabs]) continue;
    seenG[cabs] = 1;
    genreItems.push({ id: cabs, title: cname, link: cabs });
  }
  // 标签：tagsWrapper 内 /video/search?search=（或 /gay/video/search?search=）链接
  var tsec = sectionSlice(html, "tagsWrapper", ["pornstarsWrapper", "categoriesWrapper"]);
  var tre = /<a[^>]+href\s*=\s*["']((?:\/gay)?\/video\/search\?search=[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  while ((m = tre.exec(tsec)) !== null) {
    var tname = cleanLinkText(m[2]);
    if (!tname || tname.length > 40) continue;
    var tabs = BASE + m[1];
    if (seenG[tabs]) continue;
    seenG[tabs] = 1;
    genreItems.push({ id: tabs, title: tname, link: tabs });
  }
  return { peoples: peoples, genreItems: genreItems };
}

function filterRealWorks(list) {
  var arr = Array.isArray(list) ? list : [];
  var out = [];
  for (var i = 0; i < arr.length; i++) {
    var w = arr[i];
    if (w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty" && w.id !== "tip" && w.id !== "diag") out.push(w);
  }
  return out;
}

// 点按目标取数（HTML 直取）：演员页 / 分类页 / 标签搜索页；空则回 null 由调用方回落。
async function taxDetailFor(url) {
  var pm = String(url || "").match(/\/(pornstar|model)\/([^/?#]+)/i);
  var cm = String(url || "").match(/\/(gay\/)?video\?c=(\d+)/i);
  var sm = String(url || "").match(/\/(gay\/)?video\/search\?search=([^&#]+)/i);
  var path = "";
  var title = "";
  var kind = "";
  if (pm) {
    path = "/" + pm[1].toLowerCase() + "/" + pm[2];
    try { title = decodeURIComponent(pm[2]).replace(/-/g, " "); } catch (_) { title = pm[2].replace(/-/g, " "); }
    kind = "演员";
  } else if (cm) {
    path = (cm[1] ? "/gay/video?c=" + cm[2] : "/video?c=" + cm[2]);
    title = "分类 c" + cm[2];
    kind = "分类";
  } else if (sm) {
    path = (sm[1] ? "/gay/video/search?search=" + sm[2] : "/video/search?search=" + sm[2]);
    try { title = decodeURIComponent(sm[2]).replace(/\+/g, " "); } catch (_) { title = sm[2]; }
    kind = "标签";
  } else return null;
  var works = [];
  try {
    var h = await fetchText(BASE + path, "list");
    if (h) works = parseList(h);
  } catch (_) { works = []; }
  var real = filterRealWorks(works);
  if (!real.length && pm) {
    // 演员页空时回落名字搜索（API 关键词搜索 + HTML 回落）
    try { var found = await search({ keyword: title, page: 1 }); real = filterRealWorks(found); } catch (_) {}
  }
  if (!real.length) return null;
  return {
    id: BASE + path,
    type: "detail",
    mediaType: "movie",
    title: title,
    link: BASE + path,
    description: kind + " · 共 " + real.length + " 部作品",
    videoUrl: "",
    childItems: [],
    relatedItems: real
  };
}

async function loadDetail(link) {
  try {
    var rawIn = unwrapLink(link) || "";
    var url = absLink(rawIn || link);
    diagReset();
    // AVDB 样式：点按演员/分类/标签 → 打开对应的全部影片（HTML 直取，不走 API）
    var taxDet = null;
    try { taxDet = await taxDetailFor(url); } catch (_) { taxDet = null; }
    if (taxDet) return taxDet;
    // AVDB 样式：裸名（App 可能只传演员/标签名字）→ 先试 /pornstar/<名>/，再走标签搜索
    if (rawIn && rawIn.indexOf("http") !== 0 && rawIn.indexOf("/") < 0 && rawIn.indexOf("viewkey") < 0 && rawIn.indexOf("view_video") < 0) {
      var bareSlug = t(rawIn).toLowerCase().replace(/[\s_]+/g, "-");
      var bareDet = null;
      try { bareDet = await taxDetailFor(BASE + "/pornstar/" + bareSlug); } catch (_) { bareDet = null; }
      if (bareDet) return bareDet;
      try {
        var bareFound = await search({ keyword: rawIn, page: 1 });
        var bareReal = filterRealWorks(bareFound);
        if (bareReal.length) {
          return {
            id: BASE + "/video/search?search=" + encodeURIComponent(rawIn),
            type: "detail",
            mediaType: "movie",
            title: rawIn,
            link: BASE + "/video/search?search=" + encodeURIComponent(rawIn),
            description: "共 " + bareReal.length + " 部作品",
            videoUrl: "",
            childItems: [],
            relatedItems: bareReal
          };
        }
      } catch (_) {}
    }
    var html = await fetchText(url, "detail");
    if (!html) {
      return { id: url, type: "url", title: "取页失败（诊断）", description: diagText() + " | URL: " + url };
    }

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
    // 每档 master 解析成 variant（直接含分片），失败回落 master
    for (var qi = 0; qi < quals.length; qi++) {
      quals[qi].url = await toVariant(quals[qi].url);
    }
    if (quals.length) videoUrl = quals[0].url;

    var title = "";
    var cover = "";
    try {
      var $ = Widget.html.load(html);
      title = $("h1.title").text().replace(/\s+/g, " ").trim() || $('meta[property="og:title"]').attr("content") || "";
      cover = proxyCover($('meta[property="og:image"]').attr("content") || "");
    } catch (_) {}
    if (!title) {
      var tm = html.match(/<title[^>]*>([^<]+)/i);
      title = tm ? tm[1].replace(/\s*[|].*$/, "").trim() : "Pornhub";
    }

    if (!videoUrl) {
      return { id: url, type: "url", title: title || "解析失败", description: "未找到播放地址 | " + diagText() };
    }
    var eps = [];
    var sEps = [];
    var items = [];
    for (var qi = 0; qi < quals.length; qi++) {
      eps.push({ name: quals[qi].name, link: quals[qi].url });
      sEps.push({ title: quals[qi].name, videoUrl: quals[qi].url, episodeNumber: qi + 1, customHeaders: playHeaders() });
      items.push({ id: quals[qi].url, type: "url", title: title + " " + quals[qi].name, name: quals[qi].name, mediaType: "movie", seasonNumber: 1, episodeNumber: qi + 1, videoUrl: quals[qi].url, link: quals[qi].url, posterPath: cover, coverUrl: cover, customHeaders: playHeaders(), playerType: "system" });
    }
    var ret = {
      id: url,
      type: "detail",
      title: title,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      playerType: "app",
      episodes: eps,
      seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: sEps }],
      episodeItems: items,
      childItems: items
    };
    var tax = extractTaxonomyFromHtml(html);
    if (tax.peoples.length) ret.peoples = tax.peoples;
    if (tax.genreItems.length) ret.genreItems = tax.genreItems;
    return ret;
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
