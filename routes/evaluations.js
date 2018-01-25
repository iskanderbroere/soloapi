const router = require('express').Router()
const { Evaluation } = require('../models')
const { Student } = require('../models')
const passport = require('../config/auth')

router
  .get('/students/:id/evaluations', (req, res, next) => {
    const studentId = req.params.id
    Student.findById(studentId)
      .then((student) => {
        res.json(student.evaluationIds)
      })
      .catch((error) => next(error))
    // Evaluation.find()
    // Newest evaluations first
    // .sort({ createdAt: -1 })
    // Send the data in JSON format
    // .then((evaluations) => res.json(evaluations))
    // Throw a 500 error if something goes wrong
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
    // maybe nest evaluations in students
    // Once authorized, the user data should be in `req.account`!
    if (!req.account) {
      const error = new Error('Unauthorized')
      error.status = 401
      return next(error)
    }
    const studentId = req.params.id
    const newEvaluation = req.body
    // newEvaluation.authorId = req.account._id
    // hmm
    // update student here (evaluationIds and lastEvaluation)
    Evaluation.create(newEvaluation)
      .then((evaluation) => {
        Student.findByIdAndUpdate(
          // can test with id from db
          studentId,
          {
            $push: {evaluationIds: evaluation},
            lastEvaluation: evaluation.color
          }
        ).then(res => console.log('callback for s update', res))
        res.status = 201
        res.json(evaluation)
      })
      .catch((error) => next(error))
  })
  .put('/evaluations/:id', (req, res, next) => {
    const evalId = req.params.id
    const update = req.body

    Evaluation.findByIdAndUpdate(evalId, update)
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
  // i don't need this
  // .delete('/evaluations/:id', (req, res, next) => {
  //   const classyId = req.params.id

  //   Evaluation.findOneAndRemove(classyId)
  //     .then((evaluation) => {
  //       if (!evaluation) return next()
  //       res.json(evaluation)
  //     })
  //     .catch((error) => next(error))
  // })

module.exports = router
