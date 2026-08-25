import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },   // payload
    process.env.JWT_SECRET,              // secret key
    { expiresIn: "30d" }                  // options
  );
};

export default generateToken;
