// 肉多多 for REX (lai_rdd22 v1.0.0)
// 移植自 mira-cat 蜘蛛 rdd22.js（只读蓝图），后端 https://www.rdd22.top/。
// 注意：肉多多 ≠ 肉视频（肉视频已在 REX 里，id lai_rou，不要混淆）。
// 站点结构：列表走 JSON API，详情页直给 m3u8，无墙无门（直连 200）。
// 列表 API：/factory/api/category.php?id=<分类id>&field=category_id|parent_category_id&sort=latest&page=<N>
//   返回 {status, data:[{id,title,tags,cover_image_url,url,category,parent_category_id,content_id,created_at_timestamp}], pagination:{totalHits,page,limit:12}}
// 搜索 API：/factory/api/search.php?q=<词>&type=video&sort=latest&page=<N>（同格式）。
// 详情页：/videos/<前3位>/<id>.html，播放器 <div class="video-player-container" data-m3u8="..."> 直给 m3u8，
//   <video poster> 为封面，<h1> 为标题。单档实话：每片只有一条 m3u8（master 恰好 1 个变体，
//   多为 1280x720/2000k，个别 720x406/1500k），站方只给一条流，无分辨率可选，不编档位。
//   分片是 .jpg 后缀伪装的 TS（个别 AES-128），iOS 原生 HLS 可播；封面直链无防盗链。
// 分类：首页最新（国产452+番号453 两父级最新合并按时间排）+ 热门排行（首页国产排行 10 条，单页）
//   + 国产全部 + 番号全部 + 25 个视频分类 + 刷视频（竖屏 feed，单页 12 条）+ 153 个标签（走搜索 API）。
// 不进分类：成人小说/动图专区/美图写真/成人漫画（图文无视频）、番号磁力/国产磁力（磁力无流）。
// 门：本站当前无门；getHtml 内留了与悟空同款的 xk_gate 过门兜底（若日后站方加门，自动取 token 设 Cookie 再取）。

WidgetMetadata = {
  id: "lai_rdd22",
  title: "肉多多",
  description: "肉多多：JSON API 站，首页最新/热门排行/国产/番号/刷视频 + 25 视频分类/153 标签筛选，详情单档 m3u8",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://www.rdd22.top",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "首页最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "热门排行", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "hot" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "国产全部", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "p452" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "番号全部", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "p453" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "刷视频", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "brush" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "视频分类", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "cat" }, { name: "sub", title: "分类", type: "enumeration", value: "454", enumOptions: [{"title": "国产传媒", "value": "c454"}, {"title": "探花交友", "value": "c455"}, {"title": "网曝黑料", "value": "c456"}, {"title": "绿帽出轨", "value": "c457"}, {"title": "国产乱伦", "value": "c458"}, {"title": "主播自拍", "value": "c460"}, {"title": "户外露出", "value": "c461"}, {"title": "福利姬", "value": "c490"}, {"title": "中文字幕", "value": "c462"}, {"title": "无码破解", "value": "c463"}, {"title": "熟女人妻", "value": "c464"}, {"title": "巨乳美乳", "value": "c465"}, {"title": "少女萝莉", "value": "c466"}, {"title": "强奸乱伦", "value": "c468"}, {"title": "SM调教", "value": "c469"}, {"title": "VR视角", "value": "c489"}, {"title": "剧情演绎", "value": "c459"}, {"title": "制服诱惑", "value": "c467"}, {"title": "欧美视频", "value": "c483"}, {"title": "成人动漫", "value": "c484"}, {"title": "三级伦理", "value": "c485"}, {"title": "AI换脸", "value": "c486"}, {"title": "AV解说", "value": "c487"}, {"title": "女同性恋", "value": "c488"}, {"title": "AI短剧", "value": "c1160"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "标签", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "tag" }, { name: "sub", title: "标签", type: "enumeration", value: "动漫", enumOptions: [{"title": "标签·动漫", "value": "动漫"}, {"title": "标签·生姦", "value": "生姦"}, {"title": "标签·老人", "value": "老人"}, {"title": "标签·喷水", "value": "喷水"}, {"title": "标签·轮奸", "value": "轮奸"}, {"title": "标签·自慰", "value": "自慰"}, {"title": "标签·御姐", "value": "御姐"}, {"title": "标签·黑逼", "value": "黑逼"}, {"title": "标签·熟女", "value": "熟女"}, {"title": "标签·深喉", "value": "深喉"}, {"title": "标签·肉感", "value": "肉感"}, {"title": "标签·五十路", "value": "五十路"}, {"title": "标签·学生", "value": "学生"}, {"title": "标签·少妇", "value": "少妇"}, {"title": "标签·阿姨", "value": "阿姨"}, {"title": "标签·人妻", "value": "人妻"}, {"title": "标签·护士", "value": "护士"}, {"title": "标签·空姐", "value": "空姐"}, {"title": "标签·老师", "value": "老师"}, {"title": "标签·姐姐", "value": "姐姐"}, {"title": "标签·女友", "value": "女友"}, {"title": "标签·主播", "value": "主播"}, {"title": "标签·技师", "value": "技师"}, {"title": "标签·妈妈", "value": "妈妈"}, {"title": "标签·闺蜜", "value": "闺蜜"}, {"title": "标签·老婆", "value": "老婆"}, {"title": "标签·同事", "value": "同事"}, {"title": "标签·乳交", "value": "乳交"}, {"title": "标签·内射", "value": "内射"}, {"title": "标签·颜射", "value": "颜射"}, {"title": "标签·口爆", "value": "口爆"}, {"title": "标签·双飞", "value": "双飞"}, {"title": "标签·强推", "value": "强推"}, {"title": "标签·吞精", "value": "吞精"}, {"title": "标签·出轨", "value": "出轨"}, {"title": "标签·多p", "value": "多p"}, {"title": "标签·打飞机", "value": "打飞机"}, {"title": "标签·嫖娼", "value": "嫖娼"}, {"title": "标签·失禁", "value": "失禁"}, {"title": "标签·足交", "value": "足交"}, {"title": "标签·露出", "value": "露出"}, {"title": "标签·丰满", "value": "丰满"}, {"title": "标签·长腿", "value": "长腿"}, {"title": "标签·大屁股", "value": "大屁股"}, {"title": "标签·蜜桃臀", "value": "蜜桃臀"}, {"title": "标签·娇小", "value": "娇小"}, {"title": "标签·翘臀", "value": "翘臀"}, {"title": "标签·苗条", "value": "苗条"}, {"title": "标签·肥臀", "value": "肥臀"}, {"title": "标签·微胖", "value": "微胖"}, {"title": "标签·美腿", "value": "美腿"}, {"title": "标签·高挑", "value": "高挑"}, {"title": "标签·e奶", "value": "e奶"}, {"title": "标签·黑丝", "value": "黑丝"}, {"title": "标签·JK", "value": "JK"}, {"title": "标签·眼镜", "value": "眼镜"}, {"title": "标签·丝袜", "value": "丝袜"}, {"title": "标签·蕾丝", "value": "蕾丝"}, {"title": "标签·女仆", "value": "女仆"}, {"title": "标签·白丝", "value": "白丝"}, {"title": "标签·双马尾", "value": "双马尾"}, {"title": "标签·肉丝", "value": "肉丝"}, {"title": "标签·高跟", "value": "高跟"}, {"title": "标签·瑜伽裤", "value": "瑜伽裤"}, {"title": "标签·短裙", "value": "短裙"}, {"title": "标签·兔女郎", "value": "兔女郎"}, {"title": "标签·紧身裤", "value": "紧身裤"}, {"title": "标签·包臀裙", "value": "包臀裙"}, {"title": "标签·开档", "value": "开档"}, {"title": "标签·被强奸", "value": "被强奸"}, {"title": "标签·极品女神", "value": "极品女神"}, {"title": "标签·乱伦国产", "value": "乱伦国产"}, {"title": "标签·骚妻", "value": "骚妻"}, {"title": "标签·萝莉", "value": "萝莉"}, {"title": "标签·柏木", "value": "柏木"}, {"title": "标签·巨乳人妻", "value": "巨乳人妻"}, {"title": "标签·社长", "value": "社长"}, {"title": "标签·凌辱母", "value": "凌辱母"}, {"title": "标签·鱼子酱", "value": "鱼子酱"}, {"title": "标签·无码", "value": "无码"}, {"title": "标签·颜射合集", "value": "颜射合集"}, {"title": "标签·小倉奈々", "value": "小倉奈々"}, {"title": "标签·女同性恋", "value": "女同性恋"}, {"title": "标签·换脸", "value": "换脸"}, {"title": "标签·美鲍", "value": "美鲍"}, {"title": "标签·殘忍畫面", "value": "殘忍畫面"}, {"title": "标签·淫乱", "value": "淫乱"}, {"title": "标签·中文字幕", "value": "中文字幕"}, {"title": "标签·合集", "value": "合集"}, {"title": "标签·回春", "value": "回春"}, {"title": "标签·极品御姐", "value": "极品御姐"}, {"title": "标签·传媒", "value": "传媒"}, {"title": "标签·巨乳", "value": "巨乳"}, {"title": "标签·熟女人妻", "value": "熟女人妻"}, {"title": "标签·修仙", "value": "修仙"}, {"title": "标签·按摩", "value": "按摩"}, {"title": "标签·乱伦", "value": "乱伦"}, {"title": "标签·探花", "value": "探花"}, {"title": "标签·口活", "value": "口活"}, {"title": "标签·操我", "value": "操我"}, {"title": "标签·真实", "value": "真实"}, {"title": "标签·欧美", "value": "欧美"}, {"title": "标签·女儿", "value": "女儿"}, {"title": "标签·短篇全集", "value": "短篇全集"}, {"title": "标签·双插", "value": "双插"}, {"title": "标签·肛交", "value": "肛交"}, {"title": "标签·反差", "value": "反差"}, {"title": "标签·電车", "value": "電车"}, {"title": "标签·女神", "value": "女神"}, {"title": "标签·小野", "value": "小野"}, {"title": "标签·上司", "value": "上司"}, {"title": "标签·巨乳眼镜妹", "value": "巨乳眼镜妹"}, {"title": "标签·内衣", "value": "内衣"}, {"title": "标签·本郷愛", "value": "本郷愛"}, {"title": "标签·母子", "value": "母子"}, {"title": "标签·高颜值", "value": "高颜值"}, {"title": "标签·榨干", "value": "榨干"}, {"title": "标签·偷拍", "value": "偷拍"}, {"title": "标签·网爆", "value": "网爆"}, {"title": "标签·口交学", "value": "口交学"}, {"title": "标签·黑人", "value": "黑人"}, {"title": "标签·炮友", "value": "炮友"}, {"title": "标签·沙龙", "value": "沙龙"}, {"title": "标签·后入", "value": "后入"}, {"title": "标签·勾引", "value": "勾引"}, {"title": "标签·展示", "value": "展示"}, {"title": "标签·美少年", "value": "美少年"}, {"title": "标签·羽月希", "value": "羽月希"}, {"title": "标签·女操男", "value": "女操男"}, {"title": "标签·跳跳", "value": "跳跳"}, {"title": "标签·孕妇", "value": "孕妇"}, {"title": "标签·银行", "value": "银行"}, {"title": "标签·制服美少女", "value": "制服美少女"}, {"title": "标签·健身", "value": "健身"}, {"title": "标签·调教", "value": "调教"}, {"title": "标签·极品自慰", "value": "极品自慰"}, {"title": "标签·同学", "value": "同学"}, {"title": "标签·多毛", "value": "多毛"}, {"title": "标签·体液", "value": "体液"}, {"title": "标签·风骚", "value": "风骚"}, {"title": "标签·红楼", "value": "红楼"}, {"title": "标签·結婚", "value": "結婚"}, {"title": "标签·情侣自拍", "value": "情侣自拍"}, {"title": "标签·短剧", "value": "短剧"}, {"title": "标签·露乳", "value": "露乳"}, {"title": "标签·跳蛋", "value": "跳蛋"}, {"title": "标签·吃鸡巴", "value": "吃鸡巴"}, {"title": "标签·名媛", "value": "名媛"}, {"title": "标签·小骚逼", "value": "小骚逼"}, {"title": "标签·女同", "value": "女同"}, {"title": "标签·骚气", "value": "骚气"}, {"title": "标签·醉酒", "value": "醉酒"}, {"title": "标签·秀人网", "value": "秀人网"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://www.rdd22.top";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// gate cookie 缓存（本站当前无门；若日后加门，复用悟空同款逻辑）
var gateCookie = "";

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

function headers(isJson) {
  var h = {
    "User-Agent": UA,
    "Accept": isJson ? "application/json, text/plain, */*" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Referer": HOST + "/home"
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

async function rawGet(url, isJson) {
  try {
    var res = await Widget.http.get(url, { headers: headers(isJson) });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body;
  } catch (e) {
    return "";
  }
}

// 取页：先 GET；若回 gate 页（含 xkEnter + var token），取 token 设 Cookie 再 GET 一次，
// cookie 缓存供后续调用复用；若某次调用又命中 gate 页（cookie 过期），重新取 token。
async function getHtml(url, isJson) {
  var html = await rawGet(url, isJson);
  if (isGatePage(html)) {
    var tok = extractGateToken(html);
    if (tok) {
      gateCookie = "xk_gate=" + tok;
      html = await rawGet(url, isJson);
    }
  }
  if (isGatePage(html)) {
    var tok2 = extractGateToken(html);
    if (tok2) {
      gateCookie = "xk_gate=" + tok2;
      html = await rawGet(url, isJson);
    }
  }
  return isGatePage(html) ? "" : html;
}

// API 条目 -> 卡片（vod_id 用详情相对地址，loadDetail 直接 GET 它）
function apiToCard(it) {
  if (!it || !it.url) return null;
  var tags = Array.isArray(it.tags) ? it.tags.filter(Boolean) : [];
  var link = String(it.url);
  return {
    id: link,
    type: "url",
    title: decodeHtml(it.title) || ("视频 " + (it.content_id || "")),
    posterPath: absUrl(it.cover_image_url),
    coverUrl: absUrl(it.cover_image_url),
    backdropPath: absUrl(it.cover_image_url),
    link: link,
    description: (it.category ? String(it.category) : "") + (tags.length ? " " + tags.slice(0, 3).join(" ") : ""),
    mediaType: "movie"
  };
}

function parseApiList(text) {
  var out = [];
  if (!text) return out;
  var j = null;
  try { j = JSON.parse(text); } catch (e) { return out; }
  var arr = Array.isArray(j.data) ? j.data : [];
  var seen = {};
  for (var i = 0; i < arr.length; i++) {
    var card = apiToCard(arr[i]);
    if (!card || seen[card.id]) continue;
    seen[card.id] = 1;
    out.push(card);
  }
  return out;
}

function apiPageInfo(text) {
  try {
    var j = JSON.parse(text || "{}");
    var p = j.pagination || {};
    var total = parseInt(p.totalHits, 10) || 0;
    var limit = parseInt(p.limit, 10) || 12;
    return { total: total, pagecount: total > 0 ? Math.ceil(total / limit) : 999, limit: limit };
  } catch (e) {
    return { total: 999 * 12, pagecount: 999, limit: 12 };
  }
}

async function catApi(id, field, page) {
  var url = HOST + "/factory/api/category.php?id=" + encodeURIComponent(id)
    + "&field=" + encodeURIComponent(field) + "&sort=latest&page=" + page;
  var text = await getHtml(url, true);
  return { list: parseApiList(text), info: apiPageInfo(text) };
}

async function searchApi(q, page) {
  var url = HOST + "/factory/api/search.php?q=" + encodeURIComponent(q)
    + "&type=video&sort=latest&page=" + page;
  var text = await getHtml(url, true);
  return { list: parseApiList(text), info: apiPageInfo(text) };
}

// 首页最新：国产父级 452 与番号父级 453 的最新各取一页，合并按 created_at_timestamp 倒序
async function homeLatest(page) {
  var a = [];
  var b = [];
  try {
    var ta = await getHtml(HOST + "/factory/api/category.php?id=452&field=parent_category_id&sort=latest&page=" + page, true);
    var ja = JSON.parse(ta);
    a = Array.isArray(ja.data) ? ja.data : [];
  } catch (e) { a = []; }
  try {
    var tb = await getHtml(HOST + "/factory/api/category.php?id=453&field=parent_category_id&sort=latest&page=" + page, true);
    var jb = JSON.parse(tb);
    b = Array.isArray(jb.data) ? jb.data : [];
  } catch (e) { b = []; }
  var merged = a.concat(b);
  merged.sort(function (x, y) { return (Number(y.created_at_timestamp) || 0) - (Number(x.created_at_timestamp) || 0); });
  var seen = {};
  var list = [];
  for (var i = 0; i < merged.length; i++) {
    var card = apiToCard(merged[i]);
    if (!card || seen[card.id]) continue;
    seen[card.id] = 1;
    list.push(card);
  }
  return { list: list, pagecount: 423 };
}

// 热门排行：首页国产排行 10 条（单页；只取 active 的第一个 ranking-content 块）
function parseHot(html) {
  var out = [];
  if (!html) return out;
  var block = html;
  var start = html.indexOf("ranking-content active");
  if (start !== -1) {
    var next = html.indexOf("ranking-content", start + 10);
    block = next !== -1 ? html.slice(start, next) : html.slice(start);
  }
  var re = /<a href="(\/videos\/\d+\/\d+\.html)"[^>]*>[\s\S]*?data-smart-src="([^"]+)"[^>]*?alt="([^"]*)"/gi;
  var m;
  var seen = {};
  while ((m = re.exec(block)) !== null) {
    if (seen[m[1]]) continue;
    seen[m[1]] = 1;
    out.push({
      id: m[1],
      type: "url",
      title: decodeHtml(m[3]) || m[1],
      posterPath: absUrl(m[2]),
      coverUrl: absUrl(m[2]),
      backdropPath: absUrl(m[2]),
      link: m[1],
      description: "热门排行",
      mediaType: "movie"
    });
  }
  return out;
}

// 刷视频：/shuashipin/ 竖屏 feed，每 slide 一条（单页）
function parseBrush(html) {
  var out = [];
  if (!html) return out;
  var re = /<section class="brush-slide"[^>]*>[\s\S]*?<a href="(\/videos\/\d+\/\d+\.html)">[\s\S]*?<div class="brush-title">([^<]+)<\/div>/gi;
  var m;
  var seen = {};
  while ((m = re.exec(html)) !== null) {
    if (seen[m[1]]) continue;
    seen[m[1]] = 1;
    var chunk = html.slice(Math.max(0, m.index - 200), m.index + 400);
    var pm = chunk.match(/poster="([^"]+)"/);
    var pic = pm ? pm[1] : "";
    out.push({
      id: m[1],
      type: "url",
      title: decodeHtml(m[2]) || m[1],
      posterPath: absUrl(pic),
      coverUrl: absUrl(pic),
      backdropPath: absUrl(pic),
      link: m[1],
      description: "刷视频",
      mediaType: "movie"
    });
  }
  return out;
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
    if (zone === "home" || zone === "") {
      var r = await homeLatest(page);
      return r.list.length ? r.list : emptyItem();
    }
    if (zone === "hot") {
      if (page > 1) return emptyItem("热门排行只有一页");
      var html = await getHtml(HOST + "/home");
      var list = parseHot(html);
      return list.length ? list : emptyItem();
    }
    if (zone === "brush") {
      if (page > 1) return emptyItem("刷视频只有一页");
      var html2 = await getHtml(HOST + "/shuashipin/");
      var list2 = parseBrush(html2);
      return list2.length ? list2 : emptyItem();
    }
    if (zone === "p452" || zone === "p453") {
      var rp = await catApi(zone.slice(1), "parent_category_id", page);
      return rp.list.length ? rp.list : emptyItem();
    }
    if (zone === "cat") {
      var catId = (sub || "c454").replace(/^c/, "");
      var rc = await catApi(catId, "category_id", page);
      return rc.list.length ? rc.list : emptyItem();
    }
    if (zone === "tag") {
      var rt = await searchApi(sub || "动漫", page);
      return rt.list.length ? rt.list : emptyItem();
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
    var r = await searchApi(wd, page);
    return r.list.length ? r.list : emptyItem();
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

function extractTitle(html, fallback) {
  var m = html.match(/<h1[^>]*>([^<]{2,300})<\/h1>/i);
  if (m) return decodeHtml(m[1]);
  m = html.match(/<title>([^<]+)<\/title>/i);
  if (m) return decodeHtml(m[1].split(/[-|_｜]/)[0]);
  return fallback || "";
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var path = raw;
    if (path.indexOf("http") === 0) {
      var pm = path.match(/(\/videos\/\d+\/\d+\.html)/);
      path = pm ? pm[1] : path;
    }
    if (path.charAt(0) !== "/") {
      var num = path.replace(/[^0-9]/g, "");
      if (!num) return { id: raw, type: "url", title: "解析失败", description: "无视频 id" };
      path = "/videos/" + num.slice(0, 3) + "/" + num + ".html";
    }
    var durl = HOST + path;
    var html = await getHtml(durl);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var mm = html.match(/data-m3u8="([^"]+)"/);
    var m3u8 = mm ? mm[1] : "";
    if (!m3u8 || !/^https?:\/\//i.test(m3u8)) return { id: durl, type: "url", title: "未找到播放地址", description: "详情页无 m3u8" };
    var name = extractTitle(html, path);
    var pic = "";
    var pcm = html.match(/<video[^>]+poster="([^"]+)"/);
    if (pcm) pic = absUrl(pcm[1]);
    var desc = "";
    var dm = html.match(/<meta name="description" content="([^"]+)"/);
    if (dm) desc = decodeHtml(dm[1]);
    var tagList = [];
    var tre = /href="\/search\.php\?q=[^"]+"[^>]*>([^<]{1,20})<\/a>/g;
    var tx;
    while ((tx = tre.exec(html)) !== null) {
      var tag = decodeHtml(tx[1]);
      if (tag && tagList.indexOf(tag) === -1) tagList.push(tag);
    }
    var content = (tagList.length ? "标签：" + tagList.join(" / ") + "\n" : "") + desc;
    // 单档：每片只有一条 m3u8，不编档位
    var id = durl + "@@PLAY";
    var result = {
      id: durl,
      type: "detail",
      title: name || path,
      name: name || path,
      description: content,
      mediaType: "movie",
      link: durl,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app",
      episodes: [{ name: "正片", link: id }],
      seasons: [{ seasonNumber: 1, title: "正片", name: "正片", episodes: [{ title: "正片", videoUrl: m3u8, episodeNumber: 1 }] }],
      episodeItems: [{
        id: id,
        type: "url",
        title: "正片",
        mediaType: "movie",
        posterPath: pic,
        videoUrl: m3u8,
        link: id,
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system",
        customHeaders: { "User-Agent": UA, "Referer": HOST + "/" }
      }],
      childItems: [{
        id: id,
        type: "url",
        title: "正片",
        mediaType: "movie",
        posterPath: pic,
        videoUrl: m3u8,
        link: id,
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system",
        customHeaders: { "User-Agent": UA, "Referer": HOST + "/" }
      }],
      videoUrl: m3u8
    };
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
  // 档位入口：@@PLAY -> 回详情取 data-m3u8
  var at = raw.indexOf("@@PLAY");
  if (at >= 0) {
    var durl = raw.slice(0, at);
    try {
      var det = await loadDetail(durl);
      var items = det && det.episodeItems;
      if (items && items.length && items[0].videoUrl) {
        return [{ name: "正片", url: items[0].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
      }
    } catch (e) { /* fall through */ }
    return [];
  }
  // 直链 m3u8
  if (/\.m3u8(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  }
  // 兜底：详情地址/相对路径 -> 取详情首线
  try {
    var det2 = await loadDetail(raw);
    var eps = det2 && det2.episodeItems;
    if (eps && eps.length && eps[0].videoUrl) {
      return [{ name: "正片", url: eps[0].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
  } catch (e) { /* fall through */ }
  return [];
}
