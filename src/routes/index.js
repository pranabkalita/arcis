import express from 'express'

import AuthRouter from './Auth.Route'

const router = express.Router()

router.get('/healthcheck', (req, res) => {
  return res.status(200).json({ success: true })
})

router.use('/auth', AuthRouter)

export default router
