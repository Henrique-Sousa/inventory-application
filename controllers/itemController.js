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