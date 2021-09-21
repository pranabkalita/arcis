import { nanoid } from "nanoid";

export const createToken = () => {
  const token = nanoid(36);
  const expiresAt = new Date(Date.now() + 15 * 60000);

  return { token, expiresAt };
};
