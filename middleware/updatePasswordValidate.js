import { z } from "zod";


const passwordSchema = z.object({
  oldPassword: z.string().min(8).max(50),
  newPassword: z.string().min(8).max(50)
})

function updatePasswordValidate (req,res,next){
  const result = passwordSchema.safeParse(req.body)
  if (result.error){
    next({
      name: result.error.issues[0].code,
      data: result.error.issues[0]
    })
  } 

  next()
}

export {
  updatePasswordValidate
};
