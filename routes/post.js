const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const upload = multer({dest: './posts/'});

const {ensureAuthenticated} = require('../utilities/db_functions');
const {Post} = require("../models");

router.post('/tribute', ensureAuthenticated, upload.single('avatar'), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  req.body.type = true;
  let files = {
    img: fs.readFileSync(req.file.path),
    imgType: req.file.mimetype
  };
  let myPost = {...req.body, ...files};
  Post.create(myPost).then(post => {
    console.log(post);
    res.redirect('/');
  });
});

router.post('/advice', ensureAuthenticated, (req, res) => {
  req.body.type = false;
  console.log(req.body);
  Post.create(req.body).then(post => {
    console.log(post);
    res.redirect('/');
  });
});

module.exports = router;