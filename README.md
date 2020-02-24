# Tweet311Denver Service

This service for Tweet311Denver app facilitates making 311 reports, fetching location information, and analysis of reports.

This api is deployed on Heroku at `SECRET (until we include authorization)`


## Contents
- Technologies Used
- Local Setup and Deployment
- API Endpoints
  - `POST /api/v1/reports`


## Technologies Used

- Node v12.14.1
- Hapi.js
- Postgres v11.5
- Knex
- Pupeteer


## Local Setup and Deployment

1. `git clone` this repository and move into the directory
2. Run `npm install` to install dependencies
3. Setup your development and test databases with postgres
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

5. Run the test suite with either `npm test` or `npx lab`
6. Deploy locally with `npm start`


## API Endpoints

Endpoints are hosted at `SECRET (until we include authorization)`. Append the following routes to the url to access the api.

#### `POST /api/v1/reports`

This reports endpoint executes the following tasks:
1. Adds a location to the database
2. Adds a report to the database
3. Makes a 311 Report
4. Returns the confirmation information of the report as json

Example request:
```
POST SECRET/api/v1/reports
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
