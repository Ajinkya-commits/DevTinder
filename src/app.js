const express = require("express");
const { adminauth, userAuth } = require("./middleware/auth");
const User = require("./models/user");
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/database");
const user = require("./models/user");

app.use(express.json());
app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send("User added successfully");
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/feed", async (req, res) => {
  try {
    const allUsers = await user.find({});
    res.status(200).send(allUsers);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

app.get("/api/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("error while fetching the user");
  }
});

app.delete("/api/user", async (req, res) => {
  const id = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) res.status(404).send("cant delete user , user not found");
    else res.send("user deleted successfully");
  } catch (error) {
    res.status(500).send("error while deleting the user");
  }
});

app.patch("/api/user", async (req, res) => {
  const id = req.body.userId;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
    });
    res.send({ updatedUser, msg: "user updated successfully" });
  } catch (err) {
    res.status(500).send("Update failed");
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully"),
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
  })
  .catch((err) => console.error("Database connection failed:", err));
