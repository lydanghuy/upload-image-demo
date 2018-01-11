var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

var userSchema = new Schema({
    //usrname and password are automatically added by passport local mongoose
    firstname:{
        type : String,
        default: ''
    },
    lastname:{
        type: String,
        default: ''
    },
    email:{
        type: String,
        trim: true, unique: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    },
    avartarURL:{
        type: String,
        default: ''
    },
    admin :{
        type: Boolean,
        default : false
    },

    resetPasswordToken:  String,
    resetPasswordExpires:  Date

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);

