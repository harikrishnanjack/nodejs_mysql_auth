const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
users.use(cors())


process.env.SECRET_KEY = 'secret'

    users.post('/register', (req, res) => {
        const today = new Date()
        const userData = {
          name: req.body.name,
          store: req.body.store,
          place: req.body.place,
          phone: req.body.phone,
          username: req.body.username,
          password: req.body.password,
          created: today
        }
       
      
        User.findOne({
          where: {
            username: req.body.username,
            // email: req.body.email
          }
        })
          //TODO bcrypt
          .then(user => {
            if (!user) {
              User.create(userData)
                .then(user => {
                  let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440
                  })
                  res.json({ token: token })
                })
                .catch(err => {
                  res.send('error: ' + err)
                })
            } else {
              res.json({ error: 'User already exists' })
            }
          })
          .catch(err => {
            res.send('error: ' + err)
          })
      })
      


users.post('/login', (req, res) => {
  User.findOne({
    where: {
      // email: req.body.email,
      username: req.body.username,
      password: req.body.password
    }
  })
    .then(user => {
      if (user) {
        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
          expiresIn: 1440
        })
        res.json({ token: token })
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

users.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  User.findOne({
    where: {
      id: decoded.id
    }
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

module.exports = users