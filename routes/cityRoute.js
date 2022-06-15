const { Router } = require("express");
const cityController = require("../controllers/cityController");
const { requireAuthAdmin } = require("../middleware/authMiddleware");

const router = Router();

router.post("/create", requireAuthAdmin, cityController.create_new);
router.get("/all", cityController.get_all);
router.get("/detail/:id", cityController.by_id);
router.post("/update/:id", requireAuthAdmin, cityController.update_by_id);
router.post("/delete/:id", requireAuthAdmin, cityController.delete_by_id);

module.exports = router;