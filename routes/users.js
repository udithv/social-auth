const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');


router.get('/',(req, res, next) => {
	res.send('You are in the Users page');
});
router.post('/authenticate', (req, res, next) => {
	let username = req.body.username;
	let password = req.body.password;

	User.getUserByUsername(username, (err, user) => {
		if(err) throw err;

		if(!user){
			res.json({
				success: false,
				msg: "User does not Exit"
			});
		}

		User.comparePassword(password, user.password,(err, isMatch) =>{
			if(err) throw err;
			if(!isMatch){
				
				res.json({
					success: false,
					msg: 'Wrong Password'
				});
			}else{
				const token = jwt.sign(user, config.secret, {
					expiresIn: 604800 //1 week
				});

				res.json({
					success: true,
					token: 'JWT '+token,
					user: {
						    id: user._id,
							name: user.name,
							username: user.username,
							email: user.email
						}
				});
			}
		});
	});
});


router.post('/register',(req, res, next) => {
	let newUser = new User({
		name: req.body.name,
		password: req.body.password,
		username: req.body.username,
		email: req.body.email
	});

		User.addUser(newUser, (err, user) => {
		if(err){
			res.json({success: false, msg: 'Failed to register User'});
		}else {
			res.json({success: true, msg: 'User Registered'});
		}
	});

});

router.get('/userlist', passport.authenticate('jwt',{session:false}), (req, res, next) => {
	let usermap = [];
	User.find({}, (err, users) => {
		
		usermap = users.map((user) => {
			let u = {
				username: user.name,
				email: user.email,
				_id : user._id
			};
			return u;
		});
		res.json(usermap);
	});


});


router.post('/sendfriendrequest', passport.authenticate('jwt',{session:false}), (req, res, next) => {
	let userid = req.user._id;
	let friendtobe = req.body.aid;
	console.log(friendtobe);
	User.sendRequest(userid, friendtobe)
	  .then(() => {
	  		res.json({success: true, msg:'Friend Request Sent'});	
	  }, (err) => {
		
			console.log(err);
			res.json({success: false, msg:'Error : Something went wrong Friend Request Not Sent'});

	});

});

router.post('/acceptfriendrequest', passport.authenticate('jwt',{session:false}), (req, res, next) => {
	let userid = req.user._id;
	let requester = req.body.rid;

	User.acceptRequest(userid, requester)
	    .then(() => {
	    		console.log('Friend Request Accepted');
				res.json({success: true, msg:'Friend Request Accepted'});
	    },(err) => {
		
			console.log(err);
			res.json({success: false, msg:'Error : Something went wrong Friend Request Not Accepted'});
	});

});


router.get('/getfriends', passport.authenticate('jwt',{session:false}), (req, res, next) => {
	let userid = req.user._id;

	User.getFriends(userid)
		.then((friends) => {
		res.json(friends);
		},
		(err) => console.log(err));
});

router.post('/unfriend', passport.authenticate('jwt',{session:false}), (req, res, next) => {
	let userid1 = req.user._id;
	let userid2 = req.body.friend;


			User.unfriend(userid1, userid2)
			.then(() => {
				res.json({success: true, msg:'You are no longer friends'});

				},
				(err) => {console.log(err)}
				);
	

});


router.get('/getacceptedfriends', passport.authenticate('jwt',{session:false}), (req, res, next) => {
	let userid = req.user._id;

	
		User.getAcceptedFriends(userid)
		.then((friends) => {
		res.json(friends);
		},
		(err) => console.log(err));
});


router.get('/getrequestedfriends', passport.authenticate('jwt',{session:false}), (req, res, next) => {
	let userid = req.user._id;

	User.getRequestedFriends(userid)
		.then((friends) => {
		res.json(friends);
		},
		(err) => console.log(err));
});


router.get('/getpendingfriends', passport.authenticate('jwt',{session:false}), (req, res, next) => {
	let userid = req.user._id;

	User.getPendingFriends(userid)
		.then((friends) => {
		res.json(friends);
		},
		(err) => console.log(err));
});


//Profile 
router.get('/profile', passport.authenticate('jwt',{session:false}), (req, res, next) => {
	let user = {
		id: req.user._id,
		name: req.user.name,
		username: req.user.username,
		email: req.user.email,
		v: req.user.__v
	}
	
	
	res.json({
		user: user
	});
	


});


module.exports = router;