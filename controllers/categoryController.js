var Category = require('../models/category');

exports.category_list = function(req, res) {
    Category.find({}, 'name', function(err, results){
        for (let result of results) {
            res.write(result.name + '\n');
        }
        res.end();
    });
};