const sceneSvg = (title: string, subtitle: string, sky: string, ground: string, accent: string) => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${sky}"/>
        <stop offset="55%" stop-color="#17100d"/>
        <stop offset="100%" stop-color="${ground}"/>
      </linearGradient>
      <radialGradient id="sun" cx="74%" cy="18%" r="38%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.62"/>
        <stop offset="45%" stop-color="${accent}" stop-opacity="0.16"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="18"/></filter>
    </defs>
    <rect width="1600" height="900" fill="url(#sky)"/>
    <rect width="1600" height="900" fill="url(#sun)"/>
    <path d="M0 640 C230 590 335 675 520 612 C710 548 815 640 980 585 C1185 517 1345 575 1600 512 L1600 900 L0 900 Z" fill="#140f0d" opacity="0.88"/>
    <path d="M0 700 C240 656 425 736 635 672 C850 606 1060 720 1285 640 C1420 592 1515 610 1600 590 L1600 900 L0 900 Z" fill="#090707" opacity="0.82"/>
    <g opacity="0.4">
      <path d="M190 590 L245 410 L300 590 Z" fill="#1d1410"/>
      <path d="M235 430 L335 372 L315 590 L245 590 Z" fill="#2b1a13"/>
      <path d="M1160 604 L1210 370 L1266 604 Z" fill="#20140f"/>
      <path d="M1200 392 L1332 455 L1294 604 L1210 604 Z" fill="#2f1d14"/>
    </g>
    <g opacity="0.35" filter="url(#soft)">
      <ellipse cx="1020" cy="690" rx="520" ry="100" fill="${accent}"/>
    </g>
    <g fill="#f9e4b7" opacity="0.88" font-family="serif" text-anchor="middle">
      <text x="800" y="390" font-size="74" letter-spacing="8">${title}</text>
      <text x="800" y="452" font-size="28" opacity="0.72">${subtitle}</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const portraitSvg = (name: string, role: string, color: string) => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 560">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${color}"/>
        <stop offset="100%" stop-color="#160d0a"/>
      </linearGradient>
    </defs>
    <rect width="420" height="560" rx="28" fill="url(#bg)"/>
    <circle cx="210" cy="178" r="78" fill="#f1d8ac" opacity="0.9"/>
    <path d="M128 160 C158 72 262 72 292 160 C266 122 154 122 128 160Z" fill="#1b0e0b"/>
    <path d="M92 530 C112 346 308 346 328 530Z" fill="#2b1612"/>
    <path d="M150 356 L210 410 L270 356" fill="none" stroke="#f7c06e" stroke-width="10" opacity="0.7"/>
    <text x="210" y="456" font-size="36" text-anchor="middle" fill="#ffe6b8" font-family="serif">${name}</text>
    <text x="210" y="502" font-size="22" text-anchor="middle" fill="#f7c06e" opacity="0.8" font-family="serif">${role}</text>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const sceneAssets = {
  palace:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Daming_Palace_National_Heritage_Park_-_Danfeng_Gate_02.jpg/1280px-Daming_Palace_National_Heritage_Park_-_Danfeng_Gate_02.jpg",
  frontier:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Painting_of_Tang_Warriors_%289883380843%29.jpg/1280px-Painting_of_Tang_Warriors_%289883380843%29.jpg",
  tongguan:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/202309_Tongguan_Ancient_City_Overview.jpg/1280px-202309_Tongguan_Ancient_City_Overview.jpg",
  changanFall:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Li_Zhao_Dao_Tang_Ming_Huang_to_Shu.jpg/1280px-Li_Zhao_Dao_Tang_Ming_Huang_to_Shu.jpg",
  maweipo:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Yang_guifei_tomb.jpg/1280px-Yang_guifei_tomb.jpg",
  lingwu:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Lingwu%2C_Yinchuan%2C_Ningxia%2C_China_-_panoramio_%281%29.jpg/1280px-Lingwu%2C_Yinchuan%2C_Ningxia%2C_China_-_panoramio_%281%29.jpg",
  map: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/An_Lushan_Rebellion.png/960px-An_Lushan_Rebellion.png",
  ending:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Li_Zhao_Dao_Tang_Ming_Huang_to_Shu.jpg/1280px-Li_Zhao_Dao_Tang_Ming_Huang_to_Shu.jpg"
};

export const portraitAssets = {
  tangXuanzong: "https://upload.wikimedia.org/wikipedia/commons/3/38/Tang-xuanzong.jpg",
  anLushan: "https://upload.wikimedia.org/wikipedia/commons/c/c8/%E5%AE%89%E7%A5%BF%E5%B1%B1.jpg",
  geshuHan:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Painting_of_Tang_Warriors_%289883380843%29.jpg/640px-Painting_of_Tang_Warriors_%289883380843%29.jpg",
  yangGuifei:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Hosoda_Eishi_-_Yang_Gui_Fei.jpg/1280px-Hosoda_Eishi_-_Yang_Gui_Fei.jpg",
  minister: portraitSvg("杨国忠", "宰相", "#4a2a20"),
  soldier: portraitSvg("禁军", "军中之声", "#2d3437")
};

export const imageCredits = [
  {
    label: "大明宫丹凤门",
    url: "https://commons.wikimedia.org/wiki/File:Daming_Palace_National_Heritage_Park_-_Danfeng_Gate_02.jpg"
  },
  {
    label: "潼关古城",
    url: "https://commons.wikimedia.org/wiki/File:202309_Tongguan_Ancient_City_Overview.jpg"
  },
  {
    label: "唐明皇幸蜀图",
    url: "https://commons.wikimedia.org/wiki/File:Li_Zhao_Dao_Tang_Ming_Huang_to_Shu.jpg"
  },
  {
    label: "杨贵妃墓",
    url: "https://commons.wikimedia.org/wiki/File:Yang_guifei_tomb.jpg"
  },
  {
    label: "安史之乱地图",
    url: "https://commons.wikimedia.org/wiki/File:An_Lushan_Rebellion.png"
  },
  {
    label: "唐代武士与人物图像",
    url: "https://commons.wikimedia.org/wiki/File:Painting_of_Tang_Warriors_(9883380843).jpg"
  },
  {
    label: "唐玄宗画像",
    url: "https://commons.wikimedia.org/wiki/File:Tang-xuanzong.jpg"
  },
  {
    label: "安禄山画像",
    url: "https://commons.wikimedia.org/wiki/File:%E5%AE%89%E7%A5%BF%E5%B1%B1.jpg"
  },
  {
    label: "细田荣之《杨贵妃》",
    url: "https://commons.wikimedia.org/wiki/File:Hosoda_Eishi_-_Yang_Gui_Fei.jpg"
  }
];

export type SceneAssetKey = keyof typeof sceneAssets;
