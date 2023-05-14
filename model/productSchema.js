const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required:true
    },
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
    },
    quantity: {
        type: Number,
        required:true
    },
    date: {
        type: Date,
        default:Date.now
    },
    usersRating: [{
        name: {
            type: String,
            required: true
        },
        rate: {
            type: Number,
            required: true
        },
        message: {
            type: String,
        required:true
        }
    }]
    
})

//stored the userRating
productSchema.methods.addReview = async function (name, rate, message) {
    try {
        this.usersRating = this.usersRating.concat({ name, rate, message });
        await this.save();
        return this.usersRating;
    } catch (error) {
        console.log(error);
    }
}

const Product = mongoose.model('Products', productSchema);

module.exports = Product;