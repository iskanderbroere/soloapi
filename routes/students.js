const router = require('express').Router()
const { Student } = require('../models')
const { Class } = require('../models')
const passport = require('../config/auth')

const authenticate = passport.authorize('jwt', { session: false })

const randomNumber = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomGroup = () => {
  const gamble = randomNumber(1, 100)
  if (gamble < 48) { return 3 } else if (gamble > 78) { return 1 } return 2
}

const filterStudents = (students) => {
  return students.filter(student => student.lastEvaluation === getRandomGroup())
}

router
  .get('/classes/:batchNumber/students/random', authenticate, (req, res, next) => {
    const batchNumber = req.params.batchNumber
    Class.findOne({ batchNumber: batchNumber })
      .then((classObject) => {
        Student.find({ '_id': { $in: classObject.studentIds } })
          .then(students => {
            if (students.length < 1) return console.error('No students in this class!')
            const filteredStudents = filterStudents(students)
            const noEmptyGroup = filteredStudents.length > 0 ? filteredStudents : students
            const randomStudentIndex = randomNumber(0, (noEmptyGroup.length - 1))
            const randomStudent = noEmptyGroup[randomStudentIndex]
            res.json(randomStudent)
          })
          .catch(err => console.error('dsdsjfkldskdfs', err))
      })
      .catch((error) => next(error))
  })
  .get('/classes/:batchNumber/students/:id', authenticate, (req, res, next) => {
    const id = req.params.id
    Student.findById(id).populate({ path: 'evaluationIds', options: { sort: '-date' } })
      .then((student) => {
        if (!student) { return next() }
        res.json(student)
      })
      .catch((error) => next(error))
  })
  .post('/classes/:batchNumber/students', authenticate, (req, res, next) => {
    if (!req.account) {
      let error = new Error('Unauthorized')
      error.status = 401
      return next(error)
    }
    const newStudent = req.body
    const batchNumber = req.params.batchNumber

    Student.create(newStudent)
      .then((student) => {
        Class.findOneAndUpdate({ batchNumber: batchNumber }, {$push: {studentIds: student}})
          .then(res => console.log(res))
        res.status = 201
        res.json(student)
      })
      .catch((error) => next(error))
  })
  .put('/classes/:batchNumber/students/:id', authenticate, (req, res, next) => {
    const studentId = req.params.id
    const update = req.body.update
    // callback responds with old object unless new is specified
    Student.findByIdAndUpdate(studentId, { $set: update }, { new: true })
      .then(student => {
        if (!student) return next()
        res.json(student)
      })
      .catch((error) => next(error))
  })
  .patch('/classes/:batchNumber/students/:id', authenticate, (req, res, next) => {
    const studentId = req.params.id
    const update = req.body.update
    // callback responds with old object unless new is specified
    Student.findByIdAndUpdate(studentId, { $set: update }, { new: true })
      .then(student => {
        if (!student) return next()
        res.json(student)
      })
      .catch((error) => next(error))
  })
  .delete('/classes/:batchNumber/students/:id', authenticate, (req, res, next) => {
    const studentId = req.params.id

    Student.findByIdAndRemove(studentId)
      .then((student) => {
        if (!student) return next()
        res.json(student)
      })
      .catch((error) => next(error))
  })

module.exports = router
