const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const savedSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    saved: {
        type: Boolean,
        default: false,
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
        required: true,
    },
}, {
    timestamps: true,
});

savedSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Saved", savedSchema);