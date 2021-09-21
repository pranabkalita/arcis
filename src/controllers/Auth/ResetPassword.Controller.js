import { validationResult } from "express-validator";

import ErrorHandler from "utils/ErrorHandler";
import CatchAsyncErrors from "utils/CatchAsyncErrors";
import { findUser, resetPassword } from "service/User.Service";
import { ErrorResponse, SuccessResponse } from "utils/Response";

/**
 * Resets a user password
 */
const store = CatchAsyncErrors(async (req, res, next) => {
  // 1. check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return ErrorResponse(res, 400, {
      message: "Reset password failed.",
      errors: errors.array(),
    });
  }

  // 2) Find user
  const user = await findUser({
    email: req.body.email,
    "passwordReset.token": req.params.token,
    "passwordReset.expiresAt": { $gte: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid or Expired Token !, 400"));
  }

  // 5) Activate the account
  await resetPassword(user, req.body.password);

  // 6) Send the response
  return SuccessResponse(res, 200, {
    message: "Password has been reset. Please login with new password.",
  });
});

export default { store };
