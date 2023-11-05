

class NotesModel {
  constructor (connection){
    this.connection = connection
  }

  getAll = async ({userId}) =>{
    const [[{isValidUUID}]] = await this.connection.query("SELECT IS_UUID(?) isValidUUID" ,[userId])
    if (!isValidUUID) throw {name: "INVALID_ID"}

    try{
      const [result] = await this.connection.query(
        `SELECT BIN_TO_UUID(noteId) noteId, content, createAt, nombre, codigo, colorId, BIN_TO_UUID(userId) userId  FROM notes n 
        INNER JOIN colorData cd ON cd.colorId = n.colorData AND userId = UUID_TO_BIN(?)`,
        [userId]
      )
      return result
    }catch(err){
      throw err
    }
  }

  create = async({content,code,createAt,userId}) => {

    const [[{isValidUUID}]] = await this.connection.query("SELECT IS_UUID(?) isValidUUID" ,[userId])
    console.log(isValidUUID)
    if (!isValidUUID) throw {name: "INVALID_ID"}

    const [[{noteId}]] = await this.connection.query("SELECT UUID() noteId")

    const [[{colorId}]] = await this.connection.query(
      `SELECT * FROM colorData WHERE codigo = ?`,
      [code]
    )

    const [result] = await this.connection.query(
      `INSERT INTO notes (content,createAt, colorData, noteId, userId)
      VALUES (?,?,?,UUID_TO_BIN(?),UUID_TO_BIN(?))`,
      [content,createAt,colorId,noteId,userId]
    )

    const [[note]] = await this.connection.query(
      `SELECT BIN_TO_UUID(noteId) noteId, content, createAt, nombre, codigo, BIN_TO_UUID(userId) userId FROM notes n
      INNER JOIN colorData cd ON cd.colorId = n.colorData AND n.noteId = UUID_TO_BIN(?) `,
      [noteId]
    )

    return note
  }

  update = async({content,noteId})=>{
    const [[{isValidUUID}]] = await this.connection.query("SELECT IS_UUID(?) isValidUUID" ,[noteId])
    console.log(isValidUUID)
    if (!isValidUUID) throw {name: "INVALID_ID"}

    const [result] = await this.connection.query(
      `UPDATE notes SET content= ? WHERE noteId = UUID_TO_BIN(?) `,
      [content, noteId]
    )

    if (result.affectedRows < 1) throw {name: "INVALID_ID"}

    const [[note]] = await this.connection.query(
      `SELECT BIN_TO_UUID(noteId) noteId, content, createAt, nombre, codigo FROM notes n
      INNER JOIN colorData cd ON cd.colorId = n.colorData AND n.noteId = UUID_TO_BIN(?) `,
      [noteId]
    )

    return note
  }

  delete = async({noteId})=>{
    const [[{isValidUUID}]] = await this.connection.query("SELECT IS_UUID(?) isValidUUID" ,[noteId])
    console.log(isValidUUID)
    if (!isValidUUID) throw {name: "INVALID_ID"}

    const [result] = await this.connection.query(
      `DELETE FROM notes WHERE noteId = UUID_TO_BIN(?)`,
      [noteId]
    )

    console.log(result)

    if (result.affectedRows < 1)throw {name: "INVALID_ID"}

    return null
  }
}

export default NotesModel