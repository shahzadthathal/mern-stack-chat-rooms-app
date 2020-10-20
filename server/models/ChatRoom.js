const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatRoomSchema = mongoose.Schema({
  creator_id: {
    type: Schema.Types.ObjectId,
    ref:'user',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
  },
  unique_name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, 
    trim: true,
    index: true,
  },
  status: {
    type:Boolean, 
    default: false
  },
  male_count: {
    type:Number, 
    default: 0
  },
  female_count: {
    type:Number, 
    default: 0
  },
  unknown_count: {
    type:Number, 
    default: 0
  },
  room_country: { 
    type: String,
    default: 'us'
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default: Date.now()
  },
  
});

// export model chatroom with ChatRoomSchema
module.exports = mongoose.model("chatroom", ChatRoomSchema);