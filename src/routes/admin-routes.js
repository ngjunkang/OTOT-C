const router = require("express").Router();

const adminController = require("../controller/adminController");
const { ROLES } = require("../config/roles");
const verifyRoles = require("../middlewares/verifyRoles");

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "welcome to admin home",
  });
});

router.post(
  "/assign",
  verifyRoles(ROLES.ADMIN),
  adminController.handleAssignRole
);

module.exports = router;
