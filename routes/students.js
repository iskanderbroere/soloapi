const router = require('express').Router()
const { Student } = require('../models')
const passport = require('../config/auth')

const randomNumber = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomGroup = () => {
  const gamble = randomNumber(1, 100)
  if (gamble < 48) { return 3 } else if (gamble > 78) { return 1 } return 2
}

router
  .get('/students', (req, res, next) => {
    Student.find()
    // Newest students first
      .sort({ createdAt: -1 })
    // Send the data in JSON format
      .then((students) => res.json(students))
    // Throw a 500 error if something goes wrong
      .catch((error) => next(error))
  })
  .get('/students/random', (req, res, next) => {
    // Student.find()
    Student.where('lastEvaluation').equals(getRandomGroup())
      .then((students) => {
        // if there are no evaluated students this probably errors
        const randomStudentIndex = randomNumber(0, students.length)
        const randomStudent = students[randomStudentIndex]
        console.log(randomStudent)
        res.json(randomStudent)
      })
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
  .delete('/students/:id', (req, res, next) => {
    const studentId = req.params.id

    Student.findOneAndRemove(studentId)
      .then((student) => {
        if (!student) return next()
        res.json(student)
      })
      .catch((error) => next(error))
  })

module.exports = router
