import type { RandomEventConfig } from "../types";

const clamp01 = (value: number) => Math.max(0.08, Math.min(0.92, value));

export const randomEventConfigs: RandomEventConfig[] = [
  {
    id: "guard_mutiny_check",
    title: "禁军是否失控",
    description: "保护杨贵妃后，陈玄礼还能不能压住禁军。",
    threshold: (state) =>
      clamp01((state.emperorPrestige + state.centralAuthority + state.militaryMorale - state.publicAnger) / 260),
    success: {
      narration:
        "陈玄礼站到雨里，强行把最激动的几队士兵压了回去。人群沉默了很久，最后还是没有人先冲进驿站。",
      systemText: "随机结果：禁军暂时被压住，但皇帝和军队之间的裂痕已经很难修复。",
      stateEffects: {
        centralAuthority: -10,
        emperorPrestige: -10,
        militaryMorale: -8,
        politicalTrust: -12,
        historyDeviation: 12
      },
      endingId: "reform_success_costly"
    },
    failure: {
      narration:
        "人群里忽然有人喊起来，刀鞘撞击声一片接一片。陈玄礼脸色变了，他已经分不清自己是在护驾，还是在挡住整支队伍的怒火。",
      systemText: "随机结果：禁军没有被说服，兵变扩大，护驾队伍陷入失控。",
      stateEffects: {
        centralAuthority: -28,
        emperorPrestige: -30,
        militaryMorale: -24,
        publicAnger: 16,
        rebellionRisk: 22,
        politicalTrust: -26,
        historyDeviation: 18
      },
      endingId: "maweipo_mutiny_expanded"
    }
  },
  {
    id: "guard_acceptance_check",
    title: "禁军是否接受让步",
    description: "杨贵妃出家，能不能让禁军相信杨家的权势已经断了。",
    threshold: (state) =>
      clamp01((state.politicalTrust + state.emperorPrestige + state.militaryMorale - state.publicAnger + 40) / 280),
    success: {
      narration:
        "素衣被送出驿站，陈玄礼让人一营一营传话。外面的喊声没有立刻消失，但终于低了下去，让出一条继续西行的路。",
      systemText: "随机结果：禁军勉强接受这个让步，太子和诸将的话语权明显上升。",
      stateEffects: {
        centralAuthority: -8,
        emperorPrestige: -8,
        militaryMorale: 8,
        publicAnger: -16,
        politicalTrust: 12,
        historyDeviation: 10
      },
      endingId: "suzong_early_power"
    },
    failure: {
      narration:
        "军中传来冷笑。有人说，今天能削去名号，明天也能重新封回去。断裂的箭杆被丢到驿门前，他们要的不是承诺，而是看得见的结果。",
      systemText: "随机结果：禁军拒绝接受出家方案，局势继续恶化。",
      stateEffects: {
        centralAuthority: -20,
        emperorPrestige: -22,
        militaryMorale: -14,
        publicAnger: 20,
        politicalTrust: -18,
        historyDeviation: 12
      },
      endingId: "maweipo_mutiny_expanded"
    }
  },
  {
    id: "tongguan_trust_check",
    title: "长安是否继续信任前线",
    description: "哥舒翰拒绝出关后，长安是否愿意暂时相信他的判断。",
    threshold: (state) =>
      clamp01((state.politicalTrust + state.emperorPrestige + state.centralAuthority - state.courtCorruption + 25) / 270),
    success: {
      narration:
        "长安虽然还有很多反对声音，但新的侦察战报证明叛军确实在诱战。唐玄宗沉默很久，暂时没有追责，让潼关继续守下去。",
      systemText: "随机结果：长安勉强接受坚守，潼关为唐军争取到喘息时间。",
      stateEffects: {
        centralAuthority: 8,
        emperorPrestige: 6,
        militaryMorale: 12,
        tangMilitaryStrength: 12,
        rebellionRisk: -20,
        politicalTrust: 12,
        historyDeviation: 16
      },
      endingId: "tongguan_held_changan_saved"
    },
    failure: {
      narration:
        "杨国忠把拒绝出关说成是拥兵自重。新的催战命令一封接一封送进军营，士兵开始低声议论：如果长安先要问罪主将，我们到底是在替谁守关？",
      systemText: "随机结果：军事判断没能赢得政治信任，潼关防线从内部开始松动。",
      stateEffects: {
        centralAuthority: -18,
        emperorPrestige: -14,
        militaryMorale: -12,
        tangMilitaryStrength: -10,
        politicalTrust: -26,
        historyDeviation: 8
      },
      endingId: "tongguan_political_failure"
    }
  },
  {
    id: "delay_exposed_check",
    title: "拖延是否暴露",
    description: "假装备战、实际拖延时间，会不会被长安识破。",
    threshold: (state) => clamp01((state.politicalTrust + state.militaryMorale + 55 - state.yangGuozhongPower) / 220),
    success: {
      narration:
        "整军备战的样子骗过了使者，也稳住了士兵。叛军在关外等得越久，补给线就越拉越长，原本的锋芒也被慢慢磨掉。",
      systemText: "随机结果：拖延成功，唐军保留实力进入下一轮危机。",
      stateEffects: {
        centralAuthority: -4,
        emperorPrestige: 4,
        militaryMorale: 14,
        tangMilitaryStrength: 16,
        rebellionRisk: -14,
        politicalTrust: 8,
        historyDeviation: 14
      }
    },
    failure: {
      narration:
        "有人把真实情况提前送回长安。杨国忠指责前线欺瞒皇帝，新的催战命令带着问罪的意味压进军营。",
      systemText: "随机结果：拖延被识破，前线同时失去长安和部分将士的信任。",
      stateEffects: {
        centralAuthority: -18,
        emperorPrestige: -12,
        militaryMorale: -16,
        politicalTrust: -24,
        tangMilitaryStrength: -8,
        historyDeviation: 8
      },
      endingId: "tongguan_political_failure"
    }
  },
  {
    id: "secret_escape_check",
    title: "暗中脱身是否成功",
    description: "假装处死后，杨贵妃能不能避开禁军的耳目。",
    threshold: (state) =>
      clamp01((state.politicalTrust + state.yangGuifeiSafety + state.emperorPrestige - state.publicAnger + 30) / 260),
    success: {
      narration:
        "驿站后门的马蹄声被雨声盖住。军中只看见帘幕落下、白绫递出，没有人知道真正的杨贵妃已经从另一条小路离开。",
      systemText: "随机结果：暗中脱身成功，杨贵妃存活隐藏线开启。",
      stateEffects: {
        centralAuthority: -10,
        emperorPrestige: -18,
        yangGuifeiSafety: 48,
        publicAnger: -8,
        politicalTrust: -10,
        historyDeviation: 22
      },
      endingId: "yang_guifei_survives_hidden"
    },
    failure: {
      narration:
        "一名禁军认出了后门牵马的人。谎言还没完全成形就被撕开，愤怒比刚才更快地涌向驿站。",
      systemText: "随机结果：暗中安排被识破，禁军认为皇帝在欺骗他们，兵变扩大。",
      stateEffects: {
        centralAuthority: -26,
        emperorPrestige: -28,
        militaryMorale: -20,
        publicAnger: 24,
        politicalTrust: -28,
        historyDeviation: 12
      },
      endingId: "maweipo_mutiny_expanded"
    }
  }
];

export const getRandomEventConfig = (eventId: string) =>
  randomEventConfigs.find((eventConfig) => eventConfig.id === eventId);
