const { Router } = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const savedController = require("../controllers/savedController");

const router = Router();

router.get("/all", requireAuth, savedController.all);
router.post("/add", requireAuth, savedController.add);
router.post("/delete/:id", requireAuth, savedController.delete_by_id);

module.exports = router;
