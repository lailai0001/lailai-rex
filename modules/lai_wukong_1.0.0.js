// 悟空传媒 for REX (lai_wukong v1.0.0)
// 移植自 mira-cat 蜘蛛 wukong.js（只读蓝图），后端 https://qcfit2u1.chuanqi74.sbs。
// MacCMS 站。域名会随门轮换：只改顶部 HOST 一个常量，不要改别的。
// 门已启用：首次 GET 回门页（空 title + #xkEnter 按钮，var token='…'）；
// 必须带 Cookie xk_gate=<token> 再 GET；token 会刷新、有效 24 小时，缓存于模块变量 gateCookie；
// 若后续调用又命中门页，重新取 token。绝对不要请求统计像素 wkyl188.shoujiduoduo.cc。
// 列表：首页 HOST + '/'（单页）；排行榜 /label/<rank>.html（单页）；分类 /vod/<id>.html，翻页
// /vod/<id>-<N>.html；标签 /tag/<id>.html，翻页 /tag/<id>-<N>.html。卡片：
// <a class="pic" href="/play/<id>.html" title="标题" style="background-image:url(封面)">，
// badge-score（评分）+ badge（清晰度/时长）。页数取 pager “共X条，Y/Z页”（parsePager），
// 首页与 4 个排行是单页、pagecount 必须为 1（不要回 999）。
// 详情：/play/<id>.html；h1 标题；.poster img 封面；线路来自 <a class="line-play"
// href="/v-p/<id>-<线>-1.html">（通常 1 条，个别 2 条）；每条线点进其播放页取
// var player_data={"url":"...m3u8","encrypt":0,"trysee":0,...}：encrypt 0=原文，1=unescape，
// 2=base64（纯 JS 解，REX 无 Buffer；实测皆为 0）。每条线只有一档 m3u8，不编档位；
// 空地址的线不进集名。播放：直给 m3u8，playerType system。搜索：/sou/-.html?wd=<词>（p1），
// /sou/<词>-<N>.html（后续页）。
// 字幕：不接。

WidgetMetadata = {
  id: "lai_wukong",
  title: "悟空传媒",
  description: "悟空传媒：MacCMS 站，首页最新/4 排行榜 + 40 视频分类/88 标签筛选，带门页过门，线路 m3u8 直播",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://qcfit2u1.chuanqi74.sbs",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "首页最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "排行榜", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "rank" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "周排行", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "rankweek" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "月排行", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "rankmonth" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "高分排行", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "rankscore" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "视频分类", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat" }, { name: "sub", title: "分类", type: "enumeration", value: "1", enumOptions: [{"title": "国产", "value": "1"}, {"title": "自拍", "value": "6"}, {"title": "强奸", "value": "8"}, {"title": "传媒", "value": "9"}, {"title": "偷拍", "value": "12"}, {"title": "网红", "value": "2"}, {"title": "萝莉", "value": "3"}, {"title": "吃瓜", "value": "14"}, {"title": "人兽", "value": "16"}, {"title": "探花", "value": "5"}, {"title": "大秀", "value": "4"}, {"title": "人妖", "value": "17"}, {"title": "喷水", "value": "20"}, {"title": "性虐", "value": "22"}, {"title": "无码", "value": "24"}, {"title": "欧美", "value": "26"}, {"title": "动漫", "value": "27"}, {"title": "Cosplay", "value": "41"}, {"title": "OnlyFans", "value": "18"}, {"title": "反差婊", "value": "10"}, {"title": "大学生", "value": "15"}, {"title": "网爆门", "value": "11"}, {"title": "福利姬", "value": "13"}, {"title": "瑜伽裤", "value": "38"}, {"title": "多人群P", "value": "40"}, {"title": "AI换脸", "value": "23"}, {"title": "三级片", "value": "28"}, {"title": "AV解说", "value": "29"}, {"title": "中文字幕", "value": "25"}, {"title": "兽耳系列", "value": "39"}, {"title": "学生下海", "value": "37"}, {"title": "淫荡儿媳", "value": "36"}, {"title": "夫妻交换", "value": "35"}, {"title": "野外车震", "value": "34"}, {"title": "猛干嫂子", "value": "33"}, {"title": "狂操小姨", "value": "32"}, {"title": "禁忌母子", "value": "31"}, {"title": "兄弟姐妹", "value": "30"}, {"title": "家族乱伦", "value": "7"}, {"title": "魔改AI短剧", "value": "50"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "标签", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag" }, { name: "sub", title: "标签", type: "enumeration", value: "tag239", enumOptions: [{"title": "标签·骚", "value": "tag239"}, {"title": "标签·极品", "value": "tag971"}, {"title": "标签·内射", "value": "tag14"}, {"title": "标签·巨乳", "value": "tag131"}, {"title": "标签·高潮", "value": "tag233"}, {"title": "标签·爆操", "value": "tag990"}, {"title": "标签·诱惑", "value": "tag162"}, {"title": "标签·人妻", "value": "tag126"}, {"title": "标签·女神", "value": "tag973"}, {"title": "标签·流出", "value": "tag217"}, {"title": "标签·自慰", "value": "tag194"}, {"title": "标签·中出", "value": "tag15"}, {"title": "标签·调教", "value": "tag165"}, {"title": "标签·美少女", "value": "tag794"}, {"title": "标签·乱伦", "value": "tag1015"}, {"title": "标签·反差", "value": "tag243"}, {"title": "标签·黑丝", "value": "tag136"}, {"title": "标签·清纯", "value": "tag245"}, {"title": "标签·无码", "value": "tag3"}, {"title": "标签·母狗", "value": "tag996"}, {"title": "标签·网红", "value": "tag976"}, {"title": "标签·酒店", "value": "tag252"}, {"title": "标签·泄密", "value": "tag218"}, {"title": "标签·少妇", "value": "tag125"}, {"title": "标签·口交", "value": "tag12"}, {"title": "标签·无套", "value": "tag987"}, {"title": "标签·后入", "value": "tag75"}, {"title": "标签·抽插", "value": "tag1450"}, {"title": "标签·露脸", "value": "tag207"}, {"title": "标签·自拍", "value": "tag278"}, {"title": "标签·中出し", "value": "tag450"}, {"title": "标签·高颜值", "value": "tag970"}, {"title": "标签·OL", "value": "tag396"}, {"title": "标签·骚货", "value": "tag240"}, {"title": "标签·制服", "value": "tag140"}, {"title": "标签·探花", "value": "tag118"}, {"title": "标签·骑乘", "value": "tag76"}, {"title": "标签·字幕", "value": "tag273"}, {"title": "标签·中文", "value": "tag948"}, {"title": "标签·福利", "value": "tag957"}, {"title": "标签·白虎", "value": "tag226"}, {"title": "标签·约炮", "value": "tag119"}, {"title": "标签·偷拍", "value": "tag489"}, {"title": "标签·情趣", "value": "tag1212"}, {"title": "标签·中文字幕", "value": "tag2"}, {"title": "标签·私拍", "value": "tag968"}, {"title": "标签·曝光", "value": "tag964"}, {"title": "标签·偷情", "value": "tag160"}, {"title": "标签·破解", "value": "tag7"}, {"title": "标签·喷水", "value": "tag231"}, {"title": "标签·狂操", "value": "tag1455"}, {"title": "标签·勾引", "value": "tag163"}, {"title": "标签·御姐", "value": "tag129"}, {"title": "标签·直播", "value": "tag90"}, {"title": "标签·大奶", "value": "tag994"}, {"title": "标签·合集", "value": "tag222"}, {"title": "标签·深喉", "value": "tag71"}, {"title": "标签·3P", "value": "tag19"}, {"title": "标签·淫乱", "value": "tag512"}, {"title": "标签·粉嫩", "value": "tag228"}, {"title": "标签·抖音", "value": "tag980"}, {"title": "标签·长腿", "value": "tag135"}, {"title": "标签·淫水", "value": "tag1499"}, {"title": "标签·爆乳", "value": "tag132"}, {"title": "标签·素人", "value": "tag282"}, {"title": "标签·主播", "value": "tag978"}, {"title": "标签·尤物", "value": "tag998"}, {"title": "标签·学生妹", "value": "tag124"}, {"title": "标签·饥渴", "value": "tag238"}, {"title": "标签·反差婊", "value": "tag244"}, {"title": "标签·美乳", "value": "tag133"}, {"title": "标签·大学生", "value": "tag1003"}, {"title": "标签·高清", "value": "tag8"}, {"title": "标签·按摩", "value": "tag60"}, {"title": "标签·颜射", "value": "tag13"}, {"title": "标签·嫩妹", "value": "tag974"}, {"title": "标签·熟女", "value": "tag128"}, {"title": "标签·精液", "value": "tag1501"}, {"title": "标签·CA", "value": "tag410"}, {"title": "标签·丝袜", "value": "tag446"}, {"title": "标签·痴女", "value": "tag37"}, {"title": "标签·口爆", "value": "tag70"}, {"title": "标签·浪叫", "value": "tag235"}, {"title": "标签·主动", "value": "tag237"}, {"title": "标签·眼镜", "value": "tag387"}, {"title": "标签·系列", "value": "tag610"}, {"title": "标签·双飞", "value": "tag183"}, {"title": "标签·角", "value": "tag1814"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://qcfit2u1.chuanqi74.sbs";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// gate cookie 缓存：token 有效 24 小时；命中门页时重新取。
var gateCookie = "";

// 纯 JS base64 解码（javhey 同款，REX 无 Buffer）
function b64decode(input) {
  var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  while (i < input.length) {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output += String.fromCharCode(chr1);
    if (enc3 !== 64) output += String.fromCharCode(chr2);
    if (enc4 !== 64) output += String.fromCharCode(chr3);
  }
  return output;
}

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  return t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return HOST + "/" + u;
}

function headers() {
  var h = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": HOST + "/"
  };
  if (gateCookie) h["Cookie"] = gateCookie;
  return h;
}

function isGatePage(html) {
  return !!html && html.indexOf("xkEnter") !== -1 && /var token='[^']+'/.test(html);
}

function extractGateToken(html) {
  var m = html.match(/var token='([^']+)'/);
  return m ? m[1] : "";
}

async function rawGet(url) {
  try {
    var res = await Widget.http.get(url, { headers: headers() });
    var data = res && res.data;
    return typeof data === "string" ? data : (data ? JSON.stringify(data) : "");
  } catch (e) {
    return "";
  }
}

// 取页：先 GET；若回门页，取 token 设 Cookie 再 GET 一次；
// 若某次调用又命中门页（cookie 过期），重新取 token；仍是门页则返回 ""。
async function getHtml(url) {
  var html = await rawGet(url);
  if (isGatePage(html)) {
    var tok = extractGateToken(html);
    if (tok) {
      gateCookie = "xk_gate=" + tok;
      html = await rawGet(url);
    }
  }
  if (isGatePage(html)) {
    var tok2 = extractGateToken(html);
    if (tok2) {
      gateCookie = "xk_gate=" + tok2;
      html = await rawGet(url);
    }
  }
  return isGatePage(html) ? "" : html;
}

function parsePager(html, page) {
  var m = html.match(/共\s*(\d+)\s*条\s*,\s*\d+\/(\d+)\s*页/);
  if (m) return Math.max(parseInt(m[2], 10) || 1, page);
  return 1;
}

// 列表页卡片：<a class="pic" href="/play/<id>.html" title="标题"
// style="background-image:url(封面)">；badge-score 评分 + badge 清晰度/时长。
// 注意：MacCMS 列表页也有 <a class="pic" href="/v-p/…">（播放页）；必须过滤掉 /v-p/。
function parseListHtml(html, baseUrl) {
  var out = [];
  if (!html) return out;
  var re = /<a class="pic" href="(\/play\/\d+\.html)" title="([^"]+)" style="background-image:url\(([^)]+)\)">/g;
  var m;
  var seen = {};
  while ((m = re.exec(html)) !== null) {
    if (seen[m[1]]) continue;
    seen[m[1]] = 1;
    var tail = html.slice(m.index, m.index + 1200);
    var score = "";
    var sm = tail.match(/class="badge-score">([^<]{1,20})</);
    if (sm) score = t(sm[1]);
    var badge = "";
    var bm = tail.match(/class="badge">([^<]{1,20})</);
    if (bm) badge = t(bm[1]);
    var remarks = [score, badge].filter(Boolean).join(" ");
    var link = HOST + m[1];
    out.push({
      id: link,
      type: "url",
      title: decodeHtml(m[2]) || m[1],
      posterPath: absUrl(m[3]),
      coverUrl: absUrl(m[3]),
      backdropPath: absUrl(m[3]),
      link: link,
      description: remarks,
      mediaType: "movie"
    });
  }
  return out;
}

function listUrl(eff, page) {
  if (eff === "home") return HOST + "/";
  if (eff === "rank" || eff === "rankweek" || eff === "rankmonth" || eff === "rankscore") return HOST + "/label/" + eff + ".html";
  return page > 1 ? HOST + "/vod/" + eff + "-" + page + ".html" : HOST + "/vod/" + eff + ".html";
}

// 标签页地址：/tag/<数字>.html，翻页 /tag/<数字>-<N>.html（sub 值为 "tag<数字>"）
function tagUrl(sub, page) {
  var num = t(sub || "tag239").replace(/^tag/, "");
  return page > 1 ? HOST + "/tag/" + num + "-" + page + ".html" : HOST + "/tag/" + num + ".html";
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "home");
  var sub = t(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    if (zone === "home" || zone === "rank" || zone === "rankweek" || zone === "rankmonth" || zone === "rankscore") {
      if (page > 1) return emptyItem(zone === "home" ? "首页最新只有一页" : "排行榜只有一页");
      var html = await getHtml(listUrl(zone, 1));
      var list = parseListHtml(html, listUrl(zone, 1));
      return list.length ? list : emptyItem();
    }
    if (zone === "cat") {
      var catId = sub || "1";
      var html2 = await getHtml(listUrl(catId, page));
      var list2 = parseListHtml(html2, listUrl(catId, page));
      return list2.length ? list2 : emptyItem();
    }
    if (zone === "tag") {
      var turl = tagUrl(sub, page);
      var html3 = await getHtml(turl);
      var list3 = parseListHtml(html3, turl);
      return list3.length ? list3 : emptyItem();
    }
    return emptyItem();
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
    var url = page === 1
      ? HOST + "/sou/-.html?wd=" + encodeURIComponent(wd)
      : HOST + "/sou/" + encodeURIComponent(wd) + "-" + page + ".html";
    var html = await getHtml(url);
    var list = parseListHtml(html, url);
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

// 播放页 player_data JSON：var player_data={"url":"...m3u8","encrypt":0,...}（结尾无分号）。
// 整段 JSON.parse（与蜘蛛同款）：字段顺序无关，\/ 转义自动还原。
function extractPlayerData(html) {
  var m = html.match(/var\s+player_data\s*=\s*(\{[^{}]*\})/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch (e) {
    return null;
  }
}

// 解出直链：encrypt 0=原文，1=unescape，2=base64（纯 JS 解，REX 无 Buffer；实测皆为 0）。
function decodePlayUrl(pd) {
  if (!pd || !pd.url) return "";
  var url = String(pd.url).trim();
  var enc = parseInt(pd.encrypt, 10) || 0;
  try {
    if (enc === 1) url = unescape(url);
    else if (enc === 2) url = b64decode(url);
  } catch (e) { /* keep raw */ }
  return url;
}

// 取一条线路播放页的 m3u8。失败回 ""。
async function fetchLineM3u8(playPageUrl) {
  var html = await getHtml(playPageUrl);
  if (!html) return "";
  var pd = extractPlayerData(html);
  var u = decodePlayUrl(pd);
  return /^https?:\/\//i.test(u) ? u : "";
}

async function loadDetail(link) {
  try {
    var url = unwrapLink(link);
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    if (url.indexOf("http") !== 0) url = absUrl(url);
    var html = await getHtml(url);
    if (!html) return { id: url, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = "";
    var hm = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (hm) name = hm[1].replace(/<[^>]+>/g, "").trim();
    if (!name) {
      var tm = html.match(/<title>([^<]+)<\/title>/i);
      if (tm) name = decodeHtml(tm[1].split(/[-|_｜]/)[0]);
    }
    var pic = "";
    var pm = html.match(/class="poster"[^>]*>\s*<img[^>]+src="([^"]+)"/)
      || html.match(/class="poster"[^>]*>\s*<img[^>]+data-src="([^"]+)"/)
      || html.match(/<meta property="og:image" content="([^"]+)"/);
    if (pm) pic = absUrl(pm[1]);
    var desc = "";
    var dm = html.match(/<meta name="description" content="([^"]+)"/);
    if (dm) desc = decodeHtml(dm[1]);
    // 线路：<a class="line-play" href="/v-p/<id>-<线>-1.html">
    var lines = [];
    var lre = /class="line-play"[^>]*href="(\/v-p\/\d+-\d+-1\.html)"[^>]*>([\s\S]*?)<\/a>/g;
    var lm;
    while ((lm = lre.exec(html)) !== null) {
      var lineName = lm[2].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, "").trim();
      if (!lineName) lineName = "线路" + (lines.length + 1);
      lines.push({ name: lineName, url: HOST + lm[1] });
    }
    if (!lines.length) {
      var sm = html.match(/href="(\/v-p\/\d+-\d+-1\.html)"/);
      if (sm) lines.push({ name: "线路1", url: HOST + sm[1] });
    }
    // 每条线点进播放页取 m3u8；空地址的线不进集名
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    for (var i = 0; i < lines.length; i++) {
      var m3u8 = await fetchLineM3u8(lines[i].url);
      if (!m3u8) continue;
      var lineName = lines[i].name;
      var id = url + "@@WK:" + (i + 1);
      eps.push({ name: lineName, link: id });
      seasonEps.push({ title: lineName, videoUrl: m3u8, episodeNumber: eps.length });
      epItems.push({
        id: id,
        type: "url",
        title: lineName,
        mediaType: "movie",
        posterPath: pic,
        videoUrl: m3u8,
        link: id,
        episode: eps.length,
        episodeNumber: eps.length,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system",
        customHeaders: { "User-Agent": UA, "Referer": HOST + "/" }
      });
    }
    var result = {
      id: url,
      type: "detail",
      title: name || url,
      name: name || url,
      description: desc || (eps.length ? "共 " + eps.length + " 条线路" : "未找到播放地址"),
      mediaType: "movie",
      link: url,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app"
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "播放线路", name: "播放线路", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
      result.videoUrl = epItems[0].videoUrl;
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
  // 线路入口：<detail>@@WK:<n> -> 回详情取对应线的 m3u8
  var at = raw.indexOf("@@WK:");
  if (at >= 0) {
    var durl = raw.slice(0, at);
    var idx = parseInt(raw.slice(at + 5), 10) || 1;
    try {
      var det = await loadDetail(durl);
      var items = det && det.episodeItems;
      if (items && items[idx - 1] && items[idx - 1].videoUrl) {
        return [{ name: items[idx - 1].title, url: items[idx - 1].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
      }
    } catch (e) { /* fall through */ }
    return [];
  }
  // 直链 m3u8
  if (/\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  }
  // 兜底：详情地址 -> 取详情首线
  try {
    var det2 = await loadDetail(raw);
    var eps = det2 && det2.episodeItems;
    if (eps && eps.length && eps[0].videoUrl) {
      return [{ name: eps[0].title, url: eps[0].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
  } catch (e) { /* fall through */ }
  return [];
}
