const router = require("express").Router();
const contactController = require("./controller/contactController");

// GET /
router.get("/", function (req, res) {
  res.json({
    status: "API Its Working",
    message: "Welcome to OTOT Task B1-B2 crafted with love!",
  });
});

// GET, POST /contacts
router
  .route("/contacts")
  .get(contactController.index)
  .post(contactController.new);

// GET, PATCH, PUT, DELETE /contacts/:contact_id
router
  .route("/contacts/:contact_id")
  .get(contactController.view)
  .patch(contactController.update)
  .put(contactController.update)
  .delete(contactController.delete);

module.exports = router;
