import "dotenv/config.js"
import mysql from "mysql2/promise"
import server from "./index.js"
import { ColorModel } from "./models/colors.js"
import NotesModel from "./models/notes.js"
import UserModel from "./models/users.js"

const {
  NODE_ENV,
  DBHOST,
  DBUSER, 
  DBPASSWORD, 
  DBPORT, 
  DATABASE,
  DATABASE_URL
} = process.env



let config = null

if(NODE_ENV == "production"){
  config = DATABASE_URL
}else {
  config = {
    host: DBHOST,
    user: DBUSER,
    password: DBPASSWORD,
    port: DBPORT,
    database: DATABASE
  }
}


let connection = null

try{
  connection = await mysql.createConnection(config)
  console.log("database connected")
  console.log(`entorno: ${NODE_ENV}`)
}catch(err){
  console.log(err)
}

const userModel = new UserModel(connection)
const notesModel = new NotesModel(connection)
const colorModel = new ColorModel(connection)

server({notesModel,userModel,colorModel})