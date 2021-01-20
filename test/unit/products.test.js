const productController = require("../../controller/products");
const productModel = require('../../models/Product');
const httpMocks = require("node-mocks-http");
const newProduct = require("../data/new-product.json");
const allProduct = require("../data/new-product.json");


productModel.create = jest.fn();
productModel.find = jest.fn();

let req, res, next;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
})


describe("Product Controller Create", () => {
    
    beforeEach(() => {
        req.body = newProduct;
    })
    
    test("Should have a createProduct function", () => {
        expect(typeof productController.createProduct).toBe("function");
    });
    
    test("Should call productModel.create", async () => {
        await productController.createProduct(req, res, next);
        expect(productModel.create).toBeCalledWith(req.body);
    });

    test("Should return 201 response code", async () => {
        await productController.createProduct(req, res, null);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });

    test("Should return json body in response", async () => {
        productModel.create.mockReturnValue(newProduct);
        await productController.createProduct(res, res, next);
        expect(res._getJSONData()).toStrictEqual(req.body);
    });

    test("Should handle errors", async () => {
        const errorMessage = { message: "description property missing"};
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.create.mockReturnValue(rejectedPromise);
        await productController.createProduct(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});



describe("Product Controller Get", () => {
    test("should have a getProducts function", () => {
        expect(typeof productController.getProducts).toBe("function")
    });
    test("should call productModel.find({})", async () => {
        await productController.getProducts(req, res, next);
        expect(productModel.find).toHaveBeenCalledWith({});
    });
    test("should return 200 response", async () => {
        await productController.getProducts(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled).toBeTruthy();
    });
    test("should return json body in response", async () => {
        productModel.find.mockReturnValue(allProduct);
        await productController.getProducts(req, res, next);
        expect(res._getJSONData()).toStrictEqual(allProduct);
    });
    test("should handle errors", async () => {
        const errorMessage = { message: "Error finding product data"};
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.find.mockReturnValue(rejectedPromise);
        await productController.getProducts(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
})