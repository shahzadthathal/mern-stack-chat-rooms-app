const bcrypt = require("bcryptjs");
const models = require("../models");


async function detail(id){
    try {
        const room = await models.ChatRoom.findById(id);
        return room;
    } catch (err) {
        throw err;
    }
}

async function messages(id){

    try {
        const chatRoom = await models.ChatRoom.findOne({_id: id});
        if(chatRoom){
            const chatRoomId = chatRoom._id;
            const messages = await models.ChatMessage.find({chat_room_id:chatRoomId});
            return messages
        }
        else{
          return [];
        }
        
    } catch (err) {
        throw err;
    }
}

async function list(id){
	try {
        const rooms = await models.ChatRoom.find({status:true});
        return rooms;
    } catch (err) {
    	throw err;
    }
}

async function create(data) {
    try {
        let roomFound = await models.ChatRoom.findOne({
            unique_name:data.name
        });
        if (roomFound) {
        	throw 'Room name already taken.';
        }
        const room = new models.ChatRoom(data);
        room.createdAt = Date.now();
        room.status = true;
        const newroom = await room.save();
        return newroom;
    } catch (err) {
    	throw err;
    }
}

module.exports = {
	list: list,
    create: create,
    messages:messages,
    detail:detail,
}
