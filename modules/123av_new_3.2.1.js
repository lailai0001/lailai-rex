// 123AV for REX (123av_makka_play v3.2.1, clean-room rewrite)
// 后端：missav.fans（中文站 /cn/ 路径），HTML 页面解析。
// 功能：番号搜寻、热门/最新/中文字幕/无码分类、题材分类；
// 播放解析在详情时实时进行，清晰度优先 1080p，其次 720p。

WidgetMetadata = {
  id: "123av_makka_play",
  title: "123AV",
  description: "123AV（missav.fans）：番号搜寻、热门/最新/中文字幕/无码与题材分类，播放优先 1080p",
  author: "MakkaPakka",
  version: "3.2.1",
  requiredVersion: "0.0.1",
  site: "https://missav.fans",
  detailCacheDuration: 180,
  modules: [
    {
      title: "搜寻番号",
      functionName: "searchByCode",
      cacheDuration: 60,
      params: [
        { name: "keyword", title: "番号", type: "input", value: "" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "热门",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "周期",
          type: "enumeration",
          value: "today-hot",
          enumOptions: [
            { title: "今日热门", value: "today-hot" },
            { title: "本周热门", value: "weekly-hot" },
            { title: "本月热门", value: "monthly-hot" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "最新",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "列表",
          type: "enumeration",
          value: "new",
          enumOptions: [
            { title: "最近更新", value: "new" },
            { title: "新作上市", value: "release" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "中文字幕",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "chinese-subtitle" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "无码",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "类型",
          type: "enumeration",
          value: "uncensored-leak",
          enumOptions: [
            { title: "无码流出", value: "uncensored-leak" },
            { title: "FC2", value: "fc2" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "丝袜",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/%E7%B5%B2%E8%A5%AA" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "空姐",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/%E7%A9%BA%E5%A7%90" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "秘书",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/%E7%A7%98%E6%9B%B8" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "老师",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/%E5%A5%B3%E6%95%99%E5%B8%AB" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "美少女",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/%E7%BE%8E%E5%B0%91%E5%A5%B3" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "熟女",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/%E7%86%9F%E5%A5%B3" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "护士",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/%E8%AD%B7%E5%A3%AB" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "制服",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/%E5%88%B6%E6%9C%8D" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "女仆",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/%E5%A5%B3%E5%83%95" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "偶像",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/%E5%81%B6%E5%83%8F" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "人妻",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/%E4%BA%BA%E5%A6%BB" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "萝莉",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/%E8%98%BF%E8%8E%89" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "题材",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "题材",
          type: "enumeration",
          value: "genres/%E4%B8%AD%E5%87%BA",
          enumOptions: [
            { title: "中出", value: "genres/%E4%B8%AD%E5%87%BA" },
            { title: "巨乳", value: "genres/%E5%B7%A8%E4%B9%B3" },
            { title: "素人", value: "genres/%E7%B4%A0%E4%BA%BA" },
            { title: "人妻", value: "genres/%E4%BA%BA%E5%A6%BB" },
            { title: "多P", value: "genres/3P%E3%83%BB4P" },
            { title: "调教", value: "genres/%E8%AA%BF%E6%95%99%E5%A5%B4%E9%9A%B8" },
            { title: "NTR", value: "genres/NTR" },
            { title: "美少女", value: "genres/%E7%BE%8E%E5%B0%91%E5%A5%B3" },
            { title: "熟女", value: "genres/%E7%86%9F%E5%A5%B3" },
            { title: "巨尻", value: "genres/%E5%B7%A8%E5%B0%BB" },
            { title: "口交", value: "genres/%E5%8F%A3%E4%BA%A4" },
            { title: "潮吹", value: "genres/%E6%BD%AE%E5%90%B9" },
            { title: "凌辱", value: "genres/%E5%87%8C%E8%BE%B1" },
            { title: "颜射", value: "genres/%E9%A1%8F%E5%B0%84" },
            { title: "肛交", value: "genres/%E8%82%9B%E4%BA%A4" },
            { title: "乳交", value: "genres/%E4%B9%B3%E4%BA%A4" },
            { title: "手淫", value: "genres/%E6%89%8B%E6%B7%AB" },
            { title: "自慰", value: "genres/%E8%87%AA%E6%85%B0" },
            { title: "女优", value: "genres/%E5%A5%B3%E5%84%AA" },
            { title: "偶像", value: "genres/%E5%81%B6%E5%83%8F" },
            { title: "偷拍", value: "genres/%E5%81%B7%E6%8B%8D" },
            { title: "偷窥", value: "genres/%E5%81%B7%E7%AA%BA" },
            { title: "车震", value: "genres/%E8%BB%8A%E9%9C%87" },
            { title: "女仆", value: "genres/%E5%A5%B3%E5%83%95" },
            { title: "萝莉", value: "genres/%E8%98%BF%E8%8E%89" },
            { title: "温泉", value: "genres/%E6%BA%AB%E6%B3%89" },
            { title: "野外", value: "genres/%E9%87%8E%E5%A4%96" },
            { title: "企划", value: "genres/%E4%BC%81%E5%8A%83" },
            { title: "单体作品", value: "genres/%E5%96%AE%E9%AB%94%E4%BD%9C%E5%93%81" },
            { title: "OL", value: "genres/OL" },
            { title: "泳装", value: "genres/%E6%B3%B3%E8%A3%9D" },
            { title: "眼镜", value: "genres/%E7%9C%BC%E9%8F%A1" },
            { title: "痴女", value: "genres/%E7%97%B4%E5%A5%B3" },
            { title: "未亡人", value: "genres/%E6%9C%AA%E4%BA%A1%E4%BA%BA" },
            { title: "义母", value: "genres/%E7%BE%A9%E6%AF%8D" },
            { title: "姐姐", value: "genres/%E5%A7%90%E5%A7%90" }
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
      { name: "keyword", title: "番号", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

var BASE = "https://missav.fans";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": referer || BASE + "/"
  };
}

function isChallenge(html) {
  var s = String(html || "");
  if (/<title[^>]*>\s*Just a moment/i.test(s)) return true;
  if (/verify you are human/i.test(s.slice(0, 800))) return true;
  return false;
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders(BASE + "/") });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  if (isChallenge(body)) throw new Error("被 Cloudflare 拦截，请稍后重试");
  return body;
}

// 从任意 href 里取出最后一段路径（影片代号），去掉查询与锚点
function tailOf(href) {
  var s = String(href || "").split("#")[0].split("?")[0].replace(/\/+$/, "");
  var parts = s.split("/");
  return (parts[parts.length - 1] || "").toLowerCase();
}

function absLink(href) {
  var s = String(href || "").split("#")[0];
  if (/^https?:\/\//i.test(s)) return s;
  if (s.charAt(0) === "/") return BASE + s;
  return BASE + "/" + s;
}

var NON_VIDEO_TAILS = /^(new|release|fc2|search|genres|actresses|makers|vip|chinese-subtitle|uncensored-leak|today-hot|weekly-hot|monthly-hot|cn|dm\d+)$/i;

function isVideoTail(tail) {
  if (!tail || NON_VIDEO_TAILS.test(tail)) return false;
  return /(?:fc2[-_]?ppv[-_]?\d+|[a-z]{2,12}-\d{2,6}|heyzo[-_]?\d{3,5}|\d{6}[-_]\d{2,4})/i.test(tail);
}

// 去掉版本后缀，得到基础番号（用于同一部影片多版本去重）
function baseCode(tail) {
  return String(tail || "")
    .replace(/-uncensored-leak$/i, "")
    .replace(/-uncensored$/i, "")
    .replace(/-chinese-subtitle$/i, "")
    .toLowerCase();
}

function coverOf(tail, img) {
  var src = String(img || "");
  if (src && !/^data:/i.test(src)) {
    return src.replace(/cover-t\.jpg/i, "cover-n.jpg").replace("fourhoi.com", "fourhoi.mrstcdn.store");
  }
  return "https://fourhoi.mrstcdn.store/" + tail + "/cover-t.jpg";
}

function parseList(html, mode) {
  if (!html) return [{ id: "empty", type: "url", title: "空页面" }];
  if (isChallenge(html)) {
    return [{ id: "err_cf", type: "url", title: "被 Cloudflare 拦截，请稍后重试或换网络" }];
  }
  if (String(html).indexOf("找不到页面") >= 0) {
    return [{ id: "empty", type: "url", title: "分类不存在" }];
  }

  var $ = Widget.html.load(html);
  var seen = {};
  var order = [];

  $("a[href]").each(function (i, el) {
    var $a = $(el);
    var href = $a.attr("href") || "";
    var tail = tailOf(href);
    if (!isVideoTail(tail)) return;

    var leak = /uncensored-leak/i.test(tail);
    var sub = /chinese-subtitle/i.test(tail);
    if (mode !== "leak" && mode !== "all" && leak) return;
    if (mode !== "subtitle" && mode !== "all" && sub) return;

    var key = (mode === "leak" || mode === "subtitle") ? tail : baseCode(tail);
    var rec = seen[key];
    if (!rec) {
      rec = { link: absLink(href), code: baseCode(tail), tail: tail, title: "", duration: "", img: "" };
      seen[key] = rec;
      order.push(rec);
    }

    var text = ($a.attr("title") || $a.text() || "").replace(/\s+/g, " ").trim();
    var tm = text.match(/^(\d{1,2}:\d{2}(?::\d{2})?)$/);
    if (tm) {
      rec.duration = tm[1];
    } else if (text.length > rec.title.length && text.length > 2) {
      rec.title = text;
    }

    // 封面优先取带 cover 的图，其次任意图片的 data-src/src
    if (!rec.img) {
      var chosen = "";
      $a.find("img").each(function (j, im) {
        var $im = $(im);
        var cand = $im.attr("data-src") || $im.attr("src") || "";
        if (!cand || /^data:/i.test(cand)) return;
        if (/cover/i.test(cand)) { chosen = cand; return false; }
        if (!chosen) chosen = cand;
      });
      if (chosen) rec.img = chosen;
    }
  });

  var out = [];
  for (var i = 0; i < order.length; i++) {
    var r = order[i];
    var img = coverOf(r.tail, r.img);
    out.push({
      id: r.link,
      type: "url",
      title: r.title || r.code.toUpperCase(),
      posterPath: img,
      coverUrl: img,
      backdropPath: img,
      link: r.link,
      description: r.code.toUpperCase(),
      releaseDate: r.duration || "",
      mediaType: "movie"
    });
  }
  return out.length ? out : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
}

function modeOf(path) {
  var p = String(path || "");
  if (p.indexOf("chinese-subtitle") >= 0) return "subtitle";
  if (/uncensored-leak|fc2/i.test(p)) return "leak";
  return "normal";
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var path = String(params.path || "new").replace(/^\/+/, "");
  var url = BASE + "/cn/" + path;
  if (page > 1) url += "?page=" + page;
  try {
    var html = await fetchText(url);
    return parseList(html, modeOf(path));
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

function normalizeCode(s) {
  var v = String(s || "").trim().toLowerCase().replace(/\s+/g, "");
  var m = v.match(/^([a-z]{2,12})[-_]?(\d{2,6})$/i);
  if (m) return m[1].toLowerCase() + "-" + m[2];
  return v.replace(/_/g, "-");
}

function cardForCode(code, suffix) {
  var tail = suffix ? code + suffix : code;
  var img = coverOf(tail, "");
  var link = BASE + "/cn/" + tail;
  return {
    id: link,
    type: "url",
    title: code.toUpperCase() + (suffix || ""),
    posterPath: img,
    coverUrl: img,
    backdropPath: img,
    link: link,
    description: code.toUpperCase(),
    mediaType: "movie"
  };
}

async function searchByCode(params) {
  params = params || {};
  var keyword = pickKeyword(params);
  if (!keyword) {
    return [{ id: "tip", type: "url", title: "输入番号后搜寻，例如 SSIS-001" }];
  }
  var code = normalizeCode(keyword);
  var tries = [keyword, code];
  for (var i = 0; i < tries.length; i++) {
    try {
      var html = await fetchText(BASE + "/cn/search/" + encodeURIComponent(tries[i]));
      var list = parseList(html, "all");
      if (list.length && list[0].id !== "empty" && list[0].id !== "err_cf" && list[0].id !== "err") {
        return list;
      }
    } catch (_) {}
  }
  // 站内搜寻没有结果时，按番号直接拼出三个常见版本
  return [cardForCode(code), cardForCode(code, "-uncensored-leak"), cardForCode(code, "-chinese-subtitle")];
}

async function search(params) {
  return searchByCode(params);
}

// 从详情页 HTML 中提取播放流信息：
// 命中打包格式或直链时返回 { base, master }，只找到现成 playlist 时返回其 URL 字串。
function extractStream(html) {
  var raw = String(html || "").replace(/\\\//g, "/");

  var direct = raw.match(/https?:\/\/((?:surrit|nineyu|fourhoi|sixyik)[^/"'\s]+)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
  if (direct) {
    var b1 = "https://" + direct[1] + "/" + direct[2];
    return { base: b1, master: b1 + "/playlist.m3u8" };
  }

  var packed = raw.match(/m3u8\|([^"'<\s]+)\|video/i);
  if (packed) {
    var seg = ("m3u8|" + packed[1]).split("|");
    // 格式: m3u8|uuid尾|uuid4|uuid3|uuid2|uuid首|cdn根域|主机名|https|video
    if (seg.length >= 8) {
      var host = seg[7] + "." + seg[6];
      var uuid = seg[5] + "-" + seg[4] + "-" + seg[3] + "-" + seg[2] + "-" + seg[1];
      var b2 = "https://" + host + "/" + uuid;
      return { base: b2, master: b2 + "/playlist.m3u8" };
    }
  }

  var seek = raw.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}).{0,80}seek/i);
  if (seek) {
    var b3 = "https://surrit.mrstcdn.store/" + seek[1];
    return { base: b3, master: b3 + "/playlist.m3u8" };
  }

  var pl = raw.match(/https?:\/\/[^"'\\\s]+\/playlist\.m3u8/i);
  if (pl) return pl[0].replace(/\\+/g, "");
  return "";
}

// 从主播放列表中挑最高清晰度：先比 RESOLUTION 高度，再比 BANDWIDTH
async function pickQuality(base) {
  var fallback = base + "/1080p/video.m3u8";
  try {
    var res = await Widget.http.get(base + "/playlist.m3u8", { headers: pageHeaders(BASE + "/") });
    var text = res && res.data != null ? String(res.data) : "";
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
      var rm = line.match(/RESOLUTION=(\d+)x(\d+)/i);
      var bm = line.match(/BANDWIDTH=(\d+)/i);
      var cand = {
        uri: uri,
        h: rm ? parseInt(rm[2], 10) : 0,
        bw: bm ? parseInt(bm[1], 10) : 0
      };
      if (!best || cand.h > best.h || (cand.h === best.h && cand.bw > best.bw)) best = cand;
    }
    if (best) {
      return /^https?:\/\//i.test(best.uri) ? best.uri : base + "/" + best.uri.replace(/^\.\//, "");
    }
    // 没有 STREAM-INF 时按路径名兜底挑档
    var paths = [];
    for (var k = 0; k < lines.length; k++) {
      var u = lines[k].trim();
      if (u && u.charAt(0) !== "#") paths.push(u);
    }
    var prefer = [/1080/, /1920x1080/, /1280x720/, /720p/, /480/];
    for (var p = 0; p < prefer.length; p++) {
      for (var q = 0; q < paths.length; q++) {
        if (prefer[p].test(paths[q])) {
          return /^https?:\/\//i.test(paths[q]) ? paths[q] : base + "/" + paths[q].replace(/^\.\//, "");
        }
      }
    }
    if (paths.length) {
      var last = paths[paths.length - 1];
      return /^https?:\/\//i.test(last) ? last : base + "/" + last.replace(/^\.\//, "");
    }
  } catch (_) {}
  return fallback;
}

async function loadDetail(link) {
  try {
    var url = String(link || "");
    url = url.replace(/^https?:\/\/[^/]+/, BASE);
    if (!/\/cn\//.test(url)) {
      url = url.replace(/^(https?:\/\/[^/]+)\//, "$1/cn/");
    }
    var html = await fetchText(url);

    var title = "";
    var cover = "";
    try {
      var $ = Widget.html.load(html);
      title = $('meta[property="og:title"]').attr("content") || "";
      if (!title) title = $("h1").first().text().replace(/\s+/g, " ").trim();
      cover = $('meta[property="og:image"]').attr("content") || "";
    } catch (_) {}
    if (!title) {
      var tm = html.match(/<title[^>]*>([^<]+)/i);
      title = tm ? tm[1].replace(/\s*[|—–-].*$/, "").trim() : "123AV";
    }
    cover = coverOf(tailOf(url), cover);

    var found = extractStream(html);
    if (!found) {
      return { id: url, type: "url", title: title || "解析失败", description: "未找到播放地址" };
    }
    var videoUrl = typeof found === "string" ? found : await pickQuality(found.base);
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
        "Referer": BASE + "/",
        "Origin": BASE
      }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
