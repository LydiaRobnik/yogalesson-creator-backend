import mongoose from "mongoose";
import { sequenceSchema } from "./sequence";

const Schema = mongoose.Schema;

const classSchema = new Schema(
  {
    title: String,
    user: String,
    duration: Number,
    favourite: Boolean,
    audio: String,
    modifiedAt: { type: Date, default: new Date() },
    plan: [sequenceSchema]
  },
  { collection: "classes" }
);

export default mongoose.model("Class", classSchema);
