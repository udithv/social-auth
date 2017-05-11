const router = require('express').Router();
const User = require('../models/User');


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
				
				res.json({
					success: true,
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

router.get('/userlist', (req, res, next) => {
	let usermap = [];
	User.find({}, (err, users) => {
		
		usermap = users.map((user) => {
			let u = {
				username: user.name,
				_id : user._id
			};
			return u;
		});
		res.json(usermap);
	});


});


router.post('/sendfriendrequest', (req, res, next) => {
	let userid = '5912bd2acf00e40350708698';
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

router.post('/acceptfriendrequest', (req, res, next) => {
	let userid = '5912bd64cf00e40350708699';
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


router.post('/getfriends', (req, res, next) => {
	let userid = req.body.userid;

	User.getFriends(userid)
		.then((friends) => {
		res.json(friends);
		},
		(err) => console.log(err));
});

router.post('/unfriend', (req, res, next) => {
	let userid1 = req.body.user1;
	let userid2 = req.body.user2;


			User.unfriend(userid1, userid2)
			.then(() => {
				res.json({success: true, msg:'You are no longer friends'});

				},
				(err) => {console.log(err)}
				);
	

});


router.post('/getacceptedfriends', (req, res, next) => {
	let userid = req.body.userid;

	
		User.getAcceptedFriends(userid)
		.then((friends) => {
		res.json(friends);
		},
		(err) => console.log(err));
});


router.post('/getrequestedfriends', (req, res, next) => {
	let userid = req.body.userid;

	User.getRequestedFriends(userid)
		.then((friends) => {
		res.json(friends);
		},
		(err) => console.log(err));
});


router.post('/getpendingfriends', (req, res, next) => {
	let userid = req.body.userid;

	User.getPendingFriends(userid)
		.then((friends) => {
		res.json(friends);
		},
		(err) => console.log(err));
});





module.exports = router;