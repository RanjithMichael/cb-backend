import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Register
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();

    // log to confirm password is hashed
    console.log("New user created:", user);

    res.status(201).json({ msg: "User registered successfully", user });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // ✅ use model method instead of bcrypt.compare directly
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
  if (err.code === 11000) {
    return res.status(400).json({ msg: "Username or email already exists" });
  }
  res.status(400).json({ msg: err.message });
}

};

// Profile
export const getProfile = async (req, res) => {
  try {
    // req.user is set by JWT middleware
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
