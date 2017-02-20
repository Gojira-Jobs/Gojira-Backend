let express = require('express');
let router = express.Router();
let bodyparser = require('body-parser');
let authfun = require('../authentication/authenticate');
let headercheck = require('../authentication/headercheck');
let superfun = require('../controller/superroute');
let admin = require('../controller/adminroute');
let user = require('../controller/userroute');
let common = require('../controller/commonroute');
let postroute = require('../controller/postroute');
let passport = require('passport');
let LocalPassport = require('./../services/passportauth');
let ppConfig = require('./../config');
(new LocalPassport(passport, ppConfig)).initConfig();

router.use(bodyparser());

//userroute

router.get('/googleauth', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/auth/google/callback', passport.authenticate('google', function(req, res) {
    console.log('Google Auth Done');
}));

router.post('/register', headercheck.headerchecking, user.registration)
router.post('/verified', user.verifyaccount)
router.post('/resendlink', user.resendlink)
router.get('/', authfun.user, user.userprofiledetail)
router.put('/', authfun.user, user.userprofileedit)
router.post('/signout', authfun.user, user.signout)
router.post('/reset', authfun.user, user.resetpassword)

// adminroute
router.get('/hr', authfun.admin, admin.getadmindetails)
router.put('/hr', authfun.admin, admin.putadmindetails)
router.post('/asignout', authfun.admin, admin.signout)
router.post('/jobadd', authfun.admin, admin.jobadd)
router.get('/postedJobs', authfun.admin, admin.postedjobs)
router.get('/applicants', authfun.admin, admin.applicants)
router.get('/userinfo', authfun.admin, admin.userinfo)
router.post('/areset', authfun.admin, admin.reset)

// admin and user common route
router.post('/login', headercheck.headerchecking, common.login)
router.post('/forgotpass', headercheck.headerchecking, common.forget)
router.post('/matchpass', common.passwordchange)

//postroute
router.get('/joblisting', postroute.joblisting)
router.post('/apply', authfun.user, postroute.apply)
router.get('/applied', authfun.user, postroute.applied)

// superroute
router.post('/slogin', headercheck.headerchecking, superfun.login)
router.post('/admin-insert', authfun.superauth, superfun.admininsert)
router.post('/admin-delete', authfun.superauth, superfun.admindelete)
router.post('/admin-list', authfun.superauth, superfun.adminlist)
router.post('/change', authfun.superauth, superfun.changepassword)
router.post('/ssignout', authfun.superauth, superfun.signout)

module.exports = router;