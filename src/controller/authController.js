const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../model/userModel");
const { ROLES } = require("../config/roles");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      status: "error",
      message: "Missing username/password!",
    });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found!",
    });
  }
  const isPasswordCorrect = await argon2.verify(user.password, password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      status: "error",
      message: "Wrong password!",
    });
  }

  const roleCodes = user.roles.map((role) => role.code);

  const accessToken = jwt.sign(
    {
      username: user.username,
      roles: roleCodes,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
  res.cookie("accessToken", accessToken, COOKIE_OPTIONS);

  res.status(200).json({
    status: "success",
    message: "Login successfully!",
  });
};

const handleRegister = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      status: "error",
      message: "Missing username/password!",
    });
  }
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    return res.status(400).json({
      status: "error",
      message: "User already exists!",
    });
  }
  const hashedPassword = await argon2.hash(password);
  const newUser = new User({
    username,
    password: hashedPassword,
    roles: [{ role: "USER", code: ROLES.USER }],
  });
  newUser.save((err) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: err,
      });
    }
    res.status(200).json({
      status: "success",
      message: "Register successfully!",
    });
  });
};

const handleLogout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(400).json({
      status: "error",
      message: "Missing refreshToken!",
    });
  }
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    return res.status(404).json({
      status: "error",
      message: "User not found!",
    });
  }
  user.refreshToken = "";
  await user.save();
  res.clearCookie("refreshToken", COOKIE_OPTIONS);
  res.clearCookie("accessToken", COOKIE_OPTIONS);
  res.status(200).json({
    status: "success",
    message: "Logout successfully!",
  });
};

const handleRefreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({
      status: "error",
      message: "Missing refreshToken!",
    });
  }
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    return res.status(403).json({
      status: "error",
      message: "User invalid!",
    });
  }
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        res.clearCookie("refreshToken", COOKIE_OPTIONS);
        return res.status(403).json({
          status: "error",
          message: "Invalid refreshToken!",
        });
      }
      const accessToken = jwt.sign(
        {
          username: user.username,
          roles: user.roles.map((role) => role.code),
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.cookie("accessToken", accessToken, COOKIE_OPTIONS);
      res.status(200).json({
        status: "success",
        message: "Refresh token successfully!",
      });
    }
  );
};

module.exports = {
  handleLogin,
  handleRegister,
  handleLogout,
  handleRefreshToken,
};
