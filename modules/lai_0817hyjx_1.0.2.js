// AV影社 for REX (lai_0817hyjx v1.0.2)
// 移植自 mira-cat 蜘蛛 py_0817hyjx.js（只读蓝图），后端 https://www.0817hyjx.com/cn。
// v1.0.2（2026-11-07）：详情页 iframe src 由绝对地址 https://playdaili.com/api/public/missav-player/<id>
//   改为本站相对地址 /api/public/missav-player/<id>，旧正则只认绝对地址导致 playUrl 为空、无法播放；
//   两种形态都认，相对地址补 HOST。loadDetail 同步回 seasons + episodeItems（单集正片，videoUrl 直链）。
// 分类：猫源 CLASSES 37 项原样照抄，分 4 组顶级分类 + 细分筛选（最新热门 / 类型 / 厂牌 / 华语直播），不编造。
// 列表：<article class="ms2-card"> 卡片（img 直链封面 + alt 标题 + 时长 span）；翻页 ?page=N。
//   注意：站方 2026-11-05 起卡片 href 改为绝对地址（https://www.0817hyjx.com/cn/xxx），
//   猫源 parseCards 只认 /cn/ 开头相对地址会漏掉；REX 版两种形态都认，id 统一归一为 /cn/xxx。
// 混淆壳：站方 2026-11-05 新加 xsg-base64-v2 壳（document.write 输出 base64 编码的真实页面），
//   REX 沙箱无 Buffer/TextDecoder 保证，故用纯手写 base64 + UTF-8 解码（b64DecodeUtf8），解不开回落原文。
// 详情：<h1> 标题 + iframe /api/public/missav-player/<id>（2026-11-07 起为本站相对地址，旧绝对地址
//   playdaili.com 形态也认），该页内 <script id="missav-config"> JSON 含 poster 与 source（playorigincdn.com master.m3u8）。
// 播放：单码率（master 仅一条 media.m3u8，分片为 .jpeg 伪装的 ts，HEAD 200 video/mp2t）；
//   站方不给多档，绝不编假清晰度选单。字幕：猫源字幕芯是猫源专属，REX 版不接。

WidgetMetadata = {
  id: "lai_0817hyjx",
  title: "AV影社",
  description: "AV影社（0817hyjx.com）：日本 AV 聚合站，37 分类 + 搜索，详情单集正片直链播放",
  author: "lai",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  site: "https://www.0817hyjx.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "🏠首页推荐", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🆕最新热门", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "enumeration", value: "new", enumOptions: [{ title: "最近更新", value: "new" }, { title: "新作上市", value: "release" }, { title: "中文字幕", value: "chinese-subtitle" }, { title: "无码流出", value: "uncensored-leak" }, { title: "今日热门", value: "today-hot" }, { title: "本週热门", value: "weekly-hot" }, { title: "本月热门", value: "monthly-hot" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🏷️类型", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "enumeration", value: "genres/VR", enumOptions: [{ title: "VR", value: "genres/VR" }, { title: "巨乳", value: "genres/%E5%B7%A8%E4%B9%B3" }, { title: "大屁股", value: "genres/%E5%A4%A7%E5%B1%81%E8%82%A1" }, { title: "巨乳偏好", value: "genres/%E5%B7%A8%E4%B9%B3%E5%81%8F%E5%A5%BD" }, { title: "屁股偏好", value: "genres/%E5%B1%81%E8%82%A1%E5%81%8F%E5%A5%BD" }, { title: "欧美大片", value: "genres/%E5%A4%96%E5%9B%BD%E5%A5%B3%E4%BC%98" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🎬厂牌", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "enumeration", value: "fc2", enumOptions: [{ title: "FC2", value: "fc2" }, { title: "HEYZO", value: "heyzo" }, { title: "东京热", value: "tokyohot" }, { title: "一本道", value: "1pondo" }, { title: "Caribbeancom", value: "caribbeancom" }, { title: "Caribbeancompr", value: "caribbeancompr" }, { title: "10musume", value: "10musume" }, { title: "pacopacomama", value: "pacopacomama" }, { title: "Gachinco", value: "gachinco" }, { title: "XXX-AV", value: "xxxav" }, { title: "人妻斩", value: "marriedslash" }, { title: "顽皮 4610", value: "naughty4610" }, { title: "顽皮 0930", value: "naughty0930" }, { title: "SIRO", value: "siro" }, { title: "LUXU", value: "luxu" }, { title: "GANA", value: "gana" }, { title: "PRESTIGE PREMIUM", value: "maan" }, { title: "S-CUTE", value: "scute" }, { title: "ARA", value: "ara" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🌏华语直播", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "enumeration", value: "madou", enumOptions: [{ title: "麻豆传媒", value: "madou" }, { title: "TWAV", value: "twav" }, { title: "Furuke", value: "furuke" }, { title: "韩国直播", value: "klive" }, { title: "中国直播", value: "clive" }] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://www.0817hyjx.com";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function cleanText(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/\s+/g, " ");
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return u;
}

// 纯手写 base64 -> UTF-8 字符串（无 Buffer / TextDecoder / atob 保证）
var B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64DecodeUtf8(s) {
  var bytes = [];
  var n = 0, bits = 0, i, v;
  for (i = 0; i < s.length; i++) {
    var ch = s.charAt(i);
    if (ch === "=") break;
    v = B64_ALPHABET.indexOf(ch);
    if (v < 0) continue;
    n = (n << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((n >> bits) & 255);
    }
  }
  var out = "", j = 0, c, c2, c3, c4;
  while (j < bytes.length) {
    c = bytes[j++];
    if (c < 128) { out += String.fromCharCode(c); }
    else if (c >= 192 && c < 224 && j < bytes.length) {
      c2 = bytes[j++];
      out += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
    } else if (c >= 224 && c < 240 && j + 1 < bytes.length) {
      c2 = bytes[j++]; c3 = bytes[j++];
      out += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
    } else if (c >= 240 && c < 248 && j + 2 < bytes.length) {
      c2 = bytes[j++]; c3 = bytes[j++]; c4 = bytes[j++];
      var cp = ((c & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
      cp -= 65536;
      out += String.fromCharCode(55296 + (cp >> 10), 56320 + (cp & 1023));
    }
  }
  return out;
}

function deobfuscate(raw) {
  if (!raw || raw.indexOf("data-xsg-obfuscation") < 0) return raw;
  var re = /"([A-Za-z0-9+\/=]{1000,})"/g;
  var m, best = "";
  while ((m = re.exec(raw)) !== null) {
    if (m[1].length > best.length) best = m[1];
  }
  if (!best) return raw;
  try {
    var decoded = b64DecodeUtf8(best);
    if (decoded.indexOf("<article") >= 0 || decoded.indexOf("<h1") >= 0) return decoded;
  } catch (e) { /* fall through */ }
  return raw;
}

async function getHtml(url) {
  var full = t(url);
  if (full.indexOf("//") === 0) full = "https:" + full;
  else if (full.charAt(0) === "/") full = HOST + full;
  try {
    var res = await Widget.http.get(full, {
      headers: {
        "User-Agent": UA,
        "Referer": HOST + "/cn",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
      }
    });
    var body = res && res.data != null ? String(res.data) : "";
    if (!body) return "";
    return deobfuscate(body);
  } catch (e) { return ""; }
}

function parseCards(html) {
  var items = [];
  var seen = {};
  var re = /<article[^>]*class="[^"]*ms2-card[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
  var m;
  while ((m = re.exec(String(html || "")))) {
    var inner = m[1];
    var hrefM = inner.match(/href=["']([^"']+)["']/);
    if (!hrefM) continue;
    var href = t(hrefM[1]);
    var slugM = href.match(/\/cn\/([A-Za-z0-9][^"'?#]*)/);
    if (!slugM) continue;
    var path = "/cn/" + slugM[1];
    if (seen[path]) continue;
    seen[path] = 1;
    var imgM = inner.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    var altM = inner.match(/<img[^>]+alt=["']([^"']*)["']/i);
    var durM = inner.match(/ms2-duration[^>]*>([^<]+)</);
    var title = cleanText(altM ? altM[1] : "");
    var h3M = inner.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
    var name = title || (h3M ? cleanText(h3M[1]) : "") || "精彩视频";
    var pic = imgM ? t(imgM[1]) : "";
    if (pic) pic = absUrl(pic);
    items.push({
      id: path,
      type: "url",
      title: name,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: path,
      description: durM ? t(durM[1]) : "",
      mediaType: "movie"
    });
  }
  return items;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var cat = t(params.cat || params.id || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var path = "";
  if (!cat || cat === "home") {
    // v1.0.1 翻页修：首页 /cn 无分页（?page 被忽略回同样内容、/cn/page/2 是 404）；
    // 第 2 页起改走最新列表 /cn/new?page=N（站方自有分页，12 条/页、与首页 0 重叠）。
    path = page === 1 ? "/cn" : ("/cn/new?page=" + page);
  } else {
    path = page === 1 ? ("/cn/" + cat) : ("/cn/" + cat + "?page=" + page);
  }
  try {
    var html = await getHtml(path);
    var list = parseCards(html);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
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
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var path = page === 1 ? ("/cn/search?keyword=" + encodeURIComponent(wd)) : ("/cn/search?keyword=" + encodeURIComponent(wd) + "&page=" + page);
  try {
    var html = await getHtml(path);
    var list = parseCards(html);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function detailPath(link) {
  var s = t(link);
  if (!s) return "";
  var m = s.match(/\/cn\/[A-Za-z0-9][^"'?#]*/);
  if (m) return m[0];
  return s;
}

async function loadDetail(link) {
  try {
    var path = detailPath(link);
    if (!path) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var durl = HOST + path;
    var html = await getHtml(path);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var h1M = html.match(/<h1>([\s\S]*?)<\/h1>/i);
    var mainTitle = h1M ? cleanText(h1M[1]) : "";
    if (!mainTitle) {
      var tM = html.match(/<title>(.*?)<\/title>/i);
      mainTitle = tM ? cleanText(tM[1]).replace(/\s*-\s*日本AV高清在线播放\s*-\s*AV影社\s*$/i, "").trim() : "";
    }
    if (!mainTitle) mainTitle = "精彩视频";
    var playUrl = "";
    var posterPic = "";
    var iframeM = html.match(/<iframe[^>]+src=["']((?:https:\/\/playdaili\.com)?\/api\/public\/missav-player\/\d+)["']/i);
    if (iframeM) {
      var playerSrc = iframeM[1];
      var playerUrl = playerSrc.indexOf("http") === 0 ? playerSrc : HOST + playerSrc;
      var playerHtml = await getHtml(playerUrl);
      var cfgM = playerHtml.match(/id="missav-config">(\{[\s\S]*?\})<\/script>/);
      if (cfgM) {
        try {
          var cfg = JSON.parse(cfgM[1]);
          if (cfg.source && String(cfg.source).indexOf("https://") === 0) playUrl = String(cfg.source);
          if (cfg.poster) posterPic = String(cfg.poster);
        } catch (e) { /* ignore */ }
      }
      if (!playUrl) {
        var srcM = playerHtml.match(/"source"\s*:\s*"([^"]+)"/);
        if (srcM) playUrl = srcM[1];
      }
    }
    if (!posterPic) {
      var slug = path.split("/").filter(function (x) { return !!x; }).pop() || "";
      if (slug) posterPic = "https://webp.cdnimg261015.com/video-covers/missav/" + slug + ".jpg";
    }
    if (!playUrl) {
      return { id: durl, type: "url", title: mainTitle, description: "未找到播放地址", coverUrl: posterPic, posterPath: posterPic, backdropPath: posterPic };
    }
    var hdrs = { "User-Agent": UA, "Referer": HOST + "/cn" };
    var epTitle = "正片";
    var ep = { title: epTitle, videoUrl: playUrl, episodeNumber: 1, customHeaders: hdrs };
    return {
      id: durl,
      type: "detail",
      title: mainTitle,
      name: mainTitle,
      link: durl,
      posterPath: posterPic,
      coverUrl: posterPic,
      backdropPath: posterPic,
      description: "单集正片",
      videoUrl: playUrl,
      playerType: "app",
      customHeaders: hdrs,
      episodes: [{ name: epTitle, link: playUrl }],
      seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: [ep] }],
      episodeItems: [{
        id: playUrl,
        type: "url",
        title: epTitle,
        mediaType: "movie",
        posterPath: posterPic,
        videoUrl: playUrl,
        link: playUrl,
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1,
        customHeaders: hdrs,
        playerType: "system"
      }]
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
