const productController = require("../../controller/products");
const productModel = require('../../models/Product');
const httpMocks = require("node-mocks-http");
const newProduct = require("../data/new-product.json");
const allProduct = require("../data/new-product.json");


productModel.create = jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndRemove = jest.fn();

const productId = "6006b4525f1f0820421da21d";
const updatedProduct = { name: "update name", description: "updated description"};

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
});

describe("Product Controller GetById", () => {
    test("should have a getProductById", () => {
        expect(typeof productController.getProductById).toBe("function");
    });
    test("should call productModel.findById", async() => {
        req.params.productId = productId;
        await productController.getProductById(req, res, next);
        expect(productModel.findById).toBeCalledWith(productId);
    });
    test("should return json body and response code 200", async () => {
        productModel.findById.mockReturnValue(newProduct);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newProduct);
        expect(res._isEndCalled()).toBeTruthy();
    });
    test("should return 404 when item doesnt exist", async () => {
        productModel.findById.mockReturnValue(null);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy();
    });
    test("should handle errors", async () => {
        const errorMessage = { message: "error" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findById.mockReturnValue(rejectedPromise);
        await productController.getProductById(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
});

describe("Product Controller Update", () => {
    test("should have an updateProduct function", () => {
        expect(typeof productController.updateProduct).toBe("function");
    });
    test("should call productModel.findByIdAndUpdate", async () => {
        req.params.productId = productId;
        req.body = updatedProduct;
        await productController.updateProduct(req, res, next);
        expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
            productId, req.body, {new: true}
        );
    });
    test("should return json body and response code 200", async () => {
        req.params.productId = productId;
        req.body = updatedProduct;
        productModel.findByIdAndUpdate.mockReturnValue(updatedProduct);
        await productController.updateProduct(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(updatedProduct);
    });
    test("should handle 404 when item doesnt exist", async () => {
        productModel.findByIdAndUpdate.mockReturnValue(null);
        await productController.updateProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
    test("should handle errors", async () => {
        const errorMessage = { message: "error" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await productController.updateProduct(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
})

describe("Product Controller Delete", () => {
    test("should have a deleteProduct", () => {
        expect(typeof productController.deleteProduct).toBe("function");
    });
    test("should call productModel.findByIdAndRemove", async () => {
        req.params.productId = productId;
        await productController.deleteProduct(req, res, next);
        expect(productModel.findByIdAndRemove).toBeCalledWith(productId);
    });
    test("should return 200 response", async () => {
        let deletedProduct = {
            name: "deletedProduct",
            description: "deletedDescription"
        }
        productModel.findByIdAndRemove.mockReturnValue(deletedProduct);
        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(deletedProduct);
        expect(res._isEndCalled()).toBeTruthy();
    });
    test("should handle 404 when item doesnt exist", async () => {
        productModel.findByIdAndRemove.mockReturnValue(null);
        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
    test("should handle errors", async () => {
        const errorMessage = { message: "Error deleting"};
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndRemove.mockReturnValue(rejectedPromise);
        await productController.deleteProduct(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
})