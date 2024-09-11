import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserModelSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: [true, "Username is required"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

  },
  {
    timestamps: true,
  }
);

UserModelSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

        try {
            const salt = await bcrypt.genSalt(10)
            this.password = await bcrypt.hash(this.password, salt)
        } catch (error) {
            next(error)
        }
})

UserModelSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", UserModelSchema)

export default User