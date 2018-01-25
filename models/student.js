const mongoose = require('../config/database')
const { Schema } = mongoose

const studentSchema = new Schema({
  fullName: { type: String, required: true },
  picUrl: { type: String, required: true },
  lastEvaluation: { type: Number, default: 0 },
  evaluationIds: [{ type: Schema.Types.ObjectId, ref: 'evaluations' }],
  classId: { type: Schema.Types.ObjectId, ref: 'classes' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('students', studentSchema)
