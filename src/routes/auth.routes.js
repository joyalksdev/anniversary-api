import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { login, me, logout } from '../controllers/auth.controller.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

// Only two possible usernames ever exist, so brute-forcing the password is
// the realistic attack here — rate-limit it hard.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Rest a while before trying again.' },
})

router.post('/login', loginLimiter, asyncHandler(login))
router.get('/me', requireAuth, asyncHandler(me))
router.post('/logout', asyncHandler(logout))

export default router
