// v1.0.2（2026-11-16）：与本批同类问题同款收敛——详情顶层去掉 videoUrl 与
//   playerType "app"（只集里带地址，避免 App 按顶层地址播、丢集的 Referer）；
//   loadResource 死线路（embed 404）时回详情页网页播放行，不再回 []。
//   列表空的 1.0.1 根因（getText 只认 res.status）已修，本轮未再报障，
//   仅做上述两处同款收敛。
// OpenLoad for REX (lai_openload v1.0.1)
// v1.0.1（2026-11-16）：修列表全空——根因是 getText 只认 res.status === 200，
// REX 运行时回 statusCode（无 status 字段），好内容全被丢弃（harness 双形态复现）。
// 改法：状态码双字段兼容 + body 非空即成功 + 3 次重试 + Accept/Accept-Language 头；
// HTML 取不到时走 WP REST 兜底（7 个 WP 分类 id 实测）；ST token 正则补 <>；
// DEAD_HOSTS 补 streamsb.net；VS 走下载 API 出真实三档（get 地址直交播放器跟 302）。
// WordPress 聚合站 https://openload.mov：汇总视频分享站（StreamHG / VidHide / Streamtape /
// DoodStream 等）的 embed。站内分类 7 个（最新 / モザイク除去 / アダルトビデオ / 無修正 /
// 素人AV / 素人投稿 / VR）+ 急上昇 / 人気 两个榜单页；标签筛选为站内前 40 热门标签。
// 详情：packed JS（Dean Edwards）里是各集各线路的 iframe；自研纯 JS 解包器（无 eval，
// 8 个实采样本与 node eval 输出逐字节一致）；集数/线路标签从 #episode / #server 读。
// 播放铁律：loadDetail 把最终可播地址直接写进每集 episodeItem 的 videoUrl（playerType "system"），
// 不留懒解析记号；loadResource 只作回落、永不抛错。
// 解析链（实测）：StreamHG 系（iplayerhls / callistanise / minochinos / streamhide / likessb /
// sbstream）取 links.hls2 签名 master；档位读 embed 页 qualityLabels 最高档（单档文件如
// iplayerhls 720p、callistanise 1080p——变体 200 + 首分片 Range 206 + 首字节 0x47 已验；
// urlset 母带如 {"3102":"1080p","1653":"720p","776":"480p"} 是一档含多变体，行名标最高档，
// 播放器内自选，不拆行）；streamtape 取 robotlink 拼 get_video（VM 直连 000，手机待验）；
// 是真地址）；asianclub.tv（已停放）与 vidoza.net（embed 404）两个死线路直接滤掉。
// 搜索走 WP REST（/?s= 被站方 CF 拦 403），封面逐条取详情页 data-thumb 补。
// 注意：签名 master 有效期约 36 小时（e=129600），详情后尽快点播；点播现取走 loadResource。

WidgetMetadata = {
  id: "lai_openload",
  title: "OpenLoad",
  description: "OpenLoad：视频分享站聚合，含モザイク除去（LTX）分类，HG 720p / EV 1080p 真档位，多线路",
  author: "lai",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  site: "https://openload.mov",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "モザイク除去", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "mosaic" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "アダルトビデオ", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "av" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "無修正", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "uncensored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "素人AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "amav" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "素人投稿", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "amateur" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "VR", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "vr" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "急上昇", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "soaring" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "人気", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "popularity" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "热门标签", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag" }, { name: "sub", title: "标签", type: "enumeration", value: "%e5%8d%98%e4%bd%93%e4%bd%9c%e5%93%81", enumOptions: [{"title": "単体作品", "value": "%e5%8d%98%e4%bd%93%e4%bd%9c%e5%93%81"}, {"title": "中出し", "value": "%e4%b8%ad%e5%87%ba%e3%81%97"}, {"title": "巨乳", "value": "%e5%b7%a8%e4%b9%b3"}, {"title": "モザイク", "value": "%e3%83%a2%e3%82%b6%e3%82%a4%e3%82%af"}, {"title": "有修正", "value": "%e6%9c%89%e4%bf%ae%e6%ad%a3"}, {"title": "美少女", "value": "%e7%be%8e%e5%b0%91%e5%a5%b3"}, {"title": "素人動画", "value": "%e7%b4%a0%e4%ba%ba%e5%8b%95%e7%94%bb"}, {"title": "FC2PPV", "value": "fc2ppv"}, {"title": "熟女", "value": "%e7%86%9f%e5%a5%b3"}, {"title": "素人", "value": "%e7%b4%a0%e4%ba%ba"}, {"title": "人妻・主婦", "value": "%e4%ba%ba%e5%a6%bb%e3%83%bb%e4%b8%bb%e5%a9%a6"}, {"title": "スレンダー", "value": "%e3%82%b9%e3%83%ac%e3%83%b3%e3%83%80%e3%83%bc"}, {"title": "痴女", "value": "%e7%97%b4%e5%a5%b3"}, {"title": "フェラ", "value": "%e3%83%95%e3%82%a7%e3%83%a9"}, {"title": "美乳", "value": "%e7%be%8e%e4%b9%b3"}, {"title": "潮吹き", "value": "%e6%bd%ae%e5%90%b9%e3%81%8d"}, {"title": "人妻", "value": "%e4%ba%ba%e5%a6%bb"}, {"title": "ハメ撮り", "value": "%e3%83%8f%e3%83%a1%e6%92%ae%e3%82%8a"}, {"title": "無修正", "value": "%e7%84%a1%e4%bf%ae%e6%ad%a3"}, {"title": "パイズリ", "value": "%e3%83%91%e3%82%a4%e3%82%ba%e3%83%aa"}, {"title": "騎乗位", "value": "%e9%a8%8e%e4%b9%97%e4%bd%8d"}, {"title": "女子校生", "value": "%e5%a5%b3%e5%ad%90%e6%a0%a1%e7%94%9f"}, {"title": "3P・4P", "value": "3p%e3%83%bb4p"}, {"title": "デジモ", "value": "%e3%83%87%e3%82%b8%e3%83%a2"}, {"title": "寝取り・寝取られ・NTR", "value": "%e5%af%9d%e5%8f%96%e3%82%8a%e3%83%bb%e5%af%9d%e5%8f%96%e3%82%89%e3%82%8c%e3%83%bbntr"}, {"title": "顔射", "value": "%e9%a1%94%e5%b0%84"}, {"title": "パイパン", "value": "%e3%83%91%e3%82%a4%e3%82%ba%e3%83%91%e3%83%b3"}, {"title": "4時間以上作品", "value": "4%e6%99%82%e9%96%93%e4%bb%a5%e4%b8%8a%e4%bd%9c%e5%93%81"}, {"title": "お姉さん", "value": "%e3%81%8a%e5%a7%89%e3%81%95%e3%82%93"}, {"title": "淫乱・ハード系", "value": "%e6%b7%ab%e4%b9%b1%e3%83%bb%e3%83%8f%e3%83%bc%e3%83%89%e7%b3%bb"}, {"title": "企画", "value": "%e4%bc%81%e7%94%bb"}, {"title": "ドラマ", "value": "%e3%83%89%e3%83%a9%e3%83%9e"}, {"title": "オナニー", "value": "%e3%82%aa%e3%83%8a%e3%83%8b%e3%83%bc"}, {"title": "不倫", "value": "%e4%b8%8d%e5%80%ab"}, {"title": "ナンパ", "value": "%e3%83%8a%e3%83%b3%e3%83%91"}, {"title": "手コキ", "value": "%e6%89%8b%e3%82%b3%e3%82%ad"}, {"title": "コスプレ", "value": "%e3%82%b3%e3%82%b9%e3%83%97%e3%83%ac"}, {"title": "制服", "value": "%e5%88%b6%e6%9c%8d"}, {"title": "巨尻", "value": "%e5%b7%a8%e5%b0%bb"}, {"title": "イラマチオ", "value": "%e3%82%a4%e3%83%a9%e3%83%9e%e3%83%81%e3%82%aa"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var SITE = "https://openload.mov";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var UA_DESK = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

var PATHS = {
  latest: "",
  mosaic: "/%e3%83%a2%e3%82%b6%e3%82%a4%e3%82%af%e9%99%a4%e5%8e%bb",
  av: "/av",
  uncensored: "/uncensored",
  amav: "/amav",
  amateur: "/amateur",
  vr: "/vr",
  soaring: "/soaring",
  popularity: "/popularity"
};

function t(v) {
  return String(v == null ? "" : v).trim();
}

function clean(s) {
  return t(s).replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
}

function hostOf(url) {
  var m = String(url || "").match(/^https?:\/\/([^\/]+)/i);
  return m ? m[1].toLowerCase() : "";
}

// 取数头：与猫源蜘蛛及包内已验模块同款（UA + Referer + Accept + Accept-Language）
function pageHeaders(referer, ua) {
  return { "User-Agent": ua || UA, "Referer": referer || (SITE + "/"), "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8" };
}
// 状态码双字段兼容：REX 运行时回 statusCode（无 status 字段）；旧写法
// res.status !== 200 恒成立，好内容全被丢弃——1.0.0 列表全空即此根因。
// 只认 body：body 非空即成功；status/statusCode 明确为 4xx/5xx 才判失败。
function statusOf(res) {
  if (!res) return 0;
  if (res.status != null) return res.status;
  if (res.statusCode != null) return res.statusCode;
  return 0;
}
function bodyOf(res) {
  if (!res || res.data == null) return "";
  return typeof res.data === "string" ? res.data : JSON.stringify(res.data);
}
async function getText(url, referer, ua) {
  for (var attempt = 0; attempt < 3; attempt++) {
    try {
      var res = await Widget.http.get(url, { headers: pageHeaders(referer, ua) });
      var st = statusOf(res);
      var body = bodyOf(res);
      if (st >= 400) continue;
      if (body) return body;
    } catch (e) { /* retry */ }
  }
  return "";
}

async function getJson(url, referer, ua) {
  var body = await getText(url, referer, ua);
  if (!body || typeof body !== "string") return null;
  try { return JSON.parse(body); } catch (e) { return null; }
}

// 带状态码的单次取数（死线判定用：404 = 文件已删，丢弃该线路；
// 其他 4xx/5xx 或网络失败不断言死活，留嗅探行）
async function fetchStatus(url, referer) {
  for (var attempt = 0; attempt < 3; attempt++) {
    try {
      var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
      var st = statusOf(res);
      var body = bodyOf(res);
      if (st === 404) return { status: 404, body: "" };
      if (st >= 400) continue;
      if (body) return { status: st || 200, body: body };
    } catch (e) { /* retry */ }
  }
  return { status: 0, body: "" };
}

// ---------- Dean Edwards packer 纯 JS 解包器（无 eval） ----------
// 详情页与 StreamHG 系 embed 页两种变体都支持；8 个实采样本与 node eval 输出逐字节一致。
function jsUnescape(s) {
  var out = "";
  var i = 0;
  while (i < s.length) {
    var c = s.charAt(i);
    if (c === "\\" && i + 1 < s.length) {
      var n = s.charAt(i + 1);
      if (n === "'") { out += "'"; i += 2; }
      else if (n === "\\") { out += "\\"; i += 2; }
      else if (n === "n") { out += "\n"; i += 2; }
      else if (n === "r") { out += "\r"; i += 2; }
      else if (n === "t") { out += "\t"; i += 2; }
      else if (n === "x" && i + 3 < s.length) { out += String.fromCharCode(parseInt(s.substr(i + 2, 2), 16)); i += 4; }
      else if (n === "u" && i + 5 < s.length) { out += String.fromCharCode(parseInt(s.substr(i + 2, 4), 16)); i += 6; }
      else { out += n; i += 2; }
    } else { out += c; i++; }
  }
  return out;
}

function olEncode(x, base) {
  var s = "";
  var v = x;
  do {
    var d = v % base;
    s = (d > 35 ? String.fromCharCode(d + 29) : d.toString(36)) + s;
    v = parseInt(v / base, 10);
  } while (v > 0);
  return s;
}

function olUnpack(packed) {
  if (!packed) return "";
  var m = packed.match(/\}\('((?:\\'|[^'])*)',(\d+),(\d+),'((?:\\'|[^'])*)'\.split\('\|'\)(?:,0,\{\})?\)\)/);
  if (!m) return "";
  var payload = jsUnescape(m[1]);
  var base = parseInt(m[2], 10);
  var count = parseInt(m[3], 10);
  var keys = m[4].split("|");
  var i, c;
  if (packed.indexOf("d[e(c)]=k[c]") >= 0) {
    var d = {};
    for (i = 0; i < count; i++) d[olEncode(i, base)] = keys[i] || olEncode(i, base);
    return payload.replace(/\b\w+\b/g, function (w) { return d[w] !== undefined ? d[w] : w; });
  }
  var p = payload;
  for (c = count - 1; c >= 0; c--) {
    if (keys[c]) p = p.replace(new RegExp("\\b" + c.toString(base) + "\\b", "g"), keys[c]);
  }
  return p;
}

// 2026-11-15 实测死线路：asianclub.tv 已停放（域名出售页），vidoza.net embed 404
function isDeadEmbed(url) {
  var h = hostOf(url);
  return h === "asianclub.tv" || h === "vidoza.net" || h === "streamsb.net";
}

function isHgHost(h) {
  return h === "iplayerhls.com" || h === "callistanise.com" || h === "minochinos.com" ||
    h === "streamhide.to" || h === "likessb.com" || h === "sbstream.net";
}

// embed 页 qualityLabels 取最高档（urlset 母带如 {"3102":"1080p","1653":"720p","776":"480p"}
// 即一档含多变体，播单内由播放器自选，行名标最高档，不拆行、不编造）
function qualityFromLabels(up) {
  var m = up.match(/qualityLabels['"]?\s*:\s*\{([^}]*)\}/);
  if (!m) return "";
  var best = 0;
  var bestLabel = "";
  var re = /"(\d+)"\s*:\s*"([^"]+)"/g;
  var mm;
  while ((mm = re.exec(m[1])) !== null) {
    var v = parseInt(mm[1], 10) || 0;
    if (v >= best) { best = v; bestLabel = mm[2]; }
  }
  return bestLabel;
}

// StreamHG 系：embed 页混淆脚本里取 links.hls2 签名 master（首选），hls3 次之，hls4 最后
// 404 返回 "DEAD"（文件已删）；取不到正文返回 { url: "", quality: "" }（不断言死活）
async function resolveHg(embed) {
  try {
    var f = await fetchStatus(embed, embed);
    if (f.status === 404) return "DEAD";
    var html = f.body;
    if (!html) return { url: "", quality: "" };
    // 删片页回 200 + 文字（"File is no longer available as it expired or has been deleted."）
    if (/no longer available|has been deleted|file not found|video not found|this video (has been )?deleted/i.test(html)) return "DEAD";
    var re = /eval\(function\(p,a,c,k,e,d\)[\s\S]*?\.split\('\|'\)(?:,0,\{\})?\)\)/g;
    var m;
    while ((m = re.exec(html)) !== null) {
      var up = olUnpack(m[0]);
      if (!up || up.indexOf("hls2") < 0) continue;
      var hls2 = (up.match(/"hls2"\s*:\s*"([^"]+)"/) || [])[1] || "";
      var hls3 = (up.match(/"hls3"\s*:\s*"([^"]+)"/) || [])[1] || "";
      var hls4 = (up.match(/"hls4"\s*:\s*"([^"]+)"/) || [])[1] || "";
      var q = qualityFromLabels(up);
      if (hls2) return { url: hls2, quality: q };
      if (hls3) return { url: hls3, quality: q };
      if (hls4) {
        if (hls4.indexOf("http") === 0) return { url: hls4, quality: q };
        var om = embed.match(/^https?:\/\/[^\/]+/);
        return { url: (om ? om[0] : "") + hls4, quality: q };
      }
    }
  } catch (e) { /* fall through */ }
  return { url: "", quality: "" };
}

// streamtape：robotlink 拼 get_video（token 与请求 IP 绑定，详情时在手机侧现取）
// 404 返回 "DEAD"（文件已删）；取不到正文返回 ""（不断言死活）
async function resolveStreamtape(embed) {
  try {
    var f = await fetchStatus(embed, embed);
    if (f.status === 404) return "DEAD";
    var html = f.body;
    if (!html) return "";
    if (/no longer available|has been deleted|file not found|video not found|this video (has been )?deleted/i.test(html)) return "DEAD";
    var m = html.match(/get_video\?id=([^']*)'\s*\+\s*\('([^']*)'\)((?:\.substring\(\d+\))*)?/);
    if (m) {
      var tail = m[2];
      var subs = (m[3] || "").match(/substring\((\d+)\)/g) || [];
      var i;
      for (i = 0; i < subs.length; i++) {
        var n = parseInt((subs[i].match(/(\d+)/) || [])[1] || "0", 10) || 0;
        tail = tail.substring(n);
      }
      return "https://streamtape.com/get_video?id=" + m[1] + tail;
    }
    var m2 = html.match(/get_video\?id=([A-Za-z0-9]+)&expires=(\d+)&ip=([^"'\s&<>]+)&token=([^"'\s&<>]+)/);
    if (m2) return "https://streamtape.com/get_video?id=" + m2[1] + "&expires=" + m2[2] + "&ip=" + m2[3] + "&token=" + m2[4];
  } catch (e) { /* fall through */ }
  return "";
}

// vsembed 下载 API（猫源 v3 同款）：/api/download/tiers?s=<id> 回真实档位；
// /api/download/get?s=<id>&t=<档位> 302 到直链 MP4——播放器自会跟 302，
// 模块直接把 get 地址当 videoUrl 交播放器，不在模块内跟跳转（避免把整片 MP4 缓冲进沙箱）。
function vsIdOf(embed) {
  var parts = String(embed || "").split("/").filter(function (x) { return !!x; });
  return parts.length ? parts[parts.length - 1] : "";
}
function vsGetUrl(embed, tier) {
  return "https://vsembed.com/api/download/get?s=" + encodeURIComponent(vsIdOf(embed)) + "&t=" + encodeURIComponent(tier);
}
async function vsTiers(embed) {
  try {
    var id = vsIdOf(embed);
    if (!id) return [];
    var res = await Widget.http.get("https://vsembed.com/api/download/tiers?s=" + encodeURIComponent(id), { headers: { "User-Agent": UA, "Accept": "application/json", "Referer": embed } });
    var body = bodyOf(res);
    if (!body) return [];
    var j = JSON.parse(body);
    var tiers = (j && j.data && j.data.tiers) || [];
    var out = [];
    for (var i = 0; i < tiers.length; i++) {
      var f = tiers[i] && tiers[i].file;
      if (f && /^\d+p$/.test(String(f))) out.push(String(f));
    }
    return out;
  } catch (e) { return []; }
}

// embed -> { kind: "hls" | "mp4" | "sniff" | "dead", url: string, quality: string }
async function resolveEmbed(embed) {
  var h = hostOf(embed);
  if (!h) return { kind: "sniff", url: embed, quality: "" };
  try {
    if (isHgHost(h)) {
      var u = await resolveHg(embed);
      if (u === "DEAD") return { kind: "dead", url: embed, quality: "" };
      if (u && u.url) return { kind: "hls", url: u.url, quality: u.quality || "" };
    } else if (h === "streamtape.com") {
      var u2 = await resolveStreamtape(embed);
      if (u2 === "DEAD") return { kind: "dead", url: embed, quality: "" };
      if (u2) return { kind: "mp4", url: u2, quality: "" };
    }
  } catch (e) { /* fall through to sniff */ }
  return { kind: "sniff", url: embed, quality: "" };
}

function parseList(html) {
  var list = [];
  if (!html) return list;
  var re = /<a href="(https:\/\/openload\.mov\/[^"]*?\/op-\d+\/)"[^>]*>\s*<div class="post-list-image">\s*<img src="([^"]+)"[^>]*?alt="([^"]*)"[^>]*>(?:\s*<div[^>]*>\s*<\/div>)?\s*<\/div>\s*<span>([\s\S]*?)<\/span>\s*(?:<div class="post-list-time">([^<]*)<\/div>)?/g;
  var m;
  var seen = {};
  while ((m = re.exec(html)) !== null) {
    var url = m[1];
    if (seen[url]) continue;
    seen[url] = 1;
    var title = clean(m[4] || m[3] || "");
    if (!title) continue;
    var pic = m[2] || "";
    var link = url;
    list.push({
      id: link,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: t(m[5] || ""),
      mediaType: "movie"
    });
  }
  return list;
}

// WP 分类 id（2026-11-16 实测 /wp-json/wp/v2/categories）：mosaic 18368、av 2、
// uncensored 4、amav 1、amateur 3、vr 18499；最新不带 categories 参数。
// 标签 / 急上昇 / 人気无 REST 对应，不走兜底。
var CAT_IDS = { mosaic: 18368, av: 2, uncensored: 4, amav: 1, amateur: 3, vr: 18499 };
function parseRestPosts(posts) {
  var list = [];
  if (!posts || !posts.length) return list;
  for (var i = 0; i < posts.length; i++) {
    var p = posts[i];
    var link = (p && p.link) || "";
    var title = clean((p && p.title && p.title.rendered) || "");
    if (!link || !title) continue;
    list.push({ id: link, type: "url", title: title, posterPath: "", coverUrl: "", backdropPath: "", link: link, description: ((p && p.date) || "").slice(0, 10), mediaType: "movie" });
  }
  return list;
}
// HTML 取不到内容时的 WP REST 兜底；iPhone UA 不行再试桌面 UA（REST 对 iPhone UA 间歇 403 是已知坑）
async function restList(zone, page) {
  var catId = CAT_IDS[zone];
  if (zone !== "latest" && catId == null) return [];
  var base = SITE + "/wp-json/wp/v2/posts?per_page=20&page=" + page + (zone === "latest" ? "" : "&categories=" + catId);
  var posts = await getJson(base, SITE + "/");
  if (!posts || !posts.length) posts = await getJson(base, SITE + "/", UA_DESK);
  var list = parseRestPosts(posts);
  if (!list.length) return list;
  // 封面逐条取详情页 data-thumb 补（只补前 8 条，3 并发，与 search 同款）
  var thumbList = list.slice(0, 8);
  var thumbIdx = 0;
  var thumbWorker = function () {
    if (thumbIdx >= thumbList.length) return Promise.resolve();
    var item = thumbList[thumbIdx++];
    return getText(item.link, item.link).then(function (html) {
      var m = html.match(/data-thumb="([^"]+)"/);
      if (m) { item.posterPath = m[1]; item.coverUrl = m[1]; item.backdropPath = m[1]; }
      return thumbWorker();
    }).catch(function () { return thumbWorker(); });
  };
  try { await Promise.all([thumbWorker(), thumbWorker(), thumbWorker()]); } catch (e) { /* 封面失败不影响列表 */ }
  return list;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "latest");
  var tag = t(params.sub || params.tag || "");
  if (tag) zone = "tag";
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var url = "";
  try {
    if (zone === "tag") {
      url = SITE + "/tag/" + tag + (page > 1 ? "/page/" + page + "/" : "/");
    } else if (zone === "soaring" || zone === "popularity") {
      url = SITE + (PATHS[zone] || "") + "/";
    } else {
      var path = PATHS[zone];
      if (path == null) return emptyItem("未知的分类");
      url = SITE + path + (page > 1 ? "/page/" + page + "/" : "/");
    }
    var html = await getText(url, SITE + "/");
    if (!html) html = await getText(url, SITE + "/", UA_DESK);
    var list = parseList(html);
    if (list.length) return list;
    var rest = await restList(zone, page);
    if (rest && rest.length) return rest;
    return emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

// 搜索走 WP REST；封面逐条取详情页 data-thumb 补
async function search(params) {
  params = params || {};
  var wd = t(params.keyword || params.wd || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return emptyItem("请输入关键词");
  try {
    var url = SITE + "/wp-json/wp/v2/posts?search=" + encodeURIComponent(wd) + "&per_page=20&page=" + page;
    var posts = await getJson(url, SITE + "/");
    if (!posts || !posts.length) posts = await getJson(url, SITE + "/", UA_DESK);
    if (!posts || !posts.length) return emptyItem();
    var list = parseRestPosts(posts);
    var i;
    var jobs = [];
    var thumbList = [];
    for (i = 0; i < Math.min(list.length, 8); i++) thumbList.push(list[i]);
    var thumbIdx = 0;
    var thumbWorker = function () {
      if (thumbIdx >= thumbList.length) return Promise.resolve();
      var item = thumbList[thumbIdx++];
      return getText(item.link, item.link).then(function (html) {
        var m = html.match(/data-thumb="([^"]+)"/);
        if (m) {
          item.posterPath = m[1];
          item.coverUrl = m[1];
          item.backdropPath = m[1];
        }
        return thumbWorker();
      }).catch(function () { return thumbWorker(); });
    };
    // 站方对并发敏感（12 并行全 20s 超时），故 3 并发池、只补前 8 条，失败留空
    try { await Promise.all([thumbWorker(), thumbWorker(), thumbWorker()]); } catch (e) { /* 封面失败不影响列表 */ }
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

// 详情页解析：标题 / 封面 / 各集线路标签 / embed 列表（死线路已滤）
function parseDetail(html) {
  var title = clean(((html.match(/<title>([^<]*)<\/title>/) || [])[1] || "").replace(/\s*-\s*OPENLOAD\.PRO\s*$/, ""));
  var pic = (html.match(/data-thumb="([^"]+)"/) || [])[1] || "";
  var epBlock = (html.match(/<div id="episode">([\s\S]*?)<\/div>/) || [])[1] || "";
  var epNums = (epBlock.match(/<span[^>]*>(\d+)<\/span>/g) || []).length || 1;
  var parts = [];
  var serverRe = /<div id="e(\d+)"[^>]*>([\s\S]*?)<\/div>/g;
  var sm;
  while ((sm = serverRe.exec(html)) !== null) {
    var labels = [];
    var lre = /<span[^>]*>([^<]+)<\/span>/g;
    var lm;
    while ((lm = lre.exec(sm[2])) !== null) labels.push(t(lm[1]));
    if (labels.length) parts.push(labels);
  }
  var embeds = [];
  var re = /eval\(function\(p,a,c,k,e,d\)[\s\S]*?\.split\('\|'\)(?:,0,\{\})?\)\)/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var up = olUnpack(m[0]);
    if (up && up.indexOf("<iframe") >= 0) {
      var ire = /<iframe[^>]*src="([^"]+)"/g;
      var im;
      while ((im = ire.exec(up)) !== null) {
        if (!isDeadEmbed(im[1])) embeds.push(im[1]);
      }
      if (embeds.length) break;
    }
  }
  return { title: title, pic: pic, epNums: epNums, parts: parts, embeds: embeds };
}

// 详情：每条线路现解为最终可播地址，直接写进 episodeItem.videoUrl
async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var durl = raw.indexOf("http") === 0 ? raw : SITE + raw;
    var html = await getText(durl, durl);
    if (!html) html = await getText(durl, durl, UA_DESK);
    var d = parseDetail(html);
    var name = d.title || durl;
    var pic = d.pic;
    var nParts = Math.max(d.parts.length, 1);
    // 先拼 (part, server, embed) 清单，再并行现解
    var plan = [];
    var ei = 0;
    var pi, si;
    for (pi = 0; pi < nParts; pi++) {
      var labels = d.parts[pi] || ["HG"];
      for (si = 0; si < labels.length; si++) {
        var emb = d.embeds[ei++] || "";
        if (!emb) continue;
        plan.push({ part: pi + 1, server: labels[si], embed: emb });
      }
    }
    // 现解：3 并发池（站方与 VM 出口都扛不住 24 并行，全超时；3 并发实测通）
    var resolved = [];
    var planIdx = 0;
    var resolveWorker = function () {
      if (planIdx >= plan.length) return Promise.resolve();
      var it = plan[planIdx++];
      return resolveEmbed(it.embed).then(function (r) {
        it.kind = r.kind;
        it.url = r.url;
        it.quality = r.quality || "";
        return resolveWorker();
      }).catch(function () {
        it.kind = "sniff";
        it.url = it.embed;
        it.quality = "";
        return resolveWorker();
      });
    };
    try {
      await Promise.all([resolveWorker(), resolveWorker(), resolveWorker()]);
      resolved = plan;
    } catch (e) {
      resolved = [];
      for (var ri = 0; ri < plan.length; ri++) {
        plan[ri].kind = "sniff";
        plan[ri].url = plan[ri].embed;
        plan[ri].quality = "";
        resolved.push(plan[ri]);
      }
    }
    // 死线路（embed 404）直接丢弃，不出集
    var alive = [];
    var ai;
    for (ai = 0; ai < resolved.length; ai++) {
      if (resolved[ai].kind !== "dead") alive.push(resolved[ai]);
    }
    resolved = alive;
    // VS：下载 API 有真实档位（1080p/720p/540p），详情时取档位出多集；取不到只留嗅探行
    var vsTierMap = {};
    var vsEmbeds = [];
    var vsSeen = {};
    for (var vi = 0; vi < resolved.length; vi++) {
      var ve = resolved[vi].embed || "";
      if (hostOf(ve) === "vsembed.com" && !vsSeen[ve]) { vsSeen[ve] = 1; vsEmbeds.push(ve); }
    }
    for (var vj = 0; vj < vsEmbeds.length && vj < 3; vj++) {
      try {
        var vt = await vsTiers(vsEmbeds[vj]);
        if (vt && vt.length) vsTierMap[vsEmbeds[vj]] = vt;
      } catch (e) { /* 留嗅探行 */ }
    }
    var eps = [];
    var epItems = [];
    var seasons = [];
    var firstUrl = "";
    var epNo = 0;
    for (pi = 0; pi < nParts; pi++) {
      var partNo = pi + 1;
      var seasonEps = [];
      var partItems = [];
      for (var k = 0; k < resolved.length; k++) {
        var it = resolved[k];
        if (it.part !== partNo) continue;
        var tiers = vsTierMap[it.embed] || null;
        if (tiers && it.kind !== "hls" && it.kind !== "mp4") {
          for (var ti = 0; ti < tiers.length; ti++) {
            epNo++;
            var tlab = "VS·" + tiers[ti];
            var ttitle = (nParts > 1 ? "第" + partNo + "集·" : "") + tlab;
            var tid = durl + "@@OL:" + partNo + ":VS·" + tiers[ti] + ":" + it.embed;
            var turl = vsGetUrl(it.embed, tiers[ti]);
            eps.push({ name: ttitle, link: tid });
            var tse = { title: ttitle, episodeNumber: epNo };
            tse.videoUrl = turl;
            seasonEps.push(tse);
            var titem = { id: tid, type: "url", title: ttitle, mediaType: "movie", posterPath: pic, link: tid, episode: epNo, episodeNumber: epNo, seasonIndex: partNo, seasonNumber: partNo, videoUrl: turl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": it.embed } };
            epItems.push(titem);
            partItems.push(titem);
            if (!firstUrl && turl) firstUrl = turl;
          }
          continue;
        }
        epNo++;
        var lab = "";
        var playerType = "system";
        var headers = null;
        if (it.kind === "hls" || it.kind === "mp4") {
          lab = (it.quality ? it.quality + "·" : "") + it.server;
          headers = { "User-Agent": UA, "Referer": it.embed };
        } else {
          lab = "网页播放·" + it.server;
          playerType = "app";
        }
        var title = (nParts > 1 ? "第" + partNo + "集·" : "") + lab;
        var id = durl + "@@OL:" + partNo + ":" + it.server + ":" + it.embed;
        eps.push({ name: title, link: id });
        var se = { title: title, episodeNumber: epNo };
        se.videoUrl = it.url;
        seasonEps.push(se);
        var item = {
          id: id,
          type: "url",
          title: title,
          mediaType: "movie",
          posterPath: pic,
          link: id,
          episode: epNo,
          episodeNumber: epNo,
          seasonIndex: partNo,
          seasonNumber: partNo,
          videoUrl: it.url,
          playerType: playerType
        };
        if (headers) item.customHeaders = headers;
        epItems.push(item);
        partItems.push(item);
        if (!firstUrl && it.url) firstUrl = it.url;
      }
      if (seasonEps.length) {
        seasons.push({ seasonNumber: partNo, title: nParts > 1 ? "第" + partNo + "集" : "播放线路", name: nParts > 1 ? "第" + partNo + "集" : "播放线路", episodes: seasonEps });
      }
    }
    // 全死 / 解包失败：只留站内页嗅探行
    if (!epItems.length) {
      var sid = durl + "@@OL:1:WEB:" + durl;
      eps.push({ name: "网页播放", link: sid });
      seasons.push({ seasonNumber: 1, title: "播放线路", name: "播放线路", episodes: [{ title: "网页播放", episodeNumber: 1, videoUrl: durl }] });
      epItems.push({ id: sid, type: "url", title: "网页播放", mediaType: "movie", posterPath: pic, link: sid, episode: 1, episodeNumber: 1, seasonIndex: 1, seasonNumber: 1, videoUrl: durl, playerType: "app" });
      firstUrl = durl;
    }
    var result = {
      id: durl,
      type: "detail",
      title: name,
      name: name,
      description: "",
      mediaType: "movie",
      link: durl,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = seasons;
      result.episodeItems = epItems;
      result.childItems = epItems;
    }
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// loadResource：@@OL:<part>:<server>:<embed> -> 该线路现解一行；永不抛错
async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 已是直链 m3u8 / mp4
  if (/\.m3u8(\?|#|$)/i.test(raw) && raw.indexOf("@@") < 0) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA } }];
  }
  if (/\.mp4(\?|#|$)/i.test(raw) && raw.indexOf("@@") < 0) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA } }];
  }
  var m = raw.match(/@@OL:(\d+):([^:]+):(https?:\/\/.*)$/);
  if (!m) {
    // 兜底：详情地址 -> 取详情首集
    try {
      var det = await loadDetail(raw);
      var eps = det && det.episodeItems;
      if (eps && eps.length) {
        return await loadResource({ link: eps[0].id });
      }
    } catch (e) { /* fall through */ }
    return [];
  }
  var embed = m[3];
  var server = m[2];
  if (hostOf(embed) === "vsembed.com") {
    var tierM = server.match(/(\d+p)/);
    var tier = tierM ? tierM[1] : "";
    if (!tier) {
      try {
        var tiers = await vsTiers(embed);
        if (tiers && tiers.length) tier = tiers[0];
      } catch (e) { tier = ""; }
    }
    if (tier) return [{ name: "VS·" + tier, url: vsGetUrl(embed, tier), playerType: "system", customHeaders: { "User-Agent": UA, "Referer": embed } }];
    return [{ name: "网页播放·VS", url: embed, playerType: "app" }];
  }
  var r = { kind: "sniff", url: embed };
  try {
    r = await resolveEmbed(embed);
  } catch (e) { /* 保持嗅探行 */ }
  if (r.kind === "dead") {
    var durl0 = raw.split("@@OL:")[0];
    if (durl0) return [{ name: "网页播放", url: durl0, playerType: "app" }];
    return [];
  }
  if (r.kind === "hls" || r.kind === "mp4") {
    var rows = [{ name: server, url: r.url, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": embed } }];
    return rows;
  }
  return [{ name: "网页播放·" + server, url: embed, playerType: "app" }];
}
