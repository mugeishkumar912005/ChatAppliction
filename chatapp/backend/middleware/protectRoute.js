const JWT = require("jsonwebtoken");
const M = require('mongoose');
const { Mod } = require("../Uschema.js");
const User = M.model('User', Mod);

const protectRoute = async (request, response, next) => {
    try {
        const token = request.cookies.JWT;
        if (!token) {
            return response.status(401).json({
                Msg: "Unauthorized: Missing JWT token",
            });
        }
        const decoded = JWT.verify(token, "Y+88p4NldTYqVNWLSVKODcprx0g59PackkQWqGwxow0=");
        console.log(token)
        if (!decoded) {
            return response.status(401).json({
                Msg: "Unauthorized: Invalid JWT token"
            });
        }
        console.log("Decoded:", decoded);
        let userEmail = decoded.Email; 
        const user = await User.findOne({ Email: userEmail }).select('-Password');
        if (!user) {
            return response.status(401).json({
                Msg: "Unauthorized: User not found"
            });
        }
        request.user = user;
        next();
    } catch (error) {
        console.error("Error:", error); 
        response.status(500).json({
            Msg: "Internal server error"
        });
    }
};

module.exports = protectRoute;
