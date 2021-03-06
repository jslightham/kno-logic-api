const utils = require('../utils/utils');
const express = require('express');
const bcrypt = require('bcrypt');
const userRoutes = express.Router();

const saltRounds = 10;
const sessionLength = 25;

let Session = require('../schema/session.model');
let User = require('../schema/user.model');
let Post = require('../schema/post.model');
let Reset = require('../schema/reset.model');

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
    let u = new User(req.body);
    bcrypt.hash(u.password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error creating user");;
        } else {
            u.password = hash;
            User.find({ email: u.email }, (err, arr) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error creating user");
                }
                // Account already exists
                if (arr.length != 0) {
                    res.status(409).send("Account already exists");
                    return;
                }
                u.permission = 0;
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
            console.error(err);
            res.status(500).send("Error logging in user");
            return;
        }

        if (!u) {
            res.status(401).send("No user exists with that email");
            return;
        }

        bcrypt.compare(req.body.password, u.password, (err, result) => {
            if (err) {
                console.error(err);
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
    Session.findOne({ sessionId: req.body.sessionId }, (err, sess) => {
        if (err) {
            console.error(err);
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
            .catch((e) => {
                console.error(e);
                res.status(500).send("Error logging out");
            });

    });
});

// TODO: Add forgotten password route

/*
    POST - /user/favorite/add
    Add a favorite article
    Response: 200 - OK
              401 - Unauthorized
*/
userRoutes.route('/favorite/add').post((req, res) => {
    utils.account.checkSession(req.body.userId, req.body.sessionId, valid => {
        if (valid) {
            User.findById(req.body.userId, (err, user) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error adding article");
                    return;
                }
                user.favorites.push(req.body.postId);
                user.save()
                    .then(() => {
                        res.status(201).send("Success saving article");
                    })
                    .catch((e) => {
                        console.error(e);
                        res.status(500).send("Error saving article");
                    });
            })
        } else {
            res.status(401).send("Unauthorized");
        }
    })
})

/*
    POST - /user/favorite/remove
    Remove a favorite article
    Response: 200 - OK
              401 - Unauthorized
*/
userRoutes.route('/favorite/remove').post((req, res) => {
    utils.account.checkSession(req.body.userId, req.body.sessionId, valid => {
        if (valid) {
            User.findById(req.body.userId, (err, user) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error removing article");
                    return;
                }
                user.favorites = utils.array.removeValue(user.favorites, req.body.articleId);
                user.save()
                    .then(() => {
                        res.status(201).send("Success removing article");
                    })
                    .catch((e) => {
                        console.error(e);
                        res.status(500).send("Error removing article");
                    });
            })
        } else {
            res.status(401).send("Unauthorized");
        }
    })
})

/*
    POST - /user/favorite/get
    Get all favorite articles
    Response: 200 - OK
              401 - Unauthorized
*/
userRoutes.route('/favorite/get').post((req, res) => {
    utils.account.checkSession(req.body.userId, req.body.sessionId, valid => {
        if (valid) {
            User.findById(req.body.userId, (err, user) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error removing article");
                    return;
                }
                Post.find({ '_id': { $in: user.favorites } }, (err, postArray) => {
                    res.json(postArray);
                })
            })
        } else {
            res.status(401).send("Unauthorized");
        }
    })
})

userRoutes.route('/refresh').post((req, res) => {
    utils.account.checkRefresh(req.body.userId, req.body.refresh, valid => {
        if (valid) {
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
            res.status(401).send("Incorrect refresh token");
        }
    }
    )
});

userRoutes.route('/check-email').post((req, res) => {
    User.find({email: req.body.email}, (err, arr) => {
        if (err) {
            console.log(err);
        }

        if (arr.length > 0) {
            res.status(400).send("Email already in use");
        } else {
            res.status(200).send("Email not in use");
        }
    })
});

userRoutes.route('/change-name').post((req, res) => {
    utils.account.checkSession(req.body.userId, req.body.sessionId, valid => {
        if (valid) {
            User.findById(req.body.userId, (err, user) => {
                if (err) {
                    console.log(err);
                }
                if (user) {
                    user.name = req.body.name;
                    user.save();
                    res.status(200).send("Success changing name");
                } else {
                    res.status(400).send("No user found with that ID");
                }
            })
        } else {
            res.status(401).send("Unauthorized");
        }
    })
});

userRoutes.route('/change-email').post((req, res) => {
    utils.account.checkSession(req.body.userId, req.body.sessionId, valid => {
        if (valid) {
            User.findById(req.body.userId, (err, user) => {
                if (err) {
                    console.log(err);
                }
                if (user) {
                    user.email = req.body.email;
                    user.save();
                    res.status(200).send("Success changing email");
                } else {
                    res.status(400).send("No user found with that ID");
                }
            })
        } else {
            res.status(401).send("Unauthorized");
        }
    })
});

userRoutes.route('/change-password').post((req, res) => {
    utils.account.checkSession(req.body.userId, req.body.sessionId, valid => {
        if (valid) {
            User.findById(req.body.userId, (err, user) => {
                if (err) {
                    console.log(err);
                }
                if (user) {
                    user.password = req.body.password;
                    user.save();
                    res.status(200).send("Success changing password");
                } else {
                    res.status(400).send("No user found with that ID");
                }
            })
        } else {
            res.status(401).send("Unauthorized");
        }
    })
});

userRoutes.route('/forgot-password').post((req, res) => {
    if (req.body.email) {
        User.findOne({ email: req.body.email }, (err, user) => {
            if (err) {
                console.log(err);
            }
            if (user) {
                let pin = generatePin();
                let r = new Reset();
                r.userId = user._id;
                r.pin = pin;
                r.date = new Date();
                r.save();
                utils.mail.sendMail(user, "forgotPassword", [{from: "%name%", to: user.name}, {from: "%pin%", to: pin}]);
                res.status(200).send("Success sending reset email");
            } else {
                res.status(400).send("No user found with that email");
            }
        }
        )
    }
});

userRoutes.route('/reset-password').post((req, res) => {
    if (req.body.userId && req.body.pin) {
        User.findOne({ email: req.body.email }, (err, user) => {
            if (err) {
                console.log(err);
            }
            if (user) {
                Reset.findOne({ userId: user._id, pin: req.body.pin}, (err, reset) => {
                    if (err) {
                        console.log(err);
                    }
                    if (reset) {
                        reset.remove();
                        user.password = req.body.password;
                        user.save();
                        res.status(200).send("Success resetting password");
                    } else {
                        res.status(400).send("Invalid pin");
                    }
                })
            } else {
                res.status(400).send("No user found with that email");
            }
        }
        )
    }
});


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

function generatePin() {
    var length = pinLength;
    var result = [];
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}
