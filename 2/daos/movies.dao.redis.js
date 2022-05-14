const moviesModel = require("./movies.dao");

function getAllKeyMovie(page, sort){
  return `movies-all-${page}-${sort}`
}

function getKeyMovie(idDB){
  return `movie-${idDB}`
}

async function RedisAllMovie(key, redisConnection, page, sort) {
  let rawData;
  const checkCache = await redisConnection.redis.exists(key);
  if (checkCache) {
    const redisData = await redisConnection.redis.get(key);
    rawData = JSON.parse(redisData);
  } else {
    rawData = await moviesModel.getListMovies(page, sort)
      .then(async (response) => {
        let temp = []
        response.map(async (v) => {
          const keyMovie = getKeyMovie(v.guid);
          temp.push(v.guid);
          await redisConnection.redis.set(keyMovie, JSON.stringify(v));
        });
        await redisConnection.redis.set(key, JSON.stringify(temp));
        return temp;
      })
      .catch((error) => {
        return error.message;
      });
  }
  return rawData;
}

async function RedisSingleMovie(key, redisConnection, idDB) {
  let rawData;
  const checkCache = await redisConnection.redis.exists(key);
  if (checkCache) {
    const redisData = await redisConnection.redis.get(key);
    rawData = JSON.parse(redisData);
  } else {
    rawData = await moviesModel.getSingleMovie(idDB)
      .then(async (response) => {
        await redisConnection.redis.set(key, JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        return error.message;
      });
  }
  return rawData;
}

async function getSingleMovie(redisConnection, idDB) {
  const key = getKeyMovie(idDB);
  return await RedisSingleMovie(key, redisConnection, idDB);
}

async function getListMovies(redisConnection, page, sort) {
  const key = getAllKeyMovie(page, sort);
  return await RedisAllMovie(key, redisConnection, page, sort);
}

module.exports = {
  getKeyMovie,
  RedisSingleMovie,
  getListMovies,
  getSingleMovie,
};
