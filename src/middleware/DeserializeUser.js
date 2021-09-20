import { decode } from "utils/Jwt";
import UserModel from "model/User.Model";

export const deserializeUser = async (req, res, next) => {
  // 1) Get the token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next();
  }

  // 2) Verify the token
  const { valid, decoded } = decode(token);

  if (!valid) {
    return next();
  }

  // 3) Check if the user still exists and not deleted
  const freshUser = await UserModel.findById(decoded.id);

  if (!freshUser) {
    return next();
  }

  // 4) Grant access to the route
  req.user = freshUser;
  res.locals.user = freshUser;
  next();
};
