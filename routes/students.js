const router = require('express').Router()
const { Student } = require('../models')
const passport = require('../config/auth')

router.get('/students', (req, res, next) => {
  Student.find()
    // Newest students first
    .sort({ createdAt: -1 })
    // Send the data in JSON format
    .then((students) => res.json(students))
    // Throw a 500 error if something goes wrong
    .catch((error) => next(error))
  })
  .get('/students/:id', (req, res, next) => {
    const id = req.params.id
    Student.findById(id)
      .then((student) => {
        if (!student) { return next() }
        res.json(student)
      })
      .catch((error) => next(error))
  })
  .post('/students', passport.authorize('jwt', { session: false }), (req, res, next) => {
    // Once authorized, the user data should be in `req.account`!
    if (!req.account) {
      const error = new Error('Unauthorized')
      error.status = 401
      return next(error)
    }

    let newStudent = req.body
    // newStudent.authorId = req.account._id

    Student.create(newStudent)
      .then((student) => {
        res.status = 201
        res.json(student)
      })
      .catch((error) => next(error))
  })
  .put('/students/:id', (req, res, next) => {
    const studentId = req.params.id
    let update = req.body

    Student.findOneAndUpdate(studentId, update)
      .then((student) => {
        if (!student) return next()
        res.json(student)
      })
      .catch((error) => next(error))
  })
  .patch('/students/:id', (req, res, next) => {
    const studentId = req.params.id
    let update = req.body

    Student.findOneAndUpdate(studentId, update)
      .then((student) => {
        if (!student) return next()
        res.json(student)
      })
      .catch((error) => next(error))
  })
  // i don't need this
  // .delete('/students/:id', (req, res, next) => {
  //   const studentId = req.params.id

  //   Student.findOneAndRemove(studentId)
  //     .then((student) => {
  //       if (!student) return next()
  //       res.json(student)
  //     })
  //     .catch((error) => next(error))
  // })

module.exports = router
