var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoryController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Online Store' });
});

router.get('/categories', category_controller.category_list);
router.get('/category/create', category_controller.category_create_get);
router.post('/category/create', category_controller.category_create_post);
router.get('/category/:id', category_controller.category_detail);

module.exports = router;
