const router = require('express').Router();
const verify = require('./verifyToken');

const User = require('../models/User');

router.get('/', verify, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });

  if (!user) {
    return res.status(401).send('Access denied!');
  }
  
  res.send(user.email);
});

module.exports = router;