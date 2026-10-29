// 51吃瓜 for REX (lai_chigua51 v1.0.1)
// 移植自 mira-cat 蜘蛛 chigua51.js（只读蓝图，逻辑等价移植）。
// v1.0.1 修 (2026-10-25, 与猫源耐久修法一致): ①单域 qkvsednb 301 到
// okzdnjeu 且卡片已无 /archives/ 链接, 旧版只认 /archives/ id 故全空
// —— 解析改为 post-card-id 优先、/archives/ 兜底; ②多镜像逐个试到
// 出卡为止 (直连镜像在前、301 旧域在后), 单域轮换不再整站空。
// 封面为加密图片：pic.*.cn 图床走用户已部署的 51chigua Worker 解密出图，其余直出。
// 帖子详情页内嵌视频直链（m3u8/mp4），loadDetail 实时提取，HLS 优先。

WidgetMetadata = {
  id: "lai_chigua51",
  title: "51吃瓜",
  description: "51吃瓜（多镜像）：今日吃瓜/热门大瓜/51剧场/AI成人短剧/国产视频等 27 个分类",
  author: "lai",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  site: "https://bus.egyjtzsa.cc",
  detailCacheDuration: 180,
  modules: [
    { title: "今日吃瓜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "wpcz" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "热门大瓜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "rdsj" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "必看大瓜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "bkdg" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "吃瓜榜单", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "mrdg" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "51剧场", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "51djc" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "往期活动", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "51hd" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "AI成人短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "cbdj" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "成人视频", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "ysyl" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "国产视频", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "gcjq" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "探花精选", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "thjx" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "网黄合集", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "whhj" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "网红黑料", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "whhl" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "明星爆料", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "whmx" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "学生校园", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "xsxy" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "海外吃瓜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "hwcg" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "人人吃瓜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "rrcg" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "领导干部", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "ldcg" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "伦理道德", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "lldd" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "骚男骚女", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "snsn" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "软萌甜妹", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "jpll" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "竞技吃瓜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "sjb" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "吃瓜看戏", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "qubk" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "擦边撩骚", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "dcbq" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "性爱技巧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "zzs" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "每日大赛", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "mrds" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "原创博主", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "yczq" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "吃瓜新闻", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "cgxw" }, { name: "page", title: "页码", type: "page", value: "1" }] }
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

// 多镜像 (与猫源 2026-10-25 耐久修法一致): 直连镜像在前、301 旧域在后。
var HOSTS = ["https://bus.egyjtzsa.cc", "https://51cg1.com", "https://bus.okzdnjeu.cc", "https://bus.yueshrxet.cc", "https://bus.qkvsednb.cc"];
var HOST = HOSTS[0];
var CUR_HOST = HOSTS[0];
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
// 封面解密 Worker（用户已部署，与蜘蛛同一地址）
var IMG_PROXY = "https://51chigua.li768435813.workers.dev/img?url=";

function t(v) { return String(v == null ? "" : v).trim(); }

function proxyImgUrl(imgUrl) {
  if (!imgUrl) return "";
  if (/workers\.dev/i.test(imgUrl)) return imgUrl;
  if (/pic\.[a-z0-9]+\.cn/i.test(imgUrl)) {
    return IMG_PROXY + encodeURIComponent(imgUrl);
  }
  return imgUrl;
}

function pageHeaders(url) {
  // Referer 跟当前取页域名走 (多镜像下 HOST 不再唯一)。
  var o = CUR_HOST;
  var m = String(url || "").match(/^(https?:\/\/[^/]+)/);
  if (m) o = m[1];
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": o + "/"
  };
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders(url) });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

// 多镜像逐个试: 列表/搜索要求出 post-card 块才算中, 详情只要非空。
// 成功即记下 CUR_HOST (后续相对链接与 Referer 都跟它走)。
async function fetchFirst(path, needCards) {
  var lastErr = null;
  for (var i = 0; i < HOSTS.length; i++) {
    var url = HOSTS[i] + path;
    try {
      var html = await fetchText(url);
      if (needCards && html.indexOf("post-card") < 0) continue;
      CUR_HOST = HOSTS[i];
      return html;
    } catch (e) {
      lastErr = e;
    }
  }
  if (lastErr) throw lastErr;
  throw new Error("全部镜像无内容");
}

function decodeHtml(s) {
  return t(s)
    .replace(/&#(\d+);/g, function (_, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/&#x([0-9a-fA-F]+);/g, function (_, n) { return String.fromCharCode(parseInt(n, 16)); })
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return CUR_HOST + u;
  return CUR_HOST + "/" + u;
}

function listPath(cat, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  cat = t(cat) || "wpcz";
  var base = "/category/" + cat + "/";
  return page > 1 ? base + page + "/" : base;
}

// 与蜘蛛 parseList 相同：post-card 结构，封面在 loadBannerDirect('URL',...)
// id 取法 (2026-10-25): 卡片 div 自带 id="post-card-<id>" 优先, 卡内
// /archives/ 链接兜底 —— 站方改版后卡内已无 /archives/ 链接, 只认
// 旧法会整页空 (v1.0.0 的病因)。
function parseCards(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var blocks = html.split('<div class="post-card"');
  for (var i = 1; i < blocks.length; i++) {
    var b = blocks[i];
    var im = b.match(/id="post-card-(\d+)"/);
    var am = b.match(/\/archives\/(\d+)\//);
    var vid = im ? im[1] : (am ? am[1] : "");
    if (!vid || seen[vid]) continue;

    var title = "";
    var tm = b.match(/class="post-card-title"[^>]*>([\s\S]*?)<\/h2>/);
    if (tm) title = decodeHtml(tm[1].replace(/<[^>]+>/g, ""));
    if (!title) continue;
    seen[vid] = 1;

    var pic = "";
    var zm = b.match(/z-bg-loader-url=["']([^"']+)["']/);
    if (zm) pic = zm[1];
    if (!pic) {
      var pm = b.match(/loadBannerDirect\('([^']+)'/);
      if (pm) pic = pm[1];
    }
    if (!pic) {
      var im = b.match(/<img[^>]+src="([^"]+)"/);
      if (im) pic = absUrl(im[1]);
    }

    var remarks = "";
    var dm = b.match(/datePublished"[^>]*content="([^"]+)"/) || b.match(/(\d{4}\s*年\s*\d{1,2}\s*月\s*\d{1,2}\s*日)/);
    if (dm) remarks = dm[1].slice(0, 10);

    var link = CUR_HOST + "/archives/" + vid + "/";
    var cover = proxyImgUrl(pic);
    out.push({
      id: link,
      type: "url",
      title: title.slice(0, 80),
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: link,
      description: remarks || "",
      releaseDate: remarks || "",
      mediaType: "movie"
    });
  }
  return out;
}

async function loadList(params) {
  params = params || {};
  var cat = String(params.cat || params.path || "wpcz").replace(/^\/category\//, "").replace(/\/$/, "");
  var page = parseInt(params.page, 10) || 1;
  var path = listPath(cat, page);
  try {
    var html = await fetchFirst(path, true);
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + CUR_HOST + path }];
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
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var path = "/search/" + encodeURIComponent(wd) + "/" + (page > 1 ? "page/" + page + "/" : "");
  try {
    var html = await fetchFirst(path, true);
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

// 与蜘蛛 extractPlay 相同：从详情页提取播放地址（m3u8 优先，其次 mp4）
function extractPlay(html) {
  var sources = [];
  var seen = {};
  function add(url, name) {
    url = t(url).replace(/\\\//g, "/");
    if (!url || seen[url]) return;
    if (!/^https?:\/\//i.test(url)) return;
    seen[url] = 1;
    sources.push({ name: name || "播放", url: url });
  }
  var m1 = html.match(/https?:(?:\\?\/\\?\/)[^"'\s<>]+\.m3u8[^"'\s<>]*/gi) || [];
  m1.forEach(function (u) { add(u, "HLS"); });
  var m2 = html.match(/https?:(?:\\?\/\\?\/)[^"'\s<>]+\.mp4[^"'\s<>]*/gi) || [];
  m2.forEach(function (u) { add(u, "MP4"); });
  var fields = html.match(/["'](?:url|play_url|playUrl|src|file|videoUrl)["']\s*:\s*["'](https?:(?:\\?\/\\?\/)[^"']+)["']/gi) || [];
  fields.forEach(function (f) {
    var um = f.match(/https?:(?:\\?\/\\?\/)[^"']+/);
    if (um) {
      var u = um[0];
      if (/\.m3u8/i.test(u)) add(u, "HLS");
      else if (/\.mp4/i.test(u)) add(u, "MP4");
    }
  });
  var tags = html.match(/<source[^>]+src="([^"]+)"/gi) || [];
  tags.forEach(function (s) {
    var um = s.match(/src="([^"]+)"/);
    if (um) add(absUrl(um[1]), "视频");
  });
  return sources;
}

async function loadDetail(link) {
  var raw = String(link || "");
  // vid 取法: /archives/<id> 优先 (链接即此形); 勿用首个数字——
  // 51cg1.com 这类带数字的域名会误取成 51。
  var vm = raw.match(/\/archives\/(\d+)/) || raw.match(/post-card-(\d+)/);
  var m = vm || raw.match(/(\d+)/);
  var vid = m ? m[1] : raw.replace(/^.*archives\//, "").replace(/\//g, "");
  if (!vid) return { id: raw, type: "url", title: "参数错误", description: "链接里没有帖子 ID" };
  var pageUrl = HOST + "/archives/" + vid + "/";
  try {
    var html = await fetchFirst("/archives/" + vid + "/", false);
    pageUrl = CUR_HOST + "/archives/" + vid + "/";

    var name = "";
    var hm = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (hm) name = decodeHtml(hm[1].replace(/<[^>]+>/g, ""));
    if (!name) {
      var tm = html.match(/<title>([^<]+)<\/title>/);
      if (tm) name = decodeHtml(tm[1]).split(/[-_|]/)[0];
    }

    var pic = "";
    var om = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i);
    if (om) pic = om[1];
    if (!pic) {
      var bm = html.match(/loadBannerDirect\('([^']+)'/);
      if (bm) pic = bm[1];
    }

    var content = "";
    var dm = html.match(/property=["']og:description["'][^>]*content=["']([^"']+)/i);
    if (dm) content = decodeHtml(dm[1]).slice(0, 600);

    var sources = extractPlay(html);
    var cover = proxyImgUrl(pic);
    if (!sources.length) {
      return {
        id: pageUrl,
        type: "url",
        title: name || ("51吃瓜 " + vid),
        link: pageUrl,
        posterPath: cover,
        coverUrl: cover,
        backdropPath: cover,
        description: content || "未找到播放地址（该帖可能为图文帖）"
      };
    }
    // HLS 优先（extractPlay 已按 m3u8 → mp4 顺序收集），只放最优一条
    var best = sources[0];
    return {
      id: pageUrl,
      type: "detail",
      title: name || ("51吃瓜 " + vid),
      link: pageUrl,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      description: content,
      videoUrl: best.url,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": CUR_HOST + "/"
      }
    };
  } catch (e) {
    return { id: pageUrl, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
