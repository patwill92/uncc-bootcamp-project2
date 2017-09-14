var express = require('express');
var router = express.Router();

const {Post, User, Comment} = require("../models");

// Get Homepage
router.get('/', ensureAuthenticated, (req, res) => {
  Post.findAll({ include: [{ all: true, nested: true }]}).then(posts => {
    res.render('index', {posts});
  });
});

router.get('/api/comment', ensureAuthenticated, (req, res) => {
  Post.findAll({ include: [{ all: true, nested: true }]}).then(posts => {
    res.json(posts);
  });
});

router.get('/comment', (req, res) => {
  res.send({id: req.user.dataValues.id, username: req.user.dataValues.username});
});

router.post('/comment', (req, res) => {
  Comment.create(req.body).then(() => {
    res.redirect('/')
  })
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/users/signup');
  }
}

module.exports = router;