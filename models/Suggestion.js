const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");

const suggestionSchema = mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Place",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  message: {
    type: String,
    require: false,
  },

  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Likes",
  }
},

//to filter latest oldest 
{ timestamps : true}
);

suggestionSchema.plugin(mongoosePagination);
module.exports = mongoose.model("Suggestion", suggestionSchema);
