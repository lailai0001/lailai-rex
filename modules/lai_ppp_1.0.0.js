// PPPHub for REX (lai_ppp v1.0.0)
// 移植自 mira-cat 蜘蛛 ppp.js（只读蓝图），后端：ppp.porn（亚洲素人成人影片）。
// 分类运行时本应动态抓 /categories/，REX 元数据是静态的，故按 2026-10-21 实抓的
// 33 个分类原样烤入 enumeration（标题含站方影片计数，与蜘蛛 type_name 口径一致）。
// 列表/搜索走站方 async block 接口；播放为详情页 <script> 内的 m3u8 直链。

WidgetMetadata = {
  id: "lai_ppp",
  title: "PPPHub",
  description: "PPPHub（ppp.porn）：33 个分类、站内搜索，播放为详情页 m3u8 直链",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://ppp.porn",
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
          value: "https://ppp.porn/categories/china-av/",
          enumOptions: [
            { title: "中國AV(8937 影片)", value: "https://ppp.porn/categories/china-av/" },
            { title: "日本片商(10988 影片)", value: "https://ppp.porn/categories/japan-producer/" },
            { title: "素人自拍(10919 影片)", value: "https://ppp.porn/categories/amateur/" },
            { title: "中國(16071 影片)", value: "https://ppp.porn/categories/china/" },
            { title: "台灣(1695 影片)", value: "https://ppp.porn/categories/taiwan/" },
            { title: "日本(11717 影片)", value: "https://ppp.porn/categories/japan/" },
            { title: "東南亞(562 影片)", value: "https://ppp.porn/categories/se-asia/" },
            { title: "韓國(411 影片)", value: "https://ppp.porn/categories/korea/" },
            { title: "香港(165 影片)", value: "https://ppp.porn/categories/hongkong/" },
            { title: "Cosplay(863 影片)", value: "https://ppp.porn/categories/cosplay/" },
            { title: "主播(791 影片)", value: "https://ppp.porn/categories/streamer/" },
            { title: "主觀視角(58 影片)", value: "https://ppp.porn/categories/first-person-pov/" },
            { title: "凌辱(832 影片)", value: "https://ppp.porn/categories/bdsm/" },
            { title: "劇情(7694 影片)", value: "https://ppp.porn/categories/drama/" },
            { title: "多P(2551 影片)", value: "https://ppp.porn/categories/threesome/" },
            { title: "探花(1161 影片)", value: "https://ppp.porn/categories/91-tanhua/" },
            { title: "流出(50 影片)", value: "https://ppp.porn/categories/released/" },
            { title: "無碼(6661 影片)", value: "https://ppp.porn/categories/uncensored/" },
            { title: "百合(88 影片)", value: "https://ppp.porn/categories/lesbian/" },
            { title: "野外露出(436 影片)", value: "https://ppp.porn/categories/exhibitionists/" },
            { title: "OL(1355 影片)", value: "https://ppp.porn/categories/office-lady/" },
            { title: "動漫(180 影片)", value: "https://ppp.porn/categories/acg/" },
            { title: "古裝(151 影片)", value: "https://ppp.porn/categories/costume/" },
            { title: "女僕(529 影片)", value: "https://ppp.porn/categories/maid/" },
            { title: "學生(2375 影片)", value: "https://ppp.porn/categories/student/" },
            { title: "旗袍(262 影片)", value: "https://ppp.porn/categories/cheongsam/" },
            { title: "獸耳(580 影片)", value: "https://ppp.porn/categories/kemonomimi/" },
            { title: "瑜伽褲(200 影片)", value: "https://ppp.porn/categories/yoga-pants/" },
            { title: "真理褲(141 影片)", value: "https://ppp.porn/categories/dolfin-shorts/" },
            { title: "空姐(110 影片)", value: "https://ppp.porn/categories/flight-attendant/" },
            { title: "絲襪(6373 影片)", value: "https://ppp.porn/categories/pantyhose/" },
            { title: "護士(311 影片)", value: "https://ppp.porn/categories/nurse/" },
            { title: "過膝襪(1953 影片)", value: "https://ppp.porn/categories/knee-socks/" }
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

var HOST = "https://ppp.porn/pp1";
// 搜索接口现行地址在根域名下（/pp1 前缀下的同名搜索地址 2026-10-21 实测 404，
// 根域名 async block 正常出卡且翻页有效），故搜索单独用根域名，其余与蜘蛛一致。
var SEARCH_HOST = "https://ppp.porn";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1.1 Mobile/15E148 Safari/604.1";

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": referer || HOST + "/"
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
  var res = await Widget.http.get(url, { headers: pageHeaders(HOST + "/") });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function parseItems(html, containerId) {
  var out = [];
  var $;
  try { $ = Widget.html.load(html); } catch (_) { return out; }
  $("#" + containerId + " .item").each(function (_, element) {
    var $el = $(element);
    var title = $el.find("h4 a").text().replace(/\s+/g, " ").trim();
    var href = $el.find("h4 a").attr("href") || "";
    if (!title || !href) return;
    var cover = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
    var duration = $el.find(".card-video__duration").text().replace(/\s+/g, " ").trim();
    var link = absUrl(href);
    out.push({
      id: link,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: link,
      description: duration || "",
      releaseDate: duration || "",
      mediaType: "movie"
    });
  });
  return out;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var href = String(params.path || "https://ppp.porn/categories/china-av/");
  var url = absUrl(href) + "?mode=async&function=get_block&block_id=list_videos_common_videos_list&sort_by=post_date&from=" + page;
  try {
    var html = await fetchText(url);
    var list = parseItems(html, "list_videos_common_videos_list_items");
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
  var text = encodeURIComponent(keyword);
  var url = SEARCH_HOST + "/search/" + text + "/?mode=async&function=get_block&block_id=list_videos_videos_list_search_result&q=" + text + "&category_ids=&sort_by=&from_videos=" + page + "&from_albums=" + page;
  try {
    var html = await fetchText(url);
    var list = parseItems(html, "list_videos_videos_list_search_result_items");
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// 从详情页 <script> 中提取 m3u8 地址（与蜘蛛 extractM3u8 同口径：
// 优先宽松模式保留完整 URL 含 token 查询串，取不到再回退严格模式）
function extractM3u8(html) {
  var found = "";
  var re = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  var m;
  while (!found && (m = re.exec(html)) !== null) {
    var content = m[1] || "";
    if (content.indexOf(".m3u8") < 0) continue;
    var hit = content.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/) || content.match(/https?:\/\/[\w./-]+\.m3u8/);
    if (hit && hit[0]) found = hit[0];
  }
  return found;
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
    if (!title) {
      var tm = html.match(/<title[^>]*>([^<]+)/i);
      title = tm ? tm[1].replace(/\s*[|—–-].*$/, "").trim() : "PPPHub";
    }
    var videoUrl = extractM3u8(html);
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
        "Referer": HOST + "/"
      }
    };
  } catch (e) {
    return { id: url, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
