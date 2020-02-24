# Tweet311Denver Service

This api for [Tweet311Denver app](https://github.com/Tweet-311-Denver/tweet_311_denver_ui) uses Puppeteer to automate making [Denver 311 Reports](https://www.denvergov.org/pocketgov/#/report-a-problem), fetches verified location information from the [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/intro), and returns confirmation of 311 reports made to the City of Denver through the Tweet311Denver app.

This api is deployed on Heroku at `https://tweet311denver-service.herokuapp.com/`


## Table of Contents
- [Tech Stack and Team](#tech-stack)
- [Set Up](#set-up)
- [API Endpoints](#api-endpoints)
  - `GET /`
  - `POST /api/v1/reports`
  - `GET /api/v1/reports`
- [Schema](#schema)
- [Workflow](#project-board)


## Tech Stack
#### Back End

[Alice Post](https://github.com/ap2322) and [Dustin Mikusko](https://github.com/Dustin-Mikusko)

- [Node.js](https://nodejs.org/en/) v12.14.1
- [Hapi.js](https://hapi.dev/) v19.1.1
- [Knex](http://knexjs.org/) v0.20.10
- [PostgreSQL](https://www.postgresql.org/) v11.5
- [Puppeteer](https://pptr.dev/) v2.1.1
- Testing Suite: [@hapi/lab](https://hapi.dev/family/lab/), [@hapi/code](https://hapi.dev/family/code/), [Sinon](https://sinonjs.org/), [Nock](https://www.npmjs.com/package/nock)

#### Front End
  [Cameron MacRae](https://github.com/cammac60) and [Garrett Iannuzzi](https://github.com/Garrett-Iannuzzi)

- React Native
- Enzyme / Jest
- Expo
- React Navigation


## Set Up

1. `git clone` this repository and move into the directory
2. Run `npm install` to install dependencies
3. Set up development and test databases with postgres
```
psql -U postgres
CREATE DATABASE tweet_311_service_dev;
CREATE DATABASE tweet_311_service_test;
exit
```

4. Run knex migrations and seeds for both dev and test in the terminal
```
knex migrate:latest; knex migrate:latest --env test
knex seed:run; knex seed:run --env test
```

5. Create a `.env` file and add **environment variables**:
  - `GOOGLE_GEOCODE_KEY`= API key for [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/intro)
  - `SERVICE_KEY`= API key for this service (contact contributors for access)
6. Run the test suite with `npm test`
7. Deploy locally to port 3000 with `npm start`


## API Endpoints

Endpoints are hosted at `https://tweet311denver-service.herokuapp.com`. Append the following routes to the url to access the api.

*All `POST` endpoints require query param `serviceKey` to equal your secret SERVICE_Key.*

#### `GET /`

This root endpoint allows developers to quickly check deployment of this api without a body or service key.

Example request:
```
GET /
```

Example response:
```
HTTP 1.1 Status 200
body:
{
  "message": "Welcome to Tweet311Denver Service",
  "documentation": "https://github.com/Tweet-311-Denver/tweet_311_denver_service"
}
```

#### `POST /api/v1/reports`

This reports endpoint executes the following tasks:
1. Adds a location to the database
2. Adds a report to the database
3. Makes a 311 Report
4. Returns the confirmation information of the report as json

Example request:
```
POST /api/v1/reports?serviceKey=[SERVICE_KEY]
body:
{ "report": {
    "category": "other",
    "description": "A car is blocking the bike lane",
    "image": "//path_to_image_from_device.jpg",
    "email": "test@test.com"
  },
  "location": {
    "lat": "39.751129",
    "long": "-104.997486"
  }
}
```

Body/payload attributes:
- `report` object required with all attributes `category`, `description`, `image`, `email`
- `location` object required with all attributes `lat`, `long`
- `category` can only accept `other` or `snow removal`
- `description` is a string with a limit of 280 characters
- `image` is the image path from a device upload
- `email` is a string
- `lat` can include up to 8 decimal points
- `long` can include up to 8 decimal points

Example response:
```
HTTP 1.1 Status 201 Created
body:
{
  "newReport": {
    "category": "other",
    "description": "A car is blocking the bike lane",
    "email": "test@test.com",
    "image": "path_to_image_in_app_cdn",
    "location_id": "1"
    "id": "1"
  },
  "confirmation311": {
    "caseID": "54389"
    "category": "Other"
    "submittedAs": "test@test.com"
    "submittedAt": "202002181810"
    "notes": ""
  }
}
```

#### `GET /api/v1/reports`

This endpoint returns all the reports in the Tweet311Denver Service database.

Example request: `GET /api/v1/reports`

Example response:
```
{
    "reports": [
        {
            "id": 3,
            "category": "other",
            "description": "big hole",
            "image": null,
            "email": "test@test.com",
            "location_id": 3
        },
        {
            "id": 4,
            "category": "other",
            "description": "oh noes there's stuff in the road",
            "image": null,
            "email": "test2@test.com",
            "location_id": 3
        }
    ]
}
```


## Schema



## Project Board

The team at Tweet311Denver followed an agile workflow with mini-sprints over the course of two weeks. Our team used a GitHub projects board with issues that were tracked by every member of the team.

Tweet311Denver encouraged code review processes by following a pull request template. It was encouraged that pull requests contain sections for what was happening, where to start, linked issues, testing, and any relevant notes.

Check out our project board [here](https://github.com/orgs/Tweet-311-Denver/projects).
