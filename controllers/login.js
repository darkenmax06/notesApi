
class LoginContoller {
  constructor (userModel){
    this.userModel = userModel
  }

  login = async (req,res,next) => {
    const {gmail, password} = req.body

    try{
      const userInfo = await this.userModel.login({gmail,password})
      res.json(userInfo)
    }catch(err){
      next(err)
    }
  }
}

export default LoginContoller