import { check } from 'express-validator'

import { findUser } from 'service/User.Service'

export const registerValidator = [
  check('firstName', 'A user must have a first name').notEmpty(),
  check('lastName', 'A user must have a last name').notEmpty(),
  check('email', 'User must provide a valid email address.').custom(
    async (email, { req }) => {
      if (!email) {
        throw new Error('User must provide a valid email address.')
      }

      const user = await findUser({ email })

      if (user) {
        throw new Error('This email is already taken.')
      }
    }
  ),
  check('password', 'User must have a strong password').isStrongPassword(),
  check('passwordConfirmation', 'Passwords must match').custom(
    async (passwordConfirmation, { req }) => {
      const { password } = req.body

      if (password !== passwordConfirmation) {
        throw new Error('Passwords do not match.')
      }
    }
  ),
]

export const loginValidator = [
  check('email', 'User must provide a valid email address.').isEmail(),
  check('password', 'User must provide a password.').notEmpty(),
]

export const forgotPasswordValidator = [
  check('email', 'User must provide a valid email address.').isEmail(),
]

export const resetPasswordValidator = [
  check('email', 'User must provide their email.').isEmail(),
  check('password', 'User must have a strong password.').isStrongPassword(),
  check('passwordConfirmation', 'Passwords must match.').custom(
    async (passwordConfirmation, { req }) => {
      const { password } = req.body

      if (password !== passwordConfirmation) {
        throw new Error('Passwords do not match.')
      }
    }
  ),
]

export const updatePasswordValidator = [
  check('oldPassword', 'User must provide their old password.').notEmpty(),
  check('password', 'User must have a strong password.').isStrongPassword(),
  check('passwordConfirmation', 'Passwords must match.').custom(
    async (passwordConfirmation, { req }) => {
      const { password } = req.body

      if (password !== passwordConfirmation) {
        throw new Error('Passwords do not match.')
      }
    }
  ),
]
