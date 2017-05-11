const mongoose = require('mongoose');
const mf = require('mongoose-friends');
const friendsPlugin = require('mongoose-friends-plugin');
const bcryptjs = require('bcryptjs');


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

UserSchema.plugin(friendsPlugin({pathName: "associates"}));



const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
	User.findById(id,callback);

}


module.exports.getUserByUsername = function(username, callback){
	const query = {username: username}
	User.findOne(query,callback);

}

module.exports.addUser = function(newUser, callback){
	bcryptjs.genSalt(10, (err,salt) => {
			bcryptjs.hash(newUser.password, salt, (err, hash) => {
				if(err) throw err;

				newUser.password = hash;
				newUser.save(callback);

			});
	});
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcryptjs.compare(candidatePassword,hash,(err, isMatch) => {
		if(err) throw err;
		callback(null, isMatch);
	});
}

module.exports.sendRequest = function(uid1, uid2, callback){
	return User.requestFriend(uid1, uid2);
}

module.exports.acceptRequest = function(fid1, fid2, callback){

	return User.requestFriend(fid1, fid2);
}

module.exports.unfriend = function(uid1, uid2, callback){
	return User.removeFriend(uid2, uid1);
}