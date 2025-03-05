'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollingTokenBanner from '../components/ScrollingTokenBanner';
import { FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Variants for container and items to create a staggered animation effect
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Existing tools
const tools = [
  {
    category: 'Trading & Research Tools',
    items: [
      {
        name: 'Token Scanner',
        link: '/token-scanner',
        description: 'Scan smart contracts for risks and insights.',
      },
      {
        name: 'Whale Watcher',
        link: '/whale-watcher',
        description: 'Track large wallet movements in real time.',
      },
      {
        name: 'Honeypot Scanner',
        link: '/honeypot-scanner',
        description: 'Identify potential honeypot scams before investing.',
      },
    ],
  },
  {
    category: 'Market Insights & Analysis',
    items: [
      {
        name: 'Token Launch Calendar',
        link: '/launch-calendar',
        description: 'Stay updated on upcoming token launches.',
      },
      {
        name: 'Base Chain News',
        link: '/terminal',
        description: 'Get real-time news from top crypto sources.',
      },
      {
        name: 'Real-Time Market Trends',
        link: '/market-trends',
        description: 'Analyze market trends and price action.',
      },
    ],
  },
];

// 🔹 Coming Soon (Premium) tools: keep Auto-Trading Bot, switch the other two
const comingSoonTools = [
  {
    name: 'MEV Protection Suite',
    description: 'Shield your trades from front-running and sandwich attacks.',
  },
  {
    name: 'On-Chain Data Explorer',
    description: 'Visualize advanced on-chain analytics and whale movements.',
  },
  {
    name: 'Auto-Trading Bot',
    description: 'Configure trading bots with rule-based triggers.',
  },
];

export default function ToolsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Scrolling Banner Above Header */}
      <ScrollingTokenBanner />

      <Header />

      <div className="flex-1">
        {/* Page Title with entrance animation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-6 bg-primaryBlue text-white shadow-md"
        >
          <h1 className="text-4xl font-extrabold">Crypto Tools & Analytics</h1>
          <p className="text-lg opacity-90">
            Essential tools for crypto traders &amp; analysts.
          </p>
        </motion.div>

        {/* Tools List */}
        <main className="container mx-auto py-12 px-4">
          {/* Existing tools */}
          {tools.map((section) => (
            <div key={section.category} className="mb-12">
              <motion.h2
                className="text-2xl font-bold text-primaryBlue"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {section.category}
              </motion.h2>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {section.items.map((tool) => (
                  <motion.div
                    key={tool.name}
                    className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition"
                    variants={itemVariants}
                  >
                    <h3 className="text-xl font-bold">{tool.name}</h3>
                    <p className="text-gray-600 text-sm">{tool.description}</p>
                    <Link
                      href={tool.link}
                      className="mt-3 inline-block text-primaryBlue hover:underline"
                    >
                      Access Tool →
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}

          {/* Coming Soon / Premium Tools */}
          <div className="mb-12">
            <motion.h2
              className="text-2xl font-bold text-primaryBlue"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Coming Soon
            </motion.h2>
            <motion.p
              className="text-sm text-gray-500 mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Premium tools and next-level features. Stay tuned!
            </motion.p>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {comingSoonTools.map((tool) => (
                <motion.div
                  key={tool.name}
                  className="relative p-4 bg-gray-200 shadow-md rounded-lg cursor-not-allowed"
                  variants={itemVariants}
                >
                  {/* Overlay indicating locked status */}
                  <div className="absolute inset-0 bg-white opacity-40 rounded-lg pointer-events-none"></div>

                  <div className="flex items-center space-x-2 mb-2 text-gray-700">
                    <FiLock />
                    <h3 className="text-xl font-bold">{tool.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{tool.description}</p>

                  {/* "Locked" link or placeholder */}
                  <Link
                    href="#"
                    className="mt-3 inline-block text-gray-700 font-semibold pointer-events-none"
                  >
                    Locked - Premium Soon
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}















