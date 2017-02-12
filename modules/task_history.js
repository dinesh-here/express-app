var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var task_history = new Schema({
	uname: String,
	tasktype:String,
	subid:Number,
	notes:String,
	date:String,
	mins:Number,
	days: Number,
	furl:String,
	efg:Number,
	fname:String
},{ collection : 'task_history' }, { _id: false });


module.exports = mongoose.model('Task_History', task_history);