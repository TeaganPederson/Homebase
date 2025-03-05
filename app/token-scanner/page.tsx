"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CandlestickChart } from "../../../components/CandlestickChart";

// Helper for color-coding positive/negative changes
function getColorClass(value: number) {
  return value >= 0 ? "text-green-500" : "text-red-500";
}

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

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
  volume: { h24: number };
  liquidity: { usd: number };
  marketCap?: number;
  fdv?: number;
  pairCreatedAt?: number;
  trendingScore?: number;
  info?: {
    imageUrl?: string;
  };
  candles?: Candle[]; // Candlestick data from CoinGecko
};

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

function getAge(createdAt?: number): string {
  if (!createdAt) return "N/A";
  const diffMs = Date.now() - createdAt;
  const days = diffMs / (1000 * 60 * 60 * 24);
  return days < 1 ? `${Math.floor(days * 24)}h` : `${Math.floor(days)}d`;
}

function getTxns24h(token: DexToken): number {
  if (!token.txns || !token.txns.h24) return 0;
  const { buys, sells } = token.txns.h24;
  return buys + sells;
}

function FlameIcon() {
  return (
    <motion.span
      animate={{
        scale: [1, 1.3, 1],
        rotate: [0, 3, -3, 0],
        y: [0, -1, 0],
      }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      className="inline-flex items-center justify-center text-lg sm:text-xl ml-2"
    >
      🔥
    </motion.span>
  );
}

export default function TokenScanner() {
  const [tokens, setTokens] = useState<DexToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;
  const [toast, setToast] = useState("");

  // Sorting filter state: "trending", "1h", "6h", "24h"
  const [sortFilter, setSortFilter] = useState("trending");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address).then(() => {
      setToast("Copied to clipboard");
      setTimeout(() => setToast(""), 2000);
    });
  };

  useEffect(() => {
    async function fetchTokens() {
      setLoading(true);
      try {
        const tokenAddresses =
          "0x3c8cd0db9a01efa063a7760267b822a129bc7dca," +
          "0x1bc0c42215582d5a085795f4badbac3ff36d1bcb," +
          "0x9704d2adbc02c085ff526a37ac64872027ac8a50," +
          "0xbc45647ea894030a4e9801ec03479739fa2485f0," +
          "0x1185cb5122edad199bdbc0cbd7a0457e448f23c7," +
          "0xb33ff54b9f7242ef1593d2c9bcd8f9df46c77935," +
          "0x20dd04c17afd5c9a8b3f2cdacaa8ee7907385bef," +
          "0x2676e4e0e2eb58d9bdb5078358ff8a3a964cedf5," +
          "0x6921B130D297cc43754afba22e5EAc0FBf8Db75b," +
          "0x79dacb99A8698052a9898E81Fdf883c29efb93cb," +
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
          "0x6797B6244fA75F2e78cDFfC3a4eb169332b730cc," +
          "0x1f1c695f6b4a3f8b05f2492cef9474afb6d6ad69," +
          "0xeb476e9ab6b1655860b3f40100678d0c1cedb321," +
          "0xf878e27afb649744eec3c5c0d03bc9335703cfe3," +
          "0x57edc3f1fd42c0d48230e964b1c5184b9c89b2ed," +
          "0x52b492a33e447cdb854c7fc19f1e57e8bfa1777d," +
          "0x5b5dee44552546ecea05edea01dcd7be7aa6144a," +
          "0x20d704099b62ada091028bcfc44445041ed16f09," +
          "0x55cd6469f597452b5a7536e2cd98fde4c1247ee4," +
          "0x0d97f261b1e88845184f678e2d1e7a98d9fd38de," +
          "0xba0dda8762c24da9487f5fa026a9b64b695a07ea," +
          "0x2f6c17fa9f9bc3600346ab4e48c0701e1d5962ae," +
          "0x62d0b7ea8aa059f0154692435050cecedf8d3e99," +
          "0x0578d8a44db98b23bf096a382e016e29a5ce0ffe," +
          "0xf5bc3439f53a45607ccad667abc7daf5a583633f," +
          "0xb8d98a102b0079b69ffbc760c8d857a31653e56e," +
          "0x18b6f6049A0af4Ed2BBe0090319174EeeF89f53a," +
          "0x6dba065721435cfCa05CAa508f3316B637861373," +
          "0x22aF33FE49fD1Fa80c7149773dDe5890D3c76F3b," +
          "0x1B23819885FcE964A8B39D364b7462D6E597ae8e," +
          "0xc655C331d1Aa7f96c252F1f40CE13D80eAc53504," +
          "0x10f434B3d1cC13A4A79B062Dcc25706f64D10D47," +
          "0xa1832f7F4e534aE557f9B5AB76dE54B1873e498B," +
          "0x02D4f76656C2B4f58430e91f8ac74896c9281Cb9," +
          "0x2D57C47BC5D2432FEEEdf2c9150162A9862D3cCf," +
          "0x3054E8F8fBA3055a42e5F5228A2A4e2AB1326933," +
          "0x62Ff28a01AbD2484aDb18C61f78f30Fb2E4A6fDb," +
          "0xFbB75A59193A3525a8825BeBe7D4b56899E2f7e1," +
          "0xbDF317F9C153246C429F23f4093087164B145390," +
          "0x6d3B8C76c5396642960243Febf736C6BE8b60562," +
          "0x1b6A569DD61EdCe3C383f6D565e2f79Ec3a12980," +
          "0xd07379a755A8f11B57610154861D694b2A0f615a," +
          "0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9," +
          "0x3849cC93e7B71b37885237cd91a215974135cD8D," +
          "0x08c81699F9a357a9F0d04A09b353576ca328d60D," +
          "0xebfF2db643Cf955247339c8c6bCD8406308ca437," +
          "0xFad8CB754230dbFd249Db0E8ECCb5142DD675a0d," +
          "0x6e2c81b6c2C0e02360F00a0dA694e489acB0b05e," +
          "0x18A8BD1fe17A1BB9FFB39eCD83E9489cfD17a022," +
          "0xcDE90558fc317C69580DeeAF3eFC509428Df9080," +
          "0x15aC90165f8B45A80534228BdCB124A011F62Fee," +
          "0x749e5334752466CdA899B302ed4176B8573dC877";

        const tokenList = tokenAddresses.split(",");
        const tokenChunks = [];
        for (let i = 0; i < tokenList.length; i += 30) {
          tokenChunks.push(tokenList.slice(i, i + 30));
        }

        let allResults: DexToken[] = [];
        for (const chunk of tokenChunks) {
          const res = await fetch(`/api/tokens?chainId=base&tokenAddresses=${chunk.join(",")}`);
          if (!res.ok) continue;
          const data = await res.json();
          allResults = [...allResults, ...data];
        }

        if (Array.isArray(allResults) && allResults.length > 0) {
          const tokensWithTrending = allResults.map((token) => ({
            ...token,
            trendingScore: computeTrending(token),
          }));
          const sorted = tokensWithTrending.sort(
            (a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0)
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
      return [...tokens].sort(
        (a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0)
      );
    }
    let key: "h1" | "h6" | "h24" = "h1";
    if (sortFilter === "6h") key = "h6";
    else if (sortFilter === "24h") key = "h24";
    return [...tokens].sort((a, b) => {
      const aVal = a.priceChange?.[key] ?? 0;
      const bVal = b.priceChange?.[key] ?? 0;
      return sortDirection === "desc" ? bVal - aVal : aVal - bVal;
    });
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
    <div className="min-h-screen bg-black text-white relative">
      {toast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white py-2 px-4 rounded shadow">
          {toast}
        </div>
      )}

      <div className="sticky top-0 z-50 bg-[#0060FF] shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-2">
          <Link href="/" className="flex items-center text-white text-xs sm:text-base">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Home</span>
          </Link>
          <div className="text-center">
            <h1 className="text-sm sm:text-xl font-bold text-white">Token Screener</h1>
            <p className="text-[10px] sm:text-xs text-white opacity-90">
              Discover top tokens on Base in real time.
            </p>
          </div>
          <Link href="/submit-token" className="flex items-center text-white text-xs sm:text-base">
            <span>Add Listing</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm w-full">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="p-2 sm:p-3 text-left cursor-pointer" onClick={() => handleFilterChange("trending")}>
                # {sortFilter === "trending" && (sortDirection === "desc" ? " ↓" : " ↑")}
              </th>
              <th className="p-2 sm:p-3 text-left">POOL</th>
              <th className="p-2 sm:p-3 text-right">PRICE</th>
              <th className="p-2 sm:p-3 text-right">CHART</th>
              <th className="p-2 sm:p-3 text-right">AGE</th>
              <th className="p-2 sm:p-3 text-right">TXN</th>
              <th className="p-2 sm:p-3 text-right cursor-pointer" onClick={() => handleFilterChange("1h")}>
                1H {sortFilter === "1h" && (sortDirection === "desc" ? " ↓" : " ↑")}
              </th>
              <th className="p-2 sm:p-3 text-right cursor-pointer" onClick={() => handleFilterChange("6h")}>
                6H {sortFilter === "6h" && (sortDirection === "desc" ? " ↓" : " ↑")}
              </th>
              <th className="p-2 sm:p-3 text-right cursor-pointer" onClick={() => handleFilterChange("24h")}>
                24H {sortFilter === "24h" && (sortDirection === "desc" ? " ↓" : " ↑")}
              </th>
              <th className="p-2 sm:p-3 text-right">VOLUME</th>
              <th className="p-2 sm:p-3 text-right">LIQUIDITY</th>
              <th className="p-2 sm:p-3 text-right">MCAP</th>
              <th className="p-2 sm:p-3 text-right">FDV</th>
            </tr>
          </thead>
          <tbody>
            {currentTokens.map((token, index) => {
              const rank = index + 1 + (currentPage - 1) * pageSize;
              const isTop3 = sortFilter === "trending" && rank <= 3;
              return (
                <tr key={token.pairAddress} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                  <td className="p-2 sm:p-3 text-left w-24">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 font-bold">
                        {rank}
                      </span>
                      {isTop3 && <FlameIcon />}
                    </div>
                  </td>
                  {/* Wrap the POOL cell with a Link to the token detail page */}
                  <td className="p-2 sm:p-3">
                    <Link href={`/tools/trading-research/token-scanner/${token.pairAddress}`}>
                      <div className="flex items-center space-x-2 cursor-pointer">
                        <img src={token.info?.imageUrl || "/fallback.png"} alt={token.baseToken.symbol} className="w-5 h-5 rounded-full" />
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {token.baseToken.name} / {token.quoteToken.symbol}
                          </span>
                          <span className="text-xs text-gray-400">
                            {token.baseToken.symbol}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="p-2 sm:p-3 text-right">${Number(token.priceUsd).toFixed(5)}</td>
                  <td className="p-2 sm:p-3 text-right">
                    {token.candles && token.candles.length > 0 ? "Chart" : "N/A"}
                  </td>
                  <td className="p-2 sm:p-3 text-right">{getAge(token.pairCreatedAt)}</td>
                  <td className="p-2 sm:p-3 text-right">{getTxns24h(token)}</td>
                  <td className={`p-2 sm:p-3 text-right ${getColorClass(token.priceChange?.h1 ?? 0)}`}>
                    {token.priceChange?.h1 !== undefined ? token.priceChange.h1.toFixed(2) : "N/A"}%
                  </td>
                  <td className={`p-2 sm:p-3 text-right ${getColorClass(token.priceChange?.h6 ?? 0)}`}>
                    {token.priceChange?.h6 !== undefined ? token.priceChange.h6.toFixed(2) : "N/A"}%
                  </td>
                  <td className={`p-2 sm:p-3 text-right ${getColorClass(token.priceChange?.h24 ?? 0)}`}>
                    {token.priceChange?.h24 !== undefined ? token.priceChange.h24.toFixed(2) : "N/A"}%
                  </td>
                  <td className="p-2 sm:p-3 text-right">${token.volume.h24.toLocaleString()}</td>
                  <td className="p-2 sm:p-3 text-right">${token.liquidity.usd.toLocaleString()}</td>
                  <td className="p-2 sm:p-3 text-right">
                    {token.marketCap ? `$${token.marketCap.toLocaleString()}` : "N/A"}
                  </td>
                  <td className="p-2 sm:p-3 text-right">
                    {token.fdv ? `$${token.fdv.toLocaleString()}` : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center py-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#0060FF] hover:bg-[#0050D0] text-white rounded-md transition transform hover:scale-105 disabled:opacity-50 text-xs sm:text-sm"
        >
          &larr; Prev
        </button>
        <span className="mx-4 text-white text-xs sm:text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[#0060FF] hover:bg-[#0050D0] text-white rounded-md transition transform hover:scale-105 disabled:opacity-50 text-xs sm:text-sm"
        >
          Next &rarr;
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 -z-10">
        <svg className="w-full h-32 md:h-48" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#000000" d="M0,64 C360,160 1080,0 1440,64 L1440,320 L0,320 Z" />
        </svg>
      </div>
    </div>
  );
}

