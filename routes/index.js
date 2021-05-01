const express = require('express');
const homeController = require('../controllers/main_controller');

const router = express.Router();

router.get('/', homeController.renderMainPage );
router.use('/user', require('./user'));
router.use('/comments', require('./comments'));


module.exports = router;