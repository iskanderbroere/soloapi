const mongoose = require('../config/database')
const { Schema } = mongoose

const recipeSchema = new Schema({
  fullName: { type: String, required: true },
  picUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('recipes', recipeSchema)
