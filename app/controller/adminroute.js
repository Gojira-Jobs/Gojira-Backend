let databasefunction = require('../helper/hrquery');
let postPromises = require('../promises/postPromises');
let errors = require('../config');

module.exports = {
    getadmindetails: (req, res, next) => {
        console.log("gsggs " + req.headers.email);
        let hr = postPromises.searchForHr(req.headers.email);
        hr.then((hrdata) => {
            if (!hrdata) res.json({ success: false, data: null, msg: "Not found Any DAta" });
            else {
                var hrData = hrdata.toObject();
                hrData.isHr = true;
                console.log("hrdata:" + hrData);
                res.json({ success: true, data: hrData, msg: "User data send" });
            }
        }).catch((err) => {
            console.log(err);
        })
    },

    putadmindetails: (req, res, next) => {
        if (!req.body.email)
            res.status(errors.BADREQUEST.code).json({ msg: errors.BADREQUEST.msg });
        else {
            console.log("Put req body" + req.body);
            var updateData = postPromises.setData(req.body);
            updateData.then((data) => {
                res.status(errors.ACCEPTED.code).json({ msg: "Updation Completed", data: data });
            }).catch((err) => {
                res.status(errors.INTERNAL.code).json({ msg: errors.INTERNAL.msg })
            });

        }
    },

    signout: (req, res, next) => {
        console.log('In admin Signout ' + req.body.email);
        let obj = {
            'email': req.headers.email.toLowerCase()
        };
        databasefunction.signout(obj).then((resolve) => {
            if (resolve === null || resolve.length <= 0) res.status(404).send({ 'status': 0, 'err': 'User not found' });
            else res.status(200).send({ 'status': 1, 'data': 'Successfully signout' });
        }).catch((reject) => {
            console.log('Signout Error: ', reject);
            res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' });
        })
    },

    jobadd: (req, res, next) => {
        var postCreated = postPromises.addPost(req.body);
        postCreated.then((msg) => {
            res.status(errors.CREATED.code).json({ msg: msg });
        }).catch((err) => {
            if (err === null || err === 'undefined') res.status(errors.BADREQUEST.code).json({ msg: "PostBy by UnAuthorized Person" });
            else res.status(errors.BADREQUEST.code).json({ msg: errors.BADREQUEST.msg });
        })
    },

    postedjobs: (req, res, next) => {
        var getPostedJobs = postPromises.getPostedJobs(req.query.email);
        getPostedJobs.then((docs) => res.status(errors.ACCEPTED.code).json({ docs: docs }))
            .catch((err) => {
                if (err === null || err === 'undefined') res.status(errors.ACCEPTED.code).json({ msg: "User Not Posted anything" });
                else res.status(errors.INTERNAL.code).json({ msg: errors.INTERNAL.msg });
            });
    },

    applicants: (req, res, next) => {
        var getApplicants = postPromises.getApplicantInfo(req.query.job_id);
        getApplicants.then((docs) => {
                if (!docs) res.status(errors.ACCEPTED.code).json({ status: 0, users: docs, msg: errors.ACCEPTED.msg });
                else res.status(errors.ACCEPTED.code).json({ status: 1, jobs: docs, msg: errors.ACCEPTED.msg });
            })
            .catch((err) => res.status(errors.INTERNAL.code).json({ error: errors.INTERNAL.msg }))
    },

    userinfo: (req, res, next) => {
        console.log(req.query.email);
        var getUser = postPromises.getUserInfo(req.query.email);
        getUser.then((docs) => {
                if (!docs) res.status(errors.ACCEPTED.code).json({ status: 0, user: docs, msg: errors.ACCEPTED.msg });
                else res.status(errors.ACCEPTED.code).json({ status: 1, user: docs, msg: errors.ACCEPTED.msg });
            })
            .catch((err) => res.status(errors.INTERNAL.code).json({ error: errors.INTERNAL.msg }))
    },

    reset: (req, res, next) => {
        console.log(req.headers);
        let obj = {
            'email': req.headers.email,
            'token': "No",
            'password': req.body.password,
        };
        databasefunction.passwordreset(obj).then((data) => {
                if (data == null || data.length <= 0) res.status(404).send({ 'status': 0, 'err': 'User Not found' })
                else res.status(200).send({ 'status': 1, 'data': 'Password Successfully reset. Kindly login to access your account.' })
            })
            .catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
    }
}