require('log-timestamp');
const express = require('express');
const app = express();
const PORT = 4000;
const cors = require('cors');
const mongoose = require('mongoose');
const utils = require ('./utils');
const CronJob = require('cron').CronJob;
const config = require('./DB.js');
const userRoutes = require('./user.route');

console.log("Starting Kno-Logic Backend Server");

// Handle MongoDB connection
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {
        console.log('Connected to dabase');
        utils.loadDefaultTemplates();
        utils.purgeSessions();
    },
    err => {
        console.log('Could not connect to database: ');
        console.log(err);
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

// Cron jobs
var purge = new CronJob('*/5 * * * *', utils.purgeSessions);
purge.start();
