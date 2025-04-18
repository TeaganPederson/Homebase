"use client";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import TerminalSidebar from "./Components/TerminalSidebar";
import ConnectWalletButton from "./Components/ConnectWalletButton";

export default function TradingCompetitionLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative bg-black text-white font-mono min-h-screen w-full overflow-x-hidden">
      {/* ===================== DESKTOP LAYOUT ===================== */}
      <div className="hidden md:flex min-h-screen">
        <TerminalSidebar />
        <main className="flex-1 p-4 relative">
          <div className="hidden md:block absolute top-4 right-4">
            <ConnectWalletButton />
          </div>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#333",
                color: "#eee",
              },
            }}
          />
        </main>
      </div>

      {/* ===================== MOBILE LAYOUT ===================== */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={() => setIsSidebarOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
          <ConnectWalletButton />
        </div>
        <main className="p-4 relative">
          {children}
        </main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#eee",
            },
          }}
        />
      </div>

      {/* ===================== MOBILE SIDEBAR (slide-out) ===================== */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 bg-black w-64 p-4 shadow-lg overflow-y-auto">
            <button
              className="absolute top-4 right-4"
              onClick={() => setIsSidebarOpen(false)}
            >
              X
            </button>
            <TerminalSidebar />
          </div>
        </div>
      )}
    </div>
  );
}