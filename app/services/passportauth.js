let googleStrategy = require('passport-google-oauth').OAuth2Strategy;
let User = require('../models/user');
let user = require('../helper/userquery');
let tokenFun = require('../services/jwttoken');

module.exports = class {

    constructor(passport, passprtConfig, userinfo) {
        this.passport = passport;
        this.passprtConfig = passprtConfig;
        this.userinfo = userinfo;
        console.log("GAbbar============================================", this.passprtConfig);
        this.initConfig();
    }

    initConfig() {
        this.passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        this.passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
                done(err, user);
            });
        });

        this.passport.use(new googleStrategy({
                clientID: this.passprtConfig.GOOGLEAUTH.clientID,
                clientSecret: this.passprtConfig.GOOGLEAUTH.clientSecret,
                callbackURL: this.passprtConfig.GOOGLEAUTH.callbackURL
            },
            (token, refreshToken, profile, done) => {
                console.log('In Callback Token Function: ');
                process.nextTick(() => {
                    console.log('Profile Information', profile.displayName, profile.emails[0].value);
                    this.userinfo.name = profile.displayName;
                    this.userinfo.email = profile.emails[0].value;
                    this.userinfo.token = tokenFun.gettoken(this.userinfo.email);
                    console.log('In Callback userinfo: ', this.userinfo);
                    return done(null, profile);
                })
            }
        ))
    }
}