import _ from "lodash";
import { nanoid } from "nanoid";

import { updateUser } from "./User.Service";
import EmailVerificationModel from "model/EmailVerification.Model";

/**
 * Create the email verification
 */
export const createEmailVerification = async (user) => {
  try {
    // 1) Prepare the token details
    const token = nanoid(36);
    const expiresAt = new Date(Date.now() + 15 * 60000);

    // 2) Delete previous email verification details
    await deleteEmailVerification(user._id);

    // 3) Create the email verification with token details
    const emailVerificationToken = await EmailVerificationModel.create({
      user,
      token,
      expiresAt,
    });

    // 4) Update the User with the new ONE TO ONE email verification relation
    await updateUser(
      { _id: user._id },
      { emailVerification: emailVerificationToken._id }
    );

    // 5) Return the token details
    return emailVerificationToken;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Find and return the email verification
 */
export const findEmailVerification = async (
  query,
  populateOptions,
  options = { lean: true }
) => {
  try {
    // 1) Prepare query to find one email verification
    let emailVerificationQuery = EmailVerificationModel.findOne(
      query,
      {},
      options
    );

    // 2) Check if the populate option is provided
    if (populateOptions) {
      emailVerificationQuery = emailVerificationQuery.populate(populateOptions);
    }

    // 3) Execute the query
    const emailVerification = await emailVerificationQuery;

    // 4) Return the query details
    return emailVerification;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Deletes the email verification of a user
 */
export const deleteEmailVerification = async (userId) => {
  try {
    await EmailVerificationModel.findOneAndDelete({ user: userId });
  } catch (error) {
    throw new Error(error);
  }
};
