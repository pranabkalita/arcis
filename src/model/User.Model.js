import mongoose from "mongoose";
import bcrypt from "bcrypt";

const defaultProfilePicture = "public/img/profile/dummy-profile.svg";
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  SELLER: "seller",
  USER: "user",
};

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, default: ROLES.USER },
    avatar: { type: String, required: false, default: defaultProfilePicture },
    password: { type: String, required: true, select: false },
    verifiedAt: { type: Date, required: false, default: null },
    addresses: [
      {
        addressLine_1: { type: String, required: true },
        addressLine_2: { type: String, required: false },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
        alternatePhone: { type: String, required: false },
        isActive: { type: Boolean, default: false },
      },
    ],
    emailVerification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailVerification",
    },
    passwordReset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PasswordReset",
    },
  },
  { timestamps: true }
);

// Encrypt user password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  return next();
});

// METHODS: Compare password
UserSchema.methods.comparePassword = async function (candidPassword) {
  return await bcrypt
    .compare(candidPassword, this.password)
    .catch((e) => false);
};

export default mongoose.model("User", UserSchema);
