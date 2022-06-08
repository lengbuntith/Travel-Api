const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const savedSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  user_id: {
    type: String,
    required: true,
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Place",
  },
});

savedSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Saved", savedSchema);
