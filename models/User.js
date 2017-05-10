const mongoose = require('mongoose');
const mf = require('mongoose-friends');


const UserSchema = mongoose.Schema({
	name: {
		type: String
	},
	email: {
		type: String,
		required: true
	},
	username: {
		type:  String,
		required: true
	},
	password: {
		type:  String,
		required: true
	}

});


// optionally specify a name for the path (default is "friends")
UserSchema.plugin(mf({pathName: "associates"}));



const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
	User.findById(id,callback);

}


module.exports.getUserByUsername = function(username, callback){
	const query = {username: username}
	User.findOne(query,callback);

}

module.exports.addUser = function(newUser, callback){
	newUser.save(callback);
	
}

module.exports.sendRequest = function(uid1, uid2, callback){
	User.requestFriend(uid1, uid2, callback);
}

module.exports.acceptRequest = function(fid1, fid2, callback){
	console.log('in acceptRequest');
	User.requestFriend(fid1, fid2, callback);
}

