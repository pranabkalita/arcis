import { validationResult } from 'express-validator'

import ErrorHandler from 'utils/ErrorHandler'
import CatchAsyncErrors from 'utils/CatchAsyncErrors'
import { findUser, resetPassword } from 'service/User.Service'
import { ErrorResponse, SuccessResponse } from 'utils/Response'
import { findPasswordReset } from 'service/PasswordReset.Service'

/**
 * Resets a user password
 */
const store = CatchAsyncErrors(async (req, res, next) => {
  // 1. check for validation errors
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return ErrorResponse(res, 400, {
      message: 'Reset password failed.',
      errors: errors.array(),
    })
  }

  // 2) Get the token
  const passwordReset = await findPasswordReset({
    token: req.params.token,
    expiresAt: { $gte: Date.now() },
  })

  if (!passwordReset) {
    return next(new ErrorHandler('Invalid or Expired Token !, 400'))
  }

  // 4) Find User
  const user = await findUser({ email: req.body.email })
  if (!user || !user.passwordReset.equals(passwordReset._id)) {
    return next(new ErrorHandler('Invalid or Expired Token !, 400'))
  }

  // 5) Activate the account
  await resetPassword(passwordReset.user, req.body.password)

  // 6) Send the response
  return SuccessResponse(res, 200, {
    message: 'Password has been reset. Please login with new password.',
  })
})

export default { store }
