var Item = require('../models/item')

exports.item_list = function(req, res) {
    Item.find().populate('category').exec(function(err, results){
       res.render('item_list', {title: 'Item list', items: results} );
    });
};

exports.item_detail = function(req, res, next) {
    // Item.findById(req.params.id, function(err, result) {
    //     if (err) { return next(err); }
    //     res.render('item_detail', {title: 'Item detail', item: result});
    // });
    Item.findById(req.params.id).populate('category').exec(function(err, result) {
        if (err) { return next(err); }
        // res.send(result.category[0].name);
        res.render('item_detail', {title: 'Item detail', item: result});
    });
};

exports.item_create_get = function(req, res) {res.send('...');};
exports.item_create_post = function(req, res) {res.send('...');};
exports.item_delete_get = function(req, res) {res.send('...');};
exports.item_delete_post = function(req, res) {res.send('...');};
exports.item_update_get = function(req, res) {res.send('...');};
exports.item_update_post = function(req, res) {res.send('...');};
