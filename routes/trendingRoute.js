const { Router } = require("express");
const router = Router();
const trendingController = require("../controllers/trendingController");
const { requireAuthAdmin } = require("../middleware/authMiddleware");

router.post("/create", requireAuthAdmin, trendingController.create);
router.delete("/delete/:id", requireAuthAdmin, trendingController.delete_by_id);
router.put("/update/:id", requireAuthAdmin, trendingController.update_by_id);
router.get("/get/all", trendingController.get_all);

module.exports = router;