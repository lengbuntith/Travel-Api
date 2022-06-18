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

        commentsuggests: [
            { type: mongoose.Schema.Types.ObjectId, ref: "CommentSuggest" },
        ],
        totalComment: {
            type: Number,
            default: 0,
        },
        likesuggests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
        totalLike: {
            type: Number,
            default: 0,
        },
    },

    //to filter latest oldest
    { timestamps: true }
);

suggestionSchema.plugin(mongoosePagination);
module.exports = mongoose.model("Suggestion", suggestionSchema);