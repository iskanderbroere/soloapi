const mongoose = require('../config/database')
const { Schema } = mongoose

const studentSchema = new Schema({
  fullName: { type: String, required: true },
  picUrl: { type: String, required: true },
  evaluationIds: [{ type: Schema.Types.ObjectId, ref: 'evaluations' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('students', studentSchema)
