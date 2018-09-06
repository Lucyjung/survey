const mongoose = require('mongoose')
const Schema = mongoose.Schema

var SurveySchema = new Schema({
  name: String,
  status: Boolean,
  score: Object
}, {
  timestamps: true,
  versionKey: false
})

const Topic = mongoose.model('topic', SurveySchema)
module.exports = {
  addTopic: async (name) => {
    let query = await getTopicByName(name)
    if (query.length === 0) {
      const survey = new Topic({
        name: name,
        status: true,
        score: {}
      })
      await survey.save()
      return 'Topic ' + name + ' Has Been Added!!'
    } else {
      return name + ' Already Exist!'
    }
  },
  getTopic: async (name) => {
    let query = {
      status: true
    }
    if (name) {
      query.name = name
    }
    let queries = await Topic.find(query, {
      '_id': 0,
      'name': 1,
      'score': 1,
      'createdAt': 1,
      'updatedAt': 1
    })
    return queries
  },
  updateScore: async (name, participant, score) => {
    let query = await getTopicByName(name)
    if (query.length === 1) {
      participant = participant.split('.').join('_')

      let toUpdateScore = query[0].score || {}
      toUpdateScore[participant] = score
      await Topic.findOneAndUpdate({
        name: name
      }, {
        score: toUpdateScore
      })
      return 'Update Completed!'
    } else if (query.length === 0) {
      return 'Cannot Find Topic Name ' + name
    } else {
      return 'Duplicate Name ' + name
    }
  },
  deleteTopic: async (name) => {
    let query = await getTopicByName(name)
    if (query.length > 0) {
      await Topic.updateMany({ name: name }, { status: false })
      return 'Delete Completed!'
    } else {
      return 'Cannot Find Topic Name ' + name
    }
  }
}
async function getTopicByName (name) {
  let queries = await Topic.find({
    status: true,
    name: name
  })
  return queries
}
