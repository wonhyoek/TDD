const productController = require("../../controller/products");
const productModel = require('../../models/Product');


productModel.create = jest.fn();


describe("Product Controller Create", () => {
    test("Should have a createProduct function", () => {
        expect(typeof productController.createProduct).toBe("function");
    });
    test("Should call productModel.create", () => {
        productController.createProduct();
        expect(productModel.create).toBeCalled();
    })
});