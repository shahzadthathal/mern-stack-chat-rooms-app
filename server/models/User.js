const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  socket_id: { 
    type: String,
    default:''
  },
  username: { 
    type: String, 
    required: true, 
    trim: true,
    index: true,
  },
  phone_country_code: { 
    type: String, 
    default: ''
  },
  phone_number: { 
    type: String, 
    default: ''
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true
  },
  full_name: { 
    type: String, 
    trim: true 
  },
  login_type: { 
    type: String,
    default:'email'//email, phone, social
  },
  birthday: { 
    type: Number, 
   // required: true 
   default:0
  },
  gender: { 
    type: String, 
    //required: true 
    default: 'Unknown'
  },
  language: { 
    type: String, 
    required: false
  },
  is_online: {
    type: Boolean,
    default: false
  },
  allow_to_show_age: { 
    type: Boolean, 
    default: true 
  },
  allow_to_show_city: { 
    type: Boolean, 
    default: true 
  },
  user_country: { 
    type: String 
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default: Date.now()
  },
  image:{
    type:String,
    default:''
  },
  bio:{
    type:String,
    default:'',
    maxlength:400,
  },
  favorite_rooms_arr:[],
  favorite_users_arr:[],
  //Get user ip from req ans detect its country
  ip_address: {
    type: String
  },
  ip_locate_info: {
    type: Object
  },
  role:{
    type: String,
    default:'user'//user,moderator,admin
  },
  last_visited_room_id:{ 
    type: String 
  },

});

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);