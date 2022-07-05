let callcount = 0
let concurrency = []

export const fetchStats = {
  callCount: 0,
  concurrency: [ 0 ],
}

export function fetchWithStats (url, options) {
  const promise = fetch(url, options)
  trackFetch(promise)
  return promise
}

function trackFetch (fetchPromise) {
  fetchStats.callCount++
  const { concurrency } = fetchStats
  concurrency.push(concurrency[concurrency.length - 1] + 1)

  fetchPromise.then(({ body }) => {
    body.on('close', () =>
      concurrency.push(concurrency[concurrency.length - 1] - 1)
    )
  }).catch(() =>
    concurrency.push(concurrency[concurrency.length - 1] - 1)
  )
}

