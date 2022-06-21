const { Router } = require("express");
const router = Router();
const likeController = require("../controllers/likeController");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/add", requireAuth, likeController.create);
router.get("/me", requireAuth, likeController.get_by_user);

module.exports = router;