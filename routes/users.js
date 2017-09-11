const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const db = require("../models");

function generateHash(password, done) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, null, done).then((res) => {
        resolve(res);
      });
    });
  })
}

router.get('/signup', (req,res) => {
  res.render('signup');
});

router.get('/login', (req,res) => {
  res.render('login');
});

router.post('/signup', (req,res) => {
  console.log(req.body);
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  req.getValidationResult().then((result) => {
    if(result.array().length > 0) {
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
        db.User.create(user).then(() => {
          res.redirect('login')
        })
      })
    }
  })
});

module.exports = router;