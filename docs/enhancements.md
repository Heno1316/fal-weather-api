## Features for improvements

- When every user adds a city instead of duplicating cities we can have a user schema with an array of cities mapped
- Currently, OpenWeather API doesn't have an API to fetch details for all cities. We need to iterate over each city and get their results. Instead of doing this we can cache the results and for next subsequent request we can get it from cache
- Implementing background job queues or cron jobs to sync data periodically
- Since we depend on external service for weather details. We can write integration tests for all the external APIs
- We can provide advanced search filters