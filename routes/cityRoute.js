const { Router } = require("express");
const cityController = require("../controllers/cityController");
const { requireAuthAdmin } = require("../middleware/authMiddleware");

const router = Router();

router.get("/all", cityController.get_all);
router.post("/create", requireAuthAdmin, cityController.create_new);
router.post("/update/:id");
router.post("/delete/:id");

module.exports = router;
