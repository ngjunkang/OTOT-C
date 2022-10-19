const router = require("express").Router();

const contactController = require("../controller/contactController");
const verifyRoles = require("../middlewares/verifyRoles");
const { ROLES } = require("../config/roles");

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Welcome to OTOT Task B1-B2 crafted with love!",
  });
});

// GET, POST /contacts
router
  .route("/contacts")
  .get(contactController.index)
  .post(verifyRoles(ROLES.EDITOR, ROLES.ADMIN), contactController.new);

// GET, PATCH, PUT, DELETE /contacts/:contact_id
router
  .route("/contacts/:contact_id")
  .get(contactController.view)
  .patch(verifyRoles(ROLES.EDITOR, ROLES.ADMIN), contactController.update)
  .put(verifyRoles(ROLES.EDITOR, ROLES.ADMIN), contactController.update)
  .delete(verifyRoles(ROLES.EDITOR, ROLES.ADMIN), contactController.delete);

module.exports = router;
