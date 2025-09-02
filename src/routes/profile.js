const express = require("express");
const { userAuth } = require("../middleware/auth");
const profileRouter = express.Router();
const cors = require("cors");

// ✅ allow frontend requests
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

// ✅ allow about & photoUrl in updates
function validateEditProfileData(req) {
  const allowedUpdates = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "about",
    "photoUrl",
  ];
  const updates = Object.keys(req.body);
  return updates.every((field) => allowedUpdates.includes(field));
}

// -------------------- ROUTES --------------------

// View Profile
profileRouter.get(
  "/profile/view",
  cors(corsOptions),
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(400).send("Error fetching the user: " + error.message);
    }
  }
);

// Edit Profile
profileRouter.patch(
  "/profile/edit",
  cors(corsOptions),
  userAuth,
  async (req, res) => {
    try {
      console.log("Incoming body =>", req.body); // ✅ Debugging

      if (!validateEditProfileData(req)) {
        return res.status(400).json({ error: "Invalid Edit Request" });
      }

      const loggedInUser = req.user;

      Object.keys(req.body).forEach((key) => {
        loggedInUser[key] = req.body[key];
      });

      await loggedInUser.save();

      res.json({
        message: `${loggedInUser.firstName}, your profile was updated successfully`,
        data: loggedInUser,
      });
    } catch (error) {
      console.error("Error editing profile:", error);
      res.status(400).send("Error: " + error.message);
    }
  }
);

// Change Password
profileRouter.post(
  "/profile/password",
  cors(corsOptions),
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const { currentPassword, newPassword } = req.body;

      const isMatch = await user.validatePassword(currentPassword);
      if (!isMatch) return res.status(400).send("Incorrect current password");

      user.password = newPassword;
      await user.save();

      res.send("Password changed successfully");
    } catch (error) {
      res.status(500).send("Error changing password: " + error.message);
    }
  }
);

module.exports = profileRouter;
