// 蘑菇视频 for REX (lai_mogu v1.0.0)
// 移植自 mira-cat 蜘蛛 py_mogu.js（只读蓝图），后端 https://moguds.cc。
// v1.0.1（2026-11-05）：与猫源同修——详情页站方已改版（#article-videos 消失，播放地址改走
// window.__ARCHIVE_PLAYER__.rawPath + CDN 基址）；修 URL 归一化（cdn_lines 里 cloudfront
// 写成 https:/// 三斜杠）；列表/详情取数加 Worker 兜底（直连 → mogu Worker /f/，未部署前行为不变）。
// 分类：16 大区作顶级分类，各区细分（cate3～cate288）走 enumeration 细分参数（对应猫源 filters.sub），
//   默认细分即猫源各区 default；分区与细分名/id 全部照抄猫源 ZONES，不编造。
// 列表：<a href="/video/\d+/"> 卡片，封面统一修成标准 https:// 并走 cloudfront 线，绝不出现 dfdf.tjacq.com
//   （站方 data-original 常写 https:/dfdf… 单斜杠且两线内容逐字节相同，猫源已验证 cloudfront 线可用）。
// 详情：#article-videos data-url 组直链，data-url 相对路径一律接 cloudfront 域名；
//   兜底正则/播放变量取到的地址同样经 normUrl 改写，dfdf 域名在任何输出里都不出现。
// 播放：单集正片直链 m3u8，附 UA 与 Referer；站方每片只给一条单码率播单（猫源实测 720p），
//   无多档切换机制，故不设 1080p/720p 假清晰度选单。字幕：猫源字幕芯是猫源专属，REX 版不接。

WidgetMetadata = {
  id: "lai_mogu",
  title: "蘑菇视频",
  description: "蘑菇视频（moguds.cc）：16 大区 + 细分筛选，详情单集正片直链播放",
  author: "lai",
  version: "1.0.2",
  requiredVersion: "0.0.1",
  site: "https://moguds.cc",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "🔥今日精选", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_featured" }, { name: "sub", title: "细分分类", type: "enumeration", value: "route_home_featured", enumOptions: [{ title: "今日推荐", value: "route_home_featured" }, { title: "顶级网黄", value: "cate3" }, { title: "福利姬", value: "cate4" }, { title: "传媒精选", value: "cate6" }, { title: "JVID", value: "cate7" }, { title: "锅锅酱", value: "cate8" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "💋热门主题", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_theme" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate9", enumOptions: [{ title: "巨乳大奶", value: "cate9" }, { title: "抖音风", value: "cate10" }, { title: "樱花小猫", value: "cate12" }, { title: "反差女友", value: "cate13" }, { title: "调教性奴", value: "cate15" }, { title: "ASMR", value: "cate16" }, { title: "高潮自慰", value: "cate18" }, { title: "露出野战", value: "cate20" }, { title: "SWAG", value: "cate21" }, { title: "绿帽淫妻", value: "cate23" }, { title: "群交滥交", value: "cate24" }, { title: "风骚少妇", value: "cate25" }, { title: "AI女神", value: "cate27" }, { title: "风骚母狗", value: "cate28" }, { title: "断袖男同", value: "cate29" }, { title: "原创短剧", value: "cate30" }, { title: "足交口爆", value: "cate31" }, { title: "炮桶小屋", value: "cate32" }, { title: "无套内射", value: "cate33" }, { title: "黑鬼长屌", value: "cate34" }, { title: "女同百合", value: "cate35" }, { title: "伪娘人妖", value: "cate36" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "💃网红达人", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_creator" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate37", enumOptions: [{ title: "吴梦梦", value: "cate37" }, { title: "网黄", value: "cate38" }, { title: "umate原创", value: "cate39" }, { title: "Naomii", value: "cate40" }, { title: "YuiPeach", value: "cate41" }, { title: "唐伯虎", value: "cate42" }, { title: "饼干姐姐", value: "cate43" }, { title: "台北娜娜", value: "cate44" }, { title: "MASKU", value: "cate45" }, { title: "Xreind", value: "cate46" }, { title: "小桃酱", value: "cate47" }, { title: "安安小晗", value: "cate48" }, { title: "柚子猫", value: "cate49" }, { title: "王梨奈", value: "cate50" }, { title: "辛尤里", value: "cate51" }, { title: "粉色情人", value: "cate52" }, { title: "阿朱", value: "cate53" }, { title: "奶咪", value: "cate54" }, { title: "有根棒棒", value: "cate55" }, { title: "不见星空", value: "cate56" }, { title: "Kitty", value: "cate57" }, { title: "妮可", value: "cate58" }, { title: "Cos女神", value: "cate59" }, { title: "玩偶姊姊", value: "cate60" }, { title: "司雨", value: "cate61" }, { title: "谭晓彤", value: "cate62" }, { title: "刘玥", value: "cate63" }, { title: "Vivian", value: "cate64" }, { title: "多乙", value: "cate65" }, { title: "朱可儿", value: "cate66" }, { title: "周大萌", value: "cate67" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "🎬传媒厂牌", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_media" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate69", enumOptions: [{ title: "麻豆传媒", value: "cate69" }, { title: "蜜桃传媒", value: "cate70" }, { title: "葫芦影业", value: "cate71" }, { title: "香蕉视频", value: "cate72" }, { title: "兔子先生", value: "cate73" }, { title: "OnlyFans", value: "cate74" }, { title: "91制片厂", value: "cate75" }, { title: "ED Mosaic", value: "cate76" }, { title: "IBiZa Media", value: "cate77" }, { title: "SA国际传媒", value: "cate78" }, { title: "乌托邦", value: "cate79" }, { title: "大象传媒", value: "cate80" }, { title: "天美传媒", value: "cate81" }, { title: "扣扣传媒", value: "cate82" }, { title: "性视界", value: "cate83" }, { title: "星空传媒", value: "cate84" }, { title: "映秀传媒", value: "cate85" }, { title: "杏吧原版", value: "cate86" }, { title: "果冻传媒", value: "cate87" }, { title: "爱神传媒", value: "cate88" }, { title: "爱豆传媒", value: "cate89" }, { title: "精东影业", value: "cate90" }, { title: "糖心Vlog", value: "cate91" }, { title: "萝莉社", value: "cate92" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "🎀福利姬社", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_cos" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate94", enumOptions: [{ title: "桥本香菜", value: "cate94" }, { title: "米菲兔", value: "cate95" }, { title: "捅主任", value: "cate96" }, { title: "npxvip", value: "cate97" }, { title: "Andm", value: "cate98" }, { title: "liburin", value: "cate99" }, { title: "谭晓彤", value: "cate100" }, { title: "小水水", value: "cate101" }, { title: "小鸟酱", value: "cate102" }, { title: "HAMAR", value: "cate103" }, { title: "铃木美子", value: "cate104" }, { title: "占星猫", value: "cate105" }, { title: "芋圆呀", value: "cate106" }, { title: "小丁妹妹", value: "cate107" }, { title: "米娜学姐", value: "cate108" }, { title: "米胡桃", value: "cate109" }, { title: "萌白酱", value: "cate110" }, { title: "麻酥酥", value: "cate111" }, { title: "白桃少女", value: "cate112" }, { title: "八月未央", value: "cate113" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "🍉黑料吃瓜", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_melon" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate115", enumOptions: [{ title: "网红大瓜", value: "cate115" }, { title: "校园猛料", value: "cate116" }, { title: "大奶孕妇", value: "cate117" }, { title: "独家泄密", value: "cate118" }, { title: "热门吃瓜", value: "cate119" }, { title: "潜规则", value: "cate120" }, { title: "反差泄露", value: "cate121" }, { title: "裸贷风波", value: "cate122" }, { title: "轮奸呀", value: "cate123" }, { title: "饥渴新娘", value: "cate124" }, { title: "强奸醉奸", value: "cate125" }, { title: "迷奸", value: "cate126" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "🌐P站精选", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_pornhub" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate128", enumOptions: [{ title: "AnnyWalker", value: "cate128" }, { title: "MilaAzul", value: "cate129" }, { title: "Comatozze", value: "cate130" }, { title: "Honey", value: "cate131" }, { title: "Luxury", value: "cate132" }, { title: "kittyxk", value: "cate133" }, { title: "JennyKitty", value: "cate134" }, { title: "LeoLulu", value: "cate135" }, { title: "PurpleB", value: "cate136" }, { title: "MilaLioness", value: "cate137" }, { title: "Pinklov", value: "cate138" }, { title: "PornForce", value: "cate139" }, { title: "Shinaryen", value: "cate140" }, { title: "EvaElfie", value: "cate141" }, { title: "Candy", value: "cate142" }, { title: "Kenzie", value: "cate143" }, { title: "CarlaCu", value: "cate144" }, { title: "webto", value: "cate145" }, { title: "SiaSib", value: "cate146" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "🔎探花寻芳", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_flower" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate148", enumOptions: [{ title: "沈先生", value: "cate148" }, { title: "赵总寻花", value: "cate149" }, { title: "小天探花", value: "cate150" }, { title: "换妻探花", value: "cate151" }, { title: "七天探花", value: "cate152" }, { title: "千人斩", value: "cate153" }, { title: "午夜尋花", value: "cate154" }, { title: "91大神", value: "cate155" }, { title: "按摩会所", value: "cate156" }, { title: "韩国嫖妓", value: "cate157" }, { title: "陈先生", value: "cate158" }, { title: "太子寻花", value: "cate159" }, { title: "翼屌寻花", value: "cate160" }, { title: "小宝寻花", value: "cate161" }, { title: "文轩探花", value: "cate162" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "🌪️逆天乱伦", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_taboo" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate164", enumOptions: [{ title: "兄妹情深", value: "cate164" }, { title: "最爱岳母", value: "cate165" }, { title: "淫荡儿媳", value: "cate166" }, { title: "淫乱父女", value: "cate167" }, { title: "照顾小侄女", value: "cate168" }, { title: "师生恋情", value: "cate169" }, { title: "母子情深", value: "cate170" }, { title: "姐弟爱恋", value: "cate171" }, { title: "调教嫂子", value: "cate172" }, { title: "照顾小姨子", value: "cate173" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "🔞精品三级", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_erotic" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate175", enumOptions: [{ title: "韩国三级", value: "cate175" }, { title: "香港三级", value: "cate176" }, { title: "台湾三级", value: "cate177" }, { title: "欧洲情色", value: "cate178" }, { title: "俄乌色情", value: "cate179" }, { title: "越南菲律宾", value: "cate180" }, { title: "印度情色", value: "cate181" }, { title: "日本三级", value: "cate182" }, { title: "美国色情", value: "cate183" }, { title: "东南亚情色", value: "cate184" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "📡火热直播", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_live" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate186", enumOptions: [{ title: "多人淫交", value: "cate186" }, { title: "车震直播", value: "cate187" }, { title: "日韩主播", value: "cate188" }, { title: "户外直播", value: "cate189" }, { title: "抖音网红", value: "cate190" }, { title: "主播勾引", value: "cate191" }, { title: "快手网红", value: "cate192" }, { title: "对着你", value: "cate193" }, { title: "AVOVE", value: "cate194" }, { title: "MISSWAEM", value: "cate195" }, { title: "妖骚蛇姬", value: "cate196" }, { title: "大啵啵", value: "cate197" }, { title: "虎牙辣妹", value: "cate198" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "👗制服诱惑", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_uniform" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate200", enumOptions: [{ title: "古装诱惑", value: "cate200" }, { title: "萝莉塔", value: "cate201" }, { title: "空姐诱惑", value: "cate202" }, { title: "丝袜诱惑", value: "cate203" }, { title: "职场OL", value: "cate204" }, { title: "清涩校服", value: "cate205" }, { title: "三点泳装", value: "cate206" }, { title: "JK短裙", value: "cate207" }, { title: "女仆装", value: "cate208" }, { title: "护士打针", value: "cate209" }, { title: "国风旗袍", value: "cate210" }, { title: "体操运动", value: "cate211" }, { title: "其他制服", value: "cate212" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "🌸日韩精选", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_asia" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate214", enumOptions: [{ title: "骑兵精选", value: "cate214" }, { title: "高清优质", value: "cate215" }, { title: "FC2高清", value: "cate216" }, { title: "VR视觉", value: "cate217" }, { title: "人妻巨乳", value: "cate218" }, { title: "少女制服", value: "cate219" }, { title: "药物迷奸", value: "cate220" }, { title: "强暴系列", value: "cate221" }, { title: "轮奸系列", value: "cate222" }, { title: "筱田佑", value: "cate223" }, { title: "森澤佳奈", value: "cate224" }, { title: "三上悠亜", value: "cate225" }, { title: "AkihoYoshizawa", value: "cate226" }, { title: "神宮寺奈緒", value: "cate227" }, { title: "藤森里穗", value: "cate228" }, { title: "松本一香", value: "cate229" }, { title: "乙爱丽丝", value: "cate230" }, { title: "沙月芽衣", value: "cate231" }, { title: "姬咲華", value: "cate232" }, { title: "AliceOtsu", value: "cate233" }, { title: "佐山愛", value: "cate234" }, { title: "水果解說", value: "cate235" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "🗽欧美洋马", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_west" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate237", enumOptions: [{ title: "推荐观看", value: "cate237" }, { title: "颜值少女", value: "cate238" }, { title: "网红洋马", value: "cate239" }, { title: "CandyLove", value: "cate240" }, { title: "丝袜制服", value: "cate241" }, { title: "欧美剧情", value: "cate242" }, { title: "AngelX", value: "cate243" }, { title: "商场性交", value: "cate244" }, { title: "情色按摩", value: "cate245" }, { title: "捷克搭讪", value: "cate246" }, { title: "肤若凝脂", value: "cate247" }, { title: "SweetieFox", value: "cate248" }, { title: "Morgpie", value: "cate249" }, { title: "DianRider", value: "cate250" }, { title: "BadCuteGirl", value: "cate251" }, { title: "Ailish", value: "cate252" }, { title: "SamanthaFlair", value: "cate253" }, { title: "滥交群交", value: "cate254" }, { title: "巨乳少女", value: "cate255" }, { title: "黑人大屌", value: "cate256" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "🎭综艺娱乐", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_variety" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate258", enumOptions: [{ title: "深夜保健室", value: "cate258" }, { title: "王竹子教学", value: "cate259" }, { title: "中指通一下", value: "cate260" }, { title: "Misa米砂", value: "cate261" }, { title: "小哥哥艾理", value: "cate262" }, { title: "Dr.She", value: "cate263" }, { title: "1G老湿", value: "cate264" }, { title: "两性知识", value: "cate265" }, { title: "麻豆综艺", value: "cate266" }, { title: "户外搭讪", value: "cate267" }, { title: "性愛大秀", value: "cate268" }, { title: "女优训练营", value: "cate269" }, { title: "情趣k歌房", value: "cate270" }, { title: "小鹏奇啪行", value: "cate271" }, { title: "性爱自修室", value: "cate272" }, { title: "女神体育祭", value: "cate273" }, { title: "屁孩日记", value: "cate274" }, { title: "薇傲的性趣", value: "cate275" }, { title: "一三蜜桃说", value: "cate276" }, { title: "Carrie雨千", value: "cate277" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] },
    { title: "📽️影视影院", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "大区", type: "constant", value: "zone_cinema" }, { name: "sub", title: "细分分类", type: "enumeration", value: "cate279", enumOptions: [{ title: "喜剧片", value: "cate279" }, { title: "古装片", value: "cate280" }, { title: "武侠片", value: "cate281" }, { title: "枪战片", value: "cate282" }, { title: "灾难片", value: "cate283" }, { title: "冒险片", value: "cate284" }, { title: "犯罪片", value: "cate285" }, { title: "科幻片", value: "cate286" }, { title: "动作片", value: "cate287" }, { title: "恐怖片", value: "cate288" }] }, { name: "page", title: "页码", type: "page", value: "1" } ] }
  ]
};

var ZONES = [
  { id: "zone_featured", name: "🔥今日精选", default: "route_home_featured", subs: [{ n: "今日推荐", v: "route_home_featured" }, { n: "顶级网黄", v: "cate3" }, { n: "福利姬", v: "cate4" }, { n: "传媒精选", v: "cate6" }, { n: "JVID", v: "cate7" }, { n: "锅锅酱", v: "cate8" }] },
  { id: "zone_theme", name: "💋热门主题", default: "cate9", subs: [{ n: "巨乳大奶", v: "cate9" }, { n: "抖音风", v: "cate10" }, { n: "樱花小猫", v: "cate12" }, { n: "反差女友", v: "cate13" }, { n: "调教性奴", v: "cate15" }, { n: "ASMR", v: "cate16" }, { n: "高潮自慰", v: "cate18" }, { n: "露出野战", v: "cate20" }, { n: "SWAG", v: "cate21" }, { n: "绿帽淫妻", v: "cate23" }, { n: "群交滥交", v: "cate24" }, { n: "风骚少妇", v: "cate25" }, { n: "AI女神", v: "cate27" }, { n: "风骚母狗", v: "cate28" }, { n: "断袖男同", v: "cate29" }, { n: "原创短剧", v: "cate30" }, { n: "足交口爆", v: "cate31" }, { n: "炮桶小屋", v: "cate32" }, { n: "无套内射", v: "cate33" }, { n: "黑鬼长屌", v: "cate34" }, { n: "女同百合", v: "cate35" }, { n: "伪娘人妖", v: "cate36" }] },
  { id: "zone_creator", name: "💃网红达人", default: "cate37", subs: [{ n: "吴梦梦", v: "cate37" }, { n: "网黄", v: "cate38" }, { n: "umate原创", v: "cate39" }, { n: "Naomii", v: "cate40" }, { n: "YuiPeach", v: "cate41" }, { n: "唐伯虎", v: "cate42" }, { n: "饼干姐姐", v: "cate43" }, { n: "台北娜娜", v: "cate44" }, { n: "MASKU", v: "cate45" }, { n: "Xreind", v: "cate46" }, { n: "小桃酱", v: "cate47" }, { n: "安安小晗", v: "cate48" }, { n: "柚子猫", v: "cate49" }, { n: "王梨奈", v: "cate50" }, { n: "辛尤里", v: "cate51" }, { n: "粉色情人", v: "cate52" }, { n: "阿朱", v: "cate53" }, { n: "奶咪", v: "cate54" }, { n: "有根棒棒", v: "cate55" }, { n: "不见星空", v: "cate56" }, { n: "Kitty", v: "cate57" }, { n: "妮可", v: "cate58" }, { n: "Cos女神", v: "cate59" }, { n: "玩偶姊姊", v: "cate60" }, { n: "司雨", v: "cate61" }, { n: "谭晓彤", v: "cate62" }, { n: "刘玥", v: "cate63" }, { n: "Vivian", v: "cate64" }, { n: "多乙", v: "cate65" }, { n: "朱可儿", v: "cate66" }, { n: "周大萌", v: "cate67" }] },
  { id: "zone_media", name: "🎬传媒厂牌", default: "cate69", subs: [{ n: "麻豆传媒", v: "cate69" }, { n: "蜜桃传媒", v: "cate70" }, { n: "葫芦影业", v: "cate71" }, { n: "香蕉视频", v: "cate72" }, { n: "兔子先生", v: "cate73" }, { n: "OnlyFans", v: "cate74" }, { n: "91制片厂", v: "cate75" }, { n: "ED Mosaic", v: "cate76" }, { n: "IBiZa Media", v: "cate77" }, { n: "SA国际传媒", v: "cate78" }, { n: "乌托邦", v: "cate79" }, { n: "大象传媒", v: "cate80" }, { n: "天美传媒", v: "cate81" }, { n: "扣扣传媒", v: "cate82" }, { n: "性视界", v: "cate83" }, { n: "星空传媒", v: "cate84" }, { n: "映秀传媒", v: "cate85" }, { n: "杏吧原版", v: "cate86" }, { n: "果冻传媒", v: "cate87" }, { n: "爱神传媒", v: "cate88" }, { n: "爱豆传媒", v: "cate89" }, { n: "精东影业", v: "cate90" }, { n: "糖心Vlog", v: "cate91" }, { n: "萝莉社", v: "cate92" }] },
  { id: "zone_cos", name: "🎀福利姬社", default: "cate94", subs: [{ n: "桥本香菜", v: "cate94" }, { n: "米菲兔", v: "cate95" }, { n: "捅主任", v: "cate96" }, { n: "npxvip", v: "cate97" }, { n: "Andm", v: "cate98" }, { n: "liburin", v: "cate99" }, { n: "谭晓彤", v: "cate100" }, { n: "小水水", v: "cate101" }, { n: "小鸟酱", v: "cate102" }, { n: "HAMAR", v: "cate103" }, { n: "铃木美子", v: "cate104" }, { n: "占星猫", v: "cate105" }, { n: "芋圆呀", v: "cate106" }, { n: "小丁妹妹", v: "cate107" }, { n: "米娜学姐", v: "cate108" }, { n: "米胡桃", v: "cate109" }, { n: "萌白酱", v: "cate110" }, { n: "麻酥酥", v: "cate111" }, { n: "白桃少女", v: "cate112" }, { n: "八月未央", v: "cate113" }] },
  { id: "zone_melon", name: "🍉黑料吃瓜", default: "cate115", subs: [{ n: "网红大瓜", v: "cate115" }, { n: "校园猛料", v: "cate116" }, { n: "大奶孕妇", v: "cate117" }, { n: "独家泄密", v: "cate118" }, { n: "热门吃瓜", v: "cate119" }, { n: "潜规则", v: "cate120" }, { n: "反差泄露", v: "cate121" }, { n: "裸贷风波", v: "cate122" }, { n: "轮奸呀", v: "cate123" }, { n: "饥渴新娘", v: "cate124" }, { n: "强奸醉奸", v: "cate125" }, { n: "迷奸", v: "cate126" }] },
  { id: "zone_pornhub", name: "🌐P站精选", default: "cate128", subs: [{ n: "AnnyWalker", v: "cate128" }, { n: "MilaAzul", v: "cate129" }, { n: "Comatozze", v: "cate130" }, { n: "Honey", v: "cate131" }, { n: "Luxury", v: "cate132" }, { n: "kittyxk", v: "cate133" }, { n: "JennyKitty", v: "cate134" }, { n: "LeoLulu", v: "cate135" }, { n: "PurpleB", v: "cate136" }, { n: "MilaLioness", v: "cate137" }, { n: "Pinklov", v: "cate138" }, { n: "PornForce", v: "cate139" }, { n: "Shinaryen", v: "cate140" }, { n: "EvaElfie", v: "cate141" }, { n: "Candy", v: "cate142" }, { n: "Kenzie", v: "cate143" }, { n: "CarlaCu", v: "cate144" }, { n: "webto", v: "cate145" }, { n: "SiaSib", v: "cate146" }] },
  { id: "zone_flower", name: "🔎探花寻芳", default: "cate148", subs: [{ n: "沈先生", v: "cate148" }, { n: "赵总寻花", v: "cate149" }, { n: "小天探花", v: "cate150" }, { n: "换妻探花", v: "cate151" }, { n: "七天探花", v: "cate152" }, { n: "千人斩", v: "cate153" }, { n: "午夜尋花", v: "cate154" }, { n: "91大神", v: "cate155" }, { n: "按摩会所", v: "cate156" }, { n: "韩国嫖妓", v: "cate157" }, { n: "陈先生", v: "cate158" }, { n: "太子寻花", v: "cate159" }, { n: "翼屌寻花", v: "cate160" }, { n: "小宝寻花", v: "cate161" }, { n: "文轩探花", v: "cate162" }] },
  { id: "zone_taboo", name: "🌪️逆天乱伦", default: "cate164", subs: [{ n: "兄妹情深", v: "cate164" }, { n: "最爱岳母", v: "cate165" }, { n: "淫荡儿媳", v: "cate166" }, { n: "淫乱父女", v: "cate167" }, { n: "照顾小侄女", v: "cate168" }, { n: "师生恋情", v: "cate169" }, { n: "母子情深", v: "cate170" }, { n: "姐弟爱恋", v: "cate171" }, { n: "调教嫂子", v: "cate172" }, { n: "照顾小姨子", v: "cate173" }] },
  { id: "zone_erotic", name: "🔞精品三级", default: "cate175", subs: [{ n: "韩国三级", v: "cate175" }, { n: "香港三级", v: "cate176" }, { n: "台湾三级", v: "cate177" }, { n: "欧洲情色", v: "cate178" }, { n: "俄乌色情", v: "cate179" }, { n: "越南菲律宾", v: "cate180" }, { n: "印度情色", v: "cate181" }, { n: "日本三级", v: "cate182" }, { n: "美国色情", v: "cate183" }, { n: "东南亚情色", v: "cate184" }] },
  { id: "zone_live", name: "📡火热直播", default: "cate186", subs: [{ n: "多人淫交", v: "cate186" }, { n: "车震直播", v: "cate187" }, { n: "日韩主播", v: "cate188" }, { n: "户外直播", v: "cate189" }, { n: "抖音网红", v: "cate190" }, { n: "主播勾引", v: "cate191" }, { n: "快手网红", v: "cate192" }, { n: "对着你", v: "cate193" }, { n: "AVOVE", v: "cate194" }, { n: "MISSWAEM", v: "cate195" }, { n: "妖骚蛇姬", v: "cate196" }, { n: "大啵啵", v: "cate197" }, { n: "虎牙辣妹", v: "cate198" }] },
  { id: "zone_uniform", name: "👗制服诱惑", default: "cate200", subs: [{ n: "古装诱惑", v: "cate200" }, { n: "萝莉塔", v: "cate201" }, { n: "空姐诱惑", v: "cate202" }, { n: "丝袜诱惑", v: "cate203" }, { n: "职场OL", v: "cate204" }, { n: "清涩校服", v: "cate205" }, { n: "三点泳装", v: "cate206" }, { n: "JK短裙", v: "cate207" }, { n: "女仆装", v: "cate208" }, { n: "护士打针", v: "cate209" }, { n: "国风旗袍", v: "cate210" }, { n: "体操运动", v: "cate211" }, { n: "其他制服", v: "cate212" }] },
  { id: "zone_asia", name: "🌸日韩精选", default: "cate214", subs: [{ n: "骑兵精选", v: "cate214" }, { n: "高清优质", v: "cate215" }, { n: "FC2高清", v: "cate216" }, { n: "VR视觉", v: "cate217" }, { n: "人妻巨乳", v: "cate218" }, { n: "少女制服", v: "cate219" }, { n: "药物迷奸", v: "cate220" }, { n: "强暴系列", v: "cate221" }, { n: "轮奸系列", v: "cate222" }, { n: "筱田佑", v: "cate223" }, { n: "森澤佳奈", v: "cate224" }, { n: "三上悠亜", v: "cate225" }, { n: "AkihoYoshizawa", v: "cate226" }, { n: "神宮寺奈緒", v: "cate227" }, { n: "藤森里穗", v: "cate228" }, { n: "松本一香", v: "cate229" }, { n: "乙爱丽丝", v: "cate230" }, { n: "沙月芽衣", v: "cate231" }, { n: "姬咲華", v: "cate232" }, { n: "AliceOtsu", v: "cate233" }, { n: "佐山愛", v: "cate234" }, { n: "水果解說", v: "cate235" }] },
  { id: "zone_west", name: "🗽欧美洋马", default: "cate237", subs: [{ n: "推荐观看", v: "cate237" }, { n: "颜值少女", v: "cate238" }, { n: "网红洋马", v: "cate239" }, { n: "CandyLove", v: "cate240" }, { n: "丝袜制服", v: "cate241" }, { n: "欧美剧情", v: "cate242" }, { n: "AngelX", v: "cate243" }, { n: "商场性交", v: "cate244" }, { n: "情色按摩", v: "cate245" }, { n: "捷克搭讪", v: "cate246" }, { n: "肤若凝脂", v: "cate247" }, { n: "SweetieFox", v: "cate248" }, { n: "Morgpie", v: "cate249" }, { n: "DianRider", v: "cate250" }, { n: "BadCuteGirl", v: "cate251" }, { n: "Ailish", v: "cate252" }, { n: "SamanthaFlair", v: "cate253" }, { n: "滥交群交", v: "cate254" }, { n: "巨乳少女", v: "cate255" }, { n: "黑人大屌", v: "cate256" }] },
  { id: "zone_variety", name: "🎭综艺娱乐", default: "cate258", subs: [{ n: "深夜保健室", v: "cate258" }, { n: "王竹子教学", v: "cate259" }, { n: "中指通一下", v: "cate260" }, { n: "Misa米砂", v: "cate261" }, { n: "小哥哥艾理", v: "cate262" }, { n: "Dr.She", v: "cate263" }, { n: "1G老湿", v: "cate264" }, { n: "两性知识", v: "cate265" }, { n: "麻豆综艺", v: "cate266" }, { n: "户外搭讪", v: "cate267" }, { n: "性愛大秀", v: "cate268" }, { n: "女优训练营", v: "cate269" }, { n: "情趣k歌房", v: "cate270" }, { n: "小鹏奇啪行", v: "cate271" }, { n: "性爱自修室", v: "cate272" }, { n: "女神体育祭", v: "cate273" }, { n: "屁孩日记", v: "cate274" }, { n: "薇傲的性趣", v: "cate275" }, { n: "一三蜜桃说", v: "cate276" }, { n: "Carrie雨千", v: "cate277" }] },
  { id: "zone_cinema", name: "📽️影视影院", default: "cate279", subs: [{ n: "喜剧片", v: "cate279" }, { n: "古装片", v: "cate280" }, { n: "武侠片", v: "cate281" }, { n: "枪战片", v: "cate282" }, { n: "灾难片", v: "cate283" }, { n: "冒险片", v: "cate284" }, { n: "犯罪片", v: "cate285" }, { n: "科幻片", v: "cate286" }, { n: "动作片", v: "cate287" }, { n: "恐怖片", v: "cate288" }] }
];
var HOST = "https://moguds.cc";
var ALT_CDN = "https://d1uy7itup9paqh.cloudfront.net";
// 取数 Worker（2026-11-05 待用户部署：https://mogu-fetch.li768435813.workers.dev，根回 mogu fetch ok；
// 未部署前 Worker 腿取数失败即回落，行为与现在一致）。直连优先，Worker 只作 CF 挑战/拦截时的兜底。
var FETCH_WORKER = "https://mogu-fetch.li768435813.workers.dev";
// 纯 JS b64url（REX 沙箱无 Buffer/btoa/TextEncoder，与 818/porncgw 修复版同一实现）
var B64T = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64url(s) {
  var bytes = [];
  var str = String(s || "");
  var i, c, c2, cp;
  for (i = 0; i < str.length; i++) {
    c = str.charCodeAt(i);
    if (c < 128) bytes.push(c);
    else if (c < 2048) { bytes.push(192 | (c >> 6), 128 | (c & 63)); }
    else if (c < 55296 || c >= 57344) { bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63)); }
    else {
      i++;
      c2 = str.charCodeAt(i);
      cp = 65536 + (((c & 1023) << 10) | (c2 & 1023));
      bytes.push(240 | (cp >> 18), 128 | ((cp >> 12) & 63), 128 | ((cp >> 6) & 63), 128 | (cp & 63));
    }
  }
  var out = "";
  for (i = 0; i < bytes.length; i += 3) {
    var b0 = bytes[i], b1 = i + 1 < bytes.length ? bytes[i + 1] : 0, b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    out += B64T.charAt(b0 >> 2) + B64T.charAt(((b0 & 3) << 4) | (b1 >> 4)) + (i + 1 < bytes.length ? B64T.charAt(((b1 & 15) << 2) | (b2 >> 6)) : "=") + (i + 2 < bytes.length ? B64T.charAt(b2 & 63) : "=");
  }
  return out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function viaWorker(url) {
  return FETCH_WORKER.replace(/\/+$/, "") + "/f/" + b64url(url);
}
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function cleanText(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/\s+/g, " ");
}

function absUrl(u, host) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return host + u;
  return u;
}

// 与猫源 normUrl 同口径：修单斜杠 scheme、dfdf 域名一律改写为 cloudfront
function normUrl(u) {
  var s = t(u);
  if (!s) return "";
  // 站方 cdn_lines 常写 https:/dfdf（单斜杠）或 https:///cloudfront（三斜杠），一律压成标准 https://
  s = s.replace(/^(https?:)\/*/, "$1//");
  s = s.replace(/^(https?:)\/([^/])/, "$1//$2");
  if (s.indexOf("dfdf.tjacq.com/") === 0) s = "https://" + s;
  s = s.replace("dfdf.tjacq.com", "d1uy7itup9paqh.cloudfront.net");
  return s;
}

function isChallengeHtml(html) {
  var s = String(html || "");
  if (s.length < 200) return false;
  return s.indexOf("Just a moment") >= 0 || s.indexOf("cf-browser-verification") >= 0
    || s.indexOf("Attention Required") >= 0 || s.indexOf("__CF$cv$params") >= 0
    || s.indexOf("challenge-platform") >= 0 || s.indexOf("cf-challenge") >= 0
    || s.indexOf("developers.cloudflare.com") >= 0;
}

async function fetchHtmlOnce(url) {
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

async function getHtml(path) {
  var url = t(path);
  if (url.indexOf("//") === 0) url = "https:" + url;
  else if (url.charAt(0) === "/") url = HOST + url;
  var direct = await fetchHtmlOnce(url);
  if (direct && !isChallengeHtml(direct)) return direct;
  // 直连空回或被 CF 挑战页拦截时走 Worker 兜底（Worker 未部署则仍为空，与现在一致）
  var via = await fetchHtmlOnce(viaWorker(url));
  if (via && !isChallengeHtml(via)) return via;
  return direct && !isChallengeHtml(direct) ? direct : "";
}

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
        if (cand.charAt(0) === "/") return ALT_CDN + cand;
        return cand;
      }
    }
  }
  return "";
}

function parseCards(html, host) {
  var items = [];
  var seen = {};
  var re = /<a[^>]+href=["'](\/video\/\d+\/?)["'][^>]*>([\s\S]*?)<\/a>/g;
  var m;
  while ((m = re.exec(String(html || "")))) {
    var vUrl = t(m[1]);
    var inner = m[2];
    if (seen[vUrl]) continue;
    var pic = extractPic(inner);
    var title = "";
    var tM = inner.match(/(?:title=["']([^"']+)["']|alt=["']([^"']+)["']|<h\d[^>]*>([\s\S]*?)<\/h\d>)/i);
    if (tM) title = cleanText(tM[1] || tM[2] || tM[3] || "");
    if (!title) {
      var lines = cleanText(inner).split(/\s+/);
      for (var li = 0; li < lines.length; li++) {
        if (lines[li].length > 3) { title = lines[li]; break; }
      }
    }
    var durM = inner.match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
    if (vUrl && (pic || title)) {
      seen[vUrl] = 1;
      items.push({
        id: vUrl,
        type: "url",
        title: title || "蘑菇精彩视频",
        posterPath: pic ? normUrl(pic.indexOf("http") === 0 ? pic : absUrl(pic, host)) : "",
        coverUrl: pic ? normUrl(pic.indexOf("http") === 0 ? pic : absUrl(pic, host)) : "",
        backdropPath: pic ? normUrl(pic.indexOf("http") === 0 ? pic : absUrl(pic, host)) : "",
        link: vUrl,
        description: durM ? durM[1] : "",
        mediaType: "movie"
      });
    }
  }
  return items;
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
  if (target === "route_home_featured") {
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

function cleanStreamUrl(raw) {
  if (!raw) return "";
  var s = String(raw).replace(/\\u002F/g, "/").replace(/\\\//g, "/").trim();
  var m = s.match(/https?:\/\/[^\s"'$<>]+\.m3u8[^\s"'$<>]*/i);
  if (m) return m[0];
  m = s.match(/https?:\/\/[^\s"'$<>]+\.mp4[^\s"'$<>]*/i);
  if (m) return m[0];
  return s;
}

function extractPlayerVarUrl(html, varName) {
  var re = new RegExp("var\\s+" + varName + "\\s*=\\s*(\\{[\\s\\S]*?\\});");
  var m = String(html || "").match(re);
  if (!m) return "";
  try {
    var obj = JSON.parse(m[1]);
    if (obj && obj.url) return cleanStreamUrl(String(obj.url));
  } catch (e) { /* ignore */ }
  var um = m[1].match(/["']url["']\s*:\s*["']([^"']*)["']/);
  if (um) return cleanStreamUrl(um[1]);
  return "";
}

function extractPlayStream(html) {
  var m = html.match(/id=["']article-videos["'][^>]*data-url=["']([^"']+)["']/i)
    || html.match(/data-url=["']([^"']+)["'][^>]*id=["']article-videos["']/i);
  if (m) {
    var cand = t(m[1]).replace(/\\u002F/g, "/").replace(/\\\//g, "/");
    if (cand.indexOf("//") === 0) cand = "https:" + cand;
    else if (cand.charAt(0) === "/") cand = ALT_CDN + cand;
    else if (cand.indexOf("http") !== 0) cand = ALT_CDN + "/" + cand;
    return normUrl(cand);
  }
  m = html.match(/(?:var\s+raw\s*=\s*|video_url\s*:\s*|url\s*:\s*)["'](https?:\/\/[^\s"'$<>]+\.m3u8[^\s"'$<>]*)["']/i);
  if (m) return normUrl(m[1].replace(/\\u002F/g, "/").replace(/\\\//g, "/"));
  m = html.match(/https?:\/\/[^\s"'$<>]+\.m3u8[^\s"'$<>]*/i);
  if (m) return normUrl(m[0].replace(/\\u002F/g, "/").replace(/\\\//g, "/"));
  m = html.match(/https?:\/\/[^\s"'$<>]+\.mp4[^\s"'$<>]*/i);
  if (m) return normUrl(m[0].replace(/\\u002F/g, "/").replace(/\\\//g, "/"));
  return "";
}

function parseCdnLines(html) {
  var bases = [];
  var m = String(html || "").match(/cdn_lines\s*=\s*'([^']+)'/);
  if (m) {
    try {
      var arr = JSON.parse(m[1].replace(/\\\//g, "/"));
      for (var i = 0; i < (arr || []).length; i++) {
        var b = normUrl(String((arr[i] && arr[i].cdnLine) || "").replace(/\/+$/, ""));
        if (b.indexOf("http") === 0 && bases.indexOf(b) < 0) bases.push(b);
      }
    } catch (e) { /* ignore */ }
  }
  if (bases.indexOf("https://dfdf.tjacq.com") < 0) bases.push("https://dfdf.tjacq.com");
  if (bases.indexOf(ALT_CDN) < 0) bases.push(ALT_CDN);
  return bases;
}

function pickPlayBase(bases) {
  var list = Array.isArray(bases) ? bases : [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].indexOf("cloudfront") >= 0) return list[i];
  }
  return list[0] || ALT_CDN;
}

// 2026-11-05 站方详情页改版：#article-videos 已消失，播放器改由
// window.__ARCHIVE_PLAYER__ = {"rawPath":"\/video\/<日期>\/<id>\/<hash>.m3u8", ...}
// 提供播单相对路径；rawPath 接 CDN 基址（优先 cdn_lines 的 cloudfront 线）即为播单。
function unescJsonStr(s) {
  return String(s || "").replace(/\\u002F/g, "/").replace(/\\\//g, "/").replace(/\\"/g, '"');
}

function extractArchivePlayer(html) {
  var out = { rawPath: "", cdnLine: "", posterImg: "", vttFile: "" };
  var m = String(html || "").match(/window\.__ARCHIVE_PLAYER__\s*=\s*\{/);
  if (!m) return out;
  var seg = String(html || "").slice(m.index, m.index + 4000);
  var rp = seg.match(/"rawPath"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (rp) out.rawPath = unescJsonStr(rp[1]);
  var cl = seg.match(/"cdnLine"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (cl) out.cdnLine = unescJsonStr(cl[1]);
  var pi = seg.match(/"posterImg"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (pi) out.posterImg = unescJsonStr(pi[1]);
  var vf = seg.match(/"vttFile"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (vf) out.vttFile = unescJsonStr(vf[1]);
  return out;
}

function archivePlayUrl(html) {
  var ap = extractArchivePlayer(html);
  if (!ap.rawPath) return "";
  var raw = ap.rawPath.replace(/^\s+|\s+$/g, "");
  if (!raw) return "";
  if (raw.indexOf("http") === 0) return normUrl(raw);
  if (raw.indexOf("//") === 0) return normUrl("https:" + raw);
  var bases = parseCdnLines(html);
  var base = pickPlayBase(bases);
  var hasCf = false;
  for (var i = 0; i < bases.length; i++) {
    if (bases[i].indexOf("cloudfront") >= 0) hasCf = true;
  }
  if (ap.cdnLine && !hasCf) base = normUrl(ap.cdnLine);
  if (!base) base = ALT_CDN;
  return normUrl(base.replace(/\/+$/, "") + (raw.charAt(0) === "/" ? raw : "/" + raw));
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
    var mainTitle = "高清视频";
    if (tM) mainTitle = t(tM[1]).replace(/\s*[-_]\s*蘑菇视频\s*$/i, "") || "高清视频";
    // 新版详情优先走 __ARCHIVE_PLAYER__；旧解析（article-videos / 播放变量 / 裸 m3u8）留作兜底
    var playUrl = archivePlayUrl(html);
    if (!playUrl) {
      playUrl = extractPlayStream(html);
      if (!playUrl) {
        var v = extractPlayerVarUrl(html, "player_aaaa") || extractPlayerVarUrl(html, "player_data");
        if (v) playUrl = normUrl(v);
      }
    }
    var posterPic = "";
    var ap0 = extractArchivePlayer(html);
    if (ap0.posterImg) posterPic = normUrl(ap0.posterImg);
    var dfdf = String(html).match(/dfdf\.tjacq\.com\/image\/[^\s"']+/g);
    if (dfdf && dfdf.length) posterPic = normUrl("https://" + dfdf[0]);
    if (!posterPic) {
      var ogM = html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
      if (ogM) posterPic = normUrl(t(ogM[1]));
    }
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
