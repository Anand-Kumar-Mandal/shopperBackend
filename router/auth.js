const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
require('../db/conn');
const User = require("../model/userSchema");
const jwt = require('jsonwebtoken');
const Product = require('../model/productSchema');
const Order = require('../model/orderSchema');
router.get('/about', (req, res) => {
    res.send("Hello world from the router auth.js")
});
//using promises
// router.post('/register', (req, res) => {
//     const { name, email, phone, work, password, cpassword } = req.body;

//     if (!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({error:'Plz fill the field properly'})
//     }
//     User.findOne({ email: email }).then((userExist) => {
//         if (userExist) {
//             return res.status(422).json({ error: "Email already Exist" });
//         }
//         const user = new User({ name, email, phone, work, password, cpassword });

//         user.save().then(() => {
//             res.status(201).json({ message: "user registered successfully" });
//         }).catch((err) => res.status(500).json({ error: 'Failed to registered' }));

//     }).catch(err => { console.log(err); });

// })

//using async-await for register

router.post('/register', async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({error:'Plz fill the field properly'})
    }
    try {
        const userExist = await User.findOne({ email: email });
            
        if (userExist) {
            return res.status(422).json({ error: "Email already Exist" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "Password are not matching" });
        } else {

            const user = new User({ name, email, phone, work, password, cpassword });
        
            await user.save();

            res.status(201).json({ message: "user registered successfully"});
        } 
 
    } catch (err) {
    console.log(err);
}
})

//login route
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Plz Filled the required data' });
    }
    const userLogin = await User.findOne({ email: email });
    
     if (userLogin) {
         const isMatch = (userLogin.password === password);
        //  console.log(bcrypt.genSalt(userLogin.password))
         console.log(userLogin.password);

         //using token
        //  const token = await userLogin.generateAuthToken();
        //  console.log(token);

        //  res.cookie("jwtoken", token, {
        //      expires: new Date(Date.now() + 25892000000),
        //      httpOnly:true
        //  })
         

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid creditantials" });
        } else {
            return res.status(202).json({ message: 'user Signin Successfully' });
        }
    } else {
        return res.status(400).json({ error: "Invalid creditantials" });
    }
    } catch (err) {
        console.log(err);
    }
})

//get user details
router.get("/users/get",async (req,res)=> {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        console.log(err);
    }
})

//Add a new product

router.post('/addproduct', async (req, res) => {
    const { id, title, category, price, description, image, quantity } = req.body;
    if (!id || !title || !category || !price || !description || !image || !quantity) {
        return res.status(422).json({ error: 'Plz fill all the field properly' });
    }
    try {
        const productExist = await Product.findOne({ id: id });
        if (productExist) {
            return res.status(422).json({ error: 'product id is available' });
        } else {
            const product = new Product({ id, title, category, price, description, image, quantity });
            await product.save();
            res.status(201).json({ message: "Product registered successfully"});
        }
    }
    catch (error) {
        console.log(error);
    }
})

// get all products
router.get("/products/get",async (req,res)=> {
    try {
        const products = await Product.find({});
        res.send(products);
    } catch (err) {
        console.log(err);
    }
})

//get products by category
router.get("/products/category/:catName", async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.catName });
        if (products) {
            res.send(products);
            res.status(200).json({ message: "product by category is loaded" });
        } else {
            res.status(422).json({ error: 'requested product category is not available' });
        }
    } catch (err) {
        console.log(err);
   }
})

// get a specific product by _id
router.get("/products/get/:id",async (req,res)=> {
    try {
        const singleProduct = await Product.findById(req.params.id);
        if (singleProduct) {
            res.send(singleProduct);
        } else {
            res.status(422).json({ error: 'requested product is not available' });
        }
        
    } catch (err) {
        console.log(err);
    }
})

//update one product
router.put("/products/update/:id", async (req, res) => {
    try {
        const result = await Product.updateOne(
            { _id: req.params.id },
            {$set:req.body}
        )
        if (result) {
            res.status(202).json({ message: 'your requested product is updated' });
        } else {
            res.status(422).json({ error: 'your requested product is not responded' });
        }
    } catch (err) {
        console.log(err);
   }
})

// delete a specific product by _id
router.delete("/products/delete/:id",async (req,res)=> {
    try {
        const singleProduct = await Product.deleteOne({_id:req.params.id});
        if (singleProduct) {
            res.status(200).json({message:"One product deleted"});
        } else {
            res.status(422).json({ error: 'your requested product is not deleted' });
        }
        
    } catch (err) {
        console.log(err);
    }
})

// //search by keyword
router.get("/search/:key", async (req, res) => {
    let result = await Product.find({
        "$or": [
            { title: { $regex: req.params.key } },

            { description: { $regex: req.params.key } }
          
        ]
    });
    res.send(result);
})

// review section in details
router.post('/reviewproduct/:id', async (req, res) => {
    try {
        const { name, rate, message } = req.body;
        if (!name, !rate, !message) {
            console.log("error in review form");
            return res.json({ error: 'plzz filled the review form' });
        }
        const userRate = await Product.findOne({ _id: req.params.id });
        if (userRate) {
            const userReview = await userRate.addReview(name, rate, message);
            await userRate.save();
            res.status(201).json({ message: 'Review submitted' });
            
        }

    } catch (error) {
        console.log(error);
    }
})


//post order details
router.post('/order', async (req, res) => {
    const { productDetails,address, name, email, phone } = req.body;
    
    try {
        const order = new Order({productDetails,address,name, email, phone });
        
            await order.save();

            res.status(201).json({ message: "Order submitted"});
    } catch (err) {
        console.log(err);
    }
 })
    

module.exports = router;