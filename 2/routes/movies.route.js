const router = require('express').Router();

const {
  middlewareCheckHeaderAuth,
  getListMovies,
  getListSearchMovies,
  getSingleMovie,
} = require('../controllers/movies.controller');

router.get('/', middlewareCheckHeaderAuth, getListMovies);
router.get('/search/', middlewareCheckHeaderAuth, getListSearchMovies);
router.get('/:id', middlewareCheckHeaderAuth, getSingleMovie);

module.exports = router;