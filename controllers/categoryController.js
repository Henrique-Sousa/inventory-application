var Category = require('../models/category');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.category_list = function(req, res) {
    Category.find({}, 'name', function(err, results){
       res.render('category_list', {title: 'Category list', results} );
    });
};

exports.category_create_get = function(req, res) {
    res.render('category_form', {title: 'Create category'} );
};

exports.category_create_post = [
    // Validate fields.
    body('category_name', 'Category name must not be empty.').isLength({ min: 1 }).trim(),
    // body('category_description', 'Category description must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields (using wildcard).
    sanitizeBody('*').escape(),
    function(req, res) {
        const errors = validationResult(req);
        var category = new Category({
            name: req.body.category_name,
            description: req.body.category_description
        });
        if(errors.isEmpty()) {
            //Verify if category already exists
            Category.findOne({'name': req.body.category_name}, 'name', function(err, result) {
                if (err) { return next(err); } 
                else if (result) {
                    res.render('category_form', {title: 'Create category', category, errors: [{'msg':'Category ' + req.body.category_name + ' already exists'}]});
                } else {
                    category.save(function (err) {
                        if (err) { return next(err); }
                           res.redirect(category.url);
                    });
                }
            });

        } else {
            res.render('category_form', {title: 'Create category', category, errors: errors.array()} );
        }
    }
];

exports.category_detail = function(req, res) {
    res.send('category ' + req.params.id);
};