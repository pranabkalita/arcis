import Email from "utils/Email";
import CatchAsyncErrors from "utils/CatchAsyncErrors";
import { createToken } from "utils/EmailValidationToken";
import { activateUser, findUser, updateUser } from "service/User.Service";
import { ErrorResponse, SuccessResponse } from "utils/Response";

/**
 * Creates an email verification link and send to the registered email
 */
const store = CatchAsyncErrors(async (req, res, next) => {
  // 1) Create Email Verification
  const { token, expiresAt } = createToken();

  // 1) Update user with new email verification tokens
  const user = await updateUser(
    { _id: req.user._id },
    {
      emailVerification: {
        token,
        expiresAt,
      },
    }
  );

  await new Email(user).sendWelcome(token);

  // 3) Send back Response
  return SuccessResponse(res, 200, {
    message: "Verification email sent to registered email address.",
  });
});

/**
 * Activates the user when they click the activation link in email
 */
const show = CatchAsyncErrors(async (req, res, next) => {
  // 1) Get the token if token is valid
  const user = await findUser({
    "emailVerification.token": req.params.token,
    "emailVerification.expiresAt": { $gte: Date.now() },
  });

  if (!user) {
    return ErrorResponse(res, 400, {
      message: "Invalid or Expired Token !",
    });
  }

  // 2) Activate the account
  const activatedUser = await activateUser(user);

  // 3) Send the response
  return SuccessResponse(res, 200, {
    activatedUser,
  });
});

export default { show, store };
