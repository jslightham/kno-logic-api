const utils = require('../utils/utils');
const express = require('express');
const postRoutes = express.Router();

let Post = require('../schema/post.model');
let Category = require('../schema/category.model');
let Session = require('../schema/session.model');
let User = require('../schema/user.model');

/*
    POST - /post/create
    Create a post
    Response: 201 - Created
              401 - Unauthorized
*/
postRoutes.route('/create').post((req, res) => {
    if (!req.body) {
        res.status(401).json({ success: false, response: "Missing body" });
        return;
    }
    utils.account.checkSession(req.body.userId, req.body.sessionId, (isValidId) => {
        utils.account.isAdmin(req.body.userId, (isAdmin) => {
            if (isValidId && isAdmin) {
                let p = new Post(req.body);
                p.date = utils.date.dateToEpoch(p.date);
                p.save()
                    .then(() => {
                        res.status(200).json({ success: true, response: p });
                    })
                    .catch((e) => {
                        console.error(e);
                        res.status(500).json({ success: false, response: "Error creating post" });
                    });
            } else {
                res.status(401).json({ success: false, response: "Invalid permissions to create post" });
                return;
            }
        })
    });
});

/*
    POST - /post/delete
    Create a post
    Response: 200 - Deleted
              401 - Unauthorized
*/
postRoutes.route('/delete').post((req, res) => {
    if (!req.body) {
        res.status(401).json({ success: false, response: "Missing body" });
        return;
    }
    utils.account.checkSession(req.body.userId, req.body.sessionId, (isValidId) => {
        utils.account.isAdmin(req.body.userId, (isAdmin) => {
            if (isValidId && isAdmin) {
                Post.findByIdAndDelete(req.body._id, (err, r) => {
                    if (err) {
                        res.status(500).json({ success: false, response: "Error deleting post" });
                        return;
                    }
                    res.status(200).json({ success: true, response: "Deleted post" });
                });
            } else {
                res.status(401).json({ success: false, response: "Invalid permissions to delete post." });
                return;
            }
        })
    });
});

/*
    POST - /post/edit
    Create a post
    Response: 200 - Edited
              401 - Unauthorized
*/
postRoutes.route('/edit').post((req, res) => {
    if (!req.body) {
        res.status(401).json({ success: false, response: "Missing body" });
        return;
    }
    utils.account.checkSession(req.body.userId, req.body.sessionId, (isValidId) => {
        utils.account.isAdmin(req.body.userId, (isAdmin) => {
            if (isValidId && isAdmin) {
                Post.findById(req.body._id, (err, r) => {
                    if (err) {
                        res.status(500).json({ success: false, response: "Error editing post" });
                        return;
                    }
                    r.save()
                    .then(() => {
                        res.json(r);
                    })
                    .catch((e) => {
                        console.error(e);
                        res.status(500).json({ success: false, response: "Error creating post" });
                    });
                    res.status(200).json({ success: true, response: "Edited post" });
                });
            } else {
                res.status(401).json({ success: false, response: "Invalid permissions to delete post." });
                return;
            }
        })
    });
});


/*
    POST - /post/id
    Get post by id
    Response: 200 - OK
*/
postRoutes.route('/id').post((req, res) => {
    Post.findById(req.body._id, (err, post) => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false, response: "Error getting posts" });
            return;
        }
        res.status(200).json({ success: true, response: post });
    });
});

/*
    POST - /post/date
    Get post by date
    Response: 200 - OK
*/
postRoutes.route('/date').post((req, res) => {
    let d = new Date(req.body.date);
    d = utils.date.dateToEpoch(d);
    Post.find({ date: d}, (err, post) => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false, response: "Error getting posts" });
            return;
        }
        res.status(200).json({ success: true, response: post });
    });
});


/*
    GET - /post/all
    Get all posts
    Response: 200 - OK
*/
postRoutes.route('/all').get((req, res) => {
    Post.find({}, (err, postArr) => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false, response: "Error getting posts" });
            return;
        }
        res.status(200).json({ success: true, response: postArr });
    });
});

/*
    GET - /posts/today
    Get the posts for today
    Response: 200 - Removed session 
              400 - No session exists
*/
postRoutes.route('/today').get((req, res) => {
    let date = new Date();
    date = utils.date.dateToEpoch(date);
    Post.find({ date: date }, (err, postArr) => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false, response: "Error getting posts" });
            return;
        }
        res.status(200).json({ success: true, response: postArr });
    });
});

module.exports = postRoutes;
