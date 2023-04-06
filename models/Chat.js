const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})


module.exports = mongoose.model("Chat", chatSchema);
