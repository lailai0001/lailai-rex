// SupJav for REX (lai_supjav v1.0.0)
// 来源：mira-cat 蜘蛛 py_supjav 的移植。后端：https://supjav.com（Cloudflare 防护）。
// 取页沿用蜘蛛方案：第三方代理 py.fzcrym.link:1314 的 /fs 通道（失败换 /page 通道）绕 CF。
// 播放沿用蜘蛛方案：详情页 data-link 线路（VOE>FST>ST>其他>TV）逐条走
// lk1.supremejav.com/supjav.php 的 ?c=反转 / ?l=换 OLID 双链提取 m3u8；
// REX 无客户端嗅探，额外对 Streamtape 嵌入页做 get_video 候选提取并逐个试活。

WidgetMetadata = {
  id: "lai_supjav",
  title: "SupJav",
  description: "SupJav（supjav.com）：最新/热门/趋势/有码/无码/素人/中文字幕/破解/英文字幕分类，多线路解析播放",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://supjav.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "最新",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "__home" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "热门",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "__popular" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "趋势",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "__trending" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "有码 Censored",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "censored-jav" },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "最新", value: "" },
            { title: "最多观看", value: "views" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "无码 Uncensored",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "uncensored-jav" },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "最新", value: "" },
            { title: "最多观看", value: "views" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "素人 Amateur",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "amateur" },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "最新", value: "" },
            { title: "最多观看", value: "views" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "中文字幕 Chn Sub",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "chinese-subtitles" },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "最新", value: "" },
            { title: "最多观看", value: "views" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "破解 Reducing Mosaic",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "reducing-mosaic" },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "最新", value: "" },
            { title: "最多观看", value: "views" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "英文字幕 Eng Sub",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "cat", title: "分类", type: "constant", value: "english-subtitles" },
        {
          name: "sort",
          title: "排序",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "最新", value: "" },
            { title: "最多观看", value: "views" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    }
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

var HOST = "https://supjav.com";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var PROXY_BASE = "https://py.fzcrym.link:1314";
var FS_PAGE_API = PROXY_BASE + "/fs?u=";
var PAGE_API = PROXY_BASE + "/page?u=";
var LK_BASE = "https://lk1.supremejav.com/supjav.php";

async function httpGet(url, headers) {
  var res = await Widget.http.get(url, { headers: headers || { "User-Agent": UA } });
  return res && res.data != null ? String(res.data) : "";
}

function pageOk(html) {
  return !!html && html.length > 3000 && html.indexOf("Just a moment") < 0;
}

// 与蜘蛛 fetchPage 同策略：/fs 通道重试，再兜底 /page 通道
async function fetchPage(url) {
  var fsUrl = FS_PAGE_API + encodeURIComponent(url);
  for (var i = 0; i < 2; i++) {
    try {
      var html = await httpGet(fsUrl);
      if (pageOk(html)) return html;
    } catch (e) {}
  }
  try {
    var html2 = await httpGet(PAGE_API + encodeURIComponent(url));
    if (pageOk(html2)) return html2;
  } catch (e) {}
  return "";
}

function cleanTitle(s) {
  return String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, "-")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// 与蜘蛛 parseCards 同逻辑：按 <div class="post"> 切块取详情链/标题/封面
function parseCards(html) {
  var out = [];
  var seen = {};
  var blocks = String(html || "").split('<div class="post">').slice(1);
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    var m = b.match(/href="https:\/\/supjav\.com\/(\d+)\.html"/);
    if (!m) continue;
    var vid = m[1];
    if (seen[vid]) continue;
    var tm = b.match(/title="([^"]+)"/);
    var title = tm ? cleanTitle(tm[1]) : "";
    if (!title) continue;
    seen[vid] = true;
    var pic = "";
    var pats = [/<img[^>]+data-original="([^"]+)"/, /<img[^>]+data-src="([^"]+)"/, /<img[^>]+src="(https?:\/\/[^"]+)"/];
    for (var k = 0; k < pats.length; k++) {
      var pm = b.match(pats[k]);
      if (pm) { pic = pm[1]; break; }
    }
    if (pic.indexOf("//") === 0) pic = "https:" + pic;
    var code = "";
    var cm = title.match(/\b([A-Z]{2,6}-?\d{2,6}|FC2PPV[\s-]?\d{5,8})\b/);
    if (cm) code = cm[1];
    var link = HOST + "/" + vid + ".html";
    out.push({
      id: link,
      type: "url",
      title: title.slice(0, 90),
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: code,
      mediaType: "movie"
    });
  }
  return out;
}

function catUrl(tid, page, sort) {
  var url;
  if (tid === "__home") {
    url = page === 1 ? HOST + "/" : HOST + "/page/" + page + "/";
  } else if (tid === "__popular") {
    url = page === 1 ? HOST + "/popular/" : HOST + "/popular/page/" + page + "/";
  } else if (tid === "__trending") {
    url = page === 1 ? HOST + "/trending/" : HOST + "/trending/page/" + page + "/";
  } else {
    var base = HOST + "/category/" + tid;
    url = page === 1 ? base + "/" : base + "/page/" + page + "/";
    if (sort) url += "?sort=" + encodeURIComponent(sort);
  }
  return url;
}

async function listByUrl(url) {
  var html = await fetchPage(url);
  var items = parseCards(html);
  if (!items.length) {
    html = await fetchPage(url);
    items = parseCards(html);
  }
  return items;
}

async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var tid = String(params.cat || params.path || "__home").trim() || "__home";
  var sort = String(params.sort || "").trim();
  var url = catUrl(tid, page, sort);
  try {
    var items = await listByUrl(url);
    return items.length ? items : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
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
  var kw = pickKeyword(params);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!kw) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var ekw = encodeURIComponent(kw);
  var url = page === 1 ? HOST + "/?s=" + ekw : HOST + "/page/" + page + "/?s=" + ekw;
  try {
    var items = await listByUrl(url);
    return items.length ? items : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

function reverseStr(s) {
  return String(s || "").split("").reverse().join("");
}

// 从任意响应文本里按蜘蛛规则提取直链：先 .m3u8，再 JSON 的 url/file/source/m3u8
function extractDirect(text) {
  var s = String(text || "");
  if (!s) return "";
  var m = s.match(/(https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*)/i);
  if (m) return m[1];
  try {
    var j = JSON.parse(s);
    var u = j.url || j.file || j.source || j.m3u8;
    if (u) return String(u);
  } catch (e) {}
  return "";
}

// Streamtape 嵌入页：算出所有 innerHTML 赋值与静态隐藏 div 的候选链接，归一化为绝对 URL
function stCandidates(html) {
  var s = String(html || "");
  var out = [];
  var push = function (u) {
    if (!u) return;
    u = String(u).trim();
    if (u.indexOf("//") === 0) u = "https:" + u;
    else if (u.indexOf("/streamtape.com/") === 0) u = "https:/" + u;
    else if (u.charAt(0) === "/") u = "https://streamtape.com" + u;
    if (u.indexOf("get_video") >= 0 && out.indexOf(u) < 0) out.push(u);
  };
  var divRe = /id="[a-z]+link"[^>]*>([^<]+)<\/div>/g;
  var dm;
  while ((dm = divRe.exec(s)) !== null) push(dm[1]);
  var jsRe = /innerHTML\s*=\s*("[^"]*"|'[^']*')\s*\+\s*(?:''\+)?\s*\('([^']*)'\)((?:\.substring\(\d+\))*)/g;
  var jm;
  while ((jm = jsRe.exec(s)) !== null) {
    var val = jm[2];
    var subs = jm[3].match(/\d+/g) || [];
    for (var i = 0; i < subs.length; i++) val = val.substring(parseInt(subs[i], 10));
    push(jm[1].slice(1, -1) + val);
  }
  return out;
}

// 逐个试活 Streamtape 候选：返回不像站方 JSON 报错的即视为可用
async function tryStCandidates(html, referer) {
  var cands = stCandidates(html);
  for (var i = 0; i < cands.length; i++) {
    try {
      var res = await Widget.http.get(cands[i], {
        headers: {
          "User-Agent": UA,
          "Referer": referer || "https://streamtape.com/",
          "Range": "bytes=0-200"
        }
      });
      var body = res && res.data != null ? String(res.data) : "";
      var status = res && typeof res.status === "number" ? res.status : 0;
      if (status >= 400) continue;
      if (/^\s*\{\s*"status"\s*:\s*(403|500)/.test(body)) continue;
      if (body.indexOf("unauthorized") >= 0) continue;
      if (body) return cands[i];
    } catch (e) {}
  }
  return "";
}

// 单条线路解析（蜘蛛双链 + Streamtape 候选提取）
async function resolveLine(vid, hex, detailUrl) {
  var headers = { "User-Agent": UA, "Referer": detailUrl };
  // 链路1: ?c=反转 hex
  try {
    var cText = await httpGet(LK_BASE + "?c=" + reverseStr(hex), headers);
    var u1 = extractDirect(cText);
    if (u1) return u1;
    if (cText.indexOf("get_video") >= 0 || cText.indexOf("ideoolink") >= 0) {
      var st1 = await tryStCandidates(cText, "https://streamtape.com/");
      if (st1) return st1;
    }
  } catch (e) {}
  // 链路2: ?l=hex 拿 OLID 再反转走 ?c=
  try {
    var lText = await httpGet(LK_BASE + "?l=" + hex, headers);
    var om = lText.match(/["']([0-9a-fA-F]{32,})["']/) || lText.match(/([0-9a-fA-F]{40,})/);
    if (om) {
      var cText2 = await httpGet(LK_BASE + "?c=" + reverseStr(om[1]), headers);
      var u2 = extractDirect(cText2);
      if (u2) return u2;
      if (cText2.indexOf("get_video") >= 0 || cText2.indexOf("ideoolink") >= 0) {
        var st2 = await tryStCandidates(cText2, "https://streamtape.com/");
        if (st2) return st2;
      }
    }
  } catch (e) {}
  return "";
}

async function loadDetail(link) {
  try {
    var durl = String(link || "");
    var vid = (durl.split("/").pop() || "").replace(".html", "").replace(/\D/g, "");
    if (!vid) {
      return { id: durl || "err", type: "url", title: "解析失败", description: "未找到播放地址" };
    }
    durl = HOST + "/" + vid + ".html";
    var html = await fetchPage(durl);
    if (!html) {
      return { id: durl, type: "url", title: "载入失败", description: "详情页获取失败（代理通道无响应）" };
    }

    var title = "";
    var tm = html.match(/<h1[^>]*>(.*?)<\/h1>/s);
    if (tm) title = cleanTitle(tm[1].replace(/<[^>]+>/g, ""));

    var pic = "";
    var pm = html.match(/background-image:\s*url\((https:\/\/img\.supjav\.com\/[^)]+)\)/);
    if (pm) pic = pm[1];
    if (!pic) {
      var im = html.match(/(https:\/\/img\.supjav\.com\/[^\s"'<>)]+\.(?:jpg|jpeg|png|webp)[^\s"'<>)]*)/i);
      if (im) pic = im[1];
    }
    if (pic.indexOf("//") === 0) pic = "https:" + pic;

    var tags = [];
    var tagRe = /(tag|actress)\/([^"/]+)/g;
    // 只从站内链接里提标签（与蜘蛛同口径，用完整 href 匹配）
    var fullTagRe = new RegExp('href="https://supjav\\.com/(tag|actress)/([^"/]+)', "g");
    var tg;
    while ((tg = fullTagRe.exec(html)) !== null) {
      var s = tg[2].replace(/-/g, " ").trim();
      if (s && tags.indexOf(s) < 0) tags.push(s);
    }
    var desc = title;
    if (tags.length) desc += "\n标签: " + tags.slice(0, 10).join(", ");

    // 线路 data-link（与蜘蛛同口径配对与排序：VOE 0 / FST 10 / ST 20 / 其他 50 / TV 90）
    var links = [];
    var lm;
    var linkRe = /data-link="([0-9a-f]{40,})"/g;
    while ((lm = linkRe.exec(html)) !== null) links.push(lm[1]);
    var names = [];
    var nm;
    var nameRe = /data-link="[0-9a-f]{40,}"[^>]*>([^<]{1,12})</g;
    while ((nm = nameRe.exec(html)) !== null) names.push(nm[1].trim());
    var ORDER = { VOE: 0, FST: 10, ST: 20, TV: 90 };
    var pairs = [];
    for (var i = 0; i < links.length; i++) {
      var lnm = names[i] || ("线路" + (i + 1));
      var ord = ORDER[String(lnm).toUpperCase()];
      pairs.push({ name: lnm, hex: links[i], ord: ord == null ? 50 : ord });
    }
    pairs.sort(function (a, b) { return a.ord - b.ord; });

    var videoUrl = "";
    for (var p = 0; p < pairs.length; p++) {
      videoUrl = await resolveLine(vid, pairs[p].hex, durl);
      if (videoUrl) break;
    }
    if (!videoUrl) {
      return {
        id: durl,
        type: "url",
        title: title || ("SupJav " + vid),
        description: "未找到播放地址"
      };
    }

    return {
      id: durl,
      type: "detail",
      title: title || ("SupJav " + vid),
      link: durl,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: desc.slice(0, 600),
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": durl
      }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
