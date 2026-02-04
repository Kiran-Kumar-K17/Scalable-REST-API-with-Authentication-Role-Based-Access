import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

async function protect(req, res, next) {
  try {
    let token;

    // 1) Check if token is in the headers (Authorization: Bearer <token>)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "You are not logged in! Please login to get access.",
      });
    }

    // 2) Verification of token
    // We use promisify to make jwt.verify work with async/await
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        message: "The user belonging to this token no longer exists.",
      });
    }

    // 4) GRANT ACCESS TO PROTECTED ROUTE
    // We put the user on the 'req' object so other functions can use it
    req.user = currentUser;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid token. Please login again." });
  }
}

async function registerUser(req, res) {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role || "user",
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    // 2. Hide password from output
    newUser.password = undefined;

    res.status(201).json({
      success: true,
      token,
      message: "User created successfully!",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Check if email and password were provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // 2. Find user & explicitly ask for the password (since we hid it in the Schema)
    const user = await User.findOne({ email }).select("+password");

    // 3. Check if user exists && password is correct
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    // 4. If everything is OK, send a fresh token
    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      message: "Logged in successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "No user found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully", // 204 means 'No Content' after a successful delete
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
export { registerUser, loginUser, protect, deleteUser, restrictTo };
