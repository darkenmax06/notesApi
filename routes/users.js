import { Router } from "express"
import UserController from "../controllers/user.js"
import createUserValidator from "../middleware/createUserValidator.js"
import { updatePasswordValidate } from "../middleware/updatePasswordValidate.js"

function userRoutes ({userModel}){
  const router = Router()
  const userController = new UserController(userModel)

  router.get("/", userController.getAll)
  router.get("/:userId", userController.getById)
  router.post("/",createUserValidator, userController.create)
  router.patch("/:userId",updatePasswordValidate, userController.update)
  router.delete("/:userId", userController.delete)

  return router
}

export default userRoutes