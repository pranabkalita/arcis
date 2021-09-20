import ErrorHandler from 'utils/ErrorHandler'
import { ErrorResponse } from 'utils/Response'

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || 'Internal Server Error.'

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    return ErrorResponse(res, err.statusCode, {
      err,
      message: err.message,
      stack: err.stack,
    })
  }

  if (process.env.NODE_ENV === 'PRODUCTION') {
    let error = { ...err }
    error.message = err.message

    // Wrong Mongoose Object ID Error
    if (err.name === 'CastError') {
      const message = `Resource not found. Invalid: ${err.path}`
      error = new ErrorHandler(message, 400)
    }

    // Handling Mongoose Validation Error
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((value) => value.message)
      error = new ErrorHandler(message, 400)
    }

    // Handle mongoose duplicate error
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered.`
      error = new ErrorHandler(message, 400)
    }

    // Handle invalid JWT token
    if (err.name === 'JsonWebTokenError') {
      const message = 'JsonWebToken is invalid. Try again.'
      error = new ErrorHandler(message, 400)
    }

    // Handle expired JWT token
    if (err.name === 'TokenExpiredError') {
      const message = 'JsonWebToken has been expired. Try again.'
      error = new ErrorHandler(message, 400)
    }

    return ErrorResponse(res, error.statusCode, {
      message: error.message || 'Internal Server Error.',
    })
  }
}
