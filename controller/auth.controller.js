import { Login, Logout } from "../service/auth.service.js";

export const LoginUser = async (req, res) => {
  try {
    const { email, userName, password } = req.body;
    const loginIdentifier = email || userName;

    console.log("📥 Request Body:", req.body);

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Username and password are required",
      });
    }

    const login = await Login({ email: loginIdentifier, password });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      ...login,
    });

  } catch (error) {
    console.log("❌ Login Error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
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