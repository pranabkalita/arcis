import { validationResult } from 'express-validator'

import CatchAsyncErrors from 'utils/CatchAsyncErrors'
import {
  createAddress,
  deleteAddress,
  getAllAddresses,
  getOneAddress,
  updateAddress,
} from 'service/Address.Service'
import { SuccessResponse, ErrorResponse } from 'utils/Response'

/**
 * Get all the addresses
 */
const index = CatchAsyncErrors(async (req, res, next) => {
  const addresses = await getAllAddresses({ _id: req.user.id })

  return SuccessResponse(res, 200, {
    addresses,
  })
})

/**
 * Create One Address
 */
const create = CatchAsyncErrors(async (req, res, next) => {
  // 1) Check for errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return ErrorResponse(res, 400, {
      message: 'Address creation failed',
      errors: errors.array(),
    })
  }

  // 2) Create Address
  const addresses = await createAddress({ _id: req.user._id }, req.body)

  return SuccessResponse(res, 201, {
    addresses,
  })
})

/**
 * Get one address
 */
const show = CatchAsyncErrors(async (req, res, next) => {
  const address = await getOneAddress(
    { 'addresses._id': req.params.id },
    req.params.id
  )

  return SuccessResponse(res, 200, {
    address,
  })
})

/**
 * Update one address
 */
const update = CatchAsyncErrors(async (req, res, next) => {
  const address = await updateAddress(req.params.id, req.body)

  return SuccessResponse(res, 200, {
    address: address[0],
  })
})

/**
 * Delete one address
 */
const destroy = CatchAsyncErrors(async (req, res, next) => {
  const user = await deleteAddress(req.user._id, req.params.id)

  return SuccessResponse(res, 204, {})
})

export default { index, create, show, update, destroy }
