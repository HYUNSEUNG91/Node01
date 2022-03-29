const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
  userNum: {
    type : Number,
    require : true,
  }, 
  replyNum: {
    type : Number,
    require : true,
    unique : true,
  }, 
  reply: {
    type : String,
    require : true,
  }, 
  boardNum: {
    type : String,
    require : true,
  },
  nickname: {
    type : String,
    require : true,
  },
  data: {
    type : String,
    require : true,
  },
  });

module.exports = mongoose.model("Reply", ReplySchema);