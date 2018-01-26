// db/seed.js
const request = require('superagent')
const user = require('./fixtures/teacher.json')
// const classes = require('./fixtures/classes.json')
// const students = require('./fixtures/students.json')

const createUrl = (path) => {
  return `${process.env.HOST || `http://localhost:${process.env.PORT || 3030}`}${path}`
}

// const createClasses = (token) => {
//   return classes.map((classy) => {
//     return request
//       .post(createUrl('/classes'))
//       .set('Authorization', `Bearer ${token}`)
//       .send(classy)
//       .then((res) => {
//         console.log('Class seeded...', res.body)
//       })
//       .catch((err) => {
//         console.error('Error seeding class!', err)
//       })
//   })
// }

// const createStudents = (token) => {
//   return students.map((student) => {
//     return request
//       .post(createUrl('/students'))
//       .set('Authorization', `Bearer ${token}`)
//       .send(student)
//       .then((res) => {
//         console.log('Student seeded...', res.body)
//       })
//       .catch((err) => {
//         console.error('Error seeding student!', err)
//       })
//   })
// }

const authenticate = (email, password) => {
  request
    .post(createUrl('/sessions'))
    .send({ email, password })
    .then((res) => {
      console.log('Authenticated!')
      // createStudents(res.body.token)
      // return createClasses(res.body.token)
    })
    .catch((err) => {
      console.error('Failed to authenticate!', err.message)
    })
}

request
  .post(createUrl('/users'))
  .send(user)
  .then((res) => {
    console.log('User (teacher) created!')
    return authenticate(user.email, user.password)
  })
  .catch((err) => {
    console.error('Could not create user', err.message)
    console.log('Trying to continue...')
    authenticate(user.email, user.password)
  })
