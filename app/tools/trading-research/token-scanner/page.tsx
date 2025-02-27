"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Helper for color-coding positive/negative changes
function getColorClass(value: number) {
  return value >= 0 ? "text-green-500" : "text-red-500";
}

// DexScreener token type (extended with optional info for images)
type DexToken = {
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  txns: {
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  priceChange: {
    h1?: number;
    h6?: number;
    h24?: number;
  };
  volume: {
    h24: number;
  };
  liquidity: {
    usd: number;
  };
  marketCap?: number;
  fdv?: number;
  pairCreatedAt?: number;
  trendingScore?: number;
  info?: {
    imageUrl?: string;
  };
};

// Compute trending value based on price changes and volume/MCAP.
function computeTrending(token: DexToken): number {
  const { h1, h6, h24 } = token.priceChange || {};
  const avgChange = (Number(h1) + Number(h6) + Number(h24)) / 3;
  const ratio =
    token.marketCap && token.marketCap > 0
      ? token.volume.h24 / token.marketCap
      : 1;
  let trending = avgChange * ratio;
  if (avgChange > 0) trending *= 1.1;
  return trending;
}

// Convert pairCreatedAt to an "age" string (days or hours)
function getAge(createdAt?: number): string {
  if (!createdAt) return "N/A";
  const diffMs = Date.now() - createdAt;
  const days = diffMs / (1000 * 60 * 60 * 24);
  return days < 1 ? `${Math.floor(days * 24)}h` : `${Math.floor(days)}d`;
}

// Sum transactions in the last 24h
function getTxns24h(token: DexToken): number {
  if (!token.txns || !token.txns.h24) return 0;
  const { buys, sells } = token.txns.h24;
  return buys + sells;
}

// FlameIcon using a flame emoji with animation
function FlameIcon() {
  return (
    <motion.span
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      className="text-xl"
    >
      {"🔥"}
    </motion.span>
  );
}

export default function TokenScanner() {
  const [tokens, setTokens] = useState<DexToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Sorting filter state: "trending", "1h", "6h", "24h"
  const [sortFilter, setSortFilter] = useState("trending");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function fetchTokens() {
      setLoading(true);
      try {
        const tokenAddresses =
          "0x2d60674cea02a389cd02bed2e2e85eeba4e31b79," +
          "0x2d60674cea02a389cd02bed2e2e85eeba4e31b79," +
          "0x3c8cd0db9a01efa063a7760267b822a129bc7dca," +
          "0x1bc0c42215582d5a085795f4badbac3ff36d1bcb," +
          "0x9704d2adbc02c085ff526a37ac64872027ac8a50," +
          "0xbc45647ea894030a4e9801ec03479739fa2485f0," +
          "0x1185cb5122edad199bdbc0cbd7a0457e448f23c7," +
          "0xb33ff54b9f7242ef1593d2c9bcd8f9df46c77935," +
          "0x20dd04c17afd5c9a8b3f2cdacaa8ee7907385bef," +
          "0x2676e4e0e2eb58d9bdb5078358ff8a3a964cedf5," +
          "0x6921B130D297cc43754afba22e5EAc0FBf8Db75b," +
          "0x79dacb99a8698052a9898e81fdf883c29efb93cb," +
          "0xA6f774051dFb6b54869227fDA2DF9cb46f296c09," +
          "0xBA5E66FB16944Da22A62Ea4FD70ad02008744460," +
          "0xC438B0c0E80A8Fa1B36898d1b36A3fc2eC371C54," +
          "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b," +
          "0xB1a03EdA10342529bBF8EB700a06C60441fEf25d," +
          "0xD461A534AF11EF58E9F9add73129a1f45485A8dc," +
          "0xB3B32F9f8827D4634fE7d973Fa1034Ec9fdDB3B3," +
          "0x4F9Fd6Be4a90f2620860d680c0d4d5Fb53d1A825," +
          "0x4B6104755AfB5Da4581B81C552DA3A25608c73B8," +
          "0x940181a94A35A4569E4529A3CDfB74e38FD98631," +
          "0x9a26F5433671751C3276a065f57e5a02D2817973," +
          "0x768BE13e1680b5ebE0024C42c896E3dB59ec0149," +
          "0x6797B6244fA75F2e78cDFfC3a4eb169332b730cc";

        const res = await fetch(
          `/api/tokens?chainId=base&tokenAddresses=${tokenAddresses}`
        );
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to fetch token data");
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const tokensWithTrending = data.map((token: DexToken) => ({
            ...token,
            trendingScore: computeTrending(token),
          }));
          const sorted = tokensWithTrending.sort(
            (a, b) => b.trendingScore! - a.trendingScore!
          );
          setTokens(sorted);
        } else {
          setError("No tokens returned");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching token data");
      } finally {
        setLoading(false);
      }
    }
    fetchTokens();
  }, []);

  const sortedTokens = useMemo(() => {
    if (sortFilter === "trending") {
      return [...tokens].sort((a, b) => b.trendingScore! - a.trendingScore!);
    } else if (sortFilter === "1h") {
      return [...tokens].sort((a, b) =>
        sortDirection === "desc"
          ? (b.priceChange.h1 ?? 0) - (a.priceChange.h1 ?? 0)
          : (a.priceChange.h1 ?? 0) - (b.priceChange.h1 ?? 0)
      );
    } else if (sortFilter === "6h") {
      return [...tokens].sort((a, b) =>
        sortDirection === "desc"
          ? (b.priceChange.h6 ?? 0) - (a.priceChange.h6 ?? 0)
          : (a.priceChange.h6 ?? 0) - (b.priceChange.h6 ?? 0)
      );
    } else if (sortFilter === "24h") {
      return [...tokens].sort((a, b) =>
        sortDirection === "desc"
          ? (b.priceChange.h24 ?? 0) - (a.priceChange.h24 ?? 0)
          : (a.priceChange.h24 ?? 0) - (b.priceChange.h24 ?? 0)
      );
    }
    return tokens;
  }, [tokens, sortFilter, sortDirection]);

  const indexOfLastToken = currentPage * pageSize;
  const indexOfFirstToken = indexOfLastToken - pageSize;
  const currentTokens = sortedTokens.slice(indexOfFirstToken, indexOfLastToken);
  const totalPages = Math.ceil(sortedTokens.length / pageSize);

  function handleFilterChange(filter: string) {
    if (sortFilter === filter) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortFilter(filter);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen bg-black text-white w-full m-0 p-0">
      {/* Banner */}
      <div className="w-full bg-[#0060FF] text-white m-0 p-0">
        <div className="flex items-center justify-between p-1 sm:p-2 m-0">
          {/* Left Column: Back to Tools link */}
          <div className="flex items-center">
            <Link
              href="/tools"
              className="ml-2 underline text-white text-sm sm:text-lg"
            >
              Back to Tools
            </Link>
          </div>
          {/* Center Column: Heading and subheading */}
          <div className="flex flex-col items-center">
            <h1 className="text-2xl sm:text-3xl font-bold m-0">
              Base Chain Token Screener
            </h1>
            <p className="text-xs sm:text-lg opacity-90 m-0">
              Discover top tokens on Base in real time.
            </p>
          </div>
          {/* Right Column: Spacer */}
          <div className="w-10 hidden md:block"></div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm w-full">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th
                className="p-2 sm:p-3 text-left cursor-pointer"
                onClick={() => handleFilterChange("trending")}
              >
                #{" "}
                {sortFilter === "trending" &&
                  (sortDirection === "desc" ? " ↓" : " ↑")}
              </th>
              <th className="p-2 sm:p-3 text-left">POOL</th>
              <th className="p-2 sm:p-3 text-right">PRICE</th>
              <th className="p-2 sm:p-3 text-right">AGE</th>
              <th className="p-2 sm:p-3 text-right">TXN</th>
              <th
                className="p-2 sm:p-3 text-right cursor-pointer"
                onClick={() => handleFilterChange("1h")}
              >
                1H{" "}
                {sortFilter === "1h" &&
                  (sortDirection === "desc" ? " ↓" : " ↑")}
              </th>
              <th
                className="p-2 sm:p-3 text-right cursor-pointer"
                onClick={() => handleFilterChange("6h")}
              >
                6H{" "}
                {sortFilter === "6h" &&
                  (sortDirection === "desc" ? " ↓" : " ↑")}
              </th>
              <th
                className="p-2 sm:p-3 text-right cursor-pointer"
                onClick={() => handleFilterChange("24h")}
              >
                24H{" "}
                {sortFilter === "24h" &&
                  (sortDirection === "desc" ? " ↓" : " ↑")}
              </th>
              <th className="p-2 sm:p-3 text-right">VOLUME</th>
              <th className="p-2 sm:p-3 text-right">LIQUIDITY</th>
              <th className="p-2 sm:p-3 text-right">MCAP</th>
              <th className="p-2 sm:p-3 text-right">FDV</th>
            </tr>
          </thead>
          <tbody>
            {currentTokens.map((token, index) => (
              <tr
                key={token.pairAddress}
                className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
              >
                {/* Ranking Column */}
                <td className="p-2 sm:p-3 text-left border-b border-gray-700">
                  {sortFilter === "trending" && indexOfFirstToken + index < 3 ? (
                    <div className="flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 font-bold">
                        {indexOfFirstToken + index + 1}
                      </span>
                      <FlameIcon className="ml-1" />
                    </div>
                  ) : (
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 font-bold">
                      {indexOfFirstToken + index + 1}
                    </span>
                  )}
                </td>
                {/* POOL */}
                <td className="p-2 sm:p-3 flex items-center space-x-2 border-b border-gray-700">
                  <img
                    src={token.info?.imageUrl || "/fallback.png"}
                    alt={token.baseToken.symbol}
                    className="w-5 h-5 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">
                      {token.baseToken.name} / {token.quoteToken.symbol}
                    </div>
                    <div className="text-xs text-gray-400">
                      {token.baseToken.symbol}
                    </div>
                  </div>
                </td>
                {/* PRICE */}
                <td className="p-2 sm:p-3 text-right border-b border-gray-700">
                  ${Number(token.priceUsd).toFixed(5)}
                </td>
                {/* AGE */}
                <td className="p-2 sm:p-3 text-right border-b border-gray-700">
                  {getAge(token.pairCreatedAt)}
                </td>
                {/* TXN (24h) */}
                <td className="p-2 sm:p-3 text-right border-b border-gray-700">
                  {getTxns24h(token)}
                </td>
                {/* 1H Price Change */}
                <td className={`p-2 sm:p-3 text-right border-b border-gray-700 ${getColorClass(token.priceChange?.h1 ?? 0)}`}>
                  {token.priceChange?.h1 !== undefined ? token.priceChange.h1.toFixed(2) : "N/A"}%
                </td>
                {/* 6H Price Change */}
                <td className={`p-2 sm:p-3 text-right border-b border-gray-700 ${getColorClass(token.priceChange?.h6 ?? 0)}`}>
                  {token.priceChange?.h6 !== undefined ? token.priceChange.h6.toFixed(2) : "N/A"}%
                </td>
                {/* 24H Price Change */}
                <td className={`p-2 sm:p-3 text-right border-b border-gray-700 ${getColorClass(token.priceChange?.h24 ?? 0)}`}>
                  {token.priceChange?.h24 !== undefined ? token.priceChange.h24.toFixed(2) : "N/A"}%
                </td>
                {/* 24H Volume */}
                <td className="p-2 sm:p-3 text-right border-b border-gray-700">
                  ${token.volume.h24.toLocaleString()}
                </td>
                {/* LIQUIDITY */}
                <td className="p-2 sm:p-3 text-right border-b border-gray-700">
                  ${token.liquidity.usd.toLocaleString()}
                </td>
                {/* MCAP */}
                <td className="p-2 sm:p-3 text-right border-b border-gray-700">
                  {token.marketCap ? `$${token.marketCap.toLocaleString()}` : "N/A"}
                </td>
                {/* FDV */}
                <td className="p-2 sm:p-3 text-right border-b border-gray-700">
                  {token.fdv ? `$${token.fdv.toLocaleString()}` : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-gray-700 text-white rounded disabled:opacity-50 text-xs sm:text-sm"
        >
          Prev
        </button>
        <span className="text-base">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-gray-700 text-white rounded disabled:opacity-50 text-xs sm:text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}




