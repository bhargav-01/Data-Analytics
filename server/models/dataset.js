var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");


var DataSet = new Schema({
  DataSetName:{
      type:String
  },
  DataSetURL:{
    type: String,
    
  },
  author:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
  }

},
    {
        timestamps:true
});

module.exports = mongoose.model("DataSet", DataSet);
