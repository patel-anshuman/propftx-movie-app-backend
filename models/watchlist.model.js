const mongoose = require("mongoose");

const watchlistSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
    watchedAt: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
  }
);

const WatchlistModel = mongoose.model("watchlist", watchlistSchema);

module.exports = { WatchlistModel };
