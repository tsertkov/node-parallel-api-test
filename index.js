import fetch from './fetch.js'
import runTests from './tests.js'
import testConfig from './config.json' assert {type: 'json'}

let stop

;(async () => {
  const start = process.hrtime()
  const res = await runTests(testConfig)
  stop = process.hrtime(start)
  logTestResults(res)
})()

function logTestResults (testResults) {
  testResults.forEach(({ name, passed, time }, i) => {
    const passedStr = passed ? 'passed' : 'failed'
    console.log(`#${i.toString().padEnd(8)} ${name.padEnd(50)} ${passedStr.padEnd(10)} ${time}s`)
  })
}

process.on('exit', () => {
  console.log(`Fetch was called ${fetch.calls} times in ${(stop[0] * 1e9 + stop[1])/1e9} seconds`)
})

