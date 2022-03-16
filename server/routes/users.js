var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

router.use(bodyParser.json());

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  console.log(req.body)
  User.register(new User({email: req.body.email}), 
    req.body.password, (err, user) => {
    if(err) {
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

      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        console.log(user);
        
        passport.authenticate('local')(req, res, () => {
          var token = authenticate.getToken({_id: user._id});
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true,token:token,status: 'Registration Successful!'});
        })

      });
    }
  });
})



router.post('/login', passport.authenticate('local'), (req, res) => {

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
