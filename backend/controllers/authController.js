const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("./emailController");
require("dotenv").config();

// Register (Sign Up)
exports.register = async (req, res) => {
  const { email, password, name, phone } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      verified: false,
    });
    await user.save().then((result) => {
      sendVerificationEmail(result, res);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login (Sign In)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    //     if (!user.verified) {
    //       return res
    //         .status(400)
    //         .json({ status: "Failed", message: "Email haven't verified yet" });
    //     }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      token,
      user: { email: user.email, name: user.name, phone: user.phone },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
