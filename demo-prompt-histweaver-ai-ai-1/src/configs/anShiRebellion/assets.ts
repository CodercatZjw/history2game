import type { GameAssets } from "../../types";

function svgData(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function scene(title: string, palette: [string, string, string], motif: "court" | "mountain" | "pass" | "road" | "camp" | "city") {
  const [a, b, c] = palette;
  const motifs = {
    court: `<path d="M120 520h1360v120H120z" fill="${c}" opacity=".8"/><path d="M260 500h920l-80-180H340z" fill="${b}" opacity=".82"/><path d="M360 320h640l-70-120H430z" fill="${a}" opacity=".9"/><path d="M420 500V300M620 500V270M820 500V270M1020 500V300" stroke="#f8e7b0" stroke-width="14" opacity=".55"/>`,
    mountain: `<path d="M0 620L300 250l220 250 260-330 320 390 180-210 320 270v180H0z" fill="${b}" opacity=".85"/><path d="M0 710l420-260 270 180 290-240 420 320v90H0z" fill="${c}" opacity=".9"/>`,
    pass: `<path d="M0 650l320-330 250 210 260-290 260 320 210-170 300 250v160H0z" fill="${b}" opacity=".9"/><path d="M610 650h380V390H610z" fill="${c}" opacity=".88"/><path d="M570 400h460l-80-90H650z" fill="#f2c879" opacity=".86"/>`,
    road: `<path d="M0 690l1600-210v320H0z" fill="${c}" opacity=".82"/><path d="M610 800L830 310l210 490z" fill="#ead39a" opacity=".35"/><path d="M0 520c260-120 520-150 760-80s520 65 840-70v430H0z" fill="${b}" opacity=".78"/>`,
    camp: `<path d="M0 640h1600v160H0z" fill="${c}" opacity=".84"/><path d="M260 640l150-260 150 260zM610 640l190-320 190 320zM1070 640l150-250 150 250z" fill="${b}" opacity=".86"/><path d="M800 330v-120" stroke="#f7d987" stroke-width="12"/><path d="M800 220l130 40-130 40z" fill="#eab308"/>`,
    city: `<path d="M0 610h1600v190H0z" fill="${c}" opacity=".86"/><path d="M160 610V360h180v250M420 610V300h220v310M720 610V380h160v230M960 610V330h260v280M1300 610V410h130v200" fill="${b}" opacity=".82"/><path d="M120 360h1260" stroke="#f8e7b0" stroke-width="16" opacity=".45"/>`,
  }[motif];

  return svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${a}"/>
          <stop offset=".58" stop-color="${b}"/>
          <stop offset="1" stop-color="${c}"/>
        </linearGradient>
        <radialGradient id="sun" cx=".72" cy=".22" r=".36">
          <stop offset="0" stop-color="#ffe8a3" stop-opacity=".7"/>
          <stop offset=".65" stop-color="#ffe8a3" stop-opacity=".08"/>
          <stop offset="1" stop-color="#ffe8a3" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#g)"/>
      <rect width="1600" height="900" fill="url(#sun)"/>
      ${motifs}
      <path d="M0 150c260 80 460-70 740 0s510 80 860-40" fill="none" stroke="#fff4c7" stroke-width="3" opacity=".18"/>
      <text x="80" y="120" fill="#fff4c7" opacity=".55" font-family="serif" font-size="46">${title}</text>
    </svg>
  `);
}

function portrait(name: string, bg: string) {
  return svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
      <defs>
        <linearGradient id="p" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${bg}"/>
          <stop offset="1" stop-color="#111827"/>
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="24" fill="url(#p)"/>
      <circle cx="128" cy="88" r="42" fill="#f7d9a8" opacity=".88"/>
      <path d="M52 224c12-52 46-80 76-80s64 28 76 80z" fill="#f8e7b0" opacity=".76"/>
      <text x="128" y="236" fill="#fff7d6" font-size="28" text-anchor="middle" font-family="serif">${name}</text>
    </svg>
  `);
}

export const assets: GameAssets = {
  coverImage: scene("HistWeaver Demo", ["#172554", "#7c2d12", "#111827"], "court"),
  defaultBackground: scene("历史现场", ["#172554", "#334155", "#020617"], "mountain"),
  sceneBackgrounds: {
    court: scene("宫廷", ["#3b0764", "#7f1d1d", "#111827"], "court"),
    frontier: scene("边镇", ["#164e63", "#57534e", "#111827"], "mountain"),
    pass: scene("关隘", ["#1e3a8a", "#57534e", "#111827"], "pass"),
    road: scene("逃亡道路", ["#4a044e", "#854d0e", "#111827"], "road"),
    camp: scene("军营", ["#0f766e", "#713f12", "#111827"], "camp"),
    city: scene("城市", ["#312e81", "#7f1d1d", "#111827"], "city"),
    aftermath: scene("战后", ["#0f172a", "#475569", "#020617"], "mountain"),
  },
  portraits: {
    emperor: portrait("玄宗", "#6b3f1d"),
    consort: portrait("贵妃", "#9f4361"),
    commander: portrait("守将", "#334155"),
    guard: portrait("军士", "#475569"),
    rebel: portrait("边将", "#7f1d1d"),
    minister: portrait("权相", "#854d0e"),
    general: portrait("禁军", "#1f2937"),
    attendant: portrait("近臣", "#155e75"),
    scout: portrait("斥候", "#365314"),
  },
  endingBackgrounds: {
    historical: scene("正史余波", ["#111827", "#7f1d1d", "#020617"], "road"),
    counterfactual: scene("制度裂缝", ["#1e3a8a", "#0f766e", "#020617"], "city"),
    survival: scene("局部命运", ["#4a044e", "#334155", "#020617"], "pass"),
  },
};
