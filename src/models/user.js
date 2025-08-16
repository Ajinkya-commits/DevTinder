const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email address:" + value);
        }
      },
    },
    password: {
      type: String,
    },
    about: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 10) {
          throw new Error("About must be at least 10 characters long.");
        }
      },
    },
    skills: {
      type: [String],
      default: undefined, 
      validate: {
        validator: function (value) {
          if (value === undefined) return true;
          if (!Array.isArray(value)) return false;
          if (value.length === 0)
            throw new Error("Skills must be a non-empty array.");
          if (value.length > 10)
            throw new Error("You can add up to 10 skills only.");
          for (let skill of value) {
            if (typeof skill !== "string" || skill.trim().length === 0) {
              throw new Error("Each skill must be a non-empty string.");
            }
          }
          return true;
        },
      },
    },

    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not a valid gender type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "thisisthe secretkey", {
    expiresIn: "7d",
  });

  return token;
};

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = mongoose.model("User", userSchema);
