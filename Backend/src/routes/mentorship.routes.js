const { Router } = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const mentorshipController = require("../controllers/mentorship.controller")

const mentorshipRouter = Router()

mentorshipRouter.get("/mentors", authMiddleware.authUser, mentorshipController.getAllMentorsController)
mentorshipRouter.get("/recommendations", authMiddleware.authUser, mentorshipController.getRecommendedMentorsController)
mentorshipRouter.post("/requests", authMiddleware.authUser, mentorshipController.createMentorRequestController)
mentorshipRouter.get("/requests", authMiddleware.authUser, mentorshipController.getMyMentorRequestsController)
mentorshipRouter.patch("/requests/:requestId", authMiddleware.authUser, mentorshipController.updateMentorRequestStatusController)

module.exports = mentorshipRouter
