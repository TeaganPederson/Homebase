"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  CoinIcon,
  LightningIcon,
  ChartIcon,
  SentimentIcon,
  InsightIcon,
  ToolIcon,
  GearIcon,
  GroupIcon,
  RocketIcon,
} from "./icons";
import { CloudIcon, CloudLightningIcon, CloudUploadIcon, CoinsIcon, CpuIcon, FileIcon, FilesIcon, HashIcon, LinkIcon, LogsIcon, Rocket } from "lucide-react";
import { GenIcon, IconBase } from "react-icons/lib";

type Milestone = {
  date: string;
  title: string;
  description: string;
  icon: JSX.Element;
};

const roadmapData: Milestone[] = [
  {
    date: "Mar 10, 2025",
    title: "v1 Launch Beta Testing",
    description:
      "Homebase v1 open beta goes live with core functionalities and limited features. Early adopters get exclusive access to products and the chance to earn rewards down the road.",
    icon: <FilesIcon />,
  },
  {
    date: "Mar 20, 2025",
    title: "Coin Launch",
    description:
      "Introducing $HOME Coin. More details and presale information coming once launch data is confirmed, join our telegram to stay up to date!",
    icon: <Rocket />,
  },
  {
    date: "Mar 27, 2025",
    title: "Coin of the Week Spaces",
    description:
      "Our first community event will be weekly spaces hosted on Sunday where everyone will submit the coin they think will perform the best that given week. Winner gets an ETH prize",
    icon: <CoinIcon />,
  },
  {
    date: "Apr 10, 2025",
    title: "Trading Competition",
    description:
      "Enter your wallet in a week long trading competition, top 3 traders for the week get ETH prizes",
    icon: <ChartIcon />,
  },
  {
    date: "Apr 17, 2025",
    title: "Community Kick-Off",
    description:
      "Join our AMA & interactive webinar to engage with the team and discuss upcoming products.",
    icon: <GroupIcon />,
  },
  {
    date: "May 03, 2025",
    title: "v2 Official Launch",
    description:
      "Release upgraded features: Adding Chart & TXs Support to screener, Whale Watchers now scans 5x as many Tokens, Introducing Homebase Forum, new trading tools added to library.",
    icon: <FilesIcon />,
  },
  {
    date: "May 10, 2025",
    title: "Hackathon & Q&A",
    description:
      "A community hackathon paired with a live Q&A session to brainstorm and innovate together.",
    icon: <InsightIcon />,
  },
  {
    date: "Jun 01, 2025",
    title: "Base Intelligence",
    description:
      "Building a new phase of on-chain analytics, with AI Smart Analytics.",
    icon: <CloudUploadIcon />,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 15 },
  },
};

type TimelineCardProps = {
  milestone: Milestone;
  index: number;
  isLeft: boolean;
  isSelected: boolean;
  onClick: () => void;
};

function TimelineCard({ milestone, index, isLeft, isSelected, onClick }: TimelineCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-20%" });
  return (
    <motion.div
      ref={ref}
      className="relative w-80 mb-10 cursor-pointer select-none"
      onClick={onClick}
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <div
        className={`p-6 rounded-md border ${isSelected ? "border-blue-600" : "border-black"} bg-white text-black shadow-md`}
      >
        <motion.button
          whileHover={{ rotate: 360, transition: { duration: 0.4 } }}
          className={`w-16 h-16 mb-4 rounded-full border-2 flex items-center justify-center mx-auto ${
            isSelected ? "border-blue-600" : "border-black"
          }`}
        >
          {milestone.icon}
        </motion.button>
        <h3 className="text-xl font-bold mb-2 text-blue-600">{milestone.title}</h3>
        <p className="text-sm mb-2">{milestone.description}</p>
        <span className="text-xs text-gray-600">{milestone.date}</span>
      </div>
    </motion.div>
  );
}

export default function RoadmapSection() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className="relative bg-white py-16 overflow-hidden">
      {/* Top Wave Background – Soft Grey Wave */}
      <div className="absolute top-0 left-0 right-0 -z-10">
        <svg className="w-full h-48 md:h-64" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#E5E7EB" d="M0,160 C360,80 1080,240 1440,160 L1440,0 L0,0 Z"></path>
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Heading */}
        <h2 className="text-center text-4xl font-extrabold mb-12 text-blue-600">
          2025 Roadmap
        </h2>
        
        {/* Timeline Container */}
        <div className="relative mt-8">
          {/* Vertical Center Line (only on PC, not behind heading) */}
          <div className="hidden md:block absolute top-0 left-1/2 h-full w-1 bg-black transform -translate-x-1/2"></div>
          
          <div className="space-y-6">
            {roadmapData.map((milestone, index) => {
              const isLeft = index % 2 === 0;
              const isSelected = selected === index;
              return (
                <div key={index} className="w-full flex items-center justify-center">
                  {isLeft && (
                    <div className="hidden md:flex items-center justify-end w-1/2 pr-4">
                      <div className="h-0.5 w-8 bg-black" />
                    </div>
                  )}
                  <TimelineCard
                    milestone={milestone}
                    index={index}
                    isLeft={isLeft}
                    isSelected={isSelected}
                    onClick={() => setSelected(index)}
                  />
                  {!isLeft && (
                    <div className="hidden md:flex items-center justify-start w-1/2 pl-4">
                      <div className="h-0.5 w-8 bg-black" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Bottom Wave Background – Soft Grey Wave */}
      <div className="absolute bottom-0 left-0 right-0 -z-10">
        <svg className="w-full h-32 md:h-48" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#E5E7EB" d="M0,64 C360,160 1080,0 1440,64 L1440,320 L0,320 Z"></path>
        </svg>
      </div>
    </section>
  );
}



















