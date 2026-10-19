WidgetMetadata = {
  id: "123av_makka_play",
  title: "123AV",
  author: "𝙈𝙖𝙠𝙠𝙖𝙋𝙖𝙠𝙠𝙖",
  description: "3.2.0 優先 1080P，沒有再退 720",
  version: "3.2.0",
  requiredVersion: "0.0.1",
  site: "https://missav.fans",
  detailCacheDuration: 180,
  modules: [
    {
      title: "搜尋番號",
      functionName: "searchByCode",
      cacheDuration: 60,
      params: [
        { name: "keyword", title: "番號", type: "input", value: "", description: "例如 SSIS-001、FCT-218" },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "熱門",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "週期",
          type: "enumeration",
          value: "today-hot",
          enumOptions: [
            { title: "今日熱門", value: "today-hot" },
            { title: "本週熱門", value: "weekly-hot" },
            { title: "本月熱門", value: "monthly-hot" }
          ]
        },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "最新",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "列表",
          type: "enumeration",
          value: "new",
          enumOptions: [
            { title: "最近更新", value: "new" },
            { title: "新作上市", value: "release" }
          ]
        },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "中文字幕",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "chinese-subtitle" },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "無碼",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "類型",
          type: "enumeration",
          value: "uncensored-leak",
          enumOptions: [
            { title: "無碼流出", value: "uncensored-leak" },
            { title: "FC2", value: "fc2" }
          ]
        },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "絲襪",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/" + encodeURIComponent("絲襪") },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "空姐",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/" + encodeURIComponent("空姐") },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "秘書",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/" + encodeURIComponent("秘書") },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "老師",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/" + encodeURIComponent("女教師") },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "美少女",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/" + encodeURIComponent("美少女") },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "熟女",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/" + encodeURIComponent("熟女") },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "護士",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/" + encodeURIComponent("護士") },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "制服",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/" + encodeURIComponent("制服") },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "女僕",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/" + encodeURIComponent("女僕") },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "偶像",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/" + encodeURIComponent("偶像") },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "人妻",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/" + encodeURIComponent("人妻") },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "蘿莉",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        { name: "path", title: "列表", type: "constant", value: "genres/" + encodeURIComponent("蘿莉") },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    },
    {
      title: "題材",
      functionName: "loadList",
      cacheDuration: 180,
      params: [
        {
          name: "path",
          title: "題材",
          type: "enumeration",
          value: "genres/" + encodeURIComponent("中出"),
          enumOptions: [
            { title: "中出", value: "genres/" + encodeURIComponent("中出") },
            { title: "巨乳", value: "genres/" + encodeURIComponent("巨乳") },
            { title: "素人", value: "genres/" + encodeURIComponent("素人") },
            { title: "人妻", value: "genres/" + encodeURIComponent("人妻") },
            { title: "多P", value: "genres/" + encodeURIComponent("3P・4P") },
            { title: "調教", value: "genres/" + encodeURIComponent("調教奴隸") },
            { title: "NTR", value: "genres/NTR" },
            { title: "美少女", value: "genres/" + encodeURIComponent("美少女") },
            { title: "熟女", value: "genres/" + encodeURIComponent("熟女") },
            { title: "巨尻", value: "genres/" + encodeURIComponent("巨尻") },
            { title: "口交", value: "genres/" + encodeURIComponent("口交") },
            { title: "潮吹", value: "genres/" + encodeURIComponent("潮吹") },
            { title: "凌辱", value: "genres/" + encodeURIComponent("凌辱") },
            { title: "顏射", value: "genres/" + encodeURIComponent("顏射") },
            { title: "肛交", value: "genres/" + encodeURIComponent("肛交") },
            { title: "乳交", value: "genres/" + encodeURIComponent("乳交") },
            { title: "手淫", value: "genres/" + encodeURIComponent("手淫") },
            { title: "自慰", value: "genres/" + encodeURIComponent("自慰") },
            { title: "女優", value: "genres/" + encodeURIComponent("女優") },
            { title: "偶像", value: "genres/" + encodeURIComponent("偶像") },
            { title: "偷拍", value: "genres/" + encodeURIComponent("偷拍") },
            { title: "偷窺", value: "genres/" + encodeURIComponent("偷窺") },
            { title: "車震", value: "genres/" + encodeURIComponent("車震") },
            { title: "女僕", value: "genres/" + encodeURIComponent("女僕") },
            { title: "蘿莉", value: "genres/" + encodeURIComponent("蘿莉") },
            { title: "溫泉", value: "genres/" + encodeURIComponent("溫泉") },
            { title: "野外", value: "genres/" + encodeURIComponent("野外") },
            { title: "企劃", value: "genres/" + encodeURIComponent("企劃") },
            { title: "單體作品", value: "genres/" + encodeURIComponent("單體作品") },
            { title: "OL", value: "genres/" + encodeURIComponent("OL") },
            { title: "泳裝", value: "genres/" + encodeURIComponent("泳裝") },
            { title: "眼鏡", value: "genres/" + encodeURIComponent("眼鏡") },
            { title: "痴女", value: "genres/" + encodeURIComponent("痴女") },
            { title: "未亡人", value: "genres/" + encodeURIComponent("未亡人") },
            { title: "義母", value: "genres/" + encodeURIComponent("義母") },
            { title: "姐姐", value: "genres/" + encodeURIComponent("姐姐") }
          ]
        },
        { name: "page", title: "頁碼", type: "page", value: "1" }
      ]
    }
  ]
};

const HOSTS = [
  "https://missav.fans"
];
let BASE_URL = HOSTS[0];
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function headers(referer) {
  return {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8",
    "Referer": referer || BASE_URL + "/"
  };
}

function isChallenge(html) {
  const raw = String(html || "");
  if (/text-secondary|fourhoi|surrit/i.test(raw) && raw.length > 20000) return false;
  return /<title[^>]*>\s*Just a moment/i.test(raw) || /verify you are human/i.test(raw.slice(0, 800));
}

function absUrl(href) {
  if (!href) return "";
  if (href.startsWith("http")) return href.split("#")[0].split("?")[0];
  return BASE_URL + (href.startsWith("/") ? href : "/" + href);
}

function videoTail(href) {
  const parts = absUrl(href).replace(/\/+$/, "").split("/");
  return (parts.pop() || "").toLowerCase();
}

function isVideoTail(tail) {
  if (!tail) return false;
  if (/^(new|release|fc2|search|genres|actresses|makers|vip|chinese-subtitle|uncensored-leak|today-hot|weekly-hot|monthly-hot|cn|dm\d+)$/i.test(tail)) return false;
  return /(?:fc2[-_]?ppv[-_]?\d+|[a-z]{2,12}-\d{2,6}|heyzo[-_]?\d{3,5}|\d{6}[-_]\d{2,4})/i.test(tail);
}

function baseCode(tail) {
  return String(tail || "")
    .replace(/-uncensored-leak$/i, "")
    .replace(/-uncensored$/i, "")
    .replace(/-chinese-subtitle$/i, "")
    .toLowerCase();
}

function coverOf(tail, img) {
  if (img && !/^data:/.test(img)) {
    return img
      .replace(/cover-t\.jpg/i, "cover-n.jpg")
      .replace("fourhoi.com", "fourhoi.mrstcdn.store");
  }
  const t = String(tail || "").replace(/\/+$/, "");
  return "https://fourhoi.mrstcdn.store/" + t + "/cover-t.jpg";
}

function parseVideoList(html, mode) {
  if (!html) return [{ id: "empty", type: "url", title: "空頁面" }];
  if (isChallenge(html)) {
    return [{ id: "err_cf", type: "url", title: "被 Cloudflare 攔截，請稍後重試或換網路" }];
  }
  if (html.includes("找不到頁面")) {
    return [{ id: "empty", type: "url", title: "分類不存在" }];
  }

  const $ = Widget.html.load(html);
  const map = new Map();

  $("a[href]").each((i, el) => {
    const $a = $(el);
    const href = $a.attr("href") || "";
    const tail = videoTail(href);
    if (!isVideoTail(tail)) return;

    const isLeak = /uncensored-leak/i.test(tail);
    const isSub = /chinese-subtitle/i.test(tail);
    if (mode !== "leak" && mode !== "all" && isLeak) return;
    if (mode !== "subtitle" && mode !== "all" && isSub) return;

    const full = absUrl(href);
    const code = baseCode(tail);
    const key = (mode === "leak" || mode === "subtitle") ? tail : code;
    let rec = map.get(key);
    if (!rec) {
      rec = { link: full, code: code, tail: tail, title: "", duration: "", img: "" };
      map.set(key, rec);
    }

    const text = ($a.attr("title") || $a.text() || "").replace(/\s+/g, " ").trim();
    const timeMatch = text.match(/^(\d{1,2}:\d{2}(?::\d{2})?)$/);
    if (timeMatch) rec.duration = timeMatch[1];
    else if (text.length > rec.title.length && text.length > 2) rec.title = text;

    const $img = $a.find("img").first();
    if ($img.length) {
      const src = $img.attr("data-src") || $img.attr("src") || "";
      if (src && !src.startsWith("data:")) rec.img = src;
    }
  });

  const results = [];
  for (const rec of map.values()) {
    const img = coverOf(rec.tail, rec.img);
    results.push({
      id: rec.link,
      type: "url",
      title: rec.title || rec.code.toUpperCase(),
      backdropPath: img,
      coverUrl: img,
      posterPath: img,
      link: rec.link,
      description: rec.code.toUpperCase(),
      releaseDate: rec.duration || "",
      mediaType: "movie"
    });
  }
  return results.length ? results : [{ id: "empty", type: "url", title: "沒有找到相關影片" }];
}

function listPath(path) {
  let p = String(path || "new").replace(/^\/+/, "");
  if (!/^cn\//.test(p) && !/^dm\d+\//.test(p)) p = "cn/" + p;
  return "/" + p;
}

async function fetchHtml(url) {
  let lastErr = null;
  const ordered = [BASE_URL].concat(HOSTS.filter(function (h) { return h !== BASE_URL; }));
  const path = String(url).replace(/^https?:\/\/[^/]+/, "") || "/";
  for (let i = 0; i < ordered.length; i++) {
    const host = ordered[i];
    try {
      const res = await Widget.http.get(host + path, { headers: headers(host + "/") });
      const html = res && res.data != null ? String(res.data) : "";
      if (!html) throw new Error("空回應");
      if (isChallenge(html)) throw new Error("CF");
      BASE_URL = host;
      return html;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("連線失敗");
}

async function loadList(params = {}) {
  const page = params.page || 1;
  const path = params.path || "new";
  let url = BASE_URL + listPath(path);
  if (Number(page) > 1) url += (url.indexOf("?") >= 0 ? "&" : "?") + "page=" + page;

  let mode = "normal";
  if (String(path).indexOf("chinese-subtitle") >= 0) mode = "subtitle";
  else if (/uncensored-leak|fc2/i.test(String(path))) mode = "leak";

  try {
    return parseVideoList(await fetchHtml(url), mode);
  } catch (e) {
    return [{ id: "err", type: "url", title: "載入失敗", description: String(e.message || e) }];
  }
}

function normalizeCode(s) {
  s = String(s || "").trim().toLowerCase().replace(/\s+/g, "");
  const m = s.match(/^([a-z]{2,12})[-_]?(\d{2,6})$/i);
  if (m) return m[1].toLowerCase() + "-" + m[2];
  return s.replace(/_/g, "-");
}

function pickKeyword(params) {
  if (params == null) return "";
  if (typeof params === "string" || typeof params === "number") return String(params).trim();
  const keys = ["keyword", "q", "search", "text", "query", "wd", "key"];
  for (const k of keys) {
    if (params[k]) return String(params[k]).trim();
  }
  return "";
}

function cardFromCode(code, extra) {
  const tail = extra ? code + extra : code;
  const img = coverOf(tail, "");
  return {
    id: BASE_URL + "/cn/" + tail,
    type: "url",
    title: extra ? code.toUpperCase() + extra : code.toUpperCase(),
    coverUrl: img,
    backdropPath: img,
    posterPath: img,
    link: BASE_URL + "/cn/" + tail,
    description: code.toUpperCase(),
    mediaType: "movie"
  };
}

async function searchByCode(params = {}) {
  const keyword = pickKeyword(params);
  if (!keyword) {
    return [{ id: "tip", type: "url", title: "輸入番號後搜尋，例如 SSIS-001" }];
  }
  const code = normalizeCode(keyword);
  const fallback = [
    cardFromCode(code),
    cardFromCode(code, "-uncensored-leak"),
    cardFromCode(code, "-chinese-subtitle")
  ];
  try {
    const urls = [
      BASE_URL + "/cn/search/" + encodeURIComponent(keyword),
      BASE_URL + "/cn/search/" + encodeURIComponent(code)
    ];
    for (let i = 0; i < urls.length; i++) {
      try {
        const list = parseVideoList(await fetchHtml(urls[i]), "all");
        if (list.length && list[0].id !== "empty" && list[0].id !== "err_cf" && list[0].id !== "err") return list;
      } catch (_) {}
    }
  } catch (_) {}
  return fallback;
}

async function search(params = {}) {
  return searchByCode(params);
}

function extractM3u8(html) {
  if (!html) return "";
  const raw = String(html).replace(/\\\//g, "/");
  let host = "surrit.mrstcdn.store";
  let uuid = "";
  const hostUuid = raw.match(/https?:\/\/((?:surrit|nineyu|fourhoi|sixyik)[^/"'\s]+)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
  if (hostUuid) {
    host = hostUuid[1];
    uuid = hostUuid[2];
  } else {
    const seek = raw.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}).{0,80}seek/i);
    if (seek) uuid = seek[1];
  }
  if (!uuid) {
    const packed = raw.match(/m3u8\|[^"'<\s]+\|video/i);
    if (packed) {
      const s = packed[0].split("|");
      if (s.length >= 8) {
        host = s[7] + "." + s[6];
        uuid = s[5] + "-" + s[4] + "-" + s[3] + "-" + s[2] + "-" + s[1];
      }
    }
  }
  if (!uuid) {
    const direct = raw.match(/https?:\/\/[^"'\\\s]+\/playlist\.m3u8/i);
    return direct ? direct[0].replace(/\\+/g, "") : "";
  }
  const base = "https://" + host + "/" + uuid;
  return { base: base, master: base + "/playlist.m3u8" };
}

async function pickQuality(base) {
  const fallback = [
    "/1080p/video.m3u8",
    "/1920x1080/video.m3u8",
    "/1280x720/video.m3u8",
    "/720p/video.m3u8",
    "/playlist.m3u8"
  ];
  try {
    const res = await Widget.http.get(base + "/playlist.m3u8", { headers: headers(BASE_URL + "/") });
    const text = String(res && res.data != null ? res.data : "");
    const paths = text.split(/\n/).map(function (l) { return l.trim(); }).filter(function (l) { return l && l.charAt(0) !== "#"; });
    const prefer = [/1080/, /1920x1080/, /1280x720/, /720p/, /842x480|854x480/, /480p/];
    for (let i = 0; i < prefer.length; i++) {
      for (let j = 0; j < paths.length; j++) {
        if (prefer[i].test(paths[j])) {
          return paths[j].indexOf("http") === 0 ? paths[j] : base + "/" + paths[j].replace(/^\.\//, "");
        }
      }
    }
    if (paths.length) {
      const last = paths[paths.length - 1];
      return last.indexOf("http") === 0 ? last : base + "/" + last.replace(/^\.\//, "");
    }
  } catch (_) {}
  return base + fallback[0];
}

async function loadDetail(link) {
  try {
    let url = String(link || "");
    url = url.replace(/^https?:\/\/[^/]+/, BASE_URL);
    if (!/\/cn\//.test(url) && /missav\./.test(url)) {
      url = url.replace(/^(https?:\/\/[^/]+)\//, "$1/cn/");
    }
    const html = await fetchHtml(url);
    let title = "";
    let cover = "";
    try {
      const $ = Widget.html.load(html);
      title = $('meta[property="og:title"]').attr("content") || $("h1").first().text().trim() || "";
      cover = $('meta[property="og:image"]').attr("content") || "";
    } catch (_) {}
    if (!title) {
      const m = html.match(/<title[^>]*>([^<]+)/i);
      title = m ? m[1].replace(/\s*[|—–-].*$/, "").trim() : "MissAV";
    }
    const tail = videoTail(url);
    cover = coverOf(tail, cover);

    const found = extractM3u8(html);
    if (!found) {
      return { id: url, type: "url", title: title || "解析失敗", description: "未找到播放地址" };
    }
    const videoUrl = typeof found === "string" ? found : await pickQuality(found.base);
    if (!videoUrl) {
      return { id: url, type: "url", title: title || "解析失敗", description: "未找到播放地址" };
    }

    return {
      id: url,
      type: "detail",
      title: title,
      link: url,
      posterPath: cover,
      coverUrl: cover,
      backdropPath: cover,
      videoUrl: videoUrl,
      playerType: "app",
      customHeaders: {
        "User-Agent": UA,
        "Referer": BASE_URL + "/",
        "Origin": BASE_URL
      }
    };
  } catch (e) {
    return { id: String(link || "err"), type: "url", title: "請求錯誤", description: String(e.message || e) };
  }
}
