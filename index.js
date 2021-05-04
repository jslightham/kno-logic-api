const express = require('express');
const app = express();
const PORT = 4000;
const cors = require('cors');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const config = require('./DB.js');

const userRoutes = require('./user.route');

// Handle MongoDB connection
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {
        console.log('Connected to dabase');
    },
    err => {
        console.log('Could not connect to database: ' + err);
    }
);

// Express server
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// Express routes
app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log('Express server running on port:', PORT);
});
