import { Router } from "express"
import NotesController from "../controllers/notes.js"
import validateNote from "../middleware/createNoteValidation.js"
import { UserValidator } from "../middleware/userValidate.js"

function notesRoutes ({notesModel, userModel}){
  const router = Router()
  const notesController = new NotesController(notesModel)
  const userValidate = new UserValidator(userModel)

  router.get("/", userValidate.validate ,notesController.getAll)
  router.post("/", userValidate.validate,validateNote ,notesController.create)
  router.patch("/:noteId", userValidate.validate,notesController.update)
  router.delete("/:noteId", userValidate.validate,notesController.delete)

  return router
}

export default notesRoutes