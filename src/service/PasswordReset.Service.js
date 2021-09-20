import _ from 'lodash'
import { nanoid } from 'nanoid'

import { updateUser } from './User.Service.js'
import PasswordResetModel from 'model/PasswordReset.Model'

/**
 * Creates the Password Reset
 */
export const createPasswordReset = async (user) => {
  try {
    // 1) Prepare the password reset token details
    const token = nanoid(36)
    const expiresAt = new Date(Date.now() + 15 * 60000)

    // 2) Delete previous password reset tokens of a user
    await deletePasswordReset(user._id)

    // 3) Creates a password reset with token details
    const passwordReset = await PasswordResetModel.create({
      user,
      token,
      expiresAt,
    })

    // 4) Update the User with the new ONE TO ONE password reset relation
    await updateUser({ _id: user._id }, { passwordReset: passwordReset._id })

    // 5) Return the password reset token details
    return passwordReset
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Find and return the password reset
 */
export const findPasswordReset = async (
  query,
  populateOptions,
  options = { lean: true }
) => {
  try {
    // 1) Prepare query to find one password reset
    let passwordResetQuery = PasswordResetModel.findOne(query, {}, options)

    // 2) Check if the populate option is provided
    if (populateOptions) {
      passwordResetQuery = passwordResetQuery.populate(populateOptions)
    }

    // 3) Execute the query
    const passwordReset = await passwordResetQuery

    // 4) Return the query details
    return passwordReset
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Deletes the password reset of a user
 */
export const deletePasswordReset = async (userId) => {
  try {
    await PasswordResetModel.findOneAndDelete({ user: userId })
  } catch (error) {
    throw new Error(error)
  }
}
