const productModel = require('../models/Product');

exports.createProduct = async (req, res) => {
    const createdProduct = await productModel.create(req.body);
    console.log("createProduct", createdProduct);
    res.status(201).json(createdProduct);
}