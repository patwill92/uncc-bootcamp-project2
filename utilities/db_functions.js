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
  ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/user/login');
    }
  }
};
