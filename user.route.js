const utils = require ('./utils');
const express = require('express');
const bcrypt = require('bcrypt');
const userRoutes = express.Router();

const saltRounds = 10;
const sessionLength = 25;

let Session = require('./session.model');
let User = require('./user.model');

/*
    POST - /user/create
    Create a user
    Response: 201 - Created
              409 - Account already exists
*/
userRoutes.route('/create').post((req, res) => {
    if (!req.body) {
        res.status(401).send("Missing body");
        return;
    } else if (!req.body.email || !req.body.password || !req.body.name) {
        res.status(401).send("Missing body");
        return;
    } else if (req.body.email == "" || req.body.password == "" || req.body.name == "") {
        res.status(401).send("Empty fields");
        return;
    }
    console.log(req.body);
    let u = new User(req.body);
    // TODO: Look for a different encryption method that can scale more easily
    bcrypt.hash(u.password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error creating user");;
        } else {
            console.log(hash);
            u.password = hash;
            User.find({ email: u.email }, (err, arr) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Error creating user");
                }
                // Account already exists
                if (arr.length != 0) {
                    res.status(409).send("Account already exists");
                    return;
                }
                u.save()
                    .then(() => {
                        res.status(201).send("Success creating user");
                    })
                    .catch(() => {
                        res.status(500).send("Error creating user");;
                    });
            });
        }
    });

});

/*
    POST - /user/login
    Login a user
    Response: 201 - Created session
              401 - Incorrect
*/
userRoutes.route('/login').post((req, res) => {
    if (!req.body) {
        res.status(401).send("Missing body");
        return;
    } else if (!req.body.email || !req.body.password) {
        res.status(401).send("Missing body");
        return;
    } else if (req.body.email == "" || req.body.password == "") {
        res.status(401).send("Empty fields");
        return;
    }
    User.findOne({ email: req.body.email }, (err, u) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error logging in user");
            return;
        }

        if (!u) {
            res.status(401).send("No user exists with that email");
            return;
        }

        bcrypt.compare(req.body.password, u.password, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error logging in user");
                return;
            }

            if (result) {
                let s = new Session();
                s.sessionId = generateSession();
                s.userId = u._id;
                s.date = new Date();

                s.save()
                    .then(() => {
                        res.json(s);
                    })
                    .catch(() => {
                        res.status(500).send("Error logging in user");
                    });
            } else {
                res.status(401).send("Incorrect password");
            }
        });

    });
});

/*
    POST - /user/logout
    Logout a user
    Response: 200 - Removed session 
              400 - No session exists
*/
userRoutes.route('/logout').post((req, res) => {
    Session.findOne({sessionId: req.body.sessionId}, (err, sess) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error logging out");
            return;
        }

        if (!sess) {
            res.status(400).send("No session found");
            return;
        }

        sess.delete()
            .then(() => {
                res.status(201).send("Success deleting session");
            })
            .catch(() => {
                res.status(500).send("Error logging out");
            });

    });
});

// TODO: Add forgotten password route

module.exports = userRoutes;

function generateSession() {
    var length = sessionLength;
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-+!@#$%^&*()';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}
