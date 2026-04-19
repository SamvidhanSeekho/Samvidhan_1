import { User } from "../models/user.model.js";

// Get weekly leaderboard (top 10 players of the week)
export const getWeeklyLeaderboard = async (req, res) => {
  try {
    // Calculate date for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Aggregate scores from the past week
    const leaderboard = await User.aggregate([
      {
        $project: {
          name: 1,
          email: 1,
          weeklyScore: {
            $sum: {
              $cond: [
                { $gte: ["$gameScores.playedAt", sevenDaysAgo] },
                "$gameScores.score",
                0,
              ],
            },
          },
          totalScore: 1,
        },
      },
      {
        $match: {
          weeklyScore: { $gt: 0 },
        },
      },
      {
        $sort: { weeklyScore: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,
      data: leaderboard,
      message: "Weekly leaderboard fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all-time leaderboard (top 10 players)
export const getAllTimeLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find()
      .select("name email totalScore")
      .sort({ totalScore: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: leaderboard,
      message: "All-time leaderboard fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get leaderboard for a specific game
export const getGameLeaderboard = async (req, res) => {
  try {
    const { gameName } = req.params;

    const leaderboard = await User.aggregate([
      {
        $unwind: "$gameScores",
      },
      {
        $match: {
          "gameScores.gameName": gameName,
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          highScore: { $max: "$gameScores.score" },
          totalGamesPlayed: { $sum: 1 },
        },
      },
      {
        $sort: { highScore: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,
      data: leaderboard,
      message: `Leaderboard for ${gameName} fetched successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add or update game score for a user
export const addGameScore = async (req, res) => {
  try {
    const { userId, gameName, score } = req.body;

    if (!userId || !gameName || score === undefined) {
      return res.status(400).json({
        success: false,
        message: "userId, gameName, and score are required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          gameScores: {
            gameName,
            score,
            playedAt: new Date(),
          },
        },
        $inc: { totalScore: score },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(201).json({
      success: true,
      data: user,
      message: "Game score added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
