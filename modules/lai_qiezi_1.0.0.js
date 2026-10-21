// 茄子精品 for REX (lai_qiezi v1.0.0)
// 来源：mira-cat 蜘蛛 py_qiezi（只读蓝图移植）
// 后端：https://oxh.qzjp4.beer（苹果CMS），根路径被劫持为导航页，必须走 /cn/home/web/index.php 子路径。
// 功能：15 个站方分类、关键词搜索；播放解析在详情时实时进行（player_data 取 m3u8，主列表多档时挑最高码率）。

WidgetMetadata = {
  id: "lai_qiezi",
  title: "茄子精品",
  description: "茄子精品（oxh.qzjp4.beer，苹果CMS）：15 个分类与搜索，详情实时解析 m3u8 播放",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://oxh.qzjp4.beer",
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
          value: "21",
          enumOptions: [
            { title: "美女写真", value: "20" },
            { title: "国产精品", value: "21" },
            { title: "无码专区", value: "22" },
            { title: "中文字幕", value: "23" },
            { title: "强奸乱伦", value: "24" },
            { title: "人妻熟女", value: "25" },
            { title: "亚洲情色", value: "26" },
            { title: "制服丝袜", value: "27" },
            { title: "SM捆绑", value: "28" },
            { title: "自淫系列", value: "29" },
            { title: "三级伦理", value: "30" },
            { title: "网红主播", value: "31" },
            { title: "探花约炮", value: "32" },
            { title: "传媒大片", value: "33" },
            { title: "动漫卡通", value: "34" }
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

var HOST = "https://oxh.qzjp4.beer";
var BASE = "/cn/home/web/index.php";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": HOST + BASE
  };
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function stripTags(s) {
  return String(s || "").replace(/<[^>]+>/g, "").trim();
}

function absUrl(u) {
  u = String(u || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.charAt(0) === "/" && u.charAt(1) === "/") return "https:" + u;
  return HOST + (u.charAt(0) === "/" ? u : "/" + u);
}

function playLink(vodId) {
  return HOST + BASE + "/vod/play/id/" + vodId + "/sid/1/nid/1.html";
}

// 与蜘蛛 parseList 相同的正则口径（分类/首页：fed-list-item 列表）
function parseList(html) {
  var out = [];
  if (!html) return out;
  var items = html.match(/<li class="fed-list-item[^"]*">([\s\S]*?)<\/li>/g) || [];
  var seen = {};
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var im = item.match(/vod\/play\/id\/(\d+)/);
    if (!im) continue;
    var vodId = im[1];
    if (seen[vodId]) continue;
    seen[vodId] = true;

    var name = "";
    var tm = item.match(/<a[^>]*class="fed-list-title[^"]*"[^>]*title="([^"]+)"/);
    if (tm) name = tm[1].trim();
    if (!name) {
      tm = item.match(/<a[^>]*class="fed-list-title[^"]*"[^>]*>([\s\S]*?)<\/a>/);
      if (tm) name = stripTags(tm[1]);
    }
    if (!name || name.length < 3) continue;

    var pic = "";
    var pm = item.match(/data-original="([^"]+\.(?:jpg|jpeg|png))"/i);
    if (pm) pic = absUrl(pm[1]);

    var rm = item.match(/fed-list-remarks[^>]*>([^<]*)</);
    var link = playLink(vodId);
    out.push({
      id: link,
      type: "url",
      title: name,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: rm ? rm[1].trim() : "",
      mediaType: "movie"
    });
  }
  return out;
}

// 搜索结果页用 dl.fed-list-deta 结构，单独解析
function parseSearchList(html) {
  var out = [];
  if (!html) return out;
  var blocks = html.match(/<dl class="fed-list-deta[^"]*">([\s\S]*?)<\/dl>/g) || [];
  var seen = {};
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    var im = b.match(/vod\/play\/id\/(\d+)/);
    if (!im) continue;
    var vodId = im[1];
    if (seen[vodId]) continue;
    seen[vodId] = true;

    var name = "";
    var tm = b.match(/<h3[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>/);
    if (tm) {
      name = stripTags(tm[1]).replace(/\s+/g, " ").trim();
      // 站方把标题重复拼接（"标题 title标题"），取前半
      var dup = name.indexOf(" title");
      if (dup > 10) {
        var first = name.slice(0, dup);
        if (name.slice(dup + 6).indexOf(first.slice(0, 10)) === 0) name = first;
      }
    }
    if (!name || name.length < 3) continue;

    var pic = "";
    var pm = b.match(/data-original="([^"]+\.(?:jpg|jpeg|png|webp))"/i);
    if (pm) pic = absUrl(pm[1]);

    var link = playLink(vodId);
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
  var page = parseInt(params.page, 10) || 1;
  var tid = String(params.cat || params.path || "21");
  var url = HOST + BASE + "/vod/type/id/" + tid + ".html";
  if (page > 1) url = HOST + BASE + "/vod/type/id/" + tid + "/page/" + page + ".html";
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
  var url = HOST + BASE + "/vod/search/wd/" + encodeURIComponent(wd) + ".html";
  if (page > 1) url = HOST + BASE + "/vod/search/wd/" + encodeURIComponent(wd) + "/page/" + page + ".html";
  try {
    var html = await fetchText(url);
    var list = parseSearchList(html);
    if (!list.length) list = parseList(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// 主列表多档时挑最高码率一档（相对地址按主列表 URL 补全）；拿不到就返回主列表本身
async function pickBest(masterUrl) {
  try {
    var res = await Widget.http.get(masterUrl, { headers: pageHeaders() });
    var text = res && res.data != null ? String(res.data) : "";
    if (text.indexOf("#EXT-X-STREAM-INF") < 0) return masterUrl;
    var lines = text.split(/\r?\n/);
    var best = null;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line.indexOf("#EXT-X-STREAM-INF") !== 0) continue;
      var uri = "";
      for (var j = i + 1; j < lines.length; j++) {
        var t = lines[j].trim();
        if (t) { uri = t; break; }
      }
      if (!uri) continue;
      var bm = line.match(/BANDWIDTH=(\d+)/i);
      var bw = bm ? parseInt(bm[1], 10) : 0;
      if (!best || bw > best.bw) best = { uri: uri, bw: bw };
    }
    if (!best) return masterUrl;
    var u = best.uri;
    if (/^https?:\/\//i.test(u)) return u;
    var origin = masterUrl.match(/^https?:\/\/[^/]+/)[0];
    if (u.charAt(0) === "/") return origin + u;
    return masterUrl.replace(/\/[^/]*$/, "/") + u;
  } catch (_) {
    return masterUrl;
  }
}

async function loadDetail(link) {
  var url = String(link || "");
  var idm = url.match(/vod\/play\/id\/(\d+)/);
  var vodId = idm ? idm[1] : "";
  var pageUrl = vodId ? playLink(vodId) : url;
  try {
    var html = await fetchText(pageUrl);
    if (!html || html.length < 1000) {
      return { id: pageUrl, type: "url", title: "解析失败", description: "详情页为空" };
    }

    // 与蜘蛛 detail 相同口径：先 player_data 的 url，再全文 m3u8（排除 sharer/balecao 广告）
    var m3u8 = "";
    var m = html.match(/var\s+player_data\s*=\s*(\{.*?\})/s);
    if (m) {
      var um = m[1].match(/"url"\s*:\s*"([^"]+)"/);
      if (um) m3u8 = um[1].replace(/\\\//g, "/");
    }
    if (!m3u8) {
      var all = html.match(/https?:\/\/[^\s"'\\]+\.m3u8[^\s"'\\]*/g) || [];
      for (var i = 0; i < all.length; i++) {
        if (!/sharer|balecao/i.test(all[i])) { m3u8 = all[i]; break; }
      }
    }
    if (!m3u8) {
      return { id: pageUrl, type: "url", title: "解析失败", description: "未找到播放地址" };
    }

    // 标题：优先详情区 h3 的片名（<title> 常被导航广告劫持），兜底按蜘蛛口径清洗 <title>
    var name = "";
    var hm = html.match(/<h3[^>]*>\s*<a[^>]*vod\/play\/id\/\d+[^>]*>([\s\S]*?)<\/a>/);
    if (hm) name = stripTags(hm[1]).replace(/\s+/g, " ").trim();
    if (!name) {
      var tm2 = html.match(/<title>([\s\S]*?)<\/title>/);
      if (tm2) {
        name = stripTags(tm2[1]).replace(/第\d+集.*$/, "").replace(/[-_–—].*?在线播放.*$/, "").trim();
        if (/永久网址|http/i.test(name)) name = "";
      }
    }
    if (!name) name = "视频" + vodId;

    var pm = html.match(/(?:data-original|data-src|src)="([^"]+\.(?:jpg|jpeg|png))"/i);
    var pic = pm ? absUrl(pm[1]) : "";

    var videoUrl = await pickBest(m3u8);
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
        "Referer": HOST + BASE
      }
    };
  } catch (e) {
    return { id: pageUrl, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
