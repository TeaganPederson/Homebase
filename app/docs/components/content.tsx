"use client";

import {
  Lightbulb,
  FileText,
  Clipboard,
  Calendar,
  PieChart,
  Activity,
  AlertTriangle,
  Users,
  PlayCircle,
  TrendingUp,
  Code,
  Book,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface ContentProps {
  activeSection: string;
}

interface SectionData {
  title: string;
  lastUpdated: string;
  breadcrumb: string[];
  content: string;
  callout: string;
}

const contentData: Record<string, SectionData> = {
  products: {
    title: "Products Overview",
    lastUpdated: "February 15, 2025",
    breadcrumb: ["Home", "Docs", "Products"],
    content: `
Homebase provides a range of tools for exploring the Base chain effectively:
• Analytics Dashboard for real-time data
• Market Insights for price & volume tracking
• Community Forum for direct engagement
    `,
    callout:
      "We regularly update each tool based on community feedback. Share your thoughts to help us shape the future of Homebase!",
  },
  analytics: {
    title: "Trading Tools",
    lastUpdated: "February 15, 2025",
    breadcrumb: ["Home", "Docs", "Products", "Analytics"],
    content: `
Trading Tools

Navigating the fast-paced world of crypto trading requires precision, speed, and reliable insights. Homebase offers a suite of powerful trading tools designed to give traders an edge in the market.

Whale Watchers Tool
Track the movements of the biggest players in the market with our Whale Watchers Tool. By monitoring large wallet transactions and key liquidity shifts, this tool helps you identify trends before they hit the mainstream. Stay ahead by following the money and reacting strategically to major market moves.

Token Screener
Finding the right tokens at the right time can be the difference between catching a moonshot and missing out. Our Token Screener provides real-time filtering and ranking based on liquidity, volume, contract safety, and other key indicators.

Honeypot Tracker
Avoid scams and protect your investments with our Honeypot Tracker. This tool scans smart contracts for malicious code, ensuring that tokens can be freely traded and aren’t designed to trap funds.

Homebase equips you with the best tools to trade smarter, safer, and faster.
    `,
    callout:
      "Pro Tip: Our Whale Watchers Tool provides insights on specific tokens—not all on-chain transactions.",
  },
  insights: {
    title: "Market Insights",
    lastUpdated: "February 15, 2025",
    breadcrumb: ["Home", "Docs", "Products", "Market Insights"],
    content: `
Market Insights

Staying informed is the key to success in crypto. Homebase provides cutting-edge market insights through our News Terminal, Launch Calendar, and Analysts sections.

News Terminal
Aggregates real-time updates from top sources to track breaking news, regulatory changes, and market shifts.

Launch Calendar
Keeps you ahead by tracking upcoming token launches, major airdrops, protocol upgrades, and other key events.

Analysts
Features expert breakdowns of market trends and trading strategies, giving actionable intelligence for confident decisions.
    `,
    callout:
      "Heads Up: Our News Terminal content is curated by our AI to deliver only the most relevant updates.",
  },
  forum: {
    title: "Community Forum",
    lastUpdated: "February 15, 2025",
    breadcrumb: ["Home", "Docs", "Products", "Forum"],
    content: `
Community Forum

Crypto thrives on community, and at Homebase, we’re building a space where traders, developers, and investors can connect, share insights, and collaborate. Our Community Forum, set to launch at the end of March, will be a hub for discussions, market analysis, and collaboration within the Base chain ecosystem and beyond.

What the Forum Offers:
1. Market Discussions – Engage in real-time conversations about token trends, trading strategies, and industry news.
2. Project Deep Dives – Get community-driven research and analysis on new and emerging projects.
3. Alpha & Trade Signals – Stay ahead with user-generated trade signals and alpha leaks.
4. Technical Help & Development – Connect with developers and blockchain experts for guidance.
5. Community Challenges & Rewards – Participate in exclusive events and earn recognition.
    `,
    callout:
      "We hold weekly AMAs and special events—join the conversation and share your ideas.",
  },
  launch: {
    title: "When Do We Launch?",
    lastUpdated: "February 15, 2025",
    breadcrumb: ["Home", "Docs", "Launch"],
    content: `
Homebase Launch – Set for early March

Homebase is set to launch in early March, and we’re bringing the hype straight to Clank.Fun—the premier launchpad on Base. Our decision to launch on Clank isn’t just about convenience; it’s about tapping into a thriving culture, minimizing LP fees, and ensuring our platform has the best possible start in the Base ecosystem.

Why Clank.Fun?
• Low Liquidity Fees – Maximizes initial liquidity.
• Engaged Community – Ideal for projects with strong social momentum.
• Proven Success – Home to some of Base’s most viral launches.

What to Expect:
• Fair token launch with no insider allocations.
• Massive community engagement.
• A strong post-launch roadmap with real utility.
    `,
    callout:
      "Early adopters may receive exclusive perks—stay tuned for airdrop announcements.",
  },
  "past-news": {
    title: "Past News",
    lastUpdated: "February 15, 2025",
    breadcrumb: ["Home", "Docs", "Past News"],
    content: `
Homebase Company News & Updates

Trading Tools Expansion:
• Whale Watchers Tool – Tracks large Base chain transactions.
• Token Screener – Helps traders analyze tokens.
• Honeypot Tracker – Detects scams.

Market Insights Features:
• News Terminal – Aggregates crypto news.
• Launch Calendar – Tracks upcoming events.

Analyst Reports:
• Provides in-depth market analysis.

Forum Announcement:
• Community Forum launching at the end of March.

Token Launch:
• Homebase token launching on Clank.Fun.
    `,
    callout:
      "Follow our Twitter for monthly retrospectives on development milestones and upcoming ideas.",
  },
  "company-updates": {
    title: "Company Updates",
    lastUpdated: "February 15, 2025",
    breadcrumb: ["Home", "Docs", "Company Updates"],
    content: `
Stay tuned for behind-the-scenes updates at Homebase.
We share roadmap adjustments, team expansions, and funding news regularly.
    `,
    callout:
      "Got suggestions? We rely on community insight to guide our development priorities.",
  },
  "getting-started": {
    title: "Getting Started",
    lastUpdated: "February 15, 2025",
    breadcrumb: ["Home", "Docs", "Getting Started"],
    content: `
Getting Started with Homebase

1.) Create an account:
   • Click the “Sign-in” button.
   • Choose a Username.
   • Enjoy our library of tools.

2.) Explore Tool Library:
   - Whale Watchers – Track major wallet movements.
   - Token Screener – Analyze tokens based on key indicators.
   - Honeypot Scanner – Verify contracts before trading.
   

3.) Stay Informed:
   - News Terminal – Get the latest crypto news.
   - Launch Calendar – Never miss token launches.
   - Analyst Reports – In-depth market breakdowns.

4.) Join the Community Forum:
   • Launching in late March—a space for collaboration.

5.) Participate in the Homebase Token Launch:
   • Early March on Clank.Fun.
    `,
    callout:
      "If you have any trouble, our support team is ready to help. Ask in the forum or email support@homebase.com.",
  },
  "api-docs": {
    title: "API Documentation",
    lastUpdated: "February 15, 2025",
    breadcrumb: ["Home", "Docs", "API Documentation"],
    content: `
Developers can integrate real-time Base chain data into their apps via our RESTful API.
Access transaction details, wallet info, and market metrics with ease.
    `,
    callout:
      "API Keys are currently unavailable; stay tuned for updates.",
  },
  default: {
    title: "Welcome to Homebase Docs",
    lastUpdated: "N/A",
    breadcrumb: ["Home", "Docs"],
    content: "Select a section from the sidebar to explore our features.",
    callout: "",
  },
};

function crumbToRoute(crumb: string): string {
  if (crumb === "Home") return "/";
  if (crumb === "Docs") return "/docs";
  return `/docs/${crumb.toLowerCase().replace(/\s+/g, "-")}`;
}

/**
 * Chooses a unique icon based on keywords in the paragraph and active section.
 * Uses a set to avoid duplicate icon usage.
 */
function chooseUniqueIcon(para: string, sectionId: string, usedIcons: Set<string>): JSX.Element {
  const lower = para.toLowerCase();
  const mapping: { [keyword: string]: { icon: JSX.Element; name: string } } = {
    "whale watchers": { icon: <Activity className="w-8 h-8 text-[#0052FF]" />, name: "whale" },
    "token screener": { icon: <Clipboard className="w-8 h-8 text-[#0052FF]" />, name: "screener" },
    "honeypot tracker": { icon: <AlertTriangle className="w-8 h-8 text-[#0052FF]" />, name: "honeypot" },
    "news terminal": { icon: <FileText className="w-8 h-8 text-[#0052FF]" />, name: "news" },
    "launch calendar": { icon: <Calendar className="w-8 h-8 text-[#0052FF]" />, name: "calendar" },
    "analysts": { icon: <PieChart className="w-8 h-8 text-[#0052FF]" />, name: "analysts" },
    "community forum": { icon: <Users className="w-8 h-8 text-[#0052FF]" />, name: "forum" },
    "connect your wallet": { icon: <PlayCircle className="w-8 h-8 text-[#0052FF]" />, name: "wallet" },
  };

  for (const keyword in mapping) {
    if (lower.includes(keyword) && !usedIcons.has(mapping[keyword].name)) {
      usedIcons.add(mapping[keyword].name);
      return mapping[keyword].icon;
    }
  }

  const fallbackMapping: { [name: string]: JSX.Element } = {
    trending: <TrendingUp className="w-8 h-8 text-[#0052FF]" />,
    code: <Code className="w-8 h-8 text-[#0052FF]" />,
    book: <Book className="w-8 h-8 text-[#0052FF]" />,
  };

  for (const name in fallbackMapping) {
    if (!usedIcons.has(name)) {
      usedIcons.add(name);
      return fallbackMapping[name];
    }
  }

  return <Book className="w-8 h-8 text-[#0052FF]" />;
}

/**
 * Returns a CTA link (white text with an arrow) if the paragraph contains certain keywords.
 */
function getCTA(para: string): JSX.Element | null {
  const lower = para.toLowerCase();
  if (lower.includes("connect your wallet")) {
    return (
      <Link href="/connect">
        <span className="mt-2 inline-flex items-center text-white hover:underline">
          Connect Wallet <ArrowRight className="ml-1 w-4 h-4" />
        </span>
      </Link>
    );
  }
  if (lower.includes("community forum")) {
    return (
      <Link href="/forum">
        <span className="mt-2 inline-flex items-center text-white hover:underline">
          Join Forum <ArrowRight className="ml-1 w-4 h-4" />
        </span>
      </Link>
    );
  }
  if (lower.includes("token launch")) {
    return (
      <Link href="/launch">
        <span className="mt-2 inline-flex items-center text-white hover:underline">
          Learn More <ArrowRight className="ml-1 w-4 h-4" />
        </span>
      </Link>
    );
  }
  return null;
}

export default function Content({ activeSection }: ContentProps) {
  const section = contentData[activeSection] || contentData.default;

  const breadcrumbElements = section.breadcrumb.map((crumb, idx) => {
    const isLast = idx === section.breadcrumb.length - 1;
    const route = crumbToRoute(crumb);
    return (
      <div key={crumb} className="flex items-center space-x-1">
        {isLast ? (
          <span className="text-xs text-gray-300">{crumb}</span>
        ) : (
          <a
            href={route}
            className="text-xs text-blue-400 hover:underline truncate"
            title={crumb}
          >
            {crumb}
          </a>
        )}
        {!isLast && <span className="text-xs">/</span>}
      </div>
    );
  });

  // Split the content into paragraphs based on double newlines.
  const paragraphs = section.content.split("\n\n").filter((p) => p.trim().length > 0);

  // Set to track used icon keys for uniqueness.
  const usedIcons = new Set<string>();

  return (
    <div className="flex-grow p-4 md:p-6 bg-black">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-2 mb-2">
        <div className="flex flex-wrap gap-x-2 items-center text-gray-400">
          {breadcrumbElements}
        </div>
        <span className="text-xs text-gray-400">
          Last Updated: {section.lastUpdated}
        </span>
      </div>
      {/* Section Title */}
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
        {section.title}
      </h2>
      {/* Callout Section placed under the header */}
      {section.callout && (
        <div className="mb-6">
          <div className="p-4 bg-[#0052FF] border-l-4 border-[#0052FF] rounded-md flex items-start space-x-3">
            <Lightbulb className="text-white mt-1" />
            <p className="text-sm md:text-base text-white">
              {section.callout}
            </p>
          </div>
        </div>
      )}
      {/* Content Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paragraphs.map((para, idx) => {
          const icon = chooseUniqueIcon(para, activeSection, usedIcons);
          const cta = getCTA(para);
          return (
            <div
              key={idx}
              className="flex flex-col gap-2 p-4 rounded-md shadow border border-gray-700 bg-black"
            >
              <div className="flex items-start gap-3">
                <div>{icon}</div>
                <p className="mt-1 text-sm md:text-base text-gray-300 whitespace-pre-line flex-1">
                  {para.trim()}
                </p>
              </div>
              {cta && <div>{cta}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}









