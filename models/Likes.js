const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");

const likeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    suggestion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Suggestion",
    },
    like: {
        type: Boolean,
    },
}, {
    timestamps: true,
});

likeSchema.plugin(mongoosePagination);
module.exports = mongoose.model("Like", likeSchema);