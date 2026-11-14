// 4KPorno for REX (lai_4kporno v1.0.0)
// 移植自 mira-cat 蜘蛛 py_4kporno.js（只读蓝图），后端 https://www.4kporno.xxx/。
// KVS 站。列表 24 条/页；分类页 361 个真实分类（站方原文中文名，筛选卡片呈现，不平铺）。
// 详情页 <source> 直给三档 mp4（2160p/720p/480p，H.264，实测 206）；get_file 地址稳定、
// 无需 cookie，播放时由播放器跟随 302 到 fpvcdn 签名地址。字幕：不接（欧美站无番号）。

WidgetMetadata = {
  id: "lai_4kporno",
  title: "4KPorno",
  description: "4KPorno：KVS 欧美站，最新/最热/评分最高 + 361 类别筛选，详情三档 mp4（2160p/720p/480p）",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://www.4kporno.xxx",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "最热", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "popular" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "评分最高", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "top" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "全部类别", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "categories" }, { name: "sub", title: "类别", type: "enumeration", value: "18-years-old", enumOptions: [{"title": "18岁", "value": "18-years-old"}, {"title": "19岁", "value": "19-years-old"}, {"title": "50+", "value": "50"}, {"title": "60+", "value": "60"}, {"title": "69", "value": "69"}, {"title": "CFNM", "value": "cfnm"}, {"title": "Emo", "value": "emo"}, {"title": "FFF+", "value": "fff"}, {"title": "FFFMM", "value": "fffmm"}, {"title": "FFM", "value": "ffm"}, {"title": "Gangbang", "value": "gangbang"}, {"title": "GILF", "value": "gilf"}, {"title": "HD", "value": "hd"}, {"title": "JOI（手淫指导）", "value": "joi-jerk-off-instructions"}, {"title": "MILF", "value": "milf"}, {"title": "MMF (2男1女)", "value": "mmf"}, {"title": "MMFF (2 男 2 女)", "value": "mmff"}, {"title": "MMMF (3 男 2 女)", "value": "mmmf"}, {"title": "PAWG（丰满大白屁股白人女孩", "value": "pawg"}, {"title": "POV (视点", "value": "pov"}, {"title": "VR色情", "value": "vr-virtual-reality"}, {"title": "タブー", "value": "taboo"}, {"title": "丁字裤", "value": "thong"}, {"title": "万圣节", "value": "halloween"}, {"title": "三人行", "value": "threesome"}, {"title": "上下同插式", "value": "spit-roast"}, {"title": "丝袜", "value": "stockings"}, {"title": "中国人", "value": "chinese"}, {"title": "中奶", "value": "medium-tits"}, {"title": "丹麦的", "value": "danish"}, {"title": "乌克兰", "value": "ukrainian"}, {"title": "乳交", "value": "titty-fuck"}, {"title": "乳头", "value": "nipples"}, {"title": "乳房上的精液", "value": "cum-on-tits"}, {"title": "亚洲的", "value": "asian"}, {"title": "交换", "value": "swap"}, {"title": "人妖", "value": "shemale"}, {"title": "从屄到嘴", "value": "pussy-to-mouth"}, {"title": "伊朗的", "value": "iranian"}, {"title": "传教士式", "value": "missionary"}, {"title": "伪娘3P", "value": "shemale-threesome"}, {"title": "伪娘性交", "value": "shemale-fuck-shemale"}, {"title": "伴侣展示", "value": "candaulism"}, {"title": "体内射精", "value": "creampie"}, {"title": "体罚", "value": "corporal-punishment"}, {"title": "体育运动", "value": "sport"}, {"title": "作呕", "value": "gagging"}, {"title": "侍奉崇拜", "value": "worship"}, {"title": "侏儒", "value": "midget"}, {"title": "俄罗斯的", "value": "russian"}, {"title": "保加利亚的", "value": "bulgarian"}, {"title": "保姆", "value": "babysitter"}, {"title": "修整过的屄", "value": "trimmed"}, {"title": "假阳具", "value": "dildo"}, {"title": "健身", "value": "fitness"}, {"title": "健身房", "value": "gym"}, {"title": "偷窥", "value": "voyeur"}, {"title": "免费使用", "value": "freeuse"}, {"title": "公共场合", "value": "public"}, {"title": "军人", "value": "military"}, {"title": "出租车", "value": "taxi"}, {"title": "出轨", "value": "cheating"}, {"title": "分享", "value": "share"}, {"title": "制服", "value": "uniform"}, {"title": "剃毛", "value": "shaving"}, {"title": "剃过毛的", "value": "shaved"}, {"title": "办公室", "value": "office"}, {"title": "加拿大的", "value": "canadian"}, {"title": "动画成人视频", "value": "animation"}, {"title": "勺子性姿势", "value": "spooning"}, {"title": "匈牙利", "value": "hungarian"}, {"title": "医学的", "value": "medical"}, {"title": "医生", "value": "doctor"}, {"title": "半老徐娘", "value": "cougar"}, {"title": "卡住", "value": "stuck"}, {"title": "印度的", "value": "indian"}, {"title": "原始视频", "value": "raw"}, {"title": "双口活", "value": "double-blowjob"}, {"title": "双性恋者", "value": "bisexual"}, {"title": "双插入", "value": "double-penetration"}, {"title": "双胞胎", "value": "twins"}, {"title": "双重肛交", "value": "double-anal"}, {"title": "反向女牛仔", "value": "reverse-cowgirl"}, {"title": "受到惩罚", "value": "punished"}, {"title": "口中精液", "value": "cum-in-mouth"}, {"title": "口传精液", "value": "cum-swapping"}, {"title": "口活", "value": "blowjob"}, {"title": "古典", "value": "vintage"}, {"title": "吊带", "value": "suspenders"}, {"title": "同父异母", "value": "stepfamily"}, {"title": "名人", "value": "celebrity"}, {"title": "吞精", "value": "cum-swallowing"}, {"title": "吸球", "value": "ball-sucking"}, {"title": "呼吸游戏", "value": "breath-play"}, {"title": "哥伦比亚的", "value": "colombian"}, {"title": "哥特次文化", "value": "goth"}, {"title": "哭泣", "value": "crying"}, {"title": "哺乳期", "value": "lactating"}, {"title": "啦啦队", "value": "cheerleader"}, {"title": "四人行", "value": "foursome"}, {"title": "土耳其的", "value": "turkish"}, {"title": "圣帕特里克节", "value": "st-patrick-s-day"}, {"title": "圣诞", "value": "christmas"}, {"title": "地中海", "value": "mediterranean"}, {"title": "坐脸", "value": "face-sitting"}, {"title": "培养家庭幻想", "value": "step-fantasy"}, {"title": "墨西哥的", "value": "mexican"}, {"title": "声学亲密感", "value": "acoustic-intimacy"}, {"title": "处女", "value": "vergin"}, {"title": "多人颜射", "value": "bukkake"}, {"title": "多毛", "value": "hairy"}, {"title": "多毛的屄", "value": "hairy-pussy"}, {"title": "大乳头", "value": "big-nipples"}, {"title": "大乳晕", "value": "big-areolas"}, {"title": "大屁股", "value": "big-ass"}, {"title": "大屌", "value": "big-cock"}, {"title": "大美女", "value": "bbw"}, {"title": "大黑屌", "value": "bbc-big-black-cock"}, {"title": "天主教徒", "value": "catholic"}, {"title": "天然的大乳房", "value": "big-natural-tits"}, {"title": "夫妇", "value": "couple"}, {"title": "奇闻趣事", "value": "gonzo"}, {"title": "女佣", "value": "maid"}, {"title": "女同性恋统治", "value": "lesdom"}, {"title": "女同性恋者", "value": "lesbian"}, {"title": "女同性恋者三人行", "value": "lesbian-in-threesome"}, {"title": "女同磨镜", "value": "scissoring"}, {"title": "女大学生", "value": "college-girl"}, {"title": "女学生", "value": "schoolgirl"}, {"title": "女性内裤", "value": "panties"}, {"title": "女性高潮", "value": "female-orgasm"}, {"title": "女斗色情片", "value": "cat-fights"}, {"title": "女朋友", "value": "girlfriend"}, {"title": "女牛仔", "value": "cowgirl"}, {"title": "女用貼身內衣褲", "value": "lingerie"}, {"title": "奴隶", "value": "slave"}, {"title": "奶奶", "value": "granny"}, {"title": "妇科考试", "value": "gyno-exam"}, {"title": "妈妈", "value": "mom"}, {"title": "妻子", "value": "wife"}, {"title": "孕妇", "value": "pregnant"}, {"title": "学校", "value": "school"}, {"title": "安全套使用", "value": "condom"}, {"title": "宗教的", "value": "religious"}, {"title": "家庭主妇", "value": "housewife"}, {"title": "寻欢洞", "value": "gloryhole"}, {"title": "射在阴道上", "value": "cum-on-pussy"}, {"title": "射精", "value": "cumshot"}, {"title": "小乳房", "value": "small-tits"}, {"title": "小便", "value": "pissing"}, {"title": "少女深喉强制口交", "value": "facefucking"}, {"title": "尿尿", "value": "peeing"}, {"title": "屄双插", "value": "double-pussy"}, {"title": "巡警", "value": "cop"}, {"title": "巨乳", "value": "big-tits"}, {"title": "巴西的", "value": "brazilian"}, {"title": "希腊的", "value": "greek"}, {"title": "幕后花絮", "value": "behind-the-scenes"}, {"title": "年轻人", "value": "young"}, {"title": "微型", "value": "petite"}, {"title": "德国的", "value": "german"}, {"title": "性玩偶", "value": "sex-doll"}, {"title": "性玩具", "value": "sex-toys"}, {"title": "性虐待", "value": "bdsm"}, {"title": "恋物", "value": "fetish"}, {"title": "恋足", "value": "foot-fetish"}, {"title": "恐怖", "value": "horror"}, {"title": "情人节", "value": "valentine-s-day"}, {"title": "情色", "value": "softcore"}, {"title": "意大利的", "value": "italian"}, {"title": "感恩", "value": "thanksgiving"}, {"title": "戏仿", "value": "parody"}, {"title": "成熟", "value": "mature"}, {"title": "户外", "value": "outdoor"}, {"title": "手交", "value": "handjob"}, {"title": "打屁股", "value": "spanking"}, {"title": "打蛋蛋", "value": "ball-busting"}, {"title": "扮装", "value": "cosplay"}, {"title": "护士", "value": "nurse"}, {"title": "抹油的", "value": "oiled"}, {"title": "抽烟", "value": "smoking"}, {"title": "拉美裔女人", "value": "latina"}, {"title": "拳交", "value": "fisting"}, {"title": "指法", "value": "fingering"}, {"title": "按摩", "value": "massage"}, {"title": "振动器", "value": "vibrator"}, {"title": "捆绑", "value": "tied-up"}, {"title": "换伴", "value": "swinger"}, {"title": "换衣室", "value": "changing-room"}, {"title": "捷克的", "value": "czech"}, {"title": "掀裙", "value": "upskirt"}, {"title": "接吻", "value": "kissing"}, {"title": "接机", "value": "pick-up"}, {"title": "摄像头", "value": "webcam"}, {"title": "摔跤", "value": "wrestling"}, {"title": "摩门教徒", "value": "mormon"}, {"title": "改善身体", "value": "enhanced-body"}, {"title": "斗争", "value": "fight"}, {"title": "旅馆", "value": "hostel"}, {"title": "日本成人视频审查", "value": "jav-censored"}, {"title": "日本成人视频未经审查", "value": "jav-uncensored"}, {"title": "日本的", "value": "japanese"}, {"title": "晒成褐色的", "value": "tanned"}, {"title": "晒日线", "value": "tan-lines"}, {"title": "暨玩", "value": "cumplay"}, {"title": "最好的朋友", "value": "best-friend"}, {"title": "机器性交", "value": "fucking-machine"}, {"title": "束缚", "value": "bondage"}, {"title": "束缚", "value": "restraints"}, {"title": "枯瘦", "value": "skinny"}, {"title": "柔韧", "value": "flexible"}, {"title": "欧洲假期", "value": "european-vacation"}, {"title": "欧洲的", "value": "european"}, {"title": "比基尼", "value": "bikini"}, {"title": "毛茸茸的布什", "value": "hairy-bush"}, {"title": "氨纶", "value": "spandex"}, {"title": "汇编", "value": "compilation"}, {"title": "汽车", "value": "car"}, {"title": "法国的", "value": "french"}, {"title": "泡泡臀", "value": "bubble-butt"}, {"title": "波兰的", "value": "polish"}, {"title": "泰国的", "value": "thai"}, {"title": "泳池", "value": "pool"}, {"title": "洞口张开", "value": "gaping"}, {"title": "浅黑肤色的女人", "value": "brunette"}, {"title": "浓密的阴毛", "value": "bush"}, {"title": "浴室", "value": "bathroom"}, {"title": "海滩", "value": "beach"}, {"title": "淋浴", "value": "shower"}, {"title": "深喉", "value": "deepthroat"}, {"title": "湿的", "value": "wet"}, {"title": "滴蜡", "value": "wax"}, {"title": "潮吹", "value": "squirt"}, {"title": "澳洲的", "value": "australian"}, {"title": "激情", "value": "passionate"}, {"title": "父亲节", "value": "fathers-day"}, {"title": "爷爷", "value": "grandpa"}, {"title": "牙套", "value": "braces"}, {"title": "牧师", "value": "priest"}, {"title": "特写", "value": "close-up"}, {"title": "狗交式性爱", "value": "doggystyle"}, {"title": "独家的", "value": "exclusive"}, {"title": "独自", "value": "solo"}, {"title": "玩电", "value": "electricity-play"}, {"title": "玩睾丸", "value": "ball-play"}, {"title": "现实", "value": "reality"}, {"title": "瑜伽", "value": "yoga"}, {"title": "男性统治", "value": "maledom"}, {"title": "白皙的皮肤", "value": "fair-skin"}, {"title": "监狱", "value": "prison"}, {"title": "眼镜", "value": "glasses"}, {"title": "短发", "value": "short-hair"}, {"title": "硬核性交", "value": "hardcore"}, {"title": "秘书", "value": "secretary"}, {"title": "穆斯林", "value": "hijab"}, {"title": "立陶宛语", "value": "lithuanian"}, {"title": "第一次", "value": "first-time-sex"}, {"title": "第一次在色情", "value": "first-time-porn"}, {"title": "笼中调教", "value": "cage"}, {"title": "粗暴的性行为", "value": "rough-sex"}, {"title": "精神控制", "value": "mind-control"}, {"title": "素人", "value": "amateur"}, {"title": "红头发", "value": "redhead"}, {"title": "纹身", "value": "tattoo"}, {"title": "统治", "value": "domination"}, {"title": "继兄弟", "value": "stepbrother"}, {"title": "继女", "value": "stepdaughter"}, {"title": "继妹", "value": "stepsister"}, {"title": "继子", "value": "stepson"}, {"title": "继母", "value": "stepmom"}, {"title": "继父", "value": "stepdad"}, {"title": "绳索悬挂", "value": "rope-suspension"}, {"title": "绿帽侠", "value": "cuckold"}, {"title": "网眼布", "value": "fishnet"}, {"title": "美丽的屁股", "value": "beautifu-ass"}, {"title": "美丽的性爱", "value": "beautiful-sex"}, {"title": "美国独立日", "value": "4th-of-july"}, {"title": "美女", "value": "babe"}, {"title": "美妇", "value": "beautiful"}, {"title": "羞辱", "value": "humiliation"}, {"title": "群交", "value": "orgy"}, {"title": "老师", "value": "teacher"}, {"title": "老年人和年轻人", "value": "old-and-young"}, {"title": "肌肉型", "value": "muscular"}, {"title": "肛交", "value": "anal"}, {"title": "肛交后口交", "value": "ass-to-mouth"}, {"title": "肛内射精", "value": "anal-creampie"}, {"title": "肛塞", "value": "buttplug"}, {"title": "肛门指交", "value": "ass-fingering"}, {"title": "肛门游戏", "value": "anal-play"}, {"title": "肛门第一次", "value": "first-anal"}, {"title": "育种材料", "value": "breeding-material"}, {"title": "肿胀的乳头", "value": "puffy-nipples"}, {"title": "胶乳", "value": "latex"}, {"title": "胸罩", "value": "bra"}, {"title": "脚", "value": "feet"}, {"title": "脚趾吸吮", "value": "toe-sucking"}, {"title": "脱衣舞", "value": "striptease"}, {"title": "腰带式假阳具", "value": "strap-on"}, {"title": "自慰", "value": "masturbation"}, {"title": "自然卷发", "value": "curly"}, {"title": "自然胸部", "value": "natural-tits"}, {"title": "舔屄", "value": "pussy-licking"}, {"title": "舔手指", "value": "finger-licking"}, {"title": "舔睾丸", "value": "ball-licking"}, {"title": "舔肛门", "value": "rimming"}, {"title": "舔肛门", "value": "ass-licking"}, {"title": "色情明星", "value": "pornstar"}, {"title": "芭蕾舞女演员", "value": "ballerina"}, {"title": "苍白", "value": "pale"}, {"title": "英国的", "value": "british"}, {"title": "荷兰语", "value": "dutch"}, {"title": "葡萄牙的", "value": "portuguese"}, {"title": "蒙眼", "value": "blindfold"}, {"title": "蓝眼睛", "value": "blue-eyes"}, {"title": "袜子", "value": "socks"}, {"title": "裙子", "value": "skirt"}, {"title": "裸体主义者", "value": "nudist"}, {"title": "西班牙的", "value": "spanish"}, {"title": "观看", "value": "watching"}, {"title": "角色扮演", "value": "role-play"}, {"title": "触手幻想", "value": "tentacles"}, {"title": "警察", "value": "police"}, {"title": "试镜", "value": "casting"}, {"title": "诱惑", "value": "seduced"}, {"title": "调教", "value": "femdom"}, {"title": "超级瘦", "value": "super-skinny"}, {"title": "越南的", "value": "vietnamese"}, {"title": "足交", "value": "footjob"}, {"title": "跨性别干男人", "value": "shemale-fuck-guy"}, {"title": "跨种族", "value": "interracial"}, {"title": "身体打孔", "value": "piercing"}, {"title": "运动员", "value": "athletic"}, {"title": "运动球", "value": "sportsball"}, {"title": "连裤袜", "value": "pantyhose"}, {"title": "连裤袜", "value": "party"}, {"title": "迷你裙", "value": "miniskirt"}, {"title": "邋遢", "value": "sloppy"}, {"title": "酒店", "value": "hotel"}, {"title": "采访", "value": "interview"}, {"title": "野外露出", "value": "exhibitionist"}, {"title": "金发", "value": "blonde"}, {"title": "钱", "value": "money"}, {"title": "银发熟女", "value": "gray-hair"}, {"title": "长发", "value": "long-hair"}, {"title": "间谍相机", "value": "spycam"}, {"title": "阿姆斯特丹", "value": "amsterdam"}, {"title": "阿拉伯的", "value": "arab"}, {"title": "集体性交", "value": "group-sex"}, {"title": "青少年", "value": "teen"}, {"title": "非洲的", "value": "african"}, {"title": "面试", "value": "audition"}, {"title": "鞭打惩戒", "value": "flogging"}, {"title": "韩国的", "value": "korean"}, {"title": "颜射", "value": "facial"}, {"title": "骆驼趾", "value": "cameltoe"}, {"title": "骑马式", "value": "riding"}, {"title": "高个子女孩", "value": "tall-girls"}, {"title": "高跟鞋", "value": "high-heels"}, {"title": "黑人", "value": "ebony"}, {"title": "黑皮肤", "value": "black"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://www.4kporno.xxx";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
var PAGE_SIZE = 24;

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  return t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); });
}

function cleanLabel(s) {
  return decodeHtml(String(s || "").replace(/<[^>]+>/g, ""))
    .replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return HOST + "/" + u;
}

function normUrl(u) {
  var s = t(u);
  if (!s) return "";
  s = s.replace(/^(https?:)\/([^/])/, "$1//$2");
  return s;
}

async function getHtml(url, referer) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Referer": referer || HOST + "/"
      }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body;
  } catch (e) { return ""; }
}

function listUrl(zone, sub, page) {
  var base;
  if (zone === "latest") base = HOST + "/zh/latest-updates/";
  else if (zone === "popular") base = HOST + "/zh/most-popular/";
  else if (zone === "top") base = HOST + "/zh/top-rated/";
  else base = HOST + "/zh/categories/" + (sub || "18-years-old") + "/";
  return page > 1 ? base + page + "/" : base;
}

// 列表：每条一个 <div class="item">；详情链接与标题在 thumb 锚点上；
// 封面取 data-src，无 data-src 时取 src（须排除占位 gif）；时长在 span.duration 里。
function parseList(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<a[^>]+href="(https:\/\/www\.4kporno\.xxx\/zh\/videos\/\d+\/[^"]+\/)"[^>]*title="([^"]+)"[^>]*>/gi;
  var m;
  while ((m = re.exec(html))) {
    var href = m[1];
    if (seen[href]) continue;
    seen[href] = 1;
    var title = decodeHtml(m[2]);
    var tail = html.slice(m.index, m.index + 2500);
    var pic = "";
    var dm = tail.match(/data-src="(https?:\/\/[^"]+)"/i);
    if (dm) pic = dm[1];
    else {
      var sm = tail.match(/<img[^>]+src="(https?:\/\/[^"]+)"/i);
      if (sm && sm[1].indexOf("data:image") !== 0) pic = sm[1];
    }
    var remarks = "";
    var um = tail.match(/<span class="duration">\s*([^<]+?)\s*<\/span>/i);
    if (um) remarks = t(um[1]).replace(/^完整视频\s*/, "");
    out.push({
      id: href,
      type: "url",
      title: title || href,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: href,
      description: remarks,
      mediaType: "movie"
    });
  }
  return out;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function pagecountFromHtml(html, page, list) {
  var max = 0;
  var pi = html.indexOf("pagination");
  if (pi >= 0) {
    var blk = html.slice(pi, pi + 6000);
    var end = blk.indexOf("</ul>");
    var seg = end >= 0 ? blk.slice(0, end) : blk;
    var re = /<a[^>]*>\s*(\d+)\s*<\/a>/g;
    var m;
    while ((m = re.exec(seg))) {
      var n = parseInt(m[1], 10);
      if (n > max) max = n;
    }
    var re2 = /href="[^"]*\/(\d+)\/"/g;
    while ((m = re2.exec(seg))) {
      var n2 = parseInt(m[1], 10);
      if (n2 > max) max = n2;
    }
  }
  if (max >= page) return max;
  return list.length < PAGE_SIZE ? page : page + 1;
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "latest");
  var sub = t(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var html = await getHtml(listUrl(zone, sub, page));
    var list = parseList(html);
    return list.length ? list : emptyItem();
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
    var base = HOST + "/zh/search/" + encodeURIComponent(wd) + "/";
    var url = page > 1 ? base + page + "/" : base;
    var html = await getHtml(url);
    var list = parseList(html);
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

async function loadDetail(link) {
  try {
    var url = unwrapLink(link);
    if (!url) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    if (url.indexOf("http") !== 0) url = absUrl(url);
    var html = await getHtml(url, url);
    if (!html) return { id: url, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = "";
    var og = html.match(/property="og:title"[^>]*content="([^"]+)"/i)
      || html.match(/content="([^"]+)"[^>]*property="og:title"/i);
    if (og) {
      name = decodeHtml(og[1])
        .replace(/\s*4K\s*[^\w\u4e00-\u9fa5]*免费完整视频[\s\S]*$/, "")
        .replace(/\s*-\s*4KPorno\.XXX\s*$/i, "").trim();
    }
    if (!name) {
      var hm = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (hm) name = cleanLabel(hm[1]);
    }
    var pic = "";
    var pm = html.match(/property="og:image"[^>]*content="([^"]+)"/i)
      || html.match(/content="([^"]+)"[^>]*property="og:image"/i);
    if (pm) pic = normUrl(absUrl(pm[1]));
    // 播放：<source src='..._<档>m.mp4/' label="<档>p">，有几档出几档，绝不硬编。
    var quals = [];
    var seen = {};
    var re = /<source[^>]+src='([^']+\.mp4[^']*)'[^>]*label="([^"]+)"[^>]*>/gi;
    var m;
    while ((m = re.exec(html))) {
      var label = t(m[2]);
      if (!label || seen[label]) continue;
      seen[label] = 1;
      quals.push({ label: label, url: m[1].replace(/&amp;/g, "&") });
    }
    quals.sort(function (a, b) { return parseInt(b.label, 10) - parseInt(a.label, 10); });
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    for (var i = 0; i < quals.length; i++) {
      var q = quals[i];
      var id = url + "@@Q:" + q.label;
      eps.push({ name: q.label, link: id });
      seasonEps.push({ title: q.label, videoUrl: q.url, episodeNumber: i + 1 });
      epItems.push({
        id: id,
        type: "url",
        title: q.label,
        mediaType: "movie",
        posterPath: pic,
        videoUrl: q.url,
        link: id,
        episode: i + 1,
        episodeNumber: i + 1,
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
      description: quals.length ? "清晰度（有几档出几档）" : "未找到播放地址",
      mediaType: "movie",
      link: url,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app"
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "清晰度", name: "清晰度", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
      result.videoUrl = quals[0].url;
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
  // 档位入口：@@Q:<label> -> 回详情取该档直链
  var at = raw.indexOf("@@Q:");
  if (at >= 0) {
    var durl = raw.slice(0, at);
    var label = raw.slice(at + 4);
    try {
      var det = await loadDetail(durl);
      var items = det && det.episodeItems;
      if (items) {
        for (var i = 0; i < items.length; i++) {
          if (items[i].title === label && items[i].videoUrl) {
            return [{ name: label, url: items[i].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
          }
        }
      }
    } catch (e) { /* fall through */ }
    return [];
  }
  // 直链 mp4
  if (/\.mp4(\?|#|$)/i.test(raw)) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
  }
  // 兜底：详情地址 -> 取详情首档
  try {
    var det2 = await loadDetail(raw);
    var eps = det2 && det2.episodeItems;
    if (eps && eps.length && eps[0].videoUrl) {
      return [{ name: eps[0].title || "播放", url: eps[0].videoUrl, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/" } }];
    }
  } catch (e) { /* fall through */ }
  return [];
}
