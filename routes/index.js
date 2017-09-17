const express = require('express');
const router = express.Router();

const {ensureAuthenticated} = require('../utilities/db_functions');
const {Post} = require("../models");

router.get('/', ensureAuthenticated, (req, res) => {
  Post.findAll({ include: [{ all: true, nested: true }]}).then(posts => {
    res.render('index', {posts});
  });
});

module.exports = router;