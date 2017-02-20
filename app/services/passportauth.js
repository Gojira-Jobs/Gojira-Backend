let googleStrategy = require('passport-google-oauth').OAuth2Strategy;
let User = require('./../models/user');

module.exports = class {

    constructor(passport, passprtConfig) {
        this.passport = passport;
        this.passprtConfig = passprtConfig;
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
                    return done(null, profile);
                })
            }
        ))
    }
}