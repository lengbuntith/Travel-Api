const mongoose = require("mongoose");

const citySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    thumbnail: {
        type: [String],
    },
    image: {
        type: String,
    },
    lat: {
        type: String,
    },
    lng: {
        type: String,
    },
});

module.exports = mongoose.model("City", citySchema);