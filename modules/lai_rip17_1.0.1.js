// v1.0.1：AVDB 样式详情：peoples/genreItems + 点按路由
// 17RIP for REX (lai_rip17 v1.0.0)
// 移植自 mira-cat 蜘蛛 rip17.js，后端：https://17rip.com（MacCMS 站，dsn2 模板）
// 列表：/vodshow/{id}-----------.html（翻页 --------{page}---），public-list-box 卡片，
//   封面 img.uyjthen.com 直链，无需代理。
// 详情：.anthology-list-box 集链接 -> 第一集播放页 SSR 内嵌 var player_aaaa={...}，
//   encrypt=0 时 url 即 CDN master m3u8（hsm3.hwzcfz.com，站方单档 720p）；
//   encrypt=1/2 按 MacCMS 标准解码（纯 JS base64，无 Buffer）附带作保险。

WidgetMetadata = {
  id: "lai_rip17",
  title: "17RIP",
  description: "17RIP（17rip.com）：日韩/国产/欧美/动漫等 33 个分类，详情页 player_aaaa 实时解析 m3u8（站方单档 720p）",
  author: "lai",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  site: "https://17rip.com",
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
          value: "1",
          enumOptions: [
            { title: "日韩", value: "1" },
            { title: "国产", value: "2" },
            { title: "欧美", value: "3" },
            { title: "动漫", value: "4" },
            { title: "网曝门", value: "5" },
            { title: "OnlyFans", value: "33" },
            { title: "人妻熟女", value: "6" },
            { title: "日本无码", value: "7" },
            { title: "美乳巨乳", value: "8" },
            { title: "强制侵犯", value: "9" },
            { title: "制服诱惑", value: "10" },
            { title: "绝色佳人", value: "11" },
            { title: "风俗泡泡浴", value: "12" },
            { title: "家庭乱伦", value: "20" },
            { title: "少女萝莉", value: "21" },
            { title: "SM调教", value: "22" },
            { title: "绝顶潮吹", value: "23" },
            { title: "魔镜系列", value: "24" },
            { title: "时间停止", value: "25" },
            { title: "催眠洗脑", value: "26" },
            { title: "漫改系列", value: "27" },
            { title: "电车痴汉", value: "28" },
            { title: "淫欲痴女", value: "29" },
            { title: "AV解说", value: "34" },
            { title: "AI换脸", value: "37" },
            { title: "网红主播", value: "13" },
            { title: "国产传媒", value: "14" },
            { title: "探花系列", value: "15" },
            { title: "国产自拍", value: "16" },
            { title: "其他", value: "35" },
            { title: "欧美精品", value: "30" },
            { title: "3D动漫", value: "32" },
            { title: "三级电影", value: "36" }
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

var BASE = "https://17rip.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = BASE + "/";

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": referer || REFERER
  };
}

function t(v) {
  return String(v == null ? "" : v).trim();
}

function clean(s) {
  return t(s).replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
}

function stripTags(s) {
  return clean(String(s || "").replace(/<[^>]+>/g, ' '));
}

function fixUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  return BASE + (u.charAt(0) === "/" ? u : "/" + u);
}

// 纯 JS base64 -> UTF-8 字符串（encrypt=2 解码用，无 Buffer）
var B64CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64decodeUtf8(str) {
  var s = String(str || "").replace(/[\r\n\s]/g, "");
  if (!s) return "";
  var bytes = [];
  for (var i = 0; i < s.length; i += 4) {
    var c0 = B64CHARS.indexOf(s.charAt(i));
    var c1 = B64CHARS.indexOf(s.charAt(i + 1));
    var pad2 = s.charAt(i + 2) === "=";
    var pad3 = s.charAt(i + 3) === "=";
    var c2 = pad2 ? 0 : B64CHARS.indexOf(s.charAt(i + 2));
    var c3 = pad3 ? 0 : B64CHARS.indexOf(s.charAt(i + 3));
    if (c0 < 0 || c1 < 0) break;
    bytes.push((c0 << 2) | (c1 >> 4));
    if (!pad2) bytes.push(((c1 & 15) << 4) | (c2 >> 2));
    if (!pad3) bytes.push(((c2 & 3) << 6) | c3);
  }
  var out = "";
  for (var j = 0; j < bytes.length;) {
    var b = bytes[j++];
    if (b < 0x80) { out += String.fromCharCode(b); continue; }
    if (b >= 0xC2 && b <= 0xDF) {
      var b2 = bytes[j++];
      out += String.fromCharCode(((b & 0x1F) << 6) | (b2 & 0x3F));
    } else if (b >= 0xE0 && b <= 0xEF) {
      var b3 = bytes[j++], b4 = bytes[j++];
      out += String.fromCharCode(((b & 0x0F) << 12) | ((b3 & 0x3F) << 6) | (b4 & 0x3F));
    } else if (b >= 0xF0 && b <= 0xF4) {
      var b5 = bytes[j++], b6 = bytes[j++], b7 = bytes[j++];
      var cp = ((b & 0x07) << 18) | ((b5 & 0x3F) << 12) | ((b6 & 0x3F) << 6) | (b7 & 0x3F);
      cp -= 0x10000;
      out += String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 0x3FF));
    } else {
      out += "�";
    }
  }
  return out;
}

// MacCMS encrypt=1 的 unescape 等价实现（%XX 与 %uXXXX）
function jsUnescape(s) {
  return String(s || "").replace(/%u([0-9a-fA-F]{4})|%([0-9a-fA-F]{2})/g, function (m, u, h) {
    if (u) return String.fromCharCode(parseInt(u, 16));
    return String.fromCharCode(parseInt(h, 16));
  });
}

async function fetchText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  var body = res && res.data != null ? String(res.data) : "";
  return body;
}

function card(id, title, pic, remarks) {
  var link = BASE + "/voddetail/" + id + ".html";
  return {
    id: link,
    type: "url",
    title: title || id,
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    link: link,
    description: remarks || "",
    mediaType: "movie"
  };
}

// 网格卡片（分类页：public-list-box）
function parseCards(html) {
  var out = [];
  var seen = {};
  var blocks = String(html || "").split("public-list-box");
  for (var i = 1; i < blocks.length; i++) {
    var win = blocks[i].slice(0, 2500);
    var dm = win.match(/href="\/voddetail\/(\d+)\.html"/);
    if (!dm) continue;
    var id = dm[1];
    if (seen[id]) continue;
    seen[id] = 1;
    var title = "";
    var tm = win.match(/public-list-exp"[^>]*title="([^"]*)"/) || win.match(/<img[^>]+alt="([^"]*)"/);
    if (tm) title = clean(tm[1]);
    var pic = "";
    var pm = win.match(/data-src="([^"]+)"/);
    if (pm) pic = fixUrl(pm[1]);
    var remarks = "";
    var rm = win.match(/public-list-prb[^>]*>([\s\S]{0,80}?)<\/span>/);
    if (rm) remarks = stripTags(rm[1]);
    if (!remarks) {
      var rp = win.match(/public-prt[^>]*>([^<]*)</);
      if (rp) remarks = clean(rp[1]);
    }
    out.push(card(id, title || id, pic, remarks));
  }
  return out;
}

// 搜索页卡片（横排：vod-detail.search-list）
function parseSearchCards(html) {
  var out = [];
  var seen = {};
  var blocks = String(html || "").split("search-list");
  for (var i = 1; i < blocks.length; i++) {
    var win = blocks[i].slice(0, 3500);
    var dm = win.match(/href="\/voddetail\/(\d+)\.html"/);
    if (!dm) continue;
    var id = dm[1];
    if (seen[id]) continue;
    seen[id] = 1;
    var title = "";
    var tm = win.match(/slide-info-title[^>]*>([^<]*)</);
    if (tm) title = clean(tm[1]);
    if (!title) {
      var am = win.match(/<img[^>]+alt="([^"]*)"/);
      if (am) title = clean(am[1]);
    }
    var pic = "";
    var pm = win.match(/data-src="([^"]+)"/);
    if (pm) pic = fixUrl(pm[1]);
    var remarks = "";
    var rm = win.match(/slide-info-remarks[^>]*>([^<]*)</);
    if (rm) remarks = clean(rm[1]);
    out.push(card(id, title || id, pic, remarks));
  }
  return out;
}

function catUrl(tid, page) {
  page = Math.max(1, page || 1);
  return page > 1 ? BASE + "/vodshow/" + tid + "--------" + page + "---.html" : BASE + "/vodshow/" + tid + "-----------.html";
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var tid = t(params.path || "1") || "1";
  try {
    var html = await fetchText(catUrl(tid, page));
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有更多内容" }];
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
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词搜索" }];
  try {
    var enc = encodeURIComponent(wd);
    var url = page > 1 ? BASE + "/vodsearch/" + enc + "----------" + page + "---.html" : BASE + "/vodsearch/" + enc + "-------------.html";
    var html = await fetchText(url);
    var list = parseSearchCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

// ---- AVDB 样式详情：演员/分类（点按出对应全部内容）----
// 详情页 HTML 里扫演员/分类链接（站内同源），建成 peoples / genreItems；
// 点按后 loadDetail 走分类页分支（loadList 取该分类的全部影片，取不到则 search 回落）。
var TAX_HOST_OVERRIDE = "";
var TAX_BASE = BASE;
var TAX_ACTRESS_RE = /\/(actress(es)?|actors?|pornstars?|stars?|models?|performers?|idols?)\//i;
var TAX_GENRE_RE = /(\/(genres?|tags?|categor(?:y|ies))\/|(vodtype|vodshow)\/)/i;
var TAX_NAV_NAME_RE = /^(genres?|tags?|categor(?:y|ies)|category|actress(es)?|actors?|pornstars?|stars?|models?|makers?|channels?|labels?|all|全部|分类|演员|标签|女优|题材|片商)$/i;
function taxAbs(href) {
  var s = String(href || "").split("#")[0];
  if (/^https?:\/\//i.test(s)) return s;
  if (s.indexOf("//") === 0) return "https:" + s;
  var base = TAX_HOST_OVERRIDE || TAX_BASE;
  base = String(base || "").replace(/\/+$/, "");
  if (s.charAt(0) === "/") return base + s;
  return base + "/" + s;
}
function taxSlugOf(abs, isActress) {
  var path = String(abs || "").split("?")[0].split("#")[0];
  var vm = path.match(/\/(vodtype|vodshow)\/(\d+)/i);
  if (vm) return vm[2];
  var parts = path.replace(/^https?:\/\/[^/]+\//, "").split("/");
  var segs = [];
  for (var i = 0; i < parts.length; i++) { if (parts[i]) segs.push(parts[i]); }
  while (segs.length && (/^\d+\.html$/i.test(segs[segs.length - 1]) || /^\d+$/.test(segs[segs.length - 1]) || segs[segs.length - 1] === "page")) segs.pop();
  for (var j = 0; j < segs.length; j++) {
    if (/_(category|makersr)$/i.test(segs[j]) && segs[j + 2]) return segs[j + 2];
  }
  if (!segs.length) return "";
  var last = segs[segs.length - 1];
  if (/^(genres?|tags?|categor(?:y|ies)|category|labels?|makers?|channels?|actress(es)?|actors?|pornstars?|stars?|models?|performers?|idols?)$/i.test(last)) return "";
  return last;
}
function extractTaxonomyFromHtml(html, hostOverride) {
  if (hostOverride) TAX_HOST_OVERRIDE = hostOverride;
  var peoples = [];
  var genreItems = [];
  var seenP = {};
  var seenG = {};
  var baseHost = String(TAX_HOST_OVERRIDE || TAX_BASE || "").replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
  var re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(String(html || ""))) !== null) {
    var href = m[1] || "";
    var name = String(m[2] || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (!name || name.length > 40 || TAX_NAV_NAME_RE.test(name)) continue;
    var abs = taxAbs(href).split(" ").join("%20");
    if (!/^https?:\/\//i.test(abs)) continue;
    var host = abs.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    if (baseHost && host !== baseHost) continue;
    var isA = TAX_ACTRESS_RE.test(abs);
    var isG = !isA && TAX_GENRE_RE.test(abs);
    if (!isA && !isG) continue;
    var seg = taxSlugOf(abs, isA);
    if (!seg) continue;
    if (isA) {
      if (seenP[abs]) continue;
      seenP[abs] = 1;
      peoples.push({ id: abs, title: name, name: name, link: abs, role: "演员" });
    } else {
      if (seenG[abs]) continue;
      seenG[abs] = 1;
      genreItems.push({ id: abs, title: name });
    }
    if (peoples.length >= 20 && genreItems.length >= 20) break;
  }
  return { peoples: peoples, genreItems: genreItems };
}
function taxNameFromUrl(url) {
  var s = String(url || "");
  if (s.indexOf("actor:") === 0) return s.slice(6);
  if (s.indexOf("tag:") === 0) return s.slice(4);
  if (s.indexOf("g:") === 0) return s.slice(2);
  var seg = taxSlugOf(s, false);
  var name = seg;
  try { name = decodeURIComponent(seg); } catch (e) { name = seg; }
  return String(name || "").replace(/\+/g, " ").trim();
}
async function taxPrimaryWorks(url, name, isActress) {
  var m = String(url || "").match(/\/vodtype\/(\d+)/i);
  if (m) { try { return await loadList({ path: m[1], page: 1 }); } catch (e) { return []; } }
  return [];
}
async function taxRouteDetail(url, isActress) {
  var name = taxNameFromUrl(url);
  var works = [];
  try { works = await taxPrimaryWorks(url, name, isActress) || []; } catch (e) { works = []; }
  if (!Array.isArray(works)) works = [];
  var real = works.filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
  if (!real.length) {
    try { var sw = await search({ keyword: name }); if (Array.isArray(sw)) works = sw; } catch (e2) {}
    real = (works || []).filter(function (w) { return w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty"; });
  }
  return { id: url, type: "detail", mediaType: "movie", title: name || (isActress ? "演员" : "分类"), link: url, description: (isActress ? "演员" : "分类") + " · 共 " + real.length + " 部作品", videoUrl: "", childItems: [], relatedItems: real.length ? real : works };
}


async function loadDetail(link) {
  var taxRaw = (typeof link === "string" ? link : (link && (link.link || link.id || link.url)) || "");
  if (taxRaw && (TAX_ACTRESS_RE.test(taxRaw) || TAX_GENRE_RE.test(taxRaw) || taxRaw.indexOf("actor:") === 0 || taxRaw.indexOf("tag:") === 0)) { return await taxRouteDetail(taxRaw, TAX_ACTRESS_RE.test(taxRaw) || taxRaw.indexOf("actor:") === 0); }
  var url = String(link || "");
  try {
    var idm = url.match(/voddetail\/(\d+)\.html/) || url.match(/^(\d+)$/);
    var id = idm ? idm[1] : "";
    if (!id) return { id: url || "err", type: "url", title: "链接无效" };
    var durl = BASE + "/voddetail/" + id + ".html";
    var html = await fetchText(durl);
    if (!html) return { id: durl, type: "url", title: "详情页为空" };

    var name = "";
    var nm = html.match(/slide-info-title[^>]*>([^<]*)</);
    if (nm) name = clean(nm[1]);
    var pic = "";
    var pm = html.match(/detail-pic[^>]*>[\s\S]{0,300}?data-src="([^"]+)"/);
    if (pm) pic = fixUrl(pm[1]);
    if (!pic) {
      var og = html.match(/property="og:image"\s+content="([^"]+)"/);
      if (og) pic = fixUrl(og[1]);
    }
    var remarks = "";
    var rm = html.match(/slide-info-remarks[^>]*>([^<]*)</);
    if (rm) remarks = clean(rm[1]);

    // 第一集播放页（与蜘蛛 detail 的线路表顺序一致，取第一条线路第一集）
    var playPath = "";
    var em = html.match(/<a[^>]+href="(\/vodplay\/[^"]+)"[^>]*>/);
    if (em) playPath = em[1];
    if (!playPath) {
      return { id: durl, type: "url", title: name || id, posterPath: pic, coverUrl: pic, backdropPath: pic, link: durl, description: "未找到播放地址" };
    }
    var purl = fixUrl(playPath);
    var phtml = await fetchText(purl, durl);
    var dm = phtml.match(/var\s+player_aaaa\s*=\s*(\{[\s\S]*?\})\s*<\/script>/) || phtml.match(/var\s+player_aaaa\s*=\s*(\{[^{}]*\})/);
    if (!dm) {
      return { id: durl, type: "url", title: name || id, description: "未找到播放地址" };
    }
    var pd = null;
    try { pd = JSON.parse(dm[1]); } catch (e) {}
    if (!pd || !pd.url) {
      return { id: durl, type: "url", title: name || id, description: "未找到播放地址" };
    }
    var raw = String(pd.url);
    var enc2 = parseInt(pd.encrypt, 10) || 0;
    try {
      if (enc2 === 1) raw = jsUnescape(raw);
      else if (enc2 === 2) raw = jsUnescape(b64decodeUtf8(raw));
    } catch (e) {}
    var videoUrl = fixUrl(raw);
    var tax = extractTaxonomyFromHtml(html);
    var ret = {
      id: durl,
      type: "detail",
      title: name || id,
      link: durl,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      videoUrl: videoUrl,
      playerType: "app",
      description: remarks || "",
      customHeaders: {
        "User-Agent": UA,
        "Referer": purl
      }
    };
    if (tax.peoples.length) ret.peoples = tax.peoples;
    if (tax.genreItems.length) ret.genreItems = tax.genreItems;
    return ret;
  } catch (e) {
    return { id: url || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
