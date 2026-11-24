// v2.0.1：AVDB 样式详情：分类小卡片 genreItems + 点按路由（详情页提取分类链接，点按打开该分类全部内容）
WidgetMetadata = {
  id: "feiye-v2",
  title: "绯夜",
  version: "2.0.1",
  requiredVersion: "0.0.1",
  description: "绯夜深夜放映厅，高清在线播放",
  author: "rewrite",
  site: "https://feiyechengren.pages.dev",
  detailCacheDuration: 1800,
  modules: [
    { id: "t20", title: "精品推荐", functionName: "loadT20", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "t22", title: "国产色情", functionName: "loadT22", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "t24", title: "亚洲无码", functionName: "loadT24", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "t25", title: "亚洲有码", functionName: "loadT25", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "t26", title: "中文字幕", functionName: "loadT26", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "t27", title: "巨乳美乳", functionName: "loadT27", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "t28", title: "人妻熟女", functionName: "loadT28", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "t30", title: "欧美精品", functionName: "loadT30", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "t31", title: "萝莉少女", functionName: "loadT31", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "t33", title: "成人动漫", functionName: "loadT33", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "t34", title: "自拍偷拍", functionName: "loadT34", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "t35", title: "制服丝袜", functionName: "loadT35", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "t37", title: "日本精品", functionName: "loadT37", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    { id: "t47", title: "91探花", functionName: "loadT47", cacheDuration: 600, params: [{ name: "page", title: "页码", type: "page" }] },
    {
      id: "t23",
      title: "主播直播",
      functionName: "loadT23",
      cacheDuration: 600,
      params: [{ name: "page", title: "页码", type: "page" }]
    },
    {
      id: "t32",
      title: "伦理三级",
      functionName: "loadT32",
      cacheDuration: 600,
      params: [{ name: "page", title: "页码", type: "page" }]
    },
    {
      id: "t36",
      title: "口交颜射",
      functionName: "loadT36",
      cacheDuration: 600,
      params: [{ name: "page", title: "页码", type: "page" }]
    },
    {
      id: "t38",
      title: "Cosplay",
      functionName: "loadT38",
      cacheDuration: 600,
      params: [{ name: "page", title: "页码", type: "page" }]
    },
    {
      id: "t39",
      title: "素人自拍",
      functionName: "loadT39",
      cacheDuration: 600,
      params: [{ name: "page", title: "页码", type: "page" }]
    },
    {
      id: "t40",
      title: "台湾辣妹",
      functionName: "loadT40",
      cacheDuration: 600,
      params: [{ name: "page", title: "页码", type: "page" }]
    },
    {
      id: "t41",
      title: "韩国御姐",
      functionName: "loadT41",
      cacheDuration: 600,
      params: [{ name: "page", title: "页码", type: "page" }]
    },
    {
      id: "t46",
      title: "多人多P",
      functionName: "loadT46",
      cacheDuration: 600,
      params: [{ name: "page", title: "页码", type: "page" }]
    },
    {
      id: "t52",
      title: "可爱学生",
      functionName: "loadT52",
      cacheDuration: 600,
      params: [{ name: "page", title: "页码", type: "page" }]
    },
    {
      id: "t59",
      title: "传媒出品",
      functionName: "loadT59",
      cacheDuration: 600,
      params: [{ name: "page", title: "页码", type: "page" }]
    }
  ],
  search: {
    title: "搜索",
    functionName: "searchVideos",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

var BASE = "https://feiyechengren.pages.dev";
var API = BASE + "/api3/";

function ok(resp) {
  if (!resp) return false;
  if (resp.ok !== undefined) return !!resp.ok;
  var code = resp.statusCode !== undefined ? resp.statusCode : resp.status;
  return typeof code === "number" ? (code >= 200 && code < 300) : !!resp.data;
}

async function api(params) {
  var qs = Object.keys(params).map(function(k) {
    return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
  }).join("&");
  var url = API + "?" + qs;
  try {
    var resp = await Widget.http.get(url, {
      headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" },
      timeout: 20000
    });
    if (!ok(resp)) return null;
    var d = resp.data;
    if (typeof d === "string") {
      try { return JSON.parse(d); } catch (e) { return null; }
    }
    return d;
  } catch (e) { return null; }
}

function toItems(list) {
  var items = [];
  (list || []).forEach(function(v) {
    if (!v.vod_id) return;
    items.push({
      id: "feiye_" + v.vod_id,
      type: "url",
      title: v.vod_name || "",
      posterUrl: v.vod_pic || "",
      posterPath: v.vod_pic || "",
      remark: v.vod_remarks || "",
      link: "feiye://detail/" + v.vod_id
    });
  });
  return items;
}

async function loadCat(typeId, params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var d = await api({ ac: "videolist", t: typeId, pg: page, pagesize: 30 });
  if (!d || !d.list) return [];
  return toItems(d.list);
}

async function searchVideos(params) {
  params = params || {};
  var kw = String(params.keyword || "").trim();
  if (!kw) return [];
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var d = await api({ ac: "videolist", wd: kw, pg: page, pagesize: 30 });
  if (!d || !d.list) return [];
  return toItems(d.list);
}

// ---- AVDB 样式详情：分类小卡片（点按出该分类全部内容）----
// v2.0.1：详情页提取分类链接建成 genreItems；点按分类后 loadDetail 走分类分支返回该分类全部内容。
var TAX_GENRE_RE = /\/(genres?|tags?|category|categor(?:y|ies)|labels?|makers?)\//i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)?|labels?|makers?|all|全部|分类|标签|题材)$/i;

function taxSlugOf(u) {
  var p = String(u || "").replace(/^https?:\/\/[^\/]+/, "").split("?")[0].split("#")[0].split("/").filter(function (s) { return s !== ""; });
  return p.length ? p[p.length - 1] : "";
}

function taxDetailRet(ret, genres) {
  if (ret && genres && genres.length) ret.genreItems = genres;
  return ret;
}

function extractGenreFromHtml(html) {
  var out = [];
  var seen = {};
  var baseHost = String(BASE).replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(String(html || ""))) !== null) {
    var href = m[1] || "";
    var name = String(m[2] || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (!name || name.length > 40 || TAX_NAV_NAME_RE.test(name)) continue;
    var abs = href;
    if (!/^https?:\/\//i.test(abs)) continue;
    var host = abs.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (baseHost && host !== baseHost) continue;
    var pth = abs.replace(/^https?:\/\/[^\/]+/, "").split("?")[0].split("#")[0];
    var segs = pth.split("/").filter(function (s) { return s !== ""; });
    var ok = false;
    if (segs.length === 2 && TAX_GENRE_RE.test(abs)) ok = true;
    if (!ok) continue;
    if (seen[abs]) continue;
    seen[abs] = 1;
    out.push({ id: abs, title: name });
    if (out.length >= 20) break;
  }
  return out;
}

function feiyeGenresFromItem(v) {
  var out = [];
  if (!v) return out;
  var cls = String(v.vod_class || "").trim();
  var tid = v.type_id;
  if (cls && tid != null && String(tid) !== "") {
    out.push({ id: "feiyetype:" + tid + ":" + encodeURIComponent(cls), title: cls });
  }
  return out;
}
async function loadDetail(link) {
  var taxGenres = [];
  try {
  var taxRaw = String(link || "");
  if (taxRaw.indexOf("feiyetype:") === 0) {
    var taxParts = taxRaw.split(":");
    var taxTid = parseInt(taxParts[1] || "0", 10) || 0;
    var taxName = "";
    try { taxName = decodeURIComponent(taxParts[2] || ""); } catch (e) { taxName = taxParts[2] || ""; }
    var taxWorks = taxTid ? await loadCat(taxTid, { page: 1 }) : await searchVideos({ keyword: taxName, page: 1 });
    if (!Array.isArray(taxWorks)) taxWorks = [];
    var taxReal = taxWorks.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
    return {
      id: taxRaw,
      type: "detail",
      mediaType: "movie",
      title: taxName || "分类",
      link: taxRaw,
      description: "分类 · 共 " + taxReal.length + " 部作品",
      videoUrl: "",
      childItems: [],
      relatedItems: taxReal.length ? taxReal : taxWorks
    };
  }
    var id = String(link).replace("feiye://detail/", "");
    var d = await api({ ac: "detail", ids: id });
    if (!d || !d.list || !d.list.length) {
      return { id: link, title: "加载失败", link: link };
    }
    var v = d.list[0];
    var videoUrl = "";
    var playUrl = v.vod_play_url || "";
    // 格式：在线播放$url
    var m = playUrl.match(/\$([^\$#]+)/);
    if (m) videoUrl = m[1];
    var ret = {
      id: link,
      type: "url",
      title: v.vod_name || "",
      posterUrl: v.vod_pic || "",
      description: v.vod_content || v.vod_blurb || "",
      videoUrl: videoUrl,
      link: link,
      playerType: "system"
    };
    var taxG = feiyeGenresFromItem(v);
    if (taxG.length) ret.genreItems = taxG;
    return ret;
  } catch (e) {
    return { id: link, title: "加载失败", link: link };
  }
}


async function loadT23(p) { return loadCat(23, p); }
async function loadT32(p) { return loadCat(32, p); }
async function loadT36(p) { return loadCat(36, p); }
async function loadT38(p) { return loadCat(38, p); }
async function loadT39(p) { return loadCat(39, p); }
async function loadT40(p) { return loadCat(40, p); }
async function loadT41(p) { return loadCat(41, p); }
async function loadT46(p) { return loadCat(46, p); }
async function loadT52(p) { return loadCat(52, p); }
async function loadT59(p) { return loadCat(59, p); }
async function loadT20(p) { return loadCat(20, p); }
async function loadT22(p) { return loadCat(22, p); }
async function loadT24(p) { return loadCat(24, p); }
async function loadT25(p) { return loadCat(25, p); }
async function loadT26(p) { return loadCat(26, p); }
async function loadT27(p) { return loadCat(27, p); }
async function loadT28(p) { return loadCat(28, p); }
async function loadT30(p) { return loadCat(30, p); }
async function loadT31(p) { return loadCat(31, p); }
async function loadT33(p) { return loadCat(33, p); }
async function loadT34(p) { return loadCat(34, p); }
async function loadT35(p) { return loadCat(35, p); }
async function loadT37(p) { return loadCat(37, p); }
async function loadT47(p) { return loadCat(47, p); }
async function loadT48(p) { return loadCat(48, p); }
