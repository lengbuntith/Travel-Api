const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const trendingSchema = mongoose.Schema({
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
    },
    describe: {
        type: String,
    },
    top: {
        type: Number,
    },
});

trendingSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("TrendingProvince", trendingSchema);