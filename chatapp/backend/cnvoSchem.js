const mongoose = require('mongoose');
const { MsgSchema } = require('./msgSchenma');
const { Schema } = mongoose;
const convoSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    messages: [MsgSchema]
}, { timestamps: true });

module.exports = {convoSchema};