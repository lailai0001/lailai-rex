// JaSex for REX (lai_jasex v1.0.0)
// 移植自 mira-cat 蜘蛛 py_jasex.js（只读蓝图），后端 https://jasex.st。
// 列表：/censored、/uncensored、/engsub、/amateur、/genre/<slug>，翻页 <base>/page-N（28 条/页）。
// 卡片：<a class="poster-card" href="/<slug>">，封面 pics.jasex.st 直出，标题 + 番号 meta。
// 详情：data-server 按钮 VIP/DST/SHG/LLV/STP + episode id；/api/episodes/<id>/player 取 embed 地址。
// 播放：VIP 走 vid-snap-player /api/playlist-token/<uuid> 取签名 token，流地址 /v/<t>
//   （302 到签名单档 1080p HLS 主清单，分片为 .png 伪装 .ts）；LLV（luluvid）解包 jwplayer
//   取直链 master m3u8；SHG（javv）解包 links{hls3,hls4}，hls3 优先（720p master.txt 链）。
//   DST 是 DoodStream Turnstile 验证墙，跳过不绕；STP 未验证，不接。每站单档，不设假清晰度
//   选单，播单名即服务器 + 实测档位。播放头关键：vid-snap /v/<token> 带 Referer
//   https://jasex.st/ 会 403，须带 embed 页 Referer（或不带），猫源实测；LLV/SHG 签名流绑定
//   embed 请求头指纹，统一用同一套头。token 有时效，stream 模块播放时重新解析一次。
//   字幕：猫源字幕芯是猫源专属且用到 setTimeout，REX 沙箱没有，REX 版不接（与蘑菇版同口径）。

WidgetMetadata = {
  id: "lai_jasex",
  title: "JaSex",
  description: "JaSex（jasex.st）：有码/无码/英字/素人 + 253 题材筛选，VIP/LLV/SHG 三路播放",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://jasex.st",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "🆕最新推荐", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🔞有码", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "censored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🔓无码", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "uncensored" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🔤英字", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "engsub" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "👤素人", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "amateur" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🍈巨乳 Big Tits", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genre/big-tits" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🍑大屁股 Huge Butt", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genre/huge-butt" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🍑好屁股 Sweet Ass", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genre/sweet-ass" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🎞️数码马赛克", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genre/digital-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🎞️风险马赛克", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genre/risky-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🎭题材全部", functionName: "loadList", cacheDuration: 180, params: [{ name: "cat", title: "分类", type: "constant", value: "genre_zone" }, { name: "sub", title: "题材", type: "enumeration", value: "solowork", enumOptions: [{ title: "Solowork", value: "solowork" }, { title: "Creampie", value: "creampie" }, { title: "Big Tits", value: "big-tits" }, { title: "Married Woman", value: "married-woman" }, { title: "Blowjob", value: "blowjob" }, { title: "Slender", value: "slender" }, { title: "Beautiful Girl", value: "beautiful-girl" }, { title: "Slut", value: "slut" }, { title: "Amateur", value: "amateur" }, { title: "Mature Woman", value: "mature-woman" }, { title: "Cuckold", value: "cuckold" }, { title: "POV", value: "pov" }, { title: "Pretty Tits", value: "pretty-tits" }, { title: "Drama", value: "drama" }, { title: "Squirting", value: "squirting" }, { title: "Digital Mosaic", value: "digital-mosaic" }, { title: "Nasty, Hardcore", value: "nasty-hardcore" }, { title: "3P, 4P", value: "3p-4p" }, { title: "Hi-Def", value: "hi-def" }, { title: "Acme · Orgasm", value: "acme-orgasm" }, { title: "Cowgirl", value: "cowgirl" }, { title: "Kiss", value: "kiss" }, { title: "Titty Fuck", value: "titty-fuck" }, { title: "School Girls", value: "school-girls" }, { title: "Pantyhose", value: "pantyhose" }, { title: "Facials", value: "facials" }, { title: "Older Sister", value: "older-sister" }, { title: "Handjob", value: "handjob" }, { title: "Deep Throating", value: "deep-throating" }, { title: "Uniform", value: "uniform" }, { title: "OL", value: "ol" }, { title: "Paipan", value: "paipan" }, { title: "Promiscuity", value: "promiscuity" }, { title: "4K", value: "4k" }, { title: "Affair", value: "affair" }, { title: "Debut Production", value: "debut-production" }, { title: "Sweet Ass", value: "sweet-ass" }, { title: "Abuse", value: "abuse" }, { title: "Cosplay", value: "cosplay" }, { title: "Huge Butt", value: "huge-butt" }, { title: "Other Fetish", value: "other-fetish" }, { title: "Risky Mosaic", value: "risky-mosaic" }, { title: "Humiliation", value: "humiliation" }, { title: "Cunnilingus", value: "cunnilingus" }, { title: "Anal", value: "anal" }, { title: "Female Teacher", value: "female-teacher" }, { title: "Relatives", value: "relatives" }, { title: "Urination", value: "urination" }, { title: "Subjectivity", value: "subjectivity" }, { title: "Documentary", value: "documentary" }, { title: "Masturbation", value: "masturbation" }, { title: "Butt", value: "butt" }, { title: "Dirty Words", value: "dirty-words" }, { title: "Lesbian", value: "lesbian" }, { title: "Tall", value: "tall" }, { title: "Bukkake", value: "bukkake" }, { title: "Cum", value: "cum" }, { title: "Planning", value: "planning" }, { title: "Entertainer", value: "entertainer" }, { title: "Fair Skin", value: "fair-skin" }, { title: "Leg Fetish", value: "leg-fetish" }, { title: "Submissive Woman", value: "submissive-woman" }, { title: "Footjob", value: "footjob" }, { title: "Sister", value: "sister" }, { title: "Toy", value: "toy" }, { title: "Lotion", value: "lotion" }, { title: "Bareback", value: "bareback" }, { title: "Female College Student", value: "female-college-student" }, { title: "Submissive Men", value: "submissive-men" }, { title: "Huge Cock", value: "huge-cock" }, { title: "Back", value: "back" }, { title: "Restraint", value: "restraint" }, { title: "Gal", value: "gal" }, { title: "Hot Spring", value: "hot-spring" }, { title: "School Swimsuit", value: "school-swimsuit" }, { title: "Various Professions", value: "various-professions" }, { title: "Voyeur", value: "voyeur" }, { title: "Close Up", value: "close-up" }, { title: "Nurse", value: "nurse" }, { title: "Prostitutes", value: "prostitutes" }, { title: "Sexy Legs", value: "sexy-legs" }, { title: "Virgin Man", value: "virgin-man" }, { title: "Black Hair", value: "black-hair" }, { title: "Nampa", value: "nampa" }, { title: "Shibari", value: "shibari" }, { title: "69", value: "69" }, { title: "SM", value: "sm" }, { title: "Sweat", value: "sweat" }, { title: "Best, Omnibus", value: "best-omnibus" }, { title: "Girl", value: "girl" }, { title: "Lesbian Kiss", value: "lesbian-kiss" }, { title: "Massage", value: "massage" }, { title: "Rape", value: "rape" }, { title: "Beauty Shop", value: "beauty-shop" }, { title: "Drug", value: "drug" }, { title: "Vibe", value: "vibe" }, { title: "AV Idol", value: "av-idol" }, { title: "Busty Fetish", value: "busty-fetish" }, { title: "Conceived", value: "conceived" }, { title: "Cross Dressing", value: "cross-dressing" }, { title: "Cum-in-Mouth", value: "cum-in-mouth" }, { title: "Threesome / Foursome", value: "threesome-foursome" }, { title: "Tits", value: "tits" }, { title: "Transsexual", value: "transsexual" }, { title: "Lingerie", value: "lingerie" }, { title: "Long Boots", value: "long-boots" }, { title: "Mother", value: "mother" }, { title: "Subordinates / Colleagues", value: "subordinates-colleagues" }, { title: "Training", value: "training" }, { title: "Anal Sex (TS)", value: "anal-sex-ts" }, { title: "BBW", value: "bbw" }, { title: "Clumsy And Absent-minded", value: "clumsy-and-absent-minded" }, { title: "Gangbang", value: "gangbang" }, { title: "School Stuff", value: "school-stuff" }, { title: "Cheating Wife", value: "cheating-wife" }, { title: "Female Investigator", value: "female-investigator" }, { title: "Image Video", value: "image-video" }, { title: "Kimono, Mourning", value: "kimono-mourning" }, { title: "Maid", value: "maid" }, { title: "Model", value: "model" }, { title: "Nymphomaniac", value: "nymphomaniac" }, { title: "Stepmother", value: "stepmother" }, { title: "Ultra-Huge Tits", value: "ultra-huge-tits" }, { title: "Childhood Friend", value: "childhood-friend" }, { title: "Date", value: "date" }, { title: "Electric Massager", value: "electric-massager" }, { title: "Female Boss", value: "female-boss" }, { title: "Finger Fuck", value: "finger-fuck" }, { title: "Masturbation Support", value: "masturbation-support" }, { title: "Original Collaboration", value: "original-collaboration" }, { title: "Outdoors", value: "outdoors" }, { title: "Prank", value: "prank" }, { title: "School Uniform", value: "school-uniform" }, { title: "Secretary", value: "secretary" }, { title: "Swimwear", value: "swimwear" }, { title: "Underwear", value: "underwear" }, { title: "Bitch", value: "bitch" }, { title: "Cheating/Being Cheated On/NTR", value: "cheating-being-cheated-on-ntr" }, { title: "Enema", value: "enema" }, { title: "Evil", value: "evil" }, { title: "Facesitting", value: "facesitting" }, { title: "Mini", value: "mini" }, { title: "Piss Drinking", value: "piss-drinking" }, { title: "Bath", value: "bath" }, { title: "Bride, Young Wife", value: "bride-young-wife" }, { title: "Business Attire", value: "business-attire" }, { title: "Cervix", value: "cervix" }, { title: "Delusion", value: "delusion" }, { title: "Elder Male", value: "elder-male" }, { title: "Erotic Wear", value: "erotic-wear" }, { title: "Harlem", value: "harlem" }, { title: "Impromptu Sex", value: "impromptu-sex" }, { title: "Insult", value: "insult" }, { title: "Milf", value: "milf" }, { title: "Sunburn", value: "sunburn" }, { title: "Actress Best", value: "actress-best" }, { title: "Anal Sex", value: "anal-sex" }, { title: "Athlete", value: "athlete" }, { title: "Aunt", value: "aunt" }, { title: "Car Sex", value: "car-sex" }, { title: "Fan Appreciation", value: "fan-appreciation" }, { title: "Fisting", value: "fisting" }, { title: "Glasses", value: "glasses" }, { title: "How To", value: "how-to" }, { title: "Idols And Entertainers", value: "idols-and-entertainers" }, { title: "Married Women/housewives", value: "married-women-housewives" }, { title: "No Bra", value: "no-bra" }, { title: "Sailor Suit", value: "sailor-suit" }, { title: "Stewardess", value: "stewardess" }, { title: "Widow", value: "widow" }, { title: "Adopted Daughter", value: "adopted-daughter" }, { title: "AI-Generated Works", value: "ai-generated-works" }, { title: "Bloomers", value: "bloomers" }, { title: "Celebrity", value: "celebrity" }, { title: "Club Activities / Manager", value: "club-activities-manager" }, { title: "Confinement", value: "confinement" }, { title: "Daydreamers", value: "daydreamers" }, { title: "Fantasy", value: "fantasy" }, { title: "Gag · Comedy", value: "gag-comedy" }, { title: "Hard Sex", value: "hard-sex" }, { title: "Hypnosis", value: "hypnosis" }, { title: "Landlady, Hostess", value: "landlady-hostess" }, { title: "Male Squirting", value: "male-squirting" }, { title: "Molester", value: "molester" }, { title: "Multiple Story", value: "multiple-story" }, { title: "Muscle", value: "muscle" }, { title: "Naked Apron", value: "naked-apron" }, { title: "Premature Ejaculation", value: "premature-ejaculation" }, { title: "Race Queen", value: "race-queen" }, { title: "Shotacon", value: "shotacon" }, { title: "Tsundere", value: "tsundere" }, { title: "30's", value: "30-s" }, { title: "Blu-ray", value: "blu-ray" }, { title: "Breast Milk", value: "breast-milk" }, { title: "Bunny Girl", value: "bunny-girl" }, { title: "Couple", value: "couple" }, { title: "Cusco", value: "cusco" }, { title: "Dildo", value: "dildo" }, { title: "Emmanuel", value: "emmanuel" }, { title: "Experience Confession", value: "experience-confession" }, { title: "Flexible", value: "flexible" }, { title: "High-Quality VR", value: "high-quality-vr" }, { title: "Knee Socks", value: "knee-socks" }, { title: "Leotard", value: "leotard" }, { title: "Love", value: "love" }, { title: "Mini Skirt", value: "mini-skirt" }, { title: "Object Insertion", value: "object-insertion" }, { title: "Outdoors/Exposure", value: "outdoors-exposure" }, { title: "Pantyhose And Tights", value: "pantyhose-and-tights" }, { title: "Reversed Role", value: "reversed-role" }, { title: "Sexy", value: "sexy" }, { title: "Small Breasts / Flat-chested", value: "small-breasts-flat-chested" }, { title: "Soapland", value: "soapland" }, { title: "Spanking", value: "spanking" }, { title: "Time Stop", value: "time-stop" }, { title: "Vomit", value: "vomit" }, { title: "Voyeurism And Peeping", value: "voyeurism-and-peeping" }, { title: "White Actress", value: "white-actress" }, { title: "Yoga", value: "yoga" }, { title: "20's", value: "20-s" }, { title: "40's", value: "40-s" }, { title: "50's", value: "50-s" }, { title: "8KVR", value: "8kvr" }, { title: "Anchorwoman", value: "anchorwoman" }, { title: "AV OPEN 2015 Actress Dept.", value: "av-open-2015-actress-dept" }, { title: "Bondage", value: "bondage" }, { title: "Candle", value: "candle" }, { title: "Dance", value: "dance" }, { title: "Dead Drunk", value: "dead-drunk" }, { title: "Defecation", value: "defecation" }, { title: "Egg Vibrator", value: "egg-vibrator" }, { title: "Female Doctor", value: "female-doctor" }, { title: "Granny", value: "granny" }, { title: "Hospital / Clinic", value: "hospital-clinic" }, { title: "Instructor", value: "instructor" }, { title: "Kimono", value: "kimono" }, { title: "Loli", value: "loli" }, { title: "Look-alike", value: "look-alike" }, { title: "Miss", value: "miss" }, { title: "Mistress", value: "mistress" }, { title: "Naive", value: "naive" }, { title: "Otaku", value: "otaku" }, { title: "Post", value: "post" }, { title: "Receptionist", value: "receptionist" }, { title: "Reluctant", value: "reluctant" }, { title: "Sex Conversion / Feminized", value: "sex-conversion-feminized" }, { title: "Shave", value: "shave" }, { title: "Torture", value: "torture" }, { title: "Travel", value: "travel" }, { title: "Tutor", value: "tutor" }, { title: "VR", value: "vr" }, { title: "VR Exclusive", value: "vr-exclusive" }, { title: "Young Wife", value: "young-wife" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { id: "loadResource", title: "播放资源", description: "播放时重新解析详情取最新流地址并附播放头", functionName: "loadResource", type: "stream", cacheDuration: 0, params: [] }
  ]
};

var HOST = "https://jasex.st";
var VIDSNAP = "https://vid-snap-player.com";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

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

function clean(s) {
  return unescapeHtml(String(s || "").replace(/<[^>]+>/g, ""))
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ").trim();
}

function absUrl(u, host) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return host + u;
  return u;
}

function normUrl(u) {
  var s = t(u);
  if (!s) return "";
  s = s.replace(/^(https?:)\/([^/])/, "$1//$2");
  return s;
}

function playHeaders(referer) {
  return {
    "User-Agent": UA,
    "Referer": referer || VIDSNAP + "/",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9"
  };
}

async function getHtml(url, referer) {
  var u = t(url);
  if (!u) return "";
  if (u.indexOf("//") === 0) u = "https:" + u;
  else if (u.charAt(0) === "/") u = HOST + u;
  try {
    var res = await Widget.http.get(u, {
      headers: {
        "User-Agent": UA,
        "Referer": referer || HOST + "/",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    if (!res || res.data == null) return "";
    return String(res.data);
  } catch (e) { return ""; }
}

async function getJson(url, referer) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Referer": referer || HOST + "/",
        "Accept": "application/json"
      }
    });
    if (!res || res.data == null) return null;
    if (typeof res.data === "object") return res.data;
    var s = String(res.data).trim();
    if (!s) return null;
    try { return JSON.parse(s); } catch (e) { return null; }
  } catch (e) { return null; }
}

function parseCards(html) {
  var byUrl = {};
  var order = [];
  var re = /<a class="poster-card" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  var m;
  while ((m = re.exec(String(html || "")))) {
    var href = t(m[1]);
    var inner = m[2];
    if (!href) continue;
    if (href.indexOf("/genre/") === 0 || href.indexOf("/genres") === 0) continue;
    var vUrl = href.indexOf("http") === 0 ? href : HOST + href;
    var it = byUrl[vUrl];
    if (!it) {
      it = { vod_id: href, vod_name: "", vod_pic: "", vod_remarks: "" };
      byUrl[vUrl] = it;
      order.push(vUrl);
    }
    var imgM = inner.match(/<img[^>]+src="([^"]+)"/i);
    if (imgM && !it.vod_pic) {
      var pic = t(imgM[1]);
      if (pic.indexOf("logo") >= 0) {
        var fb = inner.match(/data-fallback="([^"]+)"/i);
        if (fb) pic = t(fb[1]);
      }
      if (pic) it.vod_pic = normUrl(pic.indexOf("http") === 0 ? pic : absUrl(pic, HOST));
    }
    var tM = inner.match(/poster-card__title">([^<]+)</);
    if (tM && !it.vod_name) it.vod_name = cleanLabel(tM[1]);
    var cM = inner.match(/poster-card__meta">([^<]+)</);
    if (cM && !it.vod_remarks) it.vod_remarks = cleanLabel(cM[1]);
  }
  var out = [];
  for (var i = 0; i < order.length; i++) {
    var item = byUrl[order[i]];
    if (item.vod_pic || item.vod_name) {
      if (!item.vod_name) item.vod_name = "JaSex";
      out.push({
        id: item.vod_id,
        type: "url",
        title: item.vod_name,
        posterPath: item.vod_pic,
        coverUrl: item.vod_pic,
        backdropPath: item.vod_pic,
        link: item.vod_id,
        description: item.vod_remarks,
        mediaType: "movie"
      });
    }
  }
  return out;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function parseServers(html) {
  var servers = [];
  var re = /<button[^>]*data-server="(\d+)"[^>]*data-episode="(\d+)"[^>]*>([\s\S]*?)<\/button>/g;
  var m;
  while ((m = re.exec(String(html || "")))) {
    var name = cleanLabel(m[3]).replace(/\s+/g, " ").trim();
    if (m[2]) servers.push({ server: m[1], episode: m[2], name: name || ("Server " + m[1]) });
  }
  servers.sort(function (a, b) {
    if (a.name === "VIP") return -1;
    if (b.name === "VIP") return 1;
    return 0;
  });
  return servers;
}

// Dean Edwards packer 解包（LLV/SHG filehost 的 jwplayer 配置是 packed 的）。
// 纯字符串字典替换，不 eval：解出配置后从中读流地址。
function unpackPacked(html) {
  var m = String(html || "").match(/eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?\}\('([\s\S]*?)',(\d+),(\d+),'([\s\S]*?)'\.split\('\|'\)\)/);
  if (!m) return "";
  var packed = m[1];
  var radix = parseInt(m[2], 10);
  var count = parseInt(m[3], 10);
  var dict = m[4].split("|");
  var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var baseN = function (n, b) {
    if (n === 0) return "0";
    var out = "";
    while (n > 0) { out = chars.charAt(n % b) + out; n = Math.floor(n / b); }
    return out;
  };
  var out = packed;
  for (var cc = count - 1; cc >= 0; cc--) {
    var word = dict[cc];
    if (!word) continue;
    var re = new RegExp("\\b" + baseN(cc, radix) + "\\b", "g");
    out = out.replace(re, function () { return word; });
  }
  return out;
}

function embedOrigin(embed) {
  var m = String(embed || "").match(/^(https?:\/\/[^\/]+)/);
  return m ? m[1] : "";
}

// 解析一个 embed 地址为 { url, embed, label }，解不出返回 null。
// - vid-snap-player（VIP）：签名 token API，单档 1080p。
// - luluvid（LLV）：解包 jwplayer，sources[0].file 即 master m3u8。
// - javv（SHG）：解包 links{hls3,hls4}，hls3 优先（猫源实测 720p master.txt 链）。
// - playmogo/DoodStream（DST）：Turnstile 验证墙，跳过不绕；streamtape（STP）及其他的未验证，不接。
async function resolveEmbed(embed, durl, serverName) {
  if (!embed) return null;
  if (embed.indexOf("vid-snap-player.com/embed/") >= 0) {
    var parts = embed.split("/").filter(function (x) { return !!x; });
    var uuid = parts.length ? parts[parts.length - 1].split("?")[0] : "";
    if (!uuid) return null;
    var tj = await getJson(VIDSNAP + "/api/playlist-token/" + encodeURIComponent(uuid), embed);
    var token = tj && tj.t ? String(tj.t) : "";
    if (token) return { url: VIDSNAP + "/v/" + token, embed: embed, label: (serverName || "VIP") + "·1080p" };
    return null;
  }
  if (embed.indexOf("playmogo.com") >= 0 || embed.indexOf("dood") >= 0) return null;
  if (embed.indexOf("luluvid.xyz") < 0 && embed.indexOf("javv.xyz") < 0) return null;
  var page = await getHtml(embed, durl);
  if (!page) return null;
  // packed 内容里的引号是反斜杠转义的（\"），先还原再匹配，否则 SHG 的 links 值永远对不上。
  var setup = unpackPacked(page).replace(/\\"/g, '"').replace(/\\\//g, "/");
  if (!setup) return null;
  // SHG links 优先（hls3 稳定；hls2 猫源实测 403，不取）。
  var linksM = setup.match(/links\s*=\s*\{([^}]*)\}/);
  if (linksM) {
    var keys = ["hls3", "hls4"];
    for (var ki = 0; ki < keys.length; ki++) {
      var key = keys[ki];
      var lm = linksM[1].match(new RegExp(key + '"?\\s*:\\s*"([^"]+)"'));
      var link = lm ? lm[1].replace(/\\\//g, "/") : "";
      if (!link) continue;
      if (link.charAt(0) === "/") link = embedOrigin(embed) + link;
      if (link.indexOf("m3u8") >= 0 || link.indexOf("master.txt") >= 0) {
        return { url: link, embed: embed, label: (serverName || "SHG") + "·720p" };
      }
    }
  }
  // LLV：sources:[{file:"...master.m3u8..."}]
  var fileM = setup.match(/file:\s*"([^"]+\.m3u8[^"]*)"/);
  if (fileM) {
    var flink = fileM[1].replace(/\\\//g, "/");
    if (flink.charAt(0) === "/") flink = embedOrigin(embed) + flink;
    return { url: flink, embed: embed, label: (serverName || "LLV") + "·Original" };
  }
  return null;
}

async function resolveFromServers(servers, durl) {
  for (var i = 0; i < servers.length; i++) {
    var sv = servers[i];
    var pj = await getJson(HOST + "/api/episodes/" + encodeURIComponent(sv.episode) + "/player", durl);
    var embed = pj && pj.data && pj.data.embed_url ? String(pj.data.embed_url) : "";
    if (!embed) continue;
    var res = await resolveEmbed(embed, durl, sv.name);
    if (res) return res;
  }
  return null;
}

// 详情页 -> { url, embed, label } 或 null。流地址的 Referer 必须用 embed 页，
// 绝不用 jasex.st（vid-snap /v/<token> 带 jasex.st Referer 会 403，猫源实测）。
async function resolveStream(durl) {
  var html = await getHtml(durl);
  if (!html) return null;
  return resolveFromServers(parseServers(html), durl);
}

async function loadList(params) {
  params = params || {};
  var cat = t(params.cat || "");
  var sub = t(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var base = "";
  if (!cat || cat === "home") {
    base = "/";
  } else if (cat === "genre_zone") {
    if (!sub) return emptyItem();
    base = "/genre/" + sub;
  } else if (cat === "censored" || cat === "uncensored" || cat === "engsub" || cat === "amateur") {
    base = "/" + cat;
  } else if (cat.indexOf("genre/") === 0) {
    base = "/" + cat;
  } else {
    base = "/" + cat;
  }
  var path = base;
  if (base !== "/" && page > 1) path = base + "/page-" + page;
  try {
    var html = await getHtml(path);
    var list = parseCards(html);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
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
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  try {
    var html = await getHtml("/search?q=" + encodeURIComponent(wd));
    var list = parseCards(html);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

function detailPath(link) {
  var s = t(link);
  if (!s) return "";
  var m = s.match(/\/[A-Za-z0-9][A-Za-z0-9\-._~%]*\/?$/);
  if (m) return m[0];
  return s;
}

async function loadDetail(link) {
  try {
    var path = detailPath(link);
    if (!path) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var durl = path.indexOf("http") === 0 ? path : HOST + path;
    var html = await getHtml(path);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var tM = html.match(/<title>(.*?)<\/title>/i);
    var mainTitle = "JaSex";
    if (tM) mainTitle = cleanLabel(tM[1]).replace(/\s*[·\-]\s*Jasex\s*$/i, "").trim() || "JaSex";
    var codeM = html.match(/<dt>Code<\/dt>\s*<dd>([^<]+)<\/dd>/i);
    var code = codeM ? cleanLabel(codeM[1]) : "";
    var posterPic = "";
    var stillM = html.match(/player__still"[\s\S]{0,600}?<img[^>]+src="([^"]+)"/i);
    if (stillM) posterPic = normUrl(t(stillM[1]));
    if (!posterPic) {
      var pm = html.match(/https:\/\/pics\.jasex\.st\/posters\/[^\s"'<>]+/);
      if (pm) posterPic = pm[0];
    }
    var servers = parseServers(html);
    var stream = await resolveFromServers(servers, durl);
    var playUrl = stream ? stream.url : "";
    var playLabel = stream ? stream.label : "JaSex";
    var playEmbed = stream ? stream.embed : "";
    var result = {
      id: durl,
      type: "detail",
      title: mainTitle,
      link: durl,
      posterPath: posterPic,
      coverUrl: posterPic,
      backdropPath: posterPic,
      description: code ? ("番号：" + code) : "",
      playerType: "app"
    };
    if (playUrl) {
      result.videoUrl = playUrl;
      result.customHeaders = playHeaders(playEmbed);
      result.episodes = [{ name: playLabel, link: durl }];
      result.episodeItems = [{ id: durl, title: mainTitle + " " + playLabel, name: playLabel, mediaType: "movie", link: durl }];
      result.childItems = result.episodeItems;
    } else {
      result.description = (code ? ("番号：" + code + "\n") : "") + "未找到播放地址";
    }
    return result;
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

function isVideoFormat(url) {
  var low = String(url || "").toLowerCase();
  return low.indexOf(".m3u8") >= 0 || low.indexOf(".mp4") >= 0 || low.indexOf("master.txt") >= 0 || low.indexOf(".ts") >= 0;
}

// 播放时重新解析：签名 token/路径有时效，详情给的地址点播时可能已过期，
// 优先现解析，失败才回落到传入的直链。直链本身无 embed 上下文时只带 UA，不带 Referer
// （vid-snap /v/<token> 不带 Referer 也能 200，带 jasex.st Referer 反而 403）。
async function loadResource(params) {
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  if (isVideoFormat(raw)) {
    return [{ name: "播放", url: raw, playerType: "app", customHeaders: { "User-Agent": UA } }];
  }
  var durl = raw.indexOf("http") === 0 ? raw : HOST + (raw.charAt(0) === "/" ? raw : "/" + raw);
  var stream = null;
  try { stream = await resolveStream(durl); } catch (e) { stream = null; }
  if (stream && stream.url) {
    return [{ name: stream.label || "播放", url: stream.url, playerType: "app", customHeaders: playHeaders(stream.embed) }];
  }
  return [];
}
