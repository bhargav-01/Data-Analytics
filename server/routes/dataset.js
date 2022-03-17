var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
const DataSet = require('../models/dataset');
var passport = require('passport');
var authenticate = require('../authenticate');
var csv = require('csv-parser');
var fs = require('fs')
var axios = require('axios')
var Papa =require('papaparse')
// const https = require("https");

// var request = require('request');

router.use(bodyParser.json());

router.get('/',authenticate.verifyUser, function(req, res, next) {
  
  DataSet.find({author:req.user._id})
    .populate('author')
    .then(data=>{
      axios.get(data[0].DataSetURL)
      .then(body=>{

        var result=Papa.parse(body.data,{
          header:false,
          dynamicTyping:true,
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result.data);
      })
    })
});

router.post('/',authenticate.verifyUser, (req, res, next) => {
  
    req.body.author = req.user._id;
    console.log(req.body);
    DataSet.create(req.body)
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
