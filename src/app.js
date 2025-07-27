const express = require("express");
const { adminauth, userAuth } = require("./middleware/auth");
const User = require("./models/user");
const app = express();
const PORT = process.env.PORT || 3000;

const connectDB = require("./config/database");

app.post("/api/adduser", async (req, res) => {
  const user = new User({
    firstName: "john",
    lastName: "doe",
    email: "johndoe@gmail.com",
    password: "password123",
    age: 30,
  });

  try {
    await user.save();
    res.status(201).send("User added successfully");
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send("Internal Server Error");
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
