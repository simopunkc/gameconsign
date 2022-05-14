require('dotenv').config();
const paginationOffset = require("../modules/pagination.modules");
const { env } = process;

const api = {
  base_url: env.API_BASE_URL,
  api_key: env.API_KEY,
  endpoint_get_movies: "/videos/",
  endpoint_get_search_movies: "/search/",
  endpoint_get_single_movie: "/video/",
  format: "json",
  field_list: "guid,name,embed_player,length_seconds,publish_date"
};

function getEndpointMovies(page, order) {
  const offset = paginationOffset.getOffset(page);
  const params = new URLSearchParams({
    api_key: api.api_key,
    format: api.format,
    offset: offset.start,
    limit: offset.limit,
    sort: order,
    field_list: api.field_list
  })
  return api.base_url+api.endpoint_get_movies+"?"+params
}

function getEndpointSearchMovies(page, order, query) {
  const offset = paginationOffset.getOffset(page);
  const params = new URLSearchParams({
    api_key: api.api_key,
    format: api.format,
    offset: offset.start,
    limit: offset.limit,
    resources: "video",
    query: query.replace(' ','+'),
    sort: order,
    field_list: api.field_list
  })
  return api.base_url+api.endpoint_get_search_movies+"?"+params
}

function getEndpointSingleMovie(idMovie) {
  const params = new URLSearchParams({
    api_key: api.api_key,
    format: api.format,
    field_list: api.field_list
  })
  return api.base_url+api.endpoint_get_single_movie+idMovie+"?"+params
}

module.exports = {
  getEndpointMovies,
  getEndpointSearchMovies,
  getEndpointSingleMovie
};
