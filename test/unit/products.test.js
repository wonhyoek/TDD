const productController = require("../../controller/products");

describe("Product Controller Create", () => {
    test("Should have a createProduct function", () => {
        expect(typeof productController.createProduct).toBe("function");
    });
});