import { validationResult } from "express-validator";

import Email from "utils/Email";
import { createUser } from "service/User.Service";
import CatchAsyncErrors from "utils/CatchAsyncErrors";
import { createToken } from "utils/EmailValidationToken";
import { ErrorResponse, SuccessResponse } from "utils/Response";

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
  const { firstName, lastName, email, password } = req.body;
  const { token, expiresAt } = createToken();
  const newUserData = {
    firstName,
    lastName,
    email,
    password,
    emailVerification: { token, expiresAt },
  };

  // 3) Create user
  const user = await createUser(newUserData);

  // 4) Send the email verification link
  await new Email(user).sendWelcome(token);

  // 5) Send back the user details
  return SuccessResponse(res, 200, {
    user,
  });
});

export default { store };
