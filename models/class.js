const mongoose = require('../config/database')
const { Schema } = mongoose

const classSchema = new Schema({
  batchNumber: { type: Number, unique: true, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  // maybe the ref should be singular
  studentIds: [{ type: Schema.Types.ObjectId, ref: 'students' }],
  teacherId: { type: Schema.Types.ObjectId, ref: 'users' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('classes', classSchema)
