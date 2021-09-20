import { validationResult } from 'express-validator'

import ErrorHandler from 'utils/ErrorHandler'
import { ErrorResponse } from 'utils/Response'
import CatchAsyncErrors from 'utils/CatchAsyncErrors'
import { findUser, updatePassword } from 'service/User.Service'

/**
 * Updates the logged in user password
 */
const update = CatchAsyncErrors(async (req, res, next) => {
  // 1) Check fo validation errors
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return ErrorResponse(res, 400, {
      message: 'Update password failed.',
      errors: errors.array(),
    })
  }

  // 2) Check if Old Password is correct
  const user = await findUser({ email: req.user.email })
  if (!(await user.comparePassword(req.body.oldPassword))) {
    return next(new ErrorHandler('Old Password does not match !', 400))
  }

  // 3) Update the password
  await updatePassword(user._id, req.body.password)

  // 4) Send Response logging out user
  return res
    .clearCookie('jwt')
    .status(200)
    .json({
      success: true,
      data: {
        message: 'Password changed. Please log in using the new password !',
      },
    })
})

export default { update }
