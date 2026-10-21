// 蝙蝠视频 for REX (lai_bianfu v1.0.0)
// 移植自 mira-cat 蜘蛛 bianfu.js，后端：https://257915.xyz
// 页面混淆：整页是反转 base64（函数名('...') 形式），解开后还有
// document.write(d('...')) 的 base64 片段与 display:none 垃圾 span，
// 与蜘蛛同一套解法（纯 JS base64，不依赖 Buffer/atob）。
// 播放：详情页 playFilteredHLS('video','<m3u8>') 直出地址。
// 磁力类（torrent.php）条目 REX 内无法播放，loadDetail 如实返回提示卡。

WidgetMetadata = {
  id: "lai_bianfu",
  title: "蝙蝠视频",
  description: "蝙蝠视频（257915.xyz）：中文字幕/网红主播/国产情色/日韩无码等 29 个分类，在线 m3u8 直出；磁力分类仅列单",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://257915.xyz",
  detailCacheDuration: 180,
  modules: [
    {
      title: "首页推荐",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "home" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "分类",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "分类",
          type: "enumeration",
          value: "64360061",
          enumOptions: [
            { title: "中文字幕", value: "64360061" },
            { title: "网红主播", value: "64370061" },
            { title: "成人动漫", value: "64380061" },
            { title: "欧美情色", value: "64390061" },
            { title: "国模私拍", value: "64400061" },
            { title: "韩国伦理", value: "64430061" },
            { title: "国产情色", value: "64170061" },
            { title: "日本无码", value: "64180061" },
            { title: "日韩无码", value: "64170041" },
            { title: "欧美精品", value: "64190041" },
            { title: "国产精品", value: "64200041" },
            { title: "动漫精品", value: "64360041" },
            { title: "日韩精品", value: "64390041" },
            { title: "自拍偷拍", value: "64430041" },
            { title: "大秀视频", value: "64580041" },
            { title: "精品推荐", value: "64360111" },
            { title: "国产色情", value: "64380111" },
            { title: "91探花", value: "64630111" },
            { title: "传媒出品", value: "64750111" },
            { title: "国产自拍", value: "64170031" },
            { title: "欧美极品", value: "64180031" },
            { title: "极骚萝莉", value: "64380031" },
            { title: "国产专区(磁力)", value: "64169922" },
            { title: "日本有码(磁力)", value: "64179922" },
            { title: "日本无码(磁力)", value: "64189922" },
            { title: "欧美色情(磁力)", value: "64199922" },
            { title: "传媒作品(磁力)", value: "64209922" },
            { title: "麻豆传媒", value: "64180121" }
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

var BASE = "https://257915.xyz";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": BASE + "/"
  };
}

function t(v) {
  return String(v == null ? "" : v).trim();
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.indexOf("http") === 0) return u;
  if (u.charAt(0) === "/") return BASE + u;
  return BASE + "/" + u;
}

// 纯 JS base64 -> UTF-8 字符串（REX 沙箱无 Buffer）
var B64CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64decodeUtf8(str) {
  var s = String(str || "").replace(/[\r\n\s]/g, "").replace(/[^A-Za-z0-9+/=]/g, "");
  if (!s) return "";
  var bytes = [];
  for (var i = 0; i < s.length; i += 4) {
    var c0 = B64CHARS.indexOf(s.charAt(i));
    var c1 = B64CHARS.indexOf(s.charAt(i + 1));
    var pad2 = s.charAt(i + 2) === "=";
    var pad3 = s.charAt(i + 3) === "=";
    var c2 = pad2 ? 0 : B64CHARS.indexOf(s.charAt(i + 2));
    var c3 = pad3 ? 0 : B64CHARS.indexOf(s.charAt(i + 3));
    if (c0 < 0 || c1 < 0) break;
    bytes.push((c0 << 2) | (c1 >> 4));
    if (!pad2) bytes.push(((c1 & 15) << 4) | (c2 >> 2));
    if (!pad3) bytes.push(((c2 & 3) << 6) | c3);
  }
  var out = "";
  for (var j = 0; j < bytes.length;) {
    var b = bytes[j++];
    if (b < 0x80) { out += String.fromCharCode(b); continue; }
    if (b >= 0xC2 && b <= 0xDF) {
      var b2 = bytes[j++];
      out += String.fromCharCode(((b & 0x1F) << 6) | (b2 & 0x3F));
    } else if (b >= 0xE0 && b <= 0xEF) {
      var b3 = bytes[j++], b4 = bytes[j++];
      out += String.fromCharCode(((b & 0x0F) << 12) | ((b3 & 0x3F) << 6) | (b4 & 0x3F));
    } else if (b >= 0xF0 && b <= 0xF4) {
      var b5 = bytes[j++], b6 = bytes[j++], b7 = bytes[j++];
      var cp = ((b & 0x07) << 18) | ((b5 & 0x3F) << 12) | ((b6 & 0x3F) << 6) | (b7 & 0x3F);
      cp -= 0x10000;
      out += String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 0x3FF));
    } else {
      out += "�";
    }
  }
  return out;
}

function reverseStr(s) {
  return String(s || "").split("").reverse().join("");
}

function cleanText(s) {
  return t(s).replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, " ");
}

// 取页面并解混淆（与蜘蛛 fetchPage 同逻辑）
async function fetchPage(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var html = res && res.data != null ? String(res.data) : "";
  if (!html) return "";
  var page = html;
  var m = html.match(/\w+\('([A-Za-z0-9+/=]{1000,})/);
  if (m) {
    try {
      var raw = b64decodeUtf8(reverseStr(m[1]));
      var idx = raw.indexOf("<!DOCTYPE") >= 0 ? raw.indexOf("<!DOCTYPE") : raw.indexOf("<html");
      page = idx >= 0 ? raw.slice(idx) : raw;
    } catch (e) { page = html; }
  }
  page = page.replace(/document\.write\(d\('([^']+)'\)\);/g, function (_, b64) {
    try { return b64decodeUtf8(b64); } catch (e) { return ""; }
  });
  page = page.replace(/<span[^>]*?display\s*:\s*none[^>]*?>[\s\S]*?<\/span>/gi, "");
  return page;
}

function parseList(html) {
  var items = [];
  var seen = {};
  if (!html) return items;
  var blocks = String(html).split(/<dl>/i);
  for (var i = 1; i < blocks.length; i++) {
    var dl = (blocks[i].split(/<\/dl>/i)[0]) || "";
    var am = dl.match(/href="((?:\/video\.php|\/torrent\.php)\?id=\d+)"/i);
    if (!am) continue;
    var path = am[1];
    if (seen[path]) continue;
    seen[path] = 1;
    var im = dl.match(/<img[^>]+src="([^"]+)"/i);
    var pic = im ? im[1] : "";
    var tm = dl.match(/<h3>([\s\S]*?)<\/h3>/i);
    var name = cleanText(tm ? tm[1] : "");
    if (!name || name.length > 120) continue;
    var link = absUrl(path);
    var img = absUrl(pic);
    items.push({
      id: link,
      type: "url",
      title: name,
      posterPath: img,
      coverUrl: img,
      backdropPath: img,
      link: link,
      description: path.indexOf("torrent") >= 0 ? "磁力" : "",
      mediaType: "movie"
    });
  }
  return items;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var tid = t(params.path || "home");
  try {
    var url;
    if (!tid || tid === "home") {
      url = page > 1 ? BASE + "/list.php?id=64360061&page=" + page : BASE + "/";
    } else {
      url = BASE + "/list.php?id=" + encodeURIComponent(tid) + "&page=" + page;
    }
    var html = await fetchPage(url);
    var list = parseList(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有更多内容" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg }];
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
  var kw = pickKeyword(params);
  if (!kw) return [{ id: "tip", type: "url", title: "输入关键词搜索" }];
  var out = [];
  var seen = {};
  for (var ti = 0; ti < 2; ti++) {
    try {
      var html = await fetchPage(BASE + "/search.php?content=" + encodeURIComponent(kw) + "&type=" + (ti + 1));
      var list = parseList(html);
      for (var i = 0; i < list.length; i++) {
        if (!seen[list[i].id]) { seen[list[i].id] = 1; out.push(list[i]); }
      }
    } catch (e) {}
  }
  return out.length ? out : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
}

async function loadDetail(link) {
  var url = String(link || "");
  try {
    var html = await fetchPage(url);
    var title = "";
    var hm = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (hm) title = cleanText(hm[1]);
    title = title || url;
    var pic = "";
    var pm = html.match(/<img[^>]+src="([^"]+)"/i);
    if (pm) pic = absUrl(pm[1]);

    if (url.indexOf("torrent") >= 0) {
      return { id: url, type: "url", title: title, posterPath: pic, coverUrl: pic, backdropPath: pic, link: url, description: "磁力链接，REX 内无法直接播放" };
    }
    var m2 = html.match(/playFilteredHLS\s*\(\s*['"]video['"]\s*,\s*['"]([^'"]+)['"]/i);
    if (!m2) {
      return { id: url, type: "url", title: title, description: "未找到播放地址" };
    }
    // 详情页没有本片海报（首图是站标），按播放地址的 site_id/source_id 拼图床地址
    // （与列表封面同源：pic.<同域>/site_id/source_id.jpg，实测 301 到真图 JPEG）
    var sm = String(m2[1]).match(/^(https?:\/\/)m\.([^/]+)\/play\.php\?site_id=(\d+)&source_id=(\d+)/i);
    if (sm) pic = sm[1] + "pic." + sm[2] + "/" + sm[3] + "/" + sm[4] + ".jpg";
    return {
      id: url,
      type: "detail",
      title: title,
      link: url,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      videoUrl: t(m2[1]),
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE + "/"
      }
    };
  } catch (e) {
    return { id: url || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
