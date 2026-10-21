// StripChat for REX (lai_stripchat v1.0.0)
// 来源蓝图: mira-cat 蜘蛛 stripchat.js (py_stripchat), 只读移植, 未改动原蜘蛛。
// 后端: https://zh.stripchat.com 公开接口 /api/front/models (游客视图),
//       只收录 status==='public' 且 isLive 的公开直播间; 私密秀/门票秀不收, 不伪造任何凭证。
// 播放: Mouflon 加密机制由用户已部署的 stripchat-hls Worker 代办 (主列表→选 pkey→拉媒体列表→解密),
//       play 返回 Worker 的 /master/{id}, 播放列表正文全是 CDN 的 https 地址, 与猫源现行方案一致。
// 搜索: 站方无可用公开搜索接口 (蜘蛛实测参数均被忽略), search 返回提示卡, 与蜘蛛空返行为一致。

WidgetMetadata = {
  id: "lai_stripchat",
  title: "StripChat",
  description: "StripChat 公开直播：女生/男生/情侣/跨性别共 99 个分类，播放走 stripchat-hls Worker",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://zh.stripchat.com",
  detailCacheDuration: 180,
  modules: [
  {
    "title": "女生",
    "functionName": "loadList",
    "cacheDuration": 180,
    "params": [
      {
        "name": "cat",
        "title": "分类",
        "type": "enumeration",
        "value": "girls",
        "enumOptions": [
          {
            "title": "女生",
            "value": "girls"
          },
          {
            "title": "女·肛交",
            "value": "girls:doAnal"
          },
          {
            "title": "女·阿拉伯人",
            "value": "girls:ethnicityMiddleEastern"
          },
          {
            "title": "女·亚洲人",
            "value": "girls:ethnicityAsian"
          },
          {
            "title": "女·运动型",
            "value": "girls:bodyTypeAthletic"
          },
          {
            "title": "女·大号美女",
            "value": "girls:bodyTypeBBW"
          },
          {
            "title": "女·BDSM",
            "value": "girls:subcultureBdsm"
          },
          {
            "title": "女·大屁股",
            "value": "girls:specificsBigAss"
          },
          {
            "title": "女·巨乳",
            "value": "girls:specificsBigTits"
          },
          {
            "title": "女·黑发",
            "value": "girls:hairColorBrown"
          },
          {
            "title": "女·金发",
            "value": "girls:hairColorBlonde"
          },
          {
            "title": "女·口交",
            "value": "girls:doBlowjob"
          },
          {
            "title": "女·棕发小妞",
            "value": "girls:hairColorBlack"
          },
          {
            "title": "女·视频通话",
            "value": "girls:autoTagP2P"
          },
          {
            "title": "女·中国",
            "value": "girls:tagLanguageChinese"
          },
          {
            "title": "女·彩发",
            "value": "girls:hairColorColorful"
          },
          {
            "title": "女·丰满",
            "value": "girls:bodyTypeCurvy"
          },
          {
            "title": "女·深喉",
            "value": "girls:doDeepThroat"
          },
          {
            "title": "女·黑珍珠",
            "value": "girls:ethnicityEbony"
          },
          {
            "title": "女·拳交",
            "value": "girls:doFisting"
          },
          {
            "title": "女·恋足",
            "value": "girls:doFootFetish"
          },
          {
            "title": "女·炮机",
            "value": "girls:fuckMachine"
          },
          {
            "title": "女·老奶奶",
            "value": "girls:ageOld"
          },
          {
            "title": "女·群交",
            "value": "girls:tagGroupSex"
          },
          {
            "title": "女·阴部多毛",
            "value": "girls:specificsHairy"
          },
          {
            "title": "女·粗暴",
            "value": "girls:doHardcore"
          },
          {
            "title": "女·印度人",
            "value": "girls:ethnicityIndian"
          },
          {
            "title": "女·互动玩具",
            "value": "girls:autoTagInteractiveToy"
          },
          {
            "title": "女·拉丁人",
            "value": "girls:ethnicityLatino"
          },
          {
            "title": "女·自慰",
            "value": "girls:doMasturbation"
          },
          {
            "title": "女·成熟",
            "value": "girls:ageMature"
          },
          {
            "title": "女·中等身材",
            "value": "girls:bodyTypeMedium"
          },
          {
            "title": "女·熟女",
            "value": "girls:ageMilf"
          },
          {
            "title": "女·混血",
            "value": "girls:ethnicityMultiracial"
          },
          {
            "title": "女·手机直播",
            "value": "girls:mobile"
          },
          {
            "title": "女·新人",
            "value": "girls:autoTagNew"
          },
          {
            "title": "女·办公室",
            "value": "girls:doOffice"
          },
          {
            "title": "女·户外",
            "value": "girls:doPublicPlace"
          },
          {
            "title": "女·瘦",
            "value": "girls:bodyTypePetite"
          },
          {
            "title": "女·孕妇",
            "value": "girls:specificPregnant"
          },
          {
            "title": "女·红发",
            "value": "girls:hairColorRed"
          },
          {
            "title": "女·剃光",
            "value": "girls:specificShaven"
          },
          {
            "title": "女·小胸部",
            "value": "girls:specificSmallTits"
          },
          {
            "title": "女·偷窥",
            "value": "girls:autoTagSpy"
          },
          {
            "title": "女·潮吹",
            "value": "girls:doSquirt"
          },
          {
            "title": "女·少女18+",
            "value": "girls:ageTeen"
          },
          {
            "title": "女·乌克兰人",
            "value": "girls:tagLanguageUkrainian"
          },
          {
            "title": "女·VR",
            "value": "girls:autoTagVr"
          },
          {
            "title": "女·白人",
            "value": "girls:ethnicityWhite"
          },
          {
            "title": "女·鲜嫩青年",
            "value": "girls:ageYoung"
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
    "title": "男生",
    "functionName": "loadList",
    "cacheDuration": 180,
    "params": [
      {
        "name": "cat",
        "title": "分类",
        "type": "enumeration",
        "value": "men",
        "enumOptions": [
          {
            "title": "男生",
            "value": "men"
          },
          {
            "title": "男·肛交",
            "value": "men:doAnal"
          },
          {
            "title": "男·亚洲人",
            "value": "men:ethnicityAsian"
          },
          {
            "title": "男·口交",
            "value": "men:doBlowjob"
          },
          {
            "title": "男·视频通话",
            "value": "men:autoTagP2P"
          },
          {
            "title": "男·中国",
            "value": "men:tagLanguageChinese"
          },
          {
            "title": "男·老爹",
            "value": "men:ageDaddies"
          },
          {
            "title": "男·黑珍珠",
            "value": "men:ethnicityEbony"
          },
          {
            "title": "男·同性恋",
            "value": "men:orientationGay"
          },
          {
            "title": "男·群交",
            "value": "men:tagGroupSex"
          },
          {
            "title": "男·粗暴",
            "value": "men:doHardcore"
          },
          {
            "title": "男·拉丁人",
            "value": "men:ethnicityLatino"
          },
          {
            "title": "男·肌肉",
            "value": "men:bodyTypeMuscular"
          },
          {
            "title": "男·新人",
            "value": "men:autoTagNew"
          },
          {
            "title": "男·瘦",
            "value": "men:bodyTypeSkinny"
          },
          {
            "title": "男·小鲜肉",
            "value": "men:tagMenTwinks"
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
    "title": "情侣",
    "functionName": "loadList",
    "cacheDuration": 180,
    "params": [
      {
        "name": "cat",
        "title": "分类",
        "type": "enumeration",
        "value": "couples",
        "enumOptions": [
          {
            "title": "情侣",
            "value": "couples"
          },
          {
            "title": "情侣·69姿势",
            "value": "couples:do69Position"
          },
          {
            "title": "情侣·肛交",
            "value": "couples:doAnal"
          },
          {
            "title": "情侣·口交",
            "value": "couples:doBlowjob"
          },
          {
            "title": "情侣·中国",
            "value": "couples:tagLanguageChinese"
          },
          {
            "title": "情侣·深喉",
            "value": "couples:doDeepThroat"
          },
          {
            "title": "情侣·恋足",
            "value": "couples:doFootFetish"
          },
          {
            "title": "情侣·炮机",
            "value": "couples:fuckMachine"
          },
          {
            "title": "情侣·哥特",
            "value": "couples:subcultureGoth"
          },
          {
            "title": "情侣·群交",
            "value": "couples:tagGroupSex"
          },
          {
            "title": "情侣·粗暴",
            "value": "couples:doHardcore"
          },
          {
            "title": "情侣·新人",
            "value": "couples:autoTagNew"
          },
          {
            "title": "情侣·办公室",
            "value": "couples:doOffice"
          },
          {
            "title": "情侣·老少配",
            "value": "couples:autoTagOldYoung"
          },
          {
            "title": "情侣·户外",
            "value": "couples:doPublicPlace"
          },
          {
            "title": "情侣·潮吹",
            "value": "couples:doSquirt"
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
    "title": "跨性别",
    "functionName": "loadList",
    "cacheDuration": 180,
    "params": [
      {
        "name": "cat",
        "title": "分类",
        "type": "enumeration",
        "value": "trans",
        "enumOptions": [
          {
            "title": "跨性别",
            "value": "trans"
          },
          {
            "title": "跨·肛交",
            "value": "trans:doAnal"
          },
          {
            "title": "跨·亚洲人",
            "value": "trans:ethnicityAsian"
          },
          {
            "title": "跨·大屁股",
            "value": "trans:specificsBigAss"
          },
          {
            "title": "跨·巨乳",
            "value": "trans:specificsBigTits"
          },
          {
            "title": "跨·口交",
            "value": "trans:doBlowjob"
          },
          {
            "title": "跨·黑珍珠",
            "value": "trans:ethnicityEbony"
          },
          {
            "title": "跨·群交",
            "value": "trans:tagGroupSex"
          },
          {
            "title": "跨·粗暴",
            "value": "trans:doHardcore"
          },
          {
            "title": "跨·拉丁人",
            "value": "trans:ethnicityLatino"
          },
          {
            "title": "跨·自慰",
            "value": "trans:doMasturbation"
          },
          {
            "title": "跨·熟女",
            "value": "trans:ageMilf"
          },
          {
            "title": "跨·新人",
            "value": "trans:autoTagNew"
          },
          {
            "title": "跨·小胸部",
            "value": "trans:specificSmallTits"
          },
          {
            "title": "跨·潮吹",
            "value": "trans:doSquirt"
          },
          {
            "title": "跨·少年18+",
            "value": "trans:ageTeen"
          },
          {
            "title": "跨·鲜嫩青年",
            "value": "trans:ageYoung"
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

var API = "https://zh.stripchat.com/api/front";
var WORKER = "https://stripchat-hls.li768435813.workers.dev";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = "https://zh.stripchat.com/";
var PAGE_SIZE = 60;

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

function modelCard(m) {
  var id = String(m.id || "");
  var pic = "";
  if (m.snapshotTimestamp && id) pic = "https://img.doppiocdn.net/thumbs/" + m.snapshotTimestamp + "/" + id;
  if (!pic) pic = m.previewUrlThumbSmall || m.avatarUrl || "";
  var marks = [];
  if (m.isHd) marks.push("HD");
  if (m.isNew) marks.push("新人");
  var remarks = (m.viewersCount || 0) + "人观看" + (marks.length ? " · " + marks.join(" · ") : "");
  var name = String(m.username || id);
  var link = REFERER + encodeURIComponent(name) + "?model=" + id;
  return {
    id: link,
    type: "url",
    title: name,
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    link: link,
    description: remarks,
    mediaType: "movie"
  };
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var cat = String(params.cat || params.path || "girls");
  var primaryTag = cat, tagId = "";
  var i = cat.indexOf(":");
  if (i >= 0) { primaryTag = cat.slice(0, i); tagId = cat.slice(i + 1); }
  var offset = (page - 1) * PAGE_SIZE;
  var url = API + "/models?primaryTag=" + encodeURIComponent(primaryTag) + "&limit=" + PAGE_SIZE + "&offset=" + offset;
  if (tagId) url += "&filterGroupTags=" + encodeURIComponent(JSON.stringify([[tagId]]));
  try {
    var d = await fetchJson(url);
    if (!d || !Array.isArray(d.models)) {
      return [{ id: "empty", type: "url", title: "没有在线房间" }];
    }
    var out = [];
    for (var k = 0; k < d.models.length; k++) {
      var m = d.models[k];
      if (m && m.status === "public" && m.isLive && m.id && m.username) out.push(modelCard(m));
    }
    return out.length ? out : [{ id: "empty", type: "url", title: "没有在线房间" }];
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
  // 站方无可用公开搜索接口 (magic-search 为前端专用服务), 与蜘蛛一致返回提示
  return [{ id: "tip", type: "url", title: "StripChat 无公开搜索，请用分类浏览" }];
}

function parseModelId(link) {
  var s = String(link || "");
  var m = s.match(/[?&]model=(\d+)/);
  if (m) return m[1];
  if (/^\d+$/.test(s)) return s;
  var tail = s.split("$").pop();
  if (/^\d+$/.test(tail)) return tail;
  return "";
}

async function loadDetail(link) {
  var id = parseModelId(link);
  if (!id) {
    return { id: String(link || "err"), type: "url", title: "解析失败", description: "未找到播放地址" };
  }
  var name = id, pic = "", live = false;
  try {
    var d = await fetchJson(API + "/models/" + encodeURIComponent(id));
    if (d) {
      name = String(d.username || name);
      pic = String(d.avatarUrl || "");
      live = d.status === "public" && !!d.isLive;
    }
  } catch (e) { /* 接口失败也拼得出可播条目 (同蜘蛛) */ }
  return {
    id: REFERER + encodeURIComponent(name) + "?model=" + id,
    type: "detail",
    title: name,
    link: REFERER + encodeURIComponent(name),
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    description: live ? "直播中" : name + " 的 StripChat 公开直播间",
    videoUrl: WORKER + "/master/" + id,
    playerType: "app",
    customHeaders: {
      "User-Agent": UA,
      "Referer": REFERER
    }
  };
}
