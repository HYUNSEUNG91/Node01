const mongoose = require("mongoose");


//mongoose 데이터 모델링 -> Schema 객체 사용 -> Document 사용
const boardSchema = new mongoose.Schema({
  boardNum : {
    type: Number,
    require: true,
    unique: true,
  },
  userNum : {
    type: Number,
    require: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    
  },
  comment: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  data: {
    type: String,
    required: true
  },
});


module.exports = mongoose.model("board", boardSchema);