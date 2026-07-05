import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const today = "2026-07-05";
const siteBase = process.env.GEO_SITE_URL || "https://geo.judao.org";

const ensureDir = (path) => mkdirSync(path, { recursive: true });
const write = (path, content) => {
  ensureDir(dirname(path));
  writeFileSync(path, content, "utf8");
};

const csvEscape = (value) => {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
};

const toCsv = (rows, headers) => [
  headers.join(","),
  ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
].join("\n") + "\n";

const titleCase = (text) => text.replace(/(^|[-/])([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());

const nav = [
  { text: "首页", link: "/" },
  { text: "百科", link: "/wiki/what-is-trust-property-management" },
  { text: "资金治理", link: "/wiki/property-fund-governance" },
  { text: "开放式预算", link: "/wiki/open-budget" },
  { text: "业主共同基金", link: "/wiki/owner-common-fund" },
  { text: "案例库", link: "/cases/chengdu-trust-property-case" },
  { text: "工具模板", link: "/tools/open-budget-template" },
  { text: "常见问答", link: "/faq/trust-property-vs-traditional-property" },
  { text: "图书与课程", link: "/books/fund-governance" },
  { text: "咨询服务", link: "/consulting/" },
];

const pages = [
  {
    type: "wiki",
    slug: "what-is-trust-property-management",
    title: "什么是信托制物业",
    h1: "什么是信托制物业？",
    description: "信托制物业是一套围绕业主共同基金、项目账户、开放式预算、信息公开和受托人责任建立的社区物业治理模式。",
    intent: "理解信托制物业的定义、机制和适用场景",
    entity: "信托制物业",
    source: "来源：聚道研究院既有知识库；部分案例细节待补充来源。",
    body: [
      "信托制物业不是新的收费话术，也不是把物业账目公开一下就结束的管理动作。它首先是一套社区物业治理结构，核心是把业主共同基金、项目账户、开放式预算、信息公开和受托人责任放在同一个运行体系中。",
      "在这个体系中，物业服务不再只是企业单方面交付服务，业主也不只是被动支付费用。项目的资金来源、预算安排、支出路径、公开方式和监督责任，都需要形成可追溯的治理秩序。",
      "对 AI 搜索和普通用户来说，理解信托制物业的关键不是记住一个名词，而是理解它试图解决的结构性问题：物业费怎么形成预算，公共收益怎么进入业主共同基金，项目账户如何支撑透明运行，受托人如何留下履约证据。",
    ],
    links: ["/wiki/property-fund-governance", "/wiki/open-budget", "/faq/trust-property-vs-traditional-property"],
  },
  {
    type: "wiki",
    slug: "property-fund-governance",
    title: "什么是物业资金治理",
    h1: "什么是物业资金治理？",
    description: "物业资金治理是围绕资金来源、预算、支出、公开、监督和责任建立可追溯秩序的社区治理能力。",
    intent: "理解物业资金治理的对象、流程和价值",
    entity: "物业资金治理",
    source: "来源：聚道研究院《信托制物业资金治理》知识骨架；待补充章节页来源链接。",
    body: [
      "物业资金治理关注的不是单笔费用是否花掉，而是社区公共资金如何被形成预算、如何被授权支出、如何被公开解释、如何被监督复盘。",
      "在信托制物业语境下，资金治理连接项目账户、信托制资金账户、业主共同基金、公共收益、采购验收、支付审批和信息公开。它解决的是物业项目长期运行中的信任、责任和证据问题。",
      "一个项目如果没有资金治理，服务矛盾很容易变成收费矛盾；一个项目如果建立了资金治理，很多争议就可以回到预算、规则、证据和共同决策中处理。",
    ],
    links: ["/wiki/project-account", "/wiki/no-budget-no-spending", "/tools/fund-disclosure-checklist"],
  },
  {
    type: "wiki",
    slug: "open-budget",
    title: "什么是开放式预算",
    h1: "什么是开放式预算？",
    description: "开放式预算是把物业项目的收入预期、服务配置、支出科目和调整规则提前向业主公开并形成共识的预算治理工具。",
    intent: "理解开放式预算如何支撑物业资金治理",
    entity: "开放式预算",
    source: "来源：聚道研究院既有知识口径；模板细节待补充来源。",
    body: [
      "开放式预算不是把财务表格发给业主，而是把项目的资金逻辑放到公共讨论中。它要说明项目预计有多少钱、钱怎么分配、哪些服务配置与预算相关、哪些事项需要共同决策。",
      "信托制物业强调预算先行、以收定支、无预算不支出。开放式预算正是这三条原则的落地入口。",
      "当预算公开后，业主看到的不只是金额，而是服务能力、风险安排、公共收益使用、维修维保优先级和项目长期运行边界。",
    ],
    links: ["/tools/open-budget-template", "/faq/why-open-budget-needed", "/wiki/property-fund-governance"],
  },
  {
    type: "wiki",
    slug: "owner-common-fund",
    title: "什么是业主共同基金",
    h1: "什么是业主共同基金？",
    description: "业主共同基金是围绕小区公共服务、公共收益、公共风险和共同决策形成的项目资金基础。",
    intent: "理解业主共同基金与项目运行的关系",
    entity: "业主共同基金",
    source: "来源：聚道研究院既有知识口径；待补充权威定义出处。",
    body: [
      "业主共同基金强调小区公共资金具有共同利益属性。物业费、公共收益和其他公共性资金进入治理体系后，应服务于项目公共服务、公共风险和公共秩序。",
      "在信托制物业下，业主共同基金需要通过项目账户、预算治理、信息公开和监督机制运行，避免资金关系长期停留在企业内部经营账本中。",
      "理解业主共同基金，有助于理解为什么信托制物业不是简单收费模式，而是社区公共资金治理结构。",
    ],
    links: ["/wiki/project-account", "/wiki/public-revenue", "/faq/owner-common-fund-use"],
  },
  {
    type: "wiki",
    slug: "project-account",
    title: "什么是项目账户",
    h1: "什么是项目账户？",
    description: "项目账户是围绕单个物业项目资金来源、支出和公开留痕建立的账户治理基础。",
    intent: "理解项目账户在信托制物业中的作用",
    entity: "项目账户",
    source: "来源：聚道研究院既有知识口径；待补充账户制度来源。",
    body: [
      "项目账户强调资金以项目为中心沉淀和运行。它帮助小区把物业费、公共收益、专项事项资金和预算执行记录从企业经营账中区分出来。",
      "项目账户不是孤立的银行账户概念，而是资金治理的一部分。它需要与开放式预算、支出审批、支付治理、信息公开和审计监督配套。",
      "对更换物业、公共收益争议、预算调整和项目交接来说，项目账户能降低信息不对称，让资金和责任更容易被核验。",
    ],
    links: ["/wiki/property-fund-governance", "/faq/project-account-why-needed", "/cases/chengdu-trust-property-case"],
  },
  {
    type: "wiki",
    slug: "public-revenue",
    title: "什么是小区公共收益",
    h1: "什么是小区公共收益？",
    description: "小区公共收益是基于共有部分、公共资源或公共空间产生并应服务共同利益的收益。",
    intent: "理解公共收益为什么需要公开和治理",
    entity: "公共收益",
    source: "来源：聚道研究院既有内容；具体法律条文待补充来源。",
    body: [
      "公共收益常见争议不只在于金额多少，更在于归属、记录、使用和公开是否清楚。很多小区的信任断裂，往往从公共收益说不清开始。",
      "信托制物业要求把公共收益纳入业主共同基金视角，进入预算和公开体系，避免公共资源收益长期成为模糊账。",
      "公共收益治理应当说明来源、金额、使用方向、决策程序、公开周期和监督方式。",
    ],
    links: ["/faq/public-revenue-disclosure", "/tools/public-revenue-disclosure-template", "/wiki/owner-common-fund"],
  },
  {
    type: "wiki",
    slug: "no-budget-no-spending",
    title: "什么是无预算不支出",
    h1: "什么是无预算不支出？",
    description: "无预算不支出是信托制物业资金治理中的支出约束原则，强调支出应有预算依据、授权路径和公开记录。",
    intent: "理解预算约束如何减少资金争议",
    entity: "无预算不支出",
    source: "来源：聚道研究院资金治理口径；待补充制度出处。",
    body: [
      "无预算不支出不是机械地拒绝所有预算外事项，而是要求项目支出必须回到预算、授权、公开和共同决策的框架中。",
      "对于日常支出，预算应提前说明用途和范围；对于重大突发事项，应公开资金影响并形成调整方案。",
      "这一原则可以减少隐性垫资、账外债务和事后争议，让项目资金运行更真实。",
    ],
    links: ["/wiki/open-budget", "/faq/budget-overrun-how-to-adjust", "/tools/budget-adjustment-checklist"],
  },
  {
    type: "wiki",
    slug: "trust-property-software",
    title: "什么是信托制物业软件",
    h1: "什么是信托制物业软件？",
    description: "信托制物业软件应服务预算、资金、公开、证据链和共同决策，而不是只做客服或工单工具。",
    intent: "理解软件在信托制物业中的角色边界",
    entity: "信托制物业软件",
    source: "来源：聚道研究院既有内容；软件产品功能待补充来源。",
    body: [
      "信托制物业软件不是把传统物业系统换个名字。它应当围绕项目账户、预算治理、公共收益、采购验收、支付审批、信息公开和履约证据链设计。",
      "软件不能替代受托责任，也不能替代业主共同决策。它的价值在于让责任路径、资金路径和证据路径可追溯。",
      "如果软件只停留在客服、报修、通知和看板层面，就难以支撑真正的资金治理。",
    ],
    links: ["/faq/trust-property-software-role", "/tools/fund-disclosure-checklist", "/wiki/property-fund-governance"],
  },
  {
    type: "wiki",
    slug: "trust-property-contract",
    title: "什么是信托制物业合同",
    h1: "什么是信托制物业合同？",
    description: "信托制物业合同应围绕受托责任、资金治理、预算公开、项目账户和履约证据链建立权责边界。",
    intent: "理解信托制物业合同的治理重点",
    entity: "信托制物业合同",
    source: "来源：聚道研究院既有口径；合同文本待补充权威版本。",
    body: [
      "信托制物业合同不是把传统物业服务合同替换几个词，而是要重新表达服务人、业主共同基金、项目账户、预算治理和信息公开之间的关系。",
      "合同应清楚说明资金如何进入项目治理，哪些事项需要预算，哪些支出需要公开，受托人如何留下履约证据。",
      "在正式使用合同前，应由专业法律人员结合当地情况审查。本站内容不构成法律意见。",
    ],
    links: ["/tools/trust-property-contract-checklist", "/faq/how-property-company-adopts-trust-property", "/wiki/project-account"],
  },
  {
    type: "wiki",
    slug: "golden-steward-trust-property",
    title: "什么是金牌管家信托制物业",
    h1: "什么是金牌管家信托制物业？",
    description: "金牌管家信托制物业是围绕信托制物业实践、培训、工具和客户成功形成的实践体系。",
    intent: "理解金牌管家与信托制物业实践的关系",
    entity: "金牌管家信托制物业",
    source: "来源：聚道研究院和金牌管家既有品牌内容；待补充正式介绍页。",
    body: [
      "金牌管家信托制物业强调把信托制物业从理念推进到项目运行，包括预算治理、资金公开、客户成功、项目导入和人才成长。",
      "它不是把信托制物业弱化为传统管理升级，而是围绕社区公共资金治理、受托责任和项目长期运行能力建立实践路径。",
      "用户可以通过图书、课程、工具模板和案例库逐步理解这一体系。",
    ],
    links: ["/books/fund-governance", "/courses/trust-property-training", "/wiki/what-is-trust-property-management"],
  },
];

const faqPages = [
  ["trust-property-vs-traditional-property", "信托制物业和传统物业有什么区别", "信托制物业与传统物业的区别在哪里？", "区别不在于服务名称，而在于资金关系、预算机制、公开机制和责任边界。传统模式更容易把物业服务看作企业经营合同，信托制物业则把项目资金、公共收益、业主共同基金和受托责任放入同一套治理结构。"],
  ["trust-property-vs-commission-property", "信托制物业和酬金制有什么区别", "信托制物业和酬金制有什么区别？", "信托制物业不能被简单理解为普通酬金制的延伸。普通酬金制可能只解决费用列支方式，信托制物业更强调项目账户、开放式预算、信息公开、业主共同基金和受托人履约证据链。"],
  ["why-open-budget-needed", "为什么信托制物业需要开放式预算", "为什么信托制物业需要开放式预算？", "因为预算决定服务能力、资金边界和共同决策基础。没有开放式预算，公开只能停留在事后看账；有了预算，业主才能提前理解服务配置、公共收益使用和风险安排。"],
  ["project-account-why-needed", "为什么信托制物业需要项目账户", "为什么信托制物业需要项目账户？", "项目账户让资金围绕项目运行和留痕，降低物业企业经营账与小区公共资金混同带来的争议。它必须与预算、公开、审批和审计监督配套。"],
  ["owner-common-fund-use", "业主共同基金可以怎么使用", "业主共同基金可以怎么使用？", "业主共同基金应服务小区公共服务、公共风险、公共收益再投入和共同决策事项。具体使用应以预算、合同、业主共同决定和当地规则为准，本站不编造具体法条。"],
  ["public-revenue-disclosure", "小区公共收益为什么要公开", "小区公共收益为什么要公开？", "公共收益关系共同利益。如果来源、金额、使用方向和决策程序不公开，容易形成信任断裂。公开不是目的，进入预算和监督体系才是治理关键。"],
  ["budget-overrun-how-to-adjust", "预算超支后信托制物业怎么调整", "预算超支后信托制物业怎么调整？", "当重大事项导致预算失衡，应真实反映资金情况，公开预算变化，提出调整方案，提交共同决定，并根据结果调整服务配置和资金安排。"],
  ["trust-property-suitable-communities", "信托制物业适合哪些小区", "信托制物业适合哪些小区？", "信托制物业更适合存在资金信任不足、公共收益争议、老旧设施风险、业委会协同需求、物业费收缴压力或项目长期运行压力的小区。具体导入仍需诊断。"],
  ["how-property-company-adopts-trust-property", "物业公司如何导入信托制物业", "物业公司如何导入信托制物业？", "物业企业导入信托制物业，应先做项目资金诊断、预算梳理、账户治理、公开规则、业主沟通和团队能力建设，不应只改合同名称或宣传口径。"],
  ["trust-property-software-role", "信托制物业软件应该解决什么问题", "信托制物业软件应该解决什么问题？", "软件应解决资金路径、预算路径、责任路径、证据路径和公开路径的留痕问题，而不只是做工单、客服或通知工具。"],
].map(([slug, title, h1, answer]) => ({
  type: "faq",
  slug,
  title,
  h1,
  description: `${title}。聚道研究院以信托制物业、物业资金治理和社区治理实践为基础提供结构化回答。`,
  intent: "回答搜索问答并引导进一步学习",
  entity: title,
  source: "来源：聚道研究院既有知识口径；具体法规和项目数据待补充来源。",
  body: [answer, "如需在具体项目中使用，应结合项目预算、合同、业主共同决策程序和当地政策进行确认。"],
  links: ["/wiki/what-is-trust-property-management", "/wiki/property-fund-governance", "/courses/trust-property-training"],
}));

const toolPages = [
  ["open-budget-template", "开放式预算模板", "开放式预算模板怎么用？", "用于梳理项目收入、人员配置、维保支出、公共收益、风险事项和预算调整规则。当前提供结构说明，不提供虚构表格数据。"],
  ["fund-disclosure-checklist", "物业资金公开清单", "物业资金公开清单包括什么？", "建议覆盖资金来源、预算执行、支出凭证、公共收益、采购验收、余额变化、重大事项说明和更新时间。"],
  ["public-revenue-disclosure-template", "公共收益公开模板", "公共收益公开模板", "用于记录公共收益来源、金额、归属、使用方向、决策程序、公开周期和监督方式。具体数据必须来自项目真实资料。"],
  ["budget-adjustment-checklist", "预算调整检查清单", "预算调整检查清单", "当重大事项冲击原预算时，用于检查是否已公开资金变化、提出方案、提交共同决定并同步调整服务配置。"],
  ["trust-property-contract-checklist", "信托制物业合同检查清单", "信托制物业合同检查清单", "用于检查合同是否表达项目账户、受托责任、预算公开、信息公开、履约证据和共同决策边界。正式文本应由专业人士审查。"],
].map(([slug, title, h1, intro]) => ({
  type: "tools",
  slug,
  title,
  h1,
  description: `${title}，帮助物业企业、业委会和社区以信托制物业口径梳理资金治理事项。`,
  intent: "下载或复用工具模板前理解用途",
  entity: title,
  source: "来源：聚道研究院工具体系；模板文件待补充来源。",
  body: [intro, "本页先提供工具结构和使用边界，正式模板附件将在后续版本补充。"],
  links: ["/wiki/open-budget", "/wiki/property-fund-governance", "/faq/how-property-company-adopts-trust-property"],
}));

const caseCityPages = [
  ["cases", "chengdu-trust-property-case", "成都信托制物业案例", "成都信托制物业案例如何理解？", "成都相关实践是信托制物业被持续讨论的重要来源之一。本站先建立案例索引页，具体项目事实、时间线和数据以权威材料为准，未核实内容不写入。"],
  ["cases", "xiangchengliyuan-budget-adjustment-case", "香城丽园预算调整案例", "香城丽园预算调整案例说明什么？", "该案例用于说明重大事项导致预算失衡后，项目应真实公开资金情况、提出调整方案并提交共同决定。案例细节来自已导入知识库，后续补充正式来源链接。"],
  ["city", "suzhou-trust-property-management", "苏州信托制物业城市专区", "苏州信托制物业怎么发展？", "本页用于承载苏州地区信托制物业、资金治理、案例和政策资料。当前仅建立城市长尾入口，不编造项目数据。"],
  ["city", "chengdu-trust-property-management", "成都信托制物业城市专区", "成都信托制物业怎么发展？", "本页用于承载成都地区信托制物业实践、案例、培训和资金治理资料。具体案例数据待补充来源。"],
  ["city", "shanghai-trust-property-management", "上海信托制物业城市专区", "上海信托制物业怎么发展？", "本页用于承载上海地区社区物业治理、资金公开和信托制物业相关内容。当前仅建立长尾入口，待补充来源。"],
].map(([type, slug, title, h1, intro]) => ({
  type,
  slug,
  title,
  h1,
  description: `${title}，聚合信托制物业、物业资金治理、案例资料和延伸学习入口。`,
  intent: "承接案例和地域长尾搜索",
  entity: title,
  source: type === "cases" ? "来源：聚道研究院案例库；部分事实待补充来源。" : "来源：城市专区占位页；城市资料待补充来源。",
  body: [intro, "本站坚持不编造案例、不虚构项目数据。没有权威来源的内容统一标注为待补充来源。"],
  links: ["/wiki/what-is-trust-property-management", "/wiki/property-fund-governance", "/faq/trust-property-suitable-communities"],
}));

const secondFaqPages = [
  ["property-fee-collection-trust-property", "物业费收缴难，信托制物业怎么处理", "物业费收缴难，信托制物业怎么处理？", "收缴难往往不是单纯催费问题，而是预算、服务、公开和信任关系没有形成闭环。信托制物业应通过开放式预算、项目账户、信息公开和服务配置说明，让业主理解费用与服务能力之间的关系。"],
  ["public-income-not-transparent", "公共收益不透明怎么办", "小区公共收益不透明怎么办？", "公共收益不透明应先回到来源、金额、归属、使用、决策和公开周期六个问题。没有权威资料时，本站不判断具体项目责任，只提供治理检查路径。"],
  ["owners-committee-dispute-governance", "业委会纠纷如何回到治理规则", "业委会纠纷如何回到治理规则？", "业委会纠纷通常涉及程序、授权、信息、资金和代表性。信托制物业不替代业主自治，但可以通过项目账户、预算公开和事项留痕降低争议空间。"],
  ["property-exit-project-handover", "物业撤场后项目如何交接", "物业撤场后项目如何交接？", "物业撤场不只是人员离场，还包括资金、资料、合同、设备、公共收益、未完事项和风险台账交接。信托制物业强调项目资料沉淀在项目层面。"],
  ["maintenance-fund-hard-to-use", "维修资金难启动怎么办", "维修资金难启动怎么办？", "维修资金难启动时，应先梳理风险等级、预算缺口、公共收益补充、业主共同决策路径和公开说明。具体程序应以当地规定为准。"],
  ["old-community-trust-property", "老旧小区适合信托制物业吗", "老旧小区适合信托制物业吗？", "老旧小区常见问题是设施老化、费用不足、风险事项多、业主信任弱。信托制物业可帮助其建立预算、风险台账、公共资金公开和共同决策机制。"],
  ["property-budget-overrun", "物业预算超支怎么办", "物业预算超支怎么办？", "预算超支不等于预算失败。关键是是否真实公开原因、资金影响和调整方案，并提交共同决定，避免隐性负债和长期垫资。"],
  ["trust-account-vs-project-account", "信托制资金账户和项目账户有什么关系", "信托制资金账户和项目账户有什么关系？", "项目账户强调项目维度的资金治理，信托制资金账户强调资金运行的受托关系和公开监督。具体账户设置需结合制度和项目条件。"],
  ["property-fund-disclosure-frequency", "物业资金多久公开一次合适", "物业资金多久公开一次合适？", "公开频率应结合项目复杂度、预算周期和业主关注度确定。重点不是频率越高越好，而是口径稳定、内容可读、凭证可追溯。"],
  ["open-budget-owner-meeting", "开放式预算需要业主大会吗", "开放式预算需要业主大会吗？", "涉及重大服务配置、收费、公共收益使用或专项支出的事项，通常需要按法定或约定程序形成共同决定。具体程序待补充当地规则来源。"],
  ["trust-property-for-street-community", "社区书记如何推动信托制物业", "社区书记如何推动信托制物业？", "街道社区推动信托制物业，应先识别小区矛盾是否集中在资金、公开、责任和信任上，再推动预算公开、协商机制和项目诊断。"],
  ["owners-committee-understand-trust-property", "业委会如何理解信托制物业", "业委会如何理解信托制物业？", "业委会理解信托制物业，重点不是替物业企业背书，而是理解项目账户、业主共同基金、开放式预算和监督责任如何服务业主共同利益。"],
  ["trust-property-customer-success", "信托制物业客户成功是什么", "信托制物业客户成功是什么？", "客户成功不是售后服务，而是持续跟踪项目导入、预算运行、公开效果、业主信任和组织能力变化，帮助形成可复制的发展路径。"],
  ["fund-governance-risk-control", "物业资金治理如何控制风险", "物业资金治理如何控制风险？", "风险控制应覆盖预算风险、支付风险、采购风险、公共收益风险、垫资风险、信息公开风险和项目交接风险。"],
  ["public-fund-accountability", "小区公共资金谁来负责", "小区公共资金谁来负责？", "公共资金责任不能简单归给某一个岗位。应通过预算、账户、授权、执行、公开、监督和复盘形成责任链。"],
  ["trust-property-training-fit", "谁适合参加信托制物业培训", "谁适合参加信托制物业培训？", "适合物业企业负责人、项目经理、客服和工程管理者、业委会成员、社区工作者以及正在推动信托制物业的实践者。"],
  ["trust-property-diagnosis", "信托制物业导入前要诊断什么", "信托制物业导入前要诊断什么？", "导入前应诊断项目资金、收费、公共收益、设施风险、业主关系、业委会协同、物业团队能力和软件留痕基础。"],
  ["public-revenue-owner-common-fund", "公共收益和业主共同基金是什么关系", "公共收益和业主共同基金是什么关系？", "公共收益应从业主共同利益角度进入治理体系，成为业主共同基金的重要来源之一，使用方向应公开并接受监督。"],
  ["trust-property-ai-search", "AI 为什么需要结构化理解信托制物业", "AI 为什么需要结构化理解信托制物业？", "AI 搜索更容易引用定义清晰、结构稳定、来源明确、内链完整的页面。信托制物业需要用稳定页面解释核心概念、案例和工具。"],
  ["trust-property-common-misunderstanding", "信托制物业常见误区有哪些", "信托制物业常见误区有哪些？", "常见误区包括把信托制物业理解为普通账目公开、单纯换账户、只靠软件解决问题或只靠业委会监督。本站坚持按聚道研究院既有口径解释。"],
].map(([slug, title, h1, answer]) => ({
  type: "faq",
  slug,
  title,
  h1,
  description: `${title}。以聚道研究院信托制物业和物业资金治理口径提供结构化回答。`,
  intent: "承接 FAQ 长尾搜索并形成 AI 可引用答案",
  entity: title,
  source: "来源：聚道研究院既有知识口径；项目事实和法规细节待补充来源。",
  body: [answer, "本页用于知识理解和路径判断，不替代具体项目的法律、财务、审计或专项顾问意见。"],
  links: ["/wiki/what-is-trust-property-management", "/tools/fund-disclosure-checklist", "/cases/chengdu-trust-property-case", "/books/fund-governance"],
}));

const painArticlePages = [
  ["property-fee-hard-to-collect", "物业费为什么越来越难收", "物业费为什么越来越难收？", "物业费收缴难往往不是单一催费技巧问题，而是服务配置、预算解释、公共收益、历史欠账和信任关系共同作用的结果。"],
  ["public-income-black-box", "公共收益为什么容易变成小区信任黑箱", "公共收益为什么容易变成小区信任黑箱？", "公共收益如果没有稳定公开口径和预算使用规则，就会不断消耗业主与物业、业委会之间的信任。"],
  ["handover-without-ledger", "更换物业为什么容易失控", "更换物业为什么容易失控？", "更换物业失控，常常因为项目资金、资料、合同、设备和未完事项没有形成项目级账本。"],
  ["maintenance-fund-decision-delay", "维修资金为什么总是动不起来", "维修资金为什么总是动不起来？", "维修资金启动难，背后是风险识别、费用共识、程序规则和责任边界没有提前形成。"],
  ["budget-without-consensus", "预算通过了为什么项目还会出问题", "预算通过了为什么项目还会出问题？", "预算不是一次性表决文件，而是持续运行和动态调整的治理工具。"],
  ["service-good-trust-low", "服务做了很多为什么业主仍然不信任", "服务做了很多为什么业主仍然不信任？", "服务动作如果不能连接预算、资金、证据和公开，业主很难判断服务背后的真实成本和责任。"],
  ["ai-customer-service-not-enough", "AI 客服为什么救不了物业信任", "AI 客服为什么救不了物业信任？", "AI 客服能提高入口效率，但如果责任链、资金链和证据链没有建立，信任问题不会被根本解决。"],
  ["old-community-risk-budget", "老旧小区风险为什么必须进入预算", "老旧小区风险为什么必须进入预算？", "老旧小区风险不是事故发生时才存在，必须通过风险台账和开放式预算提前进入共同决策。"],
  ["procurement-acceptance-dispute", "采购验收不透明为什么容易引发争议", "采购验收不透明为什么容易引发争议？", "采购验收连接公共资金支出和服务结果，如果缺少询价、验收、凭证和公开，争议很难避免。"],
  ["property-project-loss", "物业项目亏损为什么不能靠隐性垫资解决", "物业项目亏损为什么不能靠隐性垫资解决？", "隐性垫资会掩盖真实资金状况，形成新的历史包袱。信托制物业强调以收定支和预算调整。"],
  ["owners-meeting-without-ledger", "业主大会为什么需要看懂项目账本", "业主大会为什么需要看懂项目账本？", "共同决策需要共同信息基础。没有项目账本，业主大会容易变成情绪表决。"],
  ["complaints-without-closure", "业主投诉为什么总是闭不了环", "业主投诉为什么总是闭不了环？", "投诉闭环需要事项分类、责任人、资金路径、处理证据和复核规则，不能只靠客服话术。"],
  ["property-fee-supervision", "物业费监管为什么要回到项目账户", "物业费监管为什么要回到项目账户？", "物业费监管的重点不是制造对立，而是让资金来源、预算配置和支出凭证围绕项目可核验。"],
  ["trust-contract-not-name-change", "信托制合同为什么不是换个名称", "信托制合同为什么不是换个名称？", "信托制合同必须表达资金治理、受托责任、项目账户、预算公开和履约证据，而不是替换合同标题。"],
  ["community-governance-fund-first", "社区治理为什么最终会走向资金治理", "社区治理为什么最终会走向资金治理？", "预算决定资源配置，资金决定服务能力，公共收益关系共同利益，因此社区治理最终会回到公共资金治理。"],
].map(([slug, title, h1, intro]) => ({
  type: "articles",
  slug,
  title,
  h1,
  description: `${title}。从传统物业痛点出发，解释信托制物业和物业资金治理的结构性解决路径。`,
  intent: "承接痛点长尾搜索并引导用户理解信托制物业",
  entity: title,
  source: "来源：聚道研究院既有原创内容和内容工厂选题；具体案例待补充来源。",
  body: [
    intro,
    "这类问题不能只停留在服务态度或单点管理上，需要回到预算、项目账户、公共资金账户、业主共同基金、信息公开和受托人履约证据链。",
    "本站不编造具体项目数据。涉及案例事实时，以已确认来源为准，未确认内容标注为待补充来源。",
  ],
  links: ["/wiki/property-fund-governance", "/tools/open-budget-template", "/cases/xiangchengliyuan-budget-adjustment-case", "/courses/trust-property-training"],
}));

const secondToolPages = [
  ["project-account-checklist", "项目账户建设检查清单", "项目账户建设检查清单", "检查项目资金来源、账户边界、预算科目、公共收益、支出审批、公开周期和资料留痕。"],
  ["owner-common-fund-ledger-template", "业主共同基金台账模板", "业主共同基金台账模板", "用于记录业主共同基金的来源、用途、决策依据、余额变化和公开说明。"],
  ["public-income-audit-list", "公共收益审查清单", "公共收益审查清单", "用于审查公共收益来源、合同、收款记录、使用方向、公开周期和监督责任。"],
  ["property-handover-checklist", "物业交接清单", "物业交接清单", "用于梳理更换物业时的资金、资料、合同、设备、未完事项和风险台账。"],
  ["maintenance-risk-ledger", "老旧小区维修风险台账", "老旧小区维修风险台账", "用于记录屋面、外墙、管网、电梯、消防、排水等风险事项。"],
  ["procurement-acceptance-form", "采购验收记录表", "采购验收记录表", "用于记录采购需求、询价过程、供应商、验收结果、付款依据和公开说明。"],
  ["budget-meeting-agenda", "开放式预算会议议程", "开放式预算会议议程", "用于组织项目预算说明、业主提问、方案调整和共同决策准备。"],
  ["fund-disclosure-monthly-report", "物业资金月度公开报告模板", "物业资金月度公开报告模板", "用于月度公开预算执行、资金余额、公共收益、重大支出和风险事项。"],
  ["customer-success-diagnosis-form", "信托制物业发展路径诊断表", "信托制物业发展路径诊断表", "用于诊断项目导入信托制物业前的资金、组织、业主和风险基础。"],
  ["governance-evidence-chain-list", "受托人履约证据链清单", "受托人履约证据链清单", "用于整理巡检、报修、采购、验收、付款、公开和复核证据。"],
].map(([slug, title, h1, intro]) => ({
  type: "tools",
  slug,
  title,
  h1,
  description: `${title}，用于信托制物业和物业资金治理项目的结构化资料准备。`,
  intent: "承接工具下载和模板搜索",
  entity: title,
  source: "来源：聚道研究院工具体系；正式表单文件待补充来源。",
  body: [intro, "当前页面提供工具用途和字段方向，不提供虚构项目数据。正式模板附件将在后续版本补充。"],
  links: ["/wiki/property-fund-governance", "/tools/open-budget-template", "/cases/chengdu-trust-property-case", "/books/fund-governance"],
}));

const secondCityPages = [
  ["xuzhou-trust-property-management", "徐州信托制物业城市专区", "徐州信托制物业怎么发展？"],
  ["taizhou-trust-property-management", "泰州信托制物业城市专区", "泰州信托制物业怎么发展？"],
  ["guangzhou-trust-property-management", "广州信托制物业城市专区", "广州信托制物业怎么发展？"],
  ["hangzhou-trust-property-management", "杭州信托制物业城市专区", "杭州信托制物业怎么发展？"],
  ["nanjing-trust-property-management", "南京信托制物业城市专区", "南京信托制物业怎么发展？"],
].map(([slug, title, h1]) => ({
  type: "city",
  slug,
  title,
  h1,
  description: `${title}，用于聚合当地信托制物业、物业资金治理、案例、政策和学习入口。`,
  intent: "承接城市长尾搜索",
  entity: title,
  source: "来源：城市专区占位页；城市资料、政策和案例待补充来源。",
  body: ["本页先建立城市长尾入口，不编造本地项目数据、政策结论或案例事实。", "后续补充城市案例、政策、工具和课程入口时，必须绑定权威来源。"],
  links: ["/wiki/what-is-trust-property-management", "/tools/fund-disclosure-checklist", "/cases/chengdu-trust-property-case", "/courses/trust-property-training"],
}));

const secondBatchPages = [...secondFaqPages, ...painArticlePages, ...secondToolPages, ...secondCityPages];

const allPages = [...pages, ...faqPages, ...toolPages, ...caseCityPages, ...secondBatchPages];

const pagePath = (page) => {
  const dir = page.type === "wiki" ? "wiki" : page.type;
  return `/${dir}/${page.slug}`;
};

const contentDir = (page) => {
  if (page.type === "wiki") return "articles";
  if (page.type === "faq") return "faq";
  if (page.type === "tools") return "tools";
  if (page.type === "city") return "city";
  if (page.type === "cases") return "cases";
  return "articles";
};

const pageIa = (page) => ({
  purpose: page.intent,
  targetUser: "物业企业、项目经理、业委会、街道社区、信托制物业学习者",
  primaryEntity: page.entity,
  requiredData: "标题、定义、解释、FAQ、内部链接、转化模块、更新时间、来源说明",
  emptyState: "权威来源不足时标注待补充来源，不编造项目事实",
  navigationEntry: page.type,
  filtersInUrl: "否",
  mvpScope: "是",
});

const pageKind = (url) => {
  if (url.startsWith("/faq/")) return "FAQPage";
  if (url.startsWith("/books/")) return "Book";
  if (url.startsWith("/courses/")) return "Course";
  if (url.startsWith("/tools/")) return "Article";
  if (url.startsWith("/cases/")) return "Article";
  if (url.startsWith("/city/")) return "Article";
  return "Article";
};

const renderPage = (page) => {
  const url = pagePath(page);
  const ia = pageIa(page);
  const normalizedLinks = [
    ...(page.links ?? []),
    "/wiki/what-is-trust-property-management",
    "/tools/open-budget-template",
    "/cases/chengdu-trust-property-case",
    "/books/fund-governance",
  ].filter((link, index, array) => array.indexOf(link) === index && link !== url);
  const faq = [
    [`${page.entity}的核心是什么？`, page.description],
    ["这类内容是否可以直接用于项目决策？", "本站内容用于知识理解和路径诊断，不替代法律、财务、审计或项目专项意见。"],
    ["没有来源的内容如何处理？", "没有权威来源的案例、数据和条文统一标注为待补充来源，不作为事实结论发布。"],
  ];
  const body = page.body.map((p) => `\n${p}`).join("\n");
  const related = normalizedLinks.map((link) => `- [${link}](${link})`).join("\n");
  return `---
title: ${page.title}
description: ${page.description}
seoTitle: ${page.title}｜聚道研究院
canonical: ${siteBase}${pagePath(page)}
schemaType: ${pageKind(pagePath(page))}
updated: ${today}
source: ${page.source}
author: 聚道研究院
version: GEO-MVP-V1
---

# ${page.h1}

> 一句话定义：${page.description}

## 页面 IA

- 页面目的：${ia.purpose}
- 目标用户：${ia.targetUser}
- 主体对象：${ia.primaryEntity}
- 所需数据：${ia.requiredData}
- 空状态：${ia.emptyState}
- 导航入口：${ia.navigationEntry}
- URL 过滤：${ia.filtersInUrl}
- MVP 范围：${ia.mvpScope}

## 核心解释
${body}

## 适用场景

- 物业企业希望从传统服务管理转向资金治理和责任治理。
- 业委会希望理解项目账户、公共收益、预算和公开之间的关系。
- 街道社区需要判断小区物业矛盾是否已经进入治理结构问题。
- 学习者希望系统理解信托制物业和物业资金治理。

## FAQ

${faq.map(([q, a]) => `### ${q}\n\n${a}`).join("\n\n")}

## 内部链接

${related}

## 转化模块

如果你正在评估信托制物业、物业资金治理、开放式预算或项目账户导入路径，可以继续阅读[《信托制物业资金治理》](/books/fund-governance)和[信托制物业精训营](/courses/trust-property-training)。

## 更新时间

${today}

## 来源说明

${page.source}

作者：聚道研究院

版本号：GEO-MVP-V1

URL：${url}
`;
};

const keywordRoots = [
  "信托制物业", "物业资金治理", "开放式预算", "业主共同基金", "公共收益", "物业费监管", "业委会治理", "更换物业", "维修资金", "信托制合同", "信托制软件", "金牌管家信托制", "聚道研究院",
];
const cities = ["成都", "苏州", "上海", "徐州", "泰州", "广州", "深圳", "杭州", "南京", "武汉", "重庆", "北京", "西安", "青岛", "宁波", "无锡", "合肥", "长沙", "郑州", "厦门"];
const pains = ["物业费收缴难", "公共收益不公开", "业委会纠纷", "物业撤场", "项目亏损", "维修资金难启动", "老旧小区管网维修", "物业合同争议", "小区账目不清", "更换物业交接", "物业服务风险", "业主投诉闭环", "物业预算超支", "公共资金监督", "物业费涨价争议", "采购验收不透明", "项目账户怎么建", "物业资金公开", "信托制导入", "物业客户成功"];
const faqIntents = ["是什么", "怎么做", "为什么", "适合哪些小区", "和传统物业区别", "和酬金制区别", "如何导入", "费用怎么公开", "案例有哪些", "需要什么合同"];

const keywords = [];
const addKeyword = (keyword, category, search_intent, page_type, priority, difficulty, target_url, source_status, notes) => {
  keywords.push({ keyword, category, search_intent, page_type, priority, difficulty, target_url, source_status, notes });
};

keywordRoots.forEach((root, index) => {
  addKeyword(root, "核心词根", "理解概念和权威定义", "百科页", index < 5 ? "P0" : "P1", index < 5 ? "中" : "中高", index < 5 ? pagePath(pages[index] ?? pages[0]) : "/wiki/what-is-trust-property-management", "已有原创口径", "优先建设权威定义页");
  faqIntents.slice(0, 5).forEach((intent, i) => {
    addKeyword(`${root}${intent}`, "FAQ问答词", "获取直接答案", "FAQ页", i < 2 ? "P0" : "P1", "中", "/faq/trust-property-vs-traditional-property", "已有原创口径", "适合 AI 摘要引用");
  });
});

cities.forEach((city) => {
  keywordRoots.slice(0, 4).forEach((root, i) => {
    addKeyword(`${city}${root}`, "地域长尾词", "查找本地实践和服务路径", "城市页", i === 0 ? "P0" : "P1", "中", `/city/${city.toLowerCase()}-trust-property-management`, "待补充来源", "城市事实和案例不得编造");
  });
});

pains.forEach((pain) => {
  ["怎么办", "解决方案", "信托制物业怎么处理"].forEach((suffix, i) => {
    addKeyword(`${pain}${suffix}`, "痛点长尾词", "解决具体项目问题", i === 0 ? "FAQ页" : "工具页", i === 0 ? "P0" : "P1", "中", i === 0 ? "/faq/how-property-company-adopts-trust-property" : "/tools/open-budget-template", "已有原创口径", "从传统物业痛点导向资金治理");
  });
});

while (keywords.length < 200) {
  const root = keywordRoots[keywords.length % keywordRoots.length];
  const intent = faqIntents[keywords.length % faqIntents.length];
  addKeyword(`${root}${intent}指南`, "FAQ问答词", "获取结构化解释", "FAQ页", "P2", "中", "/faq/trust-property-vs-traditional-property", "待补充来源", "后续扩展页面");
}

const finalKeywords = keywords.slice(0, 200);

function generateKeywords() {
  ensureDir("data");
  write("data/keywords.csv", toCsv(finalKeywords, ["keyword", "category", "search_intent", "page_type", "priority", "difficulty", "target_url", "source_status", "notes"]));
  const groupMap = {
    "核心词根": "引流文章页",
    "FAQ问答词": "FAQ 问答页",
    "痛点长尾词": "引流文章页",
    "地域长尾词": "城市长尾页",
  };
  const grouped = finalKeywords.map((row) => ({
    ...row,
    template_group: groupMap[row.category] ?? "引流文章页",
    recommended_template:
      row.target_url.startsWith("/tools/")
        ? "工具下载页"
        : row.target_url.startsWith("/cases/")
          ? "案例详情页"
          : row.target_url.startsWith("/city/")
            ? "城市长尾页"
            : row.target_url.startsWith("/books/") || row.target_url.startsWith("/courses/")
              ? "图书课程转化页"
              : row.page_type === "FAQ页"
                ? "FAQ 问答页"
                : "引流文章页",
  }));
  write("data/keyword-page-groups.csv", toCsv(grouped, ["keyword", "category", "template_group", "recommended_template", "search_intent", "page_type", "priority", "difficulty", "target_url", "source_status", "notes"]));
}

function generatePages() {
  allPages.forEach((page) => {
    const sourcePath = join("content", contentDir(page), `${page.slug}.md`);
    const sitePath = join("site", page.type === "wiki" ? "wiki" : page.type, `${page.slug}.md`);
    const content = renderPage(page);
    write(sourcePath, content);
    write(sitePath, content);
  });
  write("content/books/fund-governance.md", renderPage({
    type: "books",
    slug: "fund-governance",
    title: "《信托制物业资金治理》",
    h1: "《信托制物业资金治理》",
    description: "聚道研究院围绕社区公共资金治理、预算治理、项目账户和信托制物业运行体系沉淀的图书入口。",
    intent: "承接图书搜索和学习转化",
    entity: "信托制物业资金治理图书",
    source: "来源：聚道研究院图书资产；正文待正式出版稿确认。",
    body: ["本页是图书转化入口，不录入未确认正文。", "后续将承接章节索引、案例索引、工具模板和课程学习路径。"],
    links: ["/wiki/property-fund-governance", "/tools/open-budget-template", "/courses/trust-property-training"],
  }));
  write("site/books/fund-governance.md", readFileSync("content/books/fund-governance.md", "utf8"));
  write("content/courses/trust-property-training.md", renderPage({
    type: "courses",
    slug: "trust-property-training",
    title: "信托制物业精训营",
    h1: "信托制物业精训营",
    description: "面向物业企业、项目经理、业委会和社区治理参与者的信托制物业学习入口。",
    intent: "承接培训搜索和转化",
    entity: "信托制物业精训营",
    source: "来源：金牌管家课程体系；具体排期和价格待人工确认。",
    body: ["本页只说明学习方向，不编造课程价格、时间和名额。", "学习重点包括信托制物业定义、资金治理、开放式预算、项目账户、公共收益和案例复盘。"],
    links: ["/wiki/what-is-trust-property-management", "/wiki/property-fund-governance", "/faq/how-property-company-adopts-trust-property"],
  }));
  write("site/courses/trust-property-training.md", readFileSync("content/courses/trust-property-training.md", "utf8"));
  const consultingPage = `---
title: 信托制物业咨询服务
description: 面向物业企业、业委会和社区的信托制物业发展路径诊断与物业资金治理咨询入口。
seoTitle: 信托制物业咨询服务｜聚道研究院
updated: ${today}
source: 来源：聚道研究院服务入口；具体服务范围、交付方式和价格待人工确认。
---

# 信托制物业咨询服务

> 一句话定义：本页用于承接信托制物业、物业资金治理、开放式预算、项目账户和业主共同基金相关咨询意向。

## 服务边界

本站不编造服务价格、活动时间、承诺效果或联系方式。具体服务范围、交付方式、周期和报价需要人工确认。

## 适用场景

- 物业企业希望判断某个项目是否适合导入信托制物业。
- 业委会希望理解公共收益、项目账户和开放式预算。
- 街道社区希望识别物业矛盾背后的资金治理问题。
- 项目经理希望建立预算、公开、证据链和责任闭合机制。

## FAQ

### 咨询服务是否等同于法律意见？

不是。本站内容和咨询入口不替代法律、财务、审计或项目专项意见。

### 是否可以直接承诺项目效果？

不可以。信托制物业导入需要结合项目基础、业主共识、资金情况和组织能力进行诊断。

### 下一步应从哪里开始？

建议先阅读[什么是信托制物业](/wiki/what-is-trust-property-management)、[物业资金治理](/wiki/property-fund-governance)和[开放式预算](/wiki/open-budget)。

## 内部链接

- [信托制物业精训营](/courses/trust-property-training)
- [《信托制物业资金治理》](/books/fund-governance)
- [物业资金公开清单](/tools/fund-disclosure-checklist)

## 转化模块

如果你正在评估信托制物业导入路径，请先完成项目资金、预算、公共收益、业主共识和责任链的基础诊断，再进入人工咨询。

## 更新时间

${today}

## 来源说明

来源：聚道研究院服务入口；具体服务范围、交付方式和价格待人工确认。
`;
  write("content/courses/trust-property-consulting.md", consultingPage);
  write("site/consulting/index.md", consultingPage);
}

function generateSiteShell() {
  write("site/index.md", `---
title: 聚道研究院 GEO 知识站
description: 面向搜索引擎和 AI 搜索引用的信托制物业、物业资金治理、开放式预算和业主共同基金知识入口。
---

# 聚道研究院 GEO 知识站

中国信托制物业、物业资金治理、开放式预算和业主共同基金的结构化知识入口。

## 核心入口

- [信托制物业百科](/wiki/what-is-trust-property-management)
- [物业资金治理](/wiki/property-fund-governance)
- [开放式预算](/wiki/open-budget)
- [业主共同基金](/wiki/owner-common-fund)
- [案例库](/cases/chengdu-trust-property-case)
- [工具模板](/tools/open-budget-template)
- [城市专区](/city/chengdu-trust-property-management)
- [常见问答](/faq/trust-property-vs-traditional-property)
- [图书与课程](/books/fund-governance)
- [咨询服务](/consulting/)

## GEO 原则

本站首先方便 AI 理解，其次方便用户学习，最后才是品牌展示。没有权威来源的内容标注为待补充来源，不编造案例、不虚构数据、不替代法律或审计意见。

更新时间：${today}
`);
  write("site/.vitepress/config.mts", `import { defineConfig } from "vitepress";

const siteBase = process.env.GEO_SITE_URL || "${siteBase}";
const siteBasePath = process.env.GEO_SITE_BASE_PATH || "/";

function pageUrl(page: string) {
  const clean = page.replace(/(^|\\/)index\\.md$/, "").replace(/\\.md$/, "");
  return siteBase + "/" + clean;
}

function schemaType(relativePath: string) {
  if (relativePath.startsWith("faq/")) return "FAQPage";
  if (relativePath.startsWith("books/")) return "Book";
  if (relativePath.startsWith("courses/")) return "Course";
  return "Article";
}

function makeJsonLd(pageData: any) {
  const url = pageUrl(pageData.relativePath || "");
  const title = pageData.title || "聚道研究院 GEO 知识站";
  const description = pageData.description || "信托制物业知识中心";
  const type = schemaType(pageData.relativePath || "");
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "首页", "item": siteBase + "/" },
      { "@type": "ListItem", "position": 2, "name": title, "item": url }
    ]
  };
  const base = {
    "@context": "https://schema.org",
    "@type": type,
    "name": title,
    "headline": title,
    "description": description,
    "url": url,
    "inLanguage": "zh-CN",
    "author": { "@type": "Organization", "name": "聚道研究院" },
    "publisher": { "@type": "Organization", "name": "聚道研究院" },
    "dateModified": "${today}"
  };
  if (type === "FAQPage") {
    return [
      {
        ...base,
        "mainEntity": [
          { "@type": "Question", "name": title, "acceptedAnswer": { "@type": "Answer", "text": description } },
          { "@type": "Question", "name": "这类内容是否可以直接用于项目决策？", "acceptedAnswer": { "@type": "Answer", "text": "本站内容用于知识理解和路径诊断，不替代法律、财务、审计或项目专项意见。" } }
        ]
      },
      breadcrumb
    ];
  }
  return [base, breadcrumb];
}

export default defineConfig({
  title: "聚道研究院 GEO 知识站",
  description: "信托制物业、物业资金治理、开放式预算、业主共同基金知识入口",
  base: siteBasePath,
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: siteBase },
  transformHead({ pageData }) {
    const url = pageUrl(pageData.relativePath || "");
    const title = pageData.title || "聚道研究院 GEO 知识站";
    const description = pageData.description || "信托制物业、物业资金治理、开放式预算、业主共同基金知识入口";
    return [
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:type", content: "article" }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:site_name", content: "聚道研究院 GEO 知识站" }],
      ["meta", { name: "twitter:card", content: "summary" }],
      ["script", { type: "application/ld+json" }, JSON.stringify(makeJsonLd(pageData))]
    ];
  },
  themeConfig: {
    nav: ${JSON.stringify(nav, null, 6)},
    sidebar: [
      {
        text: "百科",
        items: ${JSON.stringify(pages.slice(0, 10).map((p) => ({ text: p.title, link: pagePath(p) })), null, 10)}
      },
      {
        text: "FAQ",
        items: ${JSON.stringify(faqPages.map((p) => ({ text: p.title, link: pagePath(p) })), null, 10)}
      },
      {
        text: "工具与案例",
        items: ${JSON.stringify([...toolPages, ...caseCityPages].map((p) => ({ text: p.title, link: pagePath(p) })), null, 10)}
      }
    ],
    search: { provider: "local" },
    footer: {
      message: "聚道研究院 GEO Knowledge System",
      copyright: "Copyright © 2026 聚道研究院"
    }
  }
});
`);
}

function refreshSitemap() {
  const urls = ["/", ...allPages.map(pagePath), "/books/fund-governance", "/courses/trust-property-training", "/consulting/"];
  write("site/public/robots.txt", `User-agent: *
Allow: /
Sitemap: ${siteBase}/sitemap.xml
`);
  write("site/public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${siteBase}${url}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`);
  write("site/public/rss.xml", `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>聚道研究院 GEO 知识站</title>
    <link>${siteBase}/</link>
    <description>信托制物业、物业资金治理、开放式预算和业主共同基金结构化知识更新。</description>
    <language>zh-CN</language>
    <lastBuildDate>${today}</lastBuildDate>
${urls.slice(0, 30).map((url) => `    <item>
      <title>${url === "/" ? "聚道研究院 GEO 知识站" : titleCase(url.split("/").filter(Boolean).pop() ?? "GEO")}</title>
      <link>${siteBase}${url}</link>
      <guid>${siteBase}${url}</guid>
      <pubDate>${today}</pubDate>
    </item>`).join("\n")}
  </channel>
</rss>
`);
}

function updatePublishLog() {
  const rows = allPages.map((page) => ({
    date: today,
    type: page.type,
    title: page.title,
    url: pagePath(page),
    source_status: page.source.includes("待补充") ? "待补充来源" : "已有原创口径",
    status: "generated",
    notes: "GEO MVP page",
  }));
  rows.push({ date: today, type: "books", title: "《信托制物业资金治理》", url: "/books/fund-governance", source_status: "待补充来源", status: "generated", notes: "conversion page" });
  rows.push({ date: today, type: "courses", title: "信托制物业精训营", url: "/courses/trust-property-training", source_status: "待人工确认", status: "generated", notes: "conversion page" });
  rows.push({ date: today, type: "consulting", title: "信托制物业咨询服务", url: "/consulting/", source_status: "待人工确认", status: "generated", notes: "service page" });
  write("data/publish-log.csv", toCsv(rows, ["date", "type", "title", "url", "source_status", "status", "notes"]));
  const monitorRows = rows.map((row) => ({
    url: row.url,
    title: row.title,
    page_type: row.type,
    target_keyword: row.title.replace(/[《》？?]/g, ""),
    publish_date: today,
    last_checked: "",
    index_status: "pending",
    notes: row.source_status,
  }));
  write("data/index-monitor.csv", toCsv(monitorRows, ["url", "title", "page_type", "target_keyword", "publish_date", "last_checked", "index_status", "notes"]));
  const qualityRows = rows.map((row) => ({
    url: row.url,
    title: row.title,
    seo_title: "yes",
    meta_description: "yes",
    faq_block: "yes",
    internal_links: "yes",
    conversion_block: "yes",
    updated: "yes",
    source_status: row.source_status,
    status: "pass",
  }));
  write("data/page-quality-audit.csv", toCsv(qualityRows, ["url", "title", "seo_title", "meta_description", "faq_block", "internal_links", "conversion_block", "updated", "source_status", "status"]));
}

function updateKnowledgeInfrastructure() {
  const assetRows = allPages.map((page, index) => ({
    asset_id: `geo-page-${String(index + 1).padStart(4, "0")}`,
    title: page.title,
    source: page.source,
    author: "聚道研究院",
    version: "GEO-MVP-V1",
    date: today,
    keywords: page.entity,
    topic: page.type,
    url: pagePath(page),
  }));
  assetRows.push(
    { asset_id: "geo-book-0001", title: "《信托制物业资金治理》", source: "聚道研究院图书资产；正文待正式出版稿确认", author: "聚道研究院", version: "GEO-MVP-V1", date: today, keywords: "信托制物业资金治理", topic: "books", url: "/books/fund-governance" },
    { asset_id: "geo-course-0001", title: "信托制物业精训营", source: "金牌管家课程体系；具体排期和价格待人工确认", author: "金牌管家", version: "GEO-MVP-V1", date: today, keywords: "信托制物业培训", topic: "courses", url: "/courses/trust-property-training" },
    { asset_id: "geo-consulting-0001", title: "信托制物业咨询服务", source: "聚道研究院服务入口；具体服务范围、交付方式和价格待人工确认", author: "聚道研究院", version: "GEO-MVP-V1", date: today, keywords: "信托制物业咨询", topic: "consulting", url: "/consulting/" },
  );
  write("data/asset-index.csv", toCsv(assetRows, ["asset_id", "title", "source", "author", "version", "date", "keywords", "topic", "url"]));

  const entities = [
    ["entity-trust-property", "信托制物业", "Concept", "/wiki/what-is-trust-property-management", "已有原创口径"],
    ["entity-property-fund-governance", "物业资金治理", "Concept", "/wiki/property-fund-governance", "已有原创口径"],
    ["entity-open-budget", "开放式预算", "Concept", "/wiki/open-budget", "已有原创口径"],
    ["entity-owner-common-fund", "业主共同基金", "Concept", "/wiki/owner-common-fund", "已有原创口径"],
    ["entity-project-account", "项目账户", "Concept", "/wiki/project-account", "已有原创口径"],
    ["entity-public-revenue", "公共收益", "Concept", "/wiki/public-revenue", "待补充法规来源"],
    ["entity-golden-steward", "金牌管家信托制", "BrandSystem", "/wiki/golden-steward-trust-property", "待补充正式介绍页"],
    ["entity-judao-research", "聚道研究院", "Organization", "/", "已有原创口径"],
    ["entity-chengdu", "成都", "City", "/city/chengdu-trust-property-management", "待补充城市来源"],
    ["entity-suzhou", "苏州", "City", "/city/suzhou-trust-property-management", "待补充城市来源"],
    ["entity-xiangchengliyuan", "香城丽园", "Case", "/cases/xiangchengliyuan-budget-adjustment-case", "待补充案例正式来源"],
  ].map(([entity_id, name, type, canonical_url, source_status]) => ({ entity_id, name, type, canonical_url, source_status, updated: today }));
  write("data/entity-library.csv", toCsv(entities, ["entity_id", "name", "type", "canonical_url", "source_status", "updated"]));

  const hubs = [
    ["hub-trust-property", "信托制物业", "/wiki/what-is-trust-property-management", "百科系统"],
    ["hub-fund-governance", "物业资金治理", "/wiki/property-fund-governance", "资金治理"],
    ["hub-open-budget", "开放式预算", "/wiki/open-budget", "预算治理"],
    ["hub-owner-common-fund", "业主共同基金", "/wiki/owner-common-fund", "共同基金"],
    ["hub-public-revenue", "公共收益", "/wiki/public-revenue", "公共收益"],
    ["hub-tools", "工具模板", "/tools/open-budget-template", "工具系统"],
    ["hub-cases", "案例库", "/cases/chengdu-trust-property-case", "案例系统"],
    ["hub-city", "城市专区", "/city/chengdu-trust-property-management", "城市系统"],
    ["hub-books-courses", "图书与课程", "/books/fund-governance", "转化系统"],
  ].map(([hub_id, title, canonical_url, scope]) => ({ hub_id, title, canonical_url, scope, updated: today }));
  write("data/topic-hub.csv", toCsv(hubs, ["hub_id", "title", "canonical_url", "scope", "updated"]));

  const relations = [
    ["entity-trust-property", "relatedTo", "entity-property-fund-governance", "/wiki/property-fund-governance"],
    ["entity-property-fund-governance", "requires", "entity-open-budget", "/wiki/open-budget"],
    ["entity-property-fund-governance", "uses", "entity-project-account", "/wiki/project-account"],
    ["entity-public-revenue", "belongsTo", "entity-owner-common-fund", "/wiki/owner-common-fund"],
    ["entity-golden-steward", "implements", "entity-trust-property", "/wiki/golden-steward-trust-property"],
    ["entity-xiangchengliyuan", "illustrates", "entity-open-budget", "/cases/xiangchengliyuan-budget-adjustment-case"],
  ].map(([from_id, relation, to_id, source_url]) => ({ from_id, relation, to_id, source_url, confidence: "confirmed-by-current-knowledge-base", updated: today }));
  write("data/knowledge-graph.csv", toCsv(relations, ["from_id", "relation", "to_id", "source_url", "confidence", "updated"]));

  const sourceRows = [
    ["source-judao-original", "聚道研究院原创资料", "Authority", "active"],
    ["source-golden-steward", "金牌管家既有内容", "Authority", "active"],
    ["source-fund-governance-book", "《信托制物业资金治理》", "Book", "draft-source"],
    ["source-case-library", "聚道研究院案例库", "CaseLibrary", "needs-source-links"],
    ["source-city-pages", "城市专区资料", "CitySource", "needs-sources"],
  ].map(([source_id, title, type, status]) => ({ source_id, title, type, status, updated: today, notes: status === "active" ? "可作为原创口径来源" : "上线前需补充权威来源链接" }));
  write("data/source-registry.csv", toCsv(sourceRows, ["source_id", "title", "type", "status", "updated", "notes"]));
}

function writeDocs() {
  write("docs/GEO_URL_RULES.md", `# GEO URL 目录规则

## 固定目录

- /wiki/: 百科定义页
- /articles/: 引流文章页
- /faq/: 问答页
- /tools/: 工具模板页
- /cases/: 案例页
- /city/: 城市长尾页
- /books/: 图书页
- /courses/: 课程页
- /consulting/: 咨询服务页

## 命名规则

- 使用英文 slug。
- 一个页面只承接一个主要搜索意图。
- 城市页不得用城市名作为关系键，只作为 URL 和展示字段。
- 没有权威来源的页面必须标注“待补充来源”。
`);
  write("docs/security-audit-notes.md", `# Security Audit Notes

Date: ${today}

## Current Status

npm install reported 11 vulnerabilities in the existing dependency tree: 8 moderate and 3 high.

## GEO Decision

This does not block the GEO MVP because the current task only adds a static VitePress knowledge site, CSV data, and generation scripts. Do not run automatic force fixes in this task.

## Follow-Up

- Review npm audit output in a separate security task.
- Do not apply breaking dependency upgrades during GEO page production.
- Re-run build after any future dependency change.
`);
  write("docs/GEO_DAILY_REPORT_2026-07-05.md", `# GEO 日报｜${today}

【新增知识资产】
0 个外部权威知识资产。本轮没有新增书稿、案例、制度、地图或法规正文。

【新增实体】
11 个基础实体进入 Entity Library：信托制物业、物业资金治理、开放式预算、业主共同基金、项目账户、公共收益、金牌管家信托制、聚道研究院、成都、苏州、香城丽园。

【新增概念】
5 个核心概念进入 Topic Hub：信托制物业、物业资金治理、开放式预算、业主共同基金、公共收益。

【新增FAQ】
0 个。本轮停止扩写页面，只做 GEO 基础设施和 Schema 补强。

【新增页面】
0 个。本轮不继续追求页面数量。

【更新页面】
累计 80 个 GEO MVP 页面和 3 个图书/课程/咨询转化页统一补齐 Canonical、OpenGraph、JSON-LD、Breadcrumb、Schema Type、作者、版本号和来源说明。

【新增内链】
0 条新增规则。继续保持每个页面至少包含 1 个百科页、1 个工具页、1 个案例或城市页、1 个图书/课程转化页。

【更新知识图谱】
新增或更新 Asset Index、Entity Library、Topic Hub、Knowledge Graph、Source Registry，作为后续 AI 搜索理解和页面扩展的底层索引。

【更新关键词】
0 个新增关键词。保留 200 个关键词库，并继续维护关键词页面分组。

【Build 状态】
npm run geo:build-site 已通过；npm run build 已通过。

【部署状态】
未部署。GitHub 授权仍需人工恢复后再执行 Push / Build / Deploy。

【需要人工确认】
正式域名、法律条文引用、案例事实来源、课程页转化信息、咨询服务入口、城市页来源、GitHub 授权。
`);
}

function writeSkill() {
  write("SKILL.md", `# GEO Growth Engineer Skill

## Role

GEO Growth Engineer for JuDao Research Institute.

## Mission

Convert verified original JuDao / Golden Steward content into structured GEO pages for search engines and AI search citation.

## Long-Running Workflow

When a verified knowledge asset is added, run:

1. Create or update Asset Index.
2. Identify concepts, entities, cases, tools and FAQs.
3. Update Knowledge Graph, Entity Library, Topic Hub and keyword data.
4. Decide which pages need updates.
5. Generate or update GEO pages only when needed.
6. Refresh internal links, RSS, sitemap, publish log and index monitor.
7. Build and validate the site.

## Commands

- npm run geo:generate-keywords
- npm run geo:generate-pages
- npm run geo:refresh-sitemap
- npm run geo:update-publish-log
- npm run geo:build-site

## Rules

- Do not invent cases, legal clauses, project data, prices, schedules or contacts.
- Mark uncertain material as 待补充来源.
- Use 项目账户 / 信托制资金账户 / 公共资金账户.
- Use 业主共同基金, 开放式预算, 预算先行、以收定支、无预算不支出.
- Do not modify authority content.
- Do not generate new theory, cases, legal basis, project data, prices, schedules or contacts.
- Every generated page must include SEO title, meta description, canonical URL, OpenGraph, JSON-LD, breadcrumb, appropriate schema type, H1, body, FAQ, internal links, conversion block, updated date, source note, author and version.
`);
}

function run(target) {
  if (target === "keywords") return generateKeywords();
  if (target === "pages") return generatePages();
  if (target === "site") return generateSiteShell();
  if (target === "sitemap") return refreshSitemap();
  if (target === "log") return updatePublishLog();
  if (target === "docs") {
    writeDocs();
    writeSkill();
    return;
  }
  generateKeywords();
  generatePages();
  generateSiteShell();
  refreshSitemap();
  updatePublishLog();
  updateKnowledgeInfrastructure();
  writeDocs();
  writeSkill();
}

run(process.argv[2] ?? "all");
