# Game Consign

Simple API get data from open API.

## Requirements

Software tools that needs to be installed.

```bash
# run the app on your local machine
Node.js

# run Redis on your local machine
Redis
```

## Installation

### clone this repo

### open "gameconsign" folder

```bash
cd gameconsign/
```

### create .env file

```bash
cp .env.example .env
```

### modify .env file

Create a developer account at comicvine.gamespot.com to get an API key. After that put your API key into the .env file in the API_KEY properties section. You can use a text editor application to edit your .env file, e.g. nano, mousepad, etc.

```bash
nano .env
```

### install library

```bash
yarn install
```

## Run

```bash
yarn start
```

## Test

Run Unit Tests and Integration Tests on your local machine. The results of all the tests passed and the coverage was 100%.

```bash
yarn test
```

You can import the collections files in the *_test/postman.test* directory into Postman. Now you can perform End To End tests on your API using Postman.
