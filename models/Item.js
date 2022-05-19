const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const itemSchema = mongoose.Schema({
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
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

itemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Item", itemSchema);
