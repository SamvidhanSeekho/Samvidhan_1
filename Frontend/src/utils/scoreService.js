import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://samvidhan-1-q8br.onrender.com/api";

const getUserIdFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized));
    return decoded?.id || null;
  } catch (error) {
    console.warn("Unable to decode auth token for userId fallback", error);
    return null;
  }
};

/**
 * Save game score to leaderboard
 * @param {string} gameName - Name of the game (e.g., "quiz", "monopoly")
 * @param {number} score - Score earned in the game
 * @returns {Promise}
 */
export const saveGameScore = async (gameName, score) => {
  try {
    let userId = localStorage.getItem("userId");

    if (!userId) {
      userId = getUserIdFromToken();
      if (userId) {
        localStorage.setItem("userId", userId);
      }
    }
    
    // If user not logged in, skip score saving
    if (!userId) {
      console.warn("User not logged in. Score not saved.");
      return null;
    }

    const response = await axios.post(`${API_BASE_URL}/leaderboard/score`, {
      userId,
      gameName,
      score: Math.round(score), // Ensure score is an integer
    });

    console.log(`✅ Score saved for ${gameName}:`, score);
    return response.data;
  } catch (error) {
    console.error("❌ Error saving score:", error);
    return null;
  }
};

/**
 * Calculate score based on moves/time for games without explicit scoring
 * @param {number} moves - Number of moves taken
 * @param {number} maxMoves - Maximum recommended moves
 * @returns {number} Calculated score
 */
export const calculateScoreFromMoves = (moves, maxMoves = 50) => {
  const baseScore = 100;
  const efficiency = Math.max(0, (maxMoves - moves) / maxMoves) * 50;
  return Math.round(baseScore + efficiency);
};

/**
 * Calculate score based on time taken
 * @param {number} timeTaken - Time in seconds
 * @param {number} maxTime - Maximum recommended time in seconds
 * @returns {number} Calculated score
 */
export const calculateScoreFromTime = (timeTaken, maxTime = 300) => {
  const baseScore = 100;
  const efficiency = Math.max(0, (maxTime - timeTaken) / maxTime) * 50;
  return Math.round(baseScore + efficiency);
};
