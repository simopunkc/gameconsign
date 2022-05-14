const jwt = require('../modules/jwt.modules');

function generateToken() {
  return jwt.encryptJWT({
    valid: true
  })
}

module.exports = {
  generateToken,
};
