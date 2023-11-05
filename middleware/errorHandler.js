

function errorHandling (err,req,res,next){
  const name = err.name
  console.log("ERROR NAME ----")
  console.log(name)
  console.log("ERROR: ----")
  console.log(err)

  const listOfErrors = {
    "INVALID_ID": ()=> res.status(400).json({error: "La id espesificada no es valida o el recurso ha sido eliminado"}),
    "INVALID_PASSWORD": ()=> res.status(400).json({error: "La contraseña proporcionada no es correcta"}) ,
    "BAD_LOGIN": ()=> res.status(400).json({error: "La contraseña o el correo proporcionado no son validos"}) ,

    // < == ZOD ERROR == >
    "invalid_type": ()=> {
      const {expected, received} = err.data
      const library = {
        "number": "numero",
        "string": "texto",
        "date": "fecha"
      }

      return res.status(400).json({error: `El tipo de dato proveido no es el esperado, se esperaba un ${library[expected]} y se recibio un ${library[received]}`})
    },
    "too_big":()=>{
      const {maximum,path} = err.data
      return res.status(400).json({error: `El maximo de caracteres debe ser de ${maximum} caracteres para el ${path[0]}`})
    } ,
    "too_small":()=>{
      const {minimum, path} = err.data
      return res.status(400).json({error: `El minimo de caracteres debe ser de ${minimum} caracteres para el ${path[0]}`})
    } ,
    "invalid_string":()=>{
      const {path} = err.data
      return res.status(400).json({error: `El ${path[0]} proporcionado es invalido`})
    } ,

    // < == MYSQL ERRORS == >
    "ER_DUP_ENTRY": ()=> res.status(400).json({error: "El gmail proporcionado ya esta en uso"}),

    // < == JSON WEB TOKEN ERRORS == >
    "JsonWebTokenError": ()=> res.status(400).json({error: "El token de validacion proporcionado no es valido"}),

    // < == DEFAULT ERROR == >
    "DEFAULT": ()=> res.status(500).json({error: "Ha ocurrido un error con el servidor"})
  }

  return listOfErrors[name] 
  ? listOfErrors[name]() 
  : listOfErrors["DEFAULT"]()
}

export default errorHandling