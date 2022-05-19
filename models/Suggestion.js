const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const suggestionSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  images: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
  },
  rating: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
});

suggestionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Suggestion", suggestionSchema);
