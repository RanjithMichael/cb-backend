import jwt from "jsonwebtoken";

const auth = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Malformed authorization header" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Role-based access check
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ msg: "Forbidden: insufficient role" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ msg: "Invalid or expired token" });
    }
  };
};

export default auth;

