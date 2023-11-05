import jwt from "jsonwebtoken"


class UserValidator {
  constructor (userModel){
    this.userModel = userModel
  }

  validate = async (req,res,next)=>{
    const {authorization} = req.headers

    let token = null
    if (authorization && authorization.toLowerCase().startsWith("bearer")){
      token = authorization.split(" ")[1]
    }

    console.log(token)

    let decodeToken = null
    try{
      decodeToken = jwt.verify(token, process.env.SECRET_KEY)
    }catch(err){
      next(err)
    }

    if (!decodeToken || !decodeToken.userId)next({name: "BAD_USER"})

    try{
      const user = await this.userModel.getById({userId: decodeToken.userId})
      req.body.user = user
      next()
    }catch(err){
      next(err)
    }
  }
}

export { UserValidator }
