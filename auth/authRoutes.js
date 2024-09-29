const express = require('express');
const { check } = require('express-validator');
const { register, upload, login, refreshToken, getUserById, editProfile  } = require("./authController.js");
const router = express.Router();
const { VerifyToken } = require("./authMiddleware.js")



// signup Route
router.post('/register', upload.single('profileImage'), register);

// Login Route
router.post('/login', login);

//RefreshToken Route
router.post('/refresh', refreshToken);


//UserById Route
router.get('/user/:id',VerifyToken, getUserById )

// Edit Profile
router.patch('/profile/update/:id', VerifyToken, editProfile)



module.exports = router;

