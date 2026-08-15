import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import mongoose from 'mongoose'

async function seed() {
  const { GHEEVAS_PASSWORD, ALEENA_PASSWORD } = process.env

  if (!GHEEVAS_PASSWORD || !ALEENA_PASSWORD) {
    throw new Error('Set GHEEVAS_PASSWORD and ALEENA_PASSWORD in .env before seeding.')
  }

  await connectDB()

  const accounts = [
    { role: 'gheevas', password: GHEEVAS_PASSWORD },
    { role: 'aleena', password: ALEENA_PASSWORD },
  ]

  for (const { role, password } of accounts) {
    const passwordHash = await bcrypt.hash(password, 12)
    await User.findOneAndUpdate(
      { role },
      { role, passwordHash },
      { upsert: true, new: true }
    )
    console.log(`[seed] upserted user: ${role}`)
  }

  await mongoose.disconnect()
  console.log('[seed] done')
}

seed().catch((err) => {
  console.error('[seed] failed:', err.message)
  process.exit(1)
})
