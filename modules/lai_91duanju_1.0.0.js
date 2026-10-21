// 91成人短剧 for REX (lai_91duanju v1.1.0)
// 移植自 mira-cat 蜘蛛 91duanju.js（只读蓝图，逻辑等价移植）。
// 后端：91crdj.com（HTML 页面解析；现行镜像 91crdjai.com）。
// v1.1.0（真机反馈修复）：
//   ① 页面请求改「镜像直连优先、入口域名兜底」：原版每次请求先撞 91crdj.com 的 301
//      再跳镜像，真机上加载不出更多内容（VM harness 里翻页逻辑本身无误、逐分类实测出卡）。
//      现在直连当前镜像 91crdjai.com，失败自动回退入口域名，镜像再轮换也能自愈。
//   ② 播放加「代理线」：清单域 yd-hls.hzjvlo.cn 与分片域 tp*.drleao.cn 的 TLS 配置
//      经 SSL Labs 实测为 A 级（含国内解析到的全部边缘 IP、TLS 1.2/1.3、证书链完整），
//      真机却报 TLS 安全连接失败——属设备侧链路对这两个小众域名的干扰（与同日
//      rou.video 被拦同类）。解法照 rou 先例：手机侧用 Widget.http 取清单正文，
//      把分片/密钥地址改写为 dj-hls Worker 的 /s 中转（CF 出口实测可达 tp* 分片/密钥；
//      清单域封 CF 出口、公共中转也拉不动，所以清单必须手机侧取），清单经 Worker /up
//      暂存后播放器从 workers.dev 取（TLS 干净）。Worker 未部署、运行时无 POST 或
//      取清单失败时，自动只回直连线（与 v1.0.0 行为一致，无回归）。
// 封面为 AES-128-CBC 加密存储，走用户已部署的 bagua-img-proxy Worker 解密出图。
// 短剧为多集结构：loadDetail 返回分集（episodeItems/childItems），
// 播放由 stream 模块 loadResource 实时抓集页面解析 m3u8（蜘蛛 play 逻辑）。

WidgetMetadata = {
  id: "lai_91duanju",
  title: "91成人短剧",
  description: "91成人短剧（91crdj.com）：成人短剧/漫剧/真人剧/视频/漫画/小说，多集短剧实时解析播放",
  author: "lai",
  version: "1.1.0",
  requiredVersion: "0.0.1",
  site: "https://91crdj.com",
  detailCacheDuration: 180,
  modules: [
    { title: "成人短剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "duanju" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "成人漫剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "manju" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "真人剧", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "zhenrenju" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "成人视频", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "shipin" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "成人漫画", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "manhua" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "成人小说", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "xiaoshuo" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "热播榜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "paihang" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "标签榜", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "biaoqian" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "NTR", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "biaoqian/ntr" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "反差", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "biaoqian/fancha" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "擦边", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "biaoqian/cabian" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { id: "loadResource", title: "播放资源", description: "播放时实时解析播放地址", functionName: "loadResource", type: "stream", cacheDuration: 0, params: [] }
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

// 页面主机：镜像优先（免 301 一跳），入口兜底（镜像轮换时自愈）。
// fetchText 成功后把 BASE 记成实际可用的那个，后续站内链接统一拼 BASE。
var HOSTS = ["https://91crdjai.com", "https://91crdj.com"];
var BASE = HOSTS[0];
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
// 封面解密 Worker（用户已部署，与蜘蛛同一地址）
var IMG_PROXY = "https://bagua-img-proxy.li768435813.workers.dev";
// 播放代理 Worker（用户部署 dj-hls 后生效；未部署时模块探活失败、自动只回直连线）
var DJ_WORKER = "https://dj-hls.li768435813.workers.dev";
var djProbe = -1; // -1 未探，0 不可用，1 可用（会话内缓存，避免每次播放都探）

function t(v) { return String(v == null ? "" : v).trim(); }

function proxyCover(url) {
  var u = t(url);
  if (!u || u.indexOf("http") !== 0) return u;
  return IMG_PROXY + "/img?url=" + encodeURIComponent(u);
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": referer || BASE + "/"
  };
}

function stripHost(u) {
  var s = String(u || "");
  for (var i = 0; i < HOSTS.length; i++) {
    if (s.indexOf(HOSTS[i]) === 0) return s.slice(HOSTS[i].length);
  }
  return s;
}

// 站内地址统一拼到 BASE；外站绝对地址原样返回
function absOnBase(pathOrUrl) {
  var s = String(pathOrUrl || "");
  if (s.indexOf("//") === 0) return "https:" + s;
  if (s.indexOf("http") === 0) {
    var rest = stripHost(s);
    if (rest !== s) return BASE + rest; // 是站内某个主机名 → 改写到 BASE
    return s;
  }
  return BASE + (s.charAt(0) === "/" ? s : "/" + s);
}

// 带主机兜底的页面抓取：先试 BASE，失败依次试其它主机；谁成功就把 BASE 切到谁。
// 入口域名返回的是 301 跳镜像，Widget.http 跟随跳转后 res 里是镜像正文，同样算成功。
async function fetchText(url, referer) {
  var path = stripHost(String(url || ""));
  if (path.indexOf("http") === 0) {
    // 外站绝对地址（不该出现）：直拉一次
    var r0 = await Widget.http.get(path, { headers: pageHeaders(referer) });
    var b0 = r0 && r0.data != null ? String(r0.data) : "";
    if (!b0) throw new Error("空回应");
    return b0;
  }
  var order = [BASE].concat(HOSTS.filter(function (h) { return h !== BASE; }));
  var lastErr = null;
  for (var i = 0; i < order.length; i++) {
    var host = order[i];
    try {
      var res = await Widget.http.get(host + path, { headers: pageHeaders(referer ? absOnBase(referer) : host + "/") });
      var body = res && res.data != null ? String(res.data) : "";
      if (!body) throw new Error("空回应");
      BASE = host;
      return body;
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error("请求失败");
}

function isVideoFormat(url) {
  var low = String(url || "").toLowerCase();
  return [".m3u8", ".mp4", ".flv", ".ts"].some(function (k) { return low.indexOf(k) >= 0; });
}

// 与蜘蛛 parseList 相同的卡片解析（class 含 card 的 <a>），链接拼当前 BASE
function parseCards(html) {
  var items = [];
  if (!html) return items;
  var seen = {};
  var cardRe = /<a[^>]*\bclass\s*=\s*["'][^"']*\bcard\b[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = cardRe.exec(html))) {
    var tag = m[0];
    var block = m[1];
    var hm = tag.match(/href\s*=\s*["']([^"']+)["']/i);
    if (!hm) continue;
    var href = t(hm[1]);
    var p = href;
    try { p = new URL(href, BASE).pathname; } catch (e) {}
    var seg = p.split("/").filter(Boolean);
    if (seg.length < 2) continue;
    var vid = seg[1];
    if (seen[vid]) continue;

    var title = "";
    var attrs = ["data-track-item-name", "alt", "title"];
    for (var ai = 0; ai < attrs.length; ai++) {
      var tm = (tag + block).match(new RegExp(attrs[ai] + '\\s*=\\s*["\']([^"\']*)["\']', "i"));
      if (tm && t(tm[1])) { title = t(tm[1]); break; }
    }
    if (!title) {
      var tm2 = block.match(/<span[^>]*class="[^"]*p-title[^"]*"[^>]*>([\s\S]*?)<\/span>/);
      if (tm2) title = t(tm2[1].replace(/<[^>]+>/g, ""));
    }
    if (!title) title = vid;

    var cover = "";
    var lattrs = ["data-original", "data-src", "data-echo", "data-url"];
    for (var li = 0; li < lattrs.length; li++) {
      var im = block.match(new RegExp(lattrs[li] + '\\s*=\\s*["\']([^"\']+)["\']', "i"));
      if (im) { cover = t(im[1]); break; }
    }
    if (!cover) {
      var im2 = block.match(/<img[^>]*?(?<![\w-])src\s*=\s*["']([^"']+)["']/i);
      if (im2) cover = t(im2[1]);
    }
    var low = cover.toLowerCase();
    if (["data:", "load.gif", "loading.gif", "placeholder"].some(function (b) { return low.indexOf(b) >= 0; })) cover = "";
    if (cover.indexOf("//") === 0) cover = "https:" + cover;
    else if (cover.charAt(0) === "/") cover = BASE + cover;

    var remarks = "";
    var rm = block.match(/<span[^>]*class="[^"]*(?:badge|eps-flag)[^"]*"[^>]*>([\s\S]*?)<\/span>/);
    if (rm) remarks = t(rm[1].replace(/<[^>]+>/g, ""));

    seen[vid] = 1;
    var link = BASE + p;
    var pic = proxyCover(cover);
    items.push({
      id: link,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: remarks || "",
      mediaType: "movie"
    });
  }
  return items;
}

async function loadList(params) {
  params = params || {};
  var cat = String(params.cat || params.path || "duanju").replace(/^\/+/, "").replace(/\/+$/, "");
  var page = parseInt(params.page, 10) || 1;
  var path = page > 1 ? "/" + cat + "/page/" + page + "/" : "/" + cat + "/";
  try {
    var html = await fetchText(path, BASE + "/");
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + BASE + path }];
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
  var path = "/search/?q=" + encodeURIComponent(wd);
  if (page > 1) path += "&page=" + page;
  try {
    var html = await fetchText(path, BASE + "/");
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

// 与蜘蛛 detail 相同的分集提取：返回 [{name, url}]
function extractEpisodes(html, pagePath) {
  var playUrls = [];
  var seen = {};
  var basePath = String(pagePath || "").replace(/\/$/, "");
  var epRe = /href=["']([^"']+)["'][^>]*>\s*(\d+)\s*</g;
  var em;
  while ((em = epRe.exec(html))) {
    var href = t(em[1]);
    var epNo = t(em[2]);
    if (basePath && href.indexOf(basePath) >= 0) {
      if (href.charAt(0) === "/") href = BASE + href;
      if (seen[href]) continue;
      seen[href] = 1;
      playUrls.push({ name: "第" + epNo + "集", url: href });
    }
  }
  if (!playUrls.length) {
    var pmRe = /href=["']([^"']*(?:\/play\/|-\d+-\d+\.html)[^"']*)["']/g;
    while ((em = pmRe.exec(html))) {
      var h2 = t(em[1]);
      if (h2.charAt(0) === "/") h2 = BASE + h2;
      else if (h2.indexOf("http") !== 0) continue;
      if (seen[h2]) continue;
      seen[h2] = 1;
      playUrls.push({ name: "播放", url: h2 });
    }
    if (playUrls.length > 1) {
      playUrls.forEach(function (ep, i) { ep.name = "第" + (i + 1) + "集"; });
    } else if (playUrls.length === 1) {
      playUrls[0].name = "正片";
    }
  }
  return playUrls;
}

async function loadDetail(link) {
  var url = absOnBase(String(link || ""));
  if (!url) {
    return { id: String(link || "err"), type: "url", title: "参数错误", description: "链接为空" };
  }
  var pagePath = url;
  try { pagePath = new URL(url).pathname; } catch (e) {}
  try {
    var html = await fetchText(url, BASE + "/");
    // fetchText 可能刚切换过 BASE，详情自身地址同步到 BASE 口径
    url = absOnBase(url);
    try { pagePath = new URL(url).pathname; } catch (e) {}

    var title = "";
    var tm = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (tm) title = t(tm[1].replace(/<[^>]+>/g, ""));
    if (!title) {
      tm = html.match(/<title>([\s\S]*?)<\/title>/);
      if (tm) title = t(tm[1].split(/[-_|]/)[0]);
    }

    var pic = "";
    var lattrs = ["data-original", "data-src", "data-echo", "data-url"];
    for (var li = 0; li < lattrs.length; li++) {
      var pm = html.match(new RegExp(lattrs[li] + '\\s*=\\s*["\']([^"\']+\\.(?:jpg|jpeg|png|webp)[^"\']*)["\']', "i"));
      if (pm) { pic = t(pm[1]); break; }
    }
    if (!pic) {
      var pm2 = html.match(/<meta[^>]+og:image[^>]+content=["']([^"']+)["']/i);
      if (pm2) pic = t(pm2[1]);
    }
    if (pic.indexOf("//") === 0) pic = "https:" + pic;
    else if (pic.charAt(0) === "/") pic = BASE + pic;

    var intro = "";
    var pats = [
      /<meta[^>]+og:description[^>]+content=["']([^"']*)["']/i,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
    ];
    for (var pi = 0; pi < pats.length; pi++) {
      var im = html.match(pats[pi]);
      if (im && t(im[1])) { intro = t(im[1]); break; }
    }

    var eps = extractEpisodes(html, pagePath);
    var cover = proxyCover(pic);
    var desc = intro || "";
    if (eps.length) desc = ("共" + eps.length + "集" + (desc ? "\n" + desc : ""));

    var result = {
      id: url,
      type: "url",
      title: title || "91成人短剧",
      name: title || "91成人短剧",
      description: desc,
      mediaType: "movie",
      link: url,
      coverUrl: cover,
      posterPath: cover,
      backdropPath: cover,
      playerType: "app"
    };
    if (eps.length > 1) {
      var childItems = eps.map(function (ep, i) {
        return {
          id: ep.url,
          title: title + " " + ep.name,
          name: ep.name,
          mediaType: "movie",
          seasonNumber: 1,
          episodeNumber: i + 1,
          link: ep.url
        };
      });
      result.episodeItems = childItems;
      result.childItems = childItems;
      result.episodes = eps.map(function (ep) { return { name: ep.name, link: ep.url }; });
    }
    return result;
  } catch (e) {
    return { id: url, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// 与蜘蛛 play 相同的单页取流：current.src / player_aaaa / player_data / 裸 m3u8|mp4
function extractStreamFromPage(html) {
  if (!html) return "";
  var m3u8Url = "";
  var m = html.match(/"current"\s*:\s*\{[^{}]*"src"\s*:\s*"([^"]+)"/);
  if (m) m3u8Url = m[1].replace(/\\\//g, "/").replace(/\\u0026/g, "&");
  if (!m3u8Url) {
    var vars = ["player_aaaa", "player_data"];
    for (var vi = 0; vi < vars.length; vi++) {
      var vm = html.match(new RegExp(vars[vi] + "\\s*=\\s*(\\{[^;]*\\})"));
      if (vm) {
        try {
          var data = JSON.parse(vm[1]);
          m3u8Url = data.url || data.link || "";
          if (m3u8Url) break;
        } catch (e) {}
      }
    }
  }
  if (!m3u8Url) {
    var um = html.match(/(https?:\/\/[^\s"'<>\\]+?\.(?:m3u8|mp4)[^\s"'<>\\]*)/);
    if (um) m3u8Url = um[1];
  }
  if (m3u8Url) {
    if (m3u8Url.indexOf("//") === 0) m3u8Url = "https:" + m3u8Url;
    else if (m3u8Url.charAt(0) === "/") m3u8Url = BASE + m3u8Url;
  }
  return m3u8Url;
}

async function resolvePlayFromPage(pageUrl) {
  var html = await fetchText(pageUrl, BASE + "/");
  var direct = extractStreamFromPage(html);
  if (direct) return direct;
  // 详情页本身没播放器时，跟进第一条分集链接（单集作品）
  var pagePath = pageUrl;
  try { pagePath = new URL(pageUrl).pathname; } catch (e) {}
  var eps = extractEpisodes(html, pagePath);
  if (eps.length) {
    var html2 = await fetchText(eps[0].url, pageUrl);
    return extractStreamFromPage(html2);
  }
  return "";
}

// ---------- 播放代理线（dj-hls Worker） ----------

// 探活：根路径应回 "dj-hls ok"。探一次缓存结果，避免每次播放都探。
async function probeDjWorker() {
  if (djProbe >= 0) return djProbe === 1;
  djProbe = 0;
  try {
    var res = await Widget.http.get(DJ_WORKER + "/", { headers: { "User-Agent": UA } });
    var body = res && res.data != null ? String(res.data) : "";
    if (body.indexOf("dj-hls ok") === 0) djProbe = 1;
  } catch (e) {}
  return djProbe === 1;
}

// 把清单里的分片/密钥绝对地址改写为 Worker /s 中转；相对地址先按清单地址拼全
function rewritePlaylist(text, playlistUrl) {
  var lines = String(text || "").split("\n");
  var out = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var tr = line.trim();
    if (!tr) { out.push(line); continue; }
    if (tr.charAt(0) === "#") {
      out.push(line.replace(/URI="([^"]+)"/g, function (mm, u) {
        var abs = u;
        try { abs = new URL(u, playlistUrl).href; } catch (e) {}
        return 'URI="' + DJ_WORKER + "/s?u=" + encodeURIComponent(abs) + '"';
      }));
      continue;
    }
    var abs2 = tr;
    try { abs2 = new URL(tr, playlistUrl).href; } catch (e) {}
    out.push(DJ_WORKER + "/s?u=" + encodeURIComponent(abs2));
  }
  return out.join("\n");
}

// 构建代理线：手机侧取清单 → 改写 → POST /up 暂存 → 回播放器用的 /p 地址。任一步失败回 ""。
async function buildRelayLine(playlistUrl, referer) {
  try {
    if (!Widget.http.post) return "";
    if (!(await probeDjWorker())) return "";
    var res = await Widget.http.get(playlistUrl, { headers: { "User-Agent": UA, "Referer": referer || BASE + "/" } });
    var body = res && res.data != null ? String(res.data) : "";
    if (body.indexOf("#EXTM3U") !== 0) return "";
    var rewritten = rewritePlaylist(body, playlistUrl);
    var up = await Widget.http.post(DJ_WORKER + "/up", rewritten, { headers: { "Content-Type": "text/plain; charset=utf-8", "User-Agent": UA } });
    var upBody = up && up.data != null ? String(up.data) : "";
    var parsed = null;
    try { parsed = JSON.parse(upBody); } catch (e) {}
    var relay = parsed && parsed.url ? String(parsed.url) : "";
    if (relay.indexOf(DJ_WORKER + "/p/") !== 0) return "";
    return relay;
  } catch (e) {
    return "";
  }
}

async function loadResource(params) {
  params = params || {};
  var raw = String(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = String(params.item.link || params.item.id || "");
  if (!raw) return [];
  try {
    if (isVideoFormat(raw)) {
      return [{ name: "播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": BASE + "/" } }];
    }
    var url = await resolvePlayFromPage(raw);
    if (!url) return [];
    var lines = [];
    // 代理线排前（真机 TLS 报错的正解）；构建失败自动跳过，只回直连线
    var relay = await buildRelayLine(url, raw);
    if (relay) {
      lines.push({ name: "代理", url: relay, playerType: "app", customHeaders: { "User-Agent": UA } });
    }
    lines.push({ name: relay ? "直连" : "播放", url: url, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": raw } });
    return lines;
  } catch (e) {
    return [];
  }
}
