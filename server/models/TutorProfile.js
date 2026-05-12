const mongoose = require('mongoose')

const SlotSchema = new mongoose.Schema({
  day:  { type: String, required: true },
  time: { type: String, required: true }
})

const TutorProfileSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  subjects:       [String],
  bio:            String,
  hourlyRate:     Number,
  isApproved:     { type: Boolean, default: false },
  availableSlots: [SlotSchema],
  avgRating:      { type: Number, default: 0 },
  reviewCount:    { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model('TutorProfile', TutorProfileSchema)