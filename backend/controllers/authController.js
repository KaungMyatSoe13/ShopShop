const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("./emailController");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

require("dotenv").config();

// Google OAuth Login
exports.googleAuth = async (req, res) => {
  const { credential } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Check if user already exists by email
    let user = await User.findOne({ email });

    if (user) {
      // User exists - update their auth method if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.authMethod = user.authMethod === "manual" ? "both" : "google";
        await user.save();
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.json({
        token,
        user: { email: user.email, name: user.name, phone: user.phone },
        message: "Login successful",
      });
    } else {
      // Create new user with Google auth
      user = new User({
        email,
        name,
        password: await bcrypt.hash(googleId, 10), // Use Google ID as password
        verified: true, // Google accounts are pre-verified
        googleId,
        authMethod: "google",
      });

      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.json({
        token,
        user: { email: user.email, name: user.name, phone: user.phone },
        message: "Account created and login successful",
      });
    }
  } catch (error) {
    console.error("Google auth error:", error);
    res
      .status(400)
      .json({ message: "Google authentication failed", error: error.message });
  }
};

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
      displayName: name,
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
