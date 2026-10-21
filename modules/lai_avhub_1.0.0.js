// AvHub for REX (lai_avhub v1.0.0)
// 移植自 mira-cat 蜘蛛 avhub.js (定版方案), 后端: https://avhub360.com (服务端渲染, 无反爬)。
// 列表: /new、/popular 与 /tags/{id}、/theme/detail/{id} 的分页规则与蜘蛛一致;
//   卡片为 <a href="/videos/{code}" data-mv-id> + 懒加载封面 (data-src 优先)。
// 封面: image.cpckgr.cn 上的图是 AES 加密图, 走用户自建 bagua-img-proxy Worker
//   解密出图。原方案先换镜像域名 pic.jtzatly.cn 再走代理, 但该镜像域已整体
//   不可达 (2026-10-21 复核: 直连 000、经代理 502); image.cpckgr.cn 本身已在
//   Worker 白名单内, 改为原域地址直走代理出图 (实测 200 image/jpeg 真图)。
// 详情: 标题 og:title; 真封面取页面 JSON 的 videoCover (og:image 是统一占位图)。
// 播放: REX 没有蜘蛛的本地 /proxy/m3u8, 改为在 loadDetail 内当场解析
//   GET /media/{code}: 最多重抽 5 次 (蜘蛛定版逻辑) ——
//   200 直出真 m3u8 (fangzhou 型好抽) 或 302 到可拉取的 jw-hls 直链即采用;
//   抽到死网关 (302 目标拉不到) 就换一次 /media 重抽; 全灭降级到最后的
//   跳转目标或 /media 本身。与蜘蛛的差异: jw-hls 直链的 Content-Type 是
//   text/plain, 蜘蛛靠本地代理改写, REX 内无此层, 直返原地址待真机验证。

WidgetMetadata = {
  id: "lai_avhub",
  title: "AvHub",
  description: "AvHub（avhub360.com）：最新/热门/主题与标签分类，封面走 bagua-img-proxy 出图，播放当场解析 /media",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://avhub360.com",
  detailCacheDuration: 180,
  modules: [
    { title: "最新发布", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "new" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "今日热门", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "today" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "热门", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "popular" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中文字幕", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "theme:3" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "高清无码", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "theme:11" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "AI短剧", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "theme:58" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "少女", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:171" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中出", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:182" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:170" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "颜射", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:172" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "人妻", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:231" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "短发", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:167" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "丝袜", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:146" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "口爆", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:179" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "出轨", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:212" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "3P", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:201" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "乳交", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:181" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "美腿", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:164" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "熟女", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:169" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "痴女", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:189" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "校服", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:151" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "潮吹", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:176" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "调教", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:185" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "口交", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:180" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "多P", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:197" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "凌辱", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:199" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "接吻", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:178" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "NTR", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:217" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "渔网", functionName: "loadList", cacheDuration: 120, params: [ { name: "path", title: "分类", type: "constant", value: "tag:149" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
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

var SITE = "https://avhub360.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
var REFERER = SITE + "/";
var IMG_PROXY = "https://bagua-img-proxy.li768435813.workers.dev/img?url=";

// 分类: first = 第1页路径; tpl = 第2页起路径模板 ({p} 为页码)。与蜘蛛 CATS 一致 (29 个)。
var CATS = [
  { type_id: "new", type_name: "最新发布", first: "/new", tpl: "/new/{p}" },
  { type_id: "today", type_name: "今日热门", first: "/popular/today", tpl: "/popular/today/{p}" },
  { type_id: "popular", type_name: "热门", first: "/popular", tpl: "/popular/week/{p}" },
  { type_id: "theme:3", type_name: "中文字幕", first: "/theme/detail/3", tpl: "/theme/detail/3/update/{p}" },
  { type_id: "theme:11", type_name: "高清无码", first: "/theme/detail/11/hot", tpl: "/theme/detail/11/hot/{p}" },
  { type_id: "theme:58", type_name: "AI短剧", first: "/theme/detail/58", tpl: "/theme/detail/58/update/{p}" },
  { type_id: "tag:171", type_name: "少女", first: "/tags/171", tpl: "/tags/171/latest/{p}" },
  { type_id: "tag:182", type_name: "中出", first: "/tags/182", tpl: "/tags/182/latest/{p}" },
  { type_id: "tag:170", type_name: "巨乳", first: "/tags/170", tpl: "/tags/170/latest/{p}" },
  { type_id: "tag:172", type_name: "颜射", first: "/tags/172", tpl: "/tags/172/latest/{p}" },
  { type_id: "tag:231", type_name: "人妻", first: "/tags/231", tpl: "/tags/231/latest/{p}" },
  { type_id: "tag:167", type_name: "短发", first: "/tags/167", tpl: "/tags/167/latest/{p}" },
  { type_id: "tag:146", type_name: "丝袜", first: "/tags/146", tpl: "/tags/146/latest/{p}" },
  { type_id: "tag:179", type_name: "口爆", first: "/tags/179", tpl: "/tags/179/latest/{p}" },
  { type_id: "tag:212", type_name: "出轨", first: "/tags/212", tpl: "/tags/212/latest/{p}" },
  { type_id: "tag:201", type_name: "3P", first: "/tags/201", tpl: "/tags/201/latest/{p}" },
  { type_id: "tag:181", type_name: "乳交", first: "/tags/181", tpl: "/tags/181/latest/{p}" },
  { type_id: "tag:164", type_name: "美腿", first: "/tags/164", tpl: "/tags/164/latest/{p}" },
  { type_id: "tag:169", type_name: "熟女", first: "/tags/169", tpl: "/tags/169/latest/{p}" },
  { type_id: "tag:189", type_name: "痴女", first: "/tags/189", tpl: "/tags/189/latest/{p}" },
  { type_id: "tag:151", type_name: "校服", first: "/tags/151", tpl: "/tags/151/latest/{p}" },
  { type_id: "tag:176", type_name: "潮吹", first: "/tags/176", tpl: "/tags/176/latest/{p}" },
  { type_id: "tag:185", type_name: "调教", first: "/tags/185", tpl: "/tags/185/latest/{p}" },
  { type_id: "tag:180", type_name: "口交", first: "/tags/180", tpl: "/tags/180/latest/{p}" },
  { type_id: "tag:197", type_name: "多P", first: "/tags/197", tpl: "/tags/197/latest/{p}" },
  { type_id: "tag:199", type_name: "凌辱", first: "/tags/199", tpl: "/tags/199/latest/{p}" },
  { type_id: "tag:178", type_name: "接吻", first: "/tags/178", tpl: "/tags/178/latest/{p}" },
  { type_id: "tag:217", type_name: "NTR", first: "/tags/217", tpl: "/tags/217/latest/{p}" },
  { type_id: "tag:149", type_name: "渔网", first: "/tags/149", tpl: "/tags/149/latest/{p}" }
];

function t(v) { return String(v == null ? "" : v).trim(); }

function clean(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
}

function fixUrl(u) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return SITE + u;
  return u;
}

function absUrl2(u, base) {
  try { return new URL(u, base).toString(); } catch (e) { return u; }
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.7",
    "Referer": referer || REFERER
  };
}

// 取页面 HTML (失败自动重试一次)
async function getHtml(url) {
  for (var i = 0; i < 2; i++) {
    try {
      var res = await Widget.http.get(url, { headers: pageHeaders(), timeout: 25000 });
      var status = res && res.status != null ? res.status : 200;
      var data = res && res.data != null ? (typeof res.data === "string" ? res.data : "") : "";
      if (status === 200 && data.length > 1000) return data;
      if (status === 200 && data) return data;
    } catch (e) {}
  }
  return "";
}

// 原始响应 (给 /media 解析用): 尽量拿 status / body / Location / 最终 URL
async function httpRaw(url, headers) {
  try {
    var res = await Widget.http.get(url, { headers: headers, timeout: 20000 });
    if (!res) return { status: 0, body: "", location: "", finalUrl: "" };
    var body = res.data != null ? (typeof res.data === "string" ? res.data : String(res.data)) : "";
    var hdrs = res.headers || {};
    var loc = hdrs.location || hdrs.Location || "";
    var finalUrl = res.url || res.finalUrl || res.responseURL || "";
    return {
      status: res.status != null ? res.status : (body ? 200 : 0),
      body: body,
      location: loc,
      finalUrl: finalUrl
    };
  } catch (e) {
    return { status: 0, body: "", location: "", finalUrl: "" };
  }
}

// 封面出图: cpckgr 加密图原域直走 bagua-img-proxy 解密 (旧方案的镜像域名
// pic.jtzatly.cn 已不可达, 不再换域名; 原域已在 Worker 白名单内)
function picProxy(pic) {
  pic = t(pic);
  if (!pic) return pic;
  if (/workers\.dev/i.test(pic)) return pic;
  if (!/cpckgr\.cn/i.test(pic)) return pic;
  return IMG_PROXY + encodeURIComponent(pic);
}

// ---------- 列表解析 (蜘蛛同构: 正则卡片) ----------
function parseCards(html) {
  var out = [];
  var seen = {};
  var re = /<a\s[^>]*href="(\/videos\/[A-Za-z0-9\-_]+)"[^>]*data-mv-id[^>]*>/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var code = m[1].replace("/videos/", "");
    if (seen[code]) continue;
    seen[code] = 1;
    var win = html.slice(m.index, m.index + 2500);
    var imgM = win.match(/<img[^>]+>/);
    var pic = "";
    var title = "";
    if (imgM) {
      var tag = imgM[0];
      var ds = tag.match(/data-src="([^"]+)"/);
      var zl = tag.match(/z-image-loader-url="([^"]+)"/);
      var sc = tag.match(/\ssrc="([^"]+)"/);
      pic = (ds && ds[1]) || (zl && zl[1]) || (sc && sc[1]) || "";
      var altM = tag.match(/alt="([^"]*)"/);
      if (altM) title = clean(altM[1]).replace(/\s*\?>+\s*$/, "").trim();
    }
    if (!title) title = code.toUpperCase();
    var link = SITE + "/videos/" + code;
    var cover = picProxy(fixUrl(pic));
    out.push({
      id: link,
      type: "url",
      title: title,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: link,
      description: code.toUpperCase(),
      mediaType: "movie"
    });
  }
  return out;
}

function catOf(tid) {
  for (var i = 0; i < CATS.length; i++) { if (CATS[i].type_id === tid) return CATS[i]; }
  return CATS[0];
}

function catUrl(cat, page) {
  if (page > 1 && cat.tpl) return SITE + cat.tpl.replace("{p}", String(page));
  return SITE + cat.first;
}

function codeFromId(id) {
  id = t(id);
  if (!id) return "";
  if (id.indexOf("$") >= 0) id = id.split("$").pop().trim();
  var m = id.match(/\/videos\/([A-Za-z0-9\-_]+)/);
  if (m) return m[1];
  var m2 = id.match(/\/media\/([A-Za-z0-9\-_]+)/);
  if (m2) return m2[1];
  return id.replace(/^\/+|\/+$/g, "");
}

// ---------- /media 解析 (蜘蛛的 5 次重抽逻辑, 搬到 loadDetail 内当场执行) ----------
async function resolveMedia(code) {
  var mediaUrl = SITE + "/media/" + code;
  var headers = { "User-Agent": UA, "Accept": "*/*", "Referer": SITE + "/videos/" + code };
  var lastLoc = "";
  for (var i = 0; i < 5; i++) {
    var res = await httpRaw(mediaUrl, headers);
    if (res.location) {
      var loc = absUrl2(res.location.replace(/&amp;/g, "&"), mediaUrl);
      lastLoc = loc;
      var target = await httpRaw(loc, headers);
      if (target.body && target.body.indexOf("#EXTM3U") >= 0) return loc;
      continue; // 死网关等: 换一次 /media 重抽
    }
    if (res.body && res.body.indexOf("#EXTM3U") >= 0) {
      // 200 直出真 m3u8 (fangzhou 好抽), 或运行时已跟随 302 到真列表
      if (res.finalUrl && res.finalUrl !== mediaUrl) return res.finalUrl;
      return mediaUrl;
    }
    // status 异常/无跳转: 也重抽 (每次 /media 都是新 auth_key/新后端节点)
  }
  return lastLoc || mediaUrl;
}

// ---------- 接口 ----------
async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var tid = t(params.path || params.cat || "new");
  var cat = catOf(tid);
  try {
    var html = await getHtml(catUrl(cat, page));
    if (!html) return [{ id: "err", type: "url", title: "载入失败: 列表页取不到", description: catUrl(cat, page) }];
    var cards = parseCards(html);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

async function loadDetail(link) {
  var code = codeFromId(link);
  if (!code) return { id: t(link) || "err", type: "url", title: "参数错误", description: "未找到播放地址" };
  var durl = SITE + "/videos/" + code;
  try {
    var html = await getHtml(durl);
    var name = "";
    var pic = "";
    if (html) {
      var ogt = html.match(/<meta property="og:title" content="([^"]+)"/);
      if (ogt) name = clean(ogt[1]).replace(/\s*-\s*番号AV.*$/, "").replace(/\s*-\s*AVHub\s*$/, "").trim();
      if (!name) {
        var tm = html.match(/<title>([^<]*)<\/title>/);
        if (tm) name = clean(tm[1]).replace(/\s*-\s*番号AV.*$/, "").trim();
      }
      var vc = html.match(/"videoCover":"((?:\\.|[^"\\])*)"/);
      if (vc) pic = vc[1].replace(/\\\//g, "/").replace(/\\"/g, '"');
      if (!pic) {
        var ogi = html.match(/<meta property="og:image" content="([^"]+)"/);
        if (ogi) pic = ogi[1];
      }
    }
    if (!name) name = code.toUpperCase();
    var cover = picProxy(fixUrl(pic));
    var videoUrl = await resolveMedia(code);
    if (!videoUrl) {
      return {
        id: durl, type: "url", title: name,
        posterPath: cover, coverUrl: cover, backdropPath: cover,
        link: durl, description: "未找到播放地址"
      };
    }
    return {
      id: durl,
      type: "detail",
      title: name,
      link: durl,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: { "User-Agent": UA, "Referer": REFERER }
    };
  } catch (e) {
    return { id: durl, type: "url", title: "请求错误", description: String((e && e.message) || e) };
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
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var url = SITE + "/search/" + encodeURIComponent(wd);
  if (page > 1) url += "/" + page;
  try {
    var html = await getHtml(url);
    if (!html) return [{ id: "empty", type: "url", title: "没有找到相关影片" }];
    var cards = parseCards(html);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}
