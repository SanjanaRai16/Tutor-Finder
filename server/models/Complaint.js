import mongoose from 'mongoose'

const ComplaintSchema = new mongoose.Schema({
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  against:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject:  { type: String, required: true },
  message:  { type: String, required: true },
  status:   { type: String, enum: ['open', 'resolved', 'dismissed'], default: 'open' },
  adminNote:{ type: String, default: '' }
}, { timestamps: true })

export default mongoose.model('Complaint', ComplaintSchema)