import "dotenv/config"
import express, { json } from "express"
import morgan from "morgan"
import errorHandling from "./middleware/errorHandler.js"
import { colorRoute } from "./routes/colors.js"
import loginRoute from "./routes/login.js"
import notesRoutes from "./routes/notes.js"
import userRoutes from "./routes/users.js"

function server ({notesModel, userModel,colorModel}){
  const app = express()

  // MIDLEWARES
  app.use(json())
  app.use(morgan("dev"))

  // <= ROUTES =>
  app.use("/api/colors", colorRoute({colorModel}))
  app.use("/api/login", loginRoute({userModel}))
  app.use("/api/users",  userRoutes({userModel}))
  app.use("/api/notes",  notesRoutes({notesModel,userModel}))

  // <= ERROR ROUTES =>
  app.use("*", (req,res)=> {
    res.status(404).json({error: "page not found"})
  })
  app.use(errorHandling)

  // <= SERVER MANAGMENT =>
  const port = process.env.PORT ?? 3001
  app.listen(port, ()=>{
    console.log(`server on port ${port} http://localhost:${port}`)
  })
}

export default server