// 91porn for REX (lai_91porn v1.0.0)
// 移植自 mira-cat 蜘蛛 a91porn.js（只读蓝图），后端 https://a91porn.com/。
// 国产自拍/网黄视频站，服务端渲染 HTML，无登录墙。
// 详情页播放器 div 的 data-src 即 m3u8 直链，无需二次请求。
// 单档（AES-128 媒体清单，无多码率变体），只出一条播放线，不编造清晰度。
// 封面与 m3u8 均无 Referer 门禁，可直链。
// VIP 区 /vip/videos 为付费墙，不进模块。
// 分类：12 个排序 + 热门前 91 个标签（全部 792 个标签平铺太乱，只取前 91，蜘蛛同款）。

WidgetMetadata = {
  id: "lai_91porn",
  title: "91porn",
  description: "91porn：国产自拍站，12 排序 + 91 热门标签筛选，详情单线 m3u8 直链",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://a91porn.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "当前最热", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "remen" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "本月最热", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "benyue" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "91原创", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "yuanchuang" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "最近加精", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "jiajing" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "本月收藏", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "benyue-shoucang" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "收藏最多", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "jingdian" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "高清", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "gaoqing" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "每月最热", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "meiyue" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "本月讨论", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "taolun" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "10分钟以上", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "changpian" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "20分钟以上", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "chaochang" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "热门标签", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag:qinglv" }, { name: "sub", title: "标签", type: "enumeration", value: "qinglv", enumOptions: [{"title": "情侣", "value": "qinglv"}, {"title": "女上", "value": "nvshang"}, {"title": "3P", "value": "3p"}, {"title": "探花", "value": "tanhua"}, {"title": "高颜值", "value": "gaoyanzhi"}, {"title": "单男", "value": "dannan"}, {"title": "骚话", "value": "saohua"}, {"title": "网红", "value": "wanghong"}, {"title": "爆操", "value": "baocao"}, {"title": "足交", "value": "zujiao"}, {"title": "绿帽", "value": "lvmao"}, {"title": "清纯", "value": "qingchun"}, {"title": "骚穴", "value": "saoxue"}, {"title": "大鸡巴", "value": "dajiba"}, {"title": "长腿", "value": "zhangtui"}, {"title": "叫床", "value": "jiaochuang"}, {"title": "小母狗", "value": "xiaomugou"}, {"title": "大学", "value": "daxue"}, {"title": "御姐", "value": "yujie"}, {"title": "高跟", "value": "gaogen"}, {"title": "杭州", "value": "hangzhou"}, {"title": "微胖", "value": "weipang"}, {"title": "居家", "value": "jujia"}, {"title": "浪叫", "value": "langjiao"}, {"title": "阿姨", "value": "ayi"}, {"title": "女神", "value": "nvshen"}, {"title": "勾引", "value": "gouyin"}, {"title": "骚母狗", "value": "saomugou"}, {"title": "偷情", "value": "touqing"}, {"title": "眼镜", "value": "yanjing"}, {"title": "素人", "value": "suren"}, {"title": "老师", "value": "laoshi"}, {"title": "粉嫩", "value": "fennen"}, {"title": "姐姐", "value": "jiejie"}, {"title": "白领", "value": "bailing"}, {"title": "处女", "value": "chunv"}, {"title": "喷水", "value": "penshui"}, {"title": "群P", "value": "qun-p"}, {"title": "姿势", "value": "zishi"}, {"title": "情趣内衣", "value": "qingquneiyi"}, {"title": "打桩", "value": "dazhuang"}, {"title": "舔逼", "value": "tianbi"}, {"title": "口爆", "value": "koubao"}, {"title": "第一视角", "value": "diyishijiao"}, {"title": "模特", "value": "mote"}, {"title": "小姐姐", "value": "xiaojiejie"}, {"title": "夫妻", "value": "fuqi"}, {"title": "深喉", "value": "shenhou"}, {"title": "大屌", "value": "dadiao"}, {"title": "榨精", "value": "zhajing"}, {"title": "潮吹", "value": "chaochui"}, {"title": "白虎", "value": "baihu"}, {"title": "露出", "value": "luchu"}, {"title": "骚妻", "value": "saoqi"}, {"title": "肉丝", "value": "rousi"}, {"title": "媳妇", "value": "xifu"}, {"title": "户外", "value": "huwai"}, {"title": "小骚货", "value": "xiaosaohuo"}, {"title": "白浆", "value": "baijiang"}, {"title": "真实", "value": "zhenshi"}, {"title": "精神小妹", "value": "jingshenxiaomei"}, {"title": "肛交", "value": "gangjiao"}, {"title": "叫声", "value": "jiaosheng"}, {"title": "出差", "value": "chuchai"}, {"title": "颜射", "value": "yanshe"}, {"title": "闺蜜", "value": "guimi"}, {"title": "网黄", "value": "wanghuang"}, {"title": "制服", "value": "zhifu"}, {"title": "炮友", "value": "paoyou"}, {"title": "白嫩", "value": "bainen"}, {"title": "车震", "value": "chezhen"}, {"title": "健身", "value": "jianshen"}, {"title": "大奶子", "value": "danaizi"}, {"title": "金主", "value": "jinzhu"}, {"title": "同事", "value": "tongshi"}, {"title": "白丝", "value": "baisi"}, {"title": "打电话", "value": "dadianhua"}, {"title": "电话", "value": "dianhua"}, {"title": "小少妇", "value": "xiaoshaofu"}, {"title": "深圳", "value": "shenzhen"}, {"title": "剧情", "value": "juqing"}, {"title": "嫩妹", "value": "nenmei"}, {"title": "反差婊", "value": "fanchabiao"}, {"title": "良家", "value": "liangjia"}, {"title": "骚浪", "value": "saolang"}, {"title": "邻居", "value": "linju"}, {"title": "情趣", "value": "qingqu"}, {"title": "纹身", "value": "wenshen"}, {"title": "老板娘", "value": "laobanniang"}, {"title": "护士", "value": "hushi"}, {"title": "上位", "value": "shangwei"}, {"title": "淫水", "value": "yinshui"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://a91porn.com";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  return t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
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
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Referer": referer || HOST + "/"
      }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body;
  } catch (e) { return ""; }
}

// 列表地址：排序 /<段>/page/N，标签 /<slug>/page/N，最新即首页
function listUrl(zone, tag, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  var base = HOST + "/";
  if (tag) {
    base = HOST + "/" + tag + "/";
  } else if (zone) {
    base = HOST + "/" + zone + "/";
  }
  return page > 1 ? base + "page/" + page : base;
}

// 解析列表：<a class="p91-tilelink" href="https://a91porn.com/{id}"> 内含 img/alt/h3 标题/p91-tlen 时长
function parseList(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<a class="p91-tilelink"[^>]*href="https?:\/\/a91porn\.com\/(\d+)"[^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var id = m[1];
    if (seen[id]) continue;
    var body = m[2] || "";
    var pic = "";
    var im = body.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i)
      || body.match(/<source[^>]+srcset=["'](https?:\/\/[^"'\s,]+)/i);
    if (im) pic = im[1];
    if (!pic) continue;
    seen[id] = 1;
    var title = "";
    var hm = body.match(/<h3[^>]*>([^<]{2,200})<\/h3>/i)
      || body.match(/<img[^>]+alt=["']([^"']{2,200})["']/i);
    if (hm) title = decodeHtml(hm[1]);
    if (!title) title = "视频 " + id;
    var remarks = "";
    var dm = body.match(/<span class="p91-tlen">([^<]{1,12})<\/span>/i);
    if (dm) remarks = t(dm[1]);
    var link = HOST + "/" + id;
    out.push({
      id: link,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: remarks,
      mediaType: "movie"
    });
  }
  return out;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "");
  var tag = t(params.sub || params.tag || "");
  // 热门标签条目的 zone 是 tag:<slug> 形式，tag 参数优先
  if (!tag && zone.indexOf("tag:") === 0) tag = zone.slice(4);
  if (tag) zone = "";
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var html = await getHtml(listUrl(zone, tag, page));
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
    var url = HOST + "/search?q=" + encodeURIComponent(wd);
    if (page > 1) url += "&page=" + page;
    var html = await getHtml(url);
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

function extractTitle(html, fallback) {
  var m = html.match(/<h1 class="p91-vtitle">([^<]{2,200})<\/h1>/i);
  if (m) return decodeHtml(m[1]);
  m = html.match(/property=["']og:title["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  if (m) return decodeHtml(m[1]).replace(/\s*-\s*91porn\s*$/i, "");
  m = html.match(/<title>([^<]+)<\/title>/i);
  if (m) return decodeHtml(m[1]).replace(/\s*-\s*91porn\s*$/i, "");
  return fallback || "";
}

function extractCover(html) {
  var m = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (m) return absUrl(m[1]);
  return "";
}

function extractDesc(html) {
  var m = html.match(/property=["']og:description["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
  return m ? decodeHtml(m[1]) : "";
}

// 详情页播放器 div 的 data-src 即 m3u8 直链
function extractPlay(html) {
  var m = html.match(/<div class="p91-player"[^>]*data-src=["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/i);
  if (m) return m[1];
  m = html.match(/data-src=["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/i);
  return m ? m[1] : "";
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var vm = raw.match(/a91porn\.com\/(\d+)/) || raw.match(/(\d+)/);
    var vid = vm ? vm[1] : raw;
    if (!vid) return { id: raw, type: "url", title: "解析失败", description: "链接为空" };
    var pageUrl = HOST + "/" + vid;
    var html = await getHtml(pageUrl, pageUrl);
    if (!html) return { id: pageUrl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = extractTitle(html, vid);
    var pic = extractCover(html);
    var content = extractDesc(html);
    var m3u8 = extractPlay(html);
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    if (m3u8) {
      var id = pageUrl + "@@PLAY";
      eps.push({ name: "播放", link: id });
      seasonEps.push({ title: "播放", videoUrl: m3u8, episodeNumber: 1 });
      epItems.push({
        id: id,
        type: "url",
        title: "播放",
        mediaType: "movie",
        posterPath: pic,
        videoUrl: m3u8,
        link: id,
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system",
        customHeaders: { "User-Agent": UA, "Referer": HOST + "/" }
      });
    }
    var result = {
      id: pageUrl,
      type: "detail",
      title: name || vid,
      name: name || vid,
      description: content,
      mediaType: "movie",
      link: pageUrl,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app"
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "播放", name: "播放", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
      result.videoUrl = m3u8;
    }
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
  // 档位入口：@@PLAY -> 回详情取 data-src 直链
  var at = raw.indexOf("@@PLAY");
  if (at >= 0) {
    var durl = raw.slice(0, at);
    try {
      var det = await loadDetail(durl);
      var items = det && det.episodeItems;
      if (items && items.length && items[0].videoUrl) {
        return [{ name: "播放", url: items[0].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
      }
    } catch (e) { /* fall through */ }
    return [];
  }
  // 直链 m3u8
  if (/\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  }
  // 兜底：详情地址 -> 取详情首线
  try {
    var det2 = await loadDetail(raw);
    var eps = det2 && det2.episodeItems;
    if (eps && eps.length && eps[0].videoUrl) {
      return [{ name: "播放", url: eps[0].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
  } catch (e) { /* fall through */ }
  return [];
}
