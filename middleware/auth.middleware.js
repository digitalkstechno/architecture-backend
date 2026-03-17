
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader?.startsWith('Bearer ')
      ? tokenHeader.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: 'No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid session' });
    }
    req.user = user;
    req.tenantId = decoded.tenantId;

    next();
  } catch (err) {
    console.error('protect error:', err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};