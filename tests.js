import { strict as assert } from 'node:assert'
import plimit from 'p-limit'
import masynco from 'masynco'
import { fetchWithStats as fetch } from './fetch.js'

const tests = [{
  name: 'GET /get should return query params',
  path: '/get',
  fn: testGetEcho,
}, {
  name: 'POST /post should return body params',
  path: '/post',
  fn: testPostEcho,
}]

const testParams = {
  get: [
    { key1: 'value1' },
    { key1: 'value1', key2: 'value2' },
    { '?key1': 'value1', key2: 'value2' },
    { '?key1': 'value1', key2: '' },
    { '?': 'value1', key2: '' },
    [{ '': 'value1', key2: '' }, { key2: '' }],
  ],
  post: [
    { key1: 'value1' },
    { key1: 'value1', key2: 'value2' },
    { '?key1': 'value1', key2: 'value2' },
    { '?key1': 'value1', key2: '' },
    { '?': 'value1', key2: '' },
    { '': 'value1', key2: '' },
    { '': 'value1', key2: null },
    [{ '': 'value1', key2: undefined }, { '': 'value1' }],
    [{ '': 'value1', key2: NaN }, { '': 'value1', key2: null }],
  ],
}

export default async function runAllTests (config) {
  const allTests = []
  for (let i = 0; i < config.repeat; i++) {
    allTests.push(...tests)
  }

  let i = 0
  return masynco(allTests, async (test) => {
    const { endpoint } = config
    const { name, path } = test

    i++
    const logPrefix = `#${i}`
    console.log(`${logPrefix} ${name}`)

    const start = process.hrtime()
    let passed = false
    try {
      await test.fn({
        url: endpoint + path,
      })
      passed = true
    } catch (err) {
      console.log(err)
    }

    const stop = process.hrtime(start)
    const time = (stop[0] * 1e9 + stop[1]) / 1e9
    console.log(`${logPrefix} ` + (passed ? 'passed' : 'failed') + ` in ${time} seconds`)

    return {
      name,
      time,
      passed,
    }
  }, plimit(config.parallel))
}

function parseTestParams (testParams) {
  return Array.isArray(testParams)
    ? testParams
    : [ testParams, testParams ]
}

async function testGetEcho({ url }) {
  return masynco(testParams.get, async (testParams) => {
    const [ inputParams, expectedParams ] = parseTestParams(testParams)
    const qs = new URLSearchParams(inputParams).toString()
    const urlWithParams = `${url}?${qs}`

    const res = await fetch(urlWithParams)
    const { args: outputParams } = await res.json()

    assert.deepEqual(outputParams, expectedParams)
  })
}

async function testPostEcho({ url }) {
  return masynco(testParams.post, async (testParams) => {
    const [ inputParams, expectedParams ] = parseTestParams(testParams)

    const res = await fetch(url, {
      method: 'post',
      body: JSON.stringify(inputParams),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const { data: outputParams } = await res.json()
    assert.deepEqual(outputParams, expectedParams)
  })
}
