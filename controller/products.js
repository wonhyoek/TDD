const productModel = require('../models/Product');

exports.createProduct = (req, res) => {
    productModel.create(req.body);
    res.status(201).send("")
}