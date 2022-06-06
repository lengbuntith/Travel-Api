const { Router } = require("express");
const itemController = require("../controllers/itemController");
const { requireAuthAdmin } = require("../middleware/authMiddleware");

const router = Router();

router.get("/all", itemController.get);
router.get("/filter", itemController.filter);
router.post("/create", requireAuthAdmin, itemController.create);
router.post("/update/:id", requireAuthAdmin, itemController.update);
router.post("/delete/:id", requireAuthAdmin, itemController.delete_by_id);
router.get("/:id", itemController.by_id);

module.exports = router;
