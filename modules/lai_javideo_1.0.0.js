// JAVIDEO for REX (lai_javideo v1.0.0)
// 移植自 mira-cat 蜘蛛 javideo.js（只读蓝图），后端 https://javideo.net 。

WidgetMetadata = {
  "id": "lai_javideo",
  "title": "JAVIDEO",
  "description": "JAVIDEO：有码/无码/素人/英字幕/FC2PPV 分区与全部题材分类；S-VIP 自营链优先，SW/LLS 走 javideo-vidhide Worker",
  "author": "lai",
  "version": "1.0.0",
  "requiredVersion": "0.0.1",
  "site": "https://javideo.net",
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
          "value": "censored",
          "enumOptions": [
            {
              "title": "モザあり",
              "value": "censored"
            },
            {
              "title": "無修正",
              "value": "uncensored-h65gJ931GK"
            },
            {
              "title": "素人",
              "value": "amateur"
            },
            {
              "title": "Engsub",
              "value": "engsub-h65gJ931ti"
            },
            {
              "title": "FC2PPV",
              "value": "studio/fc2ppv-s2padYt6q8"
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
      "title": "题材",
      "functionName": "loadList",
      "cacheDuration": 180,
      "params": [
        {
          "name": "cat",
          "title": "分类",
          "type": "enumeration",
          "value": "genre/solowork",
          "enumOptions": [
            {
              "title": "単体作品",
              "value": "genre/solowork"
            },
            {
              "title": "ハイビジョン",
              "value": "genre/high-quality"
            },
            {
              "title": "中出し",
              "value": "genre/creampie"
            },
            {
              "title": "独占配信",
              "value": "genre/exclusive"
            },
            {
              "title": "素人",
              "value": "genre/amateur"
            },
            {
              "title": "手コキ",
              "value": "genre/handjob"
            },
            {
              "title": "おもちゃ",
              "value": "genre/toy"
            },
            {
              "title": "シックスナイン",
              "value": "genre/69"
            },
            {
              "title": "巨乳",
              "value": "genre/big-tits"
            },
            {
              "title": "人妻・主婦",
              "value": "genre/married-woman"
            },
            {
              "title": "4K",
              "value": "genre/4k"
            },
            {
              "title": "熟女",
              "value": "genre/milf"
            },
            {
              "title": "美少女",
              "value": "genre/beautiful-girl"
            },
            {
              "title": "フェラ",
              "value": "genre/blow"
            },
            {
              "title": "痴女",
              "value": "genre/slut"
            },
            {
              "title": "寝取り・寝取られ・NTR",
              "value": "genre/cuckold"
            },
            {
              "title": "スレンダー",
              "value": "genre/slender"
            },
            {
              "title": "デジモ",
              "value": "genre/digimo"
            },
            {
              "title": "3P・4P",
              "value": "genre/3p4p"
            },
            {
              "title": "潮吹き",
              "value": "genre/squirting"
            },
            {
              "title": "淫乱・ハード系",
              "value": "genre/nasty-hardcore"
            },
            {
              "title": "美乳",
              "value": "genre/breasts"
            },
            {
              "title": "4時間以上作品",
              "value": "genre/4hr"
            },
            {
              "title": "パイズリ",
              "value": "genre/titty-fuck"
            },
            {
              "title": "騎乗位",
              "value": "genre/cowgirl"
            },
            {
              "title": "ドラマ",
              "value": "genre/drama"
            },
            {
              "title": "ハメ撮り",
              "value": "genre/pov"
            },
            {
              "title": "妄想族",
              "value": "genre/cross-dressing"
            },
            {
              "title": "女子校生",
              "value": "genre/school-girls"
            },
            {
              "title": "巨尻",
              "value": "genre/huge-butt"
            },
            {
              "title": "不倫",
              "value": "genre/affair"
            },
            {
              "title": "顔射",
              "value": "genre/facials"
            },
            {
              "title": "キス・接吻",
              "value": "genre/kiss-kiss"
            },
            {
              "title": "お姉さん",
              "value": "genre/older-sister"
            },
            {
              "title": "アクメ・オーガズム",
              "value": "genre/acme-%C2%B7-orgasm"
            },
            {
              "title": "パイパン",
              "value": "genre/shaved"
            },
            {
              "title": "ドキュメンタリー",
              "value": "genre/documentary"
            },
            {
              "title": "OL",
              "value": "genre/ol"
            },
            {
              "title": "近親相姦",
              "value": "genre/incest"
            },
            {
              "title": "イラマチオ",
              "value": "genre/deep-throating"
            },
            {
              "title": "オナニー",
              "value": "genre/masturbation"
            },
            {
              "title": "制服",
              "value": "genre/uniform"
            },
            {
              "title": "デビュー作品",
              "value": "genre/debut-production"
            },
            {
              "title": "羞恥",
              "value": "genre/humiliation"
            },
            {
              "title": "コスプレ",
              "value": "genre/cosplay"
            },
            {
              "title": "クンニ",
              "value": "genre/cunnilingus"
            },
            {
              "title": "辱め",
              "value": "genre/shamed"
            },
            {
              "title": "尻フェチ",
              "value": "genre/butt"
            },
            {
              "title": "ギャル",
              "value": "genre/gal"
            },
            {
              "title": "淫語",
              "value": "genre/dirty-words"
            },
            {
              "title": "乱交",
              "value": "genre/orgy"
            },
            {
              "title": "その他フェチ",
              "value": "genre/other-fetish"
            },
            {
              "title": "ギリモザ",
              "value": "genre/risky-mosaic"
            },
            {
              "title": "ローション・オイル",
              "value": "genre/lotion"
            },
            {
              "title": "主観",
              "value": "genre/subjectivity"
            },
            {
              "title": "拘束",
              "value": "genre/restraints"
            },
            {
              "title": "盗撮・のぞき",
              "value": "genre/voyeur"
            },
            {
              "title": "ナンパ",
              "value": "genre/nampa"
            },
            {
              "title": "女子大生",
              "value": "genre/female-college-student"
            },
            {
              "title": "アナル",
              "value": "genre/anal"
            },
            {
              "title": "ごっくん",
              "value": "genre/cum"
            },
            {
              "title": "エステ",
              "value": "genre/beauty-shop"
            },
            {
              "title": "パンスト・タイツ",
              "value": "genre/pantyhose"
            },
            {
              "title": "デカチン・巨根",
              "value": "genre/huge-cock"
            },
            {
              "title": "企画",
              "value": "genre/planning"
            },
            {
              "title": "M男",
              "value": "genre/submissive-men"
            },
            {
              "title": "汗だく",
              "value": "genre/sweat"
            },
            {
              "title": "女教師",
              "value": "genre/female-teacher"
            },
            {
              "title": "美尻",
              "value": "genre/nice-ass"
            },
            {
              "title": "バック",
              "value": "genre/bakku"
            },
            {
              "title": "ぶっかけ",
              "value": "genre/bukkake"
            },
            {
              "title": "キャバ嬢・風俗嬢",
              "value": "genre/miss-customs"
            },
            {
              "title": "マッサージ・リフレ",
              "value": "genre/massage"
            },
            {
              "title": "姉・妹",
              "value": "genre/sister"
            },
            {
              "title": "温泉",
              "value": "genre/hot-spring"
            },
            {
              "title": "放尿・お漏らし",
              "value": "genre/urination"
            },
            {
              "title": "アナルセックス",
              "value": "genre/anal-sex"
            },
            {
              "title": "M女",
              "value": "genre/m-woman"
            },
            {
              "title": "バイブ",
              "value": "genre/vibe"
            },
            {
              "title": "貧乳・微乳",
              "value": "genre/tits"
            },
            {
              "title": "巨乳フェチ",
              "value": "genre/busty-fetish"
            },
            {
              "title": "職業色々",
              "value": "genre/various-professions"
            },
            {
              "title": "アイドル・芸能人",
              "value": "genre/entertainer"
            },
            {
              "title": "エマニエル",
              "value": "genre/emanieru"
            },
            {
              "title": "ぽっちゃり",
              "value": "genre/bbw"
            },
            {
              "title": "イメージビデオ",
              "value": "genre/image-video"
            },
            {
              "title": "SM",
              "value": "genre/sm"
            },
            {
              "title": "長身",
              "value": "genre/tall"
            },
            {
              "title": "脚フェチ",
              "value": "genre/leg-fetish"
            },
            {
              "title": "ミニ系",
              "value": "genre/mini"
            },
            {
              "title": "美脚",
              "value": "genre/beautiful-legs"
            },
            {
              "title": "お母さん",
              "value": "genre/mother"
            },
            {
              "title": "レズビアン",
              "value": "genre/rezubian"
            },
            {
              "title": "指マン",
              "value": "genre/finger-fuck"
            },
            {
              "title": "童貞",
              "value": "genre/virgin-man"
            },
            {
              "title": "鬼畜",
              "value": "genre/evil"
            },
            {
              "title": "学生服",
              "value": "genre/school-uniform"
            },
            {
              "title": "野外・露出",
              "value": "genre/outdoors"
            },
            {
              "title": "人妻",
              "value": "genre/hitodzuma"
            },
            {
              "title": "縛り・緊縛",
              "value": "genre/bondage"
            },
            {
              "title": "AV女優",
              "value": "genre/av-idol"
            },
            {
              "title": "超乳",
              "value": "genre/ultra-huge-tits"
            },
            {
              "title": "ハーレム",
              "value": "genre/harem"
            },
            {
              "title": "電マ",
              "value": "genre/electric-massager"
            },
            {
              "title": "局部アップ",
              "value": "genre/close-up"
            },
            {
              "title": "義母",
              "value": "genre/mother-in-law"
            },
            {
              "title": "パンチラ",
              "value": "genre/underwear"
            },
            {
              "title": "若妻・幼妻",
              "value": "genre/brideyoung-wife"
            },
            {
              "title": "看護婦・ナース",
              "value": "genre/nurse"
            },
            {
              "title": "ニューハーフ",
              "value": "genre/transsexual"
            },
            {
              "title": "小柄",
              "value": "genre/petite"
            },
            {
              "title": "ドラッグ",
              "value": "genre/drug"
            },
            {
              "title": "顔面騎乗",
              "value": "genre/facesitting"
            },
            {
              "title": "女上司",
              "value": "genre/female-boss"
            },
            {
              "title": "レズキス",
              "value": "genre/kiss"
            },
            {
              "title": "女装・男の娘",
              "value": "genre/daughter"
            },
            {
              "title": "3P、4P",
              "value": "genre/3p-4p"
            },
            {
              "title": "生ハメ",
              "value": "genre/raw-saddle"
            },
            {
              "title": "競泳・スクール水着",
              "value": "genre/school-swimsuit"
            },
            {
              "title": "ランジェリー",
              "value": "genre/lingerie"
            },
            {
              "title": "ビッチ",
              "value": "genre/bitchi"
            },
            {
              "title": "水着",
              "value": "genre/swimsuit"
            },
            {
              "title": "原作コラボ",
              "value": "genre/original-collaboration"
            },
            {
              "title": "メイド",
              "value": "genre/maid"
            },
            {
              "title": "セクシー",
              "value": "genre/sexy"
            },
            {
              "title": "ヘルス・ソープ",
              "value": "genre/soapland"
            },
            {
              "title": "足コキ",
              "value": "genre/footjob"
            },
            {
              "title": "生ハメ・生姦",
              "value": "genre/bareback"
            },
            {
              "title": "監禁",
              "value": "genre/confinement"
            },
            {
              "title": "即ハメ",
              "value": "genre/soku-hame"
            },
            {
              "title": "めがね",
              "value": "genre/glasses"
            },
            {
              "title": "着エロ",
              "value": "genre/erotic-wear"
            },
            {
              "title": "口内発射",
              "value": "genre/oral-launch"
            },
            {
              "title": "和服・浴衣",
              "value": "genre/kimonomourning"
            },
            {
              "title": "セーラー服",
              "value": "genre/sailor-suit"
            },
            {
              "title": "レズ",
              "value": "genre/lesbian"
            },
            {
              "title": "イタズラ",
              "value": "genre/mischief"
            },
            {
              "title": "孕ませ",
              "value": "genre/impregnate"
            },
            {
              "title": "デート",
              "value": "genre/date"
            },
            {
              "title": "女優ベスト・総集編",
              "value": "genre/best-omnibus"
            },
            {
              "title": "寝取り、寝取られ",
              "value": "genre/sleeping-sleeping"
            },
            {
              "title": "体操着・ブルマ",
              "value": "genre/bloomers"
            },
            {
              "title": "熟女/人妻",
              "value": "genre/milf"
            },
            {
              "title": "女優",
              "value": "genre/actress"
            },
            {
              "title": "複数話",
              "value": "genre/multiple-story"
            },
            {
              "title": "カップル",
              "value": "genre/couple"
            },
            {
              "title": "凌辱",
              "value": "genre/ryoojoku"
            },
            {
              "title": "浣腸",
              "value": "genre/enema"
            },
            {
              "title": "恋愛",
              "value": "genre/love"
            },
            {
              "title": "お風呂",
              "value": "genre/bath"
            },
            {
              "title": "色白",
              "value": "genre/fair-skinned"
            },
            {
              "title": "ミニスカ",
              "value": "genre/mini-skirt"
            },
            {
              "title": "女捜査官",
              "value": "genre/female-investigator"
            },
            {
              "title": "ファン感謝・訪問",
              "value": "genre/fan-appreciation"
            },
            {
              "title": "男の潮吹き",
              "value": "genre/male-squirting"
            },
            {
              "title": "幼なじみ",
              "value": "genre/childhood-friend"
            },
            {
              "title": "オリジナル動画",
              "value": "genre/original-video"
            },
            {
              "title": "バニーガール",
              "value": "genre/bunny-girl"
            },
            {
              "title": "学園もの",
              "value": "genre/school-stuff"
            },
            {
              "title": "部下・同僚",
              "value": "genre/subordinates--colleagues"
            },
            {
              "title": "黒人男優",
              "value": "genre/black-actor"
            },
            {
              "title": "超VIP",
              "value": "genre/svip"
            },
            {
              "title": "ディルド",
              "value": "genre/dirudo"
            },
            {
              "title": "淫乱、ハード系",
              "value": "genre/nasty-hard-system"
            },
            {
              "title": "ホテル",
              "value": "genre/hotel"
            },
            {
              "title": "スチュワーデス",
              "value": "genre/stewardess"
            },
            {
              "title": "拷問",
              "value": "genre/torture"
            },
            {
              "title": "秘書",
              "value": "genre/secretary"
            },
            {
              "title": "ビジネススーツ",
              "value": "genre/business-suit"
            },
            {
              "title": "家庭教師",
              "value": "genre/tutor"
            },
            {
              "title": "ノーブラ",
              "value": "genre/no-bra"
            },
            {
              "title": "飲み会・合コン",
              "value": "genre/drinking-party"
            },
            {
              "title": "オナサポ",
              "value": "genre/onasapo"
            },
            {
              "title": "微乳",
              "value": "genre/small-tits"
            },
            {
              "title": "白人女優",
              "value": "genre/white-actress"
            },
            {
              "title": "投稿",
              "value": "genre/user-submission"
            },
            {
              "title": "レオタード",
              "value": "genre/reotado"
            },
            {
              "title": "逆ナン",
              "value": "genre/reversed-role"
            },
            {
              "title": "ドキュメント",
              "value": "genre/document"
            },
            {
              "title": "スポーツ",
              "value": "genre/sport"
            },
            {
              "title": "口内射精",
              "value": "genre/oral"
            },
            {
              "title": "アスリート",
              "value": "genre/athlete"
            },
            {
              "title": "日焼け",
              "value": "genre/sun-tan"
            },
            {
              "title": "未亡人",
              "value": "genre/undead"
            },
            {
              "title": "旅行",
              "value": "genre/travel"
            },
            {
              "title": "黒髪",
              "value": "genre/black-hair"
            },
            {
              "title": "叔母さん",
              "value": "genre/aunt"
            },
            {
              "title": "病院・クリニック",
              "value": "genre/hospital--clinic"
            },
            {
              "title": "フェラ抜き",
              "value": "genre/feranuki"
            },
            {
              "title": "女子アナ",
              "value": "genre/joshi-ana"
            },
            {
              "title": "ファンタジー",
              "value": "genre/fantasy"
            },
            {
              "title": "飲尿",
              "value": "genre/piss-drinking"
            },
            {
              "title": "30代",
              "value": "genre/30s"
            },
            {
              "title": "白目・失神",
              "value": "genre/rolling-back-eyes--fainting"
            },
            {
              "title": "ローション",
              "value": "genre/rooshon"
            },
            {
              "title": "妄想",
              "value": "genre/delusion"
            },
            {
              "title": "レースクィーン",
              "value": "genre/race-queen"
            },
            {
              "title": "異物挿入",
              "value": "genre/foreign-objects"
            },
            {
              "title": "スパンキング",
              "value": "genre/spanking"
            },
            {
              "title": "レイプ",
              "value": "genre/rape"
            },
            {
              "title": "ショタ",
              "value": "genre/shotacon"
            },
            {
              "title": "娘・養女",
              "value": "genre/daughterfoster"
            },
            {
              "title": "女医",
              "value": "genre/female-doctor"
            },
            {
              "title": "パンスト",
              "value": "genre/pansuto"
            },
            {
              "title": "盗撮",
              "value": "genre/tosatsu"
            },
            {
              "title": "ポッチャリ",
              "value": "genre/chubby"
            },
            {
              "title": "芸能人",
              "value": "genre/geinoojin"
            },
            {
              "title": "部活・マネージャー",
              "value": "genre/club-activities--manager"
            },
            {
              "title": "母乳",
              "value": "genre/breast-milk"
            },
            {
              "title": "ツンデレ",
              "value": "genre/tsundere"
            },
            {
              "title": "筋肉",
              "value": "genre/muscle"
            },
            {
              "title": "インストラクター",
              "value": "genre/instructor"
            },
            {
              "title": "ポルチオ",
              "value": "genre/portio"
            },
            {
              "title": "縛り",
              "value": "genre/tied-up"
            },
            {
              "title": "ベスト、総集編",
              "value": "genre/besuto-soshuhen"
            },
            {
              "title": "お爺ちゃん",
              "value": "genre/elder-male"
            },
            {
              "title": "調教",
              "value": "genre/training"
            },
            {
              "title": "ボンテージ",
              "value": "genre/bonteji"
            },
            {
              "title": "妹",
              "value": "genre/imooto"
            },
            {
              "title": "ローター",
              "value": "genre/rota"
            },
            {
              "title": "ロリ",
              "value": "genre/lori"
            },
            {
              "title": "特撮",
              "value": "genre/special-effects"
            },
            {
              "title": "3P",
              "value": "genre/3p"
            },
            {
              "title": "女将・女主人",
              "value": "genre/landlady-hostess"
            },
            {
              "title": "個人撮影",
              "value": "genre/selfie"
            },
            {
              "title": "ロリ系",
              "value": "genre/loli-system"
            },
            {
              "title": "ダンス",
              "value": "genre/dance"
            },
            {
              "title": "カーセックス",
              "value": "genre/car-sex"
            },
            {
              "title": "モデル",
              "value": "genre/model"
            },
            {
              "title": "アクション格闘",
              "value": "genre/action-fight"
            },
            {
              "title": "クスコ",
              "value": "genre/kusuko"
            },
            {
              "title": "ニーソックス",
              "value": "genre/knee-socks"
            },
            {
              "title": "女性向け",
              "value": "genre/for-women"
            },
            {
              "title": "お嬢様・令嬢",
              "value": "genre/young"
            },
            {
              "title": "早漏",
              "value": "genre/premature-ejaculation"
            },
            {
              "title": "風俗嬢",
              "value": "genre/miss-manners"
            },
            {
              "title": "初心 (うぶ) 系",
              "value": "genre/naive"
            },
            {
              "title": "時間停止",
              "value": "genre/time-stop"
            },
            {
              "title": "胸チラ",
              "value": "genre/chest-chiller"
            },
            {
              "title": "アクション",
              "value": "genre/akushon"
            },
            {
              "title": "野外",
              "value": "genre/yagai"
            },
            {
              "title": "マングリ返し",
              "value": "genre/piledriver"
            },
            {
              "title": "鬼畜系",
              "value": "genre/ghost-animal"
            },
            {
              "title": "ゲロ",
              "value": "genre/gero"
            },
            {
              "title": "スワッピング・夫婦交換",
              "value": "genre/swapping--couple-exchange"
            },
            {
              "title": "不倫・浮気",
              "value": "genre/affair--cheating"
            },
            {
              "title": "放尿",
              "value": "genre/pissing"
            },
            {
              "title": "花嫁",
              "value": "genre/bride"
            },
            {
              "title": "洋ピン・海外輸入",
              "value": "genre/oversea-import"
            },
            {
              "title": "ノーパン",
              "value": "genre/no-undies"
            },
            {
              "title": "How To",
              "value": "genre/how-to"
            },
            {
              "title": "アナルセックス（男の娘）",
              "value": "genre/anal-sex-cross-dressing-man"
            },
            {
              "title": "マッサージ",
              "value": "genre/massaji"
            },
            {
              "title": "スカトロ",
              "value": "genre/scat"
            },
            {
              "title": "裸エプロン",
              "value": "genre/naked-apron"
            },
            {
              "title": "軟体",
              "value": "genre/nantai"
            },
            {
              "title": "処女",
              "value": "genre/virgin"
            },
            {
              "title": "脱糞",
              "value": "genre/defecation"
            },
            {
              "title": "看護婦",
              "value": "genre/nurse"
            },
            {
              "title": "残虐表現",
              "value": "genre/cruel-expression"
            },
            {
              "title": "ボディコン",
              "value": "genre/body-conscious"
            },
            {
              "title": "鼻フック",
              "value": "genre/nose-hook"
            },
            {
              "title": "女王様",
              "value": "genre/queen"
            },
            {
              "title": "浴衣・着物",
              "value": "genre/kimono"
            },
            {
              "title": "輪姦",
              "value": "genre/rinkan"
            },
            {
              "title": "面接",
              "value": "genre/interview"
            },
            {
              "title": "くすぐり",
              "value": "genre/tickling"
            },
            {
              "title": "ママ友",
              "value": "genre/mom-friends"
            },
            {
              "title": "フィスト",
              "value": "genre/fisting"
            },
            {
              "title": "美女",
              "value": "genre/beautiful-woman"
            },
            {
              "title": "アジア女優",
              "value": "genre/other-asian"
            },
            {
              "title": "アナル舐め",
              "value": "genre/rimjob"
            },
            {
              "title": "性転換・女体化",
              "value": "genre/seitenka-jotaika"
            },
            {
              "title": "ネコミミ・獣系",
              "value": "genre/catgirl"
            },
            {
              "title": "覆面・マスク",
              "value": "genre/masked"
            },
            {
              "title": "ルーズソックス",
              "value": "genre/loose-socks"
            },
            {
              "title": "和服、喪服",
              "value": "genre/kimono-mourning"
            },
            {
              "title": "AI生成作品",
              "value": "genre/ai-generated-artwork"
            },
            {
              "title": "オタク",
              "value": "genre/otaku"
            },
            {
              "title": "ダーク系",
              "value": "genre/dark-system"
            },
            {
              "title": "アクション・格闘",
              "value": "genre/fighting-action"
            },
            {
              "title": "花嫁、若妻",
              "value": "genre/hanayome-wakadzuma"
            },
            {
              "title": "デビュー作",
              "value": "genre/debut-work"
            },
            {
              "title": "ウェイトレス",
              "value": "genre/waitress"
            },
            {
              "title": "ヨガ",
              "value": "genre/yoga"
            },
            {
              "title": "ストリーミング対応",
              "value": "genre/streaming"
            },
            {
              "title": "ブルマ",
              "value": "genre/bloomers"
            },
            {
              "title": "マンコ図鑑",
              "value": "genre/manko-zukan"
            },
            {
              "title": "20代",
              "value": "genre/20s"
            },
            {
              "title": "お婆ちゃん",
              "value": "genre/grandma"
            },
            {
              "title": "チアガール",
              "value": "genre/cheerleader"
            },
            {
              "title": "ハード系",
              "value": "genre/hard"
            },
            {
              "title": "お掃除フェラ",
              "value": "genre/cleaning-blow"
            },
            {
              "title": "フェチ",
              "value": "genre/fetish"
            },
            {
              "title": "40代",
              "value": "genre/40s"
            },
            {
              "title": "ロングブーツ",
              "value": "genre/knee-high-boots"
            },
            {
              "title": "受付嬢",
              "value": "genre/receptionist"
            },
            {
              "title": "痴漢",
              "value": "genre/chikan"
            },
            {
              "title": "セレブ",
              "value": "genre/celebrity"
            },
            {
              "title": "蝋燭",
              "value": "genre/candle"
            },
            {
              "title": "ギャグ・コメディ",
              "value": "genre/gyagu-komedi"
            },
            {
              "title": "極上泡姫物語",
              "value": "genre/princess-story"
            },
            {
              "title": "催眠",
              "value": "genre/saimin"
            },
            {
              "title": "スクール水着",
              "value": "genre/swimsuit-school"
            },
            {
              "title": "ふたなり",
              "value": "genre/futanari"
            },
            {
              "title": "清楚",
              "value": "genre/seiso"
            },
            {
              "title": "キャンギャル",
              "value": "genre/campaign-girl"
            },
            {
              "title": "若妻",
              "value": "genre/young-wife"
            },
            {
              "title": "素股",
              "value": "genre/intercrural-sex"
            },
            {
              "title": "総集編・オムニバス",
              "value": "genre/omnibus--omnibus"
            },
            {
              "title": "チャイナドレス",
              "value": "genre/china-dress"
            },
            {
              "title": "洗練された大人のいやし亭",
              "value": "genre/sophisticated-adult-healing-pavilion"
            },
            {
              "title": "罵倒",
              "value": "genre/insult"
            },
            {
              "title": "女戦士",
              "value": "genre/female-soldier"
            },
            {
              "title": "早抜きBEST",
              "value": "genre/fast-pull-out-best"
            },
            {
              "title": "セフレ",
              "value": "genre/friends-with-benefits"
            },
            {
              "title": "３P",
              "value": "genre/%EF%BC%93p"
            },
            {
              "title": "風呂",
              "value": "genre/furo"
            },
            {
              "title": "そっくりさん",
              "value": "genre/look-alike"
            },
            {
              "title": "妊婦",
              "value": "genre/pregnant-woman"
            },
            {
              "title": "可愛い",
              "value": "genre/kawaii"
            },
            {
              "title": "THE 未公開",
              "value": "genre/the-unreleased"
            },
            {
              "title": "ソープ",
              "value": "genre/soap"
            },
            {
              "title": "エプロン",
              "value": "genre/epuron"
            },
            {
              "title": "Debut",
              "value": "genre/debut"
            },
            {
              "title": "初撮り",
              "value": "genre/hattori"
            },
            {
              "title": "16時間以上作品",
              "value": "genre/over-16-hours"
            },
            {
              "title": "体験告白",
              "value": "genre/experience-confession"
            },
            {
              "title": "格闘家",
              "value": "genre/fighter"
            },
            {
              "title": "復刻",
              "value": "genre/reprint"
            },
            {
              "title": "着衣",
              "value": "genre/clothes"
            },
            {
              "title": "NTR",
              "value": "genre/ntr"
            },
            {
              "title": "放置",
              "value": "genre/abandoned"
            },
            {
              "title": "VIP",
              "value": "genre/vip"
            },
            {
              "title": "淫乱",
              "value": "genre/nasty"
            },
            {
              "title": "羞恥プレイ",
              "value": "genre/shuchi-purei"
            },
            {
              "title": "お嬢様",
              "value": "genre/lady"
            },
            {
              "title": "モデル系",
              "value": "genre/model"
            },
            {
              "title": "剃毛",
              "value": "genre/shave"
            },
            {
              "title": "ドール",
              "value": "genre/doll"
            },
            {
              "title": "爆乳",
              "value": "genre/big-breasts"
            },
            {
              "title": "2010年代後半（DOD）",
              "value": "genre/dod"
            },
            {
              "title": "SF",
              "value": "genre/sf"
            },
            {
              "title": "筆おろし",
              "value": "genre/brush-down"
            },
            {
              "title": "ネトラレ",
              "value": "genre/netorare"
            },
            {
              "title": "この女、ふしだら。",
              "value": "genre/woman-slutty"
            },
            {
              "title": "ゲイ",
              "value": "genre/gay"
            },
            {
              "title": "美人",
              "value": "genre/beauty"
            },
            {
              "title": "くノ一",
              "value": "genre/kunoichi"
            },
            {
              "title": "サマーヌード",
              "value": "genre/summer-nude"
            },
            {
              "title": "野外露出",
              "value": "genre/yagairode"
            },
            {
              "title": "アンソロジー",
              "value": "genre/anthology"
            },
            {
              "title": "シャワー",
              "value": "genre/shower"
            },
            {
              "title": "若い",
              "value": "genre/wakai"
            },
            {
              "title": "バスガイド",
              "value": "genre/bus-guide"
            },
            {
              "title": "イラマ",
              "value": "genre/irama"
            },
            {
              "title": "SM拘束",
              "value": "genre/sm-restraint"
            },
            {
              "title": "コンパニオン",
              "value": "genre/companion"
            },
            {
              "title": "コラボ作品",
              "value": "genre/collaborative-work"
            },
            {
              "title": "オイルプレイ",
              "value": "genre/oil-play"
            },
            {
              "title": "Gカップ",
              "value": "genre/g-cup"
            },
            {
              "title": "泥酔",
              "value": "genre/drunk"
            },
            {
              "title": "寝取られ",
              "value": "genre/being-taken-asleep"
            },
            {
              "title": "女優魂",
              "value": "genre/actress-soul"
            },
            {
              "title": "触手",
              "value": "genre/shokushu"
            },
            {
              "title": "クラシック",
              "value": "genre/classic"
            },
            {
              "title": "巫女",
              "value": "genre/priestess"
            },
            {
              "title": "50代",
              "value": "genre/50s"
            },
            {
              "title": "かわいい",
              "value": "genre/cute"
            },
            {
              "title": "3D",
              "value": "genre/3d"
            },
            {
              "title": "食糞",
              "value": "genre/coprophagy"
            },
            {
              "title": "和服",
              "value": "genre/wafuku"
            },
            {
              "title": "流出",
              "value": "genre/outflow"
            },
            {
              "title": "恍惚",
              "value": "genre/ecstasy"
            },
            {
              "title": "BOGA x BOGA",
              "value": "genre/boga-x-boga"
            },
            {
              "title": "Digital Mosaic",
              "value": "genre/digital-mosaic"
            },
            {
              "title": "寝取り・寝取られ",
              "value": "genre/cuckold--cuckold"
            },
            {
              "title": "ザーメン",
              "value": "genre/semen"
            },
            {
              "title": "胸射",
              "value": "genre/breaststroke"
            },
            {
              "title": "全裸",
              "value": "genre/naked"
            },
            {
              "title": "フェラチオ",
              "value": "genre/fellatio"
            },
            {
              "title": "精飲",
              "value": "genre/swallowing"
            },
            {
              "title": "掃除フェラ",
              "value": "genre/cleaning-blowjob"
            },
            {
              "title": "ダイナマイト",
              "value": "genre/dainamaito"
            },
            {
              "title": "デリヘル嬢",
              "value": "genre/delivery-health-lady"
            },
            {
              "title": "ベロチュー",
              "value": "genre/belochu"
            },
            {
              "title": "Fカップ",
              "value": "genre/f-cup"
            },
            {
              "title": "童顔",
              "value": "genre/baby-face"
            },
            {
              "title": "JD",
              "value": "genre/jd"
            },
            {
              "title": "お姫様",
              "value": "genre/princess"
            },
            {
              "title": "女熱大陸",
              "value": "genre/female-hot-continent"
            },
            {
              "title": "台湾モデル",
              "value": "genre/taiwan-model"
            },
            {
              "title": "羞恥・辱め",
              "value": "genre/shame-humiliation"
            },
            {
              "title": "蝶が如く",
              "value": "genre/butterfly"
            },
            {
              "title": "新入社員のお仕事",
              "value": "genre/new-employee-job"
            },
            {
              "title": "露出",
              "value": "genre/roshutsu"
            },
            {
              "title": "福袋",
              "value": "genre/lucky-bag"
            },
            {
              "title": "女将、女主人",
              "value": "genre/landlady"
            },
            {
              "title": "枕営業",
              "value": "genre/pillow-business"
            },
            {
              "title": "初裏",
              "value": "genre/hatsuura"
            },
            {
              "title": "アナル図鑑",
              "value": "genre/anaru-zukan"
            },
            {
              "title": "黒髪ロング",
              "value": "genre/kurokami-rongu"
            },
            {
              "title": "セクシー女優エンサイクロペディア",
              "value": "genre/sexy-actress-encyclopedia"
            },
            {
              "title": "剛毛",
              "value": "genre/bristle"
            },
            {
              "title": "淫語責め",
              "value": "genre/dirty-blame"
            },
            {
              "title": "欲求不満",
              "value": "genre/frustration"
            },
            {
              "title": "変身ヒロイン",
              "value": "genre/henshin-hiroin"
            },
            {
              "title": "ちっぱい",
              "value": "genre/chippai"
            },
            {
              "title": "ホラー",
              "value": "genre/horror"
            },
            {
              "title": "Promiscuity",
              "value": "genre/promiscuity"
            },
            {
              "title": "パンティ",
              "value": "genre/panties"
            },
            {
              "title": "貧乳",
              "value": "genre/small-breasts"
            },
            {
              "title": "４P",
              "value": "genre/4p"
            },
            {
              "title": "ネコミミ",
              "value": "genre/nekomimi"
            },
            {
              "title": "側位",
              "value": "genre/sokui"
            },
            {
              "title": "青姦",
              "value": "genre/outdoor-sex"
            },
            {
              "title": "Hカップ",
              "value": "genre/eichikappu"
            },
            {
              "title": "2穴責め",
              "value": "genre/2-ana-seme"
            },
            {
              "title": "ベスト/オムニバス",
              "value": "genre/besuto-omunibasu"
            },
            {
              "title": "オフィス",
              "value": "genre/office"
            },
            {
              "title": "10代 (18+)",
              "value": "genre/teen-18"
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

var CATS_DATA = [{"type_id":"censored","type_name":"モザあり"},{"type_id":"uncensored-h65gJ931GK","type_name":"無修正"},{"type_id":"amateur","type_name":"素人"},{"type_id":"engsub-h65gJ931ti","type_name":"Engsub"},{"type_id":"studio/fc2ppv-s2padYt6q8","type_name":"FC2PPV"},{"type_id":"genre/solowork","type_name":"単体作品"},{"type_id":"genre/high-quality","type_name":"ハイビジョン"},{"type_id":"genre/creampie","type_name":"中出し"},{"type_id":"genre/exclusive","type_name":"独占配信"},{"type_id":"genre/amateur","type_name":"素人"},{"type_id":"genre/handjob","type_name":"手コキ"},{"type_id":"genre/toy","type_name":"おもちゃ"},{"type_id":"genre/69","type_name":"シックスナイン"},{"type_id":"genre/big-tits","type_name":"巨乳"},{"type_id":"genre/married-woman","type_name":"人妻・主婦"},{"type_id":"genre/4k","type_name":"4K"},{"type_id":"genre/milf","type_name":"熟女"},{"type_id":"genre/beautiful-girl","type_name":"美少女"},{"type_id":"genre/blow","type_name":"フェラ"},{"type_id":"genre/slut","type_name":"痴女"},{"type_id":"genre/cuckold","type_name":"寝取り・寝取られ・NTR"},{"type_id":"genre/slender","type_name":"スレンダー"},{"type_id":"genre/digimo","type_name":"デジモ"},{"type_id":"genre/3p4p","type_name":"3P・4P"},{"type_id":"genre/squirting","type_name":"潮吹き"},{"type_id":"genre/nasty-hardcore","type_name":"淫乱・ハード系"},{"type_id":"genre/breasts","type_name":"美乳"},{"type_id":"genre/4hr","type_name":"4時間以上作品"},{"type_id":"genre/titty-fuck","type_name":"パイズリ"},{"type_id":"genre/cowgirl","type_name":"騎乗位"},{"type_id":"genre/drama","type_name":"ドラマ"},{"type_id":"genre/pov","type_name":"ハメ撮り"},{"type_id":"genre/cross-dressing","type_name":"妄想族"},{"type_id":"genre/school-girls","type_name":"女子校生"},{"type_id":"genre/huge-butt","type_name":"巨尻"},{"type_id":"genre/affair","type_name":"不倫"},{"type_id":"genre/facials","type_name":"顔射"},{"type_id":"genre/kiss-kiss","type_name":"キス・接吻"},{"type_id":"genre/older-sister","type_name":"お姉さん"},{"type_id":"genre/acme-%C2%B7-orgasm","type_name":"アクメ・オーガズム"},{"type_id":"genre/shaved","type_name":"パイパン"},{"type_id":"genre/documentary","type_name":"ドキュメンタリー"},{"type_id":"genre/ol","type_name":"OL"},{"type_id":"genre/incest","type_name":"近親相姦"},{"type_id":"genre/deep-throating","type_name":"イラマチオ"},{"type_id":"genre/masturbation","type_name":"オナニー"},{"type_id":"genre/uniform","type_name":"制服"},{"type_id":"genre/debut-production","type_name":"デビュー作品"},{"type_id":"genre/humiliation","type_name":"羞恥"},{"type_id":"genre/cosplay","type_name":"コスプレ"},{"type_id":"genre/cunnilingus","type_name":"クンニ"},{"type_id":"genre/shamed","type_name":"辱め"},{"type_id":"genre/butt","type_name":"尻フェチ"},{"type_id":"genre/gal","type_name":"ギャル"},{"type_id":"genre/dirty-words","type_name":"淫語"},{"type_id":"genre/orgy","type_name":"乱交"},{"type_id":"genre/other-fetish","type_name":"その他フェチ"},{"type_id":"genre/risky-mosaic","type_name":"ギリモザ"},{"type_id":"genre/lotion","type_name":"ローション・オイル"},{"type_id":"genre/subjectivity","type_name":"主観"},{"type_id":"genre/restraints","type_name":"拘束"},{"type_id":"genre/voyeur","type_name":"盗撮・のぞき"},{"type_id":"genre/nampa","type_name":"ナンパ"},{"type_id":"genre/female-college-student","type_name":"女子大生"},{"type_id":"genre/anal","type_name":"アナル"},{"type_id":"genre/cum","type_name":"ごっくん"},{"type_id":"genre/beauty-shop","type_name":"エステ"},{"type_id":"genre/pantyhose","type_name":"パンスト・タイツ"},{"type_id":"genre/huge-cock","type_name":"デカチン・巨根"},{"type_id":"genre/planning","type_name":"企画"},{"type_id":"genre/submissive-men","type_name":"M男"},{"type_id":"genre/sweat","type_name":"汗だく"},{"type_id":"genre/female-teacher","type_name":"女教師"},{"type_id":"genre/nice-ass","type_name":"美尻"},{"type_id":"genre/bakku","type_name":"バック"},{"type_id":"genre/bukkake","type_name":"ぶっかけ"},{"type_id":"genre/miss-customs","type_name":"キャバ嬢・風俗嬢"},{"type_id":"genre/massage","type_name":"マッサージ・リフレ"},{"type_id":"genre/sister","type_name":"姉・妹"},{"type_id":"genre/hot-spring","type_name":"温泉"},{"type_id":"genre/urination","type_name":"放尿・お漏らし"},{"type_id":"genre/anal-sex","type_name":"アナルセックス"},{"type_id":"genre/m-woman","type_name":"M女"},{"type_id":"genre/vibe","type_name":"バイブ"},{"type_id":"genre/tits","type_name":"貧乳・微乳"},{"type_id":"genre/busty-fetish","type_name":"巨乳フェチ"},{"type_id":"genre/various-professions","type_name":"職業色々"},{"type_id":"genre/entertainer","type_name":"アイドル・芸能人"},{"type_id":"genre/emanieru","type_name":"エマニエル"},{"type_id":"genre/bbw","type_name":"ぽっちゃり"},{"type_id":"genre/image-video","type_name":"イメージビデオ"},{"type_id":"genre/sm","type_name":"SM"},{"type_id":"genre/tall","type_name":"長身"},{"type_id":"genre/leg-fetish","type_name":"脚フェチ"},{"type_id":"genre/mini","type_name":"ミニ系"},{"type_id":"genre/beautiful-legs","type_name":"美脚"},{"type_id":"genre/mother","type_name":"お母さん"},{"type_id":"genre/rezubian","type_name":"レズビアン"},{"type_id":"genre/finger-fuck","type_name":"指マン"},{"type_id":"genre/virgin-man","type_name":"童貞"},{"type_id":"genre/evil","type_name":"鬼畜"},{"type_id":"genre/school-uniform","type_name":"学生服"},{"type_id":"genre/outdoors","type_name":"野外・露出"},{"type_id":"genre/hitodzuma","type_name":"人妻"},{"type_id":"genre/bondage","type_name":"縛り・緊縛"},{"type_id":"genre/av-idol","type_name":"AV女優"},{"type_id":"genre/ultra-huge-tits","type_name":"超乳"},{"type_id":"genre/harem","type_name":"ハーレム"},{"type_id":"genre/electric-massager","type_name":"電マ"},{"type_id":"genre/close-up","type_name":"局部アップ"},{"type_id":"genre/mother-in-law","type_name":"義母"},{"type_id":"genre/underwear","type_name":"パンチラ"},{"type_id":"genre/brideyoung-wife","type_name":"若妻・幼妻"},{"type_id":"genre/nurse","type_name":"看護婦・ナース"},{"type_id":"genre/transsexual","type_name":"ニューハーフ"},{"type_id":"genre/petite","type_name":"小柄"},{"type_id":"genre/drug","type_name":"ドラッグ"},{"type_id":"genre/facesitting","type_name":"顔面騎乗"},{"type_id":"genre/female-boss","type_name":"女上司"},{"type_id":"genre/kiss","type_name":"レズキス"},{"type_id":"genre/daughter","type_name":"女装・男の娘"},{"type_id":"genre/3p-4p","type_name":"3P、4P"},{"type_id":"genre/raw-saddle","type_name":"生ハメ"},{"type_id":"genre/school-swimsuit","type_name":"競泳・スクール水着"},{"type_id":"genre/lingerie","type_name":"ランジェリー"},{"type_id":"genre/bitchi","type_name":"ビッチ"},{"type_id":"genre/swimsuit","type_name":"水着"},{"type_id":"genre/original-collaboration","type_name":"原作コラボ"},{"type_id":"genre/maid","type_name":"メイド"},{"type_id":"genre/sexy","type_name":"セクシー"},{"type_id":"genre/soapland","type_name":"ヘルス・ソープ"},{"type_id":"genre/footjob","type_name":"足コキ"},{"type_id":"genre/bareback","type_name":"生ハメ・生姦"},{"type_id":"genre/confinement","type_name":"監禁"},{"type_id":"genre/soku-hame","type_name":"即ハメ"},{"type_id":"genre/glasses","type_name":"めがね"},{"type_id":"genre/erotic-wear","type_name":"着エロ"},{"type_id":"genre/oral-launch","type_name":"口内発射"},{"type_id":"genre/kimonomourning","type_name":"和服・浴衣"},{"type_id":"genre/sailor-suit","type_name":"セーラー服"},{"type_id":"genre/lesbian","type_name":"レズ"},{"type_id":"genre/mischief","type_name":"イタズラ"},{"type_id":"genre/impregnate","type_name":"孕ませ"},{"type_id":"genre/date","type_name":"デート"},{"type_id":"genre/best-omnibus","type_name":"女優ベスト・総集編"},{"type_id":"genre/sleeping-sleeping","type_name":"寝取り、寝取られ"},{"type_id":"genre/bloomers","type_name":"体操着・ブルマ"},{"type_id":"genre/milf","type_name":"熟女/人妻"},{"type_id":"genre/actress","type_name":"女優"},{"type_id":"genre/multiple-story","type_name":"複数話"},{"type_id":"genre/couple","type_name":"カップル"},{"type_id":"genre/ryoojoku","type_name":"凌辱"},{"type_id":"genre/enema","type_name":"浣腸"},{"type_id":"genre/love","type_name":"恋愛"},{"type_id":"genre/bath","type_name":"お風呂"},{"type_id":"genre/fair-skinned","type_name":"色白"},{"type_id":"genre/mini-skirt","type_name":"ミニスカ"},{"type_id":"genre/female-investigator","type_name":"女捜査官"},{"type_id":"genre/fan-appreciation","type_name":"ファン感謝・訪問"},{"type_id":"genre/male-squirting","type_name":"男の潮吹き"},{"type_id":"genre/childhood-friend","type_name":"幼なじみ"},{"type_id":"genre/original-video","type_name":"オリジナル動画"},{"type_id":"genre/bunny-girl","type_name":"バニーガール"},{"type_id":"genre/school-stuff","type_name":"学園もの"},{"type_id":"genre/subordinates--colleagues","type_name":"部下・同僚"},{"type_id":"genre/black-actor","type_name":"黒人男優"},{"type_id":"genre/svip","type_name":"超VIP"},{"type_id":"genre/dirudo","type_name":"ディルド"},{"type_id":"genre/nasty-hard-system","type_name":"淫乱、ハード系"},{"type_id":"genre/hotel","type_name":"ホテル"},{"type_id":"genre/stewardess","type_name":"スチュワーデス"},{"type_id":"genre/torture","type_name":"拷問"},{"type_id":"genre/secretary","type_name":"秘書"},{"type_id":"genre/business-suit","type_name":"ビジネススーツ"},{"type_id":"genre/tutor","type_name":"家庭教師"},{"type_id":"genre/no-bra","type_name":"ノーブラ"},{"type_id":"genre/drinking-party","type_name":"飲み会・合コン"},{"type_id":"genre/onasapo","type_name":"オナサポ"},{"type_id":"genre/small-tits","type_name":"微乳"},{"type_id":"genre/white-actress","type_name":"白人女優"},{"type_id":"genre/user-submission","type_name":"投稿"},{"type_id":"genre/reotado","type_name":"レオタード"},{"type_id":"genre/reversed-role","type_name":"逆ナン"},{"type_id":"genre/document","type_name":"ドキュメント"},{"type_id":"genre/sport","type_name":"スポーツ"},{"type_id":"genre/oral","type_name":"口内射精"},{"type_id":"genre/athlete","type_name":"アスリート"},{"type_id":"genre/sun-tan","type_name":"日焼け"},{"type_id":"genre/undead","type_name":"未亡人"},{"type_id":"genre/travel","type_name":"旅行"},{"type_id":"genre/black-hair","type_name":"黒髪"},{"type_id":"genre/aunt","type_name":"叔母さん"},{"type_id":"genre/hospital--clinic","type_name":"病院・クリニック"},{"type_id":"genre/feranuki","type_name":"フェラ抜き"},{"type_id":"genre/joshi-ana","type_name":"女子アナ"},{"type_id":"genre/fantasy","type_name":"ファンタジー"},{"type_id":"genre/piss-drinking","type_name":"飲尿"},{"type_id":"genre/30s","type_name":"30代"},{"type_id":"genre/rolling-back-eyes--fainting","type_name":"白目・失神"},{"type_id":"genre/rooshon","type_name":"ローション"},{"type_id":"genre/delusion","type_name":"妄想"},{"type_id":"genre/race-queen","type_name":"レースクィーン"},{"type_id":"genre/foreign-objects","type_name":"異物挿入"},{"type_id":"genre/spanking","type_name":"スパンキング"},{"type_id":"genre/rape","type_name":"レイプ"},{"type_id":"genre/shotacon","type_name":"ショタ"},{"type_id":"genre/daughterfoster","type_name":"娘・養女"},{"type_id":"genre/female-doctor","type_name":"女医"},{"type_id":"genre/pansuto","type_name":"パンスト"},{"type_id":"genre/tosatsu","type_name":"盗撮"},{"type_id":"genre/chubby","type_name":"ポッチャリ"},{"type_id":"genre/geinoojin","type_name":"芸能人"},{"type_id":"genre/club-activities--manager","type_name":"部活・マネージャー"},{"type_id":"genre/breast-milk","type_name":"母乳"},{"type_id":"genre/tsundere","type_name":"ツンデレ"},{"type_id":"genre/muscle","type_name":"筋肉"},{"type_id":"genre/instructor","type_name":"インストラクター"},{"type_id":"genre/portio","type_name":"ポルチオ"},{"type_id":"genre/tied-up","type_name":"縛り"},{"type_id":"genre/besuto-soshuhen","type_name":"ベスト、総集編"},{"type_id":"genre/elder-male","type_name":"お爺ちゃん"},{"type_id":"genre/training","type_name":"調教"},{"type_id":"genre/bonteji","type_name":"ボンテージ"},{"type_id":"genre/imooto","type_name":"妹"},{"type_id":"genre/rota","type_name":"ローター"},{"type_id":"genre/lori","type_name":"ロリ"},{"type_id":"genre/special-effects","type_name":"特撮"},{"type_id":"genre/3p","type_name":"3P"},{"type_id":"genre/landlady-hostess","type_name":"女将・女主人"},{"type_id":"genre/selfie","type_name":"個人撮影"},{"type_id":"genre/loli-system","type_name":"ロリ系"},{"type_id":"genre/dance","type_name":"ダンス"},{"type_id":"genre/car-sex","type_name":"カーセックス"},{"type_id":"genre/model","type_name":"モデル"},{"type_id":"genre/action-fight","type_name":"アクション格闘"},{"type_id":"genre/kusuko","type_name":"クスコ"},{"type_id":"genre/knee-socks","type_name":"ニーソックス"},{"type_id":"genre/for-women","type_name":"女性向け"},{"type_id":"genre/young","type_name":"お嬢様・令嬢"},{"type_id":"genre/premature-ejaculation","type_name":"早漏"},{"type_id":"genre/miss-manners","type_name":"風俗嬢"},{"type_id":"genre/naive","type_name":"初心 (うぶ) 系"},{"type_id":"genre/time-stop","type_name":"時間停止"},{"type_id":"genre/chest-chiller","type_name":"胸チラ"},{"type_id":"genre/akushon","type_name":"アクション"},{"type_id":"genre/yagai","type_name":"野外"},{"type_id":"genre/piledriver","type_name":"マングリ返し"},{"type_id":"genre/ghost-animal","type_name":"鬼畜系"},{"type_id":"genre/gero","type_name":"ゲロ"},{"type_id":"genre/swapping--couple-exchange","type_name":"スワッピング・夫婦交換"},{"type_id":"genre/affair--cheating","type_name":"不倫・浮気"},{"type_id":"genre/pissing","type_name":"放尿"},{"type_id":"genre/bride","type_name":"花嫁"},{"type_id":"genre/oversea-import","type_name":"洋ピン・海外輸入"},{"type_id":"genre/no-undies","type_name":"ノーパン"},{"type_id":"genre/how-to","type_name":"How To"},{"type_id":"genre/anal-sex-cross-dressing-man","type_name":"アナルセックス（男の娘）"},{"type_id":"genre/massaji","type_name":"マッサージ"},{"type_id":"genre/scat","type_name":"スカトロ"},{"type_id":"genre/naked-apron","type_name":"裸エプロン"},{"type_id":"genre/nantai","type_name":"軟体"},{"type_id":"genre/virgin","type_name":"処女"},{"type_id":"genre/defecation","type_name":"脱糞"},{"type_id":"genre/nurse","type_name":"看護婦"},{"type_id":"genre/cruel-expression","type_name":"残虐表現"},{"type_id":"genre/body-conscious","type_name":"ボディコン"},{"type_id":"genre/nose-hook","type_name":"鼻フック"},{"type_id":"genre/queen","type_name":"女王様"},{"type_id":"genre/kimono","type_name":"浴衣・着物"},{"type_id":"genre/rinkan","type_name":"輪姦"},{"type_id":"genre/interview","type_name":"面接"},{"type_id":"genre/tickling","type_name":"くすぐり"},{"type_id":"genre/mom-friends","type_name":"ママ友"},{"type_id":"genre/fisting","type_name":"フィスト"},{"type_id":"genre/beautiful-woman","type_name":"美女"},{"type_id":"genre/other-asian","type_name":"アジア女優"},{"type_id":"genre/rimjob","type_name":"アナル舐め"},{"type_id":"genre/seitenka-jotaika","type_name":"性転換・女体化"},{"type_id":"genre/catgirl","type_name":"ネコミミ・獣系"},{"type_id":"genre/masked","type_name":"覆面・マスク"},{"type_id":"genre/loose-socks","type_name":"ルーズソックス"},{"type_id":"genre/kimono-mourning","type_name":"和服、喪服"},{"type_id":"genre/ai-generated-artwork","type_name":"AI生成作品"},{"type_id":"genre/otaku","type_name":"オタク"},{"type_id":"genre/dark-system","type_name":"ダーク系"},{"type_id":"genre/fighting-action","type_name":"アクション・格闘"},{"type_id":"genre/hanayome-wakadzuma","type_name":"花嫁、若妻"},{"type_id":"genre/debut-work","type_name":"デビュー作"},{"type_id":"genre/waitress","type_name":"ウェイトレス"},{"type_id":"genre/yoga","type_name":"ヨガ"},{"type_id":"genre/streaming","type_name":"ストリーミング対応"},{"type_id":"genre/bloomers","type_name":"ブルマ"},{"type_id":"genre/manko-zukan","type_name":"マンコ図鑑"},{"type_id":"genre/20s","type_name":"20代"},{"type_id":"genre/grandma","type_name":"お婆ちゃん"},{"type_id":"genre/cheerleader","type_name":"チアガール"},{"type_id":"genre/hard","type_name":"ハード系"},{"type_id":"genre/cleaning-blow","type_name":"お掃除フェラ"},{"type_id":"genre/fetish","type_name":"フェチ"},{"type_id":"genre/40s","type_name":"40代"},{"type_id":"genre/knee-high-boots","type_name":"ロングブーツ"},{"type_id":"genre/receptionist","type_name":"受付嬢"},{"type_id":"genre/chikan","type_name":"痴漢"},{"type_id":"genre/celebrity","type_name":"セレブ"},{"type_id":"genre/candle","type_name":"蝋燭"},{"type_id":"genre/gyagu-komedi","type_name":"ギャグ・コメディ"},{"type_id":"genre/princess-story","type_name":"極上泡姫物語"},{"type_id":"genre/saimin","type_name":"催眠"},{"type_id":"genre/swimsuit-school","type_name":"スクール水着"},{"type_id":"genre/futanari","type_name":"ふたなり"},{"type_id":"genre/seiso","type_name":"清楚"},{"type_id":"genre/campaign-girl","type_name":"キャンギャル"},{"type_id":"genre/young-wife","type_name":"若妻"},{"type_id":"genre/intercrural-sex","type_name":"素股"},{"type_id":"genre/omnibus--omnibus","type_name":"総集編・オムニバス"},{"type_id":"genre/china-dress","type_name":"チャイナドレス"},{"type_id":"genre/sophisticated-adult-healing-pavilion","type_name":"洗練された大人のいやし亭"},{"type_id":"genre/insult","type_name":"罵倒"},{"type_id":"genre/female-soldier","type_name":"女戦士"},{"type_id":"genre/fast-pull-out-best","type_name":"早抜きBEST"},{"type_id":"genre/friends-with-benefits","type_name":"セフレ"},{"type_id":"genre/%EF%BC%93p","type_name":"３P"},{"type_id":"genre/furo","type_name":"風呂"},{"type_id":"genre/look-alike","type_name":"そっくりさん"},{"type_id":"genre/pregnant-woman","type_name":"妊婦"},{"type_id":"genre/kawaii","type_name":"可愛い"},{"type_id":"genre/the-unreleased","type_name":"THE 未公開"},{"type_id":"genre/soap","type_name":"ソープ"},{"type_id":"genre/epuron","type_name":"エプロン"},{"type_id":"genre/debut","type_name":"Debut"},{"type_id":"genre/hattori","type_name":"初撮り"},{"type_id":"genre/over-16-hours","type_name":"16時間以上作品"},{"type_id":"genre/experience-confession","type_name":"体験告白"},{"type_id":"genre/fighter","type_name":"格闘家"},{"type_id":"genre/reprint","type_name":"復刻"},{"type_id":"genre/clothes","type_name":"着衣"},{"type_id":"genre/ntr","type_name":"NTR"},{"type_id":"genre/abandoned","type_name":"放置"},{"type_id":"genre/vip","type_name":"VIP"},{"type_id":"genre/nasty","type_name":"淫乱"},{"type_id":"genre/shuchi-purei","type_name":"羞恥プレイ"},{"type_id":"genre/lady","type_name":"お嬢様"},{"type_id":"genre/model","type_name":"モデル系"},{"type_id":"genre/shave","type_name":"剃毛"},{"type_id":"genre/doll","type_name":"ドール"},{"type_id":"genre/big-breasts","type_name":"爆乳"},{"type_id":"genre/dod","type_name":"2010年代後半（DOD）"},{"type_id":"genre/sf","type_name":"SF"},{"type_id":"genre/brush-down","type_name":"筆おろし"},{"type_id":"genre/netorare","type_name":"ネトラレ"},{"type_id":"genre/woman-slutty","type_name":"この女、ふしだら。"},{"type_id":"genre/gay","type_name":"ゲイ"},{"type_id":"genre/beauty","type_name":"美人"},{"type_id":"genre/kunoichi","type_name":"くノ一"},{"type_id":"genre/summer-nude","type_name":"サマーヌード"},{"type_id":"genre/yagairode","type_name":"野外露出"},{"type_id":"genre/anthology","type_name":"アンソロジー"},{"type_id":"genre/shower","type_name":"シャワー"},{"type_id":"genre/wakai","type_name":"若い"},{"type_id":"genre/bus-guide","type_name":"バスガイド"},{"type_id":"genre/irama","type_name":"イラマ"},{"type_id":"genre/sm-restraint","type_name":"SM拘束"},{"type_id":"genre/companion","type_name":"コンパニオン"},{"type_id":"genre/collaborative-work","type_name":"コラボ作品"},{"type_id":"genre/oil-play","type_name":"オイルプレイ"},{"type_id":"genre/g-cup","type_name":"Gカップ"},{"type_id":"genre/drunk","type_name":"泥酔"},{"type_id":"genre/being-taken-asleep","type_name":"寝取られ"},{"type_id":"genre/actress-soul","type_name":"女優魂"},{"type_id":"genre/shokushu","type_name":"触手"},{"type_id":"genre/classic","type_name":"クラシック"},{"type_id":"genre/priestess","type_name":"巫女"},{"type_id":"genre/50s","type_name":"50代"},{"type_id":"genre/cute","type_name":"かわいい"},{"type_id":"genre/3d","type_name":"3D"},{"type_id":"genre/coprophagy","type_name":"食糞"},{"type_id":"genre/wafuku","type_name":"和服"},{"type_id":"genre/outflow","type_name":"流出"},{"type_id":"genre/ecstasy","type_name":"恍惚"},{"type_id":"genre/boga-x-boga","type_name":"BOGA x BOGA"},{"type_id":"genre/digital-mosaic","type_name":"Digital Mosaic"},{"type_id":"genre/cuckold--cuckold","type_name":"寝取り・寝取られ"},{"type_id":"genre/semen","type_name":"ザーメン"},{"type_id":"genre/breaststroke","type_name":"胸射"},{"type_id":"genre/naked","type_name":"全裸"},{"type_id":"genre/fellatio","type_name":"フェラチオ"},{"type_id":"genre/swallowing","type_name":"精飲"},{"type_id":"genre/cleaning-blowjob","type_name":"掃除フェラ"},{"type_id":"genre/dainamaito","type_name":"ダイナマイト"},{"type_id":"genre/delivery-health-lady","type_name":"デリヘル嬢"},{"type_id":"genre/belochu","type_name":"ベロチュー"},{"type_id":"genre/f-cup","type_name":"Fカップ"},{"type_id":"genre/baby-face","type_name":"童顔"},{"type_id":"genre/jd","type_name":"JD"},{"type_id":"genre/princess","type_name":"お姫様"},{"type_id":"genre/female-hot-continent","type_name":"女熱大陸"},{"type_id":"genre/taiwan-model","type_name":"台湾モデル"},{"type_id":"genre/shame-humiliation","type_name":"羞恥・辱め"},{"type_id":"genre/butterfly","type_name":"蝶が如く"},{"type_id":"genre/new-employee-job","type_name":"新入社員のお仕事"},{"type_id":"genre/roshutsu","type_name":"露出"},{"type_id":"genre/lucky-bag","type_name":"福袋"},{"type_id":"genre/landlady","type_name":"女将、女主人"},{"type_id":"genre/pillow-business","type_name":"枕営業"},{"type_id":"genre/hatsuura","type_name":"初裏"},{"type_id":"genre/anaru-zukan","type_name":"アナル図鑑"},{"type_id":"genre/kurokami-rongu","type_name":"黒髪ロング"},{"type_id":"genre/sexy-actress-encyclopedia","type_name":"セクシー女優エンサイクロペディア"},{"type_id":"genre/bristle","type_name":"剛毛"},{"type_id":"genre/dirty-blame","type_name":"淫語責め"},{"type_id":"genre/frustration","type_name":"欲求不満"},{"type_id":"genre/henshin-hiroin","type_name":"変身ヒロイン"},{"type_id":"genre/chippai","type_name":"ちっぱい"},{"type_id":"genre/horror","type_name":"ホラー"},{"type_id":"genre/promiscuity","type_name":"Promiscuity"},{"type_id":"genre/panties","type_name":"パンティ"},{"type_id":"genre/small-breasts","type_name":"貧乳"},{"type_id":"genre/4p","type_name":"４P"},{"type_id":"genre/nekomimi","type_name":"ネコミミ"},{"type_id":"genre/sokui","type_name":"側位"},{"type_id":"genre/outdoor-sex","type_name":"青姦"},{"type_id":"genre/eichikappu","type_name":"Hカップ"},{"type_id":"genre/2-ana-seme","type_name":"2穴責め"},{"type_id":"genre/besuto-omunibasu","type_name":"ベスト/オムニバス"},{"type_id":"genre/office","type_name":"オフィス"},{"type_id":"genre/teen-18","type_name":"10代 (18+)"}];

// 后端：javideo.net（自研 CMS，VM 直连无 CF 墙）。移植自 mira-cat 蜘蛛
// javideo.js。播放优先级与蜘蛛一致：S-VIP（站方自营链）> SW（vidhide 系，
// 走已部署的 javideo-vidhide Worker 全链）> LLS（LuluStream，同走 Worker）
// > STAPE（robotlink 拼装 get_video 直链，设备出口铸造自洽）。
// DSTR（DoodStream 马甲）点播前强制 Turnstile 人机验证，蜘蛛与模块都不收。
// REX 详情只承载一条 videoUrl：按上面优先级取第一条能解析出的线。

var SITE = "https://javideo.net";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
var REFERER = SITE + "/";
var JAVIDEO_WORKER = "https://javideo-vidhide.li768435813.workers.dev";

var CATMAP = {};
for (var _ci = 0; _ci < CATS_DATA.length; _ci++) CATMAP[CATS_DATA[_ci].type_id] = CATS_DATA[_ci];

function t(v) { return String(v == null ? "" : v).trim(); }
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
    .replace(/\s+/g, " ");
}
function fixUrl(u) {
  u = t(u);
  if (!u) return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return SITE + u;
  return u;
}
// 相对地址拼接（替代 new URL 的常见用法）
function resolveUrl(raw, base) {
  var s = t(raw).replace(/\\\//g, "/");
  if (/^https?:\/\//i.test(s)) return s;
  if (s.indexOf("//") === 0) return "https:" + s;
  var bm = String(base || SITE).match(/^(https?:\/\/[^/]+)(\/[^?#]*)?/);
  var origin = bm ? bm[1] : SITE;
  if (s.charAt(0) === "/") return origin + s;
  var dir = bm && bm[2] ? bm[2].replace(/[^/]*$/, "") : "/";
  return origin + dir + s;
}

// ---------- 抓取 ----------
async function getText(url, headers, minLen, timeoutMs) {
  var h = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ja,en-US;q=0.8,en;q=0.7",
    "Referer": REFERER
  };
  if (headers) for (var k in headers) h[k] = headers[k];
  try {
    var res = await Widget.http.get(url, { headers: h, timeout: timeoutMs || 15000 });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : "") : "";
    if (body.length >= (minLen || 0)) return body;
  } catch (e) { /* ignore */ }
  return "";
}
// POST JSON（getPlayer 用）；运行时需提供 Widget.http.post
async function postJson(url, obj, headers, timeoutMs) {
  if (!Widget.http || typeof Widget.http.post !== "function") return null;
  var h = {
    "User-Agent": UA,
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "Referer": REFERER
  };
  if (headers) for (var k in headers) h[k] = headers[k];
  function pick(data) {
    if (!data) return null;
    var j = data;
    if (typeof j === "string") { try { j = JSON.parse(j); } catch (e) { return null; } }
    return j && typeof j === "object" ? j : null;
  }
  try {
    var res = await Widget.http.post(url, JSON.stringify(obj), { headers: h, timeout: timeoutMs || 25000 });
    var j = pick(res && res.data);
    if (j) return j;
  } catch (e) { /* ignore */ }
  return null;
}

// ---------- 列表 ----------
function parseCards(html) {
  var out = [];
  var seen = {};
  var parts = String(html || "").split('<div class="card card--big">');
  for (var i = 1; i < parts.length; i++) {
    var chunk = parts[i].slice(0, 3500);
    var linkM = chunk.match(/card__title"><a href="(https:\/\/javideo\.net\/[^"]+)"[^>]*title="([^"]*)"/) ||
                chunk.match(/card__title"><a href="(https:\/\/javideo\.net\/[^"]+)"[^>]*>([^<]*)</);
    if (!linkM) continue;
    var durl = linkM[1];
    var rest = durl.slice(SITE.length + 1);
    if (!rest || rest.indexOf("/") >= 0) continue; // 只收单段 slug 的视频页
    if (seen[durl]) continue;
    seen[durl] = 1;
    var pic = "";
    var imgM = chunk.match(/data-src="(https:[^"]+)"/) || chunk.match(/<img[^>]+src="(https:[^"]+)"/);
    if (imgM && !/default-cover/.test(imgM[1])) pic = imgM[1];
    var codeM = chunk.match(/card__category"><a[^>]*>([^<]+)</);
    var cover = fixUrl(pic);
    out.push({
      id: durl,
      type: "url",
      title: clean(linkM[2]) || durl,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      link: durl,
      description: codeM ? clean(codeM[1]) : "",
      mediaType: "movie"
    });
  }
  return out;
}
function listUrl(tid, page) {
  return SITE + "/" + tid + (page > 1 ? "/pg-" + page : "");
}
async function loadList(params) {
  params = params || {};
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  var tid = t(params.cat || params.path || "censored");
  if (!CATMAP[tid]) tid = "censored";
  try {
    var html = await getText(listUrl(tid, page), null, 200, 15000);
    if (!html) return [{ id: "err", type: "url", title: "载入失败：页面为空" }];
    var list = parseCards(html);
    return list.length ? list : [{ id: "empty", type: "url", title: "没有更多内容" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败", description: String((e && e.message) || e) }];
  }
}
// kw 规范化与站方 JS 同规则：小写，空白与 .:;=+ 转 '-'，折叠并去首尾 '-'
function normKw(wd) {
  return t(wd).toLowerCase()
    .replace(/[\s\.:;=+]+/g, "-")
    .replace(/-+-/g, "-")
    .replace(/^-+|-+$/g, "");
}
async function search(params) {
  params = params || {};
  var wd = "";
  var keys = ["keyword", "q", "query", "wd", "key", "search", "text"];
  for (var i = 0; i < keys.length; i++) { if (params[keys[i]]) { wd = t(params[keys[i]]); break; } }
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return [{ id: "tip", type: "url", title: "输入番号或关键词搜索" }];
  var kw = normKw(wd);
  if (!kw) return [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  try {
    var html = await getText(listUrl("search/" + encodeURIComponent(kw), page), null, 200, 15000);
    var list = html ? parseCards(html) : [];
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败", description: String((e && e.message) || e) }];
  }
}

// ---------- 详情/播放 ----------
// 播放入口：.episodeShow 内 button[data-id]=集数id，文本=线路名；
// DSTR 跳过（Turnstile 门禁）。顺序 S-VIP > SW > LLS > STAPE。
function extractLines(html) {
  var i = html.indexOf("episodeShow");
  var region = i >= 0 ? html.slice(i, i + 4000) : "";
  var found = [];
  var re = /<button data-id="(\d+)"[^>]*>([^<]+)<\/button>/g;
  var m;
  while ((m = re.exec(region)) !== null) {
    var label = clean(m[2]).toUpperCase();
    var kind = "";
    if (label.indexOf("S-VIP") === 0) kind = "v";
    else if (label.indexOf("SW") === 0) kind = "w";
    else if (label.indexOf("LLS") === 0) kind = "l";
    else if (label.indexOf("STAPE") === 0) kind = "t";
    else continue;
    var dup = false;
    for (var j = 0; j < found.length; j++) if (found[j].kind === kind) { dup = true; break; }
    if (!dup) found.push({ kind: kind, epi: m[1] });
  }
  var order = { v: 0, w: 1, l: 2, t: 3 };
  found.sort(function (a, b) { return order[a.kind] - order[b.kind]; });
  return found;
}
// 集数id → embed 地址（站方官方接口，与网页按钮点击同一调用）
async function getEmbed(epi, durl) {
  var j = await postJson(SITE + "/api/movie/getPlayer", { id: String(epi) }, { "Referer": durl || REFERER });
  if (!j) return "";
  var u = t(j.data).replace(/\\\//g, "/");
  return /^https?:\/\//.test(u) ? u : "";
}
// S-VIP：embed uuid → 签名 token → /v/{t}。REX 拿不到 302 的 Location，
// 直接把 /v/{t} 交播放器并带 Referer=embed 页（蜘蛛 isV 兜底同款形态，
// 播放器自跟 302 到签名 playlist）。返回 {url, referer} 或 null。
async function resolveSvip(embedUrl) {
  var mm = String(embedUrl).match(/^(https?:\/\/[^/]+)\/embed\/([^/?#]+)/);
  if (!mm) return null;
  var origin = mm[1], uuid = mm[2];
  var tokTxt = await getText(origin + "/api/playlist-token/" + encodeURIComponent(uuid),
    { "Accept": "application/json", "Referer": embedUrl }, 10, 15000);
  var tok = "";
  if (tokTxt) { try { tok = t(JSON.parse(tokTxt).t); } catch (e) { /* ignore */ } }
  if (!tok) return null;
  return { url: origin + "/v/" + encodeURIComponent(tok), referer: embedUrl };
}
// vidhide 系 packer 纯字符串解包（与 Worker 同算法）
function jsUnescapeSingle(s) {
  return s.replace(/\\(.)/g, function (mm, c) {
    if (c === "n") return "\n";
    if (c === "r") return "\r";
    if (c === "t") return "\t";
    return c;
  });
}
function unpackDeanEdwards(html) {
  var m = String(html || "").match(/eval\(function\(p,a,c,k,e,d\)[\s\S]*?\}\s*\(\s*'((?:[^'\\]|\\.)*)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:[^'\\]|\\.)*)'\.split\('\|'\)/);
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
function extractStreamCandidates(html, embedUrl) {
  var text = unpackDeanEdwards(html) || String(html || "");
  var links = {};
  var re = /"hls(\d+)"\s*:\s*"([^"]+)"/g;
  var m;
  while ((m = re.exec(text)) !== null) links["hls" + m[1]] = m[2];
  var out = [];
  var keys = ["hls4", "hls3", "hls2"];
  for (var i = 0; i < keys.length; i++) {
    var raw = links[keys[i]];
    if (!raw) continue;
    var abs = resolveUrl(raw, embedUrl);
    if (abs && out.indexOf(abs) < 0) out.push(abs);
  }
  if (!out.length) {
    var f = text.match(/"file"\s*:\s*"(https?:[^"]+\.m3u8[^"]*)"/) || text.match(/(https?:\/\/[^\s"'\\]+\.m3u8[^\s"'\\]*)/);
    if (f) { var abs2 = resolveUrl(f[1], embedUrl); if (abs2) out.push(abs2); }
  }
  return out;
}
// SW/LLS：Worker 全链优先（校验 /v 确为列表才用），不通时回退模块内
// 解包直解（候选逐个校验）。返回 {url, referer} 或 null。
async function resolveVidhideLike(embedUrl, durl) {
  var wurl = JAVIDEO_WORKER + "/v?u=" + encodeURIComponent(embedUrl) + "&r=" + encodeURIComponent(durl || REFERER);
  var txt = await getText(wurl, {}, 20, 25000);
  if (txt && txt.indexOf("#EXTM3U") >= 0) return { url: wurl, referer: REFERER };
  var html = await getText(embedUrl, { "Referer": durl || REFERER }, 1000, 12000);
  if (html) {
    var cands = extractStreamCandidates(html, embedUrl);
    for (var i = 0; i < cands.length; i++) {
      var pl = await getText(cands[i], { "Referer": embedUrl }, 5, 10000);
      if (pl && pl.indexOf("#EXTM3U") >= 0) return { url: cands[i], referer: embedUrl };
    }
    if (cands.length) return { url: cands[0], referer: embedUrl };
  }
  return null;
}
// Streamtape robotlink 拼装复现（静态 div 是诱饵，取真 get_video 地址）
function resolveRobotlink(html) {
  var s = String(html || "");
  var els = ["robotlink", "botlink", "ideoolink"];
  for (var i = 0; i < els.length; i++) {
    var re = new RegExp("getElementById\\('" + els[i] + "'\\)\\.innerHTML\\s*=\\s*'([^']*)'\\s*(?:\\+\\s*\\(\\s*'([^']*)'\\s*\\)\\s*((?:\\.substring\\(\\d+\\))*))?");
    var m = s.match(re);
    if (!m) continue;
    var out = m[1];
    if (m[2]) {
      var d = m[2];
      var sre = /\.substring\((\d+)\)/g;
      var sm;
      while ((sm = sre.exec(m[3] || "")) !== null) d = d.substring(parseInt(sm[1], 10));
      out += d;
    }
    out = out.replace(/^\/\//, "https://").replace(/^\//, "https:/");
    if (/get_video\?/.test(out)) return out;
  }
  return "";
}
async function resolveStape(embedUrl, durl) {
  var html = await getText(embedUrl, { "Referer": durl || REFERER }, 1000, 12000);
  if (html) {
    var link = resolveRobotlink(html);
    if (link) return { url: link, referer: embedUrl };
  }
  return null;
}

async function loadDetail(link) {
  var durl = fixUrl(String(link || ""));
  try {
    var html = await getText(durl, null, 200, 15000);
    if (!html) return { id: durl, type: "url", title: "载入失败", description: "详情页为空" };
    var name = "";
    var h1M = html.match(/<h1 class="section__title">([\s\S]*?)<\/h1>/);
    if (h1M) name = clean(h1M[1]);
    if (!name) {
      var ogM = html.match(/<meta property="og:title" content="([^"]+)"/);
      if (ogM) name = clean(ogM[1]);
    }
    var pic = "";
    var ogiM = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (ogiM) pic = fixUrl(ogiM[1]);
    if (!pic) {
      var fpM = html.match(/<img class="fp-poster" src="([^"]+)"/);
      if (fpM) pic = fixUrl(fpM[1]);
    }
    var lines = extractLines(html);
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];
      var embed = await getEmbed(ln.epi, durl);
      if (!embed) continue;
      var r = null;
      if (ln.kind === "v") r = await resolveSvip(embed);
      else if (ln.kind === "w" || ln.kind === "l") r = await resolveVidhideLike(embed, durl);
      else if (ln.kind === "t") r = await resolveStape(embed, durl);
      if (r && r.url) {
        return {
          id: durl,
          type: "detail",
          title: name || durl,
          link: durl,
          posterPath: pic,
          coverUrl: pic,
          backdropPath: pic,
          videoUrl: r.url,
          playerType: "app",
          customHeaders: { "User-Agent": UA, "Referer": r.referer || REFERER }
        };
      }
    }
    return {
      id: durl,
      type: "url",
      title: name || durl,
      description: "未找到播放地址",
      posterPath: pic,
      coverUrl: pic,
      link: durl
    };
  } catch (e) {
    return { id: durl, type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}
