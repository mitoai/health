#!/usr/bin/env node

const program = require('commander')
const pkg = require('./package.json')
const {fetchValues, isLinRegHealthy, printValues, isSumHealthy} = require('./utils')

const metrics = {
  'acked': 'pubsub.googleapis.com/subscription/pull_ack_request_count',
  'undelivered': 'pubsub.googleapis.com/subscription/num_undelivered_messages'
}

async function linRegHealthCheck (subscriptionId, sampleMinutes, confidence, projectId, metric) {
  const values = await fetchValues(projectId, subscriptionId, metrics[metric], sampleMinutes)
  console.log('Calculating subscription health for ' + subscriptionId)
  printValues(values)
  const healthy = isLinRegHealthy(values, confidence)
  console.log('Healthy?', healthy ? 'YES' : 'NO')
  process.exit(healthy ? 0 : 1)
}

async function sumHealthCheck (subscriptionId, sampleMinutes, max, min, projectId, metric) {
  const values = await fetchValues(projectId, subscriptionId, metrics[metric], sampleMinutes)
  console.log('Calculating subscription health for ' + subscriptionId)
  printValues(values)
  const healthy = isSumHealthy(values, s => {
    return (max === undefined || max > s) && (min === undefined || min < s)
  })
  console.log('Healthy?', healthy ? 'YES' : 'NO')
  process.exit(healthy ? 0 : 1)
}

let taken = false

program
  .version(pkg.version)
  .option('-p --project <project>', 'Google Cloud project name. Defaults to "ntnu-smartmedia"', 'ntnu-smartmedia')
  .option('-M --metric <metric>', 'Metric type can be "acked" or "undelivered". Defaults  to "undelivered"', /^(undelivered|acked)$/i, 'undelivered')

program
  .command('linreg <subscriptionId>')
  .description('Linear regression test on subscription')
  .option('-m --sampleMinutes <minutes>', 'Sample duration in minutes. Default is 20 minutes.', parseInt, 20)
  .option('-c --confidence <confidence>', 'Confidence for passing between 0 and 1. Default is 0.75.', parseFloat, 0.75)
  .action((subscriptionId, options) => {
    taken = true
    linRegHealthCheck(
      subscriptionId,
      options.sampleMinutes,
      options.confidence,
      options.parent.project,
      options.parent.metric)
      .catch(err => {
        console.error('Failed with error:', err)
        process.exit(2)
      })
  })

program
  .command('sum <subscriptionId>')
  .description('Sum test on subscription')
  .option('-m --sampleMinutes <minutes>', 'Sample duration in minutes. Default is 20 minutes.', parseInt, 20)
  .option('-g --greaterThan <count>', 'The count that the sum of messages should exceed', parseInt)
  .option('-l --lessThan <count>', 'The count that the sum of messages should be less than', parseInt)
  .action((subscriptionId, options) => {
    taken = true
    sumHealthCheck(
      subscriptionId,
      options.sampleMinutes,
      options.lessThan,
      options.greaterThan,
      options.parent.project,
      options.parent.metric)
      .catch(err => {
        console.error('Failed with error:', err)
        process.exit(2)
      })
  })
program.parse(process.argv)

if (!taken) {
  program.outputHelp()
  process.exit(2)
}
