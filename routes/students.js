const router = require('express').Router()
const { Student } = require('../models')
const { Class } = require('../models')
const passport = require('../config/auth')
// const mockstudents = require('../db/fixtures/students.json')

const authenticate = passport.authorize('jwt', { session: false })

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
  .get('/classes/:batchNumber/students', authenticate, (req, res, next) => {
    const batchNumber = req.params.batchNumber
    Class.findOne({ batchNumber: batchNumber }).populate('studentIds')
      .then(ans => res.json(ans))
      .catch(err => console.log(err))
    // Class.findOne({ batchNumber: batchNumber })
    //   .then((classObject) => {
    //     console.log(classObject)
    //     const studentsInClass = classObject.studentIds.map((student) => {
    //       return student
    //     })
    //     // does this return a student object or some sort of reference?
    //     res.json(studentsInClass)
    //   })
    // // Newest students first
    // // .sort({ createdAt: -1 })
    // // Send the data in JSON format
    // // .then((students) => res.json(students))
    // // Throw a 500 error if something goes wrong
    //   .catch((error) => next(error))
  })
  .get('/classes/:batchNumber/students/random', authenticate, (req, res, next) => {
    // Student.find()
    const batchNumber = req.params.batchNumber
    Class.findOne({ batchNumber: batchNumber })
      .then((classObject) => {
        Student.find({ '_id': { $in: classObject.studentIds } })
          .then(students => {
            if (students.length < 1) return console.error('No students in this class!')
            // this still errors when students.length === 0
            // const filteredStudents = mockstudents.filter(student => student.lastEvaluation === getRandomGroup())
            const filteredStudents = filterStudents(students)
            const noEmptyGroup = filteredStudents.length > 0 ? filteredStudents : students
            console.log(noEmptyGroup)
            // try to deal with empty groups
            // while (filteredStudents.length < 1) {
            //   this.filteredStudents = filterStudents(students)
            //   return filteredStudents
            // }
            const randomStudentIndex = randomNumber(0, (noEmptyGroup.length - 1))
            const randomStudent = noEmptyGroup[randomStudentIndex]
            console.log('This is the random student: ', randomStudent)
            res.json(randomStudent)
          })
          .catch(err => console.error('dsdsjfkldskdfs', err))
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
  .get('/classes/:batchNumber/students/:id', authenticate, (req, res, next) => {
    const id = req.params.id
    Student.findById(id).populate('evaluationIds')
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
  .post('/classes/:batchNumber/students', authenticate, (req, res, next) => {
    console.log(req.account)
    // Once authorized, the user data should be in `req.account`!
    // if (!req.account) {
    //   const error = new Error('Unauthorized')
    //   error.status = 401
    //   return next(error)
    // }

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
