import mongoose from 'mongoose'

const ProgressNoteSchema = new mongoose.Schema({
  booking:    { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  student:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tutor:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject:    { type: String, required: true },
  topicsCovered: { type: String, required: true },
  performance:   { type: Number, min: 1, max: 5, required: true },
  homework:      { type: String, default: '' },
  notes:         { type: String, default: '' }
}, { timestamps: true })

export default mongoose.model('ProgressNote', ProgressNoteSchema)