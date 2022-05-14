require('dotenv').config();
const jwt = require('../modules/jwt.modules');
const moviesModelCache = require('../daos/movies.dao.redis');
const databaseCache = require('../models/redis.connection');
const moviesModel = require('../daos/movies.dao');

const { env } = process;

const middlewareCheckHeaderAuth = async (req, res, next) => {
  try {
    if(req.headers[env.COOKIE_AUTH]){
      const token = jwt.decryptJWT(req.headers[env.COOKIE_AUTH])
      if(token.valid){
        next()
      }else{
        return res.status(400).json({
          status: false,
          message: 'header auth is not valid',
        })
      }
    }else{
      return res.status(400).json({
        status: false,
        message: 'header auth not found',
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    })
  }
}

const getListMovies = async (req, res) => {
  try {
    const { page, sort } = req.body;
    const redisConnection = await databaseCache.getModel();
    const pagination = await moviesModelCache.getListMovies(redisConnection, page, sort);
    const model = await Promise.all(pagination.map(async (v)=>{
      const keyMovie = moviesModelCache.getKeyMovie(v);
      return await moviesModelCache.RedisSingleMovie(keyMovie, redisConnection, v);
    }));
    return res.status(200).json({
      status: true,
      message: `get list of all movies on page ${page}`,
      data: model,
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    })
  }
}

const getListSearchMovies = async (req, res) => {
  try {
    const { page, sort, query } = req.body;
    const model = await moviesModel.getSearchMovies(page, sort, query)
    return res.status(200).json({
      status: true,
      message: `search for movies on page ${page}`,
      data: model,
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    })
  }
}

const getSingleMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const redisConnection = await databaseCache.getModel();
    const model = await moviesModelCache.getSingleMovie(redisConnection, id)
    if(model.guid){
      return res.status(200).json({
        status: true,
        message: 'get single movie',
        data: model,
      })
    }else{
      return res.status(404).json({
        status: false,
        message: 'movie not found',
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    })
  }
}

module.exports = {
  middlewareCheckHeaderAuth,
  getListMovies,
  getListSearchMovies,
  getSingleMovie,
}