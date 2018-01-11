var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var multer = require('multer');
var authenticate = require('../config/authenticate');

const User = require('../models/user');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './public/uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
      //cb(null, file.originalname);
    }
  });
  
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });




router.post("/:userId", authenticate.verifyUser, upload.single('avatarImage'), (req, res, next) => {
  User.findById(req.params.userId).then((user) =>{
    if( user != null ){

      console.log(req.file.path);
      
      //user.avatarURL.push('localhost:3000/users/' + user._id);
      user.avartarURL = "localhost:3000/public/uploads/" + req.file.filename;
      user.save()
      .then((user)=>{
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json(user);
      }, (err) => next(err));

  }
    else{
      err = new Error('User ' + req.params.userId + ' not found.');
      err.status = 404;
      return next(err);
  }
}, (err) => next(err))
.catch((err) => next(err));

});

module.exports = router;