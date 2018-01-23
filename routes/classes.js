const router = require('express').Router()
const { Class } = require('../models')
const passport = require('../config/auth')

router.get('/classes', (req, res, next) => {
  Class.find()
    .sort({ batchNumber: -1 })
    .then((classes) => res.json(classes))
    .catch((error) => next(error))
})
  .get('/classes/:batchNumber', (req, res, next) => {
    const batchNumber = req.params.batchNumber
    Class.findOne({ batchNumber: batchNumber }).populate('studentIds')
      .then((classObject) => {
        if (!classObject) { return next() }
        res.json(classObject)
      })
      .catch((error) => next(error))
  })
  // need AUTH for this route!!
  .post('/classes', (req, res, next) => {
    // Once authorized, the user data should be in `req.account`!
    // if (!req.account) {
    //   const error = new Error('Unauthorized')
    //   error.status = 401
    //   return next(error)
    // }

    let newStudent = req.body
    // newStudent.authorId = req.account._id

    Class.create(newStudent)
      .then((classObject) => {
        res.status = 201
        res.json(classObject)
      })
      .catch((error) => next(error))
  })
  .put('/classes/:id', (req, res, next) => {
    const classObjectId = req.params.id
    let update = req.body

    Class.findOneAndUpdate(classObjectId, update)
      .then((classObject) => {
        if (!classObject) return next()
        res.json(classObject)
      })
      .catch((error) => next(error))
  })
  .patch('/classes/:id', (req, res, next) => {
    const classObjectId = req.params.id
    let update = req.body

    Class.findOneAndUpdate(classObjectId, update)
      .then((classObject) => {
        if (!classObject) return next()
        res.json(classObject)
      })
      .catch((error) => next(error))
  })
  // i don't need this
  // .delete('/classes/:id', (req, res, next) => {
  //   const classObjectId = req.params.id

  //   Class.findOneAndRemove(classObjectId)
  //     .then((classObject) => {
  //       if (!classObject) return next()
  //       res.json(classObject)
  //     })
  //     .catch((error) => next(error))
  // })

module.exports = router
