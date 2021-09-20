export const ErrorResponse = (res, code, error) => {
  return res.status(code).json({
    success: false,
    error,
  })
}

export const SuccessResponse = (res, code, data) => {
  return res.status(code).json({
    success: true,
    data,
  })
}
