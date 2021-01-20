const productModel = require('../models/Product');

exports.createProduct = async (req, res, next) => {
    try {
        const createdProduct = await productModel.create(req.body);
        //console.log("createProduct", createdProduct);
        res.status(201).json(createdProduct);
    } catch (error) {
        next(error);
    }
}

exports.getProducts = async (req, res, next) => {
    try {
        const allProduct = await productModel.find({});
        res.status(200).json(allProduct);
    } catch (error) {
        next(error)
    }
}

exports.getProductById = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.productId);
    
        if(product){
            res.status(200).json(product);
        } else {
            res.status(404).send();
        }
    } catch (error) {
        next(error);
    }
    
}