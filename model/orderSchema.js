const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({

    productDetails: [{
        title: {
            type: String,
            required:true
        },
        category: {
            type: String,
            required:true
        },
        price: {
            type: Number,
            required:true
        },
        description: {
            type: String,
            required:true
        },
        image: {
            type: String,
            required:true
        }
   }],
    
    address: {
        name: {
            type: String,
            required:true
        },
        mobile: {
            type: Number,
            required:true
        },
        pincode: {
            type: Number,
            required:true
        },
        state: {
            type: String,
            required:true
        },
        address: {
            type: String,
            required:true
        },
        locality: {
            type: String,
            required:true
        },
        district: {
            type: String,
            required:true
        }
    },
    date: {
        type: Date,
        default:Date.now
    },
    
        name: {
            type: String,
            required:true
        },
        email: {
            type: String,
            required:true
        },
        phone: {
            type: Number,
            required:true
        }
    
    
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;