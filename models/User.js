import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  senha:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
  eAdm:{
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('User', userSchema);

export default  User;