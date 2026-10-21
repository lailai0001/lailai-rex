// Brazz.org for REX (lai_brazz v1.0.0)
// 移植自 mira-cat 蜘蛛 brazz.js (py_brazz, 2026-10-20 真机定版)。
// 后端：https://brazz.org（WordPress + WP-Script 类 tube 主题，SSR 直出，无登录无 VIP 墙）。
// 列表：article.loop-video 卡片；分类 556 个（排序 4 + 系列 20 + 标签 532，与蜘蛛 CATS 全量一致）。
// 播放：详情页 iframe → brazzpw.xyz 播放器页内联 player.src 的相对 m3u8（单档 720p）；
//       hash 实测不校验，解析失败时用 m3u8_{vid}.m3u8?hash=1 构造兜底。
// 封面：media-public-ht.project1content.com 直链，实测无防盗链，不走代理。

WidgetMetadata = {
  "id": "lai_brazz",
  "title": "Brazz.org",
  "description": "Brazz.org：Brazzers 系免费聚合，556 分类（系列 20 + 标签 532 全量），播放 720p",
  "author": "lai",
  "version": "1.0.0",
  "requiredVersion": "0.0.1",
  "site": "https://brazz.org",
  "detailCacheDuration": 180,
  "modules": [
    {
      "title": "最新与排序",
      "functionName": "loadList",
      "cacheDuration": 180,
      "params": [
        {
          "name": "path",
          "title": "最新与排序",
          "type": "enumeration",
          "value": "latest",
          "enumOptions": [
            {
              "title": "最新视频",
              "value": "latest"
            },
            {
              "title": "观看最多",
              "value": "sort/views"
            },
            {
              "title": "评分最高",
              "value": "sort/rating"
            },
            {
              "title": "正在观看",
              "value": "sort/beingwatched"
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
      "title": "出品系列",
      "functionName": "loadList",
      "cacheDuration": 180,
      "params": [
        {
          "name": "path",
          "title": "出品系列",
          "type": "enumeration",
          "value": "site/62/doctor-adventures",
          "enumOptions": [
            {
              "title": "Doctor Adventures",
              "value": "site/62/doctor-adventures"
            },
            {
              "title": "Big Wet Butts",
              "value": "site/65/big-wet-butts"
            },
            {
              "title": "Baby Got Boobs",
              "value": "site/66/baby-got-boobs"
            },
            {
              "title": "Mommy Got Boobs",
              "value": "site/67/mommy-got-boobs"
            },
            {
              "title": "Big Tits at Work",
              "value": "site/71/big-tits-at-work"
            },
            {
              "title": "Big Tits at School",
              "value": "site/75/big-tits-at-school"
            },
            {
              "title": "Pornstars Like it Big",
              "value": "site/77/pornstars-like-it-big"
            },
            {
              "title": "Milfs Like it Big",
              "value": "site/78/milfs-like-it-big"
            },
            {
              "title": "Teens Like It Big",
              "value": "site/80/teens-like-it-big"
            },
            {
              "title": "Real Wife Stories",
              "value": "site/81/real-wife-stories"
            },
            {
              "title": "Big Butts Like It Big",
              "value": "site/82/big-butts-like-it-big"
            },
            {
              "title": "Big Tits In Sports",
              "value": "site/83/big-tits-in-sports"
            },
            {
              "title": "Day With A Pornstar",
              "value": "site/87/day-with-a-pornstar"
            },
            {
              "title": "Big Tits In Uniform",
              "value": "site/89/big-tits-in-uniform"
            },
            {
              "title": "Hot And Mean",
              "value": "site/90/hot-and-mean"
            },
            {
              "title": "ZZ Series",
              "value": "site/92/zz-series"
            },
            {
              "title": "Dirty Masseur",
              "value": "site/94/dirty-masseur"
            },
            {
              "title": "Brazzers Exxtra",
              "value": "site/96/brazzers-exxtra"
            },
            {
              "title": "CFNM",
              "value": "site/98/cfnm"
            },
            {
              "title": "Moms in control",
              "value": "site/99/moms-in-control"
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
      "title": "标签",
      "functionName": "loadList",
      "cacheDuration": 180,
      "params": [
        {
          "name": "path",
          "title": "标签",
          "type": "enumeration",
          "value": "tag/9/sex",
          "enumOptions": [
            {
              "title": "Sex",
              "value": "tag/9/sex"
            },
            {
              "title": "Blowjob",
              "value": "tag/277/blowjob"
            },
            {
              "title": "Indoors",
              "value": "tag/319/indoors"
            },
            {
              "title": "Big Dick",
              "value": "tag/545/big-dick"
            },
            {
              "title": "Doggystyle",
              "value": "tag/562/doggystyle"
            },
            {
              "title": "Cowgirl",
              "value": "tag/558/cowgirl"
            },
            {
              "title": "Missionary",
              "value": "tag/578/missionary"
            },
            {
              "title": "Reverse Cowgirl",
              "value": "tag/585/reverse-cowgirl"
            },
            {
              "title": "Innie Pussy",
              "value": "tag/630/innie-pussy"
            },
            {
              "title": "Big Tits",
              "value": "tag/666/big-tits"
            },
            {
              "title": "Deep Throat",
              "value": "tag/281/deep-throat"
            },
            {
              "title": "Short Hair",
              "value": "tag/386/short-hair"
            },
            {
              "title": "Athletic",
              "value": "tag/90/athletic"
            },
            {
              "title": "Tattoo",
              "value": "tag/88/tattoo"
            },
            {
              "title": "Pussy Licking",
              "value": "tag/292/pussy-licking"
            },
            {
              "title": "Facial",
              "value": "tag/66/facial"
            },
            {
              "title": "Side Fuck",
              "value": "tag/590/side-fuck"
            },
            {
              "title": "Bubble Butt",
              "value": "tag/50/bubble-butt"
            },
            {
              "title": "Spanking",
              "value": "tag/294/spanking"
            },
            {
              "title": "Face Fuck",
              "value": "tag/283/face-fuck"
            },
            {
              "title": "Enhanced",
              "value": "tag/672/enhanced"
            },
            {
              "title": "Gagging",
              "value": "tag/286/gagging"
            },
            {
              "title": "Caucasian",
              "value": "tag/107/caucasian"
            },
            {
              "title": "Bald Pussy",
              "value": "tag/626/bald-pussy"
            },
            {
              "title": "Pussy Fingering",
              "value": "tag/291/pussy-fingering"
            },
            {
              "title": "Piercing",
              "value": "tag/87/piercing"
            },
            {
              "title": "Natural Tits",
              "value": "tag/673/natural-tits"
            },
            {
              "title": "Trimmed Pussy",
              "value": "tag/628/trimmed-pussy"
            },
            {
              "title": "Handjob",
              "value": "tag/207/handjob"
            },
            {
              "title": "Cum Shot",
              "value": "tag/62/cum-shot"
            },
            {
              "title": "Doggystyle - Standing",
              "value": "tag/566/doggystyle-standing"
            },
            {
              "title": "Big Tits Worship",
              "value": "tag/455/big-tits-worship"
            },
            {
              "title": "Big Ass",
              "value": "tag/49/big-ass"
            },
            {
              "title": "High Heels",
              "value": "tag/229/high-heels"
            },
            {
              "title": "Muscular Man",
              "value": "tag/365/muscular-man"
            },
            {
              "title": "Interracial",
              "value": "tag/505/interracial"
            },
            {
              "title": "Cumshot Clean-Up",
              "value": "tag/55/cumshot-clean-up"
            },
            {
              "title": "American Man",
              "value": "tag/371/american-man"
            },
            {
              "title": "Kissing",
              "value": "tag/210/kissing"
            },
            {
              "title": "Blowjob - POV",
              "value": "tag/279/blowjob-pov"
            },
            {
              "title": "European",
              "value": "tag/376/european"
            },
            {
              "title": "Blonde",
              "value": "tag/126/blonde"
            },
            {
              "title": "Brunette",
              "value": "tag/127/brunette"
            },
            {
              "title": "Black Hair",
              "value": "tag/125/black-hair"
            },
            {
              "title": "Couples Fantasies",
              "value": "tag/470/couples-fantasies"
            },
            {
              "title": "Average Male Body ",
              "value": "tag/359/average-male-body"
            },
            {
              "title": "Titty Fuck",
              "value": "tag/296/titty-fuck"
            },
            {
              "title": "Brown Hair",
              "value": "tag/381/brown-hair"
            },
            {
              "title": "Blowjob - Double",
              "value": "tag/278/blowjob-double"
            },
            {
              "title": "Caught Cheating",
              "value": "tag/466/cheating"
            },
            {
              "title": "Threesome",
              "value": "tag/11/threesome"
            },
            {
              "title": "Bedroom",
              "value": "tag/307/bedroom"
            },
            {
              "title": "Dress",
              "value": "tag/25/dress"
            },
            {
              "title": "Face Sitting",
              "value": "tag/284/face-sitting"
            },
            {
              "title": "Wet",
              "value": "tag/227/wet"
            },
            {
              "title": "Ballerina",
              "value": "tag/554/ballerina"
            },
            {
              "title": "Outie Pussy",
              "value": "tag/631/outie-pussy"
            },
            {
              "title": "Spoon",
              "value": "tag/596/spoon"
            },
            {
              "title": "Thong",
              "value": "tag/543/thong"
            },
            {
              "title": "Big Naturals",
              "value": "tag/665/big-naturals"
            },
            {
              "title": "Small Ass",
              "value": "tag/52/small-ass"
            },
            {
              "title": "Top Ad",
              "value": "tag/1427/top-ad"
            },
            {
              "title": "Big Boobs (Natural)",
              "value": "tag/671/big-boobs-natural"
            },
            {
              "title": "Masturbation",
              "value": "tag/212/masturbation"
            },
            {
              "title": "Small Tits",
              "value": "tag/669/small-tits"
            },
            {
              "title": "Ass Licking",
              "value": "tag/274/ass-licking"
            },
            {
              "title": "Anal",
              "value": "tag/448/anal"
            },
            {
              "title": "Fuck n Lick",
              "value": "tag/576/fuck-n-lick"
            },
            {
              "title": "FFM",
              "value": "tag/4/ffm"
            },
            {
              "title": "Work Fantasies",
              "value": "tag/538/work-fantasies"
            },
            {
              "title": "Sex Toys",
              "value": "tag/617/sex-toys"
            },
            {
              "title": "Slim",
              "value": "tag/367/slim"
            },
            {
              "title": "Living Room",
              "value": "tag/324/living-room"
            },
            {
              "title": "Ass Worship",
              "value": "tag/450/ass-worship"
            },
            {
              "title": "Fetish",
              "value": "tag/203/fetish"
            },
            {
              "title": "69",
              "value": "tag/550/69"
            },
            {
              "title": "Average Body",
              "value": "tag/91/average-body"
            },
            {
              "title": "Oil",
              "value": "tag/615/oil"
            },
            {
              "title": "Latina",
              "value": "tag/121/latina"
            },
            {
              "title": "Black Male",
              "value": "tag/374/black-male"
            },
            {
              "title": "Sneaky",
              "value": "tag/219/sneaky"
            },
            {
              "title": "Feet",
              "value": "tag/202/feet"
            },
            {
              "title": "Shaved",
              "value": "tag/385/shaved"
            },
            {
              "title": "Outdoors",
              "value": "tag/329/outdoors"
            },
            {
              "title": "Tank Top",
              "value": "tag/46/tank-top"
            },
            {
              "title": "Black",
              "value": "tag/112/black"
            },
            {
              "title": "Redhead",
              "value": "tag/128/red-head"
            },
            {
              "title": "Ass To Mouth",
              "value": "tag/275/ass-to-mouth"
            },
            {
              "title": "Squirt",
              "value": "tag/220/squirt"
            },
            {
              "title": "Multiple Cum Cleanup",
              "value": "tag/69/multiple-cum-cleanup"
            },
            {
              "title": "Stand And Carry",
              "value": "tag/599/stand-and-carry"
            },
            {
              "title": "25-34",
              "value": "tag/350/25-34"
            },
            {
              "title": "Hair Pulling",
              "value": "tag/288/hair-pulling"
            },
            {
              "title": "Scissoring",
              "value": "tag/589/scissoring"
            },
            {
              "title": "Voluptuous",
              "value": "tag/99/voluptuous"
            },
            {
              "title": "Oral Train",
              "value": "tag/290/oral-train"
            },
            {
              "title": "Anal Fingering",
              "value": "tag/271/anal-fingering"
            },
            {
              "title": "G-String",
              "value": "tag/542/g-string"
            },
            {
              "title": "Booty Shorts",
              "value": "tag/23/booty-shorts"
            },
            {
              "title": "Wife",
              "value": "tag/191/wife"
            },
            {
              "title": "Blond Hair",
              "value": "tag/380/blond-hair"
            },
            {
              "title": "Medium Ass",
              "value": "tag/51/medium-ass"
            },
            {
              "title": "Twerking",
              "value": "tag/223/twerking"
            },
            {
              "title": "Socks",
              "value": "tag/44/socks"
            },
            {
              "title": "Cum Swap",
              "value": "tag/65/cum-swap"
            },
            {
              "title": "Garter Belt",
              "value": "tag/299/garter-belt"
            },
            {
              "title": "MILF",
              "value": "tag/79/milf"
            },
            {
              "title": "Bathroom",
              "value": "tag/304/bathroom"
            },
            {
              "title": "Doggystyle Blowjob",
              "value": "tag/567/doggystyle-blowjob"
            },
            {
              "title": "Sports Bra",
              "value": "tag/45/sports-bra"
            },
            {
              "title": "Medium Tits",
              "value": "tag/668/medium-tits"
            },
            {
              "title": "Dildo",
              "value": "tag/609/dildo"
            },
            {
              "title": "Tittyfuck - POV",
              "value": "tag/297/tittyfuck-pov"
            },
            {
              "title": "Petite",
              "value": "tag/95/petite"
            },
            {
              "title": "Kitchen",
              "value": "tag/321/kitchen"
            },
            {
              "title": "Cum on Tits",
              "value": "tag/61/cum-on-tits"
            },
            {
              "title": "Slow Mo",
              "value": "tag/217/slow-mo"
            },
            {
              "title": "Grey",
              "value": "tag/382/grey"
            },
            {
              "title": "Thick",
              "value": "tag/98/thick"
            },
            {
              "title": "Leggings",
              "value": "tag/35/leggings"
            },
            {
              "title": "Glasses",
              "value": "tag/15/glasses"
            },
            {
              "title": "Doggystyle - POV",
              "value": "tag/564/doggystyle-pov"
            },
            {
              "title": "Creampie",
              "value": "tag/56/creampie"
            },
            {
              "title": "Side Rider",
              "value": "tag/593/side-rider"
            },
            {
              "title": "Pile Driving",
              "value": "tag/583/pile-driving"
            },
            {
              "title": "Jean Shorts",
              "value": "tag/31/jean-shorts"
            },
            {
              "title": "Rimjob",
              "value": "tag/215/rimjob"
            },
            {
              "title": "Doggystyle - Lying",
              "value": "tag/563/doggystyle-lying"
            },
            {
              "title": "Reverse Cowgirl - POV",
              "value": "tag/586/reverse-cowgirl-pov"
            },
            {
              "title": "35 Plus",
              "value": "tag/351/35-plus"
            },
            {
              "title": "2 on 1 (2 Males)",
              "value": "tag/2/2-on-1-2-males"
            },
            {
              "title": "Boots",
              "value": "tag/228/boots"
            },
            {
              "title": "Footjob",
              "value": "tag/204/footjob"
            },
            {
              "title": "Gonzo",
              "value": "tag/499/gonzo"
            },
            {
              "title": "Cowgirl Blowjob",
              "value": "tag/560/cowgirl-blowjob"
            },
            {
              "title": "Missionary BJ",
              "value": "tag/581/missionary-bj"
            },
            {
              "title": "Huge Tits",
              "value": "tag/667/huge-tits"
            },
            {
              "title": "Lesbian",
              "value": "tag/507/lesbian"
            },
            {
              "title": "Bikini",
              "value": "tag/20/bikini"
            },
            {
              "title": "Shower",
              "value": "tag/341/shower"
            },
            {
              "title": "T-Shirt",
              "value": "tag/47/t-shirt"
            },
            {
              "title": "Reverse Cowgirl BJ",
              "value": "tag/587/reverse-cowgirl-bj"
            },
            {
              "title": "Pussy Creampie",
              "value": "tag/70/pussy-creampie"
            },
            {
              "title": "Asian",
              "value": "tag/103/asian"
            },
            {
              "title": "Blouse",
              "value": "tag/21/blouse"
            },
            {
              "title": "British",
              "value": "tag/106/british"
            },
            {
              "title": "Handjob - POV",
              "value": "tag/208/handjob-pov"
            },
            {
              "title": "Vibrator",
              "value": "tag/623/vibrator"
            },
            {
              "title": "Black Stockings",
              "value": "tag/644/black-stockings"
            },
            {
              "title": "Cowgirl - POV",
              "value": "tag/559/cowgirl-pov"
            },
            {
              "title": "Side Fuck BJ",
              "value": "tag/592/side-fuck-bj"
            },
            {
              "title": "Boyfriends",
              "value": "tag/633/boyfriends"
            },
            {
              "title": "Jeans",
              "value": "tag/30/jeans"
            },
            {
              "title": "Missionary - POV",
              "value": "tag/579/missionary-pov"
            },
            {
              "title": "Massage",
              "value": "tag/211/massage"
            },
            {
              "title": "Shorts",
              "value": "tag/42/shorts"
            },
            {
              "title": "Big Dick Worship",
              "value": "tag/454/big-dick-worship"
            },
            {
              "title": "Cum On Ass",
              "value": "tag/58/cum-on-ass"
            },
            {
              "title": "Kinky",
              "value": "tag/209/kinky"
            },
            {
              "title": "Anal Toys",
              "value": "tag/604/anal-toys"
            },
            {
              "title": "Office",
              "value": "tag/328/office"
            },
            {
              "title": "Ass Stacking",
              "value": "tag/553/ass-stacking"
            },
            {
              "title": "Stepmom",
              "value": "tag/181/stepmom"
            },
            {
              "title": "Husband",
              "value": "tag/409/husband"
            },
            {
              "title": "Compilation",
              "value": "tag/468/compilation"
            },
            {
              "title": "Average Dick",
              "value": "tag/544/average-dick"
            },
            {
              "title": "Washing",
              "value": "tag/225/washing"
            },
            {
              "title": "Nude Stockings",
              "value": "tag/648/nude-stockings"
            },
            {
              "title": "Latin",
              "value": "tag/377/latin"
            },
            {
              "title": "Voyeur",
              "value": "tag/224/voyeur"
            },
            {
              "title": "Boyshorts",
              "value": "tag/540/boyshorts"
            },
            {
              "title": "Double Penetration",
              "value": "tag/473/double-penetration-dp"
            },
            {
              "title": "Fishnet",
              "value": "tag/27/fishnet"
            },
            {
              "title": "Spitting",
              "value": "tag/295/spitting"
            },
            {
              "title": "Fisting",
              "value": "tag/285/fisting"
            },
            {
              "title": "Hairy Pussy",
              "value": "tag/627/hairy-pussy"
            },
            {
              "title": "Facial - POV",
              "value": "tag/68/facial-pov"
            },
            {
              "title": "Sun Glasses",
              "value": "tag/17/sun-glasses"
            },
            {
              "title": "Australian",
              "value": "tag/104/australian"
            },
            {
              "title": "Skirt",
              "value": "tag/43/skirt"
            },
            {
              "title": "Teen 18+",
              "value": "tag/80/teen18"
            },
            {
              "title": "Pool",
              "value": "tag/334/pool"
            },
            {
              "title": "Uniform",
              "value": "tag/534/uniform"
            },
            {
              "title": "Body Suit",
              "value": "tag/22/body-suit"
            },
            {
              "title": "Yoga",
              "value": "tag/192/yoga"
            },
            {
              "title": "Pussy Stacking",
              "value": "tag/584/pussy-stacking"
            },
            {
              "title": "Panty Hose",
              "value": "tag/649/panty-hose"
            },
            {
              "title": "Euro",
              "value": "tag/113/euro"
            },
            {
              "title": "Sandals",
              "value": "tag/230/sandals"
            },
            {
              "title": "Girlfriend",
              "value": "tag/497/girlfriend"
            },
            {
              "title": "Outdoor Sex",
              "value": "tag/1415/outdoor-sex"
            },
            {
              "title": "Rough Sex",
              "value": "tag/518/rough-sex"
            },
            {
              "title": "Blowjob - Threeway",
              "value": "tag/280/blowjob-threeway"
            },
            {
              "title": "Soap",
              "value": "tag/619/soap"
            },
            {
              "title": "Teddy",
              "value": "tag/301/teddy"
            },
            {
              "title": "Doggy 9",
              "value": "tag/561/doggy-9"
            },
            {
              "title": "Long",
              "value": "tag/384/long"
            },
            {
              "title": "Cleaning",
              "value": "tag/200/cleaning"
            },
            {
              "title": "Cum on Pussy",
              "value": "tag/60/cum-on-pussy"
            },
            {
              "title": "Bondage",
              "value": "tag/198/bondage"
            },
            {
              "title": "Strap-on",
              "value": "tag/621/strap-on"
            },
            {
              "title": "Stepdaughter",
              "value": "tag/180/stepdaughter"
            },
            {
              "title": "Facial - Multiple",
              "value": "tag/67/facial-multiple"
            },
            {
              "title": "Car",
              "value": "tag/310/car"
            },
            {
              "title": "Fishnet Stockings",
              "value": "tag/647/fishnet-stockings"
            },
            {
              "title": "Water",
              "value": "tag/226/water"
            },
            {
              "title": "Woman (20-29)",
              "value": "tag/81/woman-20-29"
            },
            {
              "title": "Foursome",
              "value": "tag/5/foursome"
            },
            {
              "title": "Gaping",
              "value": "tag/287/gaping"
            },
            {
              "title": "Cuban",
              "value": "tag/110/cuban"
            },
            {
              "title": "Gloryhole",
              "value": "tag/205/glory-hole"
            },
            {
              "title": "Married",
              "value": "tag/414/married"
            },
            {
              "title": "Anal Creampie",
              "value": "tag/53/anal-creampie"
            },
            {
              "title": "Parody",
              "value": "tag/511/parody"
            },
            {
              "title": "Italian",
              "value": "tag/119/italian"
            },
            {
              "title": "Food",
              "value": "tag/610/food"
            },
            {
              "title": "Masseur",
              "value": "tag/415/masseur"
            },
            {
              "title": "Bathtub",
              "value": "tag/305/bathtub"
            },
            {
              "title": "Latex",
              "value": "tag/33/latex"
            },
            {
              "title": "Gym",
              "value": "tag/316/gym"
            },
            {
              "title": "Femdom",
              "value": "tag/476/femdom"
            },
            {
              "title": "3 Part Series",
              "value": "tag/651/3-part-series"
            },
            {
              "title": "Doctor/Nurse",
              "value": "tag/472/doctornurse"
            },
            {
              "title": "Arch",
              "value": "tag/552/arch"
            },
            {
              "title": "Slip",
              "value": "tag/300/slip"
            },
            {
              "title": "Stepson",
              "value": "tag/439/stepson"
            },
            {
              "title": "18-24",
              "value": "tag/349/18-24"
            },
            {
              "title": "Corset",
              "value": "tag/298/corset"
            },
            {
              "title": "Hotel Room",
              "value": "tag/318/hotel-room"
            },
            {
              "title": "One-on-One",
              "value": "tag/1/one-on-one"
            },
            {
              "title": "Blindfold",
              "value": "tag/606/blindfold"
            },
            {
              "title": "Leather",
              "value": "tag/34/leather"
            },
            {
              "title": "Employee",
              "value": "tag/7751/employee"
            },
            {
              "title": "2 Part Series",
              "value": "tag/650/2-part-series"
            },
            {
              "title": "Swallow",
              "value": "tag/71/swallow"
            },
            {
              "title": "French",
              "value": "tag/114/french"
            },
            {
              "title": "4 Part Series",
              "value": "tag/652/4-part-series"
            },
            {
              "title": "Curvy Woman",
              "value": "tag/93/curvy-woman"
            },
            {
              "title": "Orgy",
              "value": "tag/8/orgy"
            },
            {
              "title": "School Fantasies",
              "value": "tag/519/school-fantasies"
            },
            {
              "title": "Boss",
              "value": "tag/132/boss"
            },
            {
              "title": "Colombian",
              "value": "tag/109/colombian"
            },
            {
              "title": "Party",
              "value": "tag/332/party"
            },
            {
              "title": "Brazzers Debut",
              "value": "tag/461/brazzers-debut"
            },
            {
              "title": "Couples",
              "value": "tag/3/couples"
            },
            {
              "title": "Gangbang",
              "value": "tag/6/gangbang"
            },
            {
              "title": "Group Sex",
              "value": "tag/7/group-sex"
            },
            {
              "title": "Solo",
              "value": "tag/10/solo"
            },
            {
              "title": "Cap",
              "value": "tag/12/cap"
            },
            {
              "title": "Cowboy Hat",
              "value": "tag/13/cowboy-hat"
            },
            {
              "title": "Fedora",
              "value": "tag/14/fedora"
            },
            {
              "title": "Sun Hat",
              "value": "tag/18/sun-hat"
            },
            {
              "title": "Dress Socks",
              "value": "tag/26/dress-socks"
            },
            {
              "title": "Leg Warmers",
              "value": "tag/36/leg-warmers"
            },
            {
              "title": "Pyjamas",
              "value": "tag/39/pyjamas"
            },
            {
              "title": "Underwear",
              "value": "tag/48/underwear"
            },
            {
              "title": "Bukkake",
              "value": "tag/54/bukkake"
            },
            {
              "title": "Cum On Feet",
              "value": "tag/59/cum-on-feet"
            },
            {
              "title": "Cumshot on Tits - Multiple",
              "value": "tag/64/cumshot-on-tits-multiple"
            },
            {
              "title": "Russian",
              "value": "tag/124/russian"
            },
            {
              "title": "Mature",
              "value": "tag/78/mature"
            },
            {
              "title": "BBW",
              "value": "tag/92/bbw"
            },
            {
              "title": "Muscular",
              "value": "tag/94/muscular"
            },
            {
              "title": "Skinny",
              "value": "tag/96/skinny"
            },
            {
              "title": "Tall",
              "value": "tag/97/tall"
            },
            {
              "title": "Arab",
              "value": "tag/101/arab"
            },
            {
              "title": "Argentinian",
              "value": "tag/102/argentinian"
            },
            {
              "title": "Brazilian",
              "value": "tag/105/brazilian"
            },
            {
              "title": "Chinese",
              "value": "tag/108/chinese"
            },
            {
              "title": "Czech",
              "value": "tag/111/czech"
            },
            {
              "title": "French Canadian",
              "value": "tag/115/french-canadian"
            },
            {
              "title": "German",
              "value": "tag/116/german"
            },
            {
              "title": "Hungarian",
              "value": "tag/117/hungarian"
            },
            {
              "title": "Indian",
              "value": "tag/118/indian"
            },
            {
              "title": "Japanese",
              "value": "tag/120/japanese"
            },
            {
              "title": "Native",
              "value": "tag/122/native"
            },
            {
              "title": "Persian",
              "value": "tag/123/persian"
            },
            {
              "title": "Army",
              "value": "tag/130/army"
            },
            {
              "title": "Babysitter",
              "value": "tag/131/babysitter"
            },
            {
              "title": "Burglar",
              "value": "tag/133/burglar"
            },
            {
              "title": "Business Woman",
              "value": "tag/134/business-woman"
            },
            {
              "title": "Cheerleader",
              "value": "tag/135/cheerleader"
            },
            {
              "title": "Chef",
              "value": "tag/136/chef"
            },
            {
              "title": "Construction",
              "value": "tag/138/construction"
            },
            {
              "title": "Cop",
              "value": "tag/139/cop"
            },
            {
              "title": "Cougar",
              "value": "tag/140/cougar"
            },
            {
              "title": "Criminal",
              "value": "tag/141/criminal"
            },
            {
              "title": "Customer",
              "value": "tag/142/customer"
            },
            {
              "title": "Doctor",
              "value": "tag/143/doctor"
            },
            {
              "title": "Dominatrix",
              "value": "tag/144/dominatrix"
            },
            {
              "title": "Firefighter",
              "value": "tag/145/firefighter"
            },
            {
              "title": "Flight Attendant",
              "value": "tag/146/flight-attendant"
            },
            {
              "title": "Gangster",
              "value": "tag/147/gangster"
            },
            {
              "title": "Geek / Nerd",
              "value": "tag/148/geek-nerd"
            },
            {
              "title": "Lawyer",
              "value": "tag/154/lawyer"
            },
            {
              "title": "Lifeguard",
              "value": "tag/155/lifeguard"
            },
            {
              "title": "Maid",
              "value": "tag/156/maid"
            },
            {
              "title": "Masseuse",
              "value": "tag/158/masseuse"
            },
            {
              "title": "Mechanic",
              "value": "tag/159/mechanic"
            },
            {
              "title": "Military",
              "value": "tag/160/military"
            },
            {
              "title": "Mom",
              "value": "tag/162/mom"
            },
            {
              "title": "Nurse",
              "value": "tag/163/nurse"
            },
            {
              "title": "Plumber",
              "value": "tag/165/plumber"
            },
            {
              "title": "Police",
              "value": "tag/424/police"
            },
            {
              "title": "Principal",
              "value": "tag/427/principal"
            },
            {
              "title": "Prisoner",
              "value": "tag/168/prisoner"
            },
            {
              "title": "School Girl",
              "value": "tag/173/school-girl"
            },
            {
              "title": "Sci-Fi",
              "value": "tag/174/sci-fi"
            },
            {
              "title": "Secretary",
              "value": "tag/175/secretary"
            },
            {
              "title": "Sex Therapist",
              "value": "tag/176/sex-therapist"
            },
            {
              "title": "Slave",
              "value": "tag/177/slave"
            },
            {
              "title": "Soldier Girl",
              "value": "tag/178/soldier-girl"
            },
            {
              "title": "Special Agent",
              "value": "tag/179/special-agent"
            },
            {
              "title": "Stepsister",
              "value": "tag/182/stepsister"
            },
            {
              "title": "Store Clerk",
              "value": "tag/183/store-clerk"
            },
            {
              "title": "Stripper",
              "value": "tag/184/stripper"
            },
            {
              "title": "Swingers",
              "value": "tag/185/swingers"
            },
            {
              "title": "Teacher",
              "value": "tag/186/teacher"
            },
            {
              "title": "Teen18+ Role",
              "value": "tag/187/teen18-role"
            },
            {
              "title": "Therapist",
              "value": "tag/188/therapist"
            },
            {
              "title": "Waitress",
              "value": "tag/190/waitress"
            },
            {
              "title": "Fetish/BDSM",
              "value": "tag/194/fetishbdsm"
            },
            {
              "title": "Anal Winking",
              "value": "tag/196/anal-winking"
            },
            {
              "title": "Body Painting",
              "value": "tag/197/body-painting"
            },
            {
              "title": "CFNM",
              "value": "tag/199/cfnm"
            },
            {
              "title": "Domination",
              "value": "tag/201/domination"
            },
            {
              "title": "Piss",
              "value": "tag/214/piss"
            },
            {
              "title": "Shaving",
              "value": "tag/216/shaving"
            },
            {
              "title": "Smoking",
              "value": "tag/218/smoking"
            },
            {
              "title": "Strip Tease",
              "value": "tag/221/strip-tease"
            },
            {
              "title": "Sweat",
              "value": "tag/222/sweat"
            },
            {
              "title": "Crime",
              "value": "tag/241/crime"
            },
            {
              "title": "Game-Show",
              "value": "tag/249/game-show"
            },
            {
              "title": "Horror",
              "value": "tag/251/horror"
            },
            {
              "title": "Interview",
              "value": "tag/252/interview"
            },
            {
              "title": "Music",
              "value": "tag/253/music"
            },
            {
              "title": "Reality",
              "value": "tag/257/reality"
            },
            {
              "title": "Reality-TV",
              "value": "tag/258/reality-tv"
            },
            {
              "title": "Talk-Show",
              "value": "tag/264/talk-show"
            },
            {
              "title": "Anal Fisting",
              "value": "tag/272/anal-fisting"
            },
            {
              "title": "Anal Play",
              "value": "tag/273/anal-play"
            },
            {
              "title": "Autofellatio",
              "value": "tag/276/autofellatio"
            },
            {
              "title": "Alley",
              "value": "tag/302/alley"
            },
            {
              "title": "Bar",
              "value": "tag/303/bar"
            },
            {
              "title": "Beach",
              "value": "tag/306/beach"
            },
            {
              "title": "Boat",
              "value": "tag/308/boat"
            },
            {
              "title": "Camp",
              "value": "tag/309/camp"
            },
            {
              "title": "Classroom",
              "value": "tag/311/classroom"
            },
            {
              "title": "College",
              "value": "tag/312/college"
            },
            {
              "title": "Garage",
              "value": "tag/314/garage"
            },
            {
              "title": "Hospital",
              "value": "tag/317/hospital"
            },
            {
              "title": "Library",
              "value": "tag/322/library"
            },
            {
              "title": "Limo",
              "value": "tag/323/limo"
            },
            {
              "title": "Locker Room",
              "value": "tag/325/locker-room"
            },
            {
              "title": "Night Club",
              "value": "tag/327/night-club"
            },
            {
              "title": "Park",
              "value": "tag/330/park"
            },
            {
              "title": "Parking Lot",
              "value": "tag/331/parking-lot"
            },
            {
              "title": "Police Station",
              "value": "tag/333/police-station"
            },
            {
              "title": "Prison",
              "value": "tag/335/prison"
            },
            {
              "title": "Restaurant",
              "value": "tag/337/restaurant"
            },
            {
              "title": "Sauna",
              "value": "tag/339/sauna"
            },
            {
              "title": "School",
              "value": "tag/340/school"
            },
            {
              "title": "Store",
              "value": "tag/344/store"
            },
            {
              "title": "Strip Club",
              "value": "tag/345/strip-club"
            },
            {
              "title": "Theater",
              "value": "tag/347/theater"
            },
            {
              "title": "Wedding",
              "value": "tag/348/wedding"
            },
            {
              "title": "Old",
              "value": "tag/352/old"
            },
            {
              "title": "Male to Female",
              "value": "tag/364/male-to-female"
            },
            {
              "title": "Asian Man",
              "value": "tag/372/asian-man"
            },
            {
              "title": "Australian Man",
              "value": "tag/373/australian-man"
            },
            {
              "title": "Cuban Male",
              "value": "tag/375/cuban-male"
            },
            {
              "title": "Army Man",
              "value": "tag/388/army-man"
            },
            {
              "title": "Artist",
              "value": "tag/389/artist"
            },
            {
              "title": "Athlete/Jock",
              "value": "tag/390/athletejock"
            },
            {
              "title": "Bartender",
              "value": "tag/391/bartender"
            },
            {
              "title": "Male Boss",
              "value": "tag/392/male-boss"
            },
            {
              "title": "Male Burglar",
              "value": "tag/393/male-burglar"
            },
            {
              "title": "Businessman",
              "value": "tag/394/businessman"
            },
            {
              "title": "Male Chef",
              "value": "tag/395/male-chef"
            },
            {
              "title": "Coach",
              "value": "tag/396/coach"
            },
            {
              "title": "Male Cop",
              "value": "tag/398/male-cop"
            },
            {
              "title": "Cowboy",
              "value": "tag/399/cowboy"
            },
            {
              "title": "Male Criminal",
              "value": "tag/400/male-criminal"
            },
            {
              "title": "Daddy/DILF",
              "value": "tag/401/daddydilf"
            },
            {
              "title": "Delivery Guy",
              "value": "tag/402/delivery-guy"
            },
            {
              "title": "Detective",
              "value": "tag/403/detective"
            },
            {
              "title": "Male Doctor",
              "value": "tag/404/male-doctor"
            },
            {
              "title": "Male Firefighter",
              "value": "tag/405/male-firefighter"
            },
            {
              "title": "Male Gangster",
              "value": "tag/406/male-gangster"
            },
            {
              "title": "Gardener",
              "value": "tag/407/gardener"
            },
            {
              "title": "Handy Man",
              "value": "tag/408/handy-man"
            },
            {
              "title": "Janitor",
              "value": "tag/410/janitor"
            },
            {
              "title": "Male Judge",
              "value": "tag/411/male-judge"
            },
            {
              "title": "Male Lawyer",
              "value": "tag/412/male-lawyer"
            },
            {
              "title": "Male Lifeguard",
              "value": "tag/413/male-lifeguard"
            },
            {
              "title": "Male Mechanic",
              "value": "tag/416/male-mechanic"
            },
            {
              "title": "Military Man",
              "value": "tag/417/military-man"
            },
            {
              "title": "Nerd",
              "value": "tag/418/nerd"
            },
            {
              "title": "Pharmacist",
              "value": "tag/419/pharmacist"
            },
            {
              "title": "Photographer",
              "value": "tag/420/photographer"
            },
            {
              "title": "Pilot",
              "value": "tag/421/pilot"
            },
            {
              "title": "Male Plumber",
              "value": "tag/423/male-plumber"
            },
            {
              "title": "Pool Guy",
              "value": "tag/425/pool-guy"
            },
            {
              "title": "Male Prisoner",
              "value": "tag/428/male-prisoner"
            },
            {
              "title": "Professional/White Collar",
              "value": "tag/429/professionalwhite-collar"
            },
            {
              "title": "Security Guard",
              "value": "tag/432/security-guard"
            },
            {
              "title": "Skater",
              "value": "tag/434/skater"
            },
            {
              "title": "Soldier",
              "value": "tag/435/soldier"
            },
            {
              "title": "Step-brother",
              "value": "tag/437/step-brother"
            },
            {
              "title": "Stepdad",
              "value": "tag/438/stepdad"
            },
            {
              "title": "Storeclerk",
              "value": "tag/440/storeclerk"
            },
            {
              "title": "Student",
              "value": "tag/442/student"
            },
            {
              "title": "Male Teacher",
              "value": "tag/443/male-teacher"
            },
            {
              "title": "Waiter",
              "value": "tag/445/waiter"
            },
            {
              "title": "Amateur",
              "value": "tag/447/amateur"
            },
            {
              "title": "Behind The Scenes",
              "value": "tag/453/behind-the-scenes"
            },
            {
              "title": "Boob play",
              "value": "tag/460/boob-play"
            },
            {
              "title": "Brazzers Live",
              "value": "tag/462/brazzers-live"
            },
            {
              "title": "Caught",
              "value": "tag/465/caught"
            },
            {
              "title": "classic/vintage",
              "value": "tag/467/classicvintage"
            },
            {
              "title": "Cosplay",
              "value": "tag/469/cosplay"
            },
            {
              "title": "Cuckold",
              "value": "tag/471/cuckold"
            },
            {
              "title": "Fan Submitted",
              "value": "tag/475/fan-submitted"
            },
            {
              "title": "First Anal",
              "value": "tag/477/first-anal"
            },
            {
              "title": "FIRST BG on ZZ",
              "value": "tag/478/first-bg-on-zz"
            },
            {
              "title": "Man/Woman",
              "value": "tag/479/manwoman"
            },
            {
              "title": "First DP",
              "value": "tag/480/first-dp"
            },
            {
              "title": "First Gangbang",
              "value": "tag/481/first-gangbang"
            },
            {
              "title": "First Scene Ever",
              "value": "tag/484/first-scene-ever"
            },
            {
              "title": "FIRST TIME ANAL on ZZ",
              "value": "tag/485/first-time-anal-on-zz"
            },
            {
              "title": "First Timers",
              "value": "tag/487/first-timers"
            },
            {
              "title": "FIRST ZZ ANAL",
              "value": "tag/488/first-zz-anal"
            },
            {
              "title": "FIRST ZZ GANGBANG",
              "value": "tag/490/first-zz-gangbang"
            },
            {
              "title": "Football",
              "value": "tag/492/football"
            },
            {
              "title": "Fuck My Wife",
              "value": "tag/493/fuck-my-wife"
            },
            {
              "title": "Guy fucks Trans",
              "value": "tag/500/guy-fucks-trans"
            },
            {
              "title": "International",
              "value": "tag/504/international"
            },
            {
              "title": "POV",
              "value": "tag/512/pov"
            },
            {
              "title": "Public Sex",
              "value": "tag/514/public-sex"
            },
            {
              "title": "Reality Porn",
              "value": "tag/516/reality-porn"
            },
            {
              "title": "Role Play",
              "value": "tag/517/role-play"
            },
            {
              "title": "Series",
              "value": "tag/521/series"
            },
            {
              "title": "Trans",
              "value": "tag/1451/trans"
            },
            {
              "title": "Trans fucks female",
              "value": "tag/525/trans-fucks-female"
            },
            {
              "title": "Sports",
              "value": "tag/529/sports"
            },
            {
              "title": "Wife Swap",
              "value": "tag/537/wife-swap"
            },
            {
              "title": "Briefs",
              "value": "tag/541/briefs"
            },
            {
              "title": "Blow Bang",
              "value": "tag/555/blow-bang"
            },
            {
              "title": "Bridge",
              "value": "tag/556/bridge"
            },
            {
              "title": "Doggystyle - Reverse",
              "value": "tag/565/doggystyle-reverse"
            },
            {
              "title": "Double Anal",
              "value": "tag/568/double-anal"
            },
            {
              "title": "Double Anal BJ",
              "value": "tag/569/double-anal-bj"
            },
            {
              "title": "Double Vaginal",
              "value": "tag/571/double-vaginal"
            },
            {
              "title": "Double Vaginal BJ",
              "value": "tag/572/double-vaginal-bj"
            },
            {
              "title": "DP - Standing",
              "value": "tag/573/dp-standing"
            },
            {
              "title": "DP BJ",
              "value": "tag/574/dp-bj"
            },
            {
              "title": "Keiran's Cowboy",
              "value": "tag/577/keirans-cowboy"
            },
            {
              "title": "Missionary - Reverse",
              "value": "tag/580/missionary-reverse"
            },
            {
              "title": "Pile Driver - POV",
              "value": "tag/582/pile-driver-pov"
            },
            {
              "title": "Reverse Piledriver",
              "value": "tag/588/reverse-piledriver"
            },
            {
              "title": "Side Fuck - POV",
              "value": "tag/591/side-fuck-pov"
            },
            {
              "title": "Side Rider BJ",
              "value": "tag/594/side-rider-bj"
            },
            {
              "title": "Slow Dance",
              "value": "tag/595/slow-dance"
            },
            {
              "title": "Spoon BJ",
              "value": "tag/597/spoon-bj"
            },
            {
              "title": "Standing 69",
              "value": "tag/600/standing-69"
            },
            {
              "title": "Super Woman",
              "value": "tag/601/super-woman"
            },
            {
              "title": "Tribbing",
              "value": "tag/602/tribbing"
            },
            {
              "title": "Anal Beads",
              "value": "tag/603/anal-beads"
            },
            {
              "title": "Ball Gag",
              "value": "tag/605/ball-gag"
            },
            {
              "title": "Handcuffs",
              "value": "tag/612/handcuffs"
            },
            {
              "title": "Masks",
              "value": "tag/614/masks"
            },
            {
              "title": "Ski Mask",
              "value": "tag/618/ski-mask"
            },
            {
              "title": "Sybian",
              "value": "tag/622/sybian"
            },
            {
              "title": "Whip",
              "value": "tag/625/whip"
            },
            {
              "title": "Cameltoe",
              "value": "tag/629/cameltoe"
            },
            {
              "title": "Body Stockings",
              "value": "tag/645/body-stockings"
            },
            {
              "title": "Colored Stockings",
              "value": "tag/646/colored-stockings"
            },
            {
              "title": "Christmas",
              "value": "tag/653/christmas"
            },
            {
              "title": "Halloween",
              "value": "tag/657/halloween"
            },
            {
              "title": "Independence Day",
              "value": "tag/658/independence-day"
            },
            {
              "title": "New Years",
              "value": "tag/659/new-years"
            },
            {
              "title": "Spanish",
              "value": "tag/660/spanish"
            },
            {
              "title": "St Patricks Day",
              "value": "tag/661/st-patricks-day"
            },
            {
              "title": "Thanksgiving",
              "value": "tag/663/thanksgiving"
            },
            {
              "title": "Valentines Day",
              "value": "tag/664/valentines-day"
            },
            {
              "title": "Big Boobs (Implants)",
              "value": "tag/670/big-boobs-implants"
            },
            {
              "title": "Puffy Nipples",
              "value": "tag/674/puffy-nipples"
            },
            {
              "title": "Ahegao",
              "value": "tag/684/ahegao"
            },
            {
              "title": "Futanari",
              "value": "tag/685/futanari"
            },
            {
              "title": "Tenants",
              "value": "tag/703/tenants"
            },
            {
              "title": "Female Orgasm",
              "value": "tag/704/female-orgasm"
            },
            {
              "title": "GILF",
              "value": "tag/705/gilf"
            },
            {
              "title": "Blowbang",
              "value": "tag/706/blowbang"
            },
            {
              "title": "Condom",
              "value": "tag/709/condom"
            },
            {
              "title": "First Man/Woman",
              "value": "tag/800/first-manwoman"
            },
            {
              "title": "Public Flashing",
              "value": "tag/1413/public-flashing"
            },
            {
              "title": "Black Friday",
              "value": "tag/1419/black-friday"
            },
            {
              "title": "Trans Man",
              "value": "tag/1469/trans-man"
            },
            {
              "title": "Playground Hills",
              "value": "tag/1581/playground-hills"
            },
            {
              "title": "TransZZ",
              "value": "tag/1701/transzz"
            },
            {
              "title": "VR",
              "value": "tag/1861/vr"
            },
            {
              "title": "Gamer Girl",
              "value": "tag/7681/gamer-girl"
            },
            {
              "title": "Video Games",
              "value": "tag/7701/video-games"
            },
            {
              "title": "Gamer",
              "value": "tag/7711/gamer"
            },
            {
              "title": "E Girls",
              "value": "tag/7721/e-girls"
            },
            {
              "title": "Girl Gamer",
              "value": "tag/7731/girl-gamer"
            },
            {
              "title": "Librarian",
              "value": "tag/7761/librarian"
            },
            {
              "title": "Reporter",
              "value": "tag/7781/reporter"
            },
            {
              "title": "Streamer",
              "value": "tag/7791/streamer"
            },
            {
              "title": "Tech Support",
              "value": "tag/7811/tech-support"
            },
            {
              "title": "Realtor",
              "value": "tag/7821/realtor"
            },
            {
              "title": "Food Truck",
              "value": "tag/7831/food-truck"
            },
            {
              "title": "Work From Home",
              "value": "tag/7841/work-from-home"
            },
            {
              "title": "Interactive Porn",
              "value": "tag/7871/interactive-porn"
            },
            {
              "title": "Interactive",
              "value": "tag/7881/interactive"
            },
            {
              "title": "Audio",
              "value": "tag/8201/audio"
            },
            {
              "title": "JOI",
              "value": "tag/8721/joi"
            },
            {
              "title": "Dirty-Talk",
              "value": "tag/8791/dirty-talk"
            },
            {
              "title": "Mixed",
              "value": "tag/9051/mixed"
            },
            {
              "title": "Moms",
              "value": "tag/9061/moms"
            },
            {
              "title": "Step Fantasy",
              "value": "tag/9071/step-fantasy"
            },
            {
              "title": "Pinay",
              "value": "tag/9081/pinay"
            },
            {
              "title": "Closed-Captioned",
              "value": "tag/9141/closed-captioned"
            },
            {
              "title": "First Blowbang",
              "value": "tag/9161/first-blowbang"
            },
            {
              "title": "South Asian",
              "value": "tag/9311/south-asian"
            },
            {
              "title": "BBQ",
              "value": "tag/9361/bbq"
            },
            {
              "title": "Taboo",
              "value": "tag/9791/taboo"
            },
            {
              "title": "Pussy To Mouth",
              "value": "tag/9821/pussy-to-mouth"
            },
            {
              "title": "Facial Hair",
              "value": "tag/9841/facial-hair"
            },
            {
              "title": "Courthouse",
              "value": "tag/9851/courthouse"
            },
            {
              "title": "Barbershop",
              "value": "tag/10163/barbershop"
            },
            {
              "title": "Podcast",
              "value": "tag/10167/podcast"
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
      "title": "搜索",
      "functionName": "search",
      "cacheDuration": 60,
      "params": [
        {
          "name": "keyword",
          "title": "关键词",
          "type": "input",
          "value": ""
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

var SITE = "https://brazz.org";
var PLAYER_HOST = "https://brazzpw.xyz";
var SUFFIX = "/free-brazz-premium-2026/";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = SITE + "/";

function t(v) {
  return String(v == null ? "" : v).trim();
}

function clean(s) {
  return t(s).replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&#039;/g, "'").replace(/\s+/g, " ");
}

// 取页面 HTML（浏览器 UA；brazzpw 侧 CF 按签名拦 bot UA）
async function getHtml(url) {
  try {
    var res = await Widget.http.get(url, {
      headers: {
        "User-Agent": UA,
        "Referer": REFERER,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      timeout: 20000
    });
    var data = res ? res.data : null;
    return typeof data === "string" ? data : "";
  } catch (e) {
    return "";
  }
}

// 列表基址 (不含域名与页码)
function listPath(tid) {
  if (tid === "latest") return "videos";
  if (tid.indexOf("sort/") === 0) return "videos/sortby/" + tid.slice(5);
  if (tid.indexOf("site/") === 0) return "videos/" + tid;
  if (tid.indexOf("tag/") === 0) return "videos/tags/" + tid.slice(4);
  return "videos";
}

function listUrl(tid, page) {
  page = Math.max(1, page || 1);
  var base = SITE + "/" + listPath(tid);
  return page > 1 ? base + "/page/" + page + SUFFIX : base + SUFFIX;
}

// 解析列表卡片 (首页/分类/搜索通用: article.loop-video) → REX 卡片
function parseCards(html) {
  var out = [];
  var seen = {};
  var blocks = String(html || "").split("<article");
  for (var i = 1; i < blocks.length; i++) {
    var win = blocks[i].slice(0, 3000);
    var am = win.match(/href="(https:\/\/brazz\.org\/video\/(\d+)\/[^"]*)"\s+title="([^"]*)"/);
    if (!am) continue;
    var durl = am[1];
    if (seen[durl]) continue;
    seen[durl] = true;
    var pic = "";
    var pm = win.match(/<img[^>]+data-src="([^"]+)"/) || win.match(/<img[^>]+src="(https:\/\/media-public[^"]+)"/);
    if (pm) pic = pm[1];
    var remarks = "";
    var dm = win.match(/class="duration">(?:<[^>]+>)*\s*([\d:]+)/);
    if (dm) remarks = dm[1];
    out.push({
      id: durl,
      type: "url",
      title: clean(am[3]) || am[2],
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: durl,
      description: remarks,
      releaseDate: remarks,
      mediaType: "movie"
    });
  }
  return out;
}

// 从分页链接取总页数 (只认分页块内、当前列表基址下的 /page/N/)
function parsePagecount(html, tid) {
  var s = String(html || "");
  var base = "/" + listPath(tid) + "/";
  var re = new RegExp(base.replace(/\//g, "\\/") + "page\\/(\\d+)\\/", "g");
  var max = 1;
  var blkRe = /class="pagination">([\s\S]*?)<\/ul>/g;
  var blk;
  while ((blk = blkRe.exec(s))) {
    var m;
    re.lastIndex = 0;
    while ((m = re.exec(blk[1]))) {
      var n = parseInt(m[1], 10);
      if (n > max && n < 100000) max = n;
    }
  }
  return max;
}

async function loadList(params) {
  params = params || {};
  var tid = t(params.path || params.cat || "latest") || "latest";
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var html = await getHtml(listUrl(tid, page));
  if (!html) {
    return page > 1 ? [] : [{ id: "err", type: "url", title: "载入失败，请稍后重试" }];
  }
  if (page > 1) {
    // 越界页守卫 (同蜘蛛): 站方越界会原样重发第 1 页且不带分页块
    var pc = parsePagecount(html, tid);
    if (pc <= 1) return [];
    var cur = html.match(/<a[^>]+href="[^"]*\/page\/(\d+)\/[^"]*"[^>]*class="current"/);
    if (cur && parseInt(cur[1], 10) < page) return [];
  }
  var list = parseCards(html);
  return list.length ? list : (page > 1 ? [] : [{ id: "empty", type: "url", title: "没有找到相关影片" }]);
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
  if (page > 1) return []; // 站内搜索单页最多 40 条，无分页 (同蜘蛛)
  var html = await getHtml(SITE + "/search" + SUFFIX + "?s=" + encodeURIComponent(wd));
  if (!html) return [{ id: "err", type: "url", title: "载入失败，请稍后重试" }];
  var list = parseCards(html);
  return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
}

// 相对地址解析 (不用 URL 构造器，沙箱更稳)
function resolveUrl(rel, base) {
  var s = String(rel || "");
  if (/^https?:\/\//i.test(s)) return s;
  var om = String(base || "").match(/^(https?:\/\/[^/]+)(\/[^?#]*)?/);
  if (!om) return s;
  var origin = om[1];
  var path = om[2] || "/";
  if (s.charAt(0) === "/") return origin + s;
  var dir = path.replace(/[^/]*$/, "");
  return origin + dir + s;
}

async function loadDetail(link) {
  var id = t(link);
  if (id.indexOf("$") >= 0) id = id.split("$").pop().trim();
  var durl = /^https?:\/\//.test(id) ? id : SITE + "/video/" + id.replace(/^\//, "");
  try {
    var html = await getHtml(durl);
    if (!html) {
      return { id: durl, type: "url", title: "载入失败", description: "详情页请求失败，请稍后重试" };
    }
    var name = "";
    var nm = html.match(/property="og:title"\s+content="([^"]*)"/);
    if (nm) name = clean(nm[1]).replace(/^Brazz\.Org\s*-\s*/i, "");
    var pic = "";
    var pm = html.match(/property="og:image"\s+content="([^"]*)"/);
    if (pm) pic = pm[1];
    var content = "";
    var cm = html.match(/<meta\s+name="description"\s+content="([^"]*)"/);
    if (cm) content = clean(cm[1]);
    // 演员: /videos/models/{id}/{slug}/ 链接 (去重，排除 "Show more")
    var actors = [];
    var seenA = {};
    var castRegion = html.split('<div class="tags">')[0];
    var amRe = /href="https:\/\/brazz\.org\/videos\/models\/\d+\/[^"]*"[^>]*>([^<]+)<\/a>/g;
    var am;
    while ((am = amRe.exec(castRegion))) {
      var a = clean(am[1]);
      if (a && !seenA[a] && !/show more/i.test(a)) { seenA[a] = true; actors.push(a); }
    }
    if (actors.length) content = (content ? content + " " : "") + "演员：" + actors.join("、");

    // ===== 播放解析 (蜘蛛 play 逻辑并入详情) =====
    var vidm = durl.match(/\/video\/(\d+)\//);
    var vid = vidm ? vidm[1] : "";
    var videoUrl = "";
    var playerUrl = "";
    var im = html.match(/<iframe[^>]+src="(https:\/\/brazzpw\.xyz\/player\/\?[^"]+)"/);
    if (im) playerUrl = im[1].replace(/&amp;/g, "&");
    if (playerUrl) {
      var phtml = await getHtml(playerUrl);
      if (phtml) {
        var sm = phtml.match(/player\.src\(\{[^}]*?src:\s*"([^"]+)"/) || phtml.match(/src:\s*"(m3u8_[^"]+)"/);
        if (sm) videoUrl = resolveUrl(sm[1], playerUrl);
      }
    }
    // 兜底: hash 不校验，凭视频 id 直接构造 (实测 hash=1 可出全量列表)
    if (!videoUrl && vid) {
      videoUrl = PLAYER_HOST + "/player/m3u8_" + vid + ".m3u8?hash=1";
    }
    if (!videoUrl) {
      return { id: durl, type: "url", title: name || "解析失败", description: "未找到播放地址" };
    }
    return {
      id: durl,
      type: "detail",
      title: name || durl,
      link: durl,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": durl
      },
      description: content || name
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
