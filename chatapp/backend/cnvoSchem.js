const M = require('mongoose');

const ConvoSchema = new M.Schema({
    Participants: [{
        type: M.Schema.Types.ObjectId,
        ref: "User"
    }],
    Msg: [{
        type: M.Schema.Types.ObjectId,
        ref: "MsgSchema",
        default: []
    }]
}, { timestamps: true });

module.exports = { ConvoSchema };
