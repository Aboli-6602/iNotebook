const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const saltRounds = 5;
const JWT = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser").default;
const jwt = require("jsonwebtoken");
const JWT_SECRET = "this is a secret.";

router.post('/', (req, res)=>{
  // console.log(req.body);
  res.send("hell")
})

// User Sign in: No login required
router.post('/createuser', [
  body('username', 'username should be atleast 3 characters long').isLength({ min: 3 }),
  body('email', 'enter valid email').isEmail(),
  body('password', 'password should be atleast 5 characters long').isLength({ min: 5 })
], (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (!err) {
      User.create({
        username: req.body.username,
        email: req.body.email,
        password: hash
      }).then(user => {
        const data = {
          user: {
            id: user.id
          }
        }
        const authToken = JWT.sign(data, JWT_SECRET);
        res.json({ authToken });

      }).catch((err) => {
        res.send(err);
      })
    }
    else {
      console.log(err);
    }
  })

})

// User Login: No login required
router.post('/login', [
  body('email', 'enter valid email').isEmail(),
  body('password', 'password cannot be empty').exists()
], async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email });
  try {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          res.json(user);
        }
        else {
          console.log(user.password);
          console.log(password);
          res.send("Enter correct login credentials")
        }
      });
    }
    else {
      res.send("Enter correct login credentials")
    }
  }
  catch {
    res.send("Internal Server Error");
  }

})

// Get User details
router.post('/getUser', (req, res, next)=>{
  const token = req.header("auth-token");
  try {
      const data = jwt.verify(token, JWT_SECRET);
      req.user = data.user;
      next();

  } catch (error) {
      res.send("Authenticate using a valid token");
  }

  
}, async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");
    res.send(user);
  } catch (error) {
    res.send("Internal Server Error");
  }
})

module.exports = router;