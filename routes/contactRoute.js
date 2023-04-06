const { Router } = require("express");
const contactController = require("../controllers/contactController");

const {
  requireAuth,
  checkUser,
  requireAuthAdmin,
} = require("../middleware/authMiddleware");

const router = Router();

router.post("/", requireAuth, contactController.createContact);
router.get("/", requireAuth, contactController.getAllContacts);
router.get("/:id", requireAuth, contactController.getContactById);
router.post("/update/:id", requireAuth, contactController.updateContact);

module.exports = router;
