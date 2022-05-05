import mongoose from "mongoose";
import { asanaSchema } from "./asana";

const Schema = mongoose.Schema;

const calendarSchema = new Schema(
  {
    user: String,
    class: String,
    event: {
      title: String,
      date: String,
      startT: String,
      endT: String,
      regular: String,
      regularCount: Number,
      regularLink: String,
      backgroundColor: String,
      borderColor: String
    }
  },
  { collection: "calendar" }
);

export default mongoose.model("Calendar", calendarSchema);

export { calendarSchema };
