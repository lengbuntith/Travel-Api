const { Router } = require("express");
const router = Router();
const commentSuggestController = require("../controllers/commentSuggestController");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/create", requireAuth, commentSuggestController.create);
router.get("/get/me", requireAuth, commentSuggestController.get_by_user);
router.delete(
    "/delete/:id",
    requireAuth,
    commentSuggestController.delete_suggest
);

module.exports = router;