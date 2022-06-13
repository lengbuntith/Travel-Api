const { Router } = require("express");
const router = Router();
const suggestionController = require("../controllers/suggestionController");
const { route } = require("./authRoute");

router.post("/create",suggestionController.create)
router.get("/all",suggestionController.get_all)
router.get("/get/:id",suggestionController.get_id)
router.post("/update/:id", suggestionController.update_suggestion)
router.delete("/delete/:id",suggestionController.delete_suggestion)
module.exports = router 