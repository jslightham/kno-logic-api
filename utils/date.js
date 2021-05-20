// dateToEpoch(date) change the time of the date object to epoch
function dateToEpoch(d) {
    console.log(d);
    if (d) {
        // When comparing js dates, the timezone does not matter
        // ex. May 17 EDT == May 17 GMT, May 17 EDT != May 18 GMT
        return d.setHours(0, 0, 0, 0);
    } else {
        return null;
    }
}

module.exports.dateToEpoch = dateToEpoch;