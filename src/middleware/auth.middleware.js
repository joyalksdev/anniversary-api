import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const token = req.cookies?.token
  if (!token) {
    return res.status(401).json({ error: 'Not signed in.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { role: payload.role }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid, please log in again.' })
  }
}

// Use after requireAuth to restrict a route to one role, e.g.
// router.post('/answers', requireAuth, requireRole('aleena'), submitAnswers)
export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: `Only ${role} can do that.` })
    }
    next()
  }
}
