const { Router } = require("express");
const router = Router();
const likeController = require("../controllers/likeController");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/add", requireAuth, likeController.create);
router.get("/suggest/:id", likeController.get_by_suggestion);

module.exports = router;