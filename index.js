import fetch from './fetch.js'
import runTests from './tests.js'
import testConfig from './config.json' assert {type: 'json'}

let stop
let processingTime

;(async () => {
  const start = process.hrtime()
  const res = await runTests(testConfig)
  stop = process.hrtime(start)
  processingTime = countTestProcessingTime(res)
  logTestResults(res, processingTime)
})()

function countTestProcessingTime (testResults) {
  return testResults.reduce((total, { time }) => total + time, 0)
}

function logTestResults (testResults) {
  testResults.forEach(({ name, passed, time }, i) => {
    const passedStr = passed ? 'passed' : 'failed'
    console.log(`#${i.toString().padEnd(8)} ${name.padEnd(50)} ${passedStr.padEnd(10)} ${time}s`)
  })

  const [ passed, failed ] = testResults.reduce((a, { passed }) => {
    a[passed ? 0 : 1]++
    return a
  }, [ 0, 0 ])

  console.log(`Test results: ${passed} passed, ${failed} failed`)
}

process.on('exit', () => {
  const elapsed = (stop[0] * 1e9 + stop[1]) / 1e9
  console.log(`Total execution time: ${elapsed}s`)
  console.log(`Aggregated test processing time: ${processingTime}s`)
  console.log(`Parallel execution speedup: ${Math.round(processingTime / elapsed)} times faster then sequential execution`)
  console.log(`Fetch was called ${fetch.calls} times in ${elapsed} seconds`)
})
