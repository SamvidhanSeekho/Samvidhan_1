import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Leaderboard = ({ sidebar = false }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("alltime");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

  const wrapperClasses = sidebar
    ? "w-full h-full"
    : "w-full max-w-4xl mx-auto my-10 px-4 md:my-20 md:px-0";

  const cardClasses = sidebar
    ? "bg-secondary rounded-2xl shadow-2xl p-4 md:p-6 dark:bg-secondary opacity-90 h-full flex flex-col"
    : "bg-secondary rounded-2xl shadow-2xl p-6 md:p-8 dark:bg-secondary opacity-90";

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab]);

  const fetchLeaderboard = async (type) => {
    setLoading(true);
    try {
      const endpoint =
        type === "weekly"
          ? `${API_BASE_URL}/leaderboard/weekly`
          : `${API_BASE_URL}/leaderboard/all-time`;

      const response = await axios.get(endpoint);
      if (response.data.success) {
        setLeaderboardData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `${rank}`;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const getRankStyles = (index) => {
    if (index === 0) {
      return "bg-gradient-to-r from-yellow-100 to-transparent border-l-4 border-yellow-400";
    } else if (index === 1) {
      return "bg-gradient-to-r from-gray-100 to-transparent border-l-4 border-gray-400";
    } else if (index === 2) {
      return "bg-gradient-to-r from-orange-100 to-transparent border-l-4 border-orange-400";
    }
    return "";
  };

  return (
    <motion.div
      className={wrapperClasses}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Container with gradient background */}
      <div className={cardClasses}>
        {/* Header */}
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
            Top Players
          </h1>
          <p className="text-base md:text-lg opacity-90">
            Compete and see who's leading
          </p>
        </div>

        {/* Tabs */}
        {/* <div className="flex flex-wrap gap-3 justify-center mb-6 md:gap-4 md:mb-8">
          <button
            onClick={() => setActiveTab("weekly")}
            className={`px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === "weekly"
                ? "bg-white text-purple-600 shadow-lg"
                : "bg-transparent border-2 border-white text-white hover:bg-white hover:bg-opacity-10"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setActiveTab("alltime")}
            className={`px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === "alltime"
                ? "bg-primary text-white shadow-lg"
                : "bg-transparent border-2 border-white text-white hover:bg-white hover:bg-opacity-10"
            }`}
          >
            All Time
          </button>
        </div> */}

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-white py-12">
            <p className="text-lg">Loading leaderboard...</p>
          </div>
        ) : leaderboardData.length === 0 ? (
          <div className="text-center text-white py-12">
            <p className="text-lg">No players on the leaderboard yet</p>
          </div>
        ) : (
          /* Leaderboard Table */
          <motion.div
            className={`bg-white rounded-xl overflow-hidden shadow-lg ${
              sidebar ? "flex-1 min-h-0 flex flex-col" : ""
            }`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-primary text-white font-bold text-base uppercase tracking-wide p-6 dark:bg-primary">
              <div className="col-span-2 text-center">Rank</div>
              <div className="col-span-4">Player Name</div>
              <div className="col-span-4">Email</div>
              <div className="col-span-2 text-center">Score</div>
            </div>

            {/* Table Rows */}
            <div className={sidebar ? "overflow-y-auto" : ""}>
              {leaderboardData
                .filter((player) => {
                  const score = activeTab === "weekly" ? player.weeklyScore : player.totalScore;
                  return score > 0;
                })
                .map((player, index) => (
                <motion.div
                  key={player._id || index}
                  className={`grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 p-4 md:p-6 border-b last:border-b-0 border-gray-200 hover:bg-gray-50 transition-colors duration-200 transform hover:translate-x-1 ${getRankStyles(
                    index
                  )}`}
                  variants={rowVariants}
                >
                  {/* Rank - visible on all screens */}
                  <div className="col-span-1 md:col-span-2 text-center font-bold text-2xl md:text-base md:font-bold">
                    {getMedalIcon(index + 1)}
                  </div>

                  {/* Player Name */}
                  <div className="col-span-1 md:col-span-4 font-semibold text-gray-800 text-sm md:text-base">
                    {player.name}
                  </div>

                  {/* Email - hidden on mobile */}
                  <div className="hidden md:block col-span-4 text-gray-600 text-sm truncate">
                    {player.email}
                  </div>

                  {/* Score */}
                  <div className="col-span-1 md:col-span-2 text-right md:text-center">
                    <span className="inline-block bg-primary text-white font-bold text-sm md:text-base px-3 md:px-4 py-1 md:py-2 rounded-full">
                      {activeTab === "weekly" ? player.weeklyScore : player.totalScore}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Leaderboard;
