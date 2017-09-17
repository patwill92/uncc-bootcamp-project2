const express = require('express');
const router = express.Router();

const {ensureAuthenticated} = require('../utilities/db_functions');
const {Comment} = require("../models");

router.get('/', ensureAuthenticated, (req, res) => {
  res.send({id: req.user.dataValues.id, username: req.user.dataValues.username});
});

router.post('/', ensureAuthenticated, (req, res) => {
  Comment.create(req.body).then(() => {
    res.redirect('/');
  });
});

module.exports = router;