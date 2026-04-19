import express from "express";
import {
  getWeeklyLeaderboard,
  getAllTimeLeaderboard,
  getGameLeaderboard,
  addGameScore,
} from "../controllers/leaderboard.controller.js";

const router = express.Router();

// Get weekly leaderboard
router.get("/weekly", getWeeklyLeaderboard);

// Get all-time leaderboard
router.get("/all-time", getAllTimeLeaderboard);

// Get leaderboard for a specific game
router.get("/game/:gameName", getGameLeaderboard);

// Add or update game score
router.post("/score", addGameScore);

export default router;
