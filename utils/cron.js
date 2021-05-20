const config = require('../config');
let Session = require('../schema/session.model');
const maxSessionLength = config.maxSessionLength;

// purgeSessions() purge sessions that have existed for longer than maxSessionLength
const purgeSessions = () => {
    console.log("Purging old sessions...");
    Session.find({}, (err, arr) => {
        for (let i = 0; i < arr.length; i++) {
            let timeDifference = new Date().getTime() - arr[i].date;
            let dayDifference = timeDifference / (1000 * 3600 * 24);
            if (dayDifference > maxSessionLength) {
                arr[i].delete().catch(e => {
                    console.log(e);
                });
            }
        }
    });
}

module.exports.purgeSessions = purgeSessions;