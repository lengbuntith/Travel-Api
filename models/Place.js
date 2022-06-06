const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const placeSchema = mongoose.Schema({
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
  date:{
      type: String
  },
  story: {
    type: String,
  },
  lat:{
    type:String
  },
  lng:{
      type:String
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

placeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Place", placeSchema);
