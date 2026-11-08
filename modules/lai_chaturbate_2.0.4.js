// Chaturbate for REX (lai_chaturbate v2.0.4)
// 2.0.4 (2026-11-09): parseMaster 改收全部 STREAM-INF variant，每档一集
// （集名取 RESOLUTION/带宽，videoUrl 为该档经 Worker /master 拼出的音画双轨地址，
// 共用默认音频轨；无音频轨时回落纯视频轨 /m）；loadResource 支持按集下标重解。
// 2.0.3 (2026-11-05): 音画线传 aw=1, 音频也经 Worker /m (配 Worker v8)。
//   2.0.2 系统播放器下很多房间加载不出: 边缘已证实不拦 UA、init MIME 也
//   正常, 剩余解释是系统播放器任一轨失败即整项失败, 而手机到各边缘的
//   直连按房间而异; 双轨都经 Worker 可彻底绕开手机到边缘的直连。
//   系统播放器缓冲/同步强于 App 播放器, 有望扛住音频经 /m 的抢存竞态。
// Chaturbate for REX (lai_chaturbate v2.0.2)
// 2.0.2 (2026-11-05): 音画线改走系统播放器。2.0.1 音画线在 Worker v5/v6/v7
//   （快路径、播单预留、音频直连）全部确认在岗后仍卡且不同步、播 2 秒即卡住，
//   而纯视频轨一直很顺、音频单听也有声 —— Worker 侧的假设已穷尽，剩余
//   最大嫌疑是 App 内置播放器核心处理双轨 fMP4 的同步/缓冲。故音画线
//   （默认 + 并列线路）改 playerType "system"（iOS 原生播放器，HLS 多轨的
//   参考实现），纯视频轨仍留 "app"（已证顺）。Worker 保持 v7 不变。
// Chaturbate for REX (lai_chaturbate v2.0.1)
// 来源蓝图: mira-cat 蜘蛛 chaturbate.js (py_chaturbate), 只读移植, 未改动原蜘蛛。
// 后端: https://chaturbate.com 站方前端公开接口
//       列表 /api/ts/roomlist/room-list/ (游客视图), 详情 /api/chatvideocontext/{username}/。
//       只收录 current_show==='public' 且无密码的公开直播间; 私密/票秀/密码房不收, 不伪造任何凭证。
// 搜索: 复用列表接口的 keywords 参数 (站内搜索, 匹配用户名/标题)。
//
// 播放形态重写说明 (2026-10-22, 详见 ports/REWRITE_chaturbate.md):
//   站方只有 LL-HLS 一个流字段 (hls_source), chatvideocontext 无其他流字段, 边缘同目录
//   其他清单名全部 403 playlist_unexpected —— 没有普通 HLS/MUXED 备选形态可换。
//   历轮 (v1.0.1) 交付形态在真机全部 "能出画、立马卡住": 当时怀疑音频 rendition
//   拖住同步, 故 2.0.0 默认改走最简形态 (线路1 /m 纯视频轨, 无音频 rendition)。
//   后续四轮取证坐实冻因是 v3 的 tfdt 平移漂移, v4 已去掉平移与 EXT-X-START,
//   分片纯字节透传; 且用户现报 2.0.0 "能播但无声" —— 正是 /m 纯视频轨的设计
//   形态, 不是新故障。故 2.0.1 默认改回音画双轨:
//     线路1 (默认, detail.videoUrl): Worker /master 音画双轨 (视频 + 音频 rendition)。
//     线路2 (loadResource 并列): Worker /m 纯视频轨, 若音画线在他手机上复现
//       冻住, 切此线即可对比定性 (届时音频 rendition 才坐实为冻因)。
//   两条线路都锁定最高 BANDWIDTH 一档 (沿用历轮锁档逻辑)。
//   **必须配套 chaturbate-hls Worker v4**: 四轮取证坐实 v3 的 /seg tfdt 平移量
//   存在 Cache API 状态里, 在已部署环境下逐请求漂移 (相邻分片时间戳出现同戳/
//   负递进/跳变), 播放器拿到碎时间轴即冻 —— v3 在岗时本模块的分片同样会中招,
//   须先部署 v4 (分片纯字节透传 + 去掉 EXT-X-START) 再验本模块。
//   主清单 token 一次性/绑铸造侧, 只能模块在手机侧现拉现解析; chunklist 不绑 IP,
//   可交 Worker 拉取与降格。session 闲置约 45s 即死, 靠播放器/Worker 轮询保活。

WidgetMetadata = {
  id: "lai_chaturbate",
  title: "Chaturbate",
  description: "Chaturbate 公开直播：大类/地区/年龄/标签共 48 个分类，播放经 chaturbate-hls Worker 降格普通 HLS，详情出全部清晰度档位（每档一集，音画双轨走系统播放器、音视频双轨均经 Worker，另备纯视频轨线路）",
  author: "lai",
  version: "2.0.4",
  requiredVersion: "0.0.1",
  site: "https://chaturbate.com",
  detailCacheDuration: 60,
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
          { "title": "推荐", "value": "all" },
          { "title": "女生", "value": "g:f" },
          { "title": "男生", "value": "g:m" },
          { "title": "情侣", "value": "g:c" },
          { "title": "跨性别", "value": "g:t" },
          { "title": "亚洲女生", "value": "gr:f:AS" },
          { "title": "新人", "value": "new" },
          { "title": "游戏", "value": "gaming" },
          { "title": "展示", "value": "exhib" }
        ]
      },
      { "name": "page", "title": "页码", "type": "page", "value": "1" }
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
          { "title": "亚洲", "value": "r:AS" },
          { "title": "北美", "value": "r:NA" },
          { "title": "南美", "value": "r:SA" },
          { "title": "欧洲·俄罗斯", "value": "r:ER" },
          { "title": "其他地区", "value": "r:O" }
        ]
      },
      { "name": "page", "title": "页码", "type": "page", "value": "1" }
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
          { "title": "18-21岁", "value": "age:18:22" },
          { "title": "20-30岁", "value": "age:20:31" },
          { "title": "30-50岁", "value": "age:30:51" },
          { "title": "成熟50+", "value": "age:50:100" }
        ]
      },
      { "name": "page", "title": "页码", "type": "page", "value": "1" }
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
          { "title": "标签·互动玩具", "value": "tag:lovense" },
          { "title": "标签·巨乳", "value": "tag:bigboobs" },
          { "title": "标签·潮吹", "value": "tag:squirt" },
          { "title": "标签·亚洲", "value": "tag:asian" },
          { "title": "标签·肛交", "value": "tag:anal" },
          { "title": "标签·大屁股", "value": "tag:bigass" },
          { "title": "标签·瘦", "value": "tag:skinny" },
          { "title": "标签·天然", "value": "tag:natural" },
          { "title": "标签·恋足", "value": "tag:feet" },
          { "title": "标签·拉丁", "value": "tag:latina" },
          { "title": "标签·熟女", "value": "tag:milf" },
          { "title": "标签·小胸", "value": "tag:smalltits" },
          { "title": "标签·金发", "value": "tag:blonde" },
          { "title": "标签·射精", "value": "tag:cum" },
          { "title": "标签·大屌", "value": "tag:bigcock" },
          { "title": "标签·多毛", "value": "tag:hairy" },
          { "title": "标签·深喉", "value": "tag:deepthroat" },
          { "title": "标签·娇小", "value": "tag:petite" },
          { "title": "标签·大胸", "value": "tag:bigtits" },
          { "title": "标签·炮机", "value": "tag:fuckmachine" },
          { "title": "标签·棕发", "value": "tag:brunette" },
          { "title": "标签·黑珍珠", "value": "tag:ebony" },
          { "title": "标签·红发", "value": "tag:redhead" },
          { "title": "标签·熟龄", "value": "tag:mature" },
          { "title": "标签·肌肉", "value": "tag:muscle" },
          { "title": "标签·哥特", "value": "tag:goth" },
          { "title": "标签·角色扮演", "value": "tag:cosplay" },
          { "title": "标签·BDSM", "value": "tag:bdsm" },
          { "title": "标签·小鲜肉", "value": "tag:twink" },
          { "title": "标签·口交", "value": "tag:blowjob" }
        ]
      },
      { "name": "page", "title": "页码", "type": "page", "value": "1" }
    ]
  },
  {
    "title": "搜索",
    "functionName": "search",
    "cacheDuration": 60,
    "params": [
      { "name": "keyword", "title": "关键词", "type": "input", "value": "" },
      { "name": "page", "title": "页码", "type": "page", "value": "1" }
    ]
  },
  {
    "id": "loadResource",
    "title": "Chaturbate播放源",
    "description": "直播线路：默认音画双轨，另备纯视频轨",
    "functionName": "loadResource",
    "type": "stream",
    "cacheDuration": 0,
    "params": []
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
var CB_WORKER = "https://chaturbate-hls.li768435813.workers.dev";

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
  var cat = String(unwrapLink(params.cat || params.path) || "all");
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

// 入参摊平: 运行时可能把卡片/子项对象传给 loadDetail/loadResource, 先取其
// link/id/url 字符串再解析 (mitao/asmr/march 已坐实的对象入参断链防护)。
function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "number") return String(x);
  if (typeof x === "object") {
    var keys = ["link", "id", "url", "href"];
    for (var i = 0; i < keys.length; i++) {
      var v = x[keys[i]];
      if (typeof v === "string" && v) return v;
    }
  }
  return "";
}

function cleanUsername(link) {
  var s = unwrapLink(link);
  if (!s) s = String(link || "");
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

// 主清单内的相对 URI -> 绝对地址 (chunklist 是根相对路径, 自带 ?session=)
function absEdge(u, masterUrl) {
  var s = String(u || "");
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  var origin = (String(masterUrl).match(/^https?:\/\/[^/]+/i) || [""])[0];
  if (s.charAt(0) === "/") return origin + s;
  var dir = String(masterUrl).split("?")[0].replace(/[^/]*$/, "");
  return dir + s;
}

// 手机侧拉主清单，收全部 STREAM-INF variant（按 BANDWIDTH 从高到低），每档配其
// AUDIO 组默认音频。返回 { variants, vAbs, aAbs, inf }，vAbs/aAbs/inf 为最高档
// （供旧 loadResource 两线回落复用）；任一步失败返回 null。
function variantInfo(v, audios, hlsSource) {
  var attrs = v.attrs;
  var aAbs = "";
  var ag = (attrs.match(/AUDIO="([^"]+)"/) || [])[1];
  if (ag) {
    var pick = null;
    for (var k = 0; k < audios.length; k++) {
      if (audios[k].group !== ag) continue;
      if (audios[k].def) { pick = audios[k]; break; }
      if (!pick) pick = audios[k];
    }
    if (pick) aAbs = absEdge(pick.uri, hlsSource);
  }
  var inf = attrs;
  if (aAbs) {
    inf = /AUDIO="[^"]*"/.test(inf)
      ? inf.replace(/AUDIO="[^"]*"/, 'AUDIO="aac"')
      : inf + ',AUDIO="aac"';
  } else {
    inf = inf.replace(/,?AUDIO="[^"]*"/, "").replace(/^,/, "").replace(/,,+/g, ",");
  }
  var rm = attrs.match(/RESOLUTION=(\d+)x(\d+)/i);
  var height = rm ? parseInt(rm[2], 10) : 0;
  var label = height ? height + "p" : (v.bw ? Math.round(v.bw / 1000) + "kbps" : "直播");
  return { vAbs: absEdge(v.uri, hlsSource), aAbs: aAbs, inf: inf, bw: v.bw, height: height, label: label };
}

async function parseMaster(hlsSource) {
  var text = await fetchText(hlsSource);
  if (!text || text.indexOf("#EXTM3U") !== 0) return null;
  var lines = text.split("\n");
  var audios = [];
  var variants = [];
  for (var i = 0; i < lines.length; i++) {
    var L = String(lines[i]).replace(/\s+$/g, "");
    if (L.indexOf("#EXT-X-MEDIA:") === 0 && /TYPE=AUDIO/.test(L)) {
      var g = (L.match(/GROUP-ID="([^"]+)"/) || [])[1];
      var mu = (L.match(/URI="([^"]+)"/) || [])[1];
      if (g && mu) audios.push({ group: g, uri: mu, def: /DEFAULT=YES/.test(L) });
    } else if (L.indexOf("#EXT-X-STREAM-INF:") === 0) {
      var attrs = L.slice("#EXT-X-STREAM-INF:".length);
      var uri = String(lines[i + 1] || "").replace(/\s+$/g, "");
      var bw = parseInt((attrs.match(/BANDWIDTH=(\d+)/) || [])[1] || "0", 10);
      if (uri) variants.push({ attrs: attrs, uri: uri, bw: bw });
    }
  }
  if (!variants.length) return null;
  variants.sort(function (x, y) { return y.bw - x.bw; });
  var infos = [];
  for (var vi = 0; vi < variants.length; vi++) infos.push(variantInfo(variants[vi], audios, hlsSource));
  return { variants: infos, vAbs: infos[0].vAbs, aAbs: infos[0].aAbs, inf: infos[0].inf };
}

// 线路1 (默认): 纯视频轨 —— Worker /m 直出最高档视频媒体清单 (无主清单/无音频轨)
function videoOnlyUrl(info) {
  return CB_WORKER + "/m?u=" + encodeURIComponent(info.vAbs);
}

// 线路2: 音画双轨 —— Worker /master 单档主清单 (视频 + 一路音频 rendition)
// 2.0.3: 传 aw=1, 音频也经 /m (配 Worker v8; v7 及以前忽略 aw, 行为不变)。
function avMasterUrl(info) {
  var url = CB_WORKER + "/master?v=" + encodeURIComponent(info.vAbs);
  if (info.aAbs) url += "&a=" + encodeURIComponent(info.aAbs);
  url += "&inf=" + encodeURIComponent(info.inf);
  url += "&aw=1";
  return url;
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
  var info = null;
  try { info = await parseMaster(d.hls_source); } catch (e) { /* 兜底直连 */ }
  // v2.0.4：每档一集，videoUrl 为该档经 Worker /master 拼出的音画双轨地址
  // （共用默认音频轨；无音频轨时回落纯视频轨 /m）。集 link 带档位下标，供 loadResource
  // 按下标重解（主清单 token 一次性，不能复用详情时的 Worker 地址）。
  var topUrl = info ? (info.aAbs ? avMasterUrl(info) : videoOnlyUrl(info)) : d.hls_source;
  var topPlayer = (info && info.aAbs) ? "system" : "app";
  var result = {
    id: pageUrl,
    type: "detail",
    title: d.room_title || username,
    link: pageUrl,
    posterPath: cover,
    coverUrl: cover,
    backdropPath: cover,
    description: "直播中 · " + (d.num_viewers || 0) + "人观看",
    videoUrl: topUrl,
    playerType: topPlayer,
    customHeaders: {
      "User-Agent": UA,
      "Referer": REFERER
    }
  };
  if (info && info.variants && info.variants.length) {
    var eps = [];
    var sEps = [];
    var items = [];
    for (var vi = 0; vi < info.variants.length; vi++) {
      var vinf = info.variants[vi];
      var vUrl = vinf.aAbs ? avMasterUrl(vinf) : videoOnlyUrl(vinf);
      var vLabel = vinf.label;
      var epLink = pageUrl + "@@cbvariant:" + vi;
      eps.push({ name: vLabel, link: epLink });
      sEps.push({ title: vLabel, videoUrl: vUrl, episodeNumber: vi + 1 });
      items.push({ id: epLink, type: "url", title: (d.room_title || username) + " " + vLabel, name: vLabel, mediaType: "movie", seasonNumber: 1, episodeNumber: vi + 1, videoUrl: vUrl, link: epLink, posterPath: cover, coverUrl: cover });
    }
    result.episodes = eps;
    result.seasons = [{ seasonNumber: 1, title: "直播", name: "直播", episodes: sEps }];
    result.episodeItems = items;
    result.childItems = items;
  }
  return result;
}

// 播放源 (stream 模块): 同场给出两条线, 真机一次测试即可判别音频因素。
// 现拉现解析 (主清单 token 一次性, 不能缓存复用)。
async function loadResource(params) {
  try {
    var username = cleanUsername(unwrapLink(params) || params);
    if (!username) {
      // params 可能是对象且字段不走寻常路: 递归找第一个像房间链接的字符串
      var found = "";
      (function walk(o, depth) {
        if (found || o == null || depth > 3) return;
        if (typeof o === "string") { if (/chaturbate\.com\//i.test(o)) found = o; return; }
        if (typeof o === "object") { for (var k in o) walk(o[k], depth + 1); }
      })(params, 0);
      username = cleanUsername(found);
    }
    if (!username) return [];
    var d = await getDossier(username);
    if (!d || d.room_status !== "public" || !d.hls_source) return [];
    var info = await parseMaster(d.hls_source);
    if (!info) return [];
    // v2.0.4：集 link 带 @@cbvariant:N 时按下标重解对应档位（token 一次性，现拉现解）。
    var rawStr = unwrapLink(params);
    var idxM = rawStr ? rawStr.match(/@@cbvariant:(\d+)/) : null;
    if (idxM && info.variants && info.variants[parseInt(idxM[1], 10)]) {
      var vinf = info.variants[parseInt(idxM[1], 10)];
      var vUrl = vinf.aAbs ? avMasterUrl(vinf) : videoOnlyUrl(vinf);
      return [{
        name: "直播 · " + vinf.label,
        description: vinf.aAbs ? "音画双轨（系统播放器）" : "纯视频轨",
        url: vUrl,
        playerType: vinf.aAbs ? "system" : "app",
        customHeaders: { "User-Agent": UA, "Referer": REFERER }
      }];
    }
    var lines = [];
    if (info.aAbs) {
      lines.push({
        name: "直播 · 音画双轨",
        description: "最高档视频 + 音频（系统播放器）",
        url: avMasterUrl(info),
        playerType: "system",
        customHeaders: { "User-Agent": UA, "Referer": REFERER }
      });
    }
    lines.push({
      name: "直播 · 高清视频轨",
      description: "最高档纯视频（无音频轨）",
      url: videoOnlyUrl(info),
      playerType: "app",
      customHeaders: { "User-Agent": UA, "Referer": REFERER }
    });
    return lines;
  } catch (e) {
    return [];
  }
}
