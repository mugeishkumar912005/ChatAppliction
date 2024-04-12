const M = require('mongoose');

const Mod = new M.Schema({
    Username: {
        type: String,
        required: true
    },
    Phone_no: {
        type: Number,
        unique: true,
        required: true
    },
    Email: {
        type: String,
        unique: true,
        required: true
    },
    Password: {
        type: String,
        required: true,
    }
});
module.exports = { Mod };
