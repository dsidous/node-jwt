const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { regVal, loginVal } = require('../../validation');

router.post('/register', async (req, res) => {
  const { error } = regVal(req.body);
  
  // Validation
  if(error) {
    return res.status(400).send(error.details[0].message);
  };

  // Duplicate email
  const exist = User.findOne({ email: req.body.email});

  if(exist) {
    return res.status(400).send('Email already exist');
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password
  });

  try{
    const savedUser = await user.save();
    res.send(savedUser);
  }catch(err) {
    res.status(400).send(err)
  };
});

router.post('/login', async (req, res) => {
  const { error } = loginVal(req.body);
  
  // Validation
  if(error) {
    return res.status(400).send(error.details[0].message);
  };

  // Exist
  const user = await User.findOne({ email: req.body.email });

  if(!user) {
    return res.status(400).send('Wrong email and/or password');
  }

  // Password check
  const passwordCheck = await bcrypt.compare(req.body.password, user.password);

  if(!passwordCheck) {
    return res.status(400).send('Wrong email and/or password');
  }

  // JWT Token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

  res.header('auth-token', token).send(token);

});

module.exports = router;