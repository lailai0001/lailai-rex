// 7mmtv for REX (lai_7mmtv v1.0.0)
// 移植自 mira-cat 蜘蛛 7mmtv.js（只读蓝图），后端 https://7mmtv.sx 。

WidgetMetadata = {
  "id": "lai_7mmtv",
  "title": "7mmtv",
  "description": "7mmtv：有码/无码破解/中字/无码/素人/国产/韩国直播与片商、标签分类；SW/VH 线走 mmtv-vidhide Worker 播放",
  "author": "lai",
  "version": "1.0.0",
  "requiredVersion": "0.0.1",
  "site": "https://7mmtv.sx",
  "detailCacheDuration": 180,
  "modules": [
    {
      "title": "分区",
      "functionName": "loadList",
      "cacheDuration": 180,
      "params": [
        {
          "name": "cat",
          "title": "分类",
          "type": "enumeration",
          "value": "list:censored",
          "enumOptions": [
            {
              "title": "有碼AV",
              "value": "list:censored"
            },
            {
              "title": "無碼破解",
              "value": "list:reducing-mosaic"
            },
            {
              "title": "中字AV",
              "value": "list:chinese"
            },
            {
              "title": "無碼AV",
              "value": "list:uncensored"
            },
            {
              "title": "素人AV",
              "value": "list:amateurjav"
            },
            {
              "title": "國產影片",
              "value": "list:amateur"
            },
            {
              "title": "韓國直播",
              "value": "list:klive"
            }
          ]
        },
        {
          "name": "page",
          "title": "页码",
          "type": "page",
          "value": "1"
        }
      ]
    },
    {
      "title": "片商",
      "functionName": "loadList",
      "cacheDuration": 180,
      "params": [
        {
          "name": "cat",
          "title": "分类",
          "type": "enumeration",
          "value": "maker:amateurjav:1752",
          "enumOptions": [
            {
              "title": "シロウトTV(SIRO)",
              "value": "maker:amateurjav:1752"
            },
            {
              "title": "ラグジュTV(LUXU)",
              "value": "maker:amateurjav:1586"
            },
            {
              "title": "ナンパTV(200GANA)",
              "value": "maker:amateurjav:1751"
            },
            {
              "title": "PRESTIGE PREMIUM(300MAAN)",
              "value": "maker:amateurjav:1318"
            },
            {
              "title": "S-CUTE",
              "value": "maker:amateurjav:1069"
            },
            {
              "title": "ARA",
              "value": "maker:amateurjav:1585"
            },
            {
              "title": "FC2",
              "value": "maker:uncensored:37"
            },
            {
              "title": "HEYZO",
              "value": "maker:uncensored:17"
            },
            {
              "title": "東京熱(Tokyo Hot)",
              "value": "maker:uncensored:29"
            },
            {
              "title": "一本道(1pondo)",
              "value": "maker:uncensored:32"
            },
            {
              "title": "カリビアンコム(Caribbeancom)",
              "value": "maker:uncensored:30"
            },
            {
              "title": "カリビアンコム PPV(Caribbeancompr)",
              "value": "maker:uncensored:40"
            },
            {
              "title": "天然むすめ(10musume)",
              "value": "maker:uncensored:31"
            },
            {
              "title": "パコパコママ(pacopacomama)",
              "value": "maker:uncensored:36"
            },
            {
              "title": "ガチん娘！(Gachinco)",
              "value": "maker:uncensored:35"
            },
            {
              "title": "エッチな4610",
              "value": "maker:uncensored:34"
            },
            {
              "title": "人妻斬り0930",
              "value": "maker:uncensored:38"
            },
            {
              "title": "エッチな0930",
              "value": "maker:uncensored:39"
            },
            {
              "title": "トリプルエックス (XXX-AV)",
              "value": "maker:uncensored:126"
            }
          ]
        },
        {
          "name": "page",
          "title": "页码",
          "type": "page",
          "value": "1"
        }
      ]
    },
    {
      "title": "有码标签",
      "functionName": "loadList",
      "cacheDuration": 180,
      "params": [
        {
          "name": "cat",
          "title": "分类",
          "type": "enumeration",
          "value": "tag:censored:1",
          "enumOptions": [
            {
              "title": "企畫",
              "value": "tag:censored:1"
            },
            {
              "title": "女同性戀",
              "value": "tag:censored:2"
            },
            {
              "title": "獵豔",
              "value": "tag:censored:3"
            },
            {
              "title": "野外・露出",
              "value": "tag:censored:4"
            },
            {
              "title": "偶像藝人",
              "value": "tag:censored:5"
            },
            {
              "title": "其他戀物癖",
              "value": "tag:censored:6"
            },
            {
              "title": "近親相姦",
              "value": "tag:censored:7"
            },
            {
              "title": "戀乳癖",
              "value": "tag:censored:8"
            },
            {
              "title": "情侶",
              "value": "tag:censored:9"
            },
            {
              "title": "男同性恋",
              "value": "tag:censored:10"
            },
            {
              "title": "花癡",
              "value": "tag:censored:11"
            },
            {
              "title": "偷窥",
              "value": "tag:censored:12"
            },
            {
              "title": "戀腿癖",
              "value": "tag:censored:13"
            },
            {
              "title": "其他",
              "value": "tag:censored:14"
            },
            {
              "title": "性騷擾",
              "value": "tag:censored:15"
            },
            {
              "title": "倒追",
              "value": "tag:censored:16"
            },
            {
              "title": "性奴",
              "value": "tag:censored:17"
            },
            {
              "title": "跳舞",
              "value": "tag:censored:18"
            },
            {
              "title": "雙性人",
              "value": "tag:censored:19"
            },
            {
              "title": "姐妹",
              "value": "tag:censored:20"
            },
            {
              "title": "通姦",
              "value": "tag:censored:21"
            },
            {
              "title": "粗暴",
              "value": "tag:censored:22"
            },
            {
              "title": "學校作品",
              "value": "tag:censored:23"
            },
            {
              "title": "惡作劇",
              "value": "tag:censored:24"
            },
            {
              "title": "妄想",
              "value": "tag:censored:25"
            },
            {
              "title": "殘忍畫面",
              "value": "tag:censored:26"
            },
            {
              "title": "爛醉如泥的",
              "value": "tag:censored:27"
            },
            {
              "title": "處女",
              "value": "tag:censored:28"
            },
            {
              "title": "美容院",
              "value": "tag:censored:29"
            },
            {
              "title": "性感的",
              "value": "tag:censored:30"
            },
            {
              "title": "女同接吻",
              "value": "tag:censored:31"
            },
            {
              "title": "運動",
              "value": "tag:censored:32"
            },
            {
              "title": "瘙癢",
              "value": "tag:censored:33"
            },
            {
              "title": "出軌",
              "value": "tag:censored:34"
            },
            {
              "title": "正太控",
              "value": "tag:censored:35"
            },
            {
              "title": "處男",
              "value": "tag:censored:36"
            },
            {
              "title": "蠻橫嬌羞",
              "value": "tag:censored:37"
            },
            {
              "title": "觸手",
              "value": "tag:censored:38"
            },
            {
              "title": "嘔吐",
              "value": "tag:censored:39"
            },
            {
              "title": "折磨",
              "value": "tag:censored:40"
            },
            {
              "title": "女優ベスト・総集編",
              "value": "tag:censored:42"
            },
            {
              "title": "温泉",
              "value": "tag:censored:43"
            },
            {
              "title": "M男",
              "value": "tag:censored:44"
            },
            {
              "title": "原作コラボ",
              "value": "tag:censored:45"
            },
            {
              "title": "16時間以上作品",
              "value": "tag:censored:46"
            },
            {
              "title": "デカチン・巨根",
              "value": "tag:censored:47"
            },
            {
              "title": "ファン感謝・訪問",
              "value": "tag:censored:48"
            },
            {
              "title": "巨尻",
              "value": "tag:censored:50"
            },
            {
              "title": "ハーレム",
              "value": "tag:censored:51"
            },
            {
              "title": "日焼け",
              "value": "tag:censored:52"
            },
            {
              "title": "早漏",
              "value": "tag:censored:53"
            },
            {
              "title": "キス・接吻",
              "value": "tag:censored:54"
            },
            {
              "title": "汗だく",
              "value": "tag:censored:55"
            },
            {
              "title": "服務生",
              "value": "tag:censored:56"
            },
            {
              "title": "高中女生",
              "value": "tag:censored:57"
            },
            {
              "title": "女主播",
              "value": "tag:censored:58"
            },
            {
              "title": "女生",
              "value": "tag:censored:59"
            },
            {
              "title": "黑人演員",
              "value": "tag:censored:60"
            },
            {
              "title": "蕩婦",
              "value": "tag:censored:61"
            },
            {
              "title": "護士",
              "value": "tag:censored:62"
            },
            {
              "title": "家教",
              "value": "tag:censored:63"
            },
            {
              "title": "母親",
              "value": "tag:censored:64"
            },
            {
              "title": "女教師",
              "value": "tag:censored:65"
            },
            {
              "title": "展場女孩",
              "value": "tag:censored:66"
            },
            {
              "title": "女大學生",
              "value": "tag:censored:67"
            },
            {
              "title": "賽車女郎",
              "value": "tag:censored:68"
            },
            {
              "title": "妓女",
              "value": "tag:censored:69"
            },
            {
              "title": "各種職業",
              "value": "tag:censored:70"
            },
            {
              "title": "女醫生",
              "value": "tag:censored:71"
            },
            {
              "title": "已婚婦女",
              "value": "tag:censored:72"
            },
            {
              "title": "白人",
              "value": "tag:censored:73"
            },
            {
              "title": "千金小姐",
              "value": "tag:censored:74"
            },
            {
              "title": "寡婦",
              "value": "tag:censored:75"
            },
            {
              "title": "車掌小姐",
              "value": "tag:censored:76"
            },
            {
              "title": "格鬥家",
              "value": "tag:censored:77"
            },
            {
              "title": "姐姐",
              "value": "tag:censored:78"
            },
            {
              "title": "新娘、嫩妻",
              "value": "tag:censored:79"
            },
            {
              "title": "美少女",
              "value": "tag:censored:80"
            },
            {
              "title": "秘書",
              "value": "tag:censored:81"
            },
            {
              "title": "模特兒",
              "value": "tag:censored:82"
            },
            {
              "title": "女主人、女老板",
              "value": "tag:censored:83"
            },
            {
              "title": "明星臉",
              "value": "tag:censored:84"
            },
            {
              "title": "女檢察官",
              "value": "tag:censored:85"
            },
            {
              "title": "格鬥家",
              "value": "tag:censored:86"
            },
            {
              "title": "義母",
              "value": "tag:censored:87"
            },
            {
              "title": "講師",
              "value": "tag:censored:88"
            },
            {
              "title": "伴侶",
              "value": "tag:censored:89"
            },
            {
              "title": "亞洲女演員",
              "value": "tag:censored:90"
            },
            {
              "title": "公主",
              "value": "tag:censored:91"
            },
            {
              "title": "童年朋友",
              "value": "tag:censored:92"
            },
            {
              "title": "黑幫成員",
              "value": "tag:censored:93"
            },
            {
              "title": "角色扮演",
              "value": "tag:censored:94"
            },
            {
              "title": "眼鏡",
              "value": "tag:censored:95"
            },
            {
              "title": "泳裝",
              "value": "tag:censored:96"
            },
            {
              "title": "校服",
              "value": "tag:censored:97"
            },
            {
              "title": "迷你裙",
              "value": "tag:censored:98"
            },
            {
              "title": "女樸",
              "value": "tag:censored:99"
            },
            {
              "title": "旗袍",
              "value": "tag:censored:100"
            },
            {
              "title": "學校泳裝",
              "value": "tag:censored:101"
            },
            {
              "title": "水手服",
              "value": "tag:censored:102"
            },
            {
              "title": "內衣",
              "value": "tag:censored:103"
            },
            {
              "title": "體育服",
              "value": "tag:censored:104"
            },
            {
              "title": "和服・喪服",
              "value": "tag:censored:105"
            },
            {
              "title": "OL",
              "value": "tag:censored:106"
            },
            {
              "title": "身體意識",
              "value": "tag:censored:107"
            },
            {
              "title": "連褲襪",
              "value": "tag:censored:108"
            },
            {
              "title": "空中小姐",
              "value": "tag:censored:109"
            },
            {
              "title": "迷你裙警察",
              "value": "tag:censored:110"
            },
            {
              "title": "裸體圍裙",
              "value": "tag:censored:111"
            },
            {
              "title": "緊身衣",
              "value": "tag:censored:112"
            },
            {
              "title": "制服",
              "value": "tag:censored:113"
            },
            {
              "title": "泡泡襪",
              "value": "tag:censored:114"
            },
            {
              "title": "女祭司",
              "value": "tag:censored:115"
            },
            {
              "title": "貓耳女",
              "value": "tag:censored:116"
            },
            {
              "title": "兔女郎",
              "value": "tag:censored:117"
            },
            {
              "title": "猥褻穿著",
              "value": "tag:censored:118"
            },
            {
              "title": "內衣",
              "value": "tag:censored:119"
            },
            {
              "title": "女裝人妖",
              "value": "tag:censored:120"
            },
            {
              "title": "女忍者",
              "value": "tag:censored:121"
            },
            {
              "title": "娃娃",
              "value": "tag:censored:122"
            },
            {
              "title": "及膝襪",
              "value": "tag:censored:123"
            },
            {
              "title": "女戰士",
              "value": "tag:censored:124"
            },
            {
              "title": "角色扮演",
              "value": "tag:censored:126"
            },
            {
              "title": "巨乳",
              "value": "tag:censored:127"
            },
            {
              "title": "貧乳・微乳",
              "value": "tag:censored:128"
            },
            {
              "title": "蘿莉",
              "value": "tag:censored:249"
            },
            {
              "title": "熟女",
              "value": "tag:censored:130"
            },
            {
              "title": "孕婦",
              "value": "tag:censored:131"
            },
            {
              "title": "苗條",
              "value": "tag:censored:132"
            },
            {
              "title": "胖女人",
              "value": "tag:censored:133"
            },
            {
              "title": "無毛",
              "value": "tag:censored:134"
            },
            {
              "title": "變性者",
              "value": "tag:censored:135"
            },
            {
              "title": "高",
              "value": "tag:censored:136"
            },
            {
              "title": "屁股",
              "value": "tag:censored:137"
            },
            {
              "title": "嬌小的",
              "value": "tag:censored:250"
            },
            {
              "title": "乳房",
              "value": "tag:censored:139"
            },
            {
              "title": "肌肉",
              "value": "tag:censored:140"
            },
            {
              "title": "超乳",
              "value": "tag:censored:141"
            },
            {
              "title": "中出",
              "value": "tag:censored:142"
            },
            {
              "title": "顏射",
              "value": "tag:censored:143"
            },
            {
              "title": "自慰",
              "value": "tag:censored:144"
            },
            {
              "title": "顏射",
              "value": "tag:censored:145"
            },
            {
              "title": "肛交",
              "value": "tag:censored:146"
            },
            {
              "title": "吞精",
              "value": "tag:censored:147"
            },
            {
              "title": "打手槍",
              "value": "tag:censored:148"
            },
            {
              "title": "放尿",
              "value": "tag:censored:149"
            },
            {
              "title": "亂交",
              "value": "tag:censored:150"
            },
            {
              "title": "口交",
              "value": "tag:censored:151"
            },
            {
              "title": "飲尿",
              "value": "tag:censored:152"
            },
            {
              "title": "排便",
              "value": "tag:censored:153"
            },
            {
              "title": "乳交",
              "value": "tag:censored:154"
            },
            {
              "title": "潮吹",
              "value": "tag:censored:155"
            },
            {
              "title": "淫語",
              "value": "tag:censored:156"
            },
            {
              "title": "69",
              "value": "tag:censored:157"
            },
            {
              "title": "深喉",
              "value": "tag:censored:158"
            },
            {
              "title": "拳交",
              "value": "tag:censored:159"
            },
            {
              "title": "舔陰",
              "value": "tag:censored:160"
            },
            {
              "title": "騎乗位",
              "value": "tag:censored:161"
            },
            {
              "title": "按摩",
              "value": "tag:censored:162"
            },
            {
              "title": "手指插入",
              "value": "tag:censored:163"
            },
            {
              "title": "母乳",
              "value": "tag:censored:164"
            },
            {
              "title": "足交",
              "value": "tag:censored:165"
            },
            {
              "title": "食糞",
              "value": "tag:censored:166"
            },
            {
              "title": "顏面騎乘",
              "value": "tag:censored:167"
            },
            {
              "title": "肛内中出",
              "value": "tag:censored:168"
            },
            {
              "title": "多P",
              "value": "tag:censored:169"
            },
            {
              "title": "按摩棒",
              "value": "tag:censored:170"
            },
            {
              "title": "緊縛",
              "value": "tag:censored:171"
            },
            {
              "title": "跳蛋",
              "value": "tag:censored:172"
            },
            {
              "title": "玩具",
              "value": "tag:censored:173"
            },
            {
              "title": "糞便",
              "value": "tag:censored:174"
            },
            {
              "title": "SM",
              "value": "tag:censored:175"
            },
            {
              "title": "車震",
              "value": "tag:censored:176"
            },
            {
              "title": "藥物",
              "value": "tag:censored:177"
            },
            {
              "title": "緊縛",
              "value": "tag:censored:179"
            },
            {
              "title": "監禁",
              "value": "tag:censored:180"
            },
            {
              "title": "灌腸",
              "value": "tag:censored:181"
            },
            {
              "title": "鴨嘴",
              "value": "tag:censored:182"
            },
            {
              "title": "插入異物",
              "value": "tag:censored:183"
            },
            {
              "title": "輪姦",
              "value": "tag:censored:184"
            },
            {
              "title": "拘束",
              "value": "tag:censored:185"
            },
            {
              "title": "凌辱",
              "value": "tag:censored:186"
            },
            {
              "title": "羞恥",
              "value": "tag:censored:187"
            },
            {
              "title": "乳液",
              "value": "tag:censored:188"
            },
            {
              "title": "催眠",
              "value": "tag:censored:189"
            },
            {
              "title": "子宮頸",
              "value": "tag:censored:190"
            },
            {
              "title": "女優按摩棒",
              "value": "tag:censored:191"
            },
            {
              "title": "立即口交",
              "value": "tag:censored:192"
            },
            {
              "title": "合集",
              "value": "tag:censored:193"
            },
            {
              "title": "單體作品",
              "value": "tag:censored:194"
            },
            {
              "title": "DMM獨家",
              "value": "tag:censored:195"
            },
            {
              "title": "局部特寫",
              "value": "tag:censored:197"
            },
            {
              "title": "素人",
              "value": "tag:censored:198"
            },
            {
              "title": "第一人稱攝影",
              "value": "tag:censored:199"
            },
            {
              "title": "國外進口",
              "value": "tag:censored:200"
            },
            {
              "title": "纪录片",
              "value": "tag:censored:201"
            },
            {
              "title": "投稿",
              "value": "tag:censored:202"
            },
            {
              "title": "數位馬賽克",
              "value": "tag:censored:203"
            },
            {
              "title": "首次亮相",
              "value": "tag:censored:204"
            },
            {
              "title": "薄馬賽克",
              "value": "tag:censored:206"
            },
            {
              "title": "4小時以上作品",
              "value": "tag:censored:207"
            },
            {
              "title": "介紹影片",
              "value": "tag:censored:208"
            },
            {
              "title": "主觀視角",
              "value": "tag:censored:209"
            },
            {
              "title": "高畫質",
              "value": "tag:censored:210"
            },
            {
              "title": "戀愛",
              "value": "tag:censored:211"
            },
            {
              "title": "戲劇",
              "value": "tag:censored:212"
            },
            {
              "title": "複刻版",
              "value": "tag:censored:213"
            },
            {
              "title": "限時降價",
              "value": "tag:censored:214"
            },
            {
              "title": "故事集",
              "value": "tag:censored:215"
            },
            {
              "title": "特效",
              "value": "tag:censored:216"
            },
            {
              "title": "3D",
              "value": "tag:censored:217"
            },
            {
              "title": "戲劇",
              "value": "tag:censored:218"
            },
            {
              "title": "教學",
              "value": "tag:censored:222"
            },
            {
              "title": "給女性觀眾",
              "value": "tag:censored:223"
            },
            {
              "title": "恐怖",
              "value": "tag:censored:224"
            },
            {
              "title": "合作作品",
              "value": "tag:censored:225"
            }
          ]
        },
        {
          "name": "page",
          "title": "页码",
          "type": "page",
          "value": "1"
        }
      ]
    },
    {
      "title": "素人标签",
      "functionName": "loadList",
      "cacheDuration": 180,
      "params": [
        {
          "name": "cat",
          "title": "分类",
          "type": "enumeration",
          "value": "tag:amateurjav:3",
          "enumOptions": [
            {
              "title": "花癡",
              "value": "tag:amateurjav:3"
            },
            {
              "title": "獵豔、搭訕",
              "value": "tag:amateurjav:4"
            },
            {
              "title": "美容按摩",
              "value": "tag:amateurjav:19"
            },
            {
              "title": "情侶",
              "value": "tag:amateurjav:21"
            },
            {
              "title": "風俗",
              "value": "tag:amateurjav:55"
            },
            {
              "title": "企畫",
              "value": "tag:amateurjav:24"
            },
            {
              "title": "偷窥",
              "value": "tag:amateurjav:27"
            },
            {
              "title": "通姦",
              "value": "tag:amateurjav:32"
            },
            {
              "title": "女同性戀",
              "value": "tag:amateurjav:36"
            },
            {
              "title": "處男",
              "value": "tag:amateurjav:43"
            },
            {
              "title": "近親相姦",
              "value": "tag:amateurjav:48"
            },
            {
              "title": "汗だく",
              "value": "tag:amateurjav:58"
            },
            {
              "title": "奴隷",
              "value": "tag:amateurjav:80"
            },
            {
              "title": "デカチン・巨根",
              "value": "tag:amateurjav:81"
            },
            {
              "title": "野外・露出",
              "value": "tag:amateurjav:86"
            },
            {
              "title": "鬼畜",
              "value": "tag:amateurjav:102"
            },
            {
              "title": "巨尻",
              "value": "tag:amateurjav:115"
            },
            {
              "title": "倒追",
              "value": "tag:amateurjav:121"
            },
            {
              "title": "運動",
              "value": "tag:amateurjav:127"
            },
            {
              "title": "温泉",
              "value": "tag:amateurjav:128"
            },
            {
              "title": "姐妹",
              "value": "tag:amateurjav:130"
            },
            {
              "title": "處女",
              "value": "tag:amateurjav:133"
            },
            {
              "title": "爛醉如泥的",
              "value": "tag:amateurjav:143"
            },
            {
              "title": "偶像藝人",
              "value": "tag:amateurjav:160"
            },
            {
              "title": "出軌",
              "value": "tag:amateurjav:169"
            },
            {
              "title": "日焼け",
              "value": "tag:amateurjav:187"
            },
            {
              "title": "金髪・ブロンド",
              "value": "tag:amateurjav:73"
            },
            {
              "title": "淫亂",
              "value": "tag:amateurjav:147"
            },
            {
              "title": "人妻",
              "value": "tag:amateurjav:5"
            },
            {
              "title": "女生",
              "value": "tag:amateurjav:6"
            },
            {
              "title": "高中女生",
              "value": "tag:amateurjav:13"
            },
            {
              "title": "痴女",
              "value": "tag:amateurjav:23"
            },
            {
              "title": "女大學生",
              "value": "tag:amateurjav:29"
            },
            {
              "title": "新娘、嫩妻",
              "value": "tag:amateurjav:31"
            },
            {
              "title": "姐姐",
              "value": "tag:amateurjav:35"
            },
            {
              "title": "各種職業",
              "value": "tag:amateurjav:39"
            },
            {
              "title": "妓女",
              "value": "tag:amateurjav:46"
            },
            {
              "title": "美少女",
              "value": "tag:amateurjav:53"
            },
            {
              "title": "女教師",
              "value": "tag:amateurjav:59"
            },
            {
              "title": "護士",
              "value": "tag:amateurjav:75"
            },
            {
              "title": "千金小姐",
              "value": "tag:amateurjav:76"
            },
            {
              "title": "模特兒",
              "value": "tag:amateurjav:175"
            },
            {
              "title": "女主播",
              "value": "tag:amateurjav:183"
            },
            {
              "title": "教練",
              "value": "tag:amateurjav:186"
            },
            {
              "title": "伴侶",
              "value": "tag:amateurjav:195"
            },
            {
              "title": "空姐・CA",
              "value": "tag:amateurjav:93"
            },
            {
              "title": "角色扮演",
              "value": "tag:amateurjav:9"
            },
            {
              "title": "和服・浴衣",
              "value": "tag:amateurjav:68"
            },
            {
              "title": "OL",
              "value": "tag:amateurjav:26"
            },
            {
              "title": "制服",
              "value": "tag:amateurjav:60"
            },
            {
              "title": "迷你裙",
              "value": "tag:amateurjav:65"
            },
            {
              "title": "女僕",
              "value": "tag:amateurjav:69"
            },
            {
              "title": "內衣",
              "value": "tag:amateurjav:70"
            },
            {
              "title": "泳裝",
              "value": "tag:amateurjav:101"
            },
            {
              "title": "及膝襪",
              "value": "tag:amateurjav:113"
            },
            {
              "title": "眼鏡",
              "value": "tag:amateurjav:120"
            },
            {
              "title": "學校泳裝",
              "value": "tag:amateurjav:126"
            },
            {
              "title": "乳房",
              "value": "tag:amateurjav:8"
            },
            {
              "title": "苗條",
              "value": "tag:amateurjav:11"
            },
            {
              "title": "熟女",
              "value": "tag:amateurjav:17"
            },
            {
              "title": "巨乳",
              "value": "tag:amateurjav:33"
            },
            {
              "title": "爆乳",
              "value": "tag:amateurjav:85"
            },
            {
              "title": "屁股",
              "value": "tag:amateurjav:54"
            },
            {
              "title": "無毛",
              "value": "tag:amateurjav:89"
            },
            {
              "title": "貧乳・微乳",
              "value": "tag:amateurjav:90"
            },
            {
              "title": "高",
              "value": "tag:amateurjav:119"
            },
            {
              "title": "胖女人",
              "value": "tag:amateurjav:129"
            },
            {
              "title": "童顔",
              "value": "tag:amateurjav:49"
            },
            {
              "title": "D杯",
              "value": "tag:amateurjav:231"
            },
            {
              "title": "E杯",
              "value": "tag:amateurjav:226"
            },
            {
              "title": "F杯",
              "value": "tag:amateurjav:229"
            },
            {
              "title": "G杯",
              "value": "tag:amateurjav:230"
            },
            {
              "title": "H杯",
              "value": "tag:amateurjav:222"
            },
            {
              "title": "口内発射",
              "value": "tag:amateurjav:125"
            },
            {
              "title": "中出",
              "value": "tag:amateurjav:15"
            },
            {
              "title": "自慰",
              "value": "tag:amateurjav:16"
            },
            {
              "title": "打手槍",
              "value": "tag:amateurjav:18"
            },
            {
              "title": "顏射",
              "value": "tag:amateurjav:25"
            },
            {
              "title": "潮吹",
              "value": "tag:amateurjav:34"
            },
            {
              "title": "乳交",
              "value": "tag:amateurjav:40"
            },
            {
              "title": "亂交",
              "value": "tag:amateurjav:57"
            },
            {
              "title": "深喉",
              "value": "tag:amateurjav:62"
            },
            {
              "title": "肛交",
              "value": "tag:amateurjav:79"
            },
            {
              "title": "顏射",
              "value": "tag:amateurjav:88"
            },
            {
              "title": "顏面騎乘",
              "value": "tag:amateurjav:95"
            },
            {
              "title": "足交",
              "value": "tag:amateurjav:104"
            },
            {
              "title": "母乳",
              "value": "tag:amateurjav:161"
            },
            {
              "title": "吞精",
              "value": "tag:amateurjav:181"
            },
            {
              "title": "放尿・失禁",
              "value": "tag:amateurjav:37"
            },
            {
              "title": "羞恥・辱め",
              "value": "tag:amateurjav:42"
            },
            {
              "title": "女優按摩棒",
              "value": "tag:amateurjav:7"
            },
            {
              "title": "拘束",
              "value": "tag:amateurjav:14"
            },
            {
              "title": "按摩棒",
              "value": "tag:amateurjav:38"
            },
            {
              "title": "SM",
              "value": "tag:amateurjav:50"
            },
            {
              "title": "車震",
              "value": "tag:amateurjav:51"
            },
            {
              "title": "立即口交",
              "value": "tag:amateurjav:64"
            },
            {
              "title": "多P",
              "value": "tag:amateurjav:108"
            },
            {
              "title": "輪姦",
              "value": "tag:amateurjav:123"
            },
            {
              "title": "乳液・油",
              "value": "tag:amateurjav:56"
            },
            {
              "title": "藥物・壯陽藥",
              "value": "tag:amateurjav:72"
            },
            {
              "title": "素人",
              "value": "tag:amateurjav:1"
            },
            {
              "title": "配信専用素人",
              "value": "tag:amateurjav:106"
            },
            {
              "title": "短髮",
              "value": "tag:amateurjav:228"
            },
            {
              "title": "清楚",
              "value": "tag:amateurjav:145"
            },
            {
              "title": "美腳",
              "value": "tag:amateurjav:66"
            },
            {
              "title": "美尻",
              "value": "tag:amateurjav:67"
            },
            {
              "title": "手マン",
              "value": "tag:amateurjav:103"
            },
            {
              "title": "初撮り",
              "value": "tag:amateurjav:78"
            },
            {
              "title": "纪录片",
              "value": "tag:amateurjav:2"
            },
            {
              "title": "高清(HD)",
              "value": "tag:amateurjav:61"
            },
            {
              "title": "第一人稱攝影",
              "value": "tag:amateurjav:10"
            },
            {
              "title": "單體作品",
              "value": "tag:amateurjav:44"
            },
            {
              "title": "主觀視角",
              "value": "tag:amateurjav:52"
            },
            {
              "title": "國外進口",
              "value": "tag:amateurjav:74"
            },
            {
              "title": "投稿",
              "value": "tag:amateurjav:132"
            },
            {
              "title": "獨家",
              "value": "tag:amateurjav:216"
            },
            {
              "title": "新登場メーカー",
              "value": "tag:amateurjav:246"
            }
          ]
        },
        {
          "name": "page",
          "title": "页码",
          "type": "page",
          "value": "1"
        }
      ]
    }
  ],
  "search": {
    "title": "搜索",
    "functionName": "search",
    "params": [
      {
        "name": "keyword",
        "title": "关键词",
        "type": "input"
      },
      {
        "name": "page",
        "title": "页码",
        "type": "page"
      }
    ]
  }
};

var CATS_DATA = [{"type_id":"list:censored","type_name":"有碼AV"},{"type_id":"list:reducing-mosaic","type_name":"無碼破解"},{"type_id":"list:chinese","type_name":"中字AV"},{"type_id":"list:uncensored","type_name":"無碼AV"},{"type_id":"list:amateurjav","type_name":"素人AV"},{"type_id":"list:amateur","type_name":"國產影片"},{"type_id":"list:klive","type_name":"韓國直播"},{"type_id":"maker:amateurjav:1752","type_name":"シロウトTV(SIRO)","arg":"シロウトTV(SIRO)"},{"type_id":"maker:amateurjav:1586","type_name":"ラグジュTV(LUXU)","arg":"ラグジュTV(LUXU)"},{"type_id":"maker:amateurjav:1751","type_name":"ナンパTV(200GANA)","arg":"ナンパTV(200GANA)"},{"type_id":"maker:amateurjav:1318","type_name":"PRESTIGE PREMIUM(300MAAN)","arg":"PRESTIGE PREMIUM(300MAAN)"},{"type_id":"maker:amateurjav:1069","type_name":"S-CUTE","arg":"S-CUTE"},{"type_id":"maker:amateurjav:1585","type_name":"ARA","arg":"ARA"},{"type_id":"maker:uncensored:37","type_name":"FC2","arg":"FC2"},{"type_id":"maker:uncensored:17","type_name":"HEYZO","arg":"HEYZO"},{"type_id":"maker:uncensored:29","type_name":"東京熱(Tokyo Hot)","arg":"東京熱(Tokyo Hot)"},{"type_id":"maker:uncensored:32","type_name":"一本道(1pondo)","arg":"一本道(1pondo)"},{"type_id":"maker:uncensored:30","type_name":"カリビアンコム(Caribbeancom)","arg":"カリビアンコム(Caribbeancom)"},{"type_id":"maker:uncensored:40","type_name":"カリビアンコム PPV(Caribbeancompr)","arg":"カリビアンコムPPV(Caribbeancompr)"},{"type_id":"maker:uncensored:31","type_name":"天然むすめ(10musume)","arg":"天然むすめ(10musume)"},{"type_id":"maker:uncensored:36","type_name":"パコパコママ(pacopacomama)","arg":"パコパコママ(pacopacomama)"},{"type_id":"maker:uncensored:35","type_name":"ガチん娘！(Gachinco)","arg":"ガチん娘！(Gachinco)"},{"type_id":"maker:uncensored:34","type_name":"エッチな4610","arg":"エッチな4610"},{"type_id":"maker:uncensored:38","type_name":"人妻斬り0930","arg":"人妻斬り0930"},{"type_id":"maker:uncensored:39","type_name":"エッチな0930","arg":"エッチな0930"},{"type_id":"maker:uncensored:126","type_name":"トリプルエックス (XXX-AV)","arg":"トリプルエックス (XXX-AV)"},{"type_id":"tag:censored:1","type_name":"企畫","arg":"企畫"},{"type_id":"tag:censored:2","type_name":"女同性戀","arg":"女同性戀"},{"type_id":"tag:censored:3","type_name":"獵豔","arg":"獵豔"},{"type_id":"tag:censored:4","type_name":"野外・露出","arg":"野外・露出"},{"type_id":"tag:censored:5","type_name":"偶像藝人","arg":"偶像藝人"},{"type_id":"tag:censored:6","type_name":"其他戀物癖","arg":"其他戀物癖"},{"type_id":"tag:censored:7","type_name":"近親相姦","arg":"近親相姦"},{"type_id":"tag:censored:8","type_name":"戀乳癖","arg":"戀乳癖"},{"type_id":"tag:censored:9","type_name":"情侶","arg":"情侶"},{"type_id":"tag:censored:10","type_name":"男同性恋","arg":"男同性恋"},{"type_id":"tag:censored:11","type_name":"花癡","arg":"花癡"},{"type_id":"tag:censored:12","type_name":"偷窥","arg":"偷窥"},{"type_id":"tag:censored:13","type_name":"戀腿癖","arg":"戀腿癖"},{"type_id":"tag:censored:14","type_name":"其他","arg":"其他"},{"type_id":"tag:censored:15","type_name":"性騷擾","arg":"性騷擾"},{"type_id":"tag:censored:16","type_name":"倒追","arg":"倒追"},{"type_id":"tag:censored:17","type_name":"性奴","arg":"性奴"},{"type_id":"tag:censored:18","type_name":"跳舞","arg":"跳舞"},{"type_id":"tag:censored:19","type_name":"雙性人","arg":"雙性人"},{"type_id":"tag:censored:20","type_name":"姐妹","arg":"姐妹"},{"type_id":"tag:censored:21","type_name":"通姦","arg":"通姦"},{"type_id":"tag:censored:22","type_name":"粗暴","arg":"粗暴"},{"type_id":"tag:censored:23","type_name":"學校作品","arg":"學校作品"},{"type_id":"tag:censored:24","type_name":"惡作劇","arg":"惡作劇"},{"type_id":"tag:censored:25","type_name":"妄想","arg":"妄想"},{"type_id":"tag:censored:26","type_name":"殘忍畫面","arg":"殘忍畫面"},{"type_id":"tag:censored:27","type_name":"爛醉如泥的","arg":"爛醉如泥的"},{"type_id":"tag:censored:28","type_name":"處女","arg":"處女"},{"type_id":"tag:censored:29","type_name":"美容院","arg":"美容院"},{"type_id":"tag:censored:30","type_name":"性感的","arg":"性感的"},{"type_id":"tag:censored:31","type_name":"女同接吻","arg":"女同接吻"},{"type_id":"tag:censored:32","type_name":"運動","arg":"運動"},{"type_id":"tag:censored:33","type_name":"瘙癢","arg":"瘙癢"},{"type_id":"tag:censored:34","type_name":"出軌","arg":"出軌"},{"type_id":"tag:censored:35","type_name":"正太控","arg":"正太控"},{"type_id":"tag:censored:36","type_name":"處男","arg":"處男"},{"type_id":"tag:censored:37","type_name":"蠻橫嬌羞","arg":"蠻橫嬌羞"},{"type_id":"tag:censored:38","type_name":"觸手","arg":"觸手"},{"type_id":"tag:censored:39","type_name":"嘔吐","arg":"嘔吐"},{"type_id":"tag:censored:40","type_name":"折磨","arg":"折磨"},{"type_id":"tag:censored:42","type_name":"女優ベスト・総集編","arg":"女優ベスト・総集編"},{"type_id":"tag:censored:43","type_name":"温泉","arg":"温泉"},{"type_id":"tag:censored:44","type_name":"M男","arg":"M男"},{"type_id":"tag:censored:45","type_name":"原作コラボ","arg":"原作コラボ"},{"type_id":"tag:censored:46","type_name":"16時間以上作品","arg":"16時間以上作品"},{"type_id":"tag:censored:47","type_name":"デカチン・巨根","arg":"デカチン・巨根"},{"type_id":"tag:censored:48","type_name":"ファン感謝・訪問","arg":"ファン感謝・訪問"},{"type_id":"tag:censored:50","type_name":"巨尻","arg":"巨尻"},{"type_id":"tag:censored:51","type_name":"ハーレム","arg":"ハーレム"},{"type_id":"tag:censored:52","type_name":"日焼け","arg":"日焼け"},{"type_id":"tag:censored:53","type_name":"早漏","arg":"早漏"},{"type_id":"tag:censored:54","type_name":"キス・接吻","arg":"キス・接吻"},{"type_id":"tag:censored:55","type_name":"汗だく","arg":"汗だく"},{"type_id":"tag:censored:56","type_name":"服務生","arg":"服務生"},{"type_id":"tag:censored:57","type_name":"高中女生","arg":"高中女生"},{"type_id":"tag:censored:58","type_name":"女主播","arg":"女主播"},{"type_id":"tag:censored:59","type_name":"女生","arg":"女生"},{"type_id":"tag:censored:60","type_name":"黑人演員","arg":"黑人演員"},{"type_id":"tag:censored:61","type_name":"蕩婦","arg":"蕩婦"},{"type_id":"tag:censored:62","type_name":"護士","arg":"護士"},{"type_id":"tag:censored:63","type_name":"家教","arg":"家教"},{"type_id":"tag:censored:64","type_name":"母親","arg":"母親"},{"type_id":"tag:censored:65","type_name":"女教師","arg":"女教師"},{"type_id":"tag:censored:66","type_name":"展場女孩","arg":"展場女孩"},{"type_id":"tag:censored:67","type_name":"女大學生","arg":"女大學生"},{"type_id":"tag:censored:68","type_name":"賽車女郎","arg":"賽車女郎"},{"type_id":"tag:censored:69","type_name":"妓女","arg":"妓女"},{"type_id":"tag:censored:70","type_name":"各種職業","arg":"各種職業"},{"type_id":"tag:censored:71","type_name":"女醫生","arg":"女醫生"},{"type_id":"tag:censored:72","type_name":"已婚婦女","arg":"已婚婦女"},{"type_id":"tag:censored:73","type_name":"白人","arg":"白人"},{"type_id":"tag:censored:74","type_name":"千金小姐","arg":"千金小姐"},{"type_id":"tag:censored:75","type_name":"寡婦","arg":"寡婦"},{"type_id":"tag:censored:76","type_name":"車掌小姐","arg":"車掌小姐"},{"type_id":"tag:censored:77","type_name":"格鬥家","arg":"格鬥家"},{"type_id":"tag:censored:78","type_name":"姐姐","arg":"姐姐"},{"type_id":"tag:censored:79","type_name":"新娘、嫩妻","arg":"新娘、嫩妻"},{"type_id":"tag:censored:80","type_name":"美少女","arg":"美少女"},{"type_id":"tag:censored:81","type_name":"秘書","arg":"秘書"},{"type_id":"tag:censored:82","type_name":"模特兒","arg":"模特兒"},{"type_id":"tag:censored:83","type_name":"女主人、女老板","arg":"女主人、女老板"},{"type_id":"tag:censored:84","type_name":"明星臉","arg":"明星臉"},{"type_id":"tag:censored:85","type_name":"女檢察官","arg":"女檢察官"},{"type_id":"tag:censored:86","type_name":"格鬥家","arg":"格鬥家"},{"type_id":"tag:censored:87","type_name":"義母","arg":"義母"},{"type_id":"tag:censored:88","type_name":"講師","arg":"講師"},{"type_id":"tag:censored:89","type_name":"伴侶","arg":"伴侶"},{"type_id":"tag:censored:90","type_name":"亞洲女演員","arg":"亞洲女演員"},{"type_id":"tag:censored:91","type_name":"公主","arg":"公主"},{"type_id":"tag:censored:92","type_name":"童年朋友","arg":"童年朋友"},{"type_id":"tag:censored:93","type_name":"黑幫成員","arg":"黑幫成員"},{"type_id":"tag:censored:94","type_name":"角色扮演","arg":"角色扮演"},{"type_id":"tag:censored:95","type_name":"眼鏡","arg":"眼鏡"},{"type_id":"tag:censored:96","type_name":"泳裝","arg":"泳裝"},{"type_id":"tag:censored:97","type_name":"校服","arg":"校服"},{"type_id":"tag:censored:98","type_name":"迷你裙","arg":"迷你裙"},{"type_id":"tag:censored:99","type_name":"女樸","arg":"女樸"},{"type_id":"tag:censored:100","type_name":"旗袍","arg":"旗袍"},{"type_id":"tag:censored:101","type_name":"學校泳裝","arg":"學校泳裝"},{"type_id":"tag:censored:102","type_name":"水手服","arg":"水手服"},{"type_id":"tag:censored:103","type_name":"內衣","arg":"內衣"},{"type_id":"tag:censored:104","type_name":"體育服","arg":"體育服"},{"type_id":"tag:censored:105","type_name":"和服・喪服","arg":"和服・喪服"},{"type_id":"tag:censored:106","type_name":"OL","arg":"OL"},{"type_id":"tag:censored:107","type_name":"身體意識","arg":"身體意識"},{"type_id":"tag:censored:108","type_name":"連褲襪","arg":"連褲襪"},{"type_id":"tag:censored:109","type_name":"空中小姐","arg":"空中小姐"},{"type_id":"tag:censored:110","type_name":"迷你裙警察","arg":"迷你裙警察"},{"type_id":"tag:censored:111","type_name":"裸體圍裙","arg":"裸體圍裙"},{"type_id":"tag:censored:112","type_name":"緊身衣","arg":"緊身衣"},{"type_id":"tag:censored:113","type_name":"制服","arg":"制服"},{"type_id":"tag:censored:114","type_name":"泡泡襪","arg":"泡泡襪"},{"type_id":"tag:censored:115","type_name":"女祭司","arg":"女祭司"},{"type_id":"tag:censored:116","type_name":"貓耳女","arg":"貓耳女"},{"type_id":"tag:censored:117","type_name":"兔女郎","arg":"兔女郎"},{"type_id":"tag:censored:118","type_name":"猥褻穿著","arg":"猥褻穿著"},{"type_id":"tag:censored:119","type_name":"內衣","arg":"內衣"},{"type_id":"tag:censored:120","type_name":"女裝人妖","arg":"女裝人妖"},{"type_id":"tag:censored:121","type_name":"女忍者","arg":"女忍者"},{"type_id":"tag:censored:122","type_name":"娃娃","arg":"娃娃"},{"type_id":"tag:censored:123","type_name":"及膝襪","arg":"及膝襪"},{"type_id":"tag:censored:124","type_name":"女戰士","arg":"女戰士"},{"type_id":"tag:censored:126","type_name":"角色扮演","arg":"角色扮演"},{"type_id":"tag:censored:127","type_name":"巨乳","arg":"巨乳"},{"type_id":"tag:censored:128","type_name":"貧乳・微乳","arg":"貧乳・微乳"},{"type_id":"tag:censored:249","type_name":"蘿莉","arg":"蘿莉"},{"type_id":"tag:censored:130","type_name":"熟女","arg":"熟女"},{"type_id":"tag:censored:131","type_name":"孕婦","arg":"孕婦"},{"type_id":"tag:censored:132","type_name":"苗條","arg":"苗條"},{"type_id":"tag:censored:133","type_name":"胖女人","arg":"胖女人"},{"type_id":"tag:censored:134","type_name":"無毛","arg":"無毛"},{"type_id":"tag:censored:135","type_name":"變性者","arg":"變性者"},{"type_id":"tag:censored:136","type_name":"高","arg":"高"},{"type_id":"tag:censored:137","type_name":"屁股","arg":"屁股"},{"type_id":"tag:censored:250","type_name":"嬌小的","arg":"嬌小的"},{"type_id":"tag:censored:139","type_name":"乳房","arg":"乳房"},{"type_id":"tag:censored:140","type_name":"肌肉","arg":"肌肉"},{"type_id":"tag:censored:141","type_name":"超乳","arg":"超乳"},{"type_id":"tag:censored:142","type_name":"中出","arg":"中出"},{"type_id":"tag:censored:143","type_name":"顏射","arg":"顏射"},{"type_id":"tag:censored:144","type_name":"自慰","arg":"自慰"},{"type_id":"tag:censored:145","type_name":"顏射","arg":"顏射"},{"type_id":"tag:censored:146","type_name":"肛交","arg":"肛交"},{"type_id":"tag:censored:147","type_name":"吞精","arg":"吞精"},{"type_id":"tag:censored:148","type_name":"打手槍","arg":"打手槍"},{"type_id":"tag:censored:149","type_name":"放尿","arg":"放尿"},{"type_id":"tag:censored:150","type_name":"亂交","arg":"亂交"},{"type_id":"tag:censored:151","type_name":"口交","arg":"口交"},{"type_id":"tag:censored:152","type_name":"飲尿","arg":"飲尿"},{"type_id":"tag:censored:153","type_name":"排便","arg":"排便"},{"type_id":"tag:censored:154","type_name":"乳交","arg":"乳交"},{"type_id":"tag:censored:155","type_name":"潮吹","arg":"潮吹"},{"type_id":"tag:censored:156","type_name":"淫語","arg":"淫語"},{"type_id":"tag:censored:157","type_name":"69","arg":"69"},{"type_id":"tag:censored:158","type_name":"深喉","arg":"深喉"},{"type_id":"tag:censored:159","type_name":"拳交","arg":"拳交"},{"type_id":"tag:censored:160","type_name":"舔陰","arg":"舔陰"},{"type_id":"tag:censored:161","type_name":"騎乗位","arg":"騎乗位"},{"type_id":"tag:censored:162","type_name":"按摩","arg":"按摩"},{"type_id":"tag:censored:163","type_name":"手指插入","arg":"手指插入"},{"type_id":"tag:censored:164","type_name":"母乳","arg":"母乳"},{"type_id":"tag:censored:165","type_name":"足交","arg":"足交"},{"type_id":"tag:censored:166","type_name":"食糞","arg":"食糞"},{"type_id":"tag:censored:167","type_name":"顏面騎乘","arg":"顏面騎乘"},{"type_id":"tag:censored:168","type_name":"肛内中出","arg":"肛内中出"},{"type_id":"tag:censored:169","type_name":"多P","arg":"多P"},{"type_id":"tag:censored:170","type_name":"按摩棒","arg":"按摩棒"},{"type_id":"tag:censored:171","type_name":"緊縛","arg":"緊縛"},{"type_id":"tag:censored:172","type_name":"跳蛋","arg":"跳蛋"},{"type_id":"tag:censored:173","type_name":"玩具","arg":"玩具"},{"type_id":"tag:censored:174","type_name":"糞便","arg":"糞便"},{"type_id":"tag:censored:175","type_name":"SM","arg":"SM"},{"type_id":"tag:censored:176","type_name":"車震","arg":"車震"},{"type_id":"tag:censored:177","type_name":"藥物","arg":"藥物"},{"type_id":"tag:censored:179","type_name":"緊縛","arg":"緊縛"},{"type_id":"tag:censored:180","type_name":"監禁","arg":"監禁"},{"type_id":"tag:censored:181","type_name":"灌腸","arg":"灌腸"},{"type_id":"tag:censored:182","type_name":"鴨嘴","arg":"鴨嘴"},{"type_id":"tag:censored:183","type_name":"插入異物","arg":"插入異物"},{"type_id":"tag:censored:184","type_name":"輪姦","arg":"輪姦"},{"type_id":"tag:censored:185","type_name":"拘束","arg":"拘束"},{"type_id":"tag:censored:186","type_name":"凌辱","arg":"凌辱"},{"type_id":"tag:censored:187","type_name":"羞恥","arg":"羞恥"},{"type_id":"tag:censored:188","type_name":"乳液","arg":"乳液"},{"type_id":"tag:censored:189","type_name":"催眠","arg":"催眠"},{"type_id":"tag:censored:190","type_name":"子宮頸","arg":"子宮頸"},{"type_id":"tag:censored:191","type_name":"女優按摩棒","arg":"女優按摩棒"},{"type_id":"tag:censored:192","type_name":"立即口交","arg":"立即口交"},{"type_id":"tag:censored:193","type_name":"合集","arg":"合集"},{"type_id":"tag:censored:194","type_name":"單體作品","arg":"單體作品"},{"type_id":"tag:censored:195","type_name":"DMM獨家","arg":"DMM獨家"},{"type_id":"tag:censored:197","type_name":"局部特寫","arg":"局部特寫"},{"type_id":"tag:censored:198","type_name":"素人","arg":"素人"},{"type_id":"tag:censored:199","type_name":"第一人稱攝影","arg":"第一人稱攝影"},{"type_id":"tag:censored:200","type_name":"國外進口","arg":"國外進口"},{"type_id":"tag:censored:201","type_name":"纪录片","arg":"纪录片"},{"type_id":"tag:censored:202","type_name":"投稿","arg":"投稿"},{"type_id":"tag:censored:203","type_name":"數位馬賽克","arg":"數位馬賽克"},{"type_id":"tag:censored:204","type_name":"首次亮相","arg":"首次亮相"},{"type_id":"tag:censored:206","type_name":"薄馬賽克","arg":"薄馬賽克"},{"type_id":"tag:censored:207","type_name":"4小時以上作品","arg":"4小時以上作品"},{"type_id":"tag:censored:208","type_name":"介紹影片","arg":"介紹影片"},{"type_id":"tag:censored:209","type_name":"主觀視角","arg":"主觀視角"},{"type_id":"tag:censored:210","type_name":"高畫質","arg":"高畫質"},{"type_id":"tag:censored:211","type_name":"戀愛","arg":"戀愛"},{"type_id":"tag:censored:212","type_name":"戲劇","arg":"戲劇"},{"type_id":"tag:censored:213","type_name":"複刻版","arg":"複刻版"},{"type_id":"tag:censored:214","type_name":"限時降價","arg":"限時降價"},{"type_id":"tag:censored:215","type_name":"故事集","arg":"故事集"},{"type_id":"tag:censored:216","type_name":"特效","arg":"特效"},{"type_id":"tag:censored:217","type_name":"3D","arg":"3D"},{"type_id":"tag:censored:218","type_name":"戲劇","arg":"戲劇"},{"type_id":"tag:censored:222","type_name":"教學","arg":"教學"},{"type_id":"tag:censored:223","type_name":"給女性觀眾","arg":"給女性觀眾"},{"type_id":"tag:censored:224","type_name":"恐怖","arg":"恐怖"},{"type_id":"tag:censored:225","type_name":"合作作品","arg":"合作作品"},{"type_id":"tag:amateurjav:3","type_name":"花癡","arg":"花癡"},{"type_id":"tag:amateurjav:4","type_name":"獵豔、搭訕","arg":"獵豔、搭訕"},{"type_id":"tag:amateurjav:19","type_name":"美容按摩","arg":"美容按摩"},{"type_id":"tag:amateurjav:21","type_name":"情侶","arg":"情侶"},{"type_id":"tag:amateurjav:55","type_name":"風俗","arg":"風俗"},{"type_id":"tag:amateurjav:24","type_name":"企畫","arg":"企畫"},{"type_id":"tag:amateurjav:27","type_name":"偷窥","arg":"偷窥"},{"type_id":"tag:amateurjav:32","type_name":"通姦","arg":"通姦"},{"type_id":"tag:amateurjav:36","type_name":"女同性戀","arg":"女同性戀"},{"type_id":"tag:amateurjav:43","type_name":"處男","arg":"處男"},{"type_id":"tag:amateurjav:48","type_name":"近親相姦","arg":"近親相姦"},{"type_id":"tag:amateurjav:58","type_name":"汗だく","arg":"汗だく"},{"type_id":"tag:amateurjav:80","type_name":"奴隷","arg":"奴隷"},{"type_id":"tag:amateurjav:81","type_name":"デカチン・巨根","arg":"デカチン・巨根"},{"type_id":"tag:amateurjav:86","type_name":"野外・露出","arg":"野外・露出"},{"type_id":"tag:amateurjav:102","type_name":"鬼畜","arg":"鬼畜"},{"type_id":"tag:amateurjav:115","type_name":"巨尻","arg":"巨尻"},{"type_id":"tag:amateurjav:121","type_name":"倒追","arg":"倒追"},{"type_id":"tag:amateurjav:127","type_name":"運動","arg":"運動"},{"type_id":"tag:amateurjav:128","type_name":"温泉","arg":"温泉"},{"type_id":"tag:amateurjav:130","type_name":"姐妹","arg":"姐妹"},{"type_id":"tag:amateurjav:133","type_name":"處女","arg":"處女"},{"type_id":"tag:amateurjav:143","type_name":"爛醉如泥的","arg":"爛醉如泥的"},{"type_id":"tag:amateurjav:160","type_name":"偶像藝人","arg":"偶像藝人"},{"type_id":"tag:amateurjav:169","type_name":"出軌","arg":"出軌"},{"type_id":"tag:amateurjav:187","type_name":"日焼け","arg":"日焼け"},{"type_id":"tag:amateurjav:73","type_name":"金髪・ブロンド","arg":"金髪・ブロンド"},{"type_id":"tag:amateurjav:147","type_name":"淫亂","arg":"淫亂"},{"type_id":"tag:amateurjav:5","type_name":"人妻","arg":"人妻"},{"type_id":"tag:amateurjav:6","type_name":"女生","arg":"女生"},{"type_id":"tag:amateurjav:13","type_name":"高中女生","arg":"高中女生"},{"type_id":"tag:amateurjav:23","type_name":"痴女","arg":"痴女"},{"type_id":"tag:amateurjav:29","type_name":"女大學生","arg":"女大學生"},{"type_id":"tag:amateurjav:31","type_name":"新娘、嫩妻","arg":"新娘、嫩妻"},{"type_id":"tag:amateurjav:35","type_name":"姐姐","arg":"姐姐"},{"type_id":"tag:amateurjav:39","type_name":"各種職業","arg":"各種職業"},{"type_id":"tag:amateurjav:46","type_name":"妓女","arg":"妓女"},{"type_id":"tag:amateurjav:53","type_name":"美少女","arg":"美少女"},{"type_id":"tag:amateurjav:59","type_name":"女教師","arg":"女教師"},{"type_id":"tag:amateurjav:75","type_name":"護士","arg":"護士"},{"type_id":"tag:amateurjav:76","type_name":"千金小姐","arg":"千金小姐"},{"type_id":"tag:amateurjav:175","type_name":"模特兒","arg":"模特兒"},{"type_id":"tag:amateurjav:183","type_name":"女主播","arg":"女主播"},{"type_id":"tag:amateurjav:186","type_name":"教練","arg":"教練"},{"type_id":"tag:amateurjav:195","type_name":"伴侶","arg":"伴侶"},{"type_id":"tag:amateurjav:93","type_name":"空姐・CA","arg":"空姐・CA"},{"type_id":"tag:amateurjav:9","type_name":"角色扮演","arg":"角色扮演"},{"type_id":"tag:amateurjav:68","type_name":"和服・浴衣","arg":"和服・浴衣"},{"type_id":"tag:amateurjav:26","type_name":"OL","arg":"OL"},{"type_id":"tag:amateurjav:60","type_name":"制服","arg":"制服"},{"type_id":"tag:amateurjav:65","type_name":"迷你裙","arg":"迷你裙"},{"type_id":"tag:amateurjav:69","type_name":"女僕","arg":"女僕"},{"type_id":"tag:amateurjav:70","type_name":"內衣","arg":"內衣"},{"type_id":"tag:amateurjav:101","type_name":"泳裝","arg":"泳裝"},{"type_id":"tag:amateurjav:113","type_name":"及膝襪","arg":"及膝襪"},{"type_id":"tag:amateurjav:120","type_name":"眼鏡","arg":"眼鏡"},{"type_id":"tag:amateurjav:126","type_name":"學校泳裝","arg":"學校泳裝"},{"type_id":"tag:amateurjav:8","type_name":"乳房","arg":"乳房"},{"type_id":"tag:amateurjav:11","type_name":"苗條","arg":"苗條"},{"type_id":"tag:amateurjav:17","type_name":"熟女","arg":"熟女"},{"type_id":"tag:amateurjav:33","type_name":"巨乳","arg":"巨乳"},{"type_id":"tag:amateurjav:85","type_name":"爆乳","arg":"爆乳"},{"type_id":"tag:amateurjav:54","type_name":"屁股","arg":"屁股"},{"type_id":"tag:amateurjav:89","type_name":"無毛","arg":"無毛"},{"type_id":"tag:amateurjav:90","type_name":"貧乳・微乳","arg":"貧乳・微乳"},{"type_id":"tag:amateurjav:119","type_name":"高","arg":"高"},{"type_id":"tag:amateurjav:129","type_name":"胖女人","arg":"胖女人"},{"type_id":"tag:amateurjav:49","type_name":"童顔","arg":"童顔"},{"type_id":"tag:amateurjav:231","type_name":"D杯","arg":"D杯"},{"type_id":"tag:amateurjav:226","type_name":"E杯","arg":"E杯"},{"type_id":"tag:amateurjav:229","type_name":"F杯","arg":"F杯"},{"type_id":"tag:amateurjav:230","type_name":"G杯","arg":"G杯"},{"type_id":"tag:amateurjav:222","type_name":"H杯","arg":"H杯"},{"type_id":"tag:amateurjav:125","type_name":"口内発射","arg":"口内発射"},{"type_id":"tag:amateurjav:15","type_name":"中出","arg":"中出"},{"type_id":"tag:amateurjav:16","type_name":"自慰","arg":"自慰"},{"type_id":"tag:amateurjav:18","type_name":"打手槍","arg":"打手槍"},{"type_id":"tag:amateurjav:25","type_name":"顏射","arg":"顏射"},{"type_id":"tag:amateurjav:34","type_name":"潮吹","arg":"潮吹"},{"type_id":"tag:amateurjav:40","type_name":"乳交","arg":"乳交"},{"type_id":"tag:amateurjav:57","type_name":"亂交","arg":"亂交"},{"type_id":"tag:amateurjav:62","type_name":"深喉","arg":"深喉"},{"type_id":"tag:amateurjav:79","type_name":"肛交","arg":"肛交"},{"type_id":"tag:amateurjav:88","type_name":"顏射","arg":"顏射"},{"type_id":"tag:amateurjav:95","type_name":"顏面騎乘","arg":"顏面騎乘"},{"type_id":"tag:amateurjav:104","type_name":"足交","arg":"足交"},{"type_id":"tag:amateurjav:161","type_name":"母乳","arg":"母乳"},{"type_id":"tag:amateurjav:181","type_name":"吞精","arg":"吞精"},{"type_id":"tag:amateurjav:37","type_name":"放尿・失禁","arg":"放尿・失禁"},{"type_id":"tag:amateurjav:42","type_name":"羞恥・辱め","arg":"羞恥・辱め"},{"type_id":"tag:amateurjav:7","type_name":"女優按摩棒","arg":"女優按摩棒"},{"type_id":"tag:amateurjav:14","type_name":"拘束","arg":"拘束"},{"type_id":"tag:amateurjav:38","type_name":"按摩棒","arg":"按摩棒"},{"type_id":"tag:amateurjav:50","type_name":"SM","arg":"SM"},{"type_id":"tag:amateurjav:51","type_name":"車震","arg":"車震"},{"type_id":"tag:amateurjav:64","type_name":"立即口交","arg":"立即口交"},{"type_id":"tag:amateurjav:108","type_name":"多P","arg":"多P"},{"type_id":"tag:amateurjav:123","type_name":"輪姦","arg":"輪姦"},{"type_id":"tag:amateurjav:56","type_name":"乳液・油","arg":"乳液・油"},{"type_id":"tag:amateurjav:72","type_name":"藥物・壯陽藥","arg":"藥物・壯陽藥"},{"type_id":"tag:amateurjav:1","type_name":"素人","arg":"素人"},{"type_id":"tag:amateurjav:106","type_name":"配信専用素人","arg":"配信専用素人"},{"type_id":"tag:amateurjav:228","type_name":"短髮","arg":"短髮"},{"type_id":"tag:amateurjav:145","type_name":"清楚","arg":"清楚"},{"type_id":"tag:amateurjav:66","type_name":"美腳","arg":"美腳"},{"type_id":"tag:amateurjav:67","type_name":"美尻","arg":"美尻"},{"type_id":"tag:amateurjav:103","type_name":"手マン","arg":"手マン"},{"type_id":"tag:amateurjav:78","type_name":"初撮り","arg":"初撮り"},{"type_id":"tag:amateurjav:2","type_name":"纪录片","arg":"纪录片"},{"type_id":"tag:amateurjav:61","type_name":"高清(HD)","arg":"高清(HD)"},{"type_id":"tag:amateurjav:10","type_name":"第一人稱攝影","arg":"第一人稱攝影"},{"type_id":"tag:amateurjav:44","type_name":"單體作品","arg":"單體作品"},{"type_id":"tag:amateurjav:52","type_name":"主觀視角","arg":"主觀視角"},{"type_id":"tag:amateurjav:74","type_name":"國外進口","arg":"國外進口"},{"type_id":"tag:amateurjav:132","type_name":"投稿","arg":"投稿"},{"type_id":"tag:amateurjav:216","type_name":"獨家","arg":"獨家"},{"type_id":"tag:amateurjav:246","type_name":"新登場メーカー","arg":"新登場メーカー"}];

// 后端：7mmtv.sx（自研 PHP CMS，SSR 直出）。移植自 mira-cat 蜘蛛 7mmtv.js
// （含 2026-10-21 二轮修复：W 线 hls4 验档、同片借线、Worker 探活重排）。
// 播放：SW/VH（vidhide 系）走已部署的 mmtv-vidhide Worker 全链代理；
// DO（DoodStream，Turnstile 门禁）/SP（站方 play.php 空壳）无可验证直链，
// REX 无嗅探兜底，帖子只有这两类线时返回"未找到播放地址"。
// REX 详情只承载一条 videoUrl：取排序后第一条可用 W 线的 CD1；
// 多 CD 帖在 REX 里只出第一集（线路全集见猫源版）。

var HOST = "https://7mmtv.sx";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = HOST + "/zh/";
var MMTV_WORKER = "https://mmtv-vidhide.li768435813.workers.dev";

var CATMAP = {};
for (var _ci = 0; _ci < CATS_DATA.length; _ci++) CATMAP[CATS_DATA[_ci].type_id] = CATS_DATA[_ci];

function t(v) { return v == null ? "" : String(v).trim(); }
function clean(s) {
  return t(s).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ");
}
function absUrl(u) {
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return u;
}

// ---------- 抓取（Widget.http；简单页缓存） ----------
var pageCache = {};
function cacheGet(url, ttl) {
  var e = pageCache[url];
  if (e && Date.now() - e.at < ttl) return e.body;
  return "";
}
function cacheSet(url, body) {
  if (body) pageCache[url] = { at: Date.now(), body: body };
}
async function fetchText(url, referer, timeoutMs) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Referer": referer || REFERER,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9"
      },
      timeout: timeoutMs || 15000
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : "") : "";
    if (body) return body;
  } catch (e) { /* ignore */ }
  return "";
}
async function getPage(url, ttl, referer) {
  var hit = cacheGet(url, ttl || 60000);
  if (hit) return hit;
  var body = await fetchText(url, referer);
  cacheSet(url, body);
  return body;
}
async function postForm(url, params, referer) {
  if (!Widget.http || typeof Widget.http.post !== "function") return "";
  var parts = [];
  for (var k in params) parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(params[k]));
  try {
    var res = await Widget.http.post(url, parts.join("&"), {
      headers: {
        "User-Agent": UA,
        "Referer": referer || REFERER,
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "text/html,application/xhtml+xml,*/*;q=0.8"
      },
      timeout: 15000
    });
    return res && typeof res.data === "string" ? res.data : "";
  } catch (e) { return ""; }
}
// 只看状态码的探测 GET（分片探活用；取不到状态时返回 -1）
async function statusOf(url, referer) {
  try {
    var res = await Widget.http.get(url, {
      headers: { "User-Agent": UA, "Referer": referer || REFERER, "Range": "bytes=0-0" },
      timeout: 25000
    });
    if (!res) return -1;
    if (typeof res.status === "number") return res.status;
    if (res.data != null && String(res.data).length) return 200;
    return -1;
  } catch (e) { return -1; }
}

// ---------- 列表解析 ----------
function parseCards(html) {
  var out = [];
  var seen = {};
  var re = /<div class='video'>[\s\S]*?<a[^>]+href="([^"]+_content\/[^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<h3 class='video-title'>\s*<a[^>]*>([\s\S]*?)<\/a>/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var url = absUrl(m[1]);
    if (seen[url]) continue;
    seen[url] = 1;
    var imgM = m[2].match(/data-src='([^']+)'/) || m[2].match(/src='([^']+)'/) || m[2].match(/data-src="([^"]+)"/);
    var name = clean(m[3].replace(/<[^>]+>/g, ""));
    var tail = url.match(/\/([^/]+)\.html(?:[?#]|$)/);
    var pic = imgM ? absUrl(imgM[1]) : "";
    out.push({
      id: url,
      type: "url",
      title: name || (tail ? tail[1] : url),
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: url,
      description: tail ? tail[1] : "",
      mediaType: "movie"
    });
  }
  return out;
}
function pagecountOf(html) {
  var i = html.indexOf("pagination-row");
  if (i < 0) return 1;
  var seg = html.slice(i, i + 6000);
  var max = 1;
  var re = /\/(\d+)\.html/g;
  var m;
  while ((m = re.exec(seg)) !== null) {
    var n = parseInt(m[1], 10);
    if (n > max) max = n;
  }
  return max;
}

// ---------- 纯 JS AES-128-CBC 解密（仅解密方向，与蜘蛛同实现） ----------
var AES_SBOX = [], AES_INV = [], AES_LOG = new Uint8Array(256), AES_EXP = new Uint8Array(256);
(function aesInit() {
  var x = 1;
  for (var i = 0; i < 256; i++) {
    AES_EXP[i] = x; AES_LOG[x] = i;
    x ^= ((x << 1) & 0xff) ^ ((x & 0x80) ? 0x1b : 0);
  }
  for (var j = 0; j < 256; j++) {
    var s = j ? AES_EXP[(255 - AES_LOG[j]) % 255] : 0;
    var y = s;
    y = ((y << 1) | (y >> 7)) & 0xff; s ^= y;
    y = ((y << 1) | (y >> 7)) & 0xff; s ^= y;
    y = ((y << 1) | (y >> 7)) & 0xff; s ^= y;
    y = ((y << 1) | (y >> 7)) & 0xff; s ^= y;
    s ^= 0x63;
    AES_SBOX[j] = s & 0xff; AES_INV[s & 0xff] = j;
  }
})();
function aesMul(a, b) { return a && b ? AES_EXP[(AES_LOG[a] + AES_LOG[b]) % 255] : 0; }
var AES_RCON = [1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
function aesExpandKey(key) {
  var w = new Uint8Array(176);
  w.set(key.subarray(0, 16));
  for (var i = 4; i < 44; i++) {
    var t0 = w[4 * i - 4], t1 = w[4 * i - 3], t2 = w[4 * i - 2], t3 = w[4 * i - 1];
    if (i % 4 === 0) {
      var n0 = AES_SBOX[t1] ^ AES_RCON[i / 4 - 1], n1 = AES_SBOX[t2], n2 = AES_SBOX[t3], n3 = AES_SBOX[t0];
      t0 = n0; t1 = n1; t2 = n2; t3 = n3;
    }
    w[4 * i] = w[4 * i - 16] ^ t0;
    w[4 * i + 1] = w[4 * i - 15] ^ t1;
    w[4 * i + 2] = w[4 * i - 14] ^ t2;
    w[4 * i + 3] = w[4 * i - 13] ^ t3;
  }
  return w;
}
function aesDecryptBlock(w, block, out, off) {
  var s = new Uint8Array(16);
  var i, r, c;
  for (i = 0; i < 16; i++) s[i] = block[i] ^ w[160 + i];
  for (var round = 9; round >= 1; round--) {
    for (i = 0; i < 16; i++) s[i] = AES_INV[s[i]];
    var u = new Uint8Array(16);
    for (r = 0; r < 4; r++) for (c = 0; c < 4; c++) u[4 * c + r] = s[4 * ((c - r + 4) % 4) + r];
    s.set(u);
    for (i = 0; i < 16; i++) s[i] ^= w[16 * round + i];
    for (c = 0; c < 4; c++) {
      var a0 = s[4 * c], a1 = s[4 * c + 1], a2 = s[4 * c + 2], a3 = s[4 * c + 3];
      s[4 * c]     = aesMul(a0, 14) ^ aesMul(a1, 11) ^ aesMul(a2, 13) ^ aesMul(a3, 9);
      s[4 * c + 1] = aesMul(a0, 9) ^ aesMul(a1, 14) ^ aesMul(a2, 11) ^ aesMul(a3, 13);
      s[4 * c + 2] = aesMul(a0, 13) ^ aesMul(a1, 9) ^ aesMul(a2, 14) ^ aesMul(a3, 11);
      s[4 * c + 3] = aesMul(a0, 11) ^ aesMul(a1, 13) ^ aesMul(a2, 9) ^ aesMul(a3, 14);
    }
  }
  for (i = 0; i < 16; i++) s[i] = AES_INV[s[i]];
  var u2 = new Uint8Array(16);
  for (r = 0; r < 4; r++) for (c = 0; c < 4; c++) u2[4 * c + r] = s[4 * ((c - r + 4) % 4) + r];
  for (i = 0; i < 16; i++) out[off + i] = u2[i] ^ w[i];
}
function aes128CbcDecrypt(data, keyBytes, ivBytes) {
  if (!data.length || data.length % 16 !== 0) return new Uint8Array(0);
  var w = aesExpandKey(keyBytes);
  var out = new Uint8Array(data.length);
  var prev = ivBytes;
  for (var off = 0; off < data.length; off += 16) {
    var block = data.subarray(off, off + 16);
    aesDecryptBlock(w, block, out, off);
    for (var i = 0; i < 16; i++) out[off + i] ^= prev[i];
    prev = block;
  }
  var pad = out[out.length - 1];
  if (pad >= 1 && pad <= 16) return out.subarray(0, out.length - pad);
  return out;
}
// 纯 JS base64 解码（不依赖 atob）
var B64TAB = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64ToBytes(b64) {
  var s = String(b64).replace(/[^A-Za-z0-9+/=]/g, "");
  var out = [];
  var buf = 0, bits = 0;
  for (var i = 0; i < s.length; i++) {
    var ch = s.charAt(i);
    if (ch === "=") break;
    var v = B64TAB.indexOf(ch);
    if (v < 0) continue;
    buf = (buf << 6) | v; bits += 6;
    if (bits >= 8) { bits -= 8; out.push((buf >> bits) & 0xff); }
  }
  return new Uint8Array(out);
}
function utf8Bytes(str) {
  var out = [];
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    if (c < 0x80) out.push(c);
    else if (c < 0x800) { out.push(0xc0 | (c >> 6)); out.push(0x80 | (c & 0x3f)); }
    else { out.push(0xe0 | (c >> 12)); out.push(0x80 | ((c >> 6) & 0x3f)); out.push(0x80 | (c & 0x3f)); }
  }
  return new Uint8Array(out);
}
function utf8Text(bytes) {
  var out = "";
  var i = 0;
  while (i < bytes.length) {
    var b = bytes[i];
    if (b < 0x80) { out += String.fromCharCode(b); i += 1; }
    else if (b < 0xe0) { out += String.fromCharCode(((b & 0x1f) << 6) | (bytes[i + 1] & 0x3f)); i += 2; }
    else if (b < 0xf0) { out += String.fromCharCode(((b & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f)); i += 3; }
    else {
      var cp = ((b & 0x07) << 18) | ((bytes[i + 1] & 0x3f) << 12) | ((bytes[i + 2] & 0x3f) << 6) | (bytes[i + 3] & 0x3f);
      cp -= 0x10000;
      out += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff));
      i += 4;
    }
  }
  return out;
}

// ---------- mvarr 解码 ----------
function parseGlobals(html) {
  function grabS(n) { var m = html.match(new RegExp(n + "\\s*=\\s*'([^']+)'")); return m ? m[1] : ""; }
  function grabN(n) { var m = html.match(new RegExp(n + "\\s*=\\s*(\\d+)")); return m ? parseInt(m[1], 10) : NaN; }
  return { hc: grabN("hcdeedg252"), ha: grabN("hadeedg252"), key: grabS("argdeqweqweqwz"), iv: grabS("hdddedf252") };
}
function hsdf(s, hc, ha) {
  var sep = String.fromCharCode(hc + 97);
  var parts = s.split(sep);
  var out = "";
  for (var i = 0; i < parts.length; i++) {
    if (!parts[i].length) continue;
    out += String.fromCharCode(parseInt(parts[i], hc) ^ ha);
  }
  return out;
}
function extractEmbeds(html) {
  var g = parseGlobals(html);
  if (!g.key || !g.iv || !(g.hc >= 2) || isNaN(g.ha)) return [];
  var out = [];
  var re = /mvarr\['(\d+)_(\d+)'\]\s*=\s*\[(.*?)\];/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var srv = m[1], part = parseInt(m[2], 10);
    var strs = [];
    var sre = /'((?:[^'\\]|\\.)*)'/g;
    var sm;
    while ((sm = sre.exec(m[3])) !== null) strs.push(sm[1]);
    var sep = String.fromCharCode(g.hc + 97);
    var blobIdx = -1;
    for (var bi = 0; bi < strs.length; bi++) {
      if (strs[bi].length > 50 && strs[bi].indexOf(sep) >= 0 && /^[0-9a-z]+$/i.test(strs[bi])) { blobIdx = bi; break; }
    }
    if (blobIdx < 0) continue;
    var base = "";
    for (var i = blobIdx + 1; i < strs.length; i++) {
      if (/^(https?:)?\/\//.test(strs[i])) { base = strs[i]; break; }
    }
    if (!base) continue;
    var suffix = "";
    if (strs[blobIdx + 2] === base && typeof strs[blobIdx + 3] === "string" && strs[blobIdx + 3].charAt(0) !== "<") suffix = strs[blobIdx + 3];
    try {
      var plain = utf8Text(aes128CbcDecrypt(b64ToBytes(hsdf(strs[blobIdx], g.hc, g.ha)), utf8Bytes(g.key), utf8Bytes(g.iv)));
      if (!plain || /[\u0000-\u001f]/.test(plain)) continue;
      var embed = base.indexOf("emturbovid") >= 0 ? plain : absUrl(base) + plain + suffix;
      out.push({ srv: srv, part: part, base: absUrl(base), embed: embed });
    } catch (e) { /* 跳过坏条目 */ }
  }
  return out;
}
var SRV_INFO = {
  "37": { name: "SW", kind: "W" },
  "38": { name: "VH", kind: "W" },
  "28": { name: "DO", kind: "S" },
  "42": { name: "SP", kind: "S" }
};
function srvInfo(e) {
  if (SRV_INFO[e.srv]) return SRV_INFO[e.srv];
  if (/mmsi02|mmvh02/.test(e.base)) return { name: "VH", kind: "W" };
  return { name: "SP", kind: "S" };
}

// ---------- embed 验档（与 mmtv-vidhide Worker 同算法的纯 JS 解包） ----------
function jsUnescapeSingle(s) {
  return s.replace(/\\(.)/g, function (mm, c) {
    if (c === "n") return "\n";
    if (c === "r") return "\r";
    if (c === "t") return "\t";
    return c;
  });
}
function unpackPacker(html) {
  var m = String(html).match(/eval\(function\(p,a,c,k,e,d\)[\s\S]*?\}\s*\(\s*'((?:[^'\\]|\\.)*)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:[^'\\]|\\.)*)'\.split\('\|'\)/);
  if (!m) return "";
  var p = jsUnescapeSingle(m[1]);
  var a = parseInt(m[2], 10);
  var c = parseInt(m[3], 10);
  var k = jsUnescapeSingle(m[4]).split("|");
  function enc(n) { return (n < a ? "" : enc(Math.floor(n / a))) + ((n % a) > 35 ? String.fromCharCode((n % a) + 29) : (n % a).toString(36)); }
  var i = c;
  while (i--) {
    if (k[i]) {
      (function (word, token) {
        p = p.replace(new RegExp("\\b" + token + "\\b", "g"), function () { return word; });
      })(k[i], enc(i));
    }
  }
  return p;
}
function extractEmbedLinks(text) {
  var links = {};
  var re = /"hls(\d+)"\s*:\s*"([^"]+)"/g;
  var m;
  while ((m = re.exec(String(text))) !== null) links["hls" + m[1]] = m[2];
  if (!Object.keys(links).length) {
    var f = String(text).match(/"file"\s*:\s*"(https?:[^"]+\.m3u8[^"]*)"/) || String(text).match(/(https?:\/\/[^\s"'\\]+\.m3u8[^\s"'\\]*)/);
    if (f) links.hls2 = f[1];
  }
  return links;
}
// true = 有 hls4（可用）；明确无 hls4 返回 false；探测失败返回 true（不误杀）
var tierCache = {};
async function probeEmbedViable(embed, referer) {
  if (Object.prototype.hasOwnProperty.call(tierCache, embed)) return tierCache[embed];
  var viable = true;
  try {
    var html = await fetchText(embed, referer, 12000);
    if (html) {
      var links = extractEmbedLinks(unpackPacker(html) || html);
      viable = !!links.hls4;
      tierCache[embed] = viable;
    }
  } catch (e) { /* 探测异常 -> 按存活对待 */ }
  return viable;
}
async function filterViableW(wEmbeds, referer) {
  if (!wEmbeds.length) return [];
  var flags = await Promise.all(wEmbeds.map(function (e) { return probeEmbedViable(e.embed, referer); }));
  return wEmbeds.filter(function (e, i) { return flags[i]; });
}
// 经 Worker 探活一条线的首分片：'alive' | 'dead' | 'unknown'
//（REX 侧只能看状态码：明确 >=400 判死，其余不判死；/v 探活同时给
//  Worker 边缘缓存预热，真播时更快。与蜘蛛的字节判定相比更保守。）
async function probeLineAlive(embed, referer) {
  try {
    var wurl = MMTV_WORKER + "/v?u=" + encodeURIComponent(embed) + "&r=" + encodeURIComponent(referer);
    var txt = await fetchText(wurl, referer, 30000);
    if (!txt || txt.indexOf("#EXTM3U") < 0) return "unknown";
    var seg = "";
    for (var hop = 0; hop < 2 && !seg; hop++) {
      var lines = txt.split("\n");
      var line = "";
      for (var li = 0; li < lines.length; li++) {
        var s = lines[li].replace(/^\s+|\s+$/g, "");
        if (s && s.charAt(0) !== "#") { line = s; break; }
      }
      if (!line) return "unknown";
      if (/\.m3u8($|\?)|\/p\?/.test(line)) {
        txt = await fetchText(line, referer, 20000);
        if (!txt || txt.indexOf("#EXTM3U") < 0) return "unknown";
      } else seg = line;
    }
    if (!seg) return "unknown";
    var st = await statusOf(seg, referer);
    if (st === 200 || st === 206) return "alive";
    if (st >= 400) return "dead";
    return "unknown";
  } catch (e) { return "unknown"; }
}

// ---------- 分类/列表 ----------
function catUrl(cat, page) {
  var parts = cat.type_id.split(":");
  var kind = parts[0], a = parts[1], b = parts[2];
  if (kind === "list") return HOST + "/zh/" + a + "_list/all/" + page + ".html";
  if (kind === "maker") return HOST + "/zh/" + a + "_makersr/" + b + "/" + encodeURIComponent(cat.arg || "") + "/" + page + ".html";
  if (kind === "tag") return HOST + "/zh/" + a + "_category/" + b + "/" + encodeURIComponent(cat.arg || "") + "/" + page + ".html";
  return HOST + "/zh/";
}
async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var tid = t(params.cat || params.path || "list:censored");
  var cat = CATMAP[tid] || CATS_DATA[0];
  try {
    var html = await getPage(catUrl(cat, page), 60000);
    if (!html) return [{ id: "err", type: "url", title: "载入失败：页面为空" }];
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有更多内容" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败", description: String((e && e.message) || e) }];
  }
}

async function search(params) {
  params = params || {};
  var wd = "";
  var keys = ["keyword", "q", "query", "wd", "key", "search", "text"];
  for (var i = 0; i < keys.length; i++) { if (params[keys[i]]) { wd = t(params[keys[i]]); break; } }
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return [{ id: "tip", type: "url", title: "输入番号或关键词搜索" }];
  try {
    var html = await getPage(HOST + "/zh/searchall_search/all/" + encodeURIComponent(wd) + "/" + page + ".html", 60000);
    var list = html ? parseCards(html) : [];
    if (page === 1 && !list.length) {
      var html2 = await postForm(HOST + "/zh/searchform_search/all/index.html",
        { search_keyword: wd, search_type: "searchall", op: "search" });
      list = html2 ? parseCards(html2) : [];
    }
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败", description: String((e && e.message) || e) }];
  }
}

// ---------- 详情/播放 ----------
function sectionOf(url) {
  var m = String(url).match(/\/zh\/([a-z-]+)_content\//);
  return m ? m[1] : "";
}
function codeOf(url) {
  var m = String(url).match(/\/([^/]+)\.html(?:[?#]|$)/);
  return m ? m[1] : "";
}
var twinCache = {};
async function findViableTwinEmbeds(code, selfUrl) {
  if (!code || code === "content") return [];
  if (Object.prototype.hasOwnProperty.call(twinCache, code)) return twinCache[code];
  var viable = [];
  try {
    var cards = parseCards(await getPage(HOST + "/zh/searchall_search/all/" + encodeURIComponent(code) + "/1.html", 60000, selfUrl) || "");
    if (!cards.length) {
      var html = await postForm(HOST + "/zh/searchform_search/all/index.html",
        { search_keyword: code, search_type: "searchall", op: "search" }, selfUrl);
      cards = parseCards(html || "");
    }
    var pref = ["censored", "chinese", "uncensored", "amateurjav", "amateur", "klive"];
    var twins = cards
      .map(function (c) { return c.link; })
      .filter(function (u) { return u !== selfUrl && sectionOf(u) && sectionOf(u) !== sectionOf(selfUrl); })
      .sort(function (x, y) { return pref.indexOf(sectionOf(x)) - pref.indexOf(sectionOf(y)); });
    for (var ti = 0; ti < Math.min(2, twins.length); ti++) {
      var tu = twins[ti];
      var thtml = await fetchText(tu, selfUrl, 12000);
      if (!thtml) continue;
      var te = extractEmbeds(thtml).filter(function (e) { return srvInfo(e).kind === "W"; });
      if (!te.length) continue;
      var tv = await filterViableW(te, selfUrl);
      if (tv.length) { viable = tv; break; }
    }
  } catch (e) { /* 忽略，只剩自有线 */ }
  twinCache[code] = viable;
  return viable;
}
function buildGroups(wEmbeds, sEmbeds) {
  var groups = {};
  var all = wEmbeds.concat(sEmbeds);
  for (var i = 0; i < all.length; i++) {
    var info = srvInfo(all[i]);
    if (!groups[info.name]) groups[info.name] = { kind: info.kind, parts: [] };
    groups[info.name].parts.push(all[i]);
  }
  for (var name in groups) groups[name].parts.sort(function (x, y) { return x.part - y.part; });
  return groups;
}
async function orderWithProbe(groups, referer) {
  var names = ["SW", "VH", "DO", "SP"];
  var order = names.filter(function (n) { return !!groups[n]; });
  var wLines = order.filter(function (n) { return groups[n].kind === "W"; });
  if (!wLines.length) return { order: order, anyW: false, wAlive: false };
  var st1 = await probeLineAlive(groups[wLines[0]].parts[0].embed, referer);
  if (st1 === "alive" || st1 === "unknown") return { order: order, anyW: true, wAlive: true };
  if (wLines.length > 1) {
    var st2 = await probeLineAlive(groups[wLines[1]].parts[0].embed, referer);
    if (st2 === "alive") {
      var rest = order.filter(function (n) { return n !== wLines[0] && n !== wLines[1]; });
      return { order: [wLines[1], wLines[0]].concat(rest), anyW: true, wAlive: true };
    }
    if (st2 === "unknown") return { order: order, anyW: true, wAlive: true };
  }
  return { order: order, anyW: true, wAlive: false };
}

async function loadDetail(link) {
  var durl = absUrl(String(link || ""));
  try {
    var html = await getPage(durl, 300000);
    if (!html) return { id: durl, type: "url", title: "载入失败", description: "详情页为空" };
    var nameM = html.match(/<h1 class="fullvideo-title[^"]*">([\s\S]*?)<\/h1>/);
    var name = nameM ? clean(nameM[1].replace(/<[^>]+>/g, "")) : durl;
    var picM = html.match(/content_main_cover[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/) ||
               html.match(/<meta property="og:image" content="([^"]+)"/);
    var pic = picM ? absUrl(picM[1]) : "";
    var descM = html.match(/<meta name="description" content="([^"]*)"/);
    var code = codeOf(durl);

    var allEmbeds = extractEmbeds(html);
    var ownS = allEmbeds.filter(function (e) { return srvInfo(e).kind !== "W"; });
    var wEmbeds = await filterViableW(allEmbeds.filter(function (e) { return srvInfo(e).kind === "W"; }), durl);
    var groups = buildGroups(wEmbeds, ownS);
    var ord = await orderWithProbe(groups, durl);
    if (!ord.wAlive) {
      var tv = await findViableTwinEmbeds(code, durl);
      if (tv.length) {
        wEmbeds = tv;
        groups = buildGroups(wEmbeds, ownS);
        ord = await orderWithProbe(groups, durl);
      }
    }
    // REX 只承载一条 videoUrl：取排序第一条线的第一集
    for (var li = 0; li < ord.order.length; li++) {
      var grp = groups[ord.order[li]];
      if (!grp || !grp.parts.length) continue;
      var e0 = grp.parts[0];
      if (grp.kind === "W") {
        var wurl = MMTV_WORKER + "/v?u=" + encodeURIComponent(e0.embed) + "&r=" + encodeURIComponent(durl);
        return {
          id: durl,
          type: "detail",
          title: name,
          link: durl,
          posterPath: pic,
          coverUrl: pic,
          backdropPath: pic,
          videoUrl: wurl,
          playerType: "app",
          customHeaders: { "User-Agent": UA, "Referer": durl }
        };
      }
      // 第一条就是 S 线（DO/SP）时后面不会有 W 线（顺序固定 W 在前）
      break;
    }
    return {
      id: durl,
      type: "url",
      title: name,
      description: "未找到播放地址（仅 DO/SP 线，REX 无法嗅探兜底）",
      posterPath: pic,
      coverUrl: pic,
      link: durl
    };
  } catch (e) {
    return { id: durl, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
