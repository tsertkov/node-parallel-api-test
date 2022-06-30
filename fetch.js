import fetch from 'node-fetch'

let callcount = 0

export default function fetchWithCounter (...args) {
  fetchWithCounter.calls++
  return fetch.apply(this, args)
}

fetchWithCounter.calls = 0
