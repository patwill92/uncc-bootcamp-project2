const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const {comparePassword} = require('../utilities/db_functions');
const {User} = require("../models");

function generateHash(password, done) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, null, done).then((res) => {
        resolve(res);
      });
    });
  })
}

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/signup', (req, res) => {
  console.log(req.body);
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

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({where: {username}}).then(user => {
      if (!user) {
        done(null, false, {message: 'Unknown User'});
      }
      comparePassword(password, user.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({where: {id}}).then(user => {
    done(null, user)
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
  function (req, res) {
    res.redirect('/');
  });

router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;