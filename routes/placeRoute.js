const { Router } = require("express");
const placeController = require("../controllers/placeController");
const { requireAuthAdmin } = require("../middleware/authMiddleware");
const router = Router();

router.get("/all", placeController.get_all);
router.post("/create", requireAuthAdmin, placeController.create);
router.post("/update/:id", requireAuthAdmin, placeController.update_by_id);
router.post("/delete/:id", requireAuthAdmin, placeController.delete_by_id);
router.get("/:id", placeController.get_id);

module.exports = router;
