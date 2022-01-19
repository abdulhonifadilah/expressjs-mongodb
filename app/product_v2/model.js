const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name : {
        type: String,
        minlength : 2,
        maxlength : 50,
        required : true
    },
    price : {
        type: Number,
        required: true,
        min : 1000,
        max : 100000000
    },
    stock :{
        type: Number,
        default: 0
    },
    status:{
        type: Boolean,
        default : false
    },
    image_url : {
        type: String
    }
})


const Product = mongoose.model('Product', productSchema);
module.exports= Product;