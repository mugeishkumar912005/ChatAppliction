const M = require('mongoose');
const B = require('body-parser');
const Ex = require('express');
const C = require('cors');
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt'); 
const { Mod } = require('./Uschema.js');
const {verifyToken}=require("./middleware/verifytocken.js")
const User = M.model('User', Mod);
const App = Ex();

App.use(B.json());
App.use(C());

const DbConnection = async (e) => {
    try {
        await M.connect('mongodb+srv://kmugeis2005:dontforgetit@mugeishhero.ggr3iod.mongodb.net/KeepintouchUserDb?retryWrites=true&w=majority&appName=mugeishhero');
        console.log("DB Connection Success");
    } catch (error) {
        console.log("Opps!Server Error:" + error);
    }
}

DbConnection();

App.post('/AddUser', async (request, response) => {
    try {
        const { Username, Phone_no, Email, Password } = request.body;
        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = await User.create({ 'Username': Username, 'Phone_no': Phone_no, 'Email': Email, 'Password': hashedPassword });
        response.status(200).json({
            'Msg': "Successful Addition",
            newUser
        });
    } catch (error) {
        console.error("Error:", error);
        response.status(404).json({
            "Msg": "Oops! Something Went Wrong"
        });
    }
});
App.post('/Login', verifyToken ,async (request, response) => {
    try {
        const {Email, Password } = request.body;
        const exUser = await User.findOne({ "Email": Email });
        if (!exUser) {
            return response.status(401).json({ "error": "User not found. Please sign up." });
        }
        const isPasswordMatch = await bcrypt.compare(Password, exUser.Password);
        if (!isPasswordMatch) {
            return response.status(401).json({ "error": "Invalid password." });
        }
        let Token = jwt.sign({ id: exUser._id }, "secretKey");
        response.status(200).json({
            "msg": "Login successful",
            data: exUser,
            Token: Token
        });
    } catch (error) {
        console.error("Error:", error);
        response.status(500).json({ "error": "Internal server error" });
    }
});

const PORT = process.env.PORT || 5500;
App.listen(PORT, () => {
    console.log(`Server Connected in ${PORT}`);
});
