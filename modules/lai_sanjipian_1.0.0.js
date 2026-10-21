// 蝴蝶影院 for REX（移植自 mira-cat 蜘蛛 sanjipian.js / py_sanjipian，只读蓝图移植）
// 后端：ptt01.com（蝴蝶影院，域名会轮换，模块内置导航站自愈逻辑）。
// 列表/搜索为 HTML 正则解析（沿用蜘蛛口径）；详情页内嵌直链 m3u8 直接播；
// 剧集类在 /v/<id> 页有分集索引（/<id>/<n>），分集页各自内嵌 m3u8，走 episodes + loadResource。

WidgetMetadata = {
  id: "lai_sanjipian",
  title: "蝴蝶影院",
  description: "蝴蝶影院（ptt01）：电影/电视剧/动漫/综艺/短剧/体育，支持地区/年份筛选与多集剧集",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://ptt01.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "🎬 电影",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/p/1" },
        {
          name: "sub",
          title: "类型",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "伦理", value: "/c/33" },
            { title: "动作", value: "/c/5" },
            { title: "喜剧", value: "/c/6" },
            { title: "爱情", value: "/c/7" },
            { title: "科幻", value: "/c/8" },
            { title: "恐怖", value: "/c/9" },
            { title: "犯罪", value: "/c/10" },
            { title: "战争", value: "/c/11" },
            { title: "动漫", value: "/c/12" },
            { title: "剧情", value: "/c/13" },
            { title: "纪录", value: "/c/14" },
            { title: "悬疑", value: "/c/15" },
            { title: "动画", value: "/c/16" },
            { title: "解说", value: "/c/35" }
          ]
        },
        {
          name: "area",
          title: "地区",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "大陆", value: "2" },
            { title: "香港", value: "5" },
            { title: "台湾", value: "4" },
            { title: "韩国", value: "17" },
            { title: "日本", value: "18" },
            { title: "欧美", value: "6" },
            { title: "泰国", value: "10" }
          ]
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2026", value: "2026" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020", value: "2020" },
            { title: "2019", value: "2019" },
            { title: "2018", value: "2018" },
            { title: "2017", value: "2017" },
            { title: "2016", value: "2016" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "📺 电视剧",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/p/3" },
        {
          name: "area",
          title: "地区",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "大陆", value: "2" },
            { title: "香港", value: "5" },
            { title: "台湾", value: "4" },
            { title: "韩国", value: "17" },
            { title: "日本", value: "18" },
            { title: "欧美", value: "6" },
            { title: "泰国", value: "10" }
          ]
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2026", value: "2026" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020", value: "2020" },
            { title: "2019", value: "2019" },
            { title: "2018", value: "2018" },
            { title: "2017", value: "2017" },
            { title: "2016", value: "2016" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "🌸 动漫",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/p/4" },
        {
          name: "area",
          title: "地区",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "大陆", value: "2" },
            { title: "香港", value: "5" },
            { title: "台湾", value: "4" },
            { title: "韩国", value: "17" },
            { title: "日本", value: "18" },
            { title: "欧美", value: "6" },
            { title: "泰国", value: "10" }
          ]
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2026", value: "2026" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020", value: "2020" },
            { title: "2019", value: "2019" },
            { title: "2018", value: "2018" },
            { title: "2017", value: "2017" },
            { title: "2016", value: "2016" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "🎤 综艺",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/p/2" },
        {
          name: "area",
          title: "地区",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "大陆", value: "2" },
            { title: "香港", value: "5" },
            { title: "台湾", value: "4" },
            { title: "韩国", value: "17" },
            { title: "日本", value: "18" },
            { title: "欧美", value: "6" },
            { title: "泰国", value: "10" }
          ]
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2026", value: "2026" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020", value: "2020" },
            { title: "2019", value: "2019" },
            { title: "2018", value: "2018" },
            { title: "2017", value: "2017" },
            { title: "2016", value: "2016" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "⚡ 短剧",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/p/66" },
        {
          name: "area",
          title: "地区",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "大陆", value: "2" },
            { title: "香港", value: "5" },
            { title: "台湾", value: "4" },
            { title: "韩国", value: "17" },
            { title: "日本", value: "18" },
            { title: "欧美", value: "6" },
            { title: "泰国", value: "10" }
          ]
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2026", value: "2026" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020", value: "2020" },
            { title: "2019", value: "2019" },
            { title: "2018", value: "2018" },
            { title: "2017", value: "2017" },
            { title: "2016", value: "2016" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "⚽ 体育",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/p/53" },
        {
          name: "area",
          title: "地区",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "大陆", value: "2" },
            { title: "香港", value: "5" },
            { title: "台湾", value: "4" },
            { title: "韩国", value: "17" },
            { title: "日本", value: "18" },
            { title: "欧美", value: "6" },
            { title: "泰国", value: "10" }
          ]
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2026", value: "2026" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020", value: "2020" },
            { title: "2019", value: "2019" },
            { title: "2018", value: "2018" },
            { title: "2017", value: "2017" },
            { title: "2016", value: "2016" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "🎭 爽剧短剧",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/p/66/c/67" },
        {
          name: "area",
          title: "地区",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "大陆", value: "2" },
            { title: "香港", value: "5" },
            { title: "台湾", value: "4" },
            { title: "韩国", value: "17" },
            { title: "日本", value: "18" },
            { title: "欧美", value: "6" },
            { title: "泰国", value: "10" }
          ]
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2026", value: "2026" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020", value: "2020" },
            { title: "2019", value: "2019" },
            { title: "2018", value: "2018" },
            { title: "2017", value: "2017" },
            { title: "2016", value: "2016" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "🏟️ 足球",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/p/53/c/54" },
        {
          name: "area",
          title: "地区",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "大陆", value: "2" },
            { title: "香港", value: "5" },
            { title: "台湾", value: "4" },
            { title: "韩国", value: "17" },
            { title: "日本", value: "18" },
            { title: "欧美", value: "6" },
            { title: "泰国", value: "10" }
          ]
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2026", value: "2026" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020", value: "2020" },
            { title: "2019", value: "2019" },
            { title: "2018", value: "2018" },
            { title: "2017", value: "2017" },
            { title: "2016", value: "2016" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "🇰🇷 韩剧",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/p/3/c/82" },
        {
          name: "area",
          title: "地区",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "大陆", value: "2" },
            { title: "香港", value: "5" },
            { title: "台湾", value: "4" },
            { title: "韩国", value: "17" },
            { title: "日本", value: "18" },
            { title: "欧美", value: "6" },
            { title: "泰国", value: "10" }
          ]
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2026", value: "2026" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020", value: "2020" },
            { title: "2019", value: "2019" },
            { title: "2018", value: "2018" },
            { title: "2017", value: "2017" },
            { title: "2016", value: "2016" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "🇯🇵 日漫",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "分类", type: "constant", value: "/p/4/c/86" },
        {
          name: "area",
          title: "地区",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "大陆", value: "2" },
            { title: "香港", value: "5" },
            { title: "台湾", value: "4" },
            { title: "韩国", value: "17" },
            { title: "日本", value: "18" },
            { title: "欧美", value: "6" },
            { title: "泰国", value: "10" }
          ]
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "2026", value: "2026" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020", value: "2020" },
            { title: "2019", value: "2019" },
            { title: "2018", value: "2018" },
            { title: "2017", value: "2017" },
            { title: "2016", value: "2016" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      id: "loadResource",
      title: "蝴蝶播放源",
      description: "分集播放时实时解析 m3u8",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 0,
      params: []
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

var SITE = "https://ptt01.com";
var NAV_URLS = ["https://x99dh.cc", "https://x99dh.one"];
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var siteRefreshTried = false;

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Referer": referer || (SITE + "/"),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
  };
}

function absUrl(u) {
  u = String(u || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return SITE + u;
  return u;
}

// 把任意链接收敛成当前 SITE 下的路径（域名轮换后旧链接也能用）
function pathOf(link) {
  var s = String(link || "");
  var m = s.match(/^https?:\/\/[^/]+(\/[^?#]*)/i);
  if (m) return m[1];
  if (s.charAt(0) === "/") return s.split(/[?#]/)[0];
  return "/" + s;
}

function htmlUnescape(s) {
  return String(s || "")
    .replace(/&#(\d+);/g, function (_, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/&#x([0-9a-fA-F]+);/g, function (_, n) { return String.fromCharCode(parseInt(n, 16)); })
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

async function rawGet(url) {
  try {
    var res = await Widget.http.get(url, { headers: pageHeaders(SITE + "/") });
    return res && res.data != null ? String(res.data) : "";
  } catch (e) {
    return "";
  }
}

function looksValid(text) {
  return !!text && text.length > 1000 && text.indexOf("站点维护中") < 0;
}

// 纯 JS base64 -> UTF-8 字符串（REX 环境无 Buffer/atob 保证）
function b64ToUtf8(b64) {
  var table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var clean = String(b64 || "").replace(/[^A-Za-z0-9+/=]/g, "");
  var bytes = [];
  var i, c1, c2, c3, c4;
  for (i = 0; i < clean.length; i += 4) {
    c1 = table.indexOf(clean.charAt(i));
    c2 = table.indexOf(clean.charAt(i + 1));
    var ch2 = clean.charAt(i + 2), ch3 = clean.charAt(i + 3);
    if (ch2 === "") ch2 = "=";
    if (ch3 === "") ch3 = "=";
    c3 = ch2 === "=" ? 0 : table.indexOf(ch2);
    c4 = ch3 === "=" ? 0 : table.indexOf(ch3);
    if (c1 < 0 || c2 < 0) break;
    bytes.push((c1 << 2) | (c2 >> 4));
    if (ch2 !== "=") bytes.push(((c2 & 15) << 4) | (c3 >> 2));
    if (ch3 !== "=") bytes.push(((c3 & 3) << 6) | c4);
  }
  var out = "";
  var j = 0;
  while (j < bytes.length) {
    var b = bytes[j];
    if (b < 0x80) { out += String.fromCharCode(b); j += 1; }
    else if (b < 0xE0) { out += String.fromCharCode(((b & 0x1F) << 6) | (bytes[j + 1] & 0x3F)); j += 2; }
    else if (b < 0xF0) { out += String.fromCharCode(((b & 0x0F) << 12) | ((bytes[j + 1] & 0x3F) << 6) | (bytes[j + 2] & 0x3F)); j += 3; }
    else {
      var cp = ((b & 0x07) << 18) | ((bytes[j + 1] & 0x3F) << 12) | ((bytes[j + 2] & 0x3F) << 6) | (bytes[j + 3] & 0x3F);
      cp -= 0x10000;
      out += String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 0x3FF));
      j += 4;
    }
  }
  return out;
}

// 域名自愈：从导航站解码最新可用域名（沿用蜘蛛方案；
// 站名匹配放宽为“包含”——导航里现名是“三级片资源，稀缺资源”，蜘蛛的精确等值已对不上）
async function refreshSite() {
  for (var n = 0; n < NAV_URLS.length; n++) {
    var text = "";
    try {
      var res = await Widget.http.get(NAV_URLS[n], { headers: pageHeaders() });
      text = res && res.data != null ? String(res.data) : "";
    } catch (e) { text = ""; }
    if (!text) continue;
    var blocks = text.match(/["']([A-Za-z0-9+/=]{100,})["']/g) || [];
    for (var b = 0; b < blocks.length; b++) {
      var raw = blocks[b].replace(/^["']|["']$/g, "");
      var decoded = "";
      try { decoded = b64ToUtf8(raw); } catch (e) { continue; }
      var unq = decoded;
      try { unq = decodeURIComponent(decoded); } catch (e) {}
      if (unq.indexOf("[") < 0) continue;
      if (unq.indexOf("稀缺资源") < 0 && unq.indexOf("蝴蝶") < 0) continue;
      var list = null;
      try { list = JSON.parse(unq.slice(unq.indexOf("["), unq.lastIndexOf("]") + 1)); } catch (e) { continue; }
      if (!Array.isArray(list)) continue;
      for (var k = 0; k < list.length; k++) {
        var item = list[k] || {};
        var name = String(item.name || "");
        if (name.indexOf("稀缺资源") < 0 && name.indexOf("蝴蝶") < 0) continue;
        var cands = [];
        if (item.url) cands.push(item.url);
        var subs = Array.isArray(item.urls) ? item.urls : [];
        for (var u = 0; u < subs.length; u++) {
          var uu = subs[u] && (subs[u].url || subs[u]);
          if (uu && cands.indexOf(uu) < 0) cands.push(uu);
        }
        for (var c = 0; c < cands.length; c++) {
          var om = String(cands[c]).match(/^(https?:\/\/[^/]+)/i);
          if (!om) continue;
          var origin = om[1];
          if (origin === SITE) return true;
          var probe = "";
          try {
            var pr = await Widget.http.get(origin + "/p/1", { headers: pageHeaders(origin + "/") });
            probe = pr && pr.data != null ? String(pr.data) : "";
          } catch (e) { probe = ""; }
          if (looksValid(probe)) { SITE = origin; return true; }
        }
      }
    }
  }
  return false;
}

// 取页面：先直连当前 SITE，失败/维护页时触发一次域名自愈后重试
async function fetchText(path) {
  var url = /^https?:\/\//i.test(path) ? path : SITE + path;
  // 绝对地址也收敛到当前 SITE（域名轮换后分类/详情链接仍可用）
  if (/^https?:\/\//i.test(path)) {
    var p = pathOf(path);
    if (p) url = SITE + p;
  }
  var text = await rawGet(url);
  if (looksValid(text)) return text;
  if (!siteRefreshTried) {
    siteRefreshTried = true;
    if (await refreshSite()) {
      var retryUrl = /^https?:\/\//i.test(path) ? SITE + pathOf(path) : SITE + path;
      var t2 = await rawGet(retryUrl);
      if (looksValid(t2)) return t2;
    }
  }
  return looksValid(text) ? text : "";
}

// 蜘蛛原解析：div.item 块（兜底 <a href="/数字">）
function parseCardList(htmlText) {
  var cards = [];
  var seen = {};
  if (!htmlText) return cards;

  var itemBlocks = [];
  var re1 = /(<div[^>]+class=["'][^"']*item[^"']*["'][\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/gi;
  var mm;
  while ((mm = re1.exec(htmlText)) !== null) itemBlocks.push(mm[1]);
  if (!itemBlocks.length) {
    var re2 = /(<a[^>]+href=["']\/\d+["'][\s\S]*?<\/a>)/gi;
    while ((mm = re2.exec(htmlText)) !== null) itemBlocks.push(mm[1]);
  }

  for (var i = 0; i < itemBlocks.length; i++) {
    var block = itemBlocks[i];
    var mHref = block.match(/href=["'](\/(\d+))["']/);
    if (!mHref) continue;
    var path = mHref[1];
    if (seen[path]) continue;

    var title = "";
    var mTitle = block.match(/title=["']([^"']+)["']/);
    if (mTitle) title = mTitle[1].trim();
    if (!title) {
      var mTxt = block.match(/>([^<]{1,30})<\/a>/);
      if (mTxt) {
        var cleanTxt = mTxt[1].trim();
        if (cleanTxt && cleanTxt.indexOf("fa-") !== 0) title = cleanTxt;
      }
    }
    if (!title) title = "视频 " + mHref[2];

    var imgSrc = "";
    var mImg = block.match(/(?:src|data-original|data-src)=["']([^"']+)["']/i);
    if (mImg) {
      var cand = mImg[1].trim();
      if (!/(logo|avatar|icon|\.svg)/i.test(cand)) imgSrc = absUrl(cand);
    }

    var remarks = "";
    var mRem = block.match(/class=["'][^"']*(?:badge|label|text-muted|remarks)[^"']*["'][^>]*>([^<]+)</i);
    if (mRem) remarks = mRem[1].trim();

    seen[path] = true;
    var link = SITE + path;
    cards.push({
      id: link,
      type: "url",
      title: htmlUnescape(title),
      posterPath: imgSrc,
      coverUrl: imgSrc,
      backdropPath: imgSrc,
      link: link,
      description: remarks || "",
      mediaType: "movie"
    });
  }
  return cards;
}

function tipCard(msg) {
  return [{ id: "tip", type: "url", title: msg }];
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var reqPath = String(params.path || "/p/1");
  if (reqPath === "/p/1" && params.sub) reqPath += String(params.sub);
  var queryParts = [];
  if (params.area) queryParts.push("area_id=" + encodeURIComponent(params.area));
  if (params.year) queryParts.push("year=" + encodeURIComponent(params.year));
  if (page > 1) queryParts.push("page=" + page);
  if (queryParts.length) reqPath += (reqPath.indexOf("?") >= 0 ? "&" : "?") + queryParts.join("&");
  try {
    var html = await fetchText(reqPath);
    var list = parseCardList(html);
    return list.length ? list : tipCard("没有找到相关影片");
  } catch (e) {
    return tipCard("载入失败: " + String((e && e.message) || e).slice(0, 50));
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
  if (!wd) return tipCard("输入关键词后搜索");
  var page = parseInt(params.page, 10) || 1;
  var url = "/search?q=" + encodeURIComponent(wd);
  if (page > 1) url += "&page=" + page;
  try {
    var html = await fetchText(url);
    var list = parseCardList(html);
    return list.length ? list : tipCard("没有找到相关影片");
  } catch (e) {
    return tipCard("搜索失败: " + String((e && e.message) || e).slice(0, 50));
  }
}

function firstM3u8(html) {
  var m = String(html || "").match(/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/);
  return m ? m[0].replace(/\\\//g, "/") : "";
}

function parseDetailMeta(html) {
  var name = "";
  var tm = html.match(/<title>(.*?)<\/title>/i);
  if (tm) name = tm[1].split("-")[0].trim();
  var pic = "";
  var og = html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (og) pic = absUrl(og[1].trim());
  var desc = "";
  var dm = html.match(/class=["'][^"']*(?:detail|intro|summary|content)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  if (dm) {
    var clean = dm[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (clean) desc = clean.slice(0, 250);
  }
  return { name: name, pic: pic, desc: desc };
}

// 从 /v/<id> 页提分集：锚点 href="/<id>/<n>"（class=seq），返回按集数排序的 [{n, href, name}]
function parseEpisodes(vHtml, showId) {
  var out = [];
  var seen = {};
  var re = /<a[^>]+href=["'](\/(\d+)\/(\d+))["'][^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(vHtml)) !== null) {
    if (m[2] !== String(showId)) continue;
    var href = m[1];
    if (seen[href]) continue;
    seen[href] = true;
    var n = parseInt(m[3], 10);
    var txt = m[4].replace(/<[^>]+>/g, "").trim();
    out.push({ n: n, href: href, name: /^\d+$/.test(txt) ? ("第" + txt + "集") : (txt || ("第" + n + "集")) });
  }
  out.sort(function (a, b) { return a.n - b.n; });
  return out;
}

function playHeaders() {
  return { "User-Agent": UA, "Referer": SITE + "/", "Origin": SITE };
}

async function loadDetail(link) {
  try {
    var path = pathOf(link);
    var pm = path.match(/^\/(\d+)(?:\/(\d+))?\/?$/);
    if (!pm) {
      return { id: String(link || ""), type: "url", title: "参数错误", description: "链接格式不对" };
    }
    var showId = pm[1];
    var html = await fetchText(path);
    if (!html) {
      return { id: String(link || ""), type: "url", title: "载入失败", description: "详情页拉取失败，请稍后重试" };
    }
    var meta = parseDetailMeta(html);
    var title = meta.name || "蝴蝶影院";
    var direct = firstM3u8(html);
    var abs = SITE + path;

    // 分集页（/<id>/<n>）本身就是单集，直接出流
    if (pm[2]) {
      if (direct) {
        return {
          id: abs, type: "detail", title: title, link: abs,
          posterPath: meta.pic, coverUrl: meta.pic, backdropPath: meta.pic,
          videoUrl: direct, playerType: "app", customHeaders: playHeaders()
        };
      }
      return { id: abs, type: "url", title: title, description: "未找到播放地址" };
    }

    // 查 /v/<id> 分集索引：>=2 集走 episodes 模式
    var vHtml = await fetchText("/v/" + showId);
    var eps = vHtml ? parseEpisodes(vHtml, showId) : [];
    if (eps.length >= 2) {
      return {
        id: abs,
        type: "url",
        title: title,
        link: abs,
        posterPath: meta.pic,
        coverUrl: meta.pic,
        backdropPath: meta.pic,
        description: meta.desc || "",
        episodes: eps.map(function (ep) {
          return { name: ep.name, link: SITE + ep.href };
        })
      };
    }
    if (direct) {
      return {
        id: abs, type: "detail", title: title, link: abs,
        posterPath: meta.pic, coverUrl: meta.pic, backdropPath: meta.pic,
        videoUrl: direct, playerType: "app", customHeaders: playHeaders()
      };
    }
    if (eps.length === 1) {
      return {
        id: abs,
        type: "url",
        title: title,
        link: abs,
        posterPath: meta.pic,
        coverUrl: meta.pic,
        backdropPath: meta.pic,
        description: meta.desc || "",
        episodes: [{ name: eps[0].name, link: SITE + eps[0].href }]
      };
    }
    return { id: abs, type: "url", title: title, description: "未找到播放地址" };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// 分集播放解析（stream 模块）：
// - 传入分集链接 /<id>/<n>：只解析该集
// - 传入剧链接 /<id>（或 /v/<id>）：逐集解析，连续 3 集失败即停
async function loadResource(params) {
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  var path = pathOf(raw);
  try {
    var epM = path.match(/^\/(\d+)\/(\d+)\/?$/);
    if (epM) {
      var epHtml = await fetchText(path);
      var u1 = firstM3u8(epHtml);
      if (!u1) return [];
      return [{ name: "第" + epM[2] + "集", url: u1, playerType: "app", customHeaders: playHeaders() }];
    }
    var showM = path.match(/^\/(?:v\/)?(\d+)\/?$/);
    if (!showM) return [];
    var showId = showM[1];
    // 先试详情页直链（单片）
    var dHtml = await fetchText("/" + showId);
    var vHtml2 = await fetchText("/v/" + showId);
    var eps2 = vHtml2 ? parseEpisodes(vHtml2, showId) : [];
    if (eps2.length < 2) {
      var du = firstM3u8(dHtml);
      if (du) return [{ name: "正片", url: du, playerType: "app", customHeaders: playHeaders() }];
      if (eps2.length === 0) return [];
      // 只剩 1 集时落到下面的逐集解析
    }
    var out = [];
    var misses = 0;
    for (var i = 0; i < eps2.length && out.length < 300; i++) {
      var h = await fetchText(eps2[i].href);
      var u = firstM3u8(h);
      if (!u) {
        misses++;
        if (misses >= 3) break;
        continue;
      }
      misses = 0;
      out.push({ name: eps2[i].name, url: u, playerType: "app", customHeaders: playHeaders() });
    }
    return out;
  } catch (e) {
    return [];
  }
}
