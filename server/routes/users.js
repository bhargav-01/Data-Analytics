var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
const nodemailer = require('nodemailer');
router.use(bodyParser.json());


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: your_email,
    pass: auth key
  }
});

router.get('/',authenticate.verifyUser, function(req, res, next) {
  User.findById(req.user._id).
  then(data=>{
    res.send(data);
  })
  
});



router.post('/signup', (req, res, next) => {
  console.log(req.body)
  User.register(new User({email: req.body.email}), 
    req.body.password, (err, user) => {
    if(err) {
      // console.log("ss")
      console.log(req.body)
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else
    {

      if (req.body.firstName)
        user.firstname = req.body.firstName;
      if (req.body.lastName)
        user.lastname = req.body.lastName;
      
      user.otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }

        const mailConfigurations = {
          from: 'patelbhargav932002@gmail.com',
          to: req.body.email,
          subject: 'DataLab verification Email',
          html: '<h1>Hi '+user.firstname+"! Welcome to DataLab</h1>\n"
           + '<h2>Your OTP: '+user.otp+'</h2>',
        };
          
        transporter.sendMail(mailConfigurations, function(error, info){
            if (error) throw Error(error);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true,status: 'Registration Successful!'});
        });
      });
    }
  });
})

router.post('/verification', (req, res,next) => {
  User.find({email:req.body.email}).then(data=>{
    console.log(data[0]._id)
    if(data[0].otp==req.body.otp && data[0].verification=="pending")
    {
      User.updateOne({_id:data[0]._id},{$set:{verification:'done'}})
      .then(t=>{
          var token = authenticate.getToken({_id: data[0]._id});
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true,token:token,status: 'Veriication Successful!'});
      })
    }
    else
    {
      var token = authenticate.getToken({_id: data[0]._id});
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({stauts:"Wrong OTP"});
    }
  })
  
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  console.log("s")
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});



module.exports = router;
