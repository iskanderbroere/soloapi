const router = require('express').Router()
const { Student } = require('../models')
const { Class } = require('../models')
const passport = require('../config/auth')
const mockstudents = require('../db/fixtures/students.json')

const randomNumber = (min, max) => {
  // maybe i don't need this
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomGroup = () => {
  // maybe rename const
  const gamble = randomNumber(1, 100)
  if (gamble < 48) { return 3 } else if (gamble > 78) { return 1 } return 2
}

const filterStudents = (students) => {
  return students.filter(student => student.lastEvaluation === getRandomGroup())
}

router
  .get('/classes/:batchNumber/students', (req, res, next) => {
    const batchNumber = req.params.batchNumber
    Class.findOne({ batchNumber: batchNumber })
      .then((classObject) => {
        console.log(classObject)
        const studentsInClass = classObject.studentIds.map((student) => {
          return student
        })
        // does this return a student object or some sort of reference?
        res.json(studentsInClass)
      })
    // Newest students first
    // .sort({ createdAt: -1 })
    // Send the data in JSON format
    // .then((students) => res.json(students))
    // Throw a 500 error if something goes wrong
      .catch((error) => next(error))
  })
  .get('/classes/:batchNumber/students/random', (req, res, next) => {
    // Student.find()
    const batchNumber = req.params.batchNumber
    Class.findOne({ batchNumber: batchNumber })
      .then((students) => {
        if (students.length < 1) return console.error('No students in this class!')
        // this still errors when students.length === 0
        // const filteredStudents = mockstudents.filter(student => student.lastEvaluation === getRandomGroup())
        let filteredStudents = filterStudents(students)
        // try to deal with empty groups
        // while (filteredStudents.length < 1) {
        //   this.filteredStudents = filterStudents(students)
        //   return filteredStudents
        // }
        const randomStudentIndex = randomNumber(0, filteredStudents.length)
        const randomStudent = filteredStudents[randomStudentIndex]
        console.log('This is the random student: ', randomStudent)
        res.json(randomStudent)
      })
      .catch((error) => next(error))
    // Student.where('lastEvaluation').equals(getRandomGroup())
    //   .then((students) => {
    //     // if there are no evaluated students (in each group) this probably errors
    //     const randomStudentIndex = randomNumber(0, students.length)
    //     const randomStudent = students[randomStudentIndex]
    //     console.log('This is the random student: ', randomStudent)
    //     res.json(randomStudent)
    //   })
  })
  .get('/classes/:batchNumber/students/:id', (req, res, next) => {
    const id = req.params.id
    Student.findById(id)
      .then((student) => {
        if (!student) { return next() }
        res.json(student)
      })
      .catch((error) => next(error))
    // Newest students first
    // .sort({ createdAt: -1 })
    // Send the data in JSON format
    // .then((students) => res.json(students))
  })
  .post('/classes/:batchNumber/students', passport.authorize('jwt', { session: false }), (req, res, next) => {
    // Once authorized, the user data should be in `req.account`!
    if (!req.account) {
      const error = new Error('Unauthorized')
      error.status = 401
      return next(error)
    }

    const newStudent = req.body
    const batchNumber = req.params.batchNumber
    // newStudent.authorId = req.account._id

    Student.create(newStudent)
      .then((student) => {
        Class.findOneAndUpdate({ batchNumber: batchNumber }, {$push: {studentIds: student}})
          .then(res => console.log(res))
        res.status = 201
        res.json(student)
      })
      .catch((error) => next(error))
  })
  // fix this
  .put('/classes/:batchNumber/students/:id', (req, res, next) => {
    const studentId = req.params.id
    const update = req.body

    Student.findByIdAndUpdate(studentId, update)
      .then((student) => {
        if (!student) return next()
        console.log('what', student)
        res.json(student)
      })
      .catch((error) => next(error))
  })
  // fix this
  .patch('/classes/:batchNumber/students/:id', (req, res, next) => {
    const studentId = req.params.id
    const update = req.body

    Student.findByIdAndUpdate(studentId, update)
      .then((student) => {
        if (!student) return next()
        res.json(student)
      })
      .catch((error) => next(error))
  })
  // fix this
  .delete('/classes/:batchNumber/students/:id', (req, res, next) => {
    const studentId = req.params.id

    Student.findByIdAndRemove(studentId)
      .then((student) => {
        if (!student) return next()
        res.json(student)
      })
      .catch((error) => next(error))
  })

module.exports = router
