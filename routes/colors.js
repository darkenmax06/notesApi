import { Router } from "express";
import { ColorsController } from "../controllers/colors.js";


function colorRoute ({colorModel}){
  const router = Router()
  const colorsController = new ColorsController(colorModel)

  router.get("/", colorsController.getAll)

  return router
}

export { colorRoute };
