// HoHoJ for REX (lai_hohoj v1.0.0)
// 移植自 mira-cat 蜘蛛 hohoj.js (py_hohoj)，只读蓝图移植，未改动猫源。
// 后端：https://hohoj.tv（自建站，非 MacCMS），封面/流媒体走姊妹 CDN ggjav.com。
// 结构与蜘蛛一致：列表卡片全站统一 (video-item)，分类 = 固定区 6 + 主分类 12 + 子标签 54 + 女優 12；
// 播放一步直取：详情页 iframe /embed?id={} 页内 videoSrc 直接写明 m3u8。
// 全站无登录、无 VIP 锁定（蜘蛛 2026-10-20 实测）。

WidgetMetadata = {
  id: "lai_hohoj",
  title: "HoHoJ",
  description: "HoHoJ（hohoj.tv）：最新/熱門/有碼/無碼/中文字幕/歐美、主分類、標籤與女優分類，播放直取 m3u8",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://hohoj.tv",
  detailCacheDuration: 180,
  modules: [
    {
      title: "精選",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "分區",
          type: "enumeration",
          value: "search?type=all&order=latest",
          enumOptions: [
            { title: "最新", value: "search?type=all&order=latest" },
            { title: "熱門", value: "search?type=all&order=popular" },
            { title: "有碼", value: "search?type=censored&order=latest" },
            { title: "無碼", value: "search?type=uncensored&order=latest" },
            { title: "中文字幕", value: "search?type=chinese&order=latest" },
            { title: "歐美", value: "search?type=europe&order=latest" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "主分類",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "分類",
          type: "enumeration",
          value: "main_ctg?id=1",
          enumOptions: [
            { title: "絲襪美腿", value: "main_ctg?id=1" },
            { title: "強姦凌辱", value: "main_ctg?id=2" },
            { title: "主奴調教", value: "main_ctg?id=3" },
            { title: "制服誘惑", value: "main_ctg?id=4" },
            { title: "多P群交", value: "main_ctg?id=5" },
            { title: "角色劇情", value: "main_ctg?id=6" },
            { title: "出軌", value: "main_ctg?id=7" },
            { title: "亂倫", value: "main_ctg?id=8" },
            { title: "巨乳美乳", value: "main_ctg?id=9" },
            { title: "潮吹放尿", value: "main_ctg?id=10" },
            { title: "走後門", value: "main_ctg?id=11" },
            { title: "內射受孕", value: "main_ctg?id=12" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "標籤",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "標籤",
          type: "enumeration",
          value: "ctg?id=2",
          enumOptions: [
            { title: "DMM獨家", value: "ctg?id=1" },
            { title: "中出", value: "ctg?id=2" },
            { title: "單體作品", value: "ctg?id=4" },
            { title: "戲劇", value: "ctg?id=5" },
            { title: "數位馬賽克", value: "ctg?id=6" },
            { title: "高畫質", value: "ctg?id=8" },
            { title: "口交", value: "ctg?id=10" },
            { title: "巨乳", value: "ctg?id=11" },
            { title: "乳交", value: "ctg?id=13" },
            { title: "人妻", value: "ctg?id=18" },
            { title: "成熟的女人", value: "ctg?id=19" },
            { title: "已婚婦女", value: "ctg?id=21" },
            { title: "白人", value: "ctg?id=26" },
            { title: "凌辱", value: "ctg?id=28" },
            { title: "自慰", value: "ctg?id=31" },
            { title: "苗條", value: "ctg?id=34" },
            { title: "OL", value: "ctg?id=39" },
            { title: "通姦", value: "ctg?id=40" },
            { title: "打手槍", value: "ctg?id=46" },
            { title: "深喉", value: "ctg?id=47" },
            { title: "婆婆", value: "ctg?id=54" },
            { title: "連褲襪", value: "ctg?id=61" },
            { title: "業餘", value: "ctg?id=64" },
            { title: "痴女", value: "ctg?id=65" },
            { title: "女教師", value: "ctg?id=69" },
            { title: "淫語", value: "ctg?id=73" },
            { title: "乳房", value: "ctg?id=75" },
            { title: "按摩棒", value: "ctg?id=91" },
            { title: "處女", value: "ctg?id=93" },
            { title: "無毛", value: "ctg?id=100" },
            { title: "混血", value: "ctg?id=103" },
            { title: "1080p", value: "ctg?id=108" },
            { title: "吞精", value: "ctg?id=111" },
            { title: "角色扮演", value: "ctg?id=116" },
            { title: "69", value: "ctg?id=119" },
            { title: "舔陰", value: "ctg?id=120" },
            { title: "手淫", value: "ctg?id=123" },
            { title: "口內射精", value: "ctg?id=126" },
            { title: "美腿", value: "ctg?id=129" },
            { title: "美人", value: "ctg?id=136" },
            { title: "60fps", value: "ctg?id=138" },
            { title: "AV女優", value: "ctg?id=139" },
            { title: "美臀", value: "ctg?id=141" },
            { title: "肛交", value: "ctg?id=163" },
            { title: "4K", value: "ctg?id=181" },
            { title: "野外", value: "ctg?id=193" },
            { title: "按摩", value: "ctg?id=197" },
            { title: "黑髮", value: "ctg?id=223" },
            { title: "教師", value: "ctg?id=224" },
            { title: "國外進口", value: "ctg?id=249" },
            { title: "女職員", value: "ctg?id=270" },
            { title: "無套", value: "ctg?id=281" },
            { title: "束縛", value: "ctg?id=286" },
            { title: "浴衣和服", value: "ctg?id=330" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "女優",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "女優",
          type: "enumeration",
          value: "model?id=41",
          enumOptions: [
            { title: "素人", value: "model?id=404" },
            { title: "三上悠亞", value: "model?id=41" },
            { title: "波多野結衣", value: "model?id=43" },
            { title: "北野未奈", value: "model?id=93" },
            { title: "凪光", value: "model?id=990" },
            { title: "篠田優", value: "model?id=44" },
            { title: "JULIA", value: "model?id=342" },
            { title: "河北彩花", value: "model?id=586" },
            { title: "楓可憐", value: "model?id=19" },
            { title: "森澤佳奈", value: "model?id=1002" },
            { title: "深田詠美", value: "model?id=63" },
            { title: "飯岡加奈子", value: "model?id=47" }
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

var SITE = "https://hohoj.tv";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": referer || SITE + "/"
  };
}

async function fetchText(url, referer) {
  var res = await Widget.http.get(url, { headers: pageHeaders(referer), timeout: 20000 });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function clean(s) {
  return String(s == null ? "" : s).trim()
    .replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/\s+/g, " ");
}

// 与蜘蛛 parseCards 同一套正则：按 video-item 块切分，取 id / 封面 / 标题 / 播放量
function parseCards(html) {
  var out = [];
  var seen = {};
  var blocks = String(html || "").split('<div class="video-item ');
  for (var i = 1; i < blocks.length; i++) {
    var b = blocks[i];
    var idM = b.match(/href="\/video\?id=(\d+)"/);
    if (!idM) continue;
    var id = idM[1];
    if (seen[id]) continue;
    seen[id] = true;
    var pic = "";
    var picM = b.match(/<img[^>]+src="(https?:\/\/[^"]+\/media\/video\/[^"]+)"/);
    if (picM) pic = picM[1];
    var title = "";
    var tM = b.match(/video-item-title[^>]*>([^<]+)</);
    if (tM) title = clean(tM[1]);
    if (!title) {
      var altM = b.match(/<img[^>]+alt="([^"]*)"/);
      if (altM) title = clean(altM[1]);
    }
    var remarks = "";
    var vM = b.match(/fa-eye"[^>]*><\/i>\s*<span[^>]*>([^<]+)<\/span>/);
    if (vM) remarks = clean(vM[1]) + " 播放";
    var link = SITE + "/video?id=" + id;
    out.push({
      id: link,
      type: "url",
      title: title || id,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: remarks,
      mediaType: "movie"
    });
  }
  return out;
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var path = String(params.path || "search?type=all&order=latest").replace(/^\/+/, "");
  var url = SITE + "/" + path + (path.indexOf("?") >= 0 ? "&" : "?") + "p=" + page;
  try {
    var html = await fetchText(url);
    var cards = parseCards(html);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
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
  var keyword = pickKeyword(params);
  if (!keyword) {
    return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  }
  var page = parseInt(params.page, 10) || 1;
  var url = SITE + "/search?text=" + encodeURIComponent(keyword) + "&p=" + page;
  try {
    var html = await fetchText(url);
    var cards = parseCards(html);
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "搜索失败: " + msg.slice(0, 50), description: msg }];
  }
}

async function loadDetail(link) {
  try {
    var raw = String(link || "");
    var idm = raw.match(/id=(\d+)/) || raw.match(/^(\d+)$/) || raw.match(/(\d+)/);
    if (!idm) {
      return { id: raw, type: "url", title: "参数错误", description: "链接里没有影片 id" };
    }
    var id = idm[1];
    var durl = SITE + "/video?id=" + id;
    var html = await fetchText(durl);

    var name = "";
    var h5 = html.match(/<h5[^>]*>([^<]+)<\/h5>/);
    if (h5) name = clean(h5[1]);
    if (!name) {
      var og = html.match(/property="og:title"\s+content="([^"]+)"/);
      if (og) name = clean(og[1]);
    }
    var pic = "";
    var pm = html.match(/(https?:\/\/[^"]+\/media\/video\/large_[^"]+)/);
    if (pm) pic = pm[1];
    var actors = [];
    var seenA = {};
    var am;
    var aRe = /\/model\?id=\d+&name=([^"&]+)/g;
    while ((am = aRe.exec(html)) !== null) {
      var an = clean(decodeURIComponent(am[1]));
      if (an && !seenA[an]) { seenA[an] = true; actors.push(an); }
    }
    var date = "";
    var dm = html.match(/<span>(\d{4}-\d{2}-\d{2})<\/span>/);
    if (dm) date = dm[1];

    // 播放：embed 页 videoSrc / <video src> 直接写明 m3u8（与蜘蛛 play 一步直取一致）
    var eurl = SITE + "/embed?id=" + id;
    var ehtml = await fetchText(eurl, durl);
    var m = ehtml.match(/videoSrc\s*=\s*"(https?:\/\/[^"]+?\.m3u8)"/) || ehtml.match(/<video[^>]+src="(https?:\/\/[^"]+?\.m3u8)"/);
    if (!m) {
      return {
        id: durl, type: "url", title: name || id,
        posterPath: pic, coverUrl: pic, backdropPath: pic,
        link: durl, description: "未找到播放地址"
      };
    }
    // 个别文件名带空格，编码掉再返回（蜘蛛实测 %20 后播放列表/分片均 200）
    var videoUrl = m[1].replace(/ /g, "%20");
    var desc = [];
    if (actors.length) desc.push("女優：" + actors.join(", "));
    if (date) desc.push("日期：" + date);
    return {
      id: durl,
      type: "detail",
      title: name || id,
      link: durl,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      videoUrl: videoUrl,
      playerType: "app",
      description: desc.join(" ") || name || "",
      customHeaders: {
        "User-Agent": UA,
        "Referer": eurl
      }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
