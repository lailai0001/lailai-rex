// Eporner for REX（移植自 mira-cat 蜘蛛 spankbang_new.js / py_spankbang_new，只读蓝图移植；
// 该蜘蛛文件名虽叫 spankbang_new，后端实际是 Eporner，源显示名 Eporner）
// 后端：www.eporner.com，HTML 页面解析（cheerio 口径同蜘蛛）。
// 播放：详情页提取 /dload/*.mp4 直链，只取 720P 及以下（720P 以上多为 AV1 或需登录，iOS 播不了，沿用蜘蛛口径）；
// 同档同时有 -av1 与普通版时优先普通版（H.264）。

WidgetMetadata = {
  id: "lai_spankbang",
  title: "Eporner",
  description: "Eporner：19 个分类、标签搜索，播放取 720P 及以下 H.264 直链",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://www.eporner.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "日本",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/japanese/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "肛交",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/anal/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "POV",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/pov-porn/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "印度",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/indian/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "MILF",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/milf/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "Hentai",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/hentai/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "BBW",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/bbw/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "菲律宾",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/pinay/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "业余",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/amateur/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "亚洲",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/asian/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "少女",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/teen/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "巨乳",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/big-tits/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "口交",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/blowjob/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "内射",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/creampie/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "3P",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/threesome/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "女同",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/lesbian/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "按摩",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/massage/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "黑人",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/ebony/" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "拉丁",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/cat/latina/" },
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

var HOST = "https://www.eporner.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Referer": referer || (HOST + "/"),
    "Cookie": "age_verified=1",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8"
  };
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders(HOST + "/") });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

// 蜘蛛原解析：div.mb.hdy 卡片
function parseList(html) {
  var out = [];
  if (!html) return out;
  var $ = Widget.html.load(html);
  $("div.mb.hdy").each(function (_, el) {
    var $el = $(el);
    var $a = $el.find("p.mbtit a").first();
    var href = $a.attr("href") || "";
    var title = ($a.text() || "").trim() || $el.find("div.mbimg img").attr("alt") || "";
    if (!href || !title) return;
    var pic = $el.find("div.mbimg img").attr("src") || "";
    if (pic && pic.indexOf("http") !== 0) pic = "https:" + pic;
    var quality = ($el.find("div.mvhdico span").text() || "").trim();
    var duration = ($el.find("div.mvtime").text() || "").trim();
    var remarks = [quality, duration].filter(Boolean).join(" ");
    var link = href.indexOf("http") === 0 ? href : HOST + href;
    out.push({
      id: link,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: remarks,
      mediaType: "movie"
    });
  });
  return out;
}

function tipCard(msg) {
  return [{ id: "tip", type: "url", title: msg }];
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  if (page < 1) page = 1;
  var url = HOST + String(params.path || "/cat/japanese/");
  if (page > 1) url += page + "/";
  try {
    var html = await fetchText(url);
    var list = parseList(html);
    return list.length ? list : tipCard("没有找到相关影片");
  } catch (e) {
    return tipCard("载入失败: " + String((e && e.message) || e).slice(0, 50));
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
  if (!wd) return tipCard("输入关键词后搜索");
  var page = parseInt(params.page, 10) || 1;
  if (page < 1) page = 1;
  // 蜘蛛口径：/search/ 会 301 到 /tag/<词>/，直接用 /tag/（请求层会跟随其再跳到带后缀的标签页）
  var url = HOST + "/tag/" + encodeURIComponent(wd) + "/";
  if (page > 1) url += page + "/";
  try {
    var html = await fetchText(url);
    var list = parseList(html);
    return list.length ? list : tipCard("没有找到相关影片");
  } catch (e) {
    return tipCard("搜索失败: " + String((e && e.message) || e).slice(0, 50));
  }
}

// 详情页提取 /dload/*.mp4：只保留 720P 及以下（沿用蜘蛛口径）；
// 同档 -av1 与普通版并存时优先普通版（H.264，iOS 可播）
function pickDownload(html) {
  var seen = {};
  var quals = [];
  var re = /(\/dload\/[^"']+\.mp4)/g;
  var m;
  var raw = String(html || "");
  while ((m = re.exec(raw)) !== null) {
    var dl = m[1];
    if (seen[dl]) continue;
    seen[dl] = true;
    var qm = dl.match(/\/(\d+)\/[^/]*-(\d+)p/);
    var qnum = qm ? parseInt(qm[2], 10) : 0;
    if (qnum > 720) continue;
    quals.push({ q: qnum, av1: /-av1\.mp4$/i.test(dl) ? 1 : 0, url: HOST + dl });
  }
  quals.sort(function (a, b) {
    if (b.q !== a.q) return b.q - a.q;
    return a.av1 - b.av1;
  });
  return quals.length ? quals[0].url : "";
}

async function loadDetail(link) {
  try {
    var url = String(link || "");
    if (url.indexOf("http") !== 0) url = HOST + url;
    var html = await fetchText(url);

    var title = "";
    var cover = "";
    try {
      var $ = Widget.html.load(html);
      title = ($("h1").first().text() || "").trim() || $('meta[property="og:title"]').attr("content") || "";
      cover = $('meta[property="og:image"]').attr("content") || "";
    } catch (_) {}
    if (!title) {
      var tm = html.match(/<title[^>]*>([^<]+)/i);
      title = tm ? tm[1].replace(/\s*[|-].*$/, "").trim() : "Eporner";
    }

    var videoUrl = pickDownload(html);
    if (!videoUrl) {
      return { id: url, type: "url", title: title || "解析失败", description: "未找到播放地址" };
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
        "Referer": HOST + "/",
        "Cookie": "age_verified=1"
      }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
