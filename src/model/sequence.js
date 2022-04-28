import mongoose from "mongoose";
import { asanaSchema } from "./asana";

const Schema = mongoose.Schema;

const sequenceSchema = new Schema(
  {
    user: String,
    type: String,
    title: String,
    duration: Number,
    audio: String,
    modifiedAt: { type: Date, default: new Date() },
    description: String,
    asanas: [asanaSchema]
  },
  { collection: "sequences" }
);

export default mongoose.model("Sequence", sequenceSchema);

export { sequenceSchema };
