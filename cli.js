#!/usr/bin/env node

const program = require('commander')
const pkg = require('./package.json')
const {fetchValues, isHealthy, printValues} = require('./utils')
const projectId = 'ntnu-smartmedia'

async function healthCheck (subscriptionId, sampleMinutes, confidence) {
  const values = await fetchValues(projectId, subscriptionId, sampleMinutes)
  console.log('Calculating subscription health for ' + subscriptionId)
  printValues(values)
  const healthy = isHealthy(values, confidence)
  console.log('Healthy?', healthy ? 'YES' : 'NO')
  process.exit(healthy ? 0 : 1)
}

program
  .version(pkg.version)

program
  .command('pubsub <subscriptionId>')
  .description('Check pubsub subscription health')
  .option('-m --sampleMinutes <minutes>', 'Sample duration in minutes. Default is 20 minutes.', parseInt)
  .option('-c --confidence <confidence>', 'Confidence for passing between 0 and 1. Default is 0.75', parseFloat)
  .action((subscriptionId, options) => {
    healthCheck(subscriptionId, options.sampleMinutes || 20, options.confidence || 0.75)
  })

program.parse(process.argv)
