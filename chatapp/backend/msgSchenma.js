const mongoose = require("mongoose");
const { Schema } = mongoose;
const MsgSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    Msg: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = {MsgSchema};
