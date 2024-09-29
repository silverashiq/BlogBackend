const bcrypt = require("bcrypt");
const User = require("../models/User");
const { cloudinary } = require("../config/cloudinaryConfig");
const jwt = require("jsonwebtoken");

// Multer Setup
const multer = require("multer");
const { storage } = require("../config/cloudinaryConfig");

const upload = multer({ storage });

//_________Register User_________

const register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      res.send({
        msg: "User Already  Exits",
      });
    }

    const uploadImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "user_images",
    });

    user = new User({
      email,
      password: await bcrypt.hash(password, 10),
      firstName,
      lastName,
      profileImage: uploadImage.secure_url,
    });
    await user.save();
    res.send({
      msg: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};

//_________Log in_________

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.send({ msg: "Email did not match" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET
      );
      user.refreshToken = refreshToken;
      await user.save();
      return res.send({ msg: "Logged In", user, accessToken });
    } else {
      return res.send({ msg: "Password did not match" });
    }
  } catch (error) {
    return res.send({ msg: error.message });
  }
};

//_________Refresh token_________

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.send({
      msg: "Access Denied! no refresh token",
    });
  }

  try {
    const user = await User.findOne({ refreshToken });

    if (!user) {
      res.send({
        msg: "Access Denied! User did not match",
      });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, userDecoded) => {
        if (err) {
          return res.send({
            msg: "Access Denied! Error in Verifying",
          });
        }

        const newAccessToken = jwt.sign(
          { id: user._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "12h" }
        );
        console.log(user);
        res.send({
          accessToken: newAccessToken,
        });
      }
    );
  } catch (error) {
    res.send({
      msg: error.message,
    });
  }
};

//_________USER by Id_________

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      res.send({
        msg: "USER Not Found",
      });
    }

    res.send({
      msg: "USER Found",
      user,
    });
  } catch (error) {
    res.send({
      msg: error,
    });
  }
};


//_________Edit User_________

const editProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user.id != userId) {
      return res.send({
        msg: "You can only Update Your Profile",
      });
    }

    let user = await User.findById(userId);

    const { firstName, lastName } = req.body;
    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }

    if (req.file) {
      const uploadImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_new_images",
      });

      user.profileImage = uploadImage.secure_url;
    }

    await user.save();

    res.send({
      msg: "Edited Successfully",
      user,
    });
  } catch (error) {
    res.send({
      msg: "Failed",
    });
  }
};



module.exports = { register, upload, login, refreshToken, getUserById, editProfile };