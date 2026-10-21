// KissJAV for REX (lai_kissjav v1.0.0)
// 来源：mira-cat 蜘蛛 py_kissjav 的移植。后端：https://kissjav.li（无反爬，App 直连）。
// 功能：最新/热门 + 10 个真实分类、站内搜索；详情页 video_url Base64 解码出 get_file mp4 直链播放。

WidgetMetadata = {
  id: "lai_kissjav",
  title: "KissJAV",
  description: "KissJAV（kissjav.li）：最新/热门/KVIP/JVIP/韩流/FC2PPV/无码/MyFans/IPCAM 等分类，mp4 直链播放",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://kissjav.li",
  detailCacheDuration: 180,
  modules: [
    {
      title: "最新",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "latest" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "热门",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "popular" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "KVIP",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "vip" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "JVIP",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "jvip" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "Korean Porn",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "korean-porn" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "Korean BJ",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "korean-bj" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "FC2PPV",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "fc2ppv" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "Uncensored",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "jav" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "MyFans",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "myfans" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "IPCAM",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "ipcam" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "Toilet",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "toilet" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "VoyeurJP",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "voyeur-jp" },
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

var BASE = "https://kissjav.li";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.7",
    "Referer": BASE + "/"
  };
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body || body.length < 200) throw new Error("空回应");
  return body;
}

function t(v) {
  return String(v == null ? "" : v).trim();
}

function clean(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
}

function fixPic(u) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return BASE + u;
  return u;
}

// 纯 JS Base64 -> UTF-8 字符串（REX 沙箱无 Node Buffer）
function b64DecodeUtf8(b64) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var s = String(b64 || "").replace(/[^A-Za-z0-9+/=]/g, "");
  var bytes = [];
  var i, c1, c2, c3, c4;
  for (i = 0; i + 3 < s.length + 1 && i < s.length; i += 4) {
    c1 = chars.indexOf(s.charAt(i));
    c2 = chars.indexOf(s.charAt(i + 1));
    c3 = s.charAt(i + 2) === "=" ? -1 : chars.indexOf(s.charAt(i + 2));
    c4 = s.charAt(i + 3) === "=" ? -1 : chars.indexOf(s.charAt(i + 3));
    if (c1 < 0 || c2 < 0) break;
    bytes.push((c1 << 2) | (c2 >> 4));
    if (c3 >= 0) bytes.push(((c2 & 15) << 4) | (c3 >> 2));
    if (c4 >= 0) bytes.push(((c3 & 3) << 6) | c4);
  }
  // UTF-8 解码
  var out = "";
  var j = 0;
  while (j < bytes.length) {
    var b = bytes[j];
    if (b < 0x80) {
      out += String.fromCharCode(b);
      j += 1;
    } else if (b >= 0xC0 && b < 0xE0 && j + 1 < bytes.length) {
      out += String.fromCharCode(((b & 0x1F) << 6) | (bytes[j + 1] & 0x3F));
      j += 2;
    } else if (b >= 0xE0 && b < 0xF0 && j + 2 < bytes.length) {
      out += String.fromCharCode(((b & 0x0F) << 12) | ((bytes[j + 1] & 0x3F) << 6) | (bytes[j + 2] & 0x3F));
      j += 3;
    } else if (b >= 0xF0 && j + 3 < bytes.length) {
      var cp = ((b & 0x07) << 18) | ((bytes[j + 1] & 0x3F) << 12) | ((bytes[j + 2] & 0x3F) << 6) | (bytes[j + 3] & 0x3F);
      cp -= 0x10000;
      out += String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 0x3FF));
      j += 4;
    } else {
      j += 1;
    }
  }
  return out;
}

// 解析列表卡片（与蜘蛛 parseCards 同逻辑：
// a[href="/video/{id}/{slug}/"] 后 1500 字符窗口内取 title 与 data-original 图）
function parseCards(html) {
  var out = [];
  var seen = {};
  var re = /<a\s[^>]*href="(https?:\/\/kissjav\.li\/video\/\d+\/[^"]*\/)"[^>]*>/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var durl = m[1];
    var idm = durl.match(/\/video\/(\d+)\//);
    var vid = idm ? idm[1] : durl;
    if (seen[vid]) continue;
    seen[vid] = true;
    var win = html.slice(m.index, m.index + 1500);
    var titleM = m[0].match(/title="([^"]*)"/) || win.match(/title="([^"]*)"/);
    var imgM = win.match(/data-original="([^"]+)"/) || win.match(/<img[^>]+src="([^"]+)"/);
    var title = titleM ? clean(titleM[1]) : "KissJAV " + vid;
    var pic = imgM ? fixPic(imgM[1]) : "";
    out.push({
      id: durl,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: durl,
      description: "",
      mediaType: "movie"
    });
  }
  return out;
}

function catUrl(tid, page) {
  var base;
  if (tid === "latest") base = BASE + "/latest-updates/";
  else if (tid === "popular") base = BASE + "/most-popular/?sort_by=video_viewed";
  else base = BASE + "/categories/" + encodeURIComponent(tid) + "/";
  if (page > 1) {
    if (tid === "popular") return base + "&page=" + page;
    return base + page + "/";
  }
  return base;
}

async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var tid = t(params.cat || params.path || "latest") || "latest";
  var url = catUrl(tid, page);
  try {
    var html = await fetchText(url);
    var list = parseCards(html);
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
  var kw = pickKeyword(params);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!kw) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var url = BASE + "/search/" + encodeURIComponent(kw) + "/";
  if (page > 1) url += page + "/";
  try {
    var html = await fetchText(url);
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// 从详情页提取 video_url Base64 并解码出 get_file mp4 直链
function extractMp4(html) {
  var m = String(html || "").match(/video_url:\s*'([A-Za-z0-9+/=]+)'/);
  if (!m) return "";
  try {
    var dec = b64DecodeUtf8(m[1]);
    if (/^https?:\/\//.test(dec)) return dec;
  } catch (e) {}
  return "";
}

async function loadDetail(link) {
  try {
    var durl = String(link || "");
    if (!/^https?:\/\//.test(durl)) {
      durl = BASE + "/video/" + durl.replace(/\D/g, "") + "/";
    }
    var vidm = durl.match(/\/video\/(\d+)\//);
    var vid = vidm ? vidm[1] : "";
    var html = await fetchText(durl);

    var titleM = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    var title = titleM ? clean(titleM[1]) : "KissJAV " + vid;

    var pic = "";
    var picM = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (picM) pic = fixPic(picM[1]);

    var remarks = "";
    var durM = html.match(/itemprop="duration"[^>]*content="PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?"/);
    if (durM) {
      var h = durM[1] ? parseInt(durM[1], 10) : 0;
      var mi = durM[2] ? parseInt(durM[2], 10) : 0;
      var se = durM[3] ? parseInt(durM[3], 10) : 0;
      remarks = h
        ? h + ":" + String(mi).padStart(2, "0") + ":" + String(se).padStart(2, "0")
        : mi + ":" + String(se).padStart(2, "0");
    }

    // 播放地址实时解析（token 可能变化，不缓存）
    var mp4 = extractMp4(html);
    if (!mp4) {
      return { id: durl, type: "url", title: title || "解析失败", description: "未找到播放地址" };
    }

    return {
      id: durl,
      type: "detail",
      title: title,
      link: durl,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: remarks,
      videoUrl: mp4,
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
