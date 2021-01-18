const productModel = require('../models/Product');

exports.createProduct = (req, res) => {
    const createdProduct = productModel.create(req.body);
    res.status(201).json(createdProduct);
}