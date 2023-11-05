import { z } from "zod";


const loginSchema = z.object({
  gmail: z.string().min(15).max(256).email(),
  password: z.string().min(8).max(250)
})

function loginUserValidate (req,res,next){
  const result =  loginSchema.safeParse(req.body)
  if (result.error){
    next({
      name: result.error.issues[0].code,
      data: result.error.issues[0]
    })
  }
  next()
}

export { loginUserValidate };
