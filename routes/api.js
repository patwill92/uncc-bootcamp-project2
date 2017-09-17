const express = require('express');
const router = express.Router();

const {ensureAuthenticated} = require('../utilities/db_functions');
const {User, Post, Comment} = require("../models");

router.get('/comment', ensureAuthenticated, (req, res) => {
  Post.findAll({include: [{all: true, nested: true}]}).then(posts => {
    res.json(posts);
  });
});

router.get('/users/:id', ensureAuthenticated, (req, res) => {
  let id = req.params.id;
  User.findOne({where: {id}, include: Post}).then(function (user) {
    res.json(user);
  });
});

router.get('/posts/:id', ensureAuthenticated, (req, res) => {
  Post.findAll({include: User}).then(function (posts) {
    res.json(posts);
  });
});

router.get('/img/:id', function (req, res, next) {
  let id = req.params.id;
  User.findOne({where: {id}}).then(user => {
    console.log(user.imgType);
    console.log(user.img);
    res.contentType(user.imgType);
    res.send(user.img);
  });
});

router.get('/img/post/:id', function (req, res, next) {
  let id = req.params.id;
  Post.findOne({where: {id}}).then(post => {
    res.contentType(post.imgType);
    res.send(post.img);
  })
});

module.exports = router;