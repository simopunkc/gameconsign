const app = require('../../server');
const request = require("supertest");
const sinon = require("sinon");
const agent = request.agent(app);
const database = require("../../daos/movies.dao");
const databaseCache = require("../../models/redis.connection");
const moviesModelCache = require('../../daos/movies.dao.redis');
const axios = require("axios");
const redisConnection = {
  redis: {
    get(){},
    exists(){},
    set(){},
    del(){},
  }
}

const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2YWxpZCI6dHJ1ZSwiaWF0IjoxNjUyNDAxNzUwfQ.MVA1G_0nydD2DeuOuC-XY3KfefZQ2YgwvtgJCJiFJyQ";
const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2YWxpZCI6ZmFsc2UsImlhdCI6MTY1MjQ4NzQ2Mn0.1WFKr6q367jsDIUFJxFAOac7IUdVHZ9oSsRmizEBOvA";
const validBodyAll = {
  page: 1,
  sort: "desc"
}
const validBodySearch = {
  page: 1,
  sort: "desc",
  query: "Tom"
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

describe("Integration Test /register", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("GET /movies/", () => {
    describe("error 500", () => {
      it("invalid token", async () => {
        await agent.get("/movies/").set("token", {}).expect(500);
      });
      it("should catch error", async () => {
        let mockDB = sinon.mock(databaseCache);
        mockDB.expects("getModel").once().rejects(new Error("type"));
        await agent.get("/movies/").set("token", validToken).expect(500);
        mockDB.verify();
        mockDB.restore();
      });
    });

    describe("error 400", () => {
      it("token not found", async () => {
        await agent.get("/movies/").expect(400);
      });
      it("failed decrypt token", async () => {
        await agent.get("/movies/").set("token", invalidToken).expect(400);
      });
    });

    describe("200 ok", () => {
      it("should return data from API", async () => {
        const mockDbConn = sinon.mock(databaseCache);
        mockDbConn.expects("getModel").once().resolves(redisConnection);
        const mockRedis = sinon.mock(redisConnection.redis);
        mockRedis.expects("exists").once().returns(0);
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
        mockApi
        .expects("get")
        .once()
        .resolves({
          data: {
            results: dataSingleMovies
          }
        });
        await agent.get("/movies/").set("token", validToken).send(validBodyAll).expect(200);
        mockDbConn.verify();
        mockRedis.verify();
        mockApi.verify();
        mockDbConn.restore();
        mockRedis.restore();
        mockApi.restore();
      });
      it("should return data from Redis", async () => {
        const mockDbConn = sinon.mock(databaseCache);
        mockDbConn.expects("getModel").once().resolves(redisConnection);
        const mockRedis = sinon.mock(redisConnection.redis);
        mockRedis.expects("exists").once().returns(1);
        mockRedis.expects("get").once().returns(dataRedisAllMovies);
        mockRedis.expects("exists").once().returns(1);
        mockRedis.expects("get").once().returns(dataRedisSingleMovies);
        await agent.get("/movies/").set("token", validToken).send(validBodyAll).expect(200);
        mockDbConn.verify();
        mockRedis.verify();
        mockDbConn.restore();
        mockRedis.restore();
      });
    });
  });

  describe("GET /movies/search/", () => {
    describe("error 500", () => {
      it("should catch error", async () => {
        let mockDB = sinon.mock(database);
        mockDB.expects("getSearchMovies").once().rejects(new Error("type"));
        await agent.get("/movies/search/").set("token", validToken).expect(500);
        mockDB.verify();
        mockDB.restore();
      });
    });

    describe("200 ok", () => {
      it("should return data from API", async () => {
        const mockApi = sinon.mock(axios);
        mockApi
        .expects("get")
        .once()
        .resolves({
          data: {
            results: dataAllMovies
          }
        });
        await agent.get("/movies/search/").set("token", validToken).send(validBodySearch).expect(200);
        mockApi.verify();
        mockApi.restore();
      });
    });
  });

  describe("GET /movies/:id", () => {
    describe("error 500", () => {
      it("should catch error", async () => {
        let mockDB = sinon.mock(databaseCache);
        mockDB.expects("getModel").once().rejects(new Error("type"));
        await agent.get("/movies/2300-3322").set("token", validToken).expect(500);
        mockDB.verify();
        mockDB.restore();
      });
    });

    describe("error 400", () => {
      it("token not found", async () => {
        await agent.get("/movies/2300-3322").expect(400);
      });
    });

    describe("error 404", () => {
      it("movie not found", async () => {
        const mockDbConn = sinon.mock(moviesModelCache);
        mockDbConn.expects("getSingleMovie").once().resolves({});
        await agent.get("/movies/fak").set("token", validToken).expect(404);
        mockDbConn.verify();
        mockDbConn.restore();
      });
    });

    describe("200 ok", () => {
      it("should return data from API", async () => {
        const mockDbConn = sinon.mock(databaseCache);
        mockDbConn.expects("getModel").once().resolves(redisConnection);
        const mockRedis = sinon.mock(redisConnection.redis);
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
        await agent.get("/movies/2300-3322").set("token", validToken).expect(200);
        mockDbConn.verify();
        mockRedis.verify();
        mockApi.verify();
        mockDbConn.restore();
        mockRedis.restore();
        mockApi.restore();
      });
      it("should return data from Redis", async () => {
        const mockDbConn = sinon.mock(databaseCache);
        mockDbConn.expects("getModel").once().resolves(redisConnection);
        const mockRedis = sinon.mock(redisConnection.redis);
        mockRedis.expects("exists").once().returns(1);
        mockRedis.expects("get").once().returns(dataRedisSingleMovies);
        await agent.get("/movies/2300-3322").set("token", validToken).expect(200);
        mockDbConn.verify();
        mockRedis.verify();
        mockDbConn.restore();
        mockRedis.restore();
      });
    });
  });
});