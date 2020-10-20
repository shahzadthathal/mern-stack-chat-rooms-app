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
            console.log("messages found 1")
            console.log(messages)
            return messages
            
            // let modifiedMessages =  messages.map((message)=>{
            //     models.UserModel.findById(message.author_id,['_id','username'], (err,user)=>{
            //         if(user){
            //             message.author = user.username;
            //             //console.log(message)
            //             //return message;
            //         }
            //     })
            // })
            
        
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
    console.log("user service create")
    console.log(data)
    
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
       // console.log("room saved")
        //console.log(newroom)
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
