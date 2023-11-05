import { z } from "zod";

const noteSchema = z.object({
  content: z.string().min(2).max(300),
  createAt: z.string(),
  colorData: z.object({
    code: z.string()
  })
})

function validateNote (req,res,next){
  const result =  noteSchema.safeParse(req.body)
  if (result.error){
    next({
      name: result.error.issues[0].code,
      data: result.error.issues[0]
    })
  }

  next()
}

export default validateNote