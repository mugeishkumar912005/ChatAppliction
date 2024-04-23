const mongoose = require("mongoose");

const MsgSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    resId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    Msg: {
        type: String,
        required: true
    }
}, { timestamps: true });
module.exports = {MsgSchema};
