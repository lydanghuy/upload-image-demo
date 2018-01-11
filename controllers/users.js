var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var multer = require('multer');
var authenticate = require('../config/authenticate');
var passport = require('passport');

const User = require('../models/user');

/* GET users listing. */
router.route('/').get(authenticate.verifyUser, function(req, res, next) {
  if(req.user.admin === true){
    User.find({})
    .then((users) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({err: 0, msg: 'success', users});
    }, (err) => next(err))
    .catch((err) => next(err));
    }
    else{
      res.statusCode = 403;
      res.setHeader('Content-Type','application/json');
      res.json({err: -1, msg : "You are not allowed!"});
    }
});


router.post('/signup', function(req,res,next){
 
    
    //console.log(req.body.email);

    User.findOne({ email: req.body.email}).exec(function (err, results) {
      
      if(results){
        return res.json({err:-1, msg:"Email exists"});
      }
    
      else{
          //register new user
          User.register(new User({username: req.body.username}), req.body.password,
          (err,user) =>{
            if(err){
              res.statusCode = 500;
              res.setHeader('Content-Type','application/json');
              res.json({err : err});
            }
            else{
              if(req.body.firstname){
                user.firstname = req.body.firstname;
              }
              if(req.body.lastname){
                user.lastname = req.body.lastname;
              }
              if(req.body.email){
                user.email = req.body.email;
              }
              user.save((err, user) => {
                  if(err){
                    res.statusCode = 500;
                    res.setHeader('Content-Type','application/json');
                    res.json({err : err, success: false});
                    return;
                  }

                    passport.authenticate('local')(req, res , () =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json({ success:true , status : 'Registration Successful!'});
                });
              });

            }
        });
    }
  });
    
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
      if (err) {
          return next(err);
      }
      if (!user) {
          return res.status(401).json({
              err: info,
               success: false,
          });
      }
      req.logIn(user, function (err) {
          if (err) {
              return res.status(500).json({
                  err: 'Could not log in user',
                   success: false
              });
          }

          var token = authenticate.getToken({_id : req.user._id});
          res.status(200).json({
              err : 0,
              msg: 'Login successful!',
              token: token,
              user_id : req.user._id,
              name : req.user.firstname +' '+ req.user.lastname,
              admin: req.user.admin,
              email: req.user.email

          });

      });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
