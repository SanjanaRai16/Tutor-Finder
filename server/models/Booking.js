import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema({
  student:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tutor:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slot:      { day: String, time: String },
  status:    { type: String, enum: ['pending','confirmed','cancelled'], default: 'pending' },
  isTrial:   { type: Boolean, default: false },
  duration:  { type: Number, default: 60 }  // minutes
}, { timestamps: true })

export default mongoose.model('Booking', BookingSchema)