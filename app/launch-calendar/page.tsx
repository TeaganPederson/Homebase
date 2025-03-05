"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

// Base Chain Logo (unused in this snippet)
const BASE_CHAIN_LOGO = "https://avatars.githubusercontent.com/u/108554348?s=280&v=4";

// Mock Launch Data
const launchData = [
  {
    day: "MON",
    date: "17",
    launches: { launchingSoon: [{}, {}], launched: [{}, {}] },
  },
  {
    day: "TUE",
    date: "18",
    launches: { launchingSoon: [{}, {}], launched: [{}, {}] },
  },
  {
    day: "WED",
    date: "19",
    launches: { launchingSoon: [{}, {}], launched: [{}, {}] },
  },
  {
    day: "THU",
    date: "20",
    launches: { launchingSoon: [{}, {}], launched: [{}, {}] },
  },
  {
    day: "FRI",
    date: "21",
    launches: { launchingSoon: [{}, {}], launched: [{}, {}] },
  },
  {
    day: "SAT",
    date: "22",
    launches: {
      launchingSoon: [
        {
          name: "Homebase",
          ticker: "HOME",
          logo: "https://i.imgur.com/7L1Xsfa.png",
          launchType: "Fair Launch",
          votes: { moon: 75, rug: 10 },
        },
      ],
      launched: [{}, {}],
    },
  },
  {
    day: "SUN",
    date: "23",
    launches: { launchingSoon: [{}, {}], launched: [{}, {}] },
  },
];

function requestNotificationPermission() {
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

export default function LaunchCalendar() {
  const [selectedLaunch, setSelectedLaunch] = useState<any>(null);
  const totalLaunches = launchData.reduce(
    (acc, day) =>
      acc + day.launches.launchingSoon.length + day.launches.launched.length,
    0
  );

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-grow container mx-auto px-4 py-8 mb-4"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {launchData.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="bg-white p-3 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all h-80 flex flex-col"
              >
                {/* Day & Date */}
                <div>
                  <h2 className="text-xl font-bold text-[#0052FF] text-center">{day.day}</h2>
                  <p className="text-gray-600 text-center">{day.date}</p>
                </div>
                {/* Content Container */}
                <div className="flex-grow mt-2 flex flex-col justify-evenly space-y-2">
                  {/* Launching Soon (Grey Box) */}
                  <div className="bg-gray-200 p-2 rounded-md">
                    <h3 className="text-xs font-semibold text-gray-700 text-center mb-1">
                      Launching Soon
                    </h3>
                    <div className="grid grid-cols-2 gap-1">
                      {day.launches.launchingSoon.map((launch, idx) => (
                        <motion.div
                          key={idx}
                          className="flex flex-col items-center bg-white p-1 rounded-md shadow-sm hover:bg-gray-100 transition-all h-16 justify-center cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setSelectedLaunch(launch)}
                        >
                          {launch.logo && (
                            <img src={launch.logo} alt={launch.name} className="w-8 h-8" />
                          )}
                          {launch.name && (
                            <p className="text-[10px] font-semibold">{launch.name}</p>
                          )}
                          {launch.ticker && (
                            <p className="text-[9px] text-gray-500">{launch.ticker}</p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  {/* Launched (Coinbase Blue Box) */}
                  <div className="bg-[#0052FF] p-2 rounded-md">
                    <h3 className="text-xs font-semibold text-white text-center mb-1">Launched</h3>
                    <div className="grid grid-cols-2 gap-1">
                      {day.launches.launched.map((launch, idx) => (
                        <div key={idx} className="flex flex-col items-center bg-white p-1 rounded-md shadow-sm hover:bg-gray-100 transition-all h-16 justify-center">
                          {launch.logo && (
                            <img src={launch.logo} alt={launch.name} className="w-8 h-8" />
                          )}
                          {launch.name && (
                            <p className="text-[10px] font-semibold">{launch.name}</p>
                          )}
                          {launch.ticker && (
                            <p className="text-[9px] text-gray-500">{launch.ticker}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.main>

      {/* Subscription Banner as a Container */}
      <div className="container mx-auto px-4 py-2 bg-white border border-gray-200 rounded-lg shadow mb-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#0052FF] mb-1">Sign Up for Launch Alerts</h2>
          <p className="text-[#0052FF] text-sm mb-2">Stay updated on upcoming token launches.</p>
          <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
            Subscribe
          </button>
        </div>
      </div>

      {/* Modal for Selected Launch */}
      {selectedLaunch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
            <button onClick={() => setSelectedLaunch(null)} className="absolute top-2 right-2 text-gray-600 text-lg">
              &times;
            </button>
            <h3 className="text-xl font-bold">{selectedLaunch.name} ({selectedLaunch.ticker})</h3>
            <img src={selectedLaunch.logo} alt={selectedLaunch.name} className="w-16 h-16 mx-auto my-2" />
            <p className="text-sm text-gray-600">Launch Type: {selectedLaunch.launchType}</p>
            <div className="flex justify-between my-3">
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
                🚀 Moon ({selectedLaunch.votes.moon})
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                💩 Rug ({selectedLaunch.votes.rug})
              </button>
            </div>
            <button onClick={requestNotificationPermission} className="w-full bg-blue-600 text-white py-2 rounded-lg">
              🔔 Enable Launch Alerts
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}










