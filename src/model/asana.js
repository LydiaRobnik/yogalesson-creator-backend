import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const asanaSchema = new Schema({
  sanskrit_name: String,
  english_name: String,
  img_url: String,
});

export default mongoose.model('Asana', asanaSchema);
