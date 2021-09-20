import Email from "utils/Email";
import {
  createEmailVerification,
  findEmailVerification,
} from "service/EmailVerification.Service";
import CatchAsyncErrors from "utils/CatchAsyncErrors";
import { activateUser, findUser } from "service/User.Service";
import { ErrorResponse, SuccessResponse } from "utils/Response";

/**
 * Creates an email verification link and send to the registered email
 */
const store = CatchAsyncErrors(async (req, res, next) => {
  // 1) Get logged in user
  const user = await findUser({ _id: req.user._id });

  // 2) Create Email Verification
  const emailVerificationToken = await createEmailVerification(user);
  await new Email(user).sendWelcome(emailVerificationToken);

  // 3) Send back Response
  return SuccessResponse(res, 200, {
    message: "Verification email sent to registered email address.",
  });
});

/**
 * Activates the user when they click the activation link in email
 */
const show = CatchAsyncErrors(async (req, res, next) => {
  console.warn("EHRE");
  // 1) Get the token if token is valid
  const emailVerification = await findEmailVerification({
    token: req.params.token,
    expiresAt: { $gte: Date.now() },
  });

  if (!emailVerification) {
    return ErrorResponse(res, 400, {
      message: "Invalid or Expired Token !",
    });
  }

  // 2) Activate the account
  const user = await activateUser(emailVerification.user);

  // 3) Send the response
  return SuccessResponse(res, 200, {
    user,
  });
});

export default { show, store };
