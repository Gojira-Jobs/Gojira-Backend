let postPromises = require('../promises/postPromises');
let errors = require("../config");

module.exports = {
    joblisting: (req, res, next) => {
        let getData = postPromises.getPosts();
        getData.then((docs) => {
                if (!docs) res.status(errors.ACCEPTED.code).json({ status: 0, jobs: docs, msg: errors.ACCEPTED.msg });
                else res.status(errors.ACCEPTED.code).json({ status: 1, jobs: docs, msg: errors.ACCEPTED.msg });
            })
            .catch((err) => res.status(errors.INTERNAL.code).json({ error: errors.INTERNAL.msg }))
    },

    apply: (req, res, next) => {
        console.log("Inside Job Apply");
        let obj = {
            'email': req.body.email,
            'job_id': req.body.job_id,
            'resume': req.body.resume
        };
        console.log(obj);
        let applied = postPromises.addApplicant(obj);
        applied.then((msg) => res.status(errors.CREATED.code).json({ status: 1, job_id: obj.job_id, msg: msg }))
            .catch((err) => {
                console.log('In Error1');
                if (err == null || err == undefined) res.status(errors.BADREQUEST.code).json({ msg: "AppliedBy by UnAuthorized Person" })
                else res.status(errors.BADREQUEST.code).json({ msg: errors.BADREQUEST.msg })
            })
    },

    applied: (req, res, next) => {
        let getJobs = postPromises.getAppliedJobInfo(req.query.email);
        getJobs.then((docs) => {
                if (!docs) res.status(errors.ACCEPTED.code).json({ status: 0, users: docs, msg: errors.ACCEPTED.msg });
                else res.status(errors.ACCEPTED.code).json({ status: 1, jobs: docs, msg: errors.ACCEPTED.msg });
            })
            .catch((err) => res.status(errors.INTERNAL.code).json({ error: errors.INTERNAL.msg }))
    }
}