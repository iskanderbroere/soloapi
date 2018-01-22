const router = require('express').Router()
const { Evaluation } = require('../models')
const { Student } = require('../models')
const passport = require('../config/auth')

router.get('/evaluations', (req, res, next) => {
  Evaluation.find()
    // Newest evaluations first
    .sort({ createdAt: -1 })
    // Send the data in JSON format
    .then((evaluations) => res.json(evaluations))
    // Throw a 500 error if something goes wrong
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
  .post('/evaluations', passport.authorize('jwt', { session: false }), (req, res, next) => {
    // Once authorized, the user data should be in `req.account`!
    if (!req.account) {
      const error = new Error('Unauthorized')
      error.status = 401
      return next(error)
    }
    const studentId = req.params.id
    console.log('student id', studentId)
    let newEvaluation = req.body
    // newEvaluation.authorId = req.account._id

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
    const classyId = req.params.id
    let update = req.body

    Evaluation.findOneAndUpdate(classyId, update)
      .then((evaluation) => {
        if (!evaluation) return next()
        res.json(evaluation)
      })
      .catch((error) => next(error))
  })
  .patch('/evaluations/:id', (req, res, next) => {
    const classyId = req.params.id
    let update = req.body

    Evaluation.findOneAndUpdate(classyId, update)
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
