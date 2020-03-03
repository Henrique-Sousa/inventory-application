var Item = require('../models/item')
var Category = require('../models/category')

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.item_list = function(req, res) {
    Item.find().populate('category').exec(function(err, results){
       res.render('item_list', {title: 'Item list', items: results} );
    });
};

exports.item_detail = function(req, res, next) {
    Item.findById(req.params.id).populate('category').exec(function(err, result) {
        if (err) { return next(err); }
        if (result==null) {
            res.redirect('/items');
        }
        res.render('item_detail', {title: 'Item detail', item: result});
    });
};

exports.item_create_get = function(req, res) {
    Category.find({}, 'name', function(err, results){
        if (err) { return next(err); }
        res.render('item_form', {title: 'Create new item', categories: results});
    });
};

exports.item_create_post  = [
    // Convert category to an array.
    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
                if(typeof req.body.category==='undefined')
                req.body.category=[];
                else
                req.body.category=new Array(req.body.category);
            }
        next();
    },

    // Validate fields.
    body('item_name', 'Item name must not be empty.').isLength({ min: 1 }).trim(),
    
    // Sanitize fields (using wildcard).
    // sanitizeBody('*').escape(),
    // sanitizeBody('category.*').escape(),
    //TODO não sei por que mas o array de categorias vira uma categoria so depois que eu uso escape()
    
    function(req, res, next) {

        const errors = validationResult(req);
        var item = new Item({
            name: req.body.item_name,
            description: req.body.item_description,
            price: req.body.item_price,
            number_in_stock: req.body.item_number_in_stock,
            category: req.body.category
        });
        if(errors.isEmpty()) {
            //TODO Verify if item already exists ???
            item.save(function (err) {
                if (err) { return next(err); }
                    res.redirect(item.url);
            });
        } else {
            // There are errors. Render form again with sanitized values/error messages.
            Category.find({}, 'name', function(err, all_categories) {
                for(let i=0; i < all_categories.length; i++) {
                    if (item.category.indexOf(all_categories[i]._id) > -1) {
                        all_categories[i].checked = 'true';
                    }
                }
                res.render('item_form', {title: 'Create item', item, categories: all_categories, errors: errors.array()} );
            });
        }
    }
];

exports.item_delete_get = function(req, res) {res.send('...');};
exports.item_delete_post = function(req, res) {res.send('...');};
exports.item_update_get = function(req, res) {res.send('...');};
exports.item_update_post = function(req, res) {res.send('...');};
