var express = require('express');
var router = express.Router();
var chatModel = require('./chat');
var userModel = require('./users');
var passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()))
const mongoose = require('mongoose')

mongoose.connect('mongodb://0.0.0.0/n1-finalProjectt').then(result => {
  console.log("Connected to database")
}).catch(err => {
  console.log(err)
})


/* GET home page. */
router.get('/',isLoggedIn, function(req, res, next) {
  userModel.findOne({username:req.session.passport.user}).then(function(loggedInUser){
    res.render('index',{user:loggedInUser});
  })
});

router.get('/login', (req, res, next) => {
  res.render('login')
})

router.get('/register', (req, res, next) => {
  res.render('login')
})

router.post('/findUser',isLoggedIn, async (req,res)=>{
  var findUserName=req.body.username

  var findUser = await userModel.findOne({
    username:findUserName
  })
  if (findUser){
    res.status(200).json({
      user:findUser
    })
  }
  else{
    res.sendStatus(404).json({
      message:'user not found'
    })
  }
})

router.post('/findChats',isLoggedIn,async (req,res,next)=>{
  var oppositeUser=await userModel.findOne({username:req.body.oppositeUser})
  var chats=await chatModel.find({
    $or:[
      {
        toUser:req.user.username,
        fromUser:oppositeUser.username
      },{
        fromUser:req.user.username,
        toUser:oppositeUser.username
      }
    ]
  })
  res.json({chats})
})

//PASSPORT 

router.post('/register', function (req, res, next) {
  var newUser = new userModel({
    username: req.body.username,
    pic: req.body.pic
  })
  userModel.register(newUser, req.body.password).then(function (user) {
    passport.authenticate('local')(req, res, function () {
      res.redirect('/')
    })
  })
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}), function (req, res, next) { });

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

//PASSPORT ENDs

module.exports = router;
