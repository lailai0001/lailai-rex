// JavCT for REX (lai_javct v1.0.1; 2026-11-02 翻页修复：站方忽略 ?page=N，改走分类 token + /pg-N)
// 移植自 mira-cat 蜘蛛 py_javct.js（只读蓝图），后端 https://javct.net（与 sextb 同模板 family）。
// 列表：卡片 <a href="/v/{slug}" class="card__play">，封面不在锚点内而在同 card__cover 块锚点前最后一个 <img> 的 data-src
//   （src 是 default-cover.jpg 占位图，真实封面 cdn001.imggle.net webp）；标题按 card__title 顺序补，番号按顺序补。
// 详情：/v/{slug}；服务器按钮 <button class="switch-source btn-player episode" data-source="{filmId}" data-id="{episode}">
//   （默认激活 F4，另有 FL、US；class 含 btn-player-vip 的 VIP 按钮绝不碰）；页内全局 window.__pt / window.__pk（每页现值，现取）；
//   猫源 detail 只收线、play 再 POST /ajax/player（body episode/filmId/pt，头 X-Requested-With），
//   REX 端 loadDetail 内一次做完：POST 取 item.player_enc（xor 解码，密钥 __pk）或 item.player，取 iframe 嵌页，
//   按宿主分流走已部署 sextb-hls Worker（F4 系 f4scdn/f4jav 走 /f4，其余走 /v），返回 Worker 地址作 videoUrl。
//   本站给的是服务器选择（F4/FL/US），不是分辨率档，不编造清晰度。
// 站方有 WAF（VM 直连 403）：模块先 GET 首页暖会话再抓详情/ajax，App 端能否过墙、cookie 是否跨请求保持，待真机验。
// base64 与异或均为纯字符串运算，不依赖运行环境的编解码接口。
// 字幕：猫源本身无字幕线，本模块不接。

WidgetMetadata = {
  id: "lai_javct",
  title: "JavCT",
  description: "JavCT（javct.net）：无码/字幕/有码等 22 个分类，详情 POST 取线走已部署 sextb-hls Worker",
  author: "lai",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  site: "https://javct.net",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [ { name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" } ] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/uncensored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "字幕", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/subtitle" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "有码", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/censored" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/big-tits" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "大屁股", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/big-asses" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "美少女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/beautiful-girl" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "角色扮演", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/cosplay" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/married-woman" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "熟女", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/mature-woman" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "熟妇", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/milf" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "校园", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/school-girls" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "中出", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/creampie" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "口交", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/blowjob" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "剧情", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/drama" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "女同", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/lesbian" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "按摩", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/massage" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "OL", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/office-lady" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "野外", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/outdoor" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "肛交", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/anal" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "捆绑", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/bondage" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "群交", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/category/orgy" }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [ { name: "path", title: "分类", type: "constant", value: "/amateur" }, { name: "page", title: "页码", type: "page", value: "1" } ] }
  ]
};

var HOST = "https://javct.net";
var WORKER = "https://sextb-hls.li768435813.workers.dev";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
var B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function cleanText(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/&#x([0-9a-fA-F]+);/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); })
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

function firstMatch(text, re, idx) {
  var m = String(text || "").match(re);
  return m ? t(m[idx || 1] || "") : "";
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": referer || HOST + "/"
  };
}

async function getText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer) });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

// 纯字符串 base64 解码，返回 latin1 字符串（每个字符即一个字节）
function b64ToLatin1(s) {
  s = String(s || "").replace(/-/g, "+").replace(/_/g, "/").replace(/[^A-Za-z0-9+\/=]/g, "");
  while (s.length % 4) s += "=";
  var out = "";
  for (var i = 0; i < s.length; i += 4) {
    var c0 = B64_ALPHABET.indexOf(s.charAt(i));
    var c1 = B64_ALPHABET.indexOf(s.charAt(i + 1));
    var c2 = B64_ALPHABET.indexOf(s.charAt(i + 2));
    var c3 = B64_ALPHABET.indexOf(s.charAt(i + 3));
    if (c0 < 0 || c1 < 0) break;
    out += String.fromCharCode((c0 << 2) | (c1 >> 4));
    if (c2 >= 0) out += String.fromCharCode(((c1 & 15) << 4) | (c2 >> 2));
    if (c3 >= 0) out += String.fromCharCode(((c2 & 3) << 6) | c3);
  }
  return out;
}

// latin1 字节串按 UTF-8 解码（手工实现，不依赖运行环境解码接口）
function latin1ToUtf8(s) {
  var out = "";
  var i = 0;
  while (i < s.length) {
    var c = s.charCodeAt(i);
    i++;
    if (c < 128) {
      out += String.fromCharCode(c);
    } else if ((c & 224) === 192 && i < s.length) {
      var c2 = s.charCodeAt(i);
      i++;
      out += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
    } else if ((c & 240) === 224 && i + 1 < s.length) {
      var d2 = s.charCodeAt(i);
      var d3 = s.charCodeAt(i + 1);
      i += 2;
      out += String.fromCharCode(((c & 15) << 12) | ((d2 & 63) << 6) | (d3 & 63));
    } else if ((c & 248) === 240 && i + 2 < s.length) {
      var e2 = s.charCodeAt(i);
      var e3 = s.charCodeAt(i + 1);
      var e4 = s.charCodeAt(i + 2);
      i += 3;
      var cp = ((c & 7) << 18) | ((e2 & 63) << 12) | ((e3 & 63) << 6) | (e4 & 63);
      cp -= 65536;
      out += String.fromCharCode(55296 + (cp >> 10), 56320 + (cp & 1023));
    } else {
      out += String.fromCharCode(c);
    }
  }
  return out;
}

// xorDecrypt（main.js 原文口径）：先 base64 解码，密钥为空则直接返回解码串；否则逐字符与密钥循环异或，再转 UTF-8
function xorDecrypt(enc, key) {
  if (!enc) return "";
  var decoded = b64ToLatin1(enc);
  if (!key) return latin1ToUtf8(decoded);
  var out = "";
  for (var i = 0; i < decoded.length; i++) {
    out += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return latin1ToUtf8(out);
}

function isF4Host(host) {
  return /f4scdn\.com|f4jav\.xyz/i.test(host || "");
}

function hostOf(url) {
  var m = String(url || "").match(/^https?:\/\/([^\/]+)/i);
  return m ? m[1] : "";
}

function workerUrl(embed, durl) {
  var host = hostOf(embed);
  var path = isF4Host(host) ? "/f4" : "/v";
  return WORKER + path + "?u=" + encodeURIComponent(embed) + "&r=" + encodeURIComponent(durl);
}

function parseCards(html) {
  var items = [];
  var seen = {};
  var re = /<a[^>]*href="(https:\/\/javct\.net\/v\/[a-z0-9\-]+|\/v\/[a-z0-9\-]+)"[^>]*class="[^"]*card__play[^"]*"[^>]*>([\s\S]{0,1500}?)<\/a>/gi;
  var m;
  while ((m = re.exec(html))) {
    var href = m[1];
    if (href.indexOf("http") !== 0) href = HOST + href;
    if (seen[href]) continue;
    seen[href] = 1;
    var pic = "";
    var before = html.slice(Math.max(0, m.index - 900), m.index);
    var imgRe = /<img[^>]*>/gi;
    var lastImg = null;
    var im;
    while ((im = imgRe.exec(before))) lastImg = im[0];
    if (lastImg) {
      var dm = lastImg.match(/data-src="([^"]+)"/i);
      var sm = lastImg.match(/src="([^"]+)"/i);
      var cand = (dm && dm[1]) || (sm && sm[1]) || "";
      if (cand && !/default-cover/i.test(cand) && cand.indexOf("data:image") !== 0) {
        pic = /^https?:\/\//i.test(cand) ? cand : HOST + (cand.charAt(0) === "/" ? cand : "/" + cand);
      }
    }
    items.push({
      id: href,
      type: "url",
      title: "",
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: href,
      description: "",
      mediaType: "movie"
    });
    if (items.length >= 60) break;
  }
  var titles = [];
  var titleRe = /class="[^"]*card__title[^"]*"[^>]*>([\s\S]{0,500}?)<\/[^>]+>/gi;
  var tm;
  while ((tm = titleRe.exec(html))) titles.push(cleanText(tm[1]));
  var codes = [];
  var codeRe = /<a[^>]*href="https:\/\/javct\.net\/v\/[a-z0-9\-]+"[^>]*>([A-Z0-9\-]{4,})<\/a>/gi;
  var cm;
  while ((cm = codeRe.exec(html))) codes.push(cm[1]);
  var out = [];
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    if (titles[i]) it.title = titles[i];
    if (codes[i]) it.description = codes[i];
    if (!it.title) it.title = it.description || "JavCT";
    if (it.title && it.title.length >= 2) out.push(it);
  }
  return out;
}

function listOrMsg(html, url) {
  if (!html) return [{ id: "empty", type: "url", title: "空页面" }];
  var list = parseCards(html);
  return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关内容", description: "URL: " + url }];
}

async function warmSession() {
  try { await getText(HOST + "/", HOST + "/"); } catch (e) { /* 暖会话失败不阻断，后续请求自带结果 */ }
}

// 分页真相（2026-11-02 设备反馈 + jina 实测）：站方忽略 ?page=N（恒回第 1 页；
// 猫源侧表现为无限重复，REX 侧因去重表现为翻不出更多）；真实分页是分类 token
// 路径 + /pg-N（如 /uncensored-c8lkazew/pg-2；token 各分类不同、跨请求稳定，
// 须从第 1 页分页链接现取；取不到则 page>1 如实返回空数组，绝不回第 1 页内容充数）。
function pagePrefix(html) {
  var m = String(html || "").match(/href=["']([^"']*?)\/pg-\d+["']/i);
  if (!m) return null;
  var p = m[1];
  if (!/^https?:\/\//i.test(p)) p = HOST + (p.charAt(0) === "/" ? p : "/" + p);
  return p.replace(/\/+$/, "");
}

function listBase(cat) {
  cat = t(cat) || "/amateur";
  return (/^https?:\/\//i.test(cat) ? cat : HOST + "/" + cat.replace(/^\/+/, "")).replace(/\/+$/, "");
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var cat = String(params.path || params.cat || "/amateur");
  var base = listBase(cat);
  try {
    await warmSession();
    if (page > 1) {
      // 第 2 页起取数失败也如实返回空（与 asianviralhub 末页口径一致），
      // 不出假卡、不回第 1 页内容；第 1 页的失败仍走下方可见报错。
      try {
        var firstHtml = await getText(base, HOST + "/");
        var prefix = pagePrefix(firstHtml);
        if (!prefix) return [];
        var html = await getText(prefix + "/pg-" + page, HOST + "/");
        return parseCards(html);
      } catch (e) {
        return [];
      }
    }
    var html = await getText(base, HOST + "/");
    return listOrMsg(html, base);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + base }];
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
  var base = HOST + "/search/" + encodeURIComponent(wd);
  var url = page === 1 ? base : base + "?page=" + page;
  try {
    await warmSession();
    var html = await getText(url, HOST + "/");
    return listOrMsg(html, url);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

// POST（带守卫）：运行时无 post 方法时返回空，调用方按失败降级
async function httpPostRaw(url, bodyText, headers) {
  try {
    if (typeof Widget.http.post === "function") {
      var res = await Widget.http.post(url, bodyText, { headers: headers });
      if (res && res.data != null) return res.data;
      if (typeof res === "string") return res;
    }
  } catch (e) { /* 降级 */ }
  return null;
}

function originOf(url) {
  var m = String(url || "").match(/^(https?:\/\/[^\/]+)/i);
  return m ? m[1] : "";
}

async function loadDetail(link) {
  try {
    var url = String(link || "");
    if (!/^https?:\/\//i.test(url)) url = HOST + (url.charAt(0) === "/" ? url : "/" + url);
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    await warmSession();
    var html = await getText(url, HOST + "/");
    var cands = [];
    var ogt = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
    if (ogt) cands.push(ogt[1]);
    var sht = html.match(/<h1[^>]*class="[^"]*section__title[^"]*"[^>]*>([\s\S]{0,400}?)<\/h1>/i);
    if (sht) cands.push(sht[1]);
    var h1t = html.match(/<h1[^>]*>([\s\S]{0,400}?)<\/h1>/i);
    if (h1t) cands.push(h1t[1]);
    var title = "JavCT";
    for (var ci = 0; ci < cands.length; ci++) {
      var ct = cleanText(cands[ci]);
      if (ct && !/^(403|404|500|Forbidden|Not Found)/i.test(ct)) { title = ct; break; }
    }
    var cover = firstMatch(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (!cover) cover = firstMatch(html, /(https:\/\/cdn001\.imggle\.net\/[^"'\s<>]+)/i);
    var filmM = html.match(/filmId\s*=\s*["']?(\d+)/i) || html.match(/data-source="(\d+)"/i);
    var filmId = filmM ? filmM[1] : "";
    var pt = firstMatch(html, /window\.__pt\s*=\s*"([^"]+)"/i);
    var pk = firstMatch(html, /window\.__pk\s*=\s*"([^"]+)"/i);
    var btns = [];
    var btnRe = /<button[^>]*class="[^"]*btn-player[^"]*"[^>]*>([\s\S]{0,80}?)<\/button>/gi;
    var bm;
    while ((bm = btnRe.exec(html))) {
      var tag = bm[0];
      if (/btn-player-vip/i.test(tag)) continue;
      var dm = tag.match(/data-id="(\d+)"/i);
      var sm = tag.match(/data-source="(\d+)"/i);
      var name = cleanText(bm[1]) || "播放";
      var episode = dm ? dm[1] : "";
      var fsrc = sm ? sm[1] : filmId;
      if (!episode || !fsrc) continue;
      btns.push({ name: name, episode: episode, filmId: fsrc });
    }
    var videoUrl = "";
    var chosen = null;
    for (var bi = 0; bi < btns.length; bi++) {
      if (btns[bi].name === "F4") { chosen = btns[bi]; break; }
    }
    if (!chosen && btns.length) chosen = btns[0];
    if (chosen) {
      var origin = originOf(url);
      var body = "episode=" + encodeURIComponent(chosen.episode)
        + "&filmId=" + encodeURIComponent(chosen.filmId)
        + "&pt=" + encodeURIComponent(pt);
      var raw = await httpPostRaw(origin + "/ajax/player", body, {
        "User-Agent": UA,
        "Referer": url,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest"
      });
      if (raw != null) {
        var j = null;
        try { j = typeof raw === "string" ? JSON.parse(raw) : raw; } catch (e) { j = null; }
        if (j && !j.error) {
          var playerHtml = "";
          if (j.player_enc) playerHtml = xorDecrypt(j.player_enc, pk || "");
          else if (j.player) playerHtml = String(j.player);
          if (playerHtml) {
            var em = playerHtml.match(/<iframe[^>]+src="(https?:\/\/[^"]+)"/i)
              || playerHtml.match(/<iframe[^>]+src="(\/\/[^"]+)"/i);
            if (em) {
              var embed = em[1];
              if (embed.indexOf("//") === 0) embed = "https:" + embed;
              videoUrl = workerUrl(embed, url);
            } else {
              var mm = playerHtml.match(/https?:\/\/[^"'\s<>]+\.(?:m3u8|mp4)(?:\?[^"'\s<>]*)?/i);
              if (mm) videoUrl = mm[0];
            }
          }
        }
      }
    }
    if (!videoUrl) {
      return { id: url, type: "url", title: title, description: "未找到播放地址" };
    }
    return {
      id: url,
      type: "detail",
      title: title,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: { "User-Agent": UA, "Referer": url }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
