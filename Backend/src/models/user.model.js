import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gameScores: [
      {
        gameName: {
          type: String,
          enum: ["monopoly", "trainBalloon", "scenarioMode", "quiz", "wordSearch", "puzzle"],
        },
        score: {
          type: Number,
          default: 0,
        },
        playedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);