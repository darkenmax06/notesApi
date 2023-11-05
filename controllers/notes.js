
class NotesController {
  constructor (notesModel){
    this.notesModel = notesModel
  }

  getAll = async (req,res) => {
    const {userId} = req.body.user
    const notes = await this.notesModel.getAll({userId})
    res.json(notes)
  }

  create = async(req,res,next) =>{
    const {content,createAt,colorData :{code}, user: {userId}} = req.body

    const newNote = await this.notesModel.create(
      {content, code,createAt, userId}
    )

    res.json(newNote)
  }

  update = async(req,res,next)=> {
    const {content} = req.body
    const {noteId} = req.params

    try{
      const result = await this.notesModel.update({
        noteId, content
      })
      res.json(result)
    }catch(err){
      next(err)
    }
  }

  delete = async(req,res,next)=> {
    const {noteId} = req.params
    try{
      const result = await this.notesModel.delete({noteId})
      res.status(204).end()
    }catch(err){
      next(err)
    }
  }
}

export default NotesController