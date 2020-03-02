var Category = require('../models/category');
var Item = require('../models/item')

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.category_list = function(req, res) {
    Category.find({}, 'name', function(err, results){
        if (err) { return next(err); }
        res.render('category_list', {title: 'Category list', categories: results} );
    });
};

exports.category_detail = function(req, res) {
    Promise.all([
        new Promise(function(resolve, reject) {
            Category.findById(req.params.id, function (err, category) {
                if (err) { return next(err); }
                if (category == null) {
                    res.redirect('/categories');
                }
                resolve(category);
            });
        }),
        new Promise(function(resolve, reject) {
            Item.find({'category': req.params.id}, function (err, items) {
                if (err) { return next(err); }
                resolve(items);
            });
        })
    ])
    .then(results => res.render('category_detail', {title: 'Category detail', category: results[0], items: results[1]}));        
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

exports.category_delete_get = function(req, res) {
    Promise.all([
        new Promise(function(resolve, reject) {
            Category.findById(req.params.id, function (err, category) {
                if (err) { return next(err); }
                if (category == null) {
                    res.redirect('/categories');
                }
                resolve(category);
            });
        }),
        new Promise(function(resolve, reject) {
            Item.find({'category': req.params.id}, function (err, items) {
                if (err) { return next(err); }
                resolve(items);
            });
        })
    ])
    .then(results => res.render('category_delete', {title: 'Delete category', category: results[0], items: results[1]}));
};

exports.category_delete_post = function(req, res) {
    Promise.all([
        new Promise(function(resolve, reject) {
            Category.findById(req.params.id, function (err, category) {
                if (err) { return next(err); }
                if (category == null) {
                    res.redirect('/categories');
                }
                resolve(category);
            });
        }),
        new Promise(function(resolve, reject) {
            Item.find({'category': req.params.id}, function (err, items) {
                if (err) { return next(err); }
                resolve(items);
            });
        })
    ])
    .then(results => {
        if (results[1].length) {
            res.render('category_delete', {title: 'Delete category', category: results[0], items: results[1]});
        } else {
            Category.findByIdAndRemove(req.body.categoryid, function(err) {
                if (err) { return next(err); }
                res.redirect('/categories')
            });
        }
    });
};

exports.category_update_get = function(req, res) {
    Category.findById(req.params.id, function(err, result) {
        if (err) { return next(err); } 
        else if (result) {
            res.render('category_form', {title: 'Category update', category: result});
        } 
        else {
            res.redirect('/categories');
        }
    });
}

// exports.category_update_post = function(req, res) {
//     res.send('category_update_post' + req.params.id) ;
// }

exports.category_update_post = [
    // Validate fields.
    body('category_name', 'Category name must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields (using wildcard).
    sanitizeBody('*').escape(),
    function(req, res, next) {
        const errors = validationResult(req);
        var category = new Category({
            name: req.body.category_name,
            description: req.body.category_description,
            _id: req.params.id
        });
        if(errors.isEmpty()) {
            //Verify if category already exists
            Category.findByIdAndUpdate(req.params.id, category, {}, function(err, result) {
                if (err) { return next(err); } 
                res.redirect(result.url);
            });

        } else {
            res.render('category_form', {title: 'Create category', category, errors: errors.array()} );
        }
    }
];
