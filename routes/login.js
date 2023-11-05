import { Router } from "express"
import LoginContoller from "../controllers/login.js"
import { loginUserValidate } from "../middleware/loginUserValidator.js"

function loginRoute ({userModel}){
  const router = Router()
  const loginController = new LoginContoller(userModel)

  router.post("/", loginUserValidate,loginController.login)

  return router
}

export default loginRoute