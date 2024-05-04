const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const protectRoute = require('./middleware/protectRoute.js');
const { Mod } = require("./Uschema.js");
const { MsgSchema } = require("./msgSchenma.js");
const { ConvoSchema } = require("./cnvoSchem.js");
const generateToken = require('./middleware/verifytocken.js');
const mongoose = require('mongoose');

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5175', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
    allowedHeaders: ['authorization', 'Content-Type'], // Allow these headers in requests
    credentials: true, // Allow credentials (e.g., cookies)
  }));

app.use(cookieParser());

const DbConnection = async () => {
    try {
        await mongoose.connect('mongodb+srv://kmugeis2005:dontforgetit@mugeishhero.ggr3iod.mongodb.net/KeepintouchUserDb?retryWrites=true&w=majority&AppName=mugeishhero');
        console.log("DB Connection Success");
    } catch (error) {
        console.log("Oops! Server Error: " + error);
    }
}
DbConnection();

const User = mongoose.model('User', Mod);
const Msge = mongoose.model('msgs', MsgSchema);
const Convo = mongoose.model('convo', ConvoSchema);

app.post('/AddUser', async (request, response) => {
    try {
        const { Username, Phone_no, Email, Password,image } = request.body;
        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = await User.create({ 'Username': Username, 'Phone_no': Phone_no, 'Email': Email, 'Password': hashedPassword,"image":image });
        response.status(200).json({
            'Msg': "Successful Addition",
            newUser
        });
    } catch (error) {
        console.error("Error:", error);
        response.status(500).json({
            "Msg": "Oops! Something Went Wrong"
        });
    }
});
app.post('/Login',async (request, response) => {
    try {
        const { Email, Password } = request.body;
        if (!Email || !Password) {
            return response.status(400).json({ message: 'Missing required fields: Email or Password' });
        }

        const user = await User.findOne({ Email });
        if (!user) {
            return response.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return response.status(401).json({ message: 'Invalid email or password' });
        }
        const token = generateToken(Email);
        response.cookie("JWT", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
        });
        return response.status(200).json({
            message: 'Login successful!',
            token, 
            user: {
                name: user.Email,
            },
        });
    } catch (err) {
        console.error(err);
        response.status(500).json({ message: 'Server error' });
    }
});

app.get("/Logout", async (request, response) => {
    try {
        response.clearCookie("JWT");
        response.status(200).json({
            Msg: "Logged out successfully!"
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            Msg: "Something went wrong"
        });
    }
});

app.post("/MsgSend/:id", protectRoute, async (request, response) => {
    try {
      const { Msg } = request.body;
      const { id } = request.params;
      const senderId = request.user._id;
      
      let conversation = await Convo.findOne({
        participants: { $all: [senderId, id] }
      });
      
      if (!conversation) {
        conversation = await Convo.create({
          participants: [senderId, id],
          Msg: [] // Ensure Msg field exists even if it's initially empty
        });
      }
      
      const newMsg = new Msge({
        senderId,
        resId: id,
        Msg: request.body.Msg
      });
      
      await newMsg.save();
      
      // Push the new message to the conversation's Msg array
      conversation.Msg.push(newMsg._id);
      await conversation.save(); // Save the updated conversation
      
      response.status(201).json({
        Msg: newMsg
      });
    } catch (error) {
      response.status(500).json({
        Msg: "Error: " + error,
      });
    }
  });
  
app.get("/recMsg/:id", protectRoute, async (request, response) => {
  try {
      const { id: chatingid } = request.params;
      const senderId = request.user._id;
      console.log(chatingid)
      console.log(senderId)
      let conversation = await Convo.findOne({
          participants: { $all: [senderId, chatingid] }
      }).populate("MsgSchema");

      if (!conversation) {
          return response.status(404).json({
              Msg: "Conversation not found",
          });
      }

      response.status(200).json({
          Msg: conversation.Msg,
      });
  } catch (error) {
      response.status(500).json({
          Msg: "Server Error",
      }); 
  }
});
app.get("/",protectRoute, async (request, response) => {
    try {
      const LoggedInUserId = request.user._id;
      const allUsersExceptLoggedIn = await User.find({ _id: { $ne: LoggedInUserId } }).select('-Password');
      response.status(200).json({
        All: allUsersExceptLoggedIn,
        Msg: "Good Job!"
      });
    } catch (error) {
      response.status(500).json({
        Msg: "Server Error"
      });
    }
  });

const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`Server listening on port ${port}`));
