import mongoose from "mongoose";

const Schema = mongoose.Schema;

const asanaSchema = new Schema({
  img_url: String,
  asana: {
    sanskrit: String,
    name: String
  },
  user: String,
  default: Boolean,
  level: String,
  tags: [String],
  duration: Number
});

export default mongoose.model("Asana", asanaSchema);

export { asanaSchema };
