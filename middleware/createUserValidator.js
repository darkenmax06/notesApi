import z from "zod"


// aqui estoy creando la validacion con zod
const userSchema = z.object({
  name: z.string().min(2).max(256),
  gmail: z.string().min(15).max(256).email(),
  password: z.string().min(8).max(50)
})

function createUserValidator (req,res,next){
  const result =  userSchema.safeParse(req.body)
  if (result.error){
    next({
      name: result.error.issues[0].code,
      data: result.error.issues[0]
    })
  }

  next()
}

export default createUserValidator 