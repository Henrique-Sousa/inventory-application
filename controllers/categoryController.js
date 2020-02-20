var Category = require('../models/category');

exports.category_list = function(req, res) {
    Category.find({}, 'name', function(err, results){
       res.render('category_list', {title: 'Category list', results} );
    });
};