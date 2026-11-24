// v1.0.5：AVDB 样式详情：peoples/genreItems + 点按路由
// Manko for REX (lai_manko v1.0.4)
// v1.0.4（2026-11-21）：补顶层 search 键（A 键，照 64 个可见模块的众数形状）；B 条目与 search 函数一个字未动。
// v1.0.3（2026-11-15）：用户报只有 Manko 720p 能播，其他线都不能播。根因——
//   1.0.2 只验了 7MMTV 与 Upload18 的活，MissAV 两线与 Manko 720p 线是“有地址就出线”，
//   从不验播单/分片是否真的能取：播单死了（404/下架）照样出线，点播恒黑屏；
//   MissAV 直链的分片若要 Referer，播放器又不转发 customHeaders 到分片请求，
//   同样黑屏（猫源裸返能播是另一台播放器的行为，不能照搬到 REX）。
//   修法：详情里逐线验活——只把探明能播的线交给播放器。
//   播单明确死了（404/410/200 非播单）的不出线；播单活但分片裸取明确失败的
//   MissAV 线改走 manko-hls Worker（服务端带 Referer 取分片）；
//   Manko 720p / 7MMTV 线验的是交给播放器的 Worker 地址本身，Worker 地址死了
//   就退直链（带 Referer 头，播单请求能拿到），直链也死了才留懒解析回落。
//   探不到（超时/异常）一律按活处理，绝不因本站抖动藏线。
// v1.0.2（2026-11-15）：根因——1.0.1 的 Manko 720p 只留懒解析入口，loadResource
//   要先在手机侧现取 /stream 才回 Worker 行；手机上那步一失败就回 []，播放器恒
//   空白。修法（蜜夜AI/YesPorn 1.0.2 同款）：详情里直接把 Worker 地址写进每集的
//   videoUrl，点播不再二次解析；/stream 详情时现取一次，取不到退 wasabi_url_1；
//   两路都无才留空 videoUrl 走懒解析回落。loadResource 全程 try/catch，绝不抛错。
// v1.0.1（2026-11-14）：根因——Manko 720p 线：wasabi 播单在 CF 后面，Referer 必须是
//   embed host origin 才 200，manko.fun/无 Referer 一律 403，播单、分片、密钥三级全要这个
//   Referer；7MMTV 线同理，分片须带 Referer: https://7mmtv.sx/。播放器只把 customHeaders
//   发给播单请求，分片拿不到 Referer，全 403，必黑屏。修法：Manko 720p 与 7MMTV 两线走
//   manko-hls Worker，Worker 服务端带对应 Referer 取播单与分片。MissAV 线不带 Referer 即可，
//   继续直链；Upload18 继续走 app 嗅探。Worker 未部署时回落直链（旧行为）。
// 移植自 mira-cat 蜘蛛 py_manko.js（只读蓝图），站 https://manko.fun，
// API 在 https://healertanker.com（备用 https://alpharomeo.shop）。
// 列表/搜索/详情回包 data 是自定义 base91 变体编码（xn，字母表照抄站方
// /dist/build.js；REX 无 Buffer，字节数组 + 手工 UTF-8 解码）。
// 分类：最新 + 8 热门体裁顶级化 + 最受欢迎/最高评分/有字幕/随机 +
// 体裁（103 卡片）/厂商（40 卡片）筛选。注意：category= 参数是死路
// （恒 total 0），体裁过滤必须用 genre=、厂商用 country=。
// 播放四线（与猫源同款）：Manko 720p（/stream 直链，Referer 必须是 embed
// host origin，manko.fun 必 403）+ MissAV 自动/数据档（不带 Referer）+
// 7MMTV（分片须带 Referer https://7mmtv.sx/，详情先验活）+ Upload18
// （播放器页嗅探，详情先验活，死的直接不出线）。

WidgetMetadata = {
  id: "lai_manko",
  title: "Manko",
  description: "Manko：最新 + 8 热门体裁 + 最受欢迎/最高评分/有字幕/随机，体裁/厂商筛选，四线播放（逐线验活，死线不出）",
  author: "lai",
  version: "1.0.5",
  requiredVersion: "0.0.1",
  site: "https://manko.fun",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "new" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "无码流出", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "g_uncleak" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "无码破解", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "g_unccrack" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "g_bigtits" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "大屁股", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "g_hugebutt" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "屁股", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "g_butt" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "中出", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "g_creampie" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "g_mature" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "g_amateur" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "最受欢迎", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "popular" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "最高评分", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "top_rated" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "有字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "subtitle" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "随机", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "random" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "体裁", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "genres" }, { name: "sub", title: "体裁", type: "enumeration", value: "69", enumOptions: [{"title": "69", "value": "69"}, {"title": "3D", "value": "3D"}, {"title": "3p, 4p", "value": "3p, 4p"}, {"title": "4HR+", "value": "4HR+"}, {"title": "4K", "value": "4K"}, {"title": "Action", "value": "Action"}, {"title": "Adult Movie", "value": "Adult Movie"}, {"title": "Amateur", "value": "Amateur"}, {"title": "Anus", "value": "Anus"}, {"title": "BBW", "value": "BBW"}, {"title": "Beautiful foot", "value": "Beautiful foot"}, {"title": "Beautiful Girl Movie", "value": "Beautiful Girl Movie"}, {"title": "Best, Omnibus", "value": "Best, Omnibus"}, {"title": "Big cock", "value": "Big cock"}, {"title": "Big Tits", "value": "Big Tits"}, {"title": "Blow", "value": "Blow"}, {"title": "Breast Milk", "value": "Breast Milk"}, {"title": "Breasts", "value": "Breasts"}, {"title": "Butt", "value": "Butt"}, {"title": "Classic", "value": "Classic"}, {"title": "Close Up", "value": "Close Up"}, {"title": "Co-act", "value": "Co-act"}, {"title": "Coprophagy", "value": "Coprophagy"}, {"title": "Cowgirl", "value": "Cowgirl"}, {"title": "Creampie", "value": "Creampie"}, {"title": "Cum", "value": "Cum"}, {"title": "Cunnilingus", "value": "Cunnilingus"}, {"title": "dating", "value": "dating"}, {"title": "Debut Production", "value": "Debut Production"}, {"title": "Deep Throating", "value": "Deep Throating"}, {"title": "Defecation", "value": "Defecation"}, {"title": "Digital Mosaic", "value": "Digital Mosaic"}, {"title": "Dirty Words", "value": "Dirty Words"}, {"title": "Documentary", "value": "Documentary"}, {"title": "Doggy style", "value": "Doggy style"}, {"title": "Drama", "value": "Drama"}, {"title": "Facesitting", "value": "Facesitting"}, {"title": "Facials", "value": "Facials"}, {"title": "Fan Appreciation", "value": "Fan Appreciation"}, {"title": "FFM", "value": "FFM"}, {"title": "Fighting Action", "value": "Fighting Action"}, {"title": "Finger Fuck", "value": "Finger Fuck"}, {"title": "Fisting", "value": "Fisting"}, {"title": "Fit two holes", "value": "Fit two holes"}, {"title": "Footjob", "value": "Footjob"}, {"title": "For Women", "value": "For Women"}, {"title": "Gravure", "value": "Gravure"}, {"title": "Handjob", "value": "Handjob"}, {"title": "HD DVD", "value": "HD DVD"}, {"title": "Historical Play", "value": "Historical Play"}, {"title": "Horror", "value": "Horror"}, {"title": "How To", "value": "How To"}, {"title": "Huge Butt", "value": "Huge Butt"}, {"title": "Image Video", "value": "Image Video"}, {"title": "Independents", "value": "Independents"}, {"title": "Interview", "value": "Interview"}, {"title": "Kiss", "value": "Kiss"}, {"title": "Lolita", "value": "Lolita"}, {"title": "Love", "value": "Love"}, {"title": "Massage", "value": "Massage"}, {"title": "Masturbation", "value": "Masturbation"}, {"title": "Mature Woman", "value": "Mature Woman"}, {"title": "Mini", "value": "Mini"}, {"title": "MMF", "value": "MMF"}, {"title": "MMFF", "value": "MMFF"}, {"title": "Multiple Story", "value": "Multiple Story"}, {"title": "Muscle", "value": "Muscle"}, {"title": "No bra", "value": "No bra"}, {"title": "Omnibus", "value": "Omnibus"}, {"title": "Original Collaboration", "value": "Original Collaboration"}, {"title": "Over 16 hours", "value": "Over 16 hours"}, {"title": "Oversea Import", "value": "Oversea Import"}, {"title": "Parody", "value": "Parody"}, {"title": "Piss Drinking", "value": "Piss Drinking"}, {"title": "POV", "value": "POV"}, {"title": "Pregnant Woman", "value": "Pregnant Woman"}, {"title": "Promiscuity", "value": "Promiscuity"}, {"title": "Reprinted Edition", "value": "Reprinted Edition"}, {"title": "Risky Mosaic", "value": "Risky Mosaic"}, {"title": "Roll your eyes", "value": "Roll your eyes"}, {"title": "Sensuality", "value": "Sensuality"}, {"title": "SF", "value": "SF"}, {"title": "Shave", "value": "Shave"}, {"title": "Shaved", "value": "Shaved"}, {"title": "Simulation", "value": "Simulation"}, {"title": "Slender", "value": "Slender"}, {"title": "Solowork", "value": "Solowork"}, {"title": "Spanking", "value": "Spanking"}, {"title": "Special Effects", "value": "Special Effects"}, {"title": "Squirting", "value": "Squirting"}, {"title": "Subjectivity", "value": "Subjectivity"}, {"title": "Tall", "value": "Tall"}, {"title": "Tits", "value": "Tits"}, {"title": "Titty Fuck", "value": "Titty Fuck"}, {"title": "Touch Typing", "value": "Touch Typing"}, {"title": "Transsexual", "value": "Transsexual"}, {"title": "Uncensored Crack", "value": "Uncensored Crack"}, {"title": "Uncensored Leak", "value": "Uncensored Leak"}, {"title": "Urination", "value": "Urination"}, {"title": "US/EU Porn", "value": "US/EU Porn"}, {"title": "User Submission", "value": "User Submission"}, {"title": "VR", "value": "VR"}, {"title": "Yoga·Fitness", "value": "Yoga·Fitness"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "厂商", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "makers" }, { name: "sub", title: "厂商", type: "enumeration", value: "S1 NO.1 STYLE", enumOptions: [{"title": "S1 NO.1 STYLE", "value": "S1 NO.1 STYLE"}, {"title": "MOODYZ", "value": "MOODYZ"}, {"title": "IDEA POCKET", "value": "IDEA POCKET"}, {"title": "マドンナ(Madonna)", "value": "マドンナ(Madonna)"}, {"title": "PRESTIGE,プレステージ", "value": "PRESTIGE,プレステージ"}, {"title": "SOD Create", "value": "SOD Create"}, {"title": "センタービレッジ", "value": "センタービレッジ"}, {"title": "クリスタル映像", "value": "クリスタル映像"}, {"title": "FALENO", "value": "FALENO"}, {"title": "ルビー", "value": "ルビー"}, {"title": "桃太郎映像出版", "value": "桃太郎映像出版"}, {"title": "シロウトTV", "value": "シロウトTV"}, {"title": "アリスJAPAN", "value": "アリスJAPAN"}, {"title": "STAR PARADISE", "value": "STAR PARADISE"}, {"title": "Glory Quest", "value": "Glory Quest"}, {"title": "タカラ映像", "value": "タカラ映像"}, {"title": "Attackers", "value": "Attackers"}, {"title": "h.m.p", "value": "h.m.p"}, {"title": "ワンズファクトリー", "value": "ワンズファクトリー"}, {"title": "パラダイステレビ", "value": "パラダイステレビ"}, {"title": "GIGA", "value": "GIGA"}, {"title": "ビッグモーカル", "value": "ビッグモーカル"}, {"title": "ワープエンタテインメント", "value": "ワープエンタテインメント"}, {"title": "なでしこ", "value": "なでしこ"}, {"title": "アイエナジー", "value": "アイエナジー"}, {"title": "VENUS", "value": "VENUS"}, {"title": "ナチュラルハイ", "value": "ナチュラルハイ"}, {"title": "ディープス", "value": "ディープス"}, {"title": "映天", "value": "映天"}, {"title": "Hunter", "value": "Hunter"}, {"title": "ナンパTV", "value": "ナンパTV"}, {"title": "TMA", "value": "TMA"}, {"title": "NEXT GROUP", "value": "NEXT GROUP"}, {"title": "オルスタックピクチャーズ", "value": "オルスタックピクチャーズ"}, {"title": "ジャネス", "value": "ジャネス"}, {"title": "S級素人", "value": "S級素人"}, {"title": "プレステージプレミアム(PRESTIGE PREMIUM)", "value": "プレステージプレミアム(PRESTIGE PREMIUM)"}, {"title": "マキシング", "value": "マキシング"}, {"title": "マックスエー", "value": "マックスエー"}, {"title": "セレブの友", "value": "セレブの友"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
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

var API_HOSTS = ["https://healertanker.com", "https://alpharomeo.shop"];
var SITE = "https://manko.fun";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
// 播单代理 Worker（见同目录 manko-hls-worker.js，需用户部署；域名 https://manko-hls.li768435813.workers.dev）：
// REX 播放器不把 customHeaders 转发到分片/密钥请求，直链必死；
// Worker 服务端带头/改写播单。Worker 未部署时回落直链（旧行为）。
var HLS = "https://manko-hls.li768435813.workers.dev";
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

// 顶级化的热门体裁（站内实测 total 有量）
var TOP_GENRES = [
  { id: "g_uncleak", name: "无码流出", genre: "Uncensored Leak" },
  { id: "g_unccrack", name: "无码破解", genre: "Uncensored Crack" },
  { id: "g_bigtits", name: "巨乳", genre: "Big Tits" },
  { id: "g_hugebutt", name: "大屁股", genre: "Huge Butt" },
  { id: "g_butt", name: "屁股", genre: "Butt" },
  { id: "g_creampie", name: "中出", genre: "Creampie" },
  { id: "g_mature", name: "人妻", genre: "Mature Woman" },
  { id: "g_amateur", name: "素人", genre: "Amateur" }
];
var TOP_GENRE_MAP = {};
for (var gi = 0; gi < TOP_GENRES.length; gi++) TOP_GENRE_MAP[TOP_GENRES[gi].id] = TOP_GENRES[gi].genre;

function t(v) {
  return String(v == null ? "" : v).trim();
}

// xn 解码（原样抄自 manko.fun /dist/build.js 的 xn 函数；vn 即 Buffer；
// 字母表 91 字符的 base91 变体）。REX 无 Buffer：字节数组 + 手工 UTF-8 解码。
function utf8DecodeBytes(bytes) {
  var out = "";
  var i = 0;
  while (i < bytes.length) {
    var c = bytes[i++];
    if (c < 0x80) {
      out += String.fromCharCode(c);
    } else if ((c & 0xE0) === 0xC0) {
      var c2 = bytes[i++] & 0x3F;
      out += String.fromCharCode(((c & 0x1F) << 6) | c2);
    } else if ((c & 0xF0) === 0xE0) {
      var c2b = bytes[i++] & 0x3F, c3 = bytes[i++] & 0x3F;
      out += String.fromCharCode(((c & 0x0F) << 12) | (c2b << 6) | c3);
    } else if ((c & 0xF8) === 0xF0) {
      var c2c = bytes[i++] & 0x3F, c3c = bytes[i++] & 0x3F, c4 = bytes[i++] & 0x3F;
      var cp = ((c & 0x07) << 18) | (c2c << 12) | (c3c << 6) | c4;
      cp -= 0x10000;
      out += String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 0x3FF));
    }
  }
  return out;
}
function xn(e) {
  var ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"';
  var t0 = "" + (e || "");
  var n = t0.length;
  var r = [];
  var a = 0, i = 0, o = -1;
  for (var s = 0; s < n; s++) {
    var l = ALPH.indexOf(t0[s]);
    if (l === -1) continue;
    if (o < 0) o = l;
    else {
      a |= (o += 91 * l) << i;
      i += (8191 & o) > 88 ? 13 : 14;
      do { r.push(255 & a); a >>= 8; i -= 8; } while (i > 7);
      o = -1;
    }
  }
  if (o > -1) r.push(255 & (a | (o << i)));
  return utf8DecodeBytes(r);
}

async function apiRaw(path) {
  for (var h = 0; h < API_HOSTS.length; h++) {
    try {
      var res = await Widget.http.get(API_HOSTS[h] + path, {
        headers: { "User-Agent": UA, "Referer": SITE + "/", "Accept": "application/json,*/*" }
      });
      var txt = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
      if (txt) {
        try { return JSON.parse(txt); } catch (e) { /* 非 JSON（如拦截页），换备用 host */ }
      }
    } catch (e) { /* 换备用 host */ }
  }
  return null;
}

// search 系接口：解 data、带 total；失败回 null。
async function apiSearch(path) {
  var j = await apiRaw(path);
  if (!j || typeof j.data !== "string") return null;
  var arr = [];
  try { arr = JSON.parse(xn(j.data)); } catch (e) { return null; }
  if (!Array.isArray(arr)) return null;
  return { items: arr, total: Number(j.total) || 0 };
}

async function apiDetail(id) {
  var j = await apiRaw("/swx/movie/detail/" + encodeURIComponent(id));
  if (!j || typeof j.data !== "string") return null;
  try {
    var d = JSON.parse(xn(j.data));
    return d && typeof d === "object" ? d : null;
  } catch (e) { return null; }
}

function itemToCard(it) {
  if (!it || !it._id) return null;
  var title = t(it.title);
  if (!title && Array.isArray(it.title_display_name) && it.title_display_name[0]) {
    title = t(it.title_display_name[0].title);
  }
  if (!title) title = it._id;
  var remarks = [t(it.share_date), it.rating ? ("★" + it.rating) : ""].filter(Boolean).join(" ");
  var pic = t(it.thumbnail_image) || t(it.wide_thumbnail) || "";
  return {
    id: String(it._id),
    type: "url",
    title: title,
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    link: String(it._id),
    description: remarks,
    mediaType: "movie"
  };
}

function searchUrl(page, extra) {
  return "/swx/movie/search?page=" + page + "&size=" + PAGE_SIZE + "&can_manko=true" + (extra || "");
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || params.path || params.cat || "new");
  var sub = t(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var path = "";
  if (zone === "new") path = searchUrl(page, "");
  else if (TOP_GENRE_MAP[zone]) path = searchUrl(page, "&genre=" + encodeURIComponent(TOP_GENRE_MAP[zone]));
  else if (zone === "popular") path = searchUrl(page, "&most_popular=true");
  else if (zone === "top_rated") path = searchUrl(page, "&top_rated=true");
  else if (zone === "subtitle") path = searchUrl(page, "&subtitle_link=true");
  else if (zone === "random") path = "/swx/movie/random-list?page=" + page + "&size=" + PAGE_SIZE;
  else if (zone === "genres") path = searchUrl(page, "&genre=" + encodeURIComponent(sub || "69"));
  else if (zone === "makers") path = searchUrl(page, "&country=" + encodeURIComponent(sub || "S1 NO.1 STYLE"));
  else return emptyItem("未知分类");
  try {
    var res = await apiSearch(path);
    if (!res) return emptyItem();
    var list = [];
    for (var i = 0; i < res.items.length; i++) {
      var v = itemToCard(res.items[i]);
      if (v) list.push(v);
    }
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
    var res = await apiSearch(searchUrl(page, "&keyword=" + encodeURIComponent(wd)));
    if (!res) return emptyItem();
    var list = [];
    for (var i = 0; i < res.items.length; i++) {
      var v = itemToCard(res.items[i]);
      if (v) list.push(v);
    }
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

function titleOf(d, fallback) {
  var names = Array.isArray(d.title_display_name) ? d.title_display_name : [];
  var en = null, any = names[0];
  for (var i = 0; i < names.length; i++) {
    if (names[i] && names[i].language === "en") { en = names[i]; break; }
  }
  return t(d.title) || t(en && en.title) || t(any && any.title) || fallback || "";
}

function overviewOf(d) {
  var arr = Array.isArray(d.discription) ? d.discription : [];
  var zh = null, en = null;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] && arr[i].language === "zh" && !zh) zh = arr[i];
    if (arr[i] && arr[i].language === "en" && !en) en = arr[i];
  }
  return t(zh && zh.overview) || t(en && en.overview) || t(arr[0] && arr[0].overview);
}

async function getTextRaw(url, headers) {
  try {
    var res = await Widget.http.get(url, { headers: headers || { "User-Agent": UA } });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return { status: (res && res.status) || 0, body: body };
  } catch (e) { return { status: 0, body: "" }; }
}

// Range 取一段：只验状态码（200/206 为活），不读 body。
async function getRangeStatus(url, headers) {
  try {
    var h = { "User-Agent": UA, "Range": "bytes=0-1023" };
    if (headers) {
      for (var k in headers) h[k] = headers[k];
    }
    var res = await Widget.http.get(url, { headers: h });
    return (res && res.status) || 0;
  } catch (e) { return 0; }
}

// 相对地址拼绝对地址（REX 无 URL，按字符串规则处理三种形式）
function absUrlRel(u, base) {
  u = String(u || "");
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) {
    var proto = base.match(/^https?:/i);
    return (proto ? proto[0] : "https:") + u;
  }
  var m = String(base || "").match(/^(https?:\/\/[^\/]+)(\/[^?#]*)?/i);
  if (!m) return u;
  if (u.charAt(0) === "/") return m[1] + u;
  var dir = m[2] || "/";
  var slash = dir.lastIndexOf("/");
  return m[1] + dir.slice(0, slash + 1) + u;
}

// 播单里第一个非 m3u8 的分片地址（相对地址按播单地址解析）
function firstSegOf(playlistText, baseUrl) {
  var lines = String(playlistText || "").split("\n");
  for (var i = 0; i < lines.length; i++) {
    var s = lines[i].trim();
    if (!s || s.charAt(0) === "#") continue;
    if (/\.m3u8(\?|#|$)/i.test(s)) continue;
    return absUrlRel(s, baseUrl);
  }
  return "";
}

// 逐线验活：返回 "alive" | "dead" | "segdead" | "unknown"。
//   alive：播单 200 + #EXTM3U，且（checkSeg 时）首分片 Range 200/206。
//   dead：播单 404/410，或 200 但不是播单——这条线是真死了，不出线。
//   segdead：播单活，但首分片明确 403/404——直链分片腿已死，需走 Worker。
//   unknown：超时/异常/其他状态——按活处理，绝不因抖动藏线。
async function probeLine(url, headers, checkSeg) {
  var r = await getTextRaw(url, headers);
  if (r.status === 0) return "unknown";
  if (r.status === 404 || r.status === 410) return "dead";
  if (r.status !== 200) return "unknown";
  if ((r.body || "").indexOf("#EXTM3U") < 0) return "dead";
  if (!checkSeg) return "alive";
  var seg = firstSegOf(r.body, url);
  if (!seg) return "alive";
  var st = await getRangeStatus(seg, headers);
  if (st === 0) return "unknown";
  if (st === 200 || st === 206) return "alive";
  return "segdead";
}

function workerUrl(u, ref) {
  return HLS + "/play.m3u8?u=" + encodeURIComponent(u) + "&r=" + encodeURIComponent(ref);
}

// embed 播放器 /stream 取直链：wasabi_embed_url 形如 https://<host>/e/<code>?poster=...
// -> GET https://<host>/stream?id=<code>。/stream 与后续 m3u8 都按 Referer 放行，
// Referer 必须是 embed host origin（manko.fun/无 Referer 时 CF 403）。
async function resolveWasabiStream(embedUrl) {
  if (!embedUrl) return { stream: "", embedOrigin: "" };
  var m = String(embedUrl).match(/^(https?:\/\/[^\/]+)\/e\/([A-Za-z0-9]+)/);
  if (!m) return { stream: "", embedOrigin: "" };
  var embedOrigin = m[1];
  var streamApi = m[1] + "/stream?id=" + m[2];
  try {
    var r = await getTextRaw(streamApi, { "User-Agent": UA, "Referer": embedOrigin + "/" });
    var txt = r.body || "";
    if (!txt) return { stream: "", embedOrigin: embedOrigin };
    var j = JSON.parse(txt);
    return { stream: t(j && j.media && j.media.stream), embedOrigin: embedOrigin };
  } catch (e) {
    return { stream: "", embedOrigin: embedOrigin };
  }
}

// 7MMTV 播单验活：播单 200 且含 #EXTM3U、首分片 200 才算活；其余情况一律按活处理，
// 不因本站抖动藏线。分片须带 Referer: https://7mmtv.sx/。
async function mmtvAlive(m3u8Url) {
  try {
    var r = await getTextRaw(m3u8Url, { "User-Agent": UA, "Referer": "https://7mmtv.sx/" });
    var txt = r.body || "";
    if (r.status !== 200 || txt.indexOf("#EXTM3U") < 0) return true;
    var lines = txt.split("\n");
    var seg = "";
    for (var i = 0; i < lines.length; i++) {
      var s = lines[i].trim();
      if (/^https?:/.test(s) && !/\.m3u8/i.test(s)) { seg = s; break; }
    }
    if (!seg) return true;
    var sr = await getTextRaw(seg, { "User-Agent": UA, "Referer": "https://7mmtv.sx/" });
    // v1.0.2：取不到（status 0，手机网络抖动）按活处理，不藏线——Worker 服务端
    // 带 Referer 取分片照样能播；只有明确的非 200 回包才判死。
    if (sr.status === 0) return true;
    return sr.status === 200;
  } catch (e) {
    return true;
  }
}

// Upload18 播放器页验活：站方本身部分视频已下架（302 到 /404.html，标题 Page not found）；
// 活页标题是番号。验不出（超时/异常/非 200 非 404）一律按活处理，不因本站抖动藏线。
async function u18Alive(playerUrl) {
  try {
    var r = await getTextRaw(playerUrl, { "User-Agent": UA, "Referer": SITE + "/" });
    var txt = r.body || "";
    if (txt.indexOf("<title>Page not found</title>") >= 0) return false;
    if (r.status === 200 && txt) return true;
    return true;
  } catch (e) {
    return true;
  }
}

// ---- AVDB 样式详情：演员/分类（点按出对应全部内容，API 字段）----
function taxRealWorks(works) {
  var out = [];
  for (var i = 0; i < works.length; i++) {
    var w = works[i];
    if (w && w.id !== "err" && w.id !== "err_cf" && w.id !== "empty" && w.id !== "tip") out.push(w);
  }
  return out;
}

function taxNamesFromVal(v) {
  var out = [];
  if (typeof v === "string") {
    var parts = v.split(/[,、;；|]/);
    for (var i = 0; i < parts.length; i++) { var s = String(parts[i] || "").trim(); if (s && s.length <= 40) out.push(s); }
  } else if (Array.isArray(v)) {
    for (var j = 0; j < v.length; j++) {
      var it = v[j];
      if (typeof it === "string") { var s2 = String(it || "").trim(); if (s2 && s2.length <= 40) out.push(s2); }
      else if (it && typeof it === "object") { var nm = String(it.name || it.title || it.label || "").trim(); if (nm && nm.length <= 40) out.push(nm); }
    }
  }
  return out;
}

function extractTaxonomyFromApi(d) {
  var peoples = [];
  var genreItems = [];
  var seenP = {};
  var seenG = {};
  var actorKeys = ["actress", "actresses", "actor", "actors", "stars", "star", "performer", "performers", "model", "models"];
  var genreKeys = ["genre", "genres", "tag", "tags", "category", "categories", "label", "labels"];
  var ki, k, names, ni, nm;
  for (ki = 0; ki < actorKeys.length; ki++) {
    k = actorKeys[ki];
    if (!d || d[k] == null) continue;
    names = taxNamesFromVal(d[k]);
    for (ni = 0; ni < names.length; ni++) {
      nm = names[ni];
      if (seenP[nm]) continue;
      seenP[nm] = 1;
      if (peoples.length < 20) peoples.push({ id: "actor:" + nm, title: nm, name: nm, link: "actor:" + nm, role: "演员" });
    }
    if (peoples.length >= 20) break;
  }
  for (ki = 0; ki < genreKeys.length; ki++) {
    k = genreKeys[ki];
    if (!d || d[k] == null) continue;
    names = taxNamesFromVal(d[k]);
    for (ni = 0; ni < names.length; ni++) {
      nm = names[ni];
      if (seenG[nm]) continue;
      seenG[nm] = 1;
      if (genreItems.length < 20) genreItems.push({ id: "genre:" + nm, title: nm });
    }
    if (genreItems.length >= 20) break;
  }
  return { peoples: peoples, genreItems: genreItems };
}

async function taxTokenRoute(token) {
  var isActor = token.indexOf("actor:") === 0;
  var name = "";
  if (isActor) name = token.slice(6);
  else if (token.indexOf("category|") === 0) name = token.slice(9);
  else if (token.indexOf("genre:") === 0) name = token.slice(6);
  else if (token.indexOf("tag:") === 0) name = token.slice(4);
  var works = [];
  try {
    if (!isActor) works = await loadList({ zone: "genres", sub: name, page: 1 });
  } catch (_) { works = []; }
  if (!Array.isArray(works)) works = [];
  var realWorks = taxRealWorks(works);
  if (!realWorks.length && name) {
    try {
      var sw = await search({ keyword: name });
      if (Array.isArray(sw)) { works = sw; realWorks = taxRealWorks(sw); }
    } catch (_) {}
  }
  return {
    id: token,
    type: "detail",
    mediaType: "movie",
    title: name || (isActor ? "演员" : "分类"),
    link: token,
    description: (isActor ? "演员" : "分类") + " · 共 " + realWorks.length + " 部作品",
    videoUrl: "",
    childItems: [],
    relatedItems: realWorks.length ? realWorks : works
  };
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    var id = t(raw);
    if (id.indexOf("manko:") === 0) id = id.slice(6);
    if (id.indexOf("actor:") === 0 || id.indexOf("genre:") === 0) {
      return await taxTokenRoute(id);
    }
    if (!id) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var d = await apiDetail(id);
    if (!d) return { id: id, type: "url", title: "详情获取失败", description: "无此内容" };
    var tax = extractTaxonomyFromApi(d);
    var name = titleOf(d, id);
    var pic = t(d.cover_image) || "";
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    var addEp = function (title, lid, videoUrl, playerType, customHeaders) {
      eps.push({ name: title, link: lid });
      var se = { title: title, episodeNumber: eps.length };
      if (videoUrl) se.videoUrl = videoUrl;
      seasonEps.push(se);
      var item = {
        id: lid,
        type: "url",
        title: title,
        mediaType: "movie",
        posterPath: pic,
        link: lid,
        episode: eps.length,
        episodeNumber: eps.length,
        seasonIndex: 1,
        seasonNumber: 1
      };
      if (videoUrl) {
        item.videoUrl = videoUrl;
        item.playerType = playerType || "system";
        if (customHeaders) item.customHeaders = customHeaders;
      }
      epItems.push(item);
    };
    // 分组 1：Manko 720p（/stream 直链；master 实测单变体 1280x720，无 embed 时
    // 退 wasabi_url_1 直链）。v1.0.3：验交给播放器的 Worker 地址本身——
    // Worker 播单/分片明确死了就退直链（带 Referer 头），直链也死了才留懒解析回落；
    // 探不到一律按活处理，不藏线。
    if (d.wasabi_embed_url || d.wasabi_url_1) {
      var wRes = await resolveWasabiStream(d.wasabi_embed_url);
      var wStream = wRes.stream;
      if (!wStream) wStream = t(d.wasabi_url_1);
      var wRef = wRes.embedOrigin ? wRes.embedOrigin + "/" : SITE + "/";
      var wUrl = "";
      var wHeaders = null;
      if (wStream) {
        if (await hlsLive()) {
          var wWurl = workerUrl(wStream, wRef);
          var wProbe = await probeLine(wWurl, null, true);
          if (wProbe === "alive" || wProbe === "unknown") {
            wUrl = wWurl;
          } else {
            // Worker 腿明确死了：退直链（播单请求能拿到 Referer 头，分片未必——尽力而为）
            var wDirect = await probeLine(wStream, { "User-Agent": UA, "Referer": wRef }, false);
            if (wDirect !== "dead") {
              wUrl = wStream;
              wHeaders = { "User-Agent": UA, "Referer": wRef };
            }
          }
        } else {
          wUrl = wStream;
          wHeaders = { "User-Agent": UA, "Referer": wRef };
        }
      }
      addEp("Manko 720p", "@@MK:" + id + ":wasabi", wUrl, "system", wHeaders);
    }
    // 分组 2：MissAV 自动 + 数据档。档位取自详情数据原给的地址（逐部不同，
    // 写死 720p 会标错）；自动是同 uuid 的 playlist.m3u8 主播单。
    // v1.0.3：逐线验活——播单明确死了的不出线；播单活但分片裸取明确失败的
    // 改走 manko-hls Worker（服务端带 Referer: https://missav.com/ 取分片）；
    // 探不到按活处理，走直链。
    if (d.missav_video) {
      var mv = t(d.missav_video);
      var resM = mv.match(/\/(1080p|720p|480p|360p)\/video\.m3u8$/i);
      var resLabel = resM ? resM[1] : "720p";
      var missavLine = async function (u) {
        var pr = await probeLine(u, null, true);
        if (pr === "dead") return "";
        if (pr === "segdead" && await hlsLive()) return workerUrl(u, "https://missav.com/");
        return u;
      };
      if (resM) {
        var auto = mv.replace(/\/\d+p\/video\.m3u8$/i, "/playlist.m3u8");
        var autoUrl = await missavLine(auto);
        if (autoUrl) addEp("MissAV 自动", "@@MK:" + id + ":missav-auto", autoUrl, "system", null);
      }
      var tierUrl = await missavLine(mv);
      if (tierUrl) addEp("MissAV " + resLabel, "@@MK:" + id + ":missav", tierUrl, "system", null);
    }
    // 分组 3：7MMTV（分片须带 7mmtv.sx Referer）。v1.0.3：验交给播放器的 Worker
    // 地址本身——Worker 腿明确死了就退直链（带 Referer 头），直链也明确死了才不出线；
    // 探不到按活处理，不藏线。
    if (d.mmtv_m3u8) {
      var mmtvRaw = t(d.mmtv_m3u8);
      var mmtvUrl = "";
      var mmtvHeaders = null;
      if (await hlsLive()) {
        var mWurl = workerUrl(mmtvRaw, "https://7mmtv.sx/");
        var mProbe = await probeLine(mWurl, null, true);
        if (mProbe === "alive" || mProbe === "unknown") {
          mmtvUrl = mWurl;
        } else {
          var mDirect = await probeLine(mmtvRaw, { "User-Agent": UA, "Referer": "https://7mmtv.sx/" }, false);
          if (mDirect !== "dead") {
            mmtvUrl = mmtvRaw;
            mmtvHeaders = { "User-Agent": UA, "Referer": "https://7mmtv.sx/" };
          }
        }
      } else {
        mmtvUrl = mmtvRaw;
        mmtvHeaders = { "User-Agent": UA, "Referer": "https://7mmtv.sx/" };
      }
      if (mmtvUrl) addEp("7MMTV", "@@MK:" + id + ":mmtv", mmtvUrl, "system", mmtvHeaders);
    }
    // 分组 4：Upload18（播放器页，播放器嗅探线；先验活，死的直接不出线）。
    if (Array.isArray(d.upload18_player) && d.upload18_player[0]) {
      if (await u18Alive(t(d.upload18_player[0]))) {
        addEp("Upload18", "@@MK:" + id + ":u18", t(d.upload18_player[0]), "app", { "User-Agent": UA, "Referer": SITE + "/" });
      }
    }
    var result = {
      id: id,
      type: "detail",
      title: name || id,
      name: name || id,
      description: overviewOf(d) || (d.video_duration ? (Math.floor(Number(d.video_duration) || 0) + "分钟") : ""),
      mediaType: "movie",
      link: id,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app"
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "线路", name: "线路", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
      // v1.0.2：顶层播放入口 = 首个带 system 直链的集（Worker 地址）；app 嗅探线不进顶层。
      for (var vi = 0; vi < epItems.length; vi++) {
        if (epItems[vi].videoUrl && epItems[vi].playerType === "system") {
          result.videoUrl = epItems[vi].videoUrl;
          result.playerType = "system";
          break;
        }
      }
    }
    if (tax.peoples.length) result.peoples = tax.peoples;
    if (tax.genreItems.length) result.genreItems = tax.genreItems;
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

async function loadResource(params) {
  try {
    return await loadResourceSafe(params);
  } catch (e) {
    return [];
  }
}

async function loadResourceSafe(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 懒解析入口：@@MK:<id>:<leg>
  var at = raw.indexOf("@@MK:");
  if (at < 0) {
    if (/\.m3u8(\?|#|$)/i.test(raw)) {
      return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": SITE + "/" } }];
    }
    return [];
  }
  var body = raw.slice(at + 5);
  var m = body.match(/^([^:]+):(wasabi|missav|missav-auto|mmtv|u18)$/);
  if (!m) return [];
  var vid = m[1];
  var leg = m[2];
  var d = null;
  try { d = await apiDetail(vid); } catch (e2) { d = null; }
  if (!d) return [];
  if (leg === "wasabi") {
    // Referer 必须是 embed host origin（manko.fun 必 403）。
    var res = { stream: "", embedOrigin: "" };
    try { res = await resolveWasabiStream(d.wasabi_embed_url); } catch (e3) { res = { stream: "", embedOrigin: "" }; }
    var stream = res.stream;
    if (!stream) stream = t(d.wasabi_url_1);
    if (!stream) return [];
    var ref = res.embedOrigin ? res.embedOrigin + "/" : SITE + "/";
    if (await hlsLive()) {
      return [{ name: "Manko 720p", url: HLS + "/play.m3u8?u=" + encodeURIComponent(stream) + "&r=" + encodeURIComponent(ref), playerType: "system" }];
    }
    return [{ name: "Manko 720p", url: stream, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": ref } }];
  }
  if (leg === "missav" || leg === "missav-auto") {
    // 直连行 + Worker 行双行：直链分片若要 Referer，播放器不转发，Worker 行兜底。
    var mv = t(d.missav_video);
    if (!mv) return [];
    var u = mv;
    if (leg === "missav-auto") {
      if (!/\/\d+p\/video\.m3u8$/i.test(mv)) return [];
      u = mv.replace(/\/\d+p\/video\.m3u8$/i, "/playlist.m3u8");
    }
    var label = leg === "missav-auto" ? "MissAV 自动" : "MissAV";
    var mrows = [{ name: label, url: u, playerType: "system" }];
    try {
      if (await hlsLive()) {
        mrows.push({ name: label + "·中转", url: workerUrl(u, "https://missav.com/"), playerType: "system" });
      }
    } catch (e) { /* ignore */ }
    return mrows;
  }
  if (leg === "mmtv") {
    var u2 = t(d.mmtv_m3u8);
    if (!u2) return [];
    var trows = [];
    try {
      if (await hlsLive()) {
        trows.push({ name: "7MMTV", url: workerUrl(u2, "https://7mmtv.sx/"), playerType: "system" });
      }
    } catch (e) { /* ignore */ }
    trows.push({ name: "7MMTV·直连", url: u2, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": "https://7mmtv.sx/" } });
    return trows;
  }
  // u18：Upload18 播放器页，交播放器嗅探。
  var u3 = Array.isArray(d.upload18_player) ? t(d.upload18_player[0]) : "";
  if (!u3) return [];
  return [{ name: "Upload18", url: u3, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": SITE + "/" } }];
}
