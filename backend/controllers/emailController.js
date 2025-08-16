const UserVerification = require("../models/UserVerification");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Email transporter configuration
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_MAIL,
    pass: process.env.AUTH_PASS,
  },
});

// Verify email service
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Email service is ready to send messages");
  }
});

// Send verification email
const sendVerificationEmail = ({ _id, email }, res) => {
  const baseUrl = process.env.BACKEND_BASE_URL || "http://localhost:5000";
  const currentUrl = `${baseUrl}/api/auth/`;
  const uniqueString = uuidv4() + _id;

  const mailOptions = {
    from: process.env.AUTH_MAIL,
    to: email,
    subject: "Verify your email",
    html: `<p>Click the link below to verify your email:</p>
           <a href="${currentUrl}user/verify/${_id}/${uniqueString}">Verify</a>
`,
  };

  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashUniqueString) => {
      const newVerification = new UserVerification({
        userId: _id.toString(),
        uniqueString: hashUniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      });
      newVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              res.json({
                status: "PENDING",
                message: "Successfully sent verification email",
              });
            })
            .catch((error) => {
              console.log(error);
              res.json({ status: "FAILED" });
            });
        })
        .catch(() => {
          res.json({
            status: "FAILED",
            message: "Couldn't save verification email data",
          });
        });
    })
    .catch(() => {
      res.json({
        status: "FAILED",
        message: "An error occur while hashing data",
      });
    });
};

// Resend verification email
exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const User = require("../models/User");
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.verified)
      return res
        .status(400)
        .json({ message: "Your email is already verified" });

    sendVerificationEmail(user, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify email handler
exports.verifyEmail = async (req, res) => {
  const { userId, uniqueString } = req.params;
  try {
    const record = await UserVerification.findOne({
      userId: userId.toString(),
    });
    if (!record) {
      const message =
        "Account record doesn't exist or has already been verified";
      return res.redirect(
        `/api/auth/user/verified?error=true&message=${encodeURIComponent(
          message
        )}`
      );
    }

    if (record.expiresAt < Date.now()) {
      await UserVerification.deleteOne({ userId: userId.toString() });
      const message =
        "Verification link has expired. Please sign up again or request a new verification email.";
      return res.redirect(
        `/api/auth/user/verified?error=true&message=${encodeURIComponent(
          message
        )}`
      );
    }

    const isValid = await bcrypt.compare(uniqueString, record.uniqueString);
    if (!isValid) {
      const message =
        "Invalid verification details. Please use the correct link.";
      return res.redirect(
        `/api/auth/user/verified?error=true&message=${encodeURIComponent(
          message
        )}`
      );
    }

    const User = require("../models/User");
    await User.updateOne({ _id: userId }, { $set: { verified: true } });
    await UserVerification.deleteOne({ userId: userId.toString() });
    return res.redirect(`/api/auth/user/verified`);
  } catch (error) {
    console.log(error);
    const message = "An error occurred during email verification";
    return res.redirect(
      `/api/auth/user/verified?error=true&message=${encodeURIComponent(
        message
      )}`
    );
  }
};

// Verified page route
exports.verifiedPage = (req, res) => {
  const path = require("path");
  res.sendFile(path.join(__dirname, "../views/verified.html"));
};

// Export sendVerificationEmail for use in authController
module.exports.sendVerificationEmail = sendVerificationEmail;
