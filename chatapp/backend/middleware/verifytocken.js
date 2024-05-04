const JWT = require("jsonwebtoken");

const generateToken = (Email) => {
    console.log("Email:", Email);
    const token = JWT.sign({ Email }, "Y+88p4NldTYqVNWLSVKODcprx0g59PackkQWqGwxow0=", {
        expiresIn: '1d',
    });
    console.log("Generated Token:", token); // Add this line to log the generated token
    return token;
}

module.exports = generateToken;
