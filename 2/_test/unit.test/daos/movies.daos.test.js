const sinon = require("sinon");
const axios = require("axios");
const moviesDao = require('../../../daos/movies.dao');
const moviesDaoRedis = require('../../../daos/movies.dao.redis');
const redisConnection = {
  redis: {
    get(){},
    exists(){},
    set(){},
    del(){},
  }
}
const dataSingleMovies = {
  embed_player: "https://comicvine.gamespot.com/videos/embed/3322/",
  guid: "2300-3322",
  length_seconds: 224,
  name: "Unboxing: Star Wars Smuggler's Bounty: Empire Strikes Back Box",
  publish_date: "2017-01-14 13:39:00"
}
const dataAllMovies = [dataSingleMovies]
const dataRedisAllMovies = JSON.stringify(['2300-3322']);
const dataRedisSingleMovies = JSON.stringify(dataSingleMovies);

describe("GET all movies data", () => {
  afterEach(() => {
    sinon.restore();
  });
  
  it("Should get all movies data from API", async () => {
    let mockRedis = sinon.mock(redisConnection.redis);
    mockRedis.expects("exists").once().returns(0);
    const mockApi = sinon.mock(axios);
    mockApi
    .expects("get")
    .once()
    .resolves({
      data: {
        results: dataAllMovies
      }
    });
    const movies = await moviesDaoRedis.getListMovies(redisConnection, 1, 'desc');
    expect(movies.length).toEqual(1);
    mockRedis.verify();
    mockApi.verify();
    mockRedis.restore();
    mockApi.restore();
  });
  it("Should get all movies data from redis", async () => {
    let mockRedis = sinon.mock(redisConnection.redis);
    mockRedis.expects("exists").once().returns(1);
    mockRedis.expects("get").once().resolves(dataRedisAllMovies);
    const movies = await moviesDaoRedis.getListMovies(redisConnection, 1, "desc");
    expect(movies.length).toEqual(1);
    mockRedis.verify();
    mockRedis.restore();
  });
  it("Should get all movies data from API return error", async () => {
    let mockRedis = sinon.mock(redisConnection.redis);
    mockRedis.expects("exists").once().returns(0);
    let mockApi = sinon.mock(moviesDao);
    mockApi.expects("getListMovies").once().rejects(new Error("type"));
    await moviesDaoRedis.getListMovies(redisConnection, 1, '').catch((error) => {
      expect(error.message).toEqual("type");
    });
    mockRedis.verify();
    mockApi.verify();
    mockRedis.restore();
    mockApi.restore();
  });
  it("Should catch error", async () => {
    let mockApi = sinon.mock(axios);
    mockApi.expects("get").once().rejects(new Error("type"));
    await moviesDao.getListMovies(0, 1, '').catch((error) => {
      expect(error.message).toEqual("type");
    });
    mockApi.verify();
    mockApi.restore();
  });
});

describe("GET search movies data", () => {
  afterEach(() => {
    sinon.restore();
  });
  
  it("Should get search movies data from API", async () => {
    const mockApi = sinon.mock(axios);
    mockApi
    .expects("get")
    .once()
    .resolves({
      data: {
        results: dataAllMovies
      }
    });
    const movies = await moviesDao.getSearchMovies(0, 1, 'desc', 'Tom');
    expect(movies.length).toEqual(1);
    mockApi.verify();
    mockApi.restore();
  });
  it("Should get search movies data from API return error", async () => {
    let mockApi = sinon.mock(axios);
    mockApi.expects("get").once().rejects(new Error("type"));
    await moviesDao.getSearchMovies(0, 1, '', '').catch((error) => {
      expect(error.message).toEqual("type");
    });
    mockApi.verify();
    mockApi.restore();
  });
});

describe("GET single movie data", () => {
  afterEach(() => {
    sinon.restore();
  });
  
  it("Should get single movie data from API", async () => {
    let mockRedis = sinon.mock(redisConnection.redis);
    mockRedis.expects("exists").once().returns(0);
    const mockApi = sinon.mock(axios);
    mockApi
    .expects("get")
    .once()
    .resolves({
      data: {
        results: dataSingleMovies
      }
    });
    const movies = await moviesDaoRedis.getSingleMovie(redisConnection, '2300-3322');
    expect(movies.guid).toEqual('2300-3322');
    mockRedis.verify();
    mockApi.verify();
    mockRedis.restore();
    mockApi.restore();
  });
  it("Should get single movie data from redis", async () => {
    let mockRedis = sinon.mock(redisConnection.redis);
    mockRedis.expects("exists").once().returns(1);
    mockRedis.expects("get").once().returns(dataRedisSingleMovies);
    const movies = await moviesDaoRedis.getSingleMovie(redisConnection, '2300-3322');
    expect(movies.guid).toEqual('2300-3322');
    mockRedis.verify();
    mockRedis.restore();
  });
  it("Should get single movie data from API return error", async () => {
    let mockRedis = sinon.mock(redisConnection.redis);
    mockRedis.expects("exists").once().returns(0);
    let mockApi = sinon.mock(moviesDao);
    mockApi.expects("getSingleMovie").once().rejects(new Error("type"));
    await moviesDaoRedis.getSingleMovie(redisConnection, '').catch((error) => {
      expect(error.message).toEqual("type");
    });
    mockRedis.verify();
    mockApi.verify();
    mockRedis.restore();
    mockApi.restore();
  });
  it("Should catch error", async () => {
    let mockApi = sinon.mock(axios);
    mockApi.expects("get").once().rejects(new Error("type"));
    await moviesDao.getSingleMovie('2300-3322').catch((error) => {
      expect(error.message).toEqual("type");
    });
    mockApi.verify();
    mockApi.restore();
  });
});