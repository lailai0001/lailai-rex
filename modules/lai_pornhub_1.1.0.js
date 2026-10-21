// Pornhub for REX (lai_pornhub v1.1.0)
// 来源蓝图: mira-cat 蜘蛛 pornhub.js (py_pornhub), 只读移植, 未改动原蜘蛛。
// 后端: https://cn.pornhub.com, 列表/搜索页 li.videoBox 解析, 详情页 flashvars 的
//       mediaDefinitions 里取 format=hls 的 master.m3u8。
// 与蜘蛛的两点口径说明:
//   1) UA 沿用蜘蛛的 Windows Chrome UA —— 站方按 UA 返回不同版式, iPhone UA 返回的
//      移动版列表页没有 li.videoBox 结构 (实测), 桌面版式才可解析; 详情页两种 UA 都有 flashvars。
//   2) 蜘蛛取 hls 定义的最后一条, 实测顺序不按画质排列 (样本为 1080/240/480/720,
//      蜘蛛口径只拿到 720); 本模块按 height 取最高档, 落实"尽量最高画质"。

WidgetMetadata = {
  id: "lai_pornhub",
  title: "Pornhub",
  description: "Pornhub（cn.pornhub.com）：6 个排序 + 96 个内容分类（站方分类页全集，逐个实测第 1 页 34 张满卡），播放取最高画质 HLS",
  author: "lai",
  version: "1.1.0",
  requiredVersion: "0.0.1",
  site: "https://cn.pornhub.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "视频",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "分类",
          type: "enumeration",
          value: "sy",
          enumOptions: [
            { title: "Home", value: "sy" },
            { title: "Newest", value: "cm" },
            { title: "Most Viewed", value: "mv" },
            { title: "Hottest", value: "ht" },
            { title: "Top Rated", value: "tr" },
            { title: "Longest", value: "lg" },
            { title: "女同", value: "c27" },
            { title: "辣妈", value: "c29" },
            { title: "爆菊", value: "c35" },
            { title: "3P", value: "c65" },
            { title: "熟女", value: "c28" },
            { title: "黑人女", value: "c17" },
            { title: "日本人", value: "c111" },
            { title: "老少欢", value: "c181" },
            { title: "巨乳", value: "c8" },
            { title: "公众野战", value: "c24" },
            { title: "卡通", value: "c86" },
            { title: "捆绑", value: "c10" },
            { title: "内射中出", value: "c15" },
            { title: "轮交", value: "c80" },
            { title: "巨屌", value: "c7" },
            { title: "手淫", value: "c22" },
            { title: "潮吹", value: "c69" },
            { title: "大号美女", value: "c6" },
            { title: "女性自慰", value: "c492" },
            { title: "Trans With Girl", value: "c572" },
            { title: "独家", value: "c115" },
            { title: "跨种族", value: "c25" },
            { title: "贫乳", value: "c59" },
            { title: "FFM", value: "c761" },
            { title: "60帧", value: "c105" },
            { title: "Cosplay", value: "c241" },
            { title: "乱交群欢", value: "c2" },
            { title: "亚洲人", value: "c1" },
            { title: "佩戴式阳具", value: "c542" },
            { title: "俄国人", value: "c99" },
            { title: "内嵌字幕", value: "c732" },
            { title: "劲爆重口味", value: "c21" },
            { title: "无码卡通", value: "c712" },
            { title: "印度人", value: "c101" },
            { title: "双性恋男", value: "c76" },
            { title: "双龙入洞", value: "c72" },
            { title: "口交", value: "c13" },
            { title: "古典派", value: "c43" },
            { title: "合集", value: "c57" },
            { title: "名人", value: "c12" },
            { title: "Scissoring", value: "c532" },
            { title: "女性高潮", value: "c502" },
            { title: "娇妻偷吃", value: "c242" },
            { title: "射精", value: "c16" },
            { title: "已认证情侣", value: "c482" },
            { title: "已认证模特", value: "c139" },
            { title: "已认证素人", value: "c138" },
            { title: "巴西人", value: "c102" },
            { title: "德国人", value: "c95" },
            { title: "性玩具", value: "c23" },
            { title: "恋物癖", value: "c18" },
            { title: "恋足", value: "c93" },
            { title: "意大利人", value: "c97" },
            { title: "手交", value: "c20" },
            { title: "抽烟", value: "c91" },
            { title: "拉丁裔美女", value: "c26" },
            { title: "拳交", value: "c19" },
            { title: "指交", value: "c592" },
            { title: "按摩", value: "c78" },
            { title: "捷克人", value: "c100" },
            { title: "搞笑", value: "c32" },
            { title: "撒尿", value: "c211" },
            { title: "播客", value: "c891" },
            { title: "校园", value: "c88" },
            { title: "欧洲人", value: "c55" },
            { title: "法国人", value: "c94" },
            { title: "浪漫", value: "c522" },
            { title: "深发女", value: "c11" },
            { title: "滑稽模仿", value: "c201" },
            { title: "火辣保姆", value: "c89" },
            { title: "片场直击", value: "c141" },
            { title: "男性自慰", value: "c92" },
            { title: "真人实拍", value: "c31" },
            { title: "第一视角", value: "c41" },
            { title: "粗暴性爱", value: "c67" },
            { title: "素人", value: "c3" },
            { title: "红毛", value: "c42" },
            { title: "纹身女", value: "c562" },
            { title: "继家庭幻想", value: "c444" },
            { title: "聚会", value: "c53" },
            { title: "肌肉男", value: "c512" },
            { title: "肥臀", value: "c4" },
            { title: "脱衣舞", value: "c33" },
            { title: "舔屄", value: "c131" },
            { title: "无码动漫", value: "c722" },
            { title: "英国人", value: "c96" },
            { title: "360°", value: "c612" },
            { title: "视频激情", value: "c61" },
            { title: "角色扮演", value: "c81" },
            { title: "试镜", value: "c90" },
            { title: "赌博", value: "c881" },
            { title: "金发女", value: "c9" },
            { title: "阿拉伯人", value: "c98" },
            { title: "集体颜射", value: "c14" },
            { title: "韩国人", value: "c103" },
            { title: "音乐", value: "c121" }
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

var BASE = "https://cn.pornhub.com";
// 沿用蜘蛛 UA (理由见文件头注释)
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function pageHeaders() {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
  };
}

function playHeaders() {
  return {
    "User-Agent": UA,
    "Origin": BASE,
    "Referer": BASE + "/"
  };
}

async function fetchText(url) {
  var res = await Widget.http.get(url, { headers: pageHeaders() });
  var body = res && res.data != null ? String(res.data) : "";
  if (!body) throw new Error("空回应");
  return body;
}

function absLink(href) {
  var s = String(href || "").split("#")[0];
  if (/^https?:\/\//i.test(s)) return s;
  if (s.charAt(0) === "/") return BASE + s;
  return BASE + "/" + s;
}

// 与蜘蛛 Rye/Oye 相同的选择器解析列表页
function parseList(html) {
  if (!html) return [{ id: "empty", type: "url", title: "空页面" }];
  var $ = Widget.html.load(html);
  var out = [];
  $("li.videoBox").each(function (i, el) {
    var $box = $(el);
    var href = $box.find(".phimage a.img").attr("href") || "";
    if (!href) return;
    var title = $box.find(".title a").attr("title") || $box.find(".title a").text().replace(/\s+/g, " ").trim();
    var $img = $box.find(".phimage a.img img");
    var pic = $img.attr("src") || $img.attr("data-mediumthumb") || "";
    var views = $box.find(".views").text().replace(/\s+/g, " ").trim();
    var duration = $box.find(".duration").text().replace(/\s+/g, " ").trim();
    var link = absLink(href);
    var descParts = [];
    if (views) descParts.push(views);
    if (duration) descParts.push(duration);
    out.push({
      id: link,
      type: "url",
      title: title || link,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: link,
      description: descParts.join(" · "),
      releaseDate: duration || "",
      mediaType: "movie"
    });
  });
  return out.length ? out : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
}

async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var cat = String(params.path || "sy");
  // 与蜘蛛 Rye 相同的 URL 拼法; c<数字> 为站方内容分类 (/video?c=<id>, v1.1.0 新增)
  var url = BASE + "/video?";
  var catM = /^c(\d+)$/.exec(cat);
  if (catM) url = BASE + "/video?c=" + catM[1];
  else if (cat !== "sy") url = BASE + "/video?o=" + cat;
  if (page > 1) url += (cat === "sy" ? "page=" : "&page=") + page;
  try {
    var html = await fetchText(url);
    return parseList(html);
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
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!keyword) return [{ id: "tip", type: "url", title: "输入关键词搜索" }];
  var url = BASE + "/video/search?search=" + encodeURIComponent(keyword) + "&page=" + page;
  try {
    var html = await fetchText(url);
    return parseList(html);
  } catch (e) {
    var msg = String((e && e.message) || e);
    return [{ id: "err", type: "url", title: "载入失败: " + msg.slice(0, 50), description: msg + " | URL: " + url }];
  }
}

async function loadDetail(link) {
  try {
    var url = absLink(link);
    var html = await fetchText(url);

    // 与蜘蛛 Iye 相同的 flashvars 提取; 在其基础上按 height 挑最高档 hls
    var videoUrl = "";
    var m = html.match(/var flashvars_.* = \{(.*?)\};/);
    if (m && m[1]) {
      try {
        var fv = JSON.parse("{" + m[1] + "}");
        var defs = (fv.mediaDefinitions || []).filter(function (d) { return d && d.format === "hls" && d.videoUrl; });
        var best = null;
        for (var i = 0; i < defs.length; i++) {
          var h = parseInt(defs[i].height || defs[i].quality, 10) || 0;
          if (!best || h > best.h) best = { h: h, url: defs[i].videoUrl };
        }
        if (best) videoUrl = best.url;
      } catch (_) {}
    }

    var title = "";
    var cover = "";
    try {
      var $ = Widget.html.load(html);
      title = $("h1.title").text().replace(/\s+/g, " ").trim() || $('meta[property="og:title"]').attr("content") || "";
      cover = $('meta[property="og:image"]').attr("content") || "";
    } catch (_) {}
    if (!title) {
      var tm = html.match(/<title[^>]*>([^<]+)/i);
      title = tm ? tm[1].replace(/\s*[|].*$/, "").trim() : "Pornhub";
    }

    if (!videoUrl) {
      return { id: url, type: "url", title: title || "解析失败", description: "未找到播放地址" };
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
      customHeaders: playHeaders()
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
