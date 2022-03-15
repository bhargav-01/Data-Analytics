var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
const DataSet = require('../models/dataset');
var passport = require('passport');
var authenticate = require('../authenticate');

router.use(bodyParser.json());

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post((req, res, next) => {
  
    req.body.author = req.user._id;
    console.log(req.body);
    Post.create(req.body)
    .then((dataset) => {
        DataSet.findById(dataset._id)
        
        .populate('author')
        .then((dataset)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dataset);
        })
    }, (err) => console.log(err))
    .catch((err) => console.log(err));
})



module.exports = router;
