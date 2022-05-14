const config = require('../configs/api.config');
const axios = require("axios");

module.exports = {
  getListMovies: (offset, limit, sort) => {
    return new Promise((resolve, reject) => {
      const urlAPI = config.getEndpointMovies(offset, limit, sort)
      axios
      .get(urlAPI)
      .then((response) => {
        resolve(response.data.results)
      })
      .catch((err) => {
        reject(err);
      });
    });
  },
  getSearchMovies: (offset, limit, sort, query) => {
    return new Promise((resolve, reject) => {
      const urlAPI = config.getEndpointSearchMovies(offset, limit, sort, query)
      axios
      .get(urlAPI)
      .then((response) => {
        resolve(response.data.results)
      })
      .catch((err) => {
        reject(err);
      });
    });
  },
  getSingleMovie: (id) => {
    return new Promise((resolve, reject) => {
      const urlAPI = config.getEndpointSingleMovie(id)
      axios
      .get(urlAPI)
      .then((response) => {
        resolve(response.data.results)
      })
      .catch((err) => {
        reject(err);
      });
    });
  },
};