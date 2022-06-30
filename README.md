# node-parallel-api-test

Example of running api tests in parallel with masynco and p-limit.

## Usage

See `config.json` and adjust configration as necessary:
```json
{
  "endpoint": "https://postman-echo.com",
  "parallel": 30,
  "repeat": 100
}
```

Where:

- `endpoint` - echo api endpoint (See [postman-echo-api](https://learning.postman.com/docs/developer/echo-api/))
- `parallel` - number of tests to run in parallel
- `repeat` - number of runs for each test to generate more load


```bash
% npm i
% node .

#1 GET /get should return query params
#2 POST /post should return body params
#3 GET /get should return query params
#4 POST /post should return body params
#5 GET /get should return query params
#6 POST /post should return body params
#7 GET /get should return query params
#8 POST /post should return body params
#9 GET /get should return query params
#10 POST /post should return body params
#11 GET /get should return query params
#12 POST /post should return body params
#13 GET /get should return query params
#14 POST /post should return body params
#15 GET /get should return query params
#16 POST /post should return body params
#17 GET /get should return query params
#18 POST /post should return body params
#19 GET /get should return query params
#20 POST /post should return body params
#21 GET /get should return query params
#22 POST /post should return body params
#23 GET /get should return query params
#24 POST /post should return body params
#25 GET /get should return query params
#26 POST /post should return body params
#27 GET /get should return query params
#28 POST /post should return body params
#29 GET /get should return query params
#30 POST /post should return body params
#5 passed in 0.630634 seconds
#31 GET /get should return query params
#2 passed in 0.658454792 seconds
#32 POST /post should return body params
#1 passed in 0.696119083 seconds
#33 GET /get should return query params
#4 passed in 0.693322083 seconds
// ...
#196      GET /get should return query params                passed     0.580087125s
#197      POST /post should return body params               passed     0.73080225s
#198      GET /get should return query params                passed     0.542092625s
#199      POST /post should return body params               passed     0.674121375s
Test results: 200 passed, 0 failed
Total execution time: 4.868288542s
Aggregated test processing time: 133.51659582600004s
Parallel execution speedup: 27 times faster then sequential execution
Fetch was called 1500 times
```
