const utils = require('./utils');
const express = require('express');
const postRoutes = express.Router();

let Post = require('./post.model');
let Category = require('./category.model');
let Session = require('./session.model');
let User = require('./user.model');

/*
    POST - /post/create
    Create a post
    Response: 201 - Created
              401 - Unauthorized
*/
postRoutes.route('/create').post((req, res) => {
    if (!req.body) {
        res.status(401).send("Missing body");
        return;
    }
    utils.checkSession(req.body.userId, req.body.sessionId, (isValidId) => {
        utils.isAdmin(req.body.userId, (isAdmin) => {
            if (isValidId && isAdmin) {
                let p = new Post(req.body);
                p.date = utils.dateToEpoch(p.date);
                p.save()
                    .then(() => {
                        res.json(p);
                    })
                    .catch((e) => {
                        console.log(e);
                        res.status(500).send("Error creating post");
                    });
            } else {
                res.status(401).send("Invalid permissions to create post.");
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
        res.status(401).send("Missing body");
        return;
    }
    utils.checkSession(req.body.userId, req.body.sessionId, (isValidId) => {
        utils.isAdmin(req.body.userId, (isAdmin) => {
            if (isValidId && isAdmin) {
                Post.findByIdAndDelete(req.body._id, (err, r) => {
                    if (err) {
                        res.status(500).send("Error deleting post");
                        return;
                    }
                    res.status(200).send("Deleted post");
                });
            } else {
                res.status(401).send("Invalid permissions to delete post.");
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
        res.status(401).send("Missing body");
        return;
    }
    utils.checkSession(req.body.userId, req.body.sessionId, (isValidId) => {
        utils.isAdmin(req.body.userId, (isAdmin) => {
            if (isValidId && isAdmin) {
                Post.findById(req.body._id, (err, r) => {
                    if (err) {
                        res.status(500).send("Error editing post");
                        return;
                    }
                    r.save()
                    .then(() => {
                        res.json(r);
                    })
                    .catch((e) => {
                        console.log(e);
                        res.status(500).send("Error creating post");
                    });
                    res.status(200).send("Edited post");
                });
            } else {
                res.status(401).send("Invalid permissions to delete post.");
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
            console.log(err);
            res.status(500).send("Error getting posts");
            return;
        }
        res.status(200).send(post);
    });
});

/*
    POST - /post/date
    Get post by date
    Response: 200 - OK
*/
postRoutes.route('/date').post((req, res) => {
    let d = new Date(req.body.date);
    d = utils.dateToEpoch(d);
    Post.find({ date: d}, (err, post) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error getting posts");
            return;
        }
        res.status(200).send(post);
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
            console.log(err);
            res.status(500).send("Error getting posts");
            return;
        }
        res.status(200).send(postArr);
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
    date = utils.dateToEpoch(date);
    Post.find({ date: date }, (err, postArr) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error getting posts");
            return;
        }
        res.status(200).send(postArr);
    });
});



module.exports = postRoutes;
