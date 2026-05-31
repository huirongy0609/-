'use client';

import Link from 'next/link';
import {motion} from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  CircleDot,
  FileText,
  GraduationCap,
  Landmark,
  Network,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

type CommandMetric = {
  label: string;
  value: string | number;
  helper: string;
};

type HomeCommandCenterProps = {
  commandMetrics: CommandMetric[];
};

const situationStats = [
  {label: '治理事件', value: '128'},
  {label: '治理进行中', value: '36'},
  {label: '已闭环', value: '82'},
  {label: '风险预警', value: '10'},
];

const governanceEvents = [
  {
    title: '停车管理争议',
    status: '治理中',
    description: '地下车位收费调整引发公共收益透明争议，已进入信托制协同流程。',
    href: '/parking-conflict-demo',
  },
  {title: '公共收益公开', status: '已完成', description: '小区广告与停车收益完成公示口径确认。'},
  {title: '物业服务评价', status: '处理中', description: '服务评价结果进入社区、物业、业委会协同复核。'},
  {title: '维修资金申请', status: '待协同', description: '电梯维修资金申请等待街道与业主代表共同确认。'},
];

const cityNodes = ['深圳', '杭州', '青岛', '潍坊', '成都', '北京', '上海'];

const aiCenterItems = [
  {label: '今日新增案例', value: '18', helper: '进入全国经验库'},
  {label: '今日新增政策', value: '12', helper: '完成结构化摘要'},
  {label: '风险预警', value: '10', helper: '等待协同研判'},
  {label: '治理建议', value: '42', helper: 'AI辅助生成'},
];

const governanceLoop = ['问题发现', 'AI研判', '规则匹配', '案例匹配', '协同治理', '执行监督', '结果公示', '经验沉淀'];

const platformCenters = [
  {icon: Network, title: '治理协同中心', text: '围绕真实事件组织物业、社区、街道、业委会与专家协同。'},
  {icon: BookOpen, title: '案例知识中心', text: '沉淀全国信托制治理案例，支持跨城市复用。'},
  {icon: Landmark, title: '规则制度中心', text: '整理公共收益、预算规则、权责边界与公开机制。'},
  {icon: Sparkles, title: 'AI治理智库', text: '辅助风险研判、政策摘要、案例匹配和治理建议生成。'},
  {icon: GraduationCap, title: '成长认证中心', text: '面向社区治理参与者沉淀学习路径与能力标准。'},
  {icon: Building2, title: '城市运营中心', text: '支持城市节点、共建机构与区域运营网络持续拓展。'},
];

const fadeUp = {
  hidden: {opacity: 0, y: 18},
  visible: {opacity: 1, y: 0},
};

export function HomeCommandCenter({commandMetrics}: HomeCommandCenterProps) {
  return (
    <main className="platform-home min-h-screen overflow-hidden bg-graphite text-data-white">
      <section className="platform-hero">
        <div className="platform-atmosphere" />
        <motion.div
          animate="visible"
          className="relative z-10 mx-auto flex min-h-[calc(100vh-68px)] w-[min(1360px,calc(100vw-40px))] flex-col justify-center py-16"
          initial="hidden"
          transition={{staggerChildren: 0.08}}
        >
          <motion.div className="max-w-5xl" variants={fadeUp}>
            <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-civic-muted">
              Trust-based Community Governance Collaborative Platform
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.06] tracking-tight text-data-white md:text-7xl">
              全国信托制社区治理协同平台
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-data-soft">
              面向街道、社区、物业、业委会、专家与城市运营方，围绕信托制、公共收益透明、风险治理、案例复用和事件闭环，形成全国社区治理协同网络。
            </p>
          </motion.div>

          <motion.section className="mt-14" variants={fadeUp}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-civic-muted">Today Governance Situation</p>
                <h2 className="mt-2 text-2xl font-semibold text-data-white">今日治理态势</h2>
              </div>
              <Link className="platform-primary-link" href="/parking-conflict-demo">
                查看示例闭环 <ArrowRight size={16} />
              </Link>
            </div>
            <div className="platform-stat-grid">
              {situationStats.map((item) => (
                <article className="platform-stat" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </section>

      <section className="platform-section">
        <div className="platform-section-heading">
          <p>Governance Events</p>
          <h2>今日重点治理事件</h2>
        </div>
        <div className="platform-event-grid">
          {governanceEvents.map((event) => {
            const content = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <h3>{event.title}</h3>
                  <span>{event.status}</span>
                </div>
                <p>{event.description}</p>
                {event.href && (
                  <em>
                    进入治理运行空间 <ArrowRight size={14} />
                  </em>
                )}
              </>
            );

            return event.href ? (
              <Link className="platform-event featured" href={event.href} key={event.title}>
                {content}
              </Link>
            ) : (
              <article className="platform-event" key={event.title}>
                {content}
              </article>
            );
          })}
        </div>
      </section>

      <section className="platform-section">
        <div className="platform-section-heading">
          <p>National Collaboration Network</p>
          <h2>全国治理协同网络</h2>
        </div>
        <div className="collaboration-network">
          <div className="network-line line-a" />
          <div className="network-line line-b" />
          <div className="network-line line-c" />
          {cityNodes.map((city, index) => (
            <motion.div
              animate={{opacity: [0.7, 1, 0.7], y: [0, -3, 0]}}
              className={`network-city node-${index + 1}`}
              key={city}
              transition={{duration: 6 + index * 0.25, delay: index * 0.35, repeat: Infinity, ease: 'easeInOut'}}
            >
              <CircleDot size={15} />
              <span>{city}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="platform-section two-column">
        <div>
          <div className="platform-section-heading compact">
            <p>AI Governance Center</p>
            <h2>AI治理中心</h2>
          </div>
          <p className="platform-copy">
            AI不是聊天机器人，而是持续整理案例、政策、风险预警与治理建议的协同中枢，为真实治理动作降低判断成本。
          </p>
        </div>
        <div className="ai-center-grid">
          {aiCenterItems.map((item) => (
            <article className="ai-center-item" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.helper}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="platform-section">
        <div className="platform-section-heading">
          <p>Trust Governance Loop</p>
          <h2>信托制治理闭环</h2>
        </div>
        <div className="governance-loop">
          {governanceLoop.map((step, index) => (
            <article className="loop-step" key={step}>
              <span>0{index + 1}</span>
              <strong>{step}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="platform-section pb-16">
        <div className="platform-section-heading">
          <p>Platform Centers</p>
          <h2>平台六大中心</h2>
        </div>
        <div className="platform-center-grid">
          {platformCenters.map((center) => (
            <article className="platform-center" key={center.title}>
              <center.icon size={20} />
              <h3>{center.title}</h3>
              <p>{center.text}</p>
            </article>
          ))}
        </div>

        <div className="platform-footer-cta">
          <div>
            <FileText size={20} />
            <span>已收录 {commandMetrics[1]?.value || 326} 个治理案例，正在形成全国信托制治理经验网络。</span>
          </div>
          <Link href="/submit">
            参与共建 <CheckCircle2 size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
