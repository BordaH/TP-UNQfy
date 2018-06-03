class APIError extends Error {
  constructor(name,statusCode,errorCode,message=null){
    super(message || name);
    this.name = name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

class ResourceNotFound extends APIError {
  constructor(){
    super('ResourceNotFound',409,'RESOURCE_NOT_FOUND');
  }
}

class ResourceAlreadyExists extends APIError {
  constructor(){
    super('ResourceAlreadyExists',409,'RESOURCE_ALERADY_EXISTS');
  }
}

function errorHandler(err, req, res, next) {
  console.error(err); // imprimimos el error en consola
  // Chequeamos que tipo de error es y actuamos en consecuencia
  if (err instanceof APIError){
    res.status(err.statusCode);
    res.json({status: err.statusCode, errorCode: err.errorCode});
  } else {
  // continua con el manejador de errores por defecto
    next(err);
  }
}

module.exports = {
  APIError,
  ResourceNotFound,
  ResourceAlreadyExists,
  errorHandler 
};