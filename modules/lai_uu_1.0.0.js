// UU直播破解 for REX (lai_uu v1.0.0)
// 来源蜘蛛：mira-cat uu.js（py_uu），后端站点 https://cmk.uuzbpj7.hair（自定义 CMS，HTML 解析）。
// 列表：/vodtype/{分类id}.html（翻页 /vodtype/{id}-{页}.html），video-item 结构正则解析。
// 详情：/{视频id}.html，const rawUrl 直出 m3u8（兜底 player_data / 页面内 .m3u8）。
// 蜘蛛本身无搜索（站方无搜索接口），search 返回提示卡，不编造。
// 与 lai_uu_video（Uu视频，nfu.rftsln9.com 的 API 站）是两个完全不同的站，勿混淆。

WidgetMetadata = {
  id: "lai_uu",
  title: "UU直播破解",
  description: "UU直播破解（cmk.uuzbpj7.hair）：韩国美眉/日韩主播/国产偷拍等 12 个分类，详情页直出 m3u8；本站无搜索",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://cmk.uuzbpj7.hair",
  detailCacheDuration: 180,
  modules: [
    {
      title: "分类",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "分类",
          type: "enumeration",
          value: "20",
          enumOptions: [
            { title: "韩国美眉", value: "20" },
            { title: "骑兵有码", value: "21" },
            { title: "日韩主播", value: "22" },
            { title: "国产偷拍", value: "23" },
            { title: "欧美激情", value: "24" },
            { title: "步兵无码", value: "25" },
            { title: "金发幼齿", value: "26" },
            { title: "三级伦理", value: "27" },
            { title: "岛国中文", value: "28" },
            { title: "岛国无码", value: "29" },
            { title: "网红主播", value: "30" },
            { title: "自拍偷拍", value: "31" }
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

var BASE = "https://cmk.uuzbpj7.hair";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": referer || BASE + "/"
  };
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders(BASE + "/") });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function stripTags(s) {
  return String(s || "").replace(/<[^>]+>/g, "").trim();
}

function absPic(pic) {
  var s = String(pic || "");
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.charAt(0) === "/") return BASE + s;
  return BASE + "/" + s;
}

// 与蜘蛛 parseList 完全一致的正则解析（video-item 块）
function parseList(html) {
  var out = [];
  if (!html) return out;
  var items = html.match(/<div[^>]*class="video-item [^"]*"[^>]*>([\s\S]*?)(?=<div[^>]*class="video-item |$)/g) || [];
  var seen = {};
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var m = item.match(/href="\/(\d+)\.html"/) || item.match(/data-href="\/(\d+)\.html"/);
    if (!m) continue;
    var vodId = m[1];
    if (seen[vodId]) continue;
    seen[vodId] = true;

    var name = "";
    var tm = item.match(/class="[^"]*video-item-title[^"]*"[^>]*>([\s\S]*?)<\/(?:div|a|p|h4)>/);
    if (tm) name = stripTags(tm[1]);
    if (!name) {
      var at = item.match(/<a[^>]*title="([^"]+)"/);
      if (at) name = at[1].trim();
    }
    if (!name) continue;

    var pic = "";
    var pm = item.match(/data-original="([^"]+\.(?:jpg|jpeg|png))"/i)
      || item.match(/data-src="([^"]+\.(?:jpg|jpeg|png))"/i)
      || item.match(/<img[^>]*src="([^"]+\.(?:jpg|jpeg|png))"/i);
    if (pm) pic = absPic(pm[1]);

    var link = BASE + "/" + vodId + ".html";
    out.push({
      id: link,
      type: "url",
      title: name,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: "",
      mediaType: "movie"
    });
  }
  return out;
}

async function loadList(params) {
  params = params || {};
  var tid = String(params.path || params.cat || "20");
  var page = parseInt(params.page, 10) || 1;
  var url = BASE + "/vodtype/" + tid + ".html";
  if (page > 1) url = BASE + "/vodtype/" + tid + "-" + page + ".html";
  try {
    var html = await fetchText(url);
    var list = parseList(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// 蜘蛛无搜索（站方无搜索接口），如实返回提示，不编造结果
async function search(params) {
  return [{ id: "tip", type: "url", title: "该站没有搜索功能，请用分类浏览" }];
}

function extractM3u8(html) {
  var m = html.match(/(?:const|let|var)\s+rawUrl\s*=\s*['"]([^'"]+)['"]/i);
  if (m) return m[1];
  m = html.match(/var\s+player_data\s*=\s*(\{[\s\S]*?\})/);
  if (m) {
    var um = m[1].match(/"url"\s*:\s*"([^"]+)"/);
    if (um) return um[1].replace(/\\\//g, "/");
  }
  var all = html.match(/https?:\/\/[^\s"'\\]+\.m3u8[^\s"'\\]*/g) || [];
  for (var i = 0; i < all.length; i++) {
    if (!/sharer|balecao/i.test(all[i])) return all[i];
  }
  return "";
}

async function loadDetail(link) {
  try {
    var s = String(link || "");
    var im = s.match(/(\d+)\.html/) || s.match(/^(\d+)$/);
    if (!im) {
      return { id: s || "err", type: "url", title: "解析失败", description: "链接里没有视频 id" };
    }
    var vodId = im[1];
    var url = BASE + "/" + vodId + ".html";
    var html = await fetchText(url);
    if (!html || html.length < 1000) {
      return { id: url, type: "url", title: "解析失败", description: "详情页为空" };
    }

    var videoUrl = extractM3u8(html);
    var name = "视频" + vodId;
    var tm = html.match(/<title>([\s\S]*?)<\/title>/);
    if (tm) {
      var cleaned = stripTags(tm[1])
        .replace(/[-_–—]\s*[^-_–—]*[-_–—]\s*UU直播破解.*$/, "")
        .replace(/[-_–—]\s*UU直播破解.*$/, "")
        .trim();
      if (cleaned) name = cleaned;
    }
    var pm = html.match(/(?:data-original|data-src|src)="([^"]+\.(?:jpg|jpeg|png))"/i);
    var cover = pm ? absPic(pm[1]) : "";

    if (!videoUrl) {
      return { id: url, type: "url", title: name, description: "未找到播放地址" };
    }
    return {
      id: url,
      type: "detail",
      title: name,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE + "/"
      }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
