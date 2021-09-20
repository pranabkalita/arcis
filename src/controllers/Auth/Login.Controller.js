import { validationResult } from 'express-validator'

import CatchAsyncErrors from 'utils/CatchAsyncErrors'
import { ErrorResponse, SuccessResponse } from 'utils/Response'
import { validatePassword, generateToken } from 'service/User.Service'

/**
 * Logs the user in and send back the JWT token
 */
const store = CatchAsyncErrors(async (req, res, next) => {
  // 1. Check for validation errors
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return ErrorResponse(res, 400, {
      message: 'User login failed.',
      errors: errors.array(),
    })
  }

  // 2. Check if the user credentials are correct
  const user = await validatePassword(req.body)

  if (!user) {
    return ErrorResponse(res, 400, {
      message: 'Invalid Email or Password.',
    })
  }

  // 3. Generate JWT Token
  const { token, cookieOptions } = generateToken(user)

  // 4. Set JWT Token in Cookie
  res.cookie('jwt', token, cookieOptions)

  // 5. Send the details back
  return SuccessResponse(res, 200, {
    user,
    token,
  })
})

export default { store }
