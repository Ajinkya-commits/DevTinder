const express = require("express");
const User = require("./models/user");
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/database");
const user = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error("Caught error:", err);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ errors: messages });
  }

  res.status(500).send("Internal Server Error");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login Successfully!!!.");
    } else {
      throw new Error(" Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("Error" + error.message);
  }
});

app.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);
    //encrypt the password

    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    //creating a new instance of the user model

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();
    res.status(201).send("User added successfully");
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(400).send("Error saving the user:" + error.message);
  }
});

app.get("/api/feed", async (req, res, next) => {
  try {
    const allUsers = await user.find({});
    res.status(200).send(allUsers);
  } catch (error) {
    next(error);
  }
});

app.get("/api/user", async (req, res, next) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    next(error);
  }
});

app.delete("/api/user", async (req, res, next) => {
  const id = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) res.status(404).send("cant delete user , user not found");
    else res.send("user deleted successfully");
  } catch (error) {
    next(error);
  }
});

app.patch("/api/user", async (req, res, next) => {
  const id = req.body.userId;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
    });
    res.send({ updatedUser, msg: "user updated successfully" });
  } catch (error) {
    next(error);
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
