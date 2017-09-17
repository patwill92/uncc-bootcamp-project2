const bcrypt = require('bcryptjs');

module.exports = {
  comparePassword(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
      if (err) throw err;
      callback(null, isMatch);
    });
  },
  generateHash(password, done) {
    return new Promise((resolve) => {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, null, done).then((res) => {
          resolve(res);
        });
      });
    })
  },
  ensureUser(req, res, next) {
    if (req.isAuthenticated() && req.user.username === req.params.username) {
      next();
    } else {
      if (req.isAuthenticated()) {
        res.redirect(`/user/${req.user.username}`);
      } else {
        res.redirect('/user/login');
      }
    }
  },
  ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/user/login');
    }
  }
};
