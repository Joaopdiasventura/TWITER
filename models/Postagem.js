import mongoose, { Schema } from "mongoose";

const postagemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.ObjectId,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Postagem = mongoose.model('Postagem', postagemSchema);

export default  Postagem;
