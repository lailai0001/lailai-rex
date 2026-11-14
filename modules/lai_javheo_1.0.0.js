// JavHeo for REX (lai_javheo v1.0.0)
// 移植自 mira-cat 蜘蛛 py_javheo.js（只读蓝图），站 https://javheo.com/。
// 播放链（4 步，站方无直链）：详情页 -> POST /hash-javheo {mix:"moviesiframe2", num:<id>}
//   -> iframe https://javheo-com.ibhan2.top/iframe/v1/<hash>/<b64>
//   -> 内含 /iframe/convert/v1/<hash>/<b64> 第二层
//   -> Artplayer quality[] 直给 OK.ru mp4 四档 360p/480p/720p/1080p（720P 为默认档）。
// 签名 URL 含 expires/srcIp（有效期约 2 天）；详情已解过则进内存缓存（TTL 10 分钟），
// 点播直接复用，不重跑 4 步链（重跑 16-27 秒会超 App 等待致一直转圈）；缓存未命中才重解，
// hash POST 失败重试一次。档位一律按分辨率降序（1080p 第一位）。
// 分类：最新 + 17 个标签分类，每顶级下挂 66 个标签筛选卡片；标签分类页单页 50 条无翻页。
// 搜索：站内搜索框同款 /porn/<slug>/（空格转 -、去非 alnum、小写）；/?s= 恒回随机内容，不用。

WidgetMetadata = {
  id: "lai_javheo",
  title: "JavHeo",
  description: "JavHeo：最新 + 17 标签分类，66 标签筛选，详情现解 OK.ru 四档 mp4（1080p/720p/480p/360p）",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://javheo.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "latest" }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "JAV", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "jav" }, { name: "sub", title: "标签", type: "enumeration", value: "jav", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "无码", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "uncensored" }, { name: "sub", title: "标签", type: "enumeration", value: "uncensored", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "FC2", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "fc2" }, { name: "sub", title: "标签", type: "enumeration", value: "fc2", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "日本", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "japanese" }, { name: "sub", title: "标签", type: "enumeration", value: "japanese", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "亚洲", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "asian" }, { name: "sub", title: "标签", type: "enumeration", value: "asian", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "中国", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "chinese" }, { name: "sub", title: "标签", type: "enumeration", value: "chinese", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "少女", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "teen-porn" }, { name: "sub", title: "标签", type: "enumeration", value: "teen-porn", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "熟女", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "milf" }, { name: "sub", title: "标签", type: "enumeration", value: "milf", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "big-tits" }, { name: "sub", title: "标签", type: "enumeration", value: "big-tits", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "校园女生", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "schoolgirl" }, { name: "sub", title: "标签", type: "enumeration", value: "schoolgirl", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "housewife" }, { name: "sub", title: "标签", type: "enumeration", value: "housewife", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "按摩", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "massage" }, { name: "sub", title: "标签", type: "enumeration", value: "massage", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "女同", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "lesbian" }, { name: "sub", title: "标签", type: "enumeration", value: "lesbian", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "肛交", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "anal" }, { name: "sub", title: "标签", type: "enumeration", value: "anal", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "中出", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "creampie" }, { name: "sub", title: "标签", type: "enumeration", value: "creampie", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "动漫", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "hentai" }, { name: "sub", title: "标签", type: "enumeration", value: "hentai", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "Heyzo", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "heyzo" }, { name: "sub", title: "标签", type: "enumeration", value: "heyzo", enumOptions: [{"name": "anal", "value": "anal"}, {"name": "asian", "value": "asian"}, {"name": "asiansexdiary", "value": "asiansexdiary"}, {"name": "bangbros", "value": "bangbros"}, {"name": "bban", "value": "bban"}, {"name": "bbw", "value": "bbw"}, {"name": "bdsm", "value": "bdsm"}, {"name": "big tits", "value": "big-tits"}, {"name": "blacked", "value": "blacked"}, {"name": "blackedraw", "value": "blackedraw"}, {"name": "brazzers", "value": "brazzers"}, {"name": "bukkake", "value": "bukkake"}, {"name": "chinese", "value": "chinese"}, {"name": "creampie", "value": "creampie"}, {"name": "cumshot", "value": "cumshot"}, {"name": "czech", "value": "czech"}, {"name": "dasd", "value": "dasd"}, {"name": "ddfnetwork", "value": "ddfnetwork"}, {"name": "deepthroat", "value": "deepthroat"}, {"name": "defloration", "value": "defloration"}, {"name": "digital mosaic", "value": "digital-mosaic"}, {"name": "digitalplayground", "value": "digitalplayground"}, {"name": "dickdrainers", "value": "dickdrainers"}, {"name": "ebony", "value": "ebony"}, {"name": "family", "value": "family"}, {"name": "fc2", "value": "fc2"}, {"name": "gangbang", "value": "gangbang"}, {"name": "girlsdoporn", "value": "girlsdoporn"}, {"name": "group sex", "value": "group-sex"}, {"name": "hentai", "value": "hentai"}, {"name": "heyzo", "value": "heyzo"}, {"name": "housewife", "value": "housewife"}, {"name": "japan", "value": "japan"}, {"name": "japanese", "value": "japanese"}, {"name": "jav", "value": "jav"}, {"name": "julesjordan", "value": "julesjordan"}, {"name": "lesbian", "value": "lesbian"}, {"name": "lisa ann", "value": "lisa-ann"}, {"name": "married woman", "value": "married-woman"}, {"name": "massage", "value": "massage"}, {"name": "meyd", "value": "meyd"}, {"name": "milf", "value": "milf"}, {"name": "mom", "value": "mom"}, {"name": "naughty america", "value": "naughty-america"}, {"name": "niksindian", "value": "niksindian"}, {"name": "nurse", "value": "nurse"}, {"name": "office", "value": "office"}, {"name": "pervmom", "value": "pervmom"}, {"name": "pornstar", "value": "pornstar"}, {"name": "pppd", "value": "pppd"}, {"name": "public", "value": "public"}, {"name": "school", "value": "school"}, {"name": "schoolgirl", "value": "schoolgirl"}, {"name": "squirt", "value": "squirt"}, {"name": "ssis", "value": "ssis"}, {"name": "ssni", "value": "ssni"}, {"name": "stepmom", "value": "stepmom"}, {"name": "stockings", "value": "stockings"}, {"name": "teacher porn", "value": "teacher-porn"}, {"name": "teen porn", "value": "teen-porn"}, {"name": "thai", "value": "thai"}, {"name": "tushy", "value": "tushy"}, {"name": "uncensored", "value": "uncensored"}, {"name": "vixen", "value": "vixen"}, {"name": "wife", "value": "wife"}, {"name": "woodmancastingx", "value": "woodmancastingx"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://javheo.com";
var IFRAME_HOST = "https://javheo-com.ibhan2.top";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/604.1.14 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1";

// 标签全表（站内侧栏 Categories 65 个 + /porn/ 索引页 dickdrainers，共 66 个）
var TAGS = [{"n": "anal", "v": "anal"}, {"n": "asian", "v": "asian"}, {"n": "asiansexdiary", "v": "asiansexdiary"}, {"n": "bangbros", "v": "bangbros"}, {"n": "bban", "v": "bban"}, {"n": "bbw", "v": "bbw"}, {"n": "bdsm", "v": "bdsm"}, {"n": "big tits", "v": "big-tits"}, {"n": "blacked", "v": "blacked"}, {"n": "blackedraw", "v": "blackedraw"}, {"n": "brazzers", "v": "brazzers"}, {"n": "bukkake", "v": "bukkake"}, {"n": "chinese", "v": "chinese"}, {"n": "creampie", "v": "creampie"}, {"n": "cumshot", "v": "cumshot"}, {"n": "czech", "v": "czech"}, {"n": "dasd", "v": "dasd"}, {"n": "ddfnetwork", "v": "ddfnetwork"}, {"n": "deepthroat", "v": "deepthroat"}, {"n": "defloration", "v": "defloration"}, {"n": "digital mosaic", "v": "digital-mosaic"}, {"n": "digitalplayground", "v": "digitalplayground"}, {"n": "dickdrainers", "v": "dickdrainers"}, {"n": "ebony", "v": "ebony"}, {"n": "family", "v": "family"}, {"n": "fc2", "v": "fc2"}, {"n": "gangbang", "v": "gangbang"}, {"n": "girlsdoporn", "v": "girlsdoporn"}, {"n": "group sex", "v": "group-sex"}, {"n": "hentai", "v": "hentai"}, {"n": "heyzo", "v": "heyzo"}, {"n": "housewife", "v": "housewife"}, {"n": "japan", "v": "japan"}, {"n": "japanese", "v": "japanese"}, {"n": "jav", "v": "jav"}, {"n": "julesjordan", "v": "julesjordan"}, {"n": "lesbian", "v": "lesbian"}, {"n": "lisa ann", "v": "lisa-ann"}, {"n": "married woman", "v": "married-woman"}, {"n": "massage", "v": "massage"}, {"n": "meyd", "v": "meyd"}, {"n": "milf", "v": "milf"}, {"n": "mom", "v": "mom"}, {"n": "naughty america", "v": "naughty-america"}, {"n": "niksindian", "v": "niksindian"}, {"n": "nurse", "v": "nurse"}, {"n": "office", "v": "office"}, {"n": "pervmom", "v": "pervmom"}, {"n": "pornstar", "v": "pornstar"}, {"n": "pppd", "v": "pppd"}, {"n": "public", "v": "public"}, {"n": "school", "v": "school"}, {"n": "schoolgirl", "v": "schoolgirl"}, {"n": "squirt", "v": "squirt"}, {"n": "ssis", "v": "ssis"}, {"n": "ssni", "v": "ssni"}, {"n": "stepmom", "v": "stepmom"}, {"n": "stockings", "v": "stockings"}, {"n": "teacher porn", "v": "teacher-porn"}, {"n": "teen porn", "v": "teen-porn"}, {"n": "thai", "v": "thai"}, {"n": "tushy", "v": "tushy"}, {"n": "uncensored", "v": "uncensored"}, {"n": "vixen", "v": "vixen"}, {"n": "wife", "v": "wife"}, {"n": "woodmancastingx", "v": "woodmancastingx"}];

function t(v) {
  return String(v == null ? "" : v).trim();
}

function decodeHtml(s) {
  return t(s)
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); })
    .replace(/&#x([0-9a-fA-F]+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 16)); });
}

function cleanText(s) {
  return decodeHtml(t(String(s || "").replace(/<[^>]*>/g, " ")));
}

function absUrl(u) {
  u = t(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.charAt(0) === "/") return HOST + u;
  return HOST + "/" + u;
}

function getHtml(url, referer) {
  return Widget.http.get(url, {
    headers: { "User-Agent": UA, "Referer": referer || HOST + "/" }
  })
    .then(function (res) {
      var d = res && res.data;
      return d != null ? (typeof d === "string" ? d : JSON.stringify(d)) : "";
    })
    .catch(function () { return ""; });
}

function postForm(url, fields, referer) {
  var body = [];
  for (var k in fields) {
    if (Object.prototype.hasOwnProperty.call(fields, k)) {
      body.push(encodeURIComponent(k) + "=" + encodeURIComponent(fields[k]));
    }
  }
  return Widget.http.post(url, body.join("&"), {
    headers: {
      "User-Agent": UA,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      "Referer": referer || HOST + "/"
    }
  })
    .then(function (res) {
      var d = res && res.data;
      return d != null ? (typeof d === "string" ? d : JSON.stringify(d)) : "";
    })
    .catch(function () { return ""; });
}

// 列表解析：<a href="/watch/<id>"> 卡片，内含 img 封面与标题文本
function parseList(html) {
  var out = [];
  var seen = {};
  if (!html) return out;
  var re = /<a[^>]*href="\/watch\/([A-Za-z0-9]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var id = m[1];
    if (!id || seen[id]) continue;
    var body = m[2] || "";
    var title = cleanText(body);
    if (!title) continue;
    var im = body.match(/<img[^>]+src="([^"]+)"/i);
    var cm = title.match(/([A-Za-z]{2,10}-?\d{3,8}[A-Za-z]?)/);
    seen[id] = 1;
    out.push({
      id: HOST + "/watch/" + id,
      type: "url",
      title: title,
      posterPath: im ? im[1] : "",
      coverUrl: im ? im[1] : "",
      backdropPath: im ? im[1] : "",
      link: HOST + "/watch/" + id,
      description: cm ? cm[1] : "",
      mediaType: "movie"
    });
  }
  return out;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

// 标签分类页单页 50 条、无翻页：p>1 直接空
async function tagPage(tag, page) {
  if (page > 1) return emptyItem();
  var html = await getHtml(HOST + "/porn/" + tag + "/");
  var list = parseList(html);
  return list.length ? list : emptyItem();
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || "latest");
  var sub = t(params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    // 筛选卡片值本身定路径（与当前顶级无关）
    var tag = null;
    for (var i = 0; i < TAGS.length; i++) {
      if (TAGS[i].v === sub) { tag = TAGS[i].v; break; }
    }
    if (tag) return tagPage(tag, page);
    // 顶级标签分类：/porn/<tag>/ 单页
    if (zone !== "latest") {
      for (var j = 0; j < TAGS.length; j++) {
        if (TAGS[j].v === zone) return tagPage(TAGS[j].v, page);
      }
    }
    var url = page <= 1 ? HOST + "/" : HOST + "/page/" + page + "/";
    var html = await getHtml(url);
    var list = parseList(html);
    return list.length ? list : emptyItem();
  } catch (e) {
    return [{ id: "err", type: "url", title: "载入失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

// 搜索走站内搜索框同款：/porn/<slug>/（空格转 -、去非 alnum、小写）
function slugifyQuery(wd) {
  var s = t(wd).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9_-]/g, "");
  s = s.toLowerCase().replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  return s;
}

async function search(params) {
  params = params || {};
  var wd = t(params.keyword || params.wd || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  if (!wd) return emptyItem("请输入关键词");
  var slug = slugifyQuery(wd);
  if (!slug) return emptyItem("请输入关键词");
  if (page > 1) return emptyItem();
  try {
    var html = await getHtml(HOST + "/porn/" + slug + "/");
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

function normLabel(s) {
  var l = t(s).toLowerCase();
  if (/^\d+$/.test(l)) l += "p";
  return l;
}

function resNum(label) {
  var m = String(label || "").match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

// 播放链解析缓存：详情已跑过链，点播直接复用，不重跑 4 步（TTL 10 分钟，签名 URL 有效期约 2 天）
var RESOLVE_TTL = 10 * 60 * 1000;
var resolveCache = {};
var resolveCacheKeys = [];

function cacheGet(watchId) {
  var ent = resolveCache[watchId];
  if (ent && Date.now() - ent.ts < RESOLVE_TTL && ent.chain.qualities.length) return ent.chain;
  return null;
}

function cacheSet(watchId, chain) {
  resolveCache[watchId] = { ts: Date.now(), chain: chain };
  resolveCacheKeys.push(watchId);
  if (resolveCacheKeys.length > 200) {
    var old = resolveCacheKeys.shift();
    delete resolveCache[old];
  }
}

// 播放链现解：POST hash-javheo -> iframe v1 -> convert 页 -> Artplayer quality[]
// 返回 { qualities: [{ label, url }]（分辨率降序）, defaultLabel, convertUrl }
async function resolvePlay(watchId, durl) {
  var empty = { qualities: [], defaultLabel: "", convertUrl: "" };
  if (!watchId) return empty;
  var cached = cacheGet(watchId);
  if (cached) return cached;
  // hash POST 曾在 VM 侧超时 abort 过一次，失败重试一次
  var embedHtml = "";
  for (var attempt = 0; attempt < 2 && !embedHtml; attempt++) {
    embedHtml = await postForm(HOST + "/hash-javheo",
      { mix: "moviesiframe2", num: watchId }, durl);
  }
  if (!embedHtml) return empty;
  var im = embedHtml.match(/<iframe[^>]+src="(https?:\/\/javheo-com\.ibhan2\.top\/iframe\/v1\/[^"]+)"/i);
  if (!im) return empty;
  var iframeUrl = im[1];
  var v1Html = await getHtml(iframeUrl, durl);
  if (!v1Html) return empty;
  var cm = v1Html.match(/https?:\/\/javheo-com\.ibhan2\.top(\/iframe\/convert\/v1\/[^"'\\\s]+)/i)
    || v1Html.match(/["'](\/iframe\/convert\/v1\/[^"'\\\s]+)["']/i);
  if (!cm) return empty;
  var convertUrl = IFRAME_HOST + cm[1];
  var convHtml = await getHtml(convertUrl, iframeUrl);
  if (!convHtml) return empty;
  var qualities = [];
  var re = /\{\s*(?:default:\s*true,\s*)?html:\s*'([^']+)'\s*,\s*url:\s*'([^']+)'/g;
  var qm;
  while ((qm = re.exec(convHtml)) !== null) {
    var label = normLabel(qm[1]);
    if (label && qm[2]) {
      var dup = false;
      for (var i = 0; i < qualities.length; i++) {
        if (qualities[i].label === label) { dup = true; break; }
      }
      if (!dup) qualities.push({ label: label, url: qm[2] });
    }
  }
  var dm = convHtml.match(/default:\s*true,\s*html:\s*'([^']+)'/);
  var defaultLabel = dm ? normLabel(dm[1]) : (qualities.length ? qualities[qualities.length - 1].label : "");
  // 档位一律最高在前、依次递减（只列 convert 页实给的档，不编造）
  qualities.sort(function (a, b) { return resNum(b.label) - resNum(a.label); });
  var chain = { qualities: qualities, defaultLabel: defaultLabel, convertUrl: convertUrl };
  if (qualities.length) cacheSet(watchId, chain);
  return chain;
}

function watchIdOf(durl) {
  var m = String(durl || "").match(/\/watch\/([A-Za-z0-9]+)/i);
  return m ? m[1] : "";
}

async function loadDetail(link) {
  try {
    var raw = unwrapLink(link);
    if (!raw) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    if (raw.indexOf("http") !== 0) raw = HOST + raw;
    var watchId = watchIdOf(raw);
    var html = await getHtml(raw);
    if (!html) return { id: raw, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = "";
    var tm = html.match(/<title>([^<]*)<\/title>/i);
    if (tm) {
      name = cleanText(tm[1]).replace(/\s*-\s*Watch JAV.*$/i, "").replace(/\s*-\s*JavHeo.*$/i, "").trim();
    }
    var pic = "";
    var ogm = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    if (ogm) pic = ogm[1];
    if (!pic) {
      var im2 = html.match(/<img[^>]+src="(https:\/\/cdn-img\.ibhan2\.top[^"]+)"/i);
      if (im2) pic = im2[1];
    }
    // 详情现解档位（降序，1080p 在前）；失败则留一条 正片 线，loadResource 里现解
    var lines = [];
    var chain = await resolvePlay(watchId, raw);
    if (chain.qualities.length) {
      for (var i = 0; i < chain.qualities.length; i++) {
        lines.push({ label: chain.qualities[i].label, url: chain.qualities[i].url });
      }
    }
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    if (lines.length) {
      for (var j = 0; j < lines.length; j++) {
        var id = raw + "@@HEO:" + watchId + ":" + lines[j].label;
        eps.push({ name: lines[j].label, link: id });
        seasonEps.push({ title: lines[j].label, videoUrl: lines[j].url, episodeNumber: j + 1 });
        epItems.push({
          id: id,
          type: "url",
          title: lines[j].label,
          mediaType: "movie",
          posterPath: pic,
          videoUrl: lines[j].url,
          link: id,
          episode: j + 1,
          episodeNumber: j + 1,
          seasonIndex: 1,
          seasonNumber: 1,
          playerType: "system",
          customHeaders: { "User-Agent": UA, "Referer": chain.convertUrl || raw }
        });
      }
    } else {
      var id2 = raw + "@@HEO:" + watchId + ":auto";
      eps.push({ name: "正片", link: id2 });
      seasonEps.push({ title: "正片", videoUrl: "", episodeNumber: 1 });
      epItems.push({
        id: id2,
        type: "url",
        title: "正片",
        mediaType: "movie",
        posterPath: pic,
        link: id2,
        episode: 1,
        episodeNumber: 1,
        seasonIndex: 1,
        seasonNumber: 1,
        playerType: "system"
      });
    }
    var result = {
      id: raw,
      type: "detail",
      title: name || watchId,
      name: name || watchId,
      description: "",
      mediaType: "movie",
      link: raw,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app"
    };
    result.episodes = eps;
    result.seasons = [{ seasonNumber: 1, title: "清晰度", name: "清晰度", episodes: seasonEps }];
    result.episodeItems = epItems;
    result.childItems = epItems;
    if (lines.length) result.videoUrl = lines[0].url;
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
  var m = raw.match(/@@HEO:([A-Za-z0-9]+):(.+)$/);
  if (!m) {
    // 直链 mp4
    if (/\.mp4(\?|#|$)/i.test(raw)) {
      return [{ name: "播放", url: raw, playerType: "system", customHeaders: { "User-Agent": UA } }];
    }
    return [];
  }
  var watchId = m[1];
  var want = m[2];
  var durl = HOST + "/watch/" + watchId;
  // 现解（签名 URL 含 expires/srcIp，不复用详情时地址；详情已解过则走缓存）
  var chain = await resolvePlay(watchId, durl);
  if (!chain.qualities.length) return [];
  var hit = null;
  if (want && want !== "auto") {
    for (var i = 0; i < chain.qualities.length; i++) {
      if (chain.qualities[i].label === want) { hit = chain.qualities[i]; break; }
    }
  }
  // 未点名档位（正片线）或档位失配时给最高档，不给站方默认 720p
  if (!hit) hit = chain.qualities[0];
  return [{ name: hit.label, url: hit.url, playerType: "system", customHeaders: { "User-Agent": UA, "Referer": chain.convertUrl || durl } }];
}
