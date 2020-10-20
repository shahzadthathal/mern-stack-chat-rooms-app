
const async  = require('async');
const models = require("../models");


async function init(server) {

    const io = require("socket.io")(server);
    io.on("connection", socket => {
      console.log("Socket connect!")

      socket.on("join", async room => {
        socket.join(room);
        io.emit("roomJoined", room);
      });
      socket.on("message", async data => {
        const { chatRoomName, author, message } = data;
        const chatRoom = await models.ChatRoom.findAll({
          where: { name: chatRoomName },
        });
        const chatRoomId = chatRoom[0].id;
        const chatMessage = await models.ChatMessage.create({
          chatRoomId,
          author,
          message: message,
        });
        io.emit("newMessage", chatMessage);
      });
    });

}


exports.init = init;