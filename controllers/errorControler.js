const apiError = require('./../utils/appError')
const  handleCastErrorDB = err =>{
    const message = `Invalid  ${err.path}: ${err.value}`
    return new apiError(message, 400)
}
const handleDuplicateFieldsDB = err => {
    const message = `duplicate key please use another name`
    return new apiError(message, 400)
} 
 const sendErrorDev = (err, res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
 }

 sendErrorProduction = (err, res)=>{
     // operational error
     if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            
        })
        // programing error
     }else{
         // 1Log eerrror
        console.error('error', err)
         // 2) send generic message
         res.status(500).json({
             status: 'error',
             message: 'Something went very wrong'
         })
     }
  
 }
 
 module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    console.log(process.env.NODE_ENV)
    if(process.env.NODE_ENV === 'development'){
        console.log('dev')
      sendErrorDev(err, res)
    }else if(process.env.NODE_ENV == 'production'){
        console.log('we came')
        let error =  {...err}
     
        if(error.name === 'CastError') error = handleCastErrorDB(error)
        if(error.code === 11000) error = handleDuplicateFieldsDB(error)
        console.log('we came')
        sendErrorProduction(error, res)
    }
    
}