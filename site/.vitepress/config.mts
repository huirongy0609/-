import { defineConfig } from "vitepress";

const siteBase = process.env.GEO_SITE_URL || "https://huirongy0609.github.io/-";
const siteBasePath = process.env.GEO_SITE_BASE_PATH || "/";

function pageUrl(page: string) {
  const clean = page.replace(/(^|\/)index\.md$/, "").replace(/\.md$/, "");
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
    "dateModified": "2026-07-05"
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
    nav: [
      {
            "text": "首页",
            "link": "/"
      },
      {
            "text": "百科",
            "link": "/wiki/what-is-trust-property-management"
      },
      {
            "text": "资金治理",
            "link": "/wiki/property-fund-governance"
      },
      {
            "text": "开放式预算",
            "link": "/wiki/open-budget"
      },
      {
            "text": "业主共同基金",
            "link": "/wiki/owner-common-fund"
      },
      {
            "text": "案例库",
            "link": "/cases/chengdu-trust-property-case"
      },
      {
            "text": "工具模板",
            "link": "/tools/open-budget-template"
      },
      {
            "text": "常见问答",
            "link": "/faq/trust-property-vs-traditional-property"
      },
      {
            "text": "图书与课程",
            "link": "/books/fund-governance"
      },
      {
            "text": "咨询服务",
            "link": "/consulting/"
      }
],
    sidebar: [
      {
        text: "百科",
        items: [
          {
                    "text": "什么是信托制物业",
                    "link": "/wiki/what-is-trust-property-management"
          },
          {
                    "text": "什么是物业资金治理",
                    "link": "/wiki/property-fund-governance"
          },
          {
                    "text": "什么是开放式预算",
                    "link": "/wiki/open-budget"
          },
          {
                    "text": "什么是业主共同基金",
                    "link": "/wiki/owner-common-fund"
          },
          {
                    "text": "什么是项目账户",
                    "link": "/wiki/project-account"
          },
          {
                    "text": "什么是小区公共收益",
                    "link": "/wiki/public-revenue"
          },
          {
                    "text": "什么是无预算不支出",
                    "link": "/wiki/no-budget-no-spending"
          },
          {
                    "text": "什么是信托制物业软件",
                    "link": "/wiki/trust-property-software"
          },
          {
                    "text": "什么是信托制物业合同",
                    "link": "/wiki/trust-property-contract"
          },
          {
                    "text": "什么是金牌管家信托制物业",
                    "link": "/wiki/golden-steward-trust-property"
          }
]
      },
      {
        text: "FAQ",
        items: [
          {
                    "text": "信托制物业和传统物业有什么区别",
                    "link": "/faq/trust-property-vs-traditional-property"
          },
          {
                    "text": "信托制物业和酬金制有什么区别",
                    "link": "/faq/trust-property-vs-commission-property"
          },
          {
                    "text": "为什么信托制物业需要开放式预算",
                    "link": "/faq/why-open-budget-needed"
          },
          {
                    "text": "为什么信托制物业需要项目账户",
                    "link": "/faq/project-account-why-needed"
          },
          {
                    "text": "业主共同基金可以怎么使用",
                    "link": "/faq/owner-common-fund-use"
          },
          {
                    "text": "小区公共收益为什么要公开",
                    "link": "/faq/public-revenue-disclosure"
          },
          {
                    "text": "预算超支后信托制物业怎么调整",
                    "link": "/faq/budget-overrun-how-to-adjust"
          },
          {
                    "text": "信托制物业适合哪些小区",
                    "link": "/faq/trust-property-suitable-communities"
          },
          {
                    "text": "物业公司如何导入信托制物业",
                    "link": "/faq/how-property-company-adopts-trust-property"
          },
          {
                    "text": "信托制物业软件应该解决什么问题",
                    "link": "/faq/trust-property-software-role"
          }
]
      },
      {
        text: "工具与案例",
        items: [
          {
                    "text": "开放式预算模板",
                    "link": "/tools/open-budget-template"
          },
          {
                    "text": "物业资金公开清单",
                    "link": "/tools/fund-disclosure-checklist"
          },
          {
                    "text": "公共收益公开模板",
                    "link": "/tools/public-revenue-disclosure-template"
          },
          {
                    "text": "预算调整检查清单",
                    "link": "/tools/budget-adjustment-checklist"
          },
          {
                    "text": "信托制物业合同检查清单",
                    "link": "/tools/trust-property-contract-checklist"
          },
          {
                    "text": "成都信托制物业案例",
                    "link": "/cases/chengdu-trust-property-case"
          },
          {
                    "text": "香城丽园预算调整案例",
                    "link": "/cases/xiangchengliyuan-budget-adjustment-case"
          },
          {
                    "text": "苏州信托制物业城市专区",
                    "link": "/city/suzhou-trust-property-management"
          },
          {
                    "text": "成都信托制物业城市专区",
                    "link": "/city/chengdu-trust-property-management"
          },
          {
                    "text": "上海信托制物业城市专区",
                    "link": "/city/shanghai-trust-property-management"
          }
]
      }
    ],
    search: { provider: "local" },
    footer: {
      message: "聚道研究院 GEO Knowledge System",
      copyright: "Copyright © 2026 聚道研究院"
    }
  }
});
