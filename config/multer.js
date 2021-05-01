const multer = require('multer');
const path = require('path');

const IMAGE_PATH = path.join('./uploads/images');

module.exports = multer({
    storage: multer.diskStorage({

        destination: function(req, file, callback){
            callback(null, path.join(__dirname, '..', IMAGE_PATH));
        },
        filename: function(req, file, callback){
            callback(null, req.body.title + '-' + Date.now());
        }
    }), 
    fileFilter: function(req, file, callback){
        if(!file.mimetype.match(/jpg|jpeg|png|gif$i/)){
            callback(new Error('File is not supported'), false);
            return;
        }
        callback(null, true);
    }
});