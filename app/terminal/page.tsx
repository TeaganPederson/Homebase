// app/tools/terminal/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NewsArticle } from "../../content/articles"; // for type consistency

export default function NewsTerminal() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const res = await fetch("/api/news");
        if (!res.ok) {
          setError("Failed to fetch news");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error(err);
        setError("Error fetching news");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <motion.div
      className="min-h-screen w-full bg-black text-blue-300 font-mono p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Terminal Header */}
      <motion.div
        className="flex items-center justify-between border-b border-blue-600 pb-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="text-lg font-bold">Base Chain News Terminal</div>
        <div className="text-sm">[ user@homebase ~ ]$</div>
      </motion.div>

      {/* Terminal Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {loading && <p>Loading news...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && articles.length === 0 && (
          <p>No news available at the moment.</p>
        )}
        {!loading &&
          !error &&
          articles.map((article, index) => (
            <motion.div
              key={article.id}
              className="mb-4 p-4 border border-blue-600 rounded bg-black"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <div className="text-sm">
                <span className="text-blue-400">
                  [{new Date(article.publishedAt).toLocaleString()}]
                </span>{" "}
                {article.source} - <span className="italic">{article.author}</span>
              </div>
              <div className="text-xl font-bold mt-1">{article.title}</div>
              <div className="mt-2">{article.content.slice(0, 200)}...</div>
              <div className="mt-2">
                <a
                  href={`/news/${article.id}`}
                  className="text-blue-400 hover:underline"
                >
                  Read More →
                </a>
              </div>
            </motion.div>
          ))}
      </motion.div>

      {/* Simulated Terminal Prompt */}
      <motion.div
        className="mb-12 text-sm text-blue-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.5 }}
      >
        <p>[ user@homebase ~ ]$ _</p>
      </motion.div>
    </motion.div>
  );
}

