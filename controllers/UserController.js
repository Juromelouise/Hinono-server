const User = require("../models/User");
const sendToken = require("../utils/jwt");
const { uploadSingle } = require("../utils/Cloudinary");
const path = require("path");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  try {
    let avatar;
    if (req.file) {
      avatar = await uploadSingle(req.file.path, "Avatar");
    } else {
      return res.status(400).json({ message: "Avatar is required" });
    }

    req.body.avatar = avatar;

    const user = await User.create(req.body);
    sendToken(user, 200, res);
  } catch (error) {
    console.error("Error in Creating user: ", error);
    res.status(500).json({ message: "Error in Register User" });
  }
};

exports.logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (req.file) {
      const avatar = await uploadSingle(req.file.path, "Avatar");
      req.body.avatar = avatar;
      const user = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
      });
      res.status(200).json({
        success: true,
        user,
      });
    } else {
      const user = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
      });
      res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (e) {
    console.error("Error in Updating Profile: ", e);
    res.status(500).json({ message: "Error in Updating Profile" });
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please enter email & password" });
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ error: "Invalid Email or Password" });
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return res.status(401).json({ error: "Invalid Email or Password" });
  }
  sendToken(user, 200, res);
};

exports.mobile = async (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;
  const avatar = await uploadSingle(req.body.picture, "Avatar");

  const body = { name, email, avatar };

  try {
    const loginUser = await User.findOne({ email });

    if (loginUser) {
      sendToken(loginUser, 200, res);
    } else {
      const randomPassword = Math.random().toString(36).slice(-8);
      console.log(randomPassword);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      body.password = hashedPassword;
      const newUser = await User.create(body);

      if (!newUser) {
        return res.status(500).json({
          status: false,
          message: "User not created",
        });
      }
      sendToken(newUser, 200, res);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.address.push(req.body.address);
    await user.save();
    res.status(200).json({
      message: "Address added successfully",
      newAddress: req.body.address,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Error adding address" });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      addresses: user.address,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Error fetching addresses" });
  }
};

exports.updatePushToken = async (req, res) => {
  try {
    const { expoPushToken } = req.body;
    if (!expoPushToken) {
      return res.status(400).json({ message: "Push token is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { pushToken: expoPushToken },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Push token updated successfully",
      pushToken: user.pushToken,
    });
  } catch (error) {
    console.error("Error updating push token:", error);
    res.status(500).json({ message: "Error updating push token" });
  }
};
