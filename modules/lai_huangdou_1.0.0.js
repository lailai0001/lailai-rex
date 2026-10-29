// 黄豆短剧 for REX (lai_huangdou v1.0.0)
// 蓝图：mira-cat 蜘蛛 huangdou.js（py_huangdou）。该文件是压缩残片（helper 定义不在仓库内），
// 接口/分类/详情结构与同仓库 huangdou_rex.js（由 REX 原版 forward.huangdou v2.0.2 转制）逐项一致，
// 本模块按该完整逻辑移植：后端经自有 Cloudflare Worker 反代 https://huangdou-proxy.li768435813.workers.dev（原站 tideember.cc）。
// 列表/搜索/详情走 /list /search /detail /navBlock /navFilter JSON 接口；
// 播放地址在点播时经 /play 实时换取（签名会过期），多集走 episodes + loadResource（stream）。

WidgetMetadata = {
  id: "lai_huangdou",
  title: "黄豆短剧",
  description: "黄豆短剧：黄豆原创、魔改、擦边、真人等分类，多集短剧，播放实时解析",
  author: "lai",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  site: "https://huangdou-proxy.li768435813.workers.dev",
  detailCacheDuration: 180,
  modules: [
    {
      title: "全部",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "all" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "黄豆原创",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "yuandou" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "魔改短剧",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "mod" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "擦边短剧",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "caibian" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "真人短剧",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "zhenren" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "动漫",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "erciyuan" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "影院",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "aiman" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "贤者",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "zongyi" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "黑料",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "heiliao" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      id: "loadResource",
      title: "黄豆播放源",
      description: "播放时实时解析播放地址",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 0,
      params: []
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

var HD_BASE = "https://huangdou-proxy.li768435813.workers.dev";
var HD_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var HD_PAGE_SIZE = 30;
var HD_PLAY_HEADERS = {
  "User-Agent": HD_UA,
  "Referer": "https://tideember.cc/home",
  "Origin": "https://tideember.cc"
};

function hdStr(v) {
  return String(v == null ? "" : v).trim();
}

// GET JSON 接口：成功返回解析后的对象，失败返回 null（带 2 次重试，与蜘蛛的重试口径一致）
async function hdGet(path) {
  for (var attempt = 0; attempt < 3; attempt++) {
    try {
      var resp = await Widget.http.get(HD_BASE + path, {
        headers: { "Accept": "application/json", "User-Agent": HD_UA },
        timeout: 20000
      });
      var d = resp && resp.data;
      if (d == null) return null;
      if (typeof d === "string") {
        try { d = JSON.parse(d); } catch (e) { return null; }
      }
      if (d && d.status === "n") return null;
      return d;
    } catch (e) {
      if (attempt >= 2) return null;
    }
  }
  return null
;
}

// 从接口返回里取数组（容忍 data.list / data.items / 裸数组等包装）
function hdPickList(obj) {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  var d = obj.data != null ? obj.data : obj;
  if (Array.isArray(d)) return d;
  if (d && typeof d === "object") {
    if (Array.isArray(d.list)) return d.list;
    if (Array.isArray(d.items)) return d.items;
  }
  if (Array.isArray(obj.list)) return obj.list;
  return [];
}

// 条目 id 清洗：去掉 rp_/up_ 前缀，id 缺失时用 drama_id
function hdCleanId(it) {
  it = it || {};
  var raw = hdStr(it.id).replace(/^rp_/, "").replace(/^up_/, "");
  if (!raw) raw = hdStr(it.drama_id).replace(/^up_/, "").replace(/^rp_/, "");
  return raw;
}

function hdCover(it) {
  it = it || {};
  return hdStr(it.img_y || it.img_x || it.img || it.cover || it.pic);
}

function hdToCard(it) {
  var id = hdCleanId(it);
  if (!id) return null;
  var cover = hdCover(it);
  var remark = hdStr(it.update_label || it.corner || (it.episode_count ? "全" + it.episode_count + "集" : ""));
  return {
    id: "huangdou://detail/" + id,
    type: "url",
    title: hdStr(it.name || it.title || it.t) || id,
    posterUrl: cover,
    posterPath: cover,
    coverUrl: cover,
    backdropPath: cover,
    remark: remark,
    description: remark,
    link: "huangdou://detail/" + id,
    mediaType: "movie"
  };
}

function hdCards(list) {
  var out = [];
  var seen = {};
  (list || []).forEach(function (it) {
    var c = it ? hdToCard(it) : null;
    if (c && !seen[c.id]) { seen[c.id] = 1; out.push(c); }
  });
  return out;
}

async function loadList(params) {
  params = params || {};
  var cat = hdStr(params.cat || params.path || "all") || "all";
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    if (cat === "yuandou") {
      // 黄豆原创走 navBlock 区块接口，展平所有区块的 items
      var nb = await hdGet("/navBlock?code=yuandou&tab=recommend&page=" + page);
      var blocks = hdPickList(nb);
      var items = [];
      blocks.forEach(function (b) {
        if (b && Array.isArray(b.items)) items = items.concat(b.items);
        else if (b && (b.id || b.drama_id)) items.push(b);
      });
      var cards = hdCards(items);
      if (cards.length) return cards;
      // 与蜘蛛一致的兜底：navBlock 为空时按关键词搜「黄豆原创」
      var fb = await hdGet("/search?keyword=" + encodeURIComponent("黄豆原创") + "&page=" + page);
      return hdCards(hdPickList(fb));
    }
    var q = "/list?page=" + page + "&page_size=" + HD_PAGE_SIZE;
    if (cat !== "all") {
      // 其他分类先经 navFilter 换取 cat_id（与蜘蛛同一口径）
      try {
        var nf = await hdGet("/navFilter?code=" + encodeURIComponent(cat));
        var tabs = hdPickList(nf);
        var flt = tabs && tabs[0] && tabs[0].filter;
        if (flt && flt.cat_id) q += "&cat_id=" + encodeURIComponent(flt.cat_id);
      } catch (e) { /* 无 tab 信息就退化成普通列表 */ }
    }
    var obj = await hdGet(q);
    return hdCards(hdPickList(obj));
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function hdPickKeyword(params) {
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
  var kw = hdPickKeyword(params);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!kw) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  try {
    var obj = await hdGet("/search?keyword=" + encodeURIComponent(kw) + "&page=" + page);
    var cards = hdCards(hdPickList(obj));
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关短剧" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

// 链接拆解：
//   huangdou://detail/<dramaId>          -> { kind: "drama", id }
//   huangdou://episode/<dramaId>/<seq>   -> { kind: "episode", id, seq }
//   裸 id                                 -> { kind: "drama", id }
function hdParseRef(link) {
  var v = String(link || "");
  var m = v.match(/^huangdou:\/\/episode\/(.+?)\/(\d+)$/);
  if (m) return { kind: "episode", id: m[1], seq: m[2] };
  m = v.match(/^huangdou:\/\/detail\/(.+)$/);
  if (m) return { kind: "drama", id: m[1] };
  return { kind: "drama", id: v.replace(/^huangdou:\/\//, "").replace(/^hd:\/\//, "").replace(/^rp_/, "").replace(/^up_/, "") };
}

async function hdDetailData(id) {
  var obj = await hdGet("/detail?id=" + encodeURIComponent(id));
  if (!obj) return null;
  var d = obj.data && typeof obj.data === "object" ? obj.data : obj;
  return d || null;
}

async function loadDetail(link) {
  var ref = hdParseRef(link);
  if (ref.kind !== "drama" || !ref.id) {
    return { id: String(link || ""), type: "url", title: "参数错误", link: String(link || "") };
  }
  try {
    var d = await hdDetailData(ref.id);
    if (!d) return { id: String(link), type: "url", title: "加载失败", link: String(link) };
    var title = hdStr(d.name || d.title) || ref.id;
    var cover = hdStr(d.img_y || d.img_x || d.img || d.cover);
    var rawEps = Array.isArray(d.episodes) ? d.episodes : [];
    var count = parseInt(d.episode_count, 10) || rawEps.length || 1;
    var episodes = [];
    if (rawEps.length) {
      rawEps.forEach(function (ep, idx) {
        if (!ep) return;
        var seq = hdStr(ep.seq || ep.episode || ep.ep) || String(idx + 1);
        var name = hdStr(ep.name || ep.title);
        if (!name || /^\d+$/.test(name)) name = "第" + seq + "集";
        // 与蜘蛛一致：非 free 集标注 [VIP]
        if (hdStr(ep.type || "free") !== "free") name += " [VIP]";
        episodes.push({ name: name, id: ref.id + "|" + seq, link: "huangdou://episode/" + ref.id + "/" + seq });
      });
    } else {
      for (var n = 1; n <= count; n++) {
        episodes.push({ name: "第" + n + "集", id: ref.id + "|" + n, link: "huangdou://episode/" + ref.id + "/" + n });
      }
    }
    return {
      id: String(link),
      type: "url",
      title: title,
      posterUrl: cover,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      description: hdStr(d.description || d.summary),
      episodes: episodes,
      link: String(link)
    };
  } catch (e) {
    return { id: String(link), type: "url", title: "加载失败", link: String(link) };
  }
}

// 单集播放地址：/play 实时换取（签名 URL 会过期，所以点播时才调）
async function hdEpisodePlay(id, seq) {
  var obj = await hdGet("/play?id=" + encodeURIComponent(id) + "&seq=" + encodeURIComponent(seq));
  if (!obj) return "";
  var pd = obj.data && typeof obj.data === "object" ? obj.data : obj;
  if (!pd) return "";
  if (Array.isArray(pd.lines)) {
    for (var i = 0; i < pd.lines.length; i++) {
      if (pd.lines[i] && hdStr(pd.lines[i].url)) return hdStr(pd.lines[i].url);
    }
  }
  return hdStr(pd.m3u8 || pd.url);
}

// 播放源解析（stream 模块）：单集链接只解该集；剧链接逐集解（连续 3 集无地址则停）
async function loadResource(params) {
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  var ref = hdParseRef(raw);
  try {
    if (ref.kind === "episode") {
      var one = await hdEpisodePlay(ref.id, ref.seq);
      if (!one) return [];
      return [{ name: "播放", url: one, playerType: "app", customHeaders: HD_PLAY_HEADERS }];
    }
    if (!ref.id) return [];
    var d = await hdDetailData(ref.id);
    if (!d) return [];
    var rawEps = Array.isArray(d.episodes) ? d.episodes : [];
    var seqs = [];
    if (rawEps.length) {
      rawEps.forEach(function (ep, idx) { if (ep) seqs.push(hdStr(ep.seq || ep.episode || ep.ep) || String(idx + 1)); });
    } else {
      var count = parseInt(d.episode_count, 10) || 1;
      for (var n = 1; n <= count; n++) seqs.push(String(n));
    }
    var out = [];
    var misses = 0;
    for (var i = 0; i < seqs.length; i++) {
      var url = await hdEpisodePlay(ref.id, seqs[i]);
      if (!url) {
        misses++;
        if (misses >= 3) break;
        continue;
      }
      misses = 0;
      out.push({ name: "第" + seqs[i] + "集", description: hdStr(d.name || d.title), url: url, playerType: "app", customHeaders: HD_PLAY_HEADERS });
    }
    return out;
  } catch (e) {
    return [];
  }
}
