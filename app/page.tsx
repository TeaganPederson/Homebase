"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Link from "next/link";

// ======= Existing Imports =======
import RoadmapSection from "./components/RoadmapSection";
import ScrollingTokenBanner from "./components/ScrollingTokenBanner";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PartnersScroller from "./components/PartnersScroller";
import BaseAiIndex from "./components/Indexes";

// Type definition for NewsArticle
type NewsArticle = {
  title: string;
  content: string;
  author: string;
  source: string;
  publishedAt: string;
  slug: string;
};

// Custom hook to check if viewport is mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
}

// Helper to return scroll animation props based on device type
function getScrollAnimationProps(isMobile: boolean) {
  return {
    initial: { opacity: 0, y: isMobile ? 50 : 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: isMobile ? 1.0 : 0.8, ease: "easeOut" },
  };
}

// ICON COMPONENTS
function CoinIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 256 417"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mb-2"
    >
      <path fill="#2563EB" d="M127.9,0L124.7,11.2V274.6l3.2,3.3l127.9-68.8L127.9,0z" />
      <path fill="#3B82F6" d="M127.9,0L0,209.1l127.9,68.8V0z" />
      <path fill="#60A5FA" d="M127.9,311.3l-2.3,2.3V414.8l2.3,2.2l128.1-76.1L127.9,311.3z" />
      <path fill="#3B82F6" d="M127.9,414.8V311.3L256,239.7L127.9,414.8z" />
      <path fill="#1D4ED8" d="M127.9,277.9l127.9-68.8l-127.9-59.6V277.9z" />
      <path fill="#2563EB" d="M0,209.1l127.9,68.8V218.3L0,209.1z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primaryBlue mx-auto mb-2"
    >
      <rect x="4" y="10" width="4" height="8" />
      <rect x="10" y="6" width="4" height="12" />
      <rect x="16" y="2" width="4" height="16" />
    </svg>
  );
}

function BlockIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primaryBlue mx-auto mb-2"
    >
      <path d="M21 4H3v16h18V4z" />
      <path d="M3 9h18" />
      <path d="M9 9v11" />
      <path d="M15 9v11" />
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg
      width="42"
      height="42"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primaryBlue mx-auto mb-3"
    >
      <path d="M13 2L3 14h9l-1 8 9-12h-9l2-8z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      width="42"
      height="42"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primaryBlue mx-auto mb-3"
    >
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="42"
      height="42"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primaryBlue mx-auto mb-3"
    >
      <path d="M12 2l7 4v6c0 5.25-3.48 10-7 10s-7-4.75-7-10V6l7-4z" />
      <path d="M9.5 12l1.5 1.5L14.5 10" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primaryBlue mx-auto mb-3"
    >
      <polyline points="4 16 8 12 12 16 16 10 20 14" />
      <polyline points="4 20 20 20" />
    </svg>
  );
}

function InsightIcon() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primaryBlue mx-auto mb-3"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ToolIcon() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primaryBlue mx-auto mb-3"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001 1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg
      width="26"
      height="26"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primaryBlue mr-3"
    >
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="21 7 21 17 9 17" />
    </svg>
  );
}

function FlowIcon() {
  return (
    <svg
      width="26"
      height="26"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primaryBlue mr-3"
    >
      <path d="M4 12h16M4 12l6-6M4 12l6 6" />
    </svg>
  );
}

function SentimentIcon() {
  return (
    <svg
      width="26"
      height="26"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primaryBlue mr-3"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}

function EthereumStats({
  stats,
}: {
  stats: { price: number; volume: number; latestBlock: number };
}) {
  if (!stats)
    return <div className="text-center text-gray-500">Loading stats...</div>;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
    hover: {
      scale: 1.02,
      textShadow: "0px 0px 8px rgba(37,99,235,0.8)",
    },
  };

  return (
    <motion.section
      className="px-4 py-8 flex flex-col items-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Section Title */}
      <motion.div
        className="max-w-2xl mx-auto mb-6 text-center"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-extrabold text-primaryBlue">
          Ethereum Network Stats
        </h2>
        <p className="text-gray-600 mt-1 text-lg">
          Live insights into Ethereum’s price, trading volume, and latest block
          data.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-lg sm:max-w-3xl"
        variants={containerVariants}
      >
        {[
          {
            title: "ETH Price (USD)",
            value: stats.price,
            suffix: "$",
            icon: <CoinIcon />,
          },
          {
            title: "24h Ethereum Volume",
            value: stats.volume,
            suffix: "$",
            icon: <VolumeIcon />,
          },
          {
            title: "Latest Block",
            value: stats.latestBlock,
            suffix: "",
            icon: <BlockIcon />,
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="w-full bg-white border border-gray-300 rounded-lg shadow-md flex flex-col items-center p-4"
            variants={cardVariants}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="text-primaryBlue text-4xl mb-2"
              transition={{ type: "spring", stiffness: 200 }}
            >
              {stat.icon}
            </motion.div>
            <h2 className="text-sm font-semibold text-gray-700 text-center">
              {stat.title}
            </h2>
            <p className="text-xl font-bold text-gray-900 mt-1">
              <CountUp
                start={stat.value * 0.9}
                end={stat.value}
                duration={2}
                separator=","
                decimals={2}
                suffix={` ${stat.suffix}`}
              />
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

// Main page component
function HomePage() {
  const [stats, setStats] = useState({
    price: 0,
    volume: 0,
    latestBlock: 0,
  });
  const [latestArticles, setLatestArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isMobile = useIsMobile();
  const scrollProps = getScrollAnimationProps(isMobile);

  // Fetch live ETH data and block info
  useEffect(() => {
    async function fetchData() {
      try {
        const coingeckoUrl = process.env.NEXT_PUBLIC_COINGECKO_API_URL;
        const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_API_URL;
        if (!coingeckoUrl || !alchemyUrl) {
          console.error("Missing API URLs in environment variables.");
          return;
        }
        // Alchemy: latest block
        const alchemyRes = await fetch(alchemyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_blockNumber",
            params: [],
            id: 1,
          }),
        });
        const alchemyData = await alchemyRes.json();
        const latestBlock = parseInt(alchemyData?.result, 16) || 0;

        // CoinGecko: ETH price & volume
        const coingeckoRes = await fetch(`${coingeckoUrl}/coins/ethereum`);
        const coingeckoData = await coingeckoRes.json();
        const price = coingeckoData?.market_data?.current_price?.usd || 0;
        const volume = coingeckoData?.market_data?.total_volume?.usd || 0;

        setStats({ price, volume, latestBlock });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();

    // Optionally refetch every 10s
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch latest news articles
  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) {
          setError("Failed to fetch articles");
          setLoading(false);
          return;
        }
        const articles: NewsArticle[] = await res.json();
        const sortedArticles = articles.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        setLatestArticles(sortedArticles.slice(0, 3));
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Error fetching articles");
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Scrolling Token Banner */}
      <ScrollingTokenBanner />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <motion.section
        className="text-center py-20 bg-gradient-to-r from-primaryBlue to-blue-500 text-white"
        {...scrollProps}
      >
        <h1 className="text-5xl font-extrabold mb-6 leading-tight">
          See Forward with Homebase Analytics
        </h1>
        <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover insights that drive Base Chain Markets. Get helpful trading
          tools, professional insights, and on-chain analytics—all in one place.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/docs">
            <button className="px-6 py-3 border border-white bg-transparent text-white font-semibold rounded-full hover:bg-white hover:text-primaryBlue transition-all">
              Read Docs →
            </button>
          </Link>
          <Link href="/terminal">
            <button className="px-6 py-3 border border-white bg-transparent text-white font-semibold rounded-full hover:bg-white hover:text-primaryBlue transition-all">
              Enter Terminal →
            </button>
          </Link>
        </div>
      </motion.section>

      {/* PARTNERS SCROLLING LOGOS */}
      <PartnersScroller />

      {/* Ethereum Stats Section */}
      <EthereumStats stats={stats} />

      {/* Base AI Index Section */}
      {isMobile ? (
        <section className="py-8 w-full px-4">
          <BaseAiIndex />
        </section>
      ) : (
        <section className="py-12 container mx-auto px-4">
          <BaseAiIndex />
        </section>
      )}

{/* "What is Base?" Section */}
<motion.section
  className="w-full py-16 bg-gray-50 text-center"
  {...scrollProps}
>
  <div className="max-w-5xl mx-auto px-4">
    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
      <span className="text-black">What is</span>{" "}
      <span className="text-primaryBlue">Base?</span>
    </h2>
    <p className="text-gray-700 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
      Base is a next-generation Layer 2 Blockchain Network, designed for faster and cheaper
      transactions.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <motion.div
        className="p-6 bg-white rounded-lg shadow-sm"
        whileHover={{ scale: 1.05 }}
      >
        <LightningIcon />
        <h3 className="text-xl font-bold text-primaryBlue mb-3">
          Faster Transactions
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Enjoy near-instant confirmations and lower fees.
        </p>
      </motion.div>
      <motion.div
        className="p-6 bg-white rounded-lg shadow-sm"
        whileHover={{ scale: 1.05 }}
      >
        <CodeIcon />
        <h3 className="text-xl font-bold text-primaryBlue mb-3">
          EVM-Compatible
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Deploy your dApps seamlessly with full Ethereum compatibility.
        </p>
      </motion.div>
      <motion.div
        className="p-6 bg-white rounded-lg shadow-sm"
        whileHover={{ scale: 1.05 }}
      >
        <ShieldIcon />
        <h3 className="text-xl font-bold text-primaryBlue mb-3">
          Secure & Scalable
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Robust security meets unrivaled scalability, backed by industry
          leaders.
        </p>
      </motion.div>
    </div>
  </div>
</motion.section>

{/* "How Homebase Powers Base" Section */}
<motion.section
  className="w-full py-16 bg-gray-50 text-center relative"
  {...scrollProps}
>
  {/* Original wave background unchanged */}
  <div className="absolute inset-0 w-full h-full bg-gray-50">
    <svg
      className="absolute bottom-0 left-0 w-full"
      viewBox="0 0 1440 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="white"
        d="M0,256L120,245.3C240,235,480,213,720,181.3C960,149,1200,107,1320,85.3L1440,64V320H1320C1200,320,960,320,720,320C480,320,240,320,120,320H0Z"
      />
    </svg>
  </div>
  <div className="max-w-5xl mx-auto px-4 relative z-10">
    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-primaryBlue leading-tight">
      How Homebase Powers Base
    </h2>
    <p className="text-gray-700 max-w-3xl mx-auto mb-8 text-lg leading-relaxed">
      Homebase provides cutting-edge tools to track on-chain data, monitor whale
      movements, and stay ahead of token launches.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Screener Card with updated design */}
      <motion.div
        className="p-6 bg-white border-2 border-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group" // Updated card styles
        whileHover={{ scale: 1.05 }}
      >
        <ChartIcon className="w-10 h-10 mx-auto mb-4 text-gray-500 group-hover:text-primaryBlue transition-colors duration-300" /> {/* Added icon styling */}
        <h3 className="text-xl font-bold text-black mb-2">
          Homebase Screener
        </h3>
        <p className="text-base text-gray-700 leading-relaxed mb-4"> {/* Updated text size and color */}
          Get real-time coin prices and find the hottest base pairs.
        </p>
        <Link href="/token-scanner">
          <button
            className="mt-3 px-5 py-2 border-2 border-gray-800 text-gray-900 font-bold rounded-full hover:bg-primaryBlue hover:text-white hover:border-primaryBlue transition-all duration-300" // Updated button hover color
          >
            Screener →
          </button>
        </Link>
      </motion.div>
      {/* Whale Watchers Card with updated design */}
      <motion.div
        className="p-6 bg-white border-2 border-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group" // Updated card styles
        whileHover={{ scale: 1.05 }}
      >
        <InsightIcon className="w-10 h-10 mx-auto mb-4 text-gray-500 group-hover:text-primaryBlue transition-colors duration-300" /> {/* Added icon styling */}
        <h3 className="text-xl font-bold text-black mb-2">
          Whale Watchers
        </h3>
        <p className="text-base text-gray-700 leading-relaxed mb-4"> {/* Updated text size and color */}
          Track large wallet movements and detect potential market shifts.
        </p>
        <Link href="/whale-watcher">
          <button
            className="mt-3 px-5 py-2 border-2 border-gray-800 text-gray-900 font-bold rounded-full hover:bg-primaryBlue hover:text-white hover:border-primaryBlue transition-all duration-300" // Updated button hover color
          >
            Track Whales →
          </button>
        </Link>
      </motion.div>
      {/* Token Launch Calendar Card with updated design */}
      <motion.div
        className="p-6 bg-white border-2 border-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group" // Updated card styles
        whileHover={{ scale: 1.05 }}
      >
        <ToolIcon className="w-10 h-10 mx-auto mb-4 text-gray-500 group-hover:text-primaryBlue transition-colors duration-300" /> {/* Added icon styling */}
        <h3 className="text-xl font-bold text-black mb-2">
          Token Launch Calendar
        </h3>
        <p className="text-base text-gray-700 leading-relaxed mb-4"> {/* Updated text size and color */}
          Stay ahead with upcoming token launches and market trends.
        </p>
        <Link href="/launch-calendar">
          <button
            className="mt-3 px-5 py-2 border-2 border-gray-800 text-gray-900 font-bold rounded-full hover:bg-primaryBlue hover:text-white hover:border-primaryBlue transition-all duration-300" // Updated button hover color
          >
            View Calendar →
          </button>
        </Link>
      </motion.div>
    </div>
  </div>
</motion.section>

      {/* Roadmap Section */}
      <RoadmapSection />

      {/* Latest News Section (Integrated) */}
      {loading ? (
        <motion.section className="py-12 container mx-auto px-4" {...scrollProps}>
          <h2 className="text-3xl font-extrabold mb-6 text-center">Latest News</h2>
          <p className="text-center">Loading latest news...</p>
        </motion.section>
      ) : error ? (
        <motion.section className="py-12 container mx-auto px-4" {...scrollProps}>
          <h2 className="text-3xl font-extrabold mb-6 text-center">Latest News</h2>
          <p className="text-center text-red-500">{error}</p>
        </motion.section>
      ) : (
        <motion.section className="py-12 container mx-auto px-4" {...scrollProps}>
          <h2 className="text-3xl font-extrabold mb-6 text-center">Latest News</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => {
              console.log("Article slug in LatestNewsSection:", article.slug);
              return (
                <motion.div
                  key={article.slug}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 shadow-md border rounded-lg bg-white/70 backdrop-blur-md"
                >
                  <h3 className="text-xl font-bold text-primaryBlue">{article.title}</h3>
                  <p className="text-sm mt-2">{article.content.slice(0, 100)}...</p>
                  <Link
                    href={`/base-chain-news/${article.slug}`}
                    className="text-primaryBlue mt-4 inline-block hover:underline"
                  >
                    Read more
                  </Link>
                </motion.div>
              );
            })}
          </div>
          {/* Optional: Add a "View All News" link to /base-chain-news */}
          <div className="text-center mt-8">
            <Link
              href="/base-chain-news"
              className="text-primaryBlue font-semibold hover:underline"
            >
              View All News →
            </Link>
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Export your Page component
export default function Page() {
  return <HomePage />;
}