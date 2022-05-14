const { decryptJWT } = require('../../../modules/jwt.modules');
const token = require('../../../modules/token.modules')

describe("encrypted token can be decrypted", () => {
  it("Should return true", async () => {
    const input = token.generateToken();
    const action = decryptJWT(input);
    expect(action.valid).toEqual(true);
  });
});