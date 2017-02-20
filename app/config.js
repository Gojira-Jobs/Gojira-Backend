const errors = {
    ACCEPTED: { code: "200", msg: "ok" },
    CREATED: { code: "201", msg: "Item Created" },
    BADREQUEST: { code: "400", msg: "Bad Request to server" },
    UNAUTHORIZED: { code: "401", msg: "UnAuthorized User" },
    FORBIDDEN: { code: "403", msg: "Problem In request" },
    NOTFOUND: { code: '404', msg: "Not Found" },
    INTERNAL: { code: "500", msg: "Server Internal Error" },
    AUTHORIZED: { code: "202", msg: "User Verified" },
    GOOGLEAUTH: {
        'clientID': '241947286880-ste9pvqfcm06vuidelc4p04b3h4dlofv.apps.googleusercontent.com',
        'clientSecret': '2-0uKLV_AJHzr0iDzbXtB6vc',
        'callbackURL': 'http://localhost:8000/api/auth/google/callback'
    }
}
module.exports = errors;