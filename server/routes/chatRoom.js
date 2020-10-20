const express = require('express');
const router = express.Router();

const ChatRoomCtrl = require("../controllers/ChatRoomController");
const ChatRoom = require("../models/ChatRoom");

const models = require("../models");


/* GET users listing. */
router.get("/chatrooms", async (req, res, next) => {
  const chatRooms = await ChatRoom.findAll();
  res.send(chatRooms);
});
router.post("/chatroom", async (req, res, next) => {
	console.log("/chatroom post req")
	console.log(req.body)
  const room = req.body.room;
  const chatRooms = await ChatRoom.find({name: room });
  console.log("chatRooms find")
  console.log(chatRooms)
  const chatRoom = chatRooms[0];
  if (!chatRoom) {
    console.log("Creating chatroom")
    await ChatRoom.create({ name: room });
  }
  res.send(chatRooms);
});
router.get("/chatroom/messages/:chatRoomName", async (req, res, next) => {
  try {
    console.log("/chatroom/messages/:chatRoomName")
    
    const chatRoomName = req.params.chatRoomName;
    console.log(chatRoomName)
    const chatRoom = await models.ChatRoom.findOne({_id: chatRoomName});
    if(chatRoom){
      const chatRoomId = chatRoom._id;
      console.log("chatRoomId")
      console.log(chatRoomId)
      const messages = await models.ChatMessage.find({chat_room_id:chatRoomId});
      console.log("messages found")
      console.log(messages)
      res.send(messages);
    }
    else{
      res.send([]);
    }
  } catch (error) {
    res.send([]);
  }
});
module.exports = router;
