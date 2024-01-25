const mongoose = require("mongoose");

const movieSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    ratings: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const MovieModel = mongoose.model("movie", movieSchema);

module.exports = { MovieModel };
