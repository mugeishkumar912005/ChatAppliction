const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Mod } = require("../Uschema.js");
const generateToken = require('./verifytocken.js');
const User = mongoose.model("User", Mod);

const protectRoute = async (request, response, next) => {
  try {
    const token = request.cookies["JWT"];
    console.log("Token121:", token);

    if (!token) {
      return response.status(401).json({ Msg: "Unauthorized: Missing JWT token" });
    }

    const decoded = JWT.verify(token, "Y+88p4NldTYqVNWLSVKODcprx0g59PackkQWqGwxow0="); // Replace with a strong random key

    if (!decoded) {
      return response.status(401).json({ Msg: "Unauthorized: Invalid JWT token" });
    }

    console.log("Decoded:", decoded.Email);

    const user = await User.findOne({ Email: decoded.Email }).select("-Password");
    if (!user) {
      return response.status(401).json({ Msg: "Unauthorized: User not found" });
    }

    request.user = user;
    next();
  } catch (error) {
    console.error("Error:", error);
    response.status(500).json({ Msg: "Internal server error" });
  }
};

module.exports = protectRoute;
