// 肉视频 for REX (lai_rou v1.0.0)
// 移植自 mira-cat 蜘蛛 rou.js（只读蓝图），后端：rou.video。
// 分类 12 个（与蜘蛛 CLASSES 逐一对齐）；列表/搜索走 HTML 解析（卡片 a.group[href^="/v/"]）。
// 详情从页面内嵌 TSR 流式脚本取加密 ev，纯 JS base64 解码（沙箱无 Buffer）后
// 每字节减 k 再 JSON.parse 得 videoUrl（decodeEv 算法与蜘蛛一致）。
// 注意：站方播放清单与分片均为 PNG 包装（内嵌 roUd chunk 载荷），站方靠自家
// Shaka 播放器的响应过滤器在客户端解包；普通播放器拿到的是 PNG 图片。
// 播放经 rou-hls Worker 拆包（PNG 伪装 HLS 服务端还原）：先在手机侧解析 /api/hls 的 302
// 拿到 CDN 清单地址（rou.video 拦 Workers 出口、清单/分片不拦），解析不到才交 Worker 兜底链。

WidgetMetadata = {
  id: "lai_rou",
  title: "肉视频",
  description: "肉视频（rou.video）：12 个分类、站内搜索，播放地址经详情页 ev 实时解码",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://rou.video",
  detailCacheDuration: 180,
  modules: [
    {
      title: "分类",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "url",
          title: "分类",
          type: "enumeration",
          value: "https://rou.video/t/國產AV",
          enumOptions: [
            { title: "國產AV", value: "https://rou.video/t/國產AV" },
            { title: "探花", value: "https://rou.video/t/探花" },
            { title: "自拍流出", value: "https://rou.video/t/自拍流出" },
            { title: "OnlyFans", value: "https://rou.video/t/OnlyFans" },
            { title: "日本", value: "https://rou.video/t/日本" },
            { title: "韩国", value: "https://rou.video/t/韩国" },
            { title: "欧美", value: "https://rou.video/t/欧美" },
            { title: "网红", value: "https://rou.video/t/网红" },
            { title: "动漫", value: "https://rou.video/t/动漫" },
            { title: "偷拍", value: "https://rou.video/t/偷拍" },
            { title: "主播", value: "https://rou.video/t/主播" },
            { title: "无码", value: "https://rou.video/t/无码" }
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

var HOST = "https://rou.video";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
// 播放请求头与蜘蛛 play() 的 header 逐字一致（蜘蛛用 Windows UA，实测站方对两种 UA 同样应答）
var PLAY_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0";

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": referer || HOST + "/"
  };
}

function playHeaders() {
  return {
    "User-Agent": PLAY_UA,
    "Referer": HOST + "/"
  };
}

function absUrl(u) {
  var s = String(u || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.indexOf("//") === 0) return "https:" + s;
  return HOST + (s.charAt(0) === "/" ? s : "/" + s);
}

async function fetchText(url) {
  // 不要在这里整体 encodeURI：搜索关键词已 encodeURIComponent 过，
  // 整体再编一次会把 % 双重编码导致搜不到结果。需要编码的原始 URL 在构造处单独处理。
  var res = await Widget.http.get(url, { headers: pageHeaders(HOST + "/") });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

// 解析列表卡片（对应蜘蛛 parseCards；分类页与搜索页结构相同）
function parseCards(html) {
  var out = [];
  if (!html) return out;
  var $;
  try { $ = Widget.html.load(html); } catch (_) { return out; }
  $('a.group[href^="/v/"]').each(function (_, element) {
    var $el = $(element);
    var href = $el.attr("href") || "";
    if (!href) return;
    var title = $el.find("h3").first().text().replace(/\s+/g, " ").trim() || $el.find("img").last().attr("alt") || "";
    var cover = $el.find("img").first().attr("src") || "";
    var badge = $el.find(".relative span").first().text().replace(/\s+/g, " ").trim();
    var duration = $el.find(".relative .ml-auto").first().text().replace(/\s+/g, " ").trim();
    var remarks = [badge, duration].filter(Boolean).join(" · ");
    var link = absUrl(href);
    out.push({
      id: link,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: link,
      description: remarks || "",
      releaseDate: duration || "",
      mediaType: "movie"
    });
  });
  return out;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  // 分类 URL 含原始中文路径，先 encodeURI 编码路径部分，再拼 ASCII 翻页参数
  var url = encodeURI(String(params.url || "https://rou.video/t/國產AV"));
  if (page > 1) url += "?order=createdAt&page=" + page;
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
  var keyword = pickKeyword(params);
  if (!keyword) {
    return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  }
  var page = parseInt(params.page, 10) || 1;
  var url = HOST + "/search?q=" + encodeURIComponent(keyword) + "&t=&page=" + page;
  try {
    var html = await fetchText(url);
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// 纯 JS base64 → binary string（等价 Buffer.from(s, "base64").toString("binary")）
function b64ToBinary(s) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var lookup = {};
  for (var i = 0; i < chars.length; i++) lookup[chars.charAt(i)] = i;
  var clean = String(s || "").replace(/[^A-Za-z0-9+/=]/g, "");
  var out = "";
  var buf = 0;
  var bits = 0;
  for (var j = 0; j < clean.length; j++) {
    var c = clean.charAt(j);
    if (c === "=") break;
    var v = lookup[c];
    if (v === undefined) continue;
    buf = (buf << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out += String.fromCharCode((buf >> bits) & 0xff);
    }
  }
  return out;
}

// 对应蜘蛛 decodeEv：base64 解码 ev.d 后每字节减 ev.k，再 JSON.parse
function decodeEv(ev) {
  var bin = b64ToBinary(ev.d);
  var dec = "";
  for (var i = 0; i < bin.length; i++) {
    dec += String.fromCharCode(bin.charCodeAt(i) - ev.k);
  }
  return JSON.parse(dec);
}

// 从详情页提取 ev（新版 TSR 流式脚本，兼容旧版 #__NEXT_DATA__）
function extractEv(html) {
  var m = html.match(/ev:\$R\[\d+\]=\{d:"((?:[^"\\]|\\.)*)",k:(\d+)\}/);
  if (m) {
    var d = m[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    return { d: d, k: parseInt(m[2], 10) };
  }
  var nm = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (nm) {
    try {
      var ev = JSON.parse(nm[1]).props.pageProps.ev;
      if (ev && ev.d) return ev;
    } catch (_) {}
  }
  return null;
}

var ROU_WORKER = "https://rou-hls.li768435813.workers.dev";
// 把 /api/hls/<id> 换成 rou-hls Worker 的 /v 地址。先尝试在手机侧解析 302：
// rou.video 对 Workers 出口回 403，但手机出口可达；若运行时暴露了 Location/最终 URL，
// 就把 CDN 的 index.png 清单地址交给 Worker 直连拆包（已实测通）；
// 拿不到就把 api 地址交给 Worker 的兜底中转链。
async function rouWorkerUrl(apiUrl, pageUrl) {
  var resolved = "";
  try {
    var res = await Widget.http.get(apiUrl, { headers: playHeaders() });
    var cands = [];
    if (res) {
      var h = res.headers || res.header || {};
      cands.push(h.location, h.Location);
      cands.push(res.finalUrl, res.responseUrl, res.url, res.requestURL);
      if (res.request) cands.push(res.request.responseURL, res.request.url);
    }
    for (var i = 0; i < cands.length; i++) {
      var c = cands[i];
      if (typeof c === "string" && c.indexOf("index.png") > -1) { resolved = c; break; }
    }
  } catch (_) {}
  var target = resolved || apiUrl;
  return ROU_WORKER + "/v?u=" + encodeURIComponent(target) + "&ref=" + encodeURIComponent(pageUrl);
}

async function loadDetail(link) {
  var url = absUrl(String(link || ""));
  if (!url) {
    return { id: String(link || "err"), type: "url", title: "参数错误", description: "链接为空" };
  }
  try {
    var html = await fetchText(url);
    var title = "";
    var cover = "";
    try {
      var $ = Widget.html.load(html);
      title = $('meta[property="og:title"]').attr("content") || "";
      if (!title) title = $("h1").first().text().replace(/\s+/g, " ").trim();
      cover = $('meta[property="og:image"]').attr("content") || "";
    } catch (_) {}
    if (!title) title = "肉视频";

    var videoUrl = "";
    try {
      var ev = extractEv(html);
      if (ev) videoUrl = decodeEv(ev).videoUrl || "";
    } catch (_) {}
    if (!videoUrl) {
      return { id: url, type: "url", title: title, description: "未找到播放地址" };
    }
    // 与蜘蛛 play() 兼容兜底一致：旧版 videoUrl 是封面 jpg 时替换为 .m3u8
    videoUrl = absUrl(String(videoUrl).replace(".jpg", ".m3u8"));
    // PNG 伪装 HLS：交给 rou-hls Worker 拆包成普通 HLS 再播
    videoUrl = await rouWorkerUrl(videoUrl, url);
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
      customHeaders: playHeaders()
    };
  } catch (e) {
    return { id: url, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
