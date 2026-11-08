// XNXX for REX (lai_xnxx v1.0.0)
// 来源蓝图: mira-cat 蜘蛛 xnxx.js (py_xnxx), 只读移植, 未改动原蜘蛛。
// 后端: XNXX 多镜像 (蜘蛛口径依次兜底 xnxx.health / www.xnxx.health / xnxx.com / www.xnxx.com), HTML 正则解析。
// 分类: 蜘蛛 home() 动态抓首页 /tags/<x> 链接, 实测首页只链到 /tags 索引页、抓不到单项,
//       蜘蛛实际走 FALLBACK_CATS 兜底表; 模块按此实测口径把蜘蛛的 31 个兜底分类原样烤入 enumeration。
// 分类/搜索 URL: /search/<tid>。
// 画质 (二轮修复, 2026-10-21 抽测 9 条坐实): setVideoUrlHigh 的 mp4 全是 360p (另有 240p Low),
//   真高清在详情页 setVideoHLS 的主清单里 —— 抽测 6/9 有 1920x1080 变体、2/9 最高 720p、1/9 最高 480p,
//   变体为普通 .ts VOD HLS, ffprobe 实测分辨率与标称一致。loadDetail 改走 HLS 选档:
//   拉主清单挑变体 (≤1080 最高 → 720 → 其余最高), 失败回退主清单本身, 再失败回退 mp4 High。
// v1.0.2（2026-11-09，分辨率选择）：pickHlsVariant 只返最高档 →
//   pickAllHlsVariants 返回主清单全部变体，loadDetail 每档一集，
//   seasons/episodes + episodeItems 每集带 videoUrl 变体地址；
//   HLS 不可用时回落 mp4 High（360p）单档。
// 翻页与蜘蛛不同 (实测修正): 蜘蛛的 ?p=N 已被站方忽略 (回第 1 页内容), 现行分页是路径式
//   /search/<tid>/<N-1> (站方分页条实证: 标 "2" 的链接是 /1, 第 1 页为裸路径或 /0)。
// 列表取块窗口用蜘蛛自带的长块兜底形态 (现行版式真标题在块尾 .thumb-under 里, 短块形态会切掉它), 详见 parseList 注释。
// UA: 沿用蜘蛛的 Windows Chrome UA —— 站方按 UA 分发版式, thumb-block 解析依赖桌面版页面结构
//     (与 Pornhub 移植同一口径; iPhone UA 会拿到移动版结构, 无卡可出)。

WidgetMetadata = {
  id: "lai_xnxx",
  title: "XNXX",
  description: "XNXX：31 个分类浏览与站内搜索，详情走 HLS 高清（1080p 优先），mp4 兜底",
  author: "lai",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  site: "https://xnxx.health",
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
          value: "teen",
          enumOptions: [
            { title: "Teen", value: "teen" },
            { title: "MILF", value: "milf" },
            { title: "Big Ass", value: "big+ass" },
            { title: "Big Tits", value: "big+tits" },
            { title: "Amateur", value: "amateur" },
            { title: "Anal", value: "anal" },
            { title: "Asian", value: "asian" },
            { title: "BBW", value: "bbw" },
            { title: "BDSM", value: "bdsm" },
            { title: "Blonde", value: "blonde" },
            { title: "Blowjob", value: "blowjob" },
            { title: "Brunette", value: "brunette" },
            { title: "Casting", value: "casting" },
            { title: "Creampie", value: "creampie" },
            { title: "Cumshot", value: "cumshot" },
            { title: "Deepthroat", value: "deepthroat" },
            { title: "Ebony", value: "ebony" },
            { title: "Fetish", value: "fetish" },
            { title: "Gangbang", value: "gangbang" },
            { title: "Hardcore", value: "hardcore" },
            { title: "Interracial", value: "interracial" },
            { title: "Japanese", value: "japanese" },
            { title: "Latina", value: "latina" },
            { title: "Lesbian", value: "lesbian" },
            { title: "Mature", value: "mature" },
            { title: "POV", value: "pov" },
            { title: "Public", value: "public" },
            { title: "Redhead", value: "redhead" },
            { title: "Shemale", value: "shemale" },
            { title: "Squirt", value: "squirt" },
            { title: "Threesome", value: "threesome" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "搜索",
      functionName: "search",
      cacheDuration: 60,
      params: [
        { name: "keyword", title: "关键词", type: "input", value: "" },
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

var HOSTS = [
  "https://xnxx.health",
  "https://www.xnxx.health",
  "https://xnxx.com",
  "https://www.xnxx.com"
];
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
var activeHost = null;

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9"
  };
}

// 与蜘蛛 getText 同口径: 依次试各镜像, 首个回长页面者胜出并记住
async function getText(path) {
  var hosts = activeHost ? [activeHost].concat(HOSTS.filter(function (h) { return h !== activeHost; })) : HOSTS;
  for (var i = 0; i < hosts.length; i++) {
    try {
      var res = await Widget.http.get(hosts[i] + path, { headers: pageHeaders() });
      var body = res && res.data != null ? String(res.data) : "";
      if (body.length > 1000) { activeHost = hosts[i]; return body; }
    } catch (e) { /* 换下一个镜像 */ }
  }
  return "";
}

// 拉绝对地址 (HLS 主清单在 CDN 域名上, 不走镜像轮换)
async function getUrl(url) {
  try {
    var res = await Widget.http.get(url, { headers: pageHeaders() });
    return res && res.data != null ? String(res.data) : "";
  } catch (e) { return ""; }
}

function absUrl(u) {
  u = String(u || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  var h = activeHost || HOSTS[0];
  if (u.indexOf("//") === 0) return "https:" + u;
  return h + (u.charAt(0) === "/" ? u : "/" + u);
}

function stripTags(s) {
  return String(s || "").replace(/<[^>]+>/g, "").trim();
}

// 沿用蜘蛛 parseList 的 thumb-block 口径, 取块方式改为按块起点切窗口:
// 现行页面里真标题在块尾的 .thumb-under 锚点上 (带 title 属性), 蜘蛛的短块形态 (止于 </div></div>)
// 会把 thumb-under 切在块外、标题只能退化成链接尾哈希; 而整段贪婪匹配又会吞掉相邻块的起点漏卡。
// 故先定位每个 thumb-block 的起点, 窗口取到下一块起点为止 (上限 4000 字, 即蜘蛛自带的兜底窗口长),
// 窗口内首个 href/首个 title 仍属本块, 与蜘蛛同口径, 按 href 去重。
// 封面取 src 做了无后顾处理: 要求 src 前为空白, 避开 data-preview-src (蜘蛛原版用负向后顾, JSCore 老版本不支持)
function parseList(html) {
  var videos = [];
  if (!html) return videos;
  var starts = [];
  var startRe = /<div[^>]*class="[^"]*thumb-block[^"]*"[^>]*>/g;
  var sm;
  while ((sm = startRe.exec(html)) !== null) starts.push(sm.index);
  var blocks = [];
  for (var s = 0; s < starts.length; s++) {
    var end = (s + 1 < starts.length) ? starts[s + 1] : starts[s] + 4000;
    if (end - starts[s] > 4000) end = starts[s] + 4000;
    blocks.push(html.slice(starts[s], end));
  }
  var seen = {};
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    var am = b.match(/<a[^>]*href="(\/video-[^"]+|\/search-video[^"]*)"/i);
    if (!am) continue;
    var href = am[1];
    if (seen[href]) continue;
    seen[href] = true;
    var pic = "";
    var im = b.match(/[\s]src="([^"]+)"/i) || b.match(/data-src="([^"]+)"/i);
    if (im) pic = absUrl(im[1]);
    var tm = b.match(/title="([^"]{2,200})"/i);
    var name = tm ? tm[1].trim() : href.split("/").pop().replace(/-/g, " ");
    var dm = b.match(/class="[^"]*duration[^"]*"[^>]*>([^<]+)</i);
    if (!dm) {
      // 现行版式时长/画质在 .thumb-under 的 metadata 行里 (如 "7min · 1080p"), 拼进备注
      var mm = b.match(/class="metadata"[^>]*>([\s\S]{0,300}?)<\/p>/i);
      if (mm) {
        var dur = mm[1].match(/(\d+min)/);
        var res = mm[1].match(/(2160p|1080p|720p|480p|360p)/);
        var parts = [];
        if (dur) parts.push(dur[1]);
        if (res) parts.push(res[1]);
        if (parts.length) dm = [null, parts.join(" · ")];
      }
    }
    var link = absUrl(href);
    videos.push({
      id: link,
      type: "url",
      title: name.slice(0, 120),
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: dm ? dm[1].trim() : "",
      mediaType: "movie"
    });
    if (videos.length >= 60) break;
  }
  return videos;
}

async function loadList(params) {
  params = params || {};
  var tid = String(params.path || params.cat || "teen");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var path = page === 1 ? "/search/" + tid : "/search/" + tid + "/" + (page - 1);
  try {
    var html = await getText(path);
    var list = parseList(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
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
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词搜索" }];
  var path = page === 1 ? "/search/" + encodeURIComponent(wd) : "/search/" + encodeURIComponent(wd) + "/" + (page - 1);
  try {
    var html = await getText(path);
    var list = parseList(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

// 详情页 HLS 主清单地址 (setVideoHLS); 真高清在这里, mp4 High 只有 360p
function extractHlsMaster(html) {
  var m = html.match(/setVideoHLS\(['"]([^'"]+)['"]\)/i);
  return m ? m[1].replace(/\\\//g, "/") : "";
}

function resolveAgainst(base, uri) {
  uri = String(uri || "").trim();
  if (!uri) return "";
  if (/^https?:\/\//i.test(uri)) return uri;
  if (uri.indexOf("//") === 0) return "https:" + uri;
  var b = String(base || "");
  var cut = b.lastIndexOf("/");
  return (cut > 8 ? b.slice(0, cut + 1) : b + "/") + uri;
}

// 从主清单取全部变体：按 RESOLUTION 高度降序、同高按 BANDWIDTH 降序；
// 无 RESOLUTION 时按 BANDWIDTH 命名（kbps），无两者时名“自适应”；同地址去重。
// 解析不到返回 []，调用方回落主清单本身或 mp4。
function pickAllHlsVariants(text, masterUrl) {
  if (!text || text.indexOf("#EXT-X-STREAM-INF") < 0) return [];
  var lines = String(text).split("\n");
  var vars = [];
  var seen = {};
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.indexOf("#EXT-X-STREAM-INF") !== 0) continue;
    var rm = line.match(/RESOLUTION=(\d+)x(\d+)/i);
    var bm = line.match(/BANDWIDTH=(\d+)/i);
    var uri = "";
    for (var j = i + 1; j < lines.length; j++) {
      var t = lines[j].trim();
      if (t) { uri = t; break; }
    }
    if (!uri) continue;
    var url = resolveAgainst(masterUrl, uri);
    if (!url || seen[url]) continue;
    seen[url] = 1;
    var h = rm ? parseInt(rm[2], 10) : 0;
    var bw = bm ? parseInt(bm[1], 10) : 0;
    vars.push({
      h: h,
      bw: bw,
      url: url,
      name: h > 0 ? (h + "p") : (bw > 0 ? (Math.round(bw / 1000) + "kbps") : "自适应")
    });
  }
  vars.sort(function (a, b) { return (b.h - a.h) || (b.bw - a.bw); });
  return vars;
}

function pickHlsVariant(text, masterUrl) {
  var all = pickAllHlsVariants(text, masterUrl);
  if (!all.length) return "";
  for (var k = 0; k < all.length; k++) { if (all[k].h <= 1080) return all[k].url; }
  return all[all.length - 1].url;
}

// 沿用蜘蛛 extractVideoUrl: setVideoUrlHigh 优先 (HLS 不可用时的兜底, 实测只有 360p)。
// v1.0.2：回落单档时带站方实测档位名返回（High=360p、Low=240p），不再只返裸地址。
function mp4Fallback(html) {
  var defs = [
    { re: /setVideoUrlHigh\(['"]([^'"]+)['"]\)/, name: "360p" },
    { re: /setVideoUrlLow\(['"]([^'"]+)['"]\)/, name: "240p" },
    { re: /setVideoUrl\(['"]([^'"]+)['"]\)/, name: "MP4" },
    { re: /"url"\s*:\s*"([^"]+\.mp4[^"]*)"/, name: "MP4" },
    { re: /"url"\s*:\s*"([^"]+\.m3u8[^"]*)"/, name: "自适应" }
  ];
  for (var i = 0; i < defs.length; i++) {
    var m = html.match(defs[i].re);
    if (m) return { url: m[1].replace(/\\\//g, "/"), name: defs[i].name };
  }
  var m2 = html.match(/https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*/);
  return m2 ? { url: m2[0], name: "MP4" } : { url: "", name: "" };
}

function extractVideoUrl(html) {
  return mp4Fallback(html).url;
}

async function loadDetail(link) {
  var raw = String(link || "");
  var path = raw.replace(/^https?:\/\/[^/]+/i, "");
  if (path.charAt(0) !== "/") path = "/" + path;
  var id = absUrl(path);
  try {
    var html = await getText(path);
    if (!html) {
      return { id: id, type: "url", title: "加载失败", description: "详情页拉取失败，请重试" };
    }
    var tm = html.match(/<h1[^>]*>([^<]{2,200})<\/h1>/i);
    var title = tm ? stripTags(tm[1]) : path;
    var cm = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)
      || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);
    var cover = cm ? absUrl(cm[1]) : "";
    // v1.0.2：主清单全部变体各作一集；拉不到变体时把主清单本身交播放器（自适应单档）；
    // 无 HLS 时回落 mp4 High（360p）单档。
    var variants = [];
    var hlsMaster = extractHlsMaster(html);
    if (hlsMaster) {
      var mtext = await getUrl(hlsMaster);
      variants = pickAllHlsVariants(mtext, hlsMaster);
      if (!variants.length) variants.push({ name: "自适应", url: hlsMaster });
    }
    if (!variants.length) {
      var fb = mp4Fallback(html);
      if (fb.url) variants.push({ name: fb.name, url: fb.url });
    }
    if (!variants.length) {
      return { id: id, type: "url", title: title, posterPath: cover, coverUrl: cover, backdropPath: cover, description: "未找到播放地址" };
    }
    var eps = [];
    var sEps = [];
    var items = [];
    for (var vi = 0; vi < variants.length; vi++) {
      eps.push({ name: variants[vi].name, link: variants[vi].url });
      sEps.push({ title: variants[vi].name, videoUrl: variants[vi].url, episodeNumber: vi + 1 });
      items.push({ id: variants[vi].url, type: "url", title: title + " " + variants[vi].name, name: variants[vi].name, mediaType: "movie", seasonNumber: 1, episodeNumber: vi + 1, videoUrl: variants[vi].url, link: variants[vi].url, posterPath: cover, coverUrl: cover });
    }
    return {
      id: id,
      type: "detail",
      title: title,
      link: id,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: variants[0].url,
      playerType: "app",
      episodes: eps,
      seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: sEps }],
      episodeItems: items,
      childItems: items,
      customHeaders: {
        "User-Agent": UA,
        "Referer": (activeHost || HOSTS[0]) + "/"
      }
    };
  } catch (e) {
    return { id: id, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
