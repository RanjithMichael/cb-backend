import jwt from "jsonwebtoken";

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

export default generateToken;

