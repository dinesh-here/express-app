var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var userSchema = new Schema({
   name: String,
  password: { type: String, required: true },
  email: String
},{ collection : 'stu_info' });

userSchema.methods.encpass=function(pass){
	var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
	var crypted = cipher.update(pass,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
}
module.exports = mongoose.model('User', userSchema);