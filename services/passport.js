const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {comparePassword} = require('../utilities/db_functions');
const {User} = require("../models");

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