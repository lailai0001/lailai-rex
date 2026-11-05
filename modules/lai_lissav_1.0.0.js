// LissAV for REX (lai_lissav v1.0.0)
// 移植自 mira-cat 蜘蛛 py_lissav.js（只读蓝图），后端 https://lissav.vip（备用 https://lissav.net）。
// 只做 asian 区（/asian/{lang}/video/cid/<番号>），domestic 区 /video/vid/ 另一套、播放未验，猫源不做，本模块也不做。
// 分类：13 个固定榜单（最新发布/最近更新/今日·本周·本月热门/中文字幕/无码流出/巨乳/大屁股/好屁股/美乳/巨乳偏好/屁股偏好）
//   + 题材分类 1 个模块走筛选（99 个 genre，猫源 GENRES 原样照抄，仅去掉 "----" 分隔占位）；
//   每个榜单另带语言筛选（中文 zh-CN / 日文 ja / 英文 en / 繁中 zh-HK，默认中文）；翻页走 /page/N（站方忽略 ?page=）。
// 列表：<a class="streamit-video-card__media-link" href=".../video/cid/<cid>"> 卡片，img src 封面、alt 标题。
// 详情：取 <title>（去 "LissAV | " 前缀）、og:image 封面、var videoUid；
//   播放走站方自家接口 /asian/{lang}/api/video/stream?video_uid=<uid>，返回 playlist 两条（高清主源 + 480p），
//   分集列出供手动选（首条叫“高清”，其余按地址里 /WxH/ 或 /Np/ 取档位）；有几档出几档，不编假清晰度。
// 搜索：猫源明确“站内搜索接口未证实，不编搜索地址”，本模块不设搜索模块。
// 网络：站方偶发空回/挂起，猫源口径顺序 host 轮询 vip → net、2 轮；REX 沙箱无定时器，轮询不设间隔。
// 字幕：猫源字幕芯是猫源专属，REX 版不接。

WidgetMetadata = {
  id: "lai_lissav",
  title: "LissAV",
  description: "LissAV（lissav.vip）：13 榜单 + 99 题材筛选 + 语言筛选，详情高清/480p 双线播放",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://lissav.vip",
  detailCacheDuration: 180,
  modules: [
    { title: "最新发布", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "new" }, { name: "lang", title: "语言", type: "enumeration", value: "zh-CN", enumOptions: [{ title: "中文", value: "zh-CN" }, { title: "日文", value: "ja" }, { title: "英文", value: "en" }, { title: "繁中", value: "zh-HK" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "最近更新", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "recent" }, { name: "lang", title: "语言", type: "enumeration", value: "zh-CN", enumOptions: [{ title: "中文", value: "zh-CN" }, { title: "日文", value: "ja" }, { title: "英文", value: "en" }, { title: "繁中", value: "zh-HK" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "今日热门", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "hot_today" }, { name: "lang", title: "语言", type: "enumeration", value: "zh-CN", enumOptions: [{ title: "中文", value: "zh-CN" }, { title: "日文", value: "ja" }, { title: "英文", value: "en" }, { title: "繁中", value: "zh-HK" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "本周热门", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "hot_week" }, { name: "lang", title: "语言", type: "enumeration", value: "zh-CN", enumOptions: [{ title: "中文", value: "zh-CN" }, { title: "日文", value: "ja" }, { title: "英文", value: "en" }, { title: "繁中", value: "zh-HK" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "本月热门", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "hot_month" }, { name: "lang", title: "语言", type: "enumeration", value: "zh-CN", enumOptions: [{ title: "中文", value: "zh-CN" }, { title: "日文", value: "ja" }, { title: "英文", value: "en" }, { title: "繁中", value: "zh-HK" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "中文字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "tag_cn" }, { name: "lang", title: "语言", type: "enumeration", value: "zh-CN", enumOptions: [{ title: "中文", value: "zh-CN" }, { title: "日文", value: "ja" }, { title: "英文", value: "en" }, { title: "繁中", value: "zh-HK" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "无码流出", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "tag_leak" }, { name: "lang", title: "语言", type: "enumeration", value: "zh-CN", enumOptions: [{ title: "中文", value: "zh-CN" }, { title: "日文", value: "ja" }, { title: "英文", value: "en" }, { title: "繁中", value: "zh-HK" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genre_juru" }, { name: "lang", title: "语言", type: "enumeration", value: "zh-CN", enumOptions: [{ title: "中文", value: "zh-CN" }, { title: "日文", value: "ja" }, { title: "英文", value: "en" }, { title: "繁中", value: "zh-HK" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "大屁股", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genre_dpg" }, { name: "lang", title: "语言", type: "enumeration", value: "zh-CN", enumOptions: [{ title: "中文", value: "zh-CN" }, { title: "日文", value: "ja" }, { title: "英文", value: "en" }, { title: "繁中", value: "zh-HK" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "好屁股", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genre_hpg" }, { name: "lang", title: "语言", type: "enumeration", value: "zh-CN", enumOptions: [{ title: "中文", value: "zh-CN" }, { title: "日文", value: "ja" }, { title: "英文", value: "en" }, { title: "繁中", value: "zh-HK" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "美乳", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genre_meiru" }, { name: "lang", title: "语言", type: "enumeration", value: "zh-CN", enumOptions: [{ title: "中文", value: "zh-CN" }, { title: "日文", value: "ja" }, { title: "英文", value: "en" }, { title: "繁中", value: "zh-HK" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "巨乳偏好", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genre_juru_pref" }, { name: "lang", title: "语言", type: "enumeration", value: "zh-CN", enumOptions: [{ title: "中文", value: "zh-CN" }, { title: "日文", value: "ja" }, { title: "英文", value: "en" }, { title: "繁中", value: "zh-HK" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "屁股偏好", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genre_pg_pref" }, { name: "lang", title: "语言", type: "enumeration", value: "zh-CN", enumOptions: [{ title: "中文", value: "zh-CN" }, { title: "日文", value: "ja" }, { title: "英文", value: "en" }, { title: "繁中", value: "zh-HK" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "题材分类", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genre" }, { name: "lang", title: "语言", type: "enumeration", value: "zh-CN", enumOptions: [{ title: "中文", value: "zh-CN" }, { title: "日文", value: "ja" }, { title: "英文", value: "en" }, { title: "繁中", value: "zh-HK" }] }, { name: "sub", title: "题材", type: "enumeration", value: "%E9%AB%98%E6%B8%85", enumOptions: [{ title: "高清", value: "%E9%AB%98%E6%B8%85" }, { title: "单体作品", value: "%E5%8D%95%E4%BD%93%E4%BD%9C%E5%93%81" }, { title: "独家", value: "%E7%8B%AC%E5%AE%B6" }, { title: "中出", value: "%E4%B8%AD%E5%87%BA" }, { title: "巨乳", value: "%E5%B7%A8%E4%B9%B3" }, { title: "人妻", value: "%E4%BA%BA%E5%A6%BB" }, { title: "无码流出", value: "%E6%97%A0%E7%A0%81%E6%B5%81%E5%87%BA" }, { title: "素人", value: "%E7%B4%A0%E4%BA%BA" }, { title: "熟女", value: "%E7%86%9F%E5%A5%B3" }, { title: "美少女", value: "%E7%BE%8E%E5%B0%91%E5%A5%B3" }, { title: "口交", value: "%E5%8F%A3%E4%BA%A4" }, { title: "薄格", value: "%E8%96%84%E6%A0%BC" }, { title: "自拍", value: "%E8%87%AA%E6%8B%8D" }, { title: "痴女", value: "%E7%97%B4%E5%A5%B3" }, { title: "多人运动", value: "%E5%A4%9A%E4%BA%BA%E8%BF%90%E5%8A%A8" }, { title: "骑乘", value: "%E9%AA%91%E4%B9%98" }, { title: "苗条", value: "%E8%8B%97%E6%9D%A1" }, { title: "潮吹", value: "%E6%BD%AE%E5%90%B9" }, { title: "4K", value: "4K" }, { title: "NTR", value: "NTR" }, { title: "美乳", value: "%E7%BE%8E%E4%B9%B3" }, { title: "乳交", value: "%E4%B9%B3%E4%BA%A4" }, { title: "中文字幕", value: "%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95" }, { title: "女高中生", value: "%E5%A5%B3%E9%AB%98%E4%B8%AD%E7%94%9F" }, { title: "4小时以上", value: "4%E5%B0%8F%E6%97%B6%E4%BB%A5%E4%B8%8A" }, { title: "颜射", value: "%E9%A2%9C%E5%B0%84" }, { title: "淫乱", value: "%E6%B7%AB%E4%B9%B1" }, { title: "企划", value: "%E4%BC%81%E5%88%92" }, { title: "业馀", value: "%E4%B8%9A%E9%A6%80" }, { title: "剧情", value: "%E5%89%A7%E6%83%85" }, { title: "手淫", value: "%E6%89%8B%E6%B7%AB" }, { title: "饼", value: "%E9%A5%BC" }, { title: "乱伦", value: "%E4%B9%B1%E4%BC%A6" }, { title: "搭讪", value: "%E6%90%AD%E8%AE%AA" }, { title: "妄想", value: "%E5%A6%84%E6%83%B3" }, { title: "合集", value: "%E5%90%88%E9%9B%86" }, { title: "恋物癖", value: "%E6%81%8B%E7%89%A9%E7%99%96" }, { title: "姐姐", value: "%E5%A7%90%E5%A7%90" }, { title: "纪录片", value: "%E7%BA%AA%E5%BD%95%E7%89%87" }, { title: "仅送货", value: "%E4%BB%85%E9%80%81%E8%B4%A7" }, { title: "偷拍", value: "%E5%81%B7%E6%8B%8D" }, { title: "舔阴", value: "%E8%88%94%E9%98%B4" }, { title: "制服", value: "%E5%88%B6%E6%9C%8D" }, { title: "羞辱", value: "%E7%BE%9E%E8%BE%B1" }, { title: "角色扮演", value: "%E8%A7%92%E8%89%B2%E6%89%AE%E6%BC%94" }, { title: "剃毛", value: "%E5%89%83%E6%AF%9B" }, { title: "OL", value: "OL" }, { title: "不伦", value: "%E4%B8%8D%E4%BC%A6" }, { title: "女大学生", value: "%E5%A5%B3%E5%A4%A7%E5%AD%A6%E7%94%9F" }, { title: "自慰", value: "%E8%87%AA%E6%85%B0" }, { title: "辣妹", value: "%E8%BE%A3%E5%A6%B9" }, { title: "大屁股", value: "%E5%A4%A7%E5%B1%81%E8%82%A1" }, { title: "小只马", value: "%E5%B0%8F%E5%8F%AA%E9%A9%AC" }, { title: "按摩棒", value: "%E6%8C%89%E6%91%A9%E6%A3%92" }, { title: "拘束", value: "%E6%8B%98%E6%9D%9F" }, { title: "全高清 (FHD)", value: "%E5%85%A8%E9%AB%98%E6%B8%85%20%28FHD%29" }, { title: "羞耻", value: "%E7%BE%9E%E8%80%BB" }, { title: "好屁股", value: "%E5%A5%BD%E5%B1%81%E8%82%A1" }, { title: "出道作", value: "%E5%87%BA%E9%81%93%E4%BD%9C" }, { title: "美丽的胸部", value: "%E7%BE%8E%E4%B8%BD%E7%9A%84%E8%83%B8%E9%83%A8" }, { title: "S1 NO.1 STYLE", value: "S1%20NO.1%20STYLE" }, { title: "Madonna", value: "Madonna" }, { title: "接吻", value: "%E6%8E%A5%E5%90%BB" }, { title: "强制口交", value: "%E5%BC%BA%E5%88%B6%E5%8F%A3%E4%BA%A4" }, { title: "屁股偏好", value: "%E5%B1%81%E8%82%A1%E5%81%8F%E5%A5%BD" }, { title: "玩具", value: "%E7%8E%A9%E5%85%B7" }, { title: "乱交", value: "%E4%B9%B1%E4%BA%A4" }, { title: "女同性恋", value: "%E5%A5%B3%E5%90%8C%E6%80%A7%E6%81%8B" }, { title: "未经审查", value: "%E6%9C%AA%E7%BB%8F%E5%AE%A1%E6%9F%A5" }, { title: "淫语", value: "%E6%B7%AB%E8%AF%AD" }, { title: "奇闻趣事", value: "%E5%A5%87%E9%97%BB%E8%B6%A3%E4%BA%8B" }, { title: "肛门", value: "%E8%82%9B%E9%97%A8" }, { title: "风俗娘", value: "%E9%A3%8E%E4%BF%97%E5%A8%98" }, { title: "泳装", value: "%E6%B3%B3%E8%A3%85" }, { title: "已婚女人", value: "%E5%B7%B2%E5%A9%9A%E5%A5%B3%E4%BA%BA" }, { title: "主观视角", value: "%E4%B8%BB%E8%A7%82%E8%A7%86%E8%A7%92" }, { title: "69", value: "69" }, { title: "丝袜", value: "%E4%B8%9D%E8%A2%9C" }, { title: "捆绑", value: "%E6%8D%86%E7%BB%91" }, { title: "吹", value: "%E5%90%B9" }, { title: "按摩", value: "%E6%8C%89%E6%91%A9" }, { title: "按摩油", value: "%E6%8C%89%E6%91%A9%E6%B2%B9" }, { title: "指插", value: "%E6%8C%87%E6%8F%92" }, { title: "各种职业", value: "%E5%90%84%E7%A7%8D%E8%81%8C%E4%B8%9A" }, { title: "校服", value: "%E6%A0%A1%E6%9C%8D" }, { title: "原来的", value: "%E5%8E%9F%E6%9D%A5%E7%9A%84" }, { title: "贫乳", value: "%E8%B4%AB%E4%B9%B3" }, { title: "超薄格", value: "%E8%B6%85%E8%96%84%E6%A0%BC" }, { title: "母亲", value: "%E6%AF%8D%E4%BA%B2" }, { title: "极限高潮", value: "%E6%9E%81%E9%99%90%E9%AB%98%E6%BD%AE" }, { title: "姐妹", value: "%E5%A7%90%E5%A6%B9" }, { title: "女教师", value: "%E5%A5%B3%E6%95%99%E5%B8%88" }, { title: "吞精", value: "%E5%90%9E%E7%B2%BE" }, { title: "巨乳偏好", value: "%E5%B7%A8%E4%B9%B3%E5%81%8F%E5%A5%BD" }, { title: "HHHグループ", value: "HHH%E3%82%B0%E3%83%AB%E3%83%BC%E3%83%97" }, { title: "年糕", value: "%E5%B9%B4%E7%B3%95" }, { title: "SM", value: "SM" }, { title: "ティッシュ", value: "%E3%83%86%E3%82%A3%E3%83%83%E3%82%B7%E3%83%A5" }, { title: "野外露出", value: "%E9%87%8E%E5%A4%96%E9%9C%B2%E5%87%BA" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { id: "loadResource", title: "播放资源", description: "播放时直通分集 m3u8 地址并附播放头", functionName: "loadResource", type: "stream", cacheDuration: 0, params: [] }
  ]
};

var HOST = "https://lissav.vip";
var HOSTS = ["https://lissav.vip", "https://lissav.net"];
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
var LANGS = ["zh-CN", "ja", "en", "zh-HK"];
var FIXED = [
  { id: "new", name: "最新发布", path: "/videos/new-releases" },
  { id: "recent", name: "最近更新", path: "/videos/recent" },
  { id: "hot_today", name: "今日热门", path: "/videos/hot/today" },
  { id: "hot_week", name: "本周热门", path: "/videos/hot/week" },
  { id: "hot_month", name: "本月热门", path: "/videos/hot/month" },
  { id: "tag_cn", name: "中文字幕", path: "/videos/tag/%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95" },
  { id: "tag_leak", name: "无码流出", path: "/videos/tag/%E6%97%A0%E7%A0%81%E6%B5%81%E5%87%BA" },
  { id: "genre_juru", name: "巨乳", path: "/videos/genre/%E5%B7%A8%E4%B9%B3" },
  { id: "genre_dpg", name: "大屁股", path: "/videos/genre/%E5%A4%A7%E5%B1%81%E8%82%A1" },
  { id: "genre_hpg", name: "好屁股", path: "/videos/genre/%E5%A5%BD%E5%B1%81%E8%82%A1" },
  { id: "genre_meiru", name: "美乳", path: "/videos/genre/%E7%BE%8E%E4%B9%B3" },
  { id: "genre_juru_pref", name: "巨乳偏好", path: "/videos/genre/%E5%B7%A8%E4%B9%B3%E5%81%8F%E5%A5%BD" },
  { id: "genre_pg_pref", name: "屁股偏好", path: "/videos/genre/%E5%B1%81%E8%82%A1%E5%81%8F%E5%A5%BD" }
];
var GENRES = [
  { v: "%E9%AB%98%E6%B8%85", n: "高清" },
  { v: "%E5%8D%95%E4%BD%93%E4%BD%9C%E5%93%81", n: "单体作品" },
  { v: "%E7%8B%AC%E5%AE%B6", n: "独家" },
  { v: "%E4%B8%AD%E5%87%BA", n: "中出" },
  { v: "%E5%B7%A8%E4%B9%B3", n: "巨乳" },
  { v: "%E4%BA%BA%E5%A6%BB", n: "人妻" },
  { v: "%E6%97%A0%E7%A0%81%E6%B5%81%E5%87%BA", n: "无码流出" },
  { v: "%E7%B4%A0%E4%BA%BA", n: "素人" },
  { v: "%E7%86%9F%E5%A5%B3", n: "熟女" },
  { v: "%E7%BE%8E%E5%B0%91%E5%A5%B3", n: "美少女" },
  { v: "%E5%8F%A3%E4%BA%A4", n: "口交" },
  { v: "%E8%96%84%E6%A0%BC", n: "薄格" },
  { v: "%E8%87%AA%E6%8B%8D", n: "自拍" },
  { v: "%E7%97%B4%E5%A5%B3", n: "痴女" },
  { v: "%E5%A4%9A%E4%BA%BA%E8%BF%90%E5%8A%A8", n: "多人运动" },
  { v: "%E9%AA%91%E4%B9%98", n: "骑乘" },
  { v: "%E8%8B%97%E6%9D%A1", n: "苗条" },
  { v: "%E6%BD%AE%E5%90%B9", n: "潮吹" },
  { v: "4K", n: "4K" },
  { v: "NTR", n: "NTR" },
  { v: "%E7%BE%8E%E4%B9%B3", n: "美乳" },
  { v: "%E4%B9%B3%E4%BA%A4", n: "乳交" },
  { v: "%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95", n: "中文字幕" },
  { v: "%E5%A5%B3%E9%AB%98%E4%B8%AD%E7%94%9F", n: "女高中生" },
  { v: "4%E5%B0%8F%E6%97%B6%E4%BB%A5%E4%B8%8A", n: "4小时以上" },
  { v: "%E9%A2%9C%E5%B0%84", n: "颜射" },
  { v: "%E6%B7%AB%E4%B9%B1", n: "淫乱" },
  { v: "%E4%BC%81%E5%88%92", n: "企划" },
  { v: "%E4%B8%9A%E9%A6%80", n: "业馀" },
  { v: "%E5%89%A7%E6%83%85", n: "剧情" },
  { v: "%E6%89%8B%E6%B7%AB", n: "手淫" },
  { v: "%E9%A5%BC", n: "饼" },
  { v: "%E4%B9%B1%E4%BC%A6", n: "乱伦" },
  { v: "%E6%90%AD%E8%AE%AA", n: "搭讪" },
  { v: "%E5%A6%84%E6%83%B3", n: "妄想" },
  { v: "%E5%90%88%E9%9B%86", n: "合集" },
  { v: "%E6%81%8B%E7%89%A9%E7%99%96", n: "恋物癖" },
  { v: "%E5%A7%90%E5%A7%90", n: "姐姐" },
  { v: "%E7%BA%AA%E5%BD%95%E7%89%87", n: "纪录片" },
  { v: "%E4%BB%85%E9%80%81%E8%B4%A7", n: "仅送货" },
  { v: "%E5%81%B7%E6%8B%8D", n: "偷拍" },
  { v: "%E8%88%94%E9%98%B4", n: "舔阴" },
  { v: "%E5%88%B6%E6%9C%8D", n: "制服" },
  { v: "%E7%BE%9E%E8%BE%B1", n: "羞辱" },
  { v: "%E8%A7%92%E8%89%B2%E6%89%AE%E6%BC%94", n: "角色扮演" },
  { v: "%E5%89%83%E6%AF%9B", n: "剃毛" },
  { v: "OL", n: "OL" },
  { v: "%E4%B8%8D%E4%BC%A6", n: "不伦" },
  { v: "%E5%A5%B3%E5%A4%A7%E5%AD%A6%E7%94%9F", n: "女大学生" },
  { v: "%E8%87%AA%E6%85%B0", n: "自慰" },
  { v: "%E8%BE%A3%E5%A6%B9", n: "辣妹" },
  { v: "%E5%A4%A7%E5%B1%81%E8%82%A1", n: "大屁股" },
  { v: "%E5%B0%8F%E5%8F%AA%E9%A9%AC", n: "小只马" },
  { v: "%E6%8C%89%E6%91%A9%E6%A3%92", n: "按摩棒" },
  { v: "%E6%8B%98%E6%9D%9F", n: "拘束" },
  { v: "%E5%85%A8%E9%AB%98%E6%B8%85%20%28FHD%29", n: "全高清 (FHD)" },
  { v: "%E7%BE%9E%E8%80%BB", n: "羞耻" },
  { v: "%E5%A5%BD%E5%B1%81%E8%82%A1", n: "好屁股" },
  { v: "%E5%87%BA%E9%81%93%E4%BD%9C", n: "出道作" },
  { v: "%E7%BE%8E%E4%B8%BD%E7%9A%84%E8%83%B8%E9%83%A8", n: "美丽的胸部" },
  { v: "S1%20NO.1%20STYLE", n: "S1 NO.1 STYLE" },
  { v: "Madonna", n: "Madonna" },
  { v: "%E6%8E%A5%E5%90%BB", n: "接吻" },
  { v: "%E5%BC%BA%E5%88%B6%E5%8F%A3%E4%BA%A4", n: "强制口交" },
  { v: "%E5%B1%81%E8%82%A1%E5%81%8F%E5%A5%BD", n: "屁股偏好" },
  { v: "%E7%8E%A9%E5%85%B7", n: "玩具" },
  { v: "%E4%B9%B1%E4%BA%A4", n: "乱交" },
  { v: "%E5%A5%B3%E5%90%8C%E6%80%A7%E6%81%8B", n: "女同性恋" },
  { v: "%E6%9C%AA%E7%BB%8F%E5%AE%A1%E6%9F%A5", n: "未经审查" },
  { v: "%E6%B7%AB%E8%AF%AD", n: "淫语" },
  { v: "%E5%A5%87%E9%97%BB%E8%B6%A3%E4%BA%8B", n: "奇闻趣事" },
  { v: "%E8%82%9B%E9%97%A8", n: "肛门" },
  { v: "%E9%A3%8E%E4%BF%97%E5%A8%98", n: "风俗娘" },
  { v: "%E6%B3%B3%E8%A3%85", n: "泳装" },
  { v: "%E5%B7%B2%E5%A9%9A%E5%A5%B3%E4%BA%BA", n: "已婚女人" },
  { v: "%E4%B8%BB%E8%A7%82%E8%A7%86%E8%A7%92", n: "主观视角" },
  { v: "69", n: "69" },
  { v: "%E4%B8%9D%E8%A2%9C", n: "丝袜" },
  { v: "%E6%8D%86%E7%BB%91", n: "捆绑" },
  { v: "%E5%90%B9", n: "吹" },
  { v: "%E6%8C%89%E6%91%A9", n: "按摩" },
  { v: "%E6%8C%89%E6%91%A9%E6%B2%B9", n: "按摩油" },
  { v: "%E6%8C%87%E6%8F%92", n: "指插" },
  { v: "%E5%90%84%E7%A7%8D%E8%81%8C%E4%B8%9A", n: "各种职业" },
  { v: "%E6%A0%A1%E6%9C%8D", n: "校服" },
  { v: "%E5%8E%9F%E6%9D%A5%E7%9A%84", n: "原来的" },
  { v: "%E8%B4%AB%E4%B9%B3", n: "贫乳" },
  { v: "%E8%B6%85%E8%96%84%E6%A0%BC", n: "超薄格" },
  { v: "%E6%AF%8D%E4%BA%B2", n: "母亲" },
  { v: "%E6%9E%81%E9%99%90%E9%AB%98%E6%BD%AE", n: "极限高潮" },
  { v: "%E5%A7%90%E5%A6%B9", n: "姐妹" },
  { v: "%E5%A5%B3%E6%95%99%E5%B8%88", n: "女教师" },
  { v: "%E5%90%9E%E7%B2%BE", n: "吞精" },
  { v: "%E5%B7%A8%E4%B9%B3%E5%81%8F%E5%A5%BD", n: "巨乳偏好" },
  { v: "HHH%E3%82%B0%E3%83%AB%E3%83%BC%E3%83%97", n: "HHHグループ" },
  { v: "%E5%B9%B4%E7%B3%95", n: "年糕" },
  { v: "SM", n: "SM" },
  { v: "%E3%83%86%E3%82%A3%E3%83%83%E3%82%B7%E3%83%A5", n: "ティッシュ" },
  { v: "%E9%87%8E%E5%A4%96%E9%9C%B2%E5%87%BA", n: "野外露出" }
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

function absUrl(u, host) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return host + u;
  return u;
}

function htmlHeaders(host, lang) {
  return {
    "User-Agent": UA,
    "Referer": host + "/asian/" + lang + "/",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
  };
}

async function fetchOnce(url, headers) {
  try {
    var res = await Widget.http.get(url, { headers: headers });
    if (res && res.status && res.status !== 200) return "";
    var body = res && res.data != null ? String(res.data) : "";
    return body;
  } catch (e) { return ""; }
}

// 猫源 getHtml 口径：顺序 host 轮询（vip → net），2 轮，共 4 次尝试
async function getHtml(path, lang) {
  var url = t(path);
  if (url.indexOf("//") === 0) url = "https:" + url;
  else if (url.charAt(0) === "/") url = HOST + url;
  var cands = [url];
  for (var hi = 0; hi < HOSTS.length; hi++) {
    if (url.indexOf(HOSTS[hi] + "/") === 0) {
      var rest = url.slice(HOSTS[hi].length);
      cands = [HOSTS[0] + rest, HOSTS[1] + rest];
      break;
    }
  }
  for (var round = 0; round < 2; round++) {
    for (var ci = 0; ci < cands.length; ci++) {
      var d = await fetchOnce(cands[ci], htmlHeaders(HOST, lang || "zh-CN"));
      if (d) return d;
    }
  }
  return "";
}

function parseCards(html) {
  var items = [];
  var seen = {};
  var re = /<a class="streamit-video-card__media-link" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  var m;
  while ((m = re.exec(String(html || "")))) {
    var href = m[1];
    var inner = m[2];
    var cm = href.match(/\/video\/cid\/([A-Za-z0-9_-]+)/);
    if (!cm) continue;
    var cid = cm[1];
    if (cid.indexOf("__") >= 0 || seen[href]) continue;
    seen[href] = 1;
    var imgM = inner.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
    var altM = inner.match(/alt="([^"]*)"/i);
    var pic = imgM ? imgM[1] : "";
    var title = altM ? cleanLabel(altM[1]) : cid;
    var durl = absUrl(href, HOST);
    var picUrl = pic ? absUrl(pic, HOST) : "";
    items.push({
      id: durl,
      type: "url",
      title: title || cid,
      posterPath: picUrl,
      coverUrl: picUrl,
      backdropPath: picUrl,
      link: durl,
      description: cid,
      mediaType: "movie"
    });
  }
  return items;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function findFixed(cat) {
  for (var i = 0; i < FIXED.length; i++) {
    if (FIXED[i].id === cat) return FIXED[i];
  }
  return null;
}

function pickLang(params) {
  var lang = t(params && params.lang);
  for (var i = 0; i < LANGS.length; i++) {
    if (LANGS[i] === lang) return lang;
  }
  return "zh-CN";
}

async function loadList(params) {
  params = params || {};
  var cat = t(params.cat || "new");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var lang = pickLang(params);
  var base = "";
  var f = findFixed(cat);
  if (f) base = f.path;
  else if (cat === "genre") {
    var sub = t(params.sub || "");
    if (!sub) sub = GENRES[0].v;
    base = "/videos/genre/" + sub;
  } else base = "/videos/new-releases";
  var path = "/asian/" + lang + base + (page > 1 ? "/page/" + page : "");
  try {
    var html = await getHtml(path, lang);
    var list = parseCards(html);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function epName(url, i) {
  if (i === 0) return "高清";
  var rm = String(url).match(/\/(\d+)x(\d+)\//);
  if (rm) return rm[2] + "p";
  var pm = String(url).match(/\/(\d+)p\//);
  if (pm) return pm[1] + "p";
  return "线路" + (i + 1);
}

async function fetchStream(lang, uid) {
  if (!uid) return [];
  for (var round = 0; round < 2; round++) {
    for (var hi = 0; hi < HOSTS.length; hi++) {
      var host = HOSTS[hi];
      try {
        var res = await Widget.http.get(host + "/asian/" + lang + "/api/video/stream?video_uid=" + encodeURIComponent(uid), {
          headers: { "User-Agent": UA, "Referer": host + "/asian/" + lang + "/", "Accept": "application/json" }
        });
        if (res && res.status && res.status !== 200) continue;
        var d = res && res.data != null ? res.data : null;
        if (d == null) continue;
        var j = d;
        if (typeof d === "string") {
          try { j = JSON.parse(d); } catch (e) { continue; }
        }
        if (j && Array.isArray(j.playlist)) {
          var pl = [];
          for (var i = 0; i < j.playlist.length; i++) {
            var e = j.playlist[i];
            if (e && e.url) pl.push(e.url);
          }
          if (pl.length) return pl;
        }
      } catch (e) { /* try next host */ }
    }
  }
  return [];
}

async function loadDetail(link) {
  try {
    var durl = t(link);
    if (!durl) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var langM = durl.match(/\/asian\/([^/]+)\//);
    var lang = (langM && langM[1]) || "zh-CN";
    if (LANGS.indexOf(lang) < 0) lang = "zh-CN";
    var cidM = durl.match(/\/video\/cid\/([^/?#]+)/);
    var cid = cidM ? cidM[1] : "";
    var html = await getHtml(durl, lang);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var tM = html.match(/<title>(.*?)<\/title>/i);
    var mainTitle = "";
    if (tM) mainTitle = cleanLabel(tM[1]).replace(/^LissAV\s*\|\s*/i, "").trim();
    if (!mainTitle) mainTitle = cid || "LissAV 视频";
    var posterPic = "";
    var ogM = html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (ogM) posterPic = absUrl(ogM[1].trim(), HOST);
    var uidM = html.match(/var videoUid\s*=\s*"([^"]+)"/);
    var uid = uidM ? uidM[1] : "";
    var eps = [];
    var childItems = [];
    if (uid) {
      var pl = await fetchStream(lang, uid);
      for (var i = 0; i < pl.length; i++) {
        var nm = epName(pl[i], i);
        eps.push({ name: nm, link: pl[i] });
        childItems.push({
          id: pl[i],
          title: mainTitle + " " + nm,
          name: nm,
          mediaType: "movie",
          seasonNumber: 1,
          episodeNumber: i + 1,
          link: pl[i]
        });
      }
    }
    var result = {
      id: durl,
      type: "url",
      title: mainTitle,
      name: mainTitle,
      description: cid ? ("番号：" + cid) : "LissAV",
      mediaType: "movie",
      link: durl,
      coverUrl: posterPic,
      posterPath: posterPic,
      backdropPath: posterPic,
      playerType: "app"
    };
    if (eps.length) {
      result.episodes = eps;
      result.episodeItems = childItems;
      result.childItems = childItems;
    } else {
      result.description = (cid ? ("番号：" + cid + "\n") : "") + "未找到播放地址";
    }
    return result;
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

function isVideoFormat(url) {
  var low = String(url || "").toLowerCase();
  return low.indexOf(".m3u8") >= 0 || low.indexOf(".mp4") >= 0 || low.indexOf(".flv") >= 0 || low.indexOf(".ts") >= 0;
}

async function loadResource(params) {
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  if (!isVideoFormat(raw)) return [];
  return [{ name: "播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
}
