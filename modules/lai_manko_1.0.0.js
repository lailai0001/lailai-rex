// Manko for REX (lai_manko v1.0.0)
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
  description: "Manko：最新 + 8 热门体裁 + 最受欢迎/最高评分/有字幕/随机，体裁/厂商筛选，四线播放（Manko 720p/MissAV/7MMTV/Upload18）",
  author: "lai",
  version: "1.0.0",
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
  ]
};

var API_HOSTS = ["https://healertanker.com", "https://alpharomeo.shop"];
var SITE = "https://manko.fun";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
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

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    var id = t(raw);
    if (id.indexOf("manko:") === 0) id = id.slice(6);
    if (!id) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var d = await apiDetail(id);
    if (!d) return { id: id, type: "url", title: "详情获取失败", description: "无此内容" };
    var name = titleOf(d, id);
    var pic = t(d.cover_image) || "";
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    var addEp = function (title, lid, videoUrl, playerType, customHeaders) {
      eps.push({ name: title, link: lid });
      seasonEps.push({ title: title, videoUrl: videoUrl || "", episodeNumber: eps.length });
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
    // 退 wasabi_url_1 直链）。/stream 须现取，详情只留懒解析入口。
    if (d.wasabi_embed_url || d.wasabi_url_1) {
      addEp("Manko 720p", "@@MK:" + id + ":wasabi", "", "system", null);
    }
    // 分组 2：MissAV 自动 + 数据档。档位取自详情数据原给的地址（逐部不同，
    // 写死 720p 会标错）；自动是同 uuid 的 playlist.m3u8 主播单。
    if (d.missav_video) {
      var mv = t(d.missav_video);
      var resM = mv.match(/\/(1080p|720p|480p|360p)\/video\.m3u8$/i);
      var resLabel = resM ? resM[1] : "720p";
      if (resM) {
        var auto = mv.replace(/\/\d+p\/video\.m3u8$/i, "/playlist.m3u8");
        addEp("MissAV 自动", "@@MK:" + id + ":missav-auto", auto, "system", null);
      }
      addEp("MissAV " + resLabel, "@@MK:" + id + ":missav", mv, "system", null);
    }
    // 分组 3：7MMTV（mmtv_m3u8 直链；分片须带 7mmtv.sx Referer；先验活，死的直接不出线）。
    if (d.mmtv_m3u8) {
      if (await mmtvAlive(t(d.mmtv_m3u8))) {
        addEp("7MMTV", "@@MK:" + id + ":mmtv", t(d.mmtv_m3u8), "system", { "User-Agent": UA, "Referer": "https://7mmtv.sx/" });
      }
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
  var d = await apiDetail(vid);
  if (!d) return [];
  if (leg === "wasabi") {
    // Referer 必须是 embed host origin（manko.fun 必 403）。
    var res = await resolveWasabiStream(d.wasabi_embed_url);
    var stream = res.stream;
    if (!stream) stream = t(d.wasabi_url_1);
    if (!stream) return [];
    var ref = res.embedOrigin ? res.embedOrigin + "/" : SITE + "/";
    return [{ name: "Manko 720p", url: stream, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": ref } }];
  }
  if (leg === "missav" || leg === "missav-auto") {
    // 不带 Referer 头（与仓内 missav.js 一致：裸返 m3u8，真机可播）。
    var mv = t(d.missav_video);
    if (!mv) return [];
    var u = mv;
    if (leg === "missav-auto") {
      if (!/\/\d+p\/video\.m3u8$/i.test(mv)) return [];
      u = mv.replace(/\/\d+p\/video\.m3u8$/i, "/playlist.m3u8");
    }
    var label = leg === "missav-auto" ? "MissAV 自动" : "MissAV";
    return [{ name: label, url: u, playerType: "system" }];
  }
  if (leg === "mmtv") {
    var u2 = t(d.mmtv_m3u8);
    if (!u2) return [];
    return [{ name: "7MMTV", url: u2, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": "https://7mmtv.sx/" } }];
  }
  // u18：Upload18 播放器页，交播放器嗅探。
  var u3 = Array.isArray(d.upload18_player) ? t(d.upload18_player[0]) : "";
  if (!u3) return [];
  return [{ name: "Upload18", url: u3, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": SITE + "/" } }];
}
