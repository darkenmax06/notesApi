import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

class UserModel {
  constructor (connection){
    this.connection = connection,
    this.saltRounds = 10
  }

  getAll = async () =>{
    const [users] = await this.connection.query("SELECT BIN_TO_UUID(userId) id,name, gmail FROM users")
    return users
  }

  getById = async ({userId}) =>{
    // aqui accedemos a la primera posicion de la tupla [  [{isValid}]  ,[otro valor] ] 
    // y luego accedemos a la primera posicion [ { isValid }]
    const [  [  {isValid}  ]  ] = await this.connection.query("SELECT IS_UUID(?) isValid",[userId])
    if (!isValid) throw {name: "INVALID_ID"}

    // aqui se pone UUID_TO_BIN porque lo que se compara es la id del usuario
    // que en la base de datos es un binario con la id que llega que es uuid
    // ya que el que esta en la base de datos es un binario
    const [[result]] = await this.connection.query(
      "SELECT BIN_TO_UUID(userId) userId, name, gmail FROM users WHERE userId = UUID_TO_BIN(?)",
      [userId])

    if (result == null) throw {name: "INVALID_ID"}

    return result 
  }

  create = async ({name, gmail, password}) =>{
    const parsedPassword = await bcrypt.hash(password, this.saltRounds)
    // esto devuelve un array de 2 posiciones [ [{noteId}],[] ]
    // accedemos a la primera posicion [{noteId}]
    // y despues a la prop de note Id {noteId} = [[{noteId}]]
    const [[{userId}]] = await this.connection.query(
      `SELECT UUID() userId`
    )

    await this.connection.query(
      `INSERT INTO users (name,gmail,password,userId)
      VALUES (?,?,?,UUID_TO_BIN(?))`,
      [name,gmail,parsedPassword, userId]
    )

    console.log("A")
    const [[result]] = await this.connection.query(
      `SELECT BIN_TO_UUID(userId) userId, name, gmail FROM users WHERE userId = UUID_TO_BIN(?)`,
      [userId]
    )

    const token = jwt.sign({
      userId: result.userId
    },process.env.SECRET_KEY)

    const {userId: ui, ...restOfUser} = result
    console.log(restOfUser)

    return {
      ...restOfUser,
      token
    }
  }

  update = async ({oldPassword,newPassword, userId}) => {
    const [[{isValidUUID}]] = await this.connection.query(`SELECT IS_UUID(?) isValidUUID`,[userId])
    if (!isValidUUID) throw {name: "INVALID_ID"}
    // Se hace el [[ user ]] ya que es una tuṕla [ [user], [other things] ]
    //y asi optenemos la primera posicion del array padre y del hijo
    const [[user]] = await this.connection.query(
      `SELECT BIN_TO_UUID(userId) userId, name, gmail, password FROM users WHERE userId = UUID_TO_BIN(?)`,
      [userId])

    if (user == null) throw {name: "INVALID_ID"}
      
    const isSamePassword = await bcrypt.compare(oldPassword, user.password)
    console.log(isSamePassword)
    if (!isSamePassword) throw {name: "INVALID_PASSWORD"}

    const passwordHash = await bcrypt.hash(newPassword, this.saltRounds)

    await this.connection.query(
      `UPDATE users SET password = ? WHERE userId = UUID_TO_BIN(?)`,
      [passwordHash, userId]
    )

    return null
   }

   delete = async ({userId})=>{
    // la eplicacion esta en el getById arriba
    const [  [  {isValid}  ]  ] = await this.connection.query("SELECT IS_UUID(?) isValid",[userId])
    if (!isValid) throw {name: "INVALID_ID"}

    await this.connection.query("DELETE FROM users WHERE userId = UUID_TO_BIN(?)", [userId])
    return null
   }

   login = async ({gmail,password})=>{
    const [[result]] = await this.connection.query(
      "SELECT BIN_TO_UUID(userId) userId, name, gmail, password FROM users WHERE gmail = ?",
      [gmail])

      console.log(result)

    const isCorrectPassword = result != null
    ? await bcrypt.compare(password, result.password)
    : false

    if (!isCorrectPassword) throw {name: "BAD_LOGIN"}

    const token = jwt.sign({
      userId: result.userId
    },process.env.SECRET_KEY)

    const {password: pwd, userId, ...restOfUser} = result

    return {
      ...restOfUser,
      token
    }
   }
}

export default UserModel