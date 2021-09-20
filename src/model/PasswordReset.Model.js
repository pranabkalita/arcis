import mongoose from 'mongoose'

const PasswordResetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    token: { type: String, required: false },
    expiresAt: { type: Date, required: false },
  },
  { timestamps: false }
)

export default mongoose.model('PasswordReset', PasswordResetSchema)
