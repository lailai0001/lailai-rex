// 丝瓜视频 for REX (lai_siguaspw v1.0.0)
// 移植自 mira-cat 蜘蛛 py_siguaspw.js（只读蓝图），后端 https://siguaspw.cc。
// 与桃花视频/蘑菇视频同 CMS：/video/<数字>/ 卡片 + 详情 data-url 拼 cdn_lines。
// 分类：首页实测 228 个 /category/cateNN/，分创作者/题材/厂牌/更多四组作顶级分类，
//   各组细分走 enumeration 筛选（对应猫源 filters.sub），名与 ID 全部照抄猫源 ZONES，不编造。
//   另单列用户点名的两个顶级分类：无码破解 cate205、大奶美乳 cate164（猫源 home() 已证实）。
// 列表翻页：/category/<cate>/<页码>/；首页：/（第 2 页起 /page/<页>/，同 CMS 口径）。
// 详情：data-url + cdn_lines 首选 cloudfront 线（d1uy7itup9paqh，猫源 VM 实测 200）。
// 播放：单集正片直链 m3u8（AES-128 媒体播单），站方每片只给一条单码率播单，
//   故不设 1080p/720p 假清晰度选单。字幕：猫源字幕芯是猫源专属，REX 版不接。

WidgetMetadata = {
  id: "lai_siguaspw",
  title: "丝瓜视频",
  description: "丝瓜视频（siguaspw.cc）：4 大区 228 分类 + 细分筛选，详情单集正片直链播放",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://siguaspw.cc",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "🔥首页推荐", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_home" }, { name: "sub", title: "细分分类", type: "constant", value: "route_home" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🎙️主播达人", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_creator" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate4", enumOptions: [{ title: "精选Vlog", value: "cate4" }, { title: "SweetieYico-亦可姐姐", value: "cate5" }, { title: "Silky Suki 丝琪", value: "cate6" }, { title: "桃桃学姐（樱空桃桃）", value: "cate7" }, { title: "萌崽儿", value: "cate8" }, { title: "小水水", value: "cate9" }, { title: "Nicolove 妮可", value: "cate10" }, { title: "桥本香菜", value: "cate11" }, { title: "狐不妖", value: "cate12" }, { title: "辛尤里", value: "cate13" }, { title: "小欣奈", value: "cate14" }, { title: "饼干姐姐", value: "cate15" }, { title: "Nana_taipei", value: "cate16" }, { title: "玩偶姐姐", value: "cate17" }, { title: "苏小涵", value: "cate18" }, { title: "情深叉喔", value: "cate19" }, { title: "多亿", value: "cate20" }, { title: "御梦子", value: "cate21" }, { title: "退役御姐-林夕", value: "cate22" }, { title: "91兔兔", value: "cate23" }, { title: "Naomiii hub", value: "cate24" }, { title: "yuukoo", value: "cate25" }, { title: "Elle Lee", value: "cate26" }, { title: "Make性专家", value: "cate27" }, { title: "Yui", value: "cate28" }, { title: "小母狗优咪", value: "cate29" }, { title: "love姐", value: "cate30" }, { title: "苏畅", value: "cate31" }, { title: "小敏儿", value: "cate32" }, { title: "锅锅酱", value: "cate33" }, { title: "丝丝女神", value: "cate34" }, { title: "cola酱 唐可可", value: "cate35" }, { title: "鸡蛋饼", value: "cate36" }, { title: "黑椒盖饭", value: "cate37" }, { title: "泰国网黄obokozu", value: "cate38" }, { title: "Bigfan13yo", value: "cate39" }, { title: "Miss A", value: "cate40" }, { title: "日系少女地雷", value: "cate41" }, { title: "网红留学生-刘玥", value: "cate42" }, { title: "日本网黄-Yua", value: "cate43" }, { title: "谭晓彤", value: "cate44" }, { title: "长腿御姐Apple", value: "cate45" }, { title: "下面有根棒棒糖", value: "cate46" }, { title: "斯文禽兽", value: "cate47" }, { title: "小二先生", value: "cate48" }, { title: "唐伯虎", value: "cate49" }, { title: "小桃酱", value: "cate50" }, { title: "鸡教练", value: "cate51" }, { title: "粉色情人", value: "cate52" }, { title: "冉冉学姐", value: "cate53" }, { title: "二代CC", value: "cate54" }, { title: "捅主任", value: "cate55" }, { title: "台湾粉红兔", value: "cate56" }, { title: "涵菱", value: "cate57" }, { title: "荔枝", value: "cate58" }, { title: "京圈嫩模瑶瑶", value: "cate59" }, { title: "umate博主秀-原创中心", value: "cate61" }, { title: "爆款推荐-热播排行榜", value: "cate62" }, { title: "台妹-汐梦瑶", value: "cate63" }, { title: "懒懒猪儿-喜欢被抱、被操到哭", value: "cate64" }, { title: "诺诺-想成为你的专属宝贝!", value: "cate65" }, { title: "小巧芋艿taro", value: "cate66" }, { title: "阿朱", value: "cate67" }, { title: "糖心淑怡", value: "cate68" }, { title: "Couple love-原创", value: "cate69" }, { title: "羞羞兔", value: "cate70" }, { title: "草莓味的软糖呀", value: "cate71" }, { title: "台湾第一女优-吴梦梦", value: "cate72" }, { title: "小辣椒", value: "cate73" }, { title: "yuna", value: "cate74" }, { title: "鹤酱-鹤7", value: "cate75" }, { title: "Chloe", value: "cate76" }, { title: "爱丝袜的Vivian姐", value: "cate77" }, { title: "淫妻交换-绿帽老公", value: "cate78" }, { title: "艾希老师", value: "cate79" }, { title: "许木学长", value: "cate80" }, { title: "司雨", value: "cate81" }, { title: "蛇信子兔牙", value: "cate82" }, { title: "小阿俏", value: "cate83" }, { title: "橘子猫", value: "cate84" }, { title: "小余baby", value: "cate85" }, { title: "米胡桃", value: "cate86" }, { title: "国产D先生", value: "cate87" }, { title: "猫宝宝", value: "cate88" }, { title: "奶茶妹妹", value: "cate89" }, { title: "香菜公主", value: "cate90" }, { title: "甜心宝贝", value: "cate91" }, { title: "水冰月", value: "cate92" }, { title: "柚子猫", value: "cate93" }, { title: "小苏拉", value: "cate94" }, { title: "麻酥酥呦", value: "cate95" }, { title: "又又酱", value: "cate96" }, { title: "耀灵", value: "cate97" }, { title: "九尾狐狸又名-香草少女", value: "cate98" }, { title: "小巨", value: "cate99" }, { title: "小鸟酱", value: "cate100" }, { title: "八月未央", value: "cate101" }, { title: "来自喵星的岁酱", value: "cate102" }, { title: "果如cc", value: "cate103" }, { title: "海量片源-国产天花板-外网女菩萨", value: "cate105" }, { title: "反差婊-母狗界天花板", value: "cate106" }, { title: "精选萝莉，少女天花板", value: "cate107" }, { title: "私人定制-私拍流出", value: "cate108" }, { title: "原创短剧-剧情演绎", value: "cate109" }, { title: "安安老师-纯欲学姐", value: "cate110" }, { title: "米娜学姐", value: "cate111" }, { title: "酥酥", value: "cate112" }, { title: "91大神", value: "cate113" }, { title: "小晗wink", value: "cate114" }, { title: "骚御", value: "cate115" }, { title: "铃木君", value: "cate116" }, { title: "小恩", value: "cate117" }, { title: "芋圆", value: "cate118" }, { title: "樱狸子", value: "cate119" }, { title: "小爱神", value: "cate120" }, { title: "仙仙桃", value: "cate121" }, { title: "桃谷谷", value: "cate122" }, { title: "小晚酱", value: "cate123" }, { title: "骚萝baby", value: "cate124" }, { title: "软妹", value: "cate125" }, { title: "妮酱", value: "cate126" }, { title: "萌白酱", value: "cate127" }, { title: "可爱兔", value: "cate128" }, { title: "花菜", value: "cate129" }, { title: "白桃少女", value: "cate130" }, { title: "FC2", value: "cate131" }, { title: "小奶瓶", value: "cate132" }, { title: "嫩妹肏穴-粉嫩鲍鱼举着嫩妹操到射", value: "cate134" }, { title: "人妻-别人的老婆是最好的", value: "cate135" }, { title: "乱伦实录-伦理的流失 禁忌的快感", value: "cate136" }, { title: "网红集结地", value: "cate137" }, { title: "下海萝莉-生活不易萝莉卖艺", value: "cate138" }, { title: "台湾之光：跨界演出的女优们", value: "cate139" }, { title: "色播名场面", value: "cate140" }, { title: "探花档案-约炮大神实录", value: "cate141" }, { title: "情迷SM-意乱情迷SM调教", value: "cate142" }, { title: "吃瓜一线-网红明星的秘史", value: "cate143" }, { title: "下海主播-黄播的美女主播", value: "cate144" }, { title: "Cos女神堂-cosplay爱好聚集地", value: "cate145" }, { title: "台湾色情平台-SWag", value: "cate146" }, { title: "台湾嫩模-JVID", value: "cate147" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🏷️题材标签", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_tag" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate149", enumOptions: [{ title: "精选", value: "cate149" }, { title: "孕妇奶汁", value: "cate150" }, { title: "探花", value: "cate151" }, { title: "网红吃瓜", value: "cate152" }, { title: "出轨偷情", value: "cate153" }, { title: "自慰喷水", value: "cate154" }, { title: "成人综艺", value: "cate155" }, { title: "真爱男同", value: "cate156" }, { title: "明星换脸", value: "cate157" }, { title: "女女同性", value: "cate158" }, { title: "网红流出", value: "cate159" }, { title: "SM调教", value: "cate160" }, { title: "绿帽老公", value: "cate161" }, { title: "换妻淫趴", value: "cate162" }, { title: "户外露出", value: "cate163" }, { title: "大奶美乳", value: "cate164" }, { title: "媚黑母狗", value: "cate165" }, { title: "制服诱惑", value: "cate166" }, { title: "校园女神", value: "cate167" }, { title: "按摩会所", value: "cate168" }, { title: "直播", value: "cate169" }, { title: "勾引搭讪", value: "cate170" }, { title: "ASMR", value: "cate171" }, { title: "反差婊", value: "cate172" }, { title: "母子乱伦", value: "cate174" }, { title: "淫乱师生", value: "cate175" }, { title: "舅甥外侄", value: "cate176" }, { title: "女婿通奸", value: "cate177" }, { title: "公公儿媳", value: "cate178" }, { title: "淫乱兄妹", value: "cate179" }, { title: "家庭乱伦", value: "cate180" }, { title: "淫乱姐弟", value: "cate181" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🎬传媒厂牌", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_media" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate183", enumOptions: [{ title: "麻豆传媒", value: "cate183" }, { title: "爱豆传媒", value: "cate184" }, { title: "91制片厂", value: "cate185" }, { title: "皇家华人", value: "cate186" }, { title: "SA国际传媒", value: "cate187" }, { title: "蜜桃传媒", value: "cate188" }, { title: "天美传媒", value: "cate189" }, { title: "兔子先生", value: "cate190" }, { title: "果冻传媒", value: "cate191" }, { title: "乌托邦", value: "cate192" }, { title: "性视界", value: "cate193" }, { title: "星空传媒", value: "cate194" }, { title: "精东传媒", value: "cate195" }, { title: "香蕉视频", value: "cate196" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "✨更多精选", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_more" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate198", enumOptions: [{ title: "全部", value: "cate198" }, { title: "家庭乱伦", value: "cate199" }, { title: "中文字幕", value: "cate200" }, { title: "波多野结衣", value: "cate201" }, { title: "河北彩花", value: "cate202" }, { title: "橘玛丽", value: "cate203" }, { title: "森泽佳奈", value: "cate204" }, { title: "无码破解", value: "cate205" }, { title: "JULIA", value: "cate206" }, { title: "希崎洁西卡", value: "cate207" }, { title: "七森莉莉", value: "cate208" }, { title: "三上悠亚", value: "cate209" }, { title: "桥本有菜", value: "cate210" }, { title: "松下纱荣子", value: "cate211" }, { title: "水果派解说", value: "cate212" }, { title: "全部", value: "cate214" }, { title: "Blacked RAW 黑人巨屌干超模", value: "cate215" }, { title: "DEEPER 激情性爱高清视频", value: "cate216" }, { title: "MILFY 独家4K 熟女超模 高清影片", value: "cate217" }, { title: "SLAYED 超模女同色情影片", value: "cate218" }, { title: "tushy 独家超模 高清肛交影片", value: "cate219" }, { title: "VIXEN 淫乱超模 群交 4K高清", value: "cate220" }, { title: "捷克搭讪 金钱的力量", value: "cate221" }, { title: "福利姬", value: "cate222" }, { title: "经典三级", value: "cate223" }, { title: "摄像破解", value: "cate226" }, { title: "裙底偷拍", value: "cate227" }, { title: "精品厕拍", value: "cate228" }, { title: "痴汉偷拍", value: "cate229" }, { title: "群交乱斗", value: "cate230" }, { title: "澡堂浴池", value: "cate231" }, { title: "街射涂鸦", value: "cate232" }, { title: "医院偷拍", value: "cate233" }, { title: "捷克幻想", value: "cate234" }, { title: "国产扫街", value: "cate235" }, { title: "1G老湿", value: "cate237" }, { title: "思春社", value: "cate238" }, { title: "王竹子", value: "cate239" }, { title: "独行者", value: "cate240" }, { title: "小哥哥艾理", value: "cate241" }, { title: "其它", value: "cate242" }] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🔞无码破解", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_top" }, { name: "sub", title: "细分分类", type: "constant", value: "cate205" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "🍈大奶美乳", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_top" }, { name: "sub", title: "细分分类", type: "constant", value: "cate164" }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var ZONES = [
  { id: "zone_creator", name: "🎙️主播达人", default: "cate4", subs: [{ n: "精选Vlog", v: "cate4" }, { n: "SweetieYico-亦可姐姐", v: "cate5" }, { n: "Silky Suki 丝琪", v: "cate6" }, { n: "桃桃学姐（樱空桃桃）", v: "cate7" }, { n: "萌崽儿", v: "cate8" }, { n: "小水水", v: "cate9" }, { n: "Nicolove 妮可", v: "cate10" }, { n: "桥本香菜", v: "cate11" }, { n: "狐不妖", v: "cate12" }, { n: "辛尤里", v: "cate13" }, { n: "小欣奈", v: "cate14" }, { n: "饼干姐姐", v: "cate15" }, { n: "Nana_taipei", v: "cate16" }, { n: "玩偶姐姐", v: "cate17" }, { n: "苏小涵", v: "cate18" }, { n: "情深叉喔", v: "cate19" }, { n: "多亿", v: "cate20" }, { n: "御梦子", v: "cate21" }, { n: "退役御姐-林夕", v: "cate22" }, { n: "91兔兔", v: "cate23" }, { n: "Naomiii hub", v: "cate24" }, { n: "yuukoo", v: "cate25" }, { n: "Elle Lee", v: "cate26" }, { n: "Make性专家", v: "cate27" }, { n: "Yui", v: "cate28" }, { n: "小母狗优咪", v: "cate29" }, { n: "love姐", v: "cate30" }, { n: "苏畅", v: "cate31" }, { n: "小敏儿", v: "cate32" }, { n: "锅锅酱", v: "cate33" }, { n: "丝丝女神", v: "cate34" }, { n: "cola酱 唐可可", v: "cate35" }, { n: "鸡蛋饼", v: "cate36" }, { n: "黑椒盖饭", v: "cate37" }, { n: "泰国网黄obokozu", v: "cate38" }, { n: "Bigfan13yo", v: "cate39" }, { n: "Miss A", v: "cate40" }, { n: "日系少女地雷", v: "cate41" }, { n: "网红留学生-刘玥", v: "cate42" }, { n: "日本网黄-Yua", v: "cate43" }, { n: "谭晓彤", v: "cate44" }, { n: "长腿御姐Apple", v: "cate45" }, { n: "下面有根棒棒糖", v: "cate46" }, { n: "斯文禽兽", v: "cate47" }, { n: "小二先生", v: "cate48" }, { n: "唐伯虎", v: "cate49" }, { n: "小桃酱", v: "cate50" }, { n: "鸡教练", v: "cate51" }, { n: "粉色情人", v: "cate52" }, { n: "冉冉学姐", v: "cate53" }, { n: "二代CC", v: "cate54" }, { n: "捅主任", v: "cate55" }, { n: "台湾粉红兔", v: "cate56" }, { n: "涵菱", v: "cate57" }, { n: "荔枝", v: "cate58" }, { n: "京圈嫩模瑶瑶", v: "cate59" }, { n: "umate博主秀-原创中心", v: "cate61" }, { n: "爆款推荐-热播排行榜", v: "cate62" }, { n: "台妹-汐梦瑶", v: "cate63" }, { n: "懒懒猪儿-喜欢被抱、被操到哭", v: "cate64" }, { n: "诺诺-想成为你的专属宝贝!", v: "cate65" }, { n: "小巧芋艿taro", v: "cate66" }, { n: "阿朱", v: "cate67" }, { n: "糖心淑怡", v: "cate68" }, { n: "Couple love-原创", v: "cate69" }, { n: "羞羞兔", v: "cate70" }, { n: "草莓味的软糖呀", v: "cate71" }, { n: "台湾第一女优-吴梦梦", v: "cate72" }, { n: "小辣椒", v: "cate73" }, { n: "yuna", v: "cate74" }, { n: "鹤酱-鹤7", v: "cate75" }, { n: "Chloe", v: "cate76" }, { n: "爱丝袜的Vivian姐", v: "cate77" }, { n: "淫妻交换-绿帽老公", v: "cate78" }, { n: "艾希老师", v: "cate79" }, { n: "许木学长", v: "cate80" }, { n: "司雨", v: "cate81" }, { n: "蛇信子兔牙", v: "cate82" }, { n: "小阿俏", v: "cate83" }, { n: "橘子猫", v: "cate84" }, { n: "小余baby", v: "cate85" }, { n: "米胡桃", v: "cate86" }, { n: "国产D先生", v: "cate87" }, { n: "猫宝宝", v: "cate88" }, { n: "奶茶妹妹", v: "cate89" }, { n: "香菜公主", v: "cate90" }, { n: "甜心宝贝", v: "cate91" }, { n: "水冰月", v: "cate92" }, { n: "柚子猫", v: "cate93" }, { n: "小苏拉", v: "cate94" }, { n: "麻酥酥呦", v: "cate95" }, { n: "又又酱", v: "cate96" }, { n: "耀灵", v: "cate97" }, { n: "九尾狐狸又名-香草少女", v: "cate98" }, { n: "小巨", v: "cate99" }, { n: "小鸟酱", v: "cate100" }, { n: "八月未央", v: "cate101" }, { n: "来自喵星的岁酱", v: "cate102" }, { n: "果如cc", v: "cate103" }, { n: "海量片源-国产天花板-外网女菩萨", v: "cate105" }, { n: "反差婊-母狗界天花板", v: "cate106" }, { n: "精选萝莉，少女天花板", v: "cate107" }, { n: "私人定制-私拍流出", v: "cate108" }, { n: "原创短剧-剧情演绎", v: "cate109" }, { n: "安安老师-纯欲学姐", v: "cate110" }, { n: "米娜学姐", v: "cate111" }, { n: "酥酥", v: "cate112" }, { n: "91大神", v: "cate113" }, { n: "小晗wink", v: "cate114" }, { n: "骚御", v: "cate115" }, { n: "铃木君", v: "cate116" }, { n: "小恩", v: "cate117" }, { n: "芋圆", v: "cate118" }, { n: "樱狸子", v: "cate119" }, { n: "小爱神", v: "cate120" }, { n: "仙仙桃", v: "cate121" }, { n: "桃谷谷", v: "cate122" }, { n: "小晚酱", v: "cate123" }, { n: "骚萝baby", v: "cate124" }, { n: "软妹", v: "cate125" }, { n: "妮酱", v: "cate126" }, { n: "萌白酱", v: "cate127" }, { n: "可爱兔", v: "cate128" }, { n: "花菜", v: "cate129" }, { n: "白桃少女", v: "cate130" }, { n: "FC2", v: "cate131" }, { n: "小奶瓶", v: "cate132" }, { n: "嫩妹肏穴-粉嫩鲍鱼举着嫩妹操到射", v: "cate134" }, { n: "人妻-别人的老婆是最好的", v: "cate135" }, { n: "乱伦实录-伦理的流失 禁忌的快感", v: "cate136" }, { n: "网红集结地", v: "cate137" }, { n: "下海萝莉-生活不易萝莉卖艺", v: "cate138" }, { n: "台湾之光：跨界演出的女优们", v: "cate139" }, { n: "色播名场面", v: "cate140" }, { n: "探花档案-约炮大神实录", v: "cate141" }, { n: "情迷SM-意乱情迷SM调教", v: "cate142" }, { n: "吃瓜一线-网红明星的秘史", v: "cate143" }, { n: "下海主播-黄播的美女主播", v: "cate144" }, { n: "Cos女神堂-cosplay爱好聚集地", v: "cate145" }, { n: "台湾色情平台-SWag", v: "cate146" }, { n: "台湾嫩模-JVID", v: "cate147" }] },
  { id: "zone_tag", name: "🏷️题材标签", default: "cate149", subs: [{ n: "精选", v: "cate149" }, { n: "孕妇奶汁", v: "cate150" }, { n: "探花", v: "cate151" }, { n: "网红吃瓜", v: "cate152" }, { n: "出轨偷情", v: "cate153" }, { n: "自慰喷水", v: "cate154" }, { n: "成人综艺", v: "cate155" }, { n: "真爱男同", v: "cate156" }, { n: "明星换脸", v: "cate157" }, { n: "女女同性", v: "cate158" }, { n: "网红流出", v: "cate159" }, { n: "SM调教", v: "cate160" }, { n: "绿帽老公", v: "cate161" }, { n: "换妻淫趴", v: "cate162" }, { n: "户外露出", v: "cate163" }, { n: "大奶美乳", v: "cate164" }, { n: "媚黑母狗", v: "cate165" }, { n: "制服诱惑", v: "cate166" }, { n: "校园女神", v: "cate167" }, { n: "按摩会所", v: "cate168" }, { n: "直播", v: "cate169" }, { n: "勾引搭讪", v: "cate170" }, { n: "ASMR", v: "cate171" }, { n: "反差婊", v: "cate172" }, { n: "母子乱伦", v: "cate174" }, { n: "淫乱师生", v: "cate175" }, { n: "舅甥外侄", v: "cate176" }, { n: "女婿通奸", v: "cate177" }, { n: "公公儿媳", v: "cate178" }, { n: "淫乱兄妹", v: "cate179" }, { n: "家庭乱伦", v: "cate180" }, { n: "淫乱姐弟", v: "cate181" }] },
  { id: "zone_media", name: "🎬传媒厂牌", default: "cate183", subs: [{ n: "麻豆传媒", v: "cate183" }, { n: "爱豆传媒", v: "cate184" }, { n: "91制片厂", v: "cate185" }, { n: "皇家华人", v: "cate186" }, { n: "SA国际传媒", v: "cate187" }, { n: "蜜桃传媒", v: "cate188" }, { n: "天美传媒", v: "cate189" }, { n: "兔子先生", v: "cate190" }, { n: "果冻传媒", v: "cate191" }, { n: "乌托邦", v: "cate192" }, { n: "性视界", v: "cate193" }, { n: "星空传媒", v: "cate194" }, { n: "精东传媒", v: "cate195" }, { n: "香蕉视频", v: "cate196" }] },
  { id: "zone_more", name: "✨更多精选", default: "cate198", subs: [{ n: "全部", v: "cate198" }, { n: "家庭乱伦", v: "cate199" }, { n: "中文字幕", v: "cate200" }, { n: "波多野结衣", v: "cate201" }, { n: "河北彩花", v: "cate202" }, { n: "橘玛丽", v: "cate203" }, { n: "森泽佳奈", v: "cate204" }, { n: "无码破解", v: "cate205" }, { n: "JULIA", v: "cate206" }, { n: "希崎洁西卡", v: "cate207" }, { n: "七森莉莉", v: "cate208" }, { n: "三上悠亚", v: "cate209" }, { n: "桥本有菜", v: "cate210" }, { n: "松下纱荣子", v: "cate211" }, { n: "水果派解说", v: "cate212" }, { n: "全部", v: "cate214" }, { n: "Blacked RAW 黑人巨屌干超模", v: "cate215" }, { n: "DEEPER 激情性爱高清视频", v: "cate216" }, { n: "MILFY 独家4K 熟女超模 高清影片", v: "cate217" }, { n: "SLAYED 超模女同色情影片", v: "cate218" }, { n: "tushy 独家超模 高清肛交影片", v: "cate219" }, { n: "VIXEN 淫乱超模 群交 4K高清", v: "cate220" }, { n: "捷克搭讪 金钱的力量", v: "cate221" }, { n: "福利姬", v: "cate222" }, { n: "经典三级", v: "cate223" }, { n: "摄像破解", v: "cate226" }, { n: "裙底偷拍", v: "cate227" }, { n: "精品厕拍", v: "cate228" }, { n: "痴汉偷拍", v: "cate229" }, { n: "群交乱斗", v: "cate230" }, { n: "澡堂浴池", v: "cate231" }, { n: "街射涂鸦", v: "cate232" }, { n: "医院偷拍", v: "cate233" }, { n: "捷克幻想", v: "cate234" }, { n: "国产扫街", v: "cate235" }, { n: "1G老湿", v: "cate237" }, { n: "思春社", v: "cate238" }, { n: "王竹子", v: "cate239" }, { n: "独行者", v: "cate240" }, { n: "小哥哥艾理", v: "cate241" }, { n: "其它", v: "cate242" }] }
];
var HOST = "https://siguaspw.cc";
var ALT_CDN = "https://d1uy7itup9paqh.cloudfront.net";
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

function cleanText(s) {
  return unescapeHtml(String(s || "").replace(/<[^>]+>/g, " "))
    .replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
}

function cleanLabel(s) {
  return unescapeHtml(String(s || "").replace(/<[^>]+>/g, ""))
    .replace(/[\r\n\t]+/g, " ").replace(/[$#]/g, "").replace(/\s+/g, " ").trim();
}

function absUrl(u, host) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return host + u;
  return u;
}

// 与猫源 normUrl 同口径：修单斜杠 scheme
function normUrl(u) {
  var s = t(u);
  if (!s) return "";
  s = s.replace(/^(https?:)\/([^/])/, "$1//$2");
  return s;
}

async function getHtml(path) {
  var url = t(path);
  if (url.indexOf("//") === 0) url = "https:" + url;
  else if (url.charAt(0) === "/") url = HOST + url;
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Referer": HOST + "/",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
      }
    });
    var body = res && res.data != null ? String(res.data) : "";
    if (!body) return "";
    return body;
  } catch (e) { return ""; }
}

// 本 CMS 卡片是“图链 + 文链”两个 <a> 共用同一 /video/<id>/，按 URL 合并图与标题（猫源 parseCards 口径）
function extractPic(inner) {
  var attrs = ["data-original", "data-src", "src"];
  for (var ai = 0; ai < attrs.length; ai++) {
    var re = new RegExp(attrs[ai] + "=['\"]([^'\"]+)['\"]", "i");
    var mm = inner.match(re);
    if (mm) {
      var cand = t(mm[1]);
      if (cand) {
        var low = cand.toLowerCase();
        if (low.indexOf("loading.jpg") >= 0 || low.indexOf("loading.png") >= 0 ||
            low.indexOf("placeholder") >= 0 || low.indexOf("default") >= 0) continue;
        return cand;
      }
    }
  }
  return "";
}

function parseCards(html, host) {
  var byUrl = {};
  var order = [];
  var re = /<a[^>]+href=["'](\/video\/\d+\/?)["'][^>]*>([\s\S]*?)<\/a>/g;
  var m;
  while ((m = re.exec(String(html || "")))) {
    var vUrl = t(m[1]);
    var inner = m[2];
    var it = byUrl[vUrl];
    if (!it) {
      it = { vod_id: vUrl, vod_name: "", vod_pic: "", vod_remarks: "" };
      byUrl[vUrl] = it;
      order.push(vUrl);
    }
    var pic = extractPic(inner);
    if (pic && !it.vod_pic) it.vod_pic = normUrl(pic.indexOf("http") === 0 ? pic : absUrl(pic, host));
    var txt = cleanLabel(inner);
    if (txt && txt.length > 2 && !it.vod_name) it.vod_name = txt;
    var durM = inner.match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
    if (durM && !it.vod_remarks) it.vod_remarks = durM[1];
  }
  var out = [];
  for (var i = 0; i < order.length; i++) {
    var item = byUrl[order[i]];
    if (item.vod_pic || item.vod_name) {
      out.push({
        id: item.vod_id,
        type: "url",
        title: item.vod_name || "精彩视频",
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

function findZone(zoneId) {
  for (var i = 0; i < ZONES.length; i++) {
    if (ZONES[i].id === zoneId) return ZONES[i];
  }
  return null;
}

async function loadList(params) {
  params = params || {};
  var zoneId = t(params.zone || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var zone = findZone(zoneId);
  var target = t(params.sub || "");
  if (!target) target = zone ? zone.default : zoneId;
  if (!target) return emptyItem();
  var path = "";
  if (target === "route_home") {
    path = page === 1 ? "/" : ("/page/" + page + "/");
  } else {
    path = page === 1 ? ("/category/" + target + "/") : ("/category/" + target + "/" + page + "/");
  }
  try {
    var html = await getHtml(path);
    var list = parseCards(html, HOST);
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
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var path = page === 1 ? ("/search/" + encodeURIComponent(wd) + "/") : ("/search/" + encodeURIComponent(wd) + "/" + page + "/");
  try {
    var html = await getHtml(path);
    var list = parseCards(html, HOST);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

// 详情 data-url + cdn_lines（猫源口径）
function parseCdnLines(html) {
  var bases = [];
  var m = String(html || "").match(/cdn_lines\s*=\s*'([^']+)'/);
  if (m) {
    try {
      var arr = JSON.parse(m[1].replace(/\\\//g, "/"));
      for (var i = 0; i < arr.length; i++) {
        var b = String((arr[i] && arr[i].cdnLine) || "").replace(/\/+$/, "").replace(/^(https?:)\/([^/])/, "$1//$2");
        if (b.indexOf("http") === 0 && bases.indexOf(b) < 0) bases.push(b);
      }
    } catch (e) { /* ignore */ }
  }
  return bases;
}

function pickPlayBase(bases) {
  var list = bases || [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].indexOf("d1uy7itup9paqh.cloudfront.net") >= 0) return list[i];
  }
  for (var j = 0; j < list.length; j++) {
    if (list[j].indexOf("cloudfront") >= 0) return list[j];
  }
  return list[0] || "";
}

function extractDataUrl(html) {
  var m = String(html || "").match(/data-url=["']([^"']+)["']/i);
  if (!m) return "";
  return t(m[1]).replace(/\\u002F/g, "/").replace(/\\\//g, "/").replace(/&amp;/g, "&");
}

function extractPlayStream(html) {
  var m = html.match(/https?:\/\/[^\s"'$<>]+\.m3u8[^\s"'$<>]*/i);
  if (m) return normUrl(m[0].replace(/\\u002F/g, "/").replace(/\\\//g, "/"));
  m = html.match(/https?:\/\/[^\s"'$<>]+\.mp4[^\s"'$<>]*/i);
  if (m) return normUrl(m[0].replace(/\\u002F/g, "/").replace(/\\\//g, "/"));
  return "";
}

function detailPath(link) {
  var s = t(link);
  if (!s) return "";
  var m = s.match(/\/video\/\d+\/?/);
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
    var mainTitle = "精彩视频";
    if (tM) mainTitle = cleanLabel(tM[1]).replace(/\s*-\s*丝瓜视频\s*$/i, "").trim() || "精彩视频";
    var posterPic = "";
    var ogM = html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (ogM) posterPic = normUrl(t(ogM[1]));
    if (!posterPic) {
      var cm = html.match(/https:\/\/d1uy7itup9paqh\.cloudfront\.net\/image\/[^\s"'<>]+/);
      if (cm) posterPic = cm[0];
    }
    var playUrl = "";
    var dataUrl = extractDataUrl(html);
    if (dataUrl) {
      if (dataUrl.indexOf("http") === 0) {
        playUrl = dataUrl;
      } else {
        var bases = parseCdnLines(html);
        var base = pickPlayBase(bases);
        if (base) playUrl = base.replace(/\/+$/, "") + (dataUrl.charAt(0) === "/" ? dataUrl : "/" + dataUrl);
        else playUrl = ALT_CDN + (dataUrl.charAt(0) === "/" ? dataUrl : "/" + dataUrl);
      }
    }
    if (!playUrl) playUrl = extractPlayStream(html);
    if (!playUrl) {
      return { id: durl, type: "url", title: mainTitle, description: "未找到播放地址", coverUrl: posterPic, posterPath: posterPic, backdropPath: posterPic };
    }
    return {
      id: durl,
      type: "detail",
      title: mainTitle,
      link: durl,
      posterPath: posterPic,
      coverUrl: posterPic,
      backdropPath: posterPic,
      videoUrl: playUrl,
      playerType: "app",
      customHeaders: { "User-Agent": UA, "Referer": HOST + "/" }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
