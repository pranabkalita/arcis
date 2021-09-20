import { sign } from 'utils/Jwt'
import UserModel from 'model/User.Model'
import { deletePasswordReset } from './PasswordReset.Service'
import { deleteEmailVerification } from './EmailVerification.Service'

/**
 * Creates and return a new user
 */
export const createUser = async (userData) => {
  try {
    const user = await UserModel.create(userData)
    user.password = undefined

    return user
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Find and return a user
 */
export const findUser = async (query, populateOptions, options = {}) => {
  try {
    let userQuery = UserModel.findOne(query, {}, options).select('+password')

    if (populateOptions) {
      userQuery = userQuery.populate(populateOptions)
    }

    const user = await userQuery

    return user
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Find and return all users
 */
export const findAllUser = async () => {
  return await UserModel.find()
}

/**
 * Updates a user
 */
export const updateUser = async (query, update) => {
  try {
    return await UserModel.findOneAndUpdate(query, update, {
      new: true,
      useFindAndModify: false,
    })
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Activate a user
 */
export const activateUser = async (userId) => {
  try {
    const user = await updateUser(
      { _id: userId },
      { verifiedAt: Date.now(), emailVerification: null }
    )

    await deleteEmailVerification(userId)

    return user
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Check the user credentials for login and return the user if passed
 */
export const validatePassword = async ({ email, password }) => {
  try {
    const user = await UserModel.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return null
    }

    user.password = undefined
    return user
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Generate the JWT Token for user
 */
export const generateToken = (user) => {
  const token = sign(
    { id: user._id },
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  )

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
  }
  if (process.env.NODE_ENV === 'PRODUCTION') cookieOptions.secure = true

  return { token, cookieOptions }
}

/**
 * Reset the user password
 */
export const resetPassword = async (userId, password) => {
  try {
    const user = await findUser({ _id: userId })
    user.password = password
    user.passwordReset = null
    await user.save({ validateBeforeSave: false })

    await deletePasswordReset(userId)

    return user
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Update Password
 */
export const updatePassword = async (userId, password) => {
  try {
    const user = await findUser({ _id: userId })
    user.password = password
    await user.save({ validateBeforeSave: false })
  } catch (error) {
    throw new Error(error)
  }
}
