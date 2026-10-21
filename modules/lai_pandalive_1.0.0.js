// PandaLive for REX (lai_pandalive v1.0.0)
// 来源蓝图: mira-cat 蜘蛛 pandalive.js (py_pandalive), 只读移植, 未改动原蜘蛛。
// 后端: 数据镜像站 https://5721004.xyz (蜘蛛写死地址, 原样沿用)
//       列表 /player/list.json (在线房间 JSON), 播放 /player/list.m3u (站方公开播放列表, 按主播 id 查直链)。
// 与蜘蛛一致: 只做公开数据的转发解析, 不登录、不伪造任何凭证。
// 差异: 蜘蛛在 detail 里给出「直连 + 6 条第三方代理」多条线路让播放器选,
//       REX 的 loadDetail 只收一条 videoUrl, 按蜘蛛顺序取第一条「直连」;
//       第三方代理 (515355.xyz) 未带入, 详见报告。

WidgetMetadata = {
  id: "lai_pandalive",
  title: "PandaLive",
  description: "PandaLive（pandalive.co.kr）韩国直播：在线房间列表，可按类型（19+/密码房/粉丝房）与热度排序",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://5721004.xyz",
  detailCacheDuration: 60,
  modules: [
    {
      title: "🐼 PandaTV",
      functionName: "loadList",
      cacheDuration: 60,
      params: [
        {
          name: "type",
          title: "类型",
          type: "enumeration",
          value: "all",
          enumOptions: [
            { title: "全部", value: "all" },
            { title: "🔞 19+", value: "adult" },
            { title: "🔐 密码房", value: "pw" },
            { title: "💎 粉丝房", value: "fan" }
          ]
        },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "user-desc",
          enumOptions: [
            { title: "观众量 ↓", value: "user-desc" },
            { title: "实时热度 ↓", value: "totalScoreCnt-desc" },
            { title: "关注量 ↓", value: "bookmarkCnt-desc" }
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
      { name: "keyword", title: "主播名/ID", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

var HOST = "https://5721004.xyz";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var PAGE_SIZE = 30;
var DEFAULT_PIC = "https://tupian.li/images/2024/03/30/660769b1ba623.png";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "application/json,text/plain,*/*",
    "Accept-Language": "ko-KR,ko;q=0.9,zh-CN;q=0.8",
    "Referer": "https://www.pandalive.co.kr/",
    "Origin": "https://www.pandalive.co.kr"
  };
}

function playHeaders() {
  return {
    "User-Agent": UA,
    "Referer": "https://www.pandalive.co.kr/",
    "Origin": "https://www.pandalive.co.kr"
  };
}

// 拉在线房间列表 (与蜘蛛 fetchJsonData 同口径), 返回内部记录数组
async function fetchRooms() {
  var res = await Widget.http.get(HOST + "/player/list.json", { headers: pageHeaders() });
  var data = res && res.data != null ? res.data : "";
  var obj = typeof data === "object" ? data : JSON.parse(String(data || "{}"));
  var rawList = obj.list || [];
  return rawList.map(function (item) {
    return {
      userId: item.userId || "",
      nick: item.userNick || "未知主播",
      title: item.title || "无标题",
      thumb: item.thumbUrl || DEFAULT_PIC,
      isAdult: !!item.isAdult,
      isPw: !!item.isPw,
      type: item.type || "",
      user: item.user || 0,
      score: item.totalScoreCnt || 0,
      bookmark: item.bookmarkCnt || 0
    };
  }).filter(function (r) { return !!r.userId; });
}

function toCard(r) {
  var id = "live_" + r.userId;
  var remarks = "👤 " + r.user + (r.isAdult ? " 🔞" : "") + (r.isPw ? " 🔐" : "");
  return {
    id: id,
    type: "url",
    title: "📺 " + r.nick,
    posterPath: r.thumb,
    coverUrl: r.thumb,
    backdropPath: r.thumb,
    link: id,
    description: r.title + "（" + remarks + "）",
    mediaType: "movie"
  };
}

async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var fType = String(params.type || "all");
  var sortType = String(params.sort || "user-desc");
  try {
    var filtered = await fetchRooms();
    if (fType === "adult") filtered = filtered.filter(function (v) { return v.isAdult; });
    else if (fType === "pw") filtered = filtered.filter(function (v) { return v.isPw; });
    else if (fType === "fan") filtered = filtered.filter(function (v) { return v.type === "fan"; });

    if (sortType === "user-desc") filtered.sort(function (a, b) { return b.user - a.user; });
    else if (sortType === "totalScoreCnt-desc") filtered.sort(function (a, b) { return b.score - a.score; });
    else if (sortType === "bookmarkCnt-desc") filtered.sort(function (a, b) { return b.bookmark - a.bookmark; });

    var start = (page - 1) * PAGE_SIZE;
    var pageList = start < filtered.length ? filtered.slice(start, start + PAGE_SIZE) : [];
    return pageList.length ? pageList.map(toCard) : [{ id: "empty", type: "url", title: "没有在线房间" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg }];
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
  var wd = pickKeyword(params).toLowerCase();
  if (!wd) return [{ id: "tip", type: "url", title: "输入主播名或 ID 搜索" }];
  try {
    var all = await fetchRooms();
    var res = all.filter(function (v) {
      return ("📺 " + v.nick).toLowerCase().indexOf(wd) >= 0 || v.userId.toLowerCase().indexOf(wd) >= 0;
    }).slice(0, 50);
    return res.length ? res.map(toCard) : [{ id: "empty", type: "url", title: "没有找到相关主播" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg }];
  }
}

// 在站方公开播放列表 (list.m3u) 里按蜘蛛两段式逻辑查主播的直链
async function findStreamUrl(userId) {
  var res = await Widget.http.get(HOST + "/player/list.m3u", { headers: pageHeaders() });
  var text = res && res.data != null ? String(res.data) : "";
  var lines = text.split("\n");
  var i;
  for (i = 0; i < lines.length; i++) {
    if (lines[i].indexOf("," + userId + ",") >= 0 && i + 1 < lines.length) {
      return String(lines[i + 1] || "").trim();
    }
  }
  for (i = 0; i < lines.length; i++) {
    if (lines[i].indexOf(userId) >= 0 && i + 1 < lines.length) {
      return String(lines[i + 1] || "").trim();
    }
  }
  return "";
}

async function loadDetail(link) {
  var rawId = String(link || "");
  var userId = rawId.replace(/^live_/, "");
  if (!userId) {
    return { id: rawId || "err", type: "url", title: "解析失败", description: "未找到播放地址" };
  }
  try {
    // 先从房间列表补标题/封面 (与蜘蛛同一个 list.json 数据源)
    var title = "PandaTV - " + userId;
    var cover = DEFAULT_PIC;
    var desc = "主播: " + userId;
    try {
      var rooms = await fetchRooms();
      for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].userId === userId) {
          title = "📺 " + rooms[i].nick;
          cover = rooms[i].thumb;
          desc = rooms[i].title;
          break;
        }
      }
    } catch (_) {}

    var streamUrl = await findStreamUrl(userId);
    if (!streamUrl) {
      return { id: rawId, type: "url", title: title, description: "未找到播放地址（该主播不在站方播放列表中）" };
    }
    return {
      id: rawId,
      type: "detail",
      title: title,
      link: rawId,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: streamUrl,
      playerType: "app",
      customHeaders: playHeaders()
    };
  } catch (e) {
    return { id: rawId, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
