import React from "react";
import { motion } from "framer-motion";
import { MdArrowOutward } from "react-icons/md";
import imagegame1 from "../../assets/game1.png";
import imagegame2 from "../../assets/game2.jpg";
import imagegame3 from "../../assets/game3.jpeg";
import imagegame4 from "../../assets/game4.png";
import train from "../../assets/train.png"
import rights from "../../assets/rights.png"
import monopoly from "../../assets/monopoly.png"
import Leaderboard from "../Leaderboard/Leaderboard";

const GamesPage = () => {
  const games = [
    {
      title: "Civic Monopoly",
      description: "Learn about rights and duties",
      image: monopoly,
      link: "/games/monopoly",
    },
    {
      title: "Cargo Express",
      description: "Pop balloons, drop crates, and fuel the train of democracy.",
      link: "/games/trainBalloon",
      image: train,
    },
    {
      title: "Scenario Mode",
      description: "Protect fundamental rights",
      link: "/games/scenarioMode",
      image: rights,
    },
    {
      title: "Quiz",
      description: "put your knowledge to the test with our interactive quiz on the Indian Constitution.",
      image: imagegame2,
      link: "/quiz",
    },
    {
      title: "Word Search",
      description: "Find hidden words related to the Indian Constitution in this engaging word search game.",
      image: imagegame3,
      link: "/games/word-search",
    },
    {
      title: "Puzzle",
      description: "Solve puzzles and learn about the Indian Constitution in a fun and interactive way.",
      image: imagegame4,
      link: "/games/puzzle",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-200 via-yellow-200 to-yellow-300 lg:h-screen lg:overflow-hidden">
      {/* Animated Circular Background Patterns */}
      <div className="absolute top-0 left-0 z-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute w-40 h-40 bg-orange-200 rounded-full top-10 left-10 animate-pulse-slow"></div>
        <div className="absolute w-64 h-64 bg-orange-200 rounded-full top-1/3 right-20 animate-ping-slow"></div>
        <div className="absolute w-48 h-48 bg-orange-100 rounded-full bottom-20 left-1/4 animate-bounce-slow"></div>
        <div className="absolute w-32 h-32 rounded-full bottom-10 right-10 bg-orange-50 animate-pulse-fast"></div>
      </div>

      <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_430px] lg:gap-8 lg:px-6 lg:py-8">
        <section className="rounded-2xl bg-white/25 p-4 backdrop-blur-sm lg:h-full lg:overflow-y-auto lg:pr-2">
          <h1 className="mb-8 text-3xl font-bold text-center text-yellow-900 animate-fade-in md:text-4xl lg:text-left">
            Games
          </h1>

          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {games.map((game, index) => (
              <motion.div
                key={index}
                className="overflow-hidden transition-transform duration-300 ease-in-out transform bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-xl animate-slide-up"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={game.image}
                  alt={game.title}
                  className="object-cover w-full h-48 transition-all duration-500 transform rounded-t-lg hover:rotate-3"
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-900">{game.title}</h2>
                  <p className="mt-2 text-sm text-gray-600">{game.description}</p>
                  <div className="flex justify-between mt-4">
                    <a
                      href={game.link}
                      className="primary-btn !mt-8 inline-flex items-center gap-4 group text-lg font-semibold"
                    >
                      Play Now
                      <MdArrowOutward className="duration-200 group-hover:animate-bounce group-hover:text-lg" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <aside className="lg:h-full">
          <Leaderboard sidebar />
        </aside>
      </div>
    </div>
  );
};

export default GamesPage;
