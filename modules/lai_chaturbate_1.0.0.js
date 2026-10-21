// Chaturbate for REX (lai_chaturbate v1.0.0)
// 来源蓝图: mira-cat 蜘蛛 chaturbate.js (py_chaturbate), 只读移植, 未改动原蜘蛛。
// 后端: https://chaturbate.com 站方前端公开接口
//       列表 /api/ts/roomlist/room-list/ (游客视图), 详情 /api/chatvideocontext/{username}/。
//       只收录 current_show==='public' 且无密码的公开直播间; 私密/票秀/密码房不收, 不伪造任何凭证。
// 播放差异 (重要): 猫源第二版靠猫服务端本地代理把 LL-HLS 主列表裁到最高档再返回;
//       REX 没有服务端, 本模块 loadDetail 直接返回站方主列表 (hls_source) URL,
//       最高档 (1080p) 在列表内, 由播放器自选档位 —— 可能从低档起播, 画质不如猫源锁定版, 详见报告。
// 搜索: 复用列表接口的 keywords 参数 (站内搜索, 匹配用户名/标题)。

WidgetMetadata = {
  id: "lai_chaturbate",
  title: "Chaturbate",
  description: "Chaturbate 公开直播：大类/地区/年龄/标签共 48 个分类，播放直连站方主列表",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://chaturbate.com",
  detailCacheDuration: 180,
  modules: [
  {
    "title": "精选",
    "functionName": "loadList",
    "cacheDuration": 180,
    "params": [
      {
        "name": "cat",
        "title": "分类",
        "type": "enumeration",
        "value": "all",
        "enumOptions": [
          {
            "title": "推荐",
            "value": "all"
          },
          {
            "title": "女生",
            "value": "g:f"
          },
          {
            "title": "男生",
            "value": "g:m"
          },
          {
            "title": "情侣",
            "value": "g:c"
          },
          {
            "title": "跨性别",
            "value": "g:t"
          },
          {
            "title": "亚洲女生",
            "value": "gr:f:AS"
          },
          {
            "title": "新人",
            "value": "new"
          },
          {
            "title": "游戏",
            "value": "gaming"
          },
          {
            "title": "展示",
            "value": "exhib"
          }
        ]
      },
      {
        "name": "page",
        "title": "页码",
        "type": "page",
        "value": "1"
      }
    ]
  },
  {
    "title": "地区",
    "functionName": "loadList",
    "cacheDuration": 180,
    "params": [
      {
        "name": "cat",
        "title": "分类",
        "type": "enumeration",
        "value": "r:AS",
        "enumOptions": [
          {
            "title": "亚洲",
            "value": "r:AS"
          },
          {
            "title": "北美",
            "value": "r:NA"
          },
          {
            "title": "南美",
            "value": "r:SA"
          },
          {
            "title": "欧洲·俄罗斯",
            "value": "r:ER"
          },
          {
            "title": "其他地区",
            "value": "r:O"
          }
        ]
      },
      {
        "name": "page",
        "title": "页码",
        "type": "page",
        "value": "1"
      }
    ]
  },
  {
    "title": "年龄",
    "functionName": "loadList",
    "cacheDuration": 180,
    "params": [
      {
        "name": "cat",
        "title": "分类",
        "type": "enumeration",
        "value": "age:18:22",
        "enumOptions": [
          {
            "title": "18-21岁",
            "value": "age:18:22"
          },
          {
            "title": "20-30岁",
            "value": "age:20:31"
          },
          {
            "title": "30-50岁",
            "value": "age:30:51"
          },
          {
            "title": "成熟50+",
            "value": "age:50:100"
          }
        ]
      },
      {
        "name": "page",
        "title": "页码",
        "type": "page",
        "value": "1"
      }
    ]
  },
  {
    "title": "标签",
    "functionName": "loadList",
    "cacheDuration": 180,
    "params": [
      {
        "name": "cat",
        "title": "分类",
        "type": "enumeration",
        "value": "tag:lovense",
        "enumOptions": [
          {
            "title": "标签·互动玩具",
            "value": "tag:lovense"
          },
          {
            "title": "标签·巨乳",
            "value": "tag:bigboobs"
          },
          {
            "title": "标签·潮吹",
            "value": "tag:squirt"
          },
          {
            "title": "标签·亚洲",
            "value": "tag:asian"
          },
          {
            "title": "标签·肛交",
            "value": "tag:anal"
          },
          {
            "title": "标签·大屁股",
            "value": "tag:bigass"
          },
          {
            "title": "标签·瘦",
            "value": "tag:skinny"
          },
          {
            "title": "标签·天然",
            "value": "tag:natural"
          },
          {
            "title": "标签·恋足",
            "value": "tag:feet"
          },
          {
            "title": "标签·拉丁",
            "value": "tag:latina"
          },
          {
            "title": "标签·熟女",
            "value": "tag:milf"
          },
          {
            "title": "标签·小胸",
            "value": "tag:smalltits"
          },
          {
            "title": "标签·金发",
            "value": "tag:blonde"
          },
          {
            "title": "标签·射精",
            "value": "tag:cum"
          },
          {
            "title": "标签·大屌",
            "value": "tag:bigcock"
          },
          {
            "title": "标签·多毛",
            "value": "tag:hairy"
          },
          {
            "title": "标签·深喉",
            "value": "tag:deepthroat"
          },
          {
            "title": "标签·娇小",
            "value": "tag:petite"
          },
          {
            "title": "标签·大胸",
            "value": "tag:bigtits"
          },
          {
            "title": "标签·炮机",
            "value": "tag:fuckmachine"
          },
          {
            "title": "标签·棕发",
            "value": "tag:brunette"
          },
          {
            "title": "标签·黑珍珠",
            "value": "tag:ebony"
          },
          {
            "title": "标签·红发",
            "value": "tag:redhead"
          },
          {
            "title": "标签·熟龄",
            "value": "tag:mature"
          },
          {
            "title": "标签·肌肉",
            "value": "tag:muscle"
          },
          {
            "title": "标签·哥特",
            "value": "tag:goth"
          },
          {
            "title": "标签·角色扮演",
            "value": "tag:cosplay"
          },
          {
            "title": "标签·BDSM",
            "value": "tag:bdsm"
          },
          {
            "title": "标签·小鲜肉",
            "value": "tag:twink"
          },
          {
            "title": "标签·口交",
            "value": "tag:blowjob"
          }
        ]
      },
      {
        "name": "page",
        "title": "页码",
        "type": "page",
        "value": "1"
      }
    ]
  },
  {
    "title": "搜索",
    "functionName": "search",
    "cacheDuration": 60,
    "params": [
      {
        "name": "keyword",
        "title": "关键词",
        "type": "input",
        "value": ""
      },
      {
        "name": "page",
        "title": "页码",
        "type": "page",
        "value": "1"
      }
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

var HOST = "https://chaturbate.com";
var API = HOST + "/api/ts/roomlist/room-list/";
var CTX_API = HOST + "/api/chatvideocontext/";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = HOST + "/";
var PAGE_SIZE = 90;

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "application/json,*/*",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": REFERER
  };
}

async function fetchJson(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var data = res && res.data;
  if (data == null) return null;
  if (typeof data === "string") {
    try { return JSON.parse(data); } catch (e) { return null; }
  }
  return data;
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  return res && res.data != null ? String(res.data) : "";
}

// type_id 解码 (与蜘蛛一致): all | g:{gender} | r:{region} | gr:{gender}:{region} |
// new | gaming | exhib | age:{from}:{to} | tag:{hashtag}
function parseTid(tid) {
  var s = String(tid == null ? "" : tid).replace(/^\s+|\s+$/g, "") || "all";
  var p = s.split(":");
  switch (p[0]) {
    case "g": return { genders: p[1] || "f" };
    case "r": return { regions: p[1] || "AS" };
    case "gr": return { genders: p[1] || "f", regions: p[2] || "AS" };
    case "age": return { from_age: p[1] || "18", to_age: p[2] || "100" };
    case "tag": return { hashtags: p.slice(1).join(":") };
    case "new": return { new_cams: "1" };
    case "gaming": return { gaming: "1" };
    case "exhib": return { exhib: "1" };
    default: return {};
  }
}

function roomCard(r) {
  var username = String(r.username || "");
  var marks = [];
  if (r.is_new) marks.push("新人");
  if (r.is_gaming) marks.push("游戏");
  var remarks = (r.num_users || 0) + "人观看" + (marks.length ? " · " + marks.join(" · ") : "");
  var pic = String(r.img || "");
  var link = HOST + "/" + encodeURIComponent(username) + "/";
  return {
    id: link,
    type: "url",
    title: username,
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    link: link,
    description: remarks,
    mediaType: "movie"
  };
}

async function getRoomsPage(filter, page) {
  var offset = (page - 1) * PAGE_SIZE;
  var qs = ["limit=" + PAGE_SIZE, "offset=" + offset];
  for (var k in filter) {
    if (filter[k] !== "" && filter[k] != null) qs.push(k + "=" + encodeURIComponent(String(filter[k])));
  }
  var d = await fetchJson(API + "?" + qs.join("&"));
  if (!d || !Array.isArray(d.rooms)) return [];
  var out = [];
  for (var i = 0; i < d.rooms.length; i++) {
    var r = d.rooms[i];
    if (r && r.username && r.current_show === "public" && !r.has_password) out.push(roomCard(r));
  }
  return out;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var cat = String(params.cat || params.path || "all");
  try {
    var list = await getRoomsPage(parseTid(cat), page);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有在线房间" }];
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
  var wd = pickKeyword(params);
  var page = parseInt(params.page, 10) || 1;
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词搜索主播" }];
  try {
    var list = await getRoomsPage({ keywords: wd }, page);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关主播" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

function cleanUsername(link) {
  var s = String(link || "");
  if (s.indexOf("$") >= 0) s = s.split("$").pop();
  var m = s.match(/chaturbate\.com\/([^/?#]+)/i);
  if (m) return decodeURIComponent(m[1]);
  return s.replace(/^\s+|\s+$/g, "").replace(/^\/+|\/+$/g, "");
}

// 取房间播放信息; 主通道 /api/chatvideocontext/{username}/ JSON (约 5KB, 快),
// 兜底房间页内嵌 initialRoomDossier (约 195KB HTML, 慢), 与蜘蛛一致。
async function getDossier(username) {
  try {
    var j = await fetchJson(CTX_API + encodeURIComponent(username) + "/");
    if (j && typeof j === "object" && ("room_status" in j || "hls_source" in j)) {
      return {
        room_status: String(j.room_status || ""),
        room_title: String(j.room_title || ""),
        num_viewers: j.num_viewers || 0,
        hls_source: String(j.hls_source || "")
      };
    }
  } catch (e) { /* 换兜底 */ }
  try {
    var html = await fetchText(HOST + "/" + encodeURIComponent(username) + "/");
    var m = html.match(/initialRoomDossier\s*=\s*"((?:[^"\\]|\\.)*)"/);
    if (!m) return null;
    var d = JSON.parse(JSON.parse('"' + m[1] + '"'));
    return {
      room_status: String(d.room_status || ""),
      room_title: String(d.room_title || ""),
      num_viewers: d.num_viewers || 0,
      hls_source: String(d.hls_source || "")
    };
  } catch (e) { return null; }
}

async function loadDetail(link) {
  var username = cleanUsername(link);
  if (!username) {
    return { id: String(link || "err"), type: "url", title: "解析失败", description: "未找到播放地址" };
  }
  var pageUrl = HOST + "/" + encodeURIComponent(username) + "/";
  var cover = "https://thumb.live.mmcdn.com/riw/" + encodeURIComponent(username) + ".jpg";
  var d = null;
  try { d = await getDossier(username); } catch (e) { /* 守卫空返 */ }
  // 只有公开房才有游客流; hidden/private/away 等状态 hls_source 为空, 如实空返 (同蜘蛛守卫)
  if (!d || d.room_status !== "public" || !d.hls_source) {
    return {
      id: pageUrl,
      type: "url",
      title: username,
      description: d ? "房间当前状态: " + (d.room_status || "未知") + "，未公开直播" : "房间已下线或不存在"
    };
  }
  return {
    id: pageUrl,
    type: "detail",
    title: d.room_title || username,
    link: pageUrl,
    posterPath: cover,
    coverUrl: cover,
    backdropPath: cover,
    description: "直播中 · " + (d.num_viewers || 0) + "人观看",
    // REX 无服务端: 直返站方 LL-HLS 主列表 (含 240p~1080p 多档, 播放器自选), 不做猫源的裁档锁定
    videoUrl: d.hls_source,
    playerType: "app",
    customHeaders: {
      "User-Agent": UA,
      "Referer": REFERER
    }
  };
}
