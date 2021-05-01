const express = require('express');
const router = express.Router();
const passport = require('passport');
const upload = require('../config/multer');

const userController = require('../controllers/user_controller');

router.get('/sign-up', userController.signUpPage);
router.get('/sign-in', userController.signInPage);
router.get('/upload-page', userController.uploadPage);
router.get('/personal-images', passport.checkAuthentication, userController.personalImages);

router.post('/create-session', passport.authenticate(
    'local',
    {
        failureRedirect : '/user/sign-in'
    }
), userController.createSession);

router.post('/create-user', userController.createUser);

router.get('/sign-out', userController.destroySession);

router.post('/upload-image/:id', [passport.checkAuthentication, upload.single('images')], userController.uploadImage);

router.get('/destroy/:id', passport.checkAuthentication, userController.deleteImage);

module.exports = router;