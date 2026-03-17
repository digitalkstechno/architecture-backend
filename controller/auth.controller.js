import { Login, Logout } from "../service/auth.service.js";

export const LoginUser = async (req, res) => {
  try {
    const login = await Login(req.body);
    return res.status(200).json(login);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


export const LogoutUser = async (req, res) => {
  try {
  
    await Logout({
      userId: req.user._id,   // 🔐 from protect middleware
    });

    return res.status(200).json({
      message: "Logged out from this device",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};