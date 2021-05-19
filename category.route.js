const utils = require('./utils');
const express = require('express');
const categoryRoutes = express.Router();

let Post = require('./post.model');
let Category = require('./category.model');
let Session = require('./session.model');
let User = require('./user.model');

/*
    POST - /category/create
    Create a category
    Response: 201 - Created
              401 - Unauthorized
*/
categoryRoutes.route('/create').post((req, res) => {
    if (!req.body) {
        res.status(401).send("Missing body");
        return;
    }
    utils.checkSession(req.body.userId, req.body.sessionId, (isValidId) => {
        utils.isAdmin(req.body.userId, (isAdmin) => {
            if (isValidId && isAdmin) {
                let c = new Category(req.body);
                c.save()
                    .then(() => {
                        res.json(c);
                    })
                    .catch((e) => {
                        console.error(e);
                        res.status(500).send("Error creating category");
                    });
            } else {
                res.status(401).send("Invalid permissions to create category.");
                return;
            }
        })
    });
});

/*
    GET - /category/all
    Get all categories
    Response: 200 - OK
*/
categoryRoutes.route('/all').get((req, res) => {
    Category.find({}, (err, cArr) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error getting categories");
            return;
        }
        res.status(200).send(cArr);
    });
});

/*
    GET - /category/posts
    Get all posts with specified category
    Response: 200 - OK
*/
categoryRoutes.route('/posts').get((req, res) => {
    Post.find({}, (err, postArr) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error getting posts");
            return;
        }
        postArr = postArr.filter(post => post.category.includes(req.body._id));
        res.status(200).send(postArr);
    });
});




module.exports = categoryRoutes;
