var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var task_history = new Schema({
   uname: String,
  	tasktype:String,
  	subid:Number,
  	notes:String,
  	date:String,
  	minu:Number,
  email: String
},{ collection : 'task_history' });


module.exports = mongoose.model('Task_History', task_history);