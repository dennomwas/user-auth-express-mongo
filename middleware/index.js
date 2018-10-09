const loggedOut = (req, res, next) => {
    if (req.session && req.session.userID) {
        return res.redirect('/profile');
    }
    return next();
};

const requiresLogin = (req, res, next) => {
    if (req.session && req.session.userID) {
        return next();
    } else {
        const err = new Error("You must be Logged in to access this page");
        err.status = 401;
        return next(err);
    }
};

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;