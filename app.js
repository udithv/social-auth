const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const mongooseFriends = require('mongoose-friends');
const friendsPlugin = require('mongoose-friends-plugin');
const morgan = require('morgan');
const bcryptjs = require('bcryptjs');


//Required variables 
const config = require('./config/database');

const port = 3000;

const users = require('./routes/users');


//Connect to Database
mongoose.connect(config.database);


mongoose.Promise = global.Promise;

mongoose.connection.on('connected', () => {
	console.log('Connected to database : '+config.database);
});

mongoose.connection.on('error', (err) => {
	console.log('Database Error :' +err);
});




//Intialize Express
const app =  express();

//Loading Middleware

//Body Parser
 app.use(bodyParser.json());

 //Cors 
 app.use(cors());


 //Logger
 app.use(morgan('dev'));

//Set Static Folder 
app.use(express.static(path.join(__dirname,'public')));



app.use('/users',users);

app.get('/',(req, res) => {
	res.send('INDEX');
});


app.listen(port, () => {
	console.log('Server Running At Port : '+port);
});










