const mongoose = require("mongoose")
const mongoosePagination = require("mongoose-pagination-v2")

const likeSchema = mongoose.Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    like :{
        type: Number
    },

    comment: {
        type: String,
        require: true
    }
})

likeSchema.plugin(mongoosePagination)
module.exports = mongoose.model("Likes",likeSchema)