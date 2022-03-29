const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
      userNum: {
      type : Number,
      require : true,
      unique : true,
    }, 
    email: String,
    nickname: String,
    password: String,
  });

UserSchema.virtual("userId").get(function () {
return this._id.toHexString();
});
UserSchema.set("toJSON", {
virtuals: true,
});
module.exports = mongoose.model("User", UserSchema);