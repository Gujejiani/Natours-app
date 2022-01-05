const AppError = require('./../utils/appError')
const apiError = require('./../utils/appError')
const  handleCastErrorDB = err =>{
    const message = `Invalid  ${err.path}: ${err.value}`
    return new apiError(message, 400)
}
const handleDuplicateFieldsDB = err => {
    const message = `duplicate key please use another name`
    return new apiError(message, 400)
} 
 const sendErrorDev = (err,req, res)=>{
    //  console.log(req)
     //API
     if(req.originalUrl.startsWith('/api')){
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
     }else{
         //RENDERED WEBSITE
        //  console.log(err)
            res.status(err.statusCode).render('error',{
                title: 'Something went wrong',
                msg: err.message
            })
     } 
  
 }


const handleJWTError = err => new AppError('invalid token please login again', 401);



 sendErrorProduction = (err,req, res)=>{
    
    //  API
    if(req.originalUrl.startsWith('/api')){

        
        // operational error
        if(err.isOperational){
          return res.status(err.statusCode).json({
               status: err.status,
               message: err.message,
               
           })
           // programing error
        }else{
            // 1Log eerrror
           console.error('error', err)
            // 2) send generic message
         return   res.status(500).json({
                status: 'error',
                message: 'Something went very wrong'
            })
        }
    }

        // Rendered website
         // operational error
         if(err.isOperational){
            res.status(err.statusCode).render('error',{
                title: 'Something went wrong',
                msg: err.message
            })
            // programing error
         }else{
             // 1Log eerrror
            console.error('error', err)
             // 2) send generic message
             res.status(err.statusCode).render('error',{
                title: 'Something went wrong',
                msg: "Please try again later."
            })
         }
    
  
 }

const handleJWTExpiredError = err => new AppError('your token has expired')
 
 module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // console.log(process.env.NODE_ENV)
    if(process.env.NODE_ENV === 'development'){
        console.log('dev')
      sendErrorDev(err,req, res)
    }else if(process.env.NODE_ENV == 'production'){
        console.log('we came')
        let error =  {...err}
     
        if(error.name === 'CastError') error = handleCastErrorDB(error)
        if(error.code === 11000) error = handleDuplicateFieldsDB(error)
        if(error.name === 'JsonWebTokenError') error = handleJWTError(error)
        if(error.name ===  'TokenExpiredError') error = handleJWTExpiredError(err)
        console.log('we came')
        sendErrorProduction(error,req, res)
    }
    
}