# NestJS STAR WARS API MONGODB

This project is a NestJS application designed to handle logging, database updates via a cron job, and API services that provide information from the Star Wars API.

## Project Overview

### 1. Logging with Winston

The application implements a logging system using Winston, a powerful and flexible logging library for Node.js applications. The key features include:

- **Log Management**: Logs are categorized by severity levels (e.g., `fatal`, `error`, `warn`, `info`, `debug`, `trace`).
- **Multiple Outputs**: Logs can be directed to various outputs, including the console and log files.
- **CloudWatch Integration**: Logs are configured to integrate with AWS CloudWatch, facilitating monitoring and debugging.

### 2. Scheduled Database Updates

A cron job is configured to periodically update the database with the latest data from the Star Wars API. This ensures that the application always serves the most current information. The cron job performs the following tasks:

- **Data Fetching**: Regularly retrieves data from the Star Wars API.
- **Database Synchronization**: Updates the database with any new or changed information.

### 3. Exposing Star Wars Data through API Services

The application provides a set of RESTful API services that expose Star Wars related data. These services interact with the database to deliver real-time information about characters, planets, starships, and films.

## Installation and Setup

To get the project up and running locally, follow these steps:

1. **Clone the Repository**: 
   ```bash
   git clone https://github.com/AlejoTabraj/star-wars-api-v1

2. **Install dependecies**: 
    ```bash
    npm i
3. **Add environment variables**: 
    Example in .env.test
4. **Run the Application**: 
    ```bash
    npm run start:dev