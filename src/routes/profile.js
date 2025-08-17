const express = require("express");
const { userAuth } = require("../middleware/auth");
const profileRouter = express.Router();
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(400).send("Error saving the user:" + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} , your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error" + error.message);
  }
});

profileRouter.post("/profile/password", userAuth, async (req, res) => {
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
});

module.exports = profileRouter;
