import jwt from "jsonwebtoken";

const auth = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      // Check for Authorization header
      if (!authHeader) {
        return res.status(401).json({ msg: "No token provided" });
      }

      // Ensure proper format: "Bearer <token>"
      const parts = authHeader.split(" ");
      if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ msg: "Malformed authorization header" });
      }

      const token = parts[1];
      if (!token) {
        return res.status(401).json({ msg: "Token missing" });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Role-based access check
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ msg: "Forbidden: insufficient role" });
      }

      next();
    } catch (err) {
      console.error("JWT Error:", err.message);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ msg: "Token expired" });
      }
      return res.status(401).json({ msg: "Invalid or expired token" });
    }
  };
};

export default auth;
