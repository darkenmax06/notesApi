

class ColorModel{
  constructor (connection){
    this.connection = connection
  }

  getAll = async ()=>{
    const [result ] = await this.connection.query(
      `SELECT * FROM colorData`
    )

    return result
  }
}

export { ColorModel }
