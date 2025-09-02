const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const profileRouter = require("./routes/profile");
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully"),
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
  })
  .catch((err) => console.error("Database connection failed:", err));
