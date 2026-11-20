// Bitch Lives for REX (NSFW-LIVE-rex-fixed.js v1.0.1)
// v1.0.1（2026-11-21）：弱版搜索——站方无搜索接口（API 只有按分类取列表），
// 全局搜索只拉默认分类（卡哇伊 jsonkawayi）一个文件、按房间 title 含关键词过滤，
// 其余 ~126 个分类不在搜索范围内；搜索条目标题已注明“仅卡哇伊分类”，不要误当全站搜索。
// 双声明写法照 JavRate 1.0.6（已真机证实能进搜索源列表）。
var WidgetMetadata = {
  id: "Bitch",
  title: "Bitch Lives",
  description: "Bitch Lives",
  author: "Discount Code：VEUS",
  site: "Discount Code：VEUS",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  modules: [
    {
      id: "search",
      title: "搜索（仅卡哇伊分类）",
      functionName: "search",
      cacheDuration: 60,
      params: [
        { name: "keyword", title: "关键词", type: "input" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      id: "live",
      title: "碧池直播",
      requiresWebView: false,
      functionName: "getVideos",
      params: [
        {
          name: "category",
          title: "类型",
          type: "enumeration",
          value: "jsonkawayi",
          enumOptions: [
            { title: "卡哇伊", value: "jsonkawayi" },
            { title: "咪狐", value: "jsonmihu" },
            { title: "花蝴蝶", value: "jsonhuahudie" },
            { title: "蜜桃", value: "jsonmitao" },
            { title: "番茄社区", value: "jsonfanjiashequ" },
            { title: "LOVE", value: "jsonLOVE" },
            { title: "小妲己", value: "jsonxiaodaji" },
            { title: "77直播", value: "json77zhibo" },
            { title: "依依", value: "jsonyiyi" },
            { title: "日出", value: "jsonrichu" },
            { title: "彩虹", value: "jsoncaihong" },
            { title: "久久", value: "jsonjiujiu" },
            { title: "亚米", value: "jsonyami" },
            { title: "蝶恋", value: "jsondielian" },
            { title: "夜妖姬", value: "jsonyeyaoji" },
            { title: "套路", value: "jsontaolu" },
            { title: "樱花", value: "jsonyinghua" },
            { title: "享色", value: "jsonxiangse" },
            { title: "红浪漫", value: "jsonhonglangman" },
            { title: "金鱼", value: "jsonjinyu" },
            { title: "桃花", value: "jsontaohua" },
            { title: "花房", value: "jsonhuafang" },
            { title: "小仙女", value: "jsonxiaoxiannv" },
            { title: "视觉秀", value: "jsonshijuexiu" },
            { title: "小天使", value: "jsonxiaotianshi" },
            { title: "一直播", value: "jsonyizhibo" },
            { title: "彩云", value: "jsoncaiyun" },
            { title: "暗语", value: "jsonanyu" },
            { title: "咪咪", value: "jsonmimi" },
            { title: "娇媚", value: "jsonjiaomei" },
            { title: "黄瓜", value: "jsonhuanggua" },
            { title: "色趣", value: "jsonsequ" },
            { title: "糯米", value: "jsonnuomi" },
            { title: "小蜜蜂", value: "jsonxiaomifeng" },
            { title: "小红帽", value: "jsonxiaohongmao" },
            { title: "桃花运", value: "jsontaohuayun" },
            { title: "苦瓜", value: "jsonkugua" },
            { title: "爱爱你", value: "jsonaiaini" },
            { title: "樱花雨i", value: "jsonyinghuayui" },
            { title: "盘他", value: "jsonpanta" },
            { title: "夜色", value: "jsonyese" },
            { title: "蝴蝶", value: "jsonhudie" },
            { title: "小天仙", value: "jsonxiaotianxian" },
            { title: "杏趣", value: "jsonxingqu" },
            { title: "小坏蛋", value: "jsonxiaohuaidan" },
            { title: "飘雪", value: "jsonpiaoxue" },
            { title: "樱桃", value: "jsonyingtao" },
            { title: "奥斯卡", value: "jsonaosika" },
            { title: "卡路里", value: "jsonkaluli" },
            { title: "红高粱", value: "jsonhonggaoliang" },
            { title: "付宝", value: "jsonfubao" },
            { title: "小黄书", value: "jsonxiaohuangshu" },
            { title: "二嫂", value: "jsonersao" },
            { title: "花果山", value: "jsonhuaguoshan" },
            { title: "云鹿", value: "jsonyunlu" },
            { title: "菠萝", value: "jsonboluo" },
            { title: "星宝贝", value: "jsonxingbaobei" },
            { title: "夜艳", value: "jsonyeyan" },
            { title: "七仙女s", value: "jsonqixiannus" },
            { title: "夜来香", value: "jsonyelaixiang" },
            { title: "爱零", value: "jsonailing" },
            { title: "十八禁", value: "jsonshibajin" },
            { title: "兰桂坊", value: "jsonlanguifang" },
            { title: "Dancelife", value: "jsonDancelife" },
            { title: "小萌猪", value: "jsonxiaomengzhu" },
            { title: "蝴蝶飞", value: "jsonhudiefei" },
            { title: "幽梦", value: "jsonyoumeng" },
            { title: "丽柜厅", value: "jsonliguiting" },
            { title: "蛟龙", value: "jsonjiaolong" },
            { title: "颜如玉", value: "jsonyanruyu" },
            { title: "橙秀", value: "jsonchengxiu" },
            { title: "豹娱l", value: "jsonbaoyul" },
            { title: "小花螺", value: "jsonxiaohualuo" },
            { title: "皇后", value: "jsonhuanghou" },
            { title: "心之恋", value: "jsonxinzhilian" },
            { title: "欧美FEATURED", value: "jsonoumeiFEATURED" },
            { title: "欧美FEMALE", value: "jsonoumeiFEMALE" },
            { title: "欧美MALE", value: "jsonoumeiMALE" },
            { title: "欧美COUPLE", value: "jsonoumeiCOUPLE" },
            { title: "欧美TRANS", value: "jsonoumeiTRANS" },
            { title: "台妹l", value: "jsontaimeil" },
            { title: "爱恋", value: "jsonailian" },
            { title: "903娱乐", value: "json903yule" },
            { title: "九尾狐", value: "jsonjiuweihu" },
            { title: "尤物岛", value: "jsonyouwudao" },
            { title: "坦克", value: "jsontanke" },
            { title: "好基友", value: "jsonhaojiyou" },
            { title: "夜女郎", value: "jsonyenulang" },
            { title: "娇喘", value: "jsonjiaochuan" },
            { title: "芒果派", value: "jsonmangguopai" },
            { title: "媚颜", value: "jsonmeiyan" },
            { title: "风流", value: "jsonfengliu" },
            { title: "夜律", value: "jsonyelu" },
            { title: "玲珑", value: "jsonlinglong" },
            { title: "浴火", value: "jsonyuhuo" },
            { title: "翠鸟", value: "jsoncuiniao" },
            { title: "幸运星", value: "jsonxingyunxing" },
            { title: "她秀", value: "jsontaxiu" },
            { title: "招财猫", value: "jsonzhaocaimao" },
            { title: "双碟", value: "jsonshuangdie" },
            { title: "糖果", value: "jsontangguo" },
            { title: "么么哒", value: "jsonmemeda" },
            { title: "小性感", value: "jsonxiaoxinggan" },
            { title: "小喵宠", value: "jsonxiaomiaochong" },
            { title: "兔女郎", value: "jsontunulang" },
            { title: "睡美人", value: "jsonshuimeiren" },
            { title: "金呗", value: "jsonjinbei" },
            { title: "美夕", value: "jsonmeixi" },
            { title: "小妖", value: "jsonxiaoyao" },
            { title: "约直播", value: "jsonyuezhibo" },
            { title: "花仙子", value: "jsonhuaxianzi" },
            { title: "土豪", value: "jsontuhao" },
            { title: "红妆", value: "jsonhongzhuang" },
            { title: "妞妞", value: "jsonniuniu" },
            { title: "艳后", value: "jsonyanhou" },
            { title: "moon", value: "jsonmoon" },
            { title: "蓝猫", value: "jsonlanmao" },
            { title: "美人妆", value: "jsonmeirenzhuang" },
            { title: "入巷", value: "jsonruxiang" },
            { title: "持久男", value: "jsonchijiunan" },
            { title: "倾心", value: "jsonqingxin" },
            { title: "小精灵", value: "jsonxiaojingling" },
            { title: "偶遇", value: "jsonouyu" },
            { title: "灰灰", value: "jsonhuihui" },
            { title: "猫头鹰", value: "jsonmaotouying" },
            { title: "喜欢你", value: "jsonxihuanni" },
            { title: "夜纯", value: "jsonyechun" },
            { title: "杏播", value: "jsonxingbo" },
            { title: "名流", value: "jsonmingliu" },
            { title: "小辣椒", value: "jsonxiaolajiao" },
            { title: "蚊香社", value: "jsonwenxiangshe" },
            { title: "牵手", value: "jsonqianshou" },
            { title: "情趣", value: "jsonqingqu" }
          ]
        }
      ]
    },
    {
      id: "loadResource",
      title: "直播播放源",
      description: "播放时解析直播流",
      functionName: "loadResource",
      type: "stream",
      cacheDuration: 0,
      params: []
    }
  ],
  search: {
    title: "搜索（仅卡哇伊分类）",
    functionName: "search",
    params: [
      { name: "keyword", title: "关键词", type: "input" },
      { name: "page", title: "页码", type: "page" }
    ]
  }
};

async function getVideos(params = {}) {
  try {
    // 1. 参数处理（未选择分类时用默认值，避免客户端未传递默认值时报错）
    const category = params.category || "jsonkawayi";

    // 2. 构建请求URL
    const url = `http://api.maiyoux.com:81/mf/${category}.txt`;
    console.log('[视频获取] 请求URL:', url);

    // 3. 发送请求
    const response = await Widget.http.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 4.4.2; OPPO R11 Build/NMF26X) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36',
        "Content-Type": "application/octet-stream"
      }
    });

    // 4. 响应数据验证（接口返回 Content-Type: text/plain，data 为字符串，需手动解析）
    if (response?.data == null || response.data === "") {
      throw new Error("API返回空数据");
    }
    let apiData = response.data;
    if (typeof apiData === "string") {
      try { apiData = JSON.parse(apiData.trim()); }
      catch (_) { throw new Error("API返回的数据不是合法 JSON"); }
    }

    // 5. 数据结构验证
    if (typeof apiData !== "object" || !apiData || !Array.isArray(apiData.zhubo)) {
      throw new Error("无效的数据格式");
    }

    // 6. 数据转换与过滤
    const videos = apiData.zhubo
      .filter(item => item.address && item.title) // 过滤无效条目
      .map(item => ({
        id: item.address,
        type: "url",
        title: item.title.trim(),
        mediaType: "movie",
        link: item.address,
        coverUrl: item.img || '',
        posterPath: item.img || '',
        backdropPath: item.img || ''
      }));

    if (videos.length === 0) {
      console.warn('警告: 过滤后视频列表为空，原始数据:', response.data);
    }

    return videos;

  } catch (error) {
    throw new Error(`视频获取失败: ${error.message}`);
  }
}

// 弱版搜索：只搜默认分类（卡哇伊 jsonkawayi），按房间 title 含关键词过滤。
// 站方无搜索接口，只拉一个分类文件；其余分类不在搜索范围内（见文件头注释）。
async function search(params) {
  params = params || {};
  var wd = "";
  var keys = ["keyword", "q", "search", "text", "query", "wd", "key"];
  for (var i = 0; i < keys.length; i++) {
    if (params[keys[i]]) { wd = String(params[keys[i]]).trim(); break; }
  }
  if (!wd) return [{ id: "tip", type: "url", title: "输入关键词搜索" }];
  try {
    var url = "http://api.maiyoux.com:81/mf/jsonkawayi.txt";
    var res = await Widget.http.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 4.4.2; OPPO R11 Build/NMF26X) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36',
        "Content-Type": "application/octet-stream"
      }
    });
    var data = res && res.data;
    if (data == null || data === "") return [{ id: "empty", type: "url", title: "没有找到相关影片" }];
    if (typeof data === "string") {
      try { data = JSON.parse(data.trim()); } catch (_) { return [{ id: "err", type: "url", title: "搜索失败: 数据格式错误" }]; }
    }
    if (typeof data !== "object" || !data || !Array.isArray(data.zhubo)) {
      return [{ id: "empty", type: "url", title: "没有找到相关影片" }];
    }
    var needle = wd.toLowerCase();
    var list = data.zhubo
      .filter(function (item) { return item.address && item.title && String(item.title).toLowerCase().indexOf(needle) !== -1; })
      .map(function (item) {
        return {
          id: item.address,
          type: "url",
          title: String(item.title).trim(),
          mediaType: "movie",
          link: item.address,
          coverUrl: item.img || '',
          posterPath: item.img || '',
          backdropPath: item.img || ''
        };
      });
    return list.length ? list : [{ id: "empty", type: "url", title: "没有找到相关影片" }];
  } catch (e) {
    return [{ id: "err", type: "url", title: "搜索失败: " + String((e && e.message) || e).slice(0, 50) }];
  }
}

// REX stream 模块：播放时把条目的 link 解析为可播资源（FLV 走应用内播放器）
async function loadResource(params) {
  params = params || {};
  var raw = String(params.link || params.url || params.id || "").trim();
  if (!/^https?:\/\/[^\s]+$/i.test(raw)) return [];
  return [{
    name: "直播",
    description: "FLV 直播流",
    url: raw,
    playerType: "app",
    customHeaders: { "X-Forward-Skip-Redirect-Probe": "1" }
  }];
}
