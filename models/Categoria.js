import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);

export default  Categoria;
