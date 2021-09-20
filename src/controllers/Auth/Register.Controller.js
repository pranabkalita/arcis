import { validationResult } from "express-validator";

import Email from "utils/Email";
import { createUser } from "service/User.Service";
import CatchAsyncErrors from "utils/CatchAsyncErrors";
import { ErrorResponse, SuccessResponse } from "utils/Response";
import { createEmailVerification } from "service/EmailVerification.Service";

/**
 * Registers a user
 */
const store = CatchAsyncErrors(async (req, res, next) => {
  // 1) Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ErrorResponse(res, 400, {
      message: "User registration failed",
      errors: errors.array(),
    });
  }

  // 2) Register a user
  const data = req.body;
  data.role = undefined; // prevent user to update the roles
  const user = await createUser(data);

  // 3) Create a email verification
  const emailVerificationToken = await createEmailVerification(user);

  // 4) Send the email verification link
  await new Email(user).sendWelcome(emailVerificationToken);

  // 5) Send back the user details
  return SuccessResponse(res, 200, {
    user,
  });
});

export default { store };
