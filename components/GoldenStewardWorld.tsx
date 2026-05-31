'use client';

import {AnimatePresence, motion} from 'framer-motion';
import {
  Award,
  BadgeCheck,
  Bot,
  Check,
  ChevronRight,
  ClipboardCheck,
  Eye,
  FileText,
  GraduationCap,
  Landmark,
  Lock,
  Medal,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  UserRoundCheck,
  WalletCards,
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {useMemo, useState} from 'react';

type Trial = {
  id: string;
  title: string;
  theme: string;
  goal: string;
  ability: string;
  abilityDescription: string;
  Icon: LucideIcon;
  details: string[];
};

type AIDungeon = {
  id: string;
  title: string;
  scene: string;
  playerTask: string;
  aiRole: string;
  abilityExp: string;
  openingLine: string;
  playerResponse: string;
  aiFeedback: string;
  scores: {
    communication: number;
    governance: number;
    professional: number;
    overall: number;
  };
};

const oneStarTrials: Trial[] = [
  {
    id: 'conflict-source',
    title: '矛盾之源',
    theme: '为什么传统物业矛盾反复发生？',
    goal: '看见表面冲突背后的结构问题，理解问题不在坏人，而在旧治理结构。',
    ability: '觉察能力',
    abilityDescription: '能够识别表面矛盾与结构问题的区别。',
    Icon: Eye,
    details: ['识别业主、物业、社区的真实处境', '区分情绪冲突与结构性矛盾', '理解信任流失如何反复发生'],
  },
  {
    id: 'structure-eye',
    title: '结构之眼',
    theme: '包干制与信托制有什么不同？',
    goal: '看懂治理结构，理解权责关系、资金逻辑与监督逻辑。',
    ability: '结构分析能力',
    abilityDescription: '能够拆解不同物业治理模式背后的权责、资金与监督关系。',
    Icon: Landmark,
    details: ['看懂包干制的利益结构', '理解信托制中的受托服务关系', '判断一个方案是否真正改变结构'],
  },
  {
    id: 'steward-role',
    title: '管家定位',
    theme: '信托制下物业到底是什么角色？',
    goal: '理解物业不是管理者，不是裁判员，而是专业服务执行者。',
    ability: '角色认知能力',
    abilityDescription: '能够把物业、业主、业委会、社区放回各自正确位置。',
    Icon: UserRoundCheck,
    details: ['明确物业的专业服务边界', '理解合同履约与公共协同的关系', '避免把服务者变成矛盾裁判'],
  },
  {
    id: 'fund-governance',
    title: '资金治理',
    theme: '预算、支出、公开透明',
    goal: '理解预算管理、资金规则、公共收益与公开机制。',
    ability: '资金治理能力',
    abilityDescription: '能够用规则解释小区资金账户、预算执行、公共资金账户与公开机制。',
    Icon: WalletCards,
    details: ['理解信托制资金账户的基本逻辑', '看懂年度预算与支出依据', '说明公共收益为什么需要持续公开'],
  },
  {
    id: 'transparent-practice',
    title: '透明实践',
    theme: '如何建立信任？',
    goal: '理解公开透明、持续沟通与规则治理如何产生信任。',
    ability: '公开透明能力',
    abilityDescription: '能够把公开说明、持续沟通和规则治理转化为日常动作。',
    Icon: ShieldCheck,
    details: ['建立公开说明的基本节奏', '把复杂规则讲成业主听得懂的话', '让透明从一次公示变成长期机制'],
  },
];

const aiDungeons: AIDungeon[] = [
  {
    id: 'owner-communication',
    title: '业主沟通副本',
    scene: '业主质疑：物业费花到哪里去了？',
    playerTask: '进行解释与沟通，把资金规则、预算依据和公开查询机制说清楚。',
    aiRole: '业主',
    abilityExp: '公开透明能力 +20',
    openingLine: '我每年都交物业费，可我不知道钱到底花在哪里了。你们是不是只让我们交钱，却不让我们看账？',
    playerResponse: '先回应您的担心，再说明小区资金账户、年度预算、支出依据和查询方式，让每一笔钱都有规则、有记录、可公开。',
    aiFeedback: '回应没有回避质疑，能把资金透明讲成业主听得懂的日常机制。',
    scores: {communication: 88, governance: 84, professional: 86, overall: 86},
  },
  {
    id: 'committee-communication',
    title: '业委会沟通副本',
    scene: '业委会成员担心公开后引发争议。',
    playerTask: '解释公开透明逻辑，让公开从压力变成协同基础。',
    aiRole: '业委会成员',
    abilityExp: '结构分析能力 +18',
    openingLine: '账目一公开，大家会不会盯着每个细节吵？最后压力都落到我们身上。',
    playerResponse: '公开不是把压力转移给业委会，而是把规则、预算、支出依据和说明节奏固定下来，减少猜测和误解。',
    aiFeedback: '能够承认业委会压力，并把公开解释成制度化减压机制。',
    scores: {communication: 82, governance: 90, professional: 85, overall: 86},
  },
  {
    id: 'community-secretary',
    title: '社区书记沟通副本',
    scene: '社区书记担心推进风险。',
    playerTask: '介绍信托制治理逻辑，说明如何降低基层反复协调压力。',
    aiRole: '社区书记',
    abilityExp: '觉察能力 +16',
    openingLine: '我们最担心一推进就激化矛盾。居民、物业、业委会都来找社区，最后又变成社区兜底。',
    playerResponse: '推进重点不是让社区替代物业，而是把各方权责理顺，让社区从反复救火转向规则协调和公共监督。',
    aiFeedback: '表达能区分社区推动治理与社区长期兜底，风险说明较克制。',
    scores: {communication: 84, governance: 88, professional: 82, overall: 85},
  },
  {
    id: 'kickoff-meeting',
    title: '项目启动会副本',
    scene: '业主、物业、业委会、社区四方共同参与。',
    playerTask: '推动会议形成初步共识，明确下一步公开材料和沟通安排。',
    aiRole: '四方会议',
    abilityExp: '角色认知能力 +22',
    openingLine: '各方意见不同：业主要求看账，物业担心被误解，业委会担心担责，社区希望稳妥推进。',
    playerResponse: '先把争议拆成资金公开、服务边界、议事安排三个问题，再确定资料清单、说明会时间和反馈渠道。',
    aiFeedback: '能够把复杂会议拆成可执行事项，体现了协同推进能力。',
    scores: {communication: 86, governance: 92, professional: 88, overall: 89},
  },
  {
    id: 'trust-briefing',
    title: '信托制宣讲副本',
    scene: '第一次向小区宣讲。',
    playerTask: '解释为什么问题根源是治理结构，而不是某一方天然有问题。',
    aiRole: '小区居民代表',
    abilityExp: '资金治理能力 +18',
    openingLine: '讲了这么多，我们还是想知道：信托制到底是不是换个说法继续收费？',
    playerResponse: '不是换说法，而是把资金规则、预算约定、服务执行、公开查询和共同监督放进同一套结构里。',
    aiFeedback: '能把信托制解释为治理结构创新，没有把它包装成简单口号。',
    scores: {communication: 87, governance: 89, professional: 90, overall: 89},
  },
];

const lockedStars = [
  {title: '二星管家学院', note: '日常治理问题处理', stars: '⭐⭐'},
  {title: '三星管家学院', note: '独立推动信托制项目', stars: '⭐⭐⭐'},
  {title: '四星管家学院', note: '项目负责人能力', stars: '⭐⭐⭐⭐'},
  {title: '五星管家学院', note: '行业导师与共建能力', stars: '⭐⭐⭐⭐⭐'},
];

const planItems = ['成长资格', '成长路径', '成长档案', 'AI训练副本', '案例副本', '认证机会'];

export function GoldenStewardWorld() {
  const [activeTrialId, setActiveTrialId] = useState(oneStarTrials[0].id);
  const [activeDungeonId, setActiveDungeonId] = useState(aiDungeons[0].id);
  const [completedTrialIds, setCompletedTrialIds] = useState<string[]>([]);
  const [completedDungeonIds, setCompletedDungeonIds] = useState<string[]>([]);
  const [dungeonStep, setDungeonStep] = useState<'task' | 'dialogue' | 'score'>('task');
  const [ceremonyOpen, setCeremonyOpen] = useState(false);
  const [promoted, setPromoted] = useState(false);

  const activeTrial = oneStarTrials.find((trial) => trial.id === activeTrialId) ?? oneStarTrials[0];
  const activeDungeon = aiDungeons.find((dungeon) => dungeon.id === activeDungeonId) ?? aiDungeons[0];
  const completedTrials = useMemo(
    () => oneStarTrials.filter((trial) => completedTrialIds.includes(trial.id)),
    [completedTrialIds],
  );
  const completedDungeons = useMemo(
    () => aiDungeons.filter((dungeon) => completedDungeonIds.includes(dungeon.id)),
    [completedDungeonIds],
  );
  const completedCount = completedTrialIds.length;
  const progress = Math.round((completedCount / oneStarTrials.length) * 100);
  const averageDungeonScore = completedDungeons.length
    ? Math.round(completedDungeons.reduce((sum, dungeon) => sum + dungeon.scores.overall, 0) / completedDungeons.length)
    : 0;

  function completeTrial(trialId: string) {
    if (completedTrialIds.includes(trialId)) {
      return;
    }

    const nextCompleted = [...completedTrialIds, trialId];
    setCompletedTrialIds(nextCompleted);
    if (nextCompleted.length === oneStarTrials.length) {
      setCeremonyOpen(true);
    }
  }

  function selectDungeon(dungeonId: string) {
    setActiveDungeonId(dungeonId);
    setDungeonStep(completedDungeonIds.includes(dungeonId) ? 'score' : 'task');
  }

  function completeDungeon(dungeonId: string) {
    if (!completedDungeonIds.includes(dungeonId)) {
      setCompletedDungeonIds([...completedDungeonIds, dungeonId]);
    }
    setDungeonStep('score');
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#eef4ee] text-[#10251f]">
      <section className="relative isolate px-5 py-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(72,132,112,0.24),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(198,216,194,0.72),transparent_34%),linear-gradient(180deg,#f7faf5_0%,#e9f0ea_58%,#dde9e1_100%)]" />
        <div className="absolute left-1/2 top-8 -z-10 h-[640px] w-[640px] -translate-x-1/2 rounded-full border border-[#234e4320]" />
        <div className="absolute left-1/2 top-24 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full border border-[#234e4316]" />

        <header className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/70 px-4 py-3 shadow-[0_18px_60px_rgba(20,48,39,0.08)] backdrop-blur">
          <div>
            <p className="text-sm font-semibold">金牌管家成长世界</p>
            <p className="text-[11px] text-[#5d7169]">把真实治理问题转化为管家能力</p>
          </div>
          <div className="rounded-full bg-[#123b32] px-4 py-2 text-xs font-semibold text-white">
            {promoted ? '一星管家' : '信托制正式冒险者'}
          </div>
        </header>

        <div className="mx-auto mt-12 grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <div className="inline-flex rounded-full border border-[#b8cbc2] bg-white/70 px-3 py-1 text-xs font-semibold text-[#315b4f]">
              一星管家学院 V1
            </div>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-7xl">
              不是看完内容，
              <br />
              而是获得能力。
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#49665d]">
              从信托制正式冒险者进入一星管家学院。你将在五个成长试炼中点亮能力节点，完成从认知觉醒到公开透明实践的第一段成长。
            </p>
          </div>

          <motion.div
            initial={{opacity: 0, y: 18}}
            animate={{opacity: 1, y: 0}}
            className="rounded-[32px] border border-white/80 bg-white/65 p-5 shadow-[0_28px_90px_rgba(18,59,50,0.14)] backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#668078]">世界档案</p>
                <h2 className="mt-1 text-2xl font-semibold">{promoted ? '一星管家' : '信托制正式冒险者'}</h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#123b32] text-white">
                <Medal className="h-7 w-7" />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <ArchiveMetric label="当前等级" value="Lv.1" />
              <ArchiveMetric label="当前星级" value={promoted ? '一星' : '试炼中'} />
              <ArchiveMetric label="成长进度" value={`${progress}%`} />
            </div>
            <div className="mt-5 h-2 rounded-full bg-[#d5e1db]">
              <motion.div
                className="h-full rounded-full bg-[#1e6b5a]"
                animate={{width: `${progress}%`}}
                transition={{duration: 0.5}}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-[#5f756e]">
              已完成试炼 {completedCount}/5。完成全部试炼后，学院徽章将升起，身份升级为一星管家。
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-10 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-12">
        <div className="rounded-[36px] border border-white/80 bg-white/68 p-5 shadow-[0_26px_80px_rgba(28,63,52,0.11)] backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#638076]">成长试炼广场</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">五大试炼区域</h2>
            </div>
            <div className="rounded-full bg-[#edf5f1] px-4 py-2 text-xs font-semibold text-[#2d5d51]">
              点亮能力路径
            </div>
          </div>

          <div className="relative mt-8 min-h-[520px] overflow-hidden rounded-[30px] bg-[radial-gradient(circle_at_center,rgba(86,143,124,0.22),transparent_34%),linear-gradient(135deg,#f8fbf7,#e5eee8)] p-5">
            <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1e6b5a24]" />
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1e6b5a16]" />

            <div className="absolute left-1/2 top-1/2 z-10 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[36px] border border-white/80 bg-white/75 text-center shadow-[0_22px_70px_rgba(27,78,62,0.15)] backdrop-blur">
              <Sparkles className="h-7 w-7 text-[#1e6b5a]" />
              <p className="mt-3 text-sm font-semibold">一星管家学院</p>
              <p className="mt-1 text-xs text-[#60776f]">成长试炼广场</p>
            </div>

            <div className="relative z-20 grid min-h-[480px] grid-cols-2 gap-4 sm:grid-cols-3">
              {oneStarTrials.map((trial, index) => {
                const complete = completedTrialIds.includes(trial.id);
                const active = activeTrial.id === trial.id;
                const Icon = trial.Icon;
                return (
                  <motion.button
                    key={trial.id}
                    onClick={() => setActiveTrialId(trial.id)}
                    whileHover={{y: -4}}
                    className={[
                      'group flex min-h-[148px] flex-col justify-between rounded-[26px] border p-4 text-left transition',
                      index === 2 ? 'sm:col-start-3 sm:row-start-2' : '',
                      complete
                        ? 'border-[#2f7a66]/35 bg-[#e4f2ec]/90 shadow-[0_20px_55px_rgba(31,107,90,0.16)]'
                        : active
                          ? 'border-[#2f7a66]/45 bg-white/90 shadow-[0_18px_52px_rgba(31,107,90,0.14)]'
                          : 'border-white/80 bg-white/58 hover:bg-white/82',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#123b32] text-white">
                        {complete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                      </span>
                      <span className="text-[11px] font-semibold text-[#638076]">
                        {complete ? '已点亮' : active ? '试炼中' : '待探索'}
                      </span>
                    </div>
                    <div>
                      <p className="text-lg font-semibold tracking-[-0.02em]">{trial.title}</p>
                      <p className="mt-2 text-xs leading-5 text-[#61776f]">{trial.ability}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 rounded-[28px] bg-[#123b32] p-5 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-white/60">成长路径</p>
                <h3 className="mt-1 text-xl font-semibold">能力节点点亮进度</h3>
              </div>
              <p className="text-sm text-white/70">{completedCount}/5</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-5">
              {oneStarTrials.map((trial) => {
                const complete = completedTrialIds.includes(trial.id);
                return (
                  <div key={trial.id} className="relative rounded-2xl border border-white/10 bg-white/8 p-3">
                    <div className={`h-2 rounded-full ${complete ? 'bg-[#bfe8cf]' : 'bg-white/18'}`} />
                    <p className="mt-3 text-xs font-semibold">{trial.ability}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <motion.div
            key={activeTrial.id}
            initial={{opacity: 0, x: 12}}
            animate={{opacity: 1, x: 0}}
            className="rounded-[32px] border border-white/80 bg-white/72 p-6 shadow-[0_24px_74px_rgba(27,69,56,0.12)] backdrop-blur"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#668078]">当前试炼</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">{activeTrial.title}</h2>
              </div>
              <activeTrial.Icon className="h-8 w-8 text-[#1e6b5a]" />
            </div>
            <div className="mt-6 rounded-[24px] bg-[#eef5f1] p-4">
              <p className="text-xs font-semibold text-[#597369]">主题</p>
              <p className="mt-2 text-lg font-semibold">{activeTrial.theme}</p>
              <p className="mt-3 text-sm leading-6 text-[#5d7169]">{activeTrial.goal}</p>
            </div>

            <div className="mt-5 space-y-3">
              {activeTrial.details.map((detail) => (
                <div key={detail} className="flex gap-3 rounded-2xl border border-[#d9e5de] bg-white/66 p-3">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#1e6b5a]" />
                  <p className="text-sm leading-6 text-[#4e665e]">{detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[24px] border border-[#bbd2c7] bg-[#f8fbf8] p-4">
              <p className="text-xs font-semibold text-[#668078]">完成后获得</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1e6b5a] text-white">
                  <Award className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">{activeTrial.ability}</p>
                  <p className="text-xs leading-5 text-[#60776f]">{activeTrial.abilityDescription}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => completeTrial(activeTrial.id)}
              disabled={completedTrialIds.includes(activeTrial.id)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#123b32] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#1c5144] disabled:bg-[#a9bbb3] disabled:text-white"
            >
              {completedTrialIds.includes(activeTrial.id) ? '能力已获得' : '完成本次试炼'}
              <Check className="h-4 w-4" />
            </button>
          </motion.div>

          <div className="rounded-[32px] border border-white/80 bg-white/64 p-5 shadow-[0_20px_64px_rgba(27,69,56,0.1)] backdrop-blur">
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-5 w-5 text-[#1e6b5a]" />
              <h3 className="font-semibold">成长档案</h3>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <ArchiveLine label="当前身份" value={promoted ? '一星管家' : '信托制正式冒险者'} />
              <ArchiveLine label="当前等级" value="Lv.1" />
              <ArchiveLine label="已完成试炼" value={`${completedCount} / 5`} />
              <ArchiveLine label="认证状态" value={promoted ? '可申请认证' : '试炼中'} />
              <ArchiveLine label="AI训练副本" value={`${completedDungeons.length} / 5`} />
              <ArchiveLine label="训练均分" value={averageDungeonScore ? `${averageDungeonScore}` : '待训练'} />
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-[#668078]">已获得能力</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {completedTrials.length === 0 ? (
                  <span className="rounded-full bg-[#eef4f0] px-3 py-1.5 text-xs text-[#6a7c75]">等待点亮</span>
                ) : (
                  completedTrials.map((trial) => (
                    <span key={trial.id} className="rounded-full bg-[#dff0e8] px-3 py-1.5 text-xs font-semibold text-[#255b4d]">
                      {trial.ability}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-[#668078]">已获得徽章</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#eef4f0] px-3 py-1.5 text-xs text-[#48635a]">信托制正式冒险者</span>
                {promoted ? (
                  <span className="rounded-full bg-[#123b32] px-3 py-1.5 text-xs font-semibold text-white">一星管家徽章</span>
                ) : null}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-[#668078]">副本经验</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {completedDungeons.length === 0 ? (
                  <span className="rounded-full bg-[#eef4f0] px-3 py-1.5 text-xs text-[#6a7c75]">等待训练</span>
                ) : (
                  completedDungeons.map((dungeon) => (
                    <span key={dungeon.id} className="rounded-full bg-[#e8f3ee] px-3 py-1.5 text-xs font-semibold text-[#255b4d]">
                      {dungeon.abilityExp}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-10 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-12">
        <div className="rounded-[36px] bg-[#123b32] p-6 text-white shadow-[0_30px_90px_rgba(18,59,50,0.2)]">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-semibold text-[#bfe8cf]">AI训练大厅</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">任务、对话、评分、成长。</h2>
              <p className="mt-4 text-sm leading-7 text-white/72">
                AI副本不是问答入口，而是训练场。每个副本都有明确场景、角色压力、玩家任务和能力评分。
              </p>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/12">
              <Bot className="h-7 w-7 text-[#bfe8cf]" />
            </div>
          </div>

          <div className="mt-7 grid gap-3">
            {aiDungeons.map((dungeon) => {
              const active = activeDungeon.id === dungeon.id;
              const complete = completedDungeonIds.includes(dungeon.id);
              return (
                <button
                  key={dungeon.id}
                  onClick={() => selectDungeon(dungeon.id)}
                  className={[
                    'group rounded-[24px] border p-4 text-left transition',
                    active
                      ? 'border-[#bfe8cf]/55 bg-white/16'
                      : complete
                        ? 'border-white/10 bg-white/10'
                        : 'border-white/8 bg-white/6 hover:bg-white/10',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{dungeon.title}</p>
                      <p className="mt-1 text-xs leading-5 text-white/58">{dungeon.scene}</p>
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                      {complete ? <Check className="h-4 w-4 text-[#bfe8cf]" /> : <Target className="h-4 w-4 text-white/70" />}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[36px] border border-white/80 bg-white/70 p-6 shadow-[0_26px_80px_rgba(28,63,52,0.11)] backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#668078]">当前训练副本</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">{activeDungeon.title}</h2>
            </div>
            <div className="rounded-full bg-[#edf5f1] px-4 py-2 text-xs font-semibold text-[#2d5d51]">
              AI扮演：{activeDungeon.aiRole}
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[28px] bg-[#eef5f1] p-5">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-5 w-5 text-[#1e6b5a]" />
                <p className="font-semibold">训练任务</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#526b62]">{activeDungeon.playerTask}</p>
              <div className="mt-5 rounded-2xl border border-[#cfe0d8] bg-white/70 p-4">
                <p className="text-xs font-semibold text-[#668078]">场景压力</p>
                <p className="mt-2 text-sm leading-6 text-[#425a52]">{activeDungeon.scene}</p>
              </div>
              <div className="mt-4 rounded-2xl border border-[#cfe0d8] bg-white/70 p-4">
                <p className="text-xs font-semibold text-[#668078]">成长关联</p>
                <p className="mt-2 text-sm font-semibold text-[#1f5f50]">{activeDungeon.abilityExp}</p>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#d9e5de] bg-white/76 p-5">
              <div className="flex gap-2 border-b border-[#e3ebe7] pb-4 text-xs font-semibold text-[#668078]">
                <span className={dungeonStep === 'task' ? 'text-[#123b32]' : ''}>任务</span>
                <span>/</span>
                <span className={dungeonStep === 'dialogue' ? 'text-[#123b32]' : ''}>对话</span>
                <span>/</span>
                <span className={dungeonStep === 'score' ? 'text-[#123b32]' : ''}>评分</span>
              </div>

              {dungeonStep === 'task' ? (
                <motion.div initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} className="pt-5">
                  <p className="text-sm leading-7 text-[#526b62]">
                    进入副本后，你需要以一星管家的身份完成一次真实沟通。系统会根据你的表达透明度、治理逻辑和专业度给出占位评分。
                  </p>
                  <button
                    onClick={() => setDungeonStep('dialogue')}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#123b32] px-5 py-4 text-sm font-semibold text-white"
                  >
                    进入训练
                    <MessageSquareText className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : null}

              {dungeonStep === 'dialogue' ? (
                <motion.div initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} className="space-y-4 pt-5">
                  <DialogueBubble speaker={`AI · ${activeDungeon.aiRole}`} text={activeDungeon.openingLine} />
                  <DialogueBubble speaker="玩家 · 一星候选管家" text={activeDungeon.playerResponse} player />
                  <DialogueBubble speaker="系统观察" text={activeDungeon.aiFeedback} />
                  <button
                    onClick={() => completeDungeon(activeDungeon.id)}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#123b32] px-5 py-4 text-sm font-semibold text-white"
                  >
                    完成副本并生成评分
                    <BadgeCheck className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : null}

              {dungeonStep === 'score' ? (
                <motion.div initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} className="pt-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ScoreCard label="沟通评分" value={activeDungeon.scores.communication} />
                    <ScoreCard label="治理评分" value={activeDungeon.scores.governance} />
                    <ScoreCard label="专业评分" value={activeDungeon.scores.professional} />
                    <ScoreCard label="综合评分" value={activeDungeon.scores.overall} strong />
                  </div>
                  <div className="mt-5 rounded-[24px] bg-[#eef5f1] p-4">
                    <p className="text-xs font-semibold text-[#668078]">写入成长档案</p>
                    <p className="mt-2 text-sm leading-6 text-[#526b62]">
                      本次副本已记录为 {activeDungeon.abilityExp}，后续可用于一星能力成长与认证申请材料。
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const currentIndex = aiDungeons.findIndex((dungeon) => dungeon.id === activeDungeon.id);
                      const nextDungeon = aiDungeons[(currentIndex + 1) % aiDungeons.length];
                      selectDungeon(nextDungeon.id);
                    }}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-[#b9cdc4] bg-white px-5 py-4 text-sm font-semibold text-[#123b32]"
                  >
                    进入下一个副本
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
        <div className="rounded-[34px] bg-[#123b32] p-6 text-white shadow-[0_30px_90px_rgba(18,59,50,0.2)]">
          <p className="text-xs font-semibold text-white/60">商业模型预留</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">一星成长计划</h2>
          <p className="mt-4 text-sm leading-7 text-white/72">
            这里售卖的不是内容本身，而是进入成长路径的资格、档案、训练副本、案例副本和后续认证机会。
          </p>
          <div className="mt-6 grid gap-3">
            {planItems.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[34px] border border-white/80 bg-white/64 p-6 shadow-[0_24px_78px_rgba(27,69,56,0.1)] backdrop-blur">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-semibold text-[#668078]">五星成长地图</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">后续学院保持锁定</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#60776f]">
                当前阶段只开放一星管家学院。二星至五星保留为世界地图节点，等待一星能力完成后逐步开启。
              </p>
            </div>
            <GraduationCap className="h-8 w-8 text-[#1e6b5a]" />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {lockedStars.map((star) => (
              <div key={star.title} className="rounded-[24px] border border-[#d8e4de] bg-[#f7faf7] p-4 opacity-70">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{star.title}</p>
                  <Lock className="h-4 w-4 text-[#7e928a]" />
                </div>
                <p className="mt-2 text-xs text-[#70847d]">{star.note}</p>
                <p className="mt-4 text-sm">{star.stars}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[24px] border border-[#cfe0d8] bg-[#eef5f1] p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#1e6b5a]" />
              <div>
                <p className="font-semibold">申请认证</p>
                <p className="mt-1 text-xs leading-5 text-[#61776f]">成长与认证分离。完成成长试炼后，可进入认证中心申请后续考核与答辩。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {ceremonyOpen ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b211c]/78 p-5 backdrop-blur-xl"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
          >
            <motion.div
              initial={{scale: 0.92, opacity: 0, y: 24}}
              animate={{scale: 1, opacity: 1, y: 0}}
              exit={{scale: 0.96, opacity: 0, y: 12}}
              className="relative w-full max-w-2xl overflow-hidden rounded-[40px] border border-white/15 bg-[radial-gradient(circle_at_center,rgba(191,232,207,0.22),transparent_36%),linear-gradient(145deg,#123b32,#0d2a24)] p-8 text-center text-white shadow-[0_40px_120px_rgba(0,0,0,0.35)]"
            >
              <motion.div
                initial={{y: 30, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.25, duration: 0.7}}
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-white text-[#123b32] shadow-[0_0_70px_rgba(191,232,207,0.5)]"
              >
                <Star className="h-12 w-12 fill-[#dceec4]" />
              </motion.div>

              <p className="mt-6 text-sm font-semibold text-[#bfe8cf]">五个能力节点已全部点亮</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">学院徽章升起</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/72">
                你已经完成一星管家学院的全部成长试炼。身份从信托制正式冒险者升级为一星管家，并获得一星管家徽章。
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-5">
                {oneStarTrials.map((trial, index) => (
                  <motion.div
                    key={trial.id}
                    initial={{opacity: 0, y: 18}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.45 + index * 0.12}}
                    className="rounded-2xl border border-white/10 bg-white/10 p-3"
                  >
                    <div className="mx-auto h-2 rounded-full bg-[#bfe8cf]" />
                    <p className="mt-3 text-xs font-semibold">{trial.ability}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 rounded-[26px] border border-white/10 bg-white/10 p-5">
                <p className="text-sm text-white/60">身份升级</p>
                <p className="mt-2 text-xl font-semibold">信托制正式冒险者 → 一星管家</p>
              </div>

              <button
                onClick={() => {
                  setPromoted(true);
                  setCeremonyOpen(false);
                }}
                className="mt-7 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#123b32] shadow-[0_18px_55px_rgba(255,255,255,0.16)]"
              >
                完成晋级
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function ArchiveMetric({label, value}: {label: string; value: string}) {
  return (
    <div className="rounded-2xl bg-[#eef5f1] p-3">
      <p className="text-[11px] text-[#668078]">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function ArchiveLine({label, value}: {label: string; value: string}) {
  return (
    <div className="rounded-2xl bg-[#eef5f1] p-3">
      <p className="text-[11px] text-[#668078]">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function DialogueBubble({speaker, text, player = false}: {speaker: string; text: string; player?: boolean}) {
  return (
    <div className={`rounded-[24px] p-4 ${player ? 'bg-[#123b32] text-white' : 'bg-[#eef5f1] text-[#17362f]'}`}>
      <p className={`text-xs font-semibold ${player ? 'text-[#bfe8cf]' : 'text-[#668078]'}`}>{speaker}</p>
      <p className={`mt-2 text-sm leading-7 ${player ? 'text-white/82' : 'text-[#526b62]'}`}>{text}</p>
    </div>
  );
}

function ScoreCard({label, value, strong = false}: {label: string; value: number; strong?: boolean}) {
  return (
    <div className={`rounded-[24px] p-4 ${strong ? 'bg-[#123b32] text-white' : 'bg-[#eef5f1] text-[#17362f]'}`}>
      <p className={`text-xs font-semibold ${strong ? 'text-[#bfe8cf]' : 'text-[#668078]'}`}>{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{value}</p>
      <div className={`mt-3 h-2 rounded-full ${strong ? 'bg-white/15' : 'bg-[#d5e1db]'}`}>
        <div
          className={`h-full rounded-full ${strong ? 'bg-[#bfe8cf]' : 'bg-[#1e6b5a]'}`}
          style={{width: `${value}%`}}
        />
      </div>
    </div>
  );
}
