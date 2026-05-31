'use client';

import {useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Building2,
  Check,
  ChevronRight,
  CircleDot,
  DoorOpen,
  Eye,
  Landmark,
  MapPinned,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
} from 'lucide-react';

type Act = 'old-world' | 'council-hall' | 'trust-city' | 'mission';

type Badge = {
  title: string;
  subtitle: string;
};

const acts: Array<{id: Act; label: string; title: string}> = [
  {id: 'old-world', label: '第一关', title: '旧世界困境'},
  {id: 'council-hall', label: '第二关', title: '治理议事厅'},
  {id: 'trust-city', label: '第三关', title: '信托之城'},
  {id: 'mission', label: '通关', title: '目标分流'},
];

const npcs = [
  {
    icon: Users,
    name: '业主 NPC',
    tone: '不是恶意不交费，而是在不透明中逐渐失去信任。',
    lines: ['物业费花到哪里去了？', '公共收益为什么看不清？', '维修为什么总是扯皮？', '为什么我对物业越来越不信任？'],
  },
  {
    icon: Landmark,
    name: '社区书记 NPC',
    tone: '不是不作为，而是资源、职责、精力和专业能力都有限。',
    lines: ['投诉越来越多。', '调解越来越累。', '物业、业主、业委会反复冲突。', '社区一直在协调，但矛盾总是重复出现。'],
  },
  {
    icon: Building2,
    name: '物业项目经理 NPC',
    tone: '不是只想赚钱，而是在旧结构里同样被困住。',
    lines: ['收费率越来越低。', '服务要求越来越高。', '人工成本越来越高。', '责任越来越重，物业人也很委屈。'],
  },
];

const doors = [
  {
    id: 'package',
    title: '优化包干制',
    value: '加强监管、阳光公示、服务提升、信用评价，确实能改善一部分问题。',
    limits: ['更多合规成本和安全责任成本由谁承担？', '包干制下能否要求物业公开财务详情？', '含糊的公开等于没有公开。', '如果账都摆明，钱不够怎么办？'],
    conclusion: '在治理结构不变的情况下，许多努力仍然是在旧房子上继续修补，难以从根上重建信任。',
  },
  {
    id: 'owners',
    title: '业主自管',
    value: '能够提升参与度。',
    limits: ['谁来具体管理？', '谁来承担责任？', '消防、电梯、工程维修是否足够专业？', '管理者是否会被质疑，能否长期持续？'],
    conclusion: '业主自管能提升参与度，但难以解决专业化、连续性和责任承担问题。',
  },
  {
    id: 'community',
    title: '社区兜底',
    value: '社区愿意协调，也能推动治理。',
    limits: ['社区不是专业物业公司。', '人员有限、精力有限、职责有限。', '无法长期替代专业物业服务。'],
    conclusion: '社区能够推动治理，但无法长期承担专业物业服务。',
  },
  {
    id: 'state',
    title: '国企接管',
    value: '主体公信力可能增强。',
    limits: ['国企也需要专业人才。', '国企也有考核任务。', '国企也不能长期做亏损项目。'],
    conclusion: '主体变化不等于机制变化。',
  },
  {
    id: 'fee',
    title: '酬金制',
    value: '让物业收入更清晰，也改善了一部分利益关系。',
    limits: ['谁来监督？谁保证公开透明？', '业委会是否足够专业？', '换届或失能怎么办？', '少数人掌握过多财权和决策权时，可能出现治理失衡风险。'],
    conclusion: '酬金制解决了部分问题，但不是所有小区都具备稳定运行酬金制的条件。',
  },
];

const cityStations = [
  {
    id: 'money',
    title: '资金公开栏',
    icon: WalletCards,
    feeling: '原来钱真的可以看得见。',
    description:
      '展示物业费收缴率、公共收益金额、支出明细、结余情况和预算执行情况。物业公司管理资金账户，并依据合同和年度预算执行支出；关键是资金使用有规则、预算有约定、支出有依据、过程可公开、业主可查询、监督有机制。',
  },
  {
    id: 'hall',
    title: '社区议事厅',
    icon: MessageCircle,
    feeling: '原来不是谁单方面说了算。',
    description: '业主、业委会、物业、社区、街道共同讨论停车收费调整、公共收益使用、维修事项和服务标准。',
  },
  {
    id: 'service',
    title: '物业服务中心',
    icon: ShieldCheck,
    feeling: '原来专业的人可以在清晰规则下做专业的事。',
    description:
      '物业公司仍然是专业服务执行者，负责日常服务、工程维修、秩序维护、清洁绿化、预算执行、公开说明和合同履约。信托制不是取消物业，而是让物业在更清晰的规则下专业履职。',
  },
  {
    id: 'change',
    title: '社区变化看板',
    icon: MapPinned,
    feeling: '原来治理结构改变以后，每个人的努力才更容易产生结果。',
    description: '投诉下降、收费率提升、公共收益公开、业主参与提升、物业服务稳定、社区协调压力下降。',
  },
];

const missions = [
  {title: '我想让自己的小区了解信托制', detail: '填写小区信息，生成初步推动建议，可申请说明会、公开课、资料包。'},
  {title: '我想推动小区探索信托制', detail: '填写小区情况，生成信托制推进路线图，可申请专家答疑、参访、辅导。'},
  {title: '我辖区有失管小区，想看看能不能试试信托制', detail: '生成治理提升建议，可申请项目诊断、培训、参访、城市共建。'},
  {title: '我想成为真正能解决问题的金牌管家', detail: '进入金牌管家成长世界：新手村、一星、二星、三星、四星、五星。'},
  {title: '我想把公司升级为信托制物业', detail: '进入信托制经营成长路径：找项目、做项目、带团队、建制度、做品牌、区域拓展。'},
  {title: '我想开启信托制创业之路', detail: '进入创业成长路径：行业认知、项目获取、合作谈判、团队建设、商业模式、资源连接。'},
];

const fade = {
  hidden: {opacity: 0, y: 14},
  visible: {opacity: 1, y: 0},
};

export function NewbieVillageExperience() {
  const [act, setAct] = useState<Act>('old-world');
  const [npcIndex, setNpcIndex] = useState(0);
  const [exploredDoors, setExploredDoors] = useState<string[]>([]);
  const [activeDoorId, setActiveDoorId] = useState(doors[0].id);
  const [propertySwapExplored, setPropertySwapExplored] = useState(false);
  const [exploredStations, setExploredStations] = useState<string[]>([]);
  const [activeStationId, setActiveStationId] = useState(cityStations[0].id);
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [badge, setBadge] = useState<Badge | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);

  const activeNpc = npcs[npcIndex];
  const activeDoor = doors.find((door) => door.id === activeDoorId) ?? doors[0];
  const activeStation = cityStations.find((station) => station.id === activeStationId) ?? cityStations[0];

  const progress = useMemo(() => {
    const actIndex = acts.findIndex((item) => item.id === act);
    return Math.round(((actIndex + 1) / acts.length) * 100);
  }, [act]);

  function award(nextBadge: Badge, nextAct?: Act) {
    setEarnedBadges((current) => (current.some((item) => item.title === nextBadge.title) ? current : [...current, nextBadge]));
    setBadge(nextBadge);
    if (nextAct) {
      window.setTimeout(() => setAct(nextAct), 450);
    }
  }

  function exploreDoor(id: string) {
    setActiveDoorId(id);
    setExploredDoors((current) => (current.includes(id) ? current : [...current, id]));
  }

  function exploreStation(id: string) {
    setActiveStationId(id);
    setExploredStations((current) => (current.includes(id) ? current : [...current, id]));
  }

  const allDoorsDone = exploredDoors.length === doors.length;
  const allStationsDone = exploredStations.length === cityStations.length;
  const completedTaskCount = exploredDoors.length + exploredStations.length + earnedBadges.length + (propertySwapExplored ? 1 : 0) + (selectedMission ? 1 : 0);
  const unlockedRegions = [
    '新手村',
    act !== 'old-world' ? '治理议事厅' : null,
    act === 'trust-city' || act === 'mission' ? '光明里社区' : null,
    act === 'mission' ? '冒险者大厅' : null,
  ].filter(Boolean) as string[];
  const profile = {
    name: '信托制冒险者',
    identity: earnedBadges.some((item) => item.title === '信托制正式冒险者') ? '信托制正式冒险者' : '新手村探索者',
    level: earnedBadges.some((item) => item.title === '信托制正式冒险者') ? 'Lv.1' : 'Lv.0',
    reputation: selectedMission ? 10 : 0,
    exploration: progress,
    currentPath: selectedMission ?? '尚未选择使命',
    completedTaskCount,
    unlockedRegions,
  };
  const worldNodes = [
    {
      id: 'entrance',
      title: '入口广场',
      subtitle: '进入信托制世界',
      target: 'old-world' as Act,
      status: 'done',
      icon: MapPinned,
    },
    {
      id: 'old-world',
      title: '旧世界街区',
      subtitle: '看见结构性矛盾',
      target: 'old-world' as Act,
      status: act === 'old-world' ? 'current' : 'done',
      icon: Eye,
    },
    {
      id: 'council',
      title: '治理议事厅',
      subtitle: '探索五扇门',
      target: 'council-hall' as Act,
      status: act === 'old-world' ? 'locked' : act === 'council-hall' ? 'current' : 'done',
      icon: Landmark,
    },
    {
      id: 'trust-door',
      title: '信托之门',
      subtitle: '新的门升起',
      target: 'council-hall' as Act,
      status: allDoorsDone && propertySwapExplored ? 'done' : act === 'council-hall' ? 'current' : act === 'old-world' ? 'locked' : 'done',
      icon: DoorOpen,
    },
    {
      id: 'trust-city',
      title: '光明里社区',
      subtitle: '体验未来社区',
      target: 'trust-city' as Act,
      status: act === 'trust-city' ? 'current' : act === 'mission' ? 'done' : 'locked',
      icon: Building2,
    },
    {
      id: 'mission',
      title: '冒险者大厅',
      subtitle: '选择你的使命',
      target: 'mission' as Act,
      status: act === 'mission' ? 'current' : selectedMission ? 'done' : 'locked',
      icon: Award,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4f1e8] text-[#17231f]">
      <section className="relative overflow-hidden border-b border-[#17463d]/10 bg-[radial-gradient(circle_at_20%_0%,rgba(63,123,110,0.16),transparent_32%),linear-gradient(180deg,#fffdf8,#eef4ee)]">
        <div className="mx-auto flex w-[min(1180px,calc(100vw-32px))] flex-col gap-8 py-10 md:py-14">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#3f7b6e]">Trust World · Newbie Village</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[#17231f] md:text-6xl">
                信托制世界 · 新手村
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#667970] md:text-lg">
                通过剧情探索，看见旧世界的结构性矛盾，探索各种方案的局限，最后进入光明里社区，自己推导出：真正要改变的是治理结构。
              </p>
            </div>
            <div className="rounded-[28px] border border-[#17463d]/12 bg-white/70 p-4 shadow-[0_20px_60px_rgba(23,70,61,0.08)]">
              <div className="flex items-center gap-3">
                <Award className="text-[#3f7b6e]" size={24} />
                <div>
                  <p className="text-sm font-semibold text-[#17231f]">通关身份</p>
                  <p className="text-xs text-[#667970]">信托制正式冒险者</p>
                </div>
              </div>
            </div>
          </div>

          <WorldMapPanel nodes={worldNodes} onTravel={setAct} progress={progress} />
          <WorldRulesPanel badges={earnedBadges} profile={profile} selectedMission={selectedMission} />
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100vw-32px))] py-10">
        <AnimatePresence mode="wait">
          {act === 'old-world' && (
            <motion.div animate="visible" exit="hidden" initial="hidden" key="old-world" variants={fade}>
              <OldWorldSection
                activeNpc={activeNpc}
                npcIndex={npcIndex}
                onAward={() => award({title: '觉醒徽章', subtitle: '你已经看见：表面是人与人的矛盾，根源是结构性问题。'}, 'council-hall')}
                onSelectNpc={setNpcIndex}
              />
            </motion.div>
          )}

          {act === 'council-hall' && (
            <motion.div animate="visible" exit="hidden" initial="hidden" key="council-hall" variants={fade}>
              <CouncilHallSection
                activeDoor={activeDoor}
                allDoorsDone={allDoorsDone}
                exploredDoors={exploredDoors}
                onAward={() => award({title: '共识探索者徽章', subtitle: '你已经理解：换人不等于换结构，真正要改变的是治理结构本身。'}, 'trust-city')}
                onExploreDoor={exploreDoor}
                onPropertySwap={() => setPropertySwapExplored(true)}
                propertySwapExplored={propertySwapExplored}
              />
            </motion.div>
          )}

          {act === 'trust-city' && (
            <motion.div animate="visible" exit="hidden" initial="hidden" key="trust-city" variants={fade}>
              <TrustCitySection
                activeStation={activeStation}
                allStationsDone={allStationsDone}
                exploredStations={exploredStations}
                onAward={() => award({title: '信托制正式冒险者', subtitle: '你已经穿过新手村，看见信托制如何把旧结构重新理顺。'}, 'mission')}
                onExploreStation={exploreStation}
              />
            </motion.div>
          )}

          {act === 'mission' && (
            <motion.div animate="visible" exit="hidden" initial="hidden" key="mission" variants={fade}>
              <MissionSection selectedMission={selectedMission} onSelectMission={setSelectedMission} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <AnimatePresence>
        {badge && (
          <motion.div
            animate={{opacity: 1}}
            className="fixed inset-0 z-50 grid place-items-center bg-[#0d1512]/55 p-5 backdrop-blur-sm"
            exit={{opacity: 0}}
            initial={{opacity: 0}}
            onClick={() => setBadge(null)}
          >
            <motion.div
              animate={{opacity: 1, scale: 1, y: 0}}
              className="w-full max-w-sm rounded-[36px] border border-white/60 bg-[#fffdf8] p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,0.28)]"
              exit={{opacity: 0, scale: 0.96, y: 10}}
              initial={{opacity: 0, scale: 0.96, y: 10}}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto grid size-20 place-items-center rounded-[28px] bg-gradient-to-br from-[#ecd99e] to-[#b9903f] text-3xl font-black text-[#261b07]">
                信
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[#17231f]">{badge.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#667970]">{badge.subtitle}</p>
              <button
                className="mt-6 rounded-full bg-[#17463d] px-5 py-3 text-sm font-bold text-white"
                onClick={() => setBadge(null)}
                type="button"
              >
                继续探索
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function WorldMapPanel({
  nodes,
  onTravel,
  progress,
}: {
  nodes: Array<{
    id: string;
    title: string;
    subtitle: string;
    target: Act;
    status: string;
    icon: typeof MapPinned;
  }>;
  onTravel: (act: Act) => void;
  progress: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-[#17463d]/12 bg-[#fffdf8]/80 p-5 shadow-[0_26px_80px_rgba(23,70,61,0.1)] backdrop-blur">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(63,123,110,0.12),transparent_26%),radial-gradient(circle_at_82%_44%,rgba(194,161,94,0.1),transparent_24%)]" />
      <div className="relative mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3f7b6e]">Newbie Village Map</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#17231f]">新手村世界地图</h2>
          <p className="mt-2 text-sm leading-6 text-[#667970]">这不是章节目录，而是信托制世界的第一块地图。完成区域后，地图会逐步点亮。</p>
        </div>
        <div className="rounded-full border border-[#17463d]/12 bg-white/70 px-4 py-2 text-sm font-bold text-[#17463d]">探索进度 {progress}%</div>
      </div>

      <div className="relative">
        <div className="absolute left-6 right-6 top-1/2 hidden h-px -translate-y-1/2 bg-[#17463d]/14 md:block" />
        <div className="relative grid gap-3 md:grid-cols-6">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const locked = node.status === 'locked';
            const current = node.status === 'current';
            const done = node.status === 'done';
            return (
              <button
                className={`group relative rounded-[26px] border p-4 text-left transition ${
                  current
                    ? 'border-[#3f7b6e]/35 bg-[#e5f0eb] shadow-[0_18px_48px_rgba(63,123,110,0.14)]'
                    : done
                      ? 'border-[#17463d]/14 bg-white/80'
                      : 'border-[#17463d]/8 bg-white/45 opacity-55'
                }`}
                disabled={locked}
                key={node.id}
                onClick={() => onTravel(node.target)}
                type="button"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`grid size-11 place-items-center rounded-2xl ${
                      current ? 'bg-[#17463d] text-white' : done ? 'bg-[#e5f0eb] text-[#17463d]' : 'bg-[#edf2ee] text-[#8aa098]'
                    }`}
                  >
                    {done && !current ? <Check size={19} /> : <Icon size={19} />}
                  </div>
                  <span className="text-xs font-bold text-[#8aa098]">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <strong className="block text-sm text-[#17231f]">{node.title}</strong>
                <span className="mt-1 block text-xs leading-5 text-[#667970]">{node.subtitle}</span>
                {current && <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#17463d]">正在探索</span>}
                {locked && <span className="mt-3 inline-flex rounded-full bg-[#f3efe7] px-3 py-1 text-[11px] font-bold text-[#8aa098]">未解锁</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WorldRulesPanel({
  badges,
  profile,
  selectedMission,
}: {
  badges: Badge[];
  profile: {
    name: string;
    identity: string;
    level: string;
    reputation: number;
    exploration: number;
    currentPath: string;
    completedTaskCount: number;
    unlockedRegions: string[];
  };
  selectedMission: string | null;
}) {
  const defaultBadges = [
    {title: '觉醒徽章', subtitle: '看见旧世界的结构性问题'},
    {title: '共识探索者徽章', subtitle: '理解换人不等于换结构'},
    {title: '信托制正式冒险者', subtitle: '完成新手村主线'},
  ];
  const worldTree = [
    {title: '新手村', status: '已开放', detail: '信托制世界共同开场'},
    {title: '金牌管家成长世界', status: selectedMission?.includes('金牌管家') ? '当前方向' : '待解锁', detail: '把治理问题转化为能力'},
    {title: '信托制经营世界', status: selectedMission?.includes('公司') ? '当前方向' : '待解锁', detail: '找项目、做项目、带团队'},
    {title: '创业者成长世界', status: selectedMission?.includes('创业') ? '当前方向' : '待解锁', detail: '进入信托制赛道'},
    {title: '城市共建世界', status: selectedMission?.includes('辖区') ? '当前方向' : '待解锁', detail: '城市治理提升与共建'},
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
      <article className="rounded-[36px] border border-[#17463d]/12 bg-[#173d35] p-5 text-white shadow-[0_24px_70px_rgba(23,70,61,0.16)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d8c28a]">World Profile</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">世界档案</h2>
          </div>
          <div className="rounded-full bg-white/12 px-4 py-2 text-sm font-bold">{profile.level}</div>
        </div>
        <div className="mt-5 rounded-[28px] border border-white/10 bg-white/8 p-5">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-[22px] bg-[#d8c28a] text-xl font-black text-[#231906]">信</div>
            <div>
              <strong className="block text-lg">{profile.name}</strong>
              <span className="mt-1 block text-sm text-white/62">{profile.identity}</span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-white/8 p-3">
              <span className="block text-[11px] text-white/48">探索度</span>
              <b className="mt-1 block text-xl">{profile.exploration}%</b>
            </div>
            <div className="rounded-2xl bg-white/8 p-3">
              <span className="block text-[11px] text-white/48">完成任务</span>
              <b className="mt-1 block text-xl">{profile.completedTaskCount}</b>
            </div>
            <div className="rounded-2xl bg-white/8 p-3">
              <span className="block text-[11px] text-white/48">声望</span>
              <b className="mt-1 block text-xl">{profile.reputation}</b>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-white/8 p-4">
            <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#d8c28a]">当前方向</span>
            <p className="mt-2 text-sm leading-6 text-white/78">{profile.currentPath}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.unlockedRegions.map((region) => (
              <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-white/76" key={region}>
                已解锁 · {region}
              </span>
            ))}
          </div>
        </div>
      </article>

      <article className="rounded-[36px] border border-[#17463d]/12 bg-white/75 p-5 shadow-[0_24px_70px_rgba(23,70,61,0.1)] backdrop-blur">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3f7b6e]">Badge System</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#17231f]">徽章系统</h2>
            <div className="mt-4 grid gap-2">
              {defaultBadges.map((item) => {
                const earned = badges.some((badge) => badge.title === item.title);
                return (
                  <div className={`rounded-2xl border p-3 ${earned ? 'border-[#c2a15e]/35 bg-[#fff9e8]' : 'border-[#17463d]/10 bg-white/60 opacity-60'}`} key={item.title}>
                    <div className="flex items-center gap-3">
                      <div className={`grid size-9 place-items-center rounded-xl ${earned ? 'bg-[#c2a15e] text-[#221907]' : 'bg-[#edf2ee] text-[#8aa098]'}`}>
                        {earned ? <Check size={17} /> : <Award size={17} />}
                      </div>
                      <div>
                        <strong className="block text-sm text-[#17231f]">{item.title}</strong>
                        <span className="mt-0.5 block text-xs text-[#667970]">{item.subtitle}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3f7b6e]">World Tree</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#17231f]">信托制世界树</h2>
            <div className="mt-4 grid gap-2">
              {worldTree.map((node, index) => {
                const active = node.status === '当前方向';
                const open = node.status === '已开放';
                return (
                  <div className={`relative rounded-2xl border p-3 ${active ? 'border-[#3f7b6e]/30 bg-[#e5f0eb]' : open ? 'border-[#17463d]/12 bg-white' : 'border-[#17463d]/10 bg-white/55 opacity-70'}`} key={node.title}>
                    {index > 0 && <div className="absolute -top-2 left-7 h-2 w-px bg-[#17463d]/16" />}
                    <div className="flex items-center gap-3">
                      <div className={`grid size-9 place-items-center rounded-xl ${active ? 'bg-[#17463d] text-white' : open ? 'bg-[#e5f0eb] text-[#17463d]' : 'bg-[#edf2ee] text-[#8aa098]'}`}>
                        {active ? <Sparkles size={17} /> : open ? <MapPinned size={17} /> : <CircleDot size={17} />}
                      </div>
                      <div>
                        <strong className="block text-sm text-[#17231f]">{node.title}</strong>
                        <span className="mt-0.5 block text-xs text-[#667970]">{node.detail} · {node.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function OldWorldSection({
  activeNpc,
  npcIndex,
  onAward,
  onSelectNpc,
}: {
  activeNpc: (typeof npcs)[number];
  npcIndex: number;
  onAward: () => void;
  onSelectNpc: (index: number) => void;
}) {
  const [selectedRoot, setSelectedRoot] = useState<string | null>(null);
  const pollOptions = [
    {label: '资金问题', value: 37},
    {label: '责任问题', value: 25},
    {label: '沟通问题', value: 18},
    {label: '监督问题', value: 20},
  ];
  const ActiveIcon = activeNpc.icon;
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="relative min-h-[640px] overflow-hidden rounded-[36px] bg-[#202924] p-7 text-white shadow-[0_28px_80px_rgba(0,0,0,0.18)]">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute left-8 top-28 h-48 w-20 rounded-t-3xl bg-white/8" />
          <div className="absolute left-32 top-44 h-32 w-24 rounded-t-3xl bg-white/6" />
          <div className="absolute right-12 top-24 h-56 w-28 rounded-t-3xl bg-white/7" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/35 to-transparent" />
        </div>
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d58a68]">Chapter 01 · Scene</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">你进入了旧包干制世界。</h2>
          <p className="mt-5 leading-8 text-white/68">
            天色很暗。业主群不断弹出消息，社区电话一直响，物业办公室还亮着灯。这里不是坏人聚集的地方，而是所有人都被旧结构困住的地方。
          </p>
        </div>

        <div className="relative mt-8 grid gap-3">
          <motion.div animate={{x: [0, 5, 0]}} className="w-[82%] rounded-[24px] border border-white/10 bg-white/9 p-4 backdrop-blur" transition={{duration: 6, repeat: Infinity}}>
            <span className="text-xs font-bold text-[#d58a68]">业主群 99+</span>
            <p className="mt-2 text-sm text-white/78">“公共收益到底有多少？为什么每次都看不明白？”</p>
          </motion.div>
          <motion.div animate={{x: [0, -5, 0]}} className="ml-auto w-[82%] rounded-[24px] border border-white/10 bg-white/9 p-4 backdrop-blur" transition={{duration: 7, repeat: Infinity}}>
            <span className="text-xs font-bold text-[#d8c28a]">社区调解记录</span>
            <p className="mt-2 text-sm text-white/78">“今天协调物业，明天处理投诉，后天又是业委会争议。”</p>
          </motion.div>
          <motion.div animate={{x: [0, 4, 0]}} className="w-[86%] rounded-[24px] border border-white/10 bg-white/9 p-4 backdrop-blur" transition={{duration: 6.5, repeat: Infinity}}>
            <span className="text-xs font-bold text-[#9fcfc3]">物业办公室</span>
            <p className="mt-2 text-sm text-white/78">“收费越来越难，要求越来越高，一线的人也很累。”</p>
          </motion.div>
        </div>

        <div className="relative mt-8 rounded-[28px] border border-white/10 bg-white/8 p-5">
          <p className="text-sm leading-7 text-white/76">
            系统提示：不要急着找坏人。先看看结构如何让每一方都越来越累。
          </p>
        </div>
      </article>

      <article className="rounded-[36px] border border-[#17463d]/12 bg-white/75 p-6 shadow-[0_24px_80px_rgba(23,70,61,0.1)] backdrop-blur">
        <div className="flex flex-wrap gap-2">
          {npcs.map((npc, index) => (
            <button
              className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                npcIndex === index ? 'border-[#3f7b6e]/30 bg-[#e5f0eb] text-[#17463d]' : 'border-[#17463d]/10 bg-white/70 text-[#667970]'
              }`}
              key={npc.name}
              onClick={() => onSelectNpc(index)}
              type="button"
            >
              {npc.name.replace(' NPC', '')}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-[30px] border border-[#17463d]/12 bg-[#fffdf8] p-6">
          <div className="flex items-start gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-[24px] bg-[#e5f0eb] text-[#17463d] shadow-inner">
              <ActiveIcon size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#17231f]">{activeNpc.name}</h3>
              <p className="mt-2 text-sm leading-7 text-[#667970]">{activeNpc.tone}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {activeNpc.lines.map((line) => (
              <div className="relative rounded-[22px] border border-[#17463d]/10 bg-[#f7f4ed] px-4 py-3 text-sm text-[#17231f]" key={line}>
                <span className="absolute -left-1 top-4 size-3 rotate-45 border-b border-l border-[#17463d]/10 bg-[#f7f4ed]" />
                “{line}”
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-[30px] border border-[#d58a68]/20 bg-[#fff7f2] p-5">
          <p className="text-sm font-semibold text-[#17231f]">玩家任务：你认为小区矛盾频发的根源是什么？</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {pollOptions.map((item) => (
              <button
                className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                  selectedRoot === item.label ? 'bg-[#17463d] text-white' : 'bg-white text-[#8d533d] hover:bg-[#fff0e7]'
                }`}
                key={item.label}
                onClick={() => setSelectedRoot(item.label)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
          {selectedRoot && (
            <motion.div animate={{opacity: 1, y: 0}} className="mt-5 rounded-[24px] bg-white p-4" initial={{opacity: 0, y: 10}}>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8d533d]">玩家投票结果</p>
              <div className="mt-4 grid gap-3">
                {pollOptions.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-xs font-bold text-[#5f493f]">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-[#f0e3da]">
                      <motion.div
                        animate={{width: `${item.value}%`}}
                        className="h-full rounded-full bg-[#d58a68]"
                        initial={{width: 0}}
                        transition={{duration: 0.45}}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className={`mt-5 rounded-[30px] border border-[#17463d]/12 bg-[#e5f0eb] p-5 ${selectedRoot ? '' : 'opacity-55'}`}>
          <h3 className="font-semibold text-[#17463d]">第一关结论</h3>
          <p className="mt-2 text-sm leading-7 text-[#4f665e]">
            经过全国大量实践观察发现：表面上看，问题来自不同的人。实际上，问题来自同一个根源：资金不透明、权责不清晰、监督机制缺失。当信任不断流失，任何矛盾都会被无限放大。
          </p>
          <button
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#17463d] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-[#9fb3aa]"
            disabled={!selectedRoot}
            onClick={onAward}
            type="button"
          >
            领取觉醒徽章 <Award size={16} />
          </button>
        </div>
      </article>
    </div>
  );
}

function CouncilHallSection({
  activeDoor,
  allDoorsDone,
  exploredDoors,
  onAward,
  onExploreDoor,
  onPropertySwap,
  propertySwapExplored,
}: {
  activeDoor: (typeof doors)[number];
  allDoorsDone: boolean;
  exploredDoors: string[];
  onAward: () => void;
  onExploreDoor: (id: string) => void;
  onPropertySwap: () => void;
  propertySwapExplored: boolean;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="relative min-h-[700px] overflow-hidden rounded-[36px] bg-[#1d5248] p-7 text-white shadow-[0_28px_80px_rgba(23,70,61,0.22)]">
        <div className="absolute inset-x-10 top-16 h-80 rounded-full bg-[#d8c28a]/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/25 to-transparent" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d8c28a]">Chapter 02 · Hall</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">治理议事厅</h2>
          <p className="mt-5 leading-8 text-white/68">大厅很安静。五扇门立在中央，每一扇门后，都是一种曾经被寄予希望的办法。</p>
        </div>
        <div className="relative mt-8 grid grid-cols-2 gap-4">
          {doors.map((door) => {
            const explored = exploredDoors.includes(door.id);
            return (
              <button
                className={`relative min-h-40 overflow-hidden rounded-t-[32px] rounded-b-[18px] border p-4 text-left transition ${
                  activeDoor.id === door.id ? 'border-[#d8c28a]/50 bg-white/18 shadow-[0_0_50px_rgba(216,194,138,0.12)]' : 'border-white/12 bg-white/8 hover:bg-white/12'
                }`}
                key={door.id}
                onClick={() => onExploreDoor(door.id)}
                type="button"
              >
                <div className="absolute inset-x-4 top-4 h-px bg-white/20" />
                <DoorOpen className={explored ? 'text-[#d8c28a]' : 'text-white/80'} size={24} />
                <strong className="mt-8 block text-lg">{door.title}</strong>
                <span className="mt-2 block text-xs text-white/55">{explored ? '门内已探索' : '点击推开这扇门'}</span>
              </button>
            );
          })}
        </div>
        {allDoorsDone && propertySwapExplored && (
          <motion.div
            animate={{opacity: 1, y: 0}}
            className="relative mt-6 rounded-[34px] border border-[#d8c28a]/40 bg-[#fff9e8]/15 p-6 text-center shadow-[0_0_80px_rgba(216,194,138,0.12)]"
            initial={{opacity: 0, y: 16}}
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d8c28a]">The Fifth Door</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">信托之门</h3>
            <p className="mt-3 text-sm leading-7 text-white/68">五扇门一扇一扇暗下去。大厅陷入黑暗，穹顶落下一道光，第六扇门从中央升起。</p>
          </motion.div>
        )}
      </article>

      <article className="rounded-[36px] border border-[#17463d]/12 bg-white/75 p-6 shadow-[0_24px_80px_rgba(23,70,61,0.1)] backdrop-blur">
        <div className="rounded-[30px] border border-[#17463d]/12 bg-[#fffdf8] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3f7b6e]">Current Door</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#17231f]">{activeDoor.title}</h3>
          <p className="mt-4 text-sm leading-7 text-[#667970]">{activeDoor.value}</p>
          <div className="mt-5 grid gap-2">
            {activeDoor.limits.map((limit) => (
              <div className="flex gap-3 rounded-2xl bg-[#f7f4ed] px-4 py-3 text-sm text-[#17231f]" key={limit}>
                <CircleDot className="mt-0.5 shrink-0 text-[#3f7b6e]" size={15} />
                <span>{limit}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-[#e5f0eb] p-4 text-sm leading-7 text-[#17463d]">{activeDoor.conclusion}</div>
        </div>

        <div className="mt-5 rounded-[30px] border border-[#17463d]/12 bg-white p-5">
          <div className="flex items-start gap-4">
            <div className="grid size-11 place-items-center rounded-2xl bg-[#f0e7d4] text-[#8f6b2f]">
              <RefreshCw size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-[#17231f]">补充讨论：一直换物业能不能解决问题？</h3>
              <p className="mt-2 text-sm leading-7 text-[#667970]">这个物业不行，换一家。换了以后，矛盾还在。再换一家，问题依然反复。</p>
            </div>
          </div>
          <button className="mt-4 rounded-full bg-[#17463d] px-4 py-2 text-sm font-bold text-white" onClick={onPropertySwap} type="button">
            查看结论
          </button>
          {propertySwapExplored && <p className="mt-4 rounded-2xl bg-[#e5f0eb] p-4 text-sm leading-7 text-[#17463d]">换人并不等于换结构。如果治理结构没有改变，很多矛盾还会继续发生。</p>}
        </div>

        {allDoorsDone && propertySwapExplored && (
          <div className="mt-5 rounded-[30px] border border-[#d5b86b]/30 bg-[#fff9e8] p-5">
            <p className="text-sm leading-7 text-[#5d4c25]">
              在错误的治理结构下，我们的努力，不过是用报纸裱糊一间四处透风的破房子。真正要改变的不是某一个人，而是治理结构本身。
            </p>
            <div className="mt-4 rounded-[24px] bg-white p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8f6b2f]">新的门升起</p>
              <h3 className="mt-2 text-2xl font-semibold text-[#17231f]">信托之门</h3>
            </div>
            <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#17463d] px-5 py-3 text-sm font-bold text-white" onClick={onAward} type="button">
              领取共识探索者徽章 <Award size={16} />
            </button>
          </div>
        )}
      </article>
    </div>
  );
}

function TrustCitySection({
  activeStation,
  allStationsDone,
  exploredStations,
  onAward,
  onExploreStation,
}: {
  activeStation: (typeof cityStations)[number];
  allStationsDone: boolean;
  exploredStations: string[];
  onAward: () => void;
  onExploreStation: (id: string) => void;
}) {
  const [selectedDifference, setSelectedDifference] = useState<string | null>(null);
  const ActiveIcon = activeStation.icon;
  const differenceOptions = ['服务更好', '物业更专业', '社区更负责', '业主更文明', '以上都不是'];
  const trustReveals = [
    ['治理结构决定治理结果', '很多时候，问题不是人突然变坏，而是治理结构长期错位。'],
    ['各归其位，各担其责', '业主、物业、业委会、社区回到正确位置，谁决策、谁负责、谁执行、谁监督，全部清晰明确。'],
    ['规则先于人，制度保障运行', '社区治理不再只依赖好人，而是依靠规则持续运行。'],
    ['信任来源于公开，和谐来源于规则', '公开的信息越多，猜疑越少；规则越清晰，冲突越少。'],
    ['信托制的本质', '是重构治理结构，重建社区信任。'],
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="relative min-h-[700px] overflow-hidden rounded-[36px] border border-[#17463d]/12 bg-[#fffdf8] p-7 shadow-[0_24px_80px_rgba(23,70,61,0.1)]">
        <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_70%_20%,rgba(194,161,94,0.18),transparent_30%),linear-gradient(180deg,rgba(229,240,235,0.9),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#e5f0eb] to-transparent" />
        <div className="absolute bottom-14 left-8 h-36 w-20 rounded-t-[28px] border border-[#17463d]/10 bg-[#3f7b6e]/12" />
        <div className="absolute bottom-14 left-36 h-48 w-24 rounded-t-[30px] border border-[#17463d]/10 bg-[#3f7b6e]/10" />
        <div className="absolute bottom-14 right-10 h-40 w-28 rounded-t-[30px] border border-[#17463d]/10 bg-[#c2a15e]/12" />
        <div className="absolute bottom-12 left-6 right-6 h-3 rounded-full bg-[#3f7b6e]/12" />
        <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3f7b6e]">Chapter 03</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#17231f]">你走进光明里社区。</h2>
        <p className="mt-5 leading-8 text-[#667970]">光线变亮了。公告栏清晰，议事厅开放，服务中心有序运行。你还不知道原因，先看见了结果。</p>
        <div className="mt-7 grid grid-cols-2 gap-3">
          {[
            ['物业费收缴率', '98%'],
            ['公共收益公开', '326,800元'],
            ['停车争议下降', '62%'],
            ['连续稳定服务', '8年'],
          ].map(([label, value]) => (
            <div className="rounded-[24px] border border-[#17463d]/12 bg-[#e5f0eb] p-4" key={label}>
              <span className="text-xs font-bold text-[#667970]">{label}</span>
              <strong className="mt-2 block text-3xl tracking-[-0.04em] text-[#17463d]">{value}</strong>
            </div>
          ))}
        </div>
        </div>
      </article>

      <article className="rounded-[36px] border border-[#17463d]/12 bg-white/75 p-6 shadow-[0_24px_80px_rgba(23,70,61,0.1)] backdrop-blur">
        <div className="grid gap-3 md:grid-cols-2">
          {cityStations.map((station) => {
            const Icon = station.icon;
            const explored = exploredStations.includes(station.id);
            return (
              <button
                className={`rounded-[24px] border p-4 text-left transition ${
                  activeStation.id === station.id ? 'border-[#3f7b6e]/30 bg-[#e5f0eb]' : 'border-[#17463d]/10 bg-[#fffdf8] hover:bg-[#f7f4ed]'
                }`}
                key={station.id}
                onClick={() => onExploreStation(station.id)}
                type="button"
              >
                <Icon className="text-[#3f7b6e]" size={22} />
                <strong className="mt-3 block text-[#17231f]">{station.title}</strong>
                <span className="mt-2 block text-xs text-[#667970]">{explored ? '已探索' : '点击探索'}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-[30px] border border-[#17463d]/12 bg-[#fffdf8] p-6">
          <div className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#e5f0eb] text-[#17463d]">
              <ActiveIcon size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#17231f]">{activeStation.title}</h3>
              <p className="mt-2 text-sm font-semibold text-[#3f7b6e]">{activeStation.feeling}</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-[#667970]">{activeStation.description}</p>
        </div>

        {allStationsDone && (
          <div className="mt-5 rounded-[30px] border border-[#d5b86b]/30 bg-[#fff9e8] p-5 text-center">
            {!selectedDifference ? (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8f6b2f]">第三关高潮提问</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#17231f]">你认为这个社区最大的不同是什么？</h3>
                <div className="mt-5 grid gap-2 text-left">
                  {differenceOptions.map((item) => (
                    <button
                      className="rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-[#17231f] transition hover:bg-[#f7f4ed]"
                      key={item}
                      onClick={() => setSelectedDifference(item)}
                      type="button"
                    >
                      □ {item}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <motion.div animate={{opacity: 1, y: 0}} initial={{opacity: 0, y: 10}}>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8f6b2f]">答案揭晓</p>
                <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#17231f]">真正改变的，是治理结构。</h3>
                <p className="mt-3 text-sm leading-7 text-[#5d4c25]">
                  你刚刚看到的一切，并不是因为换了一批人，不是因为物业突然变优秀，也不是因为业主突然变文明。真正改变的，是治理结构。
                </p>
                <div className="mt-5 grid gap-2 text-left">
                  {trustReveals.map(([title, detail]) => (
                    <div className="rounded-2xl bg-white px-4 py-3" key={title}>
                      <strong className="block text-sm text-[#17231f]">{title}</strong>
                      <span className="mt-1 block text-xs leading-5 text-[#6f6041]">{detail}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-[24px] bg-white p-5">
                  <h4 className="text-2xl font-semibold tracking-[-0.03em] text-[#17231f]">信托制物业服务模式</h4>
                  <p className="mt-3 text-sm leading-7 text-[#5d4c25]">
                    公开透明、业主当家、专业运营、共同监督、权责清晰、长期稳定。信托制改变的不是某一个人，而是整个社区的治理逻辑。
                  </p>
                </div>
                <div className="mt-4 grid gap-2 text-left">
                  {['央视专题报道', '人民日报报道', '新时代枫桥经验', '三升一降实践成果', '全国试点城市地图', '典型案例'].map((item) => (
                    <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-[#17231f]" key={item}>
                      <BookOpen className="text-[#3f7b6e]" size={15} />
                      {item}
                    </div>
                  ))}
                </div>
                <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#17463d] px-5 py-3 text-sm font-bold text-white" onClick={onAward} type="button">
                  进入授勋仪式 <BadgeCheck size={16} />
                </button>
              </motion.div>
            )}
          </div>
        )}
      </article>
    </div>
  );
}

function MissionSection({onSelectMission, selectedMission}: {onSelectMission: (mission: string) => void; selectedMission: string | null}) {
  const selected = missions.find((mission) => mission.title === selectedMission);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-[36px] border border-[#17463d]/12 bg-[#fffdf8] p-7 shadow-[0_24px_80px_rgba(23,70,61,0.1)]">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3f7b6e]">Graduation Hall</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#17231f]">恭喜毕业，你已完成新手村。</h2>
        <p className="mt-5 leading-8 text-[#667970]">系统正在生成你的信托制世界档案。你已经完成启蒙探索，比绝大多数从未接触信托制的人，更接近答案。</p>
        <div className="mt-7 rounded-[30px] border border-[#d5b86b]/30 bg-[#fff9e8] p-6">
          <div className="flex items-start gap-4">
            <div className="grid size-14 place-items-center rounded-[20px] bg-[#c2a15e] text-xl font-black text-[#221907]">信</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8f6b2f]">身份授予仪式</p>
              <h3 className="mt-2 text-2xl font-semibold text-[#17231f]">信托制正式冒险者</h3>
              <p className="mt-1 text-sm text-[#5d4c25]">编号：XT-2026-001258</p>
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            {['觉醒者', '共识探索者', '信托制正式冒险者'].map((item) => (
              <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#17231f]" key={item}>
                <Check className="text-[#3f7b6e]" size={16} />
                {item}
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm leading-7 text-[#5d4c25]">
            恭喜毕业。你已经完成信托制世界的启蒙探索。真正的冒险，现在开始。
          </p>
        </div>
        <div className="mt-5 rounded-[30px] border border-[#17463d]/12 bg-[#e5f0eb] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3f7b6e]">成长地图展开</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-[#17463d]">
            {['业主之路', '业委会之路', '社区治理之路', '金牌管家成长之路', '物业企业成长之路', '创业者之路'].map((road) => (
              <div className="rounded-2xl bg-white/70 px-4 py-3 font-semibold" key={road}>
                {road}
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="rounded-[36px] border border-[#17463d]/12 bg-white/75 p-6 shadow-[0_24px_80px_rgba(23,70,61,0.1)] backdrop-blur">
        <h3 className="mb-4 text-2xl font-semibold tracking-[-0.03em] text-[#17231f]">现在，你准备成为谁？</h3>
        <div className="grid gap-3">
          {missions.map((mission) => (
            <button
              className={`flex items-center justify-between gap-4 rounded-[24px] border p-4 text-left transition ${
                mission.title === selectedMission ? 'border-[#3f7b6e]/30 bg-[#e5f0eb]' : 'border-[#17463d]/10 bg-[#fffdf8] hover:bg-[#f7f4ed]'
              }`}
              key={mission.title}
              onClick={() => onSelectMission(mission.title)}
              type="button"
            >
              <span>
                <strong className="block text-sm text-[#17231f]">{mission.title}</strong>
                <span className="mt-1 block text-xs leading-5 text-[#667970]">{mission.detail}</span>
              </span>
              <ChevronRight className="shrink-0 text-[#3f7b6e]" size={18} />
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-[30px] border border-[#17463d]/12 bg-[#e5f0eb] p-5">
          {selected ? (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3f7b6e]">Selected Mission</p>
              <h3 className="mt-2 text-xl font-semibold text-[#17231f]">{selected.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#4f665e]">{selected.detail}</p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#17463d] px-5 py-3 text-sm font-bold text-white" type="button">
                进入下一段旅程 <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 text-sm text-[#4f665e]">
              <Eye className="text-[#3f7b6e]" size={20} />
              选择一个目标，系统会进入不同发展路径。
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
