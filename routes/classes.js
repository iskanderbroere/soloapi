const router = require('express').Router()
const { Class } = require('../models')
const passport = require('../config/auth')

router.get('/classes', (req, res, next) => {
  Class.find()
    // Newest classes first
    .sort({ batchNumber: -1 })
    // Send the data in JSON format
    .then((classes) => res.json(classes))
    // Throw a 500 error if something goes wrong
    .catch((error) => next(error))
})
  .get('/classes/:id', (req, res, next) => {
    const id = req.params.id
    Class.findById(id)
      .then((classy) => {
        if (!classy) { return next() }
        res.json(classy)
      })
      .catch((error) => next(error))
  })
  .post('/classes', passport.authorize('jwt', { session: false }), (req, res, next) => {
    // Once authorized, the user data should be in `req.account`!
    if (!req.account) {
      const error = new Error('Unauthorized')
      error.status = 401
      return next(error)
    }

    let newStudent = req.body
    // newStudent.authorId = req.account._id

    Class.create(newStudent)
      .then((classy) => {
        res.status = 201
        res.json(classy)
      })
      .catch((error) => next(error))
  })
  .put('/classes/:id', (req, res, next) => {
    const classyId = req.params.id
    let update = req.body

    Class.findOneAndUpdate(classyId, update)
      .then((classy) => {
        if (!classy) return next()
        res.json(classy)
      })
      .catch((error) => next(error))
  })
  .patch('/classes/:id', (req, res, next) => {
    const classyId = req.params.id
    let update = req.body

    Class.findOneAndUpdate(classyId, update)
      .then((classy) => {
        if (!classy) return next()
        res.json(classy)
      })
      .catch((error) => next(error))
  })
  // i don't need this
  // .delete('/classes/:id', (req, res, next) => {
  //   const classyId = req.params.id

  //   Class.findOneAndRemove(classyId)
  //     .then((classy) => {
  //       if (!classy) return next()
  //       res.json(classy)
  //     })
  //     .catch((error) => next(error))
  // })

module.exports = router
