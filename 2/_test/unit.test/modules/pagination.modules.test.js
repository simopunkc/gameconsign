const pagination = require('../../../modules/pagination.modules')

describe("pagination modules", () => {
  it("Should return limit 10 and start 0", async () => {
    const input = 1;
    const action = pagination.getOffset(input);
    expect(action.limit).toEqual(10);
    expect(action.start).toEqual(0);
  });

  it("Should return limit 10 and start 10", async () => {
    const input = 2;
    const action = pagination.getOffset(input);
    expect(action.limit).toEqual(10);
    expect(action.start).toEqual(10);
  });
});