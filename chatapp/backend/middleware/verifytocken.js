const jwt = require('jsonwebtoken');
const { Mod } = require('../Uschema.js');
const Mo = require('mongoose');
const User = Mo.model('User', Mod);

const verifyToken = (request, response, next) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.status(403).json({ Msg: "Token Not Found" });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, "secretKey", async (error, verifiedToken) => {
        if (error) {
            return response.status(401).json({ Msg: "Invalid Token" });
        }
        try {
            const user = await User.findOne({ "_id": verifiedToken.id }); // Adjusted to use 'id'
            if (!user) {
                return response.status(404).json({ Msg: "User not found" });
            }
            request.user = user;
            next();
        } catch (error) {
            console.error("Error:", error);
            return response.status(500).json({ Msg: "Server Error" });
        }
    });
};

module.exports = { verifyToken };
