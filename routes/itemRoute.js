const { Router } = require("express");
const itemController = require("../controllers/itemController");
const { requireAuthAdmin } = require("../middleware/authMiddleware");
 
const router = Router();

router.get("/all", itemController.get);
router.get("/filter", itemController.filter);
router.post("/create", requireAuthAdmin, itemController.create);
router.post("/update/:id", requireAuthAdmin);
router.post("/delete/:id", requireAuthAdmin);
router.get("/:id", itemController.by_id);

module.exports = router;
