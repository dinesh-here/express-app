var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var crypto = require('crypto');

var task_history = new Schema({
	date:String,
	uname: String,
	tasktype:String,
	subid:Number,
	fname:String,
	furl:String,
	process:String,
	activity:String,
	notes:String,
	reason: String,
	days: Number,
	mins:Number,
	efg:Number
},{ collection : 'task_history' }, { _id: false });


module.exports = mongoose.model('Task_History', task_history);