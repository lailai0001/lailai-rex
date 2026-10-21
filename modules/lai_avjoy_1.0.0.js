// AVJOY for REX (lai_avjoy v1.0.0, 移植自 mira-cat 蜘蛛 py_avjoy)
// 后端：https://avjoy.me，HTML 页面正则解析。
// 功能：17 个分类 + 14 个热门标签 + 搜索；
// 播放：media-cdn3 的 mp4 token 实时变化，loadDetail 时实时抓详情页 <source>，
// H264 优先、同编码取最高分辨率，带 Referer 播放。

WidgetMetadata = {
  id: "lai_avjoy",
  title: "AVJOY",
  description: "AVJOY（avjoy.me）：17 分类 + 热门标签，播放实时解析、H264 优先最高画质",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://avjoy.me",
  detailCacheDuration: 180,
  modules: [
    {
      title: "全部",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "" },
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
          value: "jav",
          enumOptions: [
            { title: "JAV・日本AV", value: "jav" },
            { title: "China・中國", value: "china" },
            { title: "Asian・アジア", value: "asian" },
            { title: "Japan・日本", value: "japan" },
            { title: "Uncensored・無修正", value: "uncensored" },
            { title: "Pornstar·AV女優", value: "pornstar" },
            { title: "Big Tits・巨乳", value: "big-tits" },
            { title: "Amateur・素人", value: "amateur" },
            { title: "Korea・韓国", value: "korea" },
            { title: "Anime・アニメ", value: "anime" },
            { title: "Schoolgirl・女子校生", value: "schoolgirl" },
            { title: "Teen・少女", value: "teen" },
            { title: "Mature・熟女", value: "mature" },
            { title: "Wife・人妻", value: "wife" },
            { title: "Cosplay・コスプレ", value: "cosplay" },
            { title: "Anal・肛交", value: "anal" },
            { title: "SM", value: "sm" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "标签",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "标签",
          type: "enumeration",
          value: "tag_中文字幕",
          enumOptions: [
            { title: "中文字幕", value: "tag_中文字幕" },
            { title: "口交", value: "tag_口交" },
            { title: "潮吹", value: "tag_潮吹" },
            { title: "舔穴", value: "tag_舔穴" },
            { title: "中出內射", value: "tag_中出內射" },
            { title: "國產av", value: "tag_國產av" },
            { title: "台灣", value: "tag_台灣" },
            { title: "自拍", value: "tag_自拍" },
            { title: "無碼破解", value: "tag_無碼破解" },
            { title: "探花", value: "tag_探花" },
            { title: "swag", value: "tag_swag" },
            { title: "無碼流出", value: "tag_無碼流出" },
            { title: "巨乳", value: "tag_巨乳" },
            { title: "制服", value: "tag_制服" }
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

var BASE = "https://avjoy.me";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-TW,zh;q=0.9,ja;q=0.8,en;q=0.7",
    "Referer": BASE + "/"
  };
}

function playHeaders() {
  return {
    "User-Agent": UA,
    "Referer": BASE + "/"
  };
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function clean(s) {
  return String(s == null ? "" : s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function mainArea(html) {
  var body = String(html || "");
  var i = body.indexOf("well-filters");
  if (i > 0) body = body.slice(i);
  var j = body.indexOf("content-right");
  if (j > 0) body = body.slice(0, j);
  return body;
}

// 与蜘蛛 parseCards 相同的窗口正则：/video/{id}/ 链接 + 2600 字符窗口内的图/标题/时长/播放量
function parseCards(html) {
  var body = mainArea(html);
  var out = [];
  var seen = {};
  var re = /<a href="\/video\/(\d+)\/[^"]*"/g;
  var m;
  while ((m = re.exec(body)) !== null) {
    var vid = m[1];
    if (seen[vid]) continue;
    seen[vid] = 1;
    var win = body.slice(m.index, m.index + 2600);
    var imgM = win.match(/<img[^>]+src="([^"]+)"/);
    var titleM = win.match(/class="content-title">([^<]+)</);
    if (!titleM) titleM = win.match(/<img[^>]+title="([^"]*)"/);
    var durM = win.match(/class="duration">([\s\S]*?)<\/div>/);
    var viewsM = win.match(/class="content-views">\s*([^<]*?)\s*<\/span>/);
    var remark = durM ? clean(durM[1]) : "";
    var vs = viewsM ? clean(viewsM[1]) : "";
    if (vs) remark = (remark ? remark + " · " : "") + vs;
    var link = BASE + "/video/" + vid;
    var pic = imgM ? imgM[1] : "";
    out.push({
      id: link,
      type: "url",
      title: titleM ? clean(titleM[1]) : "AVJOY " + vid,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: remark,
      releaseDate: durM ? clean(durM[1]) : "",
      mediaType: "movie"
    });
  }
  return out;
}

function listUrl(path, page) {
  var url;
  path = String(path || "");
  if (path.indexOf("tag_") === 0) {
    url = BASE + "/search/videos/" + encodeURIComponent(path.slice(4)) + "/1";
  } else if (path) {
    url = BASE + "/videos/" + encodeURIComponent(path);
  } else {
    url = BASE + "/videos";
  }
  if (page > 1) url += "?page=" + page;
  return url;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var url = listUrl(params.path || "", page);
  try {
    var html = await fetchText(url);
    var cards = parseCards(html);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
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
  var url = BASE + "/search/videos/" + encodeURIComponent(keyword) + "/1";
  if (page > 1) url += "?page=" + page;
  try {
    var html = await fetchText(url);
    var cards = parseCards(html);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// 与蜘蛛 parseSources 相同：收集 <source>，H264 优先；同编码内按 res 从高到低（取最高画质）
function parseSources(html) {
  var items = [];
  var re = /<source\b[^>]*>/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var tag = m[0];
    var srcM = tag.match(/src=["']([^"']+)["']/);
    if (!srcM) continue;
    var u = srcM[1];
    var labM = tag.match(/label=["']([^"']*)["']/);
    var resM = tag.match(/res=["']([^"']*)["']/);
    var res = resM ? parseInt(resM[1], 10) || 0 : 0;
    if (!res && labM) {
      var rm = labM[1].match(/(\d{3,4})/);
      if (rm) res = parseInt(rm[1], 10) || 0;
    }
    items.push({ codec: u.indexOf("/av1/") >= 0 ? "AV1" : "H264", res: res, u: u });
  }
  var h264 = items.filter(function (x) { return x.codec === "H264"; });
  var av1 = items.filter(function (x) { return x.codec === "AV1"; });
  var byRes = function (a, b) { return b.res - a.res; };
  h264.sort(byRes);
  av1.sort(byRes);
  return h264.concat(av1);
}

async function loadDetail(link) {
  var url0 = String(link || "");
  try {
    var idM = url0.match(/\/video\/(\d+)/);
    var vid = idM ? idM[1] : url0.replace(/\D/g, "");
    if (!vid) {
      return { id: url0 || "err", type: "url", title: "解析失败", description: "链接里没有影片 id" };
    }
    var pageUrl = BASE + "/video/" + vid;
    // token 每次请求都会变，必须实时抓详情页（不缓存）
    var html = await fetchText(pageUrl);

    var titleM = html.match(/<div class="well-filters video-title"[^>]*>\s*<h1>([\s\S]*?)<\/h1>/);
    if (!titleM) titleM = html.match(/<h1>([\s\S]*?)<\/h1>/);
    var title = titleM ? clean(titleM[1]) : "AVJOY " + vid;

    var pic = "";
    var picM = html.match(/itemprop="thumbnailUrl" content="([^"]+)"/) || html.match(/poster="([^"]+)"/);
    if (picM) pic = picM[1];

    var desc = "";
    var descM = html.match(/class="[^"]*video-description"[^>]*>\s*<p>([\s\S]*?)<\/p>/);
    if (descM) desc = clean(descM[1]);

    var sources = parseSources(html);
    if (!sources.length) {
      return { id: pageUrl, type: "url", title: title || "解析失败", description: "未找到播放地址" };
    }
    var best = sources[0];
    return {
      id: pageUrl,
      type: "detail",
      title: title,
      link: pageUrl,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      videoUrl: best.u,
      playerType: "app",
      description: desc || title,
      customHeaders: playHeaders()
    };
  } catch (e) {
    return { id: url0 || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
