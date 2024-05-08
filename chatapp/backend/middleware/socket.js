const socketio = require('socket.io');
const mongoose=require("mongoose")
const { convoSchema } = require("../cnvoSchem.js");
const Convo = mongoose.model('convos', convoSchema);
const initializeSocketServer = (server) => {
  try {
    const io = socketio(server, {
      cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"] 
      }
    });

    io.on('connection', (socket) => {
      console.log('A user connected');
      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
      socket.on('sendMessage', async (message) => {
        console.log('Received message:', message);

        try {
          const newMsg = await saveMessage(message); 
          io.to(message.conversationId).emit('newMessage', newMsg);
        } catch (error) {
          console.error("Error saving or broadcasting message:", error);
        }
      });
    });

    return io;
  } catch (error) {
    console.error("Error creating Socket.IO server:", error);
  }
};

module.exports = initializeSocketServer;
async function saveMessage(message) {
    const { senderId, resId, Msg, conversationId } = message; 
  
    try {
      const conversation = await Convo.findById(conversationId);
      if (!conversation) {
        return null; 
      }
      const newMsg = new Msge({
        senderId,
        resId,
        Msg,
      });
      await newMsg.save();
      conversation.Msg.push(newMsg._id);
      await conversation.save();
  
      return newMsg;
    } catch (error) {
      console.error("Error saving message:", error);
      return null; 
    }
  }
  