const router = require('express').Router()
const { Evaluation } = require('../models')
const { Student } = require('../models')
const passport = require('../config/auth')

router
  .get('/students/:id/evaluations', (req, res, next) => {
    const studentId = req.params.id
    Student.findById(studentId)
      .sort({ date: 'asc' })
      .then((student) => {
        res.json(student.evaluationIds)
      })
      .catch((error) => next(error))
  })
  .get('/evaluations/:id', (req, res, next) => {
    const id = req.params.id
    Evaluation.findById(id)
      .then((evaluation) => {
        if (!evaluation) { return next() }
        res.json(evaluation)
      })
      .catch((error) => next(error))
  })
  .post('/students/:id/evaluations', passport.authorize('jwt', { session: false }), (req, res, next) => {
    if (!req.account) {
      const error = new Error('Unauthorized')
      error.status = 401
      return next(error)
    }
    const studentId = req.params.id
    const newEvaluation = { ...req.body, date: req.body.date.slice(0, 10) }

    Evaluation.create(newEvaluation)
      .then((evaluation) => {
        Student.findByIdAndUpdate(studentId, { $push: {evaluationIds: evaluation}, lastEvaluation: evaluation.color })
          .then(res => res.json(res))
        res.status = 201
        res.json(evaluation)
      })
      .catch((error) => next(error))
  })
  .put('/evaluations/:id', (req, res, next) => {
    const evalId = req.params.id
    const update = req.body

    Evaluation.findByIdAndUpdate(evalId, update, { new: true })
      .then((evaluation) => {
        if (!evaluation) return next()
        res.json(evaluation)
      })
      .catch((error) => next(error))
  })
  .patch('/evaluations/:id', (req, res, next) => {
    const evalId = req.params.id
    const update = req.body

    Evaluation.findByIdAndUpdate(evalId, update)
      .then((evaluation) => {
        if (!evaluation) return next()
        res.json(evaluation)
      })
      .catch((error) => next(error))
  })
module.exports = router
