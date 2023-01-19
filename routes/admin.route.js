const utils = require('../utils/utils');
const express = require('express');
const adminRoutes = express.Router();

let Post = require('../schema/post.model');
let Category = require('../schema/category.model');
let Session = require('../schema/session.model');
let User = require('../schema/user.model');

/*
    POST - /admin/stats
    Get system status
    Response: 201 - Created
              401 - Unauthorized
*/
adminRoutes.route('/stats').post((req, res) => {
    if (!req.body) {
        res.status(401).json({ success: false, response: "Missing body" });
        return;
    }
    utils.account.checkSession(req.body.userId, req.body.sessionId, (isValidId) => {
        utils.account.isAdmin(req.body.userId, (isAdmin) => {
            if (isValidId && isAdmin) {
                let stats = {};
                Post.count({}, (err, postCount) => {
                    stats.postCount = postCount;
                    Category.count({}, (err, categoryCount) => {
                        stats.categoryCount = categoryCount;
                        Session.count({}, (err, sessionCount) => {
                            stats.sessionCount = sessionCount;
                            User.count({}, (err, userCount) => {
                                stats.userCount = userCount;
                                stats.date = Date();
                                res.status(200).json({ success: true, response: stats });
                            });
                        });
                    });
                });
            } else {
                res.status(401).json({ success: false, response: "Invalid permissions to view stats" });
                return;
            }
        })
    });
});


module.exports = adminRoutes;
