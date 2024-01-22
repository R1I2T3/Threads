import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(404).json({ message: "Un authorized access" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.userId).select("-password");
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default protectRoute;
