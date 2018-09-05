const express = require('express')
const app = express()
const survey = require('./Survey.js')
const mongoose = require('mongoose')

mongoose.connect('mongodb://10.164.232.31/survey', { useNewUrlParser: true })

app.use(express.json()) // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })) // to support URL-encoded bodies

app.get('/', (req, res) => res.send('Hello World!')) // TODO: replace with frontend
app.post('/topic/', async (req, res) => {
  if (req.body.name) {
    let result = await survey.addTopic(req.body.name)
    res.send(result)
  } else {
    res.send('Name is required Parameter')
  }
})

app.get('/topic/', async (req, res) => {
  let result = await survey.getTopic()
  res.json(result)
})

app.get('/topic/:name', async (req, res) => {
  let result = await survey.getTopic(req.params.name)
  res.json(result)
})

app.put('/score/', async (req, res) => {
  let result = await survey.updateScore(req.body.name, req.body.participant, req.body.score)
  res.send(result)
})
app.delete('/topic/', async (req, res) => {
  let result = await survey.deleteTopic(req.body.name)
  res.send(result)
})

app.listen(process.env.PORT || 1234, () => {
  /* eslint-disable no-console */
  console.log('Survey app listening on port 1234!')
  /* eslint-enable no-console */
})
