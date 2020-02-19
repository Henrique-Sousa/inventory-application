var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoryController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Store' });
});

router.get('/categories', category_controller.category_list);

module.exports = router;
