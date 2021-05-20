let User = require('../schema/user.model');
let Session = require('../schema/session.model');

// checkSession(userId, sessionId) checks if the sessionId is valid for the user
const checkSession = (userId, sessionId, f) => {
    Session.find({ userId: userId, sessionId: sessionId }, (err, res) => {
        if (res) {
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
