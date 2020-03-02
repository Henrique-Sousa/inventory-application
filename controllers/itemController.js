var Item = require('../models/item')

exports.item_list = function(req, res) {
    Item.find().populate('category').exec(function(err, results){
       res.render('item_list', {title: 'Item list', items: results} );
    });
};

exports.item_detail = function(req, res) {
    res.write('item ' + req.params.id);
    res.end();
};

exports.item_create_get = function(req, res) {res.send('...');};
exports.item_create_post = function(req, res) {res.send('...');};
exports.item_delete_get = function(req, res) {res.send('...');};
exports.item_delete_post = function(req, res) {res.send('...');};
exports.item_update_get = function(req, res) {res.send('...');};
exports.item_update_post = function(req, res) {res.send('...');};
