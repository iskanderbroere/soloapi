const mongoose = require('../config/database')
const { Schema } = mongoose

const recipeSchema = new Schema({
  batchNumber: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  studentIds: [{ type: Schema.Types.ObjectId, ref: 'students' }],
  teacherId: { type: Schema.Types.ObjectId, ref: 'users' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('recipes', recipeSchema)
