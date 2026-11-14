// 蜜夜AI for REX (lai_miyexai v1.0.0)
// 移植自 mira-cat 蜘蛛 littlepervert.js（只读蓝图），后端 https://littlepervert.com/。
// AI 生成的成人短剧站（竖屏短剧，每部剧多集）。Vue 前端。
// 分类：5 个顶级分组 -> 66 个子分类（/zh-CN/categories/ 的 JSON-LD），
//   子分类做筛选卡片，不平铺：故事（13）/ 角色（10）/ 氛围与癖好（15）/ 场景（10）/ 外形（18）。
// 列表：分类页 /zh-CN/c/<slug>/ 一次渲染全部剧集（JSON-LD ItemList + HTML 卡片），
//   站内无翻页，模块本地按 20 条一页切分（page 1 前 20 条、page 2 剩余）。
// 详情：剧集页 /zh-CN/s/<slug>/ 内嵌 eps JSON（签名 m3u8，15 分钟过期）。
// 播放：签名疑似绑 IP，必须点播现取：详情只放 token，loadResource 现调
//   GET /p?s=<slug> 拿新鲜签名 m3u8。单档 720p 竖屏，无多清晰度。

WidgetMetadata = {
  id: "lai_miyexai",
  title: "蜜夜AI",
  description: "蜜夜AI：AI 成人短剧站，5 分组 66 子分类筛选，每部多集，单档 720p 竖屏，点播现取新鲜签名",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://littlepervert.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "故事", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分组", type: "constant", value: "story" }, { name: "sub", title: "分类", type: "enumeration", value: "off-limits", enumOptions: [{ title: "禁忌", value: "off-limits" }, { title: "第一人称", value: "pov" }, { title: "喜剧", value: "comedy" }, { title: "慢热", value: "slow-burn" }, { title: "对手与复仇", value: "rivals" }, { title: "郊区", value: "suburbia" }, { title: "旅行", value: "travel" }, { title: "奇幻", value: "fantasy" }, { title: "办公室", value: "office" }, { title: "历史", value: "historical" }, { title: "室友", value: "roommates" }, { title: "科幻", value: "sci-fi" }, { title: "保镖与制服", value: "bodyguard" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "角色", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分组", type: "constant", value: "role" }, { name: "sub", title: "分类", type: "enumeration", value: "threesome", enumOptions: [{ title: "3P", value: "threesome" }, { title: "继母", value: "stepmom" }, { title: "熟女", value: "milf" }, { title: "人妻", value: "wife" }, { title: "女王", value: "femdom" }, { title: "强势女", value: "dominant-women" }, { title: "绿帽", value: "cuckold" }, { title: "群交", value: "group" }, { title: "魔物娘", value: "monster-girl" }, { title: "女女", value: "girl-girl" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "氛围与癖好", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分组", type: "constant", value: "mood" }, { name: "sub", title: "分类", type: "enumeration", value: "almost-caught", enumOptions: [{ title: "差点被抓", value: "almost-caught" }, { title: "重组家庭", value: "blended-family" }, { title: "出轨", value: "cheating" }, { title: "游戏与挑战", value: "dares" }, { title: "三角恋", value: "love-triangle" }, { title: "偷窥", value: "voyeur" }, { title: "王室", value: "royalty" }, { title: "摔角", value: "wrestling" }, { title: "角色扮演游戏", value: "roleplay" }, { title: "婚礼", value: "wedding" }, { title: "公共场所", value: "public" }, { title: "勒索", value: "blackmail" }, { title: "贞操", value: "chastity" }, { title: "恋足", value: "foot-fetish" }, { title: "BDSM", value: "bdsm" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "场景", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分组", type: "constant", value: "scene" }, { name: "sub", title: "分类", type: "enumeration", value: "home", enumOptions: [{ title: "家中", value: "home" }, { title: "泳池", value: "pool" }, { title: "派对", value: "party" }, { title: "海滩与游艇", value: "beach" }, { title: "淋浴", value: "shower" }, { title: "车内", value: "car" }, { title: "户外", value: "outdoors" }, { title: "卧室", value: "bedroom" }, { title: "酒店", value: "hotel" }, { title: "健身房", value: "gym" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "外形", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分组", type: "constant", value: "look" }, { name: "sub", title: "分类", type: "enumeration", value: "white", enumOptions: [{ title: "白人", value: "white" }, { title: "20多岁", value: "age-20s" }, { title: "金发", value: "blonde" }, { title: "巨乳", value: "busty" }, { title: "纤瘦", value: "slim" }, { title: "30多岁", value: "age-30s" }, { title: "运动型", value: "athletic" }, { title: "棕发", value: "brunette" }, { title: "彩色头发", value: "colored-hair" }, { title: "红发", value: "redhead" }, { title: "黑发", value: "black-hair" }, { title: "40岁以上", value: "age-40s" }, { title: "丰满", value: "curvy" }, { title: "巨臀", value: "big-ass" }, { title: "拉丁裔", value: "latina" }, { title: "亚洲人", value: "asian" }, { title: "娇小", value: "petite" }, { title: "黑人", value: "ebony" }] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://littlepervert.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var PAGE_SIZE = 20;

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  var r = t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  r = r.replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); });
  r = r.replace(/&#x([0-9a-fA-F]+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 16)); });
  return r;
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return HOST + "/" + u;
}

async function getHtml(url, referer) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Referer": referer || HOST + "/zh-CN/"
      }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body;
  } catch (e) { return ""; }
}

async function getJson(url) {
  var txt = await getHtml(url);
  if (!txt) return null;
  try { return JSON.parse(txt); } catch (e) { return null; }
}

function slugFromUrl(url) {
  var m = String(url || "").match(/\/zh-CN\/s\/([^\/\?#]+)/i);
  return m ? m[1] : "";
}

// 从 HTML 里按 key 取一段平衡括号的 JSON（数组或对象），返回解析后的值
function extractJsonByKey(html, key) {
  var re = new RegExp('"' + key + '"\\s*:\\s*(\\[|\\{)');
  var m = re.exec(html);
  if (!m) return null;
  var start = m.index + m[0].length - 1;
  var open = html[start];
  var close = open === "[" ? "]" : "}";
  var depth = 0;
  var inStr = false;
  var esc = false;
  for (var i = start; i < html.length; i++) {
    var ch = html[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) {
        try { return JSON.parse(html.slice(start, i + 1)); } catch (e) { return null; }
      }
    }
  }
  return null;
}

// 解析分类页/搜索页的剧集卡片：<div class="card">…href / img src+alt / 集数
function parseCards(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var chunks = String(html).split('<div class="card"');
  for (var i = 1; i < chunks.length; i++) {
    var c = chunks[i];
    var hm = c.match(/<a[^>]+href="(\/zh-CN\/s\/[^"\/]+\/)"[^>]*>/i);
    if (!hm) continue;
    var url = absUrl(hm[1]);
    if (seen[url]) continue;
    seen[url] = 1;
    var im = c.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
    var title = "";
    var pic = "";
    if (im) {
      pic = absUrl(im[1]);
      var am = im[0].match(/alt="([^"]*)"/i);
      if (am) title = decodeHtml(am[1]);
    }
    if (!title) {
      var tm = c.match(/<span[^>]*class="ctitle"[^>]*>([^<]+)<\/span>/i)
        || c.match(/<h[23][^>]*>([^<]{2,120})<\/h/i);
      if (tm) title = decodeHtml(tm[1]);
    }
    var remarks = "";
    var em = c.match(/<span[^>]*class="epn"[^>]*aria-label="([^"]*)"/i)
      || c.match(/aria-label="(\d+\s*集)"/i);
    if (em) remarks = decodeHtml(em[1]).replace(/\s+/g, "");
    out.push({
      id: url,
      type: "url",
      title: title || slugFromUrl(url) || url,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: url,
      description: remarks,
      mediaType: "movie"
    });
  }
  return out;
}

// 解析 JSON-LD ItemList（分类页备用通道）
function parseJsonLd(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var d = null;
    try { d = JSON.parse(m[1]); } catch (e) { continue; }
    var arr = Array.isArray(d) ? d : [d];
    for (var k = 0; k < arr.length; k++) {
      var it = arr[k];
      if (!it || it["@type"] !== "ItemList") continue;
      var els = it.itemListElement || [];
      for (var j = 0; j < els.length; j++) {
        var item = els[j] && els[j].item ? els[j].item : null;
        if (!item || !item.url) continue;
        var url = absUrl(item.url);
        if (seen[url]) continue;
        seen[url] = 1;
        out.push({
          id: url,
          type: "url",
          title: decodeHtml(item.name || slugFromUrl(url)),
          posterPath: absUrl(item.image || ""),
          coverUrl: absUrl(item.image || ""),
          backdropPath: absUrl(item.image || ""),
          link: url,
          description: "",
          mediaType: "movie"
        });
      }
    }
  }
  return out;
}

function parseList(html) {
  var list = parseCards(html);
  if (!list.length) list = parseJsonLd(html);
  return list;
}

// 本地分页：把一次取回的完整列表按 PAGE_SIZE 切页返回
function paginate(list, page) {
  var total = list.length;
  var pagecount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > pagecount) return [];
  var start = (page - 1) * PAGE_SIZE;
  return list.slice(start, start + PAGE_SIZE);
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

var ZONE_DEFAULT = { story: "off-limits", role: "threesome", mood: "almost-caught", scene: "home", look: "white" };

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "story");
  var sub = t(params.sub || "") || ZONE_DEFAULT[zone] || "off-limits";
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var html = await getHtml(HOST + "/zh-CN/c/" + encodeURIComponent(sub) + "/");
    var list = paginate(parseList(html), page);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

async function search(params) {
  params = params || {};
  var wd = t(params.keyword || params.wd || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return emptyItem("请输入关键词");
  try {
    var html = await getHtml(HOST + "/zh-CN/search/?q=" + encodeURIComponent(wd));
    var list = paginate(parseList(html), page);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

function extractTitle(html, fallback) {
  var m = html.match(/property=["']og:title["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  if (m) return decodeHtml(m[1]).replace(/\s*[–—-]\s*AI成人短剧.*$/i, "").replace(/\s*[｜|].*$/, "");
  m = html.match(/<title>([^<]+)<\/title>/i);
  if (m) return decodeHtml(m[1]).replace(/\s*[–—-]\s*AI成人短剧.*$/i, "").replace(/\s*[｜|].*$/, "");
  return fallback || "";
}

function extractCover(html) {
  var m = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (m) return absUrl(m[1]);
  return "";
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var pageUrl = absUrl(raw);
    var slug = slugFromUrl(pageUrl);
    if (!slug) return { id: pageUrl, type: "url", title: "解析失败", description: "链接不是剧集页" };
    var html = await getHtml(pageUrl, pageUrl);
    if (!html) return { id: pageUrl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = extractTitle(html, slug);
    var pic = extractCover(html);
    var content = "";
    var dm = html.match(/property=["']og:description["'][^>]*content=["']([^"']+)/i);
    if (dm) content = decodeHtml(dm[1]);
    // 剧集页内嵌 eps JSON：[{n, u:"/h/<slug>/<n>.m3u8?x=..&t=..", poster, duration, subs}]
    // 签名只有 15 分钟有效，这里只放 token，不直接返回签名地址
    var eps = extractJsonByKey(html, "eps");
    var plays = [];
    if (Array.isArray(eps)) {
      var sorted = eps.slice().sort(function (a, b) { return (parseInt(a.n, 10) || 0) - (parseInt(b.n, 10) || 0); });
      for (var i = 0; i < sorted.length; i++) {
        var n = parseInt(sorted[i].n, 10);
        if (!n) continue;
        plays.push({ num: n, id: pageUrl + "@@LP:" + slug + ":" + n });
      }
    }
    // eps 没解析出来时，尝试从 /p?s= 现取集数
    if (!plays.length) {
      var fresh = await getJson(HOST + "/p?s=" + encodeURIComponent(slug));
      if (fresh && fresh.ok && fresh.u) {
        var keys = Object.keys(fresh.u).map(function (k) { return parseInt(k, 10); }).filter(function (n) { return n > 0; }).sort(function (a, b) { return a - b; });
        for (var j = 0; j < keys.length; j++) {
          plays.push({ num: keys[j], id: pageUrl + "@@LP:" + slug + ":" + keys[j] });
        }
      }
    }
    var epsList = [];
    var epItems = [];
    var seasonEps = [];
    for (var k = 0; k < plays.length; k++) {
      var label = "第" + plays[k].num + "集";
      epsList.push({ name: label, link: plays[k].id });
      seasonEps.push({ title: label, episodeNumber: plays[k].num });
      epItems.push({
        id: plays[k].id,
        type: "url",
        title: label,
        mediaType: "movie",
        posterPath: pic,
        link: plays[k].id,
        episode: plays[k].num,
        episodeNumber: plays[k].num,
        seasonIndex: 1,
        seasonNumber: 1
      });
    }
    var result = {
      id: pageUrl,
      type: "detail",
      title: name || slug,
      name: name || slug,
      description: content,
      mediaType: "movie",
      link: pageUrl,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app"
    };
    if (epsList.length) {
      result.episodes = epsList;
      result.seasons = [{ seasonNumber: 1, title: "全集", name: "全集", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
    }
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 集入口：@@LP:<slug>:<n> -> 现调 /p?s=<slug> 拿新鲜签名 m3u8（15 分钟有效，疑似绑 IP）
  var at = raw.indexOf("@@LP:");
  if (at >= 0) {
    var tok = raw.slice(at + 5);
    var parts = tok.split(":");
    var slug = parts[0];
    var n = parts[1];
    var label = "第" + n + "集";
    var fresh = await getJson(HOST + "/p?s=" + encodeURIComponent(slug));
    var u = "";
    if (fresh && fresh.ok && fresh.u && fresh.u[n]) u = String(fresh.u[n]);
    // 兜底：/p 失败时从剧集页 eps 里取该集签名地址
    if (!u) {
      var html = await getHtml(HOST + "/zh-CN/s/" + encodeURIComponent(slug) + "/");
      var eps = extractJsonByKey(html, "eps");
      if (Array.isArray(eps)) {
        for (var i = 0; i < eps.length; i++) {
          if (String(eps[i].n) === String(n) && eps[i].u) { u = String(eps[i].u); break; }
        }
      }
    }
    if (!u) return [];
    return [{ name: label, url: absUrl(u.replace(/\\u0026/g, "&")), playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/zh-CN/" } }];
  }
  // 直链 m3u8
  if (/\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/zh-CN/" } }];
  }
  // 兜底：剧集页地址 -> 取详情首集
  try {
    var det = await loadDetail(raw);
    var eps2 = det && det.episodeItems;
    if (eps2 && eps2.length) {
      return await loadResource({ link: eps2[0].id });
    }
  } catch (e) { /* fall through */ }
  return [];
}
