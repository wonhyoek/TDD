const request = require("supertest");
const app = require("../../index");
const newProduct = require("../data/new-product.json");


let firstProduct;

test("POST /api/products", async () => {
    const response = await request(app)
                        .post("/api/products")
                        .send(newProduct);
    
    expect(response.statusCode).toBe(201)
    expect(response.body.name).toBe(newProduct.name)
    expect(response.body.description).toBe(newProduct.description)
})

test("should return 500 on POST /api/products", async () => {
    const response = await request(app)
                        .post('/api/products')
                        .send({name: "phone"})

    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({ message: "Product validation failed: description: Path `description` is required." })
})

test("GET /api/products", async () => {
    const response = await request(app).get('/api/products');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].description).toBeDefined();
    firstProduct = response.body[0];
})

test("GET /api/product/:productId", async () => {
    const response = await request(app).get(`/api/products/${firstProduct._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(firstProduct.name);
    expect(response.body.description).toBe(firstProduct.description);
});

test("GET id doesnt exist /api/products/:productId", async () => {
    const response = await request(app).get(`/api/products/6006b4525f1f0820421da345`);
    expect(response.statusCode).toBe(404);
})

test("PUT /api/products", async () => {
    const res = request(app)
                .put('/api/products/'+firstProduct._id)
                .send({ name: "updated name", description: "updated description" });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("updated name");
    expect(res.body.description).toBe("updated description");
})

test("should return 404 on PUT /api/products", async () => {
    const res = await request(app)
                        .put('/api/products/6006b4525f1f0820421da200')
                        .send({ name: "updated name", description: "updated description" });
    expect(res.statusCode).toBe(404);
});

test("DELETE /api/products", async () => {
    const res = await request(app)
                    .delete("/api/products/" + firstProduct._id)
                    .send();
    expect(res.statusCode).toBe(200);
});

test("DELETE id doesnt exist /api/products/:productId", async () => {
    const res = await request(app)
                        .delete("/api/products/" + firstProduct._id)
                        .send();
    expect(res.statusCode).toBe(404);
})
