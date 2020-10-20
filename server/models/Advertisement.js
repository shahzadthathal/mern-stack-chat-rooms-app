const mongoose = require("mongoose");

const AdvertisementSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  }
  advertisement_type: {
    type: String, //text,image,link, html
    default:'text'
  },
  is_active: { 
    type: Boolean, 
    default: false 
  },
  text: {
    type:String,
    default:'',
    maxlength:250,
  },
  image: {
    type:String,
    default:'',
  },
  link: {
    type:String,
    default:'',
  },
  html: {
    type:String,
    default:'',
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default: Date.now()
  },
  start_at: {
    type: Date,
    default: 0
  },
  expired_at: {
    type: Date,
    default: 0
  },
  click_count: {
    type: Number,
    default: 0
  },
  clicked_users:[], //Array of objects, i.e. {user_id:abc,clicked_date:Date.now()}
  
});

// export model chatroom with ChatRoomSchema
module.exports = mongoose.model("chatroom", ChatRoomSchema);