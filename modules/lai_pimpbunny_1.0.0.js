// PimpBunny for REX (lai_pimpbunny v1.0.0)
// 移植自 mira-cat 蜘蛛 py_pimpbunny.js（只读蓝图）。
// 站：列表/详情 https://pimpbunny.net，视频页 https://pimpbunny.com。
// 分类：最新 + 分类（20 卡）/ 标签（41 卡）/ 模特（29 卡），子分类做筛选卡片。
// 封面：走 .net host + -640x360 缩略变体（.com 原图真机空白，v8 已证伪）。
// 档位：.net 详情页 <video> 的 4 条 label 共用同一 /stream 地址（假菜单）；
//   真实档位在 .com 视频页 kt_player 配置里：video_url=360p、video_alt_url=480p、
//   video_alt_url2=720p、video_alt_url3=1080p、video_alt_url4=1440p。
// 播放：首选 pimpbunny-stream Worker v2 /play 自铸整链（已部署，验过 206 video/mp4；
//   猫源 v9 用户真机确认可播）。Worker /play 探通（206/200 + video/*）即出线；
//   探不通才回落：现铸 .com 档位直链 -> 详情时刻令牌 -> 嗅探 .com 页。
//   绝不嗅探 .net 页（v2 真机已证死）。jina 只取档位名，旧令牌绝不交给播放器。
// 搜索：/?s=<wd>，空结果仍渲染 20 条推荐，须以 "0 video found" 判空。

WidgetMetadata = {
  id: "lai_pimpbunny",
  title: "PimpBunny",
  description: "PimpBunny：OnlyFans 泄露站，最新 + 分类/标签/模特筛选，真实 360p-1440p 五档，走 pimpbunny-stream Worker /play 自铸播放",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://pimpbunny.net",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "分类", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "cats" }, { name: "sub", title: "分类", type: "enumeration", value: "4k", enumOptions: [{"title": "4K", "value": "4k"}, {"title": "Anal", "value": "anal"}, {"title": "Asian", "value": "asian"}, {"title": "BBC", "value": "bbc"}, {"title": "BDSM", "value": "bdsm"}, {"title": "Big Ass", "value": "big-ass"}, {"title": "Big Boobs", "value": "big-boobs"}, {"title": "Bizarre", "value": "bizarre"}, {"title": "Blowjob", "value": "blowjob"}, {"title": "Bunnies", "value": "bunnies"}, {"title": "Cosplay", "value": "cosplay"}, {"title": "Cosplayer", "value": "cosplayer"}, {"title": "Deep Throat", "value": "deep-throat"}, {"title": "Double Penetration", "value": "double-penetration"}, {"title": "Exclusive", "value": "exclusive"}, {"title": "Feet", "value": "feet"}, {"title": "Fetish", "value": "fetish"}, {"title": "Japanese", "value": "japanese"}, {"title": "Latina", "value": "latina"}, {"title": "Lesbian", "value": "lesbian"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "标签", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "tags" }, { name: "sub", title: "标签", type: "enumeration", value: "doggy-style", enumOptions: [{"title": "Doggy Style", "value": "doggy-style"}, {"title": "Tattoos", "value": "tattoos"}, {"title": "Ass", "value": "ass"}, {"title": "POV Blowjob", "value": "pov-blowjob"}, {"title": "Missionary", "value": "missionary"}, {"title": "Pussy Play", "value": "pussy-play"}, {"title": "Pussy Rubbing", "value": "pussy-rubbing"}, {"title": "Cute", "value": "cute"}, {"title": "Natural Body", "value": "natural-body"}, {"title": "Dildo Riding", "value": "dildo-riding"}, {"title": "Solo Masturbation", "value": "solo-masturbation"}, {"title": "Brunette", "value": "brunette"}, {"title": "Natural Tits", "value": "natural-tits"}, {"title": "Anal Dildoing", "value": "anal-dildoing"}, {"title": "Butt Plug", "value": "butt-plug"}, {"title": "Big Tits", "value": "big-tits"}, {"title": "Anal Creampie", "value": "anal-creampie"}, {"title": "Solo Dildo", "value": "solo-dildo"}, {"title": "BWC", "value": "bwc"}, {"title": "Cowgirl", "value": "cowgirl"}, {"title": "Anal Play", "value": "anal-play"}, {"title": "Blonde", "value": "blonde"}, {"title": "Solo Girl", "value": "solo-girl"}, {"title": "Reverse Cowgirl", "value": "reverse-cowgirl"}, {"title": "Shaved Pussy", "value": "shaved-pussy"}, {"title": "Fingering", "value": "fingering"}, {"title": "Amateur", "value": "amateur"}, {"title": "Anal Plug", "value": "anal-plug"}, {"title": "POV Anal", "value": "pov-anal"}, {"title": "Pink Pussy", "value": "pink-pussy"}, {"title": "Cumshot", "value": "cumshot"}, {"title": "Petite", "value": "petite"}, {"title": "Big Lips", "value": "big-lips"}, {"title": "Small Tits", "value": "small-tits"}, {"title": "Big Pussy", "value": "big-pussy"}, {"title": "Dick Riding", "value": "dick-riding"}, {"title": "Anal Masturbation", "value": "anal-masturbation"}, {"title": "Cum", "value": "cum"}, {"title": "Side Fuck", "value": "side-fuck"}, {"title": "Big Cock", "value": "big-cock"}, {"title": "Anal Solo", "value": "anal-solo"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "模特", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分类", type: "constant", value: "actors" }, { name: "sub", title: "模特", type: "enumeration", value: "abbie-sykes", enumOptions: [{"title": "Abbie Sykes", "value": "abbie-sykes"}, {"title": "Missslily", "value": "missslily"}, {"title": "Dredd", "value": "dredd"}, {"title": "Anna Ralphs", "value": "anna-ralphs"}, {"title": "Devon Jenelle", "value": "devon-jenelle"}, {"title": "Rusitaok", "value": "rusitaok"}, {"title": "Angela White", "value": "angela-white"}, {"title": "Daria Angel", "value": "daria-angel"}, {"title": "Vivienne Vo", "value": "vivienne-vo"}, {"title": "Kwini Kim", "value": "kwini-kim"}, {"title": "PanteraNika", "value": "panteranika"}, {"title": "Little Tina", "value": "little-tina"}, {"title": "Skylar Vox", "value": "skylar-vox"}, {"title": "Aluraye", "value": "aluraye"}, {"title": "Lola Rose", "value": "lola-rose"}, {"title": "Myelliqueen", "value": "myelliqueen"}, {"title": "Purple Bitch", "value": "purple-bitch"}, {"title": "Taylor Banks", "value": "taylor-banks"}, {"title": "Cherry Apricot", "value": "cherry-apricot"}, {"title": "Eden Ivy", "value": "eden-ivy"}, {"title": "Lulu Wild", "value": "lulu-wild"}, {"title": "Agatha Vega", "value": "agatha-vega"}, {"title": "Lilwaifulia", "value": "lilwaifulia"}, {"title": "Madiiitay", "value": "madiiitay"}, {"title": "Elle Brooke", "value": "elle-brooke"}, {"title": "Xxxmilamonet", "value": "xxxmilamonet"}, {"title": "Poetryandcherry", "value": "poetryandcherry"}, {"title": "Eimi Girl", "value": "eimi-girl"}, {"title": "Gabbie Carter", "value": "gabbie-carter"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var SITE = "https://pimpbunny.net";
var COM = "https://pimpbunny.com";
var STREAM_WORKER = "https://pimpbunny-stream.li768435813.workers.dev";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/604.1.14 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1";
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

// 纯 JS base64 解码（URL-safe 兼容），返回 UTF-8 字符串
function b64decode(s) {
  try {
    s = String(s || "").replace(/-/g, "+").replace(/_/g, "/").replace(/\s+/g, "");
    while (s.length % 4) s += "=";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var rev = {};
    for (var i = 0; i < chars.length; i++) rev[chars.charAt(i)] = i;
    var bytes = [];
    for (var j = 0; j < s.length; j += 4) {
      var a = rev[s.charAt(j)] || 0;
      var b = rev[s.charAt(j + 1)] || 0;
      var c = s.charAt(j + 2) === "=" ? 0 : (rev[s.charAt(j + 2)] || 0);
      var d = s.charAt(j + 3) === "=" ? 0 : (rev[s.charAt(j + 3)] || 0);
      bytes.push((a << 2) | (b >> 4));
      if (s.charAt(j + 2) !== "=") bytes.push(((b & 15) << 4) | (c >> 2));
      if (s.charAt(j + 3) !== "=") bytes.push(((c & 3) << 6) | d);
    }
    var out = "";
    for (var k = 0; k < bytes.length; k++) {
      var by = bytes[k];
      if (by < 128) { out += String.fromCharCode(by); continue; }
      var extra = (by >= 224 ? 2 : (by >= 192 ? 1 : 0));
      var code = by & (extra === 2 ? 15 : 31);
      for (var e2 = 1; e2 <= extra && k + e2 < bytes.length; e2++) {
        code = (code << 6) | (bytes[k + e2] & 63);
      }
      k += extra;
      out += String.fromCharCode(code);
    }
    return out;
  } catch (e) { return ""; }
}

function fixUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return SITE + u;
  return SITE + "/" + u;
}

function coverUrl(u) {
  var fixed = fixUrl(u);
  if (fixed.indexOf("https://pimpbunny.com/") === 0) {
    fixed = "https://pimpbunny.net/" + fixed.slice("https://pimpbunny.com/".length);
  }
  var m = fixed.match(/^(https:\/\/pimpbunny\.net\/wp-content\/uploads\/.*)(\.(?:jpe?g|png|webp))$/i);
  if (m && m[1].indexOf("-640x360") < 0) return m[1] + "-640x360" + m[2];
  return fixed;
}

function isShield(html) {
  if (!html || typeof html !== "string") return true;
  if (html.length < 2000) return true;
  if (/Establishing a secure connection/i.test(html.slice(0, 3000))) return true;
  return false;
}

async function getText(url, referer) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Referer": referer || SITE + "/",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    if (!body || isShield(body)) return "";
    return body;
  } catch (e) { return ""; }
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function parseList(html) {
  var list = [];
  if (!html) return list;
  var re = /<article[^>]*class="thumb-block[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var seg = m[1];
    var href = seg.match(/<a\s+href="([^"]+)"/);
    var title = seg.match(/<span\s+class="title">([^<]+)<\/span>/);
    if (!href || !title) continue;
    var id = fixUrl(href[1]);
    var name = decodeHtml(title[1]);
    if (!id || !name) continue;
    var img = seg.match(/<img[^>]*src="([^"]+)"/);
    var dur = seg.match(/class="duration"[^>]*>([^<]+)</);
    list.push({
      id: id,
      type: "url",
      title: name,
      posterPath: img ? coverUrl(img[1]) : "",
      coverUrl: img ? coverUrl(img[1]) : "",
      backdropPath: img ? coverUrl(img[1]) : "",
      link: id,
      description: dur ? t(dur[1]) : "",
      mediaType: "movie"
    });
  }
  return list;
}

function listUrl(base, page) {
  page = Math.max(1, parseInt(page, 10) || 1);
  if (page <= 1) return base + "?filter=latest";
  return base + "page/" + page + "/?filter=latest";
}

var ZONE_DEFAULT = { latest: "", cats: "4k", tags: "doggy-style", actors: "abbie-sykes" };

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "latest");
  var sub = t(params.sub || "") || ZONE_DEFAULT[zone] || "";
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var base = "";
  if (zone === "latest") base = SITE + "/";
  else if (zone === "cats") base = SITE + "/" + sub + "/";
  else if (zone === "tags") base = SITE + "/tag/" + sub + "/";
  else if (zone === "actors") base = SITE + "/actor/" + sub + "/";
  else return emptyItem("未知分类");
  try {
    var html = await getText(listUrl(base, page));
    var list = parseList(html);
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
    var url = SITE + "/?s=" + encodeURIComponent(wd);
    if (page > 1) url = SITE + "/page/" + page + "/?s=" + encodeURIComponent(wd);
    var html = await getText(url);
    if (html && /search-video-number">\s*0\s+video/i.test(html)) return emptyItem();
    var list = parseList(html);
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

// 从 /stream 地址解出 .com 视频页：
//   旧式 /stream/video.mp4?v=<b64>，新式 /stream/<b64>.mp4，解开即 https://pimpbunny.com/videos/<slug>/
function comVideoFromStream(stream) {
  try {
    var m = String(stream || "").match(/\/stream\/(?:video\.mp4\?v=)?([A-Za-z0-9+/=_-]+)(?:\.mp4)?/i);
    if (!m) return "";
    var dec = b64decode(m[1]);
    if (/^https:\/\/pimpbunny\.com\/videos\/[^/]+\/$/.test(dec)) return dec;
  } catch (e) { /* 不是可解的 /stream 形态 */ }
  return "";
}

// 解析 .com 视频页 kt_player 配置的档位菜单，只收带 v-acctoken 的 get_file 直链
function parseLadder(html) {
  if (!html || html.indexOf("video_url:") < 0 || html.indexOf("get_file/") < 0) return [];
  var texts = {};
  var tre = /(video_url|video_alt_url\d*)_text\s*:\s*'([^']+)'/g;
  var tm;
  while ((tm = tre.exec(html)) !== null) texts[tm[1]] = tm[2];
  var out = [];
  var seen = {};
  var ure = /(video_url|video_alt_url\d*)\s*:\s*'([^']+)'/g;
  var um;
  while ((um = ure.exec(html)) !== null) {
    var furl = um[2];
    if (!/^https:\/\/pimpbunny\.com\/get_file\/[^']*v-acctoken=[A-Za-z0-9%_-]+/.test(furl)) continue;
    if (seen[furl]) continue;
    seen[furl] = 1;
    var label = texts[um[1]] || "";
    var nm = label.match(/(\d+)/);
    var num = nm ? parseInt(nm[1], 10) : 0;
    out.push({ label: label || (num ? num + "p" : "正片"), num: num, url: furl });
  }
  out.sort(function (a, b) { return b.num - a.num; });
  return out;
}

async function getComPage(url) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Referer": COM + "/",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body || "";
  } catch (e) { return ""; }
}

// 直连取 .com 视频页现铸档位（令牌与会话同次渲染才配对）
async function fetchLadderDirect(comVideo) {
  var html = await getComPage(comVideo);
  return parseLadder(html);
}

// jina 取 .com 视频页：只取档位名，令牌是 jina 缓存页铸的旧令牌，绝不直接交给播放器
async function fetchLadderJina(comVideo) {
  try {
    var res = await Widget.http.get("https://r.jina.ai/" + comVideo, {
      headers: {
        "User-Agent": UA,
        "x-respond-with": "html",
        "Accept": "text/html,*/*"
      }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return parseLadder(body || "");
  } catch (e) { return []; }
}

// Worker /play 探针：Range 0-1023，206/200 + video/* 即通
async function probeWorkerPlay(comVideo, labelNum) {
  if (!STREAM_WORKER || !comVideo) return "";
  try {
    var q = labelNum > 0 ? ("&q=" + labelNum) : "";
    var playUrl = STREAM_WORKER + "/play?u=" + encodeURIComponent(comVideo) + q;
    var res = await Widget.http.get(playUrl, {
      headers: {
        "User-Agent": UA,
        "Referer": comVideo,
        "Range": "bytes=0-1023",
        "Accept": "video/mp4,video/*;q=0.9,*/*;q=0.8"
      }
    });
    if (!res) return "";
    var status = res.status;
    var ct = "";
    if (res.headers) {
      for (var k in res.headers) {
        if (String(k).toLowerCase() === "content-type") { ct = String(res.headers[k] || ""); break; }
      }
    }
    if ((status === 206 || status === 200) && /video\//i.test(ct)) return playUrl;
    // 状态码不可用时：返回了非 JSON 错误体即视为通（Worker 失败时回 502 JSON）
    if ((status == null || status === 0) && res.data && typeof res.data === "string" && res.data.length > 0 && res.data.charAt(0) !== "{") return playUrl;
  } catch (e) { /* 探不通 */ }
  return "";
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var pageUrl = fixUrl(raw);
    var html = await getText(pageUrl, SITE + "/");
    if (!html) return { id: pageUrl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = "";
    var hm = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (hm) name = decodeHtml(hm[1].replace(/<[^>]+>/g, ""));
    if (!name) return { id: pageUrl, type: "url", title: "解析失败", description: "无标题" };
    var pic = "";
    var posterM = html.match(/<video[^>]*poster="([^"]+)"/)
      || html.match(/property="og:image"\s+content="([^"]+)"/);
    if (posterM) pic = coverUrl(posterM[1]);
    var content = "";
    var dm = html.match(/<meta\s+itemprop="description"\s+content="([^"]+)"/);
    if (dm) content = decodeHtml(dm[1]);
    var dur = "";
    var dum = html.match(/itemprop="duration"\s+content="([^"]+)"/);
    if (dum) dur = dum[1];
    // 播放源：<video id="wpst-video"> 块内全部 <source>，去重后只剩 1 条 /stream
    var stream = "";
    var vBlock = html.match(/<video[^>]*id="wpst-video"[^>]*>([\s\S]*?)<\/video>/)
      || html.match(/<video[^>]*>([\s\S]*?)<\/video>/);
    if (vBlock) {
      var sre = /<source[^>]*src="([^"]+)"[^>]*>/g;
      var sm;
      var srcs = [];
      while ((sm = sre.exec(vBlock[1])) !== null) {
        var u = fixUrl(sm[1]);
        if (u && srcs.indexOf(u) < 0) srcs.push(u);
      }
      stream = srcs[0] || "";
    }
    if (!stream) {
      var src2 = html.match(/<source[^>]*src="([^"]+stream\/video\.mp4[^"]*)"/)
        || html.match(/<source[^>]*src="([^"]+\.mp4[^"]*)"/);
      if (src2) stream = fixUrl(src2[1]);
    }
    var comVideo = stream ? comVideoFromStream(stream) : "";
    var epsList = [];
    var epItems = [];
    var seasonEps = [];
    function addEp(label, lazyUrl, num) {
      epsList.push({ name: label, link: lazyUrl });
      seasonEps.push({ title: label, episodeNumber: num || 0 });
      epItems.push({
        id: lazyUrl,
        type: "url",
        title: label,
        mediaType: "movie",
        posterPath: pic,
        link: lazyUrl,
        episode: num || 0,
        episodeNumber: num || 0,
        seasonIndex: 1,
        seasonNumber: 1
      });
    }
    if (comVideo) {
      var ladder = await fetchLadderDirect(comVideo);
      var jinaOnly = false;
      if (!ladder.length) {
        ladder = await fetchLadderJina(comVideo);
        jinaOnly = true;
      }
      if (ladder.length) {
        // jina 档位名可用，但令牌是旧的：懒链接里不带 fileUrl，点播走 Worker /play 现铸
        for (var i = 0; i < ladder.length; i++) {
          var fileUrl = jinaOnly ? "" : ladder[i].url;
          addEp(ladder[i].label, "@@PB:" + comVideo + "|" + ladder[i].label + "|" + fileUrl, ladder[i].num);
        }
      } else {
        addEp("正片", "@@PB:" + comVideo + "|正片|", 0);
      }
    } else if (stream) {
      // /stream 解不出 .com 页：留"正片"懒入口，点播时嗅探详情页
      addEp("正片", "@@PB:DETAIL:" + pageUrl + "|正片|", 0);
    }
    var result = {
      id: pageUrl,
      type: "detail",
      title: name,
      name: name,
      description: content,
      mediaType: "movie",
      link: pageUrl,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      duration: dur,
      playerType: "app"
    };
    if (epsList.length) {
      result.episodes = epsList;
      result.seasons = [{ seasonNumber: 1, title: "清晰度", name: "清晰度", episodes: seasonEps }];
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
  var at = raw.indexOf("@@PB:");
  if (at >= 0) {
    var tok = raw.slice(at + 5);
    var parts = tok.split("|");
    var comVideo = parts[0] || "";
    var label = parts[1] || "正片";
    var fileUrl = parts[2] || "";
    // 详情页嗅探兜底（/stream 解不出 .com 页时）
    if (comVideo.indexOf("DETAIL:") === 0) {
      var detailUrl = comVideo.slice("DETAIL:".length);
      return [{ name: label, url: detailUrl, playerType: "app" }];
    }
    var q = 0;
    var qm = String(label).match(/(\d+)/);
    if (qm) q = parseInt(qm[1], 10) || 0;
    // 腿 0：Worker /play 自铸整链（先探，206 即回）
    if (comVideo) {
      var wp = await probeWorkerPlay(comVideo, q);
      if (wp) {
        return [{ name: label, url: wp, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": comVideo } }];
      }
    }
    // 腿 1：点播时重铸 .com 档位（同次会话令牌），按档位名找
    if (comVideo) {
      var ladder = await fetchLadderDirect(comVideo);
      for (var i = 0; i < ladder.length; i++) {
        if (ladder[i].label === label || (q > 0 && ladder[i].num === q)) {
          return [{ name: label, url: ladder[i].url, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": comVideo } }];
        }
      }
    }
    // 腿 2：详情时刻的令牌直链（可能已过期，仅作备选）
    if (fileUrl && /^https:\/\/pimpbunny\.com\/get_file\//.test(fileUrl)) {
      return [{ name: label, url: fileUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": comVideo } }];
    }
    // 腿 3：嗅探 .com 视频页（绝不嗅探 .net 页）
    if (comVideo) {
      return [{ name: label, url: comVideo, playerType: "app" }];
    }
    return [];
  }
  // 直链 mp4 / m3u8
  if (/\.mp4(\?|#|$)/i.test(raw) || /\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": COM + "/" } }];
  }
  // 兜底：详情页地址 -> 取详情首集
  try {
    var det = await loadDetail(raw);
    var eps2 = det && det.episodeItems;
    if (eps2 && eps2.length) {
      return await loadResource({ link: eps2[0].id });
    }
  } catch (e) { /* fall through */ }
  return [];
}
