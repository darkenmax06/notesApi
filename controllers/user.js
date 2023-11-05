
class UserController {
  constructor (userModel){
    this.userModel = userModel
  }

  getAll = async (req,res,next) => {
    try{
      const result = await this.userModel.getAll()
      res.json(result)
    }catch(err){
      next(err)
    }
  }

  getById = async (req,res,next) =>{
    const {userId} = req.params
    try{
      const result = await this.userModel.getById({userId})
      res.json(result)
    }catch(err){
      next(err)
    }
  }

  create = async (req,res,next) =>{
    const {name, gmail, password} = req.body

    try{
      const newUser = await this.userModel.create({
        name, 
        gmail,
        password
      })

      res.json(newUser)
    }catch(err){
      if (err.code){
        next({
          name: err.code,
          data: err
        })
      }
      next(err)
    }
  }

  update = async (req,res,next) => {
    const {oldPassword, newPassword} = req.body
    const {userId} = req.params

    try{
      const updatedUser = await this.userModel.update({oldPassword, newPassword,userId})
      res.status(204).send()
    }catch(err){
      next(err)
    }
  }

  delete = async (req,res,next) => {
    const {userId} = req.params

    try{
      await this.userModel.delete({userId})
      res.status(204).send()
    }catch(err){
      next(err)
    }
  }
}

export default UserController