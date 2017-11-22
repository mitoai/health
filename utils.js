const monitoring = require('@google-cloud/monitoring')
const regression = require('regression')

function printValues (values) {
  const sortedByValue = values.concat().sort(({value: v1}, {value: v2}) => v1 - v2)
  const smallestValue = sortedByValue[0].value
  const largestValue = sortedByValue[sortedByValue.length - 1].value
  const width = 20
  for (const {value, time} of values) {
    const percent = (value - smallestValue) / (largestValue - smallestValue)
    const percentInt = Math.floor(percent * width)
    const s = Array.from(new Array(percentInt)).reduce((acc) => acc + '#', '') + Array.from(new Array(width - percentInt)).reduce((acc) => acc + ' ', '')
    process.stdout.write(`${value}  ${time.toISOString()}  ${s}\n`)
  }
}

async function fetchValues (projectId, subscriptionId, sampleMinutes = 60) {
  const client = new monitoring.MetricServiceClient()
  const filter = `metric.type = "pubsub.googleapis.com/subscription/num_undelivered_messages" AND resource.labels.subscription_id = "${subscriptionId}"`
  const request = {
    name: client.projectPath(projectId),
    filter: filter,
    interval: {
      startTime: {
        seconds: Date.now() / 1000 - 60 * sampleMinutes
      },
      endTime: {
        seconds: Date.now() / 1000
      }
    }
  }
  const res = await client
    .listTimeSeries(request)
  const {points} = res[0][0]
  return points
    .map(({interval: {startTime, endTime}, value: {int64Value}}) => ({
      time: new Date(startTime.seconds * 1000),
      value: parseInt(int64Value)
    }))
}

function isHealthy (values, confidence) {
  const data = values.map(({value}, i) => {
    return [i, value]
  })
  const result = regression.linear(data)
  return result.r2 > confidence ? result.equation[0] >= 0 : true
}

module.exports = {
  isHealthy,
  fetchValues,
  printValues
}
