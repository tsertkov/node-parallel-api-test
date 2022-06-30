import fetch from './fetch.js'
import runTests from './tests.js'
import testConfig from './config.json' assert {type: 'json'}

let stop
let processingTime

;(async () => {
  const start = process.hrtime()
  const testResults = await runTests(testConfig)
  stop = process.hrtime(start)

  const stats = testResultsStats(testResults)
  processingTime = stats.time
  logTestResults(testResults, stats)

  if (stats.failed) process.exit(1)
})()

function testResultsStats (testResults) {
  return testResults.reduce((a, { passed, time }) => {
    a.time += time
    a[passed ? 'passed' : 'failed']++
    return a
  }, { passed: 0, failed: 0, time: 0 })
}

function logTestResults (testResults, { passed, failed }) {
  testResults.forEach(({ name, passed, time }, i) => {
    const passedStr = passed ? 'passed' : 'failed'
    console.log(`#${i.toString().padEnd(8)} ${name.padEnd(50)} ${passedStr.padEnd(10)} ${time}s`)
  })

  console.log(`Test results: ${passed} passed, ${failed} failed`)
}

process.on('exit', () => {
  const elapsed = (stop[0] * 1e9 + stop[1]) / 1e9
  console.log(`Total execution time: ${elapsed}s`)
  console.log(`Aggregated test processing time: ${processingTime}s`)
  console.log(`Parallel execution speedup: ${Math.round(processingTime / elapsed)} times faster then sequential execution`)
  console.log(`Fetch was called ${fetch.calls} times`)
})
