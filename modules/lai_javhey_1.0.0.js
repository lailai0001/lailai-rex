// JavHey for REX (lai_javhey v1.0.0)
// 移植自 mira-cat 蜘蛛 py_javhey.js（只读蓝图），后端 https://javhey.com/。
// 印尼语 JAV 字幕站，标题/别名均含番号（如 JUL-788、SONE-054）。
// 列表：首页卡片 <a href="/video/<id>/<slug>"><img src alt></a>，封面为 javmod.com/javorb.com 直链。
// 分类：/category/<id>/<slug>/，翻页 /category/<id>/<slug>/page=N；首页翻页 /videos/paling-baru/page=N；
//   注意分类页 p1 必须无尾斜杠（带尾斜杠站方回 404）。
// 详情：隐藏 input#links 为 base64 编码的 embed 列表（",,," 分隔，12 个 Server）；
//   Server 1 为 javsubindo（页内 var src 直出 m3u8 相对路径）；
//   vidhide 系 embed 为 Dean Edwards packer 混淆，解包后 links.hls3（.txt 主清单，猫源 VM 实测 200 + #EXTM3U）
//   > links.hls2（.m3u8 主清单，VM 侧因出口 IP 被 CDN 回 403，设备侧未证实）> links.hls4。
// 播放：单码率（猫源实测 embedwish 852x480 一档；vidhide 档位标签 720p），不编假多档；各 Server 画质可能不同，故按 Server 分开展示。
// 搜索：站内搜索表单 action="/search"，但实测 /search?q=<任意词>（含无意义词）均原样返回首页 72 项，未做过滤——
//   故 search 不假装有结果，只回一条说明。字幕：猫源字幕芯是猫源专属，REX 版不接。

WidgetMetadata = {
  id: "lai_javhey",
  title: "JavHey",
  description: "JavHey（javhey.com）：印尼语 JAV 字幕站，26 分类 + 多 Server 播放",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://javhey.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "🆕最新视频", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🔥最多观看", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "most" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🎬无码 / 去码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat" }, { name: "cat", title: "分类", type: "enumeration", value: "76/uncensored", enumOptions: [{ title: "无码流出", value: "76/uncensored" }, { title: "无码破解", value: "31/decensored" }, { title: "去码", value: "222/sensor-dihapus" }, { title: "有码", value: "2/censored" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "👙身材精选", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat" }, { name: "cat", title: "分类", type: "enumeration", value: "1/big-tits", enumOptions: [{ title: "巨乳", value: "1/big-tits" }, { title: "巨乳 (印尼)", value: "219/toket-gede" }, { title: "爆乳", value: "15/super-milk" }, { title: "美乳", value: "50/beautiful-breasts" }, { title: "巨乳癖", value: "48/busty-fetish" }, { title: "大屁股", value: "20/big-butt" }, { title: "大屁股 (印尼)", value: "231/pantat-besar" }, { title: "臀部癖", value: "41/ass-fetish" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🎭题材剧情", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat" }, { name: "cat", title: "分类", type: "enumeration", value: "3/creampie", enumOptions: [{ title: "中出", value: "3/creampie" }, { title: "熟女", value: "11/mature-woman" }, { title: "乱伦", value: "10/incest" }, { title: "人妻", value: "9/housewife" }, { title: "阿姨", value: "24/aunt" }, { title: "女教师", value: "59/female-teacher" }, { title: "女学生", value: "42/schoolgirl" }, { title: "口交", value: "33/blowjob" }, { title: "淫荡", value: "14/slut" }, { title: "Cosplay", value: "127/cosplay" }, { title: "女同", value: "152/lesbian" }, { title: "BDSM", value: "67/bdsm" }, { title: "数码马赛克", value: "4/digital-mosaic" }, { title: "高清", value: "5/high-vision" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { id: "loadResource", title: "播放资源", description: "按 Server 出直链播单并附播放头；未解出时重取详情懒解析", functionName: "loadResource", type: "stream", cacheDuration: 0, params: [] }
  ]
};

var HOST = "https://javhey.com";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

// 分类：全部取自站内 /categories 实测（id/slug/名均原文）；中文名为用户点名近义项的诚实映射
var CATS = [
  { v: "76/uncensored", n: "无码流出" },
  { v: "31/decensored", n: "无码破解" },
  { v: "222/sensor-dihapus", n: "去码" },
  { v: "1/big-tits", n: "巨乳" },
  { v: "219/toket-gede", n: "巨乳 (印尼)" },
  { v: "15/super-milk", n: "爆乳" },
  { v: "50/beautiful-breasts", n: "美乳" },
  { v: "48/busty-fetish", n: "巨乳癖" },
  { v: "20/big-butt", n: "大屁股" },
  { v: "231/pantat-besar", n: "大屁股 (印尼)" },
  { v: "41/ass-fetish", n: "臀部癖" },
  { v: "2/censored", n: "有码" },
  { v: "4/digital-mosaic", n: "数码马赛克" },
  { v: "3/creampie", n: "中出" },
  { v: "11/mature-woman", n: "熟女" },
  { v: "10/incest", n: "乱伦" },
  { v: "9/housewife", n: "人妻" },
  { v: "24/aunt", n: "阿姨" },
  { v: "59/female-teacher", n: "女教师" },
  { v: "42/schoolgirl", n: "女学生" },
  { v: "33/blowjob", n: "口交" },
  { v: "14/slut", n: "淫荡" },
  { v: "127/cosplay", n: "Cosplay" },
  { v: "152/lesbian", n: "女同" },
  { v: "67/bdsm", n: "BDSM" },
  { v: "5/high-vision", n: "高清" }
];

function t(v) {
  return String(v == null ? "" : v).trim();
}

function unescapeHtml(s) {
  return String(s || "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); });
}

function cleanLabel(s) {
  return unescapeHtml(String(s || "").replace(/<[^>]+>/g, ""))
    .replace(/[\r\n\t]+/g, " ").replace(/[$#]/g, "").trim();
}

function clean(s) {
  return unescapeHtml(String(s || "").replace(/<[^>]+>/g, ""))
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ").trim();
}

function absUrl(u, host) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return host + u;
  return u;
}

function normUrl(u) {
  var s = t(u);
  if (!s) return "";
  s = s.replace(/^(https?:)\/([^/])/, "$1//$2");
  return s;
}

async function getHtml(path, referer) {
  var url = t(path);
  if (url.indexOf("//") === 0) url = "https:" + url;
  else if (url.charAt(0) === "/") url = HOST + url;
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Referer": referer || HOST + "/",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
      }
    });
    var body = res && res.data != null ? String(res.data) : "";
    return body;
  } catch (e) { return ""; }
}

async function reqRaw(url, referer) {
  try {
    var res = await Widget.http.get(url, {
      headers: { "User-Agent": UA, "Referer": referer || HOST + "/" }
    });
    var body = res && res.data != null ? String(res.data) : "";
    return { status: (res && res.status) || 0, body: body };
  } catch (e) { return { status: 0, body: "" }; }
}

// 首页/分类卡片：<a href="/video/<id>/<slug>"><img src alt></a>；alt 含 "JAV Subtitle Indonesia - <番号> <印尼语标题>"
function parseCards(html, host) {
  var byUrl = {};
  var order = [];
  var re = /<a[^>]+href=["'](\/video\/\d+\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/g;
  var m;
  while ((m = re.exec(String(html || "")))) {
    var vUrl = t(m[1]);
    var inner = m[2];
    var it = byUrl[vUrl];
    if (!it) { it = { id: vUrl, type: "url", title: "", posterPath: "", coverUrl: "", backdropPath: "", link: vUrl, description: "", mediaType: "movie" }; byUrl[vUrl] = it; order.push(vUrl); }
    var imgM = inner.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (imgM && !it.posterPath) {
      var pic = normUrl(absUrl(t(imgM[1]), host));
      it.posterPath = pic; it.coverUrl = pic; it.backdropPath = pic;
    }
    var altM = inner.match(/alt=["']([^"']+)["']/i);
    var txt = cleanLabel(altM ? altM[1] : inner);
    if (txt && !it.title) it.title = txt.replace(/^JAV Subtitle Indonesia\s*-\s*/i, "");
    // alt 常被标题内的双引号截断成 bare 番号（如 "ATID-710"）：此时用 URL slug 补全标题
    if (!it.title || /^[A-Z0-9]{2,10}-\d{2,8}$/i.test(it.title)) {
      var slug = (vUrl.split("/")[3] || "").replace(/^[a-z0-9]{2,10}-\d{2,8}-/i, "").replace(/-/g, " ").trim();
      if (slug) it.title = (it.title ? it.title + " " : "") + slug;
    }
    if (!it.title) it.title = "精彩视频";
  }
  var out = [];
  for (var i = 0; i < order.length; i++) {
    var item = byUrl[order[i]];
    if (item.posterPath || item.title) out.push(item);
  }
  return out;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "home");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var path = "";
  if (zone === "most") {
    path = page === 1 ? "/videos/paling-dilihat" : ("/videos/paling-dilihat/page=" + page);
  } else if (zone === "cat") {
    var cat = t(params.cat || "");
    if (!cat) return emptyItem();
    path = page === 1 ? ("/category/" + cat) : ("/category/" + cat + "/page=" + page);
  } else {
    path = page === 1 ? "/" : ("/videos/paling-baru/page=" + page);
  }
  try {
    var html = await getHtml(path);
    var list = parseCards(html, HOST);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

async function search(params) {
  // 站内搜索未做过滤（任意查询均返回首页），返回说明，不伪造结果
  return [{ id: "tip", type: "url", title: "站内搜索未做过滤，暂不支持搜索，请用分类浏览" }];
}

// ---- embed 解析 ----
// 纯 JS base64 解码（REX 沙箱无 Buffer / TextDecoder，不依赖 atob）
function b64decode(b64) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var s = String(b64 || "").replace(/[^A-Za-z0-9+/=]/g, "");
  var out = "";
  var i = 0;
  while (i < s.length) {
    var c1 = chars.indexOf(s.charAt(i++));
    var c2 = chars.indexOf(s.charAt(i++));
    var c3 = chars.indexOf(s.charAt(i++));
    var c4 = chars.indexOf(s.charAt(i++));
    if (c1 < 0 || c2 < 0) break;
    var n = (c1 << 18) | (c2 << 12) | ((c3 & 63) << 6) | (c4 & 63);
    out += String.fromCharCode((n >> 16) & 255);
    if (c3 !== 64 && c3 >= 0) out += String.fromCharCode((n >> 8) & 255);
    if (c4 !== 64 && c4 >= 0) out += String.fromCharCode(n & 255);
  }
  // base64 的字节流是 UTF-8：还原多字节字符（无 TextDecoder 的手工解码）
  var utf8 = "";
  var j = 0;
  while (j < out.length) {
    var b = out.charCodeAt(j);
    if (b < 128) { utf8 += out.charAt(j); j += 1; }
    else if (b > 191 && b < 224 && j + 1 < out.length) {
      utf8 += String.fromCharCode(((b & 31) << 6) | (out.charCodeAt(j + 1) & 63)); j += 2;
    } else if (b > 223 && b < 240 && j + 2 < out.length) {
      utf8 += String.fromCharCode(((b & 15) << 12) | ((out.charCodeAt(j + 1) & 63) << 6) | (out.charCodeAt(j + 2) & 63)); j += 3;
    } else { utf8 += out.charAt(j); j += 1; }
  }
  return utf8;
}

// vidhide 系 packer 解包：eval(function(p,a,c,k,e,d){while(c--)if(k[c])p=p.replace(...)}('...',a,c,'...'.split('|')))
function unpackVidhide(html) {
  var m = String(html || "").match(/eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?return p\}\('([\s\S]*?)',(\d+),(\d+),'(.*?)'\.split\('\|'\)/);
  if (!m) return "";
  var p = m[1];
  var a = parseInt(m[2], 10);
  var c = parseInt(m[3], 10);
  var k = m[4].split("|");
  if (!a || !c || !k.length) return "";
  var out = p.replace(/\b[0-9a-zA-Z]+\b/g, function (w) {
    var n = parseInt(w, a);
    if (isNaN(n) || n >= c || !k[n]) return w;
    return k[n];
  });
  // 解包文本里引号常带反斜杠转义（qualityLabels\':{\"616\":\"720p\"}），先还原再提取
  return out.replace(/\\(['"])/g, "$1");
}

function embedHostLabel(embedUrl) {
  var h = "";
  try {
    var hm = String(embedUrl).match(/^https?:\/\/([^/]+)/);
    h = hm ? hm[1].replace(/^www\./, "") : "";
  } catch (e) { h = ""; }
  var map = { "javsubindo.world": "JavSubIndo", "embedwish.com": "EmbedWish", "vidhidepre.com": "VidHide", "morencius.com": "Morencius", "hgplaycdn.com": "HgPlay", "dood.li": "Dood", "dropload.io": "Dropload", "mixdrop.to": "MixDrop", "bestx.stream": "BestX", "d000d.com": "D000D" };
  return map[h] || h || "Server";
}

// 解析单个 embed 页，返回直链候选 [{url, label}]（label 仅当解包给出 qualityLabels 时才有，绝不编造）
async function resolveEmbed(embedUrl, referer) {
  var out = [];
  function push(url, label) {
    url = normUrl(t(url));
    if (!url || !/^https?:\/\//.test(url)) return;
    for (var i = 0; i < out.length; i++) { if (out[i].url === url) return; }
    out.push({ url: url, label: label || "" });
  }
  var r = await reqRaw(embedUrl, referer);
  if (r.status !== 200 || !r.body) return out;
  var html = r.body;
  var base = String(embedUrl).replace(/^(https?:\/\/[^/]+).*$/, "$1");
  // JavSubIndo：页内 var src = "/s/<ts>/<hash>/<id>/index.m3u8"
  var srcM = html.match(/var\s+src\s*=\s*"([^"]*index\.m3u8[^"]*)"/);
  if (srcM) push(absUrl(srcM[1].replace(/\\/g, ""), base), "");
  // vidhide 系：解包后 links.hls3 > hls2 > hls4
  var unpacked = unpackVidhide(html);
  if (unpacked) {
    var qM = unpacked.match(/qualityLabels['"]?\s*:\s*\{[^}]*"([^"]+)"\s*:\s*"([^"]+)"/);
    var qLabel = qM ? qM[2] : "";
    var hls3 = unpacked.match(/"hls3"\s*:\s*"([^"]+)"/);
    var hls2 = unpacked.match(/"hls2"\s*:\s*"([^"]+)"/);
    var hls4 = unpacked.match(/"hls4"\s*:\s*"([^"]+)"/);
    if (hls3) push(hls3[1].replace(/\\/g, ""), qLabel);
    if (hls2) push(hls2[1].replace(/\\/g, ""), qLabel);
    if (hls4) push(absUrl(hls4[1].replace(/\\/g, ""), base), qLabel);
  }
  // 通用兜底：页内直出的 m3u8/mp4（dood 系为 Turnstile 验证墙，不在此硬解）
  var re = /https?:\/\/[^\s"'<>]+\.(?:m3u8|mp4)(?:\?[^\s"'<>]*)?/g;
  var gm;
  while ((gm = re.exec(html))) {
    if (!/\.js|\.css/.test(gm[0])) push(gm[0], "");
  }
  return out;
}

// 详情页隐藏 input#links：base64 -> embed URL 列表（",,," 分隔）
function extractEmbeds(html) {
  var m = String(html || "").match(/id=["']links["'][^>]*value=["']([^"']+)["']/);
  if (!m) return [];
  var dec = "";
  try { dec = b64decode(m[1]); } catch (e) { return []; }
  var parts = dec.split(",,,");
  var out = [];
  for (var i = 0; i < parts.length; i++) {
    var s = t(parts[i]);
    if (/^https?:\/\//.test(s)) out.push(s);
  }
  return out;
}

function detailPath(link) {
  var s = t(link);
  if (!s) return "";
  var m = s.match(/\/video\/\d+\/[^/?#]*/);
  if (m) return m[0];
  return s;
}

async function loadDetail(link) {
  try {
    var path = detailPath(link);
    if (!path) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var durl = path.indexOf("http") === 0 ? path : HOST + path;
    var html = await getHtml(path);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var h1M = html.match(/<h1\s+class=["']product_title["']>([\s\S]*?)<\/h1>/i);
    var mainTitle = "精彩视频";
    if (h1M) mainTitle = cleanLabel(h1M[1]).replace(/^JAV Subtitle Indonesia\s*-\s*/i, "").trim() || "精彩视频";
    var posterPic = "";
    var imgRe = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    var im;
    while ((im = imgRe.exec(html))) {
      if (im[0].indexOf("AjaxLoader") >= 0) continue;
      var src = t(im[1]);
      if (src && (/^https?:\/\//.test(src) || src.indexOf("//") === 0)) { posterPic = normUrl(absUrl(src, HOST)); break; }
    }
    var embeds = extractEmbeds(html);
    var epLinks = [];
    var childItems = [];
    if (embeds.length) {
      var jobs = [];
      for (var ei = 0; ei < Math.min(embeds.length, 6); ei++) {
        jobs.push((function (emb) {
          return (async function () {
            try {
              var streams = await resolveEmbed(emb, durl);
              return { label: embedHostLabel(emb), emb: emb, streams: streams };
            } catch (e) { return { label: embedHostLabel(emb), emb: emb, streams: [] }; }
          })();
        })(embeds[ei]));
      }
      var settled = await Promise.all(jobs);
      var options = [];
      for (var si = 0; si < settled.length; si++) {
        var sv = settled[si];
        if (sv.streams.length) {
          // .txt 主清单先验活（能取到 #EXTM3U 的排前面；验活失败不删选项，只排后，设备侧网络与 VM 不同）
          for (var ci = 0; ci < Math.min(sv.streams.length, 2); ci++) {
            var st = sv.streams[ci];
            var rank = st.url.indexOf(".txt") >= 0 ? 1 : 2;
            if (st.url.indexOf(".txt") >= 0) {
              try {
                var vr = await reqRaw(st.url, durl);
                if (vr.status === 200 && vr.body.indexOf("#EXTM3U") >= 0) rank = 0;
              } catch (e) { /* 保持 rank 1 */ }
            }
            var nm = sv.label + (st.label ? "·" + st.label : "");
            options.push({ name: nm, id: st.url, rank: rank });
          }
        } else {
          // 该 Server 本次未解出直链：保留懒解析选项，play 时再解一次
          options.push({ name: sv.label, id: durl + "@@EMBED:" + sv.emb, rank: 3 });
        }
      }
      if (!options.length) {
        for (var oi = 0; oi < Math.min(embeds.length, 6); oi++) {
          options.push({ name: embedHostLabel(embeds[oi]), id: durl + "@@EMBED:" + embeds[oi], rank: 3 });
        }
      }
      // 排序：已验活 .txt > 未验活 .txt > .m3u8 > 懒解析（同 rank 保持 Server 顺序）
      options.sort(function (a, b) { return a.rank - b.rank; });
      for (var oi2 = 0; oi2 < options.length; oi2++) {
        var o = options[oi2];
        epLinks.push({ name: o.name, link: o.id });
        childItems.push({ id: o.id, title: mainTitle + " " + o.name, name: o.name, mediaType: "movie", link: o.id });
      }
    }
    var result = {
      id: durl,
      type: "url",
      title: mainTitle,
      name: mainTitle,
      description: "JavHey",
      mediaType: "movie",
      link: durl,
      coverUrl: posterPic,
      posterPath: posterPic,
      backdropPath: posterPic,
      playerType: "app"
    };
    if (epLinks.length) {
      result.episodes = epLinks;
      result.episodeItems = childItems;
      result.childItems = childItems;
    } else {
      result.description = "未找到播放地址";
    }
    return result;
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

function isVideoFormat(url) {
  var low = String(url || "").toLowerCase();
  return low.indexOf(".m3u8") >= 0 || low.indexOf(".mp4") >= 0 || low.indexOf(".txt") >= 0 || low.indexOf(".flv") >= 0 || low.indexOf(".ts") >= 0;
}

async function loadResource(params) {
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 懒解析：detail 未能预解时，play 时重取详情、逐个 Server 解直链
  var at = raw.indexOf("@@EMBED:");
  if (at >= 0) {
    var durl = raw.slice(0, at);
    var emb0 = raw.slice(at + 8);
    try {
      var html = await getHtml(durl.replace(HOST, ""));
      var embeds = extractEmbeds(html);
      var ordered = [emb0];
      for (var i = 0; i < embeds.length; i++) { if (embeds[i] !== emb0) ordered.push(embeds[i]); }
      for (var j = 0; j < Math.min(ordered.length, 6); j++) {
        var streams = await resolveEmbed(ordered[j], durl);
        if (streams.length) {
          return [{ name: embedHostLabel(ordered[j]), url: streams[0].url, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
        }
      }
      // 实在解不出：把 embed 页本身交给播放器兜底
      return [{ name: embedHostLabel(emb0), url: emb0, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl } }];
    } catch (e) {
      return [{ name: "Server", url: emb0, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": durl } }];
    }
  }
  if (!isVideoFormat(raw)) return [];
  return [{ name: "播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
}
