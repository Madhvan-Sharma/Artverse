const { localsName } = require('ejs');
const Image = require('../models/image');

module.exports.renderMainPage = async function(req, res){

    try {

        res.locals.urlPath = req.baseUrl + req.path;
        req.session.current_url = '';
        
        let allImages = await Image.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
        


        return res.render('home', {
            title : 'Artverse | Public Images',
            images: allImages
        });

    } catch (err) {
        req.flash('error', 'Error in loading page. Try again later....');
        console.log('ERROR: ', err);
        return;
    }

}

