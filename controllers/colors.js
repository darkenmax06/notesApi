

class ColorsController {
  constructor (colorModel){
    this.colorModel = colorModel
  }

  getAll = async (req,res,next) =>{
    try{
      const colors = await this.colorModel.getAll()
      res.json(colors)
    }catch(err){
      next(err)
    }
  }
}

export { ColorsController }
