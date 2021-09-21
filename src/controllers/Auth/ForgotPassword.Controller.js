import { validationResult } from "express-validator";

import Email from "utils/Email";
import ErrorHandler from "utils/ErrorHandler";
import CatchAsyncErrors from "utils/CatchAsyncErrors";
import { createToken } from "utils/EmailValidationToken";
import { findUser, updateUser } from "service/User.Service";
import { ErrorResponse, SuccessResponse } from "utils/Response";

/**
 * Creates the forgot password link and send reset password link to email
 */
const store = CatchAsyncErrors(async (req, res, next) => {
  // 1. Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return ErrorResponse(res, 400, {
      message: "Forget password failed.",
      errors: errors.array(),
    });
  }

  // 2) Find the user with provided email
  const user = await findUser({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email !", 404));
  }

  // 3) Created a password reset link and send to email
  const { token, expiresAt } = createToken();

  // 4) Update User with new forget password
  const updatedUser = await updateUser(
    { _id: user._id },
    {
      passwordReset: {
        token,
        expiresAt,
      },
    }
  );

  // 4) Send email
  await new Email(user).sendResetPasswordLink(token);

  // 5) Send back the response
  return SuccessResponse(res, 200, {
    message: "Password reset link has been sent.",
  });
});

export default { store };
