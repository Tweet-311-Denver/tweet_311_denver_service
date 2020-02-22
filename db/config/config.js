const dotenv = require('dotenv').config();

module.exports = {
  development: {
    username: "postgres",
    database: "tweet_311_service_dev",
    host: "127.0.0.1",
    dialect: "postgres"
  },
  test: {
    username: "postgres",
    database: "tweet_311_service_test",
    host: "127.0.0.1",
    dialect: "postgres"
  },
  production: {
    use_env_variable: process.env.DATABASE_URL,
    dialect: "postgres",
    protocol: "postgres"
  }
}
