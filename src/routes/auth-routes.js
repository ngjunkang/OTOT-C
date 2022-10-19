const router = require("express").Router();
const authController = require("../controller/authController");

// GET /
router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "welcome to auth routes",
  });
});

router.post("/login", authController.handleLogin);
router.post("/register", authController.handleRegister);
router.post("/logout", authController.handleLogout);
router.post("/refresh-token", authController.handleRefreshToken);

module.exports = router;
