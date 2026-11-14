// JavMove for REX (lai_javmove v1.0.0)
// 移植自 mira-cat 蜘蛛 py_javmove.js（只读蓝图），站 https://javmove.com/。
// 列表 12 条/页；11 顶级分类 + 题材 40 / 制作商 20 两张筛选卡片（不同 key，
// 共用 key 会互冲是猫源 R2 坐实的 bug）。封面取 data-srcset（lazysizes，
// 只取 src 会 11/12 是 1x1 占位 data-URI）。
// 播放三腿（与猫源 v5 同链，用户真机确认可播）：(1) 详情嵌的 token 单次
// /watch 直取 mp4；(2) javmove-fetch Worker /resolve 整链代取；(3) 直连
// part 页现取 data-id 再调 /watch。直链 .cfd/vs/ 走 Worker /stream 包一层。
// 播放头必须带 Connection: keep-alive（猫源 R4 坐实：CF 边缘对 close 的大
// 响应随机掐断，拖进度条冻住）。未上映的片（无格式区、无 token）不给播放按钮。

WidgetMetadata = {
  id: "lai_javmove",
  title: "JavMove",
  description: "JavMove：最新/新发布/即将上映 + 8 热门题材，题材/制作商筛选，详情按格式·分集出线，直链 mp4",
  author: "lai",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  site: "https://javmove.com",
  detailCacheDuration: 180,
  modules: [
    { title: "搜索", functionName: "search", cacheDuration: 60, params: [{ name: "keyword", title: "关键词", type: "input" }, { name: "page", title: "页码", type: "page" }] },
    { title: "最新", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "latest" }, { name: "genre", title: "题材", type: "enumeration", value: "", enumOptions: [{"title": "Solowork", "value": "genres/QxHGjE/solowork"}, {"title": "Creampie", "value": "genres/GVWkCw/creampie"}, {"title": "Big Tits", "value": "genres/BJiygps/big-tits"}, {"title": "Married Woman", "value": "genres/BcEqYww/married-woman"}, {"title": "Mature Woman", "value": "genres/DFiQTPU/mature-woman"}, {"title": "Beautiful Girl", "value": "genres/Ljbfjc/beautiful-girl"}, {"title": "4HR+", "value": "genres/ogWFog/4hr"}, {"title": "Slut", "value": "genres/BMPngcQ/slut"}, {"title": "Amateur", "value": "genres/BHCJmMg/amateur"}, {"title": "Blow", "value": "genres/CHihjPU/blow"}, {"title": "3P, 4P", "value": "genres/BxHaNJc/3p-4p"}, {"title": "Cuckold", "value": "genres/DSqPmNM/cuckold"}, {"title": "Digital Mosaic", "value": "genres/IdoowAI/digital-mosaic"}, {"title": "Slender", "value": "genres/CaENosY/slender"}, {"title": "Squirting", "value": "genres/HShdVAg/squirting"}, {"title": "School Girls", "value": "genres/CMwMXEY/school-girls"}, {"title": "Nasty, Hardcore", "value": "genres/HVOSKBU/nasty-hardcore"}, {"title": "Drama", "value": "genres/GUieHFE/drama"}, {"title": "JAV Uncensored", "value": "genres/javuncensored/jav-uncensored"}, {"title": "Incest", "value": "genres/ttzyfU/incest"}, {"title": "Titty Fuck", "value": "genres/EYjtJGI/titty-fuck"}, {"title": "Breasts", "value": "genres/FhKPzbk/breasts"}, {"title": "Planning", "value": "genres/BelfNeY/planning"}, {"title": "Cowgirl", "value": "genres/BrtnXsw/cowgirl"}, {"title": "POV", "value": "genres/BZXvyLU/pov"}, {"title": "Documentary", "value": "genres/waovUA/documentary"}, {"title": "Huge Butt", "value": "genres/BmfzJNE/huge-butt"}, {"title": "Facials", "value": "genres/HyKxxsQ/facials"}, {"title": "Abuse", "value": "genres/EGOOyiw/abuse"}, {"title": "Affair", "value": "genres/BWrHCvk/affair"}, {"title": "Best, Omnibus", "value": "genres/glzpZM/best-omnibus"}, {"title": "Older Sister", "value": "genres/BUKLrxc/older-sister"}, {"title": "Voyeur", "value": "genres/jSorDs/voyeur"}, {"title": "Humiliation", "value": "genres/DVXHZsY/humiliation"}, {"title": "Other Fetish", "value": "genres/DlLttTU/other-fetish"}, {"title": "Debut Production", "value": "genres/IgVddgQ/debut-production"}, {"title": "Nampa", "value": "genres/BEVUiDU/nampa"}, {"title": "OL", "value": "genres/BBofqrM/ol"}, {"title": "Deep Throating", "value": "genres/BualDEg/deep-throating"}, {"title": "Masturbation", "value": "genres/zHowlU/masturbation"}] }, { name: "maker", title: "制作商", type: "enumeration", value: "", enumOptions: [{"title": "Prestige", "value": "maker/DNvUFlk/prestige"}, {"title": "K.M.Produce", "value": "maker/BKBprXE/k-m-produce"}, {"title": "SOD Create", "value": "maker/BsMlzCg/sod-create"}, {"title": "MOODYZ", "value": "maker/CFUmAoI/moodyz"}, {"title": "Madonna", "value": "maker/BUdRNZs/madonna"}, {"title": "S1 NO.1 STYLE", "value": "maker/BMieoew/s1-no-1-style"}, {"title": "Attackers", "value": "maker/BcXxOyY/attackers"}, {"title": "IDEA POCKET", "value": "maker/CkydMyo/idea-pocket"}, {"title": "Hunter", "value": "maker/BXKOZGQ/hunter"}, {"title": "Glory Quest", "value": "maker/JzpYHfE/glory-quest"}, {"title": "Center Village", "value": "maker/FPHToDU/center-village"}, {"title": "Venus", "value": "maker/DVpmCKw/venus"}, {"title": "Takara Eizou", "value": "maker/JRfNqRc/takara-eizou"}, {"title": "Serebu No Tomo", "value": "maker/HiomwhM/serebu-no-tomo"}, {"title": "Planet Plus", "value": "maker/DLOfVHk/planet-plus"}, {"title": "Honnaka", "value": "maker/BmzFtSw/honnaka"}, {"title": "Fitch", "value": "maker/ELucNvk/fitch"}, {"title": "Das !", "value": "maker/HauUhiY/das"}, {"title": "Deeps", "value": "maker/KSKweZU/deeps"}, {"title": "BIGMORKAL", "value": "maker/GSUAIJU/bigmorkal"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "新发布", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "release" }, { name: "genre", title: "题材", type: "enumeration", value: "", enumOptions: [{"title": "Solowork", "value": "genres/QxHGjE/solowork"}, {"title": "Creampie", "value": "genres/GVWkCw/creampie"}, {"title": "Big Tits", "value": "genres/BJiygps/big-tits"}, {"title": "Married Woman", "value": "genres/BcEqYww/married-woman"}, {"title": "Mature Woman", "value": "genres/DFiQTPU/mature-woman"}, {"title": "Beautiful Girl", "value": "genres/Ljbfjc/beautiful-girl"}, {"title": "4HR+", "value": "genres/ogWFog/4hr"}, {"title": "Slut", "value": "genres/BMPngcQ/slut"}, {"title": "Amateur", "value": "genres/BHCJmMg/amateur"}, {"title": "Blow", "value": "genres/CHihjPU/blow"}, {"title": "3P, 4P", "value": "genres/BxHaNJc/3p-4p"}, {"title": "Cuckold", "value": "genres/DSqPmNM/cuckold"}, {"title": "Digital Mosaic", "value": "genres/IdoowAI/digital-mosaic"}, {"title": "Slender", "value": "genres/CaENosY/slender"}, {"title": "Squirting", "value": "genres/HShdVAg/squirting"}, {"title": "School Girls", "value": "genres/CMwMXEY/school-girls"}, {"title": "Nasty, Hardcore", "value": "genres/HVOSKBU/nasty-hardcore"}, {"title": "Drama", "value": "genres/GUieHFE/drama"}, {"title": "JAV Uncensored", "value": "genres/javuncensored/jav-uncensored"}, {"title": "Incest", "value": "genres/ttzyfU/incest"}, {"title": "Titty Fuck", "value": "genres/EYjtJGI/titty-fuck"}, {"title": "Breasts", "value": "genres/FhKPzbk/breasts"}, {"title": "Planning", "value": "genres/BelfNeY/planning"}, {"title": "Cowgirl", "value": "genres/BrtnXsw/cowgirl"}, {"title": "POV", "value": "genres/BZXvyLU/pov"}, {"title": "Documentary", "value": "genres/waovUA/documentary"}, {"title": "Huge Butt", "value": "genres/BmfzJNE/huge-butt"}, {"title": "Facials", "value": "genres/HyKxxsQ/facials"}, {"title": "Abuse", "value": "genres/EGOOyiw/abuse"}, {"title": "Affair", "value": "genres/BWrHCvk/affair"}, {"title": "Best, Omnibus", "value": "genres/glzpZM/best-omnibus"}, {"title": "Older Sister", "value": "genres/BUKLrxc/older-sister"}, {"title": "Voyeur", "value": "genres/jSorDs/voyeur"}, {"title": "Humiliation", "value": "genres/DVXHZsY/humiliation"}, {"title": "Other Fetish", "value": "genres/DlLttTU/other-fetish"}, {"title": "Debut Production", "value": "genres/IgVddgQ/debut-production"}, {"title": "Nampa", "value": "genres/BEVUiDU/nampa"}, {"title": "OL", "value": "genres/BBofqrM/ol"}, {"title": "Deep Throating", "value": "genres/BualDEg/deep-throating"}, {"title": "Masturbation", "value": "genres/zHowlU/masturbation"}] }, { name: "maker", title: "制作商", type: "enumeration", value: "", enumOptions: [{"title": "Prestige", "value": "maker/DNvUFlk/prestige"}, {"title": "K.M.Produce", "value": "maker/BKBprXE/k-m-produce"}, {"title": "SOD Create", "value": "maker/BsMlzCg/sod-create"}, {"title": "MOODYZ", "value": "maker/CFUmAoI/moodyz"}, {"title": "Madonna", "value": "maker/BUdRNZs/madonna"}, {"title": "S1 NO.1 STYLE", "value": "maker/BMieoew/s1-no-1-style"}, {"title": "Attackers", "value": "maker/BcXxOyY/attackers"}, {"title": "IDEA POCKET", "value": "maker/CkydMyo/idea-pocket"}, {"title": "Hunter", "value": "maker/BXKOZGQ/hunter"}, {"title": "Glory Quest", "value": "maker/JzpYHfE/glory-quest"}, {"title": "Center Village", "value": "maker/FPHToDU/center-village"}, {"title": "Venus", "value": "maker/DVpmCKw/venus"}, {"title": "Takara Eizou", "value": "maker/JRfNqRc/takara-eizou"}, {"title": "Serebu No Tomo", "value": "maker/HiomwhM/serebu-no-tomo"}, {"title": "Planet Plus", "value": "maker/DLOfVHk/planet-plus"}, {"title": "Honnaka", "value": "maker/BmzFtSw/honnaka"}, {"title": "Fitch", "value": "maker/ELucNvk/fitch"}, {"title": "Das !", "value": "maker/HauUhiY/das"}, {"title": "Deeps", "value": "maker/KSKweZU/deeps"}, {"title": "BIGMORKAL", "value": "maker/GSUAIJU/bigmorkal"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "即将上映", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "upcoming" }, { name: "genre", title: "题材", type: "enumeration", value: "", enumOptions: [{"title": "Solowork", "value": "genres/QxHGjE/solowork"}, {"title": "Creampie", "value": "genres/GVWkCw/creampie"}, {"title": "Big Tits", "value": "genres/BJiygps/big-tits"}, {"title": "Married Woman", "value": "genres/BcEqYww/married-woman"}, {"title": "Mature Woman", "value": "genres/DFiQTPU/mature-woman"}, {"title": "Beautiful Girl", "value": "genres/Ljbfjc/beautiful-girl"}, {"title": "4HR+", "value": "genres/ogWFog/4hr"}, {"title": "Slut", "value": "genres/BMPngcQ/slut"}, {"title": "Amateur", "value": "genres/BHCJmMg/amateur"}, {"title": "Blow", "value": "genres/CHihjPU/blow"}, {"title": "3P, 4P", "value": "genres/BxHaNJc/3p-4p"}, {"title": "Cuckold", "value": "genres/DSqPmNM/cuckold"}, {"title": "Digital Mosaic", "value": "genres/IdoowAI/digital-mosaic"}, {"title": "Slender", "value": "genres/CaENosY/slender"}, {"title": "Squirting", "value": "genres/HShdVAg/squirting"}, {"title": "School Girls", "value": "genres/CMwMXEY/school-girls"}, {"title": "Nasty, Hardcore", "value": "genres/HVOSKBU/nasty-hardcore"}, {"title": "Drama", "value": "genres/GUieHFE/drama"}, {"title": "JAV Uncensored", "value": "genres/javuncensored/jav-uncensored"}, {"title": "Incest", "value": "genres/ttzyfU/incest"}, {"title": "Titty Fuck", "value": "genres/EYjtJGI/titty-fuck"}, {"title": "Breasts", "value": "genres/FhKPzbk/breasts"}, {"title": "Planning", "value": "genres/BelfNeY/planning"}, {"title": "Cowgirl", "value": "genres/BrtnXsw/cowgirl"}, {"title": "POV", "value": "genres/BZXvyLU/pov"}, {"title": "Documentary", "value": "genres/waovUA/documentary"}, {"title": "Huge Butt", "value": "genres/BmfzJNE/huge-butt"}, {"title": "Facials", "value": "genres/HyKxxsQ/facials"}, {"title": "Abuse", "value": "genres/EGOOyiw/abuse"}, {"title": "Affair", "value": "genres/BWrHCvk/affair"}, {"title": "Best, Omnibus", "value": "genres/glzpZM/best-omnibus"}, {"title": "Older Sister", "value": "genres/BUKLrxc/older-sister"}, {"title": "Voyeur", "value": "genres/jSorDs/voyeur"}, {"title": "Humiliation", "value": "genres/DVXHZsY/humiliation"}, {"title": "Other Fetish", "value": "genres/DlLttTU/other-fetish"}, {"title": "Debut Production", "value": "genres/IgVddgQ/debut-production"}, {"title": "Nampa", "value": "genres/BEVUiDU/nampa"}, {"title": "OL", "value": "genres/BBofqrM/ol"}, {"title": "Deep Throating", "value": "genres/BualDEg/deep-throating"}, {"title": "Masturbation", "value": "genres/zHowlU/masturbation"}] }, { name: "maker", title: "制作商", type: "enumeration", value: "", enumOptions: [{"title": "Prestige", "value": "maker/DNvUFlk/prestige"}, {"title": "K.M.Produce", "value": "maker/BKBprXE/k-m-produce"}, {"title": "SOD Create", "value": "maker/BsMlzCg/sod-create"}, {"title": "MOODYZ", "value": "maker/CFUmAoI/moodyz"}, {"title": "Madonna", "value": "maker/BUdRNZs/madonna"}, {"title": "S1 NO.1 STYLE", "value": "maker/BMieoew/s1-no-1-style"}, {"title": "Attackers", "value": "maker/BcXxOyY/attackers"}, {"title": "IDEA POCKET", "value": "maker/CkydMyo/idea-pocket"}, {"title": "Hunter", "value": "maker/BXKOZGQ/hunter"}, {"title": "Glory Quest", "value": "maker/JzpYHfE/glory-quest"}, {"title": "Center Village", "value": "maker/FPHToDU/center-village"}, {"title": "Venus", "value": "maker/DVpmCKw/venus"}, {"title": "Takara Eizou", "value": "maker/JRfNqRc/takara-eizou"}, {"title": "Serebu No Tomo", "value": "maker/HiomwhM/serebu-no-tomo"}, {"title": "Planet Plus", "value": "maker/DLOfVHk/planet-plus"}, {"title": "Honnaka", "value": "maker/BmzFtSw/honnaka"}, {"title": "Fitch", "value": "maker/ELucNvk/fitch"}, {"title": "Das !", "value": "maker/HauUhiY/das"}, {"title": "Deeps", "value": "maker/KSKweZU/deeps"}, {"title": "BIGMORKAL", "value": "maker/GSUAIJU/bigmorkal"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "无码流出", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "g-uncensored" }, { name: "genre", title: "题材", type: "enumeration", value: "", enumOptions: [{"title": "Solowork", "value": "genres/QxHGjE/solowork"}, {"title": "Creampie", "value": "genres/GVWkCw/creampie"}, {"title": "Big Tits", "value": "genres/BJiygps/big-tits"}, {"title": "Married Woman", "value": "genres/BcEqYww/married-woman"}, {"title": "Mature Woman", "value": "genres/DFiQTPU/mature-woman"}, {"title": "Beautiful Girl", "value": "genres/Ljbfjc/beautiful-girl"}, {"title": "4HR+", "value": "genres/ogWFog/4hr"}, {"title": "Slut", "value": "genres/BMPngcQ/slut"}, {"title": "Amateur", "value": "genres/BHCJmMg/amateur"}, {"title": "Blow", "value": "genres/CHihjPU/blow"}, {"title": "3P, 4P", "value": "genres/BxHaNJc/3p-4p"}, {"title": "Cuckold", "value": "genres/DSqPmNM/cuckold"}, {"title": "Digital Mosaic", "value": "genres/IdoowAI/digital-mosaic"}, {"title": "Slender", "value": "genres/CaENosY/slender"}, {"title": "Squirting", "value": "genres/HShdVAg/squirting"}, {"title": "School Girls", "value": "genres/CMwMXEY/school-girls"}, {"title": "Nasty, Hardcore", "value": "genres/HVOSKBU/nasty-hardcore"}, {"title": "Drama", "value": "genres/GUieHFE/drama"}, {"title": "JAV Uncensored", "value": "genres/javuncensored/jav-uncensored"}, {"title": "Incest", "value": "genres/ttzyfU/incest"}, {"title": "Titty Fuck", "value": "genres/EYjtJGI/titty-fuck"}, {"title": "Breasts", "value": "genres/FhKPzbk/breasts"}, {"title": "Planning", "value": "genres/BelfNeY/planning"}, {"title": "Cowgirl", "value": "genres/BrtnXsw/cowgirl"}, {"title": "POV", "value": "genres/BZXvyLU/pov"}, {"title": "Documentary", "value": "genres/waovUA/documentary"}, {"title": "Huge Butt", "value": "genres/BmfzJNE/huge-butt"}, {"title": "Facials", "value": "genres/HyKxxsQ/facials"}, {"title": "Abuse", "value": "genres/EGOOyiw/abuse"}, {"title": "Affair", "value": "genres/BWrHCvk/affair"}, {"title": "Best, Omnibus", "value": "genres/glzpZM/best-omnibus"}, {"title": "Older Sister", "value": "genres/BUKLrxc/older-sister"}, {"title": "Voyeur", "value": "genres/jSorDs/voyeur"}, {"title": "Humiliation", "value": "genres/DVXHZsY/humiliation"}, {"title": "Other Fetish", "value": "genres/DlLttTU/other-fetish"}, {"title": "Debut Production", "value": "genres/IgVddgQ/debut-production"}, {"title": "Nampa", "value": "genres/BEVUiDU/nampa"}, {"title": "OL", "value": "genres/BBofqrM/ol"}, {"title": "Deep Throating", "value": "genres/BualDEg/deep-throating"}, {"title": "Masturbation", "value": "genres/zHowlU/masturbation"}] }, { name: "maker", title: "制作商", type: "enumeration", value: "", enumOptions: [{"title": "Prestige", "value": "maker/DNvUFlk/prestige"}, {"title": "K.M.Produce", "value": "maker/BKBprXE/k-m-produce"}, {"title": "SOD Create", "value": "maker/BsMlzCg/sod-create"}, {"title": "MOODYZ", "value": "maker/CFUmAoI/moodyz"}, {"title": "Madonna", "value": "maker/BUdRNZs/madonna"}, {"title": "S1 NO.1 STYLE", "value": "maker/BMieoew/s1-no-1-style"}, {"title": "Attackers", "value": "maker/BcXxOyY/attackers"}, {"title": "IDEA POCKET", "value": "maker/CkydMyo/idea-pocket"}, {"title": "Hunter", "value": "maker/BXKOZGQ/hunter"}, {"title": "Glory Quest", "value": "maker/JzpYHfE/glory-quest"}, {"title": "Center Village", "value": "maker/FPHToDU/center-village"}, {"title": "Venus", "value": "maker/DVpmCKw/venus"}, {"title": "Takara Eizou", "value": "maker/JRfNqRc/takara-eizou"}, {"title": "Serebu No Tomo", "value": "maker/HiomwhM/serebu-no-tomo"}, {"title": "Planet Plus", "value": "maker/DLOfVHk/planet-plus"}, {"title": "Honnaka", "value": "maker/BmzFtSw/honnaka"}, {"title": "Fitch", "value": "maker/ELucNvk/fitch"}, {"title": "Das !", "value": "maker/HauUhiY/das"}, {"title": "Deeps", "value": "maker/KSKweZU/deeps"}, {"title": "BIGMORKAL", "value": "maker/GSUAIJU/bigmorkal"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "巨乳", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "g-bigtits" }, { name: "genre", title: "题材", type: "enumeration", value: "", enumOptions: [{"title": "Solowork", "value": "genres/QxHGjE/solowork"}, {"title": "Creampie", "value": "genres/GVWkCw/creampie"}, {"title": "Big Tits", "value": "genres/BJiygps/big-tits"}, {"title": "Married Woman", "value": "genres/BcEqYww/married-woman"}, {"title": "Mature Woman", "value": "genres/DFiQTPU/mature-woman"}, {"title": "Beautiful Girl", "value": "genres/Ljbfjc/beautiful-girl"}, {"title": "4HR+", "value": "genres/ogWFog/4hr"}, {"title": "Slut", "value": "genres/BMPngcQ/slut"}, {"title": "Amateur", "value": "genres/BHCJmMg/amateur"}, {"title": "Blow", "value": "genres/CHihjPU/blow"}, {"title": "3P, 4P", "value": "genres/BxHaNJc/3p-4p"}, {"title": "Cuckold", "value": "genres/DSqPmNM/cuckold"}, {"title": "Digital Mosaic", "value": "genres/IdoowAI/digital-mosaic"}, {"title": "Slender", "value": "genres/CaENosY/slender"}, {"title": "Squirting", "value": "genres/HShdVAg/squirting"}, {"title": "School Girls", "value": "genres/CMwMXEY/school-girls"}, {"title": "Nasty, Hardcore", "value": "genres/HVOSKBU/nasty-hardcore"}, {"title": "Drama", "value": "genres/GUieHFE/drama"}, {"title": "JAV Uncensored", "value": "genres/javuncensored/jav-uncensored"}, {"title": "Incest", "value": "genres/ttzyfU/incest"}, {"title": "Titty Fuck", "value": "genres/EYjtJGI/titty-fuck"}, {"title": "Breasts", "value": "genres/FhKPzbk/breasts"}, {"title": "Planning", "value": "genres/BelfNeY/planning"}, {"title": "Cowgirl", "value": "genres/BrtnXsw/cowgirl"}, {"title": "POV", "value": "genres/BZXvyLU/pov"}, {"title": "Documentary", "value": "genres/waovUA/documentary"}, {"title": "Huge Butt", "value": "genres/BmfzJNE/huge-butt"}, {"title": "Facials", "value": "genres/HyKxxsQ/facials"}, {"title": "Abuse", "value": "genres/EGOOyiw/abuse"}, {"title": "Affair", "value": "genres/BWrHCvk/affair"}, {"title": "Best, Omnibus", "value": "genres/glzpZM/best-omnibus"}, {"title": "Older Sister", "value": "genres/BUKLrxc/older-sister"}, {"title": "Voyeur", "value": "genres/jSorDs/voyeur"}, {"title": "Humiliation", "value": "genres/DVXHZsY/humiliation"}, {"title": "Other Fetish", "value": "genres/DlLttTU/other-fetish"}, {"title": "Debut Production", "value": "genres/IgVddgQ/debut-production"}, {"title": "Nampa", "value": "genres/BEVUiDU/nampa"}, {"title": "OL", "value": "genres/BBofqrM/ol"}, {"title": "Deep Throating", "value": "genres/BualDEg/deep-throating"}, {"title": "Masturbation", "value": "genres/zHowlU/masturbation"}] }, { name: "maker", title: "制作商", type: "enumeration", value: "", enumOptions: [{"title": "Prestige", "value": "maker/DNvUFlk/prestige"}, {"title": "K.M.Produce", "value": "maker/BKBprXE/k-m-produce"}, {"title": "SOD Create", "value": "maker/BsMlzCg/sod-create"}, {"title": "MOODYZ", "value": "maker/CFUmAoI/moodyz"}, {"title": "Madonna", "value": "maker/BUdRNZs/madonna"}, {"title": "S1 NO.1 STYLE", "value": "maker/BMieoew/s1-no-1-style"}, {"title": "Attackers", "value": "maker/BcXxOyY/attackers"}, {"title": "IDEA POCKET", "value": "maker/CkydMyo/idea-pocket"}, {"title": "Hunter", "value": "maker/BXKOZGQ/hunter"}, {"title": "Glory Quest", "value": "maker/JzpYHfE/glory-quest"}, {"title": "Center Village", "value": "maker/FPHToDU/center-village"}, {"title": "Venus", "value": "maker/DVpmCKw/venus"}, {"title": "Takara Eizou", "value": "maker/JRfNqRc/takara-eizou"}, {"title": "Serebu No Tomo", "value": "maker/HiomwhM/serebu-no-tomo"}, {"title": "Planet Plus", "value": "maker/DLOfVHk/planet-plus"}, {"title": "Honnaka", "value": "maker/BmzFtSw/honnaka"}, {"title": "Fitch", "value": "maker/ELucNvk/fitch"}, {"title": "Das !", "value": "maker/HauUhiY/das"}, {"title": "Deeps", "value": "maker/KSKweZU/deeps"}, {"title": "BIGMORKAL", "value": "maker/GSUAIJU/bigmorkal"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "大屁股", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "g-hugebutt" }, { name: "genre", title: "题材", type: "enumeration", value: "", enumOptions: [{"title": "Solowork", "value": "genres/QxHGjE/solowork"}, {"title": "Creampie", "value": "genres/GVWkCw/creampie"}, {"title": "Big Tits", "value": "genres/BJiygps/big-tits"}, {"title": "Married Woman", "value": "genres/BcEqYww/married-woman"}, {"title": "Mature Woman", "value": "genres/DFiQTPU/mature-woman"}, {"title": "Beautiful Girl", "value": "genres/Ljbfjc/beautiful-girl"}, {"title": "4HR+", "value": "genres/ogWFog/4hr"}, {"title": "Slut", "value": "genres/BMPngcQ/slut"}, {"title": "Amateur", "value": "genres/BHCJmMg/amateur"}, {"title": "Blow", "value": "genres/CHihjPU/blow"}, {"title": "3P, 4P", "value": "genres/BxHaNJc/3p-4p"}, {"title": "Cuckold", "value": "genres/DSqPmNM/cuckold"}, {"title": "Digital Mosaic", "value": "genres/IdoowAI/digital-mosaic"}, {"title": "Slender", "value": "genres/CaENosY/slender"}, {"title": "Squirting", "value": "genres/HShdVAg/squirting"}, {"title": "School Girls", "value": "genres/CMwMXEY/school-girls"}, {"title": "Nasty, Hardcore", "value": "genres/HVOSKBU/nasty-hardcore"}, {"title": "Drama", "value": "genres/GUieHFE/drama"}, {"title": "JAV Uncensored", "value": "genres/javuncensored/jav-uncensored"}, {"title": "Incest", "value": "genres/ttzyfU/incest"}, {"title": "Titty Fuck", "value": "genres/EYjtJGI/titty-fuck"}, {"title": "Breasts", "value": "genres/FhKPzbk/breasts"}, {"title": "Planning", "value": "genres/BelfNeY/planning"}, {"title": "Cowgirl", "value": "genres/BrtnXsw/cowgirl"}, {"title": "POV", "value": "genres/BZXvyLU/pov"}, {"title": "Documentary", "value": "genres/waovUA/documentary"}, {"title": "Huge Butt", "value": "genres/BmfzJNE/huge-butt"}, {"title": "Facials", "value": "genres/HyKxxsQ/facials"}, {"title": "Abuse", "value": "genres/EGOOyiw/abuse"}, {"title": "Affair", "value": "genres/BWrHCvk/affair"}, {"title": "Best, Omnibus", "value": "genres/glzpZM/best-omnibus"}, {"title": "Older Sister", "value": "genres/BUKLrxc/older-sister"}, {"title": "Voyeur", "value": "genres/jSorDs/voyeur"}, {"title": "Humiliation", "value": "genres/DVXHZsY/humiliation"}, {"title": "Other Fetish", "value": "genres/DlLttTU/other-fetish"}, {"title": "Debut Production", "value": "genres/IgVddgQ/debut-production"}, {"title": "Nampa", "value": "genres/BEVUiDU/nampa"}, {"title": "OL", "value": "genres/BBofqrM/ol"}, {"title": "Deep Throating", "value": "genres/BualDEg/deep-throating"}, {"title": "Masturbation", "value": "genres/zHowlU/masturbation"}] }, { name: "maker", title: "制作商", type: "enumeration", value: "", enumOptions: [{"title": "Prestige", "value": "maker/DNvUFlk/prestige"}, {"title": "K.M.Produce", "value": "maker/BKBprXE/k-m-produce"}, {"title": "SOD Create", "value": "maker/BsMlzCg/sod-create"}, {"title": "MOODYZ", "value": "maker/CFUmAoI/moodyz"}, {"title": "Madonna", "value": "maker/BUdRNZs/madonna"}, {"title": "S1 NO.1 STYLE", "value": "maker/BMieoew/s1-no-1-style"}, {"title": "Attackers", "value": "maker/BcXxOyY/attackers"}, {"title": "IDEA POCKET", "value": "maker/CkydMyo/idea-pocket"}, {"title": "Hunter", "value": "maker/BXKOZGQ/hunter"}, {"title": "Glory Quest", "value": "maker/JzpYHfE/glory-quest"}, {"title": "Center Village", "value": "maker/FPHToDU/center-village"}, {"title": "Venus", "value": "maker/DVpmCKw/venus"}, {"title": "Takara Eizou", "value": "maker/JRfNqRc/takara-eizou"}, {"title": "Serebu No Tomo", "value": "maker/HiomwhM/serebu-no-tomo"}, {"title": "Planet Plus", "value": "maker/DLOfVHk/planet-plus"}, {"title": "Honnaka", "value": "maker/BmzFtSw/honnaka"}, {"title": "Fitch", "value": "maker/ELucNvk/fitch"}, {"title": "Das !", "value": "maker/HauUhiY/das"}, {"title": "Deeps", "value": "maker/KSKweZU/deeps"}, {"title": "BIGMORKAL", "value": "maker/GSUAIJU/bigmorkal"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "中出", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "g-creampie" }, { name: "genre", title: "题材", type: "enumeration", value: "", enumOptions: [{"title": "Solowork", "value": "genres/QxHGjE/solowork"}, {"title": "Creampie", "value": "genres/GVWkCw/creampie"}, {"title": "Big Tits", "value": "genres/BJiygps/big-tits"}, {"title": "Married Woman", "value": "genres/BcEqYww/married-woman"}, {"title": "Mature Woman", "value": "genres/DFiQTPU/mature-woman"}, {"title": "Beautiful Girl", "value": "genres/Ljbfjc/beautiful-girl"}, {"title": "4HR+", "value": "genres/ogWFog/4hr"}, {"title": "Slut", "value": "genres/BMPngcQ/slut"}, {"title": "Amateur", "value": "genres/BHCJmMg/amateur"}, {"title": "Blow", "value": "genres/CHihjPU/blow"}, {"title": "3P, 4P", "value": "genres/BxHaNJc/3p-4p"}, {"title": "Cuckold", "value": "genres/DSqPmNM/cuckold"}, {"title": "Digital Mosaic", "value": "genres/IdoowAI/digital-mosaic"}, {"title": "Slender", "value": "genres/CaENosY/slender"}, {"title": "Squirting", "value": "genres/HShdVAg/squirting"}, {"title": "School Girls", "value": "genres/CMwMXEY/school-girls"}, {"title": "Nasty, Hardcore", "value": "genres/HVOSKBU/nasty-hardcore"}, {"title": "Drama", "value": "genres/GUieHFE/drama"}, {"title": "JAV Uncensored", "value": "genres/javuncensored/jav-uncensored"}, {"title": "Incest", "value": "genres/ttzyfU/incest"}, {"title": "Titty Fuck", "value": "genres/EYjtJGI/titty-fuck"}, {"title": "Breasts", "value": "genres/FhKPzbk/breasts"}, {"title": "Planning", "value": "genres/BelfNeY/planning"}, {"title": "Cowgirl", "value": "genres/BrtnXsw/cowgirl"}, {"title": "POV", "value": "genres/BZXvyLU/pov"}, {"title": "Documentary", "value": "genres/waovUA/documentary"}, {"title": "Huge Butt", "value": "genres/BmfzJNE/huge-butt"}, {"title": "Facials", "value": "genres/HyKxxsQ/facials"}, {"title": "Abuse", "value": "genres/EGOOyiw/abuse"}, {"title": "Affair", "value": "genres/BWrHCvk/affair"}, {"title": "Best, Omnibus", "value": "genres/glzpZM/best-omnibus"}, {"title": "Older Sister", "value": "genres/BUKLrxc/older-sister"}, {"title": "Voyeur", "value": "genres/jSorDs/voyeur"}, {"title": "Humiliation", "value": "genres/DVXHZsY/humiliation"}, {"title": "Other Fetish", "value": "genres/DlLttTU/other-fetish"}, {"title": "Debut Production", "value": "genres/IgVddgQ/debut-production"}, {"title": "Nampa", "value": "genres/BEVUiDU/nampa"}, {"title": "OL", "value": "genres/BBofqrM/ol"}, {"title": "Deep Throating", "value": "genres/BualDEg/deep-throating"}, {"title": "Masturbation", "value": "genres/zHowlU/masturbation"}] }, { name: "maker", title: "制作商", type: "enumeration", value: "", enumOptions: [{"title": "Prestige", "value": "maker/DNvUFlk/prestige"}, {"title": "K.M.Produce", "value": "maker/BKBprXE/k-m-produce"}, {"title": "SOD Create", "value": "maker/BsMlzCg/sod-create"}, {"title": "MOODYZ", "value": "maker/CFUmAoI/moodyz"}, {"title": "Madonna", "value": "maker/BUdRNZs/madonna"}, {"title": "S1 NO.1 STYLE", "value": "maker/BMieoew/s1-no-1-style"}, {"title": "Attackers", "value": "maker/BcXxOyY/attackers"}, {"title": "IDEA POCKET", "value": "maker/CkydMyo/idea-pocket"}, {"title": "Hunter", "value": "maker/BXKOZGQ/hunter"}, {"title": "Glory Quest", "value": "maker/JzpYHfE/glory-quest"}, {"title": "Center Village", "value": "maker/FPHToDU/center-village"}, {"title": "Venus", "value": "maker/DVpmCKw/venus"}, {"title": "Takara Eizou", "value": "maker/JRfNqRc/takara-eizou"}, {"title": "Serebu No Tomo", "value": "maker/HiomwhM/serebu-no-tomo"}, {"title": "Planet Plus", "value": "maker/DLOfVHk/planet-plus"}, {"title": "Honnaka", "value": "maker/BmzFtSw/honnaka"}, {"title": "Fitch", "value": "maker/ELucNvk/fitch"}, {"title": "Das !", "value": "maker/HauUhiY/das"}, {"title": "Deeps", "value": "maker/KSKweZU/deeps"}, {"title": "BIGMORKAL", "value": "maker/GSUAIJU/bigmorkal"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "人妻", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "g-married" }, { name: "genre", title: "题材", type: "enumeration", value: "", enumOptions: [{"title": "Solowork", "value": "genres/QxHGjE/solowork"}, {"title": "Creampie", "value": "genres/GVWkCw/creampie"}, {"title": "Big Tits", "value": "genres/BJiygps/big-tits"}, {"title": "Married Woman", "value": "genres/BcEqYww/married-woman"}, {"title": "Mature Woman", "value": "genres/DFiQTPU/mature-woman"}, {"title": "Beautiful Girl", "value": "genres/Ljbfjc/beautiful-girl"}, {"title": "4HR+", "value": "genres/ogWFog/4hr"}, {"title": "Slut", "value": "genres/BMPngcQ/slut"}, {"title": "Amateur", "value": "genres/BHCJmMg/amateur"}, {"title": "Blow", "value": "genres/CHihjPU/blow"}, {"title": "3P, 4P", "value": "genres/BxHaNJc/3p-4p"}, {"title": "Cuckold", "value": "genres/DSqPmNM/cuckold"}, {"title": "Digital Mosaic", "value": "genres/IdoowAI/digital-mosaic"}, {"title": "Slender", "value": "genres/CaENosY/slender"}, {"title": "Squirting", "value": "genres/HShdVAg/squirting"}, {"title": "School Girls", "value": "genres/CMwMXEY/school-girls"}, {"title": "Nasty, Hardcore", "value": "genres/HVOSKBU/nasty-hardcore"}, {"title": "Drama", "value": "genres/GUieHFE/drama"}, {"title": "JAV Uncensored", "value": "genres/javuncensored/jav-uncensored"}, {"title": "Incest", "value": "genres/ttzyfU/incest"}, {"title": "Titty Fuck", "value": "genres/EYjtJGI/titty-fuck"}, {"title": "Breasts", "value": "genres/FhKPzbk/breasts"}, {"title": "Planning", "value": "genres/BelfNeY/planning"}, {"title": "Cowgirl", "value": "genres/BrtnXsw/cowgirl"}, {"title": "POV", "value": "genres/BZXvyLU/pov"}, {"title": "Documentary", "value": "genres/waovUA/documentary"}, {"title": "Huge Butt", "value": "genres/BmfzJNE/huge-butt"}, {"title": "Facials", "value": "genres/HyKxxsQ/facials"}, {"title": "Abuse", "value": "genres/EGOOyiw/abuse"}, {"title": "Affair", "value": "genres/BWrHCvk/affair"}, {"title": "Best, Omnibus", "value": "genres/glzpZM/best-omnibus"}, {"title": "Older Sister", "value": "genres/BUKLrxc/older-sister"}, {"title": "Voyeur", "value": "genres/jSorDs/voyeur"}, {"title": "Humiliation", "value": "genres/DVXHZsY/humiliation"}, {"title": "Other Fetish", "value": "genres/DlLttTU/other-fetish"}, {"title": "Debut Production", "value": "genres/IgVddgQ/debut-production"}, {"title": "Nampa", "value": "genres/BEVUiDU/nampa"}, {"title": "OL", "value": "genres/BBofqrM/ol"}, {"title": "Deep Throating", "value": "genres/BualDEg/deep-throating"}, {"title": "Masturbation", "value": "genres/zHowlU/masturbation"}] }, { name: "maker", title: "制作商", type: "enumeration", value: "", enumOptions: [{"title": "Prestige", "value": "maker/DNvUFlk/prestige"}, {"title": "K.M.Produce", "value": "maker/BKBprXE/k-m-produce"}, {"title": "SOD Create", "value": "maker/BsMlzCg/sod-create"}, {"title": "MOODYZ", "value": "maker/CFUmAoI/moodyz"}, {"title": "Madonna", "value": "maker/BUdRNZs/madonna"}, {"title": "S1 NO.1 STYLE", "value": "maker/BMieoew/s1-no-1-style"}, {"title": "Attackers", "value": "maker/BcXxOyY/attackers"}, {"title": "IDEA POCKET", "value": "maker/CkydMyo/idea-pocket"}, {"title": "Hunter", "value": "maker/BXKOZGQ/hunter"}, {"title": "Glory Quest", "value": "maker/JzpYHfE/glory-quest"}, {"title": "Center Village", "value": "maker/FPHToDU/center-village"}, {"title": "Venus", "value": "maker/DVpmCKw/venus"}, {"title": "Takara Eizou", "value": "maker/JRfNqRc/takara-eizou"}, {"title": "Serebu No Tomo", "value": "maker/HiomwhM/serebu-no-tomo"}, {"title": "Planet Plus", "value": "maker/DLOfVHk/planet-plus"}, {"title": "Honnaka", "value": "maker/BmzFtSw/honnaka"}, {"title": "Fitch", "value": "maker/ELucNvk/fitch"}, {"title": "Das !", "value": "maker/HauUhiY/das"}, {"title": "Deeps", "value": "maker/KSKweZU/deeps"}, {"title": "BIGMORKAL", "value": "maker/GSUAIJU/bigmorkal"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "熟女", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "g-mature" }, { name: "genre", title: "题材", type: "enumeration", value: "", enumOptions: [{"title": "Solowork", "value": "genres/QxHGjE/solowork"}, {"title": "Creampie", "value": "genres/GVWkCw/creampie"}, {"title": "Big Tits", "value": "genres/BJiygps/big-tits"}, {"title": "Married Woman", "value": "genres/BcEqYww/married-woman"}, {"title": "Mature Woman", "value": "genres/DFiQTPU/mature-woman"}, {"title": "Beautiful Girl", "value": "genres/Ljbfjc/beautiful-girl"}, {"title": "4HR+", "value": "genres/ogWFog/4hr"}, {"title": "Slut", "value": "genres/BMPngcQ/slut"}, {"title": "Amateur", "value": "genres/BHCJmMg/amateur"}, {"title": "Blow", "value": "genres/CHihjPU/blow"}, {"title": "3P, 4P", "value": "genres/BxHaNJc/3p-4p"}, {"title": "Cuckold", "value": "genres/DSqPmNM/cuckold"}, {"title": "Digital Mosaic", "value": "genres/IdoowAI/digital-mosaic"}, {"title": "Slender", "value": "genres/CaENosY/slender"}, {"title": "Squirting", "value": "genres/HShdVAg/squirting"}, {"title": "School Girls", "value": "genres/CMwMXEY/school-girls"}, {"title": "Nasty, Hardcore", "value": "genres/HVOSKBU/nasty-hardcore"}, {"title": "Drama", "value": "genres/GUieHFE/drama"}, {"title": "JAV Uncensored", "value": "genres/javuncensored/jav-uncensored"}, {"title": "Incest", "value": "genres/ttzyfU/incest"}, {"title": "Titty Fuck", "value": "genres/EYjtJGI/titty-fuck"}, {"title": "Breasts", "value": "genres/FhKPzbk/breasts"}, {"title": "Planning", "value": "genres/BelfNeY/planning"}, {"title": "Cowgirl", "value": "genres/BrtnXsw/cowgirl"}, {"title": "POV", "value": "genres/BZXvyLU/pov"}, {"title": "Documentary", "value": "genres/waovUA/documentary"}, {"title": "Huge Butt", "value": "genres/BmfzJNE/huge-butt"}, {"title": "Facials", "value": "genres/HyKxxsQ/facials"}, {"title": "Abuse", "value": "genres/EGOOyiw/abuse"}, {"title": "Affair", "value": "genres/BWrHCvk/affair"}, {"title": "Best, Omnibus", "value": "genres/glzpZM/best-omnibus"}, {"title": "Older Sister", "value": "genres/BUKLrxc/older-sister"}, {"title": "Voyeur", "value": "genres/jSorDs/voyeur"}, {"title": "Humiliation", "value": "genres/DVXHZsY/humiliation"}, {"title": "Other Fetish", "value": "genres/DlLttTU/other-fetish"}, {"title": "Debut Production", "value": "genres/IgVddgQ/debut-production"}, {"title": "Nampa", "value": "genres/BEVUiDU/nampa"}, {"title": "OL", "value": "genres/BBofqrM/ol"}, {"title": "Deep Throating", "value": "genres/BualDEg/deep-throating"}, {"title": "Masturbation", "value": "genres/zHowlU/masturbation"}] }, { name: "maker", title: "制作商", type: "enumeration", value: "", enumOptions: [{"title": "Prestige", "value": "maker/DNvUFlk/prestige"}, {"title": "K.M.Produce", "value": "maker/BKBprXE/k-m-produce"}, {"title": "SOD Create", "value": "maker/BsMlzCg/sod-create"}, {"title": "MOODYZ", "value": "maker/CFUmAoI/moodyz"}, {"title": "Madonna", "value": "maker/BUdRNZs/madonna"}, {"title": "S1 NO.1 STYLE", "value": "maker/BMieoew/s1-no-1-style"}, {"title": "Attackers", "value": "maker/BcXxOyY/attackers"}, {"title": "IDEA POCKET", "value": "maker/CkydMyo/idea-pocket"}, {"title": "Hunter", "value": "maker/BXKOZGQ/hunter"}, {"title": "Glory Quest", "value": "maker/JzpYHfE/glory-quest"}, {"title": "Center Village", "value": "maker/FPHToDU/center-village"}, {"title": "Venus", "value": "maker/DVpmCKw/venus"}, {"title": "Takara Eizou", "value": "maker/JRfNqRc/takara-eizou"}, {"title": "Serebu No Tomo", "value": "maker/HiomwhM/serebu-no-tomo"}, {"title": "Planet Plus", "value": "maker/DLOfVHk/planet-plus"}, {"title": "Honnaka", "value": "maker/BmzFtSw/honnaka"}, {"title": "Fitch", "value": "maker/ELucNvk/fitch"}, {"title": "Das !", "value": "maker/HauUhiY/das"}, {"title": "Deeps", "value": "maker/KSKweZU/deeps"}, {"title": "BIGMORKAL", "value": "maker/GSUAIJU/bigmorkal"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "单体作品", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "g-solowork" }, { name: "genre", title: "题材", type: "enumeration", value: "", enumOptions: [{"title": "Solowork", "value": "genres/QxHGjE/solowork"}, {"title": "Creampie", "value": "genres/GVWkCw/creampie"}, {"title": "Big Tits", "value": "genres/BJiygps/big-tits"}, {"title": "Married Woman", "value": "genres/BcEqYww/married-woman"}, {"title": "Mature Woman", "value": "genres/DFiQTPU/mature-woman"}, {"title": "Beautiful Girl", "value": "genres/Ljbfjc/beautiful-girl"}, {"title": "4HR+", "value": "genres/ogWFog/4hr"}, {"title": "Slut", "value": "genres/BMPngcQ/slut"}, {"title": "Amateur", "value": "genres/BHCJmMg/amateur"}, {"title": "Blow", "value": "genres/CHihjPU/blow"}, {"title": "3P, 4P", "value": "genres/BxHaNJc/3p-4p"}, {"title": "Cuckold", "value": "genres/DSqPmNM/cuckold"}, {"title": "Digital Mosaic", "value": "genres/IdoowAI/digital-mosaic"}, {"title": "Slender", "value": "genres/CaENosY/slender"}, {"title": "Squirting", "value": "genres/HShdVAg/squirting"}, {"title": "School Girls", "value": "genres/CMwMXEY/school-girls"}, {"title": "Nasty, Hardcore", "value": "genres/HVOSKBU/nasty-hardcore"}, {"title": "Drama", "value": "genres/GUieHFE/drama"}, {"title": "JAV Uncensored", "value": "genres/javuncensored/jav-uncensored"}, {"title": "Incest", "value": "genres/ttzyfU/incest"}, {"title": "Titty Fuck", "value": "genres/EYjtJGI/titty-fuck"}, {"title": "Breasts", "value": "genres/FhKPzbk/breasts"}, {"title": "Planning", "value": "genres/BelfNeY/planning"}, {"title": "Cowgirl", "value": "genres/BrtnXsw/cowgirl"}, {"title": "POV", "value": "genres/BZXvyLU/pov"}, {"title": "Documentary", "value": "genres/waovUA/documentary"}, {"title": "Huge Butt", "value": "genres/BmfzJNE/huge-butt"}, {"title": "Facials", "value": "genres/HyKxxsQ/facials"}, {"title": "Abuse", "value": "genres/EGOOyiw/abuse"}, {"title": "Affair", "value": "genres/BWrHCvk/affair"}, {"title": "Best, Omnibus", "value": "genres/glzpZM/best-omnibus"}, {"title": "Older Sister", "value": "genres/BUKLrxc/older-sister"}, {"title": "Voyeur", "value": "genres/jSorDs/voyeur"}, {"title": "Humiliation", "value": "genres/DVXHZsY/humiliation"}, {"title": "Other Fetish", "value": "genres/DlLttTU/other-fetish"}, {"title": "Debut Production", "value": "genres/IgVddgQ/debut-production"}, {"title": "Nampa", "value": "genres/BEVUiDU/nampa"}, {"title": "OL", "value": "genres/BBofqrM/ol"}, {"title": "Deep Throating", "value": "genres/BualDEg/deep-throating"}, {"title": "Masturbation", "value": "genres/zHowlU/masturbation"}] }, { name: "maker", title: "制作商", type: "enumeration", value: "", enumOptions: [{"title": "Prestige", "value": "maker/DNvUFlk/prestige"}, {"title": "K.M.Produce", "value": "maker/BKBprXE/k-m-produce"}, {"title": "SOD Create", "value": "maker/BsMlzCg/sod-create"}, {"title": "MOODYZ", "value": "maker/CFUmAoI/moodyz"}, {"title": "Madonna", "value": "maker/BUdRNZs/madonna"}, {"title": "S1 NO.1 STYLE", "value": "maker/BMieoew/s1-no-1-style"}, {"title": "Attackers", "value": "maker/BcXxOyY/attackers"}, {"title": "IDEA POCKET", "value": "maker/CkydMyo/idea-pocket"}, {"title": "Hunter", "value": "maker/BXKOZGQ/hunter"}, {"title": "Glory Quest", "value": "maker/JzpYHfE/glory-quest"}, {"title": "Center Village", "value": "maker/FPHToDU/center-village"}, {"title": "Venus", "value": "maker/DVpmCKw/venus"}, {"title": "Takara Eizou", "value": "maker/JRfNqRc/takara-eizou"}, {"title": "Serebu No Tomo", "value": "maker/HiomwhM/serebu-no-tomo"}, {"title": "Planet Plus", "value": "maker/DLOfVHk/planet-plus"}, {"title": "Honnaka", "value": "maker/BmzFtSw/honnaka"}, {"title": "Fitch", "value": "maker/ELucNvk/fitch"}, {"title": "Das !", "value": "maker/HauUhiY/das"}, {"title": "Deeps", "value": "maker/KSKweZU/deeps"}, {"title": "BIGMORKAL", "value": "maker/GSUAIJU/bigmorkal"}] }, { name: "page", title: "页码", type: "page", value: "1" }] },
    { title: "素人", functionName: "loadList", cacheDuration: 180, params: [{ name: "zone", title: "分区", type: "constant", value: "g-amateur" }, { name: "genre", title: "题材", type: "enumeration", value: "", enumOptions: [{"title": "Solowork", "value": "genres/QxHGjE/solowork"}, {"title": "Creampie", "value": "genres/GVWkCw/creampie"}, {"title": "Big Tits", "value": "genres/BJiygps/big-tits"}, {"title": "Married Woman", "value": "genres/BcEqYww/married-woman"}, {"title": "Mature Woman", "value": "genres/DFiQTPU/mature-woman"}, {"title": "Beautiful Girl", "value": "genres/Ljbfjc/beautiful-girl"}, {"title": "4HR+", "value": "genres/ogWFog/4hr"}, {"title": "Slut", "value": "genres/BMPngcQ/slut"}, {"title": "Amateur", "value": "genres/BHCJmMg/amateur"}, {"title": "Blow", "value": "genres/CHihjPU/blow"}, {"title": "3P, 4P", "value": "genres/BxHaNJc/3p-4p"}, {"title": "Cuckold", "value": "genres/DSqPmNM/cuckold"}, {"title": "Digital Mosaic", "value": "genres/IdoowAI/digital-mosaic"}, {"title": "Slender", "value": "genres/CaENosY/slender"}, {"title": "Squirting", "value": "genres/HShdVAg/squirting"}, {"title": "School Girls", "value": "genres/CMwMXEY/school-girls"}, {"title": "Nasty, Hardcore", "value": "genres/HVOSKBU/nasty-hardcore"}, {"title": "Drama", "value": "genres/GUieHFE/drama"}, {"title": "JAV Uncensored", "value": "genres/javuncensored/jav-uncensored"}, {"title": "Incest", "value": "genres/ttzyfU/incest"}, {"title": "Titty Fuck", "value": "genres/EYjtJGI/titty-fuck"}, {"title": "Breasts", "value": "genres/FhKPzbk/breasts"}, {"title": "Planning", "value": "genres/BelfNeY/planning"}, {"title": "Cowgirl", "value": "genres/BrtnXsw/cowgirl"}, {"title": "POV", "value": "genres/BZXvyLU/pov"}, {"title": "Documentary", "value": "genres/waovUA/documentary"}, {"title": "Huge Butt", "value": "genres/BmfzJNE/huge-butt"}, {"title": "Facials", "value": "genres/HyKxxsQ/facials"}, {"title": "Abuse", "value": "genres/EGOOyiw/abuse"}, {"title": "Affair", "value": "genres/BWrHCvk/affair"}, {"title": "Best, Omnibus", "value": "genres/glzpZM/best-omnibus"}, {"title": "Older Sister", "value": "genres/BUKLrxc/older-sister"}, {"title": "Voyeur", "value": "genres/jSorDs/voyeur"}, {"title": "Humiliation", "value": "genres/DVXHZsY/humiliation"}, {"title": "Other Fetish", "value": "genres/DlLttTU/other-fetish"}, {"title": "Debut Production", "value": "genres/IgVddgQ/debut-production"}, {"title": "Nampa", "value": "genres/BEVUiDU/nampa"}, {"title": "OL", "value": "genres/BBofqrM/ol"}, {"title": "Deep Throating", "value": "genres/BualDEg/deep-throating"}, {"title": "Masturbation", "value": "genres/zHowlU/masturbation"}] }, { name: "maker", title: "制作商", type: "enumeration", value: "", enumOptions: [{"title": "Prestige", "value": "maker/DNvUFlk/prestige"}, {"title": "K.M.Produce", "value": "maker/BKBprXE/k-m-produce"}, {"title": "SOD Create", "value": "maker/BsMlzCg/sod-create"}, {"title": "MOODYZ", "value": "maker/CFUmAoI/moodyz"}, {"title": "Madonna", "value": "maker/BUdRNZs/madonna"}, {"title": "S1 NO.1 STYLE", "value": "maker/BMieoew/s1-no-1-style"}, {"title": "Attackers", "value": "maker/BcXxOyY/attackers"}, {"title": "IDEA POCKET", "value": "maker/CkydMyo/idea-pocket"}, {"title": "Hunter", "value": "maker/BXKOZGQ/hunter"}, {"title": "Glory Quest", "value": "maker/JzpYHfE/glory-quest"}, {"title": "Center Village", "value": "maker/FPHToDU/center-village"}, {"title": "Venus", "value": "maker/DVpmCKw/venus"}, {"title": "Takara Eizou", "value": "maker/JRfNqRc/takara-eizou"}, {"title": "Serebu No Tomo", "value": "maker/HiomwhM/serebu-no-tomo"}, {"title": "Planet Plus", "value": "maker/DLOfVHk/planet-plus"}, {"title": "Honnaka", "value": "maker/BmzFtSw/honnaka"}, {"title": "Fitch", "value": "maker/ELucNvk/fitch"}, {"title": "Das !", "value": "maker/HauUhiY/das"}, {"title": "Deeps", "value": "maker/KSKweZU/deeps"}, {"title": "BIGMORKAL", "value": "maker/GSUAIJU/bigmorkal"}] }, { name: "page", title: "页码", type: "page", value: "1" }] }
  ]
};

var HOST = "https://javmove.com";
var WORKER = "https://javmove-fetch.li768435813.workers.dev";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/604.1.14 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1";

// 顶级题材 type_id -> 站内题材页（与 GENRES 前 40 里的同一地址）
var GENRE_TOP = {
  "g-uncensored": "genres/javuncensored/jav-uncensored",
  "g-bigtits": "genres/BJiygps/big-tits",
  "g-hugebutt": "genres/BmfzJNE/huge-butt",
  "g-creampie": "genres/GVWkCw/creampie",
  "g-married": "genres/BcEqYww/married-woman",
  "g-mature": "genres/DFiQTPU/mature-woman",
  "g-solowork": "genres/QxHGjE/solowork",
  "g-amateur": "genres/BHCJmMg/amateur"
};

function t(v) {
  return String(v == null ? "" : v).trim().replace(/\s+/g, " ");
}

function decodeHtml(s) {
  return String(s || "")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, function (m, d) { var c = parseInt(d, 10); return (c > 0 && c < 0x110000) ? String.fromCharCode(c) : m; })
    .replace(/&#x([0-9a-fA-F]+);/g, function (m, h) { var c = parseInt(h, 16); return (c > 0 && c < 0x110000) ? String.fromCharCode(c) : m; });
}

function cleanText(s) {
  return decodeHtml(t(String(s || "").replace(/<[^>]*>/g, " ")));
}

function attrVal(tag, name) {
  var m = String(tag || "").match(new RegExp(name + "\\s*=\\s*\"([^\"]*)\"", "i"))
    || String(tag || "").match(new RegExp(name + "\\s*=\\s*'([^']*)'", "i"));
  return m ? m[1] : "";
}

// 封面取法（猫源 R2 坐实）：data-srcset > data-src/data-original > srcset > src，
// 一律只收 http(s)，data: URI 与相对地址一律拒收。
function pickImg(tag) {
  if (!tag) return "";
  var s = String(tag);
  var fromSet = attrVal(s, "data-srcset") || attrVal(s, "srcset");
  if (fromSet) {
    var u = fromSet.split(/[\s,]+/).filter(Boolean)[0] || "";
    if (/^https?:\/\//i.test(u)) return u;
  }
  var names = ["data-src", "data-original"];
  for (var i = 0; i < names.length; i++) {
    var u2 = attrVal(s, names[i]);
    if (/^https?:\/\//i.test(u2)) return u2;
  }
  var src = attrVal(s, "src");
  if (/^https?:\/\//i.test(src)) return src;
  return "";
}

async function getHtml(url, referer) {
  try {
    var res = await Widget.http.get(url, {
      headers: { "User-Agent": UA, "Referer": referer || HOST + "/" }
    });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    return body;
  } catch (e) { return ""; }
}

function parseList(html) {
  var out = [];
  var byId = {};
  if (!html) return out;
  var re = /<a[^>]*href="(\/movie\/([A-Za-z0-9]+)\/([^"]*))"[^>]*>([\s\S]*?)<\/a>/gi;
  var m;
  while ((m = re.exec(html)) !== null) {
    var path = m[1];
    var mid = m[2];
    var slug = m[3];
    var body = m[4] || "";
    if (!mid || !slug) continue;
    var imTag = body.match(/<img[^>]*>/i);
    var pic = pickImg(imTag ? imTag[0] : "");
    var text = cleanText(body);
    if (!imTag && !text) continue;
    var item = byId[mid];
    if (!item) {
      item = { id: HOST + path, type: "url", title: "", posterPath: "", coverUrl: "", backdropPath: "", link: HOST + path, description: "", mediaType: "movie" };
      byId[mid] = item;
      out.push(item);
    }
    if (pic && !item.posterPath) { item.posterPath = pic; item.coverUrl = pic; item.backdropPath = pic; }
    if (text && (!item.title || text.length > item.title.length)) item.title = text;
  }
  var res = [];
  for (var i = 0; i < out.length; i++) {
    var it = out[i];
    if (!it.title) continue;
    var cm = it.title.match(/^([A-Za-z]{2,10}-\d{2,8})/);
    if (cm) it.description = cm[1].toUpperCase();
    res.push(it);
  }
  return res;
}

function emptyItem(msg) {
  return [{ id: "empty", type: "url", title: msg || "没有找到相关内容" }];
}

function listUrl(zone, sub, page) {
  var url;
  if (sub && (sub.indexOf("genres/") === 0 || sub.indexOf("maker/") === 0)) {
    url = HOST + "/" + sub;
    if (page > 1) url += "?page=" + page;
  } else if (GENRE_TOP[zone]) {
    url = HOST + "/" + GENRE_TOP[zone];
    if (page > 1) url += "?page=" + page;
  } else if (zone === "release") {
    url = HOST + "/release";
    if (page > 1) url += "?page=" + page;
  } else if (zone === "upcoming") {
    url = HOST + "/upcoming";
    if (page > 1) url += "?page=" + page;
  } else {
    url = page <= 1 ? HOST + "/" : HOST + "/?page=" + page;
  }
  return url;
}

async function loadList(params) {
  params = params || {};
  var zone = t(params.zone || params.path || params.cat || "latest");
  var sub = t(params.genre || params.maker || params.sub || "");
  var page = Math.max(1, parseInt(params.page, 10) || 1);
  try {
    var html = await getHtml(listUrl(zone, sub, page));
    var list = parseList(html);
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
    var url = HOST + "/search?q=" + encodeURIComponent(wd);
    if (page > 1) url += "&page=" + page;
    var html = await getHtml(url);
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

function movieOf(durl) {
  var m = String(durl || "").match(/\/movie\/([A-Za-z0-9]+)\/([^/?#]+)/i);
  return m ? { id: m[1], slug: m[2] } : { id: "", slug: "" };
}

// 详情页格式区：<h3 class="video-format-header">FullHD</h3> + 其后 part 按钮；
// 每组每 part 出一线；token 只嵌在当前（active）part 那一行。
function parseFormats(html, mv, token) {
  var lines = [];
  if (!html) return lines;
  var tok = token ? ":" + token : "";
  var heads = [];
  var hre = /video-format-header[^>]*>\s*([^<]+?)\s*<\/h3>/g;
  var hm;
  while ((hm = hre.exec(html)) !== null) heads.push({ name: hm[1], index: hm.index, len: hm[0].length });
  for (var i = 0; i < heads.length; i++) {
    var fmt = t(heads[i].name);
    if (!fmt) continue;
    var type = fmt.toUpperCase().replace(/[^A-Z0-9]/g, "");
    var segStart = heads[i].index + heads[i].len;
    var segEnd = (i + 1 < heads.length) ? heads[i + 1].index : Math.min(html.length, segStart + 4000);
    var seg = html.slice(segStart, segEnd);
    var typeInSeg = seg.match(/[?&]type=([A-Za-z0-9_-]+)/i);
    var canonType = typeInSeg ? typeInSeg[1].toUpperCase() : type;
    var bre = /<a[^>]*video-source-btn[^>]*>([^<]*)<\/a>/g;
    var bm;
    var hasBtn = false;
    while ((bm = bre.exec(seg)) !== null) {
      hasBtn = true;
      var tag = bm[0] || "";
      var href = attrVal(tag, "href");
      var part = t(bm[1]) || "1";
      var isActive = /video-source-active/.test(tag);
      var ptype = canonType;
      var pnum = part;
      var qm = href.match(/[?&]type=([^&]+)&p=(\d+)/i);
      if (qm) { ptype = qm[1].toUpperCase(); pnum = qm[2]; }
      lines.push({ name: fmt + "·P" + pnum, id: "move:" + mv.id + ":" + mv.slug + ":" + ptype + ":" + pnum + (isActive ? tok : "") });
    }
    if (!hasBtn) lines.push({ name: fmt + "·P1", id: "move:" + mv.id + ":" + mv.slug + ":" + canonType + ":1" + tok });
  }
  return lines;
}

async function loadDetail(link) {
  try {
    var durl = unwrapLink(link);
    if (!durl) return { id: "err", type: "url", title: "解析失败", description: "链接为空" };
    if (durl.indexOf("http") !== 0) durl = HOST + durl;
    var mv = movieOf(durl);
    var html = await getHtml(durl);
    if (!html) return { id: durl, type: "url", title: "详情获取失败", description: "页面无返回" };
    var name = "";
    var tm = html.match(/<title>([^<]*)<\/title>/i);
    if (tm) name = cleanText(tm[1]).replace(/\s*\|\s*JAVMove\s*$/i, "").trim();
    var pic = "";
    var pm = html.match(/data-srcset\s*=\s*"([^"]+)"/i);
    if (pm) {
      var u = pm[1].split(/[\s,]+/).filter(Boolean)[0] || "";
      if (/^https?:\/\//i.test(u)) pic = u;
    }
    if (!pic) {
      var sm = html.match(/<li class="splide__slide">[\s\S]{0,600}?<img[^>]*>/i);
      if (sm) pic = pickImg(sm[0]);
    }
    var dm0 = html.match(/data-id="([^"]+)"/);
    var token = dm0 ? dm0[1] : "";
    var lines = parseFormats(html, mv, token);
    // 无格式区且无 token：即将上映无片源（猫源 v5 结论），不给播放按钮。
    if (!lines.length && token) lines = [{ name: "正片", id: "move:" + mv.id + ":" + mv.slug + "::1:" + token }];
    var eps = [];
    var epItems = [];
    var seasonEps = [];
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];
      eps.push({ name: ln.name, link: ln.id });
      seasonEps.push({ title: ln.name, episodeNumber: i + 1 });
      epItems.push({
        id: ln.id,
        type: "url",
        title: ln.name,
        mediaType: "movie",
        posterPath: pic,
        link: ln.id,
        episode: i + 1,
        episodeNumber: i + 1,
        seasonIndex: 1,
        seasonNumber: 1
      });
    }
    var result = {
      id: durl,
      type: "detail",
      title: name || mv.slug || durl,
      name: name || mv.slug || durl,
      description: lines.length ? "格式·分集（点哪条播哪条）" : "即将上映，暂无片源",
      mediaType: "movie",
      link: durl,
      coverUrl: pic,
      posterPath: pic,
      backdropPath: pic,
      playerType: "app"
    };
    if (eps.length) {
      result.episodes = eps;
      result.seasons = [{ seasonNumber: 1, title: "线路", name: "线路", episodes: seasonEps }];
      result.episodeItems = epItems;
      result.childItems = epItems;
    }
    return result;
  } catch (e) {
    return { id: unwrapLink(link) || "err", type: "url", title: "请求错误", description: String((e && e.message) || e) };
  }
}

// /watch 直取（必须带 Referer；不带则 200 但正文仅 "re"）
async function watchByToken(token, referer) {
  try {
    var txt = await getHtml(HOST + "/watch?token=" + encodeURIComponent(token), referer);
    var url = t(txt);
    return /^https?:\/\//i.test(url) ? url : "";
  } catch (e) { return ""; }
}

// Worker 整链代取：/resolve 在 Worker 内做 part 页 -> data-id -> /watch
async function watchByWorker(mid, slug, type, part) {
  try {
    var u = WORKER + "/resolve?mid=" + encodeURIComponent(mid)
      + "&slug=" + encodeURIComponent(slug)
      + "&type=" + encodeURIComponent(type || "")
      + "&p=" + encodeURIComponent(part || "1");
    var res = await Widget.http.get(u, { headers: { "User-Agent": UA } });
    var body = res && res.data != null ? (typeof res.data === "string" ? res.data : JSON.stringify(res.data)) : "";
    var j = null;
    try { j = JSON.parse(body); } catch (e) { return ""; }
    if (j && j.ok && /^https?:\/\//i.test(j.url || "")) return j.url;
    return "";
  } catch (e) { return ""; }
}

// .cfd/vs/ 直链走 Worker /stream 包一层（猫源 streamUrl 同款）
function streamUrl(url) {
  if (!WORKER || !/^https?:\/\/[^/]+\.cfd\/vs\//i.test(url || "")) return url;
  return WORKER + "/stream?u=" + encodeURIComponent(url);
}

function playRow(url, durl) {
  return { name: "播放", url: streamUrl(url), playerType: "system", customHeaders: { "User-Agent": UA, "Referer": HOST + "/", "Connection": "keep-alive" } };
}

async function loadResource(params) {
  if (typeof params === "string") params = { link: params };
  params = params || {};
  var raw = t(params.link || params.url || params.id || "");
  if (!raw && params.item) raw = t(params.item.link || params.item.id || "");
  if (!raw) return [];
  // 播放 id: move:<mid>:<slug>:<type>:<part>[:<token>]
  var parts = raw.split(":");
  if (parts.length < 5 || parts[0] !== "move") {
    // 直链 mp4 兜底
    if (/\.mp4(\?|#|$)/i.test(raw)) return [playRow(raw, HOST + "/")];
    return [];
  }
  var mid = parts[1] || "";
  var slug = parts[2] || "";
  var type = parts[3] || "";
  var part = parts[4] || "";
  var token = parts.length > 5 ? parts.slice(5).join(":") : "";
  if (!mid || !slug || !/^\d+$/.test(part)) return [];
  var durl = HOST + "/movie/" + mid + "/" + slug;
  var partUrl = type ? durl + "?type=" + type + "&p=" + part : durl;
  // (1) 快径：详情嵌的 token，单次 /watch 直取
  if (token) {
    var u1 = await watchByToken(token, durl);
    if (u1) return [playRow(u1, durl)];
  }
  // (2) Worker 整链代取
  var u2 = await watchByWorker(mid, slug, type, part);
  if (u2) return [playRow(u2, durl)];
  // (3) 直连：按 part 地址现取 data-id，再调 /watch
  var html = await getHtml(partUrl);
  if (!html) return [];
  var dm = html.match(/data-id="([^"]+)"/);
  if (!dm) return [];
  var u3 = await watchByToken(dm[1], partUrl);
  if (!u3) return [];
  return [playRow(u3, durl)];
}
