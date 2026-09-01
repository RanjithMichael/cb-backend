import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create new user (password hashing handled in User.js pre-save hook)
    const user = await User.create({ username, email, password });

    if (user) {
      res.status(201).json({
        msg: "User registered successfully",
        token: generateToken(user),
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      res.status(400).json({ msg: "Invalid user data" });
    }
  } catch (err) {
    console.error("Register error message:", err.message);
    console.error("Register error stack:", err.stack);
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log("matchPassword type:", typeof user.matchPassword);
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Debug logs to trace issues
    console.log("User found:", user.email);
    console.log("Password entered:", password);
    console.log("Has matchPassword?", typeof user.matchPassword);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    res.json({
      msg: "Login successful",
      token: generateToken(user),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error message:", err.message);
    console.error("Login error stack:", err.stack);
    res.status(500).json({ msg: "Server error" });
  }
};
