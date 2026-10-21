// 吉利猫 for REX (lai_jilimao v1.0.0)
// 来源：mira-cat 蜘蛛 py_jilimao（只读蓝图移植）
// 后端：https://jlm100.cc（苹果CMS，原 jlm7.cc 已迁走），结构 /index.php/vod/type/id/{id}/page/{pg}.html。
// 功能：16 个站方分类（与蜘蛛动态抓取/备用表一致，2026-10-21 实测 sort 页与备用表逐一相同）、
// 关键词搜索；播放解析在详情时实时进行（播放页 const source / m3u8 / mp4 依次提取）。

WidgetMetadata = {
  id: "lai_jilimao",
  title: "吉利猫",
  description: "吉利猫（jlm100.cc，苹果CMS）：16 个分类与搜索，详情实时解析 m3u8 播放",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://jlm100.cc",
  detailCacheDuration: 180,
  modules: [
    {
      title: "分类",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "cat",
          title: "分类",
          type: "enumeration",
          value: "46",
          enumOptions: [
            { title: "日韩自拍", value: "46" },
            { title: "色情主播", value: "43" },
            { title: "国产av", value: "44" },
            { title: "乱伦侵犯", value: "59" },
            { title: "日本无码", value: "47" },
            { title: "无码字幕", value: "50" },
            { title: "色情动漫", value: "49" },
            { title: "有码字幕", value: "48" },
            { title: "欧美av", value: "51" },
            { title: "18禁重口味", value: "52" },
            { title: "偷拍偷窥", value: "53" },
            { title: "网爆吃瓜", value: "54" },
            { title: "传媒a片", value: "55" },
            { title: "探花约炮", value: "56" },
            { title: "三级伦理", value: "57" },
            { title: "av解说", value: "58" }
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

var HOST = "https://jlm100.cc";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": HOST + "/"
  };
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function unesc(s) {
  return String(s || "")
    .replace(/&#(\d+);/g, function (_, n) { return String.fromCharCode(+n); })
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

function absUrl(u) {
  u = String(u || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.charAt(0) === "/" && u.charAt(1) === "/") return "https:" + u;
  return HOST + (u.charAt(0) === "/" ? u : "/" + u);
}

function playLink(vid) {
  return HOST + "/index.php/vod/play/id/" + vid + ".html";
}

// 与蜘蛛 parseList 相同的正则口径（video-item 块）
function parseList(html) {
  var out = [];
  if (!html) return out;
  var blocks = html.match(/<li>\s*<div class="video-item">([\s\S]*?)<\/li>/g) || [];
  var seen = {};
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    var m = b.match(/href="[^"]*?\/vod\/play\/id\/(\d+)\.html"/);
    if (!m || seen[m[1]]) continue;
    seen[m[1]] = true;
    var vid = m[1];

    var img = b.match(/<img[^>]*data-src="([^"]+)"[^>]*alt="([^"]*)"/);
    var title = img ? unesc(img[2]) : "";
    if (!title) {
      var t = b.match(/class="line-clamp-[^"]*"[^>]*>\s*([^<]+?)\s*<\/a>/);
      title = t ? unesc(t[1]) : "";
    }
    if (!title) continue;

    var pic = img ? absUrl(img[1]) : "";
    if (!pic) {
      var p2 = b.match(/og:image" content="([^"]+)"/);
      pic = p2 ? absUrl(p2[1]) : "";
    }
    var rem = b.match(/rounded-large text-white">([^<]+)<\/div>/);
    var link = playLink(vid);
    out.push({
      id: link,
      type: "url",
      title: title.slice(0, 120),
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: rem ? rem[1].trim() : "",
      mediaType: "movie"
    });
  }
  return out;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var tid = String(params.cat || params.path || "46");
  var url = HOST + "/index.php/vod/type/id/" + tid + "/page/" + page + ".html";
  try {
    var html = await fetchText(url);
    var list = parseList(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
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
  var url = HOST + "/index.php/vod/search/wd/" + encodeURIComponent(wd) + ".html";
  if (page > 1) url = HOST + "/index.php/vod/search/wd/" + encodeURIComponent(wd) + "/page/" + page + ".html";
  try {
    var html = await fetchText(url);
    var list = parseList(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

async function loadDetail(link) {
  var raw = String(link || "");
  var vm = raw.match(/\/vod\/(?:play|detail)\/id\/(\d+)\.html/);
  var vid = "";
  if (vm) vid = vm[1];
  else { var dm = raw.match(/(\d+)/); vid = dm ? dm[1] : raw; }
  var pageUrl = playLink(vid);
  try {
    var html = await fetchText(pageUrl);
    if (!html) {
      return { id: pageUrl, type: "url", title: "解析失败", description: "详情页为空" };
    }

    var name = "";
    var m = html.match(/<h1 class="dx-title[^"]*"[^>]*>([^<]+)<\/h1>/);
    if (m) name = unesc(m[1]);
    if (!name) {
      m = html.match(/og:title" content="([^"]*)"/);
      if (m) name = unesc(m[1].split(" - ")[0]);
    }
    if (!name) name = "视频" + vid;

    var pic = "";
    m = html.match(/og:image" content="([^"]+)"/);
    if (m) pic = absUrl(m[1]);

    // 与蜘蛛 play 相同口径：const source → m3u8 直链 → mp4 直链
    var videoUrl = "";
    m = html.match(/const\s+source\s*=\s*['"]([^'"]+)['"]/);
    if (m) videoUrl = absUrl(m[1]);
    if (!videoUrl) {
      m = html.match(/(https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*)/);
      if (m) videoUrl = m[1];
    }
    if (!videoUrl) {
      m = html.match(/(https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*)/);
      if (m) videoUrl = m[1];
    }
    if (!videoUrl) {
      return { id: pageUrl, type: "url", title: name, description: "未找到播放地址" };
    }

    return {
      id: pageUrl,
      type: "detail",
      title: name,
      link: pageUrl,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": HOST + "/"
      }
    };
  } catch (e) {
    return { id: pageUrl, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
