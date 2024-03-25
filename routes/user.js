const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const user = req.body;
  user.password = await bcrypt.hash(user.password, 10);
  const dbUser = await User.create(user);
  res.send(dbUser);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const dbUser = await User.findOne({ email: email });
  const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);
  if(!isPasswordCorrect){
    res.status(401).send({message:"Invalid email address or password"});
  }
  const token = jwt.sign({role:dbUser.role, email: dbUser.email}, process.env.JWT_SECRET);
  

  res.send({ isPasswordCorrect });
});

module.exports = router;
