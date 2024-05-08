const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const protectRoute = require('./middleware/protectRoute.js');
const { Mod } = require("./Uschema.js");
const { MsgSchema } = require("./msgSchenma.js");
const {convoSchema} = require("./cnvoSchem.js"); 
const generateToken = require('./middleware/verifytocken.js');
const mongoose = require('mongoose');
const initializeSocketServer=require('./middleware/socket.js')
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['authorization', 'Content-Type'],
  credentials: true,
}));

app.use(cookieParser());

const DbConnection = async () => {
  try {
    await mongoose.connect('mongodb+srv://kmugeis2005:dontforgetit@mugeishhero.ggr3iod.mongodb.net/KeepintouchUserDb?retryWrites=true&w=majority&AppName=mugeishhero');
    console.log("DB Connection Success");
  } catch (error) {
    console.error("Oops! Server Error: " + error);
  }
}
DbConnection();

const User = mongoose.model('User', Mod);
const Msge = mongoose.model('msgs', MsgSchema);
const Convo = mongoose.model('convo', convoSchema);

app.post('/AddUser', async (request, response) => {
    try {
        const { Username, Phone_no, Email, Password, image } = request.body;
        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = await User.create({ 'Username': Username, 'Phone_no': Phone_no, 'Email': Email, 'Password': hashedPassword, "image": image });
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
app.post('/Login', async (request, response) => {
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

        if (!Msg || !senderId) {
            return response.status(400).json({
                error: "Both 'Msg' and 'senderId' are required fields."
            });
        }

        let conversation = await Convo.findOne({
            participants: { $all: [senderId, id] }
        });

        if (!conversation) {
            conversation = await Convo.create({
                participants: [senderId, id],
                messages: [] // Correct the field name to 'messages'
            });
        }

        const newMsg = new Msge({
            senderId,
            resId: id,
            Msg: request.body.Msg
        });

        await newMsg.save();

        conversation.messages.push(newMsg); 
        await conversation.save(); 
        io.to(id).emit('newMessage', newMsg); 

        return response.status(201).json({
            Msg: newMsg
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            error: "Internal server error."
        });
    }
});


app.get("/recMsg/:id", protectRoute, async (request, response) => {
    try {
        const { id: userTochatId } = request.params;
        const senderId = request.user._id;

        // Find conversation and populate messages
        const conversation = await Convo.findOne({
            participants: { $all: [senderId, userTochatId] }
        }).populate({
            path: 'messages',
            populate: {
                path: 'senderId',
                select: 'Username' 
            }
        });

        if (!conversation) {
            return response.status(404).json({ error: "Conversation not found" });
        }

        const messages = conversation.messages;
        response.status(200).json({ messages });
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: "Internal server Error" });
    }
});

app.get("/", protectRoute, async (request, response) => {
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
const server = http.createServer(app);
const io = initializeSocketServer(server); 

server.listen(port, () => console.log(`Server listening on port ${port}`));


app.get('/some-route', (req, res) => {
  io.emit('some-event', { message: 'Hello from Express route!' });
  res.send('Some response');
});
