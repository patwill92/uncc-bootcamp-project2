const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer  = require('multer');
const fs = require('fs');
const upload = multer({ dest: './uploads/' });

const {generateHash} = require('../utilities/db_functions');
const {User} = require("../models");

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login')
});

router.post('/signup', upload.single('avatar'), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  req.getValidationResult().then((result) => {
    if (result.array().length > 0) {
      res.render('signup', {errors: result.array()})
    }
    else {
      generateHash(req.body.password).then((result) => {
        let user = {
          name: req.body.name,
          img: fs.readFileSync(req.file.path),
          imgType: req.file.mimetype,
          email: req.body.email,
          country: req.body.country,
          username: req.body.username,
          password: result
        };
        User.create(user).then(() => {
          req.flash('success_msg', 'You are registered and can now login');
          res.redirect('login')
        }).catch((err) => {
          switch (err.errors[0].path) {
            case 'email':
              req.flash('error_msg', 'Email already exists');
              res.redirect('signup');
              break;
            case 'username':
              req.flash('error_msg', 'Username already exists');
              res.redirect('signup');
              break;
          }
        })
      })
    }
  })
});

router.post('/login',
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/user/login', failureFlash: true}),
  function (req, res) {
    res.redirect('/');
  });

router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/user/login');
});

module.exports = router;