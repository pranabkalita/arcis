import jwt from "jsonwebtoken";

export const sign = (object, options) => {
  return jwt.sign(object, process.env.JWT_SECRET, options);
};

export const decode = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return { valid: true, expired: false, decoded };
  } catch (error) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
};
