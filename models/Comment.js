const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const commentSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    userImageUrl: {
      type: String,
    },
    userFirstName: {
      type: String,
    },
    userLastName: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    message: {
      type: String,
      required: true,
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
    },
  },
  { timestamps: true }
);

commentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Comment", commentSchema);
