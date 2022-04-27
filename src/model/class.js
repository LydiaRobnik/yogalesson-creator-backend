import mongoose from "mongoose";
import { sequenceSchema } from "./sequence";

const Schema = mongoose.Schema;

const classSchema = new Schema(
  {
    title: String,
    user: mongoose.Types.ObjectId,
    duration: Number,
    audio: String,
    modifiedAt: { type: Date, default: new Date() },
    plan: [sequenceSchema]
  },
  { collection: "classes" }
);

export default mongoose.model("Class", classSchema);
