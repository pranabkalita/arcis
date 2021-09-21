import ErrorHandler from "utils/ErrorHandler";

/**
 * Middleware: Pass if the user is NOT ACTIVATED
 */
export const IsActive = (req, res, next) => {
  if (!req.user.verifiedAt) {
    return next(new ErrorHandler("User is not activated !", 401));
  }

  next();
};

/**
 * Middleware: Pass if the user is ACTIVATED
 */
export const IsNotActive = (req, res, next) => {
  if (req.user.verifiedAt) {
    return next(new ErrorHandler("User is already activated !", 401));
  }

  next();
};

/**
 * Middleware: Pass if the user is LOGGED IN
 */
export const IsNotLoggedIn = (req, res, next) => {
  if (req.user) {
    return next(new ErrorHandler("User is already logged in !", 401));
  }

  next();
};

export const IsVerified = (req, res, next) => {
  if (!req.user.verifiedAt) {
    return next(new ErrorHandler("Please verify your account !", 401));
  }

  next();
};

/**
 * Checks if the request user has the access
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};

/**
 * Middleware: Pass if the user is NOT LOGGED IN
 */
export default (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Not Authorized !", 401));
  }

  next();
};
