const {Router } = require("express");
const router = Router()
const eventController = require("../controllers/eventController")

router.post("/create",eventController.create)
router.get("/all",eventController.get_all)
router.get("/get/:id",eventController.get_id)
router.delete("/delete/:id",eventController.delete_event)
router.put("/update/:id",eventController.update_event)
module.exports = router
