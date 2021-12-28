const User = require("../models/user");
const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require("bcryptjs");

const passportConfig = (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async function(username, password, done) {
        try {
            let userFind = await User.findOne({ email: username });
            if (!userFind) return done(null, false, { message: 'Incorrect email.' });
            let compare = await bcryptjs.compare(password, userFind.password);
            if (!compare)
                return done(null, false, { message: 'Incorrect password.' });
            return done(null, userFind);
        } catch (error) {
            return done(error);
        }
    }));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


};

module.exports = passportConfig;