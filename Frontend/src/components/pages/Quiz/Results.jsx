// Quiz/Results.jsx

import React, { useEffect } from "react";
import { saveGameScore } from "../../../utils/scoreService";

const Results = ({ score, total, userProfile }) => {
  useEffect(() => {
    // Calculate percentage score and save to leaderboard
    const percentageScore = Math.round((score / total) * 100);
    saveGameScore("quiz", percentageScore);
  }, [score, total]);

  return (
    <div className="w-full max-w-2xl p-6 mx-auto space-y-6 text-center bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-yellow-500">Quiz Results</h2>
      <p className="text-2xl text-gray-700">
        Your Score: <span className="font-bold">{score}</span> / {total}
      </p>
      <p className="text-lg text-gray-500">
        Great job, {userProfile?.name || "Participant"}! Your score has been
        recorded.
      </p>
      <div className="flex flex-row justify-around">
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 text-white transition bg-yellow-500 rounded-lg hover:bg-yellow-600"
      >
        Retry Quiz
      </button>
      <button
        onClick={() => window.history.back()}
        className="px-6 py-3 text-white transition bg-yellow-500 rounded-lg hover:bg-yellow-600"
      >
        Go Back 
      </button>
      </div>
    </div>
  );
};

export default Results;
