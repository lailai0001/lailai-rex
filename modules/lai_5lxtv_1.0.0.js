// 5LXTV for REX (lai_5lxtv v1.0.0)
// 移植自 mira-cat 蜘蛛 py_5lxtv.js（只读蓝图），后端 https://5lxtv.com/。
// 繁中 JAV 站。服务端渲染 HTML，无 CF 墙。
// 分类：19 个频道（顶级）+ 排行；标签筛选卡片（前 40 热门标签）。
// 列表：/latest 与各频道 ?page=N（频道 20 条/页，最新 30 条/页）；
//   标签页 /tags/<tag>?page=N。封面 https://5lxtv.com/content-cover/<CODE>。
// 播放：详情页取 slug/t/n -> /api/play/<slug>?t=<t>&n=<n>&hls=1，
//   回单档 VOD m3u8（AES-128，密钥走 /api/hlskey，分片为 .jpg 伪装的加密 TS）。
//   实测 CEAD-776 单档 720p（1280x720 h264），站内无多档位可供选择，
//   故只出单行「720p」，不编造档位。点播现取详情页拿新鲜 t/n。
// 注意：猫源 v2 的本地清单代理（改写分片为 .ts 回 video/mp2t 修从头播/快进）
//   是蜘蛛本地 fastify 路由，REX 里没有，播放地址直接给 /api/play 的 m3u8 直链
//   （playerType "system"），不复刻代理。
// 字幕：猫源字幕芯是猫源专属，REX 版不接（javhey 同款）。

WidgetMetadata = {
  id: "lai_5lxtv",
  title: "5LXTV",
  description: "5LXTV：繁中 JAV 站，19 频道 + 排行 + 40 热门标签，详情单档 720p m3u8 点播现取",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://5lxtv.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "有碼A片", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "censored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "無碼破解", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "decensored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "無碼a片", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "uncensored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "中文字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "chinese" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "無碼中文", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "uncensored-chinese" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "國產AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "exclusive" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "偷拍盜攝", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "selfie" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "綠帽NTR", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cuckold" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "素人影片", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "amateur" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "歐美AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "western" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "H動漫畫", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "anime" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "成人短劇", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "ai-drama" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "OnlyFans", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "of" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "網紅UP主", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "upzhu" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "黑料吃瓜", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "scandal" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "FC2外流", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "fc2" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "二次元寫真", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cos" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "美女脫衣", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "ai" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "排行", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "ranking" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "標籤", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag" }, { name: "sub", title: "標籤", type: "enumeration", value: "巨乳", enumOptions: [{"title": "巨乳", "value": "巨乳"}, {"title": "中出", "value": "中出"}, {"title": "口交", "value": "口交"}, {"title": "素人", "value": "素人"}, {"title": "專屬女優作品", "value": "專屬女優作品"}, {"title": "人妻", "value": "人妻"}, {"title": "內射", "value": "內射"}, {"title": "美少女", "value": "美少女"}, {"title": "熟女", "value": "熟女"}, {"title": "騎乘位", "value": "騎乘位"}, {"title": "美乳", "value": "美乳"}, {"title": "多P", "value": "多P"}, {"title": "劇情", "value": "劇情"}, {"title": "痴女", "value": "痴女"}, {"title": "窈窕系", "value": "窈窕系"}, {"title": "潮吹", "value": "潮吹"}, {"title": "第一人稱視野", "value": "第一人稱視野"}, {"title": "白虎", "value": "白虎"}, {"title": "乳交", "value": "乳交"}, {"title": "制服", "value": "制服"}, {"title": "激烈淫亂", "value": "激烈淫亂"}, {"title": "手淫", "value": "手淫"}, {"title": "美臀", "value": "美臀"}, {"title": "逆袭", "value": "逆袭"}, {"title": "NTR戴綠帽", "value": "NTR戴綠帽"}, {"title": "NTR", "value": "NTR"}, {"title": "後入", "value": "後入"}, {"title": "接吻", "value": "接吻"}, {"title": "自慰", "value": "自慰"}, {"title": "顏射", "value": "顏射"}, {"title": "巨臀", "value": "巨臀"}, {"title": "虐恋", "value": "虐恋"}, {"title": "舔陰", "value": "舔陰"}, {"title": "不倫", "value": "不倫"}, {"title": "OL", "value": "OL"}, {"title": "黑絲", "value": "黑絲"}, {"title": "复仇", "value": "复仇"}, {"title": "極致高潮", "value": "極致高潮"}, {"title": "誘惑", "value": "誘惑"}, {"title": "亂倫", "value": "亂倫"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://5lxtv.com";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

var PATH_BY_ID = {
  "latest": "/latest",
  "censored": "/censored",
  "decensored": "/decensored",
  "uncensored": "/uncensored",
  "chinese": "/chinese",
  "uncensored-chinese": "/uncensored-chinese",
  "exclusive": "/exclusive",
  "selfie": "/selfie",
  "cuckold": "/cuckold",
  "amateur": "/amateur",
  "western": "/western",
  "anime": "/anime",
  "ai-drama": "/ai-drama",
  "of": "/of",
  "upzhu": "/upzhu",
  "scandal": "/scandal",
  "fc2": "/fc2",
  "cos": "/cos",
  "ai": "/ai",
  "ranking": "/ranking"
};

function t(v) {
  return String(v == null ? "" : v).trim();
}

function escHtml(s) {
  return String(s || "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return HOST + "/" + u;
}

async function getHtml(url, referer) {
  // 站方偶发 socket hang up，失败重试一次
  for (var att = 0; att < 2; att++) {
    try {
      var res = await Widget.http.get(url, {
        headers: {
          "User-Agent": UA,
          "Referer": referer || HOST + "/",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
        }
      });
      var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
      if (body) return body;
    } catch (e) { /* retry */ }
  }
  return "";
}

function parseList(html) {
  var list = [];
  if (!html) return list;
  // 卡片：<a href="/videos/<slug>"> ... <img src="...content-cover/<CODE>" alt="<title>">
  //   ... 时长 <span>2:32:53</span> ... 观看 ... 标题 ... 日期 2026-11-14
  var re = /<a href="\/videos\/([^"\/]+)"[^>]*>([\s\S]*?)<\/a>/g;
  var m;
  var seen = {};
  while ((m = re.exec(html)) !== null) {
    var slug = m[1];
    if (seen[slug]) continue;
    seen[slug] = 1;
    var block = m[2];
    var img = block.match(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/);
    var title = escHtml(img ? img[2] : "");
    if (!title) continue;
    var pic = img ? img[1] : (HOST + "/content-cover/" + slug.toUpperCase());
    var dur = block.match(/>(\d+:\d\d(?::\d\d)?)<\/span>/);
    var date = block.match(/>(\d{4}-\d{2}-\d{2})</);
    var link = HOST + "/videos/" + slug;
    list.push({
      id: link,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: dur ? dur[1] : (date ? date[1] : ""),
      mediaType: "movie"
    });
  }
  return list;
}

function parsePagecount(html) {
  if (!html) return 1;
  var pages = [];
  var re = /[?&]page=(\d+)/g;
  var m;
  while ((m = re.exec(html)) !== null) pages.push(parseInt(m[1], 10) || 1);
  if (!pages.length) return 1;
  return Math.max.apply(null, pages);
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "latest");
  var tag = t(params.sub || params.tag || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var url;
  if (zone === "tag" && tag) {
    url = HOST + "/tags/" + encodeURIComponent(tag) + "?page=" + page;
  } else {
    var path = PATH_BY_ID[zone] || "/latest";
    url = HOST + path + "?page=" + page;
  }
  try {
    var html = await getHtml(url);
    var list = parseList(html);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

async function search(params) {
  params = params || {};
  var wd = t(params.keyword || params.wd || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return emptyItem("请输入关键词");
  try {
    var html = await getHtml(HOST + "/search?q=" + encodeURIComponent(wd) + "&page=" + page);
    var list = parseList(html);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

function extractPlayParams(html) {
  if (!html) return null;
  var slug = (html.match(/var slug\s*=\s*"([^"]+)"/) || [])[1] || "";
  var tt = (html.match(/var t\s*=\s*(\d+)/) || [])[1] || "";
  var nn = (html.match(/var n\s*=\s*"([^"]+)"/) || [])[1] || "";
  if (!slug || !tt || !nn) return null;
  return { slug: slug, t: tt, n: nn };
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var durl = raw.indexOf("http") === 0 ? raw : HOST + "/videos/" + raw.replace(/^\/+/, "");
    var html = await getHtml(durl, durl);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var title = escHtml((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || "") ||
      escHtml((html.match(/<title>([^<]*) - 5lxtv<\/title>/) || [])[1] || "");
    var slug = (durl.match(/\/videos\/([^\/?#]+)/) || [])[1] || "";
    var pic = slug ? HOST + "/content-cover/" + slug.toUpperCase() : "";
    var dur = (html.match(/時長：([^<]+)/) || [])[1] || "";
    // 单档 720p（站内无多档位，不编造）；播单地址点播现取（t/n 时效），详情只存入口
    var id = durl + "@@PLAY";
    var result = {
      id: durl,
      type: "detail",
      title: title || slug,
      name: title || slug,
      description: dur ? ("時長：" + dur.trim()) : "",
      mediaType: "movie",
      link: durl,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app",
      episodes: [{ name: "720p", link: id }],
      seasons: [{ seasonNumber: 1, title: "720p", name: "720p", episodes: [{ title: "720p", episodeNumber: 1 }] }],
      episodeItems: [{
        id: id,
        type: "url",
        title: "720p",
        mediaType: "movie",
        posterPath: pic,
        link: id,
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1
      }],
      childItems: [{
        id: id,
        type: "url",
        title: "720p",
        mediaType: "movie",
        posterPath: pic,
        link: id,
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1
      }]
    };
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 档位入口：@@PLAY -> 现取详情页，提 slug/t/n，拼 /api/play 直链
  var at = raw.indexOf("@@PLAY");
  if (at >= 0) {
    var durl = raw.slice(0, at);
    var html = await getHtml(durl, durl);
    var p = extractPlayParams(html);
    if (!p) return [];
    var playUrl = HOST + "/api/play/" + encodeURIComponent(p.slug) + "?t=" + p.t + "&n=" + encodeURIComponent(p.n) + "&hls=1";
    return [{ name: "720p", url: playUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": durl } }];
  }
  // 直链 m3u8
  if (/\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  }
  // 兜底：详情地址 -> 取详情首线
  try {
    var det = await loadDetail(raw);
    var eps = det && det.episodeItems;
    if (eps && eps.length) {
      return await loadResource({ link: eps[0].id });
    }
  } catch (e) { /* fall through */ }
  return [];
}
