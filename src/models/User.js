import mongoose from 'mongoose'

// This app only ever has two accounts, so there's no signup flow —
// just two seeded documents distinguished by `role`.
const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['gheevas', 'aleena'],
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
