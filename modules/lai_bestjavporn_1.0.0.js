// BestJavPorn for REX (lai_bestjavporn v1.0.0) —— 2026-10-22 新写。
// 后端: https://www.bestjavporn.com (RetroTube 系 WordPress 聚合站)。
// 猫源只读蓝图: mira-cat nodejs/src/spider/video/bestjavporn.js (2026-10-22
// 定版: 铸造库 + 高清展开 47838a03), 本模块按其已真机验证的机制移植到
// REX 沙箱:
//
//  数据面: 列表/详情/搜索取页三通道串行兜底 —— ①自有 Worker
//  pornfhd-fetch /get ②jina (x-respond-with: html) ③直连, 成一家即止
//  (猫源设备端实测列表由 jina 取胜; 通道集与蜘蛛一致)。分类 477 个
//  (蜘蛛逐个实测有片才收的完整表, type_id 内嵌站方 /v{n}/ 前缀; 前缀
//  漂移时出 0 卡自动用无前缀路径重试一次, 与蜘蛛同法)。封面
//  pics.pornfhd.com 直连出图。
//  播放主路 = 铸造库: GET pornfhd-fetch /cast?u=<watch 页> 命中得 embed
//  路径集 (服务端预铸, 绕开设备侧被站方 CF 拉黑的铸造 POST 出口)。
//  播放兜底 = 模块内现铸: 详情页 #video-player[data-mpu] +
//  #video-player-area[video-id] -> dex 铸造令牌 (主盐 '_0x58fe15',
//  与 cast.js 实测一致) -> POST /api/play/ (ver=2) 两路 (经 Worker
//  /post、Widget.http 直连 POST) -> data/reserve 再 dex 解出路径集。
//  embed 解包: 逐个 embed 用 Widget.http 直连取页 (设备自身出口, lk
//  家族文件令牌绑查看者 IP, 天然自洽), 纯 JS 解密 data-config 得
//  sources; HLS 主清单直连取回展开变体逐档出线, 线路名标清晰度,
//  组内按清晰度降序 (复刻猫源高清修复: CloudCDN 1080p, MaxStream
//  天花板 720p)。
//  全链失败 -> 网页嗅探线兜底, 详情描述写清铸造归因 (cast-bank /
//  live / sniff) 与各通道结论, 不崩不空。
//
// ★ 沙箱铁律 (真机血泪): REX (JSC) 无 setTimeout/setInterval、无全局
// fetch、无 TextDecoder/TextEncoder。本模块一律只走 Widget.http 并显
// 式带 timeout; 无任何定时器 (重试靠串行请求自身耗时); 密码件的
// UTF-8 编解码为纯 JS 实现。验证 harness 在 node:vm 删除上述全局后跑。

WidgetMetadata = {
  id: "lai_bestjavporn",
  title: "BestJavPorn",
  description: "BestJavPorn（bestjavporn.com）：精选/片商/标签共 477 分类，播放走铸造库优先、模块内现铸兜底，线路逐档标清晰度（最高 1080p）",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://www.bestjavporn.com",
  detailCacheDuration: 180,
  modules: [
    {
      title: "视频",
      functionName: "loadList",
      cacheDuration: 120,
      params: [
        {
          name: "path",
          title: "分类",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "首页", value: "" },
            { title: "Censored", value: "/v42/category/censored/" },
            { title: "Uncensored", value: "/v12/category/uncensored/" },
            { title: "Decensored", value: "/v25/category/decensored/" },
            { title: "Amateur", value: "/v25/category/amateur/" },
            { title: "English Subtitle", value: "/v10/category/censored/english-subtitle/" },
            { title: "Chinese Subtitle", value: "/v14/category/chinese-subtitle/" },
            { title: "Subtitle Indonesia", value: "/v2/category/subtitle-indonesia/" },
            { title: "FC2 PPV", value: "/v11/category/uncensored/fc2-ppv/" },
            { title: "1Pondo", value: "/v39/category/uncensored/1pondo/" },
            { title: "Caribbeancom", value: "/v28/category/uncensored/caribbeancom/" },
            { title: "10Musume", value: "/v50/category/uncensored/10musume/" },
            { title: "Heyzo", value: "/v54/category/uncensored/heyzo/" },
            { title: "Pacopacomama", value: "/v59/category/uncensored/pacopacomama/" },
            { title: "Tokyo Hot", value: "/v1/category/uncensored/tokyo-hot/" },
            { title: "Hitozuma", value: "/category/hitozuma/" },
            { title: "SubThai", value: "/category/subthai/" },
            { title: "Uncensored Leaked", value: "/v25/category/decensored/uncensored-leaked/" },
            { title: "MOODYZ", value: "/studio/moodyz/" },
            { title: "MADONNA", value: "/v3/studio/madonna/" },
            { title: "FC2", value: "/v56/studio/fc2/" },
            { title: "Prestige", value: "/studio/prestige/" },
            { title: "S1 NO.1 Style", value: "/v4/studio/s1-no-1-style/" },
            { title: "SOD Create", value: "/v32/studio/sod-create/" },
            { title: "Idea Pocket", value: "/studio/idea-pocket/" },
            { title: "Attackers", value: "/v1/studio/attackers/" },
            { title: "VENUS", value: "/studio/venus/" },
            { title: "Glory Quest", value: "/studio/glory-quest/" },
            { title: "Wanz Factory", value: "/studio/wanz-factory/" },
            { title: "K M Produce", value: "/studio/k-m-produce/" },
            { title: "Center Village", value: "/v1/studio/center-village/" },
            { title: "h.m.p", value: "/studio/h-m-p/" },
            { title: "Hunter", value: "/studio/hunter/" },
            { title: "Fitch", value: "/v1/studio/fitch/" },
            { title: "kawaii", value: "/v4/studio/kawaii/" },
            { title: "PREMIUM", value: "/v3/studio/premium/" },
            { title: "Faleno", value: "/studio/faleno/" },
            { title: "Planet Plus", value: "/studio/planet-plus/" },
            { title: "Alice JAPAN", value: "/studio/alice-japan/" },
            { title: "Tameike Goro", value: "/studio/tameike-goro/" },
            { title: "Das", value: "/v1/studio/das/" },
            { title: "OPPAI", value: "/studio/oppai/" },
            { title: "STAR PARADISE", value: "/studio/star-paradise/" },
            { title: "Takara Eizo", value: "/studio/takara-eizo/" },
            { title: "Natural High", value: "/v3/studio/natural-high/" },
            { title: "Ruby", value: "/v1/studio/ruby/" },
            { title: "E-BODY", value: "/v1/studio/e-body/" },
            { title: "MAXING", value: "/studio/maxing/" },
            { title: "Crystal Eizo", value: "/studio/crystal-eizo/" },
            { title: "シロウトTV", value: "/studio/shiroutotv/" },
            { title: "Big Morkal", value: "/studio/big-morkal/" },
            { title: "Hon Naka", value: "/studio/hon-naka/" },
            { title: "Max A", value: "/studio/max-a/" },
            { title: "Waap Entertainment", value: "/studio/waap-entertainment/" },
            { title: "Nagae Style", value: "/v1/studio/nagae-style/" },
            { title: "Takara Eizou", value: "/studio/takara-eizou/" },
            { title: "Media Station", value: "/studio/media-station/" },
            { title: "Hot Entertainment", value: "/v25/studio/hot-entertainment/" },
            { title: "DOC", value: "/v6/studio/doc/" },
            { title: "プレステージプレミアム(PRESTIGE PREMIUM)", value: "/studio/puresutezipuremiamu-prestige-premium/" },
            { title: "NEXT GROUP", value: "/studio/next-group/" },
            { title: "ROCKET", value: "/v15/studio/rocket/" },
            { title: "Dogma", value: "/studio/dogma/" },
            { title: "First Star", value: "/studio/first-star/" },
            { title: "Hibino", value: "/studio/hibino/" },
            { title: "Real Works", value: "/v2/studio/real-works/" },
            { title: "俺の素人", value: "/studio/an-nosu-ren/" },
            { title: "OFFICE K'S", value: "/studio/office-k-s/" },
            { title: "ラグジュTV", value: "/studio/raguziyutv/" },
            { title: "Skyu Shiroto", value: "/studio/skyu-shiroto/" },
            { title: "Ienergy", value: "/studio/ienergy/" },
            { title: "TMA", value: "/v1/studio/tma/" },
            { title: "Aurora Project ANNEX", value: "/studio/aurora-project-annex/" },
            { title: "Celeb no Tomo", value: "/studio/celeb-no-tomo/" },
            { title: "Honnaka", value: "/studio/honnaka/" },
            { title: "Nadeshiko", value: "/studio/nadeshiko/" },
            { title: "Muku", value: "/studio/muku/" },
            { title: "Dream Ticket", value: "/studio/dream-ticket/" },
            { title: "SODクリエイト", value: "/v1/studio/sodkurieito/" },
            { title: "Momotaro Eizo", value: "/studio/momotaro-eizo/" },
            { title: "ナンパTV", value: "/v1/studio/nanpatv/" },
            { title: "Caribbeancom", value: "/v28/studio/caribbeancom/" },
            { title: "GIGA", value: "/v1/studio/giga/" },
            { title: "Deep's", value: "/v1/studio/deep-s/" },
            { title: "Akinori", value: "/studio/akinori/" },
            { title: "Deeps", value: "/studio/deeps/" },
            { title: "SWITCH", value: "/v6/studio/switch/" },
            { title: "俺の素人-Z-", value: "/studio/an-nosu-ren-z/" },
            { title: "kira*kira", value: "/v1/studio/kira-kira/" },
            { title: "FA Pro", value: "/studio/fa-pro/" },
            { title: "M's Video Group", value: "/studio/m-s-video-group/" },
            { title: "AVS collector's", value: "/studio/avs-collector-s/" },
            { title: "Lahaina Tokai", value: "/studio/lahaina-tokai/" },
            { title: "DAHLIA", value: "/v1/studio/dahlia/" },
            { title: "Serebu No Tomo", value: "/studio/serebu-no-tomo/" },
            { title: "S-Cute", value: "/studio/s-cute/" },
            { title: "Sadistic Village", value: "/v4/studio/sadistic-village/" },
            { title: "HEYZO", value: "/v55/studio/heyzo/" },
            { title: "Tokyo-Hot", value: "/v1/studio/tokyo-hot/" },
            { title: "Global Media Entertainment", value: "/v1/studio/global-media-entertainment/" },
            { title: "Momotarou Eizou Shuppan", value: "/studio/momotarou-eizou-shuppan/" },
            { title: "Crystal Eizou", value: "/studio/crystal-eizou/" },
            { title: "REbecca", value: "/studio/rebecca/" },
            { title: "Chijo Heaven", value: "/studio/chijo-heaven/" },
            { title: "DANDY", value: "/v10/studio/dandy/" },
            { title: "BeFree", value: "/studio/befree/" },
            { title: "MERCURY (Mercury)", value: "/studio/mercury-mercury/" },
            { title: "Plum", value: "/studio/plum/" },
            { title: "Digital Ark", value: "/studio/digital-ark/" },
            { title: "Scoop", value: "/v1/studio/scoop/" },
            { title: "Glay'z", value: "/studio/glay-z/" },
            { title: "ABC / Mousouzoku", value: "/studio/abc-mousouzoku/" },
            { title: "Janesu", value: "/studio/janesu/" },
            { title: "10Musume", value: "/v50/studio/10musume/" },
            { title: "Cinemagic", value: "/v2/studio/cinemagic/" },
            { title: "V&R PRODUCE", value: "/studio/v-r-produce/" },
            { title: "Avs", value: "/studio/avs/" },
            { title: "NON", value: "/studio/non/" },
            { title: "Aroma Planning", value: "/studio/aroma-planning/" },
            { title: "Ei Ten", value: "/studio/ei-ten/" },
            { title: "Yama to Sora", value: "/studio/yama-to-sora/" },
            { title: "Abc/ Mousou Zoku", value: "/studio/abc-mousou-zoku/" },
            { title: "Karuma", value: "/studio/karuma/" },
            { title: "Red", value: "/studio/red/" },
            { title: "KANBi", value: "/studio/kanbi/" },
            { title: "LEO", value: "/studio/leo/" },
            { title: "BabyEntertainment", value: "/studio/babyentertainment/" },
            { title: "Radix", value: "/studio/radix/" },
            { title: "U & K", value: "/studio/u-k/" },
            { title: "Gogos", value: "/v24/studio/gogos/" },
            { title: "MARX", value: "/studio/marx/" },
            { title: "Atena Eizou", value: "/studio/atena-eizou/" },
            { title: "黒船", value: "/studio/hei-chuan/" },
            { title: "Pacopacomama", value: "/v59/studio/pacopacomama/" },
            { title: "プレステージプレミアム(PRESTIGE PREMIUM)", value: "/studio/huresutesihuremiamu-prestige-premium/" },
            { title: "Royal", value: "/studio/royal/" },
            { title: "素人ホイホイ", value: "/studio/su-ren-hoihoi/" },
            { title: "シロウトTV", value: "/studio/siroutotv/" },
            { title: "Alpha International", value: "/studio/alpha-international/" },
            { title: "Mr. Michiru", value: "/studio/mr-michiru/" },
            { title: "I.B.WORKS", value: "/studio/i-b-works/" },
            { title: "IE NERGY", value: "/studio/ie-nergy/" },
            { title: "ROOKIE", value: "/studio/rookie/" },
            { title: "Mirai Future", value: "/studio/mirai-future/" },
            { title: "KUKI", value: "/studio/kuki/" },
            { title: "Janes", value: "/studio/janes/" },
            { title: "Paradise TV", value: "/studio/paradise-tv/" },
            { title: "ナンパTV", value: "/studio/nanhatv/" },
            { title: "MARRION", value: "/studio/marrion/" },
            { title: "LUNATICS", value: "/v2/studio/lunatics/" },
            { title: "Hajime Kikaku", value: "/studio/hajime-kikaku/" },
            { title: "Go-go-zu", value: "/v7/studio/go-go-zu/" },
            { title: "Apache", value: "/studio/apache/" },
            { title: "BIGMORKAL", value: "/studio/bigmorkal/" },
            { title: "SEX Agent", value: "/studio/sex-agent/" },
            { title: "Bullitt", value: "/v29/studio/bullitt/" },
            { title: "Nanpa JAPAN", value: "/v1/studio/nanpa-japan/" },
            { title: "bibian", value: "/studio/bibian/" },
            { title: "プレステージ", value: "/studio/puresutezi/" },
            { title: "JET Eizou", value: "/studio/jet-eizou/" },
            { title: "JET Eizo", value: "/studio/jet-eizo/" },
            { title: "Hentai Shinshi Club", value: "/studio/hentai-shinshi-club/" },
            { title: "しろうとまんまん", value: "/studio/shiroutomanman/" },
            { title: "Media Bank", value: "/studio/media-bank/" },
            { title: "Audaz Japan", value: "/studio/audaz-japan/" },
            { title: "K-tribe", value: "/v1/studio/k-tribe/" },
            { title: "Spice Visual", value: "/studio/spice-visual/" },
            { title: "Bi", value: "/studio/bi/" },
            { title: "Nampa JAPAN", value: "/studio/nampa-japan/" },
            { title: "MBM", value: "/studio/mbm/" },
            { title: "プラム", value: "/studio/puramu/" },
            { title: "Pakopakodan to Yukaina Nakamatachi", value: "/studio/pakopakodan-to-yukaina-nakamatachi/" },
            { title: "H0930", value: "/studio/h0930/" },
            { title: "Unfinished", value: "/studio/unfinished/" },
            { title: "C0930", value: "/v1/studio/c0930/" },
            { title: "Hayabusa", value: "/studio/hayabusa/" },
            { title: "Baltan", value: "/studio/baltan/" },
            { title: "Dream Stage", value: "/studio/dream-stage/" },
            { title: "S Kyuu Shirouto", value: "/studio/s-kyuu-shirouto/" },
            { title: "Reddo", value: "/studio/reddo/" },
            { title: "TEPPAN", value: "/studio/teppan/" },
            { title: "プレステージ", value: "/studio/huresutesi/" },
            { title: "Toyohiko", value: "/studio/toyohiko/" },
            { title: "KSB Kikaku/Emmanuelle", value: "/studio/ksb-kikaku-emmanuelle/" },
            { title: "FA Pro . Platinum", value: "/studio/fa-pro-platinum/" },
            { title: "Sekimenjoshi", value: "/studio/sekimenjoshi/" },
            { title: "舞ワイフ", value: "/studio/wu-waihu/" },
            { title: "VIP", value: "/studio/vip/" },
            { title: "GOS", value: "/v11/studio/gos/" },
            { title: "Barutan", value: "/studio/barutan/" },
            { title: "Maza", value: "/studio/maza/" },
            { title: "Shy Kikaku", value: "/studio/shy-kikaku/" },
            { title: "Mellow Moon", value: "/studio/mellow-moon/" },
            { title: "ARA", value: "/studio/ara/" },
            { title: "Jukujo JAPAN", value: "/studio/jukujo-japan/" },
            { title: "GLAYz", value: "/studio/glayz/" },
            { title: "Golden Time", value: "/studio/golden-time/" },
            { title: "Daddy's Private Photos", value: "/studio/daddy-s-private-photos/" },
            { title: "Peters", value: "/v19/studio/peters/" },
            { title: "MERCURY", value: "/studio/mercury/" },
            { title: "素人CLOVER", value: "/studio/su-ren-clover/" },
            { title: "いんすた", value: "/studio/insuta/" },
            { title: "MILK", value: "/studio/milk/" },
            { title: "JUMP", value: "/studio/jump/" },
            { title: "NEXT", value: "/v5/studio/next/" },
            { title: "ONETIME", value: "/studio/onetime/" },
            { title: "Ke- . Toraibu", value: "/studio/ke-toraibu/" },
            { title: "Fetish Box / Mousouzoku", value: "/studio/fetish-box-mousouzoku/" },
            { title: "AFRO-FILM", value: "/studio/afro-film/" },
            { title: "H4610", value: "/studio/h4610/" },
            { title: "Geneisha", value: "/studio/geneisha/" },
            { title: "Aroma Kikaku", value: "/studio/aroma-kikaku/" },
            { title: "Kaguya Hime Pt / Mousozoku", value: "/studio/kaguya-hime-pt-mousozoku/" },
            { title: "Creampie", value: "/v23/tag/creampie/" },
            { title: "Affair", value: "/v13/tag/affair/" },
            { title: "Amateur", value: "/v25/tag/amateur/" },
            { title: "Cuckold", value: "/v6/tag/cuckold/" },
            { title: "Female College Student", value: "/v3/tag/female-college-student/" },
            { title: "First Creampie", value: "/v1/tag/first-creampie/" },
            { title: "Gal", value: "/v1/tag/gal/" },
            { title: "Gonzo", value: "/v4/tag/gonzo/" },
            { title: "Married Woman", value: "/v29/tag/married-woman/" },
            { title: "Individual Shooting", value: "/v1/tag/individual-shooting/" },
            { title: "Masturbation", value: "/v4/tag/masturbation/" },
            { title: "Model", value: "/v2/tag/model/" },
            { title: "Nampa", value: "/v13/tag/nampa/" },
            { title: "Nurse", value: "/v3/tag/nurse/" },
            { title: "Ol", value: "/v5/tag/ol/" },
            { title: "Ntr", value: "/v9/tag/ntr/" },
            { title: "Original", value: "/v4/tag/original/" },
            { title: "Slender", value: "/v1/tag/slender/" },
            { title: "Squirting", value: "/v5/tag/squirting/" },
            { title: "4HR+", value: "/v18/tag/4hr/" },
            { title: "3P, 4P", value: "/v2/tag/3p-4p/" },
            { title: "Uniform", value: "/v1/tag/uniform/" },
            { title: "30S", value: "/v2/tag/30-s/" },
            { title: "50S", value: "/v1/tag/50-s/" },
            { title: "40S", value: "/v1/tag/40-s/" },
            { title: "69", value: "/v1/tag/69/" },
            { title: "Adultery", value: "/v5/tag/adultery/" },
            { title: "Abuse", value: "/v1/tag/abuse/" },
            { title: "1080p", value: "/v3/tag/1080p/" },
            { title: "Adult Movie", value: "/v3/tag/adult-movie/" },
            { title: "Ami Kiuchi, Akina Sakura", value: "/v2/tag/ami-kiuchi-akina-sakura/" },
            { title: "Anal Play", value: "/v1/tag/anal-play/" },
            { title: "Anal", value: "/v2/tag/anal/" },
            { title: "Anal Sex", value: "/v1/tag/anal-sex/" },
            { title: "Anal Training", value: "/v1/tag/anal-training/" },
            { title: "Anna", value: "/v5/tag/anna/" },
            { title: "Anri", value: "/v4/tag/anri/" },
            { title: "aokan", value: "/v1/tag/aokan/" },
            { title: "Aozora Sex", value: "/v1/tag/aozora-sex/" },
            { title: "Av Actress", value: "/v4/tag/av-actress/" },
            { title: "AV OPEN 2015 Cougar Division", value: "/v8/tag/av-open-2015-cougar-division/" },
            { title: "Aya", value: "/v5/tag/aya/" },
            { title: "Bareback", value: "/v11/tag/bareback/" },
            { title: "Bbw", value: "/v1/tag/bbw/" },
            { title: "Beautiful Girl", value: "/v11/tag/beautiful-girl/" },
            { title: "Beautiful Tits", value: "/v2/tag/beautiful-tits/" },
            { title: "Beautiful Pussy", value: "/v1/tag/beautiful-pussy/" },
            { title: "Beauty Shop", value: "/v2/tag/beauty-shop/" },
            { title: "Big-tits", value: "/v25/tag/big-tits/" },
            { title: "Beautiful Woman", value: "/v1/tag/beautiful-woman/" },
            { title: "Best, Omnibus", value: "/v2/tag/best-omnibus/" },
            { title: "Big Asses", value: "/v1/tag/big-asses/" },
            { title: "Big Vibrator", value: "/v1/tag/big-vibrator/" },
            { title: "Big Tits Lover", value: "/v2/tag/big-tits-lover/" },
            { title: "Bikyaku", value: "/v1/tag/bikyaku/" },
            { title: "Binyuu", value: "/v1/tag/binyuu/" },
            { title: "Bishiri", value: "/v1/tag/bishiri/" },
            { title: "Black Man", value: "/v1/tag/black-man/" },
            { title: "Black Hair", value: "/v1/tag/black-hair/" },
            { title: "Blowjob", value: "/v4/tag/blowjob/" },
            { title: "bontage", value: "/v1/tag/bontage/" },
            { title: "Breasts", value: "/v4/tag/breasts/" },
            { title: "Breast Milk", value: "/v1/tag/breast-milk/" },
            { title: "Bribri", value: "/v1/tag/bribri/" },
            { title: "BUKKAKE", value: "/v2/tag/bukkake/" },
            { title: "Celebrity", value: "/v1/tag/celebrity/" },
            { title: "C Cup", value: "/v5/tag/c-cup/" },
            { title: "Censored", value: "/v42/tag/censored/" },
            { title: "Changing Room", value: "/v1/tag/changing-room/" },
            { title: "Cheating Wife", value: "/v7/tag/cheating-wife/" },
            { title: "Cherry Boy", value: "/v4/tag/cherry-boy/" },
            { title: "Chihiro Akino", value: "/v6/tag/chihiro-akino/" },
            { title: "Chijyo", value: "/v1/tag/chijyo/" },
            { title: "chikan", value: "/v1/tag/chikan/" },
            { title: "Chubby", value: "/v1/tag/chubby/" },
            { title: "Clear", value: "/v1/tag/clear/" },
            { title: "Clothed Titty Fuck", value: "/v1/tag/clothed-titty-fuck/" },
            { title: "Compilation", value: "/v9/tag/compilation/" },
            { title: "Cosplay", value: "/v2/tag/cosplay/" },
            { title: "College Girl", value: "/v3/tag/college-girl/" },
            { title: "Confinement", value: "/v2/tag/confinement/" },
            { title: "Couple", value: "/v2/tag/couple/" },
            { title: "Cowgirl", value: "/v3/tag/cowgirl/" },
            { title: "Couple Swapping", value: "/v1/tag/couple-swapping/" },
            { title: "Cross Dressing", value: "/v1/tag/cross-dressing/" },
            { title: "Cunnilingus", value: "/v3/tag/cunnilingus/" },
            { title: "Deep Throating", value: "/v1/tag/deep-throating/" },
            { title: "Dead Drunk", value: "/v1/tag/dead-drunk/" },
            { title: "Debut", value: "/v1/tag/debut/" },
            { title: "Cyoushin", value: "/v1/tag/cyoushin/" },
            { title: "Dildo", value: "/v7/tag/dildo/" },
            { title: "Dirty Talk", value: "/v1/tag/dirty-talk/" },
            { title: "Drama", value: "/v4/tag/drama/" },
            { title: "DMM Exclusive", value: "/v1/tag/dmm-exclusive/" },
            { title: "Documentary", value: "/v6/tag/documentary/" },
            { title: "Eatpussy", value: "/v1/tag/eatpussy/" },
            { title: "Exclusive", value: "/v2/tag/exclusive/" },
            { title: "Exposure", value: "/v1/tag/exposure/" },
            { title: "Extra Movie", value: "/v9/tag/extra-movie/" },
            { title: "Fairness", value: "/v1/tag/fairness/" },
            { title: "Fair Skin", value: "/v1/tag/fair-skin/" },
            { title: "Fan Appreciation/ Home Visit", value: "/v2/tag/fan-appreciation-home-visit/" },
            { title: "Featured Actress", value: "/v16/tag/featured-actress/" },
            { title: "Fc2", value: "/v56/tag/fc2/" },
            { title: "Fc2-Ppv", value: "/v11/tag/fc2-ppv/" },
            { title: "Fellatio", value: "/v1/tag/fellatio/" },
            { title: "Female Boss", value: "/v1/tag/female-boss/" },
            { title: "Female Doctor", value: "/v1/tag/female-doctor/" },
            { title: "Female Investigator", value: "/v1/tag/female-investigator/" },
            { title: "Female Teacher", value: "/v3/tag/female-teacher/" },
            { title: "Fetish", value: "/v2/tag/fetish/" },
            { title: "Fisting", value: "/v1/tag/fisting/" },
            { title: "Foot Fetish", value: "/v1/tag/foot-fetish/" },
            { title: "Fingering", value: "/v3/tag/fingering/" },
            { title: "First Time Drinking Semen", value: "/v2/tag/first-time-drinking-semen/" },
            { title: "Gansha", value: "/v1/tag/gansha/" },
            { title: "Gym Clothes", value: "/v1/tag/gym-clothes/" },
            { title: "Golden Shower", value: "/v1/tag/golden-shower/" },
            { title: "Groping", value: "/v3/tag/groping/" },
            { title: "G杯", value: "/v1/tag/gbei/" },
            { title: "Hame", value: "/v1/tag/hame/" },
            { title: "Handjob", value: "/v5/tag/handjob/" },
            { title: "H Cup", value: "/v1/tag/h-cup/" },
            { title: "hentai", value: "/v1/tag/hentai/" },
            { title: "Hi-Def", value: "/v18/tag/hi-def/" },
            { title: "Homemade", value: "/v2/tag/homemade/" },
            { title: "Himari", value: "/v2/tag/himari/" },
            { title: "Hotel", value: "/v10/tag/hotel/" },
            { title: "Huge Butt", value: "/v1/tag/huge-butt/" },
            { title: "How To", value: "/v1/tag/how-to/" },
            { title: "Hot Spring", value: "/v2/tag/hot-spring/" },
            { title: "Huge Tits", value: "/v3/tag/huge-tits/" },
            { title: "Humiliation", value: "/v5/tag/humiliation/" },
            { title: "Ingo", value: "/v1/tag/ingo/" },
            { title: "Internal Ejaculation", value: "/v1/tag/internal-ejaculation/" },
            { title: "Iramatio", value: "/v1/tag/iramatio/" },
            { title: "Kaori", value: "/v1/tag/kaori/" },
            { title: "Kawaii", value: "/v4/tag/kawaii/" },
            { title: "K Cup", value: "/v1/tag/k-cup/" },
            { title: "KIMONO", value: "/v5/tag/kimono/" },
            { title: "Kimono, Mourning", value: "/v1/tag/kimono-mourning/" },
            { title: "Kimono・Yukata", value: "/v2/tag/kimonoyukata/" },
            { title: "Kiss Kiss", value: "/v2/tag/kiss-kiss/" },
            { title: "Kosupre", value: "/v1/tag/kosupre/" },
            { title: "kusco", value: "/v1/tag/kusco/" },
            { title: "kyonyu", value: "/v2/tag/kyonyu/" },
            { title: "Lesbian Kissing", value: "/v6/tag/lesbian-kissing/" },
            { title: "Lesbian", value: "/v37/tag/lesbian/" },
            { title: "Lotion", value: "/v13/tag/lotion/" },
            { title: "M-jo", value: "/v1/tag/m-jo/" },
            { title: "Madonna", value: "/v3/tag/madonna/" },
            { title: "Maid Cosplay", value: "/v1/tag/maid-cosplay/" },
            { title: "Mask", value: "/v1/tag/mask/" },
            { title: "Massage", value: "/v6/tag/massage/" },
            { title: "Massage Parlor", value: "/v17/tag/massage-parlor/" },
            { title: "masterbation", value: "/v4/tag/masterbation/" },
            { title: "Mature Woman", value: "/v29/tag/mature-woman/" },
            { title: "MILF", value: "/v2/tag/milf/" },
            { title: "Masturbation Support", value: "/v1/tag/masturbation-support/" },
            { title: "Mother", value: "/v1/tag/mother/" },
            { title: "Nasty, Hardcore", value: "/v1/tag/nasty-hardcore/" },
            { title: "Natsuki", value: "/v6/tag/natsuki/" },
            { title: "Neat And Clean", value: "/v1/tag/neat-and-clean/" },
            { title: "Netori", value: "/v1/tag/netori/" },
            { title: "nicetitties", value: "/v3/tag/nicetitties/" },
            { title: "New Original Movie", value: "/v11/tag/new-original-movie/" },
            { title: "Nymphomaniac", value: "/v1/tag/nymphomaniac/" },
            { title: "OFFICE K’S / SOD SALE", value: "/v11/tag/office-ks-sod-sale/" },
            { title: "Office Lady", value: "/v17/tag/office-lady/" },
            { title: "Ona Support", value: "/v1/tag/ona-support/" },
            { title: "Older Sister", value: "/v7/tag/older-sister/" },
            { title: "Orgasm", value: "/v1/tag/orgasm/" },
            { title: "Orgy", value: "/v3/tag/orgy/" },
            { title: "Outdoors", value: "/v1/tag/outdoors/" },
            { title: "Over 4 Hours", value: "/v21/tag/over-4-hours/" },
            { title: "Other Fetish", value: "/v1/tag/other-fetish/" },
            { title: "Other Fetishes", value: "/v2/tag/other-fetishes/" },
            { title: "Outdoor", value: "/v1/tag/outdoor/" },
            { title: "Peach Butt", value: "/v1/tag/peach-butt/" },
            { title: "Pajamas", value: "/v1/tag/pajamas/" },
            { title: "Panty Shot", value: "/v1/tag/panty-shot/" },
            { title: "Panty Shots", value: "/v2/tag/panty-shots/" },
            { title: "Personal Photoshoot", value: "/v1/tag/personal-photoshoot/" },
            { title: "Picking Up Girls", value: "/v23/tag/picking-up-girls/" },
            { title: "Pissing・Incontinence", value: "/v2/tag/pissingincontinence/" },
            { title: "Petite", value: "/v1/tag/petite/" },
            { title: "Planning", value: "/v8/tag/planning/" },
            { title: "Prank", value: "/v1/tag/prank/" },
            { title: "Porn Star", value: "/v1/tag/porn-star/" },
            { title: "Premium", value: "/v3/tag/premium/" },
            { title: "POV", value: "/v5/tag/pov/" },
            { title: "Pranks", value: "/v4/tag/pranks/" },
            { title: "Promiscuity", value: "/v6/tag/promiscuity/" },
            { title: "Rankou", value: "/v1/tag/rankou/" },
            { title: "Raw Saddle", value: "/v1/tag/raw-saddle/" },
            { title: "Quickie", value: "/v1/tag/quickie/" },
            { title: "Reversed Role", value: "/v4/tag/reversed-role/" },
            { title: "Red Hot Fetish Collection", value: "/v22/tag/red-hot-fetish-collection/" },
            { title: "Rental Girlfriend", value: "/v2/tag/rental-girlfriend/" },
            { title: "Relatives", value: "/v1/tag/relatives/" },
            { title: "Reverse Pick-Up", value: "/v1/tag/reverse-pick-up/" },
            { title: "Rocket", value: "/v15/tag/rocket/" },
            { title: "Runa", value: "/v1/tag/runa/" },
            { title: "Rolling Back Eyes / Fainting", value: "/v1/tag/rolling-back-eyes-fainting/" },
            { title: "Rough Sex", value: "/v1/tag/rough-sex/" },
            { title: "S-Cute / Prestige / Gogos SALE", value: "/v4/tag/s-cute-prestige-gogos-sale/" },
            { title: "Sale (limited time)", value: "/v1/tag/sale-limited-time/" },
            { title: "School Girls", value: "/v1/tag/school-girls/" },
            { title: "Schoolgirl", value: "/v11/tag/schoolgirl/" },
            { title: "Sauna", value: "/v2/tag/sauna/" },
            { title: "Secretary", value: "/v1/tag/secretary/" },
            { title: "School Uniform", value: "/v5/tag/school-uniform/" },
            { title: "Series", value: "/v4/tag/series/" },
            { title: "Sex Toys", value: "/v4/tag/sex-toys/" },
            { title: "Sexy Legs", value: "/v1/tag/sexy-legs/" },
            { title: "Shaved Pussy", value: "/v2/tag/shaved-pussy/" },
            { title: "Shame", value: "/v1/tag/shame/" },
            { title: "Shemale", value: "/v1/tag/shemale/" },
            { title: "She", value: "/v6/tag/she/" },
            { title: "Shiofuki", value: "/v1/tag/shiofuki/" },
            { title: "Sister", value: "/v8/tag/sister/" },
            { title: "Sixtynine", value: "/v1/tag/sixtynine/" },
            { title: "Small Tits", value: "/v4/tag/small-tits/" },
            { title: "Slut", value: "/v10/tag/slut/" },
            { title: "Solowork", value: "/v8/tag/solowork/" },
            { title: "Sperm Donation", value: "/v1/tag/sperm-donation/" },
            { title: "sokkuri", value: "/v1/tag/sokkuri/" },
            { title: "Special Smartphone Vertical Video", value: "/v1/tag/special-smartphone-vertical-video/" },
            { title: "Sport", value: "/v1/tag/sport/" },
            { title: "Sports", value: "/v1/tag/sports/" },
            { title: "Submissive Men", value: "/v2/tag/submissive-men/" },
            { title: "Stepmom", value: "/v1/tag/stepmom/" },
            { title: "Strong Sexual Desire", value: "/v1/tag/strong-sexual-desire/" },
            { title: "Stewardess", value: "/v1/tag/stewardess/" },
            { title: "Substance Use", value: "/v1/tag/substance-use/" },
            { title: "Subtitles", value: "/v10/tag/subtitles/" },
            { title: "Swallow", value: "/v1/tag/swallow/" },
            { title: "Threesome / Foursome", value: "/v3/tag/threesome-foursome/" },
            { title: "Titty Fuck", value: "/v5/tag/titty-fuck/" },
            { title: "Tittyfuck", value: "/v1/tag/tittyfuck/" },
            { title: "Too Wet", value: "/v2/tag/too-wet/" },
            { title: "Training", value: "/v1/tag/training/" },
            { title: "Toys", value: "/v1/tag/toys/" },
            { title: "Transformed Heroine", value: "/v1/tag/transformed-heroine/" },
            { title: "Transsexual", value: "/v4/tag/transsexual/" },
            { title: "Trip", value: "/v9/tag/trip/" },
            { title: "Two Consecutive Creampies", value: "/v3/tag/two-consecutive-creampies/" },
            { title: "Tutor", value: "/v1/tag/tutor/" },
            { title: "Ultra-Huge Tits", value: "/v2/tag/ultra-huge-tits/" },
            { title: "Uncensored", value: "/v12/tag/uncensored/" },
            { title: "Underwear", value: "/v1/tag/underwear/" },
            { title: "User Submission", value: "/v1/tag/user-submission/" },
            { title: "Urination", value: "/v1/tag/urination/" },
            { title: "Various Worker", value: "/v5/tag/various-worker/" },
            { title: "Variety", value: "/v25/tag/variety/" },
            { title: "Vibe", value: "/v1/tag/vibe/" },
            { title: "Vibrator", value: "/v5/tag/vibrator/" },
            { title: "Virgin Man", value: "/v5/tag/virgin-man/" },
            { title: "Voyeur", value: "/v14/tag/voyeur/" },
            { title: "Yokui", value: "/v1/tag/yokui/" },
            { title: "Youthful", value: "/v2/tag/youthful/" },
            { title: "Yukata", value: "/v1/tag/yukata/" },
            { title: "フルハイビジョン(FHD)", value: "/v1/tag/huruhaibiziyon-fhd/" },
            { title: "五十路", value: "/v1/tag/wu-shi-lu/" },
            { title: "配信専用素人", value: "/v2/tag/pei-xin-zhuan-yong-su-ren/" }
          ]
        },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "搜索",
      functionName: "search",
      params: [
        { name: "keyword", title: "关键词", type: "input" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "loadResource",
      title: "BestJavPorn播放源",
      description: "点播时整链重铸（令牌时效+IP 绑定要求），按所选线路出流",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 0,
      params: []
    }
  ],
  search: {
    title: "搜索",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

var HOST = "https://www.bestjavporn.com";
var REFERER = HOST + "/";
var OWN = "https://pornfhd-fetch.li768435813.workers.dev";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
var TOK = "bjp";

function t(v) { return String(v == null ? "" : v).trim(); }

function clean(s) {
  return t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ");
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  return HOST + (u.charAt(0) === "/" ? u : "/" + u);
}

// App 入参可能是字符串、卡片对象或 JSON 串; 统一解出链接字符串。
function unwrapLink(input) {
  var v = input;
  for (var i = 0; i < 3; i++) {
    if (v == null) return "";
    if (typeof v === "string") {
      var s = v.trim();
      if (s.charAt(0) === "{") {
        try { v = JSON.parse(s); continue; } catch (e) { return s; }
      }
      return s;
    }
    if (typeof v === "object") {
      v = v.link || v.id || v.url || v.href || "";
      continue;
    }
    return String(v);
  }
  return "";
}

// 分类显示名: 直接查 WidgetMetadata 的 enumOptions (全表只存一份)。
function catNameOf(tid) {
  try {
    var opts = WidgetMetadata.modules[0].params[0].enumOptions;
    for (var i = 0; i < opts.length; i++) { if (opts[i].value === tid) return opts[i].title; }
  } catch (e) {}
  return tid || "首页";
}

// ---------- 传输层 (只走 Widget.http; 永不抛错) ----------
function lowerHeaders(h) {
  var out = {};
  if (!h) return out;
  try {
    if (typeof h.forEach === "function") {
      h.forEach(function (v, k) { out[String(k).toLowerCase()] = String(v); });
      return out;
    }
    for (var k in h) { if (Object.prototype.hasOwnProperty.call(h, k)) out[String(k).toLowerCase()] = String(h[k]); }
  } catch (e) {}
  return out;
}

// 纯 JS UTF-8 解码 (沙箱无 TextDecoder)。
function utf8DecodeBytes(bytes) {
  var out = "";
  var i = 0;
  var n = bytes.length;
  while (i < n) {
    var c = bytes[i];
    if (c < 0x80) { out += String.fromCharCode(c); i++; continue; }
    var extra = 0, code = 0;
    if ((c & 0xE0) === 0xC0) { extra = 1; code = c & 0x1F; }
    else if ((c & 0xF0) === 0xE0) { extra = 2; code = c & 0x0F; }
    else if ((c & 0xF8) === 0xF0) { extra = 3; code = c & 0x07; }
    else { out += "�"; i++; continue; }
    var ok = true;
    for (var j = 1; j <= extra; j++) {
      if (i + j >= n || (bytes[i + j] & 0xC0) !== 0x80) { ok = false; break; }
      code = (code << 6) | (bytes[i + j] & 0x3F);
    }
    if (!ok) { out += "�"; i++; continue; }
    i += extra + 1;
    if (code < 0x10000) { out += String.fromCharCode(code); }
    else {
      code -= 0x10000;
      out += String.fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 0x3FF));
    }
  }
  return out;
}

// 响应体归一成文本: string 直用; 已解析 object -> JSON 串; 字节形态
// -> UTF-8 解码 (标签判型, 不用 instanceof 以免跨 realm 假阴性)。
function decodeData(d) {
  if (d == null) return "";
  if (typeof d === "string") return d;
  if (typeof d === "number" || typeof d === "boolean") return String(d);
  try {
    var tag = Object.prototype.toString.call(d);
    if (tag === "[object ArrayBuffer]") return utf8DecodeBytes(new Uint8Array(d));
    if (/^\[object (Uint8|Int8|Uint8Clamped|Int16|Uint16|Int32|Uint32|Float32|Float64|DataView)/.test(tag) ||
        (d && typeof d.byteLength === "number" && d.buffer && Object.prototype.toString.call(d.buffer) === "[object ArrayBuffer]")) {
      return utf8DecodeBytes(new Uint8Array(d.buffer, d.byteOffset || 0, d.byteLength));
    }
    if (typeof d === "object") return JSON.stringify(d) || "";
  } catch (e) {}
  return "";
}

function statusOf(res, text) {
  if (!res || typeof res !== "object") return text ? 200 : 0;
  if (typeof res.status === "number") return res.status;
  if (typeof res.statusCode === "number") return res.statusCode;
  if (typeof res.code === "number") return res.code;
  return text ? 200 : 0;
}

function errStatus(e) {
  if (!e) return 0;
  if (typeof e.status === "number") return e.status;
  if (typeof e.statusCode === "number") return e.statusCode;
  if (e.response && typeof e.response.status === "number") return e.response.status;
  if (e.response && typeof e.response.statusCode === "number") return e.response.statusCode;
  return 0;
}

async function httpRaw(url, headers, timeoutMs) {
  try {
    var opts = { headers: headers || { "User-Agent": UA } };
    if (timeoutMs) opts.timeout = timeoutMs;
    var res = await Widget.http.get(url, opts);
    if (!res) return { status: 0, headers: {}, text: "", error: "empty response" };
    if (typeof res === "string") return { status: 200, headers: {}, text: res };
    var rawData = res.data != null ? res.data : (res.body != null ? res.body : "");
    var text = decodeData(rawData);
    return { status: statusOf(res, text), headers: lowerHeaders(res.headers), text: text || "" };
  } catch (e) {
    var body = "";
    if (e && e.response) body = decodeData(e.response.data != null ? e.response.data : e.response.body);
    return { status: errStatus(e), headers: {}, text: body, error: String((e && e.message) || e) };
  }
}

async function httpPostRaw(url, body, headers, timeoutMs) {
  try {
    if (!Widget.http || typeof Widget.http.post !== "function") return { status: 0, headers: {}, text: "", error: "no http.post" };
    var opts = { headers: headers || {}, timeout: timeoutMs || 15000 };
    var res = await Widget.http.post(url, body, opts);
    if (!res) return { status: 0, headers: {}, text: "", error: "empty response" };
    if (typeof res === "string") return { status: 200, headers: {}, text: res };
    var rawData = res.data != null ? res.data : (res.body != null ? res.body : "");
    var text = decodeData(rawData);
    return { status: statusOf(res, text), headers: lowerHeaders(res.headers), text: text || "" };
  } catch (e) {
    var body2 = "";
    if (e && e.response) body2 = decodeData(e.response.data != null ? e.response.data : e.response.body);
    return { status: errStatus(e), headers: {}, text: body2, error: String((e && e.message) || e) };
  }
}

function pageHeaders(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.7",
    "Referer": referer || REFERER
  };
}

// ---------- 页面归一与校验 (与蜘蛛同口径) ----------
function normalizePageText(s) {
  if (typeof s !== "string" || !s) return s || "";
  if (s.indexOf('\\"') < 0) return s;
  if (s.indexOf("thumb-block") >= 0 || s.indexOf('property="og:') >= 0 || s.indexOf("data-mpu") >= 0) return s;
  return s.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\//g, "/")
    .replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\r/g, "")
    .replace(/\\u([0-9a-fA-F]{4})/g, function (m, h) { return String.fromCharCode(parseInt(h, 16)); });
}

function isShellPage(s) {
  return /Attention Required|Just a moment|cf-challenge|Checking your browser/i.test(s || "");
}

function validDetailPage(html) {
  return !!html && !isShellPage(html) && html.length > 4000 &&
    (/property="og:(title|image)"/.test(html) || html.indexOf("data-mpu") >= 0);
}

// ---------- 列表解析 (严格层 + 宽松层, 与蜘蛛同口径) ----------
function cardPic(u) {
  return u ? u.replace("pics.pornfhd.com/s/", "pics.pornfhd.com/") : "";
}

function parseCardsStrict(html) {
  var out = [];
  var re = /<article[^>]*class="[^"]*thumb-block[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
  var m;
  var s = String(html || "");
  while ((m = re.exec(s)) !== null) {
    if (/thumb-block-native-ad|native-banner/.test(m[0])) continue;
    var block = m[1];
    var a = block.match(/<a href="(https:\/\/(?:www\.)?bestjavporn\.com\/(?:v\d+\/)?video\/[^"]+)" title="([^"]*)"/);
    if (!a) continue;
    var img = block.match(/data-lazy-src="([^"]+)"/) || block.match(/data-wpsrc="([^"]+)"/);
    var dur = block.match(/<span class="duration">[\s\S]*?([\d]{1,2}:[\d]{2}(?::[\d]{2})?)\s*<\/span>/);
    var views = block.match(/<span class="views">[\s\S]*?([\d,]+)\s*<\/span>/);
    var remarks = [dur ? dur[1] : "", views ? views[1] + " views" : ""].filter(Boolean).join(" · ");
    out.push({ vod_id: a[1], vod_name: clean(a[2]), vod_pic: img ? cardPic(img[1]) : "", vod_remarks: remarks });
  }
  return out;
}

function parseCardsLoose(html) {
  var out = [];
  var seen = {};
  var h = String(html || "");
  var re = /<a\b[^>]*?href\s*=\s*["']((?:https?:\/\/(?:www\.)?bestjavporn\.com)?\/(?:v\d+\/)?video\/[^"']+)["'][^>]*>/gi;
  var m;
  while ((m = re.exec(h)) !== null) {
    var url = m[1];
    if (url.indexOf("/") === 0) url = HOST + url;
    url = url.replace(/^http:\/\//, "https://");
    if (seen[url]) continue;
    seen[url] = 1;
    var tag = m[0];
    var win = h.slice(m.index, m.index + 1800);
    var name = "";
    var tm = tag.match(/title\s*=\s*"([^"]+)"/) || tag.match(/title\s*=\s*'([^']+)'/);
    if (tm) name = clean(tm[1]);
    if (!name) {
      var altM = win.match(/<img[^>]+alt="([^"]{4,})"/);
      if (altM) name = clean(altM[1]);
    }
    if (!name) {
      var txtM = win.match(/<header class="entry-header">\s*<span>([^<]{4,})<\/span>/);
      if (txtM) name = clean(txtM[1]);
    }
    if (!name) name = url.split("/video/")[1].replace(/\//g, "");
    var img = win.match(/data-lazy-src="(https:[^"]+)"/) || win.match(/data-wpsrc="(https:[^"]+)"/);
    var dur = win.match(/<span class="duration">[\s\S]*?([\d]{1,2}:[\d]{2}(?::[\d]{2})?)\s*<\/span>/);
    var views = win.match(/<span class="views">[\s\S]*?([\d,]+)\s*<\/span>/);
    var remarks = [dur ? dur[1] : "", views ? views[1] + " views" : ""].filter(Boolean).join(" · ");
    out.push({ vod_id: url, vod_name: name, vod_pic: img ? cardPic(img[1]) : "", vod_remarks: remarks });
  }
  return out;
}

function parseCards(html) {
  var strict = parseCardsStrict(html);
  var byUrl = {};
  var out = [];
  var i;
  for (i = 0; i < strict.length; i++) { byUrl[strict[i].vod_id] = 1; out.push(strict[i]); }
  var loose = parseCardsLoose(html);
  for (i = 0; i < loose.length; i++) {
    if (!byUrl[loose[i].vod_id]) { byUrl[loose[i].vod_id] = 1; out.push(loose[i]); }
  }
  return out;
}

function og(html, prop) {
  var h = String(html || "");
  var m = h.match(new RegExp('<meta[^>]+property="og:' + prop + '"[^>]+content="([^"]*)"'));
  if (!m) m = h.match(new RegExp('<meta[^>]+content="([^"]*)"[^>]+property="og:' + prop + '"'));
  return m ? clean(m[1]) : "";
}

// ---------- 取页: 三通道串行兜底 (own /get -> jina -> 直连) ----------
var lastFetchReport = "";
var lastWinChannel = "";

async function fetchPage(url, kind) {
  var notes = [];
  var channels = [
    { name: "own", timeout: 15000, build: function (u) { return OWN + "/get?u=" + encodeURIComponent(u) + "&ref=" + encodeURIComponent(REFERER); }, headers: function () { return { "User-Agent": UA }; } },
    { name: "jina", timeout: 20000, build: function (u) { return "https://r.jina.ai/" + u; }, headers: function () { return { "User-Agent": UA, "x-respond-with": "html" }; } },
    { name: "direct", timeout: 12000, build: function (u) { return u; }, headers: function () { return pageHeaders(REFERER); } }
  ];
  for (var ci = 0; ci < channels.length; ci++) {
    var ch = channels[ci];
    var r = await httpRaw(ch.build(url), ch.headers(), ch.timeout);
    var txt = normalizePageText(r.text || "");
    var ok = false;
    if (txt && !isShellPage(txt)) {
      ok = kind === "detail" ? validDetailPage(txt) : parseCards(txt).length > 0;
    }
    if (ok) {
      lastWinChannel = ch.name;
      lastFetchReport = ch.name + " 取页成功（" + txt.length + "B）";
      return txt;
    }
    notes.push(ch.name + ":" + (r.status ? ("状态" + r.status) : ("无响应/" + String(r.error || "").slice(0, 30))) + (txt ? ("/" + txt.length + "B未过校验") : ""));
  }
  lastWinChannel = "";
  lastFetchReport = notes.join("；");
  return "";
}

// tid = 站方规范路径 (/v42/category/censored/ 形态, 或 /studio/xxx/)
function listUrl(tid, page) {
  if (!tid) return page > 1 ? HOST + "/page/" + page + "/" : HOST + "/";
  var path = tid.charAt(0) === "/" ? tid : "/" + tid;
  return HOST + path + (page > 1 ? "page/" + page + "/" : "");
}

function searchUrl(kw, page) {
  return HOST + "/search/" + encodeURIComponent(kw) + "/" + (page > 1 ? "page/" + page + "/" : "");
}

function toCards(list) {
  return (list || []).map(function (v) {
    var pic = v.vod_pic || "";
    return {
      id: v.vod_id,
      type: "url",
      title: v.vod_name,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      link: v.vod_id,
      description: v.vod_remarks || "",
      mediaType: "movie"
    };
  });
}

function diagCard(title, desc) {
  return [{
    id: TOK + "-diag-" + Date.now(),
    type: "url",
    title: title,
    posterPath: "",
    coverUrl: "",
    backdropPath: "",
    link: HOST + "/",
    mediaType: "movie",
    description: desc || ""
  }];
}

// ---------- 纯 JS 密码件 (与站方 cast.js / video main.js 同构) ----------
var B64CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var B64REV = {};
for (var _bi = 0; _bi < 64; _bi++) B64REV[B64CH[_bi]] = _bi;
B64REV["-"] = 62; B64REV["_"] = 63;

function b64ToBytes(s) {
  var str = String(s || "").replace(/[^A-Za-z0-9+/=_-]/g, "");
  var out = [];
  var acc = 0, bits = 0;
  for (var i = 0; i < str.length; i++) {
    var ch = str.charAt(i);
    if (ch === "=") break;
    var v = B64REV[ch];
    if (v == null) continue;
    acc = (acc << 6) | v; bits += 6;
    if (bits >= 8) { bits -= 8; out.push((acc >> bits) & 0xff); }
  }
  return Uint8Array.from(out);
}

function bytesToB64(bytes) {
  var s = "";
  for (var i = 0; i < bytes.length; i += 3) {
    var a = bytes[i], b = i + 1 < bytes.length ? bytes[i + 1] : 0, c = i + 2 < bytes.length ? bytes[i + 2] : 0;
    s += B64CH[a >> 2] + B64CH[((a & 3) << 4) | (b >> 4)] +
      (i + 1 < bytes.length ? B64CH[((b & 15) << 2) | (c >> 6)] : "=") +
      (i + 2 < bytes.length ? B64CH[c & 63] : "=");
  }
  return s;
}

// 纯 JS UTF-8 编码 (沙箱无 TextEncoder; 等价于蜘蛛的 TextEncoder 版)。
function utf8EncodeBytes(str) {
  var out = [];
  var s = String(str || "");
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    if (c < 0x80) { out.push(c); continue; }
    if (c < 0x800) { out.push(0xC0 | (c >> 6), 0x80 | (c & 0x3F)); continue; }
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < s.length) {
      var c2 = s.charCodeAt(i + 1);
      if (c2 >= 0xDC00 && c2 <= 0xDFFF) {
        var cp = 0x10000 + ((c & 0x3FF) << 10) + (c2 & 0x3FF);
        out.push(0xF0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3F), 0x80 | ((cp >> 6) & 0x3F), 0x80 | (cp & 0x3F));
        i++;
        continue;
      }
    }
    out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 0x3F), 0x80 | (c & 0x3F));
  }
  return Uint8Array.from(out);
}

function strToB64(str) { return bytesToB64(utf8EncodeBytes(str)); }

function bytesToLatin1(bytes) {
  var s = "";
  for (var i = 0; i < bytes.length; i += 8192) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
  }
  return s;
}

function bytesToUtf8(bytes) { return utf8DecodeBytes(bytes); }

function rc4(keyStr, data) {
  var S = new Uint8Array(256);
  var i, j = 0, tmp;
  for (i = 0; i < 256; i++) S[i] = i;
  var kb = [];
  for (i = 0; i < keyStr.length; i++) kb.push(keyStr.charCodeAt(i) & 0xff);
  for (i = 0; i < 256; i++) {
    j = (j + S[i] + kb[i % kb.length]) & 0xff;
    tmp = S[i]; S[i] = S[j]; S[j] = tmp;
  }
  var a = 0;
  j = 0;
  var out = new Uint8Array(data.length);
  for (var n = 0; n < data.length; n++) {
    a = (a + 1) & 0xff;
    j = (j + S[a]) & 0xff;
    tmp = S[a]; S[a] = S[j]; S[j] = tmp;
    out[n] = data[n] ^ S[(S[a] + S[j]) & 0xff];
  }
  return out;
}

// dex(seed, data) = b64decode( RC4( reverse(b64(seed + '_0x58fe15')), b64decode(data) ) )
var SALT_MAIN = "_0x58fe15";
function dexMain(seed, data) {
  var key = strToB64(String(seed) + SALT_MAIN).split("").reverse().join("");
  var mid = bytesToLatin1(rc4(key, b64ToBytes(data)));
  return bytesToLatin1(b64ToBytes(mid));
}
function dexMainUtf8(seed, data) {
  var key = strToB64(String(seed) + SALT_MAIN).split("").reverse().join("");
  var mid = bytesToLatin1(rc4(key, b64ToBytes(data)));
  return bytesToUtf8(b64ToBytes(mid));
}

// embed 页 data-config 解密: key = reverse( b64( b64(pathname+search).substr(4,20) + '_0x59a0e4' ) )
function decryptConfig(cfgB64, pathname, search) {
  var arg = strToB64(String(pathname) + String(search)).substring(4, 20);
  var key = strToB64(arg + "_0x59a0e4").split("").reverse().join("");
  var pt = bytesToLatin1(rc4(key, b64ToBytes(cfgB64)));
  var json = JSON.parse(bytesToUtf8(b64ToBytes(pt)));
  var sources = JSON.parse(bytesToUtf8(b64ToBytes(json.src || "")));
  return { json: json, sources: sources };
}

function splitUrl(u) {
  var m = String(u || "").match(/^(?:https?:)?\/\/[^/?#]+(\/[^?#]*)?(?:\?([^#]*))?/);
  if (!m) return { pathname: "/", search: "" };
  return { pathname: m[1] || "/", search: m[2] ? "?" + m[2] : "" };
}

function hostOf(u) {
  var m = String(u || "").match(/^(?:https?:)?\/\/([^/?#]+)/);
  return m ? m[1].replace(/^www\./, "") : "";
}

// 相对地址解析 (代替沙箱未必有的 URL 构造器)。
function resolveUrl(base, rel) {
  rel = t(rel);
  if (!rel) return "";
  if (/^https?:\/\//i.test(rel)) return rel;
  var bm = String(base || "").match(/^(https?:\/\/[^/?#]+)(\/[^?#]*)?/);
  if (!bm) return rel;
  var origin = bm[1];
  var bpath = bm[2] || "/";
  if (rel.indexOf("//") === 0) return "https:" + rel;
  if (rel.charAt(0) === "/") return origin + rel;
  var dir = bpath.slice(0, bpath.lastIndexOf("/") + 1);
  var parts = (dir + rel).split("/");
  var out = [];
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i];
    if (p === ".") continue;
    if (p === "..") { if (out.length > 1) out.pop(); continue; }
    out.push(p);
  }
  return origin + out.join("/");
}

// ---------- 播放解析 ----------
function extractPlaySeed(html) {
  var s = String(html || "");
  var postId = (s.match(/id="video-player-area"[^>]*video-id="(\d+)"/) || s.match(/video-id="(\d+)"/) || [])[1] || "";
  var mpu = (s.match(/data-mpu="([^"]+)"/) || [])[1] || "";
  var ver = (s.match(/data-ver="([^"]+)"/) || [])[1] || "2";
  return { postId: postId, mpu: mpu, ver: ver };
}

function validPlayResp(text) {
  if (!text) return false;
  try {
    var j = JSON.parse(text);
    return !!j && typeof j === "object" && j.status === true;
  } catch (e) { return false; }
}

// 铸造库查询: 命中回 {hit:true, paths:[{lo,path}]}; 其余一律未命中。
async function castBankLookup(watchUrl) {
  try {
    var w = OWN + "/cast?u=" + encodeURIComponent(watchUrl);
    var r = await httpRaw(w, { "User-Agent": UA }, 6000);
    if (!r || r.status !== 200 || !r.text) return { hit: false };
    var j;
    try { j = JSON.parse(r.text); } catch (e) { return { hit: false }; }
    var seen = {};
    var arr = [];
    if (j && Array.isArray(j.paths)) {
      for (var i = 0; i < j.paths.length; i++) {
        var p = j.paths[i];
        if (typeof p !== "string" || p.indexOf("//") !== 0 || seen[p]) continue;
        seen[p] = 1;
        arr.push(p);
      }
    }
    if (!arr.length) return { hit: false };
    return { hit: true, paths: arr.map(function (p, i) { return { lo: i === 0 ? "main" : "bak", path: p }; }) };
  } catch (e) {
    return { hit: false };
  }
}

// POST /api/play/ 两路串行: 经 Worker /post -> Widget.http 直连 POST。
async function postPlay(url, bodyStr, referer) {
  var formHeaders = {
    "User-Agent": UA,
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.7",
    "Content-Type": "application/x-www-form-urlencoded",
    "Referer": referer,
    "Origin": HOST
  };
  var notes = [];
  var sawJson = false;
  var attempts = [
    { name: "own-post", run: function () {
        var w = OWN + "/post?u=" + encodeURIComponent(url) + "&ref=" + encodeURIComponent(referer);
        return httpPostRaw(w, bodyStr, { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded" }, 12000);
      } },
    { name: "direct-post", run: function () { return httpPostRaw(url, bodyStr, formHeaders, 12000); } }
  ];
  for (var i = 0; i < attempts.length; i++) {
    var a = attempts[i];
    var r = await a.run();
    var text = r.text || "";
    if (text) {
      try { var jj = JSON.parse(text); if (jj && typeof jj === "object" && "status" in jj) sawJson = true; } catch (e) {}
    }
    notes.push(a.name + (r.status ? r.status : "ERR"));
    if (validPlayResp(text)) return { text: text, via: a.name, diag: notes.join(" "), sawJson: true };
  }
  return { text: "", via: "", diag: notes.join(" "), sawJson: sawJson };
}

// 铸造全程: 库优先 -> 现铸 (主盐, ver=2; 与蜘蛛 fetchEmbedPaths 同法)。
async function fetchEmbedPaths(postId, mpu, ver, referer) {
  var bank = await castBankLookup(referer);
  if (bank.hit) return { paths: bank.paths, stage: "ok", via: "cast-bank", postDiag: "", bank: "hit" };
  var token = dexMain(postId, mpu);
  var body = "sources=" + encodeURIComponent(token) + "&ver=" + encodeURIComponent(ver || "2");
  var r = await postPlay(HOST + "/api/play/", body, referer);
  if (!r.text) return { paths: [], stage: r.sawJson ? "post-bad" : "post-none", via: "", postDiag: r.diag || "", bank: "miss" };
  var resp;
  try { resp = JSON.parse(r.text); } catch (e) { return { paths: [], stage: "post-bad", via: r.via, postDiag: r.diag || "", bank: "miss" }; }
  if (!resp || resp.status !== true || !resp.data) return { paths: [], stage: "post-bad", via: r.via, postDiag: r.diag || "", bank: "miss" };
  var paths = [];
  try { paths.push({ lo: t(resp.lo) || "main", path: dexMain(postId, resp.data) }); } catch (e) {}
  if (resp.reserve) {
    try {
      var arr = JSON.parse(dexMainUtf8(postId, resp.reserve));
      for (var i = 0; i < arr.length; i++) {
        var x = arr[i];
        if (x && x.data) {
          try { paths.push({ lo: t(x.lo) || "bak", path: dexMain(postId, x.data) }); } catch (e) {}
        }
      }
    } catch (e) {}
  }
  var okPaths = [];
  for (var k = 0; k < paths.length; k++) {
    if (paths[k].path && paths[k].path.indexOf("//") === 0) okPaths.push(paths[k]);
  }
  return { paths: okPaths, stage: "ok", via: r.via, postDiag: r.diag || "", bank: "miss" };
}

// ---------- embed 解包 + 清晰度展开 ----------
var HOST_PRETTY = [
  [/streamtape|tapecontent/i, "StreamTape"],
  [/maxstream/i, "MaxStream"],
  [/cloudatacdn|clouddata/i, "CloudCDN"],
  [/streamhls/i, "StreamHLS"],
  [/pianopic/i, "PianoPic"],
  [/acek-cdn/i, "AcekCDN"],
  [/hugstream/i, "HugStream"],
  [/turbovid|turbo/i, "TurboVid"],
  [/dood|ds2play|d0o0d/i, "Dood"],
  [/filemoon|filemoonu/i, "FileMoon"],
  [/vidhide|earnvid|vidhideplus/i, "VidHide"],
  [/streamwish|wish/i, "StreamWish"],
  [/voe/i, "VOE"]
];
function prettyHost(fileUrl) {
  for (var i = 0; i < HOST_PRETTY.length; i++) { if (HOST_PRETTY[i][0].test(fileUrl)) return HOST_PRETTY[i][1]; }
  var h = hostOf(fileUrl);
  return h || "线路";
}
function hostRank(name) {
  if (name === "CloudCDN") return 0;
  if (name === "MaxStream") return 1;
  if (name === "StreamTape") return 2;
  if (name === "AcekCDN") return 3;
  if (name === "StreamHLS" || name === "PianoPic") return 9;
  return 5;
}
function displayHost(file, embedUrl) {
  var h = prettyHost(file);
  if (hostOf(file) === h) {
    var eh = prettyHost(embedUrl);
    if (eh && eh !== h) return eh;
  }
  return h;
}

// embed 取页: 直连 (设备出口) 优先; 无 data-config 时经 Worker /get
// 兜底一击 (仅站内域 embed 在 Worker 白名单内, 外域自动落空)。
async function fetchEmbedPage(embedUrl, referer) {
  var r = await httpRaw(embedUrl, pageHeaders(referer), 10000);
  var txt = normalizePageText(r.text || "");
  if (txt && txt.indexOf('data-config="') >= 0) return { html: txt, direct: true };
  var w = OWN + "/get?u=" + encodeURIComponent(embedUrl) + "&ref=" + encodeURIComponent(referer || REFERER);
  var r2 = await httpRaw(w, { "User-Agent": UA }, 12000);
  var txt2 = normalizePageText(r2.text || "");
  if (txt2 && txt2.indexOf('data-config="') >= 0) return { html: txt2, direct: false };
  return { html: "", direct: false };
}

async function resolveEmbed(embedUrl, referer) {
  var r = await fetchEmbedPage(embedUrl, referer);
  if (!r.html) return null;
  var cfg = (r.html.match(/data-config="([^"]+)"/) || [])[1];
  if (!cfg) return null;
  var parts = splitUrl(embedUrl);
  try {
    var dec = decryptConfig(cfg, parts.pathname, parts.search);
    if (dec && Array.isArray(dec.sources) && dec.sources.length) {
      return { sources: dec.sources, direct: !!r.direct };
    }
  } catch (e) {}
  return null;
}

function labelRes(label) {
  var m = t(label).match(/(\d{3,4})\s*p/i);
  return m ? parseInt(m[1], 10) : 0;
}

function parseVariants(body, base) {
  var out = [];
  var lines = String(body || "").split("\n");
  for (var i = 0; i < lines.length; i++) {
    var m = lines[i].match(/#EXT-X-STREAM-INF:([^\r\n]*)/);
    if (!m) continue;
    var bw = parseInt((m[1].match(/BANDWIDTH=(\d+)/) || [])[1] || "0", 10);
    var rm = m[1].match(/RESOLUTION=(\d+)x(\d+)/);
    var q = rm ? parseInt(rm[2], 10) : 0;
    if (!q && bw) q = bw >= 2500000 ? 1080 : (bw >= 1100000 ? 720 : 480);
    var uri = "";
    for (var j = i + 1; j < Math.min(i + 3, lines.length); j++) {
      var s = lines[j].trim();
      if (s && s.charAt(0) !== "#") { uri = s; break; }
    }
    if (!uri) continue;
    var abs = resolveUrl(base, uri);
    if (!abs) continue;
    out.push({ file: abs, q: q, bw: bw });
  }
  out.sort(function (a, b) { return (b.q - a.q) || (b.bw - a.bw); });
  return out;
}

// 主清单展开只走直连 (与 embed 同为设备出口, 变体令牌自洽)。
async function fetchMasterVariants(file, referer) {
  try {
    var r = await httpRaw(file, { "User-Agent": UA, "Referer": referer, "Accept": "*/*" }, 8000);
    if (!r || !r.text || r.text.indexOf("#EXTM3U") < 0) return null;
    var variants = parseVariants(r.text, file);
    if (variants.length) return { master: true, variants: variants };
    if (r.text.indexOf("#EXTINF") >= 0) return { master: false, variants: [] };
    return null;
  } catch (e) { return null; }
}

async function expandSources(sources, embedUrl) {
  var out = [];
  for (var i = 0; i < (sources || []).length; i++) {
    var s = sources[i];
    if (!s || !s.file) continue;
    var isHls = /hls|m3u8/i.test(s.type || "") || /\.m3u8(\?|$)/i.test(s.file) || /\.txt(\?|$)/i.test(s.file);
    if (!isHls) { out.push({ file: s.file, type: t(s.type), q: labelRes(s.label), parent: s.file }); continue; }
    var mv = await fetchMasterVariants(s.file, embedUrl);
    if (mv && mv.master && mv.variants.length > 1) {
      for (var vi = 0; vi < mv.variants.length; vi++) out.push({ file: mv.variants[vi].file, type: "hls", q: mv.variants[vi].q, parent: s.file });
    } else if (mv && mv.master && mv.variants.length === 1) {
      out.push({ file: s.file, type: t(s.type), q: mv.variants[0].q || labelRes(s.label), parent: s.file });
    } else {
      out.push({ file: s.file, type: t(s.type), q: labelRes(s.label), parent: s.file });
    }
  }
  out.forEach(function (e, i) { e.v = i; });
  return out;
}

function lineGroup(ln) {
  if (ln.direct) return 0;
  if (/master\.txt(\?|$)/i.test(ln.parentFile || ln.file || "")) return 1;
  return 2;
}

var STAGE_TEXT = {
  page: "详情未取到",
  seed: "无播放种子",
  "post-none": "铸造通道不通",
  "post-bad": "铸造被站方拒",
  embed: "embed未解出"
};

// 全链解析: {html, lines, stage, via, postDiag, bank, pathsN}
async function resolveLines(durl) {
  var html = await fetchPage(durl, "detail");
  if (!html) return { html: "", lines: [], stage: "page", via: "", pageDiag: lastFetchReport };
  var seed = extractPlaySeed(html);
  if (!seed.postId || !seed.mpu) return { html: html, lines: [], stage: "seed", via: "" };
  var cast = await fetchEmbedPaths(seed.postId, seed.mpu, seed.ver, durl);
  if (!cast.paths.length) return { html: html, lines: [], stage: cast.stage, via: cast.via, postDiag: cast.postDiag, bank: cast.bank };
  var perEmbed = await Promise.all(cast.paths.slice(0, 8).map(async function (p, idx) {
    var embedUrl = "https:" + p.path;
    var r = await resolveEmbed(embedUrl, durl);
    if (!r) return [];
    var expanded = await expandSources(r.sources, embedUrl);
    return expanded.map(function (e) {
      return { idx: idx, v: e.v, lo: p.lo, embedUrl: embedUrl, file: e.file, parentFile: e.parent, type: e.type, host: displayHost(e.file, embedUrl), q: e.q, direct: !!r.direct };
    });
  }));
  var lines = [];
  perEmbed.forEach(function (arr) { arr.forEach(function (x) { lines.push(x); }); });
  lines.sort(function (a, b) {
    return (lineGroup(a) - lineGroup(b)) || ((b.q || 0) - (a.q || 0)) ||
      (hostRank(a.host) - hostRank(b.host)) || (a.idx - b.idx) || ((a.v || 0) - (b.v || 0));
  });
  if (!lines.length) return { html: html, lines: [], stage: "embed", via: cast.via, postDiag: cast.postDiag, pathsN: cast.paths.length, bank: cast.bank };
  return { html: html, lines: lines, stage: "ok", via: cast.via, postDiag: cast.postDiag, bank: cast.bank };
}

function lineName(ln) {
  var nm = ln.lo && ln.lo !== "main" ? ln.host + "·" + ln.lo : ln.host;
  if (ln.q) nm += "·" + ln.q + "p";
  if (ln.direct) nm += "·直";
  return nm;
}

function lineToken(durl, idx, v) {
  return TOK + "://u=" + encodeURIComponent(durl) + "&i=" + idx + "&v=" + v;
}
function sniffToken(durl) {
  return TOK + "://u=" + encodeURIComponent(durl) + "&s=1";
}
function parseLineToken(s) {
  var m = String(s || "").match(/^bjp:\/\/u=([^&]+)(?:&i=(\d+))?(?:&v=(\d+))?(?:&s=(1))?/);
  if (!m) return null;
  var durl = "";
  try { durl = decodeURIComponent(m[1]); } catch (e) { durl = ""; }
  return { durl: durl, idx: m[2] != null ? parseInt(m[2], 10) : -1, v: m[3] != null ? parseInt(m[3], 10) : 0, sniff: !!m[4] };
}

// ---------- 接口 ----------
async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var tid = t(params.path != null ? params.path : (params.cat != null ? params.cat : ""));
  var catName = catNameOf(tid);
  try {
    var html = await fetchPage(listUrl(tid, page), "list");
    var cards = html ? toCards(parseCards(html)) : [];
    var drift = "";
    if (!cards.length && /\/v\d+\//.test(tid)) {
      // 前缀漂移兜底 (与蜘蛛同法): 无前缀路径 301 到当前前缀重取一次。
      var stripped = tid.replace(/\/v\d+(?=\/)/, "");
      var html2 = await fetchPage(listUrl(stripped, page), "list");
      var cards2 = html2 ? toCards(parseCards(html2)) : [];
      if (cards2.length) { cards = cards2; html = html2; drift = "（无前缀重试命中）"; }
    }
    if (!html && !cards.length) return diagCard("⚠列表失败", "分类「" + catName + "」第 " + page + " 页三通道均未取到。取页：" + lastFetchReport + "。own=自有 Worker /get，jina=公共中转，direct=手机直连。把本卡文字发给维护者可定位断点。");
    return cards.length ? cards : diagCard("⚠列表0卡", "分类「" + catName + "」第 " + page + " 页正文 " + (html ? html.length : 0) + "B 已取回但解析出 0 张卡，页面结构可能已变" + drift + "。取页：" + lastFetchReport);
  } catch (e) {
    return diagCard("⚠列表异常", "错误：" + String((e && e.message) || e).slice(0, 120) + "。取页：" + lastFetchReport);
  }
}

async function loadDetail(link) {
  var durl = unwrapLink(link);
  if (!durl) return { id: "err", type: "url", title: "参数错误", description: "未找到播放地址" };
  durl = /^https?:\/\//.test(durl) ? durl : absUrl(durl);
  try {
    var rl = await resolveLines(durl);
    var html = rl.html || "";
    if (!html) {
      var slug = (durl.match(/\/video\/([^/]+)\//) || [])[1] || "";
      var nm0 = slug ? clean(slug.replace(/[-_]+/g, " ")) : "BestJavPorn";
      return {
        id: durl, type: "url", title: nm0, link: durl,
        description: "详情页三通道均未取到（" + (rl.pageDiag || lastFetchReport || "无记录") + "）。已附网页嗅探一集兜底；通道恢复后重开详情即可整链重试。",
        episodes: [{ name: "正片·取页全灭·仅嗅探", id: sniffToken(durl), link: sniffToken(durl) }]
      };
    }
    var name = og(html, "title").replace(/\s*-\s*BestJavPorn\s*$/i, "");
    if (!name) {
      var tm = html.match(/<title>([^<]+)<\/title>/);
      name = tm ? clean(tm[1]).replace(/\s*-\s*BestJavPorn\s*$/i, "") : durl;
    }
    var pic = og(html, "image");
    var desc = og(html, "description");
    var contentParts = [];
    if (desc) contentParts.push(desc);
    var episodes = [];
    var lines = rl.lines || [];
    lines.forEach(function (ln) {
      episodes.push({ name: lineName(ln), id: lineToken(durl, ln.idx, ln.v || 0), link: lineToken(durl, ln.idx, ln.v || 0) });
    });
    if (!lines.length) {
      var bankNote = rl.bank === "hit" ? "库命中·" : "库未命中·";
      var epName;
      if (rl.stage === "post-none") epName = "正片·" + bankNote + "铸造全灭 " + (rl.postDiag || "无记录") + "·仅嗅探";
      else if (rl.stage === "post-bad") epName = "正片·" + bankNote + "铸造被站方拒 " + (rl.postDiag || "无记录") + "·仅嗅探";
      else if (rl.stage === "embed") epName = "正片·" + bankNote + "embed未解出" + (rl.pathsN ? " 铸出" + rl.pathsN + "路" : "") + "·仅嗅探";
      else if (rl.stage === "seed") epName = "正片·无播放种子·仅嗅探";
      else epName = "正片·" + (STAGE_TEXT[rl.stage] || "铸造失败") + "·仅嗅探";
      episodes.push({ name: epName.slice(0, 110), id: sniffToken(durl), link: sniffToken(durl) });
      contentParts.push("铸造归因: sniff（" + (STAGE_TEXT[rl.stage] || "铸造失败") + (rl.postDiag ? "；POST 通道 " + rl.postDiag : "") + "）");
    } else {
      var viaText = rl.via === "cast-bank" ? "cast-bank（铸造库命中）" : ("live（模块内现铸 via " + (rl.via || "?") + "）");
      contentParts.push("铸造归因: " + viaText);
      var nDirect = 0;
      lines.forEach(function (l) { if (l.direct) nDirect++; });
      contentParts.push("线路出口: 直连" + nDirect + "/" + lines.length + "（带「·直」的线令牌绑本机 IP 优先点；线路名带清晰度、同组高清在前）");
      episodes.push({ name: "网页嗅探·兜底", id: sniffToken(durl), link: sniffToken(durl) });
    }
    return {
      id: durl,
      type: "url",
      title: name || durl,
      link: durl,
      posterPath: pic,
      coverUrl: pic,
      backdropPath: pic,
      description: contentParts.join("\n"),
      episodes: episodes
    };
  } catch (e) {
    return { id: durl, type: "url", title: "请求错误", description: String((e && e.message) || e), link: durl };
  }
}

function sniffLine(durl) {
  return [{
    name: "网页嗅探",
    url: durl,
    playerType: "app",
    customHeaders: { "User-Agent": UA, "Referer": REFERER },
    description: "铸造链未出线，交播放器 WebView 嗅探详情页（站方播放器在浏览器环境内自铸令牌）。"
  }];
}

// stream 模块入口:
//  - 线路 token (bjp://…&i=&v=) → 整链重铸后按所选线出流
//  - 嗅探 token / 详情页链接 → 嗅探线或最优线
async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = params.link || params.url || params.id || "";
  if (!raw && params.item) raw = params.item.link || params.item.id || params.item.url || "";
  raw = unwrapLink(raw);
  try {
    var tok = parseLineToken(raw);
    if (tok && tok.durl) {
      if (tok.sniff) return sniffLine(tok.durl);
      var rl = await resolveLines(tok.durl);
      var lines = rl.lines || [];
      if (!lines.length) return sniffLine(tok.durl);
      var tapped = null;
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].idx === tok.idx && (lines[i].v || 0) === tok.v) { tapped = lines[i]; break; }
      }
      if (!tapped) {
        for (var j = 0; j < lines.length; j++) {
          if (lines[j].idx === tok.idx) { tapped = lines[j]; break; }
        }
      }
      var best = lines[0];
      var pick = (tapped && lineGroup(tapped) <= lineGroup(best)) ? tapped : best;
      return [{
        name: lineName(pick),
        url: pick.file,
        playerType: "app",
        customHeaders: { "User-Agent": UA, "Referer": pick.embedUrl },
        description: "铸造归因: " + (rl.via === "cast-bank" ? "cast-bank（铸造库）" : ("live（现铸 via " + (rl.via || "?") + "）")) +
          "；出口: " + (pick.direct ? "直连（令牌绑本机 IP）" : "借线") + "；清晰度: " + (pick.q ? pick.q + "p" : "未知")
      }];
    }
    var durl = /^https?:\/\//.test(raw) ? raw : absUrl(raw);
    if (!durl) return [];
    var rl2 = await resolveLines(durl);
    var lines2 = rl2.lines || [];
    if (!lines2.length) return sniffLine(durl);
    var best2 = lines2[0];
    return [{
      name: lineName(best2),
      url: best2.file,
      playerType: "app",
      customHeaders: { "User-Agent": UA, "Referer": best2.embedUrl },
      description: "铸造归因: " + (rl2.via === "cast-bank" ? "cast-bank（铸造库）" : ("live（现铸 via " + (rl2.via || "?") + "）"))
    }];
  } catch (e) {
    return [];
  }
}

function pickKeyword(params) {
  if (params == null) return "";
  if (typeof params === "string" || typeof params === "number") return String(params).trim();
  var keys = ["keyword", "q", "search", "text", "query", "wd", "key"];
  for (var i = 0; i < keys.length; i++) {
    if (params[keys[i]]) return String(params[keys[i]]).trim();
  }
  if (typeof params === "object") {
    var inner = params.params || params.args || params.input;
    if (inner && inner !== params) return pickKeyword(inner);
  }
  return "";
}

async function search(params) {
  params = params || {};
  var wd = pickKeyword(params);
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词后搜索" }];
  try {
    var html = await fetchPage(searchUrl(wd, page), "list");
    if (!html) return diagCard("⚠搜索失败", "关键词「" + wd + "」三通道均未取到。取页：" + lastFetchReport);
    var cards = toCards(parseCards(html));
    return cards.length ? cards : [{ id: "empty", type: "url", title: "没有找到相关影片", description: "搜索页已取回但无结果卡。取页：" + lastFetchReport }];
  } catch (e) {
    return diagCard("⚠搜索异常", "错误：" + String((e && e.message) || e).slice(0, 120) + "。取页：" + lastFetchReport);
  }
}
