const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");

const commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    suggestion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Suggestion",
    },
    comment: {
        type: String,
    },
}, {
    timestamps: true,
});

commentSchema.plugin(mongoosePagination);
module.exports = mongoose.model("CommentSuggest", commentSchema);