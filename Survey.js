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
  },
  getSummary: async (name) => {
    let query = await getTopicByName(name)
    if (query.length > 0) {
      let scores = query[0].score
      let summary = pureCalculation(scores)
      return summary
    } else {
      return 0
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
// Magic Score Calculation by Pure (PT)
function pureCalculation(scores) {
  /* eslint-disable camelcase */
  let userCount = 0
  let sum1_1 = 0
  let sum1_2 = 0
  let sum1_3 = 0
  let sum2_1 = 0
  let sum2_2 = 0
  let sum2_3 = 0
  let sum2_4 = 0
  let sum2_5 = 0
  let sum3_1 = 0
  let sum3_2 = 0
  let sum3_3 = 0
  let comment1 = []
  let comment2 = []
  for (let user in scores) {
    let survey = scores[user].survey
    sum1_1 += parseInt(survey[1]) - parseInt(survey[0])
    sum1_2 += parseInt(survey[2])
    sum1_3 += parseInt(survey[3])
    sum2_1 += parseInt(survey[4])
    sum2_2 += parseInt(survey[5])
    sum2_3 += parseInt(survey[6])
    sum2_4 += parseInt(survey[7])
    sum2_5 += parseInt(survey[8])
    sum3_1 += parseInt(survey[9])
    sum3_2 += parseInt(survey[10])
    sum3_3 += parseInt(survey[11])
    if (scores[user].comment1 !== '') {
      comment1.push(scores[user].comment1)
    }
    if (scores[user].comment2 !== '') {
      comment2.push(scores[user].comment2)
    }
    
    userCount++
  }
  let ave1_1 = sum1_1 / userCount
  let ave1_2 = sum1_2 / userCount
  let ave1_3 = sum1_3 / userCount
  let ave2_1 = sum2_1 / userCount
  let ave2_2 = sum2_2 / userCount
  let ave2_3 = sum2_3 / userCount
  let ave2_4 = sum2_4 / userCount
  let ave2_5 = sum2_5 / userCount
  let ave3_1 = sum3_1 / userCount
  let ave3_2 = sum3_2 / userCount
  let ave3_3 = sum3_3 / userCount

  let ave1 = (ave1_1 + ave1_2 + ave1_3) / 3
  let ave2 = (ave2_1 + ave2_2 + ave2_3 + ave2_4 + ave2_5) / 5
  let ave3 = (ave3_1 + ave3_2 + ave3_3) / 3

  let totalScore = ((ave1 * 4) + (ave2 * 4) + (ave3 * 2)) / (4 + 4 + 2)

  let result = {
    content: ave1,
    lecturer: ave2,
    venue: ave3,
    total: totalScore,
    merit: comment1,
    comment: comment2,
    count: userCount
  }
  /* eslint-enable camelcase */

  return result
}