require('dotenv').config();
const app = require("./server");
const PORT = process.env.PORT || 8080;

module.exports = app.listen(PORT);