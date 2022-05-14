require('dotenv').config();
const express = require('express');
const cors = require('cors');
const movies = require('./routes/movies.route');
const app = express();
app.use(express.json());
app.use(cors());
app.use('/movies', movies);
module.exports = app