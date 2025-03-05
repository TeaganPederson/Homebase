"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Transaction {
  id: string;
  wallet: string;
  token: string;
  amount: number | string;
  value: number;
  type: string;
  tokenSupply: number | string;
  time: string;
}

export default function WhaleWatcherPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState("");

  // Function to fetch transactions from our API route
  async function fetchTransactions() {
    try {
      const res = await fetch("/whale-watcher/api");
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const data: Transaction[] = await res.json();
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || String(err));
    }
  }

  useEffect(() => {
    fetchTransactions(); // initial fetch

    // Poll every 10 seconds for new data
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="min-h-screen w-screen bg-black text-white m-0 p-0 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Top Banner (update as needed) */}
      <div className="w-full bg-gray-900 text-white shadow-md p-4">
        <div className="flex flex-col items-start space-y-2">
          <a
            href="/tools"
            className="text-sm underline text-white hover:text-gray-300 transition"
          >
            Back to Tools
          </a>
          <h1 className="text-2xl sm:text-3xl font-extrabold m-0">
            Whale Watcher
          </h1>
          <p className="text-sm sm:text-base opacity-90 m-0">
            Tracking major transactions on Base in real time.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full overflow-x-auto mt-0">
        {error && (
          <p className="text-red-400 text-center p-4">Error: {error}</p>
        )}
        <table className="w-full border-collapse border border-gray-700">
          <thead className="bg-gray-800 text-white">
            <tr className="border-b border-gray-700">
              {[
                "#",
                "Wallet Address",
                "Token",
                "Amount",
                "Value ($)",
                "Tx Type",
                "Supply %",
                "Time",
              ].map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs sm:text-sm uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx, index) => (
                <motion.tr
                  key={tx.id}
                  className="border-b border-gray-700 bg-gray-800 hover:bg-gray-700 transition-all"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <td className="px-4 py-3 text-xs sm:text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-xs sm:text-sm break-all">
                    {tx.wallet}
                  </td>
                  <td className="px-4 py-3 text-xs sm:text-sm font-bold">
                    {tx.token}
                  </td>
                  <td className="px-4 py-3 text-xs sm:text-sm">
                    {typeof tx.amount === "number"
                      ? tx.amount.toLocaleString()
                      : tx.amount}
                  </td>
                  <td className="px-4 py-3 text-xs sm:text-sm">
                    {tx.value.toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-3 text-xs sm:text-sm font-semibold ${
                      tx.type === "Buy"
                        ? "text-green-400"
                        : tx.type === "Sell"
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {tx.type}
                  </td>
                  <td className="px-4 py-3 text-xs sm:text-sm">
                    {typeof tx.tokenSupply === "number"
                      ? ((+tx.amount / +tx.tokenSupply) * 100).toFixed(4) + "%"
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-xs sm:text-sm text-gray-400">
                    {new Date(tx.time).toLocaleString()}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-3 text-center text-xs sm:text-sm text-gray-400"
                >
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
