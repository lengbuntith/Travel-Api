const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");

const eventSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
    },

    desc: {
        type: String,
    },

    requirement: {
        type: String,
    },
}, { timestamps: true });

// filter data(optional)
eventSchema.plugin(mongoosePagination);

module.exports = mongoose.model("Event", eventSchema);