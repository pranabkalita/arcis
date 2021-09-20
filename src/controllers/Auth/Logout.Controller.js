import CatchAsyncErrors from 'utils/CatchAsyncErrors'

/**
 * Logs the user out
 */
const store = CatchAsyncErrors(async (req, res, next) => {
  return res
    .clearCookie('jwt')
    .status(200)
    .json({
      success: true,
      data: {
        message: 'Successfully logged out 😏 🍀',
      },
    })
})

export default { store }
