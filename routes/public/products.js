const express = require("express");
const db = require("../../db/public/db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        //paginação
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const results = await db.selectProducts(page, limit);

        return res.json(results);
    } catch {
        return response = {
            status: 500,
            message: "Erro no servidor, tente novamente"
        }
    }
});

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    try{
        if (isNaN(id) || id <= 0) {
            const response = {
                status: 400,
                message: "Id de produto negativo ou igual a zero, tente outro id"
            }
            return res.status(response.status).json(response);
        }
        
        const results = await db.selectProduct(id);

        return res.status(results.status).json(results);
    } catch (error){
        const response = {
            status: 500,
            message: "Erro no servidor, Produto nao encontrado"
        }
        return res.status(response.status).json(response);
    }
})

router.post("/", async (req, res) => {
    const product = req.body;
    try {

        const newProduct = {
            category_id: product.category_id,
            name: product.name,
            price: product.price,
            stock: product.stock
        }
        const insertNewProduct = await db.insertProduct(newProduct);

        return res.status(insertNewProduct.status).json(insertNewProduct);
    } catch (e) {
        console.log(e);
        const response = {
            status: 500,
            message: "Erro no servidor"
        }
        return res.status(response.status).send(response);
    }
});

router.patch("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const product = req.body;

    try {

        if (isNaN(id) || id <= 0) {
            const response = {
                status: 400,
                message: "Id de produto negativo ou igual a zero, tente outro id"
            }
            return res.status(response.status).json(response);
        }

        const updateProduct = {
            category_id: product.category_id,
            name: product.name,
            price: product.price,
            stock: product.stock
        }

        const update = await db.updateProduct(id, updateProduct);

        return res.status(update.status).json(update);
        
    } catch (error) {
        console.log(error);
        const response = {
            status: 500,
            message: "Erro no servidor, tente novamente!"
        }
        return res.status(response.status).json(response);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = parseInt( req.params.id );

        if (isNaN(id) || id <= 0) {
            const response = {
                status: 400,
                message: "id de produto negativo ou igual a zero, tente outro id"
            }
            return res.status(response.status).json(response);
        }

        const del = await db.deleteProduct(id);

        if ( del.status === 200 ) {
            const response = {message: del.message};
            return res.status(del.status).json(response)

        } else if ( del.status === 404 ) {
            const response = {message: del.message};
            return res.status(del.status).json(response);

        }

    } catch (error) {
        console.log(error);
        const response = {
            status: 500,
            message: "Erro no servidor, tente novamente mais tarde!"
        }
        return res.status(response.status).json(response);
    }
})

module.exports = router;

