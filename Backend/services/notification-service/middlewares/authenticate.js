import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Token missing" });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = payload; // attach decoded payload to req.user
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(401).json({ message: "Invalid access token" });
  }
};

export default authenticate;
