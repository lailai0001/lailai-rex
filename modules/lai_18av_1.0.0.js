// 18AV for REX (lai_18av v1.0.0)
// 移植自 mira-cat 蜘蛛 py_18av.js（只读蓝图），主站 https://18av.mm-cg.com/。
// 站方：6 域名 failover（主域 18av.mm-cg.com，备域 mjv015/mjv011/mjv008/mjv006/mjv005.com），
//   须带完整 Chrome UA + Referer + Accept，年满 Cookie YES_Eighteen=IamOverEighteenYearsOld
//   （裸 UA 取到的详情页无播放数据；命中 18+ 声明页时取 gate URL 重解析 Cookie 名后重试）。
// 列表：/zh/{区}_list/all/{N}.html（24 条/页）；题材 /zh/{区}_category/{id}/{名}/{N}.html；
//   無碼片商 /zh/uncensored_makersr/{id}/{名}/{N}.html；搜索 /zh/fc_search/all/{词}/{N}.html。
//   站方用单引号写属性（<div class='post video_9s'>），解析正则须同时接受单双引号。
// 分类：7 个顶级（中文字幕/有碼AV/無碼AV/素人AV/無碼破解/H動畫/國產自拍）；
//   筛选卡片：中文字幕与有碼AV 共 384 个題材；無碼AV 12 个片商；素人AV 605 个題材；H動畫 3 个子区。
// 播放链（详情页现解，点播现取）：
//   详情页内联脚本含 mvarr['10_1']（1080p）/ mvarr['11_1']（720p），
//   每项 [iframeId, 加密串, ..., 前缀, 后缀]；加密串 -> decrypto（分隔符=base+97 的字符，
//   base 默认 3、xor 默认 13，页内 hcdeedg252/hadeedg252 可改）-> base64 ->
//   AES-128-CBC 解密（key=页内 argdeqweqweqwe，iv=页内 hdddedg252）-> 64 位 id；
//   play.php 地址 = 前缀 + id + 后缀（含 numresolution={1080|720}）。
//   取 play.php 页（带 UA + Referer=详情页 + 年满 Cookie）-> 解析
//   {src: '...',type: 'application/x-mpegURL', size: 720|1080}，按档位取 m3u8；
//   play.php 无源（id 过期/轮换）时重取详情页现解再试一次。
//   播单为 AES-128 VOD（1854 分片，.js 后缀）。多数片 720+1080 两档，个别仅 1080，绝不编造档位。
//   注意：详情页偶发 SERVER:zero（无 mvarr、无清晰度按钮，站方侧抖动），
//   详情跨域重试（主域 -> mjv015 -> mjv011）取 mvarr；全 zero 时详情只出标题/封面，不出播放线。
// 点播现取：详情只存档位名（懒解析 @@18AV:<durl>:<档位>），loadResource 现走完整解密链。
// 字幕：猫源字幕芯是猫源专属，REX 版不接（javhey 同款）。

WidgetMetadata = {
  id: "lai_18av",
  title: "18AV",
  description: "18AV：6 域名 failover，7 顶级 + 1005 筛选卡片，详情页 AES 解密取 play.php，点播现取 m3u8",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://18av.mm-cg.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "中文字幕", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "chinese" }, { name: "sub", title: "題材", type: "enumeration", value: "", enumOptions: [{"title": "企畫", "value": "1|企畫"}, {"title": "女同性戀", "value": "2|女同性戀"}, {"title": "獵豔、搭訕", "value": "3|獵豔、搭訕"}, {"title": "野外・露出", "value": "4|野外・露出"}, {"title": "偶像藝人", "value": "5|偶像藝人"}, {"title": "其他戀物癖", "value": "6|其他戀物癖"}, {"title": "近親相姦", "value": "7|近親相姦"}, {"title": "巨乳癖", "value": "8|巨乳癖"}, {"title": "情侶", "value": "9|情侶"}, {"title": "男同性恋", "value": "10|男同性恋"}, {"title": "花癡", "value": "11|花癡"}, {"title": "偷窥", "value": "12|偷窥"}, {"title": "戀腿癖", "value": "13|戀腿癖"}, {"title": "其他", "value": "14|其他"}, {"title": "癡漢", "value": "15|癡漢"}, {"title": "倒追", "value": "16|倒追"}, {"title": "奴隷", "value": "17|奴隷"}, {"title": "跳舞", "value": "18|跳舞"}, {"title": "雙性人", "value": "19|雙性人"}, {"title": "姐妹", "value": "20|姐妹"}, {"title": "通姦", "value": "21|通姦"}, {"title": "鬼畜", "value": "22|鬼畜"}, {"title": "學校作品", "value": "23|學校作品"}, {"title": "惡作劇", "value": "24|惡作劇"}, {"title": "妄想", "value": "25|妄想"}, {"title": "殘忍畫面", "value": "26|殘忍畫面"}, {"title": "爛醉如泥的", "value": "27|爛醉如泥的"}, {"title": "處女", "value": "28|處女"}, {"title": "美容院", "value": "29|美容院"}, {"title": "性感的", "value": "30|性感的"}, {"title": "女同接吻", "value": "31|女同接吻"}, {"title": "運動", "value": "32|運動"}, {"title": "瘙癢", "value": "33|瘙癢"}, {"title": "出軌", "value": "34|出軌"}, {"title": "正太控", "value": "35|正太控"}, {"title": "處男", "value": "36|處男"}, {"title": "蠻橫嬌羞", "value": "37|蠻橫嬌羞"}, {"title": "觸手", "value": "38|觸手"}, {"title": "嘔吐", "value": "39|嘔吐"}, {"title": "拷問", "value": "40|拷問"}, {"title": "10枚組", "value": "41|10枚組"}, {"title": "女優合集", "value": "42|女優合集"}, {"title": "温泉", "value": "43|温泉"}, {"title": "M男", "value": "44|M男"}, {"title": "原作コラボ", "value": "45|原作コラボ"}, {"title": "16時間以上作品", "value": "46|16時間以上作品"}, {"title": "デカチン・巨根", "value": "47|デカチン・巨根"}, {"title": "ファン感謝・訪問", "value": "48|ファン感謝・訪問"}, {"title": "動画", "value": "49|動画"}, {"title": "巨尻", "value": "50|巨尻"}, {"title": "ハーレム", "value": "51|ハーレム"}, {"title": "日焼け", "value": "52|日焼け"}, {"title": "早漏", "value": "53|早漏"}, {"title": "キス・接吻", "value": "54|キス・接吻"}, {"title": "汗だく", "value": "55|汗だく"}, {"title": "服務生", "value": "56|服務生"}, {"title": "高中女生", "value": "57|高中女生"}, {"title": "女主播", "value": "58|女主播"}, {"title": "女生", "value": "59|女生"}, {"title": "黑人演員", "value": "60|黑人演員"}, {"title": "痴女", "value": "61|痴女"}, {"title": "護士", "value": "62|護士"}, {"title": "家庭教師", "value": "63|家庭教師"}, {"title": "母親", "value": "64|母親"}, {"title": "女教師", "value": "65|女教師"}, {"title": "展場女孩", "value": "66|展場女孩"}, {"title": "女大學生", "value": "67|女大學生"}, {"title": "賽車女郎", "value": "68|賽車女郎"}, {"title": "妓女", "value": "69|妓女"}, {"title": "各種職業", "value": "70|各種職業"}, {"title": "女醫生", "value": "71|女醫生"}, {"title": "人妻", "value": "72|人妻"}, {"title": "白人", "value": "73|白人"}, {"title": "千金小姐", "value": "74|千金小姐"}, {"title": "寡婦", "value": "75|寡婦"}, {"title": "車掌小姐", "value": "76|車掌小姐"}, {"title": "格鬥家", "value": "77|格鬥家"}, {"title": "姐姐", "value": "78|姐姐"}, {"title": "新娘、嫩妻", "value": "79|新娘、嫩妻"}, {"title": "美少女", "value": "80|美少女"}, {"title": "秘書", "value": "81|秘書"}, {"title": "模特兒", "value": "82|模特兒"}, {"title": "女主人、女老板", "value": "83|女主人、女老板"}, {"title": "明星臉", "value": "84|明星臉"}, {"title": "女檢察官", "value": "85|女檢察官"}, {"title": "格鬥家", "value": "86|格鬥家"}, {"title": "義母", "value": "87|義母"}, {"title": "教練", "value": "88|教練"}, {"title": "伴侶", "value": "89|伴侶"}, {"title": "亞洲女演員", "value": "90|亞洲女演員"}, {"title": "公主", "value": "91|公主"}, {"title": "童年朋友", "value": "92|童年朋友"}, {"title": "黑幫成員", "value": "93|黑幫成員"}, {"title": "角色扮演", "value": "94|角色扮演"}, {"title": "眼鏡", "value": "95|眼鏡"}, {"title": "泳裝", "value": "96|泳裝"}, {"title": "校服", "value": "97|校服"}, {"title": "迷你裙", "value": "98|迷你裙"}, {"title": "女僕", "value": "99|女僕"}, {"title": "旗袍", "value": "100|旗袍"}, {"title": "學校泳裝", "value": "101|學校泳裝"}, {"title": "水手服", "value": "102|水手服"}, {"title": "內衣", "value": "103|內衣"}, {"title": "體育服", "value": "104|體育服"}, {"title": "和服・喪服", "value": "105|和服・喪服"}, {"title": "OL", "value": "106|OL"}, {"title": "身體意識", "value": "107|身體意識"}, {"title": "連褲襪", "value": "108|連褲襪"}, {"title": "空姐", "value": "109|空姐"}, {"title": "迷你裙警察", "value": "110|迷你裙警察"}, {"title": "裸體圍裙", "value": "111|裸體圍裙"}, {"title": "緊身衣", "value": "112|緊身衣"}, {"title": "制服", "value": "113|制服"}, {"title": "泡泡襪", "value": "114|泡泡襪"}, {"title": "女祭司", "value": "115|女祭司"}, {"title": "貓耳女", "value": "116|貓耳女"}, {"title": "兔女郎", "value": "117|兔女郎"}, {"title": "猥褻穿著", "value": "118|猥褻穿著"}, {"title": "偷看內褲", "value": "119|偷看內褲"}, {"title": "女裝人妖", "value": "120|女裝人妖"}, {"title": "女忍者", "value": "121|女忍者"}, {"title": "娃娃", "value": "122|娃娃"}, {"title": "及膝襪", "value": "123|及膝襪"}, {"title": "女戰士", "value": "124|女戰士"}, {"title": "巨乳", "value": "127|巨乳"}, {"title": "貧乳・微乳", "value": "128|貧乳・微乳"}, {"title": "蘿莉塔", "value": "129|蘿莉塔"}, {"title": "熟女", "value": "130|熟女"}, {"title": "孕婦", "value": "131|孕婦"}, {"title": "苗條", "value": "132|苗條"}, {"title": "胖女人", "value": "133|胖女人"}, {"title": "無毛", "value": "134|無毛"}, {"title": "變性者", "value": "135|變性者"}, {"title": "高", "value": "136|高"}, {"title": "屁股", "value": "137|屁股"}, {"title": "嬌小的", "value": "138|嬌小的"}, {"title": "乳房", "value": "139|乳房"}, {"title": "肌肉", "value": "140|肌肉"}, {"title": "超乳", "value": "141|超乳"}, {"title": "中出", "value": "142|中出"}, {"title": "顏射", "value": "143|顏射"}, {"title": "自慰", "value": "144|自慰"}, {"title": "顏射", "value": "145|顏射"}, {"title": "肛交", "value": "146|肛交"}, {"title": "吞精", "value": "147|吞精"}, {"title": "打手槍", "value": "148|打手槍"}, {"title": "放尿", "value": "149|放尿"}, {"title": "亂交", "value": "150|亂交"}, {"title": "口交", "value": "151|口交"}, {"title": "飲尿", "value": "152|飲尿"}, {"title": "排便", "value": "153|排便"}, {"title": "乳交", "value": "154|乳交"}, {"title": "潮吹", "value": "155|潮吹"}, {"title": "淫語", "value": "156|淫語"}, {"title": "69", "value": "157|69"}, {"title": "深喉", "value": "158|深喉"}, {"title": "拳交", "value": "159|拳交"}, {"title": "舔陰", "value": "160|舔陰"}, {"title": "騎乗位", "value": "161|騎乗位"}, {"title": "按摩", "value": "162|按摩"}, {"title": "手指插入", "value": "163|手指插入"}, {"title": "母乳", "value": "164|母乳"}, {"title": "足交", "value": "165|足交"}, {"title": "食糞", "value": "166|食糞"}, {"title": "顏面騎乘", "value": "167|顏面騎乘"}, {"title": "肛内中出", "value": "168|肛内中出"}, {"title": "多P", "value": "169|多P"}, {"title": "按摩棒", "value": "170|按摩棒"}, {"title": "緊縛", "value": "171|緊縛"}, {"title": "跳蛋", "value": "172|跳蛋"}, {"title": "玩具", "value": "173|玩具"}, {"title": "糞便", "value": "174|糞便"}, {"title": "SM", "value": "175|SM"}, {"title": "車震", "value": "176|車震"}, {"title": "藥物", "value": "177|藥物"}, {"title": "強姦", "value": "178|強姦"}, {"title": "緊縛", "value": "179|緊縛"}, {"title": "監禁", "value": "180|監禁"}, {"title": "灌腸", "value": "181|灌腸"}, {"title": "鴨嘴", "value": "182|鴨嘴"}, {"title": "插入異物", "value": "183|插入異物"}, {"title": "輪姦", "value": "184|輪姦"}, {"title": "拘束", "value": "185|拘束"}, {"title": "凌辱", "value": "186|凌辱"}, {"title": "羞恥", "value": "187|羞恥"}, {"title": "乳液", "value": "188|乳液"}, {"title": "催眠", "value": "189|催眠"}, {"title": "子宮頸", "value": "190|子宮頸"}, {"title": "女優按摩棒", "value": "191|女優按摩棒"}, {"title": "立即口交", "value": "192|立即口交"}, {"title": "合集", "value": "193|合集"}, {"title": "單體作品", "value": "194|單體作品"}, {"title": "DMM獨家", "value": "195|DMM獨家"}, {"title": "獨立製作", "value": "196|獨立製作"}, {"title": "局部特寫", "value": "197|局部特寫"}, {"title": "素人", "value": "198|素人"}, {"title": "第一人稱攝影", "value": "199|第一人稱攝影"}, {"title": "國外進口", "value": "200|國外進口"}, {"title": "纪录片", "value": "201|纪录片"}, {"title": "投稿", "value": "202|投稿"}, {"title": "數位馬賽克", "value": "203|數位馬賽克"}, {"title": "首次亮相", "value": "204|首次亮相"}, {"title": "經典", "value": "205|經典"}, {"title": "薄馬賽克", "value": "206|薄馬賽克"}, {"title": "4小時以上作品", "value": "207|4小時以上作品"}, {"title": "介紹影片", "value": "208|介紹影片"}, {"title": "主觀視角", "value": "209|主觀視角"}, {"title": "高畫質", "value": "210|高畫質"}, {"title": "戀愛", "value": "211|戀愛"}, {"title": "戲劇", "value": "212|戲劇"}, {"title": "複刻版", "value": "213|複刻版"}, {"title": "限時降價", "value": "214|限時降價"}, {"title": "故事集", "value": "215|故事集"}, {"title": "特效", "value": "216|特效"}, {"title": "3D", "value": "217|3D"}, {"title": "R-18", "value": "219|R-18"}, {"title": "R-15", "value": "220|R-15"}, {"title": "DMM專屬", "value": "221|DMM專屬"}, {"title": "教學", "value": "222|教學"}, {"title": "給女性觀眾", "value": "223|給女性觀眾"}, {"title": "恐怖", "value": "224|恐怖"}, {"title": "合作作品", "value": "225|合作作品"}, {"title": "パラダイスTV", "value": "226|パラダイスTV"}, {"title": "DVDトースター", "value": "227|DVDトースター"}, {"title": "魔法少女", "value": "228|魔法少女"}, {"title": "假陽具", "value": "229|假陽具"}, {"title": "順豐", "value": "230|順豐"}, {"title": "圖片視頻（男）", "value": "231|圖片視頻（男）"}, {"title": "AV OPEN 2014 中量級", "value": "232|AV OPEN 2014 中量級"}, {"title": "AV OPEN 2014 超重量級", "value": "233|AV OPEN 2014 超重量級"}, {"title": "遊戲實況", "value": "234|遊戲實況"}, {"title": "AV OPEN 2014 ヘビー級", "value": "235|AV OPEN 2014 ヘビー級"}, {"title": "變身女主角", "value": "236|變身女主角"}, {"title": "AV OPEN 2015 企画部門", "value": "238|AV OPEN 2015 企画部門"}, {"title": "AV OPEN 2015 女優部門", "value": "239|AV OPEN 2015 女優部門"}, {"title": "AV OPEN 2015 素人部門", "value": "240|AV OPEN 2015 素人部門"}, {"title": "AV OPEN 2015 乙女部門", "value": "241|AV OPEN 2015 乙女部門"}, {"title": "AV OPEN 2015 熟女部門", "value": "242|AV OPEN 2015 熟女部門"}, {"title": "推薦用於智能手機的垂直視頻", "value": "244|推薦用於智能手機的垂直視頻"}, {"title": "V影院", "value": "245|V影院"}, {"title": "動畫", "value": "246|動畫"}, {"title": "行動", "value": "247|行動"}, {"title": "黑暗系統", "value": "248|黑暗系統"}, {"title": "迷你係列", "value": "249|迷你係列"}, {"title": "嬌小的", "value": "250|嬌小的"}, {"title": "浸漬", "value": "251|浸漬"}, {"title": "AV OPEN 2016 女優部門", "value": "252|AV OPEN 2016 女優部門"}, {"title": "AV OPEN 2016 素人部門", "value": "253|AV OPEN 2016 素人部門"}, {"title": "AV OPEN 2016 バラエティ部門", "value": "254|AV OPEN 2016 バラエティ部門"}, {"title": "AV OPEN 2016 ハード部門", "value": "256|AV OPEN 2016 ハード部門"}, {"title": "AV OPEN 2016 乙女部門", "value": "258|AV OPEN 2016 乙女部門"}, {"title": "AV OPEN 2016 企画部門", "value": "259|AV OPEN 2016 企画部門"}, {"title": "AV OPEN 2016 人妻・熟女部門", "value": "260|AV OPEN 2016 人妻・熟女部門"}, {"title": "婊子", "value": "261|婊子"}, {"title": "僅限虛擬現實", "value": "262|僅限虛擬現實"}, {"title": "AV 棒球福利", "value": "263|AV 棒球福利"}, {"title": "時間停止", "value": "264|時間停止"}, {"title": "漫畫雜誌", "value": "265|漫畫雜誌"}, {"title": "搞笑喜劇", "value": "266|搞笑喜劇"}, {"title": "男子的愛", "value": "267|男子的愛"}, {"title": "幻想", "value": "268|幻想"}, {"title": "AV OPEN 2017 女優部門", "value": "269|AV OPEN 2017 女優部門"}, {"title": "AV OPEN 2017紀錄片部", "value": "270|AV OPEN 2017紀錄片部"}, {"title": "AV OPEN 2017 フェチ部門", "value": "271|AV OPEN 2017 フェチ部門"}, {"title": "AV OPEN 2017 乙女部門", "value": "272|AV OPEN 2017 乙女部門"}, {"title": "AV OPEN 2017 人妻・熟女部門", "value": "273|AV OPEN 2017 人妻・熟女部門"}, {"title": "AV OPEN 2017 マニア部門", "value": "274|AV OPEN 2017 マニア部門"}, {"title": "AV OPEN 2017 企画部門", "value": "275|AV OPEN 2017 企画部門"}, {"title": "AV OPEN 2017 ハード部門", "value": "276|AV OPEN 2017 ハード部門"}, {"title": "AV OPEN 2017 素人部門", "value": "277|AV OPEN 2017 素人部門"}, {"title": "AV OPEN 2017 ドラマ部門", "value": "278|AV OPEN 2017 ドラマ部門"}, {"title": "經歷的告白", "value": "279|經歷的告白"}, {"title": "集產品", "value": "281|集產品"}, {"title": "反向強姦", "value": "282|反向強姦"}, {"title": "反向強姦", "value": "283|反向強姦"}, {"title": "名人朋友【特典C】合格作品", "value": "284|名人朋友【特典C】合格作品"}, {"title": "名人朋友【特典A】合格作品", "value": "285|名人朋友【特典A】合格作品"}, {"title": "愛情喜劇", "value": "286|愛情喜劇"}, {"title": "僅限 FANZA 發行", "value": "287|僅限 FANZA 發行"}, {"title": "有資格參加名人朋友活動的作品", "value": "288|有資格參加名人朋友活動的作品"}, {"title": "愛欲", "value": "289|愛欲"}, {"title": "高品質虛擬現實", "value": "290|高品質虛擬現實"}, {"title": "同性戀", "value": "291|同性戀"}, {"title": "AV OPEN 2018 女優部門", "value": "292|AV OPEN 2018 女優部門"}, {"title": "AV OPEN 2018 企画部門", "value": "293|AV OPEN 2018 企画部門"}, {"title": "AV OPEN 2018 素人部門", "value": "294|AV OPEN 2018 素人部門"}, {"title": "AV OPEN 2018 人妻・熟女部門", "value": "296|AV OPEN 2018 人妻・熟女部門"}, {"title": "AV OPEN 2018 ハード部門", "value": "297|AV OPEN 2018 ハード部門"}, {"title": "AV OPEN 2018 乙女部門", "value": "298|AV OPEN 2018 乙女部門"}, {"title": "連褲襪", "value": "300|連褲襪"}, {"title": "乳液油", "value": "302|乳液油"}, {"title": "年輕的妻子", "value": "303|年輕的妻子"}, {"title": "保健皂", "value": "305|保健皂"}, {"title": "極致高潮", "value": "306|極致高潮"}, {"title": "虐待", "value": "307|虐待"}, {"title": "M女", "value": "308|M女"}, {"title": "職業裝", "value": "309|職業裝"}, {"title": "背部", "value": "310|背部"}, {"title": "不戴胸罩", "value": "311|不戴胸罩"}, {"title": "女上司", "value": "312|女上司"}, {"title": "洗澡", "value": "313|洗澡"}, {"title": "乳頭滑落", "value": "314|乳頭滑落"}, {"title": "旅行", "value": "315|旅行"}, {"title": "奧納薩波", "value": "316|奧納薩波"}, {"title": "蠟燭", "value": "317|蠟燭"}, {"title": "男人噴", "value": "318|男人噴"}, {"title": "娘・養女", "value": "319|娘・養女"}, {"title": "面具，面具", "value": "320|面具，面具"}, {"title": "軟體", "value": "321|軟體"}, {"title": "面試", "value": "322|面試"}, {"title": "宅男", "value": "323|宅男"}, {"title": "接待員", "value": "324|接待員"}, {"title": "沒有內褲", "value": "325|沒有內褲"}, {"title": "酒會", "value": "326|酒會"}, {"title": "部下・同僚", "value": "327|部下・同僚"}, {"title": "名人", "value": "328|名人"}, {"title": "約會", "value": "331|約會"}, {"title": "花嫁", "value": "332|花嫁"}, {"title": "祖父", "value": "334|祖父"}, {"title": "姨", "value": "335|姨"}, {"title": "鼻鉤", "value": "336|鼻鉤"}, {"title": "運動員", "value": "337|運動員"}, {"title": "打屁股", "value": "339|打屁股"}, {"title": "酒店", "value": "340|酒店"}, {"title": "女王", "value": "341|女王"}, {"title": "瑜伽", "value": "342|瑜伽"}, {"title": "新人陸續登場", "value": "343|新人陸續登場"}, {"title": "白目・失神", "value": "344|白目・失神"}, {"title": "媽媽朋友", "value": "345|媽媽朋友"}, {"title": "啦啦隊長", "value": "346|啦啦隊長"}, {"title": "奶奶", "value": "347|奶奶"}, {"title": "社團活動經理", "value": "348|社團活動經理"}, {"title": "妄想族", "value": "349|妄想族"}, {"title": "艾曼紐", "value": "350|艾曼紐"}, {"title": "艾曼紐", "value": "351|艾曼紐"}, {"title": "放置", "value": "352|放置"}, {"title": "心理驚悚片", "value": "353|心理驚悚片"}, {"title": "切卡", "value": "354|切卡"}, {"title": "福袋", "value": "355|福袋"}, {"title": "最好的，綜合性的", "value": "356|最好的，綜合性的"}, {"title": "3P、4P", "value": "357|3P、4P"}, {"title": "女優", "value": "358|女優"}, {"title": "藝人", "value": "359|藝人"}, {"title": "強姦", "value": "360|強姦"}, {"title": "湯", "value": "361|湯"}, {"title": "凌辱", "value": "362|凌辱"}, {"title": "偶像", "value": "363|偶像"}, {"title": "看護師", "value": "364|看護師"}, {"title": "奴隸", "value": "365|奴隸"}, {"title": "風俗", "value": "366|風俗"}, {"title": "處女之物", "value": "367|處女之物"}, {"title": "小乳房", "value": "368|小乳房"}, {"title": "大公雞", "value": "369|大公雞"}, {"title": "妹", "value": "370|妹"}, {"title": "戀物癖", "value": "371|戀物癖"}, {"title": "示例視頻", "value": "372|示例視頻"}, {"title": "秋季大甩賣", "value": "373|秋季大甩賣"}, {"title": "藍光", "value": "374|藍光"}, {"title": "出口", "value": "375|出口"}, {"title": "動漫人物", "value": "376|動漫人物"}, {"title": "DOD 秋季促銷第 2 部分", "value": "377|DOD 秋季促銷第 2 部分"}, {"title": "2010年代前半（DOD）", "value": "378|2010年代前半（DOD）"}, {"title": "光盤點播銷售", "value": "379|光盤點播銷售"}, {"title": "AV女優", "value": "380|AV女優"}, {"title": "設置有好處的產品", "value": "381|設置有好處的產品"}, {"title": "Triple HAPPY 活動", "value": "382|Triple HAPPY 活動"}, {"title": "Rena 桃園 JOKER 禮品活動", "value": "383|Rena 桃園 JOKER 禮品活動"}, {"title": "時代劇", "value": "384|時代劇"}, {"title": "全球媒體 40% 折扣銷售", "value": "385|全球媒體 40% 折扣銷售"}, {"title": "Mousozoku 2021上半年進入TOP 100", "value": "386|Mousozoku 2021上半年進入TOP 100"}, {"title": "レズビアン", "value": "387|レズビアン"}, {"title": "BL（ボーイズラブ）", "value": "388|BL（ボーイズラブ）"}, {"title": "8KVR", "value": "389|8KVR"}, {"title": "妄想族30％OFF第1弾", "value": "390|妄想族30％OFF第1弾"}, {"title": "ブランドストア30％OFF☆", "value": "391|ブランドストア30％OFF☆"}, {"title": "ながえスタイル30％OFF", "value": "392|ながえスタイル30％OFF"}, {"title": "MERCURY（マーキュリー）他30％OFF", "value": "393|MERCURY（マーキュリー）他30％OFF"}, {"title": "ブランドストア30％OFF！", "value": "394|ブランドストア30％OFF！"}, {"title": "妄想族30％OFF", "value": "395|妄想族30％OFF"}, {"title": "BALTAN＜バルタン＞他30％OFF", "value": "396|BALTAN＜バルタン＞他30％OFF"}, {"title": "ながえスタイル他30％OFF", "value": "397|ながえスタイル他30％OFF"}, {"title": "台湾モデル", "value": "398|台湾モデル"}, {"title": "AI生成作品", "value": "399|AI生成作品"}, {"title": "アナルセックス（男の娘）", "value": "400|アナルセックス（男の娘）"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "有碼AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "censored" }, { name: "sub", title: "題材", type: "enumeration", value: "", enumOptions: [{"title": "企畫", "value": "1|企畫"}, {"title": "女同性戀", "value": "2|女同性戀"}, {"title": "獵豔、搭訕", "value": "3|獵豔、搭訕"}, {"title": "野外・露出", "value": "4|野外・露出"}, {"title": "偶像藝人", "value": "5|偶像藝人"}, {"title": "其他戀物癖", "value": "6|其他戀物癖"}, {"title": "近親相姦", "value": "7|近親相姦"}, {"title": "巨乳癖", "value": "8|巨乳癖"}, {"title": "情侶", "value": "9|情侶"}, {"title": "男同性恋", "value": "10|男同性恋"}, {"title": "花癡", "value": "11|花癡"}, {"title": "偷窥", "value": "12|偷窥"}, {"title": "戀腿癖", "value": "13|戀腿癖"}, {"title": "其他", "value": "14|其他"}, {"title": "癡漢", "value": "15|癡漢"}, {"title": "倒追", "value": "16|倒追"}, {"title": "奴隷", "value": "17|奴隷"}, {"title": "跳舞", "value": "18|跳舞"}, {"title": "雙性人", "value": "19|雙性人"}, {"title": "姐妹", "value": "20|姐妹"}, {"title": "通姦", "value": "21|通姦"}, {"title": "鬼畜", "value": "22|鬼畜"}, {"title": "學校作品", "value": "23|學校作品"}, {"title": "惡作劇", "value": "24|惡作劇"}, {"title": "妄想", "value": "25|妄想"}, {"title": "殘忍畫面", "value": "26|殘忍畫面"}, {"title": "爛醉如泥的", "value": "27|爛醉如泥的"}, {"title": "處女", "value": "28|處女"}, {"title": "美容院", "value": "29|美容院"}, {"title": "性感的", "value": "30|性感的"}, {"title": "女同接吻", "value": "31|女同接吻"}, {"title": "運動", "value": "32|運動"}, {"title": "瘙癢", "value": "33|瘙癢"}, {"title": "出軌", "value": "34|出軌"}, {"title": "正太控", "value": "35|正太控"}, {"title": "處男", "value": "36|處男"}, {"title": "蠻橫嬌羞", "value": "37|蠻橫嬌羞"}, {"title": "觸手", "value": "38|觸手"}, {"title": "嘔吐", "value": "39|嘔吐"}, {"title": "拷問", "value": "40|拷問"}, {"title": "10枚組", "value": "41|10枚組"}, {"title": "女優合集", "value": "42|女優合集"}, {"title": "温泉", "value": "43|温泉"}, {"title": "M男", "value": "44|M男"}, {"title": "原作コラボ", "value": "45|原作コラボ"}, {"title": "16時間以上作品", "value": "46|16時間以上作品"}, {"title": "デカチン・巨根", "value": "47|デカチン・巨根"}, {"title": "ファン感謝・訪問", "value": "48|ファン感謝・訪問"}, {"title": "動画", "value": "49|動画"}, {"title": "巨尻", "value": "50|巨尻"}, {"title": "ハーレム", "value": "51|ハーレム"}, {"title": "日焼け", "value": "52|日焼け"}, {"title": "早漏", "value": "53|早漏"}, {"title": "キス・接吻", "value": "54|キス・接吻"}, {"title": "汗だく", "value": "55|汗だく"}, {"title": "服務生", "value": "56|服務生"}, {"title": "高中女生", "value": "57|高中女生"}, {"title": "女主播", "value": "58|女主播"}, {"title": "女生", "value": "59|女生"}, {"title": "黑人演員", "value": "60|黑人演員"}, {"title": "痴女", "value": "61|痴女"}, {"title": "護士", "value": "62|護士"}, {"title": "家庭教師", "value": "63|家庭教師"}, {"title": "母親", "value": "64|母親"}, {"title": "女教師", "value": "65|女教師"}, {"title": "展場女孩", "value": "66|展場女孩"}, {"title": "女大學生", "value": "67|女大學生"}, {"title": "賽車女郎", "value": "68|賽車女郎"}, {"title": "妓女", "value": "69|妓女"}, {"title": "各種職業", "value": "70|各種職業"}, {"title": "女醫生", "value": "71|女醫生"}, {"title": "人妻", "value": "72|人妻"}, {"title": "白人", "value": "73|白人"}, {"title": "千金小姐", "value": "74|千金小姐"}, {"title": "寡婦", "value": "75|寡婦"}, {"title": "車掌小姐", "value": "76|車掌小姐"}, {"title": "格鬥家", "value": "77|格鬥家"}, {"title": "姐姐", "value": "78|姐姐"}, {"title": "新娘、嫩妻", "value": "79|新娘、嫩妻"}, {"title": "美少女", "value": "80|美少女"}, {"title": "秘書", "value": "81|秘書"}, {"title": "模特兒", "value": "82|模特兒"}, {"title": "女主人、女老板", "value": "83|女主人、女老板"}, {"title": "明星臉", "value": "84|明星臉"}, {"title": "女檢察官", "value": "85|女檢察官"}, {"title": "格鬥家", "value": "86|格鬥家"}, {"title": "義母", "value": "87|義母"}, {"title": "教練", "value": "88|教練"}, {"title": "伴侶", "value": "89|伴侶"}, {"title": "亞洲女演員", "value": "90|亞洲女演員"}, {"title": "公主", "value": "91|公主"}, {"title": "童年朋友", "value": "92|童年朋友"}, {"title": "黑幫成員", "value": "93|黑幫成員"}, {"title": "角色扮演", "value": "94|角色扮演"}, {"title": "眼鏡", "value": "95|眼鏡"}, {"title": "泳裝", "value": "96|泳裝"}, {"title": "校服", "value": "97|校服"}, {"title": "迷你裙", "value": "98|迷你裙"}, {"title": "女僕", "value": "99|女僕"}, {"title": "旗袍", "value": "100|旗袍"}, {"title": "學校泳裝", "value": "101|學校泳裝"}, {"title": "水手服", "value": "102|水手服"}, {"title": "內衣", "value": "103|內衣"}, {"title": "體育服", "value": "104|體育服"}, {"title": "和服・喪服", "value": "105|和服・喪服"}, {"title": "OL", "value": "106|OL"}, {"title": "身體意識", "value": "107|身體意識"}, {"title": "連褲襪", "value": "108|連褲襪"}, {"title": "空姐", "value": "109|空姐"}, {"title": "迷你裙警察", "value": "110|迷你裙警察"}, {"title": "裸體圍裙", "value": "111|裸體圍裙"}, {"title": "緊身衣", "value": "112|緊身衣"}, {"title": "制服", "value": "113|制服"}, {"title": "泡泡襪", "value": "114|泡泡襪"}, {"title": "女祭司", "value": "115|女祭司"}, {"title": "貓耳女", "value": "116|貓耳女"}, {"title": "兔女郎", "value": "117|兔女郎"}, {"title": "猥褻穿著", "value": "118|猥褻穿著"}, {"title": "偷看內褲", "value": "119|偷看內褲"}, {"title": "女裝人妖", "value": "120|女裝人妖"}, {"title": "女忍者", "value": "121|女忍者"}, {"title": "娃娃", "value": "122|娃娃"}, {"title": "及膝襪", "value": "123|及膝襪"}, {"title": "女戰士", "value": "124|女戰士"}, {"title": "巨乳", "value": "127|巨乳"}, {"title": "貧乳・微乳", "value": "128|貧乳・微乳"}, {"title": "蘿莉塔", "value": "129|蘿莉塔"}, {"title": "熟女", "value": "130|熟女"}, {"title": "孕婦", "value": "131|孕婦"}, {"title": "苗條", "value": "132|苗條"}, {"title": "胖女人", "value": "133|胖女人"}, {"title": "無毛", "value": "134|無毛"}, {"title": "變性者", "value": "135|變性者"}, {"title": "高", "value": "136|高"}, {"title": "屁股", "value": "137|屁股"}, {"title": "嬌小的", "value": "138|嬌小的"}, {"title": "乳房", "value": "139|乳房"}, {"title": "肌肉", "value": "140|肌肉"}, {"title": "超乳", "value": "141|超乳"}, {"title": "中出", "value": "142|中出"}, {"title": "顏射", "value": "143|顏射"}, {"title": "自慰", "value": "144|自慰"}, {"title": "顏射", "value": "145|顏射"}, {"title": "肛交", "value": "146|肛交"}, {"title": "吞精", "value": "147|吞精"}, {"title": "打手槍", "value": "148|打手槍"}, {"title": "放尿", "value": "149|放尿"}, {"title": "亂交", "value": "150|亂交"}, {"title": "口交", "value": "151|口交"}, {"title": "飲尿", "value": "152|飲尿"}, {"title": "排便", "value": "153|排便"}, {"title": "乳交", "value": "154|乳交"}, {"title": "潮吹", "value": "155|潮吹"}, {"title": "淫語", "value": "156|淫語"}, {"title": "69", "value": "157|69"}, {"title": "深喉", "value": "158|深喉"}, {"title": "拳交", "value": "159|拳交"}, {"title": "舔陰", "value": "160|舔陰"}, {"title": "騎乗位", "value": "161|騎乗位"}, {"title": "按摩", "value": "162|按摩"}, {"title": "手指插入", "value": "163|手指插入"}, {"title": "母乳", "value": "164|母乳"}, {"title": "足交", "value": "165|足交"}, {"title": "食糞", "value": "166|食糞"}, {"title": "顏面騎乘", "value": "167|顏面騎乘"}, {"title": "肛内中出", "value": "168|肛内中出"}, {"title": "多P", "value": "169|多P"}, {"title": "按摩棒", "value": "170|按摩棒"}, {"title": "緊縛", "value": "171|緊縛"}, {"title": "跳蛋", "value": "172|跳蛋"}, {"title": "玩具", "value": "173|玩具"}, {"title": "糞便", "value": "174|糞便"}, {"title": "SM", "value": "175|SM"}, {"title": "車震", "value": "176|車震"}, {"title": "藥物", "value": "177|藥物"}, {"title": "強姦", "value": "178|強姦"}, {"title": "緊縛", "value": "179|緊縛"}, {"title": "監禁", "value": "180|監禁"}, {"title": "灌腸", "value": "181|灌腸"}, {"title": "鴨嘴", "value": "182|鴨嘴"}, {"title": "插入異物", "value": "183|插入異物"}, {"title": "輪姦", "value": "184|輪姦"}, {"title": "拘束", "value": "185|拘束"}, {"title": "凌辱", "value": "186|凌辱"}, {"title": "羞恥", "value": "187|羞恥"}, {"title": "乳液", "value": "188|乳液"}, {"title": "催眠", "value": "189|催眠"}, {"title": "子宮頸", "value": "190|子宮頸"}, {"title": "女優按摩棒", "value": "191|女優按摩棒"}, {"title": "立即口交", "value": "192|立即口交"}, {"title": "合集", "value": "193|合集"}, {"title": "單體作品", "value": "194|單體作品"}, {"title": "DMM獨家", "value": "195|DMM獨家"}, {"title": "獨立製作", "value": "196|獨立製作"}, {"title": "局部特寫", "value": "197|局部特寫"}, {"title": "素人", "value": "198|素人"}, {"title": "第一人稱攝影", "value": "199|第一人稱攝影"}, {"title": "國外進口", "value": "200|國外進口"}, {"title": "纪录片", "value": "201|纪录片"}, {"title": "投稿", "value": "202|投稿"}, {"title": "數位馬賽克", "value": "203|數位馬賽克"}, {"title": "首次亮相", "value": "204|首次亮相"}, {"title": "經典", "value": "205|經典"}, {"title": "薄馬賽克", "value": "206|薄馬賽克"}, {"title": "4小時以上作品", "value": "207|4小時以上作品"}, {"title": "介紹影片", "value": "208|介紹影片"}, {"title": "主觀視角", "value": "209|主觀視角"}, {"title": "高畫質", "value": "210|高畫質"}, {"title": "戀愛", "value": "211|戀愛"}, {"title": "戲劇", "value": "212|戲劇"}, {"title": "複刻版", "value": "213|複刻版"}, {"title": "限時降價", "value": "214|限時降價"}, {"title": "故事集", "value": "215|故事集"}, {"title": "特效", "value": "216|特效"}, {"title": "3D", "value": "217|3D"}, {"title": "R-18", "value": "219|R-18"}, {"title": "R-15", "value": "220|R-15"}, {"title": "DMM專屬", "value": "221|DMM專屬"}, {"title": "教學", "value": "222|教學"}, {"title": "給女性觀眾", "value": "223|給女性觀眾"}, {"title": "恐怖", "value": "224|恐怖"}, {"title": "合作作品", "value": "225|合作作品"}, {"title": "パラダイスTV", "value": "226|パラダイスTV"}, {"title": "DVDトースター", "value": "227|DVDトースター"}, {"title": "魔法少女", "value": "228|魔法少女"}, {"title": "假陽具", "value": "229|假陽具"}, {"title": "順豐", "value": "230|順豐"}, {"title": "圖片視頻（男）", "value": "231|圖片視頻（男）"}, {"title": "AV OPEN 2014 中量級", "value": "232|AV OPEN 2014 中量級"}, {"title": "AV OPEN 2014 超重量級", "value": "233|AV OPEN 2014 超重量級"}, {"title": "遊戲實況", "value": "234|遊戲實況"}, {"title": "AV OPEN 2014 ヘビー級", "value": "235|AV OPEN 2014 ヘビー級"}, {"title": "變身女主角", "value": "236|變身女主角"}, {"title": "AV OPEN 2015 企画部門", "value": "238|AV OPEN 2015 企画部門"}, {"title": "AV OPEN 2015 女優部門", "value": "239|AV OPEN 2015 女優部門"}, {"title": "AV OPEN 2015 素人部門", "value": "240|AV OPEN 2015 素人部門"}, {"title": "AV OPEN 2015 乙女部門", "value": "241|AV OPEN 2015 乙女部門"}, {"title": "AV OPEN 2015 熟女部門", "value": "242|AV OPEN 2015 熟女部門"}, {"title": "推薦用於智能手機的垂直視頻", "value": "244|推薦用於智能手機的垂直視頻"}, {"title": "V影院", "value": "245|V影院"}, {"title": "動畫", "value": "246|動畫"}, {"title": "行動", "value": "247|行動"}, {"title": "黑暗系統", "value": "248|黑暗系統"}, {"title": "迷你係列", "value": "249|迷你係列"}, {"title": "嬌小的", "value": "250|嬌小的"}, {"title": "浸漬", "value": "251|浸漬"}, {"title": "AV OPEN 2016 女優部門", "value": "252|AV OPEN 2016 女優部門"}, {"title": "AV OPEN 2016 素人部門", "value": "253|AV OPEN 2016 素人部門"}, {"title": "AV OPEN 2016 バラエティ部門", "value": "254|AV OPEN 2016 バラエティ部門"}, {"title": "AV OPEN 2016 ハード部門", "value": "256|AV OPEN 2016 ハード部門"}, {"title": "AV OPEN 2016 乙女部門", "value": "258|AV OPEN 2016 乙女部門"}, {"title": "AV OPEN 2016 企画部門", "value": "259|AV OPEN 2016 企画部門"}, {"title": "AV OPEN 2016 人妻・熟女部門", "value": "260|AV OPEN 2016 人妻・熟女部門"}, {"title": "婊子", "value": "261|婊子"}, {"title": "僅限虛擬現實", "value": "262|僅限虛擬現實"}, {"title": "AV 棒球福利", "value": "263|AV 棒球福利"}, {"title": "時間停止", "value": "264|時間停止"}, {"title": "漫畫雜誌", "value": "265|漫畫雜誌"}, {"title": "搞笑喜劇", "value": "266|搞笑喜劇"}, {"title": "男子的愛", "value": "267|男子的愛"}, {"title": "幻想", "value": "268|幻想"}, {"title": "AV OPEN 2017 女優部門", "value": "269|AV OPEN 2017 女優部門"}, {"title": "AV OPEN 2017紀錄片部", "value": "270|AV OPEN 2017紀錄片部"}, {"title": "AV OPEN 2017 フェチ部門", "value": "271|AV OPEN 2017 フェチ部門"}, {"title": "AV OPEN 2017 乙女部門", "value": "272|AV OPEN 2017 乙女部門"}, {"title": "AV OPEN 2017 人妻・熟女部門", "value": "273|AV OPEN 2017 人妻・熟女部門"}, {"title": "AV OPEN 2017 マニア部門", "value": "274|AV OPEN 2017 マニア部門"}, {"title": "AV OPEN 2017 企画部門", "value": "275|AV OPEN 2017 企画部門"}, {"title": "AV OPEN 2017 ハード部門", "value": "276|AV OPEN 2017 ハード部門"}, {"title": "AV OPEN 2017 素人部門", "value": "277|AV OPEN 2017 素人部門"}, {"title": "AV OPEN 2017 ドラマ部門", "value": "278|AV OPEN 2017 ドラマ部門"}, {"title": "經歷的告白", "value": "279|經歷的告白"}, {"title": "集產品", "value": "281|集產品"}, {"title": "反向強姦", "value": "282|反向強姦"}, {"title": "反向強姦", "value": "283|反向強姦"}, {"title": "名人朋友【特典C】合格作品", "value": "284|名人朋友【特典C】合格作品"}, {"title": "名人朋友【特典A】合格作品", "value": "285|名人朋友【特典A】合格作品"}, {"title": "愛情喜劇", "value": "286|愛情喜劇"}, {"title": "僅限 FANZA 發行", "value": "287|僅限 FANZA 發行"}, {"title": "有資格參加名人朋友活動的作品", "value": "288|有資格參加名人朋友活動的作品"}, {"title": "愛欲", "value": "289|愛欲"}, {"title": "高品質虛擬現實", "value": "290|高品質虛擬現實"}, {"title": "同性戀", "value": "291|同性戀"}, {"title": "AV OPEN 2018 女優部門", "value": "292|AV OPEN 2018 女優部門"}, {"title": "AV OPEN 2018 企画部門", "value": "293|AV OPEN 2018 企画部門"}, {"title": "AV OPEN 2018 素人部門", "value": "294|AV OPEN 2018 素人部門"}, {"title": "AV OPEN 2018 人妻・熟女部門", "value": "296|AV OPEN 2018 人妻・熟女部門"}, {"title": "AV OPEN 2018 ハード部門", "value": "297|AV OPEN 2018 ハード部門"}, {"title": "AV OPEN 2018 乙女部門", "value": "298|AV OPEN 2018 乙女部門"}, {"title": "連褲襪", "value": "300|連褲襪"}, {"title": "乳液油", "value": "302|乳液油"}, {"title": "年輕的妻子", "value": "303|年輕的妻子"}, {"title": "保健皂", "value": "305|保健皂"}, {"title": "極致高潮", "value": "306|極致高潮"}, {"title": "虐待", "value": "307|虐待"}, {"title": "M女", "value": "308|M女"}, {"title": "職業裝", "value": "309|職業裝"}, {"title": "背部", "value": "310|背部"}, {"title": "不戴胸罩", "value": "311|不戴胸罩"}, {"title": "女上司", "value": "312|女上司"}, {"title": "洗澡", "value": "313|洗澡"}, {"title": "乳頭滑落", "value": "314|乳頭滑落"}, {"title": "旅行", "value": "315|旅行"}, {"title": "奧納薩波", "value": "316|奧納薩波"}, {"title": "蠟燭", "value": "317|蠟燭"}, {"title": "男人噴", "value": "318|男人噴"}, {"title": "娘・養女", "value": "319|娘・養女"}, {"title": "面具，面具", "value": "320|面具，面具"}, {"title": "軟體", "value": "321|軟體"}, {"title": "面試", "value": "322|面試"}, {"title": "宅男", "value": "323|宅男"}, {"title": "接待員", "value": "324|接待員"}, {"title": "沒有內褲", "value": "325|沒有內褲"}, {"title": "酒會", "value": "326|酒會"}, {"title": "部下・同僚", "value": "327|部下・同僚"}, {"title": "名人", "value": "328|名人"}, {"title": "約會", "value": "331|約會"}, {"title": "花嫁", "value": "332|花嫁"}, {"title": "祖父", "value": "334|祖父"}, {"title": "姨", "value": "335|姨"}, {"title": "鼻鉤", "value": "336|鼻鉤"}, {"title": "運動員", "value": "337|運動員"}, {"title": "打屁股", "value": "339|打屁股"}, {"title": "酒店", "value": "340|酒店"}, {"title": "女王", "value": "341|女王"}, {"title": "瑜伽", "value": "342|瑜伽"}, {"title": "新人陸續登場", "value": "343|新人陸續登場"}, {"title": "白目・失神", "value": "344|白目・失神"}, {"title": "媽媽朋友", "value": "345|媽媽朋友"}, {"title": "啦啦隊長", "value": "346|啦啦隊長"}, {"title": "奶奶", "value": "347|奶奶"}, {"title": "社團活動經理", "value": "348|社團活動經理"}, {"title": "妄想族", "value": "349|妄想族"}, {"title": "艾曼紐", "value": "350|艾曼紐"}, {"title": "艾曼紐", "value": "351|艾曼紐"}, {"title": "放置", "value": "352|放置"}, {"title": "心理驚悚片", "value": "353|心理驚悚片"}, {"title": "切卡", "value": "354|切卡"}, {"title": "福袋", "value": "355|福袋"}, {"title": "最好的，綜合性的", "value": "356|最好的，綜合性的"}, {"title": "3P、4P", "value": "357|3P、4P"}, {"title": "女優", "value": "358|女優"}, {"title": "藝人", "value": "359|藝人"}, {"title": "強姦", "value": "360|強姦"}, {"title": "湯", "value": "361|湯"}, {"title": "凌辱", "value": "362|凌辱"}, {"title": "偶像", "value": "363|偶像"}, {"title": "看護師", "value": "364|看護師"}, {"title": "奴隸", "value": "365|奴隸"}, {"title": "風俗", "value": "366|風俗"}, {"title": "處女之物", "value": "367|處女之物"}, {"title": "小乳房", "value": "368|小乳房"}, {"title": "大公雞", "value": "369|大公雞"}, {"title": "妹", "value": "370|妹"}, {"title": "戀物癖", "value": "371|戀物癖"}, {"title": "示例視頻", "value": "372|示例視頻"}, {"title": "秋季大甩賣", "value": "373|秋季大甩賣"}, {"title": "藍光", "value": "374|藍光"}, {"title": "出口", "value": "375|出口"}, {"title": "動漫人物", "value": "376|動漫人物"}, {"title": "DOD 秋季促銷第 2 部分", "value": "377|DOD 秋季促銷第 2 部分"}, {"title": "2010年代前半（DOD）", "value": "378|2010年代前半（DOD）"}, {"title": "光盤點播銷售", "value": "379|光盤點播銷售"}, {"title": "AV女優", "value": "380|AV女優"}, {"title": "設置有好處的產品", "value": "381|設置有好處的產品"}, {"title": "Triple HAPPY 活動", "value": "382|Triple HAPPY 活動"}, {"title": "Rena 桃園 JOKER 禮品活動", "value": "383|Rena 桃園 JOKER 禮品活動"}, {"title": "時代劇", "value": "384|時代劇"}, {"title": "全球媒體 40% 折扣銷售", "value": "385|全球媒體 40% 折扣銷售"}, {"title": "Mousozoku 2021上半年進入TOP 100", "value": "386|Mousozoku 2021上半年進入TOP 100"}, {"title": "レズビアン", "value": "387|レズビアン"}, {"title": "BL（ボーイズラブ）", "value": "388|BL（ボーイズラブ）"}, {"title": "8KVR", "value": "389|8KVR"}, {"title": "妄想族30％OFF第1弾", "value": "390|妄想族30％OFF第1弾"}, {"title": "ブランドストア30％OFF☆", "value": "391|ブランドストア30％OFF☆"}, {"title": "ながえスタイル30％OFF", "value": "392|ながえスタイル30％OFF"}, {"title": "MERCURY（マーキュリー）他30％OFF", "value": "393|MERCURY（マーキュリー）他30％OFF"}, {"title": "ブランドストア30％OFF！", "value": "394|ブランドストア30％OFF！"}, {"title": "妄想族30％OFF", "value": "395|妄想族30％OFF"}, {"title": "BALTAN＜バルタン＞他30％OFF", "value": "396|BALTAN＜バルタン＞他30％OFF"}, {"title": "ながえスタイル他30％OFF", "value": "397|ながえスタイル他30％OFF"}, {"title": "台湾モデル", "value": "398|台湾モデル"}, {"title": "AI生成作品", "value": "399|AI生成作品"}, {"title": "アナルセックス（男の娘）", "value": "400|アナルセックス（男の娘）"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "無碼AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "uncensored" }, { name: "sub", title: "片商", type: "enumeration", value: "", enumOptions: [{"title": "HEYZO", "value": "17|HEYZO"}, {"title": "東京熱(Tokyo Hot)", "value": "29|東京熱(Tokyo Hot)"}, {"title": "カリビアンコム(Caribbeancom)", "value": "30|カリビアンコム(Caribbeancom)"}, {"title": "天然むすめ(10musume)", "value": "31|天然むすめ(10musume)"}, {"title": "一本道(1pondo)", "value": "32|一本道(1pondo)"}, {"title": "エッチな4610", "value": "34|エッチな4610"}, {"title": "ガチん娘！(Gachinco)", "value": "35|ガチん娘！(Gachinco)"}, {"title": "パコパコママ(pacopacomama)", "value": "36|パコパコママ(pacopacomama)"}, {"title": "人妻斬り0930", "value": "38|人妻斬り0930"}, {"title": "エッチな0930", "value": "39|エッチな0930"}, {"title": "カリビアンコムPPV(Caribbeancompr)", "value": "40|カリビアンコムPPV(Caribbeancompr)"}, {"title": "トリプルエックス (XXX-AV)", "value": "126|トリプルエックス (XXX-AV)"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "素人AV", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "amateurjav" }, { name: "sub", title: "題材", type: "enumeration", value: "", enumOptions: [{"title": "素人", "value": "1|素人"}, {"title": "纪录片", "value": "2|纪录片"}, {"title": "花癡", "value": "3|花癡"}, {"title": "獵豔、搭訕", "value": "4|獵豔、搭訕"}, {"title": "人妻", "value": "5|人妻"}, {"title": "女生", "value": "6|女生"}, {"title": "女優按摩棒", "value": "7|女優按摩棒"}, {"title": "乳房", "value": "8|乳房"}, {"title": "角色扮演", "value": "9|角色扮演"}, {"title": "第一人稱攝影", "value": "10|第一人稱攝影"}, {"title": "苗條", "value": "11|苗條"}, {"title": "體育服", "value": "12|體育服"}, {"title": "高中女生", "value": "13|高中女生"}, {"title": "拘束", "value": "14|拘束"}, {"title": "中出", "value": "15|中出"}, {"title": "自慰", "value": "16|自慰"}, {"title": "熟女", "value": "17|熟女"}, {"title": "打手槍", "value": "18|打手槍"}, {"title": "美容按摩", "value": "19|美容按摩"}, {"title": "合集", "value": "20|合集"}, {"title": "情侶", "value": "21|情侶"}, {"title": "玩具", "value": "22|玩具"}, {"title": "痴女", "value": "23|痴女"}, {"title": "企畫", "value": "24|企畫"}, {"title": "顏射", "value": "25|顏射"}, {"title": "OL", "value": "26|OL"}, {"title": "偷窥", "value": "27|偷窥"}, {"title": "4小時以上作品", "value": "28|4小時以上作品"}, {"title": "女大學生", "value": "29|女大學生"}, {"title": "多人数", "value": "30|多人数"}, {"title": "新娘、嫩妻", "value": "31|新娘、嫩妻"}, {"title": "通姦", "value": "32|通姦"}, {"title": "巨乳", "value": "33|巨乳"}, {"title": "潮吹", "value": "34|潮吹"}, {"title": "姐姐", "value": "35|姐姐"}, {"title": "女同性戀", "value": "36|女同性戀"}, {"title": "放尿・失禁", "value": "37|放尿・失禁"}, {"title": "按摩棒", "value": "38|按摩棒"}, {"title": "各種職業", "value": "39|各種職業"}, {"title": "乳交", "value": "40|乳交"}, {"title": "其他戀物癖", "value": "41|其他戀物癖"}, {"title": "羞恥・辱め", "value": "42|羞恥・辱め"}, {"title": "處男", "value": "43|處男"}, {"title": "單體作品", "value": "44|單體作品"}, {"title": "母親", "value": "45|母親"}, {"title": "妓女", "value": "46|妓女"}, {"title": "惡作劇", "value": "47|惡作劇"}, {"title": "近親相姦", "value": "48|近親相姦"}, {"title": "童顔", "value": "49|童顔"}, {"title": "SM", "value": "50|SM"}, {"title": "車震", "value": "51|車震"}, {"title": "主觀視角", "value": "52|主觀視角"}, {"title": "美少女", "value": "53|美少女"}, {"title": "屁股", "value": "54|屁股"}, {"title": "風俗", "value": "55|風俗"}, {"title": "乳液・油", "value": "56|乳液・油"}, {"title": "亂交", "value": "57|亂交"}, {"title": "汗だく", "value": "58|汗だく"}, {"title": "女教師", "value": "59|女教師"}, {"title": "制服", "value": "60|制服"}, {"title": "高清(HD)", "value": "61|高清(HD)"}, {"title": "深喉", "value": "62|深喉"}, {"title": "羞恥", "value": "63|羞恥"}, {"title": "立即口交", "value": "64|立即口交"}, {"title": "迷你裙", "value": "65|迷你裙"}, {"title": "美腳", "value": "66|美腳"}, {"title": "美尻", "value": "67|美尻"}, {"title": "和服・浴衣", "value": "68|和服・浴衣"}, {"title": "女僕", "value": "69|女僕"}, {"title": "內衣", "value": "70|內衣"}, {"title": "首次亮相", "value": "71|首次亮相"}, {"title": "藥物・壯陽藥", "value": "72|藥物・壯陽藥"}, {"title": "金髪・ブロンド", "value": "73|金髪・ブロンド"}, {"title": "國外進口", "value": "74|國外進口"}, {"title": "護士", "value": "75|護士"}, {"title": "千金小姐", "value": "76|千金小姐"}, {"title": "癡漢", "value": "77|癡漢"}, {"title": "初撮り", "value": "78|初撮り"}, {"title": "肛交", "value": "79|肛交"}, {"title": "奴隷", "value": "80|奴隷"}, {"title": "デカチン・巨根", "value": "81|デカチン・巨根"}, {"title": "戀腿癖", "value": "82|戀腿癖"}, {"title": "淫穢故事", "value": "83|淫穢故事"}, {"title": "監禁", "value": "84|監禁"}, {"title": "爆乳", "value": "85|爆乳"}, {"title": "野外・露出", "value": "86|野外・露出"}, {"title": "局部特寫", "value": "87|局部特寫"}, {"title": "顏射", "value": "88|顏射"}, {"title": "無毛", "value": "89|無毛"}, {"title": "貧乳・微乳", "value": "90|貧乳・微乳"}, {"title": "灌腸", "value": "91|灌腸"}, {"title": "孕婦", "value": "92|孕婦"}, {"title": "空姐・CA", "value": "93|空姐・CA"}, {"title": "女醫生", "value": "94|女醫生"}, {"title": "顏面騎乘", "value": "95|顏面騎乘"}, {"title": "放尿", "value": "96|放尿"}, {"title": "レイプ・強姦", "value": "97|レイプ・強姦"}, {"title": "凌辱", "value": "98|凌辱"}, {"title": "水手服", "value": "99|水手服"}, {"title": "緊縛", "value": "100|緊縛"}, {"title": "泳裝", "value": "101|泳裝"}, {"title": "鬼畜", "value": "102|鬼畜"}, {"title": "手人", "value": "103|手人"}, {"title": "足交", "value": "104|足交"}, {"title": "催眠", "value": "105|催眠"}, {"title": "僅限外賣的外行", "value": "106|僅限外賣的外行"}, {"title": "變性者", "value": "107|變性者"}, {"title": "多P", "value": "108|多P"}, {"title": "美容院", "value": "109|美容院"}, {"title": "雙性人", "value": "110|雙性人"}, {"title": "女戰士", "value": "111|女戰士"}, {"title": "戲劇", "value": "112|戲劇"}, {"title": "及膝襪", "value": "113|及膝襪"}, {"title": "插入異物", "value": "114|插入異物"}, {"title": "巨尻", "value": "115|巨尻"}, {"title": "學校作品", "value": "116|學校作品"}, {"title": "白人", "value": "117|白人"}, {"title": "緊縛", "value": "118|緊縛"}, {"title": "高", "value": "119|高"}, {"title": "眼鏡", "value": "120|眼鏡"}, {"title": "倒追", "value": "121|倒追"}, {"title": "家庭教師", "value": "122|家庭教師"}, {"title": "輪姦", "value": "123|輪姦"}, {"title": "費拉莫諾", "value": "124|費拉莫諾"}, {"title": "口内発射", "value": "125|口内発射"}, {"title": "學校泳裝", "value": "126|學校泳裝"}, {"title": "運動", "value": "127|運動"}, {"title": "温泉", "value": "128|温泉"}, {"title": "胖女人", "value": "129|胖女人"}, {"title": "姐妹", "value": "130|姐妹"}, {"title": "校服", "value": "131|校服"}, {"title": "投稿", "value": "132|投稿"}, {"title": "處女", "value": "133|處女"}, {"title": "女祭司", "value": "134|女祭司"}, {"title": "寡婦", "value": "135|寡婦"}, {"title": "秘書", "value": "136|秘書"}, {"title": "正太控", "value": "137|正太控"}, {"title": "拳交", "value": "138|拳交"}, {"title": "義母", "value": "139|義母"}, {"title": "手指插入", "value": "140|手指插入"}, {"title": "藥物", "value": "141|藥物"}, {"title": "女主人、女老板", "value": "142|女主人、女老板"}, {"title": "爛醉如泥的", "value": "143|爛醉如泥的"}, {"title": "羞恥", "value": "144|羞恥"}, {"title": "清楚", "value": "145|清楚"}, {"title": "職業", "value": "146|職業"}, {"title": "淫亂", "value": "147|淫亂"}, {"title": "戀物癖", "value": "148|戀物癖"}, {"title": "盗撮", "value": "149|盗撮"}, {"title": "多人遊戲", "value": "150|多人遊戲"}, {"title": "陵辱", "value": "151|陵辱"}, {"title": "調教", "value": "152|調教"}, {"title": "強姦", "value": "153|強姦"}, {"title": "護士", "value": "154|護士"}, {"title": "露出", "value": "156|露出"}, {"title": "西方的東西", "value": "157|西方的東西"}, {"title": "糞便", "value": "158|糞便"}, {"title": "內衣", "value": "159|內衣"}, {"title": "偶像藝人", "value": "160|偶像藝人"}, {"title": "母乳", "value": "161|母乳"}, {"title": "女裝人妖", "value": "162|女裝人妖"}, {"title": "4時間以上", "value": "163|4時間以上"}, {"title": "キス・接吻", "value": "164|キス・接吻"}, {"title": "複刻版", "value": "165|複刻版"}, {"title": "猥褻穿著", "value": "166|猥褻穿著"}, {"title": "妹", "value": "167|妹"}, {"title": "按摩", "value": "168|按摩"}, {"title": "出軌", "value": "169|出軌"}, {"title": "肛内中出", "value": "170|肛内中出"}, {"title": "黑人演員", "value": "171|黑人演員"}, {"title": "看護", "value": "172|看護"}, {"title": "飲尿", "value": "173|飲尿"}, {"title": "緊縛", "value": "174|緊縛"}, {"title": "模特兒", "value": "175|模特兒"}, {"title": "介紹影片", "value": "176|介紹影片"}, {"title": "男同性恋", "value": "177|男同性恋"}, {"title": "肌肉", "value": "178|肌肉"}, {"title": "食糞", "value": "179|食糞"}, {"title": "吻", "value": "180|吻"}, {"title": "吞精", "value": "181|吞精"}, {"title": "格鬥家", "value": "182|格鬥家"}, {"title": "女主播", "value": "183|女主播"}, {"title": "格鬥家", "value": "184|格鬥家"}, {"title": "空姐", "value": "185|空姐"}, {"title": "教練", "value": "186|教練"}, {"title": "日焼け", "value": "187|日焼け"}, {"title": "緊身衣", "value": "188|緊身衣"}, {"title": "其他", "value": "189|其他"}, {"title": "連褲襪", "value": "190|連褲襪"}, {"title": "M男", "value": "191|M男"}, {"title": "美女", "value": "192|美女"}, {"title": "賽車女郎", "value": "193|賽車女郎"}, {"title": "女檢察官", "value": "194|女檢察官"}, {"title": "伴侶", "value": "195|伴侶"}, {"title": "給女性觀眾", "value": "196|給女性觀眾"}, {"title": "觸手", "value": "197|觸手"}, {"title": "綜合", "value": "198|綜合"}, {"title": "特效", "value": "199|特效"}, {"title": "強姦", "value": "200|強姦"}, {"title": "亞洲女演員", "value": "201|亞洲女演員"}, {"title": "凌辱", "value": "202|凌辱"}, {"title": "约束", "value": "203|约束"}, {"title": "主觀工作", "value": "204|主觀工作"}, {"title": "M女", "value": "205|M女"}, {"title": "微乳", "value": "206|微乳"}, {"title": "僅適用於 MGS 的獎勵視頻", "value": "207|僅適用於 MGS 的獎勵視頻"}, {"title": "如何", "value": "208|如何"}, {"title": "SOD組", "value": "209|SOD組"}, {"title": "示例視頻", "value": "210|示例視頻"}, {"title": "胖乎乎的", "value": "211|胖乎乎的"}, {"title": "女忍者", "value": "212|女忍者"}, {"title": "玩具", "value": "213|玩具"}, {"title": "恐怖", "value": "214|恐怖"}, {"title": "ファン感謝・訪問", "value": "215|ファン感謝・訪問"}, {"title": "DMM獨家", "value": "216|DMM獨家"}, {"title": "高清 (6000kbps)", "value": "217|高清 (6000kbps)"}, {"title": "巨根", "value": "218|巨根"}, {"title": "3P", "value": "219|3P"}, {"title": "paizurimono", "value": "220|paizurimono"}, {"title": "后宮", "value": "221|后宮"}, {"title": "H杯", "value": "222|H杯"}, {"title": "69", "value": "223|69"}, {"title": "排便", "value": "224|排便"}, {"title": "和服・喪服", "value": "225|和服・喪服"}, {"title": "E杯", "value": "226|E杯"}, {"title": "SF", "value": "227|SF"}, {"title": "短髮", "value": "228|短髮"}, {"title": "F杯", "value": "229|F杯"}, {"title": "G杯", "value": "230|G杯"}, {"title": "D杯", "value": "231|D杯"}, {"title": "捷徑", "value": "232|捷徑"}, {"title": "微乳・貧乳", "value": "233|微乳・貧乳"}, {"title": "跳舞", "value": "234|跳舞"}, {"title": "嬌小", "value": "235|嬌小"}, {"title": "虛擬現實", "value": "236|虛擬現實"}, {"title": "學校泳裝", "value": "237|學校泳裝"}, {"title": "奴隷", "value": "238|奴隷"}, {"title": "超乳", "value": "239|超乳"}, {"title": "連褲襪", "value": "240|連褲襪"}, {"title": "芸能人", "value": "241|芸能人"}, {"title": "口交", "value": "242|口交"}, {"title": "12月1日發售", "value": "243|12月1日發售"}, {"title": "子宮頸", "value": "244|子宮頸"}, {"title": "蘿莉塔", "value": "245|蘿莉塔"}, {"title": "新製造商", "value": "246|新製造商"}, {"title": "文件", "value": "247|文件"}, {"title": "騎乗位", "value": "248|騎乗位"}, {"title": "熟女  義母  近親相姦  騎乗位  シックスナイン  レズ", "value": "249|熟女  義母  近親相姦  騎乗位  シックスナイン  レズ"}, {"title": "基地", "value": "250|基地"}, {"title": "長發", "value": "251|長發"}, {"title": "長發", "value": "252|長發"}, {"title": "皮膚白皙", "value": "253|皮膚白皙"}, {"title": "乳液", "value": "254|乳液"}, {"title": "催眠", "value": "255|催眠"}, {"title": "虐待成熟的女人已婚婦女計劃單體作品", "value": "256|虐待成熟的女人已婚婦女計劃單體作品"}, {"title": "3P、4P", "value": "257|3P、4P"}, {"title": "淫乱・ハード系", "value": "258|淫乱・ハード系"}, {"title": "黒髪", "value": "259|黒髪"}, {"title": "舔陰已婚婦女外遇策劃", "value": "260|舔陰已婚婦女外遇策劃"}, {"title": "虐待女學生校服規劃", "value": "261|虐待女學生校服規劃"}, {"title": "茶髪", "value": "262|茶髪"}, {"title": "競泳水着", "value": "263|競泳水着"}, {"title": "女優合集", "value": "264|女優合集"}, {"title": "池袋", "value": "265|池袋"}, {"title": "渋谷", "value": "266|渋谷"}, {"title": "仙台", "value": "267|仙台"}, {"title": "名古屋", "value": "268|名古屋"}, {"title": "大阪", "value": "269|大阪"}, {"title": "恵比寿", "value": "270|恵比寿"}, {"title": "新宿", "value": "271|新宿"}, {"title": "横浜", "value": "272|横浜"}, {"title": "原宿", "value": "273|原宿"}, {"title": "川崎", "value": "274|川崎"}, {"title": "上野", "value": "275|上野"}, {"title": "大宮", "value": "276|大宮"}, {"title": "札幌", "value": "277|札幌"}, {"title": "柏", "value": "278|柏"}, {"title": "静岡", "value": "279|静岡"}, {"title": "秋葉原", "value": "280|秋葉原"}, {"title": "水戸", "value": "281|水戸"}, {"title": "代々木", "value": "282|代々木"}, {"title": "高田馬場", "value": "283|高田馬場"}, {"title": "天然", "value": "284|天然"}, {"title": "高崎", "value": "285|高崎"}, {"title": "福島", "value": "286|福島"}, {"title": "足立", "value": "287|足立"}, {"title": "お台場", "value": "288|お台場"}, {"title": "湘南", "value": "289|湘南"}, {"title": "岐阜", "value": "290|岐阜"}, {"title": "水道橋", "value": "291|水道橋"}, {"title": "滋賀", "value": "292|滋賀"}, {"title": "有楽町", "value": "293|有楽町"}, {"title": "後楽園", "value": "294|後楽園"}, {"title": "五反田", "value": "295|五反田"}, {"title": "豊洲", "value": "296|豊洲"}, {"title": "練馬", "value": "297|練馬"}, {"title": "市川", "value": "298|市川"}, {"title": "赤羽", "value": "299|赤羽"}, {"title": "山口", "value": "300|山口"}, {"title": "武藏小杉", "value": "301|武藏小杉"}, {"title": "秋田", "value": "302|秋田"}, {"title": "日暮里", "value": "303|日暮里"}, {"title": "学芸大学", "value": "304|学芸大学"}, {"title": "六本木", "value": "305|六本木"}, {"title": "三軒茶屋", "value": "306|三軒茶屋"}, {"title": "幡ヶ谷", "value": "307|幡ヶ谷"}, {"title": "島根", "value": "308|島根"}, {"title": "岡山", "value": "309|岡山"}, {"title": "舞浜", "value": "310|舞浜"}, {"title": "溝の口", "value": "311|溝の口"}, {"title": "短髮", "value": "312|短髮"}, {"title": "偶像", "value": "313|偶像"}, {"title": "比基尼", "value": "314|比基尼"}, {"title": "舔陰", "value": "315|舔陰"}, {"title": "女同性戀之吻", "value": "316|女同性戀之吻"}, {"title": "夜間爬行", "value": "317|夜間爬行"}, {"title": "內衣", "value": "318|內衣"}, {"title": "貧乳", "value": "319|貧乳"}, {"title": "屁股交", "value": "320|屁股交"}, {"title": "僅限送貨", "value": "321|僅限送貨"}, {"title": "妓女", "value": "322|妓女"}, {"title": "豐滿的戀物癖", "value": "323|豐滿的戀物癖"}, {"title": "口內射精", "value": "324|口內射精"}, {"title": "年輕的妻子", "value": "325|年輕的妻子"}, {"title": "看護婦", "value": "326|看護婦"}, {"title": "是大海！這是一個游泳池！這是一個節日！夏季活動南帕", "value": "327|是大海！這是一個游泳池！這是一個節日！夏季活動南帕"}, {"title": "E罩杯以上的十代（十幾歲）", "value": "328|E罩杯以上的十代（十幾歲）"}, {"title": "烏龜", "value": "329|烏龜"}, {"title": "蕩婦婊子！", "value": "330|蕩婦婊子！"}, {"title": "好色的討厭的女士", "value": "331|好色的討厭的女士"}, {"title": "狂歡海苔！瘋狂的多人遊戲！", "value": "332|狂歡海苔！瘋狂的多人遊戲！"}, {"title": "面試", "value": "333|面試"}, {"title": "私服", "value": "334|私服"}, {"title": "熊熊大火", "value": "335|熊熊大火"}, {"title": "司", "value": "336|司"}, {"title": "胸部注射", "value": "337|胸部注射"}, {"title": "親近感", "value": "338|親近感"}, {"title": "下著姿", "value": "339|下著姿"}, {"title": "口交", "value": "340|口交"}, {"title": "達", "value": "341|達"}, {"title": "自畫像", "value": "342|自畫像"}, {"title": "腹部射擊", "value": "343|腹部射擊"}, {"title": "約會", "value": "344|約會"}, {"title": "愛到肉麻", "value": "345|愛到肉麻"}, {"title": "刺穿", "value": "346|刺穿"}, {"title": "拍擊", "value": "347|拍擊"}, {"title": "我們是", "value": "348|我們是"}, {"title": "打手槍射擊", "value": "349|打手槍射擊"}, {"title": "白衣", "value": "350|白衣"}, {"title": "服部", "value": "351|服部"}, {"title": "套裝", "value": "352|套裝"}, {"title": "刈", "value": "353|刈"}, {"title": "淋浴", "value": "354|淋浴"}, {"title": "容易死", "value": "355|容易死"}, {"title": "士道", "value": "356|士道"}, {"title": "壹岐卷", "value": "357|壹岐卷"}, {"title": "烏賊", "value": "358|烏賊"}, {"title": "運動裝", "value": "359|運動裝"}, {"title": "同樣地", "value": "360|同樣地"}, {"title": "假陽具", "value": "361|假陽具"}, {"title": "尷尬的", "value": "362|尷尬的"}, {"title": "害羞", "value": "363|害羞"}, {"title": "敏感", "value": "364|敏感"}, {"title": "色情的聲音", "value": "365|色情的聲音"}, {"title": "轉子", "value": "366|轉子"}, {"title": "服從", "value": "367|服從"}, {"title": "全裸", "value": "368|全裸"}, {"title": "擅長口交", "value": "369|擅長口交"}, {"title": "燈籠褲", "value": "370|燈籠褲"}, {"title": "丁字褲", "value": "371|丁字褲"}, {"title": "肛門折磨", "value": "372|肛門折磨"}, {"title": "橡膠餅", "value": "373|橡膠餅"}, {"title": "積極的", "value": "374|積極的"}, {"title": "一鐵", "value": "375|一鐵"}, {"title": "女性主體", "value": "376|女性主體"}, {"title": "語言攻擊", "value": "377|語言攻擊"}, {"title": "顔騎", "value": "378|顔騎"}, {"title": "屁股射擊", "value": "379|屁股射擊"}, {"title": "靴子", "value": "380|靴子"}, {"title": "漁網褲襪", "value": "381|漁網褲襪"}, {"title": "潮吹", "value": "382|潮吹"}, {"title": "眼罩", "value": "383|眼罩"}, {"title": "腿間性行為", "value": "384|腿間性行為"}, {"title": "清潔口交", "value": "385|清潔口交"}, {"title": "打樁機", "value": "386|打樁機"}, {"title": "打屁股", "value": "387|打屁股"}, {"title": "恥辱遊戲", "value": "388|恥辱遊戲"}, {"title": "服射", "value": "389|服射"}, {"title": "舌頭射擊", "value": "390|舌頭射擊"}, {"title": "剃毛", "value": "391|剃毛"}, {"title": "轉型", "value": "392|轉型"}, {"title": "腋下舔", "value": "393|腋下舔"}, {"title": "浴衣", "value": "394|浴衣"}, {"title": "投擲", "value": "395|投擲"}, {"title": "高抬腿", "value": "396|高抬腿"}, {"title": "撒尿", "value": "397|撒尿"}, {"title": "方言", "value": "398|方言"}, {"title": "情熱的", "value": "399|情熱的"}, {"title": "石清水", "value": "400|石清水"}, {"title": "家居服", "value": "401|家居服"}, {"title": "鏡", "value": "402|鏡"}, {"title": "洗澡", "value": "403|洗澡"}, {"title": "很喜歡", "value": "404|很喜歡"}, {"title": "更衣", "value": "405|更衣"}, {"title": "淋浴自慰", "value": "406|淋浴自慰"}, {"title": "此人", "value": "407|此人"}, {"title": "猿猴", "value": "408|猿猴"}, {"title": "鋸井", "value": "409|鋸井"}, {"title": "聖誕節", "value": "410|聖誕節"}, {"title": "醉漢", "value": "411|醉漢"}, {"title": "故事", "value": "412|故事"}, {"title": "我通勤的妻子", "value": "413|我通勤的妻子"}, {"title": "小田切", "value": "414|小田切"}, {"title": "一個女孩邀請的H", "value": "415|一個女孩邀請的H"}, {"title": "旅行記", "value": "416|旅行記"}, {"title": "思春期", "value": "417|思春期"}, {"title": "圖片", "value": "418|圖片"}, {"title": "不化妝", "value": "419|不化妝"}, {"title": "48手", "value": "420|48手"}, {"title": "撿起", "value": "421|撿起"}, {"title": "月野", "value": "422|月野"}, {"title": "在晚安之前", "value": "423|在晚安之前"}, {"title": "体験談", "value": "424|体験談"}, {"title": "圈地", "value": "425|圈地"}, {"title": "3D音效", "value": "426|3D音效"}, {"title": "奧村", "value": "427|奧村"}, {"title": "油戲", "value": "428|油戲"}, {"title": "被攻擊", "value": "429|被攻擊"}, {"title": "色情凝視", "value": "430|色情凝視"}, {"title": "弓道", "value": "431|弓道"}, {"title": "戀愛的感覺", "value": "432|戀愛的感覺"}, {"title": "有", "value": "433|有"}, {"title": "豎拍", "value": "434|豎拍"}, {"title": "69", "value": "435|69"}, {"title": "奶操發射", "value": "436|奶操發射"}, {"title": "網球服", "value": "437|網球服"}, {"title": "學校用水", "value": "438|學校用水"}, {"title": "武田", "value": "439|武田"}, {"title": "葵", "value": "440|葵"}, {"title": "吉村", "value": "441|吉村"}, {"title": "佐田松", "value": "442|佐田松"}, {"title": "喬", "value": "443|喬"}, {"title": "北", "value": "444|北"}, {"title": "i斥卡瓦", "value": "445|i斥卡瓦"}, {"title": "襪帶", "value": "446|襪帶"}, {"title": "TKD", "value": "447|TKD"}, {"title": "夏目", "value": "448|夏目"}, {"title": "草台", "value": "449|草台"}, {"title": "布布拓", "value": "450|布布拓"}, {"title": "自慰器", "value": "451|自慰器"}, {"title": "固定相機", "value": "452|固定相機"}, {"title": "托尼", "value": "453|托尼"}, {"title": "體操服", "value": "454|體操服"}, {"title": "立花", "value": "455|立花"}, {"title": "高大迷人", "value": "456|高大迷人"}, {"title": "hatanaka", "value": "457|hatanaka"}, {"title": "護士服", "value": "458|護士服"}, {"title": "工作服", "value": "459|工作服"}, {"title": "NTR", "value": "460|NTR"}, {"title": "大腿粗拍", "value": "461|大腿粗拍"}, {"title": "性玩具", "value": "462|性玩具"}, {"title": "髒話", "value": "463|髒話"}, {"title": "服務員", "value": "464|服務員"}, {"title": "性感的", "value": "465|性感的"}, {"title": "僅適用於 MGS 的獎勵視頻", "value": "466|僅適用於 MGS 的獎勵視頻"}, {"title": "鮫島", "value": "467|鮫島"}, {"title": "智能手機奇聞趣事", "value": "468|智能手機奇聞趣事"}, {"title": "圍裙", "value": "469|圍裙"}, {"title": "緊身衣", "value": "470|緊身衣"}, {"title": "上原", "value": "471|上原"}, {"title": "中出", "value": "472|中出"}, {"title": "野外", "value": "473|野外"}, {"title": "絲襪", "value": "474|絲襪"}, {"title": "烏龜", "value": "475|烏龜"}, {"title": "收縮", "value": "476|收縮"}, {"title": "金發", "value": "477|金發"}, {"title": "女傭", "value": "478|女傭"}, {"title": "大屁股", "value": "479|大屁股"}, {"title": "高視", "value": "480|高視"}, {"title": "美少女", "value": "481|美少女"}, {"title": "加侖", "value": "482|加侖"}, {"title": "餅", "value": "483|餅"}, {"title": "迷你係列", "value": "484|迷你係列"}, {"title": "身體部位穿環", "value": "487|身體部位穿環"}, {"title": "紋身", "value": "488|紋身"}, {"title": "中長發", "value": "489|中長發"}, {"title": "深色皮膚", "value": "490|深色皮膚"}, {"title": "中國服飾", "value": "491|中國服飾"}, {"title": "連褲襪", "value": "492|連褲襪"}, {"title": "捲髮", "value": "493|捲髮"}, {"title": "裸體圍裙", "value": "495|裸體圍裙"}, {"title": "寬鬆的襪子", "value": "496|寬鬆的襪子"}, {"title": "年輕的妻子", "value": "497|年輕的妻子"}, {"title": "傲嬌", "value": "498|傲嬌"}, {"title": "庫斯科", "value": "499|庫斯科"}, {"title": "外國人", "value": "500|外國人"}, {"title": "競選女郎", "value": "501|競選女郎"}, {"title": "緊身衣", "value": "502|緊身衣"}, {"title": "兔女郎", "value": "503|兔女郎"}, {"title": "迷你裙警察", "value": "504|迷你裙警察"}, {"title": "巴士指南", "value": "505|巴士指南"}, {"title": "妄想", "value": "507|妄想"}, {"title": "兒時的朋友", "value": "508|兒時的朋友"}, {"title": "動漫角色", "value": "509|動漫角色"}, {"title": "愛情喜劇", "value": "510|愛情喜劇"}, {"title": "看起來像", "value": "511|看起來像"}, {"title": "哥特蘿莉", "value": "512|哥特蘿莉"}, {"title": "經歷的告白", "value": "513|經歷的告白"}, {"title": "推薦用於智能手機的垂直視頻", "value": "515|推薦用於智能手機的垂直視頻"}, {"title": "公主", "value": "516|公主"}, {"title": "婊子", "value": "517|婊子"}, {"title": "背部", "value": "518|背部"}, {"title": "花嫁", "value": "519|花嫁"}, {"title": "酒會", "value": "520|酒會"}, {"title": "保健皂", "value": "521|保健皂"}, {"title": "限時特賣", "value": "522|限時特賣"}, {"title": "職業裝", "value": "523|職業裝"}, {"title": "酒店", "value": "524|酒店"}, {"title": "部下・同僚", "value": "525|部下・同僚"}, {"title": "旅行", "value": "526|旅行"}, {"title": "軟體", "value": "527|軟體"}, {"title": "極致高潮", "value": "528|極致高潮"}, {"title": "女上司", "value": "529|女上司"}, {"title": "姨", "value": "530|姨"}, {"title": "娘・養女", "value": "531|娘・養女"}, {"title": "媽媽朋友", "value": "532|媽媽朋友"}, {"title": "運動員", "value": "533|運動員"}, {"title": "啦啦隊長", "value": "534|啦啦隊長"}, {"title": "沒有內褲", "value": "535|沒有內褲"}, {"title": "社團活動經理", "value": "536|社團活動經理"}, {"title": "面試", "value": "537|面試"}, {"title": "不戴胸罩", "value": "538|不戴胸罩"}, {"title": "乳頭滑落", "value": "539|乳頭滑落"}, {"title": "名人", "value": "540|名人"}, {"title": "毛筆", "value": "541|毛筆"}, {"title": "失禁", "value": "542|失禁"}, {"title": "窒息", "value": "543|窒息"}, {"title": "在橡膠", "value": "544|在橡膠"}, {"title": "下著", "value": "545|下著"}, {"title": "禮儀小姐", "value": "546|禮儀小姐"}, {"title": "美麗成熟的女人", "value": "547|美麗成熟的女人"}, {"title": "三十路", "value": "548|三十路"}, {"title": "四十路", "value": "549|四十路"}, {"title": "五十路", "value": "551|五十路"}, {"title": "六十路", "value": "552|六十路"}, {"title": "全高清 (FHD)", "value": "553|全高清 (FHD)"}, {"title": "衣服", "value": "554|衣服"}, {"title": "瑜伽", "value": "555|瑜伽"}, {"title": "側面照", "value": "556|側面照"}, {"title": "奶奶", "value": "557|奶奶"}, {"title": "祖父", "value": "558|祖父"}, {"title": "頂點", "value": "559|頂點"}, {"title": "廢墟", "value": "560|廢墟"}, {"title": "美白", "value": "561|美白"}, {"title": "油乳液", "value": "562|油乳液"}, {"title": "流口水", "value": "563|流口水"}, {"title": "女高中生", "value": "564|女高中生"}, {"title": "放置", "value": "565|放置"}, {"title": "林", "value": "566|林"}, {"title": "白目・失神", "value": "567|白目・失神"}, {"title": "四郎", "value": "568|四郎"}, {"title": "鮫島", "value": "569|鮫島"}, {"title": "辰", "value": "570|辰"}, {"title": "殘酷的表達", "value": "571|殘酷的表達"}, {"title": "努魯營地△", "value": "572|努魯營地△"}, {"title": "僅下載", "value": "573|僅下載"}, {"title": "期間限定", "value": "574|期間限定"}, {"title": "我杯", "value": "575|我杯"}, {"title": "男人噴", "value": "577|男人噴"}, {"title": "J罩杯", "value": "578|J罩杯"}, {"title": "大學生", "value": "579|大學生"}, {"title": "Prestige 20週年特別企劃", "value": "580|Prestige 20週年特別企劃"}, {"title": "性教育", "value": "581|性教育"}, {"title": "限時特賣", "value": "582|限時特賣"}, {"title": "雛菊持有", "value": "583|雛菊持有"}, {"title": "一半", "value": "584|一半"}, {"title": "多人遊戲", "value": "585|多人遊戲"}, {"title": "PICKUP素人", "value": "586|PICKUP素人"}, {"title": "接待員", "value": "587|接待員"}, {"title": "面具，面具", "value": "588|面具，面具"}, {"title": "女王様", "value": "589|女王様"}, {"title": "レズビアン", "value": "590|レズビアン"}, {"title": "近親相●", "value": "591|近親相●"}, {"title": "高清", "value": "592|高清"}, {"title": "4K", "value": "593|4K"}, {"title": "罵倒", "value": "594|罵倒"}, {"title": "東京恋人他30％OFF", "value": "595|東京恋人他30％OFF"}, {"title": "しろうとちゃん。他30％OFF", "value": "596|しろうとちゃん。他30％OFF"}, {"title": "鼻フック", "value": "597|鼻フック"}, {"title": "MOON FORCE他30％OFF", "value": "598|MOON FORCE他30％OFF"}, {"title": "素人ホイホイZ他30％OFF", "value": "599|素人ホイホイZ他30％OFF"}, {"title": "オタク", "value": "600|オタク"}, {"title": "俺の素人-Z-他30％OFF", "value": "601|俺の素人-Z-他30％OFF"}, {"title": "素人ホイホイLOVER他30％OFF", "value": "602|素人ホイホイLOVER他30％OFF"}, {"title": "FANZA配信限定", "value": "603|FANZA配信限定"}, {"title": "GALちゃん。他30％OFF", "value": "604|GALちゃん。他30％OFF"}, {"title": "まんまんランド他30％OFF", "value": "605|まんまんランド他30％OFF"}, {"title": "ION イイ女を寝取りたい他30％OFF", "value": "606|ION イイ女を寝取りたい他30％OFF"}, {"title": "いんすた他30％OFF", "value": "607|いんすた他30％OFF"}, {"title": "AI生成作品", "value": "608|AI生成作品"}, {"title": "legjob", "value": "609|legjob"}, {"title": "個人攝影", "value": "610|個人攝影"}, {"title": "特典画像付き", "value": "611|特典画像付き"}, {"title": "アナルセックス（男の娘）", "value": "612|アナルセックス（男の娘）"}, {"title": "演員", "value": "613|演員"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "無碼破解", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "reducing-mosaic" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "H動畫", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "animation" }, { name: "sub", title: "動畫", type: "enumeration", value: "animation", enumOptions: [{"title": "全部", "value": "animation"}, {"title": "H有碼動畫", "value": "CensoredAnimation"}, {"title": "H無碼動畫", "value": "UncensoredAnimation"}, {"title": "H_3D動畫", "value": "tdAnimation"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "國產自拍", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "dt" }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var DOMAINS = [
  "https://18av.mm-cg.com",
  "https://mjv015.com",
  "https://mjv011.com",
  "https://mjv008.com",
  "https://mjv006.com",
  "https://mjv005.com"
];
var SITE = DOMAINS[0];
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
var GATE_PATH = "/zh/chinese_IamOverEighteenYearsOld/19/index.html";
var ageCookie = "YES_Eighteen=IamOverEighteenYearsOld";

var SECTIONS = [
  { type_id: "chinese", type_name: "中文字幕", list: "chinese" },
  { type_id: "censored", type_name: "有碼AV", list: "censored" },
  { type_id: "uncensored", type_name: "無碼AV", list: "uncensored" },
  { type_id: "amateurjav", type_name: "素人AV", list: "amateurjav" },
  { type_id: "reducing-mosaic", type_name: "無碼破解", list: "reducing-mosaic" },
  { type_id: "animation", type_name: "H動畫", list: "animation" },
  { type_id: "dt", type_name: "國產自拍", list: "dt" }
];

function t(v) {
  return String(v == null ? "" : v).trim();
}

function clean(s) {
  return t(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
}

function originOf(url) {
  var m = t(url).match(/^https?:\/\/[^/]+/i);
  return m ? m[0] : "";
}

function pathOf(url) {
  var u = t(url);
  var m = u.match(/^https?:\/\/[^/]+(\/.*)$/i);
  if (m) return m[1];
  return u.charAt(0) === "/" ? u : "/" + u;
}

function pageHeaders(origin) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8",
    "Referer": origin + "/",
    "Cookie": ageCookie
  };
}

async function rawGet(url, headers) {
  try {
    var res = await Widget.http.get(url, { headers: headers });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body;
  } catch (e) { return ""; }
}

function isGatePage(html) {
  return !!html && html.indexOf("fwin_dialog_submit") !== -1;
}

// 单域取页：命中门页时取 gate URL（其 JS 含 Cookie 名），更新 ageCookie 后重试一次
async function getHtmlForOrigin(origin, path) {
  var url = origin + path;
  var html = await rawGet(url, pageHeaders(origin));
  if (isGatePage(html)) {
    var g = await rawGet(origin + GATE_PATH, pageHeaders(origin));
    var cm = g && g.match(/([A-Za-z0-9_]+)=IamOverEighteenYearsOld/);
    if (cm) ageCookie = cm[1] + "=IamOverEighteenYearsOld";
    html = await rawGet(url, pageHeaders(origin));
  }
  return isGatePage(html) ? "" : html;
}

// 多域名 failover 取页：原域名优先，其余按 DOMAINS 顺序
async function getHtml(url) {
  var path = pathOf(url);
  var first = originOf(url) || SITE;
  var order = [first];
  for (var i = 0; i < DOMAINS.length; i++) if (DOMAINS[i] !== first) order.push(DOMAINS[i]);
  for (var j = 0; j < order.length; j++) {
    var html = await getHtmlForOrigin(order[j], path);
    if (html) return html;
  }
  return "";
}

// ---------------- 播放器解密（纯 JS，无 Buffer；S-box 运行时由 AES 仿射变换生成） ----------------
function xtime(a) { return ((a << 1) ^ ((a & 0x80) ? 0x1b : 0)) & 0xff; }
function gmul(a, b) {
  var p = 0;
  for (var i = 0; i < 8; i++) {
    if (b & 1) p ^= a;
    var hi = a & 0x80;
    a = (a << 1) & 0xff;
    if (hi) a ^= 0x1b;
    b >>= 1;
  }
  return p;
}
function gpow(a, e) {
  var r = 1;
  while (e > 0) {
    if (e & 1) r = gmul(r, a);
    a = gmul(a, a);
    e >>= 1;
  }
  return r;
}
function rotl8(x, n) { return ((x << n) | (x >> (8 - n))) & 0xff; }
var AES_SBOX = new Array(256);
var AES_ISBOX = new Array(256);
(function initSbox() {
  for (var i = 0; i < 256; i++) {
    var inv = i === 0 ? 0 : gpow(i, 254);
    var s = (inv ^ rotl8(inv, 1) ^ rotl8(inv, 2) ^ rotl8(inv, 3) ^ rotl8(inv, 4) ^ 0x63) & 0xff;
    AES_SBOX[i] = s;
    AES_ISBOX[s] = i;
  }
})();
var AES_RCON = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];
function aesKeyExpand(key) {
  var w = new Array(44);
  for (var i = 0; i < 4; i++) w[i] = (key[4 * i] << 24) | (key[4 * i + 1] << 16) | (key[4 * i + 2] << 8) | key[4 * i + 3];
  for (var j = 4; j < 44; j++) {
    var tt = w[j - 1];
    if (j % 4 === 0) {
      tt = (AES_SBOX[(tt >> 16) & 0xff] << 24) | (AES_SBOX[(tt >> 8) & 0xff] << 16) | (AES_SBOX[tt & 0xff] << 8) | AES_SBOX[(tt >> 24) & 0xff];
      tt ^= AES_RCON[j / 4 - 1] << 24;
    }
    w[j] = (w[j - 4] ^ tt) >>> 0;
  }
  return w;
}
function aesAddRoundKey(s, w, round) {
  for (var c = 0; c < 4; c++) {
    var word = w[round * 4 + c];
    s[4 * c] ^= (word >>> 24) & 0xff;
    s[4 * c + 1] ^= (word >>> 16) & 0xff;
    s[4 * c + 2] ^= (word >>> 8) & 0xff;
    s[4 * c + 3] ^= word & 0xff;
  }
}
function aesInvShiftRows(s) {
  var tmp = s.slice();
  for (var r = 1; r < 4; r++) {
    for (var c = 0; c < 4; c++) s[4 * c + r] = tmp[4 * ((c - r + 4) % 4) + r];
  }
}
function aesInvSubBytes(s) { for (var i = 0; i < 16; i++) s[i] = AES_ISBOX[s[i]]; }
function aesInvMixColumns(s) {
  for (var c = 0; c < 4; c++) {
    var i = 4 * c;
    var a0 = s[i], a1 = s[i + 1], a2 = s[i + 2], a3 = s[i + 3];
    s[i] = gmul(a0, 14) ^ gmul(a1, 11) ^ gmul(a2, 13) ^ gmul(a3, 9);
    s[i + 1] = gmul(a0, 9) ^ gmul(a1, 14) ^ gmul(a2, 11) ^ gmul(a3, 13);
    s[i + 2] = gmul(a0, 13) ^ gmul(a1, 9) ^ gmul(a2, 14) ^ gmul(a3, 11);
    s[i + 3] = gmul(a0, 11) ^ gmul(a1, 13) ^ gmul(a2, 9) ^ gmul(a3, 14);
  }
}
function aesDecryptBlock(block, w) {
  var s = block.slice();
  aesAddRoundKey(s, w, 10);
  for (var round = 9; round >= 1; round--) {
    aesInvShiftRows(s);
    aesInvSubBytes(s);
    aesAddRoundKey(s, w, round);
    aesInvMixColumns(s);
  }
  aesInvShiftRows(s);
  aesInvSubBytes(s);
  aesAddRoundKey(s, w, 0);
  return s;
}
function b64ToBytes(b64) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var cl = String(b64).replace(/[^A-Za-z0-9+/=]/g, "");
  var out = [];
  for (var i = 0; i < cl.length; i += 4) {
    var n = (chars.indexOf(cl[i]) << 18) | (chars.indexOf(cl[i + 1]) << 12)
      | ((chars.indexOf(cl[i + 2]) & 63) << 6) | (chars.indexOf(cl[i + 3]) & 63);
    out.push((n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff);
  }
  var pad = (cl.match(/=+$/) || [""])[0].length;
  return out.slice(0, out.length - pad);
}
function strToBytes(s) {
  var out = [];
  var str = String(s);
  for (var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);
    if (code < 0x80) out.push(code);
    else if (code < 0x800) { out.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f)); }
    else { out.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f)); }
  }
  return out;
}
// AES-128-CBC 解密（PKCS7 去填充），key/iv 为页内 16 字符 UTF-8 串
function aesDecryptCbcB64(b64, keyStr, ivStr) {
  var data = b64ToBytes(b64);
  var key = strToBytes(keyStr);
  var iv = strToBytes(ivStr);
  if (data.length < 16 || data.length % 16 !== 0 || key.length !== 16 || iv.length !== 16) return "";
  var w = aesKeyExpand(key);
  var prev = iv.slice();
  var out = [];
  for (var off = 0; off < data.length; off += 16) {
    var dec = aesDecryptBlock(data.slice(off, off + 16), w);
    for (var i = 0; i < 16; i++) out.push(dec[i] ^ prev[i]);
    prev = data.slice(off, off + 16);
  }
  var pad = out.length ? out[out.length - 1] : 0;
  if (pad < 1 || pad > 16) return "";
  for (var i2 = 0; i2 < pad; i2++) if (out[out.length - 1 - i2] !== pad) return "";
  var body = out.slice(0, out.length - pad);
  var s = "";
  for (var i3 = 0; i3 < body.length; i3++) s += String.fromCharCode(body[i3]);
  return s;
}

// 站方 decrypto：按分隔符切块、base 进制解析、异或还原字符
function decrypto(g, base, xor) {
  var sep = String.fromCharCode(base + 97);
  var parts = String(g || "").split(sep);
  var out = "";
  for (var i = 0; i < parts.length; i++) {
    var n = parseInt(parts[i], base);
    if (isNaN(n)) continue;
    out += String.fromCharCode(n ^ xor);
  }
  return out;
}

// 从详情页解出播放线 [{res:1080|720, playUrl}]；无 mvarr（SERVER:zero）时返回 []
function extractPlay(html) {
  var out = [];
  if (!html) return out;
  var km = html.match(/var argdeqweqweqwe\s*=\s*'([^']+)'/) || html.match(/var hdddedd252\s*=\s*'([^']+)'/);
  var ivm = html.match(/var hdddedg252\s*=\s*'([^']+)'/) || html.match(/var argdeqweqweqww\s*=\s*'([^']+)'/);
  if (!km || !ivm) return out;
  var key = km[1];
  var iv = ivm[1];
  var bm = html.match(/hcdeedg252\s*=\s*(\d+)/);
  var xm = html.match(/hadeedg252\s*=\s*(\d+)/);
  var base = bm ? parseInt(bm[1], 10) : 3;
  var xor = xm ? parseInt(xm[1], 10) : 13;
  var re = /mvarr\['(10_1|11_1)'\]=\[\['[^']*','([^']+)','[^']*','([^']*)','([^']*)'/g;
  var m;
  while ((m = re.exec(html))) {
    var res = m[1] === "10_1" ? 1080 : 720;
    var b64 = decrypto(m[2], base, xor);
    var id = aesDecryptCbcB64(b64, key, iv);
    if (!id || /[^A-Za-z0-9_-]/.test(id)) continue;
    var prefix = m[3];
    if (prefix.indexOf("//") === 0) prefix = "https:" + prefix;
    if (!/^https?:\/\//.test(prefix)) continue;
    out.push({ res: res, playUrl: prefix + id + (m[4] || "") });
  }
  out.sort(function (a, b) { return b.res - a.res; });
  return out;
}

// 详情页取页（跨域重试取 mvarr）：主域 -> mjv015 -> mjv011，最多 3 域；命中播放线即停。
// 全 zero 时仍返回首域 HTML（标题/封面照常出），plays 为空。
async function detailHtmlRetry(durl) {
  var path = pathOf(durl);
  var first = originOf(durl) || SITE;
  var order = [first];
  for (var i = 0; i < DOMAINS.length; i++) if (DOMAINS[i] !== first) order.push(DOMAINS[i]);
  var tries = order.slice(0, 3);
  var firstHtml = "";
  for (var j = 0; j < tries.length; j++) {
    var html = await getHtmlForOrigin(tries[j], path);
    if (!firstHtml) firstHtml = html;
    if (html) {
      var plays = extractPlay(html);
      if (plays.length) return { html: html, plays: plays };
    }
  }
  return { html: firstHtml, plays: [] };
}

// 列表解析：主循环 div.posts > div.post.video_9s（列表页 24 条、分类页 70 条；
// 站方用单引号写属性，解析正则须同时接受单双引号）；
// 每条 figure 链详情、h3 链标题、img 封面、.meta 日期。
function parsePosts(html) {
  var out = [];
  if (!html) return out;
  var seen = {};
  var chunks = String(html).split(/<div class=['"]post[\s'"]/);
  for (var i = 1; i < chunks.length; i++) {
    var c = chunks[i];
    var lm = c.match(/href=['"](https?:\/\/[^'"]*?_content\/[^'"]+?\.html)['"]/i);
    if (!lm) continue;
    var href = lm[1];
    if (seen[href]) continue;
    seen[href] = 1;
    var tm = c.match(/<h3[^>]*>\s*<a[^>]*>([^<]{2,400})<\/a>/i);
    var title = tm ? clean(tm[1]) : href;
    var pm = c.match(/<img[^>]+src=['"](https?:\/\/[^'"]+)['"]/i);
    var pic = pm ? pm[1] : "";
    var dm = c.match(/<div class=['"]meta['"]>([^<]*)<\/div>/i);
    out.push({
      id: href,
      type: "url",
      title: title,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: href,
      description: dm ? t(dm[1]) : "",
      mediaType: "movie"
    });
  }
  return out;
}

// 真实总页数：取与当前列表同前缀的数字分页链接最大值；无分页器即单页
function parsePagecount(html, url) {
  if (!html) return 1;
  var base = pathOf(url).replace(/\/\d+\.html$/, "/");
  try { base = decodeURIComponent(base); } catch (e) { /* ignore */ }
  var max = 1;
  var re = /href=['"]([^'"]*?\/(\d+)\.html)['"]/g;
  var m;
  while ((m = re.exec(html))) {
    var p = pathOf(m[1]);
    try { p = decodeURIComponent(p); } catch (e) { /* ignore */ }
    if (p.indexOf(base) !== 0) continue;
    var n = parseInt(m[2], 10);
    if (n > max && n < 100000) max = n;
  }
  return max;
}

function sectionListUrl(sec, page) {
  return "/zh/" + sec + "_list/all/" + page + ".html";
}

function genreUrl(sec, gid, gname, page) {
  return "/zh/" + sec + "_category/" + gid + "/" + encodeURIComponent(gname) + "/" + page + ".html";
}

function makerUrl(mid, mname, page) {
  return "/zh/uncensored_makersr/" + mid + "/" + encodeURIComponent(mname) + "/" + page + ".html";
}

function searchUrl(wd, page) {
  return "/zh/fc_search/all/" + encodeURIComponent(wd) + "/" + page + ".html";
}

function findSection(tid) {
  for (var i = 0; i < SECTIONS.length; i++) if (SECTIONS[i].type_id === tid) return SECTIONS[i];
  return SECTIONS[0];
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

async function loadList(params) {
  params = params || {};
  var tid = t(params.zone || "chinese");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var sub = t(params.sub || "");
  var sec = findSection(tid);
  var path = "";
  if (tid === "animation" && sub) {
    // 動畫子区筛选：值即列表 slug（animation / CensoredAnimation / UncensoredAnimation / tdAnimation）
    path = sectionListUrl(sub, page);
  } else if (sub && sub.indexOf("|") > 0) {
    // 题材/片商筛选：值形如 "<id>|<名>"
    var bar = sub.indexOf("|");
    var gid = sub.slice(0, bar);
    var gname = sub.slice(bar + 1);
    if (tid === "uncensored") path = makerUrl(gid, gname, page);
    else path = genreUrl(sec.list, gid, gname, page);
  } else {
    path = sectionListUrl(sec.list, page);
  }
  try {
    var url = SITE + path;
    var html = await getHtml(url);
    if (!html) return emptyItem();
    var list = parsePosts(html);
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
    var url = SITE + searchUrl(wd, page);
    var html = await getHtml(url);
    if (!html) return emptyItem();
    var list = parsePosts(html);
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

// 详情：现解播放线（只存档位名，懒解析 @@18AV:<durl>:<档位>）；全 zero 时只出标题/封面，不出播放线。
async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    var durl = /^https?:\/\//i.test(raw) ? raw : SITE + (raw.charAt(0) === "/" ? raw : "/" + raw);
    var r = await detailHtmlRetry(durl);
    var html = r.html;
    var plays = r.plays;
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = "";
    var hm = html.match(/<h1[^>]*>\s*<b>([^<]{2,500})<\/b>/i);
    if (hm) name = clean(hm[1]);
    if (!name) {
      var tm = html.match(/<title>([^<]*)<\/title>/i);
      if (tm) name = clean(tm[1]).replace(/\s*18AV在線H成人影片.*$/i, "").trim();
    }
    var pic = "";
    var jm = html.match(/"thumbnailUrl":"(https?:\/\/[^"]+)"/);
    if (jm) pic = jm[1];
    if (!pic) {
      var wm = html.match(/<div id="player-wrap"[^>]*>\s*<img src="(https?:\/\/[^"]+)"/i);
      if (wm) pic = wm[1];
    }
    if (!pic) {
      var og = html.match(/property="og:image" content="([^"]+)"/i);
      if (og) pic = og[1];
    }
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    for (var i = 0; i < plays.length; i++) {
      var lab = plays[i].res + "p";
      var id = durl + "@@18AV:" + plays[i].res;
      eps.push({ name: lab, link: id });
      seasonEps.push({ title: lab, episodeNumber: i + 1 });
      epItems.push({
        id: id,
        type: "url",
        title: lab,
        mediaType: "movie",
        posterPath: pic,
        link: id,
        episode: i + 1,
        episodeNumber: i + 1,
        seasonIndex: 1,
        seasonNumber: 1
      });
    }
    var result = {
      id: durl,
      type: "detail",
      title: name || durl,
      name: name || durl,
      description: name,
      mediaType: "movie",
      link: durl,
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
    }
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// 从 play.php 页取 m3u8：按档位取 videoSources，命中档位优先否则首条
async function resolveFromPlayUrl(playUrl, wantRes, durl) {
  if (!playUrl) return "";
  var html = await rawGet(playUrl, {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Referer": durl,
    "Cookie": ageCookie
  });
  if (!html) return "";
  var srcs = [];
  var re = /\{src: '([^']+)',type: 'application\/x-mpegURL', size: (\d+)\}/g;
  var m;
  while ((m = re.exec(html))) srcs.push({ url: m[1], size: parseInt(m[2], 10) });
  if (!srcs.length) return "";
  for (var i = 0; i < srcs.length; i++) {
    if (wantRes && srcs[i].size === wantRes) return srcs[i].url;
  }
  return srcs[0].url;
}

// loadResource：@@18AV:<durl>:<档位> -> 现取详情页解密 play.php -> 取 m3u8；
// play.php 无源（id 过期/轮换）时重取详情页现解再试一次。
async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 直链 m3u8
  if (/\.m3u8(\?|#|$)/i.test(raw) && raw.indexOf("@@") < 0) {
    return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": SITE + "/" } }];
  }
  var m = raw.match(/^(https?:\/\/\S+?)@@18AV:(\d+)$/);
  if (!m) {
    // 兜底：详情地址 -> 取详情首档
    try {
      var det = await loadDetail(raw);
      var eps = det && det.episodeItems;
      if (eps && eps.length) {
        return await loadResource({ link: eps[0].id });
      }
    } catch (e) { /* fall through */ }
    return [];
  }
  var durl = m[1];
  var wantRes = parseInt(m[2], 10) || 0;
  try {
    var r = await detailHtmlRetry(durl);
    var plays = r.plays;
    var p = null;
    for (var i = 0; i < plays.length; i++) {
      if (plays[i].res === wantRes) { p = plays[i]; break; }
    }
    if (!p && plays.length) p = plays[0];
    if (!p) return [];
    var media = await resolveFromPlayUrl(p.playUrl, wantRes, durl);
    if (!media) {
      // play.php 无源：重取详情页现解再试一次
      var r2 = await detailHtmlRetry(durl);
      var plays2 = r2.plays;
      var p2 = null;
      for (var j = 0; j < plays2.length; j++) {
        if (plays2[j].res === wantRes) { p2 = plays2[j]; break; }
      }
      if (!p2 && plays2.length) p2 = plays2[0];
      if (p2) media = await resolveFromPlayUrl(p2.playUrl, wantRes, durl);
    }
    if (!media) return [];
    // 分片走播单内 host，播放器须带 play.php 作 Referer（无 Referer 分片 404，实测）
    return [{ name: wantRes + "p", url: media, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": p.playUrl } }];
  } catch (e) {
    return [];
  }
}
