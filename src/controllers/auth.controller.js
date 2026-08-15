import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const COOKIE_NAME = 'token'

function cookieOptions() {
  const sameSite = process.env.COOKIE_SAME_SITE || 'lax'
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days — keep in sync with JWT_EXPIRES_IN
    path: '/',
  }
}

export async function login(req, res) {
  const { role, password } = req.body

  if (!['gheevas', 'aleena'].includes(role) || !password) {
    return res.status(400).json({ error: 'Choose who is entering the gate and give a password.' })
  }

  const user = await User.findOne({ role })
  if (!user) {
    // same generic message as a wrong password — don't reveal which part failed
    return res.status(401).json({ error: 'That password does not match the enchantment.' })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return res.status(401).json({ error: 'That password does not match the enchantment.' })
  }

  const token = jwt.sign({ role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

  res.cookie(COOKIE_NAME, token, cookieOptions())
  return res.json({ role: user.role })
}

export async function me(req, res) {
  // requireAuth middleware already validated the cookie and set req.user
  return res.json({ role: req.user.role })
}

export async function logout(req, res) {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined })
  return res.json({ ok: true })
}
