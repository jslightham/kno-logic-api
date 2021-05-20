require('log-timestamp');
const express = require('express');
const app = express();
const PORT = 4000;
const cors = require('cors');
const mongoose = require('mongoose');
const utils = require ('./utils/utils');
const CronJob = require('cron').CronJob;
const config = require('./DB.js');
const userRoutes = require('./routes/user.route');
const postRoutes = require('./routes/post.route');
const categoryRoutes = require('./routes/category.route');
const mongoSanitize = require('express-mongo-sanitize');

console.log("Starting Kno-Logic Backend Server");

// Handle MongoDB connection
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {
        console.log('Connected to dabase');
        utils.mail.loadDefaultTemplates();
        utils.cron.purgeSessions();
    },
    err => {
        console.error('Could not connect to database: ');
        console.error(err);
    }
);

// Express server
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// Sanitize data to prevent NoSQL injections
app.use(mongoSanitize());

// Express routes
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/category', categoryRoutes);

app.listen(PORT, () => {
    console.log('Express server running on port:', PORT);
});

// Cron jobs
var purge = new CronJob('*/5 * * * *', utils.cron.purgeSessions);
purge.start();
