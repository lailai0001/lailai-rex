// BigButtsHub for REX (lai_bigbuttshub v1.0.0)
// 移植自 mira-cat 蜘蛛 bigbuttshub.js (py_bigbuttshub, 2026-10-21 第三轮定版)。
// 后端：https://bigbuttshub.com（WordPress 成人聚合站，SSR 直出，无 CF 拦截）。
// 列表：WP REST /wp-json/wp/v2/posts 按 taxonomy 分页（权威），封面用 _embedded
//       特征图 wpst_thumb_large；REST 不可用回退 HTML 归档第一页解析。
// 分类：915 个（分类 226 + 标签 260 + 演员 429，与蜘蛛 CATS 全量一致，n 为站方 term id）。
// 线路（按蜘蛛优先级在详情时选最优一条）：
//   1. vidhide (bigbuttshub.top / bigbuttshub3.top)：验活后走已部署 Worker
//      bigbuttshub-vidhide 全链代理（分片伪装头剥离在 Worker 侧）；已删的线不生成，
//      无 hls4 的弱线降到末位兜底。
//   2. streamcash：embed 页 __PCr base64 配置含 CDN 直链，模块内直接解出（旧 /pass
//      铸造逻辑保留兜底）；直链与 IP 无关，列表/分片实拉验通。
//   3. Byse (bigbuttshub2.top / bysetayico.com)：公开 API + AES-256-GCM 加密
//      playback 载荷，纯 JS 解密在本模块内（无 Node crypto / WebCrypto 依赖，
//      与蜘蛛同一套已验实现）。注意：该 API 对机房/代理出口回 403、流令牌绑定
//      铸造方 ASN——REX 模块本就跑在设备侧，同出口自洽；机房无法代验，只能真机定。
// 其余未知宿主在猫源里只有 parse:1 嗅探线，REX 无嗅探能力，解析不到直链时如实返回失败卡。

WidgetMetadata = {
  "id": "lai_bigbuttshub",
  "title": "BigButtsHub",
  "description": "BigButtsHub：915 分类（分类 226 + 标签 260 + 演员 429 全量）；vidhide 走 Worker 全链，streamcash/Byse 设备侧直解，最高 1080p",
  "author": "lai",
  "version": "1.0.0",
  "requiredVersion": "0.0.1",
  "site": "https://bigbuttshub.com",
  "detailCacheDuration": 180,
  "modules": [
    {
      "title": "最新",
      "functionName": "loadList",
      "cacheDuration": 180,
      "params": [
        {
          "name": "path",
          "title": "最新",
          "type": "constant",
          "value": ""
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
      "title": "分类",
      "functionName": "loadList",
      "cacheDuration": 180,
      "params": [
        {
          "name": "path",
          "title": "分类",
          "type": "enumeration",
          "value": "c_onlyfans",
          "enumOptions": [
            {
              "title": "OnlyFans",
              "value": "c_onlyfans"
            },
            {
              "title": "BangBros",
              "value": "c_bangbros"
            },
            {
              "title": "Brazzers",
              "value": "c_brazzers"
            },
            {
              "title": "BrazzersExxtra",
              "value": "c_brazzers~brazzersexxtra"
            },
            {
              "title": "AssParade",
              "value": "c_bangbros~assparade"
            },
            {
              "title": "Amateur",
              "value": "c_amateur"
            },
            {
              "title": "Jules Jordan",
              "value": "c_jules-jordan"
            },
            {
              "title": "Naughty America",
              "value": "c_naughty-america"
            },
            {
              "title": "Reality Kings",
              "value": "c_reality-kings"
            },
            {
              "title": "Mylf",
              "value": "c_mylf"
            },
            {
              "title": "Team Skeet",
              "value": "c_team-skeet"
            },
            {
              "title": "ThePOVGod",
              "value": "c_thepovgod"
            },
            {
              "title": "RKPrime",
              "value": "c_reality-kings~rkprime"
            },
            {
              "title": "BigTitsRoundAsses",
              "value": "c_bangbros~bigtitsroundasses"
            },
            {
              "title": "PAWGed",
              "value": "c_pawged"
            },
            {
              "title": "BigWettButts",
              "value": "c_brazzers~bigwettbutts"
            },
            {
              "title": "PervMom",
              "value": "c_pervmom"
            },
            {
              "title": "Evil Angel",
              "value": "c_evil-angel"
            },
            {
              "title": "Mr Lucky POV",
              "value": "c_mr-lucky-pov"
            },
            {
              "title": "MyDirtyMaid",
              "value": "c_bangbros~mydirtymaid"
            },
            {
              "title": "Nympho",
              "value": "c_nympho"
            },
            {
              "title": "Public Bang",
              "value": "c_bangbros~public-bang"
            },
            {
              "title": "FreakMobMedia",
              "value": "c_freakmobmedia"
            },
            {
              "title": "HardX",
              "value": "c_hardx"
            },
            {
              "title": "MomIsHorny",
              "value": "c_bangbros~momishorny"
            },
            {
              "title": "Aletta Ocean LIVE",
              "value": "c_aletta-ocean-live"
            },
            {
              "title": "My Pervy Family",
              "value": "c_my-pervy-family"
            },
            {
              "title": "Bang",
              "value": "c_bang"
            },
            {
              "title": "Filthy Kings",
              "value": "c_filthy-kings"
            },
            {
              "title": "BangbrosClips",
              "value": "c_bangbros~bangbrosclips"
            },
            {
              "title": "BigTitCreampie",
              "value": "c_bangbros~bigtitcreampie"
            },
            {
              "title": "Miss Lexa",
              "value": "c_miss-lexa"
            },
            {
              "title": "MyFriendsHotMom",
              "value": "c_naughty-america~myfriendshotmom"
            },
            {
              "title": "YinyLeon",
              "value": "c_yinyleon"
            },
            {
              "title": "Anal Only",
              "value": "c_anal-only"
            },
            {
              "title": "BangPOV",
              "value": "c_bangbros~bangpov"
            },
            {
              "title": "BigButtsLikeItBig",
              "value": "c_brazzers~bigbuttslikeitbig"
            },
            {
              "title": "MILFBody",
              "value": "c_mylf~milfbody"
            },
            {
              "title": "Teen Curves",
              "value": "c_team-skeet~teen-curves"
            },
            {
              "title": "Tonight's Girlfriend",
              "value": "c_naughty-america~tonights-girlfriend"
            },
            {
              "title": "Deeper",
              "value": "c_deeper"
            },
            {
              "title": "True Anal",
              "value": "c_true-anal"
            },
            {
              "title": "Tushy",
              "value": "c_tushy"
            },
            {
              "title": "Bratty MILF",
              "value": "c_bratty-milf"
            },
            {
              "title": "ManyVids",
              "value": "c_manyvids"
            },
            {
              "title": "Mofos",
              "value": "c_mofos"
            },
            {
              "title": "Penthouse Gold",
              "value": "c_penthouse-gold"
            },
            {
              "title": "PornstarsLikeItBig",
              "value": "c_brazzers~pornstarslikeitbig"
            },
            {
              "title": "Sexmex",
              "value": "c_sexmex"
            },
            {
              "title": "Anal Mom",
              "value": "c_anal-mom"
            },
            {
              "title": "Angela White",
              "value": "c_angela-white"
            },
            {
              "title": "Blacked Raw",
              "value": "c_blacked-raw"
            },
            {
              "title": "Deep Lush",
              "value": "c_deep-lush"
            },
            {
              "title": "DirtyMasseur",
              "value": "c_brazzers~dirtymasseur"
            },
            {
              "title": "Freeuse MILF",
              "value": "c_freeuse-milf"
            },
            {
              "title": "SexSelector",
              "value": "c_bangbros~sexselector"
            },
            {
              "title": "FamilyTherapy",
              "value": "c_familytherapy"
            },
            {
              "title": "Fill Up My Mom",
              "value": "c_fill-up-my-mom"
            },
            {
              "title": "Filthy POV",
              "value": "c_filthy-pov"
            },
            {
              "title": "Got Mylf",
              "value": "c_mylf~got-mylf"
            },
            {
              "title": "Her Limit",
              "value": "c_her-limit"
            },
            {
              "title": "Hot Girls Raw",
              "value": "c_hot-girls-raw"
            },
            {
              "title": "Mia Malkova",
              "value": "c_mia-malkova"
            },
            {
              "title": "MySistersHotfriend",
              "value": "c_naughty-america~mysistershotfriend"
            },
            {
              "title": "Rickys Room",
              "value": "c_rickys-room"
            },
            {
              "title": "Tushy Raw",
              "value": "c_tushy-raw"
            },
            {
              "title": "All Anal",
              "value": "c_all-anal"
            },
            {
              "title": "BangBros18",
              "value": "c_bangbros~bangbros18"
            },
            {
              "title": "Blacked",
              "value": "c_blakced"
            },
            {
              "title": "Blondie Fesser",
              "value": "c_blondie-fesser"
            },
            {
              "title": "Dad Crush",
              "value": "c_dad-crush"
            },
            {
              "title": "DayWithAPornstar",
              "value": "c_brazzers~daywithapornstar"
            },
            {
              "title": "DirtyWivesClub",
              "value": "c_naughty-america~dirtywivesclub"
            },
            {
              "title": "HotwifeXXX",
              "value": "c_hotwifexxx"
            },
            {
              "title": "HouseOFrye",
              "value": "c_houseofrye"
            },
            {
              "title": "LetsPostIt",
              "value": "c_mofos~letspostit"
            },
            {
              "title": "Milfty",
              "value": "c_mylf~milfty"
            },
            {
              "title": "My Wife's Hot Friend",
              "value": "c_naughty-america~my-wifes-hot-friend"
            },
            {
              "title": "MylfOfTheMonth",
              "value": "c_mylf~mylfofthemonth"
            },
            {
              "title": "MylfxMissLexa",
              "value": "c_mylf~mylfxmisslexa"
            },
            {
              "title": "MyLifeInMiami",
              "value": "c_mylifeinmiami"
            },
            {
              "title": "PAWG",
              "value": "c_bangbros~pawg"
            },
            {
              "title": "RealWifeStories",
              "value": "c_brazzers~realwifestories"
            },
            {
              "title": "Vixen",
              "value": "c_vixen"
            },
            {
              "title": "Adult Time",
              "value": "c_adult-time"
            },
            {
              "title": "Angel Wicky",
              "value": "c_angel-wicky"
            },
            {
              "title": "Bratty Sis",
              "value": "c_bratty-sis"
            },
            {
              "title": "Crystal Lust",
              "value": "c_crystal-lust"
            },
            {
              "title": "Cum Fiesta",
              "value": "c_reality-kings~cum-fiesta"
            },
            {
              "title": "Devils Film",
              "value": "c_devils-film"
            },
            {
              "title": "Digital Playground",
              "value": "c_digital-playground"
            },
            {
              "title": "Elegant Angel",
              "value": "c_elegant-angel"
            },
            {
              "title": "Family Strokes",
              "value": "c_family-strokes"
            },
            {
              "title": "FamilyXXX",
              "value": "c_familyxxx"
            },
            {
              "title": "Filthy Massage",
              "value": "c_filthy-kings~filthy-massage"
            },
            {
              "title": "HandsOnHardcore",
              "value": "c_ddf-network~handsonhardcore"
            },
            {
              "title": "IHaveAWife",
              "value": "c_naughty-america~ihaveawife"
            },
            {
              "title": "Jada Stevens",
              "value": "c_jada-stevens"
            },
            {
              "title": "Kelsi Monroe",
              "value": "c_kelsi-monroe"
            },
            {
              "title": "Lauren Phillips",
              "value": "c_lauren-phillips"
            },
            {
              "title": "Lena Paul",
              "value": "c_lena-paul"
            },
            {
              "title": "Life Selector",
              "value": "c_life-selector"
            },
            {
              "title": "Luna Star",
              "value": "c_luna-star"
            },
            {
              "title": "MessyJessy",
              "value": "c_team-skeet~messyjessy"
            },
            {
              "title": "MILFY",
              "value": "c_milfy"
            },
            {
              "title": "Mom Comes First",
              "value": "c_mom-comes-first"
            },
            {
              "title": "Moms Teach Sex",
              "value": "c_moms-teach-sex"
            },
            {
              "title": "MyBabysittersClub",
              "value": "c_team-skeet~mybabysittersclub"
            },
            {
              "title": "MyGirlfriendsBustyFriend",
              "value": "c_naughty-america~mygirlfriendsbustyfriend"
            },
            {
              "title": "NaughtyOffice",
              "value": "c_naughty-america~naughtyoffice"
            },
            {
              "title": "Perfect Fucking Strangers",
              "value": "c_naughty-america~perfect-fucking-strangers"
            },
            {
              "title": "Perv City",
              "value": "c_perv-city"
            },
            {
              "title": "POVD",
              "value": "c_povd"
            },
            {
              "title": "Property Sex",
              "value": "c_property-sex"
            },
            {
              "title": "Ryan Conner",
              "value": "c_ryan-conner"
            },
            {
              "title": "Sex Mex",
              "value": "c_sex-mex"
            },
            {
              "title": "Spizoo",
              "value": "c_spizoo"
            },
            {
              "title": "TeenPies",
              "value": "c_team-skeet~teenpies"
            },
            {
              "title": "TheRealWorkout",
              "value": "c_team-skeet~therealworkout"
            },
            {
              "title": "Touch My Wife",
              "value": "c_touch-my-wife"
            },
            {
              "title": "Victoria June",
              "value": "c_victoria-june"
            },
            {
              "title": "Violet Myers",
              "value": "c_violet-myers"
            },
            {
              "title": "Vivian Taylor",
              "value": "c_vivian-taylor"
            },
            {
              "title": "Abella Danger",
              "value": "c_abella-danger"
            },
            {
              "title": "Aletta Ocean",
              "value": "c_aletta-ocean"
            },
            {
              "title": "Alura Jenson",
              "value": "c_alura-jenson"
            },
            {
              "title": "Analized",
              "value": "c_analized"
            },
            {
              "title": "AnalTherapyXXX",
              "value": "c_analtherapyxxx"
            },
            {
              "title": "Asshole Fever",
              "value": "c_asshole-fever"
            },
            {
              "title": "AssMasterpiece",
              "value": "c_naughty-america~assmasterpiece"
            },
            {
              "title": "Babes",
              "value": "c_babes"
            },
            {
              "title": "Baddies POV",
              "value": "c_baddies-pov"
            },
            {
              "title": "BadMilfs",
              "value": "c_team-skeet~badmilfs"
            },
            {
              "title": "Bang Bus",
              "value": "c_bangbros~bang-bus"
            },
            {
              "title": "Bang Roadside",
              "value": "c_bang~bang-roadside"
            },
            {
              "title": "BBC Pie",
              "value": "c_bbc-pie"
            },
            {
              "title": "BFFS",
              "value": "c_bffs"
            },
            {
              "title": "Brandi Love",
              "value": "c_brandi-love"
            },
            {
              "title": "Breeding Material",
              "value": "c_team-skeet~breeding-material"
            },
            {
              "title": "Bridgette B.",
              "value": "c_bridgette-b"
            },
            {
              "title": "Brooklyn Gray",
              "value": "c_brooklyn-gray"
            },
            {
              "title": "CastingCouchHD",
              "value": "c_castingcouchhd"
            },
            {
              "title": "Cherry Pimps",
              "value": "c_cherry-pimps"
            },
            {
              "title": "Crazy College GFs",
              "value": "c_reality-kings~crazy-college-gfs"
            },
            {
              "title": "Cum 4K",
              "value": "c_cum-4k"
            },
            {
              "title": "Dad's Love Porn",
              "value": "c_bangbros~dads-love-porn"
            },
            {
              "title": "Dani Daniels",
              "value": "c_dani-daniels"
            },
            {
              "title": "DarkX",
              "value": "c_darkx"
            },
            {
              "title": "DDF Network",
              "value": "c_ddf-network"
            },
            {
              "title": "Dick Drainers",
              "value": "c_dick-drainers"
            },
            {
              "title": "Dirty Auditions",
              "value": "c_dirty-auditions"
            },
            {
              "title": "Elegant Raw",
              "value": "c_elegant-raw"
            },
            {
              "title": "Emily Addison",
              "value": "c_emily-addison"
            },
            {
              "title": "Erotic Spice",
              "value": "c_erotic-spice"
            },
            {
              "title": "ExxxtraSmall",
              "value": "c_team-skeet~exxxtrasmall"
            },
            {
              "title": "Got Filled",
              "value": "c_got-filled"
            },
            {
              "title": "He's Got Rizz",
              "value": "c_mofos~hes-got-rizz"
            },
            {
              "title": "Hijab Mylfs",
              "value": "c_mylf~hijab-mylfs"
            },
            {
              "title": "Holed",
              "value": "c_holed"
            },
            {
              "title": "HotAndMean",
              "value": "c_brazzers~hotandmean"
            },
            {
              "title": "I Know That Girl",
              "value": "c_mofos~i-know-that-girl"
            },
            {
              "title": "IMadePorn",
              "value": "c_team-skeet~imadeporn"
            },
            {
              "title": "Joslyn James",
              "value": "c_joslyn-james"
            },
            {
              "title": "Julie Cash",
              "value": "c_julie-cash"
            },
            {
              "title": "Kelsi Monroe XXX",
              "value": "c_kelsi-monroe-xxx"
            },
            {
              "title": "Kyra Hot",
              "value": "c_kyra-hot"
            },
            {
              "title": "Lethal Hardcore",
              "value": "c_lethal-hardcore"
            },
            {
              "title": "Lilly Hall",
              "value": "c_lilly-hall"
            },
            {
              "title": "Lily Lane",
              "value": "c_lily-lane"
            },
            {
              "title": "Look At Her Now",
              "value": "c_reality-kings~look-at-her-now"
            },
            {
              "title": "MILF Hunter",
              "value": "c_reality-kings~milf-hunter"
            },
            {
              "title": "MILF Overload",
              "value": "c_milf-overload"
            },
            {
              "title": "MilfsLikeItBig",
              "value": "c_brazzers~milfslikeitbig"
            },
            {
              "title": "Mom Drips",
              "value": "c_mylf~mom-drips"
            },
            {
              "title": "Moms Tight",
              "value": "c_moms-tight"
            },
            {
              "title": "Mona Azar",
              "value": "c_mona-azar"
            },
            {
              "title": "Monster Curves",
              "value": "c_reality-kings~monster-curves"
            },
            {
              "title": "MonstersOfCock",
              "value": "c_bangbros~monstersofcock"
            },
            {
              "title": "Mr Lucky Raw",
              "value": "c_mr-lucky-raw"
            },
            {
              "title": "MrAnal",
              "value": "c_bangbros~mranal"
            },
            {
              "title": "My Naughty Massage",
              "value": "c_naughty-america~my-naughty-massage"
            },
            {
              "title": "MyDadsHotGirlfriend",
              "value": "c_naughty-america~mydadshotgirlfriend"
            },
            {
              "title": "MyDaughtersHotFriend",
              "value": "c_naughty-america~mydaughtershotfriend"
            },
            {
              "title": "Mylf Labs",
              "value": "c_mylf~mylf-labs"
            },
            {
              "title": "NaughtyAthletics",
              "value": "c_naughty-america~naughtyathletics"
            },
            {
              "title": "NeighborAffair",
              "value": "c_naughty-america~neighboraffair"
            },
            {
              "title": "New Sensations",
              "value": "c_new-sensations"
            },
            {
              "title": "Oops Family",
              "value": "c_oops-family"
            },
            {
              "title": "Pamela Rios",
              "value": "c_pamela-rios"
            },
            {
              "title": "Payton Preslee",
              "value": "c_payton-preslee"
            },
            {
              "title": "Perv Mom",
              "value": "c_perv-mom"
            },
            {
              "title": "Perv Principal",
              "value": "c_perv-principal"
            },
            {
              "title": "Phoenix Marie",
              "value": "c_phoenix-marie"
            },
            {
              "title": "Porn Dude Casting",
              "value": "c_porn-dude-casting"
            },
            {
              "title": "Porn Force",
              "value": "c_porn-force"
            },
            {
              "title": "PornStar Spa",
              "value": "c_bangbros~pornstar-spa"
            },
            {
              "title": "POV Masters",
              "value": "c_pov-masters"
            },
            {
              "title": "POVLife",
              "value": "c_team-skeet~povlife"
            },
            {
              "title": "Private",
              "value": "c_private"
            },
            {
              "title": "Pure Mature",
              "value": "c_pure-mature"
            },
            {
              "title": "Rachel Starr",
              "value": "c_rachel-starr"
            },
            {
              "title": "Rose Monroe",
              "value": "c_rose-monroe"
            },
            {
              "title": "SeducedByACougar",
              "value": "c_naughty-america~seducedbyacougar"
            },
            {
              "title": "Shoplyfter MYLF",
              "value": "c_shoplyfter-mylf"
            },
            {
              "title": "SimplyAnal",
              "value": "c_simplyanal"
            },
            {
              "title": "Siri Dahl",
              "value": "c_siri-dahl"
            },
            {
              "title": "SneakySex",
              "value": "c_reality-kings~sneakysex"
            },
            {
              "title": "Spank Monster",
              "value": "c_spank-monster"
            },
            {
              "title": "Stay Home MILF",
              "value": "c_mylf~stay-home-milf"
            },
            {
              "title": "Stuck 4K",
              "value": "c_stuck-4k"
            },
            {
              "title": "Susy Gala",
              "value": "c_susy-gala"
            },
            {
              "title": "Sybil Stallone",
              "value": "c_sybil-stallone"
            },
            {
              "title": "Taboo Heat",
              "value": "c_taboo-heat"
            },
            {
              "title": "TeamSkeet Labs",
              "value": "c_team-skeet~teamskeet-labs"
            },
            {
              "title": "Teen Fidelity",
              "value": "c_teen-fidelity"
            },
            {
              "title": "Teens Do Porn",
              "value": "c_team-skeet~teens-do-porn"
            },
            {
              "title": "Teens Love Huge Cocks",
              "value": "c_reality-kings~teens-love-huge-cocks"
            },
            {
              "title": "TeensLikeItBig",
              "value": "c_brazzers~teenslikeitbig"
            },
            {
              "title": "The White Boxxx",
              "value": "c_the-white-boxxx"
            },
            {
              "title": "TheLoft",
              "value": "c_team-skeet~theloft"
            },
            {
              "title": "Thundercock",
              "value": "c_naughty-america~thundercock"
            },
            {
              "title": "Tough Love X",
              "value": "c_tough-love-x"
            },
            {
              "title": "UsePOV",
              "value": "c_mylf~usepov"
            },
            {
              "title": "Work Me Harder",
              "value": "c_reality-kings~work-me-harder"
            },
            {
              "title": "WorkMeHarder",
              "value": "c_reality-kings~workmeharder"
            },
            {
              "title": "ZZ Series",
              "value": "c_brazzers~zz-series"
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
          "value": "t_curvy",
          "enumOptions": [
            {
              "title": "Curvy",
              "value": "t_curvy"
            },
            {
              "title": "Bubble Butt",
              "value": "t_bubble-butt"
            },
            {
              "title": "Big Tits",
              "value": "t_big-tits"
            },
            {
              "title": "PAWG",
              "value": "t_pawg"
            },
            {
              "title": "Thick",
              "value": "t_thick"
            },
            {
              "title": "MILF",
              "value": "t_milf"
            },
            {
              "title": "Rough Sex",
              "value": "t_rough-sex"
            },
            {
              "title": "Phat Ass",
              "value": "t_phat-ass"
            },
            {
              "title": "Brunette",
              "value": "t_brunette"
            },
            {
              "title": "Fit Ass",
              "value": "t_fit-ass"
            },
            {
              "title": "Teen",
              "value": "t_teen"
            },
            {
              "title": "Blonde",
              "value": "t_blonde"
            },
            {
              "title": "Oil",
              "value": "t_oil"
            },
            {
              "title": "Big Booty OnlyFans",
              "value": "t_big-booty-onlyfans"
            },
            {
              "title": "Facial",
              "value": "t_facial"
            },
            {
              "title": "POV",
              "value": "t_pov"
            },
            {
              "title": "Interracial",
              "value": "t_interracial"
            },
            {
              "title": "Latina",
              "value": "t_latina"
            },
            {
              "title": "Anal",
              "value": "t_anal"
            },
            {
              "title": "Blowjob",
              "value": "t_blowjob"
            },
            {
              "title": "Doggystyle",
              "value": "t_doggystyle"
            },
            {
              "title": "Rim Job",
              "value": "t_rim-job"
            },
            {
              "title": "Booty Jiggle",
              "value": "t_booty-jiggle"
            },
            {
              "title": "Cheating",
              "value": "t_cheating"
            },
            {
              "title": "Missionary",
              "value": "t_missionary"
            },
            {
              "title": "Cowgirl",
              "value": "t_cowgirl"
            },
            {
              "title": "Reverse-Cowgirl",
              "value": "t_reverse-cowgirl"
            },
            {
              "title": "Threesome",
              "value": "t_threesome"
            },
            {
              "title": "Tattoo",
              "value": "t_tattoo"
            },
            {
              "title": "Ass Worship",
              "value": "t_ass-worship"
            },
            {
              "title": "Huge Booty",
              "value": "t_huge-booty"
            },
            {
              "title": "Sneaky Sex",
              "value": "t_sneaky-sex"
            },
            {
              "title": "Creampie",
              "value": "t_creampie"
            },
            {
              "title": "Hardcore",
              "value": "t_hardcore"
            },
            {
              "title": "Fishnets",
              "value": "t_fishnets"
            },
            {
              "title": "Yoga Pants",
              "value": "t_yoga-pants"
            },
            {
              "title": "Deepthroat",
              "value": "t_deepthroat"
            },
            {
              "title": "Workout",
              "value": "t_workout"
            },
            {
              "title": "Stepmom",
              "value": "t_stepmom"
            },
            {
              "title": "Wife",
              "value": "t_wife"
            },
            {
              "title": "Public",
              "value": "t_public"
            },
            {
              "title": "BBW",
              "value": "t_bbw"
            },
            {
              "title": "Massage",
              "value": "t_massage"
            },
            {
              "title": "Gape",
              "value": "t_gape"
            },
            {
              "title": "Red Head",
              "value": "t_red-head"
            },
            {
              "title": "Stepsister",
              "value": "t_stepsister"
            },
            {
              "title": "Round Butt",
              "value": "t_round-butt"
            },
            {
              "title": "Butt Plug",
              "value": "t_butt-plug"
            },
            {
              "title": "BBC",
              "value": "t_bbc"
            },
            {
              "title": "FFM Threesome",
              "value": "t_ffm-threesome"
            },
            {
              "title": "Twerking",
              "value": "t_twerking"
            },
            {
              "title": "Anal Creampie",
              "value": "t_anal-creampie"
            },
            {
              "title": "Maid",
              "value": "t_maid"
            },
            {
              "title": "Big Booty Lissa Aires",
              "value": "t_big-booty-lissa-aires"
            },
            {
              "title": "Ebony",
              "value": "t_ebony"
            },
            {
              "title": "Squirt",
              "value": "t_squirt"
            },
            {
              "title": "Big Booty Jenna Starr",
              "value": "t_big-booty-jenna-starr"
            },
            {
              "title": "Big Booty The Official Egypt",
              "value": "t_big-booty-the-official-egypt"
            },
            {
              "title": "Outdoor",
              "value": "t_outdoor"
            },
            {
              "title": "Big Booty Brandylicious",
              "value": "t_big-booty-brandylicious"
            },
            {
              "title": "Double Blowjob",
              "value": "t_double-blowjob"
            },
            {
              "title": "Stepdaughter",
              "value": "t_stepdaughter"
            },
            {
              "title": "Freeuse",
              "value": "t_freeuse"
            },
            {
              "title": "Office Sex",
              "value": "t_office-sex"
            },
            {
              "title": "PAWG Auhneesh Nicole",
              "value": "t_pawg-auhneesh-nicole"
            },
            {
              "title": "Sideways Fucking",
              "value": "t_sideways-fucking"
            },
            {
              "title": "Face Fucking",
              "value": "t_face-fucking"
            },
            {
              "title": "Lesbian",
              "value": "t_lesbian"
            },
            {
              "title": "Big Booty Kaden Kole",
              "value": "t_big-booty-kaden-kole"
            },
            {
              "title": "Big Booty Karmen Karma",
              "value": "t_big-booty-karmen-karma"
            },
            {
              "title": "Big Booty Luna Star",
              "value": "t_big-booty-luna-star"
            },
            {
              "title": "Big Booty Maria Gjieli",
              "value": "t_big-booty-maria-gjieli"
            },
            {
              "title": "Big Booty Abigaiil Morris",
              "value": "t_big-booty-abigaiil-morris"
            },
            {
              "title": "Big Booty Sara Retali",
              "value": "t_big-booty-sara-retali"
            },
            {
              "title": "Spanking Ass",
              "value": "t_spanking-ass"
            },
            {
              "title": "Big Booty GracieBon",
              "value": "t_big-booty-graciebon"
            },
            {
              "title": "Big Booty Raven Thick",
              "value": "t_big-booty-raven-thick"
            },
            {
              "title": "Big Booty Violet Myers",
              "value": "t_big-booty-violet-myers"
            },
            {
              "title": "Cum on Ass",
              "value": "t_cum-on-ass"
            },
            {
              "title": "Cumshot",
              "value": "t_cumshot"
            },
            {
              "title": "Cunnilingus",
              "value": "t_cunnilingus"
            },
            {
              "title": "Big Booty Brandy Salazar",
              "value": "t_big-booty-brandy-salazar"
            },
            {
              "title": "Big Booty Gracie Bon",
              "value": "t_big-booty-gracie-bon"
            },
            {
              "title": "Big Booty Katalina Kyle",
              "value": "t_big-booty-katalina-kyle"
            },
            {
              "title": "Big Booty Madison Moores",
              "value": "t_big-booty-madison-moores"
            },
            {
              "title": "Big Booty Mandy Muse",
              "value": "t_big-booty-mandy-muse"
            },
            {
              "title": "Big Booty Vivian Taylor",
              "value": "t_big-booty-vivian-taylor"
            },
            {
              "title": "Prone Bone",
              "value": "t_prone-bone"
            },
            {
              "title": "Backshots",
              "value": "t_backshots"
            },
            {
              "title": "Big Booty Andie Anderson",
              "value": "t_big-booty-andie-anderson"
            },
            {
              "title": "Big Booty Kali Roses",
              "value": "t_big-booty-kali-roses"
            },
            {
              "title": "Big Booty Kayley Gunner",
              "value": "t_big-booty-kayley-gunner"
            },
            {
              "title": "Big Booty Lacey Jayne",
              "value": "t_big-booty-lacey-jayne"
            },
            {
              "title": "Big Booty Lila Hayes",
              "value": "t_big-booty-lila-hayes"
            },
            {
              "title": "Big Booty Mz Dani",
              "value": "t_big-booty-mz-dani"
            },
            {
              "title": "Big Booty Slimthick Vic",
              "value": "t_big-booty-slimthick-vic"
            },
            {
              "title": "Big Booty Vanessa Bohorquez",
              "value": "t_big-booty-vanessa-bohorquez"
            },
            {
              "title": "Big Booty Vitoria Beatriz",
              "value": "t_big-booty-vitoria-beatriz"
            },
            {
              "title": "Big Booty Willow Ryder",
              "value": "t_big-booty-willow-ryder"
            },
            {
              "title": "Nurse",
              "value": "t_nurse"
            },
            {
              "title": "perfect ass",
              "value": "t_perfect-ass"
            },
            {
              "title": "Standing Sex",
              "value": "t_standing-sex"
            },
            {
              "title": "Anal Play",
              "value": "t_anal-play"
            },
            {
              "title": "Big Booty Angela White",
              "value": "t_big-booty-angela-white"
            },
            {
              "title": "Big Booty Anissa Miller",
              "value": "t_big-booty-anissa-miller"
            },
            {
              "title": "Big Booty Cassie Lenoir",
              "value": "t_big-booty-cassie-lenoir"
            },
            {
              "title": "Big Booty Isabelle Eleanore",
              "value": "t_big-booty-isabelle-eleanore"
            },
            {
              "title": "Big Booty Richelle Ryan",
              "value": "t_big-booty-richelle-ryan"
            },
            {
              "title": "Spanking",
              "value": "t_spanking"
            },
            {
              "title": "Tit-Job",
              "value": "t_tit-job"
            },
            {
              "title": "Big Booty Alanna Pow",
              "value": "t_big-booty-alanna-pow"
            },
            {
              "title": "Big Booty Anais Amore",
              "value": "t_big-booty-anais-amore"
            },
            {
              "title": "Big Booty Candy Love",
              "value": "t_big-booty-candy-love"
            },
            {
              "title": "Big Booty Hayley Davies",
              "value": "t_big-booty-hayley-davies"
            },
            {
              "title": "Big Booty Juanita Belle",
              "value": "t_big-booty-juanita-belle"
            },
            {
              "title": "Big Booty Ms Sethi",
              "value": "t_big-booty-ms-sethi"
            },
            {
              "title": "Big Booty Nia Bleu",
              "value": "t_big-booty-nia-bleu"
            },
            {
              "title": "Big Booty Payton Preslee",
              "value": "t_big-booty-payton-preslee"
            },
            {
              "title": "Big Booty Raissa Bellini",
              "value": "t_big-booty-raissa-bellini"
            },
            {
              "title": "Big Booty Roxanne Roselle",
              "value": "t_big-booty-roxanne-roselle"
            },
            {
              "title": "Big Booty Tommy King",
              "value": "t_big-booty-tommy-king"
            },
            {
              "title": "Domination",
              "value": "t_domination"
            },
            {
              "title": "Double Penetration",
              "value": "t_double-penetration"
            },
            {
              "title": "Hotwife",
              "value": "t_hotwife"
            },
            {
              "title": "Step Family",
              "value": "t_step-family"
            },
            {
              "title": "Stockings",
              "value": "t_stockings"
            },
            {
              "title": "Teacher",
              "value": "t_teacher"
            },
            {
              "title": "Throatpie",
              "value": "t_throatpie"
            },
            {
              "title": "Asian",
              "value": "t_asian"
            },
            {
              "title": "Auhneesh Nicole",
              "value": "t_auhneesh-nicole"
            },
            {
              "title": "BDSM",
              "value": "t_bdsm"
            },
            {
              "title": "Big Booty Chloe Rannoch",
              "value": "t_big-booty-chloe-rannoch"
            },
            {
              "title": "Big Booty Comatozze",
              "value": "t_big-booty-comatozze"
            },
            {
              "title": "Big Booty Gigi Lysette",
              "value": "t_big-booty-gigi-lysette"
            },
            {
              "title": "Big Booty Giuliana Cabrazia",
              "value": "t_big-booty-giuliana-cabrazia"
            },
            {
              "title": "Big Booty Jakara Mitchell",
              "value": "t_big-booty-jakara-mitchell"
            },
            {
              "title": "Big Booty Karol Rosado",
              "value": "t_big-booty-karol-rosado"
            },
            {
              "title": "Big Booty Katty Soarez",
              "value": "t_big-booty-katty-soarez"
            },
            {
              "title": "Big Booty Kelsey Kane",
              "value": "t_big-booty-kelsey-kane"
            },
            {
              "title": "Big Booty Kristy Black",
              "value": "t_big-booty-kristy-black"
            },
            {
              "title": "Big Booty La Paisita Oficial",
              "value": "t_big-booty-la-paisita-oficial"
            },
            {
              "title": "Big Booty Lexis Star",
              "value": "t_big-booty-lexis-star"
            },
            {
              "title": "Big Booty Lily Phillips",
              "value": "t_big-booty-lily-phillips"
            },
            {
              "title": "Big Booty Madison Morgan",
              "value": "t_big-booty-madison-morgan"
            },
            {
              "title": "Big Booty Mellanie Monroe",
              "value": "t_big-booty-mellanie-monroe"
            },
            {
              "title": "Big Booty Mia Malkova",
              "value": "t_big-booty-mia-malkova"
            },
            {
              "title": "Big Booty Miss Boddy",
              "value": "t_big-booty-miss-boddy"
            },
            {
              "title": "Big Booty Miss Korinne",
              "value": "t_big-booty-miss-korinne"
            },
            {
              "title": "Big Booty Okichloeo",
              "value": "t_big-booty-okichloeo"
            },
            {
              "title": "Big Booty Ryan Conner",
              "value": "t_big-booty-ryan-conner"
            },
            {
              "title": "Big Booty Savannah Bond",
              "value": "t_big-booty-savannah-bond"
            },
            {
              "title": "Big Booty Sinatra Monroe",
              "value": "t_big-booty-sinatra-monroe"
            },
            {
              "title": "Big Booty Summer Brookes",
              "value": "t_big-booty-summer-brookes"
            },
            {
              "title": "Big Booty Toochi Kash",
              "value": "t_big-booty-toochi-kash"
            },
            {
              "title": "Big Booty Vanna Rose",
              "value": "t_big-booty-vanna-rose"
            },
            {
              "title": "Big Booty Zoey Uso",
              "value": "t_big-booty-zoey-uso"
            },
            {
              "title": "Bikini",
              "value": "t_bikini"
            },
            {
              "title": "Breeding",
              "value": "t_breeding"
            },
            {
              "title": "Car Sex",
              "value": "t_car-sex"
            },
            {
              "title": "Cosplay",
              "value": "t_cosplay"
            },
            {
              "title": "Cuckold",
              "value": "t_cuckold"
            },
            {
              "title": "Cum Swallow",
              "value": "t_cum-swallow"
            },
            {
              "title": "Cum Swap",
              "value": "t_cum-swap"
            },
            {
              "title": "Doctor",
              "value": "t_doctor"
            },
            {
              "title": "Face Sitting",
              "value": "t_face-sitting"
            },
            {
              "title": "FFM",
              "value": "t_ffm"
            },
            {
              "title": "Foursome",
              "value": "t_foursome"
            },
            {
              "title": "Gracie Bon",
              "value": "t_gracie-bon"
            },
            {
              "title": "Indian",
              "value": "t_indian"
            },
            {
              "title": "OnlyFans",
              "value": "t_onlyfans"
            },
            {
              "title": "Poolside Sex",
              "value": "t_poolside-sex"
            },
            {
              "title": "Sex At Work",
              "value": "t_sex-at-work"
            },
            {
              "title": "Anal Fingering",
              "value": "t_anal-fingering"
            },
            {
              "title": "Ass To Mouth",
              "value": "t_ass-to-mouth"
            },
            {
              "title": "Big Ass",
              "value": "t_big-ass"
            },
            {
              "title": "Big Booty 6ft Phenomenon",
              "value": "t_big-booty-6ft-phenomenon"
            },
            {
              "title": "Big Booty Abby Rose",
              "value": "t_big-booty-abby-rose"
            },
            {
              "title": "Big Booty Aletta Ocean",
              "value": "t_big-booty-aletta-ocean"
            },
            {
              "title": "Big Booty Alexa Payne",
              "value": "t_big-booty-alexa-payne"
            },
            {
              "title": "Big Booty Alice Thunder",
              "value": "t_big-booty-alice-thunder"
            },
            {
              "title": "Big Booty Ashley Barbie",
              "value": "t_big-booty-ashley-barbie"
            },
            {
              "title": "Big Booty Atlanta Moreno",
              "value": "t_big-booty-atlanta-moreno"
            },
            {
              "title": "Big Booty Ava Nicks",
              "value": "t_big-booty-ava-nicks"
            },
            {
              "title": "Big Booty Bella Rolland",
              "value": "t_big-booty-bella-rolland"
            },
            {
              "title": "Big Booty Caryn Beaumont",
              "value": "t_big-booty-caryn-beaumont"
            },
            {
              "title": "Big Booty Cassie Lenior",
              "value": "t_big-booty-cassie-lenior"
            },
            {
              "title": "Big Booty Cassie Solis",
              "value": "t_big-booty-cassie-solis"
            },
            {
              "title": "Big Booty Connie Perignon",
              "value": "t_big-booty-connie-perignon"
            },
            {
              "title": "Big Booty Crystal Lust",
              "value": "t_big-booty-crystal-lust"
            },
            {
              "title": "Big Booty Elana Bunnz",
              "value": "t_big-booty-elana-bunnz"
            },
            {
              "title": "Big Booty Emily Rinaudo",
              "value": "t_big-booty-emily-rinaudo"
            },
            {
              "title": "Big Booty Emma Magnolia",
              "value": "t_big-booty-emma-magnolia"
            },
            {
              "title": "Big Booty Gem Jewels",
              "value": "t_big-booty-gem-jewels"
            },
            {
              "title": "Big Booty Hailey Rose",
              "value": "t_big-booty-hailey-rose"
            },
            {
              "title": "Big Booty Holly Brougham",
              "value": "t_big-booty-holly-brougham"
            },
            {
              "title": "Big Booty Indianara Jung",
              "value": "t_big-booty-indianara-jung"
            },
            {
              "title": "Big Booty Jacqueline Valentine",
              "value": "t_big-booty-jacqueline-valentine"
            },
            {
              "title": "Big Booty Jada Stevens",
              "value": "t_big-booty-jada-stevens"
            },
            {
              "title": "Big Booty Jessie Rogers",
              "value": "t_big-booty-jessie-rogers"
            },
            {
              "title": "Big Booty Jocessita",
              "value": "t_big-booty-jocessita"
            },
            {
              "title": "Big Booty Krystal Kakes",
              "value": "t_big-booty-krystal-kakes"
            },
            {
              "title": "Big Booty Lorena Lorado",
              "value": "t_big-booty-lorena-lorado"
            },
            {
              "title": "Big Booty Lucky Kay",
              "value": "t_big-booty-lucky-kay"
            },
            {
              "title": "Big Booty Lucy Lotus",
              "value": "t_big-booty-lucy-lotus"
            },
            {
              "title": "Big Booty Luna Angel",
              "value": "t_big-booty-luna-angel"
            },
            {
              "title": "Big Booty Madison Ivy",
              "value": "t_big-booty-madison-ivy"
            },
            {
              "title": "Big Booty Maevaa Sinaloa",
              "value": "t_big-booty-maevaa-sinaloa"
            },
            {
              "title": "Big Booty Maria Bolona",
              "value": "t_big-booty-maria-bolona"
            },
            {
              "title": "Big Booty Martina Smeraldi",
              "value": "t_big-booty-martina-smeraldi"
            },
            {
              "title": "Big Booty MartinPaola",
              "value": "t_big-booty-martinpaola"
            },
            {
              "title": "Big Booty Melissa Stratton",
              "value": "t_big-booty-melissa-stratton"
            },
            {
              "title": "Big Booty Melztube",
              "value": "t_big-booty-melztube"
            },
            {
              "title": "Big Booty Mia Monroe",
              "value": "t_big-booty-mia-monroe"
            },
            {
              "title": "Big Booty Mona Azar",
              "value": "t_big-booty-mona-azar"
            },
            {
              "title": "Big Booty Morea Black",
              "value": "t_big-booty-morea-black"
            },
            {
              "title": "Big Booty Naomi Soraya",
              "value": "t_big-booty-naomi-soraya"
            },
            {
              "title": "Big Booty Natalia Starr",
              "value": "t_big-booty-natalia-starr"
            },
            {
              "title": "Big Booty Nataly Fabiola",
              "value": "t_big-booty-nataly-fabiola"
            },
            {
              "title": "Big Booty Nataly Ordonez",
              "value": "t_big-booty-nataly-ordonez"
            },
            {
              "title": "Big Booty Persia's Paradise",
              "value": "t_big-booty-persias-paradise"
            },
            {
              "title": "Big Booty Robbin Banx",
              "value": "t_big-booty-robbin-banx"
            },
            {
              "title": "Big Booty Rose Monroe",
              "value": "t_big-booty-rose-monroe"
            },
            {
              "title": "Big Booty Ryan Keely",
              "value": "t_big-booty-ryan-keely"
            },
            {
              "title": "Big Booty Sapphire Astrea",
              "value": "t_big-booty-sapphire-astrea"
            },
            {
              "title": "Big Booty Savanah Storm",
              "value": "t_big-booty-savanah-storm"
            },
            {
              "title": "Big Booty Sicilian Billions",
              "value": "t_big-booty-sicilian-billions"
            },
            {
              "title": "Big Booty Siri Dahl",
              "value": "t_big-booty-siri-dahl"
            },
            {
              "title": "Big Booty Skylar Snow",
              "value": "t_big-booty-skylar-snow"
            },
            {
              "title": "Big Booty Sophie Reade",
              "value": "t_big-booty-sophie-reade"
            },
            {
              "title": "Big Booty Trixi Brooks",
              "value": "t_big-booty-trixi-brooks"
            },
            {
              "title": "Big Booty Tru Kait",
              "value": "t_big-booty-tru-kait"
            },
            {
              "title": "Big Booty Uptown Jenny",
              "value": "t_big-booty-uptown-jenny"
            },
            {
              "title": "Big Booty Valentine Vixen",
              "value": "t_big-booty-valentine-vixen"
            },
            {
              "title": "Big Booty Violet Starr",
              "value": "t_big-booty-violet-starr"
            },
            {
              "title": "Big Booty Yae Triple X",
              "value": "t_big-booty-yae-triple-x"
            },
            {
              "title": "Big Booty YinyLeon",
              "value": "t_big-booty-yinyleon"
            },
            {
              "title": "Big Booty Zoey Foxx",
              "value": "t_big-booty-zoey-foxx"
            },
            {
              "title": "Boob Job",
              "value": "t_boob-job"
            },
            {
              "title": "Cum Shot",
              "value": "t_cum-shot"
            },
            {
              "title": "Full-Nelson",
              "value": "t_full-nelson"
            },
            {
              "title": "Gangbang",
              "value": "t_gangbang"
            },
            {
              "title": "Homemade Sextape",
              "value": "t_homemade-sextape"
            },
            {
              "title": "Huge Booty Nickiibaby",
              "value": "t_huge-booty-nickiibaby"
            },
            {
              "title": "Huge Tits",
              "value": "t_huge-tits"
            },
            {
              "title": "Jenna Starr Leaks",
              "value": "t_jenna-starr-leaks"
            },
            {
              "title": "Latex",
              "value": "t_latex"
            },
            {
              "title": "Masturbation",
              "value": "t_masturbation"
            },
            {
              "title": "œ",
              "value": "t_oe"
            },
            {
              "title": "Passionate Sex",
              "value": "t_passionate-sex"
            },
            {
              "title": "PAWG BootyFrutti",
              "value": "t_pawg-bootyfrutti"
            },
            {
              "title": "Podcast Sex",
              "value": "t_podcast-sex"
            },
            {
              "title": "Raissa Bellini",
              "value": "t_raissa-bellini"
            },
            {
              "title": "Reverse Gangbang",
              "value": "t_reverse-gangbang"
            },
            {
              "title": "Schoolgirl Roleplay",
              "value": "t_schoolgirl-roleplay"
            },
            {
              "title": "Sixty-Nine",
              "value": "t_sixty-nine"
            },
            {
              "title": "Solo",
              "value": "t_solo"
            },
            {
              "title": "Stand and Carry",
              "value": "t_stand-and-carry"
            },
            {
              "title": "StepAunt",
              "value": "t_stepaunt"
            },
            {
              "title": "Submissive Big Booty",
              "value": "t_submissive-big-booty"
            },
            {
              "title": "Voluptuous",
              "value": "t_voluptuous"
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
      "title": "演员",
      "functionName": "loadList",
      "cacheDuration": 180,
      "params": [
        {
          "name": "path",
          "title": "演员",
          "type": "enumeration",
          "value": "a_angela-white",
          "enumOptions": [
            {
              "title": "Angela White",
              "value": "a_angela-white"
            },
            {
              "title": "Savannah Bond",
              "value": "a_savannah-bond"
            },
            {
              "title": "Jenna Starr",
              "value": "a_jenna-starr"
            },
            {
              "title": "Violet Myers",
              "value": "a_violet-myers"
            },
            {
              "title": "Slimthick Vic",
              "value": "a_slimthick-vic"
            },
            {
              "title": "Hayley Davies",
              "value": "a_hayley-davies"
            },
            {
              "title": "The Official Egypt",
              "value": "a_the-official-egypt"
            },
            {
              "title": "Kayley Gunner",
              "value": "a_kayley-gunner"
            },
            {
              "title": "Luna Star",
              "value": "a_luna-star"
            },
            {
              "title": "Abigaiil Morris",
              "value": "a_abigaiil-morris"
            },
            {
              "title": "Kelsey Kane",
              "value": "a_kelsey-kane"
            },
            {
              "title": "Payton Preslee",
              "value": "a_payton-preslee"
            },
            {
              "title": "Jessie Rogers",
              "value": "a_jessie-rogers"
            },
            {
              "title": "Emma Magnolia",
              "value": "a_emma-magnolia"
            },
            {
              "title": "Lissa Aires",
              "value": "a_lissa-aires"
            },
            {
              "title": "Willow Ryder",
              "value": "a_willow-ryder"
            },
            {
              "title": "Auhneesh Nicole",
              "value": "a_auhneesh-nicole"
            },
            {
              "title": "Mini Diva",
              "value": "a_mini-diva"
            },
            {
              "title": "Tommy King",
              "value": "a_tommy-king"
            },
            {
              "title": "Brandy Salazar",
              "value": "a_brandy-salazar"
            },
            {
              "title": "Kelsi Monroe",
              "value": "a_kelsi-monroe"
            },
            {
              "title": "Brandylicious",
              "value": "a_brandylicious"
            },
            {
              "title": "Katalina Kyle",
              "value": "a_katalina-kyle"
            },
            {
              "title": "Madison Moores",
              "value": "a_madison-moores"
            },
            {
              "title": "Madisonmoores",
              "value": "a_madisonmoores"
            },
            {
              "title": "Mona Azar",
              "value": "a_mona-azar"
            },
            {
              "title": "Mandy Muse",
              "value": "a_mandy-muse"
            },
            {
              "title": "Angel Youngs",
              "value": "a_angel-youngs"
            },
            {
              "title": "Brandy Renee",
              "value": "a_brandy-renee"
            },
            {
              "title": "Gracie Bon",
              "value": "a_gracie-bon"
            },
            {
              "title": "Kaden Kole",
              "value": "a_kaden-kole"
            },
            {
              "title": "Richelle Ryan",
              "value": "a_richelle-ryan"
            },
            {
              "title": "Kali Roses",
              "value": "a_kali-roses"
            },
            {
              "title": "Lasirena69",
              "value": "a_lasirena69"
            },
            {
              "title": "Mia Malkova",
              "value": "a_mia-malkova"
            },
            {
              "title": "Victoria June",
              "value": "a_victoria-june"
            },
            {
              "title": "Aletta Ocean",
              "value": "a_aletta-ocean"
            },
            {
              "title": "Anais Amore",
              "value": "a_anais-amore"
            },
            {
              "title": "Sara Retali",
              "value": "a_sara-retali"
            },
            {
              "title": "Connie Perignon",
              "value": "a_connie-perignon"
            },
            {
              "title": "Giuliana Cabrazia",
              "value": "a_giuliana-cabrazia"
            },
            {
              "title": "Jada Stevens",
              "value": "a_jada-stevens"
            },
            {
              "title": "Lacey Jayne",
              "value": "a_lacey-jayne"
            },
            {
              "title": "Lily Lou",
              "value": "a_lily-lou"
            },
            {
              "title": "Miss Lexa",
              "value": "a_miss-lexa"
            },
            {
              "title": "TheDanDangler",
              "value": "a_thedandangler"
            },
            {
              "title": "Xwife Karen",
              "value": "a_xwife-karen"
            },
            {
              "title": "Andie Anderson",
              "value": "a_andie-anderson"
            },
            {
              "title": "GracieBon",
              "value": "a_graciebon"
            },
            {
              "title": "Karmen Karma",
              "value": "a_karmen-karma"
            },
            {
              "title": "Lolly Dames",
              "value": "a_lolly-dames"
            },
            {
              "title": "Tru Kait",
              "value": "a_tru-kait"
            },
            {
              "title": "YinyLeon",
              "value": "a_yinyleon"
            },
            {
              "title": "Blake Blossom",
              "value": "a_blake-blossom"
            },
            {
              "title": "Madison Morgan",
              "value": "a_madison-morgan"
            },
            {
              "title": "Maria Gjieli",
              "value": "a_maria-gjieli"
            },
            {
              "title": "Mz Dani",
              "value": "a_mz-dani"
            },
            {
              "title": "Naomi Soraya",
              "value": "a_naomi-soraya"
            },
            {
              "title": "Aubree Valentine",
              "value": "a_aubree-valentine"
            },
            {
              "title": "Jennifer White",
              "value": "a_jennifer-white"
            },
            {
              "title": "Alexis Texas",
              "value": "a_alexis-texas"
            },
            {
              "title": "Blondie Fesser",
              "value": "a_blondie-fesser"
            },
            {
              "title": "Carmela Clutch",
              "value": "a_carmela-clutch"
            },
            {
              "title": "Cassie Lenoir",
              "value": "a_cassie-lenoir"
            },
            {
              "title": "Laney Grey",
              "value": "a_laney-grey"
            },
            {
              "title": "Raven Thick",
              "value": "a_raven-thick"
            },
            {
              "title": "Sophie Reade",
              "value": "a_sophie-reade"
            },
            {
              "title": "Vitoria Beatriz",
              "value": "a_vitoria-beatriz"
            },
            {
              "title": "Vivian Taylor",
              "value": "a_vivian-taylor"
            },
            {
              "title": "Callie Brooks",
              "value": "a_callie-brooks"
            },
            {
              "title": "Ella Reese",
              "value": "a_ella-reese"
            },
            {
              "title": "Isabelle Eleanore",
              "value": "a_isabelle-eleanore"
            },
            {
              "title": "Nia Bleu",
              "value": "a_nia-bleu"
            },
            {
              "title": "Sara Diamante",
              "value": "a_sara-diamante"
            },
            {
              "title": "Alexis Fawx",
              "value": "a_alexis-fawx"
            },
            {
              "title": "Autumn Falls",
              "value": "a_autumn-falls"
            },
            {
              "title": "Elana Bunnz",
              "value": "a_elana-bunnz"
            },
            {
              "title": "Gia Derza",
              "value": "a_gia-derza"
            },
            {
              "title": "Holly Day",
              "value": "a_holly-day"
            },
            {
              "title": "Indica Monroe",
              "value": "a_indica-monroe"
            },
            {
              "title": "Kendra Sunderland",
              "value": "a_kendra-sunderland"
            },
            {
              "title": "Lila Hayes",
              "value": "a_lila-hayes"
            },
            {
              "title": "Mellanie Monroe",
              "value": "a_mellanie-monroe"
            },
            {
              "title": "Natasha Nice",
              "value": "a_natasha-nice"
            },
            {
              "title": "Nina Kayy",
              "value": "a_nina-kayy"
            },
            {
              "title": "Richh Des",
              "value": "a_richh-des"
            },
            {
              "title": "Scarlet Chase",
              "value": "a_scarlet-chase"
            },
            {
              "title": "Vanessa Bohorquez",
              "value": "a_vanessa-bohorquez"
            },
            {
              "title": "Anikka Albrite",
              "value": "a_anikka-albrite"
            },
            {
              "title": "Anissa Miller",
              "value": "a_anissa-miller"
            },
            {
              "title": "Bella Rolland",
              "value": "a_bella-rolland"
            },
            {
              "title": "Candy Love",
              "value": "a_candy-love"
            },
            {
              "title": "Caryn Beaumont",
              "value": "a_caryn-beaumont"
            },
            {
              "title": "Gia Paige",
              "value": "a_gia-paige"
            },
            {
              "title": "Harley King",
              "value": "a_harley-king"
            },
            {
              "title": "Julie Cash",
              "value": "a_julie-cash"
            },
            {
              "title": "Karol Rosado",
              "value": "a_karol-rosado"
            },
            {
              "title": "Katrina Moreno",
              "value": "a_katrina-moreno"
            },
            {
              "title": "Kenzie Anne",
              "value": "a_kenzie-anne"
            },
            {
              "title": "Kenzie Taylor",
              "value": "a_kenzie-taylor"
            },
            {
              "title": "Lauren Phillips",
              "value": "a_lauren-phillips"
            },
            {
              "title": "Lena Paul",
              "value": "a_lena-paul"
            },
            {
              "title": "Martina Smeraldi",
              "value": "a_martina-smeraldi"
            },
            {
              "title": "Melissa Stratton",
              "value": "a_melissa-stratton"
            },
            {
              "title": "Mila Monet",
              "value": "a_mila-monet"
            },
            {
              "title": "Miss Raquel",
              "value": "a_miss-raquel"
            },
            {
              "title": "Morea Black",
              "value": "a_morea-black"
            },
            {
              "title": "Nicole Aria",
              "value": "a_nicole-aria"
            },
            {
              "title": "Nicole Doshi",
              "value": "a_nicole-doshi"
            },
            {
              "title": "Penelope Woods",
              "value": "a_penelope-woods"
            },
            {
              "title": "Phoenix Marie",
              "value": "a_phoenix-marie"
            },
            {
              "title": "Rachel Starr",
              "value": "a_rachel-starr"
            },
            {
              "title": "Raissa Bellini",
              "value": "a_raissa-bellini"
            },
            {
              "title": "Robbin Banx",
              "value": "a_robbin-banx"
            },
            {
              "title": "Roxanne Roselle",
              "value": "a_roxanne-roselle"
            },
            {
              "title": "Ryan Conner",
              "value": "a_ryan-conner"
            },
            {
              "title": "Ryan Reid",
              "value": "a_ryan-reid"
            },
            {
              "title": "Sheena Ryder",
              "value": "a_sheena-ryder"
            },
            {
              "title": "Siri Dahl",
              "value": "a_siri-dahl"
            },
            {
              "title": "Summer Brookes",
              "value": "a_summer-brookes"
            },
            {
              "title": "Taylor Blake",
              "value": "a_taylor-blake"
            },
            {
              "title": "Toochi Kash",
              "value": "a_toochi-kash"
            },
            {
              "title": "Alanna Pow",
              "value": "a_alanna-pow"
            },
            {
              "title": "Alexa Payne",
              "value": "a_alexa-payne"
            },
            {
              "title": "Alexas Morgan",
              "value": "a_alexas-morgan"
            },
            {
              "title": "Anna Claire Clouds",
              "value": "a_anna-claire-clouds"
            },
            {
              "title": "Ashlyn Peaks",
              "value": "a_ashlyn-peaks"
            },
            {
              "title": "CarryLight",
              "value": "a_carrylight"
            },
            {
              "title": "Cherie DeVille",
              "value": "a_cherie-deville"
            },
            {
              "title": "Comatozze",
              "value": "a_comatozze"
            },
            {
              "title": "Crystal Lust",
              "value": "a_crystal-lust"
            },
            {
              "title": "Dee Williams",
              "value": "a_dee-williams"
            },
            {
              "title": "Emily Norman",
              "value": "a_emily-norman"
            },
            {
              "title": "Esperanza Gomez",
              "value": "a_esperanza-gomez"
            },
            {
              "title": "Essie Gotback",
              "value": "a_essie-gotback"
            },
            {
              "title": "Gem Jewels",
              "value": "a_gem-jewels"
            },
            {
              "title": "Holly Brougham",
              "value": "a_holly-brougham"
            },
            {
              "title": "Jakara Mitchell",
              "value": "a_jakara-mitchell"
            },
            {
              "title": "Jewelz Blu",
              "value": "a_jewelz-blu"
            },
            {
              "title": "Juanita Belle",
              "value": "a_juanita-belle"
            },
            {
              "title": "Kissa Sins",
              "value": "a_kissa-sins"
            },
            {
              "title": "Kourtney Love",
              "value": "a_kourtney-love"
            },
            {
              "title": "Kristy Black",
              "value": "a_kristy-black"
            },
            {
              "title": "La Paisita Oficial",
              "value": "a_la-paisita-oficial"
            },
            {
              "title": "Lena the Plug",
              "value": "a_lena-the-plug"
            },
            {
              "title": "LeoLulu",
              "value": "a_leolulu"
            },
            {
              "title": "Lilly Hall",
              "value": "a_lilly-hall"
            },
            {
              "title": "MartinPaola",
              "value": "a_martinpaola"
            },
            {
              "title": "Maru Karv",
              "value": "a_maru-karv"
            },
            {
              "title": "Ms Sethi",
              "value": "a_ms-sethi"
            },
            {
              "title": "Nataly Ordonez",
              "value": "a_nataly-ordonez"
            },
            {
              "title": "Nika Venom",
              "value": "a_nika-venom"
            },
            {
              "title": "Nikki Benz",
              "value": "a_nikki-benz"
            },
            {
              "title": "Rachael Cavalli",
              "value": "a_rachael-cavalli"
            },
            {
              "title": "Riley Reign",
              "value": "a_riley-reign"
            },
            {
              "title": "Romi Rain",
              "value": "a_romi-rain"
            },
            {
              "title": "Rose Monroe",
              "value": "a_rose-monroe"
            },
            {
              "title": "Sapphire Astrea",
              "value": "a_sapphire-astrea"
            },
            {
              "title": "Savanah Storm",
              "value": "a_savanah-storm"
            },
            {
              "title": "Sisi Rose",
              "value": "a_sisi-rose"
            },
            {
              "title": "Skylar Snow",
              "value": "a_skylar-snow"
            },
            {
              "title": "Suki Sin",
              "value": "a_suki-sin"
            },
            {
              "title": "Uptown Jenny",
              "value": "a_uptown-jenny"
            },
            {
              "title": "Valentina Jewels",
              "value": "a_valentina-jewels"
            },
            {
              "title": "VanillaAndCaramel",
              "value": "a_vanillaandcaramel"
            },
            {
              "title": "Violet Starr",
              "value": "a_violet-starr"
            },
            {
              "title": "Abella Danger",
              "value": "a_abella-danger"
            },
            {
              "title": "Advoree",
              "value": "a_advoree"
            },
            {
              "title": "Alexis Andrews",
              "value": "a_alexis-andrews"
            },
            {
              "title": "Alura Jenson",
              "value": "a_alura-jenson"
            },
            {
              "title": "Alyx Star",
              "value": "a_alyx-star"
            },
            {
              "title": "Angel Wicky",
              "value": "a_angel-wicky"
            },
            {
              "title": "Atlanta Moreno",
              "value": "a_atlanta-moreno"
            },
            {
              "title": "Avery Jane",
              "value": "a_avery-jane"
            },
            {
              "title": "Bailey Brooke",
              "value": "a_bailey-brooke"
            },
            {
              "title": "BehindTheMaskk",
              "value": "a_behindthemaskk"
            },
            {
              "title": "Brandi Love",
              "value": "a_brandi-love"
            },
            {
              "title": "Briana Banderas",
              "value": "a_briana-banderas"
            },
            {
              "title": "Brookie Blair",
              "value": "a_brookie-blair"
            },
            {
              "title": "Brooklyn Chase",
              "value": "a_brooklyn-chase"
            },
            {
              "title": "Brooklyn Gray",
              "value": "a_brooklyn-gray"
            },
            {
              "title": "Bunny Madison",
              "value": "a_bunny-madison"
            },
            {
              "title": "Candice Dare",
              "value": "a_candice-dare"
            },
            {
              "title": "Canela Skin",
              "value": "a_canela-skin"
            },
            {
              "title": "Carlita Ray",
              "value": "a_carlita-ray"
            },
            {
              "title": "Carmen Caliente",
              "value": "a_carmen-caliente"
            },
            {
              "title": "Casca Akashova",
              "value": "a_casca-akashova"
            },
            {
              "title": "Chloe Rannoch",
              "value": "a_chloe-rannoch"
            },
            {
              "title": "Coralia Baby",
              "value": "a_coralia-baby"
            },
            {
              "title": "Danae Mari",
              "value": "a_danae-mari"
            },
            {
              "title": "Dani Daniels",
              "value": "a_dani-daniels"
            },
            {
              "title": "Ebony Mystique",
              "value": "a_ebony-mystique"
            },
            {
              "title": "Emily Addison",
              "value": "a_emily-addison"
            },
            {
              "title": "Gigi Lysette",
              "value": "a_gigi-lysette"
            },
            {
              "title": "Halle Hayes",
              "value": "a_halle-hayes"
            },
            {
              "title": "Jackie Ohh",
              "value": "a_jackie-ohh"
            },
            {
              "title": "Jasmine Jae",
              "value": "a_jasmine-jae"
            },
            {
              "title": "Jazlyn Ray",
              "value": "a_jazlyn-ray"
            },
            {
              "title": "Jazz Jizzes",
              "value": "a_jazz-jizzes"
            },
            {
              "title": "Jazz Jizziz",
              "value": "a_jazz-jizziz"
            },
            {
              "title": "Joslyn James",
              "value": "a_joslyn-james"
            },
            {
              "title": "Julianna Vega",
              "value": "a_julianna-vega"
            },
            {
              "title": "Karma Rx",
              "value": "a_karma-rx"
            },
            {
              "title": "Kate Dee",
              "value": "a_kate-dee"
            },
            {
              "title": "Katie Kush",
              "value": "a_katie-kush"
            },
            {
              "title": "Katty Soarez",
              "value": "a_katty-soarez"
            },
            {
              "title": "Keisha Grey",
              "value": "a_keisha-grey"
            },
            {
              "title": "Kendra Lust",
              "value": "a_kendra-lust"
            },
            {
              "title": "Kylie Page",
              "value": "a_kylie-page"
            },
            {
              "title": "Lana Rhoades",
              "value": "a_lana-rhoades"
            },
            {
              "title": "Lauren Pixie",
              "value": "a_lauren-pixie"
            },
            {
              "title": "Leah Winters",
              "value": "a_leah-winters"
            },
            {
              "title": "Lela Black",
              "value": "a_lela-black"
            },
            {
              "title": "Lexis Star",
              "value": "a_lexis-star"
            },
            {
              "title": "Lily Phillips",
              "value": "a_lily-phillips"
            },
            {
              "title": "Lisey Sweet",
              "value": "a_lisey-sweet"
            },
            {
              "title": "London River",
              "value": "a_london-river"
            },
            {
              "title": "Lucy Lotus",
              "value": "a_lucy-lotus"
            },
            {
              "title": "Luna Baby",
              "value": "a_luna-baby"
            },
            {
              "title": "Marica Chanelle",
              "value": "a_marica-chanelle"
            },
            {
              "title": "Mila Solana",
              "value": "a_mila-solana"
            },
            {
              "title": "Miss Anat",
              "value": "a_miss-anat"
            },
            {
              "title": "Miss Boddy",
              "value": "a_miss-boddy"
            },
            {
              "title": "Miss Korinne",
              "value": "a_miss-korinne"
            },
            {
              "title": "Nikki Mars",
              "value": "a_nikki-mars"
            },
            {
              "title": "Okichloeo",
              "value": "a_okichloeo"
            },
            {
              "title": "Rory Knox",
              "value": "a_rory-knox"
            },
            {
              "title": "Ryan Keely",
              "value": "a_ryan-keely"
            },
            {
              "title": "Sandy Love",
              "value": "a_sandy-love"
            },
            {
              "title": "Sapphire LaPiedra",
              "value": "a_sapphire-lapiedra"
            },
            {
              "title": "Sharon White",
              "value": "a_sharon-white"
            },
            {
              "title": "Sinatra Monroe",
              "value": "a_sinatra-monroe"
            },
            {
              "title": "Skylar Vox",
              "value": "a_skylar-vox"
            },
            {
              "title": "Summer Col",
              "value": "a_summer-col"
            },
            {
              "title": "Susy Gala",
              "value": "a_susy-gala"
            },
            {
              "title": "Sybil Stallone",
              "value": "a_sybil-stallone"
            },
            {
              "title": "The Thai Godess",
              "value": "a_the-thai-godess"
            },
            {
              "title": "Tokyo Lynn",
              "value": "a_tokyo-lynn"
            },
            {
              "title": "Valentine Vixen",
              "value": "a_valentine-vixen"
            },
            {
              "title": "Valerie Kay",
              "value": "a_valerie-kay"
            },
            {
              "title": "Vanessa Cage",
              "value": "a_vanessa-cage"
            },
            {
              "title": "Vanna Rose",
              "value": "a_vanna-rose"
            },
            {
              "title": "Victoria Lobov",
              "value": "a_victoria-lobov"
            },
            {
              "title": "Zoey Uso",
              "value": "a_zoey-uso"
            },
            {
              "title": "6ft Phenomenon",
              "value": "a_6ft-phenomenon"
            },
            {
              "title": "Abby Rose",
              "value": "a_abby-rose"
            },
            {
              "title": "Abigail",
              "value": "a_abigail"
            },
            {
              "title": "Adriana Chechik",
              "value": "a_adriana-chechik"
            },
            {
              "title": "Alana Luv",
              "value": "a_alana-luv"
            },
            {
              "title": "Alice Fantasy",
              "value": "a_alice-fantasy"
            },
            {
              "title": "Alice Thunder",
              "value": "a_alice-thunder"
            },
            {
              "title": "Alisha Grey",
              "value": "a_alisha-grey"
            },
            {
              "title": "Allie Adams",
              "value": "a_allie-adams"
            },
            {
              "title": "Analeasex",
              "value": "a_analeasex"
            },
            {
              "title": "Anna Bell Peaks",
              "value": "a_anna-bell-peaks"
            },
            {
              "title": "Anna Chambers",
              "value": "a_anna-chambers"
            },
            {
              "title": "Annabel Redd",
              "value": "a_annabel-redd"
            },
            {
              "title": "April Eighteen",
              "value": "a_april-eighteen"
            },
            {
              "title": "April Olsen",
              "value": "a_april-olsen"
            },
            {
              "title": "Arabelle Raphael",
              "value": "a_arabelle-raphael"
            },
            {
              "title": "Ariana Starr",
              "value": "a_ariana-starr"
            },
            {
              "title": "Arietta Adams",
              "value": "a_arietta-adams"
            },
            {
              "title": "Ashley Barbie",
              "value": "a_ashley-barbie"
            },
            {
              "title": "August Skye",
              "value": "a_august-skye"
            },
            {
              "title": "Ava Addams",
              "value": "a_ava-addams"
            },
            {
              "title": "Ava Nicks",
              "value": "a_ava-nicks"
            },
            {
              "title": "Bella Blu",
              "value": "a_bella-blu"
            },
            {
              "title": "Bella Jane",
              "value": "a_bella-jane"
            },
            {
              "title": "Blondie Bombshell",
              "value": "a_blondie-bombshell"
            },
            {
              "title": "Booty_Ass",
              "value": "a_booty_ass"
            },
            {
              "title": "BootyFrutti",
              "value": "a_bootyfrutti"
            },
            {
              "title": "Brenna McKenna",
              "value": "a_brenna-mckenna"
            },
            {
              "title": "Brianna Bourbon",
              "value": "a_brianna-bourbon"
            },
            {
              "title": "Bridgette B.",
              "value": "a_bridgette-b"
            },
            {
              "title": "Brittany Andrews",
              "value": "a_brittany-andrews"
            },
            {
              "title": "Brooke Beretta",
              "value": "a_brooke-beretta"
            },
            {
              "title": "Cali Carter",
              "value": "a_cali-carter"
            },
            {
              "title": "Callie Black",
              "value": "a_callie-black"
            },
            {
              "title": "Camila Cortez",
              "value": "a_camila-cortez"
            },
            {
              "title": "Carmen De Luz",
              "value": "a_carmen-de-luz"
            },
            {
              "title": "Carolina Cortez",
              "value": "a_carolina-cortez"
            },
            {
              "title": "Casey Saron",
              "value": "a_casey-saron"
            },
            {
              "title": "Cassie Del Isla",
              "value": "a_cassie-del-isla"
            },
            {
              "title": "Cassie Lenior",
              "value": "a_cassie-lenior"
            },
            {
              "title": "Cassie Solis",
              "value": "a_cassie-solis"
            },
            {
              "title": "Catalina Ossa",
              "value": "a_catalina-ossa"
            },
            {
              "title": "Chanell Heart",
              "value": "a_chanell-heart"
            },
            {
              "title": "Chantal Danielle",
              "value": "a_chantal-danielle"
            },
            {
              "title": "Chloe Chevallier",
              "value": "a_chloe-chevallier"
            },
            {
              "title": "Chloe Cooper",
              "value": "a_chloe-cooper"
            },
            {
              "title": "Chloe Lapiedra",
              "value": "a_chloe-lapiedra"
            },
            {
              "title": "Claudia Bavel",
              "value": "a_claudia-bavel"
            },
            {
              "title": "Coralia",
              "value": "a_coralia"
            },
            {
              "title": "Cory Chase",
              "value": "a_cory-chase"
            },
            {
              "title": "Cubbi Thompson",
              "value": "a_cubbi-thompson"
            },
            {
              "title": "CurlyRican",
              "value": "a_curlyrican"
            },
            {
              "title": "Daisy Fuentes",
              "value": "a_daisy-fuentes"
            },
            {
              "title": "Daisy Marie",
              "value": "a_daisy-marie"
            },
            {
              "title": "Daisy Stone",
              "value": "a_daisy-stone"
            },
            {
              "title": "Dan Dangler",
              "value": "a_dan-dangler"
            },
            {
              "title": "Davina Winter",
              "value": "a_davina-winter"
            },
            {
              "title": "Dirtydanii 69",
              "value": "a_dirtydanii-69"
            },
            {
              "title": "Eliza Eves",
              "value": "a_eliza-eves"
            },
            {
              "title": "Ellie Nova",
              "value": "a_ellie-nova"
            },
            {
              "title": "Elly Clutch",
              "value": "a_elly-clutch"
            },
            {
              "title": "Ely La Bella",
              "value": "a_ely-la-bella"
            },
            {
              "title": "Emily Rinaudo",
              "value": "a_emily-rinaudo"
            },
            {
              "title": "Emma Leigh",
              "value": "a_emma-leigh"
            },
            {
              "title": "EvandMikee",
              "value": "a_evandmikee"
            },
            {
              "title": "Franceska Jaimes",
              "value": "a_franceska-jaimes"
            },
            {
              "title": "Gabriela Lopez",
              "value": "a_gabriela-lopez"
            },
            {
              "title": "Gia DiBella",
              "value": "a_gia-dibella"
            },
            {
              "title": "Gia Oh My",
              "value": "a_gia-oh-my"
            },
            {
              "title": "Gianna Grey",
              "value": "a_gianna-grey"
            },
            {
              "title": "Gypsy Rose",
              "value": "a_gypsy-rose"
            },
            {
              "title": "Hailey Rose",
              "value": "a_hailey-rose"
            },
            {
              "title": "Hija de Venu",
              "value": "a_hija-de-venu"
            },
            {
              "title": "ILuvMySis",
              "value": "a_iluvmysis"
            },
            {
              "title": "Indianara Jung",
              "value": "a_indianara-jung"
            },
            {
              "title": "Isabel Moon",
              "value": "a_isabel-moon"
            },
            {
              "title": "Jacqueline Valentine",
              "value": "a_jacqueline-valentine"
            },
            {
              "title": "Jade Jantzen",
              "value": "a_jade-jantzen"
            },
            {
              "title": "Jennifer Mendez",
              "value": "a_jennifer-mendez"
            },
            {
              "title": "Jessa Rhodes",
              "value": "a_jessa-rhodes"
            },
            {
              "title": "Jessica Sodi",
              "value": "a_jessica-sodi"
            },
            {
              "title": "Joanna Angel",
              "value": "a_joanna-angel"
            },
            {
              "title": "Jocessita",
              "value": "a_jocessita"
            },
            {
              "title": "Josephine Jackson",
              "value": "a_josephine-jackson"
            },
            {
              "title": "Josie Tucker",
              "value": "a_josie-tucker"
            },
            {
              "title": "Joslyn Jane",
              "value": "a_joslyn-jane"
            },
            {
              "title": "Judy Jolie",
              "value": "a_judy-jolie"
            },
            {
              "title": "Julia De Lucia",
              "value": "a_julia-de-lucia"
            },
            {
              "title": "Julz Gotti",
              "value": "a_julz-gotti"
            },
            {
              "title": "Jynx Maze",
              "value": "a_jynx-maze"
            },
            {
              "title": "Kagney Linn Karter",
              "value": "a_kagney-linn-karter"
            },
            {
              "title": "Katrina Colt",
              "value": "a_katrina-colt"
            },
            {
              "title": "Kayla East",
              "value": "a_kayla-east"
            },
            {
              "title": "Kaylynn Keys",
              "value": "a_kaylynn-keys"
            },
            {
              "title": "Kazumi",
              "value": "a_kazumi"
            },
            {
              "title": "Kelly Oliveira",
              "value": "a_kelly-oliveira"
            },
            {
              "title": "Kenzie Love",
              "value": "a_kenzie-love"
            },
            {
              "title": "Kenzie Madison",
              "value": "a_kenzie-madison"
            },
            {
              "title": "Kianna Dior",
              "value": "a_kianna-dior"
            },
            {
              "title": "Kiara Lord",
              "value": "a_kiara-lord"
            },
            {
              "title": "Kiara Mia",
              "value": "a_kiara-mia"
            },
            {
              "title": "Kira Perez",
              "value": "a_kira-perez"
            },
            {
              "title": "Kitten Latenight",
              "value": "a_kitten-latenight"
            },
            {
              "title": "Kittina Clairette",
              "value": "a_kittina-clairette"
            },
            {
              "title": "Kona Jade",
              "value": "a_kona-jade"
            },
            {
              "title": "Krystal Kakes",
              "value": "a_krystal-kakes"
            },
            {
              "title": "Kyra Hot",
              "value": "a_kyra-hot"
            },
            {
              "title": "Lana Roy",
              "value": "a_lana-roy"
            },
            {
              "title": "Lana Sharapova",
              "value": "a_lana-sharapova"
            },
            {
              "title": "Lena Coxx",
              "value": "a_lena-coxx"
            },
            {
              "title": "Lexi Luna",
              "value": "a_lexi-luna"
            },
            {
              "title": "Lily Lane",
              "value": "a_lily-lane"
            },
            {
              "title": "Linda Gonzalez",
              "value": "a_linda-gonzalez"
            },
            {
              "title": "Lorena Lorado",
              "value": "a_lorena-lorado"
            },
            {
              "title": "Lucky Kay",
              "value": "a_lucky-kay"
            },
            {
              "title": "Luna Angel",
              "value": "a_luna-angel"
            },
            {
              "title": "Luna Luxe",
              "value": "a_luna-luxe"
            },
            {
              "title": "Luna Mills",
              "value": "a_luna-mills"
            },
            {
              "title": "Macey Jade",
              "value": "a_macey-jade"
            },
            {
              "title": "Maddy May",
              "value": "a_maddy-may"
            },
            {
              "title": "Maddy O'Reilly",
              "value": "a_maddy-oreilly"
            },
            {
              "title": "Madelyn Monroe",
              "value": "a_madelyn-monroe"
            },
            {
              "title": "Madison Ivy",
              "value": "a_madison-ivy"
            },
            {
              "title": "Madison Wilde",
              "value": "a_madison-wilde"
            },
            {
              "title": "Maevaa Sinaloa",
              "value": "a_maevaa-sinaloa"
            },
            {
              "title": "Maria Bolona",
              "value": "a_maria-bolona"
            },
            {
              "title": "Melztube",
              "value": "a_melztube"
            },
            {
              "title": "Mia James",
              "value": "a_mia-james"
            },
            {
              "title": "Mia Monroe",
              "value": "a_mia-monroe"
            },
            {
              "title": "Mia Queen",
              "value": "a_mia-queen"
            },
            {
              "title": "Michelle Anderson",
              "value": "a_michelle-anderson"
            },
            {
              "title": "Mila Milkshake",
              "value": "a_mila-milkshake"
            },
            {
              "title": "Mimi Boliviana",
              "value": "a_mimi-boliviana"
            },
            {
              "title": "Misha Maver",
              "value": "a_misha-maver"
            },
            {
              "title": "ModernGomorrah",
              "value": "a_moderngomorrah"
            },
            {
              "title": "Morgan Lee",
              "value": "a_morgan-lee"
            },
            {
              "title": "My Cookie Jar",
              "value": "a_my-cookie-jar"
            },
            {
              "title": "MyNewProfession",
              "value": "a_mynewprofession"
            },
            {
              "title": "Nadia White",
              "value": "a_nadia-white"
            },
            {
              "title": "Nara Ford",
              "value": "a_nara-ford"
            },
            {
              "title": "Natalia Starr",
              "value": "a_natalia-starr"
            },
            {
              "title": "Natalie Brooke",
              "value": "a_natalie-brooke"
            },
            {
              "title": "Nataly Fabiola",
              "value": "a_nataly-fabiola"
            },
            {
              "title": "Nickey Huntsman",
              "value": "a_nickey-huntsman"
            },
            {
              "title": "Nickiibaby",
              "value": "a_nickiibaby"
            },
            {
              "title": "Nikky Thorne",
              "value": "a_nikky-thorne"
            },
            {
              "title": "Niky Bimbodoll",
              "value": "a_niky-bimbodoll"
            },
            {
              "title": "Nini_Divine",
              "value": "a_nini_divine"
            },
            {
              "title": "Pamela Rios",
              "value": "a_pamela-rios"
            },
            {
              "title": "Paola Hard",
              "value": "a_paola-hard"
            },
            {
              "title": "Payton Presle",
              "value": "a_payton-presle"
            },
            {
              "title": "Persia's Paradise",
              "value": "a_persias-paradise"
            },
            {
              "title": "Porsha Carrera",
              "value": "a_porsha-carrera"
            },
            {
              "title": "Queen Rogue",
              "value": "a_queen-rogue"
            },
            {
              "title": "Reagan Foxx",
              "value": "a_reagan-foxx"
            },
            {
              "title": "Roxie Sinner",
              "value": "a_roxie-sinner"
            },
            {
              "title": "Ruth Lee",
              "value": "a_ruth-lee"
            },
            {
              "title": "Sadie Summers",
              "value": "a_sadie-summers"
            },
            {
              "title": "Salome Gil",
              "value": "a_salome-gil"
            },
            {
              "title": "Samantha Cruuz",
              "value": "a_samantha-cruuz"
            },
            {
              "title": "secret",
              "value": "a_secret"
            },
            {
              "title": "Selena Ivy",
              "value": "a_selena-ivy"
            },
            {
              "title": "Serena Santos",
              "value": "a_serena-santos"
            },
            {
              "title": "Sheila Ortega",
              "value": "a_sheila-ortega"
            },
            {
              "title": "SheInsh",
              "value": "a_sheinsh"
            },
            {
              "title": "Sicilian Billions",
              "value": "a_sicilian-billions"
            },
            {
              "title": "Sophia Leone",
              "value": "a_sophia-leone"
            },
            {
              "title": "Steffy Moreno",
              "value": "a_steffy-moreno"
            },
            {
              "title": "Stella Andrews",
              "value": "a_stella-andrews"
            },
            {
              "title": "Sydney Summers",
              "value": "a_sydney-summers"
            },
            {
              "title": "Taylee Wood",
              "value": "a_taylee-wood"
            },
            {
              "title": "Thick Ass Daphne",
              "value": "a_thick-ass-daphne"
            },
            {
              "title": "Tiffani Madison",
              "value": "a_tiffani-madison"
            },
            {
              "title": "Tokyo Leigh",
              "value": "a_tokyo-leigh"
            },
            {
              "title": "Trixi Brooks",
              "value": "a_trixi-brooks"
            },
            {
              "title": "Vanessa Vega",
              "value": "a_vanessa-vega"
            },
            {
              "title": "Vegas Vixen",
              "value": "a_vegas-vixen"
            },
            {
              "title": "Vera Jarw",
              "value": "a_vera-jarw"
            },
            {
              "title": "Vika Borja",
              "value": "a_vika-borja"
            },
            {
              "title": "Whitney OC",
              "value": "a_whitney-oc"
            },
            {
              "title": "Yae Triple X",
              "value": "a_yae-triple-x"
            },
            {
              "title": "Yiny Leon",
              "value": "a_yiny-leon"
            },
            {
              "title": "Yorgelis Carrillo",
              "value": "a_yorgelis-carrillo"
            },
            {
              "title": "Yvonna Carlo",
              "value": "a_yvonna-carlo"
            },
            {
              "title": "Zoey Foxx",
              "value": "a_zoey-foxx"
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

var SITE = "https://bigbuttshub.com";
var API = SITE + "/wp-json/wp/v2";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = SITE + "/";
var PER_PAGE = 24;
var BBH_WORKER = "https://bigbuttshub-vidhide.li768435813.workers.dev";

// 分类数据 [{i: type_id, n: term id}]，由构建脚本从蜘蛛 CATS 原样生成
var CATS = [{"i":"c_onlyfans","n":30},{"i":"c_bangbros","n":17},{"i":"c_brazzers","n":95},{"i":"c_brazzers~brazzersexxtra","n":108},{"i":"c_bangbros~assparade","n":18},{"i":"c_amateur","n":38},{"i":"c_jules-jordan","n":126},{"i":"c_naughty-america","n":84},{"i":"c_reality-kings","n":177},{"i":"c_mylf","n":117},{"i":"c_team-skeet","n":103},{"i":"c_thepovgod","n":660},{"i":"c_reality-kings~rkprime","n":178},{"i":"c_bangbros~bigtitsroundasses","n":90},{"i":"c_pawged","n":66},{"i":"c_brazzers~bigwettbutts","n":165},{"i":"c_pervmom","n":259},{"i":"c_evil-angel","n":137},{"i":"c_mr-lucky-pov","n":409},{"i":"c_bangbros~mydirtymaid","n":212},{"i":"c_nympho","n":286},{"i":"c_bangbros~public-bang","n":187},{"i":"c_freakmobmedia","n":504},{"i":"c_hardx","n":288},{"i":"c_bangbros~momishorny","n":148},{"i":"c_aletta-ocean-live","n":194},{"i":"c_my-pervy-family","n":204},{"i":"c_bang","n":336},{"i":"c_filthy-kings","n":374},{"i":"c_bangbros~bangbrosclips","n":248},{"i":"c_bangbros~bigtitcreampie","n":224},{"i":"c_miss-lexa","n":42},{"i":"c_naughty-america~myfriendshotmom","n":155},{"i":"c_yinyleon","n":28},{"i":"c_anal-only","n":140},{"i":"c_bangbros~bangpov","n":276},{"i":"c_brazzers~bigbuttslikeitbig","n":207},{"i":"c_mylf~milfbody","n":236},{"i":"c_team-skeet~teen-curves","n":190},{"i":"c_naughty-america~tonights-girlfriend","n":85},{"i":"c_deeper","n":52},{"i":"c_true-anal","n":63},{"i":"c_tushy","n":238},{"i":"c_bratty-milf","n":438},{"i":"c_manyvids","n":511},{"i":"c_mofos","n":290},{"i":"c_penthouse-gold","n":264},{"i":"c_brazzers~pornstarslikeitbig","n":220},{"i":"c_sexmex","n":124},{"i":"c_anal-mom","n":3},{"i":"c_angela-white","n":157},{"i":"c_blacked-raw","n":129},{"i":"c_deep-lush","n":370},{"i":"c_brazzers~dirtymasseur","n":257},{"i":"c_freeuse-milf","n":335},{"i":"c_bangbros~sexselector","n":522},{"i":"c_familytherapy","n":39},{"i":"c_fill-up-my-mom","n":542},{"i":"c_filthy-pov","n":233},{"i":"c_mylf~got-mylf","n":520},{"i":"c_her-limit","n":576},{"i":"c_hot-girls-raw","n":636},{"i":"c_mia-malkova","n":62},{"i":"c_naughty-america~mysistershotfriend","n":377},{"i":"c_rickys-room","n":574},{"i":"c_tushy-raw","n":153},{"i":"c_all-anal","n":173},{"i":"c_bangbros~bangbros18","n":533},{"i":"c_blakced","n":329},{"i":"c_blondie-fesser","n":91},{"i":"c_dad-crush","n":381},{"i":"c_brazzers~daywithapornstar","n":461},{"i":"c_naughty-america~dirtywivesclub","n":361},{"i":"c_hotwifexxx","n":284},{"i":"c_houseofrye","n":170},{"i":"c_mofos~letspostit","n":518},{"i":"c_mylf~milfty","n":356},{"i":"c_naughty-america~my-wifes-hot-friend","n":296},{"i":"c_mylf~mylfofthemonth","n":549},{"i":"c_mylf~mylfxmisslexa","n":118},{"i":"c_mylifeinmiami","n":292},{"i":"c_bangbros~pawg","n":403},{"i":"c_brazzers~realwifestories","n":96},{"i":"c_vixen","n":426},{"i":"c_adult-time","n":855},{"i":"c_angel-wicky","n":134},{"i":"c_bratty-sis","n":339},{"i":"c_crystal-lust","n":241},{"i":"c_reality-kings~cum-fiesta","n":799},{"i":"c_devils-film","n":161},{"i":"c_digital-playground","n":309},{"i":"c_elegant-angel","n":372},{"i":"c_family-strokes","n":353},{"i":"c_familyxxx","n":291},{"i":"c_filthy-kings~filthy-massage","n":375},{"i":"c_ddf-network~handsonhardcore","n":279},{"i":"c_naughty-america~ihaveawife","n":392},{"i":"c_jada-stevens","n":11},{"i":"c_kelsi-monroe","n":34},{"i":"c_lauren-phillips","n":2},{"i":"c_lena-paul","n":51},{"i":"c_life-selector","n":271},{"i":"c_luna-star","n":115},{"i":"c_team-skeet~messyjessy","n":473},{"i":"c_milfy","n":635},{"i":"c_mom-comes-first","n":439},{"i":"c_moms-teach-sex","n":384},{"i":"c_team-skeet~mybabysittersclub","n":227},{"i":"c_naughty-america~mygirlfriendsbustyfriend","n":616},{"i":"c_naughty-america~naughtyoffice","n":214},{"i":"c_naughty-america~perfect-fucking-strangers","n":474},{"i":"c_perv-city","n":460},{"i":"c_povd","n":349},{"i":"c_property-sex","n":347},{"i":"c_ryan-conner","n":14},{"i":"c_sex-mex","n":87},{"i":"c_spizoo","n":380},{"i":"c_team-skeet~teenpies","n":104},{"i":"c_team-skeet~therealworkout","n":578},{"i":"c_touch-my-wife","n":654},{"i":"c_victoria-june","n":121},{"i":"c_violet-myers","n":182},{"i":"c_vivian-taylor","n":16},{"i":"c_abella-danger","n":10},{"i":"c_aletta-ocean","n":100},{"i":"c_alura-jenson","n":162},{"i":"c_analized","n":107},{"i":"c_analtherapyxxx","n":608},{"i":"c_asshole-fever","n":250},{"i":"c_naughty-america~assmasterpiece","n":612},{"i":"c_babes","n":316},{"i":"c_baddies-pov","n":973},{"i":"c_team-skeet~badmilfs","n":455},{"i":"c_bangbros~bang-bus","n":584},{"i":"c_bang~bang-roadside","n":337},{"i":"c_bbc-pie","n":577},{"i":"c_bffs","n":274},{"i":"c_brandi-love","n":127},{"i":"c_team-skeet~breeding-material","n":630},{"i":"c_bridgette-b","n":138},{"i":"c_brooklyn-gray","n":174},{"i":"c_castingcouchhd","n":50},{"i":"c_cherry-pimps","n":205},{"i":"c_reality-kings~crazy-college-gfs","n":733},{"i":"c_cum-4k","n":333},{"i":"c_bangbros~dads-love-porn","n":652},{"i":"c_dani-daniels","n":60},{"i":"c_darkx","n":650},{"i":"c_ddf-network","n":278},{"i":"c_dick-drainers","n":93},{"i":"c_dirty-auditions","n":865},{"i":"c_elegant-raw","n":225},{"i":"c_emily-addison","n":113},{"i":"c_erotic-spice","n":365},{"i":"c_team-skeet~exxxtrasmall","n":338},{"i":"c_got-filled","n":445},{"i":"c_mofos~hes-got-rizz","n":968},{"i":"c_mylf~hijab-mylfs","n":647},{"i":"c_holed","n":302},{"i":"c_brazzers~hotandmean","n":305},{"i":"c_mofos~i-know-that-girl","n":575},{"i":"c_team-skeet~imadeporn","n":240},{"i":"c_joslyn-james","n":4},{"i":"c_julie-cash","n":109},{"i":"c_kelsi-monroe-xxx","n":401},{"i":"c_kyra-hot","n":53},{"i":"c_lethal-hardcore","n":223},{"i":"c_lilly-hall","n":40},{"i":"c_lily-lane","n":80},{"i":"c_reality-kings~look-at-her-now","n":804},{"i":"c_reality-kings~milf-hunter","n":581},{"i":"c_milf-overload","n":646},{"i":"c_brazzers~milfslikeitbig","n":307},{"i":"c_mylf~mom-drips","n":600},{"i":"c_moms-tight","n":617},{"i":"c_mona-azar","n":130},{"i":"c_reality-kings~monster-curves","n":420},{"i":"c_bangbros~monstersofcock","n":643},{"i":"c_mr-lucky-raw","n":563},{"i":"c_bangbros~mranal","n":396},{"i":"c_naughty-america~my-naughty-massage","n":785},{"i":"c_naughty-america~mydadshotgirlfriend","n":622},{"i":"c_naughty-america~mydaughtershotfriend","n":640},{"i":"c_mylf~mylf-labs","n":300},{"i":"c_naughty-america~naughtyathletics","n":537},{"i":"c_naughty-america~neighboraffair","n":546},{"i":"c_new-sensations","n":283},{"i":"c_oops-family","n":954},{"i":"c_pamela-rios","n":88},{"i":"c_payton-preslee","n":83},{"i":"c_perv-mom","n":112},{"i":"c_perv-principal","n":596},{"i":"c_phoenix-marie","n":97},{"i":"c_porn-dude-casting","n":230},{"i":"c_porn-force","n":331},{"i":"c_bangbros~pornstar-spa","n":477},{"i":"c_pov-masters","n":953},{"i":"c_team-skeet~povlife","n":601},{"i":"c_private","n":495},{"i":"c_pure-mature","n":344},{"i":"c_rachel-starr","n":168},{"i":"c_rose-monroe","n":35},{"i":"c_naughty-america~seducedbyacougar","n":256},{"i":"c_shoplyfter-mylf","n":216},{"i":"c_simplyanal","n":567},{"i":"c_siri-dahl","n":132},{"i":"c_reality-kings~sneakysex","n":541},{"i":"c_spank-monster","n":243},{"i":"c_mylf~stay-home-milf","n":391},{"i":"c_stuck-4k","n":294},{"i":"c_susy-gala","n":142},{"i":"c_sybil-stallone","n":149},{"i":"c_taboo-heat","n":313},{"i":"c_team-skeet~teamskeet-labs","n":681},{"i":"c_teen-fidelity","n":368},{"i":"c_team-skeet~teens-do-porn","n":385},{"i":"c_reality-kings~teens-love-huge-cocks","n":627},{"i":"c_brazzers~teenslikeitbig","n":280},{"i":"c_the-white-boxxx","n":425},{"i":"c_team-skeet~theloft","n":521},{"i":"c_naughty-america~thundercock","n":927},{"i":"c_tough-love-x","n":231},{"i":"c_mylf~usepov","n":482},{"i":"c_reality-kings~work-me-harder","n":534},{"i":"c_reality-kings~workmeharder","n":589},{"i":"c_brazzers~zz-series","n":857},{"i":"t_curvy","n":8},{"i":"t_bubble-butt","n":65},{"i":"t_big-tits","n":7},{"i":"t_pawg","n":22},{"i":"t_thick","n":20},{"i":"t_milf","n":6},{"i":"t_rough-sex","n":46},{"i":"t_phat-ass","n":206},{"i":"t_brunette","n":188},{"i":"t_fit-ass","n":469},{"i":"t_teen","n":57},{"i":"t_blonde","n":54},{"i":"t_oil","n":19},{"i":"t_big-booty-onlyfans","n":746},{"i":"t_facial","n":21},{"i":"t_pov","n":26},{"i":"t_interracial","n":15},{"i":"t_latina","n":144},{"i":"t_anal","n":12},{"i":"t_blowjob","n":151},{"i":"t_doggystyle","n":797},{"i":"t_rim-job","n":175},{"i":"t_booty-jiggle","n":823},{"i":"t_cheating","n":209},{"i":"t_missionary","n":796},{"i":"t_cowgirl","n":795},{"i":"t_reverse-cowgirl","n":819},{"i":"t_threesome","n":33},{"i":"t_tattoo","n":359},{"i":"t_ass-worship","n":810},{"i":"t_huge-booty","n":729},{"i":"t_sneaky-sex","n":222},{"i":"t_creampie","n":105},{"i":"t_hardcore","n":848},{"i":"t_fishnets","n":13},{"i":"t_yoga-pants","n":318},{"i":"t_deepthroat","n":805},{"i":"t_workout","n":9},{"i":"t_stepmom","n":81},{"i":"t_wife","n":98},{"i":"t_public","n":76},{"i":"t_bbw","n":110},{"i":"t_massage","n":258},{"i":"t_gape","n":354},{"i":"t_red-head","n":152},{"i":"t_stepsister","n":102},{"i":"t_round-butt","n":842},{"i":"t_butt-plug","n":327},{"i":"t_bbc","n":841},{"i":"t_ffm-threesome","n":825},{"i":"t_twerking","n":789},{"i":"t_anal-creampie","n":320},{"i":"t_maid","n":211},{"i":"t_big-booty-lissa-aires","n":679},{"i":"t_ebony","n":166},{"i":"t_squirt","n":135},{"i":"t_big-booty-jenna-starr","n":736},{"i":"t_big-booty-the-official-egypt","n":698},{"i":"t_outdoor","n":311},{"i":"t_big-booty-brandylicious","n":689},{"i":"t_double-blowjob","n":832},{"i":"t_stepdaughter","n":324},{"i":"t_freeuse","n":67},{"i":"t_office-sex","n":215},{"i":"t_pawg-auhneesh-nicole","n":687},{"i":"t_sideways-fucking","n":846},{"i":"t_face-fucking","n":817},{"i":"t_lesbian","n":158},{"i":"t_big-booty-kaden-kole","n":728},{"i":"t_big-booty-karmen-karma","n":759},{"i":"t_big-booty-luna-star","n":688},{"i":"t_big-booty-maria-gjieli","n":769},{"i":"t_big-booty-abigaiil-morris","n":755},{"i":"t_big-booty-sara-retali","n":721},{"i":"t_spanking-ass","n":828},{"i":"t_big-booty-graciebon","n":696},{"i":"t_big-booty-raven-thick","n":811},{"i":"t_big-booty-violet-myers","n":737},{"i":"t_cum-on-ass","n":821},{"i":"t_cumshot","n":816},{"i":"t_cunnilingus","n":844},{"i":"t_big-booty-brandy-salazar","n":839},{"i":"t_big-booty-gracie-bon","n":836},{"i":"t_big-booty-katalina-kyle","n":726},{"i":"t_big-booty-madison-moores","n":776},{"i":"t_big-booty-mandy-muse","n":673},{"i":"t_big-booty-vivian-taylor","n":831},{"i":"t_prone-bone","n":820},{"i":"t_backshots","n":867},{"i":"t_big-booty-andie-anderson","n":672},{"i":"t_big-booty-kali-roses","n":760},{"i":"t_big-booty-kayley-gunner","n":784},{"i":"t_big-booty-lacey-jayne","n":727},{"i":"t_big-booty-lila-hayes","n":751},{"i":"t_big-booty-mz-dani","n":774},{"i":"t_big-booty-slimthick-vic","n":777},{"i":"t_big-booty-vanessa-bohorquez","n":722},{"i":"t_big-booty-vitoria-beatriz","n":670},{"i":"t_big-booty-willow-ryder","n":758},{"i":"t_nurse","n":261},{"i":"t_perfect-ass","n":79},{"i":"t_standing-sex","n":875},{"i":"t_anal-play","n":853},{"i":"t_big-booty-angela-white","n":847},{"i":"t_big-booty-anissa-miller","n":900},{"i":"t_big-booty-cassie-lenoir","n":809},{"i":"t_big-booty-isabelle-eleanore","n":750},{"i":"t_big-booty-richelle-ryan","n":761},{"i":"t_spanking","n":806},{"i":"t_tit-job","n":882},{"i":"t_big-booty-alanna-pow","n":938},{"i":"t_big-booty-anais-amore","n":753},{"i":"t_big-booty-candy-love","n":818},{"i":"t_big-booty-hayley-davies","n":730},{"i":"t_big-booty-juanita-belle","n":786},{"i":"t_big-booty-ms-sethi","n":962},{"i":"t_big-booty-nia-bleu","n":920},{"i":"t_big-booty-payton-preslee","n":669},{"i":"t_big-booty-raissa-bellini","n":930},{"i":"t_big-booty-roxanne-roselle","n":889},{"i":"t_big-booty-tommy-king","n":739},{"i":"t_domination","n":782},{"i":"t_double-penetration","n":314},{"i":"t_hotwife","n":655},{"i":"t_step-family","n":364},{"i":"t_stockings","n":801},{"i":"t_teacher","n":266},{"i":"t_throatpie","n":937},{"i":"t_asian","n":340},{"i":"t_auhneesh-nicole","n":667},{"i":"t_bdsm","n":757},{"i":"t_big-booty-chloe-rannoch","n":903},{"i":"t_big-booty-comatozze","n":914},{"i":"t_big-booty-gigi-lysette","n":955},{"i":"t_big-booty-giuliana-cabrazia","n":866},{"i":"t_big-booty-jakara-mitchell","n":778},{"i":"t_big-booty-karol-rosado","n":724},{"i":"t_big-booty-katty-soarez","n":793},{"i":"t_big-booty-kelsey-kane","n":682},{"i":"t_big-booty-kristy-black","n":843},{"i":"t_big-booty-la-paisita-oficial","n":858},{"i":"t_big-booty-lexis-star","n":942},{"i":"t_big-booty-lily-phillips","n":874},{"i":"t_big-booty-madison-morgan","n":808},{"i":"t_big-booty-mellanie-monroe","n":911},{"i":"t_big-booty-mia-malkova","n":744},{"i":"t_big-booty-miss-boddy","n":791},{"i":"t_big-booty-miss-korinne","n":690},{"i":"t_big-booty-okichloeo","n":902},{"i":"t_big-booty-ryan-conner","n":924},{"i":"t_big-booty-savannah-bond","n":671},{"i":"t_big-booty-sinatra-monroe","n":731},{"i":"t_big-booty-summer-brookes","n":770},{"i":"t_big-booty-toochi-kash","n":781},{"i":"t_big-booty-vanna-rose","n":946},{"i":"t_big-booty-zoey-uso","n":944},{"i":"t_bikini","n":845},{"i":"t_breeding","n":850},{"i":"t_car-sex","n":880},{"i":"t_cosplay","n":676},{"i":"t_cuckold","n":362},{"i":"t_cum-swallow","n":878},{"i":"t_cum-swap","n":838},{"i":"t_doctor","n":517},{"i":"t_face-sitting","n":856},{"i":"t_ffm","n":826},{"i":"t_foursome","n":675},{"i":"t_gracie-bon","n":668},{"i":"t_indian","n":963},{"i":"t_onlyfans","n":697},{"i":"t_poolside-sex","n":837},{"i":"t_sex-at-work","n":807},{"i":"t_anal-fingering","n":887},{"i":"t_ass-to-mouth","n":840},{"i":"t_big-ass","n":5},{"i":"t_big-booty-6ft-phenomenon","n":974},{"i":"t_big-booty-abby-rose","n":779},{"i":"t_big-booty-aletta-ocean","n":935},{"i":"t_big-booty-alexa-payne","n":895},{"i":"t_big-booty-alice-thunder","n":772},{"i":"t_big-booty-ashley-barbie","n":869},{"i":"t_big-booty-atlanta-moreno","n":928},{"i":"t_big-booty-ava-nicks","n":958},{"i":"t_big-booty-bella-rolland","n":771},{"i":"t_big-booty-caryn-beaumont","n":756},{"i":"t_big-booty-cassie-lenior","n":742},{"i":"t_big-booty-cassie-solis","n":925},{"i":"t_big-booty-connie-perignon","n":686},{"i":"t_big-booty-crystal-lust","n":815},{"i":"t_big-booty-elana-bunnz","n":933},{"i":"t_big-booty-emily-rinaudo","n":885},{"i":"t_big-booty-emma-magnolia","n":803},{"i":"t_big-booty-gem-jewels","n":957},{"i":"t_big-booty-hailey-rose","n":931},{"i":"t_big-booty-holly-brougham","n":748},{"i":"t_big-booty-indianara-jung","n":852},{"i":"t_big-booty-jacqueline-valentine","n":788},{"i":"t_big-booty-jada-stevens","n":921},{"i":"t_big-booty-jessie-rogers","n":909},{"i":"t_big-booty-jocessita","n":683},{"i":"t_big-booty-krystal-kakes","n":940},{"i":"t_big-booty-lorena-lorado","n":813},{"i":"t_big-booty-lucky-kay","n":969},{"i":"t_big-booty-lucy-lotus","n":830},{"i":"t_big-booty-luna-angel","n":922},{"i":"t_big-booty-madison-ivy","n":912},{"i":"t_big-booty-maevaa-sinaloa","n":976},{"i":"t_big-booty-maria-bolona","n":948},{"i":"t_big-booty-martina-smeraldi","n":936},{"i":"t_big-booty-martinpaola","n":910},{"i":"t_big-booty-melissa-stratton","n":775},{"i":"t_big-booty-melztube","n":734},{"i":"t_big-booty-mia-monroe","n":916},{"i":"t_big-booty-mona-azar","n":870},{"i":"t_big-booty-morea-black","n":754},{"i":"t_big-booty-naomi-soraya","n":747},{"i":"t_big-booty-natalia-starr","n":800},{"i":"t_big-booty-nataly-fabiola","n":833},{"i":"t_big-booty-nataly-ordonez","n":835},{"i":"t_big-booty-persias-paradise","n":960},{"i":"t_big-booty-robbin-banx","n":894},{"i":"t_big-booty-rose-monroe","n":798},{"i":"t_big-booty-ryan-keely","n":849},{"i":"t_big-booty-sapphire-astrea","n":859},{"i":"t_big-booty-savanah-storm","n":899},{"i":"t_big-booty-sicilian-billions","n":971},{"i":"t_big-booty-siri-dahl","n":934},{"i":"t_big-booty-skylar-snow","n":965},{"i":"t_big-booty-sophie-reade","n":725},{"i":"t_big-booty-trixi-brooks","n":906},{"i":"t_big-booty-tru-kait","n":745},{"i":"t_big-booty-uptown-jenny","n":908},{"i":"t_big-booty-valentine-vixen","n":929},{"i":"t_big-booty-violet-starr","n":877},{"i":"t_big-booty-yae-triple-x","n":872},{"i":"t_big-booty-yinyleon","n":892},{"i":"t_big-booty-zoey-foxx","n":896},{"i":"t_boob-job","n":871},{"i":"t_cum-shot","n":824},{"i":"t_full-nelson","n":951},{"i":"t_gangbang","n":879},{"i":"t_homemade-sextape","n":851},{"i":"t_huge-booty-nickiibaby","n":966},{"i":"t_huge-tits","n":950},{"i":"t_jenna-starr-leaks","n":738},{"i":"t_latex","n":720},{"i":"t_masturbation","n":860},{"i":"t_oe","n":529},{"i":"t_passionate-sex","n":822},{"i":"t_pawg-bootyfrutti","n":883},{"i":"t_podcast-sex","n":829},{"i":"t_raissa-bellini","n":918},{"i":"t_reverse-gangbang","n":897},{"i":"t_schoolgirl-roleplay","n":888},{"i":"t_sixty-nine","n":881},{"i":"t_solo","n":77},{"i":"t_stand-and-carry","n":952},{"i":"t_stepaunt","n":363},{"i":"t_submissive-big-booty","n":783},{"i":"t_voluptuous","n":827},{"i":"a_angela-white","n":154},{"i":"a_savannah-bond","n":267},{"i":"a_jenna-starr","n":322},{"i":"a_violet-myers","n":183},{"i":"a_slimthick-vic","n":393},{"i":"a_hayley-davies","n":566},{"i":"a_the-official-egypt","n":621},{"i":"a_kayley-gunner","n":171},{"i":"a_luna-star","n":116},{"i":"a_abigaiil-morris","n":443},{"i":"a_kelsey-kane","n":573},{"i":"a_payton-preslee","n":86},{"i":"a_jessie-rogers","n":428},{"i":"a_emma-magnolia","n":424},{"i":"a_lissa-aires","n":680},{"i":"a_willow-ryder","n":454},{"i":"a_auhneesh-nicole","n":645},{"i":"a_mini-diva","n":68},{"i":"a_tommy-king","n":430},{"i":"a_brandy-salazar","n":749},{"i":"a_kelsi-monroe","n":37},{"i":"a_brandylicious","n":661},{"i":"a_katalina-kyle","n":400},{"i":"a_madison-moores","n":544},{"i":"a_madisonmoores","n":528},{"i":"a_mona-azar","n":131},{"i":"a_mandy-muse","n":321},{"i":"a_angel-youngs","n":467},{"i":"a_brandy-renee","n":450},{"i":"a_gracie-bon","n":593},{"i":"a_kaden-kole","n":56},{"i":"a_richelle-ryan","n":186},{"i":"a_kali-roses","n":201},{"i":"a_lasirena69","n":410},{"i":"a_mia-malkova","n":64},{"i":"a_victoria-june","n":122},{"i":"a_aletta-ocean","n":101},{"i":"a_anais-amore","n":488},{"i":"a_sara-retali","n":414},{"i":"a_connie-perignon","n":446},{"i":"a_giuliana-cabrazia","n":463},{"i":"a_jada-stevens","n":199},{"i":"a_lacey-jayne","n":564},{"i":"a_lily-lou","n":457},{"i":"a_miss-lexa","n":43},{"i":"a_thedandangler","n":548},{"i":"a_xwife-karen","n":501},{"i":"a_andie-anderson","n":619},{"i":"a_graciebon","n":694},{"i":"a_karmen-karma","n":476},{"i":"a_lolly-dames","n":301},{"i":"a_tru-kait","n":221},{"i":"a_yinyleon","n":27},{"i":"a_blake-blossom","n":191},{"i":"a_madison-morgan","n":298},{"i":"a_maria-gjieli","n":509},{"i":"a_mz-dani","n":388},{"i":"a_naomi-soraya","n":471},{"i":"a_aubree-valentine","n":342},{"i":"a_jennifer-white","n":237},{"i":"a_alexis-texas","n":429},{"i":"a_blondie-fesser","n":92},{"i":"a_carmela-clutch","n":218},{"i":"a_cassie-lenoir","n":585},{"i":"a_laney-grey","n":228},{"i":"a_raven-thick","n":812},{"i":"a_sophie-reade","n":555},{"i":"a_vitoria-beatriz","n":648},{"i":"a_vivian-taylor","n":106},{"i":"a_callie-brooks","n":447},{"i":"a_ella-reese","n":538},{"i":"a_isabelle-eleanore","n":606},{"i":"a_nia-bleu","n":545},{"i":"a_sara-diamante","n":453},{"i":"a_alexis-fawx","n":197},{"i":"a_autumn-falls","n":500},{"i":"a_elana-bunnz","n":486},{"i":"a_gia-derza","n":179},{"i":"a_holly-day","n":493},{"i":"a_indica-monroe","n":195},{"i":"a_kendra-sunderland","n":507},{"i":"a_lila-hayes","n":752},{"i":"a_mellanie-monroe","n":451},{"i":"a_natasha-nice","n":208},{"i":"a_nina-kayy","n":423},{"i":"a_richh-des","n":449},{"i":"a_scarlet-chase","n":200},{"i":"a_vanessa-bohorquez","n":723},{"i":"a_anikka-albrite","n":417},{"i":"a_anissa-miller","n":901},{"i":"a_bella-rolland","n":310},{"i":"a_candy-love","n":253},{"i":"a_caryn-beaumont","n":580},{"i":"a_gia-paige","n":312},{"i":"a_harley-king","n":123},{"i":"a_julie-cash","n":111},{"i":"a_karol-rosado","n":540},{"i":"a_katrina-moreno","n":263},{"i":"a_kenzie-anne","n":376},{"i":"a_kenzie-taylor","n":239},{"i":"a_lauren-phillips","n":31},{"i":"a_lena-paul","n":48},{"i":"a_martina-smeraldi","n":268},{"i":"a_melissa-stratton","n":591},{"i":"a_mila-monet","n":281},{"i":"a_miss-raquel","n":572},{"i":"a_morea-black","n":562},{"i":"a_nicole-aria","n":355},{"i":"a_nicole-doshi","n":484},{"i":"a_penelope-woods","n":371},{"i":"a_phoenix-marie","n":99},{"i":"a_rachel-starr","n":169},{"i":"a_raissa-bellini","n":919},{"i":"a_robbin-banx","n":193},{"i":"a_roxanne-roselle","n":890},{"i":"a_ryan-conner","n":32},{"i":"a_ryan-reid","n":402},{"i":"a_sheena-ryder","n":285},{"i":"a_siri-dahl","n":133},{"i":"a_summer-brookes","n":582},{"i":"a_taylor-blake","n":198},{"i":"a_toochi-kash","n":625},{"i":"a_alanna-pow","n":939},{"i":"a_alexa-payne","n":559},{"i":"a_alexas-morgan","n":489},{"i":"a_anna-claire-clouds","n":550},{"i":"a_ashlyn-peaks","n":465},{"i":"a_carrylight","n":203},{"i":"a_cherie-deville","n":468},{"i":"a_comatozze","n":915},{"i":"a_crystal-lust","n":242},{"i":"a_dee-williams","n":156},{"i":"a_emily-norman","n":633},{"i":"a_esperanza-gomez","n":505},{"i":"a_essie-gotback","n":642},{"i":"a_gem-jewels","n":570},{"i":"a_holly-brougham","n":595},{"i":"a_jakara-mitchell","n":583},{"i":"a_jewelz-blu","n":605},{"i":"a_juanita-belle","n":787},{"i":"a_kissa-sins","n":192},{"i":"a_kourtney-love","n":299},{"i":"a_kristy-black","n":649},{"i":"a_la-paisita-oficial","n":861},{"i":"a_lena-the-plug","n":553},{"i":"a_leolulu","n":69},{"i":"a_lilly-hall","n":41},{"i":"a_martinpaola","n":407},{"i":"a_maru-karv","n":146},{"i":"a_ms-sethi","n":964},{"i":"a_nataly-ordonez","n":653},{"i":"a_nika-venom","n":491},{"i":"a_nikki-benz","n":475},{"i":"a_rachael-cavalli","n":219},{"i":"a_riley-reign","n":434},{"i":"a_romi-rain","n":452},{"i":"a_rose-monroe","n":36},{"i":"a_sapphire-astrea","n":607},{"i":"a_savanah-storm","n":638},{"i":"a_sisi-rose","n":558},{"i":"a_skylar-snow","n":480},{"i":"a_suki-sin","n":523},{"i":"a_uptown-jenny","n":472},{"i":"a_valentina-jewels","n":251},{"i":"a_vanillaandcaramel","n":395},{"i":"a_violet-starr","n":497},{"i":"a_abella-danger","n":406},{"i":"a_advoree","n":246},{"i":"a_alexis-andrews","n":94},{"i":"a_alura-jenson","n":163},{"i":"a_alyx-star","n":478},{"i":"a_angel-wicky","n":136},{"i":"a_atlanta-moreno","n":492},{"i":"a_avery-jane","n":308},{"i":"a_bailey-brooke","n":412},{"i":"a_behindthemaskk","n":306},{"i":"a_brandi-love","n":128},{"i":"a_briana-banderas","n":448},{"i":"a_brookie-blair","n":479},{"i":"a_brooklyn-chase","n":397},{"i":"a_brooklyn-gray","n":176},{"i":"a_bunny-madison","n":431},{"i":"a_candice-dare","n":213},{"i":"a_canela-skin","n":568},{"i":"a_carlita-ray","n":481},{"i":"a_carmen-caliente","n":483},{"i":"a_casca-akashova","n":265},{"i":"a_chloe-rannoch","n":905},{"i":"a_coralia-baby","n":440},{"i":"a_danae-mari","n":677},{"i":"a_dani-daniels","n":61},{"i":"a_ebony-mystique","n":232},{"i":"a_emily-addison","n":114},{"i":"a_gigi-lysette","n":956},{"i":"a_halle-hayes","n":399},{"i":"a_jackie-ohh","n":160},{"i":"a_jasmine-jae","n":226},{"i":"a_jazlyn-ray","n":323},{"i":"a_jazz-jizzes","n":587},{"i":"a_jazz-jizziz","n":557},{"i":"a_joslyn-james","n":58},{"i":"a_julianna-vega","n":441},{"i":"a_karma-rx","n":334},{"i":"a_kate-dee","n":462},{"i":"a_katie-kush","n":273},{"i":"a_katty-soarez","n":794},{"i":"a_keisha-grey","n":485},{"i":"a_kendra-lust","n":345},{"i":"a_kylie-page","n":571},{"i":"a_lana-rhoades","n":159},{"i":"a_lauren-pixie","n":343},{"i":"a_leah-winters","n":164},{"i":"a_lela-black","n":172},{"i":"a_lexis-star","n":943},{"i":"a_lily-phillips","n":876},{"i":"a_lisey-sweet","n":373},{"i":"a_london-river","n":346},{"i":"a_lucy-lotus","n":695},{"i":"a_luna-baby","n":628},{"i":"a_marica-chanelle","n":383},{"i":"a_mila-solana","n":641},{"i":"a_miss-anat","n":289},{"i":"a_miss-boddy","n":792},{"i":"a_miss-korinne","n":691},{"i":"a_nikki-mars","n":516},{"i":"a_okichloeo","n":904},{"i":"a_rory-knox","n":141},{"i":"a_ryan-keely","n":614},{"i":"a_sandy-love","n":515},{"i":"a_sapphire-lapiedra","n":189},{"i":"a_sharon-white","n":295},{"i":"a_sinatra-monroe","n":732},{"i":"a_skylar-vox","n":196},{"i":"a_summer-col","n":419},{"i":"a_susy-gala","n":143},{"i":"a_sybil-stallone","n":150},{"i":"a_the-thai-godess","n":592},{"i":"a_tokyo-lynn","n":442},{"i":"a_valentine-vixen","n":666},{"i":"a_valerie-kay","n":398},{"i":"a_vanessa-cage","n":416},{"i":"a_vanna-rose","n":947},{"i":"a_victoria-lobov","n":252},{"i":"a_zoey-uso","n":945},{"i":"a_6ft-phenomenon","n":975},{"i":"a_abby-rose","n":780},{"i":"a_abigail","n":514},{"i":"a_adriana-chechik","n":631},{"i":"a_alana-luv","n":234},{"i":"a_alice-fantasy","n":466},{"i":"a_alice-thunder","n":773},{"i":"a_alisha-grey","n":539},{"i":"a_allie-adams","n":503},{"i":"a_analeasex","n":408},{"i":"a_anna-bell-peaks","n":303},{"i":"a_anna-chambers","n":360},{"i":"a_annabel-redd","n":330},{"i":"a_april-eighteen","n":147},{"i":"a_april-olsen","n":382},{"i":"a_arabelle-raphael","n":588},{"i":"a_ariana-starr","n":624},{"i":"a_arietta-adams","n":499},{"i":"a_ashley-barbie","n":868},{"i":"a_august-skye","n":611},{"i":"a_ava-addams","n":282},{"i":"a_ava-nicks","n":959},{"i":"a_bella-blu","n":590},{"i":"a_bella-jane","n":386},{"i":"a_blondie-bombshell","n":433},{"i":"a_booty_ass","n":277},{"i":"a_bootyfrutti","n":884},{"i":"a_brenna-mckenna","n":235},{"i":"a_brianna-bourbon","n":610},{"i":"a_bridgette-b","n":139},{"i":"a_brittany-andrews","n":432},{"i":"a_brooke-beretta","n":244},{"i":"a_cali-carter","n":358},{"i":"a_callie-black","n":502},{"i":"a_camila-cortez","n":287},{"i":"a_carmen-de-luz","n":411},{"i":"a_carolina-cortez","n":270},{"i":"a_casey-saron","n":594},{"i":"a_cassie-del-isla","n":599},{"i":"a_cassie-lenior","n":743},{"i":"a_cassie-solis","n":926},{"i":"a_catalina-ossa","n":262},{"i":"a_chanell-heart","n":390},{"i":"a_chantal-danielle","n":554},{"i":"a_chloe-chevallier","n":512},{"i":"a_chloe-cooper","n":494},{"i":"a_chloe-lapiedra","n":637},{"i":"a_claudia-bavel","n":535},{"i":"a_coralia","n":437},{"i":"a_cory-chase","n":315},{"i":"a_cubbi-thompson","n":692},{"i":"a_curlyrican","n":693},{"i":"a_daisy-fuentes","n":651},{"i":"a_daisy-marie","n":508},{"i":"a_daisy-stone","n":210},{"i":"a_dan-dangler","n":626},{"i":"a_davina-winter","n":181},{"i":"a_dirtydanii-69","n":634},{"i":"a_eliza-eves","n":254},{"i":"a_ellie-nova","n":609},{"i":"a_elly-clutch","n":891},{"i":"a_ely-la-bella","n":662},{"i":"a_emily-rinaudo","n":886},{"i":"a_emma-leigh","n":387},{"i":"a_evandmikee","n":405},{"i":"a_franceska-jaimes","n":456},{"i":"a_gabriela-lopez","n":389},{"i":"a_gia-dibella","n":379},{"i":"a_gia-oh-my","n":602},{"i":"a_gianna-grey","n":275},{"i":"a_gypsy-rose","n":656},{"i":"a_hailey-rose","n":932},{"i":"a_hija-de-venu","n":678},{"i":"a_iluvmysis","n":418},{"i":"a_indianara-jung","n":854},{"i":"a_isabel-moon","n":394},{"i":"a_jacqueline-valentine","n":790},{"i":"a_jade-jantzen","n":145},{"i":"a_jennifer-mendez","n":326},{"i":"a_jessa-rhodes","n":459},{"i":"a_jessica-sodi","n":556},{"i":"a_joanna-angel","n":632},{"i":"a_jocessita","n":684},{"i":"a_josephine-jackson","n":328},{"i":"a_josie-tucker","n":470},{"i":"a_joslyn-jane","n":260},{"i":"a_judy-jolie","n":185},{"i":"a_julia-de-lucia","n":565},{"i":"a_julz-gotti","n":436},{"i":"a_jynx-maze","n":404},{"i":"a_kagney-linn-karter","n":532},{"i":"a_katrina-colt","n":435},{"i":"a_kayla-east","n":615},{"i":"a_kaylynn-keys","n":217},{"i":"a_kazumi","n":560},{"i":"a_kelly-oliveira","n":369},{"i":"a_kenzie-love","n":444},{"i":"a_kenzie-madison","n":348},{"i":"a_kianna-dior","n":657},{"i":"a_kiara-lord","n":317},{"i":"a_kiara-mia","n":530},{"i":"a_kira-perez","n":245},{"i":"a_kitten-latenight","n":325},{"i":"a_kittina-clairette","n":332},{"i":"a_kona-jade","n":569},{"i":"a_krystal-kakes","n":941},{"i":"a_kyra-hot","n":47},{"i":"a_lana-roy","n":249},{"i":"a_lana-sharapova","n":319},{"i":"a_lena-coxx","n":543},{"i":"a_lexi-luna","n":297},{"i":"a_lily-lane","n":82},{"i":"a_linda-gonzalez","n":350},{"i":"a_lorena-lorado","n":814},{"i":"a_lucky-kay","n":970},{"i":"a_luna-angel","n":923},{"i":"a_luna-luxe","n":586},{"i":"a_luna-mills","n":378},{"i":"a_macey-jade","n":293},{"i":"a_maddy-may","n":513},{"i":"a_maddy-oreilly","n":59},{"i":"a_madelyn-monroe","n":202},{"i":"a_madison-ivy","n":913},{"i":"a_madison-wilde","n":658},{"i":"a_maevaa-sinaloa","n":977},{"i":"a_maria-bolona","n":949},{"i":"a_melztube","n":735},{"i":"a_mia-james","n":659},{"i":"a_mia-monroe","n":917},{"i":"a_mia-queen","n":229},{"i":"a_michelle-anderson","n":341},{"i":"a_mila-milkshake","n":551},{"i":"a_mimi-boliviana","n":604},{"i":"a_misha-maver","n":496},{"i":"a_moderngomorrah","n":639},{"i":"a_morgan-lee","n":269},{"i":"a_my-cookie-jar","n":665},{"i":"a_mynewprofession","n":413},{"i":"a_nadia-white","n":272},{"i":"a_nara-ford","n":536},{"i":"a_natalia-starr","n":802},{"i":"a_natalie-brooke","n":552},{"i":"a_nataly-fabiola","n":834},{"i":"a_nickey-huntsman","n":247},{"i":"a_nickiibaby","n":967},{"i":"a_nikky-thorne","n":357},{"i":"a_niky-bimbodoll","n":685},{"i":"a_nini_divine","n":49},{"i":"a_pamela-rios","n":89},{"i":"a_paola-hard","n":531},{"i":"a_payton-presle","n":623},{"i":"a_persias-paradise","n":961},{"i":"a_porsha-carrera","n":167},{"i":"a_queen-rogue","n":644},{"i":"a_reagan-foxx","n":351},{"i":"a_roxie-sinner","n":464},{"i":"a_ruth-lee","n":579},{"i":"a_sadie-summers","n":629},{"i":"a_salome-gil","n":367},{"i":"a_samantha-cruuz","n":620},{"i":"a_secret","n":415},{"i":"a_selena-ivy","n":506},{"i":"a_serena-santos","n":352},{"i":"a_sheila-ortega","n":366},{"i":"a_sheinsh","n":184},{"i":"a_sicilian-billions","n":972},{"i":"a_sophia-leone","n":613},{"i":"a_steffy-moreno","n":674},{"i":"a_stella-andrews","n":510},{"i":"a_sydney-summers","n":498},{"i":"a_taylee-wood","n":255},{"i":"a_thick-ass-daphne","n":519},{"i":"a_tiffani-madison","n":597},{"i":"a_tokyo-leigh","n":663},{"i":"a_trixi-brooks","n":907},{"i":"a_vanessa-vega","n":603},{"i":"a_vegas-vixen","n":524},{"i":"a_vera-jarw","n":547},{"i":"a_vika-borja","n":125},{"i":"a_whitney-oc","n":598},{"i":"a_yae-triple-x","n":873},{"i":"a_yiny-leon","n":893},{"i":"a_yorgelis-carrillo","n":490},{"i":"a_yvonna-carlo","n":458},{"i":"a_zoey-foxx","n":898}];

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
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "-")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-fA-F]+);/g, function (m, h) { return String.fromCodePoint(parseInt(h, 16)); })
    .replace(/&#(\d+);/g, function (m, d) { return String.fromCodePoint(parseInt(d, 10)); })
    .replace(/\s+/g, " ");
}

function fixUrl(u) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return SITE + u;
  return u;
}

function stdHeaders(extra) {
  var h = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": REFERER
  };
  if (extra) { for (var k in extra) h[k] = extra[k]; }
  return h;
}

// ===== REX 网络层（Widget.http 单通道，替代蜘蛛的 req+fetch 双通道） =====
async function httpRaw(url, headers, timeoutMs) {
  try {
    var res = await Widget.http.get(url, { headers: headers, timeout: timeoutMs || 15000 });
    var status = 0;
    if (res) {
      if (typeof res.status === "number") status = res.status;
      else if (typeof res.statusCode === "number") status = res.statusCode;
      else if (typeof res.ok !== "undefined") status = res.ok ? 200 : 0;
      else status = res.data != null ? 200 : 0;
    }
    return { status: status, data: res ? res.data : null };
  } catch (e) {
    return { status: 0, data: null };
  }
}

// 取文本 (minLen 默认 200；状态非 200 且非未知时视为失败)
async function getText(url, headers, minLen, timeoutMs) {
  var need = minLen == null ? 200 : minLen;
  var r = await httpRaw(url, stdHeaders(headers), timeoutMs || 12000);
  if (r.status !== 200 && r.status !== 0) return "";
  var txt = typeof r.data === "string" ? r.data : "";
  return txt.length >= need ? txt : "";
}

// 原始抓取 (不设最小长度, 验 embed 存活状态用)
async function getRaw(url, headers, timeoutMs) {
  var r = await httpRaw(url, stdHeaders(headers), timeoutMs || 9000);
  return { status: r.status, text: typeof r.data === "string" ? r.data : "" };
}

// JSON 抓取 (REST 与 Byse API 共用)
async function getJson(url, timeoutMs) {
  var r = await httpRaw(url, stdHeaders({ "Accept": "application/json" }), timeoutMs || 12000);
  var data = r.data;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch (e) { data = null; }
  }
  if (r.status !== 200 && r.status !== 0) return { status: r.status, data: null };
  return { status: r.status || 200, data: data == null ? null : data };
}

// ===== 纯 JS AES-256-GCM 解密 (Byse playback 载荷用，与蜘蛛同一实现) =====
// 无 WebCrypto / node:crypto 依赖; 已用真实抓包向量 + 随机对照验过。
var AES_SBOX = new Uint8Array([
  0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
  0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
  0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
  0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
  0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
  0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
  0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
  0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
  0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
  0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
  0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
  0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
  0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
  0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
  0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
  0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16
]);
var AES_RCON = [0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36,0x6c,0xd8,0xab,0x4d];
function xtime(x) { return ((x << 1) ^ ((x & 0x80) ? 0x1b : 0x00)) & 0xff; }
function aesExpandKey(key) {
  var Nk = key.length / 4;
  var Nr = Nk + 6;
  var w = new Uint8Array(16 * (Nr + 1));
  w.set(key);
  var tmp = new Uint8Array(4);
  for (var i = Nk; i < 4 * (Nr + 1); i++) {
    tmp.set(w.subarray(4 * (i - 1), 4 * i));
    if (i % Nk === 0) {
      var tt = tmp[0];
      tmp[0] = AES_SBOX[tmp[1]] ^ AES_RCON[i / Nk - 1];
      tmp[1] = AES_SBOX[tmp[2]];
      tmp[2] = AES_SBOX[tmp[3]];
      tmp[3] = AES_SBOX[tt];
    } else if (Nk > 6 && i % Nk === 4) {
      for (var j = 0; j < 4; j++) tmp[j] = AES_SBOX[tmp[j]];
    }
    for (var j2 = 0; j2 < 4; j2++) w[4 * i + j2] = w[4 * (i - Nk) + j2] ^ tmp[j2];
  }
  return { w: w, Nr: Nr };
}
function aesEncryptBlock(w, Nr, input) {
  var s = new Uint8Array(input);
  function addKey(r) { for (var i = 0; i < 16; i++) s[i] ^= w[16 * r + i]; }
  addKey(0);
  for (var r = 1; r <= Nr; r++) {
    for (var i2 = 0; i2 < 16; i2++) s[i2] = AES_SBOX[s[i2]];
    var cp = new Uint8Array(s);
    for (var row = 0; row < 4; row++) {
      for (var col = 0; col < 4; col++) s[row + 4 * col] = cp[row + 4 * ((col + row) % 4)];
    }
    if (r < Nr) {
      for (var c2 = 0; c2 < 4; c2++) {
        var i3 = 4 * c2;
        var a0 = s[i3], a1 = s[i3 + 1], a2 = s[i3 + 2], a3 = s[i3 + 3];
        var x0 = xtime(a0), x1 = xtime(a1), x2 = xtime(a2), x3 = xtime(a3);
        s[i3] = x0 ^ (x1 ^ a1) ^ a2 ^ a3;
        s[i3 + 1] = a0 ^ x1 ^ (x2 ^ a2) ^ a3;
        s[i3 + 2] = a0 ^ a1 ^ x2 ^ (x3 ^ a3);
        s[i3 + 3] = (x0 ^ a0) ^ a1 ^ a2 ^ x3;
      }
    }
    addKey(r);
  }
  return s;
}
function gfMul(x, y) {
  var z = new Uint8Array(16);
  var v = new Uint8Array(y);
  for (var i = 0; i < 16; i++) {
    for (var j = 7; j >= 0; j--) {
      if ((x[i] >>> j) & 1) { for (var k = 0; k < 16; k++) z[k] ^= v[k]; }
      var lsb = v[15] & 1;
      for (var k2 = 15; k2 > 0; k2--) v[k2] = (v[k2] >>> 1) | ((v[k2 - 1] & 1) << 7);
      v[0] >>>= 1;
      if (lsb) v[0] ^= 0xe1;
    }
  }
  return z;
}
function ghash(h, data) {
  var y = new Uint8Array(16);
  for (var off = 0; off < data.length; off += 16) {
    for (var i = 0; i < 16; i++) y[i] ^= data[off + i] || 0;
    y = gfMul(y, h);
  }
  return y;
}
function inc32(ctr) {
  var c = new Uint8Array(ctr);
  var n = ((c[12] << 24) | (c[13] << 16) | (c[14] << 8) | c[15]) >>> 0;
  n = (n + 1) >>> 0;
  c[12] = (n >>> 24) & 0xff; c[13] = (n >>> 16) & 0xff; c[14] = (n >>> 8) & 0xff; c[15] = n & 0xff;
  return c;
}
function aesGcmDecryptBytes(key, iv, dataWithTag) {
  if (key.length !== 16 && key.length !== 24 && key.length !== 32) return null;
  if (iv.length !== 12 || dataWithTag.length < 16) return null;
  var exp = aesExpandKey(key);
  var w = exp.w, Nr = exp.Nr;
  var H = aesEncryptBlock(w, Nr, new Uint8Array(16));
  var J0 = new Uint8Array(16);
  J0.set(iv); J0[15] = 1;
  var ctLen = dataWithTag.length - 16;
  var ct = dataWithTag.subarray(0, ctLen);
  var tagGiven = dataWithTag.subarray(ctLen);
  var lenBlock = new Uint8Array(16);
  var dv = new DataView(lenBlock.buffer);
  dv.setUint32(8, 0); dv.setUint32(12, (ctLen * 8) >>> 0);
  dv.setUint32(0, 0); dv.setUint32(4, Math.floor(ctLen / 0x20000000));
  var padLen = (16 - (ct.length % 16)) % 16;
  var gInput = new Uint8Array(ct.length + padLen + 16);
  gInput.set(ct); gInput.set(lenBlock, gInput.length - 16);
  var S = ghash(H, gInput);
  var EJ0 = aesEncryptBlock(w, Nr, J0);
  for (var i = 0; i < 16; i++) { if ((S[i] ^ EJ0[i]) !== tagGiven[i]) return null; }
  var pt = new Uint8Array(ctLen);
  var ctr = J0;
  for (var off = 0; off < ctLen; off += 16) {
    ctr = inc32(ctr);
    var ks = aesEncryptBlock(w, Nr, ctr);
    var n = Math.min(16, ctLen - off);
    for (var j = 0; j < n; j++) pt[off + j] = ct[off + j] ^ ks[j];
  }
  return pt;
}

// base64 / base64url 手工解码 (不依赖 Buffer / atob)
function b64Decode(s) {
  var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var rev = {};
  for (var i = 0; i < alpha.length; i++) rev[alpha[i]] = i;
  rev["-"] = 62; rev["_"] = 63;
  var str = String(s || "").replace(/=+$/, "");
  var out = [];
  var buf = 0, bits = 0;
  for (var ci = 0; ci < str.length; ci++) {
    var v = rev[str.charAt(ci)];
    if (v === undefined) continue;
    buf = (buf << 6) | v; bits += 6;
    if (bits >= 8) { bits -= 8; out.push((buf >>> bits) & 0xff); }
  }
  return new Uint8Array(out);
}

// UTF-8 字节 → 字符串 (不依赖 TextDecoder)
function utf8Decode(bytes) {
  var out = "";
  var i = 0;
  while (i < bytes.length) {
    var b = bytes[i];
    if (b < 0x80) { out += String.fromCharCode(b); i += 1; }
    else if ((b & 0xe0) === 0xc0) { out += String.fromCharCode(((b & 0x1f) << 6) | (bytes[i + 1] & 0x3f)); i += 2; }
    else if ((b & 0xf0) === 0xe0) { out += String.fromCharCode(((b & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f)); i += 3; }
    else {
      var cp = ((b & 0x07) << 18) | ((bytes[i + 1] & 0x3f) << 12) | ((bytes[i + 2] & 0x3f) << 6) | (bytes[i + 3] & 0x3f);
      var c = cp - 0x10000;
      out += String.fromCharCode(0xd800 + (c >> 10), 0xdc00 + (c & 0x3ff));
      i += 4;
    }
  }
  return out;
}

// ===== Byse 线 (bigbuttshub2.top / bysetayico.com) =====
// 密钥拼法镜像其前端 ws(): version n (1-20) → 取 key_parts 的第 n 与第
// 31-n 段 (1-based); 取不到则全部拼接 (前端校验段数 2..30)。
function byseDecryptPlayback(pb) {
  try {
    var parts = (pb && Array.isArray(pb.key_parts)) ? pb.key_parts : [];
    if (!parts.length || !pb.iv || !pb.payload) return null;
    var v = parseInt(pb.version, 10);
    var chosen = null;
    if (isFinite(v) && v >= 1 && v <= 20) {
      var a = v, b = 31 - v;
      if (parts[a - 1] && parts[b - 1]) chosen = [parts[a - 1], parts[b - 1]];
    }
    if (!chosen) chosen = parts;
    var chunks = [];
    for (var i = 0; i < chosen.length; i++) chunks.push(b64Decode(chosen[i]));
    var keyLen = 0;
    for (var j = 0; j < chunks.length; j++) keyLen += chunks[j].length;
    var key = new Uint8Array(keyLen);
    var off = 0;
    for (var k = 0; k < chunks.length; k++) { key.set(chunks[k], off); off += chunks[k].length; }
    var pt = aesGcmDecryptBytes(key, b64Decode(pb.iv), b64Decode(pb.payload));
    if (!pt) return null;
    return JSON.parse(utf8Decode(pt));
  } catch (e) { return null; }
}

// 设备侧现场铸造: 调 embed 所在域 API 拿记录 → 解密 → 取最高画质直链。
// API 对机房/代理出口 403, 设备出口同铸同播自洽; 任一步失败返回 ""。
async function resolveByse(embedUrl) {
  var om = String(embedUrl || "").match(/^(https?:\/\/[^/]+)/);
  var origin = om ? om[1] : "";
  var cm = String(embedUrl || "").match(/\/e\/([^/?#]+)/);
  var code = cm ? cm[1] : "";
  if (!code) return "";
  var origins = [];
  var cand = [origin, "https://bigbuttshub2.top", "https://bysetayico.com"];
  for (var i = 0; i < cand.length; i++) {
    if (cand[i] && origins.indexOf(cand[i]) < 0) origins.push(cand[i]);
  }
  for (var j = 0; j < origins.length; j++) {
    var r = await getJson(origins[j] + "/api/videos/" + encodeURIComponent(code), 10000);
    if (r.status !== 200 || !r.data || !r.data.playback) continue;
    var plain = byseDecryptPlayback(r.data.playback);
    var sources = (plain && Array.isArray(plain.sources)) ? plain.sources.filter(function (s) { return s && s.url; }) : [];
    if (sources.length) {
      sources.sort(function (a, b) { return (b.height || 0) - (a.height || 0); });
      return sources[0].url;
    }
  }
  return "";
}

// ===== vidhide 解包 (Worker 镜像算法, 详情验线用) =====
function unpackDeanEdwards(html) {
  var m = String(html || "").match(/eval\(function\(p,a,c,k,e,d\)[\s\S]*?\('([\s\S]*?)',(\d+),(\d+),'([\s\S]*?)'\.split\('\|'\)/);
  if (!m) return "";
  var p = m[1];
  var a = parseInt(m[2], 10);
  var c = parseInt(m[3], 10);
  var kw = m[4].split("|");
  var dict = {};
  function tok(i) {
    function ch(n) { return n > 35 ? String.fromCharCode(n + 29) : n.toString(36); }
    var s = "";
    var n = i;
    if (n >= a) { s += tok(Math.floor(n / a)); }
    s += ch(n % a);
    return s;
  }
  for (var i2 = 0; i2 < c; i2++) dict[tok(i2)] = kw[i2] || tok(i2);
  return p.replace(/\b\w+\b/g, function (w) { return dict[w] || w; });
}

// 验一条 vidhide embed 的存活状态: strong=有 hls4 / weak=有 links 无 hls4 /
// dead=宿主已删 / unknown=取证失败 (按 strong 对待)
async function vetVidhide(embedUrl) {
  var r = await getRaw(embedUrl, { Referer: REFERER }, 9000);
  var text = r.text;
  if (!text) return "unknown";
  if (/no longer available|has been deleted/i.test(text)) return "dead";
  var src = unpackDeanEdwards(text) || text;
  if (/"hls4"\s*:/.test(src)) return "strong";
  if (/"hls\d+"\s*:|"file"\s*:/.test(src)) return "weak";
  return "unknown";
}

// ===== StreamCash 直连解析 (与蜘蛛第三轮相同, 实拉验通) =====
// embed 页 __PCr = base64(JSON) 内含 CDN 直链; 旧版 files{user_ip} + /pass
// 铸造逻辑保留兜底。注: 旧铸造里的 files 是 MD5(user IP) 的服务器端会话值,
// 来自 embed 页本身 (非伪造凭证), 与蜘蛛原逻辑一致。
function sha256hex(str) {
  // FIPS 180-4 纯 JS 实现 (无 crypto 依赖)
  var K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ];
  function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }
  var bytes = [];
  for (var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);
    if (code < 0x80) bytes.push(code);
    else if (code < 0x800) { bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f)); }
    else { bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f)); }
  }
  var bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  bytes.push(0, 0, 0, 0, (bitLen >>> 24) & 0xff, (bitLen >>> 16) & 0xff, (bitLen >>> 8) & 0xff, bitLen & 0xff);
  var h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  var h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
  var w = new Array(64);
  for (var block = 0; block < bytes.length; block += 64) {
    for (var i2 = 0; i2 < 16; i2++) {
      w[i2] = (bytes[block + i2 * 4] << 24) | (bytes[block + i2 * 4 + 1] << 16) | (bytes[block + i2 * 4 + 2] << 8) | bytes[block + i2 * 4 + 3];
    }
    for (var i3 = 16; i3 < 64; i3++) {
      var s0 = rotr(w[i3 - 15], 7) ^ rotr(w[i3 - 15], 18) ^ (w[i3 - 15] >>> 3);
      var s1 = rotr(w[i3 - 2], 17) ^ rotr(w[i3 - 2], 19) ^ (w[i3 - 2] >>> 10);
      w[i3] = (w[i3 - 16] + s0 + w[i3 - 7] + s1) | 0;
    }
    var a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, hh = h7;
    for (var i4 = 0; i4 < 64; i4++) {
      var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      var ch = (e & f) ^ (~e & g);
      var temp1 = (hh + S1 + ch + K[i4] + w[i4]) | 0;
      var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      var maj = (a & b) ^ (a & c) ^ (b & c);
      var temp2 = (S0 + maj) | 0;
      hh = g; g = f; f = e; e = (d + temp1) | 0;
      d = c; c = b; b = a; a = (temp1 + temp2) | 0;
    }
    h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0; h5 = (h5 + f) | 0; h6 = (h6 + g) | 0; h7 = (h7 + hh) | 0;
  }
  return [h0, h1, h2, h3, h4, h5, h6, h7].map(function (h) { return (h >>> 0).toString(16).padStart(8, "0"); }).join("");
}

function md5hex(input) {
  // RSA Data Security MD5 (compact public-domain style implementation)
  function rl(n, c) { return (n << c) | (n >>> (32 - c)); }
  function add(x, y) { var l = (x & 0xffff) + (y & 0xffff); var m = (x >> 16) + (y >> 16) + (l >> 16); return (m << 16) | (l & 0xffff); }
  function F(x, y, z) { return (x & y) | (~x & z); }
  function G(x, y, z) { return (x & z) | (y & ~z); }
  function H(x, y, z) { return x ^ y ^ z; }
  function I(x, y, z) { return y ^ (x | ~z); }
  function ff(a, b, c, d, x, s, ac) { a = add(a, add(add(F(b, c, d), x), ac)); return add(rl(a, s), b); }
  function gg(a, b, c, d, x, s, ac) { a = add(a, add(add(G(b, c, d), x), ac)); return add(rl(a, s), b); }
  function hh2(a, b, c, d, x, s, ac) { a = add(a, add(add(H(b, c, d), x), ac)); return add(rl(a, s), b); }
  function ii(a, b, c, d, x, s, ac) { a = add(a, add(add(I(b, c, d), x), ac)); return add(rl(a, s), b); }
  var str = unescape(encodeURIComponent(String(input)));
  var nblk = ((str.length + 8) >> 6) + 1;
  var blks = new Array(nblk * 16).fill(0);
  for (var i = 0; i < str.length; i++) blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
  blks[str.length >> 2] |= 0x80 << ((str.length % 4) * 8);
  blks[nblk * 16 - 2] = str.length * 8;
  var a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  for (var bi = 0; bi < blks.length; bi += 16) {
    var oa = a, ob = b, oc = c, od = d;
    a = ff(a, b, c, d, blks[bi + 0], 7, 0xd76aa478); d = ff(d, a, b, c, blks[bi + 1], 12, 0xe8c7b756);
    c = ff(c, d, a, b, blks[bi + 2], 17, 0x242070db); b = ff(b, c, d, a, blks[bi + 3], 22, 0xc1bdceee);
    a = ff(a, b, c, d, blks[bi + 4], 7, 0xf57c0faf); d = ff(d, a, b, c, blks[bi + 5], 12, 0x4787c62a);
    c = ff(c, d, a, b, blks[bi + 6], 17, 0xa8304613); b = ff(b, c, d, a, blks[bi + 7], 22, 0xfd469501);
    a = ff(a, b, c, d, blks[bi + 8], 7, 0x698098d8); d = ff(d, a, b, c, blks[bi + 9], 12, 0x8b44f7af);
    c = ff(c, d, a, b, blks[bi + 10], 17, 0xffff5bb1); b = ff(b, c, d, a, blks[bi + 11], 22, 0x895cd7be);
    a = ff(a, b, c, d, blks[bi + 12], 7, 0x6b901122); d = ff(d, a, b, c, blks[bi + 13], 12, 0xfd987193);
    c = ff(c, d, a, b, blks[bi + 14], 17, 0xa679438e); b = ff(b, c, d, a, blks[bi + 15], 22, 0x49b40821);
    a = gg(a, b, c, d, blks[bi + 1], 5, 0xf61e2562); d = gg(d, a, b, c, blks[bi + 6], 9, 0xc040b340);
    c = gg(c, d, a, b, blks[bi + 11], 14, 0x265e5a51); b = gg(b, c, d, a, blks[bi + 0], 20, 0xe9b6c7aa);
    a = gg(a, b, c, d, blks[bi + 5], 5, 0xd62f105d); d = gg(d, a, b, c, blks[bi + 10], 9, 0x02441453);
    c = gg(c, d, a, b, blks[bi + 15], 14, 0xd8a1e681); b = gg(b, c, d, a, blks[bi + 4], 20, 0xe7d3fbc8);
    a = gg(a, b, c, d, blks[bi + 9], 5, 0x21e1cde6); d = gg(d, a, b, c, blks[bi + 14], 9, 0xc33707d6);
    c = gg(c, d, a, b, blks[bi + 3], 14, 0xf4d50d87); b = gg(b, c, d, a, blks[bi + 8], 20, 0x455a14ed);
    a = gg(a, b, c, d, blks[bi + 13], 5, 0xa9e3e905); d = gg(d, a, b, c, blks[bi + 2], 9, 0xfcefa3f8);
    c = gg(c, d, a, b, blks[bi + 7], 14, 0x676f02d9); b = gg(b, c, d, a, blks[bi + 12], 20, 0x8d2a4c8a);
    a = hh2(a, b, c, d, blks[bi + 5], 5, 0xfffa3942); d = hh2(d, a, b, c, blks[bi + 8], 11, 0x8771f681);
    c = hh2(c, d, a, b, blks[bi + 11], 16, 0x6d9d6122); b = hh2(b, c, d, a, blks[bi + 14], 23, 0xfde5380c);
    a = hh2(a, b, c, d, blks[bi + 1], 5, 0xa4beea44); d = hh2(d, a, b, c, blks[bi + 4], 11, 0x4bdecfa9);
    c = hh2(c, d, a, b, blks[bi + 7], 16, 0xf6bb4b60); b = hh2(b, c, d, a, blks[bi + 10], 23, 0xbebfbc70);
    a = hh2(a, b, c, d, blks[bi + 13], 5, 0x289b7ec6); d = hh2(d, a, b, c, blks[bi + 2], 11, 0xeaa127fa);
    c = hh2(c, d, a, b, blks[bi + 5], 16, 0xd4ef3085); b = hh2(b, c, d, a, blks[bi + 8], 23, 0x04881d05);
    a = hh2(a, b, c, d, blks[bi + 11], 5, 0xd9d4d039); d = hh2(d, a, b, c, blks[bi + 14], 11, 0xe6db99e5);
    c = hh2(c, d, a, b, blks[bi + 3], 16, 0x1fa27cf8); b = hh2(b, c, d, a, blks[bi + 6], 23, 0xc4ac5665);
    a = ii(a, b, c, d, blks[bi + 0], 6, 0xf4292244); d = ii(d, a, b, c, blks[bi + 7], 10, 0x432aff97);
    c = ii(c, d, a, b, blks[bi + 10], 15, 0xab9423a7); b = ii(b, c, d, a, blks[bi + 5], 21, 0xfc93a039);
    a = ii(a, b, c, d, blks[bi + 12], 6, 0x655b59c3); d = ii(d, a, b, c, blks[bi + 3], 10, 0x8f0ccc92);
    c = ii(c, d, a, b, blks[bi + 6], 15, 0xffeff47d); b = ii(b, c, d, a, blks[bi + 1], 21, 0x85845dd1);
    a = ii(a, b, c, d, blks[bi + 8], 6, 0x6fa87e4f); d = ii(d, a, b, c, blks[bi + 15], 10, 0xfe2ce6e0);
    c = ii(c, d, a, b, blks[bi + 14], 15, 0xa3014314); b = ii(b, c, d, a, blks[bi + 11], 21, 0x4e0811a1);
    a = ii(a, b, c, d, blks[bi + 9], 6, 0xf7537e82); d = ii(d, a, b, c, blks[bi + 4], 10, 0xbd3af235);
    c = ii(c, d, a, b, blks[bi + 2], 15, 0x2ad7d2bb); b = ii(b, c, d, a, blks[bi + 13], 21, 0xeb86d391);
    a = add(a, oa); b = add(b, ob); c = add(c, oc); d = add(d, od);
  }
  function hex(n) {
    var s = "";
    for (var i = 0; i < 4; i++) s += ((n >> (i * 8)) & 0xff).toString(16).padStart(2, "0");
    return s;
  }
  return hex(a) + hex(b) + hex(c) + hex(d);
}

async function resolveStreamcash(embedUrl) {
  try {
    var html = await getText(embedUrl, { Referer: REFERER }, 500, 15000);
    if (!html) return "";
    var pcr = html.match(/__PCr\s*=\s*'([^']+)'/) || html.match(/__PCr\s*=\s*"([^"]+)"/);
    if (pcr) {
      try {
        var cfg = JSON.parse(utf8Decode(b64Decode(pcr[1])));
        if (cfg && cfg.src && /^https?:\/\//.test(cfg.src)) return cfg.src;
      } catch (e) { /* 落旧算法 */ }
    }
    var fm = html.match(/files\s*=\s*\{([\s\S]*?)\}/);
    if (!fm) return "";
    var body = fm[1];
    function g(k) {
      var m = body.match(new RegExp(k + "\\s*:\\s*\"([^\"]*)\""));
      return m ? m[1] : "";
    }
    var ip = g("user_ip");
    var unauth = g("unauth_ip") || ip;
    var ipHash = ip ? md5hex(ip) : "";
    var sm = html.match(/sources\s*=\s*\{\s*file\s*:\s*"([^"]+)"/) || html.match(/sources\s*=\s*\[\s*\{\s*file\s*:\s*"([^"]+)"/);
    var src = sm ? sm[1] : "";
    if (!src) return "";
    src = src.replace(/&amp;/g, "&").replace(/&hash=([0-9a-f]{64})/, function (mm, s256) { return "&hash=" + s256; });
    if (ipHash) {
      src = src.replace("/pass/", "/" + ipHash + "/").replace("xxx.xxx.xxx.xxx", ip);
    }
    if (unauth && ip && ip !== unauth) src = src.replace(unauth, ip);
    return src;
  } catch (e) { return ""; }
}

// ===== REST 列表层 (分页权威; REX 读不到 X-WP-TotalPages，靠空页止翻) =====
function toCard(id, title, pic, remarks) {
  return {
    id: id,
    type: "url",
    title: title,
    posterPath: pic,
    coverUrl: pic,
    backdropPath: pic,
    link: id,
    description: remarks || "",
    releaseDate: remarks || "",
    mediaType: "movie"
  };
}

async function fetchPostCards(query, page) {
  var qs = (query ? query + "&" : "") + "per_page=" + PER_PAGE + "&page=" + page + "&_fields=id,link,title,date,featured_media";
  var r = await getJson(API + "/posts?" + qs, 15000);
  if (r.status !== 200 || !Array.isArray(r.data)) return [];
  var ids = [];
  var seenId = {};
  for (var i = 0; i < r.data.length; i++) {
    var fm = r.data[i] && r.data[i].featured_media;
    if (fm && !seenId[fm]) { seenId[fm] = true; ids.push(fm); }
  }
  var media = {};
  if (ids.length) {
    var m = await getJson(API + "/media?include=" + ids.join(",") + "&per_page=100&_fields=id,source_url,media_details", 15000);
    if (m.status === 200 && Array.isArray(m.data)) {
      for (var j = 0; j < m.data.length; j++) {
        var it = m.data[j];
        var sizes = (it.media_details && it.media_details.sizes) || {};
        media[it.id] = (sizes.wpst_thumb_large && sizes.wpst_thumb_large.source_url) || it.source_url || "";
      }
    }
  }
  var list = [];
  for (var k = 0; k < r.data.length; k++) {
    var p = r.data[k];
    if (!p || !p.link) continue;
    list.push(toCard(p.link, clean(p.title && p.title.rendered) || p.link, fixUrl(media[p.featured_media] || ""), ""));
  }
  return list;
}

// ===== HTML 归档兜底解析 (仅 REST 不可用时第 1 页保命) =====
function parseCards(html) {
  var out = [];
  var src = String(html || "");
  var firstArt = src.indexOf("<article");
  var scanFrom = firstArt >= 0 ? firstArt + 1 : 0;
  var cut = src.length;
  var markers = ["<aside", '<h2 class="widget-title">', "widget_videos_block"];
  for (var mi = 0; mi < markers.length; mi++) {
    var ix = src.indexOf(markers[mi], scanFrom);
    if (ix > 0 && ix < cut) cut = ix;
  }
  src = src.slice(0, cut);
  var seen = {};
  var parts = src.split("<article").slice(1);
  for (var i = 0; i < parts.length; i++) {
    var chunk = parts[i].slice(0, 4500);
    if (chunk.indexOf("loop-video") < 0) continue;
    var urlM = chunk.match(/<a href="(https:\/\/bigbuttshub\.com\/[^"]+\/)"/);
    if (!urlM) continue;
    var url = urlM[1];
    if (/\/(category|tag|pornstar|actors|categories|tags|blog|page)\//.test(url)) continue;
    if (seen[url]) continue;
    seen[url] = true;
    var imgM = chunk.match(/data-main-thumb="([^"]+)"/) || chunk.match(/<img[^>]+src="([^"]+)"/);
    var titleM = imgM ? (chunk.match(/alt="([^"]*)"/) || chunk.match(/data-main-thumb="[^"]+"[^>]*alt="([^"]*)"/)) : chunk.match(/<a[^>]+title="([^"]*)"/);
    var durM = chunk.match(/class="duration"[\s\S]{0,80}?(\d{1,2}:\d{2}(?::\d{2})?)/);
    out.push(toCard(url, clean(titleM ? titleM[1] : "") || url, fixUrl(imgM ? imgM[1] : ""), durM ? durM[1] : ""));
  }
  return out;
}

function catHtmlUrl(typeId) {
  var prefix = typeId.charAt(0);
  var path = typeId.slice(2).split("~");
  if (prefix === "c") return SITE + "/category/" + path.join("/") + "/";
  if (prefix === "t") return SITE + "/tag/" + path[0] + "/";
  if (prefix === "a") return SITE + "/pornstar/" + path[0] + "/";
  return "";
}

function catByTid(tid) {
  for (var i = 0; i < CATS.length; i++) {
    if (CATS[i].i === tid) return CATS[i];
  }
  return null;
}

// ===== 详情页线路提取 (第三轮重写, 同蜘蛛) =====
function hostOf(url) {
  var m = String(url || "").match(/^https?:\/\/([^/?#]+)/i);
  if (!m) return "";
  var h = m[1].toLowerCase();
  var at = h.lastIndexOf("@");
  if (at >= 0) h = h.slice(at + 1);
  var colon = h.indexOf(":");
  if (colon >= 0) h = h.slice(0, colon);
  return h;
}

function extractEmbeds(html) {
  var out = { vidhide: [], streamcash: [], byse: [], sniff: [] };
  var region = String(html || "");
  var start = region.indexOf("video-player");
  if (start >= 0) region = region.slice(start, start + 60000);
  var cut = region.indexOf("happy-under-player");
  if (cut > 0) region = region.slice(0, cut);
  var seen = {};
  var re = /<iframe[^>]*?src\s*=\s*"([^"]+)"/gi;
  var m;
  while ((m = re.exec(region))) {
    var url = fixUrl(m[1]);
    if (!url || seen[url]) continue;
    var host = hostOf(url);
    if (!host) continue;
    if (/realsrv|cbxyz|exoclick|trafficjunky|juicyads/.test(host)) continue;
    if (host === "playmogo.com" || host === "filemoon.art") continue; // 锁 / 已停放
    seen[url] = true;
    if (host === "bigbuttshub.top" || host === "bigbuttshub3.top") out.vidhide.push(url);
    else if (host === "streamcash.to") out.streamcash.push(url);
    else if (host === "bigbuttshub2.top" || host === "bysetayico.com") out.byse.push(url);
    else out.sniff.push(url);
  }
  return out;
}

function metaProp(html, prop) {
  var re1 = new RegExp('<meta[^>]+property=["\']' + prop + '["\'][^>]+content=["\']([^"\']*)["\']', "i");
  var re2 = new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]+property=["\']' + prop + '["\']', "i");
  var re3 = new RegExp('<meta[^>]+itemprop=["\']' + prop + '["\'][^>]+content=["\']([^"\']*)["\']', "i");
  var m = html.match(re1) || html.match(re2) || html.match(re3);
  return m ? clean(m[1]) : "";
}

function extractDetailMeta(html) {
  var title = metaProp(html, "og:title");
  var pic = fixUrl(metaProp(html, "og:image"));
  var desc = metaProp(html, "og:description");
  var upM = html.match(/itemprop="uploadDate" content="([0-9]{4})/) || html.match(/datetime="([0-9]{4})-[0-9]{2}-[0-9]{2}/);
  var durM = html.match(/itemprop="duration" content="(?:PT)?([0-9HMS]+)"/) || html.match(/class="duration"[\s\S]{0,80}?(\d{1,2}:\d{2}(?::\d{2})?)/);
  return { title: title, pic: pic, desc: desc, year: upM ? upM[1] : "", dur: durM ? durM[1] : "" };
}

// ===== REX 入口 =====
function pickKeyword(params) {
  if (params == null) return "";
  if (typeof params === "string" || typeof params === "number") return String(params).trim();
  var keys = ["keyword", "q", "search", "text", "query", "wd", "key"];
  for (var i = 0; i < keys.length; i++) {
    if (params[keys[i]]) return String(params[keys[i]]).trim();
  }
  return "";
}

async function loadList(params) {
  params = params || {};
  var page = parseInt(params.page, 10) || 1;
  var tid = t(params.path || params.cat || "");
  var cat = tid ? catByTid(tid) : null;
  if (!cat) {
    // 最新 (首页流)
    var r = await fetchPostCards("", page);
    if (r.length || page > 1) return r;
    var html = await getText(SITE + "/", {}, 5000);
    var list = html ? parseCards(html) : [];
    return list.length ? list : [{ id: "err", type: "url", title: "载入失败，请稍后重试" }];
  }
  var taxParam = cat.i.charAt(0) === "c" ? "categories" : cat.i.charAt(0) === "t" ? "tags" : "actors";
  var r2 = await fetchPostCards(taxParam + "=" + cat.n, page);
  if (r2.length || page > 1) return r2;
  // 第 1 页 REST 失败 → HTML 归档保命 (仅此时用, 分页不保证)
  var html2 = await getText(catHtmlUrl(cat.i), {}, 5000);
  var list2 = html2 ? parseCards(html2) : [];
  return list2.length ? list2 : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
}

async function search(params) {
  params = params || {};
  var wd = pickKeyword(params);
  var page = parseInt(params.page, 10) || 1;
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  var r = await fetchPostCards("search=" + encodeURIComponent(wd), page);
  if (r.length || page > 1) return r;
  var html = await getText(SITE + "/?s=" + encodeURIComponent(wd), {}, 5000);
  var list = html ? parseCards(html) : [];
  return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
}

async function loadDetail(link) {
  var durl = t(link);
  try {
    var html = await getText(durl, { Referer: REFERER }, 5000);
    if (!html) {
      return { id: durl, type: "url", title: "载入失败", description: "详情页请求失败，请稍后重试" };
    }
    var info = extractDetailMeta(html);
    var emb = extractEmbeds(html);

    // 逐条验 vidhide embed: 已删的直接跳过 (最多验 3 条防拖慢)
    var vid = "";
    var vidState = "unknown";
    var vidCandidates = emb.vidhide.slice(0, 3);
    for (var i = 0; i < vidCandidates.length; i++) {
      var st = await vetVidhide(vidCandidates[i]);
      if (st !== "dead") { vid = vidCandidates[i]; vidState = st; break; }
    }

    // 按蜘蛛评分选线: vidhide 正常 100 > streamcash 80 > Byse 60 > vidhide 弱 25
    var videoUrl = "";
    var playHeaders = null;
    if (vid && vidState !== "weak") {
      videoUrl = BBH_WORKER + "/v?u=" + encodeURIComponent(vid);
      playHeaders = { "User-Agent": UA, "Referer": BBH_WORKER + "/" };
    }
    if (!videoUrl && emb.streamcash.length) {
      var direct = await resolveStreamcash(emb.streamcash[0]);
      if (direct) {
        videoUrl = direct;
        playHeaders = { "User-Agent": UA, "Referer": "https://streamcash.to/" };
      }
    }
    if (!videoUrl && emb.byse.length) {
      var direct2 = await resolveByse(emb.byse[0]);
      if (direct2) {
        videoUrl = direct2;
        playHeaders = { "User-Agent": UA, "Referer": emb.byse[0] };
      }
    }
    if (!videoUrl && vid) {
      videoUrl = BBH_WORKER + "/v?u=" + encodeURIComponent(vid);
      playHeaders = { "User-Agent": UA, "Referer": BBH_WORKER + "/" };
    }
    if (!videoUrl) {
      var note = "未找到可直解的播放地址";
      if (emb.sniff.length) note += "（仅有未知宿主线路，猫源靠嗅探，REX 无法直解）";
      if (emb.byse.length) note += "（Byse 线设备侧铸造失败，可能被其 API 拒绝）";
      return { id: durl, type: "url", title: info.title || "解析失败", description: note };
    }
    var descParts = [];
    if (info.desc) descParts.push(info.desc);
    if (info.year) descParts.push(info.year);
    if (info.dur) descParts.push(info.dur);
    return {
      id: durl,
      type: "detail",
      title: info.title || durl,
      link: durl,
      posterPath: info.pic,
      coverUrl: info.pic,
      backdropPath: info.pic,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: playHeaders,
      description: descParts.join(" · ")
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
