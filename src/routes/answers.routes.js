import { Router } from 'express'
import { getAnswers, submitAnswers } from '../controllers/answers.controller.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { requireAuth, requireRole } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', requireAuth, asyncHandler(getAnswers))
router.post('/', requireAuth, requireRole('aleena'), asyncHandler(submitAnswers))

export default router
