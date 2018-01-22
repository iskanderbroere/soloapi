const mongoose = require('../config/database')
const { Schema } = mongoose

const recipeSchema = new Schema({
  color: { type: Number, required: true, default: 1 },
  date: { type: Date, required: true, default: Date.now },
  remark: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('recipes', recipeSchema)
