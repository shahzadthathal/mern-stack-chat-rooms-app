const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatRoomMessagesSchema = mongoose.Schema({
  author_id: {
    type: Schema.Types.ObjectId,
    ref:'user',
    required: true,
    index: true,
  },
  author: {
    //type: Object,
    username:String,
    is_online:false,
    image:''
  },
  message: {
    type: String,
    required: true
  },
  chat_room_id:{
    type: Schema.Types.ObjectId,
    ref:'chatroom',
    required: true,
    index: true,
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

// export model ChatRoomMessages with ChatRoomMessagesSchema
module.exports = mongoose.model("ChatRoomMessages", ChatRoomMessagesSchema);