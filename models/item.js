var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: {type: String, required: true, max: 100},
    description: String,
    category: [{type: Schema.Types.ObjectId, ref: 'Category'}],
    price: Number,
    number_in_stock: Number
});

ItemSchema
.virtual('url')
.get(function() {
    return '/item/' + this.id;
});

module.exports = mongoose.model('Item', ItemSchema);