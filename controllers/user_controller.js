const User = require('../models/user');
const Image = require('../models/image');
const Comment = require('../models/comment');

const cloudinary = require('cloudinary');
const { populate } = require('../models/user');
require('../config/cloudinary');

module.exports.signUpPage = function(req, res){
    if (req.isAuthenticated()){
        req.flash('info', 'Sign out first to make another account');
        return res.redirect('back');
    }
    return res.render('sign_up',{
        title: 'Sign Up'
    });
};

module.exports.signInPage = function(req, res){

    if (req.isAuthenticated()){
        req.flash('info', 'User already logged in');
        return res.redirect('back');
    }
    return res.render('sign_in', {
        title: 'Sign In'
    });

};

module.exports.createSession = function(req, res){
    req.flash('success', 'Successfully Logged in');
    return res.redirect('/');
};

// get the sign up data
module.exports.createUser = function(req, res){

    if (req.body.password != req.body.confirm_password){
        req.flash('warning', `Passwords don't match!`)
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log('error in finding user in signing up');
            req.flash('error', 'Try again later!'); 
            return res.redirect('back');
        }

        if (!user){
            User.create(req.body, function(err, curr_user){
                if(err){
                    console.log('error in creating user while signing up: ', err); 
                    return res.redirect('back');
                }
                    console.log(curr_user);
                    req.flash('success', 'Account successfully created!')
                    return res.redirect('/user/sign-in');
            });

        }else{
            req.flash('info', 'User already exists');
            return res.redirect('back');
        }

    });
};

module.exports.destroySession = function(req, res){
    console.log('User has Logged out');
    req.logout();

    req.flash('success', 'Signed out successfully!');

    return res.redirect('/');
};

module.exports.uploadPage = function(req,res){

    if (!req.isAuthenticated()){
        req.flash('info', 'Sign in to Upload Images');
        return res.redirect('/user/sign-in');
    }
    return res.render('upload_image', {
        title: 'Upload Images'
    });
}

// controller to upload Image
module.exports.uploadImage = async function(req, res){
    if(req.user.id == req.params.id){

        try{
            
            const result = await cloudinary.v2.uploader.upload(req.file.path);

            console.log(result);
            let priv = false;
            if(req.body.private)priv = true;

            let image = await Image.create({
                location: result.secure_url,
                user: req.user._id,
                privacy: priv,
                title: req.body.title,
                public_id: result.public_id
            });

            let user = await User.findById(req.params.id);

            if(user){

                user.images.push(image);
                user.save();

            }

            req.flash('success', 'Image Uploaded');

            return res.redirect('/');

            
        }catch(err){
            console.log(err);
            req.flash('error', 'Error in uploading image');
            return res.redirect('back');
        }


    }else{
        req.flash('warning', 'Unauthorized user');
        return res.redirect('back');
    }
};

module.exports.deleteImage = async function(req, res){

    try {
        
        let image = await Image.findById(req.params.id);

        if(image.user == req.user.id){


            cloudinary.v2.uploader.destroy(image.public_id);

            image.remove();

            await Comment.deleteMany({
                image: req.params.id
            });

            return res.redirect('back');

        }else{
            req.flash('warning', 'Unauthorized user');
            console.log('Unauthorized: ', err);
            return res.redirect('back');
        }

    } catch (err) {
        console.log('Error in deleting IMAGE!!!!!  : ', err);
        return;
    }

};

module.exports.personalImages = async function(req, res){

    try {
    
        res.locals.urlPath = req.baseUrl + req.path;
        req.session.current_url = '/user/personal-images';
        
        let user = await User.findById(req.user._id)
        .populate({
            path: 'images',
            populate: {
                path: 'user comments',
                populate: {
                    path:'user'
                }
            }
        });

        return res.render('personal_images', {
            title : 'Personal Images',
            user_images: user.images
        });
    
    } catch (err) {
        req.flash('error', 'Error while loading your images. Try again later...');
        console.log('ERROR: ', err);
        return res.redirect('back');
    }

}
