// Beeg for REX (lai_beeg v1.0.2)
// v1.0.3（AVDB 样式详情）：API 标签建成 genreItems（/tag/ 点按走 loadList 路由）；facts 接口无演员字段，peoples 留空。
// v1.0.1（2026-11-14）：变体签名 key 每把只能成功请求 5 次，点播走 beeg-hls Worker
//   （/play.m3u8?vid=&tier=），Worker 每分片重铸新 key。Worker 未部署时回落直链。
// v1.0.2（2026-11-15）：1.0.1 在手机上恒空白——详情只出 <vid>@@V:<档位> 懒链接，
//   loadResource 要先在手机侧重取变体表才回 Worker 行，手机上那步一失败就回 []，
//   播放器什么都拿不到。改按蜜夜AI/YesPorn 1.0.2 同款：详情直接把 Worker 地址写进
//   每集的 videoUrl，点播不再二次解析；loadResource 绝不抛错，现取失败也照样回 Worker 行。
// 移植自 mira-cat 蜘蛛 py_beeg.js（只读蓝图），后端 https://beeg.com/（externulls 栈）。
// 站点：Beeg 新版前端，SPA 壳 + store API，无登录墙。
// 列表：GET https://store.externulls.com/tag/videos/<slug>?limit=N&offset=M
//   （limit>=10 必填、offset 必填；返回数组，条目 file.id / file.data 里
//   cd_column=sf_name 为标题 / fl_duration 秒；未知 slug 回 [] 不 404）。
// 详情：GET https://store.externulls.com/facts/file/<id>（同结构单条）。
// 封面：https://thumbs.externulls.com/videos/<id>/0.webp。
// 播放：GET https://store.externulls.com/video/play_url/<id> -> 模板串
//   key=.../data=.../media=hls4A/multi=<240p..1080p 五档>/_TPL_/<id>.mp4.m3u8；
//   https://video.beeg.com/<模板> 即 master m3u8（5 档变体）；变体播单/首分片全通。
//   模板含 end= 有效期，播放时现取现解，不缓存地址（故详情只存档位名，点播现解）。
// 搜索：站方搜索走 WebSocket，模块改为标签 slug 匹配（关键词去空格小写后当 slug 查）。
// 分类呈现：顶级分类 + 筛选卡片，子分类不平铺：热门标签（79 卡片）/ 热门频道（44 卡片）。
// 字幕：无番号，不接。

WidgetMetadata = {
  id: "lai_beeg",
  title: "Beeg",
  description: "Beeg：externulls API 站，热门标签/热门频道筛选，详情五档变体（240p-1080p）现取现播",
  author: "lai",
  version: "1.0.3",
  requiredVersion: "0.0.1",
  site: "https://beeg.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "热门标签", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tags" }, { name: "sub", title: "标签", type: "enumeration", value: "anal", enumOptions: [{"title": "Anal", "value": "anal"}, {"title": "Blowjob", "value": "blowjob"}, {"title": "Lesbian", "value": "lesbian"}, {"title": "Teen", "value": "teen"}, {"title": "MILF", "value": "milf"}, {"title": "Mature", "value": "mature"}, {"title": "Amateur Girl", "value": "amateur"}, {"title": "Hardcore", "value": "hardcore"}, {"title": "3some", "value": "threesome"}, {"title": "Brunette", "value": "brunette"}, {"title": "Blonde", "value": "blonde"}, {"title": "Asian", "value": "asian"}, {"title": "Black Girl", "value": "ebony"}, {"title": "Latina", "value": "latina"}, {"title": "POV", "value": "pov"}, {"title": "Creampie", "value": "creampie"}, {"title": "Squirting", "value": "squirting"}, {"title": "Bondage & Discipline", "value": "bondage"}, {"title": "Fetish", "value": "fetish"}, {"title": "Interracial", "value": "interracial"}, {"title": "Redhead", "value": "redhead"}, {"title": "Public", "value": "public"}, {"title": "Masturbation", "value": "masturbation"}, {"title": "Webcam", "value": "webcam"}, {"title": "Tattoo", "value": "tattoo"}, {"title": "Orgy", "value": "orgy"}, {"title": "Deepthroat", "value": "deepthroat"}, {"title": "Handjob", "value": "handjob"}, {"title": "Doggy", "value": "doggystyle"}, {"title": "Missionary", "value": "missionary"}, {"title": "Babe", "value": "babe"}, {"title": "Lingerie", "value": "lingerie"}, {"title": "Stockings", "value": "stockings"}, {"title": "Heels", "value": "heels"}, {"title": "Massage", "value": "massage"}, {"title": "Casting", "value": "casting"}, {"title": "Mom", "value": "stepmom"}, {"title": "Sister", "value": "stepsister"}, {"title": "Cheating", "value": "cheating"}, {"title": "Wife", "value": "wife"}, {"title": "Girlfriend", "value": "girlfriend"}, {"title": "Cumshot", "value": "cumshot"}, {"title": "Facial", "value": "facial"}, {"title": "DP", "value": "dp"}, {"title": "Gangbang", "value": "gangbang"}, {"title": "Fisting", "value": "fisting"}, {"title": "Pegging", "value": "pegging"}, {"title": "Strap-On", "value": "strapon"}, {"title": "Voyeur", "value": "voyeur"}, {"title": "Exhibitionist", "value": "exhibitionist"}, {"title": "Outdoor", "value": "outdoor"}, {"title": "Car", "value": "car"}, {"title": "Office", "value": "office"}, {"title": "Teacher", "value": "teacher"}, {"title": "Nurse", "value": "nurse"}, {"title": "Maid", "value": "maid"}, {"title": "Cosplay", "value": "cosplay"}, {"title": "Hentai", "value": "hentai"}, {"title": "Cartoon", "value": "cartoon"}, {"title": "3D-CGI", "value": "3d"}, {"title": "VR", "value": "vr"}, {"title": "Hairy", "value": "hairy"}, {"title": "Shaved", "value": "shaved"}, {"title": "Piercing", "value": "piercing"}, {"title": "Solo", "value": "solo"}, {"title": "Couple", "value": "couple"}, {"title": "Group", "value": "group"}, {"title": "Party", "value": "party"}, {"title": "Cuckold", "value": "cuckold"}, {"title": "FemDom", "value": "femdom"}, {"title": "Dominant", "value": "dominant"}, {"title": "Submissive", "value": "submissive"}, {"title": "Spanking", "value": "spanking"}, {"title": "Bukkake", "value": "bukkake"}, {"title": "Swallowing", "value": "swallow"}, {"title": "Rimjob", "value": "rimming"}, {"title": "Toy", "value": "toys"}, {"title": "Dildo", "value": "dildo"}, {"title": "Vibrator", "value": "vibrator"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "热门频道", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "studios" }, { name: "sub", title: "频道", type: "enumeration", value: "evilangel", enumOptions: [{"title": "Evil Angel", "value": "evilangel"}, {"title": "21 Sextury", "value": "21sextury"}, {"title": "Naughty America", "value": "naughtyamerica"}, {"title": "Wicked", "value": "wicked"}, {"title": "Vivid", "value": "vivid"}, {"title": "Penthouse", "value": "penthouse"}, {"title": "Homemade", "value": "private"}, {"title": "Marc Dorcel", "value": "marcdorcel"}, {"title": "Porn World", "value": "ddfnetwork"}, {"title": "Babe", "value": "babes"}, {"title": "Team Skeet", "value": "teamskeet"}, {"title": "Nubiles", "value": "nubiles"}, {"title": "Vixen", "value": "vixen"}, {"title": "Tushy", "value": "tushy"}, {"title": "Blacked", "value": "blacked"}, {"title": "Deep", "value": "deeper"}, {"title": "Jules Jordan", "value": "julesjordan"}, {"title": "Manuel Ferrara", "value": "manuelferrara"}, {"title": "Joy Mii", "value": "joymii"}, {"title": "Met Art", "value": "metart"}, {"title": "Sex Art", "value": "sexart"}, {"title": "Erotica X", "value": "eroticax"}, {"title": "New Sensations", "value": "newsensations"}, {"title": "Elegant Angel", "value": "elegantangel"}, {"title": "Zero Tolerance", "value": "zerotolerance"}, {"title": "Devil's Film", "value": "devilsfilm"}, {"title": "Girlfriends Films", "value": "girlfriendsfilms"}, {"title": "Girlsway", "value": "girlsway"}, {"title": "Mom-Daughter", "value": "mommysgirl"}, {"title": "Pure Taboo", "value": "puretaboo"}, {"title": "Bratty Sis", "value": "brattysis"}, {"title": "Family Strokes", "value": "familystrokes"}, {"title": "Siblings", "value": "stepsiblings"}, {"title": "MILF", "value": "mylf"}, {"title": "Public Agent", "value": "publicagent"}, {"title": "X Confessions", "value": "xconfessions"}, {"title": "Tricky Old Teacher", "value": "trickyoldteacher"}, {"title": "Old-Young", "value": "oldandyoung"}, {"title": "Mature NL", "value": "maturenl"}, {"title": "Anilos", "value": "anilos"}, {"title": "Karups", "value": "karups"}, {"title": "Anal Vids", "value": "legalporno"}, {"title": "Ass Traffic", "value": "asstraffic"}, {"title": "Rocco Siffredi", "value": "roccosiffredi"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var STORE = "https://store.externulls.com";
var VIDEO = "https://video.beeg.com";
var THUMBS = "https://thumbs.externulls.com";
var SITE = "https://beeg.com";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
// 播单代理 Worker（见同目录 beeg-hls-worker.js，需用户部署；域名 https://beeg-hls.li768435813.workers.dev）：
// REX 播放器不把 customHeaders 转发到分片/密钥请求，直链必死；
// Worker 服务端带头/改写播单。Worker 未部署时回落直链（旧行为）。
var HLS = "https://beeg-hls.li768435813.workers.dev";
function workerUrl(vid, tier) {
  return HLS + "/play.m3u8?vid=" + encodeURIComponent(vid) + "&tier=" + encodeURIComponent(tier);
}
var _hlsLive = null;
var _hlsLiveAt = 0;
async function hlsLive() {
  if (_hlsLive !== null && Date.now() - _hlsLiveAt < 600000) return _hlsLive;
  var ok = false;
  try {
    var res = await Widget.http.get(HLS + "/", { headers: { "User-Agent": UA } });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    ok = res && res.status === 200 && body.indexOf("-hls ok") >= 0;
  } catch (e) { ok = false; }
  _hlsLive = ok;
  _hlsLiveAt = Date.now();
  return ok;
}

var PAGE_SIZE = 24;

function t(v) {
  return String(v == null ? "" : v).trim();
}

function durStr(sec) {
  sec = Math.floor(Number(sec) || 0);
  if (sec <= 0) return "";
  var h = Math.floor(sec / 3600);
  var m = Math.floor((sec % 3600) / 60);
  var s = sec % 60;
  var mm = h > 0 ? (m < 10 ? "0" + m : "" + m) : "" + m;
  var ss = s < 10 ? "0" + s : "" + s;
  return h > 0 ? h + ":" + mm + ":" + ss : mm + ":" + ss;
}

async function getJson(url) {
  try {
    var res = await Widget.http.get(url, {
      headers: { "User-Agent": UA, "Referer": SITE + "/", "Accept": "application/json,*/*" }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    if (!body) return null;
    try { return JSON.parse(body); } catch (e) { return null; }
  } catch (e) {
    return null;
  }
}

async function getText(url) {
  try {
    var res = await Widget.http.get(url, {
      headers: { "User-Agent": UA, "Referer": SITE + "/" }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body;
  } catch (e) {
    return "";
  }
}

function titleOf(item) {
  var data = (item && item.file && Array.isArray(item.file.data)) ? item.file.data : [];
  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    if (d && d.cd_column === "sf_name" && d.cd_value) return t(d.cd_value);
  }
  return "";
}

function itemToCard(item) {
  if (!item || !item.file || item.file.id == null) return null;
  var id = String(item.file.id);
  var title = titleOf(item) || ("Beeg " + id);
  var pic = THUMBS + "/videos/" + id + "/0.webp";
  return {
    id: id,
    type: "url",
    title: title,
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    link: id,
    description: durStr(item.file.fl_duration),
    mediaType: "movie"
  };
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function listByTag(slug, page) {
  var offset = (page - 1) * PAGE_SIZE;
  var arr = await getJson(STORE + "/tag/videos/" + encodeURIComponent(slug) + "?limit=" + PAGE_SIZE + "&offset=" + offset);
  var items = Array.isArray(arr) ? arr : [];
  var list = [];
  for (var i = 0; i < items.length; i++) {
    var card = itemToCard(items[i]);
    if (card) list.push(card);
  }
  return list;
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "tags");
  var sub = t(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var slug = sub || (zone === "studios" ? "evilangel" : "anal");
    var list = await listByTag(slug, page);
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
    var base = wd.toLowerCase().replace(/[\s_]+/g, "-");
    var list = await listByTag(base, page);
    if (!list.length) {
      var stripped = base.replace(/-/g, "");
      if (stripped !== base) list = await listByTag(stripped, page);
    }
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

// master 解析：#EXT-X-STREAM-INF(RESOLUTION=WxH) 下一行为变体地址。
// 变体地址三种形态：//ip...（协议相对，补 https:）、/key=...（video.beeg.com 上的相对路径，补 VIDEO）、https://...（原样）。
function parseMaster(text) {
  var out = [];
  var seen = {};
  var lines = String(text || "").split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    var s = t(lines[i]);
    if (s.indexOf("#EXT-X-STREAM-INF") !== 0) continue;
    var rm = s.match(/RESOLUTION=(\d+)x(\d+)/i);
    var height = rm ? parseInt(rm[2], 10) : 0;
    var url = "";
    for (var j = i + 1; j < lines.length && j <= i + 2; j++) {
      var u = t(lines[j]);
      if (u && u.charAt(0) !== "#") { url = u; break; }
    }
    if (!url) continue;
    if (url.indexOf("//") === 0) url = "https:" + url;
    else if (url.charAt(0) === "/") url = VIDEO + url;
    var label = height ? (height + "p") : "原画";
    if (seen[label]) continue;
    seen[label] = 1;
    out.push({ label: label, height: height, url: url });
  }
  out.sort(function (a, b) { return (b.height || 0) - (a.height || 0); });
  return out;
}

// 取某片的变体表：play_url 模板 -> master 文本 -> 变体数组。模板/master 各重试一次。
async function fetchVariants(id) {
  for (var att = 0; att < 2; att++) {
    var tpl = await getText(STORE + "/video/play_url/" + encodeURIComponent(id));
    var template = t(tpl);
    if (template && template.indexOf("media=") >= 0) {
      var master = await getText(VIDEO + "/" + template);
      if (master.indexOf("#EXTM3U") >= 0) {
        var vs = parseMaster(master);
        if (vs.length) return vs;
      }
    }
  }
  return [];
}

function unwrapLink(x) {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return String(x.link || x.id || x.url || x.href || "");
  return String(x);
}

async function loadDetail(link) {
  try {
    var id = unwrapLink(link);
    if (!id) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    // AVDB 样式：点按标签（/tag/<slug> 或 tag:<名>）→ 打开该标签的全部影片。
    if (id.indexOf("tag:") === 0 || /\/tag\//i.test(id)) {
      var tagSlug = id.indexOf("tag:") === 0 ? id.slice(4) : (id.split("/tag/")[1] || "");
      tagSlug = tagSlug.split("?")[0].split("#")[0].replace(/\/+$/, "");
      var tagName = tagSlug.replace(/-/g, " ");
      var tagWorks = [];
      try { tagWorks = await loadList({ zone: "tags", sub: tagSlug, page: 1 }); } catch (_) { tagWorks = []; }
      if (!Array.isArray(tagWorks)) tagWorks = [];
      var tagReal = tagWorks.filter(function (w) { return w && w.id !== "err" && w.id !== "empty"; });
      return {
        id: SITE + "/tag/" + tagSlug,
        type: "detail",
        mediaType: "movie",
        title: tagName || tagSlug,
        link: SITE + "/tag/" + tagSlug,
        description: "分类 · 共 " + tagReal.length + " 部作品",
        videoUrl: "",
        childItems: [],
        relatedItems: tagReal.length ? tagReal : tagWorks
      };
    }
    var item = await getJson(STORE + "/facts/file/" + encodeURIComponent(id));
    if (!item || !item.file) return { id: id, type: "url", title: "详情获取失败", description: "无此内容" };
    var card = itemToCard(item);
    if (!card) return { id: id, type: "url", title: "详情获取失败", description: "无此内容" };
    var tags = "";
    if (Array.isArray(item.tags)) {
      var names = [];
      for (var k = 0; k < item.tags.length && names.length < 12; k++) {
        var nm = t(item.tags[k].tg_name);
        if (nm) names.push(nm);
      }
      tags = names.join(" / ");
    }
    // AVDB 样式：API 标签建成 genreItems（站内 /tag/<slug>，点按走 loadList 路由）。
    var genreItems = [];
    var seenTag = {};
    if (Array.isArray(item.tags)) {
      for (var k2 = 0; k2 < item.tags.length && genreItems.length < 20; k2++) {
        var tn = t(item.tags[k2].tg_name);
        if (!tn || tn.length > 40) continue;
        var tslug = tn.toLowerCase().replace(/[\s_]+/g, "-");
        if (!tslug || seenTag[tslug]) continue;
        seenTag[tslug] = 1;
        genreItems.push({ id: SITE + "/tag/" + tslug, title: tn });
      }
    }
    // 档位直交 Worker 地址：每集 episodeItem 自带 videoUrl（Worker /play.m3u8，
    // 服务端现解变体、每分片重铸签名），点播不再二次解析；link/id 仍留懒链接作回落。
    // 变体取不到时留一条自动线（Worker 侧取最高档），绝不空手回。
    var variants = [];
    try { variants = await fetchVariants(id); } catch (e) { variants = []; }
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    var firstWorkerUrl = "";
    for (var i = 0; i < (variants.length ? variants.length : 1); i++) {
      var v = variants.length ? variants[i] : null;
      var label = v ? v.label : "自动";
      var tierParam = v ? (v.height ? String(v.height) : v.label) : "自动";
      var lid = id + "@@V:" + label;
      var wurl = workerUrl(id, tierParam);
      if (!firstWorkerUrl) firstWorkerUrl = wurl;
      eps.push({ name: label, link: lid });
      seasonEps.push({ title: label, episodeNumber: i + 1 });
      epItems.push({
        id: lid,
        type: "url",
        title: label,
        mediaType: "movie",
        posterPath: card.posterPath,
        link: lid,
        videoUrl: wurl,
        playerType: "system",
        episode: i + 1,
        episodeNumber: i + 1,
        seasonIndex: 1,
        seasonNumber: 1
      });
    }
    var result = {
      id: id,
      type: "detail",
      title: card.title,
      name: card.title,
      description: tags,
      mediaType: "movie",
      link: id,
      coverUrl: card.posterPath,
      posterPath: card.posterPath,
      backdropPath: card.posterPath,
      playerType: "app",
      videoUrl: firstWorkerUrl,
      episodes: eps,
      seasons: [{ seasonNumber: 1, title: "清晰度", name: "清晰度", episodes: seasonEps }],
      episodeItems: epItems,
      childItems: epItems
    };
    if (genreItems.length) result.genreItems = genreItems;
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
  // 变体入口：<id>@@V:<label> -> 首行 Worker（Worker 侧现解变体、每分片重铸签名）。
  // Worker 行绝不依赖模块这次的现取结果：变体表取不到也照样回 Worker 行，Worker 自己现解。
  var at = raw.indexOf("@@V:");
  if (at >= 0) {
    var vid = raw.slice(0, at);
    var want = raw.slice(at + 4);
    var tierParam = (want && want !== "自动") ? want : "自动";
    var rowName = want || "自动";
    var rows = [{ name: rowName, url: workerUrl(vid, tierParam), playerType: "system" }];
    try {
      var variants = await fetchVariants(vid);
      if (variants && variants.length) {
        var hit = null;
        if (want && want !== "自动") {
          for (var i = 0; i < variants.length; i++) {
            if (variants[i].label === want) { hit = variants[i]; break; }
          }
          if (!hit) {
            for (var j = 0; j < variants.length; j++) {
              if (String(variants[j].height) === String(want).replace(/p$/i, "")) { hit = variants[j]; break; }
            }
          }
        }
        if (!hit) hit = variants[0];
        if (hit) {
          rows[0].name = hit.label;
          rows[0].url = workerUrl(vid, hit.height ? String(hit.height) : hit.label);
          var alive = false;
          try { alive = await hlsLive(); } catch (e2) { alive = false; }
          if (!alive) {
            rows.push({ name: hit.label + "·直连", url: hit.url, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": SITE + "/" } });
          }
        }
      }
    } catch (e) { /* 现取失败也留 Worker 行 */ }
    return rows;
  }
  // 直链 m3u8
  if (/\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": SITE + "/" } }];
  }
  // 裸数字 id：当自动档解，首行 Worker，变体表取不到也不空手回
  if (/^\d+$/.test(raw)) {
    var numRows = [{ name: "自动", url: workerUrl(raw, "自动"), playerType: "system" }];
    try {
      var alive2 = false;
      try { alive2 = await hlsLive(); } catch (e3) { alive2 = false; }
      if (!alive2) {
        var vs = await fetchVariants(raw);
        if (vs && vs.length) {
          numRows.push({ name: vs[0].label + "·直连", url: vs[0].url, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": SITE + "/" } });
        }
      }
    } catch (e) { /* 留 Worker 行 */ }
    return numRows;
  }
  // 兜底：详情地址 -> 取详情首档
  try {
    var det = await loadDetail(raw);
    var eps = det && det.episodeItems;
    if (eps && eps.length) {
      return await loadResource({ link: eps[0].id });
    }
  } catch (e) { /* fall through */ }
  return [];
}
