import mongoose from 'mongoose'

const SubjectSchema = new mongoose.Schema({
  name:      { type: String, required: true, unique: true },
  isActive:  { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.model('Subject', SubjectSchema)