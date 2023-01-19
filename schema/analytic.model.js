const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Database schema for an email message
let AnalyticData = new Schema({
    date: {
        type: Date
    },
    viewCount: {
        type: String
    },
    articleViewCounts: {
        type: Array
    },
    systemTime: {
        type: String
    },
    systemUptime: {
        type: String
    },
    systemCPUBrand: {
        type: String
    },
    systemCPUSpeed: {
        type: String
    },
    systemCPUSpeedMax: {
        type: String
    },
    systemCPUCores: {
        type: String
    },
    systemCPUAverage: {
        type: String
    },
    systemCPUTemperature: {
        type: String
    },
    systemMemoryTotal: {
        type: String
    },
    systemMemoryUsed: {
        type: String
    },
    systemSwapTotal: {
        type: String
    },
    systemSwapUsed: {
        type: String
    },
    systemOSPlatform: {
        type: String
    },
    systemOSDistro: {
        type: String
    },
    systemOSRelease: {
        type: String
    },
    systemOSKernel: {
        type: String
    },
    systemCurrentLoad: {
        type: String
    },
}, {
    collection: 'categories'
});

module.exports = mongoose.model('AnalyticData', AnalyticData);