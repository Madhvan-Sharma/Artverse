const Image = require('../models/image');
const Comment = require('../models/comment');
const path = require('path');

module.exports.create = async function(req, res){

    try {
        
        let image = await Image.findById(req.body.image);

        if(image){

            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                image: req.body.image
            });

            image.comments.push(comment);
            image.save();

            req.flash('success', 'Comment added');
            return res.redirect(`${req.session.current_url}/#modal-for-${image.id}`);
        }

    } catch (error) {
        
        req.flash('error', 'Error in creating comment. Try again later...');
        console.log('ERROR in creating comment',error);
        return res.redirect('back');
    }
};

module.exports.deleteComment = async function(req, res){
    try {
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){

            let imageId = comment.image;

            comment.remove();

            await Image.findByIdAndUpdate(imageId,{ 
                $pull: {
                    comments: req.params.id
                }
            });

            req.flash('success', 'Comment deleted');
            
            return res.redirect(`${req.session.current_url}/#modal-for-${imageId}`);

        }else{
            req.flash('warning', 'Unauthorized user');
            console.log('Error in deleting Comment ********');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', 'Error in deleting the Comment. Try again later...');
        console.log('ERROR',err);
        return res.redirect('back');
    }
}