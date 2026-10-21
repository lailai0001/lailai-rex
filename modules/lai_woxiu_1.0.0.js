// 我秀直播 for REX (lai_woxiu v1.0.0)
// 来源蓝图: mira-cat 蜘蛛 woxiu.js (py_woxiu), 只读移植, 未改动原蜘蛛。
// 后端: https://www.woxiu.com PC 端接口 (蜘蛛口径, 只用 www 主站, 不用 m.woxiu.com)
//   列表: /index.php?action=Index/Main&do=ApiZhuboGradeNew(&gtype=N) / ApiGameRoom, JSON
//   详情: /index.php?action=M/Live&do=LiveInfo&room_id=<rid>, JSON, live_stream 即 HLS 主列表
//   搜索: /index.php?action=Search&q=<kw>&search_type=roomid|nickname, HTML 正则解析 (沿用蜘蛛)
// 差异: 蜘蛛 detail 给 HLS + FLV 两条线路, REX loadDetail 只收一条 videoUrl, 取蜘蛛排第一的 HLS;
//       蜘蛛用 Android UA, 模块按 REX 规范用 iPhone Safari UA (接口与播放列表实测均可达);
//       搜索/详情返回的图片有 http:// 形态, 实测同路径 https 可达, 模块统一升 https。

WidgetMetadata = {
  id: "lai_woxiu",
  title: "我秀直播",
  description: "我秀直播（woxiu.com）：全部主播/巨星/明星/钻石/红心/游戏主播在线房间，点开即看直播",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://www.woxiu.com",
  detailCacheDuration: 60,
  modules: [
    {
      title: "全部主播",
      functionName: "loadList",
      cacheDuration: 60,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "grade_all" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "巨星",
      functionName: "loadList",
      cacheDuration: 60,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "grade_4" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "明星",
      functionName: "loadList",
      cacheDuration: 60,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "grade_3" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "钻石",
      functionName: "loadList",
      cacheDuration: 60,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "grade_2" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "红心",
      functionName: "loadList",
      cacheDuration: 60,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "grade_1" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "游戏主播",
      functionName: "loadList",
      cacheDuration: 60,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "game" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "搜索主播",
      functionName: "search",
      cacheDuration: 60,
      params: [
        { name: "keyword", title: "房号或昵称", type: "input", value: "" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    }
  ],
  search: {
    title: "搜索",
    functionName: "search",
    params: [
      { name: "keyword", title: "房号或昵称", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

var PC_HOST = "https://www.woxiu.com";
var PC_API = PC_HOST + "/index.php?action=Index/Main&do=";
var LIVE_API = PC_HOST + "/index.php?action=M/Live&do=LiveInfo&room_id=";
var SEARCH_URL = PC_HOST + "/index.php?action=Search&q=";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

var PC_DO = {
  grade_all: "ApiZhuboGradeNew",
  grade_4: "ApiZhuboGradeNew&gtype=4",
  grade_3: "ApiZhuboGradeNew&gtype=3",
  grade_2: "ApiZhuboGradeNew&gtype=2",
  grade_1: "ApiZhuboGradeNew&gtype=1",
  game: "ApiGameRoom"
};

function t(v) {
  return String(v == null ? "" : v).trim();
}

function toInt(v, d) {
  var n = parseInt(String(v).trim(), 10);
  return isNaN(n) ? (d || 0) : n;
}

function fixPic(url) {
  url = t(url).replace(/\\\//g, "/");
  if (!url) return "";
  if (url.indexOf("//") === 0) url = "https:" + url;
  // 站方部分接口回 http:// 图片, 实测同路径 https 可达, 统一升 https 保证封面可显示
  if (url.indexOf("http://") === 0) url = "https://" + url.slice(7);
  return url;
}

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": PC_HOST + "/"
  };
}

async function getJson(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var data = res && res.data != null ? res.data : "";
  if (typeof data === "object") return data;
  try { return JSON.parse(String(data || "{}")); } catch (e) { return {}; }
}

async function getText(url) {
  var res = await Widget.http.get(url, {
    headers: {
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9",
      "Referer": PC_HOST + "/"
    }
  });
  return res && res.data != null ? String(res.data) : "";
}

function roomCard(rid, name, pic, online, count, extra) {
  var remark = online ? ("👥 " + (count > 0 ? count : "直播中")) : "未开播";
  return {
    id: "woxiu:" + rid,
    type: "url",
    title: name || ("房间" + rid),
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    link: "woxiu:" + rid,
    description: remark + (extra ? " · " + extra : ""),
    mediaType: "movie"
  };
}

async function loadList(params) {
  params = params || {};
  var cat = t(params.cat || params.path) || "grade_all";
  var page = Math.max(1, toInt(params.page, 1));
  var d = PC_DO[cat];
  if (!d) return [{ id: "empty", type: "url", title: "分类不存在" }];
  try {
    var payload = await getJson(PC_API + d + "&page=" + page);
    var rows = (payload && payload.data) || [];
    var out = [];
    for (var i = 0; i < rows.length; i++) {
      var j = rows[i];
      var rid = t(j.room_id);
      if (!rid) continue;
      out.push(roomCard(
        rid,
        t(j.name) || ("房间" + rid),
        fixPic(j.room_img || j.index_img),
        toInt(j.online) === 1,
        toInt(j.count),
        t(j.game_name)
      ));
    }
    return out.length ? out : [{ id: "empty", type: "url", title: "没有在线房间" }];
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

// 沿用蜘蛛 parseSearchCards 的 <li> 正则口径
function parseSearchCards(html) {
  var cards = [];
  if (!html) return cards;
  var blocks = html.match(/<li>([\s\S]*?)<\/li>/g) || [];
  var seen = {};
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    var m = b.match(/href="https?:\/\/(?:www|m)\.woxiu\.com\/(\d+)"/);
    if (!m || seen[m[1]]) continue;
    seen[m[1]] = true;
    var rid = m[1];
    var name = "";
    var am = b.match(/alt="([^"]*)"/) || b.match(/<i>([^<]*)<\/i>/);
    if (am) name = am[1].trim();
    var im = b.match(/<img[^>]+src="([^"]+)"/);
    var online = b.indexOf("online_icon") >= 0;
    var hm = b.match(/人气：\s*(\d+)/);
    cards.push(roomCard(rid, name || ("房间" + rid), fixPic(im ? im[1] : ""), online, hm ? toInt(hm[1]) : 0, ""));
  }
  return cards;
}

async function search(params) {
  params = params || {};
  var kw = pickKeyword(params);
  var page = Math.max(1, toInt(params.page, 1));
  if (!kw) return [{ id: "tip", type: "url", title: "输入房号或主播昵称搜索" }];
  var stype = /^\d+$/.test(kw) ? "roomid" : "nickname";
  try {
    var url = SEARCH_URL + encodeURIComponent(kw) + "&search_type=" + stype;
    if (page > 1) url += "&page=" + page;
    var cards = parseSearchCards(await getText(url));
    if (!cards.length && stype === "roomid") {
      var url2 = SEARCH_URL + encodeURIComponent(kw) + "&search_type=nickname";
      if (page > 1) url2 += "&page=" + page;
      cards = parseSearchCards(await getText(url2));
    }
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关主播" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

async function loadDetail(link) {
  var raw = String(link || "");
  var rid = raw.replace(/^woxiu:/, "").replace(/^https?:\/\/(?:www|m)\.woxiu\.com\//, "").replace(/[^\d].*$/, "");
  if (!rid) {
    return { id: raw || "err", type: "url", title: "参数错误", description: "未找到播放地址" };
  }
  var id = "woxiu:" + rid;
  try {
    var info = await getJson(LIVE_API + encodeURIComponent(rid));
    if (!info || !t(info.zb_nickname || info.room_id)) {
      return { id: id, type: "url", title: "房间" + rid, description: "直播间信息加载失败，请重试" };
    }
    var online = toInt(info.online) === 1;
    var stream = t(info.live_stream).replace(/\\\//g, "/");
    var nickname = t(info.zb_nickname) || ("房间" + rid);
    var count = toInt(info.viewer_count);
    var pic = fixPic(info.room_img || info.zb_photo);
    var content = "房号：" + rid + " · 主播：" + nickname + " · 人气：" + (count > 0 ? count : "—") + " · 平台：我秀直播（woxiu.com）";
    if (!online || !stream) {
      return { id: id, type: "url", title: nickname, posterPath: pic, coverUrl: pic, backdropPath: pic, description: "主播未开播" };
    }
    return {
      id: id,
      type: "detail",
      title: nickname,
      link: id,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: content,
      videoUrl: stream,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": PC_HOST + "/"
      }
    };
  } catch (e) {
    return { id: id, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
