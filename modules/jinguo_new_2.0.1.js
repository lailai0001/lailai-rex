// 禁果短剧 for REX (jinguo-duanju-v2 v2.0.1)
// 站点：jinguoduanju.app，公开 JSON API（/api/v1）。
// 列表/搜索/详情均走 /dramas 接口，详情响应内嵌完整剧集列表。
// 播放地址经 /episodes/{id}/play 实时解析（该接口对匿名请求返回 401，见 SPEC_jinguo.md）。

WidgetMetadata = {
  id: "jinguo-duanju-v2",
  title: "禁果短剧",
  version: "2.0.1",
  requiredVersion: "0.0.1",
  description: "禁果短剧：17 个分类、关键词搜索、多集短剧",
  author: "rewrite",
  site: "https://jinguoduanju.app",
  detailCacheDuration: 1800,
  modules: [
    {
      title: "最新更新",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "latest" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "热门",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "heat" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "魔改",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "魔改" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "单体",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "单体" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "都市",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "都市" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "古装",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "古装" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "职场",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "职场" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "奇幻",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "奇幻" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "绿帽",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "绿帽" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "校园",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "校园" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "穿越",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "穿越" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "后宫",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "后宫" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "NTR",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "NTR" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "动漫",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "动漫" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "灵异",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "灵异" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "异能",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "异能" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "重生",
      functionName: "loadList",
      cacheDuration: 600,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "重生" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      id: "loadResource",
      title: "禁果播放源",
      description: "播放时实时解析播放地址",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 0,
      params: []
    }
  ],
  search: {
    title: "搜索",
    functionName: "searchDramas",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

var JG_BASE = "https://jinguoduanju.app";
var JG_API = JG_BASE + "/api/v1";
var JG_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";

function jgOk(resp) {
  if (!resp) return false;
  if (typeof resp.ok !== "undefined") return !!resp.ok;
  var code = typeof resp.statusCode !== "undefined" ? resp.statusCode : resp.status;
  if (typeof code === "number") return code >= 200 && code < 300;
  return !!resp.data;
}

// GET 一个 API 路径，成功返回解析后的 JSON，失败返回 null
async function jgGet(path, query) {
  var qs = "";
  if (query) {
    var parts = [];
    Object.keys(query).forEach(function (k) {
      if (query[k] === undefined || query[k] === null) return;
      parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(query[k]));
    });
    if (parts.length) qs = "?" + parts.join("&");
  }
  try {
    var resp = await Widget.http.get(JG_API + path + qs, {
      headers: { "Accept": "application/json", "User-Agent": JG_UA },
      timeout: 20000
    });
    if (!jgOk(resp)) return null;
    var data = resp.data;
    if (typeof data === "string") {
      var body = data.charCodeAt(0) === 0xFEFF ? data.slice(1) : data;
      try { return JSON.parse(body); } catch (e) { return null; }
    }
    return data == null ? null : data;
  } catch (e) {
    return null;
  }
}

// 封面可能是相对路径，补成绝对地址
function jgCover(url) {
  var u = String(url || "");
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return JG_BASE + u;
  return u;
}

// 列表接口正常返回裸数组；个别情况下容忍 {list: [...]} / {data: [...]} 包装
function jgAsArray(d) {
  if (Array.isArray(d)) return d;
  if (d && Array.isArray(d.list)) return d.list;
  if (d && Array.isArray(d.data)) return d.data;
  return null;
}

function jgToCard(dr) {
  var cover = jgCover(dr.coverUrl || "");
  var count = dr.episodeCount;
  return {
    id: "jg_" + dr.id,
    type: "url",
    title: dr.title || "",
    posterUrl: cover,
    posterPath: cover,
    remark: count ? String(count) + "集" : "",
    link: "jinguo://detail/" + dr.id
  };
}

function jgCards(list) {
  var out = [];
  (list || []).forEach(function (dr) {
    if (dr && dr.id !== undefined && dr.id !== null && dr.id !== "") out.push(jgToCard(dr));
  });
  return out;
}

// cat 约定："latest" 按最新排序；"heat" 按热度排序；其他值视为题材标签，
// 用最新排序拉取后在本地按 drama.tags 过滤（与站方标签体系一致）
async function loadList(params) {
  params = params || {};
  var cat = String(params.cat == null ? "latest" : params.cat);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var isSort = cat === "latest" || cat === "heat";
  var d = await jgGet("/dramas", { sort: isSort ? cat : "latest", limit: 100, page: page });
  var list = jgAsArray(d);
  if (!list) return [];
  if (!isSort) {
    list = list.filter(function (dr) {
      return dr && Array.isArray(dr.tags) && dr.tags.indexOf(cat) !== -1;
    });
  }
  return jgCards(list.slice(0, 20));
}

async function searchDramas(params) {
  params = params || {};
  var kw = "";
  if (typeof params === "string") kw = params;
  else if (params.keyword) kw = String(params.keyword);
  kw = kw.trim();
  if (!kw) return [];
  var d = await jgGet("/dramas", { sort: "latest", q: kw, limit: 20 });
  var list = jgAsArray(d);
  if (!list) return [];
  return jgCards(list);
}

// 从链接里拆出引用类型与 id：
//   jinguo://detail/<dramaId>   -> { kind: "drama", id }
//   jinguo://episode/<epId>     -> { kind: "episode", id }
//   其他（裸 id）                -> { kind: "drama", id }
function jgParseRef(link) {
  var v = String(link || "");
  var m = v.match(/^jinguo:\/\/(detail|episode)\/(.+)$/);
  if (m) return { kind: m[1] === "episode" ? "episode" : "drama", id: m[2] };
  return { kind: "drama", id: v.replace(/^jinguo:\/\//, "") };
}

async function loadDetail(link) {
  var ref = jgParseRef(link);
  if (ref.kind !== "drama" || !ref.id) {
    return { id: String(link || ""), title: "参数错误", link: String(link || "") };
  }
  var d = await jgGet("/dramas/" + encodeURIComponent(ref.id));
  if (!d) return { id: link, title: "加载失败", link: link };
  // 实测详情响应为 { drama: {...}, description: "...", episodes: [...] }；
  // 剧集列表已内嵌且完整，不需要再调单独的剧集接口
  var drama = d.drama || d;
  var rawEps = Array.isArray(d.episodes) ? d.episodes : (Array.isArray(drama.episodes) ? drama.episodes : []);
  var episodes = [];
  rawEps.forEach(function (ep) {
    if (!ep || ep.id === undefined || ep.id === null) return;
    var name = ep.title || ("第" + (ep.number || ep.episodeNumber || ep.index || "?") + "集");
    episodes.push({ name: name, id: ep.id, link: "jinguo://episode/" + ep.id });
  });
  var cover = jgCover(drama.coverUrl || "");
  return {
    id: link,
    type: "url",
    title: drama.title || "",
    posterUrl: cover,
    posterPath: cover,
    description: d.description || drama.subtitle || "",
    episodes: episodes,
    link: link
  };
}

// 单集播放地址解析：接口返回 { url } 或 { playUrl }
// 注意：该接口对匿名请求返回 401（需要登录），无地址时返回空串
async function getEpisodePlay(epId) {
  if (epId === undefined || epId === null || epId === "") return "";
  var d = await jgGet("/episodes/" + encodeURIComponent(epId) + "/play");
  if (!d) return "";
  return d.url || d.playUrl || "";
}

// 播放源解析（stream 模块）：
// - 传入单集链接（详情页剧集的 link）时，只解析该集
// - 传入剧链接时，逐集解析成资源列表；连续 3 集拿不到地址就停（避免无谓请求）
async function loadResource(params) {
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  var ref = jgParseRef(raw);
  try {
    if (ref.kind === "episode") {
      var one = await getEpisodePlay(ref.id);
      if (!one) return [];
      return [{ name: "播放", url: one, playerType: "app" }];
    }
    if (!ref.id) return [];
    var d = await jgGet("/dramas/" + encodeURIComponent(ref.id));
    if (!d) return [];
    var drama = d.drama || d;
    var rawEps = Array.isArray(d.episodes) ? d.episodes : [];
    var out = [];
    var misses = 0;
    for (var i = 0; i < rawEps.length; i++) {
      var ep = rawEps[i];
      if (!ep || ep.id === undefined || ep.id === null) continue;
      var url = await getEpisodePlay(ep.id);
      if (!url) {
        misses++;
        if (misses >= 3) break;
        continue;
      }
      misses = 0;
      out.push({
        name: ep.title || ("第" + (ep.number || i + 1) + "集"),
        description: drama.title || "",
        url: url,
        playerType: "app"
      });
    }
    return out;
  } catch (e) {
    return [];
  }
}
