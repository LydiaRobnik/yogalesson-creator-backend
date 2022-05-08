import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  validated: Boolean,
  online: Boolean,
  token: String,
  avatar: String,
  verificationToken: String,
  modifiedAt: { type: Date, default: new Date() },
  role: String
});

export default mongoose.model("User", userSchema);
