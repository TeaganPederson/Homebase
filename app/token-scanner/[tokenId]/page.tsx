"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CandlestickChart } from "../../../../components/CandlestickChart";

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type DexTokenDetail = {
  pairAddress: string;
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceUsd: string;
  candles?: Candle[];
  // Additional detailed fields if needed
};

export default function TokenDetailPage() {
  const { tokenId } = useParams() as { tokenId: string };
  const [token, setToken] = useState<DexTokenDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTokenDetail() {
      try {
        // Using the CoinGecko API endpoint for OHLC data.
        const endpoint = `${process.env.NEXT_PUBLIC_COINGECKO_API_URL}/coins/${tokenId}/ohlc?vs_currency=usd&days=1`;
        const res = await fetch(endpoint);
        if (res.ok) {
          const ohlcData = await res.json();
          // Convert the OHLC array into an array of Candle objects.
          // CoinGecko returns data in the form: [timestamp, open, high, low, close]
          const candles: Candle[] = ohlcData.map((d: any) => ({
            time: d[0],
            open: d[1],
            high: d[2],
            low: d[3],
            close: d[4],
          }));

          // Here, you could combine other token details if needed.
          setToken({
            pairAddress: tokenId,
            baseToken: { address: tokenId, name: tokenId, symbol: tokenId },
            quoteToken: { address: "", name: "", symbol: "" },
            priceUsd: "0", // You might fetch additional data from another endpoint.
            candles,
          });
        } else {
          console.error("Failed to fetch token detail:", res.statusText);
        }
      } catch (error) {
        console.error("Error fetching token detail:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTokenDetail();
  }, [tokenId]);

  if (loading) return <div className="p-4 text-white">Loading...</div>;
  if (!token) return <div className="p-4 text-white">Token not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <Link href="/tools/trading-research/token-scanner" className="text-blue-400 mb-4 inline-block">
        &larr; Back to Token Scanner
      </Link>
      <h1 className="text-2xl font-bold mb-2">
        {token.baseToken.name} / {token.quoteToken.symbol}
      </h1>
      <p className="mb-4">Price: ${Number(token.priceUsd).toFixed(5)}</p>
      {token.candles && token.candles.length > 0 ? (
        <CandlestickChart data={token.candles} width={400} height={300} />
      ) : (
        <p>No candlestick data available.</p>
      )}
      {/* Render additional token details as needed */}
    </div>
  );
}


