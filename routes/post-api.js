const express = require('express');
const router = express.Router();


const {Post, User} = require("../models");

router.post('/tribute', (req, res) => {
  console.log(req.body);
  Post.create(req.body).then(post => {
    console.log(post);
    res.redirect('/');
  });
});

router.get('/api/users/:id', (req, res) => {
  let id = req.params.id;
  User.findOne({where: {id}, include: Post}).then(function(user) {
    res.json(user);
  });
});

router.get('/api/posts/:id', (req, res) => {
  Post.findAll({include: User}).then(function(posts) {
    res.json(posts);
  });
});

router.post('/comment', (req, res) => {
  console.log(req.body);
  res.redirect('/')
  // Post.findAll({include: User}).then(function(posts) {
  //   res.json(posts);
  // });
});

module.exports = router;