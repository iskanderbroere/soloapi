const mongoose = require('../config/database')
const { Schema } = mongoose

const evaluationSchema = new Schema({
  color: { type: Number, required: true, default: 1 },
  date: { type: Date, unique: true, required: true },
  remark: { type: String },
  studentId: { type: Schema.Types.ObjectId, ref: 'student' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('evaluations', evaluationSchema)
