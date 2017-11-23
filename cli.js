#!/usr/bin/env node

const program = require('commander')
const pkg = require('./package.json')
const {fetchValues, isHealthy, printValues} = require('./utils')

async function healthCheck (subscriptionId, sampleMinutes, confidence, projectId) {
  const values = await fetchValues(projectId, subscriptionId, sampleMinutes)
  console.log('Calculating subscription health for ' + subscriptionId)
  printValues(values)
  const healthy = isHealthy(values, confidence)
  console.log('Healthy?', healthy ? 'YES' : 'NO')
  process.exit(healthy ? 0 : 1)
}

let taken = false

program
  .version(pkg.version)

program
  .command('pubsub <subscriptionId>')
  .description('Check pubsub subscription health')
  .option('-m --sampleMinutes <minutes>', 'Sample duration in minutes. Default is 20 minutes.', parseInt)
  .option('-c --confidence <confidence>', 'Confidence for passing between 0 and 1. Default is 0.75', parseFloat)
  .option('-p --project <project>', 'Google Cloud project name. Defaults to "ntnu-smartmedia"')
  .action((subscriptionId, options) => {
    taken = true
    healthCheck(
      subscriptionId,
      options.sampleMinutes || 20,
      options.confidence || 0.75,
      options.project || 'ntnu-smartmedia')
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
