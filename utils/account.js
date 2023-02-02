let User = require('../schema/user.model');
let Session = require('../schema/session.model');
const bcrypt = require('bcrypt');

// checkSession(userId, sessionId) checks if the sessionId is valid for the user
const checkSession = (userId, sessionId, f) => {
    let success = false;
    Session.find({ userId: userId, sessionId: sessionId }, (err, res) => {
        res.forEach(element => {
            if (element.type == 0 && !success) {
                success = true;
                f(true);
                return;
            }
        })
        if (!success)
            f(false);
    });
}

// checkRefresh(userId, sessionId) checks if the refresh token is valid for the user
const checkRefresh = (userId, sessionId, f) => {
    Session.find({ userId: userId, sessionId: sessionId }, (err, res) => {
        if (res && res.type == 1) {
            f(true);
            return;
        }
        f(false);
    });
}

// isAdmin(userId) checks if the user with userId is an administrator
const isAdmin = (userId, f) => {
    User.findById(userId, (err, res) => {
        if (res.permission == 1) {
            f(true);
            return;
        }
        f(false);
    })
}

module.exports.checkSession = checkSession;
module.exports.isAdmin = isAdmin;
