const utils = require('../utils/utils');
const express = require('express');
const categoryRoutes = express.Router();

let Post = require('../schema/post.model');
let Category = require('../schema/category.model');
let Session = require('../schema/session.model');
let User = require('../schema/user.model');

/*
    POST - /category/create
    Create a category
    Response: 201 - Created
              401 - Unauthorized
*/
categoryRoutes.route('/create').post((req, res) => {
    if (!req.body) {
        res.status(401).json({ success: false, response: "Missing body" });
        return;
    }
    utils.account.checkSession(req.body.userId, req.body.sessionId, (isValidId) => {
        utils.account.isAdmin(req.body.userId, (isAdmin) => {
            if (isValidId && isAdmin) {
                let c = new Category(req.body);
                c.save()
                    .then(() => {
                        res.status(200).json({ success: true, response: c });
                    })
                    .catch((e) => {
                        console.error(e);
                        res.status(500).json({ success: false, response: "Error creating category" });
                    });
            } else {
                res.status(401).json({ success: false, response: "Invalid permissions to create category" });
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
            res.status(500).json({ success: false, response: "Error getting categories" });
            return;
        }
        res.status(200).json({ success: true, response: cArr });
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
            res.status(500).json({ success: false, response: "Error getting posts" });
            return;
        }
        postArr = postArr.filter(post => post.category.includes(req.body._id));
        res.status(200).json({ success: true, response: postArr });
    });
});




module.exports = categoryRoutes;
