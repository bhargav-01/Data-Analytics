var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");


var User = new Schema({
  firstname: {
    type: String,
    defalut: "",
  },
  profile_image:{
    type: String,
    default: "https://firebasestorage.googleapis.com/v0/b/linkedin-b23aa.appspot.com/o/user.png?alt=media&token=2ab5a16d-f61a-4c84-89d9-b423f5836a62",
  },
  lastname: {
    type: String,
    default: "",
  },
    

});

// User.plugin(passportLocalMongoose);
User.plugin(passportLocalMongoose, { usernameField: "email" });
module.exports = mongoose.model("User", User);
