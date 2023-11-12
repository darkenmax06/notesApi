import "dotenv/config"
import express, { json } from "express"
import morgan from "morgan"
import path from 'path'
import errorHandling from "./middleware/errorHandler.js"
import { colorRoute } from "./routes/colors.js"
import loginRoute from "./routes/login.js"
import notesRoutes from "./routes/notes.js"
import userRoutes from "./routes/users.js"

function server ({notesModel, userModel,colorModel}){
  const app = express()
  const dir = process.env.PWD

  // MIDLEWARES
  app.use(json())
  app.use(morgan("dev"))


  app.use(express.static( path.join(dir, './dist') ))

  // <= ROUTES =>
  app.use("/api/colors", colorRoute({colorModel}))
  app.use("/api/login", loginRoute({userModel}))
  app.use("/api/users",  userRoutes({userModel}))
  app.use("/api/notes",  notesRoutes({notesModel,userModel}))

  app.use("*",  (req,res) => res.sendFile(  path.join(dir, './dist/index.html') ))

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